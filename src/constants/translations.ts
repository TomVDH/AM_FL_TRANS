/**
 * Translation Constants
 *
 * Centralized constants for translation-related functionality.
 * Replaces hardcoded strings that were duplicated across the codebase.
 */

// ============================================================================
// PLACEHOLDER VALUES
// ============================================================================

/**
 * Placeholder value for blank/empty translations in storage.
 * Used internally to distinguish between "not yet translated" and "intentionally empty".
 * Display should convert this to empty string.
 */
export const BLANK_PLACEHOLDER = '[BLANK, REMOVE LATER]';

// ============================================================================
// FILE SIZE LIMITS
// ============================================================================

/** Maximum file size in megabytes */
export const MAX_FILE_SIZE_MB = 50;

/** Maximum file size in bytes (computed from MB) */
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ============================================================================
// EXCEL CONFIGURATION
// ============================================================================

/** Column index for Dutch translations (Column J = index 9, 0-based) */
export const DUTCH_COLUMN_INDEX = 9;

/** Valid MIME types for Excel file uploads */
export const EXCEL_VALID_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
] as const;

/** Valid file extensions for Excel files */
export const EXCEL_VALID_EXTENSIONS = ['.xlsx', '.xls'] as const;

// ============================================================================
// SESSION CONFIGURATION
// ============================================================================

/** How long session data is considered valid (in hours) */
export const SESSION_EXPIRY_HOURS = 24;

/** Key used for session storage */
export const SESSION_STORAGE_KEY = 'translation_session';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ExcelMimeType = (typeof EXCEL_VALID_MIME_TYPES)[number];
export type ExcelExtension = (typeof EXCEL_VALID_EXTENSIONS)[number];
