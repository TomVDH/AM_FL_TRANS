#!/usr/bin/env node

/**
 * Excel to JSON Converter Script
 * 
 * This script processes the READ_ME_LocalizationManual.xlsx file and extracts
 * character data from the "Names and World Overview" tab, grouping English
 * and Dutch translations together in unified objects.
 * 
 * Usage: node scripts/excel-to-json.js
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Configuration
const EXCELS_FOLDER = path.join(__dirname, '..', 'excels');
const OUTPUT_FOLDER = path.join(__dirname, '..', 'data', 'json');

/**
 * Ensure output directory exists
 */
function ensureOutputDirectory() {
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
    console.log(`✅ Created output directory: ${OUTPUT_FOLDER}`);
  }
}

/**
 * Extract data from a specific row starting from Column B until empty
 * @param {Array} row - The row data
 * @returns {Array} Array of values from Column B onwards until empty
 */
function extractRowValues(row) {
  const values = [];
  
  // Start from Column B (index 1) and go until empty
  for (let i = 1; i < row.length; i++) {
    const cellValue = row[i] ? row[i].toString().trim() : '';
    if (cellValue === '') {
      break; // Stop at first empty cell
    }
    values.push(cellValue);
  }
  
  return values;
}

/**
 * Process the README file and extract character data with unified structure
 * @param {string} filePath - Path to the Excel file
 * @returns {Object} Processed data object
 */
function processReadmeFile(filePath) {
  const fileName = path.basename(filePath, '.xlsx');
  console.log(`📖 Processing: ${fileName}`);
  
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const result = {
      fileName: fileName,
      processedAt: new Date().toISOString(),
      sheets: []
    };
    
    // Only process the "Names and World Overview" sheet
    const targetSheetName = "Names and World Overview";
    const worksheet = workbook.Sheets[targetSheetName];
    
    if (!worksheet) {
      console.log(`❌ Sheet "${targetSheetName}" not found in ${fileName}`);
      return result;
    }
    
    console.log(`  📋 Processing sheet: ${targetSheetName}`);
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,  // Use array format to preserve row numbers
      defval: ''  // Default value for empty cells
    });
    
    const sheetData = {
      sheetName: targetSheetName,
      entries: []
    };
    
    // Extract data from specific rows
    const characterEnglish = extractRowValues(jsonData[3]); // Row 4
    const characterDutch = extractRowValues(jsonData[15]); // Row 16
    const humanEnglish = extractRowValues(jsonData[37]); // Row 38
    const humanDutch = extractRowValues(jsonData[46]); // Row 47
    const machineEnglish = extractRowValues(jsonData[66]); // Row 67
    const machineDutch = extractRowValues(jsonData[73]); // Row 74
    const locationEnglish = extractRowValues(jsonData[115]); // Row 116
    const locationDutch = extractRowValues(jsonData[123]); // Row 124
    
    // Create unified character entries
    if (characterEnglish.length > 0) {
      characterEnglish.forEach((englishName, index) => {
        const dutchName = characterDutch[index] || '';
        sheetData.entries.push({
          rowNumber: 4,
          context: "Character",
          sourceEnglish: englishName,
          translatedDutch: dutchName
        });
      });
    }
    
    // Create unified human character entries
    if (humanEnglish.length > 0) {
      humanEnglish.forEach((englishName, index) => {
        const dutchName = humanDutch[index] || '';
        sheetData.entries.push({
          rowNumber: 38,
          context: "Human Character",
          sourceEnglish: englishName,
          translatedDutch: dutchName
        });
      });
    }
    
    // Create unified machine entries
    if (machineEnglish.length > 0) {
      machineEnglish.forEach((englishName, index) => {
        const dutchName = machineDutch[index] || '';
        sheetData.entries.push({
          rowNumber: 67,
          context: "Machine",
          sourceEnglish: englishName,
          translatedDutch: dutchName
        });
      });
    }
    
    // Create unified location entries
    if (locationEnglish.length > 0) {
      locationEnglish.forEach((englishName, index) => {
        const dutchName = locationDutch[index] || '';
        sheetData.entries.push({
          rowNumber: 116,
          context: "Location",
          sourceEnglish: englishName,
          translatedDutch: dutchName
        });
      });
    }
    
    // Only include sheets that have data
    if (sheetData.entries.length > 0) {
      result.sheets.push(sheetData);
      console.log(`    ✅ Found ${sheetData.entries.length} unified entries`);
    } else {
      console.log(`    ⚠️  No data found in sheet: ${targetSheetName}`);
    }
    
    return result;
    
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    return {
      fileName: fileName,
      error: error.message,
      processedAt: new Date().toISOString()
    };
  }
}

/**
 * Save processed data to JSON file
 * @param {Object} data - Processed data object
 */
function saveToJson(data) {
  const fileName = data.fileName;
  const outputPath = path.join(OUTPUT_FOLDER, `${fileName}.json`);
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`💾 Saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error saving ${fileName}.json:`, error.message);
  }
}

/**
 * Generate summary report
 * @param {Array} results - Array of processing results
 */
function generateSummary(results) {
  const summary = {
    processedAt: new Date().toISOString(),
    totalFiles: results.length,
    successfulFiles: results.filter(r => !r.error).length,
    failedFiles: results.filter(r => r.error).length,
    totalSheets: results.reduce((sum, r) => sum + (r.sheets ? r.sheets.length : 0), 0),
    totalEntries: results.reduce((sum, r) => {
      if (r.sheets) {
        return sum + r.sheets.reduce((sheetSum, sheet) => sheetSum + sheet.entries.length, 0);
      }
      return sum;
    }, 0),
    files: results.map(r => ({
      fileName: r.fileName,
      success: !r.error,
      sheets: r.sheets ? r.sheets.length : 0,
      entries: r.sheets ? r.sheets.reduce((sum, sheet) => sum + sheet.entries.length, 0) : 0,
      error: r.error || null
    }))
  };
  
  const summaryPath = path.join(OUTPUT_FOLDER, 'processing-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`📊 Summary saved: ${summaryPath}`);
  
  return summary;
}

/**
 * Main processing function
 */
function main() {
  console.log('🚀 Starting README Names and World Overview processing...');
  
  ensureOutputDirectory();
  
  // Only process the README file
  const readmeFile = path.join(EXCELS_FOLDER, 'READ_ME_LocalizationManual.xlsx');
  
  if (!fs.existsSync(readmeFile)) {
    console.error(`❌ README file not found: ${readmeFile}`);
    return;
  }
  
  const results = [];
  
  // Process the README file
  const result = processReadmeFile(readmeFile);
  results.push(result);
  
  if (!result.error) {
    saveToJson(result);
  }
  
  // Generate summary
  const summary = generateSummary(results);
  
  console.log('\n📋 Processing Summary:');
  console.log(`✅ Total files processed: ${summary.totalFiles}`);
  console.log(`✅ Successful: ${summary.successfulFiles}`);
  console.log(`❌ Failed: ${summary.failedFiles}`);
  console.log(`📊 Total unified entries: ${summary.totalEntries}`);
  
  if (summary.failedFiles > 0) {
    console.log('\n❌ Failed files:');
    results.filter(r => r.error).forEach(r => {
      console.log(`  - ${r.fileName}: ${r.error}`);
    });
  }
  
  console.log('\n🎉 Processing complete!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  processReadmeFile,
  saveToJson,
  generateSummary
}; 