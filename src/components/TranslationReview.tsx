'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

interface TranslationReviewProps {
  sourceTexts: string[];
  translations: string[];
  originalTranslations: string[];
  onUpdateTranslation: (index: number, value: string) => void;
  onBack: () => void;
}

type FilterType = 'all' | 'blank' | 'modified';

/**
 * TranslationReview Component
 *
 * A screen for reviewing and inline-editing all translations.
 * Features:
 * - Filter tabs (All | Blank | Modified) with counts
 * - Scrollable list with source text and editable translation
 * - Visual indicators for modified and blank entries
 * - Auto-save on blur with debouncing
 * - Responsive dark mode design
 */
const TranslationReview: React.FC<TranslationReviewProps> = ({
  sourceTexts,
  translations,
  originalTranslations,
  onUpdateTranslation,
  onBack,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [localTranslations, setLocalTranslations] = useState<string[]>(translations);
  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Sync local translations with props when they change externally
  useEffect(() => {
    setLocalTranslations(translations);
  }, [translations]);

  // Cleanup debounce timers on unmount
  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // Calculate counts for each filter
  const counts = useMemo(() => {
    let blank = 0;
    let modified = 0;

    for (let i = 0; i < sourceTexts.length; i++) {
      const translation = localTranslations[i] || '';
      const original = originalTranslations[i] || '';
      const isBlank = !translation.trim() || translation === '[BLANK, REMOVE LATER]';
      const isModified = translation !== original;

      if (isBlank) blank++;
      if (isModified) modified++;
    }

    return {
      all: sourceTexts.length,
      blank,
      modified,
    };
  }, [sourceTexts, localTranslations, originalTranslations]);

  // Filter entries based on active filter
  const filteredIndices = useMemo(() => {
    const indices: number[] = [];

    for (let i = 0; i < sourceTexts.length; i++) {
      const translation = localTranslations[i] || '';
      const original = originalTranslations[i] || '';
      const isBlank = !translation.trim() || translation === '[BLANK, REMOVE LATER]';
      const isModified = translation !== original;

      if (activeFilter === 'all') {
        indices.push(i);
      } else if (activeFilter === 'blank' && isBlank) {
        indices.push(i);
      } else if (activeFilter === 'modified' && isModified) {
        indices.push(i);
      }
    }

    return indices;
  }, [sourceTexts, localTranslations, originalTranslations, activeFilter]);

  // Debounced update handler
  const handleTranslationChange = useCallback((index: number, value: string) => {
    // Update local state immediately for responsive UI
    setLocalTranslations((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    // Clear existing timer for this index
    const existingTimer = debounceTimers.current.get(index);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new debounce timer (300ms)
    const timer = setTimeout(() => {
      onUpdateTranslation(index, value);
      debounceTimers.current.delete(index);
    }, 300);

    debounceTimers.current.set(index, timer);
  }, [onUpdateTranslation]);

  // Handle blur - immediately save if there's a pending change
  const handleBlur = useCallback((index: number) => {
    const existingTimer = debounceTimers.current.get(index);
    if (existingTimer) {
      clearTimeout(existingTimer);
      debounceTimers.current.delete(index);
      onUpdateTranslation(index, localTranslations[index]);
    }
  }, [onUpdateTranslation, localTranslations]);

  // Check if an entry is modified
  const isModified = useCallback((index: number) => {
    const translation = localTranslations[index] || '';
    const original = originalTranslations[index] || '';
    return translation !== original;
  }, [localTranslations, originalTranslations]);

  // Check if an entry is blank
  const isBlank = useCallback((index: number) => {
    const translation = localTranslations[index] || '';
    return !translation.trim() || translation === '[BLANK, REMOVE LATER]';
  }, [localTranslations]);

  // Truncate text with tooltip
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
            style={{ borderRadius: '3px' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Summary
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-gray-100">{filteredIndices.length}</span> of{' '}
            <span className="font-bold text-gray-900 dark:text-gray-100">{sourceTexts.length}</span> entries
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>
          {(['all', 'blank', 'modified'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 px-4 py-2 text-xs font-bold tracking-tight uppercase transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 text-white dark:text-black border border-gray-700 dark:border-gray-300'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
              }`}
              style={{ borderRadius: '3px' }}
            >
              <span className="flex items-center justify-center gap-2">
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-[10px] font-bold ${
                    activeFilter === filter
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                      : filter === 'blank'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : filter === 'modified'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                  style={{ borderRadius: '3px' }}
                >
                  {counts[filter]}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Scrollable List */}
        <div
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 overflow-hidden"
          style={{ borderRadius: '3px' }}
        >
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {filteredIndices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium">No entries match the current filter</p>
              </div>
            ) : (
              filteredIndices.map((index, displayIndex) => {
                const modified = isModified(index);
                const blank = isBlank(index);

                return (
                  <div
                    key={index}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors duration-200 ${
                      displayIndex % 2 === 0
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-gray-50 dark:bg-gray-800/50'
                    } ${
                      blank
                        ? 'border-l-4 border-l-red-500 dark:border-l-red-400'
                        : modified
                        ? 'border-l-4 border-l-amber-500 dark:border-l-amber-400'
                        : 'border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Row Number */}
                      <div className="flex-shrink-0 w-12">
                        <span className="inline-flex items-center justify-center w-10 h-10 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600" style={{ borderRadius: '3px' }}>
                          {index + 1}
                        </span>
                      </div>

                      {/* Source Text */}
                      <div className="flex-1 min-w-0 lg:max-w-[40%]">
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Source
                        </label>
                        <div
                          className="text-sm text-gray-900 dark:text-gray-100 break-words"
                          title={sourceTexts[index]}
                        >
                          {truncateText(sourceTexts[index], 150)}
                        </div>
                      </div>

                      {/* Translation Textarea */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Translation
                          </label>
                          {modified && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30" style={{ borderRadius: '3px' }}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Modified
                            </span>
                          )}
                          {blank && !modified && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30" style={{ borderRadius: '3px' }}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Blank
                            </span>
                          )}
                        </div>
                        <textarea
                          value={localTranslations[index] || ''}
                          onChange={(e) => handleTranslationChange(index, e.target.value)}
                          onBlur={() => handleBlur(index)}
                          className={`w-full p-3 text-sm border focus:ring-2 focus:ring-offset-0 transition-all duration-200 resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            blank
                              ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10'
                              : modified
                              ? 'border-amber-300 dark:border-amber-600 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20 bg-amber-50 dark:bg-amber-900/10'
                              : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-gray-500/20'
                          }`}
                          style={{ borderRadius: '3px', minHeight: '80px' }}
                          placeholder="Enter translation..."
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-red-500 dark:bg-red-400" style={{ borderRadius: '2px' }}></span>
            Blank entries
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-500 dark:bg-amber-400" style={{ borderRadius: '2px' }}></span>
            Modified entries
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] font-mono" style={{ borderRadius: '3px' }}>Tab</kbd>
            Move to next field
          </span>
        </div>
      </div>
    </div>
  );
};

export default TranslationReview;
