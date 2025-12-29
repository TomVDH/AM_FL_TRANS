'use client';

import React from 'react';
import TextHighlighter from './TextHighlighter';
import { XlsxEntry, XlsxFileInfo } from '../hooks/useXlsxMode';

interface CharacterMatch {
  name: string;
  english: string;
  dutch: string;
  description?: string;
  startIndex?: number;
  endIndex?: number;
}

interface XlsxMatchWrapper {
  sourceEnglish: string;
  translatedDutch: string;
  category: string;
  sheetName?: string;
  rowNumber: number;
  utterer: string;
  context: string;
}

interface ReferenceToolsPanelProps {
  // Mode and tab state
  xlsxMode: boolean;
  toggleXlsxMode: () => void;
  xlsxViewerTab: 'browse' | 'context';
  setXlsxViewerTab: (tab: 'browse' | 'context') => void;

  // Data state
  xlsxData: XlsxEntry[] | null;
  selectedXlsxFile: string;
  selectedXlsxSheet: string;
  availableXlsxFiles: XlsxFileInfo[];

  // Search and filter state
  xlsxSearchTerm: string;
  setXlsxSearchTerm: (term: string) => void;
  globalSearch: boolean;
  setGlobalSearch: (global: boolean) => void;
  isLoadingXlsx: boolean;

  // Data management functions
  loadXlsxData: (fileName: string) => Promise<void>;
  setSelectedXlsxSheet: (sheet: string) => void;
  getAvailableSheets: () => string[];
  getFilteredEntries: () => XlsxEntry[];

  // Current translation context
  sourceTexts: string[];
  currentIndex: number;

  // Highlighting and matching
  highlightingJsonData: any;
  findXlsxMatchesWrapper: (text: string) => XlsxMatchWrapper[];
  findCharacterMatches: (text: string) => CharacterMatch[];

  // Action handlers
  insertCharacterName: (name: string) => void;
  insertTranslatedSuggestion: (suggestion: string) => void;
  handleCharacterNameClick: (name: string) => void;
  handleHighlightClick: (entry: any, type: 'json' | 'xlsx' | 'character') => void;

  // Utility functions
  darkMode: boolean;
  copyJsonField: (text: string, fieldName: string) => void;
}

const ReferenceToolsPanel: React.FC<ReferenceToolsPanelProps> = ({
  xlsxMode,
  toggleXlsxMode,
  xlsxViewerTab,
  setXlsxViewerTab,
  xlsxData,
  selectedXlsxFile,
  selectedXlsxSheet,
  availableXlsxFiles,
  xlsxSearchTerm,
  setXlsxSearchTerm,
  globalSearch,
  setGlobalSearch,
  isLoadingXlsx,
  loadXlsxData,
  setSelectedXlsxSheet,
  getAvailableSheets,
  getFilteredEntries,
  sourceTexts,
  currentIndex,
  highlightingJsonData,
  findXlsxMatchesWrapper,
  findCharacterMatches,
  insertCharacterName,
  insertTranslatedSuggestion,
  handleCharacterNameClick,
  handleHighlightClick,
  darkMode,
  copyJsonField,
}) => {
  if (!xlsxMode) return null;

  return (
    <div className="reference-tools-section mt-8 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 shadow-md transition-all duration-300" style={{ borderRadius: '3px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Reference Tools</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Browse and search Excel translation files</p>
        </div>
        <button
          onClick={toggleXlsxMode}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          style={{ borderRadius: '3px' }}
          title="Close Reference Tools"
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
                          onHighlightClick={handleHighlightClick}
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
                                      onHighlightClick={handleHighlightClick}
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
  );
};

export default ReferenceToolsPanel;
