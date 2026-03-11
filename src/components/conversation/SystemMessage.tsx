// src/components/conversation/SystemMessage.tsx
'use client';

import React from 'react';
import type { ConversationRow } from './ChatBubble';

interface SystemMessageProps {
  row: ConversationRow;
  isSelected: boolean;
  languageMode: 'EN' | 'NL' | 'EN+NL';
  onClick: (index: number) => void;
}

export const SystemMessage = React.memo(function SystemMessage({
  row,
  isSelected,
  languageMode,
  onClick,
}: SystemMessageProps) {
  const displayText = languageMode === 'NL' && row.isTranslated
    ? row.translation
    : row.sourceText || row.contextNote || '—';

  return (
    <div
      role="note"
      aria-label={`Stage direction: ${displayText}`}
      tabIndex={0}
      className={`flex items-center gap-3 my-4 cursor-pointer group transition-all duration-150
        ${isSelected ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
      onClick={() => onClick(row.index)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(row.index); } }}
    >
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
      <span className={`text-[11px] font-medium italic whitespace-nowrap px-3 py-1 rounded-full
        ${isSelected
          ? 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800'
          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50'
        }`}>
        {displayText}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
    </div>
  );
});
