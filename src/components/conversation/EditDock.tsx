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
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-700 shadow-xl ${
        isVisible ? 'dock-enter' : 'dock-exit'
      }`}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.92)' }}
      onKeyDown={handleKeyDown}
    >
      <style>{`.dark [role="complementary"] { background-color: rgba(17,24,39,0.92) !important; }`}</style>
      <div className="max-w-3xl mx-auto px-4 py-3.5">
        {/* Source line */}
        <div className="flex items-center gap-2 mb-2.5 text-sm text-gray-500 dark:text-gray-400" aria-readonly="true" aria-label="English source text (read only)">
          <span className="font-bold text-gray-700 dark:text-gray-300 shrink-0 text-xs uppercase tracking-wide">{row.speakerName}:</span>
          <span className="truncate text-[13px]" title={row.sourceText}>&ldquo;{row.sourceText}&rdquo;</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-shadow duration-200"
          style={{ borderRadius: '4px' }}
          rows={2}
          placeholder="Enter Dutch translation..."
        />

        {/* Bottom bar: nav arrows + submit hint */}
        <div className="flex items-center justify-between mt-2.5">
          <button
            onClick={() => handleNav(-1)}
            disabled={isAtStart}
            className="px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 press-effect"
            style={{ borderRadius: '4px', minWidth: '44px', minHeight: '44px' }}
            title="Previous (Alt+Up)"
          >
            &laquo; -1
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
            {syncStatus === 'syncing' && (
              <span className="text-amber-500 animate-pulse">Syncing...</span>
            )}
            <span className="opacity-60">Shift+Enter to submit</span>
          </div>

          <button
            onClick={() => handleNav(1)}
            disabled={isAtEnd}
            className="px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 press-effect"
            style={{ borderRadius: '4px', minWidth: '44px', minHeight: '44px' }}
            title="Next (Alt+Down)"
          >
            +1 &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
