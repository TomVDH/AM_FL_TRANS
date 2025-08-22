/**
 * CSV Processing Utilities
 * 
 * Modular utilities for CSV processing, parsing, and formatting.
 * Separated from main processing logic for better maintainability and reusability.
 */

export interface CSVConfig {
  delimiter: string;
  quoteChar: string;
  lineEnding: string;
  includeHeaders: boolean;
  includeMetadata: boolean;
  encoding: string;
}

export interface CSVRow {
  rowNumber: string | number;
  sheetName: string;
  context: string;
  key: string;
  utterer: string;
  sourceEnglish: string;
  translatedDutch: string;
  processedAt: string;
}

export interface ParsedCSVData {
  metadata: {
    fileName?: string;
    processedAt?: string;
    totalSheets?: number;
  };
  headers: string[];
  rows: CSVRow[];
  sheets: {
    sheetName: string;
    rows: CSVRow[];
  }[];
}

/**
 * Default CSV configuration
 */
export const DEFAULT_CSV_CONFIG: CSVConfig = {
  delimiter: ',',
  quoteChar: '"',
  lineEnding: '\n',
  includeHeaders: true,
  includeMetadata: true,
  encoding: 'utf8'
};

/**
 * CSV Header columns in order
 */
export const CSV_HEADERS = [
  'RowNumber',
  'SheetName',
  'Context', 
  'Key',
  'Utterer',
  'SourceEnglish',
  'TranslatedDutch',
  'ProcessedAt'
] as const;

/**
 * Escape a value for CSV output
 * @param value - Value to escape
 * @param config - CSV configuration
 * @returns Escaped CSV value
 */
export function escapeCSVValue(value: any, config: CSVConfig = DEFAULT_CSV_CONFIG): string {
  if (value === null || value === undefined) return '""';
  
  const stringValue = String(value);
  
  // Check if value needs quoting
  const needsQuoting = 
    stringValue.includes(config.delimiter) ||
    stringValue.includes(config.quoteChar) ||
    stringValue.includes(config.lineEnding) ||
    stringValue.includes('\r');
  
  if (needsQuoting) {
    // Escape internal quotes by doubling them
    const escaped = stringValue.replace(new RegExp(config.quoteChar, 'g'), config.quoteChar + config.quoteChar);
    return config.quoteChar + escaped + config.quoteChar;
  }
  
  return stringValue;
}

/**
 * Create CSV header row
 * @param config - CSV configuration
 * @returns CSV header string
 */
export function createCSVHeader(config: CSVConfig = DEFAULT_CSV_CONFIG): string {
  return CSV_HEADERS
    .map(header => escapeCSVValue(header, config))
    .join(config.delimiter) + config.lineEnding;
}

/**
 * Convert a data row to CSV format
 * @param row - Data row object
 * @param config - CSV configuration
 * @returns CSV row string
 */
export function rowToCSV(row: CSVRow, config: CSVConfig = DEFAULT_CSV_CONFIG): string {
  const values = [
    row.rowNumber,
    row.sheetName,
    row.context,
    row.key,
    row.utterer,
    row.sourceEnglish,
    row.translatedDutch,
    row.processedAt
  ];
  
  return values
    .map(value => escapeCSVValue(value, config))
    .join(config.delimiter) + config.lineEnding;
}

/**
 * Create CSV metadata header
 * @param fileName - Source file name
 * @param processedAt - Processing timestamp
 * @param totalSheets - Number of sheets
 * @param config - CSV configuration
 * @returns Metadata header string
 */
export function createMetadataHeader(
  fileName: string,
  processedAt: string,
  totalSheets: number,
  config: CSVConfig = DEFAULT_CSV_CONFIG
): string {
  if (!config.includeMetadata) return '';
  
  return [
    `# File: ${fileName}`,
    `# Processed: ${processedAt}`,
    `# Sheets: ${totalSheets}`,
    ''
  ].join(config.lineEnding) + config.lineEnding;
}

/**
 * Parse a single CSV row, handling quoted values correctly
 * @param rowString - Raw CSV row string
 * @param config - CSV configuration
 * @returns Array of parsed values
 */
export function parseCSVRow(rowString: string, config: CSVConfig = DEFAULT_CSV_CONFIG): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < rowString.length) {
    const char = rowString[i];
    
    if (char === config.quoteChar) {
      if (inQuotes && rowString[i + 1] === config.quoteChar) {
        // Escaped quote
        current += config.quoteChar;
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === config.delimiter && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
      i++;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      break;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add final value
  values.push(current.trim());
  
  return values;
}

/**
 * Parse complete CSV content into structured data
 * @param csvContent - Raw CSV content
 * @param config - CSV configuration
 * @returns Parsed CSV data structure
 */
export function parseCSVContent(csvContent: string, config: CSVConfig = DEFAULT_CSV_CONFIG): ParsedCSVData {
  const lines = csvContent.split(/\r?\n/);
  
  const result: ParsedCSVData = {
    metadata: {},
    headers: [],
    rows: [],
    sheets: []
  };
  
  let currentSheetName = '';
  let currentSheetRows: CSVRow[] = [];
  let headersFound = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Parse metadata
    if (trimmedLine.startsWith('#')) {
      const metaLine = trimmedLine.substring(1).trim();
      if (metaLine.startsWith('File:')) {
        result.metadata.fileName = metaLine.substring(5).trim();
      } else if (metaLine.startsWith('Processed:')) {
        result.metadata.processedAt = metaLine.substring(10).trim();
      } else if (metaLine.startsWith('Sheets:')) {
        result.metadata.totalSheets = parseInt(metaLine.substring(7).trim());
      }
      continue;
    }
    
    // Parse headers
    if (!headersFound && CSV_HEADERS.every(header => trimmedLine.includes(header))) {
      result.headers = parseCSVRow(trimmedLine, config);
      headersFound = true;
      continue;
    }
    
    // Parse data rows
    if (headersFound && trimmedLine.includes(config.delimiter)) {
      const values = parseCSVRow(trimmedLine, config);
      
      if (values.length >= CSV_HEADERS.length) {
        const row: CSVRow = {
          rowNumber: values[0] || '',
          sheetName: values[1] || '',
          context: values[2] || '',
          key: values[3] || '',
          utterer: values[4] || '',
          sourceEnglish: values[5] || '',
          translatedDutch: values[6] || '',
          processedAt: values[7] || ''
        };
        
        result.rows.push(row);
        
        // Group by sheet
        if (row.sheetName !== currentSheetName) {
          if (currentSheetRows.length > 0) {
            result.sheets.push({
              sheetName: currentSheetName,
              rows: currentSheetRows
            });
          }
          currentSheetName = row.sheetName;
          currentSheetRows = [];
        }
        
        currentSheetRows.push(row);
      }
    }
  }
  
  // Add final sheet
  if (currentSheetRows.length > 0) {
    result.sheets.push({
      sheetName: currentSheetName,
      rows: currentSheetRows
    });
  }
  
  return result;
}

/**
 * Search CSV data for matching entries
 * @param data - Parsed CSV data
 * @param searchTerm - Term to search for
 * @param contextFilter - Optional context filter
 * @param maxResults - Maximum results to return
 * @returns Array of matching rows
 */
export function searchCSVData(
  data: ParsedCSVData,
  searchTerm: string,
  contextFilter?: string,
  maxResults = 50
): CSVRow[] {
  const matches: CSVRow[] = [];
  const searchLower = searchTerm.toLowerCase();
  const contextLower = contextFilter?.toLowerCase();
  
  for (const row of data.rows) {
    if (matches.length >= maxResults) break;
    
    let isMatch = false;
    
    // Text search in key fields
    if (searchTerm) {
      const fieldsToSearch = [
        row.sourceEnglish,
        row.translatedDutch,
        row.utterer,
        row.key
      ];
      
      isMatch = fieldsToSearch.some(field =>
        field && field.toLowerCase().includes(searchLower)
      );
    }
    
    // Context filter
    if (contextFilter && !isMatch) {
      isMatch = row.context.toLowerCase().includes(contextLower!);
    }
    
    // Include all if no filters
    if (!searchTerm && !contextFilter) {
      isMatch = true;
    }
    
    if (isMatch) {
      matches.push(row);
    }
  }
  
  return matches;
}

/**
 * Generate CSV processing statistics
 * @param data - Parsed CSV data
 * @returns Statistics object
 */
export function generateCSVStats(data: ParsedCSVData) {
  const stats = {
    totalRows: data.rows.length,
    totalSheets: data.sheets.length,
    averageRowsPerSheet: data.sheets.length > 0 ? Math.round(data.rows.length / data.sheets.length) : 0,
    contexts: new Set<string>(),
    utterers: new Set<string>(),
    emptyTranslations: 0,
    processedAt: data.metadata.processedAt
  };
  
  data.rows.forEach(row => {
    if (row.context) stats.contexts.add(row.context);
    if (row.utterer) stats.utterers.add(row.utterer);
    if (!row.translatedDutch) stats.emptyTranslations++;
  });
  
  return {
    ...stats,
    uniqueContexts: stats.contexts.size,
    uniqueUtterers: stats.utterers.size,
    translationCoverage: ((stats.totalRows - stats.emptyTranslations) / stats.totalRows * 100).toFixed(1)
  };
}