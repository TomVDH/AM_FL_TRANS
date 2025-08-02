import { useState, useEffect } from 'react';

/**
 * JSON Mode Hook
 * 
 * Manages all JSON data viewing functionality:
 * - File selection and loading
 * - Sheet/tab filtering
 * - Text search across all fields
 * - Data display and filtering
 * 
 * @returns JSON mode state and functions
 */
export const useJsonMode = () => {
  // ========== JSON Mode State ==========
  const [jsonMode, setJsonMode] = useState(false);                     // JSON data viewing mode
  const [selectedJsonFile, setSelectedJsonFile] = useState('');        // Selected JSON file
  const [selectedJsonSheet, setSelectedJsonSheet] = useState('');      // Selected sheet in JSON
  const [jsonSearchTerm, setJsonSearchTerm] = useState('');            // Search term for JSON data
  const [jsonData, setJsonData] = useState<any>(null);                // Loaded JSON data
  const [availableJsonFiles, setAvailableJsonFiles] = useState<string[]>([]); // Available JSON files
  const [globalSearch, setGlobalSearch] = useState(false);             // Global search across all sheets

  /**
   * Load available JSON files on component mount
   */
  useEffect(() => {
    const loadAvailableJsonFiles = async () => {
      try {
        const response = await fetch('/api/json-files');
        if (response.ok) {
          const files = await response.json();
          setAvailableJsonFiles(files);
        }
      } catch (error) {
        // Silently handle JSON files loading errors
      }
    };

    loadAvailableJsonFiles();
  }, []);

  /**
   * Load JSON data when file is selected
   */
  const loadJsonData = async (fileName: string) => {
    try {
      const response = await fetch(`/api/json-data?file=${encodeURIComponent(fileName)}`);
      if (response.ok) {
        const data = await response.json();
        setJsonData(data);
        setSelectedJsonFile(fileName);
      } else {
        console.error('Error loading JSON data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading JSON data:', error);
    }
  };

  /**
   * Toggle JSON mode on/off
   */
  const toggleJsonMode = () => setJsonMode(prev => !prev);

  /**
   * Clear JSON mode state
   */
  const clearJsonMode = () => {
    setJsonMode(false);
    setSelectedJsonFile('');
    setSelectedJsonSheet('');
    setJsonSearchTerm('');
    setJsonData(null);
  };



  /**
   * Get filtered JSON entries based on search term
   */
  const getFilteredEntries = () => {
    if (!jsonData) return [];
    
    if (globalSearch) {
      // Search across all sheets
      const allEntries: any[] = [];
      jsonData.sheets.forEach((sheet: any) => {
        sheet.entries.forEach((entry: any) => {
          allEntries.push({
            ...entry,
            sheetName: sheet.sheetName
          });
        });
      });
      
      return allEntries.filter((entry: any) => 
        !jsonSearchTerm || 
        entry.rowNumber.toString().includes(jsonSearchTerm) ||
        (entry.utterer && entry.utterer.toLowerCase().includes(jsonSearchTerm.toLowerCase())) ||
        (entry.context && entry.context.toLowerCase().includes(jsonSearchTerm.toLowerCase())) ||
        (entry.sourceEnglish && entry.sourceEnglish.toLowerCase().includes(jsonSearchTerm.toLowerCase())) ||
        (entry.translatedDutch && entry.translatedDutch.toLowerCase().includes(jsonSearchTerm.toLowerCase()))
      );
    } else {
      // Search in selected sheet only
      if (!selectedJsonSheet) return [];
      
      const sheet = jsonData.sheets.find((sheet: any) => sheet.sheetName === selectedJsonSheet);
      if (!sheet) return [];
      
      return sheet.entries.filter((entry: any) => 
        !jsonSearchTerm || 
        entry.rowNumber.toString().includes(jsonSearchTerm) ||
        (entry.utterer && entry.utterer.toLowerCase().includes(jsonSearchTerm.toLowerCase())) ||
        (entry.context && entry.context.toLowerCase().includes(jsonSearchTerm.toLowerCase())) ||
        (entry.sourceEnglish && entry.sourceEnglish.toLowerCase().includes(jsonSearchTerm.toLowerCase())) ||
        (entry.translatedDutch && entry.translatedDutch.toLowerCase().includes(jsonSearchTerm.toLowerCase()))
      );
    }
  };

  /**
   * Get available sheets from loaded JSON data
   */
  const getAvailableSheets = () => {
    if (!jsonData) return [];
    return jsonData.sheets?.map((sheet: any) => sheet.sheetName).sort() || [];
  };

  return {
    // State
    jsonMode,
    selectedJsonFile,
    selectedJsonSheet,
    jsonSearchTerm,
    jsonData,
    availableJsonFiles,
    globalSearch,
    
    // Setters
    setJsonMode,
    setSelectedJsonFile,
    setSelectedJsonSheet,
    setJsonSearchTerm,
    setJsonData,
    setAvailableJsonFiles,
    setGlobalSearch,
    
    // Functions
    loadJsonData,
    toggleJsonMode,
    clearJsonMode,
    getFilteredEntries,
    getAvailableSheets,
  };
}; 