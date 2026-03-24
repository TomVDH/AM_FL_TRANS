import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ANALYSIS_DIR = path.join(process.cwd(), 'data', 'analysis');

const ALLOWED_FILES = new Set([
  'speaker-dialogue.csv',
  'speaker-dutch-dialogue.csv',
  'speaker-styles.json',
  'speaker-dutch-styles.json',
  'speaker-corpus.jsonl',
]);

interface SpeakerSummary {
  speaker: string;
  count: number;
  episodes: string[];
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current); current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get('file');

  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: `Invalid file. Allowed: ${[...ALLOWED_FILES].join(', ')}` }, { status: 400 });
  }

  try {
    const filePath = path.join(ANALYSIS_DIR, file);
    const content = await fs.readFile(filePath, 'utf8');

    // CSV dialogue files → speaker summary table
    if (file.endsWith('.csv')) {
      const lines = content.split('\n');
      const speakers: Record<string, { count: number; episodes: Set<string> }> = {};
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const fields = parseCSVLine(line);
        const [speaker, episode] = fields;
        if (!speaker) continue;
        if (!speakers[speaker]) speakers[speaker] = { count: 0, episodes: new Set() };
        speakers[speaker].count++;
        if (episode) speakers[speaker].episodes.add(episode);
      }

      const sorted: SpeakerSummary[] = Object.entries(speakers)
        .map(([speaker, data]) => ({ speaker, count: data.count, episodes: [...data.episodes].sort() }))
        .sort((a, b) => b.count - a.count);

      return NextResponse.json({
        type: 'dialogue',
        totalLines: lines.length - 1,
        totalSpeakers: sorted.length,
        speakers: sorted,
      });
    }

    // JSON style analysis files → per-speaker profiles
    if (file.endsWith('.json')) {
      try {
        const parsed = JSON.parse(content);
        // These are keyed by speaker name with style analysis inside
        const speakers = Object.entries(parsed).map(([name, data]) => {
          const d = data as Record<string, unknown>;
          return {
            speaker: name,
            lineCount: d.lineCount || d.line_count || 0,
            episodes: d.episodes || [],
            style: d.styleAnalysis || d.dutchStyleAnalysis || d.style || '',
          };
        }).sort((a, b) => (b.lineCount as number) - (a.lineCount as number));

        return NextResponse.json({
          type: 'styles',
          totalSpeakers: speakers.length,
          speakers,
        });
      } catch {
        return NextResponse.json({ type: 'raw', content });
      }
    }

    // JSONL corpus → speaker summary with sample pairs
    if (file.endsWith('.jsonl')) {
      const lines = content.trim().split('\n').filter(Boolean);
      const bySpeaker: Record<string, { english: string; dutch: string }[]> = {};
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (!bySpeaker[entry.speaker]) bySpeaker[entry.speaker] = [];
          bySpeaker[entry.speaker].push({ english: entry.english, dutch: entry.dutch });
        } catch { /* skip malformed */ }
      }

      const speakers = Object.entries(bySpeaker)
        .map(([speaker, entries]) => ({
          speaker,
          count: entries.length,
          samples: entries.slice(0, 3),
        }))
        .sort((a, b) => b.count - a.count);

      return NextResponse.json({
        type: 'corpus',
        totalEntries: lines.length,
        totalSpeakers: speakers.length,
        speakers,
      });
    }

    return NextResponse.json({ type: 'raw', content });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
