'use client';

import React, { useEffect, useRef } from 'react';

interface FloatingShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function FloatingShortcutsPanel({ isOpen, onClose, anchorRef }: FloatingShortcutsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          anchorRef?.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const kbdClass = "px-2 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600";

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg p-4 w-80"
      style={{ borderRadius: '3px' }}
      role="dialog"
      aria-label="Keyboard shortcuts"
    >
      <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Keyboard Shortcuts</h3>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Navigation */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Navigation</h4>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Previous</span>
            <kbd className={kbdClass} style={{ borderRadius: '3px' }}>O</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Next</span>
            <kbd className={kbdClass} style={{ borderRadius: '3px' }}>P</kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Actions</h4>
          <div className="flex items-center justify-between gap-1">
            <span className="text-gray-700 dark:text-gray-300">Submit</span>
            <div className="flex items-center gap-0.5">
              <kbd className={kbdClass} style={{ borderRadius: '3px' }}>Shift</kbd>
              <span className="text-gray-400">+</span>
              <kbd className={kbdClass} style={{ borderRadius: '3px' }}>Enter</kbd>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Trim</span>
            <kbd className={kbdClass} style={{ borderRadius: '3px' }}>T</kbd>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-gray-700 dark:text-gray-300">Insert AI</span>
            <div className="flex items-center gap-0.5">
              <kbd className={kbdClass} style={{ borderRadius: '3px' }}>&#8984;</kbd>
              <span className="text-gray-400">+</span>
              <kbd className={kbdClass} style={{ borderRadius: '3px' }}>I</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Toggles</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Reference</span>
            <kbd className={kbdClass} style={{ borderRadius: '3px' }}>R</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Preview</span>
            <kbd className={kbdClass} style={{ borderRadius: '3px' }}>E</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Highlight</span>
            <kbd className={kbdClass} style={{ borderRadius: '3px' }}>H</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">AI Suggest</span>
            <kbd className={kbdClass} style={{ borderRadius: '3px' }}>A</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Gamepad</span>
            <kbd className={kbdClass} style={{ borderRadius: '3px' }}>G</kbd>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500 text-center">
        Press <kbd className="px-1 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '2px' }}>Esc</kbd> or click outside to close
      </p>
    </div>
  );
}
