import { useState, useCallback } from 'react';

export interface ExportFunctionalityState {
  // UI state
  showCopied: boolean;
  editableTranslations: string[];
  showTranslationsOutput: boolean;
  
  // Setters
  setShowCopied: (show: boolean) => void;
  setEditableTranslations: (translations: string[]) => void;
  setShowTranslationsOutput: (show: boolean) => void;
  
  // Functions
  copyToClipboard: () => void;
  copySourceText: () => void;
  copySourceToJsonSearch: () => void;
  exportTranslationsToCsv: () => void;
  toggleTranslationsOutput: () => void;
  updateEditableTranslation: (index: number, value: string) => void;
  getCellLocation: (index: number, startRow: number) => string;
  trimToCurrent: () => void;
}

export const useExportFunctionality = (
  sourceTexts: string[],
  translations: string[],
  currentIndex: number,
  selectedSheet: string,
  startRow: number,
  setTranslations: (translations: string[]) => void
): ExportFunctionalityState => {
  // ========== UI State ==========
  const [showCopied, setShowCopied] = useState(false);
  const [editableTranslations, setEditableTranslations] = useState<string[]>([]);
  const [showTranslationsOutput, setShowTranslationsOutput] = useState(false);
  
  // ========== Clipboard Functions ==========
  const copyToClipboard = useCallback(() => {
    const textToCopy = showTranslationsOutput && editableTranslations.length > 0
      ? editableTranslations.map(t => t || '[BLANK, REMOVE LATER]').join('\n')
      : translations.map(t => t || '[BLANK, REMOVE LATER]').join('\n');
    
    // Remove whitespace and clean the text before copying
    const cleanText = textToCopy.trim().replace(/\s+/g, ' ');
    navigator.clipboard.writeText(cleanText);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, [translations, editableTranslations, showTranslationsOutput]);
  
  const copySourceText = useCallback(() => {
    const currentSourceText = sourceTexts[currentIndex] || '';
    // Remove whitespace and clean the text before copying
    const cleanText = currentSourceText.trim().replace(/\s+/g, ' ');
    navigator.clipboard.writeText(cleanText);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, [sourceTexts, currentIndex]);
  
  const copySourceToJsonSearch = useCallback(() => {
    const currentSourceText = sourceTexts[currentIndex] || '';
    // Remove whitespace and clean the text before copying
    const cleanText = currentSourceText.trim().replace(/\s+/g, ' ');
    navigator.clipboard.writeText(cleanText);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, [sourceTexts, currentIndex]);
  
  // ========== Export Functions ==========
  const exportTranslationsToCsv = useCallback(() => {
    if (translations.length === 0) {
      alert('No translations to export.');
      return;
    }
    
    // Create CSV content with header
    const csvContent = [
      'Row No,Key,Value',
      ...translations.map((translation, index) => 
        `${startRow + index},"${(sourceTexts[index] || '[BLANK, REMOVE LATER]').replace(/"/g, '""')}","${(translation || '[BLANK, REMOVE LATER]').replace(/"/g, '""')}"`
      )
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translations_${selectedSheet || 'sheet'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [translations, sourceTexts, startRow, selectedSheet]);
  
  // ========== Editable Translations Output ==========
  const toggleTranslationsOutput = useCallback(() => {
    if (!showTranslationsOutput) {
      // Initialize editable translations with current translations
      setEditableTranslations([...translations]);
    }
    setShowTranslationsOutput(!showTranslationsOutput);
  }, [showTranslationsOutput, translations]);
  
  const updateEditableTranslation = useCallback((index: number, value: string) => {
    setEditableTranslations(prev => {
      const newTranslations = [...prev];
      newTranslations[index] = value;
      return newTranslations;
    });
  }, []);
  
  // ========== Utility Functions ==========
  const getCellLocation = useCallback((index: number, startRow: number): string => {
    return `Row ${startRow + index}`;
  }, []);
  
  const trimToCurrent = useCallback(() => {
    const newTranslations = translations.slice(0, currentIndex + 1);
    setTranslations(newTranslations);
  }, [translations, currentIndex, setTranslations]);
  
  return {
    // State
    showCopied,
    editableTranslations,
    showTranslationsOutput,
    
    // Setters
    setShowCopied,
    setEditableTranslations,
    setShowTranslationsOutput,
    
    // Functions
    copyToClipboard,
    copySourceText,
    copySourceToJsonSearch,
    exportTranslationsToCsv,
    toggleTranslationsOutput,
    updateEditableTranslation,
    getCellLocation,
    trimToCurrent,
  };
}; 