# Reconcile report — reconcile-2026-05-08.json

> Generated from `data/editorial/reconcile-2026-05-08.json`. **37 conflicts + 4 policy collisions** need user decisions.


**Sources**

- baseline: `excels/Originals` (last shared sync, 2026-05-03)
- ours: `excels` (95 cells of editorial edits this cycle)
- theirs: `excels/Patrick-2026-05-08` (Patrick's GS state, pulled today)

---

## 🚩 CRITICAL FLAGS — read first

### F1. Place-name spelling collision: `Muilebeek` (1 n) vs `Muilenbeek` (2 n's)

Patrick has applied **Muilebeek** (single n) to 15 cells in his theirs_only set — i.e. he's done a Muilegem→Muilebeek sweep on his side. Our locked policy per [_RESUME-2026-05-07.md §C9](data/editorial/_RESUME-2026-05-07.md) is **Muilenbeek** (note extra `n`). Cells affected:
- E1 J5 ×2, J19 (Groot-Muilebeek), J72, plus E2_World_{A1,A2,B1,B2} J5, plus E3 J3 / J79 / J136, plus E4 J10 / J63, plus E5 J241 / J249, plus E6 J161-163, plus E10 J13 / J68 / J100. Total ~25 cells (all the "batch e2" cells the user originally asked for, but with the 1-n spelling).
- Plus E10 Credits J27: Patrick has `MUILEBEEK` (still 1 n) — same as the baseline.

**Decision needed:** is canonical `Muilenbeek` (locked policy, 2 n's) or `Muilebeek` (Patrick's current implementation, 1 n)? If we keep our policy → 25 cells of theirs_only become "fix Patrick to add the n". If we adopt Patrick's → revoke §C9 directive.

### F2. `*Boe-hoe-hoe*` casing collision (15 conflicts)

Our locked policy per [_RESUME-2026-05-07.md §G26](data/editorial/_RESUME-2026-05-07.md) (batch f, applied 18 cells): capital B `*Boe-hoe-hoe*`. Patrick has lowercase `*boe-hoe-hoe*` in 15 of those same cells. Both agree on hyphenation and 3 `hoe`s; only B-casing differs.

**Decision needed:** keep capital B (ours), accept lowercase b (Patrick's), or is this speaker-conditional?

### F3. `Stenen-spel` vs `Keien-Spel` regression (4 conflicts)

Our locked policy per [_RESUME-2026-05-07.md §D11](data/editorial/_RESUME-2026-05-07.md) (batch b, applied 12 cells): `Keien-Spel`. In 4 of the conflict cells, Patrick reverted to `Stenen-spel`. Reverted cells: E3_Mine1F J16, J85, J120; E6_World J79.

**Decision needed:** confirm Keien-Spel is still canonical. (Recommended: yes — the directive came from user.)

### F4. Patrick typo: `VALT ANN` (should be `VALT AAN`)

E2_BattleButte J28: EN "You Tackle!" → theirs `Je VALT ANN!`. The Dutch verb is `aanvallen` / past form should be `Je VALT AAN!`. Likely typo on Patrick's end. **Suggested action:** flag back to Patrick + correct in our pull.

### F5. Possible Patrick copy-paste error: E10_Govt J74

EN: "Mecha's citizens are rational beings!"
- baseline NL: `De burgers van Mechalen zijn rationele wezens!`
- theirs NL: `Het Parlement van Technopolis is een plek van democratie!` ← identical to J69's NL

Looks like a stale paste. **Suggested action:** keep ours (`De burgers van Technopolis zijn rationele wezens!`) and flag back to Patrick.

### F6. Mass place renames in theirs

Beyond Muilebeek, Patrick made other place-name moves (e.g. E1_Farm J72: "DRIE: we marcheren door het dorp van Klotegem" — replacing "Muilegem"). Need to confirm this matches the locked decisions (Klotegem = the town, Muilenbeek = the region per [_RESUME-2026-05-07.md §Place names](data/editorial/_RESUME-2026-05-07.md#L48)).

---


## Totals

| Bucket | Count | Action |
|--------|------:|--------|
| ours_only   |   25 | keep, push later |
| theirs_only |  379 | pull into local |
| agreed      |   33 | no action (converged) |
| conflicts   |   37 | **manual decision per row** |
| **total**   | **474** | |

## Per-file breakdown

| File | ours_only | theirs_only | agreed | conflicts |
|------|----------:|------------:|-------:|----------:|
| `0_asses.masses_Manager+Intermissions+E0Proxy.xlsx` |   0 |   5 |   0 |   0 |
| `10_asses.masses_E10Proxy.xlsx` |   6 |   4 |   8 |   4 |
| `1_asses.masses_E1Proxy.xlsx` |   1 | 120 |   3 |   7 |
| `2_asses.masses_E2Proxy.xlsx` |   2 |  46 |   2 |   5 |
| `3_asses.masses_E3Proxy.xlsx` |   3 |  46 |   1 |   8 |
| `4_asses.masses_E4Proxy.xlsx` |   0 |  76 |   0 |   3 |
| `5_asses.masses_E5Proxy.xlsx` |   2 |   7 |   1 |   1 |
| `6_asses.masses_E6Proxy.xlsx` |   8 |  55 |   9 |   5 |
| `7_asses.masses_E7Proxy.xlsx` |   1 |  11 |   1 |   4 |
| `8_asses.masses_E8Proxy.xlsx` |   0 |   1 |   0 |   0 |
| `9_asses.masses_E9Proxy.xlsx` |   2 |   8 |   8 |   0 |

---

## 🚨 Conflicts (37) — REQUIRES DECISION

Each row was edited differently in `ours` and `theirs`. Pick: **ours**, **theirs**, or hand-merge.


### `10_asses.masses_E10Proxy.xlsx` — 4 conflict(s)

#### E10_Government_localization :: J12
- **EN:** `Up next, the #2 song on Mecha's Top 40! asi9 by David Mesiha.`
- **baseline:** `En dan nu, de nummer 2 op Mechalens Top 40! van David Mesiha.`
- **ours:**     `En dan nu, de nummer 2 op Technopolis' Top 40! van David Mesiha.`
- **theirs:**   `En dan nu, de nummer 2 op Technopolis' Top 40! "ezel8ig" van David Mesiha.`

#### E10_Government_localization :: J69
- **EN:** `Mecha's Parliament is a place of democracy!`
- **baseline:** `Het parlement van Mechalen is een plek van democratie!`
- **ours:**     `Het parlement van Technopolis is een plek van democratie!`
- **theirs:**   `Het Parlement van Technopolis is een plek van democratie!`

#### E10_Government_localization :: J74
- **EN:** `Mecha's citizens are rational beings!`
- **baseline:** `De burgers van Mechalen zijn rationele wezens!`
- **ours:**     `De burgers van Technopolis zijn rationele wezens!`
- **theirs:**   `Het Parlement van Technopolis is een plek van democratie!`

#### E10_Sad_localization :: J4
- **EN:** `*whimper*`
- **baseline:** `*boehoehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`


### `1_asses.masses_E1Proxy.xlsx` — 7 conflict(s)

#### E1_FarmHouseInt_localization :: J20
- **EN:** `If you need a place to take the kids, get your butts to the Mecha City Zoo, or see the new show at the Big Ci…`
- **baseline:** `Mocht je een plek zoeken om met je familie heen te gaan, rep je achterwerk naar de zoo van Mechalen! Of ga na…`
- **ours:**     `Mocht je een plek zoeken om met je familie heen te gaan, rep je achterwerk naar de zoo van Technopolis! Of ga…`
- **theirs:**   `Als je een leuke plek zoekt voor je familie, ga naar de Dierentuin van Technopolis! Of bezoek de nieuwe show …`

#### E1_Farm_localization :: J82
- **EN:** `*whimper*`
- **baseline:** `*boehoehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E1_Farm_localization :: J88
- **EN:** `*whimper*`
- **baseline:** `*boehoehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E1_Farm_localization :: J91
- **EN:** `*whimper*`
- **baseline:** `*boehoehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E1_Stable2F_localization :: J47
- **EN:** `Someone has to sing the Song of Ascension to make sure his Ass Soul can reach the Astral Plane and be reassig…`
- **baseline:** `Iemand moet het ezelenhemelvaartszangderzielen zingen zodat zijn ziel het Astrale Hiernamaals bereikt en hij …`
- **ours:**     `Iemand moet het Hemelvaarts-zang-der-Ezel-zielen zingen zodat zijn ziel het Astrale Hiernamaals bereikt en hi…`
- **theirs:**   `Zodat zijn ziel het Astrale Hiernamaals bereikt en hij weer kan herrijzen, iemand moet het Hemelvaarts-zang-d…`

#### E1_TheProtest_localization :: J48
- **EN:** `*whimper*`
- **baseline:** `*boe-hoe-hoe-hoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `Herdenk met Triestige Ezel over al wat er verloren is gegaan.`

#### E1_TheProtest_localization :: J49
- **EN:** `*whimper*`
- **baseline:** `*boe-hoe-hoe-hoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`


### `2_asses.masses_E2Proxy.xlsx` — 5 conflict(s)

#### E2_Confession_localization :: J3
- **EN:** `*whimper*`
- **baseline:** `*boehoehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E2_World_A2_localization :: J24
- **EN:** `Not the Stable too!—`
- **baseline:** `Niet de Stal!-`
- **ours:**     `Niet de Stal ook!—`
- **theirs:**   `Niet de Stal!—`

#### E2_World_A2_localization :: J25
- **EN:** `*whimper*`
- **baseline:** `*boehoehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E2_World_A2_localization :: J29
- **EN:** `*whimper*`
- **baseline:** `*boehoehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E2_World_B1_localization :: J42
- **EN:** `And I'll sing the Song of Ascension for Trusty.`
- **baseline:** `En ik zal de Ezelenhemelvaartszangderzielen voor Trouwe zingen.`
- **ours:**     `En ik zal het Hemelvaarts-zang-der-Ezel-zielen voor Trouwe zingen.`
- **theirs:**   `En de Hemelvaarts-zang-der-Ezel-zielen zal ik voor Trouwe zingen.`


### `3_asses.masses_E3Proxy.xlsx` — 8 conflict(s)

#### E3_100_localization :: J7
- **EN:** `June 27th\nThese are dire times for the mining business. I had to lay off more workers today and we're runnin…`
- **baseline:** `27 juni\nDit zijn barre tijden voor de mijnbouw. 'k Heb vandaag weer meer werkvolk moeten ontslaan en we rake…`
- **ours:**     `27 juni\nDit zijn barre tijden voor de mijnbouw. 'k Heb vandaag weer meer werkvolk moeten ontslaan en we rake…`
- **theirs:**   `27 juni\nDit zijn barre tijden voor de mijnbouw. Ik Heb vandaag weer meer werkvolk moeten ontslaan en we rake…`

#### E3_100_localization :: J17
- **EN:** `Child artist Joey Kulan charms the pants off the judges and wins the Bumpkin regional drawing competition for…`
- **baseline:** `Kinderkunstenaar Luukse Vermeulen charmeert de jury en wint de regionale tekenwedstrijd van Klotegem voor kin…`
- **ours:**     `Kinderkunstenaar Luukse Vermeulen charmeert de jury en wint de regionale tekenwedstrijd van Klotegem voor kin…`
- **theirs:**   `IK HOOP DAT MIJN KUNST MENSEN GELUKKIG MAAKT`

#### E3_200_localization :: J4
- **EN:** `July 24th\nButte Mine is officially for sale. I'm praying that someone from Mecha City will step up and buy i…`
- **baseline:** `24 juli\nVanscheetvelde Kolen & Industrie staat officieel te koop. 'k hoop dat iemand van Mechalen het zal ko…`
- **ours:**     `24 juli\nVanscheetvelde Kolen & Industrie staat officieel te koop. 'k hoop dat iemand van Technopolis het zal…`
- **theirs:**   `24 juli\nVanscheetvelde Kolen & Industrie staat officieel te koop. Ik hoop dat iemand van Technopolis het zal…`

#### E3_Mine1F_localization :: J16
- **EN:** `Do you want to watch me play Rocks, Uncle Sad?`
- **baseline:** `Wil je kijken naar mijn Stenen-spel, Nonkel Triestigaard?`
- **ours:**     `Wil je kijken naar mijn Keien-spel, Nonkel Triestigaard?`
- **theirs:**   `Wil je kijken naar mijn Stenen-spel, Nonkel Triestige?`

#### E3_Mine1F_localization :: J82
- **EN:** `I’d call it... Bottoms Up!`
- **baseline:** `Ik zou 't noemen... Poepegaatje!`
- **ours:**     `Ik zou 't noemen... De Zatten Ezel!`
- **theirs:**   `Ik zou 't noemen... De Zatten Ezel Cafe!`

#### E3_Mine1F_localization :: J85
- **EN:** `Uncle Kick, Uncle Hard, do you want to watch me play Rocks?`
- **baseline:** `Nonkel Hoef, Nonkel Stoer, willen jullie kijken naar mijn Stenen-spel?`
- **ours:**     `Nonkel Hoef, Nonkel Stoer, willen jullie kijken naar mijn Keien-spel?`
- **theirs:**   `Nonkel Stamp, Nonkel Bikkelharde, willen jullie kijken naar mijn Stenen-spel?`

#### E3_Mine1F_localization :: J120
- **EN:** `Will you watch me play Rocks, Uncle Slow?`
- **baseline:** `Wil je kijken naar mijn Stenen-spel, Oom Sloom?`
- **ours:**     `Wil je kijken naar mijn Keien-spel, Oom Sloom?`
- **theirs:**   `Wil je kijken naar mijn Stenen-spel, Nonkel Slome?`

#### E3_Mine1F_localization :: J138
- **EN:** `But Hard Ass says he hasn't seen any Humans for weeks.`
- **baseline:** `Maar Bikkeharde zegt dat hij al weken geen Mensen heeft gezien.`
- **ours:**     `Maar Bikkelharde zegt dat hij al weken geen Mensen heeft gezien.`
- **theirs:**   `Maar Bikkelharde Ezel zegt dat hij al weken geen Mensen heeft gezien.`


### `4_asses.masses_E4Proxy.xlsx` — 3 conflict(s)

#### E4_Mine1F_Exit_localization :: J12
- **EN:** `*whimper* Take care, Comrade.`
- **baseline:** `*boehoehoe* Het ga je goed, Kameraad.`
- **ours:**     `*Boe-hoe-hoe* Het ga je goed, Kameraad.`
- **theirs:**   `*boe-hoe-hoe* Het ga je goed, Kameraad.`

#### E4_Mine1F_Exit_localization :: J13
- **EN:** `*whimper*`
- **baseline:** `*boehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E4_Mine1F_localization :: J16
- **EN:** `*whimper*`
- **baseline:** `*boehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`


### `5_asses.masses_E5Proxy.xlsx` — 1 conflict(s)

#### E5_CircusMain_localization :: J214
- **EN:** `*whimper*`
- **baseline:** `*boe-hoe-hoe-hoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`


### `6_asses.masses_E6Proxy.xlsx` — 5 conflict(s)

#### E6_World_localization :: J14
- **EN:** `Uncle Hard can't abandon his post.`
- **baseline:** `Oom Bikkehard kan zijn post niet verlaten, Kameraad.`
- **ours:**     `Oom Bikkelharde kan zijn post niet verlaten.`
- **theirs:**   `Nonkel Bikkelharde kan zijn post niet verlaten, Kameraad.`

#### E6_World_localization :: J79
- **EN:** `Ohh... I just remembered I promised Uncle Bad Ass we'd play Rocks!`
- **baseline:** `Ohh... ik herinner me net dat ik Oom Stoere Ezel beloofd heb dat we Stenen-spel zouden spelen!`
- **ours:**     `Ohh... ik herinner me net dat ik Oom Stoere Ezel beloofd heb dat we Keien-spel zouden spelen!`
- **theirs:**   `Ohh... ik herinner me net dat ik Nonkel Stoere Ezel beloofd heb dat we Stenen-spel zouden spelen!`

#### E6_World_localization :: J196
- **EN:** `Tonight, The Bottoms Up Bar is finally openin'!`
- **baseline:** `Vanavond gaat 't "Poepegaatje"  eindelijk open, héé!`
- **ours:**     `Vanavond gaat 't "De Zatten Ezel"  eindelijk open, héé!`
- **theirs:**   `Vanavond gaat De Zatten Ezel Cafe eindelijk open, héé!`

#### E6_World_localization :: J219
- **EN:** `What's the perfect title to commemorate the opening of Bottoms Up?`
- **baseline:** `Wat is nu de perfecte titel om de opening van Bottoms Up te vieren, Kameraad?`
- **ours:**     `Wat is nu de perfecte titel om de opening van Bottoms Up te vieren?`
- **theirs:**   `Wat is nu de perfecte titel om de opening van De Zatten Ezel te vieren, Kameraad?`

#### E6_World_localization :: J339
- **EN:** `Sturdy, will you come with us? P-p-please?`
- **baseline:** `Stevige, kom je met ons mee? P-p-please... alsjebbblieft?`
- **ours:**     `Stevige, kom je met ons mee? P-p-p-alsjeblieft?`
- **theirs:**   `Stevige, kom je met ons mee? Alsjeb-b-blieft?`


### `7_asses.masses_E7Proxy.xlsx` — 4 conflict(s)

#### E7_BigJob_localization :: J35
- **EN:** `And your Soul will be stuck here... *whimper*`
- **baseline:** `En je Ziel zal hier vastzitten... *boehoehoe*`
- **ours:**     `En je Ziel zal hier vastzitten... *Boe-hoe-hoe*`
- **theirs:**   `En je Ziel zal hier vastzitten... *boe-hoe-hoe*`

#### E7_Chilling_localization :: J4
- **EN:** `*whimper*`
- **baseline:** `*boehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E7_CityStreet_localization :: J5
- **EN:** `*whimper*`
- **baseline:** `*boehoehoe*`
- **ours:**     `*Boe-hoe-hoe*`
- **theirs:**   `*boe-hoe-hoe*`

#### E7_Holding3_localization :: J6
- **EN:** `Never fear, we have a provision of shared responsibility for singing the Song of Ascension for the Asses who …`
- **baseline:** `Vrees niet, wij zingen trots het ezelenhemelvaartszangderzielen voor de Ezels die ons zijn voorgegaan, dat is…`
- **ours:**     `Vrees niet, wij zingen trots het Hemelvaarts-zang-der-Ezel-zielen voor de Ezels die ons zijn voorgegaan, dat …`
- **theirs:**   `Vrees niet, wij zingen trots het Hemelvaarts-zang-der-Ezel-zielen voor de Ezels die ons zijn voorgegaan.`


---

## ours_only (25) — keep, push later

Edits we made that Patrick didn't touch. Stay in local; push at Phase 5.

| File | Sheet | Cell | EN | baseline → ours |
|------|-------|------|----|-----------------|
| `10_asses.masses_E10Proxy.xlsx` | E10_Government_localization | J47 | "Anyone want to play ROCKS?" | `"Heeft iemand zin om STENEN-SPEL te spe…` → `"Heeft iemand zin om KEIEN-SPEL te spel…` |
| `10_asses.masses_E10Proxy.xlsx` | E10_Government_localization | J110 | Tell the Humans that we want to run our own busin… | `Zeg tegen de Mensen dat wij onze eigen …` → `Zeg tegen de Mensen dat wij onze eigen …` |
| `10_asses.masses_E10Proxy.xlsx` | E10_Government_localization | J145 | No Ass gets left behind. | `Geen Ezel wordt achtergelaten, Kameraad.` → `Geen Ezel wordt achtergelaten.` |
| `10_asses.masses_E10Proxy.xlsx` | E10_ProphetSpeech_localization | J56 | Yet, all of us here, both Humans and donkeys, are… | `Toch zijn wij hier allemaal, zowel Mens…` → `Toch zijn wij hier allemaal, zowel Mens…` |
| `10_asses.masses_E10Proxy.xlsx` | E10_ProphetSpeech_localization | J66 | Like you, these Asses think of themselves as inte… | `Net als gij, kameraad, denken deze Ezel…` → `Net als gij denken deze Ezels van zichz…` |
| `10_asses.masses_E10Proxy.xlsx` | E10_Thirsty_localization | J21 | Plus, I need more customers! I finally opened The… | `Plus, 'k heb meer klanten nodig héé! 'k…` → `Plus, 'k heb meer klanten nodig héé! 'k…` |
| `1_asses.masses_E1Proxy.xlsx` | E1_Stable2F_localization | J32 | Please young Comrade, you have to play my role no… | `Jonge Kameraad, nu is het aan u. Gij mo…` → `Jonge Kameraad, nu is het aan u. Gij mo…` |
| `2_asses.masses_E2Proxy.xlsx` | E2_BattleMiner_localization | J3 | Hard Ass | `Bikkeharde Ezel` → `Bikkelharde Ezel` |
| `2_asses.masses_E2Proxy.xlsx` | E2_Confession_localization | J53 | Golly, what do you mean? | `Amai, waarover ben je bezig?` → `Amai, waar heb je het over?` |
| `3_asses.masses_E3Proxy.xlsx` | E3_BadCave_localization | J18 | Most are broken, but I rebuilt this one. I'm usin… | `De meeste zijn kapot, maar deze heb ik …` → `De meeste zijn kapot, maar deze heb ik …` |
| `3_asses.masses_E3Proxy.xlsx` | E3_Mine1F_localization | J54 | Do you want to watch me play Rocks? | `Wil je kijken naar mijn Stenen-spel?` → `Wil je kijken naar mijn Keien-spel?` |
| `3_asses.masses_E3Proxy.xlsx` | E3_Mine1F_localization | J55 | Do you want to watch me play Rocks? | `Wil je kijken naar mijn Stenen-spel?` → `Wil je kijken naar mijn Keien-spel?` |
| `5_asses.masses_E5Proxy.xlsx` | E5_ZooMain_localization | J118 | *whimper* | `*boe-hoe-hoe-hoe*` → `*Boe-hoe-hoe*` |
| `5_asses.masses_E5Proxy.xlsx` | E5_ZooMain_localization | J123 | *whimper* | `*boe-hoe-hoe-hoe*` → `*Boe-hoe-hoe*` |
| `6_asses.masses_E6Proxy.xlsx` | E6_BadCave_localization | J24 | She still thinks we are playing 'Rocks' down here… | `Ze denkt nog steeds dat we hier elke da…` → `Ze denkt nog steeds dat we hier elke da…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_BattleHard_localization | J42 | Rocks | `Stenen-spel` → `Keien-spel` |
| `6_asses.masses_E6Proxy.xlsx` | E6_Nightmare_localization | J68 | Lemme guess—{$NewName} still spending all her tim… | `Laat me raden—{$NewName} zit nog steeds…` → `Laat me raden—{$NewName} zit nog steeds…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J6 | It's not like you to nod off at your post. | `'t Is niks voor jou om in te dommelen o…` → `'t Is niks voor jou om in te dommelen o…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J15 | The Humans are still trying to breach the Barrica… | `De Mensen proberen nog steeds de Barric…` → `De Mensen proberen nog steeds de Barric…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J78 | Would you like me to show you the Old Church next? | `Zal ik je de Oude Kerk laten zien, Kame…` → `Zal ik je de Oude Kerk laten zien?` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J195 | Mosey on over and take a sip of my new drink spec… | `Kom maar efkes afgezakt en proef mijn n…` → `Kom maar efkes afgezakt en proef mijn n…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J202 | {$NewName} spends all her time inside playin' Roc… | `{$NewName} zit de hele tijd binnen Sten…` → `{$NewName} zit de hele tijd binnen Keie…` |
| `7_asses.masses_E7Proxy.xlsx` | E7_Chilling_localization | J5 | Wait. We should sing the Song of Ascension for ou… | `Wacht. Voor we vertrekken moeten we de …` → `Wacht. Voor we vertrekken moeten we het…` |
| `9_asses.masses_E9Proxy.xlsx` | E9_BadCave_localization | J40 | I thought you were playing ROCKS with your UNCLE! | `Ik dacht dat je STENEN-SPEL aan 't spel…` → `Ik dacht dat je KEIEN-SPEL aan 't spele…` |
| `9_asses.masses_E9Proxy.xlsx` | E9_BadCave_localization | J76 | As Lazy died, she tried to sing the Song of Ascen… | `Toen Luie stierf, probeerde ze de Ezele…` → `Toen Luie stierf, probeerde ze het Heme…` |

---

## theirs_only (379) — Patrick's edits to pull into local

Showing first 5 per file. Full list in `reconcile-2026-05-08.json` under key `theirs_only`.


### `0_asses.masses_Manager+Intermissions+E0Proxy.xlsx` — 5 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| CharacterProfiles_localization | J81 | Blunt Ass | `Groffe ezel` → `Groffe Ezel` |
| CharacterProfiles_localization | J82 | Peek Ass | `Constat-ezel` → `Constaterende Ezel` |
| E0_Questions_localization | J76 | A 'mare' is the general term for a female equine.… | `Een 'merrie' is de algemene term voor e…` → `In het Engels is 'mare' de algemene ter…` |
| E0_Questions_localization | J79 | Jennet | `Molly` → `Jennet` |
| E0_Questions_localization | J80 | Molly | `Jennet` → `Molly` |

### `10_asses.masses_E10Proxy.xlsx` — 4 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E10_Government_localization | J27 | Are you the Golden Ass? The Gods incarnate?! | `Zijde gij de Gouden Ezel?! DE GODEN in …` → `Zijde gij de Gouden Ezel?! De Goden in …` |
| E10_Government_localization | J29 | I am one with many names: The Gods, HEE and HAW, … | `Wij zijn één met vele namen: DE GODEN, …` → `Wij zijn één met vele namen: De Goden, …` |
| E10_Government_localization | J34 | Behold, here with me, a special Prophet-Machine f… | `Aanschouwt, hier bij Ons, een bijzonder…` → `Aanschouwt, hier bij Ons, een bijzonder…` |
| E10_Government_localization | J35 | Behold, here with me, a special Prophet-Machine f… | `Aanschouwt, hier bij Ons, een bijzonder…` → `Aanschouwt, hier bij Ons, een bijzonder…` |

### `1_asses.masses_E1Proxy.xlsx` — 120 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E1_FarmHouseInt_localization | J19 | It's a scorcher! It's looking dry as a bone out t… | `Bakken en braden vandaag! Het is kurkdr…` → `Bakken en braden vandaag! Het is kurkdr…` |
| E1_FarmHouseInt_localization | J23 | Hey Trusty! | `Hey Trouwe!` → `Hey Trouwe Ezel!` |
| E1_Farm_localization | J5 | Welcome to Fannyside Farm. To the west, our beaut… | `Welkom op de Boerderij van Muilegem. Te…` → `Welkom op de Boerderij van Muilebeek. T…` |
| E1_Farm_localization | J72 | THREE, we march through the Village of Bumpkin, c… | `DRIE: we marcheren door het dorp van Mu…` → `DRIE: we marcheren door het dorp van Kl…` |
| E1_Farm_localization | J84 | Bad Ass gave me this candle... | `Waaghals gaf me deze kaars...` → `Stoere Ezel gaf me deze kaars...` |
| _…115 more in `reconcile-2026-05-08.json`_ | | | |

### `2_asses.masses_E2Proxy.xlsx` — 46 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E2_BattleButte_localization | J23 | You Grunt. | `Je Gromt.` → `Je GROMT.` |
| E2_BattleButte_localization | J24 | You Bray. | `Je balkt.` → `Je BALKT.` |
| E2_BattleButte_localization | J26 | You Stomp. It's very effective! | `Je schopt. Het is bijzonder effectief.` → `Je SCHOPT. Het is bijzonder effectief.` |
| E2_BattleButte_localization | J28 | You Tackle! | `Je valt aan!` → `Je VALT ANN!` |
| E2_BattleButte_localization | J30 | You Double Kick! | `Je stampt dubbel!` → `Je STAMPT DUBBEL!` |
| _…41 more in `reconcile-2026-05-08.json`_ | | | |

### `3_asses.masses_E3Proxy.xlsx` — 46 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E3_100_localization | J9 | July 15th\n\nINVOICE\nEBZ75 Tunnel Boring Machine… | `15 juli\n\nFACTUUR\nEBZ75 Tunnelboormac…` → `15 juli\n\nFACTUUR\nEBZ75 Tunnelboormac…` |
| E3_100_localization | J10 | August 17th\nThe City Bank has approved my loan a… | `17 augustus\nDe Stadsbank heeft mijn le…` → `17 augustus\nDe Stadsbank heeft mijn le…` |
| E3_100_localization | J11 | August 17th\nThe City Bank has approved my loan a… | `17 augustus\nDe Stadsbank heeft mijn le…` → `17 augustus\nDe Stadsbank heeft mijn le…` |
| E3_100_localization | J12 | FANNYSIDE TIMES | `De Volksmuil` → `STREEF NAAR MEER\nin Technopolis` |
| E3_100_localization | J13 | Boring Machine Blunder Begets Backlash for Big Bo… | `Boormachine Blunder Brengt Baas Vansche…` → `De Volksmuil` |
| _…41 more in `reconcile-2026-05-08.json`_ | | | |

### `4_asses.masses_E4Proxy.xlsx` — 76 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E4_AstralPlaneMain_localization | J3 | *COUGH* | `*HOEST*` → `*KUCH*` |
| E4_AstralPlaneMain_localization | J4 | *COUGH COUGH* | `*HOEST HOEST*` → `*KUCH KUCH*` |
| E4_AstralPlaneMain_localization | J5 | *COUGH* | `*HOEST*` → `*KUCH*` |
| E4_AstralPlaneMain_localization | J6 | *COUGH COUGH* | `*HOEST HOEST*` → `*KUCH KUCH*` |
| E4_AstralPlaneMain_localization | J7 | *COUGH* | `*HOEST*` → `*KUCH*` |
| _…71 more in `reconcile-2026-05-08.json`_ | | | |

### `5_asses.masses_E5Proxy.xlsx` — 7 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E5_CircusMain_localization | J30 | So stay tuned! | `Dus blijf blij ons!` → `Dus blijf bij ons!` |
| E5_CircusMain_localization | J45 | Once the crowd sees my routine, the Ringmaster is… | `Wanneer de circusdirecteur mijn routine…` → `Wanneer de Circusdirecteur mijn routine…` |
| E5_CircusMain_localization | J69 | Not everyone has the ape-titude to be a star! | `Niet iedereen heeft de aap-itude om de …` → `Niet iedereen heeft de aap-titude om de…` |
| E5_CircusMain_localization | J241 | With all your power and resources, will you preve… | `Met al je vermogen en invloed, ga je er…` → `Met al je vermogen en invloed, ga je er…` |
| E5_CircusMain_localization | J244 | Bumpkinites deserved more than dangerously out-of… | `Muilegemmers verdienen beter dan oud en…` → `Klotegemmers verdienen beter dan oud en…` |
| _…2 more in `reconcile-2026-05-08.json`_ | | | |

### `6_asses.masses_E6Proxy.xlsx` — 55 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E6_BadCave_localization | J20 | Hey Uncle Bad Ass... | `Hé Oom Stoere...` → `Hé Nonkel Stoere...` |
| E6_BadCave_localization | J26 | Hey Uncle Bad Ass... | `Hé Oom Stoere...` → `Hé Nonkel Stoere...` |
| E6_BattleHard_localization | J10 | Uncle Hard, everyone says you're a two-faced liar! | `Oom Bikkel, iedereen zegt dat je een ac…` → `Nonkel Bikkel, iedereen zegt dat je een…` |
| E6_MineLift_localization | J4 | Uncle Bad Ass is going to be so disappointed in m… | `Oom Stoere Ezel gaat zo teleurgesteld i…` → `Nonkel Stoere Ezel gaat zo teleurgestel…` |
| E6_Nightmare_localization | J10 | Lazy could NOT handle another shift with HER. | `Luie kon NIET nog een shift aan met HAA…` → `Luie Ezel kon NIET nog een shift aan me…` |
| _…50 more in `reconcile-2026-05-08.json`_ | | | |

### `7_asses.masses_E7Proxy.xlsx` — 11 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E7_Chilling_localization | J18 | {color=yellow}{s=5}♪  hee haw hi hon 'ee ah he a'… | `{color=yellow}{s=5}♪ hie haa hie hon 'i…` → `{color=yellow}{s=5}♪ hie haa hi hon 'ie…` |
| E7_Holding1_localization | J10 | @#$%&! We're NOT AT THE ZOO ANYMORE! | `@#$%&! We zitten NIET MEER IN DE ZOO, h…` → `@#$%&! We zitten NIET MEER IN DE DIEREN…` |
| E7_Holding1_localization | J13 | Slow Ass wasn't in the Truck-Machine when we got … | `Slome Ezel zat niet in de Camion Machin…` → `Slome Ezel zat niet in de Camion-Machin…` |
| E7_Holding1_localization | J16 | Maybe he's still stuck in the Truck-Machine. | `Misschien zit hij nog vast in de Camion…` → `Misschien zit hij nog vast in de Camion…` |
| E7_ShippingTwo_localization | J4 | *ksch*—Attention all workers. We have a Code 455. | `*ksch*—Aandacht alle medewerkers. We he…` → `*tsj*—Aandacht alle medewerkers. We heb…` |
| _…6 more in `reconcile-2026-05-08.json`_ | | | |

### `8_asses.masses_E8Proxy.xlsx` — 1 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E8_TheGods_localization | J18 | Ass Power! | `Ezelkracht!` → `Ezels Eerst!` |

### `9_asses.masses_E9Proxy.xlsx` — 8 cell(s)

| Sheet | Cell | EN | baseline → theirs |
|-------|------|----|-------------------|
| E9_BadCave_localization | J9 | Uncle Bad—Cole... is being a donkey such a terrib… | `Oom Stoere—Piet... is het zo erg om een…` → `Nonkel Stoere—Piet... is het zo erg om …` |
| E9_BadCave_localization | J43 | Your Uncle Bad is an Ass, not an evil, soul-less,… | `Je Oom Stoere is een Ezel, niet een sle…` → `Je Nonkel Stoere is een Ezel, niet een …` |
| E9_BadCave_localization | J75 | When in reality, the Gods transformed me into a d… | `Terwijl in werkelijkheid DE GODEN mij i…` → `Terwijl in werkelijkheid de Goden mij i…` |
| E9_GoldenAss_localization | J14 | This is my Uncle. He's a Machine too! | `Dit is mijn nonkel. Hij is ook een Mach…` → `Dit is mijn Nonkel. Hij is ook een Mach…` |
| E9_GoldenAss_localization | J70 | As the Prophet you shall go down in History as th… | `Als de Profeet zult gij de Geschiedenis…` → `Als de Profeet zult gij de Geschiedenis…` |
| _…3 more in `reconcile-2026-05-08.json`_ | | | |

---

## agreed (33) — no action

Cells both sides edited identically (we may have pushed earlier, or Patrick made same call).

| File | Sheet | Cell | baseline → both |
|------|-------|------|------------------|
| `10_asses.masses_E10Proxy.xlsx` | E10_Government_localization | J6 | `Het regeringsgebouw van Mechalen is ove…` → `Het regeringsgebouw van Technopolis is …` |
| `10_asses.masses_E10Proxy.xlsx` | E10_Government_localization | J81 | `Maar de burgers van Mechalen zijn niet …` → `Maar de burgers van Technopolis zijn ni…` |
| `10_asses.masses_E10Proxy.xlsx` | E10_Government_localization | J83 | `Als ge mij uw eisen vertelt, kameraden,…` → `Als ge mij uw eisen vertelt, kameraden,…` |
| `10_asses.masses_E10Proxy.xlsx` | E10_ProphetSpeech_localization | J28 | `Kameraden van Mechalen.` → `Kameraden van Technopolis.` |
| `10_asses.masses_E10Proxy.xlsx` | E10_ProphetSpeech_localization | J30 | `Als ge aan Mechalen denkt—waar denkt ge…` → `Als ge aan Technopolis denkt—waar denkt…` |
| `10_asses.masses_E10Proxy.xlsx` | E10_ProphetSpeech_localization | J33 | `Maar wa denkt ge dat die Ezels denken a…` → `Maar wa denkt ge dat die Ezels denken a…` |
| `10_asses.masses_E10Proxy.xlsx` | E10_ProphetSpeech_localization | J44 | `En ge zijt niet content over hun bezett…` → `En ge zijt niet content over hun bezett…` |
| `10_asses.masses_E10Proxy.xlsx` | E10_ProphetSpeech_localization | J93 | `En ik ben Mevr. Derrière—de meest filan…` → `En ik ben Mevr. Derrière—de meest filan…` |
| `1_asses.masses_E1Proxy.xlsx` | E1_FarmHouseInt_localization | J3 | `*tsj* Beste luisteraars, welkom terug b…` → `*tsj* Beste luisteraars, welkom terug b…` |
| `1_asses.masses_E1Proxy.xlsx` | E1_FarmHouseInt_localization | J4 | `We zijn hier met de grootste en meest f…` → `We zijn hier met de grootste en meest f…` |
| `1_asses.masses_E1Proxy.xlsx` | E1_RedFields_localization | J7 | `Happy Ezel` → `Blije Ezel` |
| `2_asses.masses_E2Proxy.xlsx` | E2_BattleButte_localization | J3 | `Bikkeharde Ezel` → `Bikkelharde Ezel` |
| `2_asses.masses_E2Proxy.xlsx` | E2_World_A1_localization | J43 | `Slome Ezel moet achterblijven en het ez…` → `Slome Ezel moet achterblijven en het He…` |
| `3_asses.masses_E3Proxy.xlsx` | E3_LazysGrave_localization | J21 | `Ik kan het ezelenhemelvaartszangderziel…` → `Ik kan het Hemelvaarts-zang-der-Ezel-zi…` |
| `5_asses.masses_E5Proxy.xlsx` | E5_CircusMain_localization | J27 | `De meest welvarende weldoener van Mecha…` → `De meest welvarende weldoener van Techn…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_BadCave_localization | J35 | `Mechalen.` → `Technopolis.` |
| `6_asses.masses_E6Proxy.xlsx` | E6_Nightmare_localization | J33 | `Misschien moet ik gewoon vertrekken en …` → `Misschien moet ik gewoon vertrekken en …` |
| `6_asses.masses_E6Proxy.xlsx` | E6_Nightmare_localization | J39 | `Ik heb Mechalen nooit gehaald...` → `Ik heb Technopolis nooit gehaald...` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J33 | `Welke weg moeten we nemen, Kameraad?` → `Welke weg moeten we nemen?` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J63 | `De structuur mist elke integriteit en w…` → `De structuur mist elke integriteit en w…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J74 | `Is alles in orde daarbinnen? Heb je hul…` → `Is alles in orde daarbinnen? Heb je hul…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J135 | `Hoe zou ik dit noemen, kameraad?` → `Hoe zou ik dit noemen?` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J183 | `Triestige, dit Herdenkingstuintje wordt…` → `Triestige, dit Herdenkingstuintje wordt…` |
| `6_asses.masses_E6Proxy.xlsx` | E6_World_localization | J262 | `Helpen? Wij helpen geen verraders, Kame…` → `Helpen? Wij helpen geen verraders.` |
| `7_asses.masses_E7Proxy.xlsx` | E7_BigBattle_localization | J13 | `Ik heb een Master in Business Administr…` → `Ik heb een Master in Business Administr…` |
| `9_asses.masses_E9Proxy.xlsx` | E9_BadCave_localization | J5 | `'k Kan eindelijk naar Mechalen!` → `'k Kan eindelijk naar Technopolis!` |
| `9_asses.masses_E9Proxy.xlsx` | E9_BadCave_localization | J18 | `Ga je nu naar Mechalen...?` → `Ga je nu naar Technopolis...?` |
| `9_asses.masses_E9Proxy.xlsx` | E9_BadCave_localization | J23 | `Maar ik wil Mechalen ook zien! We kunne…` → `Maar ik wil Technopolis ook zien! We ku…` |
| `9_asses.masses_E9Proxy.xlsx` | E9_GoldenAss_localization | J86 | `Kan de eerste stop Mechalen zijn?` → `Kan de eerste stop Technopolis zijn?` |
| `9_asses.masses_E9Proxy.xlsx` | E9_GoldenAss_localization | J99 | `'k Zie u in Mechalen.` → `'k Zie u in Technopolis.` |
| `9_asses.masses_E9Proxy.xlsx` | E9_GoldenAss_localization | J109 | `Wil je met mij mee naar Mechalen?` → `Wil je met mij mee naar Technopolis?` |
| `9_asses.masses_E9Proxy.xlsx` | E9_GoldenAss_localization | J137 | `'k Kom u zoeken in Mechalen.` → `'k Kom u zoeken in Technopolis.` |
| `9_asses.masses_E9Proxy.xlsx` | E9_GoldenAss_localization | J150 | `'k Ga naar Mechalen.` → `'k Ga naar Technopolis.` |

---

*End of reconcile report.*
