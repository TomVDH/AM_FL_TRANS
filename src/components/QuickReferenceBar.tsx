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
  onOpenReferenceTools?: () => void;
  isVisible: boolean;
}

/**
 * QuickReferenceBar - Compact auto-detected codex matches
 *
 * Phase 2 refinements:
 * - No top border radius (underhangs the left column)
 * - Smaller, more compact pills
 * - Click pill to open Reference Tools, click + to insert
 */
const QuickReferenceBar: React.FC<QuickReferenceBarProps> = ({
  sourceText,
  findCharacterMatches,
  onInsert,
  onOpenReferenceTools,
  isVisible,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const MAX_VISIBLE = 4;

  // Auto-detect matches from current source text
  const matches = useMemo(() => {
    if (!sourceText) return [];
    const allMatches = findCharacterMatches(sourceText);

    // Group matches by character name (english) to show count
    const groupedMap = new Map<string, {
      match: CodexMatch;
      count: number;
      instances: CodexMatch[];
    }>();

    allMatches.forEach(match => {
      const key = match.english;
      if (groupedMap.has(key)) {
        const existing = groupedMap.get(key)!;
        existing.count++;
        existing.instances.push(match);
      } else {
        groupedMap.set(key, {
          match,
          count: 1,
          instances: [match],
        });
      }
    });

    // Return array with count metadata
    return Array.from(groupedMap.values());
  }, [sourceText, findCharacterMatches]);

  if (!isVisible || matches.length === 0) {
    return null;
  }

  const visibleMatches = expandedView ? matches : matches.slice(0, MAX_VISIBLE);
  const hiddenCount = matches.length - MAX_VISIBLE;

  return (
    <div
      className="quick-reference-bar bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-600 dark:border-purple-800 border-t-0 px-2.5 py-2 shadow-sm transition-all duration-300"
      style={{
        borderRadius: '0 0 4px 4px', // No top radius - bottom only
        marginTop: '-1px', // Overlap border with element above
      }}
    >
      {/* Header - More compact */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
            Quick Ref
          </span>
          <span className="text-[10px] text-purple-500 dark:text-purple-400">
            {matches.reduce((sum, m) => sum + m.count, 0)} instance{matches.reduce((sum, m) => sum + m.count, 0) !== 1 ? 's' : ''} ({matches.length} unique)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {matches.length > MAX_VISIBLE && (
            <button
              onClick={() => setExpandedView(!expandedView)}
              className="text-[10px] text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-medium transition-colors"
            >
              {expandedView ? 'Less' : `+${hiddenCount}`}
            </button>
          )}
          {onOpenReferenceTools && (
            <button
              onClick={onOpenReferenceTools}
              className="text-[10px] text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-medium transition-colors flex items-center gap-0.5"
              title="Open Reference Tools (R)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open
            </button>
          )}
        </div>
      </div>

      {/* Match Pills - Smaller and more compact */}
      <div className="flex flex-wrap gap-1.5">
        {visibleMatches.map((item, index) => (
          <div
            key={`${item.match.english}-${index}`}
            className="group flex items-center gap-0.5 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 px-2 py-1 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 cursor-pointer"
            style={{ borderRadius: '3px' }}
            onClick={() => onOpenReferenceTools?.()}
            title={`Found ${item.count}x - Click to open Reference Tools`}
          >
            {/* Category indicator */}
            {item.match.category && (
              <span className={`w-1 h-1 rounded-full mr-0.5 ${
                item.match.category === 'CHARACTER' ? 'bg-purple-500' :
                item.match.category === 'LOCATION' ? 'bg-blue-500' :
                'bg-gray-400'
              }`} />
            )}

            {/* English name - smaller */}
            <span className="text-[11px] text-gray-600 dark:text-gray-400">
              {item.match.english}
            </span>

            {/* Arrow - smaller */}
            <svg className="w-2.5 h-2.5 text-purple-400 dark:text-purple-500 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Dutch translation - smaller */}
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
              {item.match.dutch}
            </span>

            {/* Insert button - smaller, stops propagation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInsert(item.match.dutch);
              }}
              className="ml-1 p-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-200 opacity-60 group-hover:opacity-100"
              style={{ borderRadius: '2px', minWidth: '20px', minHeight: '20px' }}
              title={`Insert "${item.match.dutch}"`}
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickReferenceBar;
