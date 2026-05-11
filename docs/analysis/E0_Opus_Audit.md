# Consistency Audit: Episode 0 + Manager + Intermissions (Opus)
**File:** `0_asses.masses_Manager+Intermissions+E0Proxy.xlsx`
**Status:** STASHED (Pending Review)
**Generated:** 2026-05-10 by Opus full-scan
**Sheets covered:** 9 (ManagerScene, CharacterProfiles, E0_Instructions, E0_GameTitle, E0_Questions, 2x_Intermission, 4x_Intermission, 6x_Intermission, 8x_Intermission)
**Cells flagged:** 22 unique cells / 22 issues

> **Coverage:** all 46 master-list categories + today's new feedback items.
> **E0 is the bookend episode** — game title, character profiles, quiz/trivia (E0_Questions has 116 cells of bonus quiz content), intermission breaks, and the Manager/Wedgie scene. **Most flags are quiz Ezel caps + Piet-Machine label sync.**

---

## ManagerScene_localization (1 cell)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| ManagerScene | 15 | (label) | Cole-Machine | **Piet-Machine** | **Piet-Machien** | Machine → Machien (codex sync trigger #3 — also in E0_CharacterProfiles, E9, E10) |

---

## CharacterProfiles_localization (3 cells)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| CharacterProfiles | 18 | (label) | Cole-Machine | **Piet-Machine** | **Piet-Machien** | Machine → Machien (codex sync trigger) |
| CharacterProfiles | 81 | (label) | Blunt Ass | Groffe **ezel** | Groffe **Ezel** | Ezel cap (compound profile name) |
| CharacterProfiles | 82 | (label) | Peek Ass | Constat-**ezel** | Constat-**Ezel** | Ezel cap (compound profile name) |

---

## E0_Instructions_localization (0 cells)
## E0_GameTitle_localization (0 cells)
## 2x_Intermission_localization (0 cells)
## 4x_Intermission_localization (0 cells)
## 6x_Intermission_localization (0 cells)
## 8x_Intermission_localization (0 cells)

✓ All clean.

---

## E0_Questions_localization (18 cells — quiz/trivia narrative text)

⚠️ **Decision-pending bucket.** All 18 are narrator/quiz text (no speaker attribution). Same question raised in E1 (Stable2F-J47) and E3 (Butte diary) — does the Ezel cap rule apply to **narrative/UI text** or only character dialogue? Per the strict rule "Ezel always capitalized = proper noun globally", these should all cap. Defaulting to "yes, apply" pending Tom's confirm.

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| Questions | 67 | (quiz) | In the Old Testament, a human named Balaam is hitting his ass when all of a sudden: | In het Oude Testament slaat een mens genaamd Balaam op zijn **ezel** wanneer plots: | ...op zijn **Ezel** wanneer plots: | Ezel cap (narrative) |
| Questions | 68 | (option) | Balaam beats the ass to death and has to find another one to do his work for him | Balaam slaat de **ezel** dood en moet een andere zoeken om het werk voor hem te doen | Balaam slaat de **Ezel** dood en moet een andere zoeken... | Ezel cap |
| Questions | 69 | (option) | God gives the ass the ability to speak and the ass begs Balaam to spare them | God geeft de **ezel** het vermogen om te spreken en de **ezel** smeekt Balaam om hem te sparen | God geeft de **Ezel** het vermogen om te spreken en de **Ezel** smeekt Balaam... | Ezel cap (×2) |
| Questions | 70 | (text) | In Aesop's Fables, one reads: "An ass put on the skin of a lion..." | In de Fabels van Aesopus leest men: 'Een **ezel** trok de huid van een leeuw aan... | 'Een **Ezel** trok de huid van een leeuw aan... | Ezel cap (multiple inst — first instance shown; full re-cap if rule applies) |
| Questions | 73 | (quiz) | In Ancient Greece, asses symbolized fertility because: | In het Oude Griekenland symboliseerden **ezels** vruchtbaarheid omdat: | In het Oude Griekenland symboliseerden **Ezels** vruchtbaarheid omdat: | Ezel cap |
| Questions | 74 | (option) | Male donkeys have very large penises | Mannelijke **ezels** een zeer grote penis hebbem | Mannelijke **Ezels** een zeer grote penis hebbem | Ezel cap (also note: typo `hebbem` should be `hebben`) |
| Questions | 75 | (option) | Female donkeys frequently give birth to twins | Vrouwelijke **ezels** vaak tweelingen baren | Vrouwelijke **Ezels** vaak tweelingen baren | Ezel cap |
| Questions | 76 | (quiz) | A 'mare' is the general term for a female equine. What is the specific term for a female donkey? | Een 'merrie' is de algemene term voor een vrouwelijk paard. Wat is de specifieke term voor een vrouwelijke **ezel**? | ...vrouwelijke **Ezel**? | Ezel cap |
| Questions | 83 | (option) | Jesus riding an ass backwards | Jezus die achterstevoren op een **ezel** rijdt | Jezus die achterstevoren op een **Ezel** rijdt | Ezel cap |
| Questions | 84 | (quiz) | What does tradition say Mohammed's ass, Ya'fur, did after the Prophet died? | Wat zegt de traditie dat Mohammeds **ezel**, Ya'fur, deed na de dood van de Profeet? | Wat zegt de traditie dat Mohammeds **Ezel**, Ya'fur, deed na de dood van de Profeet? | Ezel cap |
| Questions | 87 | (quiz) | In the philosophical paradox called Buridan's Ass... | In de filosofische paradox die bekend staat als Buridans **ezel** zal een **ezel** die... | In de filosofische paradox die bekend staat als Buridans **Ezel** zal een **Ezel** die... | Ezel cap (×2) |
| Questions | 93 | (quiz, German EN) | Vertrauen Sie niemals einem langsamen Esel beim Brückenbauen | Vertrouw nooit een trage **ezel** bij het bruggen bouwen | Vertrouw nooit een trage **Ezel** bij het bruggen bouwen | Ezel cap |
| Questions | 95 | (option) | Play as a donkey pulling wagons of hay from one town to another | Als een **ezel** wagons hooi van de ene stad naar de andere trekken | Als een **Ezel** wagons hooi van de ene stad naar de andere trekken | Ezel cap |
| Questions | 96 | (option) | Drive a car down a road while avoiding donkeys | Met een auto over een weg rijden terwijl je **ezels** ontwijkt | Met een auto over een weg rijden terwijl je **Ezels** ontwijkt | Ezel cap |
| Questions | 97 | (option) | Play a rhythm game that simulates donkeys mating | Een ritmespel spelen dat de paring van **ezels** simuleert | Een ritmespel spelen dat de paring van **Ezels** simuleert | Ezel cap |
| Questions | 101 | (quiz) | In China, the rise in demand for a luxury Traditional Chinese Medicine product called 'ejiao' has resulted in how many asses being slaughtered annually? | In China heeft de stijgende vraag naar een luxeproduct uit de traditionele Chinese geneeskunde, 'ejiao' genaamd, ertoe geleid dat er jaarlijks hoeveel **ezels** worden geslacht? | ...hoeveel **Ezels** worden geslacht? | Ezel cap |
| Questions | 105 | (quiz) | As of 2018, how heavy must a tourist be to be too heavy to ride an ass on the island of Santorini, Greece? | Hoe zwaar moet een toerist vanaf 2018 zijn om te zwaar te zijn om op een **ezel** te rijden op het eiland Santorini in Griekenland? | ...op een **Ezel** te rijden... | Ezel cap |
| Questions | 108 | (quiz) | In northwestern Australia, wild asses are shot from government helicopters because: | In het noordwesten van Australië worden wilde **ezels** neergeschoten vanuit overheidshelikopters omdat: | In het noordwesten van Australië worden wilde **Ezels** neergeschoten... | Ezel cap |

---

## Notes on E0

### Side-flag: E0_Questions J27 player register

EN: `Have you ever lost your job because your role became redundant at your place of work?`
NL: `Bent **u** ooit **uw** baan kwijtgeraakt omdat **uw** functie overbodig werd op **uw** werkplek?`

This is a **player-facing quiz** (no speaker attribution). NL uses formal `u`/`uw` throughout — standard Dutch quiz/UI register. **Gemini's E0 audit proposed converting to `Zijt ge ooit uw baan kwijtgeraakt...` (Smart Ass `ge/gij` register).** Opus assessment: this is **not character speech**; player-facing UI typically uses formal `u` in Dutch. **Recommend keep `u/uw` as deliberate UI register choice.** Tom decision needed if disagreement.

The same question applies to all 18 Ezel-cap fixes above — these are quiz/narrative/option text, not character speech. Per the strict Ezel-as-proper-noun rule, all should cap. But this would treat trivia text as having character voice — confirm intent.

### Side-flag: E0_Questions J74 typo (out-of-scope but worth noting)

NL: `Mannelijke **ezels** een zeer grote penis **hebbem**` — `hebbem` should be `hebben`. Typo not in any of the 46 categories (#38 letter doublings/drops doesn't quite match either — this is missing `n`/wrong `m`). Flag for separate cleanup.

### Categories scanned (full list applied)

**Active hits:**
- ✅ #21 Ezel capitalization — **20 cells (heaviest E0 bucket)** — 18 in Questions + 2 in CharacterProfiles
- ✅ #24 Machine → Machien — 2 cells (ManagerScene J15 + CharacterProfiles J18, both `Piet-Machine` labels)

**Categories with zero hits in E0 (verified clean):**
- ✓ #1 Pronoun register — 0 strict drift (J27 is UI register, see side-flag)
- ✓ #4 Sturdy `, Kameraad` — 0
- ✓ #6 Old monikers — 0 in E0
- ✓ #7 Bikkeharde — 0
- ✓ #8 Mechalen — 0
- ✓ #9 Muilegem — 0
- ✓ #10 MUILEBEEK — 0
- ✓ #11 Bar Poepegaatje — 0
- ✓ #12 Uncle Oom — 0
- ✓ #13 Boerderij — 0 in E0
- ✓ #14 Vazal — 0
- ✓ #16 Slogan — 0
- ✓ #17 Song of Ascension — 0
- ✓ #18 Hie/Haa — 0 (CharacterProfiles J21/J22 use HIE/HAA correctly)
- ✓ #25 Stenen-Spel — 0
- ✓ #26 Sad whimper — 0
- ✓ #29 Inflection (Astraal/Astrale) — 0
- ✓ #33 Sturdy lament — 0
- ✓ #35 Apostrophe — 0
- ✓ Today: HUDO, Schup, Nijg, doekjes, Afspraak, Snotezel, Stampgast, Sloom, DJ welcome, Jansen, liefste Gods, ezel8ig — 0 in E0
- ✓ #44 *-Zak — 0
- ✓ #45 Parenthesised leak — 0
- ✓ #46 Bare EN names — 0

### Codex sync trigger (consistent across episodes)

`Cole-Machine.dutch = "Piet-Machine"` referenced in: ManagerScene J15, CharacterProfiles J18, E9_GoldenAss J48 + J64, E10_Credits J39. **Total 5 cells corpus-wide.** Codex update needed: `"Piet-Machine"` → `"Piet-Machien"` (v3.3 → v3.4).

### Reconciliation with Gemini's E0 audit

Gemini's E0 audit (24 cells per their handoff) included:
- All 18 quiz Ezel cap fixes ✓ — matches Opus
- 2 Piet-Machine label fixes ✓ — matches
- 2 CharacterProfiles cap fixes (Groffe ezel, Constat-ezel) ✓ — matches
- 1 Question 27 register fix (`Bent u` → `Zijt ge`) — **Opus questions** (UI text, not character voice)
- (1 small variance from Gemini's count)

**Net delta:** essentially equivalent on mechanical fixes. Differ on philosophical Q27 register call.

---

**Total E0 cells flagged: 22 unique** (22 issues, 0 combined fixes). 18 Ezel-cap cells need narrative-text decision. 2 Piet-Machine cells trigger codex sync. 2 character profile cap fixes are unambiguous.
