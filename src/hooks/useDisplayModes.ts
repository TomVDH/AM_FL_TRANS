import { useState, useEffect } from 'react';

/**
 * Display Modes Hook
 * 
 * Manages all display-related state and functionality:
 * - Dark mode toggle and system preference detection
 * - Gamepad mode for pixel art dialogue box
 * - Eye mode for translation preview
 * - Highlight mode for character detection
 * 
 * @returns Display modes state and functions
 */
export const useDisplayModes = () => {
  // ========== Display Mode State ==========
  // Dark is the primary experience (DESIGN.md: "Dark is earned"). Default true so
  // first-time users get the canonical Stage Dark canvas; opting into light is explicit.
  const [mounted, setMounted] = useState(false);                       // Hydration guard
  const [darkMode, setDarkMode] = useState(true);                      // Dark mode toggle
  const [eyeMode, setEyeMode] = useState(false);                       // Show translation instead of source
  const [highlightMode, setHighlightMode] = useState(true);            // Toggle highlighting of codex matches
  const [gamepadMode, setGamepadMode] = useState(false);               // Pixel dialogue box mode
  const [conversationMode, setConversationMode] = useState(false);     // Chat bubble conversation view
  const [eyeModeBeforeGamepad, setEyeModeBeforeGamepad] = useState(false); // Store eyeMode state before entering gamepad mode

  // Initialize dark mode from localStorage; otherwise dark is the default.
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
    // No saved preference — keep the dark default. (System preference is no longer
    // consulted on first visit; the design has chosen.)

    // Still follow OS changes if user hasn't explicitly opted in
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Update document class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Toggle functions
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleEyeMode = () => setEyeMode(prev => !prev);
  const toggleHighlightMode = () => setHighlightMode(prev => !prev);
  const toggleGamepadMode = () => {
    setGamepadMode(prev => {
      const newGamepadMode = !prev;

      if (newGamepadMode) {
        // Entering gamepad mode: save current eyeMode state and enable eyeMode
        setEyeModeBeforeGamepad(eyeMode);
        setEyeMode(true);
      } else {
        // Exiting gamepad mode: restore previous eyeMode state
        setEyeMode(eyeModeBeforeGamepad);
      }

      return newGamepadMode;
    });
  };
  const toggleConversationMode = () => {
    setConversationMode(prev => {
      const entering = !prev;
      if (entering) {
        // Exiting gamepad mode if active — mutually exclusive
        setGamepadMode(false);
      }
      return entering;
    });
  };

  return {
    // State
    mounted,
    darkMode,
    eyeMode,
    highlightMode,
    gamepadMode,
    conversationMode,

    // Setters
    setDarkMode,
    setEyeMode,
    setHighlightMode,
    setGamepadMode,
    setConversationMode,

    // Toggle functions
    toggleDarkMode,
    toggleEyeMode,
    toggleHighlightMode,
    toggleGamepadMode,
    toggleConversationMode,
  };
}; 