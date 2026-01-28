# Cleanup & Completion Flow Implementation Plan

**Date:** 2026-01-18
**Status:** Ready for implementation

---

## Overview

This plan covers three areas:
1. **Code Cleanup** - Remove dead code, fix bugs, consolidate duplicates
2. **Codex Editor** - Add import/replace + quick add/edit to Setup Wizard
3. **Completion Flow** - Stats summary, review with inline editing, export, auto-advance to next sheet

---

## Part 1: Code Cleanup

### 1.1 Delete Unused Hooks (10 files)

| File | Reason |
|------|--------|
| `src/hooks/useAnimations.ts` | Zero imports |
| `src/hooks/useDebouncedSearch.ts` | Zero imports |
| `src/hooks/useExcelProcessor.ts` | Zero imports, duplicate of useExcelProcessing |
| `src/hooks/useExportFunctionality.ts` | Zero imports |
| `src/hooks/useJsonMode.ts` | Zero imports |
| `src/hooks/useProgressTracking.ts` | Zero imports |
| `src/hooks/useSetupWizard.ts` | Zero imports |
| `src/hooks/useTextHighlighting.ts` | Zero imports |
| `src/hooks/useTranslationWorkflow.ts` | Zero imports |
| `src/hooks/useUnifiedReferenceSearch.ts` | Zero imports |

### 1.2 Delete Unused Components (5 files)

| File | Reason |
|------|--------|
| `src/components/DisplayModeControls.tsx` | Zero imports |
| `src/components/KeyboardShortcutsModal.tsx` | Zero imports |
| `src/components/NavigationProgressBar.tsx` | Zero imports |
| `src/components/EnhancedTranslationHelper.tsx` | Zero imports (prototype) |
| `src/components/TranslationHeader.tsx` | Zero imports |
| `src/components/CSVConsultationPanel.tsx` | Only imported by unused EnhancedTranslationHelper |

### 1.3 Delete Unused API Routes (2 files)

| File | Reason |
|------|--------|
| `src/app/api/codex/route.ts` | Zero calls from frontend |
| `src/app/api/xlsx-data/route.ts` | Zero calls, superseded by xlsx-files |

### 1.4 Remove Stub Functions

Remove `categoryHasMatches()` from:
- `src/hooks/useTextOperations.ts` (lines 214-220, and from return object)
- `src/hooks/useTranslationState.ts` (lines 720-723, and from return object)
- `src/hooks/useUIComponents.ts` (lines 88-91, and from return object)

### 1.5 Fix classList Race Condition

**File:** `src/app/layout.tsx`

Move the random background script from `<head>` to after body, or wrap in DOMContentLoaded:

```tsx
<script dangerouslySetInnerHTML={{
  __html: `
    document.addEventListener('DOMContentLoaded', function() {
      const randomBg = 'bg-random-' + (Math.floor(Math.random() * 10) + 1);
      document.body.classList.add(randomBg);
    });
  `
}} />
```

### 1.6 Create Shared Utilities

**New file:** `src/utils/speakerNameUtils.ts`
- Move `extractSpeakerName()` here (consolidate from useUIComponents and useTextOperations)

**New file:** `src/utils/episodeExtractor.ts`
- Extract episode number from filename
- Patterns: `E01`, `EP01`, `Episode1`, `Ep_01`, etc.
- Returns string like `E01` or `UNKNOWN` if no match

---

## Part 2: Codex Editor

### 2.1 New Component: CodexEditor

**File:** `src/components/CodexEditor.tsx`

**Features:**
1. **Import/Replace Section**
   - File upload dropzone for CSV
   - Preview first 5 rows before confirming
   - Validate required columns: name, english, dutch, category
   - "Replace Codex" button with confirmation

2. **Quick Add Form**
   - Fields: Name, English, Dutch, Category (dropdown), Nicknames
   - Category options from existing categories in codex
   - "Add Entry" button
   - Toast on success

3. **Quick Edit Table**
   - Search input to filter entries
   - Scrollable list showing: name, english, dutch
   - Click row to expand inline edit (dutch, nicknames only)
   - Save/Cancel buttons per row

### 2.2 New API: Codex CRUD

**File:** `src/app/api/codex/route.ts` (recreate with proper implementation)

```typescript
GET /api/codex
// Returns all codex entries from codex_translations.csv

POST /api/codex
// Body: { action: 'add' | 'update' | 'replace', data: ... }
// - add: Append new entry
// - update: Update existing entry by name
// - replace: Replace entire CSV with uploaded data
```

### 2.3 Integrate into SetupWizard

**File:** `src/components/SetupWizard.tsx`

Add collapsible section "Codex / Reference Data" below file loading:
- Collapsed by default
- Expand to show CodexEditor component
- Styled consistently with existing sections

---

## Part 3: Completion Flow

### 3.1 New Component: CompletionSummary

**File:** `src/components/CompletionSummary.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ✓ Sheet Complete: "{sheetName}"                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  STATS                                          │   │
│  │  Total Entries: {total}                         │   │
│  │  Translated: {completed} ({percent}%)           │   │
│  │  Blank: {blank}                                 │   │
│  │  Modified this session: {modified}              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Review & Edit]    [Export CSV]    [Next Sheet →]     │
│                                                         │
│  Remaining sheets: {sheet2}, {sheet3}, ...             │
│  (or "All sheets complete!" if none remaining)         │
└─────────────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface CompletionSummaryProps {
  sheetName: string;
  episodeNumber: string;
  stats: { total: number; completed: number; blank: number; modified: number };
  remainingSheets: string[];
  onReview: () => void;
  onExport: () => void;
  onNextSheet: () => void;
  onBackToSetup: () => void;
}
```

### 3.2 New Component: TranslationReview

**File:** `src/components/TranslationReview.tsx`

**Features:**
- Filter tabs: All | Blank | Modified
- Scrollable list of all entries
- Each row shows: index, source text (truncated), translation textarea
- Inline editing: click textarea to edit, auto-saves on blur
- "Back to Summary" button
- Entry count per filter

**Props:**
```typescript
interface TranslationReviewProps {
  sourceTexts: string[];
  translations: string[];
  originalTranslations: string[];
  onUpdateTranslation: (index: number, value: string) => void;
  onBack: () => void;
}
```

### 3.3 Update Export Filename Format

**File:** `src/hooks/useTranslationState.ts` (or new useCompletionFlow hook)

Change CSV export filename from:
```
translations_{sheetName}.csv
```
To:
```
{episodeNumber}--{sheetName}.csv
```

Example: `E01--Episode1_Dialogue.csv`

### 3.4 Add Completion State to TranslationState

**File:** `src/hooks/useTranslationState.ts`

Add new state:
```typescript
const [showCompletionSummary, setShowCompletionSummary] = useState(false);
const [showReviewMode, setShowReviewMode] = useState(false);
const [episodeNumber, setEpisodeNumber] = useState<string>('UNKNOWN');
```

Add functions:
```typescript
const finishSheet = () => setShowCompletionSummary(true);
const enterReviewMode = () => { setShowCompletionSummary(false); setShowReviewMode(true); };
const exitReviewMode = () => { setShowReviewMode(false); setShowCompletionSummary(true); };
const advanceToNextSheet = () => { /* load next sheet, reset completion state */ };
```

Extract episode number when file loads:
```typescript
// In processExcelData or file load handler
const epNum = extractEpisodeNumber(fileName);
setEpisodeNumber(epNum);
```

### 3.5 Integrate into TranslationHelper

**File:** `src/components/TranslationHelper.tsx`

Add "Finish Sheet" button to header (next to existing controls)

Conditional rendering:
```tsx
{showCompletionSummary ? (
  <CompletionSummary ... />
) : showReviewMode ? (
  <TranslationReview ... />
) : (
  // existing translation UI
)}
```

### 3.6 Auto-Advance Logic

When "Next Sheet" clicked:
1. Get current sheet index from `excelSheets` array
2. If next sheet exists, call `setSelectedSheet(nextSheet)`
3. Reset `showCompletionSummary` and `showReviewMode` to false
4. If no next sheet, show "All Complete" state with "Back to Setup" only

---

## Implementation Order

### Phase 1: Cleanup (Do First)
1. Delete unused hooks (10 files)
2. Delete unused components (6 files)
3. Delete unused API routes (2 files)
4. Remove categoryHasMatches stubs
5. Fix classList race condition
6. Create shared utilities

### Phase 2: Codex Editor
1. Create CodexEditor component
2. Create/update /api/codex endpoint
3. Integrate into SetupWizard

### Phase 3: Completion Flow
1. Create episodeExtractor utility
2. Create CompletionSummary component
3. Create TranslationReview component
4. Update useTranslationState with completion logic
5. Update export filename format
6. Integrate into TranslationHelper
7. Wire up auto-advance

---

## Files Summary

### Delete (18 files)
- `src/hooks/useAnimations.ts`
- `src/hooks/useDebouncedSearch.ts`
- `src/hooks/useExcelProcessor.ts`
- `src/hooks/useExportFunctionality.ts`
- `src/hooks/useJsonMode.ts`
- `src/hooks/useProgressTracking.ts`
- `src/hooks/useSetupWizard.ts`
- `src/hooks/useTextHighlighting.ts`
- `src/hooks/useTranslationWorkflow.ts`
- `src/hooks/useUnifiedReferenceSearch.ts`
- `src/components/DisplayModeControls.tsx`
- `src/components/KeyboardShortcutsModal.tsx`
- `src/components/NavigationProgressBar.tsx`
- `src/components/EnhancedTranslationHelper.tsx`
- `src/components/TranslationHeader.tsx`
- `src/components/CSVConsultationPanel.tsx`
- `src/app/api/codex/route.ts`
- `src/app/api/xlsx-data/route.ts`

### Create (5 files)
- `src/utils/speakerNameUtils.ts`
- `src/utils/episodeExtractor.ts`
- `src/components/CodexEditor.tsx`
- `src/components/CompletionSummary.tsx`
- `src/components/TranslationReview.tsx`

### Modify (5 files)
- `src/app/layout.tsx` - Fix classList bug
- `src/app/api/codex/route.ts` - Recreate with proper implementation
- `src/hooks/useTranslationState.ts` - Add completion state, remove stubs
- `src/hooks/useTextOperations.ts` - Remove categoryHasMatches
- `src/hooks/useUIComponents.ts` - Remove categoryHasMatches
- `src/components/SetupWizard.tsx` - Add CodexEditor section
- `src/components/TranslationHelper.tsx` - Add completion flow UI
