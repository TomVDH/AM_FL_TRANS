# Live Edit Batch Sync & Cleanup

**Date:** 2026-03-07

## Problem

When translating with LIVE EDIT off, changes accumulate in memory (`translations[]`) but never persist to the Excel file. Turning LIVE EDIT on later only syncs future navigations — all prior work remains unsaved. The user must re-visit each changed line manually to trigger a sync.

Additionally, `useLiveEdit.ts` exists as an unused stub while all live edit logic is inlined in the 1300-line `useTranslationState.ts`.

## Design

### 1. Dirty Change Tracking

Compare `translations[i]` vs `originalTranslations[i]` to compute dirty indices on demand. No new tracking state needed — the diff is the source of truth.

```ts
getDirtyIndices(): number[]
// Returns indices where translations[i] !== originalTranslations[i]
// Excludes blank-to-blank (both are '' or '[BLANK, REMOVE LATER]')
```

### 2. Toggle-On Flow

When LIVE EDIT flips from off → on:

1. Compute `dirtyIndices`
2. If empty → activate silently
3. If non-empty → show confirmation modal:
   - "**N unsaved changes detected**"
   - "These translations were entered while Live Edit was off."
   - Buttons: **Sync Now** / **Skip**
4. **Skip** → activates LIVE EDIT, changes sync individually on next navigation
5. **Sync Now** → modal transitions to progress bar:
   - Sequential writes to `/api/xlsx-save`, 100ms between
   - On completion: auto-close, update `originalTranslations` for synced indices
   - On partial failure: show failure count, still activate LIVE EDIT

### 3. Code Cleanup — Extract `useLiveEdit`

**Moves to `useLiveEdit.ts`:**
- `liveEditMode`, `syncStatus`, `lastSyncTime` state
- `toggleLiveEditMode()` with dirty-check + modal trigger
- `syncCurrentTranslation()` — single-line sync
- `syncAllDirty()` — batch sync
- `getDirtyIndices()` — computed
- `showSyncModal`, `syncProgress`, `syncTotal` — modal state

**Stays in `useTranslationState.ts`:**
- `translations[]`, `originalTranslations[]`
- Navigation (`handleSubmit`, `handlePrevious`)
- File loading, sheet selection, all other state

**Interface:**
```ts
useLiveEdit({
  translations, originalTranslations, setOriginalTranslations,
  loadedFileName, loadedFileType, selectedSheet,
  startRow, translationColumn, currentIndex, currentTranslation,
  hasCurrentEntryChanged
})
```

### 4. UI Changes

- Sync confirmation modal styled consistent with app (3px borders, font-black headers, gradient buttons)
- Progress bar inside the modal during batch sync
- Existing sync status dot and toggle buttons remain unchanged
