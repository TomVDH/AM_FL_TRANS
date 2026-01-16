'use client';

import React from 'react';
import type { FilterStatus } from '@/hooks/useTranslationState';

// ============================================================================
// TYPES
// ============================================================================

export interface FilterStats {
  all: number;
  completed: number;
  blank: number;
  modified: number;
}

export interface TranslationHeaderProps {
  // Data
  selectedSheet: string;
  loadedFileName: string;
  loadedFileType: 'excel' | 'json' | 'csv' | 'manual' | '';
  excelSheets: string[];
  currentIndex: number;
  startRow: number;
  sourceTextsLength: number;
  translations: string[];
  darkMode: boolean;

  // Filter state
  filterOptions: { status: FilterStatus };
  filterStats: FilterStats;

  // UI state
  accordionStates: Record<string, boolean>;
  setAccordionStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  // Callbacks
  onBackToSetup: () => void;
  onToggleDarkMode: () => void;
  onShowKeyboardShortcuts: () => void;
  onFilterStatusChange: (status: FilterStatus) => void;
  onSheetChange: (sheetName: string) => void;
  onJumpToRow: (rowNumber: number) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentTranslation: (translation: string) => void;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const IconButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  title: string;
}> = ({ onClick, icon, label, title }) => (
  <button
    onClick={onClick}
    className="group relative h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
    style={{ borderRadius: '3px' }}
    aria-label={label}
    title={title}
  >
    <div className="w-4 h-4 relative z-10">{icon}</div>
    <div
      className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
      style={{ borderRadius: '3px' }}
    />
  </button>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * TranslationHeader
 *
 * The main header toolbar for the translation interface.
 * Includes:
 * - Back to setup button
 * - Title with sheet/file info
 * - Navigation filter/jump controls
 * - Keyboard shortcuts button
 * - Dark mode toggle
 */
export const TranslationHeader: React.FC<TranslationHeaderProps> = ({
  selectedSheet,
  loadedFileName,
  loadedFileType,
  excelSheets,
  currentIndex,
  startRow,
  sourceTextsLength,
  translations,
  darkMode,
  filterOptions,
  filterStats,
  accordionStates,
  setAccordionStates,
  onBackToSetup,
  onToggleDarkMode,
  onShowKeyboardShortcuts,
  onFilterStatusChange,
  onSheetChange,
  onJumpToRow,
  setCurrentIndex,
  setCurrentTranslation,
}) => {
  const getFileTypeBadgeClasses = () => {
    switch (loadedFileType) {
      case 'excel':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'json':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'csv':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  const convertBlankToDisplay = (translation: string) => {
    return translation === '[BLANK, REMOVE LATER]' ? '' : translation || '';
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        {/* Left: Back button + Title with file type badge */}
        <div className="flex items-center gap-3">
          {/* Home Button */}
          <IconButton
            onClick={onBackToSetup}
            label="Back to Home"
            title="Back to Home"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
          />

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-gray-100">
              Translation Helper
            </h1>
            {selectedSheet && (
              <>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {selectedSheet}
                </span>
              </>
            )}
          </div>
          {loadedFileName && (
            <span
              className={`inline-flex items-center px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide border ${getFileTypeBadgeClasses()}`}
              style={{ borderRadius: '2px' }}
            >
              {loadedFileType || 'manual'}
            </span>
          )}
        </div>

        {/* Center: Empty */}
        <div className="flex items-center gap-2" />

        {/* Right: File name + Navigation + Keyboard Shortcuts + Dark Mode */}
        <div className="flex items-center gap-2">
          {loadedFileName && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[150px] mr-2">
              {loadedFileName}
            </span>
          )}

          {/* Navigation Button - Filter & Jump */}
          <div className="relative">
            <IconButton
              onClick={() =>
                setAccordionStates((prev) => ({ ...prev, navigation: !prev.navigation }))
              }
              label="Navigation menu"
              title="Filter & Jump"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
            />

            {accordionStates.navigation && (
              <div
                className="absolute top-full right-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg z-50 min-w-[200px]"
                style={{ borderRadius: '3px' }}
              >
                {/* Filter Section */}
                <div className="mb-3">
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                    Filter
                  </div>
                  <div className="space-y-1">
                    {(['all', 'completed', 'blank'] as const).map((status) => {
                      const isActive = filterOptions.status === status;
                      const count =
                        status === 'all'
                          ? filterStats.all
                          : status === 'completed'
                          ? filterStats.completed
                          : filterStats.blank;
                      const color =
                        status === 'completed'
                          ? 'green'
                          : status === 'blank'
                          ? 'red'
                          : null;

                      return (
                        <button
                          key={status}
                          onClick={() => onFilterStatusChange(status)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${
                            isActive
                              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <span className="flex items-center gap-1">
                            {color && (
                              <span className={`w-2 h-2 bg-${color}-500 rounded-full`} />
                            )}
                            {status === 'all' ? 'All' : status === 'completed' ? 'Done' : 'Blank'}
                          </span>
                          <span
                            className={
                              color
                                ? `text-${color}-600 dark:text-${color}-400`
                                : 'text-gray-400 dark:text-gray-500'
                            }
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Jump Section */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                    Jump
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    {[-5, -1].map((offset) => (
                      <button
                        key={offset}
                        onClick={() => {
                          const newIndex = Math.max(0, currentIndex + offset);
                          setCurrentIndex(newIndex);
                          setCurrentTranslation(convertBlankToDisplay(translations[newIndex]));
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        {offset}
                      </button>
                    ))}
                    <input
                      type="number"
                      min={startRow}
                      max={startRow + sourceTextsLength - 1}
                      value={startRow + currentIndex}
                      onChange={(e) => {
                        const rowNumber = parseInt(e.target.value);
                        if (
                          rowNumber >= startRow &&
                          rowNumber < startRow + sourceTextsLength
                        ) {
                          onJumpToRow(rowNumber);
                        }
                      }}
                      className="w-14 px-1 py-1 text-[10px] text-center font-bold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      style={{ borderRadius: '2px' }}
                    />
                    {[1, 5].map((offset) => (
                      <button
                        key={offset}
                        onClick={() => {
                          const newIndex = Math.min(sourceTextsLength - 1, currentIndex + offset);
                          setCurrentIndex(newIndex);
                          setCurrentTranslation(convertBlankToDisplay(translations[newIndex]));
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        +{offset}
                      </button>
                    ))}
                  </div>
                  {excelSheets.length > 1 && (
                    <select
                      value={selectedSheet}
                      onChange={(e) => onSheetChange(e.target.value)}
                      className="w-full p-1 text-[10px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      style={{ borderRadius: '2px' }}
                    >
                      {excelSheets.map((sheet) => (
                        <option key={sheet} value={sheet}>
                          {sheet}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Button */}
          <IconButton
            onClick={onShowKeyboardShortcuts}
            label="Keyboard shortcuts"
            title="Keyboard Shortcuts"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="group relative h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden"
            style={{ borderRadius: '3px' }}
            aria-label="Toggle dark mode"
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <svg
                className="w-4 h-4 text-yellow-500 relative z-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-700 dark:text-gray-300 relative z-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
            <div
              className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
              style={{ borderRadius: '3px' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationHeader;
