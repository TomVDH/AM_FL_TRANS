#!/usr/bin/env node

/**
 * Excel to JSON Converter Script
 * 
 * This script processes all .xlsx files in the excels folder and converts them
 * to JSON format with the following structure:
 * - Column A: Utterer
 * - Column B: Context  
 * - Column C: Source English
 * - Row number for each entry
 * - Tab/Sheet name
 * 
 * Usage: node scripts/excel-to-json.js
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

  // Configuration
  const EXCELS_FOLDER = path.join(__dirname, '..', 'excels');
  const OUTPUT_FOLDER = path.join(__dirname, '..', 'data', 'json');
  const REQUIRED_COLUMNS = {
    A: 'Utterer',
    B: 'Context', 
    C: 'Source English',
    J: 'Translated Dutch'
  };

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
 * Process a single Excel file and convert to JSON
 * @param {string} filePath - Path to the Excel file
 * @returns {Object} Processed data object
 */
function processExcelFile(filePath) {
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
    
    // Check if this is the README file (special handling)
    const isReadmeFile = fileName.toLowerCase().includes('read_me_localizationmanual');
    
    // Process each sheet/tab
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
      
      if (isReadmeFile && sheetName === "Names and World Overview") {
        // Special handling for README Names and World Overview sheet
        console.log(`    🔧 Special processing for README Names and World Overview`);
        
        // Process horizontal structure for specific rows
        const targetRows = [4, 16, 38, 47, 67, 74, 116, 124];
        
        targetRows.forEach(rowNumber => {
          const rowIndex = rowNumber - 1; // Convert to 0-based index
          const row = jsonData[rowIndex];
          
          if (row && row.length > 0) {
            // Create an entry with the entire row data for horizontal processing
            const rowEntry = {
              rowNumber: rowNumber,
              data: row.map((cell, colIndex) => ({
                column: String.fromCharCode(65 + colIndex), // Convert to A, B, C, etc.
                value: cell ? cell.toString().trim() : ''
              }))
            };
            
            sheetData.entries.push(rowEntry);
            console.log(`    ✅ Processed row ${rowNumber} with ${row.length} columns`);
          }
        });
      } else {
        // Standard vertical processing for other files/sheets
        jsonData.forEach((row, rowIndex) => {
          // Skip empty rows
          if (!row || row.length === 0) return;
          
          // Extract data from columns A, B, C, J (indices 0, 1, 2, 9)
          const utterer = row[0] || '';
          const context = row[1] || '';
          const sourceEnglish = row[2] || '';
          const translatedDutch = row[9] || ''; // Column J (index 9)
          
          // Only include rows that have at least some data
          if (utterer || context || sourceEnglish) {
            sheetData.entries.push({
              rowNumber: rowIndex + 1, // Excel rows are 1-indexed
              utterer: utterer.toString().trim(),
              context: context.toString().trim(),
              sourceEnglish: sourceEnglish.toString().trim(),
              translatedDutch: translatedDutch.toString().trim()
            });
          }
        });
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
  console.log('🚀 Starting Excel to JSON conversion...\n');
  
  // Ensure output directory exists
  ensureOutputDirectory();
  
  // Get all Excel files
  const excelFiles = fs.readdirSync(EXCELS_FOLDER)
    .filter(file => file.endsWith('.xlsx'))
    .map(file => path.join(EXCELS_FOLDER, file));
  
  if (excelFiles.length === 0) {
    console.log('❌ No Excel files found in excels folder');
    return;
  }
  
  console.log(`📁 Found ${excelFiles.length} Excel files to process\n`);
  
  // Process each file
  const results = [];
  excelFiles.forEach((filePath, index) => {
    console.log(`[${index + 1}/${excelFiles.length}]`);
    const result = processExcelFile(filePath);
    results.push(result);
    
    if (!result.error) {
      saveToJson(result);
    }
    console.log(''); // Empty line for readability
  });
  
  // Generate summary
  const summary = generateSummary(results);
  
  // Print final summary
  console.log('🎉 Processing complete!');
  console.log(`📊 Summary:`);
  console.log(`   Files processed: ${summary.totalFiles}`);
  console.log(`   Successful: ${summary.successfulFiles}`);
  console.log(`   Failed: ${summary.failedFiles}`);
  console.log(`   Total sheets: ${summary.totalSheets}`);
  console.log(`   Total entries: ${summary.totalEntries}`);
  console.log(`\n📁 Output location: ${OUTPUT_FOLDER}`);
  
  if (summary.failedFiles > 0) {
    console.log('\n❌ Failed files:');
    summary.files.filter(f => !f.success).forEach(f => {
      console.log(`   - ${f.fileName}: ${f.error}`);
    });
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  processExcelFile,
  saveToJson,
  generateSummary
}; 