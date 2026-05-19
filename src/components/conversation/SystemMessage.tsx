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
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#374151] to-transparent" />
      <span className={`text-[11px] font-bold italic whitespace-nowrap px-3 py-1 rounded-[2px]
        ${isSelected
          ? 'text-[#f9fafb] bg-[#374151]'
          : 'text-[#9ca3af] group-hover:text-[#f9fafb] group-hover:bg-[#1f2937]'
        }`}>
        {displayText}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#374151] to-transparent" />
    </div>
  );
});
