import { useState, useCallback, useEffect } from 'react';

export interface AnimationState {
  // Animation state
  isAnimating: boolean;
  showCopied: boolean;
  gradientColors: string[];
  showVersionHash: boolean;
  
  // Setters
  setIsAnimating: (animating: boolean) => void;
  setShowCopied: (show: boolean) => void;
  setGradientColors: (colors: string[]) => void;
  setShowVersionHash: (show: boolean) => void;
  
  // Functions
  generateGradientColors: () => string[];
  triggerAnimation: (callback: () => void) => void;
  showCopiedMessage: () => void;
  animateTransition: (fromIndex: number, toIndex: number, callback: () => void) => void;
}

/**
 * Animation Hook
 * 
 * Manages all animation, visual effects, and transition functionality:
 * - Animation state management
 * - Gradient color generation and cycling
 * - Transition animations between items
 * - Copy feedback animations
 * - Visual effects and timing
 * 
 * @returns Animation state and functions
 */
export const useAnimations = (): AnimationState => {
  // ========== Animation State ==========
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [showVersionHash, setShowVersionHash] = useState(false);
  
  // ========== Animation Functions ==========
  
  /**
   * Generate gradient colors for visual effects
   * 
   * Creates a set of gradient colors for use in UI elements.
   * These colors cycle through different hues for visual variety.
   * 
   * @returns Array of gradient color strings
   */
  const generateGradientColors = useCallback((): string[] => {
    const colors = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-purple-400',
      'from-green-400 to-blue-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400',
      'from-indigo-400 to-purple-400',
      'from-teal-400 to-green-400',
      'from-orange-400 to-red-400',
    ];
    
    // Shuffle the colors for variety
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4); // Return 4 colors
  }, []);
  
  /**
   * Trigger a general animation with callback
   * 
   * Sets animation state and executes callback after animation duration.
   * Used for general UI animations and transitions.
   * 
   * @param callback - Function to execute after animation
   */
  const triggerAnimation = useCallback((callback: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 200);
  }, []);
  
  /**
   * Show copied message with auto-hide
   * 
   * Displays a "copied" feedback message and automatically hides it after 2 seconds.
   * Used for clipboard copy operations.
   */
  const showCopiedMessage = useCallback(() => {
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, []);
  
  /**
   * Animate transition between items
   * 
   * Handles smooth transitions between different items (like translation entries).
   * Fades out current item, updates state, then fades in new item.
   * 
   * @param fromIndex - Current item index
   * @param toIndex - Target item index
   * @param callback - Function to execute during transition
   */
  const animateTransition = useCallback((
    fromIndex: number,
    toIndex: number,
    callback: () => void
  ) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 200);
  }, []);
  
  // ========== Effects ==========
  
  /**
   * Initialize gradient colors on mount
   */
  useEffect(() => {
    setGradientColors(generateGradientColors());
  }, [generateGradientColors]);
  
  return {
    // State
    isAnimating,
    showCopied,
    gradientColors,
    showVersionHash,
    
    // Setters
    setIsAnimating,
    setShowCopied,
    setGradientColors,
    setShowVersionHash,
    
    // Functions
    generateGradientColors,
    triggerAnimation,
    showCopiedMessage,
    animateTransition,
  };
}; 