'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

interface TranslationHelperProps {}

const TranslationHelper: React.FC<TranslationHelperProps> = () => {
  const [sourceTexts, setSourceTexts] = useState<string[]>([]);
  const [utterers, setUtterers] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState('');
  const [cellStart, setCellStart] = useState('A1');
  const [isStarted, setIsStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [excelSheets, setExcelSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [sourceColumn, setSourceColumn] = useState('C');
  const [uttererColumn, setUttererColumn] = useState('A');
  const [referenceColumn, setReferenceColumn] = useState('D');
  const [useReferenceColumn, setUseReferenceColumn] = useState(false);
  const [startRow, setStartRow] = useState(3);
  const [inputMode, setInputMode] = useState<'excel' | 'manual'>('excel');
  const [workbookData, setWorkbookData] = useState<XLSX.WorkBook | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const progress = sourceTexts.length > 0 ? ((currentIndex) / sourceTexts.length) * 100 : 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        console.error('Error reading Excel file:', error);
        alert('Error reading Excel file. Please ensure it\'s a valid Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Effect to reprocess when settings change
  useEffect(() => {
    if (workbookData && selectedSheet) {
      const worksheet = workbookData.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      // Extract column data
      const sourceColIndex = sourceColumn.charCodeAt(0) - 65;
      const uttererColIndex = uttererColumn.charCodeAt(0) - 65;
      const referenceColIndex = referenceColumn.charCodeAt(0) - 65;
      const extractedTexts: string[] = [];
      const extractedUtterers: string[] = [];
      const extractedReferences: string[] = [];
      
      for (let i = startRow - 1; i < jsonData.length; i++) {
        const dataRow = jsonData[i];
        if (dataRow && dataRow[sourceColIndex] && dataRow[sourceColIndex].toString().trim()) {
          extractedTexts.push(dataRow[sourceColIndex].toString().trim());
          // Get utterer from specified column, or empty string if not found
          const utterer = dataRow[uttererColIndex] ? dataRow[uttererColIndex].toString().trim() : '';
          extractedUtterers.push(utterer);
          // Get reference translation if using reference column
          const reference = (useReferenceColumn && dataRow[referenceColIndex]) ? dataRow[referenceColIndex].toString().trim() : '';
          extractedReferences.push(reference);
        }
      }
      
      setSourceTexts(extractedTexts);
      setUtterers(extractedUtterers);
      // If using reference column, populate translations with reference data, otherwise empty
      setTranslations(useReferenceColumn ? [...extractedReferences] : new Array(extractedTexts.length).fill(''));
    }
      }, [workbookData, selectedSheet, sourceColumn, uttererColumn, referenceColumn, useReferenceColumn, startRow]);

  const handleSourceInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    setSourceTexts(lines);
    setUtterers(new Array(lines.length).fill(''));
    setTranslations(new Array(lines.length).fill(''));
    setCurrentIndex(0);
    setIsStarted(false);
    // Clear Excel data when using manual input
    setWorkbookData(null);
    setExcelSheets([]);
    setSelectedSheet('');
    setUseReferenceColumn(false);
    setInputMode('manual');
  };

      const handleStart = () => {
      if (sourceTexts.length > 0) {
        setIsStarted(true);
        // If not using reference column, ensure current translation starts empty
        if (!useReferenceColumn) {
          setCurrentTranslation('');
        } else {
          // If using reference column, start with the reference translation
          setCurrentTranslation(translations[0] || '');
        }
      }
    };

  const handleBackToSetup = () => {
    setIsStarted(false);
    setCurrentIndex(0);
    setCurrentTranslation('');
    // Preserve utterers and translations when going back
  };

  const handleSubmit = () => {
    const newTranslations = [...translations];
    newTranslations[currentIndex] = currentTranslation;
    setTranslations(newTranslations);
    
    if (currentIndex < sourceTexts.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setCurrentTranslation(useReferenceColumn ? translations[currentIndex + 1] || '' : '');
        setIsAnimating(false);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setCurrentTranslation(translations[currentIndex - 1] || '');
        setIsAnimating(false);
      }, 200);
    }
  };

  const copyToClipboard = () => {
    // Copy just the translations, without row numbers or utterers
    const text = translations.join('\n');
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const getCellLocation = (index: number) => {
    if (excelSheets.length > 0) {
      // For Excel files, use row numbers
      return `Row ${startRow + index}`;
    }
    // For manual input, use cell notation
    const match = cellStart.match(/([A-Z]+)(\d+)/);
    if (match) {
      const col = match[1];
      const row = parseInt(match[2]);
      return `${col}${row + index}`;
    }
    return cellStart;
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black mb-4 tracking-tighter bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Translation Helper</h1>
            <p className="text-gray-600 text-lg font-medium">Choose your input method below</p>
          </div>
          
          <div className="bg-white border border-black p-8 space-y-8 shadow-sm">
            {/* Input Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 border border-black p-1 flex">
                                  <button
                    onClick={() => setInputMode('excel')}
                    className={`px-6 py-2 font-black tracking-tight uppercase letter-spacing-wide transition-all duration-200 ${
                      inputMode === 'excel'
                        ? 'bg-black text-white'
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ borderRadius: '3px' }}
                  >
                    Excel Upload
                  </button>
                                  <button
                    onClick={() => setInputMode('manual')}
                    className={`px-6 py-2 font-black tracking-tight uppercase letter-spacing-wide transition-all duration-200 ${
                      inputMode === 'manual'
                        ? 'bg-black text-white'
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ borderRadius: '3px' }}
                  >
                    Manual Input
                  </button>
              </div>
            </div>

            {/* Excel Upload Section */}
            {inputMode === 'excel' && (
              <div className="space-y-6">
                <label className="block text-base font-black mb-4 text-gray-900 tracking-tight uppercase letter-spacing-wide">
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
                    className="px-6 py-3 border border-black font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
                    style={{ borderRadius: '3px' }}
                  >
                    Choose Excel File
                  </button>
                  {excelSheets.length > 0 && (
                    <p className="self-center text-sm text-green-600 font-medium">File loaded</p>
                  )}
                </div>
                
                {excelSheets.length > 0 && (
                  <div className="bg-gray-50 border border-black p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold mb-2 text-gray-900">Sheet</label>
                        <select
                          value={selectedSheet}
                          onChange={(e) => setSelectedSheet(e.target.value)}
                          className="w-full p-3 border border-black focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white shadow-sm"
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
                          <label htmlFor="useReference" className="text-xs font-bold text-gray-900">
                            Use Reference Column (for verification/correction)
                          </label>
                        </div>
                        {useReferenceColumn && (
                          <input
                            type="text"
                            value={referenceColumn}
                            onChange={(e) => setReferenceColumn(e.target.value.toUpperCase())}
                            className="w-full p-3 border border-black focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white shadow-sm"
                            placeholder="D"
                            maxLength={1}
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-gray-900">Utterer Column</label>
                        <input
                          type="text"
                          value={uttererColumn}
                          onChange={(e) => setUttererColumn(e.target.value.toUpperCase())}
                          className="w-full p-3 border border-black focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white shadow-sm"
                          placeholder="A"
                          maxLength={1}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-gray-900">Source Column</label>
                        <input
                          type="text"
                          value={sourceColumn}
                          onChange={(e) => setSourceColumn(e.target.value.toUpperCase())}
                          className="w-full p-3 border border-black focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white shadow-sm"
                          placeholder="C"
                          maxLength={1}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold mb-2 text-gray-900">Start Row</label>
                        <input
                          type="number"
                          value={startRow}
                          onChange={(e) => setStartRow(parseInt(e.target.value) || 1)}
                          className="w-full p-3 border border-black focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white shadow-sm"
                          min="1"
                        />
                      </div>
                    </div>
                    {sourceTexts.length > 0 && (
                      <p className="text-sm text-green-600 font-medium bg-green-50 p-3 border border-green-600">
                        Found {sourceTexts.length} items (speakers from column {uttererColumn}, text from column {sourceColumn}
                        {useReferenceColumn ? `, references from column ${referenceColumn}` : ''})
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Manual Input Section */}
            {inputMode === 'manual' && (
              <div className="space-y-6">
                <label className="block text-base font-black mb-4 text-gray-900 tracking-tight uppercase letter-spacing-wide">
                  Paste Text Manually
                </label>
                <textarea
                  className="w-full h-48 p-4 border border-black font-mono text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white shadow-sm resize-none"
                  placeholder="Paste your text here, one line per item..."
                  onChange={handleSourceInput}
                />
                
                <div>
                                  <label className="block text-base font-black mb-4 text-gray-900 tracking-tight uppercase letter-spacing-wide">
                  Starting Cell
                </label>
                  <input
                    type="text"
                    value={cellStart}
                    onChange={(e) => setCellStart(e.target.value)}
                    className="w-full p-3 border border-black focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white shadow-sm"
                    placeholder="A1"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t border-black">
              {sourceTexts.length > 0 && (
                <p className="text-sm text-gray-600 font-medium">
                  {sourceTexts.length} items ready to translate
                </p>
              )}
              <button
                onClick={handleStart}
                disabled={sourceTexts.length === 0}
                className="px-8 py-3 bg-black text-white font-medium disabled:bg-gray-200 disabled:text-gray-400 hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm"
                style={{ borderRadius: '3px' }}
              >
                Start Translation →
              </button>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-black mb-3 tracking-tighter bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Translation Helper</h1>
            <p className="text-gray-600 text-lg font-medium">
              {getCellLocation(currentIndex)} • Item {currentIndex + 1} of {sourceTexts.length}
            </p>
          </div>
          <button
            onClick={handleBackToSetup}
            className="px-4 py-2 border border-black font-medium hover:bg-white transition-all duration-200 shadow-sm"
            style={{ borderRadius: '3px' }}
          >
            ← Back to Setup
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 border border-black overflow-hidden shadow-inner">
          <div
            className="absolute h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Translation Card */}
        <div 
          className={`bg-white border border-black p-8 space-y-8 shadow-md transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'
          }`}
        >
          <div className="space-y-2">
            {utterers.length > 0 && utterers[currentIndex] && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-600 shadow-sm">
                <label className="text-sm font-black text-blue-900 uppercase tracking-wide letter-spacing-wide">Speaker</label>
                <p className="text-lg font-bold text-blue-900 mt-2">{utterers[currentIndex]}</p>
              </div>
            )}
            <label className="text-base font-black text-gray-900 tracking-tight uppercase letter-spacing-wide">English</label>
            <div className="p-6 bg-gray-50 border border-black shadow-sm">
              <p className="text-lg font-medium leading-relaxed">{sourceTexts[currentIndex]}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-black text-gray-900 tracking-tight uppercase letter-spacing-wide">Translation</label>
              {useReferenceColumn && (
                <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 font-bold shadow-sm border border-blue-600">
                  Verification Mode
                </span>
              )}
            </div>
            <textarea
              value={currentTranslation}
              onChange={(e) => setCurrentTranslation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full p-4 border border-black focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 text-lg leading-relaxed bg-white shadow-sm resize-none"
              placeholder={useReferenceColumn ? "Review and edit the reference translation..." : "Enter your translation..."}
              rows={3}
              autoFocus
            />
            <p className="text-xs text-gray-500 font-medium">
              {useReferenceColumn ? "Reference loaded - modify as needed • " : ""}Press Shift+Enter to submit
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-3 border border-black font-medium disabled:border-gray-200 disabled:text-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm"
              style={{ borderRadius: '3px' }}
            >
              ← Previous
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              style={{ borderRadius: '3px' }}
            >
              {currentIndex === sourceTexts.length - 1 ? 'Complete' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className={`bg-white border border-black p-6 space-y-6 shadow-md transition-transform duration-200 ${
          showCopied ? 'transform scale-95' : 'transform scale-100'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase letter-spacing-wide">Translated Output</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">Shows row info, but copies translations only</p>
            </div>
            <div className="relative">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                style={{ borderRadius: '3px' }}
                title="Copy translations only (for pasting back to spreadsheet)"
              >
                Copy All
              </button>
              {showCopied && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-2 text-sm whitespace-nowrap shadow-lg font-medium border border-green-800" style={{ borderRadius: '3px' }}>
                  Copied!
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-5 border border-black max-h-48 overflow-y-auto shadow-inner custom-scrollbar">
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {translations.map((trans, idx) => {
                if (!trans) return '';
                const utterer = (utterers && utterers.length > 0 && utterers[idx]) ? `[${utterers[idx]}] ` : '';
                return `${getCellLocation(idx)}: ${utterer}${trans}`;
              }).filter(Boolean).join('\n') || 'Translations will appear here...'}
            </pre>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-gray-50 border border-black shadow-sm">
              <p className="font-bold text-lg">{currentIndex + 1}</p>
              <p className="text-gray-600 font-bold">Current</p>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-black shadow-sm">
              <p className="font-bold text-lg">{translations.filter(t => t).length}</p>
              <p className="text-gray-600 font-bold">Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-black shadow-sm">
              <p className="font-bold text-lg">{Math.round(progress)}%</p>
              <p className="text-gray-600 font-bold">Progress</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TranslationHelper; 