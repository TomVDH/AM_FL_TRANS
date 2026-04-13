#!/usr/bin/env node

/**
 * analyze-nl-corpus.js
 *
 * Programmatic analysis of the Dutch (NL) translation corpus across all episodes.
 * Extracts every NL dialogue line from the Excel sheets, groups by speaker (utterer),
 * and produces a per-character linguistic report:
 *
 *   - Pronoun usage (ge/gij vs je/jij vs u)
 *   - Flemish markers (nie, da, allez, amai, zenne, nen/ne, -ke diminutives)
 *   - Contractions ('k, 't, 's, da's, die's)
 *   - Verbal tics and repeated phrases
 *   - Inconsistencies (mixed pronoun forms, register drift)
 *
 * Outputs:
 *   data/analysis/nl-corpus-report.json  — full structured data per speaker
 *   stdout                               — human-readable summary
 *
 * Usage:
 *   node scripts/analysis/analyze-nl-corpus.js
 *   node scripts/analysis/analyze-nl-corpus.js --speaker="Bad Ass"
 *   node scripts/analysis/analyze-nl-corpus.js --top=20
 */

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const EXCEL_DIR = path.join(PROJECT_ROOT, 'excels');
const OUT_DIR = path.join(PROJECT_ROOT, 'data', 'analysis');
const OUT_FILE = path.join(OUT_DIR, 'nl-corpus-report.json');
const DIALOGUE_FILE = path.join(OUT_DIR, 'all-dialogue.jsonl');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const speakerFilter = args.find(a => a.startsWith('--speaker='))?.split('=')[1];
const topN = parseInt(args.find(a => a.startsWith('--top='))?.split('=')[1] || '0') || 0;

// ---------------------------------------------------------------------------
// Linguistic patterns
// ---------------------------------------------------------------------------

// Pronoun forms
const PRONOUN_PATTERNS = {
  'ge/gij': /\b(ge|gij|gijlie)\b/gi,
  'je/jij': /\b(je|jij|jullie)\b/gi,
  'u': /\b(u|uw)\b/gi,
};

// Flemish markers (word-boundary aware)
const FLEMISH_MARKERS = {
  'nie': /\bnie\b/gi,
  'da': /\bda\b/gi,
  'allez': /\ballez\b/gi,
  'amai': /\bamai\b/gi,
  'zenne': /\bzenne\b/gi,
  'nen/ne': /\b(nen|ne)\b/gi,
  'manneke': /\bmanneke\b/gi,
  'goesting': /\bgoesting\b/gi,
  'plansen': /\bpansen\b/gi,
  'zever': /\bzever\b/gi,
  'kansen': /\bkansen\b/gi,
  '-ke diminutive': /\w+ke\b/gi,
  'godver': /godver\w*/gi,
};

// Contractions
const CONTRACTION_PATTERNS = {
  "'k": /['']\s*k\b/gi,
  "''k": /['']{2}\s*k\b/gi,
  "'t": /\b['']\s*t\b/gi,
  "'s": /\b['']\s*s\b/gi,
  "da's": /\bda['']\s*s\b/gi,
};

// ---------------------------------------------------------------------------
// Excel extraction
// ---------------------------------------------------------------------------

async function extractAllDialogue() {
  const files = fs.readdirSync(EXCEL_DIR)
    .filter(f => f.endsWith('.xlsx') && f.match(/^\d+_asses/))
    .sort((a, b) => {
      const na = parseInt(a.match(/^(\d+)/)[1]);
      const nb = parseInt(b.match(/^(\d+)/)[1]);
      return na - nb;
    });

  const allRows = [];

  for (const file of files) {
    const epMatch = file.match(/^(\d+)_/);
    const episode = epMatch ? 'E' + epMatch[1] : file;

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(path.join(EXCEL_DIR, file));

    for (const ws of wb.worksheets) {
      // Find NL and Standard columns by header
      const headerRow = ws.getRow(1);
      let nlCol = -1;
      let enCol = -1;
      let keyCol = 1;
      let descCol = 2;

      headerRow.eachCell((cell, colNum) => {
        const val = String(cell.value || '').trim().toUpperCase();
        if (val === 'NL') nlCol = colNum;
        if (val === 'STANDARD') enCol = colNum;
        if (val === 'KEY') keyCol = colNum;
        if (val === 'DESCRIPTION') descCol = colNum;
      });

      if (nlCol === -1 || enCol === -1) continue;

      ws.eachRow((row, rowNum) => {
        if (rowNum === 1) return; // skip header

        const key = String(row.getCell(keyCol).value || '').trim();
        const english = String(row.getCell(enCol).value || '').trim();
        const dutch = String(row.getCell(nlCol).value || '').trim();

        if (!key || !english || !dutch) return;
        if (key === 'SPACER') return;

        // Extract speaker from key: SAY.Dialog:XXX.NN.Speaker Name
        const parts = key.split('.');
        let speaker = null;
        if (parts.length >= 4) {
          speaker = parts.slice(3).join('.').trim(); // handles dots in names
        }

        if (speaker && speaker.length > 1) {
          allRows.push({ speaker, episode, sheet: ws.name, english, dutch, key });
        }
      });
    }
  }

  return allRows;
}

// ---------------------------------------------------------------------------
// Analysis
// ---------------------------------------------------------------------------

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function findRepeatedPhrases(lines, minLen = 3, minOccurrences = 2) {
  // Find phrases (3+ words) that appear in multiple lines
  const phraseCounts = new Map();

  for (const line of lines) {
    const words = line.toLowerCase().replace(/[.,!?;:"""]/g, '').split(/\s+/).filter(Boolean);
    const seen = new Set(); // dedupe within same line

    for (let len = minLen; len <= Math.min(6, words.length); len++) {
      for (let i = 0; i <= words.length - len; i++) {
        const phrase = words.slice(i, i + len).join(' ');
        if (!seen.has(phrase)) {
          seen.add(phrase);
          phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
        }
      }
    }
  }

  return [...phraseCounts.entries()]
    .filter(([, count]) => count >= minOccurrences)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([phrase, count]) => ({ phrase, count }));
}

function analyzeSpeaker(lines) {
  const allText = lines.join(' ');
  const lineCount = lines.length;

  // Pronoun counts
  const pronouns = {};
  for (const [label, pattern] of Object.entries(PRONOUN_PATTERNS)) {
    pronouns[label] = countMatches(allText, pattern);
  }

  // Determine dominant pronoun form
  const pronounTotal = Object.values(pronouns).reduce((a, b) => a + b, 0);
  let dominantPronoun = 'none';
  if (pronounTotal > 0) {
    const sorted = Object.entries(pronouns).sort((a, b) => b[1] - a[1]);
    dominantPronoun = sorted[0][0];
    // Check if mixed (second form is >25% of dominant)
    if (sorted.length > 1 && sorted[1][1] > sorted[0][1] * 0.25) {
      dominantPronoun = `mixed (${sorted[0][0]}: ${sorted[0][1]}, ${sorted[1][0]}: ${sorted[1][1]})`;
    }
  }

  // Flemish marker counts
  const flemishMarkers = {};
  let flemishTotal = 0;
  for (const [label, pattern] of Object.entries(FLEMISH_MARKERS)) {
    const count = countMatches(allText, pattern);
    if (count > 0) {
      flemishMarkers[label] = count;
      flemishTotal += count;
    }
  }

  // Flemish density estimate
  let flemishDensity = 'zero';
  const flemishRate = lineCount > 0 ? flemishTotal / lineCount : 0;
  if (flemishRate > 1.5) flemishDensity = 'heavy';
  else if (flemishRate > 0.5) flemishDensity = 'medium';
  else if (flemishRate > 0.1) flemishDensity = 'light';
  else if (flemishTotal > 0) flemishDensity = 'trace';

  // Contraction counts
  const contractions = {};
  for (const [label, pattern] of Object.entries(CONTRACTION_PATTERNS)) {
    const count = countMatches(allText, pattern);
    if (count > 0) contractions[label] = count;
  }

  // Repeated phrases (verbal tics)
  const repeatedPhrases = findRepeatedPhrases(lines);

  // Inconsistencies
  const inconsistencies = [];

  // Check for mixed ge/gij + je/jij within same character
  if (pronouns['ge/gij'] > 2 && pronouns['je/jij'] > 2) {
    const ratio = Math.min(pronouns['ge/gij'], pronouns['je/jij']) / Math.max(pronouns['ge/gij'], pronouns['je/jij']);
    if (ratio > 0.2) {
      inconsistencies.push({
        type: 'mixed-pronouns',
        detail: `ge/gij: ${pronouns['ge/gij']}, je/jij: ${pronouns['je/jij']} — ratio ${(ratio * 100).toFixed(0)}%`,
      });
    }
  }

  // Check for 'nie' alongside 'niet' (inconsistent negation)
  const nieCount = countMatches(allText, /\bnie\b/gi);
  const nietCount = countMatches(allText, /\bniet\b/gi);
  if (nieCount > 0 && nietCount > 0) {
    inconsistencies.push({
      type: 'mixed-negation',
      detail: `nie: ${nieCount}, niet: ${nietCount}`,
    });
  }

  return {
    lineCount,
    pronouns,
    dominantPronoun,
    flemishMarkers,
    flemishTotal,
    flemishDensity,
    contractions,
    repeatedPhrases,
    inconsistencies,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Extracting NL dialogue from all Excel sheets...\n');

  const allRows = await extractAllDialogue();
  console.log(`Total dialogue rows with NL: ${allRows.length}`);

  // Group by speaker
  const bySpeaker = new Map();
  for (const row of allRows) {
    if (!bySpeaker.has(row.speaker)) bySpeaker.set(row.speaker, []);
    bySpeaker.get(row.speaker).push(row);
  }

  console.log(`Unique speakers: ${bySpeaker.size}\n`);

  // Filter if --speaker flag
  const speakers = speakerFilter
    ? [[speakerFilter, bySpeaker.get(speakerFilter) || []]]
    : [...bySpeaker.entries()].sort((a, b) => b[1].length - a[1].length);

  if (speakerFilter && !bySpeaker.has(speakerFilter)) {
    // Fuzzy match
    const matches = [...bySpeaker.keys()].filter(s => s.toLowerCase().includes(speakerFilter.toLowerCase()));
    if (matches.length > 0) {
      console.log(`Speaker "${speakerFilter}" not found. Did you mean: ${matches.join(', ')}?`);
    } else {
      console.log(`Speaker "${speakerFilter}" not found.`);
    }
    return;
  }

  const report = {};

  const displaySpeakers = topN > 0 ? speakers.slice(0, topN) : speakers;

  for (const [speaker, rows] of displaySpeakers) {
    const dutchLines = rows.map(r => r.dutch);
    const episodes = [...new Set(rows.map(r => r.episode))].sort();
    const analysis = analyzeSpeaker(dutchLines);

    report[speaker] = {
      ...analysis,
      episodes,
    };

    // Print summary
    console.log(`${'─'.repeat(70)}`);
    console.log(`${speaker} (${analysis.lineCount} lines, ${episodes.join(', ')})`);
    console.log(`  Flemish density: ${analysis.flemishDensity} (${analysis.flemishTotal} markers in ${analysis.lineCount} lines)`);
    console.log(`  Pronouns: ${analysis.dominantPronoun}`);

    if (Object.keys(analysis.flemishMarkers).length > 0) {
      const markers = Object.entries(analysis.flemishMarkers)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}:${v}`)
        .join(', ');
      console.log(`  Flemish markers: ${markers}`);
    }

    if (Object.keys(analysis.contractions).length > 0) {
      const contrs = Object.entries(analysis.contractions)
        .map(([k, v]) => `${k}:${v}`)
        .join(', ');
      console.log(`  Contractions: ${contrs}`);
    }

    if (analysis.repeatedPhrases.length > 0) {
      const phrases = analysis.repeatedPhrases.slice(0, 5)
        .map(p => `"${p.phrase}" ×${p.count}`)
        .join(', ');
      console.log(`  Repeated phrases: ${phrases}`);
    }

    if (analysis.inconsistencies.length > 0) {
      for (const inc of analysis.inconsistencies) {
        console.log(`  ⚠ INCONSISTENCY [${inc.type}]: ${inc.detail}`);
      }
    }
  }

  // Write full report
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(report, null, 2), 'utf8');

  // Write all dialogue pairs as JSONL (used by corpus-audit API for full-dialogue source)
  const dialogueLines = allRows.map(row => JSON.stringify({
    speaker: row.speaker,
    english: row.english,
    dutch: row.dutch,
    episode: row.episode,
    sheet: row.sheet,
  }));
  fs.writeFileSync(DIALOGUE_FILE, dialogueLines.join('\n') + '\n', 'utf8');

  console.log(`\n${'─'.repeat(70)}`);
  console.log(`Full report written to: ${OUT_FILE}`);
  console.log(`All dialogue pairs written to: ${DIALOGUE_FILE} (${allRows.length} lines)`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
