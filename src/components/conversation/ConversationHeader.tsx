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
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#1f2937] border-b border-[#374151]">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center gap-4">

        {/* Sheet name */}
        <span
          className="text-[11px] font-black tracking-[0.05em] uppercase text-[#9ca3af] truncate max-w-[140px]"
          title={sheetName}
        >
          {sheetName}
        </span>

        {/* Progress: achromatic pips */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-[2px] h-[6px] overflow-hidden rounded-[2px]">
            {rows.map((row, i) => (
              <div
                key={i}
                className={`flex-1 transition-colors duration-300 ${
                  row.isModified ? 'bg-[#9ca3af] animate-pulse' :
                  row.isTranslated ? 'bg-[#f9fafb]' :
                  'bg-[#374151]'
                }`}
              />
            ))}
          </div>
          <div className="text-[10px] text-[#6b7280] mt-1 tabular-nums font-bold">
            {translated}/{total} translated
          </div>
        </div>

        {/* Language toggle: sliding pill in achromatic */}
        <div className="relative flex bg-[#111827] border border-[#374151] p-0.5 rounded-[3px]">
          <div
            className="absolute top-0.5 bottom-0.5 bg-[#374151] transition-all duration-200 rounded-[2px]"
            style={{
              width: `calc(${100 / 3}% - 2px)`,
              left: activeIndex === 0 ? '2px' : activeIndex === 1 ? 'calc(33.333%)' : 'calc(66.666%)',
            }}
          />
          {LANGUAGE_MODES.map((mode, i) => (
            <button
              key={mode}
              onClick={() => onLanguageModeChange(mode)}
              className={`relative z-10 px-2.5 py-1 text-[11px] font-black tracking-[0.05em] transition-colors duration-150 ${
                activeIndex === i ? 'text-[#f9fafb]' : 'text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* POV selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black tracking-[0.1em] uppercase text-[#6b7280]">POV</span>
          <select
            value={protagonistName}
            onChange={(e) => onProtagonistChange(e.target.value)}
            className="text-xs bg-[#111827] border border-[#4b5563] text-[#f9fafb] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#9ca3af]/40 focus:border-[#9ca3af] transition-colors duration-200 rounded-[3px]"
          >
            {speakers.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Exit button */}
        <button
          onClick={onExit}
          className="p-2 text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#374151] transition-colors duration-200 rounded-[3px]"
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
