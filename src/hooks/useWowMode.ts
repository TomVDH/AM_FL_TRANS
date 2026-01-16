'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface UseWowModeReturn {
  /** Whether Wow mode is currently active */
  isWowMode: boolean;
  /** Handle click on the trigger element - detects triple-click */
  handleWowClick: () => void;
  /** Trigger a celebration (only works when Wow mode is on) */
  triggerCelebration: (type?: 'confetti' | 'sparkle' | 'rainbow') => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TRIPLE_CLICK_WINDOW_MS = 500; // Time window for triple-click detection
const CLICKS_TO_TOGGLE = 3;
const STORAGE_KEY = 'wow-mode-enabled';

// ============================================================================
// HOOK
// ============================================================================

/**
 * useWowMode
 *
 * Hidden easter egg hook that enables "Wow mode" celebrations.
 * Activated by triple-clicking the version footer - no visual indication.
 *
 * Features:
 * - Triple-click detection within 500ms window
 * - Triple-click again to turn off
 * - Persists state to localStorage
 * - Triggers celebrations on milestones when enabled
 */
export const useWowMode = (): UseWowModeReturn => {
  const [isWowMode, setIsWowMode] = useState(false);
  const clickTimestamps = useRef<number[]>([]);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setIsWowMode(true);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isWowMode));
    } catch {
      // localStorage not available
    }
  }, [isWowMode]);

  const handleWowClick = useCallback(() => {
    const now = Date.now();

    // Add current timestamp
    clickTimestamps.current.push(now);

    // Remove clicks outside the time window
    clickTimestamps.current = clickTimestamps.current.filter(
      (timestamp) => now - timestamp < TRIPLE_CLICK_WINDOW_MS
    );

    // Check if we have enough clicks within the window
    if (clickTimestamps.current.length >= CLICKS_TO_TOGGLE) {
      setIsWowMode((prev) => !prev);
      clickTimestamps.current = []; // Reset after toggle
    }
  }, []);

  const triggerCelebration = useCallback(
    (type: 'confetti' | 'sparkle' | 'rainbow' = 'confetti') => {
      if (!isWowMode) return;

      // Import and trigger celebration dynamically
      import('@/utils/celebrations').then((module) => {
        module.triggerCelebration(type);
      }).catch(() => {
        // Celebrations module not available - silently fail
      });
    },
    [isWowMode]
  );

  return {
    isWowMode,
    handleWowClick,
    triggerCelebration,
  };
};

export default useWowMode;
