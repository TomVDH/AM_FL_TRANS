# Speaker Style Analysis Pipeline — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract all English dialogue from xlsx files grouped by speaker, export to CSV for tonal/style analysis, then feed results back into the codex's `dialogueStyle` field.

**Architecture:** Three-phase pipeline — (1) extraction script reads all 14 xlsx files and dumps every dialogue line grouped by speaker into a structured CSV, (2) analysis script reads the CSV and uses Claude API to generate per-speaker style summaries, (3) import script patches the codex CSV/JSON with new `dialogueStyle` values. Each phase is a standalone Node script in `scripts/`.

**Tech Stack:** Node.js, `xlsx` library (already a dependency), Claude API via `@anthropic-ai/sdk`, existing codex CSV/JSON rebuild pattern from `fill-gender-gaps.js`.

---

## Phase 1: Dialogue Extraction

### Task 1: Create the dialogue extraction script

**Files:**
- Create: `scripts/extract-dialogue-by-speaker.js`

**Step 1: Write the extraction script**

This script reads all numbered xlsx files from `excels/`, extracts Column A (speaker key), Column B (context), Column C (English text), groups by speaker, and writes a CSV to `data/analysis/`.

```js
/**
 * extract-dialogue-by-speaker.js
 *
 * Extracts all dialogue lines from xlsx files, grouped by speaker.
 * Outputs: data/analysis/speaker-dialogue.csv
 *
 * CSV columns: speaker, episode, sheet, context, english, utterer_key
 *
 * Run: node scripts/extract-dialogue-by-speaker.js
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_DIR = path.join(__dirname, '..', 'excels');
const OUT_DIR = path.join(__dirname, '..', 'data', 'analysis');
const OUT_FILE = path.join(OUT_DIR, 'speaker-dialogue.csv');

// Only numbered episode files (0-11)
const files = fs.readdirSync(EXCEL_DIR)
  .filter(f => f.endsWith('.xlsx') && f.match(/^\d+_asses/))
  .sort((a, b) => {
    const na = parseInt(a.match(/^(\d+)/)[1]);
    const nb = parseInt(b.match(/^(\d+)/)[1]);
    return na - nb;
  });

const rows = []; // { speaker, episode, sheet, context, english, uttererKey }

for (const file of files) {
  const epMatch = file.match(/^(\d+)_/);
  const episode = epMatch ? 'E' + epMatch[1] : file;

  const wb = XLSX.readFile(path.join(EXCEL_DIR, file));

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const colA = String(row[0] || '').trim(); // utterer key
      const colB = String(row[1] || '').trim(); // context/description
      const colC = String(row[2] || '').trim(); // English text

      if (!colA || !colC) continue;

      // Extract speaker name from Column A (format: SAY.Context.Index.SpeakerName)
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
          english: colC,
          uttererKey: colA
        });
      }
    }
  }
}

// Sort by speaker name, then episode, then sheet order
rows.sort((a, b) => {
  const cmp = a.speaker.localeCompare(b.speaker);
  if (cmp !== 0) return cmp;
  // Sort episodes numerically
  const ea = parseInt(a.episode.replace('E', ''));
  const eb = parseInt(b.episode.replace('E', ''));
  return ea - eb;
});

// Ensure output directory
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Write CSV (quote fields that might contain commas)
function csvEscape(val) {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

const csvLines = ['speaker,episode,sheet,context,english,utterer_key'];
for (const r of rows) {
  csvLines.push([
    csvEscape(r.speaker),
    csvEscape(r.episode),
    csvEscape(r.sheet),
    csvEscape(r.context),
    csvEscape(r.english),
    csvEscape(r.uttererKey)
  ].join(','));
}

fs.writeFileSync(OUT_FILE, csvLines.join('\n'), 'utf8');

// Summary
const speakers = new Map();
for (const r of rows) {
  if (!speakers.has(r.speaker)) speakers.set(r.speaker, 0);
  speakers.set(r.speaker, speakers.get(r.speaker) + 1);
}
const sorted = [...speakers.entries()].sort((a, b) => b[1] - a[1]);

console.log(`\n=== EXTRACTION COMPLETE ===`);
console.log(`Total dialogue lines: ${rows.length}`);
console.log(`Unique speakers: ${speakers.size}`);
console.log(`Output: ${OUT_FILE}`);
console.log(`\nTop 20 speakers:`);
for (const [name, count] of sorted.slice(0, 20)) {
  console.log(`  ${name.padEnd(30)} ${count} lines`);
}
```

**Step 2: Run the script**

```bash
node scripts/extract-dialogue-by-speaker.js
```

Expected: CSV written to `data/analysis/speaker-dialogue.csv` with ~3,400 rows. Console shows summary with speaker counts.

**Step 3: Verify the CSV output**

```bash
head -5 data/analysis/speaker-dialogue.csv
wc -l data/analysis/speaker-dialogue.csv
```

Expected: Header row + ~3,400 data rows. First lines should show a speaker alphabetically early (like "Angry Ass") with their dialogue.

**Step 4: Commit**

```bash
git add scripts/extract-dialogue-by-speaker.js data/analysis/
git commit -m "feat: add dialogue extraction script — groups all xlsx dialogue by speaker"
```

---

## Phase 2: Style Analysis

### Task 2: Create the style analysis script

**Files:**
- Create: `scripts/analyze-speaker-styles.js`

This script reads the extracted CSV, batches dialogue by speaker, sends each speaker's lines to Claude for tonal/style analysis, and writes results to `data/analysis/speaker-styles.json`.

**Step 1: Write the analysis script**

```js
/**
 * analyze-speaker-styles.js
 *
 * Reads speaker-dialogue.csv and uses Claude to generate
 * per-speaker style/tone summaries.
 *
 * Outputs: data/analysis/speaker-styles.json
 *
 * Run: node scripts/analyze-speaker-styles.js [--min-lines 10] [--speaker "Smart Ass"]
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 */
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const CSV_FILE = path.join(__dirname, '..', 'data', 'analysis', 'speaker-dialogue.csv');
const OUT_FILE = path.join(__dirname, '..', 'data', 'analysis', 'speaker-styles.json');
const CODEX_FILE = path.join(__dirname, '..', 'data', 'json', 'codex_translations.json');

// Parse args
const MIN_LINES = parseInt(process.argv.find(a => a.startsWith('--min-lines='))?.split('=')[1] || '10');
const ONLY_SPEAKER = process.argv.find(a => a.startsWith('--speaker='))?.split('=').slice(1).join('=');
const DRY_RUN = process.argv.includes('--dry-run');

// Read CSV
const csvRaw = fs.readFileSync(CSV_FILE, 'utf8');
const lines = csvRaw.split('\n').slice(1).filter(l => l.trim());

// Simple CSV parse (handles quoted fields)
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

// Group by speaker
const speakers = new Map();
for (const line of lines) {
  const [speaker, episode, sheet, context, english] = parseCSVLine(line);
  if (!speaker || !english) continue;
  if (!speakers.has(speaker)) speakers.set(speaker, []);
  speakers.get(speaker).push({ episode, sheet, context, english });
}

// Load existing codex for context
const codex = JSON.parse(fs.readFileSync(CODEX_FILE, 'utf8'));
const codexChars = new Map();
for (const e of codex.entries) {
  if (e.category === 'CHARACTER') {
    codexChars.set(e.english, e);
  }
}

// Filter speakers
let targetSpeakers = [...speakers.entries()]
  .filter(([_, lines]) => lines.length >= MIN_LINES)
  .sort((a, b) => b[1].length - a[1].length);

if (ONLY_SPEAKER) {
  targetSpeakers = targetSpeakers.filter(([name]) =>
    name.toLowerCase().includes(ONLY_SPEAKER.toLowerCase())
  );
}

console.log(`=== SPEAKER STYLE ANALYSIS ===`);
console.log(`Speakers to analyze: ${targetSpeakers.length} (min ${MIN_LINES} lines)`);
console.log(`Total lines: ${targetSpeakers.reduce((s, [_, l]) => s + l.length, 0)}`);
if (DRY_RUN) {
  console.log('\n[DRY RUN] Would analyze:');
  for (const [name, lines] of targetSpeakers) {
    console.log(`  ${name.padEnd(30)} ${lines.length} lines`);
  }
  process.exit(0);
}

const client = new Anthropic();

async function analyzeSpeaker(name, dialogueLines) {
  // Get codex info if available
  const codexEntry = codexChars.get(name) || codexChars.get(name + ' Ass');
  const existingInfo = [];
  if (codexEntry) {
    if (codexEntry.gender) existingInfo.push(`Gender: ${codexEntry.gender}`);
    if (codexEntry.bio) existingInfo.push(`Bio: ${codexEntry.bio}`);
    if (codexEntry.dialogueStyle) existingInfo.push(`Existing style notes: ${codexEntry.dialogueStyle}`);
  }

  // Sample up to 60 lines, spread across episodes
  const episodes = new Map();
  for (const line of dialogueLines) {
    if (!episodes.has(line.episode)) episodes.set(line.episode, []);
    episodes.get(line.episode).push(line);
  }

  let sampled = [];
  for (const [ep, epLines] of [...episodes.entries()].sort()) {
    const take = Math.min(Math.ceil(60 / episodes.size), epLines.length);
    // Take evenly spaced lines
    const step = Math.max(1, Math.floor(epLines.length / take));
    for (let i = 0; i < epLines.length && sampled.length < 60; i += step) {
      sampled.push(epLines[i]);
    }
  }

  const dialogueBlock = sampled.map(l => {
    const ctx = l.context ? ` [${l.context}]` : '';
    return `[${l.episode}]${ctx} "${l.english}"`;
  }).join('\n');

  const prompt = `You are analyzing dialogue from "Asses & Masses", an animated series about donkeys in an allegorical society. Below are sample dialogue lines from the character "${name}".

${existingInfo.length > 0 ? 'Known info:\n' + existingInfo.join('\n') + '\n\n' : ''}Total lines in script: ${dialogueLines.length} (showing ${sampled.length} samples across ${episodes.size} episodes)

DIALOGUE:
${dialogueBlock}

Produce a concise STYLE PROFILE for this character's speech patterns. Include:
1. **Tone** (2-3 words): emotional register (e.g., "sardonic, world-weary" or "excitable, naive")
2. **Vocabulary**: level/register (formal, colloquial, childlike, poetic, etc.)
3. **Verbal tics**: catchphrases, repeated expressions, distinctive punctuation habits
4. **Sentence structure**: short/long, questions, exclamations, fragments
5. **Key themes**: what they talk about most

Format as a compact block suitable for a translation reference card (max 120 words). Use line breaks between sections. Do NOT use markdown headers or bullet points — just plain text with line breaks.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text.trim();
}

async function main() {
  // Load existing results if any (to allow resuming)
  let results = {};
  if (fs.existsSync(OUT_FILE)) {
    try {
      results = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
      console.log(`Loaded ${Object.keys(results).length} existing results`);
    } catch (e) {
      results = {};
    }
  }

  for (let i = 0; i < targetSpeakers.length; i++) {
    const [name, lines] = targetSpeakers[i];

    // Skip if already analyzed
    if (results[name] && !ONLY_SPEAKER) {
      console.log(`[${i + 1}/${targetSpeakers.length}] ${name} — already analyzed, skipping`);
      continue;
    }

    console.log(`[${i + 1}/${targetSpeakers.length}] Analyzing ${name} (${lines.length} lines)...`);

    try {
      const style = await analyzeSpeaker(name, lines);
      results[name] = {
        speaker: name,
        lineCount: lines.length,
        episodes: [...new Set(lines.map(l => l.episode))].sort(),
        styleAnalysis: style,
        analyzedAt: new Date().toISOString()
      };

      // Save after each speaker (resume-safe)
      fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');
      console.log(`  ✓ Saved (${style.substring(0, 60)}...)`);

      // Rate limiting: 500ms between calls
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      results[name] = {
        speaker: name,
        lineCount: lines.length,
        error: err.message,
        analyzedAt: new Date().toISOString()
      };
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== COMPLETE ===`);
  console.log(`Results: ${OUT_FILE}`);
  console.log(`Analyzed: ${Object.keys(results).filter(k => results[k].styleAnalysis).length} speakers`);
}

main().catch(console.error);
```

**Step 2: Verify Anthropic SDK is available**

```bash
cd /Users/tomlinson/AM_FL_TRANS && node -e "require('@anthropic-ai/sdk')" 2>&1
```

If missing, install it:
```bash
npm install @anthropic-ai/sdk
```

**Step 3: Dry run to verify grouping**

```bash
node scripts/analyze-speaker-styles.js --dry-run
```

Expected: List of speakers with line counts, no API calls.

**Step 4: Test with a single speaker**

```bash
node scripts/analyze-speaker-styles.js --speaker="Smart Ass"
```

Expected: Analyzes just Smart Ass (321 lines), writes result to `data/analysis/speaker-styles.json`.

**Step 5: Run full analysis**

```bash
node scripts/analyze-speaker-styles.js --min-lines=10
```

Expected: Iterates through all speakers with 10+ lines, saves results incrementally. Resume-safe — re-running skips already-analyzed speakers.

**Step 6: Commit**

```bash
git add scripts/analyze-speaker-styles.js data/analysis/speaker-styles.json
git commit -m "feat: add speaker style analysis script — Claude-powered tone profiling per character"
```

---

## Phase 3: Codex Import

### Task 3: Create the codex import script

**Files:**
- Create: `scripts/import-styles-to-codex.js`

This script reads `speaker-styles.json`, matches speakers to codex CHARACTER entries, and patches the `dialogueStyle` field. Uses the same CSV-safe pattern from `fill-gender-gaps.js`.

**Step 1: Write the import script**

```js
/**
 * import-styles-to-codex.js
 *
 * Reads speaker-styles.json and patches dialogueStyle into codex CSV + JSON.
 *
 * Run: node scripts/import-styles-to-codex.js          (preview)
 *      node scripts/import-styles-to-codex.js --apply   (update files)
 *      node scripts/import-styles-to-codex.js --overwrite --apply  (replace existing styles)
 */
const fs = require('fs');
const path = require('path');

const STYLES_FILE = path.join(__dirname, '..', 'data', 'analysis', 'speaker-styles.json');
const CSV_PATH = path.join(__dirname, '..', 'data', 'csv', 'codex_translations.csv');
const JSON_PATH = path.join(__dirname, '..', 'data', 'json', 'codex_translations.json');

const APPLY = process.argv.includes('--apply');
const OVERWRITE = process.argv.includes('--overwrite');

// Load style analysis results
const styles = JSON.parse(fs.readFileSync(STYLES_FILE, 'utf8'));

// Load codex JSON
const codex = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Build speaker name -> codex entry mapping
// Speaker names from xlsx might not perfectly match codex english names
// e.g., xlsx has "Smart Ass" and codex has "Smart Ass" (exact match)
// but xlsx might have "Foal" and codex has "{$NewName}" or similar
const matches = [];
const noMatch = [];

for (const [speakerName, data] of Object.entries(styles)) {
  if (data.error || !data.styleAnalysis) continue;

  // Try exact match first
  let entry = codex.entries.find(e =>
    e.category === 'CHARACTER' && e.english === speakerName
  );

  // Try matching against nicknames
  if (!entry) {
    entry = codex.entries.find(e =>
      e.category === 'CHARACTER' &&
      e.nicknames && e.nicknames.includes(speakerName)
    );
  }

  // Try partial match (speaker name contained in english name)
  if (!entry) {
    entry = codex.entries.find(e =>
      e.category === 'CHARACTER' &&
      (e.english.includes(speakerName) || speakerName.includes(e.english))
    );
  }

  if (entry) {
    const hasExisting = entry.dialogueStyle && entry.dialogueStyle.trim().length > 0;
    matches.push({
      speaker: speakerName,
      codexName: entry.english,
      lineCount: data.lineCount,
      style: data.styleAnalysis,
      hasExisting,
      existingStyle: entry.dialogueStyle || '',
      willUpdate: !hasExisting || OVERWRITE
    });
  } else {
    noMatch.push({ speaker: speakerName, lineCount: data.lineCount });
  }
}

// Report
console.log('=== STYLE IMPORT PREVIEW ===\n');
console.log(`Analyzed speakers: ${Object.keys(styles).length}`);
console.log(`Matched to codex: ${matches.length}`);
console.log(`No codex match: ${noMatch.length}`);
console.log(`Will update: ${matches.filter(m => m.willUpdate).length}`);
console.log(`Will skip (existing): ${matches.filter(m => !m.willUpdate).length}`);

console.log('\n--- WILL UPDATE ---');
for (const m of matches.filter(m => m.willUpdate)) {
  console.log(`\n  ${m.codexName} (${m.lineCount} lines)`);
  if (m.hasExisting) {
    console.log(`  [EXISTING]: ${m.existingStyle.substring(0, 80)}...`);
  }
  console.log(`  [NEW]: ${m.style.substring(0, 120)}...`);
}

if (matches.filter(m => !m.willUpdate).length > 0) {
  console.log('\n--- WILL SKIP (has existing style, use --overwrite to replace) ---');
  for (const m of matches.filter(m => !m.willUpdate)) {
    console.log(`  ${m.codexName}: "${m.existingStyle.substring(0, 60)}..."`);
  }
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
    entry.dialogueStyle = m.style;
    updateCount++;
  }
}

// Write JSON
codex.generated = new Date().toISOString();
fs.writeFileSync(JSON_PATH, JSON.stringify(codex, null, 2), 'utf8');

// Rebuild CSV from JSON (same approach as fill-gender-gaps.js)
const csvHeader = 'name,description,english,dutch,category,nicknames,bio,gender,dialogueStyle';
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
    e.dialogueStyle || ''
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
console.log(`Updated ${updateCount} codex entries`);
console.log(`Written: ${JSON_PATH}`);
console.log(`Written: ${CSV_PATH}`);
```

**Step 2: Preview the import**

```bash
node scripts/import-styles-to-codex.js
```

Expected: Shows which speakers matched, which will be updated, which have existing styles.

**Step 3: Apply the import**

```bash
node scripts/import-styles-to-codex.js --apply
```

Expected: Updates codex CSV and JSON with new `dialogueStyle` values for speakers that didn't already have one.

**Step 4: Verify the codex**

```bash
node scripts/sprawl-char-info.js | head -40
```

Expected: Characters now show updated style info from the analysis.

**Step 5: Commit**

```bash
git add scripts/import-styles-to-codex.js data/csv/codex_translations.csv data/json/codex_translations.json
git commit -m "feat: import AI-generated style profiles into codex dialogueStyle field"
```

---

## Phase 4: Review & Refine (Manual)

### Task 4: Human review of style analyses

After import, the user should:
1. Run `node scripts/sprawl-char-info.js` to see all character info
2. Open the app and check CharacterInfoCard displays for key characters
3. Edit any style descriptions that don't feel right via the Codex Editor in the app
4. Re-run analysis for specific characters if needed: `node scripts/analyze-speaker-styles.js --speaker="Character Name"`

### Task 5 (Future): Add "Shorthand / Nickname" codex field

This is deferred to a separate plan. Will add a new `shorthand` field to the codex schema, update CSV header, JSON structure, CharacterInfoCard display, and codex editor form.

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `scripts/extract-dialogue-by-speaker.js` | Create | Extracts all dialogue from xlsx grouped by speaker |
| `scripts/analyze-speaker-styles.js` | Create | Uses Claude API to generate per-speaker style profiles |
| `scripts/import-styles-to-codex.js` | Create | Patches codex CSV/JSON with style analysis results |
| `data/analysis/speaker-dialogue.csv` | Generated | Raw dialogue dump (~3,400 rows) |
| `data/analysis/speaker-styles.json` | Generated | Per-speaker style analysis results |
| `data/csv/codex_translations.csv` | Modified | Updated dialogueStyle fields |
| `data/json/codex_translations.json` | Modified | Updated dialogueStyle fields |

## Estimated API Usage

- ~40-50 speakers with 10+ lines
- ~1 API call per speaker (claude-sonnet, ~300 tokens response each)
- Total: ~50 API calls, ~15K output tokens
- Cost: negligible (<$0.10)
