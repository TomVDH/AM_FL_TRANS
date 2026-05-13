# E2 batch — full source + remote read + proposed fix

_Read at: 2026-05-12 21:15:14 PDT (live remote, throttled)_
_Spreadsheet: `2_asses.masses_E2Proxy` (id `14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow`)_
_Cells in batch: 15 • Fixes encoded: 15_

## E2_BattleButte_localization

### J17

- **Drift:** wrong auxiliary verb — \`verliezen\` takes \`hebben\`, not \`zijn\` `mechanical`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `WRITE.DialogContainer.48`
- **Desc (col B):** `Enemy dialogue.`
- **EN (col C):**   `Haven't I lost enough already?`
- **Current NL (col J, live remote):**
    `Ben ik al niet genoeg verloren?`
- **Proposed NL:**
    `Heb ik al niet genoeg verloren?`

### J22

- **Drift:** cross-sheet inconsistency — BattleMiner J17 uses \`Wat is je reactie?\` for the same EN `[VERIFY]`
- **Canon:** `§6.7 cross-sheet consistency`
- **Key (col A):**  `WRITE.DialogContainer.9`
- **Desc (col B):** `Battle text.`
- **EN (col C):**   `How will you respond?`
- **Current NL (col J, live remote):**
    `Hoe reageer je?`
- **Proposed NL:**
    `Wat is je reactie?`
- **Note:** Unifies with E2_BattleMiner J17. Alternate: change BattleMiner J17 to `Hoe reageer je?` instead.

### J28

- **Drift:** spelling typo \`ANN\` → \`AAN\` `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `WRITE.DialogContainer.20`
- **Desc (col B):** `∅`
- **EN (col C):**   `You Tackle!`
- **Current NL (col J, live remote):**
    `Je VALT ANN!`
- **Proposed NL:**
    `Je VALT AAN!`

## E2_ChildsHouse_localization

### J8

- **Drift:** §5.4 ge/gij imperative \`Stop\`→\`Stopt\` + remove non-idiomatic \`te\` after \`met\` `mechanical`
- **Canon:** `§5.4 + Dutch idiom`
- **Key (col A):**  `SAY.Dialog:Child.16.Child Joey`
- **Desc (col B):** `Hard Ass has a traumatic flash back of seeing a Miner be crushed during a cave in.`
- **EN (col C):**   `Hey! Don't just stand there!`
- **Current NL (col J, live remote):**
    `Hé! Stop met te lanterfanten!`
- **Proposed NL:**
    `Hé! Stopt met lanterfanten!`

### J16

- **Drift:** §12.4 — \`Please!\` left in English `[VERIFY]`
- **Canon:** `§12.4`
- **Key (col A):**  `SAY.Dialog:Child.47.Child Joey`
- **Desc (col B):** `The child dies.`
- **EN (col C):**   `Please! SAVE ME!`
- **Current NL (col J, live remote):**
    `Please! HELP MIJ!`
- **Proposed NL:**
    `Alstublieft! HELP MIJ!`
- **Note:** Alternates: `Alsjeblieft! HELP MIJ!` (informal) / `HELP MIJ ALSTUBLIEFT!` (reorder)

## E2_World_A1_localization

### J20

- **Drift:** tense mismatch + §12.4 \`soft\` English — EN past tense, spec hints "opposite of Hard" `[VERIFY]`
- **Canon:** `Dutch tense + §12.4`
- **Key (col A):**  `SAY.Dialog:Opening.11.Hard Ass`
- **Desc (col B):** `Soft should be opposite of Hard's name if possible`
- **EN (col C):**   `Old Ass and Trusty Ass were not cut out for the role of leader. They were too soft.`
- **Current NL (col J, live remote):**
    `Oude Ezel en Trouwe Ezel waren niet geschikt voor het leiderschap. Ze zijn te soft.`
- **Proposed NL:**
    `Oude Ezel en Trouwe Ezel waren niet geschikt voor het leiderschap. Ze waren te zacht.`
- **Note:** Restores past tense + drops English `soft`. Spec hint: opposite of `Bikkelharde` — alternates: `te slap` / `te week`.

### J23

- **Drift:** game-system Plan lowercase (with stutter) `mechanical`
- **Canon:** `§6.9/§7.3`
- **Key (col A):**  `SAY.Dialog:Opening.21.Slow Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `*sniff* Is there a P-Plan C?`
- **Current NL (col J, live remote):**
    `*snuf snuf* Is er dan een p-p-plan C?`
- **Proposed NL:**
    `*snuf snuf* Is er dan een P-P-Plan C?`

### J35

- **Drift:** duplicate \`ze\` — \`Ze zullen ze schoon gesjareld zijn\` has redundant object pronoun `mechanical`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `SAY.Dialog:Opening.94.Thirsty Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `And the others! They'll be in a mighty pickle if we don't git there in time!`
- **Current NL (col J, live remote):**
    `En d'anderen! Ze zullen ze schoon gesjareld zijn als we daar niet op tijd zijn, héé!`
- **Proposed NL:**
    `En d'anderen! Ze zullen schoon gesjareld zijn als we daar niet op tijd zijn, héé!`

### J39

- **Drift:** incomplete idiom — \`Machines te laten\` should be \`Machines achter te laten\` (give up / leave behind) `mechanical`
- **Canon:** `Dutch idiom`
- **Key (col A):**  `SAY.Dialog:Opening.24.Smart Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `THREE, the rest of us get water from the river, put out the fire, convince the Humans to give up their Machines...`
- **Current NL (col J, live remote):**
    `DRIE, de rest moet water uit de rivier scheppen, het vuur blussen en de Mensen overtuigen om de Machines te laten...`
- **Proposed NL:**
    `DRIE, de rest moet water uit de rivier scheppen, het vuur blussen en de Mensen overtuigen om de Machines achter te laten...`

### J53

- **Drift:** semantic absolutization — EN: "this isn't the way" (path is wrong); NL: "there is no way at all" (too strong) `[VERIFY]`
- **Canon:** `§13 mistranslation`
- **Key (col A):**  `SAY.Dialog:SmokeMustBeGettingToMe_STARTOFF.1.Nice Ass`
- **Desc (col B):** `If Nice Ass goes the wrong way.`
- **EN (col C):**   `Golly, the smoke must be getting to me. This isn't the way to the Farm at all.`
- **Current NL (col J, live remote):**
    `Oesje, de rook is te dik. Er is geen enkele weg naar de Hoeve.`
- **Proposed NL:**
    `Oesje, de rook is te dik. Dit is helemaal niet de weg naar de Hoeve.`
- **Note:** Push-confirmed with rule "Boerderij → de Hoeve" — only Boerderij→Hoeve was fixed; the semantic-absolutization drift is separate. Alternate: `Dit is niet eens de weg naar de Hoeve.`

### J54

- **Drift:** duplicate of J53 — same EN, same NL, same fix `[VERIFY]`
- **Canon:** `§13 mistranslation`
- **Key (col A):**  `SAY.Dialog:FarmHouse.1.Nice Ass`
- **Desc (col B):** `If Nice Ass goes the wrong way.`
- **EN (col C):**   `Golly, the smoke must be getting to me. This isn't the way to the Farm at all.`
- **Current NL (col J, live remote):**
    `Oesje, de rook is te dik. Er is geen enkele weg naar de Hoeve.`
- **Proposed NL:**
    `Oesje, de rook is te dik. Dit is helemaal niet de weg naar de Hoeve.`
- **Note:** Mirror of J53.

## E2_World_A2_localization

### J15

- **Drift:** §12.4 — English article \`The\` instead of Dutch \`De\` `mechanical`
- **Canon:** `§12.4`
- **Key (col A):**  `SAY.Dialog:A_Dialog.1.Nice Ass`
- **Desc (col B):** `The camera fades up from black and we see Nice Ass with her plow, just outside the Fannyside Farm.`
- **EN (col C):**   `The Herd is counting on me! Yuppers, this is what I've been training for!`
- **Current NL (col J, live remote):**
    `The Kudde rekent op mij! Ja, ja — dit is waar ik voor geoefend heb.`
- **Proposed NL:**
    `De Kudde rekent op mij! Ja, ja — dit is waar ik voor geoefend heb.`

## E2_World_A3_localization

### J3

- **Drift:** missing article \`een\` before \`teken\` `mechanical`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `SAY.Dialog:Finale.2.Nice Ass`
- **Desc (col B):** `Nice Ass consoles Sad Ass as the rain starts to put out the fire.`
- **EN (col C):**   `Sad Ass, this rain is a sign that we can start again!`
- **Current NL (col J, live remote):**
    `Triestige, deze regen is teken dat we terug opnieuw kunnen starten!`
- **Proposed NL:**
    `Triestige, deze regen is een teken dat we terug opnieuw kunnen starten!`

## E2_World_B1_localization

### J25

- **Drift:** typo \`We\` (= 1pl pron) should be \`Wie\` (= who, interrogative) `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `SAY.Dialog:B1_MainDialog.5.Smart Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Who will trim our Hooves?`
- **Current NL (col J, live remote):**
    `We gaat er onze Hoeven kuisen?`
- **Proposed NL:**
    `Wie gaat er onze Hoeven kuisen?`

### J39

- **Drift:** §7.3 Mensen cap + truncated idiom \`Machines zo te laten\` → \`Machines achter te laten\` `mechanical`
- **Canon:** `§7.3 + Dutch idiom`
- **Key (col A):**  `SAY.Dialog:B1_MainDialog.61.Smart Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `THREE, the rest of us get water from the river, put out the fire, convince the Humans to give up their Machines...`
- **Current NL (col J, live remote):**
    `DRIE, de rest gaat water van de rivier halen, blust het vuur en overtuigt de mensen hun Machines zo te laten...`
- **Proposed NL:**
    `DRIE, de rest gaat water van de rivier halen, blust het vuur en overtuigt de Mensen hun Machines achter te laten...`

---

**Total cells: 15**

## Sign-off shape

- `all` — apply 15
- `mechanical only` — apply 10, defer 5 `[VERIFY]` (J22/J16 ChildsHouse, J20/J53/J54 World_A1)
- per-cell — quote `J<row>` to override or skip