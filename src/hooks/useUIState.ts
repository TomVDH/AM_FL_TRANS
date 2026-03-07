/**
 * UI State Hook
 *
 * Manages UI-related state:
 * - Animation flags
 * - Gradient colors for visual effects
 * - Version hash visibility
 * - Input mode selection
 *
 * Extracted from useTranslationState for better separation of concerns.
 */

import { useState, useCallback, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type InputMode = 'excel' | 'embedded-json' | 'manual';

export interface UIState {
  // State
  showCopied: boolean;
  gradientColors: string[];
  showVersionHash: boolean;
  inputMode: InputMode;

  // Setters
  setShowCopied: (show: boolean) => void;
  setGradientColors: (colors: string[]) => void;
  setShowVersionHash: (show: boolean) => void;
  setInputMode: (mode: InputMode) => void;

  // Functions
  generateGradientColors: () => string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const GRADIENT_COLOR_PALETTE = [
  '#8B5CF6', // purple-400
  '#EC4899', // pink-400
  '#3B82F6', // blue-400
  '#10B981', // green-400
  '#F59E0B', // yellow-400
  '#F97316', // orange-400
  '#EF4444', // red-400
  '#6366F1', // indigo-400
  '#14B8A6', // teal-400
];

// ============================================================================
// HOOK
// ============================================================================

/**
 * useUIState
 *
 * Manages UI state that doesn't directly relate to translation data.
 * Includes animation flags, visual effects, and input mode selection.
 *
 * @returns UI state and functions
 */
export const useUIState = (): UIState => {
  // ========== State ==========
  const [showCopied, setShowCopied] = useState(false);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [showVersionHash, setShowVersionHash] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('excel');

  // ========== Functions ==========

  /**
   * Generate random gradient colors for visual effects
   * Shuffles the color palette and returns 4 colors
   */
  const generateGradientColors = useCallback((): string[] => {
    const shuffled = [...GRADIENT_COLOR_PALETTE].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);

  // ========== Effects ==========

  // Initialize gradient colors on mount
  useEffect(() => {
    setGradientColors(generateGradientColors());
  }, [generateGradientColors]);

  // ========== Return ==========
  return {
    // State
    showCopied,
    gradientColors,
    showVersionHash,
    inputMode,

    // Setters
    setShowCopied,
    setGradientColors,
    setShowVersionHash,
    setInputMode,

    // Functions
    generateGradientColors,
  };
};
