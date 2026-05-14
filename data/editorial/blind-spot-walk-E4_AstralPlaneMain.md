# Blind-Spot Walk — E4_AstralPlaneMain_localization

Date: 2026-05-12
Sheet: `4_asses.masses_E4Proxy.xlsx :: E4_AstralPlaneMain_localization`
Cells walked: 234 (J2–J236, full end-to-end)
Reference: §1–§19 of `data/editorial/_CANON.md`, codex_verified v3.4
Exclusions: deep-eyeball audit findings (J46, J49, J38, J60, J63, J71, J94, J106, J117, J155, J167, J178, J183, J188-J195, J201, J220, J228, J234, J235); push-confirmed J62, J127.

---

## Findings (sorted: BUGS → §5.1 register → §1 codex voice → rest)

### J138 — §13 / §13 — content drop + duplicated verb
- Speaker: Chafed Ass
- EN: `Nihao. I hate Humans because I worked for them my whole life only to be killed with a sledgehammer, skinned, and turned into some 'delicacy'.`
- NL: `Nihao. Ik haat Mensen omdat ik mijn hele leven voor heb heb gewerkt, voordat ze me afmaakten en van mij een delicatesse hebben bereid.`
- Drift: (a) Duplicated verb `heb heb`; (b) `with a sledgehammer` entirely dropped; (c) `skinned` entirely dropped (only `afmaakten` left, which conflates kill+skin); (d) EN single quotes around `'delicacy'` lost in NL.
- Proposed: `Nihao. Ik haat Mensen omdat ik mijn hele leven voor ze heb gewerkt, alleen maar om met een voorhamer afgemaakt en gevild te worden — en in een ‘delicatesse’ te eindigen.`

### J125 — §13 — missing direct object
- Speaker: Bitter Ass
- EN: `I hate Humans because they beat me with a steel pipe!`
- NL: `Ik haat Mensen omdat ze met een stalen pijp bijeen sloegen!`
- Drift: NL drops the direct object `mij` — sentence reads "they beat with a steel pipe" (ungrammatical, no object). Also `bijeen sloegen` (two words) should be `bijeensloegen` or `in elkaar sloegen`.
- Proposed: `Ik haat Mensen omdat ze mij met een stalen pijp in elkaar geslagen hebben!`

### J181 — §13 — typo
- Speaker: Peek Ass
- EN: `Some of us can just sit back and watch.`
- NL: `Sommigen van ons kunnen gewoon rusting chillen en toekijken.`
- Drift: `rusting` is not a Dutch word — typo of `rustig` (calmly). `rusting chillen` reads as gibberish.
- Proposed: `Sommigen van ons kunnen gewoon rustig achterover leunen en toekijken.`

### J204 — §13 — dropped preposition + wrong conjunction
- Speaker: Tight Ass
- EN: `Except, of course, for DJ Dope Ass's Astral Trap Concert.`
- NL: `Buiten, natuurlijk, DJ Lijpe Ezel's Astrale Trap Concert.`
- Drift: `Buiten` = `outside` (place), not `except`. Standard NL for "except for" is `Behalve voor`. Sentence currently reads as a sentence-fragment without verb or preposition. Also `Buiten` parses as the spatial "outside the tunnel", which is a different meaning than EN.
- Proposed: `Behalve, natuurlijk, voor het Astrale Trap Concert van DJ Lijpe Ezel.`

### J207 — §5.1 register — DJ Dope Ass ge/gij where canon §1 locks je/jij
- Speaker: DJ Dope Ass
- EN: `Any chance you've got some of that Purple Stuff...?`
- NL: `Hebde gij misschien wat van dat Paarse Spul...?`
- Drift: `Hebde gij` is ge/gij register. Canon §1 entry #8 + §6.13 Q4 resolution lock DJ Dope Ass as **je/jij** (corpus J222/J223 use `je`/`jullie`). Cross-cell register inconsistency within same speaker.
- Proposed: `Heb je misschien wat van dat Paarse Spul...?`

### J208 — §5.1 register — DJ Dope Ass ge where canon locks je
- Speaker: DJ Dope Ass
- EN: `You know what I'm what I'm talking about, right?`
- NL: `Ge weet toch over wat ik het heb, hé?`
- Drift: `Ge weet` = ge/gij. Canon locks DJ Dope Ass je/jij. Same drift as J207.
- Proposed: `Je weet toch waar ik het over heb, hé?` (also fixes `over wat` → `waar … over`)

### J210 — §5.1 register — DJ Dope Ass ge where canon locks je
- Speaker: DJ Dope Ass
- EN: `Ya you do! The best damn drug we got in the Astral Plane...`
- NL: `Ge weet over wat ik het heb, jong! Het beste spul dat we in het Astrale Hiernamaals kunnen vinden!`
- Drift: `Ge weet` = ge/gij. Canon je/jij. Also: NL terminal `!` mismatches EN trailing `...` (§9.3 punctuation). And NL adds explanatory `Ge weet over wat ik het heb` not in EN (`Ya you do!` is a 3-word affirmative).
- Proposed: `Tuurlijk weet je dat! Het beste spul dat we in het Astrale Hiernamaals hebben...` (fixes register, paraphrase, and ellipsis)

### J214 — §5.1 register — DJ Dope Ass ge/gij verb form
- Speaker: DJ Dope Ass
- EN: `Help me out and bring me some, will you?`
- NL: `Doet mij een plezier en fix mij wat, oké?`
- Drift: `Doet` is the ge/gij imperative form (je/jij is `Doe`). Canon locks DJ Dope Ass je/jij. Cross-cell inconsistency with J222 `je`, J223 `jullie`.
- Proposed: `Doe me een plezier en fix me wat, oké?`

### J215 — §5.1 register — DJ Dope Ass `gij` where canon locks je
- Speaker: DJ Dope Ass
- EN: `Where's that Purple Stuff? I thought you were gonna get me that Purple Stuff?`
- NL: `Waar is dat Paarse Spul? Ik dacht dat gij mij wat van dat Paarse Spul ging fixen?`
- Drift: `gij` is ge/gij. Canon je/jij. Same drift as J207/J208/J210/J214.
- Proposed: `Waar is dat Paarse Spul? Ik dacht dat jij mij wat van dat Paarse Spul ging fixen?`

### J51 — §13 — idiom replacement, semantic shift
- Speaker: Greedy Ass
- EN: `I knew she was the gambling type!`
- NL: `Ik wist dat ze een gat in haar hand had!`
- Drift: `een gat in zijn/haar hand hebben` = "to be a spendthrift / spend money easily" — a money-spending idiom, **not** about gambling. EN here is about willingness to bet, not money-spending habit. Greedy Ass is admiring Sick Ass for accepting the wager.
- Proposed: `Ik wist dat ze graag gokt!` or `Ik wist dat zij een gokker was!`

### J159 — §13 — semantic shift × 2
- Speaker: Janky Ass
- EN: `I led a few impromptu insurrections in the 1300s. We nearly toppled the government.`
- NL: `Ik heb een paar spontane opwellingen meegemaakt in de jaren 1300. We hadden bijna de regering van de troon gestoten.`
- Drift: (a) `opwellingen` = "impulses / urges / whims", **not** "insurrections / uprisings". EN `insurrections` = `opstanden`. (b) `meegemaakt` = "experienced", not `led`. EN `I led` = `Ik leidde`. The speaker should be claiming agency, not passively witnessing.
- Proposed: `Ik heb een paar spontane opstanden geleid in de jaren 1300. We hadden bijna de regering van de troon gestoten.`

### J160 — §13 — semantic shift
- Speaker: Janky Ass
- EN: `It didn't take much to get those Peasants to Revolt.`
- NL: `Er was niet veel nodig om die Boeren te laten betogen.`
- Drift: `betogen` = "demonstrate / protest peacefully". EN `Revolt` = `opstaan / in opstand komen` (armed/violent uprising). Janky is the violent-radical donkey; "demonstrate" tones him down considerably.
- Proposed: `Er was niet veel nodig om die Boeren in opstand te laten komen.`

### J164 — §12.4 — `Boycott` English plural (parallel to J155)
- Speaker: Total Ass
- EN: `My herd did a Boycott against long travels on the Silk Road.`
- NL: `Mijn Kudde heeft een Boycott tegen de lange reizen op de Zijderoute gepleegd.`
- Drift: `Boycott` is the English form. Dutch standard is `Boycot` (one t). Deep-eyeball already flagged J155 plural `Boycotts → Boycots`; J164 singular is the parallel case (`Boycott → Boycot`). §6.7 cross-cell.
- Proposed: `Mijn Kudde heeft een Boycot gepleegd tegen de lange reizen op de Zijderoute.`

### J163 — §13 — misplaced diaeresis
- Speaker: Ugly Ass
- EN: `Others here have said my Hunger Strike inspired generations.`
- NL: `Anderen zeiden dat mijn Hongerstaking generatie op generatie heeft gëinspireerd.`
- Drift: `gëinspireerd` has diaeresis on `ë` — should be `geïnspireerd` (diaeresis on `ï` per standard Dutch). Also EN present perfect "have said" → NL simple past `zeiden`.
- Proposed: `Anderen hier zeggen dat mijn Hongerstaking generaties geïnspireerd heeft.`

### J84 — §12.4 — English `Steppes` (NL standard is `Steppen`)
- Speaker: Old Ass
- EN: `Surrounding these lands are the Steppes of Hawawaw—the stomping grounds for the many Asses who love to race.`
- NL: `En rondom dit gebied liggen de Steppes van Haahaahon — dé plek voor de snelle racers onder de Ezels.`
- Drift: `Steppes` is the English plural; Dutch standard is `Steppen` (plural of `Steppe`). Sibling Old Ass place-names J82/J83/J86 all use Dutch forms (`Vlaktes`, `Heuvels`, `Vijver`), so `Steppes` is the odd one.
- Proposed: `En rondom dit gebied liggen de Steppen van Haahaahon — dé plek voor de snelle racers onder de Ezels.`

### J169 — §9.3 — terminal punctuation mismatch
- Speaker: Lofty Ass
- EN: `They didn't take kindly to our pacifism...`
- NL: `Onze liefde voor vrede werd ons niet in dank afgenomen.`
- Drift: EN ends in ellipsis `...` (trailing-off feel). NL ends in period `.` (flat statement). §9.3 EN end-punct = NL end-punct.
- Proposed: `Onze liefde voor vrede werd ons niet in dank afgenomen...`

### J156 — §13 — Flemish dialect `wouden` in formal-narrator speaker
- Speaker: Ugly Ass (Nostalgic Radicals)
- EN: `Some wanted better living conditions.`
- NL: `Sommige wouden betere levensomstandigheden.`
- Drift: `wouden` is Flemish dialect plural past of `willen` (Standard Dutch: `wilden`). Also `Sommige` ungrammatical without -n: should be `Sommigen`. The Nostalgic Radicals speak relatively formal nostalgic-historical register, not heavy Flemish. Compare neighbouring J157 "Dat waren de dagen, vrienden." (Standard).
- Proposed: `Sommigen wilden betere levensomstandigheden.`

### J179 — §13 — semantic shift, idiom lost
- Speaker: Shaky Ass
- EN: `NOW I CAN FEEL IT IN MY BONES!`
- NL: `NU KAN IK MIJN BEENDEREN VOELEN!`
- Drift: `MIJN BEENDEREN VOELEN` = "I can feel my [own] bones" (literal anatomy — like sensing your skeleton). EN `feel it in my bones` = idiom for "I sense it deeply / I have a gut feeling". Lost the figurative meaning.
- Proposed: `NU VOEL IK HET IN MIJN BOTTEN!` (preserves Dutch equivalent idiom)

### J142 — §13 — semantic shift + §7.3 `mensen` cap
- Speaker: Angry Ass
- EN: `Most of us are complex individuals with rich inner lives.`
- NL: `De meeste van ons zijn hele mensen met rijke innerlijke belevenissen.`
- Drift: (a) `hele mensen` = "whole people / full-fledged human beings" — odd choice for a donkey speaker about donkeys, and not a translation of `complex individuals`. EN says "complex individuals", not "real people". (b) Also `mensen` lowercase — but this one is the figurative-people usage so lc may be intentional (§7.3 game-system `Mensen` only applies when literal Humans).
- Proposed: `De meesten van ons zijn complexe individuen met een rijk innerlijk leven.`

### J123 — §13 / Tom-decision — EN-acronym swapped for NL one
- Speaker: Bitter Ass
- EN: `We're HAW. It stands for "Humans Are the Worst."`
- NL: `Wij zijn MZK. Dat staat voor "Mensen Zijn Kak".`
- Drift: EN `HAW` (Humans Are the Worst) is mapped to NL `MZK` (Mensen Zijn Kak = "Humans Are Shit"). This is an acronym-adaptation choice that loses the EN play on `HAW` = donkey-bray. `MZK` doesn't pun. Semantic shift "Worst" → "Kak" (Shit). NOTE: also HAW is referenced in the speaker description as `HAW—Humans Are the Worst` in multiple SPEAKER fields throughout the sheet, so `HAW` is a recurring group name. Changing to `MZK` here desynchronizes from the dev-speaker labels.
- Proposed: needs Tom decision — either (a) keep `HAW` and translate gloss faithfully: `Wij zijn HAW. Dat staat voor "Humans Are the Worst" — Mensen Zijn De Slechtsten.`, or (b) accept current MZK as Tom-locked. Flag for cross-corpus check (HAW vs MZK appears only here?).

### J231 — §13 — word-order awkwardness
- Speaker: Smelly Ass
- EN: `Then what are you doing here? What about DJ Dope Ass's Concert?!`
- NL: `Dan wat sta je hier te doen? Wat met DJ Lijpe Ezel's Concert?!`
- Drift: `Dan wat sta je hier te doen?` reads as broken word-order. Standard Dutch: `Wat sta je hier dan te doen?`. (Subject and `dan` are misordered.)
- Proposed: `Wat sta je hier dan te doen? En DJ Lijpe Ezel's Concert dan?!`

### J153 — §9.3 — `ACHH` vs `ACH` consonant count
- Speaker: Janky Ass
- EN: `ACHH! Protests... they seem like great ideas but they DON'T WORK.`
- NL: `ACH! Protesten... lijken meestal op een goed idee maar ze werken MEESTAL NIET.`
- Drift: (a) EN doubles `H` (`ACHH`) but NL drops to single `H` (`ACH`). Minor — but neighbouring J158 has EN `ACH!` (single H) → NL `ACH!` (match). So J153 inconsistency is the odd one. (b) NL also adds `meestal` (mostly/usually) twice — softens EN absolute `DON'T WORK` (= "always fail").
- Proposed: `ACHH! Protesten... lijken op een goed idee maar ze WERKEN NIET.` (preserves `ACHH` and EN's absolute statement)

### J140 — §13 — past-tense mismatch
- Speaker: Angry Ass
- EN: `UGH! I hate Humans because they never gave us the representation in their media we deserved.`
- NL: `UGH! Ik haat Mensen omdat ze ons nooit de representatie in de media geven die we verdienden.`
- Drift: EN `gave` (past) → NL `geven` (present). Mismatch in temporal frame — NL implies it's still happening / never given. Subordinate clause `die we verdienden` is past, so main clause should match.
- Proposed: `UGH! Ik haat Mensen omdat ze ons nooit de representatie in de media gaven die we verdienden.`

---

## Result

22 new blind-spot findings across BUGS / §5.1 / §13 / §9.3 / §12.4. Top severity: BUG cluster at J138 (content drop + duplicate verb) and §5.1 register-violation cluster on DJ Dope Ass (J207/J208/J210/J214/J215 — 5 cells of ge/gij where canon §1 locks je/jij, **a cross-cell consistency drift the regex audit cannot catch because individual cells parse as valid ge/gij Flemish but violate the speaker register lock**).

The DJ Dope Ass cluster is the most actionable finding — single character, single push, fixes the recurring register-mismatch with J222/J223 within the same scene.

3-line summary:
- Cells walked: 234
- New findings: 22
- Top severity: BUG / content-drop at J138 + §5.1 register cluster (J207/208/210/214/215 DJ Dope Ass ge→je per canon §1 #8 / §6.13 Q4)
