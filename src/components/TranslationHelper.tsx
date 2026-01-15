'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
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
import ResetConfirmationModal from './ResetConfirmationModal';
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
    resetFromFile,
    exportTranslations,
    jumpToRow,
    outputKey,
    filterOptions,
    filteredIndices,
    filterStats,
    setFilterStatus,
    navigateToNextFiltered,
    navigateToPrevFiltered,
    // LIVE EDIT
    liveEditMode,
    syncStatus,
    lastSyncTime,
    setLiveEditMode,
    toggleLiveEditMode,
    syncCurrentTranslation,
  } = useTranslationState();

  const copyJsonField = (text: string, fieldName: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success(`${fieldName} copied!`);
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
      toast.info('No modified entries to copy');
      return;
    }

    // For Excel pasting: just the translations, one per line
    // User selects starting cell in J column and pastes
    const text = modifiedEntries.map(e => e.value).join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${modifiedEntries.length} translation${modifiedEntries.length > 1 ? 's' : ''}`);
  };

  // Copy with cell references for manual paste (shows where each goes)
  const copyWithCellRefs = () => {
    const modifiedEntries = getModifiedEntriesForExcel();

    if (modifiedEntries.length === 0) {
      toast.info('No modified entries to copy');
      return;
    }

    // Format: "J5: translation text" for each line
    const text = modifiedEntries.map(e => `${e.cellRef}: ${e.value}`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${modifiedEntries.length} with cell refs`);
  };

  // Clear with confirmation to prevent accidental data loss
  const handleClearWithConfirmation = () => {
    const modifiedCount = filterStats.modified;
    if (modifiedCount > 0) {
      const confirmed = window.confirm(
        `You have ${modifiedCount} modified translation${modifiedCount > 1 ? 's' : ''}. Are you sure you want to clear all translations?`
      );
      if (!confirmed) return;
    }
    resetOutputDisplay();
    toast.success('Output cleared');
  };

  // LIVE EDIT wrappers - sync before navigation
  const handleSubmitWithSync = async () => {
    if (liveEditMode) {
      await syncCurrentTranslation();
    }
    handleSubmit();
  };

  const handlePreviousWithSync = async () => {
    if (liveEditMode) {
      await syncCurrentTranslation();
    }
    handlePrevious();
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

  // Reset to originals handler
  const handleResetToOriginals = async () => {
    try {
      const response = await fetch('/api/reset-originals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Reset complete: ${data.copiedFiles.length} file(s) restored`);
        // Return to Screen 1 (Setup Wizard)
        setIsStarted(false);
      } else {
        toast.error(`Reset failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error resetting to originals:', error);
      toast.error('Failed to reset files');
    } finally {
      setShowResetModal(false);
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
  const [showInlineSource, setShowInlineSource] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

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
      // T for Trim whitespace
      else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        trimCurrentTranslation();
      }
      // E for inline source toggle (previously Eye Mode)
      else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setShowInlineSource(prev => !prev);
      }
      // H for Highlight Mode toggle
      else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        toggleHighlightMode();
      }
      // G for Game Mode toggle
      else if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        toggleGamepadMode();
      }
      // Enter for Submit
      else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, sourceTexts.length, translations, handlePrevious, handleSubmit, setCurrentIndex, setCurrentTranslation, xlsxMode, toggleXlsxMode, trimCurrentTranslation, toggleHighlightMode, toggleGamepadMode]);


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
        showResetModal={showResetModal}
        setShowResetModal={setShowResetModal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setShowKeyboardShortcuts(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="keyboard-shortcuts-title"
        >
          <div
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-2xl p-6 max-w-lg w-full mx-4"
            style={{ borderRadius: '3px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 id="keyboard-shortcuts-title" className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">Keyboard Shortcuts</h3>
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
                    <span className="text-sm text-gray-700 dark:text-gray-300">Source Preview</span>
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

      {/* Main Content Area - Flex-grow to push footer down */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-5 pt-3 md:pt-5">
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

              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-gray-100">Translation Helper</h1>
                {selectedSheet && (
                  <>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{selectedSheet}</span>
                  </>
                )}
              </div>
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

            {/* Center: Empty for now */}
            <div className="flex items-center gap-2">
            </div>

            {/* Right: File name + Keyboard Shortcuts + Dark Mode */}
            <div className="flex items-center gap-2">
              {loadedFileName && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[150px] mr-2">
                  {loadedFileName}
                </span>
              )}

              {/* Navigation Button - Filter & Jump */}
              <div className="relative">
                <button
                  onClick={() => setAccordionStates(prev => ({ ...prev, navigation: !prev.navigation }))}
                  className="group relative h-9 w-9 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
                  style={{ borderRadius: '3px' }}
                  aria-label="Navigation menu"
                  title="Filter & Jump"
                >
                  <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
                </button>

                {accordionStates.navigation && (
                  <div className="absolute top-full right-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg z-50 min-w-[200px]" style={{ borderRadius: '3px' }}>
                    {/* Filter Section */}
                    <div className="mb-3">
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Filter</div>
                      <div className="space-y-1">
                        <button
                          onClick={() => { setFilterStatus('all'); }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${
                            filterOptions.status === 'all'
                              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <span>All</span>
                          <span className="text-gray-400 dark:text-gray-500">{filterStats.all}</span>
                        </button>
                        <button
                          onClick={() => { setFilterStatus('completed'); }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${
                            filterOptions.status === 'completed'
                              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Done
                          </span>
                          <span className="text-green-600 dark:text-green-400">{filterStats.completed}</span>
                        </button>
                        <button
                          onClick={() => { setFilterStatus('blank'); }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${
                            filterOptions.status === 'blank'
                              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            Blank
                          </span>
                          <span className="text-red-600 dark:text-red-400">{filterStats.blank}</span>
                        </button>
                      </div>
                    </div>

                    {/* Jump Section */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Jump</div>
                      <div className="flex items-center gap-1.5 mb-2">
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
                          className="w-14 px-1 py-1 text-[10px] text-center font-bold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        <div>
                          <select
                            value={selectedSheet}
                            onChange={(e) => handleSheetChange(e.target.value)}
                            className="w-full p-1 text-[10px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            style={{ borderRadius: '2px' }}
                          >
                            {excelSheets.map(sheet => (
                              <option key={sheet} value={sheet}>{sheet}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
              onClick={handlePreviousWithSync}
              onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
              disabled={currentIndex === 0 || syncStatus === 'syncing'}
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
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={sourceTexts.length}
            aria-label={`Translation progress: ${currentIndex + 1} of ${sourceTexts.length} entries`}
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
                          backgroundImage: isBlank
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
            Translation I/O
          </h2>
        </div>

        {/* Main 2-Column Grid Layout - Tighter gap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Left Column - Translation Card + JSON Settings */}
          <div className="space-y-4 h-full flex flex-col">

            {/* Translation Card - Compact padding */}
            <div
              ref={cardRef}
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-5 space-y-4 shadow-md transition-all duration-300 flex-1 flex flex-col ${
                isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'
              }`}
              style={{
                // Remove bottom radius when QuickReferenceBar is visible (so it underhangs)
                borderRadius: (xlsxMode || highlightMode) ? '3px 3px 0 0' : '3px'
              }}
            >
          <div className="space-y-4">
            <div className="space-y-2">
              {gamepadMode ? (
                <div className="flex flex-col gap-6 items-center">
                  {/* Main Dialogue Box - Modern JRPG Style */}
                  <div
                    ref={dialogueBoxRef}
                    className="gamepad-dialogue-modern relative"
                    style={{
                      width: 'min(520px, 90vw)',
                      minHeight: '180px',
                      maxHeight: '300px',
                      position: 'relative'
                    }}
                  >
                    {/* JRPG-style Name Tab */}
                    <div className="flex items-start justify-between pt-2 px-2">
                      <div className="gamepad-name-tab">
                        {/* Cell Reference Badge */}
                        <span
                          className="inline-flex items-center px-1 py-0.5 text-[9px] font-bold bg-gray-600 text-gray-200 border border-gray-500"
                          style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                          title={`Excel Row ${startRow + currentIndex}`}
                        >
                          J{startRow + currentIndex}
                        </span>
                        <span className="text-shadow-pixel">
                          {trimSpeakerName(utterers[currentIndex]) || 'Speaker'}
                        </span>
                      </div>
                      {/* Inline source toggle */}
                      <button
                        onClick={() => setShowInlineSource(prev => !prev)}
                        className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide border transition-all duration-200 rounded ${
                          showInlineSource
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title="Toggle source preview (E)"
                      >
                        EN
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          {showInlineSource
                            ? <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            : <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          }
                        </svg>
                      </button>
                    </div>

                    {/* Main dialogue content area */}
                    <div
                      className="gamepad-dialogue-content relative overflow-y-auto custom-scrollbar"
                      style={{
                        minHeight: '100px',
                        maxHeight: '200px'
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
                      />

                      {/* Inline source preview within dialogue box */}
                      {showInlineSource && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 font-semibold">
                            Source
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                            {sourceTexts[currentIndex]}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer with action buttons and continue indicator */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-800">
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={copySourceText}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          title="Copy source text"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {xlsxMode && (
                          <button
                            onClick={handleCopySourceToXlsxSearch}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            title="Search this text in Reference Tools"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Animated >>> continue indicator */}
                      <div className="gamepad-continue-indicator">
                        <span>▶</span>
                        <span>▶</span>
                        <span>▶</span>
                      </div>
                    </div>
                  </div>
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
                    {/* Previous Context - Show previous entry for context */}
                    {currentIndex > 0 && sourceTexts[currentIndex - 1] && (
                      <div className="text-left mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-2">
                          {/* Cell reference badge for previous row */}
                          <span
                            className="inline-flex items-center px-1 py-0.5 text-[8px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 shrink-0"
                            style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                            title={`Excel Row ${startRow + currentIndex - 1}`}
                          >
                            J{startRow + currentIndex - 1}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide shrink-0 mt-0.5">Prev</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic line-clamp-2">
                            {utterers[currentIndex - 1] && (
                              <span className="font-medium not-italic text-gray-500 dark:text-gray-400 mr-1">
                                [{trimSpeakerName(utterers[currentIndex - 1])}]
                              </span>
                            )}
                            {sourceTexts[currentIndex - 1].length > 100
                              ? sourceTexts[currentIndex - 1].slice(0, 100) + '...'
                              : sourceTexts[currentIndex - 1]
                            }
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Cell Reference, Source Toggle & Speaker Label */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Cell Reference Badge */}
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500"
                          style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                          title={`Excel Row ${startRow + currentIndex}`}
                        >
                          J{startRow + currentIndex}
                        </span>
                        {/* Source toggle button */}
                        <button
                          onClick={() => setShowInlineSource(prev => !prev)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border transition-colors duration-200 ${
                            showInlineSource
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          style={{ borderRadius: '2px' }}
                          title="Toggle source preview (E)"
                        >
                          <span>EN</span>
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            {showInlineSource
                              ? <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              : <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            }
                          </svg>
                        </button>
                        {/* Speaker label - Show only when speaker exists */}
                        {utterers.length > 0 && utterers[currentIndex] && (
                          <div className="text-left">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Character: </span>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{trimSpeakerName(utterers[currentIndex])}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <TextHighlighter
                      text={sourceTexts[currentIndex]}
                      jsonData={highlightingJsonData}
                      xlsxData={xlsxData || []}
                      highlightMode={highlightMode}
                      eyeMode={false}
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
                              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Character:</span>
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

                  {/* Source Display - Only show when inline source toggle is active */}
                  {showInlineSource && (
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
                      <div className="flex items-start gap-2">
                        {/* Cell reference badge for next row */}
                        <span
                          className="inline-flex items-center px-1 py-0.5 text-[8px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 border border-blue-200 dark:border-blue-700 shrink-0"
                          style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                          title={`Excel Row ${startRow + currentIndex + 1}`}
                        >
                          J{startRow + currentIndex + 1}
                        </span>
                        <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wide shrink-0">Next</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">
                          <span className="font-semibold text-gray-500 dark:text-gray-400">
                            {trimSpeakerName(utterers[currentIndex + 1]) || 'Speaker'}
                          </span>
                          <span className="mx-1 text-gray-300 dark:text-gray-600">—</span>
                          <span className="italic">{sourceTexts[currentIndex + 1]}</span>
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

            </div>

            {/* Quick Reference Bar - Underhangs the left column */}
            <QuickReferenceBar
              sourceText={sourceTexts[currentIndex] || ''}
              findCharacterMatches={findCharacterMatches}
              onInsert={insertCharacterName}
              onOpenReferenceTools={() => {
                if (!xlsxMode) toggleXlsxMode();
              }}
              isVisible={xlsxMode || highlightMode}
            />
          </div>

          {/* Right Column - Tabbed Interface - Compact */}
          <div className="h-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md h-full flex flex-col" style={{ borderRadius: '3px' }}>
              {/* Tab Navigation - Tighter */}
              <div className="flex border-b border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setActiveTab('input')}
                  className={`flex-1 px-3 py-2 font-black tracking-tight uppercase text-xs transition-all duration-200 ${
                    activeTab === 'input'
                      ? 'border-b-2 border-gray-300 dark:border-white text-black dark:text-white bg-gray-50 dark:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Input
                </button>
                <button
                  onClick={() => setActiveTab('output')}
                  className={`flex-1 px-3 py-2 font-black tracking-tight uppercase text-xs transition-all duration-200 ${
                    activeTab === 'output'
                      ? 'border-b-2 border-gray-300 dark:border-white text-black dark:text-white bg-gray-50 dark:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Output
                </button>
              </div>

              {/* Tab Content - Tighter padding */}
              <div className="p-4 flex-1 flex flex-col">

                {/* Translation I/O Tab - Input */}
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
                        if (e.key === 'Enter' && e.shiftKey && syncStatus !== 'syncing') {
                          e.preventDefault();
                          handleSubmitWithSync();
                        }
                      }}
                      className={`w-full p-5 rounded-md focus:ring-2 focus:ring-opacity-30 transition-all duration-200 text-lg leading-relaxed shadow-inner text-gray-900 dark:text-white resize-none flex-1 ${
                        hasCurrentEntryChanged()
                          ? 'border border-green-400 dark:border-green-600 bg-green-50 dark:bg-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-300'
                          : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-gray-300'
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
                          onClick={handleSubmitWithSync}
                          disabled={syncStatus === 'syncing'}
                          className="group relative h-9 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 dark:from-gray-100 dark:via-white dark:to-gray-100 text-white dark:text-black border border-gray-800 dark:border-gray-200 hover:border-gray-700 dark:hover:border-gray-300 hover:shadow-lg active:shadow-inner active:scale-[0.98] transition-all duration-300 ease-out font-bold tracking-wide uppercase text-xs overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ borderRadius: '3px' }}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {syncStatus === 'syncing' ? 'Syncing...' : currentIndex === sourceTexts.length - 1 ? 'Complete' : 'Submit'}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                            </svg>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black dark:from-gray-200 dark:via-gray-100 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
                        </button>

                        {/* XLSX Translation Suggestions - DISABLED per user request */}
                        {/* Suggestions are now only accessible via Reference Tools panel */}
                      </div>
                    </div>

                    {/* UI Control Buttons - Display Mode Controls - Redesigned with consistent button style */}
                    {/* Mode Buttons - Compact version (Phase 2) */}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Gamepad Mode - UI View */}
                        <button
                          onClick={toggleGamepadMode}
                          className={`group relative h-7 px-2.5 flex items-center gap-1 border transition-all duration-200 overflow-hidden ${
                            gamepadMode
                              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-gray-800 dark:border-gray-200'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                          style={{ borderRadius: '3px' }}
                          title="Gamepad UI View"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM11 7a1 1 0 100 2 1 1 0 000-2zm2 1a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a1 1 0 100 2 1 1 0 000-2zm-2 1a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zm3.293 2.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM15 13a1 1 0 100 2 1 1 0 000-2z"/>
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-wide">Game View</span>
                        </button>

                        {/* Highlight Mode - Codex Highlights */}
                        <button
                          onClick={toggleHighlightMode}
                          className={`group relative h-7 px-2.5 flex items-center gap-1 border transition-all duration-200 overflow-hidden ${
                            highlightMode
                              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-gray-800 dark:border-gray-200'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                          style={{ borderRadius: '3px' }}
                          title="Codex Highlights"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z"/>
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-wide">Highlights</span>
                        </button>

                        {/* XLSX Mode Toggle */}
                        <button
                          onClick={toggleXlsxMode}
                          className={`group relative h-7 px-2.5 flex items-center gap-1 border transition-all duration-200 overflow-hidden ${
                            xlsxMode
                              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-gray-800 dark:border-gray-200'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                          style={{ borderRadius: '3px' }}
                          title="Reference Data View (R)"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-wide">References</span>
                        </button>

                        {/* Live Edit Mode Toggle - Only for Excel files */}
                        {loadedFileType === 'excel' && (
                          <button
                            onClick={() => setLiveEditMode(!liveEditMode)}
                            disabled={!loadedFileName}
                            className={`group relative h-7 px-2.5 flex items-center gap-1.5 border transition-all duration-200 overflow-hidden ${
                              liveEditMode
                                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-gray-800 dark:border-gray-200'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                            style={{ borderRadius: '3px' }}
                            title="Live Excel Sync Mode"
                          >
                            {/* Sync Status Indicator */}
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                              syncStatus === 'synced' ? 'bg-green-500' :
                              syncStatus === 'error' ? 'bg-red-500 animate-pulse' :
                              'bg-gray-400'
                            }`} />
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm2 2h3v8H6V8zm5 0h7v2h-7V8zm0 4h7v2h-7v-2z"/>
                            </svg>
                            <span className="text-[10px] font-bold uppercase tracking-wide">Live</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Translation Output Tab */}
                {activeTab === 'output' && (
                  <div className="flex flex-col h-full">
          {/* Mode Toggle & Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Your Translations</h3>
              {/* Mode Toggle Buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => setLiveEditMode(false)}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border transition-all duration-200 ${
                    !liveEditMode
                      ? 'bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 border-gray-600 dark:border-gray-400'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{ borderRadius: '2px' }}
                  title="CSV mode - copy translations for paste into Excel"
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    if (loadedFileType !== 'excel') {
                      toast.error('LIVE EDIT requires an Excel file to be loaded');
                      return;
                    }
                    setLiveEditMode(true);
                  }}
                  disabled={loadedFileType !== 'excel'}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border transition-all duration-200 ${
                    liveEditMode
                      ? 'bg-green-700 text-white border-green-600'
                      : loadedFileType !== 'excel'
                        ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                  style={{ borderRadius: '2px' }}
                  title={loadedFileType !== 'excel' ? 'Load an Excel file to enable LIVE EDIT' : 'LIVE EDIT - saves directly to Excel file'}
                >
                  Live
                </button>
              </div>
              {/* Status Indicator */}
              {liveEditMode && (
                <div className="text-[10px] text-gray-500">
                  {syncStatus === 'syncing' && <span className="text-yellow-600 animate-pulse">●</span>}
                  {syncStatus === 'synced' && <span className="text-green-600">●</span>}
                  {syncStatus === 'error' && <span className="text-red-600">●</span>}
                  {syncStatus === 'idle' && <span className="text-gray-400">○</span>}
                </div>
              )}
            </div>
          </div>

          {/* Table View Container */}
          <div key={outputKey} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex-1 overflow-hidden flex flex-col" style={{ borderRadius: '4px' }}>
            {/* Action Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                {/* Paste Guidance Indicator */}
                {(() => {
                  const modifiedEntries = getModifiedEntriesForExcel();
                  if (modifiedEntries.length === 0) {
                    return (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                        No translations yet
                      </span>
                    );
                  }

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
                      <span className="text-[10px] text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 font-semibold border border-green-200 dark:border-green-800" style={{ borderRadius: '2px' }}>
                        ✓ {modifiedEntries[0].cellRef} ({modifiedEntries.length})
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 font-semibold border border-amber-200 dark:border-amber-800" style={{ borderRadius: '2px' }}>
                        ⚠ Non-contiguous
                      </span>
                    );
                  }
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowAllEntries(!showAllEntries)}
                  className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide border transition-all duration-200 ${
                    showAllEntries
                      ? 'bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 border-gray-600 dark:border-gray-400'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  style={{ borderRadius: '2px' }}
                  title={showAllEntries ? "Show only modified entries" : "Show all entries including blanks"}
                >
                  {showAllEntries ? 'All' : 'Modified'}
                </button>

                {/* Copy with Refs */}
                <button
                  onClick={copyWithCellRefs}
                  className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  style={{ borderRadius: '2px' }}
                  title="Copy with J column cell refs (e.g., J5: translation)"
                >
                  w/ Refs
                </button>

                {/* Copy Values */}
                <button
                  onClick={copyToClipboard}
                  className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  style={{ borderRadius: '2px' }}
                  title="Copy values only (paste into Excel starting at first modified cell)"
                >
                  Values
                </button>

                {/* Reset from File - Only for Excel files */}
                {loadedFileType === 'excel' && (
                  <button
                    onClick={resetFromFile}
                    className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                    style={{ borderRadius: '2px' }}
                    title="Reload translations from the Excel file on disk"
                  >
                    Reset
                  </button>
                )}

                {/* Export */}
                {!liveEditMode && (
                  <button
                    onClick={exportTranslations}
                    className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    style={{ borderRadius: '2px' }}
                    title="Export translations to CSV file"
                  >
                    Export
                  </button>
                )}

                {/* Clear */}
                <button
                  onClick={handleClearWithConfirmation}
                  className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200"
                  style={{ borderRadius: '2px' }}
                  title="Clear all translations and start fresh"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-200 dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-600 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-black uppercase tracking-wide text-gray-700 dark:text-gray-300 w-20">
                      Cell
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-black uppercase tracking-wide text-gray-700 dark:text-gray-300 w-32">
                      Character
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-black uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Dutch Translation
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-gray-700 dark:text-gray-300 w-24">
                      Status
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-gray-700 dark:text-gray-300 w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(() => {
                    const entries = translations.map((trans, idx) => {
                      if (!trans) return null;

                      // When eye is disabled, hide blank entries entirely
                      if (!showAllEntries && trans === '[BLANK, REMOVE LATER]') {
                        return null;
                      }

                      // Check if this translation is different from the original
                      const originalValue = originalTranslations && originalTranslations[idx]
                        ? originalTranslations[idx]
                        : '[BLANK, REMOVE LATER]';
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
                      const utterer = (utterers && utterers.length > 0 && utterers[idx]) ? trimSpeakerName(utterers[idx]) : '';
                      const isModified = hasBeenModified || (wasOriginallyBlank && isNowFilled);

                      // Debug logging (remove after testing)
                      if (idx < 5) {
                        console.log(`Entry ${idx}: trans="${trans}", original="${originalValue}", isModified=${isModified}`);
                      }

                      const isBlank = trans === '[BLANK, REMOVE LATER]';

                      return {
                        idx,
                        cellRef,
                        utterer,
                        trans,
                        isModified,
                        isBlank,
                        excelRow
                      };
                    }).filter(Boolean) as {
                      idx: number;
                      cellRef: string;
                      utterer: string;
                      trans: string;
                      isModified: boolean;
                      isBlank: boolean;
                      excelRow: number;
                    }[];

                    if (entries.length === 0) {
                      return (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                            Translations will appear here...
                          </td>
                        </tr>
                      );
                    }

                    return entries.map((entry, i) => (
                      <tr
                        key={entry.idx}
                        className={`
                          hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150
                          ${entry.idx === currentIndex ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-400 dark:ring-blue-600 ring-inset' : ''}
                          ${entry.isModified ? 'bg-green-50 dark:bg-green-900/10' : ''}
                        `}
                      >
                        <td className="px-3 py-2">
                          <span
                            className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-400 dark:border-gray-600 font-mono"
                            style={{ borderRadius: '3px' }}
                            title={`Excel Row ${entry.excelRow}`}
                          >
                            {entry.cellRef}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {entry.utterer ? (
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 border border-purple-200 dark:border-purple-700" style={{ borderRadius: '3px' }}>
                              {entry.utterer}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                              No speaker
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`text-sm leading-relaxed ${
                            entry.isBlank
                              ? 'text-gray-400 dark:text-gray-500 italic'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {entry.isBlank ? 'Blank entry' : entry.trans}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {entry.isModified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700" style={{ borderRadius: '3px' }}>
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Modified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              Original
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => {
                              setCurrentIndex(entry.idx);
                              setActiveTab('input');
                            }}
                            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                            title="Jump to this entry"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compact Stats Bar */}
          <div className="flex items-center justify-between px-3 py-1 mt-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-[10px]" style={{ borderRadius: '2px' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Row:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{currentIndex + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Done:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{filterStats.completed}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Changed:</span>
                <span className="font-bold text-blue-700 dark:text-blue-400">{filterStats.modified}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Progress:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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

        {/* Video, Codex, and Reset Buttons */}
        <div className="mt-20 mb-6 text-center">
          <div className="flex justify-center gap-2">
            <VideoButton />
            <CodexButton />
            {/* Reset Button */}
            <button
              onClick={() => setShowResetModal(true)}
              className="group relative h-9 w-9 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
              style={{ borderRadius: '3px' }}
              title="Reset to originals (nuclear reset)"
            >
              <svg className="w-4 h-4 relative z-10 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer - Sticky at bottom */}
      <footer className="py-4 px-3 md:px-5 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">
          Onnozelaer Marketing Works © 2025 - built with Claude Code support
        </p>

        {/* Version Badge with Gradient */}
        <div className="flex justify-center items-center gap-2">
          <div
            ref={gradientBarRef}
            className="rounded-sm shadow-md relative cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl"
            onMouseEnter={() => setShowVersionHash(true)}
            onMouseLeave={() => setShowVersionHash(false)}
            onClick={() => setGradientColors(generateGradientColors())}
            title="Click to change gradient"
            style={{
              width: '120px',
              height: '28px',
              backgroundImage: gradientColors.length > 0
                ? `linear-gradient(270deg, ${gradientColors.join(', ')}, ${gradientColors[0]})`
                : 'linear-gradient(270deg, #3498DB, #9B59B6, #3498DB)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 5s ease-in-out infinite',
              borderRadius: '3px'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
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
      </footer>

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetToOriginals}
      />
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
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