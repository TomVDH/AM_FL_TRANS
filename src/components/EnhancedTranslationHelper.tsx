import React, { useState, useEffect } from 'react';
import { useCSVConsultation } from '../hooks/useCSVConsultation';
import CSVConsultationPanel from './CSVConsultationPanel';
import CSVQuickSuggestions from './CSVQuickSuggestions';
import type { CSVEntry } from '../hooks/useCSVConsultation';

/**
 * Enhanced Translation Helper with CSV Integration
 * 
 * Demonstrates how to integrate CSV consultation into the existing 3-block
 * translation screen structure without disrupting the current workflow.
 */

interface EnhancedTranslationHelperProps {
  // Existing translation helper props would go here
  sourceTexts: string[];
  currentIndex: number;
  currentTranslation: string;
  onTranslationChange: (translation: string) => void;
  onSubmit: () => void;
  // ... other existing props
}

const EnhancedTranslationHelper: React.FC<EnhancedTranslationHelperProps> = ({
  sourceTexts,
  currentIndex,
  currentTranslation,
  onTranslationChange,
  onSubmit,
}) => {
  // CSV consultation state
  const { consultForTranslation } = useCSVConsultation();
  const [csvSuggestions, setCSVSuggestions] = useState<CSVEntry[]>([]);
  const [showCSVSidebar, setShowCSVSidebar] = useState(false);
  const [isCSVMode, setIsCSVMode] = useState(false);

  // Get current source text
  const currentSourceText = sourceTexts[currentIndex] || '';

  // Auto-consultation effect
  useEffect(() => {
    if (currentSourceText && currentSourceText.length > 2) {
      consultForTranslation(currentSourceText).then(suggestions => {
        setCSVSuggestions(suggestions.slice(0, 5));
      });
    } else {
      setCSVSuggestions([]);
    }
  }, [currentSourceText, consultForTranslation]);

  // Handle CSV suggestion selection
  const handleCSVSuggestion = (suggestion: CSVEntry) => {
    if (suggestion.dutch) {
      onTranslationChange(suggestion.dutch);
      
      // Optional: Auto-submit after selection
      setTimeout(() => {
        onSubmit();
      }, 300);
    }
  };

  // Toggle CSV mode in display controls
  const toggleCSVMode = () => {
    setIsCSVMode(!isCSVMode);
    if (!isCSVMode) {
      setShowCSVSidebar(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      
      {/* ===== BLOCK 1: ENHANCED TRANSLATOR ===== */}
      <div className="mb-6 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 shadow-md transition-all duration-300" style={{ borderRadius: '3px' }}>
        
        {/* Source Text with Auto-highlighting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          
          {/* Left: Source Text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">
                Source Text
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentIndex + 1} of {sourceTexts.length}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 min-h-[120px] rounded-sm">
              <div className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {currentSourceText}
              </div>
            </div>
            
            {/* CSV Quick Suggestions - Right below source text */}
            {csvSuggestions.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quick Suggestions
                  </span>
                  <button
                    onClick={() => setShowCSVSidebar(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    More options →
                  </button>
                </div>
                
                <CSVQuickSuggestions
                  suggestions={csvSuggestions}
                  onSelect={handleCSVSuggestion}
                  maxDisplay={3}
                  compact={true}
                  showContext={false}
                />
              </div>
            )}
          </div>
          
          {/* Right: Translation Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">
                Translation
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onTranslationChange('')}
                  className="text-xs text-red-600 hover:text-red-800"
                  title="Clear translation"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              value={currentTranslation}
              onChange={(e) => onTranslationChange(e.target.value)}
              className="w-full h-[120px] p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Dutch translation..."
            />
            
            {/* Translation Actions */}
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {currentTranslation.length} characters
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onSubmit}
                  disabled={!currentTranslation.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-sm transition-colors font-medium"
                >
                  Submit & Next
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round((currentIndex / sourceTexts.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentIndex / sourceTexts.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===== BLOCK 2: JSON/CSV SETTINGS ===== */}
      <div className="mb-6 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 shadow-md transition-all duration-300" style={{ borderRadius: '3px' }}>
        
        {/* Header with Display Controls */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">
            Data & Settings
          </h3>
          
          {/* Enhanced Display Mode Controls */}
          <div className="flex items-center gap-2">
            
            {/* Existing controls would go here */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-sm"
              title="Eye Mode"
            >
              👁️
            </button>
            
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-sm"
              title="Gamepad Mode"
            >
              🎮
            </button>
            
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-sm"
              title="Highlight Mode"
            >
              ✨
            </button>
            
            {/* New CSV Mode Control */}
            <button
              onClick={toggleCSVMode}
              className={`p-2 rounded-sm transition-colors ${
                isCSVMode 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              title="CSV Consultation"
            >
              📊
            </button>
          </div>
        </div>
        
        {/* Tab-like Interface */}
        <div className="border-b border-gray-200 dark:border-gray-600 mb-4">
          <div className="flex gap-1">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              JSON Data
            </button>
            <button 
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              onClick={() => setShowCSVSidebar(true)}
            >
              CSV Search
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Settings
            </button>
          </div>
        </div>
        
        {/* Content Area - JSON Viewer (existing content would go here) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-sm min-h-[200px]">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            JSON Data Viewer content would appear here...
          </p>
        </div>
      </div>

      {/* ===== BLOCK 3: TRANSLATED OUTPUT ===== */}
      <div className="bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 shadow-md transition-all duration-300" style={{ borderRadius: '3px' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">
            Translated Output
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-sm">
              Export
            </button>
          </div>
        </div>
        
        {/* Output Display */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border border-gray-300 dark:border-gray-600 min-h-[150px] rounded-sm font-mono text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Completed translations will appear here...
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentIndex + 1}</div>
            <div className="text-xs text-gray-500">Current</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentIndex}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {Math.round((currentIndex / sourceTexts.length) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Progress</div>
          </div>
        </div>
      </div>

      {/* ===== CSV CONSULTATION SIDEBAR ===== */}
      {showCSVSidebar && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCSVSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 overflow-hidden">
            <div className="h-full flex flex-col">
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  CSV Consultation
                </h3>
                <button
                  onClick={() => setShowCSVSidebar(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  ✕
                </button>
              </div>
              
              {/* Sidebar Content */}
              <div className="flex-1 overflow-hidden">
                <CSVConsultationPanel
                  currentText={currentSourceText}
                  onSuggestionSelect={handleCSVSuggestion}
                  maxSuggestions={10}
                  showFileSelector={true}
                  autoConsult={true}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedTranslationHelper;