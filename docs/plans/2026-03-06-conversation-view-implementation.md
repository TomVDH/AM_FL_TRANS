# Conversation View — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a group-chat rendering mode to the translation app where dialogue appears as scrollable chat bubbles with an inline editing dock.

**Architecture:** New `ConversationView` component tree renders the same parallel arrays (`sourceTexts[]`, `translations[]`, `utterers[]`, `contextNotes[]`) as the standard view, but as a chat thread instead of a spotlight card. A `ConversationRow[]` intermediate model (via `useMemo`) preprocesses speaker identity, codex matching, colors, and status. The `EditDock` keeps textarea state local to prevent re-render storms.

**Tech Stack:** React 18, Tailwind CSS, Next.js (existing project). No new dependencies. Vitest available for tests.

**Design doc:** `docs/plans/2026-03-06-conversation-view-design.md` — the authoritative spec for all behavior. Read it first.

---

## Task 1: Speaker-Codex Utility

**Files:**
- Create: `src/utils/speakerCodexUtils.ts`

**Context:** The design doc specifies a `findCodexCharacter(speakerName, codexEntries)` function with a guarded matching cascade. The `CodexEntry` type is defined in `src/hooks/useCharacterHighlighting.ts` (lines 3-14). The existing `findCharacterMatches()` in that hook does text-range highlighting — this new function does simpler speaker-to-entry lookup. They're intentionally separate.

**Step 1: Create the utility file**

```ts
// src/utils/speakerCodexUtils.ts

interface CodexEntry {
  name: string;
  description: string;
  english: string;
  dutch: string;
  category?: string;
  nicknames?: string[];
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
}

/**
 * Normalize a name for comparison: collapse whitespace/hyphens, lowercase
 */
function normalizeName(name: string): string {
  return name.replace(/[-_\s]+/g, ' ').trim().toLowerCase();
}

/**
 * Find a codex CHARACTER entry matching a speaker name from xlsx data.
 *
 * Matching cascade (per design doc):
 * 1. Exact match on entry.english
 * 2. Exact match on entry.name
 * 3. Nickname match
 * 4. Substring (guarded): entry.english contains speakerName, both 4+ chars
 * 5. null
 */
export function findCodexCharacter(
  speakerName: string,
  codexEntries: CodexEntry[]
): CodexEntry | null {
  if (!speakerName || !codexEntries.length) return null;

  const normalizedSpeaker = normalizeName(speakerName);

  // 1. Exact match on english
  for (const entry of codexEntries) {
    if (normalizeName(entry.english) === normalizedSpeaker) return entry;
  }

  // 2. Exact match on name (codex identifier key)
  for (const entry of codexEntries) {
    if (normalizeName(entry.name) === normalizedSpeaker) return entry;
  }

  // 3. Nickname match
  for (const entry of codexEntries) {
    const nicknames = entry.nicknames || [];
    for (const nick of nicknames) {
      if (normalizeName(nick) === normalizedSpeaker) return entry;
    }
  }

  // 4. Substring (guarded: one-direction only, both 4+ chars)
  if (normalizedSpeaker.length >= 4) {
    for (const entry of codexEntries) {
      const normalizedEnglish = normalizeName(entry.english);
      if (normalizedEnglish.length >= 4 && normalizedEnglish.includes(normalizedSpeaker)) {
        return entry;
      }
    }
  }

  // 5. No match
  return null;
}

/**
 * Detect whether a row is a system message (non-dialogue).
 *
 * Per design doc: Column B keyword check overrides Column A pattern check.
 */
export function isSystemMessage(utterer: string, contextNote: string): boolean {
  // Column B keywords override everything
  const systemKeywords = [
    'title screen', 'button text', 'menu option', 'ui',
    'description', 'item description',
  ];
  const noteLower = (contextNote || '').toLowerCase();
  for (const keyword of systemKeywords) {
    if (noteLower.includes(keyword)) return true;
  }

  // Column A: not a SAY.*.*.SpeakerName pattern
  if (!utterer) return true;
  const parts = utterer.split('.');
  if (parts.length < 4 || !parts[0].startsWith('SAY')) return true;

  return false;
}

export type { CodexEntry };
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/utils/speakerCodexUtils.ts` or just `npm run build` and check for errors.

**Step 3: Commit**

```bash
git add src/utils/speakerCodexUtils.ts
git commit -m "feat(conversation): add speakerCodexUtils — speaker-to-codex matching utility"
```

---

## Task 2: Add `conversationMode` to Display Modes Hook

**Files:**
- Modify: `src/hooks/useDisplayModes.ts`

**Context:** All view mode toggles live here (darkMode, eyeMode, highlightMode, gamepadMode). Add `conversationMode` following the same pattern. When entering conversation mode, disable gamepad mode (they're mutually exclusive — one is pixel art, the other is chat bubbles).

**Step 1: Add conversationMode state and toggle**

In `src/hooks/useDisplayModes.ts`, add after line 19 (`gamepadMode` state):

```ts
const [conversationMode, setConversationMode] = useState(false);
```

Add a toggle function after `toggleGamepadMode` (after line 65):

```ts
const toggleConversationMode = () => {
  setConversationMode(prev => {
    const entering = !prev;
    if (entering) {
      // Exiting gamepad mode if active — mutually exclusive
      setGamepadMode(false);
    }
    return entering;
  });
};
```

Add to the return object (after line 84):

```ts
// In the State section:
conversationMode,

// In the Setters section:
setConversationMode,

// In the Toggle functions section:
toggleConversationMode,
```

**Step 2: Verify app still compiles**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/hooks/useDisplayModes.ts
git commit -m "feat(conversation): add conversationMode toggle to useDisplayModes"
```

---

## Task 3: Conversation View Animations in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Context:** The app has existing `@keyframes` (fadeIn, gradientShift, shimmer, etc.) in `globals.css`. Add conversation-view-specific animations following the same pattern. Per Coolio's review: bubble entrance, dock slide-up/down, popover bloom.

**Step 1: Add conversation view keyframes and classes**

Append to the end of `src/app/globals.css` (before any closing comments):

```css
/* === Conversation View === */

@keyframes bubbleIn {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes dockSlideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

@keyframes dockSlideDown {
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(100%); opacity: 0; }
}

@keyframes popoverBloom {
  from { opacity: 0; transform: scale(0.95) translateY(-4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-bubble-in {
  animation: bubbleIn 0.2s ease-out both;
}

.dock-enter {
  animation: dockSlideUp 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.dock-exit {
  animation: dockSlideDown 0.18s ease-in both;
}

.popover-bloom {
  animation: popoverBloom 0.15s ease-out both;
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(conversation): add chat bubble and dock animations to globals.css"
```

---

## Task 4: ChatBubble Component

**Files:**
- Create: `src/components/conversation/ChatBubble.tsx`

**Context:** This is the core visual component — one per dialogue row. It receives a `ConversationRow` object (defined in the design doc's Intermediate Data Model section). Speaker colors are left-border accents on neutral backgrounds (per accessibility review). Status uses icons + color (WCAG 1.4.1). The app's design language uses `borderRadius: '3px'` as inline style everywhere.

**Step 1: Create the component**

```tsx
// src/components/conversation/ChatBubble.tsx
'use client';

import React from 'react';

export interface ConversationRow {
  index: number;
  type: 'dialogue' | 'system';
  speakerName: string;
  sourceText: string;
  translation: string;
  isTranslated: boolean;
  isModified: boolean;
  codexEntry: {
    english: string;
    dutch: string;
    gender?: string;
    dialogueStyle?: string;
    bio?: string;
  } | null;
  color: string;
  isProtagonist: boolean;
  contextNote: string;
}

// Muted tint palette — left-border accent + subtle bg
// Index matches SPEAKER_COLORS order in ConversationThread
export const SPEAKER_PALETTE = [
  { bg: 'bg-blue-50 dark:bg-blue-950/30',     border: 'border-l-2 border-blue-400',     name: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30',   border: 'border-l-2 border-amber-500',    name: 'text-amber-700 dark:text-amber-300' },
  { bg: 'bg-violet-50 dark:bg-violet-950/30',  border: 'border-l-2 border-violet-400',   name: 'text-violet-700 dark:text-violet-300' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-l-2 border-emerald-400', name: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-rose-50 dark:bg-rose-950/30',     border: 'border-l-2 border-rose-400',     name: 'text-rose-700 dark:text-rose-300' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/30',     border: 'border-l-2 border-cyan-500',     name: 'text-cyan-700 dark:text-cyan-300' },
  { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-l-2 border-orange-400',   name: 'text-orange-700 dark:text-orange-300' },
  { bg: 'bg-teal-50 dark:bg-teal-950/30',     border: 'border-l-2 border-teal-400',     name: 'text-teal-700 dark:text-teal-300' },
] as const;

interface ChatBubbleProps {
  row: ConversationRow;
  colorIndex: number;
  isSelected: boolean;
  languageMode: 'EN' | 'NL' | 'EN+NL';
  animationDelay: number;
  onClick: (index: number) => void;
  onSpeakerClick?: (speakerName: string, event: React.MouseEvent) => void;
}

const GENDER_SYMBOLS: Record<string, string> = {
  male: '\u2642',
  female: '\u2640',
};

export const ChatBubble = React.memo(function ChatBubble({
  row,
  colorIndex,
  isSelected,
  languageMode,
  animationDelay,
  onClick,
  onSpeakerClick,
}: ChatBubbleProps) {
  const palette = row.isProtagonist ? null : SPEAKER_PALETTE[colorIndex % SPEAKER_PALETTE.length];
  const gender = row.codexEntry?.gender;
  const genderSymbol = gender ? GENDER_SYMBOLS[gender] || '' : '';

  // Status icon
  const statusIcon = row.isModified
    ? <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1.5" title="Unsaved changes" />
    : row.isTranslated
      ? <span className="ml-1.5 text-emerald-500" title="Translated">&#10003;</span>
      : null;

  // Bubble content based on language mode
  const renderContent = () => {
    const enText = row.sourceText;
    const nlText = row.isTranslated ? row.translation : null;
    const placeholder = !row.isTranslated && (languageMode === 'NL' || languageMode === 'EN+NL');

    switch (languageMode) {
      case 'EN':
        return <div className="text-[15px] leading-[1.55]">{enText}</div>;
      case 'NL':
        return nlText
          ? <div className="text-[15px] leading-[1.55]">{nlText}</div>
          : <div className="text-[13px] italic text-gray-400 dark:text-gray-500">— awaiting translation —</div>;
      case 'EN+NL':
        return (
          <>
            <div className="text-[15px] leading-[1.55]">{enText}</div>
            {nlText ? (
              <div className="mt-1.5 pt-1.5 border-t border-current/10 text-[13px] text-current/60 italic">
                {nlText}
              </div>
            ) : (
              <div className="mt-1.5 pt-1.5 border-t border-current/10 text-[13px] italic text-gray-400 dark:text-gray-500">
                — awaiting translation —
              </div>
            )}
          </>
        );
    }
  };

  // Protagonist vs other speaker styling
  const bubbleClasses = row.isProtagonist
    ? `bg-blue-50 dark:bg-blue-950/40 ${
        row.isTranslated
          ? 'ring-1 ring-blue-200 dark:ring-blue-800'
          : 'ring-1 ring-dashed ring-blue-300/50 dark:ring-blue-700/50'
      }`
    : `${palette!.bg} ${palette!.border} pl-3 ${
        !row.isTranslated ? 'border-dashed' : ''
      }`;

  return (
    <div
      className={`flex ${row.isProtagonist ? 'justify-end' : 'justify-start'} mb-3 animate-bubble-in`}
      style={{ animationDelay: `${Math.min(animationDelay, 400)}ms` }}
    >
      <div
        role="article"
        aria-label={`${row.speakerName}: ${row.sourceText}. ${
          row.isModified ? 'Unsaved changes' : row.isTranslated ? 'Translated' : 'Not yet translated'
        }.`}
        aria-selected={isSelected}
        tabIndex={0}
        className={`${row.isProtagonist ? 'max-w-[65%]' : 'max-w-[75%]'} px-4 py-3 cursor-pointer
          transition-all duration-150 scroll-mt-20
          ${bubbleClasses}
          ${isSelected
            ? 'ring-2 ring-offset-1 ring-gray-900 dark:ring-white scale-[1.01] shadow-md'
            : 'hover:scale-[1.005] hover:shadow-sm'
          }`}
        style={{ borderRadius: '4px' }}
        onClick={() => onClick(row.index)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(row.index); } }}
      >
        {/* Speaker name tag */}
        <div className="flex items-center mb-1">
          <button
            className={`text-[10px] font-semibold tracking-widest uppercase ${
              row.isProtagonist ? 'text-blue-600 dark:text-blue-400' : palette!.name
            } hover:underline`}
            onClick={(e) => { e.stopPropagation(); onSpeakerClick?.(row.speakerName, e); }}
            title={row.codexEntry ? `${row.codexEntry.english} → ${row.codexEntry.dutch}` : row.speakerName}
          >
            {row.speakerName}
            {genderSymbol && <span className="ml-1 text-[9px] opacity-60">{genderSymbol}</span>}
          </button>
          {statusIcon}
        </div>

        {/* Context note */}
        {row.contextNote && (
          <div className="text-[11px] italic text-gray-400 dark:text-gray-500 mb-1">
            [{row.contextNote}]
          </div>
        )}

        {/* Dialogue content */}
        {renderContent()}
      </div>
    </div>
  );
});
```

**Step 2: Verify it compiles**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/conversation/ChatBubble.tsx
git commit -m "feat(conversation): add ChatBubble component with speaker colors and status icons"
```

---

## Task 5: SystemMessage Component

**Files:**
- Create: `src/components/conversation/SystemMessage.tsx`

**Context:** Non-dialogue rows render as centered hairline-rule separators (per Coolio's review). Still clickable for translation via the dock.

**Step 1: Create the component**

```tsx
// src/components/conversation/SystemMessage.tsx
'use client';

import React from 'react';
import type { ConversationRow } from './ChatBubble';

interface SystemMessageProps {
  row: ConversationRow;
  isSelected: boolean;
  languageMode: 'EN' | 'NL' | 'EN+NL';
  onClick: (index: number) => void;
}

export const SystemMessage = React.memo(function SystemMessage({
  row,
  isSelected,
  languageMode,
  onClick,
}: SystemMessageProps) {
  const displayText = languageMode === 'NL' && row.isTranslated
    ? row.translation
    : row.sourceText || row.contextNote || '—';

  return (
    <div
      role="note"
      aria-label={`Stage direction: ${displayText}`}
      tabIndex={0}
      className={`flex items-center gap-3 my-3 cursor-pointer group transition-all duration-150
        ${isSelected ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
      onClick={() => onClick(row.index)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(row.index); } }}
    >
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      <span className={`text-[11px] font-medium italic whitespace-nowrap
        ${isSelected
          ? 'text-gray-600 dark:text-gray-300'
          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
        }`}>
        {displayText}
      </span>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>
  );
});
```

**Step 2: Commit**

```bash
git add src/components/conversation/SystemMessage.tsx
git commit -m "feat(conversation): add SystemMessage component with hairline-rule style"
```

---

## Task 6: EditDock Component

**Files:**
- Create: `src/components/conversation/EditDock.tsx`

**Context:** Fixed bottom panel. Per the cabinet review: textarea state is LOCAL (not wired to global `currentTranslation`). This prevents 149 ChatBubble re-renders on every keystroke. Syncs to global state only on submit. Auto-saves to local `translations[]` on dismiss/navigate. Uses the dock-enter/dock-exit animations from globals.css. Submit is disabled while `syncStatus === 'syncing'`.

**Step 1: Create the component**

```tsx
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
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg ${
        isVisible ? 'dock-enter' : 'dock-exit'
      }`}
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* Source line */}
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400" aria-readonly="true" aria-label="English source text (read only)">
          <span className="font-semibold text-gray-700 dark:text-gray-300 shrink-0">{row.speakerName}:</span>
          <span className="truncate" title={row.sourceText}>&ldquo;{row.sourceText}&rdquo;</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderRadius: '3px' }}
          rows={2}
          placeholder="Enter Dutch translation..."
        />

        {/* Bottom bar: nav arrows + submit hint */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => handleNav(-1)}
            disabled={isAtStart}
            className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderRadius: '3px', minWidth: '44px', minHeight: '44px' }}
            title="Previous (Alt+Up)"
          >
            &laquo; -1
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
            {syncStatus === 'syncing' && (
              <span className="text-amber-500 animate-pulse">Syncing...</span>
            )}
            <span>Shift+Enter to submit</span>
          </div>

          <button
            onClick={() => handleNav(1)}
            disabled={isAtEnd}
            className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderRadius: '3px', minWidth: '44px', minHeight: '44px' }}
            title="Next (Alt+Down)"
          >
            +1 &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/conversation/EditDock.tsx
git commit -m "feat(conversation): add EditDock with local textarea state and animation"
```

---

## Task 7: ConversationHeader Component

**Files:**
- Create: `src/components/conversation/ConversationHeader.tsx`

**Context:** Fixed top bar. Contains: sheet name, progress pips (segmented per-row, per Coolio), language toggle (sliding pill segmented control), POV selector dropdown, exit button. The header uses the app's `borderRadius: '3px'` pattern.

**Step 1: Create the component**

```tsx
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-3">

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
```

**Step 2: Commit**

```bash
git add src/components/conversation/ConversationHeader.tsx
git commit -m "feat(conversation): add ConversationHeader with progress pips and sliding language toggle"
```

---

## Task 8: ConversationThread Component

**Files:**
- Create: `src/components/conversation/ConversationThread.tsx`

**Context:** Scrollable container rendering `ChatBubble` and `SystemMessage` components. Uses the `ConversationRow[]` model. Handles scroll-into-view for selected bubbles and the `role="feed"` ARIA pattern.

**Step 1: Create the component**

```tsx
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
```

**Step 2: Commit**

```bash
git add src/components/conversation/ConversationThread.tsx
git commit -m "feat(conversation): add ConversationThread with scroll-into-view and ARIA feed role"
```

---

## Task 9: ConversationView — Top-Level Container

**Files:**
- Create: `src/components/ConversationView.tsx`

**Context:** This is the orchestrator. It receives the same props TranslationHelper passes to the standard view, builds the `ConversationRow[]` model via `useMemo`, manages selected bubble state, language mode, protagonist selection, and wires everything together. It calls `handleSubmitWithSync()` on submit and manages auto-advance logic. The `handleSubmitWithSync` is defined in `TranslationHelper.tsx` (not in a hook), so it's passed as a prop.

**Step 1: Create the component**

```tsx
// src/components/ConversationView.tsx
'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { extractSpeakerName } from '@/utils/speakerNameUtils';
import { findCodexCharacter, isSystemMessage, type CodexEntry } from '@/utils/speakerCodexUtils';
import { ConversationHeader } from './conversation/ConversationHeader';
import { ConversationThread } from './conversation/ConversationThread';
import { EditDock } from './conversation/EditDock';
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
      for (const [name, count] of counts) {
        if (count > maxCount && name !== 'Speaker') { maxCount = count; maxName = name; }
      }
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
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/ConversationView.tsx
git commit -m "feat(conversation): add ConversationView orchestrator with ConversationRow model"
```

---

## Task 10: Wire Into TranslationHelper

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

**Context:** This is the integration point. We need to:
1. Import `conversationMode` and `toggleConversationMode` from `useDisplayModes`
2. Add a chat-bubble icon button to the mode toggle button bar (after the Live button)
3. Wrap the entire standard view in a `{!conversationMode && (...)}` conditional
4. Render `<ConversationView>` when `conversationMode` is true, passing all needed props
5. The `ConversationView` import is from `./ConversationView`

**Step 1: Add import at top of file**

After existing imports (~line 1-20), add:

```tsx
import { ConversationView } from './ConversationView';
```

**Step 2: Destructure conversationMode from useDisplayModes**

In the hook call (~line 108 area where `useDisplayModes` is destructured), add `conversationMode` and `toggleConversationMode`:

```tsx
const { darkMode, eyeMode, highlightMode, gamepadMode, conversationMode, toggleConversationMode, ... } = useDisplayModes();
```

**Step 3: Add chat button to mode toggle button bar**

Find the mode toggle button bar (the `<div className="flex items-center gap-1 bg-white dark:bg-gray-800...">` that contains the Gamepad, Highlight, Reference, Output, Live buttons). After the Live button and before the closing `</div>` of the button group, add:

```tsx
{/* Conversation Mode */}
<button
  onClick={toggleConversationMode}
  disabled={!isStarted || sourceTexts.length === 0}
  className={`p-1.5 transition-all duration-150 ${
    conversationMode
      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
      : !isStarted || sourceTexts.length === 0
        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
  }`}
  style={{ borderRadius: '2px' }}
  title="Conversation View"
>
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
  </svg>
</button>
```

**Step 4: Conditional rendering**

Wrap the existing main content (the two-column grid that renders source card + textarea) in `{!conversationMode && (...)}`. Then after that conditional, add:

```tsx
{conversationMode && (
  <ConversationView
    sourceTexts={sourceTexts}
    translations={translations}
    originalTranslations={originalTranslations}
    utterers={utterers}
    contextNotes={contextNotes}
    currentIndex={currentIndex}
    setCurrentIndex={setCurrentIndex}
    setCurrentTranslation={setCurrentTranslation}
    handleSubmitWithSync={handleSubmitWithSync}
    updateTranslationAtIndex={updateTranslationAtIndex}
    syncStatus={syncStatus}
    selectedSheet={selectedSheet}
    characterData={characterData}
    highlightMode={highlightMode}
    onExit={toggleConversationMode}
  />
)}
```

**Important:** `characterData` comes from `useCharacterHighlighting()` which is already called in TranslationHelper (~line 112). `updateTranslationAtIndex` comes from `useTranslationState`. Check these are destructured from their hooks; if `updateTranslationAtIndex` is not, it needs to be added to the destructuring.

**Step 5: Disable global keyboard shortcuts when in conversation mode**

In the `handleKeyDown` useEffect (~line 597), add at the very top of the handler:

```ts
// Don't process standard shortcuts in conversation mode — ConversationView has its own
if (conversationMode) return;
```

**Step 6: Verify build and test manually**

Run: `npm run build` — should compile clean.
Run: `npm run dev` — load an xlsx file, click the chat bubble icon. The conversation view should appear.

**Step 7: Commit**

```bash
git add src/components/TranslationHelper.tsx
git commit -m "feat(conversation): wire ConversationView into TranslationHelper with mode toggle"
```

---

## Task 11: Refactor inline trimSpeakerName

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

**Context:** Per the design doc review, the inline `trimSpeakerName` function (~line 417) should use the utility version. Both produce the same output for well-formed strings, but using the utility is cleaner.

**Step 1: Replace the inline function**

Find the `trimSpeakerName` function definition (~line 417-421) and replace it with a delegation to the imported utility:

```tsx
// Use the utility version instead of inline implementation
const trimSpeakerName = (speaker: string | undefined): string => {
  if (!speaker) return '';
  return extractSpeakerName(speaker);
};
```

Note: `extractSpeakerName` is already imported via `speakerNameUtils.ts` in the hooks. Check if there's a direct import in TranslationHelper — if not, add:

```tsx
import { extractSpeakerName } from '@/utils/speakerNameUtils';
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/TranslationHelper.tsx
git commit -m "refactor: replace inline trimSpeakerName with extractSpeakerName utility"
```

---

## Task 12: Visual Polish and Manual QA

**Files:** No new files — this is testing and fixing.

**Step 1: Start the dev server and load test data**

Run: `npm run dev`

Load an xlsx file with dialogue. Click the conversation view button.

**Step 2: Verify these behaviors work (checklist)**

- [ ] Bubbles render with speaker names and color-coded left borders
- [ ] Protagonist bubbles appear on the right side
- [ ] System messages appear as centered hairline rules
- [ ] Context notes show as italic text inside bubbles
- [ ] Language toggle cycles through EN / NL / EN+NL
- [ ] POV dropdown lists all speakers and defaults to Foal/{$NewName}
- [ ] Clicking a bubble opens the EditDock with slide-up animation
- [ ] Typing in the dock does NOT cause the thread to re-render (check React DevTools)
- [ ] Shift+Enter submits and auto-advances to next untranslated
- [ ] Alt+Up/Down navigates between bubbles
- [ ] Escape closes the dock (does NOT exit conversation mode)
- [ ] X button exits conversation mode and returns to standard view
- [ ] Progress pips update as translations are submitted
- [ ] Status icons show: checkmark (translated), dashed (untranslated), amber pulse (modified)
- [ ] Scroll-to-first-untranslated on initial mount
- [ ] 'L' key cycles language mode (when not in textarea)
- [ ] Standard mode keyboard shortcuts are disabled during conversation mode

**Step 3: Fix any issues found during QA**

Address bugs as they come up. Each fix should be a small commit.

**Step 4: Final commit**

```bash
git add -A
git commit -m "fix(conversation): polish and QA fixes from manual testing"
```

---

## Task 13: CharacterInfoPopover (v1 polish — optional)

**Files:**
- Create: `src/components/conversation/CharacterInfoPopover.tsx`
- Modify: `src/components/ConversationView.tsx`

**Context:** Per design doc §6, clicking a speaker name tag opens a floating character info card. This reuses the content from `CharacterInfoCard.tsx` but in a popover positioned near the clicked element. Uses the `popover-bloom` animation from globals.css. This is lower-priority polish — skip if time is tight.

**Step 1: Create the popover**

```tsx
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
  const hasContent = character.gender || character.dialogueStyle || character.bio;
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

        {/* Dialogue style */}
        {character.dialogueStyle && (
          <div className="text-[11px] text-purple-800 dark:text-purple-300 mb-1.5 leading-relaxed">
            {character.dialogueStyle}
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
```

**Step 2: Wire into ConversationView**

In `ConversationView.tsx`, add state for the popover:

```tsx
const [popoverState, setPopoverState] = useState<{ speakerName: string; rect: DOMRect } | null>(null);
```

Add a handler:

```tsx
const handleSpeakerClick = useCallback((speakerName: string, event: React.MouseEvent) => {
  if (!highlightMode) return;
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  setPopoverState({ speakerName, rect });
}, [highlightMode]);
```

Pass `onSpeakerClick={handleSpeakerClick}` to `ConversationThread`.

Render the popover:

```tsx
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
```

**Step 3: Commit**

```bash
git add src/components/conversation/CharacterInfoPopover.tsx src/components/ConversationView.tsx
git commit -m "feat(conversation): add CharacterInfoPopover on speaker name click"
```

---

## Summary

| Task | Component | Priority |
|---|---|---|
| 1 | speakerCodexUtils.ts | Core utility |
| 2 | useDisplayModes + conversationMode | Core toggle |
| 3 | globals.css animations | Core visual |
| 4 | ChatBubble.tsx | Core component |
| 5 | SystemMessage.tsx | Core component |
| 6 | EditDock.tsx | Core component |
| 7 | ConversationHeader.tsx | Core component |
| 8 | ConversationThread.tsx | Core component |
| 9 | ConversationView.tsx | Core orchestrator |
| 10 | TranslationHelper.tsx wiring | Core integration |
| 11 | trimSpeakerName refactor | Cleanup |
| 12 | Manual QA | Verification |
| 13 | CharacterInfoPopover | Polish (optional) |

Tasks 1-10 are the MVP. Task 11 is a quick cleanup. Task 12 is essential QA. Task 13 is polish that can ship later.
