import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CORPUS_FILE_PATH = path.join(process.cwd(), 'data', 'analysis', 'speaker-corpus.jsonl');

export interface CorpusEntry {
  speaker: string;
  english: string;
  dutch: string;
  sheet?: string;
  file?: string;
  ts: string;
}

/**
 * GET - Query corpus entries by speaker
 * ?speaker=Trusty returns all entries for that speaker
 */
export async function GET(request: NextRequest) {
  try {
    const speaker = request.nextUrl.searchParams.get('speaker');

    if (!fs.existsSync(CORPUS_FILE_PATH)) {
      return NextResponse.json({ entries: [], count: 0 });
    }

    const content = fs.readFileSync(CORPUS_FILE_PATH, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.trim());

    let entries: CorpusEntry[] = [];
    for (const line of lines) {
      try {
        entries.push(JSON.parse(line));
      } catch {
        // Skip malformed lines
      }
    }

    // Filter by speaker if specified
    if (speaker) {
      entries = entries.filter(e => e.speaker.toLowerCase() === speaker.toLowerCase());
    }

    return NextResponse.json({ entries, count: entries.length });
  } catch (error) {
    console.error('Error reading speaker corpus:', error);
    return NextResponse.json(
      { error: 'Failed to read speaker corpus' },
      { status: 500 }
    );
  }
}

/**
 * POST - Batch append entries to the corpus
 * Deduplicates by {speaker, english} — skips if same pair already exists
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entries } = body as { entries: Array<{ speaker: string; english: string; dutch: string; sheet?: string; file?: string }> };

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: entries (non-empty array)' },
        { status: 400 }
      );
    }

    // Ensure directory exists
    const dir = path.dirname(CORPUS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Build dedup set from existing entries
    const existing = new Set<string>();
    if (fs.existsSync(CORPUS_FILE_PATH)) {
      const content = fs.readFileSync(CORPUS_FILE_PATH, 'utf-8');
      for (const line of content.trim().split('\n').filter(l => l.trim())) {
        try {
          const e = JSON.parse(line) as CorpusEntry;
          existing.add(`${e.speaker.toLowerCase()}::${e.english}`);
        } catch {
          // Skip malformed
        }
      }
    }

    // Append new unique entries
    let added = 0;
    let skipped = 0;
    const ts = new Date().toISOString();
    const newLines: string[] = [];

    // Filter out game-engine labels that are not character speakers
    const noisePattern = /^(MENU|WRITE|CHOICE|NARR)\./;

    for (const entry of entries) {
      if (!entry.speaker || !entry.english || !entry.dutch) {
        skipped++;
        continue;
      }

      // Skip game-engine menu/narration labels
      if (noisePattern.test(entry.speaker)) {
        skipped++;
        continue;
      }

      const key = `${entry.speaker.toLowerCase()}::${entry.english}`;
      if (existing.has(key)) {
        skipped++;
        continue;
      }

      existing.add(key);
      const corpusEntry: CorpusEntry = {
        speaker: entry.speaker,
        english: entry.english,
        dutch: entry.dutch,
        ...(entry.sheet && { sheet: entry.sheet }),
        ...(entry.file && { file: entry.file }),
        ts,
      };
      newLines.push(JSON.stringify(corpusEntry));
      added++;
    }

    if (newLines.length > 0) {
      fs.appendFileSync(CORPUS_FILE_PATH, newLines.join('\n') + '\n', 'utf-8');
    }

    return NextResponse.json({ added, skipped });
  } catch (error) {
    console.error('Error saving to speaker corpus:', error);
    return NextResponse.json(
      { error: 'Failed to save speaker corpus entries' },
      { status: 500 }
    );
  }
}
