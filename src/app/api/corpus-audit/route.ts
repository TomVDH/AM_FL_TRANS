import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const CORPUS_PATH = path.join(process.cwd(), 'data', 'analysis', 'speaker-corpus.jsonl');
const DIALOGUE_CSV_PATH = path.join(process.cwd(), 'data', 'analysis', 'speaker-dutch-dialogue.csv');
const CODEX_PATH = path.join(process.cwd(), 'data', 'json', 'codex_translations.json');

interface DialoguePair {
  speaker: string;
  english: string;
  dutch: string;
  episode?: string;
  sheet?: string;
}

// Cabinet egg: Jonasty — the audit that asks the hard questions
const AUDIT_QUESTIONS = `Based ONLY on the translation pairs provided above, answer each question concisely:

1. CHARACTER IDENTITY: What is this character's name? What language register do they speak in (formal, informal, slang, archaic)?

2. TERMS OF ADDRESS: What nicknames or terms of address does this character use when speaking TO others? List specific examples from the translations.

3. KNOWN BY: Based on context clues, what do other characters seem to call this character? Any nicknames visible in the dialogue?

4. EMOTIONAL TONE: What is the dominant emotional tone across these translations? Is it consistent or does it shift?

5. FLEMISH DENSITY: Rate the Dutch translations' Flemish density: NONE / LIGHT / MODERATE / HEAVY. Cite 2-3 specific examples of Flemish markers (ge/gij, contractions like 'k/'t/da/nie, diminutives with -ke, vocabulary choices) or their absence.

6. PRONOUN FORMS: Which pronoun forms appear in the Dutch translations — ge/gij (Flemish informal), je/jij (standard Dutch informal), u (formal)? Are they consistent?

7. VERBAL TICS: Any repeated phrases, catchphrases, or speech patterns visible across multiple translations?

8. OUTLIERS: Are there any translations that feel inconsistent with the character's overall voice? Quote them and explain why.

9. TOKEN VALUE: If you could only keep 5 of these translation pairs as voice reference for an AI translator, which 5 best capture this character's unique voice? List them by their English source text.

Format your response as JSON with keys: identity, termsOfAddress, knownBy, emotionalTone, flemishDensity, pronounForms, verbalTics, outliers, bestFive. Each value should be a concise string (1-3 sentences max, except bestFive which is an array of english strings).`;

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

async function loadFromCorpus(speakerLower: string): Promise<DialoguePair[]> {
  const raw = await fs.readFile(CORPUS_PATH, 'utf8');
  return raw.trim().split('\n').filter(Boolean).map(line => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter((e): e is DialoguePair => e !== null && e.speaker.toLowerCase() === speakerLower);
}

async function loadFromDialogueCSV(speakerLower: string): Promise<DialoguePair[]> {
  const raw = await fs.readFile(DIALOGUE_CSV_PATH, 'utf8');
  const lines = raw.split('\n');
  // Header: speaker,episode,sheet,context,english,dutch,utterer_key
  const entries: DialoguePair[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const fields = parseCSVLine(line);
    const [speaker, episode, sheet, , english, dutch] = fields;
    if (speaker && english && dutch && speaker.toLowerCase() === speakerLower) {
      entries.push({ speaker, english, dutch, episode, sheet });
    }
  }
  return entries;
}

export async function GET(request: NextRequest) {
  const speaker = request.nextUrl.searchParams.get('speaker');
  // source: "corpus" (curated, default) or "full" (all dialogue from CSV)
  const source = request.nextUrl.searchParams.get('source') || 'corpus';

  if (!speaker) {
    return NextResponse.json({ error: 'speaker query param is required' }, { status: 400 });
  }

  try {
    const speakerLower = speaker.toLowerCase();

    // Load entries from selected source
    const entries = source === 'full'
      ? await loadFromDialogueCSV(speakerLower)
      : await loadFromCorpus(speakerLower);

    if (entries.length === 0) {
      return NextResponse.json({
        speaker,
        source,
        entryCount: 0,
        error: `No entries found for "${speaker}" in ${source === 'full' ? 'dialogue CSV' : 'corpus'}`,
      });
    }

    // Load codex for cross-reference
    let codexStyle = '';
    let codexDutchStyle = '';
    let codexBio = '';
    try {
      const codexRaw = await fs.readFile(CODEX_PATH, 'utf8');
      const codex = JSON.parse(codexRaw);
      const entry = codex.entries?.find((e: { name: string; english?: string }) =>
        e.name.toLowerCase() === speakerLower ||
        e.english?.toLowerCase() === speakerLower
      );
      if (entry) {
        codexStyle = entry.dialogueStyle || '';
        codexDutchStyle = entry.dutchDialogueStyle || '';
        codexBio = entry.bio || '';
      }
    } catch {
      // Codex not available
    }

    // For full CSV with many lines, sample evenly across episodes to stay within token budget
    let sampled = entries;
    if (entries.length > 60) {
      const byEpisode = new Map<string, DialoguePair[]>();
      for (const e of entries) {
        const ep = e.episode || 'unknown';
        if (!byEpisode.has(ep)) byEpisode.set(ep, []);
        byEpisode.get(ep)!.push(e);
      }
      sampled = [];
      const perEp = Math.max(1, Math.ceil(60 / byEpisode.size));
      for (const [, epEntries] of [...byEpisode.entries()].sort()) {
        const step = Math.max(1, Math.floor(epEntries.length / perEp));
        for (let i = 0; i < epEntries.length && sampled.length < 60; i += step) {
          sampled.push(epEntries[i]);
        }
      }
    }

    // Build dialogue block
    const dialoguePairs = sampled
      .map(e => {
        const prefix = e.episode ? `[${e.episode}] ` : '';
        return `${prefix}EN: ${e.english}\nNL: ${e.dutch}`;
      })
      .join('\n\n');

    const codexContext = [
      codexBio && `Bio: ${codexBio}`,
      codexStyle && `English style profile: ${codexStyle.substring(0, 500)}`,
      codexDutchStyle && `Dutch style profile: ${codexDutchStyle.substring(0, 500)}`,
    ].filter(Boolean).join('\n\n');

    // Count episodes
    const episodes = [...new Set(entries.map(e => e.episode).filter(Boolean))].sort();

    const prompt = `You are auditing the translation corpus for the character "${speaker}" from "Asses & Masses" (Dutch: "Ezels & Massa's"), an animated series being translated from English to Flemish-flavored Dutch.

${codexContext ? `CODEX REFERENCE (for cross-checking):\n${codexContext}\n\n` : ''}SOURCE: ${entries.length} EN→NL translation pairs for ${speaker}${episodes.length > 0 ? ` across episodes ${episodes.join(', ')}` : ''} (showing ${sampled.length} samples):

${dialoguePairs}

${AUDIT_QUESTIONS}`;

    const client = new Anthropic();
    const aiResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text : '';

    let audit;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      audit = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: rawText };
    } catch {
      audit = { raw: rawText };
    }

    const uniqueEnglish = new Set(entries.map(e => e.english)).size;
    const uniqueDutch = new Set(entries.map(e => e.dutch)).size;

    return NextResponse.json({
      speaker,
      source,
      entryCount: entries.length,
      sampledCount: sampled.length,
      uniqueEnglish,
      uniqueDutch,
      episodes,
      hasCodexProfile: !!(codexStyle || codexDutchStyle),
      audit,
      tokenEstimate: {
        corpusTokens: Math.ceil(dialoguePairs.length / 4),
        perRequestCost: `~${Math.ceil(dialoguePairs.length / 4)} prompt tokens for ${sampled.length} sampled pairs`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
