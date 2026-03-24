import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const CORPUS_PATH = path.join(process.cwd(), 'data', 'analysis', 'speaker-corpus.jsonl');
const CODEX_PATH = path.join(process.cwd(), 'data', 'json', 'codex_translations.json');

interface CorpusEntry {
  speaker: string;
  english: string;
  dutch: string;
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

export async function GET(request: NextRequest) {
  const speaker = request.nextUrl.searchParams.get('speaker');

  if (!speaker) {
    return NextResponse.json({ error: 'speaker query param is required' }, { status: 400 });
  }

  try {
    // Load corpus entries for this speaker
    const raw = await fs.readFile(CORPUS_PATH, 'utf8');
    const allEntries: CorpusEntry[] = raw.trim().split('\n').filter(Boolean).map(line => {
      try { return JSON.parse(line); } catch { return null; }
    }).filter(Boolean);

    const speakerLower = speaker.toLowerCase();
    const entries = allEntries.filter(e => e.speaker.toLowerCase() === speakerLower);

    if (entries.length === 0) {
      return NextResponse.json({
        speaker,
        entryCount: 0,
        error: `No corpus entries found for "${speaker}"`,
      });
    }

    // Load codex for cross-reference (style profile)
    let codexStyle = '';
    let codexDutchStyle = '';
    let codexBio = '';
    try {
      const codexRaw = await fs.readFile(CODEX_PATH, 'utf8');
      const codex = JSON.parse(codexRaw);
      const entry = codex.entries?.find((e: { name: string }) =>
        e.name.toLowerCase() === speakerLower ||
        e.english?.toLowerCase() === speakerLower
      );
      if (entry) {
        codexStyle = entry.dialogueStyle || '';
        codexDutchStyle = entry.dutchDialogueStyle || '';
        codexBio = entry.bio || '';
      }
    } catch {
      // Codex not available — proceed without it
    }

    // Build the prompt
    const dialoguePairs = entries
      .map(e => `EN: ${e.english}\nNL: ${e.dutch}`)
      .join('\n\n');

    const codexContext = [
      codexBio && `Bio: ${codexBio}`,
      codexStyle && `English style profile: ${codexStyle.substring(0, 500)}`,
      codexDutchStyle && `Dutch style profile: ${codexDutchStyle.substring(0, 500)}`,
    ].filter(Boolean).join('\n\n');

    const prompt = `You are auditing the translation corpus for the character "${speaker}" from "Asses & Masses" (Dutch: "Ezels & Massa's"), an animated series being translated from English to Flemish-flavored Dutch.

${codexContext ? `CODEX REFERENCE (for cross-checking):\n${codexContext}\n\n` : ''}CORPUS: ${entries.length} approved EN→NL translation pairs for ${speaker}:

${dialoguePairs}

${AUDIT_QUESTIONS}`;

    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-haiku-4-20250414',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Try to parse as JSON, fall back to raw text
    let audit;
    try {
      // Extract JSON from potential markdown code fences
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      audit = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: rawText };
    } catch {
      audit = { raw: rawText };
    }

    return NextResponse.json({
      speaker,
      entryCount: entries.length,
      hasCodexProfile: !!(codexStyle || codexDutchStyle),
      audit,
      tokenEstimate: {
        corpusTokens: Math.ceil(dialoguePairs.length / 4),
        perRequestCost: `~${Math.ceil(entries.length * 30 / 4)} tokens if all ${entries.length} were injected (currently capped at 15)`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
