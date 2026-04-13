'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import Spinner from './ui/Spinner';
import { toast } from '@/lib/toast';
import AppFooter from './AppFooter';
import ReferenceConfigPanel from './ReferenceConfigPanel';
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

  // API key
  apiKey?: string;
  hasClientApiKey?: boolean;
  onApiKeyChange?: (key: string) => void;
  onApiKeyClear?: () => void;
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
  isLoadingExcel,
  apiKey,
  hasClientApiKey,
  onApiKeyChange,
  onApiKeyClear,
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

  // Sheet preview toggle — collapsed by default
  const [showSheetPreview, setShowSheetPreview] = useState(false);
  const [refPanelExpanded, setRefPanelExpanded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Hydration-safe time-ago: only compute on client after mount
  const [timeAgoText, setTimeAgoText] = useState('');
  useEffect(() => {
    if (lastSession?.timestamp) {
      setTimeAgoText(formatTimeAgo(lastSession.timestamp));
    }
  }, [lastSession?.timestamp]);

  // Cabinet egg: Pitr — the donkeys are asleep
  useEffect(() => {
    const h = new Date().getHours();
    if (h === 0) console.log('The donkeys are asleep. Why aren\'t you?');
  }, []);

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

  // Reusable file list loader — called on mount and after downloads/resets
  const refreshFileList = React.useCallback(async () => {
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
  }, []);

  // Load existing files on component mount
  React.useEffect(() => {
    refreshFileList();
  }, [refreshFileList]);

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
    <div className={`min-h-screen bg-[#f5f4f1] dark:bg-[#121210] bg-grain relative p-4 md:p-6 flex flex-col items-center transition-colors duration-500 ${refPanelExpanded ? 'pt-8 md:pt-12 justify-start' : 'pt-[12vh] justify-start'}`}>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-700 ease-in-out ${
          excelSheets.length > 0 ? 'max-w-3xl' : 'max-w-xl'
        }`}
        style={{ animation: 'fadeIn 0.5s ease-out' }}
      >
        {/* Hero Header */}
        <div className="mb-10 flex flex-col items-center stagger-enter relative z-10">
          <img
            src="/images/asses-masses-logo.png"
            alt="Asses & Masses — lineup of pixel donkeys"
            className="h-20 md:h-28 w-auto mb-4"
            style={{ imageRendering: 'pixelated' }}
          />
          <h1 className="setup-header-title text-gray-900 dark:text-gray-100">
            AM FL TRANS
          </h1>
          <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
            English to Flemish Dutch &mdash; Asses &amp; Masses
          </p>
        </div>

        {/* Resume Card */}
        {lastSession && handleResumeSession && (
          <>
            <button
              onClick={() => handleResumeSession(lastSession)}
              className="w-full text-left px-5 py-4 mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 border-l-4 border-l-amber-400 dark:border-l-amber-500 hover:border-amber-300 dark:hover:border-amber-600 hover-lift group relative z-10"
              style={{ borderRadius: '3px' }}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">Resume</span>
                    <span className="text-[10px] text-amber-500/60 dark:text-amber-500/40">
                      {lastSession.translatedCount}/{lastSession.totalLines}
                      {timeAgoText && ` · ${timeAgoText}`}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {lastSession.fileName}
                    {lastSession.selectedSheet && <span className="text-gray-500 dark:text-gray-400"> — {lastSession.selectedSheet}</span>}
                  </span>
                </div>
                <svg className="w-5 h-5 text-amber-400 group-hover:text-amber-500 dark:text-amber-500 dark:group-hover:text-amber-400 shrink-0 ml-3 transition-all duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <div className="flex items-center gap-3 mb-4 animate-divider-fade">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">or start new</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
          </>
        )}

        {/* File Selection */}
        <div className="space-y-3 relative z-10">
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
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
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
            className={`flex items-center justify-center gap-2 py-3 upload-zone cursor-pointer hover:scale-[1.005] active:scale-[0.995] relative z-10 ${isDragOver ? 'drag-over' : ''}`}
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

        </div>

        {/* Progressive disclosure: Language → Sheet → Preview → Start */}
        {fileType === 'excel' && excelSheets.length > 0 && (
          <div className="mt-4 space-y-2 stagger-enter relative z-10">
            <div className="zone-separator" />
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
            <SheetSelector
              sheets={excelSheets}
              selectedSheet={selectedSheet}
              onSelectSheet={setSelectedSheet}
              workbookData={workbookData}
              startRow={startRow}
              translationColumnLetter={selectedLanguage?.column}
            />

            {/* Sheet preview — toggleable */}
            {selectedSheet && selectedLanguage && (
              <>
                <button
                  onClick={() => setShowSheetPreview(!showSheetPreview)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-1"
                >
                  <svg
                    className={`w-3 h-3 transform transition-transform duration-200 ${showSheetPreview ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Preview</span>
                </button>
                {showSheetPreview && (
                  <SheetPreview
                    workbook={workbookData}
                    sheetName={selectedSheet}
                    sourceColumn={sourceColumn}
                    targetColumn={selectedLanguage.column}
                    startRow={startRow}
                    languageCode={selectedLanguage.code}
                  />
                )}
              </>
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
        <div className="zone-separator" />
        <div className="relative z-10">
          <button
            onClick={handleStartWithDataFile}
            disabled={sourceTexts.length === 0 && !selectedDataFile && !selectedExistingFile}
            className={`w-full px-4 py-3.5 border transition-all duration-300 disabled:cursor-not-allowed font-semibold text-base press-effect ${
              sourceTexts.length > 0
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-lg hover:-translate-y-px start-btn-ready'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 opacity-60'
            }`}
            style={{ borderRadius: '3px' }}
          >
            {sourceTexts.length > 0 ? `Start Translation — ${sourceTexts.length} lines${selectedLanguage ? ` (${selectedLanguage.name})` : ''}` : 'Start Translation'}
          </button>
        </div>

        {/* Reference & Config — single tabbed panel */}
        <ReferenceConfigPanel
          totalEntries={totalEntries}
          isLoadingCodex={isLoadingCodex}
          refreshCodex={refreshCodex}
          onCodexUpdated={handleCodexUpdated}
          fileType={fileType}
          onFileTypeChange={handleFileTypeChange}
          inputMode={inputMode}
          setInputMode={setInputMode}
          setShowResetModal={setShowResetModal}
          onFilesChanged={refreshFileList}
          onExpandChange={setRefPanelExpanded}
          apiKey={apiKey}
          hasClientApiKey={hasClientApiKey}
          onApiKeyChange={onApiKeyChange}
          onApiKeyClear={onApiKeyClear}
        />

      </div>

      {/* Footer — flows naturally at bottom of content */}
      <div className="w-full mt-auto pt-8 bg-transparent relative z-10">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <AppFooter
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            gradientColors={gradientColors}
            showVersionHash={showVersionHash}
            VERSION_HASH={VERSION_HASH}
            onVersionBadgeHover={onVersionBadgeHover}
            onVersionBadgeClick={onVersionBadgeClick}
            variant="setup"
          />
        </div>
      </div>
    </div>
  );
};

export default SetupWizard; 