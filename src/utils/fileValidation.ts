/**
 * File Validation Utilities
 *
 * Centralized file validation for Excel uploads.
 * Replaces duplicate validation code in useTranslationState, useExcelProcessing, and SetupWizard.
 */

import {
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  EXCEL_VALID_MIME_TYPES,
  EXCEL_VALID_EXTENSIONS,
  type ExcelMimeType,
} from '@/constants';

// ============================================================================
// TYPES
// ============================================================================

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate an Excel file for upload.
 *
 * Checks:
 * - File type (MIME type or extension)
 * - File size (max 50MB by default)
 *
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * const result = validateExcelFile(file);
 * if (!result.valid) {
 *   toast.error(result.error);
 *   return;
 * }
 */
export const validateExcelFile = (file: File): FileValidationResult => {
  // Check MIME type
  const isValidMimeType = EXCEL_VALID_MIME_TYPES.includes(file.type as ExcelMimeType);

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
 * Check if a file is an Excel file based on extension.
 *
 * @param fileName - The file name to check
 * @returns true if the file has an Excel extension
 */
export const isExcelFile = (fileName: string): boolean => {
  return EXCEL_VALID_EXTENSIONS.some(ext => fileName.toLowerCase().endsWith(ext));
};

/**
 * Get a human-readable file size string.
 *
 * @param bytes - File size in bytes
 * @returns Formatted string like "1.5 MB" or "256 KB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};
