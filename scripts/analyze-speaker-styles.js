/**
 * analyze-speaker-styles.js
 *
 * Reads speaker-dialogue.csv and uses Claude to generate
 * per-speaker style/tone summaries.
 *
 * Outputs: data/analysis/speaker-styles.json
 *
 * Run: node scripts/analyze-speaker-styles.js [--min-lines 10] [--speaker="Smart Ass"]
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
      console.log(`  Done (${style.substring(0, 60)}...)`);

      // Rate limiting: 500ms between calls
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
  console.log(`Analyzed: ${Object.keys(results).filter(k => results[k].styleAnalysis).length} speakers`);
}

main().catch(console.error);
