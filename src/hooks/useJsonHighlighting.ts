import { useMemo } from 'react';

/**
 * useJsonHighlighting Hook
 * 
 * Provides highlighting functions for JSON-based text analysis.
 * This hook searches through JSON data to find matching entries
 * and provides translatedDutch values for highlighting.
 * 
 * @param jsonData - The JSON data to search through
 * @returns Object containing highlighting functions
 */
export const useJsonHighlighting = (jsonData: any) => {
  /**
   * Find matching entries in JSON data
   * 
   * Searches through all sheets and entries to find matches
   * for the given text in sourceEnglish field
   * 
   * @param text - The text to search for
   * @returns Array of matching entries with translatedDutch values
   */
  const findJsonMatches = useMemo(() => (text: string) => {
    if (!jsonData || !text) return [];
    
    const matches: Array<{
      sourceEnglish: string;
      translatedDutch: string;
      sheetName: string;
      rowNumber: number;
    }> = [];
    
    // Search through all sheets
    if (jsonData.sheets && Array.isArray(jsonData.sheets)) {
      jsonData.sheets.forEach((sheet: any) => {
        if (sheet.entries && Array.isArray(sheet.entries)) {
          sheet.entries.forEach((entry: any) => {
            if (entry.sourceEnglish && typeof entry.sourceEnglish === 'string') {
              const sourceText = entry.sourceEnglish.toLowerCase();
              const searchText = text.toLowerCase();
              
              // Check if the source text contains the search term or vice versa
              if (sourceText.includes(searchText) || searchText.includes(sourceText)) {
                matches.push({
                  sourceEnglish: entry.sourceEnglish,
                  translatedDutch: entry.translatedDutch || '',
                  sheetName: sheet.sheetName,
                  rowNumber: entry.rowNumber
                });
              }
            }
          });
        }
      });
    }
    
    return matches;
  }, [jsonData]);

  /**
   * Get hover text for a matched entry
   * 
   * Returns the translatedDutch value if available, otherwise "Not found in E0"
   * 
   * @param entry - The matched entry
   * @returns Hover text to display
   */
  const getHoverText = useMemo(() => (entry: any) => {
    if (entry.translatedDutch && entry.translatedDutch.trim() !== '') {
      return entry.translatedDutch;
    }
    return "Not found in E0";
  }, []);

  return {
    findJsonMatches,
    getHoverText,
  };
}; 