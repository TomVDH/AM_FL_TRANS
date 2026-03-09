'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { toast } from '@/lib/toast';
import { useDisplayModes } from '../hooks/useDisplayModes';
import { useXlsxMode } from '../hooks/useXlsxMode';
import { useReferenceColumn as useReferenceColumnHook } from '../hooks/useReferenceColumn';
import { useJsonHighlighting } from '../hooks/useJsonHighlighting';
import { useCharacterDetection } from '../hooks/useCharacterDetection';
import { useUIComponents } from '../hooks/useUIComponents';
import { useTranslationState } from '../hooks/useTranslationState';
import SetupWizard from './SetupWizard';
import type { DetectedLanguage } from './LanguageSelector';
import CompletionSummary from './CompletionSummary';
import TranslationReview from './TranslationReview';
import TextHighlighter from './TextHighlighter';
import VideoButton from './VideoButton';
import CodexButton from './CodexButton';
import ReferenceToolsPanel from './ReferenceToolsPanel';
import FloatingShortcutsPanel from './FloatingShortcutsPanel';
import WorkspaceToolsPanel from './WorkspaceToolsPanel';
import ResetConfirmationModal from './ResetConfirmationModal';
import CharacterInfoCard from './CharacterInfoCard';
import { ConversationView } from './ConversationView';
import { useCharacterHighlighting } from '../hooks/useCharacterHighlighting';
import { useEditedTranslations } from '../hooks/useEditedTranslations';
import { useTranslationMemory } from '../hooks/useTranslationMemory';
import { useAiSuggestion } from '../hooks/useAiSuggestion';
import { useBulkTranslate, type ModelTier, type BulkScope } from '../hooks/useBulkTranslate';
import { useWowMode } from '../hooks/useWowMode';
import { useTranslationTimer } from '../hooks/useTranslationTimer';
import { celebrateMilestone } from '../utils/celebrations';
import AppFooter from './AppFooter';

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
    getLastSession,
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
    toggleLiveEditMode,
    syncCurrentTranslation,
    // Batch sync
    showSyncModal,
    syncModalDirtyCount,
    isBatchSyncing,
    batchSyncProgress,
    batchSyncTotal,
    startBatchSync,
    skipBatchSync,
    closeSyncModal,
    dirtyCount,
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
      // Silent — clipboard action is obvious from context
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

    if (modifiedEntries.length === 0) return;

    // For Excel pasting: just the translations, one per line
    // User selects starting cell in J column and pastes
    const text = modifiedEntries.map(e => e.value).join('\n');
    navigator.clipboard.writeText(text);
  };

  // Copy with cell references for manual paste (shows where each goes)
  const copyWithCellRefs = () => {
    const modifiedEntries = getModifiedEntriesForExcel();

    if (modifiedEntries.length === 0) return;

    // Format: "J5: translation text" for each line
    const text = modifiedEntries.map(e => `${e.cellRef}: ${e.value}`).join('\n');
    navigator.clipboard.writeText(text);
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
      // Open Reference tab in Tools & Data
      setForceToolsTab('reference');

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
  const [codexPopover, setCodexPopover] = useState<{ characterName: string; rect: DOMRect } | null>(null);

  // Close speaker card and codex popover when navigating
  useEffect(() => { setShowSpeakerCard(false); setCodexPopover(null); }, [currentIndex]);

  const [highlightingJsonData, setHighlightingJsonData] = useState<any>(null);
  const { findJsonMatches, getHoverText } = useJsonHighlighting(highlightingJsonData);
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

  const keyboardShortcutsRef = useRef<HTMLButtonElement>(null);

  // Force-tab state for WorkspaceToolsPanel
  const [forceToolsTab, setForceToolsTab] = useState<'reference' | 'quickref' | 'output' | 'bulk' | null>(null);
  const clearForceTab = useCallback(() => setForceToolsTab(null), []);

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

  // Build surrounding lines for AI context (max 5 before, max 5 after)
  const surroundingLines = useMemo(() => {
    const before: { speaker?: string; text: string }[] = [];
    const after: { speaker?: string; text: string }[] = [];

    for (let i = Math.max(0, currentIndex - 5); i < currentIndex; i++) {
      if (sourceTexts[i]?.trim()) {
        before.push({
          speaker: utterers[i] ? trimSpeakerName(utterers[i]) : undefined,
          text: sourceTexts[i],
        });
      }
    }

    for (let i = currentIndex + 1; i <= Math.min(sourceTexts.length - 1, currentIndex + 5); i++) {
      if (sourceTexts[i]?.trim()) {
        after.push({
          speaker: utterers[i] ? trimSpeakerName(utterers[i]) : undefined,
          text: sourceTexts[i],
        });
      }
    }

    return { before, after };
  }, [currentIndex, sourceTexts, utterers]);

  // AI translation suggestion
  const {
    aiSuggestEnabled,
    aiSuggestion,
    aiSuggestionModel,
    isLoadingAiSuggestion,
    isUpgradingAiSuggestion,
    aiSuggestError,
    toggleAiSuggest,
    upgradeAiSuggestion,
    clearAiSuggestion,
  } = useAiSuggestion({
    sourceText: sourceTexts[currentIndex] || '',
    speaker: trimSpeakerName(utterers[currentIndex]),
    context: contextNotes[currentIndex] || '',
    existingTranslation: currentTranslation,
    currentIndex,
    linesBefore: surroundingLines.before,
    linesAfter: surroundingLines.after,
  });

  // Bulk translate with Opus
  const {
    showBulkModal,
    openBulkModal,
    closeBulkModal,
    isBulkTranslating,
    bulkProgress,
    bulkTotal,
    bulkCurrentLine,
    bulkLastSuggestion,
    bulkLastSource,
    bulkSuggestionCount,
    startBulkTranslate,
    stopBulkTranslate,
    showBulkReview,
    bulkResults,
    acceptResult,
    rejectResult,
    updateResultTranslation,
    acceptAll,
    acceptAllEmpty,
    rejectAllChanged,
    exitReview,
    emptyCount,
    translatedCount,
  } = useBulkTranslate({
    sourceTexts,
    utterers,
    translations,
    contextNotes,
    trimSpeakerName,
  });

  // Bulk translate config state
  const [bulkModel, setBulkModel] = useState<ModelTier>('opus');
  const [bulkScope, setBulkScope] = useState<BulkScope>('all');
  const [bulkContextWindow, setBulkContextWindow] = useState(5);
  const [bulkRequestDelay, setBulkRequestDelay] = useState(200);

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

  // Handle character name click — show popover with codex info
  const handleCharacterNameClick = useCallback((characterName: string, event?: React.MouseEvent) => {
    if (!event) return; // Need position for popover
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    // Toggle off if same character
    if (codexPopover?.characterName === characterName) {
      setCodexPopover(null);
    } else {
      setCodexPopover({ characterName, rect });
    }
  }, [codexPopover]);

  // Handle highlight click to jump to Data Viewer
  const handleHighlightClick = useCallback((entry: any, type: 'json' | 'xlsx' | 'character') => {
    // Open Reference tab in Tools & Data
    setForceToolsTab('reference');

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
  }, [xlsxData, availableXlsxFiles, loadXlsxData, setXlsxSearchTerm]);

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

      // Cmd+I / Ctrl+I — replace with AI suggestion
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        if (aiSuggestion) {
          setCurrentTranslation(aiSuggestion);
          clearAiSuggestion();
        }
        return;
      }

      // Ctrl+Shift+T for AI Translate Sheet — works from anywhere
      if (e.key.toLowerCase() === 't' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        openBulkModal();
        return;
      }

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
  }, [currentIndex, sourceTexts.length, translations, handlePrevious, handleSubmit, setCurrentIndex, setCurrentTranslation, xlsxMode, toggleXlsxMode, trimCurrentTranslation, toggleHighlightMode, toggleGamepadMode, toggleAiSuggest, finishSheet, handleKeyboardSubmit, conversationMode, openBulkModal, aiSuggestion, insertTranslatedSuggestion, clearAiSuggestion]);

  // Handle language selection
  const handleSelectLanguage = useCallback((language: DetectedLanguage) => {
    setSelectedLanguage(language);
    setTranslationColumn(language.column);
    setTargetLanguageLabel(language.code);
  }, [setSelectedLanguage, setTranslationColumn, setTargetLanguageLabel]);

  if (!isStarted) {
    return (
      <SetupWizard
        lastSession={getLastSession()}
        handleResumeSession={(session: any) => {
          if (session?.fileName && handleExistingFileLoad) {
            handleExistingFileLoad(session.fileName);
          }
        }}
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
      {/* Main Content Area - Flex-grow to push footer down */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-5 pt-3 md:pt-5 flex flex-col">
        {/* Header — Two-Row Bar */}
        <div className="mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm" style={{ borderRadius: '3px' }}>
          {/* Row 0: Logo banner + file info + timer */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
            <button
              onClick={handleBackToSetup}
              className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              title="Go to Setup"
              aria-label="Go to Setup"
            >
              <img src="/images/asses-masses-logo.png" alt="Asses Masses" className="h-10 w-auto" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] leading-tight">asses.masses — Translation Workbench</span>
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                  {loadedFileName || 'Untitled'}
                </span>
                {selectedSheet && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 truncate shrink-0">
                    — {selectedSheet}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1" />
            <button
              onClick={toggleTimerPause}
              className="flex items-center gap-1.5 text-xs tabular-nums shrink-0"
              title={timerRunning ? 'Pause timer' : 'Timer starts on first translation'}
            >
              <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-mono font-bold ${timerRunning ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                {elapsedFormatted}
              </span>
            </button>
          </div>
          {/* Row 1: Navigation + View Modes + Utility buttons */}
          <div className="flex items-center justify-between py-2 px-4">
            {/* Left: Nav controls */}
            <div className="flex items-center gap-2">
            {/* Prev — styled button */}
            <button
              onClick={handlePreviousWithSync}
              disabled={currentIndex === 0 || syncStatus === 'syncing'}
              className="group relative h-7 w-7 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              style={{ borderRadius: '3px' }}
              aria-label="Previous entry"
              title="Previous (←)"
            >
              <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            {/* Progress Bar — refined */}
            <div
              role="progressbar"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={sourceTexts.length}
              aria-label={`Translation progress: ${currentIndex + 1} of ${sourceTexts.length}`}
              className="relative h-1.5 bg-gray-200/60 dark:bg-gray-700/40 overflow-hidden flex-1 min-w-[80px] max-w-[320px]"
              style={{ borderRadius: '4px' }}
            >
              {sourceTexts.length <= 50 ? (
                <div className="absolute inset-0 flex gap-px">
                  {sourceTexts.map((_, index) => {
                    const isCompleted = index < currentIndex;
                    const isBlank = translations[index] === '' || translations[index] === '[BLANK, REMOVE LATER]';
                    const isCurrent = index === currentIndex;
                    return (
                      <div key={index} role="presentation" className="relative h-full" style={{ width: `${100 / sourceTexts.length}%` }}>
                        <div className={`absolute inset-0 transition-colors duration-200 ${isCompleted ? isBlank ? 'bg-amber-400/70 dark:bg-amber-500/60' : 'bg-emerald-400 dark:bg-emerald-500' : isCurrent ? 'bg-gray-400 dark:bg-gray-500 animate-pulse' : ''}`} style={{ borderRadius: '1px' }} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                (() => {
                  const completed = translations.slice(0, currentIndex).filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length;
                  const blank = currentIndex - completed;
                  const total = sourceTexts.length;
                  return (
                    <>
                      <div className="absolute inset-y-0 left-0 bg-emerald-400 dark:bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${(completed / total) * 100}%`, borderRadius: '4px' }} />
                      <div className="absolute inset-y-0 bg-amber-400/70 dark:bg-amber-500/60 transition-all duration-500 ease-out" style={{ left: `${(completed / total) * 100}%`, width: `${(blank / total) * 100}%` }} />
                      <div className="absolute inset-y-0 bg-gray-400 dark:bg-gray-500 animate-pulse transition-all duration-500" style={{ left: `${(currentIndex / total) * 100}%`, width: `${Math.max(1 / total, 0.5) * 100}%`, borderRadius: '4px' }} />
                    </>
                  );
                })()
              )}
            </div>
            {/* Counter */}
            <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums shrink-0 font-medium">
              {currentIndex + 1}/{sourceTexts.length} · {sourceTexts.length > 0 ? Math.round((translations.filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length / sourceTexts.length) * 100) : 0}%
            </span>
            {/* Next — styled button */}
            <button
              onClick={() => {
                if (currentIndex < sourceTexts.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setCurrentTranslation(translations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex + 1] || '');
                }
              }}
              disabled={currentIndex >= sourceTexts.length - 1}
              className="group relative h-7 w-7 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              style={{ borderRadius: '3px' }}
              aria-label="Next entry"
              title="Next (→)"
            >
              <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            </div>
            {/* Center: View Switcher — icon-only */}
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-0.5 shrink-0" style={{ borderRadius: '3px' }}>
              <button
                onClick={() => { if (gamepadMode) toggleGamepadMode(); if (conversationMode) toggleConversationMode(); }}
                className={`flex items-center justify-center w-7 h-6 transition-colors ${!gamepadMode && !conversationMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                style={{ borderRadius: '2px' }}
                title="Standard"
                aria-label="Standard mode"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
              <button
                onClick={() => { if (!gamepadMode) toggleGamepadMode(); if (conversationMode) toggleConversationMode(); }}
                className={`flex items-center justify-center w-7 h-6 transition-colors ${gamepadMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                style={{ borderRadius: '2px' }}
                title="Gamepad"
                aria-label="Gamepad mode"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
              <button
                onClick={() => { if (gamepadMode) toggleGamepadMode(); if (!conversationMode) toggleConversationMode(); }}
                disabled={!isStarted || sourceTexts.length === 0}
                className={`relative flex items-center justify-center w-7 h-6 transition-colors ${conversationMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:text-gray-300 dark:disabled:text-gray-600'}`}
                style={{ borderRadius: '2px' }}
                title="Conversation (beta)"
                aria-label="Conversation mode"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-white dark:border-gray-800" title="beta" />
              </button>
            </div>
            {/* Right: Utility buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Live Excel Sync — moved from HARO bar */}
              {loadedFileType === 'excel' && (
                <button
                  onClick={toggleLiveEditMode}
                  className={`h-7 px-2 flex items-center gap-1.5 text-xs font-medium transition-all ${liveEditMode ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  title={liveEditMode ? `Live Excel Sync (${syncStatus})` : 'Enable Live Excel Sync'}
                  aria-label="Toggle live edit mode"
                  aria-pressed={liveEditMode}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${liveEditMode ? syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : syncStatus === 'error' ? 'bg-red-500' : 'bg-green-500' : 'bg-gray-400'}`} />
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              )}
              {/* Filter & Jump */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setAccordionStates(prev => ({ ...prev, navigation: !prev.navigation }))}
                  className="group relative h-7 px-2.5 flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                  style={{ borderRadius: '3px' }}
                  aria-label="Filter and jump"
                  title="Filter & Jump"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                {accordionStates.navigation && (
                  <div className="absolute top-full right-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-[60] min-w-[200px]" style={{ borderRadius: '3px' }}>
                    {/* Filter Section */}
                    <div className="mb-3">
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Filter</div>
                      <div className="space-y-1">
                        <button onClick={() => { setFilterStatus('all'); }} className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${filterOptions.status === 'all' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`} style={{ borderRadius: '2px' }}>
                          <span>All</span>
                          <span className="text-gray-400 dark:text-gray-500">{filterStats.all}</span>
                        </button>
                        <button onClick={() => { setFilterStatus('completed'); }} className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${filterOptions.status === 'completed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`} style={{ borderRadius: '2px' }}>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" />Done</span>
                          <span className="text-green-600 dark:text-green-400">{filterStats.completed}</span>
                        </button>
                        <button onClick={() => { setFilterStatus('blank'); }} className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${filterOptions.status === 'blank' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`} style={{ borderRadius: '2px' }}>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full" />Blank</span>
                          <span className="text-red-600 dark:text-red-400">{filterStats.blank}</span>
                        </button>
                      </div>
                    </div>
                    {/* Jump Section */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Jump</div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <button onClick={() => { const ni = Math.max(0, currentIndex - 5); setCurrentIndex(ni); setCurrentTranslation(translations[ni] === '[BLANK, REMOVE LATER]' ? '' : translations[ni] || ''); }} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" style={{ borderRadius: '2px' }}>-5</button>
                        <button onClick={() => { const ni = Math.max(0, currentIndex - 1); setCurrentIndex(ni); setCurrentTranslation(translations[ni] === '[BLANK, REMOVE LATER]' ? '' : translations[ni] || ''); }} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" style={{ borderRadius: '2px' }}>-1</button>
                        <input type="number" min={startRow} max={startRow + sourceTexts.length - 1} value={startRow + currentIndex} onChange={(e) => { const rn = parseInt(e.target.value); if (rn >= startRow && rn < startRow + sourceTexts.length) { jumpToRow(rn); } }} className="w-14 px-1 py-1 text-[10px] text-center font-bold border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" style={{ borderRadius: '2px' }} />
                        <button onClick={() => { const ni = Math.min(sourceTexts.length - 1, currentIndex + 1); setCurrentIndex(ni); setCurrentTranslation(translations[ni] === '[BLANK, REMOVE LATER]' ? '' : translations[ni] || ''); }} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" style={{ borderRadius: '2px' }}>+1</button>
                        <button onClick={() => { const ni = Math.min(sourceTexts.length - 1, currentIndex + 5); setCurrentIndex(ni); setCurrentTranslation(translations[ni] === '[BLANK, REMOVE LATER]' ? '' : translations[ni] || ''); }} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" style={{ borderRadius: '2px' }}>+5</button>
                      </div>
                      {excelSheets.length > 1 && (
                        <select value={selectedSheet} onChange={(e) => handleSheetChange(e.target.value)} className="w-full p-1 text-[10px] border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" style={{ borderRadius: '2px' }}>
                          {excelSheets.map(sheet => (<option key={sheet} value={sheet}>{sheet}</option>))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Keyboard Shortcuts */}
              <div className="relative shrink-0">
                <button
                  ref={keyboardShortcutsRef}
                  onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                  className="group relative h-7 px-2.5 flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                  style={{ borderRadius: '3px' }}
                  aria-label="Keyboard shortcuts"
                  title="Keyboard shortcuts"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </button>
                <FloatingShortcutsPanel
                  isOpen={showKeyboardShortcuts}
                  onClose={() => setShowKeyboardShortcuts(false)}
                  anchorRef={keyboardShortcutsRef}
                />
              </div>
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="shrink-0 group relative h-7 px-2.5 flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                style={{ borderRadius: '3px' }}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
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
        {/* Center-floating workspace */}
        <div className="flex-1 flex flex-col justify-center min-h-0 -mt-8">
        {/* Main 2-Column Grid Layout — 50/50 centered */}
        <div className="grid grid-cols-2 gap-6 items-center">
          {/* Left Column — Source */}
          <div className="flex flex-col">

            <div className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-2">
              {gamepadMode ? (
                <div className="flex flex-col gap-6 items-center">
                  {/* Main Dialogue Box - Modern JRPG Style */}
                  <div
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
                        <span className="text-shadow-pixel">
                          {trimSpeakerName(utterers[currentIndex]) || 'Speaker'}
                        </span>
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
                      <div className="mx-2 mt-1 px-2 py-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic leading-tight">
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
                        <button
                            onClick={handleCopySourceToXlsxSearch}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            title="Search this text in Reference Tools"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </button>
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
                  {/* n-1 Preview - One-line clickable */}
                  {currentIndex > 0 && sourceTexts[currentIndex - 1] && (
                    <button
                      onClick={() => {
                        setCurrentIndex(currentIndex - 1);
                        setCurrentTranslation(translations[currentIndex - 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex - 1] || '');
                      }}
                      className="w-full text-left py-1 px-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                    >
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate block group-hover:text-gray-500 dark:group-hover:text-gray-400">
                        ← {translationColumn}{startRow + currentIndex - 1} {trimSpeakerName(utterers[currentIndex - 1]) || ''} — {sourceTexts[currentIndex - 1]}
                      </span>
                    </button>
                  )}

                  {/* Main Source Text Display */}
                  <div className="relative">
                    {/* Header Row — cell ref + speaker */}
                    <div className="flex items-center gap-2 px-1 py-2 border-b border-gray-200/40 dark:border-gray-700/30">
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500"
                        style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                        title={`Excel Row ${startRow + currentIndex}`}
                      >
                        {translationColumn}{startRow + currentIndex}
                      </span>
                      {currentSpeakerCodexEntry ? (
                        <button
                          className="text-sm font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 underline decoration-purple-300 dark:decoration-purple-600 underline-offset-2 transition-colors duration-150 cursor-pointer"
                          onClick={(e) => {
                            const rect = (e.target as HTMLElement).getBoundingClientRect();
                            const speakerName = trimSpeakerName(utterers[currentIndex]);
                            if (codexPopover?.characterName === speakerName) {
                              setCodexPopover(null);
                            } else {
                              setCodexPopover({ characterName: speakerName, rect });
                            }
                          }}
                          title={`View codex: ${currentSpeakerCodexEntry.english} → ${currentSpeakerCodexEntry.dutch}`}
                          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }}
                        >
                          {trimSpeakerName(utterers[currentIndex])}
                          <span className="ml-1 text-[8px] text-purple-400 dark:text-purple-500 opacity-70">▼</span>
                        </button>
                      ) : (
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {trimSpeakerName(utterers[currentIndex]) || 'Speaker'}
                        </span>
                      )}
                    </div>

                    {/* Speaker Character Info Card (default view) */}
                    {!gamepadMode && showSpeakerCard && currentSpeakerCodexEntry && (
                      <div className="px-4 py-2 border-b border-purple-200 dark:border-purple-800/50">
                        <CharacterInfoCard
                          character={currentSpeakerCodexEntry}
                          onClose={() => setShowSpeakerCard(false)}
                          onInsert={insertCharacterName}
                        />
                      </div>
                    )}

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
                      <div className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30">
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

                    {/* AI Suggestion — soft golden glow, no box */}
                    {aiSuggestEnabled && (isLoadingAiSuggestion || isUpgradingAiSuggestion || aiSuggestion || aiSuggestError) && (
                      <div className="mx-4 mt-3 mb-1 px-1">
                        {isLoadingAiSuggestion && !isUpgradingAiSuggestion ? (
                          <div className="inline-flex items-center gap-2 text-amber-500/60 dark:text-amber-400/50 text-xs animate-pulse">
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            AI generating...
                          </div>
                        ) : aiSuggestError ? (
                          <div className="inline-flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            {aiSuggestError}
                          </div>
                        ) : aiSuggestion ? (
                          <div className="flex items-start gap-2 text-xs">
                            <svg className="w-3 h-3 text-amber-400/60 dark:text-amber-500/40 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            <button
                              onClick={() => { setCurrentTranslation(aiSuggestion); clearAiSuggestion(); }}
                              className="flex-1 text-left transition-colors cursor-pointer italic"
                              style={{ color: 'rgb(180 140 60 / 0.7)', textShadow: '0 0 8px rgb(217 176 75 / 0.25), 0 0 20px rgb(217 176 75 / 0.1)' }}
                              title="Click to replace with suggestion (⌘I)"
                            >
                              &ldquo;{aiSuggestion}&rdquo;
                            </button>
                            <span className="shrink-0 px-1 py-0.5 text-[9px] font-medium text-amber-500/50 dark:text-amber-500/40">
                              {aiSuggestionModel || 'haiku'}
                            </span>
                            {aiSuggestionModel === 'haiku' && !isUpgradingAiSuggestion && (
                              <button onClick={(e) => { e.stopPropagation(); upgradeAiSuggestion(); }} className="shrink-0 p-0.5 text-amber-400/50 hover:text-amber-500 dark:hover:text-amber-300 transition-colors" title="Upgrade to Sonnet">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>
                              </button>
                            )}
                            {isUpgradingAiSuggestion && (
                              <div className="shrink-0 p-0.5 text-amber-400/50 animate-pulse">
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                              </div>
                            )}
                            <button onClick={clearAiSuggestion} className="shrink-0 p-0.5 text-gray-400/40 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" title="Dismiss">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* n+1 Preview - One-line clickable */}
                  {currentIndex < sourceTexts.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentIndex(currentIndex + 1);
                        setCurrentTranslation(translations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex + 1] || '');
                      }}
                      className="w-full text-left py-1 px-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                    >
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate block group-hover:text-gray-500 dark:group-hover:text-gray-400">
                        → {translationColumn}{startRow + currentIndex + 1} {trimSpeakerName(utterers[currentIndex + 1]) || ''} — {sourceTexts[currentIndex + 1]}
                      </span>
                    </button>
                  )}

                </div>
              )}
            </div>
          </div>

          </div>

          {/* Right Column — Elevated Card with Embedded Toolbar */}
          <div className="h-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md h-full flex flex-col" style={{ borderRadius: '3px' }}>
              {/* Embedded Toolbar — icon-only tool toggles + submit */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                {/* Left: Tool Toggles — icon-only, compact */}
                <div className="flex items-center gap-1">
                  <button onClick={toggleHighlightMode} className={`group relative flex items-center justify-center w-7 h-7 border transition-all duration-200 overflow-hidden ${highlightMode ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-500' : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} style={{ borderRadius: '3px' }} title="Codex Highlights (H)" aria-label="Toggle codex highlights" aria-pressed={highlightMode}>
                    <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button onClick={toggleAiSuggest} className={`group relative flex items-center justify-center w-7 h-7 border transition-all duration-200 overflow-hidden ${aiSuggestEnabled ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-500' : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} style={{ borderRadius: '3px' }} title="AI Suggest (A)" aria-label="Toggle AI suggestions" aria-pressed={aiSuggestEnabled}>
                    <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
                  <button onClick={() => setForceToolsTab('reference')} className="group relative flex items-center justify-center w-7 h-7 border transition-all duration-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300" style={{ borderRadius: '3px' }} title="Open Reference Panel (R)" aria-label="Open reference panel">
                    <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button onClick={() => setForceToolsTab('output')} className="group relative flex items-center justify-center w-7 h-7 border transition-all duration-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300" style={{ borderRadius: '3px' }} title="Open Output Panel (O)" aria-label="Open output panel">
                    <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>

                {/* Right: Modified indicator + Submit */}
                <div className="flex items-center gap-2">
                  {hasCurrentEntryChanged() && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 font-medium">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Modified
                    </span>
                  )}
                  <button
                    onClick={handleSubmitWithSync}
                    disabled={syncStatus === 'syncing'}
                    className="h-7 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-black border border-gray-800 dark:border-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-[0.98] transition-all font-bold tracking-wide uppercase text-[10px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    style={{ borderRadius: '3px' }}
                    title="Submit (Shift+Enter)"
                  >
                    {syncStatus === 'syncing' ? 'Syncing...' : currentIndex === sourceTexts.length - 1 ? 'Finish' : 'Submit'}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Textarea — dominant, fills remaining height */}
              <div className="flex-1 flex flex-col">
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
                  className={`w-full px-4 py-3 focus:outline-none transition-colors duration-200 text-base leading-relaxed text-gray-900 dark:text-white resize-none flex-1 border-0 ${
                    hasCurrentEntryChanged()
                      ? 'bg-green-50/50 dark:bg-green-900/10'
                      : 'bg-white dark:bg-gray-800'
                  }`}
                  placeholder="Enter your translation..."
                  aria-label={`Translation for entry ${currentIndex + 1} of ${sourceTexts.length}`}
                  autoFocus
                />
                <div className="flex items-center justify-between px-4 py-1.5 border-t border-gray-100 dark:border-gray-700/50">
                  {hasCurrentEntryChanged() && (
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" title="Modified" />
                  )}
                  <span className="ml-auto text-[10px] text-gray-300 dark:text-gray-600">
                    Shift+Enter to submit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Codex Popover — triggered by clicking a purple pill in source text */}
        {codexPopover && (() => {
          const entry = characterData.find(e => {
            const lower = codexPopover.characterName.toLowerCase();
            return e.english?.toLowerCase() === lower ||
              (e.nicknames && e.nicknames.some((n: string) => n.toLowerCase() === lower));
          });
          if (!entry) return null;
          const top = codexPopover.rect.bottom + window.scrollY + 6;
          const left = Math.min(
            codexPopover.rect.left + window.scrollX,
            window.innerWidth - 340
          );
          const hasRichInfo = entry.gender || entry.dialogueStyle || entry.dutchDialogueStyle || entry.bio;
          return (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCodexPopover(null)} />
              <div
                className="absolute z-50 min-w-[200px] max-w-[480px] w-max shadow-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 animate-in fade-in slide-in-from-top-1 duration-150"
                style={{ top, left, borderRadius: '4px' }}
              >
                {hasRichInfo ? (
                  <CharacterInfoCard
                    character={entry}
                    onClose={() => setCodexPopover(null)}
                    onInsert={insertCharacterName}
                  />
                ) : (
                  <div className="px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-900 dark:text-purple-100 whitespace-nowrap">{entry.english}</span>
                      <span className="text-[10px] text-purple-400 dark:text-purple-500">&rarr;</span>
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 whitespace-nowrap">{entry.dutch}</span>
                      {entry.category && (
                        <span className="text-[9px] px-1 py-0.5 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 shrink-0" style={{ borderRadius: '2px' }}>{entry.category}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => { insertCharacterName(entry.dutch); setCodexPopover(null); }}
                        className="p-1 text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-700 transition-colors"
                        style={{ borderRadius: '2px' }}
                        title={`Insert "${entry.dutch}"`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCodexPopover(null)}
                        className="p-1 text-purple-400 dark:text-purple-500 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-700 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          );
        })()}

        </div>
        {/* Tools & Data — hugs footer, auto-height */}
        <div className="shrink-0">
        <WorkspaceToolsPanel
          forceTab={forceToolsTab}
          onForceTabHandled={clearForceTab}
          renderReference={() => (
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
          )}
          renderQuickRef={() => (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="text-xs text-gray-400 italic">Translation memory matches will appear here.</p>
            </div>
          )}
          renderOutput={() => (
            <div>
          {/* Mode Toggle & Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Your Translations</h3>
              {liveEditMode && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-green-700 text-white border border-green-600" style={{ borderRadius: '2px' }}>
                  Live
                </span>
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
                {/* Filter Toggle — both modes */}
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

                {liveEditMode ? (
                  <>
                    {/* Sync to Excel — Live mode only */}
                    <button
                      onClick={startBatchSync}
                      disabled={dirtyCount === 0 || isBatchSyncing}
                      className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide border transition-all duration-200 ${
                        isBatchSyncing
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700 animate-pulse'
                          : dirtyCount > 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800/40'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                      }`}
                      style={{ borderRadius: '2px' }}
                      title={dirtyCount > 0 ? `Sync ${dirtyCount} unsaved translation(s) to Excel` : 'All translations are synced'}
                    >
                      {isBatchSyncing ? 'Syncing...' : `Sync to Excel${dirtyCount > 0 ? ` (${dirtyCount})` : ''}`}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Copy with Refs — Copy mode only */}
                    <button
                      onClick={copyWithCellRefs}
                      className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      style={{ borderRadius: '2px' }}
                      title="Copy with J column cell refs (e.g., J5: translation)"
                    >
                      w/ Refs
                    </button>

                    {/* Copy Values — Copy mode only */}
                    <button
                      onClick={copyToClipboard}
                      className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      style={{ borderRadius: '2px' }}
                      title="Copy values only (paste into Excel starting at first modified cell)"
                    >
                      Values
                    </button>

                    {/* Export — Copy mode only */}
                    <button
                      onClick={exportTranslations}
                      className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      style={{ borderRadius: '2px' }}
                      title="Export translations to CSV file"
                    >
                      Export
                    </button>
                  </>
                )}

                {/* Reset from File — Excel files, both modes */}
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

                {/* Clear — both modes */}
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
          )}
          renderBulkTranslate={() => (
            <div className="space-y-4">
              {isBulkTranslating ? (
                /* Active bulk translate progress — pinned in panel */
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-block w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-gray-800 dark:border-t-gray-200 rounded-full animate-spin shrink-0" />
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight">AI Translating</span>
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{bulkProgress}/{bulkTotal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">{Math.round((bulkProgress / Math.max(bulkTotal, 1)) * 100)}%</span>
                      <button onClick={stopBulkTranslate} className="h-7 px-2.5 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" style={{ borderRadius: '3px' }} title="Stop translation">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="1" /></svg>
                        Stop
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3" style={{ borderRadius: '2px' }}>
                    <div className="h-full bg-gradient-to-r from-gray-600 to-gray-900 dark:from-gray-400 dark:to-gray-200 transition-all duration-300 ease-out" style={{ width: `${(bulkProgress / Math.max(bulkTotal, 1)) * 100}%`, borderRadius: '2px' }} />
                  </div>
                  {/* Last translation preview */}
                  <div className="min-h-[3.5rem] px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/40" style={{ borderRadius: '3px' }}>
                    {bulkLastSuggestion ? (
                      <div key={bulkSuggestionCount} className="animate-slide-up-fade">
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{bulkLastSource.substring(0, 80)}{bulkLastSource.length > 80 ? '...' : ''}</div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium truncate mt-1">→ {bulkLastSuggestion}</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                        {bulkCurrentLine || 'Starting...'}
                      </div>
                    )}
                  </div>
                  {/* Stats */}
                  <div className="flex gap-4 text-xs mt-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700" style={{ borderRadius: '2px' }}>
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span className="text-gray-600 dark:text-gray-300"><span className="font-bold">{emptyCount}</span> empty</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/30" style={{ borderRadius: '2px' }}>
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-blue-700 dark:text-blue-300"><span className="font-bold">{translatedCount}</span> translated</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Idle state — start button */
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Translate Sheet</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Translate all {sourceTexts.length} lines with AI</p>
                    </div>
                    <div className="relative">
                      <button
                        disabled
                        className="h-8 px-4 bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 cursor-not-allowed font-bold tracking-wide uppercase text-xs flex items-center gap-1.5"
                        style={{ borderRadius: '3px' }}
                        title="AI Bulk Translate"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                        Start Bulk Translate
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700" style={{ borderRadius: '2px' }}>
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span className="text-gray-600 dark:text-gray-300"><span className="font-bold">{emptyCount}</span> empty</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/30" style={{ borderRadius: '2px' }}>
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-blue-700 dark:text-blue-300"><span className="font-bold">{translatedCount}</span> translated</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          referenceCount={1}
          outputCount={translations.filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length}
          bulkStatus={isBulkTranslating ? `${Math.round((bulkProgress / Math.max(bulkTotal, 1)) * 100)}%` : undefined}
        />
        </div>
          </>
        )}
      </main>

      <AppFooter
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        gradientColors={gradientColors}
        showVersionHash={showVersionHash}
        VERSION_HASH={VERSION_HASH}
        onVersionBadgeHover={(hovering) => setShowVersionHash(hovering)}
        onVersionBadgeClick={() => {
          setGradientColors(generateGradientColors());
          handleWowClick();
        }}
        variant="translation"
        renderActions={isStarted ? () => (
          <>
            <VideoButton />
            <CodexButton />
            <button
              onClick={() => setShowResetModal(true)}
              className="group relative h-7 px-2.5 flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 overflow-hidden"
              style={{ borderRadius: '3px' }}
              title="Reset to originals"
            >
              <svg className="w-3 h-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-medium relative z-10">Reset</span>
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </>
        ) : undefined}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetToOriginals}
      />

      {/* Batch Sync Modal — shown when toggling LIVE EDIT on with unsaved changes */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl w-full max-w-md mx-4 p-6" style={{ borderRadius: '6px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase">Unsaved Changes</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sync to Excel file</p>
              </div>
            </div>

            {!isBatchSyncing ? (
              <>
                <div className="space-y-3 mb-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-amber-600 dark:text-amber-400">{syncModalDirtyCount}</span> translation{syncModalDirtyCount !== 1 ? 's were' : ' was'} entered while Live Edit was off.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sync now to persist them to the Excel file, or skip to sync them individually as you navigate.
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={skipBatchSync}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={startBatchSync}
                    className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all"
                    style={{ borderRadius: '4px' }}
                  >
                    Sync Now
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>{batchSyncProgress} / {batchSyncTotal} lines</span>
                    <span>{Math.round((batchSyncProgress / Math.max(batchSyncTotal, 1)) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${(batchSyncProgress / Math.max(batchSyncTotal, 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Syncing changes to Excel...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Translate Config Modal — only shown before translation starts */}
      {showBulkModal && !isBulkTranslating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-lg mx-4 p-6" style={{ borderRadius: '6px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #374151, #111827)' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z"/><path d="M15 12l.75 2.25L18 15l-2.25.75L15 18l-.75-2.25L12 15l2.25-.75L15 12z" opacity="0.6"/></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Translate Sheet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{sourceTexts.length} lines · Powered by Claude</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Model selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Model</label>
                <div className="flex border border-gray-200 dark:border-gray-600 overflow-hidden" style={{ borderRadius: '3px' }}>
                  {([
                    { id: 'haiku' as ModelTier, label: 'Haiku', desc: 'Fast & cheap' },
                    { id: 'sonnet' as ModelTier, label: 'Sonnet', desc: 'Balanced' },
                    { id: 'opus' as ModelTier, label: 'Opus', desc: 'Best quality' },
                  ]).map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => setBulkModel(m.id)}
                      className={`flex-1 px-3 py-2 text-xs font-bold transition-all ${
                        i < 2 ? 'border-r border-gray-200 dark:border-gray-600' : ''
                      } ${
                        bulkModel === m.id
                          ? m.id === 'haiku'
                            ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div>{m.label}</div>
                      <div className={`text-[9px] font-normal mt-0.5 ${bulkModel === m.id ? 'opacity-70' : 'opacity-50'}`}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scope selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Scope</label>
                <div className="flex border border-gray-200 dark:border-gray-600 overflow-hidden" style={{ borderRadius: '3px' }}>
                  {([
                    { id: 'all' as BulkScope, label: 'All lines' },
                    { id: 'empty' as BulkScope, label: 'Empty only' },
                    { id: 'from-current' as BulkScope, label: 'From current' },
                  ]).map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setBulkScope(s.id)}
                      className={`flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all ${
                        i < 2 ? 'border-r border-gray-200 dark:border-gray-600' : ''
                      } ${
                        bulkScope === s.id
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Window slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Context Window</label>
                  <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{bulkContextWindow} {bulkContextWindow === 1 ? 'line' : 'lines'}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={bulkContextWindow}
                  onChange={(e) => setBulkContextWindow(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-gray-800 dark:accent-gray-300"
                />
                <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                  <span>0</span>
                  <span>10</span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Lines before and after each entry sent as context to the AI</p>
              </div>

              {/* Request Delay slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Request Delay</label>
                  <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{bulkRequestDelay}ms</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={50}
                  value={bulkRequestDelay}
                  onChange={(e) => setBulkRequestDelay(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-gray-800 dark:accent-gray-300"
                />
                <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                  <span>0</span>
                  <span>1s</span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Delay between API calls — increase if hitting rate limits</p>
              </div>

              {/* Stats badges */}
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700" style={{ borderRadius: '2px' }}>
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="text-gray-600 dark:text-gray-300"><span className="font-bold">{emptyCount}</span> empty</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/30" style={{ borderRadius: '2px' }}>
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-blue-700 dark:text-blue-300"><span className="font-bold">{translatedCount}</span> translated</span>
                </div>
              </div>

              {/* Info banner */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-xs text-amber-800 dark:text-amber-200" style={{ borderRadius: '3px' }}>
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                <span>You&apos;ll review all changes in a diff view before accepting.</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeBulkModal} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Cancel</button>
              <button
                onClick={() => {
                  setForceToolsTab('bulk');
                  startBulkTranslate({
                    model: bulkModel,
                    scope: bulkScope,
                    contextWindow: bulkContextWindow,
                    requestDelay: bulkRequestDelay,
                    startIndex: currentIndex,
                  });
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 shadow-md hover:shadow-lg transition-all"
                style={{ borderRadius: '3px' }}
              >
                Start Translation
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Bulk Translate Review Mode */}
      {showBulkReview && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {/* Review Header — matches ResetConfirmationModal / CompletionSummary header pattern */}
          <div className="shrink-0 border-b-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900" style={{ borderRadius: '3px' }}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z"/><path d="M15 12l.75 2.25L18 15l-2.25.75L15 18l-.75-2.25L12 15l2.25-.75L15 12z" opacity="0.6"/></svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Review AI Translations</h2>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{bulkResults.length} lines to review</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{bulkResults.filter(r => r.wasEmpty).length} new · {bulkResults.filter(r => !r.wasEmpty).length} changed</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const accepted = acceptAllEmpty();
                    if (accepted.size > 0) {
                      const updated = [...translations];
                      accepted.forEach((translation, idx) => { updated[idx] = translation; });
                      setTranslations(updated);
                      toast.success(`Accepted ${accepted.size} empty-line translations`);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-green-700 dark:text-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
                  style={{ borderRadius: '3px' }}
                >
                  Accept Empty
                </button>
                <button
                  onClick={() => {
                    rejectAllChanged();
                    toast.info('Rejected all re-translations');
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
                  style={{ borderRadius: '3px' }}
                >
                  Reject Changed
                </button>
                <button
                  onClick={() => {
                    const accepted = acceptAll();
                    if (accepted.size > 0) {
                      const updated = [...translations];
                      accepted.forEach((translation, idx) => { updated[idx] = translation; });
                      setTranslations(updated);
                      toast.success(`Accepted all ${accepted.size} translations`);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-500 dark:to-emerald-600 border border-green-700 dark:border-green-600 hover:border-green-600 dark:hover:border-green-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
                  style={{ borderRadius: '3px' }}
                >
                  Accept All
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
                <button
                  onClick={exitReview}
                  className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
                  style={{ borderRadius: '3px' }}
                >
                  Exit Review
                </button>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto py-6 px-6 space-y-4">
              {bulkResults.map((result) => (
                <div
                  key={result.index}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ borderRadius: '3px' }}
                >
                  {/* Line header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 font-mono tracking-wide">#{result.index + 1}</span>
                      {result.speaker && (
                        <span className="text-xs font-black text-gray-600 dark:text-gray-400 tracking-tight">[{result.speaker}]</span>
                      )}
                      {result.wasEmpty && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                          style={{ borderRadius: '2px' }}
                        >
                          new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const translation = acceptResult(result.index);
                          if (translation) {
                            const updated = [...translations];
                            updated[result.index] = translation;
                            setTranslations(updated);
                            toast.success(`Accepted line ${result.index + 1}`);
                          }
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold text-white bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-500 dark:to-emerald-600 border border-green-700 dark:border-green-600 hover:border-green-600 dark:hover:border-green-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
                        style={{ borderRadius: '3px' }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          rejectResult(result.index);
                          toast.info(`Kept original for line ${result.index + 1}`);
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
                        style={{ borderRadius: '3px' }}
                      >
                        Keep Old
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 py-3 space-y-2.5">
                    {/* Source */}
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-widest mr-2">EN</span>
                      {result.sourceText}
                    </div>

                    {/* Old translation (if existed) */}
                    {!result.wasEmpty && result.originalTranslation && (
                      <div className="text-sm text-gray-400 dark:text-gray-500 line-through decoration-gray-300 dark:decoration-gray-600">
                        <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-widest mr-2 no-underline">WAS</span>
                        {result.originalTranslation}
                      </div>
                    )}

                    {/* Opus translation — editable */}
                    <div
                      className="relative bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 focus-within:border-green-400 dark:focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-300 dark:focus-within:ring-green-700 transition-all"
                      style={{ borderRadius: '3px' }}
                    >
                      <span className="absolute top-2 left-3 text-[9px] font-bold uppercase text-green-500 dark:text-green-400 tracking-widest pointer-events-none">NL</span>
                      <textarea
                        value={result.opusTranslation}
                        onChange={(e) => updateResultTranslation(result.index, e.target.value)}
                        className="w-full text-sm text-green-800 dark:text-green-200 bg-transparent pl-8 pr-3 py-2 resize-none focus:outline-none"
                        rows={Math.max(1, Math.ceil(result.opusTranslation.length / 80))}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {bulkResults.length === 0 && (
                <div className="text-center py-16">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 mb-4"
                    style={{ borderRadius: '3px' }}
                  >
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase mb-1">All Reviewed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Every translation has been processed.</p>
                  <button
                    onClick={exitReview}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white dark:text-black border border-gray-800 dark:border-gray-200 hover:shadow-lg transition-all duration-300 ease-out tracking-tight uppercase"
                    style={{ borderRadius: '3px' }}
                  >
                    Back to Translation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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