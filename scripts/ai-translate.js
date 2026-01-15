const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// Check for API key
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable not set');
  console.error('Please set it with: export ANTHROPIC_API_KEY=your_key_here');
  process.exit(1);
}

const client = new Anthropic({ apiKey });

// Directory paths
const jsonDir = path.join(__dirname, '../data/json');

// Get all JSON files with episode numbers
const jsonFiles = fs.readdirSync(jsonDir)
  .filter(file => file.match(/^\d+_.*\.json$/))
  .sort();

console.log(`Found ${jsonFiles.length} episode files to translate\n`);

// Build context from existing translations
function buildTranslationContext(allData) {
  const examples = [];

  for (const data of allData) {
    for (const sheet of data.sheets) {
      for (const entry of sheet.entries) {
        if (entry.sourceEnglish && entry.translatedDutch &&
            entry.sourceEnglish.trim() !== '' &&
            entry.translatedDutch.trim() !== '') {
          examples.push({
            english: entry.sourceEnglish,
            dutch: entry.translatedDutch,
            context: entry.context || '',
            utterer: entry.utterer || ''
          });
        }
      }
    }
  }

  return examples;
}

// Create translation prompt
function createTranslationPrompt(entries, existingExamples) {
  // Sample some relevant examples
  const exampleText = existingExamples.slice(0, 100).map(ex =>
    `EN: "${ex.english}" → NL: "${ex.dutch}"`
  ).join('\n');

  const entriesToTranslate = entries.map((e, i) => {
    let text = `[${i + 1}]\n`;
    text += `Key: ${e.key}\n`;
    if (e.context) text += `Context: ${e.context}\n`;
    if (e.utterer) text += `Utterer: ${e.utterer}\n`;
    text += `English: ${e.sourceEnglish}\n`;
    text += `Dutch: [TRANSLATE]\n`;
    return text;
  }).join('\n');

  return `You are translating dialogue and UI text for a satirical video game about donkeys to Dutch. The game has an irreverent, playful tone with wordplay around "ass" (donkey/buttocks).

CRITICAL RULES:
1. Preserve ALL variables exactly: {$NewName}, {$variable}, etc.
2. Preserve line breaks: \\n stays as \\n
3. Keep punctuation style similar to English
4. Match the irreverent, playful tone
5. Use existing character name translations consistently
6. Don't translate proper names of people unless shown in examples
7. For empty or placeholder text like "???" or "*** Ass", keep as-is or translate minimally

Here are existing translations for reference:

${exampleText}

Now translate these entries. Return ONLY the translations in this exact format:
[N] Dutch translation here

Entries to translate:

${entriesToTranslate}`;
}

// Parse AI response
function parseTranslations(response) {
  const lines = response.split('\n');
  const translations = [];
  let currentIndex = null;
  let currentTranslation = '';

  for (const line of lines) {
    const match = line.match(/^\[(\d+)\]\s*(.*)$/);
    if (match) {
      if (currentIndex !== null && currentTranslation) {
        translations[currentIndex - 1] = currentTranslation.trim();
      }
      currentIndex = parseInt(match[1]);
      currentTranslation = match[2];
    } else if (currentIndex !== null) {
      currentTranslation += '\n' + line;
    }
  }

  // Don't forget the last one
  if (currentIndex !== null && currentTranslation) {
    translations[currentIndex - 1] = currentTranslation.trim();
  }

  return translations;
}

// Main translation function
async function translateEntries(entries, existingExamples, batchSize = 20) {
  const results = [];

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const prompt = createTranslationPrompt(batch, existingExamples);

    console.log(`  Translating entries ${i + 1}-${Math.min(i + batchSize, entries.length)}...`);

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const translations = parseTranslations(response.content[0].text);
      results.push(...translations);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`  Error translating batch: ${error.message}`);
      // Push empty translations for this batch
      results.push(...batch.map(() => ''));
    }
  }

  return results;
}

// Process files
async function processFiles() {
  // First, load all data to build context
  console.log('Loading existing translations for context...');
  const allData = jsonFiles.map(file => {
    const jsonPath = path.join(jsonDir, file);
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  });

  const existingExamples = buildTranslationContext(allData);
  console.log(`Found ${existingExamples.length} existing translations for context\n`);

  // Track overall progress
  let totalTranslated = 0;
  let totalNeeded = 0;

  // Now process each file
  for (let fileIndex = 0; fileIndex < jsonFiles.length; fileIndex++) {
    const jsonFile = jsonFiles[fileIndex];
    const data = allData[fileIndex];
    const fileName = path.basename(jsonFile, '.json');

    console.log(`\n[${fileIndex + 1}/${jsonFiles.length}] Processing: ${fileName}`);

    let fileModified = false;

    for (const sheet of data.sheets) {
      const needsTranslation = [];
      const indices = [];

      sheet.entries.forEach((entry, idx) => {
        if (entry.sourceEnglish &&
            entry.sourceEnglish.trim() !== '' &&
            (!entry.translatedDutch || entry.translatedDutch.trim() === '')) {
          needsTranslation.push(entry);
          indices.push(idx);
        }
      });

      if (needsTranslation.length === 0) continue;

      totalNeeded += needsTranslation.length;
      console.log(`  Sheet: ${sheet.sheetName} (${needsTranslation.length} entries)`);

      const translations = await translateEntries(needsTranslation, existingExamples);

      // Apply translations
      translations.forEach((translation, i) => {
        if (translation && translation.trim() !== '') {
          sheet.entries[indices[i]].translatedDutch = translation;
          totalTranslated++;
          fileModified = true;
        }
      });
    }

    // Save file if modified
    if (fileModified) {
      const outputPath = path.join(jsonDir, jsonFile);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`  ✓ Saved: ${outputPath}`);
    }
  }

  console.log(`\n✅ Translation complete!`);
  console.log(`Total entries translated: ${totalTranslated} / ${totalNeeded}`);
}

// Run
processFiles().catch(console.error);
