import { useState, useCallback, useEffect } from 'react';

export interface XlsxEntry {
  row: number;
  utterer: string;
  context: string;
  sourceEnglish: string;
  translatedDutch: string;
  key?: string;
  sheetName?: string;
  fileName?: string;
}

export interface XlsxFileInfo {
  fileName: string;
  sheets: string[];
  fileSize?: number;
  lastModified?: string;
}

export interface XlsxModeState {
  // XLSX mode state
  xlsxMode: boolean;
  selectedXlsxFile: string;
  selectedXlsxSheet: string;
  xlsxSearchTerm: string;
  xlsxData: XlsxEntry[] | null;
  availableXlsxFiles: XlsxFileInfo[];
  globalSearch: boolean;
  isLoadingXlsx: boolean;
  
  // Setters
  setSelectedXlsxSheet: (sheet: string) => void;
  setXlsxSearchTerm: (term: string) => void;
  setGlobalSearch: (global: boolean) => void;
  
  // Functions
  loadXlsxData: (fileName: string) => Promise<void>;
  toggleXlsxMode: () => void;
  clearXlsxMode: () => void;
  getFilteredEntries: () => XlsxEntry[];
  getAvailableSheets: () => string[];
  findXlsxMatches: (text: string) => XlsxEntry[];
  searchXlsxFiles: (searchTerm?: string) => Promise<void>;
}

/**
 * XLSX Mode Hook
 * 
 * Manages XLSX file viewing and search functionality:
 * - XLSX file loading and management
 * - Sheet selection and browsing
 * - Search functionality across files
 * - Data filtering and display
 * - Integration with translation highlighting
 * 
 * @returns XLSX mode state and functions
 */
export const useXlsxMode = (): XlsxModeState => {
  // ========== XLSX Mode State ==========
  const [xlsxMode, setXlsxMode] = useState(false);
  const [selectedXlsxFile, setSelectedXlsxFile] = useState('');
  const [selectedXlsxSheet, setSelectedXlsxSheet] = useState('');
  const [xlsxSearchTerm, setXlsxSearchTerm] = useState('');
  const [xlsxData, setXlsxData] = useState<XlsxEntry[] | null>(null);
  const [availableXlsxFiles, setAvailableXlsxFiles] = useState<XlsxFileInfo[]>([]);
  const [globalSearch, setGlobalSearch] = useState(false);
  const [isLoadingXlsx, setIsLoadingXlsx] = useState(false);
  
  // ========== XLSX Mode Functions ==========
  
  /**
   * Load available XLSX files
   * 
   * Fetches the list of available XLSX files from the API.
   */
  const loadAvailableFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/xlsx-files');
      if (response.ok) {
        const data = await response.json();
        setAvailableXlsxFiles(data.files || []);
        console.log('🔧 XLSX Mode Debug: Available files loaded:', data.files?.length);
      } else {
        console.error('Failed to load XLSX files');
        setAvailableXlsxFiles([]);
      }
    } catch (error) {
      console.error('Error loading XLSX files:', error);
      setAvailableXlsxFiles([]);
    }
  }, []);
  
  /**
   * Load XLSX data from a specific file
   * 
   * Loads translation data from the specified XLSX file.
   * 
   * @param fileName - Name of the XLSX file to load
   */
  const loadXlsxData = useCallback(async (fileName: string) => {
    if (!fileName) return;
    
    setIsLoadingXlsx(true);
    setSelectedXlsxFile(fileName);
    
    try {
      console.log('🔧 XLSX Mode Debug: Loading file:', fileName);
      
      // Search the file to get all data
      const response = await fetch('/api/xlsx-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          searchTerm: '', // Empty search to get all data
          selectedSheet: selectedXlsxSheet || '',
          globalSearch: globalSearch
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔧 XLSX Mode Debug: File data loaded:', data);
        
        // Flatten results from all sheets into a single array
        const allEntries: XlsxEntry[] = [];
        data.results?.forEach((result: any) => {
          result.matches?.forEach((match: any) => {
            allEntries.push({
              ...match,
              sheetName: result.sheetName,
              fileName: result.fileName
            });
          });
        });
        
        setXlsxData(allEntries);
        console.log('🔧 XLSX Mode Debug: Total entries loaded:', allEntries.length);
        
        // If no sheet is selected and we have data, select the first sheet
        if (!selectedXlsxSheet && data.results && data.results.length > 0) {
          setSelectedXlsxSheet(data.results[0].sheetName);
        }
      } else {
        console.error('Failed to load XLSX data');
        setXlsxData(null);
      }
    } catch (error) {
      console.error('Error loading XLSX data:', error);
      setXlsxData(null);
    } finally {
      setIsLoadingXlsx(false);
    }
  }, [selectedXlsxSheet, globalSearch]);
  
  /**
   * Search XLSX files
   * 
   * Performs a search across XLSX files with the current search term.
   * 
   * @param searchTerm - Optional search term (uses current state if not provided)
   */
  const searchXlsxFiles = useCallback(async (searchTerm?: string) => {
    if (!selectedXlsxFile) return;
    
    const term = searchTerm !== undefined ? searchTerm : xlsxSearchTerm;
    setIsLoadingXlsx(true);
    
    try {
      console.log('🔧 XLSX Mode Debug: Searching with term:', term);
      
      const response = await fetch('/api/xlsx-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: selectedXlsxFile,
          searchTerm: term,
          selectedSheet: selectedXlsxSheet,
          globalSearch: globalSearch
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔧 XLSX Mode Debug: Search results:', data);
        
        // Flatten results from all sheets into a single array
        const allEntries: XlsxEntry[] = [];
        data.results?.forEach((result: any) => {
          result.matches?.forEach((match: any) => {
            allEntries.push({
              ...match,
              sheetName: result.sheetName,
              fileName: result.fileName
            });
          });
        });
        
        setXlsxData(allEntries);
        console.log('🔧 XLSX Mode Debug: Search entries found:', allEntries.length);
      } else {
        console.error('Failed to search XLSX data');
        setXlsxData([]);
      }
    } catch (error) {
      console.error('Error searching XLSX data:', error);
      setXlsxData([]);
    } finally {
      setIsLoadingXlsx(false);
    }
  }, [selectedXlsxFile, selectedXlsxSheet, xlsxSearchTerm, globalSearch]);
  
  /**
   * Toggle XLSX mode
   * 
   * Enables or disables the XLSX viewer mode.
   */
  const toggleXlsxMode = useCallback(() => {
    setXlsxMode(prev => {
      const newMode = !prev;
      console.log('🔧 XLSX Mode Debug: Toggling mode to:', newMode);
      
      if (newMode && availableXlsxFiles.length === 0) {
        // Load available files when entering XLSX mode
        loadAvailableFiles();
      }
      
      return newMode;
    });
  }, [availableXlsxFiles.length, loadAvailableFiles]);
  
  /**
   * Clear XLSX mode
   * 
   * Disables XLSX mode and clears all related state.
   */
  const clearXlsxMode = useCallback(() => {
    setXlsxMode(false);
    setSelectedXlsxFile('');
    setSelectedXlsxSheet('');
    setXlsxSearchTerm('');
    setXlsxData(null);
    setGlobalSearch(false);
  }, []);
  
  /**
   * Get filtered entries based on current search and selection
   * 
   * @returns Filtered array of XLSX entries
   */
  const getFilteredEntries = useCallback((): XlsxEntry[] => {
    if (!xlsxData) return [];
    
    let filtered = xlsxData;
    
    // Filter by sheet if not in global search mode
    if (!globalSearch && selectedXlsxSheet) {
      filtered = filtered.filter(entry => entry.sheetName === selectedXlsxSheet);
    }
    
    // Apply search term filter (client-side additional filtering)
    if (xlsxSearchTerm) {
      const searchLower = xlsxSearchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.sourceEnglish.toLowerCase().includes(searchLower) ||
        entry.translatedDutch.toLowerCase().includes(searchLower) ||
        entry.utterer.toLowerCase().includes(searchLower) ||
        entry.context.toLowerCase().includes(searchLower) ||
        entry.row.toString().includes(searchLower)
      );
    }
    
    return filtered;
  }, [xlsxData, selectedXlsxSheet, xlsxSearchTerm, globalSearch]);
  
  /**
   * Get available sheets from loaded data
   * 
   * @returns Array of available sheet names
   */
  const getAvailableSheets = useCallback((): string[] => {
    if (!xlsxData) return [];
    
    const sheets = new Set<string>();
    xlsxData.forEach(entry => {
      if (entry.sheetName) {
        sheets.add(entry.sheetName);
      }
    });
    
    return Array.from(sheets).sort();
  }, [xlsxData]);
  
  /**
   * Find XLSX matches for text highlighting
   * 
   * Searches through XLSX data to find entries that match the given text.
   * Used for highlighting translations and providing suggestions.
   * 
   * @param text - Text to search for matches
   * @returns Array of matching XLSX entries
   */
  const findXlsxMatches = useCallback((text: string): XlsxEntry[] => {
    if (!xlsxData || !text) return [];
    
    const matches: XlsxEntry[] = [];
    const searchText = text.toLowerCase();
    
    console.log('🔧 XLSX Mode Debug: Finding matches for:', searchText);
    
    xlsxData.forEach(entry => {
      // Check for exact or partial matches in various fields
      if (
        entry.sourceEnglish.toLowerCase().includes(searchText) ||
        entry.translatedDutch.toLowerCase().includes(searchText) ||
        searchText.includes(entry.sourceEnglish.toLowerCase()) ||
        searchText.includes(entry.translatedDutch.toLowerCase())
      ) {
        matches.push(entry);
      }
    });
    
    console.log('🔧 XLSX Mode Debug: Found matches:', matches.length);
    return matches;
  }, [xlsxData]);
  
  // ========== Effects ==========
  
  /**
   * Load available files when component mounts
   */
  useEffect(() => {
    loadAvailableFiles();
  }, [loadAvailableFiles]);
  
  /**
   * Trigger search when search term changes
   */
  useEffect(() => {
    if (selectedXlsxFile && xlsxMode) {
      const debounceTimer = setTimeout(() => {
        searchXlsxFiles();
      }, 300); // Debounce search
      
      return () => clearTimeout(debounceTimer);
    }
  }, [xlsxSearchTerm, selectedXlsxSheet, globalSearch, selectedXlsxFile, xlsxMode, searchXlsxFiles]);
  
  return {
    // State
    xlsxMode,
    selectedXlsxFile,
    selectedXlsxSheet,
    xlsxSearchTerm,
    xlsxData,
    availableXlsxFiles,
    globalSearch,
    isLoadingXlsx,
    
    // Setters
    setSelectedXlsxSheet,
    setXlsxSearchTerm,
    setGlobalSearch,
    
    // Functions
    loadXlsxData,
    toggleXlsxMode,
    clearXlsxMode,
    getFilteredEntries,
    getAvailableSheets,
    findXlsxMatches,
    searchXlsxFiles,
  };
};