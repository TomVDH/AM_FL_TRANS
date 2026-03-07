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
import { useTranslationState } from '../hooks/useTranslationState';
import SetupWizard from './SetupWizard';
import type { DetectedLanguage } from './LanguageSelector';
import CompletionSummary from './CompletionSummary';
import TranslationReview from './TranslationReview';
import CodexPanel from './CodexPanel';
import TextHighlighter from './TextHighlighter';
import VideoButton from './VideoButton';
import CodexButton from './CodexButton';
import ReferenceToolsPanel from './ReferenceToolsPanel';
import QuickReferenceBar from './QuickReferenceBar';
import ResetConfirmationModal from './ResetConfirmationModal';
import CharacterInfoCard from './CharacterInfoCard';
import { ConversationView } from './ConversationView';
import { useCharacterHighlighting } from '../hooks/useCharacterHighlighting';
import { useEditedTranslations } from '../hooks/useEditedTranslations';
import { useTranslationMemory } from '../hooks/useTranslationMemory';
import { useAiSuggestion } from '../hooks/useAiSuggestion';
import { useWowMode } from '../hooks/useWowMode';
import { useTranslationTimer } from '../hooks/useTranslationTimer';
import { celebrateMilestone } from '../utils/celebrations';

// Stable empty array reference to prevent re-renders from xlsxData || [] pattern
const EMPTY_XLSX_DATA: any[] = [];

const TranslationHelper: React.FC = () => {
  // Translation memory - must be called before useTranslationState to pass callback
  const {
    findMemoryMatches,
    saveToMemory,
  } = useTranslationMemory();

  // Wrapper callback for saving to translation memory
  const handleTranslationSaved = useCallback((source: string, translation: string, file: string, sheet: string, row: number) => {
    saveToMemory({ source, translation, file, sheet, row });
  }, [saveToMemory]);

  const {
    sourceTexts,
    utterers,
    contextNotes,
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
    translationColumn,
    translationColumnIndex,
    targetLanguageLabel,
    detectedLanguages,
    selectedLanguage,
    setDetectedLanguages,
    setSelectedLanguage,
    setTranslationColumn,
    setTargetLanguageLabel,
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
    // COMPLETION FLOW
    showCompletionSummary,
    showReviewMode,
    episodeNumber,
    finishSheet,
    enterReviewMode,
    exitReviewMode,
    resumeTranslation,
    advanceToNextSheet,
    updateTranslationAtIndex,
    exportToCsv,
  } = useTranslationState({ onTranslationSaved: handleTranslationSaved });

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

  // Get Dutch column values from the loaded Excel workbook
  const getDutchColumnValues = (): string[] => {
    if (!workbookData || !selectedSheet || loadedFileType !== 'excel') {
      return [];
    }

    try {
      const worksheet = workbookData.Sheets[selectedSheet];
      if (!worksheet) return [];

      const dutchValues: string[] = [];

      // Read column J starting from startRow
      for (let i = 0; i < sourceTexts.length; i++) {
        const rowNum = startRow + i;
        const cellAddress = `J${rowNum}`;
        const cell = worksheet[cellAddress];

        // Extract the value, handling different cell types
        let value = '';
        if (cell) {
          if (cell.v !== undefined && cell.v !== null) {
            value = String(cell.v).trim();
          }
        }

        dutchValues.push(value);
      }

      return dutchValues;
    } catch (error) {
      console.error('Error reading Dutch column from workbook:', error);
      return [];
    }
  };

  // LIVE EDIT wrappers - sync before navigation
  const handleSubmitWithSync = async () => {
    if (liveEditMode) {
      await syncCurrentTranslation();
    }

    // Check if this is the last entry BEFORE calling handleSubmit
    const isLastEntry = currentIndex === sourceTexts.length - 1;

    handleSubmit();

    // Trigger celebration on milestones when Wow mode is active
    const completedCount = translations.filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length;
    celebrateMilestone(completedCount, isWowMode);

    // Auto-trigger completion flow when submitting the last entry
    if (isLastEntry) {
      finishSheet();
    }
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
    conversationMode,
    toggleDarkMode,
    toggleHighlightMode,
    toggleGamepadMode,
    toggleConversationMode,
  } = useDisplayModes();
  
  const {
    xlsxMode,
    selectedXlsxFile,
    selectedXlsxSheet,
    xlsxSearchTerm,
    xlsxData,
    availableXlsxFiles,
    globalSearch,
    searchAllFiles,
    isLoadingXlsx,
    setSelectedXlsxSheet,
    setXlsxSearchTerm,
    setGlobalSearch,
    setSearchAllFiles,
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
        // Return to Setup
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

  const VERSION_HASH = 'v3.1.0';
  
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({});
  const [codexData, setCodexData] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isLoadingCodex, setIsLoadingCodex] = useState(false);
  const [xlsxViewerTab, setXlsxViewerTab] = useState<'browse' | 'context'>('browse');
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showInlineSource, setShowInlineSource] = useState(true); // true = show EN source, false = show NL translation
  const [showResetModal, setShowResetModal] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [showSpeakerCard, setShowSpeakerCard] = useState(false);

  // Close speaker card when navigating
  useEffect(() => { setShowSpeakerCard(false); }, [currentIndex]);

  const [highlightingJsonData, setHighlightingJsonData] = useState<any>(null);
  const { findJsonMatches, getHoverText } = useJsonHighlighting(highlightingJsonData);
  const { progressBarRef, progressFillRef, animateProgress } = useGradientBarAnimation();
  const { gradientBarRef } = useFooterGradientAnimation();
  const { cardRef, buttonsRef, dialogueBoxRef, animateCardTransition, animateButtonHover } = useInterfaceAnimations();
  const { characterData, findCharacterMatches } = useCharacterHighlighting();
  const { isWowMode, handleWowClick, triggerCelebration } = useWowMode();

  // Translation timer — starts on first translation activity
  const {
    elapsedFormatted,
    remainingFormatted,
    isRunning: timerRunning,
    linesPerMinute,
    togglePause: toggleTimerPause,
  } = useTranslationTimer({
    totalLines: sourceTexts.length,
    completedLines: filterStats.completed,
    isStarted,
    selectedSheet,
  });

  // Create wrapper function for XLSX matches that returns compatible format
  // Trim speaker name — delegates to extractSpeakerName utility
  const trimSpeakerName = (speaker: string | undefined): string => {
    if (!speaker) return '';
    return extractSpeakerName(speaker);
  };

  // Look up current speaker in codex for clickable name feature
  const currentSpeakerCodexEntry = React.useMemo(() => {
    const speakerName = trimSpeakerName(utterers[currentIndex]);
    if (!speakerName || !characterData.length) return null;
    const lower = speakerName.toLowerCase();
    return characterData.find(e =>
      e.english?.toLowerCase() === lower ||
      (e.nicknames && e.nicknames.some((n: string) => n.toLowerCase() === lower))
    ) || null;
  }, [utterers, currentIndex, characterData]);

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

  // Edited translations tracking for repetition detection
  const {
    editedEntries,
    findEditedMatches,
  } = useEditedTranslations({
    sourceTexts,
    translations,
    originalTranslations,
    utterers,
    currentIndex,
    startRow,
  });

  // AI translation suggestion
  const {
    aiSuggestEnabled,
    aiSuggestion,
    isLoadingAiSuggestion,
    aiSuggestError,
    toggleAiSuggest,
    clearAiSuggestion,
  } = useAiSuggestion({
    sourceText: sourceTexts[currentIndex] || '',
    speaker: trimSpeakerName(utterers[currentIndex]),
    context: contextNotes[currentIndex] || '',
    existingTranslation: currentTranslation,
    currentIndex,
  });

  // Combine edited matches with memory matches for QuickReferenceBar
  const findCombinedEditedMatches = useCallback((text: string) => {
    const sessionMatches = findEditedMatches(text);
    const memoryMatches = findMemoryMatches(text);

    // Combine and deduplicate by translation text
    const seen = new Set<string>();
    const combined = [];

    // Session matches first (more recent/relevant)
    for (const match of sessionMatches) {
      const key = match.translatedText.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(match);
      }
    }

    // Then memory matches
    for (const match of memoryMatches) {
      const key = match.translatedText.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push({
          sourceEnglish: match.sourceEnglish,
          translatedText: match.translatedText,
          index: -1, // Memory matches don't have a session index
          rowNumber: match.row || 0,
          utterer: undefined,
        });
      }
    }

    return combined;
  }, [findEditedMatches, findMemoryMatches]);

  // Handle jumping to a specific entry (for edited translations)
  const handleJumpToEntry = useCallback((index: number) => {
    if (index >= 0 && index < sourceTexts.length) {
      setCurrentIndex(index);
      setCurrentTranslation(translations[index] || '');
    }
  }, [sourceTexts.length, setCurrentIndex, setCurrentTranslation, translations]);

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

  // Helper function for keyboard submit that includes completion flow
  const handleKeyboardSubmit = useCallback(() => {
    const isLastEntry = currentIndex === sourceTexts.length - 1;
    handleSubmit();
    // Trigger completion flow when submitting the last entry
    if (isLastEntry) {
      finishSheet();
    }
  }, [currentIndex, sourceTexts.length, handleSubmit, finishSheet]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't process standard shortcuts in conversation mode — ConversationView has its own
      if (conversationMode) return;

      // Only handle shortcuts when textarea is not focused
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        // Allow Enter to submit even from textarea
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          handleKeyboardSubmit();
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
      // A for AI Suggest toggle
      else if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        toggleAiSuggest();
      }
      // Enter for Submit
      else if (e.key === 'Enter') {
        e.preventDefault();
        handleKeyboardSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, sourceTexts.length, translations, handlePrevious, handleSubmit, setCurrentIndex, setCurrentTranslation, xlsxMode, toggleXlsxMode, trimCurrentTranslation, toggleHighlightMode, toggleGamepadMode, toggleAiSuggest, finishSheet, handleKeyboardSubmit, conversationMode]);

  // Handle language selection
  const handleSelectLanguage = useCallback((language: DetectedLanguage) => {
    setSelectedLanguage(language);
    setTranslationColumn(language.column);
    setTargetLanguageLabel(language.code);
  }, [setSelectedLanguage, setTranslationColumn, setTargetLanguageLabel]);

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
        translationColumn={translationColumn}
        setTranslationColumn={setTranslationColumn}
        targetLanguageLabel={targetLanguageLabel}
        setTargetLanguageLabel={setTargetLanguageLabel}
        detectedLanguages={detectedLanguages}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
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
        onVersionBadgeHover={(isHovering) => setShowVersionHash(isHovering)}
        onVersionBadgeClick={() => {
          setGradientColors(generateGradientColors());
          handleWowClick();
        }}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        showResetModal={showResetModal}
        setShowResetModal={setShowResetModal}
        isLoadingExcel={isLoadingExcel}
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
                    <span className="text-sm text-gray-700 dark:text-gray-300">AI Suggest</span>
                    <kbd className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>A</kbd>
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
                className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all duration-300"
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
                  className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all duration-300"
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
                className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all duration-300"
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
                className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all duration-300"
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

        {/* Conditional rendering for completion flow */}
        {showCompletionSummary ? (
          <CompletionSummary
            sheetName={selectedSheet}
            episodeNumber={episodeNumber}
            stats={{ total: filterStats.all, completed: filterStats.completed, blank: filterStats.blank, modified: filterStats.modified }}
            remainingSheets={excelSheets.filter((_, i) => i > excelSheets.indexOf(selectedSheet))}
            onReview={enterReviewMode}
            onExport={exportToCsv}
            onNextSheet={advanceToNextSheet}
            onBackToSetup={handleBackToSetup}
            onContinueEditing={resumeTranslation}
          />
        ) : showReviewMode ? (
          <TranslationReview
            sourceTexts={sourceTexts}
            translations={translations}
            originalTranslations={originalTranslations}
            onUpdateTranslation={updateTranslationAtIndex}
            onBack={exitReviewMode}
          />
        ) : (
          <>
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

                const status = isCompleted ? (isBlank ? 'blank' : 'completed') : (isCurrent ? 'current' : 'pending');
                const ariaLabel = `Entry ${index + 1}: ${status}${utterers[index] ? ` - ${utterers[index]}` : ''}`;

                return (
                  <div
                    key={index}
                    data-segment={index}
                    role="button"
                    tabIndex={-1}
                    aria-label={ariaLabel}
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
                          backgroundImage: darkMode
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
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 space-y-4 shadow-sm transition-all duration-300 flex-1 flex flex-col ${
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
                          {translationColumn}{startRow + currentIndex}
                        </span>
                        {currentSpeakerCodexEntry ? (
                          <button
                            className="text-shadow-pixel cursor-pointer hover:text-purple-300 transition-colors duration-150"
                            onClick={() => setShowSpeakerCard(prev => !prev)}
                            title={`View codex: ${currentSpeakerCodexEntry.english} → ${currentSpeakerCodexEntry.dutch}`}
                            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit' }}
                          >
                            {trimSpeakerName(utterers[currentIndex])}
                            <span className="ml-1 text-[8px] text-purple-400 opacity-70">▼</span>
                          </button>
                        ) : (
                          <span className="text-shadow-pixel">
                            {trimSpeakerName(utterers[currentIndex]) || 'Speaker'}
                          </span>
                        )}
                      </div>
                      {/* Language toggle - switches between EN source and NL translation */}
                      <button
                        onClick={() => setShowInlineSource(prev => !prev)}
                        className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wide border border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-200 rounded"
                        title="Toggle between English source and Dutch translation (E)"
                      >
                        {showInlineSource ? 'EN' : 'NL'}
                      </button>
                    </div>

                    {/* Speaker Character Info Card */}
                    {showSpeakerCard && currentSpeakerCodexEntry && (
                      <div className="mx-2 mt-1">
                        <CharacterInfoCard
                          character={currentSpeakerCodexEntry}
                          onClose={() => setShowSpeakerCard(false)}
                          onInsert={insertCharacterName}
                        />
                      </div>
                    )}

                    {/* Context Notes in Compact Mode */}
                    {contextNotes[currentIndex] && (
                      <div className="mx-2 mt-1 px-2 py-1 bg-amber-900/30 border border-amber-700/50 rounded">
                        <span className="text-xs text-amber-300/80 italic leading-tight">
                          {contextNotes[currentIndex]}
                        </span>
                      </div>
                    )}

                    {/* Main dialogue content area */}
                    <div
                      className="gamepad-dialogue-content relative overflow-y-auto custom-scrollbar"
                      style={{
                        minHeight: '100px',
                        maxHeight: '200px'
                      }}
                    >
                      {showInlineSource ? (
                        /* English source text */
                        <TextHighlighter
                          text={sourceTexts[currentIndex]}
                          jsonData={highlightingJsonData}
                          xlsxData={xlsxData || EMPTY_XLSX_DATA}
                          highlightMode={highlightMode}
                          eyeMode={eyeMode}
                          currentTranslation={currentTranslation}
                          onCharacterClick={insertCharacterName}
                          onSuggestionClick={insertTranslatedSuggestion}
                          onCharacterNameClick={handleCharacterNameClick}
                          onHighlightClick={handleHighlightClick}
                          className="dialogue-content no-suggestions"
                        />
                      ) : (
                        /* Dutch translation */
                        <div className="dialogue-content">
                          {translations[currentIndex] && translations[currentIndex] !== '[BLANK, REMOVE LATER]' ? (
                            <span>{translations[currentIndex]}</span>
                          ) : (
                            <span className="text-gray-400 italic">No translation yet...</span>
                          )}
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
                <div className="space-y-0">
                  {/* n-1 Preview - Clickable to navigate */}
                  {currentIndex > 0 && sourceTexts[currentIndex - 1] && (
                    <button
                      onClick={() => {
                        setCurrentIndex(currentIndex - 1);
                        setCurrentTranslation(translations[currentIndex - 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex - 1] || '');
                      }}
                      className="w-full text-left px-4 py-2 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                      style={{ borderRadius: '3px 3px 0 0' }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center px-1 py-0.5 text-[8px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 shrink-0"
                          style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                        >
                          {translationColumn}{startRow + currentIndex - 1}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate group-hover:text-gray-500 dark:group-hover:text-gray-400">
                          {trimSpeakerName(utterers[currentIndex - 1]) || 'Speaker'} — {sourceTexts[currentIndex - 1]}
                        </span>
                        <svg className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>
                    </button>
                  )}

                  {/* Main Source Text Display - SPOTLIGHT */}
                  <div
                    className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                    style={{
                      borderRadius: currentIndex > 0 && sourceTexts[currentIndex - 1] ? '0' : '3px 3px 0 0',
                    }}
                  >
                    {/* Minimal Header Row */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500"
                          style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                          title={`Excel Row ${startRow + currentIndex}`}
                        >
                          {translationColumn}{startRow + currentIndex}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {trimSpeakerName(utterers[currentIndex]) || 'Speaker'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={copySourceText}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Copy source text"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {xlsxMode && (
                          <button
                            onClick={handleCopySourceToXlsxSearch}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Search in references"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Context Notes - Scene direction/description from column B */}
                    {contextNotes[currentIndex] && (
                      <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50">
                        <div className="flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-amber-800 dark:text-amber-300 italic leading-snug">
                            {contextNotes[currentIndex]}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Source Text - Spotlight */}
                    <div className="px-5 py-4">
                      <div className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100">
                        <TextHighlighter
                          text={sourceTexts[currentIndex]}
                          jsonData={highlightingJsonData}
                          xlsxData={xlsxData || EMPTY_XLSX_DATA}
                          highlightMode={highlightMode}
                          eyeMode={false}
                          currentTranslation={currentTranslation}
                          onCharacterClick={insertCharacterName}
                          onSuggestionClick={insertTranslatedSuggestion}
                          onCharacterNameClick={handleCharacterNameClick}
                          onHighlightClick={handleHighlightClick}
                          className="no-suggestions"
                        />
                      </div>

                      {/* Dutch Translation Preview */}
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        {translations[currentIndex] && translations[currentIndex] !== '[BLANK, REMOVE LATER]' ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            <span className="text-[9px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wide mr-1.5 not-italic">{targetLanguageLabel}:</span>
                            {translations[currentIndex]}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Awaiting translation...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* n+1 Preview - Clickable to navigate */}
                  {currentIndex < sourceTexts.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentIndex(currentIndex + 1);
                        setCurrentTranslation(translations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex + 1] || '');
                      }}
                      className="w-full text-left px-4 py-2 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 border-t-0 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                      style={{ borderRadius: '0 0 3px 3px' }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center px-1 py-0.5 text-[8px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 shrink-0"
                          style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                        >
                          {translationColumn}{startRow + currentIndex + 1}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate group-hover:text-gray-500 dark:group-hover:text-gray-400">
                          {trimSpeakerName(utterers[currentIndex + 1]) || 'Speaker'} — {sourceTexts[currentIndex + 1]}
                        </span>
                        <svg className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
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
              findXlsxMatches={findXlsxMatches}
              findEditedMatches={findCombinedEditedMatches}
              onInsert={insertCharacterName}
              onOpenReferenceTools={() => {
                if (!xlsxMode) toggleXlsxMode();
              }}
              onJumpToEntry={handleJumpToEntry}
              isVisible={xlsxMode || highlightMode}
            />

            {/* spacer to push QuickReferenceBar to bottom of left column */}
            <div className="mt-auto" />
          </div>

          {/* Right Column - Tabbed Interface - Compact */}
          <div className="h-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col" style={{ borderRadius: '3px' }}>
              {/* Content Area */}
              <div className="p-4 flex-1 flex flex-col">
                  <div className="flex flex-col h-full">
                    {/* Mode Toggles + Change Detection - Single Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1 py-0.5" style={{ borderRadius: '3px' }}>
                        {/* View Modes Group */}
                        <button onClick={toggleGamepadMode} className={`p-1.5 transition-all duration-150 ${gamepadMode ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Game View (G)">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM11 7a1 1 0 100 2 1 1 0 000-2zm2 1a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"/></svg>
                        </button>
                        <button
                          onClick={toggleConversationMode}
                          disabled={!isStarted || sourceTexts.length === 0}
                          className={`p-1.5 transition-all duration-150 ${
                            conversationMode
                              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                              : !isStarted || sourceTexts.length === 0
                                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                          }`}
                          style={{ borderRadius: '2px' }}
                          title="Conversation View"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {/* Separator */}
                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-0.5" />

                        {/* Tools Group */}
                        <button onClick={toggleHighlightMode} className={`p-1.5 transition-all duration-150 ${highlightMode ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Codex Highlights (H)">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
                        </button>
                        <button onClick={toggleXlsxMode} className={`p-1.5 transition-all duration-150 ${xlsxMode ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Reference Tools (R)">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                        </button>
                        <button onClick={() => setShowOutput(!showOutput)} className={`p-1.5 transition-all duration-150 ${showOutput ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Toggle Output">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        </button>

                        {/* Separator */}
                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-0.5" />

                        {/* Integrations Group */}
                        <button onClick={toggleAiSuggest} className={`flex items-center gap-1 px-1.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-all duration-150 ${aiSuggestEnabled ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="AI Suggest (A)">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z"/><path d="M15 12l.75 2.25L18 15l-2.25.75L15 18l-.75-2.25L12 15l2.25-.75L15 12z" opacity="0.6"/></svg>
                          <span>AI</span>
                        </button>
                        <button onClick={() => { if (loadedFileType !== 'excel') { toast.error('LIVE EDIT requires an Excel file to be loaded'); return; } setLiveEditMode(!liveEditMode); }} disabled={loadedFileType !== 'excel'} className={`flex items-center gap-1 px-1.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-all duration-150 ${liveEditMode ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30' : loadedFileType !== 'excel' ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title={loadedFileType !== 'excel' ? 'Load an Excel file to enable LIVE EDIT' : 'Live Excel Sync'}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${liveEditMode ? syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : syncStatus === 'synced' ? 'bg-green-500' : syncStatus === 'error' ? 'bg-red-500 animate-pulse' : 'bg-green-500' : 'bg-gray-400'}`} />
                          Live
                        </button>
                      </div>
                      {hasCurrentEntryChanged() ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700" style={{ borderRadius: '3px' }}>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Modified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600" style={{ borderRadius: '3px' }}>
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

                    {/* AI Suggestion Golden Pill */}
                    {aiSuggestEnabled && (isLoadingAiSuggestion || aiSuggestion || aiSuggestError) && (
                      <div className="mt-2">
                        {isLoadingAiSuggestion ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 text-xs font-medium animate-pulse" style={{ borderRadius: '3px' }}>
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            Generating suggestion...
                          </div>
                        ) : aiSuggestError ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-xs" style={{ borderRadius: '3px' }}>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            {aiSuggestError}
                          </div>
                        ) : aiSuggestion ? (
                          <button
                            onClick={() => {
                              insertTranslatedSuggestion(aiSuggestion);
                              clearAiSuggestion();
                              toast.success('AI suggestion inserted');
                            }}
                            className="group inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-300 dark:border-amber-600 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md text-amber-800 dark:text-amber-200 text-xs transition-all duration-150 cursor-pointer max-w-full" style={{ borderRadius: '3px' }}
                            title="Click to insert AI suggestion"
                          >
                            <svg className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z"/></svg>
                            <span className="truncate">{aiSuggestion}</span>
                            <svg className="w-3 h-3 text-amber-400 dark:text-amber-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                          </button>
                        ) : null}
                      </div>
                    )}

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

                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section - Full Width Below Grid */}
        {showOutput && <div className="mt-4">
          <h2 className="text-sm font-black tracking-tight uppercase text-gray-600 dark:text-gray-400 mb-2">
            Translation Output
          </h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md p-4" style={{ borderRadius: '3px' }}>
            <div className="flex flex-col">
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
                    {liveEditMode && (
                      <th className="px-3 py-2 text-left text-xs font-black uppercase tracking-wide text-gray-700 dark:text-gray-300">
                        Excel Column
                      </th>
                    )}
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
                    // Get Dutch column values for live mode comparison
                    const dutchColumnValues = liveEditMode ? getDutchColumnValues() : [];

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
                      const isBlank = trans === '[BLANK, REMOVE LATER]';
                      const dutchValue = liveEditMode && dutchColumnValues[idx] ? dutchColumnValues[idx] : '';

                      return {
                        idx,
                        cellRef,
                        utterer,
                        trans,
                        isModified,
                        isBlank,
                        excelRow,
                        dutchValue
                      };
                    }).filter(Boolean) as {
                      idx: number;
                      cellRef: string;
                      utterer: string;
                      trans: string;
                      isModified: boolean;
                      isBlank: boolean;
                      excelRow: number;
                      dutchValue: string;
                    }[];

                    if (entries.length === 0) {
                      return (
                        <tr>
                          <td colSpan={liveEditMode ? 6 : 5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
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
                        {liveEditMode && (
                          <td className="px-3 py-2">
                            <div className="relative overflow-hidden max-w-xs h-6">
                              {entry.dutchValue ? (
                                entry.dutchValue.length > 40 ? (
                                  <div className="scrolling-text-container">
                                    <span className="scrolling-text text-sm text-blue-700 dark:text-blue-400 font-medium">
                                      {entry.dutchValue}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                                    {entry.dutchValue}
                                  </span>
                                )
                              ) : (
                                <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                                  Empty
                                </span>
                              )}
                            </div>
                          </td>
                        )}
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
            {/* Timer */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimerPause}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title={timerRunning ? 'Pause timer' : 'Timer starts on first translation'}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`font-mono font-bold ${timerRunning ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                  {elapsedFormatted}
                </span>
              </button>
              <div className="flex items-center gap-1" title={linesPerMinute ? `${linesPerMinute.toFixed(1)} lines/min` : 'Estimating...'}>
                <span className="text-gray-500 dark:text-gray-400 font-medium">ETA:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{remainingFormatted}</span>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>}

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
          searchAllFiles={searchAllFiles}
          setSearchAllFiles={setSearchAllFiles}
          isLoadingXlsx={isLoadingXlsx}
          loadXlsxData={loadXlsxData}
          setSelectedXlsxSheet={setSelectedXlsxSheet}
          getAvailableSheets={getAvailableSheets}
          getFilteredEntries={getFilteredEntries}
          sourceTexts={sourceTexts}
          currentIndex={currentIndex}
          currentWorkingSheet={selectedSheet}
          highlightingJsonData={highlightingJsonData}
          findXlsxMatchesWrapper={findXlsxMatchesWrapper}
          findCharacterMatches={findCharacterMatches}
          insertCharacterName={insertCharacterName}
          insertTranslatedSuggestion={insertTranslatedSuggestion}
          handleCharacterNameClick={handleCharacterNameClick}
          handleHighlightClick={handleHighlightClick}
          darkMode={darkMode}
          copyJsonField={copyJsonField}
          editedEntries={editedEntries}
          onJumpToEntry={handleJumpToEntry}
        />

        {/* Codex Reference Panel - HIDDEN FOR NOW */}
        {/*
        <CodexPanel
          codexData={codexData}
          accordionStates={accordionStates}
          isLoadingCodex={isLoadingCodex}
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
              className="group relative h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
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
          </>
        )}
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
            onClick={() => {
              setGradientColors(generateGradientColors());
              handleWowClick();
            }}
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

      {conversationMode && isStarted && sourceTexts.length > 0 && (
        <ConversationView
          sourceTexts={sourceTexts}
          translations={translations}
          originalTranslations={originalTranslations}
          utterers={utterers}
          contextNotes={contextNotes}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          setCurrentTranslation={setCurrentTranslation}
          handleSubmitWithSync={handleSubmitWithSync}
          updateTranslationAtIndex={updateTranslationAtIndex}
          syncStatus={syncStatus}
          selectedSheet={selectedSheet}
          characterData={characterData}
          highlightMode={highlightMode}
          onExit={toggleConversationMode}
        />
      )}

    </div>
  );
};


export default TranslationHelper; 