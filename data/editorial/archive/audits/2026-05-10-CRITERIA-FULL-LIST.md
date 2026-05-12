# Full Criteria List — am-fl-trans Editorial Audit
**Compiled:** 2026-05-10
**Scope:** every consistency / quality criterion tracked across the project
**Sources merged:** `_RESUME-2026-05-07.md` (46-cat master list) + today's new feedback + Opus-cycle emergent findings + Patrick 3-way diff conflicts

> **Reading guide:** each entry has WHAT (the criterion), RULE (canonical form / fix), STATUS, and SOURCE. Use this as the master reference when scanning any new corpus.

---

## A. Character voice

### 1. Pronoun register per character
- **What:** Each codex character has locked pronoun set (`pronounsAllowed` / `pronounsForbidden` in `codex_verified.json`). 28 entries.
- **Rule:** Use only `pronounsAllowed` set. `ge/gij` (Hard, Big, Bad, Old, Thirsty, Kick, Cole-Machine, Golden Ass, Hee, Haw, THE GODS) vs `je/jij` (Sturdy, Trusty, Lazy, Nice, Sad, Slow, Smart, Mme. Derriere, Zookeeper Rose, Ringmaster Rico, Child Joey, Butte, Miner Jenny, Radio Host Marcos, Melvin).
- **Exceptions (locked):**
  - `ge/gij` chars *may* use `u/uw` when addressing seniors or The Gods
  - Any speaker may use `u/uw` toward Foal in dismissive/patronizing contexts
  - The Gods themselves use **capital U/Uw**
- **Status:** Phase-C locked; ongoing audit. 5 cells E3 with Foal-exception drift; 21 Gods-cap fixes pending.
- **Source:** Codex v3.3 + `_RESUME-2026-05-07.md` §pronoun rules

### 2. Stutter patterns
- **What:** Slow Ass stutters consistently on Dutch consonants (b-/z-/p-/d-/h-/m-).
- **Rule:** Stutter prefix only; no English fragments mid-stutter. `*p-puf*` not `*p-puff*`.
- **Status:** ✅ Batch n applied (1 cell); ongoing per-cell.
- **Source:** Codex Slow Ass `verbalTics` + batch n

### 3. English bleed in donkey lines
- **What:** Zero English words in donkey character speech.
- **Rule:** Strip English fragments. Exceptions: `Sorry` (naturalized Flemish loanword, EN match).
- **Status:** ✅ Batch n applied; broader recheck clean.
- **Source:** Tom directive 2026-05-04

### 4. Verbal tics / over-use
- **What:** Sturdy Ass uses `, Kameraad` as comma-tag address (~14 instances pre-cleanup).
- **Rule:** Strip `, Kameraad` from NL when EN has no `, Comrade`. Keep when EN-justified.
- **Status:** ✅ Batch m applied (14 cells stripped). m2 review for 9 EN-justified cells: keep all (Tom's call).
- **Source:** Batch m, Q5 lock

---

## B. Character monikers / names

### 5. Long-form vs short-form consistency
- **What:** Each character has codex-locked long form (e.g. `Trouwe Ezel`) and short (`Trouwe`).
- **Rule:** Use codex `dutch` (long) and `dutchShort` (short) consistently. Don't invent third variants.
- **Status:** 🔍 Drift tracked per audit (e.g. Snotezel as third form for Sick Ass — needs reversal).
- **Source:** Codex v3.3

### 6. Old monikers retired
- **What:** Pre-Phase-C names that should no longer appear.
- **Rule:** `Schoon Beest` → `Lieve Ezel` / `Felle Gast` → `Bikkelharde` / `Betweter` → `Slimme` (`Betweterke` → `Slimmeke` diminutive).
- **Status:** ⏳ 28 drift cells remain (E1×6, E2×3, E3×4, E4×15) — was thought resolved.
- **Source:** Phase-C closure + Opus 2026-05-10 re-scan

### 7. Spelling canonical — Bikkeharde → Bikkelharde
- **What:** Hard Ass long form must include the `L`.
- **Rule:** `Bikkeharde Ezel` → `Bikkelharde Ezel`; `Bikkeharde` → `Bikkelharde`.
- **Status:** ✅ Batch g (3 cells) applied. **Codex still drifted** (`Hard Ass.dutch = "Bikkeharde Ezel"` in v3.3).
- **Source:** Batch g lock 2026-05-04

### 7b. Snotezel single-word drift (Sick Ass)
- **What:** Sick Ass has codex `dutch: "Snot Ezel"` (two words) and `dutchShort: "Snotje"`. The third form `Snotezel` is drift.
- **Rule:** Convert all `Snotezel` → `Snotje` (short, conversational) or `Snot Ezel` (long).
- **Status:** ⏳ 8 drift cells (E2/E3/E4). Gemini proposed Snotezel — **Opus rejects per codex**.
- **Source:** Opus 2026-05-10 codex check

### 7c. Stampgast drift (Kick Ass)
- **What:** Codex `dutch: "Stamp Ezel"` / `dutchShort: "Stamp"`. `Stampgast` is drift.
- **Rule:** Convert all `Stampgast` → `Stamp` (short).
- **Status:** ⏳ 2 drift cells (E2 J26, E3 J70). Gemini proposed Stampgast — **Opus rejects per codex**.
- **Source:** Opus 2026-05-10

### 7d. Sloom drift (Slow Ass)
- **What:** Codex `dutchShort: "Slome"`. `Sloom` is drift.
- **Rule:** Convert all `Sloom` → `Slome`.
- **Status:** ⏳ 1 drift cell (E3 Mine1F J120).
- **Source:** Opus 2026-05-10

### 7e. Constaterende Ezel (Peek Ass)
- **What:** Patrick chose `Constaterende Ezel` (long form) over `Constat-ezel` (codex profile shorthand).
- **Rule:** **PENDING TOM** — adopt Patrick's `Constaterende Ezel` and update codex?
- **Status:** 🤔 Decision needed. Patrick's snapshot has it implemented (E0 J82, likely E10 J73 too).
- **Source:** Patrick 2026-05-08 snapshot

---

## C. Place names

### 8. Mechalen / Mecha → Technopolis
- **What:** All NL references to "Mecha" or "Mechalen" → `Technopolis`.
- **Rule:** Direct substitution. ALL CAPS variant: `MECHA` → `TECHNOPOLIS` (verify when found).
- **Status:** ✅ Batch a (30 cells) applied. 0 strays.
- **Source:** Tom lock 2026-05-04

### 9. Fannyside (region) → Muilenbeek / Muilebeek
- **What:** Region-level Fannyside (the wider area, not the village) → `Muilenbeek` per Tom Q3 lock OR `Muilebeek` per Patrick's snapshot.
- **Rule:** 🔴 **CONFLICT — Tom decision required.** Q3 said `Muilenbeek` (extra n); Patrick used `Muilebeek` (no extra n).
- **Status:** 17 `Muilenbeek` in local; 15 `Muilebeek` in Patrick. 1 `Muilegem` legacy stray (E3_200 J3).
- **Source:** Q3 lock 2026-05-04 vs Patrick 2026-05-08

### 9b. Bumpkin Village → Klotegem
- **What:** The village within the Fannyside region → `Klotegem`.
- **Rule:** When EN says "Bumpkin" or "Bumpkin Village", NL = `Klotegem`. Distinct from the region.
- **Status:** ✅ Implemented by Gemini direct edits — 9 cells current.
- **Source:** Gemini 2026-05-09 + Tom approval

### 10. Demonym propagation — Bumpkinites → Klotegemmers
- **What:** People from Bumpkin = `Klotegemmers`.
- **Rule:** Follows the village rename. NOT `Muilenbekers` (which would follow the region).
- **Status:** ✅ Implemented (1 cell E5 J244).
- **Source:** Gemini 2026-05-09

### 11. Bar name — Poepegaatje → De Zatten Ezel
- **What:** The bar (EN: "The Drunk Ass") → `De Zatten Ezel`.
- **Rule:** Direct rename. **NO preceding article** (`het`/`een` dropped per Tom).
- **Status:** ✅ Batch e1 applied (5 cells). 0 strays.
- **Source:** Batch e1 + Tom article-drop decision

---

## D. Term consistency

### 12. Uncle — Nonkel / Oom
- **What:** Dutch for "Uncle" in dialogue.
- **Rule:** `Nonkel` for ALL speakers; `Oom` ONLY when spoken by Smart Ass. ⚠️ **Inverts prior "Oom everywhere" directive.**
- **Status:** ⏳ 11 drift cells (Foal speakers using Oom). 0 Smart Ass cells using Nonkel.
- **Source:** Tom inversion 2026-05-04

### 13. The Farm / Stable — de Hoeve / de Stal
- **What:** Farm building/grounds vs. stable building.
- **Rule:** `Boerderij` → `de Hoeve` (the Farm). `Stal` only when literally the stable building (verify per cell).
- **Status:** ⏳ ~40 drift cells (E1×2, E2×16, E3×1, E6×5, E8×1, E10×3 + Welcome Sign duplicates). 4 Stal cells verified literal ✓.
- **Source:** Tom lock 2026-05-04

### 14. Vassal — Vazal / Vazallen / Afgevaardigde
- **What:** "Vassal" (game term) → `Vazal` / `Vazallen`.
- **Rule:** All NL → `Vazal`/`Vazallen`. Asset pipeline `AFGEVAARDIGDE` → `VAZAL`.
- **Status:** ✅ Dialogue clean (Vazal used correctly throughout). ⏳ Asset/sticker work pending (batch q).
- **Source:** Tom lock 2026-05-04

### 15. Machine Prophet — Profetische Machien / Machien Profeet
- **What:** Two compound formations possible. Need consistency.
- **Rule:** ⚠️ Pending scope decision. Current corpus uses `Profetische Machine` (4 cells) — needs Machien swap + form consistency.
- **Status:** 🔍 Scope in batch p (Machien sweep).
- **Source:** Master list #15

### 16. Ass Power slogan — EZELS EERST (today's lock)
- **What:** EN `ASS POWER!` chant.
- **Rule:** **`EZELS EERST`** corpus-wide. Supersedes earlier `EZELSKRACHT` / `EZELSKRACHT AAN DE MACHT`.
- **Status:** ⏳ 13 drift cells. 5 need full sentence rephrase (slogan was noun phrase, now imperative chant — doesn't drop into existing sentences cleanly).
- **Source:** Tom lock 2026-05-10 (today)

### 17. Song of Ascension — Hemelvaarts-zang-der-Ezel-zielen
- **What:** The Song of Ascension full title.
- **Rule:** **`het Hemelvaarts-zang-der-Ezel-zielen`** — always `het`, exact form, hyphens, capitalized `Ezel`.
- **Status:** ✅ Batches c + c2 applied (10 cells). All 7 corpus instances canonical.
- **Source:** Batch c + c2 + Tom het-lock

### 18. Hie/Haa casing
- **What:** EN `Hee/Haw` (donkey bray + Gods names).
- **Rule:** All-caps `HIE`/`HAA` in Gods/ritual contexts. Title-case `Hie`/`Haa` in regular dialogue (per-instance scope).
- **Status:** ✅ Clean — 7 HIE + 7 HAA cells correct. 0 Hee/Haw drift.
- **Source:** Tom lock 2026-05-04

### 19. Drunk word — Zatlap vs Beschonken
- **What:** Two NL options for "drunk".
- **Rule:** ⚠️ Pending — pre-pull diff showed Beschonken active on remote.
- **Status:** 🔍 Verify current state. Note: `Beschonken` is also Thirsty Ass codex `dutchShort` — different context.
- **Source:** Pre-pull diff 2026-05-03

### 20. Battle verbs (E2)
- **What:** "Stomp"/"Tackle"/"Headbutt"/"Double Kick"/etc. across BattleMiner vs BattleButte sheets.
- **Rule:** Same EN → same NL across battle sheets. Currently inconsistent (e.g. `koppertje` vs `kopstoot` for Headbutt).
- **Status:** ⏳ 4 cross-sheet inconsistencies + 1 Anglicism (`maakt een move`).
- **Source:** Master list #32 + Opus E2 audit

---

## E. Capitalisation rules

### 21. Ezel always capitalised (proper noun)
- **What:** `Ezel` as character/species reference must always cap mid-sentence.
- **Rule:** Capitalize all `ezel(s/innekes/tje/tjes/en/kes)` mid-sentence.
- **Status:** ⏳ ~70 drift cells. Sub-decision pending: does rule apply to **narrative/quiz/diary text** (24 cells in E0/E1/E3) or only character dialogue?
- **Source:** Tom lock 2026-05-04

### 22. Circusdirecteur as title
- **What:** Circus director as title before name.
- **Rule:** Cap `Circusdirecteur` when used as title (before name). Lowercase mid-sentence as common noun.
- **Status:** 🔍 Per-instance audit; codex says `Circusdirecteur Baptiste` (title form).
- **Source:** Master list #22

### 23. Other proper nouns
- **What:** Game/place/role names case-by-case.
- **Rule:** Cap when proper noun, lowercase when common.
- **Status:** 🔍 Ongoing per-cell.
- **Source:** Master list #23

---

## F. Compound forms / hyphenation

### 24. Machine compounds → Machien
- **What:** All Machine compounds get hyphenated `Machien` form.
- **Rule:** `Machine` → `Machien`; `Machines` → `Machienen`. Compounds: `Tractor-Machien`, `Piet-Machien`, `Camion-Machien`, `Auto-Machien`, `Boor-Machien`, `Mysterie-Machien`, etc. **Note hyphen requirement** — `Camion Machine` (no hyphen) found 5 times → should be `Camion-Machien`.
- **Status:** ⏳ ~120 drift cells. **Codex sync trigger** for `Cole-Machine.dutch` field. **Largest pending batch (p).**
- **Source:** Tom lock + Q1 (Machienen plural)

### 25. Keien-Spel consistent
- **What:** EN "Rocks/Stone Game" → `Keien-Spel`.
- **Rule:** Strong enforcement. Hyphen, capital K + S.
- **Status:** ✅ Batch b applied (12 cells). 0 Stenen-Spel residue.
- **Source:** Tom lock 2026-05-04

---

## G. SFX / sound effects

### 26. Sad whimper — *Boe-hoe-hoe*
- **What:** Sad Ass whimper SFX.
- **Rule:** **`*Boe-hoe-hoe*`** — capital B, hyphens, exactly 3 `hoe`. ⚠️ Conflict: Patrick uses lowercase `*boe-hoe-hoe*` (4 cells).
- **Status:** ✅ Batch f applied (18 cells in our local). 🔴 4 conflict cells with Patrick's snapshot.
- **Source:** Batch f lock

### 27. Radio static — *tsj*
- **What:** DJ Tom radio static SFX.
- **Rule:** `*tsj*` standard form.
- **Status:** 🔍 Audit pending (other forms may exist).
- **Source:** Master list #27

---

## H. Idioms & grammar

### 28. Idiom correctness — doekjes om winden
- **What:** Flemish idiom "to mince words".
- **Rule:** `doekjes om winden` (correct). NOT `doekjes rond winden` (wrong).
- **Status:** ⏳ 1 drift cell (E5_CircusMain J195 Ringmaster). ✅ Ready to apply.
- **Source:** Today's feedback

### 29. Inflection — Astrale Hiernamaals
- **What:** `Hiernamaals` is neuter; preceding adjective takes `-e`.
- **Rule:** `Astrale Hiernamaals` (correct, with `-e`). NOT `Astraal Hiernamaals`. Also typo `Hiernaamaals` → `Hiernamaals`.
- **Status:** ✅ 0 drift in current scan.
- **Source:** Master list #29

### 30. Idiomatic verb — scheppen / schoppen
- **What:** Common-word swap risk: `scheppen` (create) vs `schoppen` (kick / rise to).
- **Rule:** Per-cell context check.
- **Status:** 🔍 Per-cell only; not corpus-scannable mechanically.
- **Source:** Master list #30

### 31. Pun preservation — aap-itude
- **What:** EN "ape-titude" pun (Ringmaster).
- **Rule:** Current NL `aap-itude` is awkward Dutch — alternative needed. Possible: `apenkundig`, `aap-tude`, full rework.
- **Status:** 🤔 Decision needed. 2 cells (E5 J69, J81).
- **Source:** Master list #31

### 32. Phrase consistency — same EN → same NL
- **What:** Identical EN strings across sheets should have identical NL.
- **Rule:** Pick one NL, apply consistently. E2 Battle examples: `How will you respond?` rendered two ways; `You Double Kick!` two ways; etc.
- **Status:** ⏳ 4 cross-sheet pairs in E2 (decision needed).
- **Source:** Master list #32 + Opus E2 audit

---

## I. Sturdy's lament

### 33. Lament canonical form
- **What:** Sturdy's recurring "evil Machines" lament.
- **Rule:** **`slechte, zielloze, werk-afpakkende, kind-dodende Machienen`** — exact adjective set, exact word order, Machienen plural.
- **Exception:** `KWAADAARDIG!` (emphatic, Q2 lock) stays — only non-canonical lament *deviations* are fixed.
- **Status:** ⏳ 1 cell needs full reword (E6_World J142 has `kwaadaardige, baanafpakkende, kindermoorddadige`); ~3 fragment cells need just Machienen swap.
- **Source:** Tom canonical lock + Q2

---

## J. Punctuation

### 34. Terminal periods
- **What:** Sentence end periods missing.
- **Rule:** Add terminal `.` where missing per EN.
- **Status:** 🔍 Ad-hoc. 1 found in Opus (E2_BattleMiner J11 `DJOEF OP U BAKKES` — no period).
- **Source:** Master list #34

### 35. Apostrophe cleanup — `'t Is` / `'k Heb`
- **What:** Sentence-start contractions need apostrophe.
- **Rule:** `'t Is` not `t Is`. `'k Heb` not `k Heb`. Apply at sentence start (after `.`/`!`/`?`).
- **Status:** ⏳ 9 drift cells (E3×4, E5×1, E6×3, plus E2/E3 mixed).
- **Source:** Opus 2026-05-10 (new bucket)

### 36. Quotes — curly vs straight
- **What:** `"..."` straight vs `"..."` curly.
- **Rule:** Standardize. Quote-bug commit `a0ead0a` previously hit 11 cells.
- **Status:** ✅ Largely resolved.
- **Source:** Master list #36

### 37. Em-dash vs hyphen
- **What:** `—` (em-dash) for speech interruption vs `-` (hyphen) for compound.
- **Rule:** Em-dash for parentheticals/interruptions; hyphen for compounds.
- **Status:** 🔍 Periodic audit.
- **Source:** Master list #37

---

## K. Typos (per-cell, not category-scannable)

### 38. Letter doublings / drops
- **What:** Specific typos like `Hiernaamaals`, `tereur`, etc.
- **Rule:** Per-cell fix.
- **Status:** ✅ Mostly resolved. Per-screenshot if re-found.
- **Source:** Master list #38

### 39. Common-word swaps
- **What:** `bij` / `blij`, `scheppen` / `schoppen`, etc.
- **Rule:** Per-cell context.
- **Status:** 🔍 Per-cell.
- **Source:** Master list #39

### 40. Compound typos
- **What:** `Ezenzeuler` / `Ezelzeuler`, `Vanscheetsvelde` split, etc.
- **Rule:** Per-cell.
- **Status:** ✅ `Ezelzeuler` done. Others per-cell.
- **Source:** Master list #40

### 40b. Specific cell typos found in Opus
- E0_Questions J74: `hebbem` should be `hebben`
- E10 Bleak Ass J148: `Tank Machines... Vlieg Machines...` → needs hyphens
- E2_BattleMiner J11: `DJOEF OP U BAKKES` missing terminal period
- **Source:** Opus 2026-05-10

---

## L. Pronoun usage anomalies

### 41. E10 U/Uw spike — RESOLVED
- **What:** Original scoping flagged 32 E10 cells with possibly-unauthorized u/uw.
- **Rule:** Apply pronoun-exception rules (seniors/gods/Foal-dismissive).
- **Status:** ✅ **CLOSED** post-Opus E10 audit. Net work = 9 Golden Ass cap fixes only. Other 23 cells legit per exceptions.
- **Source:** Master list #41 + Opus E10

### 41b. Gods U/Uw caps
- **What:** The Gods (THE GODS, Hee, Haw, Golden Ass) speak with capital U/Uw.
- **Rule:** Lowercase `u`/`uw` → capital `U`/`Uw` in any cell where speaker ∈ {THE GODS, Hee, Haw, Golden Ass}.
- **Status:** ⏳ 21 drift cells (E8×8, E9×4, E10×9).
- **Source:** Tom lock 2026-05-04

### 41c. ge/gij chars u/uw exception
- **What:** ge/gij speakers may use u/uw to seniors/Gods/Foal.
- **Rule:** Refines the strict pronoun lock — context-aware.
- **Status:** ✅ Locked.
- **Source:** Tom refinement 2026-05-04

### 41d. Foal je → ge code-switching
- **What:** Foal (`{$NewName}`) is mixed-register (codex `pronounForm: mixed`).
- **Rule:** Both ge/gij and je/jij allowed; context-sensitive.
- **Status:** ✅ Locked.
- **Source:** Codex Foal entry

---

## M. Asset / sprite mismatches

### 42. Sculpture name vs title
- **What:** Tom's brainstorm — needs specific cell pointer.
- **Rule:** TBD.
- **Status:** 🤔 Pending Tom pointer.
- **Source:** Master list #42

### 43. Sticker / logo text — AFGEVAARDIGDE
- **What:** Asset pipeline text (sign, sticker, logo) needs Dutch.
- **Rule:** `AFGEVAARDIGDE` → `VAZAL` per asset pipeline.
- **Status:** ⏳ Batch q (asset pipeline; coordinate with Hugo).
- **Source:** Master list #43

### 43b. E11 NonCSV signs (massive backlog)
- **What:** `data/csv/11_asses.masses_NonCSVBasedTranslations.csv` has ~50 sign/prop cells with Italian text in the "TranslatedDutch" column.
- **Rule:** Translate all signs/props to Dutch per locked canon (Muilenbeek/Klotegem/Technopolis/Derrière/Machien/etc.).
- **Status:** ⏳ ~52 cells flagged (Opus E11 audit).
- **Source:** Opus 2026-05-10 + Gemini E11 audit

### 43c. E10_Words_Dutch sheet missing
- **What:** `E10_Words` has sheets for 9 languages but no Dutch.
- **Rule:** Create `E10_Words_Dutch` with: `de vonk`, `het onvermijdelijke`, `de Machien-Profeet`, `en de Ezels van Muilenbeek`.
- **Status:** ⏳ 4 cells.
- **Source:** Opus E11 audit

---

## N. Editorial residue / drift artifacts

### 44. Deprecated *-Zak forms
- **What:** Old character suffixes ending in `-Zak` (Triestigaard, etc.).
- **Rule:** Removed per Phase-C cleanup.
- **Status:** ✅ Resolved (commits `31df687`, `da1a816`). 0 Opus-found.
- **Source:** Phase-C residue sweeps

### 45. Parenthesised EN leaks
- **What:** EN-source notation `(Hard Ass)` leaking into NL.
- **Rule:** Strip.
- **Status:** ✅ Largely resolved. 0 Opus-found.
- **Source:** Master list #45

### 46. Bare EN character names in NL
- **What:** EN names (`Sturdy Ass`, etc.) left untranslated in NL.
- **Rule:** Replace with codex Dutch form.
- **Status:** ✅ Largely resolved. 0 Opus-found.
- **Source:** Master list #46

---

## O. New feedback items (2026-05-10)

### 47. HUDO replacement
- **What:** Outhouse rendered as `De Hudo` — Tom flags as confusing.
- **Rule:** 🤔 Decision needed. Options: `Het Privaat`, `Het Sekreet`, `De Plee`, `De Buitenwc`.
- **Status:** ⏳ 9 cells corpus-wide (E1×2, E2×6, E3×1).
- **Source:** Today's feedback

### 48. Jansen replacement
- **What:** Flemish dismissive pronoun `jansen` — confusing for audience.
- **Rule:** 🤔 Decision needed. Options: `u`, `gij`, `die mens`, `die gast`, keep.
- **Status:** ⏳ 2 cells (E6 BattleHard J8 Thirsty, E6 BadCave J55 Bad Ass).
- **Source:** Today's feedback

### 49. Nijg replacement
- **What:** Flemish intensifier `nijg` (Slow Ass) — confusing.
- **Rule:** 🤔 Decision needed. Options: `hard`, `erg`, `fel`, `bakken`, keep.
- **Status:** ⏳ 2 cells (E5 CircusMain J167, J176 — identical).
- **Source:** Today's feedback

### 50. Schup → Schep (E2 Battle)
- **What:** `SCHUP` (shovel) too similar to `SCHOPPEN`.
- **Rule:** `SCHUP` → `SCHEP`. J14 also reword: `EET MIJN SCHEP OP, KLOOTZAKSKE!!`
- **Status:** ⏳ 2 cells (E2_BattleMiner J13/J14). ✅ Ready.
- **Source:** Today's feedback

### 51. Acte vs Nummer (E5 Circus)
- **What:** Board displays say `EERSTE NUMMER` etc.; Ringmaster speech says `actes`.
- **Rule:** 🤔 Decision needed: standardize one or keep distinction (board=formal Nummer, speech=casual acte).
- **Status:** ⏳ 7 cells (5 board + 2 speech).
- **Source:** Today's feedback

### 52. Afspraak → Plan
- **What:** EN "Plan" → NL "het Plan" not "afspraak".
- **Rule:** When EN says "Plan" → `het Plan`. Edge case: when EN says "deal" — keep `afspraak` or also `Plan`?
- **Status:** ⏳ 1 cell ready (E1_TheProtest J130 Smart Ass). 🤔 1 decision (E5_ZooCapture J25 Wedgie EN="deal").
- **Source:** Today's feedback

### 53. DJ welcome rephrase
- **What:** `BEDANKT VOOR BUITEN TE KOMEN VOOR MIJN SET!!` is half-Anglicism.
- **Rule:** 🤔 Decision needed. Options: `BEDANKT DAT JULLIE GEKOMEN ZIJN VOOR MIJN SET!!` (caps preserved) / `Bedankt dat jullie naar mijn set zijn gekomen` (smoother).
- **Status:** ⏳ 1 cell (E4_AstralPlaneMain J221 DJ Dope Ass).
- **Source:** Today's feedback

### 54. Missing song title — ezel8ig
- **What:** EN `asi9 by David Mesiha` (asi9 = leetspeak for "asinine"). NL drops the title entirely.
- **Rule:** Add `ezel8ig` (Dutch leetspeak for "ezelachtig"). Mirrors EN pun 1:1.
- **Status:** ⏳ 1 cell (E10_Government J12 Radio Host Marcos). ✅ Ready.
- **Source:** Today's feedback

### 55. E1_Stable2F J47 phrasing reorder
- **What:** Reorder Hemelvaarts-zang sentence to fit UI box.
- **Rule:** `Iemand moet ... zingen zodat ... herrijzen.` → `Zodat ... herrijzen, iemand moet ... zingen.`
- **Status:** ⏳ 1 cell. **Note:** Patrick already implemented (3-way diff conflict C4 — Patrick wins).
- **Source:** Today's feedback + Patrick 2026-05-08

### 56. Constaterende Ezel investigation
- **What:** Tom asked if `Constaterende Ezel?` exists.
- **Rule:** Patrick implemented `Constaterende Ezel` for Peek Ass. Adopt as canon?
- **Status:** 🤔 Decision needed; codex update implied.
- **Source:** Tom investigation 2026-05-09 + Patrick 2026-05-08

### 57. EZELS EERST slogan (today's lock)
- **What:** New canonical slogan, supersedes all earlier `EZELSKRACHT` etc.
- **Rule:** All variants → `EZELS EERST`. Some cells need full sentence rephrase.
- **Status:** ⏳ 13 drift cells; 5 need rephrase.
- **Source:** Tom lock 2026-05-10

### 58. Camion-Machien hyphen
- **What:** `Camion Machine` (no hyphen) found across E6/E7/E10.
- **Rule:** `Camion-Machien` (with hyphen + Machien).
- **Status:** ⏳ 5 cells.
- **Source:** Opus recurring flag

### 59. Tank Machines / Vlieg Machines hyphens
- **What:** Bleak Ass cell `Tank Machines... Vlieg Machines...` — missing hyphens.
- **Rule:** `Tank-Machienen... Vlieg-Machienen...`.
- **Status:** ⏳ 1 cell (E10 J148).
- **Source:** Opus E10

### 60. Oh liefste Gods — translation fidelity
- **What:** EN "Praise be to the Gods" → NL `Oh liefste Gods` (drift to "Oh dearest Gods").
- **Rule:** Suggested: `Lof zij de Goden.` or `Geprezen zijn de Goden.`
- **Status:** 🤔 Decision needed. 1 cell (E6_World J160 Sturdy).
- **Source:** Tom inquiry 2026-05-09 + Opus E6

### 61. DJ Dope Ass register (codex add)
- **What:** DJ Dope Ass not in codex; uses `gij`/`hebde`.
- **Rule:** 🤔 Decision: lock as `ge/gij` (matches usage; just add codex entry) or retcon to `je/jij`.
- **Status:** 🤔 Decision needed.
- **Source:** Opus E4

### 62. `Bikkelhard` short form (E6 World J9)
- **What:** Foal says `Oom Bikkelhard` (missing terminal `e`).
- **Rule:** Either typo (apply `Bikkelharde`) or intentional short form.
- **Status:** 🤔 Decision needed.
- **Source:** Opus E6

### 63. E0_Questions player register
- **What:** Quiz uses formal `u/uw`. Gemini proposed converting to `Zijt ge` (Smart Ass register).
- **Rule:** Opus argues UI text should keep formal `u`. Gemini argues character voice.
- **Status:** 🤔 Decision needed. 18 cells (potential).
- **Source:** Opus E0 vs Gemini E0

### 64. Narrative-text Ezel cap
- **What:** Does the Ezel cap rule apply to narrative/quiz/diary text (no character speaker)?
- **Rule:** Strict interpretation: cap. Loose: leave as common noun.
- **Status:** 🤔 Decision needed. ~24 cells (E0 quiz, E1 J47, E3 100/200/300 diary).
- **Source:** Opus 2026-05-10

### 65. Slogan sentence rephrase pattern
- **What:** 5 cells need full sentence reword for `EZELS EERST` (slogan changed from noun phrase to imperative).
- **Rule:** Per-cell rewording with Tom approval.
- **Status:** 🤔 Decision needed per cell. Suggested rewrites in Opus per-episode audits.
- **Source:** Opus 2026-05-10

---

## P. Patrick 3-way diff conflicts (NEW 2026-05-10)

### 66. Muilenbeek (extra n) vs Muilebeek (no extra n)
- **What:** Tom's Q3 lock said `Muilenbeek`; Patrick used `Muilebeek` corpus-wide.
- **Rule:** 🔴 **DECISION REQUIRED** — pick one; affects 17 (ours) or 15 (Patrick's) cells immediately.
- **Status:** 🔴 Critical conflict.
- **Source:** Patrick 2026-05-08 vs Tom Q3

### 67. Sad whimper case — *Boe-hoe-hoe* vs *boe-hoe-hoe*
- **What:** Our cap B vs Patrick's lowercase b.
- **Rule:** 🔴 **DECISION REQUIRED.** Both agree on 3-hoe + hyphens; only case differs.
- **Status:** 4 conflict cells.
- **Source:** Patrick 2026-05-08 vs batch f

### 68. Patrick's substantive rewrites
- **What:** Patrick rewrote ~30 cells in E1_TheProtest with completely different content (not consistency fixes).
- **Rule:** **Default policy needed**: always defer to Patrick (senior editor) or selective override?
- **Status:** 🤔 Decision needed.
- **Source:** Patrick 2026-05-08

### 69. Codex sync — Cole-Machine.dutch
- **What:** 5 cells corpus-wide reference `Piet-Machine`. Codex still says `"Piet-Machine"`.
- **Rule:** Update codex_verified.json + codex_translations.json: `"Piet-Machien"`.
- **Status:** ⏳ Codex bump v3.3 → v3.4 needed.
- **Source:** Opus + Patrick

### 70. Codex sync — other drifted fields
- **What:** Multiple codex fields drifted vs locked decisions.
- **Rule:** Update:
  - `Hard Ass.dutch`: `"Bikkeharde Ezel"` → `"Bikkelharde Ezel"`
  - `Hard Ass.dutchShort`: `"Bikkeharde"` → `"Bikkelharde"`
  - `Sad Ass.verbalTics`: reference `*Boe-hoe-hoe*` (3 hoe form)
  - `Old Ass.verbalTics`: reference `EZELS EERST` (today's lock)
- **Status:** ⏳ Codex bump v3.3 → v3.4.
- **Source:** Opus 2026-05-10

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done / verified clean |
| ⏳ | Batch pending / drift cells identified |
| 🔍 | Scope needed / per-cell only |
| 🤔 | Decision needed |
| 🔴 | Critical conflict (Patrick 3-way) |
| ⛔ | Blocked |

---

## Counts summary

- **Total criteria**: 70 entries (46 master list + 24 today/Opus/Patrick)
- **✅ Done**: 18 entries
- **⏳ Drift identified**: 28 entries
- **🤔 Decision needed**: 16 entries
- **🔴 Critical conflict (Patrick)**: 3 entries
- **🔍 Per-cell ongoing**: 5 entries

---

## Source documents (where each criterion was decided)

| Doc | What's in it |
|-----|--------------|
| `_RESUME-2026-05-07.md` | 46-cat master list + locked decisions through 2026-05-07 |
| `_FULL-SCAN-2026-05-10.md` | Initial corpus sweep (340 cells) |
| `_OPUS-AUDIT-COMPLETE-2026-05-10.md` | 12-episode wrap-up + cross-cutting findings |
| `_THREE-WAY-DIFF-2026-05-10.md` | Patrick 3-way diff (53 conflicts, 359 Patrick-only) |
| `docs/analysis/E*_Opus_Audit.md` | Per-episode audits (12 files, ~408 cells flagged) |
| `data/json/codex_verified.json` v3.3 | Character voice profiles (28 entries) |
| `data/editorial/_corpus-scoping-2026-05-03.md` | Raw counts per category |

---

*Master criteria reference. Update this file as new criteria emerge.*
