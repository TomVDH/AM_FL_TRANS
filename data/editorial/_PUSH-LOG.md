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
**Batch file:** `data/editorial/feedback-2026-05-10-E1.json`
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
**Batch file:** `data/editorial/feedback-2026-05-10-E1-followup.json`
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
**Batch file:** `data/editorial/feedback-2026-05-10-E2.json`
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
