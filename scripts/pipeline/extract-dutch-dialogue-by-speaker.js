/**
 * extract-dutch-dialogue-by-speaker.js
 *
 * Extracts all Dutch dialogue lines from xlsx files, grouped by speaker.
 * Dutch is in column index 9 (NL).
 * Only includes rows that have both English (col 2) and Dutch (col 9) text.
 *
 * Outputs: data/analysis/speaker-dutch-dialogue.csv
 *
 * Run: node scripts/extract-dutch-dialogue-by-speaker.js
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_DIR = path.join(__dirname, '..', 'excels');
const OUT_DIR = path.join(__dirname, '..', 'data', 'analysis');
const OUT_FILE = path.join(OUT_DIR, 'speaker-dutch-dialogue.csv');

const NL_COL = 9; // Column index for Dutch
const EN_COL = 2; // Column index for English (Standard)

const files = fs.readdirSync(EXCEL_DIR)
  .filter(f => f.endsWith('.xlsx') && f.match(/^\d+_asses/))
  .sort((a, b) => {
    const na = parseInt(a.match(/^(\d+)/)[1]);
    const nb = parseInt(b.match(/^(\d+)/)[1]);
    return na - nb;
  });

const rows = [];

for (const file of files) {
  const epMatch = file.match(/^(\d+)_/);
  const episode = epMatch ? 'E' + epMatch[1] : file;

  const wb = XLSX.readFile(path.join(EXCEL_DIR, file));

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const colA = String(row[0] || '').trim();
      const colB = String(row[1] || '').trim();
      const english = String(row[EN_COL] || '').trim();
      const dutch = String(row[NL_COL] || '').trim();

      if (!colA || !english || !dutch) continue;

      const parts = colA.split('.');
      let speaker = null;
      if (parts.length >= 4) {
        speaker = parts[3].trim();
      }

      if (speaker && speaker.length > 1) {
        rows.push({
          speaker,
          episode,
          sheet: sheetName,
          context: colB,
          english,
          dutch,
          uttererKey: colA
        });
      }
    }
  }
}

rows.sort((a, b) => {
  const cmp = a.speaker.localeCompare(b.speaker);
  if (cmp !== 0) return cmp;
  const ea = parseInt(a.episode.replace('E', ''));
  const eb = parseInt(b.episode.replace('E', ''));
  return ea - eb;
});

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function csvEscape(val) {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

const csvLines = ['speaker,episode,sheet,context,english,dutch,utterer_key'];
for (const r of rows) {
  csvLines.push([
    csvEscape(r.speaker),
    csvEscape(r.episode),
    csvEscape(r.sheet),
    csvEscape(r.context),
    csvEscape(r.english),
    csvEscape(r.dutch),
    csvEscape(r.uttererKey)
  ].join(','));
}

fs.writeFileSync(OUT_FILE, csvLines.join('\n'), 'utf8');

const speakers = new Map();
for (const r of rows) {
  if (!speakers.has(r.speaker)) speakers.set(r.speaker, 0);
  speakers.set(r.speaker, speakers.get(r.speaker) + 1);
}
const sorted = [...speakers.entries()].sort((a, b) => b[1] - a[1]);

console.log(`\n=== DUTCH DIALOGUE EXTRACTION COMPLETE ===`);
console.log(`Total dialogue lines (with Dutch): ${rows.length}`);
console.log(`Unique speakers: ${speakers.size}`);
console.log(`Output: ${OUT_FILE}`);
console.log(`\nTop 20 speakers:`);
for (const [name, count] of sorted.slice(0, 20)) {
  console.log(`  ${name.padEnd(30)} ${count} lines`);
}
