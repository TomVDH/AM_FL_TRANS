/**
 * Translation Constants
 *
 * Centralized constants for the translation workflow application.
 * These values are used throughout the codebase for consistency.
 */

// ============================================================================
// TRANSLATION PLACEHOLDERS
// ============================================================================

/**
 * Placeholder value for empty/blank translations.
 * Used as a sentinel value to distinguish between "not yet translated"
 * and "intentionally empty" states.
 */
export const BLANK_PLACEHOLDER = '[BLANK, REMOVE LATER]';

/**
 * Display value for blank translations (empty string for UI display)
 */
export const BLANK_DISPLAY_VALUE = '';

// ============================================================================
// FILE VALIDATION
// ============================================================================

/**
 * Maximum file size in megabytes
 */
export const MAX_FILE_SIZE_MB = 50;

/**
 * Maximum file size in bytes (calculated from MB)
 */
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Valid MIME types for Excel files
 */
export const EXCEL_VALID_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
] as const;

/**
 * Valid file extensions for Excel files
 */
export const EXCEL_VALID_EXTENSIONS = ['.xlsx', '.xls'] as const;

// ============================================================================
// EXCEL COLUMN CONFIGURATION
// ============================================================================

/**
 * Default column index for Dutch translations (Column J = index 9)
 * Note: Excel columns are 0-indexed in the processing logic
 */
export const DUTCH_COLUMN_INDEX = 9;

/**
 * Character code for 'A' - used for column letter to index conversion
 */
export const EXCEL_COLUMN_A_CODE = 65;

/**
 * Default source column letter
 */
export const DEFAULT_SOURCE_COLUMN = 'B';

/**
 * Default utterer (speaker) column letter
 */
export const DEFAULT_UTTERER_COLUMN = 'A';

/**
 * Default start row for data (1-indexed, typically row 2 to skip header)
 */
export const DEFAULT_START_ROW = 2;

// ============================================================================
// SESSION PERSISTENCE
// ============================================================================

/**
 * Session expiry time in hours
 */
export const SESSION_EXPIRY_HOURS = 24;

/**
 * Local storage key for session data
 */
export const SESSION_STORAGE_KEY = 'translation_session';

// ============================================================================
// UI CONFIGURATION
// ============================================================================

/**
 * Debounce delay for search operations (milliseconds)
 */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Animation duration for UI transitions (milliseconds)
 */
export const ANIMATION_DURATION_MS = 200;

/**
 * Milestone interval for celebrations (every N entries)
 */
export const MILESTONE_INTERVAL = 10;

// ============================================================================
// INPUT MODES
// ============================================================================

/**
 * Available input modes for the translation workflow
 */
export const INPUT_MODES = {
  EXCEL: 'excel',
  EMBEDDED_JSON: 'embedded-json',
  MANUAL: 'manual',
} as const;

export type InputMode = typeof INPUT_MODES[keyof typeof INPUT_MODES];

// ============================================================================
// FILTER STATUS
// ============================================================================

/**
 * Available filter statuses for translation entries
 */
export const FILTER_STATUSES = {
  ALL: 'all',
  COMPLETED: 'completed',
  BLANK: 'blank',
  MODIFIED: 'modified',
} as const;

export type FilterStatus = typeof FILTER_STATUSES[keyof typeof FILTER_STATUSES];

// ============================================================================
// SYNC STATUS (for Live Edit mode)
// ============================================================================

/**
 * Sync status values for live edit mode
 */
export const SYNC_STATUSES = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  SYNCED: 'synced',
  ERROR: 'error',
} as const;

export type SyncStatus = typeof SYNC_STATUSES[keyof typeof SYNC_STATUSES];
