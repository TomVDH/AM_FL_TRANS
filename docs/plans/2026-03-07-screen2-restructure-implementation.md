# Screen 2: Translation Workspace Restructure — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the Screen 2 translation workspace: two-row header with pill buttons, rebalanced columns (source minimal / translation card), embedded toolbar in textarea, consolidated 4-tab panel below workspace, floating keyboard shortcuts, AI suggestion moved to left column with Cmd+I insert.

**Architecture:** Extract new components (WorkspaceToolsPanel, FloatingShortcutsPanel) from existing inline JSX. Restructure TranslationHelper.tsx render order: header → workspace grid → consolidated panel. Move AI suggestion from right column to left column. Embed tool toggles + submit into textarea border toolbar.

**Tech Stack:** React, Tailwind CSS. No new dependencies. Reuses existing child components (ReferenceToolsPanel, QuickReferenceBar).

**Design Doc:** `docs/plans/2026-03-07-screen2-restructure-design.md`

---

## Task 1: Create WorkspaceToolsPanel Component

The consolidated 4-tab panel that replaces 4 separate below-workspace sections: Reference Tools, Quick Ref, Output, and Bulk Translate.

**Files:**
- Create: `src/components/WorkspaceToolsPanel.tsx`

### Step 1: Create the component file

Create `src/components/WorkspaceToolsPanel.tsx`:

```tsx
'use client';

import React, { useState, useEffect } from 'react';

type TabId = 'reference' | 'quickref' | 'output' | 'bulk';

interface WorkspaceToolsPanelProps {
  // Which tab to force-open (set by R/O toggles in toolbar)
  forceTab?: TabId | null;
  onForceTabHandled?: () => void;

  // Reference tab content (render prop)
  renderReference: () => React.ReactNode;
  // Quick Ref tab content (render prop)
  renderQuickRef: () => React.ReactNode;
  // Output tab content (render prop)
  renderOutput: () => React.ReactNode;
  // Bulk Translate tab content (render prop)
  renderBulkTranslate: () => React.ReactNode;

  // Summary badges
  referenceCount?: number;
  memoryMatchCount?: number;
  outputCount?: number;
  bulkStatus?: string;
}

export default function WorkspaceToolsPanel({
  forceTab,
  onForceTabHandled,
  renderReference,
  renderQuickRef,
  renderOutput,
  renderBulkTranslate,
  referenceCount,
  memoryMatchCount,
  outputCount,
  bulkStatus,
}: WorkspaceToolsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('workspaceToolsTab') as TabId) || 'reference';
    }
    return 'reference';
  });

  // Persist active tab
  useEffect(() => {
    localStorage.setItem('workspaceToolsTab', activeTab);
  }, [activeTab]);

  // Handle force-open from R/O toggles
  useEffect(() => {
    if (forceTab) {
      setIsExpanded(true);
      setActiveTab(forceTab);
      onForceTabHandled?.();
    }
  }, [forceTab, onForceTabHandled]);

  const tabs: { id: TabId; label: string; badge?: string }[] = [
    { id: 'reference', label: 'Reference', badge: referenceCount ? String(referenceCount) : undefined },
    { id: 'quickref', label: 'Quick Ref', badge: memoryMatchCount ? String(memoryMatchCount) : undefined },
    { id: 'output', label: 'Output', badge: outputCount ? String(outputCount) : undefined },
    { id: 'bulk', label: 'Bulk Translate', badge: bulkStatus || undefined },
  ];

  // Build collapsed summary
  const summaryParts: string[] = [];
  if (referenceCount) summaryParts.push(`${referenceCount} refs`);
  if (memoryMatchCount) summaryParts.push(`${memoryMatchCount} matches`);
  if (outputCount) summaryParts.push(`${outputCount} entries`);
  const summaryText = summaryParts.length > 0 ? summaryParts.join(' · ') : 'collapsed';

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
      {/* Collapsed / Expand Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-1.5 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-sm font-bold tracking-tight">Tools & Data</span>
          {!isExpanded && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {summaryText}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded: Tab Bar + Content */}
      {isExpanded && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" style={{ borderRadius: '3px' }}>
          {/* Tab Bar */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'reference' && renderReference()}
            {activeTab === 'quickref' && renderQuickRef()}
            {activeTab === 'output' && renderOutput()}
            {activeTab === 'bulk' && renderBulkTranslate()}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 2: Verify build

Run: `npx tsc --noEmit`
Expected: No errors.

### Step 3: Commit

```bash
git add src/components/WorkspaceToolsPanel.tsx
git commit -m "feat: create WorkspaceToolsPanel with 4-tab consolidated interface"
```

---

## Task 2: Create FloatingShortcutsPanel Component

Replace the full-screen keyboard shortcuts modal with a floating panel.

**Files:**
- Create: `src/components/FloatingShortcutsPanel.tsx`

### Step 1: Create the component file

Create `src/components/FloatingShortcutsPanel.tsx`:

```tsx
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
              <kbd className={kbdClass} style={{ borderRadius: '3px' }}>⌘</kbd>
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
```

### Step 2: Verify build

Run: `npx tsc --noEmit`
Expected: No errors.

### Step 3: Commit

```bash
git add src/components/FloatingShortcutsPanel.tsx
git commit -m "feat: create FloatingShortcutsPanel as dropdown replacement for modal"
```

---

## Task 3: Restructure Header — Two-Row Layout with Pill Buttons

Replace the single-row header with a two-row layout. Row 1: context + utilities. Row 2: navigation + view switcher.

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

### Step 1: Add imports

At the top of `TranslationHelper.tsx`, after the existing imports (around line 32), add:

```tsx
import FloatingShortcutsPanel from './FloatingShortcutsPanel';
import WorkspaceToolsPanel from './WorkspaceToolsPanel';
```

Also add a ref for the keyboard shortcuts anchor button. Find the existing state declarations area (around line 540-560) and add:

```tsx
const keyboardShortcutsRef = useRef<HTMLButtonElement>(null);
```

### Step 2: Replace the header section

Find the current header (lines 935-1134 approximately):

```tsx
        {/* Header — compact single-line status bar */}
        <div className="flex items-center justify-between py-2 px-1 mb-3">
```

Replace the **entire header** `<div>` (from line 935 through the closing `</div>` at line 1135) with this two-row header:

```tsx
        {/* Header — Two-Row Bar */}
        <div className="mb-3 space-y-2">
          {/* Row 1: Context + Utilities */}
          <div className="flex items-center justify-between py-1.5 px-1">
            {/* Left: Back + file/sheet/cell context */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={handleBackToSetup}
                className="group relative h-7 px-2.5 flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                style={{ borderRadius: '3px' }}
                aria-label="Back to setup"
                title="Back to setup"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs font-medium">Back</span>
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {loadedFileName || 'Untitled'}
                {selectedSheet && <span className="text-gray-400 dark:text-gray-500"> · {selectedSheet}</span>}
                <span className="text-gray-400 dark:text-gray-500"> · {getCellLocation(currentIndex)}</span>
              </span>
            </div>

            {/* Center-right: Timer */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimerPause}
                className="flex items-center gap-1.5 text-xs tabular-nums"
                title={timerRunning ? 'Pause timer' : 'Timer starts on first translation'}
              >
                <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`font-mono font-bold ${timerRunning ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                  {elapsedFormatted}
                </span>
              </button>
            </div>

            {/* Right: Utility pill buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Filter & Jump */}
              <div className="relative">
                <button
                  onClick={() => setAccordionStates(prev => ({ ...prev, navigation: !prev.navigation }))}
                  className="group relative h-7 px-2.5 flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                  style={{ borderRadius: '3px' }}
                  aria-label="Filter and jump"
                  title="Filter & Jump"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-xs font-medium">Filter</span>
                </button>

                {/* Filter popover — KEEP EXISTING POPOVER CONTENT FROM lines 975-1105 */}
                {accordionStates.navigation && (
                  <div className="absolute top-full right-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50 min-w-[200px]" style={{ borderRadius: '3px' }}>
                    {/* === PASTE EXISTING FILTER + JUMP POPOVER CONTENT HERE === */}
                    {/* This is the content from the current lines 978-1103 */}
                    {/* Filter Section */}
                    <div className="mb-3">
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Filter</div>
                      <div className="space-y-1">
                        <button
                          onClick={() => { setFilterStatus('all'); }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${
                            filterOptions.status === 'all'
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <span>All</span>
                          <span className="text-gray-400 dark:text-gray-500">{filterStats.all}</span>
                        </button>
                        <button
                          onClick={() => { setFilterStatus('completed'); }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${
                            filterOptions.status === 'completed'
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Done
                          </span>
                          <span className="text-green-600 dark:text-green-400">{filterStats.completed}</span>
                        </button>
                        <button
                          onClick={() => { setFilterStatus('blank'); }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium transition-colors ${
                            filterOptions.status === 'blank'
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            Blank
                          </span>
                          <span className="text-red-600 dark:text-red-400">{filterStats.blank}</span>
                        </button>
                      </div>
                    </div>

                    {/* Jump Section */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Jump</div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <button onClick={() => { const i = Math.max(0, currentIndex - 5); setCurrentIndex(i); setCurrentTranslation(translations[i] === '[BLANK, REMOVE LATER]' ? '' : translations[i] || ''); }} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" style={{ borderRadius: '2px' }}>-5</button>
                        <button onClick={() => { const i = Math.max(0, currentIndex - 1); setCurrentIndex(i); setCurrentTranslation(translations[i] === '[BLANK, REMOVE LATER]' ? '' : translations[i] || ''); }} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" style={{ borderRadius: '2px' }}>-1</button>
                        <input type="number" min={startRow} max={startRow + sourceTexts.length - 1} value={startRow + currentIndex} onChange={(e) => { const r = parseInt(e.target.value); if (r >= startRow && r < startRow + sourceTexts.length) jumpToRow(r); }} className="w-14 px-1 py-1 text-[10px] text-center font-bold border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" style={{ borderRadius: '2px' }} />
                        <button onClick={() => { const i = Math.min(sourceTexts.length - 1, currentIndex + 1); setCurrentIndex(i); setCurrentTranslation(translations[i] === '[BLANK, REMOVE LATER]' ? '' : translations[i] || ''); }} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" style={{ borderRadius: '2px' }}>+1</button>
                        <button onClick={() => { const i = Math.min(sourceTexts.length - 1, currentIndex + 5); setCurrentIndex(i); setCurrentTranslation(translations[i] === '[BLANK, REMOVE LATER]' ? '' : translations[i] || ''); }} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" style={{ borderRadius: '2px' }}>+5</button>
                      </div>
                      {excelSheets.length > 1 && (
                        <select value={selectedSheet} onChange={(e) => handleSheetChange(e.target.value)} className="w-full p-1 text-[10px] border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" style={{ borderRadius: '2px' }}>
                          {excelSheets.map(sheet => (<option key={sheet} value={sheet}>{sheet}</option>))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Keyboard Shortcuts */}
              <div className="relative">
                <button
                  ref={keyboardShortcutsRef}
                  onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                  className="group relative h-7 px-2.5 flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                  style={{ borderRadius: '3px' }}
                  aria-label="Keyboard shortcuts"
                  title="Keyboard shortcuts"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </button>
                <FloatingShortcutsPanel
                  isOpen={showKeyboardShortcuts}
                  onClose={() => setShowKeyboardShortcuts(false)}
                  anchorRef={keyboardShortcutsRef}
                />
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="group relative h-7 px-2.5 flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                style={{ borderRadius: '3px' }}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Navigation + View Modes */}
          <div className="flex items-center gap-3 px-1">
            {/* Previous */}
            <button
              onClick={handlePreviousWithSync}
              disabled={currentIndex === 0 || syncStatus === 'syncing'}
              className="p-1.5 text-gray-500 hover:text-gray-700 disabled:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:text-gray-600 transition-colors disabled:cursor-not-allowed shrink-0"
              aria-label="Previous entry"
              title="Previous (←)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Hybrid Progress Bar — KEEP EXISTING from lines 1174-1222 */}
            <div
              role="progressbar"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={sourceTexts.length}
              aria-label={`Translation progress: ${currentIndex + 1} of ${sourceTexts.length}`}
              className="relative flex-1 h-2 bg-gray-100 dark:bg-gray-800 overflow-hidden"
              style={{ borderRadius: '3px' }}
            >
              {sourceTexts.length <= 50 ? (
                <div className="absolute inset-0 flex">
                  {sourceTexts.map((_, index) => {
                    const isCompleted = index < currentIndex;
                    const isBlank = translations[index] === '' || translations[index] === '[BLANK, REMOVE LATER]';
                    const isCurrent = index === currentIndex;
                    return (
                      <div key={index} role="presentation" className="relative h-full" style={{ width: `${100 / sourceTexts.length}%` }}>
                        <div className={`absolute inset-0 ${isCompleted ? isBlank ? 'bg-red-400 dark:bg-red-600' : 'bg-green-400 dark:bg-green-500' : isCurrent ? 'bg-gray-300 dark:bg-gray-600' : ''}`} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                (() => {
                  const completed = translations.slice(0, currentIndex).filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length;
                  const blank = currentIndex - completed;
                  const total = sourceTexts.length;
                  return (
                    <>
                      <div className="absolute inset-y-0 left-0 bg-green-400 dark:bg-green-500 transition-all duration-300" style={{ width: `${(completed / total) * 100}%` }} />
                      <div className="absolute inset-y-0 bg-red-400 dark:bg-red-600 transition-all duration-300" style={{ left: `${(completed / total) * 100}%`, width: `${(blank / total) * 100}%` }} />
                      <div className="absolute inset-y-0 bg-gray-300 dark:bg-gray-600 transition-all duration-300" style={{ left: `${(currentIndex / total) * 100}%`, width: `${Math.max(1 / total, 0.5) * 100}%` }} />
                    </>
                  );
                })()
              )}
            </div>

            {/* Counter */}
            <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums shrink-0">
              {currentIndex + 1}/{sourceTexts.length} · {sourceTexts.length > 0 ? Math.round((translations.filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length / sourceTexts.length) * 100) : 0}%
            </span>

            {/* Next */}
            <button
              onClick={() => {
                if (currentIndex < sourceTexts.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setCurrentTranslation(translations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex + 1] || '');
                }
              }}
              disabled={currentIndex >= sourceTexts.length - 1}
              className="p-1.5 text-gray-500 hover:text-gray-700 disabled:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:text-gray-600 transition-colors disabled:cursor-not-allowed shrink-0"
              aria-label="Next entry"
              title="Next (→)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* View Switcher with icons */}
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-0.5" style={{ borderRadius: '3px' }}>
              <button
                onClick={() => { if (gamepadMode) toggleGamepadMode(); if (conversationMode) toggleConversationMode(); }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors ${!gamepadMode && !conversationMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                style={{ borderRadius: '2px' }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Standard
              </button>
              <button
                onClick={() => { if (!gamepadMode) toggleGamepadMode(); if (conversationMode) toggleConversationMode(); }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors ${gamepadMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                style={{ borderRadius: '2px' }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Gamepad
              </button>
              <button
                onClick={() => { if (gamepadMode) toggleGamepadMode(); if (!conversationMode) toggleConversationMode(); }}
                disabled={!isStarted || sourceTexts.length === 0}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors ${conversationMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:text-gray-300 dark:disabled:text-gray-600'}`}
                style={{ borderRadius: '2px' }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Conv
              </button>
            </div>
          </div>
        </div>
```

### Step 3: Delete the old standalone sections that are now in the header

After adding the two-row header above, **delete** these sections which are now integrated into the header:

1. **Old Navigation Row** (was lines 1160-1244) — progress bar + prev/next buttons. Now in Row 2.
2. **Old View Switcher** (was lines 1246-1273) — segmented control. Now in Row 2 right.

**Keep** the Column Headers (lines 1275-1283) — they stay per design.

### Step 4: Delete the old keyboard shortcuts modal

Delete the entire keyboard shortcuts modal (lines 839-930):

```tsx
      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 ...">
          ...
        </div>
      )}
```

This is now replaced by the FloatingShortcutsPanel embedded in the header.

### Step 5: Verify build

Run: `npm run build`
Expected: Build succeeds.

### Step 6: Commit

```bash
git add src/components/TranslationHelper.tsx
git commit -m "refactor: two-row header with pill buttons, floating shortcuts, icons in view switcher"
```

---

## Task 4: Restructure Left Column — Minimal Source, AI Suggestion Moved Here

Remove card styling from left column. Simplify header row. Truncate previews to one line. Move AI suggestion from right column to below source text.

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

### Step 1: Remove card wrapper from left column

Find the left column card wrapper (around line 1291):

```tsx
            <div
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 space-y-4 shadow-sm transition-all duration-300 flex-1 flex flex-col opacity-100"
              style={{ borderRadius: '3px' }}
            >
```

Replace with (no card — minimal):

```tsx
            <div className="space-y-4 flex-1 flex flex-col">
```

Also remove the corresponding closing tags for the card wrapper that are no longer needed.

### Step 2: Simplify n-1 preview to one-line truncated

Find the n-1 preview button (around line 1447). Replace the entire `<button>` block with a simpler one-line version:

```tsx
                  {currentIndex > 0 && sourceTexts[currentIndex - 1] && (
                    <button
                      onClick={() => {
                        setCurrentIndex(currentIndex - 1);
                        setCurrentTranslation(translations[currentIndex - 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex - 1] || '');
                      }}
                      className="w-full text-left py-1 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                    >
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate block group-hover:text-gray-500 dark:group-hover:text-gray-400">
                        ← {translationColumn}{startRow + currentIndex - 1} {trimSpeakerName(utterers[currentIndex - 1]) || ''} — {sourceTexts[currentIndex - 1]}
                      </span>
                    </button>
                  )}
```

### Step 3: Simplify n+1 preview to one-line truncated

Find the n+1 preview button (around line 1598). Replace with:

```tsx
                  {currentIndex < sourceTexts.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentIndex(currentIndex + 1);
                        setCurrentTranslation(translations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex + 1] || '');
                      }}
                      className="w-full text-left py-1 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                    >
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate block group-hover:text-gray-500 dark:group-hover:text-gray-400">
                        → {translationColumn}{startRow + currentIndex + 1} {trimSpeakerName(utterers[currentIndex + 1]) || ''} — {sourceTexts[currentIndex + 1]}
                      </span>
                    </button>
                  )}
```

### Step 4: Simplify source header row

Find the source header row (around line 1481). Remove the copy/search buttons from the right side. Keep only the cell ref + speaker name. Replace:

```tsx
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
                      <div className="flex items-center gap-2">
                        {/* cell ref + speaker ... */}
                      </div>
                      <div className="flex items-center gap-1">
                        {/* copy + search buttons */}
                      </div>
                    </div>
```

With a simplified single-line header (no copy/search buttons):

```tsx
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-700/50">
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500"
                        style={{ borderRadius: '2px', fontFamily: 'monospace' }}
                        title={`Excel Row ${startRow + currentIndex}`}
                      >
                        {translationColumn}{startRow + currentIndex}
                      </span>
                      {/* Speaker name with codex popover — KEEP EXISTING LOGIC */}
                      {currentSpeakerCodexEntry ? (
                        <button
                          className="text-sm font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 underline decoration-purple-300 dark:decoration-purple-600 underline-offset-2 transition-colors duration-150 cursor-pointer"
                          onClick={(e) => {
                            const rect = (e.target as HTMLElement).getBoundingClientRect();
                            const speakerName = trimSpeakerName(utterers[currentIndex]);
                            if (codexPopover?.characterName === speakerName) { setCodexPopover(null); } else { setCodexPopover({ characterName: speakerName, rect }); }
                          }}
                          title={`View codex: ${currentSpeakerCodexEntry.english} → ${currentSpeakerCodexEntry.dutch}`}
                          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }}
                        >
                          {trimSpeakerName(utterers[currentIndex])}
                          <span className="ml-1 text-[8px] text-purple-400 dark:text-purple-500 opacity-70">▼</span>
                        </button>
                      ) : (
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {trimSpeakerName(utterers[currentIndex]) || 'Speaker'}
                        </span>
                      )}
                    </div>
```

### Step 5: Add AI suggestion below source text in left column

After the source text spotlight `</div>` (around line 1595, after the Dutch translation preview), and before the n+1 preview, add the AI suggestion display:

```tsx
                    {/* AI Suggestion — reference material in left column */}
                    {aiSuggestEnabled && (isLoadingAiSuggestion || isUpgradingAiSuggestion || aiSuggestion || aiSuggestError) && (
                      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700/50">
                        {isLoadingAiSuggestion && !isUpgradingAiSuggestion ? (
                          <div className="inline-flex items-center gap-2 px-2 py-1 text-gray-400 dark:text-gray-500 text-xs animate-pulse">
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            AI generating...
                          </div>
                        ) : aiSuggestError ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 text-red-500 dark:text-red-400 text-xs">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            {aiSuggestError}
                          </div>
                        ) : aiSuggestion ? (
                          <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">AI:</span>
                            <button
                              onClick={() => { insertTranslatedSuggestion(aiSuggestion); clearAiSuggestion(); }}
                              className="flex-1 text-left hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer italic"
                              title="Click to insert (⌘I)"
                            >
                              "{aiSuggestion}"
                            </button>
                            <span className="shrink-0 px-1 py-0.5 text-[9px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500" style={{ borderRadius: '2px' }}>
                              {aiSuggestionModel || 'haiku'}
                            </span>
                            {aiSuggestionModel === 'haiku' && !isUpgradingAiSuggestion && (
                              <button onClick={(e) => { e.stopPropagation(); upgradeAiSuggestion(); }} className="shrink-0 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Upgrade to Sonnet">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>
                              </button>
                            )}
                            {isUpgradingAiSuggestion && (
                              <div className="shrink-0 p-0.5 text-gray-400 animate-pulse">
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                              </div>
                            )}
                            <button onClick={clearAiSuggestion} className="shrink-0 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Dismiss">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )}
```

### Step 6: Delete AI suggestion from right column

Remove the AI suggestion block from the right column (was lines 1692-1733). This content has moved to the left column.

### Step 7: Commit

```bash
git add src/components/TranslationHelper.tsx
git commit -m "refactor: minimal source column, AI suggestion moved to left, simplified previews"
```

---

## Task 5: Restructure Right Column — Elevated Card with Embedded Toolbar

Make the right column the dominant workspace with an embedded toolbar (toggles + modified + submit) in the textarea border.

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

### Step 1: Restructure the right column

Find the right column (around line 1633):

```tsx
          {/* Right Column - Tabbed Interface - Compact */}
          <div className="h-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col" style={{ borderRadius: '3px' }}>
              {/* Content Area */}
              <div className="p-4 flex-1 flex flex-col">
                  <div className="flex flex-col h-full">
                    {/* Tool Toggles — compact labeled row */}
                    ...
                    {/* Textarea */}
                    ...
                    {/* Submit */}
                    ...
                  </div>
              </div>
            </div>
          </div>
```

Replace the entire right column with an elevated card + embedded toolbar pattern:

```tsx
          {/* Right Column — Elevated Card with Embedded Toolbar */}
          <div className="h-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md h-full flex flex-col" style={{ borderRadius: '3px' }}>
              {/* Embedded Toolbar — in the textarea top border */}
              <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                {/* Tool Toggles */}
                <button onClick={toggleHighlightMode} className={`px-2 py-1 text-xs font-medium transition-colors ${highlightMode ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Codex Highlights (H)" aria-label="Toggle codex highlights" aria-pressed={highlightMode}>
                  H
                </button>
                <button onClick={toggleAiSuggest} className={`px-2 py-1 text-xs font-medium transition-colors ${aiSuggestEnabled ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="AI Suggest (A)" aria-label="Toggle AI suggestions" aria-pressed={aiSuggestEnabled}>
                  A
                </button>
                <button onClick={toggleXlsxMode} className={`px-2 py-1 text-xs font-medium transition-colors ${xlsxMode ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Reference Tools (R)" aria-label="Toggle reference tools" aria-pressed={xlsxMode}>
                  R
                </button>
                <button onClick={() => setShowOutput(!showOutput)} className={`px-2 py-1 text-xs font-medium transition-colors ${showOutput ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Output Table" aria-label="Toggle output table" aria-pressed={showOutput}>
                  O
                </button>
                {loadedFileType === 'excel' && (
                  <button onClick={toggleLiveEditMode} className={`flex items-center gap-1 px-2 py-1 text-xs font-medium transition-colors ${liveEditMode ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Live Excel Sync" aria-label="Toggle live edit mode" aria-pressed={liveEditMode}>
                    <span className={`w-1.5 h-1.5 rounded-full ${liveEditMode ? syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : syncStatus === 'error' ? 'bg-red-500' : 'bg-green-500' : 'bg-gray-400'}`} />
                    Live
                  </button>
                )}

                <div className="flex-1" />

                {/* Modified indicator */}
                {hasCurrentEntryChanged() && (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Modified
                  </span>
                )}

                {/* Submit button — inline */}
                <button
                  onClick={handleSubmitWithSync}
                  disabled={syncStatus === 'syncing'}
                  className="h-7 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-black border border-gray-800 dark:border-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-[0.98] transition-all font-bold tracking-wide uppercase text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: '3px' }}
                >
                  <span className="flex items-center gap-1.5">
                    {syncStatus === 'syncing' ? 'Syncing...' : currentIndex === sourceTexts.length - 1 ? 'Complete' : 'Submit'}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Textarea — dominant, fills remaining height */}
              <div className="flex-1 flex flex-col p-3">
                <textarea
                  ref={textareaRef}
                  value={currentTranslation}
                  onChange={(e) => setCurrentTranslation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.shiftKey && syncStatus !== 'syncing') {
                      e.preventDefault();
                      handleSubmitWithSync();
                    }
                  }}
                  className={`w-full p-4 focus:ring-2 focus:ring-opacity-30 transition-all duration-200 text-lg leading-relaxed text-gray-900 dark:text-white resize-none flex-1 ${
                    hasCurrentEntryChanged()
                      ? 'border border-green-400 dark:border-green-600 bg-green-50 dark:bg-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-300'
                      : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-gray-400 dark:focus:border-gray-400 focus:ring-gray-300'
                  }`}
                  style={{ borderRadius: '3px' }}
                  placeholder="Enter your translation..."
                  aria-label={`Translation for entry ${currentIndex + 1} of ${sourceTexts.length}`}
                  autoFocus
                />
                <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 text-right">
                  Shift+Enter to submit
                </p>
              </div>
            </div>
          </div>
```

### Step 2: Delete old inline submit + shift-enter hint

The old submit button (lines 1741-1754) and shift-enter hint (lines 1735-1740) are now in the embedded toolbar. Delete them.

### Step 3: Commit

```bash
git add src/components/TranslationHelper.tsx
git commit -m "refactor: elevated card with embedded toolbar for translation column"
```

---

## Task 6: Consolidate Below-Workspace Panels into WorkspaceToolsPanel

Replace the 4 separate conditional sections (Output, ReferenceToolsPanel, QuickReferenceBar, Bulk Translate) with the single WorkspaceToolsPanel.

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

### Step 1: Add state for force-tab

In the state declarations area (around line 540), add:

```tsx
const [forceToolsTab, setForceToolsTab] = useState<'reference' | 'quickref' | 'output' | 'bulk' | null>(null);
const clearForceTab = useCallback(() => setForceToolsTab(null), []);
```

### Step 2: Wire R and O toggles to auto-expand

Modify the R toggle in the embedded toolbar to also force-open the panel:

Find the `toggleXlsxMode` call in the R button. After the `toggleXlsxMode()` call, add logic to set force tab. The simplest approach: create wrapper functions:

```tsx
const handleToggleR = useCallback(() => {
  toggleXlsxMode();
  if (!xlsxMode) setForceToolsTab('reference'); // opening R → show reference tab
}, [toggleXlsxMode, xlsxMode]);

const handleToggleO = useCallback(() => {
  setShowOutput(!showOutput);
  if (!showOutput) setForceToolsTab('output'); // opening O → show output tab
}, [showOutput]);
```

Then in the toolbar, replace `onClick={toggleXlsxMode}` with `onClick={handleToggleR}` and `onClick={() => setShowOutput(!showOutput)}` with `onClick={handleToggleO}`.

### Step 3: Delete old standalone sections

Delete these sections from the JSX:

1. **Output section** (lines 1832-2219) — the entire `{showOutput && <div className="mt-4">...` block
2. **ReferenceToolsPanel** (lines 2222-2256) — the `<ReferenceToolsPanel ... />` call
3. **Video, Codex, and Reset buttons section** (lines 2269-2287) — move these to the footer or keep them but reduce spacing

### Step 4: Add WorkspaceToolsPanel after the grid

After the main 2-column grid's closing `</div>` (after the `{/* Main 2-Column Grid Layout */}` block ends), and before the codex popover, add:

```tsx
        {/* Consolidated Tools & Data Panel */}
        <WorkspaceToolsPanel
          forceTab={forceToolsTab}
          onForceTabHandled={clearForceTab}
          renderReference={() => (
            <ReferenceToolsPanel
              xlsxMode={xlsxMode}
              toggleXlsxMode={toggleXlsxMode}
              xlsxViewerTab={xlsxViewerTab}
              setXlsxViewerTab={setXlsxViewerTab}
              xlsxData={xlsxData}
              selectedXlsxFile={selectedXlsxFile}
              selectedXlsxSheet={selectedXlsxSheet}
              availableXlsxFiles={availableXlsxFiles}
              xlsxSearchTerm={xlsxSearchTerm}
              setXlsxSearchTerm={setXlsxSearchTerm}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              searchAllFiles={searchAllFiles}
              setSearchAllFiles={setSearchAllFiles}
              isLoadingXlsx={isLoadingXlsx}
              loadXlsxData={loadXlsxData}
              setSelectedXlsxSheet={setSelectedXlsxSheet}
              getAvailableSheets={getAvailableSheets}
              getFilteredEntries={getFilteredEntries}
              sourceTexts={sourceTexts}
              currentIndex={currentIndex}
              currentWorkingSheet={selectedSheet}
              highlightingJsonData={highlightingJsonData}
              findXlsxMatchesWrapper={findXlsxMatchesWrapper}
              findCharacterMatches={findCharacterMatches}
              insertCharacterName={insertCharacterName}
              insertTranslatedSuggestion={insertTranslatedSuggestion}
              handleCharacterNameClick={handleCharacterNameClick}
              handleHighlightClick={handleHighlightClick}
              darkMode={darkMode}
              copyJsonField={copyJsonField}
              editedEntries={editedEntries}
              onJumpToEntry={handleJumpToEntry}
            />
          )}
          renderQuickRef={() => (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {/* QuickReferenceBar content — currently not rendered in JSX */}
              <p className="text-xs text-gray-400 italic">Translation memory matches will appear here.</p>
            </div>
          )}
          renderOutput={() => (
            <>
              {/* PASTE THE OUTPUT TABLE CONTENT HERE — the inner content from the old Output section */}
              {/* This is the content that was inside the showOutput conditional (lines 1833-2219) */}
              {/* Include the table header, action bar, table body, timer section */}
            </>
          )}
          renderBulkTranslate={() => (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Translate Sheet</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Translate all {sourceTexts.length} lines with AI</p>
                </div>
                <button
                  onClick={openBulkModal}
                  className="h-8 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-black border border-gray-800 dark:border-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-bold tracking-wide uppercase text-xs"
                  style={{ borderRadius: '3px' }}
                >
                  Start Bulk Translate
                </button>
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="text-gray-600 dark:text-gray-300"><span className="font-bold">{emptyCount}</span> empty</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-blue-700 dark:text-blue-300"><span className="font-bold">{translatedCount}</span> translated</span>
                </div>
              </div>
            </div>
          )}
        />
```

**Note to implementor:** The `renderOutput` prop needs the full Output table JSX extracted from the deleted output section. Copy the inner content (table, action bar, timer) from the old `{showOutput && ...}` block. The bulk translate modal itself (lines 2410-2526) stays as a separate modal — only the "launch" button goes in the tab.

### Step 5: Commit

```bash
git add src/components/TranslationHelper.tsx
git commit -m "refactor: consolidate 4 panels into single WorkspaceToolsPanel with tabs"
```

---

## Task 7: Add Cmd+I Keyboard Shortcut for AI Suggestion Insert

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

### Step 1: Find the existing keyboard event handler

Search for the `useEffect` that handles keyboard shortcuts (search for `e.key === 'o'` or similar keybindings). Add the Cmd+I / Ctrl+I handler.

In the keyboard handler `useEffect`, add this case:

```tsx
// Cmd+I / Ctrl+I — insert AI suggestion
if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
  e.preventDefault();
  if (aiSuggestion) {
    insertTranslatedSuggestion(aiSuggestion);
    clearAiSuggestion();
  }
}
```

### Step 2: Update the AI suggestion default state

Find where `aiSuggestEnabled` is initialized. In the `useAiSuggestion` hook or wherever the initial state is set, change the default from `true` to `false` so AI suggestions start disabled.

Search for the hook declaration. If the default is set via a `useState(true)` in the hook, change it to `useState(false)`.

### Step 3: Commit

```bash
git add src/components/TranslationHelper.tsx src/hooks/useAiSuggestion.ts
git commit -m "feat: add Cmd+I to insert AI suggestion, default AI suggestions to off"
```

---

## Task 8: Clean Up Unused Imports and Dead Code

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

### Step 1: Remove unused imports

- Remove `QuickReferenceBar` import (line 22) — it was never rendered in JSX and is now handled via the WorkspaceToolsPanel render prop (or remains unused)
- Remove any other imports that are no longer referenced after the restructure

### Step 2: Run build verification

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

### Step 3: Commit

```bash
git add src/components/TranslationHelper.tsx
git commit -m "chore: clean up unused imports after Screen 2 restructure"
```

---

## Task 9: Manual Verification

### Step 1: Start the dev server

Run: `npm run dev`

### Step 2: Verify Screen 2

Open `http://localhost:3000`, load a file, and start translation. Check:

**Header:**
- [ ] Row 1 shows: [← Back] pill + filename · sheet · cell ref + timer + [Filter][⌨][☀] pills
- [ ] Row 2 shows: [◀] + progress bar + counter + [▶] + [Standard|Gamepad|Conv] view switcher with icons
- [ ] Back button is a pill with "Back" label
- [ ] Timer shows elapsed time, clickable to pause
- [ ] Filter opens popover (not modal)
- [ ] Keyboard shortcuts opens floating panel (not full-screen modal)
- [ ] Dark mode toggle works

**Left Column (Source):**
- [ ] No card styling (no border/shadow/background)
- [ ] Simplified header: cell ref + speaker name only
- [ ] Source text prominent
- [ ] Context notes appear when present
- [ ] AI suggestion appears below source text (muted style)
- [ ] Clicking AI suggestion inserts it
- [ ] Cmd+I inserts AI suggestion
- [ ] n-1 and n+1 are single-line truncated
- [ ] Clicking previews navigates

**Right Column (Translation):**
- [ ] Elevated card with shadow
- [ ] Embedded toolbar: [H][A][R][O][Live] + Modified + [Submit →]
- [ ] Textarea fills available height
- [ ] Green border when modified
- [ ] Shift+Enter submits
- [ ] Submit button works

**Below Workspace:**
- [ ] "Tools & Data" panel collapsed by default
- [ ] Expanding shows 4 tabs: [Reference | Quick Ref | Output | Bulk Translate]
- [ ] Reference tab shows ReferenceToolsPanel
- [ ] Output tab shows the stats table
- [ ] Bulk Translate tab shows launch button
- [ ] R toggle auto-expands to Reference tab
- [ ] O toggle auto-expands to Output tab
- [ ] Tab state persists across collapse/expand

**AI Suggestions:**
- [ ] AI suggestions start disabled (A toggle is off)
- [ ] Enabling A toggle shows suggestions in left column
- [ ] Cmd+I inserts suggestion into textarea

**View Modes:**
- [ ] Standard, Gamepad, Conversation all work
- [ ] Consolidated panel available in all modes

### Step 3: Fix any issues found

```bash
git add -A
git commit -m "fix: address verification issues from Screen 2 restructure"
```
