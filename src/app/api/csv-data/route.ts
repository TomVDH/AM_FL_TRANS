import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  splitCSVRows,
  parseCSVRow,
  parseCodexCSV as parseCodexCSVShared,
} from '../../../utils/codexCsvParser';

/**
 * CSV Data API Endpoint
 *
 * Serves CSV data files for dynamic consultation during translation.
 * Supports codex, legacy character, and episode CSV formats.
 */

interface CSVEntry {
  row: string;
  context: string;
  key: string;
  english: string;
  dutch: string;
  utterer: string;
  sheetName?: string;
}

interface CharacterCSVEntry {
  name: string;
  description: string;
  english: string;
  spanish: string;
  french: string;
  german: string;
  dutch: string;
  turkish: string;
  catalan: string;
  japanese: string;
  korean: string;
}

/**
 * Parse character translations CSV content (legacy format)
 */
function parseCharacterCSV(csvContent: string) {
  const lines = splitCSVRows(csvContent);
  const characters: CharacterCSVEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVRow(line);
    if (values.length >= 11) {
      characters.push({
        name: values[0],
        description: values[1],
        english: values[2],
        spanish: values[3],
        french: values[4],
        german: values[5],
        dutch: values[6],
        turkish: values[7],
        catalan: values[8],
        japanese: values[9],
        korean: values[10]
      });
    }
  }

  return [{ sheetName: 'Characters', entries: characters }];
}

/**
 * Parse codex CSV via shared parser, returning in sheets format.
 */
function parseCodexCSV(csvContent: string) {
  const { entries } = parseCodexCSVShared(csvContent);
  return [{ sheetName: 'Codex', entries }];
}

/**
 * Detect CSV format type from header line
 */
function detectCSVFormat(csvContent: string): 'codex' | 'character' | 'episode' {
  const firstLine = csvContent.split('\n')[0].toLowerCase();

  if (firstLine.includes('name,description,english,dutch,category')) {
    return 'codex';
  }

  if (firstLine.includes('name/key,description,english,spanish')) {
    return 'character';
  }

  return 'episode';
}

/**
 * Parse CSV content into structured data with format auto-detection
 */
function parseCSVContent(csvContent: string) {
  const format = detectCSVFormat(csvContent);

  if (format === 'codex') {
    return parseCodexCSV(csvContent);
  }

  if (format === 'character') {
    return parseCharacterCSV(csvContent);
  }

  // Episode format
  const lines = splitCSVRows(csvContent);
  const sheetsMap = new Map<string, CSVEntry[]>();
  let headerFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith('#')) continue;

    if (line.startsWith('RowNumber,SheetName,Context,Key,Utterer,SourceEnglish,TranslatedDutch')) {
      headerFound = true;
      continue;
    }

    if (headerFound && line.includes(',')) {
      const values = parseCSVRow(line);
      if (values.length >= 7) {
        const sheetName = values[1] || 'Unknown';

        if (!sheetsMap.has(sheetName)) {
          sheetsMap.set(sheetName, []);
        }

        sheetsMap.get(sheetName)!.push({
          row: values[0],
          context: values[2],
          key: values[3],
          english: values[5],
          dutch: values[6],
          utterer: values[4],
          sheetName: sheetName
        });
      }
    }
  }

  const sheets: { sheetName: string; entries: CSVEntry[] }[] = [];
  sheetsMap.forEach((entries, sheetName) => {
    sheets.push({ sheetName, entries });
  });

  return sheets;
}

/**
 * GET /api/csv-data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    const format = searchParams.get('format') || 'json';
    const sheetFilter = searchParams.get('sheet');

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing required parameter: file' },
        { status: 400 }
      );
    }

    const csvPath = path.join(process.cwd(), 'data', 'csv', fileName);

    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: `CSV file not found: ${fileName}` },
        { status: 404 }
      );
    }

    const csvContent = fs.readFileSync(csvPath, 'utf8');

    if (format === 'csv') {
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${fileName}"`
        }
      });
    }

    const sheets = parseCSVContent(csvContent);

    const filteredSheets = sheetFilter
      ? sheets.filter(sheet => sheet.sheetName.toLowerCase().includes(sheetFilter.toLowerCase()))
      : sheets;

    return NextResponse.json({
      fileName: fileName.replace('.csv', ''),
      totalSheets: sheets.length,
      totalEntries: sheets.reduce((sum, sheet) => sum + sheet.entries.length, 0),
      requestedSheet: sheetFilter,
      sheets: filteredSheets,
      loadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error serving CSV data:', error);
    return NextResponse.json(
      { error: 'Failed to load CSV data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/csv-data
 *
 * Search CSV data with query parameters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { files, searchTerm, context, maxResults = 50 } = body;

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: 'Missing required parameter: files (array)' },
        { status: 400 }
      );
    }

    const results: { file: string; matches: CSVEntry[] }[] = [];

    for (const fileName of files) {
      const csvPath = path.join(process.cwd(), 'data', 'csv', fileName);

      if (fs.existsSync(csvPath)) {
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const sheets = parseCSVContent(csvContent);

        const matches: CSVEntry[] = [];

        sheets.forEach(sheet => {
          sheet.entries.forEach(entry => {
            let isMatch = false;

            if (searchTerm) {
              const searchLower = searchTerm.toLowerCase();
              if ('name' in entry) {
                const charEntry = entry as any;
                if (
                  charEntry.english.toLowerCase().includes(searchLower) ||
                  charEntry.dutch.toLowerCase().includes(searchLower) ||
                  charEntry.name.toLowerCase().includes(searchLower)
                ) {
                  isMatch = true;
                }
              } else {
                if (
                  entry.english.toLowerCase().includes(searchLower) ||
                  entry.dutch.toLowerCase().includes(searchLower) ||
                  entry.utterer.toLowerCase().includes(searchLower)
                ) {
                  isMatch = true;
                }
              }
            }

            if (context && !isMatch) {
              if ('context' in entry && entry.context?.toLowerCase().includes(context.toLowerCase())) {
                isMatch = true;
              }
            }

            if (!searchTerm && !context) {
              isMatch = true;
            }

            if (isMatch && matches.length < maxResults) {
              if ('name' in entry) {
                const charEntry = entry as any;
                matches.push({
                  row: '',
                  context: charEntry.description || '',
                  key: charEntry.name,
                  english: charEntry.english,
                  dutch: charEntry.dutch,
                  utterer: charEntry.name,
                  sheetName: sheet.sheetName
                } as CSVEntry);
              } else {
                matches.push(entry as CSVEntry);
              }
            }
          });
        });

        if (matches.length > 0) {
          results.push({ file: fileName, matches });
        }
      }
    }

    return NextResponse.json({
      searchTerm,
      context,
      totalFiles: files.length,
      filesWithResults: results.length,
      totalMatches: results.reduce((sum, r) => sum + r.matches.length, 0),
      results,
      searchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error searching CSV data:', error);
    return NextResponse.json(
      { error: 'Failed to search CSV data' },
      { status: 500 }
    );
  }
}
