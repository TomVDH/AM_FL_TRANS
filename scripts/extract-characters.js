/**
 * Extract Codex Data from Authoritative Sources
 *
 * This script extracts character names, locations, and world terms from:
 * 1. E0 CharacterProfiles_localization (AUTHORITATIVE for character names)
 * 2. READ_ME_LocalizationManual "Names and World Overview" (supplementary data)
 *
 * The README sheet uses a TRANSPOSED layout where:
 * - English names are in one row across columns
 * - Dutch translations are in another row aligned to those columns
 *
 * Output:
 * - data/csv/codex_translations.csv
 * - data/json/codex_translations.json
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const allEntries = [];
const seenKeys = new Set();

// Normalize string for deduplication (remove spaces, lowercase)
function normalizeKey(str) {
  return str.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

// Helper to add entry with deduplication (E0 data takes priority)
function addEntry(entry, isAuthoritative = false) {
  const key = normalizeKey(entry.english);

  // If we've seen this and it's not authoritative, skip
  if (seenKeys.has(key) && !isAuthoritative) {
    return false;
  }

  // If this is authoritative, remove any existing non-authoritative entry
  if (isAuthoritative && seenKeys.has(key)) {
    const existingIndex = allEntries.findIndex(e => normalizeKey(e.english) === key);
    if (existingIndex >= 0 && allEntries[existingIndex].source !== 'E0_CharacterProfiles') {
      allEntries.splice(existingIndex, 1);
    }
  }

  // Basic validation
  if (!entry.english || !entry.dutch || entry.dutch === entry.english) {
    return false;
  }

  // Skip if dutch contains commas (multiple options = not authoritative)
  // Unless this IS the authoritative source
  if (!isAuthoritative && entry.dutch.includes(',')) {
    return false;
  }

  seenKeys.add(key);
  allEntries.push(entry);
  return true;
}

// ========================================
// PART 1: Extract from E0 CharacterProfiles (AUTHORITATIVE SOURCE)
// ========================================
console.log('Reading E0 CharacterProfiles_localization (AUTHORITATIVE)...');
const e0Path = '/Users/tomlinson/AM_FL_TRANS/excels/0_asses.masses_Manager+Intermissions+E0Proxy.xlsx';
const e0Workbook = XLSX.readFile(e0Path);
const charSheet = e0Workbook.Sheets['CharacterProfiles_localization'];

if (charSheet) {
  const data = XLSX.utils.sheet_to_json(charSheet, { header: 1 });

  data.slice(1).forEach((row) => {
    const key = row[0] || '';
    const description = row[1] || '';
    const english = (row[2] || '').toString().trim();
    const dutch = (row[9] || '').toString().trim();

    if (key && english && dutch && dutch !== english && !english.includes('{$')) {
      const category = key.split('.')[0];

      if (category === 'CHARACTER') {
        addEntry({
          name: key.split('.').slice(1).join('.'),
          key,
          description: description || 'Character',
          english,
          dutch,
          category: 'CHARACTER',
          source: 'E0_CharacterProfiles'
        }, true); // Mark as authoritative
      }
    }
  });
}

const e0Count = allEntries.length;
console.log(`  Found ${e0Count} authoritative entries from E0`);

// ========================================
// PART 2: Extract from README (Names and World Overview) - TRANSPOSED FORMAT
// ========================================
console.log('\nReading README Names and World Overview (supplementary)...');
const readmePath = '/Users/tomlinson/AM_FL_TRANS/excels/READ_ME_LocalizationManual.xlsx';
const readmeWorkbook = XLSX.readFile(readmePath);
const worldSheet = readmeWorkbook.Sheets['Names and World Overview'];

if (worldSheet) {
  const data = XLSX.utils.sheet_to_json(worldSheet, { header: 1 });

  // Parse sections
  const sections = [];
  let currentSection = null;

  data.forEach((row, i) => {
    const firstCell = (row[0] || '').toString().trim();
    const secondCell = (row[1] || '').toString().trim();

    // Section headers in column B (column A empty)
    if (firstCell === '' && secondCell && secondCell === secondCell.toUpperCase() && secondCell.length > 3) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        name: secondCell,
        rowIndex: i,
        englishRow: null,
        dutchRow: null,
        category: secondCell.includes('HUMAN') ? 'CHARACTER' :
                  secondCell.includes('DONKEY') ? 'CHARACTER' :
                  secondCell.includes('WORLD') ? 'LOCATION' :
                  secondCell.includes('MACHINE') ? 'CHARACTER' : 'OTHER'
      };
    }

    // English row
    if (currentSection && (firstCell === 'Character Name' || firstCell === 'Place name/Core Concepts')) {
      currentSection.englishRow = row;
      currentSection.englishRowIndex = i;
    }

    // Dutch row
    if (currentSection && firstCell === 'Dutch') {
      currentSection.dutchRow = row;
      currentSection.dutchRowIndex = i;
    }
  });
  if (currentSection) sections.push(currentSection);

  // Extract data from each section
  console.log('  Found sections:', sections.map(s => s.name).join(', '));

  sections.forEach(section => {
    if (!section.englishRow || !section.dutchRow) return;

    // Skip the first column (it's the label)
    for (let col = 1; col < Math.min(section.englishRow.length, section.dutchRow.length); col++) {
      const english = (section.englishRow[col] || '').toString().trim();
      const dutch = (section.dutchRow[col] || '').toString().trim();

      if (english && dutch) {
        addEntry({
          name: english.replace(/[^a-zA-Z0-9]/g, ''),
          key: `${section.category}.${english.replace(/\s+/g, '')}`,
          description: section.name,
          english,
          dutch,
          category: section.category,
          source: 'README_WorldOverview'
        }, false); // Not authoritative
      }
    }
  });
}

const readmeCount = allEntries.length - e0Count;
console.log(`  Added ${readmeCount} supplementary entries from README`);

// ========================================
// SORT AND OUTPUT
// ========================================
allEntries.sort((a, b) => {
  if (a.category !== b.category) return a.category.localeCompare(b.category);
  return a.english.localeCompare(b.english);
});

console.log('\n=== EXTRACTED CODEX DATA ===\n');
console.log('Categories found:');
const categories = [...new Set(allEntries.map(e => e.category))];
categories.forEach(cat => {
  const count = allEntries.filter(e => e.category === cat).length;
  console.log(`  ${cat}: ${count} entries`);
});

console.log(`\nTotal entries: ${allEntries.length}`);

// Show sample entries from each source
console.log('\n=== SAMPLE ENTRIES ===\n');
console.log('From E0 (authoritative):');
allEntries.filter(e => e.source === 'E0_CharacterProfiles').slice(0, 5).forEach(e => {
  console.log(`  ${e.english} -> ${e.dutch}`);
});
console.log('\nFrom README (supplementary):');
allEntries.filter(e => e.source === 'README_WorldOverview').slice(0, 10).forEach(e => {
  console.log(`  [${e.category}] ${e.english} -> ${e.dutch}`);
});

// Generate CSV
const csvLines = ['name,description,english,dutch,category'];
allEntries.forEach(entry => {
  const escapeCsv = (str) => {
    if (!str) return '';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };
  csvLines.push([
    escapeCsv(entry.name),
    escapeCsv(entry.description),
    escapeCsv(entry.english),
    escapeCsv(entry.dutch),
    escapeCsv(entry.category || '')
  ].join(','));
});

// Write CSV
const outputPath = '/Users/tomlinson/AM_FL_TRANS/data/csv/codex_translations.csv';
fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');
console.log('\n=== OUTPUT ===');
console.log(`Written ${allEntries.length} entries to ${outputPath}`);

// Write JSON
const jsonOutput = {
  generated: new Date().toISOString(),
  sources: [
    'E0 CharacterProfiles_localization (authoritative for characters)',
    'README Names and World Overview (supplementary locations/humans)'
  ],
  stats: {
    total: allEntries.length,
    fromE0: allEntries.filter(e => e.source === 'E0_CharacterProfiles').length,
    fromREADME: allEntries.filter(e => e.source === 'README_WorldOverview').length,
    byCategory: Object.fromEntries(
      categories.map(cat => [cat, allEntries.filter(e => e.category === cat).length])
    )
  },
  entries: allEntries
};
const jsonPath = '/Users/tomlinson/AM_FL_TRANS/data/json/codex_translations.json';
fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf8');
console.log(`Written ${allEntries.length} entries to ${jsonPath}`);
