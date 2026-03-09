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
 * Compact info line shown on SetupWizard for reference data status
 */
const ReferenceDataInfo: React.FC<ReferenceDataInfoProps> = ({
  selectedLanguage,
  selectedLanguageName,
  hasReferenceData,
  isLoading,
  totalEntries,
  onLearnMore
}) => {
  if (isLoading || !selectedLanguage) {
    return null;
  }

  // Reference data exists — compact success line
  if (hasReferenceData) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50" style={{ borderRadius: '3px' }}>
        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">{totalEntries} codex entries</span> for {selectedLanguageName} — suggestions enabled
        </span>
      </div>
    );
  }

  // No reference data — compact warning with optional link
  return (
    <div className="flex items-center gap-2 px-3 py-2 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10" style={{ borderRadius: '3px' }}>
      <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-xs text-amber-700 dark:text-amber-400">
        No codex data for {selectedLanguageName} — translate without suggestions
      </span>
      {onLearnMore && (
        <button
          onClick={onLearnMore}
          className="ml-auto text-[10px] font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 underline underline-offset-2 shrink-0 transition-colors"
        >
          Learn more
        </button>
      )}
    </div>
  );
};

export default ReferenceDataInfo;
