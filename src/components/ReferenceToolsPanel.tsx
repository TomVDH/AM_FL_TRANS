'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import TextHighlighter from './TextHighlighter';
import SourceBadge from './SourceBadge';
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

type TabType = 'browse' | 'context' | 'codex' | 'global';

// Reusable Result Card Component - Compact version (Phase 2)
const ResultCard: React.FC<{
  type: 'xlsx' | 'codex' | 'character';
  primary: string;
  secondary?: string;
  metadata?: { label: string; value: string }[];
  onInsert?: () => void;
  onCopy?: () => void;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ type, primary, secondary, metadata, onInsert, onCopy, badge, children }) => {
  const bgColors = {
    xlsx: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700',
    codex: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500',
    character: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500',
  };

  return (
    <div
      className={`p-2.5 border shadow-sm hover:shadow-md transition-all duration-200 ${bgColors[type]}`}
      style={{ borderRadius: '4px' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Badge - inline */}
          <div className="flex items-center gap-2 mb-1">
            {badge}
            {/* Primary (Dutch translation - most important) */}
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {primary}
            </span>
          </div>

          {/* Secondary (English source) */}
          {secondary && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">
              {secondary}
            </div>
          )}

          {/* Metadata - inline */}
          {metadata && metadata.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {metadata.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[10px] text-gray-500 dark:text-gray-400"
                >
                  <span className="font-medium mr-0.5">{item.label}:</span>
                  <span className="truncate max-w-[100px]">{item.value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Additional content */}
          {children}
        </div>

        {/* Action Buttons - Smaller but still accessible */}
        <div className="flex gap-1 flex-shrink-0">
          {onInsert && (
            <button
              onClick={onInsert}
              className="flex items-center justify-center w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
              style={{ borderRadius: '4px', minWidth: '32px', minHeight: '32px' }}
              title="Insert translation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          {onCopy && (
            <button
              onClick={onCopy}
              className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
              style={{ borderRadius: '4px', minWidth: '32px', minHeight: '32px' }}
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
  // Default to codex tab (Phase 2: Codex is now primary)
  const [activeTab, setActiveTab] = useState<TabType>('codex');
  const [legacyDropdownOpen, setLegacyDropdownOpen] = useState(false);
  const [codexFilter, setCodexFilter] = useState<'all' | 'CHARACTER' | 'LOCATION' | 'OTHER'>('all');
  const [codexSearchTerm, setCodexSearchTerm] = useState('');
  const [codexData, setCodexData] = useState<CharacterMatch[]>([]);
  const [isLoadingCodex, setIsLoadingCodex] = useState(false);

  // Sync with external tab state (for legacy tabs)
  useEffect(() => {
    if (xlsxViewerTab === 'browse' || xlsxViewerTab === 'context') {
      setActiveTab(xlsxViewerTab);
    }
  }, [xlsxViewerTab]);

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setLegacyDropdownOpen(false);
    if (tab === 'browse' || tab === 'context') {
      setXlsxViewerTab(tab);
    }
    // Enable global search when entering global tab, disable when leaving
    if (tab === 'global') {
      setGlobalSearch(true);
    } else if (globalSearch) {
      setGlobalSearch(false);
    }
  };

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
    <div className="reference-tools-section mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 shadow-sm transition-all duration-300 panel-slide-in" style={{ borderRadius: '4px' }}>
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

      {/* Tab Navigation - Compact */}
      <div className="flex gap-1 mb-3 p-0.5 bg-gray-50 dark:bg-gray-900" style={{ borderRadius: '3px' }}>
        {/* Codex Tab - Primary */}
        <button
          onClick={() => handleTabChange('codex')}
          className={`flex-1 px-2 py-1 text-[10px] font-medium transition-all duration-200 ${
            activeTab === 'codex'
              ? 'bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          style={{ borderRadius: '2px' }}
        >
          <span className="flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Codex
            <span className="text-[8px] px-1 py-0.5 bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 font-bold" style={{ borderRadius: '2px' }}>
              {codexData.length}
            </span>
          </span>
        </button>

        {/* Global Search Tab */}
        <button
          onClick={() => handleTabChange('global')}
          className={`flex-1 px-2 py-1 text-[10px] font-medium transition-all duration-200 ${
            activeTab === 'global'
              ? 'bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          style={{ borderRadius: '2px' }}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Global
          </span>
        </button>

        {/* Legacy Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLegacyDropdownOpen(!legacyDropdownOpen)}
            className={`px-2 py-1 text-[10px] font-medium transition-all duration-200 flex items-center gap-1 ${
              activeTab === 'browse' || activeTab === 'context'
                ? 'bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            style={{ borderRadius: '2px' }}
          >
            <span className="flex items-center gap-1">
              {activeTab === 'browse' ? 'Browse' : activeTab === 'context' ? 'Context' : 'Legacy'}
              <svg className={`w-3 h-3 transition-transform ${legacyDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          {/* Dropdown Menu */}
          {legacyDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg z-10 min-w-[120px]" style={{ borderRadius: '4px' }}>
              <button
                onClick={() => handleTabChange('browse')}
                className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'browse'
                    ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Browse Data
              </button>
              <button
                onClick={() => handleTabChange('context')}
                className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'context'
                    ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Context Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {/* File and Sheet Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                File
              </label>
              <select
                value={selectedXlsxFile}
                onChange={(e) => loadXlsxData(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white text-sm"
                style={{ borderRadius: '8px' }}
                disabled={isLoadingXlsx}
              >
                <option value="">Select an XLSX file</option>
                {availableXlsxFiles.map(file => (
                  <option key={file.fileName} value={file.fileName}>{file.fileName}</option>
                ))}
              </select>
            </div>

            {xlsxData && !globalSearch && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Sheet
                </label>
                <select
                  value={selectedXlsxSheet}
                  onChange={(e) => setSelectedXlsxSheet(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white text-sm"
                  style={{ borderRadius: '8px' }}
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

          {/* Search Input - Modernized */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={xlsxSearchTerm}
              onChange={(e) => setXlsxSearchTerm(e.target.value)}
              placeholder="Search by row, utterer, context, or text..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white text-sm"
              style={{ borderRadius: '8px' }}
              disabled={isLoadingXlsx}
            />
            {xlsxSearchTerm && (
              <button
                onClick={() => setXlsxSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Global Search Toggle - Redesigned */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.checked)}
                className="sr-only peer"
                disabled={isLoadingXlsx}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Global Search
            </span>
            {globalSearch && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Slower performance
              </span>
            )}
          </div>

          {/* Results - Updated with new ResultCard */}
          {xlsxData && (globalSearch || selectedXlsxSheet) && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-h-80 overflow-y-auto custom-scrollbar" style={{ borderRadius: '8px' }}>
              {isLoadingXlsx ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredEntries().map((entry: any, index: number) => (
                    <ResultCard
                      key={index}
                      type="xlsx"
                      primary={entry.translatedDutch || '(no translation)'}
                      secondary={entry.sourceEnglish}
                      metadata={[
                        { label: 'Row', value: String(entry.row) },
                        { label: 'Speaker', value: entry.utterer },
                        ...(entry.sheetName ? [{ label: 'Sheet', value: entry.sheetName }] : []),
                      ]}
                      onInsert={entry.translatedDutch ? () => insertTranslatedSuggestion(entry.translatedDutch) : undefined}
                      onCopy={() => copyToClipboard(entry.translatedDutch || entry.sourceEnglish)}
                      badge={<SourceBadge source="xlsx" size="sm" />}
                    />
                  ))}
                  {getFilteredEntries().length === 0 && (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No entries found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'context' && (
        <div className="space-y-4">
          {/* Current source text indicator */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg" style={{ borderRadius: '8px' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">
                Searching current text
              </span>
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
              className="text-sm"
              showSuggestions={true}
            />
          </div>

          {/* Context matches */}
          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            {(() => {
              const xlsxMatches = findXlsxMatchesWrapper(sourceTexts[currentIndex] || '');
              const charMatches = findCharacterMatches(sourceTexts[currentIndex] || '');

              if (xlsxMatches.length === 0 && charMatches.length === 0) {
                return (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No matches found for current text</p>
                  </div>
                );
              }

              return (
                <>
                  {charMatches.map((char, idx) => (
                    <ResultCard
                      key={`char-${idx}`}
                      type="codex"
                      primary={char.dutch}
                      secondary={char.english}
                      metadata={[
                        { label: 'Category', value: char.category || 'Character' },
                        ...(char.description ? [{ label: 'Note', value: char.description }] : []),
                      ]}
                      onInsert={() => insertCharacterName(char.dutch)}
                      onCopy={() => copyToClipboard(char.dutch)}
                      badge={<SourceBadge source="character" size="sm" />}
                    />
                  ))}
                  {xlsxMatches.map((match, idx) => (
                    <ResultCard
                      key={`xlsx-${idx}`}
                      type="xlsx"
                      primary={match.translatedDutch || '(no translation)'}
                      secondary={match.sourceEnglish}
                      metadata={[
                        { label: 'Row', value: String(match.rowNumber) },
                        { label: 'Speaker', value: match.utterer },
                        ...(match.sheetName ? [{ label: 'Sheet', value: match.sheetName }] : []),
                      ]}
                      onInsert={match.translatedDutch ? () => insertTranslatedSuggestion(match.translatedDutch) : undefined}
                      onCopy={() => copyToClipboard(match.translatedDutch || match.sourceEnglish)}
                      badge={<SourceBadge source="xlsx" size="sm" />}
                    />
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {activeTab === 'codex' && (
        <div className="space-y-4">
          {/* Codex Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={codexSearchTerm}
                onChange={(e) => setCodexSearchTerm(e.target.value)}
                placeholder="Search codex..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white text-sm"
                style={{ borderRadius: '8px' }}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg" style={{ borderRadius: '8px' }}>
              {(['all', 'CHARACTER', 'LOCATION', 'OTHER'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCodexFilter(filter)}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                    codexFilter === filter
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  style={{ borderRadius: '6px' }}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredCodexData.length} of {codexData.length} entries
          </div>

          {/* Codex Results */}
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {isLoadingCodex ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredCodexData.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-sm">No codex entries found</p>
              </div>
            ) : (
              filteredCodexData.map((entry, idx) => (
                <ResultCard
                  key={idx}
                  type="codex"
                  primary={entry.dutch}
                  secondary={entry.english}
                  metadata={[
                    { label: 'Category', value: entry.category || 'Unknown' },
                    ...(entry.description && entry.description !== 'Character' ? [{ label: 'Note', value: entry.description }] : []),
                  ]}
                  onInsert={() => insertCharacterName(entry.dutch)}
                  onCopy={() => copyToClipboard(entry.dutch)}
                  badge={
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                      entry.category === 'CHARACTER'
                        ? 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                        : entry.category === 'LOCATION'
                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {entry.category || 'Other'}
                    </span>
                  }
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'global' && (
        <div className="space-y-4">
          {/* Global Search Info */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg" style={{ borderRadius: '8px' }}>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">
                Global Search
              </span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Search across all files and sheets. May be slower for large datasets.
            </p>
          </div>

          {/* File Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Select Data File
            </label>
            <select
              value={selectedXlsxFile}
              onChange={(e) => loadXlsxData(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white text-sm"
              style={{ borderRadius: '8px' }}
              disabled={isLoadingXlsx}
            >
              <option value="">Select an XLSX file to search</option>
              {availableXlsxFiles.map(file => (
                <option key={file.fileName} value={file.fileName}>{file.fileName}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={xlsxSearchTerm}
              onChange={(e) => setXlsxSearchTerm(e.target.value)}
              placeholder="Search all files and sheets..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white text-sm"
              style={{ borderRadius: '8px' }}
              disabled={!xlsxData}
            />
          </div>

          {/* Results */}
          {xlsxData && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-h-80 overflow-y-auto custom-scrollbar" style={{ borderRadius: '8px' }}>
              {isLoadingXlsx ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredEntries().map((entry: any, index: number) => (
                    <ResultCard
                      key={index}
                      type="xlsx"
                      primary={entry.translatedDutch || '(no translation)'}
                      secondary={entry.sourceEnglish}
                      metadata={[
                        { label: 'Row', value: String(entry.row) },
                        { label: 'Speaker', value: entry.utterer },
                        ...(entry.sheetName ? [{ label: 'Sheet', value: entry.sheetName }] : []),
                      ]}
                      onInsert={entry.translatedDutch ? () => insertTranslatedSuggestion(entry.translatedDutch) : undefined}
                      onCopy={() => copyToClipboard(entry.translatedDutch || entry.sourceEnglish)}
                      badge={<SourceBadge source="xlsx" size="sm" />}
                    />
                  ))}
                  {getFilteredEntries().length === 0 && (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {xlsxSearchTerm ? 'No entries match your search' : 'Enter a search term to begin'}
                      </p>
                    </div>
                  )}
                </div>
              )}
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
