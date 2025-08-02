import { useCallback } from 'react';

export interface UIComponentsState {
  // Functions
  extractSpeakerName: (utterer: string) => string;
  generateGradientColors: () => string[];
  categoryHasMatches: (category: string) => boolean;
}

/**
 * UI Components Hook
 * 
 * Manages UI-related functionality:
 * - Speaker name extraction from utterer strings
 * - Gradient color generation for visual effects
 * - Category matching for UI display
 * - Other UI utility functions
 * 
 * @returns UI components state and functions
 */
export const useUIComponents = (): UIComponentsState => {
  // ========== UI Functions ==========
  
  /**
   * Extract clean speaker name from utterer string
   * 
   * Parses complex utterer strings from the game data format to extract
   * human-readable speaker names for the dialogue box display.
   * 
   * @param utterer - Raw utterer string (e.g., "SAY.Sign_TheMines_Dirty.1.Dirty Sign")
   * @returns Extracted speaker name (e.g., "Dirty Sign") or fallback "Speaker"
   * 
   * @example
   * extractSpeakerName("SAY.Sign_TheMines_Dirty.1.Dirty Sign") // returns "Dirty Sign"
   * extractSpeakerName("SAY.NPC_Miner.2.Old Miner") // returns "Old Miner"
   */
  const extractSpeakerName = useCallback((utterer: string): string => {
    if (!utterer) return 'Speaker';
    
    const parts = utterer.split('.');
    if (parts.length >= 4) {
      return parts[3]; // Return the human-readable name part
    }
    
    // Fallback: try to extract a meaningful name from the string
    const cleanName = utterer.replace(/^SAY\./, '').replace(/\.\d+$/, '');
    if (cleanName && cleanName !== utterer) {
      return cleanName.replace(/_/g, ' '); // Replace underscores with spaces
    }
    
    return 'Speaker';
  }, []);
  
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
   * Check if a category has matching entries
   * 
   * Determines if a category has any matching entries for UI display.
   * Used for conditional rendering of UI elements.
   * 
   * @param category - The category to check
   * @returns True if category has matches, false otherwise
   */
  const categoryHasMatches = useCallback((category: string): boolean => {
    // This function is still used by CodexPanel, so we'll keep it
    // but it won't be used for highlighting anymore
    return false;
  }, []);
  
  return {
    // Functions
    extractSpeakerName,
    generateGradientColors,
    categoryHasMatches,
  };
}; 