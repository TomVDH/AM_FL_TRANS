/**
 * Translation Helper Utilities
 *
 * Utility functions for translation operations.
 * Consolidates repeated patterns from across the codebase.
 */

import { BLANK_PLACEHOLDER } from '@/constants';

// ============================================================================
// BLANK/EMPTY DETECTION
// ============================================================================

/**
 * Check if a translation value is blank (empty or placeholder).
 *
 * @param translation - The translation value to check
 * @returns true if the value is blank
 */
export const isTranslationBlank = (translation: string | undefined | null): boolean => {
  if (!translation) return true;
  return translation === '' || translation === BLANK_PLACEHOLDER;
};

// ============================================================================
// VALUE CONVERSION
// ============================================================================

/**
 * Convert a stored translation value to display format.
 * Converts BLANK_PLACEHOLDER to empty string for UI display.
 *
 * @param translation - The stored translation value
 * @returns Value suitable for display (empty string if blank)
 */
export const convertBlankToDisplay = (translation: string | undefined | null): string => {
  if (!translation || translation === BLANK_PLACEHOLDER) {
    return '';
  }
  return translation;
};

/**
 * Convert a display value to storage format.
 * Converts empty strings to BLANK_PLACEHOLDER for storage.
 *
 * @param value - The display value from UI
 * @returns Value suitable for storage
 */
export const convertDisplayToStorage = (value: string): string => {
  const trimmed = value.trim();
  return trimmed === '' ? BLANK_PLACEHOLDER : trimmed;
};

// ============================================================================
// EXCEL COLUMN UTILITIES
// ============================================================================

/**
 * Convert Excel column letter(s) to zero-based index.
 * Supports single letters (A-Z) and double letters (AA-ZZ).
 *
 * @param column - Column letter(s) like "A", "J", "AA"
 * @returns Zero-based column index
 *
 * @example
 * columnLetterToIndex('A') // 0
 * columnLetterToIndex('J') // 9
 * columnLetterToIndex('AA') // 26
 */
export const columnLetterToIndex = (column: string): number => {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result - 1; // Convert to zero-based
};

/**
 * Convert zero-based index to Excel column letter(s).
 *
 * @param index - Zero-based column index
 * @returns Column letter(s)
 *
 * @example
 * indexToColumnLetter(0) // 'A'
 * indexToColumnLetter(9) // 'J'
 * indexToColumnLetter(26) // 'AA'
 */
export const indexToColumnLetter = (index: number): string => {
  let result = '';
  let n = index + 1; // Convert to one-based for calculation
  while (n > 0) {
    n--;
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26);
  }
  return result;
};

// ============================================================================
// CHANGE DETECTION
// ============================================================================

/**
 * Check if a translation has changed from its original value.
 * Handles blank/placeholder comparisons correctly.
 *
 * @param original - Original translation value
 * @param current - Current translation value
 * @returns true if the values differ meaningfully
 */
export const hasTranslationChanged = (
  original: string | undefined,
  current: string | undefined
): boolean => {
  const originalIsBlank = isTranslationBlank(original);
  const currentIsBlank = isTranslationBlank(current);

  // If both blank, no change
  if (originalIsBlank && currentIsBlank) return false;

  // If one blank and one not, there's a change
  if (originalIsBlank !== currentIsBlank) return true;

  // Both have values, compare them
  return original !== current;
};

// ============================================================================
// STATISTICS
// ============================================================================

export interface TranslationStats {
  total: number;
  completed: number;
  blank: number;
  modified: number;
}

/**
 * Calculate statistics for a set of translations.
 *
 * @param translations - Current translation values
 * @param originalTranslations - Original translation values (for modified count)
 * @returns Statistics object
 */
export const calculateTranslationStats = (
  translations: string[],
  originalTranslations: string[]
): TranslationStats => {
  const total = translations.length;
  const blank = translations.filter(t => isTranslationBlank(t)).length;
  const completed = total - blank;
  const modified = translations.filter((t, idx) => {
    const original = originalTranslations[idx];
    return hasTranslationChanged(original, t);
  }).length;

  return { total, completed, blank, modified };
};

// ============================================================================
// SPEAKER/UTTERER UTILITIES
// ============================================================================

/**
 * Extract a clean speaker name from an utterer identifier string.
 * Parses formats like "SAY.Category.SubCategory.Name.123"
 *
 * @param utterer - Raw utterer identifier string
 * @param fallback - Fallback value if parsing fails (default: 'Speaker')
 * @returns Clean speaker name
 *
 * @example
 * extractSpeakerName('SAY.Chapter1.Scene2.John.5') // 'John'
 * extractSpeakerName('') // 'Speaker'
 */
export const extractSpeakerName = (utterer: string, fallback = 'Speaker'): string => {
  if (!utterer) return fallback;

  // Try to extract from dot-separated format
  const parts = utterer.split('.');
  if (parts.length >= 4) {
    return parts[3];
  }

  // Fallback: clean up the string
  const cleanName = utterer.replace(/^SAY\./, '').replace(/\.\d+$/, '');
  if (cleanName && cleanName !== utterer) {
    return cleanName.replace(/_/g, ' ');
  }

  return fallback;
};
