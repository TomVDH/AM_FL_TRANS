/**
 * Extract Enhanced Codex Data from Authoritative Sources
 *
 * This script extracts character names, locations, and world terms from:
 * 1. E0 CharacterProfiles_localization (AUTHORITATIVE for character names/translations)
 * 2. READ_ME_LocalizationManual "Names and World Overview" (supplementary data + bios)
 *
 * Enhanced fields (Phase 2):
 * - nicknames: Array of common shorthands (e.g., ["Sick", "Uncle Sick"])
 * - bio: Full character description from README
 * - gender: "male" | "female" | null
 * - dialogueStyle: Speech patterns and conventions
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

// Map to store README metadata by character name
const readmeMetadata = new Map();

// Normalize string for deduplication (remove spaces, lowercase)
function normalizeKey(str) {
  return str.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

/**
 * Generate nicknames from character name
 * Pattern analysis from E0-E4:
 * - "Sick Ass" -> ["Sick", "Sicko"]
 * - "Trusty Ass" -> ["Trusty"]
 * - Prefixed forms: "Uncle Sick", "Aunty Nice", "Comrade Sturdy"
 */
function generateNicknames(englishName) {
  const nicknames = [];

  // Extract base adjective by removing " Ass" suffix
  if (englishName.endsWith(' Ass')) {
    const base = englishName.replace(' Ass', '');
    nicknames.push(base);

    // Add common diminutive/nickname forms
    const nicknameVariants = {
      'Sick': ['Sicko'],
      'Bad': ['Baddie'],
      'Old': ['Oldie'],
      'Nice': ['Nicey'],
      'Sad': ['Saddie'],
      'Lazy': ['Laze'],
      'Kick': ['Kicker'],
      'Hard': ['Hardie'],
    };

    if (nicknameVariants[base]) {
      nicknames.push(...nicknameVariants[base]);
    }

    // Add common prefixed forms found in dialogue
    const kinshipPrefixes = ['Uncle', 'Aunty', 'Comrade', 'Brother', 'Sister'];
    kinshipPrefixes.forEach(prefix => {
      nicknames.push(`${prefix} ${base}`);
    });
  }

  // Human name variations (first name only)
  if (englishName.includes(' ') && !englishName.endsWith(' Ass')) {
    const parts = englishName.split(' ');
    // Add first name as nickname
    if (parts[0] && parts[0].length > 2) {
      nicknames.push(parts[0]);
    }
    // For "Title Name" format like "Miner Jenny" or "Ringmaster Rico"
    if (parts.length === 2 && parts[0].match(/^(Miner|Ringmaster|Zookeeper|Grandma|Child|Asshandler|Radio)/)) {
      nicknames.push(parts[1]); // Just "Jenny", "Rico", etc.
    }
  }

  return nicknames;
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

  // Generate nicknames if not provided
  if (!entry.nicknames || entry.nicknames.length === 0) {
    entry.nicknames = generateNicknames(entry.english);
  }

  // Merge README metadata if available
  const readmeMeta = readmeMetadata.get(normalizeKey(entry.english));
  if (readmeMeta) {
    entry.bio = entry.bio || readmeMeta.bio || '';
    entry.gender = entry.gender || readmeMeta.gender || null;
    entry.dialogueStyle = entry.dialogueStyle || readmeMeta.dialogueStyle || '';
  }

  seenKeys.add(key);
  allEntries.push(entry);
  return true;
}

// ========================================
// PART 0: Extract README metadata first (bios, gender, dialogue style)
// ========================================
console.log('Reading README for character metadata (bios, gender, dialogue)...');
const readmePath = '/Users/tomlinson/AM_FL_TRANS/excels/READ_ME_LocalizationManual.xlsx';
const readmeWorkbook = XLSX.readFile(readmePath);
const worldSheet = readmeWorkbook.Sheets['Names and World Overview'];

if (worldSheet) {
  const data = XLSX.utils.sheet_to_json(worldSheet, { header: 1 });

  // Row 3: Character names (header row with names in columns)
  // Row 4: Sex/Gender
  // Row 5: Description (bio)
  // Row 6: Dialog convention

  const nameRow = data[3] || [];
  const genderRow = data[4] || [];
  const descRow = data[5] || [];
  const dialogRow = data[6] || [];

  // Process main donkeys (columns 1-15)
  for (let col = 1; col < nameRow.length; col++) {
    const name = (nameRow[col] || '').toString().trim();
    if (name && name !== 'Character Name') {
      const normalizedKey = normalizeKey(name);
      readmeMetadata.set(normalizedKey, {
        bio: (descRow[col] || '').toString().trim(),
        gender: (genderRow[col] || '').toString().trim().toLowerCase() || null,
        dialogueStyle: (dialogRow[col] || '').toString().trim(),
      });
    }
  }

  // Process human characters (row 37-38 area)
  const humanNameRow = data[37] || [];
  const humanDescRow = data[38] || [];

  for (let col = 1; col < humanNameRow.length; col++) {
    const name = (humanNameRow[col] || '').toString().trim();
    if (name && name !== 'Character Name') {
      const normalizedKey = normalizeKey(name);
      if (!readmeMetadata.has(normalizedKey)) {
        readmeMetadata.set(normalizedKey, {
          bio: (humanDescRow[col] || '').toString().trim(),
          gender: null, // Humans don't have gender row in same format
          dialogueStyle: '',
        });
      }
    }
  }

  console.log(`  Loaded metadata for ${readmeMetadata.size} characters from README`);
}

// ========================================
// PART 1: Extract from E0 CharacterProfiles (AUTHORITATIVE SOURCE)
// ========================================
console.log('\nReading E0 CharacterProfiles_localization (AUTHORITATIVE)...');
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
          source: 'E0_CharacterProfiles',
          nicknames: [],
          bio: '',
          gender: null,
          dialogueStyle: '',
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

if (worldSheet) {
  const data = XLSX.utils.sheet_to_json(worldSheet, { header: 1 });

  // Parse sections for locations and machines
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
    if (currentSection && (firstCell === 'Character Name' || firstCell === 'Place name/Core Concepts' || firstCell === 'English')) {
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
          name: english.replace(/[^a-zA-Z0-9\s]/g, ''),
          key: `${section.category}.${english.replace(/\s+/g, '')}`,
          description: section.name,
          english,
          dutch,
          category: section.category,
          source: 'README_WorldOverview',
          nicknames: [],
          bio: '',
          gender: null,
          dialogueStyle: '',
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

// Show sample entries with new fields
console.log('\n=== SAMPLE ENTRIES WITH ENHANCED DATA ===\n');
allEntries.filter(e => e.category === 'CHARACTER').slice(0, 5).forEach(e => {
  console.log(`${e.english} -> ${e.dutch}`);
  console.log(`  Nicknames: ${e.nicknames.join(', ') || 'none'}`);
  console.log(`  Gender: ${e.gender || 'unknown'}`);
  console.log(`  Bio: ${(e.bio || '').substring(0, 80)}...`);
  console.log(`  Dialogue: ${(e.dialogueStyle || '').substring(0, 60)}...`);
  console.log('');
});

// Generate CSV with new columns
const csvLines = ['name,description,english,dutch,category,nicknames,bio,gender,dialogueStyle'];
allEntries.forEach(entry => {
  const escapeCsv = (str) => {
    if (!str) return '';
    str = str.toString();
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
    escapeCsv(entry.category || ''),
    escapeCsv(entry.nicknames.join(';')), // Semicolon-separated for CSV
    escapeCsv(entry.bio || ''),
    escapeCsv(entry.gender || ''),
    escapeCsv(entry.dialogueStyle || ''),
  ].join(','));
});

// Write CSV
const outputPath = '/Users/tomlinson/AM_FL_TRANS/data/csv/codex_translations.csv';
fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');
console.log('\n=== OUTPUT ===');
console.log(`Written ${allEntries.length} entries to ${outputPath}`);

// Write JSON with full metadata
const jsonOutput = {
  generated: new Date().toISOString(),
  version: '2.0.0',
  sources: [
    'E0 CharacterProfiles_localization (authoritative for characters)',
    'README Names and World Overview (supplementary + bios/descriptions)'
  ],
  stats: {
    total: allEntries.length,
    fromE0: allEntries.filter(e => e.source === 'E0_CharacterProfiles').length,
    fromREADME: allEntries.filter(e => e.source === 'README_WorldOverview').length,
    withBios: allEntries.filter(e => e.bio && e.bio.length > 0).length,
    withNicknames: allEntries.filter(e => e.nicknames && e.nicknames.length > 0).length,
    byCategory: Object.fromEntries(
      categories.map(cat => [cat, allEntries.filter(e => e.category === cat).length])
    )
  },
  entries: allEntries
};
const jsonPath = '/Users/tomlinson/AM_FL_TRANS/data/json/codex_translations.json';
fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf8');
console.log(`Written ${allEntries.length} entries to ${jsonPath}`);
