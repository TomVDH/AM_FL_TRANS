#!/usr/bin/env node
/**
 * fill-gender-gaps.js
 * Fills empty gender fields in codex_translations.csv by inferring from bio text.
 * Run: node scripts/fill-gender-gaps.js          (preview)
 *      node scripts/fill-gender-gaps.js --apply   (update CSV + rebuild JSON)
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'data', 'csv', 'codex_translations.csv');
const JSON_PATH = path.join(__dirname, '..', 'data', 'json', 'codex_translations.json');
const APPLY = process.argv.includes('--apply');

// Read CSV
const csvRaw = fs.readFileSync(CSV_PATH, 'utf8');
const lines = csvRaw.split('\n');
const header = lines[0];

// Parse CSV (respecting quoted fields)
function parseCSVLine(line) {
  const fields = [];
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

function inferGender(bio) {
  if (!bio) return null;
  const lower = bio.toLowerCase();

  // Explicit gender markers (highest confidence)
  if (/\bfemale\b/.test(lower)) return 'female';
  if (/\bmale\b/.test(lower)) return 'male';

  // Count pronoun signals in first two sentences (most reliable)
  // Look at the first sentence or two to determine the SUBJECT's gender
  const firstPart = lower.split('.').slice(0, 3).join('.');
  const malePronouns = (firstPart.match(/\b(he |he's|his )\b/g) || []).length;
  const femalePronouns = (firstPart.match(/\b(she |she's|her )\b/g) || []).length;

  if (malePronouns > femalePronouns) return 'male';
  if (femalePronouns > malePronouns) return 'female';

  // Fallback to role words across full bio
  if (/\b(woman|mother|grandmother|granddaughter|girl|jenny|jennets)\b/.test(lower)) return 'female';
  if (/\b(man |boy |father|grandfather|grandson|brother)\b/.test(lower)) return 'male';

  return null;
}

// Reassemble multiline CSV records (quoted fields can span lines)
function assembleRecords(lines) {
  const records = [];
  let current = '';
  let inQuotes = false;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!current && !line.trim()) {
      records.push({ raw: line, isEmpty: true });
      continue;
    }
    current = current ? current + '\n' + line : line;
    // Count unescaped quotes to track state
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') {
        if (inQuotes && line[j + 1] === '"') { j++; continue; }
        inQuotes = !inQuotes;
      }
    }
    if (!inQuotes) {
      records.push({ raw: current, isEmpty: false });
      current = '';
    }
  }
  if (current) records.push({ raw: current, isEmpty: false });
  return records;
}

// Process
const updates = [];
const newLines = [header];
const records = assembleRecords(lines);

for (const record of records) {
  if (record.isEmpty) {
    newLines.push(record.raw);
    continue;
  }

  const fields = parseCSVLine(record.raw);
  // CSV columns: name(0), description(1), english(2), dutch(3), category(4), nicknames(5), bio(6), gender(7), dialogueStyle(8)
  const name = fields[0] || '';
  const bio = fields[6] || '';
  const gender = fields[7] || '';

  if (bio && !gender) {
    const inferred = inferGender(bio);
    if (inferred) {
      updates.push({ name, english: fields[2], inferred, bioSnippet: bio.slice(0, 80) });
      if (APPLY) {
        fields[7] = inferred;
        // Rebuild line
        const rebuilt = fields.map(f => {
          if (f.includes(',') || f.includes('"') || f.includes('\n')) {
            return '"' + f.replace(/"/g, '""') + '"';
          }
          return f;
        }).join(',');
        newLines.push(rebuilt);
        continue;
      }
    }
  }
  newLines.push(record.raw);
}

// Report
console.log(`\n=== Gender Gap Fill ===\n`);
if (updates.length === 0) {
  console.log('No gaps to fill — all entries with bios already have gender set.');
} else {
  console.log(`Found ${updates.length} entries to update:\n`);
  updates.forEach(u => {
    console.log(`  ${u.english} → ${u.inferred}  (bio: "${u.bioSnippet}...")`);
  });
}

if (APPLY && updates.length > 0) {
  // Write updated CSV
  fs.writeFileSync(CSV_PATH, newLines.join('\n'), 'utf8');
  console.log(`\n✓ Updated ${CSV_PATH}`);

  // Rebuild JSON from CSV (use assembled records to handle multiline fields)
  const jsonEntries = [];
  const updatedCsv = fs.readFileSync(CSV_PATH, 'utf8');
  const updatedRecords = assembleRecords(updatedCsv.split('\n'));
  for (const rec of updatedRecords) {
    if (rec.isEmpty) continue;
    const f = parseCSVLine(rec.raw);
    jsonEntries.push({
      name: f[0] || '',
      description: f[1] || '',
      english: f[2] || '',
      dutch: f[3] || '',
      category: f[4] || '',
      nicknames: (f[5] || '').split(';').map(s => s.trim()).filter(Boolean),
      bio: f[6] || '',
      gender: f[7] || '',
      dialogueStyle: f[8] || '',
    });
  }

  const jsonOut = {
    version: '2.0',
    generated: new Date().toISOString(),
    description: 'Codex translations for Asses & Masses',
    totalEntries: jsonEntries.length,
    entries: jsonEntries,
  };

  fs.writeFileSync(JSON_PATH, JSON.stringify(jsonOut, null, 2) + '\n', 'utf8');
  console.log(`✓ Rebuilt ${JSON_PATH} (${jsonEntries.length} entries)`);
} else if (!APPLY && updates.length > 0) {
  console.log(`\nRun with --apply to update files.`);
}
