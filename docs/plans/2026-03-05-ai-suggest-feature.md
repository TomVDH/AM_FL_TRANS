# AI Translation Suggestion Feature — Implementation Plan

**Goal:** Add a toggleable AI suggestion button to the translation helper that calls Claude to suggest Dutch translations, using English source text, speaker context, codex style profiles (English + Dutch), and existing translations for reference.

**Architecture:** Server-side API route (`/api/ai-suggest`) keeps API key secure. Client-side toggle in mode button row, golden pill preview below textarea, click to insert. Default OFF — zero API calls when disabled.

---

## Phase 0: Dutch Style Analysis

### Task 1: Extract and analyze Dutch translation styles per speaker

**Files:**
- Create: `scripts/extract-dutch-dialogue-by-speaker.js`
- Create: `scripts/analyze-dutch-styles.js`
- Create: `scripts/import-dutch-styles-to-codex.js`
- Modify: `data/json/codex_translations.json` (new `dutchDialogueStyle` field)
- Modify: `data/csv/codex_translations.csv` (new column)

Mirror the English pipeline but extract Column D (Dutch translations) grouped by speaker. Analyze with Claude for Dutch-specific style patterns. Import into a new `dutchDialogueStyle` codex field.

---

## Phase 1: API Route

### Task 2: Create `/api/ai-suggest` route

**Files:**
- Create: `src/app/api/ai-suggest/route.ts`

**Behavior:**
- POST endpoint accepting `{ english, speaker, context, existingTranslation? }`
- Looks up speaker in codex JSON for style profiles, gender, bio
- Constructs prompt with all context
- Calls `claude-haiku-4-5-20251001` via `@anthropic-ai/sdk`
- Returns `{ suggestion: string }`
- Uses `ANTHROPIC_API_KEY` from environment

---

## Phase 2: Client-Side Hook

### Task 3: Create `useAiSuggestion` hook

**Files:**
- Create: `src/hooks/useAiSuggestion.ts`

**State:**
- `aiSuggestEnabled: boolean` — toggle state, default false
- `aiSuggestion: string | null` — current suggestion text
- `isLoadingAiSuggestion: boolean` — loading state
- `aiSuggestError: string | null` — error state

**Behavior:**
- When enabled + entry changes → fetch suggestion (debounced 300ms)
- AbortController cancels pending request on navigation
- Does nothing when disabled
- Exposes `toggleAiSuggest()`, `fetchAiSuggestion()`, `clearAiSuggestion()`

---

## Phase 3: UI Integration

### Task 4: Add AI Suggest toggle button + golden pill

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

**Toggle button:**
- In mode toggle row after Live Edit button
- Golden/amber color scheme when active
- Sparkle icon
- Keyboard shortcut: `A`

**Golden pill:**
- Appears below textarea when suggestion is available
- Shimmer animation while loading
- Click to insert via `insertTranslatedSuggestion()`
- Shows truncated preview of suggestion

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `scripts/extract-dutch-dialogue-by-speaker.js` | Create | Extract Dutch translations grouped by speaker |
| `scripts/analyze-dutch-styles.js` | Create | Claude-powered Dutch style profiling |
| `scripts/import-dutch-styles-to-codex.js` | Create | Patch codex with Dutch style profiles |
| `src/app/api/ai-suggest/route.ts` | Create | Server-side Claude API proxy |
| `src/hooks/useAiSuggestion.ts` | Create | Client-side suggestion state management |
| `src/components/TranslationHelper.tsx` | Modify | Toggle button + golden pill UI |
| `data/json/codex_translations.json` | Modify | Add dutchDialogueStyle field |
| `data/csv/codex_translations.csv` | Modify | Add dutchDialogueStyle column |
