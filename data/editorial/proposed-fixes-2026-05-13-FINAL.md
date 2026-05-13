# FINAL batch — combined deep-eyeball + audit residuals

_Read at: 2026-05-12 22:23:26 PDT (live remote, throttled — 7 spreadsheets)_
_Cells in batch: 15_

**Scope:**
- 10 deep-eyeball DRIFT cells closing the queue (E7×5, E0×2, E8×2, E9×1)
- 5 audit-residual cells (post-batch regex finds NOT in deep-eyeball): E2 J25 §5.4, E5 J208 §9.1, E6_Nightmare J63/J70/J71 §10.7+§9.1+§7.1

**Excluded — verify-only / known-skip (NOT in this batch, mentioned for completeness):**
- Schoon Beest §4.4 PUSHED-BEFORE × 3 (E1 J29, E2 J46, E4 J62) — canonical, no action
- Sturdy motto §12.2 fragments × 7 (E6 J142 + E9 J18/J19/J20/J21/J43/J68) — speaker-fragmented intentional reveals, all verify
- E3 §9.6 diary contracted × 2 (E3_100 J3 + E3_300 J7) — false-positive (rule applies to WRITE.Dialog journals, those are SAY.Dialog)

**Workflow note:** Combined propose doc. Apply/push/audit/commit cycles will be done per-episode afterward (E7/E0/E8/E9 separate; residuals merge into their original-episode push-log sections).

---

# E0

_Spreadsheet: `0_asses.masses_Manager+Intermissions+E0Proxy` (id `1ScGhva1rUcwqup5rWjePK43gnvxME4mVgZvPZlIfWHQ`)_

## CharacterProfiles_localization

### J81

- **Drift:** adj-form typo — \`Groffe\` (double-f) should be \`Grove\` (female form of \`Grof\`, one v not two f) `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `CHARACTER.Blunt Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Blunt Ass`
- **Current NL (col J, live remote):**
    `Groffe Ezel`
- **Proposed NL:**
    `Grove Ezel`
- **Note:** Character profile EN `Blunt Ass` → NL `Grove Ezel`. (`Grof` masc → `Grove` fem-adj-e ending.)

### J95

- **Drift:** multi-issue: spelling \`Excema\` not Dutch + semantic shift — Chafed ≠ eczema specifically `[VERIFY]`
- **Canon:** `Dutch spelling + §13 mistranslation`
- **Key (col A):**  `CHARACTER.Chafed Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Chafed Ass`
- **Current NL (col J, live remote):**
    `Excema Ezel`
- **Proposed NL:**
    `Ontvelde Ezel`
- **Note:** EN `Chafed Ass` = irritated/sore-from-rubbing. NL `Excema` is misspelling of `Eczeem` (eczema-skin-condition), and semantically wrong (chafed ≠ eczema). Options:
   - `Ontvelde Ezel` (default — "skinned/sore", closest to chafed)
   - `Geïrriteerde Ezel` (broader — "irritated")
   - `Schuurde Ezel` (literal — "rubbed/chafed")
   - `Eczeem Ezel` (just fix the spelling, keep semantic shift)
   **Tom call: which form?** Default: `Ontvelde Ezel`.

---

# E2

_Spreadsheet: `2_asses.masses_E2Proxy` (id `14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow`)_

## E2_World_A1_localization

### J25

- **Drift:** §5.4 ge/gij imperative — bare-stem \`Stop\` should be stem+t \`Stopt\` (next clause uses \`zijt GIJ\` confirming ge/gij register) `mechanical`
- **Canon:** `§5.4`
- **Key (col A):**  `SAY.Dialog:Opening.92.Hard Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Stop. Who made YOU the leader?`
- **Current NL (col J, live remote):**
    `Stop. Sinds wanneer zijt GIJ de baas?`
- **Proposed NL:**
    `Stopt. Sinds wanneer zijt GIJ de baas?`
- **Note:** Hard Ass speaker (ge/gij). Caught by regex audit post-E2-push — NEW finding, not in deep-eyeball.

---

# E5

_Spreadsheet: `5_asses.masses_E5Proxy` (id `1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E`)_

## E5_ZooMain_localization

### J208

- **Drift:** §9.1 missing apostrophe at start: \`t Beste\` → \`'t Beste\` `mechanical`
- **Canon:** `§9.1`
- **Key (col A):**  `SAY.Dialog:Day7.144.Smart Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Good luck to him finding another job without Machines!`
- **Current NL (col J, live remote):**
    `t Beste voor hem om een job zonder Machines te vinden!`
- **Proposed NL:**
    `'t Beste voor hem om een job zonder Machines te vinden!`
- **Note:** Smart Ass speaker. Caught by regex audit post-E5-push — NEW finding, not in deep-eyeball.

---

# E6

_Spreadsheet: `6_asses.masses_E6Proxy` (id `1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU`)_

## E6_Nightmare_localization

### J63

- **Drift:** §10.7 Thirsty Flemish diminutive — \`slokje\` (std-Dutch) should be \`slokske\` (Flemish) `mechanical`
- **Canon:** `§10.7`
- **Key (col A):**  `SAY.Dialog_Thirsty.43.`
- **Desc (col B):** `This dialogue is in the wrong scene. CUT.`
- **EN (col C):**   `Mosey on over and take a sip of my new drink special: The Pail Ale!`
- **Current NL (col J, live remote):**
    `Kom d'r maar naartoe gesjokt en neem een slokje van m'n nieuwe drankspecialiteit: de Emmer Ale!`
- **Proposed NL:**
    `Kom d'r maar naartoe gesjokt en neem een slokske van m'n nieuwe drankspecialiteit: de Emmer Ale!`
- **Note:** Thirsty Ass in Hard's nightmare. Caught by regex audit post-E6-push — NEW finding, not in deep-eyeball.

### J70

- **Drift:** §10.7 \`slokkie\` → \`slokske\` + §9.1 \`t Is\` → \`'t Is\` (two fixes in one cell) `[VERIFY]`
- **Canon:** `§10.7 + §9.1`
- **Key (col A):**  `SAY.Dialog_Thirsty.50.`
- **Desc (col B):** `This dialogue is in the wrong scene. CUT.`
- **EN (col C):**   `Always been my darn DREAM to have a place for us Asses to take a break and share some good 'ol water.`
- **Current NL (col J, live remote):**
    `t Is altijd al m'n verdomde DROOM geweest om een plek te hebben waar wij Ezels even op adem kunnen komen en samen lekker een slokkie water kunnen delen.`
- **Proposed NL:**
    `'t Is altijd al m'n verdomde DROOM geweest om een plek te hebben waar wij Ezels even op adem kunnen komen en samen lekker een slokske water kunnen delen.`
- **Note:** Thirsty Ass in Hard's nightmare. Same EN as E6_World J197 (Tom-overridden to truncated form without `share some good 'ol water`). This Nightmare version is full-length with both EN sub-clauses. **Tom call: keep full-length here (apply both §10.7/§9.1 fixes — default) or truncate to match World J197?** Default: keep full-length, fix the two flagged rules.

### J71

- **Drift:** §10.7 \`slokkie\` → \`slokske\` + §7.1 \`ezel\` cap-mid-sentence verify `[VERIFY]`
- **Canon:** `§10.7 + §7.1`
- **Key (col A):**  `SAY.Dialog_Thirsty.51.`
- **Desc (col B):** `This dialogue is in the wrong scene. CUT.`
- **EN (col C):**   `I could definitely use a drink and an ear to bend.`
- **Current NL (col J, live remote):**
    `Ik kan zeker wel een slokkie gebruiken en een ezel om z'n oor te kauwen.`
- **Proposed NL:**
    `Ik kan zeker wel een slokske gebruiken en een ezel om z'n oor te kauwen.`
- **Note:** Thirsty Ass. `een ezel om z'n oor te kauwen` — used colloquially as "someone (=a guy) to gripe at", not the species term. §7.1 caps Ezel when referring to the species/proper noun. **Tom call: cap `Ezel` (species-style) or keep `ezel` lc (colloquial-generic)?** Default proposed: fix slokkie only, keep `ezel` lc.

---

# E7

_Spreadsheet: `7_asses.masses_E7Proxy` (id `1evCSy0b20NNb4mfndqDVtc-xtfZ_a7bmTm2lxlpSuYA`)_

## E7_Chilling_localization

### J5

- **Drift:** canon §14.2.1 compound mangled — \`ezelenhemelvaartszangderzielen\` (all-lc no-hyphens single mega-compound) should be \`Hemelvaarts-zang-der-Ezel-zielen\` (article + cap + hyphens) `mechanical`
- **Canon:** `§14.2.1`
- **Key (col A):**  `SAY.Dialog:Ending.92.Big Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Wait. We should sing the Song of Ascension for our Comrades before we leave.`
- **Current NL (col J, live remote):**
    `Wacht. Voor we vertrekken moeten we de ezelenhemelvaartszangderzielen zingen voor onze Kameraden.`
- **Proposed NL:**
    `Wacht. Voor we vertrekken moeten we de Hemelvaarts-zang-der-Ezel-zielen zingen voor onze Kameraden.`

## E7_Holding1_localization

### J22

- **Drift:** ge/gij present 2nd-person — \`zij\` (= 3rd-pl/aux) should be \`zijt\` `mechanical`
- **Canon:** `§5.0 ge/gij`
- **Key (col A):**  `SAY.Dialog:Opening.99.Kick Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `@#$%&! Who are YOU?`
- **Current NL (col J, live remote):**
    `@#$%&! Wie zij GIJ?!`
- **Proposed NL:**
    `@#$%&! Wie zijt GIJ?!`
- **Note:** Kick Ass speaker (ge/gij register per codex).

## E7_MeatProcessing_localization

### J9

- **Drift:** cross-cell EN match J11 — same line, different NL: J9 \`toont\` vs J11 \`laat zien\` `[VERIFY]`
- **Canon:** `§6.7 cross-cell consistency`
- **Key (col A):**  `SAY.Dialog:SecondPassComplete.23.Smart Ass`
- **Desc (col B):** `This is said after Big Ass makes it to the exit and if Sad Ass is not in the group.`
- **EN (col C):**   `Time for the Ace Strategist to show everyone how it's done!`
- **Current NL (col J, live remote):**
    `Tijd dat de Meesterstrateeg iedereen toont hoe 't moet!`
- **Proposed NL:**
    `Tijd dat de Meesterstrateeg iedereen laat zien hoe 't moet!`
- **Note:** Smart Ass identical EN line in both cells (`Time for the Ace Strategist to show everyone how it's done!`). **Tom call: unify on `toont` (J9 current) or `laat zien` (J11 current)?** Default proposed: `laat zien` (unify J9 → J11 form).

### J11

- **Drift:** cross-cell EN match J9 — paired (no change if unifying to J11's \`laat zien\`) `[VERIFY]`
- **Canon:** `§6.7 cross-cell consistency`
- **Key (col A):**  `SAY.Dialog:ThirdPassComplete.8.Smart Ass`
- **Desc (col B):** `This is said after Sad Ass makes it to the exit.`
- **EN (col C):**   `Time for the Ace Strategist to show everyone how it's done!`
- **Current NL (col J, live remote):**
    `Tijd dat de Meesterstrateeg iedereen laat zien hoe 't moet!`
- **Proposed NL:** _no transform — keep current (verify-only)_
- **Note:** See J9 note. **Default: KEEP J11 (no change), apply J9 → `laat zien`.**

## E7_Skinning_localization

### J8

- **Drift:** Dutch spelling — \`electriciteit\` should be \`elektriciteit\` (k, not c) `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `SAY.Dialog:Opening.11.Smart Ass`
- **Desc (col B):** `Alternately, this is said if Sad is present.`
- **EN (col C):**   `Kick and Sad—cut the power!`
- **Current NL (col J, live remote):**
    `Stamp en Triestige—electriciteit UIT!`
- **Proposed NL:**
    `Stamp en Triestige—elektriciteit UIT!`

---

# E8

_Spreadsheet: `8_asses.masses_E8Proxy` (id `1mJjvrManB-mwN-2bawLltEeRoUTq-6ch9OW5_Zyu6v0`)_

## E8_TheGods_localization

### J7

- **Drift:** compound spacing — \`Ezel Zielen\` (two words) should be \`Ezel-Zielen\` (hyphenated per canon §14.2.1) `mechanical`
- **Canon:** `§14.2.1`
- **Key (col A):**  `SAY.Dialog:GODS.101.THE GODS`
- **Desc (col B):** `∅`
- **EN (col C):**   `This is the Holy Sanctum of H'ii where all Ass Souls undergo Reassignment.`
- **Current NL (col J, live remote):**
    `Dit is het Heiligdom van H'ii waar alle Ezel Zielen Heraanstelling ondergaan.`
- **Proposed NL:**
    `Dit is het Heiligdom van H'ii waar alle Ezel-Zielen Heraanstelling ondergaan.`

### J24

- **Drift:** multi-issue: adj-agreement \`goddelijk last\` → \`goddelijke last\` (de-word -e) + ungrammatical \`der dragen\` → \`te dragen\` `mechanical`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `SAY.Dialog:GODS.175.Haw`
- **Desc (col B):** `∅`
- **EN (col C):**   `As our godly burden is to carry the Universe upon our back, we cannot interfere in the Material World without putting all life at risk.`
- **Current NL (col J, live remote):**
    `Gezien onze goddelijk last der dragen van het Universum op onze rug, kunnen wij niet ingrijpen in de Materiële Wereld zonder al het leven in gevaar te brengen. `
- **Proposed NL:**
    `Gezien onze goddelijke last is het dragen van het Universum op onze rug, kunnen wij niet ingrijpen in de Materiële Wereld zonder al het leven in gevaar te brengen. `
- **Note:** EN: `As our godly burden is to carry the Universe...`. NL drops `is het` (copula + nominalization). Proposed: `onze goddelijke last is het dragen` restores both grammar and EN semantics. Alternates:
   - `onze goddelijke taak om te dragen` (using `taak` for `burden`)
   - `onze goddelijke plicht is het dragen` (`plicht` = duty)
   - `het onze goddelijke last is om te dragen` (re-order)
   Default keeps `last` as Tom's presumed translation choice.

---

# E9

_Spreadsheet: `9_asses.masses_E9Proxy` (id `1zG-g9HCyECCTzY3Yc-Un-K5I1DYAjvwD9GdHj7mle_c`)_

## E9_BadCave_localization

### J40

- **Drift:** game-name \`STENEN-SPEL\` non-canonical — should be \`KEIEN-SPEL\` `mechanical`
- **Canon:** `§8 game-system terms`
- **Key (col A):**  `SAY.Dialog:BadTransformation.340.Sturdy Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `I thought you were playing ROCKS with your UNCLE!`
- **Current NL (col J, live remote):**
    `Ik dacht dat je STENEN-SPEL aan 't spelen was met je NONKEL!`
- **Proposed NL:**
    `Ik dacht dat je KEIEN-SPEL aan 't spelen was met je NONKEL!`
- **Note:** Final occurrence of the cross-corpus Stenen-spel pattern (already fixed in E3_Mine1F + E6_BadCave + E10_Government). Closes §8 game-name canonicalization across all 11 workbooks.

---

**Total cells rendered: 15**

## Sign-off shape

- `all` — apply 10 mechanical + decisions on 5 verifies
- `mechanical only` — apply 10 mechanical, defer 5 verify
- per-cell — quote `E<N> J<row>` to override or skip

## Decisions needed (Tom)

1. **E7 MeatProcessing J9/J11 pair** — unify same-EN cells on `toont` (J9 current) or `laat zien` (J11 current)?
2. **E0 CharacterProfiles J95** Chafed Ass — `Ontvelde Ezel` (default) / `Geïrriteerde Ezel` / `Schuurde Ezel` / `Eczeem Ezel`?
3. **E8 TheGods J24** burden phrasing — `onze goddelijke last is het dragen` (default — restore copula+nominalization) / `onze goddelijke taak om te dragen` / other?
4. **E6 Nightmare J70** dream/bar speech — keep full-length (apply §10.7+§9.1 fixes only — default) or truncate to match Tom's World J197 override?
5. **E6 Nightmare J71** — cap `Ezel` (species-style) or keep `ezel` lc (colloquial-generic for "a guy to gripe at")?