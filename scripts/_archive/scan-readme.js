const XLSX = require('xlsx');
const filePath = '/Users/tomlinson/AM_FL_TRANS/excels/READ_ME_LocalizationManual.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Names and World Overview'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Find all section headers and their structure
console.log('=== Scanning README sheet structure ===\n');

let currentSection = '';
data.forEach((row, i) => {
  const firstCell = (row[0] || '').toString();
  const secondCell = (row[1] || '').toString();

  // Section headers are typically in column B with column A empty
  if (firstCell === '' && secondCell && secondCell === secondCell.toUpperCase() && secondCell.length > 3) {
    currentSection = secondCell;
    console.log('\n=== SECTION: ' + secondCell + ' (row ' + i + ') ===');
  }

  // Rows with labels like 'Character Name', 'Dutch', 'Spanish' etc
  if (firstCell === 'Character Name' || firstCell === 'Place name/Core Concepts') {
    console.log('  English row ' + i + ': ' + JSON.stringify(row.slice(0, 8)));
  }
  if (firstCell === 'Dutch') {
    console.log('  Dutch row ' + i + ': ' + JSON.stringify(row.slice(0, 8)));
  }
});
