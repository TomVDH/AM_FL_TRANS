'use client';

import React, { useRef } from 'react';

interface SetupWizardProps {
  // Input mode state
  inputMode: 'excel' | 'manual';
  setInputMode: (mode: 'excel' | 'manual') => void;
  
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
  
  // Event handlers
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSourceInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleStart: () => void;
  
  // Animation state
  gradientColors: string[];
  isTranslating: boolean;
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
  handleFileUpload,
  handleSourceInput,
  handleStart,
  gradientColors,
  isTranslating,
  showVersionHash,
  VERSION_HASH,
  darkMode,
  toggleDarkMode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="max-w-2xl w-full space-y-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 tracking-tighter text-gray-900 dark:text-gray-100">Translation Helper</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Choose your input method below</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-8 space-y-8 shadow-sm transition-all duration-300">
          {/* Input Mode Toggle */}
          <div className="flex justify-center mb-8">
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
          {inputMode === 'excel' && (
            <div className="space-y-6 animate-fade-in">
              <label className="block text-base font-black mb-4 text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                Upload Excel File
              </label>
              <div className="flex gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-black dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm font-black tracking-tight uppercase letter-spacing-wide"
                  style={{ borderRadius: '3px' }}
                >
                  Choose Excel File
                </button>
                {excelSheets.length > 0 && (
                  <p className="self-center text-sm text-green-600">✓ File loaded</p>
                )}
              </div>
              
              {excelSheets.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 border border-black p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                    <div>
                      <label className="block text-xs font-bold mb-2 text-gray-900 dark:text-gray-100">Utterer Column</label>
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
                  {sourceTexts.length > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 border border-green-600 dark:border-green-700">
                      ✓ Found {sourceTexts.length} items (speakers from column {uttererColumn}, text from column {sourceColumn}
                      {useReferenceColumn ? `, references from column ${referenceColumn}` : ''})
                    </p>
                  )}
                </div>
              )}
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
          
          <div className="flex justify-between items-center pt-4 border-t border-black">
            {sourceTexts.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ✓ {sourceTexts.length} items ready to translate
              </p>
            )}
            <button
              onClick={handleStart}
              disabled={sourceTexts.length === 0}
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm font-black tracking-tight uppercase letter-spacing-wide"
              style={{ borderRadius: '3px' }}
            >
              Start Translation →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 mb-8 text-center">
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
                animation: isTranslating ? 'gradientShiftFast 1.5s ease-in-out infinite' : 'gradientShift 5s ease-in-out infinite'
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