# Previous Sheet Context for AI Suggestions — Design Doc

**Date**: 2026-03-07
**Approach**: A — Snapshot completed sheet data in session state

## Problem

When translating sheet-by-sheet through an Excel workbook, the AI has no awareness of translations completed on previous sheets. This means:
- Style/tone can drift between sheets for the same characters
- Recurring phrases may be translated inconsistently
- The translator loses the "memory" of their own work across sheets

## Goal

Pass a curated sample of previously translated sheet data as context to the AI suggestion system, so Claude can maintain consistent style and terminology across an entire workbook session.

## Design

### 1. New State: `completedSheetData`

**File**: `src/hooks/useTranslationState.ts`

Add a new state variable:

```typescript
const [completedSheetData, setCompletedSheetData] = useState<
  Map<string, { source: string; translation: string; speaker: string }[]>
>(new Map());
```

This map is keyed by sheet name and holds source/translation/speaker triples from each completed sheet.

### 2. Snapshot on Sheet Advance

**File**: `src/hooks/useTranslationState.ts` — `advanceToNextSheet()` (~line 1082)

Before calling `setSelectedSheet(nextSheet)` (which triggers `processExcelData` and overwrites all arrays), snapshot the current sheet:

```typescript
const advanceToNextSheet = useCallback(() => {
  const currentSheetIndex = excelSheets.indexOf(selectedSheet);
  if (currentSheetIndex < excelSheets.length - 1) {
    // ── Snapshot current sheet before overwrite ──
    const pairs: { source: string; translation: string; speaker: string }[] = [];
    for (let i = 0; i < sourceTexts.length; i++) {
      const t = translations[i];
      if (t && t !== '[BLANK, REMOVE LATER]' && sourceTexts[i]?.trim()) {
        pairs.push({
          source: sourceTexts[i],
          translation: t,
          speaker: utterers[i] ? trimSpeakerName(utterers[i]) : '',
        });
      }
    }
    if (pairs.length > 0) {
      setCompletedSheetData(prev => {
        const next = new Map(prev);
        next.set(selectedSheet, pairs);
        return next;
      });
    }
    // ── Then advance ──
    const nextSheet = excelSheets[currentSheetIndex + 1];
    setSelectedSheet(nextSheet);
    setShowCompletionSummary(false);
    setShowReviewMode(false);
    setCurrentIndex(0);
    setCurrentTranslation('');
  }
}, [excelSheets, selectedSheet, sourceTexts, translations, utterers, trimSpeakerName]);
```

Also snapshot when manually switching sheets via the sheet selector (if applicable).

### 3. Expose from `useTranslationState`

Add to the return object:

```typescript
completedSheetData,
```

### 4. Thread Through `useAiSuggestion`

**File**: `src/hooks/useAiSuggestion.ts`

Add to `UseAiSuggestionProps`:

```typescript
previousSheetSamples?: { source: string; translation: string; speaker: string }[];
```

Add to the fetch body:

```typescript
previousSheetSamples: previousSheetSamples && previousSheetSamples.length > 0
  ? previousSheetSamples
  : undefined,
```

### 5. Build the Sample Set in TranslationHelper

**File**: `src/components/TranslationHelper.tsx` — where `useAiSuggestion` is instantiated (~line 523)

Compute a flattened, capped sample from `completedSheetData`:

```typescript
const previousSheetSamples = useMemo(() => {
  if (completedSheetData.size === 0) return undefined;
  const samples: { source: string; translation: string; speaker: string }[] = [];
  // Take up to 15 entries per sheet, max 50 total
  for (const [, pairs] of completedSheetData) {
    // Prefer entries with the current speaker, then fill with others
    const speakerMatches = pairs.filter(p => p.speaker === currentSpeaker);
    const others = pairs.filter(p => p.speaker !== currentSpeaker);
    const selected = [...speakerMatches.slice(0, 10), ...others.slice(0, 5)];
    samples.push(...selected);
    if (samples.length >= 50) break;
  }
  return samples.slice(0, 50);
}, [completedSheetData, currentSpeaker]);
```

Pass into the hook:

```typescript
const aiSuggestion = useAiSuggestion({
  // ...existing props...
  previousSheetSamples,
});
```

### 6. Also Thread Through `useBulkTranslate`

**File**: `src/hooks/useBulkTranslate.ts`

Add `previousSheetSamples` to `UseBulkTranslateProps` and include in the `/api/ai-suggest` fetch body inside `startBulkTranslate`. Same data, same field name.

### 7. API Route: Accept and Inject into Prompt

**File**: `src/app/api/ai-suggest/route.ts`

Add to `SuggestRequest`:

```typescript
previousSheetSamples?: { source: string; translation: string; speaker: string }[];
```

Add a new context block in the `contextParts` assembly (after codex entries, before existing translation):

```typescript
if (previousSheetSamples && previousSheetSamples.length > 0) {
  const sampleLines = previousSheetSamples
    .map(s => `[${s.speaker || 'narrator'}] "${s.source}" → "${s.translation}"`)
    .join('\n');
  contextParts.push(
    `Previously translated lines from earlier sheets in this workbook (use for style/tone consistency):\n${sampleLines}`
  );
}
```

### 8. UI: Sheet Context Indicator

**File**: `src/components/TranslationHelper.tsx`

Add a small indicator near the AI toggle or under the help menu showing which sheets are loaded as context:

```
📋 Context: 3 sheets (142 entries)
  ✓ E6_Nightmare_localization (70)
  ✓ E6_BattleHard_localization (45)
  ✓ E6_World_localization (27)
```

This could be:
- A collapsible section in the existing help/keyboard shortcuts panel
- A small badge next to the AI toggle that expands on hover
- A tooltip on a new "context" icon in the toolbar

**Recommendation**: Small badge/icon in the toolbar row near the `✦ AI` / `● LIVE` buttons. Click to expand a dropdown showing the list. Minimal UI footprint.

### 9. Optional: Toggle in AI Translate Modal

In the Ctrl+Shift+T bulk translate modal, add a checkbox:

```
☑ Include previous sheet context (3 sheets, 142 samples)
```

Default: on. When off, `previousSheetSamples` is not sent. This gives the user control over whether previous sheet style should influence bulk translations.

## Data Flow Summary

```
Sheet 1 complete → "Next Sheet" click
                        ↓
    snapshot {source, translation, speaker}[] into completedSheetData Map
                        ↓
Sheet 2 loads → user requests AI suggestion (per-line or bulk)
                        ↓
    TranslationHelper computes flattened sample (≤50 entries, speaker-prioritized)
                        ↓
    useAiSuggestion / useBulkTranslate includes in fetch body
                        ↓
    /api/ai-suggest receives previousSheetSamples
                        ↓
    contextParts.push("Previously translated lines...")
                        ↓
    Claude sees prior work → consistent style across sheets
```

## Scope & Constraints

- **Session-only**: Data is lost on page refresh. This is acceptable — the user is doing sequential sheet work in a single session.
- **No workbookData fallback in v1**: We skip reading from the XLSX WorkBook for now. If the user wants cross-session context, that's a separate feature (could mine `translation-memory.jsonl`).
- **Token budget**: 50 sample entries × ~15 tokens each ≈ 750 tokens of context. Well within budget even for Haiku.
- **No deduplication needed**: Each sheet's data is distinct by definition (different dialogue lines).

## Files Changed

| File | Change | Lines |
|------|--------|-------|
| `src/hooks/useTranslationState.ts` | New state, snapshot in `advanceToNextSheet`, expose in return | ~25 |
| `src/hooks/useAiSuggestion.ts` | New prop, include in fetch body | ~8 |
| `src/hooks/useBulkTranslate.ts` | New prop, include in fetch body | ~8 |
| `src/app/api/ai-suggest/route.ts` | New field in interface, new context block | ~15 |
| `src/components/TranslationHelper.tsx` | Compute samples, pass to hooks, context badge UI | ~45 |
| **Total** | | **~100 lines** |

## Out of Scope (Future)

- Mining `translation-memory.jsonl` for cross-session context
- Mining `workbookData` for pre-session translations already in the file
- Per-sheet toggle (include/exclude individual sheets from context)
- Automatic speaker-style profiling from prior translations
