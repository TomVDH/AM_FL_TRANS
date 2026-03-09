#!/usr/bin/env node

/**
 * Download Google Sheets as XLSX
 *
 * Downloads all source Google Sheets as .xlsx files into both:
 *   /excels/           – working copies (may be modified by translation workflow)
 *   /excels/Originals/ – pristine copies (never modified, used as reference)
 *
 * Sheets must be publicly accessible (view access).
 *
 * Usage: node scripts/download-sheets.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const EXCELS_FOLDER = path.join(__dirname, '..', 'excels');
const ORIGINALS_FOLDER = path.join(EXCELS_FOLDER, 'Originals');

// Google Sheet ID → local filename mapping (sequential episodes)
const SHEETS = [
  { id: '1ScGhva1rUcwqup5rWjePK43gnvxME4mVgZvPZlIfWHQ', file: '0_asses.masses_Manager+Intermissions+E0Proxy.xlsx' },
  { id: '1TTUN6f_DACWw2VFxPP5sBbzKSMvpMZrG8XTsqcpw0SU', file: '1_asses.masses_E1Proxy.xlsx' },
  { id: '14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow', file: '2_asses.masses_E2Proxy.xlsx' },
  { id: '1dPFzn_FCcmgLx8HuuMcxBa4X29ixYnlbNqNkcVN95yY', file: '3_asses.masses_E3Proxy.xlsx' },
  { id: '1KzgaFaoUWE2Jv5eBfTryh8kiw944Q3MBNwtlaofpOn0', file: '4_asses.masses_E4Proxy.xlsx' },
  { id: '1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E', file: '5_asses.masses_E5Proxy.xlsx' },
  { id: '1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU', file: '6_asses.masses_E6Proxy.xlsx' },
  { id: '1evCSy0b20NNb4mfndqDVtc-xtfZ_a7bmTm2lxlpSuYA', file: '7_asses.masses_E7Proxy.xlsx' },
  { id: '1mJjvrManB-mwN-2bawLltEeRoUTq-6ch9OW5_Zyu6v0', file: '8_asses.masses_E8Proxy.xlsx' },
  { id: '1zG-g9HCyECCTzY3Yc-Un-K5I1DYAjvwD9GdHj7mle_c', file: '9_asses.masses_E9Proxy.xlsx' },
  { id: '1Q1WSEJSGm9ZPEO6bfDNpX8wqXolFhyGad-17rJzc0nw', file: '10_asses.masses_E10Proxy.xlsx' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      // Follow redirects (Google uses them)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve, reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  // Ensure both output directories exist
  for (const dir of [EXCELS_FOLDER, ORIGINALS_FOLDER]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  console.log(`Downloading ${SHEETS.length} sheets...`);
  console.log(`  → ${EXCELS_FOLDER}`);
  console.log(`  → ${ORIGINALS_FOLDER}\n`);

  let success = 0;
  let failed = 0;

  for (const sheet of SHEETS) {
    const url = `https://docs.google.com/spreadsheets/d/${sheet.id}/export?format=xlsx`;
    const destExcels = path.join(EXCELS_FOLDER, sheet.file);
    const destOriginals = path.join(ORIGINALS_FOLDER, sheet.file);

    process.stdout.write(`  ${sheet.file} ... `);
    try {
      // Download to /excels/
      await downloadFile(url, destExcels);
      const size = fs.statSync(destExcels).size;

      // Copy to /excels/Originals/
      fs.copyFileSync(destExcels, destOriginals);

      console.log(`OK (${(size / 1024).toFixed(0)} KB)`);
      success++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} downloaded to both folders, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
