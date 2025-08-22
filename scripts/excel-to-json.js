#!/usr/bin/env node

/**
 * Excel to JSON/CSV Converter Script
 * 
 * This script processes Excel files and converts them to both JSON and CSV formats.
 * Supports special processing for READ_ME files and standard processing for EPx files.
 * 
 * Features:
 * - JSON output for auto-highlighter system
 * - CSV output for dynamic consultation during translation
 * - Batch processing of all Excel files
 * - Special handling for different file types
 * 
 * Usage: node scripts/excel-to-json.js
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Configuration
const EXCELS_FOLDER = path.join(__dirname, '..', 'excels');
const JSON_OUTPUT_FOLDER = path.join(__dirname, '..', 'data', 'json');
const CSV_OUTPUT_FOLDER = path.join(__dirname, '..', 'data', 'csv');

/**
 * Ensure output directories exist
 */
function ensureOutputDirectories() {
  if (!fs.existsSync(JSON_OUTPUT_FOLDER)) {
    fs.mkdirSync(JSON_OUTPUT_FOLDER, { recursive: true });
    console.log(`✅ Created JSON output directory: ${JSON_OUTPUT_FOLDER}`);
  }
  if (!fs.existsSync(CSV_OUTPUT_FOLDER)) {
    fs.mkdirSync(CSV_OUTPUT_FOLDER, { recursive: true });
    console.log(`✅ Created CSV output directory: ${CSV_OUTPUT_FOLDER}`);
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
 * Process a standard Excel file with Dutch translations
 * @param {string} filePath - Path to the Excel file
 * @returns {Object} Processed data object
 */
function processStandardExcelFile(filePath) {
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
    
    // Process all sheets in the workbook
    workbook.SheetNames.forEach(sheetName => {
      console.log(`  📋 Processing sheet: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,  // Use array format to preserve row numbers
        defval: ''  // Default value for empty cells
      });
      
      const sheetData = {
        sheetName: sheetName,
        entries: []
      };
      
      // Process each row starting from row 2 (skip header)
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        // Skip empty rows
        if (!row || row.length === 0) continue;
        
        // Extract data from columns A, B, C, and J (Dutch)
        const utterer = row[0] ? row[0].toString().trim() : '';
        const context = row[1] ? row[1].toString().trim() : '';
        const sourceEnglish = row[2] ? row[2].toString().trim() : '';
        const translatedDutch = row[9] ? row[9].toString().trim() : ''; // Column J (index 9)
        
        // Only add entries that have source text
        if (sourceEnglish && sourceEnglish !== '') {
          sheetData.entries.push({
            rowNumber: i + 1, // Excel row number (1-based)
            utterer: utterer,
            context: context,
            sourceEnglish: sourceEnglish,
            translatedDutch: translatedDutch
          });
        }
      }
      
      // Only include sheets that have data
      if (sheetData.entries.length > 0) {
        result.sheets.push(sheetData);
        console.log(`    ✅ Found ${sheetData.entries.length} entries`);
      } else {
        console.log(`    ⚠️  No data found in sheet: ${sheetName}`);
      }
    });
    
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
    
    // Extract data from specific rows (with safety checks)
    // Get the A column keys for each row
    const characterKeys = jsonData[3] ? (jsonData[3][0] || '') : '';
    const humanKeys = jsonData[37] ? (jsonData[37][0] || '') : '';
    const machineKeys = jsonData[66] ? (jsonData[66][0] || '') : '';
    const locationKeys = jsonData[115] ? (jsonData[115][0] || '') : '';
    
    const characterEnglish = jsonData[3] ? extractRowValues(jsonData[3]) : []; // Row 4
    const characterDutch = jsonData[15] ? extractRowValues(jsonData[15]) : []; // Row 16
    const humanEnglish = jsonData[37] ? extractRowValues(jsonData[37]) : []; // Row 38
    const humanDutch = jsonData[46] ? extractRowValues(jsonData[46]) : []; // Row 47
    const machineEnglish = jsonData[66] ? extractRowValues(jsonData[66]) : []; // Row 67
    const machineDutch = jsonData[73] ? extractRowValues(jsonData[73]) : []; // Row 74
    const locationEnglish = jsonData[115] ? extractRowValues(jsonData[115]) : []; // Row 116
    const locationDutch = jsonData[123] ? extractRowValues(jsonData[123]) : []; // Row 124
    
    // Create unified character entries
    if (characterEnglish.length > 0) {
      characterEnglish.forEach((englishName, index) => {
        const dutchName = characterDutch[index] || '';
        sheetData.entries.push({
          rowNumber: 4,
          context: "Character",
          key: characterKeys, // A column key/label
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
          key: humanKeys, // A column key/label
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
          key: machineKeys, // A column key/label
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
          key: locationKeys, // A column key/label
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
 * Convert JSON data to CSV format using modular CSV processor
 * @param {Object} data - Processed data object
 * @returns {string} CSV formatted string
 */
function convertToCSV(data) {
  if (!data.sheets || data.sheets.length === 0) {
    return '';
  }
  
  // Use the dedicated CSV processing script for consistency
  const csvProcessor = require('./excel-to-csv');
  
  // Create CSV content using the dedicated processor's format
  let csvContent = '';
  const processedAt = data.processedAt || new Date().toISOString();
  
  // Add metadata header
  csvContent += `# File: ${data.fileName}\n`;
  csvContent += `# Processed: ${processedAt}\n`;
  csvContent += `# Sheets: ${data.sheets.length}\n\n`;
  
  // Add CSV header
  csvContent += 'RowNumber,SheetName,Context,Key,Utterer,SourceEnglish,TranslatedDutch,ProcessedAt\n';
  
  // Add data rows
  data.sheets.forEach(sheet => {
    sheet.entries.forEach(entry => {
      const row = [
        entry.rowNumber || '',
        sheet.sheetName || '',
        entry.context || '',
        entry.key || '',
        entry.utterer || '',
        csvProcessor.escapeCSVValue(entry.sourceEnglish || ''),
        csvProcessor.escapeCSVValue(entry.translatedDutch || ''),
        processedAt
      ];
      csvContent += row.join(',') + '\n';
    });
  });
  
  return csvContent;
}

/**
 * Save processed data to JSON file
 * @param {Object} data - Processed data object
 */
function saveToJson(data) {
  const fileName = data.fileName;
  const outputPath = path.join(JSON_OUTPUT_FOLDER, `${fileName}.json`);
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`💾 JSON saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error saving ${fileName}.json:`, error.message);
  }
}

/**
 * Save processed data to CSV file
 * @param {Object} data - Processed data object
 */
function saveToCSV(data) {
  const fileName = data.fileName;
  const outputPath = path.join(CSV_OUTPUT_FOLDER, `${fileName}.csv`);
  
  try {
    const csvContent = convertToCSV(data);
    fs.writeFileSync(outputPath, csvContent, 'utf8');
    console.log(`📊 CSV saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error saving ${fileName}.csv:`, error.message);
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
  
  const summaryPath = path.join(JSON_OUTPUT_FOLDER, 'processing-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`📊 Summary saved: ${summaryPath}`);
  
  return summary;
}

/**
 * Main processing function
 */
function main() {
  console.log('🚀 Starting Excel to JSON/CSV processing...');
  
  ensureOutputDirectories();
  
  // Get all Excel files
  const excelFiles = fs.readdirSync(EXCELS_FOLDER)
    .filter(file => file.endsWith('.xlsx'))
    .map(file => path.join(EXCELS_FOLDER, file));
  
  if (excelFiles.length === 0) {
    console.error('❌ No Excel files found');
    return;
  }
  
  console.log(`📁 Found ${excelFiles.length} Excel files to process`);
  
  const results = [];
  
  // Process each Excel file
  excelFiles.forEach(filePath => {
    const fileName = path.basename(filePath, '.xlsx');
    
    // Use special processing for README file
    if (fileName.includes('README') || fileName.includes('READ_ME')) {
      const result = processReadmeFile(filePath);
      results.push(result);
      if (!result.error) {
        saveToJson(result);
        saveToCSV(result);
      }
    } else {
      // Use standard processing for all other files (EPx files, etc.)
      const result = processStandardExcelFile(filePath);
      results.push(result);
      if (!result.error) {
        saveToJson(result);
        saveToCSV(result);
      }
    }
  });
  
  // Generate summary
  const summary = generateSummary(results);
  
  console.log('\n📋 Processing Summary:');
  console.log(`✅ Total files processed: ${summary.totalFiles}`);
  console.log(`✅ Successful: ${summary.successfulFiles}`);
  console.log(`❌ Failed: ${summary.failedFiles}`);
  console.log(`📊 Total sheets: ${summary.totalSheets}`);
  console.log(`📊 Total entries: ${summary.totalEntries}`);
  
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
  processStandardExcelFile,
  saveToJson,
  saveToCSV,
  convertToCSV,
  generateSummary
}; 