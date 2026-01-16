/**
 * Utils Index
 *
 * Central export for all utility functions.
 */

// ============================================================================
// FILE VALIDATION
// ============================================================================

export {
  validateExcelFile,
  isExcelFile,
  formatFileSize,
  type FileValidationResult,
} from './fileValidation';

// ============================================================================
// TRANSLATION HELPERS
// ============================================================================

export {
  // Blank detection
  isTranslationBlank,
  // Value conversion
  convertBlankToDisplay,
  convertDisplayToStorage,
  // Excel column utilities
  columnLetterToIndex,
  indexToColumnLetter,
  // Change detection
  hasTranslationChanged,
  // Statistics
  calculateTranslationStats,
  type TranslationStats,
  // Speaker utilities
  extractSpeakerName,
} from './translationHelpers';
