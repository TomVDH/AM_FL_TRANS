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

    // For JSONL corpus: group by speaker, show counts + sample lines
    if (file.endsWith('.jsonl')) {
      try {
        const lines = content.trim().split('\n').filter(Boolean);
        const bySpeaker: Record<string, { english: string; dutch: string }[]> = {};
        for (const line of lines) {
          const entry = JSON.parse(line);
          if (!bySpeaker[entry.speaker]) bySpeaker[entry.speaker] = [];
          bySpeaker[entry.speaker].push({ english: entry.english, dutch: entry.dutch });
        }

        const sorted = Object.entries(bySpeaker).sort((a, b) => b[1].length - a[1].length);
        let output = `SPEAKER CORPUS — ${lines.length} entries, ${sorted.length} speakers\n`;
        output += '═'.repeat(60) + '\n\n';

        for (const [speaker, entries] of sorted) {
          output += `▸ ${speaker} (${entries.length} entries)\n`;
          output += '─'.repeat(40) + '\n';
          // Show up to 5 samples
          const samples = entries.slice(0, 5);
          for (const s of samples) {
            output += `  EN: ${s.english}\n`;
            output += `  NL: ${s.dutch}\n\n`;
          }
          if (entries.length > 5) {
            output += `  ... and ${entries.length - 5} more\n\n`;
          }
        }

        return new NextResponse(output, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      } catch {
        // Fall through to raw
      }
    }

    // For CSV: show first 50 lines + total count
    if (file.endsWith('.csv')) {
      const lines = content.split('\n');
      const total = lines.length - 1; // minus header
      const preview = lines.slice(0, 51).join('\n');
      const suffix = total > 50 ? `\n\n... and ${total - 50} more rows (${total} total)` : '';
      return new NextResponse(preview + suffix, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new NextResponse('File not found', { status: 404 });
  }
}
