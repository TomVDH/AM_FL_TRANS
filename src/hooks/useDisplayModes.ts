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

  // Initialize and persist dark mode
  useEffect(() => {
    // Check localStorage and system preference
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(systemPrefersDark);
    }
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
  const toggleGamepadMode = () => setGamepadMode(prev => !prev);

  return {
    // State
    darkMode,
    eyeMode,
    highlightMode,
    gamepadMode,
    
    // Setters
    setDarkMode,
    setEyeMode,
    setHighlightMode,
    setGamepadMode,
    
    // Toggle functions
    toggleDarkMode,
    toggleEyeMode,
    toggleHighlightMode,
    toggleGamepadMode,
  };
}; 