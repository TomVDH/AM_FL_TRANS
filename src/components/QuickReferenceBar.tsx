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

interface XlsxMatch {
  sourceEnglish: string;
  translatedDutch: string;
  utterer?: string;
  context?: string;
  sheetName?: string;
  fileName?: string;
}

interface QuickReferenceBarProps {
  sourceText: string;
  findCharacterMatches: (text: string) => CodexMatch[];
  findXlsxMatches?: (text: string) => XlsxMatch[];
  onInsert: (dutchText: string) => void;
  onOpenReferenceTools?: () => void;
  isVisible: boolean;
}

/**
 * QuickReferenceBar - Compact auto-detected codex + XLSX matches
 *
 * Phase 2 refinements:
 * - No top border radius (underhangs the left column)
 * - Smaller, more compact pills
 * - Click pill to open Reference Tools, click + to insert
 * - XLSX matches shown in green, codex matches in purple
 */
const QuickReferenceBar: React.FC<QuickReferenceBarProps> = ({
  sourceText,
  findCharacterMatches,
  findXlsxMatches,
  onInsert,
  onOpenReferenceTools,
  isVisible,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const MAX_VISIBLE = 4;

  // Auto-detect codex matches from current source text
  const codexMatches = useMemo(() => {
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

  // Auto-detect XLSX matches from current source text
  const xlsxMatches = useMemo(() => {
    if (!sourceText || !findXlsxMatches) return [];
    const allMatches = findXlsxMatches(sourceText);

    // Group matches by dutch translation to deduplicate
    const groupedMap = new Map<string, {
      match: XlsxMatch;
      count: number;
    }>();

    allMatches.forEach(match => {
      // Skip if no dutch translation
      if (!match.translatedDutch) return;

      const key = match.translatedDutch.toLowerCase();
      if (groupedMap.has(key)) {
        const existing = groupedMap.get(key)!;
        existing.count++;
      } else {
        groupedMap.set(key, {
          match,
          count: 1,
        });
      }
    });

    // Return array, limit to avoid overwhelming
    return Array.from(groupedMap.values()).slice(0, 6);
  }, [sourceText, findXlsxMatches]);

  const totalCodexInstances = codexMatches.reduce((sum, m) => sum + m.count, 0);
  const totalXlsxInstances = xlsxMatches.reduce((sum, m) => sum + m.count, 0);
  const totalMatches = codexMatches.length + xlsxMatches.length;

  if (!isVisible || totalMatches === 0) {
    return null;
  }

  const visibleCodexMatches = expandedView ? codexMatches : codexMatches.slice(0, MAX_VISIBLE);
  const visibleXlsxMatches = expandedView ? xlsxMatches : xlsxMatches.slice(0, Math.max(0, MAX_VISIBLE - visibleCodexMatches.length));
  const hiddenCount = totalMatches - (visibleCodexMatches.length + visibleXlsxMatches.length);

  return (
    <div
      className="quick-reference-bar bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-400 dark:border-gray-600 border-t-0 px-2.5 py-2 shadow-sm transition-all duration-300"
      style={{
        borderRadius: '0 0 4px 4px', // No top radius - bottom only
        marginTop: '-1px', // Overlap border with element above
      }}
    >
      {/* Header - More compact */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Quick Ref
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            {totalCodexInstances > 0 && (
              <span className="text-purple-600 dark:text-purple-400">{totalCodexInstances} codex</span>
            )}
            {totalCodexInstances > 0 && totalXlsxInstances > 0 && ' · '}
            {totalXlsxInstances > 0 && (
              <span className="text-green-600 dark:text-green-400">{totalXlsxInstances} xlsx</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hiddenCount > 0 && (
            <button
              onClick={() => setExpandedView(!expandedView)}
              className="text-[10px] text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
            >
              {expandedView ? 'Less' : `+${hiddenCount}`}
            </button>
          )}
          {onOpenReferenceTools && (
            <button
              onClick={onOpenReferenceTools}
              className="text-[10px] text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors flex items-center gap-0.5"
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

      {/* Match Pills - Codex (purple) + XLSX (green) */}
      <div className="flex flex-wrap gap-1.5">
        {/* Codex matches - Purple */}
        {visibleCodexMatches.map((item, index) => (
          <div
            key={`codex-${item.match.english}-${index}`}
            className="group flex items-center gap-0.5 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 px-2 py-1 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 cursor-pointer"
            style={{ borderRadius: '3px' }}
            onClick={() => onOpenReferenceTools?.()}
            title={`Found ${item.count}x - Click to open Reference Tools`}
          >
            {/* Category indicator */}
            <span className="w-1.5 h-1.5 rounded-full mr-0.5 bg-purple-500" />

            {/* English name - smaller */}
            <span className="text-[11px] text-gray-600 dark:text-gray-400 max-w-[100px] truncate">
              {item.match.english}
            </span>

            {/* Arrow - smaller */}
            <svg className="w-2.5 h-2.5 text-purple-400 dark:text-purple-500 mx-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Translation - smaller */}
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 max-w-[100px] truncate">
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

        {/* XLSX matches - Green */}
        {visibleXlsxMatches.map((item, index) => (
          <div
            key={`xlsx-${item.match.translatedDutch}-${index}`}
            className="group flex items-center gap-0.5 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 px-2 py-1 shadow-sm hover:shadow-md hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 cursor-pointer"
            style={{ borderRadius: '3px' }}
            onClick={() => onOpenReferenceTools?.()}
            title={`Previous translation${item.match.sheetName ? ` from ${item.match.sheetName}` : ''} - Click to open Reference Tools`}
          >
            {/* XLSX indicator */}
            <span className="w-1.5 h-1.5 rounded-full mr-0.5 bg-green-500" />

            {/* English source - smaller */}
            <span className="text-[11px] text-gray-600 dark:text-gray-400 max-w-[100px] truncate">
              {item.match.sourceEnglish}
            </span>

            {/* Arrow - smaller */}
            <svg className="w-2.5 h-2.5 text-green-400 dark:text-green-500 mx-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Translation - smaller */}
            <span className="text-[11px] font-semibold text-green-700 dark:text-green-300 max-w-[100px] truncate">
              {item.match.translatedDutch}
            </span>

            {/* Insert button - smaller, stops propagation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInsert(item.match.translatedDutch);
              }}
              className="ml-1 p-1 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-200 opacity-60 group-hover:opacity-100"
              style={{ borderRadius: '2px', minWidth: '20px', minHeight: '20px' }}
              title={`Insert "${item.match.translatedDutch}"`}
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

// Memoized to prevent re-renders when parent state changes (e.g., typing in textarea)
export default React.memo(QuickReferenceBar);
