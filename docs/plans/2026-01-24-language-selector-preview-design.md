# Language Selector & Excel Preview Design

**Date:** 2026-01-24
**Status:** Ready for implementation

---

## Overview

Make the translation language selectable from the start of the workflow, with automatic detection of available languages from Excel column headers. Include an Excel-style preview showing sample rows from beginning, middle, and end of the selected sheet.

---

## New Workflow Order

**Current:**
```
File Select → Sheet Select → Language Column → Start
```

**New:**
```
File Select → Language Select (auto-detected) → Sheet Select (with preview) → Start
```

---

## Language Detection

### Detection Logic

On file load, scan row 1 (header row) of each sheet. Match headers against language keywords:

```typescript
const LANGUAGE_KEYWORDS: Record<string, string> = {
  'dutch': 'NL', 'nl': 'NL', 'nederlands': 'NL',
  'portuguese': 'PT', 'pt': 'PT', 'português': 'PT',
  'spanish': 'ES', 'es': 'ES', 'español': 'ES',
  'french': 'FR', 'fr': 'FR', 'français': 'FR',
  'german': 'DE', 'de': 'DE', 'deutsch': 'DE',
  'italian': 'IT', 'it': 'IT', 'italiano': 'IT',
  'english': 'EN', 'en': 'EN',
  'russian': 'RU', 'ru': 'RU',
  'japanese': 'JA', 'ja': 'JA',
  'korean': 'KO', 'ko': 'KO',
  'chinese': 'ZH', 'zh': 'ZH',
};
```

### Detection Output

```typescript
interface DetectedLanguage {
  code: string;           // "NL", "PT", etc.
  name: string;           // "Dutch", "Portuguese", etc.
  column: string;         // "J", "K", etc.
  sheets: string[];       // Which sheets have this language
  totalSheets: number;    // Total sheets in workbook
}
```

---

## Language Selector UI

```
┌─────────────────────────────────────────────────┐
│ 🌐 TARGET LANGUAGE                              │
├─────────────────────────────────────────────────┤
│ ▼ [Dutch (NL) — Column J          ]             │
│                                                 │
│   Available in 12 of 14 sheets                  │
│   ✓ Detected from column headers                │
└─────────────────────────────────────────────────┘
```

- Dropdown: `{Language Name} ({Code}) — Column {Letter}`
- Subtitle shows sheet coverage
- Warning if language missing from some sheets

---

## Excel-Style Preview

### Sample Selection

- **Beginning:** rows 2-4 (first 3 data rows after header)
- **Middle:** 3 rows from ~50% through the data
- **End:** last 3 rows
- **Total:** ~9 sample rows + 1 header row

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ SHEET PREVIEW                                          Sheet1 ▼    │
├─────┬─────────────────────────────┬─────────────────────────────────┤
│     │           C                 │              J                  │
│     │       English               │            Dutch                │
├─────┼─────────────────────────────┼─────────────────────────────────┤
│  2  │ Hello, how are you?         │ Hallo, hoe gaat het?            │
│  3  │ I'm doing great!            │ Ik doe het geweldig!            │
│  4  │ What a beautiful day.       │ Wat een prachtige dag.          │
├─────┼─────────────────────────────┼─────────────────────────────────┤
│ ... │           ⋮                 │              ⋮                  │
├─────┼─────────────────────────────┼─────────────────────────────────┤
│ 117 │ See you tomorrow.           │ Tot morgen.                     │
│ 118 │ Take care of yourself.      │ Pas goed op jezelf.             │
│ 119 │ Goodbye!                    │ [empty - orange highlight]      │
├─────┼─────────────────────────────┼─────────────────────────────────┤
│ ... │           ⋮                 │              ⋮                  │
├─────┼─────────────────────────────┼─────────────────────────────────┤
│ 234 │ The end.                    │ Het einde.                      │
│ 235 │ Credits                     │ Aftiteling                      │
│ 236 │ Thanks for playing!         │ Bedankt voor het spelen!        │
└─────┴─────────────────────────────┴─────────────────────────────────┘
│ ⚠ 3 empty cells detected in Dutch column                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Styling

- **Header row:** Excel green (#217346)
- **Header content:** Column letters + header names
- **Row numbers:** Gray left column
- **Row backgrounds:** Alternating white/light gray
- **Cell borders:** Subtle gridlines
- **Empty cells:** Orange background with "—"
- **Warning banner:** Bottom of preview if issues detected

---

## Validation & Warnings

### Validation Checks (on sheet/language change)

1. Does selected language column exist in this sheet?
2. How many cells are empty vs filled?
3. Is English (source) column present and populated?

### Warning States

| Condition | Display |
|-----------|---------|
| Language column missing | Red banner: "Dutch (Column J) not found in this sheet" |
| >50% empty cells | Orange warning: "78 of 156 rows are empty" |
| <10% empty cells | Subtle note: "3 empty cells detected" |
| All cells filled | Green checkmark |
| English column empty | Red banner: "Source English column appears empty" |

---

## State Flow

```
File loads
    ↓
detectLanguages() scans all sheet headers
    ↓
Populate language dropdown (auto-select first detected)
    ↓
Language selected → cache column letter → enable sheet selector
    ↓
Sheet selected → fetchPreviewRows() [debounced 300ms]
    ↓
Render preview with validation warnings
    ↓
Language changed → re-fetch preview with new column
```

---

## Start Button State

**Enabled when:**
- File loaded
- Language selected
- Sheet selected
- Source column has data

**Disabled:** Tooltip explains what's missing

---

## Refresh Behavior

- **Trigger:** Any change to file, language, or sheet selection
- **Debounce:** 300ms after last change
- **Loading state:** Spinner in preview area during fetch

---

## Implementation Notes

### New Components Needed

1. `LanguageSelector.tsx` - Dropdown with detected languages
2. `SheetPreview.tsx` - Excel-style preview table

### State Additions

```typescript
// In useTranslationState or SetupWizard
const [detectedLanguages, setDetectedLanguages] = useState<DetectedLanguage[]>([]);
const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
const [previewLoading, setPreviewLoading] = useState(false);
const [previewWarnings, setPreviewWarnings] = useState<string[]>([]);
```

### Helper Functions

```typescript
// Scan workbook for language columns
function detectLanguagesInWorkbook(workbook: XLSX.WorkBook): DetectedLanguage[]

// Get sample rows for preview
function getPreviewRows(
  worksheet: XLSX.WorkSheet,
  sourceCol: string,
  targetCol: string,
  startRow: number
): PreviewRow[]
```
