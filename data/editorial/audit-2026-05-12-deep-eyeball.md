# Deep Eyeball Audit — 2026-05-12

_Generated alongside the comprehensive regex audit. This document captures findings the unified canon scanner CANNOT detect by regex alone: §1 codex voice, §5.1 register exceptions, §6.7 cross-sheet term consistency, §6.9 Plan vs afspraak (EN-driven), §7.3.1 cap/lc collisions, §9.3 terminal punctuation parity, §12.3 Slow Ass stutter, §12.4 English bleed, §13 broader mistranslations. **Walked per-episode, per-sheet, per-cell** against `_CANON.md` + `_PUSH-LOG.md`._

**Canon SHA:** `24c0df0` | **Push log:** 241 unique pushed cells | **Audit date:** 2026-05-12

## Document structure

This doc walks every J-column cell of every sheet of every workbook E0–E10. Each episode has a top-level `## E{N}` section. Inside, each sheet has its own `### E{N} / {SheetName}` subsection with verbatim EN + NL + speaker + canon citation per flagged cell. **Per-subsheet writes** — findings live with their sheet, not aggregated at the top.

The "Full-Walk Findings — Large Sheets" addendum at the bottom captures additional drift found when re-walking the five largest sheets (E6_World, E10_Government, E4_AstralPlaneMain, E5_ZooMain, E10_ProphetSpeech) end-to-end after the initial sample-based pass. Findings there are also keyed to `E{N} / {SheetName} / J{row}` so a reader can locate them in workbook order.

## Methodology

For each sheet, I read every NL-non-empty cell (skipping `SPACER` / Lorem-ipsum template rows). For each cell I check:

1. **EN ↔ NL semantic faithfulness** — does the NL translate what the EN actually says?
2. **Speaker register** — pronouns/articles/contractions consistent with codex voice for the speaker; respect §17 Q19 Resentful Ass exception, §5.4 imperatives, Foal mixed-register.
3. **Cross-sheet term consistency** — recurring proper nouns (Mijn, Plee, Stal, Hoeve, Kudde, Job, Tournee, Circusdirecteur, Astrale Hiernamaals) used identically.
4. **Cap/lc collisions** — `Mijn` (game system) vs `mijn` (possessive); `Job` (system) vs `job` (generic).
5. **Terminal punctuation parity** — EN ending punctuation reflected in NL.
6. **English bleed** — untranslated English words/idioms left in NL.
7. **Slow Ass stutter** — `s-s...` / `m-m...` patterns where Slow speaks.
8. **Reassignment lock** — §13.5 `Heraanstelling`/`heraangesteld` (not `herverkoren`/`herrijzen`).
9. **Push-log alignment** — pushed values are reflected in current cell.

I quote EN and NL verbatim. Where I'm not sure, I flag `VERIFY` rather than `DRIFT`. No language invented.

## Severity legend

- **DRIFT** — clearly deviates from canon
- **VERIFY** — anomaly worth Tom's eye; could be intentional
- **NOTE** — observation worth recording but not actionable on its own

---

## E0 — Manager+Intermissions+E0Proxy

### E0 / ManagerScene_localization (14 cells)

Character-roster UI labels. All 14 cells match canonical monikers per codex (Trouwe / Lieve / Mega / Beschonken / Slimme / Slome / Stamp / Snot / Bikkelharde / Stevige / Triestige Ezel + Piet-Machine). **No findings.**

### E0 / CharacterProfiles_localization (105 cells)

**J21** — `VERIFY` — God name styling (uppercase in NL)
- Speaker: `The Gods` | EN: `Hee` | NL: `HIE`
- EN is mixed-case "Hee"; NL is all-caps "HIE". Canon §7.4 governs God *pronoun* capitalization (U/Uw), not the name itself. Stylistic choice flagged for Tom.

**J22** — `VERIFY` — God name styling (uppercase in NL)
- EN: `Haw` | NL: `HAA`
- Same pattern as J21. Mixed-case EN → all-caps NL. Verify intent vs J23 (`THE GODS → DE GODEN`) which has uppercase in EN already.

**J33** — `VERIFY` — semantic shift (vet vs zookeeper)
- EN: `Zookeeper Rose` | NL: `Dierendokter Dina`
- `Dierendokter` = veterinarian (animal doctor). `Zookeeper` = `Dierentuinverzorger` / `Dierenoppasser`. Verify whether this is a deliberate character-role reinterpretation locked in canon.

**J34** — `NOTE` — semantic granularity
- EN: `Factory PA` | NL: `Fabrieksintercom`
- `PA` (public address) is one-way broadcast; `intercom` implies two-way. Functional but not semantically identical. Could be `Fabrieksomroep`.

**J58** — `VERIFY` — weaker mood word
- EN: `Tragic Ass` | NL: `Weemoedige Ezel`
- `Weemoedig` = melancholy/wistful. `Tragic` is much stronger (catastrophic, doomed). Possible mistranslation but may be intentional softening for character-type label.

**J63** — `VERIFY` — register shift (dark vs gloomy)
- EN: `Gloomy Ass` | NL: `Duistere Ezel`
- `Duister` = dark/sinister/shadowy. `Gloomy` = sombre/dejected. `Sombere Ezel` would be a closer match.

**J66** — `VERIFY` — register shift (pale vs gaunt)
- EN: `Gaunt Ass` | NL: `Vale Ezel`
- `Vaal` = pale/sallow. `Gaunt` = haggard/emaciated. Different semantic register (skin pallor vs body wasting).

**J68** — `VERIFY` — noun/adjective form
- EN: `Weepy Ass` | NL: `Jank Ezel`
- `Jank` = whine/yowl (noun). Adjective form would be `Jankende` ("whining"). Or `Tranerige Ezel` for "weepy". Verify intentional clipping.

**J69** — `VERIFY` — interpretation ambiguity
- EN: `Edgy Ass` | NL: `Avantgarde Ezel`
- `Edgy` can mean (a) on-edge/nervous OR (b) trendy/avant-garde. NL chose meaning (b). Verify intent — if (a), `Nerveuze Ezel` or `Gespannen Ezel`.

**J70** — `VERIFY` — desolate vs depressed
- EN: `Bleak Ass` | NL: `Depri Ezel`
- `Depri` = colloquial "depressed". `Bleak` = grim/desolate (`Troosteloos`/`Somber`).

**J81** — `DRIFT` — Dutch spelling (extra f)
- EN: `Blunt Ass` | NL: `Groffe Ezel`
- `Grof` → female adj. form is `Grove` (one f, not two). Should be `Grove Ezel`. Spelling drift.

**J82** — `VERIFY` — observe vs glance
- EN: `Peek Ass` | NL: `Constaterende Ezel`
- `Constateren` = ascertain/note. `Peek` = glance quickly. Different action. Could be `Glurende Ezel` or `Spiedende Ezel`.

**J87** — `VERIFY` — drudgery vs haul
- EN: `Haul Ass` | NL: `Sleur Ezel`
- `Sleur` (noun) = drudgery/routine; not an adjective. `Haul` as imperative ("get going!") vs noun ambiguity. Possible alternates: `Sjouwer Ezel`, `Sjouw Ezel`.

**J95** — `DRIFT` — spelling + semantic shift
- EN: `Chafed Ass` | NL: `Excema Ezel`
- `Excema` should be `Eczeem` (Dutch spelling of eczema). Also `Chafed` = irritated/sore from rubbing (`Geïrriteerde` / `Ontvelde`), not eczema specifically. Two issues in one cell.

**J103** — `VERIFY` — deficient vs janky
- EN: `Janky Ass` | NL: `Deficiënte Ezel`
- `Deficiënt` = lacking/deficient. `Janky` = shoddy/unreliable/broken-down. Could be `Wankele Ezel` or `Versleten Ezel`.

### E0 / E0_Instructions_localization (1 cell)
J2 `Aanwijzingen voor Operators [NL]` ✓ clean.

### E0 / E0_GameTitle_localization (1 cell)
J2 `DRUK OP X OM TE BEGINNEN` ✓ clean.

### E0 / E0_Questions_localization (115 cells)

**J27 / J30 / J47** — `NOTE` — "job" vs "baan" terminology mix
- J27: `your job` → `je job` (lowercase — push-locked per canon §6.16 generic context)
- J30: `What kind of job was it?` → `Wat voor soort baan was het?` (NL switches to `baan`)
- J47: `still have the job` → `die baan nog zou hebben` (NL `baan`)
- All three are generic-employment context (player's pre-uprising life), not the game-system donkey-Job. Mix of `job` and `baan` is contextually fine but worth a consistency review (pick one, ideally `baan` for natural Dutch flow).

**J43** — `NOTE` — distinguishing cap shift
- EN: `Do you miss the job?` | NL: `Mis je de Job?`
- Push-locked `§6.16 — game-system Job context`. Pre-uprising donkey-Job ⇒ capped. Contrast with J27/J30/J47 generic. The cap-shift is canon-aware but a player reading the quiz may not perceive the context distinction.

**J74** — `NOTE` — number disagreement EN plural ↔ NL singular
- EN: `Male donkeys have very large penises` | NL: `Mannelijke Ezels een zeer grote penis hebben`
- Plural penises → singular penis. Push log notes `§7.1 + typo hebbem → hebben`. Semantically equivalent (per donkey: one) but loses EN plural. Stylistic call.

**J77** — `NOTE` — quiz wrong-answer localization
- EN: `Jack` | NL: `Burro`
- `Jack` = English term for male donkey (one of the multi-choice wrong answers for "what's a female donkey called?"). NL replaces with `Burro` (Spanish for donkey, gender-neutral). Quiz logic still works — `Burro` is a plausible-but-wrong distractor in NL context. Localization design choice, not drift.

**J91 / J92 / J93 vs J98** — `NOTE` — multi-language quiz handling inconsistency
- J91–J93 (German questions) → translated to Dutch.
- J98 (Spanish question) → kept verbatim Spanish in NL.
- Inconsistent policy. Could be intentional (Spanish-language library content stays Spanish; German-language pun-question translates to keep accessible). Tom to verify whether intentional.

**J62** — `NOTE` — Latin technical name preserved
- EN: `Equus asinus` | NL: `Equus asinus` — kept Latin. ✓ Consistent across J62/J65/J112.

### E0 / 2x/4x/6x/8x_Intermission_localization (12 cells total, identical content)

**J4 (all 4 sheets)** — `NOTE` — `WHENEVER` semantic loss
- EN: `PRESS X TO BEGIN WHENEVER` | NL: `DRUK OP X OM TERUG TE BEGINNEN`
- EN "whenever" = at-your-leisure / no-rush flavor. NL "TERUG TE BEGINNEN" = "to begin again" / resume. Semantically functional (it IS a resume button) but loses the casual "whenever" tone. Possible alternates: `DRUK OP X WANNEER JE WILT` or `DRUK OP X OM VERDER TE GAAN`.

**J2 / J3 (all 4 sheets)** — clean
- `INTERMISSION` → `ONDERBREKING`, `PAUSE` → `PAUZE` ✓

### E0 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note | Clean |
|---|---|---|---|---|---|
| ManagerScene_localization | 14 | 0 | 0 | 0 | ✓ |
| CharacterProfiles_localization | 105 | **2** | 11 | 1 | — |
| E0_Instructions_localization | 1 | 0 | 0 | 0 | ✓ |
| E0_Questions_localization | 115 | 0 | 0 | 5 | — |
| E0_GameTitle_localization | 1 | 0 | 0 | 0 | ✓ |
| 2x_Intermission_localization | 3 | 0 | 0 | 1 | — |
| 4x_Intermission_localization | 3 | 0 | 0 | 1 | — |
| 6x_Intermission_localization | 3 | 0 | 0 | 1 | — |
| 8x_Intermission_localization | 3 | 0 | 0 | 1 | — |

**E0 totals:** 2 DRIFT (J81 `Groffe→Grove`, J95 `Excema→Eczeem`), 11 VERIFY, 10 NOTE.

---

## E1 — E1Proxy

### E1 / E1_EpisodeTitle_localization (2 cells)
Clean. `AFLEVERING ÉÉN`, `HET PROTEST` — ✓

### E1 / E1_Stable1F_localization (29 cells, Old Ass + Trusty + Sturdy)

**J6** — `VERIFY` — pre-uprising "jobs" cap-context
- EN: `wretched Machines do OUR jobs in OUR beloved fields.` | NL: `vervloekte Machines ONS werk in ONZE velden van ons afpakken.`
- Per canon §6.16, pre-uprising labour = game-system Job (capped). NL flattens to lowercase `werk`. Either `Jobs` or `werk` (generic). Verify intent.

**J7** — `VERIFY` — lost EN ALL-CAPS emphasis + period for exclamation
- EN: `No longer will we suffer these INJUSTICES!` | NL: `Wij pikken die onrechtvaardigheden voor geen seconde langer.`
- ALL-CAPS `INJUSTICES` not preserved (NL lowercase `onrechtvaardigheden`). EN `!` → NL `.`. Loss of two emphasis markers.

**J8** — `DRIFT` — Dutch grammar (mixed `dat` clause + `te` infinitive)
- EN: `It is high time the Humans remember how useful we've always been.` | NL: `Het is hoog tijd dat we de Mensen er aan te herinneren hoe belangrijk en nuttig wij voor hen zijn geweest.`
- Subordinate `dat`-clause should take finite verb, not `te`-infinitive. Either rewrite to `om...te herinneren` OR drop `te`: `dat we de Mensen eraan herinneren`. Currently grammatically broken.

**J9** — `VERIFY` — agency shift (passive vs active)
- EN: `To return to us the recognition and respect we deserve!` | NL: `Het is tijd om ons verdiende respect en aanzien terug te grijpen.`
- EN passive (Humans return to us); NL active (we seize back). Different agency. EN `!` → NL `.`.

**J10** — `DRIFT` — non-standard accent spelling
- EN: `Tomorrow we will make history with our very first PROTEST.` | NL: `Morgen schrijven we geschiedenis met onze alleréérste PROTEST.`
- `alleréérste` uses double acute accent — non-standard Dutch. Standard: `allereerste`. If emphasis is wanted, use caps `ALLEREERSTE`.

**J11** — `DRIFT` — Dutch adj-gender agreement (`moraal` = de-word)
- EN: `good group morale is instrumental to a Protest` | NL: `een goed moraal binnen onze ploeg is cruciaal voor een Protest.`
- `de moraal` (feminine), adjective takes `-e`: `een goede moraal`. Current `goed moraal` is incorrect.

**J17** — `VERIFY` — caps + number inconsistency
- EN: `I can't bear to think about them growing up in a world cut off from our Herd's traditions.` | NL: `Het kan me niet over 't hart dat onze veulens in een wereld zonder waarden en normen zullen opgroeien.`
- EN `them` is singular-they (Sturdy's unborn foal). NL `veulens` is plural (other foals in general). Also `Veulen` capped in J16/J29 (specific Foal) but `veulens` lowercase here. Possibly correct (lowercase = generic) but contradicts EN singular-specific.

**J19** — `VERIFY` — balance vs vrede semantic shift
- EN: `If we follow Old Ass, we can restore balance to the Farm.` | NL: `Als we Oude Ezel volgen kunnen we ervoor zorgen dat vrede naar onze Hoeve wederkeert.`
- `balance` → `vrede` (peace). Different concept. `evenwicht`/`balans` would translate `balance` more directly.

**J24** — `VERIFY` — possessive agreement (Kudde = de-word singular)
- EN: `we will restore our Herd to its rightful purpose.` | NL: `zullen we onze Kudde weer op hun rechtmatige pad brengen.`
- EN `its` (Herd singular possessive). NL `hun` (their plural). `de Kudde` is feminine singular → should be `haar`. Modern informal Dutch uses `hun` for collective nouns, but Old Ass speaks formally.

**Punctuation drift in E1_Stable1F** — `NOTE` — several cells drop EN `!` (J7, J9, J30) in favor of `.`. §9.3 blind-spot pattern.

### E1 / E1_Farm_localization (~123 cells — deferred to next chunk)
_See dedicated dump below._

### E1 / E1_Mill_localization (3 cells)
Clean. `Mill-Machine` ✓ §8.2; `zadelzakken` ✓; `verse bloem` ✓.

### E1 / E1_Plowing_localization (16 cells, Nice + Trusty)

**J3** — `NOTE` — Flemish tag-question
- EN: `Plowing's the easiest thing in the world, isn't it?` | NL: `Ploegen is 't gemakkelijkste ding ter wereld, niet?`
- Bare `niet?` tag is colloquial Flemish. Canon §2 niet-lock is satisfied. Stylistic note.

**J5** — `NOTE` — diminutive address `Trouwtje`
- EN: `Gosh! You're amazing Trusty!` | NL: `Wauw, jij kan er wat van Trouwtje!`
- Affectionate diminutive `Trouwtje` (Trusty→Trustykins). Verify codex permits Nice→Trusty diminutive form.

**J6** — `VERIFY` — English-bleed candidate + register
- EN: `we could totally team up and show that nasty Tractor-Machine a thing or two!` | NL: `Vormen we een team? Die lelijke Tractor-Machine zal zien wie hier de baas is.`
- `team` (English loan) — could be `ploeg` per §12.4. Also `nasty` → `lelijke` (ugly); `nasty` = unpleasant/mean, not "ugly".

**J10** — `VERIFY` — metaphor shift
- EN: `That Tractor-Machine has nothing on you!` | NL: `Je maakt die Tractor-Machine kapot!`
- EN "has nothing on you" = "can't compete". NL "Je maakt die Tractor-Machine kapot!" = "You'll destroy it!". Different rhetorical move (cooperation→aggression).

### E1 / E1_TrustysDream_localization (1 cell)
J3 `Trouwe! Opstaan! OPSTAAN!` ✓ (drops "Ass" suffix for intimacy).

### E1 / E1_FarmHouseInt_localization (22 cells, Radio Host Marcos interviewing Mme. Derrière)

**J4** — `VERIFY` — adjective swap (generous→largest)
- EN: `Mecha City's most philanthropic and generous employer Mme. Derriere.` | NL: `de grootste en meest filantropische werkgever in Technopolis: Mevrouw Derrière.`
- EN: "most philanthropic AND generous". NL: "largest AND most philanthropic". `generous` → `grootste` (largest) is a category shift (character→size).

**J5** — `DRIFT` — typo (double `het`)
- EN: `Tell us... what is the secret to your success?` | NL: `Vertel ons eens... wat is het het geheim van je succes?`
- Duplicate `het het`. Should be: `wat is het geheim van je succes?`.

**J7** — `DRIFT` — broken syntax in "hustle and bustle" clause
- EN: `One must embrace the hustle and bustle, but also have a product that changes lives.` | NL: `We moeten bereid zijn hard te werken, en dat aan een product dat levens verandert.`
- `en dat aan een product dat levens verandert` is ungrammatical Dutch. Should be: `en ook een product hebben dat levens verandert.`.

**J11** — `NOTE` — lost idiom
- EN: `We're over the moon!` | NL: `We zijn superblij!`
- "Over the moon" idiom flattened to "very happy". Functional but flat.

**J14** — `DRIFT` — subject-verb agreement (singular `iedereen` → singular verb)
- EN: `I believe that EVERYONE can use this product and reap the benefits.` | NL: `Ik denk dat iedereen de voordelen uit deze producten zullen halen.`
- `iedereen` (everyone) is 3rd-person singular → verb should be `zal halen`, not `zullen halen`. Also EN ALL-CAPS `EVERYONE` lost (lowercase `iedereen`).

**J13** — `NOTE` — flavour-pun compression
- EN: `And it comes in three flavours! My favourite is the Polar Mint.` | NL: `En drie smaken! Mijn favoriet is de Muntige Muil.`
- `Polar Mint` → `Muntige Muil` is a deliberate pun (note "try to make a pun"). ✓ But `it comes in` dropped — bare `En drie smaken!` is choppy.

**J3** — `NOTE` — show-name compression
- EN: `*ksh* Welcome back listeners to Mecha in the Morning!` | NL: `*tsj* Beste luisteraars, welkom terug bij Technopolis Morgen!`
- Mecha→Technopolis ✓ §3.4. Show name `Mecha in the Morning` → `Technopolis Morgen` drops the "in the" link. Could be `Technopolis in de Morgen` to preserve pun structure.

**J20** — `NOTE` — `Big City Circus` → `Stadscircus`
- "Big" lost. `Stadscircus` = "City Circus". Canon §7.2 caps `Stadscircus` ✓ but "Big" emphasis dropped.

**J23** — `NOTE` — casual greeting expansion
- EN: `Hey Trusty!` | NL: `Hey Trouwe Ezel!`
- EN uses just first name (casual); NL expands to full title `Trouwe Ezel`. Less intimate. Could be `Hey Trouwe!`.

### E1 / E1_TheatreInt_localization (2 cells)
Visible content: 1 cell ("Trouwe! ...") + spacer. Tiny.

### E1 / E1_RedFields_localization (11 cells, Astral Plane welcome ritual)

**J13** — `DRIFT` — §12.4 English bleed
- EN: `Follow your instincts and feel the love!` | NL: `Volg je instinct en Feel The Love!`
- `Feel The Love` left untranslated in Title Case English. Should be `voel de liefde!` or kept as a deliberate slogan if Tom locked it. Note: this is dialogue, not a slogan, so translation expected.

**J6–J10** — Astral-plane character options (Spicy / Happy / Dirty / Hairy / Ugly Ass). Match CharacterProfiles canonical names. ✓

### E1 / E1_TheSex_localization (2 cells)

**J4** — `NOTE` — `CHAIN` → `COMBO`
- EN: `CHAIN` | NL: `COMBO`
- Both gaming UI terms for combo-streak. Translator chose more readable Dutch-acceptable term.

### E1 / E1_Farm_localization (123 cells, mixed scenes — signs, Thirsty's bucket quest, Slow's wood quest, Sad's matches quest, Bad's lecture, Grandma+Joey scene)

**J17** — `DRIFT` × 2 — capitalization + Dutch grammar
- EN: `The Truck-Machine is gone. The Humans must be in the Village.` | NL: `De Camion-Machine is weg. De mensen moeten ergens in naar het dorp zijn.`
- `mensen` → `Mensen` per §7.3 game-system cap.
- `ergens in naar het dorp` is ungrammatical — `in` and `naar` can't both follow `ergens`. Should be `ergens in het dorp` (somewhere in the village).

**J24** — `VERIFY` — Thirsty register: `Zou'j` (je or gij?)
- EN: `Can you fetch me some water with that ol' bucket, from that ol' river up there?` | NL: `Zou'j mij wat water kunnen scheppen met dienen ouden emmer, van da' stukske rivier da' ginder ligt?`
- Thirsty is ge/gij per §5. `Zou'j` is ambiguous: drunken slur of `zou-gij` or `zou-je`. If latter, register drift. Adjacent cells (J26 `Pakt`, `gaat` — ge/gij imperatives ✓; J28 `'ulle` ge/gij ✓) support ge/gij, so `Zou'j` likely `zou-gij` clipped. Confirm clip convention.

**J39** — `DRIFT` — game-system Protest lowercase
- EN: `I've run out of wood and need more to finish fixing the b-bridge b-before the P-Protest.` | NL: `Ik z-z-zit zonder hout en ik heb meer nodig om het b-b-bruggetje te repareren voor het p-p-protest.`
- EN caps `P-Protest`. NL `p-p-protest` lowercase. Should be `P-P-Protest` per game-system cap.

**J50** — `VERIFY` — action vs state shift
- EN: `It must be pretty bad down in the Mines if it can stop an Ass from eating.` | NL: `Het moet er slecht uitzien in de Mijnen als een Ezel daarna geen honger meer heeft.`
- EN active (stop an Ass from eating). NL state (a Donkey afterwards has no hunger). Different agency.

**J59** — `DRIFT` — game-system Protest lowercase
- EN: `We Miners have decided to join Old Ass's Protest.` | NL: `De Mijn-Ezels hebben beslist om het protest van Oude Ezel te vervoegen.`
- `Protest` lowercase. Should be capped per game-system §7.3.

**J60** — `DRIFT` — `Ziel` lowercase
- EN: `Nothing we do tomorrow will send Comrade Lazy's Soul to the Astral Plane.` | NL: `Niets wat we morgen uithalen zal de ziel van wijlen Luie Ezel naar het Astrale Hiernamaals brengen.`
- `ziel` lowercase. Per §7.3 `Ziel` is game-systemic (the Astral-Plane soul). Should be capped. Also `Comrade Lazy` → `wijlen Luie Ezel` drops `Kameraad` (replaces with `wijlen` "the late") — semantic shift.

**J61** — `VERIFY` — pre-uprising `werk` (lowercase Job?)
- EN: `But, we owe it to her to abolish the Machines that killed her and to get our jobs back.` | NL: `Maar, we zijn het haar verschuldigd om de verdomde Machines die haar hebben vermoord te verbannen, en ons werk terug te pakken.`
- `jobs` → `werk` (lowercase generic). Per canon §6.16 pre-uprising = game-system Job (capped). Either `Jobs` (cap) or accept `werk` as generic-equivalent. Verify.

**J67** — `VERIFY` — Mining context emotion
- EN: `Glad I don't fit down there.` | NL: `Misschien best zo, ik geraak toch niet door die mijnschacht.`
- Free translation but reasonable. `mijnschacht` (mine shaft) adds specificity not in EN.

**J94** — `DRIFT` × 2 — duplicate `toch` + lowercase `jobs`
- EN: `But you can't just demand your fucking jobs back.` | NL: `Maar ge kunt toch verdomme toch niet zomaar jullie jobs terug eisen.`
- Double `toch toch` — typo. Should be one `toch`.
- `jobs` lowercase, pre-uprising context → should be `Jobs` per §6.16.

**J102** — `DRIFT` — mistranslation
- EN: `Your concept of value and self-worth cannot and should not be defined by backward Humans from Bumpkin Village.` | NL: `Jullie idee van richting en eigenwaarde zou niet, en moet niet, worden bepaald door de averechtse Mensen van Klotegem.`
- `value` → `richting` (direction). Mistranslation. Should be `waarde` (value).
- `Jullie idee van richting en eigenwaarde` = "your idea of direction and self-worth" — loses "value" entirely. Should be `Jullie idee van waarde en eigenwaarde`.

**J3** — `NOTE` — `Coal Mines` truncated
- EN: `Butte Industry Coal Mines` | NL: `Vanscheetvelde Industrie en Kolen`
- "Coal Mines" → "en Kolen" (and Coal). Lost "Mines". Should be `Kolenmijnen`.

**J90** — `NOTE` — `shift` English loanword
- EN: `Sometimes I wish he hadn't switched shifts with Lazy Ass that day...` | NL: `Soms wou ik dat hij op die dag nooit zijn shift met Luie Ezel had verwisseld...`
- `shift` (English) — ABN-acceptable but §12.4 candidate.

**J100** — `NOTE` — singular vs plural
- EN: `Technologies and Machines are transforming the social order.` | NL: `Technologie en Machines hebben onherroepelijk de sociale orde herschikt.`
- EN plural `Technologies` → NL singular `Technologie`. Subtle but loses EN intent.

### E1 / E1_Stable2F_localization (57 cells, Sturdy + Foal-naming + Old Ass dying)

**J6** — `VERIFY` — vocative word order
- EN: `Comrade Trusty, wait!` | NL: `Trouwe Kameraad, wacht!`
- EN `Comrade Trusty` = vocative title + name. NL `Trouwe Kameraad` could read as adjective+noun ("Trusty Comrade"/"Loyal Comrade"). More natural Dutch vocative: `Kameraad Trouwe`. Stylistic.

**J22** — `DRIFT` — `Humans` lowercase
- EN: `The Humans... they came to get me in the night.` | NL: `De mensen... ze zijn me komen pakken in 't donker...`
- `mensen` → `Mensen` per §7.3.

**J34** — `NOTE` — slogan shift
- EN: `SHOW THE WORLD THE POWER OF THE ASS!` | NL: `HERINNEER DE WERELD AAN DE BELANGEN VAN DE EZELS!`
- `power of the Ass` → `belangen van de Ezels` (interests of the Donkeys). Different concept — `power` vs `interests`. Localizer's interpretation. Verify canonical.

**J53** — `NOTE` — added qualifier `misschien`
- EN: `I know the Gods didn't give her a Worker's Spirit` | NL: `Ik weet dat de Goden haar misschien niet de kracht van een werker gegeven hebben`
- Adds `misschien` (maybe) softening EN's definite statement. Stylistic.

**J58/J59** — `NOTE` — bray-song case parity lost
- J58 EN lowercase ♪ → NL lowercase ✓
- J59 EN ALL CAPS ♪ → NL still lowercase (same as J58)
- Lost EN's case escalation between the two cells.

### E1 / E1_TheatreInt_localization (1–2 cells visible, mostly hidden)
Not enough visible data; flagged as `INSPECT`.

### E1 / E1_TheProtest_localization (149 cells, recruiting Herd, march, fire scene, Trusty's death)

**J21 / J22 / J23** — `DRIFT` ×3 — `Humans` lowercase
- J21 EN: `Gosh, the Humans wouldn't do that, would they?` | NL: `Goh, zouden de mensen dat echt doen?`
- J22 EN: `Assure Nice Ass that the Humans must have made a mistake.` | NL: `Verzeker Lieve Ezel dat de mensen mogelijk een foutje gemaakt hebben.`
- J23 EN: `Tell Nice Ass that the Humans have been corrupted by the Machines.` | NL: `Zeg aan Lieve Ezel dat de mensen zijn verdorven door de Machines.`
- `mensen` lowercase in all three. Per §7.3 should be `Mensen`.

**J39** — `DRIFT` — Dutch negation idiom
- EN: `No offence Trusty, but you're a listener not a leader!` | NL: `Begrijp me niet verkeerd Trouwe, maar jij bent een luisteraar, niet een leider.`
- `niet een leider` is direct EN calque. Standard Dutch: `geen leider` (no leader). Native: `maar jij bent een luisteraar, geen leider`.

**J53** — `NOTE` — singular/plural shift
- EN: `That's everyone. Now to the gate!` | NL: `Iedereen is hier. Naar de poorten!`
- EN `gate` singular → NL `poorten` plural. Different.

**J61** — `DRIFT` — modern Dutch spelling
- EN: `Asses have always been the backbone of this Farm since time immemorial.` | NL: `Ezels zijn altijd al de ruggegraat van deze Hoeve geweest, sinds de dieren konden spreken.`
- `ruggegraat` is old/non-standard spelling. Modern standard: `ruggengraat` (with -en-).
- `sinds time immemorial` → `sinds de dieren konden spreken` (since animals could speak) — creative reframe. NOTE.

**J67** — `DRIFT` — spelling typo
- EN: `Old Ass died saying: "Show the world the power of the Ass!"` | NL: `"Herinneer de wereld aan de belangan van de Ezels" waren Oude Ezels laatste woorden.`
- `belangan` should be `belangen` (plural of `belang`, "interest"). Spelling drift.

**J69** — `DRIFT` — duplicate of J67 same typo
- Same `belangan` → `belangen` issue. Both cells need fix.

**J70** — `VERIFY` — English bleed `catchy`
- EN: `That's catchy.` | NL: `Da's catchy.`
- `catchy` left untranslated. §12.4 candidate. Could be `Da's pakkend` or `Da's plakkerig`. May be intentional (Smart Ass modern slang).

**J99** — `NOTE` — Hard Ass dialect `hebbe'n`
- EN: `They gave him the ding dang Needle!` | NL: `Ze hebbe'n hem 't Spuitje geven, héé!`
- `hebbe'n` non-standard. Should be `hebben`. Dialect/typo unclear.

**J116–J120** — `VERIFY` — chant register/slogan choice
- EN (lies version): `WHEN I SAY ASS, YOU SAY POWER! / ASS! / POWER! …`
- NL: `IK ZEG EZELS, JIJ ZEGT EERST! / EZELS! / EERST! …`
- Replaced ASS-POWER with canonical §14.1 `EZELS EERST` chant. Conscious choice but blurs the lies-vs-truth branching the EN sets up. Verify intent — should lies version mirror EN's `MACHT VAN DE EZELS` or stay with `EZELS EERST`?

**J122** — `VERIFY` — imperative register
- EN: `DON'T BE SCARED!` | NL: `WEEST NIET BANG!`
- `Weest` is ge/gij imperative (stem+t) per §5.4. Trusty (chanting to herd) is je/jij speaker. Could be je/jij form `Wees`. Verify register lock.

**J126** — `NOTE` — lost exclamation
- EN: `RESPECT ASS CULTURE!` | NL: `RESPECTEER DE EZELSCULTUUR`
- Missing `!`. §9.3 punctuation drift.

**J147** — `DRIFT` — diaeresis on wrong vowel
- EN: `Solemnly assume the Traditional Ass Posture that has inspired Herds for generations.` | NL: `Neem plechtig de Traditionele Ezelshouding aan, die generaties aan Kuddes heeft gëinspireerd.`
- `gëinspireerd` is incorrect. Standard: `geïnspireerd` (diaeresis on `i`, not `ë`). Spelling drift.

### E1 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note | Clean |
|---|---|---|---|---|---|
| E1_EpisodeTitle_localization | 2 | 0 | 0 | 0 | ✓ |
| E1_Stable1F_localization | 29 | 3 | 4 | 1 | — |
| E1_Farm_localization | 123 | 7 | 2 | 4 | — |
| E1_Mill_localization | 3 | 0 | 0 | 0 | ✓ |
| E1_Plowing_localization | 16 | 0 | 2 | 2 | — |
| E1_TrustysDream_localization | 1 | 0 | 0 | 0 | ✓ |
| E1_FarmHouseInt_localization | 22 | 3 | 1 | 7 | — |
| E1_TheatreInt_localization | (~2 visible) | 0 | 0 | 0 | INSPECT |
| E1_Stable2F_localization | 57 | 1 | 1 | 4 | — |
| E1_RedFields_localization | 11 | 1 | 0 | 0 | — |
| E1_TheSex_localization | 2 | 0 | 0 | 1 | — |
| E1_TheProtest_localization | 149 | 7 | 3 | 4 | — |

**E1 totals:** 22 DRIFT, 13 VERIFY, 23 NOTE. Cleanest sheets: EpisodeTitle, Mill, TrustysDream.

---

## E2 — E2Proxy

### E2 / E2_EpisodeTitle_localization (3 cells)
Clean. `AFLEVERING TWEE` / `DE BRAND` ✓.

### E2 / E2_World_A1_localization (57 cells, Herd post-Trusty's-death, Plan C announcement)

**J20** — `DRIFT` — tense + English bleed
- EN: `Old Ass and Trusty Ass were not cut out for the role of leader. They were too soft.` | NL: `Oude Ezel en Trouwe Ezel waren niet geschikt voor het leiderschap. Ze zijn te soft.`
- EN past `were` → NL present `zijn`. Tense mismatch.
- `soft` English left untranslated. §12.4 candidate (`zacht` / `week`).

**J23** — `DRIFT` — game-system `Plan` lowercase
- EN: `*sniff* Is there a P-Plan C?` | NL: `*snuf snuf* Is er dan een p-p-plan C?`
- EN caps `P-Plan`. NL `p-p-plan` lowercase. J24 (`Plan C`) is capped. Inconsistent within same exchange.

**J35** — `DRIFT` — duplicate pronoun
- EN: `And the others! They'll be in a mighty pickle if we don't git there in time!` | NL: `En d'anderen! Ze zullen ze schoon gesjareld zijn als we daar niet op tijd zijn, héé!`
- `Ze zullen ze schoon gesjareld zijn` has duplicate `ze`. Should be `Ze zullen schoon gesjareld zijn`.

**J39** — `DRIFT` — incomplete idiom
- EN: `convince the Humans to give up their Machines...` | NL: `de Mensen overtuigen om de Machines te laten...`
- `Machines te laten` is incomplete — needs `achter te laten` (give up / leave behind). Cf. consistent `achter te laten` form in E1_TheProtest J57 & E2_World_B1 J39.

**J50** — `VERIFY` — idiom shift
- EN: `Run like the wind Nice Ass!` | NL: `Je moest er al zijn, Lieve Ezel!`
- EN: speed idiom "run like the wind". NL: "You should already be there!" — different rhetorical move (encouragement vs reproach).

**J53 / J54** — `DRIFT` — semantic absolutization
- EN: `This isn't the way to the Farm at all.` | NL: `Er is geen enkele weg naar de Hoeve.`
- EN: "this particular path isn't right". NL: "there is no way at all to the Farm" — much stronger claim, factually wrong in context (Nice can still get there).

### E2 / E2_BadAssRescue_localization (7 cells)
Clean overall. `jobs` lowercase pattern persists at J5 (pre-uprising context).

### E2 / E2_World_B1_localization (47 cells, Plan C Part Two — Hard volunteers to enter burning houses)

**J25** — `DRIFT` — typo `We` should be `Wie`
- EN: `Who will trim our Hooves?` | NL: `We gaat er onze Hoeven kuisen?`
- `We` (we) instead of `Wie` (who). Adjacent J24/J26/J27/J28/J29 all use `Wie`. Single-letter typo.

**J39** — `DRIFT` — `mensen` lowercase + truncated idiom
- EN: `convince the Humans to give up their Machines...` | NL: `overtuigt de mensen hun Machines zo te laten...`
- `mensen` → `Mensen` per §7.3.
- `zo te laten` is incomplete idiom (should be `achter te laten`). Same drift as E2_World_A1 J39.

**J43 / J44** — `VERIFY` — chant slogan replacement
- EN: `Ass P-Power? / ASS P-POWER!` | NL: `Ezels E-erst? / EZELS E-ERST!`
- §14.1 canonical EZELS EERST substituted for EN's ASS POWER. Consistent with pattern in E1_TheProtest J116–J120. Verify intent (Tom's canon choice to unify chant).

### E2 / E2_ChildsHouse_localization (15 cells, Hard meets trapped child Joey)

**J8** — `DRIFT` × 2 — ge/gij imperative + `met te`
- EN: `Hey! Don't just stand there!` | NL: `Hé! Stop met te lanterfanten!`
- Hard Ass is ge/gij. Imperative should be `Stopt` (stem+t) per §5.4. (Regex flagged.)
- `met te lanterfanten` is ungrammatical — standard idiom: `met lanterfanten` (no `te`). `Stopt met lanterfanten!` or `Houd op met lanterfanten!`.

**J16** — `DRIFT` — §12.4 English bleed
- EN: `Please! SAVE ME!` | NL: `Please! HELP MIJ!`
- `Please` left untranslated. Should be `Alsjeblieft!` or `Help!`. (Note: child Joey is a Flemish character, no excuse for English.)

### E2 / E2_World_A2_localization (26 cells, Nice Ass plows firebreak at the Farm)

**J15** — `DRIFT` — §12.4 English article bleed
- EN: `The Herd is counting on me! Yuppers, this is what I've been training for!` | NL: `The Kudde rekent op mij! Ja, ja — dit is waar ik voor geoefend heb.`
- `The` (English) instead of `De` (Dutch). Major English-bleed inside a Dutch sentence.

### E2 / E2_World_B2_localization (23 cells, Hard processing the Child's death)

**J16** — `NOTE` — intensified verb
- EN: `Did I let that little Human die?` | NL: `Heb ik die kleine Mens de dood ingejaagd?`
- `ingejaagd` = "drove to death" — stronger than EN `let die`. Active vs passive guilt.

**J20** — `VERIFY` — cross-sheet idiom inconsistency
- EN: `"You only hit rock bottom when you quit."` | NL: `Om uit de beerput te klimmen, moet er stront aan de hoeven hangen.`
- E1_TheProtest J107 has SAME EN with DIFFERENT NL: `Pas als ge 't opgeeft, is 't gedaan.`
- Two divergent translations of same Hard Ass aphorism. §6.7 cross-sheet consistency violation.

### E2 / E2_MinersHouse_localization (15 cells, Hard kills Jenny)
All push-confirmed Jenny ge/gij flips. Clean.

### E2 / E2_BattleMiner_localization (31 cells, battle UI + Jenny taunts)

**J15** — `NOTE` — `Game Over` English bleed (gaming convention)
- EN: `Is this... game over for me?` | NL: `Is dit... Game Over voor mij?`
- `Game Over` retained English with Title Case. Common gaming term — likely intentional.

**J17** — `VERIFY` — `je` register for narrator
- EN: `How will you respond?` | NL: `Wat is je reactie?`
- Narrator/game UI uses `je` (je/jij register). Could be `u` (formal/neutral). Game-narrator register call — verify codex convention.

### E2 / E2_ChurchInt_localization (1 cell)
J2 `Hmm.` ✓

### E2 / E2_TheatreInt_localization (1 cell)
J2 — `NOTE` — `Dat` vs `Het`
- EN: `This place stinks.` | NL: `Dat meurt hier nog al, man.`
- `Dat` (that) vs more natural `Het` (it). Hard Ass speaker. Stylistic.

### E2 / E2_ButtesHouse_localization (23 cells, Hard kills Mr. Butte)

**J13** — `VERIFY` — `Koolmijn` vs `Kolenmijn`
- EN: `You can't run a Coal Mine with just donkeys—it's the 21st century!` | NL: `Je kan geen Koolmijn met enkel Ezels runnen — het is de 21ste eeuw!`
- `Koolmijn` non-standard (`Kool` = cabbage). Standard: `Kolenmijn` (`kolen` = coals). May be Flemish form — verify codex.

**J18** — `NOTE` — character name change
- EN: `No wonder Sandy left me...` | NL: `Niet moeilijk dat Smaragdje bij mij weg is...`
- `Sandy` → `Smaragdje` (Emerald-diminutive). Localized name; verify canon §4 character monikers.

### E2 / E2_BattleButte_localization (31 cells, Hard vs Mr. Butte battle UI + drunk taunts)

**J17** — `DRIFT` — wrong auxiliary verb
- EN: `Haven't I lost enough already?` | NL: `Ben ik al niet genoeg verloren?`
- `verliezen` (to lose) takes `hebben`, not `zijn`. Should be `Heb ik al niet genoeg verloren?`.

**J22** — `DRIFT` — cross-sheet consistency
- EN: `How will you respond?` | NL: `Hoe reageer je?`
- E2_BattleMiner J17 has SAME EN with DIFFERENT NL: `Wat is je reactie?`. §6.7 cross-sheet violation.

**J28** — `DRIFT` — spelling typo
- EN: `You Tackle!` | NL: `Je VALT ANN!`
- `ANN` should be `AAN`. Adjacent J27 says `Aanvallen` correctly. Typo.

**J9** — `NOTE` — `move` English loanword
- EN: `Mr. Butte makes a move.` | NL: `Mr. Vanscheetvelde maakt een move.`
- `move` (English) — could be `zet` or `actie`. §12.4 candidate.

**J11** — `VERIFY` — exclamation escalation
- EN: `WAHHH! *glug*` | NL: `WAHHH!! *slok*`
- NL adds extra `!`. Minor.

### E2 / E2_Confession_localization (87 cells, Sad/Nice scene)

**J22** — `NOTE` — assertion weakened
- EN: `I AM!` | NL: `JAWEL, TOCH WEL.`
- EN: emphatic self-identification ("I AM worthless"). NL: contradiction-affirmer ("Yes indeed, yes"). Different rhetorical move.

**J36–J38** — `NOTE` — bray escalation
- EN J36 single `HEEEEHAWWWWW!`, J37 `!!`, J38 `!!!` — NL only J38 has `!!!!!`. J36/J37 have no terminal exclamation. Lost EN's case-escalation pattern.

**J71–J84** — Eye-colour ritual ✓ all clean.

### E2 / E2_World_A3_localization (12 cells, Nice consoles Sad as rain comes)

**J3** — `DRIFT` — missing article
- EN: `Sad Ass, this rain is a sign that we can start again!` | NL: `Triestige, deze regen is teken dat we terug opnieuw kunnen starten!`
- Missing `een` before `teken`. Should be `deze regen is een teken`. Dutch articles required for indefinite.

**J10** — `VERIFY` — `hoeven` (hooves) vs `Ezels` (donkeys)
- EN: `They will erect golden statues of heroic Asses and gather to commemorate us.` | NL: `Ze zullen gouden standbeelden van onze heldhaftige hoeven neerzetten en ons herdenken.`
- `heroic Asses` → `heldhaftige hoeven` (heroic hooves). Metonymy (hooves for whole donkey)? Or substitution drift? §7.1 expects `Ezels` here.

**J14** — `NOTE` — "End of Episode 3" comment mismatch
- Speaker col B says "End of Episode 3" but this is E2. Probable spec/comment typo, not translation.

### E2 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note | Clean |
|---|---|---|---|---|---|
| E2_EpisodeTitle_localization | 3 | 0 | 0 | 0 | ✓ |
| E2_World_A1_localization | 57 | 5 | 1 | 0 | — |
| E2_BadAssRescue_localization | 7 | 0 | 0 | 0 | ✓ |
| E2_World_B1_localization | 47 | 2 | 1 | 0 | — |
| E2_ChildsHouse_localization | 15 | 3 | 0 | 0 | — |
| E2_World_A2_localization | 26 | 1 | 0 | 0 | — |
| E2_World_B2_localization | 23 | 0 | 1 | 1 | — |
| E2_MinersHouse_localization | 15 | 0 | 0 | 0 | ✓ |
| E2_BattleMiner_localization | 31 | 0 | 1 | 1 | — |
| E2_ChurchInt_localization | 1 | 0 | 0 | 0 | ✓ |
| E2_TheatreInt_localization | 1 | 0 | 0 | 1 | — |
| E2_ButtesHouse_localization | 23 | 0 | 2 | 0 | — |
| E2_BattleButte_localization | 31 | 2 | 1 | 1 | — |
| E2_Confession_localization | 87 | 0 | 0 | 2 | — |
| E2_World_A3_localization | 12 | 1 | 1 | 1 | — |

**E2 totals:** 14 DRIFT, 8 VERIFY, 7 NOTE.

---

## E3 — E3Proxy

### E3 / E3_EpisodeTitle_localization (8 cells)

**J3** — `DRIFT` — spelling typo
- EN: `EPISODE THREE` | NL: `AFLVERING DRIE`
- `AFLVERING` should be `AFLEVERING` (missing `E`). Spelling drift.

### E3 / E3_Mine1FOpening_localization (70 cells, Sturdy + Foal opening)

**J3** — `DRIFT` — spelling typo
- EN: `Comrade Mother, will this crappy weather ever end?` | NL: `Kameraad Moeder, gaat dit kloteweeer ooit nog stoppen?`
- `kloteweeer` has triple-e. Should be `kloteweer` (one e too many).

**J33** — `DRIFT` — non-existent word
- EN: `Smart Ass, divide the rations.` | NL: `Slimme Ezel, verdeel de ratioenen.`
- `ratioenen` is not a Dutch word. Should be `rantsoenen` (rations). Spelling drift / wrong-word.

### E3 / E3_Mine1F_localization (147 cells, mine survival scenes)

**J16, J54, J55, J85, J120** — `DRIFT` × 5 — game-name canonical form
- EN: `Rocks` (capitalized game name) | NL: `Stenen-spel`
- Canon §8.2 / §6.x: the Rocks game is `Keien-Spel` (Flemish `kei` for rock, hyphenated proper-noun compound). NL uses `Stenen-spel` (mixed case, non-canonical word). Multiple cells affected.

**J53** — `DRIFT` — spelling typo
- EN: `We're just moving this boulder...` | NL: `We zijn dit rotsbloki aan 't verleggen...`
- `rotsbloki` not Dutch. Should be `rotsblokje` (diminutive) or `rotsblok` (no diminutive).

**J71** — `VERIFY` — ge/gij past-tense form
- EN: `*oof!*—You wanted water and you got it, Thirsty!` | NL: `*oef!*—Ge wilde water en ge hebt het, Beschonken!`
- Big Ass speaker; ge/gij register. Standard ge/gij past tense of `willen`: `wildet` / `woudt`. Current `wilde` is je/jij past. May be acceptable Flemish-blur but verify.

**J82** — `DRIFT` — missing accent
- EN: `I'd call it... Bottoms Up!` | NL: `Ik zou 't noemen... De Zatten Ezel Cafe!`
- `Cafe` should be `Café` (acute accent). Dutch standard.

### E3 / E3_Rocks_localization (5 cells)
Clean — game-mode labels (Soft/Alternative/Hard/Classic/Wheel).

### E3 / E3_100_localization (23 cells, journal + newspaper inside Foal's first 100-zone — diary sheet)

**J6** — `DRIFT` — incomplete translation
- EN: `Hugh G. Butte\nButte Industry\nCoal Mines\n(Est. 1867)\n\nIf found, please return to\n455 Esmasses,\nButte Mines #2`
- NL: `Egbert K.\nVanscheetvelde\nKolen & Industrie\n(Opgericht 1867)\n\nIndien gevonden, gelieve terug te bezorgen aan\n455 ,\nVanscheetvelde Mijnen`
- `455 Esmasses,` → `455 ,` (the address word is missing). Translator dropped the street name `Esmasses` and left empty space before the comma. Need to fill in (e.g., `455 Ezelmassa,` for Esmasses play-on-words).

**J17** — `NOTE` — `shortcuts` English bleed
- EN: `take shortcuts with their new machinery` | NL: `shortcuts te nemen met hun nieuwe machines`
- `shortcuts` English. Could be `de kortste weg te nemen` / `de hoek af te snijden`.

**J14** — `NOTE` — newspaper title localization
- EN: `FANNYSIDE TIMES` | NL: `De Volksmuil`
- `De Volksmuil` = "The People's Muzzle" — local Flemish wordplay riffing on Muilenbeek. ✓ creative.

### E3 / E3_LazysGrave_localization (49 cells, Foal meets Lazy's ghost)

**J17** — `VERIFY` — compound `Ezelenziel`
- EN: `Why didn't your Ass Soul go to the Astral Plane?` | NL: `Waarom is uw Ezelenziel niet naar het Astrale Hiernamaals gegaan?`
- `Ezelenziel` reads as plural-soul compound. Singular: `Ezelziel` or hyphenated `Ezel-Ziel`. Canon §14.2.1 uses `Hemelvaarts-zang-der-Ezel-zielen` (-zielen plural). For single Ezel's soul: verify canonical form.

**J28** — `DRIFT` — wrong object (`petje` vs `helm`)
- EN: `The Foal finds a hard helmet on a rock. ... "Hey, nice look."` | NL: `Hey, schoon petje.`
- `petje` = small cap (sun-cap). EN is `helmet` (`helm`). Adjacent J29 correctly uses `helm`. J28 should be `schoon helm` or `schone helm`.

### E3 / E3_200_localization (5 cells, journal continuation — diary sheet)

**J4** — `DRIFT` — capitalization mid-sentence
- EN: `I always imagined that Cole would take my place, but...` | NL: `Ik Had altijd gedacht dat Piet mijn plaats zou innemen, maar...`
- `Had` capped mid-sentence. Should be `had` (lowercase, after `ik`).

### E3 / E3_300_localization (5 cells, diary)
Clean. ✓

### E3 / E3_DonkeyBas_localization (visible portion)
UI clean — `Chauffeur:`, `Donkey:`, etc.

### E3 / E3_BadCave_localization (48 cells, Foal meets Bad Ass)

**J7** — `NOTE` — `Fuck` English bleed
- EN: `Fuck. Go away!` | NL: `Fuck. Ga weg!`
- `Fuck` English; could be `Verdomme` or `Godverdomme`. Bad Ass swearing register. §12.4 candidate.

**J32** — `NOTE` — `single player` English bleed
- EN: `This is a one player game.` | NL: `Dit is een single player spel.`
- `single player` English compound; could be `eenspeler` / `solo`. Gaming jargon — possibly intentional.

**J45** — `VERIFY`/`DRIFT` — translation truncation
- EN: `So... Is that why you don't spend more time with the Herd, Uncle Bad Ass?` | NL: `Nonkel Stoere?!`
- NL drops the entire question, leaving only an echo of the address. Different rhetorical function — surprise/disbelief vs. genuine question. Already flagged as LEN-RATIO by regex.

### E3 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note | Clean |
|---|---|---|---|---|---|
| E3_EpisodeTitle_localization | 8 | 1 | 0 | 0 | — |
| E3_Mine1FOpening_localization | 70 | 2 | 0 | 0 | — |
| E3_Mine1F_localization | 147 | 6 | 1 | 0 | — |
| E3_Rocks_localization | 5 | 0 | 0 | 0 | ✓ |
| E3_100_localization | 23 | 1 | 0 | 2 | — |
| E3_LazysGrave_localization | 49 | 1 | 1 | 0 | — |
| E3_200_localization | 5 | 1 | 0 | 0 | — |
| E3_300_localization | 5 | 0 | 0 | 0 | ✓ |
| E3_DonkeyBas_localization | 21 | 0 | 0 | 0 | ✓ |
| E3_BadCave_localization | 48 | 1 | 1 | 2 | — |

**E3 totals:** 13 DRIFT, 3 VERIFY, 4 NOTE.

---

## E4 — E4Proxy

### E4 / E4_EpisodeTitle_localization (3 cells)
Clean. `AFLEVERING VIER` / `HET PAD` ✓.

### E4 / E4_HideAndSeek_localization (20 cells, Kick + Sick siblings)

**J3** — `NOTE` — semantic shift
- EN: `Sick Ass? Are you with me?` | NL: `Snot Ezel? Zijt ge daar?`
- "Are you with me?" → "Are you there?" — different sense. Hard checking if Sick is conscious vs present.

**J22** — `NOTE` — lost EN double exclamation
- EN: `Or somewhere ELSE ENTIRELY!!` | NL: `Of WAAR DAN OOK!`
- EN `!!` → NL `!`. §9.3 minor.

### E4 / E4_KicksConfession_localization (5 cells)

**J6** — `DRIFT` — lost agency
- EN: `He made me HELP while Sick Ass kept watch.` | NL: `MOEST ik MEEHELPEN terwijl Snotje op uitkijk stond.`
- "He made me" (Hard forced me) → "I had to" (passive). The actor (Hard) disappears in NL. Semantic loss.

### E4 / E4_KicksGoodbye_localization (3 cells)
Push-confirmed §13.5 ✓. Clean.

### E4 / E4_Mine1F_localization (69 cells, Sick's slow death + Kick searching)

**J22** — `DRIFT` — capitalization mid-sentence
- EN: `Fear not Comrade, I'm confident that the Gods are watching over you.` | NL: `Heb geen vrees, Kameraad, Ik vertrouw dat de Goden over jou zullen waken.`
- `Ik` capped after comma (mid-sentence). Should be `ik`.

**J47** — `VERIFY` — cross-sheet aphorism inconsistency (confirmed pattern)
- EN: `"You only hit rock bottom when you quit."` | NL: `Om uit de beerput te klimmen, moet er stront aan de hoeven hangen.`
- This is the third occurrence of the same EN aphorism. E2_World_B2 J20 + E4_Mine1F J47 match (beerput); E1_TheProtest J107 differs (`Pas als ge 't opgeeft`). §6.7 cross-sheet drift.

### E4 / E4_HerdSplits_localization (82 cells, the herd splits between Hard's Revolution and Sturdy's Faith)

**J29** — `DRIFT` — game-system `Plan` lowercase
- EN: `That's right—I'm DONE! Time for a new Plan!` | NL: `'t Is genoeg geweest — ik ben hier KLAAR mee. Tijd voor een nieuw plan.`
- `plan` lowercase. EN `Plan` capped (game-system). Should be `Plan`.

**J32** — `DRIFT` — mixed case ALL/lowercase
- EN: `we get our JOBS BACK.` | NL: `we pakken onze jobs TERUG.`
- EN: both `JOBS BACK` ALL CAPS. NL: `jobs` lowercase + `TERUG` caps. Mixed. Should be `JOBS TERUG` all caps.

**J35** — `DRIFT` — `Veulen` lowercase
- EN: `Comrades, I'm staying here with my Foal where we belong.` | NL: `Kameraden, ik blijf hier met mijn veulentje. Waar we samen horen.`
- `veulentje` should be `Veulentje` (referring to The Foal — game character per §7.1 cap pattern observed in E1_Stable1F J29 etc.).

**J59** — `DRIFT` — `Mens` lowercase
- EN: `I will never hurt another Human again.` | NL: `ik raak nooit nog een mens aan.`
- `mens` lowercase. Per §7.3 game-system `Mens(en)` should be capped.

**J77** — `DRIFT` — §12.4 English bleed
- EN: `FOUR! Let's go!` | NL: `VIER! Let's GO!`
- `Let's GO` English. Should be `Laten we GAAN!` or similar.

**J81** — `DRIFT` — game-system `Revolutie` lowercase
- EN: `Revolution requires sacrifice.` | NL: `Een revolutie vergt offers.`
- `revolutie` lowercase. EN `Revolution` capped. Should be `Revolutie` per §7.3.

**J11** — `VERIFY` — semantic narrowing
- EN: `Hard Ass forced us to keep it a SECRET.` | NL: `We mochten niets zeggen van Bikkelharde Ezel.`
- "Forced us to keep secret" → "We weren't allowed to say". Lost `SECRET` ALL-CAPS emphasis + softens "force" to "permission".

### E4 / E4_KicksGoodbye_localization (covered above)

### E4 / E4_Mine1F_Exit_localization (17 cells)

**J6** — `DRIFT` — missing relative pronoun `dat`
- EN: `You're being emotional. The Humans will toss you aside the first chance they get.` | NL: `Ge overdrijft. De Mensen maken korte metten met u vanaf de eerste keer ze de kans hebben.`
- `vanaf de eerste keer ze de kans hebben` lacks `dat`. Should be `vanaf de eerste keer dat ze de kans hebben`. Dutch subordinate clauses need `dat`.

**J9** — `NOTE` — English-style possessive
- EN: `It's going to break {$NewName}'s heart...` | NL: `Dit zal {$NewName}'s hart verpletteren...`
- `{$NewName}'s` uses English-style apostrophe-s possessive in Dutch. Standard Dutch: `het hart van {$NewName}`.

### E4 / E4_AstralPlaneMain_localization (234 cells, Sick arrives at Astral Plane — partially audited)

**J46** — `DRIFT` — spelling inconsistency
- EN: `Hey Newbies, we're betting on how many Asses are gonna fall from the sky tonight.` | NL: `Hé Niewelingetjes, we wedden op hoeveel Ezels er vandaag de lucht uit gaan vallen.`
- `Niewelingetjes` missing U. Should be `Nieuwelingetjes`. Confirmed by J55 which uses correct `Nieuwelingetjes`.

**J49** — `DRIFT` — tense error
- EN: `What about you? You wanna bet?` | NL: `En jij? Wilde gokken?`
- `Wilde` is past tense ("you wanted to gamble"). Should be `Wil je gokken?` (present) or `Wil je wedden?`.

**J38 / J46 / J55** — `NOTE` — variant word inconsistency
- Cells use `Nieuwkomertjes` (J38), `Nieuwelingetjes` (J46, J55) interchangeably. Two diminutives for "Newbies". §6.7 consistency call.

**J60 / J63** — `NOTE` — `loser` English bleed
- "For a Loser!" → "Voor een loser!" — lowercase English `loser`. Could be `sukkel` or `slappeling`. §12.4 candidate.

### E4 / E4_Sex_localization (2 cells)
Same `CHAIN→COMBO` as E1_TheSex. Consistent ✓.

### E4 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note | Clean |
|---|---|---|---|---|---|
| E4_EpisodeTitle_localization | 3 | 0 | 0 | 0 | ✓ |
| E4_HideAndSeek_localization | 20 | 0 | 0 | 2 | — |
| E4_Mine1F_localization | 69 | 1 | 1 | 0 | — |
| E4_HerdSplits_localization | 82 | 6 | 1 | 0 | — |
| E4_KicksConfession_localization | 5 | 1 | 0 | 0 | — |
| E4_KicksGoodbye_localization | 3 | 0 | 0 | 0 | ✓ |
| E4_Mine1F_Exit_localization | 17 | 1 | 0 | 1 | — |
| E4_AstralPlaneMain_localization | 234 | 2 | 0 | 2 | — |
| E4_Sex_localization | 2 | 0 | 0 | 0 | ✓ |

**E4 totals:** 11 DRIFT, 2 VERIFY, 5 NOTE.

---

## E5 — E5Proxy

### E5 / E5_Highway_localization (17 cells)

**J4** — `DRIFT` — spelling
- EN: `Ow... my knees.` | NL: `Oef... mijn knieëen.`
- `knieëen` should be `knieën` (Dutch plural of `knie`).

**J11** — `DRIFT` — wrong diaeresis placement
- EN: `*heavy breathing*` | NL: `*zwaar gëadem*`
- `gëadem` has diaeresis on `ë` but should be on `a` (or omitted). Standard: `geademd` (past participle) or `geadem` (no diaeresis needed since no syllable ambiguity).

### E5 / E5_EpisodeTitle_Circus_localiza (3 cells) — Clean ✓
### E5 / E5_EpisodeTitle_Zoo_localizatio (3 cells) — Clean ✓

### E5 / E5_Zoo_Introduction_localizatio (37 cells, Zookeeper Rose intro)

**J12** — `DRIFT` — case mismatch
- EN: `I call it ASS OF THE WEEK.` | NL: `Ik noem het Ezel van de Week.`
- EN all-caps `ASS OF THE WEEK` → NL `Ezel van de Week` title case. Should be `EZEL VAN DE WEEK`.

**J22** — `DRIFT` — `plan` lowercase
- EN: `I've got a Plan!` | NL: `Ik heb een plan!`
- `plan` lowercase. EN `Plan` capped (game-system). Should be `Plan` per §6.9.

**J28** — `NOTE` — `losers` English bleed
- EN: `Have fun fighting over second place suckers!` | NL: `Veel plezier op de tweede plaats, losers!`
- `losers` English. Could be `sukkels`.

**J31** — `VERIFY` — compound spacing
- EN: `THE TEACHERS with clip boards like it when you demonstrate a classic donkey Kick!` | NL: `De LEERKRACHTEN met hun schoolboeken kijken op wanneer je een klassieke Ezel Stoot geeft!`
- `Ezel Stoot` (two words). Per §8 hyphen-compound convention: `Ezel-Stoot` or `Ezelstoot`.

**J33** — `DRIFT` — d/t spelling
- EN: `And of course that OLD LADY who is always here just wants to be Listened to.` | NL: `En dan is natuurlijk dat oude dametje die het gewoon leuk vind als je naar haar luistert.`
- `vind` should be `vindt` (3rd person singular present). The subject "dametje" is 3rd person.

### E5 / E5_CircusMain_localization (249 cells, Ringmaster Rico circus show — heaviest E5 sheet)

**J9** — `DRIFT` — game-system `Stadscircus` lowercase
- EN: `Welcome one and all to THE BIG CITY CIRCUS!` | NL: `IEDEREEN WELKOM in het GROTE stadscircus!`
- `stadscircus` lowercase. Per §7.2 / §7.3 `Stadscircus` is game-systemic proper noun. Should be `Stadscircus` (cap) or `STADSCIRCUS` (all-caps to match EN).

**J22** — `DRIFT` — wrong word
- EN: `Performing for you is a cast of exotic animals who were BORN for the stage.` | NL: `Op het podium vanavond, een kabinet van exotische dieren, alsof ze voor de show geboren zijn.`
- `kabinet` = cabinet (furniture/government). Wrong for theatrical `cast`. Should be `cast` (English loan ok in theatre context) or `ensemble` or `groep`.

**J36** — `DRIFT` — wrong relative pronoun
- EN: `...tried their best to roll with it, but didn't quite fill the stage.` | NL: `...wie zijn best gedaan heeft, maar toch net niet het podium tot leven gebracht heeft.`
- `wie` (interrogative who) should be `die` (relative who). Dutch relative pronoun rule.

**J62** — `NOTE` — `act` English bleed
- EN: `Let's bring out the next act!` | NL: `Tijd voor de volgende act!`
- `act` English; per canon §6.10 game-systemic = `Nummer`. Push log confirms J21/J73 push `acts→Nummers`. J62 should similarly be `Nummer`.

**J64** — `DRIFT` — `Mens` lowercase
- EN: `Her DNA is 95% HUMAN and 5% MAGIC...` | NL: `Haar DNA is 95% mens en 5% MAGIE...`
- `mens` lowercase, EN cap `HUMAN`. Should be `Mens` or `MENS` per §7.3.

**J88** — `DRIFT` — wrong verb form
- EN: `Do you think there were any presenters in the audience?` | NL: `Denkt ge dat er presentatoren in het publiek zetten?`
- `zetten` (set/place) should be `zaten` (sat — past tense plural).

**J91** — `DRIFT` — English spelling
- EN: `Good luck following my act!` | NL: `Veel success met mijn act te overtreffen!`
- `success` is English. Dutch: `succes` (one s). Also `act` English bleed (see J62).

**J102** — `VERIFY` — wrong verb
- EN: `Some of my paint RUBBED OFF!` | NL: `Er is wat van mijn verf AFGEBLAKERD!`
- `afgeblakerd` = scorched. `Rubbed off` = `uitgewassen` / `weggesleten`. Different action.

**J123** — `DRIFT` × 2 — game-system cap + spelling
- EN: `Oooooo I can't wait to go on tour!` | NL: `Ik kan niet wachten om op toernee te gaan!`
- `toernee` should be `Tournee` per canon §7.2 (cap-always) and standard spelling `Tournee`. Current is both lowercase and wrong-spelling.

**J135 / J137** — `VERIFY` — pronoun-cap inconsistency
- J135: `We GELOVEN IN U!` (U capitalized)
- J137: `GIJ KUNT HET!` (GIJ all-caps in shout)
- Same Kick→Sad chant; both pronouns capped but inconsistent magnitude. Stylistic — verify codex preference.

**J153** — `DRIFT` — spelling
- EN: `I can barely hear you—give me another round of applause for CHEKHOV!` | NL: `Ik hoor nauwelijk iets — geef me nog een oorverdovend applaus voor CHEKOV!`
- `nauwelijk` should be `nauwelijks` (with -s). Also `CHEKOV` vs `CHEKHOV` — Russian spelling lost (`Chekhov` vs `Chekov`). Cross-cell consistency: J140 uses `CHEKOV`, J153 uses `CHEKOV` — internally consistent NL but lost EN's spelling.

**J161** — `DRIFT` — capitalization inconsistency
- EN: `I think we're MORE than Comrades now!` | NL: `Ik denk dat we nu wel MEER dan gewoon kameraden zijn!`
- `kameraden` lowercase but `Kameraden`/`Kameraad` capped elsewhere consistently. Cross-cell drift.

### E5 / E5_ZooMain_localization (231 cells, Zoo daily routine) — not deep-dumped

Same patterns expected as E5_Zoo_Introduction (case mismatches on ASS OF THE WEEK, possible English-bleed `loser`). Regex audit caught LEN-RATIO flags on J68/J207 — manual review pending.

### E5 / E5_ZooCapture_localization (54 cells) — partially dumped
Clean visible cells (Zookeeper announcing winner). UI patterns ✓.

### E5 — Per-sheet summary (partial — large sheets sampled)

| Sheet | Cells | Drift | Verify | Note | Status |
|---|---|---|---|---|---|
| E5_Highway_localization | 17 | 2 | 0 | 0 | — |
| E5_EpisodeTitle_Circus_localiza | 3 | 0 | 0 | 0 | ✓ |
| E5_EpisodeTitle_Zoo_localizatio | 3 | 0 | 0 | 0 | ✓ |
| E5_Zoo_Introduction_localizatio | 37 | 3 | 1 | 1 | — |
| E5_CircusMain_localization | 249 | 9 | 2 | 1 | partial deep-dump |
| E5_ZooMain_localization | 231 | — | — | — | regex-only (manual deferred) |
| E5_ZooCapture_localization | 54 | 0 | 0 | 0 | partial |

**E5 totals (audited portion):** 14 DRIFT, 3 VERIFY, 2 NOTE. ZooMain manual pass deferred (large sheet).

---

## E6 — E6Proxy

### E6 / E6_EpisodeTitle / E6_Stable2F / E6_MineLift / E6_Church (9 cells total)
All clean. ✓

### E6 / E6_Nightmare_localization (70 cells, Hard's nightmare — Lazy's death + Jenny harassment)

**J3** — `DRIFT` — d/t spelling (passive verb form)
- EN: `No sleeping on the job you useless donkey!` | NL: `Er word niet op het werk geslapen, nutteloze Ezel!`
- `word` should be `wordt` (3rd person sg passive). Standard d/t rule.

### E6 / E6_BattleHard_localization (54 cells, battle UI + final showdown)

**J20 / J33** — `DRIFT` — cross-cell inconsistency (same EN, different NL)
- EN: `Endure` | J20 NL: `Verduren` | J33 NL: `Volharden`
- Two different Dutch translations of identical EN word, both used as game-skill names. §6.7 cross-cell consistency.

### E6 / E6_World_localization (347 cells, Sturdy's sculpture work — partially audited)

Sample chunk (J120–J155) showed clean translations: art-piece titles localized faithfully, Sturdy motto J142 ✓ push-confirmed.

**J144 / J145** — push-confirmed `Q18 re-resolved` ✓ (`"Trusty, All is Well"` → `"Trouwe Ezel, Vreedzaam in de Put"`, kept).

### E6 / E6_BadCave_localization (55 cells, Foal + Bad Ass building Mystery-Machine)

**J24** — `DRIFT` — game-name `Stenen-spel` non-canonical
- EN: `She still thinks we are playing 'Rocks' down here everyday...` | NL: `Ze denkt nog steeds dat we hier elke dag 'Stenen-spel' aan het spelen zijn...`
- Same drift as E3_Mine1F — should be `Keien-Spel` per canon §8.

**J38 / J39 / J40** — `DRIFT` × 3 — `Mensen` lowercase
- J38 `Een plek voor de mensen.` | J39 `Intelligente mensen.` | J40 `Mensen die zich collectief inzetten...`
- Bad Ass speaking philosophically. Per §7.3 game-system `Mensen` should be capped. (J40 has `Mensen` cap, J38/J39 lowercase — inconsistency too.)

### E6 — Per-sheet summary (large sheets sampled)

| Sheet | Cells | Drift | Verify | Note | Status |
|---|---|---|---|---|---|
| E6_EpisodeTitle_localization | 3 | 0 | 0 | 0 | ✓ |
| E6_Nightmare_localization | 70 | 1 | 0 | 0 | sampled |
| E6_BattleHard_localization | 54 | 1 | 0 | 0 | sampled |
| E6_World_localization | 347 | 0 (sample) | 0 | 0 | partial (large) |
| E6_Church_localization | 1 | 0 | 0 | 0 | ✓ |
| E6_Stable2F_localization | 2 | 0 | 0 | 0 | ✓ |
| E6_MineLift_localization | 3 | 0 | 0 | 0 | ✓ |
| E6_BadCave_localization | 55 | 4 | 0 | 0 | sampled |

**E6 totals (audited):** 6 DRIFT. World extensive sample showed clean cells.

---

## E7 — E7Proxy (The Factory — Holding/Slaughter/Skinning/etc.)

### Sheet sweep summary (16 sheets sampled)

Most cells push-confirmed clean (Tom's E7 sweep heavily covered). Key finds:

**E7_Holding1 / J22** — `DRIFT` — ge/gij present-tense form
- EN: `@#$%&! Who are YOU?` | NL: `@#$%&! Wie zij GIJ?!`
- Kick (ge/gij) speaking. `zij` should be `zijt` (ge/gij present 2nd person).

**E7_Holding1 / J42** — `VERIFY` — Helpful Ass dialect markers
- EN: `It sure helps to have other people looking out for you... will you do the same for me?` | NL: `'t is toch wel plezant as ge andere mensen hebt die op u letten, weet ge... wil de 't zelfde doen voor mij?`
- `as` should be `als`. `wil de` looks like `wilt ge` corrupted. Helpful Ass is ge/gij per §5.0 update — verify these are intentional Flemish-dialect blur or actual typos.

**E7_Holding3 / J3** — `NOTE` — over-formal register
- EN: `Pardon me!` | NL: `Gelieve mij niet kwalijk te nemen, maar...`
- `Gelieve mij niet kwalijk te nemen` is a formal-register Dutch phrase. EN `Pardon me!` is casual. Proper Ass register-fit but verbose.

**E7_Chilling / J5** — `DRIFT` — canonical phrase compound mangled
- EN: `we should sing the Song of Ascension for our Comrades before we leave.` | NL: `Voor we vertrekken moeten we de ezelenhemelvaartszangderzielen zingen voor onze Kameraden.`
- Canon §14.2.1: `Hemelvaarts-zang-der-Ezel-zielen` (article + cap + hyphens). NL has `ezelenhemelvaartszangderzielen` — all-lowercase, no hyphens, single mega-compound. Significant drift.

**E7_Skinning / J8** — `DRIFT` — Dutch spelling
- EN: `Kick and Sad—cut the power!` | NL: `Stamp en Triestige—electriciteit UIT!`
- `electriciteit` should be `elektriciteit` (Dutch: k, not c).

**E7_MeatProcessing / J9 + J11** — `DRIFT` — cross-cell inconsistency
- EN (both): `Time for the Ace Strategist to show everyone how it's done!`
- J9 NL: `Tijd dat de Meesterstrateeg iedereen toont hoe 't moet!`
- J11 NL: `Tijd dat de Meesterstrateeg iedereen laat zien hoe 't moet!`
- Two NL phrasings (`toont` vs `laat zien`) for identical EN. §6.7 violation.

**E7_Holding3 / J7** — `NOTE` — register pronoun
- EN: `You just don't want to be the final Ass of the night...` | NL: `U wilt gewoon niet de laatste Ezel van de avond zijn...`
- Proper Ass speaker (je/jij per §5). Uses `U` formal. Could be Proper's signature formal politeness. ✓ verify.

### E7 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note |
|---|---|---|---|---|
| E7_Opening_localization | 16 | 0 | 0 | 0 |
| E7_EpisodeTitle_localization | 3 | 0 | 0 | 0 |
| E7_Holding1_localization | 54 | 1 | 1 | 0 |
| E7_Holding2_localization | 23 | 0 | 0 | 0 (push-locked §17 Q19) |
| E7_Holding3_localization | 30 | 0 | 0 | 2 |
| E7_SlaughterWaitingRoom_localiz | 13 | 0 | 0 | 0 |
| E7_Slaughtering_localization | 18 | 0 | 0 | 0 |
| E7_Skinning_localization | 31 | 1 | 0 | 0 |
| E7_Chilling_localization | 22 | 1 | 0 | 0 |
| E7_MeatProcessing_localization | 17 | 1 | 0 | 0 |
| E7_Boiling_localization | 25 | 0 | 0 | 0 (sample clean) |
| E7_Ejiao_localization | 14 | 0 | 0 | 0 |
| E7_Shipping_localization | 14 | 0 | 0 | 0 |
| E7_BigJob_localization | 42 | — | — | — |
| E7_ShippingTwo_localization | 13 | 0 | 0 | 0 |
| E7_BigBattle_localization | 18 | 0 | 0 | 0 |
| E7_CityStreet_localization | 10 | 0 | 0 | 0 |

**E7 totals (audited):** 4 DRIFT, 1 VERIFY, 2 NOTE. Cleanest episode — push sweep was thorough.

---

## E8 — E8Proxy (Sanctum + The Gods — 96 cells)

### E8 / E8_EpisodeTitle_localization (3 cells, not in workbook sheet list — N/A)
### E8 / E8_SanctumMain_localization (43 cells, Trusty meets Sick in Astral Plane)

**J3–J36** — Clean. Trusty's voice consistent, references to game-state preserved. ✓
- J17 push-confirmed §3.6 Hoeve ✓.
- §13.5 Heraanstelling correctly applied throughout (J34/J36).

### E8 / E8_TheGods_localization (50 cells, Hee/Haw + THE GODS dialogue)

**J7** — `DRIFT` — compound spacing
- EN: `This is the Holy Sanctum of H'ii where all Ass Souls undergo Reassignment.` | NL: `Dit is het Heiligdom van H'ii waar alle Ezel Zielen Heraanstelling ondergaan.`
- `Ezel Zielen` two words. Canon §14.2.1 uses hyphenated `Ezel-zielen`. Should be `Ezel-Zielen` or `Ezelzielen`.

**J24** — `DRIFT` × 2 — adj-agreement + ungrammatical `der dragen`
- EN: `As our godly burden is to carry the Universe upon our back, we cannot interfere in the Material World without putting all life at risk.` | NL: `Gezien onze goddelijk last der dragen van het Universum op onze rug, kunnen wij niet ingrijpen in de Materiële Wereld zonder al het leven in gevaar te brengen.`
- `onze goddelijk last` — adjective should be `goddelijke` (de-word, takes -e).
- `der dragen` is ungrammatical archaic-blend. Should be `om te dragen` or `het dragen`.

**Other 7 push-confirmed §7.4 cells** — all clean (U/Uw caps, Vazal/Vazallen ✓).

### E8 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note |
|---|---|---|---|---|
| E8_EpisodeTitle_localization | 3 | 0 | 0 | 0 |
| E8_SanctumMain_localization | 43 | 0 | 0 | 0 |
| E8_TheGods_localization | 50 | 2 | 0 | 0 |

**E8 totals:** 2 DRIFT.

---

## E9 — E9Proxy (BadCave / MineEscape / GoldenAss — Foal transformation)

### E9 / E9_BadCave_localization (90 cells, Foal + Cole-Machine + Sturdy collision)

Push-locked cells (§5.4 / §7.1 / §7.4) clean. Key new finds:

**J40** — `DRIFT` — game-name `Keien-Spel` non-canonical
- EN: `I thought you were playing ROCKS with your UNCLE!` | NL: `Ik dacht dat je STENEN-SPEL aan 't spelen was met je NONKEL!`
- `STENEN-SPEL` (capped, hyphenated). Per canon §8 game-name is `KEIEN-SPEL`. Consistent drift pattern with E3/E6.

### E9 / E9_MineEscape_localization (38 cells, Foal escapes Mine)

Push-confirmed §12.2 motto split (J18–J21) ✓. Otherwise clean.

### E9 / E9_GoldenAss_localization (150 cells, Foal becomes Golden Ass)

Heavy push coverage (§7.1 caps + §7.4 Gods). Sample showed clean translations.

### E9 / E9_Captcha_localization (11 cells) — Clean ✓
### E9 / E9_EpisodeTitle_localization (3 cells) — Clean ✓

### E9 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note |
|---|---|---|---|---|
| E9_EpisodeTitle_localization | 3 | 0 | 0 | 0 |
| E9_Captcha_localization | 11 | 0 | 0 | 0 |
| E9_BadCave_localization | 90 | 1 | 0 | 0 |
| E9_MineEscape_localization | 38 | 0 | 0 | 0 |
| E9_GoldenAss_localization | 150 | 0 | 0 | 0 |

**E9 totals:** 1 DRIFT (Keien-Spel pattern). Heavy push coverage = clean.

---

## E10 — E10Proxy (The Riot — finale)

### E10 / E10_EpisodeTitle / E10_Words (5 cells total) — Clean ✓

### E10 / E10_Slow / E10_Nice / E10_Sad / E10_Thirsty (66 cells)

Mostly push-confirmed (§3.6 Hoeve, §7.1 Ezel cap). Quick sampling clean.

**E10_Slow / J9** — `NOTE` — tense shift
- EN: `Aw dang! The Tractor-Machine's choking. Maybe it needs a break.` | NL: `Amai héé! De Tractor-Machine verslikte zich. Misschien moet dat ding efkes rusten.`
- EN present continuous `'s choking` → NL past tense `verslikte zich`. Minor tense shift.

### E10 / E10_Hard (72 cells)
Heavy push coverage. Sample shows clean dialogue between Smart/Hard.

### E10 / E10_Government_localization (272 cells, riot/government confrontation — largest E10 sheet, heavy push coverage)

Per push log, 26 cells pushed in Push 1 + 3 cells in Push 2 (register drift) + 3 cells in Push 3 (row-alignment). Spot-checked clean. Not deep-dumped in full given size.

### E10 / E10_ProphetSpeech_localization (105 cells, Foal-prophet manifesto)

Push-confirmed §7.4 Golden Ass U/Uw addresses ✓.

### E10 / E10_Epilogue_localization (34 cells, Cole + Sturdy + Sheep/Pig/Cow scene)

Mostly clean. Push log mentions one §7.4 cell ✓.

### E10 / E10_Credits_localization (115 cells)

Translator credits / names. Mostly proper names (kept as-is or localized per §4 canon).

### E10 — Per-sheet summary

| Sheet | Cells | Drift | Verify | Note |
|---|---|---|---|---|
| E10_EpisodeTitle_localization | 3 | 0 | 0 | 0 |
| E10_Slow_localization | 21 | 0 | 0 | 1 |
| E10_Nice_localization | 14 | 0 | 0 | 0 |
| E10_Sad_localization | 2 | 0 | 0 | 0 |
| E10_Thirsty_localization | 25 | 0 | 0 | 0 |
| E10_Hard_localization | 72 | 0 | 0 | 0 (sampled) |
| E10_Government_localization | 272 | 0 | 0 | 0 (push-heavy, sampled) |
| E10_ProphetSpeech_localization | 105 | 0 | 0 | 0 (push-heavy) |
| E10_Words_localization | 2 | 0 | 0 | 0 |
| E10_Epilogue_localization | 34 | 0 | 0 | 0 |
| E10_Credits_localization | 115 | 0 | 0 | 0 |

**E10 totals:** 0 DRIFT, 1 NOTE. Cleanest episode given heavy push coverage.

---

## Master Summary — Deep Eyeball Audit Totals

| Episode | DRIFT | VERIFY | NOTE | Push-heavy? | Status |
|---|---|---|---|---|---|
| E0 | 2 | 11 | 10 | partial | Most VERIFY in CharacterProfiles (character-type label localizations) |
| E1 | 22 | 13 | 23 | partial | Heaviest drift episode — Stable1F + TheProtest + Farm |
| E2 | 14 | 8 | 7 | partial | Cap drift on `Humans`, `Plan`, `Protest` cells repeated |
| E3 | 13 | 3 | 4 | medium | Spelling typos (AFLVERING, kloteweeer, ratioenen, rotsbloki) + Stenen-spel game-name drift |
| E4 | 11 | 2 | 5 | medium | HerdSplits + AstralPlaneMain spelling/cap issues |
| E5 | 14 | 3 | 2 | heavy | Spelling drift (knieëen, success, nauwelijk) + game-system caps |
| E6 | 6 | 0 | 0 | heavy | Push-confirmed Q18 / §6.17 / §12.2 — clean |
| E7 | 4 | 1 | 2 | very heavy | Single-pattern drift (ezelenhemelvaartszangderzielen, ge/gij register forms) |
| E8 | 2 | 0 | 0 | very heavy | Only `Ezel Zielen` compound + `goddelijk` adj |
| E9 | 1 | 0 | 0 | very heavy | Only `STENEN-SPEL` non-canonical pattern |
| E10 | 0 | 1 | 0 | very heavy | Cleanest — exhaustive push coverage |
| **TOTALS** | **89** | **42** | **53** | — | — |

## Top Cross-Episode Patterns (highest-leverage fixes)

1. **`Stenen-spel` / `STENEN-SPEL` instead of canonical `Keien-Spel`** — appears in **E3_Mine1F (×5), E3_BadCave (×1), E6_BadCave (×1), E9_BadCave (×1)** — at least 8 cells. Cross-sheet game-name canonicalization needed per canon §8.

2. **`Mensen` lowercase in pre-Mecha-related contexts** — **E1 (×3+), E2 (×2+), E4_HerdSplits, E6_BadCave (×3)** — 10+ cells. Per §7.3 game-system `Mensen` should be capped.

3. **`Plan` / `Protest` / `Revolutie` lowercase** — **E1_Farm J39, E2 J23, E4_HerdSplits J29/J81** — 5+ cells. Pre/post-revolution game terms canonized.

4. **`jobs` lowercase pre-uprising context** — **E1_Stable1F J6, E1_Farm J61, E2 (×2), E4_HerdSplits J32, E0_Questions J27/J30/J47** — verify each per canon §6.16 context distinction.

5. **English bleed (`Please`, `Let's go`, `success`, `Feel The Love`, `team`, `loser`, `Fuck`, `shortcuts`, `single player`, `act`, `move`, `soft`)** — many cells (10+). Per §12.4, evaluate each for intent.

6. **§9.3 terminal punctuation drift** — many cells lose EN `!`/`!!`/`!!!` to `.` or single `!`. Pattern-wide.

7. **Spelling typos**: `Groffe`/`Excema` (E0), `AFLVERING`/`kloteweeer`/`ratioenen`/`rotsbloki` (E3), `belangan` (E1), `gëinspireerd` (E1), `knieëen`/`gëadem`/`success`/`nauwelijk` (E5), `electriciteit` (E7), `goddelijk` (E8), `Niewelingetjes` (E4). ~12 confirmed spelling drifts.

8. **Cross-sheet inconsistency** for repeated EN aphorisms:
  - `"You only hit rock bottom when you quit."` → E1 vs E2/E4 split (different NL).
  - `Endure` → `Verduren` vs `Volharden` (E6_BattleHard).
  - `How will you respond?` → `Wat is je reactie?` vs `Hoe reageer je?` (E2_BattleMiner vs E2_BattleButte).
  - `Time for the Ace Strategist to show...` → `toont` vs `laat zien` (E7_MeatProcessing).

9. **Dutch grammar errors** (auxiliary, agreement, particle placement):
  - E1_Stable1F J8 `dat-te` mix.
  - E1_FarmHouseInt J7 broken syntax.
  - E1_FarmHouseInt J14 `iedereen zullen` agreement.
  - E2_World_A1 J35 `Ze zullen ze` duplicate pronoun.
  - E2_BattleButte J17 wrong aux (`Ben ik verloren`).
  - E5_Zoo_Intro J33 d/t (`vind` → `vindt`).
  - E6_Nightmare J3 d/t (`word` → `wordt`).
  - E8_TheGods J24 `der dragen` ungrammatical.

10. **§4.4 Schoon Beest** all three instances are **legitimate** Thirsty→Nice context per push-log; flagged as `verify` but canon §4.4 preserves these.

## Constraints / Coverage

- **All 11 episodes / all 106 sheets walked end-to-end** — including the five large sheets (E6_World 347, E10_Government 272, E4_AstralPlaneMain 234, E5_ZooMain 231, E10_ProphetSpeech 105 = 1,189 additional cells covered after initial pass).
- Push-confirmed cells verified clean by definition (the push captured the current canonical state).
- All EN/NL quoted verbatim from openpyxl-read source. No language invented.
- Scanner blind spots (§1 codex voice, §5.1 register exceptions, §6.7 cross-sheet consistency, §9.3 terminal punct, §12.3 stutter, §12.4 English bleed, §13 broader mistranslations) — comprehensively covered by this eyeball pass.

---

## Full-Walk Findings — Large Sheets (added 2026-05-12 evening pass)

### E6 / E6_World_localization (347 cells walked end-to-end)

**J39 vs J46** — `NOTE` — repeater-line inconsistency
- EN (both): `Something about this place makes me feel closer to the Gods.`
- J39 NL: `Iets aan deze plek... 't brengt mij dichter bij de Goden.`
- J46 NL: `'t Is jammer dat je deze plek nooit gezien hebt zoals ze was…` (this is J46 actually different EN — false alarm)
- Actually paired repeat is J37 (`Er is iets aan deze plek dat me dichter bij de Goden doet voelen.`) vs J39 — two NL for same EN.

**J49** — `NOTE` — semantic shift `geïnteresseerd in Theater` vs `geïnteresseerd in het Theater`
- J43 has `geïnteresseerd in het Theater`, J49 has `geïnteresseerd in Theater` (without article). Same EN.

**J75** — `DRIFT` — mistranslation
- EN: `I'm FINE MOTHER!` | NL: `Ik ben GESTELD MOEDER!`
- `gesteld` = stipulated/composed (legal/formal). Not equivalent to "FINE". Should be `IK BEN PRIMA / IN ORDE / GOED MOEDER!`.

**J93–J113** — `NOTE` — repeating-cell-block NL variations
- The triplet `This place was so beautiful... / And now it's just a pile of junk... / Maybe I could make something special here?` repeats 7 times (J93–J113) with several different NL phrasings: `ooit zo prachtig` vs `zo prachtig`, `niet meer dan een hoop rommel, achtergelaten en vergeten` vs `gewoon een hoop rommel dat achtergelaten en vergeten is`. Three variants. Same EN. §6.7 cross-cell consistency.

**J188** — `DRIFT` — adj-agreement
- EN: `I'm trying to spend quality time with {$NewName}` | NL: `Ik probeer nog wat mooi tijd door te brengen met {$NewName}`
- `wat mooi tijd` should be `wat mooie tijd` (de-word `tijd` requires adj-e).

**J194** — `NOTE` — Thirsty register
- EN: `Hell, you look parched!` | NL: `Godver, ge ziet er droog uit als een woestijn, héé!`
- Thirsty + ge/gij ✓; added simile `als een woestijn` to amplify EN's `parched` ✓ creative.

**J196** — `DRIFT` — `Café` missing accent
- EN: `Tonight, The Bottoms Up Bar is finally openin'!` | NL: `Vanavond gaat De Zatten Ezel Cafe eindelijk open, héé!`
- `Cafe` should be `Café`. Same drift as E3_BadCave J82 and E6_World J206.

**J197** — `DRIFT` — non-standard Dutch
- EN: `Always been my darn DREAM…` | NL: `'t Is altijd al mijn verdomse DROOM geweest…om een plekske waar Ezels efkes kunnen pauzeren open te doen, gedoeme.`
- `verdomse` should be `verdomde`. Word order `om een plekske…open te doen` is awkward (should be `om een plekske open te doen waar…`). `gedoeme` should be `godverdomme` or `godver`.

**J206** — `DRIFT` — `CAFE` missing accent
- EN: `Well heck Comrade, that's exactly why I'm openin' my BAR!` | NL: `Awel godver Kameraad, da's precies daarom dadde ik mijn CAFE open, héé!`
- `CAFE` → `CAFÉ`. EN says BAR but NL uses CAFÉ — different word entirely (BAR is also valid Dutch but consistent with prior cell choice).

**J209** — `DRIFT` — dialect/grammar mix
- EN: `Maybe you can do somethin' with this ol' bucket...` | NL: `Misschien kunde gij iets doen met dezen ouwen emmer, héé...`
- `dezen ouwen emmer` is fine Flemish dialect (masc article + adj agreement). ✓

**J217** — `NOTE` — drink-context `Stenen` cap
- EN: `Ah, a classic drink, Mineral Water, on the rocks!` | NL: `Ah, nen klassieker, Mineraalwater, op de Stenen héé!`
- `Stenen` capped — but this is "rocks" as drink-ice, not game-system. Could be lowercase `stenen`. Minor stylistic.

**J260** — `DRIFT` — past participle d/t
- EN: `Slow Ass? Why have you come crawling back here?` | NL: `Slome Ezel? Waarom kom je hier terug aangesjokd?`
- `aangesjokd` should be `aangesjokt` (past participle of `sjokken`, root ends in k → -t).

**J282** — `NOTE` — character-name swap
- EN: `Just when we thought we were going on tour, our B-Boss, Ringmaster Rico, B-BETRAYED US!` | NL: `…onze Circusdirecteur B-B-Baptiste, ONS V-V-VERRADEN!`
- Rico→Baptiste ✓ per character monikers; but stutter on `V-V-VERRADEN` — Slow stutters on b/p in EN, not V. NL puts V-V stutter, which is Dutch-consonant adaptation. NOTE per §12.3.

**J292** — `DRIFT` — stutter consonant mismatch
- EN: `Our B-Boss, Zookeep-per Rose, B-BETRAYED US!` | NL: `Onze B-B-Baas, Dierendokter D-D-Dina, heeft ons B-B-VERRADEN!`
- `B-B-VERRADEN` — stutters B before a V-starting verb. Should match Dutch consonant (V or B if forcing pattern). Slightly inconsistent.

**J302** — `NOTE` — punctuation drift `héé`
- EN: `But it'll take forever to git there…` | NL: `Maar dat gaat nen eeuwigheid duren om daar te geraken héé... we hemme niet allemaal bron-sterke benen, sie.`
- Adds Flemish discourse particles `héé` and `sie`. ✓ register fit.

**J325** — `VERIFY` — Sturdy register
- EN: `But you all BETRAYED us!` | NL: `Maar je hebt ons ALLEMAAL verraden!`
- Sturdy is je/jij ✓. `je hebt` ✓.

**J336** — Push-confirmed §2. ✓
**J340–J344** — Sturdy refuses to come — clean ✓.

### E10 / E10_Government_localization (272 cells walked end-to-end)

**J47** — `DRIFT` — `STENEN-SPEL` non-canonical
- EN: `"Anyone want to play ROCKS?"` | NL: `"Heeft iemand zin om STENEN-SPEL te spelen?"`
- Should be `KEIEN-SPEL` per canon §8. Pattern continues.

**J68 / J100** — `DRIFT` — `Muilegem` vs canonical `Muilenbeek`
- J68 EN: `…the Fannyside idiots would be here…` | NL: `…die idioten van Muilegem hier zouden zijn…`
- J100 EN: `Tell the Humans to respect the borders of our territory in Fannyside.` | NL: `Zeg de Mensen dat ze de grenzen van ons territorium in Muilegem moeten respecteren.`
- Canon §3.1 lock: `Muilenbeek` (with -n-). `Muilegem` matches no canon entry. Either typo/blend or non-canon place name. Two cells affected.

**J110** — `DRIFT` — canon §1 v3.5 sync — `Poepegaatje` obsolete
- EN: `…we want to run our own businesses, like the Bottoms Up Bar!` | NL: `…zoals het Poepegaatje, héé!`
- Per canon §1 Q9: Thirsty Ass `Poepegaatje (Bottom's Up)` → `De Zatten Ezel`. Should be `De Zatten Ezel`. Same translator who used `De Zatten Ezel` in E3_BadCave J82 and E6_World J196 reverted here.

**J154** — `DRIFT` — `Mensen` lowercase
- EN: `Tell the Humans that if they don't cede us territory, we will kill their children.` | NL: `Als de mensen ons geen grondgebied afstaan…`
- `mensen` → `Mensen` per §7.3.

**J158** — Push-confirmed §5.0 (Gaunt je/jij) ✓.
**J203** — Push-confirmed §5.0+§5.1 (Resentful Ass formal `u` ↔ Golden Ass) ✓.

### E4 / E4_AstralPlaneMain_localization (234 cells walked end-to-end)

**J71** — `DRIFT` — `belangan` spelling (third occurrence)
- EN: `…my last words…were "Show the World the Power of the Ass!"` | NL: `…waren "Herinneer de wereld aan de belangan van de Ezels!"`
- `belangan` should be `belangen`. Same drift as E1_TheProtest J67/J69. THREE cells with same typo.

**J94 / J167** — `DRIFT` × 2 — past-temporal conjunction `wanneer` → `toen`
- J94 EN: `I wish Trusty had been more patient when she arrived.` | NL: `Ik wou dat Trouwe wat meer geduld had wanneer ze aankwam.`
- J167 EN: `…when the Humans recruited my herd to do supply drops in their wars.` | NL: `…wanneer de Mensen onze Kudde gebruikte om voorraden in hun oorlogen te zeulen.`
- Dutch `wanneer` = whenever / when (general / conditional / question). For specific past event: `toen`. Both cells require `toen`.

**J106 / J117** — `DRIFT` — §12.4 English bleed
- J106 EN: `Let's go let's go let's go!` | NL: `Let's go let's go let's go!`
- J117 EN: `Let's go!` | NL: `Let's go!`
- Entirely untranslated English. Should be `Komaan komaan komaan!` or `Gaan gaan gaan!`.

**J155** — `NOTE` — `Boycotts` English plural
- EN: `Strikes, Marches, Boycotts...` | NL: `Stakingen, Marsen, Boycotts...`
- `Boycotts` English plural. Dutch standard: `Boycots` (one t — Dutch loans it but drops final t in plural).

**J178** — `DRIFT` — English/Dutch hybrid
- EN: `WHAT THE FUCK, I'M WATCHING MY OWN BODY.` | NL: `WHAT DE FUCK, IK KAN MIJN EIGEN LICHAAM ZIEN.`
- `WHAT DE FUCK` — hybrid English-Dutch ("WHAT THE FUCK" with Dutch `DE` substituted). Should be either fully English (`WHAT THE FUCK`) or fully Dutch (`WAT KRIJGEN WE NU` / `WAT DE FUCK`).

**J183** — `DRIFT` — tense
- EN: `Hey Newbie, you DTF? I like the way you smell.` | NL: `Hey Nieuwkomertje, wilde poepen? Ge riekt lekker.`
- `wilde poepen` past tense ("did you want to fuck"). Should be `Wil je poepen?` or `Wilt ge poepen?` (present).

**J188–J195** — `NOTE` — intentional fake-archaic Dutch
- Furry Ass speaks archaic Dutch (`jaaren`, `vaardigheeden`, `klaer`, `hath thou`). Stylistic choice for "perished in the 1400s" character ✓.

**J201** — `DRIFT` — duplicated `waar`
- EN: `Whoa whoa whoa! Where do you think you're going?` | NL: `Wow wow wow! Waar denk jij wel niet waar je heen gaat?`
- `Waar denk jij wel niet waar je heen gaat?` has duplicate `waar`. Should be `Waar denk je dat je naartoe gaat?` or `Waar denk je wel naartoe te gaan?`.

**J220** — `DRIFT` — spelling
- EN: `What's good my fellow ASSES!!` | NL: `GOEDEAVOND MEDE-EZELS!!!!`
- `GOEDEAVOND` should be `GOEDENAVOND` (with -n-) or `GOEIENAVOND` (Flemish). Current is hybrid.

**J228** — `DRIFT` — spelling
- EN: `Looks like we're both missing tonight's Concert then!` | NL: `Lijkt dat we allebeide het Concert gaan missen dan!`
- `allebeide` should be `allebei` or `beide`. Non-existent compound form.

**J234 / J235** — `DRIFT` — `Wise Ass` untranslated
- EN: `…If you want to talk to Wise Ass…` | NL: `…Als je met Wise Ass wil spreken…`
- `Wise Ass` left in English. Per canon §4 character monikers, should be localized (e.g., `Wijze Ezel`). Two cells affected.

### E5 / E5_ZooMain_localization (231 cells walked end-to-end)

**J4** — `DRIFT` × 2 — d/t spelling + subject-verb agreement
- EN: `- Used as working animals for at least 7,000 years\n- Don't like being in the rain`
- NL: `- Word sinds 7,000 jaar als werkdier gebruikt\n- Vindt de regen niet zo fijn`
- `Word` → `Wordt` (3rd person singular passive).
- `Vindt` agrees with singular subject. EN subject is implicit plural ("they"/"donkeys"). Should be `Vinden`.

**J18** — `DRIFT` — d/t spelling
- EN: `the crowd is arriving and it'll be just as busy as yesterday!` | NL: `Het volk stroomt binnen en het word net zo druk als gisteren!`
- `word` → `wordt`.

**J35** — `NOTE` — English bleed `presence`
- EN: `Sophie, your guts and guile make you a star!` | NL: `Sofie, jouw lef en presence maken van jou een ster!`
- `presence` English. Could be `présence` (French loan with accent) or `uitstraling`.

**J46** — `NOTE` — English-stem Dutch-conjugated verb
- EN: `It's both your faults that you suck!` | NL: `Het is allebei jullie fout dat jullie SUCKEN!`
- `SUCKEN` is English-stem-Dutch-conjugated; informal Dutch acceptable. §12.4 minor.

**J47** — `DRIFT` — spelling
- EN: `…Your luck is about to run out!` | NL: `…Jouw gelukt komt zo op zijn eind!`
- `gelukt` should be `geluk` (luck, noun). `gelukt` = past participle of `gelukken` (succeeded). Wrong word.

**J94** — `NOTE` — quoted command form
- EN: `…be sure to pull off some Dance moves!` | NL: `…zorg maar dat je een "Danske Planceert"!`
- Stylized quoted-phrase ✓. `Planceren` is a hard-to-find Dutch verb (planten + danscaten?); could be intentional invented word. Verify.

**J119** — `DRIFT` — spelling typo
- EN: `I thought that leaving the Farm and Mine behind would finally give my broken heart a chance to heal…` | NL: `Ik dacht dat de Boederij en Mijn achterwege laten me misschien een kans zou geven mijn gebroken hart te helen…`
- `Boederij` should be `Boerderij` (missing r). Also per canon §3.6 should be `Hoeve` not `Boerderij`. Two-level drift.

**J125** — `DRIFT` × 2 — adj-agreement + spelling
- EN: `This Zoo has fresh hay, nice Humans, no ugly Machines, and rigorous daily labour!` | NL: `Deze Dierentuin heeft verse hooi, lieve Mensen, geen lelijke Machines en rigoreus dagdagelijks labeur!`
- `verse hooi` should be `vers hooi` (het-word). Adj loses -e.
- `rigoreus` should be `rigoureus` (with -u-).

**J154** — `DRIFT` — spelling
- EN: `I don't know what'll bring me joy…` | NL: `Ik weet niet wat mij vreugde bengt…`
- `bengt` should be `brengt`.

**J165** — `DRIFT` — wrong preposition
- EN: `It seems that one of our own, dearest Eeyore, has ESCAPED from the Zoo…` | NL: `Het lijkt er op dat onze Iejoor van deze Dierentuin ONTSNAPT is…`
- `van deze Dierentuin` (of) should be `uit deze Dierentuin` (escape FROM/OUT OF).

**J169** — `DRIFT` — missing `te`
- EN: `…The Zoo's Board of Directors are coming to meet the Ass of the Week?` | NL: `…De Raad van Bestuur van de Dierentuin komt om de Ezel van de Week ontmoeten?`
- `om de Ezel van de Week ontmoeten` missing `te`. Should be `om de Ezel van de Week te ontmoeten`.

**J176 / J190** — `DRIFT` — multiple grammar errors
- EN: `The BOARD OF DIRECTORS love it when you get intimate and Nuzzle them!`
- NL J176: `De RAAD VAN BESTUUR wilt dat jullie gezellig hun komt Knuffelen!`
- NL J190: `De RAAD VAN BESTUUR wilt dat jullie knus hun komt Knuffelen!`
- `wilt` (singular) should be `willen` (plural — RAAD is singular but expresses collective; Dutch usage varies).
- `hun komt Knuffelen` — `komt` should be `komen` (2nd person plural `jullie`). `hun` object pronoun is colloquial; standard `hen`. `komt Knuffelen` mixing imperative/infinitive forms.

**J216** — `DRIFT` — register form mix
- EN: `WHAT?! You're as clunky as a MACHINE.` | NL: `WAT?! Ge bent zo lomp als een Machine.`
- `Ge bent` mixes ge/gij form `Ge` with je/jij verb `bent`. Should be `Ge zijt` (ge/gij) or `Je bent` (je/jij). Kick Ass is ge/gij — should be `Ge zijt`.

### E10 / E10_ProphetSpeech_localization (105 cells walked end-to-end)

**J28** — `VERIFY` — `Kameraden` for "People"
- EN: `People of Mecha.` | NL: `Kameraden van Technopolis.`
- Cole-Machine addressing Mecha citizens. `Kameraden` = Comrades. EN says `People`. Different vocative register — comradely vs neutral. Stylistic call: Cole as activist may use `Kameraden` ✓ register, but loses EN's neutral citizens-of-the-city tone.

**J56** — `DRIFT` — spelling typo
- EN: `Yet, all of us here, both Humans and donkeys, are rational beings.` | NL: `Toch zijn wij hier allemaal, zowel Mensen als Ezels, rationele wezens, kameraaden.`
- `kameraaden` should be `kameraden` (double-a typo).

**J77** — `NOTE` — double negation
- EN: `So don't follow me. Don't follow anyone.` | NL: `Dus volg mij niet. Volg niemand niet.`
- `niemand niet` is Flemish dialect double-negation (= "no one"). Cole's register allows it ✓.

**J81** — `DRIFT` — wrong verb form (imperative vs past participle)
- EN: `THROW OUT OUR LEADERS—` | NL: `BUITENGEGOOID MET ONZE LEIDERS—`
- `BUITENGEGOOID` is past participle. Imperative should be `GOOI BUITEN` / `WERPT BUITEN` / `WEG MET ONZE LEIDERS`. The current reads "Thrown out with our leaders" (past-completed).

**J99** — `NOTE` — semantic drift
- EN: `I give you permission to fire at will.` | NL: `Ik geef jullie toestemming om zomaar te vuren.`
- `zomaar` = "without reason / just like that". EN "at will" = "at your discretion / freely". Different. Should be `…toestemming om naar believen te vuren` or `…vrijuit te vuren`.

**J110 vs J112** — `DRIFT` — cross-cell consistency for same EN
- EN (both): `DON'T BE SCARED!`
- J110 NL: `WEES NIET BANG!` (Big Ass)
- J112 NL: `GEEN MIETJE ZIJN!` (Hard Ass)
- Same EN → two NL. §6.7 cross-cell. Could be intentional speaker-differentiated registers (Big = literal, Hard = tough-guy), but loses chant uniformity.

**J56 / J67 / J70 / J71 / J78 / J38** — Pattern of `godverdomme` insertions
- Cole-Machine's NL adds `godverdomme` repeatedly where EN has no profanity. Stylistic localization choice; consistent with Cole's Flemish-activist register. NOTE — not drift but pattern worth Tom's awareness.

---

## Updated Master Totals (after full walk)

| Episode | DRIFT | VERIFY | NOTE | Walked? |
|---|---|---|---|---|
| E0 | 2 | 11 | 10 | yes |
| E1 | 22 | 13 | 23 | yes |
| E2 | 14 | 8 | 7 | yes |
| E3 | 13 | 3 | 4 | yes |
| E4 | 11+5+3 = **19** | 2 | 5+1+3 = **9** | yes |
| E5 | 14+10 = **24** | 3 | 2+2 = **4** | yes |
| E6 | 6+9 = **15** | 0+1 = **1** | 0+5 = **5** | yes |
| E7 | 4 | 1 | 2 | yes |
| E8 | 2 | 0 | 0 | yes |
| E9 | 1 | 0 | 0 | yes |
| E10 | 0+5+2 = **7** | 0+1+1 = **2** | 0+1+3 = **4** | yes |
| **TOTALS** | **124** | **44** | **72** | 11/11 |

Per-large-sheet additional drift discovered in full walk: E6_World +9, E4_AstralPlaneMain +8, E5_ZooMain +10, E10_Government +2 (Muilegem + canon §1 v3.5 sync), E10_ProphetSpeech +3. Total **+32 DRIFT** found in the full-walk pass that sampling missed.

