// src/components/conversation/ChatBubble.tsx
'use client';

import React from 'react';

export interface ConversationRow {
  index: number;
  type: 'dialogue' | 'system';
  speakerName: string;
  sourceText: string;
  translation: string;
  isTranslated: boolean;
  isModified: boolean;
  codexEntry: {
    english: string;
    dutch: string;
    gender?: string;
    dialogueStyle?: string;
    bio?: string;
  } | null;
  color: string;
  isProtagonist: boolean;
  contextNote: string;
}

// Muted tint palette — left-border accent + subtle bg
// Index matches SPEAKER_COLORS order in ConversationThread
export const SPEAKER_PALETTE = [
  { bg: 'bg-blue-50 dark:bg-blue-950/30',     border: 'border-l-2 border-blue-400',     name: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30',   border: 'border-l-2 border-amber-500',    name: 'text-amber-700 dark:text-amber-300' },
  { bg: 'bg-violet-50 dark:bg-violet-950/30',  border: 'border-l-2 border-violet-400',   name: 'text-violet-700 dark:text-violet-300' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-l-2 border-emerald-400', name: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-rose-50 dark:bg-rose-950/30',     border: 'border-l-2 border-rose-400',     name: 'text-rose-700 dark:text-rose-300' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/30',     border: 'border-l-2 border-cyan-500',     name: 'text-cyan-700 dark:text-cyan-300' },
  { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-l-2 border-orange-400',   name: 'text-orange-700 dark:text-orange-300' },
  { bg: 'bg-teal-50 dark:bg-teal-950/30',     border: 'border-l-2 border-teal-400',     name: 'text-teal-700 dark:text-teal-300' },
] as const;

interface ChatBubbleProps {
  row: ConversationRow;
  colorIndex: number;
  isSelected: boolean;
  languageMode: 'EN' | 'NL' | 'EN+NL';
  animationDelay: number;
  onClick: (index: number) => void;
  onSpeakerClick?: (speakerName: string, event: React.MouseEvent) => void;
}

const GENDER_SYMBOLS: Record<string, string> = {
  male: '\u2642',
  female: '\u2640',
};

export const ChatBubble = React.memo(function ChatBubble({
  row,
  colorIndex,
  isSelected,
  languageMode,
  animationDelay,
  onClick,
  onSpeakerClick,
}: ChatBubbleProps) {
  const palette = row.isProtagonist ? null : SPEAKER_PALETTE[colorIndex % SPEAKER_PALETTE.length];
  const gender = row.codexEntry?.gender;
  const genderSymbol = gender ? GENDER_SYMBOLS[gender] || '' : '';

  // Status icon
  const statusIcon = row.isModified
    ? <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1.5" title="Unsaved changes" />
    : row.isTranslated
      ? <span className="ml-1.5 text-emerald-500" title="Translated">&#10003;</span>
      : null;

  // Bubble content based on language mode
  const renderContent = () => {
    const enText = row.sourceText;
    const nlText = row.isTranslated ? row.translation : null;

    const textColor = 'text-gray-900 dark:text-gray-100';
    const subTextColor = 'text-gray-600 dark:text-gray-400';

    switch (languageMode) {
      case 'EN':
        return <div className={`text-[15px] leading-[1.55] ${textColor}`}>{enText}</div>;
      case 'NL':
        return nlText
          ? <div className={`text-[15px] leading-[1.55] ${textColor}`}>{nlText}</div>
          : <div className="text-[13px] italic text-gray-400 dark:text-gray-500">— awaiting translation —</div>;
      case 'EN+NL':
        return (
          <>
            <div className={`text-[15px] leading-[1.55] ${textColor}`}>{enText}</div>
            {nlText ? (
              <div className={`mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-700 text-[13px] ${subTextColor} italic`}>
                {nlText}
              </div>
            ) : (
              <div className="mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-700 text-[13px] italic text-gray-400 dark:text-gray-500">
                — awaiting translation —
              </div>
            )}
          </>
        );
    }
  };

  // Protagonist vs other speaker styling
  const bubbleClasses = row.isProtagonist
    ? `bg-blue-50 dark:bg-blue-950/40 ${
        row.isTranslated
          ? 'ring-1 ring-blue-200 dark:ring-blue-800'
          : 'ring-1 ring-dashed ring-blue-300/50 dark:ring-blue-700/50'
      }`
    : `${palette!.bg} ${palette!.border} pl-3 ${
        !row.isTranslated ? 'border-dashed' : ''
      }`;

  return (
    <div
      className={`flex ${row.isProtagonist ? 'justify-end' : 'justify-start'} mb-3.5 animate-bubble-in`}
      style={{ animationDelay: `${Math.min(animationDelay, 400)}ms` }}
    >
      <div
        role="article"
        aria-label={`${row.speakerName}: ${row.sourceText}. ${
          row.isModified ? 'Unsaved changes' : row.isTranslated ? 'Translated' : 'Not yet translated'
        }.`}
        aria-selected={isSelected}
        tabIndex={0}
        className={`${row.isProtagonist ? 'max-w-[65%]' : 'max-w-[75%]'} px-4 py-3 cursor-pointer
          transition-all duration-200 scroll-mt-20
          ${bubbleClasses}
          ${isSelected
            ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-[1.01] shadow-lg'
            : 'hover:scale-[1.005] hover:shadow-sm hover:-translate-y-px'
          }`}
        style={{ borderRadius: '6px' }}
        onClick={() => onClick(row.index)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(row.index); } }}
      >
        {/* Speaker name tag */}
        <div className="flex items-center mb-1.5">
          <button
            className={`text-[10px] font-semibold tracking-widest uppercase ${
              row.isProtagonist ? 'text-blue-600 dark:text-blue-400' : palette!.name
            } hover:underline transition-colors duration-150`}
            onClick={(e) => { e.stopPropagation(); onSpeakerClick?.(row.speakerName, e); }}
            title={row.codexEntry ? `${row.codexEntry.english} → ${row.codexEntry.dutch}` : row.speakerName}
          >
            {row.speakerName}
            {genderSymbol && <span className="ml-1 text-[9px] opacity-60">{genderSymbol}</span>}
          </button>
          {statusIcon}
        </div>

        {/* Context note */}
        {row.contextNote && (
          <div className="text-[11px] italic text-gray-400 dark:text-gray-500 mb-1.5 leading-snug">
            [{row.contextNote}]
          </div>
        )}

        {/* Dialogue content */}
        {renderContent()}
      </div>
    </div>
  );
});
