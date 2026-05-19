// src/components/conversation/CharacterInfoPopover.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import type { CodexEntry } from '@/utils/speakerCodexUtils';

interface CharacterInfoPopoverProps {
  character: CodexEntry;
  anchorRect: DOMRect;
  onClose: () => void;
  onInsert: (text: string) => void;
}

const GENDER_SYMBOLS: Record<string, string> = { male: '\u2642', female: '\u2640' };

export function CharacterInfoPopover({ character, anchorRect, onClose, onInsert }: CharacterInfoPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Position near the anchor
  const top = anchorRect.bottom + 4;
  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 280));

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey, true); // capture phase — before ConversationView's handler
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey, true);
    };
  }, [onClose]);

  const gender = character.gender ? GENDER_SYMBOLS[character.gender] : '';
  const hasContent = character.gender || character.flemishDensity || character.bio;
  if (!hasContent) return null;

  return (
    <div
      ref={ref}
      className="fixed z-50 w-64 bg-[#1f2937] border border-[#9333ea]/40 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] popover-bloom rounded-[3px]"
      style={{ top, left }}
    >
      {/* Character Purple provenance bar */}
      <div className="h-px bg-[#9333ea]/60" />
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-[#f9fafb]">
            {character.english} {gender && <span className="text-xs text-[#9ca3af]">{gender}</span>}
            <span className="mx-1.5 text-[#6b7280]">→</span>
            <span className="text-[#c4a8f0]">{character.dutch}</span>
          </div>
          <button
            onClick={() => onInsert(character.dutch)}
            className="p-1 text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
            title="Insert Dutch name"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Voice profile */}
        {character.flemishDensity && (
          <div className="text-[11px] text-[#9ca3af] mb-1.5 leading-relaxed">
            {character.flemishDensity}{character.register ? ` ${character.register}` : ''}{character.pronounForm ? ` · ${character.pronounForm}` : ''}
          </div>
        )}

        {/* Bio */}
        {character.bio && (
          <div className="text-[11px] text-[#6b7280] italic leading-relaxed">
            {character.bio.length > 120 ? character.bio.slice(0, 120) + '...' : character.bio}
          </div>
        )}
      </div>
    </div>
  );
}
