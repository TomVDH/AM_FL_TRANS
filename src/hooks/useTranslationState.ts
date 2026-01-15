import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

// Filter options for entry navigation
export type FilterStatus = 'all' | 'completed' | 'blank' | 'modified';

export interface FilterOptions {
  status: FilterStatus;
  speaker?: string;
  searchTerm?: string;
}

export interface TranslationState {
  // Core translation state
  sourceTexts: string[];
  utterers: string[];
  translations: string[];
  currentIndex: number;
  currentTranslation: string;
  isStarted: boolean;

  // Filtering state
  filterOptions: FilterOptions;
  filteredIndices: number[];
  filterStats: { all: number; completed: number; blank: number; modified: number };
  
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

  // Data source tracking
  loadedFileName: string;
  loadedFileType: 'excel' | 'json' | 'csv' | 'manual' | '';
  originalTranslations: string[];

  // Change detection
  hasCurrentEntryChanged: () => boolean;
  getCurrentOriginalValue: () => string;

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
  setLoadedFileName: (fileName: string) => void;
  setLoadedFileType: (fileType: 'excel' | 'json' | 'csv' | 'manual' | '') => void;
  setOriginalTranslations: (translations: string[]) => void;

  // Functions
  handleStart: () => void;
  handleBackToSetup: () => void;
  handleSubmit: () => void;
  handlePrevious: () => void;
  handleSourceInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleExistingFileLoad: (fileName: string) => Promise<void>;
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
  resetFromFile: () => Promise<void>;
  outputKey: number;

  // Filtering functions
  setFilterOptions: (options: FilterOptions) => void;
  setFilterStatus: (status: FilterStatus) => void;
  navigateToNextFiltered: () => void;
  navigateToPrevFiltered: () => void;

  // LIVE EDIT mode
  liveEditMode: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncTime: Date | null;
  setLiveEditMode: (mode: boolean) => void;
  toggleLiveEditMode: () => void;
  syncCurrentTranslation: () => Promise<void>;
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

  // ========== Data Source Tracking ==========
  const [loadedFileName, setLoadedFileName] = useState<string>('');
  const [loadedFileType, setLoadedFileType] = useState<'excel' | 'json' | 'csv' | 'manual' | ''>('');
  const [originalTranslations, setOriginalTranslations] = useState<string[]>([]); // Track original values for persistence logic

  // ========== Filtering State ==========
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ status: 'all' });

  // ========== LIVE EDIT State ==========
  const [liveEditMode, setLiveEditMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // ========== Change Detection ==========
  // Compute whether the current entry has been modified from its original value
  const getCurrentOriginalValue = useCallback(() => {
    const original = originalTranslations[currentIndex] || '[BLANK, REMOVE LATER]';
    return original === '[BLANK, REMOVE LATER]' ? '' : original;
  }, [originalTranslations, currentIndex]);

  // Check if current translation differs from the original
  const hasCurrentEntryChanged = useCallback(() => {
    const originalValue = getCurrentOriginalValue();
    const currentValue = currentTranslation.trim();
    // If both are effectively empty, no change
    if (originalValue === '' && currentValue === '') return false;
    // Compare the actual values
    return currentValue !== originalValue;
  }, [getCurrentOriginalValue, currentTranslation]);

  // ========== Filtering Logic ==========
  // Compute filter stats for the UI badges
  const filterStats = useMemo(() => {
    const all = translations.length;
    const blank = translations.filter(t => t === '' || t === '[BLANK, REMOVE LATER]').length;
    const completed = all - blank;
    const modified = translations.filter((t, idx) => {
      const original = originalTranslations[idx] || '[BLANK, REMOVE LATER]';
      const isBlank = t === '' || t === '[BLANK, REMOVE LATER]';
      const wasBlank = original === '' || original === '[BLANK, REMOVE LATER]';
      if (isBlank && wasBlank) return false;
      return t !== original;
    }).length;
    return { all, completed, blank, modified };
  }, [translations, originalTranslations]);

  // Compute filtered indices based on filter options
  const filteredIndices = useMemo(() => {
    if (filterOptions.status === 'all' && !filterOptions.speaker && !filterOptions.searchTerm) {
      return sourceTexts.map((_, i) => i);
    }

    return sourceTexts.map((source, idx) => {
      const translation = translations[idx];
      const original = originalTranslations[idx] || '[BLANK, REMOVE LATER]';
      const utterer = utterers[idx] || '';

      // Status filter
      if (filterOptions.status !== 'all') {
        const isBlank = translation === '' || translation === '[BLANK, REMOVE LATER]';
        const wasBlank = original === '' || original === '[BLANK, REMOVE LATER]';
        const isModified = translation !== original && !(isBlank && wasBlank);

        if (filterOptions.status === 'blank' && !isBlank) return -1;
        if (filterOptions.status === 'completed' && isBlank) return -1;
        if (filterOptions.status === 'modified' && !isModified) return -1;
      }

      // Speaker filter
      if (filterOptions.speaker && !utterer.toLowerCase().includes(filterOptions.speaker.toLowerCase())) {
        return -1;
      }

      // Search term filter (searches source text and translation)
      if (filterOptions.searchTerm) {
        const searchLower = filterOptions.searchTerm.toLowerCase();
        const matchesSource = source.toLowerCase().includes(searchLower);
        const matchesTranslation = translation.toLowerCase().includes(searchLower);
        if (!matchesSource && !matchesTranslation) return -1;
      }

      return idx;
    }).filter(idx => idx !== -1);
  }, [sourceTexts, translations, originalTranslations, utterers, filterOptions]);

  // Set filter status shorthand
  const setFilterStatus = useCallback((status: FilterStatus) => {
    setFilterOptions(prev => ({ ...prev, status }));
  }, []);

  // Navigate to next filtered entry
  const navigateToNextFiltered = useCallback(() => {
    if (filteredIndices.length === 0) return;

    // Find the next filtered index after currentIndex
    const currentPosInFiltered = filteredIndices.indexOf(currentIndex);
    if (currentPosInFiltered === -1) {
      // Current index not in filtered list, jump to first filtered entry
      const nextIdx = filteredIndices[0];
      setCurrentIndex(nextIdx);
      setCurrentTranslation(translations[nextIdx] === '[BLANK, REMOVE LATER]' ? '' : translations[nextIdx] || '');
    } else if (currentPosInFiltered < filteredIndices.length - 1) {
      // Move to next filtered entry
      const nextIdx = filteredIndices[currentPosInFiltered + 1];
      setCurrentIndex(nextIdx);
      setCurrentTranslation(translations[nextIdx] === '[BLANK, REMOVE LATER]' ? '' : translations[nextIdx] || '');
    }
    // If at last filtered entry, do nothing
  }, [filteredIndices, currentIndex, translations]);

  // Navigate to previous filtered entry
  const navigateToPrevFiltered = useCallback(() => {
    if (filteredIndices.length === 0) return;

    // Find the previous filtered index before currentIndex
    const currentPosInFiltered = filteredIndices.indexOf(currentIndex);
    if (currentPosInFiltered === -1) {
      // Current index not in filtered list, jump to last filtered entry
      const prevIdx = filteredIndices[filteredIndices.length - 1];
      setCurrentIndex(prevIdx);
      setCurrentTranslation(translations[prevIdx] === '[BLANK, REMOVE LATER]' ? '' : translations[prevIdx] || '');
    } else if (currentPosInFiltered > 0) {
      // Move to previous filtered entry
      const prevIdx = filteredIndices[currentPosInFiltered - 1];
      setCurrentIndex(prevIdx);
      setCurrentTranslation(translations[prevIdx] === '[BLANK, REMOVE LATER]' ? '' : translations[prevIdx] || '');
    }
    // If at first filtered entry, do nothing
  }, [filteredIndices, currentIndex, translations]);

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
   * Only persists to translation array if the value has changed from original
   */
  const handleSubmit = useCallback(() => {
    const newTranslations = [...translations];
    const hasChanged = hasCurrentEntryChanged();

    // Only update the translations array if the entry has actually changed
    if (hasChanged) {
      newTranslations[currentIndex] = currentTranslation.trim() === '' ? '[BLANK, REMOVE LATER]' : currentTranslation;
      setTranslations(newTranslations);

      // Show success feedback
      if (currentTranslation.trim() !== '') {
        toast.success('Translation saved', {
          duration: 1500,
        });
      }
    }

    // Only move to next if not on last row
    if (currentIndex < sourceTexts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextTranslation = hasChanged ? newTranslations[currentIndex + 1] : translations[currentIndex + 1];
      setCurrentTranslation(nextTranslation === '[BLANK, REMOVE LATER]' ? '' : nextTranslation || '');
    }
  }, [currentIndex, currentTranslation, sourceTexts.length, translations, hasCurrentEntryChanged]);
  
  /**
   * Handle previous button click
   * Only persists to translation array if the value has changed from original
   */
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newTranslations = [...translations];
      const hasChanged = hasCurrentEntryChanged();

      // Only update the translations array if the entry has actually changed
      if (hasChanged) {
        newTranslations[currentIndex] = currentTranslation.trim() === '' ? '[BLANK, REMOVE LATER]' : currentTranslation;
        setTranslations(newTranslations);
      }

      setCurrentIndex(currentIndex - 1);
      const prevTranslation = hasChanged ? newTranslations[currentIndex - 1] : translations[currentIndex - 1];
      setCurrentTranslation(prevTranslation === '[BLANK, REMOVE LATER]' ? '' : prevTranslation || '');
    }
  }, [currentIndex, currentTranslation, translations, hasCurrentEntryChanged]);
  
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

    // Validate file type
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        file.type !== 'application/vnd.ms-excel' &&
        !file.name.endsWith('.xlsx') &&
        !file.name.endsWith('.xls')) {
      toast.error('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum file size is 50MB');
      return;
    }

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
        toast.error('Error reading Excel file. Please ensure it\'s a valid Excel file.');
        console.error('Excel file read error:', error);
      } finally {
        setIsLoadingExcel(false);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading Excel file. Please try again.');
      setIsLoadingExcel(false);
    };
    
    reader.readAsArrayBuffer(file);
  }, []);

  /**
   * Handle loading an existing Excel file from the server
   */
  const handleExistingFileLoad = useCallback(async (fileName: string) => {
    setIsLoadingExcel(true);
    try {
      const response = await fetch(`/api/xlsx-files/load?fileName=${encodeURIComponent(fileName)}`);
      if (!response.ok) {
        throw new Error('Failed to load Excel file');
      }

      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      setWorkbookData(workbook);
      setExcelSheets(workbook.SheetNames);
      setLoadedFileName(fileName);
      setLoadedFileType('excel');
      if (workbook.SheetNames.length > 0) {
        setSelectedSheet(workbook.SheetNames[0]);
      }
      toast.success(`Loaded ${fileName}`);
    } catch (error) {
      console.error('Error loading Excel file:', error);
      toast.error('Failed to load Excel file. Please try again.');
    } finally {
      setIsLoadingExcel(false);
    }
  }, []);

  /**
   * Reset translations from the current Excel file
   * Reloads the file from disk and reprocesses all data
   */
  const resetFromFile = useCallback(async () => {
    if (!loadedFileName || loadedFileType !== 'excel') {
      toast.error('No Excel file loaded');
      return;
    }

    const modifiedCount = translations.filter((trans, idx) => {
      const original = originalTranslations[idx] || '[BLANK, REMOVE LATER]';
      return trans !== original;
    }).length;

    if (modifiedCount > 0) {
      const confirmed = window.confirm(
        `You have ${modifiedCount} unsaved translation${modifiedCount > 1 ? 's' : ''}. Reset from file will discard all changes and reload from the Excel file. Continue?`
      );
      if (!confirmed) return;
    }

    // Reload the file
    await handleExistingFileLoad(loadedFileName);
    toast.success('Translations reset from file');
  }, [loadedFileName, loadedFileType, translations, originalTranslations, handleExistingFileLoad]);

  /**
   * Process Excel data and extract source texts, utterers, and existing Dutch translations
   * Dutch translations are hardcoded to column J (index 9) for this project
   */
  const processExcelData = useCallback(() => {
    if (!workbookData || !selectedSheet) return;

    try {
      const worksheet = workbookData.Sheets[selectedSheet];
      if (!worksheet) return;

      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      const sourceTexts: string[] = [];
      const utterers: string[] = [];
      const existingTranslations: string[] = [];

      // Dutch translations column is hardcoded to J (index 9)
      const dutchColumnIndex = 9; // Column J = index 9

      for (let row = startRow - 1; row <= range.e.r; row++) {
        const sourceCell = XLSX.utils.encode_cell({ r: row, c: sourceColumn.charCodeAt(0) - 65 });
        const uttererCell = XLSX.utils.encode_cell({ r: row, c: uttererColumn.charCodeAt(0) - 65 });
        const dutchCell = XLSX.utils.encode_cell({ r: row, c: dutchColumnIndex });

        const sourceValue = worksheet[sourceCell]?.v;
        const uttererValue = worksheet[uttererCell]?.v;
        const dutchValue = worksheet[dutchCell]?.v;

        if (sourceValue && sourceValue.toString().trim()) {
          sourceTexts.push(sourceValue.toString().trim());
          utterers.push(uttererValue ? uttererValue.toString().trim() : '');
          // Load existing Dutch translation or mark as blank
          const dutchTranslation = dutchValue ? dutchValue.toString().trim() : '';
          existingTranslations.push(dutchTranslation || '[BLANK, REMOVE LATER]');
        }
      }

      setSourceTexts(sourceTexts);
      setUtterers(utterers);
      setTranslations(existingTranslations);
      setOriginalTranslations(existingTranslations); // Track originals for change detection
      setCurrentIndex(0);
      // Set current translation to the first entry's existing translation
      const firstTranslation = existingTranslations[0];
      setCurrentTranslation(firstTranslation === '[BLANK, REMOVE LATER]' ? '' : firstTranslation || '');

      const existingCount = existingTranslations.filter(t => t !== '[BLANK, REMOVE LATER]').length;
      toast.success(`Loaded ${sourceTexts.length} entries from ${selectedSheet} (${existingCount} with existing translations)`);
    } catch (error) {
      console.error('Error processing Excel data:', error);
      toast.error('Failed to process Excel data. Please check your column settings.');
    }
  }, [workbookData, selectedSheet, sourceColumn, uttererColumn, startRow, setSourceTexts, setUtterers, setTranslations, setOriginalTranslations, setCurrentIndex, setCurrentTranslation]);

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
      toast.success('Source text copied to clipboard');
    }
  }, [currentIndex, sourceTexts]);
  
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
        toast.success('Translation saved successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save translation');
      }
    } catch (error) {
      console.error('Error persisting translation:', error);
      toast.error('Network error: Failed to save translation');
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

  // ========== LIVE EDIT Functions ==========

  /**
   * Toggle LIVE EDIT mode
   */
  const toggleLiveEditMode = useCallback(() => {
    setLiveEditMode(prev => {
      if (!prev) {
        // Entering LIVE EDIT mode
        setSyncStatus('idle');
        toast.info('LIVE EDIT mode enabled - changes will sync to Excel');
      } else {
        // Exiting LIVE EDIT mode
        toast.info('LIVE EDIT mode disabled');
      }
      return !prev;
    });
  }, []);

  /**
   * Sync current translation to Excel file
   * Called when navigating (Previous/Submit) in LIVE EDIT mode
   */
  const syncCurrentTranslation = useCallback(async () => {
    // Only sync if in LIVE EDIT mode and we have a file loaded
    if (!liveEditMode) return;
    if (!loadedFileName) {
      toast.error('No file loaded for LIVE EDIT');
      return;
    }
    if (loadedFileType !== 'excel') {
      toast.error('LIVE EDIT only works with Excel files');
      return;
    }
    if (!selectedSheet) {
      toast.error('No sheet selected');
      return;
    }

    // Check if current entry has changed
    if (!hasCurrentEntryChanged()) {
      // No changes to sync
      return;
    }

    setSyncStatus('syncing');

    try {
      const cellRef = `J${startRow + currentIndex}`;
      const response = await fetch('/api/xlsx-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceFileName: loadedFileName,
          sheetName: selectedSheet,
          cellRef,
          value: currentTranslation.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update originalTranslations to reflect the saved state
        const newOriginals = [...originalTranslations];
        newOriginals[currentIndex] = currentTranslation.trim() || '[BLANK, REMOVE LATER]';
        setOriginalTranslations(newOriginals);

        setSyncStatus('synced');
        setLastSyncTime(new Date());
        toast.success(`Saved ${cellRef} to ${loadedFileName}`);
      } else {
        setSyncStatus('error');
        toast.error(`Sync failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setSyncStatus('error');
      toast.error('Sync failed: Network error');
      console.error('LIVE EDIT sync error:', error);
    }
  }, [
    liveEditMode,
    loadedFileName,
    loadedFileType,
    selectedSheet,
    hasCurrentEntryChanged,
    startRow,
    currentIndex,
    currentTranslation,
    originalTranslations
  ]);

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
    loadedFileName,
    loadedFileType,
    originalTranslations,

    // Change detection
    hasCurrentEntryChanged,
    getCurrentOriginalValue,

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
    setLoadedFileName,
    setLoadedFileType,
    setOriginalTranslations,

    // Functions
    handleStart,
    handleBackToSetup,
    handleSubmit,
    handlePrevious,
    handleSourceInput,
    handleFileUpload,
    handleExistingFileLoad,
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
    resetFromFile,
    outputKey,

    // Filtering
    filterOptions,
    filteredIndices,
    filterStats,
    setFilterOptions,
    setFilterStatus,
    navigateToNextFiltered,
    navigateToPrevFiltered,

    // LIVE EDIT
    liveEditMode,
    syncStatus,
    lastSyncTime,
    setLiveEditMode,
    toggleLiveEditMode,
    syncCurrentTranslation,
  };
}; 