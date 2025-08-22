import { useState, useCallback, useEffect } from 'react';

export interface CSVEntry {
  row: string;
  context: string;
  key: string;
  english: string;
  dutch: string;
  utterer: string;
  sheetName?: string;
}

export interface CSVSheet {
  sheetName: string;
  entries: CSVEntry[];
}

export interface CSVData {
  fileName: string;
  totalSheets: number;
  totalEntries: number;
  sheets: CSVSheet[];
  loadedAt: string;
}

export interface CSVSearchResult {
  file: string;
  matches: CSVEntry[];
}

export interface CSVConsultationState {
  // Data state
  availableFiles: string[];
  loadedData: Map<string, CSVData>;
  searchResults: CSVSearchResult[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  lastSearchTerm: string;
  
  // Functions
  loadCSVFile: (fileName: string) => Promise<CSVData | null>;
  searchAcrossFiles: (files: string[], searchTerm: string, context?: string) => Promise<CSVSearchResult[]>;
  getQuickSuggestions: (text: string, maxResults?: number) => CSVEntry[];
  consultForTranslation: (sourceText: string) => Promise<CSVEntry[]>;
  clearCache: () => void;
}

/**
 * CSV Consultation Hook
 * 
 * Provides dynamic consultation of CSV data during translation workflow.
 * Supports caching, searching, and quick suggestions for translation assistance.
 * 
 * Features:
 * - Lazy loading of CSV files
 * - Cross-file searching
 * - Caching for performance
 * - Quick suggestions based on current text
 * - Translation consultation based on source text
 * 
 * @returns CSV consultation state and functions
 */
export const useCSVConsultation = (): CSVConsultationState => {
  // ========== State ==========
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [loadedData, setLoadedData] = useState<Map<string, CSVData>>(new Map());
  const [searchResults, setSearchResults] = useState<CSVSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  
  // ========== Functions ==========
  
  /**
   * Load available CSV files from the server
   */
  const loadAvailableFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get available CSV files directly
      const response = await fetch('/api/csv-files');
      if (response.ok) {
        const csvFiles = await response.json();
        setAvailableFiles(csvFiles);
      }
    } catch (err) {
      setError('Failed to load available CSV files');
      console.error('CSV consultation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Load a specific CSV file
   * @param fileName - Name of the CSV file to load
   * @returns Loaded CSV data or null if failed
   */
  const loadCSVFile = useCallback(async (fileName: string): Promise<CSVData | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check cache first
      if (loadedData.has(fileName)) {
        return loadedData.get(fileName)!;
      }
      
      const response = await fetch(`/api/csv-data?file=${encodeURIComponent(fileName)}`);
      if (response.ok) {
        const csvData: CSVData = await response.json();
        
        // Cache the data
        setLoadedData(prev => new Map(prev.set(fileName, csvData)));
        
        return csvData;
      } else {
        throw new Error(`Failed to load ${fileName}`);
      }
    } catch (err) {
      setError(`Failed to load CSV file: ${fileName}`);
      console.error('CSV load error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadedData]);
  
  /**
   * Search across multiple CSV files
   * @param files - Array of CSV file names to search
   * @param searchTerm - Text to search for
   * @param context - Optional context filter
   * @returns Search results from all files
   */
  const searchAcrossFiles = useCallback(async (
    files: string[], 
    searchTerm: string, 
    context?: string
  ): Promise<CSVSearchResult[]> => {
    try {
      setIsLoading(true);
      setError(null);
      setLastSearchTerm(searchTerm);
      
      const response = await fetch('/api/csv-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files,
          searchTerm,
          context,
          maxResults: 50
        })
      });
      
      if (response.ok) {
        const searchData = await response.json();
        setSearchResults(searchData.results);
        return searchData.results;
      } else {
        throw new Error('Search failed');
      }
    } catch (err) {
      setError('Failed to search CSV files');
      console.error('CSV search error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get quick suggestions based on current text
   * @param text - Current text to find suggestions for
   * @param maxResults - Maximum number of suggestions
   * @returns Array of relevant CSV entries
   */
  const getQuickSuggestions = useCallback((text: string, maxResults = 5): CSVEntry[] => {
    const suggestions: CSVEntry[] = [];
    const searchLower = text.toLowerCase();
    
    // Search through loaded data
    loadedData.forEach(csvData => {
      csvData.sheets.forEach(sheet => {
        sheet.entries.forEach(entry => {
          if (suggestions.length < maxResults) {
            // Check for matches in English text
            if (entry.english.toLowerCase().includes(searchLower)) {
              suggestions.push(entry);
            }
            // Check for character name matches
            else if (entry.utterer && entry.utterer.toLowerCase().includes(searchLower)) {
              suggestions.push(entry);
            }
          }
        });
      });
    });
    
    // Sort by relevance (exact matches first, then partial matches)
    return suggestions.sort((a, b) => {
      const aExact = a.english.toLowerCase() === searchLower ? 1 : 0;
      const bExact = b.english.toLowerCase() === searchLower ? 1 : 0;
      return bExact - aExact;
    });
  }, [loadedData]);
  
  /**
   * Consult CSV data for translation assistance
   * @param sourceText - Source text to find translations for
   * @returns Array of relevant translation entries
   */
  const consultForTranslation = useCallback(async (sourceText: string): Promise<CSVEntry[]> => {
    try {
      // First try quick suggestions from loaded data
      const quickResults = getQuickSuggestions(sourceText, 10);
      if (quickResults.length > 0) {
        return quickResults;
      }
      
      // If no quick results, search across available files
      const searchResults = await searchAcrossFiles(availableFiles, sourceText);
      
      // Flatten results
      const allMatches: CSVEntry[] = [];
      searchResults.forEach(result => {
        allMatches.push(...result.matches);
      });
      
      return allMatches;
    } catch (err) {
      console.error('Translation consultation error:', err);
      return [];
    }
  }, [availableFiles, getQuickSuggestions, searchAcrossFiles]);
  
  /**
   * Clear all cached data
   */
  const clearCache = useCallback(() => {
    setLoadedData(new Map());
    setSearchResults([]);
    setError(null);
    setLastSearchTerm('');
  }, []);
  
  // ========== Effects ==========
  
  /**
   * Load available files on mount
   */
  useEffect(() => {
    loadAvailableFiles();
  }, [loadAvailableFiles]);
  
  return {
    // Data state
    availableFiles,
    loadedData,
    searchResults,
    
    // UI state
    isLoading,
    error,
    lastSearchTerm,
    
    // Functions
    loadCSVFile,
    searchAcrossFiles,
    getQuickSuggestions,
    consultForTranslation,
    clearCache,
  };
};