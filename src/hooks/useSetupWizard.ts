import { useState, useCallback } from 'react';

export interface SetupWizardState {
  // Setup state
  inputMode: 'excel' | 'manual';
  isSetupComplete: boolean;
  showSetupWizard: boolean;
  
  // Excel configuration
  sourceColumn: string;
  uttererColumn: string;
  referenceColumn: string;
  startRow: number;
  
  // Manual input state
  manualSourceText: string;
  manualUtterer: string;
  
  // Setters
  setInputMode: (mode: 'excel' | 'manual') => void;
  setIsSetupComplete: (complete: boolean) => void;
  setShowSetupWizard: (show: boolean) => void;
  setSourceColumn: (column: string) => void;
  setUttererColumn: (column: string) => void;
  setReferenceColumn: (column: string) => void;
  setStartRow: (row: number) => void;
  setManualSourceText: (text: string) => void;
  setManualUtterer: (utterer: string) => void;
  
  // Functions
  handleStart: () => void;
  handleBackToSetup: () => void;
  handleSourceInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleUttererInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateSetup: () => boolean;
  resetSetup: () => void;
}

/**
 * Setup Wizard Hook
 * 
 * Manages all setup and configuration functionality:
 * - Input mode selection (Excel vs Manual)
 * - Excel column configuration
 * - Manual text input handling
 * - Setup validation and completion
 * - Wizard state management
 * 
 * @returns Setup wizard state and functions
 */
export const useSetupWizard = (): SetupWizardState => {
  // ========== Setup State ==========
  const [inputMode, setInputMode] = useState<'excel' | 'manual'>('excel');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(true);
  
  // ========== Excel Configuration State ==========
  const [sourceColumn, setSourceColumn] = useState('A');
  const [uttererColumn, setUttererColumn] = useState('B');
  const [referenceColumn, setReferenceColumn] = useState('C');
  const [startRow, setStartRow] = useState(2);
  
  // ========== Manual Input State ==========
  const [manualSourceText, setManualSourceText] = useState('');
  const [manualUtterer, setManualUtterer] = useState('');
  
  // ========== Setup Functions ==========
  
  /**
   * Validate setup configuration
   * 
   * Checks if the current setup is valid for starting translation.
   * Different validation rules for Excel vs Manual modes.
   * 
   * @returns True if setup is valid, false otherwise
   */
  const validateSetup = useCallback((): boolean => {
    if (inputMode === 'excel') {
      // Excel mode validation
      return Boolean(sourceColumn) && Boolean(uttererColumn) && Boolean(referenceColumn) && startRow > 0;
    } else {
      // Manual mode validation
      return manualSourceText.trim().length > 0;
    }
  }, [inputMode, sourceColumn, uttererColumn, referenceColumn, startRow, manualSourceText]);
  
  /**
   * Handle start button click
   * 
   * Validates setup and transitions to translation workflow.
   * Sets up the initial state based on input mode.
   */
  const handleStart = useCallback(() => {
    if (validateSetup()) {
      setIsSetupComplete(true);
      setShowSetupWizard(false);
    }
  }, [validateSetup]);
  
  /**
   * Handle back to setup button click
   * 
   * Returns to setup wizard from translation workflow.
   * Resets completion state and shows setup interface.
   */
  const handleBackToSetup = useCallback(() => {
    setIsSetupComplete(false);
    setShowSetupWizard(true);
  }, []);
  
  /**
   * Handle manual source text input
   * 
   * Updates manual source text state when user types in the textarea.
   * 
   * @param e - Textarea change event
   */
  const handleSourceInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setManualSourceText(e.target.value);
  }, []);
  
  /**
   * Handle manual utterer input
   * 
   * Updates manual utterer state when user types in the input field.
   * 
   * @param e - Input change event
   */
  const handleUttererInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setManualUtterer(e.target.value);
  }, []);
  
  /**
   * Reset setup to initial state
   * 
   * Clears all setup state and returns to initial configuration.
   * Used when user wants to start over.
   */
  const resetSetup = useCallback(() => {
    setInputMode('excel');
    setIsSetupComplete(false);
    setShowSetupWizard(true);
    setSourceColumn('A');
    setUttererColumn('B');
    setReferenceColumn('C');
    setStartRow(2);
    setManualSourceText('');
    setManualUtterer('');
  }, []);
  
  return {
    // State
    inputMode,
    isSetupComplete,
    showSetupWizard,
    sourceColumn,
    uttererColumn,
    referenceColumn,
    startRow,
    manualSourceText,
    manualUtterer,
    
    // Setters
    setInputMode,
    setIsSetupComplete,
    setShowSetupWizard,
    setSourceColumn,
    setUttererColumn,
    setReferenceColumn,
    setStartRow,
    setManualSourceText,
    setManualUtterer,
    
    // Functions
    handleStart,
    handleBackToSetup,
    handleSourceInput,
    handleUttererInput,
    validateSetup,
    resetSetup,
  };
}; 