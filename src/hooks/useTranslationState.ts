import { useState, useCallback, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';

export interface TranslationState {
  // Core translation state
  sourceTexts: string[];
  utterers: string[];
  translations: string[];
  currentIndex: number;
  currentTranslation: string;
  isStarted: boolean;
  
  // Excel processing state
  cellStart: string;
  excelSheets: string[];
  selectedSheet: string;
  workbookData: XLSX.WorkBook | null;
  isLoadingExcel: boolean;
  
  // UI state
  isAnimating: boolean;
  showCopied: boolean;
  gradientColors: string[];
  showVersionHash: boolean;
  inputMode: 'excel' | 'embedded-json' | 'manual';
  
  // Setup state
  sourceColumn: string;
  uttererColumn: string;
  startRow: number;
  
  // Refs
  fileInputRef: React.RefObject<HTMLInputElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  
  // Setters
  setSourceTexts: (texts: string[]) => void;
  setUtterers: (utterers: string[]) => void;
  setTranslations: (translations: string[]) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentTranslation: (translation: string | ((prev: string) => string)) => void;
  setIsStarted: (started: boolean) => void;
  setCellStart: (cell: string) => void;
  setExcelSheets: (sheets: string[]) => void;
  setSelectedSheet: (sheet: string) => void;
  setWorkbookData: (workbook: XLSX.WorkBook | null) => void;
  setIsAnimating: (animating: boolean) => void;
  setShowCopied: (show: boolean) => void;
  setGradientColors: (colors: string[]) => void;
  setShowVersionHash: (show: boolean) => void;
  setInputMode: (mode: 'excel' | 'embedded-json' | 'manual') => void;
  setSourceColumn: (column: string) => void;
  setUttererColumn: (column: string) => void;
  setStartRow: (row: number) => void;
  
  // Functions
  handleStart: () => void;
  handleBackToSetup: () => void;
  handleSubmit: () => void;
  handlePrevious: () => void;
  handleSourceInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSheetChange: (sheetName: string) => void;
  insertTranslatedSuggestion: (translatedText: string) => void;
  insertPlaceholder: (originalSource: string) => void;
  copySourceText: () => void;
  copySourceToJsonSearch: () => void;
  persistTranslation: (rowNumber: number, newTranslation: string) => Promise<void>;
  getCellLocation: (index: number) => string;
  generateGradientColors: () => string[];
  extractSpeakerName: (utterer: string) => string;
  categoryHasMatches: (category: string) => boolean;
  processExcelData: () => void;
  trimCurrentTranslation: () => void;
  exportTranslations: () => void;
  jumpToRow: (rowNumber: number) => void;
  resetOutputDisplay: () => void;
  outputKey: number;
}

/**
 * Translation State Hook
 * 
 * Manages all translation-related state and functionality:
 * - Core translation state management
 * - Excel processing and file upload
 * - UI state and animations
 * - Setup and configuration
 * - Text input handling
 * - Copy operations
 * - Translation persistence
 * 
 * @returns Complete translation state and functions
 */
export const useTranslationState = (): TranslationState => {
  // ========== Core Translation State ==========
  const [sourceTexts, setSourceTexts] = useState<string[]>([]);
  const [utterers, setUtterers] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState('');
  
  // ========== Output Display State ==========
  const [outputKey, setOutputKey] = useState(0); // Key to force re-render of output
  const [isStarted, setIsStarted] = useState(false);
  
  // ========== Excel Processing State ==========
  const [cellStart, setCellStart] = useState('A1');
  const [excelSheets, setExcelSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [workbookData, setWorkbookData] = useState<XLSX.WorkBook | null>(null);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  
  // ========== UI State ==========
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [showVersionHash, setShowVersionHash] = useState(false);
  const [inputMode, setInputMode] = useState<'excel' | 'embedded-json' | 'manual'>('excel');
  
  // ========== Setup State ==========
  const [sourceColumn, setSourceColumn] = useState('C');
  const [uttererColumn, setUttererColumn] = useState('A');
  const [startRow, setStartRow] = useState(3);
  
  // ========== Component References ==========
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // ========== Translation Functions ==========
  
  /**
   * Handle start button click
   */
  const handleStart = useCallback(() => {
    setIsStarted(true);
  }, []);
  
  /**
   * Handle back to setup button click
   */
  const handleBackToSetup = useCallback(() => {
    setIsStarted(false);
  }, []);
  
  /**
   * Handle submit button click
   */
  const handleSubmit = useCallback(() => {
    // Always save the current translation
    const newTranslations = [...translations];
    newTranslations[currentIndex] = currentTranslation.trim() === '' ? '[BLANK, REMOVE LATER]' : currentTranslation;
    setTranslations(newTranslations);
    
    // Only move to next if not on last row
    if (currentIndex < sourceTexts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentTranslation(newTranslations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : newTranslations[currentIndex + 1] || '');
    }
  }, [currentIndex, currentTranslation, sourceTexts.length, translations]);
  
  /**
   * Handle previous button click
   */
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newTranslations = [...translations];
      newTranslations[currentIndex] = currentTranslation.trim() === '' ? '[BLANK, REMOVE LATER]' : currentTranslation;
      setTranslations(newTranslations);
      setCurrentIndex(currentIndex - 1);
      setCurrentTranslation(translations[currentIndex - 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex - 1] || '');
    }
  }, [currentIndex, currentTranslation, translations]);
  
  /**
   * Handle source text input
   */
  const handleSourceInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const lines = text.split('\n').filter(line => line.trim());
    setSourceTexts(lines);
    setUtterers(new Array(lines.length).fill(''));
    setTranslations(new Array(lines.length).fill('[BLANK, REMOVE LATER]'));
    setCurrentIndex(0);
    setCurrentTranslation('');
  }, []);
  
  /**
   * Handle Excel file upload
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
   * Process Excel data and extract source texts and utterers
   */
  const processExcelData = useCallback(() => {
    if (!workbookData || !selectedSheet) return;
    
    try {
      const worksheet = workbookData.Sheets[selectedSheet];
      if (!worksheet) return;
      
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      const sourceTexts: string[] = [];
      const utterers: string[] = [];
      
      for (let row = startRow - 1; row <= range.e.r; row++) {
        const sourceCell = XLSX.utils.encode_cell({ r: row, c: sourceColumn.charCodeAt(0) - 65 });
        const uttererCell = XLSX.utils.encode_cell({ r: row, c: uttererColumn.charCodeAt(0) - 65 });
        
        const sourceValue = worksheet[sourceCell]?.v;
        const uttererValue = worksheet[uttererCell]?.v;
        
        if (sourceValue && sourceValue.toString().trim()) {
          sourceTexts.push(sourceValue.toString().trim());
          utterers.push(uttererValue ? uttererValue.toString().trim() : '');
        }
      }
      
      setSourceTexts(sourceTexts);
      setUtterers(utterers);
      setTranslations(new Array(sourceTexts.length).fill('[BLANK, REMOVE LATER]'));
      setCurrentIndex(0);
      setCurrentTranslation('');
    } catch (error) {
      console.error('Error processing Excel data:', error);
    }
  }, [workbookData, selectedSheet, sourceColumn, uttererColumn, startRow, setSourceTexts, setUtterers, setTranslations, setCurrentIndex, setCurrentTranslation]);

  /**
   * Handle sheet change
   */
  const handleSheetChange = useCallback((sheetName: string) => {
    setSelectedSheet(sheetName);
  }, []);
  
  /**
   * Insert translated suggestion into textarea
   */
  const insertTranslatedSuggestion = useCallback((translatedText: string) => {
    const textarea = textareaRef.current;
    
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const before = currentTranslation.slice(0, cursorPos);
      const after = currentTranslation.slice(cursorPos);
      const newText = before + translatedText + after;
      
      setCurrentTranslation(newText);
      
      setTimeout(() => {
        if (textarea) {
          const newCursorPos = cursorPos + translatedText.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    } else {
      setCurrentTranslation(prev => prev + translatedText);
    }
  }, [currentTranslation]);
  
  /**
   * Insert placeholder with original source
   */
  const insertPlaceholder = useCallback((originalSource: string) => {
    const placeholderText = `(${originalSource})`;
    const textarea = textareaRef.current;
    
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const before = currentTranslation.slice(0, cursorPos);
      const after = currentTranslation.slice(cursorPos);
      const newText = before + placeholderText + after;
      
      setCurrentTranslation(newText);
      
      setTimeout(() => {
        if (textarea) {
          const newCursorPos = cursorPos + placeholderText.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    } else {
      setCurrentTranslation(prev => prev + placeholderText);
    }
  }, [currentTranslation]);
  
  /**
   * Copy source text to clipboard
   */
  const copySourceText = useCallback(() => {
    const sourceText = sourceTexts[currentIndex];
    if (sourceText) {
      // Remove whitespace and clean the text before copying
      const cleanText = sourceText.trim().replace(/\s+/g, ' ');
      navigator.clipboard.writeText(cleanText);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  }, [currentIndex, sourceTexts, setShowCopied]);
  
  /**
   * Copy source text to JSON search
   */
  const copySourceToJsonSearch = useCallback(() => {
    const sourceText = sourceTexts[currentIndex];
    if (sourceText) {
      console.log('Copying source text to JSON search:', sourceText);
      // Note: This function is called from the UI buttons
      // The actual setJsonSearchTerm will be handled by the component that uses this hook
    }
  }, [currentIndex, sourceTexts]);
  
  /**
   * Persist translation to backend
   */
  const persistTranslation = useCallback(async (rowNumber: number, newTranslation: string) => {
    try {
      const response = await fetch('/api/persist-translation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: 'READ_ME_LocalizationManual',
          rowNumber: rowNumber,
          newTranslation: newTranslation
        }),
      });

      if (response.ok) {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } else {
        console.error('Failed to persist translation');
      }
    } catch (error) {
      console.error('Error persisting translation:', error);
    }
  }, []);
  
  /**
   * Get cell location for current index
   */
  const getCellLocation = useCallback((index: number): string => {
    if (excelSheets.length > 0) {
      return `Row ${startRow + index}`;
    }
    const match = cellStart.match(/([A-Z]+)(\d+)/);
    if (match) {
      const col = match[1];
      const row = parseInt(match[2]);
      return `${col}${row + index}`;
    }
    return cellStart;
  }, [excelSheets.length, startRow, cellStart]);
  
  /**
   * Generate gradient colors for visual effects
   */
  const generateGradientColors = useCallback((): string[] => {
    const colors = [
      '#8B5CF6', // purple-400
      '#EC4899', // pink-400
      '#3B82F6', // blue-400
      '#10B981', // green-400
      '#F59E0B', // yellow-400
      '#F97316', // orange-400
      '#EF4444', // red-400
      '#6366F1', // indigo-400
      '#14B8A6', // teal-400
      '#8B5CF6', // purple-400
    ];
    
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);
  
  /**
   * Extract clean speaker name from utterer string
   */
  const extractSpeakerName = useCallback((utterer: string): string => {
    if (!utterer) return 'Speaker';
    
    const parts = utterer.split('.');
    if (parts.length >= 4) {
      return parts[3];
    }
    
    const cleanName = utterer.replace(/^SAY\./, '').replace(/\.\d+$/, '');
    if (cleanName && cleanName !== utterer) {
      return cleanName.replace(/_/g, ' ');
    }
    
    return 'Speaker';
  }, []);
  
  /**
   * Check if a category has matching entries
   */
  const categoryHasMatches = useCallback((category: string): boolean => {
    return false;
  }, []);

  /**
   * Trim current translation
   */
  const trimCurrentTranslation = useCallback(() => {
    setCurrentTranslation(prev => prev.trim());
  }, []);

  /**
   * Export translations to CSV file
   */
  const exportTranslations = useCallback(() => {
    // CSV header with sheet and tab info
    const csvHeader = 'Key,Original,Translated\n';
    
    // Add sheet name and tab name as first two rows
    const sheetInfo = `Sheet Name,${selectedSheet || 'Unknown'},`;
    const tabInfo = `Tab Name,${selectedSheet || 'Unknown'},`;
    
    // CSV rows
    const csvRows = translations.map((trans, idx) => {
      if (!trans) return '';
      
      const key = getCellLocation(idx);
      const original = sourceTexts[idx] || '';
      const translated = trans;
      
      // Escape CSV values (handle commas and quotes)
      const escapeCsv = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };
      
      return `${escapeCsv(key)},${escapeCsv(original)},${escapeCsv(translated)}`;
    }).filter(Boolean);
    
    const csvData = sheetInfo + '\n' + tabInfo + '\n' + csvHeader + csvRows.join('\n');

    if (csvRows.length > 0) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translations.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [translations, sourceTexts, getCellLocation, selectedSheet]);

  /**
   * Jump to specific row
   */
  const jumpToRow = useCallback((rowNumber: number) => {
    const index = rowNumber - startRow;
    if (index >= 0 && index < sourceTexts.length) {
      setCurrentIndex(index);
      setCurrentTranslation(translations[index] === '[BLANK, REMOVE LATER]' ? '' : translations[index] || '');
    }
  }, [startRow, sourceTexts.length, translations]);

  /**
   * Reset output display only - clears translations and re-initializes the output component
   */
  const resetOutputDisplay = useCallback(() => {
    // Clear all translations and reset to blank placeholders
    setTranslations(new Array(sourceTexts.length).fill('[BLANK, REMOVE LATER]'));
    setCurrentTranslation('');
    // Force a complete re-render of the output component
    setOutputKey(prev => prev + 1);
  }, [sourceTexts.length]);
  
  // Process Excel data when sheet, columns, or start row changes
  useEffect(() => {
    if (workbookData && selectedSheet) {
      processExcelData();
    }
  }, [workbookData, selectedSheet, sourceColumn, uttererColumn, startRow, processExcelData]);

  // Initialize gradient colors on mount
  useEffect(() => {
    setGradientColors(generateGradientColors());
  }, [generateGradientColors]);
  
  return {
    // State
    sourceTexts,
    utterers,
    translations,
    currentIndex,
    currentTranslation,
    isStarted,
    cellStart,
    excelSheets,
    selectedSheet,
    workbookData,
    isLoadingExcel,
    isAnimating,
    showCopied,
    gradientColors,
    showVersionHash,
    inputMode,
    sourceColumn,
    uttererColumn,
    startRow,
    
    // Refs
    fileInputRef,
    textareaRef,
    
    // Setters
    setSourceTexts,
    setUtterers,
    setTranslations,
    setCurrentIndex,
    setCurrentTranslation,
    setIsStarted,
    setCellStart,
    setExcelSheets,
    setSelectedSheet,
    setWorkbookData,
    setIsAnimating,
    setShowCopied,
    setGradientColors,
    setShowVersionHash,
    setInputMode,
    setSourceColumn,
    setUttererColumn,
    setStartRow,
    
    // Functions
    handleStart,
    handleBackToSetup,
    handleSubmit,
    handlePrevious,
    handleSourceInput,
    handleFileUpload,
    handleSheetChange,
    insertTranslatedSuggestion,
    insertPlaceholder,
    copySourceText,
    copySourceToJsonSearch,
    persistTranslation,
    getCellLocation,
    generateGradientColors,
    extractSpeakerName,
    categoryHasMatches,
    processExcelData,
    trimCurrentTranslation,
    exportTranslations,
    jumpToRow,
    resetOutputDisplay,
    outputKey,
  };
}; 