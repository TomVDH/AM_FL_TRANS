'use client';

import React, { useMemo, useState } from 'react';

interface CodexMatch {
  name: string;
  english: string;
  dutch: string;
  description?: string;
  category?: string;
  startIndex: number;
  endIndex: number;
}

interface QuickReferenceBarProps {
  sourceText: string;
  findCharacterMatches: (text: string) => CodexMatch[];
  onInsert: (dutchText: string) => void;
  isVisible: boolean;
}

const QuickReferenceBar: React.FC<QuickReferenceBarProps> = ({
  sourceText,
  findCharacterMatches,
  onInsert,
  isVisible,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const MAX_VISIBLE = 3;

  // Auto-detect matches from current source text
  const matches = useMemo(() => {
    if (!sourceText) return [];
    return findCharacterMatches(sourceText);
  }, [sourceText, findCharacterMatches]);

  if (!isVisible || matches.length === 0) {
    return null;
  }

  const visibleMatches = expandedView ? matches : matches.slice(0, MAX_VISIBLE);
  const hiddenCount = matches.length - MAX_VISIBLE;

  return (
    <div className="quick-reference-bar mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800 p-3 shadow-sm transition-all duration-300" style={{ borderRadius: '6px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
            Quick Reference
          </span>
          <span className="text-xs text-purple-500 dark:text-purple-400">
            {matches.length} match{matches.length !== 1 ? 'es' : ''} found
          </span>
        </div>
        {matches.length > MAX_VISIBLE && (
          <button
            onClick={() => setExpandedView(!expandedView)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-medium transition-colors"
          >
            {expandedView ? 'Show less' : `+${hiddenCount} more`}
          </button>
        )}
      </div>

      {/* Match Pills */}
      <div className="flex flex-wrap gap-2">
        {visibleMatches.map((match, index) => (
          <div
            key={`${match.english}-${index}`}
            className="group flex items-center gap-1 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 px-3 py-2 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200"
            style={{ borderRadius: '4px' }}
          >
            {/* Category indicator */}
            {match.category && (
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                match.category === 'CHARACTER' ? 'bg-purple-500' :
                match.category === 'LOCATION' ? 'bg-blue-500' :
                'bg-gray-400'
              }`} />
            )}

            {/* English name */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {match.english}
            </span>

            {/* Arrow */}
            <svg className="w-3 h-3 text-purple-400 dark:text-purple-500 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Dutch translation */}
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              {match.dutch}
            </span>

            {/* Insert button */}
            <button
              onClick={() => onInsert(match.dutch)}
              className="ml-2 p-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-200 opacity-70 group-hover:opacity-100"
              style={{ borderRadius: '3px', minWidth: '28px', minHeight: '28px' }}
              title={`Insert "${match.dutch}"`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Hint text */}
      <p className="mt-2 text-[10px] text-purple-500 dark:text-purple-400 opacity-70">
        Click + to insert the Dutch translation into your text
      </p>
    </div>
  );
};

export default QuickReferenceBar;
