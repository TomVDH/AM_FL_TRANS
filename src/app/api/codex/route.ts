import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Codex API Endpoint
 *
 * CRUD operations for codex_translations.json (single source of truth).
 *
 * GET /api/codex - Returns all codex entries as JSON array
 * POST /api/codex - Add, update, replace, or delete codex entries
 */

const JSON_FILE_PATH = path.join(process.cwd(), 'data', 'json', 'codex_translations.json');

interface CodexEntry {
  name: string;
  description?: string;
  english: string;
  dutch?: string;
  category: string;
  nicknames?: string[];
  bio?: string;
  gender?: string;
  flemishDensity?: string;
  register?: string;
  pronounForm?: string;
  contractions?: string;
  verbalTics?: string;
  dynamics?: string;
  relationships?: string;
  note?: string;
  verified?: boolean;
  [key: string]: string | string[] | boolean | undefined;
}

interface CodexFile {
  version: string;
  generated: string;
  description: string;
  _bostrol?: string;
  totalEntries: number;
  entries: CodexEntry[];
}

interface PostRequestBody {
  action: 'add' | 'update' | 'replace' | 'delete';
  data: CodexEntry | CodexEntry[] | { name: string };
}

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

async function readCodex(): Promise<CodexFile> {
  const raw = await fs.readFile(JSON_FILE_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeCodex(codex: CodexFile): Promise<void> {
  codex.totalEntries = codex.entries.length;
  codex.generated = new Date().toISOString();
  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(codex, null, 2) + '\n', 'utf8');
}

/**
 * GET /api/codex
 */
export async function GET() {
  try {
    await fs.access(JSON_FILE_PATH);
    const codex = await readCodex();

    return NextResponse.json({
      entries: codex.entries,
      availableLanguages: ['dutch'],
      totalEntries: codex.entries.length,
    });
  } catch (error) {
    console.error('Error reading codex file:', error);
    return NextResponse.json({ error: 'Failed to read codex file' }, { status: 500 });
  }
}

/**
 * POST /api/codex
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
      return NextResponse.json({ error: 'Missing required field: data' }, { status: 400 });
    }

    const codex = await readCodex();

    switch (action) {
      case 'add': {
        const entry = data as CodexEntry;
        const validation = validateEntry(entry);
        if (!validation.valid) {
          return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const exists = codex.entries.some(
          e => e.name.toLowerCase() === entry.name.toLowerCase()
        );
        if (exists) {
          return NextResponse.json(
            { error: `Entry with name "${entry.name}" already exists` },
            { status: 409 }
          );
        }

        codex.entries.push(entry);
        await writeCodex(codex);

        return NextResponse.json({
          success: true,
          message: `Entry "${entry.name}" added successfully`,
          entry,
        });
      }

      case 'update': {
        const entry = data as CodexEntry;
        if (!entry.name) {
          return NextResponse.json(
            { error: 'Missing required field: name (for lookup)' },
            { status: 400 }
          );
        }

        const index = codex.entries.findIndex(
          e => e.name.toLowerCase() === entry.name.toLowerCase()
        );
        if (index === -1) {
          return NextResponse.json(
            { error: `Entry with name "${entry.name}" not found` },
            { status: 404 }
          );
        }

        // Merge: only overwrite fields that are provided
        const existing = codex.entries[index];
        for (const [key, val] of Object.entries(entry)) {
          if (val !== undefined) {
            (existing as Record<string, unknown>)[key] = val;
          }
        }
        codex.entries[index] = existing;
        await writeCodex(codex);

        return NextResponse.json({
          success: true,
          message: `Entry "${entry.name}" updated successfully`,
          entry: existing,
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

        codex.entries = entries;
        await writeCodex(codex);

        return NextResponse.json({
          success: true,
          message: `Replaced codex with ${entries.length} entries`,
          count: entries.length,
        });
      }

      case 'delete': {
        const { name: nameToDelete } = data as { name: string };
        if (!nameToDelete) {
          return NextResponse.json(
            { error: 'Name is required for delete action' },
            { status: 400 }
          );
        }

        const before = codex.entries.length;
        codex.entries = codex.entries.filter(
          e => e.name.toLowerCase() !== nameToDelete.toLowerCase()
        );

        if (codex.entries.length === before) {
          return NextResponse.json(
            { error: `Entry with name "${nameToDelete}" not found` },
            { status: 404 }
          );
        }

        await writeCodex(codex);

        return NextResponse.json({
          success: true,
          message: `Entry "${nameToDelete}" deleted successfully`,
          remainingCount: codex.entries.length,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing codex request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
