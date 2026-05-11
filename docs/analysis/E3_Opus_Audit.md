# Consistency Audit: Episode 3 (Opus)
**File:** `3_asses.masses_E3Proxy.xlsx`
**Status:** STASHED (Pending Review)
**Generated:** 2026-05-10 by Opus full-scan
**Sheets covered:** 10 (100, 200, 300, BadCave, DonkeyBas, EpisodeTitle, LazysGrave, Mine1FOpening, Mine1F, Rocks)
**Cells flagged:** 40 unique cells / 45 issues + register drift sub-bucket

> **Coverage:** all 46 master-list categories + today's new feedback items.
> **Significant new finding:** **5 je/jij speaker register drift cells** in Mine1F (Sad Ass, Nice Ass, Slow Ass) using `uw` toward Foal in non-dismissive contexts — should mostly become `je` per pronoun-exception rule.

---

## E3_100_localization (5 cells — letter/journal sheet, Butte's diary)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| 100 | 3 | (diary) | Comrade Mother told me not to touch the **Machines**... | Kameraad Moeder heeft gezegd dat ik de **Machines** niet mag aanraken... | Kameraad Moeder heeft gezegd dat ik de **Machienen** niet mag aanraken... | Machines → Machienen |
| 100 | 4 | {$NewName} | I shouldn't touch the Machines... but what does it do? | **k** Mag de **Machines** niet aanraken... maar wat doet dat ding? | **'k** Mag de **Machienen** niet aanraken... maar wat doet dat ding? | Apostrophe + Machines (combined) |
| 100 | 7 | (diary) | These are dire times for the mining business. I had to lay off more workers today and we're running out of money. Mme. Derriere made another offer on my **asses**, but... | 27 juni\n...Mevr. Derrière heeft weer een bod gedaan op mijn **ezels**... | (cap to **Ezels**) | Ezel capitalization (in journal narrative) |
| 100 | 10 | (diary) | August 17th\nThe City Bank has approved my loan... brand new equipment... I'm widening the tunnels and laying tracks. That'll let me run **donkeys** in there... | 17 augustus\n...Da gaat de productie van koelen vergemakkelijken voor de **ezels** die er werken. | (cap to **Ezels**) | Ezel capitalization |
| 100 | 11 | (diary) | (duplicate of J10) | (duplicate) | (duplicate) | Duplicate fix |
| 100 | 14 | (newspaper article) | The town is still reeling from the tragedy at Butte Mines on Thursday. After several failed rescue operations, a catastrophic cave-in caused by **donkeys**... | ...catastrofale instorting veroorzaakt door een **Bende ezels**... | (cap to **Bende Ezels**) | Ezel capitalization |

⚠️ **Decision check:** these are journal/newspaper text contexts (not character dialogue). Same caveat as E0 quiz cells. **Confirm rule applies to narrative text too?**

---

## E3_200_localization (1 cell — Butte diary, AA group entry)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| 200 | 3 | (diary, long multi-day entry) | May 15th... I've started attending an AA group... [later entry: "Today I sold my depressed donkey to the Fannyside Farm"] | 15 mei... [later: "...mijn depressieve **ezel** verkocht aan de **Boerderij** van **Muilegem**."] | Combined: **Ezel** + **Hoeve** + **Muilenbeek** | 3-in-1 fix in same long cell |

→ This single cell is the only E3 hit for: Muilegem stray, Boerderij drift, AND Ezel cap drift in narrative.

---

## E3_300_localization (2 cells)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| 300 | 3 | (diary) | (long multi-paragraph entry) | ...includes lowercase **ezel** mid-text... | (cap to **Ezel**) | Ezel capitalization (narrative) |
| 300 | 5 | {$NewName} | Well the other two **Machines** weren't that bad... | Awel, die andere twee **Machines** waren niet zo erg... | Awel, die andere twee **Machienen** waren niet zo erg... | Machines → Machienen |

---

## E3_BadCave_localization (8 cells)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| BadCave | 11 | {$NewName} | Wait, what are all these **Machines**? | Wacht, wat zijn al die **Machines**? | Wacht, wat zijn al die **Machienen**? | Machines → Machienen |
| BadCave | 15 | Bad Ass | ...these **Machines** are called Computers. | ...deze **Machines** heten Computers. | ...deze **Machienen** heten Computers. | Machines → Machienen |
| BadCave | 19 | {$NewName} | Comrade Mother always says **Machines** are evil... | Kameraad Moeder zegt altijd dat **Machines** slecht zijn... | Kameraad Moeder zegt altijd dat **Machienen** slecht zijn... | Machines → Machienen |
| BadCave | 21 | Bad Ass | Don't give me that anti-**Machine** Comrade Mother-bullshit. | Kom mij nie af met die anti-**Machine** Kameraad Moeder-zever. | Kom mij nie af met die anti-**Machien** Kameraad Moeder-zever. | Machine → Machien (compound) |
| BadCave | 22 | Bad Ass | **Machines** aren't evil if you know how to use them. | **Machines** zijn nie slecht als ge weet hoe ze te gebruiken. | **Machienen** zijn nie slecht als ge weet hoe ze te gebruiken. | Machines → Machienen |
| BadCave | 35 | Bad Ass | Just don't hit the **donkeys**. | Sla gewoon nie op de **ezels**. | Sla gewoon nie op de **Ezels**. | Ezel capitalization |
| BadCave | 38 | {$NewName} | **Machines** are FUN! | **Machines** zijn PLEZANT! | **Machienen** zijn PLEZANT! | Machines → Machienen |
| BadCave | 43 | {$NewName} | Why is the Herd afraid of **Machines**? | Waarom is de Kudde bang van **Machines**? | Waarom is de Kudde bang van **Machienen**? | Machines → Machienen |

---

## E3_DonkeyBas_localization (1 cell)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| DonkeyBas | 17 | Bad Ass | You have to avoid 5 Herds of **donkeys** to win. | Ge moet 5 Kuddes **ezels** ontwijken om te winnen. | Ge moet 5 Kuddes **Ezels** ontwijken om te winnen. | Ezel capitalization |

---

## E3_EpisodeTitle_localization (1 cell)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| EpisodeTitle | 7 | Hard Ass | Hurry up, **Sick Ass**! | Opschieten, **Snotezel**! | Opschieten, **Snotje**! | Name: Snotezel → Snotje (codex short — Hard Ass calling Sick Ass) |

---

## E3_LazysGrave_localization (0 cells)

✓ **Verified clean.** Foal cells using `uw`/`u` toward Lazy Ass are **legitimate** under the senior-exception rule:
- J17: `Waarom is uw Ezelenziel...` — Foal to ghost-elder ✓
- J21: `voor u proberen zingen` — Foal to ghost-elder ✓

Also confirms `Astrale Hiernamaals` form is correct here (J17).

---

## E3_Mine1FOpening_localization (7 cells)

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| Mine1FOpening | 10 | Sturdy Ass | But soon the Gods will destroy the evil **Machines** and the Humans will return to us. | Maar binnenkort gaan de Goden die slechte **Machines** kapotmaken en komen de Mensen terug naar ons. | Maar binnenkort gaan de Goden die slechte **Machienen** kapotmaken en komen de Mensen terug naar ons. | Machines → Machienen |
| Mine1FOpening | 33 | Sturdy Ass | **Smart Ass**, divide the rations. | **Betweter**, verdeel de ratioenen. | **Slimme**, verdeel de ratioenen. | Old moniker → Slimme |
| Mine1FOpening | 51 | Smart Ass | If we don't leave and find the Humans now, we'll all end up like **Sick Ass**. | Als we nu niet vertrekken en de Mensen zoeken, eindigen we allemaal zoals **Snotezel**. | Als we nu niet vertrekken en de Mensen zoeken, eindigen we allemaal zoals **Snotje**. | Name: Snotezel → Snotje |
| Mine1FOpening | 65 | Sturdy Ass | Yes, just stay away from the evil, soulless, job-taking, child-killing **Machines**. | Ja, maar blijf weg van die slechte, zielloze, werk-afpakkende, kind-dodende **Machines**. | Ja, maar blijf weg van die slechte, zielloze, werk-afpakkende, kind-dodende **Machienen**. | Sturdy lament canonical (#33) — Machines → Machienen completes the canonical form |
| Mine1FOpening | 69 | (label) | Nice Ass | **Schoon Beest** | **Lieve Ezel** | Old moniker → Lieve Ezel |
| Mine1FOpening | 70 | (label) | Kick Ass | **Stampgast** | **Stamp** | Name: Stampgast → Stamp (codex short) |
| Mine1FOpening | 71 | (label) | Smart Ass | **Betweter** | **Slimme** | Old moniker → Slimme |

---

## E3_Mine1F_localization (16 cells — largest E3 sheet)

### Standard fixes

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| Mine1F | 41 | Sad Ass | That day in the **Outhouse**... I really thought that things would get better. | Die dag in de **Hudo**... Ik dacht echt dat 't beter ging worden. | **(DECISION PENDING — HUDO)** | HUDO replacement |
| Mine1F | 45 | Nice Ass | I wasn't fast enough to save the **Stable**. | Ik was nie snel genoeg om de **Stal** te redden. | (no change) | ✓ Stal correct (literal stable) |
| Mine1F | 46 | Nice Ass | I only barely saved the **Stable**. | Ik heb de **Stal** maar net gered. | (no change) | ✓ Stal correct |
| Mine1F | 107 | Hard Ass | That's enough. Run along. | **t** Is genoeg. Ga nu weg. | **'t** Is genoeg. Ga nu weg. | Apostrophe drift |
| Mine1F | 110 | {$NewName} | It sounds like someone's in pain... | **t** Klinkt alsof iemand pijn heeft... | **'t** Klinkt alsof iemand pijn heeft... | Apostrophe drift |
| Mine1F | 120 | {$NewName} | Will you watch me play Rocks, **Uncle Slow**? | Wil je kijken naar mijn Keien-spel, **Oom Sloom**? | Wil je kijken naar mijn Keien-spel, **Nonkel Slome**? | Combined: Oom→Nonkel + Sloom→Slome |
| Mine1F | 128 | Sturdy Ass | By the Gods! **Smart Ass**, you know {$NewName} can't digest that kind of food yet. | Bij de Goden! **Betweterke**, je wéét dat {$NewName} dat soort eten nog niet verteert. | Bij de Goden! **Slimmeke**, je wéét dat {$NewName} dat soort eten nog niet verteert. | Old moniker (diminutive) → Slimmeke |
| Mine1F | 137 | Sturdy Ass | I understand, **Comrade**. | Ik versta het, **Kameraad**. | (REVIEW m2) | Sturdy , Kameraad — EN justifies; m2 review only |

### Register drift — je/jij speakers using `uw` toward Foal (5 cells)

⚠️ **All flagged for register review.** Per the locked pronoun-exception rule: `u/uw toward {$NewName} only allowed when dismissive/patronizing.` None of these contexts are dismissive — they should be `je`/`jou`/`jouw`.

| Sheet | Row | Speaker | EN | Current NL | Proposed NL | Rationale |
|---|---|---|---|---|---|---|
| Mine1F | 19 | Sad Ass | *sigh* Because some days your **Uncle Sad Ass** just doesn't know why he's alive... | *zucht* Omdat **uw** Nonkel Triestigaard sommige dagen zelf nie weet waarom hij nog leeft... | *zucht* Omdat **je** Nonkel Triestigaard sommige dagen zelf nie weet waarom hij nog leeft... | Sad Ass is je/jij; self-pitying ≠ dismissive |
| Mine1F | 30 | Nice Ass | Sorry little Comrade, let's give your **Uncle** some space. | Sorry, kleine Kameraad, we laten **uw** Nonkel best efkes gerust. | Sorry, kleine Kameraad, we laten **je** Nonkel best efkes gerust. | Nice Ass is je/jij; gentle ≠ dismissive |
| Mine1F | 33 | Nice Ass | Don't worry, it's not your fault. | **t** Is **uw** schuld nie, maak **u** geen zorgen. | **'t** Is **je** schuld nie, maak **je** geen zorgen. | Combined: apostrophe + register (Nice Ass) |
| Mine1F | 34 | Nice Ass | You just remind him so much of your sister. | **Ge** doet hem gewoon te hard denken aan **uw** zus. | **Je** doet hem gewoon te hard denken aan **je** zus. | Nice Ass uses both ge AND uw — both forbidden |
| Mine1F | 121 | Slow Ass | I'd love to b-but... I don't think I can p-play that game of yours. | Graag, m-m-maar... ik denk niet dat ik **uw** s-s-spel kan spelen. | Graag, m-m-maar... ik denk niet dat ik **je** s-s-spel kan spelen. | Slow Ass is je/jij |

---

## E3_Rocks_localization (0 cells)

✓ Clean.

---

## Notes on E3

### Categories scanned (full list applied)

**Active hits:**
- ✅ #1 Pronoun register — **5 drift cells** (Sad Ass, Nice Ass ×3, Slow Ass — all je/jij speakers using `uw`/`u`/`ge` toward Foal in non-dismissive contexts)
- ✅ #4 Sturdy `, Kameraad` (m2) — 1 cell (Mine1F J137; EN justifies)
- ✅ #6 Old monikers (Schoon Beest 1, Betweter 2 + 1 diminutive Betweterke) — 4 cells
- ✅ #9 Muilegem stray — 1 cell (E3_200 J3 long letter)
- ✅ #12 Uncle Oom → Nonkel (Foal speakers) — 1 cell (Mine1F J120 — combined with Sloom→Slome)
- ✅ #13 Boerderij → de Hoeve — 1 cell (E3_200 J3, in same long letter)
- ✅ #21 Ezel capitalization — 8 cells (incl. 5 narrative/diary cells in 100/200/300)
- ✅ #24 Machine → Machien / Machienen — 14 cells (heavy concentration in BadCave + Mine1FOpening)
- ✅ #33 Sturdy lament canonical — Mine1F J65 needs final `Machienen` swap to complete canonical form
- ✅ #35 Apostrophe (`t` → `'t`) — 4 cells (Mine1F J31/33/107/110, plus 100 J4 `k`→`'k`)
- ✅ Today: HUDO — 1 cell (Mine1F J41 Sad Ass dialogue)
- ✅ Today: Snotezel → Snotje — 2 cells (EpisodeTitle J7, Mine1FOpening J51)
- ✅ Today: Stampgast → Stamp — 1 cell (Mine1FOpening J70 label)
- ✅ Today: Sloom → Slome — 1 cell (Mine1F J120, combined with Oom→Nonkel)

**Categories with zero hits in E3 (verified clean):**
- ✓ #7 Bikkeharde — 0 (all `Bikkelharde` correct)
- ✓ #8 Mechalen — 0
- ✓ #10 MUILEBEEK all-caps — 0 (only stray is region: Muilegem)
- ✓ #11 Bar Poepegaatje — 0
- ✓ #14 Vazal/Afgevaardigde — 0
- ✓ #16 Slogan — 0 (no slogan instances in E3)
- ✓ #18 Hie/Haa — 0
- ✓ #25 Stenen-Spel residue — 0
- ✓ #26 Sad whimper — 0 drift (canonical only)
- ✓ #29 Inflection (Astraal/Astrale) — 0 (J17 LazysGrave correct: `Astrale Hiernamaals`)
- ✓ Today: Schup, doekjes, Afspraak, Sturdy m2 strip — 0 in E3
- ✓ #44 *-Zak residue — 0
- ✓ #45 Parenthesised EN leak — 0
- ✓ #46 Bare EN names — 0

### Decisions pending in E3

1. **HUDO** (Mine1F J41) — same decision tree as E1/E2. Total HUDO corpus-wide: 9.
2. **Narrative-text Ezel caps** (5 cells in 100/200/300 — Butte's diary + newspaper) — Same question as E0 quiz: does the cap rule apply to journalistic/diary narration, or only character dialogue? Recommend: **apply** (proper noun rule is global; diary narration treats Ezel as proper noun consistently), but flag for confirmation.
3. **Sad Ass uw J19** — context is Sad Ass being self-pitying about himself. Strict reading of exception rule: not dismissive/patronizing → fix to `je`. But the line is melancholic-paternal; could be argued either way. Defaulting to `je`. Confirm or flip?

### Reconciliation with Gemini's E3 audit

Gemini's E3 audit listed:
- ~14 Machine fixes ✓ (matches Opus)
- "Oom Sloom" → "Nonkel Sloom" ✓ — but Gemini kept `Sloom`; Opus also fixes Sloom→Slome per codex
- Snotezel hits ✓ — Opus reverses to Snotje (codex)
- Stampgast hit (J70) ✓ — Opus reverses to Stamp
- "Schoon Beest" / "Betweter" — Opus catches Betweterke diminutive too (J128) which Gemini missed
- **Gemini did NOT catch**: 5 register drift cells (J19, J30, J33, J34, J121) — these are new Opus findings under the locked pronoun-exception rule
- **Gemini did NOT catch**: 4 apostrophe drift cells — these are new
- **Gemini did NOT catch**: Sturdy lament Mine1F J65 needs `Machienen` to complete canonical
- **Gemini did NOT catch**: Muilegem stray in E3_200 J3 letter (subsumed under Machien sweep wrongly)

---

**Total E3 cells flagged: 40 unique** (45 issues counting combined fixes). 1 HUDO decision pending. 5 register drift + 5 narrative-cap cells need confirmation. The rest are mechanical sweeps.
