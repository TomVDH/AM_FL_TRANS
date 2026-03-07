# AI Translation Tiers Design

## Overview

Three-tier AI translation system: Haiku (fast default), Sonnet (on-demand upgrade), Opus (bulk sheet translation).

## Model Tiers

| Tier | Model | Use Case | Trigger |
|------|-------|----------|---------|
| Haiku | `claude-haiku-4-5-20251001` | Auto-suggest as you navigate | AI toggle (default) |
| Sonnet | `claude-sonnet-4-6` | Upgrade a single suggestion | ↑ button on pill |
| Opus | `claude-opus-4-0-20250514` | Bulk translate entire sheet | Ctrl+Shift+T |

All tiers use the same prompt template with surrounding lines, codex entries, and speaker context.

## Part 1: API Model Parameter

The `/api/ai-suggest` route accepts `model?: 'haiku' | 'sonnet' | 'opus'` in the request body. Defaults to `'haiku'`. Response includes `{ suggestion, model }`.

Model mapping:
- `haiku` → `claude-haiku-4-5-20251001`, max_tokens: 200
- `sonnet` → `claude-sonnet-4-6`, max_tokens: 300
- `opus` → `claude-opus-4-0-20250514`, max_tokens: 400

## Part 2: Pill Upgrade Button

The golden suggestion pill shows:
- Model badge: tiny `HAIKU` or `SONNET` text
- Upgrade icon `↑`: appears when result is from Haiku, re-fires with Sonnet
- Insert icon `+`: inserts suggestion (existing behavior, now clicking text area)

Flow:
1. AI auto-suggests with Haiku → pill shows result + `HAIKU` badge + `↑` + `+`
2. User clicks `↑` → spinner → re-fetches with Sonnet
3. Result replaces pill text, badge becomes `SONNET`, `↑` disappears

## Part 3: AI Translate Sheet

**Trigger**: `Ctrl+Shift+T` (translation view only)

**Confirmation modal**:
- Title: "AI Translate Sheet"
- Shows line counts: empty / already translated / total
- Warning about re-translating existing lines
- Cancel / Start Translation buttons

**Progress UI** (modal stays open):
- Progress bar with line count
- Current line being processed
- Stop button (keeps completed translations)

**Processing**: Sequential, one line at a time. Each line gets full context (5 before/after, codex, speaker). No parallelism — maintains quality and respects rate limits.

## Part 4: Diff Review Mode

After Opus finishes, review mode replaces normal translation view.

**Per-line card**:
- Source text
- Old translation (gray, strikethrough) — if existed
- Opus translation (green highlight)
- Accept / Keep Old buttons

**Bulk actions** (top bar):
- Accept All
- Accept All Empty (only lines that had no translation)
- Reject All Changed
- Exit Review

**State**: Diff data lives in component state only. Navigating away discards unreviewed Opus suggestions (originals kept).

## Files to Modify

1. `src/app/api/ai-suggest/route.ts` — add model parameter, model mapping
2. `src/hooks/useAiSuggestion.ts` — add model support, upgrade function
3. `src/components/TranslationHelper.tsx` — pill UI changes, keyboard shortcut, bulk translate state, review mode
