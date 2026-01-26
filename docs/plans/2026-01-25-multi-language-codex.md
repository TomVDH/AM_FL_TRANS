# Multi-Language Codex & Reference Data Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable the Codex/Reference system to support multiple target languages with per-language data detection, and guide users to set up reference data for their chosen language.

**Architecture:**
- Single CSV with dynamic language columns (e.g., `dutch`, `portuguese`, `spanish`)
- API endpoint to detect which languages have populated data
- SetupWizard displays info panel when reference data is missing for selected language
- UI labels change from hardcoded "Dutch" to dynamic based on selected language

**Tech Stack:** Next.js API routes, CSV parsing, React components, TypeScript

---

## Task 1: Update CSV Structure & API Types

**Files:**
- Modify: `src/app/api/codex/route.ts`

**Step 1: Update CodexEntry interface to support dynamic languages**

Replace the hardcoded `dutch` field with a flexible structure:

```typescript
interface CodexEntry {
  name: string;
  description: string;
  english: string;
  category: string;
  nicknames?: string;
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
  // Dynamic language translations
  [languageCode: string]: string | undefined;
}
```

**Step 2: Update CSV_HEADER constant**

```typescript
// Base columns (language columns are dynamic)
const CSV_BASE_COLUMNS = ['name', 'description', 'english', 'category', 'nicknames', 'bio', 'gender', 'dialogueStyle'];
```

**Step 3: Update parseCodexCSV to handle dynamic columns**

```typescript
function parseCodexCSV(csvContent: string): { entries: CodexEntry[]; languageColumns: string[] } {
  const lines = csvContent.split('\n');
  const entries: CodexEntry[] = [];

  // Parse header to find language columns
  const headerLine = lines[0];
  const headers = parseCSVRow(headerLine);

  // Language columns are any column not in base columns and not empty
  const languageColumns = headers.filter(h =>
    !CSV_BASE_COLUMNS.includes(h.toLowerCase()) &&
    h.trim() !== '' &&
    !['name', 'description', 'english', 'category', 'nicknames', 'bio', 'gender', 'dialoguestyle'].includes(h.toLowerCase())
  );

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVRow(line);
    if (values.length >= 4) {
      const entry: CodexEntry = {
        name: values[headers.indexOf('name')] || values[0],
        description: values[headers.indexOf('description')] || values[1],
        english: values[headers.indexOf('english')] || values[2],
        category: values[headers.indexOf('category')] || values[3] || 'CHARACTER',
        nicknames: values[headers.indexOf('nicknames')] || '',
        bio: values[headers.indexOf('bio')] || '',
        gender: values[headers.indexOf('gender')] || '',
        dialogueStyle: values[headers.indexOf('dialogueStyle')] || ''
      };

      // Add language columns dynamically
      for (const langCol of languageColumns) {
        const idx = headers.indexOf(langCol);
        if (idx !== -1) {
          entry[langCol.toLowerCase()] = values[idx] || '';
        }
      }

      entries.push(entry);
    }
  }

  return { entries, languageColumns: languageColumns.map(l => l.toLowerCase()) };
}
```

**Step 4: Update GET endpoint to return language info**

```typescript
export async function GET() {
  try {
    try {
      await fs.access(CSV_FILE_PATH);
    } catch {
      return NextResponse.json({ entries: [], availableLanguages: [] });
    }

    const csvContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
    const { entries, languageColumns } = parseCodexCSV(csvContent);

    // Check which languages have actual data (non-empty values)
    const availableLanguages = languageColumns.filter(lang =>
      entries.some(entry => entry[lang] && entry[lang].trim() !== '')
    );

    return NextResponse.json({
      entries,
      availableLanguages,
      totalEntries: entries.length
    });

  } catch (error) {
    console.error('Error reading codex file:', error);
    return NextResponse.json({ error: 'Failed to read codex file' }, { status: 500 });
  }
}
```

**Step 5: Commit**

```bash
git add src/app/api/codex/route.ts
git commit -m "feat: support dynamic language columns in codex API"
```

---

## Task 2: Create Language Availability Check Hook

**Files:**
- Create: `src/hooks/useCodexLanguages.ts`

**Step 1: Create the hook**

```typescript
import { useState, useEffect, useCallback } from 'react';

interface CodexLanguageInfo {
  availableLanguages: string[];
  totalEntries: number;
  isLoading: boolean;
  error: string | null;
  hasLanguage: (langCode: string) => boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook to check which languages have codex/reference data available
 */
export function useCodexLanguages(): CodexLanguageInfo {
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/codex');
      if (!response.ok) {
        throw new Error('Failed to fetch codex data');
      }

      const data = await response.json();
      setAvailableLanguages(data.availableLanguages || []);
      setTotalEntries(data.totalEntries || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAvailableLanguages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hasLanguage = useCallback((langCode: string) => {
    // Normalize: "NL" -> "dutch", "PT" -> "portuguese", etc.
    const langMap: Record<string, string> = {
      'nl': 'dutch',
      'pt': 'portuguese',
      'es': 'spanish',
      'fr': 'french',
      'de': 'german',
      'it': 'italian',
    };

    const normalizedCode = langMap[langCode.toLowerCase()] || langCode.toLowerCase();
    return availableLanguages.includes(normalizedCode);
  }, [availableLanguages]);

  return {
    availableLanguages,
    totalEntries,
    isLoading,
    error,
    hasLanguage,
    refresh
  };
}
```

**Step 2: Commit**

```bash
git add src/hooks/useCodexLanguages.ts
git commit -m "feat: add useCodexLanguages hook for language availability check"
```

---

## Task 3: Create Reference Data Info Panel Component

**Files:**
- Create: `src/components/ReferenceDataInfo.tsx`

**Step 1: Create the component**

```typescript
'use client';

import React from 'react';

interface ReferenceDataInfoProps {
  selectedLanguage: string | null;  // e.g., "NL", "PT"
  selectedLanguageName: string | null;  // e.g., "Dutch", "Portuguese"
  hasReferenceData: boolean;
  isLoading: boolean;
  totalEntries: number;
  onLearnMore?: () => void;
}

/**
 * Info panel shown on SetupWizard when reference data status needs attention
 */
const ReferenceDataInfo: React.FC<ReferenceDataInfoProps> = ({
  selectedLanguage,
  selectedLanguageName,
  hasReferenceData,
  isLoading,
  totalEntries,
  onLearnMore
}) => {
  if (isLoading) {
    return null; // Don't show anything while loading
  }

  // If no language selected yet, don't show
  if (!selectedLanguage) {
    return null;
  }

  // If reference data exists for this language, show success state
  if (hasReferenceData) {
    return (
      <div className="p-4 border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded" style={{ borderRadius: '3px' }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Reference data available for {selectedLanguageName}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {totalEntries} entries loaded. Quick suggestions and character highlighting enabled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No reference data - show info panel
  return (
    <div className="p-4 border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded" style={{ borderRadius: '3px' }}>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Looking for quick reference and in-translation highlights?
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Reference data (character names, common phrases) is not yet available for {selectedLanguageName}.
            You can still translate, but auto-suggestions won't appear.
          </p>
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors"
              style={{ borderRadius: '3px' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Learn how to add reference data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferenceDataInfo;
```

**Step 2: Commit**

```bash
git add src/components/ReferenceDataInfo.tsx
git commit -m "feat: add ReferenceDataInfo component for setup wizard"
```

---

## Task 4: Integrate into SetupWizard

**Files:**
- Modify: `src/components/SetupWizard.tsx`

**Step 1: Add imports**

```typescript
import ReferenceDataInfo from './ReferenceDataInfo';
import { useCodexLanguages } from '../hooks/useCodexLanguages';
```

**Step 2: Add hook usage in component**

After the existing state declarations:

```typescript
// Reference data availability check
const { hasLanguage, isLoading: isLoadingCodex, totalEntries } = useCodexLanguages();
```

**Step 3: Add ReferenceDataInfo after LanguageSelector section**

Find the section `{/* Section 2.5: Language Selection */}` and add after the `</LanguageSelector>`:

```typescript
{/* Reference Data Status */}
{selectedLanguage && (
  <div className="mt-4">
    <ReferenceDataInfo
      selectedLanguage={selectedLanguage.code}
      selectedLanguageName={selectedLanguage.name}
      hasReferenceData={hasLanguage(selectedLanguage.code)}
      isLoading={isLoadingCodex}
      totalEntries={totalEntries}
      onLearnMore={() => window.open('/docs/reference-data-guide.md', '_blank')}
    />
  </div>
)}
```

**Step 4: Commit**

```bash
git add src/components/SetupWizard.tsx
git commit -m "feat: integrate ReferenceDataInfo into SetupWizard"
```

---

## Task 5: Update UI Labels from "Dutch" to Dynamic

**Files:**
- Modify: `src/components/CodexEditor.tsx`
- Modify: `src/components/QuickReferenceBar.tsx`
- Modify: `src/components/ReferenceToolsPanel.tsx`

**Step 1: Update CodexEditor.tsx**

Add prop for target language:

```typescript
interface CodexEditorProps {
  onCodexUpdated?: () => void;
  targetLanguage?: string; // e.g., "Dutch", "Portuguese"
}
```

Replace hardcoded "Dutch" labels:

- Line 479: `label="Dutch"` → `label={targetLanguage || "Translation"}`
- Line 482: `placeholder="Dutch translation"` → `placeholder="${targetLanguage || 'Translation'}"`
- Line 772: Search placeholder → `"Search by name, english, translation..."`
- Line 819: Table header `Dutch` → `{targetLanguage || "Translation"}`
- Line 878: Form label `Dutch` → `{targetLanguage || "Translation"}`

**Step 2: Update interface property names (optional refactor)**

This is a larger change - for now, keep `dutch` as the property name internally but display dynamic labels.

**Step 3: Commit**

```bash
git add src/components/CodexEditor.tsx src/components/QuickReferenceBar.tsx src/components/ReferenceToolsPanel.tsx
git commit -m "feat: use dynamic language labels in codex and reference UI"
```

---

## Task 6: Create Reference Data Documentation

**Files:**
- Create: `public/docs/reference-data-guide.md`

**Step 1: Create the documentation**

```markdown
# Setting Up Reference Data for Your Language

## What is Reference Data?

Reference data powers two features in the Translation Helper:

1. **Quick Suggestions** - Character names and common phrases appear as clickable chips while you translate
2. **Highlight Mode** - Recognized terms are highlighted in the source text

## Current Status

Reference data is currently available for:
- **Dutch (NL)** - Full character and location database

## Adding Reference Data for a New Language

### Option 1: Edit the Codex Directly

1. Go to the **Codex / Reference Data** section on the setup screen
2. For each entry, add a translation in your target language
3. The system will automatically detect the new language column

### Option 2: Edit the CSV File

The reference data lives in `data/csv/codex_translations.csv`.

**Current columns:**
- `name` - Character/term identifier
- `english` - English text
- `dutch` - Dutch translation
- `category` - CHARACTER, LOCATION, ITEM, etc.

**To add a new language:**

1. Open the CSV in a spreadsheet application
2. Add a new column with your language name (e.g., `portuguese`, `spanish`)
3. Fill in translations for each row
4. Save the file

**Example:**
```csv
name,english,dutch,portuguese,category
Maria,Maria,Maria,Maria,CHARACTER
The Key,The Key,De Sleutel,A Chave,ITEM
```

### Column Naming Convention

Use lowercase language names as column headers:
- `dutch`
- `portuguese`
- `spanish`
- `french`
- `german`

## Tips

- You don't need to translate every entry - partial coverage still helps
- Focus on main character names first
- Common phrases and items are secondary

## Questions?

Open an issue on the GitHub repository if you need help setting up reference data.
```

**Step 2: Commit**

```bash
git add public/docs/reference-data-guide.md
git commit -m "docs: add reference data setup guide"
```

---

## Task 7: Test & Verify

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Manual testing checklist**

- [ ] Load an Excel file with a non-Dutch language (e.g., Portuguese)
- [ ] Verify LanguageSelector shows the detected language
- [ ] Verify ReferenceDataInfo shows amber "not available" state
- [ ] Click "Learn how to add reference data" - opens documentation
- [ ] Switch to Dutch language
- [ ] Verify ReferenceDataInfo shows green "available" state
- [ ] Open CodexEditor - verify labels say "Translation" or dynamic language name

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete multi-language codex support"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Update API for dynamic language columns | `api/codex/route.ts` |
| 2 | Create language availability hook | `useCodexLanguages.ts` |
| 3 | Create info panel component | `ReferenceDataInfo.tsx` |
| 4 | Integrate into SetupWizard | `SetupWizard.tsx` |
| 5 | Update UI labels to dynamic | `CodexEditor.tsx`, `QuickReferenceBar.tsx`, `ReferenceToolsPanel.tsx` |
| 6 | Create user documentation | `reference-data-guide.md` |
| 7 | Test & verify | Manual testing |
