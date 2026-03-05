'use client';

import { useMemo, useCallback } from 'react';

/**
 * Represents an edited translation entry that can be used as a reference
 */
export interface EditedTranslationMatch {
  sourceEnglish: string;
  translatedText: string;
  index: number;
  rowNumber: number;
  isCurrentEntry: boolean;
  utterer?: string;
}

interface UseEditedTranslationsProps {
  sourceTexts: string[];
  translations: string[];
  originalTranslations: string[];
  utterers: string[];
  currentIndex: number;
  startRow: number;
}

interface UseEditedTranslationsReturn {
  /** All entries that have been edited (modified from original) */
  editedEntries: EditedTranslationMatch[];

  /** Find repetitions: other entries with same source text that have translations */
  findRepetitions: (currentSourceText: string) => EditedTranslationMatch[];

  /** Find edited matches for any text (for QuickReferenceBar auto-detection) */
  findEditedMatches: (text: string) => EditedTranslationMatch[];

  /** Total count of edited entries */
  totalEdited: number;
}

const BLANK_PLACEHOLDER = '[BLANK, REMOVE LATER]';

/**
 * Hook for tracking edited translations and finding repetitions
 *
 * Derives edited translation data from existing translation state,
 * enabling reference lookup for previously translated similar entries.
 */
export function useEditedTranslations({
  sourceTexts,
  translations,
  originalTranslations,
  utterers,
  currentIndex,
  startRow,
}: UseEditedTranslationsProps): UseEditedTranslationsReturn {

  // Build source text index for O(1) repetition lookup
  const sourceTextIndex = useMemo(() => {
    const index = new Map<string, number[]>();
    sourceTexts.forEach((text, idx) => {
      if (!text) return;
      const key = text.toLowerCase().trim();
      if (!index.has(key)) {
        index.set(key, []);
      }
      index.get(key)!.push(idx);
    });
    return index;
  }, [sourceTexts]);

  // Compute all edited entries (entries with non-blank translations that differ from original)
  const editedEntries = useMemo(() => {
    const entries: EditedTranslationMatch[] = [];

    translations.forEach((trans, idx) => {
      const original = originalTranslations[idx] || BLANK_PLACEHOLDER;
      const isBlank = trans === '' || trans === BLANK_PLACEHOLDER;
      const wasBlank = original === '' || original === BLANK_PLACEHOLDER;

      // Include if:
      // 1. Has a non-blank translation
      // 2. Either was modified from original OR was originally blank and now has content
      if (isBlank) return;

      // Skip if unchanged from a non-blank original
      if (trans === original && !wasBlank) return;

      entries.push({
        sourceEnglish: sourceTexts[idx] || '',
        translatedText: trans,
        index: idx,
        rowNumber: startRow + idx,
        isCurrentEntry: idx === currentIndex,
        utterer: utterers[idx],
      });
    });

    return entries;
  }, [translations, originalTranslations, sourceTexts, utterers, currentIndex, startRow]);

  // Find repetitions: other entries with the same source text that have translations
  const findRepetitions = useCallback((currentSourceText: string): EditedTranslationMatch[] => {
    if (!currentSourceText) return [];

    const key = currentSourceText.toLowerCase().trim();
    const indices = sourceTextIndex.get(key) || [];

    // Filter to entries that:
    // 1. Have the same source text
    // 2. Are not the current entry
    // 3. Have a non-blank translation
    const results: EditedTranslationMatch[] = [];

    for (const idx of indices) {
      if (idx === currentIndex) continue;

      const trans = translations[idx];
      if (!trans || trans === '' || trans === BLANK_PLACEHOLDER) continue;

      results.push({
        sourceEnglish: sourceTexts[idx] || '',
        translatedText: trans,
        index: idx,
        rowNumber: startRow + idx,
        isCurrentEntry: false,
        utterer: utterers[idx],
      });
    }

    return results;
  }, [sourceTextIndex, currentIndex, translations, sourceTexts, utterers, startRow]);

  // Find edited matches for QuickReferenceBar (matches current source text)
  const findEditedMatches = useCallback((text: string): EditedTranslationMatch[] => {
    if (!text) return [];
    return findRepetitions(text);
  }, [findRepetitions]);

  return {
    editedEntries,
    findRepetitions,
    findEditedMatches,
    totalEdited: editedEntries.length,
  };
}

export default useEditedTranslations;
