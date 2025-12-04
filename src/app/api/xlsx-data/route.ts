import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

/**
 * XLSX Data API Endpoint
 *
 * Processes Excel files using the same conversion logic as scripts/excel-to-json.js
 * Returns data in a format compatible with the translation workflow
 */

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface XLSXEntry {
  rowNumber: number;
  utterer: string;
  context: string;
  sourceEnglish: string;
  translatedDutch: string;
}

interface XLSXSheet {
  sheetName: string;
  entries: XLSXEntry[];
}

interface XLSXData {
  fileName: string;
  processedAt: string;
  sheets: XLSXSheet[];
}

/**
 * Process a standard Excel file with Dutch translations
 * Uses the same logic as scripts/excel-to-json.js
 */
function processExcelFile(filePath: string): XLSXData {
  const fileName = path.basename(filePath, '.xlsx');

  // Read the Excel file
  const workbook = XLSX.readFile(filePath);
  const result: XLSXData = {
    fileName,
    processedAt: new Date().toISOString(),
    sheets: []
  };

  // Process all sheets in the workbook
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,  // Use array format to preserve row numbers
      defval: ''  // Default value for empty cells
    }) as any[][];

    const sheetData: XLSXSheet = {
      sheetName,
      entries: []
    };

    // Process each row starting from row 2 (skip header at index 0)
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
          utterer,
          context,
          sourceEnglish,
          translatedDutch
        });
      }
    }

    // Only include sheets that have data
    if (sheetData.entries.length > 0) {
      result.sheets.push(sheetData);
    }
  });

  return result;
}

/**
 * GET /api/xlsx-data?file=<filename>
 *
 * Processes an Excel file and returns its data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing required parameter: file' },
        { status: 400 }
      );
    }

    const excelDir = path.join(process.cwd(), 'excels');
    const filePath = path.join(excelDir, fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found: ${fileName}` },
        { status: 404 }
      );
    }

    // Check file size
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds maximum size limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    // Process the Excel file
    const data = processExcelFile(filePath);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error processing Excel data:', error);
    return NextResponse.json(
      { error: 'Failed to process Excel file' },
      { status: 500 }
    );
  }
}
