import { useState, useCallback } from 'react';

export interface TranslationWorkflowState {
  // Core translation state
  sourceTexts: string[];
  utterers: string[];
  translations: string[];
  currentIndex: number;
  currentTranslation: string;
  isStarted: boolean;
  
  // Setters
  setSourceTexts: (texts: string[]) => void;
  setUtterers: (utterers: string[]) => void;
  setTranslations: (translations: string[]) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentTranslation: (translation: string) => void;
  setIsStarted: (started: boolean) => void;
  
  // Functions
  handleStart: () => void;
  handleSubmit: () => void;
  handlePrevious: () => void;
  handleBackToSetup: () => void;
  handleSourceInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  insertTranslatedSuggestion: (translatedText: string) => void;
  insertPlaceholder: (originalSource: string) => void;
  
  // Computed values
  progress: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const useTranslationWorkflow = (
  onSessionStart?: () => void,
  onSessionEnd?: () => void
): TranslationWorkflowState => {
  // ========== Core Translation State ==========
  const [sourceTexts, setSourceTexts] = useState<string[]>([]);
  const [utterers, setUtterers] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  
  // ========== Computed Values ==========
  const totalItems = sourceTexts.length;
  const progress = totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0;
  const hasNext = currentIndex < totalItems - 1;
  const hasPrevious = currentIndex > 0;
  
  // ========== Session Management ==========
  const handleStart = useCallback(() => {
    if (sourceTexts.length === 0) {
      alert('Please provide source texts to translate.');
      return;
    }
    
    setIsStarted(true);
    setCurrentIndex(0);
    
    // Prefill first translation if it's a blank row
    const firstSourceText = sourceTexts[0];
    const shouldPrefill = firstSourceText === '((blank))';
    setCurrentTranslation(shouldPrefill ? '--' : '');
    
    onSessionStart?.();
  }, [sourceTexts, onSessionStart]);
  
  const handleBackToSetup = useCallback(() => {
    setIsStarted(false);
    setCurrentIndex(0);
    setCurrentTranslation('');
    setSourceTexts([]);
    setUtterers([]);
    setTranslations([]);
    
    onSessionEnd?.();
  }, [onSessionEnd]);
  
  // ========== Navigation Functions ==========
  const handleSubmit = useCallback(() => {
    if (!currentTranslation.trim()) {
      alert('Please enter a translation before proceeding.');
      return;
    }
    
    // Save current translation
    const newTranslations = [...translations];
    newTranslations[currentIndex] = currentTranslation.trim();
    setTranslations(newTranslations);
    
    // Move to next item
    if (hasNext) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      // Prefill next translation if it's a blank row
      const nextSourceText = sourceTexts[nextIndex];
      const shouldPrefill = nextSourceText === '((blank))';
      setCurrentTranslation(shouldPrefill ? '--' : '');
    } else {
      // Session complete
      alert('Translation session complete! All items have been translated.');
    }
  }, [currentTranslation, translations, currentIndex, hasNext, sourceTexts]);
  
  const handlePrevious = useCallback(() => {
    if (!hasPrevious) return;
    
    // Save current translation
    const newTranslations = [...translations];
    newTranslations[currentIndex] = currentTranslation.trim();
    setTranslations(newTranslations);
    
    // Move to previous item
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    
    // Load previous translation or prefill if blank
    const prevTranslation = translations[prevIndex] || '';
    const prevSourceText = sourceTexts[prevIndex];
    const shouldPrefill = !prevTranslation && prevSourceText === '((blank))';
    setCurrentTranslation(shouldPrefill ? '--' : prevTranslation);
  }, [currentTranslation, translations, currentIndex, hasPrevious, sourceTexts]);
  
  // ========== Input Handling ==========
  const handleSourceInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    setSourceTexts(lines);
    setUtterers(new Array(lines.length).fill(''));
  }, []);
  
  // ========== Translation Helpers ==========
  const insertTranslatedSuggestion = useCallback((translatedText: string) => {
    setCurrentTranslation(prev => {
      const cursorPosition = (document.activeElement as HTMLTextAreaElement)?.selectionStart || prev.length;
      const beforeCursor = prev.slice(0, cursorPosition);
      const afterCursor = prev.slice(cursorPosition);
      return beforeCursor + translatedText + afterCursor;
    });
  }, []);
  
  const insertPlaceholder = useCallback((originalSource: string) => {
    setCurrentTranslation(prev => {
      const cursorPosition = (document.activeElement as HTMLTextAreaElement)?.selectionStart || prev.length;
      const beforeCursor = prev.slice(0, cursorPosition);
      const afterCursor = prev.slice(cursorPosition);
      return beforeCursor + `[${originalSource}]` + afterCursor;
    });
  }, []);
  
  return {
    // State
    sourceTexts,
    utterers,
    translations,
    currentIndex,
    currentTranslation,
    isStarted,
    
    // Setters
    setSourceTexts,
    setUtterers,
    setTranslations,
    setCurrentIndex,
    setCurrentTranslation,
    setIsStarted,
    
    // Functions
    handleStart,
    handleSubmit,
    handlePrevious,
    handleBackToSetup,
    handleSourceInput,
    insertTranslatedSuggestion,
    insertPlaceholder,
    
    // Computed values
    progress,
    totalItems,
    hasNext,
    hasPrevious,
  };
}; 