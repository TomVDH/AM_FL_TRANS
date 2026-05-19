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
    bio?: string;
  } | null;
  color: string;
  isProtagonist: boolean;
  contextNote: string;
}

// Achromatic palette — speakers are distinguished by name, avatar initial, and alignment.
// Color is reserved for the Provenance System; speaker variation does not earn color.
// SPEAKER_PALETTE is exported as a no-op for back-compat with any importers.
export const SPEAKER_PALETTE = [
  { bg: 'bg-[#1f2937]', border: '', name: 'text-[#9ca3af]', avatar: 'bg-[#374151] text-[#f9fafb]' },
  { bg: 'bg-[#1f2937]', border: '', name: 'text-[#9ca3af]', avatar: 'bg-[#374151] text-[#f9fafb]' },
  { bg: 'bg-[#1f2937]', border: '', name: 'text-[#9ca3af]', avatar: 'bg-[#374151] text-[#f9fafb]' },
  { bg: 'bg-[#1f2937]', border: '', name: 'text-[#9ca3af]', avatar: 'bg-[#374151] text-[#f9fafb]' },
  { bg: 'bg-[#1f2937]', border: '', name: 'text-[#9ca3af]', avatar: 'bg-[#374151] text-[#f9fafb]' },
  { bg: 'bg-[#1f2937]', border: '', name: 'text-[#9ca3af]', avatar: 'bg-[#374151] text-[#f9fafb]' },
  { bg: 'bg-[#1f2937]', border: '', name: 'text-[#9ca3af]', avatar: 'bg-[#374151] text-[#f9fafb]' },
  { bg: 'bg-[#1f2937]', border: '', name: 'text-[#9ca3af]', avatar: 'bg-[#374151] text-[#f9fafb]' },
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
  male: '♂',
  female: '♀',
};

export const ChatBubble = React.memo(function ChatBubble({
  row,
  isSelected,
  languageMode,
  animationDelay,
  onClick,
  onSpeakerClick,
}: ChatBubbleProps) {
  const gender = row.codexEntry?.gender;
  const genderSymbol = gender ? GENDER_SYMBOLS[gender] || '' : '';

  // Status icon — achromatic. Pulsing dot for unsaved; check for translated.
  const statusIcon = row.isModified
    ? <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9fafb] animate-pulse ml-1.5" title="Unsaved changes" />
    : row.isTranslated
      ? <span className="ml-1.5 text-[#9ca3af]" title="Translated">&#10003;</span>
      : null;

  // Bubble content based on language mode
  const renderContent = () => {
    const enText = row.sourceText;
    const nlText = row.isTranslated ? row.translation : null;

    switch (languageMode) {
      case 'EN':
        return <div className="text-[15px] leading-[1.55] text-[#f9fafb]">{enText}</div>;
      case 'NL':
        return nlText
          ? <div className="text-[15px] leading-[1.55] text-[#f9fafb]">{nlText}</div>
          : <div className="text-[13px] italic text-[#6b7280]">— awaiting translation —</div>;
      case 'EN+NL':
        return (
          <>
            <div className="text-[15px] leading-[1.55] text-[#f9fafb]">{enText}</div>
            {nlText ? (
              <div className="mt-1.5 pt-1.5 border-t border-[#4b5563] text-[13px] text-[#9ca3af] italic">
                {nlText}
              </div>
            ) : (
              <div className="mt-1.5 pt-1.5 border-t border-[#4b5563] text-[13px] italic text-[#6b7280]">
                — awaiting translation —
              </div>
            )}
          </>
        );
    }
  };

  // Bubble surface — protagonist gets a slightly lifted surface; others sit at Scene Gray.
  // Untranslated state shown via dashed border, not color.
  const bubbleClasses = row.isProtagonist
    ? `bg-[#374151] border ${
        row.isTranslated ? 'border-[#4b5563]' : 'border-dashed border-[#4b5563]'
      }`
    : `bg-[#1f2937] border ${
        row.isTranslated ? 'border-[#374151]' : 'border-dashed border-[#374151]'
      }`;

  const avatarInitial = (row.speakerName.match(/[A-Za-z]/)?.[0] || row.speakerName.charAt(0)).toUpperCase();
  const avatarClasses = row.isProtagonist
    ? 'bg-[#f9fafb] text-[#111827]'
    : 'bg-[#374151] text-[#f9fafb]';

  return (
    <div
      className={`flex ${row.isProtagonist ? 'justify-end' : 'justify-start'} mb-3.5 animate-bubble-in`}
      style={{ animationDelay: `${Math.min(animationDelay, 400)}ms` }}
    >
      {!row.isProtagonist && (
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mr-2 mt-1 transition-transform duration-200 hover:scale-110 ${avatarClasses}`}
          title={row.speakerName}
        >
          {avatarInitial}
        </div>
      )}

      <div
        role="article"
        aria-label={`${row.speakerName}: ${row.sourceText}. ${
          row.isModified ? 'Unsaved changes' : row.isTranslated ? 'Translated' : 'Not yet translated'
        }.`}
        aria-selected={isSelected}
        tabIndex={0}
        className={`${row.isProtagonist ? 'max-w-[65%]' : 'max-w-[72%]'} px-4 py-3 cursor-pointer
          transition-shadow duration-200 scroll-mt-20
          ${bubbleClasses}
          ${isSelected
            ? 'ring-2 ring-offset-2 ring-offset-[#111827] ring-[#f9fafb] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]'
            : 'hover:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-px'
          }`}
        style={{ borderRadius: row.isProtagonist ? '10px 10px 2px 10px' : '10px 10px 10px 2px' }}
        onClick={() => onClick(row.index)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(row.index); } }}
      >
        {/* Speaker name tag — uppercase, achromatic */}
        <div className="flex items-center mb-1.5">
          <button
            className="text-[10px] font-black tracking-[0.05em] uppercase text-[#9ca3af] hover:text-[#f9fafb] transition-colors duration-150"
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
          <div className="text-[11px] italic text-[#6b7280] mb-1.5 leading-snug">
            [{row.contextNote}]
          </div>
        )}

        {/* Dialogue content */}
        {renderContent()}
      </div>

      {row.isProtagonist && (
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ml-2 mt-1 transition-transform duration-200 hover:scale-110 ${avatarClasses}`}
          title={row.speakerName}
        >
          {avatarInitial}
        </div>
      )}
    </div>
  );
});
