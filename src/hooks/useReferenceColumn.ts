import { useState } from 'react';

/**
 * useReferenceColumn Hook
 * 
 * Manages reference column functionality for Excel processing.
 * This hook encapsulates the logic for handling optional reference translations
 * from Excel files, allowing users to pre-populate translations with existing data.
 * 
 * FUTURE REFACTORING OPPORTUNITIES:
 * ====================================
 * 
 * 1. REFERENCE VALIDATION MODULE
 *    - Add validation for reference column data quality
 *    - Create: useReferenceValidation hook + ReferenceValidator component
 *    - Functions to extract: validateReferenceData, checkReferenceFormat
 * 
 * 2. REFERENCE MERGE MODULE
 *    - Add functionality to merge multiple reference sources
 *    - Create: useReferenceMerge hook + ReferenceMerger component
 *    - Functions to extract: mergeReferences, resolveConflicts
 * 
 * 3. REFERENCE EXPORT MODULE
 *    - Add functionality to export reference data separately
 *    - Create: useReferenceExport hook + ReferenceExporter component
 *    - Functions to extract: exportReferenceData, generateReferenceReport
 * 
 * @returns {Object} Reference column state and functions
 */
export const useReferenceColumn = () => {
  // ========== Reference Column State ==========
  // FUTURE SPLIT: REFERENCE PROCESSING MODULE
  // This state block should be extracted to useReferenceProcessor hook
  // Components to create: ReferenceProcessor, ReferenceConfiguration, ReferenceValidator
  // State management: referenceColumn, useReferenceColumn, referenceData, referenceValidation
  const [referenceColumn, setReferenceColumn] = useState('D');         // Optional reference translation column
  const [useReferenceColumn, setUseReferenceColumn] = useState(false); // Toggle for reference column

  /**
   * Reset reference column to default state
   * Called when switching input modes or clearing data
   */
  const resetReferenceColumn = () => {
    setReferenceColumn('D');
    setUseReferenceColumn(false);
  };

  /**
   * Update reference column with validation
   * Ensures column is uppercase and valid
   */
  const updateReferenceColumn = (column: string) => {
    const upperColumn = column.toUpperCase();
    setReferenceColumn(upperColumn);
  };

  /**
   * Toggle reference column usage
   * Enables/disables reference column functionality
   */
  const toggleReferenceColumn = () => {
    setUseReferenceColumn(!useReferenceColumn);
  };

  /**
   * Process reference data from Excel row
   * Extracts reference translation from specified column
   */
  const processReferenceData = (dataRow: any[], referenceColIndex: number): string => {
    if (!useReferenceColumn || !dataRow[referenceColIndex]) {
      return '';
    }
    return dataRow[referenceColIndex].toString().trim();
  };

  /**
   * Initialize translations with reference data
   * Populates translations array with reference data if enabled
   */
  const initializeTranslationsWithReference = (extractedReferences: string[], totalCount: number): string[] => {
    if (useReferenceColumn) {
      return [...extractedReferences];
    }
    return new Array(totalCount).fill('');
  };

  return {
    // State
    referenceColumn,
    useReferenceColumn,
    
    // Functions
    setReferenceColumn: updateReferenceColumn,
    setUseReferenceColumn,
    resetReferenceColumn,
    toggleReferenceColumn,
    processReferenceData,
    initializeTranslationsWithReference,
  };
}; 