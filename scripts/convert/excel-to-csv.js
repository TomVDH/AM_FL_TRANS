#!/usr/bin/env node

/**
 * Excel to CSV Converter Script
 * 
 * Dedicated CSV processing script for translation consultation.
 * Processes Excel files specifically for CSV output with optimized structure
 * for dynamic translation assistance.
 * 
 * Features:
 * - Optimized CSV structure for translation consultation
 * - Batch processing of EPx files
 * - Clean CSV formatting with proper escaping
 * - Metadata preservation
 * - Performance optimizations for large datasets
 * 
 * Usage: node scripts/excel-to-csv.js
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Configuration
const EXCELS_FOLDER = path.join(__dirname, '..', '..', 'excels');
const CSV_OUTPUT_FOLDER = path.join(__dirname, '..', '..', 'data', 'csv');

/**
 * CSV Processing Configuration
 */
const CSV_CONFIG = {
  delimiter: ',',
  quoteChar: '"',
  lineEnding: '\n',
  includeHeaders: true,
  includeMetadata: true,
  maxRowsPerFile: 10000, // Split large files
  encoding: 'utf8'
};

/**
 * Ensure CSV output directory exists
 */
function ensureCSVDirectory() {
  if (!fs.existsSync(CSV_OUTPUT_FOLDER)) {
    fs.mkdirSync(CSV_OUTPUT_FOLDER, { recursive: true });
    console.log(`✅ Created CSV output directory: ${CSV_OUTPUT_FOLDER}`);
  }
}

/**
 * Escape CSV value with proper quote handling
 * @param {string} value - Value to escape
 * @returns {string} Escaped CSV value
 */
function escapeCSVValue(value) {
  if (!value) return '""';
  
  const stringValue = value.toString();
  
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Create CSV header row
 *
 * Excel Column Structure:
 * A = Key (translation key identifier)
 * B = Description/Context
 * C = Standard/English (source text)
 * D-I = Other languages (ES, FR, PT, IT, DE, TR)
 * J = NL/Dutch (our target translation)
 * K = CA/Catalan
 *
 * @returns {string} CSV header row
 */
function createCSVHeader() {
  return [
    'RowNumber',
    'SheetName',
    'Context',
    'Key',
    'Utterer',
    'SourceEnglish',
    'TranslatedDutch',
    'ProcessedAt'
  ].join(CSV_CONFIG.delimiter) + CSV_CONFIG.lineEnding;
}

/**
 * Convert entry to CSV row
 * @param {Object} entry - Data entry
 * @param {string} sheetName - Sheet name
 * @param {string} processedAt - Processing timestamp
 * @returns {string} CSV row
 */
function entryToCSVRow(entry, sheetName, processedAt) {
  const values = [
    entry.rowNumber || '',
    sheetName || '',
    entry.context || '',
    entry.key || '',
    entry.utterer || '',
    entry.sourceEnglish || '',
    entry.translatedDutch || '',
    processedAt
  ];
  
  return values.map(escapeCSVValue).join(CSV_CONFIG.delimiter) + CSV_CONFIG.lineEnding;
}

/**
 * Process Excel file to CSV format
 * @param {string} filePath - Path to Excel file
 * @returns {Object} Processing result
 */
function processExcelToCSV(filePath) {
  const fileName = path.basename(filePath, '.xlsx');
  console.log(`📊 Processing to CSV: ${fileName}`);
  
  try {
    const workbook = XLSX.readFile(filePath);
    const processedAt = new Date().toISOString();
    
    let csvContent = '';
    let totalEntries = 0;
    const sheetStats = [];
    
    // Add file metadata header
    if (CSV_CONFIG.includeMetadata) {
      csvContent += `# File: ${fileName}${CSV_CONFIG.lineEnding}`;
      csvContent += `# Processed: ${processedAt}${CSV_CONFIG.lineEnding}`;
      csvContent += `# Sheets: ${workbook.SheetNames.length}${CSV_CONFIG.lineEnding}`;
      csvContent += CSV_CONFIG.lineEnding;
    }
    
    // Add CSV header
    if (CSV_CONFIG.includeHeaders) {
      csvContent += createCSVHeader();
    }
    
    // Process each sheet
    workbook.SheetNames.forEach(sheetName => {
      console.log(`  📋 Processing sheet: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: ''
      });
      
      let sheetEntries = 0;
      
      // Process rows (skip header row)
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;
        
        // Excel Column Structure:
        // A (row[0]) = Key (translation key identifier like "SAY.Sign_...")
        // B (row[1]) = Description/Context
        // C (row[2]) = English (source text)
        // D-I (row[3-8]) = ES, FR, PT, IT, DE, TR
        // J (row[9]) = NL/Dutch (target translation)
        // K (row[10]) = CA/Catalan (not used)
        const entry = {
          rowNumber: i + 1,
          key: row[0] ? row[0].toString().trim() : '',           // Column A: Key
          context: row[1] ? row[1].toString().trim() : '',       // Column B: Description
          sourceEnglish: row[2] ? row[2].toString().trim() : '', // Column C: English
          translatedDutch: row[9] ? row[9].toString().trim() : '', // Column J: Dutch
          utterer: '' // We don't have a separate utterer column; key serves this purpose
        };
        
        // Only include rows with source text
        if (entry.sourceEnglish) {
          csvContent += entryToCSVRow(entry, sheetName, processedAt);
          sheetEntries++;
          totalEntries++;
        }
      }
      
      sheetStats.push({ sheetName, entries: sheetEntries });
      console.log(`    ✅ ${sheetEntries} entries processed`);
    });
    
    return {
      fileName,
      success: true,
      csvContent,
      totalSheets: workbook.SheetNames.length,
      totalEntries,
      sheetStats,
      processedAt
    };
    
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    return {
      fileName,
      success: false,
      error: error.message,
      processedAt: new Date().toISOString()
    };
  }
}

/**
 * Save CSV content to file
 * @param {Object} result - Processing result
 */
function saveCSVFile(result) {
  if (!result.success) return;
  
  const outputPath = path.join(CSV_OUTPUT_FOLDER, `${result.fileName}.csv`);
  
  try {
    fs.writeFileSync(outputPath, result.csvContent, CSV_CONFIG.encoding);
    console.log(`💾 CSV saved: ${outputPath}`);
    console.log(`   📊 ${result.totalEntries} entries, ${result.totalSheets} sheets`);
  } catch (error) {
    console.error(`❌ Error saving CSV ${result.fileName}:`, error.message);
  }
}

/**
 * Generate CSV processing summary
 * @param {Array} results - Processing results
 */
function generateCSVSummary(results) {
  const summary = {
    processedAt: new Date().toISOString(),
    totalFiles: results.length,
    successfulFiles: results.filter(r => r.success).length,
    failedFiles: results.filter(r => !r.success).length,
    totalSheets: results.reduce((sum, r) => sum + (r.totalSheets || 0), 0),
    totalEntries: results.reduce((sum, r) => sum + (r.totalEntries || 0), 0),
    files: results.map(r => ({
      fileName: r.fileName,
      success: r.success,
      sheets: r.totalSheets || 0,
      entries: r.totalEntries || 0,
      error: r.error || null
    }))
  };
  
  // Save summary as both JSON and CSV
  const summaryJSONPath = path.join(CSV_OUTPUT_FOLDER, 'csv-processing-summary.json');
  const summaryCSVPath = path.join(CSV_OUTPUT_FOLDER, 'csv-processing-summary.csv');
  
  try {
    // JSON summary
    fs.writeFileSync(summaryJSONPath, JSON.stringify(summary, null, 2));
    console.log(`📋 JSON Summary: ${summaryJSONPath}`);
    
    // CSV summary
    let csvSummary = 'FileName,Success,Sheets,Entries,Error\n';
    summary.files.forEach(file => {
      csvSummary += [
        escapeCSVValue(file.fileName),
        file.success,
        file.sheets,
        file.entries,
        escapeCSVValue(file.error || '')
      ].join(',') + '\n';
    });
    
    fs.writeFileSync(summaryCSVPath, csvSummary);
    console.log(`📋 CSV Summary: ${summaryCSVPath}`);
    
  } catch (error) {
    console.error('❌ Error saving summary:', error.message);
  }
  
  return summary;
}

/**
 * Main CSV processing function
 */
function main() {
  console.log('🚀 Starting Excel to CSV processing...');
  
  ensureCSVDirectory();
  
  // Get all Excel files
  const excelFiles = fs.readdirSync(EXCELS_FOLDER)
    .filter(file => file.endsWith('.xlsx'))
    .map(file => path.join(EXCELS_FOLDER, file));
  
  if (excelFiles.length === 0) {
    console.error('❌ No Excel files found');
    return;
  }
  
  console.log(`📁 Found ${excelFiles.length} Excel files for CSV processing`);
  
  const results = [];
  
  // Process each file
  excelFiles.forEach(filePath => {
    const result = processExcelToCSV(filePath);
    results.push(result);
    
    if (result.success) {
      saveCSVFile(result);
    }
  });
  
  // Generate summary
  const summary = generateCSVSummary(results);
  
  console.log('\n📋 CSV Processing Summary:');
  console.log(`✅ Total files: ${summary.totalFiles}`);
  console.log(`✅ Successful: ${summary.successfulFiles}`);
  console.log(`❌ Failed: ${summary.failedFiles}`);
  console.log(`📊 Total sheets: ${summary.totalSheets}`);
  console.log(`📊 Total entries: ${summary.totalEntries}`);
  
  if (summary.failedFiles > 0) {
    console.log('\n❌ Failed files:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.fileName}: ${r.error}`);
    });
  }
  
  console.log('\n🎉 CSV processing complete!');
  console.log(`📁 Output directory: ${CSV_OUTPUT_FOLDER}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  processExcelToCSV,
  saveCSVFile,
  generateCSVSummary,
  escapeCSVValue,
  CSV_CONFIG
};