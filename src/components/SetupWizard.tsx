'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import Spinner from './ui/Spinner';
import { toast } from 'sonner';
import VideoButton from './VideoButton';
import GitHubButton from './GitHubButton';
import CodexButton from './CodexButton';
import CodexEditor from './CodexEditor';
import StyleAnalysisPanel from './StyleAnalysisPanel';
import SheetSelector from './SheetSelector';
import LanguageSelector, { DetectedLanguage } from './LanguageSelector';
import SheetPreview from './SheetPreview';
import ReferenceDataInfo from './ReferenceDataInfo';
import { useCodexLanguages } from '../hooks/useCodexLanguages';

interface SetupWizardProps {
  // Input mode state
  inputMode: 'excel' | 'embedded-json' | 'manual';
  setInputMode: (mode: 'excel' | 'embedded-json' | 'manual') => void;

  // Excel configuration state
  excelSheets: string[];
  selectedSheet: string;
  setSelectedSheet: (sheet: string) => void;
  sourceColumn: string;
  setSourceColumn: (column: string) => void;
  uttererColumn: string;
  setUttererColumn: (column: string) => void;
  referenceColumn: string;
  setReferenceColumn: (column: string) => void;
  useReferenceColumn: boolean;
  setUseReferenceColumn: (use: boolean) => void;
  startRow: number;
  setStartRow: (row: number) => void;

  // Translation column configuration (for multi-language support)
  translationColumn: string;
  setTranslationColumn: (column: string) => void;
  targetLanguageLabel: string;
  setTargetLanguageLabel: (label: string) => void;

  // Language detection
  detectedLanguages: DetectedLanguage[];
  selectedLanguage: DetectedLanguage | null;
  onSelectLanguage: (language: DetectedLanguage) => void;

  // Manual input state
  cellStart: string;
  setCellStart: (cell: string) => void;

  // Data state
  sourceTexts: string[];
  workbookData?: any;
  setSourceTexts?: (texts: string[]) => void;
  setUtterers?: (utterers: string[]) => void;
  setTranslations?: (translations: string[]) => void;
  setLoadedFileName?: (fileName: string) => void;
  setLoadedFileType?: (fileType: 'excel' | 'json' | 'csv' | 'manual' | '') => void;
  setOriginalTranslations?: (translations: string[]) => void;

  // Event handlers
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSourceInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleStart: () => void;
  handleExistingFileLoad?: (fileName: string) => void;

  // Animation state
  gradientColors: string[];
  isTranslating?: boolean;
  showVersionHash: boolean;
  VERSION_HASH: string;

  // Footer interaction handlers
  onVersionBadgeHover?: (isHovering: boolean) => void;
  onVersionBadgeClick?: () => void;

  // Dark mode state
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Reset functionality
  showResetModal?: boolean;
  setShowResetModal?: (show: boolean) => void;

  // Loading states
  isLoadingExcel?: boolean;
}

/**
 * SetupWizard Component
 * 
 * Handles the initial setup and configuration of the translation workflow.
 * Provides two input modes:
 * - Excel Upload: Upload and configure Excel files for bulk translation
 * - Manual Input: Paste text manually for individual translations
 * 
 * FUTURE REFACTORING OPPORTUNITIES:
 * ====================================
 * 
 * 1. EXCEL CONFIGURATION MODULE
 *    - Extract Excel-specific configuration logic
 *    - Create: ExcelConfiguration component
 *    - State to extract: excelSheets, selectedSheet, column configurations
 * 
 * 2. MANUAL INPUT MODULE
 *    - Extract manual text input handling
 *    - Create: ManualInput component
 *    - State to extract: cellStart, textarea handling
 * 
 * 3. INPUT MODE TOGGLE MODULE
 *    - Extract mode switching logic
 *    - Create: InputModeToggle component
 *    - State to extract: inputMode switching
 * 
 * @component
 */
const SetupWizard: React.FC<SetupWizardProps> = ({
  inputMode,
  setInputMode,
  excelSheets,
  selectedSheet,
  setSelectedSheet,
  sourceColumn,
  setSourceColumn,
  uttererColumn,
  setUttererColumn,
  referenceColumn,
  setReferenceColumn,
  useReferenceColumn,
  setUseReferenceColumn,
  startRow,
  setStartRow,
  translationColumn,
  setTranslationColumn,
  targetLanguageLabel,
  setTargetLanguageLabel,
  detectedLanguages,
  selectedLanguage,
  onSelectLanguage,
  cellStart,
  setCellStart,
  sourceTexts,
  workbookData,
  setSourceTexts,
  setUtterers,
  setTranslations,
  setLoadedFileName,
  setLoadedFileType,
  setOriginalTranslations,
  handleFileUpload,
  handleSourceInput,
  handleStart,
  handleExistingFileLoad,
  gradientColors,
  isTranslating,
  showVersionHash,
  VERSION_HASH,
  onVersionBadgeHover,
  onVersionBadgeClick,
  darkMode,
  toggleDarkMode,
  showResetModal,
  setShowResetModal,
  isLoadingExcel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingFiles, setExistingFiles] = React.useState<any[]>([]);
  const [loadingExistingFiles, setLoadingExistingFiles] = React.useState(false);
  const [selectedExistingFile, setSelectedExistingFile] = React.useState('');
  const [localeColumns, setLocaleColumns] = React.useState<{column: string, locale: string}[]>([]);

  // Unified file selection state
  const [fileType, setFileType] = React.useState<'excel' | 'json' | 'csv'>('excel');
  const [jsonFiles, setJsonFiles] = React.useState<string[]>([]);
  const [csvFiles, setCsvFiles] = React.useState<string[]>([]);
  const [selectedDataFile, setSelectedDataFile] = React.useState('');
  const [loadingDataFiles, setLoadingDataFiles] = React.useState(false);

  // Codex editor state - expanded by default for better discoverability
  const [showCodexEditor, setShowCodexEditor] = useState(true);

  // Reference data availability check - also provides entry count
  const { hasLanguage, isLoading: isLoadingCodex, totalEntries, refresh: refreshCodex } = useCodexLanguages();

  // Extract column headers from the selected sheet
  const sheetColumns = useMemo(() => {
    if (!workbookData || !selectedSheet) return [];

    const worksheet = workbookData.Sheets[selectedSheet];
    if (!worksheet) return [];

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const columns: { letter: string; header: string }[] = [];

    // Read header row (row 1, index 0)
    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      const cell = worksheet[cellAddress];
      const colLetter = XLSX.utils.encode_col(col);
      const headerValue = cell?.v?.toString().trim() || `Column ${colLetter}`;

      columns.push({
        letter: colLetter,
        header: headerValue
      });
    }

    return columns;
  }, [workbookData, selectedSheet]);

  // Handle file type change - clear previous selections and data to avoid stale state
  const handleFileTypeChange = React.useCallback((newType: 'excel' | 'json' | 'csv') => {
    setFileType(newType);
    // Clear selections when switching file types to prevent loading wrong data
    setSelectedDataFile('');
    setSelectedExistingFile('');
    // Clear any previously loaded source data to force fresh load
    if (setSourceTexts) setSourceTexts([]);
    if (setUtterers) setUtterers([]);
    if (setTranslations) setTranslations([]);
  }, [setSourceTexts, setUtterers, setTranslations]);

  // Load existing files on component mount
  React.useEffect(() => {
    const loadExistingFiles = async () => {
      setLoadingExistingFiles(true);
      console.log('[SetupWizard] Loading existing Excel files...');
      try {
        const response = await fetch('/api/xlsx-files');
        if (response.ok) {
          const data = await response.json();
          console.log('[SetupWizard] Loaded Excel files:', data.files?.length || 0, 'files');
          setExistingFiles(data.files || []);
        } else {
          console.error('[SetupWizard] Failed to load Excel files:', response.status);
        }
      } catch (error) {
        console.error('[SetupWizard] Error loading existing files:', error);
      } finally {
        setLoadingExistingFiles(false);
      }
    };

    loadExistingFiles();
  }, []);

  // Callback to refresh codex count when entries change - uses the hook's refresh
  const handleCodexUpdated = React.useCallback(() => {
    refreshCodex();
  }, [refreshCodex]);

  // Load JSON and CSV files on component mount
  React.useEffect(() => {
    const loadDataFiles = async () => {
      setLoadingDataFiles(true);
      console.log('[SetupWizard] Loading JSON and CSV files...');
      try {
        const [jsonResponse, csvResponse] = await Promise.all([
          fetch('/api/json-files'),
          fetch('/api/csv-files')
        ]);

        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json();
          console.log('[SetupWizard] Loaded JSON files:', jsonData?.length || 0, 'files');
          setJsonFiles(jsonData);
        } else {
          console.error('[SetupWizard] Failed to load JSON files:', jsonResponse.status);
        }

        if (csvResponse.ok) {
          const csvData = await csvResponse.json();
          console.log('[SetupWizard] Loaded CSV files:', csvData?.length || 0, 'files');
          setCsvFiles(csvData);
        } else {
          console.error('[SetupWizard] Failed to load CSV files:', csvResponse.status);
        }
      } catch (error) {
        console.error('[SetupWizard] Error loading data files:', error);
      } finally {
        setLoadingDataFiles(false);
      }
    };

    loadDataFiles();
  }, []);

  const handleExistingFileSelect = (fileName: string) => {
    console.log('[SetupWizard] Excel file selected:', fileName);
    setSelectedExistingFile(fileName);
    if (handleExistingFileLoad) {
      handleExistingFileLoad(fileName);
    }
  };

  // Wrapper function to handle data file loading before starting translation
  const handleStartWithDataFile = async () => {
    // If sourceTexts are already populated (e.g., from Excel or manual input), just start
    if (sourceTexts.length > 0) {
      // For Excel files, set the loaded file info
      if (fileType === 'excel' && selectedExistingFile) {
        setLoadedFileName?.(selectedExistingFile);
        setLoadedFileType?.('excel');
      }
      handleStart();
      return;
    }

    // If JSON or CSV file is selected, load it first
    if ((fileType === 'json' || fileType === 'csv') && selectedDataFile && setSourceTexts && setUtterers && setTranslations) {
      try {
        const endpoint = fileType === 'json' ? '/api/json-data' : '/api/csv-data';
        const response = await fetch(`${endpoint}?file=${encodeURIComponent(selectedDataFile)}`);

        if (!response.ok) {
          throw new Error(`Failed to load ${fileType.toUpperCase()} file`);
        }

        const data = await response.json();

        // Extract source texts, utterers, and existing translations from the data
        const texts: string[] = [];
        const speakers: string[] = [];
        const existingTranslations: string[] = [];

        if (fileType === 'json') {
          // JSON format: data is the direct JSON structure with sheets array
          data.sheets?.forEach((sheet: any) => {
            sheet.entries?.forEach((entry: any) => {
              if (entry.sourceEnglish) {
                texts.push(entry.sourceEnglish);
                speakers.push(entry.utterer || '');
                // Load existing Dutch translation if available, otherwise use blank placeholder
                existingTranslations.push(entry.translatedDutch || '[BLANK, REMOVE LATER]');
              }
            });
          });
        } else {
          // CSV format: data has sheets array with entries
          data.sheets?.forEach((sheet: any) => {
            sheet.entries?.forEach((entry: any) => {
              if (entry.english) {
                texts.push(entry.english);
                speakers.push(entry.utterer || '');
                // Load existing Dutch translation if available, otherwise use blank placeholder
                existingTranslations.push(entry.dutch || '[BLANK, REMOVE LATER]');
              }
            });
          });
        }

        if (texts.length === 0) {
          alert(`No translatable entries found in the selected ${fileType.toUpperCase()} file.`);
          return;
        }

        // Set the data in translation state (including existing translations)
        setSourceTexts(texts);
        setUtterers(speakers);
        setTranslations(existingTranslations);

        // Track the loaded file info and original translations for persistence logic
        setLoadedFileName?.(selectedDataFile);
        setLoadedFileType?.(fileType);
        setOriginalTranslations?.(existingTranslations);

      } catch (error) {
        console.error(`Error loading ${fileType} file:`, error);
        alert(`Failed to load ${fileType.toUpperCase()} file. Please try again.`);
        return; // Don't proceed to handleStart if loading failed
      }
    }

    // Call the original handleStart function
    handleStart();
  };

  // Function to detect locale columns from header row
  const detectLocaleColumns = React.useCallback(() => {
    if (!workbookData || !selectedSheet) {
      setLocaleColumns([]);
      return;
    }

    try {
      const worksheet = workbookData.Sheets[selectedSheet];
      if (!worksheet) {
        setLocaleColumns([]);
        return;
      }

      // Get the header row (assumed to be row 1)
      const headerRow = 1;
      const detectedColumns: {column: string, locale: string}[] = [];
      
      // Common two-letter locale codes
      const localeCodes = [
        'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 
        'ar', 'hi', 'tr', 'pl', 'nl', 'sv', 'da', 'no', 'fi', 'cs',
        'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt',
        'ca', 'eu', 'gl', 'cy', 'ga', 'gd', 'is', 'fo', 'kl', 'se'
      ];

      // Iterate through columns A-Z, AA-AZ to check headers
      const columnLetters = [];
      for (let i = 0; i < 26; i++) {
        columnLetters.push(String.fromCharCode(65 + i)); // A-Z
      }
      for (let i = 0; i < 26; i++) {
        columnLetters.push('A' + String.fromCharCode(65 + i)); // AA-AZ
      }

      columnLetters.forEach(col => {
        const cellAddress = col + headerRow;
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const headerValue = cell.v.toString().toLowerCase().trim();
          
          // Check if the header contains a locale code
          localeCodes.forEach(locale => {
            if (headerValue.includes(locale) || headerValue === locale) {
              detectedColumns.push({ column: col, locale: locale.toUpperCase() });
            }
          });
        }
      });

      setLocaleColumns(detectedColumns);
    } catch (error) {
      console.error('Error detecting locale columns:', error);
      setLocaleColumns([]);
    }
  }, [workbookData, selectedSheet]);

  // Detect locale columns when workbook or sheet changes
  React.useEffect(() => {
    detectLocaleColumns();
  }, [detectLocaleColumns]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => {
          console.log('[SetupWizard] Dark mode button clicked!');
          toggleDarkMode();
        }}
        className="fixed top-4 right-4 h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out z-50"
        style={{ borderRadius: '3px' }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-4 h-4 text-yellow-500 relative z-10" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-700 dark:text-gray-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      {/* Main Container - Responsive width based on configuration panel visibility */}
      <div
        className={`w-full space-y-6 transition-all duration-500 ease-in-out ${
          excelSheets.length > 0 ? 'max-w-6xl' : 'max-w-4xl'
        }`}
        style={{ animation: 'fadeIn 0.5s ease-out' }}
      >
        {/* Header Section with Logo */}
        <div className="text-center mb-6">
          {/* Logo Image */}
          <div className="mb-4 flex justify-center">
            <img
              src="/images/asses-masses-logo.png"
              alt="Asses Masses Logo"
              className="h-24 w-auto max-w-full object-contain"
            />
          </div>
          <h1 className="text-5xl font-black mb-1 tracking-tighter text-gray-900 dark:text-gray-100">Translation Helper</h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase mb-3">asses.masses edition</p>
          <p className="text-gray-600 dark:text-gray-400 text-base">Choose your input method below</p>
          {/* Translation Target Indicator - only show when language is selected */}
          {selectedLanguage && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium" style={{ borderRadius: '3px' }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Target: Column {selectedLanguage.column} ({selectedLanguage.name})</span>
            </div>
          )}
        </div>

        {/* Main Form Card - Tighter padding */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-6 space-y-6 shadow-sm transition-all duration-300" style={{ borderRadius: '3px' }}>
          {/* Input Mode Toggle - Hidden but preserved */}
          <div className="hidden justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 border border-black dark:border-gray-600 p-1 flex transition-colors duration-300">
              <button
                onClick={() => setInputMode('excel')}
                className={`px-6 py-2 font-black tracking-tight uppercase letter-spacing-wide transition-all duration-200 ${
                  inputMode === 'excel'
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                style={{ borderRadius: '3px' }}
              >
                Excel Upload
              </button>
              <button
                onClick={() => setInputMode('embedded-json')}
                className={`px-6 py-2 font-black tracking-tight uppercase letter-spacing-wide transition-all duration-200 ${
                  inputMode === 'embedded-json'
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                style={{ borderRadius: '3px' }}
              >
                Embedded JSON
              </button>
              <button
                onClick={() => setInputMode('manual')}
                className={`px-6 py-2 font-black tracking-tight uppercase letter-spacing-wide transition-all duration-200 ${
                  inputMode === 'manual'
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                style={{ borderRadius: '3px' }}
              >
                Manual Input
              </button>
            </div>
          </div>

          {/* File Source Cabinet - Unified Layout */}
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden" style={{ borderRadius: '3px' }}>

              {/* Section 1: Upload New File */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Upload New</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-gray-500', 'bg-gray-100', 'dark:bg-gray-700');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-gray-500', 'bg-gray-100', 'dark:bg-gray-700');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-gray-500', 'bg-gray-100', 'dark:bg-gray-700');
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      const file = files[0];
                      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                          file.type !== 'application/vnd.ms-excel' &&
                          !file.name.endsWith('.xlsx') &&
                          !file.name.endsWith('.xls')) {
                        toast.error('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
                        return;
                      }
                      const maxSize = 50 * 1024 * 1024;
                      if (file.size > maxSize) {
                        toast.error('File too large. Maximum file size is 50MB');
                        return;
                      }
                      const syntheticEvent = {
                        target: { files: [file] }
                      } as unknown as React.ChangeEvent<HTMLInputElement>;
                      handleFileUpload(syntheticEvent);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload Excel file"
                  className="flex items-center justify-center gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-900/50 transition-all duration-200 cursor-pointer"
                  style={{ borderRadius: '3px' }}
                >
                  {isLoadingExcel ? (
                    <Spinner size="sm" label="Processing..." />
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Drop .xlsx file or click to browse</span>
                    </>
                  )}
                </div>
              </div>

              {/* Section 2: Load Existing File */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Load Existing</span>
                </div>

                {/* File Type + File Selector Row */}
                <div className="flex items-center gap-2">
                  {/* File Type Toggle - Compact */}
                  <div className="flex shrink-0" role="group" aria-label="File type">
                    {['excel', 'json', 'csv'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFileTypeChange(type as 'excel' | 'json' | 'csv')}
                        aria-pressed={fileType === type}
                        className={`px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all duration-200 first:rounded-l-[3px] last:rounded-r-[3px] ${
                          fileType === type
                            ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {type === 'excel' ? 'XLS' : type.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* File Selector - Flex grow */}
                  <div className="flex-1 min-w-0">
                    {fileType === 'excel' && (
                      <>
                        {loadingExistingFiles ? (
                          <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">Loading...</div>
                        ) : existingFiles.length > 0 ? (
                          <select
                            value={selectedExistingFile}
                            onChange={(e) => handleExistingFileSelect(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20 transition-all"
                            style={{ borderRadius: '3px' }}
                          >
                            <option value="">Select file...</option>
                            {existingFiles.map(file => (
                              <option key={file.fileName} value={file.fileName}>
                                {file.fileName} ({file.sheets?.length || 0} sheets)
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">No files in /excels</div>
                        )}
                      </>
                    )}
                    {(fileType === 'json' || fileType === 'csv') && (
                      <>
                        {loadingDataFiles ? (
                          <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">Loading...</div>
                        ) : (fileType === 'json' ? jsonFiles : csvFiles).length > 0 ? (
                          <select
                            value={selectedDataFile}
                            onChange={(e) => {
                              console.log(`[SetupWizard] ${fileType.toUpperCase()} file selected:`, e.target.value);
                              setSelectedDataFile(e.target.value);
                            }}
                            className="w-full px-2.5 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20 transition-all"
                            style={{ borderRadius: '3px' }}
                          >
                            <option value="">Select file...</option>
                            {(fileType === 'json' ? jsonFiles : csvFiles).map(file => (
                              <option key={file} value={file}>{file}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">No files in /data/{fileType}</div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Selection confirmation */}
                {((fileType === 'excel' && selectedExistingFile && excelSheets.length > 0) ||
                  ((fileType === 'json' || fileType === 'csv') && selectedDataFile)) && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {fileType === 'excel' ? selectedExistingFile : selectedDataFile} loaded
                    </span>
                  </div>
                )}
              </div>

              {/* Section 2.5: Language Selection - Only when Excel loaded */}
              {fileType === 'excel' && excelSheets.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <LanguageSelector
                    languages={detectedLanguages}
                    selectedLanguage={selectedLanguage}
                    onSelectLanguage={onSelectLanguage}
                    disabled={isLoadingExcel}
                  />

                  {/* Reference Data Status */}
                  {selectedLanguage && (
                    <div className="mt-4">
                      <ReferenceDataInfo
                        selectedLanguage={selectedLanguage.code}
                        selectedLanguageName={selectedLanguage.name}
                        hasReferenceData={hasLanguage(selectedLanguage.code)}
                        isLoading={isLoadingCodex}
                        totalEntries={totalEntries}
                        onLearnMore={() => window.open('/docs/reference-data-guide.md', '_blank')}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Section 3: Sheet Configuration - Only when Excel with sheets */}
              {fileType === 'excel' && excelSheets.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Sheet</span>
                  </div>
                  <SheetSelector
                    sheets={excelSheets}
                    selectedSheet={selectedSheet}
                    onSelectSheet={setSelectedSheet}
                    workbookData={workbookData}
                    startRow={startRow}
                  />

                  {/* Sheet Preview */}
                  {selectedSheet && selectedLanguage && (
                    <div className="mt-4">
                      <SheetPreview
                        workbook={workbookData}
                        sheetName={selectedSheet}
                        sourceColumn={sourceColumn}
                        targetColumn={selectedLanguage.column}
                        startRow={startRow}
                        languageCode={selectedLanguage.code}
                      />
                    </div>
                  )}

                  {/* Status indicators */}
                  {sourceTexts.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {sourceTexts.length} items ready
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Embedded JSON Section */}
          {inputMode === 'embedded-json' && (
            <div className="space-y-6 animate-fade-in">
              <label className="block text-base font-black mb-4 text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                Embedded JSON Data
              </label>
              
              {/* Preamble Section */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">JSON Data Source & Rendering</h5>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  This panel sources JSON data from the <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">data/json/</code> folder, 
                  containing processed Excel files converted to structured JSON format. Each JSON file represents an Excel workbook with multiple sheets, 
                  where data is extracted from columns A (Utterer), B (Context), C (Source English), and J (Translated Dutch). 
                  The JSONs are rendered as searchable, filterable entries with copy functionality for each field.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">14</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">JSON Files</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">6,265</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Entries</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // This will be handled by the parent component to switch to JSON mode
                    setInputMode('excel');
                  }}
                  className="px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white text-sm font-bold border border-blue-700 dark:border-blue-600 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
                  style={{ borderRadius: '3px' }}
                >
                  Switch to Excel Mode
                </button>
                <button
                  onClick={() => window.open('/scripts/excel-to-json.js', '_blank')}
                  className="px-4 py-2 bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white text-sm font-bold border border-gray-700 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
                  style={{ borderRadius: '3px' }}
                >
                  View Processing Script
                </button>
              </div>
            </div>
          )}

          {/* Manual Input Section */}
          {inputMode === 'manual' && (
            <div className="space-y-6 animate-fade-in">
              <label className="block text-base font-black mb-4 text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                Paste Text Manually
              </label>
              <textarea
                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 font-mono text-sm focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white resize-none"
                style={{ borderRadius: '3px' }}
                placeholder="Paste your text here, one line per item..."
                onChange={handleSourceInput}
              />

              <div>
                <label className="block text-base font-black mb-4 text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                  Starting Cell
                </label>
                <input
                  type="text"
                  value={cellStart}
                  onChange={(e) => setCellStart(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                  style={{ borderRadius: '3px' }}
                  placeholder="A1"
                />
              </div>
            </div>
          )}
          
          {/* Start Button Section */}
          <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-600">
            {sourceTexts.length > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                ✓ {sourceTexts.length} items ready to translate
              </p>
            )}
            <button
              onClick={handleStartWithDataFile}
              disabled={sourceTexts.length === 0 && !selectedDataFile && !selectedExistingFile}
              className="w-full px-6 py-2.5 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 text-white dark:text-black disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 border border-gray-700 dark:border-gray-300 hover:border-gray-600 dark:hover:border-gray-400 hover:shadow-md transition-all duration-300 ease-out disabled:transform-none disabled:hover:shadow-sm font-black tracking-tight uppercase letter-spacing-wide text-sm"
              style={{ borderRadius: '3px' }}
            >
              Start Translation →
            </button>
          </div>
        </div>

        {/* Codex / Reference Data Editor */}
        <div className="mt-8 border-t border-gray-300 dark:border-gray-600 pt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCodexEditor(!showCodexEditor)}
              className="flex-1 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
              style={{ borderRadius: '3px' }}
            >
              <span className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide">
                  Codex / Reference Data
                </span>
                {totalEntries > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                    {totalEntries} entries
                  </span>
                )}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${showCodexEditor ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Refresh button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                refreshCodex();
              }}
              disabled={isLoadingCodex}
              className="h-[46px] w-[46px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '3px' }}
              title="Refresh codex"
            >
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 ${isLoadingCodex ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          {showCodexEditor && (
            <div className="mt-3 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>
              <CodexEditor onCodexUpdated={handleCodexUpdated} />
            </div>
          )}
        </div>

        {/* Style Analysis Pipeline */}
        <div className="mt-8">
          <StyleAnalysisPanel />
        </div>

        {/* Video, GitHub, Codex, and Reset Buttons */}
        <div className="mt-8 mb-4 text-center">
          <div className="flex justify-center gap-2">
            <VideoButton />
            <GitHubButton />
            <CodexButton />
            {/* Reset Button */}
            {setShowResetModal && (
              <button
                onClick={() => setShowResetModal(true)}
                className="group relative h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
                style={{ borderRadius: '3px' }}
                title="Reset to originals (nuclear reset)"
              >
                <svg className="w-4 h-4 relative z-10 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mb-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">
            Onnozelaer Marketing Works © 2025 - built with Claude Code support
          </p>

          {/* Gradient Accent Block with Playfair Display */}
          <div className="flex justify-center items-center">
            <div
              className="rounded-sm shadow-md relative cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl flex items-center justify-center"
              onMouseEnter={() => onVersionBadgeHover?.(true)}
              onMouseLeave={() => onVersionBadgeHover?.(false)}
              onClick={() => onVersionBadgeClick?.()}
              title="Click to change gradient"
              style={{
                width: '120px',
                height: '28px',
                backgroundImage: gradientColors.length > 0
                  ? `linear-gradient(270deg, ${gradientColors.join(', ')}, ${gradientColors[0]})`
                  : 'linear-gradient(270deg, #3498DB, #9B59B6, #3498DB)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 5s ease-in-out infinite',
              }}
            >
              <span
                className="text-white font-semibold tracking-wider drop-shadow-lg transition-all duration-500"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                  fontSize: '12px',
                  opacity: showVersionHash ? 1 : 0,
                  transform: showVersionHash ? 'translateY(0)' : 'translateY(5px)',
                  letterSpacing: '0.05em'
                }}
              >
                {VERSION_HASH}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard; 