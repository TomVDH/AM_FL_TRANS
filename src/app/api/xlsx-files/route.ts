import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

/**
 * XLSX Files API Endpoint
 *
 * Returns available XLSX files and their sheet information
 * Can also search within XLSX files directly
 */

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface XLSXFileInfo {
  fileName: string;
  sheets: string[];
  fileSize?: number;
  lastModified?: string;
}

interface XLSXSearchResult {
  fileName: string;
  sheetName: string;
  matches: Array<{
    row: number;
    utterer: string;
    context: string;
    sourceEnglish: string;
    translatedDutch: string;
    key?: string;
  }>;
}

/**
 * GET /api/xlsx-files
 * 
 * Returns list of available XLSX files with sheet information
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileParam = searchParams.get('file');
    
    const excelDir = path.join(process.cwd(), 'excels');
    
    // Check if excels directory exists
    if (!fs.existsSync(excelDir)) {
      return NextResponse.json({ files: [] });
    }
    
    // If specific file requested, return its sheets
    if (fileParam) {
      const filePath = path.join(excelDir, fileParam);
      
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: `File not found: ${fileParam}` },
          { status: 404 }
        );
      }
      
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        return NextResponse.json({
          fileName: fileParam,
          sheets: workbook.SheetNames
        });
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to read Excel file: ${fileParam}` },
          { status: 500 }
        );
      }
    }
    
    // Return all available XLSX files with their sheet information
    const files = fs.readdirSync(excelDir);
    const xlsxFiles: XLSXFileInfo[] = [];
    
    for (const file of files) {
      if (file.endsWith('.xlsx')) {
        try {
          const filePath = path.join(excelDir, file);

          // Check if file exists and is readable
          if (!fs.existsSync(filePath)) {
            continue;
          }
          
          const stats = fs.statSync(filePath);

          // Skip files that are too large
          if (stats.size > MAX_FILE_SIZE) {
            console.warn(`File ${file} exceeds size limit (${stats.size} bytes)`);
            continue;
          }

          // Try to read the workbook with error handling
          const fileBuffer = fs.readFileSync(filePath);
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
          
          xlsxFiles.push({
            fileName: file,
            sheets: workbook.SheetNames,
            fileSize: stats.size,
            lastModified: stats.mtime.toISOString()
          });
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
          // Skip files that can't be read
        }
      }
    }
    
    // Natural numeric sort: 0, 1, 2, ... 10 (not lexicographic 0, 1, 10, 2)
    return NextResponse.json({
      files: xlsxFiles.sort((a, b) => {
        const numA = parseInt(a.fileName.match(/^(\d+)/)?.[1] || '999', 10);
        const numB = parseInt(b.fileName.match(/^(\d+)/)?.[1] || '999', 10);
        if (numA !== numB) return numA - numB;
        return a.fileName.localeCompare(b.fileName);
      })
    });
    
  } catch (error) {
    console.error('Error listing XLSX files:', error);
    return NextResponse.json(
      { error: 'Failed to list XLSX files' },
      { status: 500 }
    );
  }
}

/**
 * Search a single workbook and return results
 */
function searchWorkbook(
  workbook: XLSX.WorkBook,
  fileName: string,
  searchTerm: string,
  globalSearch: boolean,
  selectedSheet: string,
  translationColumnIndex: number
): XLSXSearchResult[] {
  const results: XLSXSearchResult[] = [];

  // Determine which sheets to search
  const sheetsToSearch = globalSearch
    ? workbook.SheetNames
    : selectedSheet
      ? [selectedSheet]
      : workbook.SheetNames;

  sheetsToSearch.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ''
    });

    const matches: XLSXSearchResult['matches'] = [];

    // Process rows (skip header row)
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as any[];
      if (!row || row.length === 0) continue;

      const entry = {
        row: i + 1,
        utterer: row[0] ? row[0].toString().trim() : '',
        context: row[1] ? row[1].toString().trim() : '',
        sourceEnglish: row[2] ? row[2].toString().trim() : '',
        translatedDutch: row[translationColumnIndex] ? row[translationColumnIndex].toString().trim() : '',
        key: row[10] ? row[10].toString().trim() : ''
      };

      // Only include rows with source text
      if (!entry.sourceEnglish) continue;

      // Search logic
      let isMatch = false;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();

        if (
          entry.sourceEnglish.toLowerCase().includes(searchLower) ||
          entry.translatedDutch.toLowerCase().includes(searchLower) ||
          entry.utterer.toLowerCase().includes(searchLower)
        ) {
          isMatch = true;
        }
      } else {
        // If no search term, return all entries (for browsing)
        isMatch = true;
      }

      if (isMatch) {
        matches.push(entry);
      }
    }

    if (matches.length > 0) {
      results.push({
        fileName,
        sheetName,
        matches
      });
    }
  });

  return results;
}

/**
 * POST /api/xlsx-files
 *
 * Search within XLSX files directly
 * Supports searchAllFiles parameter to search across ALL files in /excels
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fileName,
      searchTerm,
      selectedSheet,
      globalSearch = false,
      searchAllFiles = false,
      translationColumnIndex = 9
    } = body;

    const excelDir = path.join(process.cwd(), 'excels');

    // Search ALL files mode
    if (searchAllFiles) {
      if (!searchTerm) {
        return NextResponse.json(
          { error: 'Search term required when searching all files' },
          { status: 400 }
        );
      }

      const allResults: XLSXSearchResult[] = [];
      const files = fs.readdirSync(excelDir).filter(f => f.endsWith('.xlsx'));

      for (const file of files) {
        try {
          const filePath = path.join(excelDir, file);
          const stats = fs.statSync(filePath);

          // Skip files that are too large
          if (stats.size > MAX_FILE_SIZE) {
            console.warn(`Skipping ${file} - exceeds size limit`);
            continue;
          }

          const fileBuffer = fs.readFileSync(filePath);
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

          const fileResults = searchWorkbook(
            workbook,
            file,
            searchTerm,
            true, // Always search all sheets when searching all files
            '',
            translationColumnIndex
          );

          allResults.push(...fileResults);
        } catch (error) {
          console.error(`Error searching ${file}:`, error);
          // Continue with other files
        }
      }

      return NextResponse.json({
        searchAllFiles: true,
        searchTerm,
        totalMatches: allResults.reduce((sum, r) => sum + r.matches.length, 0),
        filesSearched: files.length,
        results: allResults,
        searchedAt: new Date().toISOString()
      });
    }

    // Single file mode (original behavior)
    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing required parameter: fileName' },
        { status: 400 }
      );
    }

    const filePath = path.join(excelDir, fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found: ${fileName}` },
        { status: 404 }
      );
    }

    // Check file size before processing
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds maximum size limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const results = searchWorkbook(
      workbook,
      fileName,
      searchTerm,
      globalSearch,
      selectedSheet,
      translationColumnIndex
    );

    return NextResponse.json({
      fileName,
      searchTerm,
      selectedSheet,
      globalSearch,
      totalMatches: results.reduce((sum, r) => sum + r.matches.length, 0),
      results,
      searchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error searching XLSX file:', error);
    return NextResponse.json(
      { error: 'Failed to search XLSX file' },
      { status: 500 }
    );
  }
}