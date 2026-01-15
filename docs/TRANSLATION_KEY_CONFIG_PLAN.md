# Translation Key Configuration - Development Plan
## Making Column J Configurable for Multi-Language Support

---

## OVERVIEW

Currently, the Dutch translation column is **hardcoded to Column J** (index 9) throughout the application. This plan outlines how to make this configurable so users can select which column contains their target language translations.

---

## CURRENT HARDCODED LOCATIONS

### 1. **useTranslationState.ts** (Primary Location)
**Lines 460-476**: `processExcelData()` function
```typescript
// Dutch translations column is hardcoded to J (index 9)
const dutchColumnIndex = 9; // Column J = index 9

for (let row = startRow - 1; row <= range.e.r; row++) {
  const dutchCell = XLSX.utils.encode_cell({ r: row, c: dutchColumnIndex });
  const dutchValue = worksheet[dutchCell]?.v;
  // ...
}
```

### 2. **useTranslationState.ts** (Sync Function)
**Line 797**: `syncCurrentTranslation()` function
```typescript
const cellRef = `J${startRow + currentIndex}`;
```

### 3. **TranslationHelper.tsx** (Display Reference)
**Multiple locations**: Cell reference displays showing "J5", "J10", etc.

---

## PROPOSED SOLUTION

### Phase 1: Add Translation Column State

#### 1.1 Add State Variable
**File**: `/src/hooks/useTranslationState.ts`
**Location**: State declarations (~line 140-170)

```typescript
// NEW: Translation column configuration
const [translationColumn, setTranslationColumn] = useState<string>('J'); // Default to J for backward compat
const [translationColumnIndex, setTranslationColumnIndex] = useState<number>(9); // Computed from column letter
```

#### 1.2 Add to Interface
**File**: `/src/hooks/useTranslationState.ts`
**Location**: TranslationState interface (~line 30-120)

```typescript
interface TranslationState {
  // ...existing state...

  // Translation column configuration
  translationColumn: string;          // e.g., "J", "K", "L"
  translationColumnIndex: number;     // e.g., 9, 10, 11
  setTranslationColumn: (column: string) => void;

  // ...rest of interface...
}
```

#### 1.3 Add Helper Function
```typescript
/**
 * Convert Excel column letter to zero-based index
 * Examples: A=0, B=1, ..., Z=25, AA=26, etc.
 */
const columnLetterToIndex = (column: string): number => {
  let index = 0;
  for (let i = 0; i < column.length; i++) {
    index = index * 26 + (column.charCodeAt(i) - 64);
  }
  return index - 1; // Convert to 0-based
};
```

---

### Phase 2: Update Setup Wizard UI

#### 2.1 Add Translation Column Selector
**File**: `/src/components/SetupWizard.tsx`
**Location**: After "Start Row" input field

**UI Component**:
```tsx
{/* Translation Column Selection - Only for Excel */}
{inputMode === 'excel' && (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Translation Column
      <span className="text-xs text-gray-500 ml-2">(Target language output)</span>
    </label>

    <div className="flex gap-3">
      {/* Column Letter Input */}
      <input
        type="text"
        value={translationColumn}
        onChange={(e) => {
          const col = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
          setTranslationColumn(col);
        }}
        maxLength={3}
        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
        placeholder="J"
      />

      {/* Helper Text */}
      <div className="flex-1 text-xs text-gray-500 dark:text-gray-400 self-center">
        Column for <strong>Dutch</strong> (or your target language) translations.
        <br />
        Examples: J, K, L, AA, AB
      </div>
    </div>

    {/* Preview */}
    {translationColumn && (
      <div className="text-xs text-blue-600 dark:text-blue-400">
        ✓ Translations will be saved to Column {translationColumn}
        (Cell refs: {translationColumn}5, {translationColumn}6, etc.)
      </div>
    )}
  </div>
)}
```

**Visual Layout**:
```
┌─────────────────────────────────────────────────┐
│ Translation Column (Target language output)     │
│                                                  │
│ [  J  ]  Column for Dutch translations          │
│          Examples: J, K, L, AA, AB               │
│                                                  │
│ ✓ Translations saved to Column J (J5, J6...)    │
└─────────────────────────────────────────────────┘
```

#### 2.2 Add Validation
```typescript
const validateTranslationColumn = (col: string): boolean => {
  // Must be 1-3 letters A-Z
  if (!/^[A-Z]{1,3}$/.test(col)) return false;

  // Column index must be valid (0-16383 for Excel)
  const index = columnLetterToIndex(col);
  if (index < 0 || index > 16383) return false;

  return true;
};
```

---

### Phase 3: Update Data Processing

#### 3.1 Replace Hardcoded Index
**File**: `/src/hooks/useTranslationState.ts`
**Function**: `processExcelData()`

**Before**:
```typescript
const dutchColumnIndex = 9; // Column J = index 9
```

**After**:
```typescript
const dutchColumnIndex = translationColumnIndex; // Use configured column
```

#### 3.2 Update Sync Function
**Function**: `syncCurrentTranslation()`

**Before**:
```typescript
const cellRef = `J${startRow + currentIndex}`;
```

**After**:
```typescript
const cellRef = `${translationColumn}${startRow + currentIndex}`;
```

#### 3.3 Update Cell Reference Display
**File**: `/src/components/TranslationHelper.tsx`
**Function**: `getCellLocation()`

**Update to use dynamic column**:
```typescript
const getCellLocation = (index: number) => {
  return `${translationColumn}${startRow + index}`;
};
```

---

### Phase 4: Persistence & State Management

#### 4.1 Save Configuration
When user completes Setup Wizard, save:
- `translationColumn` (letter)
- `translationColumnIndex` (computed index)

Store in state alongside:
- `sourceColumn`
- `uttererColumn`
- `startRow`

#### 4.2 Reset Handling
When user clicks "Reset from File" or changes sheets:
- Preserve `translationColumn` setting
- Re-read translations from that column
- Update `originalTranslations` baseline

---

### Phase 5: UI Label Updates

#### 5.1 Dynamic Labels
**Current**: "Dutch (Existing):" in reference display
**Proposed**: Make configurable

Add optional label input in Setup Wizard:
```tsx
<input
  type="text"
  value={targetLanguageLabel}
  onChange={(e) => setTargetLanguageLabel(e.target.value)}
  placeholder="Dutch"
/>
```

Display as:
```
Source (English): Hello world
{targetLanguageLabel} (Existing): Hallo wereld
```

#### 5.2 Update Field References
**FIELD_DEFINITIONS.md** currently says:
> "Dutch Translation Column" - hardcoded to Column J

Update to:
> "Translation Column" - configurable target language column

---

## IMPLEMENTATION CHECKLIST

### Core Functionality
- [ ] Add `translationColumn` and `translationColumnIndex` state variables
- [ ] Add `columnLetterToIndex()` helper function
- [ ] Update `TranslationState` interface with new fields
- [ ] Replace hardcoded `dutchColumnIndex = 9` with `translationColumnIndex`
- [ ] Update `syncCurrentTranslation()` to use dynamic column
- [ ] Update `getCellLocation()` to use dynamic column
- [ ] Export new state/setters in hook return

### UI Components
- [ ] Add Translation Column selector to SetupWizard
- [ ] Add validation for column letter input
- [ ] Add preview showing computed cell references
- [ ] Add helper text explaining column selection
- [ ] Make field only visible when `inputMode === 'excel'`

### Testing
- [ ] Test with Column J (default - backward compat)
- [ ] Test with Column K, L, M
- [ ] Test with multi-letter columns (AA, AB, BA)
- [ ] Test edge cases (A, Z, ZZ)
- [ ] Verify Live Edit saves to correct column
- [ ] Verify Reset from File reads correct column
- [ ] Verify cell references display correctly in Output table

### Documentation
- [ ] Update FIELD_DEFINITIONS.md
- [ ] Update PROGRAMMATIC_FIELD_INDEX.md
- [ ] Update LIVE_EDIT_TESTING_GUIDE.md
- [ ] Add migration note for existing users
- [ ] Document column letter → index conversion

---

## BACKWARD COMPATIBILITY

### Default Behavior
- If `translationColumn` not set, default to `"J"`
- Existing users see no change
- Old CSV/JSON files continue working

### Migration Path
Users can:
1. Keep using Column J (no action needed)
2. Configure different column in Setup Wizard
3. Reset and reload file with new column setting

---

## FUTURE ENHANCEMENTS

### Multi-Language Support
Could extend to support multiple translation columns:
```typescript
interface LanguageColumn {
  language: string;    // "Dutch", "German", "French"
  column: string;      // "J", "K", "L"
  columnIndex: number; // 9, 10, 11
}

const translationColumns: LanguageColumn[] = [
  { language: "Dutch", column: "J", columnIndex: 9 },
  { language: "German", column: "K", columnIndex: 10 },
  { language: "French", column: "L", columnIndex: 11 },
];
```

Then user could:
- Select active language from dropdown
- Switch between languages in Screen 2
- Export all languages or specific one

---

## PHASE 6: SHEET COMPLETION WORKFLOW

### 6.1 Completion Detection State

When user reaches the last entry in a sheet and clicks "Complete":

**New State Variables**:
```typescript
const [isSheetComplete, setIsSheetComplete] = useState(false);
const [showCompletionDialog, setShowCompletionDialog] = useState(false);
const [completionStats, setCompletionStats] = useState({
  sheetName: '',
  totalEntries: 0,
  translatedCount: 0,
  blankCount: 0,
  completionTime: null as Date | null
});
```

**Completion Trigger**:
```typescript
const handleComplete = () => {
  if (currentIndex === sourceTexts.length - 1) {
    // Last entry - show completion dialog
    setCompletionStats({
      sheetName: selectedSheet,
      totalEntries: sourceTexts.length,
      translatedCount: filterStats.completed,
      blankCount: filterStats.blank,
      completionTime: new Date()
    });
    setIsSheetComplete(true);
    setShowCompletionDialog(true);
  } else {
    // Normal submit - continue to next entry
    handleSubmit();
  }
};
```

---

### 6.2 Completion Dialog UI

**Modal Component**: `CompletionDialog.tsx`

**Layout**:
```
┌────────────────────────────────────────────────────┐
│  Sheet Complete! ✓                                 │
│                                                     │
│  Sheet: E1_Stable1F_localization                   │
│  Entries: 234                                       │
│  Translated: 232 (99%)                             │
│  Blank: 2 (1%)                                     │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Your Translations (Preview)                  │  │
│  │                                               │  │
│  │ J5: Alice → Hallo, hoe gaat het?            │  │
│  │ J6: Bob → Ik doe het geweldig!              │  │
│  │ J7: Alice → Wat een prachtige dag.          │  │
│  │ ... (232 total)                               │  │
│  │                                               │  │
│  │ [Copy with Refs] [Copy Values] [Export CSV] │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  What would you like to do next?                   │
│                                                     │
│  [← Back to Setup]  [Next Sheet →]  [Stay Here]   │
└────────────────────────────────────────────────────┘
```

**Implementation**:
```tsx
interface CompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CompletionStats;
  translations: string[];
  onBackToSetup: () => void;
  onNextSheet: () => void;
}

const CompletionDialog: React.FC<CompletionDialogProps> = ({
  isOpen,
  onClose,
  stats,
  translations,
  onBackToSetup,
  onNextSheet
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-green-500">✓</span> Sheet Complete!
          </h2>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Sheet:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">{stats.sheetName}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total Entries:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">{stats.totalEntries}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Translated:</span>
              <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                {stats.translatedCount} ({Math.round((stats.translatedCount / stats.totalEntries) * 100)}%)
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Blank:</span>
              <span className="ml-2 font-semibold text-amber-600 dark:text-amber-400">
                {stats.blankCount} ({Math.round((stats.blankCount / stats.totalEntries) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Translation Output Preview */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            Your Translations (Preview)
          </h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            {/* Scrollable preview */}
            <div className="max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 font-mono text-xs">
              {translations.slice(0, 10).map((trans, idx) => (
                <div key={idx} className="py-1">
                  <span className="text-gray-500">{`${translationColumn}${startRow + idx}:`}</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{trans}</span>
                </div>
              ))}
              {translations.length > 10 && (
                <div className="text-gray-500 italic mt-2">
                  ... and {translations.length - 10} more
                </div>
              )}
            </div>

            {/* Action buttons for output */}
            <div className="px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                onClick={() => copyWithCellRefs(translations)}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                Copy with Refs
              </button>
              <button
                onClick={() => copyValues(translations)}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                Copy Values
              </button>
              <button
                onClick={() => exportToCSV(translations)}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            What would you like to do next?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onBackToSetup}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              ← Back to Setup
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Stay Here
            </button>
            <button
              onClick={onNextSheet}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2"
            >
              Next Sheet
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### 6.3 Next Sheet Navigation

**Handler Function**:
```typescript
const handleNextSheet = useCallback(() => {
  // Save current progress if Live Edit enabled
  if (liveEditMode) {
    syncCurrentTranslation();
  }

  // Find next sheet
  const currentSheetIndex = excelSheets.indexOf(selectedSheet);
  const nextSheetIndex = currentSheetIndex + 1;

  if (nextSheetIndex < excelSheets.length) {
    const nextSheet = excelSheets[nextSheetIndex];

    // Switch to next sheet
    setSelectedSheet(nextSheet);

    // Reset state for new sheet
    setCurrentIndex(0);
    setIsSheetComplete(false);
    setShowCompletionDialog(false);

    toast.success(`Switched to ${nextSheet}`);
  } else {
    // No more sheets
    toast.info('This was the last sheet in the workbook');
    setShowCompletionDialog(false);
  }
}, [liveEditMode, syncCurrentTranslation, excelSheets, selectedSheet]);
```

**Auto-process on Sheet Change**:
```typescript
useEffect(() => {
  if (workbookData && selectedSheet) {
    processExcelData(); // Automatically load new sheet data
  }
}, [selectedSheet]); // Trigger when sheet changes
```

---

### 6.4 Back to Setup Handler

```typescript
const handleBackToSetup = useCallback(() => {
  // Warn if unsaved changes
  const hasUnsavedChanges = translations.some((trans, idx) => {
    const original = originalTranslations[idx] || '[BLANK, REMOVE LATER]';
    return trans !== original;
  });

  if (hasUnsavedChanges && !liveEditMode) {
    const confirmed = window.confirm(
      'You have unsaved translations. Going back to setup will lose your progress. Continue?'
    );
    if (!confirmed) return;
  }

  // Reset to Screen 1 (Setup Wizard)
  setIsStarted(false);
  setShowCompletionDialog(false);
  toast.info('Returned to setup');
}, [translations, originalTranslations, liveEditMode]);
```

---

### 6.5 Submit Button Update

**Current Submit Button** (last entry):
- Shows "Complete" instead of "Submit"
- Triggers completion dialog

**Updated Logic**:
```tsx
<button
  onClick={currentIndex === sourceTexts.length - 1 ? handleComplete : handleSubmit}
  className="..."
>
  {currentIndex === sourceTexts.length - 1 ? (
    <>
      <span className="text-green-400">✓</span> Complete
    </>
  ) : (
    'Submit'
  )}
</button>
```

---

### 6.6 State Flow Diagram

```
User on Last Entry
    ↓
Clicks "Complete"
    ↓
handleComplete() called
    ↓
Generate completion stats
    ↓
Show Completion Dialog
    ├─→ [Back to Setup] → handleBackToSetup() → Screen 1
    ├─→ [Stay Here] → Close dialog, stay on current sheet
    └─→ [Next Sheet] → handleNextSheet()
                           ↓
                    Load next sheet data
                           ↓
                    processExcelData()
                           ↓
                    Reset to index 0
                           ↓
                    Screen 2 with new sheet
```

---

### 6.7 Integration with Live Edit

**Before switching sheets**:
```typescript
const handleNextSheet = async () => {
  // 1. Sync current translation if Live Edit enabled
  if (liveEditMode && hasCurrentEntryChanged()) {
    await syncCurrentTranslation();
  }

  // 2. Wait for sync to complete
  if (syncStatus === 'syncing') {
    toast.info('Waiting for sync to complete...');
    return; // Don't switch yet
  }

  // 3. Switch to next sheet
  // ... rest of logic
};
```

---

### 6.8 Persistence Across Sheets

**Track Completed Sheets**:
```typescript
const [completedSheets, setCompletedSheets] = useState<string[]>([]);

const markSheetComplete = (sheetName: string) => {
  setCompletedSheets(prev => [...prev, sheetName]);
};
```

**Show Progress in Setup Wizard**:
```tsx
{excelSheets.map(sheet => (
  <div key={sheet} className="flex items-center gap-2">
    <span>{sheet}</span>
    {completedSheets.includes(sheet) && (
      <span className="text-green-500 text-xs">✓ Complete</span>
    )}
  </div>
))}
```

---

## UPDATED IMPLEMENTATION CHECKLIST

### Phase 6 Additions
- [ ] Add completion state variables (`isSheetComplete`, `showCompletionDialog`, `completionStats`)
- [ ] Create `CompletionDialog.tsx` component
- [ ] Add completion dialog to TranslationHelper
- [ ] Update Submit button to show "Complete" on last entry
- [ ] Implement `handleComplete()` function
- [ ] Implement `handleNextSheet()` function
- [ ] Implement `handleBackToSetup()` function
- [ ] Add auto-process on sheet change
- [ ] Add sync integration before sheet switch
- [ ] Add completed sheets tracking
- [ ] Show translation output preview in dialog
- [ ] Add copy/export actions to completion dialog
- [ ] Test multi-sheet workflow end-to-end

---

## UPDATED ESTIMATED EFFORT

**Phase 1 (State)**: 30 minutes
**Phase 2 (UI)**: 1 hour
**Phase 3 (Processing)**: 45 minutes
**Phase 4 (Persistence)**: 30 minutes
**Phase 5 (Labels)**: 30 minutes
**Phase 6 (Completion Workflow)**: 2 hours
**Testing & Docs**: 1.5 hours

**Total**: ~6.5 hours

---

## PRIORITY

**Medium-High** - Not blocking current work, but important for:
- Multi-language projects
- Standardizing workflow across different Excel file formats
- Making tool more flexible/reusable
- **Professional multi-sheet translation workflow**
- **Improved UX for batch translation projects**

---

*Plan created: 2026-01-15*
*Plan updated: 2026-01-15 (added Phase 6: Sheet Completion Workflow)*
*Status: Ready for implementation when prioritized*
