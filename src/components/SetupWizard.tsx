'use client';

import React, { useRef } from 'react';
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
  
  // Dark mode state
  darkMode: boolean;
  toggleDarkMode: () => void;
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
  handleFileUpload,
  handleSourceInput,
  handleStart,
  handleExistingFileLoad,
  gradientColors,
  isTranslating,
  showVersionHash,
  VERSION_HASH,
  darkMode,
  toggleDarkMode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingFiles, setExistingFiles] = React.useState<any[]>([]);
  const [loadingExistingFiles, setLoadingExistingFiles] = React.useState(false);
  const [selectedExistingFile, setSelectedExistingFile] = React.useState('');
  const [localeColumns, setLocaleColumns] = React.useState<{column: string, locale: string}[]>([]);

  // Load existing files on component mount
  React.useEffect(() => {
    const loadExistingFiles = async () => {
      setLoadingExistingFiles(true);
      try {
        const response = await fetch('/api/xlsx-files');
        if (response.ok) {
          const data = await response.json();
          setExistingFiles(data.files || []);
        }
      } catch (error) {
        console.error('Error loading existing files:', error);
      } finally {
        setLoadingExistingFiles(false);
      }
    };

    loadExistingFiles();
  }, []);

  const handleExistingFileSelect = (fileName: string) => {
    setSelectedExistingFile(fileName);
    if (handleExistingFileLoad) {
      handleExistingFileLoad(fileName);
    }
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
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
        style={{ borderRadius: '3px' }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="max-w-7xl w-full space-y-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 tracking-tighter text-gray-900 dark:text-gray-100">Translation Helper</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Choose your input method below</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-8 space-y-8 shadow-sm transition-all duration-300">
          {/* Input Mode Toggle - Hidden but preserved */}
          <div className="hidden justify-center mb-8">
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
          <div className="space-y-6 animate-fade-in">
            
            <div className="grid grid-cols-2 gap-6">
              {/* Upload Options Panel */}
              <div className={`transition-all duration-500 ease-in-out ${excelSheets.length > 0 ? 'col-span-1' : 'col-span-2'}`}>
                <div className="space-y-6 mx-auto" style={{ maxWidth: excelSheets.length > 0 ? 'none' : '600px' }}>
                  {/* File Upload Option */}
                  <div className="relative">
                    <label className="block text-sm font-bold mb-3 text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
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
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                          const file = files[0];
                          if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                              file.type === 'application/vnd.ms-excel') {
                            // Create a synthetic event for the file upload handler
                            const syntheticEvent = {
                              target: { files: [file] }
                            } as unknown as React.ChangeEvent<HTMLInputElement>;
                            handleFileUpload(syntheticEvent);
                          }
                        }
                      }}
                      className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800 transition-all duration-200 cursor-pointer text-center"
                      style={{ borderRadius: '3px' }}
                    >
                      <div className="space-y-3">
                        <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                          <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Drop Excel file here or click to browse
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Supports .xlsx and .xls files
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="px-3 text-sm text-gray-500 dark:text-gray-400 font-medium">OR</span>
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                  </div>

                  {/* Existing Files Option */}
                  <div className="relative">
                    <label className="block text-sm font-bold mb-3 text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                      Load Existing File
                    </label>
                    {loadingExistingFiles ? (
                      <div className="w-full p-6 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center" style={{ borderRadius: '3px' }}>
                        <p className="text-gray-500 dark:text-gray-400">Loading available files...</p>
                      </div>
                    ) : existingFiles.length > 0 ? (
                      <select
                        value={selectedExistingFile}
                        onChange={(e) => handleExistingFileSelect(e.target.value)}
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-base"
                        style={{ borderRadius: '3px' }}
                      >
                        <option value="">Select an existing Excel file...</option>
                        {existingFiles.map(file => (
                          <option key={file.fileName} value={file.fileName}>
                            {file.fileName} ({file.sheets?.length || 0} sheets)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full p-6 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center" style={{ borderRadius: '3px' }}>
                        <p className="text-gray-500 dark:text-gray-400">No existing files found in /excels folder</p>
                      </div>
                    )}
                  </div>

                  {excelSheets.length > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">✓ File loaded successfully</p>
                  )}
                </div>
              </div>

              {/* Configuration Panel - Slides in smoothly when file is loaded */}
              <div className={`col-span-1 transition-all duration-500 ease-in-out ${
                excelSheets.length > 0 
                  ? 'opacity-100 transform translate-x-0' 
                  : 'opacity-0 transform translate-x-8 pointer-events-none'
              }`}>
                {excelSheets.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 border border-black p-6 space-y-4 h-full">
                    {/* Sheet Settings Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                        Sheet Settings
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold mb-2 text-gray-900 dark:text-gray-100">Sheet</label>
                        <select
                          value={selectedSheet}
                          onChange={(e) => setSelectedSheet(e.target.value)}
                          className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white"
                        >
                          {excelSheets.map(sheet => (
                            <option key={sheet} value={sheet}>{sheet}</option>
                          ))}
                        </select>
                      </div>
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
                )}
              </div>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200"
                  style={{ borderRadius: '3px' }}
                >
                  Switch to Excel Mode
                </button>
                <button
                  onClick={() => window.open('/scripts/excel-to-json.js', '_blank')}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors duration-200"
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
                className="w-full h-48 p-4 border border-black dark:border-gray-600 font-mono text-sm focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white resize-none"
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
                  className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white"
                  placeholder="A1"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-4 pt-4 border-t border-black">
            {sourceTexts.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                ✓ {sourceTexts.length} items ready to translate
              </p>
            )}
            <button
              onClick={handleStart}
              disabled={sourceTexts.length === 0}
              className="w-full px-8 py-3 bg-black dark:bg-white text-white dark:text-black disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm font-black tracking-tight uppercase letter-spacing-wide"
              style={{ borderRadius: '3px' }}
            >
              Start Translation →
            </button>
          </div>
        </div>

        {/* Video, GitHub, and Codex Buttons */}
        <div className="mt-20 mb-6 text-center">
          <div className="flex justify-center gap-4">
            <VideoButton className="mb-4" />
            <GitHubButton className="mb-4" />
            <CodexButton className="mb-4" />
          </div>
        </div>

        {/* Footer */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            Onnozelaer Marketing Works © 2025 - made with Generative AI
          </p>

          {/* Gradient Accent Block (Halved) */}
          <div className="flex justify-center items-center">
            <div
              className="shadow-lg relative cursor-pointer"
              onMouseEnter={() => {}} // Will be handled by parent
              onMouseLeave={() => {}} // Will be handled by parent
              onClick={() => {}} // Will be handled by parent
              title="Click to change gradient"
              style={{
                width: '125px',  // Half of 250px
                height: '25px',   // Half of 50px
                backgroundImage: gradientColors.length > 0
                  ? `linear-gradient(270deg, ${gradientColors.join(', ')}, ${gradientColors[0]})`
                  : 'linear-gradient(270deg, #3498DB, #9B59B6, #3498DB)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 5s ease-in-out infinite'
              }}
            >
              {showVersionHash && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-lg font-black tracking-tight uppercase letter-spacing-wide">
                    {VERSION_HASH}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard; 