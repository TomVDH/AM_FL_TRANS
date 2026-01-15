# Field Labeling Improvement Index
## Screen 2: Main Translation Interface

This document catalogs all data fields displayed on Screen 2 and suggests improved, user-friendly labels.

---

## LEFT COLUMN: Source Text Display

### Current Implementation Issues:
- Technical variable names don't match user-facing labels
- Some fields lack clear context
- Abbreviations may be confusing to new users

### Field Mapping & Improvements:

| Current Label | Data Source | Location | Suggested Improvement | Rationale |
|---------------|-------------|----------|----------------------|-----------|
| `J{row}` badge | `J${startRow + currentIndex}` | Line 1087, 1249 | **"Row J{row}"** or **"Excel: J{row}"** | Clearer that it's an Excel row reference |
| "Speaker:" | `utterers[currentIndex]` | Line 1090, 1273 | **"Character:"** or **"Speaker Name:"** | More descriptive, "utterer" is not user-friendly |
| "EN" toggle button | Toggle for `showInlineSource` | Line 1103, 1262 | **"Show Original"** or **"EN Source"** | Clearer what the button does |
| "Source" label | `sourceTexts[currentIndex]` | Line 1139 | **"Original English Text"** | More explicit |
| "NL:" prefix | `translations[currentIndex]` | Line 1308 | **"Dutch (Existing):"** or **"Previous Translation:"** | Clarifies it's the loaded translation |
| "Prev" context | Previous entry preview | Line 1225 | **"Previous Line:"** | More intuitive |
| "Next" preview | Next entry preview | Line 1381 | **"Coming Up:"** or **"Next Line:"** | More conversational |

---

## RIGHT COLUMN: Input/Output Tabs

### Input Tab

| Current Label | Data Source | Location | Suggested Improvement | Rationale |
|---------------|-------------|----------|----------------------|-----------|
| "Modified" badge | `hasCurrentEntryChanged()` | Line 1450 | **"Changes Detected"** or **"Unsaved Changes"** | More explicit about what it means |
| "Unchanged" badge | `!hasCurrentEntryChanged()` | Line 1455 | **"No Changes"** or **"Same as Loaded"** | Clearer status |
| "UI" mode button | Gamepad mode toggle | Line 1567 | **"Game View"** or **"Visual Mode"** | More descriptive of what it does |
| "HL" mode button | Highlight mode | Line 1584 | **"Highlights"** or **"Codex"** | Full word better than abbreviation |
| "Ref" mode button | XLSX/Reference mode | Line 1601 | **"References"** or **"Lookup"** | More intuitive |

### Output Tab

| Current Label | Data Source | Location | Suggested Improvement | Rationale |
|---------------|-------------|----------|----------------------|-----------|
| "OUTPUT" header | Tab title | Line 1615 | **"Translation Output"** or **"Your Translations"** | More descriptive |
| "CSV" mode button | CSV export mode | Line 1628 | **"Copy Mode"** or **"Export Mode"** | Clarifies the purpose |
| "Live Edit" button | Direct Excel edit mode | Line 1649 | Keep as is ✓ | Already clear |
| "Current" stat | `currentIndex + 1` | Line 1824 | **"Row Number"** or **"Current Row"** | More explicit |
| "Filled" stat | `filterStats.completed` | Line 1828 | **"Completed"** or **"Translations Done"** | More accurate |
| "Modified" stat | `filterStats.modified` | Line 1832 | **"Changed"** or **"Edited Entries"** | Clearer meaning |
| "Progress" stat | Percentage complete | Line 1836 | **"Completion %"** or **"Overall Progress"** | More specific |

---

## TECHNICAL FIELD NAMES (Backend/Code)

These are the underlying data structures that could be confusing when debugging or extending:

| Variable Name | Purpose | Suggested Internal Comment/Doc |
|---------------|---------|-------------------------------|
| `utterers` | Character/speaker names | "Character names or dialogue speakers" |
| `sourceTexts` | English source strings | "Original English text to be translated" |
| `translations` | Dutch translation output | "User's Dutch translations (Column J)" |
| `currentIndex` | Active translation row (0-indexed) | "Zero-based index into arrays" |
| `startRow` | First Excel row number | "Starting row in Excel (1-indexed)" |
| `cellStart` | Excel cell reference start | "Starting cell reference (e.g., J5)" |
| `originalTranslations` | Loaded Dutch values | "Initial Dutch translations from Column J" |
| `filterStats` | Translation completion stats | "Counts of completed, modified, blank entries" |
| `xlsxMode` | Reference tools visibility | "Whether reference lookup panel is open" |
| `highlightMode` | Codex highlighting active | "Whether character name highlighting is on" |
| `gamepadMode` | JRPG-style UI view | "Whether game dialogue box style is active" |
| `showInlineSource` | Source text visibility toggle | "Whether English source is shown inline" |
| `showAllEntries` | Output display filter | "Show all vs. only modified translations" |

---

## RECOMMENDED PRIORITY CHANGES

### High Priority (User-Facing Confusion):
1. **"Speaker" → "Character"** throughout the interface
2. **"EN" button → "Show Original"** for clarity
3. **"Output" header → "Translation Output"** more descriptive
4. **Stats labels** - Make all more explicit (Current → Current Row, Filled → Completed, etc.)

### Medium Priority (Clarity Improvements):
5. **"NL:" → "Dutch (Existing):"** clarifies it's pre-loaded
6. **Mode buttons** - Spell out abbreviations (HL → Highlights, Ref → References)
7. **Badge improvements** - Add context (J5 → Row J5 or Excel: J5)

### Low Priority (Nice-to-Have):
8. **Preview labels** - "Prev" → "Previous Line", "Next" → "Coming Up"
9. **Status badges** - More verbose descriptions
10. **Technical tooltips** - Add hover explanations for all buttons

---

## IMPLEMENTATION NOTES

### Approach:
- Most changes are simple string replacements in [TranslationHelper.tsx](../src/components/TranslationHelper.tsx)
- Some may require adjusting CSS classes if text length changes significantly
- Consider adding `title` attributes for tooltips on abbreviated labels
- Test on both light and dark modes after changes

### Files to Modify:
- Primary: `src/components/TranslationHelper.tsx` (lines 1070-1840)
- Secondary: `src/hooks/useTranslationState.ts` (internal comments)
- CSS: `src/app/globals.css` (if spacing adjustments needed)

---

*Document created: 2026-01-12*
*Last updated: 2026-01-12*
