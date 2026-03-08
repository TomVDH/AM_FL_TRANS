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
  // Session resume
  lastSession?: any;
  handleResumeSession?: (session: any) => void;

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
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const SetupWizard: React.FC<SetupWizardProps> = ({
  lastSession,
  handleResumeSession,
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

  // Codex editor state - collapsed by default for cleaner setup
  const [showCodexEditor, setShowCodexEditor] = useState(false);
  // Advanced section - collapsed by default
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 flex items-start justify-center transition-colors duration-300">

      {/* Main Container */}
      <div
        className={`w-full mt-8 md:mt-16 transition-all duration-500 ease-in-out ${
          excelSheets.length > 0 ? 'max-w-3xl' : 'max-w-xl'
        }`}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">AM FL TRANS</h1>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-0.5">asses.masses — Translation Workbench</p>
        </div>

        {/* Resume Card */}
        {lastSession && handleResumeSession && (
          <>
            <button
              onClick={() => handleResumeSession(lastSession)}
              className="w-full text-left px-4 py-3.5 mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all duration-150 group"
              style={{ borderRadius: '3px' }}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">Resume</span>
                    <span className="text-[10px] text-amber-500/60 dark:text-amber-500/40">
                      {lastSession.translatedCount}/{lastSession.totalLines}
                      {lastSession.timestamp && ` · ${formatTimeAgo(lastSession.timestamp)}`}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {lastSession.fileName}
                    {lastSession.selectedSheet && <span className="text-gray-500 dark:text-gray-400"> — {lastSession.selectedSheet}</span>}
                  </span>
                </div>
                <svg className="w-5 h-5 text-amber-400 group-hover:text-amber-500 dark:text-amber-500 dark:group-hover:text-amber-400 shrink-0 ml-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">or start new</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
          </>
        )}

        {/* File Selection */}
        <div className="space-y-3">
          <div>
            {fileType === 'excel' && (
              <>
                {loadingExistingFiles ? (
                  <div className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400">Loading files...</div>
                ) : existingFiles.length > 0 ? (
                  <select
                    value={selectedExistingFile}
                    onChange={(e) => handleExistingFileSelect(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500/10 transition-all"
                    style={{ borderRadius: '3px' }}
                  >
                    <option value="">Select file from server...</option>
                    {existingFiles.map(file => (
                      <option key={file.fileName} value={file.fileName}>
                        {file.fileName} ({file.sheets?.length || 0} sheets)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400">No files in /excels</div>
                )}
              </>
            )}
            {(fileType === 'json' || fileType === 'csv') && (
              <>
                {loadingDataFiles ? (
                  <div className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400">Loading files...</div>
                ) : (fileType === 'json' ? jsonFiles : csvFiles).length > 0 ? (
                  <select
                    value={selectedDataFile}
                    onChange={(e) => {
                      console.log(`[SetupWizard] ${fileType.toUpperCase()} file selected:`, e.target.value);
                      setSelectedDataFile(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500/10 transition-all"
                    style={{ borderRadius: '3px' }}
                  >
                    <option value="">Select file from server...</option>
                    {(fileType === 'json' ? jsonFiles : csvFiles).map(file => (
                      <option key={file} value={file}>{file}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400">No files in /data/{fileType}</div>
                )}
              </>
            )}
          </div>

          {/* Upload drop zone — compact */}
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
            className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 bg-transparent transition-all duration-200 cursor-pointer"
            style={{ borderRadius: '3px' }}
          >
            {isLoadingExcel ? (
              <Spinner size="sm" label="Processing..." />
            ) : (
              <>
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Drop .xlsx or click to upload</span>
              </>
            )}
          </div>

          {/* Selection confirmation */}
          {((fileType === 'excel' && selectedExistingFile && excelSheets.length > 0) ||
            ((fileType === 'json' || fileType === 'csv') && selectedDataFile)) && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                {fileType === 'excel' ? selectedExistingFile : selectedDataFile} loaded
              </span>
            </div>
          )}
        </div>

        {/* Progressive disclosure: Language → Sheet → Preview → Start */}
        {fileType === 'excel' && excelSheets.length > 0 && (
          <div className="mt-4 space-y-4">
            <LanguageSelector
              languages={detectedLanguages}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={onSelectLanguage}
              disabled={isLoadingExcel}
            />

            {selectedLanguage && (
              <ReferenceDataInfo
                selectedLanguage={selectedLanguage.code}
                selectedLanguageName={selectedLanguage.name}
                hasReferenceData={hasLanguage(selectedLanguage.code)}
                isLoading={isLoadingCodex}
                totalEntries={totalEntries}
                onLearnMore={() => window.open('/docs/reference-data-guide.md', '_blank')}
              />
            )}

            {/* Sheet selector */}
            <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3" style={{ borderRadius: '3px' }}>
              <SheetSelector
                sheets={excelSheets}
                selectedSheet={selectedSheet}
                onSelectSheet={setSelectedSheet}
                workbookData={workbookData}
                startRow={startRow}
              />

              {selectedSheet && selectedLanguage && (
                <div className="mt-3">
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

              {sourceTexts.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {sourceTexts.length} items ready
                  </span>
                </div>
              )}
            </div>

            {/* Translation Target Indicator */}
            {selectedLanguage && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400">
                <span>Target: Column {selectedLanguage.column} ({selectedLanguage.name})</span>
              </div>
            )}
          </div>
        )}

        {/* Hidden input mode toggle (preserved for logic) */}
        <div className="hidden">
          <button onClick={() => setInputMode('excel')}>Excel Upload</button>
          <button onClick={() => setInputMode('embedded-json')}>Embedded JSON</button>
          <button onClick={() => setInputMode('manual')}>Manual Input</button>
        </div>

        {/* Embedded JSON Section */}
        {inputMode === 'embedded-json' && (
          <div className="mt-4 space-y-4">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Embedded JSON Data</p>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 leading-relaxed" style={{ borderRadius: '3px' }}>
              Sources JSON data from <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-[11px]">data/json/</code> folder.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setInputMode('excel')}
                className="px-3 py-1.5 text-xs font-medium bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-300 hover:opacity-90 transition-opacity"
                style={{ borderRadius: '3px' }}
              >
                Switch to Excel
              </button>
            </div>
          </div>
        )}

        {/* Manual Input Section */}
        {inputMode === 'manual' && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Paste Text Manually</p>
            <textarea
              className="w-full h-36 p-3 border border-gray-300 dark:border-gray-600 font-mono text-sm focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              style={{ borderRadius: '3px' }}
              placeholder="Paste your text here, one line per item..."
              onChange={handleSourceInput}
            />
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Starting Cell</label>
              <input
                type="text"
                value={cellStart}
                onChange={(e) => setCellStart(e.target.value)}
                className="w-32 px-2.5 py-1.5 text-sm border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                style={{ borderRadius: '3px' }}
                placeholder="A1"
              />
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="mt-6">
          <button
            onClick={handleStartWithDataFile}
            disabled={sourceTexts.length === 0 && !selectedDataFile && !selectedExistingFile}
            className={`w-full px-4 py-3 border transition-all duration-200 disabled:cursor-not-allowed font-semibold text-sm ${
              sourceTexts.length > 0
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'
            }`}
            style={{ borderRadius: '3px' }}
          >
            {sourceTexts.length > 0 ? `Start Translation — ${sourceTexts.length} lines` : 'Start Translation'}
          </button>
        </div>

        {/* Codex — collapsed accordion */}
        <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCodexEditor(!showCodexEditor)}
              className="flex-1 flex items-center justify-between py-1.5 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-sm font-bold tracking-tight">Codex</span>
                {totalEntries > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                    {totalEntries}
                  </span>
                )}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${showCodexEditor ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                refreshCodex();
              }}
              disabled={isLoadingCodex}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              title="Refresh codex"
            >
              <svg
                className={`w-3.5 h-3.5 ${isLoadingCodex ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          {showCodexEditor && (
            <div className="mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" style={{ borderRadius: '3px' }}>
              <CodexEditor onCodexUpdated={handleCodexUpdated} />
            </div>
          )}
        </div>

        {/* Advanced — toggle matching Codex style */}
        <div className="mt-5">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex-1 w-full flex items-center justify-between py-1.5 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <span className="text-sm font-bold tracking-tight">Advanced</span>
            <svg
              className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAdvanced && (
            <div className="mt-2 space-y-4">
              {/* File type selector */}
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">File Type</label>
                <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-0.5 inline-flex" style={{ borderRadius: '3px' }}>
                  {['excel', 'json', 'csv'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFileTypeChange(type as 'excel' | 'json' | 'csv')}
                      aria-pressed={fileType === type}
                      className={`px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-200 ${
                        fileType === type
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                      style={{ borderRadius: '2px' }}
                    >
                      {type === 'excel' ? 'XLS' : type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input mode selector */}
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Input Mode</label>
                <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-0.5 inline-flex" style={{ borderRadius: '3px' }}>
                  {['excel', 'embedded-json', 'manual'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setInputMode(mode as any)}
                      className={`px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-200 ${
                        inputMode === mode
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                      style={{ borderRadius: '2px' }}
                    >
                      {mode === 'embedded-json' ? 'JSON' : mode === 'excel' ? 'Excel' : 'Manual'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Analysis */}
              <StyleAnalysisPanel />

              {/* Quick links + Reset */}
              <div className="flex items-center gap-2">
                <VideoButton />
                <GitHubButton />
                <CodexButton />
                <div className="flex-1" />
                {setShowResetModal && (
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="group h-8 px-2.5 flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 transition-colors"
                    style={{ borderRadius: '3px' }}
                    title="Reset to originals"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Onnozelaer Marketing Works © 2025
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                console.log('[SetupWizard] Dark mode button clicked!');
                toggleDarkMode();
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <div
              className="rounded-sm relative cursor-pointer overflow-hidden flex items-center justify-center"
              onMouseEnter={() => onVersionBadgeHover?.(true)}
              onMouseLeave={() => onVersionBadgeHover?.(false)}
              onClick={() => onVersionBadgeClick?.()}
              title="Click to change gradient"
              style={{
                width: '80px',
                height: '20px',
                backgroundImage: gradientColors.length > 0
                  ? `linear-gradient(270deg, ${gradientColors.join(', ')}, ${gradientColors[0]})`
                  : 'linear-gradient(270deg, #6b7280, #9ca3af, #6b7280)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 5s ease-in-out infinite',
              }}
            >
              <span
                className="text-white font-medium tracking-wider drop-shadow-sm transition-all duration-500"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  fontSize: '9px',
                  opacity: showVersionHash ? 1 : 0,
                  transform: showVersionHash ? 'translateY(0)' : 'translateY(3px)',
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