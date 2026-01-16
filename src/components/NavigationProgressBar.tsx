'use client';

import React from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface NavigationProgressBarProps {
  // Data
  currentIndex: number;
  totalEntries: number;
  translations: string[];
  utterers: string[];
  darkMode: boolean;

  // Callbacks
  onPrevious: () => void;
  onNext: () => void;

  // Animation refs/handlers
  progressBarRef?: React.RefObject<HTMLDivElement>;
  buttonsRef?: React.RefObject<HTMLDivElement>;
  animateButtonHover?: (element: HTMLElement, isHovering: boolean) => void;

  // Status
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
}

// ============================================================================
// HELPER
// ============================================================================

const isBlankTranslation = (translation: string | undefined): boolean => {
  return !translation || translation === '' || translation === '[BLANK, REMOVE LATER]';
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * NavigationProgressBar
 *
 * Displays navigation controls and a visual progress bar showing
 * translation completion status for each entry.
 *
 * Features:
 * - Previous/Next navigation buttons
 * - Per-entry progress visualization
 * - Color coding: green (completed), red (blank), gray (current/pending)
 * - Animated transitions on completion
 */
export const NavigationProgressBar: React.FC<NavigationProgressBarProps> = ({
  currentIndex,
  totalEntries,
  translations,
  utterers,
  darkMode,
  onPrevious,
  onNext,
  progressBarRef,
  animateButtonHover,
  syncStatus,
}) => {
  const isPreviousDisabled = currentIndex === 0 || syncStatus === 'syncing';
  const isNextDisabled = currentIndex === totalEntries - 1;

  return (
    <div className="flex items-center gap-3 mb-6 mt-6">
      {/* Previous Button */}
      <div className="group flex-shrink-0">
        <button
          onClick={onPrevious}
          onMouseEnter={(e) => animateButtonHover?.(e.currentTarget, true)}
          onMouseLeave={(e) => animateButtonHover?.(e.currentTarget, false)}
          disabled={isPreviousDisabled}
          className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 disabled:border-gray-200 dark:disabled:border-gray-800 disabled:text-gray-300 dark:disabled:text-gray-700 disabled:from-gray-100 disabled:to-gray-100 dark:disabled:from-gray-900 dark:disabled:to-gray-900 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:shadow-none overflow-hidden"
          style={{ borderRadius: '3px' }}
          title="Previous (←)"
          aria-label="Go to previous entry"
        >
          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            style={{ borderRadius: '3px' }}
          />
        </button>
      </div>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalEntries}
        aria-label={`Translation progress: ${currentIndex + 1} of ${totalEntries} entries`}
        className="relative flex-1 h-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 overflow-hidden shadow-inner cursor-pointer transition-all duration-300"
        style={{ borderRadius: '3px' }}
      >
        <div className="absolute inset-0 flex">
          {Array.from({ length: totalEntries }).map((_, index) => {
            const isCompleted = index < currentIndex;
            const isBlank = isBlankTranslation(translations[index]);
            const isCurrent = index === currentIndex;
            const isJustCompleted = index === currentIndex - 1;
            const segmentWidth = 100 / totalEntries;

            const status = isCompleted
              ? isBlank
                ? 'blank'
                : 'completed'
              : isCurrent
              ? 'current'
              : 'pending';
            const ariaLabel = `Entry ${index + 1}: ${status}${
              utterers[index] ? ` - ${utterers[index]}` : ''
            }`;

            return (
              <div
                key={index}
                data-segment={index}
                role="button"
                tabIndex={-1}
                aria-label={ariaLabel}
                className="relative h-full"
                style={{ width: `${segmentWidth}%` }}
              >
                {isCompleted && (
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      backgroundImage: isBlank
                        ? darkMode
                          ? 'linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)'
                          : 'linear-gradient(90deg, #991b1b 0%, #b91c1c 50%, #991b1b 100%)'
                        : darkMode
                        ? 'linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%)'
                        : 'linear-gradient(90deg, #22c55e 0%, #4ade80 50%, #22c55e 100%)',
                      backgroundSize: '200% 100%',
                      animation: isJustCompleted
                        ? 'shimmer 1.5s ease-out, pipGlow 1s ease-out'
                        : 'shimmer 3s ease-in-out infinite',
                      boxShadow: isBlank
                        ? '0 0 6px rgba(127, 29, 29, 0.5)'
                        : !isBlank && isJustCompleted
                        ? '0 0 12px rgba(34, 197, 94, 0.8)'
                        : '0 0 4px rgba(34, 197, 94, 0.3)',
                    }}
                  />
                )}
                {isCurrent && !isCompleted && (
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage: darkMode
                        ? 'linear-gradient(90deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%)'
                        : 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 50%, #9ca3af 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s ease-in-out infinite',
                      boxShadow: '0 0 8px rgba(156, 163, 175, 0.6)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="group flex-shrink-0">
        <button
          onClick={onNext}
          onMouseEnter={(e) => animateButtonHover?.(e.currentTarget, true)}
          onMouseLeave={(e) => animateButtonHover?.(e.currentTarget, false)}
          disabled={isNextDisabled}
          className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 disabled:border-gray-200 dark:disabled:border-gray-800 disabled:text-gray-300 dark:disabled:text-gray-700 disabled:from-gray-100 disabled:to-gray-100 dark:disabled:from-gray-900 dark:disabled:to-gray-900 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:shadow-none overflow-hidden"
          style={{ borderRadius: '3px' }}
          title="Next (→)"
          aria-label="Go to next entry"
        >
          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            style={{ borderRadius: '3px' }}
          />
        </button>
      </div>
    </div>
  );
};

export default NavigationProgressBar;
