import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MEMORY_FILE_PATH = path.join(process.cwd(), 'data', 'translation-memory.jsonl');

export interface MemoryEntry {
  source: string;
  translation: string;
  file?: string;
  sheet?: string;
  row?: number;
  ts: string;
}

/**
 * GET - Read all translation memory entries
 * Returns entries grouped by source text, most recent first
 */
export async function GET() {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(MEMORY_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // If file doesn't exist, return empty array
    if (!fs.existsSync(MEMORY_FILE_PATH)) {
      return NextResponse.json({ entries: [], count: 0 });
    }

    // Read JSONL file (one JSON object per line)
    const content = fs.readFileSync(MEMORY_FILE_PATH, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.trim());

    const entries: MemoryEntry[] = [];
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        entries.push(entry);
      } catch {
        // Skip malformed lines
        console.warn('Skipping malformed line in translation-memory.jsonl');
      }
    }

    // Sort by timestamp, most recent first
    entries.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

    return NextResponse.json({
      entries,
      count: entries.length,
    });
  } catch (error) {
    console.error('Error reading translation memory:', error);
    return NextResponse.json(
      { error: 'Failed to read translation memory' },
      { status: 500 }
    );
  }
}

/**
 * POST - Add a new translation memory entry
 * Appends to the JSONL file
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, translation, file, sheet, row } = body;

    // Validate required fields
    if (!source || !translation) {
      return NextResponse.json(
        { error: 'Missing required fields: source, translation' },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    const dataDir = path.dirname(MEMORY_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create memory entry with timestamp
    const entry: MemoryEntry = {
      source: source.trim(),
      translation: translation.trim(),
      ts: new Date().toISOString(),
    };

    // Add optional fields if provided
    if (file) entry.file = file;
    if (sheet) entry.sheet = sheet;
    if (row !== undefined) entry.row = row;

    // Append to JSONL file (newline-delimited JSON)
    const line = JSON.stringify(entry) + '\n';
    fs.appendFileSync(MEMORY_FILE_PATH, line, 'utf-8');

    return NextResponse.json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error('Error saving to translation memory:', error);
    return NextResponse.json(
      { error: 'Failed to save translation memory entry' },
      { status: 500 }
    );
  }
}
