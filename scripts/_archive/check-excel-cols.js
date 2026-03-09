const XLSX = require('xlsx');
const path = require('path');

// Check E2_World_A1 sheet specifically - it had "Interactable Object, Sign." issue
const filePath = path.join(__dirname, '..', 'excels', '2_asses.masses_E2Proxy.xlsx');
const workbook = XLSX.readFile(filePath);

// Check E2_World_A1_localization sheet
const sheetName = 'E2_World_A1_localization';
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log('Sheet:', sheetName);
console.log('Headers (row 0):', jsonData[0]);
console.log('');
console.log('First 3 data rows:');

for (let rowIdx = 1; rowIdx <= 3; rowIdx++) {
  console.log(`Row ${rowIdx}:`);
  for (let i = 0; i <= 10; i++) {
    console.log(`  Col ${String.fromCharCode(65 + i)} (${i}):`, jsonData[rowIdx] ? jsonData[rowIdx][i] : 'empty');
  }
  console.log('');
}
