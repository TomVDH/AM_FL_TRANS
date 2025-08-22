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
    handleStart,
    handleBackToSetup,
    handleSubmit,
    handlePrevious,
    handleSourceInput,
    handleFileUpload,
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

  const copyToClipboard = () => {
    const text = translations.join('\n');
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
      console.log('Set XLSX search term to:', sourceText);
    }
  };
  
  const VERSION_HASH = 'v2.3.0';
  
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({});
  const [codexData, setCodexData] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isLoadingCodex, setIsLoadingCodex] = useState(false);
  const [xlsxViewerTab, setXlsxViewerTab] = useState<'browse' | 'context'>('browse');

  const [highlightingJsonData, setHighlightingJsonData] = useState<any>(null);
  const { findJsonMatches, getHoverText } = useJsonHighlighting(highlightingJsonData);
  const { progressBarRef, progressFillRef, animateProgress } = useGradientBarAnimation();
  const { gradientBarRef } = useFooterGradientAnimation();
  const { cardRef, buttonsRef, dialogueBoxRef, animateCardTransition, animateButtonHover } = useInterfaceAnimations();
  const { characterData, findCharacterMatches } = useCharacterHighlighting();

  // Create wrapper function for XLSX matches that returns compatible format
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
    
    // Scroll to the XLSX viewer section after a brief delay
    setTimeout(() => {
      const xlsxViewer = document.querySelector('.xlsx-viewer-section');
      if (xlsxViewer) {
        xlsxViewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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
        handleFileUpload={handleFileUpload}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300" style={{ animation: 'fadeIn 0.5s ease-out' }}>
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

      {/* Back to Setup Floating Button */}
      <button
        onClick={handleBackToSetup}
        className="fixed top-4 left-4 p-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
        style={{ borderRadius: '3px' }}
        aria-label="Back to setup"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>


      <div className="max-w-7xl mx-auto">
        {/* Header - Centered above grid */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3 tracking-tighter text-gray-900 dark:text-gray-100">Translation Helper</h1>
          {selectedSheet && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Sheet: {selectedSheet}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {getCellLocation(currentIndex)} • Item {currentIndex + 1} of {sourceTexts.length}
          </p>
          
          {/* Jump to Row and Sheet Change */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {/* Jump to Row */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Jump to:</label>
              <input
                type="number"
                min={startRow}
                max={startRow + sourceTexts.length - 1}
                placeholder={`${startRow}-${startRow + sourceTexts.length - 1}`}
                className="w-20 p-2 text-sm border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white"
                style={{ borderRadius: '3px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const rowNumber = parseInt(e.currentTarget.value);
                    if (rowNumber >= startRow && rowNumber < startRow + sourceTexts.length) {
                      jumpToRow(rowNumber);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
            
            {/* Sheet Change - Only show if Excel sheets are available */}
            {excelSheets.length > 1 && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Sheet:</label>
                <select
                  value={selectedSheet}
                  onChange={(e) => handleSheetChange(e.target.value)}
                  className="p-2 text-sm border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white"
                  style={{ borderRadius: '3px' }}
                >
                  {excelSheets.map(sheet => (
                    <option key={sheet} value={sheet}>{sheet}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Progress Bar - Dynamic fill with gaps for blank entries */}
        <div 
          ref={progressBarRef}
          className="relative h-3 bg-gray-200 dark:bg-gray-700 border border-black dark:border-gray-600 overflow-hidden shadow-inner cursor-pointer transition-all duration-300 mb-8"
        >
          <div className="absolute inset-0 flex">
            {sourceTexts.map((_, index) => {
              const isCompleted = index < currentIndex; // Only completed when we've moved past it
              const isBlank = translations[index] === '' || translations[index] === '[BLANK, REMOVE LATER]';
              const isCurrent = index === currentIndex;
              const isJustCompleted = index === currentIndex - 1; // The pip that was just submitted
              const segmentWidth = (100 / sourceTexts.length);
              
              return (
                <div
                  key={index}
                  className="relative h-full transition-all duration-300"
                  style={{ 
                    width: `${segmentWidth}%`,
                    borderRight: index < sourceTexts.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {isCompleted && (
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        isBlank 
                          ? 'bg-red-800 dark:bg-red-900' // Dark red for blank entries
                          : 'bg-green-500 dark:bg-green-400' // Green for completed translations
                      }`}
                      style={{
                        backgroundImage: (darkMode 
                          ? `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 2px,
                              rgba(255, 255, 255, 0.35) 2px,
                              rgba(255, 255, 255, 0.35) 4px
                            )`
                          : `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 2px,
                              rgba(0, 0, 0, 0.2) 2px,
                              rgba(0, 0, 0, 0.2) 4px
                            )`),
                        animation: (!isBlank && isJustCompleted) ? 'pipGlow 1s ease-out' : undefined,
                        boxShadow: isBlank 
                          ? '0 0 6px rgba(127, 29, 29, 0.5)' // Dark red glow for blank
                          : (!isBlank && isJustCompleted) 
                            ? '0 0 8px rgba(34, 197, 94, 0.6)' // Green glow for successful
                            : undefined
                      }}
                    />
                  )}
                  {isCurrent && !isCompleted && (
                    <div 
                      className="absolute inset-0 bg-gray-400 dark:bg-gray-500 opacity-50" 
                      style={{
                        boxShadow: '0 0 8px rgba(156, 163, 175, 0.6)' // Gray glow for active/current
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Translation Card + JSON Settings */}
          <div className="space-y-8">

            {/* Translation Card */}
            <div 
              ref={cardRef}
              className={`bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-8 space-y-8 shadow-md transition-all duration-300 ${
                isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'
              }`}
              style={{ borderRadius: '3px' }}
            >
          <div className="space-y-6">
            {utterers.length > 0 && utterers[currentIndex] && (
              <div className="mb-4">
                <label className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-2">Speaker</label>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">{utterers[currentIndex]}</p>
              </div>
            )}
            <div className="space-y-2">
              {gamepadMode ? (
                <div className="flex gap-8 justify-center">
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
                        {(() => {
                          const utterer = utterers[currentIndex];
                          if (!utterer) return 'Speaker';
                          const parts = utterer.split('.');
                          return parts.length >= 4 ? parts[3] : utterer;
                        })()}
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
                        className="p-1 text-gray-400 hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-20 rounded"
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
                          className="p-1 text-gray-400 hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-20 rounded"
                          title="Search this text in XLSX viewer"
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
                          className="p-1 text-gray-400 hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-20 rounded"
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
                            className="p-1 text-gray-400 hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-20 rounded"
                            title="Search this text in XLSX viewer"
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
                        title="Search this text in XLSX viewer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h6" />
                        </svg>
                      </button>
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
                      className="no-suggestions"
                    />
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
                              title="Search this text in XLSX viewer"
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
                        className="no-suggestions"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>



          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Translation</label>
              <div className="flex items-center gap-3">
                {/* Reference Column UI - DISABLED FOR MVP
                {useReferenceColumn && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-300 px-3 py-1 font-bold shadow-sm border border-blue-600 dark:border-blue-600" style={{ borderRadius: '3px' }}>
                    Verification Mode
                  </span>
                )}
                */}
                {/* Gamepad Mode - UI View */}
                <button
                  onClick={toggleGamepadMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  title="UI View"
                >
                  <svg className={`w-5 h-5 ${gamepadMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM11 7a1 1 0 100 2 1 1 0 000-2zm2 1a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a1 1 0 100 2 1 1 0 000-2zm-2 1a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zm3.293 2.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM15 13a1 1 0 100 2 1 1 0 000-2z"/>
                  </svg>
                </button>
                {/* Eye Mode - Translation Preview */}
                <button
                  onClick={toggleEyeMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  title="Translation Preview"
                >
                  {eyeMode ? (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
                {/* Highlight Mode - Codex Highlights */}
                <button
                  onClick={toggleHighlightMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  title="Codex Highlights"
                >
                  {highlightMode ? (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C11.4477 2 11 2.44772 11 3V4C11 4.55228 11.4477 5 12 5C12.5523 5 13 4.55228 13 4V3C13 2.44772 12.5523 2 12 2Z"/>
                      <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z"/>
                      <path d="M12 19C11.4477 19 11 19.4477 11 20V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V20C13 19.4477 12.5523 19 12 19Z"/>
                      <path d="M5.63604 5.63604C5.24551 6.02656 5.24551 6.65973 5.63604 7.05025L6.34315 7.75736C6.73367 8.14788 7.36683 8.14788 7.75736 7.75736C8.14788 7.36683 8.14788 6.73367 7.75736 6.34315L7.05025 5.63604C6.65973 5.24551 6.02656 5.24551 5.63604 5.63604Z"/>
                      <path d="M18.364 5.63604C17.9735 5.24551 17.3403 5.24551 16.9497 5.63604L16.2426 6.34315C15.8521 6.73367 15.8521 7.36683 16.2426 7.75736C16.6332 8.14788 17.2663 8.14788 17.6569 7.75736L18.364 7.05025C18.7545 6.65973 18.7545 6.02656 18.364 5.63604Z"/>
                      <path d="M2 12C2 11.4477 2.44772 11 3 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H3C2.44772 13 2 12.5523 2 12Z"/>
                      <path d="M20 11C19.4477 11 19 11.4477 19 12C19 12.5523 19.4477 13 20 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H20Z"/>
                      <path d="M7.75736 16.2426C7.36683 15.8521 6.73367 15.8521 6.34315 16.2426L5.63604 16.9497C5.24551 17.3403 5.24551 17.9735 5.63604 18.364C6.02656 18.7545 6.65973 18.7545 7.05025 18.364L7.75736 17.6569C8.14788 17.2663 8.14788 16.6332 7.75736 16.2426Z"/>
                      <path d="M17.6569 16.2426C17.2663 15.8521 16.6332 15.8521 16.2426 16.2426C15.8521 16.6332 15.8521 17.2663 16.2426 17.6569L16.9497 18.364C17.3403 18.7545 17.9735 18.7545 18.364 18.364C18.7545 17.9735 18.7545 17.3403 18.364 16.9497L17.6569 16.2426Z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C11.4477 2 11 2.44772 11 3V4C11 4.55228 11.4477 5 12 5C12.5523 5 13 4.55228 13 4V3C13 2.44772 12.5523 2 12 2Z"/>
                      <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z"/>
                      <path d="M12 19C11.4477 19 11 19.4477 11 20V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V20C13 19.4477 12.5523 19 12 19Z"/>
                      <path d="M5.63604 5.63604C5.24551 6.02656 5.24551 6.65973 5.63604 7.05025L6.34315 7.75736C6.73367 8.14788 7.36683 8.14788 7.75736 7.75736C8.14788 7.36683 8.14788 6.73367 7.75736 6.34315L7.05025 5.63604C6.65973 5.24551 6.02656 5.24551 5.63604 5.63604Z"/>
                      <path d="M18.364 5.63604C17.9735 5.24551 17.3403 5.24551 16.9497 5.63604L16.2426 6.34315C15.8521 6.73367 15.8521 7.36683 16.2426 7.75736C16.6332 8.14788 17.2663 8.14788 17.6569 7.75736L18.364 7.05025C18.7545 6.65973 18.7545 6.02656 18.364 5.63604Z"/>
                      <path d="M2 12C2 11.4477 2.44772 11 3 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H3C2.44772 13 2 12.5523 2 12Z"/>
                      <path d="M20 11C19.4477 11 19 11.4477 19 12C19 12.5523 19.4477 13 20 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H20Z"/>
                      <path d="M7.75736 16.2426C7.36683 15.8521 6.73367 15.8521 6.34315 16.2426L5.63604 16.9497C5.24551 17.3403 5.24551 17.9735 5.63604 18.364C6.02656 18.7545 6.65973 18.7545 7.05025 18.364L7.75736 17.6569C8.14788 17.2663 8.14788 16.6332 7.75736 16.2426Z"/>
                      <path d="M17.6569 16.2426C17.2663 15.8521 16.6332 15.8521 16.2426 16.2426C15.8521 16.6332 15.8521 17.2663 16.2426 17.6569L16.9497 18.364C17.3403 18.7545 17.9735 18.7545 18.364 18.364C18.7545 17.9735 18.7545 17.3403 18.364 16.9497L17.6569 16.2426Z"/>
                    </svg>
                  )}
                </button>
                {/* XLSX Mode Toggle */}
                <button
                  onClick={toggleXlsxMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  title="XLSX Data View"
                >
                  <svg className={`w-5 h-5 ${xlsxMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </button>
              </div>
            </div>
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
              className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-md focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-30 transition-all duration-200 text-lg leading-relaxed bg-gray-50 dark:bg-gray-700 shadow-inner dark:text-white resize-none"
              placeholder="Enter your translation..."
              rows={3}
              autoFocus
            />
            <div className="mt-2">
              <div className="flex items-start justify-between">
                <p className="text-xs text-gray-500">
                  Press Shift+Enter to submit
                </p>
                
                {/* XLSX Translation Suggestions */}
                {xlsxData && (() => {
                  const matches = findXlsxMatchesWrapper(sourceTexts[currentIndex] || '');
                  if (matches.length > 0) {
                    // Sort matches by relevance: exact phrase matches first, then by length (longest first)
                    const sortedMatches = matches.sort((a, b) => {
                      const text = sourceTexts[currentIndex] || '';
                      const aIsExact = a.sourceEnglish.toLowerCase() === text.toLowerCase();
                      const bIsExact = b.sourceEnglish.toLowerCase() === text.toLowerCase();
                      
                      if (aIsExact && !bIsExact) return -1;
                      if (!aIsExact && bIsExact) return 1;
                      
                      // If both are exact or both are partial, sort by length (longest first)
                      return b.sourceEnglish.length - a.sourceEnglish.length;
                    });
                    
                    console.log('🔧 TranslationHelper Debug: Sorted XLSX matches:', sortedMatches.map(m => ({
                      sourceEnglish: m.sourceEnglish,
                      translatedDutch: m.translatedDutch,
                      category: m.category
                    })));
                    
                    const firstMatch = sortedMatches[0];
                    console.log('🔧 TranslationHelper Debug: Using XLSX match:', firstMatch.sourceEnglish, 'for text:', sourceTexts[currentIndex]);
                    return (
                      <div className="flex flex-wrap gap-2 justify-end ml-4" style={{ maxWidth: '50%' }}>
                        {/* Translated Dutch Suggestion */}
                        {firstMatch.translatedDutch && firstMatch.translatedDutch.trim() !== '' && (
                          <button
                            onClick={() => insertTranslatedSuggestion(firstMatch.translatedDutch)}
                            className="px-3 py-1 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-200 font-medium whitespace-nowrap"
                            style={{ 
                              borderRadius: '3px'
                            }}
                            title={`Use Dutch translation: ${firstMatch.translatedDutch}`}
                          >
                            {firstMatch.translatedDutch}
                          </button>
                        )}
                        
                        {/* Placeholder Button */}
                        <button
                          onClick={() => insertPlaceholder(firstMatch.sourceEnglish)}
                          className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600 hover:bg-orange-200 dark:hover:bg-orange-700 transition-colors duration-200 font-medium whitespace-nowrap"
                          style={{ 
                            borderRadius: '3px'
                          }}
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
          </div>

          <div ref={buttonsRef} className="flex gap-3">
            <button
              onClick={handlePrevious}
              onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border border-black dark:border-gray-600 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm font-black tracking-tight uppercase letter-spacing-wide text-sm"
              style={{ 
                borderRadius: '3px'
              }}
            >
              ‹ Previous
            </button>
            <button
              onClick={handleSubmit}
              onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
              className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide text-sm"
              style={{ 
                borderRadius: '3px'
              }}
            >
              {currentIndex === sourceTexts.length - 1 ? 'Complete ✓' : 'Submit & Next ›'}
            </button>
          </div>

            </div>
          </div>

          {/* Right Column - Translated Output */}
          <div className="h-full">
            {/* Output Section */}
            <div className={`bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 shadow-md transition-transform duration-200 h-full flex flex-col ${
              showCopied ? 'transform scale-95' : 'transform scale-100'
            }`} style={{ borderRadius: '3px' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Translated Output</h3>
              <p className="text-xs text-gray-500 mt-1">Shows row info, but copies translations only</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Trim Current Button */}
              <button
                onClick={trimCurrentTranslation}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide text-sm"
                style={{ borderRadius: '3px' }}
                title="Trim whitespace from current translation"
              >
                Trim
              </button>
              
              {/* Export Button */}
              <button
                onClick={exportTranslations}
                className="px-3 py-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide text-sm"
                style={{ borderRadius: '3px' }}
                title="Export all translations to file"
              >
                Export
              </button>
              
              {/* Reset Output Button */}
              <button
                onClick={resetOutputDisplay}
                className="px-3 py-2 bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600 hover:bg-orange-200 dark:hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide text-sm"
                style={{ borderRadius: '3px' }}
                title="Clear and refresh translation output display"
              >
                Refresh
              </button>
              
            </div>
          </div>
          
          <div key={outputKey} className="bg-gray-50 dark:bg-gray-700 p-5 border border-black dark:border-gray-600 max-h-48 overflow-y-auto shadow-inner custom-scrollbar relative mb-6">
            {/* Copy Icon Button */}
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 rounded"
                title="Copy translations only (for pasting back to spreadsheet)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              {showCopied && (
                <div className="absolute -top-8 right-0 bg-green-600 dark:bg-green-700 text-white px-2 py-1 text-xs whitespace-nowrap shadow-lg border border-green-800 dark:border-green-900" style={{ borderRadius: '3px' }}>
                  ✓ Copied!
                </div>
              )}
            </div>
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100">
              {translations.map((trans, idx) => {
                if (!trans) return '';
                const utterer = (utterers && utterers.length > 0 && utterers[idx]) ? `[${utterers[idx]}] ` : '';
                return `${getCellLocation(idx)}: ${utterer}${trans}`;
              }).filter(Boolean).join('\n') || 'Translations will appear here...'}
            </pre>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{currentIndex + 1}</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Current</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{translations.filter(t => t).length}</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Completed</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{Math.round(progress)}%</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Progress</p>
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* XLSX Mode Interface - Full Width Below Grid */}
        {xlsxMode && (
          <div className="xlsx-viewer-section mt-8 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 shadow-md transition-all duration-300" style={{ borderRadius: '3px' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">XLSX Data Viewer</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Browse and search Excel translation files</p>
              </div>
              <button
                onClick={toggleXlsxMode}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ borderRadius: '3px' }}
                title="Close XLSX Viewer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
              <div className="flex gap-1">
                <button
                  onClick={() => setXlsxViewerTab('browse')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    xlsxViewerTab === 'browse'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Browse Data
                </button>
                <button
                  onClick={() => setXlsxViewerTab('context')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    xlsxViewerTab === 'context'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Context Search (beta)
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {xlsxViewerTab === 'browse' ? (
            <div className="space-y-4">
              {/* File and Sheet Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">File</label>
                  <select
                    value={selectedXlsxFile}
                    onChange={(e) => loadXlsxData(e.target.value)}
                    className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm"
                    style={{ borderRadius: '3px' }}
                    disabled={isLoadingXlsx}
                  >
                    <option value="">Select an XLSX file</option>
                    {availableXlsxFiles.map(file => (
                      <option key={file.fileName} value={file.fileName}>{file.fileName}</option>
                    ))}
                  </select>
                </div>

                {/* Sheet Selection */}
                {xlsxData && !globalSearch && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Sheet</label>
                    <select
                      value={selectedXlsxSheet}
                      onChange={(e) => setSelectedXlsxSheet(e.target.value)}
                      className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm"
                      style={{ borderRadius: '3px' }}
                      disabled={isLoadingXlsx}
                    >
                      <option value="">Select a sheet</option>
                      {getAvailableSheets().map((sheetName: string) => (
                        <option key={sheetName} value={sheetName}>{sheetName}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Search and Global Toggle */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Search</label>
                  <input
                    type="text"
                    value={xlsxSearchTerm}
                    onChange={(e) => setXlsxSearchTerm(e.target.value)}
                    placeholder="Search by row number, utterer, context, or text..."
                    className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm"
                    style={{ borderRadius: '3px' }}
                    disabled={isLoadingXlsx}
                  />
                </div>
                
                {/* Global Search Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="globalSearch"
                    checked={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.checked)}
                    className="w-4 h-4 text-black border border-black dark:border-gray-600 rounded focus:ring-2 focus:ring-gray-500 focus:ring-offset-0 dark:bg-gray-700"
                    style={{ borderRadius: '2px' }}
                    disabled={isLoadingXlsx}
                  />
                  <label htmlFor="globalSearch" className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                    Global Search
                  </label>
                  {globalSearch && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded text-xs text-amber-800 dark:text-amber-200 font-medium transition-all duration-300 animate-fade-in" style={{ borderRadius: '2px' }}>
                      <svg className="w-3 h-3 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Global Search is slow! Use at your own risk.
                    </span>
                  )}
                </div>
              </div>
              
              {/* XLSX Data Display */}
              {xlsxData && (globalSearch || selectedXlsxSheet) && (
              <div className="mt-6 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 max-h-64 overflow-y-auto shadow-inner custom-scrollbar" style={{ borderRadius: '3px' }}>
                {isLoadingXlsx ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">Loading XLSX data...</div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {getFilteredEntries().map((entry: any, index: number) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm" style={{ borderRadius: '3px' }}>
                        <div className="space-y-2">
                          {/* Header with Row and Sheet */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">Row {entry.row}</span>
                              {globalSearch && entry.sheetName && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium tracking-tight uppercase letter-spacing-wide">
                                  {entry.sheetName}
                                </span>
                              )}
                              {entry.fileName && (
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded font-medium">
                                  {entry.fileName}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Data Grid */}
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-16">Utterer:</span>
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.utterer}</span>
                                <button
                                  onClick={() => copyJsonField(entry.utterer, 'utterer')}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                  title="Copy utterer"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-16">Context:</span>
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.context}</span>
                                <button
                                  onClick={() => copyJsonField(entry.context, 'context')}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                  title="Copy context"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">Source:</span>
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.sourceEnglish}</span>
                                <button
                                  onClick={() => copyJsonField(entry.sourceEnglish, 'source')}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                  title="Copy source text"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">Dutch:</span>
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.translatedDutch}</span>
                                <button
                                  onClick={() => copyJsonField(entry.translatedDutch, 'dutch')}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                  title="Copy Dutch translation"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getFilteredEntries().length === 0 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                        No entries found matching your search criteria.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            </div>
          ) : (
            /* Context Search Tab */
            <div className="space-y-4">
              
              {/* Auto-search results based on current source text */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                  Searching for: &quot;{sourceTexts[currentIndex]}&quot;
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 p-4 max-h-64 overflow-y-auto shadow-inner custom-scrollbar" style={{ borderRadius: '3px' }}>
                  {(() => {
                    const matches = findXlsxMatchesWrapper(sourceTexts[currentIndex] || '');
                    const charMatches = findCharacterMatches(sourceTexts[currentIndex] || '');
                    
                    if (matches.length > 0 || charMatches.length > 0) {
                      return (
                        <>
                          {/* Show highlighted text with suggestions */}
                          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded shadow-sm" style={{ 
                            borderRadius: '6px',
                            boxShadow: darkMode 
                              ? '0 0 0 1px rgba(59, 130, 246, 0.2), 0 2px 4px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                              : '0 0 0 1px rgba(59, 130, 246, 0.1), 0 2px 4px rgba(59, 130, 246, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            background: darkMode 
                              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 197, 253, 0.12) 100%)'
                              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 197, 253, 0.08) 100%)'
                          }}>
                            <div className="text-sm font-semibold mb-3 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              Currently Highlighted Text:
                            </div>
                            <TextHighlighter
                              text={sourceTexts[currentIndex]}
                              jsonData={highlightingJsonData}
                              xlsxData={xlsxData || []}
                              highlightMode={true}
                              eyeMode={false}
                              currentTranslation=""
                              onCharacterClick={insertCharacterName}
                              onSuggestionClick={insertTranslatedSuggestion}
                              onCharacterNameClick={handleCharacterNameClick}
                              className=""
                              showSuggestions={true}
                            />
                          </div>
                          
                          {/* Historical matches - styled like reference viewer */}
                          {matches.map((match, idx) => (
                            <div key={`xlsx-${idx}`} className="mb-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm" style={{ borderRadius: '3px' }}>
                              <div className="space-y-2">
                                {/* Header with Row and Sheet */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">Row {match.rowNumber}</span>
                                    {match.sheetName && (
                                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium tracking-tight uppercase letter-spacing-wide">
                                        {match.sheetName}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Data Grid */}
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 min-w-16">Utterer:</span>
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-gray-700 dark:text-gray-300 flex-1">{match.utterer}</span>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(match.utterer)}
                                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                        title="Copy utterer"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 min-w-16">Context:</span>
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-gray-700 dark:text-gray-300 flex-1">{match.context}</span>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(match.context)}
                                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                        title="Copy context"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">Source:</span>
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className="text-gray-700 dark:text-gray-300 flex-1">
                                        <TextHighlighter
                                          text={match.sourceEnglish}
                                          jsonData={highlightingJsonData}
                                          xlsxData={xlsxData || []}
                                          highlightMode={true}
                                          eyeMode={false}
                                          currentTranslation=""
                                          onCharacterClick={insertCharacterName}
                                          onSuggestionClick={insertTranslatedSuggestion}
                                          onCharacterNameClick={handleCharacterNameClick}
                                          className="inline"
                                          showSuggestions={false}
                                        />
                                      </div>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(match.sourceEnglish)}
                                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                        title="Copy source text"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">Dutch:</span>
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-gray-700 dark:text-gray-300 flex-1">{match.translatedDutch || '(no translation)'}</span>
                                      {match.translatedDutch && (
                                        <button
                                          onClick={() => navigator.clipboard.writeText(match.translatedDutch)}
                                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                          title="Copy Dutch translation"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {charMatches.map((char, idx) => (
                            <div key={`char-${idx}`} className="mb-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 shadow-sm" style={{ borderRadius: '3px' }}>
                              <div className="space-y-2">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-green-800 dark:text-green-300 text-sm">Character</span>
                                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded font-medium">
                                      {char.name}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Data Grid */}
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">English:</span>
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-gray-700 dark:text-gray-300 flex-1">{char.english}</span>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(char.english)}
                                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                        title="Copy English name"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">Dutch:</span>
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-gray-700 dark:text-gray-300 flex-1">{char.dutch}</span>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(char.dutch)}
                                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                        title="Copy Dutch translation"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  {char.description && (
                                    <div className="flex items-start gap-2">
                                      <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">Description:</span>
                                      <span className="text-gray-600 dark:text-gray-400 flex-1 text-xs">{char.description}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      );
                    }
                    return <p className="text-gray-500 dark:text-gray-400 text-sm">No historical matches found for current text.</p>;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
        )}

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