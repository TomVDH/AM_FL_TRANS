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
  category: string;
  nicknames?: string[];
  bio?: string;
  gender?: string;
  // Voice profile fields
  flemishDensity?: string;
  register?: string;
  pronounForm?: string;
  contractions?: string;
  verbalTics?: string;
  dynamics?: string;
  relationships?: string;
  note?: string;
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
    contextParts.push(`Speaker character: ${charEntry.english} (Dutch name: ${charEntry.dutch || 'same'})`);
    if (charEntry.gender) contextParts.push(`Gender: ${charEntry.gender}`);

    // Structured voice profile header (verified main cast)
    if (charEntry.flemishDensity || charEntry.register || charEntry.pronounForm) {
      const headerLines: string[] = [];
      headerLines.push('CHARACTER VOICE PROFILE:');
      if (charEntry.flemishDensity) headerLines.push(`  Flemish density: ${charEntry.flemishDensity}`);
      if (charEntry.register) headerLines.push(`  Register: ${charEntry.register}`);
      if (charEntry.pronounForm) headerLines.push(`  Pronoun form: ${charEntry.pronounForm}`);
      if (charEntry.contractions && charEntry.contractions !== 'none') headerLines.push(`  Contractions: ${charEntry.contractions}`);
      if (charEntry.verbalTics) headerLines.push(`  Verbal tics: ${charEntry.verbalTics}`);
      if (charEntry.dynamics) headerLines.push(`  Dynamics: ${charEntry.dynamics}`);
      if (charEntry.note) headerLines.push(`  Note: ${charEntry.note}`);
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
  const otherEntries = referencedEntries.filter(e => e !== charEntry);
  if (otherEntries.length > 0) {
    const codexRef = otherEntries.map(e => {
      const parts = [`${e.english} → ${e.dutch}`];
      if (e.category) parts.push(`(${e.category.toLowerCase()})`);
      if (e.gender) parts.push(`[${e.gender}]`);
      return parts.join(' ');
    }).join('\n');
    contextParts.push(`Referenced terms/characters:\n${codexRef}`);
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

OUTPUT RULES:
- Output ONLY the Dutch translation wrapped in <translation> tags
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

  userParts.push(`THE LINE TO TRANSLATE:\n"${english}"`);
  userParts.push('<translation>your Dutch translation here</translation>');

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
    const suggestion = tagMatch ? tagMatch[1].trim() : rawText.replace(/<\/?translation>/g, '').trim();

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
