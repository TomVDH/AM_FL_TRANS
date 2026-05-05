# Corpus scoping — fresh excels/ — am-fl-trans

Date: 2026-05-03
Total cells scanned: **4475**  (across 11 xlsx files)

Source-of-truth note: this report runs against `excels/*.xlsx` post-pull (i.e., current G Drive state as of 2026-05-03). Counts will inform sweep batch sizes for the decisions lock.

---

## A1. Place names

### Mechalen → Technopolis

NL hits per variant:
  - `Mechalen`: **30** cell(s)
  - `Mechalens`: **1** cell(s)
Total cells touching Mechalen variants: **31**

First 3 cells:
  - 10_asses.masses_E10Proxy.xlsx::E10_Government_localization!J6  spk=`Radio Host Marcos`
    EN: Mecha's Government building has been overrun by donkeys.
    NL: Het regeringsgebouw van Mechalen is overrompeld door ezels.
  - 10_asses.masses_E10Proxy.xlsx::E10_Government_localization!J12  spk=`Radio Host Marcos`
    EN: Up next, the #2 song on Mecha's Top 40! asi9 by David Mesiha.
    NL: En dan nu, de nummer 2 op Mechalens Top 40! van David Mesiha.
  - 10_asses.masses_E10Proxy.xlsx::E10_Government_localization!J12  spk=`Radio Host Marcos`
    EN: Up next, the #2 song on Mecha's Top 40! asi9 by David Mesiha.
    NL: En dan nu, de nummer 2 op Mechalens Top 40! van David Mesiha.

### Muilegem (region) → Muilenbeek

NL hits per variant:
  - `Muilegem`: **24** cell(s)
  - `MUILEBEEK`: **1** cell(s)
  - `Muilegemmers`: **1** cell(s)

### Klotegem (town — keep)

  - `Klotegem`: **3** cell(s)

### Poepegaatje → De Zatten Ezel

  - `Beschonken Ezel`: **10** cell(s)
  - `Poepegaatje`: **5** cell(s)

---

## A2. Character / role names

### Bikkeharde / Bikkelharde

  - `Bikkelharde`: **13** cell(s)
  - `Bikkeharde`: **3** cell(s)

**Action:** Any `Bikkeharde` (no L) → `Bikkelharde`.

### Asshandlers — EZELZEULER / Ezelzeuler / Ezenzeuler

  - `Ezelzeuler`: **2** cell(s)
  - `Zeno`: **2** cell(s)
  - `Zita`: **2** cell(s)

First 5 cells (any of these):
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::CharacterProfiles_localization!J29  spk=`Melvin`
    EN: Ass Handler Melvin
    NL: Ezelzeuler Zeno
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::CharacterProfiles_localization!J29  spk=`Melvin`
    EN: Ass Handler Melvin
    NL: Ezelzeuler Zeno
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::CharacterProfiles_localization!J30  spk=`Wedgie`
    EN: Ass Handler Wedgie
    NL: Ezelzeuler Zita
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::CharacterProfiles_localization!J30  spk=`Wedgie`
    EN: Ass Handler Wedgie
    NL: Ezelzeuler Zita
  - 10_asses.masses_E10Proxy.xlsx::E10_Credits_localization!J105  spk=`136`
    EN: Ass Handler Melvin
    NL: Zakkenzeuler Zeno

### Vassal / Vazal / Afgevaardige

  - NL `Vazal`: **16** cell(s)
  - EN `Vassal`: **16** cell(s)

### Constaterende / Constatatie Ezel (investigation)

**No occurrences found.** Term may not exist in corpus.

---

## A3. Game / object names

### Stenen-Spel → Keien-Spel

  - `Stenen-spel`: **10** cell(s)
  - `STENEN-SPEL`: **2** cell(s)

### Song of Ascension

  - NL `hemelvaartszang`: **7** cell(s)
  - NL `ezelenhemelvaartszangderzielen`: **5** cell(s)
  - EN `Song of Ascension`: **7** cell(s)

---

## A5. Term consistency

### Uncle: Nonkel default + Oom for Smart Ass only

NL `Nonkel`: **0** cell(s)
NL `Oom`:    **0** cell(s)

Nonkel by speaker (top 10):

Oom by speaker (top 10):

**Action:** All `Oom` cells where speaker ≠ Smart Ass → `Nonkel`. All `Nonkel` cells where speaker = Smart Ass → `Oom`.

### Hee/Haw → Hie/Haa

All variants:
  - `Hee Haw`: **0** cell(s)
  - `hee haw`: **0** cell(s)
  - `Hie Haa`: **0** cell(s)
  - `hie haa`: **0** cell(s)
  - `HIE`: **0** cell(s)
  - `HAA`: **0** cell(s)
  - `hee`: **29** cell(s)
  - `haw`: **17** cell(s)
  - `hie`: **0** cell(s)
  - `haa`: **0** cell(s)

### Farm / Stable

NL `Boerderij` (capitalized): **0** cell(s)
NL `boerderij` (lowercase): **0** cell(s)
NL `Hoeve` (capitalized): **0** cell(s)
NL `hoeve` (lowercase): **0** cell(s)
NL `Stal` (capitalized): **0** cell(s)
NL `stal` (lowercase): **0** cell(s)

### Ass Power slogan

  - `EZEL MACHT`: **7** cell(s)
  - `EZELKRACHT`: **2** cell(s)
  - `Ezel Macht`: **2** cell(s)
  - `EZELSKRACHT`: **1** cell(s)
  - `Ezelkracht`: **1** cell(s)

---

## A6. Machines — Machine vs Machien sweep

Word-boundary counts:

NL `Machine` (cap): **154** cell(s)
NL `Machines` (cap): **0** cell(s)
NL `machine` (low): **154** cell(s)
NL `machines` (low): **0** cell(s)
NL `Machien`: **0** cell(s)
NL `Machienen`: **0** cell(s)
NL `machien` (low): **0** cell(s)
NL `machienen` (low): **0** cell(s)

### Compounds (substring search):

  - `Tractor-Machine`: **10** cell(s)
  - `Piet-Machine`: **5** cell(s)
  - `Camion Machine`: **4** cell(s)
  - `Camion-Machine`: **3** cell(s)
  - `Auto-Machine`: **2** cell(s)

---

## A7. Sturdy lament canonical: `slechte, zielloze, werk-afpakkende, kind-dodende Machines`

Component variants found:
  - `kwaad`: **6** cell(s)
  - `zielloze`: **5** cell(s)
  - `slechte`: **5** cell(s)
  - `kind-dodende`: **3** cell(s)
  - `werk-afpakkende`: **2** cell(s)
  - `werk-stelende`: **1** cell(s)
  - `moordende`: **1** cell(s)
  - `kwaadaardige`: **1** cell(s)
  - `kwaadaardig`: **1** cell(s)
  - `baanafpakkende`: **1** cell(s)
  - `kindermoorddadige`: **1** cell(s)
  - `KWAADAARDIG`: **1** cell(s)

---

## A8. Sad whimper — `*Boe-hoe-hoe*` canonical

  - `*boe-hoe-hoe-hoe*`: **5** cell(s)
  - `*boehoehoehoe*`: **7** cell(s)
  - `*boehoehoe*`: **6** cell(s)
  - `*boe-hoe-hoe*`: **0** cell(s)
  - `*Boe-hoe-hoe*`: **0** cell(s)
  - `Boe-hoe-hoe`: **0** cell(s)
  - `boehoehoe`: **13** cell(s)
  - `boe-hoe-hoe`: **5** cell(s)

---

## A9. Ezel capitalization — lowercase `ezel(s)` mid-sentence

NL cells with lowercase `ezel(s/en)`: **57**
NL cells with capitalized `Ezel(s/en)`: **458**

First 5 lowercase cells:
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::CharacterProfiles_localization!J81  spk=`Blunt Ass`
    NL: Groffe ezel
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::CharacterProfiles_localization!J82  spk=`Peek Ass`
    NL: Constat-ezel
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::E0_Questions_localization!J67  spk=`98`
    NL: In het Oude Testament slaat een mens genaamd Balaam op zijn ezel wanneer plots:
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::E0_Questions_localization!J68  spk=`99`
    NL: Balaam slaat de ezel dood en moet een andere zoeken om het werk voor hem te doen
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::E0_Questions_localization!J69  spk=`100`
    NL: God geeft de ezel het vermogen om te spreken en de ezel smeekt Balaam om hem te sparen

---

## A10. 🚨 `, Kameraad` in NL but `, Comrade` not in EN — utmost priority

**Cells with NL Kameraad but no EN Comrade: 14**

First 15:
  - 10_asses.masses_E10Proxy.xlsx::E10_Government_localization!J145  spk=`Big Ass`
    EN: No Ass gets left behind.
    NL: Geen Ezel wordt achtergelaten, Kameraad.
  - 10_asses.masses_E10Proxy.xlsx::E10_ProphetSpeech_localization!J56  spk=`Cole-Machine`
    EN: Yet, all of us here, both Humans and donkeys, are rational beings.
    NL: Toch zijn wij hier allemaal, zowel Mensen als Ezels, rationele wezens, kameraaden.
  - 10_asses.masses_E10Proxy.xlsx::E10_ProphetSpeech_localization!J66  spk=`Cole-Machine`
    EN: Like you, these Asses think of themselves as intelligent animals.
    NL: Net als gij, kameraad, denken deze Ezels van zichzelf dat ze intelligente dieren zijn.
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J6  spk=`Sturdy Ass`
    EN: It's not like you to nod off at your post.
    NL: 't Is niks voor jou om in te dommelen op je post, Kameraad.
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J14  spk=`Sturdy Ass`
    EN: Uncle Hard can't abandon his post.
    NL: Oom Bikkehard kan zijn post niet verlaten, Kameraad.
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J15  spk=`Sturdy Ass`
    EN: The Humans are still trying to breach the Barricades and our Territory must be protected.
    NL: De Mensen proberen nog steeds de Barricades te doorbreken en ons Territorium moet beschermd worden, Kameraad.
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J33  spk=`Sturdy Ass`
    EN: Which way should we go?
    NL: Welke weg moeten we nemen, Kameraad?
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J63  spk=`Sturdy Ass`
    EN: The structure lacks integrity and we can't fit through the door.
    NL: De structuur mist elke integriteit en we passen niet door die deur, Kameraad.
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J74  spk=`Sturdy Ass`
    EN: Is everything all right in there? Do you need any help?
    NL: Is alles in orde daarbinnen? Heb je hulp nodig, kameraad?
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J78  spk=`Sturdy Ass`
    EN: Would you like me to show you the Old Church next?
    NL: Zal ik je de Oude Kerk laten zien, Kameraad?
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J135  spk=`Sturdy Ass`
    EN: What should I call this?
    NL: Hoe zou ik dit noemen, kameraad?
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J183  spk=`Sturdy Ass`
    EN: Sad, this Memorial Garden is coming along beautifully.
    NL: Triestige, dit Herdenkingstuintje wordt echt prachtig, Kameraad.
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J219  spk=`Sturdy Ass`
    EN: What's the perfect title to commemorate the opening of Bottoms Up?
    NL: Wat is nu de perfecte titel om de opening van Bottoms Up te vieren, Kameraad?
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J262  spk=`Sturdy Ass`
    EN: Help? We don't help traitors.
    NL: Helpen? Wij helpen geen verraders, Kameraad.

---

## A11. 🚨 English fragments in Slow Ass NL — utmost priority

Total Slow Ass NL cells: **167**
Cells with English fragment: **12**

First 15:
  - 1_asses.masses_E1Proxy.xlsx::E1_Farm_localization!J39  found `no`
    EN: I've run out of wood and need more to finish fixing the b-bridge b-before the P-Protest.
    NL: Ik z-z-zit zonder hout en ik heb meer nodig om het b-b-bruggetje te repareren voor het p-p-protest.
  - 1_asses.masses_E1Proxy.xlsx::E1_TheProtest_localization!J79  found `Sorry`
    EN: Sorry Comrades. I've been doing my b-best.
    NL: Sorry, k-k-kameraden. Ik p-p-probeer mijn best te d-d-doen.
  - 1_asses.masses_E1Proxy.xlsx::E1_TheProtest_localization!J80  found `no`
    EN: I stayed up all night b-but haven't finished fixing the b-bridge yet.
    NL: Ik b-b-ben de h-h-hele nacht opgebleven m-m-maar de b-b-brug is nog niet klaar.
  - 4_asses.masses_E4Proxy.xlsx::E4_Mine1F_localization!J10  found `no`
    EN: Oh Sick, I wish you would get b-b-b...
    NL: Oh Snotje, ik wou dat je b-b-b...
  - 4_asses.masses_E4Proxy.xlsx::E4_Mine1F_localization!J56  found `no`
    EN: I hope Sick is feeling b-b-b...
    NL: Ik hoop dat Snotje zich b-b-b...
  - 5_asses.masses_E5Proxy.xlsx::E5_CircusMain_localization!J165  found `Sorry`
    EN: Sorry I'm late.
    NL: Sorry dat ik te laat ben.
  - 5_asses.masses_E5Proxy.xlsx::E5_CircusMain_localization!J174  found `Sorry`
    EN: Sorry I'm late.
    NL: Sorry dat ik te laat ben.
  - 5_asses.masses_E5Proxy.xlsx::E5_ZooCapture_localization!J21  found `no`
    EN: I still can't b-b-believe that my p-p-poor b-b-bones didn't let me down!
    NL: Ik k-k-kan nog altijd niet g-g-geloven dat mijn b-b-beenderen het niet b-b-begeven hebben!
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J259  found `no`
    EN: Thanks, b-b-but I'm here b-b-because I need your help-p-p!
    NL: Bedankt, m-m-maar ik b-b-ben hier omdat ik jullie hulp-p-p nodig heb-b-b!
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J261  found `no`
    EN: Something terrib-b-ble has hap-p-p-ened and I need your help-p-p!
    NL: Er is iets verschrikkelijks geb-b-beurd en ik heb jullie hulp-p-p nodig!
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J287  found `no`
    EN: One night after a long shift, Sad Ass said he had enough.
    NL: Op-p een avond na een lange dienst zei Triestige Ezel dat hij er genoeg van had.
  - 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J339  found `please`
    EN: Sturdy, will you come with us? P-p-please?
    NL: Stevige, kom je met ons mee? P-p-please... alsjebbblieft?

---

## A12. E10 unauthorized `U`/`Uw` audit

Total E10 cells: **673**

E10 cells with `u`/`U`/`uw`/`Uw`: **32**

By speaker (top 15):
  - Golden Ass: 11
  - Cole-Machine: 8
  - Hard Ass: 3
  - Thirsty Ass: 2
  - Proper Ass: 2
  - Resentful Ass: 2
  - Bleak Ass: 1
  - Kick Ass: 1
  - 856: 1
  - 857: 1

### E10_Hard specifically
E10_Hard cells with U/Uw: **2**
  - 10_asses.masses_E10Proxy.xlsx::E10_Hard_localization!J11  spk=`Hard Ass`
    NL: Spaar uw adem. Ik heb het niet voor u gedaan.
  - 10_asses.masses_E10Proxy.xlsx::E10_Hard_localization!J15  spk=`Hard Ass`
    NL: Het ziet er thans ook niet goed uit voor u, Slimme.

---

## Sanity totals

Total cells: 4475
Files: 11
Sheets touched: 106

---

End of scoping. All counts as of fresh `excels/*.xlsx` post-pull (2026-05-03).


---

# 🔧 CORRECTED COUNTS (re-run with NL column 6, not speaker column 4)

Earlier sections A5/A6 had a field-index bug that searched speaker instead of NL. Corrected counts below override the buggy ones.

## A5-corrected. Uncle: Nonkel / Oom

NL `Nonkel`: **23** cell(s)
  Top speakers: {'{$NewName}': 19, 'Nice Ass': 2, 'Sad Ass': 1, '105': 1}
NL `Oom`: **11** cell(s)
  Top speakers: {'{$NewName}': 9, 'Sturdy Ass': 2}
NL `nonkel`: **1** cell(s)
  Top speakers: {'{$NewName}': 1}
NL `oom`: 0 cells

## A5-corrected. Hee/Haw/Hie/Haa (case-sensitive word boundary)

NL `Hee`: **0** cell(s)
NL `Haw`: **0** cell(s)
NL `Hie`: **0** cell(s)
NL `Haa`: **1** cell(s)
NL `HEE`: **0** cell(s)
NL `HAW`: **0** cell(s)
NL `HIE`: **7** cell(s)
NL `HAA`: **7** cell(s)

## A5-corrected. Farm / Stable

NL `Boerderij`: **31** cell(s)
NL `boerderij`: **1** cell(s)
NL `Hoeve`: **2** cell(s)
NL `hoeve`: **0** cell(s)
NL `Stal`: **4** cell(s)
NL `stal`: **1** cell(s)
NL `stallen`: **0** cell(s)
NL `Stallen`: **0** cell(s)

## A6-corrected. Machine variants (NL only)

NL `Machine`: **62** cell(s)
NL `Machines`: **51** cell(s)
NL `machine`: **2** cell(s)
NL `machines`: **1** cell(s)
NL `Machien`: **0** cell(s)
NL `Machienen`: **0** cell(s)
NL `machien`: **0** cell(s)
NL `machienen`: **0** cell(s)
NL `MACHINE`: **0** cell(s)
NL `MACHINES`: **2** cell(s)

**Unique NL cells with any Machine variant: 118**
(This is the rough sweep size — every one becomes Machien/Machienen.)

## A6-corrected. Compound forms (substring in NL)

NL substring `Tractor-Machine`: **10** cell(s)
NL substring `Tractor-Machien`: **0** cell(s)
NL substring `Piet-Machine`: **5** cell(s)
NL substring `Piet-Machien`: **0** cell(s)
NL substring `Camion-Machine`: **3** cell(s)
NL substring `Camion Machine`: **4** cell(s)
NL substring `Camion-Machien`: **0** cell(s)
NL substring `Auto-Machine`: **2** cell(s)
NL substring `Auto Machine`: **0** cell(s)
NL substring `Auto-Machien`: **0** cell(s)
NL substring `-Machine`: **28** cell(s)
NL substring `-Machien`: **0** cell(s)

## A9-corrected. Ezel capitalization

NL cells with lowercase `ezel(s/en)`: **57**
NL cells with capitalized `Ezel(s/en)`: **458**

First 5 lowercase cells:
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::CharacterProfiles_localization!J81  spk=`Blunt Ass`
    NL: Groffe ezel
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::CharacterProfiles_localization!J82  spk=`Peek Ass`
    NL: Constat-ezel
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::E0_Questions_localization!J67  spk=`98`
    NL: In het Oude Testament slaat een mens genaamd Balaam op zijn ezel wanneer plots:
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::E0_Questions_localization!J68  spk=`99`
    NL: Balaam slaat de ezel dood en moet een andere zoeken om het werk voor hem te doen
  - 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx::E0_Questions_localization!J69  spk=`100`
    NL: God geeft de ezel het vermogen om te spreken en de ezel smeekt Balaam om hem te sparen

## Sweep size summary table

| Sweep target | Approx cells | Source |
|---|---|---|
| Mechalen → Technopolis | 31 | A1 |
| Muilegem → Muilenbeek | 24 | A1 (1 already MUILEBEEK on remote) |
| Poepegaatje → De Zatten Ezel | 5 | A1 |
| Bikkeharde → Bikkelharde | 3 | A2 |
| Stenen-Spel → Keien-Spel | ~12 | A3 |
| Song of Ascension | 5 cells (variant `ezelenhemelvaartszangderzielen`) + 7 cells (variant `hemelvaartszang`) | A3 |
| Nonkel / Oom audit | 23 Nonkel + 11 Oom | A5 |
| Hee/Haw → Hie/Haa | 0 Hee + 0 Haw + 7 HIE + 7 HAA | A5 |
| Boerderij → de Hoeve | 31 Boerderij + 1 boerderij | A5 |
| Machine → Machien sweep | 118 unique NL cells | A6 |
| Sad whimper standardization | ~18 (3 forms) | A8 |
| Ezel capitalization | 57 lowercase NL cells | A9 |
