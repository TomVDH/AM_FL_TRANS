import React, { useState, useEffect } from 'react';
import { useCSVConsultation } from '../hooks/useCSVConsultation';
import type { CSVEntry, CSVSearchResult } from '../hooks/useCSVConsultation';

interface CSVConsultationPanelProps {
  currentText?: string;
  onSuggestionSelect?: (suggestion: CSVEntry) => void;
  maxSuggestions?: number;
  showFileSelector?: boolean;
  autoConsult?: boolean;
  className?: string;
}

/**
 * CSV Consultation Panel Component
 * 
 * Provides a UI for dynamic CSV consultation during translation.
 * Features real-time suggestions, file selection, and search functionality.
 */
const CSVConsultationPanel: React.FC<CSVConsultationPanelProps> = ({
  currentText = '',
  onSuggestionSelect,
  maxSuggestions = 5,
  showFileSelector = true,
  autoConsult = true,
  className = ''
}) => {
  const {
    availableFiles,
    searchResults,
    isLoading,
    error,
    lastSearchTerm,
    loadCSVFile,
    searchAcrossFiles,
    getQuickSuggestions,
    consultForTranslation,
    clearCache
  } = useCSVConsultation();

  // Local state
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contextFilter, setContextFilter] = useState('');
  const [quickSuggestions, setQuickSuggestions] = useState<CSVEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-consultation effect
  useEffect(() => {
    if (autoConsult && currentText && currentText.length > 2) {
      consultForTranslation(currentText).then(suggestions => {
        setQuickSuggestions(suggestions.slice(0, maxSuggestions));
      });
    }
  }, [currentText, autoConsult, maxSuggestions, consultForTranslation]);

  // Initialize with all files selected
  useEffect(() => {
    if (availableFiles.length > 0 && selectedFiles.length === 0) {
      setSelectedFiles(availableFiles);
    }
  }, [availableFiles, selectedFiles.length]);

  const handleSearch = async () => {
    if (!searchTerm || selectedFiles.length === 0) return;
    
    await searchAcrossFiles(selectedFiles, searchTerm, contextFilter);
  };

  const handleSuggestionClick = (suggestion: CSVEntry) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const handleFileToggle = (fileName: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileName)
        ? prev.filter(f => f !== fileName)
        : [...prev, fileName]
    );
  };

  const handleSelectAll = () => {
    setSelectedFiles(availableFiles);
  };

  const handleSelectNone = () => {
    setSelectedFiles([]);
  };

  return (
    <div className={`csv-consultation-panel bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Translation Consultation
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      {quickSuggestions.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Suggestions
          </h4>
          <div className="space-y-2">
            {quickSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {suggestion.english}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      → {suggestion.dutch}
                    </div>
                  </div>
                  {suggestion.utterer && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {suggestion.utterer}
                    </div>
                  )}
                </div>
                {suggestion.context && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {suggestion.context} • Sheet: {suggestion.sheetName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Search Interface */}
      {isExpanded && (
        <>
          {/* Search Controls */}
          <div className="p-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search translations..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <input
                type="text"
                value={contextFilter}
                onChange={(e) => setContextFilter(e.target.value)}
                placeholder="Context filter..."
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
              >
                {isLoading ? '...' : 'Search'}
              </button>
            </div>

            {/* File Selection */}
            {showFileSelector && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Search Files ({selectedFiles.length}/{availableFiles.length})
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      All
                    </button>
                    <button
                      onClick={handleSelectNone}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {availableFiles.map(fileName => (
                    <label key={fileName} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(fileName)}
                        onChange={() => handleFileToggle(fileName)}
                        className="mr-2"
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {fileName.replace('.csv', '')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="p-4 max-h-96 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Search Results ({searchResults.reduce((sum, r) => sum + r.matches.length, 0)} matches)
              </h4>
              <div className="space-y-4">
                {searchResults.map((result, fileIndex) => (
                  <div key={fileIndex}>
                    <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {result.file.replace('.csv', '')} ({result.matches.length} matches)
                    </h5>
                    <div className="space-y-2">
                      {result.matches.map((match, matchIndex) => (
                        <div
                          key={matchIndex}
                          onClick={() => handleSuggestionClick(match)}
                          className="p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {match.english}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            → {match.dutch}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {match.utterer && `${match.utterer} • `}
                            {match.context} • {match.sheetName} • Row {match.row}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 rounded-b-lg">
        {availableFiles.length} files available • {lastSearchTerm && `Last search: "${lastSearchTerm}"`}
        <button
          onClick={clearCache}
          className="ml-2 text-blue-600 hover:text-blue-800"
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
};

export default CSVConsultationPanel;