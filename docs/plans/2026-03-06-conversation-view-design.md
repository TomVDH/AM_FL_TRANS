# Conversation View — Project Design Document

## Overview

A new "group chat" rendering mode for the AM_FL_TRANS translation app. Instead of the current row-by-row spotlight view, the entire sheet is displayed as a scrolling conversation thread — like a group messaging app — where each character's dialogue appears as a chat bubble.

**Primary use cases:**
1. **Inline translation** — translate dialogue in context, seeing the full conversation flow around each line
2. **QA review** — read through the completed Dutch translation as a flowing conversation to check naturalness

**Scope (v1):** Read + Edit + Codex highlighting. No Live mode, no reference tools panel, no output table.

---

## Architecture

### Layout: Full-Width Takeover

When conversation mode is active, the entire two-column grid (source text card, textarea, output table) is replaced by three stacked zones:

```
+--------------------------------------------------+
| HEADER BAR (fixed top, ~48px)                     |
| [Sheet name] [progress] [EN|NL|EN+NL] [Me: ___] [x] |
+--------------------------------------------------+
|                                                    |
|  CHAT THREAD (scrollable, flex-1)                 |
|                                                    |
|         +--------------------+                     |
|         | SMART ASS       F  |  <- left, colored   |
|         | "We need to fight  |                     |
|         |  for our rights!"  |                     |
|         +--------------------+                     |
|                                                    |
|    - Narration: The herd gathers -  <- system msg  |
|                                                    |
|              +--------------------+                |
|              | "I agree, but how" |  <- right side  |
|              |  FOAL           F  |     (protag)    |
|              +--------------------+                |
|                                                    |
|  +--------------------+                            |
|  | OLD ASS         M  |  <- left, different color  |
|  | "Now hold on..."   |                            |
|  +--------------------+                            |
|                                                    |
+--------------------------------------------------+
| EDIT DOCK (fixed bottom, ~120px, visible on click)|
| [Speaker] "English source text..."                |
| +----------------------------------------------+  |
| | Dutch translation textarea...                |  |
| +----------------------------------------------+  |
| [<< -1] [Shift+Enter to submit] [+1 >>]          |
+--------------------------------------------------+
```

### Entry and Exit

- **Entry:** A sixth button (chat bubble icon) is added to the existing mode toggle button bar (alongside Gamepad, Highlight, Reference, Output, Live). Clicking it activates conversation mode.
- **Exit:** An `x` close button in the conversation view header bar. Also: pressing `Escape` exits. The button in the standard-mode bar also toggles it off.
- **State preserved:** When exiting conversation mode, the user returns to standard mode at the same row they last interacted with.

### New Component Structure

```
TranslationHelper.tsx
  |-- (existing standard view, rendered when conversationMode === false)
  |-- ConversationView.tsx (new, rendered when conversationMode === true)
        |-- ConversationHeader.tsx
        |     |-- Sheet name + row count
        |     |-- Progress indicator (translated / total)
        |     |-- Language toggle: [EN] [NL] [EN+NL]
        |     |-- Protagonist selector: "Me: [dropdown]"
        |     |-- Exit button
        |-- ConversationThread.tsx
        |     |-- ChatBubble.tsx (per dialogue row)
        |     |-- SystemMessage.tsx (per non-dialogue row)
        |-- EditDock.tsx
        |     |-- Speaker name + English source (read-only)
        |     |-- Textarea for Dutch translation
        |     |-- Submit button + navigation arrows (-1 / +1)
        |-- CharacterInfoPopover.tsx (floating, on speaker name click)
```

### Data Flow

No changes to the data layer. `ConversationView` receives the same arrays that the standard view uses:

- `sourceTexts[]` — English dialogue (Column C)
- `translations[]` — Dutch translations (Column J)
- `utterers[]` — Raw Column A keys (e.g., `SAY.NPC_SmartAss.12.Smart Ass`)
- `contextNotes[]` — Column B context strings
- `currentIndex` / `setCurrentIndex` — row navigation state
- `currentTranslation` / `setCurrentTranslation` — textarea state
- `handleSubmitWithSync()` — the existing submit handler

The component simply renders these arrays differently — as a scrolling thread instead of a spotlight card.

---

## Feature Details

### 1. Chat Bubbles

Each dialogue row becomes a `ChatBubble` component.

**Speaker identification:**
- Speaker name extracted from Column A using existing `trimSpeakerName()` (takes last dot-segment)
- Speaker matched to codex CHARACTER entry for enrichment (gender badge, color assignment)
- Matching cascade: exact match on `entry.english` -> exact match on `entry.name` -> nickname match -> substring match -> fallback (render name without enrichment)

**Speaker-to-codex lookup:** A new utility function `findCodexCharacter(speakerName, codexEntries)` centralizes this lookup. It returns the matched codex entry or null. This bridges the gap between the xlsx speaker name system and the codex identity system — currently no such bridge exists.

**Visual layout:**
- Protagonist bubbles: right-aligned, neutral/blue background
- Other speakers: left-aligned, color-coded by speaker
- Each bubble shows: speaker name tag (with gender symbol if known), dialogue text, and translation status indicator

**Color assignment:**
- Each scene (sheet) assigns colors from a fixed palette to speakers in order of first appearance
- Palette: blue, amber, purple, green, rose, cyan, orange, teal (8 colors, cycling if exceeded)
- The protagonist is excluded from the palette — always gets a distinct right-side treatment
- Colors reset when switching sheets

**What a bubble displays depends on the language toggle:**

| Toggle state | Bubble content |
|---|---|
| EN | English source text only |
| NL | Dutch translation only (or "untranslated" placeholder) |
| EN+NL | English on top, Dutch underneath (dimmer) |

**Translation status indicators on each bubble:**
- Translated: subtle checkmark or green left-border
- Untranslated: dashed border or dim "awaiting translation" text
- Modified (unsaved): yellow/green pulse, same as current Modified badge

**Clicking a bubble:**
- Selects it (visual highlight: thicker border or glow)
- Opens the Edit Dock at the bottom with that row loaded
- Scrolls the bubble into comfortable view if needed (not at the very bottom edge)

### 2. System Messages

Non-dialogue rows appear as centered, dimmed inline messages between bubbles.

**Detection:** A row is treated as a "system message" if:
- Column A does not match the `SAY.*.*.SpeakerName` pattern, OR
- Column A is empty, OR
- Column B contains keywords: `"Title screen"`, `"Button text"`, `"Menu option"`, `"UI"`, `"Description"`, `"Item description"`

These still render as clickable elements (for translation via the dock) but are visually distinct:
- Centered text, smaller font, muted color
- Italic, no bubble border
- Show the English text (or Dutch, depending on toggle)
- Example: `— Title screen UI. —`

### 3. Language Toggle

Three-state toggle in the header bar: `[EN] [NL] [EN+NL]`

- **EN mode:** Pure English script read. For scanning context before translating.
- **NL mode:** Pure Dutch readback. This IS the QA review mode — read through the scene checking if dialogue flows naturally.
- **EN+NL mode:** Both languages stacked per bubble. For active translation work.

The toggle is a segmented control (three buttons in a group, active one highlighted). Keyboard shortcut: cycle with a keybind (e.g., `L` for language).

### 4. Protagonist Selector

A dropdown in the header bar labeled "Me:" that lets the user designate which character appears on the right side of the chat.

**Behavior:**
- Dropdown is populated dynamically with all speakers found in the current sheet
- Default: auto-detect — if the sheet contains a speaker matching `Foal`, `{$NewName}`, or any codex entry marked as protagonist, select that. Otherwise, select the most frequent speaker.
- User can change it at any time. Selection persists per sheet (stored in component state or localStorage).
- When changed, the thread re-renders with the new protagonist on the right.

**Why dynamic:** The protagonist shifts across episodes. In early episodes it's Foal, but scenes may focus on other characters. The translator knows who the "point of view" character is for each scene.

### 5. Edit Dock

Fixed panel at the bottom of the screen. Hidden when no bubble is selected.

**Layout:**
```
+--------------------------------------------------+
| Smart Ass: "We need to fight for our rights!"    |
| +----------------------------------------------+ |
| | We moeten vechten voor onze rechten!          | |
| +----------------------------------------------+ |
| [<< -1]              Shift+Enter to submit  [+1 >>] |
+--------------------------------------------------+
```

**Components:**
- **Source line** (read-only): Speaker name + English text. Truncated with ellipsis if very long, expandable on hover.
- **Textarea:** Pre-filled with existing Dutch translation (or empty). Auto-focuses on open.
- **Submit:** Shift+Enter submits (calls `handleSubmitWithSync()`), same as standard mode.
- **Navigation arrows:** `<< -1` and `+1 >>` buttons move to the previous/next bubble, loading it into the dock. This lets you "tick through" sequential translations without clicking each bubble.
- **Auto-advance:** After submitting, automatically advances to the next untranslated bubble. The chat thread scrolls to bring it into view.

**Dismiss:** Click outside a bubble or press Escape to close the dock without submitting.

### 6. Codex Highlighting in Bubbles

When Highlight mode is active (togglable — we need a small toolbar in conversation view or a keyboard shortcut):

- Character names mentioned in dialogue text are highlighted (same `TextHighlighter` component used in standard mode)
- Speaker name tags on bubbles become clickable
- Clicking a speaker name tag opens a `CharacterInfoPopover` — a floating card positioned near the clicked name
- The popover shows: gender badge, dialogue style, bio (same content as `CharacterInfoCard.tsx`, but in a floating popover instead of an expanding card)
- Click outside or press Escape to dismiss the popover

**Toolbar in conversation mode:** A minimal floating toolbar (top-right or bottom-left) with just the mode toggles that make sense in chat view: Highlight on/off. Gamepad mode doesn't apply. Reference tools deferred to v2.

### 7. Progress Tracking

The header bar shows translation progress for the current sheet:

```
E1_TheProtest  •  87 / 149 translated  [=======>        ]
```

- Count of rows with non-empty Dutch translations vs total rows
- Simple progress bar
- Updates live as translations are submitted

### 8. Scroll Behavior

- **On entry:** Auto-scrolls to the first untranslated row in the sheet
- **On submit + auto-advance:** Smoothly scrolls to the next untranslated bubble
- **On navigation (-1/+1):** Scrolls the target bubble into the center of the viewport
- **Manual scrolling:** Free scroll through the entire thread. The edit dock stays fixed at the bottom.

### 9. Keyboard Shortcuts

| Key | Action |
|---|---|
| `Escape` | Close edit dock / exit conversation mode |
| `Shift+Enter` | Submit translation (when dock is open) |
| `Up/Down arrows` | Navigate between bubbles (when dock is open) |
| `L` | Cycle language toggle (EN -> NL -> EN+NL -> EN) |
| `H` | Toggle codex highlighting |

---

## Speaker-to-Codex Matching

This is the most architecturally significant new piece. Currently no code bridges xlsx speaker names to codex entries.

### New utility: `findCodexCharacter(speakerName, codexEntries)`

```
Input:  "Smart Ass" (cleaned from Column A)
Output: { english: "Smart Ass", dutch: "Betweter", gender: "female", ... } or null
```

**Matching cascade (in order):**
1. Exact match on `entry.english === speakerName`
2. Exact match on `entry.name === speakerName`
3. Nickname match: `entry.nicknames.includes(speakerName)`
4. Substring: `speakerName.includes(entry.english)` or reverse
5. Return null (render speaker name without enrichment)

**Caching:** Results cached in a Map per render cycle. ~100 speakers, ~170 codex entries — fast enough for O(n*m) with small n and m.

### Known edge cases
- `"Melvin"` (from xlsx) should match `"Ass Handler Melvin"` (codex english) — caught by step 4
- `"{$NewName}"` (the Foal's dynamic name) — may need special handling in protagonist selector
- `"Cole Butte  ColeMachine"` (double space in name) — normalize whitespace before matching
- Machines: `"Prophet-Machine"` appears in nicknames for two entries — first match wins, acceptable for v1

---

## Branching Dialogue

Some sheets contain branching paths indicated by Column B values like `"Dialogue option 1"`, `"Branch 2.1"`, `"Jump to line 16"`.

**v1 approach: Render linearly.** All rows appear in sheet order. Branch markers show as system messages:

```
— Dialogue option 1 —
[Bubble: response A]
— Dialogue option 2 —
[Bubble: response B]
```

This is technically accurate (it's the order they appear in the xlsx) and sufficient for translation. A more sophisticated branching visualization is a v2+ feature.

---

## Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| `src/components/ConversationView.tsx` | **Create** | Top-level conversation mode container |
| `src/components/conversation/ConversationHeader.tsx` | **Create** | Header bar with sheet info, language toggle, protagonist selector |
| `src/components/conversation/ConversationThread.tsx` | **Create** | Scrollable chat thread renderer |
| `src/components/conversation/ChatBubble.tsx` | **Create** | Individual dialogue bubble component |
| `src/components/conversation/SystemMessage.tsx` | **Create** | Non-dialogue system message component |
| `src/components/conversation/EditDock.tsx` | **Create** | Fixed bottom editing panel |
| `src/components/conversation/CharacterInfoPopover.tsx` | **Create** | Floating character info card |
| `src/utils/speakerCodexUtils.ts` | **Create** | `findCodexCharacter()` lookup utility |
| `src/components/TranslationHelper.tsx` | **Modify** | Add `conversationMode` state, chat button to toolbar, conditional rendering |
| `src/hooks/useCharacterHighlighting.ts` | **Modify** | Export codex character data for use by conversation view |

---

## What Is NOT in v1

- Live Edit mode (direct xlsx save) — use standard mode for this
- Reference tools panel / XLSX search
- Output table (translation review table)
- Cross-sheet navigation from within conversation mode
- Branching dialogue visualization (rendered linearly instead)
- Character avatar images
- Drag-to-reorder bubbles
- Conversation view for non-xlsx sources (JSON/CSV)

---

## Technical Considerations

**Performance:** A large sheet like `E1_TheProtest` has 149 rows. Rendering 149 bubble components is fine for React. No virtualization needed for v1 — if sheets grow past 500 rows, add `react-window` later.

**State sharing:** Conversation mode shares `currentIndex`, `translations[]`, `currentTranslation`, and `handleSubmitWithSync()` with the standard view via the existing `useTranslationState` hook. No new state management needed.

**Highlight integration:** The existing `TextHighlighter` component can be used directly inside `ChatBubble` for codex highlighting. The `useCharacterHighlighting` hook already provides `findCharacterMatches()` and loaded JSON data.

**No new dependencies.** Everything builds on existing React, Tailwind, and the xlsx library already in the project.
