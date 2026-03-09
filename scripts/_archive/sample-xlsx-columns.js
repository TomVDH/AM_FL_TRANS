/**
 * Sample Column A (key) and Column B (description) from xlsx files
 * to understand speaker identification patterns
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_DIR = path.join(__dirname, '..', 'excels');
const files = fs.readdirSync(EXCEL_DIR).filter(f => f.endsWith('.xlsx') && f.match(/^\d+_asses/));

// Collect unique Column B patterns and Column A speaker names
const colB_samples = new Map(); // description -> count
const speakers = new Map();     // speaker name -> { count, episodes: Set, sampleLines: [] }

for (const file of files) {
  const epMatch = file.match(/^(\d+)_/);
  const epLabel = epMatch ? 'E' + epMatch[1] : file;

  const wb = XLSX.readFile(path.join(EXCEL_DIR, file));

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const colA = String(row[0] || '').trim();
      const colB = String(row[1] || '').trim();
      const colC = String(row[2] || '').trim();

      if (!colA || !colC) continue;

      // Track Column B patterns
      if (colB) {
        colB_samples.set(colB, (colB_samples.get(colB) || 0) + 1);
      }

      // Extract speaker from Column A
      const parts = colA.split('.');
      let speaker = null;
      if (parts.length >= 4) {
        speaker = parts[3].trim();
      }

      if (speaker && speaker.length > 1) {
        if (!speakers.has(speaker)) {
          speakers.set(speaker, { count: 0, episodes: new Set(), sampleLines: [] });
        }
        const entry = speakers.get(speaker);
        entry.count++;
        entry.episodes.add(epLabel);
        if (entry.sampleLines.length < 3) {
          entry.sampleLines.push(colC.substring(0, 80));
        }
      }
    }
  }
}

// Report Column B patterns (top 40)
console.log('=== COLUMN B (Description) - Top 40 Most Common ===\n');
const sortedB = [...colB_samples.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
for (const [desc, count] of sortedB) {
  console.log(`  [${String(count).padStart(5)}x]  ${desc}`);
}

console.log('\n=== COLUMN B UNIQUE VALUES: ' + colB_samples.size + ' ===\n');

// Report speakers sorted by line count
console.log('=== SPEAKERS (from Column A) - All with 5+ lines ===\n');
const sortedSpeakers = [...speakers.entries()]
  .sort((a, b) => b[1].count - a[1].count)
  .filter(([_, v]) => v.count >= 5);

console.log(`${'Speaker'.padEnd(30)} ${'Lines'.padStart(6)}  Episodes  Sample`);
console.log('-'.repeat(110));
for (const [name, info] of sortedSpeakers) {
  const eps = [...info.episodes].sort().join(',');
  console.log(`${name.padEnd(30)} ${String(info.count).padStart(6)}  ${eps.padEnd(30)}  "${info.sampleLines[0]}"`);
}

console.log('\n=== TOTAL SPEAKERS: ' + speakers.size + ' ===');
console.log('=== SPEAKERS WITH 5+ LINES: ' + sortedSpeakers.length + ' ===');
console.log('=== TOTAL DIALOGUE LINES: ' + [...speakers.values()].reduce((s, v) => s + v.count, 0) + ' ===');
