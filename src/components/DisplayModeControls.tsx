import React from 'react';
import { useDisplayModes } from '../hooks/useDisplayModes';

/**
 * Display Mode Controls Component
 * 
 * A simple component that demonstrates the extracted display modes functionality.
 * This shows how the useDisplayModes hook can be used in other components.
 * 
 * @component
 */
export const DisplayModeControls: React.FC = () => {
  const {
    darkMode,
    eyeMode,
    highlightMode,
    gamepadMode,
    toggleDarkMode,
    toggleEyeMode,
    toggleHighlightMode,
    toggleGamepadMode,
  } = useDisplayModes();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
        Display Mode Controls
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {darkMode ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Eye Mode</span>
          <button
            onClick={toggleEyeMode}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              eyeMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {eyeMode ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Highlight Mode</span>
          <button
            onClick={toggleHighlightMode}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              highlightMode 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {highlightMode ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Gamepad Mode</span>
          <button
            onClick={toggleGamepadMode}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              gamepadMode 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {gamepadMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
        <p>This component demonstrates the extracted useDisplayModes hook.</p>
        <p>All display mode state is now managed centrally and can be shared across components.</p>
      </div>
    </div>
  );
}; 