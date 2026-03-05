# Character Info Cards on the Translation Screen

**Date:** 2026-03-05
**Status:** Design (no implementation yet)
**Scope:** Add gender, dialogue style, and biographical info for main characters to the translation UI

---

## 1. Problem

When translating dialogue, the translator needs to know:
- **Gender** — Dutch adjective endings, pronouns, and article choices depend on the character's gender
- **Dialogue style** — Each main character has a unique voice (Slow Ass stutters b/p words, Kick Ass uses CAPS profanity, Sick Ass communicates through coughs, Old Ass speaks like a Marxist orator). Preserving these quirks in Dutch requires knowing them at a glance
- **Bio context** — Understanding a character's personality and arc helps choose the right register and tone

This data already exists in the codex CSV/JSON (`bio`, `gender`, `dialogueStyle` fields) for the ~20 main characters. It's just not surfaced anywhere in the translation UI.

---

## 2. Scope: Which Characters

Only the main donkeys and key humans get full info cards. Everyone else keeps the existing simple EN->NL pill.

### Main Donkeys (15)
| Character | Gender | Has Style | Has Bio |
|-----------|--------|-----------|---------|
| Old Ass | male | yes | yes |
| Trusty Ass | female | yes | yes |
| Nice Ass | female | yes | yes |
| Big Ass | male | yes | yes |
| Hard Ass | male | yes | yes |
| Sad Ass | male | yes | yes |
| Smart Ass | female | yes | yes |
| Kick Ass | male | yes | yes |
| Lazy Ass | female | yes | yes |
| Sick Ass | female | yes | yes |
| Slow Ass | male | yes | yes |
| Sturdy Ass | female | yes | yes |
| Thirsty Ass | male | yes | yes |
| Bad Ass | male | yes | yes |
| Foal / Golden Ass | female | yes | yes |

### Key Humans (8)
| Character | Gender | Has Style | Has Bio |
|-----------|--------|-----------|---------|
| Cole Butte | male* | partial | yes |
| Hugh G. Butte | male* | no | yes |
| Sandy Butte | female* | no | yes |
| Miner Jenny | female* | no | yes |
| Child Joey Kulan | male* | no | yes |
| Grandma Kulan | female* | no | yes |
| Mme. Derriere | female* | no | yes |
| Ringmaster Rico | male* | no | yes |
| Zookeeper Rose | female* | no | yes |

*Gender can be inferred from bio text but is not in the `gender` field yet. Implementation should extract it.

### Everyone Else (~95+ characters)
No card. They get the existing compact pill (EN->NL mapping only) in QuickReferenceBar.

---

## 3. Design: Approach A — Expandable Character Cards in QuickReferenceBar

### How It Works

The QuickReferenceBar already auto-detects character names in the current source text and renders them as purple pills. The enhancement:

1. **Purple pills for main characters get an info icon** (small `i` or person silhouette) indicating more info is available
2. **Clicking the pill expands a character card** directly below the QuickReferenceBar (not a tooltip — a persistent card that stays open until dismissed or another character is clicked)
3. **The card shows three sections:**
   - Gender badge (compact icon + label)
   - Dialogue style block (the distinctive speech patterns)
   - Bio snippet (one-liner with expand toggle for full text)

### Visual Layout (Character Card)

```
┌─────────────────────────────────────────────────────┐
│ Quick Ref  2 codex · 1 xlsx                    Open │
├─────────────────────────────────────────────────────┤
│ [●] Old Ass → Ouwe Ezel [+]  [●] Nice → Lieve [+] │
│                                                     │
│ ┌─ Old Ass ──────────────────────────────────── ✕ ┐ │
│ │ ♂ male                                          │ │
│ │                                                  │ │
│ │ STYLE                                            │ │
│ │ "Now where was I... Right... I was lamenting     │ │
│ │  the struggles of our existence."                │ │
│ │ Injustice · Protest · Politics                   │ │
│ │                                                  │ │
│ │ BIO                                              │ │
│ │ Classic Marxist/Leninist leader. Inspires the    │ │
│ │ herd in his lofty speeches.                      │ │
│ └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Card Styling

- **Background:** Soft purple gradient (`bg-purple-50 dark:bg-purple-900/20`), consistent with the existing purple CHARACTER theming
- **Gender badge:** Small inline badge — `♂ male` or `♀ female` — using a subtle background (`bg-purple-100`)
- **Style section:** Preformatted text (preserving newlines from the codex data), slightly smaller font (`text-[11px]`), with a left purple border accent
- **Bio section:** Normal prose text, capped at 2 lines with a "more..." toggle if it exceeds that
- **Close button:** Small `✕` in top-right corner. Also closes when clicking a different character pill or pressing Escape
- **Max height:** Card is capped at `max-h-48` (192px) with overflow scroll to prevent it from dominating the translation area
- **Animation:** Slide-down + fade-in (`transition-all duration-200`)

### Interaction Model

| Action | Result |
|--------|--------|
| Click character pill (main character) | Expand/collapse character card below bar |
| Click character pill (secondary character) | Open Reference Tools panel (existing behavior) |
| Click `+` button on pill | Insert Dutch name (existing behavior, unchanged) |
| Click `✕` on card | Close card |
| Click different character pill | Switch card to that character |
| Press Escape | Close card |
| Navigate to next/prev row | Card stays open if same character detected; closes otherwise |

### Data Flow

```
codex_translations.json
        │
        ▼
  findCharacterMatches(sourceText)    ← already exists in TranslationHelper.tsx
        │
        ▼
  CodexMatch { name, english, dutch, category, ... }
        │
        ▼  NEW: extend interface to include bio/gender/dialogueStyle
  CodexMatch { ..., bio?, gender?, dialogueStyle? }
        │
        ▼
  QuickReferenceBar receives enriched matches
        │
        ▼
  Renders pill with info icon if bio/gender/dialogueStyle present
        │
        ▼
  Click → expand CharacterInfoCard component
```

---

## 4. Design: Approach B (Bonus) — Codex Panel Detail Rows

As a secondary enhancement, the Codex tab in ReferenceToolsPanel gets expandable detail rows for CHARACTER entries that have bio/gender/dialogueStyle data.

### How It Works

1. In the codex list, CHARACTER entries with rich data show a small chevron (`▸`) to the left of the category dot
2. Clicking the row expands it in-place to reveal the same three-section card (gender, style, bio)
3. Only one row can be expanded at a time

### Visual Layout

```
Codex tab list:
┌──────────────────────────────────────────────┐
│ ▸ ● Old Ass          → Ouwe Ezel       [+]  │  ← chevron = expandable
│   ┌──────────────────────────────────────┐   │
│   │ ♂ male                               │   │
│   │ STYLE: "Now where was I..."          │   │
│   │ BIO: Classic Marxist/Leninist...     │   │
│   └──────────────────────────────────────┘   │
│   ● Angry Ass        → Boze Ezel       [+]  │  ← no chevron (no data)
│ ▸ ● Nice Ass         → Lieve Ezel      [+]  │  ← chevron
│   ● Anxious Ass      → Angstige Ezel   [+]  │
└──────────────────────────────────────────────┘
```

This is lower priority than Approach A but useful for browsing character info outside of active translation context.

---

## 5. Data Preparation: Filling Gaps

Currently, the 15 main donkeys have all three fields populated. The key humans have `bio` but mostly lack `gender` and `dialogueStyle`. Before implementation:

### Step 1: Extract gender from bio text (automated)
Many bios contain gender clues ("Male.", "Female.", "He is...", "She is..."). A simple script can parse these and populate the `gender` field for entries where it's empty but inferrable.

**Characters needing gender extraction:**
- Ass Handler Melvin — bio says "Male." → `male`
- Ass Handler Wedgie — bio says "Female." → `female`
- Child Joey Kulan — bio says "He visits..." → `male`
- Grandma Kulan — bio says "old woman" → `female`
- Hugh G. Butte — bio says "His diaries..." → `male`
- Miner Jenny — bio says "She grew up..." → `female`
- Mme. Derriere — bio says "She has..." → `female`
- Ringmaster Rico — bio says "He's all about..." → `male`
- Sandy Butte — bio says "She leaves..." → `female`
- Zookeeper Rose — bio says "She is very..." → `female`
- Cole Butte — bio in README says male → `male`

### Step 2: Extract dialogue style from README Excel (manual or scripted)
The README "Names and World Overview" sheet has a "Dialog convention" row (Row 6) for each character. Some humans may have style notes there that aren't in the codex yet. This can be scraped and merged.

### Step 3: Rebuild codex JSON
After CSV updates, run the existing JSON rebuild step.

---

## 6. Implementation Components

### New Component: `CharacterInfoCard.tsx`

A small, self-contained component rendered conditionally inside QuickReferenceBar.

```
Props:
  character: {
    name: string
    english: string
    dutch: string
    gender?: string
    dialogueStyle?: string
    bio?: string
  }
  onClose: () => void
  onInsert: (text: string) => void
```

Renders the three-section card described in Section 3.

### Modified: `QuickReferenceBar.tsx`

Changes needed:
1. **Extend `CodexMatch` interface** — add `bio?: string`, `gender?: string`, `dialogueStyle?: string`
2. **Add state** — `expandedCharacter: string | null` (tracks which character card is open)
3. **Modify pill rendering** — for codex matches where `bio || gender || dialogueStyle` exists, add an info icon to the pill and change click behavior to toggle the card instead of opening Reference Tools
4. **Render `CharacterInfoCard`** — conditionally below the pill row when `expandedCharacter` is set

### Modified: `ReferenceToolsPanel.tsx` (Approach B)

Changes needed:
1. **Extend `CharacterMatch` interface** — add `bio?: string`, `gender?: string`, `dialogueStyle?: string`
2. **Add state** — `expandedCodexEntry: number | null`
3. **Modify codex list rendering** — add chevron and expandable detail row for entries with rich data

### Modified: `TranslationHelper.tsx`

Changes needed:
1. **Extend `findCharacterMatches`** — ensure it passes through `bio`, `gender`, `dialogueStyle` from the codex data when building `CodexMatch` objects
2. The codex API already returns all CSV columns; just need to make sure the match-building logic includes the extra fields

### Modified: API (`/api/csv-data` or `/api/codex`)

Likely no changes needed — the API already serves the full CSV including bio/gender/dialogueStyle columns. Verify this returns all fields.

---

## 7. Implementation Order

1. **Data prep** — Fill gender gaps in codex CSV from bio text; rebuild JSON
2. **Interface extension** — Extend `CodexMatch` and `CharacterMatch` interfaces to include bio/gender/dialogueStyle
3. **Data threading** — Update `findCharacterMatches` in TranslationHelper to pass through the new fields
4. **CharacterInfoCard component** — Build the new card component
5. **QuickReferenceBar enhancement** — Add info icon, click-to-expand, render card
6. **ReferenceToolsPanel enhancement** (bonus) — Add expandable rows in Codex tab
7. **Test** — Verify with actual translation workflow (navigate to a line with Old Ass speaking, confirm card appears with correct data)

---

## 8. Edge Cases

| Scenario | Behavior |
|----------|----------|
| Line mentions multiple main characters | Each pill gets its own info icon; only one card open at a time |
| Character has gender but no style/bio | Card shows gender section only; other sections hidden |
| Character has bio but no gender | Card shows bio; gender section hidden |
| Very long bio text | Capped at 2 lines with "more..." toggle |
| Very long dialogue style | Displayed with preserved newlines, scrollable within card |
| Dark mode | Card uses `dark:` variants consistent with existing UI |
| Keyboard navigation | Escape closes card; no other keyboard interaction needed |
| Source text changes (next/prev row) | If new source text still contains the expanded character, card stays open. Otherwise, card closes automatically |

---

## 9. What This Does NOT Include

- No new data entry UI (character data is edited in the CSV directly)
- No character avatars or images
- No machine-generated Dutch style suggestions
- No changes to the translation input or save flow
- No new API endpoints (existing ones suffice)
- No changes for non-CHARACTER codex entries (LOCATION, OTHER)

---

## 10. Summary

The feature surfaces existing codex character data (gender, dialogue style, bio) in two places:

1. **Primary:** Expandable character info cards in the QuickReferenceBar, triggered by clicking a main character's pill — contextual, appears exactly when translating that character's dialogue
2. **Secondary:** Expandable detail rows in the Codex tab of Reference Tools — for browsing character info outside of active translation

Data preparation involves filling ~10 gender gaps (inferrable from bio text) and potentially scraping a few missing dialogue style entries from the README Excel. The codex CSV/JSON schema already supports all needed fields.

Estimated implementation effort: ~2-3 hours for the core feature (Approach A), plus ~1 hour for the bonus (Approach B).
