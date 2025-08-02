import { useState, useCallback, useEffect } from 'react';

export interface JsonHighlightingState {
  // JSON highlighting state
  highlightingJsonData: any;
  jsonSearchTerm: string;
  jsonMode: boolean;
  
  // Setters
  setHighlightingJsonData: (data: any) => void;
  setJsonSearchTerm: (term: string) => void;
  setJsonMode: (mode: boolean) => void;
  
  // Functions
  findJsonMatches: (text: string) => any[];
  getHoverText: (text: string) => string;
  loadLocalizationManual: () => Promise<void>;
  copyJsonField: (text: string, fieldName: string) => void;
  copySourceToJsonSearch: () => void;
}

/**
 * JSON Highlighting Hook
 * 
 * Manages all JSON highlighting and data management functionality:
 * - JSON data loading and management
 * - Text highlighting based on JSON data
 * - JSON search functionality
 * - Copy operations for JSON fields
 * - Localization manual integration
 * 
 * @returns JSON highlighting state and functions
 */
export const useJsonHighlighting = (initialJsonData?: any): JsonHighlightingState => {
  // ========== JSON Highlighting State ==========
  const [highlightingJsonData, setHighlightingJsonData] = useState<any>(initialJsonData || null);
  const [jsonSearchTerm, setJsonSearchTerm] = useState('');
  const [jsonMode, setJsonMode] = useState(false);
  
  // ========== JSON Highlighting Functions ==========
  
  /**
   * Find JSON matches in text
   * 
   * Searches through JSON data to find entries that match the given text.
   * Used for highlighting world entities and character names.
   * 
   * @param text - Text to search for matches
   * @returns Array of matching JSON entries
   */
  const findJsonMatches = useCallback((text: string): any[] => {
    if (!highlightingJsonData || !text) return [];
    
    const matches: any[] = [];
    const searchText = text.toLowerCase();
    
    console.log('🔧 JSON Highlighting Debug: Searching for:', searchText);
    console.log('🔧 JSON Highlighting Debug: JSON data structure:', highlightingJsonData);
    
    // Search through JSON data structure
    if (highlightingJsonData.sheets) {
      highlightingJsonData.sheets.forEach((sheet: any) => {
        if (sheet.entries) {
          sheet.entries.forEach((entry: any) => {
            // Check multiple fields for matches
            const fieldsToCheck = ['utterer', 'sourceEnglish', 'translatedDutch', 'context'];
            let found = false;
            
            fieldsToCheck.forEach(field => {
              if (entry[field] && entry[field].toLowerCase().includes(searchText)) {
                matches.push(entry);
                found = true;
                console.log('🔧 JSON Highlighting Debug: Found match in', field, ':', entry[field]);
              }
            });
            
            // Also check if the search text contains any of the entry values
            if (!found) {
              fieldsToCheck.forEach(field => {
                if (entry[field] && searchText.includes(entry[field].toLowerCase())) {
                  matches.push(entry);
                  console.log('🔧 JSON Highlighting Debug: Found reverse match:', entry[field]);
                }
              });
            }
          });
        }
      });
    }
    
    console.log('🔧 JSON Highlighting Debug: Total matches found:', matches.length);
    return matches;
  }, [highlightingJsonData]);
  
  /**
   * Get hover text for highlighted elements
   * 
   * Generates hover text for JSON-matched elements.
   * Shows additional context or information about the matched item.
   * 
   * @param match - The matched JSON entry
   * @returns Hover text string
   */
  const getHoverText = useCallback((match: any): string => {
    if (!match) return '';
    
    const parts = [];
    if (match.translatedDutch) parts.push(`Translated: ${match.translatedDutch}`);
    if (match.context) parts.push(`Context: ${match.context}`);
    if (match.sourceEnglish) parts.push(`Source: ${match.sourceEnglish}`);
    
    return parts.join(' | ');
  }, []);
  
  /**
   * Load localization manual for highlighting
   * 
   * Fetches the localization manual JSON data from the API.
   * This data is used for highlighting world entities and character names.
   */
  const loadLocalizationManual = useCallback(async () => {
    console.log('🔧 JSON Highlighting Debug: Loading Localization Manual for highlighting');
    try {
      const response = await fetch('/api/json-data?file=READ_ME_LocalizationManual.json');
      if (response.ok) {
        const data = await response.json();
        setHighlightingJsonData(data);
        console.log('🔧 JSON Highlighting Debug: Localization Manual loaded for highlighting');
      } else {
        console.log('🔧 JSON Highlighting Debug: Failed to load Localization Manual');
      }
    } catch (error) {
      console.log('🔧 JSON Highlighting Debug: Error loading Localization Manual:', error);
    }
  }, []);
  
  /**
   * Copy JSON field to clipboard
   * 
   * Copies a specific field from JSON data to the clipboard.
   * Used for quick copying of character names or world entities.
   * 
   * @param text - Text to search for in JSON
   * @param fieldName - Name of the field to copy
   */
  const copyJsonField = useCallback((text: string, fieldName: string) => {
    const matches = findJsonMatches(text);
    if (matches.length > 0 && matches[0][fieldName]) {
      navigator.clipboard.writeText(matches[0][fieldName]);
    }
  }, [findJsonMatches]);
  
  /**
   * Copy source text to JSON search
   * 
   * Sets the current source text as the JSON search term.
   * Used for searching the current text in the JSON viewer.
   */
  const copySourceToJsonSearch = useCallback(() => {
    // This function would be called with the current source text
    // The actual implementation depends on how it's used in the component
    console.log('🔧 JSON Highlighting Debug: Copying source text to JSON search');
  }, []);
  
  // ========== Effects ==========
  
  /**
   * Auto-load localization manual on mount
   */
  useEffect(() => {
    if (!highlightingJsonData) {
      loadLocalizationManual();
    }
  }, [highlightingJsonData, loadLocalizationManual]);
  
  /**
   * Debug: Log JSON data changes
   */
  useEffect(() => {
    console.log('🔧 JSON Highlighting Debug: highlightingJsonData:', highlightingJsonData);
    console.log('🔧 JSON Highlighting Debug: highlightingJsonData sheets:', highlightingJsonData?.sheets?.length);
    if (highlightingJsonData?.sheets) {
      const namesSheet = highlightingJsonData.sheets.find((sheet: any) => 
        sheet.sheetName === "Names and World Overview"
      );
      console.log('🔧 JSON Highlighting Debug: Names sheet found:', !!namesSheet);
      if (namesSheet) {
        console.log('🔧 JSON Highlighting Debug: Names sheet entries:', namesSheet.entries?.length);
      }
    }
  }, [highlightingJsonData]);
  
  return {
    // State
    highlightingJsonData,
    jsonSearchTerm,
    jsonMode,
    
    // Setters
    setHighlightingJsonData,
    setJsonSearchTerm,
    setJsonMode,
    
    // Functions
    findJsonMatches,
    getHoverText,
    loadLocalizationManual,
    copyJsonField,
    copySourceToJsonSearch,
  };
}; 