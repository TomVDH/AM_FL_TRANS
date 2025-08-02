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
   * Parse README JSON data with specific row/column structure
   * 
   * The README JSON has a specific layout:
   * - Character Names: Row 4 (English), Row 16 (Dutch), starting from Column B
   * - Human Character Names: Row 38 (English), Row 47 (Dutch), starting from Column B
   * - Machine Names: Row 67 (English), Row 74 (Dutch), starting from Column B
   * - Location Names: Row 116 (English), Row 124 (Dutch), starting from Column B
   * 
   * @param rawData - The raw JSON data from the README file
   * @returns Parsed entries with sourceEnglish and translatedDutch
   */
  const parseReadmeData = (rawData: any) => {
    const entries: Array<{
      sourceEnglish: string;
      translatedDutch: string;
      category: string;
      rowNumber: number;
    }> = [];
    
    if (!rawData || !rawData.sheets) {
      console.log('🔍 README Parser Debug: No data or sheets found');
      return entries;
    }
    
    const namesSheet = rawData.sheets.find((sheet: any) => 
      sheet.sheetName === "Names and World Overview"
    );
    
    if (!namesSheet || !namesSheet.entries) {
      console.log('🔍 README Parser Debug: Names sheet not found');
      return entries;
    }
    
    console.log('🔍 README Parser Debug: Parsing Names sheet with', namesSheet.entries.length, 'entries');
    
    // Parse Character Names (Row 4 English, Row 16 Dutch)
    const characterRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 4);
    const characterDutchRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 16);
    
    if (characterRow && characterDutchRow) {
      // Start from column B (index 1) and go right
      for (let colIndex = 1; colIndex < Math.max(characterRow.length || 0, characterDutchRow.length || 0); colIndex++) {
        const englishName = characterRow[colIndex];
        const dutchName = characterDutchRow[colIndex];
        
        if (englishName && englishName.toString().trim()) {
          entries.push({
            sourceEnglish: englishName.toString().trim(),
            translatedDutch: dutchName ? dutchName.toString().trim() : '',
            category: 'Character Names',
            rowNumber: 4
          });
        }
      }
    }
    
    // Parse Human Character Names (Row 38 English, Row 47 Dutch)
    const humanRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 38);
    const humanDutchRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 47);
    
    if (humanRow && humanDutchRow) {
      for (let colIndex = 1; colIndex < Math.max(humanRow.length || 0, humanDutchRow.length || 0); colIndex++) {
        const englishName = humanRow[colIndex];
        const dutchName = humanDutchRow[colIndex];
        
        if (englishName && englishName.toString().trim()) {
          entries.push({
            sourceEnglish: englishName.toString().trim(),
            translatedDutch: dutchName ? dutchName.toString().trim() : '',
            category: 'Human Character Names',
            rowNumber: 38
          });
        }
      }
    }
    
    // Parse Machine Names (Row 67 English, Row 74 Dutch)
    const machineRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 67);
    const machineDutchRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 74);
    
    if (machineRow && machineDutchRow) {
      for (let colIndex = 1; colIndex < Math.max(machineRow.length || 0, machineDutchRow.length || 0); colIndex++) {
        const englishName = machineRow[colIndex];
        const dutchName = machineDutchRow[colIndex];
        
        if (englishName && englishName.toString().trim()) {
          entries.push({
            sourceEnglish: englishName.toString().trim(),
            translatedDutch: dutchName ? dutchName.toString().trim() : '',
            category: 'Machine Names',
            rowNumber: 67
          });
        }
      }
    }
    
    // Parse Location Names (Row 116 English, Row 124 Dutch)
    const locationRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 116);
    const locationDutchRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 124);
    
    if (locationRow && locationDutchRow) {
      for (let colIndex = 1; colIndex < Math.max(locationRow.length || 0, locationDutchRow.length || 0); colIndex++) {
        const englishName = locationRow[colIndex];
        const dutchName = locationDutchRow[colIndex];
        
        if (englishName && englishName.toString().trim()) {
          entries.push({
            sourceEnglish: englishName.toString().trim(),
            translatedDutch: dutchName ? dutchName.toString().trim() : '',
            category: 'Location Names',
            rowNumber: 116
          });
        }
      }
    }
    
    console.log('🔍 README Parser Debug: Parsed', entries.length, 'entries');
    return entries;
  };

  /**
   * Find matching entries in JSON data
   * 
   * Searches through the parsed README data for the given text
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
    
    const matches: Array<{
      sourceEnglish: string;
      translatedDutch: string;
      category: string;
      rowNumber: number;
    }> = [];
    
    // Parse the README data with the specific structure
    const parsedEntries = parseReadmeData(jsonData);
    
    parsedEntries.forEach((entry) => {
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
            category: entry.category,
            rowNumber: entry.rowNumber,
            matchType: matchType,
            searchText: searchText
          });
          
          matches.push({
            sourceEnglish: entry.sourceEnglish,
            translatedDutch: entry.translatedDutch || '',
            category: entry.category,
            rowNumber: entry.rowNumber
          });
        }
      }
    });
    
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