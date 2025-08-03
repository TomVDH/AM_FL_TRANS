#!/usr/bin/env node

/**
 * Test script for README file processing
 * Validates that the correct rows are being extracted and processed
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Import the processing functions
const { processReadmeFile } = require('./excel-to-json.js');

// Configuration
const EXCELS_FOLDER = path.join(__dirname, '..', 'excels');
const OUTPUT_FOLDER = path.join(__dirname, '..', 'data', 'json');

/**
 * Test the README file processing
 */
function testReadmeProcessing() {
  console.log('🧪 Testing README file processing...\n');
  
  // Find README files
  const readmeFiles = fs.readdirSync(EXCELS_FOLDER)
    .filter(file => (file.includes('README') || file.includes('READ_ME')) && file.endsWith('.xlsx'))
    .map(file => path.join(EXCELS_FOLDER, file));
  
  if (readmeFiles.length === 0) {
    console.error('❌ No README files found');
    return;
  }
  
  console.log(`📁 Found ${readmeFiles.length} README file(s)`);
  
  readmeFiles.forEach((filePath, index) => {
    const fileName = path.basename(filePath, '.xlsx');
    console.log(`\n📖 Testing: ${fileName}`);
    
    // Test the processing function
    const result = processReadmeFile(filePath);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      return;
    }
    
    console.log(`✅ Processing successful`);
    console.log(`📊 Sheets processed: ${result.sheets.length}`);
    
    // Analyze the "Names and World Overview" sheet
    const namesSheet = result.sheets.find(sheet => sheet.sheetName === "Names and World Overview");
    
    if (namesSheet) {
      console.log(`\n📋 "Names and World Overview" Analysis:`);
      console.log(`   Total entries: ${namesSheet.entries.length}`);
      
      // Group by context
      const contextGroups = {};
      namesSheet.entries.forEach(entry => {
        if (!contextGroups[entry.context]) {
          contextGroups[entry.context] = [];
        }
        contextGroups[entry.context].push(entry);
      });
      
      Object.keys(contextGroups).forEach(context => {
        console.log(`   ${context}: ${contextGroups[context].length} entries`);
      });
      
      // Show sample entries
      console.log(`\n📝 Sample entries:`);
      namesSheet.entries.slice(0, 3).forEach((entry, index) => {
        console.log(`   ${index + 1}. Row ${entry.rowNumber} - ${entry.context}:`);
        console.log(`      English: "${entry.sourceEnglish}"`);
        console.log(`      Dutch: "${entry.translatedDutch}"`);
      });
      
      // Validate row numbers
      const expectedRows = [4, 38, 67, 116];
      const actualRows = [...new Set(namesSheet.entries.map(e => e.rowNumber))];
      const validRows = actualRows.every(row => expectedRows.includes(row));
      
      console.log(`\n✅ Row validation: ${validRows ? 'PASS' : 'FAIL'}`);
      console.log(`   Expected rows: ${expectedRows.join(', ')}`);
      console.log(`   Actual rows: ${actualRows.sort((a, b) => a - b).join(', ')}`);
      
    } else {
      console.log(`❌ "Names and World Overview" sheet not found`);
    }
    
    // Check if JSON file was created
    const jsonPath = path.join(OUTPUT_FOLDER, `${fileName}.json`);
    if (fs.existsSync(jsonPath)) {
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      console.log(`\n💾 JSON file created: ${jsonPath}`);
      console.log(`   File size: ${(fs.statSync(jsonPath).size / 1024).toFixed(2)} KB`);
      console.log(`   Total entries in JSON: ${jsonData.sheets.reduce((sum, sheet) => sum + sheet.entries.length, 0)}`);
    } else {
      console.log(`❌ JSON file not created: ${jsonPath}`);
    }
  });
}

/**
 * Test raw Excel data extraction
 */
function testRawDataExtraction() {
  console.log('\n🔍 Testing raw Excel data extraction...\n');
  
  const readmeFile = fs.readdirSync(EXCELS_FOLDER)
    .filter(file => (file.includes('README') || file.includes('READ_ME')) && file.endsWith('.xlsx'))[0];
  
  if (!readmeFile) {
    console.error('❌ No README file found for raw data test');
    return;
  }
  
  const filePath = path.join(EXCELS_FOLDER, readmeFile);
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets["Names and World Overview"];
  
  if (!worksheet) {
    console.error('❌ "Names and World Overview" sheet not found');
    return;
  }
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,
    defval: ''
  });
  
  console.log(`📊 Raw data analysis:`);
  console.log(`   Total rows: ${jsonData.length}`);
  
  // Test specific rows
  const testRows = [3, 15, 37, 46, 66, 73, 115, 123];
  
  testRows.forEach(rowIndex => {
    const row = jsonData[rowIndex];
    if (row) {
      const nonEmptyCells = row.filter(cell => cell && cell.toString().trim() !== '').length;
      console.log(`   Row ${rowIndex + 1}: ${nonEmptyCells} non-empty cells`);
      
      // Show first few values
      const values = row.slice(1, 6).filter(cell => cell && cell.toString().trim() !== '');
      if (values.length > 0) {
        console.log(`      Sample values: ${values.slice(0, 3).map(v => `"${v}"`).join(', ')}`);
      }
    } else {
      console.log(`   Row ${rowIndex + 1}: Not found`);
    }
  });
}

/**
 * Run all tests
 */
function runTests() {
  console.log('🚀 Starting README processing tests...\n');
  
  testReadmeProcessing();
  testRawDataExtraction();
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testReadmeProcessing,
  testRawDataExtraction,
  runTests
}; 