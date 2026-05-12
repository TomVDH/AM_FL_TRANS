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

