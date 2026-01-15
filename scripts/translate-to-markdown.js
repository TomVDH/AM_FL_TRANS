const fs = require('fs');
const path = require('path');

// Directory paths
const jsonDir = path.join(__dirname, '../data/json');
const outputDir = path.join(__dirname, '../translations-output');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all JSON files with episode numbers
const jsonFiles = fs.readdirSync(jsonDir)
  .filter(file => file.match(/^\d+_.*\.json$/))
  .sort();

console.log(`Found ${jsonFiles.length} episode files to process`);

// Process each JSON file
for (const jsonFile of jsonFiles) {
  const jsonPath = path.join(jsonDir, jsonFile);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const fileName = path.basename(jsonFile, '.json');
  const outputPath = path.join(outputDir, `${fileName}_translations.md`);

  console.log(`\nProcessing: ${fileName}`);

  let markdown = `# Translations for ${fileName}\n\n`;
  markdown += `File: ${data.fileName}\n`;
  markdown += `Processed: ${data.processedAt}\n\n`;
  markdown += `---\n\n`;

  let totalEntries = 0;
  let entriesNeedingTranslation = 0;

  // Process each sheet
  for (const sheet of data.sheets) {
    markdown += `## ${sheet.sheetName}\n\n`;

    const needsTranslation = sheet.entries.filter(entry =>
      entry.sourceEnglish &&
      entry.sourceEnglish.trim() !== '' &&
      (!entry.translatedDutch || entry.translatedDutch.trim() === '')
    );

    totalEntries += sheet.entries.length;
    entriesNeedingTranslation += needsTranslation.length;

    if (needsTranslation.length === 0) {
      markdown += `*All entries in this sheet are already translated.*\n\n`;
      continue;
    }

    markdown += `**Entries needing translation: ${needsTranslation.length}**\n\n`;

    for (const entry of needsTranslation) {
      markdown += `### Row ${entry.rowNumber}\n\n`;
      markdown += `**Key:** \`${entry.key}\`\n\n`;

      if (entry.utterer && entry.utterer !== entry.key) {
        markdown += `**Utterer:** ${entry.utterer}\n\n`;
      }

      if (entry.context && entry.context.trim() !== '') {
        markdown += `**Context:** ${entry.context}\n\n`;
      }

      markdown += `**English:**\n\`\`\`\n${entry.sourceEnglish}\n\`\`\`\n\n`;
      markdown += `**Dutch Translation:**\n\`\`\`\n[NEEDS TRANSLATION]\n\`\`\`\n\n`;
      markdown += `---\n\n`;
    }
  }

  // Add summary at the top
  const summary = `## Summary\n\n` +
    `- **Total entries:** ${totalEntries}\n` +
    `- **Entries needing translation:** ${entriesNeedingTranslation}\n` +
    `- **Already translated:** ${totalEntries - entriesNeedingTranslation}\n` +
    `- **Completion:** ${((totalEntries - entriesNeedingTranslation) / totalEntries * 100).toFixed(1)}%\n\n` +
    `---\n\n`;

  // Insert summary after the header
  const lines = markdown.split('\n');
  lines.splice(5, 0, summary);
  markdown = lines.join('\n');

  // Write markdown file
  fs.writeFileSync(outputPath, markdown, 'utf8');
  console.log(`  ✓ Written: ${outputPath}`);
  console.log(`  - Total entries: ${totalEntries}`);
  console.log(`  - Needs translation: ${entriesNeedingTranslation}`);
}

console.log(`\n✅ All translation markdown files generated in: ${outputDir}`);
