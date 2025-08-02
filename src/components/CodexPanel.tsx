'use client';

import React from 'react';

interface CodexPanelProps {
  codexData: any;
  accordionStates: { [key: string]: boolean };
  isLoadingCodex: boolean;
  categoryHasMatches: (category: string) => boolean;
  toggleAccordion: (category: string) => void;
  renderCodexItems: (category: string, categoryKey: string) => React.ReactNode;
}

const CodexPanel: React.FC<CodexPanelProps> = ({
  codexData,
  accordionStates,
  isLoadingCodex,
  categoryHasMatches,
  toggleAccordion,
  renderCodexItems
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Codex Reference</h3>
      
      {/* Render accordions dynamically based on codex data */}
      {codexData && Object.keys(codexData).length > 0 ? (
        Object.keys(codexData).map((category) => {
          const hasMatches = categoryHasMatches(category);
          return (
            <div key={category} className={`bg-white dark:bg-gray-800 border shadow-sm transition-all duration-300 ${
              hasMatches 
                ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10' 
                : 'border-black dark:border-gray-600'
            }`}>
              <button
                onClick={() => toggleAccordion(category)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className={`font-bold ${
                  hasMatches 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {category.replace(/-/g, ' ').replace(/_/g, ' ')}
                </span>
                <svg className={`w-5 h-5 transform transition-transform duration-200 ${accordionStates[category] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accordionStates[category] && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <div className="space-y-2 text-sm">
                    {renderCodexItems(category, category)}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-4 text-gray-500">
          {isLoadingCodex ? 'Loading codex data...' : 'No codex data available'}
        </div>
      )}
    </div>
  );
};

export default CodexPanel; 