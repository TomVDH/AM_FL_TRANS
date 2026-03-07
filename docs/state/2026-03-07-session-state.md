# Session State — 2026-03-07

## Project
AM_FL_TRANS — Translation Helper for Asses.Masses game localization.
Next.js 15 app with React, TypeScript, Tailwind CSS, ExcelJS.
Dev server: `npm run dev` on port 3000.

## Architecture Overview

### Screens
- **Screen 1 (Setup)**: `SetupWizard.tsx` — file load, language detection, sheet selection, codex editor
- **Screen 2 (Translation)**: `TranslationHelper.tsx` — line-by-line translation with AI assist, live edit, bulk translate
- **Review Mode**: Side-by-side diff after bulk AI translate
- **Completion Summary**: After finishing a sheet

### Key Hooks
| Hook | File | Purpose |
|------|------|---------|
| `useTranslationState` | `src/hooks/useTranslationState.ts` | Central state: translations, navigation, file loading, filtering, completion flow. ~1200 lines. |
| `useLiveEdit` | `src/hooks/useLiveEdit.ts` | LIVE EDIT mode: toggle, single-line sync, batch sync, dirty tracking. Extracted from useTranslationState. |
| `useBulkTranslate` | `src/hooks/useBulkTranslate.ts` | AI Translate Sheet (Ctrl+Shift+T): batch translate all lines, review mode, accept/reject. |
| `useAiSuggestion` | `src/hooks/useAiSuggestion.ts` | Per-line AI suggestion: auto-fetch on navigate, upgrade from Haiku→Sonnet. |
| `useTextOperations` | `src/hooks/useTextOperations.ts` | Text manipulation utilities. |
| `useTranslationCore` | `src/hooks/useTranslationCore.ts` | Core translation utilities. |

### Data Flow
- **Codex** (Screen 1): `CodexEditor.tsx` → `/api/codex` → `data/csv/codex_translations.csv`
- **Translation LIVE EDIT** (Screen 2): `useLiveEdit.ts` → `/api/xlsx-save` → `excels/{file}.xlsx`
- **AI Suggestions**: `/api/ai-suggest` → Claude API (Haiku/Sonnet/Opus configurable)
- **Bulk Translate**: `useBulkTranslate.ts` → `/api/ai-suggest` with model selection
- **Translation Memory**: `data/translation-memory.jsonl` — persisted across sessions

### API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/ai-suggest` | POST | AI translation suggestion (model: haiku/sonnet/opus) |
| `/api/xlsx-save` | POST | Write single cell to Excel file in `excels/` |
| `/api/xlsx-save` | GET | Check file existence/last modified |
| `/api/xlsx-files/load` | GET | Load Excel file buffer from `excels/` |
| `/api/xlsx-files` | GET | List Excel files in `excels/` |
| `/api/codex` | GET/POST/PUT/DELETE | CRUD for codex entries in CSV |
| `/api/csv-data` | GET | Read CSV translation data |
| `/api/csv-files` | GET | List CSV files |
| `/api/json-data` | GET | Read JSON translation data |
| `/api/json-files` | GET | List JSON files |
| `/api/translation-memory` | GET/POST | Translation memory JSONL |
| `/api/style-analysis` | POST | Speaker style analysis via Claude |
| `/api/persist-translation` | POST | Legacy persist route |
| `/api/reset-originals` | POST | Reset translations to originals |

## Recent Changes (This Session)

### 1. Live Edit Batch Sync & Cleanup
**Design doc**: `docs/plans/2026-03-07-live-edit-batch-sync-design.md`

- `useLiveEdit.ts` fully rewritten (was unused stub):
  - `getDirtyIndices()` — compares `translations[]` vs `originalTranslations[]`
  - `dirtyCount` — memoized count of dirty entries
  - `syncCurrentTranslation()` — single-line sync to `/api/xlsx-save` on navigate
  - `startBatchSync()` — sequential writes with 100ms delay, progress tracking
  - `toggleLiveEditMode()` — on toggle-on, checks dirty count, shows modal if >0
  - Modal state: `showSyncModal`, `syncModalDirtyCount`, `isBatchSyncing`, `batchSyncProgress`, `batchSyncTotal`

- `useTranslationState.ts` — removed ~90 lines of inlined live edit logic, wires `useLiveEdit` hook

- `TranslationHelper.tsx` — added batch sync confirmation modal (emerald/teal themed, progress bar)

### 2. Model Selector for AI Translate Sheet
- `useBulkTranslate.ts` — `startBulkTranslate(model)` now accepts model parameter
- `TranslationHelper.tsx` — 3-button selector (Haiku/Sonnet/Opus) in Ctrl+Shift+T modal
  - Color-coded: amber/purple/violet
  - Descriptions: "Fast & cheap" / "Balanced" / "Best quality"
  - Dynamic subtitle: "Powered by Claude {model}"
  - Default: Opus

### 3. CodexEditor Table Styling
- Color-coded category badges: CHARACTER=blue, LOCATION=emerald, ITEM=amber, CONCEPT=purple, ORGANIZATION=rose, SPECIES=cyan, TERM=orange
- Table: `border-2`, `table-fixed`, `max-h-[600px]`, alternating rows, `font-black` headers, proportional column widths (18/32/32/18)

### 4. SetupWizard Widening
- Wider layout for desktop use

## Key Constants & Patterns

- `BLANK_PLACEHOLDER` = `'[BLANK, REMOVE LATER]'` — from `src/constants/translations.ts`
- Translation column default: `J` (configurable via language detection)
- Start row default: `3` (configurable)
- Cell references: `${translationColumn}${startRow + index}`
- Excel files stored in: `excels/` directory at project root
- ExcelJS used for writing (preserves formatting)
- XLSX.js used for reading (client-side parsing)

## Uncommitted Data Files
These are runtime data, not source code:
- `data/csv/codex_translations.csv` — codex entries
- `data/json/codex_translations.json` — codex JSON mirror
- `data/translation-memory.jsonl` — translation memory
- `.claude/settings.local.json` — local Claude settings

## Git State
- Branch: `master`
- 21 commits ahead of origin
- Latest commit: `34f4540` — feat: live edit batch sync, model selector, codex table styling
