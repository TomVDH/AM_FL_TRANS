/**
 * Shared CSV parser for codex_translations.csv
 *
 * Single source of truth for parsing the codex CSV format.
 * Used by /api/codex and /api/csv-data routes.
 */

export interface CodexEntry {
  name: string;
  description: string;
  english: string;
  dutch: string;
  category: string;
  nicknames?: string;
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
  dutchDialogueStyle?: string;
  // Dynamic language columns (for multi-language support)
  [languageCode: string]: string | undefined;
}

/**
 * Split CSV content into logical rows, respecting quoted fields that span multiple lines.
 */
export function splitCSVRows(content: string): string[] {
  const rows: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '"') {
      current += char;
      if (inQuotes && content[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && content[i + 1] === '\n') i++;
      if (current.trim()) rows.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) rows.push(current);
  return rows;
}

/**
 * Parse a single CSV row, handling quoted values with escaped quotes.
 */
export function parseCSVRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
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

  values.push(current.trim());
  return values;
}

/**
 * Escape a value for CSV format.
 * Wraps in quotes if it contains commas, quotes, or newlines.
 */
export function escapeCSVValue(value: string | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }
  const strValue = String(value);
  if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
    return `"${strValue.replace(/"/g, '""')}"`;
  }
  return strValue;
}

// Base columns that are NOT language translations
const CSV_BASE_COLUMNS = new Set([
  'name', 'description', 'english', 'category',
  'nicknames', 'bio', 'gender', 'dialoguestyle', 'dutchdialoguestyle',
]);

export interface ParsedCodexData {
  entries: CodexEntry[];
  languageColumns: string[];
}

/**
 * Parse codex CSV content into typed entries with detected language columns.
 */
export function parseCodexCSV(csvContent: string): ParsedCodexData {
  const lines = splitCSVRows(csvContent);
  const entries: CodexEntry[] = [];

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
    if (!CSV_BASE_COLUMNS.has(header)) {
      languageColumns.push(header);
    }
  });

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVRow(line);
    if (values.length >= 4) {
      const entry: CodexEntry = {
        name: values[headerIndexMap['name'] ?? 0] || '',
        description: values[headerIndexMap['description'] ?? 1] || '',
        english: values[headerIndexMap['english'] ?? 2] || '',
        dutch: values[headerIndexMap['dutch'] ?? 3] || '',
        category: values[headerIndexMap['category'] ?? 4] || 'CHARACTER',
        nicknames: values[headerIndexMap['nicknames'] ?? 5] || '',
        bio: values[headerIndexMap['bio'] ?? 6] || '',
        gender: values[headerIndexMap['gender'] ?? 7] || '',
        dialogueStyle: values[headerIndexMap['dialoguestyle'] ?? 8] || '',
        dutchDialogueStyle: values[headerIndexMap['dutchdialoguestyle'] ?? 9] || '',
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
 * Convert CodexEntry array to CSV content.
 */
export function entriesToCSV(entries: CodexEntry[], languageColumns: string[] = ['dutch']): string {
  const headerParts = ['name', 'description', 'english'];
  headerParts.push(...languageColumns);
  headerParts.push('category', 'nicknames', 'bio', 'gender', 'dialogueStyle', 'dutchDialogueStyle');

  const rows = [headerParts.join(',')];

  for (const entry of entries) {
    const rowParts = [
      escapeCSVValue(entry.name),
      escapeCSVValue(entry.description),
      escapeCSVValue(entry.english),
    ];

    for (const langCol of languageColumns) {
      rowParts.push(escapeCSVValue(entry[langCol]));
    }

    rowParts.push(
      escapeCSVValue(entry.category),
      escapeCSVValue(entry.nicknames),
      escapeCSVValue(entry.bio),
      escapeCSVValue(entry.gender),
      escapeCSVValue(entry.dialogueStyle),
      escapeCSVValue(entry.dutchDialogueStyle),
    );

    rows.push(rowParts.join(','));
  }

  return rows.join('\n');
}
