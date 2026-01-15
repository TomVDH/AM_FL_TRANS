# Field Definitions Reference
## Complete Index of All Data Display Fields

This document defines every field displayed in the translation interface, categorizing them by type and providing their exact purposes.

---

## FIELD CATEGORIES

### 1. INPUT FIELDS (User Editable)
Fields where users directly enter or modify data.

### 2. OUTPUT FIELDS (Display Only)
Fields that display computed or retrieved data, not directly editable.

### 3. REFERENCE FIELDS (Lookup Data)
Fields displaying reference information from JSON/CSV/Excel sources.

### 4. METADATA FIELDS (Context Information)
Fields showing file, row, or session context.

---

## INPUT FIELDS

### Primary Translation Input
**Field Name**: Translation Input Textarea
**Variable**: `currentTranslation`
**Type**: `string`
**Location**: TranslationHelper.tsx:1461
**Purpose**: User enters Dutch translation for current source text
**Binding**: `value={currentTranslation}`
**Handler**: `onChange={(e) => setCurrentTranslation(e.target.value)}`
**Validation**: None (accepts any string)
**Max Length**: Unlimited
**Placeholder**: "Enter your translation..."

**State Management**:
```typescript
const [currentTranslation, setCurrentTranslation] = useState<string>('');
```

**Used In**:
- Input tab textarea
- Change detection (`hasCurrentEntryChanged()`)
- Submit/navigation handlers
- Live Edit sync

---

## OUTPUT FIELDS (Table Display)

### 1. Cell Reference Column
**Field Name**: Excel Cell Reference
**Variable**: Computed from `startRow + idx`
**Type**: `string` (format: "J5", "J10", etc.)
**Location**: Table column 1
**Purpose**: Shows which Excel cell this translation maps to
**Formula**: `J${startRow + idx}`
**Display Format**: Monospace badge
**Example**: "J5" for row 5 in column J

**Computation**:
```typescript
const excelRow = startRow + idx;
const cellRef = `J${excelRow}`;
```

### 2. Character Name Column
**Field Name**: Character/Speaker Name
**Variable**: `utterers[idx]`
**Type**: `string`
**Location**: Table column 2
**Purpose**: Displays who is speaking the line
**Processing**: Passed through `trimSpeakerName()`
**Display Format**: Purple badge
**Empty State**: "No speaker" (italic gray)

**Source Data**:
```typescript
utterers: string[] // Array of character names
```

**Processing Function**:
```typescript
const trimSpeakerName = (name: string) => {
  // Removes brackets, trims whitespace
  return name.replace(/[\[\]]/g, '').trim();
};
```

### 3. Dutch Translation Column
**Field Name**: Translation Text
**Variable**: `translations[idx]`
**Type**: `string`
**Location**: Table column 3
**Purpose**: Displays the user's Dutch translation
**Display Format**: Plain text, full width
**Empty State**: "Blank entry" (italic gray)
**Blank Value**: `'[BLANK, REMOVE LATER]'`

**Source Data**:
```typescript
translations: string[] // Array of translation strings
```

### 4. Status Column
**Field Name**: Modification Status
**Variable**: Computed from comparison
**Type**: `boolean` (isModified)
**Location**: Table column 4
**Purpose**: Shows if translation differs from original
**Display Format**: Badge with dot indicator
**States**:
- **Modified**: Green badge, green dot, "Modified" label
- **Original**: Gray badge, gray dot, "Original" label

**Computation**:
```typescript
const originalValue = originalTranslations[idx] || '[BLANK, REMOVE LATER]';
const hasBeenModified = translations[idx] !== originalValue;
const wasOriginallyBlank = originalValue === '[BLANK, REMOVE LATER]' || originalValue === '';
const isNowFilled = translations[idx] !== '[BLANK, REMOVE LATER]' && translations[idx] !== '';
const isModified = hasBeenModified || (wasOriginallyBlank && isNowFilled);
```

### 5. Actions Column
**Field Name**: Jump to Entry Button
**Variable**: N/A (action button)
**Type**: Button with onClick handler
**Location**: Table column 5
**Purpose**: Navigate to this entry in Input tab
**Icon**: Eye icon
**Handler**: `onClick={() => { setCurrentIndex(entry.idx); setActiveTab('input'); }}`

---

## REFERENCE FIELDS (Left Column)

### Source Text Display
**Field Name**: English Source Text
**Variable**: `sourceTexts[currentIndex]`
**Type**: `string`
**Location**: Left column main display
**Purpose**: Shows original English text to translate
**Component**: TextHighlighter
**Features**: Character name highlighting, suggestion markers

**Source Data**:
```typescript
sourceTexts: string[] // Array of English source strings
```

### Character Badge (in source display)
**Field Name**: Speaker Name Badge
**Variable**: `utterers[currentIndex]`
**Type**: `string`
**Location**: Above source text in game mode
**Purpose**: Shows current speaker in JRPG-style nameplate
**Display Format**: Pixel-style tab badge
**Processing**: `trimSpeakerName()`

### Existing Dutch Translation (Reference)
**Field Name**: Loaded Dutch Translation
**Variable**: `translations[currentIndex]` (when loaded from file)
**Type**: `string`
**Location**: Below source text in main display
**Purpose**: Shows existing Dutch translation from Column J
**Display Format**: Italic gray text with "NL:" prefix
**Label**: "Dutch (Existing):"

### Previous Entry Context
**Field Name**: Previous Line Preview
**Variable**: `sourceTexts[currentIndex - 1]`
**Type**: `string`
**Location**: Above current source (when available)
**Purpose**: Provides context from previous dialogue line
**Display Format**: Truncated to 100 chars, italic gray
**Includes**: Cell ref badge, speaker name

### Next Entry Preview
**Field Name**: Next Line Preview
**Variable**: `sourceTexts[currentIndex + 1]`
**Type**: `string`
**Location**: Below current source (when available)
**Purpose**: Shows upcoming dialogue line
**Display Format**: Single line with speaker name
**Styling**: Blue accent for "Next" badge

---

## METADATA FIELDS

### Current Row Indicator
**Field Name**: Current Row Number
**Variable**: `currentIndex + 1`
**Type**: `number` (display as integer)
**Location**: Stats bar, Input tab
**Purpose**: Shows which translation user is working on (1-indexed)
**Format**: "Row: 5"

**Note**: Internal index is 0-based, display is 1-based for user friendliness.

### Completed Count
**Field Name**: Completed Translations Count
**Variable**: `filterStats.completed`
**Type**: `number`
**Location**: Stats bar
**Purpose**: Shows how many translations are filled
**Format**: "Done: 12"
**Computation**: Counts non-blank entries in `translations[]`

### Changed Count
**Field Name**: Modified Entries Count
**Variable**: `filterStats.modified`
**Type**: `number`
**Location**: Stats bar
**Purpose**: Shows how many translations differ from original
**Format**: "Changed: 3"
**Styling**: Blue text to highlight importance
**Computation**: Compares `translations[]` to `originalTranslations[]`

### Progress Percentage
**Field Name**: Overall Progress
**Variable**: `progress` (computed)
**Type**: `number` (percentage)
**Location**: Stats bar
**Purpose**: Shows translation completion percentage
**Format**: "Progress: 45%"
**Computation**: `(completed / total) * 100`

### File Name Display
**Field Name**: Loaded File Name
**Variable**: `loadedFileName`
**Type**: `string`
**Location**: Header area (when file loaded)
**Purpose**: Shows which file is currently loaded
**Example**: "2_asses.masses_E2Proxy.xlsx"

### File Type Badge
**Field Name**: Data Mode Indicator
**Variable**: `loadedFileType`
**Type**: `'excel' | 'json' | 'csv' | 'manual'`
**Location**: Header area
**Purpose**: Shows source data format
**Display**: Colored badge
**Colors**:
- Excel: Green
- JSON: Blue
- CSV: Purple
- Manual: Gray

### Sheet Name
**Field Name**: Selected Sheet Name
**Variable**: `selectedSheet`
**Type**: `string`
**Location**: Various contexts
**Purpose**: Identifies which Excel sheet is active
**Example**: "Sheet1"

### Start Row Number
**Field Name**: Starting Excel Row
**Variable**: `startRow`
**Type**: `number` (1-indexed)
**Location**: Setup configuration
**Purpose**: Defines first row of translation data
**Default**: Typically row 5 (after headers)

---

## COMPUTED FIELDS

### Change Detection Status
**Field Name**: Entry Change Status
**Function**: `hasCurrentEntryChanged()`
**Returns**: `boolean`
**Purpose**: Detects if current translation differs from original
**Display**: Badge showing "Modified" or "Unchanged"

**Logic**:
```typescript
const hasCurrentEntryChanged = () => {
  const original = getCurrentOriginalValue();
  const current = currentTranslation.trim();

  // Empty-to-empty is not a change
  if ((!original || original === '[BLANK, REMOVE LATER]') &&
      (!current || current === '[BLANK, REMOVE LATER]')) {
    return false;
  }

  return current !== original;
};
```

### Excel Cell Location
**Field Name**: Full Cell Reference
**Function**: `getCellLocation(idx: number)`
**Returns**: `string` (e.g., "J5")
**Purpose**: Computes Excel cell reference for any index
**Formula**: `J${startRow + idx}`

### Filter Stats Object
**Field Name**: Translation Statistics
**Variable**: `filterStats`
**Type**: `object`
**Properties**:
```typescript
{
  completed: number,   // Count of filled translations
  modified: number,    // Count of changed translations
  blank: number,       // Count of blank entries
  total: number        // Total entries
}
```

---

## REFERENCE PANEL FIELDS

### XLSX Search Term
**Field Name**: Excel Search Input
**Variable**: `xlsxSearchTerm`
**Type**: `string`
**Purpose**: User's search query for Excel reference data
**Binding**: Input field in Reference Tools Panel

### Global Search Toggle
**Field Name**: Search All Sheets Toggle
**Variable**: `globalSearch`
**Type**: `boolean`
**Purpose**: Whether to search all sheets or just selected
**Default**: `false`

### Selected XLSX File
**Field Name**: Active Reference File
**Variable**: `selectedXlsxFile`
**Type**: `string`
**Purpose**: Which Excel file is loaded for reference
**Source**: Files from `/excels` directory

### Selected XLSX Sheet
**Field Name**: Active Reference Sheet
**Variable**: `selectedXlsxSheet`
**Type**: `string`
**Purpose**: Which sheet within the file is active

---

## FIELD TYPE SUMMARY

### User Input Fields (1)
1. `currentTranslation` - Primary translation textarea

### Display Arrays (3)
1. `sourceTexts[]` - English source strings
2. `utterers[]` - Character/speaker names
3. `translations[]` - Dutch translations

### Comparison/Tracking (1)
1. `originalTranslations[]` - Initial loaded values for change detection

### Index/Navigation (2)
1. `currentIndex` - Active translation index (0-based)
2. `startRow` - Excel starting row (1-based)

### File Metadata (4)
1. `loadedFileName` - Active file name
2. `loadedFileType` - File format type
3. `selectedSheet` - Active sheet name
4. `workbookData` - Full Excel workbook object

### Computed Stats (4)
1. `filterStats.completed` - Filled count
2. `filterStats.modified` - Changed count
3. `filterStats.blank` - Empty count
4. `progress` - Percentage complete

### Mode Toggles (3)
1. `gamepadMode` - JRPG-style UI toggle
2. `highlightMode` - Character highlighting toggle
3. `xlsxMode` - Reference panel toggle

### Live Edit (3)
1. `liveEditMode` - Direct Excel editing toggle
2. `syncStatus` - Sync state indicator
3. `lastSyncTime` - Last successful sync timestamp

---

## WHICH FIELDS ARE "FIELDS"?

### ✅ TRUE FIELDS (Data Input/Display)
These display or accept actual data values:

1. **Translation Input** - `currentTranslation`
2. **Source Text** - `sourceTexts[currentIndex]`
3. **Character Name** - `utterers[currentIndex]`
4. **Dutch Translation** - `translations[currentIndex]`
5. **Cell Reference** - `J${startRow + currentIndex}`
6. **Previous Text** - `sourceTexts[currentIndex - 1]`
7. **Next Text** - `sourceTexts[currentIndex + 1]`
8. **XLSX Search** - `xlsxSearchTerm`

### ⚠️ COMPUTED FIELDS (Derived Data)
These show calculations or transformations:

1. **Status Badge** - Computed from comparison
2. **Row Number** - `currentIndex + 1`
3. **Completed Count** - Computed from array
4. **Changed Count** - Computed from comparison
5. **Progress %** - Computed from counts

### ❌ NOT FIELDS (UI Controls)
These are buttons, toggles, or navigation elements:

1. Mode toggle buttons (Game View, Highlights, References)
2. Submit/Previous navigation buttons
3. Copy/Export/Clear action buttons
4. Jump-to-entry button
5. Filter toggle (All/Modified)

---

## DATA FLOW DIAGRAM

```
File Load
    ↓
sourceTexts[] ← Parsed from Excel Column C
utterers[] ← Parsed from Excel Column A
originalTranslations[] ← Parsed from Excel Column J
    ↓
currentIndex = 0
    ↓
Display:
    sourceTexts[currentIndex] → Source Text Field
    utterers[currentIndex] → Character Field
    translations[currentIndex] → Existing Translation Field
    ↓
User Input:
    currentTranslation → Translation Input Field
    ↓
Submit:
    if (hasCurrentEntryChanged()) {
        translations[currentIndex] = currentTranslation
    }
    ↓
Output Table:
    translations.map((trans, idx) => {
        cellRef: J${startRow + idx}
        character: utterers[idx]
        translation: trans
        status: compare(trans, originalTranslations[idx])
    })
```

---

*Last updated: 2026-01-14*
*Purpose: Definitive reference for all data fields in the application*
