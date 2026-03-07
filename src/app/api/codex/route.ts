import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  type CodexEntry,
  parseCodexCSV,
  entriesToCSV,
} from '../../../utils/codexCsvParser';

/**
 * Codex API Endpoint
 *
 * CRUD operations for the codex_translations.csv file.
 *
 * GET /api/codex - Returns all codex entries as JSON array
 * POST /api/codex - Add, update, or replace codex entries
 */

interface PostRequestBody {
  action: 'add' | 'update' | 'replace' | 'delete';
  data: CodexEntry | CodexEntry[] | { name: string };
}

const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'csv', 'codex_translations.csv');
const BACKUP_FILE_PATH = path.join(process.cwd(), 'data', 'csv', 'codex_translations.backup.csv');

/**
 * Validate that a CodexEntry has required fields
 */
function validateEntry(entry: CodexEntry): { valid: boolean; error?: string } {
  if (!entry.name || typeof entry.name !== 'string' || entry.name.trim() === '') {
    return { valid: false, error: 'Missing required field: name' };
  }
  if (!entry.english || typeof entry.english !== 'string' || entry.english.trim() === '') {
    return { valid: false, error: 'Missing required field: english' };
  }
  if (!entry.category || typeof entry.category !== 'string' || entry.category.trim() === '') {
    return { valid: false, error: 'Missing required field: category' };
  }
  return { valid: true };
}

/**
 * GET /api/codex
 *
 * Read and parse codex_translations.csv, return as JSON with entries and metadata
 */
export async function GET() {
  try {
    try {
      await fs.access(CSV_FILE_PATH);
    } catch {
      return NextResponse.json(
        { error: 'Codex file not found' },
        { status: 404 }
      );
    }

    const csvContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
    const { entries, languageColumns } = parseCodexCSV(csvContent);

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
 * Handle add, update, replace, and delete operations
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
    let existingLanguageColumns: string[] = ['dutch'];
    try {
      const csvContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
      const parsed = parseCodexCSV(csvContent);
      existingEntries = parsed.entries;
      existingLanguageColumns = parsed.languageColumns.length > 0 ? parsed.languageColumns : ['dutch'];
    } catch {
      existingEntries = [];
    }

    switch (action) {
      case 'add': {
        const entry = data as CodexEntry;

        const validation = validateEntry(entry);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }

        const duplicateIndex = existingEntries.findIndex(
          e => e.name.toLowerCase() === entry.name.toLowerCase()
        );
        if (duplicateIndex !== -1) {
          return NextResponse.json(
            { error: `Entry with name "${entry.name}" already exists` },
            { status: 409 }
          );
        }

        existingEntries.push(entry);

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

        if (!entry.name || typeof entry.name !== 'string' || entry.name.trim() === '') {
          return NextResponse.json(
            { error: 'Missing required field: name (for lookup)' },
            { status: 400 }
          );
        }

        const index = existingEntries.findIndex(
          e => e.name.toLowerCase() === entry.name.toLowerCase()
        );
        if (index === -1) {
          return NextResponse.json(
            { error: `Entry with name "${entry.name}" not found` },
            { status: 404 }
          );
        }

        const existingEntry = existingEntries[index];
        const updatedEntry: CodexEntry = {
          name: entry.name,
          description: entry.description !== undefined ? entry.description : existingEntry.description,
          english: entry.english !== undefined ? entry.english : existingEntry.english,
          dutch: entry.dutch !== undefined ? entry.dutch : existingEntry.dutch,
          category: entry.category !== undefined ? entry.category : existingEntry.category,
          nicknames: entry.nicknames !== undefined ? entry.nicknames : existingEntry.nicknames,
          bio: entry.bio !== undefined ? entry.bio : existingEntry.bio,
          gender: entry.gender !== undefined ? entry.gender : existingEntry.gender,
          dialogueStyle: entry.dialogueStyle !== undefined ? entry.dialogueStyle : existingEntry.dialogueStyle,
          dutchDialogueStyle: entry.dutchDialogueStyle !== undefined ? entry.dutchDialogueStyle : existingEntry.dutchDialogueStyle,
        };

        // Update dynamic language columns
        for (const langCol of existingLanguageColumns) {
          updatedEntry[langCol] = entry[langCol] !== undefined ? entry[langCol] : existingEntry[langCol];
        }

        existingEntries[index] = updatedEntry;

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

        if (!Array.isArray(entries)) {
          return NextResponse.json(
            { error: 'For replace action, data must be an array of entries' },
            { status: 400 }
          );
        }

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

        if (!nameToDelete || typeof nameToDelete !== 'string') {
          return NextResponse.json(
            { error: 'Name is required for delete action' },
            { status: 400 }
          );
        }

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
