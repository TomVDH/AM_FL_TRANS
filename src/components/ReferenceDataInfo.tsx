'use client';

import React from 'react';

interface ReferenceDataInfoProps {
  selectedLanguage: string | null;  // e.g., "NL", "PT"
  selectedLanguageName: string | null;  // e.g., "Dutch", "Portuguese"
  hasReferenceData: boolean;
  isLoading: boolean;
  totalEntries: number;
  onLearnMore?: () => void;
}

/**
 * Info panel shown on SetupWizard when reference data status needs attention
 */
const ReferenceDataInfo: React.FC<ReferenceDataInfoProps> = ({
  selectedLanguage,
  selectedLanguageName,
  hasReferenceData,
  isLoading,
  totalEntries,
  onLearnMore
}) => {
  if (isLoading) {
    return null; // Don't show anything while loading
  }

  // If no language selected yet, don't show
  if (!selectedLanguage) {
    return null;
  }

  // If reference data exists for this language, show success state
  if (hasReferenceData) {
    return (
      <div className="p-4 border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded" style={{ borderRadius: '3px' }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Reference data available for {selectedLanguageName}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {totalEntries} entries loaded. Quick suggestions and character highlighting enabled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No reference data - show info panel
  return (
    <div className="p-4 border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded" style={{ borderRadius: '3px' }}>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Looking for quick reference and in-translation highlights?
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Reference data (character names, common phrases) is not yet available for {selectedLanguageName}.
            You can still translate, but auto-suggestions won&apos;t appear.
          </p>
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors"
              style={{ borderRadius: '3px' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Learn how to add reference data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferenceDataInfo;
