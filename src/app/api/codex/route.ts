import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Codex API Endpoint
 *
 * CRUD operations for the codex_translations.csv file.
 *
 * GET /api/codex - Returns all codex entries as JSON array
 * POST /api/codex - Add, update, or replace codex entries
 */

interface CodexEntry {
  name: string;
  description: string;
  english: string;
  category: string;
  nicknames?: string;
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
  // Dynamic language translations
  [languageCode: string]: string | undefined;
}

interface ParsedCodexData {
  entries: CodexEntry[];
  languageColumns: string[];
}

interface PostRequestBody {
  action: 'add' | 'update' | 'replace' | 'delete';
  data: CodexEntry | CodexEntry[] | { name: string };
}

const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'csv', 'codex_translations.csv');
const BACKUP_FILE_PATH = path.join(process.cwd(), 'data', 'csv', 'codex_translations.backup.csv');
const CSV_HEADER = 'name,description,english,dutch,category,nicknames,bio,gender,dialogueStyle';
const CSV_BASE_COLUMNS = ['name', 'description', 'english', 'category', 'nicknames', 'bio', 'gender', 'dialoguestyle'];

/**
 * Escape a value for CSV format
 * Wraps in quotes if it contains commas, quotes, or newlines
 */
function escapeCSVValue(value: string | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }
  const strValue = String(value);
  // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
    return `"${strValue.replace(/"/g, '""')}"`;
  }
  return strValue;
}

/**
 * Parse a single CSV row, handling quoted values
 */
function parseCSVRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      // Handle escaped quotes
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add final value
  values.push(current.trim());

  return values;
}

/**
 * Parse CSV content into CodexEntry array with detected language columns
 */
function parseCodexCSV(csvContent: string): ParsedCodexData {
  const lines = csvContent.split('\n');
  const entries: CodexEntry[] = [];

  // Parse header row to detect columns
  const headerLine = lines[0]?.trim();
  if (!headerLine) {
    return { entries: [], languageColumns: [] };
  }

  const headers = parseCSVRow(headerLine).map(h => h.toLowerCase());

  // Detect language columns (any column not in base columns)
  const languageColumns: string[] = [];
  const headerIndexMap: Record<string, number> = {};

  headers.forEach((header, index) => {
    headerIndexMap[header] = index;
    // Check if this is a language column (not a base column)
    if (!CSV_BASE_COLUMNS.includes(header)) {
      languageColumns.push(header);
    }
  });

  for (let i = 1; i < lines.length; i++) { // Skip header
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVRow(line);
    if (values.length >= 4) {
      const entry: CodexEntry = {
        name: values[headerIndexMap['name'] ?? 0] || '',
        description: values[headerIndexMap['description'] ?? 1] || '',
        english: values[headerIndexMap['english'] ?? 2] || '',
        category: values[headerIndexMap['category'] ?? 4] || 'CHARACTER',
        nicknames: values[headerIndexMap['nicknames'] ?? 5] || '',
        bio: values[headerIndexMap['bio'] ?? 6] || '',
        gender: values[headerIndexMap['gender'] ?? 7] || '',
        dialogueStyle: values[headerIndexMap['dialoguestyle'] ?? 8] || ''
      };

      // Add dynamic language columns
      for (const langCol of languageColumns) {
        const langIndex = headerIndexMap[langCol];
        if (langIndex !== undefined && values[langIndex]) {
          entry[langCol] = values[langIndex];
        }
      }

      entries.push(entry);
    }
  }

  return { entries, languageColumns };
}

/**
 * Convert CodexEntry array to CSV content
 * Supports dynamic language columns while maintaining backward compatibility
 */
function entriesToCSV(entries: CodexEntry[], languageColumns: string[] = ['dutch']): string {
  // Build header: base columns + language columns in the right order
  // Original order: name,description,english,[languages],category,nicknames,bio,gender,dialogueStyle
  const headerParts = ['name', 'description', 'english'];
  headerParts.push(...languageColumns);
  headerParts.push('category', 'nicknames', 'bio', 'gender', 'dialogueStyle');

  const rows = [headerParts.join(',')];

  for (const entry of entries) {
    const rowParts = [
      escapeCSVValue(entry.name),
      escapeCSVValue(entry.description),
      escapeCSVValue(entry.english)
    ];

    // Add language columns
    for (const langCol of languageColumns) {
      rowParts.push(escapeCSVValue(entry[langCol]));
    }

    rowParts.push(
      escapeCSVValue(entry.category),
      escapeCSVValue(entry.nicknames),
      escapeCSVValue(entry.bio),
      escapeCSVValue(entry.gender),
      escapeCSVValue(entry.dialogueStyle)
    );

    rows.push(rowParts.join(','));
  }

  return rows.join('\n');
}

/**
 * Validate that a CodexEntry has required fields
 * Note: Language translations are optional - entries need at least english text
 */
function validateEntry(entry: CodexEntry, requiredLanguage?: string): { valid: boolean; error?: string } {
  if (!entry.name || typeof entry.name !== 'string' || entry.name.trim() === '') {
    return { valid: false, error: 'Missing required field: name' };
  }
  if (!entry.english || typeof entry.english !== 'string' || entry.english.trim() === '') {
    return { valid: false, error: 'Missing required field: english' };
  }
  if (!entry.category || typeof entry.category !== 'string' || entry.category.trim() === '') {
    return { valid: false, error: 'Missing required field: category' };
  }
  // Validate specific language if required (for backward compatibility with dutch)
  if (requiredLanguage) {
    const langValue = entry[requiredLanguage];
    if (!langValue || typeof langValue !== 'string' || langValue.trim() === '') {
      return { valid: false, error: `Missing required field: ${requiredLanguage}` };
    }
  }
  return { valid: true };
}

/**
 * GET /api/codex
 *
 * Read and parse codex_translations.csv, return as JSON with entries and metadata
 * Response: { entries: CodexEntry[], availableLanguages: string[], totalEntries: number }
 */
export async function GET() {
  try {
    // Check if file exists
    try {
      await fs.access(CSV_FILE_PATH);
    } catch {
      return NextResponse.json(
        { error: 'Codex file not found' },
        { status: 404 }
      );
    }

    // Read and parse CSV
    const csvContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
    const { entries, languageColumns } = parseCodexCSV(csvContent);

    // Determine which languages have non-empty data
    const availableLanguages = languageColumns.filter(lang => {
      return entries.some(entry => {
        const value = entry[lang];
        return value && typeof value === 'string' && value.trim() !== '';
      });
    });

    return NextResponse.json({
      entries,
      availableLanguages,
      totalEntries: entries.length
    });

  } catch (error) {
    console.error('Error reading codex file:', error);
    return NextResponse.json(
      { error: 'Failed to read codex file' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/codex
 *
 * Handle add, update, and replace operations
 */
export async function POST(request: NextRequest) {
  try {
    const body: PostRequestBody = await request.json();
    const { action, data } = body;

    if (!action || !['add', 'update', 'replace', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be one of: add, update, replace, delete' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Missing required field: data' },
        { status: 400 }
      );
    }

    // Read existing entries and language columns
    let existingEntries: CodexEntry[] = [];
    let existingLanguageColumns: string[] = ['dutch']; // Default to dutch for backward compatibility
    try {
      const csvContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
      const parsed = parseCodexCSV(csvContent);
      existingEntries = parsed.entries;
      existingLanguageColumns = parsed.languageColumns.length > 0 ? parsed.languageColumns : ['dutch'];
    } catch {
      // File doesn't exist or can't be read - start with empty array
      existingEntries = [];
    }

    switch (action) {
      case 'add': {
        const entry = data as CodexEntry;

        // Validate required fields
        const validation = validateEntry(entry);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }

        // Check for duplicate name
        const duplicateIndex = existingEntries.findIndex(
          e => e.name.toLowerCase() === entry.name.toLowerCase()
        );
        if (duplicateIndex !== -1) {
          return NextResponse.json(
            { error: `Entry with name "${entry.name}" already exists` },
            { status: 409 }
          );
        }

        // Append new entry
        existingEntries.push(entry);

        // Write to file with existing language columns
        const csvContent = entriesToCSV(existingEntries, existingLanguageColumns);
        await fs.writeFile(CSV_FILE_PATH, csvContent, 'utf8');

        return NextResponse.json({
          success: true,
          message: `Entry "${entry.name}" added successfully`,
          entry
        });
      }

      case 'update': {
        const entry = data as CodexEntry;

        // Validate name is provided (required for lookup)
        if (!entry.name || typeof entry.name !== 'string' || entry.name.trim() === '') {
          return NextResponse.json(
            { error: 'Missing required field: name (for lookup)' },
            { status: 400 }
          );
        }

        // Find entry by name
        const index = existingEntries.findIndex(
          e => e.name.toLowerCase() === entry.name.toLowerCase()
        );
        if (index === -1) {
          return NextResponse.json(
            { error: `Entry with name "${entry.name}" not found` },
            { status: 404 }
          );
        }

        // Update only provided fields
        const existingEntry = existingEntries[index];
        const updatedEntry: CodexEntry = {
          name: entry.name, // Keep the name
          description: entry.description !== undefined ? entry.description : existingEntry.description,
          english: entry.english !== undefined ? entry.english : existingEntry.english,
          category: entry.category !== undefined ? entry.category : existingEntry.category,
          nicknames: entry.nicknames !== undefined ? entry.nicknames : existingEntry.nicknames,
          bio: entry.bio !== undefined ? entry.bio : existingEntry.bio,
          gender: entry.gender !== undefined ? entry.gender : existingEntry.gender,
          dialogueStyle: entry.dialogueStyle !== undefined ? entry.dialogueStyle : existingEntry.dialogueStyle
        };

        // Update dynamic language columns
        for (const langCol of existingLanguageColumns) {
          updatedEntry[langCol] = entry[langCol] !== undefined ? entry[langCol] : existingEntry[langCol];
        }

        existingEntries[index] = updatedEntry;

        // Write to file with existing language columns
        const csvContent = entriesToCSV(existingEntries, existingLanguageColumns);
        await fs.writeFile(CSV_FILE_PATH, csvContent, 'utf8');

        return NextResponse.json({
          success: true,
          message: `Entry "${entry.name}" updated successfully`,
          entry: updatedEntry
        });
      }

      case 'replace': {
        const entries = data as CodexEntry[];

        // Validate it's an array
        if (!Array.isArray(entries)) {
          return NextResponse.json(
            { error: 'For replace action, data must be an array of entries' },
            { status: 400 }
          );
        }

        // Validate all entries have required fields
        for (let i = 0; i < entries.length; i++) {
          const validation = validateEntry(entries[i]);
          if (!validation.valid) {
            return NextResponse.json(
              { error: `Entry at index ${i}: ${validation.error}` },
              { status: 400 }
            );
          }
        }

        // Backup existing file
        try {
          await fs.access(CSV_FILE_PATH);
          const existingContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
          await fs.writeFile(BACKUP_FILE_PATH, existingContent, 'utf8');
        } catch {
          // File doesn't exist, no backup needed
        }

        // Write new CSV with existing language columns
        const csvContent = entriesToCSV(entries, existingLanguageColumns);
        await fs.writeFile(CSV_FILE_PATH, csvContent, 'utf8');

        return NextResponse.json({
          success: true,
          message: `Replaced codex with ${entries.length} entries. Backup saved to codex_translations.backup.csv`,
          count: entries.length
        });
      }

      case 'delete': {
        const { name: nameToDelete } = data as { name: string };

        // Validate name is provided
        if (!nameToDelete || typeof nameToDelete !== 'string') {
          return NextResponse.json(
            { error: 'Name is required for delete action' },
            { status: 400 }
          );
        }

        // Read existing entries
        let deleteExistingEntries: CodexEntry[] = [];
        let deleteLanguageColumns: string[] = ['dutch'];
        try {
          await fs.access(CSV_FILE_PATH);
          const existingContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
          const parsed = parseCodexCSV(existingContent);
          deleteExistingEntries = parsed.entries;
          deleteLanguageColumns = parsed.languageColumns.length > 0 ? parsed.languageColumns : ['dutch'];
        } catch {
          return NextResponse.json(
            { error: 'Codex file not found' },
            { status: 404 }
          );
        }

        // Find and filter out the entry
        const originalLength = deleteExistingEntries.length;
        const filteredEntries = deleteExistingEntries.filter(
          e => e.name.toLowerCase() !== nameToDelete.toLowerCase()
        );

        if (filteredEntries.length === originalLength) {
          return NextResponse.json(
            { error: `Entry with name "${nameToDelete}" not found` },
            { status: 404 }
          );
        }

        // Write updated entries to file with existing language columns
        const csvContent = entriesToCSV(filteredEntries, deleteLanguageColumns);
        await fs.writeFile(CSV_FILE_PATH, csvContent, 'utf8');

        return NextResponse.json({
          success: true,
          message: `Entry "${nameToDelete}" deleted successfully`,
          remainingCount: filteredEntries.length
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing codex request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
