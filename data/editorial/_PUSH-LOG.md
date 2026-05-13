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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 2026-05-12 — E4 push (8 cells across 4 sub-tabs)
**Batch files:** `data/editorial/corrections/2026-05-11-master.json` (5 cells, E4 subset) + `data/editorial/corrections/2026-05-12-E4-sweep.json` (3 cells)
**File:** `4_asses.masses_E4Proxy.xlsx`

### Push 1 — master batch (5 cells)

**[E4-001] E4_HerdSplits J62 · Thirsty Ass · §4.4**
- Lieve Ezel → Schoon Beest
- *Rule:* §4.4 exception — Thirsty's signature nickname for Nice Ass preserved.

**[E4-002] E4_KicksGoodbye J5 · Kick Ass · §13.5**
- ZIEL herverkoren wordt → ZIEL heraangesteld wordt
- *Rule:* §13.5 Reassignment translation lock.

**[E4-003] E4_AstralPlaneMain J89 · Tight Ass · §13.5**
- herverkoren te worden → heraangesteld te worden
- *Rule:* §13.5 Reassignment translation lock.

**[E4-004] E4_AstralPlaneMain J221 · DJ Dope Ass · §6.13**
- BEDANKT VOOR BUITEN TE KOMEN VOOR MIJN SET!! → MERCI VOOR NAAR MIJN SET TE KOMEN!!!
- *Rule:* §6.13 DJ welcome rephrase (drops Anglicism `voor buiten te komen`; adopts Flemish `Merci` + `voor [te-infinitive]`; triple `!` matches DJ energy).

**[E4-005] E4_Mine1F J23 · Sturdy Ass (Old Ass repeater) · §14.1**
- EZEL MACHT! → EZELS EERST!
- *Rule:* §14.1 slogan canonical form.

### Push 2 — universal sweep (3 cells)

**[E4-006] E4_HerdSplits J10 · Kick Ass · §3.1**
- terug te komen naar Muilebeek, sinds de Brand → terug te komen naar Muilenbeek, sinds de Brand
- *Rule:* §3.1 Muilebeek → Muilenbeek (corpus-wide lock).

**[E4-007] E4_HerdSplits J63 · Nice Ass · §3.1**
- Weg van Muilebeek verhuizen? → Weg van Muilenbeek verhuizen?
- *Rule:* §3.1 Muilebeek → Muilenbeek (corpus-wide lock).

**[E4-008] E4_AstralPlaneMain J127 · HAW donkey · §2 + accent polish**
- ik moet van Mensen nie hebben omdat mijn famille neergekogelt hebben van hun helikokters → ik moet van Mensen niet hebben omdat ze myn famille neergekogelt hebben van hun helikolopters
- *Rule:* §2 universal `niet`; added `ze` subject pronoun + accent distortions (`mijn → myn`, `helikokters → helikolopters`) per Tom 2026-05-12. EN distortions (`hayte`, `thehr`, `helicoptahs`) preserved in NL equivalents.

### Sweep notes
- **E4_HerdSplits J32 (Smart Ass):** EN `we get our JOBS BACK` left lowercase `jobs` — parallel to E2 Bad Ass precedent (canon §6.16 generic reclaim-work reading, not game-system). Canon updated to add J32 to stay-lowercase exception list.
- **E4_HerdSplits J62:** false-positive flag (Schoon Beest is the locked §4.4 exception, just pushed in Push 1).

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 8 cells.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 2026-05-12 — E5 push (23 cells across 3 sub-tabs, 3 pushes)
**Batch files:** `data/editorial/corrections/2026-05-11-master.json` (3 cells Circusdirecteur lc — Push 1, later reverted) + ad-hoc Push 2 sweep (19 cells) + ad-hoc Push 3 revert (6 cells)
**File:** `5_asses.masses_E5Proxy.xlsx`

### Push 1 — Circusdirecteur lc retcon (3 cells) — LATER REVERSED

**[E5-001] E5_CircusMain J45 · Smart Ass · §7.2 + §18 (REVERSED)**
- Wanneer de Circusdirecteur mijn routine ziet kondigt ie meteen een Wereldtournee aan! → Wanneer de circusdirecteur mijn routine ziet kondigt ie meteen een wereldtournee aan!
- *Rule:* §7.2 + §18 lc retcon (2026-05-11). **REVERSED in Push 3** — Tom 2026-05-12 locks `Circusdirecteur` + `Wereldtournee` cap-always.

**[E5-002] E5_CircusMain J121 · Big Ass · §7.2 (REVERSED)**
- Uw duet met de Circusdirecteur ontroerde me! → Uw duet met de circusdirecteur ontroerde me!
- *Rule:* §7.2 lc retcon. **REVERSED in Push 3.**

**[E5-003] E5_CircusMain J221 · Melvin · §7.2 (REVERSED)**
- Wacht, wat als die vieze Circusdirecteur met onze voeten speelt? → Wacht, wat als die vieze circusdirecteur met onze voeten speelt?
- *Rule:* §7.2 lc retcon. **REVERSED in Push 3.**

### Push 2 — universal sweep (19 cells)

**[E5-004] E5_CircusMain J21 · Ringmaster Rico · §6.10**
- Alle actes van vanavond zullen het visuele spektakel, het gevaar, het lef van de acte tevoren overtreffen! → Alle Nummers van vanavond zullen het visuele spektakel, het gevaar, het lef van het Nummer tevoren overtreffen!
- *Rule:* §6.10 acte/actes → Nummer/Nummers (cap, full form) + article shift `de acte` → `het Nummer` (neuter).

**[E5-005] E5_CircusMain J25 · Ringmaster Rico · §6.16**
- Het is verdorie hun job! → Het is verdorie hun Job!
- *Rule:* §6.16 job→Job (game-system context, Ringmaster on circus performers' assigned Jobs).

**[E5-006] E5_CircusMain J26 · Ringmaster Rico · §6.16**
- En over jobs gesproken, we zouden hier vanavond niet staan zonder de steun van onze sponsor... → En over Jobs gesproken, we zouden hier vanavond niet staan zonder de steun van onze sponsor...
- *Rule:* §6.16 jobs→Jobs (continues J25 game-system context).

**[E5-007] E5_CircusMain J73 · Ringmaster Rico · §6.10**
- Nee, wacht! Ik beloof dat onze volgende actes de moeite waard zijn! → Nee, wacht! Ik beloof dat onze volgende Nummers de moeite waard zijn!
- *Rule:* §6.10 actes→Nummers.

**[E5-008] E5_CircusMain J132 · Kick Ass · §6.16**
- Ge hebt gelijk — dit is de BESTE job — die we ooit hebben gehad! → Ge hebt gelijk — dit is de BESTE Job — die we ooit hebben gehad!
- *Rule:* §6.16 job→Job (game-system — Kick Ass on circus Job).

**[E5-009] E5_CircusMain J167 · Slow Ass · §6.12**
- *puf puf* Ik z-z-zweet al zo nijg, gewoon van d-d-de adrenaline... → *puf puf* Ik z-z-zweet al zo fel, gewoon van d-d-de adrenaline...
- *Rule:* §6.12 nijg→fel.

**[E5-010] E5_CircusMain J168 · Smart Ass · §7.2 + §18 (Tournee component REVERSED)**
- De Circusdirecteur kan het niet veroorloven van je telkens nieuwe kostuums te kopen voordat we op Tournee gaan. → De circusdirecteur kan het niet veroorloven van je telkens nieuwe kostuums te kopen voordat we op tournee gaan.
- *Rule:* §7.2 + §18 lc retcon. **REVERSED in Push 3** — both `Circusdirecteur` and `Tournee` re-capped per cap-always lock.

**[E5-011] E5_CircusMain J176 · Slow Ass · §6.12**
- *puf puf* Ik z-z-zweet al zo nijg, gewoon van d-d-de adrenaline... → *puf puf* Ik z-z-zweet al zo fel, gewoon van d-d-de adrenaline...
- *Rule:* §6.12 nijg→fel (duplicate of J167).

**[E5-012] E5_CircusMain J177 · Smart Ass · §7.2 + §18 (REVERSED)**
- De Circusdirecteur kan het niet veroorloven van je telkens nieuwe kostuums te kopen voordat we op Tournee gaan. → De circusdirecteur kan het niet veroorloven van je telkens nieuwe kostuums te kopen voordat we op tournee gaan.
- *Rule:* Duplicate of J168. **REVERSED in Push 3.**

**[E5-013] E5_CircusMain J195 · Ringmaster Rico · §10.1**
- Ik ga er geen doekjes rond winden, mensen. Dat kon beter. → Ik ga er geen doekjes om winden, mensen. Dat kon beter.
- *Rule:* §10.1 `doekjes rond winden` → `doekjes om winden` (idiom — Patrick flagged).

**[E5-014] E5_CircusMain J215 · Wedgie · §7.1**
- Waar zit de laatste ezel? → Waar zit de laatste Ezel?
- *Rule:* §7.1 Ezel cap.

**[E5-015] E5_CircusMain J217 · Ringmaster Rico · §7.1**
- Mijn show heeft meer robots dan ezels in goedkope kostuums nodig als ik de zaal met wat anders dan marginalen wil opvullen. → Mijn show heeft meer robots dan Ezels in goedkope kostuums nodig als ik de zaal met wat anders dan marginalen wil opvullen.
- *Rule:* §7.1 ezels→Ezels. (`robots` left lowercase — no §7 Robot cap rule.)

**[E5-016] E5_CircusMain J218 · Ringmaster Rico · §7.1**
- Het is niet persoonlijk, ezeltje. → Het is niet persoonlijk, Ezeltje.
- *Rule:* §7.1 ezeltje→Ezeltje.

**[E5-017] E5_CircusMain J220 · Wedgie · §7.1**
- Kom, ezel. De camion in. → Kom, Ezel. De camion in.
- *Rule:* §7.1 ezel→Ezel.

**[E5-018] E5_CircusMain J245 · Derriere · §6.16**
- Ze verdienden betekenisvolle jobs! → Ze verdienden betekenisvolle Jobs!
- *Rule:* §6.16 jobs→Jobs (game-system — donkeys' assigned Jobs).

**[E5-019] E5_ZooMain J120 · Sad Ass · §6.16**
- Dat ik met een nieuwe job in een nieuwe plek... aan een nieuwe start kon beginnen. → Dat ik met een nieuwe Job in een nieuwe plek... aan een nieuwe start kon beginnen.
- *Rule:* §6.16 job→Job (game-system — Sad Ass dreams of a new assigned Job).

**[E5-020] E5_ZooMain J224 · Grandma Kulan · §7.1**
- Danku ezeltje! → Danku Ezeltje!
- *Rule:* §7.1 ezeltje→Ezeltje.

**[E5-021] E5_ZooCapture J30 · Wedgie · §7.1**
- Dit de ezels? → Dit de Ezels?
- *Rule:* §7.1 ezels→Ezels.

**[E5-022] E5_ZooCapture J33 · Zookeeper Rose · §7.1**
- Het spijt me ezeltjes. → Het spijt me Ezeltjes.
- *Rule:* §7.1 ezeltjes→Ezeltjes.

### Push 3 — §7.2 cap-everywhere revert (6 cells)

Tom 2026-05-12: reversed the 2026-05-11 lc retcon on `Circusdirecteur` / `Wereldtournee` / bare `Tournee`. All three are cap-always proper nouns (game-system circus terms, parallel to Ezel/Job).

**[E5-023] E5_CircusMain J45 · Smart Ass · §7.2 revert**
- Wanneer de circusdirecteur mijn routine ziet kondigt ie meteen een wereldtournee aan! → Wanneer de Circusdirecteur mijn routine ziet kondigt ie meteen een Wereldtournee aan!

**[E5-024] E5_CircusMain J58 · Smart Ass · §7.2 revert (also new cap fix)**
- Wanneer de circusdirecteur mijn routine ziet kondigt ie meteen een wereldtournee aan! → Wanneer de Circusdirecteur mijn routine ziet kondigt ie meteen een Wereldtournee aan!
- *Note:* J58 was on remote as lc (model for the now-reversed §18 retcon). New cap-always fix.

**[E5-025] E5_CircusMain J121 · Big Ass · §7.2 revert**
- Uw duet met de circusdirecteur ontroerde me! → Uw duet met de Circusdirecteur ontroerde me!

**[E5-026] E5_CircusMain J168 · Smart Ass · §7.2 revert**
- De circusdirecteur kan het niet veroorloven ... voordat we op tournee gaan. → De Circusdirecteur kan het niet veroorloven ... voordat we op Tournee gaan.

**[E5-027] E5_CircusMain J177 · Smart Ass · §7.2 revert**
- De circusdirecteur kan het niet veroorloven ... voordat we op tournee gaan. → De Circusdirecteur kan het niet veroorloven ... voordat we op Tournee gaan.

**[E5-028] E5_CircusMain J221 · Melvin · §7.2 revert**
- Wacht, wat als die vieze circusdirecteur met onze voeten speelt? → Wacht, wat als die vieze Circusdirecteur met onze voeten speelt?

### Sweep notes
- **§6.16 J106 + J131 (E5_CircusMain Smart Ass):** EN `Finding another job with no Machines isn't going to be easy.` left lowercase `job` — identical wording to E5_ZooMain J199/J208 stay-lc exception; same speaker (Smart Ass), same generic-reclaim theme. Canon §6.16 exception list extended to include J106 + J131.
- **§7.2 reversal:** 2026-05-11 retcon (lc mid-sentence for Circusdirecteur, lc Wereldtournee) **REVERSED 2026-05-12** by Tom. Both terms are cap-always proper nouns. Bare `Tournee` (without Wereld- prefix) also caps by extension. Canon §7.2 + §18 updated to reflect reversal.
- **J78 `TOURNEE` (all-caps):** Kept as-is — mirrors EN `THE TOUR?` all-caps emphasis convention. Not a cap-vs-lc question.
- **§5.4 Stop imperative (J128, J76):** Both left as-is — `Stop` reads natural as informal imperative loanword in Smart Ass / Slow Ass register.
- **E5_Highway J15:** Already capped on remote — `Wat zei ik je! Jobs!` (no action needed; canon §6.16 sweep list entry was stale).
- **E5_CircusMain J38 `acteur`:** False-positive substring match — `acteur` (actor) is a different word from `acte`/`actes`, correctly bounded by regex `\b` in scanner.

### Tooling
- New scanner `scripts/editorial/e5_sweep_scan.py` (copy of e4 + 5 patterns: §6.10 Acte, §6.12 Nijg, §10.1 doekjes rond, §18 Wereldtournee, §7.2 Circusdirecteur drift). Speaker extraction switched from col B (Description) to col A (Key suffix) for accuracy.
- New helper `scripts/editorial/e5_apply_sweep.py` for Push 2 batch write.

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 23 cells** (all 3 pushes combined).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E6 Push 1 — staged cells (9 cells)
**Pushed:** 2026-05-12
**File:** `6_asses.masses_E6Proxy.xlsx`
**Cells:** 9

| Sheet | Cell | Was | Pushed | Rule |
|---|---|---|---|---|
| E6_Nightmare_localization | J4 | `…—je ziet MIJ toch niet indutten.` | `…—ge ziet MIJ toch niet indutten.` | §6.17 Jenny ge/gij |
| E6_Nightmare_localization | J5 | `Jij gaat vandaag met mij mee…` | `Gij gaat vandaag met mij mee…` | §6.17 |
| E6_Nightmare_localization | J28 | `…STUK STRONT DAT JE BENT?!` | `…STUK STRONT DAT GE ZIJT?!` | §6.17 |
| E6_Nightmare_localization | J40 | `OMDAT JE ME VERMOORD HEBT!` | `OMDAT GE ME VERMOORD HEBT!` | §6.17 |
| E6_World_localization | J144 | `"Trouwe Ezel, Vreedzaam in de Put"` | kept (Tom 2026-05-12) | Q18 re-resolved |
| E6_World_localization | J145 | `"Trouwe Ezel, Vreedzaam in de Put"` | kept | Q18 |
| E6_World_localization | J162 | `"…van Muilebeek"` | `"…van Muilenbeek"` | §3.1 |
| E6_World_localization | J163 | `"…van Muilebeek"` | `"…van Muilenbeek"` | §3.1 |
| E6_World_localization | J164 | `"Boerderij en Tevredenheid"` | `"Hoeve en Tevredenheid"` | §3.6 |
| E6_World_localization | J165 | `"Boerderij en Tevredenheid"` | `"Hoeve en Tevredenheid"` | §3.6 |
| E6_Stable2F_localization | J3 | `…opnieuw is toegewezen…` | `…is heraangesteld…` | §13.5 |
| E6_BattleHard_localization | J8 | `…voor jansen, héé.` | accepted Patrick's `…voor u, héé.` (no push) | §6.11 |

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 9 cells**.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🎯 E6 Push 2 — universal sweep (23 cells)
**Pushed:** 2026-05-12
**File:** `6_asses.masses_E6Proxy.xlsx`
**Cells:** 23

| Sheet | Cell | Was | Pushed | Rule |
|---|---|---|---|---|
| E6_Nightmare_localization | J3 | `…nutteloze ezel!` | `…nutteloze Ezel!` | §7.1 |
| E6_Nightmare_localization | J6 | `…luie ezel samen…` | `…luie Ezel samen…` | §7.1 |
| E6_Nightmare_localization | J29 | `…sorry ezel…` | `…sorry Ezel…` | §7.1 |
| E6_BadCave_localization | J14 | `Maakt nie uit.` | `Maakt niet uit.` | §2 |
| E6_BadCave_localization | J25 | `…toch nie begrijpen.` | `…toch niet begrijpen.` | §2 |
| E6_BadCave_localization | J55 | `Jansen, …'k wil nie herinnerd…ezel.` | `Kleine, …wil ik niet herinnerd…Ezel.` | §6.11+§2+§7.1 |
| E6_World_localization | J6 | `…op je post, Kameraad.` | `…op je post.` | §12.1 |
| E6_World_localization | J14 | `…verlaten, Kameraad.` | `…verlaten.` | §12.1 |
| E6_World_localization | J15 | `…beschermd worden, Kameraad.` | `…beschermd worden.` | §12.1 |
| E6_World_localization | J41 | `…van de Boerderij naartoe—` | `…van de Hoeve naartoe—` | §3.6 |
| E6_World_localization | J47 | `…van de Boerderij naartoe—` | `…van de Hoeve naartoe—` | §3.6 |
| E6_World_localization | J78 | `…laten zien, Kameraad?` | `…laten zien?` | §12.1 |
| E6_World_localization | J161 | `…van Muilebeek.` | `…van Muilenbeek.` | §3.1 |
| E6_World_localization | J179 | `Is het nie een prachtige dag?` | `Is het niet een prachtige dag?` | §2 |
| E6_World_localization | J190 | `…zijn nie zo eenzaam…` | `…zijn niet zo eenzaam…` | §2 |
| E6_World_localization | J203 | `…zit ze nie in de problemen…` | `…zit ze niet in de problemen…` | §2 |
| E6_World_localization | J214 | `…van den boerderij, héé!` | `…van de Hoeve, héé!` | §3.6 |
| E6_World_localization | J219 | `…te vieren, Kameraad?` | `…te vieren?` | §12.1 |
| E6_World_localization | J249 | `…er nie bij is, héé.` | `…er niet bij is, héé.` | §2 |
| E6_World_localization | J302 | `…hemme nie allemaal…` | `…hemme niet allemaal…` | §2 |
| E6_World_localization | J314 | `…weet nie goed…zijn nie verantwoordelijk…` | `…weet niet goed…zijn niet verantwoordelijk…` | §2 ×2 |
| E6_World_localization | J317 | `…het nie zou zeggen.` | `…het niet zou zeggen.` | §2 |
| E6_World_localization | J336 | `…als we nie allemaal…` | `…als we niet allemaal…` | §2 |

### Notes
- §10.7 `slokske` locked (found in CUT lines J70/J71 — no push needed)
- §12.2 J142 Sturdy motto verified clean (canonical adjective list present)

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 23 cells**.

## 🎯 E7 Push — universal sweep (8 cells)

| Sheet | Cell | Before | After | Rule |
|---|---|---|---|---|
| E7_Opening_localization | J5 | `…om deze job te verliezen…` | `…om deze Job te verliezen…` | §6.16 |
| E7_Opening_localization | J12 | `…om ezels op te halen…` | `…om Ezels op te halen…` | §7.1 |
| E7_Holding1_localization | J8 | `We zijn nie meer in het Circus…` | `We zijn niet meer in het Circus…` | §2 |
| E7_ShippingTwo_localization | J5 | `…ontsnapte ezels binnen de Fabriek.` | `…ontsnapte Ezels binnen de Fabriek.` | §7.1 |
| E7_ShippingTwo_localization | J7 | `…ontsnapte ezels!` | `…ontsnapte Ezels!` | §7.1 |
| E7_ShippingTwo_localization | J9 | `De ezels zijn los!` | `De Ezels zijn los!` | §7.1 |
| E7_ShippingTwo_localization | J12 | `…mijn ezels heeft losgelaten…` | `…mijn Ezels heeft losgelaten…` | §7.1 |
| E7_BigBattle_localization | J10 | `Hallo ezeltje…` | `Hallo Ezeltje…` | §7.1 |

### Tooling
- `scripts/editorial/e7_sweep_scan.py` (E6 ruleset unchanged; §6.11 jansen flag-only)

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 8 cells**.

## 🎯 E7 Push 2 — register retro tested + REVERTED (Q19 addendum)

| Sheet | Cell | Speaker | Test push | Final state (after revert) | Rule |
|---|---|---|---|---|---|
| E7_Holding2_localization | J18 | Resentful Ass | tried `Je hebt geluk, je hebt nog een deel van je Kudde.` | **kept `Gij hebt geluk, gij hebt nog een deel van uw Kudde. Voorlopig dan toch.`** | Q19 addendum |

### Notes
- Gap discovered post-E7-commit: scanner had no je/jij ↔ ge/gij register check (only §7.4 God-cap). Initial diagnosis: Resentful Ass je/jij default + formal-address exception → `gij` forbidden. Pushed `gij→je` fix.
- Tom 2026-05-12 reversed: Resentful Ass cold/distant peer address keeps `gij`+`uw`. Canon Q19 amended — Resentful Ass now has three permitted modes: je/jij default, formal u/uw exception, cold-peer `gij`+`uw` exception.
- Register scanner (when built) must NOT flag Resentful Ass `gij` use.
- TODO retained: extend scanner with register check (ge/gij speakers using je/jij/jou/jouw; je/jij speakers using gij/zijt/hebde excluding Resentful Ass), then retro-scan E0–E9.

### Round-trip
- Fwd push (gij→je) round-trip: **0 diffs** (`excels.fresh-pull-2026-05-12-e7-verify2/`).
- Revert push (back to gij) round-trip: **0 diffs** (`excels.fresh-pull-2026-05-12-e7-verify3/`).

## 🎯 E8 Push — universal sweep (9 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E8_SanctumMain_localization | J17 | Trusty Ass | `…op de Boerderij!` | `…op de Hoeve!` | §3.6 |
| E8_TheGods_localization | J6 | THE GODS | `uw aanwezigheid…` | `Uw aanwezigheid…` | §7.4 |
| E8_TheGods_localization | J14 | Haw | `uw herinneringen…opdat uw Ziel…` | `Uw herinneringen…opdat Uw Ziel…` | §7.4 |
| E8_TheGods_localization | J15 | Haw | `Bereid u voor…` | `Bereid U voor…` | §7.4 |
| E8_TheGods_localization | J22 | Hee | `dat uw Ziel…` | `dat Uw Ziel…` | §7.4 |
| E8_TheGods_localization | J33 | Haw | `met u samen…` | `met U samen…` | §7.4 |
| E8_TheGods_localization | J40 | Hee | `Neen, uw Ziel…` | `Neen, Uw Ziel…` | §7.4 |
| E8_TheGods_localization | J42 | THE GODS | `danken u voor uw dienst` | `danken U voor Uw dienst` | §7.4 |
| E8_TheGods_localization | J43 | THE GODS | `Bereid u voor…met uw Goden.` | `Bereid U voor…met Uw Goden.` | §7.4 |

### Tooling
- `scripts/editorial/e8_sweep_scan.py` (E7 ruleset + §7.4 Gods U/Uw primary focus)

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 9 cells**.

## 🎯 E9 Push — universal sweep (8 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E9_GoldenAss_localization | J10 | Cole-Machine | `…in nen ezel veranderd!` | `…in nen Ezel veranderd!` | §7.1 |
| E9_GoldenAss_localization | J19 | Golden Ass | `Wij spreken tot u…` | `Wij spreken tot U…` | §7.4 |
| E9_GoldenAss_localization | J47 | Golden Ass | `Eén van u beide Machines…` | `Eén van U beide Machines…` | §7.4 |
| E9_GoldenAss_localization | J83 | Golden Ass | `Gij weet in uw Ziel…` | `Gij weet in Uw Ziel…` | §7.4 |
| E9_GoldenAss_localization | J130 | Golden Ass | `…om uw Beweging te steunen.` | `…om Uw Beweging te steunen.` | §7.4 |
| E9_BadCave_localization | J9 | {$NewName} | `…om een ezel te zijn?` | `…om een Ezel te zijn?` | §7.1 |
| E9_BadCave_localization | J14 | Cole-Machine | `…vooroordeel tegen ezels…` | `…vooroordeel tegen Ezels…` | §7.1 |
| E9_BadCave_localization | J24 | Cole-Machine | `…niet veilig voor ezels.` | `…niet veilig voor Ezels.` | §7.1 |

### Verify-only (no edit)
- `E9_BadCave_localization` J43: Sturdy motto — EN has 3 adjectives, NL matches; defer per EN-co-authoritative rule.
- `E9_BadCave_localization` J68: Sturdy motto fragment `Zielloze Machines kunnen niet praten.` already canonical.
- `E9_MineEscape_localization` J18–J21: Sturdy motto cascade — already canonical 4-adjective form.

### Tooling
- `scripts/editorial/e9_sweep_scan.py` (E8 ruleset unchanged; §7.4 GoldenAss + §7.1 Ezel caps primary focus)

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 8 cells**.

## 🎯 E9 Push 2 (tail) — §5.4 ge/gij imperative sweep (5 cells)

Triggered by §23 audit of original E9 sweep: scanner §5.4 regex only matched `Stop`; manual re-scan across all ge/gij speakers caught 5 Cole-Machine bare-stem imperatives previously missed.

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E9_BadCave_localization | J34 | Cole-Machine | `Geef mij een minuutje.` | `Geeft mij een minuutje.` | §5.4 |
| E9_BadCave_localization | J63 | Cole-Machine | `Stevige. Stop.` | `Stevige. Stopt.` | §5.4 |
| E9_BadCave_localization | J64 | Cole-Machine | `Probeer de machine niet kapot…` | `Probeert de Machine niet kapot…` | §5.4 + §7.3 |
| E9_BadCave_localization | J81 | Cole-Machine | `Luister Stevige.` | `Luistert Stevige.` | §5.4 |
| E9_GoldenAss_localization | J135 | Cole-Machine | `Ga dan.` | `Gaat dan.` | §5.4 (`gaan` irregular) |

### Verified clean (stem ends in -t, no doubling needed)
- E9_GoldenAss J42 Hee `Wacht…`
- E9_GoldenAss J92 / J142 Golden Ass `Laat ons vertrekken, Profeet.`
- E9_GoldenAss J101 Cole-Machine `Laat uw Moeder niet in de steek.`

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 5 cells**.

## 🎯 E6 Push 4 (tail) — missed §13.3 cell (1 cell)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E6_World_localization | J160 | Sturdy Ass | `Oh liefste Goden.` | `Geprezen zijn de Goden.` | §13.3 |

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 1 cell**.

## 🎯 E10 Push — universal sweep (26 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E10_Hard_localization | J44 | Thirsty Ass | `…naar onze Boerderij…` | `…naar onze Hoeve…` | §3.6 |
| E10_Government_localization | J6 | Radio Host Marcos | `…overrompeld door ezels.` | `…overrompeld door Ezels.` | §7.1 |
| E10_Government_localization | J23 | Golden Ass | `…van uw kaliber ontmoeten!` | `…van Uw kaliber ontmoeten!` | §7.4 |
| E10_Government_localization | J25 | Edgy Ass | `Da kan nie...` | `Da kan niet...` | §2 |
| E10_Government_localization | J61 | Golden Ass | `Verspreid u, Vazallen.` | `Verspreid U, Vazallen.` | §7.4 |
| E10_Government_localization | J65 | Golden Ass | `Nadat gij uw Manifest…` | `Nadat gij Uw Manifest…` | §7.4 |
| E10_Government_localization | J93 | Golden Ass | `Spreid u uit, Vazallen.` | `Spreid U uit, Vazallen.` | §7.4 |
| E10_Government_localization | J97 | Golden Ass | `Nadat gij uw Manifest…` | `Nadat gij Uw Manifest…` | §7.4 |
| E10_Government_localization | J145 | Big Ass | `…achtergelaten, Kameraad.` | `…achtergelaten.` | §12.1 |
| E10_Government_localization | J148 | Bleak Ass | `Tank Machines... Vlieg Machines...` | `Tank-Machines... Vlieg-Machines...` | §8.2 |
| E10_Government_localization | J163 | Helpful Ass | `Ge gaat nie geloven…` | `Ge gaat niet geloven…` | §2 |
| E10_Government_localization | J169 | Helpful Ass | `Dus 'k heb nen job gevonden…` | `Dus 'k heb een job gevonden…` | pre-staged (article normalization) |
| E10_Government_localization | J172 | Helpful Ass | `…ge gaat 't nie geloven…` | `…ge gaat 't niet geloven…` | §2 |
| E10_Government_localization | J179 | Helpful Ass | `'k Wou ook nie omgekapt…` | `'k Wou ook niet omgekapt…` | §2 |
| E10_Government_localization | J182 | Helpful Ass | `…en ge gaat 't nie geloven…` | `…en ge gaat 't niet geloven…` | §2 |
| E10_Government_localization | J252 | Golden Ass | `…om u tot de mensen te wenden?` | `…om U tot de mensen te wenden?` | §7.4 |
| E10_Government_localization | J269 | Golden Ass | `Gij moogt u bij ons voegen…` | `Gij moogt U bij ons voegen…` | §7.4 |
| E10_Government_localization | J270 | Golden Ass | `Gij moogt u bij ons voegen…` | `Gij moogt U bij ons voegen…` | §7.4 |
| E10_ProphetSpeech_localization | J6 | Golden Ass | `Mogen uw volgelingen…als uw eerste heilige Mis.` | `Mogen Uw volgelingen…als Uw eerste heilige Mis.` | §7.4 |
| E10_ProphetSpeech_localization | J109 | Big Ass | `EZELKRACHT!` | `EZELS EERST!` | §14.1 (pre-staged) |
| E10_ProphetSpeech_localization | J111 | Hard Ass | `EZELKRACHT!` | `EZELS EERST!` | §14.1 (pre-staged) |
| E10_Epilogue_localization | J20 | Cole-Machine | `De volgende Boerderij…` | `De volgende Hoeve…` | §3.6 |
| E10_Epilogue_localization | J33 | {$NewName} | `De volgende Boerderij…` | `De volgende Hoeve…` | §3.6 |
| E10_Credits_localization | J73 | (107) Peek Ass | `Constat-ezel` | `Constat-Ezel` | §7.1 |
| E10_Credits_localization | J74 | (108) Blunt Ass | `Groffe ezel` | `Groffe Ezel` | §7.1 |
| E10_Credits_localization | J116 | (41) ASS POWER | `EZELSKRACHT` | `EZELS EERST` | §14.1 (pre-staged) |

### Verify-only (no edit)
- `E10_Hard_localization` J21 The Masses: `Stop niet met drukken!` — negated imperative, EN ↔ NL register match.
- `E10_Government_localization` J167 / J169-headword / J176 Helpful Ass: lowercase `job` (in-character anecdote, not game-system); kept lowercase per EN-co-authoritative rule (EN has lowercase "job"). J169 also pre-staged article fix `nen → een` (article normalization, pushed in this batch).
- `E10_Government_localization` J232 Speaker 23: `Stop met Ezels af te schilderen…` — EN starts with "Stop" imperative; NL mirrors directly.

### Tooling
- `scripts/editorial/e10_sweep_scan.py` (E9 ruleset unchanged; ProphetSpeech §7.4 GoldenAss + §14.1 slogan retirement + §3.6 Boerderij→Hoeve primary focus)

### Push breakdown
- 22 sweep cells applied via corrections JSON.
- 4 pre-staged cells (already in local from prior session, pushed in this batch): J109/J111 ProphetSpeech, J116 Credits (all §14.1 slogan retcon), J169 Government (article normalization).

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 26 cells**.

## 🎯 E10 Push 2 — register drift fixes (3 cells)

Follow-up sweep after §16 ge/gij audit. All in `E10_Government_localization`.

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E10_Government_localization | J76 | Skinny Ass | `…Ge weet niet hoe dat is.` | `…Je weet niet hoe dat is.` | §5.0 (Skinny canon je/jij; `ge` = forbidden drift) |
| E10_Government_localization | J158 | Gaunt Ass | `Ge hebt gehoord…` | `Je hebt gehoord…` | §5.0 (Gaunt canon je/jij; `ge` = forbidden drift) |
| E10_Government_localization | J203 | Resentful Ass | `…ik wil u niet beledigen als ge dat graag hebt.` | `…ik wil u niet beledigen als je dat graag hebt.` | §5.0 + §5.1 (`u` kept = valid formal-Gods exception addressing Golden Ass; `ge` = drift, flipped) |

### Canon update (no cell impact)
- **Helpful Ass moved from je/jij stub → ge/gij locked 2026-05-12** (corpus-driven, Q8 partial revision). 30 cells in E10_Government are pure Flemish tussentaal (`Zijde gij`, `Zegt ze`, `Vertelt`, `Wil de 't`, `'k Ben/heb/Wou`, `weet ge`, `Merci da ge`, `da`/`wa da`, `nen`/`ne keer`, `dorpke`, `plezant`) with zero ABN markers. Canon §1 #9, §5.0 ge/gij table (count 11→12), and Q8 resolution updated.

### Tooling
- Supplementary scan: extended `e10_sweep_scan.py` ad-hoc with je/jij token scan + per-speaker register check against canon §5.0 membership tables.

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 3 cells**.

## 🎯 E3 Push 8 (tail) — §8.2 headline hyphen (1 cell)

Surfaced during E0–E9 methodical cleanliness scan. J16 article body had `Boor-Machine` correctly; J15 headline missed.

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E3_100_localization | J15 | (headline) | `Boormachine Blunder Brengt…` | `Boor-Machine Blunder Brengt…` | §8.2 |

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 1 cell**.

## 🎯 E10 Push 3 — row-alignment translation-bug fixes (3 cells)

Surfaced by `e10_alignment_scan.py` heuristic (cross-row NL paraphrase + EN length-ratio mismatch). All in `E10_Government_localization`.

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E10_Government_localization | J74 | Cole-Machine | `Het Parlement van Technopolis is een plek van democratie!` (exact paste of J69) | `De burgers van Technopolis zijn redelijke wezens!` | EN-co-authoritative (translation bug; NL on row was paste of J69 Cole-Machine line, ignoring own EN `Mecha's citizens are rational beings!`) |
| E10_Government_localization | J75 | Resentful Ass | `Eens ze de wereld zien vanuit uw perspectief, gaan ze met ons samenwerken om de manieren van de Mensen overal te veranderen.` (paraphrase of J82 Cole-Machine) | `Rationeel waren ze niet toen ze ons op straat bijeen sloegen.` | EN-co-authoritative (translation bug; NL on row was paraphrased from J82 Cole-Machine, ignoring own EN `They didn't seem rational when they attacked us in the streets.`) — wording by Tom |
| E10_Government_localization | J170 | Helpful Ass | `En dan heb 'k ne hele tijd rondgezworven tot da ze mij opgepikt hebben en naar die kwalijke Fabriek gebracht hebben.` (near-paste of J180) | `'k Was dag en nacht bomen aan 't slepen.` | EN-co-authoritative (translation bug; NL on row was duplicate of J180, ignoring own EN `I was carrying trees day and night.`) |

### Verify-only (no edit)
- `E10_Credits_localization` J110: EN `Radio Host Marcos` → NL `DJ Tom`. Length-ratio 0.35 (heuristic false-positive). Confirmed as intentional Belgian-localized cast-name following established pattern (Melvin→Zeno, Wedgie→Zita, Rico→Baptiste, Rose→Dina). KEEP.

### Tooling
- `scripts/editorial/e10_alignment_scan.py` — new scanner: (1) per-cell NL/EN char-length ratio outside [0.4, 2.5]; (2) cross-row NL-similarity ≥ 0.75 with EN-similarity ≤ 0.55 (paste-error pattern). Accepts XLSX path as first arg (for fresh-pull baseline scans).
- Heuristic only — caught the two loudest paste-errors plus J74 (NL-sim 1.00 exact duplicate). Will NOT catch translation bugs where the wrong NL happens to be length-balanced and lexically distinct from its source line.

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 3 cells**.

## 🎯 E5 Push 4 — deep-eyeball DRIFT batch (24 cells across 4 sub-tabs)

Sourced from `data/editorial/audit-2026-05-12-deep-eyeball.md` (25 E5 cells flagged DRIFT) → live-remote API read for verbatim source → Tom sign-off 2026-05-13 (24 apply, 1 skip + 1 user override).

Skipped: E5_CircusMain J22 — Tom keeps `kabinet van exotische dieren` for flavor (acceptable §13 wording).
User override: E5_CircusMain J91 — full rewrite to `Ha ha! Veel success met het overtreffen van mijn nummer!` (applies §6.10 act→nummer; `success` retained as stylistic English loanword for Smart Ass).

### E5_CircusMain_localization (8 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E5_CircusMain_localization | J9 | Ringmaster Rico | `…in het GROTE stadscircus!` | `…in het GROTE STADSCIRCUS!` | §7.2/§7.3 game-system cap |
| E5_CircusMain_localization | J36 | Ringmaster Rico | `…wie zijn best gedaan heeft…` | `…die zijn best gedaan heeft…` | Dutch relative pronoun (wie→die) |
| E5_CircusMain_localization | J64 | Ringmaster Rico | `…95% mens en 5% MAGIE…` | `…95% MENS en 5% MAGIE…` | §7.3 game-system cap (matches EN ALL-CAPS) |
| E5_CircusMain_localization | J88 | Kick Ass | `…presentatoren in het publiek zetten?` | `…presentatoren in het publiek zaten?` | Dutch verb (zetten→zaten past pl.) |
| E5_CircusMain_localization | J91 | Smart Ass | `Veel success met mijn act te overtreffen!` | `Veel success met het overtreffen van mijn nummer!` | §6.10 act→nummer + restructure (Tom override, success kept) |
| E5_CircusMain_localization | J123 | Big Ass | `…om op toernee te gaan!…` | `…om op Tournee te gaan!…` | §7.2 Tournee cap-always + canonical spelling |
| E5_CircusMain_localization | J153 | Ringmaster Rico | `Ik hoor nauwelijk iets…` | `Ik hoor nauwelijks iets…` | Dutch spelling (-s) |
| E5_CircusMain_localization | J161 | Kick Ass | `…gewoon kameraden zijn!` | `…gewoon Kameraden zijn!` | Corpus consistency (Kameraad cap) |

### E5_Highway_localization (2 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E5_Highway_localization | J4 | Slow Ass | `Oef… mijn knieëen.` | `Oef… mijn knieën.` | Dutch plural spelling (knieën) |
| E5_Highway_localization | J11 | Slow Ass | `*zwaar gëadem*` | `*zwaar geademd*` | Dutch participle (non-word→geademd) |

### E5_ZooMain_localization (11 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E5_ZooMain_localization | J4 | (sign) | `…Word sinds 7,000 jaar…` + `Vindt de regen niet zo fijn` | `…Worden sinds 7,000 jaar…` + `Vinden de regen niet zo fijn` | Dutch subj-verb agreement (plural species) |
| E5_ZooMain_localization | J18 | Zookeeper Rose | `…het word net zo druk…` | `…het wordt net zo druk…` | Dutch d/t |
| E5_ZooMain_localization | J47 | Smart Ass | `Jouw gelukt komt zo op zijn eind!` | `Jouw geluk komt zo op zijn eind!` | Dutch spelling (noun geluk, not p.p. gelukt) |
| E5_ZooMain_localization | J119 | Sad Ass | `…dat de Boederij en Mijn achterwege laten…` | `…dat de Hoeve en Mijn achterwege laten…` | §3.6 + typo (Boederij→Hoeve, two-for-one) |
| E5_ZooMain_localization | J125 | Smart Ass | `verse hooi…rigoreus dagdagelijks labeur!` | `vers hooi…rigoureus dagdagelijks labeur!` | Dutch neuter adj + spelling (rigoureus) |
| E5_ZooMain_localization | J154 | Sad Ass | `…vreugde bengt…` | `…vreugde brengt…` | Dutch spelling (bengt→brengt) |
| E5_ZooMain_localization | J165 | Zookeeper Rose | `…Iejoor van deze Dierentuin ONTSNAPT is…` | `…Iejoor uit deze Dierentuin ONTSNAPT is…` | Dutch preposition (ontsnappen uit) |
| E5_ZooMain_localization | J169 | Zookeeper Rose | `…om de Ezel van de Week ontmoeten?` | `…om de Ezel van de Week te ontmoeten?` | Dutch infinitive (om…te) |
| E5_ZooMain_localization | J176 | Zookeeper Rose | `De RAAD VAN BESTUUR wilt dat jullie gezellig hun komt Knuffelen!` | `De RAAD VAN BESTUUR wil dat jullie ze gezellig komen Knuffelen!` | Dutch grammar (wil/ze/komen) |
| E5_ZooMain_localization | J190 | Zookeeper Rose | `De RAAD VAN BESTUUR wilt dat jullie knus hun komt Knuffelen!` | `De RAAD VAN BESTUUR wil dat jullie ze knus komen Knuffelen!` | Dutch grammar (wil/ze/komen) |
| E5_ZooMain_localization | J216 | Kick Ass | `WAT?! Ge bent zo lomp als een Machine.` | `WAT?! Gij zijt zo lomp als een Machine.` | §5.4 ge/gij register (bent→zijt) |

### E5_Zoo_Introduction_localization (3 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E5_Zoo_Introduction_localization | J12 | Zookeeper Rose | `Ik noem het Ezel van de Week.` | `Ik noem het EZEL VAN DE WEEK.` | Corpus case parity (EN ALL-CAPS) |
| E5_Zoo_Introduction_localization | J22 | Smart Ass | `Ik heb een plan!` | `Ik heb een Plan!` | §6.9/§7.3 game-system cap (Plan) |
| E5_Zoo_Introduction_localization | J33 | Zookeeper Rose | `…dametje die het gewoon leuk vind als…` | `…dametje die het gewoon leuk vindt als…` | Dutch d/t (3rd sg) |

### Verify-only (no edit per Tom 2026-05-13)
- `E5_CircusMain_localization` J22 — `kabinet` kept for flavor (Tom decision; §13 acceptable alternate to `cast`).

### Tooling
- `scripts/editorial/propose-fixes-e5.py` — live-remote API read + transform preview generator. Produces `data/editorial/proposed-fixes-2026-05-13-E5.md`.
- `scripts/editorial/apply-fixes-e5.py` — local xlsx writer with safety: each cell's pre-image must match (or be already-applied) before write. 24/25 cells applied (J22 skipped).
- Push via existing `scripts/convert/push-file.py 5_asses.masses_E5Proxy.xlsx --apply` (batch write + green tint per tab).

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 24 cells** (`excels.fresh-pull-2026-05-13-post-E5-push/`).
- Regex audit post-push: E5 dropped from 25 deep-eyeball DRIFT → 0 deep-eyeball DRIFT. Comprehensive audit now shows E5: 1 canon (J208 `t Beste`→`'t Beste` §9.1, NOT in this batch — discovered post-push, deferred) + 4 LEN-RATIO BUG false-positives (J68, J206, J207, J216 short-string heuristics, all clean per content review).

## 🎯 E4 Push 2 — deep-eyeball DRIFT batch (23 cells across 5 sub-tabs)

Sourced from `data/editorial/audit-2026-05-12-deep-eyeball.md` (23 E4 cells flagged DRIFT) → live-remote API read for verbatim source → Tom sign-off 2026-05-13.

Overrides on J46/J71/J106/J235 (Astral), J6 (KicksConfession picked option c), J6 (Mine1F_Exit).

### E4_AstralPlaneMain_localization (14 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E4_AstralPlaneMain_localization | J46 | Shifty Ass | `Hé Niewelingetjes…er vandaag de lucht uit gaan vallen…` | `Hé Nieuwelingetjes…er vandaag uit de lucht gaan vallen…` | Spelling + word order (Tom override) |
| E4_AstralPlaneMain_localization | J49 | Greedy Ass | `Wilde gokken?` | `Wil je gokken?` | Dutch tense |
| E4_AstralPlaneMain_localization | J71 | Old Ass | `…nadat ik de Spuit was gegeven…"Herinneer de wereld aan de belangan…"` | `…nadat ik die Spuit kreeg…"Herinner de Wereld aan de Belangen…"` | Tom override: active voice + caps + spelling |
| E4_AstralPlaneMain_localization | J94 | Old Ass | `…geduld had wanneer ze aankwam.` | `…geduld had toen ze aankwam.` | Past temporal conjunction |
| E4_AstralPlaneMain_localization | J106 | Hasty Ass | `Let's go let's go let's go!` | `Komaan komaan komaan!` | §12.4 (Tom picked Komaan alternate) |
| E4_AstralPlaneMain_localization | J117 | Hasty Ass | `Let's go!` | `Vooruit!` | §12.4 |
| E4_AstralPlaneMain_localization | J167 | Lofty Ass | `…dorpsezels wanneer de Mensen onze Kudde gebruikte…` | `…dorpsezels toen de Mensen onze Kudde gebruikten…` | Temporal + agreement |
| E4_AstralPlaneMain_localization | J178 | Shaky Ass | `WHAT DE FUCK, IK KAN MIJN EIGEN LICHAAM ZIEN.` | `WAT DE FUCK, IK KAN MIJN EIGEN LICHAAM ZIEN.` | §12.4 hybrid (WHAT→WAT) |
| E4_AstralPlaneMain_localization | J183 | Blunt Ass | `wilde poepen?` | `wilt ge poepen?` | Tense + ge/gij register |
| E4_AstralPlaneMain_localization | J201 | Tight Ass | `Waar denk jij wel niet waar je heen gaat?` | `Waar denk jij wel niet dat je heen gaat?` | Dutch grammar |
| E4_AstralPlaneMain_localization | J220 | DJ Dope Ass | `GOEDEAVOND MEDE-EZELS!!!!` | `GOEIENAVOND MEDE-EZELS!!!!` | Dutch spelling (tussentaal) |
| E4_AstralPlaneMain_localization | J228 | Smelly Ass | `allebeide` | `allebei` | Dutch spelling |
| E4_AstralPlaneMain_localization | J234 | Firm Ass | `Wise Ass` | `Wijze Ezel` | §4 character moniker |
| E4_AstralPlaneMain_localization | J235 | Firm Ass | `Wees respectvol. Wise Ass heeft een antwoord op alles.` | `Toon respect. Wijze Ezel heeft op alles een antwoord.` | §4 + Tom override (restructure) |

### E4_HerdSplits_localization (6 cells)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E4_HerdSplits_localization | J29 | Smart Ass | `…een nieuw plan.` | `…een nieuw Plan.` | §6.9/§7.3 game-system cap |
| E4_HerdSplits_localization | J32 | Smart Ass | `…we pakken onze jobs TERUG.` | `…we pakken onze JOBS TERUG.` | Corpus case parity (ALL-CAPS match) |
| E4_HerdSplits_localization | J35 | Sturdy Ass | `…met mijn veulentje.` | `…met mijn Veulentje.` | §7.1 The Foal as character |
| E4_HerdSplits_localization | J59 | Kick Ass | `…een mens aan.` | `…een Mens aan.` | §7.3 |
| E4_HerdSplits_localization | J77 | Smart Ass | `VIER! Let's GO!` | `VIER! VOORUIT!` | §12.4 |
| E4_HerdSplits_localization | J81 | Hard Ass | `Een revolutie vergt offers.` | `Een Revolutie vergt offers.` | §7.3 |

### E4_KicksConfession_localization (1 cell)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E4_KicksConfession_localization | J6 | Kick Ass | `MOEST ik MEEHELPEN terwijl Snotje op uitkijk stond.` | `IK MOEST VAN HEM MEEHELPEN terwijl Snotje op uitkijk stond.` | §13 — restore Hard-as-actor (Tom picked option c) |

### E4_Mine1F_Exit_localization (1 cell)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E4_Mine1F_Exit_localization | J6 | Hard Ass | `Ge overdrijft. De Mensen maken korte metten met u vanaf de eerste keer ze de kans hebben.` | `Ge overdrijft. De mensen maken korten metten met u op de eerste kans dat ze krijgen.` | Tom override: full rewrite (mensen lowercase + korten + restructure) |

### E4_Mine1F_localization (1 cell)

| Sheet | Cell | Speaker | Before | After | Rule |
|---|---|---|---|---|---|
| E4_Mine1F_localization | J22 | Sturdy Ass | `…Kameraad, Ik vertrouw…` | `…Kameraad, ik vertrouw…` | §9.2 (lowercase ik after comma) |

### Canon question flagged for later (J71)
Tom asked whether `"Show the world the power of the Ass!"` quote should collapse to `"EZELS EERST!"` per canon §14.1. Read: this is the long-form **dying-words** quote (consistent with E1_TheProtest J67/J69), distinct from the **chant** form (`ASS!`/`POWER!` → `EZELS!`/`EERST!`). Long-form kept. Queued: **project-wide slogan/chant analysis** to document both forms and verify all occurrences are intentional.

### Tooling
- `scripts/editorial/propose-fixes-e4.py` — live-API read + transform preview.
- `scripts/editorial/apply-fixes-e4.py` — local writer with pre-image safety check.
- Push via `scripts/convert/push-file.py 4_asses.masses_E4Proxy.xlsx --apply`.

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 23 cells** (`excels.fresh-pull-2026-05-13-post-E4-push/`).
- Regex audit post-push: E4 dropped from 23 deep-eyeball DRIFT → 0 deep-eyeball DRIFT. Comprehensive audit: 1 canon (J62 Schoon Beest §4.4 — push-confirmed preserve, NOT actionable) + 0 align + 0 cross-row + 8/9 clean sheets.

## 🎯 Slogan retcon — long-form §14.1 dying-words quote standardization (4 cells across E1)

Triggered by project-wide slogan/chant corpus scan (2026-05-13). The long-form quote (Old Ass dying words: "Show the world the power of the Ass!" → NL "Herinner de Wereld aan de Belangen van de Ezels!") had 4 inconsistent occurrences across the corpus. Tom 2026-05-13: `Herinneer` is not standard Dutch; should be `Herinner` (single -e, 2sg imperative). Cases mirror EN intent. Belangen+Wereld capped.

### Cells

| Sheet | Cell | Before | After | Fix |
|---|---|---|---|---|
| E1_Stable2F_localization | J34 | `HERINNEER DE WERELD AAN DE BELANGEN VAN DE EZELS!` | `HERINNER DE WERELD AAN DE BELANGEN VAN DE EZELS!` | typo `Herinneer→Herinner` |
| E1_TheProtest_localization | J67 | `"Herinneer de wereld aan de belangan van de Ezels" …` | `"Herinner de Wereld aan de Belangen van de Ezels" …` | typo + caps on Wereld/Belangen + spelling fix `belangan→Belangen` |
| E1_TheProtest_localization | J69 | `"Herinneer de wereld aan de belangan van de Ezels" …` | `"Herinner de Wereld aan de Belangen van de Ezels" …` | same as J67 |
| E1_TheProtest_localization | J115 | `HERINNEER DE WERELD AAN DE BELANGEN VAN DE EZELS` | `HERINNER DE WERELD AAN DE BELANGEN VAN DE EZELS!` | typo + add terminal `!` to mirror EN |

E4_AstralPlaneMain J71 already at canonical form from E4 Push 2 (Tom override) — not in this batch.

### Canon
- New §14.1.1 entry added: explicitly disambiguates **chant form** (`EZELS EERST!`) vs **long-form dying-words quote** (`Herinner de Wereld aan de Belangen van de Ezels!`). Lock on `Herinner` spelling. Case mirrors EN.

### Tooling
- `scripts/editorial/slogan-chant-corpus-scan.py` — snapshot-based scan (xlsx, fast)
- `scripts/editorial/slogan-chant-corpus-scan-live.py` — live-API scan (throttled via `_api_throttle`)
- `scripts/editorial/apply-fixes-slogan-retcon.py` — local writer for the 4-cell batch

### Round-trip
- Fresh xlsx-export pull vs local: **0 diffs / 4 cells** (`excels.fresh-pull-2026-05-13-post-slogan-retcon/`).
