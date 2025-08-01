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
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Accordion states
  const [mainAssesOpen, setMainAssesOpen] = useState(false);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [supportingAssesOpen, setSupportingAssesOpen] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const [worldOpen, setWorldOpen] = useState(false);
  
  // Codex data and expanded items
  const [codexData, setCodexData] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isLoadingCodex, setIsLoadingCodex] = useState(false);
  
  const progress = sourceTexts.length > 0 ? ((currentIndex) / sourceTexts.length) * 100 : 0;

  // Fetch codex data on component mount
  useEffect(() => {
    const fetchCodexData = async () => {
      setIsLoadingCodex(true);
      try {
        const response = await fetch('/api/codex');
        if (response.ok) {
          const data = await response.json();
          setCodexData(data);
        }
      } catch (error) {
        console.error('Error fetching codex data:', error);
      } finally {
        setIsLoadingCodex(false);
      }
    };

    fetchCodexData();
  }, []);

  // Function to check if text matches any codex entries
  const getMatchingCodexEntries = (text: string) => {
    if (!codexData || !text) return [];
    
    const matches: Array<{title: string, content: string, category: string}> = [];
    const textLower = text.toLowerCase();
    
    Object.entries(codexData).forEach(([category, entries]: [string, any]) => {
      if (Array.isArray(entries)) {
        entries.forEach((entry: any) => {
          if (entry.name && textLower.includes(entry.name.toLowerCase())) {
            matches.push({
              title: entry.name,
              content: entry.content || '',
              category: category
            });
          }
        });
      }
    });
    
    return matches;
  };

  // Function to highlight matching text
  const highlightMatchingText = (text: string) => {
    if (!codexData) return text;
    
    const matches = getMatchingCodexEntries(text);
    if (matches.length === 0) return text;
    
    let highlightedText = text;
    matches.forEach(match => {
      const regex = new RegExp(`(${match.title})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="glow-text">$1</span>');
    });
    
    return highlightedText;
  };

  // Function to toggle expanded items
  const toggleExpandedItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Helper function to render expandable codex items
  const renderCodexItems = (category: string, categoryKey: string) => {
    if (isLoadingCodex) {
      return <div className="text-center py-4 text-gray-500">Loading codex data...</div>;
    }
    
    if (!codexData || !codexData[categoryKey]) {
      return <div className="text-gray-500">No codex data available</div>;
    }
    
    return codexData[categoryKey].map((entry: any, index: number) => (
      <div key={`${categoryKey}-${index}`} className="border border-gray-200 dark:border-gray-600 rounded">
        <button
          onClick={() => toggleExpandedItem(`${categoryKey}-${index}`)}
          className="w-full p-3 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <span className={`font-medium ${getMatchingCodexEntries(sourceTexts[currentIndex] || '').some(m => m.title === entry.name) ? 'glow-text' : ''}`}>
            {entry.name}
          </span>
          <svg className={`w-4 h-4 transform transition-transform duration-200 ${expandedItems.has(`${categoryKey}-${index}`) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedItems.has(`${categoryKey}-${index}`) && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">{entry.content}</pre>
            </div>
          </div>
        )}
      </div>
    ));
  };

  // Generate random gradient colors
  const generateGradientColors = (): string[] => {
    const colorPalettes = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1'], // Coral to Teal
      ['#9B59B6', '#3498DB', '#E74C3C'], // Purple to Blue to Red
      ['#F39C12', '#E67E22', '#E74C3C'], // Orange gradient
      ['#1ABC9C', '#3498DB', '#9B59B6'], // Teal to Blue to Purple
      ['#E74C3C', '#F39C12', '#F1C40F'], // Red to Orange to Yellow
      ['#2ECC71', '#27AE60', '#16A085'], // Green gradient
      ['#3498DB', '#2980B9', '#8E44AD'], // Blue to Purple
      ['#E67E22', '#D35400', '#C0392B'], // Orange to Red
    ];
    return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  };

  // Initialize gradient colors on mount
  useEffect(() => {
    setGradientColors(generateGradientColors());
  }, []);

  // Initialize and persist dark mode
  useEffect(() => {
    // Check localStorage and system preference
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Update document class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

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
    
    // Trigger translation animation
    setIsTranslating(true);
    setTimeout(() => setIsTranslating(false), 800);
    
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center transition-colors duration-300">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
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
            {/* Gradient Accent Block */}
            <div className="flex justify-center mb-8">
              <div 
                className="shadow-lg"
                style={{
                  width: '300px',
                  height: '75px',
                  background: gradientColors.length > 0 
                    ? `linear-gradient(270deg, ${gradientColors.join(', ')}, ${gradientColors[0]})` 
                    : 'linear-gradient(270deg, #3498DB, #9B59B6, #3498DB)',
                  backgroundSize: '200% 200%',
                  animation: isTranslating ? 'gradientShiftFast 1.5s ease-in-out infinite' : 'gradientShift 3s ease-in-out infinite'
                }}
              />
            </div>
            <h1 className="text-6xl font-black mb-4 tracking-tighter bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Translation Helper</h1>
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
                    className="px-6 py-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm font-black tracking-tight uppercase letter-spacing-wide"
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
          <div className="mt-16 mb-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
              Onnozelaer Marketing Works © 2025 - made with Generative AI
            </p>
            
            {/* Creative Squiggly Animation */}
            <div className="flex justify-center items-center space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Mystery Squiggly Line */}
            <div className="mt-4 flex justify-center">
              <svg className="w-32 h-8" viewBox="0 0 128 32" fill="none">
                <path 
                  d="M8 16 Q24 4, 40 16 T72 16 T104 16 T128 16" 
                  stroke="url(#squigglyGradient)" 
                  strokeWidth="2" 
                  fill="none"
                  className="animate-pulse"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.3))',
                    animation: 'squigglyWave 3s ease-in-out infinite'
                  }}
                />
                <defs>
                  <linearGradient id="squigglyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="25%" stopColor="#EC4899" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="75%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
                  @keyframes squigglyWave {
          0%, 100% { 
            d: path("M8 16 Q24 4, 40 16 T72 16 T104 16 T128 16");
            opacity: 0.7;
          }
          25% { 
            d: path("M8 16 Q24 28, 40 16 T72 16 T104 16 T128 16");
            opacity: 1;
          }
          50% { 
            d: path("M8 16 Q24 4, 40 16 T72 28 T104 16 T128 16");
            opacity: 0.8;
          }
          75% { 
            d: path("M8 16 Q24 28, 40 16 T72 4 T104 28 T128 16");
            opacity: 0.9;
          }
        }
        
        .glow-text {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3);
          background-size: 300% 300%;
          animation: glowPulse 2s ease-in-out infinite;
          padding: 2px 4px;
          border-radius: 3px;
          color: white;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          font-weight: bold;
        }
        
        @keyframes glowPulse {
          0%, 100% {
            background-position: 0% 50%;
            box-shadow: 0 0 5px rgba(255, 107, 107, 0.5);
          }
          50% {
            background-position: 100% 50%;
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
          }
        }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
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


      <div className="max-w-4xl mx-auto space-y-8">
        {/* Gradient Accent Block */}
        <div className="flex justify-center mb-6">
          <div 
            className="shadow-lg"
            style={{
              width: '300px',
              height: '75px',
              background: gradientColors.length > 0 
                ? `linear-gradient(270deg, ${gradientColors.join(', ')}, ${gradientColors[0]})` 
                : 'linear-gradient(270deg, #3498DB, #9B59B6, #3498DB)',
              backgroundSize: '200% 200%',
              animation: isTranslating ? 'gradientShiftFast 1.5s ease-in-out infinite' : 'gradientShift 3s ease-in-out infinite'
            }}
          />
        </div>
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-black mb-3 tracking-tighter bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Translation Helper</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {getCellLocation(currentIndex)} • Item {currentIndex + 1} of {sourceTexts.length}
            </p>
          </div>
          <button
            onClick={handleBackToSetup}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm font-black tracking-tight uppercase letter-spacing-wide"
            style={{ borderRadius: '3px' }}
          >
            ← Back to Setup
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 border border-black dark:border-gray-600 overflow-hidden shadow-inner">
          <div
            className="absolute h-full bg-black dark:bg-white transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Translation Card */}
        <div 
          className={`bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-8 space-y-8 shadow-md transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'
          }`}
        >
          <div className="space-y-2">
            {utterers.length > 0 && utterers[currentIndex] && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-600 shadow-sm">
                <label className="text-sm font-black text-blue-900 uppercase tracking-wide letter-spacing-wide">Speaker</label>
                <p className="text-lg font-semibold text-blue-900 mt-2">{utterers[currentIndex]}</p>
              </div>
            )}
            <label className="text-base font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">English</label>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border border-black shadow-sm">
              <div 
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: highlightMatchingText(sourceTexts[currentIndex]) 
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Translation</label>
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
              className="w-full p-4 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-all duration-200 text-lg leading-relaxed bg-white dark:bg-gray-700 shadow-sm dark:text-white resize-none"
              placeholder={useReferenceColumn ? "Review and edit the reference translation..." : "Enter your translation..."}
              rows={3}
              autoFocus
            />
                          <p className="text-xs text-gray-500">
              {useReferenceColumn ? "Reference loaded - modify as needed • " : ""}Press Shift+Enter to submit
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm font-black tracking-tight uppercase letter-spacing-wide"
              style={{ borderRadius: '3px' }}
            >
              ← Previous
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide"
              style={{ borderRadius: '3px' }}
            >
                              {currentIndex === sourceTexts.length - 1 ? 'Complete ✓' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className={`bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 space-y-6 shadow-md transition-transform duration-200 ${
          showCopied ? 'transform scale-95' : 'transform scale-100'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Translated Output</h3>
              <p className="text-xs text-gray-500 mt-1">Shows row info, but copies translations only</p>
            </div>
            <div className="relative">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide"
                style={{ borderRadius: '3px' }}
                title="Copy translations only (for pasting back to spreadsheet)"
              >
                Copy All
              </button>
              {showCopied && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 dark:bg-green-700 text-white px-3 py-2 text-sm whitespace-nowrap shadow-lg border border-green-800 dark:border-green-900" style={{ borderRadius: '3px' }}>
                  ✓ Copied!
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
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 border border-black shadow-sm">
              <p className="font-bold text-lg">{currentIndex + 1}</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold">Current</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 border border-black shadow-sm">
              <p className="font-bold text-lg">{translations.filter(t => t).length}</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold">Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 border border-black shadow-sm">
              <p className="font-bold text-lg">{Math.round(progress)}%</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold">Progress</p>
            </div>
          </div>
        </div>

        {/* Codex Accordions */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Codex Reference</h3>
          
          {/* Main Asses Accordion */}
          <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm">
            <button
              onClick={() => setMainAssesOpen(!mainAssesOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="font-bold text-gray-900 dark:text-gray-100">Main Asses</span>
              <svg className={`w-5 h-5 transform transition-transform duration-200 ${mainAssesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mainAssesOpen && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="space-y-2 text-sm">
                  {renderCodexItems('Main Asses', 'Main Asses')}
                </div>
              </div>
            )}
          </div>

          {/* Places Accordion */}
          <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm">
            <button
              onClick={() => setPlacesOpen(!placesOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="font-bold text-gray-900 dark:text-gray-100">Places</span>
              <svg className={`w-5 h-5 transform transition-transform duration-200 ${placesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {placesOpen && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="space-y-2 text-sm">
                  {renderCodexItems('Places', 'Places')}
                </div>
              </div>
            )}
          </div>

          {/* Supporting Asses Accordion */}
          <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm">
            <button
              onClick={() => setSupportingAssesOpen(!supportingAssesOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="font-bold text-gray-900 dark:text-gray-100">Supporting Asses</span>
              <svg className={`w-5 h-5 transform transition-transform duration-200 ${supportingAssesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {supportingAssesOpen && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="space-y-2 text-sm">
                  {renderCodexItems('Supporting Asses', 'Supporting Asses')}
                </div>
              </div>
            )}
          </div>

          {/* Themes Accordion */}
          <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm">
            <button
              onClick={() => setThemesOpen(!themesOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="font-bold text-gray-900 dark:text-gray-100">Themes</span>
              <svg className={`w-5 h-5 transform transition-transform duration-200 ${themesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {themesOpen && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="space-y-2 text-sm">
                  {renderCodexItems('Themes', 'Themes')}
                </div>
              </div>
            )}
          </div>

          {/* World Accordion */}
          <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm">
            <button
              onClick={() => setWorldOpen(!worldOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="font-bold text-gray-900 dark:text-gray-100">World</span>
              <svg className={`w-5 h-5 transform transition-transform duration-200 ${worldOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {worldOpen && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="space-y-2 text-sm">
                  {renderCodexItems('World', 'World')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 mb-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
            Onnozelaer Marketing Works © 2025 - made with Generative AI
          </p>
          
          {/* Creative Squiggly Animation */}
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Mystery Squiggly Line */}
          <div className="mt-4 flex justify-center">
            <svg className="w-32 h-8" viewBox="0 0 128 32" fill="none">
              <path 
                d="M8 16 Q24 4, 40 16 T72 16 T104 16 T128 16" 
                stroke="url(#squigglyGradient)" 
                strokeWidth="2" 
                fill="none"
                className="animate-pulse"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.3))',
                  animation: 'squigglyWave 3s ease-in-out infinite'
                }}
              />
              <defs>
                <linearGradient id="squigglyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="25%" stopColor="#EC4899" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="75%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes squigglyWave {
          0%, 100% { 
            d: path("M8 16 Q24 4, 40 16 T72 16 T104 16 T128 16");
            opacity: 0.7;
          }
          25% { 
            d: path("M8 16 Q24 28, 40 16 T72 16 T104 16 T128 16");
            opacity: 1;
          }
          50% { 
            d: path("M8 16 Q24 4, 40 16 T72 28 T104 16 T128 16");
            opacity: 0.8;
          }
          75% { 
            d: path("M8 16 Q24 28, 40 16 T72 4 T104 28 T128 16");
            opacity: 0.9;
          }
        }
      `}</style>

    </div>
  );
};

export default TranslationHelper; 