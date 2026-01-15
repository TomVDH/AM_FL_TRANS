# Programmatic Field Index
## Screen 2: Input and Output Fields - Technical Reference

This document provides a programmatic index of all input/output fields in the translation interface.

---

## INPUT TAB FIELDS

### Translation Input Textarea
- **Component**: `<textarea>` element
- **Location**: TranslationHelper.tsx:1461-1478
- **Value Binding**: `value={currentTranslation}`
- **Change Handler**: `onChange={(e) => setCurrentTranslation(e.target.value)}`
- **Placeholder**: `"Enter your translation..."`
- **Ref**: `textareaRef`
- **State Variable**: `currentTranslation` (string)
- **Auto-focus**: Yes
- **Keyboard Shortcut**: Shift+Enter to submit
- **Styling**:
  - Modified state: Green border (`border-green-400`), green background tint (`bg-green-50`)
  - Unchanged state: Gray border (`border-gray-300`), gray background (`bg-gray-50`)

### Change Detection Badge
- **Location**: TranslationHelper.tsx:1446-1458
- **Logic**: `hasCurrentEntryChanged()`
- **States**:
  - **Modified**: Green badge with pulsing dot, "Modified" label
  - **Unchanged**: Gray badge with static dot, "Unchanged" label
- **Comparison**: Compares `currentTranslation` to `originalTranslations[currentIndex]`

### Mode Toggle Buttons
1. **Game View (formerly "UI")**
   - Variable: `gamepadMode` (boolean)
   - Toggle: `toggleGamepadMode()`
   - Label: "Game View"

2. **Highlights (formerly "HL")**
   - Variable: `highlightMode` (boolean)
   - Toggle: `toggleHighlightMode()`
   - Label: "Highlights"

3. **References (formerly "Ref")**
   - Variable: `xlsxMode` (boolean)
   - Toggle: `toggleXlsxMode()`
   - Label: "References"

### Submit Button
- **Location**: TranslationHelper.tsx:1487-1500
- **Handler**: `handleSubmitWithSync()`
- **Label**: Dynamic - "Complete" on last entry, "Submit" otherwise
- **Disabled When**: `syncStatus === 'syncing'`

---

## OUTPUT TAB FIELDS

### Output Display Format
- **Type**: Table (`<table>`)
- **Location**: TranslationHelper.tsx:1790-1941
- **Key Prop**: `outputKey` (forces re-render when incremented)

### Table Columns

#### 1. Cell Reference Column
- **Header**: "Cell"
- **Width**: `w-20`
- **Data**: `J${excelRow}` where `excelRow = startRow + idx`
- **Format**: Monospace badge (e.g., "J5", "J10")
- **Tooltip**: Shows full Excel row number

#### 2. Character Column
- **Header**: "Character"
- **Width**: `w-32`
- **Data Source**: `utterers[idx]` processed through `trimSpeakerName()`
- **Empty State**: "No speaker" (italic gray text)
- **Format**: Purple badge for character names

#### 3. Dutch Translation Column
- **Header**: "Dutch Translation"
- **Data Source**: `translations[idx]`
- **Empty State**: "Blank entry" (italic gray text)
- **Format**: Plain text, full width

#### 4. Status Column
- **Header**: "Status"
- **Width**: `w-24`
- **Logic**: Compares `translations[idx]` to `originalTranslations[idx]`
- **States**:
  - **Modified**: Green badge with dot, "Modified" label
  - **Original**: Gray badge with dot, "Original" label

#### 5. Actions Column
- **Header**: "Actions"
- **Width**: `w-20`
- **Action**: Jump to entry button (eye icon)
- **Behavior**: Sets `currentIndex` to that entry and switches to Input tab

### Row Highlighting
- **Current Row**: Blue background (`bg-blue-50`) with blue ring (`ring-blue-400`)
- **Modified Rows**: Green background tint (`bg-green-50`)
- **Hover**: Gray background on hover (`hover:bg-gray-50`)

### Filter/Display Modes

#### Show All vs. Modified Only Toggle
- **Variable**: `showAllEntries` (boolean)
- **Toggle**: `setShowAllEntries(!showAllEntries)`
- **Button Labels**:
  - When true: "Show All"
  - When false: "Modified Only"
- **Filter Logic**:
  ```typescript
  if (!showAllEntries && !hasBeenModified && !(wasOriginallyBlank && isNowFilled)) {
    return null; // Hide entry
  }
  ```

### Copy Functionality

#### 1. Copy with Cell References
- **Handler**: `copyWithCellRefs()`
- **Format**: `J5: translation text` (one per line)
- **Purpose**: Manual paste with cell references

#### 2. Copy Values Only
- **Handler**: `copyToClipboard()`
- **Format**: Just translation text (one per line)
- **Purpose**: Sequential paste starting at first modified cell

### Paste Guidance Indicator
- **Logic**: Checks if modified entries are contiguous
- **Contiguous**: Green badge - "✓ Contiguous: Paste to J{first}"
- **Non-contiguous**: Amber badge - "⚠ Non-contiguous: Use cell refs"

---

## STATISTICS COUNTERS

Located at: TranslationHelper.tsx:1945-1962

### 1. Current Row
- **Data**: `currentIndex + 1`
- **Label**: "Current Row"
- **Format**: Large number with label below

### 2. Completed
- **Data**: `filterStats.completed`
- **Label**: "Completed"
- **Logic**: Counts non-blank translations

### 3. Changed
- **Data**: `filterStats.modified`
- **Label**: "Changed"
- **Logic**: Counts entries that differ from `originalTranslations`
- **Styling**: Blue background

### 4. Overall Progress
- **Data**: `Math.round(progress)%`
- **Label**: "Overall Progress"
- **Logic**: Percentage of completed translations

---

## OUTPUT MANAGEMENT FUNCTIONS

### Export Translations
- **Function**: `exportTranslations()`
- **Location**: useTranslationState.ts:685-725
- **Output Format**: CSV file
- **Filename**: `translations.csv`
- **Structure**:
  ```csv
  Sheet Name,{selectedSheet},
  Tab Name,{selectedSheet},
  Key,Original,Translated
  J5,English text,Dutch translation
  ...
  ```
- **Includes**: ALL translations (not just modified)
- **CSV Escaping**: Handles commas, quotes, newlines properly

### Reset Output Display
- **Function**: `resetOutputDisplay()`
- **Location**: useTranslationState.ts:741-747
- **Behavior**:
  1. Clears all translations → `'[BLANK, REMOVE LATER]'`
  2. Clears current translation input
  3. Increments `outputKey` to force re-render
- **Note**: Does NOT clear `originalTranslations` - those remain for comparison

### Clear Button Handler
- **Function**: `handleClearWithConfirmation()`
- **Location**: TranslationHelper.tsx:175-185
- **Behavior**:
  1. Checks if modified entries exist
  2. Shows confirmation dialog if modifications present
  3. Calls `resetOutputDisplay()` if confirmed

---

## LIVE EDIT MODE

### Requirements
- **File Type**: Must load an Excel file (`loadedFileType === 'excel'`)
- **Directory**: `/excels` (currently empty)
- **Disabled If**: CSV or JSON file loaded

### Variables
- **Mode**: `liveEditMode` (boolean)
- **Sync Status**: `syncStatus` ('idle' | 'syncing' | 'synced' | 'error')
- **Last Sync**: `lastSyncTime` (Date object)
- **Target File**: `{loadedFileName}_EDITED.xlsx`

### Sync Function
- **Function**: `syncCurrentTranslation()`
- **When**: Called before navigation (Submit/Previous)
- **API Endpoint**: `/api/xlsx-save` (needs implementation)
- **Current Status**: ⚠️ API route needs to be created

### Live Edit Setup
1. Place Excel files in `/excels` directory
2. Load file through Setup Wizard
3. Enable "Live Edit" mode in Output tab
4. Translations sync automatically on navigation
5. Modified file saved as `{original}_EDITED.xlsx`

---

## DATA FLOW SUMMARY

```
User Input → currentTranslation (state)
           ↓
    handleSubmit()
           ↓
    Compare to originalTranslations[currentIndex]
           ↓
    If changed → Update translations[currentIndex]
           ↓
    Navigate → Next entry
           ↓
    Output Tab → Render table from translations[]
           ↓
    Show only modified entries (if filtered)
           ↓
    Export → CSV with all translations
```

---

## INDEXING SUMMARY

### State Variables (Read/Write)
- `currentTranslation` - Active input field value
- `translations[]` - Array of all translation strings
- `originalTranslations[]` - Initial values for change detection
- `currentIndex` - Current row being edited (0-indexed)
- `showAllEntries` - Filter toggle for output display
- `liveEditMode` - Live Excel edit mode toggle
- `outputKey` - Re-render key for output component

### Computed Values (Read-Only)
- `hasCurrentEntryChanged()` - Boolean if current differs from original
- `filterStats.completed` - Count of filled translations
- `filterStats.modified` - Count of changed translations
- `progress` - Percentage complete
- `getModifiedEntriesForExcel()` - Array of changed entries with Excel refs

---

*Document created: 2026-01-14*
*Purpose: Technical reference for programmatic field access*
