const fs = require('fs');
const path = require('path');

// Directory paths
const jsonDir = path.join(__dirname, '../data/json');

// Get all JSON files with episode numbers
const jsonFiles = fs.readdirSync(jsonDir)
  .filter(file => file.match(/^\d+_.*\.json$/))
  .sort();

console.log(`Found ${jsonFiles.length} episode files\n`);

// Load all data
const allData = jsonFiles.map(file => {
  const jsonPath = path.join(jsonDir, file);
  return {
    fileName: file,
    data: JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  };
});

// Build translation context
function buildTranslationExamples() {
  const examples = [];

  for (const { data } of allData) {
    for (const sheet of data.sheets) {
      for (const entry of sheet.entries) {
        if (entry.sourceEnglish && entry.translatedDutch &&
            entry.sourceEnglish.trim() !== '' &&
            entry.translatedDutch.trim() !== '') {
          examples.push({
            english: entry.sourceEnglish,
            dutch: entry.translatedDutch,
            context: entry.context || '',
            utterer: entry.utterer || '',
            key: entry.key
          });
        }
      }
    }
  }

  return examples;
}

// Collect all entries needing translation
function collectUntranslatedEntries() {
  const entries = [];

  for (const { fileName, data } of allData) {
    for (const sheet of data.sheets) {
      sheet.entries.forEach((entry, idx) => {
        if (entry.sourceEnglish &&
            entry.sourceEnglish.trim() !== '' &&
            (!entry.translatedDutch || entry.translatedDutch.trim() === '')) {
          entries.push({
            fileName,
            sheetName: sheet.sheetName,
            entryIndex: idx,
            rowNumber: entry.rowNumber,
            key: entry.key,
            utterer: entry.utterer,
            context: entry.context,
            sourceEnglish: entry.sourceEnglish
          });
        }
      });
    }
  }

  return entries;
}

const examples = buildTranslationExamples();
const untranslated = collectUntranslatedEntries();

console.log(`Existing translations: ${examples.length}`);
console.log(`Entries needing translation: ${untranslated.length}\n`);

// Export batch files for processing
const outputDir = path.join(__dirname, '../translation-batches');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Save examples file
fs.writeFileSync(
  path.join(outputDir, 'translation-examples.json'),
  JSON.stringify(examples, null, 2),
  'utf8'
);

// Split untranslated into batches of 50
const batchSize = 50;
const batches = [];
for (let i = 0; i < untranslated.length; i += batchSize) {
  batches.push(untranslated.slice(i, i + batchSize));
}

console.log(`Creating ${batches.length} batch files...`);

batches.forEach((batch, i) => {
  const batchFile = path.join(outputDir, `batch-${String(i + 1).padStart(3, '0')}.json`);
  fs.writeFileSync(batchFile, JSON.stringify(batch, null, 2), 'utf8');
});

// Create status file
const status = {
  totalBatches: batches.length,
  batchSize,
  totalEntries: untranslated.length,
  completedBatches: 0,
  batches: batches.map((_, i) => ({
    batchNumber: i + 1,
    fileName: `batch-${String(i + 1).padStart(3, '0')}.json`,
    status: 'pending',
    entriesCount: batches[i].length
  }))
};

fs.writeFileSync(
  path.join(outputDir, 'status.json'),
  JSON.stringify(status, null, 2),
  'utf8'
);

console.log(`\n✅ Created ${batches.length} batch files in: ${outputDir}`);
console.log(`\nNext steps:`);
console.log(`1. Process batches using Claude`);
console.log(`2. Run apply-translations.js to update JSON files`);
