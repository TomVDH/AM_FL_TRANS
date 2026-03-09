#!/usr/bin/env node

/**
 * Codex Term Discovery Script
 *
 * Scans ALL Excel source files for capitalized words/phrases appearing mid-sentence.
 * These are likely proper nouns, character names, locations, or objects that should
 * be in the codex.
 *
 * Usage: node scripts/discover-codex-terms.js [--verbose] [--min-count=N]
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Config
const EXCELS_FOLDER = path.join(__dirname, '..', 'excels');
const CODEX_CSV = path.join(__dirname, '..', 'data', 'csv', 'codex_translations.csv');
const VERBOSE = process.argv.includes('--verbose');
const SCAN_DUTCH = process.argv.includes('--dutch');
const MIN_COUNT = (() => {
  const arg = process.argv.find(a => a.startsWith('--min-count='));
  return arg ? parseInt(arg.split('=')[1]) : 2;
})();

// ============================================================================
// Step 1: Load existing codex terms for cross-reference
// ============================================================================

function loadCodexTerms() {
  const terms = new Set();
  if (!fs.existsSync(CODEX_CSV)) return terms;

  const content = fs.readFileSync(CODEX_CSV, 'utf8');
  const lines = content.split('\n');

  // Simple CSV parse
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

  const header = parseCSVLine(lines[0]);
  const englishIdx = header.indexOf('english');
  const nicknamesIdx = header.indexOf('nicknames');
  const nameIdx = header.indexOf('name');

  lines.slice(1).filter(l => l.trim()).forEach(line => {
    const fields = parseCSVLine(line);
    const english = (fields[englishIdx] || '').trim().toLowerCase();
    const name = (fields[nameIdx] || '').trim().toLowerCase();
    const nicknames = (fields[nicknamesIdx] || '').trim().toLowerCase();

    if (english) terms.add(english);
    if (name) terms.add(name);

    // Add individual words from multi-word names
    if (english.includes(' ')) {
      english.split(/\s+/).forEach(w => { if (w.length > 2) terms.add(w); });
    }

    // Add nicknames
    if (nicknames) {
      nicknames.split(';').forEach(n => {
        const trimmed = n.trim();
        if (trimmed) terms.add(trimmed);
      });
    }
  });

  return terms;
}

// ============================================================================
// Step 2: Sentence segmentation and mid-sentence capital detection
// ============================================================================

// Only exclude true grammatical artifacts — NOT game-world terms
// Contractions (I'm, I'll etc.) and pronouns are not proper nouns
const FALSE_POSITIVES = new Set([
  // Contractions that appear mid-sentence due to sentence splitting
  "i'm", "i'll", "i've", "i'd", "i'm", "i'll", "i've", "i'd",
  // Pronouns / articles / conjunctions — never game terms
  'i', 'we', 'they', 'he', 'she', 'it', 'you', 'me', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'so',
  'is', 'are', 'was', 'were', 'be', 'been',
  'do', 'does', 'did', 'has', 'have', 'had',
  'will', 'would', 'could', 'should', 'may', 'might', 'can',
  'shall', 'must', 'not', 'that', 'this', 'what', 'who', 'how',
  // Interjections
  'ok', 'oh', 'ha', 'ah', 'uh', 'hm', 'hmm', 'shh', 'psst',
  'wow', 'ow', 'ooh', 'aah', 'hey', 'hi', 'bye',
  // Honorifics
  'mr', 'mrs', 'ms', 'dr',
]);

// All-caps words that are purely grammatical emphasis, not game terms
const ALL_CAPS_SKIP = new Set([
  'DO', 'NOT', 'NO', 'YES', 'AND', 'OR', 'BUT', 'THE', 'THIS',
  'THAT', 'ALL', 'MY', 'YOUR', 'HIS', 'HER', 'OUR', 'THEIR',
  'WHAT', 'WHO', 'HOW', 'WHY', 'WHEN', 'WHERE', 'WHICH',
  'IS', 'ARE', 'WAS', 'WERE', 'BE', 'AM', 'BEEN',
  'IT', 'I', 'WE', 'THEY', 'HE', 'SHE', 'YOU', 'ME', 'US',
  'SO', 'IF', 'AS', 'AT', 'BY', 'TO', 'OF', 'IN', 'ON', 'UP',
  'FOR', 'WITH', 'FROM', 'INTO', 'OVER', 'JUST', 'ONLY',
  'WILL', 'CAN', 'WOULD', 'COULD', 'SHOULD', 'MUST', 'MAY',
  'HAVE', 'HAS', 'HAD', 'DID', 'DOES',
  "DON'T", "DOESN'T", "DIDN'T", "WON'T", "CAN'T",
  "COULDN'T", "WOULDN'T", "I'M", "I'LL", "I'VE", "I'D",
  'OK', 'OKAY', 'OH', 'AH', 'HA', 'HM', 'UH', 'HEY', 'WOW',
]);

/**
 * Split a text value into sentences.
 * Handles: period, exclamation, question mark, ellipsis, newlines.
 */
function splitSentences(text) {
  if (!text) return [];

  // Normalize whitespace
  let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split on sentence-ending punctuation and newlines
  // Keep the delimiter to know what ended the sentence
  const parts = normalized.split(/(?<=[.!?])\s+|(?<=[.!?])(?=[A-Z])|(?:\.{2,})\s*|\n+/);

  return parts
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Extract mid-sentence capitalized words/phrases from a sentence.
 * Returns array of { term, words, isPhrase }
 */
function extractMidSentenceCaps(sentence) {
  const results = [];

  // Remove content in brackets/parentheses (stage directions etc)
  let cleaned = sentence.replace(/\([^)]*\)/g, ' ').replace(/\[[^\]]*\]/g, ' ');

  // Tokenize - split on whitespace but preserve punctuation attachment
  const tokens = cleaned.split(/\s+/).filter(t => t.length > 0);

  if (tokens.length < 2) return results; // Need at least 2 words to have a "mid-sentence" cap

  // Find the first "real" word (skip leading punctuation, ellipsis, interjections)
  let sentenceStart = 0;
  for (let i = 0; i < tokens.length; i++) {
    const stripped = tokens[i].replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
    if (stripped.length > 0) {
      sentenceStart = i;
      break;
    }
  }

  // Scan tokens after the first word
  let i = sentenceStart + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    // Strip leading/trailing punctuation for analysis
    const stripped = token.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');

    if (!stripped || stripped.length < 2) {
      i++;
      continue;
    }

    // Check if word starts with uppercase
    const isCapitalized = /^[A-Z]/.test(stripped);
    // Check if ALL CAPS (emphasis, not a proper noun usually)
    const isAllCaps = stripped === stripped.toUpperCase() && stripped.length > 1;

    // Skip contractions like I'm, I'll, I've, I'd
    if (/^I[''\u2019](m|ll|ve|d)$/i.test(stripped)) {
      i++;
      continue;
    }

    if (isCapitalized && !isAllCaps) {
      // Start collecting a potential phrase
      const phraseWords = [stripped];
      let j = i + 1;

      // Look ahead for consecutive capitalized words (multi-word names)
      while (j < tokens.length) {
        const nextToken = tokens[j];
        const nextStripped = nextToken.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
        if (!nextStripped) break;

        const nextIsCap = /^[A-Z]/.test(nextStripped);
        const nextIsAllCaps = nextStripped === nextStripped.toUpperCase() && nextStripped.length > 1;

        // Allow possessives and "of/the/and" connectors in phrases
        const isConnector = ['of', 'the', 'and', 'de', 'van', 'het'].includes(nextStripped.toLowerCase());

        if (nextIsCap && !nextIsAllCaps) {
          phraseWords.push(nextStripped);
          j++;
        } else if (isConnector && j + 1 < tokens.length) {
          // Check if word after connector is also capitalized
          const afterConnector = tokens[j + 1]?.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
          if (afterConnector && /^[A-Z]/.test(afterConnector)) {
            phraseWords.push(nextStripped);
            j++;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      // Build the term
      const term = phraseWords.join(' ');
      const termLower = term.toLowerCase();

      // Filter out false positives
      if (!FALSE_POSITIVES.has(termLower) && phraseWords.every(w => !FALSE_POSITIVES.has(w.toLowerCase()))) {
        results.push({
          term,
          words: phraseWords,
          isPhrase: phraseWords.length > 1,
        });
      }

      i = j;
    } else if (isAllCaps && !ALL_CAPS_SKIP.has(stripped)) {
      // ALL CAPS word that's not in skip list — could be a name/term used emphatically
      // Only include if it matches Title Case pattern when lowered (likely a name)
      // Skip for now — too noisy. Uncomment to include:
      // results.push({ term: stripped, words: [stripped], isPhrase: false, allCaps: true });
      i++;
    } else {
      i++;
    }
  }

  return results;
}

// ============================================================================
// Step 3: Process all Excel files
// ============================================================================

function processAllExcels() {
  const files = fs.readdirSync(EXCELS_FOLDER)
    .filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));

  // Map: term -> { count, files: Set, sheets: Set, examples: [] }
  const termMap = new Map();
  let totalCells = 0;
  let totalTermsFound = 0;
  let totalFiles = 0;
  let totalSheets = 0;

  // Dutch scanning maps
  const dutchTermMap = new Map();   // Dutch mid-sentence caps
  const pairMap = new Map();        // English term -> Dutch translations seen on same row
  let dutchCells = 0;
  let dutchTermsFound = 0;

  // Stats tracking for graphical output
  const fileStats = [];

  files.forEach(file => {
    const filePath = path.join(EXCELS_FOLDER, file);
    const shortName = file.replace('.xlsx', '');
    totalFiles++;

    const fileStat = { name: shortName, sheets: [], cellsScanned: 0, termsFound: 0, dutchCells: 0, dutchTerms: 0 };

    try {
      const workbook = XLSX.readFile(filePath);

      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) return;
        totalSheets++;

        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        let sheetCells = 0;
        let sheetTerms = 0;
        let sheetDutchCells = 0;
        let sheetDutchTerms = 0;

        // Find Dutch column dynamically from header row
        const headerRow = data[0] || [];
        let dutchColIdx = -1;
        let englishColIdx = 2; // Default: Column C
        if (SCAN_DUTCH) {
          for (let ci = 0; ci < headerRow.length; ci++) {
            const h = (headerRow[ci] || '').toString().trim().toUpperCase();
            if (h === 'NL' || h === 'DUTCH' || h === 'NEDERLANDS') {
              dutchColIdx = ci;
              break;
            }
          }
        }

        data.slice(1).forEach((row, rowIdx) => {
          // Column C (index 2) = English source text
          const sourceText = (row[englishColIdx] || '').toString().trim();
          if (!sourceText || sourceText.length < 3) return;

          totalCells++;
          sheetCells++;

          // Dutch column found dynamically from header
          const dutchText = (SCAN_DUTCH && dutchColIdx >= 0) ? (row[dutchColIdx] || '').toString().trim() : '';

          const sentences = splitSentences(sourceText);
          const engTermsThisRow = [];

          sentences.forEach(sentence => {
            const caps = extractMidSentenceCaps(sentence);
            caps.forEach(({ term }) => {
              totalTermsFound++;
              sheetTerms++;
              const key = term.toLowerCase();
              engTermsThisRow.push(term);

              if (!termMap.has(key)) {
                termMap.set(key, {
                  term, // Keep first-seen casing
                  count: 0,
                  files: new Set(),
                  sheets: new Set(),
                  examples: [],
                });
              }

              const entry = termMap.get(key);
              entry.count++;
              entry.files.add(shortName);
              entry.sheets.add(`${shortName}:${sheetName}`);

              if (entry.examples.length < 3) {
                const trimmedSource = sourceText.length > 100
                  ? sourceText.substring(0, 100) + '...'
                  : sourceText;
                entry.examples.push({
                  file: shortName,
                  sheet: sheetName,
                  row: rowIdx + 2,
                  text: trimmedSource,
                });
              }
            });
          });

          // Dutch scanning
          if (SCAN_DUTCH && dutchText && dutchText.length >= 3) {
            dutchCells++;
            sheetDutchCells++;

            // Scan Dutch text for mid-sentence caps
            const dutchSentences = splitSentences(dutchText);
            dutchSentences.forEach(sentence => {
              const caps = extractMidSentenceCaps(sentence);
              caps.forEach(({ term }) => {
                dutchTermsFound++;
                sheetDutchTerms++;
                const key = term.toLowerCase();

                if (!dutchTermMap.has(key)) {
                  dutchTermMap.set(key, {
                    term,
                    count: 0,
                    files: new Set(),
                    sheets: new Set(),
                    examples: [],
                  });
                }

                const entry = dutchTermMap.get(key);
                entry.count++;
                entry.files.add(shortName);
                entry.sheets.add(`${shortName}:${sheetName}`);

                if (entry.examples.length < 3) {
                  entry.examples.push({
                    file: shortName,
                    sheet: sheetName,
                    row: rowIdx + 2,
                    english: sourceText.length > 80 ? sourceText.substring(0, 80) + '...' : sourceText,
                    dutch: dutchText.length > 80 ? dutchText.substring(0, 80) + '...' : dutchText,
                  });
                }
              });
            });

            // Build English→Dutch pairs for terms found in this row
            if (engTermsThisRow.length > 0 && dutchText) {
              engTermsThisRow.forEach(engTerm => {
                const pairKey = engTerm.toLowerCase();
                if (!pairMap.has(pairKey)) {
                  pairMap.set(pairKey, {
                    english: engTerm,
                    dutchTexts: [],       // full Dutch cell texts where this English term appears
                    dutchTerms: new Set(), // Dutch capitalized terms found on same rows
                  });
                }
                const pair = pairMap.get(pairKey);
                // Store Dutch text (limit to avoid memory bloat)
                if (pair.dutchTexts.length < 5) {
                  const trimDutch = dutchText.length > 120 ? dutchText.substring(0, 120) + '...' : dutchText;
                  pair.dutchTexts.push(trimDutch);
                }
                // Capture Dutch caps from same row
                const dutchCapsThisRow = [];
                dutchSentences.forEach(s => {
                  extractMidSentenceCaps(s).forEach(({ term }) => dutchCapsThisRow.push(term));
                });
                dutchCapsThisRow.forEach(dt => pair.dutchTerms.add(dt));
              });
            }
          }
        });

        fileStat.sheets.push({
          name: sheetName, cells: sheetCells, terms: sheetTerms,
          dutchCells: sheetDutchCells, dutchTerms: sheetDutchTerms,
        });
        fileStat.cellsScanned += sheetCells;
        fileStat.termsFound += sheetTerms;
        fileStat.dutchCells += sheetDutchCells;
        fileStat.dutchTerms += sheetDutchTerms;
      });
    } catch (err) {
      console.error(`  \u274C Error processing ${file}: ${err.message}`);
      fileStat.error = err.message;
    }

    fileStats.push(fileStat);

    // Real-time progress line
    const sheetsInFile = fileStat.sheets.length;
    const emoji = fileStat.error ? '\u274C' : fileStat.termsFound > 0 ? '\u2705' : '\u26AA';
    const dutchInfo = SCAN_DUTCH ? ` | 🇳🇱 ${fileStat.dutchCells} cells, ${fileStat.dutchTerms} terms` : '';
    console.log(`  ${emoji} ${shortName.padEnd(50)} ${sheetsInFile} sheets | ${fileStat.cellsScanned} cells | ${fileStat.termsFound} terms${dutchInfo}`);
  });

  return { termMap, totalCells, totalTermsFound, totalFiles, totalSheets, fileStats, dutchTermMap, pairMap, dutchCells, dutchTermsFound };
}

// ============================================================================
// Step 4: Output results
// ============================================================================

function main() {
  console.log('');
  console.log('\u2550'.repeat(60));
  console.log('\uD83D\uDD0D  CODEX TERM DISCOVERY');
  if (SCAN_DUTCH) console.log('\uD83C\uDDF3\uD83C\uDDF1  DUTCH COLUMN SCANNING ENABLED');
  console.log('\u2550'.repeat(60));
  console.log('');

  // Load existing codex
  console.log('\uD83D\uDCDA Loading existing codex...');
  const codexTerms = loadCodexTerms();
  console.log(`   ${codexTerms.size} known terms/aliases loaded\n`);

  // Process excels
  const colLabel = SCAN_DUTCH ? 'Column C + D' : 'Column C';
  console.log(`\uD83D\uDCC2 Scanning all Excel files (${colLabel} across ALL sheets)...`);
  console.log('\u2500'.repeat(60));
  const { termMap, totalCells, totalTermsFound, totalFiles, totalSheets, fileStats, dutchTermMap, pairMap, dutchCells, dutchTermsFound } = processAllExcels();
  console.log('\u2500'.repeat(60));

  // ── Scan Summary ──
  console.log('');
  console.log('\u2550'.repeat(60));
  console.log('\uD83D\uDCCA  SCAN SUMMARY');
  console.log('\u2550'.repeat(60));
  console.log(`  \uD83D\uDCC1 Files scanned:   ${totalFiles}`);
  console.log(`  \uD83D\uDCC4 Sheets scanned:  ${totalSheets}`);
  console.log(`  \uD83C\uDDEC\uD83C\uDDE7 English cells:   ${totalCells}`);
  console.log(`  \uD83C\uDFF7\uFE0F  English terms:   ${totalTermsFound}`);
  if (SCAN_DUTCH) {
    console.log(`  \uD83C\uDDF3\uD83C\uDDF1 Dutch cells:     ${dutchCells}`);
    console.log(`  \uD83C\uDDF3\uD83C\uDDF1 Dutch terms:     ${dutchTermsFound}`);
  }
  console.log('');

  // ── Per-file breakdown ──
  console.log('\uD83D\uDCCB PER-FILE BREAKDOWN:');
  console.log('\u2500'.repeat(60));
  fileStats.forEach(fs => {
    const bar = '\u2588'.repeat(Math.min(Math.ceil(fs.termsFound / 10), 30));
    console.log(`  \uD83D\uDCC1 ${fs.name}`);
    const dutchLine = SCAN_DUTCH ? ` | \uD83C\uDDF3\uD83C\uDDF1 ${fs.dutchCells} cells, ${fs.dutchTerms} terms` : '';
    console.log(`     ${fs.sheets.length} sheets | ${fs.cellsScanned} cells | ${fs.termsFound} terms ${bar}${dutchLine}`);
    fs.sheets.forEach(sh => {
      const shEmoji = sh.terms > 0 ? '\uD83D\uDFE2' : '\u26AA';
      const dutchSh = SCAN_DUTCH && sh.dutchTerms > 0 ? ` | \uD83C\uDDF3\uD83C\uDDF1 ${sh.dutchTerms}` : '';
      console.log(`       ${shEmoji} ${sh.name.padEnd(40)} ${sh.cells} cells \u2192 ${sh.terms} terms${dutchSh}`);
    });
    console.log('');
  });

  // Sort by count descending
  const allTerms = Array.from(termMap.values())
    .sort((a, b) => b.count - a.count);

  // Separate into known (in codex) and unknown (new discoveries)
  const knownTerms = allTerms.filter(t => codexTerms.has(t.term.toLowerCase()));
  const unknownTerms = allTerms.filter(t => !codexTerms.has(t.term.toLowerCase()));
  const significantUnknown = unknownTerms.filter(t => t.count >= MIN_COUNT);

  // ── New discoveries ──
  console.log('\u2550'.repeat(60));
  console.log(`\uD83C\uDD95  NEW ENGLISH TERMS NOT IN CODEX (appearing ${MIN_COUNT}+ times)`);
  console.log('\u2550'.repeat(60));
  console.log('');
  significantUnknown.forEach((t, idx) => {
    const fileList = Array.from(t.files).sort().join(', ');
    const bar = '\u2588'.repeat(Math.min(t.count, 40));
    console.log(`${String(idx + 1).padStart(3)}. "${t.term}" (${t.count}x across ${t.files.size} file${t.files.size > 1 ? 's' : ''}) ${bar}`);
    console.log(`     \uD83D\uDCC2 ${fileList}`);
    if (VERBOSE && t.examples.length > 0) {
      t.examples.forEach(ex => {
        console.log(`     \uD83D\uDCDD [${ex.file}:${ex.sheet} row ${ex.row}]: "${ex.text}"`);
      });
    }
    console.log('');
  });

  // ── Dutch results (only when --dutch) ──
  if (SCAN_DUTCH) {
    const allDutchTerms = Array.from(dutchTermMap.values())
      .sort((a, b) => b.count - a.count);
    const significantDutch = allDutchTerms.filter(t => t.count >= MIN_COUNT);

    console.log('\u2550'.repeat(60));
    console.log(`\uD83C\uDDF3\uD83C\uDDF1  DUTCH CAPITALIZED TERMS (appearing ${MIN_COUNT}+ times)`);
    console.log('\u2550'.repeat(60));
    console.log('');
    significantDutch.forEach((t, idx) => {
      const fileList = Array.from(t.files).sort().join(', ');
      const bar = '\u2588'.repeat(Math.min(t.count, 40));
      console.log(`${String(idx + 1).padStart(3)}. "${t.term}" (${t.count}x across ${t.files.size} file${t.files.size > 1 ? 's' : ''}) ${bar}`);
      console.log(`     \uD83D\uDCC2 ${fileList}`);
      if (VERBOSE && t.examples.length > 0) {
        t.examples.forEach(ex => {
          console.log(`     \uD83C\uDDEC\uD83C\uDDE7 "${ex.english}"`);
          console.log(`     \uD83C\uDDF3\uD83C\uDDF1 "${ex.dutch}"`);
        });
      }
      console.log('');
    });

    // ── English→Dutch pairs ──
    // For terms found in English Column C, show what Dutch caps appear on same rows
    const pairsWithDutch = Array.from(pairMap.values())
      .filter(p => p.dutchTerms.size > 0)
      .sort((a, b) => b.dutchTexts.length - a.dutchTexts.length);

    if (pairsWithDutch.length > 0) {
      console.log('\u2550'.repeat(60));
      console.log('\uD83D\uDD17  ENGLISH \u2192 DUTCH TERM PAIRS (same-row cross-reference)');
      console.log('\u2550'.repeat(60));
      console.log('');
      pairsWithDutch.forEach((p, idx) => {
        const dutchList = Array.from(p.dutchTerms).sort().join(', ');
        console.log(`${String(idx + 1).padStart(3)}. \uD83C\uDDEC\uD83C\uDDE7 "${p.english}" \u2192 \uD83C\uDDF3\uD83C\uDDF1 ${dutchList}`);
        if (VERBOSE && p.dutchTexts.length > 0) {
          // Show first 2 Dutch cell examples
          p.dutchTexts.slice(0, 2).forEach(dt => {
            console.log(`       \uD83D\uDCDD "${dt}"`);
          });
        }
      });
      console.log('');
    }

    // ── Dutch-only terms (appear in Dutch but NOT in English caps) ──
    const englishTermKeys = new Set(Array.from(termMap.keys()));
    const dutchOnly = allDutchTerms.filter(t =>
      !englishTermKeys.has(t.term.toLowerCase()) && t.count >= MIN_COUNT
    );

    if (dutchOnly.length > 0) {
      console.log('\u2550'.repeat(60));
      console.log(`\uD83C\uDDF3\uD83C\uDDF1  DUTCH-ONLY TERMS (not found as English caps, ${MIN_COUNT}+ times)`);
      console.log('\u2550'.repeat(60));
      console.log('');
      dutchOnly.forEach((t, idx) => {
        const fileList = Array.from(t.files).sort().join(', ');
        console.log(`${String(idx + 1).padStart(3)}. "${t.term}" (${t.count}x across ${t.files.size} file${t.files.size > 1 ? 's' : ''})`);
        console.log(`     \uD83D\uDCC2 ${fileList}`);
        if (VERBOSE && t.examples.length > 0) {
          t.examples.slice(0, 2).forEach(ex => {
            console.log(`     \uD83C\uDDEC\uD83C\uDDE7 "${ex.english}"`);
            console.log(`     \uD83C\uDDF3\uD83C\uDDF1 "${ex.dutch}"`);
          });
        }
        console.log('');
      });
    }
  }

  // ── Known terms (validation) ──
  console.log('\u2550'.repeat(60));
  console.log('\u2705  EXISTING CODEX TERMS FOUND');
  console.log('\u2550'.repeat(60));
  console.log('');
  const topKnown = knownTerms.slice(0, 30);
  topKnown.forEach((t, idx) => {
    console.log(`${String(idx + 1).padStart(3)}. "${t.term}" (${t.count}x across ${t.files.size} file${t.files.size > 1 ? 's' : ''})`);
  });
  if (knownTerms.length > 30) {
    console.log(`  ... and ${knownTerms.length - 30} more known terms`);
  }

  // ── Final totals ──
  console.log('');
  console.log('\u2550'.repeat(60));
  console.log('\uD83C\uDFC1  FINAL TOTALS');
  console.log('\u2550'.repeat(60));
  console.log(`  \uD83D\uDD22 Total unique English terms:        ${allTerms.length}`);
  console.log(`  \u2705 Already in codex:                  ${knownTerms.length}`);
  console.log(`  \uD83C\uDD95 New discoveries (${MIN_COUNT}+ occurrences):  ${significantUnknown.length}`);
  console.log(`  \uD83D\uDD39 New discoveries (1 occurrence):    ${unknownTerms.filter(t => t.count === 1).length}`);
  if (SCAN_DUTCH) {
    const allDutchTerms = Array.from(dutchTermMap.values());
    const dutchSig = allDutchTerms.filter(t => t.count >= MIN_COUNT);
    console.log(`  \uD83C\uDDF3\uD83C\uDDF1 Unique Dutch terms:              ${allDutchTerms.length}`);
    console.log(`  \uD83C\uDDF3\uD83C\uDDF1 Dutch terms (${MIN_COUNT}+ occurrences):    ${dutchSig.length}`);
    console.log(`  \uD83D\uDD17 English\u2192Dutch pairs found:       ${Array.from(pairMap.values()).filter(p => p.dutchTerms.size > 0).length}`);
  }
  console.log('');
  console.log(`Run with --verbose for example contexts`);
  console.log(`Run with --dutch to scan Column D (Dutch) as well`);
  console.log(`Run with --min-count=1 to see all discoveries`);
  console.log('\u2550'.repeat(60));
}

main();
