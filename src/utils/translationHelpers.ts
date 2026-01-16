/**
 * Translation Helper Utilities
 *
 * Centralized utilities for translation operations.
 * Eliminates repeated blank-check patterns and Excel column conversions.
 */

import { BLANK_PLACEHOLDER, EXCEL_COLUMN_A_CODE } from '@/constants';

/**
 * Check if a translation is considered blank
 *
 * A translation is blank if it's:
 * - An empty string
 * - The BLANK_PLACEHOLDER sentinel value
 * - Undefined or null
 *
 * @param translation - The translation string to check
 * @returns true if the translation is blank
 */
export const isTranslationBlank = (translation: string | undefined | null): boolean => {
  return !translation || translation === '' || translation === BLANK_PLACEHOLDER;
};

/**
 * Convert a translation value to a display-friendly string
 *
 * Converts BLANK_PLACEHOLDER to empty string for UI display.
 * Handles undefined/null gracefully.
 *
 * @param translation - The translation value (may include placeholder)
 * @returns Empty string for blank values, otherwise the translation
 */
export const convertBlankToDisplay = (translation: string | undefined | null): string => {
  if (!translation || translation === BLANK_PLACEHOLDER) {
    return '';
  }
  return translation;
};

/**
 * Convert a display value to a storage value
 *
 * Converts empty string to BLANK_PLACEHOLDER for storage.
 * Trims whitespace before checking.
 *
 * @param value - The display value from UI
 * @returns BLANK_PLACEHOLDER for empty values, otherwise the trimmed value
 */
export const convertDisplayToStorage = (value: string): string => {
  const trimmed = value.trim();
  return trimmed === '' ? BLANK_PLACEHOLDER : trimmed;
};

/**
 * Convert an Excel column letter to a 0-based index
 *
 * Examples:
 * - 'A' -> 0
 * - 'B' -> 1
 * - 'Z' -> 25
 * - 'AA' -> 26 (for multi-letter columns, though typically single letter)
 *
 * @param column - Column letter (e.g., 'A', 'B', 'J')
 * @returns 0-based column index
 */
export const columnLetterToIndex = (column: string): number => {
  if (!column || column.length === 0) {
    return 0;
  }

  // For single-letter columns (most common case)
  if (column.length === 1) {
    return column.toUpperCase().charCodeAt(0) - EXCEL_COLUMN_A_CODE;
  }

  // For multi-letter columns (AA, AB, etc.)
  let index = 0;
  for (let i = 0; i < column.length; i++) {
    index = index * 26 + (column.toUpperCase().charCodeAt(i) - EXCEL_COLUMN_A_CODE + 1);
  }
  return index - 1;
};

/**
 * Convert a 0-based index to an Excel column letter
 *
 * Examples:
 * - 0 -> 'A'
 * - 1 -> 'B'
 * - 25 -> 'Z'
 * - 26 -> 'AA'
 *
 * @param index - 0-based column index
 * @returns Column letter (e.g., 'A', 'B', 'AA')
 */
export const indexToColumnLetter = (index: number): string => {
  let letter = '';
  let tempIndex = index;

  while (tempIndex >= 0) {
    letter = String.fromCharCode((tempIndex % 26) + EXCEL_COLUMN_A_CODE) + letter;
    tempIndex = Math.floor(tempIndex / 26) - 1;
  }

  return letter;
};

/**
 * Check if a translation has been modified from its original value
 *
 * Handles the case where both original and current are "blank" (empty or placeholder).
 * Empty-to-empty is not considered a change.
 *
 * @param original - Original translation value
 * @param current - Current translation value
 * @returns true if the translation has been modified
 */
export const hasTranslationChanged = (
  original: string | undefined | null,
  current: string | undefined | null
): boolean => {
  const originalIsBlank = isTranslationBlank(original);
  const currentIsBlank = isTranslationBlank(current);

  // If both are blank, no change
  if (originalIsBlank && currentIsBlank) {
    return false;
  }

  // Compare normalized values
  const normalizedOriginal = convertBlankToDisplay(original);
  const normalizedCurrent = current?.trim() ?? '';

  return normalizedOriginal !== normalizedCurrent;
};

/**
 * Calculate translation progress statistics
 *
 * @param translations - Array of translation values
 * @param originalTranslations - Array of original translation values
 * @returns Object with progress statistics
 */
export const calculateTranslationStats = (
  translations: string[],
  originalTranslations: string[] = []
): {
  total: number;
  completed: number;
  blank: number;
  modified: number;
  percentComplete: number;
} => {
  const total = translations.length;
  const blank = translations.filter(t => isTranslationBlank(t)).length;
  const completed = total - blank;

  const modified = translations.filter((t, idx) => {
    const original = originalTranslations[idx];
    return hasTranslationChanged(original, t);
  }).length;

  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    blank,
    modified,
    percentComplete,
  };
};

/**
 * Extract clean speaker name from utterer string
 *
 * Handles formats like:
 * - "SAY.Character.001" -> "Character"
 * - "NARRATOR.Main.002" -> "Main"
 * - Plain names -> return as-is
 *
 * @param utterer - Raw utterer string
 * @param fallback - Fallback value if extraction fails (default: 'Speaker')
 * @returns Clean speaker name
 */
export const extractSpeakerName = (utterer: string, fallback: string = 'Speaker'): string => {
  if (!utterer) return fallback;

  const parts = utterer.split('.');
  if (parts.length >= 4) {
    return parts[3];
  }

  const cleanName = utterer.replace(/^SAY\./, '').replace(/\.\d+$/, '');
  if (cleanName && cleanName !== utterer) {
    return cleanName.replace(/_/g, ' ');
  }

  return fallback;
};
