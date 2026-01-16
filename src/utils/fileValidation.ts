/**
 * File Validation Utilities
 *
 * Centralized file validation logic for Excel and other file types.
 * Eliminates code duplication across useTranslationState, useExcelProcessing, and SetupWizard.
 */

import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  EXCEL_VALID_MIME_TYPES,
  EXCEL_VALID_EXTENSIONS,
} from '@/constants';

/**
 * Result of file validation
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate an Excel file for upload
 *
 * Checks:
 * - File type (MIME type or extension)
 * - File size (max 50MB by default)
 *
 * @param file - The File object to validate
 * @returns Validation result with error message if invalid
 */
export const validateExcelFile = (file: File): FileValidationResult => {
  // Check MIME type
  const isValidMimeType = EXCEL_VALID_MIME_TYPES.includes(
    file.type as typeof EXCEL_VALID_MIME_TYPES[number]
  );

  // Check file extension as fallback
  const isValidExtension = EXCEL_VALID_EXTENSIONS.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (!isValidMimeType && !isValidExtension) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large. Maximum file size is ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validate a JSON file for upload
 *
 * @param file - The File object to validate
 * @returns Validation result with error message if invalid
 */
export const validateJsonFile = (file: File): FileValidationResult => {
  const isValidMimeType = file.type === 'application/json';
  const isValidExtension = file.name.toLowerCase().endsWith('.json');

  if (!isValidMimeType && !isValidExtension) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JSON file (.json)',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large. Maximum file size is ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validate a CSV file for upload
 *
 * @param file - The File object to validate
 * @returns Validation result with error message if invalid
 */
export const validateCsvFile = (file: File): FileValidationResult => {
  const isValidMimeType = file.type === 'text/csv' || file.type === 'application/csv';
  const isValidExtension = file.name.toLowerCase().endsWith('.csv');

  if (!isValidMimeType && !isValidExtension) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a CSV file (.csv)',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large. Maximum file size is ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Get human-readable file size string
 *
 * @param bytes - File size in bytes
 * @returns Formatted string like "1.5 MB" or "500 KB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};
