import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export interface ExcelProcessorState {
  // Excel file state
  excelSheets: string[];
  selectedSheet: string;
  workbookData: XLSX.WorkBook | null;
  isLoadingExcel: boolean;
  
  // Column configuration
  sourceColumn: string;
  uttererColumn: string;
  startRow: number;
  cellStart: string;
  
  // Setters
  setExcelSheets: (sheets: string[]) => void;
  setSelectedSheet: (sheet: string) => void;
  setWorkbookData: (workbook: XLSX.WorkBook | null) => void;
  setSourceColumn: (column: string) => void;
  setUttererColumn: (column: string) => void;
  setStartRow: (row: number) => void;
  setCellStart: (cell: string) => void;
  
  // Functions
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  resetExcelData: () => void;
  getCellLocation: (index: number) => string;
}

export const useExcelProcessor = (
  onDataProcessed: (sourceTexts: string[], utterers: string[], references: string[]) => void,
  processReferenceData: (dataRow: any, referenceColIndex: number) => string,
  initializeTranslationsWithReference: (references: string[], length: number) => string[]
): ExcelProcessorState => {
  // ========== Excel File State ==========
  const [excelSheets, setExcelSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [workbookData, setWorkbookData] = useState<XLSX.WorkBook | null>(null);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  
  // ========== Column Configuration State ==========
  const [sourceColumn, setSourceColumn] = useState('C');
  const [uttererColumn, setUttererColumn] = useState('A');
  const [startRow, setStartRow] = useState(3);
  const [cellStart, setCellStart] = useState('A1');
  
  // ========== Excel File Upload Handler ==========
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };
  
  // ========== Excel Data Processing Effect ==========
  useEffect(() => {
    if (workbookData && selectedSheet) {
      const worksheet = workbookData.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      // Extract column indices
      const sourceColIndex = sourceColumn.charCodeAt(0) - 65;
      const uttererColIndex = uttererColumn.charCodeAt(0) - 65;
      const referenceColIndex = sourceColumn.charCodeAt(0) - 65; // Default to source column for reference
      
      const extractedTexts: string[] = [];
      const extractedUtterers: string[] = [];
      const extractedReferences: string[] = [];
      
      let consecutiveEmptyRows = 0;
      const maxConsecutiveEmptyRows = 10; // Stop after 10 consecutive empty rows
      
      for (let i = startRow - 1; i < jsonData.length; i++) {
        const dataRow = jsonData[i];
        if (dataRow) {
          const sourceText = dataRow[sourceColIndex];
          const isSourceEmpty = !sourceText || !sourceText.toString().trim();
          
          // Check if the entire row is empty (no data in any column)
          const isRowCompletelyEmpty = !dataRow.some(cell => cell && cell.toString().trim());
          
          if (isRowCompletelyEmpty) {
            consecutiveEmptyRows++;
            // Stop processing if we've hit too many consecutive empty rows
            if (consecutiveEmptyRows >= maxConsecutiveEmptyRows) {
              break;
            }
            continue; // Skip completely empty rows
          } else {
            consecutiveEmptyRows = 0; // Reset counter for non-empty rows
          }
          
          // Include all rows, even empty ones
          extractedTexts.push(isSourceEmpty ? '((blank))' : sourceText.toString().trim());
          
          // Get utterer from specified column, or empty string if not found
          const utterer = dataRow[uttererColIndex] ? dataRow[uttererColIndex].toString().trim() : '';
          extractedUtterers.push(utterer);
          
          // Get reference translation if using reference column
          const reference = processReferenceData(dataRow, referenceColIndex);
          extractedReferences.push(reference);
        }
      }
      
      // Call the callback with processed data
      onDataProcessed(extractedTexts, extractedUtterers, extractedReferences);
    }
  }, [workbookData, selectedSheet, sourceColumn, uttererColumn, startRow, onDataProcessed, processReferenceData]);
  
  // ========== Reset Excel Data ==========
  const resetExcelData = () => {
    setWorkbookData(null);
    setExcelSheets([]);
    setSelectedSheet('');
  };
  
  // ========== Cell Location Helper ==========
  const getCellLocation = (index: number): string => {
    if (excelSheets.length > 0) {
      return `Row ${startRow + index}`;
    }
    return `Item ${index + 1}`;
  };
  
  return {
    // State
    excelSheets,
    selectedSheet,
    workbookData,
    isLoadingExcel,
    sourceColumn,
    uttererColumn,
    startRow,
    cellStart,
    
    // Setters
    setExcelSheets,
    setSelectedSheet,
    setWorkbookData,
    setSourceColumn,
    setUttererColumn,
    setStartRow,
    setCellStart,
    
    // Functions
    handleFileUpload,
    resetExcelData,
    getCellLocation,
  };
}; 