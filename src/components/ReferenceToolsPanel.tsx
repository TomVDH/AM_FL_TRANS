'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { XlsxEntry, XlsxFileInfo } from '../hooks/useXlsxMode';

interface CharacterMatch {
  name: string;
  english: string;
  dutch: string;
  description?: string;
  category?: string;
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

interface EditedTranslationMatch {
  sourceEnglish: string;
  translatedText: string;
  index: number;
  rowNumber: number;
  isCurrentEntry: boolean;
  utterer?: string;
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
  searchAllFiles: boolean;
  setSearchAllFiles: (searchAll: boolean) => void;
  isLoadingXlsx: boolean;

  // Data management functions
  loadXlsxData: (fileName: string) => Promise<void>;
  setSelectedXlsxSheet: (sheet: string) => void;
  getAvailableSheets: () => string[];
  getFilteredEntries: () => XlsxEntry[];

  // Current translation context
  sourceTexts: string[];
  currentIndex: number;

  // Current working sheet from SetupWizard (for auto-targeting)
  currentWorkingSheet?: string;

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

  // Edited translations data (optional, for backward compatibility)
  editedEntries?: EditedTranslationMatch[];
  onJumpToEntry?: (index: number) => void;
}

type TabType = 'codex' | 'search' | 'edited';

const ReferenceToolsPanel: React.FC<ReferenceToolsPanelProps> = ({
  xlsxMode,
  toggleXlsxMode,
  xlsxViewerTab: _xlsxViewerTab,
  setXlsxViewerTab: _setXlsxViewerTab,
  xlsxData,
  selectedXlsxFile,
  selectedXlsxSheet,
  availableXlsxFiles,
  xlsxSearchTerm,
  setXlsxSearchTerm,
  globalSearch,
  setGlobalSearch,
  searchAllFiles,
  setSearchAllFiles,
  isLoadingXlsx,
  loadXlsxData,
  setSelectedXlsxSheet,
  getAvailableSheets,
  getFilteredEntries,
  sourceTexts,
  currentIndex,
  currentWorkingSheet,
  highlightingJsonData: _highlightingJsonData,
  findXlsxMatchesWrapper: _findXlsxMatchesWrapper,
  findCharacterMatches: _findCharacterMatches,
  insertCharacterName,
  insertTranslatedSuggestion,
  handleCharacterNameClick: _handleCharacterNameClick,
  handleHighlightClick: _handleHighlightClick,
  darkMode: _darkMode,
  copyJsonField: _copyJsonField,
  editedEntries = [],
  onJumpToEntry,
}) => {
  // Suppress unused variable warnings for props kept for API compatibility
  void _xlsxViewerTab; void _setXlsxViewerTab; void _highlightingJsonData;
  void _findXlsxMatchesWrapper; void _findCharacterMatches; void _handleCharacterNameClick;
  void _handleHighlightClick; void _darkMode; void _copyJsonField;

  // Default to search tab (user's primary workflow)
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [codexFilter, setCodexFilter] = useState<'all' | 'CHARACTER' | 'LOCATION' | 'OTHER'>('all');
  const [codexSearchTerm, setCodexSearchTerm] = useState('');
  const [codexData, setCodexData] = useState<CharacterMatch[]>([]);
  const [isLoadingCodex, setIsLoadingCodex] = useState(false);

  // Unified Search tab state (kept for effectiveSearchTerm computation)
  const [searchMode] = useState<'current' | 'custom'>('current');
  const [customSearchTerm] = useState('');

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Always enable global search (all sheets) when entering search tab
    if (tab === 'search') {
      setGlobalSearch(true);
    }
  };

  // Always keep globalSearch true for search tab (all sheets is now default)
  useEffect(() => {
    if (activeTab === 'search' && !globalSearch) {
      setGlobalSearch(true);
    }
  }, [activeTab, globalSearch, setGlobalSearch]);

  // Get the effective search term based on mode
  const effectiveSearchTerm = useMemo(() => {
    if (searchMode === 'current') {
      return sourceTexts[currentIndex] || '';
    }
    return customSearchTerm;
  }, [searchMode, sourceTexts, currentIndex, customSearchTerm]);

  // Update xlsx search term when effective search term changes (for Search tab)
  useEffect(() => {
    if (activeTab === 'search' && effectiveSearchTerm) {
      setXlsxSearchTerm(effectiveSearchTerm);
    }
  }, [activeTab, effectiveSearchTerm, setXlsxSearchTerm]);

  // Note: Auto-targeting removed - user has full control over tab selection

  // Load full codex data
  useEffect(() => {
    const loadCodex = async () => {
      try {
        setIsLoadingCodex(true);
        const response = await fetch('/api/csv-data?file=codex_translations.csv');
        if (response.ok) {
          const data = await response.json();
          if (data.sheets && data.sheets[0]) {
            setCodexData(data.sheets[0].entries || []);
          }
        }
      } catch (error) {
        console.error('Error loading codex:', error);
      } finally {
        setIsLoadingCodex(false);
      }
    };

    if (xlsxMode) {
      loadCodex();
    }
  }, [xlsxMode]);

  // Filter codex data
  const filteredCodexData = useMemo(() => {
    let filtered = codexData;

    // Category filter
    if (codexFilter !== 'all') {
      filtered = filtered.filter(entry => entry.category === codexFilter);
    }

    // Search filter
    if (codexSearchTerm) {
      const term = codexSearchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.english.toLowerCase().includes(term) ||
        entry.dutch.toLowerCase().includes(term) ||
        entry.name.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [codexData, codexFilter, codexSearchTerm]);

  // Copy to clipboard helper
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  if (!xlsxMode) return null;

  return (
    <div className="reference-tools-section mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 shadow-sm transition-all duration-300" style={{ borderRadius: '4px' }}>
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-wide uppercase">
            Reference Tools
          </h4>
        </div>
        <button
          onClick={toggleXlsxMode}
          className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ borderRadius: '2px' }}
          title="Close Reference Tools (Esc)"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation - 3 Tabs */}
      <div className="flex gap-1 mb-3 p-0.5 bg-gray-50 dark:bg-gray-900" style={{ borderRadius: '3px' }}>
        {/* Codex Tab */}
        <button
          onClick={() => handleTabChange('codex')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            activeTab === 'codex'
              ? 'bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          style={{ borderRadius: '2px' }}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Codex
            <span className="text-[9px] px-1.5 py-0.5 bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 font-bold" style={{ borderRadius: '2px' }}>
              {codexData.length}
            </span>
          </span>
        </button>

        {/* Search Tab */}
        <button
          onClick={() => handleTabChange('search')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            activeTab === 'search'
              ? 'bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          style={{ borderRadius: '2px' }}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </span>
        </button>

        {/* Edited Tab - Orange */}
        <button
          onClick={() => handleTabChange('edited')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            activeTab === 'edited'
              ? 'bg-orange-600 dark:bg-orange-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          style={{ borderRadius: '2px' }}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edited
            {editedEntries.length > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 bg-orange-700 dark:bg-orange-400 text-white dark:text-gray-900 font-bold" style={{ borderRadius: '2px' }}>
                {editedEntries.length}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && (
        <div className="space-y-3">
          {/* Search input - primary action, full width */}
          <div className="relative">
            <input
              type="text"
              value={xlsxSearchTerm}
              onChange={(e) => setXlsxSearchTerm(e.target.value)}
              placeholder="Search translations..."
              className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20"
              style={{ borderRadius: '3px' }}
              disabled={isLoadingXlsx}
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {xlsxSearchTerm && (
              <button
                onClick={() => setXlsxSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* File tabs - horizontal scrollable */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide shrink-0 mr-1">File</span>
            <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
              {availableXlsxFiles.map((file) => {
                // Extract short name for display (e.g., "E1" from "1_asses.masses_E1Proxy.xlsx")
                const match = file.fileName.match(/E(\d+)/i);
                const displayName = match ? `E${match[1]}` : file.fileName.replace(/\.xlsx$/i, '').slice(0, 8);
                return (
                  <button
                    key={file.fileName}
                    onClick={() => loadXlsxData(file.fileName)}
                    className={`shrink-0 px-2 py-1 text-[10px] font-medium transition-colors ${
                      selectedXlsxFile === file.fileName
                        ? 'bg-green-600 dark:bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    style={{ borderRadius: '3px' }}
                    title={file.fileName}
                    disabled={isLoadingXlsx}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab tabs (sheets within file) - horizontal scrollable */}
          {xlsxData && getAvailableSheets().length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide shrink-0 mr-1">Tab</span>
              <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
                {/* All tabs option */}
                <button
                  onClick={() => setSelectedXlsxSheet('')}
                  className={`shrink-0 px-2 py-1 text-[10px] font-medium transition-colors ${
                    !selectedXlsxSheet
                      ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={{ borderRadius: '3px' }}
                  disabled={isLoadingXlsx}
                >
                  All
                </button>
                {getAvailableSheets().map((sheetName: string) => {
                  // Clean up sheet name for display
                  const displayName = sheetName
                    .replace(/^E\d+_/, '')
                    .replace(/_localization$/i, '')
                    .slice(0, 20);
                  return (
                    <button
                      key={sheetName}
                      onClick={() => setSelectedXlsxSheet(sheetName)}
                      className={`shrink-0 px-2 py-1 text-[10px] font-medium transition-colors ${
                        selectedXlsxSheet === sheetName
                          ? 'bg-blue-600 dark:bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      style={{ borderRadius: '3px' }}
                      title={sheetName}
                      disabled={isLoadingXlsx}
                    >
                      {displayName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results - Card-based layout for full content display */}
          <div className="border border-gray-200 dark:border-gray-600 overflow-hidden max-h-96 overflow-y-auto custom-scrollbar" style={{ borderRadius: '3px' }}>
            {isLoadingXlsx ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              </div>
            ) : !xlsxData ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs">
                Select a file to search
              </div>
            ) : getFilteredEntries().length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs">
                No entries found
              </div>
            ) : (
              getFilteredEntries().map((entry: any, idx: number) => (
                <div
                  key={idx}
                  className={`group px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    idx !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''
                  }`}
                >
                  {/* Header row with metadata and actions */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {/* Row number badge - prominent */}
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400" style={{ borderRadius: '2px' }}>
                        Row {entry.row}
                      </span>

                      {/* Green dot for XLSX */}
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

                      {/* Tab name badge (shown when viewing all tabs) */}
                      {entry.sheetName && !selectedXlsxSheet && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" style={{ borderRadius: '2px' }}>
                          {entry.sheetName.replace(/^E\d+_/, '').replace(/_localization$/i, '')}
                        </span>
                      )}

                      {/* File name badge (if searching all files) */}
                      {searchAllFiles && entry.fileName && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" style={{ borderRadius: '2px' }}>
                          {entry.fileName.replace(/\.xlsx$/i, '')}
                        </span>
                      )}

                      {/* Utterer if available */}
                      {entry.utterer && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" style={{ borderRadius: '2px' }}>
                          {entry.utterer}
                        </span>
                      )}
                    </div>

                    {/* Actions - always visible */}
                    <div className="flex items-center gap-1">
                      {entry.translatedDutch && (
                        <button
                          onClick={() => insertTranslatedSuggestion(entry.translatedDutch)}
                          className="p-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 transition-colors"
                          style={{ borderRadius: '2px' }}
                          title={`Insert translation`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => copyToClipboard(entry.translatedDutch || entry.sourceEnglish)}
                        className="p-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 transition-colors"
                        style={{ borderRadius: '2px' }}
                        title="Copy to clipboard"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Source text with context - full display, multiline */}
                  <div className="mb-1">
                    <span className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mr-1">EN:</span>
                    {entry.context && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 italic mr-1">
                        [{entry.context}]
                      </span>
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                      {entry.sourceEnglish}
                    </span>
                  </div>

                  {/* Translation - full display, multiline */}
                  <div>
                    <span className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mr-1">NL:</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                      {entry.translatedDutch || <span className="italic text-gray-400">(no translation)</span>}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Results count - subtle footer */}
          {xlsxData && (
            <div className="text-[10px] text-gray-400 dark:text-gray-500 text-right">
              {getFilteredEntries().length} results
            </div>
          )}
        </div>
      )}

      {/* Context tab content merged into Search tab above */}

      {activeTab === 'codex' && (
        <div className="space-y-3">
          {/* Search input - primary action, full width */}
          <div className="relative">
            <input
              type="text"
              value={codexSearchTerm}
              onChange={(e) => setCodexSearchTerm(e.target.value)}
              placeholder="Search codex..."
              className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20"
              style={{ borderRadius: '3px' }}
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {codexSearchTerm && (
              <button
                onClick={() => setCodexSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter row */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</span>

            {/* Segmented Category Filter with Counts */}
            <div className="flex border border-gray-300 dark:border-gray-600 overflow-hidden" style={{ borderRadius: '3px' }}>
              {(['all', 'CHARACTER', 'LOCATION', 'OTHER'] as const).map((filter) => {
                const count = filter === 'all'
                  ? codexData.length
                  : codexData.filter(e => e.category === filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setCodexFilter(filter)}
                    className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
                      codexFilter === filter
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter.charAt(0)}
                    <span className="ml-0.5 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact List View */}
          <div className="border border-gray-200 dark:border-gray-600 overflow-hidden max-h-72 overflow-y-auto custom-scrollbar" style={{ borderRadius: '3px' }}>
            {isLoadingCodex ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              </div>
            ) : filteredCodexData.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs">
                No entries found
              </div>
            ) : (
              filteredCodexData.map((entry, idx) => (
                <div
                  key={idx}
                  className={`group flex items-center justify-between px-2.5 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    idx !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Category indicator dot */}
                    <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                      entry.category === 'CHARACTER'
                        ? 'bg-purple-500'
                        : entry.category === 'LOCATION'
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                    }`} />

                    {/* English name */}
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate min-w-[80px] max-w-[120px]">
                      {entry.english}
                    </span>

                    {/* Arrow */}
                    <svg className="shrink-0 w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>

                    {/* Translation - primary */}
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {entry.dutch}
                    </span>
                  </div>

                  {/* Hover-reveal actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => insertCharacterName(entry.dutch)}
                      className="p-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 transition-colors"
                      style={{ borderRadius: '2px' }}
                      title={`Insert "${entry.dutch}"`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => copyToClipboard(entry.dutch)}
                      className="p-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 transition-colors"
                      style={{ borderRadius: '2px' }}
                      title="Copy to clipboard"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Results count - subtle footer */}
          <div className="text-[10px] text-gray-400 dark:text-gray-500 text-right">
            {filteredCodexData.length} of {codexData.length}
          </div>
        </div>
      )}

      {/* Global tab content merged into Search tab above */}

      {/* Edited Tab Content */}
      {activeTab === 'edited' && (
        <div className="space-y-3">
          {/* Info header */}
          <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your edited translations - click to jump, + to insert</span>
          </div>

          {/* Results list */}
          <div className="border border-gray-200 dark:border-gray-600 overflow-hidden max-h-80 overflow-y-auto custom-scrollbar" style={{ borderRadius: '3px' }}>
            {editedEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-xs">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                No edited translations yet
              </div>
            ) : (
              editedEntries.map((entry, idx) => (
                <div
                  key={`edited-${entry.index}-${idx}`}
                  className={`group px-3 py-2.5 transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer ${
                    idx !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''
                  } ${entry.isCurrentEntry ? 'bg-orange-50 dark:bg-orange-900/30' : ''}`}
                  onClick={() => onJumpToEntry?.(entry.index)}
                >
                  {/* Header row with metadata and actions */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {/* Row number badge - orange */}
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300" style={{ borderRadius: '2px' }}>
                        Row {entry.rowNumber}
                      </span>

                      {/* Orange dot */}
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />

                      {/* Current entry indicator */}
                      {entry.isCurrentEntry && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 font-medium" style={{ borderRadius: '2px' }}>
                          Current
                        </span>
                      )}

                      {/* Utterer if available */}
                      {entry.utterer && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" style={{ borderRadius: '2px' }}>
                          {entry.utterer}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          insertTranslatedSuggestion(entry.translatedText);
                        }}
                        className="p-1 bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-600 dark:text-orange-400 transition-colors"
                        style={{ borderRadius: '2px' }}
                        title={`Insert translation`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(entry.translatedText);
                        }}
                        className="p-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 transition-colors"
                        style={{ borderRadius: '2px' }}
                        title="Copy to clipboard"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Source text */}
                  <div className="mb-1">
                    <span className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mr-1">EN:</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                      {entry.sourceEnglish}
                    </span>
                  </div>

                  {/* Translation */}
                  <div>
                    <span className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mr-1">NL:</span>
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300 whitespace-pre-wrap break-words">
                      {entry.translatedText}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Results count */}
          {editedEntries.length > 0 && (
            <div className="text-[10px] text-gray-400 dark:text-gray-500 text-right">
              {editedEntries.length} edited translation{editedEntries.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Keyboard hint */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">Esc</kbd>
            Close
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">Tab</kbd>
            Cycle tabs
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReferenceToolsPanel;
