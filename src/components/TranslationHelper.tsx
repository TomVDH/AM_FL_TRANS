'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useDisplayModes } from '../hooks/useDisplayModes';
import { useXlsxMode } from '../hooks/useXlsxMode';
import { useReferenceColumn as useReferenceColumnHook } from '../hooks/useReferenceColumn';
import { useJsonHighlighting } from '../hooks/useJsonHighlighting';
import { useCharacterDetection } from '../hooks/useCharacterDetection';
import { useUIComponents } from '../hooks/useUIComponents';
import { useGradientBarAnimation } from '../hooks/useGradientBarAnimation';
import { useFooterGradientAnimation } from '../hooks/useFooterGradientAnimation';
import { useInterfaceAnimations } from '../hooks/useInterfaceAnimations';
import { useExcelProcessing } from '../hooks/useExcelProcessing';
import { useTranslationState } from '../hooks/useTranslationState';
import SetupWizard from './SetupWizard';
import CodexPanel from './CodexPanel';
import TextHighlighter from './TextHighlighter';
import VideoButton from './VideoButton';
import CodexButton from './CodexButton';
import ReferenceToolsPanel from './ReferenceToolsPanel';
import QuickReferenceBar from './QuickReferenceBar';
import { useCharacterHighlighting } from '../hooks/useCharacterHighlighting';


const TranslationHelper: React.FC = () => {
  const {
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
    fileInputRef,
    textareaRef,
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
    loadedFileName,
    loadedFileType,
    originalTranslations,
    hasCurrentEntryChanged,
    getCurrentOriginalValue,
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
    trimCurrentTranslation,
    resetOutputDisplay,
    exportTranslations,
    jumpToRow,
    outputKey,
  } = useTranslationState();

  const copyJsonField = (text: string, fieldName: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  // Generate Excel-compatible output for modified entries only
  // Returns array of { cellRef: "J5", value: "translation", excelRow: 5 }
  const getModifiedEntriesForExcel = () => {
    return translations.map((trans, idx) => {
      if (!trans || trans === '[BLANK, REMOVE LATER]') return null;

      // Check if modified from original
      const originalValue = originalTranslations[idx] || '[BLANK, REMOVE LATER]';
      const hasBeenModified = trans !== originalValue;
      const wasOriginallyBlank = originalValue === '[BLANK, REMOVE LATER]' || originalValue === '';
      const isNowFilled = trans !== '[BLANK, REMOVE LATER]' && trans !== '';

      // Only include if modified or newly filled
      if (!hasBeenModified && !(wasOriginallyBlank && isNowFilled)) return null;

      // Calculate actual Excel row (startRow is 1-indexed, idx is 0-indexed)
      const excelRow = startRow + idx;

      return {
        cellRef: `J${excelRow}`,
        value: trans,
        excelRow,
        idx
      };
    }).filter(Boolean) as { cellRef: string; value: string; excelRow: number; idx: number }[];
  };

  const copyToClipboard = () => {
    const modifiedEntries = getModifiedEntriesForExcel();

    if (modifiedEntries.length === 0) {
      // Nothing to copy
      return;
    }

    // For Excel pasting: just the translations, one per line
    // User selects starting cell in J column and pastes
    const text = modifiedEntries.map(e => e.value).join('\n');
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Copy with cell references for manual paste (shows where each goes)
  const copyWithCellRefs = () => {
    const modifiedEntries = getModifiedEntriesForExcel();

    if (modifiedEntries.length === 0) return;

    // Format: "J5: translation text" for each line
    const text = modifiedEntries.map(e => `${e.cellRef}: ${e.value}`).join('\n');
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };
  const {
    referenceColumn,
    useReferenceColumn,
    setReferenceColumn,
    setUseReferenceColumn,
    resetReferenceColumn,
    processReferenceData,
    initializeTranslationsWithReference,
  } = useReferenceColumnHook();
  
  const {
    darkMode,
    eyeMode,
    highlightMode,
    gamepadMode,
    toggleDarkMode,
    toggleEyeMode,
    toggleHighlightMode,
    toggleGamepadMode,
  } = useDisplayModes();
  
  const {
    xlsxMode,
    selectedXlsxFile,
    selectedXlsxSheet,
    xlsxSearchTerm,
    xlsxData,
    availableXlsxFiles,
    globalSearch,
    isLoadingXlsx,
    setSelectedXlsxSheet,
    setXlsxSearchTerm,
    setGlobalSearch,
    loadXlsxData,
    toggleXlsxMode,
    clearXlsxMode,
    getFilteredEntries,
    getAvailableSheets,
    findXlsxMatches,
  } = useXlsxMode();

  const {
    detectedCharacters,
    showCharacterButtons,
    setDetectedCharacters,
    setShowCharacterButtons,
    detectAssCharacters,
    insertCharacterName: insertCharacterNameHook,
    highlightMatchingText,
  } = useCharacterDetection();

  const insertCharacterName = (characterName: string) => {
    insertCharacterNameHook(characterName, currentTranslation, setCurrentTranslation, textareaRef);
  };

  // Wrapper function to copy source text to XLSX search
  const handleCopySourceToXlsxSearch = () => {
    const sourceText = sourceTexts[currentIndex];
    if (sourceText) {
      // Enable XLSX mode if not already enabled
      if (!xlsxMode) {
        toggleXlsxMode();
      }
      
      // Load XLSX data if not already loaded
      if (!xlsxData && availableXlsxFiles.length > 0) {
        loadXlsxData(availableXlsxFiles[0].fileName);
      }
      
      // Set the search term
      setXlsxSearchTerm(sourceText);
    }
  };
  
  const VERSION_HASH = 'v2.0.0';
  
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({});
  const [codexData, setCodexData] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isLoadingCodex, setIsLoadingCodex] = useState(false);
  const [xlsxViewerTab, setXlsxViewerTab] = useState<'browse' | 'context'>('browse');
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const [highlightingJsonData, setHighlightingJsonData] = useState<any>(null);
  const { findJsonMatches, getHoverText } = useJsonHighlighting(highlightingJsonData);
  const { progressBarRef, progressFillRef, animateProgress } = useGradientBarAnimation();
  const { gradientBarRef } = useFooterGradientAnimation();
  const { cardRef, buttonsRef, dialogueBoxRef, animateCardTransition, animateButtonHover } = useInterfaceAnimations();
  const { characterData, findCharacterMatches } = useCharacterHighlighting();

  // Create wrapper function for XLSX matches that returns compatible format
  // Trim speaker name to last dot for full name display
  const trimSpeakerName = (speaker: string | undefined): string => {
    if (!speaker) return '';
    const lastDotIndex = speaker.lastIndexOf('.');
    return lastDotIndex !== -1 ? speaker.substring(lastDotIndex + 1) : speaker;
  };

  const findXlsxMatchesWrapper = useCallback((text: string) => {
    const matches = findXlsxMatches(text);
    return matches.map(match => ({
      sourceEnglish: match.sourceEnglish,
      translatedDutch: match.translatedDutch,
      category: match.sheetName || 'Unknown Sheet',
      sheetName: match.sheetName,
      rowNumber: match.row,
      utterer: match.utterer,
      context: match.context
    }));
  }, [findXlsxMatches]);

  // Handle character name click for scrolling to context search
  const handleCharacterNameClick = (characterName: string) => {
    // Enable XLSX mode if not already enabled
    if (!xlsxMode) {
      toggleXlsxMode();
    }
    
    // Switch to context search tab
    setXlsxViewerTab('context');
    
    // Scroll to the Reference Tools section after a brief delay
    setTimeout(() => {
      const referenceTools = document.querySelector('.reference-tools-section');
      if (referenceTools) {
        referenceTools.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle highlight click to jump to Data Viewer
  const handleHighlightClick = useCallback((entry: any, type: 'json' | 'xlsx' | 'character') => {
    // Enable XLSX mode if not already enabled
    if (!xlsxMode) {
      toggleXlsxMode();
    }

    // Load XLSX data if not already loaded
    if (!xlsxData && availableXlsxFiles.length > 0) {
      loadXlsxData(availableXlsxFiles[0].fileName);
    }

    // Set the search term based on hover data or entry info
    if (entry.hover) {
      // Extract source text from hover format "Dutch: X | Context: Y | Source: Z"
      const sourceMatch = entry.hover.match(/Source:\s*([^|]+)/);
      const dutchMatch = entry.hover.match(/Dutch:\s*([^|]+)/);
      const searchTerm = sourceMatch ? sourceMatch[1].trim() : (dutchMatch ? dutchMatch[1].trim() : '');
      if (searchTerm) {
        setXlsxSearchTerm(searchTerm);
      }
    } else if (entry.sourceEnglish) {
      setXlsxSearchTerm(entry.sourceEnglish);
    } else if (entry.translatedDutch) {
      setXlsxSearchTerm(entry.translatedDutch);
    }

    // Switch to context search tab for better match visibility
    setXlsxViewerTab('context');

    // Scroll to Reference Tools section
    setTimeout(() => {
      const referenceTools = document.querySelector('.reference-tools-section');
      if (referenceTools) {
        referenceTools.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [xlsxMode, xlsxData, availableXlsxFiles, toggleXlsxMode, loadXlsxData, setXlsxSearchTerm]);

  useEffect(() => {
    const loadLocalizationManual = async () => {
      try {
        const response = await fetch('/api/json-data?file=READ_ME_LocalizationManual.json');
        if (response.ok) {
          const data = await response.json();
          setHighlightingJsonData(data);
        }
      } catch (error) {
        console.error('Error loading Localization Manual:', error);
      }
    };

    loadLocalizationManual();
  }, []);




  
  const progress = sourceTexts.length > 0 ? ((currentIndex) / sourceTexts.length) * 100 : 0;

  // Animate progress changes
  useEffect(() => {
    animateProgress(progress);
  }, [progress, animateProgress]);

  // Animate card transitions when current index changes
  useEffect(() => {
    if (isStarted && currentIndex > 0) {
      animateCardTransition();
    }
  }, [currentIndex, isStarted, animateCardTransition]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when textarea is not focused
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        // Allow Enter to submit even from textarea
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          handleSubmit();
        }
        return;
      }

      // O for Previous
      if (e.key.toLowerCase() === 'o' && currentIndex > 0) {
        e.preventDefault();
        handlePrevious();
      }
      // P for Next
      else if (e.key.toLowerCase() === 'p' && currentIndex < sourceTexts.length - 1) {
        e.preventDefault();
        setCurrentIndex(currentIndex + 1);
        setCurrentTranslation(translations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex + 1] || '');
      }
      // R for Reference Tools toggle
      else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        toggleXlsxMode();
      }
      // Escape to close Reference Tools
      else if (e.key === 'Escape' && xlsxMode) {
        e.preventDefault();
        toggleXlsxMode();
      }
      // Enter for Submit
      else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, sourceTexts.length, translations, handlePrevious, handleSubmit, setCurrentIndex, setCurrentTranslation, xlsxMode, toggleXlsxMode]);


  if (!isStarted) {
    return (
      <SetupWizard
        inputMode={inputMode}
        setInputMode={setInputMode}
        excelSheets={excelSheets}
        selectedSheet={selectedSheet}
        setSelectedSheet={setSelectedSheet}
        sourceColumn={sourceColumn}
        setSourceColumn={setSourceColumn}
        uttererColumn={uttererColumn}
        setUttererColumn={setUttererColumn}
        referenceColumn={referenceColumn}
        setReferenceColumn={setReferenceColumn}
        useReferenceColumn={useReferenceColumn}
        setUseReferenceColumn={setUseReferenceColumn}
        startRow={startRow}
        setStartRow={setStartRow}
        cellStart={cellStart}
        setCellStart={setCellStart}
        sourceTexts={sourceTexts}
        workbookData={workbookData}
        setSourceTexts={setSourceTexts}
        setUtterers={setUtterers}
        setTranslations={setTranslations}
        setLoadedFileName={setLoadedFileName}
        setLoadedFileType={setLoadedFileType}
        setOriginalTranslations={setOriginalTranslations}
        handleFileUpload={handleFileUpload}
        handleExistingFileLoad={handleExistingFileLoad}
        handleSourceInput={handleSourceInput}
        handleStart={handleStart}
        gradientColors={gradientColors}
        showVersionHash={showVersionHash}
        VERSION_HASH={VERSION_HASH}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 md:p-5 transition-colors duration-300" style={{ animation: 'fadeIn 0.5s ease-out' }}>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setShowKeyboardShortcuts(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-2xl p-6 max-w-lg w-full mx-4"
            style={{ borderRadius: '3px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Shortcuts Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Navigation */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Navigation</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Previous</span>
                  <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>O</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Next</span>
                  <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>P</kbd>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Actions</h4>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Submit</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>Shift</kbd>
                    <span className="text-xs text-gray-400">+</span>
                    <kbd className="px-2 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>Enter</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Trim Whitespace</span>
                  <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>T</kbd>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 col-span-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Toggles</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Reference Tools</span>
                    <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>R</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Eye Mode</span>
                    <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>E</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Highlight Mode</span>
                    <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>H</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Game Mode</span>
                    <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>G</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer hint */}
            <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '2px' }}>Esc</kbd> or click outside to close</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header - Integrated toolbar with all controls */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button + Title with file type badge */}
            <div className="flex items-center gap-3">
              {/* Home Button - Returns to setup */}
              <button
                onClick={handleBackToSetup}
                className="group relative h-9 w-9 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
                style={{ borderRadius: '3px' }}
                aria-label="Back to Home"
                title="Back to Home"
              >
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
              </button>

              <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-gray-100">Translation Helper</h1>
              {loadedFileName && (
                <span className={`inline-flex items-center px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide border ${
                  loadedFileType === 'excel'
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                    : loadedFileType === 'json'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                    : loadedFileType === 'csv'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`} style={{ borderRadius: '2px' }}>
                  {loadedFileType || 'manual'}
                </span>
              )}
            </div>

            {/* Center: Counter and Jump To */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                {getCellLocation(currentIndex)} • {currentIndex + 1}/{sourceTexts.length}
                {selectedSheet && <span className="text-gray-400 dark:text-gray-500"> • {selectedSheet}</span>}
              </span>

              {/* Compact Jump To Button */}
              <div className="relative">
                <button
                  onClick={() => setAccordionStates(prev => ({ ...prev, jumpTo: !prev.jumpTo }))}
                  className="flex items-center gap-1 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-[10px] font-medium"
                  style={{ borderRadius: '2px' }}
                >
                  <span>Jump</span>
                  <svg
                    className={`w-2.5 h-2.5 transition-transform duration-200 ${accordionStates.jumpTo ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accordionStates.jumpTo && (
                  <div className="absolute top-full right-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg z-50 min-w-max" style={{ borderRadius: '3px' }}>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const newIndex = Math.max(0, currentIndex - 5);
                          setCurrentIndex(newIndex);
                          setCurrentTranslation(translations[newIndex] === '[BLANK, REMOVE LATER]' ? '' : translations[newIndex] || '');
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        -5
                      </button>
                      <button
                        onClick={() => {
                          const newIndex = Math.max(0, currentIndex - 1);
                          setCurrentIndex(newIndex);
                          setCurrentTranslation(translations[newIndex] === '[BLANK, REMOVE LATER]' ? '' : translations[newIndex] || '');
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        min={startRow}
                        max={startRow + sourceTexts.length - 1}
                        value={startRow + currentIndex}
                        onChange={(e) => {
                          const rowNumber = parseInt(e.target.value);
                          if (rowNumber >= startRow && rowNumber < startRow + sourceTexts.length) {
                            jumpToRow(rowNumber);
                          }
                        }}
                        className="w-14 px-1 py-1 text-[10px] text-center font-bold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                        style={{ borderRadius: '2px' }}
                      />
                      <button
                        onClick={() => {
                          const newIndex = Math.min(sourceTexts.length - 1, currentIndex + 1);
                          setCurrentIndex(newIndex);
                          setCurrentTranslation(translations[newIndex] === '[BLANK, REMOVE LATER]' ? '' : translations[newIndex] || '');
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        +1
                      </button>
                      <button
                        onClick={() => {
                          const newIndex = Math.min(sourceTexts.length - 1, currentIndex + 5);
                          setCurrentIndex(newIndex);
                          setCurrentTranslation(translations[newIndex] === '[BLANK, REMOVE LATER]' ? '' : translations[newIndex] || '');
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        +5
                      </button>
                    </div>
                    {excelSheets.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <select
                          value={selectedSheet}
                          onChange={(e) => handleSheetChange(e.target.value)}
                          className="w-full p-1 text-[10px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                          style={{ borderRadius: '2px' }}
                        >
                          {excelSheets.map(sheet => (
                            <option key={sheet} value={sheet}>{sheet}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: File name + Keyboard Shortcuts + Dark Mode */}
            <div className="flex items-center gap-2">
              {loadedFileName && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[150px] mr-2">
                  {loadedFileName}
                </span>
              )}

              {/* Keyboard Shortcuts Button - Now integrated */}
              <button
                onClick={() => setShowKeyboardShortcuts(true)}
                className="group relative h-9 w-9 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
                style={{ borderRadius: '3px' }}
                aria-label="Keyboard shortcuts"
                title="Keyboard Shortcuts"
              >
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
              </button>

              {/* Dark Mode Toggle - Now integrated */}
              <button
                onClick={toggleDarkMode}
                className="group relative h-9 w-9 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
                style={{ borderRadius: '3px' }}
                aria-label="Toggle dark mode"
                title="Toggle Dark Mode"
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
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Row - Prev button, Progress Bar, Next button */}
        <div className="flex items-center gap-3 mb-6 mt-6">
          {/* Previous Button - Arrow Only */}
          <div className="group flex-shrink-0">
            <button
              ref={(el) => {
                if (el && buttonsRef.current) {
                  // Store reference if needed
                }
              }}
              onClick={handlePrevious}
              onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
              disabled={currentIndex === 0}
              className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 disabled:border-gray-200 dark:disabled:border-gray-800 disabled:text-gray-300 dark:disabled:text-gray-700 disabled:from-gray-100 disabled:to-gray-100 dark:disabled:from-gray-900 dark:disabled:to-gray-900 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:shadow-none overflow-hidden"
              style={{ borderRadius: '3px' }}
              title="Previous (←)"
            >
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
            </button>
          </div>

          {/* Enhanced Progress Bar - Between navigation buttons */}
          <div
            ref={progressBarRef}
            className="relative flex-1 h-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 overflow-hidden shadow-inner cursor-pointer transition-all duration-300"
            style={{ borderRadius: '3px' }}
          >
            <div className="absolute inset-0 flex">
              {sourceTexts.map((_, index) => {
                const isCompleted = index < currentIndex;
                const isBlank = translations[index] === '' || translations[index] === '[BLANK, REMOVE LATER]';
                const isCurrent = index === currentIndex;
                const isJustCompleted = index === currentIndex - 1;
                const segmentWidth = (100 / sourceTexts.length);

                return (
                  <div
                    key={index}
                    data-segment={index}
                    className="relative h-full"
                    style={{
                      width: `${segmentWidth}%`
                    }}
                  >
                    {isCompleted && (
                      <div
                        className="absolute inset-0 transition-all duration-700"
                        style={{
                          background: isBlank
                            ? darkMode
                              ? 'linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)'
                              : 'linear-gradient(90deg, #991b1b 0%, #b91c1c 50%, #991b1b 100%)'
                            : darkMode
                              ? 'linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%)'
                              : 'linear-gradient(90deg, #22c55e 0%, #4ade80 50%, #22c55e 100%)',
                          backgroundSize: '200% 100%',
                          animation: isJustCompleted
                            ? 'shimmer 1.5s ease-out, pipGlow 1s ease-out'
                            : 'shimmer 3s ease-in-out infinite',
                          boxShadow: isBlank
                            ? '0 0 6px rgba(127, 29, 29, 0.5)'
                            : (!isBlank && isJustCompleted)
                              ? '0 0 12px rgba(34, 197, 94, 0.8)'
                              : '0 0 4px rgba(34, 197, 94, 0.3)'
                        }}
                      />
                    )}
                    {isCurrent && !isCompleted && (
                      <div
                        className="absolute inset-0 opacity-50"
                        style={{
                          background: darkMode
                            ? 'linear-gradient(90deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%)'
                            : 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 50%, #9ca3af 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s ease-in-out infinite',
                          boxShadow: '0 0 8px rgba(156, 163, 175, 0.6)'
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Button - Arrow Only */}
          <div className="group flex-shrink-0">
            <button
              onClick={() => {
                if (currentIndex < sourceTexts.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setCurrentTranslation(translations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex + 1] || '');
                }
              }}
              onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
              disabled={currentIndex === sourceTexts.length - 1}
              className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 disabled:border-gray-200 dark:disabled:border-gray-800 disabled:text-gray-300 dark:disabled:text-gray-700 disabled:from-gray-100 disabled:to-gray-100 dark:disabled:from-gray-900 dark:disabled:to-gray-900 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:shadow-none overflow-hidden"
              style={{ borderRadius: '3px' }}
              title="Next (→)"
            >
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
            </button>
          </div>
        </div>

        {/* Column Headers - Outside the boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
          <h2 className="text-sm font-black tracking-tight uppercase text-gray-600 dark:text-gray-400">
            Source Text
            <span className="ml-2 text-[10px] font-medium text-gray-400 dark:text-gray-500 normal-case">
              • {getCellLocation(currentIndex)}
            </span>
          </h2>
          <h2 className="text-sm font-black tracking-tight uppercase text-gray-600 dark:text-gray-400">
            Translation Input
          </h2>
        </div>

        {/* Main 2-Column Grid Layout - Tighter gap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Left Column - Translation Card + JSON Settings */}
          <div className="space-y-4 h-full flex flex-col">

            {/* Translation Card - Compact padding */}
            <div
              ref={cardRef}
              className={`bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-5 space-y-4 shadow-md transition-all duration-300 flex-1 flex flex-col ${
                isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'
              }`}
              style={{ borderRadius: '3px' }}
            >
          <div className="space-y-4">
            <div className="space-y-2">
              {gamepadMode ? (
                <div className="flex flex-col gap-8 items-center">
                  {/* Main Dialogue Box */}
                  <div 
                    ref={dialogueBoxRef}
                    className="gamepad-box relative pixelify-sans-500 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-2 border-dashed border-black dark:border-gray-400"
                    style={{ 
                      width: '480px',
                      height: '200px',
                      fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                      fontSize: '1.5rem',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      letterSpacing: '0.02em',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                      background: darkMode ? '#1a1a1a' : '#ffffff',
                      position: 'relative',
                      backdropFilter: 'blur(1px)'
                    }}
                  >
                  {/* Speaker bar with reduced height */}
                  <div 
                    className="bg-black dark:bg-gray-800 text-white dark:text-gray-100 px-4 py-2 border-b-2 border-black dark:border-gray-700 text-left pixelify-sans-600 relative"
                    style={{ 
                      fontSize: '1.4rem', 
                      fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                      background: '#000000',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px'
                    }}
                  >
                    <div className="flex justify-center items-center">
                      <span className="text-shadow-pixel">
                        {trimSpeakerName(utterers[currentIndex]) || 'Speaker'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Main dialogue area with enhanced styling */}
                  <div 
                    className="p-3 relative text-left pixelify-sans-500 overflow-y-auto custom-scrollbar"
                    style={{ 
                      height: 'calc(100% - 50px)',
                      fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                      fontSize: '1.2rem',
                      lineHeight: '1.6',
                      background: darkMode ? '#1a1a1a' : '#ffffff',
                      borderBottomLeftRadius: '4px',
                      borderBottomRightRadius: '4px'
                    }}
                  >
                    <TextHighlighter
                      text={sourceTexts[currentIndex]}
                      jsonData={highlightingJsonData}
                      xlsxData={xlsxData || []}
                      highlightMode={highlightMode}
                      eyeMode={eyeMode}
                      currentTranslation={currentTranslation}
                      onCharacterClick={insertCharacterName}
                      onSuggestionClick={insertTranslatedSuggestion}
                      onCharacterNameClick={handleCharacterNameClick}
                      onHighlightClick={handleHighlightClick}
                      className="dialogue-content no-suggestions"
                      style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                        wordSpacing: '0.05em'
                      }}
                    />
                    
                    {/* Action buttons in bottom left corner */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      {/* Copy button for source text */}
                      <button
                        onClick={copySourceText}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 rounded"
                        title="Copy source text"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      {/* XLSX button - only show when XLSX mode is active */}
                      {xlsxMode && (
                        <button
                          onClick={handleCopySourceToXlsxSearch}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 rounded"
                          title="Search this text in Reference Tools"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h6" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Simplified continue dialogue indicator */}
                    <div className="absolute bottom-2 right-2 text-gray-600 animate-bounce">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Second Dialogue Box (Source) - Only show when eye mode is active */}
                {eyeMode && (
                  <div 
                    className="gamepad-box relative pixelify-sans-500 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-2 border-dashed border-black dark:border-gray-400 opacity-70"
                    style={{ 
                      width: '450px',
                      height: '200px',
                      fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                      fontSize: '1.5rem',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      letterSpacing: '0.02em',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      background: darkMode ? '#1a1a1a' : '#ffffff',
                      position: 'relative'
                    }}
                  >
                    {/* Speaker bar with reduced height */}
                    <div 
                      className="bg-black dark:bg-gray-800 text-white dark:text-gray-100 px-4 py-2 border-b-2 border-black dark:border-gray-700 text-left pixelify-sans-600 relative"
                      style={{ 
                        fontSize: '1.4rem', 
                        fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                        background: '#000000'
                      }}
                    >
                      <div className="flex justify-center items-center">
                        <span className="text-shadow-pixel opacity-70">Source</span>
                      </div>
                    </div>
                    
                    {/* Main dialogue area with enhanced styling */}
                    <div 
                      className="p-3 relative text-left pixelify-sans-500 overflow-y-auto custom-scrollbar"
                      style={{ 
                        height: 'calc(100% - 50px)',
                        fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                        fontSize: '1.2rem',
                        lineHeight: '1.6',
                        background: darkMode ? '#1a1a1a' : '#ffffff'
                      }}
                    >
                      <TextHighlighter
                        text={sourceTexts[currentIndex]}
                        jsonData={highlightingJsonData}
                        xlsxData={xlsxData || []}
                        highlightMode={highlightMode}
                        eyeMode={false}
                        currentTranslation=""
                        onCharacterClick={insertCharacterName}
                        onSuggestionClick={insertTranslatedSuggestion}
                        onCharacterNameClick={handleCharacterNameClick}
                        onHighlightClick={handleHighlightClick}
                        className="dialogue-content opacity-70"
                        style={{
                          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                          wordSpacing: '0.05em'
                        }}
                      />
                      
                      {/* Action buttons in bottom left corner */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-2">
                        {/* Copy button for source text */}
                        <button
                          onClick={copySourceText}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 rounded"
                          title="Copy source text"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {/* XLSX button - only show when XLSX mode is active */}
                        {xlsxMode && (
                          <button
                            onClick={handleCopySourceToXlsxSearch}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 rounded"
                            title="Search this text in Reference Tools"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h6" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
                          ) : (
                <div className="space-y-4">
                  {/* Main Translation Display */}
                  <div 
                    className="text-2xl font-bold leading-relaxed px-6 py-4 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded relative"
                    style={{ borderRadius: '3px' }}
                  >
                    {/* Copy button for source text */}
                    <button
                      onClick={copySourceText}
                      className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                      title="Copy source text"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    {/* XLSX button - only show when XLSX mode is active */}
                    {xlsxMode && (
                      <button
                        onClick={handleCopySourceToXlsxSearch}
                        className="absolute top-2 right-8 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                        title="Search this text in Reference Tools"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h6" />
                        </svg>
                      </button>
                    )}
                    {/* Inline Speaker Label - Show only when speaker exists */}
                    {utterers.length > 0 && utterers[currentIndex] && (
                      <div className="text-left mb-2">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Speaker: </span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{trimSpeakerName(utterers[currentIndex])}</span>
                      </div>
                    )}
                    <TextHighlighter
                      text={sourceTexts[currentIndex]}
                      jsonData={highlightingJsonData}
                      xlsxData={xlsxData || []}
                      highlightMode={highlightMode}
                      eyeMode={eyeMode}
                      currentTranslation={currentTranslation}
                      onCharacterClick={insertCharacterName}
                      onSuggestionClick={insertTranslatedSuggestion}
                      onCharacterNameClick={handleCharacterNameClick}
                      onHighlightClick={handleHighlightClick}
                      className="no-suggestions"
                    />

                    {/* Existing Dutch Translation (Column J) Display - Subtle gray styling with speaker info */}
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {translations[currentIndex] && translations[currentIndex] !== '[BLANK, REMOVE LATER]' ? (
                        <div className="space-y-1">
                          {/* Speaker Name Badge */}
                          {utterers[currentIndex] && (
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Speaker:</span>
                              <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 border border-purple-200 dark:border-purple-700" style={{ borderRadius: '2px' }}>
                                {extractSpeakerName(utterers[currentIndex])}
                              </span>
                            </div>
                          )}
                          {/* Dutch Translation */}
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                            <span className="text-[9px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wide mr-1.5 not-italic">NL:</span>
                            {translations[currentIndex]}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                          Awaiting your Dutch translation...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Source Display - Only show when eye mode is active */}
                  {eyeMode && (
                    <div 
                      className="text-xl font-medium leading-relaxed px-6 py-4 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded relative opacity-70"
                      style={{ borderRadius: '3px' }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Source Text</span>
                        <div className="flex items-center gap-2">
                          {/* Copy button for source text */}
                          <button
                            onClick={copySourceText}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                            title="Copy source text"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          {/* XLSX button - only show when XLSX mode is active */}
                          {xlsxMode && (
                            <button
                              onClick={handleCopySourceToXlsxSearch}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                              title="Search this text in Reference Tools"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h6" />
                        </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <TextHighlighter
                        text={sourceTexts[currentIndex]}
                        jsonData={highlightingJsonData}
                        xlsxData={xlsxData || []}
                        highlightMode={highlightMode}
                        eyeMode={false}
                        currentTranslation=""
                        onCharacterClick={insertCharacterName}
                        onCharacterNameClick={handleCharacterNameClick}
                        onHighlightClick={handleHighlightClick}
                        className="no-suggestions"
                      />
                    </div>
                  )}

                  {/* Next String Preview - Always visible when there's a next entry */}
                  {currentIndex < sourceTexts.length - 1 && (
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">
                        <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wide mr-1.5 not-italic">NEXT:</span>
                        <span className="font-semibold text-gray-500 dark:text-gray-400">
                          {trimSpeakerName(utterers[currentIndex + 1]) || 'Speaker'}
                        </span>
                        <span className="mx-1 text-gray-300 dark:text-gray-600">—</span>
                        <span className="italic">{sourceTexts[currentIndex + 1]}</span>
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

            </div>
          </div>

          {/* Right Column - Tabbed Interface - Compact */}
          <div className="h-full">
            <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-md h-full flex flex-col" style={{ borderRadius: '3px' }}>
              {/* Tab Navigation - Tighter */}
              <div className="flex border-b border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setActiveTab('input')}
                  className={`flex-1 px-3 py-2 font-black tracking-tight uppercase text-xs transition-all duration-200 ${
                    activeTab === 'input'
                      ? 'border-b-2 border-black dark:border-white text-black dark:text-white bg-gray-50 dark:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Input
                </button>
                <button
                  onClick={() => setActiveTab('output')}
                  className={`flex-1 px-3 py-2 font-black tracking-tight uppercase text-xs transition-all duration-200 ${
                    activeTab === 'output'
                      ? 'border-b-2 border-black dark:border-white text-black dark:text-white bg-gray-50 dark:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Output
                </button>
              </div>

              {/* Tab Content - Tighter padding */}
              <div className={`p-4 flex-1 flex flex-col transition-transform duration-200 ${
                showCopied ? 'transform scale-95' : 'transform scale-100'
              }`}>

                {/* Translation Input Tab */}
                {activeTab === 'input' && (
                  <div className="flex flex-col h-full">
                    {/* Change Detection - Top Right, Compact */}
                    <div className="flex justify-end mb-2">
                      {hasCurrentEntryChanged() ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700" style={{ borderRadius: '2px' }}>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Modified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '2px' }}>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          Unchanged
                        </span>
                      )}
                    </div>

                    {/* Textarea */}
                    <textarea
                      ref={textareaRef}
                      value={currentTranslation}
                      onChange={(e) => setCurrentTranslation(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      className={`w-full p-5 rounded-md focus:ring-2 focus:ring-opacity-30 transition-all duration-200 text-lg leading-relaxed shadow-inner dark:text-white resize-none flex-1 ${
                        hasCurrentEntryChanged()
                          ? 'border-2 border-green-400 dark:border-green-600 bg-green-50 dark:bg-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-300'
                          : 'border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-gray-300'
                      }`}
                      placeholder="Enter your translation..."
                      autoFocus
                    />

                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Shift+Enter to submit
                        </p>

                        {/* Inline Submit Button */}
                        <button
                          onClick={handleSubmit}
                          className="group relative h-9 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 dark:from-gray-100 dark:via-white dark:to-gray-100 text-white dark:text-black border border-gray-800 dark:border-gray-200 hover:border-gray-700 dark:hover:border-gray-300 hover:shadow-lg active:shadow-inner active:scale-[0.98] transition-all duration-300 ease-out font-bold tracking-wide uppercase text-xs overflow-hidden"
                          style={{ borderRadius: '3px' }}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {currentIndex === sourceTexts.length - 1 ? 'Complete' : 'Submit'}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                            </svg>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black dark:from-gray-200 dark:via-gray-100 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
                        </button>

                        {/* XLSX Translation Suggestions */}
                        {xlsxData && (() => {
                          const matches = findXlsxMatchesWrapper(sourceTexts[currentIndex] || '');
                          if (matches.length > 0) {
                            const sortedMatches = matches.sort((a, b) => {
                              const text = sourceTexts[currentIndex] || '';
                              const aIsExact = a.sourceEnglish.toLowerCase() === text.toLowerCase();
                              const bIsExact = b.sourceEnglish.toLowerCase() === text.toLowerCase();

                              if (aIsExact && !bIsExact) return -1;
                              if (!aIsExact && bIsExact) return 1;

                              return b.sourceEnglish.length - a.sourceEnglish.length;
                            });

                            const firstMatch = sortedMatches[0];
                            return (
                              <div className="flex flex-wrap gap-2 justify-end ml-4" style={{ maxWidth: '50%' }}>
                                {/* Translated Dutch Suggestion */}
                                {firstMatch.translatedDutch && firstMatch.translatedDutch.trim() !== '' && (
                                  <button
                                    onClick={() => insertTranslatedSuggestion(firstMatch.translatedDutch)}
                                    className="px-3 py-1 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-200 font-medium whitespace-nowrap"
                                    style={{ borderRadius: '3px' }}
                                    title={`Use Dutch translation: ${firstMatch.translatedDutch}`}
                                  >
                                    {firstMatch.translatedDutch}
                                  </button>
                                )}

                                {/* Placeholder Button */}
                                <button
                                  onClick={() => insertPlaceholder(firstMatch.sourceEnglish)}
                                  className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600 hover:bg-orange-200 dark:hover:bg-orange-700 transition-colors duration-200 font-medium whitespace-nowrap"
                                  style={{ borderRadius: '3px' }}
                                  title={`Use placeholder: (${firstMatch.sourceEnglish})`}
                                >
                                  Placeholder
                                </button>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    {/* UI Control Buttons - Display Mode Controls - Redesigned with consistent button style */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-center gap-3">
                        {/* Gamepad Mode - UI View */}
                        <button
                          onClick={toggleGamepadMode}
                          className={`group relative h-10 px-4 flex items-center gap-2 border transition-all duration-300 ease-out overflow-hidden ${
                            gamepadMode
                              ? 'bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-black border-gray-800 dark:border-gray-200'
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                          }`}
                          style={{ borderRadius: '3px' }}
                          title="Gamepad UI View"
                        >
                          <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM11 7a1 1 0 100 2 1 1 0 000-2zm2 1a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a1 1 0 100 2 1 1 0 000-2zm-2 1a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zm3.293 2.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM15 13a1 1 0 100 2 1 1 0 000-2z"/>
                          </svg>
                          <span className="text-xs font-bold uppercase tracking-wide relative z-10">UI</span>
                          <div className={`absolute inset-0 bg-gradient-to-br ${gamepadMode ? 'from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300' : 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out`} style={{ borderRadius: '3px' }} />
                        </button>

                        {/* Eye Mode - Translation Preview */}
                        <button
                          onClick={gamepadMode ? undefined : toggleEyeMode}
                          disabled={gamepadMode}
                          className={`group relative h-10 px-4 flex items-center gap-2 border transition-all duration-300 ease-out overflow-hidden ${
                            gamepadMode
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                              : eyeMode
                                ? 'bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-black border-gray-800 dark:border-gray-200'
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                          }`}
                          style={{ borderRadius: '3px' }}
                          title={gamepadMode ? "Preview always on in UI View" : "Translation Preview"}
                        >
                          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-xs font-bold uppercase tracking-wide relative z-10">Preview</span>
                          <div className={`absolute inset-0 bg-gradient-to-br ${eyeMode && !gamepadMode ? 'from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300' : 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out`} style={{ borderRadius: '3px' }} />
                        </button>

                        {/* Highlight Mode - Codex Highlights */}
                        <button
                          onClick={toggleHighlightMode}
                          className={`group relative h-10 px-4 flex items-center gap-2 border transition-all duration-300 ease-out overflow-hidden ${
                            highlightMode
                              ? 'bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-black border-gray-800 dark:border-gray-200'
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                          }`}
                          style={{ borderRadius: '3px' }}
                          title="Codex Highlights"
                        >
                          <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z"/>
                          </svg>
                          <span className="text-xs font-bold uppercase tracking-wide relative z-10">Highlight</span>
                          <div className={`absolute inset-0 bg-gradient-to-br ${highlightMode ? 'from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300' : 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out`} style={{ borderRadius: '3px' }} />
                        </button>

                        {/* XLSX Mode Toggle */}
                        <button
                          onClick={toggleXlsxMode}
                          className={`group relative h-10 px-4 flex items-center gap-2 border transition-all duration-300 ease-out overflow-hidden ${
                            xlsxMode
                              ? 'bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-black border-gray-800 dark:border-gray-200'
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                          }`}
                          style={{ borderRadius: '3px' }}
                          title="Reference Data View"
                        >
                          <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                          </svg>
                          <span className="text-xs font-bold uppercase tracking-wide relative z-10">Ref</span>
                          <div className={`absolute inset-0 bg-gradient-to-br ${xlsxMode ? 'from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300' : 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out`} style={{ borderRadius: '3px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Translation Output Tab */}
                {activeTab === 'output' && (
                  <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Translated Output</h3>
              <p className="text-xs text-gray-500 mt-1">Shows row info, but copies translations only</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Export Button */}
              <button
                onClick={exportTranslations}
                className="px-3 py-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide text-sm"
                style={{ borderRadius: '3px' }}
                title="Export translations to CSV file"
              >
                Export
              </button>

              {/* Clear Output Button */}
              <button
                onClick={resetOutputDisplay}
                className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide text-sm"
                style={{ borderRadius: '3px' }}
                title="Clear all translations and start fresh"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div key={outputKey} className="bg-gray-50 dark:bg-gray-700 p-5 border border-black dark:border-gray-600 flex-1 overflow-y-auto shadow-inner custom-scrollbar relative mb-6 flex items-center justify-center">
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex items-center gap-2">
              {/* Eye Icon Button - Toggle Display Mode */}
              <button
                onClick={() => setShowAllEntries(!showAllEntries)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 rounded"
                title={showAllEntries ? "Show only completed entries" : "Show all entries including blanks"}
              >
                {showAllEntries ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                )}
              </button>
              {/* Copy with Refs Button - for reference */}
              <button
                onClick={copyWithCellRefs}
                className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 rounded"
                title="Copy with J column cell refs (e.g., J5: translation)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </button>
              {/* Copy Values Only Button - for Excel paste */}
              <button
                onClick={copyToClipboard}
                className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 rounded"
                title="Copy values only (paste into Excel starting at first modified cell)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              {showCopied && (
                <div className="absolute -top-8 right-0 bg-green-600 dark:bg-green-700 text-white px-2 py-1 text-xs whitespace-nowrap shadow-lg border border-green-800 dark:border-green-900" style={{ borderRadius: '3px' }}>
                  Copied!
                </div>
              )}
            </div>
            {/* Paste Guidance Indicator */}
            {(() => {
              const modifiedEntries = getModifiedEntriesForExcel();
              if (modifiedEntries.length === 0) return null;

              // Check if entries are contiguous (no gaps)
              let isContiguous = true;
              for (let i = 1; i < modifiedEntries.length; i++) {
                if (modifiedEntries[i].excelRow !== modifiedEntries[i-1].excelRow + 1) {
                  isContiguous = false;
                  break;
                }
              }

              if (isContiguous) {
                return (
                  <div className="absolute top-2 left-2 text-xs text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-green-300 dark:border-green-700">
                    Contiguous: paste to {modifiedEntries[0].cellRef}
                    {modifiedEntries.length > 1 && ` (${modifiedEntries.length} rows)`}
                  </div>
                );
              } else {
                return (
                  <div className="absolute top-2 left-2 text-xs text-amber-600 dark:text-amber-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-amber-300 dark:border-amber-700">
                    Non-contiguous: use cell refs
                  </div>
                );
              }
            })()}
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100">
              {(() => {
                const entries = translations.map((trans, idx) => {
                  if (!trans) return null;

                  // When eye is disabled, hide blank entries entirely
                  if (!showAllEntries && trans === '[BLANK, REMOVE LATER]') {
                    return null;
                  }

                  // Check if this translation is different from the original
                  const originalValue = originalTranslations[idx] || '[BLANK, REMOVE LATER]';
                  const hasBeenModified = trans !== originalValue;
                  const wasOriginallyBlank = originalValue === '[BLANK, REMOVE LATER]' || originalValue === '';
                  const isNowFilled = trans !== '[BLANK, REMOVE LATER]' && trans !== '';

                  // Show entry if:
                  // 1. showAllEntries is true (user wants to see everything), OR
                  // 2. The entry has been modified from its original value, OR
                  // 3. The entry was originally blank and now has content
                  if (!showAllEntries && !hasBeenModified && !(wasOriginallyBlank && isNowFilled)) {
                    return null;
                  }

                  // Calculate actual Excel J column cell reference
                  const excelRow = startRow + idx;
                  const cellRef = `J${excelRow}`;
                  const utterer = (utterers && utterers.length > 0 && utterers[idx]) ? `[${trimSpeakerName(utterers[idx])}] ` : '';

                  return { cellRef, utterer, trans, isModified: hasBeenModified || (wasOriginallyBlank && isNowFilled) };
                }).filter(Boolean) as { cellRef: string; utterer: string; trans: string; isModified: boolean }[];

                if (entries.length === 0) {
                  return 'Translations will appear here...';
                }

                return entries.map((entry, i) => (
                  `${entry.cellRef}: ${entry.utterer}${entry.trans}`
                )).join('\n');
              })()}
            </pre>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{currentIndex + 1}</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Current</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{translations.filter(t => t && t !== '[BLANK, REMOVE LATER]').length}</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Filled</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg text-blue-700 dark:text-blue-300">
                {translations.filter((trans, idx) => {
                  if (!trans || trans === '[BLANK, REMOVE LATER]') return false;
                  const originalValue = originalTranslations[idx] || '[BLANK, REMOVE LATER]';
                  return trans !== originalValue;
                }).length}
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">Modified</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{Math.round(progress)}%</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Progress</p>
            </div>
          </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Bar - Auto-detected matches */}
        <QuickReferenceBar
          sourceText={sourceTexts[currentIndex] || ''}
          findCharacterMatches={findCharacterMatches}
          onInsert={insertCharacterName}
          isVisible={xlsxMode || highlightMode}
        />

        {/* XLSX Mode Interface - Full Width Below Grid */}
        <ReferenceToolsPanel
          xlsxMode={xlsxMode}
          toggleXlsxMode={toggleXlsxMode}
          xlsxViewerTab={xlsxViewerTab}
          setXlsxViewerTab={setXlsxViewerTab}
          xlsxData={xlsxData}
          selectedXlsxFile={selectedXlsxFile}
          selectedXlsxSheet={selectedXlsxSheet}
          availableXlsxFiles={availableXlsxFiles}
          xlsxSearchTerm={xlsxSearchTerm}
          setXlsxSearchTerm={setXlsxSearchTerm}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          isLoadingXlsx={isLoadingXlsx}
          loadXlsxData={loadXlsxData}
          setSelectedXlsxSheet={setSelectedXlsxSheet}
          getAvailableSheets={getAvailableSheets}
          getFilteredEntries={getFilteredEntries}
          sourceTexts={sourceTexts}
          currentIndex={currentIndex}
          highlightingJsonData={highlightingJsonData}
          findXlsxMatchesWrapper={findXlsxMatchesWrapper}
          findCharacterMatches={findCharacterMatches}
          insertCharacterName={insertCharacterName}
          insertTranslatedSuggestion={insertTranslatedSuggestion}
          handleCharacterNameClick={handleCharacterNameClick}
          handleHighlightClick={handleHighlightClick}
          darkMode={darkMode}
          copyJsonField={copyJsonField}
        />

        {/* Codex Reference Panel - HIDDEN FOR NOW */}
        {/* 
        <CodexPanel
          codexData={codexData}
          accordionStates={accordionStates}
          isLoadingCodex={isLoadingCodex}
          categoryHasMatches={categoryHasMatches}
          toggleAccordion={toggleAccordion}
          renderCodexItems={renderCodexItems}
        />
        */}

        {/* Video and Codex Buttons */}
        <div className="mt-20 mb-6 text-center">
          <div className="flex justify-center gap-4">
            <VideoButton className="mb-4" />
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
              ref={gradientBarRef}
              className="shadow-lg relative cursor-pointer"
              onMouseEnter={() => setShowVersionHash(true)}
              onMouseLeave={() => setShowVersionHash(false)}
              onClick={() => setGradientColors(generateGradientColors())}
              title="Click to change gradient"
              style={{
                width: '150px',  // Half of 300px (from screen 2)
                height: '37.5px', // Half of 75px (from screen 2)
                backgroundImage: gradientColors.length > 0 
                  ? `linear-gradient(270deg, ${gradientColors.join(', ')}, ${gradientColors[0]})` 
                  : 'linear-gradient(270deg, #3498DB, #9B59B6, #3498DB)',
                backgroundSize: '200% 200%',
                backgroundPosition: '0% 0%'
              }}
            >
              {showVersionHash && (
                <div className="absolute inset-0 flex items-center justify-center bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-20">
                  <div className="text-white text-lg font-black tracking-tight uppercase letter-spacing-wide">
                    {VERSION_HASH}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .gamepad-box {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          font-family: 'VT323', 'Courier New', Courier, monospace;
          letter-spacing: 0.02em;
          text-rendering: optimizeLegibility;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* GAMEPAD BOX CUSTOMIZATION GUIDE:
         * To adjust the gamepad box size and styling, modify these values in the inline style:
         * - width: 600px (box width)
         * - height: 200px (box height) 
         * - fontSize: 2.5rem (MAIN TEXT SIZE - CONTROL HERE)
         * - Speaker fontSize: 2rem (in speaker bar style)
         * - fontFamily: "Pixelify Sans", sans-serif (pixel font)
         * - Dark mode: Handled via Tailwind classes (bg-white dark:bg-gray-900, etc.)
         * - Border: 2px dashed with dark mode support
         */
      `}</style>

    </div>
  );
};


export default TranslationHelper; 