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
   * Parse README JSON data with horizontal row structure
   * 
   * The README JSON has a unique horizontal layout:
   * - Character Names: Row 4 (English), Row 16 (Dutch), entries go horizontally across columns
   * - Human Character Names: Row 38 (English), Row 47 (Dutch), entries go horizontally across columns
   * - Machine Names: Row 67 (English), Row 74 (Dutch), entries go horizontally across columns
   * - Location Names: Row 116 (English), Row 124 (Dutch), entries go horizontally across columns
   * 
   * Each row contains multiple entries horizontally, not vertically like other JSON files.
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
      console.log('🔍 README Parser Debug: Character row data:', characterRow);
      console.log('🔍 README Parser Debug: Character Dutch row data:', characterDutchRow);
      console.log('🔍 README Parser Debug: Character row has data field:', !!characterRow.data);
      console.log('🔍 README Parser Debug: Character Dutch row has data field:', !!characterDutchRow.data);
      if (characterRow.data) {
        console.log('🔍 README Parser Debug: Character row data length:', characterRow.data.length);
        console.log('🔍 README Parser Debug: Character row data sample:', characterRow.data.slice(0, 3));
      }
      if (characterDutchRow.data) {
        console.log('🔍 README Parser Debug: Character Dutch row data length:', characterDutchRow.data.length);
        console.log('🔍 README Parser Debug: Character Dutch row data sample:', characterDutchRow.data.slice(0, 3));
      }
      
      // Process horizontal data structure
      if (characterRow.data && characterDutchRow.data) {
        // Process each column horizontally (starting from B, index 1)
        for (let colIndex = 1; colIndex < Math.max(characterRow.data.length, characterDutchRow.data.length); colIndex++) {
          const englishCell = characterRow.data[colIndex];
          const dutchCell = characterDutchRow.data[colIndex];
          
          const englishName = englishCell ? englishCell.value : '';
          const dutchName = dutchCell ? dutchCell.value : '';
          
          if (englishName && englishName.trim()) {
            console.log('🔍 README Parser Debug: Character entry:', {
              colIndex,
              column: englishCell ? englishCell.column : '',
              englishName: englishName.trim(),
              dutchName: dutchName.trim()
            });
            
            entries.push({
              sourceEnglish: englishName.trim(),
              translatedDutch: dutchName.trim(),
              category: 'Character Names',
              rowNumber: 4
            });
          }
        }
      } else {
        // Fallback to old structure if data field doesn't exist
        console.log('🔍 README Parser Debug: Using fallback structure');
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
    }
    
    // Parse Human Character Names (Row 38 English, Row 47 Dutch)
    const humanRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 38);
    const humanDutchRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 47);
    
    if (humanRow && humanDutchRow) {
      console.log('🔍 README Parser Debug: Human row data:', humanRow);
      console.log('🔍 README Parser Debug: Human Dutch row data:', humanDutchRow);
      
      if (humanRow.data && humanDutchRow.data) {
        for (let colIndex = 1; colIndex < Math.max(humanRow.data.length, humanDutchRow.data.length); colIndex++) {
          const englishCell = humanRow.data[colIndex];
          const dutchCell = humanDutchRow.data[colIndex];
          
          const englishName = englishCell ? englishCell.value : '';
          const dutchName = dutchCell ? dutchCell.value : '';
          
          if (englishName && englishName.trim()) {
            console.log('🔍 README Parser Debug: Human entry:', {
              colIndex,
              column: englishCell ? englishCell.column : '',
              englishName: englishName.trim(),
              dutchName: dutchName.trim()
            });
            
            entries.push({
              sourceEnglish: englishName.trim(),
              translatedDutch: dutchName.trim(),
              category: 'Human Character Names',
              rowNumber: 38
            });
          }
        }
      } else {
        // Fallback to old structure
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
    }
    
    // Parse Machine Names (Row 67 English, Row 74 Dutch)
    const machineRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 67);
    const machineDutchRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 74);
    
    if (machineRow && machineDutchRow) {
      console.log('🔍 README Parser Debug: Machine row data:', machineRow);
      console.log('🔍 README Parser Debug: Machine Dutch row data:', machineDutchRow);
      
      if (machineRow.data && machineDutchRow.data) {
        for (let colIndex = 1; colIndex < Math.max(machineRow.data.length, machineDutchRow.data.length); colIndex++) {
          const englishCell = machineRow.data[colIndex];
          const dutchCell = machineDutchRow.data[colIndex];
          
          const englishName = englishCell ? englishCell.value : '';
          const dutchName = dutchCell ? dutchCell.value : '';
          
          if (englishName && englishName.trim()) {
            console.log('🔍 README Parser Debug: Machine entry:', {
              colIndex,
              column: englishCell ? englishCell.column : '',
              englishName: englishName.trim(),
              dutchName: dutchName.trim()
            });
            
            entries.push({
              sourceEnglish: englishName.trim(),
              translatedDutch: dutchName.trim(),
              category: 'Machine Names',
              rowNumber: 67
            });
          }
        }
      } else {
        // Fallback to old structure
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
    }
    
    // Parse Location Names (Row 116 English, Row 124 Dutch)
    const locationRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 116);
    const locationDutchRow = namesSheet.entries.find((entry: any) => entry.rowNumber === 124);
    
    if (locationRow && locationDutchRow) {
      console.log('🔍 README Parser Debug: Location row data:', locationRow);
      console.log('🔍 README Parser Debug: Location Dutch row data:', locationDutchRow);
      
      if (locationRow.data && locationDutchRow.data) {
        for (let colIndex = 1; colIndex < Math.max(locationRow.data.length, locationDutchRow.data.length); colIndex++) {
          const englishCell = locationRow.data[colIndex];
          const dutchCell = locationDutchRow.data[colIndex];
          
          const englishName = englishCell ? englishCell.value : '';
          const dutchName = dutchCell ? dutchCell.value : '';
          
          if (englishName && englishName.trim()) {
            console.log('🔍 README Parser Debug: Location entry:', {
              colIndex,
              column: englishCell ? englishCell.column : '',
              englishName: englishName.trim(),
              dutchName: dutchName.trim()
            });
            
            entries.push({
              sourceEnglish: englishName.trim(),
              translatedDutch: dutchName.trim(),
              category: 'Location Names',
              rowNumber: 116
            });
          }
        }
      } else {
        // Fallback to old structure
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
    }
    
    console.log('🔍 README Parser Debug: Parsed', entries.length, 'entries');
    console.log('🔍 README Parser Debug: Sample entries:', entries.slice(0, 5));
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