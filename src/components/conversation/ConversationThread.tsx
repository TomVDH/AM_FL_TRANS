// src/components/conversation/ConversationThread.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { ChatBubble, type ConversationRow } from './ChatBubble';
import { SystemMessage } from './SystemMessage';

type LanguageMode = 'EN' | 'NL' | 'EN+NL';

interface ConversationThreadProps {
  rows: ConversationRow[];
  colorMap: Map<string, number>;
  selectedIndex: number | null;
  languageMode: LanguageMode;
  isDockOpen: boolean;
  onBubbleClick: (index: number) => void;
  onSpeakerClick?: (speakerName: string, event: React.MouseEvent) => void;
}

export function ConversationThread({
  rows,
  colorMap,
  selectedIndex,
  languageMode,
  isDockOpen,
  onBubbleClick,
  onSpeakerClick,
}: ConversationThreadProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Scroll selected bubble into view
  useEffect(() => {
    if (selectedIndex !== null) {
      const el = bubbleRefs.current.get(selectedIndex);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedIndex]);

  return (
    <div
      ref={threadRef}
      role="feed"
      aria-label="Conversation thread"
      className="flex-1 overflow-y-auto px-4 pt-4 transition-[padding-bottom] duration-200 ease-out custom-scrollbar"
      style={{ paddingBottom: isDockOpen ? '160px' : '24px' }}
    >
      <div className="max-w-3xl mx-auto">
        {rows.map((row, i) => {
          if (row.type === 'system') {
            return (
              <SystemMessage
                key={row.index}
                row={row}
                isSelected={selectedIndex === row.index}
                languageMode={languageMode}
                onClick={onBubbleClick}
              />
            );
          }

          return (
            <div
              key={row.index}
              ref={(el) => { if (el) bubbleRefs.current.set(row.index, el); }}
            >
              <ChatBubble
                row={row}
                colorIndex={colorMap.get(row.speakerName) ?? 0}
                isSelected={selectedIndex === row.index}
                languageMode={languageMode}
                animationDelay={i * 18}
                onClick={onBubbleClick}
                onSpeakerClick={onSpeakerClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
