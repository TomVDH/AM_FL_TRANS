// src/components/ConversationView.tsx
'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { extractSpeakerName } from '@/utils/speakerNameUtils';
import { findCodexCharacter, isSystemMessage, type CodexEntry } from '@/utils/speakerCodexUtils';
import { ConversationHeader } from './conversation/ConversationHeader';
import { ConversationThread } from './conversation/ConversationThread';
import { EditDock } from './conversation/EditDock';
import { CharacterInfoPopover } from './conversation/CharacterInfoPopover';
import type { ConversationRow } from './conversation/ChatBubble';

type LanguageMode = 'EN' | 'NL' | 'EN+NL';

interface ConversationViewProps {
  sourceTexts: string[];
  translations: string[];
  originalTranslations: string[];
  utterers: string[];
  contextNotes: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  setCurrentTranslation: (text: string) => void;
  handleSubmitWithSync: () => Promise<void>;
  updateTranslationAtIndex: (index: number, value: string) => void;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  selectedSheet: string;
  characterData: CodexEntry[];
  highlightMode: boolean;
  onExit: () => void;
}

const BLANK_PLACEHOLDER = '[BLANK, REMOVE LATER]';

export function ConversationView({
  sourceTexts,
  translations,
  originalTranslations,
  utterers,
  contextNotes,
  currentIndex,
  setCurrentIndex,
  setCurrentTranslation,
  handleSubmitWithSync,
  updateTranslationAtIndex,
  syncStatus,
  selectedSheet,
  characterData,
  highlightMode,
  onExit,
}: ConversationViewProps) {
  const [selectedBubbleIndex, setSelectedBubbleIndex] = useState<number | null>(null);
  const [languageMode, setLanguageMode] = useState<LanguageMode>('EN+NL');
  const [protagonistName, setProtagonistName] = useState<string>('');
  const lastSelectedRef = useRef<HTMLElement | null>(null);
  const [popoverState, setPopoverState] = useState<{ speakerName: string; rect: DOMRect } | null>(null);

  // Build unique speakers list and auto-detect protagonist
  const speakers = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const u of utterers) {
      const name = extractSpeakerName(u);
      if (name !== 'Speaker' && !seen.has(name)) {
        seen.add(name);
        result.push(name);
      }
    }
    return result;
  }, [utterers]);

  // Auto-detect protagonist on mount / sheet change
  useEffect(() => {
    const foal = speakers.find(s => s === 'Foal' || s === '{$NewName}');
    if (foal) {
      setProtagonistName(foal);
    } else if (speakers.length > 0) {
      // Most frequent speaker
      const counts = new Map<string, number>();
      for (const u of utterers) {
        const name = extractSpeakerName(u);
        counts.set(name, (counts.get(name) || 0) + 1);
      }
      let maxName = speakers[0];
      let maxCount = 0;
      counts.forEach((count, name) => {
        if (count > maxCount && name !== 'Speaker') { maxCount = count; maxName = name; }
      });
      setProtagonistName(maxName);
    }
  }, [speakers, selectedSheet]);

  // Speaker-to-codex map and color assignment
  const { speakerCodexMap, colorMap } = useMemo(() => {
    const speakerCodexMap = new Map<string, CodexEntry | null>();
    const colorMap = new Map<string, number>();
    let colorIdx = 0;
    const seen = new Set<string>();

    for (const u of utterers) {
      const name = extractSpeakerName(u);
      if (!seen.has(name)) {
        seen.add(name);
        speakerCodexMap.set(name, findCodexCharacter(name, characterData));
        if (name !== protagonistName && name !== 'Speaker') {
          colorMap.set(name, colorIdx);
          colorIdx++;
        }
      }
    }
    return { speakerCodexMap, colorMap };
  }, [utterers, characterData, protagonistName]);

  // Build ConversationRow[] model
  const conversationRows: ConversationRow[] = useMemo(() => {
    return sourceTexts.map((text, i) => {
      const name = extractSpeakerName(utterers[i]);
      const translation = translations[i] === BLANK_PLACEHOLDER ? '' : (translations[i] || '');
      const original = originalTranslations[i] === BLANK_PLACEHOLDER ? '' : (originalTranslations[i] || '');
      return {
        index: i,
        type: isSystemMessage(utterers[i], contextNotes[i]) ? 'system' as const : 'dialogue' as const,
        speakerName: name,
        sourceText: text,
        translation,
        isTranslated: !!translation && translation !== '',
        isModified: translation !== original,
        codexEntry: speakerCodexMap.get(name) ?? null,
        color: '',
        isProtagonist: name === protagonistName,
        contextNote: contextNotes[i] || '',
      };
    });
  }, [sourceTexts, translations, originalTranslations, utterers, contextNotes, speakerCodexMap, protagonistName]);

  // Handle bubble click
  const handleBubbleClick = useCallback((index: number) => {
    setSelectedBubbleIndex(index);
    setCurrentIndex(index);
    const t = translations[index] === BLANK_PLACEHOLDER ? '' : (translations[index] || '');
    setCurrentTranslation(t);
  }, [translations, setCurrentIndex, setCurrentTranslation]);

  // Handle submit from EditDock
  const handleDockSubmit = useCallback(async (index: number, translation: string) => {
    // Sync the translation to global state so handleSubmitWithSync can read it
    setCurrentIndex(index);
    setCurrentTranslation(translation);

    // Wait a tick for React to flush state, then submit
    await new Promise(resolve => setTimeout(resolve, 0));
    await handleSubmitWithSync();

    // Auto-advance to next untranslated after brief delay
    setTimeout(() => {
      const nextUntranslated = conversationRows.findIndex(
        (r, i) => i > index && !r.isTranslated
      );
      if (nextUntranslated !== -1) {
        setSelectedBubbleIndex(nextUntranslated);
        setCurrentIndex(nextUntranslated);
        const t = translations[nextUntranslated] === BLANK_PLACEHOLDER ? '' : (translations[nextUntranslated] || '');
        setCurrentTranslation(t);
      } else {
        toast.success('All lines translated!', { duration: 2000 });
      }
    }, 500);
  }, [conversationRows, translations, handleSubmitWithSync, setCurrentIndex, setCurrentTranslation]);

  // Handle auto-save (on dismiss / navigate)
  const handleAutoSave = useCallback((index: number, translation: string) => {
    updateTranslationAtIndex(index, translation || BLANK_PLACEHOLDER);
  }, [updateTranslationAtIndex]);

  // Handle navigate from EditDock
  const handleDockNavigate = useCallback((direction: -1 | 1) => {
    if (selectedBubbleIndex === null) return;
    const newIndex = selectedBubbleIndex + direction;
    if (newIndex >= 0 && newIndex < sourceTexts.length) {
      handleBubbleClick(newIndex);
    }
  }, [selectedBubbleIndex, sourceTexts.length, handleBubbleClick]);

  // Handle dismiss
  const handleDockDismiss = useCallback(() => {
    setSelectedBubbleIndex(null);
  }, []);

  // Handle speaker name click — show character info popover
  const handleSpeakerClick = useCallback((speakerName: string, event: React.MouseEvent) => {
    if (!highlightMode) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopoverState({ speakerName, rect });
  }, [highlightMode]);

  // Language mode cycling via 'L' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in textarea
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        return;
      }
      if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLanguageMode(prev => {
          const modes: LanguageMode[] = ['EN', 'NL', 'EN+NL'];
          return modes[(modes.indexOf(prev) + 1) % 3];
        });
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (selectedBubbleIndex !== null) {
          setSelectedBubbleIndex(null);
        }
        // Escape does NOT exit conversation mode — only the X button does
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBubbleIndex]);

  // Scroll to first untranslated on mount
  useEffect(() => {
    const firstUntranslated = conversationRows.findIndex(r => !r.isTranslated);
    if (firstUntranslated !== -1) {
      // Let the animation play, then scroll
      setTimeout(() => {
        setSelectedBubbleIndex(firstUntranslated);
        handleBubbleClick(firstUntranslated);
      }, 600);
    }
  }, []); // Only on mount

  const selectedRow = selectedBubbleIndex !== null ? conversationRows[selectedBubbleIndex] : null;

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-gray-50 dark:bg-gray-950" style={{ height: '100dvh' }}>
      <ConversationHeader
        sheetName={selectedSheet}
        rows={conversationRows}
        languageMode={languageMode}
        onLanguageModeChange={setLanguageMode}
        protagonistName={protagonistName}
        speakers={speakers}
        onProtagonistChange={setProtagonistName}
        onExit={onExit}
      />

      <div className="flex-1 overflow-hidden mt-[60px]">
        <ConversationThread
          rows={conversationRows}
          colorMap={colorMap}
          selectedIndex={selectedBubbleIndex}
          languageMode={languageMode}
          isDockOpen={selectedBubbleIndex !== null}
          onBubbleClick={handleBubbleClick}
          onSpeakerClick={handleSpeakerClick}
        />
      </div>

      <EditDock
        row={selectedRow}
        syncStatus={syncStatus}
        onSubmit={handleDockSubmit}
        onAutoSave={handleAutoSave}
        onNavigate={handleDockNavigate}
        onDismiss={handleDockDismiss}
        totalRows={sourceTexts.length}
      />

      {popoverState && (() => {
        const entry = speakerCodexMap.get(popoverState.speakerName);
        if (!entry) return null;
        return (
          <CharacterInfoPopover
            character={entry}
            anchorRect={popoverState.rect}
            onClose={() => setPopoverState(null)}
            onInsert={(text) => { /* insert into textarea if dock is open */ }}
          />
        );
      })()}
    </div>
  );
}
