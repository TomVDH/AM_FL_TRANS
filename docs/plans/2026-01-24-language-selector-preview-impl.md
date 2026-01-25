# Language Selector & Excel Preview Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a language selector that appears after file load (before sheet selection) with auto-detection, and an Excel-style preview showing sample rows.

**Architecture:** Language detection scans all sheet headers on file load. New `LanguageSelector` component shows detected languages. New `SheetPreview` component renders Excel-style table with samples from beginning/middle/end. State managed in `useTranslationState`.

**Tech Stack:** React, TypeScript, XLSX library, Tailwind CSS

---

## Task 1: Add Language Detection Types and State

**Files:**
- Modify: `src/hooks/useTranslationState.ts:15-90` (interface additions)
- Modify: `src/hooks/useTranslationState.ts:320-345` (state additions)

**Step 1: Add DetectedLanguage interface**

In `src/hooks/useTranslationState.ts`, add after line 13 (after the FilterOptions interface):

```typescript
export interface DetectedLanguage {
  code: string;           // "NL", "PT", etc.
  name: string;           // "Dutch", "Portuguese", etc.
  column: string;         // "J", "K", etc.
  headerText: string;     // Original header text from Excel
  sheets: string[];       // Which sheets have this language
  totalSheets: number;    // Total sheets in workbook
}
```

**Step 2: Add to TranslationState interface**

In the `TranslationState` interface (around line 57), add:

```typescript
  // Language detection state
  detectedLanguages: DetectedLanguage[];
  selectedLanguage: DetectedLanguage | null;
  setDetectedLanguages: (languages: DetectedLanguage[]) => void;
  setSelectedLanguage: (language: DetectedLanguage | null) => void;
```

**Step 3: Add state variables**

After `targetLanguageLabel` state declaration (around line 326), add:

```typescript
  // Language detection state
  const [detectedLanguages, setDetectedLanguages] = useState<DetectedLanguage[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<DetectedLanguage | null>(null);
```

**Step 4: Export in return statement**

Add to the return object (around line 1066):

```typescript
    detectedLanguages,
    selectedLanguage,
    setDetectedLanguages,
    setSelectedLanguage,
```

**Step 5: Commit**

```bash
git add src/hooks/useTranslationState.ts
git commit -m "feat: add language detection types and state"
```

---

## Task 2: Implement Language Detection Function

**Files:**
- Modify: `src/hooks/useTranslationState.ts:329-340` (add detection function)

**Step 1: Add LANGUAGE_KEYWORDS constant**

After the `columnLetterToIndex` function (around line 337), add:

```typescript
  // Language detection keywords mapping
  const LANGUAGE_KEYWORDS: Record<string, { code: string; name: string }> = {
    'dutch': { code: 'NL', name: 'Dutch' },
    'nl': { code: 'NL', name: 'Dutch' },
    'nederlands': { code: 'NL', name: 'Dutch' },
    'portuguese': { code: 'PT', name: 'Portuguese' },
    'pt': { code: 'PT', name: 'Portuguese' },
    'português': { code: 'PT', name: 'Portuguese' },
    'spanish': { code: 'ES', name: 'Spanish' },
    'es': { code: 'ES', name: 'Spanish' },
    'español': { code: 'ES', name: 'Spanish' },
    'french': { code: 'FR', name: 'French' },
    'fr': { code: 'FR', name: 'French' },
    'français': { code: 'FR', name: 'French' },
    'german': { code: 'DE', name: 'German' },
    'de': { code: 'DE', name: 'German' },
    'deutsch': { code: 'DE', name: 'German' },
    'italian': { code: 'IT', name: 'Italian' },
    'it': { code: 'IT', name: 'Italian' },
    'italiano': { code: 'IT', name: 'Italian' },
    'russian': { code: 'RU', name: 'Russian' },
    'ru': { code: 'RU', name: 'Russian' },
    'japanese': { code: 'JA', name: 'Japanese' },
    'ja': { code: 'JA', name: 'Japanese' },
    'korean': { code: 'KO', name: 'Korean' },
    'ko': { code: 'KO', name: 'Korean' },
    'chinese': { code: 'ZH', name: 'Chinese' },
    'zh': { code: 'ZH', name: 'Chinese' },
  };
```

**Step 2: Add detectLanguagesInWorkbook function**

```typescript
  /**
   * Detect available language columns across all sheets in workbook
   */
  const detectLanguagesInWorkbook = useCallback((workbook: XLSX.WorkBook): DetectedLanguage[] => {
    const languageMap = new Map<string, DetectedLanguage>();
    const totalSheets = workbook.SheetNames.length;

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet || !worksheet['!ref']) continue;

      const range = XLSX.utils.decode_range(worksheet['!ref']);

      // Scan header row (row 0)
      for (let col = 0; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        const cell = worksheet[cellRef];
        if (!cell?.v) continue;

        const headerText = cell.v.toString().trim();
        const headerLower = headerText.toLowerCase();

        // Check against language keywords
        for (const [keyword, langInfo] of Object.entries(LANGUAGE_KEYWORDS)) {
          if (headerLower.includes(keyword)) {
            const columnLetter = XLSX.utils.encode_col(col);
            const key = `${langInfo.code}-${columnLetter}`;

            if (languageMap.has(key)) {
              // Add sheet to existing language entry
              const existing = languageMap.get(key)!;
              if (!existing.sheets.includes(sheetName)) {
                existing.sheets.push(sheetName);
              }
            } else {
              // Create new language entry
              languageMap.set(key, {
                code: langInfo.code,
                name: langInfo.name,
                column: columnLetter,
                headerText: headerText,
                sheets: [sheetName],
                totalSheets: totalSheets,
              });
            }
            break; // Only match first keyword per column
          }
        }
      }
    }

    // Convert map to array and sort by sheet coverage (most sheets first)
    return Array.from(languageMap.values())
      .sort((a, b) => b.sheets.length - a.sheets.length);
  }, []);
```

**Step 3: Commit**

```bash
git add src/hooks/useTranslationState.ts
git commit -m "feat: implement language detection function"
```

---

## Task 3: Integrate Detection into File Load

**Files:**
- Modify: `src/hooks/useTranslationState.ts:452-474` (handleFileUpload)
- Modify: `src/hooks/useTranslationState.ts:487-514` (handleExistingFileLoad)

**Step 1: Update handleFileUpload**

In the `reader.onload` callback (around line 460), after setting sheets and before the `finally` block, add:

```typescript
        // Detect languages after loading workbook
        const detected = detectLanguagesInWorkbook(workbook);
        setDetectedLanguages(detected);

        // Auto-select first detected language if available
        if (detected.length > 0) {
          setSelectedLanguage(detected[0]);
          setTranslationColumn(detected[0].column);
          setTargetLanguageLabel(detected[0].code);
        }
```

**Step 2: Update handleExistingFileLoad**

In `handleExistingFileLoad` (around line 503), after setting sheets and before the toast, add:

```typescript
      // Detect languages after loading workbook
      const detected = detectLanguagesInWorkbook(workbook);
      setDetectedLanguages(detected);

      // Auto-select first detected language if available
      if (detected.length > 0) {
        setSelectedLanguage(detected[0]);
        setTranslationColumn(detected[0].column);
        setTargetLanguageLabel(detected[0].code);
      }
```

**Step 3: Add detectLanguagesInWorkbook to dependencies**

Update the dependency arrays for both functions if needed.

**Step 4: Commit**

```bash
git add src/hooks/useTranslationState.ts
git commit -m "feat: integrate language detection into file load"
```

---

## Task 4: Create LanguageSelector Component

**Files:**
- Create: `src/components/LanguageSelector.tsx`

**Step 1: Create the component file**

```typescript
'use client';

import React from 'react';

export interface DetectedLanguage {
  code: string;
  name: string;
  column: string;
  headerText: string;
  sheets: string[];
  totalSheets: number;
}

interface LanguageSelectorProps {
  languages: DetectedLanguage[];
  selectedLanguage: DetectedLanguage | null;
  onSelectLanguage: (language: DetectedLanguage) => void;
  disabled?: boolean;
}

/**
 * LanguageSelector Component
 *
 * Dropdown for selecting target translation language from auto-detected options.
 * Shows language name, code, column letter, and sheet coverage.
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
  disabled = false,
}) => {
  if (languages.length === 0) {
    return (
      <div className="p-4 border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded" style={{ borderRadius: '3px' }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            No language columns detected in headers
          </span>
        </div>
        <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
          Column headers should contain language names like &quot;Dutch&quot;, &quot;Portuguese&quot;, etc.
        </p>
      </div>
    );
  }

  const coverage = selectedLanguage
    ? `${selectedLanguage.sheets.length} of ${selectedLanguage.totalSheets}`
    : '';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Target Language
        </span>
      </div>

      <select
        value={selectedLanguage ? `${selectedLanguage.code}-${selectedLanguage.column}` : ''}
        onChange={(e) => {
          const selected = languages.find(
            lang => `${lang.code}-${lang.column}` === e.target.value
          );
          if (selected) {
            onSelectLanguage(selected);
          }
        }}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ borderRadius: '3px' }}
      >
        {languages.map((lang) => (
          <option key={`${lang.code}-${lang.column}`} value={`${lang.code}-${lang.column}`}>
            {lang.name} ({lang.code}) — Column {lang.column}
          </option>
        ))}
      </select>

      {selectedLanguage && (
        <div className="flex items-center gap-2 text-xs">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-green-600 dark:text-green-400">
            Available in {coverage} sheets
          </span>
          {selectedLanguage.sheets.length < selectedLanguage.totalSheets && (
            <span className="text-amber-500 dark:text-amber-400 text-[10px]">
              (not all sheets)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
```

**Step 2: Commit**

```bash
git add src/components/LanguageSelector.tsx
git commit -m "feat: create LanguageSelector component"
```

---

## Task 5: Create SheetPreview Component

**Files:**
- Create: `src/components/SheetPreview.tsx`

**Step 1: Create types and component structure**

```typescript
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';

interface PreviewRow {
  rowNumber: number;
  english: string;
  translation: string;
  isEmpty: boolean;
}

interface PreviewData {
  rows: PreviewRow[];
  totalRows: number;
  emptyCount: number;
  sourceHeader: string;
  targetHeader: string;
}

interface SheetPreviewProps {
  workbook: XLSX.WorkBook | null;
  sheetName: string;
  sourceColumn: string;
  targetColumn: string;
  startRow: number;
  languageCode: string;
}

/**
 * SheetPreview Component
 *
 * Excel-style preview showing sample rows from beginning, middle, and end.
 * Styled to look like a cut from an actual Excel spreadsheet.
 */
const SheetPreview: React.FC<SheetPreviewProps> = ({
  workbook,
  sheetName,
  sourceColumn,
  targetColumn,
  startRow,
  languageCode,
}) => {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounced data fetch
  useEffect(() => {
    if (!workbook || !sheetName) {
      setPreviewData(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      try {
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet || !worksheet['!ref']) {
          setError('Sheet is empty or invalid');
          setLoading(false);
          return;
        }

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const lastRow = range.e.r;
        const totalDataRows = Math.max(0, lastRow - startRow + 2);

        // Get header texts
        const sourceColIndex = sourceColumn.charCodeAt(0) - 65;
        const targetColIndex = targetColumn.charCodeAt(0) - 65;

        const sourceHeaderCell = XLSX.utils.encode_cell({ r: 0, c: sourceColIndex });
        const targetHeaderCell = XLSX.utils.encode_cell({ r: 0, c: targetColIndex });

        const sourceHeader = worksheet[sourceHeaderCell]?.v?.toString() || 'English';
        const targetHeader = worksheet[targetHeaderCell]?.v?.toString() || languageCode;

        // Calculate sample row indices (beginning, middle, end)
        const sampleIndices: number[] = [];

        // Beginning: first 3 data rows
        for (let i = 0; i < 3 && startRow + i - 1 <= lastRow; i++) {
          sampleIndices.push(startRow + i);
        }

        // Middle: 3 rows from ~50%
        if (totalDataRows > 10) {
          const middleStart = Math.floor(startRow + totalDataRows * 0.5);
          for (let i = 0; i < 3 && middleStart + i - 1 <= lastRow; i++) {
            if (!sampleIndices.includes(middleStart + i)) {
              sampleIndices.push(middleStart + i);
            }
          }
        }

        // End: last 3 rows
        if (totalDataRows > 6) {
          for (let i = 2; i >= 0; i--) {
            const rowNum = lastRow - i + 1;
            if (rowNum >= startRow && !sampleIndices.includes(rowNum)) {
              sampleIndices.push(rowNum);
            }
          }
        }

        // Sort indices
        sampleIndices.sort((a, b) => a - b);

        // Extract row data
        const rows: PreviewRow[] = [];
        let emptyCount = 0;

        for (const rowNum of sampleIndices) {
          const excelRow = rowNum - 1; // Convert to 0-based
          const sourceCell = XLSX.utils.encode_cell({ r: excelRow, c: sourceColIndex });
          const targetCell = XLSX.utils.encode_cell({ r: excelRow, c: targetColIndex });

          const english = worksheet[sourceCell]?.v?.toString()?.trim() || '';
          const translation = worksheet[targetCell]?.v?.toString()?.trim() || '';
          const isEmpty = !translation;

          if (isEmpty) emptyCount++;

          rows.push({
            rowNumber: rowNum,
            english,
            translation,
            isEmpty,
          });
        }

        // Count total empty cells in translation column
        let totalEmpty = 0;
        for (let row = startRow - 1; row <= lastRow; row++) {
          const cell = XLSX.utils.encode_cell({ r: row, c: targetColIndex });
          if (!worksheet[cell]?.v?.toString()?.trim()) {
            totalEmpty++;
          }
        }

        setPreviewData({
          rows,
          totalRows: totalDataRows,
          emptyCount: totalEmpty,
          sourceHeader,
          targetHeader,
        });
        setLoading(false);
      } catch (err) {
        console.error('Preview error:', err);
        setError('Failed to load preview');
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [workbook, sheetName, sourceColumn, targetColumn, startRow, languageCode]);

  if (!workbook || !sheetName) {
    return null;
  }

  if (loading) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden" style={{ borderRadius: '3px' }}>
        <div className="p-8 text-center">
          <div className="inline-block w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded p-4" style={{ borderRadius: '3px' }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-red-700 dark:text-red-300 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (!previewData) {
    return null;
  }

  // Group rows for display (with separators)
  const groupedRows = useMemo(() => {
    const groups: { type: 'row' | 'separator'; data?: PreviewRow }[] = [];
    let lastRowNum = 0;

    for (const row of previewData.rows) {
      if (lastRowNum > 0 && row.rowNumber - lastRowNum > 1) {
        groups.push({ type: 'separator' });
      }
      groups.push({ type: 'row', data: row });
      lastRowNum = row.rowNumber;
    }

    return groups;
  }, [previewData.rows]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Sheet Preview
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {previewData.totalRows} rows
        </span>
      </div>

      {/* Excel-style table */}
      <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden" style={{ borderRadius: '3px' }}>
        {/* Header row - Excel green */}
        <div className="grid grid-cols-[40px_1fr_1fr] bg-[#217346] text-white text-xs font-semibold">
          <div className="px-2 py-1.5 border-r border-[#1e6a3f] text-center text-[10px]">

          </div>
          <div className="px-3 py-1.5 border-r border-[#1e6a3f]">
            <span className="text-[10px] opacity-70">{sourceColumn}</span>
            <span className="mx-1.5">·</span>
            {previewData.sourceHeader}
          </div>
          <div className="px-3 py-1.5">
            <span className="text-[10px] opacity-70">{targetColumn}</span>
            <span className="mx-1.5">·</span>
            {previewData.targetHeader}
          </div>
        </div>

        {/* Data rows */}
        <div className="max-h-64 overflow-y-auto">
          {groupedRows.map((item, idx) => {
            if (item.type === 'separator') {
              return (
                <div key={`sep-${idx}`} className="grid grid-cols-[40px_1fr_1fr] bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs">
                  <div className="px-2 py-1 text-center">⋮</div>
                  <div className="px-3 py-1 border-l border-gray-200 dark:border-gray-700">⋮</div>
                  <div className="px-3 py-1 border-l border-gray-200 dark:border-gray-700">⋮</div>
                </div>
              );
            }

            const row = item.data!;
            const isEven = row.rowNumber % 2 === 0;

            return (
              <div
                key={row.rowNumber}
                className={`grid grid-cols-[40px_1fr_1fr] text-xs border-t border-gray-200 dark:border-gray-700 ${
                  isEven ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
                }`}
              >
                {/* Row number */}
                <div className="px-2 py-1.5 text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 font-mono text-[10px]">
                  {row.rowNumber}
                </div>

                {/* English column */}
                <div className="px-3 py-1.5 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 truncate">
                  {row.english || <span className="text-gray-300 dark:text-gray-600 italic">empty</span>}
                </div>

                {/* Translation column */}
                <div className={`px-3 py-1.5 truncate ${
                  row.isEmpty
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-400 dark:text-orange-500 italic'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {row.translation || '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning/info banner */}
      {previewData.emptyCount > 0 && (
        <div className={`flex items-center gap-2 px-3 py-2 text-xs rounded ${
          previewData.emptyCount > previewData.totalRows * 0.5
            ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
        }`} style={{ borderRadius: '3px' }}>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {previewData.emptyCount} of {previewData.totalRows} cells empty in {languageCode} column
          </span>
        </div>
      )}

      {previewData.emptyCount === 0 && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 rounded" style={{ borderRadius: '3px' }}>
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>All cells populated</span>
        </div>
      )}
    </div>
  );
};

export default SheetPreview;
```

**Step 2: Commit**

```bash
git add src/components/SheetPreview.tsx
git commit -m "feat: create SheetPreview component with Excel styling"
```

---

## Task 6: Integrate Components into SetupWizard

**Files:**
- Modify: `src/components/SetupWizard.tsx:1-12` (imports)
- Modify: `src/components/SetupWizard.tsx:13-79` (props interface)
- Modify: `src/components/SetupWizard.tsx:712-815` (UI sections)

**Step 1: Add imports**

At top of file, add:

```typescript
import LanguageSelector, { DetectedLanguage } from './LanguageSelector';
import SheetPreview from './SheetPreview';
```

**Step 2: Add props to interface**

In `SetupWizardProps` interface, add after `targetLanguageLabel`:

```typescript
  // Language detection
  detectedLanguages: DetectedLanguage[];
  selectedLanguage: DetectedLanguage | null;
  onSelectLanguage: (language: DetectedLanguage) => void;
```

**Step 3: Destructure new props**

In component function, add to destructured props:

```typescript
  detectedLanguages,
  selectedLanguage,
  onSelectLanguage,
```

**Step 4: Add Language Selector section**

After file selection section (around line 710), before sheet configuration, add new section:

```tsx
              {/* Section 2.5: Language Selection - Only when Excel loaded */}
              {fileType === 'excel' && excelSheets.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <LanguageSelector
                    languages={detectedLanguages}
                    selectedLanguage={selectedLanguage}
                    onSelectLanguage={onSelectLanguage}
                    disabled={isLoadingExcel}
                  />
                </div>
              )}
```

**Step 5: Add Sheet Preview after sheet selector**

After the SheetSelector component (around line 727), add:

```tsx
                  {/* Sheet Preview */}
                  {selectedSheet && selectedLanguage && (
                    <div className="mt-4">
                      <SheetPreview
                        workbook={workbookData}
                        sheetName={selectedSheet}
                        sourceColumn={sourceColumn}
                        targetColumn={selectedLanguage.column}
                        startRow={startRow}
                        languageCode={selectedLanguage.code}
                      />
                    </div>
                  )}
```

**Step 6: Remove old Target Language Column section**

Delete or comment out the entire "Section 4: Target Language Column" block (lines 743-815) since it's replaced by the LanguageSelector.

**Step 7: Commit**

```bash
git add src/components/SetupWizard.tsx
git commit -m "feat: integrate LanguageSelector and SheetPreview into SetupWizard"
```

---

## Task 7: Wire Up Props in TranslationHelper

**Files:**
- Modify: `src/components/TranslationHelper.tsx:55-65` (destructure new state)
- Modify: `src/components/TranslationHelper.tsx:600-610` (pass props to SetupWizard)

**Step 1: Destructure new state**

In the destructuring from `useTranslationState()`, add:

```typescript
    detectedLanguages,
    selectedLanguage,
    setSelectedLanguage,
```

**Step 2: Create language selection handler**

Add handler function:

```typescript
  // Handle language selection
  const handleSelectLanguage = useCallback((language: DetectedLanguage) => {
    setSelectedLanguage(language);
    setTranslationColumn(language.column);
    setTargetLanguageLabel(language.code);
  }, [setSelectedLanguage, setTranslationColumn, setTargetLanguageLabel]);
```

**Step 3: Pass props to SetupWizard**

In the SetupWizard component call, add:

```tsx
        detectedLanguages={detectedLanguages}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
```

**Step 4: Import DetectedLanguage type if needed**

```typescript
import type { DetectedLanguage } from './LanguageSelector';
```

**Step 5: Commit**

```bash
git add src/components/TranslationHelper.tsx
git commit -m "feat: wire up language selection in TranslationHelper"
```

---

## Task 8: Test and Verify

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Manual testing checklist**

1. Load an Excel file with language columns (Dutch, Portuguese, etc.)
2. Verify language dropdown appears after file loads
3. Verify languages are auto-detected from column headers
4. Change language selection - verify preview updates
5. Select different sheets - verify preview updates
6. Verify empty cells are highlighted in orange
7. Verify row samples show beginning, middle, and end
8. Test dark mode styling

**Step 3: Fix any issues found**

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete language selector and Excel preview implementation"
```

---

## Summary

After completing all tasks, you will have:

1. **Language detection** that scans all sheets on file load
2. **LanguageSelector** component with dropdown showing detected languages
3. **SheetPreview** component with Excel-style table showing sample rows
4. **Validation warnings** for empty cells, inline in preview
5. **Debounced refresh** (300ms) when selections change
6. **New workflow order**: File → Language → Sheet (with preview) → Start
