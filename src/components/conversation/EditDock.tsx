// src/components/conversation/EditDock.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ConversationRow } from './ChatBubble';

interface EditDockProps {
  row: ConversationRow | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  onSubmit: (index: number, translation: string) => void;
  onAutoSave: (index: number, translation: string) => void;
  onNavigate: (direction: -1 | 1) => void;
  onDismiss: () => void;
  totalRows: number;
}

export function EditDock({
  row,
  syncStatus,
  onSubmit,
  onAutoSave,
  onNavigate,
  onDismiss,
  totalRows,
}: EditDockProps) {
  const [localText, setLocalText] = useState('');
  const [initialText, setInitialText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentRowRef = useRef<ConversationRow | null>(null);

  // Auto-save dirty text when switching away from a row
  const autoSaveIfDirty = useCallback(() => {
    if (currentRowRef.current && localText !== initialText) {
      onAutoSave(currentRowRef.current.index, localText);
    }
  }, [localText, initialText, onAutoSave]);

  // Mount/unmount animation
  useEffect(() => {
    if (row) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setShouldRender(false), 180);
      return () => clearTimeout(t);
    }
  }, [row]);

  // Load row content when row changes
  useEffect(() => {
    if (row) {
      // Auto-save previous row if dirty
      autoSaveIfDirty();

      const displayTranslation = row.translation === '[BLANK, REMOVE LATER]' ? '' : (row.translation || '');
      setLocalText(displayTranslation);
      setInitialText(displayTranslation);
      currentRowRef.current = row;

      // Focus textarea after a tick (let animation start)
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [row?.index]); // Only re-run when the actual row index changes

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!row || syncStatus === 'syncing') return;
    onSubmit(row.index, localText);
  }, [row, localText, syncStatus, onSubmit]);

  // Handle navigation
  const handleNav = useCallback((dir: -1 | 1) => {
    autoSaveIfDirty();
    onNavigate(dir);
  }, [autoSaveIfDirty, onNavigate]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    autoSaveIfDirty();
    onDismiss();
  }, [autoSaveIfDirty, onDismiss]);

  // Keyboard: Shift+Enter to submit, Escape to dismiss, Alt+arrows to navigate
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleDismiss();
    } else if (e.key === 'ArrowUp' && e.altKey) {
      e.preventDefault();
      handleNav(-1);
    } else if (e.key === 'ArrowDown' && e.altKey) {
      e.preventDefault();
      handleNav(1);
    }
  }, [handleSubmit, handleDismiss, handleNav]);

  if (!shouldRender || !row) return null;

  const isAtStart = row.index === 0;
  const isAtEnd = row.index === totalRows - 1;

  return (
    <div
      role="complementary"
      aria-label="Edit panel for selected dialogue"
      aria-live="polite"
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[#1f2937] border-t border-[#374151] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] ${
        isVisible ? 'dock-enter' : 'dock-exit'
      }`}
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-3xl mx-auto px-5 py-4">
        {/* Source line */}
        <div className="flex items-start gap-2.5 mb-3" aria-readonly="true" aria-label="English source text (read only)">
          <span className="text-[11px] font-black tracking-[0.05em] uppercase text-[#9ca3af] shrink-0 mt-0.5">{row.speakerName}</span>
          <span className="text-sm text-[#9ca3af] leading-relaxed line-clamp-2" title={row.sourceText}>
            &ldquo;{row.sourceText}&rdquo;
          </span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-[#4b5563] bg-[#111827] text-[#f9fafb] placeholder-[#6b7280] resize-none focus:outline-none focus:ring-2 focus:ring-[#9ca3af]/40 focus:border-[#9ca3af] transition-colors duration-200 rounded-[3px]"
          rows={2}
          placeholder="Enter Dutch translation..."
        />

        {/* Bottom bar: nav arrows + submit hint */}
        <div className="flex items-center justify-between mt-2.5">
          <button
            onClick={() => handleNav(-1)}
            disabled={isAtStart}
            className="px-3 py-1.5 text-xs font-black uppercase tracking-[0.05em] text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#374151] disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-200 rounded-[3px]"
            style={{ minWidth: '44px', minHeight: '36px' }}
            title="Previous (Alt+Up)"
          >
            &laquo; Prev
          </button>

          <div className="flex items-center gap-2.5 text-[11px] text-[#6b7280]">
            {syncStatus === 'syncing' && (
              <span className="text-[#f9fafb] animate-pulse font-bold">Syncing…</span>
            )}
            <kbd className="px-1.5 py-0.5 bg-[#111827] border border-[#4b5563] rounded-[2px] text-[10px] font-mono text-[#9ca3af]">Shift+Enter</kbd>
            <span>to submit</span>
          </div>

          <button
            onClick={() => handleNav(1)}
            disabled={isAtEnd}
            className="px-3 py-1.5 text-xs font-black uppercase tracking-[0.05em] text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#374151] disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-200 rounded-[3px]"
            style={{ minWidth: '44px', minHeight: '36px' }}
            title="Next (Alt+Down)"
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
