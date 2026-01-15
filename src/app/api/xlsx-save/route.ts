import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

/**
 * POST /api/xlsx-save
 *
 * Saves a translation directly to the source Excel file.
 * WARNING: Modifies the original file - no backup is created.
 *
 * Request body:
 * {
 *   sourceFileName: string;  // Excel filename (e.g., "2_asses.masses_E2Proxy.xlsx")
 *   sheetName: string;       // Sheet to modify (e.g., "E2Proxy")
 *   cellRef: string;         // Cell reference (e.g., "J5")
 *   value: string;           // Translation text to write
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   savedTo: string;         // The source filename
 *   cellRef: string;         // The cell that was modified
 *   timestamp: string;       // ISO timestamp of the save
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceFileName, sheetName, cellRef, value } = body;

    // Validate required fields
    if (!sourceFileName || typeof sourceFileName !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid sourceFileName' },
        { status: 400 }
      );
    }

    if (!sheetName || typeof sheetName !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid sheetName' },
        { status: 400 }
      );
    }

    if (!cellRef || typeof cellRef !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid cellRef' },
        { status: 400 }
      );
    }

    // Value can be empty string, but must be a string
    if (typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid value' },
        { status: 400 }
      );
    }

    // Validate cell reference format (e.g., J5, A1, AB123)
    const cellRefPattern = /^[A-Z]+\d+$/;
    if (!cellRefPattern.test(cellRef)) {
      return NextResponse.json(
        { error: 'Invalid cellRef format. Expected format like "J5" or "AB123"' },
        { status: 400 }
      );
    }

    // Validate filename (security check - no path traversal)
    if (sourceFileName.includes('..') || sourceFileName.includes('/') || sourceFileName.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    // Ensure filename ends with .xlsx
    if (!sourceFileName.endsWith('.xlsx')) {
      return NextResponse.json(
        { error: 'File must be an Excel file (.xlsx)' },
        { status: 400 }
      );
    }

    // Build file paths - write directly to source file
    const excelsDir = path.join(process.cwd(), 'excels');
    const sourceFilePath = path.join(excelsDir, sourceFileName);

    // Check if source file exists
    if (!fs.existsSync(sourceFilePath)) {
      return NextResponse.json(
        { error: `Source file not found: ${sourceFileName}` },
        { status: 404 }
      );
    }

    // Load workbook directly from source file using ExcelJS (preserves formatting!)
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourceFilePath);

    // Get the worksheet
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      const availableSheets = workbook.worksheets.map(ws => ws.name).join(', ');
      return NextResponse.json(
        { error: `Sheet not found: ${sheetName}. Available sheets: ${availableSheets}` },
        { status: 404 }
      );
    }

    // Write the cell value (ExcelJS preserves all formatting!)
    const cell = worksheet.getCell(cellRef);
    cell.value = value;

    // Save the workbook directly to source file (preserves all formatting, colors, borders, etc.)
    await workbook.xlsx.writeFile(sourceFilePath);

    // Return success response
    return NextResponse.json({
      success: true,
      savedTo: sourceFileName,
      cellRef,
      value: value.length > 50 ? value.substring(0, 50) + '...' : value,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error saving to Excel:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/xlsx-save
 *
 * Check the status of the source file (whether it exists and when it was last modified)
 *
 * Query params:
 * - sourceFileName: The Excel filename
 *
 * Response:
 * {
 *   exists: boolean;
 *   fileName: string;
 *   lastModified: string | null;  // ISO timestamp
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sourceFileName = searchParams.get('sourceFileName');

    if (!sourceFileName) {
      return NextResponse.json(
        { error: 'Missing sourceFileName parameter' },
        { status: 400 }
      );
    }

    // Validate filename
    if (sourceFileName.includes('..') || sourceFileName.includes('/') || sourceFileName.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    const excelsDir = path.join(process.cwd(), 'excels');
    const sourceFilePath = path.join(excelsDir, sourceFileName);

    const exists = fs.existsSync(sourceFilePath);
    let lastModified: string | null = null;

    if (exists) {
      const stats = fs.statSync(sourceFilePath);
      lastModified = stats.mtime.toISOString();
    }

    return NextResponse.json({
      exists,
      fileName: sourceFileName,
      lastModified
    });

  } catch (error) {
    console.error('Error checking Excel status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
