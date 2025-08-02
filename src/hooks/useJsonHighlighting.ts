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
   * Parse README JSON data with unified structure
   * 
   * The README JSON now has a unified structure where each entry contains:
   * - sourceEnglish: The English name
   * - translatedDutch: The Dutch translation
   * - context: The category (Character, Human Character, Machine, Location)
   * - rowNumber: The source row from Excel
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
    
    // Process unified structure entries
    namesSheet.entries.forEach((entry: any) => {
      if (entry.sourceEnglish && entry.sourceEnglish.trim()) {
        console.log('🔍 README Parser Debug: Processing entry:', {
          sourceEnglish: entry.sourceEnglish,
          translatedDutch: entry.translatedDutch,
          context: entry.context,
          rowNumber: entry.rowNumber
        });
        
        entries.push({
          sourceEnglish: entry.sourceEnglish.trim(),
          translatedDutch: entry.translatedDutch ? entry.translatedDutch.trim() : '',
          category: entry.context,
          rowNumber: entry.rowNumber
        });
      }
    });
    
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
        
        // Check for partial matches (for terms like "Butte")
        const hasPartialMatch = sourceText.includes(searchText) || searchText.includes(sourceText);
        
        // Also check for substring match but only for single words
        const hasSubstringMatch = searchWords.length === 1 && 
          (sourceText.includes(searchText) || searchText.includes(sourceText));
        
        if (hasExactPhrase || hasExactWordMatch || hasSubstringMatch || hasPartialMatch) {
          let matchType = 'unknown';
          if (hasExactPhrase) matchType = 'exact phrase';
          else if (hasExactWordMatch) matchType = 'exact word match';
          else if (hasSubstringMatch) matchType = 'substring match';
          else if (hasPartialMatch) matchType = 'partial match';
          
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
   * Temporarily disabled Dutch translation in title to focus on blue glow highlighting
   * 
   * @param entry - The matched entry
   * @returns Hover text to display
   */
  const getHoverText = useMemo(() => (entry: any) => {
    // Temporarily return empty to disable Dutch translation in title
    return "";
  }, []);

  return {
    findJsonMatches,
    getHoverText,
  };
}; 