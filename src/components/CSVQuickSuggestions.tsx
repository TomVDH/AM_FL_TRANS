import React, { useMemo } from 'react';
import type { CSVEntry } from '../hooks/useCSVConsultation';

interface CSVQuickSuggestionsProps {
  suggestions: CSVEntry[];
  onSelect: (suggestion: CSVEntry) => void;
  maxDisplay?: number;
  showContext?: boolean;
  showSource?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * CSV Quick Suggestions Component
 * 
 * Displays a compact list of translation suggestions based on CSV data.
 * Optimized for quick selection during translation workflow.
 */
const CSVQuickSuggestions: React.FC<CSVQuickSuggestionsProps> = ({
  suggestions,
  onSelect,
  maxDisplay = 3,
  showContext = true,
  showSource = false,
  compact = true,
  className = ''
}) => {
  // Limit and prioritize suggestions
  const displaySuggestions = useMemo(() => {
    return suggestions
      .slice(0, maxDisplay)
      .sort((a, b) => {
        // Prioritize entries with Dutch translations
        if (a.dutch && !b.dutch) return -1;
        if (!a.dutch && b.dutch) return 1;
        
        // Prioritize shorter translations (often more specific)
        return a.english.length - b.english.length;
      });
  }, [suggestions, maxDisplay]);

  if (displaySuggestions.length === 0) {
    return null;
  }

  const handleSuggestionClick = (suggestion: CSVEntry, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(suggestion);
  };

  return (
    <div className={`csv-quick-suggestions ${className}`}>
      {compact ? (
        // Compact horizontal layout
        <div className="flex flex-wrap gap-1">
          {displaySuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={(e) => handleSuggestionClick(suggestion, e)}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700 rounded-md transition-colors duration-150"
              title={`${suggestion.english} → ${suggestion.dutch || 'No translation'}`}
            >
              <span className="font-medium">
                {suggestion.dutch || suggestion.english}
              </span>
              {showContext && suggestion.context && (
                <span className="ml-1 opacity-70">
                  ({suggestion.context})
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        // Detailed vertical layout
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick Suggestions
          </h4>
          <div className="space-y-1">
            {displaySuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={(e) => handleSuggestionClick(suggestion, e)}
                className="p-2 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md cursor-pointer transition-colors duration-150 border border-blue-200 dark:border-blue-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    {showSource && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                        {suggestion.english}
                      </div>
                    )}
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
                      {suggestion.dutch || suggestion.english}
                    </div>
                    {showContext && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {suggestion.utterer && (
                          <span>{suggestion.utterer}</span>
                        )}
                        {suggestion.context && (
                          <span>• {suggestion.context}</span>
                        )}
                        {suggestion.sheetName && (
                          <span>• {suggestion.sheetName}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <svg
                      className="w-4 h-4 text-blue-500 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {suggestions.length > maxDisplay && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          +{suggestions.length - maxDisplay} more suggestions available
        </div>
      )}
    </div>
  );
};

export default CSVQuickSuggestions;