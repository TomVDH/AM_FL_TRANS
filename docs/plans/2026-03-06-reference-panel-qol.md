# Reference Panel QoL Improvements

## Pain Points Identified
1. **Codex tab feels bare** - missing Dutch style, cramped layout, expanded detail incomplete
2. **Search tab is cluttered** - file/sheet selectors noisy, too many badges per result
3. **Feels disconnected** - panel doesn't connect to current translation context

## Design

### 1. Codex Tab - Richer & Contextual

**Bug fix:** Add `dutchDialogueStyle` to `CharacterMatch` interface and expanded detail panel (orange themed, matching CharacterInfoCard).

**"In Current Text" section:** Show codex entries detected in the current source text at the top of the codex tab, separated by a subtle divider. These are the most relevant entries while translating. Uses the existing `findCharacterMatches` prop (currently voided/unused in panel).

**Expanded detail enrichments:**
- Show description when available
- Show nicknames as small tags
- Show Dutch Translation Style (orange section)
- Increase list max-height from `max-h-72` to `max-h-96`

**hasInfo check:** Include `dutchDialogueStyle` so entries with Dutch style but no English style still show as expandable.

### 2. Search Tab - Streamlined

**Auto-collapse file selector:** When only 1 file is loaded, hide the file selector row entirely.

**Compact sheet selector:** When there are many sheets (>6), truncate with "N more" instead of showing all. Show current sheet prominently.

**Reduce badge noise per result:**
- Remove redundant green dot (the "EN:/NL:" labels already distinguish content)
- Only show sheet badge when viewing "All" sheets
- Only show file badge when searching all files
- Keep utterer badge (it's contextually useful)

### 3. Better Integration - Contextual Codex

**Wire up `findCharacterMatches`:** Stop voiding the prop. Use it to detect codex entries in current source text.

**Codex "detected" header:** At the top of the codex tab, show a compact section "Detected in current line" with small pills for matched entries. Clicking a pill scrolls to / expands that entry.

**Visual indicator in list:** Entries that match the current source text get a subtle left-border accent (purple) to stand out from the full list.

### 4. End State Screen (CompletionSummary) - Future

Deferred to next round per user's priority choice.

### 5. Quick Reference Bar - Future

Deferred to next round.

## Files to Modify
- `src/components/ReferenceToolsPanel.tsx` - All three improvements
- No other files need changes (CharacterInfoCard already has dutchDialogueStyle)
