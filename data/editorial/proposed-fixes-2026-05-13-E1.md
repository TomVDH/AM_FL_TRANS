# E1 batch — full source + remote read + proposed fix

_Read at: 2026-05-12 21:01:09 PDT (live remote, throttled)_
_Spreadsheet: `1_asses.masses_E1Proxy` (id `1TTUN6f_DACWw2VFxPP5sBbzKSMvpMZrG8XTsqcpw0SU`)_
_Cells in batch: 22 • Fixes encoded: 22_

For each cell: live remote read (cols A/B/C/J) + drift identification + proposed NL replacement string.

**Note:** J67 + J69 (TheProtest) already retconned via slogan batch 2026-05-13 — they will short-circuit on pre-image check in the apply step.

## E1_FarmHouseInt_localization

### J5

- **Drift:** duplicate \`het het\` `mechanical`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `SAY.Dialog:Radio.7.Radio Host Marcos`
- **Desc (col B):** `∅`
- **EN (col C):**   `Tell us... what is the secret to your success?`
- **Current NL (col J, live remote):**
    `Vertel ons eens... wat is het het geheim van je succes?`
- **Proposed NL:**
    `Vertel ons eens... wat is het geheim van je succes?`

### J7

- **Drift:** broken syntax \`en dat aan een product\` `[VERIFY]`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `SAY.Dialog:Radio.5.Mme. Derriere`
- **Desc (col B):** `∅`
- **EN (col C):**   `One must embrace the hustle and bustle, but also have a product that changes lives.`
- **Current NL (col J, live remote):**
    `We moeten bereid zijn hard te werken, en dat aan een product dat levens verandert.`
- **Proposed NL:**
    `We moeten bereid zijn hard te werken, en ook een product hebben dat levens verandert.`
- **Note:** Restores parallel structure. Verify phrasing fits Mme. Derrière voice.

### J14

- **Drift:** \`iedereen\` (3sg) takes \`zal halen\` not \`zullen halen\` `mechanical`
- **Canon:** `Dutch agreement`
- **Key (col A):**  `SAY.Dialog:Radio.33.Mme. Derriere`
- **Desc (col B):** `∅`
- **EN (col C):**   `Yes that's our bestseller! I believe that EVERYONE can use this product and reap the benefits.`
- **Current NL (col J, live remote):**
    `Onze best-seller! Ik denk dat iedereen de voordelen uit deze producten zullen halen.`
- **Proposed NL:**
    `Onze best-seller! Ik denk dat iedereen de voordelen uit deze producten zal halen.`

## E1_Farm_localization

### J17

- **Drift:** \`mensen\` lowercase + broken \`ergens in naar het dorp\` `mechanical`
- **Canon:** `§7.3 + Dutch grammar`
- **Key (col A):**  `SAY.Dialog: Farmer'sHouse.7.Trusty Ass`
- **Desc (col B):** `Interactable Object.`
- **EN (col C):**   `The Truck-Machine is gone. The Humans must be in the Village.`
- **Current NL (col J, live remote):**
    `De Camion-Machine is weg. De mensen moeten ergens in naar het dorp zijn.`
- **Proposed NL:**
    `De Camion-Machine is weg. De Mensen moeten ergens in het dorp zijn.`

### J39

- **Drift:** game-system Protest lowercase (with stutter prefix) `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:SlowWoodQuest.4.Slow Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `I've run out of wood and need more to finish fixing the b-bridge b-before the P-Protest.`
- **Current NL (col J, live remote):**
    `Ik z-z-zit zonder hout en ik heb meer nodig om het b-b-bruggetje te repareren voor het p-p-protest.`
- **Proposed NL:**
    `Ik z-z-zit zonder hout en ik heb meer nodig om het b-b-bruggetje te repareren voor het P-P-Protest.`

### J59

- **Drift:** game-system Protest lowercase `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:HARD_BoostMorale.6.Hard Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `We Miners have decided to join Old Ass's Protest.`
- **Current NL (col J, live remote):**
    `De Mijn-Ezels hebben beslist om het protest van Oude Ezel te vervoegen.`
- **Proposed NL:**
    `De Mijn-Ezels hebben beslist om het Protest van Oude Ezel te vervoegen.`

### J60

- **Drift:** \`ziel\` lowercase — game-systemic Ziel per §7.3 `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:HARD_BoostMorale.5.Hard Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Nothing we do tomorrow will send Comrade Lazy's Soul to the Astral Plane.`
- **Current NL (col J, live remote):**
    `Niets wat we morgen uithalen zal de ziel van wijlen Luie Ezel naar het Astrale Hiernamaals brengen.`
- **Proposed NL:**
    `Niets wat we morgen uithalen zal de Ziel van wijlen Luie Ezel naar het Astrale Hiernamaals brengen.`

### J94

- **Drift:** duplicate \`toch toch\` + \`jobs\` lowercase (pre-uprising = game-system Job) `mechanical`
- **Canon:** `§6.16 + grammar`
- **Key (col A):**  `SAY.Dialog:Bad_Aft.9.Bad Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `But you can't just demand your fucking jobs back.`
- **Current NL (col J, live remote):**
    `Maar ge kunt toch verdomme toch niet zomaar jullie jobs terug eisen.`
- **Proposed NL:**
    `Maar ge kunt verdomme toch niet zomaar jullie Jobs terug eisen.`

### J102

- **Drift:** \`richting\` mistranslation (EN: \`value\` → NL must be \`waarde\`, not \`direction\`) `mechanical`
- **Canon:** `§13 mistranslation`
- **Key (col A):**  `SAY.Dialog:Bad_Aft.18.Bad Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Your concept of value and self-worth cannot and should not be defined by backward Humans from Bumpkin Village.`
- **Current NL (col J, live remote):**
    `Jullie idee van richting en eigenwaarde zou niet, en moet niet, worden bepaald door de averechtse Mensen van Klotegem.`
- **Proposed NL:**
    `Jullie idee van waarde en eigenwaarde zou niet, en moet niet, worden bepaald door de averechtse Mensen van Klotegem.`

## E1_RedFields_localization

### J13

- **Drift:** §12.4 — \`Feel The Love!\` left in English `[VERIFY]`
- **Canon:** `§12.4`
- **Key (col A):**  `SAY.Dialog:PreMateChosen.11.Happy Ass`
- **Desc (col B):** `End of dialogue and into the sex rhythm game.`
- **EN (col C):**   `Follow your instincts and feel the love!`
- **Current NL (col J, live remote):**
    `Volg je instinct en Feel The Love!`
- **Proposed NL:**
    `Volg je instinct en voel de liefde!`
- **Note:** Alternates: voel de liefde / volg de liefde / laat je leiden door de liefde

## E1_Stable1F_localization

### J8

- **Drift:** broken: \`dat\`-clause uses \`te\`-infinitive instead of finite verb `mechanical`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `SAY.Dialog: 1_OldAss_StartGame.16.Old Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `It is high time the Humans remember how useful we've always been.`
- **Current NL (col J, live remote):**
    `Het is hoog tijd dat we de Mensen er aan te herinneren hoe belangrijk en nuttig wij voor hen zijn geweest.`
- **Proposed NL:**
    `Het is hoog tijd dat we de Mensen eraan herinneren hoe belangrijk en nuttig wij voor hen zijn geweest.`

### J10

- **Drift:** \`alleréérste\` non-standard accent — Dutch is \`allereerste\` `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `SAY.Dialog: 1_OldAss_StartGame.22.Old Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Tomorrow we will make history with our very first PROTEST.`
- **Current NL (col J, live remote):**
    `Morgen schrijven we geschiedenis met onze alleréérste PROTEST.`
- **Proposed NL:**
    `Morgen schrijven we geschiedenis met onze allereerste PROTEST.`

### J11

- **Drift:** \`een goed moraal\` — \`moraal\` is de-word, takes \`goede\` `mechanical`
- **Canon:** `Dutch adj-gender agreement`
- **Key (col A):**  `SAY.Dialog: 1_OldAss_StartGame.13.Old Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Now young Comrade, good group morale is instrumental to a Protest.`
- **Current NL (col J, live remote):**
    `Jonge Kameraad, een goed moraal binnen onze ploeg is cruciaal voor een Protest.`
- **Proposed NL:**
    `Jonge Kameraad, een goede moraal binnen onze ploeg is cruciaal voor een Protest.`

## E1_Stable2F_localization

### J22

- **Drift:** \`mensen\` lowercase — §7.3 Mensen cap `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:Dawn.18.Old Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `The Humans... they came to get me in the night.`
- **Current NL (col J, live remote):**
    `De mensen... ze zijn me komen pakken in 't donker...`
- **Proposed NL:**
    `De Mensen... ze zijn me komen pakken in 't donker...`

## E1_TheProtest_localization

### J21

- **Drift:** \`mensen\` lowercase `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:PickUpNice.6.Nice Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Gosh, the Humans wouldn't do that, would they?`
- **Current NL (col J, live remote):**
    `Goh, zouden de mensen dat echt doen?`
- **Proposed NL:**
    `Goh, zouden de Mensen dat echt doen?`

### J22

- **Drift:** \`mensen\` lowercase `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `MENU.Dialog:PickUpNice.7`
- **Desc (col B):** `∅`
- **EN (col C):**   `Assure Nice Ass that the Humans must have made a mistake.`
- **Current NL (col J, live remote):**
    `Verzeker Lieve Ezel dat de mensen mogelijk een foutje gemaakt hebben.`
- **Proposed NL:**
    `Verzeker Lieve Ezel dat de Mensen mogelijk een foutje gemaakt hebben.`

### J23

- **Drift:** \`mensen\` lowercase `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `MENU.Dialog:PickUpNice.21`
- **Desc (col B):** `∅`
- **EN (col C):**   `Tell Nice Ass that the Humans have been corrupted by the Machines.`
- **Current NL (col J, live remote):**
    `Zeg aan Lieve Ezel dat de mensen zijn verdorven door de Machines.`
- **Proposed NL:**
    `Zeg aan Lieve Ezel dat de Mensen zijn verdorven door de Machines.`

### J39

- **Drift:** \`niet een leider\` direct EN calque — Dutch idiom is \`geen leider\` `mechanical`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `SAY.Dialog:PickUpSmart.29.Smart Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `No offence Trusty, but you're a listener not a leader!`
- **Current NL (col J, live remote):**
    `Begrijp me niet verkeerd Trouwe, maar jij bent een luisteraar, niet een leider.`
- **Proposed NL:**
    `Begrijp me niet verkeerd Trouwe, maar jij bent een luisteraar, geen leider.`

### J61

- **Drift:** \`ruggegraat\` non-standard — modern Dutch is \`ruggengraat\` `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `SAY.Dialog:3_Dialog: HesitationAtGate.10.Big Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Asses have always been the backbone of this Farm since time immemorial.`
- **Current NL (col J, live remote):**
    `Ezels zijn altijd al de ruggegraat van deze Hoeve geweest, sinds de dieren konden spreken.`
- **Proposed NL:**
    `Ezels zijn altijd al de ruggengraat van deze Hoeve geweest, sinds de dieren konden spreken.`

### J67

- **Drift:** ALREADY RETCONNED via slogan batch (2026-05-13) `[already-applied]`
- **Canon:** `§14.1.1`
- **Key (col A):**  `MENU.Dialog:3_Dialog: HesitationAtGate.29`
- **Desc (col B):** `∅`
- **EN (col C):**   `Old Ass died saying: "Show the world the power of the Ass!"`
- **Current NL (col J, live remote):**
    `"Herinner de Wereld aan de Belangen van de Ezels" waren Oude Ezels laatste woorden.`
- **Proposed NL:** _no change — cell already at canonical form_
- **Note:** Will short-circuit on pre-image check (already at canonical form).

### J69

- **Drift:** ALREADY RETCONNED via slogan batch (2026-05-13) `[already-applied]`
- **Canon:** `§14.1.1`
- **Key (col A):**  `SAY.Dialog:3_Dialog: HesitationAtGate.130.Trusty Ass`
- **Desc (col B):** `If Last Words ASS POWER`
- **EN (col C):**   `Old Ass died saying: "Show the world the power of the Ass!"`
- **Current NL (col J, live remote):**
    `"Herinner de Wereld aan de Belangen van de Ezels" waren Oude Ezels laatste woorden.`
- **Proposed NL:** _no change — cell already at canonical form_
- **Note:** Will short-circuit on pre-image check (already at canonical form).

### J147

- **Drift:** \`gëinspireerd\` — diaeresis on wrong vowel; standard is \`geïnspireerd\` (on i) `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `MENU.Dialog: WellScene.85`
- **Desc (col B):** `∅`
- **EN (col C):**   `Solemnly assume the Traditional Ass Posture that has inspired Herds for generations.`
- **Current NL (col J, live remote):**
    `Neem plechtig de Traditionele Ezelshouding aan, die generaties aan Kuddes heeft gëinspireerd.`
- **Proposed NL:**
    `Neem plechtig de Traditionele Ezelshouding aan, die generaties aan Kuddes heeft geïnspireerd.`

---

**Total cells: 22** (incl. 2 already-applied via slogan retcon)

## Sign-off shape

- `all` — apply all 22 (J67/J69 will short-circuit as already-applied; 20 actual writes)
- `mechanical only` — apply 18, defer 2 `[VERIFY]` (J7, J13 RedFields)
- per-cell push-back — quote `J<row>` with your alternate fix
