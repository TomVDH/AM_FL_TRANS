// src/components/conversation/ConversationHeader.tsx
'use client';

import React from 'react';
import type { ConversationRow } from './ChatBubble';

type LanguageMode = 'EN' | 'NL' | 'EN+NL';

interface ConversationHeaderProps {
  sheetName: string;
  rows: ConversationRow[];
  languageMode: LanguageMode;
  onLanguageModeChange: (mode: LanguageMode) => void;
  protagonistName: string;
  speakers: string[];
  onProtagonistChange: (name: string) => void;
  onExit: () => void;
}

const LANGUAGE_MODES: LanguageMode[] = ['EN', 'NL', 'EN+NL'];

export function ConversationHeader({
  sheetName,
  rows,
  languageMode,
  onLanguageModeChange,
  protagonistName,
  speakers,
  onProtagonistChange,
  onExit,
}: ConversationHeaderProps) {
  const activeIndex = LANGUAGE_MODES.indexOf(languageMode);
  const translated = rows.filter(r => r.isTranslated).length;
  const total = rows.length;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 shadow-sm" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.9)' }}>
      <style>{`.dark .fixed.z-50[style] { background-color: rgba(17,24,39,0.9) !important; }`}</style>
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center gap-3">

        {/* Sheet name */}
        <span className="text-xs font-bold tracking-wide uppercase text-gray-700 dark:text-gray-300 truncate max-w-[120px]" title={sheetName}>
          {sheetName}
        </span>

        {/* Progress: segmented pips */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-px h-1.5 overflow-hidden" style={{ borderRadius: '2px' }}>
            {rows.map((row, i) => (
              <div
                key={i}
                className={`flex-1 transition-colors duration-300 ${
                  row.isModified ? 'bg-amber-400' :
                  row.isTranslated ? 'bg-emerald-500' :
                  'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            {translated} / {total} translated
          </div>
        </div>

        {/* Language toggle: sliding pill */}
        <div className="relative flex bg-gray-100 dark:bg-gray-800 p-0.5" style={{ borderRadius: '3px' }}>
          <div
            className="absolute top-0.5 bottom-0.5 bg-white dark:bg-gray-600 shadow-sm transition-all duration-200"
            style={{
              borderRadius: '2px',
              width: `calc(${100 / 3}% - 2px)`,
              left: activeIndex === 0 ? '2px' : activeIndex === 1 ? 'calc(33.333%)' : 'calc(66.666%)',
            }}
          />
          {LANGUAGE_MODES.map((mode, i) => (
            <button
              key={mode}
              onClick={() => onLanguageModeChange(mode)}
              className={`relative z-10 px-2 py-0.5 text-[11px] font-semibold transition-colors duration-150 ${
                activeIndex === i ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* POV selector */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-500">POV:</span>
          <select
            value={protagonistName}
            onChange={(e) => onProtagonistChange(e.target.value)}
            className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ borderRadius: '3px' }}
          >
            {speakers.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Exit button */}
        <button
          onClick={onExit}
          className="p-1.5 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
          style={{ borderRadius: '3px' }}
          title="Exit conversation view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
