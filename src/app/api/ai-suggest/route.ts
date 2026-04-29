import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const CODEX_PATH = path.join(process.cwd(), 'data', 'json', 'codex_translations.json');
const CORPUS_PATH = path.join(process.cwd(), 'data', 'analysis', 'speaker-corpus.jsonl');

// Cabinet egg: Sakke — counts requests, drops a header on the 100th
let requestCounter = 0;

interface CorpusEntry {
  speaker: string;
  english: string;
  dutch: string;
}

let corpusCache: { entries: CorpusEntry[]; loadedAt: number } | null = null;

async function getCorpusForSpeaker(speaker: string, limit = 15): Promise<CorpusEntry[]> {
  // Cache corpus for 60s
  if (!corpusCache || Date.now() - corpusCache.loadedAt > 60000) {
    try {
      const raw = await fs.readFile(CORPUS_PATH, 'utf8');
      const entries: CorpusEntry[] = raw.trim().split('\n').filter(Boolean).map(line => {
        try { return JSON.parse(line); } catch { return null; }
      }).filter(Boolean);
      corpusCache = { entries, loadedAt: Date.now() };
    } catch {
      corpusCache = { entries: [], loadedAt: Date.now() };
    }
  }

  const speakerLower = speaker.toLowerCase();
  return corpusCache.entries
    .filter(e => e.speaker.toLowerCase() === speakerLower)
    .slice(-limit); // most recent entries
}

interface CodexEntry {
  english: string;
  dutch: string;
  dutchShort?: string;        // canonical short form (used when EN uses short name — source-mirror rule)
  category: string;
  nicknames?: string[];
  bio?: string;
  gender?: string;
  // Voice profile fields (legacy schema — kept for fallback)
  flemishDensity?: string;
  register?: string;
  pronounForm?: string;
  contractions?: string;
  verbalTics?: string;
  dynamics?: string;
  relationships?: string;
  note?: string;              // DEPRECATED — not rendered into prompt; use editorNote for human annotations
  editorNote?: string;        // human annotation, NOT rendered into prompt
  // Phase-C flat-field schema (structured voice rules — preferred)
  pronounsAllowed?: string[];
  pronounsForbidden?: string[];
  contractionsAllowed?: Array<{ form: string; scope?: string; strictness?: string }>;
  contractionsForbidden?: string[];
  dialectalMarkersAllowed?: string[];
  dialectalMarkersForbidden?: string[];
  articleRule?: string;
  negationRule?: string;
  registerExceptions?: Array<{ scope: string; allows?: string[]; contexts?: string[] }>;
  inboundAddressRules?: Array<{ from_speaker?: string; en_match?: string; nl_required?: string; scope?: string; rationale?: string }>;
  bulkTranslateExclusions?: Array<{ cell: string; note: string }>;
  editorialPass?: Record<string, unknown>;
}

interface SurroundingLine {
  speaker?: string;
  text: string;
}

type ModelTier = 'haiku' | 'sonnet' | 'opus';

const MODEL_MAP: Record<ModelTier, { id: string; maxTokens: number }> = {
  haiku: { id: 'claude-haiku-4-5-20251001', maxTokens: 300 },
  sonnet: { id: 'claude-sonnet-4-6', maxTokens: 400 },
  opus: { id: 'claude-opus-4-6', maxTokens: 500 },
};

interface SuggestRequest {
  english: string;
  speaker: string;
  context: string;
  existingTranslation?: string;
  linesBefore?: SurroundingLine[];
  linesAfter?: SurroundingLine[];
  model?: ModelTier;
  useCorpus?: boolean;
}

/**
 * Strip wrapping quotes from the model's output.
 *
 * Quotes INSIDE the sentence are preserved (reported speech). Only quote
 * characters that wrap the entire line are stripped, and only if the source
 * English wasn't wrapped in the same kind of quote — that way we never lose
 * an intentional outer quote.
 *
 * Handles: " " ' ' " " ' ' « » „ " ‚ ' (straight, curly, guillemets, German).
 * Runs up to 2 passes to catch double-wrapped cases.
 */
function stripWrappingQuotes(out: string, source: string): string {
  const pairs: Array<[string, string[]]> = [
    ['"', ['"']],
    ["'", ["'"]],
    ['\u201C', ['\u201D']],        // " "
    ['\u2018', ['\u2019']],        // ' '
    ['\u00AB', ['\u00BB']],        // « »
    ['\u201E', ['\u201C', '\u201D']], // „ " / „ "
    ['\u201A', ['\u2019', '\u2018']], // ‚ ' / ‚ '
  ];
  const sourceWrapped = (s: string) => {
    const t = s.trim();
    if (t.length < 2) return false;
    for (const [open, closes] of pairs) {
      if (t[0] === open && closes.includes(t[t.length - 1])) return true;
    }
    return false;
  };
  const sourceHadWrap = sourceWrapped(source);
  let current = out.trim();
  for (let pass = 0; pass < 2; pass++) {
    if (current.length < 2) break;
    let stripped = false;
    for (const [open, closes] of pairs) {
      if (current[0] === open && closes.includes(current[current.length - 1])) {
        // Preserve wrapping if source had the same kind of wrap
        if (sourceHadWrap && pass === 0) return current;
        current = current.slice(1, -1).trim();
        stripped = true;
        break;
      }
    }
    if (!stripped) break;
  }
  return current;
}

let codexCache: { entries: CodexEntry[]; loadedAt: number } | null = null;

async function getCodex(): Promise<CodexEntry[]> {
  // Cache codex for 60s to avoid re-reading on every request
  if (codexCache && Date.now() - codexCache.loadedAt < 60000) {
    return codexCache.entries;
  }
  try {
    const raw = await fs.readFile(CODEX_PATH, 'utf8');
    const data = JSON.parse(raw);
    codexCache = { entries: data.entries, loadedAt: Date.now() };
    return data.entries;
  } catch {
    return [];
  }
}

function findCharacterEntry(entries: CodexEntry[], speakerName: string): CodexEntry | undefined {
  // Exact match
  let entry = entries.find(e => e.category === 'CHARACTER' && e.english === speakerName);
  if (entry) return entry;

  // Nickname match
  entry = entries.find(e =>
    e.category === 'CHARACTER' &&
    e.nicknames && e.nicknames.includes(speakerName)
  );
  if (entry) return entry;

  // Partial match
  entry = entries.find(e =>
    e.category === 'CHARACTER' &&
    (e.english.includes(speakerName) || speakerName.includes(e.english))
  );
  return entry;
}

function findRelevantCodexEntries(entries: CodexEntry[], text: string): CodexEntry[] {
  const textLower = text.toLowerCase();
  const found: CodexEntry[] = [];
  const seenEnglish = new Set<string>();

  for (const entry of entries) {
    if (seenEnglish.has(entry.english.toLowerCase())) continue;

    const engLower = entry.english.toLowerCase();
    // Check if entry's english name appears in the text (word boundary aware for 3+ char terms)
    if (engLower.length >= 3 && textLower.includes(engLower)) {
      found.push(entry);
      seenEnglish.add(engLower);
      continue;
    }

    // Check nicknames
    if (entry.nicknames) {
      for (const nick of entry.nicknames) {
        if (nick.length >= 3 && textLower.includes(nick.toLowerCase())) {
          found.push(entry);
          seenEnglish.add(engLower);
          break;
        }
      }
    }
  }

  return found;
}

export async function POST(request: NextRequest) {
  // API key: prefer client-provided (via header), fall back to server env var
  const apiKey = request.headers.get('x-api-key') || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'No API key — enter your Anthropic key in Settings or set ANTHROPIC_API_KEY in .env.local' },
      { status: 401 }
    );
  }

  let body: SuggestRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { english, speaker, context, existingTranslation, linesBefore, linesAfter, model: requestedModel, useCorpus } = body;
  if (!english) {
    return NextResponse.json({ error: 'english text is required' }, { status: 400 });
  }

  const modelTier: ModelTier = requestedModel && MODEL_MAP[requestedModel] ? requestedModel : 'haiku';
  const { id: modelId, maxTokens } = MODEL_MAP[modelTier];

  // Look up character info from codex
  const entries = await getCodex();
  const charEntry = speaker ? findCharacterEntry(entries, speaker) : undefined;

  // Find all codex entries referenced in the text and surrounding lines
  const allText = [
    english,
    ...(linesBefore || []).map(l => l.text),
    ...(linesAfter || []).map(l => l.text),
  ].join(' ');
  const referencedEntries = findRelevantCodexEntries(entries, allText);

  // Build context block
  const contextParts: string[] = [];

  if (charEntry) {
    const dutchFull = charEntry.dutch || 'same';
    const dutchShort = charEntry.dutchShort;
    const speakerHeader = dutchShort
      ? `Speaker character: ${charEntry.english} (Dutch full: ${dutchFull}, Dutch short: ${dutchShort})`
      : `Speaker character: ${charEntry.english} (Dutch name: ${dutchFull})`;
    contextParts.push(speakerHeader);
    if (charEntry.gender) contextParts.push(`Gender: ${charEntry.gender}`);

    // Structured voice profile header (verified main cast)
    if (charEntry.flemishDensity || charEntry.register || charEntry.pronounForm || charEntry.pronounsAllowed) {
      const headerLines: string[] = [];
      headerLines.push('CHARACTER VOICE PROFILE:');
      if (charEntry.flemishDensity) headerLines.push(`  Flemish density: ${charEntry.flemishDensity}`);
      if (charEntry.register) headerLines.push(`  Register: ${charEntry.register}`);

      // Phase-C structured pronoun rules (preferred over legacy pronounForm)
      if (charEntry.pronounsAllowed?.length) {
        headerLines.push(`  Pronouns allowed (use these): ${charEntry.pronounsAllowed.join(', ')}`);
      } else if (charEntry.pronounForm) {
        headerLines.push(`  Pronoun form: ${charEntry.pronounForm}`);
      }
      if (charEntry.pronounsForbidden?.length) {
        headerLines.push(`  Pronouns forbidden (NEVER use): ${charEntry.pronounsForbidden.join(', ')}`);
      }

      // Negation rule (Phase-C)
      if (charEntry.negationRule) {
        headerLines.push(`  Negation: ${charEntry.negationRule}`);
      }

      // Article rule (Phase-C)
      if (charEntry.articleRule) {
        headerLines.push(`  Articles: ${charEntry.articleRule}`);
      }

      // Phase-C structured contraction rules (preferred over legacy contractions)
      if (charEntry.contractionsAllowed?.length) {
        const allowed = charEntry.contractionsAllowed.map(c => c.scope ? `${c.form} (${c.scope})` : c.form).join(', ');
        headerLines.push(`  Contractions allowed: ${allowed}`);
      }
      if (charEntry.contractionsForbidden?.length) {
        headerLines.push(`  Contractions forbidden (NEVER use): ${charEntry.contractionsForbidden.join(', ')}`);
      }
      if (!charEntry.contractionsAllowed && !charEntry.contractionsForbidden && charEntry.contractions && charEntry.contractions !== 'none') {
        headerLines.push(`  Contractions: ${charEntry.contractions}`);
      }

      // Dialectal markers (Phase-C)
      if (charEntry.dialectalMarkersAllowed?.length) {
        headerLines.push(`  Dialectal markers allowed: ${charEntry.dialectalMarkersAllowed.join(', ')}`);
      }
      if (charEntry.dialectalMarkersForbidden?.length) {
        headerLines.push(`  Dialectal markers forbidden: ${charEntry.dialectalMarkersForbidden.join(', ')}`);
      }

      // Register exceptions (Phase-C)
      if (charEntry.registerExceptions?.length) {
        const exceptions = charEntry.registerExceptions.map(re => {
          const allows = re.allows?.length ? ` allows: ${re.allows.join('/')}` : '';
          const ctx = re.contexts?.length ? ` (${re.contexts.join('; ')})` : '';
          return `    - ${re.scope}:${allows}${ctx}`;
        }).join('\n');
        headerLines.push(`  Register exceptions:\n${exceptions}`);
      }

      if (charEntry.verbalTics) headerLines.push(`  Verbal tics: ${charEntry.verbalTics}`);
      if (charEntry.dynamics) headerLines.push(`  Dynamics: ${charEntry.dynamics}`);
      // Note: legacy `note` field is INTENTIONALLY NOT rendered (deprecated). Use editorNote for human annotations only.
      contextParts.push(headerLines.join('\n'));
    }

    if (charEntry.bio) contextParts.push(`Bio: ${charEntry.bio}`);
  } else if (speaker) {
    contextParts.push(`Speaker: ${speaker}`);
  }

  // Add corpus exemplars when requested
  if (useCorpus && speaker) {
    const corpusEntries = await getCorpusForSpeaker(speaker);
    if (corpusEntries.length > 0) {
      // Strip <translation> tags from corpus fields to prevent collision with response extraction regex
      const sanitize = (s: string) => s.replace(/<\/?translation>/g, '');
      const exemplars = corpusEntries.map(e => `EN: ${sanitize(e.english)}\nNL: ${sanitize(e.dutch)}`).join('\n\n');
      contextParts.push(`APPROVED TRANSLATIONS for ${speaker} (use these as voice reference — reinforce these patterns):\n${exemplars}`);
    }
  }

  // Add surrounding dialogue context
  if (linesBefore && linesBefore.length > 0) {
    const beforeLines = linesBefore.map(l =>
      l.speaker ? `[${l.speaker}]: ${l.text}` : l.text
    ).join('\n');
    contextParts.push(`Previous lines:\n${beforeLines}`);
  }

  if (linesAfter && linesAfter.length > 0) {
    const afterLines = linesAfter.map(l =>
      l.speaker ? `[${l.speaker}]: ${l.text}` : l.text
    ).join('\n');
    contextParts.push(`Following lines:\n${afterLines}`);
  }

  // Add referenced codex entries (excluding the speaker, already covered above)
  // Source-mirror rule: render BOTH dutch full AND dutchShort so AI matches EN form to NL form.
  const otherEntries = referencedEntries.filter(e => e !== charEntry);
  if (otherEntries.length > 0) {
    const codexRef = otherEntries.map(e => {
      const dutchPart = e.dutchShort
        ? `${e.dutch} (full) / ${e.dutchShort} (short — use when EN uses '${e.english.replace(/\s+Ass\b/, '')}' without 'Ass')`
        : e.dutch;
      const parts = [`${e.english} → ${dutchPart}`];
      if (e.category) parts.push(`(${e.category.toLowerCase()})`);
      if (e.gender) parts.push(`[${e.gender}]`);
      return parts.join(' ');
    }).join('\n');
    contextParts.push(`Referenced terms/characters (source-mirror rule: when EN uses full name, use Dutch full; when EN uses short, use Dutch short):\n${codexRef}`);
  }

  if (context) {
    contextParts.push(`Scene context: ${context}`);
  }

  if (existingTranslation) {
    contextParts.push(`Current translation (for reference): ${existingTranslation}`);
  }

  // System prompt — persistent voice rules (same for every request)
  const systemPrompt = `You are a professional Flemish Belgian translator for "Asses & Masses" ("Ezels & Massa's"), an animated series about donkeys in an allegorical society.

TRANSLATION VOICE:
You are Flemish Belgian, deliberately chosen to give this Dutch translation a warm Flemish sensibility. The translation must remain fully understandable to Netherlands/Dutch audiences — Flemish is the seasoning, not a barrier. The degree of Flemish flavor varies by character: some speak heavy plat Vlaams (ge/gij, nie, 'k/'t, -ke diminutives, allez, amai), others speak clean standard Dutch, and most fall somewhere in between. This linguistic variation IS characterization — Flemish density reflects social class, community belonging, and personality.

CHARACTER VOICE RULES:
- If a CHARACTER VOICE PROFILE is provided, follow it precisely — flemishDensity, register, pronounForm, and verbalTics define that character's exact voice
- If NO voice profile is provided but the speaker is known, default to light tussentaal with je/jij pronouns — a gentle Flemish middle ground
- Only use heavy Flemish (ge/gij, nie, 'k, plat Vlaams) when the voice profile explicitly calls for it
- Only use pure ABN/standard Dutch when the voice profile explicitly says "zero" density or "ABN" register
- ARTICLE RULE: Flemish dialectal articles like "ne/nen" should ONLY appear for characters with heavy or medium Flemish density. The correct masculine form is "ne" (not "nen" before most nouns). For light/trace/zero characters, use standard "een". When in doubt, omit dialectal articles entirely.
- DE-EMPHASIZE dialectal grammar for most characters. Flemish flavor comes primarily from word choice, exclamations, and sentence rhythm — not from heavy article/pronoun substitution. Reserve ge/gij, nie, ne/nen for characters whose profiles explicitly call for it.

OUTPUT RULES:
- Output ONLY the Dutch translation wrapped in <translation> tags
- NEVER wrap the translation in quotation marks of any kind — not straight ("…"), not curly (“…”), not single ('…' / ‘…’), not guillemets («…»), not low-high German («…»), not any variant. The <translation> tags are the only wrapper. If the source line happens to start or end with a quote character, still do not add wrapping quotes around the translation.
- Preserve quotes that appear INSIDE the line (e.g. a reported sub-quote: EN: He said "no." → NL: Hij zei "nee."). Only the outer wrapping is forbidden.
- No explanation, no commentary, no alternatives, no preamble
- Match the character's established Dutch voice and register
- Preserve tone, humor, wordplay, and verbal tics
- Keep sound effects as-is or use Dutch equivalent (*cough* → *kuch*, *sigh* → *zucht*)
- Translate ONLY the line provided — ignore any similarity to context lines`;

  // User message — per-line context
  const userParts: string[] = [];

  if (contextParts.length > 0) {
    userParts.push(contextParts.join('\n\n'));
  }

  userParts.push(`THE LINE TO TRANSLATE (the text between the === markers is the line itself, without any wrapping quotes):\n===\n${english}\n===`);
  userParts.push('Emit your Dutch translation inside <translation>…</translation>. Do NOT add wrapping quotes of any kind around the translation.');

  const userMessage = userParts.join('\n\n');

  try {
    const client = new Anthropic({ apiKey, timeout: 40_000 }); // 40s timeout
    const apiStart = Date.now();
    console.log(`[AI Suggest API] Calling ${modelId} for: "${english.substring(0, 50)}"...`);

    const response = await client.messages.create({
      model: modelId,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    const apiDuration = ((Date.now() - apiStart) / 1000).toFixed(1);
    console.log(`[AI Suggest API] Response in ${apiDuration}s (${response.usage?.input_tokens || '?'} in / ${response.usage?.output_tokens || '?'} out) — stop: ${response.stop_reason}`);

    const rawText = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : '';

    // Extract from <translation> tags, fall back to raw text
    const tagMatch = rawText.match(/<translation>([\s\S]*?)<\/translation>/);
    const extracted = tagMatch ? tagMatch[1].trim() : rawText.replace(/<\/?translation>/g, '').trim();
    // Strip wrapping quotes the model may have sneaked in (straight, curly, guillemets, …)
    // Preserves INNER quotes and any legitimate wrap that was already in the source.
    const suggestion = stripWrappingQuotes(extracted, english);

    requestCounter++;
    const jsonResp = NextResponse.json({ suggestion, model: modelTier });
    if (requestCounter === 100) jsonResp.headers.set('X-Sakke', 'Honderdste! Pansen op, manneke.');
    return jsonResp;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[AI Suggest API] ERROR after request: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
