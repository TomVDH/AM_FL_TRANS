#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const BATCH_DIR = '/Users/tomlinson/AM_FL_TRANS/translation-batches';
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable not set');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: API_KEY });

// Load translation examples (only Dutch translations, not Italian)
const loadTranslationExamples = () => {
  const examplesPath = path.join(BATCH_DIR, 'translation-examples.json');
  const examples = JSON.parse(fs.readFileSync(examplesPath, 'utf8'));

  // Filter for entries that have actual Dutch translations (not Italian)
  const dutchExamples = examples.filter(ex => {
    const dutch = ex.dutch || '';
    // Check if it contains typical Dutch words or patterns
    const isDutch = /[ëïöü]|ij|Ezel|Zak|Beest|Gast|kameraden|moraal/i.test(dutch);
    return dutch && isDutch;
  });

  return dutchExamples.slice(0, 200); // Get first 200 for context
};

// Create character name mapping
const createCharacterMapping = (examples) => {
  const mapping = {};
  examples.forEach(ex => {
    if (ex.utterer && ex.utterer.startsWith('CHARACTER.')) {
      const charName = ex.english;
      mapping[charName] = ex.dutch;
    }
  });
  return mapping;
};

// Translate a single batch
const translateBatch = async (batchNumber) => {
  const batchFile = `batch-${String(batchNumber).padStart(3, '0')}.json`;
  const batchPath = path.join(BATCH_DIR, batchFile);
  const outputFile = `batch-${String(batchNumber).padStart(3, '0')}-translated.json`;
  const outputPath = path.join(BATCH_DIR, outputFile);

  // Skip if already translated
  if (fs.existsSync(outputPath)) {
    console.log(`✓ Batch ${batchNumber} already translated, skipping...`);
    return true;
  }

  console.log(`\nTranslating batch ${batchNumber}...`);

  const batchData = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const examples = loadTranslationExamples();
  const charMapping = createCharacterMapping(examples);

  // Build example context
  let exampleContext = 'Character name translations:\n';
  Object.entries(charMapping).slice(0, 30).forEach(([eng, dut]) => {
    exampleContext += `- ${eng} → ${dut}\n`;
  });

  exampleContext += '\nExample translations:\n';
  examples.slice(0, 20).forEach(ex => {
    if (ex.english && ex.dutch && ex.english.length > 5) {
      exampleContext += `EN: ${ex.english}\nNL: ${ex.dutch}\n\n`;
    }
  });

  // Build prompt for translation
  const prompt = `You are translating game dialogue from English to Dutch for "Asses to Masses", an irreverent satirical game about donkeys and labor politics.

${exampleContext}

CRITICAL RULES:
1. Preserve ALL variables like {$NewName} EXACTLY as-is
2. Keep line breaks (\\n) intact
3. Match the irreverent, playful, satirical tone
4. Use existing character name translations consistently
5. Yes → Ja, No → Nee
6. Keep UI text concise
7. Empty keys or "???" stay as-is
8. Match alliteration and wordplay where possible

Translate these ${batchData.length} entries to Dutch. Return ONLY valid JSON (an array of objects), with each entry having all original fields plus a "translatedDutch" field:

${JSON.stringify(batchData, null, 2)}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 16000,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text;

    // Try to parse the response
    let translatedData;
    try {
      // Remove markdown code blocks if present
      const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      translatedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      console.error('Response:', responseText.substring(0, 500));
      return false;
    }

    // Validate the data
    if (!Array.isArray(translatedData) || translatedData.length !== batchData.length) {
      console.error(`Invalid translation data length: expected ${batchData.length}, got ${translatedData.length}`);
      return false;
    }

    // Write translated batch
    fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2), 'utf8');
    console.log(`✓ Batch ${batchNumber} translated successfully (${translatedData.length} entries)`);

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));

    return true;
  } catch (error) {
    console.error(`Error translating batch ${batchNumber}:`, error.message);
    return false;
  }
};

// Update status.json
const updateStatus = (completedBatches) => {
  const statusPath = path.join(BATCH_DIR, 'status.json');
  const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));

  status.completedBatches = completedBatches.length;
  status.batches.forEach(batch => {
    if (completedBatches.includes(batch.batchNumber)) {
      batch.status = 'completed';
    }
  });

  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf8');
  console.log(`\n✓ Updated status.json: ${completedBatches.length}/64 batches completed`);
};

// Main function
const main = async () => {
  console.log('Starting translation of all 64 batches...\n');

  const completedBatches = [];

  for (let i = 1; i <= 64; i++) {
    const success = await translateBatch(i);
    if (success) {
      completedBatches.push(i);

      // Update status every 5 batches
      if (i % 5 === 0) {
        updateStatus(completedBatches);
      }
    } else {
      console.error(`Failed to translate batch ${i}, stopping...`);
      break;
    }
  }

  // Final status update
  updateStatus(completedBatches);

  console.log(`\n========================================`);
  console.log(`Translation complete!`);
  console.log(`Total batches translated: ${completedBatches.length}/64`);
  console.log(`========================================\n`);
};

main().catch(console.error);
