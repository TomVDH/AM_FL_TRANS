/**
 * Unified Highlighting Types
 *
 * This file defines shared types for the highlighting system.
 * All data sources (JSON, XLSX, Character CSV) produce matches
 * that conform to these interfaces for consistent rendering.
 */

/**
 * Data sources for highlighting matches
 */
export type HighlightSource = 'json' | 'xlsx' | 'character' | 'codex';

/**
 * Unified highlight match interface
 * All highlight systems produce matches conforming to this structure
 */
export interface HighlightMatch {
  // Core fields
  sourceEnglish: string;           // English text that was matched
  translatedDutch: string;         // Dutch translation

  // Source identification
  source: HighlightSource;         // Which data source this came from

  // Optional metadata
  context?: string;                // Context/scene description
  utterer?: string;                // Speaker/character name
  rowNumber?: number;              // Row number in source file
  sheetName?: string;              // Sheet name (for XLSX)
  fileName?: string;               // Source file name
  category?: string;               // Category (for character/codex)

  // Position data (for character highlighting)
  startIndex?: number;
  endIndex?: number;
}

/**
 * Character entry from codex JSON
 */
export interface CharacterEntry {
  name: string;
  description: string;
  english: string;
  dutch: string;
}

/**
 * XLSX entry from translation files
 */
export interface XlsxEntry {
  row: number;
  utterer: string;
  context: string;
  sourceEnglish: string;
  translatedDutch: string;
  key?: string;
  sheetName?: string;
  fileName?: string;
}

/**
 * JSON entry from localization manual
 */
export interface JsonEntry {
  rowNumber?: number;
  context?: string;
  key?: string;
  utterer?: string;
  sourceEnglish: string;
  translatedDutch: string;
}

/**
 * File info for XLSX files
 */
export interface XlsxFileInfo {
  fileName: string;
  sheets: string[];
  fileSize?: number;
  lastModified?: string;
}

/**
 * CSS class names for highlight types
 */
export const HIGHLIGHT_CLASSES: Record<HighlightSource, string> = {
  json: 'highlight-tag highlight-json',       // Blue - Localization Manual
  xlsx: 'highlight-tag highlight-xlsx',       // Green - Translation Files
  character: 'highlight-tag highlight-character', // Purple - Character Names
  codex: 'highlight-tag highlight-clickable',  // Red - Codex/Clickable
};

/**
 * Human-readable labels for data sources
 */
export const SOURCE_LABELS: Record<HighlightSource, string> = {
  json: 'Localization Manual',
  xlsx: 'Translation File',
  character: 'Character Codex',
  codex: 'World Reference',
};

/**
 * Colors for data source indicators
 */
export const SOURCE_COLORS: Record<HighlightSource, { bg: string; text: string; border: string }> = {
  json: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
  },
  xlsx: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-700',
  },
  character: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
  },
  codex: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
  },
};

/**
 * Convert an XlsxEntry to a unified HighlightMatch
 */
export function xlsxToHighlightMatch(entry: XlsxEntry): HighlightMatch {
  return {
    sourceEnglish: entry.sourceEnglish,
    translatedDutch: entry.translatedDutch,
    source: 'xlsx',
    context: entry.context,
    utterer: entry.utterer,
    rowNumber: entry.row,
    sheetName: entry.sheetName,
    fileName: entry.fileName,
  };
}

/**
 * Convert a JsonEntry to a unified HighlightMatch
 */
export function jsonToHighlightMatch(entry: JsonEntry): HighlightMatch {
  return {
    sourceEnglish: entry.sourceEnglish,
    translatedDutch: entry.translatedDutch,
    source: 'json',
    context: entry.context,
    utterer: entry.utterer,
    rowNumber: entry.rowNumber,
  };
}

/**
 * Convert a CharacterEntry to a unified HighlightMatch
 */
export function characterToHighlightMatch(
  entry: CharacterEntry,
  startIndex?: number,
  endIndex?: number
): HighlightMatch {
  return {
    sourceEnglish: entry.english,
    translatedDutch: entry.dutch,
    source: 'character',
    category: 'Character',
    context: entry.description,
    startIndex,
    endIndex,
  };
}

/**
 * Generate hover text for a highlight match
 */
export function getMatchHoverText(match: HighlightMatch): string {
  const parts: string[] = [];

  if (match.translatedDutch) {
    parts.push(`Dutch: ${match.translatedDutch}`);
  }
  if (match.context) {
    parts.push(`Context: ${match.context}`);
  }
  if (match.utterer) {
    parts.push(`Speaker: ${match.utterer}`);
  }
  if (match.sourceEnglish && match.source !== 'character') {
    parts.push(`Source: ${match.sourceEnglish}`);
  }

  return parts.join(' | ');
}
