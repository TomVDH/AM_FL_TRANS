# Per-Character Translation Corpus + Bulk Translate Polish

**Date:** 2026-03-10
**Status:** Plan — ready for implementation by agent

## Overview

Three connected improvements:
1. **Per-character translation corpus** — accumulate all accepted translations per speaker to feed back into style analysis scripts, enriching character voice profiles over time
2. **Bulk translate preview polish** — show `[Speaker]` in the live progress output as the job runs
3. **Go to completion after bulk accept** — after accepting a full AI bulk edit, offer a shortcut to jump straight to the completion/finish screen

---

## 1. Per-Character Translation Corpus

### Goal
When translations are accepted (bulk or manual), store them in a speaker-indexed corpus. Style analysis scripts (`analyze-dutch-styles.js`, `analyze-speaker-styles.js`) can then read this corpus to feed Claude actual approved translations as exemplars, improving character voice consistency across runs.

### Storage Format

**File:** `data/analysis/speaker-corpus.jsonl`
**Format:** Append-only JSONL, one entry per accepted translation line:
```json
{"speaker":"Trusty","english":"Wake up, you old fool!","dutch":"Wordt wakker, ouwe dwaas!","sheet":"E1_Farm","file":"1_asses.masses_E1Proxy.xlsx","ts":"2026-03-10T14:30:00Z"}
```

**Why JSONL:**
- Append-only — no parse/rewrite of full file on each save
- Streams well for large corpora (thousands of lines)
- Scripts can filter by speaker with simple line-by-line read
- Same format as existing `translation-memory.jsonl`

### Collection Points

**A. Manual submit** — in `TranslationHelper.tsx`, after `handleSubmit` persists a translation, also append to corpus if speaker is known:
- Call new API endpoint `POST /api/speaker-corpus` with `{speaker, english, dutch, sheet, file}`
- Only append if `utterers[currentIndex]` is not empty/unknown

**B. Bulk accept** — in `TranslationHelper.tsx`, after `acceptAll()` / `acceptAllEmpty()` applies translations:
- Loop through accepted results, append each to corpus via the same API
- Each `BulkTranslateResult` already has `speaker`, `sourceText`, `opusTranslation`

**C. Deduplication** — the API endpoint should check for exact `{speaker, english}` duplicates before appending (skip if already exists with same translation)

### API Endpoint

**`POST /api/speaker-corpus`** (`src/app/api/speaker-corpus/route.ts`)
- Accepts: `{ entries: Array<{speaker, english, dutch, sheet?, file?}> }`
- Reads existing JSONL, builds dedup set of `speaker:english` keys
- Appends new unique entries with timestamp
- Returns `{ added: number, skipped: number }`

**`GET /api/speaker-corpus?speaker=Trusty`**
- Returns all corpus entries for a given speaker (for style script consumption)
- Optional: `?format=csv` for script-friendly output

### Style Script Integration

**In `analyze-dutch-styles.js`:**
1. After loading the CSV dialogue samples, also load `speaker-corpus.jsonl`
2. Filter corpus entries for the current speaker
3. Add up to 20 corpus entries as a new prompt section:
   ```
   APPROVED TRANSLATIONS (use these as voice exemplars):
   EN: "Wake up, you old fool!"
   NL: "Wordt wakker, ouwe dwaas!"
   ---
   EN: "I'm not going anywhere."
   NL: "'k Ga nergens naartoe."
   ```
4. Instruct Claude: "These are human-approved translations for this character. Your style profile should reflect and reinforce the patterns in these translations."

**In `analyze-speaker-styles.js`:**
- Same pattern but English-only (just source text patterns, no translations)

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/api/speaker-corpus/route.ts` | **CREATE** — POST (batch append) + GET (query by speaker) |
| `data/analysis/speaker-corpus.jsonl` | **CREATE** — empty initially, grows over time |
| `src/components/TranslationHelper.tsx` | **MODIFY** — call corpus API on manual submit + bulk accept |
| `scripts/pipeline/analyze-dutch-styles.js` | **MODIFY** — load corpus, inject exemplars into prompt |
| `scripts/pipeline/analyze-speaker-styles.js` | **MODIFY** — load corpus for English dialogue patterns |

---

## 2. Bulk Translate Preview: Show Speaker Name

### Goal
During an active bulk translate run, the live progress preview in the Tools panel should show the speaker name in square brackets before the source text.

### Current Behavior
Line 2088 of `TranslationHelper.tsx`:
```tsx
<div className="text-xs text-gray-500 truncate">
  {bulkLastSource.substring(0, 80)}...
</div>
```

### Target Behavior
```tsx
<div className="text-xs text-gray-500 truncate">
  {bulkLastSpeaker && <span className="text-purple-500 dark:text-purple-400 font-medium">[{bulkLastSpeaker}]</span>}
  {' '}{bulkLastSource.substring(0, 80)}...
</div>
```

### Files to Modify

| File | Action |
|------|--------|
| `src/components/TranslationHelper.tsx` | **MODIFY** — add `[speaker]` prefix in bulk progress preview (line ~2088) |

The hook already exposes `bulkLastSpeaker` — this is purely a rendering change.

---

## 3. Go-to-Completion After Full Bulk Accept

### Goal
After the user accepts all translations from a bulk AI run (via "Accept All" in review mode), offer a direct path to the completion/finish screen. This makes sense because if every line has been translated, there's nothing left to manually edit.

### Current Flow
Accept All → review closes → user is back on translation Screen 2 at whatever line they were on → must manually click "Finish Sheet" in the toolbar or press the keyboard shortcut.

### Target Flow
Accept All → review closes → if ALL lines now have translations, show a toast or inline prompt:
> "All 123 lines translated. [Go to Finish →]"

### Implementation

**Option A: Toast with action button** (simplest)
- After `acceptAll()` completes and `setTranslations()` is called, check if `emptyCount === 0`
- If so, fire a toast: `toast.success('All lines translated', { action: { label: 'Finish Sheet →', onClick: finishSheet } })`
- Requires the toast library to support action buttons (check if it does)

**Option B: Banner above translation area**
- After bulk review exits, if all lines are filled, show a persistent amber banner at the top of Screen 2:
  ```
  ✨ All 123 lines translated by AI.  [Review & Finish →]
  ```
- Clicking it calls `finishSheet()` which navigates to the completion summary
- Banner dismisses if user starts editing any line manually

**Recommendation:** Option B — more visible, doesn't auto-dismiss like a toast, and gives the user a clear persistent call-to-action.

### Files to Modify

| File | Action |
|------|--------|
| `src/components/TranslationHelper.tsx` | **MODIFY** — add state `showBulkCompleteBanner`, set true after accept-all when emptyCount === 0, render banner, wire to `finishSheet()` |

---

## Implementation Order

1. **Speaker name in preview** (5 min, one-liner)
2. **Go-to-completion banner** (20 min, state + banner UI)
3. **Speaker corpus API** (30 min, new route + JSONL logic)
4. **Corpus collection hooks** (30 min, wire manual submit + bulk accept)
5. **Style script integration** (30 min, load corpus + augment prompts)

Steps 1-2 are independent. Steps 3-5 are sequential.
