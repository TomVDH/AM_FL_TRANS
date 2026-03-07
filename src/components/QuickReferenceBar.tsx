'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import CharacterInfoCard from './CharacterInfoCard';

interface CodexMatch {
  name: string;
  english: string;
  dutch: string;
  description?: string;
  category?: string;
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
  dutchDialogueStyle?: string;
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

interface EditedMatch {
  sourceEnglish: string;
  translatedText: string;
  index: number;
  rowNumber: number;
  utterer?: string;
}

interface QuickReferenceBarProps {
  sourceText: string;
  findCharacterMatches: (text: string) => CodexMatch[];
  findXlsxMatches?: (text: string) => XlsxMatch[];
  findEditedMatches?: (text: string) => EditedMatch[];
  onInsert: (dutchText: string) => void;
  onOpenReferenceTools?: () => void;
  onJumpToEntry?: (index: number) => void;
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
  findEditedMatches,
  onInsert,
  onOpenReferenceTools,
  onJumpToEntry,
  isVisible,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null);
  const MAX_VISIBLE = 4;

  // Close character card when source text changes and character is no longer present
  useEffect(() => {
    if (expandedCharacter && sourceText) {
      const stillPresent = findCharacterMatches(sourceText).some(
        m => m.english === expandedCharacter
      );
      if (!stillPresent) {
        setExpandedCharacter(null);
      }
    }
  }, [sourceText, expandedCharacter, findCharacterMatches]);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && expandedCharacter) {
      setExpandedCharacter(null);
    }
  }, [expandedCharacter]);

  useEffect(() => {
    if (expandedCharacter) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [expandedCharacter, handleKeyDown]);

  // Helper: does this character have rich info?
  const hasCharacterInfo = (match: CodexMatch) =>
    match.category === 'CHARACTER' && (match.bio || match.gender || match.dialogueStyle || match.dutchDialogueStyle);

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

  // Auto-detect edited matches (repetitions with translations)
  const editedMatches = useMemo(() => {
    if (!sourceText || !findEditedMatches) return [];
    const allMatches = findEditedMatches(sourceText);

    // Group by translation to deduplicate
    const groupedMap = new Map<string, {
      match: EditedMatch;
      count: number;
    }>();

    allMatches.forEach(match => {
      if (!match.translatedText) return;

      const key = match.translatedText.toLowerCase();
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

    return Array.from(groupedMap.values()).slice(0, 4);
  }, [sourceText, findEditedMatches]);

  const totalCodexInstances = codexMatches.reduce((sum, m) => sum + m.count, 0);
  const totalXlsxInstances = xlsxMatches.reduce((sum, m) => sum + m.count, 0);
  const totalEditedInstances = editedMatches.reduce((sum, m) => sum + m.count, 0);
  const totalMatches = codexMatches.length + xlsxMatches.length + editedMatches.length;

  if (!isVisible || totalMatches === 0) {
    return null;
  }

  const visibleCodexMatches = expandedView ? codexMatches : codexMatches.slice(0, MAX_VISIBLE);
  const visibleXlsxMatches = expandedView ? xlsxMatches : xlsxMatches.slice(0, Math.max(0, MAX_VISIBLE - visibleCodexMatches.length));
  const visibleEditedMatches = expandedView ? editedMatches : editedMatches.slice(0, Math.max(0, MAX_VISIBLE - visibleCodexMatches.length - visibleXlsxMatches.length));
  const hiddenCount = totalMatches - (visibleCodexMatches.length + visibleXlsxMatches.length + visibleEditedMatches.length);

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
            {(totalCodexInstances > 0 || totalXlsxInstances > 0) && totalEditedInstances > 0 && ' · '}
            {totalEditedInstances > 0 && (
              <span className="text-orange-600 dark:text-orange-400">{totalEditedInstances} edited</span>
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
        {visibleCodexMatches.map((item, index) => {
          const hasInfo = hasCharacterInfo(item.match);
          const isExpanded = expandedCharacter === item.match.english;
          return (
            <div
              key={`codex-${item.match.english}-${index}`}
              className={`group flex items-center gap-0.5 bg-white dark:bg-gray-800 border px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                isExpanded
                  ? 'border-purple-400 dark:border-purple-500 ring-1 ring-purple-300 dark:ring-purple-600'
                  : 'border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500'
              }`}
              style={{ borderRadius: '3px' }}
              onClick={() => {
                if (hasInfo) {
                  setExpandedCharacter(isExpanded ? null : item.match.english);
                } else {
                  onOpenReferenceTools?.();
                }
              }}
              title={hasInfo
                ? `${item.count}x - Click for character info`
                : `Found ${item.count}x - Click to open Reference Tools`
              }
            >
              {/* Category indicator */}
              <span className="w-1.5 h-1.5 rounded-full mr-0.5 bg-purple-500" />

              {/* Info icon for characters with rich data */}
              {hasInfo && (
                <svg className={`w-3 h-3 mr-0.5 shrink-0 transition-colors ${isExpanded ? 'text-purple-600 dark:text-purple-300' : 'text-purple-400 dark:text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}

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

              {/* Gender badge inline on pill */}
              {item.match.gender && (
                <span className="ml-0.5 text-[9px] text-purple-500 dark:text-purple-400">
                  {item.match.gender === 'male' ? '\u2642' : '\u2640'}
                </span>
              )}

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
          );
        })}

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

        {/* Edited matches - Orange (repetitions from your own work) */}
        {visibleEditedMatches.map((item, index) => (
          <div
            key={`edited-${item.match.index}-${index}`}
            className="group flex items-center gap-0.5 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 px-2 py-1 shadow-sm hover:shadow-md hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-200 cursor-pointer"
            style={{ borderRadius: '3px' }}
            onClick={() => onJumpToEntry?.(item.match.index)}
            title={`Row ${item.match.rowNumber} - Your translation. Click to jump.`}
          >
            {/* Edited indicator */}
            <span className="w-1.5 h-1.5 rounded-full mr-0.5 bg-orange-500" />

            {/* Row number badge */}
            <span className="text-[9px] font-mono px-1 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 mr-0.5" style={{ borderRadius: '2px' }}>
              {item.match.rowNumber}
            </span>

            {/* Arrow */}
            <svg className="w-2.5 h-2.5 text-orange-400 dark:text-orange-500 mx-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Translation */}
            <span className="text-[11px] font-semibold text-orange-700 dark:text-orange-300 max-w-[120px] truncate">
              {item.match.translatedText}
            </span>

            {/* Insert button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInsert(item.match.translatedText);
              }}
              className="ml-1 p-1 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800 transition-all duration-200 opacity-60 group-hover:opacity-100"
              style={{ borderRadius: '2px', minWidth: '20px', minHeight: '20px' }}
              title={`Insert "${item.match.translatedText}"`}
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Character Info Card - expands below pills when a main character is clicked */}
      {expandedCharacter && (() => {
        const charData = codexMatches.find(m => m.match.english === expandedCharacter);
        if (!charData || !hasCharacterInfo(charData.match)) return null;
        return (
          <CharacterInfoCard
            character={charData.match}
            onClose={() => setExpandedCharacter(null)}
            onInsert={onInsert}
          />
        );
      })()}
    </div>
  );
};

// Memoized to prevent re-renders when parent state changes (e.g., typing in textarea)
export default React.memo(QuickReferenceBar);
