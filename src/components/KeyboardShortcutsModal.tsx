'use client';

import React from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface ShortcutItem {
  label: string;
  keys: string | string[];
}

interface ShortcutSection {
  title: string;
  shortcuts: ShortcutItem[];
}

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// SHORTCUT DATA
// ============================================================================

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { label: 'Previous', keys: 'O' },
      { label: 'Next', keys: 'P' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { label: 'Submit', keys: ['Shift', 'Enter'] },
      { label: 'Trim Whitespace', keys: 'T' },
    ],
  },
];

const TOGGLE_SHORTCUTS: ShortcutItem[] = [
  { label: 'Reference Tools', keys: 'R' },
  { label: 'Source Preview', keys: 'E' },
  { label: 'Highlight Mode', keys: 'H' },
  { label: 'Game Mode', keys: 'G' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const KeyboardKey: React.FC<{ children: string; small?: boolean }> = ({ children, small }) => (
  <kbd
    className={`${
      small ? 'px-1.5 py-0.5 text-xs' : 'px-3 py-1.5 text-xs'
    } font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600`}
    style={{ borderRadius: small ? '2px' : '3px' }}
  >
    {children}
  </kbd>
);

const ShortcutRow: React.FC<{ label: string; keys: string | string[] }> = ({ label, keys }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    {Array.isArray(keys) ? (
      <div className="flex items-center gap-1">
        {keys.map((key, idx) => (
          <React.Fragment key={key}>
            <kbd
              className="px-2 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              style={{ borderRadius: '3px' }}
            >
              {key}
            </kbd>
            {idx < keys.length - 1 && <span className="text-xs text-gray-400">+</span>}
          </React.Fragment>
        ))}
      </div>
    ) : (
      <KeyboardKey>{keys}</KeyboardKey>
    )}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * KeyboardShortcutsModal
 *
 * Displays available keyboard shortcuts in a modal dialog.
 * Extracted from TranslationHelper for better organization.
 */
export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <div
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-2xl p-6 max-w-lg w-full mx-4"
        style={{ borderRadius: '3px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3
            id="keyboard-shortcuts-title"
            className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase"
          >
            Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close keyboard shortcuts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-2 gap-4">
          {SHORTCUT_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                {section.title}
              </h4>
              {section.shortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.label} label={shortcut.label} keys={shortcut.keys} />
              ))}
            </div>
          ))}

          {/* Toggles - Full Width */}
          <div className="space-y-3 col-span-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Toggles
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {TOGGLE_SHORTCUTS.map((shortcut) => (
                <ShortcutRow key={shortcut.label} label={shortcut.label} keys={shortcut.keys} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
          Press <KeyboardKey small>Esc</KeyboardKey> or click outside to close
        </p>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
