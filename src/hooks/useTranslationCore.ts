import { useState, useCallback, useRef } from 'react';

export interface TranslationCoreState {
  // Core translation state
  sourceTexts: string[];
  utterers: string[];
  translations: string[];
  currentIndex: number;
  currentTranslation: string;
  isStarted: boolean;
  
  // Refs
  fileInputRef: React.RefObject<HTMLInputElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  
  // Setters
  setSourceTexts: (texts: string[]) => void;
  setUtterers: (utterers: string[]) => void;
  setTranslations: (translations: string[]) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentTranslation: (translation: string) => void;
  setIsStarted: (started: boolean) => void;
  
  // Functions
  handleStart: () => void;
  handleBackToSetup: () => void;
  handleSubmit: () => void;
  handlePrevious: () => void;
  handleSourceInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  insertTranslatedSuggestion: (translatedText: string) => void;
  insertPlaceholder: (originalSource: string) => void;
  copySourceText: () => void;
  copySourceToJsonSearch: () => void;
  persistTranslation: (rowNumber: number, newTranslation: string) => Promise<void>;
  getCellLocation: (index: number) => string;
}

/**
 * Translation Core Hook
 * 
 * Manages the core translation functionality:
 * - Translation state management
 * - Navigation between translations
 * - Text input handling
 * - Copy operations
 * - Translation persistence
 * - Cell location calculation
 * 
 * @returns Translation core state and functions
 */
export const useTranslationCore = (): TranslationCoreState => {
  // ========== Core Translation State ==========
  const [sourceTexts, setSourceTexts] = useState<string[]>([]);
  const [utterers, setUtterers] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  
  // ========== Component References ==========
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // ========== Translation Functions ==========
  
  /**
   * Handle start button click
   * 
   * Initializes the translation session and sets up the workflow.
   */
  const handleStart = useCallback(() => {
    setIsStarted(true);
  }, []);
  
  /**
   * Handle back to setup button click
   * 
   * Returns to setup wizard from translation workflow.
   */
  const handleBackToSetup = useCallback(() => {
    setIsStarted(false);
  }, []);
  
  /**
   * Handle submit button click
   * 
   * Saves current translation and moves to next item.
   */
  const handleSubmit = useCallback(() => {
    if (currentIndex < sourceTexts.length - 1) {
      const newTranslations = [...translations];
      newTranslations[currentIndex] = currentTranslation;
      setTranslations(newTranslations);
      setCurrentIndex(currentIndex + 1);
      setCurrentTranslation(translations[currentIndex + 1] || '');
    }
  }, [currentIndex, currentTranslation, sourceTexts.length, translations]);
  
  /**
   * Handle previous button click
   * 
   * Moves to previous translation item.
   */
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newTranslations = [...translations];
      newTranslations[currentIndex] = currentTranslation;
      setTranslations(newTranslations);
      setCurrentIndex(currentIndex - 1);
      setCurrentTranslation(translations[currentIndex - 1] || '');
    }
  }, [currentIndex, currentTranslation, translations]);
  
  /**
   * Handle source text input
   * 
   * Updates manual source text when user types in textarea.
   */
  const handleSourceInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const lines = text.split('\n').filter(line => line.trim());
    setSourceTexts(lines);
    setUtterers(new Array(lines.length).fill(''));
    setTranslations(new Array(lines.length).fill(''));
    setCurrentIndex(0);
    setCurrentTranslation('');
  }, []);
  
  /**
   * Insert translated suggestion into textarea
   * 
   * Inserts a translated text at the current cursor position.
   */
  const insertTranslatedSuggestion = useCallback((translatedText: string) => {
    const textarea = textareaRef.current;
    
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const before = currentTranslation.slice(0, cursorPos);
      const after = currentTranslation.slice(cursorPos);
      const newText = before + translatedText + after;
      
      setCurrentTranslation(newText);
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        if (textarea) {
          const newCursorPos = cursorPos + translatedText.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    } else {
      // Fallback: append to the end if textarea ref is not available
      setCurrentTranslation(prev => prev + translatedText);
    }
  }, [currentTranslation]);
  
  /**
   * Insert placeholder with original source
   * 
   * Inserts a placeholder with the original English text.
   */
  const insertPlaceholder = useCallback((originalSource: string) => {
    const placeholderText = `(${originalSource})`;
    const textarea = textareaRef.current;
    
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const before = currentTranslation.slice(0, cursorPos);
      const after = currentTranslation.slice(cursorPos);
      const newText = before + placeholderText + after;
      
      setCurrentTranslation(newText);
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        if (textarea) {
          const newCursorPos = cursorPos + placeholderText.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    } else {
      // Fallback: append to the end if textarea ref is not available
      setCurrentTranslation(prev => prev + placeholderText);
    }
  }, [currentTranslation]);
  
  /**
   * Copy source text to clipboard
   * 
   * Copies the current source text to the clipboard.
   */
  const copySourceText = useCallback(() => {
    const sourceText = sourceTexts[currentIndex];
    if (sourceText) {
      navigator.clipboard.writeText(sourceText);
    }
  }, [currentIndex, sourceTexts]);
  
  /**
   * Copy source text to JSON search
   * 
   * Sets the current source text as the JSON search term.
   */
  const copySourceToJsonSearch = useCallback(() => {
    const sourceText = sourceTexts[currentIndex];
    if (sourceText) {
      // This would be handled by the JSON highlighting hook
      console.log('Copying source text to JSON search:', sourceText);
    }
  }, [currentIndex, sourceTexts]);
  
  /**
   * Persist translation to backend
   * 
   * Saves the translation to the backend API.
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
          newTranslation: newTranslation
        }),
      });

      if (response.ok) {
        console.log('Translation persisted successfully');
      } else {
        console.error('Failed to persist translation');
      }
    } catch (error) {
      console.error('Error persisting translation:', error);
    }
  }, []);
  
  /**
   * Get cell location for current index
   * 
   * Calculates the cell location based on the current index.
   */
  const getCellLocation = useCallback((index: number) => {
    // This is a simplified version - the actual implementation depends on Excel configuration
    return `Row ${index + 1}`;
  }, []);
  
  return {
    // State
    sourceTexts,
    utterers,
    translations,
    currentIndex,
    currentTranslation,
    isStarted,
    
    // Refs
    fileInputRef,
    textareaRef,
    
    // Setters
    setSourceTexts,
    setUtterers,
    setTranslations,
    setCurrentIndex,
    setCurrentTranslation,
    setIsStarted,
    
    // Functions
    handleStart,
    handleBackToSetup,
    handleSubmit,
    handlePrevious,
    handleSourceInput,
    insertTranslatedSuggestion,
    insertPlaceholder,
    copySourceText,
    copySourceToJsonSearch,
    persistTranslation,
    getCellLocation,
  };
}; 