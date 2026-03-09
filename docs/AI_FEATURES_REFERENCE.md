# AI Features Reference — AM_FL_TRANS Translation Workbench

> Full technical reference for all AI-powered features in the Asses & Masses translation workbench. Use this document as context when continuing development in a new session.

---

## Architecture Overview

All live AI features route through **one shared API endpoint** (`/api/ai-suggest`) which calls the Anthropic Claude API. The codex (`codex_translations.json`) is the central knowledge base that feeds character data into every prompt.

```
USER ACTION
    │
    ├── [A key] Single-line AI Suggest
    │       └── useAiSuggestion hook → debounce 300ms
    │               └── POST /api/ai-suggest (haiku, upgradeable to sonnet)
    │
    ├── [Ctrl+Shift+T] Bulk Translate
    │       └── useBulkTranslate hook → sequential loop
    │               └── POST /api/ai-suggest × N lines (configurable model)
    │
    └── [Style Analysis Panel] Codex Enrichment Pipeline
            └── POST /api/style-analysis → spawns Node scripts
                    └── Claude Sonnet → speaker-styles.json → codex
```

---

## Feature 1: Single-Line AI Suggest

### Purpose
Real-time inline translation suggestion for the currently active dialogue line. Shows as a golden-tinted italic suggestion below the source text. The translator can accept with one click or `Cmd+I`.

### Files
| File | Role |
|------|------|
| `src/hooks/useAiSuggestion.ts` | State machine: debounce, fetch, abort, upgrade |
| `src/app/api/ai-suggest/route.ts` | API endpoint (shared with bulk) |
| `src/components/TranslationHelper.tsx` ~L1382-1424 | Suggestion display UI |
| `src/components/TranslationHelper.tsx` ~L765-768 | Toggle shortcut handler |

### Behavior
1. User presses `A` to toggle AI Suggest on
2. On each line change, a 300ms debounce fires, then calls `/api/ai-suggest` with model `haiku`
3. Response appears as italic amber text with lightbulb icon
4. User can click suggestion or press `Cmd+I` to accept (replaces current translation)
5. An upgrade chevron (visible when model=haiku) calls `fetchAiSuggestion('sonnet')` for a higher-quality re-suggestion without clearing the existing one

### Key Implementation Details
- **AbortController**: Each new fetch cancels the previous one (`abortControllerRef`)
- **Stale guard**: `lastFetchedIndexRef` prevents applying a suggestion from a previous line
- **Upgrade path**: `isUpgradingAiSuggestion` shows spinner overlay while keeping existing haiku text visible
- **Accept action**: `setCurrentTranslation(aiSuggestion)` — full replacement, not insertion at cursor

### History
- **v1**: Original implementation used `insertTranslatedSuggestion()` which inserted at cursor position, causing doubling bugs when the textarea already had content
- **v2 (current)**: Changed to `setCurrentTranslation()` for full replacement. Fixed in both click handler and `Cmd+I` shortcut

---

## Feature 2: Bulk Translate

### Purpose
Batch-processes an entire sheet (or scoped subset) through the AI, then presents a full-screen diff review UI where the translator can accept, reject, or edit each suggestion before committing.

### Files
| File | Role |
|------|------|
| `src/hooks/useBulkTranslate.ts` | Core async loop, session management, garbage filter |
| `src/app/api/ai-suggest/route.ts` | Same API endpoint as single-line |
| `src/components/TranslationHelper.tsx` ~L2224-2377 | Config modal UI |
| `src/components/TranslationHelper.tsx` ~L2028-2076 | Progress display (in bulk tab) |
| `src/components/TranslationHelper.tsx` ~L2381-2588 | Review screen |
| `src/components/WorkspaceToolsPanel.tsx` | Tab badge with live percentage |

### Configuration Options
```typescript
interface BulkTranslateOptions {
  model:         'haiku' | 'sonnet' | 'opus'  // default: 'opus'
  scope:         'all' | 'empty' | 'from-current'  // default: 'all'
  contextWindow: 0-10           // lines of context before/after, default: 5
  requestDelay:  0-1000ms       // delay between API calls, default: 200ms
  startIndex:    number         // for 'from-current' scope
}
```

### Session Management (Concurrent Run Protection)
A module-level `globalSessionId` counter increments on each `startBulkTranslate()` call. The async loop checks `globalSessionId !== mySessionId` after every `await` (both after the fetch and after the delay). If superseded, the loop exits gracefully and discards its results.

```typescript
let globalSessionId = 0;  // module-level

// In startBulkTranslate:
globalSessionId += 1;
const mySessionId = globalSessionId;
abortRef.current = true;          // signal abort to previous run's in-flight fetch
await new Promise(r => setTimeout(r, 50));  // tick for previous run to see abort
abortRef.current = false;         // clear for this run

// In loop:
if (abortRef.current || globalSessionId !== mySessionId) break;
```

### Garbage Response Filter
```typescript
function isGarbageResponse(suggestion: string, sourceText: string): boolean {
  // Rejects model refusals
  if (lower.includes("i'm ready to translate") || ...) return true;
  // Rejects hallucinations (5x+ source length AND over 200 chars)
  if (suggestion.length > sourceText.length * 5 && suggestion.length > 200) return true;
  return false;
}
```

### Per-Request Timeout
- Client-side: `AbortController` with 45s timeout per fetch
- Server-side: Anthropic SDK `timeout: 40_000` (40s)

### Review Screen
- Full-screen overlay (`z-[90]`)
- Shows each suggestion as a card: EN source, old translation (struck through), new AI suggestion (green)
- Per-card: Accept / Keep Old buttons, editable textarea for tweaking
- Bulk actions: Accept Empty, Reject Changed, Accept All, Exit Review
- Accepted translations write back into the main `translations` array

### Progress Display
- Non-blocking: lives in the "Bulk Translate" tab of WorkspaceToolsPanel
- Shows: spinner, "AI Translating", progress/total, percentage, progress bar
- Ephemeral preview: last source→suggestion pair with slide-up animation
- Tab badge shows live percentage during translation
- Stop button sets `abortRef.current = true`

### History
- **v1**: Full blocking modal during translation (prevented all other work)
- **v2**: Progress moved to workspace tools tab, non-blocking
- **v3 (current)**: Added session management (globalSessionId), garbage filter, per-request timeouts, configurable scope/context/delay. Fixed concurrent run bug where two loops would run simultaneously after HMR or fast re-triggers.

### Root Causes Fixed (Session 2026-03-08)
1. **Concurrent runs**: Old `runningRef` didn't survive component remounts. Fixed with module-level `globalSessionId`
2. **Model refusals**: "I'm ready to translate, but I notice you've provided context..." — garbage filter now catches these
3. **Hallucinations**: Response about wrong topic, 5x+ source length — caught by length check
4. **No timeouts**: Requests could hang indefinitely — now 45s client + 40s server

---

## Feature 3: Style Analysis Pipeline

### Purpose
Admin/maintenance tool that uses Claude to analyze character speaking styles across all episodes and writes `dialogueStyle` (English) and `dutchDialogueStyle` (Flemish/Dutch) fields into the codex. These fields are the most important input to AI translation quality.

### Files
| File | Role |
|------|------|
| `src/app/api/style-analysis/route.ts` | Pipeline runner (spawns scripts) |
| `src/components/StyleAnalysisPanel.tsx` | Admin UI with per-step controls |
| `scripts/pipeline/extract-dialogue-by-speaker.js` | Extracts EN dialogue → CSV |
| `scripts/pipeline/extract-dutch-dialogue-by-speaker.js` | Extracts NL dialogue → CSV |
| `scripts/pipeline/analyze-speaker-styles.js` | Claude Sonnet → English style profiles |
| `scripts/pipeline/analyze-dutch-styles.js` | Claude Sonnet → Dutch style profiles |
| `scripts/pipeline/import-styles-to-codex.js` | Writes English styles to codex |
| `scripts/pipeline/import-dutch-styles-to-codex.js` | Writes Dutch styles to codex |

### Pipeline Steps
| # | Step | Script | Uses AI | Output |
|---|------|--------|---------|--------|
| 1 | Extract English dialogue | `extract-dialogue-by-speaker.js` | No | `speaker-dialogue.csv` |
| 2 | Extract Dutch dialogue | `extract-dutch-dialogue-by-speaker.js` | No | `speaker-dutch-dialogue.csv` |
| 3 | Analyze English styles | `analyze-speaker-styles.js` | Yes (Sonnet) | `speaker-styles.json` |
| 4 | Analyze Dutch styles | `analyze-dutch-styles.js` | Yes (Sonnet) | `speaker-dutch-styles.json` |
| 5 | Import English styles | `import-styles-to-codex.js --apply` | No | codex updated |
| 6 | Import Dutch styles | `import-dutch-styles-to-codex.js --apply` | No | codex updated |

### Analysis Prompts
- **English**: Asks for Tone, Vocabulary, Verbal tics, Sentence structure, Key themes (max 300 tokens)
- **Dutch**: Asks for Register, Dutch flavor, Character voice preservation, Verbal tics in Dutch, Translation approach (max 300 tokens)
- Model: `claude-sonnet-4-20250514`
- Samples up to 60 lines per character spread across episodes

---

## Feature 4: Codex System

### Purpose
Central knowledge base feeding character data into every AI prompt. Single source of truth for character names, dialogue styles, and translation conventions.

### Data File
`data/json/codex_translations.json` — 179 entries, version 2.0

### CHARACTER Entry Schema
```typescript
{
  english: string,           // "Miner Jenny"
  dutch: string,             // "Mijnwerker Jenny"
  category: "CHARACTER",
  nicknames: string[],       // ["Miner", "Jenny"]
  bio: string,               // character background
  gender: string,            // "female"
  dialogueStyle: string,     // English speaking style analysis
  dutchDialogueStyle: string // Dutch/Flemish translation style guide
}
```

### How Codex Feeds Into AI Prompts
In `route.ts` (`/api/ai-suggest`):
1. **Speaker lookup** (`findCharacterEntry`): exact match → nickname match → partial match
2. **Term scan** (`findRelevantCodexEntries`): finds all codex entries mentioned in source + surrounding lines
3. **Prompt injection**: Speaker gets full profile (Dutch name, gender, dialogueStyle, dutchDialogueStyle, bio). Referenced terms get `english → dutch (category) [gender]` pairs.

### Codex Cache
Module-level `codexCache` with 60s TTL. Not invalidated by content changes — requires server restart or 60s wait after codex edits.

### Coverage (as of 2026-03-08)
- **38 characters** with `dutchDialogueStyle` (full Flemish translation guidance)
- **5 characters** with English-only style (Bleak Ass, Edgy Ass, Foal, Resentful Ass, Skinny Ass — all <14 lines)
- **83 characters** with no style at all (minor NPCs)

### Flemish Voice Stratification
The `dutchDialogueStyle` field deliberately varies Flemish density by character:
- **Heavy Flemish** (ge/gij, 'k/'t, nie, -ke): Lazy Ass, Thirsty Ass, Bad Ass, Helpful Ass, Cole-Machine
- **Moderate Flemish**: Sturdy Ass, Kick Ass, Big Ass, {$NewName} (player character)
- **Formal Netherlandic** (no Flemish): Golden Ass, Hee, Haw (divine characters)
- **Standard Dutch** (deliberately un-Flemish): Miner Jenny, Mr. Butte
- **Upper-class Belgian-formal**: Proper Ass

This linguistic stratification IS characterization — Flemish density reflects social class, community belonging, and character personality.

---

## Feature 5: Translation Memory

### Purpose
Persists every approved translation to a JSONL file for future reference. Not AI-generated, but surfaces as Quick Reference suggestions.

### Files
| File | Role |
|------|------|
| `src/hooks/useTranslationMemory.ts` | O(1) source-text lookup, deduplication |
| `src/app/api/translation-memory/route.ts` | GET (all entries) / POST (append) |
| `data/translation-memory.jsonl` | Storage (newline-delimited JSON) |

---

## Feature 6: Offline Batch Translation Scripts

### Purpose
Standalone scripts used for initial bulk translation seeding (before the web UI bulk translate existed). Not connected to the web UI.

### Files
| File | Model | Notes |
|------|-------|-------|
| `scripts/ai/ai-translate.js` | claude-sonnet-4-5-20250929 | Reads JSON episode files, bulk translates |
| `translation-batches/translate-all-batches.js` | claude-sonnet-4-5-20250929 | Processes 64 pre-split batch files, max 16K tokens, temp 0.3 |

---

## API Endpoint Reference

### POST `/api/ai-suggest`
The only live AI endpoint. Used by both single-line suggest and bulk translate.

**Request:**
```json
{
  "english": "No sleeping on the job you useless donkey!",
  "speaker": "Miner Jenny",
  "context": "Hard Ass wakes up to a hit on the head via Jenny.",
  "existingTranslation": "Er word niet op het werk geslapen, nutteloze ezel!",
  "linesBefore": [{ "speaker": "...", "text": "..." }],
  "linesAfter": [{ "speaker": "...", "text": "..." }],
  "model": "haiku"
}
```

**Response:**
```json
{
  "suggestion": "Geen slapen op het werk, nutteloze ezel!",
  "model": "haiku"
}
```

**Model Configuration:**
| Tier | Model ID | Max Tokens | Typical Use |
|------|----------|-----------|-------------|
| haiku | claude-haiku-4-5-20251001 | 300 | Single-line auto-suggest (fast, cheap) |
| sonnet | claude-sonnet-4-6 | 400 | Upgrade from haiku, balanced |
| opus | claude-opus-4-6 | 500 | Bulk translate default (best quality) |

**Prompt Structure:**
```
Translate this ONE English dialogue line into Dutch for the animated series
"Asses & Masses" ("Ezels & Massa's") about donkeys in an allegorical society.

[Speaker character info: Dutch name, gender, dialogueStyle, dutchDialogueStyle, bio]
[Previous lines: up to contextWindow lines before]
[Following lines: up to contextWindow lines after]
[Referenced terms/characters: codex matches found in text]
[Scene context: from description column]
[Current translation: if exists, for reference]

THE LINE TO TRANSLATE:
"<english text>"

RULES:
- Output ONLY the Dutch translation wrapped in <translation> tags
- No explanation, no commentary, no alternatives, no preamble
- Match the character's established Dutch voice and register
- Preserve tone, humor, wordplay, and verbal tics
- Keep sound effects as-is or use Dutch equivalent (*cough* → *kuch*)
- Translate ONLY the line above — ignore any similarity to context lines

<translation>your Dutch translation here</translation>
```

### GET/POST `/api/style-analysis`
Pipeline runner for codex enrichment. GET returns status, POST runs a named step.

### GET/POST `/api/codex`
CRUD for codex entries. Reads/writes `codex_translations.csv`.

### GET/POST `/api/translation-memory`
Read all / append new translation memory entries.

---

## Keyboard Shortcuts (AI-Specific)

| Shortcut | Action | Context |
|----------|--------|---------|
| `A` | Toggle AI Suggest on/off | When textarea not focused |
| `Cmd+I` / `Ctrl+I` | Accept current AI suggestion | Works anywhere |
| `Ctrl+Shift+T` | Open Bulk Translate config modal | Works anywhere |

---

## Settings & Persistence

| Setting | Default | Persisted | Location |
|---------|---------|-----------|----------|
| AI Suggest enabled | `false` | No (resets on reload) | `useAiSuggestion` state |
| Bulk model tier | `'opus'` | No | `TranslationHelper` state |
| Bulk scope | `'all'` | No | `TranslationHelper` state |
| Bulk context window | `5` | No | `TranslationHelper` state |
| Bulk request delay | `200ms` | No | `TranslationHelper` state |
| Active tools tab | last used | Yes (`localStorage`) | `WorkspaceToolsPanel` |
| `ANTHROPIC_API_KEY` | env var | Server-side only | `.env.local` |

---

## Known Limitations & Future Considerations

1. **Codex cache TTL**: 60s cache means codex edits take up to 60s to affect AI suggestions. No manual invalidation mechanism.
2. **No streaming**: All AI responses are non-streaming. For long opus responses, the user sees nothing until the full response arrives.
3. **Single endpoint**: Both single-line and bulk use the same `/api/ai-suggest` endpoint. No rate limiting or queue management between them.
4. **Bulk settings not persisted**: Model, scope, context window, and delay reset to defaults on page reload.
5. **No retry logic**: Failed requests in bulk translate are logged and skipped, not retried.
6. **Translation memory not fed to AI**: The JSONL memory store exists but is not included in AI prompts as reference data.
