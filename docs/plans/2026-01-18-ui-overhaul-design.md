# UI Overhaul Design Plan

**Date:** 2026-01-18
**Status:** Ready for implementation

---

## Overview

This plan covers a comprehensive UI overhaul focusing on:
1. Header cleanup and button standardization
2. Source text display redesign
3. Reference system simplification (4 tabs → 2 tabs)
4. Toast notification redesign
5. Sheet selector visual upgrade
6. Live mode scrolling text fix

---

## Part 1: Header & Navigation Cleanup

### 1.1 Remove Finish Button from Header

**Current location:** Top-right header (lines 771-789 in TranslationHelper.tsx)

**Change:** Remove entirely from header. Completion already auto-triggers when clicking "Complete" on the last entry.

**Optional:** Add subtle "Finish" text link in the stats bar at bottom of Output table, only visible on last entry.

### 1.2 Standardize Header Button Sizes

**Current:** Finish button is `h-11`, other buttons vary

**Target:** All header buttons use `h-10 w-10` (40x40px) to match prev/next navigation buttons

**Buttons to update:**
- Navigation menu button
- Keyboard shortcuts button
- Dark mode toggle button

**Shared styling pattern:**
```tsx
className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all duration-300"
style={{ borderRadius: '3px' }}
```

---

## Part 2: Source Text Display Redesign

### 2.1 Visual Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ [J2] Previous Speaker — "Previous line..."        (dim) │  ← clickable, navigates to n-1
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [J3]  SPEAKER NAME                         [Copy] [⋮]  │  ← minimal header
│                                                         │
│  "The main source text gets full prominence             │  ← spotlight, text-xl
│   with room to breathe and be read easily."             │
│                                                         │
│  NL: De Nederlandse vertaling preview hier              │  ← text-sm, italic
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [J4] Next Speaker — "Next line preview..."        (dim) │  ← clickable, navigates to n+1
└─────────────────────────────────────────────────────────┘
```

### 2.2 Typography Specs

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| n-1 preview | text-xs (12px) | normal | gray-400 | Single line, truncated |
| n+1 preview | text-xs (12px) | normal | gray-400 | Single line, truncated |
| Speaker name | text-sm (14px) | font-bold | gray-900 | With cell ref badge |
| Source text (n) | text-xl (20px) | font-medium | gray-900 | Multi-line allowed |
| Dutch preview | text-sm (14px) | italic | gray-600 | Below source text |

### 2.3 Header Row (Minimal)

```
[J3] Speaker Name                              [Copy] [⋮]
```

- Cell ref: Monospace badge, `text-[9px]`, `bg-gray-200`
- Speaker name: Bold, prominent
- Copy button: Icon only (`w-4 h-4`)
- Overflow menu (⋮): Less-used actions

### 2.4 Overflow Menu Contents

- Search in reference files
- View character history (future)
- Copy with cell reference

### 2.5 Mode Buttons Row

Position: Below the source text context stack

```
[ Game View ] [ Highlights ] [ References ] [ Live ]
```

- Height: `h-7` (existing)
- Visual separator between view modes and data modes
- Remove from current location in output section

---

## Part 3: Reference System Simplification

### 3.1 Current State (4 Tabs)

1. Codex - Character/location data from codex_translations.csv
2. Global Search - Search across all XLSX files
3. Browse - File/sheet selector with results
4. Context - Auto-search current source text

### 3.2 New Structure (2 Tabs)

**Tab 1: "Codex"**
- Source: `codex_translations.csv`
- Search input for name/English/Dutch
- Category filter pills (Characters, Locations, Items, etc.)
- Auto-highlights matches in source text
- Click to insert Dutch translation at cursor
- Entry count badge

**Tab 2: "Search"**
- Merges Browse + Global Search + Context functionality
- Single search input
- Smart default: Auto-populates with current source text
- Toggle: "Current text" vs "Custom search"
- File filter dropdown (optional, defaults to "All files")
- Results show: File badge, English, Dutch, Insert button

### 3.3 QuickReferenceBar (Unchanged Location)

- Stays below source text box
- Shows codex matches for current source text
- Max 4 visible, expandable
- Click "Open" jumps to Reference panel with context

---

## Part 4: Toast Notifications Redesign

### 4.1 Visual Style

```css
/* Base toast styling */
.toast-custom {
  border-radius: 3px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  max-width: 360px;
  border: 1px solid;
}
```

### 4.2 Type Variants

| Type | Border | Background (Light) | Background (Dark) | Icon |
|------|--------|-------------------|-------------------|------|
| Success | green-500 | green-50 | gray-800 + green tint | Checkmark |
| Error | red-500 | red-50 | gray-800 + red tint | X-circle |
| Info | blue-500 | blue-50 | gray-800 + blue tint | Info |
| Warning | amber-500 | amber-50 | gray-800 + amber tint | Warning |

### 4.3 Stacking Behavior

- Stack downward (new toasts appear below existing)
- Gap between toasts: 8px
- Max visible: 4 toasts
- Oldest auto-dismisses when limit reached
- Slide-in from right animation
- Fade-out on dismiss

### 4.4 Layout.tsx Toaster Config

```tsx
<Toaster
  position="top-right"
  expand={true}
  gap={8}
  visibleToasts={4}
  toastOptions={{
    style: {
      borderRadius: '3px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: 500,
    },
  }}
/>
```

---

## Part 5: Sheet Selector Visual Upgrade

### 5.1 Component Created

`src/components/SheetSelector.tsx` - Already created with:
- Grid/List view toggle
- Search filter (when >5 sheets)
- Episode category badges (E01, E02, etc.)
- Row count per sheet
- Green checkmark for selected
- Max height with scroll

### 5.2 Integration

Replace the `<select>` dropdown in SetupWizard.tsx (lines 716-725) with:

```tsx
<SheetSelector
  sheets={excelSheets}
  selectedSheet={selectedSheet}
  onSelectSheet={setSelectedSheet}
  workbookData={workbookData}
  startRow={startRow}
/>
```

---

## Part 6: Live Mode Scrolling Text Fix

### 6.1 Current Issue

Long Dutch translations in the output table scroll immediately when rendered.

### 6.2 Fix

Add 1-second delay before animation starts.

### 6.3 CSS Update (globals.css)

```css
.scrolling-text-container {
  overflow: hidden;
  position: relative;
}

.scrolling-text {
  display: inline-block;
  white-space: nowrap;
  animation: scroll-text 8s linear infinite;
  animation-delay: 1s;
  animation-fill-mode: backwards;
}

@keyframes scroll-text {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

---

## Implementation Order

### Phase 1: Quick Wins (CSS only)
1. ✅ Fix scrolling text 1s delay (globals.css)
2. ✅ Toast styling updates (globals.css + layout.tsx)

### Phase 2: Header Cleanup
3. Remove Finish button from header (TranslationHelper.tsx)
4. Standardize header button sizes to h-10 w-10 (TranslationHelper.tsx)

### Phase 3: Source Text Redesign
5. Redesign source text display with hierarchy (TranslationHelper.tsx)
6. Move mode buttons below source text (TranslationHelper.tsx)

### Phase 4: Setup Wizard
7. Integrate SheetSelector into SetupWizard (SetupWizard.tsx)

### Phase 5: Reference Panel (Largest Change)
8. Consolidate ReferenceToolsPanel to 2 tabs (ReferenceToolsPanel.tsx)

---

## Files Summary

### Modify

| File | Changes |
|------|---------|
| `src/app/globals.css` | Scrolling text delay, toast styling |
| `src/app/layout.tsx` | Toaster configuration |
| `src/components/TranslationHelper.tsx` | Remove Finish button, standardize header buttons, redesign source text, move mode buttons |
| `src/components/SetupWizard.tsx` | Integrate SheetSelector |
| `src/components/ReferenceToolsPanel.tsx` | Consolidate 4 tabs → 2 tabs |

### Already Created

| File | Purpose |
|------|---------|
| `src/components/SheetSelector.tsx` | Visual sheet grid/list selector |

---

## Design Tokens Reference

| Token | Value | Usage |
|-------|-------|-------|
| Border radius | 3px | All buttons, cards, inputs |
| Button height (standard) | h-10 (40px) | Header buttons, nav buttons |
| Button height (compact) | h-7 (28px) | Mode toggle buttons |
| Toast max-width | 360px | Notification toasts |
| Toast gap | 8px | Space between stacked toasts |
| Animation delay | 1s | Scrolling text in Live mode |
