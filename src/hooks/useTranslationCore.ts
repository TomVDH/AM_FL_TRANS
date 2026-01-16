/**
 * Translation Core Hook
 *
 * Manages core translation state and navigation:
 * - Source texts and translations arrays
 * - Current index and translation
 * - Submit/previous navigation with change detection
 * - Output display reset
 *
 * Extracted from useTranslationState for better separation of concerns.
 */

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { BLANK_PLACEHOLDER } from '@/constants';
import {
  convertBlankToDisplay,
  convertDisplayToStorage,
} from '@/utils/translationHelpers';

// ============================================================================
// TYPES
// ============================================================================

export interface TranslationCoreState {
  // Core state
  sourceTexts: string[];
  utterers: string[];
  translations: string[];
  originalTranslations: string[];
  currentIndex: number;
  currentTranslation: string;
  isStarted: boolean;
  outputKey: number;

  // Refs
  fileInputRef: React.RefObject<HTMLInputElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;

  // Change detection
  hasCurrentEntryChanged: () => boolean;
  getCurrentOriginalValue: () => string;

  // Setters
  setSourceTexts: (texts: string[]) => void;
  setUtterers: (utterers: string[]) => void;
  setTranslations: (translations: string[]) => void;
  setOriginalTranslations: (translations: string[]) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentTranslation: (translation: string | ((prev: string) => string)) => void;
  setIsStarted: (started: boolean) => void;

  // Navigation functions
  handleStart: () => void;
  handleBackToSetup: () => void;
  handleSubmit: () => void;
  handlePrevious: () => void;
  handleSourceInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  jumpToRow: (rowNumber: number, startRow: number) => void;
  resetOutputDisplay: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useTranslationCore
 *
 * Core translation state management hook responsible for:
 * - Managing arrays of source texts, utterers, and translations
 * - Tracking current position and translation text
 * - Handling submit/previous navigation with change detection
 * - Managing started/setup state
 *
 * @returns Core translation state and functions
 */
export const useTranslationCore = (): TranslationCoreState => {
  // ========== Core State ==========
  const [sourceTexts, setSourceTexts] = useState<string[]>([]);
  const [utterers, setUtterers] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [originalTranslations, setOriginalTranslations] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [outputKey, setOutputKey] = useState(0);

  // ========== Refs ==========
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ========== Change Detection ==========
  const getCurrentOriginalValue = useCallback(() => {
    const original = originalTranslations[currentIndex] || BLANK_PLACEHOLDER;
    return convertBlankToDisplay(original);
  }, [originalTranslations, currentIndex]);

  const hasCurrentEntryChanged = useCallback(() => {
    const originalValue = getCurrentOriginalValue();
    const currentValue = currentTranslation.trim();
    // If both are effectively empty, no change
    if (originalValue === '' && currentValue === '') return false;
    // Compare the actual values
    return currentValue !== originalValue;
  }, [getCurrentOriginalValue, currentTranslation]);

  // ========== Navigation Functions ==========
  const handleStart = useCallback(() => {
    setIsStarted(true);
  }, []);

  const handleBackToSetup = useCallback(() => {
    setIsStarted(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const newTranslations = [...translations];
    const hasChanged = hasCurrentEntryChanged();

    // Only update the translations array if the entry has actually changed
    if (hasChanged) {
      newTranslations[currentIndex] = convertDisplayToStorage(currentTranslation);
      setTranslations(newTranslations);

      // Show success feedback
      if (currentTranslation.trim() !== '') {
        toast.success('Translation saved', { duration: 1500 });
      }
    }

    // Only move to next if not on last row
    if (currentIndex < sourceTexts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextTranslation = hasChanged
        ? newTranslations[currentIndex + 1]
        : translations[currentIndex + 1];
      setCurrentTranslation(convertBlankToDisplay(nextTranslation));
    }
  }, [currentIndex, currentTranslation, sourceTexts.length, translations, hasCurrentEntryChanged]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newTranslations = [...translations];
      const hasChanged = hasCurrentEntryChanged();

      // Only update the translations array if the entry has actually changed
      if (hasChanged) {
        newTranslations[currentIndex] = convertDisplayToStorage(currentTranslation);
        setTranslations(newTranslations);
      }

      setCurrentIndex(currentIndex - 1);
      const prevTranslation = hasChanged
        ? newTranslations[currentIndex - 1]
        : translations[currentIndex - 1];
      setCurrentTranslation(convertBlankToDisplay(prevTranslation));
    }
  }, [currentIndex, currentTranslation, translations, hasCurrentEntryChanged]);

  const handleSourceInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const lines = text.split('\n').filter(line => line.trim());
    setSourceTexts(lines);
    setUtterers(new Array(lines.length).fill(''));
    setTranslations(new Array(lines.length).fill(BLANK_PLACEHOLDER));
    setOriginalTranslations(new Array(lines.length).fill(BLANK_PLACEHOLDER));
    setCurrentIndex(0);
    setCurrentTranslation('');
  }, []);

  const jumpToRow = useCallback(
    (rowNumber: number, startRow: number) => {
      const index = rowNumber - startRow;
      if (index >= 0 && index < sourceTexts.length) {
        setCurrentIndex(index);
        setCurrentTranslation(convertBlankToDisplay(translations[index]));
      }
    },
    [sourceTexts.length, translations]
  );

  const resetOutputDisplay = useCallback(() => {
    // Clear all translations and reset to blank placeholders
    setTranslations(new Array(sourceTexts.length).fill(BLANK_PLACEHOLDER));
    setCurrentTranslation('');
    // Force a complete re-render of the output component
    setOutputKey(prev => prev + 1);
  }, [sourceTexts.length]);

  // ========== Return ==========
  return {
    // State
    sourceTexts,
    utterers,
    translations,
    originalTranslations,
    currentIndex,
    currentTranslation,
    isStarted,
    outputKey,

    // Refs
    fileInputRef,
    textareaRef,

    // Change detection
    hasCurrentEntryChanged,
    getCurrentOriginalValue,

    // Setters
    setSourceTexts,
    setUtterers,
    setTranslations,
    setOriginalTranslations,
    setCurrentIndex,
    setCurrentTranslation,
    setIsStarted,

    // Functions
    handleStart,
    handleBackToSetup,
    handleSubmit,
    handlePrevious,
    handleSourceInput,
    jumpToRow,
    resetOutputDisplay,
  };
}; 