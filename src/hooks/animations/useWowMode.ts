import { useState, useEffect, useCallback } from 'react';

const WOW_MODE_KEY = 'am-translations-wow-mode';

export interface WowModeState {
  wowModeEnabled: boolean;
  toggleWowMode: () => void;
  setWowMode: (enabled: boolean) => void;
}

/**
 * useWowMode Hook
 *
 * Manages the wow-mode setting which enables extra visual celebrations:
 * - Confetti on completion
 * - Enhanced progress bar animations
 * - Magnetic button effects
 *
 * Setting is persisted to localStorage.
 */
export const useWowMode = (): WowModeState => {
  const [wowModeEnabled, setWowModeEnabled] = useState(false);

  // Load setting from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WOW_MODE_KEY);
      if (stored !== null) {
        setWowModeEnabled(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading wow-mode setting:', error);
    }
  }, []);

  // Save setting to localStorage when changed
  const setWowMode = useCallback((enabled: boolean) => {
    setWowModeEnabled(enabled);
    try {
      localStorage.setItem(WOW_MODE_KEY, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving wow-mode setting:', error);
    }
  }, []);

  const toggleWowMode = useCallback(() => {
    setWowMode(!wowModeEnabled);
  }, [wowModeEnabled, setWowMode]);

  return {
    wowModeEnabled,
    toggleWowMode,
    setWowMode,
  };
};
