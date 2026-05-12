# Push Log — am-fl-trans Editorial Sweep
**Started:** 2026-05-10
**Source-of-truth:** Live Google Sheets remote (Patrick's working corpus)
**Workflow:** dry-run → apply local → push safety check → push → round-trip verify

Each section below records a single push event with per-cell context:
- **Original (May 3)** — pre-Patrick baseline from `excels.pre-pull-2026-05-03/`
- **Was (pre-push)** — state immediately before our push (= remote at apply time)
- **Pushed** — value we wrote to Google Sheets
- **Rule** — which audit rule(s) drove the change

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E1 main sweep (15 cells)
**Pushed:** 2026-05-11
**Batch file:** `data/editorial/corrections/2026-05-10-E1.json`
**Cells:** 15

### E1_FarmHouseInt_localization (1 cell)

**[E1-010] J19 · Radio Host Marcos**
- **EN:** It's a scorcher! It's looking dry as a bone out there in the Greater Fannyside Region as the drought continues.
- **Original (May 3):** Bakken en braden vandaag! Het is kurkdroog in de regio van Groot-Muilegem en de droogte blijft aanhouden.
- **Was (pre-push):** Bakken en braden vandaag! Het is kurkdroog in de regio van Groot-Muilebeek en de droogte blijft aanhouden.
- **Pushed:** Bakken en braden vandaag! Het is kurkdroog in de regio van Groot-Muilenbeek en de droogte blijft aanhouden.
- *Rule:* Place: Muilebeek → Muilenbeek (Q3 lock, extra n)

### E1_Farm_localization (10 cells)

**[E1-001] J5 · Welcome Sign**
- **EN:** Welcome to Fannyside Farm. To the west, our beautiful Heritage Stable and wheat fields.
- **Original (May 3):** Welkom op de Boerderij van Muilegem. Ten westen: onze prachtige Erfgoedshoeve en korenvelden.
- **Was (pre-push):** Welkom op de Boerderij van Muilebeek. Ten westen: onze prachtige Erfgoedshoeve en korenvelden.
- **Pushed:** Welkom op de Hoeve van Muilenbeek. Ten westen: onze prachtige Erfgoedstal en korenvelden.
- *Rule:* Place: Muilebeek → Muilenbeek (Q3 lock, extra n); Boerderij → de Hoeve; Heritage Stable mistranslation: Erfgoedshoeve → Erfgoedstal

**[E1-002] J11 · Shitty Sign**
- **EN:** The Outhouse
- **Original (May 3):** De Hudo
- **Was (pre-push):** De Hudo
- **Pushed:** De Plee
- *Rule:* HUDO → De Plee/de Plee (Decision 1)

**[E1-014] J12 · (no spk)**
- **EN:** The Heritage Stable
- **Original (May 3):** De Erfgoedshoeve
- **Was (pre-push):** De Erfgoedshoeve
- **Pushed:** De Erfgoedstal
- *Rule:* Heritage Stable mistranslation: Erfgoedshoeve → Erfgoedstal (Stable → Stal rule)

**[E1-003] J50 · Big Ass**
- **EN:** It must be pretty bad down in the Mines if it can stop an Ass from eating.
- **Original (May 3):** Het moet er slecht uitzien in de Mijnen als een ezel daarna geen honger meer heeft.
- **Was (pre-push):** Het moet er slecht uitzien in de Mijnen als een ezel daarna geen honger meer heeft.
- **Pushed:** Het moet er slecht uitzien in de Mijnen als een Ezel daarna geen honger meer heeft.
- *Rule:* Ezel capitalization (cap everywhere)

**[E1-004] J68 · Smart Ass**
- **EN:** Oh shut it, can't two Jennets joke around?
- **Original (May 3):** Och, mogen twee ezelinnekes al niet meer eens lachen?
- **Was (pre-push):** Och, mogen twee ezelinnekes al niet meer eens lachen?
- **Pushed:** Och, mogen twee Ezelinnekes al niet meer eens lachen?
- *Rule:* Ezel capitalization (cap everywhere)

**[E1-005] J106 · Child Joey**
- **EN:** Grandmother! Can I feed the cute donkey?
- **Original (May 3):** Groetmoe! Mag ik het ezeltje eten geven?
- **Was (pre-push):** Groetmoe! Mag ik het ezeltje eten geven?
- **Pushed:** Groetmoe! Mag ik het Ezeltje eten geven?
- *Rule:* Ezel capitalization (cap everywhere)

**[E1-006] J108 · Child Joey**
- **EN:** Here donkey!
- **Original (May 3):** Hier, ezeltje!
- **Was (pre-push):** Hier, ezeltje!
- **Pushed:** Hier, Ezeltje!
- *Rule:* Ezel capitalization (cap everywhere)

**[E1-007] J114 · Child Joey**
- **EN:** Want more, donkey?
- **Original (May 3):** Wil je meer, ezeltje?
- **Was (pre-push):** Wil je meer, ezeltje?
- **Pushed:** Wil je meer, Ezeltje?
- *Rule:* Ezel capitalization (cap everywhere)

**[E1-008] J117 · Child Joey**
- **EN:** Want more, donkey?
- **Original (May 3):** Wil je nog meer, ezeltje?
- **Was (pre-push):** Wil je nog meer, ezeltje?
- **Pushed:** Wil je nog meer, Ezeltje?
- *Rule:* Ezel capitalization (cap everywhere)

**[E1-009] J120 · Grandma Kulan**
- **EN:** Come along, darling. This donkey seems greedy.
- **Original (May 3):** Kom, we gaan, schat. Dit ezeltje is wat gierig.
- **Was (pre-push):** Kom, we gaan, schat. Dit ezeltje is wat gierig.
- **Pushed:** Kom, we gaan, schat. Dit Ezeltje is wat gierig.
- *Rule:* Ezel capitalization (cap everywhere)

### E1_TheProtest_localization (4 cells)

**[E1-011] J5 · Welcome Sign**
- **EN:** Welcome to Fannyside Farm. To the west, our beautiful Heritage Stable and wheat fields.
- **Original (May 3):** Welkom op de Boerderij van Muilegem. Ten westen: onze prachtige Erfgoedshoeve en korenvelden.
- **Was (pre-push):** Welkom op de Boerderij van Muilebeek. Ten westen: onze prachtige Erfgoedshoeve en korenvelden.
- **Pushed:** Welkom op de Hoeve van Muilenbeek. Ten westen: onze prachtige Erfgoedstal en korenvelden.
- *Rule:* Place: Muilebeek → Muilenbeek (Q3 lock, extra n); Boerderij → de Hoeve; Heritage Stable mistranslation: Erfgoedshoeve → Erfgoedstal

**[E1-012] J11 · Shitty Sign**
- **EN:** The Outhouse
- **Original (May 3):** De Hudo
- **Was (pre-push):** De Hudo
- **Pushed:** De Plee
- *Rule:* HUDO → De Plee/de Plee (Decision 1)

**[E1-015] J12 · (no spk)**
- **EN:** The Heritage Stable
- **Original (May 3):** De Erfgoedshoeve
- **Was (pre-push):** De Erfgoedshoeve
- **Pushed:** De Erfgoedstal
- *Rule:* Heritage Stable mistranslation: Erfgoedshoeve → Erfgoedstal (Stable → Stal rule)

**[E1-013] J72 · Thirsty Ass**
- **EN:** Spoken like a true Ass. YEEHAW!
- **Original (May 3):** Wat een leeg gevoel...
- **Was (pre-push):** Gelijk 'nen echte ezel gesproken, héé!
- **Pushed:** Gelijk 'nen echte Ezel gesproken, héé!
- *Rule:* Ezel capitalization (cap everywhere)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E1 follow-up (1 cell) — Thirsty Ass nickname restore
**Pushed:** 2026-05-11
**Batch file:** `data/editorial/corrections/2026-05-10-E1-followup.json`
**Cells:** 1

### E1_Farm_localization (1 cell)

**[E1FU-001] J29 · Thirsty Ass**
- **EN:** To be honest, I'd have gon' done it myself, but I wanna be right here when Nice Ass takes a break from her plowin'.
- **Original (May 3):** Eerlijk gezegd had'k het zelf willen doen, maar 'k zou graag hier zijn wanneer Schoon Beest haar pauzeke pakt.
- **Was (pre-push):** Eerlijk gezegd had'k het zelf willen doen, maar 'k zou graag hier zijn wanneer Lieve Ezel haar pauzeke pakt.
- **Pushed:** Eerlijk gezegd had'k het zelf willen doen, maar 'k zou graag hier zijn wanneer Schoon Beest haar pauzeke pakt.
- *Rule:* Character-specific nickname: Thirsty Ass uses 'Schoon Beest' for Nice Ass (restore from Patrick's flatten to Lieve Ezel)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E2 main sweep (41 cells)
**Pushed:** 2026-05-11
**Batch file:** `data/editorial/corrections/2026-05-10-E2.json`
**Cells:** 41

### E2_BadAssRescue_localization (1 cell)

**[E2-012] J9 · Bad Ass**
- **EN:** You find a way to stop the fire and save the Farm.
- **Original (May 3):** Zoek een manier om dat vuur te blussen en de Boerderij te redden.
- **Was (pre-push):** Zoek een manier om dat vuur te blussen en de Boerderij te redden.
- **Pushed:** Zoek een manier om dat vuur te blussen en de Hoeve te redden.
- *Rule:* Boerderij → de Hoeve

### E2_BattleMiner_localization (3 cells)

**[E2-029] J3 · (no spk)**
- **EN:** Hard Ass
- **Original (May 3):** Bikkeharde Ezel
- **Was (pre-push):** Bikkeharde Ezel
- **Pushed:** Bikkelharde Ezel
- *Rule:* Typo: Bikkeharde → Bikkelharde

**[E2-030] J13 · (no spk)**
- **EN:** Miner Jenny uses SHOVEL.
- **Original (May 3):** Mijnwerker Jenny gebruikt SCHUP.
- **Was (pre-push):** Mijnwerker Jenny gebruikt SCHUP.
- **Pushed:** Mijnwerker Jenny gebruikt SCHEP.
- *Rule:* Schup → Schep (Decision)

**[E2-040] J14 · (no spk)**
- **EN:** EAT SHOVEL ASSHOLE!!
- **Original (May 3):** EET DEZE SCHUP, KLOOTZAKSKE!!
- **Was (pre-push):** EET MIJN SCHEP OP, KLOOTZAKSKE!!
- **Pushed:** EET DEZE SCHEP, KLOOTZAKSKE!!
- *Rule:* Decision: revert Patrick rewrite to original rhythm + Schup→Schep typo fix (EET DEZE SCHEP)

### E2_ButtesHouse_localization (4 cells)

**[E2-031] J5 · ???**
- **EN:** Is that a donkey?
- **Original (May 3):** Is dat een ezel?
- **Was (pre-push):** Is dat een ezel?
- **Pushed:** Is dat een Ezel?
- *Rule:* Ezel cap

**[E2-032] J10 ·  Butte**
- **EN:** *sigh* I guess replacing you donkeys made no difference.
- **Original (May 3):** *zucht* Blijkt dat jullie ezels vervangen geen verschil heeft gemaakt.
- **Was (pre-push):** *zucht* Blijkt dat jullie ezels vervangen geen verschil heeft gemaakt.
- **Pushed:** *zucht* Blijkt dat jullie Ezels vervangen geen verschil heeft gemaakt.
- *Rule:* Ezel cap

**[E2-033] J13 ·  Butte**
- **EN:** You can't run a Coal Mine with just donkeys—it's the 21st century!
- **Original (May 3):** Je kan geen Koolmijn met enkel ezels runnen — het is de 21ste eeuw!
- **Was (pre-push):** Je kan geen Koolmijn met enkel ezels runnen — het is de 21ste eeuw!
- **Pushed:** Je kan geen Koolmijn met enkel Ezels runnen — het is de 21ste eeuw!
- *Rule:* Ezel cap

**[E2-034] J17 ·  Butte**
- **EN:** Ah, what the hell. Look at me. Talking to a donkey again...
- **Original (May 3):** Ach, wat maakt het. Kijk naar mij — tegen een ezel bezig...
- **Was (pre-push):** Ach, wat maakt het. Kijk naar mij — tegen een ezel bezig...
- **Pushed:** Ach, wat maakt het. Kijk naar mij — tegen een Ezel bezig...
- *Rule:* Ezel cap

### E2_ChildsHouse_localization (2 cells)

**[E2-017] J6 · Child Joey**
- **EN:** Please donkey!
- **Original (May 3):** Kom, ezeltje!
- **Was (pre-push):** Kom, ezeltje!
- **Pushed:** Kom, Ezeltje!
- *Rule:* Ezel cap

**[E2-018] J12 · Child Joey**
- **EN:** Grandma always said donkeys were WORTHLESS!
- **Original (May 3):** Grootmoe zei altijd al dat ezels WAARDELOOS zijn!
- **Was (pre-push):** Grootmoe zei altijd al dat ezels WAARDELOOS zijn!
- **Pushed:** Grootmoe zei altijd al dat Ezels WAARDELOOS zijn!
- *Rule:* Ezel cap

### E2_Confession_localization (5 cells)

**[E2-035] J4 · Nice Ass**
- **EN:** Sad Ass! Quit hiding in the outhouse!
- **Original (May 3):** Triestigaard! Stopt met je in de Hudo te verstoppen!
- **Was (pre-push):** Triestige Ezel! Stopt met je in de Hudo te verstoppen!
- **Pushed:** Triestige Ezel! Stop met je in de Plee te verstoppen!
- *Rule:* HUDO → De Plee (Decision 1); Register fix: Stopt → Stop (Nice Ass je/jij, Decision 1 bonus)

**[E2-036] J63 · Nice Ass**
- **EN:** The Farm—our home! Sad Ass, how could you?!
- **Original (May 3):** De Boerderij—onze thuis! Triestigaard, hoe kon je dit laten gebeuren?!
- **Was (pre-push):** De Boerderij—onze thuis! Triestige, hoe kon je dit laten gebeuren?!
- **Pushed:** De Hoeve—onze thuis! Triestige, hoe kon je dit laten gebeuren?!
- *Rule:* Boerderij → de Hoeve

**[E2-037] J64 · Sad Ass**
- **EN:** I don't belong on this Farm...
- **Original (May 3):** Ik hoor niet op deze Boerderij thuis...
- **Was (pre-push):** Ik hoor niet op deze Boerderij thuis...
- **Pushed:** Ik hoor niet op deze Hoeve thuis...
- *Rule:* Boerderij → de Hoeve

**[E2-038] J69 · (no spk)**
- **EN:** Look back at the Farm as it burns.
- **Original (May 3):** Kijk naar de Boerderij die in lichterlaaie staat.
- **Was (pre-push):** Kijk naar de Boerderij die in lichterlaaie staat.
- **Pushed:** Kijk naar de Hoeve die in lichterlaaie staat.
- *Rule:* Boerderij → de Hoeve

**[E2-039] J85 · Nice Ass**
- **EN:** The Farm is lost...
- **Original (May 3):** De Boerderij is verloren...
- **Was (pre-push):** De Boerderij is verloren...
- **Pushed:** De Hoeve is verloren...
- *Rule:* Boerderij → de Hoeve

### E2_MinersHouse_localization (1 cell)

**[E2-028] J3 · ???**
- **EN:** A donkey? How'd you get here from the Mines?
- **Original (May 3):** Een ezel? Hoe ben jij hier van de Mijnen geraakt?
- **Was (pre-push):** Een ezel? Hoe ben jij hier van de Mijnen geraakt?
- **Pushed:** Een Ezel? Hoe ben jij hier van de Mijnen geraakt?
- *Rule:* Ezel cap

### E2_World_A1_localization (12 cells)

**[E2-001] J5 · Welcome Sign**
- **EN:** Welcome to Fannyside Farm. To the west, our beautiful Heritage Stable and wheat fields.
- **Original (May 3):** Welkom op de Boerderij van Muilegem. Ten westen, onze prachtige Erfgoedshoeve en korenvelden.
- **Was (pre-push):** Welkom op de Boerderij van Muilebeek. Ten westen, onze prachtige Erfgoedshoeve en korenvelden.
- **Pushed:** Welkom op de Hoeve van Muilenbeek. Ten westen, onze prachtige Erfgoedstal en korenvelden.
- *Rule:* Place: Muilebeek → Muilenbeek (Q3 +n); Mistranslation: Erfgoedshoeve → Erfgoedstal (Heritage Stable); Boerderij → de Hoeve

**[E2-002] J11 · Shitty Sign**
- **EN:** The Outhouse
- **Original (May 3):** De Hudo
- **Was (pre-push):** De Hudo
- **Pushed:** De Plee
- *Rule:* HUDO → De Plee (Decision 1)

**[E2-003] J12 · Old Sign**
- **EN:** The Heritage Stable
- **Original (May 3):** De Erfgoedshoeve
- **Was (pre-push):** De Erfgoedshoeve
- **Pushed:** De Erfgoedstal
- *Rule:* Mistranslation: Erfgoedshoeve → Erfgoedstal (Heritage Stable)

**[E2-004] J33 · Big Ass**
- **EN:** The enormous flames are spreading west! They'll reach the Farm in no time—
- **Original (May 3):** De gigantische vlammen bewegen zich naar het westen! Niet lang meer tot ze bij de Boerderij—
- **Was (pre-push):** De gigantische vlammen bewegen zich naar het westen! Niet lang meer tot ze bij de Boerderij—
- **Pushed:** De gigantische vlammen bewegen zich naar het westen! Niet lang meer tot ze bij de Hoeve—
- *Rule:* Boerderij → de Hoeve

**[E2-005] J34 · Nice Ass**
- **EN:** JEEPERS! Not the Farm!
- **Original (May 3):** OESJE! Toch niet de Boerderij!
- **Was (pre-push):** OESJE! Toch niet de Boerderij!
- **Pushed:** OESJE! Toch niet de Hoeve!
- *Rule:* Boerderij → de Hoeve

**[E2-006] J37 · Smart Ass**
- **EN:** ONE, someone races back to the Farm to warn the others.
- **Original (May 3):** ÉÉN, iemand moet naar de Boerderij crossen om de rest te waarschuwen.
- **Was (pre-push):** ÉÉN, iemand moet naar de Boerderij crossen om de rest te waarschuwen.
- **Pushed:** ÉÉN, iemand moet naar de Hoeve crossen om de rest te waarschuwen.
- *Rule:* Boerderij → de Hoeve

**[E2-007] J45 · Smart Ass**
- **EN:** Who's going to run back to the Farm?
- **Original (May 3):** Wie loopt er terug naar de Boerderij?
- **Was (pre-push):** Wie loopt er terug naar de Boerderij?
- **Pushed:** Wie loopt er terug naar de Hoeve?
- *Rule:* Boerderij → de Hoeve

**[E2-041] J46 · Thirsty Ass**
- **EN:** Nice Ass's fine legs can do that run in less than two minutes! Yeehaw!
- **Original (May 3):** Schoon Beest haar lange benen kunnen dadde in minder dan twee minuten! Da'k ik het ge'zeid heb, héé!
- **Was (pre-push):** Lieve Ezel haar lange benen kunnen dadde in minder dan twee minuten! Da'k ik het ge'zeid heb, héé!
- **Pushed:** Schoon Beest haar lange benen kunnen dadde in minder dan twee minuten! Da'k ik het ge'zeid heb, héé!
- *Rule:* Character-specific nickname: Thirsty Ass uses 'Schoon Beest' for Nice Ass (restore from Patrick's flatten to Lieve Ezel)

**[E2-008] J47 · Nice Ass**
- **EN:** Heck, I'd do anything to save our Farm!
- **Original (May 3):** Potvolkoffie! Ik zou alles doen om onze Boerderij te redden!
- **Was (pre-push):** Potvolkoffie! Ik zou alles doen om onze Boerderij te redden!
- **Pushed:** Potvolkoffie! Ik zou alles doen om onze Hoeve te redden!
- *Rule:* Boerderij → de Hoeve

**[E2-009] J53 · Nice Ass**
- **EN:** Golly, the smoke must be getting to me. This isn't the way to the Farm at all.
- **Original (May 3):** Oesje, de rook is te dik. Er is geen enkele weg naar de Boerderij.
- **Was (pre-push):** Oesje, de rook is te dik. Er is geen enkele weg naar de Boerderij.
- **Pushed:** Oesje, de rook is te dik. Er is geen enkele weg naar de Hoeve.
- *Rule:* Boerderij → de Hoeve

**[E2-010] J54 · Nice Ass**
- **EN:** Golly, the smoke must be getting to me. This isn't the way to the Farm at all.
- **Original (May 3):** Oesje, de rook is te dik. Er is geen enkele weg naar de Boerderij.
- **Was (pre-push):** Oesje, de rook is te dik. Er is geen enkele weg naar de Boerderij.
- **Pushed:** Oesje, de rook is te dik. Er is geen enkele weg naar de Hoeve.
- *Rule:* Boerderij → de Hoeve

**[E2-011] J60 · Bad Ass**
- **EN:** You find a way to stop the fire and save the Farm.
- **Original (May 3):** Zoek een manier om het vuur te blussen en de Boerderij te redden.
- **Was (pre-push):** Zoek een manier om het vuur te blussen en de Boerderij te redden.
- **Pushed:** Zoek een manier om het vuur te blussen en de Hoeve te redden.
- *Rule:* Boerderij → de Hoeve

### E2_World_A2_localization (6 cells)

**[E2-019] J5 · (no spk)**
- **EN:** Welcome to Fannyside Farm. To the west, our beautiful Heritage Stable and wheat fields.
- **Original (May 3):** Welkom op de Boerderij van Muilegem. Ten westen, onze prachtige Erfgoedshoeve en korenvelden.
- **Was (pre-push):** Welkom op de Boerderij van Muilebeek. Ten westen, onze prachtige Erfgoedshoeve en korenvelden.
- **Pushed:** Welkom op de Hoeve van Muilenbeek. Ten westen, onze prachtige Erfgoedstal en korenvelden.
- *Rule:* Place: Muilebeek → Muilenbeek (Q3 +n); Mistranslation: Erfgoedshoeve → Erfgoedstal (Heritage Stable); Boerderij → de Hoeve

**[E2-020] J10 · (no spk)**
- **EN:** The Outhouse
- **Original (May 3):** De Hudo
- **Was (pre-push):** De Hudo
- **Pushed:** De Plee
- *Rule:* HUDO → De Plee (Decision 1)

**[E2-021] J11 · (no spk)**
- **EN:** The Heritage Stable
- **Original (May 3):** De Erfgoedshoeve
- **Was (pre-push):** De Erfgoedshoeve
- **Pushed:** De Erfgoedstal
- *Rule:* Mistranslation: Erfgoedshoeve → Erfgoedstal (Heritage Stable)

**[E2-022] J16 · Nice Ass**
- **EN:** If I plow like I've never plowed before, I can cut the fire off and save our beautiful Farm!
- **Original (May 3):** Als ik ploeg zoals nooit tevoren, kan ik het vuur afsnijden en onze prachtige Boerderij redden!
- **Was (pre-push):** Als ik ploeg zoals nooit tevoren, kan ik het vuur afsnijden en onze prachtige Boerderij redden!
- **Pushed:** Als ik ploeg zoals nooit tevoren, kan ik het vuur afsnijden en onze prachtige Hoeve redden!
- *Rule:* Boerderij → de Hoeve

**[E2-023] J23 · Nice Ass**
- **EN:** If I cut the fire off at the centre, I can still save the North Half of the Farm.
- **Original (May 3):** Als ik het vuur bij het midden afsnijd, kan ik nog het noordelijke deel van de Boerderij redden.
- **Was (pre-push):** Als ik het vuur bij het midden afsnijd, kan ik nog het noordelijke deel van de Boerderij redden.
- **Pushed:** Als ik het vuur bij het midden afsnijd, kan ik nog het noordelijke deel van de Hoeve redden.
- *Rule:* Boerderij → de Hoeve

**[E2-024] J27 · Nice Ass**
- **EN:** I've got to make it to the Outhouse before it's too late!
- **Original (May 3):** Ik moet de Hudo bereiken voor het te laat is!
- **Was (pre-push):** Ik moet de Hudo bereiken voor het te laat is!
- **Pushed:** Ik moet de Plee bereiken voor het te laat is!
- *Rule:* HUDO → De Plee (Decision 1)

### E2_World_B1_localization (4 cells)

**[E2-013] J5 · Welcome Sign**
- **EN:** Welcome to Fannyside Farm. To the west, our beautiful Heritage Stable and wheat fields.
- **Original (May 3):** Welkom op de Boerderij van Muilegem. Ten westen, onze prachtige Erfgoedshoeve en korenvelden.
- **Was (pre-push):** Welkom op de Boerderij van Muilebeek. Ten westen, onze prachtige Erfgoedshoeve en korenvelden.
- **Pushed:** Welkom op de Hoeve van Muilenbeek. Ten westen, onze prachtige Erfgoedstal en korenvelden.
- *Rule:* Place: Muilebeek → Muilenbeek (Q3 +n); Mistranslation: Erfgoedshoeve → Erfgoedstal (Heritage Stable); Boerderij → de Hoeve

**[E2-014] J11 · Shitty Sign**
- **EN:** The Outhouse
- **Original (May 3):** De Hudo
- **Was (pre-push):** De Hudo
- **Pushed:** De Plee
- *Rule:* HUDO → De Plee (Decision 1)

**[E2-015] J12 · Old Sign**
- **EN:** The Heritage Stable
- **Original (May 3):** De Erfgoedshoeve
- **Was (pre-push):** De Erfgoedshoeve
- **Pushed:** De Erfgoedstal
- *Rule:* Mistranslation: Erfgoedshoeve → Erfgoedstal (Heritage Stable)

**[E2-016] J37 · Smart Ass**
- **EN:** ONE, Nice Ass saves the Farm.
- **Original (May 3):** ÉÉN, Schoon Beest redt de Boerderij.
- **Was (pre-push):** ÉÉN, Lieve Ezel redt de Boerderij.
- **Pushed:** ÉÉN, Lieve Ezel redt de Hoeve.
- *Rule:* Boerderij → de Hoeve

### E2_World_B2_localization (3 cells)

**[E2-025] J5 · Welcome Sign**
- **EN:** Welcome to Fannyside Farm. To the west, our beautiful Heritage Stable and wheat fields.
- **Original (May 3):** Welkom op de Boerderij van Muilegem. Ten westen, onze prachtige Erfgoedshoeve en korenvelden.
- **Was (pre-push):** Welkom op de Boerderij van Muilebeek. Ten westen, onze prachtige Erfgoedshoeve en korenvelden.
- **Pushed:** Welkom op de Hoeve van Muilenbeek. Ten westen, onze prachtige Erfgoedstal en korenvelden.
- *Rule:* Place: Muilebeek → Muilenbeek (Q3 +n); Mistranslation: Erfgoedshoeve → Erfgoedstal (Heritage Stable); Boerderij → de Hoeve

**[E2-026] J11 · Shitty Sign**
- **EN:** The Outhouse
- **Original (May 3):** De Hudo
- **Was (pre-push):** De Hudo
- **Pushed:** De Plee
- *Rule:* HUDO → De Plee (Decision 1)

**[E2-027] J12 · Old Sign**
- **EN:** The Heritage Stable
- **Original (May 3):** De Erfgoedshoeve
- **Was (pre-push):** De Erfgoedshoeve
- **Pushed:** De Erfgoedstal
- *Rule:* Mistranslation: Erfgoedshoeve → Erfgoedstal (Heritage Stable)

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E0 push 1 — locally-applied batch (5 cells)
**Pushed:** 2026-05-12
**File:** `0_asses.masses_Manager+Intermissions+E0Proxy.xlsx`
**Cells:** 5

### CharacterProfiles_localization (2 cells)

**[E0-001] J50 · Official Sign**
- **EN:** Official Sign
- **Was:** Officiëel Bord
- **Pushed:** Officieel Bord
- *Rule:* §15.6F — modern Dutch spelling (no umlaut on Officieel)

**[E0-002] J52 · Decrepit Sign**
- **EN:** Decrepit Sign
- **Was:** Verlept Bord
- **Pushed:** Vervallen Bord
- *Rule:* §15.6F — Decrepit ≠ withered (Verlept); Vervallen = correct

### E0_Questions_localization (3 cells)

**[E0-003] J6 · (player choice)**
- **EN:** Those who stay with the herd
- **Was:** Diegene die bij de Kudde blijven
- **Pushed:** Diegenen die bij de Kudde blijven
- *Rule:* Q3 — Diegene → Diegenen (direct plural of demonstrative); Kudde capped §7.3

**[E0-004] J7 · (player choice)**
- **EN:** Those who step away from the herd
- **Was:** Diegene die zich van de Kudde afscheiden
- **Pushed:** Diegenen die zich van de Kudde afscheiden
- *Rule:* Q3 — Diegene → Diegenen; Kudde capped §7.3

**[E0-005] J27 · (player question)**
- **EN:** Have you ever lost your job because your role became redundant in the workplace?
- **Was:** Bent u ooit uw baan verloren omdat uw functie overbodig werd op uw werkplek?
- **Pushed:** Heb je ooit je job verloren omdat je functie overbodig werd op je werkplek?
- *Rule:* Q3 — register normalised to je/jij; baan → job (generic context §6.16 lowercase)

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E0 push 2 — universal sweep (19 cells)
**Pushed:** 2026-05-12
**File:** `0_asses.masses_Manager+Intermissions+E0Proxy.xlsx`
**Cells:** 19

### E0_Questions_localization (19 cells)

**[E0-006] J43 · (player question)**
- **EN:** Do you miss the job?
- **Was:** Mis je de job?
- **Pushed:** Mis je de Job?
- *Rule:* §6.16 — game-system Job context (onboarding quiz re player's old donkey-Job)

**[E0-007] J67 · (quiz — Balaam)**
- **EN:** In the Old Testament, a human named Balaam is hitting his ass when all of a sudden:
- **Was:** In het Oude Testament slaat een mens genaamd Balaam op zijn ezel wanneer plots:
- **Pushed:** In het Oude Testament slaat een mens genaamd Balaam op zijn Ezel wanneer plots:
- *Rule:* §7.1 — Ezel always capped (species proper noun, quiz text included)

**[E0-008] J68 · (quiz answer — Balaam)**
- **EN:** Balaam beats the ass to death and has to find another one to do his work for him
- **Was:** Balaam slaat de ezel dood en moet een andere zoeken om het werk voor hem te doen
- **Pushed:** Balaam slaat de Ezel dood en moet een andere zoeken om het werk voor hem te doen
- *Rule:* §7.1

**[E0-009] J69 · (quiz answer — Balaam)**
- **EN:** God gives the ass the ability to speak and the ass begs Balaam to spare them
- **Was:** God geeft de ezel het vermogen om te spreken en de ezel smeekt Balaam om hem te sparen
- **Pushed:** God geeft de Ezel het vermogen om te spreken en de Ezel smeekt Balaam om hem te sparen
- *Rule:* §7.1

**[E0-010] J70 · (quiz — Aesop)**
- **EN:** In Aesop's Fables, one reads: "An ass put on the skin of a lion…" The moral is:
- **Was:** …'Een ezel trok de huid van een leeuw aan…De ezel zag een vos…ze tegen de ezel:…
- **Pushed:** …'Een Ezel trok de huid van een leeuw aan…De Ezel zag een vos…ze tegen de Ezel:…
- *Rule:* §7.1

**[E0-011] J73 · (quiz — Ancient Greece)**
- **EN:** In Ancient Greece, asses symbolized fertility because:
- **Was:** In het Oude Griekenland symboliseerden ezels vruchtbaarheid omdat:
- **Pushed:** In het Oude Griekenland symboliseerden Ezels vruchtbaarheid omdat:
- *Rule:* §7.1

**[E0-012] J74 · (quiz answer)**
- **EN:** Male donkeys have very large penises
- **Was:** Mannelijke ezels een zeer grote penis hebbem
- **Pushed:** Mannelijke Ezels een zeer grote penis hebben
- *Rule:* §7.1 + typo hebbem → hebben

**[E0-013] J75 · (quiz answer)**
- **EN:** Female donkeys frequently give birth to twins
- **Was:** Vrouwelijke ezels vaak tweelingen baren
- **Pushed:** Vrouwelijke Ezels vaak tweelingen baren
- *Rule:* §7.1

**[E0-014] J76 · (quiz — female donkey term)**
- **EN:** A 'mare' is the general term for a female equine. What is the specific term for a female donkey?
- **Was:** …specifieke term voor een vrouwelijke ezel?
- **Pushed:** …specifieke term voor een vrouwelijke Ezel?
- *Rule:* §7.1

**[E0-015] J83 · (quiz answer — graffiti)**
- **EN:** Jesus riding an ass backwards
- **Was:** Jezus die achterstevoren op een ezel rijdt
- **Pushed:** Jezus die achterstevoren op een Ezel rijdt
- *Rule:* §7.1

**[E0-016] J84 · (quiz — Mohammed's ass)**
- **EN:** What does tradition say Mohammed's ass, Ya'fur, did after the Prophet died?
- **Was:** Wat zegt de traditie dat Mohammeds ezel, Ya'fur, deed na de dood van de Profeet?
- **Pushed:** Wat zegt de traditie dat Mohammeds Ezel, Ya'fur, deed na de dood van de Profeet?
- *Rule:* §7.1

**[E0-017] J87 · (quiz — Buridan's Ass)**
- **EN:** In the philosophical paradox called Buridan's Ass, an ass placed between a bucket of water and a bale of hay will:
- **Was:** …Buridans ezel zal een ezel die precies tussen een emmer water en een baal hooi wordt geplaatst:
- **Pushed:** …Buridans Ezel zal een Ezel die precies tussen een emmer water en een baal hooi wordt geplaatst:
- *Rule:* §7.1

**[E0-018] J93 · (quiz answer — German proverb)**
- **EN:** Vertrauen Sie niemals einem langsamen Esel beim Brückenbauen
- **Was:** Vertrouw nooit een trage ezel bij het bruggen bouwen
- **Pushed:** Vertrouw nooit een trage Ezel bij het bruggen bouwen
- *Rule:* §7.1

**[E0-019] J95 · (quiz answer — DONKEY.BAS)**
- **EN:** Play as a donkey pulling wagons of hay from one town to another
- **Was:** Als een ezel wagons hooi van de ene stad naar de andere trekken
- **Pushed:** Als een Ezel wagons hooi van de ene stad naar de andere trekken
- *Rule:* §7.1

**[E0-020] J96 · (quiz answer — DONKEY.BAS)**
- **EN:** Drive a car down a road while avoiding donkeys
- **Was:** Met een auto over een weg rijden terwijl je ezels ontwijkt
- **Pushed:** Met een auto over een weg rijden terwijl je Ezels ontwijkt
- *Rule:* §7.1

**[E0-021] J97 · (quiz answer — DONKEY.BAS)**
- **EN:** Play a rhythm game that simulates donkeys mating
- **Was:** Een ritmespel spelen dat de paring van ezels simuleert
- **Pushed:** Een ritmespel spelen dat de paring van Ezels simuleert
- *Rule:* §7.1

**[E0-022] J101 · (quiz — ejiao)**
- **EN:** In China, the rise in demand for a luxury Traditional Chinese Medicine product called 'ejiao' has resulted in how many asses being slaughtered every year?
- **Was:** …ertoe geleid dat er jaarlijks hoeveel ezels worden geslacht?
- **Pushed:** …ertoe geleid dat er jaarlijks hoeveel Ezels worden geslacht?
- *Rule:* §7.1

**[E0-023] J105 · (quiz — Santorini)**
- **EN:** As of 2018, how heavy must a tourist be to be too heavy to ride an ass on the island of Santorini, Greece?
- **Was:** …om op een ezel te rijden op het eiland Santorini in Griekenland?
- **Pushed:** …om op een Ezel te rijden op het eiland Santorini in Griekenland?
- *Rule:* §7.1

**[E0-024] J108 · (quiz — Australia)**
- **EN:** In northwestern Australia, wild asses are shot from government helicopters because:
- **Was:** In het noordwesten van Australië worden wilde ezels neergeschoten vanuit overheidshelikopters omdat:
- **Pushed:** In het noordwesten van Australië worden wilde Ezels neergeschoten vanuit overheidshelikopters omdat:
- *Rule:* §7.1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E1 push 1 — master batch (4 cells)
**Pushed:** 2026-05-12
**Batch file:** `data/editorial/corrections/2026-05-11-master.json` (E1 subset)
**Cells:** 4

### E1_Farm_localization (2 cells)

**[E1-016] J7 · Official Sign**
- **EN:** NEW Government Sponsored Highway: Connecting Urban and Rural Communities
- **Was:** NIEW Overheids-gesubsidiëerde snelweg: brengt stedelijke en landelijke regios in verbinding.
- **Pushed:** NIEUW Overheids-gesubsidieerde snelweg: brengt stedelijke en landelijke regio's in verbinding.
- *Rule:* §15.6A — NIEW→NIEUW + gesubsidiëerde→gesubsidieerde + regios→regio's

**[E1-017] J25 · Thirsty Ass**
- **EN:** This ol' bucket ain't gonna fill itself!
- **Was:** Diej'n emmer gaat z'n eigen nie volscheppen, héé.
- **Pushed:** Diej'n emmer gaat z'n eigen niet volscheppen, héé.
- *Rule:* §2 — nie→niet (universal lock)

### E1_Stable2F_localization (1 cell)

**[E1-018] J47 · Sturdy Ass**
- **EN:** Someone has to sing the Song of Ascension to make sure his Ass Soul can reach the Astral Plane and be reassigned.
- **Was:** Zodat zijn Ezel-Ziel het Astrale Hiernamaals kan bereiken en weer kan herrijzen, iemand moet het Hemelvaarts-zang-der-Ezel-zielen zingen.
- **Pushed:** Iemand moet het Hemelvaarts-zang-der-Ezel-zielen zingen zodat zijn Ziel in het Astrale Hiernamaals heraangesteld kan worden.
- *Rule:* §14.2.1 + §13.5 — Hemelvaarts-zang phrasing lock + Reassignment translation (passive)

### E1_TheProtest_localization (1 cell)

**[E1-019] J6 · Official Sign**
- **EN:** To the south, our state of the art Mill and Granary.
- **Was:** Ten zuiden, onze hoogmoderne Molen en Graanschuur.
- **Pushed:** Naar 't zuiden, onze piekfijne Molen en Graanschuur.
- *Rule:* §15.6D + §15.6C — Ten zuiden→Naar 't zuiden; hoogmoderne→piekfijne

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E1 push 2 — universal sweep (2 cells)
**Pushed:** 2026-05-12
**Batch file:** `data/editorial/corrections/2026-05-12-E1-sweep.json`
**Cells:** 2

### E1_TheProtest_localization (1 cell)

**[E1-020] J54 · Smart Ass**
- **EN:** Here's the Plan!
- **Was:** Dit is het plan!
- **Pushed:** Dit is het Plan!
- *Rule:* §6.9 — EN caps Plan → het Plan (game-system proper noun)

### E1_Stable2F_localization (1 cell)

**[E1-021] J56 · Sturdy Ass**
- **EN:** A life free of evil, soulless, job-taking, child-killing Machines.
- **Was:** Een leven zonder kwaad, zonder zielloze, werk-stelende en moordende Machines.
- **Pushed:** Een leven vrij van slechte, zielloze, werk-afpakkende, kind-dodende Machines.
- *Rule:* §12.2 — Sturdy motto canonical adjective list (werk-afpakkende, kind-dodende)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E2 master batch (20 cells)
**Pushed:** 2026-05-11
**Round-trip:** 0 diffs ✅

### E2_BattleMiner_localization (5 cells)

**[E2-001] J6 · Miner Jenny**
- **EN:** (I always knew you were just a dumb beast.)
- **Was:** Ugh. Ik wist altijd wel dat je maar\neen dom beest bent.
- **Pushed:** Ugh. Ik wist altijd wel dat ge maar\neen dom beest zijt.
- *Rule:* §6.17 — Miner Jenny ge/gij register flip (je→ge, bent→zijt)

**[E2-002] J11 · Miner Jenny**
- **EN:** Miner Jenny uses HEADBUTT!
- **Was:** Mijnwerker Jenny gebruikt DJOEF OP U BAKKES
- **Pushed:** Mijnwerker Jenny gebruikt DJOEF OP U BAKKES!
- *Rule:* §9.3 — terminal ! per EN

**[E2-003] J13 · Miner Jenny**
- **EN:** Miner Jenny uses SHOVEL!
- **Was:** Mijnwerker Jenny gebruikt SCHEP.
- **Pushed:** Mijnwerker Jenny gebruikt SCHUP.
- *Rule:* §6.8 — SCHEP→SCHUP (Flemish shovel-noun lock)

**[E2-004] J14 · Miner Jenny**
- **EN:** EAT SHOVEL, ASS!
- **Was:** EET DEZE SCHEP, KLOOTZAKSKE!!
- **Pushed:** HIER SÉ, KLOOTZAKSKE!!
- *Rule:* §6.8 — taunt rewrite; HIER SÉ = Flemish presenter phrase; drops weapon-naming

**[E2-005] J17 · Foal (UI)**
- **EN:** How will you respond?
- **Was:** Wat is je respons?
- **Pushed:** Wat is je reactie?
- *Rule:* §6.7 — Anglicism respons→reactie

### E2_MinersHouse_localization (4 cells)

**[E2-006] J3 · Miner Jenny**
- **EN:** An Ass? How did you get here from the Mines?
- **Was:** Een Ezel? Hoe ben jij hier van de Mijnen geraakt?
- **Pushed:** Een Ezel? Hoe zijt gij hier van de Mijnen geraakt?
- *Rule:* §6.17 — jij→gij, ben→zijt

**[E2-007] J5 · Miner Jenny**
- **EN:** Quick, I need your help!
- **Was:** Snel, ik heb je hulp nodig!
- **Pushed:** Snel, ik heb uw hulp nodig!
- *Rule:* §6.17 — je→uw (ge/gij register)

**[E2-008] J8 · Miner Jenny**
- **EN:** What, can't you understand me with those dumb Ass ears of yours?
- **Was:** Wat, kan je me niet verstaan met je domme ezelsoren, ofzo?
- **Pushed:** Wat, kunt ge me niet verstaan met uw domme Ezelsoren, ofzo?
- *Rule:* §6.17 — kan je→kunt ge, je→uw; §7.1 Ezel cap

**[E2-009] J9 · Miner Jenny**
- **EN:** Fine. I'LL MAKE SURE YOU DO IT FOR ME.
- **Was:** Oké. IK MAAK ER ZEKER VAN DAT JE 'T VOOR MIJ DOET.
- **Pushed:** Oké. IK MAAK ER ZEKER VAN DAT GE 'T VOOR MIJ DOET.
- *Rule:* §6.17 — JE 'T→GE 'T

### E2_World_A1_localization (2 cells)

**[E2-010] J7 · Sign**
- **EN:** NEW Government-Subsidised Highway: Connecting Urban and Rural Communities
- **Was:** NIEW Overheids-gesubsidiëerde snelweg: brengt stedelijke en landelijke regios in verbinding.
- **Pushed:** NIEUW Overheids-gesubsidieerde snelweg: brengt stedelijke en landelijke regio's in verbinding.
- *Rule:* §15.6A — NIEW→NIEUW, umlaut removed, regio's apostrophe

**[E2-011] J10 · Sign**
- **EN:** Ultramodern Mill and Grain Store
- **Was:** De hoogmoderne Molen en Graanschuur.
- **Pushed:** De piekfijne Molen en Graanschuur.
- *Rule:* §15.6C — hoogmoderne→piekfijne

### E2_World_A2_localization (4 cells)

**[E2-012] J4 · Sign**
- **EN:** 0 DAYS SINCE LAST MINE ACCIDENT
- **Was:** 364 DAGEN SINDS LAATSTE MIJN-ONGEVAL
- **Pushed:** 0 DAGEN SINDS LAATSTE MIJN-ONGEVAL
- *Rule:* §15.6B — narrative-arc reset to 0 post-accident

**[E2-013] J6 · Sign**
- **EN:** Southwest: Ultramodern Mill and Grain Store
- **Was:** Naar 't zuiden, onze piekfijne Molen en Graanschuur.
- **Pushed:** Naar 't zuidwesten, onze piekfijne Molen en Graanschuur.
- *Rule:* §15.6B — zuiden→zuidwesten (EN says southwest)

**[E2-014] J7 · Sign**
- **EN:** NEW Government-Subsidised Highway: Connecting Urban and Rural Communities
- **Was:** NIEW Overheids-gesubsidiëerde snelweg: brengt stedelijke en landelijke regios in verbinding.
- **Pushed:** NIEUW Overheids-gesubsidieerde snelweg: brengt stedelijke en landelijke regio's in verbinding.
- *Rule:* §15.6A — sign typos; colon (not em-dash) for consistency with A1/B1/B2

**[E2-015] J8 · Sign**
- **EN:** Old Mountain Trail to the City
- **Was:** De Lange Weg Naar 't Schrijn in 't Bos.
- **Pushed:** Oud Bergpad Naar de Stad
- *Rule:* §15.6B — re-translate per EN (different sign on A2 vs other sheets); no terminal period per §9.3 (EN has none)

### E2_World_B1_localization (1 cell)

**[E2-016] J7 · Sign**
- **EN:** NEW Government-Subsidised Highway: Connecting Urban and Rural Communities
- **Was:** NIEW Overheids-gesubsidiëerde snelweg: brengt stedelijke en landelijke regios in verbinding.
- **Pushed:** NIEUW Overheids-gesubsidieerde snelweg: brengt stedelijke en landelijke regio's in verbinding.
- *Rule:* §15.6A — sign typos

### E2_World_B2_localization (4 cells)

**[E2-017] J4 · Sign**
- **EN:** 364 DAYS SINCE LAST MINE ACCIDENT
- **Was:** 364 DAGEN SINDS LAATSTE INCIDENT
- **Pushed:** 364 DAGEN SINDS LAATSTE MIJN-ONGEVAL
- *Rule:* §15.6E — INCIDENT→MIJN-ONGEVAL (consistent with other sheets)

**[E2-018] J6 · Sign**
- **EN:** South: Ultramodern Mill and Grain Store
- **Was:** Naar 't zuiden, onze hoogmoderne Molen en Graanschuur.
- **Pushed:** Naar 't zuiden, onze piekfijne Molen en Graanschuur.
- *Rule:* §15.6C — hoogmoderne→piekfijne

**[E2-019] J7 · Sign**
- **EN:** NEW Government-Subsidised Highway: Connecting Urban and Rural Communities
- **Was:** NIEW Overheids-gesubsidiëerde snelweg: brengt stedelijke en landelijke regios in verbinding.
- **Pushed:** NIEUW Overheids-gesubsidieerde snelweg: brengt stedelijke en landelijke regio's in verbinding.
- *Rule:* §15.6A — sign typos

**[E2-020] J10 · Sign**
- **EN:** Ultramodern Mill and Grain Store
- **Was:** De hoogmoderne Molen en Graanschuur.
- **Pushed:** De piekfijne Molen en Graanschuur.
- *Rule:* §15.6C — hoogmoderne→piekfijne


## 2026-05-12 — E3 push (33 cells across 7 sub-tabs)

### Push 1 (4 staged cells)

**[E3-001] E3_BadCave J5 · Foal**
- **EN:** Lazy? Is that you?
- **Was:** Luie? Zijt gij dat?
- **Pushed:** Luie? Ben jij dat?
- *Rule:* §5.3 + §17 Q1 (option C) — Foal flips to je/jij intimate scene with Lazy; `jij` stressed (emphatic per EN "that")

**[E3-002] E3_BadCave J6 · Foal**
- **EN:** Lazy? Is that you?
- **Was:** Luie? Zijt gij dat?
- **Pushed:** Luie? Ben jij dat?
- *Rule:* §5.3 + §17 Q1

**[E3-003] E3_100 J5 · Foal (action context)**
- **EN:** I shouldn't touch the Machines... but what does it do?
- **Was:** 'k Mag de Machines niet aanraken... maar wat doet dat ding?
- **Pushed:** Ik mag de Machines niet aanraken... maar wat doet dat ding?
- *Rule:* §9.6 (diary-sheet uncontracted Ik/Het — overrides §9.1)

**[E3-004] E3_Mine1F J41 · (narrative)**
- **EN:** That day in the Outhouse... I really thought that things would get better.
- **Was:** Die dag in de Hudo... Ik dacht echt dat 't beter ging worden.
- **Pushed:** Die dag in de Plee... Ik dacht echt dat 't beter ging worden.
- *Rule:* §6.1 — HUDO→Plee

### Push 2 (Mine1F sweep — 14 cells)

**[E3-005] J17 · §2** Sorry... Ik ben eigenlijk nie → niet in de stemming om te spelen.
**[E3-006] J19 · §2** *zucht* Omdat uw Nonkel Triestige sommige dagen zelf nie → niet weet waarom hij nog leeft...
**[E3-007] J31 · §2** 't Is nie → niet makkelijk voor hem om terug in de Mijn te zijn. (pushed via RAW — leading apostrophe)
**[E3-008] J33 · §2** 't Is uw schuld nie → niet, maak u geen zorgen. (pushed via RAW)
**[E3-009] J42 · §2** Maar dat is nie → niet gebeurd.
**[E3-010] J45 · §2** Ik was nie → niet snel genoeg om de Stal te redden.
**[E3-011] J49 · §6.16** Misschien komen er geen gouden beelden of dansen of onze oude Beroepen terug → ...beelden of gedans. Of onze oude Jobs. (Tom reword + Beroepen→Jobs)
**[E3-012] J67 · §2** Allez, wilt ge ons wijsmaken dat wij nie → niet weten waar we mee bezig zijn, kleine Kameraad?
**[E3-013] J72 · §2** Dit is—*oef!*—nie → niet wat ik wilde!
**[E3-014] J75 · §2 + §5.4** Zeg me nie → Zegt me niet dat ge—*oef!*—van plan zijt om weg te gaan? (ge/gij imperative -t)
**[E3-015] J78 · §2** Omdat ge meer wilt in 't leven, wilt dat nog nie → niet zeggen dat ge uw thuis moet achterlaten!
**[E3-016] J79 · §3.1** Ik droom ervan om hier in Muilebeek → Muilenbeek een caféke te maken...
**[E3-017] J84 · §2** Nee... *oef!*—Waarschijnlijk nie → niet.
**[E3-018] J136 · §3.1 + §6.16** Als de Mensen niet terugkomen naar Muilebeek → Muilenbeek, krijgen we onze Beroepen → Jobs nooit terug...

### Push 3 (BadCave sweep — 5 cells)

**[E3-019] J20 · §2** Maar 'k ben daar nie → niet zo zeker van.
**[E3-020] J21 · §2 · Bad Ass** Kom mij nie → niet af met die anti-Machine Kameraad Moeder-zever.
**[E3-021] J22 · §2 · Bad Ass** Machines zijn nie → niet slecht als ge weet hoe ze te gebruiken.
**[E3-022] J26 · §2 · Bad Ass** Ze zijn logisch en worden nie → niet emotioneel. Ze kunnen alles oplossen.
**[E3-023] J35 · §2 + §7.1** Sla gewoon nie → niet op de ezels → Ezels.

### Push 4 (LazysGrave sweep — 3 cells)

**[E3-024] J8 · §2 · Foal grief-register** Zijt gij nie → niet... (gij/uw kept per §17 Q1)
**[E3-025] J17 · §2 · Foal** Waarom is uw Ezelenziel nie → niet naar het Astrale Hiernamaals gegaan?
**[E3-026] J25 · §2** Geen uitweg?! Ik wil hier nie → niet doodgaan!

### Push 5 (E3_100 diary + newspaper — 4 cells)

**[E3-027] J7 · Butte's Log · §9.2 + §7.1**
- Ik Heb vandaag → Ik heb vandaag
- mijn ezels (×2) → mijn Ezels

**[E3-028] J10 · Butte's Log · §9.2 + §7.1**
- Ik Ga → Ik ga
- Ik Ben → Ik ben
- mijn ezels → mijn Ezels

**[E3-029] J11 · Butte's Log (duplicate of J10)** — same fix as J10

**[E3-030] J16 · Fannyside Times · §3.4.1 + §7.1 + §8.2**
- Boormachine → Boor-Machine (§8.2)
- Mecha Algemeen Ziekenhuis → Imechelda Algemeen Ziekenhuis (§3.4.1 — NEW canon entry)
- Eén ezel → Eén Ezel (§7.1)

### Push 6 (E3_200 — 1 cell)

**[E3-031] J3 · Butte's Log · §9.2 + §7.1 + §3.6 + §3.1**
- Ik Ben → Ik ben
- Ik Denk → Ik denk
- mijn depressieve ezel → mijn depressieve Ezel
- Boerderij van Muilebeek → Hoeve van Muilenbeek

### Push 7 (E3_300 + DonkeyBas — 2 cells)

**[E3-032] E3_300 J3 · Butte's Log · §7.1**
- mijn ezels kopen? → mijn Ezels kopen?

**[E3-033] E3_DonkeyBas J17 · §7.1**
- Ge moet 5 Kuddes ezels ontwijken → Ge moet 5 Kuddes Ezels ontwijken om te winnen.

### Tooling note
- 2 cells (Mine1F J31, J33) initially lost their leading apostrophe via USER_ENTERED input. Re-pushed via RAW. `scripts/convert/push-file.py` patched to auto-route any `'`-leading value through RAW. Retcon scan E0–E10: 0 corpus regressions.

### Round-trip
- Final pull-snapshot vs local: **0 diffs** across all E3 sheets.

