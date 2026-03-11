# Character-by-Character Style Analysis Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Analyze every character's dialogue to produce curated English and Dutch style profiles in the codex, one character at a time.

**Architecture:** For each character: extract dialogue lines from CSV source data, analyze English speech patterns, analyze Dutch translation patterns, present findings + samples to user, collect creative direction, write curated profiles to codex.

**Tech Stack:** Next.js app, codex at `data/json/codex_translations.json`, dialogue source at `data/analysis/speaker-dutch-dialogue.csv`, corpus at `data/analysis/speaker-corpus.jsonl`

---

## Project Context

### What is this?
A translation tool for "Asses & Masses" — a video game being translated from English to Dutch (Flemish-flavored). Each character has a distinct voice. The codex stores character profiles with two style fields:
- `dialogueStyle` — English voice/style guide
- `dutchDialogueStyle` — Dutch translation style guide (consumed by AI translation engine)

### Key Dutch/Flemish concepts:
- **Pronoun forms:** "ge/gij" (Flemish informal), "je/jij" (standard Dutch informal), "u" (formal)
- **Flemish density:** How much Flemish dialect vs standard Dutch. Scale: None → Light → Moderate → Heavy
- **Register:** Formal, informal, mixed, archaic, etc.
- **Contractions:** Flemish contractions like 'k (ik), 't (het), da (dat), nie (niet)
- **Diminutives:** Flemish uses "-ke" (manneke), standard Dutch uses "-je" (mannetje)

---

## The Analysis Methodology

This is exactly how Smart Ass / Slimme Ezel was analyzed. Follow this procedure for EVERY character.

### Step 1: Extract dialogue lines

Read `data/analysis/speaker-dutch-dialogue.csv`. It has columns: `speaker, episode, sheet, context, english, dutch, utterer_key`.

For the target character, extract ALL their dialogue lines. Note:
- How many total lines they have
- Which episodes they appear in
- The `context` column often describes the scene

Example extraction (Smart Ass had 203 lines across E1-E7):
```
[E1/E1_Farm_localization] EN: "Trusty! I have a new one!"
                          NL: "Trouwe! Ik heb nog eentje!"

[E1/E1_Farm_localization] EN: "Easy."
                          NL: "Poepsimpel."
```

### Step 2: Analyze English dialogue patterns

Read through ALL the character's English lines. Look for:

1. **TONE** — What is the overall emotional register? (e.g., commanding, melancholic, enthusiastic, cynical)
2. **VOCABULARY** — What kind of words do they use? (formal/informal, profanity level, domain-specific jargon, slang)
3. **VERBAL TICS** — What phrases or patterns repeat? (catchphrases, filler words, sentence endings, exclamations)
4. **SENTENCE STRUCTURE** — Short commands vs long speeches? Questions vs declarations? Fragments? Ellipses?
5. **KEY THEMES** — What do they talk about? What matters to this character?

Write the English style profile in this EXACT format:

```
**TONE:** [1-2 sentences describing the character's emotional quality and delivery]

**VOCABULARY:** [2-3 sentences about word choice, register level, domain-specific language, profanity patterns]

**VERBAL TICS:** [2-3 sentences listing specific repeated phrases, catchphrases, patterns with examples in quotes]

**SENTENCE STRUCTURE:** [1-2 sentences about syntax patterns, length, use of fragments/questions/commands]

**KEY THEMES:** [1-2 sentences about recurring topics and character concerns]
```

#### Reference: Smart Ass English style (the gold standard)

```
**TONE:** Commanding, condescending, snooty. Talks down to everyone as if explaining things to children. Dripping with disdain.

**VOCABULARY:** Colloquial with strategic terminology. Uses crude language ("shit," "damn") but delivers it with an air of refinement — swearing through gritted teeth rather than shouting. Donkey-specific terms ("Jennets," "Comrades"). Employs numbered planning sequences and workplace jargon.

**VERBAL TICS:** Numbered plan sequences ("ONE... TWO... THREE..."). Frequently says "Easy." with smug satisfaction. Uses rhetorical questions dripping with condescension. Heavy use of ellipses for theatrical pauses. Sighs and eye-rolls implied in delivery.

**SENTENCE STRUCTURE:** Mix of clipped, imperious commands and longer strategic explanations delivered like lectures. Rhetorical questions that make others feel stupid. Uses fragments for dismissive emphasis ("Easy." "Obviously." "Fine.").

**KEY THEMES:** Strategic planning and backup schemes. Work and human-donkey labor relationships. Group survival and resource management. Belittling others' intelligence while protecting her own authority and the collective.
```

### Step 3: Analyze Dutch translation patterns

Read through ALL the character's Dutch lines. Look for:

1. **Register** — Is the translation formal, informal, mixed? What pronoun forms are used (ge/gij, je/jij, u)?
2. **Flemish density** — How many Flemish dialect markers appear? (contractions, vocabulary, diminutives)
3. **Character voice preservation** — Does the Dutch capture the same personality as the English?
4. **Verbal tics in Dutch** — How were English catchphrases translated? What Dutch-specific expressions appear?
5. **Translation approach** — Literal vs adaptive? How is humor/wordplay handled?

Write the Dutch style profile in this EXACT format:

```
**Register**: [2-3 sentences about formal/informal level, pronoun forms used and WHEN, vocabulary level]

**Flemish density**: [2-3 sentences specifying the density level and WHY — tied to character personality. List specific markers to use or avoid]

**Character voice**: [2-3 sentences about how the personality comes through. What makes this character sound like THEM in Dutch?]

**Verbal tics in Dutch**: [2-3 sentences listing specific Dutch translations of catchphrases, recurring expressions, with examples in quotes]

**Translation approach**: [2-3 sentences about overall strategy — literal vs creative, how to handle humor, what to preserve vs adapt]
```

#### Reference: Smart Ass Dutch style (the gold standard)

```
**Register**: Clean, polished ABN (Algemeen Beschaafd Nederlands). NO Flemish markers — no ge/gij, no nie, no plat Vlaams. She speaks pristine standard Dutch, which is itself a character choice: she considers herself above regional dialect. Uses jij/je consistently. Strategic formal vocabulary mixed with sharp colloquial put-downs.

**Flemish density**: ZERO. Smart Ass is explicitly a snooty Dutch woman. Her clean ABN contrasts with the Flemish-speaking characters around her, reinforcing her sense of superiority. This linguistic distinction IS her characterization.

**Character voice**: Ice-cold authority with withering condescension. She doesn't yell — she enunciates. Short, clipped imperatives delivered with disdain ("Mond dicht." not "Bek dicht!"). Talks to others like they're slow. Her profanity is precise and cutting, never sloppy.

**Verbal tics in Dutch**: "Poepsimpel." for "Easy." — the ONE Flemish word she's picked up from years among Flemish donkeys, delivered with a smirk. Numbered sequences "EEN, TWEE, DRIE." delivered like a teacher to dim students. "Onze banen terug" as rallying cry. Rhetorical questions with "toch?" or "nietwaar?" tags. "Godbetert" or "hemeltjelief" for exasperation rather than crude swearing.

**Translation approach**: Maintain pristine ABN at all times. Her Dutch should sound educated, sharp, and slightly old-money. Preserve the strategic planning vocabulary. Profanity should feel deliberate and withering, not vulgar. The contrast between her polished Dutch and the Flemish warmth of other characters is essential to her personality.
```

### Step 4: Present to user

Show the user a formatted analysis card:

```
## [Character Name] / [Dutch Name]
**Lines:** [N] across [episodes]
**Bio:** [from codex, if any]

### Sample Dialogue (5-8 representative lines)
EN: "..."  →  NL: "..."
EN: "..."  →  NL: "..."
[etc.]

### English Style Profile
[the profile from Step 2]

### Dutch Translation Style
[the profile from Step 3]

### Flags
- [any inconsistencies, issues, or creative decisions to highlight]
```

### Step 5: Collect user feedback

The user may:
- **Approve as-is** — "looks good" / "fine" → save and move on
- **Direct creative changes** — e.g., "make her ABN, not Flemish" or "more Flemish" or "change the catchphrase"
- **Request a full rewrite** — rare, but apply their direction and present again
- **Skip** — "skip" → move to next character without saving

**IMPORTANT:** The Dutch style is NOT just an analysis of what exists — it's a CREATIVE DIRECTION for how the character SHOULD sound. The user may override the analysis findings entirely, as happened with Smart Ass (analysis said "moderate Flemish" but user directed "ZERO Flemish, snooty ABN").

### Step 6: Save to codex

Update the character's entry in `data/json/codex_translations.json`:
- Set `dialogueStyle` to the approved English profile
- Set `dutchDialogueStyle` to the approved Dutch profile
- Preserve all other fields

After updating, sync the CSV:
```bash
node scripts/sync-json-to-csv.js
```

Commit after every 3-5 characters:
```bash
git add data/json/codex_translations.json data/csv/codex_translations.csv
git commit -m "style: analyze and set profiles for [Character A], [Character B], [Character C]"
```

---

## Data Sources

### Primary dialogue source
`data/analysis/speaker-dutch-dialogue.csv` — 2561 rows, 75 unique speakers. Columns:
- `speaker` — character name (extracted from column A of Excel)
- `episode` — E1 through E10
- `sheet` — Excel sheet name
- `context` — scene description
- `english` — original English line
- `dutch` — Dutch translation
- `utterer_key` — raw Excel column A value (e.g., `SAY.Dialog:Opening.60.Mme. Derriere`)

**Known data issues:**
- `{$NewName}` = Foal (audience-named character, 195 lines)
- `Mr` = Mr. Butte (period truncation, 21 lines)
- `Mme` = Mme. Derriere (period truncation, 12 lines)

### Codex
`data/json/codex_translations.json` — character profiles with name, dutch name, bio, nicknames, dialogueStyle, dutchDialogueStyle.

### Corpus (bonus reference)
`data/analysis/speaker-corpus.jsonl` — 173 curated EN→NL translation pairs saved from the translation workflow. Only covers some Episode 7 characters. Use as supplementary reference if available.

### Pre-generated analyses (optional reference)
- `data/analysis/speaker-styles.json` — auto-generated English style analyses
- `data/analysis/speaker-dutch-styles.json` — auto-generated Dutch style analyses

These were machine-generated and may be a useful starting point, but the CURATED profiles should be richer and more specific.

---

## Character Queue

Sorted by dialogue line count (most lines first = richest analysis material).

Characters with **existing styles** need REVIEW — present what's there, check against dialogue, get user approval or changes.

Characters with **no styles** need FULL ANALYSIS — generate both profiles from scratch.

### Tier 1: Major Characters (100+ lines)

| # | Character | Dutch Name | Lines | Has EN Style | Has NL Style |
|---|-----------|-----------|-------|-------------|-------------|
| 1 | Sturdy Ass | Stevige Ezel | 230 | YES | YES |
| 2 | Smart Ass | Slimme Ezel | 203 | YES | YES (recently updated) |
| 3 | {$NewName} (Foal) | -tje | 195 | YES (minimal) | NO |
| 4 | Slow Ass | Slome Ezel | 156 | YES | YES |
| 5 | Sad Ass | Triestige Ezel | 146 | YES | YES |
| 6 | Zookeeper Rose | Dierendokter Dina | 139 | YES | YES |
| 7 | Hard Ass | Bikkeharde Ezel | 137 | YES | YES |
| 8 | Nice Ass | Lieve Ezel | 131 | YES | YES |
| 9 | Kick Ass | Stamp Ezel | 122 | YES | YES |
| 10 | Ringmaster Rico | Circusdirecteur Baptiste | 112 | YES | YES |

### Tier 2: Supporting Characters (30-99 lines)

| # | Character | Dutch Name | Lines | Has EN Style | Has NL Style |
|---|-----------|-----------|-------|-------------|-------------|
| 11 | Bad Ass | Stoere Ezel | 94 | YES | YES |
| 12 | Thirsty Ass | Beschonken Ezel | 92 | YES | YES |
| 13 | Big Ass | Mega Ezel | 74 | YES | YES |
| 14 | Old Ass | Oude Ezel | 57 | YES | YES |
| 15 | Sick Ass | Snot Ezel | 44 | YES | YES |
| 16 | Golden Ass | Gouden Ezel | 42 | YES | YES |
| 17 | Lazy Ass | Luie Ezel | 37 | YES | YES |
| 18 | Trusty Ass | Trouwe Ezel | 31 | YES | YES |

### Tier 3: Recurring Characters (10-29 lines)

| # | Character | Dutch Name | Lines | Has EN Style | Has NL Style |
|---|-----------|-----------|-------|-------------|-------------|
| 19 | Cole-Machine | Piet-Machine | 28 | YES | YES |
| 20 | Mr. Butte | Mr. Vanscheetvelde | 21 | YES | YES |
| 21 | Child Joey | Luukske Vermeulen | 19 | YES | YES |
| 22 | Miner Jenny | Mijnwerker Jenny | 19 | YES | YES |
| 23 | Greedy Ass | Inhalige Ezel | 17 | YES | YES |
| 24 | Hasty Ass | Haastige Ezel | 17 | YES | YES |
| 25 | DJ Dope Ass | DJ Lijpe Ezel | 16 | YES | YES |
| 26 | The Masses | De Massa | 15 | YES | YES |
| 27 | Grandma Kulan | Grootmoe Vermeulen | 14 | YES | YES |
| 28 | Wedgie | Zakkenzeulster Zita | 13 | YES | YES |
| 29 | Happy Ass | Blije Ezel | 12 | YES | YES |
| 30 | Mme. Derriere | Mevr. Derriere | 12 | YES | YES |
| 31 | Melvin | Zakkenzeuler Zeno | 11 | YES | YES |

### Tier 4: Minor Characters (<10 lines)

| # | Character | Dutch Name | Lines | Has EN Style | Has NL Style |
|---|-----------|-----------|-------|-------------|-------------|
| 32 | Helpful Ass | Hulpvaardige Ezel | ~8 | YES | YES |
| 33 | Proper Ass | Keurige Ezel | ~5 | YES | YES |
| 34 | Hee | HIE | ~5 | YES | YES |
| 35 | Haw | HAA | ~5 | YES | YES |
| 36 | Welcome Sign | Welkomsbord | ~3 | YES | YES |
| 37 | Decrepit Sign | Verlept Bord | ~3 | YES | YES |
| 38 | Radio Host Marcos | DJ Tom | ~3 | YES | YES |
| 39 | Tight Ass | Strakke Ezel | ~3 | YES | YES |

### Tier 5: Gap Characters (have English style, need Dutch style written)

| # | Character | Dutch Name | Lines | Has EN Style | Has NL Style |
|---|-----------|-----------|-------|-------------|-------------|
| 40 | Bleak Ass | Depressieve Ezel | ? | YES | **NO** |
| 41 | Edgy Ass | Avantgarde Ezel | ? | YES | **NO** |
| 42 | Resentful Ass | Wrokkige Ezel | ? | YES | **NO** |
| 43 | Skinny Ass | Magere Ezel | ? | YES | **NO** |

### Tier 6: Characters with NO styles at all (check if they have dialogue)

The remaining ~83 characters in the codex have neither English nor Dutch styles. For any that appear in the dialogue CSV, the agent should flag them for potential analysis. Characters with 0 dialogue lines can be skipped.

---

## Execution Notes

### Pacing
- ONE character at a time. Present the full analysis card, then wait for user input.
- Do NOT batch characters or rush ahead.
- If the user says "looks good" — save and move on.
- If the user gives direction — apply it, present the updated version, then save.

### Smart Ass is DONE
Smart Ass (Task 2) was already analyzed and approved in a previous session. Skip it unless the user specifically asks to revisit.

### Reading dialogue lines
When extracting dialogue for a character, read ALL their lines from the CSV. For characters with 100+ lines, present 8-10 representative samples spanning multiple episodes. For characters with <30 lines, you can show all of them.

### The user has final say
The style profiles are creative direction, not just analysis. The user may override any finding. Their word is final.

### Characters that only cough/grunt
Some characters (Sick Ass, some signs) have unusual speech patterns. Note this explicitly in the analysis.

### Cross-character consistency
As you review, keep track of which characters use which pronoun forms. The overall pattern should be:
- Most donkeys: ge/gij (Flemish)
- Smart Ass: je/jij (ABN — she's above dialect)
- Humans: varies by character
- Gods (Golden Ass, Hee, Haw): archaic formal, royal "wij"
- Signs: no personal pronouns (fragmentary)

Flag any character whose pronoun choice seems inconsistent with the emerging pattern.
