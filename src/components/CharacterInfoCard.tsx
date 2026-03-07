'use client';

import React, { useState } from 'react';

interface CharacterInfoCardProps {
  character: {
    name: string;
    english: string;
    dutch: string;
    gender?: string;
    dialogueStyle?: string;
    dutchDialogueStyle?: string;
    bio?: string;
  };
  onClose: () => void;
  onInsert: (text: string) => void;
}

/**
 * CharacterInfoCard - Expandable card showing gender, dialogue style, and bio
 * for main characters. Rendered inside QuickReferenceBar or ReferenceToolsPanel.
 */
const CharacterInfoCard: React.FC<CharacterInfoCardProps> = ({
  character,
  onClose,
  onInsert,
}) => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const { gender, dialogueStyle, dutchDialogueStyle, bio, english, dutch } = character;

  const hasAnyInfo = gender || dialogueStyle || dutchDialogueStyle || bio;
  if (!hasAnyInfo) return null;

  // Determine if bio needs truncation (roughly > 120 chars)
  const bioNeedsTruncation = bio && bio.length > 120;
  const displayBio = bioExpanded || !bioNeedsTruncation
    ? bio
    : bio?.slice(0, 120) + '...';

  return (
    <div
      className="character-info-card mt-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 overflow-hidden animate-in slide-in-from-top-1 duration-200"
      style={{ borderRadius: '4px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-purple-100/50 dark:bg-purple-800/30 border-b border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-purple-900 dark:text-purple-100">
            {english}
          </span>
          <span className="text-[10px] text-purple-500 dark:text-purple-400">&rarr;</span>
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
            {dutch}
          </span>
          {gender && (
            <span className="text-[10px] px-1.5 py-0.5 bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-200 font-medium" style={{ borderRadius: '2px' }}>
              {gender === 'male' ? '\u2642' : '\u2640'} {gender}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onInsert(dutch)}
            className="p-1 text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
            style={{ borderRadius: '2px' }}
            title={`Insert "${dutch}"`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1 text-purple-400 dark:text-purple-500 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
            style={{ borderRadius: '2px' }}
            title="Close (Esc)"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-2 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
        {/* Dialogue Style (EN) */}
        {dialogueStyle && (
          <div>
            <div className="text-[9px] uppercase tracking-wider text-purple-500 dark:text-purple-400 font-bold mb-0.5">
              Style <span className="text-purple-400 dark:text-purple-500">EN</span>
            </div>
            <div className="text-[11px] text-purple-900 dark:text-purple-100 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-purple-300 dark:border-purple-600">
              {dialogueStyle}
            </div>
          </div>
        )}

        {/* Dialogue Style (NL) */}
        {dutchDialogueStyle && (
          <div>
            <div className="text-[9px] uppercase tracking-wider text-orange-500 dark:text-orange-400 font-bold mb-0.5">
              Style <span className="text-orange-400 dark:text-orange-500">NL</span>
            </div>
            <div className="text-[11px] text-orange-900 dark:text-orange-100 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-orange-300 dark:border-orange-600">
              {dutchDialogueStyle}
            </div>
          </div>
        )}

        {/* Bio */}
        {bio && (
          <div>
            <div className="text-[9px] uppercase tracking-wider text-purple-500 dark:text-purple-400 font-bold mb-0.5">
              Bio
            </div>
            <div className="text-[11px] text-purple-800 dark:text-purple-200 leading-relaxed">
              {displayBio}
              {bioNeedsTruncation && (
                <button
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="ml-1 text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 font-medium underline"
                >
                  {bioExpanded ? 'less' : 'more'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CharacterInfoCard);
