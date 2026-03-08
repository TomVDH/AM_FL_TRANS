# Screen 1: Tabbed Panel Consolidation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the three separate accordions (Codex, Style Analysis, Settings) on the Setup Wizard with a single collapsible tabbed "Reference & Config" panel. Also make SheetPreview toggleable.

**Architecture:** Create a new `ReferenceConfigPanel` component that wraps the existing CodexEditor, StyleAnalysisPanel, and Settings form behind a tabbed interface. Remove the three standalone accordion sections from SetupWizard. The panel is collapsed by default and shows summary badges when collapsed.

**Tech Stack:** React, Tailwind CSS. No new dependencies. Reuses existing child components.

**Design Doc:** `docs/plans/2026-03-07-screen1-tabbed-panel-design.md`

---

## Task 1: Create the ReferenceConfigPanel Component

**Files:**
- Create: `src/components/ReferenceConfigPanel.tsx`

### Step 1: Create the new component file

Create `src/components/ReferenceConfigPanel.tsx` with this content:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import CodexEditor from './CodexEditor';
import StyleAnalysisPanel from './StyleAnalysisPanel';

type TabId = 'codex' | 'styles' | 'settings';

interface ReferenceConfigPanelProps {
  // Codex
  totalEntries: number;
  isLoadingCodex: boolean;
  refreshCodex: () => void;
  onCodexUpdated: () => void;

  // Style Analysis summary (read from StyleAnalysisPanel's own state — we just show count in badge)
  styleEnrichedCount?: number;
  styleTotalCount?: number;

  // Settings: file type
  fileType: 'excel' | 'json' | 'csv';
  onFileTypeChange: (type: 'excel' | 'json' | 'csv') => void;

  // Settings: input mode
  inputMode: 'excel' | 'embedded-json' | 'manual';
  setInputMode: (mode: 'excel' | 'embedded-json' | 'manual') => void;

  // Settings: reset
  setShowResetModal?: (show: boolean) => void;

  // Dark mode (for styling consistency)
  darkMode?: boolean;
}

export default function ReferenceConfigPanel({
  totalEntries,
  isLoadingCodex,
  refreshCodex,
  onCodexUpdated,
  styleEnrichedCount,
  styleTotalCount,
  fileType,
  onFileTypeChange,
  inputMode,
  setInputMode,
  setShowResetModal,
}: ReferenceConfigPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('refConfigActiveTab') as TabId) || 'codex';
    }
    return 'codex';
  });

  // Persist active tab
  useEffect(() => {
    localStorage.setItem('refConfigActiveTab', activeTab);
  }, [activeTab]);

  const tabs: { id: TabId; label: string; badge?: string }[] = [
    { id: 'codex', label: 'Codex', badge: totalEntries > 0 ? String(totalEntries) : undefined },
    {
      id: 'styles',
      label: 'Styles',
      badge: styleEnrichedCount !== undefined && styleTotalCount !== undefined
        ? `${styleEnrichedCount}/${styleTotalCount}`
        : undefined,
    },
    { id: 'settings', label: 'Settings' },
  ];

  // Build collapsed summary text
  const summaryParts: string[] = [];
  if (totalEntries > 0) summaryParts.push(`${totalEntries} codex`);
  if (styleEnrichedCount !== undefined && styleTotalCount !== undefined) {
    summaryParts.push(`${styleEnrichedCount}/${styleTotalCount} enriched`);
  }
  summaryParts.push(`${fileType.toUpperCase()} mode`);
  const summaryText = summaryParts.join(' \u00b7 ');

  return (
    <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
      {/* Collapsed / Expand Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-1.5 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-sm font-bold tracking-tight">Reference & Config</span>
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
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
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

            {/* Codex refresh button — only visible on codex tab */}
            {activeTab === 'codex' && (
              <div className="ml-auto flex items-center pr-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshCodex();
                  }}
                  disabled={isLoadingCodex}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                  title="Refresh codex"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${isLoadingCodex ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'codex' && (
              <CodexEditor onCodexUpdated={onCodexUpdated} />
            )}

            {activeTab === 'styles' && (
              <StyleAnalysisPanel />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-5">
                {/* File type selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">File Type</label>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                    Choose the source format. Excel loads .xlsx files from <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-[10px]">/excels</code>, JSON/CSV from <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-[10px]">/data</code>.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-0.5 inline-flex" style={{ borderRadius: '3px' }}>
                    {(['excel', 'json', 'csv'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => onFileTypeChange(type)}
                        aria-pressed={fileType === type}
                        className={`px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-200 ${
                          fileType === type
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        style={{ borderRadius: '2px' }}
                      >
                        {type === 'excel' ? 'XLS' : type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input mode selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Input Mode</label>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                    Excel reads columns from a spreadsheet. JSON loads structured data. Manual lets you paste text directly.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-0.5 inline-flex" style={{ borderRadius: '3px' }}>
                    {(['excel', 'embedded-json', 'manual'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setInputMode(mode)}
                        className={`px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-200 ${
                          inputMode === mode
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        style={{ borderRadius: '2px' }}
                      >
                        {mode === 'embedded-json' ? 'JSON' : mode === 'excel' ? 'Excel' : 'Manual'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                {setShowResetModal && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="group h-8 px-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 transition-colors"
                      style={{ borderRadius: '3px' }}
                      title="Reset all data to original state"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reset to originals</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 2: Verify file builds

Run: `npx tsc --noEmit`
Expected: No errors (component is standalone)

### Step 3: Commit

```bash
git add src/components/ReferenceConfigPanel.tsx
git commit -m "feat: create ReferenceConfigPanel component with tabbed interface"
```

---

## Task 2: Replace Three Accordions with ReferenceConfigPanel in SetupWizard

**Files:**
- Modify: `src/components/SetupWizard.tsx`

### Step 1: Add the import

At line 9 of `SetupWizard.tsx`, after the `StyleAnalysisPanel` import, add:

```tsx
import ReferenceConfigPanel from './ReferenceConfigPanel';
```

### Step 2: Add fileType change handler and state for style counts

The `handleFileTypeChange` function already exists in SetupWizard (used by the Settings file type selector). We need to keep it. The style analysis enrichment counts are managed internally by `StyleAnalysisPanel` — for the summary badge, we can read them from an API call or pass `undefined` initially (StyleAnalysisPanel will show its own counts when the tab is open).

No new state needed — the existing `fileType`, `inputMode`, `setInputMode`, `setShowResetModal` state and the codex hooks already provide everything.

### Step 3: Delete the three accordion sections

In `SetupWizard.tsx`, **delete** these three sections:

1. **Codex accordion** (lines 772-820): The entire `<div className="mt-8 pt-5 border-t ...">` block containing the Codex toggle button and CodexEditor.

2. **StyleAnalysisPanel section** (lines 822-825): The `<div className="mt-5"><StyleAnalysisPanel /></div>` block.

3. **Settings accordion** (lines 827-912): The entire `<div className="mt-5">` block containing the showAdvanced toggle and settings content.

### Step 4: Add the ReferenceConfigPanel in their place

In the same location where the three accordions were (after the Start button's closing `</div>` at line ~770), add:

```tsx
{/* Reference & Config — single tabbed panel */}
<ReferenceConfigPanel
  totalEntries={totalEntries}
  isLoadingCodex={isLoadingCodex}
  refreshCodex={refreshCodex}
  onCodexUpdated={handleCodexUpdated}
  fileType={fileType}
  onFileTypeChange={handleFileTypeChange}
  inputMode={inputMode}
  setInputMode={setInputMode}
  setShowResetModal={setShowResetModal}
/>
```

### Step 5: Remove unused state declarations

In `SetupWizard.tsx`, **delete** these state variables that are no longer needed:
- `const [showCodexEditor, setShowCodexEditor] = useState(false);` (line 197)
- `const [showAdvanced, setShowAdvanced] = useState(false);` (line 199)

### Step 6: Verify build

Run: `npm run build`
Expected: Build succeeds, no TypeScript errors.

### Step 7: Commit

```bash
git add src/components/SetupWizard.tsx
git commit -m "refactor: replace 3 accordions with single ReferenceConfigPanel"
```

---

## Task 3: Make SheetPreview Toggleable

**Files:**
- Modify: `src/components/SetupWizard.tsx`

### Step 1: Add state for preview toggle

Near the other state declarations (around line 195), add:

```tsx
const [showSheetPreview, setShowSheetPreview] = useState(false);
```

### Step 2: Wrap SheetPreview in a toggle

Find the SheetPreview render (around line 683, now shifted after Task 2 edits). Replace:

```tsx
{selectedSheet && selectedLanguage && (
  <SheetPreview
    workbook={workbookData}
    sheetName={selectedSheet}
    sourceColumn={sourceColumn}
    targetColumn={selectedLanguage.column}
    startRow={startRow}
    languageCode={selectedLanguage.code}
  />
)}
```

With:

```tsx
{selectedSheet && selectedLanguage && (
  <>
    <button
      onClick={() => setShowSheetPreview(!showSheetPreview)}
      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-1"
    >
      <svg
        className={`w-3 h-3 transform transition-transform duration-200 ${showSheetPreview ? 'rotate-90' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span>Preview</span>
    </button>
    {showSheetPreview && (
      <SheetPreview
        workbook={workbookData}
        sheetName={selectedSheet}
        sourceColumn={sourceColumn}
        targetColumn={selectedLanguage.column}
        startRow={startRow}
        languageCode={selectedLanguage.code}
      />
    )}
  </>
)}
```

### Step 3: Verify build

Run: `npm run build`
Expected: Build succeeds.

### Step 4: Commit

```bash
git add src/components/SetupWizard.tsx
git commit -m "refactor: make SheetPreview toggleable, collapsed by default"
```

---

## Task 4: Manual Verification

### Step 1: Start the dev server

Run: `npm run dev`

### Step 2: Verify Screen 1

Open `http://localhost:3000` and check:
- [ ] Resume card still works (click to resume)
- [ ] "OR START NEW" divider appears
- [ ] File selector works
- [ ] Upload zone works
- [ ] Language/sheet selectors appear after file loads
- [ ] SheetPreview has a "Preview" toggle that expands/collapses it
- [ ] Start button works
- [ ] "Reference & Config" panel is collapsed by default
- [ ] Collapsed panel shows summary: "179 codex · XLS mode"
- [ ] Expanding shows tab bar: [Codex | Styles | Settings]
- [ ] Codex tab shows CodexEditor with refresh button in tab bar
- [ ] Styles tab shows StyleAnalysisPanel
- [ ] Settings tab shows file type toggle, input mode, and reset button
- [ ] Switching tabs works, last tab is remembered on re-expand
- [ ] Dark mode toggle in footer still works
- [ ] No console errors

### Step 3: Verify Screen 2 is unaffected

Click "Start Translation" or Resume and verify:
- [ ] Translation workspace loads correctly
- [ ] No regressions in the translation view

### Step 4: Final commit (if any fixes needed)

```bash
git add -A
git commit -m "fix: address verification issues from Screen 1 restructure"
```
