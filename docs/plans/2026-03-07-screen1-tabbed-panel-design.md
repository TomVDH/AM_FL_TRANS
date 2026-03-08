# Screen 1 Restructure — Tabbed Panel Consolidation

**Date:** 2026-03-07
**Status:** Design approved
**Scope:** Screen 1 (SetupWizard) only. Screen 2 excluded.
**Goal:** Reduce page from 10 visual blocks to 6 by merging three separate accordions into one tabbed panel.

---

## Problem

Screen 1 has three problems:
1. **Too many sections** — Codex, Style Analysis, and Settings are three separate accordions, each with its own header, expand/collapse state, and vertical footprint.
2. **Wrong visual hierarchy** — The primary flow (resume → file → start) competes for attention with reference data and settings below it.
3. **Too much vertical scroll** — 10 distinct visual blocks in a single column creates an unnecessarily long page.

## Solution

Replace the three separate accordions (Codex, Speaker Style Analysis, Settings) with a single collapsible **"Reference & Config"** panel that uses internal tabs.

### Page Structure: Before vs After

| # | Before (10 blocks) | After (6 blocks) |
|---|---|---|
| 1 | Logo + subtitle | Logo + subtitle |
| 2 | Resume card | Resume card |
| 3 | "OR START NEW" divider | "OR START NEW" divider |
| 4 | File selector | Primary flow (file + upload + sheet + language + start) |
| 5 | Upload drop zone | Reference & Config (single collapsible, 3 internal tabs) |
| 6 | Start button | Footer |
| 7 | Codex accordion | *(merged into #5)* |
| 8 | Style Analysis accordion | *(merged into #5)* |
| 9 | Settings accordion | *(merged into #5)* |
| 10 | Footer | *(moved to #6)* |

---

## Reference & Config Panel

### Collapsed State (default)

A single line with inline summary badges showing key info at a glance:

```
Reference & Config     179 codex · 43/126 enriched · XLS mode  [v]
```

The user sees the data status without expanding. This replaces three separate accordion headers.

### Expanded State

Shows a tab bar with three tabs, only one active at a time:

```
Reference & Config                                              [^]
┌──────────────────────────────────────────────────────────────────┐
│  [Codex (179)]  [Styles (43/126)]  [Settings]                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  (Active tab content)                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Tab Contents

**Codex tab:**
- Shows `CodexEditor` component (unchanged)
- Refresh button moves from the accordion header into this tab
- Badge: entry count (e.g., "179")

**Styles tab:**
- Shows `StyleAnalysisPanel` component (unchanged)
- Badge: enrichment count (e.g., "43/126")

**Settings tab:**
- File type toggle (XLS / JSON / CSV)
- Input mode selector (Excel / JSON / Manual)
- Reset to originals button
- No badge needed

### Behavior

- Collapsed by default on page load
- Remembers last active tab in localStorage
- Tab labels include count badges
- Expanding reveals the last-active tab
- Only one tab visible at a time (no stacking)

---

## Complete Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  ASSES.MASSES — TRANSLATION WORKBENCH           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ RESUME  13/13 · 41m ago                           │  │
│  │ filename.xlsx — SheetName                       ▶ │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ──────────── OR START NEW ────────────                 │
│                                                         │
│  [Select file from server...          v]                │
│  [  + Drop .xlsx or click to upload    ]                │
│  → Language selector (after file)                       │
│  → Sheet selector (after language)                      │
│  → [Preview ▾] (toggleable, collapsed by default)       │
│  → ✓ n items ready                                      │
│  [=========== Start Translation — n lines =============]│
│                                                         │
│  ─────────────────────────────────────────              │
│  Reference & Config   179 codex · 43/126 · XLS    [v]  │
│                                                         │
│  ─────────────────────────────────────────              │
│  AM FL TRANS · Onnozelaer © 2025    [Video][GH][☀][v]  │
└─────────────────────────────────────────────────────────┘
```

---

## What Changes

1. **Delete** the standalone Codex accordion section (header + expand/collapse + content wrapper)
2. **Delete** the standalone StyleAnalysisPanel section
3. **Delete** the standalone Settings accordion section
4. **Add** a new `ReferenceConfigPanel` component with:
   - Collapsible header with summary badges
   - Tab bar: [Codex | Styles | Settings]
   - Tab content area rendering the appropriate child component
5. **Move** the Codex refresh button into the Codex tab
6. **Move** the file type toggle, input mode selector, and reset button into the Settings tab
7. **Make SheetPreview toggleable** — Currently auto-shows after sheet + language selection. Change to a small "Preview" toggle link/button that expands/collapses the SheetPreview. Collapsed by default. Reduces vertical scroll in the primary flow since preview is useful occasionally but not every session.

## What Stays the Same

- Header (logo + subtitle)
- Resume card (amber, with progress and time ago)
- "OR START NEW" divider
- File selector dropdown
- Upload drop zone
- Progressive disclosure (language → sheet → preview → start)
- Start button
- Footer (AM FL TRANS, Video, GitHub, dark mode, version badge)
- All existing functionality and state management

---

## Implementation Notes

- This is a **structural refactor only** — no visual redesign, no new features
- The three child components (CodexEditor, StyleAnalysisPanel, settings form) are reused as-is
- Tab state is local to the new panel component
- The collapsed summary reads from existing state (codex count from `useCodexLanguages`, enrichment from StyleAnalysisPanel, file type from local state)
- Single commit, single component change in SetupWizard.tsx + new ReferenceConfigPanel component

## Out of Scope

- Screen 2 changes
- Visual polish / color changes
- New features
- Backend changes
