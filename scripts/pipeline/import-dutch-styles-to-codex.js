/**
 * import-dutch-styles-to-codex.js
 *
 * Reads speaker-dutch-styles.json and patches dutchDialogueStyle into codex CSV + JSON.
 *
 * Run: node scripts/import-dutch-styles-to-codex.js          (preview)
 *      node scripts/import-dutch-styles-to-codex.js --apply   (update files)
 *      node scripts/import-dutch-styles-to-codex.js --overwrite --apply  (replace existing)
 */
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const STYLES_FILE = path.join(PROJECT_ROOT, 'data', 'analysis', 'speaker-dutch-styles.json');
const CSV_PATH = path.join(PROJECT_ROOT, 'data', 'csv', 'codex_translations.csv');
const JSON_PATH = path.join(PROJECT_ROOT, 'data', 'json', 'codex_translations.json');

const APPLY = process.argv.includes('--apply');
const OVERWRITE = process.argv.includes('--overwrite');

const styles = JSON.parse(fs.readFileSync(STYLES_FILE, 'utf8'));
const codex = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const matches = [];
const noMatch = [];

for (const [speakerName, data] of Object.entries(styles)) {
  if (data.error || !data.dutchStyleAnalysis) continue;

  let entry = codex.entries.find(e =>
    e.category === 'CHARACTER' && e.english === speakerName
  );

  if (!entry) {
    entry = codex.entries.find(e =>
      e.category === 'CHARACTER' &&
      e.nicknames && e.nicknames.includes(speakerName)
    );
  }

  if (!entry) {
    entry = codex.entries.find(e =>
      e.category === 'CHARACTER' &&
      (e.english.includes(speakerName) || speakerName.includes(e.english))
    );
  }

  if (entry) {
    const hasExisting = entry.dutchDialogueStyle && entry.dutchDialogueStyle.trim().length > 0;
    matches.push({
      speaker: speakerName,
      codexName: entry.english,
      lineCount: data.lineCount,
      style: data.dutchStyleAnalysis,
      hasExisting,
      existingStyle: entry.dutchDialogueStyle || '',
      willUpdate: !hasExisting || OVERWRITE
    });
  } else {
    noMatch.push({ speaker: speakerName, lineCount: data.lineCount });
  }
}

console.log('=== DUTCH STYLE IMPORT PREVIEW ===\n');
console.log(`Analyzed speakers: ${Object.keys(styles).length}`);
console.log(`Matched to codex: ${matches.length}`);
console.log(`No codex match: ${noMatch.length}`);
console.log(`Will update: ${matches.filter(m => m.willUpdate).length}`);
console.log(`Will skip (existing): ${matches.filter(m => !m.willUpdate).length}`);

console.log('\n--- WILL UPDATE ---');
for (const m of matches.filter(m => m.willUpdate)) {
  console.log(`\n  ${m.codexName} (${m.lineCount} lines)`);
  console.log(`  [NEW]: ${m.style.substring(0, 120)}...`);
}

if (noMatch.length > 0) {
  console.log('\n--- NO CODEX MATCH ---');
  for (const nm of noMatch.sort((a, b) => b.lineCount - a.lineCount)) {
    console.log(`  ${nm.speaker} (${nm.lineCount} lines)`);
  }
}

if (!APPLY) {
  console.log('\n[PREVIEW ONLY] Run with --apply to update codex files.');
  process.exit(0);
}

// Apply updates to JSON
let updateCount = 0;
for (const m of matches.filter(m => m.willUpdate)) {
  const entry = codex.entries.find(e => e.english === m.codexName);
  if (entry) {
    entry.dutchDialogueStyle = m.style;
    updateCount++;
  }
}

// Write JSON
codex.generated = new Date().toISOString();
fs.writeFileSync(JSON_PATH, JSON.stringify(codex, null, 2), 'utf8');

// Rebuild CSV with new column
const csvHeader = 'name,description,english,dutch,category,nicknames,bio,gender,dialogueStyle,dutchDialogueStyle';
const csvRows = [csvHeader];
for (const e of codex.entries) {
  const fields = [
    e.name,
    e.description,
    e.english,
    e.dutch,
    e.category,
    (e.nicknames || []).join(';'),
    e.bio || '',
    e.gender || '',
    e.dialogueStyle || '',
    e.dutchDialogueStyle || ''
  ];
  csvRows.push(fields.map(f => {
    const s = String(f);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }).join(','));
}
fs.writeFileSync(CSV_PATH, csvRows.join('\n'), 'utf8');

console.log(`\n=== APPLIED ===`);
console.log(`Updated ${updateCount} codex entries with dutchDialogueStyle`);
console.log(`Written: ${JSON_PATH}`);
console.log(`Written: ${CSV_PATH}`);
