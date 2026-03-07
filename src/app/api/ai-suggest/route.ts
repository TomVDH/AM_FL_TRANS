import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const CODEX_PATH = path.join(process.cwd(), 'data', 'json', 'codex_translations.json');

interface CodexEntry {
  english: string;
  dutch: string;
  category: string;
  nicknames?: string[];
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
  dutchDialogueStyle?: string;
}

interface SurroundingLine {
  speaker?: string;
  text: string;
}

type ModelTier = 'haiku' | 'sonnet' | 'opus';

const MODEL_MAP: Record<ModelTier, { id: string; maxTokens: number }> = {
  haiku: { id: 'claude-haiku-4-5-20251001', maxTokens: 200 },
  sonnet: { id: 'claude-sonnet-4-6', maxTokens: 300 },
  opus: { id: 'claude-opus-4-6', maxTokens: 400 },
};

interface SuggestRequest {
  english: string;
  speaker: string;
  context: string;
  existingTranslation?: string;
  linesBefore?: SurroundingLine[];
  linesAfter?: SurroundingLine[];
  model?: ModelTier;
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
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 500 }
    );
  }

  let body: SuggestRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { english, speaker, context, existingTranslation, linesBefore, linesAfter, model: requestedModel } = body;
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
    if (charEntry.dialogueStyle) contextParts.push(`English speech style:\n${charEntry.dialogueStyle}`);
    if (charEntry.dutchDialogueStyle) contextParts.push(`Dutch translation style:\n${charEntry.dutchDialogueStyle}`);
    if (charEntry.bio) contextParts.push(`Bio: ${charEntry.bio}`);
  } else if (speaker) {
    contextParts.push(`Speaker: ${speaker}`);
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

  const prompt = `You are translating dialogue for "Asses & Masses" (Dutch: "Ezels & Massa's"), an animated series about donkeys in an allegorical society. Translate the following English dialogue line into Dutch.

${contextParts.length > 0 ? contextParts.join('\n\n') + '\n\n' : ''}English: "${english}"

Provide ONLY the Dutch translation. No explanation, no alternatives, no quotes around the result. Match the character's established Dutch voice and register. Preserve tone, humor, and any verbal tics. If the line contains sound effects (like *cough* or *sigh*), keep them as-is or use the Dutch equivalent.`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: modelId,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    });

    const suggestion = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : '';

    return NextResponse.json({ suggestion, model: modelTier });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('AI suggest error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
