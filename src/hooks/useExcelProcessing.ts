import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

export interface ExcelProcessingState {
  // Excel processing state
  cellStart: string;
  excelSheets: string[];
  selectedSheet: string;
  workbookData: XLSX.WorkBook | null;
  isLoadingExcel: boolean;
  
  // Setters
  setCellStart: (cell: string) => void;
  setExcelSheets: (sheets: string[]) => void;
  setSelectedSheet: (sheet: string) => void;
  setWorkbookData: (workbook: XLSX.WorkBook | null) => void;
  
  // Functions
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSheetChange: (sheetName: string) => void;
  resetExcelData: () => void;
  getCellLocation: (index: number) => string;
}

/**
 * Excel Processing Hook
 * 
 * Manages Excel file processing functionality:
 * - Excel file upload and parsing
 * - Sheet management and selection
 * - Data extraction and processing
 * - Cell location calculation
 * 
 * @returns Excel processing state and functions
 */
export const useExcelProcessing = (): ExcelProcessingState => {
  // ========== Excel Processing State ==========
  const [cellStart, setCellStart] = useState('A1');
  const [excelSheets, setExcelSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [workbookData, setWorkbookData] = useState<XLSX.WorkBook | null>(null);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  
  // ========== Excel Processing Functions ==========
  
  /**
   * Handle Excel file upload
   * 
   * Processes uploaded Excel files and extracts sheet information.
   * 
   * @param e - File input change event
   */
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingExcel(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (!result) return;
        
        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        setWorkbookData(workbook);
        setExcelSheets(workbook.SheetNames);
        if (workbook.SheetNames.length > 0) {
          setSelectedSheet(workbook.SheetNames[0]);
        }
      } catch (error) {
        alert('Error reading Excel file. Please ensure it\'s a valid Excel file.');
      } finally {
        setIsLoadingExcel(false);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading Excel file. Please ensure it\'s a valid Excel file.');
      setIsLoadingExcel(false);
    };
    
    reader.readAsArrayBuffer(file);
  }, []);
  
  /**
   * Handle sheet change
   * 
   * Updates the selected sheet and processes the new sheet data.
   * 
   * @param sheetName - Name of the sheet to select
   */
  const handleSheetChange = useCallback((sheetName: string) => {
    setSelectedSheet(sheetName);
    // Additional sheet processing logic can be added here
  }, []);
  
  /**
   * Reset Excel data
   * 
   * Clears all Excel-related state and returns to initial state.
   */
  const resetExcelData = useCallback(() => {
    setExcelSheets([]);
    setSelectedSheet('');
    setWorkbookData(null);
    setIsLoadingExcel(false);
  }, []);
  
  /**
   * Get cell location for current index
   * 
   * Calculates the cell location based on the current index and Excel configuration.
   * 
   * @param index - Current item index
   * @returns Cell location string
   */
  const getCellLocation = useCallback((index: number): string => {
    if (excelSheets.length > 0) {
      // For Excel files, use row numbers
      return `Row ${index + 1}`;
    }
    // For manual input, use cell notation
    const match = cellStart.match(/([A-Z]+)(\d+)/);
    if (match) {
      const col = match[1];
      const row = parseInt(match[2]);
      return `${col}${row + index}`;
    }
    return cellStart;
  }, [excelSheets.length, cellStart]);
  
  return {
    // State
    cellStart,
    excelSheets,
    selectedSheet,
    workbookData,
    isLoadingExcel,
    
    // Setters
    setCellStart,
    setExcelSheets,
    setSelectedSheet,
    setWorkbookData,
    
    // Functions
    handleFileUpload,
    handleSheetChange,
    resetExcelData,
    getCellLocation,
  };
}; 