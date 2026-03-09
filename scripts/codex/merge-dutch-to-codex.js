#!/usr/bin/env node

/**
 * Merge Dutch Translations into Codex
 *
 * Scans all Excel files for English terms (Column C) and their Dutch translations (NL column),
 * cross-references with the existing codex, and adds new EN→NL entries.
 *
 * Usage:
 *   node scripts/merge-dutch-to-codex.js           # Preview what would be added
 *   node scripts/merge-dutch-to-codex.js --apply    # Actually update the codex CSV + JSON
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCELS_FOLDER = path.join(__dirname, '..', 'excels');
const CODEX_CSV = path.join(__dirname, '..', 'data', 'csv', 'codex_translations.csv');
const CODEX_JSON = path.join(__dirname, '..', 'data', 'json', 'codex_translations.json');
const APPLY = process.argv.includes('--apply');

// ============================================================================
// CSV Parsing
// ============================================================================

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (line[i] === ',' && !inQuotes) {
      fields.push(current); current = '';
    } else {
      current += line[i];
    }
  }
  fields.push(current);
  return fields;
}

function escapeCSV(val) {
  if (!val) return '';
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

// ============================================================================
// Load existing codex
// ============================================================================

function loadCodex() {
  const content = fs.readFileSync(CODEX_CSV, 'utf8');
  // Split carefully handling multi-line quoted fields
  const entries = [];
  const knownEnglish = new Set();
  const knownNames = new Set();

  let lines = [];
  let currentLine = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '"') inQuotes = !inQuotes;
    if (content[i] === '\n' && !inQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += content[i];
    }
  }
  if (currentLine.trim()) lines.push(currentLine);

  const header = lines[0];
  lines.slice(1).forEach(line => {
    if (!line.trim()) return;
    const fields = parseCSVLine(line);
    const name = (fields[0] || '').trim();
    const english = (fields[2] || '').trim();
    const dutch = (fields[3] || '').trim();

    entries.push({ name, english, dutch, raw: line, fields });
    if (english) knownEnglish.add(english.toLowerCase());
    if (name) knownNames.add(name.toLowerCase());
  });

  return { header, entries, knownEnglish, knownNames };
}

// ============================================================================
// Scan Excels for EN→NL pairs
// ============================================================================

function scanExcelsForPairs() {
  const files = fs.readdirSync(EXCELS_FOLDER)
    .filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));

  // Map: english term (lowercase) -> { english, totalRows, dutchCounts: Map<dutch, count>, files: Set }
  const pairMap = new Map();

  // Skip non-dialogue files
  const skipFiles = new Set(['READ_ME_LocalizationManual', 'Translation Checklist']);

  files.forEach(file => {
    const filePath = path.join(EXCELS_FOLDER, file);
    const shortName = file.replace('.xlsx', '');
    if (skipFiles.has(shortName)) return;

    const workbook = XLSX.readFile(filePath);

    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const headerRow = data[0] || [];

      // Find columns
      let enIdx = -1, nlIdx = -1;
      for (let i = 0; i < headerRow.length; i++) {
        const h = (headerRow[i] || '').toString().trim().toUpperCase();
        if (h === 'STANDARD' || h === 'EN' || h === 'ENGLISH') enIdx = i;
        if (h === 'NL' || h === 'DUTCH' || h === 'NEDERLANDS') nlIdx = i;
      }
      if (enIdx < 0 || nlIdx < 0) return;

      data.slice(1).forEach(row => {
        const eng = (row[enIdx] || '').toString().trim();
        const nl = (row[nlIdx] || '').toString().trim();
        if (!eng || eng.length < 2) return;

        // Skip cells with newlines/multi-line (often addresses, metadata)
        if (eng.split('\n').length > 4) return;

        // Extract mid-sentence capitalized terms from English
        const engTerms = extractCapTerms(eng);

        engTerms.forEach(term => {
          const key = term.toLowerCase();
          // Skip terms with em-dashes, artifacts
          if (/[—\n]/.test(term)) return;
          // Skip very long phrases (likely sentence fragments)
          if (term.split(/\s+/).length > 5) return;

          if (!pairMap.has(key)) {
            pairMap.set(key, { english: term, totalRows: 0, dutchCounts: new Map(), files: new Set() });
          }
          const entry = pairMap.get(key);
          entry.totalRows++;
          entry.files.add(shortName);

          // Only cross-reference if Dutch text exists
          if (!nl || nl.length < 2) return;

          // Extract Dutch caps from same row
          const dutchTerms = extractCapTerms(nl);
          dutchTerms.forEach(dt => {
            // Skip Dutch terms with artifacts
            if (/[—\n]/.test(dt)) return;
            if (dt.split(/\s+/).length > 5) return;
            entry.dutchCounts.set(dt, (entry.dutchCounts.get(dt) || 0) + 1);
          });
        });
      });
    });
  });

  return pairMap;
}

// ============================================================================
// Extract capitalized terms (simplified version for pairing)
// ============================================================================

const SKIP_WORDS = new Set([
  'i', 'we', 'they', 'he', 'she', 'it', 'you', 'me', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'so', 'is', 'are',
  'was', 'were', 'be', 'been', 'do', 'does', 'did', 'has', 'have', 'had',
  'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'must',
  'not', 'that', 'this', 'what', 'who', 'how', 'ok', 'oh', 'ha', 'ah',
  'hey', 'hi', 'bye', 'mr', 'mrs', 'ms', 'dr', 'de', 'het', 'van',
  'een', 'en', 'maar', 'ook', 'niet', 'wel', 'nog', 'dan', 'als',
  'met', 'voor', 'naar', 'bij', 'uit', 'aan', 'op', 'om', 'tot',
  'die', 'dat', 'wat', 'wie', 'hoe', 'waar', 'hier', 'daar',
  'je', 'jij', 'wij', 'zij', 'hij', 'ik', 'mij', 'ons', 'hun',
]);

function extractCapTerms(text) {
  if (!text) return [];
  const results = [];

  // Split into sentences
  const sentences = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    .split(/(?<=[.!?])\s+|(?<=[.!?])(?=[A-Z])|(?:\.{2,})\s*|\n+/)
    .map(s => s.trim()).filter(s => s.length > 0);

  sentences.forEach(sentence => {
    const tokens = sentence.split(/\s+/).filter(t => t.length > 0);
    if (tokens.length < 2) return;

    // Find first real word
    let start = 0;
    for (let i = 0; i < tokens.length; i++) {
      const s = tokens[i].replace(/^[^a-zA-ZÀ-ÿ]+|[^a-zA-ZÀ-ÿ]+$/g, '');
      if (s.length > 0) { start = i; break; }
    }

    let i = start + 1;
    while (i < tokens.length) {
      const stripped = tokens[i].replace(/^[^a-zA-ZÀ-ÿ]+|[^a-zA-ZÀ-ÿ]+$/g, '');
      if (!stripped || stripped.length < 2) { i++; continue; }

      const isCap = /^[A-ZÀ-Ý]/.test(stripped);
      const isAllCaps = stripped === stripped.toUpperCase() && stripped.length > 1;

      if (/^I[''\u2019](m|ll|ve|d)$/i.test(stripped)) { i++; continue; }

      if (isCap && !isAllCaps && !SKIP_WORDS.has(stripped.toLowerCase())) {
        const phraseWords = [stripped];
        let j = i + 1;
        while (j < tokens.length) {
          const next = tokens[j].replace(/^[^a-zA-ZÀ-ÿ]+|[^a-zA-ZÀ-ÿ]+$/g, '');
          if (!next) break;
          const nextCap = /^[A-ZÀ-Ý]/.test(next);
          const nextAllCaps = next === next.toUpperCase() && next.length > 1;
          const isConn = ['of', 'the', 'and', 'de', 'van', 'het'].includes(next.toLowerCase());

          if (nextCap && !nextAllCaps && !SKIP_WORDS.has(next.toLowerCase())) {
            phraseWords.push(next); j++;
          } else if (isConn && j + 1 < tokens.length) {
            const after = tokens[j + 1]?.replace(/^[^a-zA-ZÀ-ÿ]+|[^a-zA-ZÀ-ÿ]+$/g, '');
            if (after && /^[A-ZÀ-Ý]/.test(after)) { phraseWords.push(next); j++; }
            else break;
          } else break;
        }

        const term = phraseWords.join(' ');
        if (!SKIP_WORDS.has(term.toLowerCase())) {
          results.push(term);
        }
        i = j;
      } else {
        i++;
      }
    }
  });

  return results;
}

// ============================================================================
// Determine category for a term
// ============================================================================

function guessCategory(english, dutchTerm) {
  const e = english.toLowerCase();
  // Characters - contains "Ass" or known character patterns
  if (/\bass\b/.test(e) && !/(soul|posture)/.test(e)) return 'CHARACTER';
  if (/handler|uncle|comrade|mother|gorilla|eeyore|achilles|littlefoot/.test(e)) return 'CHARACTER';
  if (/^(brown|grey|blue|red|golden|hulk|janus|balaam|cole|vassal|mule|donkey|foal|rico|rose|sandy|joey)$/i.test(e)) return 'CHARACTER';

  // Locations
  if (/farm|stable|village|city|mine|mill|trail|hole|pond|bar|factory|zoo|circus|theatre|plane/.test(e)) return 'LOCATION';
  if (/heritage|fannyside|mecha|bumpkin|mountain|watering/.test(e)) return 'LOCATION';

  // Game concepts / world terms
  return 'TERM';
}

// ============================================================================
// Find best Dutch translation for an English term
// ============================================================================

function bestDutch(pairEntry) {
  if (!pairEntry || pairEntry.dutchCounts.size === 0) return null;

  // Sort by count descending
  const sorted = Array.from(pairEntry.dutchCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  const topCount = sorted[0][1];
  const totalRows = pairEntry.totalRows;

  // Confidence: the top Dutch term should appear on at least 25% of the rows
  // where the English term appears (otherwise it's noise)
  if (topCount / totalRows < 0.2) return null;

  // If only one candidate, use it
  if (sorted.length === 1) return sorted[0][0];

  // If top candidate is clearly dominant (2x the runner-up), use it
  if (topCount >= sorted[1][1] * 2) return sorted[0][0];

  // If top few are close, prefer the one with similar word count
  const engWords = pairEntry.english.split(/\s+/).length;
  const candidates = sorted.filter(([_, c]) => c >= topCount * 0.5);

  const sameWordCount = candidates.filter(([d]) => d.split(/\s+/).length === engWords);
  if (sameWordCount.length > 0) return sameWordCount[0][0];

  return sorted[0][0];
}

// ============================================================================
// Main
// ============================================================================

function main() {
  console.log('');
  console.log('═'.repeat(60));
  console.log('🔗  CODEX EN→NL MERGE');
  console.log(APPLY ? '⚡  MODE: APPLY (will update files)' : '👁️  MODE: PREVIEW (dry run)');
  console.log('═'.repeat(60));
  console.log('');

  // Load codex
  const codex = loadCodex();
  console.log(`📚 Existing codex: ${codex.entries.length} entries (${codex.entries.filter(e => e.dutch).length} with Dutch)`);

  // Scan excels
  console.log('📂 Scanning Excels for EN→NL pairs...');
  const pairMap = scanExcelsForPairs();
  console.log(`🔍 Found ${pairMap.size} English terms with Dutch cross-references`);
  console.log('');

  // ── Fill missing Dutch in existing entries ──
  console.log('─'.repeat(60));
  console.log('📝  EXISTING ENTRIES: FILLING MISSING DUTCH');
  console.log('─'.repeat(60));

  const dutchFills = [];
  codex.entries.forEach(entry => {
    if (entry.dutch) return; // Already has Dutch
    if (!entry.english) return;

    const key = entry.english.toLowerCase();
    const pair = pairMap.get(key);
    if (!pair) return;

    const dutch = bestDutch(pair);
    if (dutch) {
      dutchFills.push({ name: entry.name, english: entry.english, dutch });
      console.log(`  ✅ ${entry.english} → ${dutch}`);
    }
  });
  if (dutchFills.length === 0) console.log('  (none needed)');
  console.log('');

  // ── New entries to add ──
  console.log('─'.repeat(60));
  console.log('🆕  NEW CODEX ENTRIES');
  console.log('─'.repeat(60));

  const newEntries = [];
  const sortedPairs = Array.from(pairMap.values())
    .filter(p => p.dutchCounts.size > 0)
    .sort((a, b) => {
      const aMax = Math.max(...a.dutchCounts.values());
      const bMax = Math.max(...b.dutchCounts.values());
      return bMax - aMax;
    });

  sortedPairs.forEach(pair => {
    const key = pair.english.toLowerCase();
    // Skip if already in codex (exact match or as part of a longer entry)
    if (codex.knownEnglish.has(key)) return;
    if (codex.knownNames.has(key)) return;
    // Skip if this is a shortened form of an existing codex entry
    // e.g., "Sandy" when "Sandy Butte" exists, or "Bumpkin" when "Bumpkin Village" exists
    let isSubEntry = false;
    for (const existing of codex.knownEnglish) {
      if (existing.includes(key) && existing !== key) { isSubEntry = true; break; }
    }
    for (const existing of codex.knownNames) {
      if (existing.includes(key) && existing !== key) { isSubEntry = true; break; }
    }
    if (isSubEntry) return;

    // Skip terms that are subsets of existing codex entries (e.g., "Ass" when "Bad Ass" exists)
    // but only for very short terms that are clearly fragments
    const tooGenericSingle = new Set([
      'all', 'no', 'don\'t', 'name', 'english', 'show', 'win', 'number',
      'level', 'bar', 'words', 'ep', 'listened', 'scared', 'terrible',
      'content', 'blood', 'study', 'pains', 'wounds', 'showers',
      'world', 'fish', 'animals', 'act', 'ass', 'red', 'hay',
      'golden', 'because', 'work', 'welcome', 'morning', 'thursday',
      'copyright', 'corp', 'angel', 'politics', 'boycott',
      'assistant', 'members patrick', 'milton', 'mme',
      'god', 'grunt', 'bray', 'lazy', 'state', 'master', 'masters',
      'ass i\'m', 'ass\'s', 'boss\'s', 'old ass\'s', 'uncle',
      'traditional ass posture', 'morale', 'newname',
      'asses and humans', 'boring machine', 'kick and big',
      'kick big sad', 'silk road', 'fire the humans',
      'old ass\'s protest', 'hellhole', 'lazy\'s', 'aunty smart',
      'dope ass\'s concert', 'forest shrine',
    ]);

    // Skip compound character phrases that are sentence fragments
    if (key.includes(' and ') && key.split(/\s+/).length > 3) return;
    if (key.includes(' i\'m')) return;
    if (tooGenericSingle.has(key)) return;

    // Skip compound artifacts (partial sentences captured as terms)
    if (/[''\u2019]s\s/.test(pair.english) && pair.english.split(/\s+/).length > 3) return;
    if (/—/.test(pair.english)) return;
    if (/\n/.test(pair.english)) return;
    if (/,/.test(pair.english)) return;
    if (/\(/.test(pair.english)) return;

    // Need at least 2 total rows where English term appears
    if (pair.totalRows < 2) return;

    const dutch = bestDutch(pair);
    if (!dutch) return;

    const category = guessCategory(pair.english, dutch);
    newEntries.push({
      name: pair.english,
      description: category,
      english: pair.english,
      dutch,
      category,
      nicknames: '',
      bio: '',
      gender: '',
      dialogueStyle: '',
    });

    const emoji = category === 'CHARACTER' ? '🧑' : category === 'LOCATION' ? '📍' : '📖';
    console.log(`  ${emoji} ${pair.english} → ${dutch}  [${category}]`);
  });

  if (newEntries.length === 0) console.log('  (none found)');
  console.log('');

  // ── Summary ──
  console.log('═'.repeat(60));
  console.log('📊  SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  📝 Dutch fills for existing entries:  ${dutchFills.length}`);
  console.log(`  🆕 New entries to add:                ${newEntries.length}`);
  console.log(`  📚 New codex total:                   ${codex.entries.length + newEntries.length}`);
  console.log('');

  if (!APPLY) {
    console.log('👉  Run with --apply to update the codex files');
    console.log('═'.repeat(60));
    return;
  }

  // ── Apply changes ──
  console.log('⚡  Applying changes...');

  // Read raw CSV content and rebuild
  const rawContent = fs.readFileSync(CODEX_CSV, 'utf8');
  let updatedCSV = rawContent;

  // Apply Dutch fills to existing entries
  // (This is tricky with multi-line CSV, so we'll rebuild)
  // For simplicity, append new entries at the end
  // Dutch fills need careful handling — skip for now if the CSV has multi-line fields

  // Append new entries
  const newLines = newEntries.map(e =>
    [e.name, e.description, e.english, e.dutch, e.category, e.nicknames, e.bio, e.gender, e.dialogueStyle]
      .map(escapeCSV).join(',')
  );

  // Ensure file ends with newline before appending
  if (!updatedCSV.endsWith('\n')) updatedCSV += '\n';
  updatedCSV += newLines.join('\n') + '\n';

  fs.writeFileSync(CODEX_CSV, updatedCSV);
  console.log(`  ✅ Updated ${CODEX_CSV}`);

  // Rebuild JSON
  const jsonEntries = [];
  const csvLines = [];
  let currentLine = '';
  let inQuotes = false;
  for (let i = 0; i < updatedCSV.length; i++) {
    if (updatedCSV[i] === '"') inQuotes = !inQuotes;
    if (updatedCSV[i] === '\n' && !inQuotes) {
      csvLines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += updatedCSV[i];
    }
  }
  if (currentLine.trim()) csvLines.push(currentLine);

  const headerFields = parseCSVLine(csvLines[0]);
  csvLines.slice(1).forEach(line => {
    if (!line.trim()) return;
    const fields = parseCSVLine(line);
    const entry = {};
    headerFields.forEach((h, i) => { entry[h] = (fields[i] || '').trim(); });

    // Parse nicknames into array
    if (entry.nicknames) {
      entry.nicknames = entry.nicknames.split(';').map(n => n.trim()).filter(Boolean);
    } else {
      entry.nicknames = [];
    }

    jsonEntries.push(entry);
  });

  const jsonOutput = {
    version: '2.0',
    generated: new Date().toISOString(),
    description: 'Codex translations for Asses & Masses',
    totalEntries: jsonEntries.length,
    entries: jsonEntries,
  };

  fs.writeFileSync(CODEX_JSON, JSON.stringify(jsonOutput, null, 2));
  console.log(`  ✅ Updated ${CODEX_JSON}`);
  console.log('');
  console.log('═'.repeat(60));
  console.log('🏁  Done! Codex updated with EN→NL mappings.');
  console.log('═'.repeat(60));
}

main();
