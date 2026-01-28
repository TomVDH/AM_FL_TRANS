/**
 * Text Operations Hook
 *
 * Manages text manipulation operations:
 * - Copy source text to clipboard
 * - Insert translated suggestions at cursor
 * - Insert placeholders
 * - Trim whitespace
 * - Persist translations to backend
 *
 * Extracted from useTranslationState for better separation of concerns.
 */

import { useCallback } from 'react';
import { toast } from 'sonner';

// ============================================================================
// TYPES
// ============================================================================

export interface UseTextOperationsProps {
  sourceTexts: string[];
  currentIndex: number;
  currentTranslation: string;
  setCurrentTranslation: (translation: string | ((prev: string) => string)) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export interface TextOperationsState {
  copySourceText: () => void;
  copySourceToJsonSearch: () => void;
  insertTranslatedSuggestion: (translatedText: string) => void;
  insertPlaceholder: (originalSource: string) => void;
  trimCurrentTranslation: () => void;
  persistTranslation: (rowNumber: number, newTranslation: string) => Promise<void>;
  extractSpeakerName: (utterer: string) => string;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useTextOperations
 *
 * Provides text manipulation utilities for the translation workflow.
 * Handles clipboard operations, cursor-aware text insertion, and
 * backend persistence.
 *
 * @param props - Dependencies from parent hook
 * @returns Text operation functions
 */
export const useTextOperations = ({
  sourceTexts,
  currentIndex,
  currentTranslation,
  setCurrentTranslation,
  textareaRef,
}: UseTextOperationsProps): TextOperationsState => {
  // ========== Clipboard Operations ==========

  /**
   * Copy source text to clipboard (cleaned of extra whitespace)
   */
  const copySourceText = useCallback(() => {
    const sourceText = sourceTexts[currentIndex];
    if (sourceText) {
      // Remove whitespace and clean the text before copying
      const cleanText = sourceText.trim().replace(/\s+/g, ' ');
      navigator.clipboard.writeText(cleanText);
      toast.success('Source text copied to clipboard');
    }
  }, [currentIndex, sourceTexts]);

  /**
   * Copy source text to JSON search (placeholder for component integration)
   */
  const copySourceToJsonSearch = useCallback(() => {
    const sourceText = sourceTexts[currentIndex];
    if (sourceText) {
      console.log('Copying source text to JSON search:', sourceText);
      // Note: The actual setJsonSearchTerm will be handled by the component
    }
  }, [currentIndex, sourceTexts]);

  // ========== Text Insertion Operations ==========

  /**
   * Insert translated suggestion at cursor position in textarea
   */
  const insertTranslatedSuggestion = useCallback(
    (translatedText: string) => {
      const textarea = textareaRef.current;

      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const before = currentTranslation.slice(0, cursorPos);
        const after = currentTranslation.slice(cursorPos);
        const newText = before + translatedText + after;

        setCurrentTranslation(newText);

        // Restore cursor position after the inserted text
        setTimeout(() => {
          if (textarea) {
            const newCursorPos = cursorPos + translatedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
          }
        }, 0);
      } else {
        // Fallback: append to end
        setCurrentTranslation(prev => prev + translatedText);
      }
    },
    [currentTranslation, setCurrentTranslation, textareaRef]
  );

  /**
   * Insert placeholder with original source text wrapped in parentheses
   */
  const insertPlaceholder = useCallback(
    (originalSource: string) => {
      const placeholderText = `(${originalSource})`;
      const textarea = textareaRef.current;

      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const before = currentTranslation.slice(0, cursorPos);
        const after = currentTranslation.slice(cursorPos);
        const newText = before + placeholderText + after;

        setCurrentTranslation(newText);

        // Restore cursor position after the inserted text
        setTimeout(() => {
          if (textarea) {
            const newCursorPos = cursorPos + placeholderText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
          }
        }, 0);
      } else {
        // Fallback: append to end
        setCurrentTranslation(prev => prev + placeholderText);
      }
    },
    [currentTranslation, setCurrentTranslation, textareaRef]
  );

  /**
   * Trim whitespace from current translation
   */
  const trimCurrentTranslation = useCallback(() => {
    setCurrentTranslation(prev => prev.trim());
  }, [setCurrentTranslation]);

  // ========== Backend Persistence ==========

  /**
   * Persist translation to backend API
   */
  const persistTranslation = useCallback(async (rowNumber: number, newTranslation: string) => {
    try {
      const response = await fetch('/api/persist-translation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: 'READ_ME_LocalizationManual',
          rowNumber: rowNumber,
          newTranslation: newTranslation,
        }),
      });

      if (response.ok) {
        toast.success('Translation saved successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save translation');
      }
    } catch (error) {
      console.error('Error persisting translation:', error);
      toast.error('Network error: Failed to save translation');
    }
  }, []);

  // ========== Helper Functions ==========

  /**
   * Extract clean speaker name from utterer string
   * Parses formats like "SAY.Category.SubCategory.Name.123"
   */
  const extractSpeakerName = useCallback((utterer: string): string => {
    if (!utterer) return 'Speaker';

    // Try to extract from dot-separated format
    const parts = utterer.split('.');
    if (parts.length >= 4) {
      return parts[3];
    }

    // Fallback: clean up the string
    const cleanName = utterer.replace(/^SAY\./, '').replace(/\.\d+$/, '');
    if (cleanName && cleanName !== utterer) {
      return cleanName.replace(/_/g, ' ');
    }

    return 'Speaker';
  }, []);

  // ========== Return ==========
  return {
    copySourceText,
    copySourceToJsonSearch,
    insertTranslatedSuggestion,
    insertPlaceholder,
    trimCurrentTranslation,
    persistTranslation,
    extractSpeakerName,
  };
};
