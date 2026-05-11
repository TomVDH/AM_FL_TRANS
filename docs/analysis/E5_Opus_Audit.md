# Consistency Audit: Episode 5 (Opus)
**File:** `5_asses.masses_E5Proxy.xlsx`
**Status:** STASHED (Pending Review)
**Generated:** 2026-05-10 by Opus full-scan
**Sheets covered:** 7 (CircusMain, EpisodeTitle_Circus, EpisodeTitle_Zoo, Highway, ZooCapture, ZooMain, Zoo_Introduction)
**Cells flagged:** 26 unique cells / 27 issues

> **Coverage:** all 46 master-list categories + today's new feedback items.
> **Heavy decision-pending bucket in E5** — 11 of 26 cells need Tom calls (Acte/Nummer split, aap-itude pun, Nijg, Afspraak deal-context).

---

## E5_CircusMain_localization (18 cells)

### Acte vs Nummer split (#32) — 6 cells decision-pending

The board displays use `NUMMER`; Ringmaster speech uses `actes`. Same EN word `Act` translated two different ways across same sheet.

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| CircusMain | 4 | (board) | ACT ONE | EERSTE **NUMMER** | **(DECISION)** standardize | Acte vs Nummer board |
| CircusMain | 5 | (board) | ACT TWO | TWEEDE **NUMMER** | **(DECISION)** | Acte vs Nummer board |
| CircusMain | 6 | (board) | ACT THREE | DERDE **NUMMER** | **(DECISION)** | Acte vs Nummer board |
| CircusMain | 7 | (board) | ACT FOUR | VIERDE **NUMMER** | **(DECISION)** | Acte vs Nummer board |
| CircusMain | 8 | (board) | ACT FIVE | VIJFDE **NUMMER** | **(DECISION)** | Acte vs Nummer board |
| CircusMain | 21 | Ringmaster Rico | The **acts** you'll see tonight will each be more visually spectacular, more death-defying... | Alle **actes** van vanavond zullen het visuele spektakel, het gevaar, het lef van de **acte** tevoren overtreffen! | **(DECISION)** | Acte vs Nummer speech |
| CircusMain | 73 | Ringmaster Rico | I guarantee our next few **acts** will be more bearable! | onze volgende **actes** de moeite waard zijn! | **(DECISION)** | Acte vs Nummer speech |

**Q: Standardise board → ACTE, or speech → nummer, or keep distinction (board=formal Nummer, speech=casual acte)?**

### aap-itude pun (#31) — 2 cells decision-pending

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| CircusMain | 69 | Ringmaster Rico | Not everyone has the **ape-titude** to be a star! | Niet iedereen heeft de **aap-itude** om de ster van de show te worden! | **(DECISION — aap-itude rework)** | Pun preservation #31 |
| CircusMain | 81 | Ringmaster Rico | What **APE-TITUDE** under such HAIRY circumstances! | **AAP-ITUDE** MET HAAR OP! | **(DECISION)** | Same pun, all-caps version |

**Note:** "aap-itude" is a literal Dutch attempt at "ape-titude/aptitude" — sounds awkward. Possible alternatives: `apenkundig`, `aap-tude`, `ezelente` (donkey-lent), or rework entire line away from pun. Tom's call.

### Nijg (today's feedback) — 2 cells

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| CircusMain | 167 | Slow Ass | *huff p-p-puff* I'm p-p-pouring sweat from the adrenaline already... | *puf puf* Ik z-z-zweet al zo **nijg**, gewoon van d-d-de adrenaline... | **(DECISION PENDING — Nijg replacement)** | Today's feedback |
| CircusMain | 176 | Slow Ass | (duplicate of J167) | (duplicate) | **(DECISION)** | Same |

**Q (carry-over from yesterday):** `nijg` → `hard` / `erg` / `fel` / `bakken` / keep?

### doekjes idiom (today's feedback) — 1 cell ✅ READY

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| CircusMain | 195 | Ringmaster Rico | I'm not lyin' folks... that could have been better. | Ik ga er geen doekjes **rond** winden, mensen. Dat kon beter. | Ik ga er geen doekjes **om** winden, mensen. Dat kon beter. | Idiom: doekjes om winden (correct Flemish) |

### Machine + Ezel cap

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| CircusMain | 106 | Smart Ass | Finding another job with no **Machines** isn't going to be easy. | Een andere job zonder **Machines** vinden gaat niet evident zijn... | Een andere job zonder **Machienen** vinden gaat niet evident zijn... | Machines → Machienen |
| CircusMain | 131 | Smart Ass | (duplicate of J106) | (duplicate) | (duplicate) | Machines → Machienen |
| CircusMain | 215 | Wedgie | Where's the last **donkey**? | Waar zit de laatste **ezel**? | Waar zit de laatste **Ezel**? | Ezel cap |
| CircusMain | 217 | Ringmaster Rico | My show needs Robots more than **donkeys** in cheap costumes if I'm gonna get bums in seats. | Mijn show heeft meer robots dan **ezels** in goedkope kostuums nodig als ik de zaal met wat anders dan marginalen wil opvullen. | Mijn show heeft meer robots dan **Ezels** in goedkope kostuums nodig als ik de zaal met wat anders dan marginalen wil opvullen. | Ezel cap (also: `robots` lowercase — EN has `Robots` capitalized; flag for review) |
| CircusMain | 218 | Ringmaster Rico | No hard feelings, **donkey**. | Het is niet persoonlijk, **ezeltje**. | Het is niet persoonlijk, **Ezeltje**. | Ezel cap |
| CircusMain | 220 | Wedgie | All right **donkey**. Get in the truck. | Kom, **ezel**. De camion in. | Kom, **Ezel**. De camion in. | Ezel cap |

---

## E5_EpisodeTitle_Circus_localiza (0 cells)
## E5_EpisodeTitle_Zoo_localizatio (0 cells)

✓ Clean.

---

## E5_Highway_localization (0 cells)

✓ Clean.

---

## E5_ZooCapture_localization (3 cells)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| ZooCapture | 25 | Wedgie | We had a **deal**! | We hadden een **afspraak**! | **(DECISION PENDING)** | Afspraak (deal context — Tom's "Plan-rule" was for EN "Plan", not "deal") |
| ZooCapture | 30 | Wedgie | These the **donkeys**? | Dit de **ezels**? | Dit de **Ezels**? | Ezel cap |
| ZooCapture | 33 | Zookeeper Rose | I'm sorry **donkeys**. | Het spijt me **ezeltjes**. | Het spijt me **Ezeltjes**. | Ezel cap |

---

## E5_ZooMain_localization (5 cells)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| ZooMain | 125 | Smart Ass | This Zoo has fresh hay, nice Humans, no ugly **Machines**, and rigorous daily labour! | Deze Dierentuin heeft verse hooi, lieve Mensen, geen lelijke **Machines** en rigoreus dagdagelijks labeur! | Deze Dierentuin heeft verse hooi, lieve Mensen, geen lelijke **Machienen** en rigoreus dagdagelijks labeur! | Machines → Machienen |
| ZooMain | 199 | Smart Ass | And good luck to him finding another job without **Machines**! | En 't beste voor hem om een job zonder **Machines** te vinden! | En 't beste voor hem om een job zonder **Machienen** te vinden! | Machines → Machienen |
| ZooMain | 208 | Smart Ass | Good luck to him finding another job without **Machines**! | **t** Beste voor hem om een job zonder **Machines** te vinden! | **'t** Beste voor hem om een job zonder **Machienen** te vinden! | Combined: apostrophe + Machines |
| ZooMain | 216 | Kick Ass | WHAT?! You're as clunky as a **MACHINE**. | WAT?! Ge bent zo lomp als een **Machine**. | WAT?! Ge bent zo lomp als een **Machien**. | Machine → Machien (note: NL doesn't preserve EN ALL-CAPS; review separately) |
| ZooMain | 224 | Grandma Kulan | Thank you **donkey**! | Danku **ezeltje**! | Danku **Ezeltje**! | Ezel cap |

---

## E5_Zoo_Introduction_localizatio (0 cells)

✓ Clean.

---

## Notes on E5

### Categories scanned (full list applied)

**Active hits:**
- ✅ #1 Pronoun register — 0 strict drift (Mme. Derriere, Ringmaster, Slow Ass all clean — see verification below)
- ✅ #21 Ezel capitalization — 7 cells
- ✅ #24 Machine → Machien/Machienen — 5 cells
- ✅ #28 Idiom doekjes (today) — 1 cell ✅ ready
- ✅ #31 Pun preservation (aap-itude) — 2 cells decision-pending
- ✅ #32 Acte vs Nummer (board vs speech) — 7 cells decision-pending
- ✅ #35 Apostrophe drift — 1 cell (combined with Machine fix)
- ✅ Today: Nijg — 2 cells decision-pending
- ✅ Today: Afspraak (deal context J25) — 1 cell decision-pending

**Categories with zero hits in E5 (verified clean):**
- ✓ #4 Sturdy `, Kameraad` — 0 (Sturdy not in E5)
- ✓ #6 Old monikers (Schoon Beest / Felle Gast / Betweter) — 0
- ✓ #7 Bikkeharde — 0
- ✓ #8 Mechalen — 0
- ✓ #9 Muilegem — 0
- ✓ #10 MUILEBEEK — 0
- ✓ #11 Bar Poepegaatje — 0
- ✓ #12 Uncle Oom — 0
- ✓ #13 Boerderij — 0 (E5 doesn't reference Farm)
- ✓ #14 Vazal — 0
- ✓ #16 Slogan EZELS EERST — 0 in E5
- ✓ #17 Song of Ascension — 0 in E5
- ✓ #18 Hie/Haa — 0
- ✓ #19 Drunk word (Zatlap) — 0
- ✓ #25 Stenen-Spel — 0
- ✓ #26 Sad whimper — 0 drift
- ✓ #29 Inflection (Astraal/Astrale) — 0
- ✓ #33 Sturdy lament — 0 (Sturdy not in E5)
- ✓ Today: HUDO, Schup, Snotezel, Stampgast, Sloom — 0 in E5
- ✓ #44 *-Zak — 0
- ✓ #45 Parenthesised leak — 0
- ✓ #46 Bare EN names — 0

### Verification: codex-rejected name forms

Slow Ass naming in E5: **all 11 references use codex-correct `Slome` / `Slome Ezel`.** No `Sloom` instances in E5. ✓
Kick Ass naming: **all references use codex `Stamp Ezel`.** No `Stampgast` in E5. ✓
Sick Ass: codex `Snotje` used in stutter contexts; no `Snotezel` in E5. ✓

### Verification: Gemini's E5 register flags

Gemini flagged:
1. **Mme. Derriere u→U cap** (her J43) — Opus check finds **0 u/uw cells for Mme. Derriere in entire E5**. Either Gemini's cell ref was wrong, or the cell has been altered post-Gemini.
2. **Ringmaster Retcon** (J136 `uw → je`) — Opus check finds **0 uw cells for Ringmaster in E5**. Same as above; cannot reproduce.

→ Both Gemini retcon entries appear to be inapplicable. **Drop both from the Gemini E5 audit.**

### Decisions pending in E5 (11 cells across 4 buckets)

1. **Acte vs Nummer** (7 cells) — board=NUMMER, speech=actes; pick one or keep distinction.
2. **aap-itude pun** (2 cells, J69 + J81) — current Dutch is awkward; alternative needed or full rework.
3. **Nijg replacement** (2 cells, J167 + J176) — same EN, identical NL with `nijg` intensifier.
4. **Afspraak / deal** (1 cell, ZooCapture J25) — EN says "deal", current NL "afspraak" — apply Plan-rule or keep "afspraak" since EN ≠ "Plan"?

### Side flag (not in master list)

**E5_CircusMain J217**: NL has lowercase `robots`; EN has capitalized `Robots`. Out of scope for current 46-category list but worth a one-cell tweak: `robots` → `Robots`.

### Reconciliation with Gemini's E5 audit

Gemini's E5 had:
- Machine fixes ✓ (matches Opus 5)
- Ezel cap ✓ (matches Opus 7)
- "Stamp Ezel" → "Stampgast" — **REJECTED** by Opus per codex
- "Slome" → "Sloom" — **REJECTED** per codex
- Mme. Derriere u→U — **NOT REPRODUCIBLE** in current xlsx
- Ringmaster retcon — **NOT REPRODUCIBLE** in current xlsx
- doekjes idiom — Gemini missed; Opus catches per today's feedback
- Nijg — Gemini missed; Opus catches per today's feedback
- aap-itude — Gemini missed
- Acte/Nummer split — Gemini missed
- Afspraak deal — Gemini missed

**Net: Opus catches 13 cells Gemini missed (4 categories of new decisions); Opus rejects 2-3 Gemini proposals.**

---

**Total E5 cells flagged: 26 unique** (27 issues incl. combined). 11 decision-pending across 4 buckets (Acte/Nummer, aap-itude, Nijg, Afspraak/deal). The other 15 are mechanical sweeps (Ezel cap + Machien).
