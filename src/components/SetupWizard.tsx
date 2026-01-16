'use client';

import React, { useRef } from 'react';
import Spinner from './ui/Spinner';
import { toast } from 'sonner';
import VideoButton from './VideoButton';
import GitHubButton from './GitHubButton';
import CodexButton from './CodexButton';

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
          excelSheets.length > 0 ? 'max-w-4xl' : 'max-w-2xl'
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
          {/* Dutch Translation Column Reminder */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium" style={{ borderRadius: '3px' }}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Dutch translations → Column J (hardcoded)</span>
          </div>
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

          {/* Excel Upload Section */}
          <div className="space-y-4 animate-fade-in">
              {/* Upload Options Panel */}
              <div className="transition-all duration-500 ease-in-out">
                <div className="space-y-4 mx-auto">
                  {/* File Upload Option */}
                  <div className="relative">
                    <label className="block text-xs font-bold mb-2 text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                      Upload New File
                    </label>
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
                        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                        e.currentTarget.setAttribute('aria-dropeffect', 'copy');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                        e.currentTarget.setAttribute('aria-dropeffect', 'none');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                        e.currentTarget.setAttribute('aria-dropeffect', 'none');
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                          const file = files[0];

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

                          // File is valid, proceed with upload
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
                      aria-label="Upload Excel file: Click to browse or drag and drop .xlsx or .xls file here"
                      className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800 transition-all duration-200 cursor-pointer text-center"
                      style={{ borderRadius: '3px' }}
                    >
                      {isLoadingExcel ? (
                        <div className="space-y-2">
                          <Spinner size="lg" label="Processing Excel file..." />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              Drop Excel file here or click to browse
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Supports .xlsx and .xls files
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="px-2 text-xs text-gray-500 dark:text-gray-400 font-medium">OR</span>
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                  </div>

                  {/* Unified File Selector */}
                  <div className="relative">
                    <label className="block text-xs font-bold mb-2 text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                      Load Existing File
                    </label>

                    {/* File Type Toggle */}
                    <div className="flex gap-1.5 mb-3" role="group" aria-label="File type selection">
                      <button
                        onClick={() => handleFileTypeChange('excel')}
                        aria-label="Select Excel files"
                        aria-pressed={fileType === 'excel'}
                        className={`flex-1 px-2 py-1.5 text-xs font-bold tracking-tight uppercase transition-all duration-300 ease-out ${
                          fileType === 'excel'
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 text-white dark:text-black border border-gray-700 dark:border-gray-300'
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                        }`}
                        style={{ borderRadius: '3px' }}
                      >
                        Excel
                      </button>
                      <button
                        onClick={() => handleFileTypeChange('json')}
                        aria-label="Select JSON files"
                        aria-pressed={fileType === 'json'}
                        className={`flex-1 px-2 py-1.5 text-xs font-bold tracking-tight uppercase transition-all duration-300 ease-out ${
                          fileType === 'json'
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 text-white dark:text-black border border-gray-700 dark:border-gray-300'
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                        }`}
                        style={{ borderRadius: '3px' }}
                      >
                        JSON
                      </button>
                      <button
                        onClick={() => handleFileTypeChange('csv')}
                        aria-label="Select CSV files"
                        aria-pressed={fileType === 'csv'}
                        className={`flex-1 px-2 py-1.5 text-xs font-bold tracking-tight uppercase transition-all duration-300 ease-out ${
                          fileType === 'csv'
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 text-white dark:text-black border border-gray-700 dark:border-gray-300'
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                        }`}
                        style={{ borderRadius: '3px' }}
                      >
                        CSV
                      </button>
                    </div>

                    {/* Excel File Selector */}
                    {fileType === 'excel' && (
                      <>
                        {loadingExistingFiles ? (
                          <div className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center" style={{ borderRadius: '3px' }}>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading files...</p>
                          </div>
                        ) : existingFiles.length > 0 ? (
                          <select
                            value={selectedExistingFile}
                            onChange={(e) => handleExistingFileSelect(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm"
                            style={{ borderRadius: '3px' }}
                          >
                            <option value="">Select an Excel file...</option>
                            {existingFiles.map(file => (
                              <option key={file.fileName} value={file.fileName}>
                                {file.fileName} ({file.sheets?.length || 0} sheets)
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center" style={{ borderRadius: '3px' }}>
                            <p className="text-sm text-gray-500 dark:text-gray-400">No Excel files found in /excels folder</p>
                          </div>
                        )}
                        {selectedExistingFile && excelSheets.length > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 font-medium">✓ {selectedExistingFile} loaded</p>
                        )}
                      </>
                    )}

                    {/* JSON/CSV File Selector */}
                    {(fileType === 'json' || fileType === 'csv') && (
                      <>
                        {loadingDataFiles ? (
                          <div className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center" style={{ borderRadius: '3px' }}>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading files...</p>
                          </div>
                        ) : (fileType === 'json' ? jsonFiles : csvFiles).length > 0 ? (
                          <select
                            value={selectedDataFile}
                            onChange={(e) => {
                              console.log(`[SetupWizard] ${fileType.toUpperCase()} file selected:`, e.target.value);
                              setSelectedDataFile(e.target.value);
                            }}
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm"
                            style={{ borderRadius: '3px' }}
                          >
                            <option value="">Select a {fileType.toUpperCase()} file...</option>
                            {(fileType === 'json' ? jsonFiles : csvFiles).map(file => (
                              <option key={file} value={file}>
                                {file}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center" style={{ borderRadius: '3px' }}>
                            <p className="text-sm text-gray-500 dark:text-gray-400">No {fileType.toUpperCase()} files found in /data/{fileType} folder</p>
                          </div>
                        )}
                        {selectedDataFile && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 font-medium">
                            ✓ {selectedDataFile} selected
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Sheet Settings - Below file picker when Excel selected */}
                {fileType === 'excel' && excelSheets.length > 0 && (
                  <div className="mt-4 transition-all duration-500 ease-in-out opacity-100 transform translate-y-0">
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-5 space-y-4 shadow-sm" style={{ borderRadius: '3px' }}>
                      {/* Sheet Settings Header with icon */}
                      <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">
                          Configure Sheet
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold mb-2 text-gray-900 dark:text-gray-100 tracking-tight uppercase">
                            Select Sheet
                          </label>
                          <select
                            value={selectedSheet}
                            onChange={(e) => setSelectedSheet(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm font-medium"
                            style={{ borderRadius: '3px' }}
                          >
                            {excelSheets.map(sheet => (
                              <option key={sheet} value={sheet}>{sheet}</option>
                            ))}
                          </select>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {excelSheets.length} sheet{excelSheets.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      {/* ADVANCED INDEX SETTINGS - TEMPORARILY HIDDEN
                       * These settings (Key Column, Source Column, Start Row) are hidden
                       * to simplify the UI. The defaults work for the standard Excel format:
                       * - Key Column (Utterer): A
                       * - Source Column (English): C
                       * - Dutch Column: J (hardcoded)
                       * - Start Row: 2 (after header)
                       *
                       * Reference Column UI was already disabled for MVP.
                       * To re-enable these settings, uncomment the JSX blocks below.
                       */}
                      {/* Reference Column UI - DISABLED FOR MVP
                      <div className="col-span-2">
                        <div className="flex items-center space-x-3 mb-3">
                          <input
                            type="checkbox"
                            id="useReference"
                            checked={useReferenceColumn}
                            onChange={(e) => setUseReferenceColumn(e.target.checked)}
                            className="w-4 h-4 text-black border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:ring-offset-0"
                          />
                          <label htmlFor="useReference" className="text-xs font-bold text-gray-900 dark:text-gray-100">
                            Use Reference Column (for verification/correction)
                          </label>
                        </div>
                        {useReferenceColumn && (
                          <input
                            type="text"
                            value={referenceColumn}
                            onChange={(e) => setReferenceColumn(e.target.value.toUpperCase())}
                            className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white"
                            placeholder="D"
                            maxLength={1}
                          />
                        )}
                      </div>
                      */}
                      {/* Key Column, Source Column, Start Row - TEMPORARILY HIDDEN
                      <div>
                        <label className="block text-xs font-bold mb-2 text-gray-900 dark:text-gray-100">Key Column</label>
                        <input
                          type="text"
                          value={uttererColumn}
                          onChange={(e) => setUttererColumn(e.target.value.toUpperCase())}
                          className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white"
                          placeholder="A"
                          maxLength={1}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-gray-900 dark:text-gray-100">Source Column</label>
                        <input
                          type="text"
                          value={sourceColumn}
                          onChange={(e) => setSourceColumn(e.target.value.toUpperCase())}
                          className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white"
                          placeholder="C"
                          maxLength={1}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold mb-2 text-gray-900 dark:text-gray-100">Start Row</label>
                        <input
                          type="number"
                          value={startRow}
                          onChange={(e) => setStartRow(parseInt(e.target.value) || 1)}
                          className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white"
                          min="1"
                        />
                      </div>
                      */}
                      </div>

                      {/* Detected Locale Columns */}
                      {localeColumns.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded">
                          <label className="block text-xs font-bold mb-2 text-blue-900 dark:text-blue-300">
                            Detected Locale Columns
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {localeColumns.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 rounded border border-blue-300 dark:border-blue-600"
                              >
                                Column {item.column}: {item.locale}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {sourceTexts.length > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 border border-green-600 dark:border-green-700">
                          ✓ Found {sourceTexts.length} items (speakers from column {uttererColumn}, text from column {sourceColumn})
                        </p>
                      )}
                    </div>
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

        {/* Video, GitHub, Codex, and Reset Buttons */}
        <div className="mt-10 mb-4 text-center">
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