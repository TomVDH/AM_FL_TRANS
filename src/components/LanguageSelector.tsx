'use client';

import React from 'react';

export interface DetectedLanguage {
  code: string;
  name: string;
  column: string;
  headerText: string;
  sheets: string[];
  totalSheets: number;
}

interface LanguageSelectorProps {
  languages: DetectedLanguage[];
  selectedLanguage: DetectedLanguage | null;
  onSelectLanguage: (language: DetectedLanguage) => void;
  disabled?: boolean;
}

/**
 * LanguageSelector Component
 *
 * Dropdown for selecting target translation language from auto-detected options.
 * Shows language name, code, column letter, and sheet coverage.
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
  disabled = false,
}) => {
  if (languages.length === 0) {
    return (
      <div className="p-4 border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded" style={{ borderRadius: '3px' }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            No language columns detected in headers
          </span>
        </div>
        <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
          Column headers should contain language names like &quot;Dutch&quot;, &quot;Portuguese&quot;, etc.
        </p>
      </div>
    );
  }

  const coverage = selectedLanguage
    ? `${selectedLanguage.sheets.length} of ${selectedLanguage.totalSheets}`
    : '';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Target Language
        </span>
      </div>

      <select
        value={selectedLanguage ? `${selectedLanguage.code}-${selectedLanguage.column}` : ''}
        onChange={(e) => {
          const selected = languages.find(
            lang => `${lang.code}-${lang.column}` === e.target.value
          );
          if (selected) {
            onSelectLanguage(selected);
          }
        }}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ borderRadius: '3px' }}
      >
        {languages.map((lang) => (
          <option key={`${lang.code}-${lang.column}`} value={`${lang.code}-${lang.column}`}>
            {lang.name} ({lang.code}) — Column {lang.column}
          </option>
        ))}
      </select>

      {selectedLanguage && (
        <div className="flex items-center gap-2 text-xs">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-green-600 dark:text-green-400">
            Available in {coverage} sheets
          </span>
          {selectedLanguage.sheets.length < selectedLanguage.totalSheets && (
            <span className="text-amber-500 dark:text-amber-400 text-[10px]">
              (not all sheets)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
