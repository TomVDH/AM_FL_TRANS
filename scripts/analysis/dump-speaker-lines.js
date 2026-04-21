#!/usr/bin/env node

/**
 * dump-speaker-lines.js
 *
 * Dump every EN+NL line spoken by a given utterer — console by default,
 * optional CSV export. Reads from the pre-extracted corpus at
 * data/analysis/all-dialogue.jsonl (3000+ lines across all 11 episodes)
 * so it runs instantly; no Excel parsing.
 *
 * USAGE
 *   node scripts/analysis/dump-speaker-lines.js --speaker="Bad Ass"
 *   node scripts/analysis/dump-speaker-lines.js --speaker="bad"                # fuzzy match
 *   node scripts/analysis/dump-speaker-lines.js --speaker="Bad Ass" --csv      # writes CSV next to corpus
 *   node scripts/analysis/dump-speaker-lines.js --speaker="Bad Ass" --csv=/tmp/bad.csv
 *   node scripts/analysis/dump-speaker-lines.js --list                         # list every speaker + line count
 *   node scripts/analysis/dump-speaker-lines.js --all --csv                    # dump every speaker to by-speaker/*.csv
 *   node scripts/analysis/dump-speaker-lines.js --speaker="Bad Ass" --quiet    # CSV only, no stdout chatter
 *
 * OUTPUT (console, default)
 *   Header with speaker summary (line count, episode count, sheet list).
 *   Lines grouped by episode → sheet, each as:
 *     [<row>] EN: <english>
 *              NL: <dutch>
 *
 * OUTPUT (CSV)
 *   Columns: index,episode,sheet,speaker,english,dutch
 *   Saved to data/analysis/by-speaker/<safe-speaker-name>.csv
 *   unless --csv=<path> is given.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const CORPUS_PATH = path.join(PROJECT_ROOT, 'data', 'analysis', 'all-dialogue.jsonl');
const DEFAULT_CSV_DIR = path.join(PROJECT_ROOT, 'data', 'analysis', 'by-speaker');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { speaker: null, list: false, all: false, csv: false, csvPath: null, quiet: false };
  for (const raw of argv.slice(2)) {
    if (raw === '--list') args.list = true;
    else if (raw === '--all') args.all = true;
    else if (raw === '--quiet' || raw === '-q') args.quiet = true;
    else if (raw === '--csv') args.csv = true;
    else if (raw.startsWith('--csv=')) { args.csv = true; args.csvPath = raw.slice('--csv='.length); }
    else if (raw.startsWith('--speaker=')) args.speaker = raw.slice('--speaker='.length);
    else if (raw === '--help' || raw === '-h') { printHelp(); process.exit(0); }
    else if (!raw.startsWith('--') && !args.speaker) args.speaker = raw;
    else { console.error(`[dump-speaker] Unknown arg: ${raw}`); process.exit(2); }
  }
  return args;
}

function printHelp() {
  console.log(`dump-speaker-lines — raw EN+NL line dump per utterer

  --speaker=<name>   Filter to one speaker. Fuzzy: case-insensitive,
                     substring match, first-match wins.
  --csv              Also write a CSV to data/analysis/by-speaker/<name>.csv
  --csv=<path>       Write CSV to a specific path (implies --csv).
  --list             List every distinct speaker with their line count.
  --all              Dump every speaker. Combine with --csv to write
                     one CSV per speaker into data/analysis/by-speaker/.
  --quiet, -q        Suppress stdout dialogue rendering (useful with --csv).
  --help, -h         This message.`);
}

// ---------------------------------------------------------------------------
// Corpus loading
// ---------------------------------------------------------------------------

function loadCorpus() {
  if (!fs.existsSync(CORPUS_PATH)) {
    console.error(`[dump-speaker] Corpus missing: ${CORPUS_PATH}`);
    console.error(`[dump-speaker] Run: python3 scripts/analysis/generate-character-profiles.py first (re-extracts all-dialogue.jsonl)`);
    process.exit(1);
  }
  const raw = fs.readFileSync(CORPUS_PATH, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  return lines.map((l, i) => {
    try { return JSON.parse(l); }
    catch (e) {
      console.error(`[dump-speaker] Skipping malformed JSONL at line ${i + 1}: ${e.message}`);
      return null;
    }
  }).filter(Boolean);
}

function normaliseSpeakerKey(s) {
  return (s || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function resolveSpeaker(all, query) {
  const q = normaliseSpeakerKey(query);
  // 1. Exact match (case-insensitive)
  const exact = all.find(s => normaliseSpeakerKey(s) === q);
  if (exact) return exact;
  // 2. Substring match
  const substr = all.find(s => normaliseSpeakerKey(s).includes(q));
  if (substr) return substr;
  return null;
}

function groupByEpisodeAndSheet(entries) {
  const byEp = new Map();
  for (const e of entries) {
    const ep = e.episode || '?';
    const sheet = e.sheet || '?';
    if (!byEp.has(ep)) byEp.set(ep, new Map());
    const bySheet = byEp.get(ep);
    if (!bySheet.has(sheet)) bySheet.set(sheet, []);
    bySheet.get(sheet).push(e);
  }
  return byEp;
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

function csvEscape(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  // Quote if contains comma, quote, newline, CR
  if (/[",\r\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function writeCsv(entries, speakerName, outPath) {
  const header = ['index', 'episode', 'sheet', 'speaker', 'english', 'dutch'];
  const rows = entries.map((e, i) => [
    i + 1,
    e.episode || '',
    e.sheet || '',
    e.speaker || speakerName,
    e.english || '',
    e.dutch || '',
  ].map(csvEscape).join(','));
  const body = [header.join(','), ...rows].join('\n') + '\n';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, body, 'utf8');
}

function safeFileName(s) {
  return String(s).replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
}

// ---------------------------------------------------------------------------
// Console rendering
// ---------------------------------------------------------------------------

const C = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

function isTTY() { return process.stdout.isTTY; }
function color(fn, s) { return isTTY() ? fn(s) : s; }

function printSpeakerDump(speakerName, entries) {
  const totalLines = entries.length;
  const episodes = new Set(entries.map(e => e.episode).filter(Boolean));
  const sheets = new Set(entries.map(e => e.sheet).filter(Boolean));
  const translated = entries.filter(e => e.dutch && e.dutch.trim() && e.dutch !== '[BLANK, REMOVE LATER]').length;
  const blank = totalLines - translated;

  console.log();
  console.log(color(C.bold, `=== ${speakerName} ===`));
  console.log(
    color(C.dim, `${totalLines} lines · ${episodes.size} episodes · ${sheets.size} sheets · `) +
    color(C.green, `${translated} translated`) +
    color(C.dim, ` · `) +
    color(C.red, `${blank} blank`)
  );
  console.log();

  const byEp = groupByEpisodeAndSheet(entries);
  const epKeys = [...byEp.keys()].sort((a, b) => {
    const na = parseInt(String(a).replace(/\D/g, '')) || 0;
    const nb = parseInt(String(b).replace(/\D/g, '')) || 0;
    return na - nb || String(a).localeCompare(String(b));
  });

  let idx = 0;
  for (const ep of epKeys) {
    const sheets = byEp.get(ep);
    const sheetKeys = [...sheets.keys()].sort();
    for (const sh of sheetKeys) {
      console.log(color(C.cyan, `── ${ep} · ${sh}`));
      for (const e of sheets.get(sh)) {
        idx++;
        const en = e.english || '';
        const nl = e.dutch || '';
        const isBlank = !nl.trim() || nl === '[BLANK, REMOVE LATER]';
        console.log(`  ${color(C.dim, `[${String(idx).padStart(3, ' ')}]`)} ${color(C.yellow, 'EN:')} ${en}`);
        if (isBlank) {
          console.log(`        ${color(C.red, 'NL:')} ${color(C.dim, '— blank —')}`);
        } else {
          console.log(`        ${color(C.green, 'NL:')} ${nl}`);
        }
      }
      console.log();
    }
  }
}

function printSpeakerList(all) {
  const counts = new Map();
  for (const e of all) {
    const k = e.speaker || '(unknown)';
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const maxName = rows.reduce((m, [n]) => Math.max(m, n.length), 0);
  console.log();
  console.log(color(C.bold, `Speakers in corpus — ${rows.length} distinct`));
  console.log();
  for (const [name, n] of rows) {
    const pad = name.padEnd(maxName + 2, ' ');
    console.log(`  ${pad}${color(C.dim, String(n).padStart(5, ' ') + ' lines')}`);
  }
  console.log();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv);
  const corpus = loadCorpus();
  const allSpeakers = [...new Set(corpus.map(e => e.speaker).filter(Boolean))];

  if (args.list) {
    printSpeakerList(corpus);
    return;
  }

  if (args.all) {
    // Dump every speaker. Require --csv for this mode (otherwise 126 speakers
    // × hundreds of lines would flood the terminal).
    if (!args.csv) {
      console.error(`[dump-speaker] --all without --csv would dump ${allSpeakers.length} speakers to stdout.`);
      console.error(`[dump-speaker] Add --csv to write one file per speaker into ${DEFAULT_CSV_DIR}`);
      process.exit(2);
    }
    let written = 0;
    for (const sp of allSpeakers) {
      const entries = corpus.filter(e => e.speaker === sp);
      const outPath = args.csvPath
        ? path.join(path.dirname(args.csvPath), `${safeFileName(sp)}.csv`)
        : path.join(DEFAULT_CSV_DIR, `${safeFileName(sp)}.csv`);
      writeCsv(entries, sp, outPath);
      if (!args.quiet) {
        console.log(`  ${color(C.green, '✓')} ${sp.padEnd(28, ' ')} ${color(C.dim, String(entries.length).padStart(4))} lines → ${path.relative(PROJECT_ROOT, outPath)}`);
      }
      written++;
    }
    if (!args.quiet) console.log(`\n${color(C.bold, `Wrote ${written} CSV files`)} to ${path.relative(PROJECT_ROOT, args.csvPath ? path.dirname(args.csvPath) : DEFAULT_CSV_DIR)}/`);
    return;
  }

  if (!args.speaker) {
    console.error('[dump-speaker] Missing --speaker=<name>.  Use --list to see all speakers, --help for usage.');
    process.exit(2);
  }

  const resolved = resolveSpeaker(allSpeakers, args.speaker);
  if (!resolved) {
    console.error(`[dump-speaker] No speaker matches "${args.speaker}".`);
    console.error('Closest matches (substring):');
    const q = normaliseSpeakerKey(args.speaker);
    const close = allSpeakers.filter(s => {
      const n = normaliseSpeakerKey(s);
      return n.includes(q.slice(0, 3)) || q.includes(n.slice(0, 3));
    }).slice(0, 10);
    for (const c of close) console.error(`  - ${c}`);
    process.exit(1);
  }

  const entries = corpus.filter(e => e.speaker === resolved);

  if (!args.quiet) {
    printSpeakerDump(resolved, entries);
  }

  if (args.csv) {
    const outPath = args.csvPath || path.join(DEFAULT_CSV_DIR, `${safeFileName(resolved)}.csv`);
    writeCsv(entries, resolved, outPath);
    if (!args.quiet) {
      console.log(color(C.bold, `CSV written: `) + path.relative(PROJECT_ROOT, outPath));
    } else {
      // Quiet mode: print just the path for scripting
      console.log(path.relative(PROJECT_ROOT, outPath));
    }
  }
}

main();
