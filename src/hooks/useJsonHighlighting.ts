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
   * Searches through the "Names and World Overview" sheet specifically
   * for the given text in sourceEnglish field
   * 
   * @param text - The text to search for
   * @returns Array of matching entries with translatedDutch values
   */
  const findJsonMatches = useMemo(() => (text: string) => {
    if (!jsonData || !text) {
      console.log('🔍 JSON Highlighting Debug: No jsonData or text provided');
      return [];
    }
    
    console.log('🔍 JSON Highlighting Debug: Searching for text:', text);
    console.log('🔍 JSON Highlighting Debug: jsonData structure:', jsonData);
    
    const matches: Array<{
      sourceEnglish: string;
      translatedDutch: string;
      sheetName: string;
      rowNumber: number;
    }> = [];
    
    // Search specifically in the "Names and World Overview" sheet
    if (jsonData.sheets && Array.isArray(jsonData.sheets)) {
      console.log('🔍 JSON Highlighting Debug: Found sheets:', jsonData.sheets.length);
      
      const namesSheet = jsonData.sheets.find((sheet: any) => 
        sheet.sheetName === "Names and World Overview"
      );
      
      if (namesSheet && namesSheet.entries && Array.isArray(namesSheet.entries)) {
        console.log('🔍 JSON Highlighting Debug: Found Names sheet with', namesSheet.entries.length, 'entries');
        
        namesSheet.entries.forEach((entry: any) => {
          if (entry.sourceEnglish && typeof entry.sourceEnglish === 'string') {
            const sourceText = entry.sourceEnglish.toLowerCase();
            const searchText = text.toLowerCase();
            
            // Check for exact phrase match first (most precise)
            const hasExactPhrase = sourceText === searchText;
            
            // Check for word boundary matches (more precise than substring)
            const sourceWords = sourceText.split(/\s+/);
            const searchWords = searchText.split(/\s+/);
            
            // Check if all search words are found in source words (exact word match)
            const hasExactWordMatch = searchWords.every(searchWord => 
              sourceWords.some(sourceWord => sourceWord === searchWord)
            );
            
            // Also check for substring match but only for single words
            const hasSubstringMatch = searchWords.length === 1 && 
              (sourceText.includes(searchText) || searchText.includes(sourceText));
            
                          if (hasExactPhrase || hasExactWordMatch || hasSubstringMatch) {
                let matchType = 'unknown';
                if (hasExactPhrase) matchType = 'exact phrase';
                else if (hasExactWordMatch) matchType = 'exact word match';
                else if (hasSubstringMatch) matchType = 'substring match';
                
                console.log('🔍 JSON Highlighting Debug: Found match!', {
                  sourceEnglish: entry.sourceEnglish,
                  translatedDutch: entry.translatedDutch,
                  rowNumber: entry.rowNumber,
                  matchType: matchType,
                  searchText: searchText
                });
              
              matches.push({
                sourceEnglish: entry.sourceEnglish,
                translatedDutch: entry.translatedDutch || '',
                sheetName: namesSheet.sheetName,
                rowNumber: entry.rowNumber
              });
            }
          }
        });
      } else {
        console.log('🔍 JSON Highlighting Debug: Names sheet not found or no entries');
      }
    } else {
      console.log('🔍 JSON Highlighting Debug: No sheets found in jsonData');
    }
    
    console.log('🔍 JSON Highlighting Debug: Total matches found:', matches.length);
    return matches;
  }, [jsonData]);

  /**
   * Get hover text for a matched entry
   * 
   * Returns the translatedDutch value if available, otherwise "Not found in Localization Manual"
   * 
   * @param entry - The matched entry
   * @returns Hover text to display
   */
  const getHoverText = useMemo(() => (entry: any) => {
    if (entry.translatedDutch && entry.translatedDutch.trim() !== '') {
      return entry.translatedDutch;
    }
    return "Not found in Localization Manual";
  }, []);

  return {
    findJsonMatches,
    getHoverText,
  };
}; 