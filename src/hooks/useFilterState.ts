/**
 * Filter State Hook
 *
 * Manages filtering and navigation state for translation entries.
 * Extracted from useTranslationState for better separation of concerns.
 */

import { useState, useMemo, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type FilterStatus = 'all' | 'completed' | 'blank' | 'modified';

export interface FilterOptions {
  status: FilterStatus;
  speaker?: string;
  searchTerm?: string;
}

export interface FilterStats {
  all: number;
  completed: number;
  blank: number;
  modified: number;
}

export interface UseFilterStateProps {
  translations: string[];
  originalTranslations: string[];
  sourceTexts: string[];
  utterers: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  setCurrentTranslation: (translation: string) => void;
  blankPlaceholder?: string;
}

export interface FilterState {
  filterOptions: FilterOptions;
  filteredIndices: number[];
  filterStats: FilterStats;
  setFilterOptions: (options: FilterOptions) => void;
  setFilterStatus: (status: FilterStatus) => void;
  navigateToNextFiltered: () => void;
  navigateToPrevFiltered: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useFilterState
 *
 * Manages filtering logic for translation entries including:
 * - Filter by status (all, completed, blank, modified)
 * - Filter by speaker
 * - Search filter
 * - Navigation between filtered entries
 *
 * @param props - Dependencies from parent hook
 * @returns Filter state and functions
 */
export const useFilterState = ({
  translations,
  originalTranslations,
  sourceTexts,
  utterers,
  currentIndex,
  setCurrentIndex,
  setCurrentTranslation,
  blankPlaceholder = '[BLANK, REMOVE LATER]',
}: UseFilterStateProps): FilterState => {
  // ========== State ==========
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ status: 'all' });

  // ========== Helpers ==========
  const isBlank = useCallback(
    (value: string | undefined) => !value || value === '' || value === blankPlaceholder,
    [blankPlaceholder]
  );

  const convertToDisplay = useCallback(
    (value: string | undefined) => (value === blankPlaceholder ? '' : value || ''),
    [blankPlaceholder]
  );

  // ========== Computed Stats ==========
  const filterStats = useMemo((): FilterStats => {
    const all = translations.length;
    const blank = translations.filter(t => isBlank(t)).length;
    const completed = all - blank;
    const modified = translations.filter((t, idx) => {
      const original = originalTranslations[idx] || blankPlaceholder;
      const tIsBlank = isBlank(t);
      const wasBlank = isBlank(original);
      if (tIsBlank && wasBlank) return false;
      return t !== original;
    }).length;
    return { all, completed, blank, modified };
  }, [translations, originalTranslations, isBlank, blankPlaceholder]);

  // ========== Filtered Indices ==========
  const filteredIndices = useMemo((): number[] => {
    // Fast path: no filters active
    if (filterOptions.status === 'all' && !filterOptions.speaker && !filterOptions.searchTerm) {
      return sourceTexts.map((_, i) => i);
    }

    return sourceTexts
      .map((source, idx) => {
        const translation = translations[idx];
        const original = originalTranslations[idx] || blankPlaceholder;
        const utterer = utterers[idx] || '';

        // Status filter
        if (filterOptions.status !== 'all') {
          const tIsBlank = isBlank(translation);
          const wasBlank = isBlank(original);
          const isModified = translation !== original && !(tIsBlank && wasBlank);

          if (filterOptions.status === 'blank' && !tIsBlank) return -1;
          if (filterOptions.status === 'completed' && tIsBlank) return -1;
          if (filterOptions.status === 'modified' && !isModified) return -1;
        }

        // Speaker filter
        if (filterOptions.speaker) {
          if (!utterer.toLowerCase().includes(filterOptions.speaker.toLowerCase())) {
            return -1;
          }
        }

        // Search term filter (searches source text and translation)
        if (filterOptions.searchTerm) {
          const searchLower = filterOptions.searchTerm.toLowerCase();
          const matchesSource = source.toLowerCase().includes(searchLower);
          const matchesTranslation = translation.toLowerCase().includes(searchLower);
          if (!matchesSource && !matchesTranslation) return -1;
        }

        return idx;
      })
      .filter(idx => idx !== -1);
  }, [sourceTexts, translations, originalTranslations, utterers, filterOptions, isBlank, blankPlaceholder]);

  // ========== Actions ==========
  const setFilterStatus = useCallback((status: FilterStatus) => {
    setFilterOptions(prev => ({ ...prev, status }));
  }, []);

  const navigateToNextFiltered = useCallback(() => {
    if (filteredIndices.length === 0) return;

    const currentPosInFiltered = filteredIndices.indexOf(currentIndex);
    if (currentPosInFiltered === -1) {
      // Current index not in filtered list, jump to first filtered entry
      const nextIdx = filteredIndices[0];
      setCurrentIndex(nextIdx);
      setCurrentTranslation(convertToDisplay(translations[nextIdx]));
    } else if (currentPosInFiltered < filteredIndices.length - 1) {
      // Move to next filtered entry
      const nextIdx = filteredIndices[currentPosInFiltered + 1];
      setCurrentIndex(nextIdx);
      setCurrentTranslation(convertToDisplay(translations[nextIdx]));
    }
    // If at last filtered entry, do nothing
  }, [filteredIndices, currentIndex, translations, setCurrentIndex, setCurrentTranslation, convertToDisplay]);

  const navigateToPrevFiltered = useCallback(() => {
    if (filteredIndices.length === 0) return;

    const currentPosInFiltered = filteredIndices.indexOf(currentIndex);
    if (currentPosInFiltered === -1) {
      // Current index not in filtered list, jump to last filtered entry
      const prevIdx = filteredIndices[filteredIndices.length - 1];
      setCurrentIndex(prevIdx);
      setCurrentTranslation(convertToDisplay(translations[prevIdx]));
    } else if (currentPosInFiltered > 0) {
      // Move to previous filtered entry
      const prevIdx = filteredIndices[currentPosInFiltered - 1];
      setCurrentIndex(prevIdx);
      setCurrentTranslation(convertToDisplay(translations[prevIdx]));
    }
    // If at first filtered entry, do nothing
  }, [filteredIndices, currentIndex, translations, setCurrentIndex, setCurrentTranslation, convertToDisplay]);

  // ========== Return ==========
  return {
    filterOptions,
    filteredIndices,
    filterStats,
    setFilterOptions,
    setFilterStatus,
    navigateToNextFiltered,
    navigateToPrevFiltered,
  };
};
