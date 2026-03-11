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
  const [darkMode, setDarkMode] = useState(false);                     // Dark mode toggle
  const [eyeMode, setEyeMode] = useState(false);                       // Show translation instead of source
  const [highlightMode, setHighlightMode] = useState(true);            // Toggle highlighting of codex matches
  const [gamepadMode, setGamepadMode] = useState(false);               // Pixel dialogue box mode
  const [conversationMode, setConversationMode] = useState(false);     // Chat bubble conversation view
  const [eyeModeBeforeGamepad, setEyeModeBeforeGamepad] = useState(false); // Store eyeMode state before entering gamepad mode

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(mq.matches);
    }

    // Listen for OS/browser preference changes in real-time
    const handleChange = (e: MediaQueryListEvent) => {
      // Only follow system if user hasn't manually set a preference
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