# Screen 2 Restructure — Translation Workspace

**Date:** 2026-03-07
**Status:** Design approved
**Scope:** Screen 2 (TranslationHelper main workspace) only.
**Goal:** Fix header visual weight, rebalance the two columns, consolidate conditional panels below the workspace.

---

## Problems

1. **Header trimmed too aggressively** — Single compressed row lacks visual weight. Buttons are bare icons with no borders. Missing context (timer). Missing proper button styling.
2. **Two columns aren't balanced** — Left column (source) is too tall/busy with 5-7 sub-sections. Right column (translation) feels cramped. Both columns have equal visual weight when the translation textarea should dominate.
3. **Too many conditional panels below** — Reference Tools, Quick Reference Bar, Output Table, and Bulk Translate appear as separate sections below the grid. Cluttered and disorienting.

---

## Block 1: Header — Two-Row Bar with Pill Buttons

### Current
Single compressed row: `[←] filename · Sheet  n/total %  [filter][⌨][☀]`

### New
Two distinct rows with proper button styling matching Screen 1 footer pill style.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Row 1: [← Back]  EP04 · Sheet 2 · J14      12:34      [Filter▾][⌨][☀][⚙] │
│ Row 2: [◀] [═══════ progress bar ═══════] 47/312 · 15% [▶]  [Std|Gp|Conv] │
└──────────────────────────────────────────────────────────────────────┘
```

**Row 1 — Context + Utilities:**
- Left: Back button (pill style) + filename + sheet name + cell reference (e.g., "J14")
- Center-right: Elapsed timer (e.g., "12:34")
- Right: Utility buttons as bordered pills (matching Screen 1 footer button style: `h-7 px-2.5 bg-gradient-to-br border icon + label`)
  - [Filter ▾] — opens filter/jump popover
  - [⌨ Keys] — opens floating shortcuts panel (NOT full-screen modal)
  - [☀/☾] — dark mode toggle
  - [⚙] — settings if needed

**Row 2 — Navigation + View Modes:**
- Left: Previous button + hybrid progress bar + counter (47/312 · 15%) + Next button
- Right: View switcher segmented control with icons reintroduced: [Standard | Gamepad | Conversation]

### Button Style
All header utility buttons use the Screen 1 footer pill style:
```tsx
className="group relative h-7 px-2.5 flex items-center gap-1.5
  bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900
  text-gray-500 dark:text-gray-400
  border border-gray-200 dark:border-gray-700
  hover:border-gray-400 dark:hover:border-gray-500
  hover:text-gray-700 dark:hover:text-gray-300
  transition-all duration-200"
style={{ borderRadius: '3px' }}
```

### View Switcher Icons
Reintroduce icons in the segmented control buttons alongside text labels.

---

## Block 2: Keyboard Shortcuts — Floating Panel

### Current
Full-screen overlay modal triggered by [⌨] button.

### New
Floating panel anchored to the [⌨] button. Appears as a dropdown/popover, not a full-screen takeover. Same content, lighter container. Dismiss by clicking outside or pressing Esc.

---

## Block 3: Two-Column Workspace — Rebalanced

### Left Column (Source) — Minimal, No Card

**Visual treatment:** No card styling. No border, no shadow, no background. Source text sits directly on the page background. This is reference material, not the active workspace.

**Simplified header row:**
Cell ref badge + speaker name compressed into a single compact line. Remove the copy/search buttons from the header (move copy to a keyboard shortcut, search stays with R toggle).

**One-line truncated previews:**
The n-1 and n+1 preview rows become single-line truncated summaries instead of full clickable button containers. Smaller font, less padding, just enough for context.

**AI suggestion moves here:**
The AI suggestion display moves from the right column to the left column, below the source text. It's reference material — a suggestion to consider while translating, not an action button competing with the textarea. Click to insert OR use `Cmd+I` keyboard shortcut.

**Layout:**
```
J14 · Smart Ass                        (simplified header)

"You really think that's going         (source text, prominent)
 to work?"

context: sarcastic tone                (amber context note, conditional)

AI: "Denk je echt dat dit gaat..." [×] (AI suggestion, muted, conditional)

← J13 Speaker — prev text...           (one-line truncated, small)
→ J15 Speaker — next text...           (one-line truncated, small)
```

### Right Column (Translation) — Elevated Card with Embedded Toolbar

**Visual treatment:** This is the active workspace. Elevated card with border, shadow, white background. Stands out from the page.

**Embedded toolbar:**
The tool toggles (H/A/R/O/Live) and the Submit button move INTO the textarea's top border, like a rich text editor toolbar. This eliminates separate rows for toggles and submit.

```
┌─[H][A][R][O][Live·]──────────── Modified ── [Submit →]─┐
│                                                          │
│  Translation textarea                                    │
│  (dominant, tall, autofocus, flex-1)                     │
│                                                          │
│                                                          │
│                                          Shift+Enter hint│
└──────────────────────────────────────────────────────────┘
```

**Toolbar elements:**
- Left: Toggle buttons (H, A, R, O, Live) as small pills
- Center: "Modified" indicator (green dot + text, only shown when changed)
- Right: Submit button (primary action, dark bg, arrow icon)
- The "Shift+Enter to submit" hint sits at the bottom-right of the textarea

**Textarea behavior:**
- `flex-1` fills all available height
- Green border when modified (existing behavior, keep)
- `aria-label` for accessibility
- Autofocus on mount

---

## Block 4: Consolidated Panel Below Workspace

### Current
4 separate conditional sections:
1. Reference Tools Panel (when R toggle is on)
2. Quick Reference Bar (translation memory matches)
3. Output Table (when O toggle is on)
4. Bulk Translate section (batch AI controls)

### New
Single collapsible tabbed panel with 4 tabs:

```
Tools & Data   [Reference | Quick Ref | Output | Bulk Translate]   [v]
```

**Collapsed state (default):**
Single line with summary info, similar to Screen 1's Reference & Config panel. Shows relevant counts/status.

**Expanded state:**
Tab bar with 4 tabs, only one active at a time.

**Tab contents:**
- **Reference** — XLSX search/consultation panel (existing ReferenceToolsPanel component)
- **Quick Ref** — Translation memory and codex matches (existing QuickReferenceBar content)
- **Output** — Stats table with completion data (existing Output Table)
- **Bulk Translate** — Batch AI translation controls with model tier selection

**Behavior:**
- Collapsed by default to maximize workspace height
- Remembers last active tab in localStorage
- All 4 tabs available in all view modes (Standard, Gamepad, Conversation)
- R and O toggles in the toolbar can auto-expand the panel to their respective tabs

---

## Block 5: AI Suggestion Behavior Changes

1. **Position:** Moves from right column (below textarea) to left column (below source text)
2. **Default state:** AI suggestions disabled by default (`A` toggle starts OFF)
3. **Quick insert shortcut:** `Cmd+I` (macOS) / `Ctrl+I` (Windows) inserts the current AI suggestion into the textarea
4. **Visual style:** Muted, same gray family as other UI elements. Not prominent — it's a reference, not a CTA.
5. **Click to insert:** Clicking the suggestion text still inserts it (existing behavior)
6. **Dismiss:** [×] button or `Esc` when focused

---

## Complete Screen 2 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ [← Back]  EP04 · Sheet 2 · J14      12:34      [Filter▾][⌨][☀][⚙] │
│ [◀] [═══════ progress ═══════] 47/312 · 15% [▶]  [Std|Gp|Conv]    │
├──────────────────────────────────────────────────────────────────────┤
│  Source Text                    │  Translation                       │
├────────────────────────────────┼────────────────────────────────────┤
│                                │  ┌─[H][A][R][O][Live]─Mod─[Submit]┐│
│  J14 · Smart Ass               │  │                                ││
│                                │  │  Translation textarea           ││
│  "You really think that's      │  │  (tall, dominant, autofocus)    ││
│   going to work?"              │  │                                ││
│                                │  │                    Shift+Enter  ││
│  context: sarcastic            │  └────────────────────────────────┘│
│  AI: "Denk je echt..." [×]    │                                    │
│                                │                                    │
│  ← J13 prev text...           │                                    │
│  → J15 next text...           │                                    │
├────────────────────────────────┴────────────────────────────────────┤
│  Tools & Data    [Reference|QuickRef|Output|BulkTranslate]     [v]  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## What Changes (Summary)

1. **Header:** Expand from 1 row to 2. Add proper pill button styling. Reintroduce timer. Progress bar moves into header Row 2. View switcher with icons in Row 2 right.
2. **Column headers:** Stay (user chose to keep "Source Text" / "Translation" labels).
3. **Source column:** Remove card styling (no border/shadow/bg). Simplify header row. Truncate n-1/n+1 previews to one line. Move AI suggestion here from right column.
4. **Translation column:** Elevated card with embedded toolbar. Tool toggles + Submit button in textarea border toolbar. Textarea gets maximum height.
5. **Below workspace:** Consolidate 4 separate panels into 1 tabbed panel (Reference, Quick Ref, Output, Bulk Translate). Collapsed by default.
6. **Keyboard shortcuts:** Floating panel instead of full-screen modal.
7. **AI suggestions:** Disabled by default. Quick insert via Cmd+I.
8. **Alternative views:** Gamepad and Conversation views share the consolidated panel below.

## What Stays the Same

- Progress bar hybrid logic (pips for ≤50, continuous for 50+)
- Three view modes (Standard, Gamepad, Conversation)
- All existing tool toggles and their functionality (H, A, R, O, Live)
- AI suggestion content and generation logic
- Codex popover behavior
- Dark mode system
- All keyboard shortcuts (just adding Cmd+I)

---

## Implementation Notes

- The embedded toolbar is a new pattern — consider extracting it as a `ToolbarTextarea` component
- The consolidated panel below reuses existing components as tab contents
- R and O toggles should auto-expand the panel to their tab when toggled ON
- The floating shortcuts panel replaces the modal — same content, different container
- Timer (elapsed time) was previously implemented via `useTranslationTimer` hook — reintroduce in header
- All changes are in `TranslationHelper.tsx` + potential new components for the toolbar and panel

## Out of Scope

- Screen 1 changes (separate design doc)
- Conversation view internals
- Gamepad view internals
- New features
- Backend/API changes
