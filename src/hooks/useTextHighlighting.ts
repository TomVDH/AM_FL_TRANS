import { useMemo } from 'react';

/**
 * useTextHighlighting Hook
 * 
 * Provides highlighting functions for text analysis and character detection.
 * This hook encapsulates the logic for detecting characters and codex matches
 * without the rendering logic, making it reusable across components.
 * 
 * FUTURE REFACTORING OPPORTUNITIES:
 * ====================================
 * 
 * 1. CHARACTER DETECTION MODULE
 *    - Add validation for character name patterns
 *    - Create: useCharacterValidation hook
 *    - Functions to extract: validateCharacterPattern, sanitizeCharacterName
 * 
 * 2. CODEX MATCHING MODULE
 *    - Add caching for codex search results
 *    - Create: useCodexCache hook
 *    - Functions to extract: cacheCodexResults, getCachedMatches
 * 
 * 3. PATTERN MATCHING MODULE
 *    - Add support for custom pattern matching
 *    - Create: usePatternMatching hook
 *    - Functions to extract: matchCustomPatterns, createPatternRules
 * 
 * @param codexData - The codex data to search through
 * @returns Object containing highlighting functions
 */
export const useTextHighlighting = (codexData: any) => {
  /**
   * Check if text matches any codex entries using flexible matching
   * 
   * This function implements two matching strategies:
   * 1. Direct substring matching - for exact name matches
   * 2. Regex-based flexible matching - for hyphenated entries like "butte-mines"
   *    matching text like "Butte Industry Coal Mines"
   * 
   * @param text - The source text to search for codex matches
   * @returns Array of matching codex entries with title, content, and category
   */
  const getMatchingCodexEntries = useMemo(() => (text: string) => {
    if (!codexData || !text) return [];
    
    const matches: Array<{title: string, content: string, category: string}> = [];
    
    // Recursively search through all codex categories and entries
    const searchEntries = (entries: any[]) => {
      entries.forEach(entry => {
        if (entry.title && typeof entry.title === 'string') {
          const title = entry.title.toLowerCase();
          const searchText = text.toLowerCase();
          
          // Direct substring match
          if (searchText.includes(title) || title.includes(searchText)) {
            matches.push({
              title: entry.title,
              content: entry.content || '',
              category: entry.category || 'Unknown'
            });
          } else {
            // Flexible regex matching for hyphenated entries
            const hyphenatedTitle = title.replace(/-/g, '\\s*[-\\s]*');
            const regex = new RegExp(hyphenatedTitle, 'i');
            if (regex.test(searchText)) {
              matches.push({
                title: entry.title,
                content: entry.content || '',
                category: entry.category || 'Unknown'
              });
            }
          }
        }
        
        // Recursively search nested entries
        if (entry.entries && Array.isArray(entry.entries)) {
          searchEntries(entry.entries);
        }
      });
    };
    
    // Search through all codex data
    Object.values(codexData).forEach((category: any) => {
      if (category.entries && Array.isArray(category.entries)) {
        searchEntries(category.entries);
      }
    });
    
    return matches;
  }, [codexData]);

  /**
   * Detect **Ass character names in text
   * 
   * Looks for patterns like "**Ass" or "**Ass Name" in the text
   * and extracts the character names for highlighting and insertion
   * 
   * @param text - The text to search for character names
   * @returns Array of detected character names
   */
  const detectAssCharacters = useMemo(() => (text: string) => {
    if (!text) return [];
    
    const characterPattern = /\*\*([^*\n]+?)(?=\*\*|$)/g;
    const matches = text.match(characterPattern);
    
    if (!matches) return [];
    
    return matches.map(match => match.slice(2)); // Remove ** prefix
  }, []);

  return {
    getMatchingCodexEntries,
    detectAssCharacters,
  };
}; 