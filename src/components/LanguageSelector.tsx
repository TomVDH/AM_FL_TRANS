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

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Target Language
        </span>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-0.5 flex flex-wrap" style={{ borderRadius: '3px' }}>
        {languages.map((lang) => {
          const isActive = selectedLanguage &&
            `${selectedLanguage.code}-${selectedLanguage.column}` === `${lang.code}-${lang.column}`;
          const isNL = lang.code === 'NL';
          return (
            <button
              key={`${lang.code}-${lang.column}`}
              onClick={() => isNL ? onSelectLanguage(lang) : undefined}
              disabled={disabled || !isNL}
              className={`flex-1 px-3 py-1.5 text-xs font-medium text-center transition-all duration-200 ${
                !isNL
                  ? 'opacity-30 cursor-not-allowed text-gray-400 dark:text-gray-500'
                  : isActive
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              style={{ borderRadius: '2px' }}
              title={!isNL ? 'Only Dutch (NL) is supported' : undefined}
            >
              {lang.code}
            </button>
          );
        })}
      </div>

      {selectedLanguage && selectedLanguage.sheets.length < selectedLanguage.totalSheets && (
        <p className="text-[10px] text-amber-500 dark:text-amber-400">
          Available in {selectedLanguage.sheets.length} of {selectedLanguage.totalSheets} sheets
        </p>
      )}
    </div>
  );
};

export default LanguageSelector;
