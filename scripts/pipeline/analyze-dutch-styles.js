/**
 * analyze-dutch-styles.js
 *
 * Reads speaker-dutch-dialogue.csv and uses Claude to generate
 * per-speaker Dutch translation style summaries.
 *
 * Outputs: data/analysis/speaker-dutch-styles.json
 *
 * Run: node scripts/analyze-dutch-styles.js [--min-lines=10] [--speaker="Smart Ass"] [--dry-run]
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 */
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const CSV_FILE = path.join(PROJECT_ROOT, 'data', 'analysis', 'speaker-dutch-dialogue.csv');
const OUT_FILE = path.join(PROJECT_ROOT, 'data', 'analysis', 'speaker-dutch-styles.json');
const EN_STYLES_FILE = path.join(PROJECT_ROOT, 'data', 'analysis', 'speaker-styles.json');
const CORPUS_FILE = path.join(PROJECT_ROOT, 'data', 'analysis', 'speaker-corpus.jsonl');

const MIN_LINES = parseInt(process.argv.find(a => a.startsWith('--min-lines='))?.split('=')[1] || '10');
const ONLY_SPEAKER = process.argv.find(a => a.startsWith('--speaker='))?.split('=').slice(1).join('=');
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

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

const csvRaw = fs.readFileSync(CSV_FILE, 'utf8');
const lines = csvRaw.split('\n').slice(1).filter(l => l.trim());

const speakers = new Map();
for (const line of lines) {
  const [speaker, episode, sheet, context, english, dutch] = parseCSVLine(line);
  if (!speaker || !dutch) continue;
  if (!speakers.has(speaker)) speakers.set(speaker, []);
  speakers.get(speaker).push({ episode, sheet, context, english, dutch });
}

// Load English style profiles for cross-reference
let enStyles = {};
if (fs.existsSync(EN_STYLES_FILE)) {
  enStyles = JSON.parse(fs.readFileSync(EN_STYLES_FILE, 'utf8'));
}

// Load approved translation corpus (speaker-indexed exemplars)
const corpusBySpeaker = new Map();
if (fs.existsSync(CORPUS_FILE)) {
  const corpusRaw = fs.readFileSync(CORPUS_FILE, 'utf8').trim();
  if (corpusRaw) {
    for (const line of corpusRaw.split('\n')) {
      try {
        const entry = JSON.parse(line);
        if (!entry.speaker || !entry.english || !entry.dutch) continue;
        const key = entry.speaker.toLowerCase();
        if (!corpusBySpeaker.has(key)) corpusBySpeaker.set(key, []);
        corpusBySpeaker.get(key).push(entry);
      } catch { /* skip malformed */ }
    }
    console.log(`Loaded speaker corpus: ${[...corpusBySpeaker.values()].reduce((s, v) => s + v.length, 0)} entries for ${corpusBySpeaker.size} speakers`);
  }
}

let targetSpeakers = [...speakers.entries()]
  .filter(([_, lines]) => lines.length >= MIN_LINES)
  .sort((a, b) => b[1].length - a[1].length);

if (ONLY_SPEAKER) {
  targetSpeakers = targetSpeakers.filter(([name]) =>
    name.toLowerCase().includes(ONLY_SPEAKER.toLowerCase())
  );
}

console.log(`=== DUTCH STYLE ANALYSIS ===`);
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
  const enProfile = enStyles[name]?.styleAnalysis || '';

  const episodes = new Map();
  for (const line of dialogueLines) {
    if (!episodes.has(line.episode)) episodes.set(line.episode, []);
    episodes.get(line.episode).push(line);
  }

  let sampled = [];
  for (const [ep, epLines] of [...episodes.entries()].sort()) {
    const take = Math.min(Math.ceil(60 / episodes.size), epLines.length);
    const step = Math.max(1, Math.floor(epLines.length / take));
    for (let i = 0; i < epLines.length && sampled.length < 60; i += step) {
      sampled.push(epLines[i]);
    }
  }

  const dialogueBlock = sampled.map(l => {
    return `[${l.episode}] EN: "${l.english}" → NL: "${l.dutch}"`;
  }).join('\n');

  // Get approved corpus exemplars for this speaker (up to 20)
  const corpusEntries = (corpusBySpeaker.get(name.toLowerCase()) || []).slice(0, 20);
  const corpusBlock = corpusEntries.length > 0
    ? '\n\nAPPROVED TRANSLATIONS (use these as voice exemplars — these are human-approved translations for this character):\n' +
      corpusEntries.map(e => `EN: "${e.english}"\nNL: "${e.dutch}"`).join('\n---\n')
    : '';

  const prompt = `You are analyzing Dutch translations from "Asses & Masses" (Dutch: "Ezels & Massa's"), an animated series about donkeys in an allegorical society. The translator is Flemish Belgian, deliberately chosen to give the Dutch translation a warm Flemish sensibility while remaining fully understandable to Netherlands/Dutch audiences. The degree of Flemish flavor varies by character — some speak heavy plat Vlaams, others speak clean standard Dutch, and most fall in between. This linguistic variation IS characterization.

Below are paired English→Dutch dialogue lines for the character "${name}".

${enProfile ? 'English speech profile:\n' + enProfile + '\n\n' : ''}Total translated lines: ${dialogueLines.length} (showing ${sampled.length} samples across ${episodes.size} episodes)

DIALOGUE PAIRS:
${dialogueBlock}${corpusBlock}

Produce a concise DUTCH TRANSLATION STYLE PROFILE for how this character should be translated. This is a PRESCRIPTIVE guide for future translations, not just a description. Focus on:
1. **Register**: formal/informal Dutch — specify pronoun forms (je/jij, ge/gij, u) and vocabulary level
2. **Flemish density**: how much Flemish flavoring — heavy (ge/gij, nie, 'k/'t, -ke diminutives, allez, amai), moderate (subtle Belgian warmth), or clean standard Dutch. Be specific about which markers to use or avoid
3. **Character voice**: how the English personality must come through in Dutch — tone, energy, social register
4. **Verbal tics in Dutch**: translated catchphrases, recurring expressions, speech patterns to maintain
5. **Translation approach**: literal vs creative/adaptive, how humor/wordplay should be handled

Format as a compact block for a translation reference card (max 150 words). Use line breaks between sections. Do NOT use markdown headers or bullet points — just plain text with line breaks.${corpusEntries.length > 0 ? '\n\nIMPORTANT: The APPROVED TRANSLATIONS above are human-verified. Your style profile should reflect and reinforce the patterns in these translations.' : ''}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text.trim();
}

async function main() {
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

    if (results[name] && results[name].dutchStyleAnalysis && !ONLY_SPEAKER && !FORCE) {
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
        dutchStyleAnalysis: style,
        analyzedAt: new Date().toISOString()
      };

      fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');
      console.log(`  Done (${style.substring(0, 60)}...)`);

      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`  Error: ${err.message}`);
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
  console.log(`Analyzed: ${Object.keys(results).filter(k => results[k].dutchStyleAnalysis).length} speakers`);
}

main().catch(console.error);
