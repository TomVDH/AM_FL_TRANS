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
      className="fixed z-50 w-64 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 shadow-lg popover-bloom"
      style={{ borderRadius: '4px', top, left }}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-200">
            {character.english} {gender && <span className="text-xs opacity-60">{gender}</span>}
            <span className="mx-1.5 text-purple-300 dark:text-purple-600">&rarr;</span>
            <span className="text-purple-700 dark:text-purple-300">{character.dutch}</span>
          </div>
          <button
            onClick={() => onInsert(character.dutch)}
            className="p-1 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300"
            title="Insert Dutch name"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Voice profile */}
        {character.flemishDensity && (
          <div className="text-[11px] text-purple-800 dark:text-purple-300 mb-1.5 leading-relaxed">
            {character.flemishDensity}{character.register ? ` ${character.register}` : ''}{character.pronounForm ? ` · ${character.pronounForm}` : ''}
          </div>
        )}

        {/* Bio */}
        {character.bio && (
          <div className="text-[11px] text-purple-600 dark:text-purple-400 italic leading-relaxed">
            {character.bio.length > 120 ? character.bio.slice(0, 120) + '...' : character.bio}
          </div>
        )}
      </div>
    </div>
  );
}
