import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { extractEpisodeNumber } from '@/utils/episodeExtractor';
import { useLiveEdit } from './useLiveEdit';
import type { SyncStatus } from './useLiveEdit';

// Filter options for entry navigation
export type FilterStatus = 'all' | 'completed' | 'blank' | 'modified';

export interface FilterOptions {
  status: FilterStatus;
  speaker?: string;
  searchTerm?: string;
}

export interface DetectedLanguage {
  code: string;           // "NL", "PT", etc.
  name: string;           // "Dutch", "Portuguese", etc.
  column: string;         // "J", "K", etc.
  headerText: string;     // Original header text from Excel
  sheets: string[];       // Which sheets have this language
  totalSheets: number;    // Total sheets in workbook
}

export interface TranslationState {
  // Core translation state
  sourceTexts: string[];
  utterers: string[];
  contextNotes: string[];
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

  // Translation column configuration (multi-language support)
  translationColumn: string;
  translationColumnIndex: number;
  targetLanguageLabel: string;

  // Language detection state
  detectedLanguages: DetectedLanguage[];
  selectedLanguage: DetectedLanguage | null;
  setDetectedLanguages: (languages: DetectedLanguage[]) => void;
  setSelectedLanguage: (language: DetectedLanguage | null) => void;

  // Refs
  fileInputRef: React.RefObject<HTMLInputElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  
  // Setters
  setSourceTexts: (texts: string[]) => void;
  setUtterers: (utterers: string[]) => void;
  setContextNotes: (notes: string[]) => void;
  setTranslations: (translations: string[]) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentTranslation: (translation: string | ((prev: string) => string)) => void;
  setIsStarted: (started: boolean) => void;
  setCellStart: (cell: string) => void;
  setExcelSheets: (sheets: string[]) => void;
  setSelectedSheet: (sheet: string) => void;
  setWorkbookData: (workbook: XLSX.WorkBook | null) => void;
  setShowCopied: (show: boolean) => void;
  setGradientColors: (colors: string[]) => void;
  setShowVersionHash: (show: boolean) => void;
  setInputMode: (mode: 'excel' | 'embedded-json' | 'manual') => void;
  setSourceColumn: (column: string) => void;
  setUttererColumn: (column: string) => void;
  setStartRow: (row: number) => void;
  setTranslationColumn: (column: string) => void;
  setTargetLanguageLabel: (label: string) => void;
  setLoadedFileName: (fileName: string) => void;
  setLoadedFileType: (fileType: 'excel' | 'json' | 'csv' | 'manual' | '') => void;
  setOriginalTranslations: (translations: string[]) => void;

  // Session persistence
  getLastSession: () => any;
  saveLastSession: () => void;

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
  syncStatus: SyncStatus;
  lastSyncTime: Date | null;
  setLiveEditMode: (mode: boolean) => void;
  toggleLiveEditMode: () => void;
  syncCurrentTranslation: () => Promise<void>;

  // Batch sync
  showSyncModal: boolean;
  syncModalDirtyCount: number;
  isBatchSyncing: boolean;
  batchSyncProgress: number;
  batchSyncTotal: number;
  startBatchSync: () => void;
  skipBatchSync: () => void;
  closeSyncModal: () => void;
  dirtyCount: number;

  // Completion flow state
  showCompletionSummary: boolean;
  showReviewMode: boolean;
  episodeNumber: string;

  // Completion flow functions
  finishSheet: () => void;
  enterReviewMode: () => void;
  exitReviewMode: () => void;
  resumeTranslation: () => void;
  advanceToNextSheet: () => void;
  updateTranslationAtIndex: (index: number, value: string) => void;
  exportToCsv: () => void;
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
export interface UseTranslationStateProps {
  /** Callback when a translation is saved (on submit/previous with changes) */
  onTranslationSaved?: (source: string, translation: string, file: string, sheet: string, row: number) => void;
}

export const useTranslationState = (props?: UseTranslationStateProps): TranslationState => {
  const onTranslationSaved = props?.onTranslationSaved;
  // ========== Core Translation State ==========
  const [sourceTexts, setSourceTexts] = useState<string[]>([]);
  const [utterers, setUtterers] = useState<string[]>([]);
  const [contextNotes, setContextNotes] = useState<string[]>([]);
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

  // ========== LIVE EDIT (extracted to useLiveEdit hook) ==========
  // Instantiated after translationColumn is defined — see below

  // ========== Completion Flow State ==========
  const [showCompletionSummary, setShowCompletionSummary] = useState(false);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [episodeNumber, setEpisodeNumber] = useState<string>('UNKNOWN');

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

  // Translation column configuration (for multi-language support)
  const [translationColumn, setTranslationColumn] = useState('J');
  const [targetLanguageLabel, setTargetLanguageLabel] = useState('NL');

  // Language detection state
  const [detectedLanguages, setDetectedLanguages] = useState<DetectedLanguage[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<DetectedLanguage | null>(null);

  // Helper to convert column letter to 0-based index (A=0, B=1, ... Z=25, AA=26, etc.)
  const columnLetterToIndex = useCallback((letter: string): number => {
    letter = letter.toUpperCase();
    let result = 0;
    for (let i = 0; i < letter.length; i++) {
      result = result * 26 + (letter.charCodeAt(i) - 64);
    }
    return result - 1;
  }, []);

  const translationColumnIndex = useMemo(() =>
    columnLetterToIndex(translationColumn),
    [translationColumn, columnLetterToIndex]
  );

  // ========== LIVE EDIT Hook ==========
  const liveEdit = useLiveEdit({
    translations,
    originalTranslations,
    setOriginalTranslations,
    loadedFileName,
    loadedFileType,
    selectedSheet,
    startRow,
    translationColumn,
    currentIndex,
    currentTranslation,
    hasCurrentEntryChanged,
  });

  // Language detection keywords mapping
  const LANGUAGE_KEYWORDS: Record<string, { code: string; name: string }> = {
    'dutch': { code: 'NL', name: 'Dutch' },
    'nl': { code: 'NL', name: 'Dutch' },
    'nederlands': { code: 'NL', name: 'Dutch' },
    'portuguese': { code: 'PT', name: 'Portuguese' },
    'pt': { code: 'PT', name: 'Portuguese' },
    'português': { code: 'PT', name: 'Portuguese' },
    'spanish': { code: 'ES', name: 'Spanish' },
    'es': { code: 'ES', name: 'Spanish' },
    'español': { code: 'ES', name: 'Spanish' },
    'french': { code: 'FR', name: 'French' },
    'fr': { code: 'FR', name: 'French' },
    'français': { code: 'FR', name: 'French' },
    'german': { code: 'DE', name: 'German' },
    'de': { code: 'DE', name: 'German' },
    'deutsch': { code: 'DE', name: 'German' },
    'italian': { code: 'IT', name: 'Italian' },
    'it': { code: 'IT', name: 'Italian' },
    'italiano': { code: 'IT', name: 'Italian' },
    'russian': { code: 'RU', name: 'Russian' },
    'ru': { code: 'RU', name: 'Russian' },
    'japanese': { code: 'JA', name: 'Japanese' },
    'ja': { code: 'JA', name: 'Japanese' },
    'korean': { code: 'KO', name: 'Korean' },
    'ko': { code: 'KO', name: 'Korean' },
    'chinese': { code: 'ZH', name: 'Chinese' },
    'zh': { code: 'ZH', name: 'Chinese' },
  };

  /**
   * Detect available language columns across all sheets in workbook
   */
  const detectLanguagesInWorkbook = useCallback((workbook: XLSX.WorkBook): DetectedLanguage[] => {
    const languageMap = new Map<string, DetectedLanguage>();
    const totalSheets = workbook.SheetNames.length;

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet || !worksheet['!ref']) continue;

      const range = XLSX.utils.decode_range(worksheet['!ref']);

      // Scan header row (row 0)
      for (let col = 0; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        const cell = worksheet[cellRef];
        if (!cell?.v) continue;

        const headerText = cell.v.toString().trim();
        const headerLower = headerText.toLowerCase();

        // Check against language keywords
        for (const [keyword, langInfo] of Object.entries(LANGUAGE_KEYWORDS)) {
          if (headerLower.includes(keyword)) {
            const columnLetter = XLSX.utils.encode_col(col);
            const key = `${langInfo.code}-${columnLetter}`;

            if (languageMap.has(key)) {
              // Add sheet to existing language entry
              const existing = languageMap.get(key)!;
              if (!existing.sheets.includes(sheetName)) {
                existing.sheets.push(sheetName);
              }
            } else {
              // Create new language entry
              languageMap.set(key, {
                code: langInfo.code,
                name: langInfo.name,
                column: columnLetter,
                headerText: headerText,
                sheets: [sheetName],
                totalSheets: totalSheets,
              });
            }
            break; // Only match first keyword per column
          }
        }
      }
    }

    // Convert map to array and sort by sheet coverage (most sheets first)
    return Array.from(languageMap.values())
      .sort((a, b) => b.sheets.length - a.sheets.length);
  }, []);

  // ========== Component References ==========
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // ========== Session Persistence ==========

  const saveLastSession = useCallback(() => {
    const session = {
      fileName: loadedFileName,
      fileType: loadedFileType,
      selectedSheet,
      sourceColumn,
      uttererColumn,
      startRow,
      translationColumn,
      targetLanguageLabel,
      totalLines: sourceTexts.length,
      translatedCount: translations.filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length,
      timestamp: Date.now(),
    };
    localStorage.setItem('lastTranslationSession', JSON.stringify(session));
  }, [loadedFileName, loadedFileType, selectedSheet, sourceColumn, uttererColumn, startRow, translationColumn, targetLanguageLabel, sourceTexts.length, translations]);

  const getLastSession = useCallback(() => {
    try {
      const data = localStorage.getItem('lastTranslationSession');
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }, []);

  // ========== Translation Functions ==========

  /**
   * Handle start button click
   */
  const handleStart = useCallback(() => {
    setIsStarted(true);
    saveLastSession();
  }, [saveLastSession]);
  
  /**
   * Handle back to setup button click
   * Resets all completion state to allow fresh start on re-entry
   */
  const handleBackToSetup = useCallback(() => {
    setIsStarted(false);
    setShowCompletionSummary(false);
    setShowReviewMode(false);
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

      // Silent — progress bar and Modified/Unchanged badge show the state
      if (currentTranslation.trim() !== '') {
        // Save to translation memory (always, not just LIVE EDIT)
        const source = sourceTexts[currentIndex];
        if (source && onTranslationSaved) {
          onTranslationSaved(source, currentTranslation.trim(), loadedFileName, selectedSheet, startRow + currentIndex);
        }
      }
    }

    // Only move to next if not on last row
    if (currentIndex < sourceTexts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextTranslation = hasChanged ? newTranslations[currentIndex + 1] : translations[currentIndex + 1];
      setCurrentTranslation(nextTranslation === '[BLANK, REMOVE LATER]' ? '' : nextTranslation || '');
    }

    // Save session progress
    saveLastSession();
  }, [currentIndex, currentTranslation, sourceTexts, sourceTexts.length, translations, hasCurrentEntryChanged, loadedFileName, selectedSheet, startRow, onTranslationSaved, saveLastSession]);
  
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

        // Save to translation memory (always, not just LIVE EDIT)
        const source = sourceTexts[currentIndex];
        if (source && currentTranslation.trim() !== '' && onTranslationSaved) {
          onTranslationSaved(source, currentTranslation.trim(), loadedFileName, selectedSheet, startRow + currentIndex);
        }
      }

      setCurrentIndex(currentIndex - 1);
      const prevTranslation = hasChanged ? newTranslations[currentIndex - 1] : translations[currentIndex - 1];
      setCurrentTranslation(prevTranslation === '[BLANK, REMOVE LATER]' ? '' : prevTranslation || '');
    }
  }, [currentIndex, currentTranslation, sourceTexts, translations, hasCurrentEntryChanged, loadedFileName, selectedSheet, startRow, onTranslationSaved]);
  
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
    
    reader.onload = (evt) => {
      try {
        const result = evt.target?.result;
        if (!result) return;

        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        setWorkbookData(workbook);
        setExcelSheets(workbook.SheetNames);
        setLoadedFileName(file.name);
        setLoadedFileType('excel');
        setEpisodeNumber(extractEpisodeNumber(file.name));
        if (workbook.SheetNames.length > 0) {
          setSelectedSheet(workbook.SheetNames[0]);
        }

        // Detect languages after loading workbook
        const detected = detectLanguagesInWorkbook(workbook);
        setDetectedLanguages(detected);

        // Auto-select first detected language if available
        if (detected.length > 0) {
          setSelectedLanguage(detected[0]);
          setTranslationColumn(detected[0].column);
          setTargetLanguageLabel(detected[0].code);
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
  }, [detectLanguagesInWorkbook]);

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
      setEpisodeNumber(extractEpisodeNumber(fileName));
      if (workbook.SheetNames.length > 0) {
        setSelectedSheet(workbook.SheetNames[0]);
      }

      // Detect languages after loading workbook
      const detected = detectLanguagesInWorkbook(workbook);
      setDetectedLanguages(detected);

      // Auto-select first detected language if available
      if (detected.length > 0) {
        setSelectedLanguage(detected[0]);
        setTranslationColumn(detected[0].column);
        setTargetLanguageLabel(detected[0].code);
      }

      toast.success(`Loaded ${fileName}`);
    } catch (error) {
      console.error('Error loading Excel file:', error);
      toast.error('Failed to load Excel file. Please try again.');
    } finally {
      setIsLoadingExcel(false);
    }
  }, [detectLanguagesInWorkbook]);

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
      const contextNotes: string[] = [];
      const existingTranslations: string[] = [];

      // Translation column is configurable (defaults to J/index 9 for Dutch)
      const targetColumnIndex = translationColumnIndex;

      for (let row = startRow - 1; row <= range.e.r; row++) {
        const sourceCell = XLSX.utils.encode_cell({ r: row, c: sourceColumn.charCodeAt(0) - 65 });
        const uttererCell = XLSX.utils.encode_cell({ r: row, c: uttererColumn.charCodeAt(0) - 65 });
        // Context notes are in column B (Description column)
        const contextCell = XLSX.utils.encode_cell({ r: row, c: 1 }); // Column B = index 1
        const targetCell = XLSX.utils.encode_cell({ r: row, c: targetColumnIndex });

        const sourceValue = worksheet[sourceCell]?.v;
        const uttererValue = worksheet[uttererCell]?.v;
        const contextValue = worksheet[contextCell]?.v;
        const targetValue = worksheet[targetCell]?.v;

        if (sourceValue && sourceValue.toString().trim()) {
          sourceTexts.push(sourceValue.toString().trim());
          utterers.push(uttererValue ? uttererValue.toString().trim() : '');
          contextNotes.push(contextValue ? contextValue.toString().trim() : '');
          // Load existing translation or mark as blank
          const existingTranslation = targetValue ? targetValue.toString().trim() : '';
          existingTranslations.push(existingTranslation || '[BLANK, REMOVE LATER]');
        }
      }

      setSourceTexts(sourceTexts);
      setUtterers(utterers);
      setContextNotes(contextNotes);
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
  }, [workbookData, selectedSheet, sourceColumn, uttererColumn, startRow, translationColumnIndex, setSourceTexts, setUtterers, setContextNotes, setTranslations, setOriginalTranslations, setCurrentIndex, setCurrentTranslation]);

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
        // Silent — save success is obvious from context
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
  // All live edit logic (toggle, sync, batch sync, dirty tracking) is now in useLiveEdit hook.
  // See liveEdit.* below.

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

  // ========== Completion Flow Functions ==========

  /**
   * Finish current sheet and show completion summary
   */
  const finishSheet = useCallback(() => {
    // Save current translation before showing summary
    if (currentTranslation.trim()) {
      const newTranslations = [...translations];
      newTranslations[currentIndex] = currentTranslation.trim() || '[BLANK, REMOVE LATER]';
      setTranslations(newTranslations);
    }
    setShowCompletionSummary(true);
    setShowReviewMode(false);
  }, [currentTranslation, translations, currentIndex]);

  /**
   * Enter review mode from completion summary
   */
  const enterReviewMode = useCallback(() => {
    setShowCompletionSummary(false);
    setShowReviewMode(true);
  }, []);

  /**
   * Exit review mode and return to completion summary
   */
  const exitReviewMode = useCallback(() => {
    setShowReviewMode(false);
    setShowCompletionSummary(true);
  }, []);

  /**
   * Resume translation - exit completion flow and return to translation screen
   * Allows user to continue editing the current sheet after finishing
   */
  const resumeTranslation = useCallback(() => {
    setShowCompletionSummary(false);
    setShowReviewMode(false);
    // Keep isStarted = true so we stay in translation mode
  }, []);

  /**
   * Advance to next sheet in the workbook
   */
  const advanceToNextSheet = useCallback(() => {
    const currentSheetIndex = excelSheets.indexOf(selectedSheet);
    if (currentSheetIndex < excelSheets.length - 1) {
      const nextSheet = excelSheets[currentSheetIndex + 1];
      setSelectedSheet(nextSheet);
      setShowCompletionSummary(false);
      setShowReviewMode(false);
      setCurrentIndex(0);
      setCurrentTranslation('');
      // processExcelData will be triggered by useEffect watching selectedSheet
    }
  }, [excelSheets, selectedSheet]);

  /**
   * Update translation at specific index (for review mode)
   */
  const updateTranslationAtIndex = useCallback((index: number, value: string) => {
    const newTranslations = [...translations];
    newTranslations[index] = value.trim() || '[BLANK, REMOVE LATER]';
    setTranslations(newTranslations);
  }, [translations]);

  /**
   * Export translations to CSV with episode number in filename
   */
  const exportToCsv = useCallback(() => {
    const csvHeader = 'Row No,Source,Translation\n';

    const csvRows = translations.map((trans, idx) => {
      const rowNum = startRow + idx;
      const source = sourceTexts[idx] || '';
      const translation = trans === '[BLANK, REMOVE LATER]' ? '' : trans;

      // Escape CSV values
      const escapeCsv = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      return `${rowNum},${escapeCsv(source)},${escapeCsv(translation)}`;
    }).join('\n');

    const csvData = csvHeader + csvRows;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Use EP_NO--sheet-name.csv format
    const safeSheetName = (selectedSheet || 'sheet').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `${episodeNumber}--${safeSheetName}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${episodeNumber}--${safeSheetName}.csv`);
  }, [translations, sourceTexts, startRow, selectedSheet, episodeNumber]);

  return {
    // State
    sourceTexts,
    utterers,
    contextNotes,
    translations,
    currentIndex,
    currentTranslation,
    isStarted,
    cellStart,
    excelSheets,
    selectedSheet,
    workbookData,
    isLoadingExcel,
    showCopied,
    gradientColors,
    showVersionHash,
    inputMode,
    sourceColumn,
    uttererColumn,
    startRow,
    translationColumn,
    translationColumnIndex,
    targetLanguageLabel,
    loadedFileName,
    loadedFileType,
    originalTranslations,

    // Language detection
    detectedLanguages,
    selectedLanguage,
    setDetectedLanguages,
    setSelectedLanguage,

    // Change detection
    hasCurrentEntryChanged,
    getCurrentOriginalValue,

    // Refs
    fileInputRef,
    textareaRef,
    
    // Setters
    setSourceTexts,
    setUtterers,
    setContextNotes,
    setTranslations,
    setCurrentIndex,
    setCurrentTranslation,
    setIsStarted,
    setCellStart,
    setExcelSheets,
    setSelectedSheet,
    setWorkbookData,
    setShowCopied,
    setGradientColors,
    setShowVersionHash,
    setInputMode,
    setSourceColumn,
    setUttererColumn,
    setStartRow,
    setTranslationColumn,
    setTargetLanguageLabel,
    setLoadedFileName,
    setLoadedFileType,
    setOriginalTranslations,

    // Session persistence
    getLastSession,
    saveLastSession,

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

    // LIVE EDIT (from useLiveEdit hook)
    liveEditMode: liveEdit.liveEditMode,
    syncStatus: liveEdit.syncStatus,
    lastSyncTime: liveEdit.lastSyncTime,
    setLiveEditMode: liveEdit.setLiveEditMode,
    toggleLiveEditMode: liveEdit.toggleLiveEditMode,
    syncCurrentTranslation: liveEdit.syncCurrentTranslation,

    // Batch sync (from useLiveEdit hook)
    showSyncModal: liveEdit.showSyncModal,
    syncModalDirtyCount: liveEdit.syncModalDirtyCount,
    isBatchSyncing: liveEdit.isBatchSyncing,
    batchSyncProgress: liveEdit.batchSyncProgress,
    batchSyncTotal: liveEdit.batchSyncTotal,
    startBatchSync: liveEdit.startBatchSync,
    skipBatchSync: liveEdit.skipBatchSync,
    closeSyncModal: liveEdit.closeSyncModal,
    dirtyCount: liveEdit.dirtyCount,

    // Completion flow
    showCompletionSummary,
    showReviewMode,
    episodeNumber,
    finishSheet,
    enterReviewMode,
    exitReviewMode,
    resumeTranslation,
    advanceToNextSheet,
    updateTranslationAtIndex,
    exportToCsv,
  };
}; 