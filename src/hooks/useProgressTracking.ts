import { useState, useCallback } from 'react';

export interface ProgressTrackingState {
  // Jump to row state
  jumpToRowInput: string;
  
  // Setters
  setJumpToRowInput: (value: string) => void;
  
  // Functions
  handleJumpToRow: (startRow: number, sourceTexts: string[], currentIndex: number, translations: string[], setCurrentIndex: (index: number) => void, setCurrentTranslation: (translation: string) => void) => void;
}

/**
 * Progress Tracking Hook
 * 
 * Manages progress tracking and navigation functionality:
 * - Jump to row input and validation
 * - Progress calculation
 * - Navigation controls
 * 
 * @returns Progress tracking state and functions
 */
export const useProgressTracking = (): ProgressTrackingState => {
  // ========== Jump to Row State ==========
  const [jumpToRowInput, setJumpToRowInput] = useState('');
  
  // ========== Jump to Row Function ==========
  const handleJumpToRow = useCallback((
    startRow: number,
    sourceTexts: string[],
    currentIndex: number,
    translations: string[],
    setCurrentIndex: (index: number) => void,
    setCurrentTranslation: (translation: string) => void
  ) => {
    const rowNumber = parseInt(jumpToRowInput);
    if (!isNaN(rowNumber) && rowNumber >= startRow && rowNumber <= startRow + sourceTexts.length - 1) {
      const targetIndex = rowNumber - startRow;
      if (targetIndex >= 0 && targetIndex < sourceTexts.length) {
        setCurrentIndex(targetIndex);
        setCurrentTranslation(translations[targetIndex] || '');
        setJumpToRowInput('');
      }
    }
  }, [jumpToRowInput]);
  
  return {
    // State
    jumpToRowInput,
    
    // Setters
    setJumpToRowInput,
    
    // Functions
    handleJumpToRow,
  };
}; 