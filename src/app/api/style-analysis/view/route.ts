import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ANALYSIS_DIR = path.join(process.cwd(), 'data', 'analysis');

// Allowlist of files that can be viewed
const ALLOWED_FILES = new Set([
  'speaker-dialogue.csv',
  'speaker-dutch-dialogue.csv',
  'speaker-styles.json',
  'speaker-dutch-styles.json',
  'speaker-corpus.jsonl',
]);

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get('file');

  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: `Invalid file. Allowed: ${[...ALLOWED_FILES].join(', ')}` }, { status: 400 });
  }

  try {
    const filePath = path.join(ANALYSIS_DIR, file);
    const content = await fs.readFile(filePath, 'utf8');

    // For JSON files, pretty-print
    if (file.endsWith('.json')) {
      try {
        const parsed = JSON.parse(content);
        return new NextResponse(JSON.stringify(parsed, null, 2), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      } catch {
        // Fall through to raw
      }
    }

    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new NextResponse('File not found', { status: 404 });
  }
}
