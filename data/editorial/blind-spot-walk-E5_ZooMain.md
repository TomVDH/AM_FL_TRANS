# Blind-spot walk — E5_ZooMain_localization

**Sheet:** `5_asses.masses_E5Proxy.xlsx :: E5_ZooMain_localization`
**Cells walked:** 231 / 231 (J2 … J232, end-to-end)
**Reference excluded:** all DRIFT in `data/editorial/audit-2026-05-12-deep-eyeball.md`
(J4 ×2, J18, J35, J46, J47, J94, J119, J125, J154, J165, J169, J176-grammar, J190-grammar, J216 — already documented) **plus** push-log overrides
(J91 `success` Tom-kept; J120 Job §6.16 pushed; J208 Tom override `'t Beste aan hem te zoeken`; J224 Ezeltje §7.1 pushed) **plus** LEN-RATIO false-positives (J68/J207).

Findings are new — they sit in the regex blind-spot zone (codex voice, cross-cell, EN-bleed, register exceptions, stutter pattern, punctuation parity).

---

## NEW FINDINGS

### J118 — §11.1 / §1 codex voice — `*boe-hoe-hoe-hoe*` (4 hoes) violates Tom 2026-05-10 lock
- Speaker: Sad Ass
- EN: `*whimper*`
- NL: `*boe-hoe-hoe-hoe*`
- Drift: Canon §11.1 + codex `verbalTics` lock exactly 3 `hoe` (Tom 2026-05-10 RECTON). This cell has 4. Patrick sweep 2026-05-11 reported "All Triestige boe-hoe-hoe updated" — but two cells still 4-hoe in this sheet.
- Proposed: `*boe-hoe-hoe*`

### J123 — §11.1 / §1 codex voice — `*boe-hoe-hoe-hoe*` (4 hoes) violates Tom 2026-05-10 lock
- Speaker: Sad Ass
- EN: `*whimper*`
- NL: `*boe-hoe-hoe-hoe*`
- Drift: Same as J118 — 4 hoes; canon lock is 3.
- Proposed: `*boe-hoe-hoe*`

### J109 — §5.1 register — `Pakt ze!` (ge/gij imperative form) on je/jij speaker
- Speaker: Zookeeper Rose
- EN: `Littlefoot! You're one small step from first place! Get it!`
- NL: `Platvoet! Kleine stap verwijderd van eerste plaats! Pakt ze!`
- Drift: Zookeeper Rose codex `pronounForm: jij/je`. Imperative `Pakt` is the ge/gij second-person form. je/jij imperative is `Pak`.
- Proposed: `Platvoet! Kleine stap verwijderd van eerste plaats! Pak ze!`

### J48 — §12.4 / §12.3 — `Oh boy → Oh jee` corpus-wide canon NOT applied; also `Och j-j-jongens` is plural shift
- Speaker: Slow Ass
- EN: `Oh b-b-boy.`
- NL: `Och j-j-jongens.`
- Drift: §12.4 explicit Patrick fix: `oh boy` → **`Oh jee`** (corpus-wide). Current `Och j-j-jongens` pluralises ("Oh boys") and uses non-canonical opening `Och`.
- Proposed: `O j-j-jee.` (preserves Slow Ass stutter on `jee`'s leading consonant).

### J81 — §12.4 / §12.3 — second `Oh boy` cell with same drift as J48
- Speaker: Slow Ass
- EN: `Oh b-b-boy. Today was p-p-particularly p-p-punishing...`
- NL: `Ach j-j-jongens. Vandaag was b-b-bijzonder h-h-hard...`
- Drift: Same as J48 — `Oh boy` → canon `Oh jee`. Current `Ach j-j-jongens` is plural-shift + non-canonical opener.
- Proposed: `O j-j-jee. Vandaag was b-b-bijzonder h-h-hard...`

### J96 — §12.4 — English-bleed `LOSERS!` in donkey line
- Speaker: Smart Ass
- EN: `Losers! Ha!`
- NL: `LOSERS! Ha!`
- Drift: §12.4 zero English in donkey speech. EN had `Losers!` lowercase; NL caps it AND keeps the English root. The deep-eyeball audit flagged `loser` as a possible English-bleed risk for the E5 sheets. (Smart Ass is the joke's punchline — could be a stylistic "loanword punch" — needs Tom call.)
- Proposed: `VERLIEZERS! Ha!` (or `SUKKELS! Ha!`) — or stay English with Tom override.

### J29 — §12.3 — vowel-initial stutter `a-a-alles`
- Speaker: Slow Ass
- EN: `We can't b-b-be good at everything, Smar—`
- NL: `Je kan niet in a-a-alles goed z-z-zijn, Slim—`
- Drift: §12.3 explicit rule: stutter prefix on **Dutch consonants only** (b-/z-/p-/d-/h-/m-…). `a-a-` is vowel-initial. The `z-z-zijn` half is fine; only `a-a-alles` violates. (`O-o-oef` at J31 is similar but is onomatopoeia naturally vowel-initial — treated separately below.)
- Proposed: `Je kan niet in alles goed z-z-zijn, Slim—` (drop the vowel stutter, keep `z-z-zijn`).

### J183 — §12.4 — English-bleed `op site` (Zookeeper Rose, non-donkey but anglicism)
- Speaker: Zookeeper Rose
- EN: `The Zoo's Board of Directors are doing a site visit to meet the Ass of the Week?`
- NL: `De Raad van Bestuur van de Dierentuin gaat vandaag op site om de Ezel van de Week te ontmoeten?`
- Drift: `op site` is an Anglicism (NL `site` borrowed from EN `site visit`). Standard Dutch idiom for a "site visit" is `op werkbezoek` / `langs komen` / `ter plaatse komen`. The non-donkey NPC carve-out in §12.4 is for Cole-Machine activist register — Zookeeper Rose has no such exception.
- Proposed: `…gaat vandaag op werkbezoek om de Ezel van de Week te ontmoeten?`

### J184 — §7.3.1 cap/lc collision — `dierentuin` lowercase vs 7 other `Dierentuin` capped occurrences
- Speaker: Zookeeper Rose
- EN: `And they're interested in reallocating more resources to our corner of the Zoo?`
- NL: `En ze overwegen meer geld en middelen naar ons deel van de dierentuin te sturen?`
- Drift: Sheet uses `Dierentuin` capped in 7 cells (J93/J125/J165/J169/J183/J223/J229). J184 alone has lowercase `dierentuin`. EN `Zoo` is capped throughout. §7.3.1 cap/lc parity.
- Proposed: `…naar ons deel van de Dierentuin te sturen?`

### J38 — §13 — past-tense NL for present-tense EN
- Speaker: Zookeeper Rose
- EN: `Eeyore, even YOU have to smile at how well you're doing.`
- NL: `Iejoor, zelfs jij moet toch kunnen pronken met hoe goed je 't wel niet deed.`
- Drift: EN present continuous `you're doing` → NL past `je 't deed` ("you did"). Day 3 mid-competition scene — present tense required.
- Proposed: `…hoe goed je 't wel niet doet.`

### J197 — §13 — `broekschijter` ("trouser-shitter / coward") for EN `quitter`
- Speaker: Smart Ass
- EN: `Forget him! He's a quitter.`
- NL: `Laat zitten, jong. Het is een broekschijter.`
- Drift: `broekschijter` = coward / chicken / shit-pants. EN `quitter` = someone who gives up / abandons (resonates with Sad Ass leaving the herd). Semantic shift from "gives-up" to "coward". Also §9.3: EN `!` after `him` → NL `,` (mid-clause de-emphasised).
- Proposed: `Laat zitten, jong! Het is een afhaker.` (or `…een opgever.`) — keep the `!` and the "quitter" sense.

### J51 vs J217 — §6.7 cross-cell — same EN `Shut it!`, different NL
- Speaker: Smart Ass (both cells)
- EN (both): `Shut it!` (J51 standalone; J217 followed by elaboration)
- NL J51: `Hou je bakkes!`
- NL J217: `Bek dicht!`
- Drift: Two NL renderings for the same EN exclamation, same speaker. Pick one for §6.7 corpus parity. (NB: J30 EN is `Keep your mouth shut, Slow Ass!` — different EN — its `Bek dicht, Slome!` is a separate match.)
- Proposed: needs Tom decision — settle on `Bek dicht!` (matches J30 + J217) or `Hou je bakkes!` corpus-wide for Smart Ass.

### J199 vs J208 — §6.7 cross-cell — J199 retains pre-Tom-override wording while J208 was restructured
- Speaker: Smart Ass (both cells)
- EN J199: `And good luck to him finding another job without Machines!`
- EN J208: `Good luck to him finding another job without Machines!`
- NL J199: `En 't beste voor hem om een job zonder Machines te vinden!`
- NL J208: `'t Beste aan hem om een job zonder Machines te zoeken!` (Tom override Push 4 — `aan hem … te zoeken` idiom)
- Drift: Tom's idiomatic restructure at J208 (`aan hem`+`zoeken`) was not propagated to its near-twin J199, which keeps the older `voor hem`+`vinden` phrasing. Same speaker, same scene, same EN core.
- Proposed: `En 't beste aan hem om een job zonder Machines te zoeken!` (parallel to J208).

### J176 vs J190 — §6.7 cross-cell — same EN `BOARD OF DIRECTORS … Nuzzle them`, only `gezellig` vs `knus` differs
- Speaker: Zookeeper Rose (both cells)
- EN (both): `The BOARD OF DIRECTORS love it when you get intimate and Nuzzle them!`
- NL J176: `De RAAD VAN BESTUUR wil dat jullie ze gezellig komen Knuffelen!`
- NL J190: `De RAAD VAN BESTUUR wil dat jullie ze knus komen Knuffelen!`
- Drift: Two NL renderings for identical EN. Probably intentional in-fiction variation (Day 7 alt branches) but worth a Tom eye for §6.7.
- Proposed: needs Tom decision — pick one (e.g. `gezellig`) and propagate.

### J13 — §9.3 terminal punctuation — EN `!` → NL `.`
- Speaker: Zookeeper Rose
- EN: `Sophie! Everyone can tell how smart she is!`
- NL: `Sofie! Iedereen ziet hoe pienter ze wel niet is.`
- Drift: Second clause loses the EN exclamation mark (energy de-emphasised).
- Proposed: `Sofie! Iedereen ziet hoe pienter ze wel niet is!`

### J67 — §9.3 terminal punctuation — EN `!` → NL `.`
- Speaker: Zookeeper Rose
- EN: `There are CHILDREN coming today and they love it when you Bray!`
- NL: `Er komen vandaag KINDEREN langs en die vinden het zo fijn wanneer je BALKT.`
- Drift: EN ends `!`; NL ends `.`. Loss of upbeat emphasis on a Zookeeper Rose hype line.
- Proposed: `…wanneer je BALKT!`

### J204 — §9.3 terminal punctuation — EN `!` → NL `.`
- Speaker: Slow Ass
- EN: `...not even a goodb-b-bye!`
- NL: `...niet eens s-s-salut gezegd.`
- Drift: EN ends `!`; NL ends `.`. Loss of indignant emphasis.
- Proposed: `...niet eens s-s-salut gezegd!`

### J207 — §9.3 terminal punctuation + §13 wording — EN `!` → NL `.`, `Hell no!` → `Niets`
- Speaker: Smart Ass
- EN: `Hell no!`
- NL: `Niets, jong. Absoluut niet.`
- Drift: `Niets` literally = "Nothing" — odd choice for `Hell no!`. Also EN ends `!`; NL ends `.`. (Note: LEN-RATIO false-positive on J207 in regex audit — this is a separate content concern.)
- Proposed: `Geen sprake van, jong! Absoluut niet.` (or `Echt niet, jong! Absoluut niet.`)

### J155 — §13 — semantic awkwardness / over-literal
- Speaker: Sad Ass
- EN: `But I know I won't find it here with you all.`
- NL: `Maar ik weet dat dit niet met ieder van jullie hier te vinden valt.`
- Drift: NL parses as "this isn't findable here with each of you" — awkward inversion. The pivot phrase `met ieder van jullie hier te vinden valt` separates `vinden` from any clear object referent. Smoother NL would re-anchor the "I" + "find" frame.
- Proposed: `Maar ik weet dat ik het hier bij jullie niet ga vinden.` (or `…niet zal vinden bij jullie.`).

### J100 — §13 — odd syntax for collective-relief line
- Speaker: Big Ass
- EN: `We don't have to deal with her oversized ego!`
- NL: `Nu moeten we niet meer met haar opgeblazen ego te maken hebben!`
- Drift: NL word order `met haar opgeblazen ego te maken hebben` is forced — standard Dutch is `met haar opgeblazen ego te maken hebben` post-verbally only after `niets`-construction. Reads stilted. Minor §13.
- Proposed: `Nu hoeven we niets meer met haar opgeblazen ego te maken te hebben!` (or `Nu zijn we van haar opgeblazen ego af!`).

### J122 — §13 — inverted word order
- Speaker: Sad Ass
- EN: `And you have all moved on without me.`
- NL: `En jullie allemaal zonder mij zijn verdergegaan.`
- Drift: NL `En jullie allemaal zonder mij zijn verdergegaan` has the finite verb after the PP — unnatural for main clause. Reads as a "yoda" inversion.
- Proposed: `En jullie zijn allemaal zonder mij verdergegaan.`

### J108 — §13 — added vocabulary `het nog tot de eerste plek gaat schoppen`
- Speaker: Zookeeper Rose
- EN: `I have a feeling you're gonna smash through second place and come out on top!`
- NL: `Ik heb het gevoel dat jij het nog tot de eerste plek gaat schoppen!`
- Drift: NL drops the "smash through second place" mid-clause entirely; collapses to "you're going to make it to first". Semantic compression (acceptable) but loses the EN "second-then-first" momentum. Minor §13.
- Proposed: needs Tom decision — current is readable; if literal: `Ik heb het gevoel dat jij door de tweede plek heen breekt en bovenaan eindigt!`

### J172 — §13 — `gaan te weten komen` clunky
- Speaker: Zookeeper Rose
- EN: `They're gonna find out Eeyore's gone...`
- NL: `Ze gaan te weten komen dat Iejoor is ontsnapt...`
- Drift: `gaan te weten komen` is awkward — standard Dutch is `gaan erachter komen` / `zullen ontdekken`. Reads like calque of EN "are going to find out".
- Proposed: `Ze gaan erachter komen dat Iejoor ontsnapt is...` (also fixes V2 ordering).

### J31 — §12.3 — vowel-initial stutter `O-o-oef` (NOTE, not strict DRIFT)
- Speaker: Slow Ass
- EN: `P-p-phew! I'm p-p-parched!`
- NL: `O-o-oef! Ik ben uitged-d-droogd!`
- Drift: §12.3 says consonants-only. EN's `P-p-phew` substituted with NL onomatopoeia `oef` which is naturally vowel-initial. The `d-d-droogd` half is fine. Either accept as "onomatopoeia carve-out" or rephrase to a consonant-initial NL exclamation.
- Proposed: needs Tom decision — accept onomatopoeia exception, or rewrite as `P-p-poeh! Ik ben uitged-d-droogd!` (vowel→consonant-initial alternative).

### J97 — §12.4 / §12.3 — `alsjeblief` kept (canon says `Please` → CUT for Slow Ass)
- Speaker: Slow Ass
- EN: `P-p-please don't hate me...`
- NL: `H-h-haat mij alsjeblief n-n-niet maar...`
- Drift: §12.4 explicit Patrick fix: Slow Ass's `Please` → **cut**. Current NL keeps `alsjeblief` (Dutch translation of `please`). Also `n-n-niet maar` is unusual word order (`maar` at the end).
- Proposed: `H-h-haat mij n-n-niet...` (drop `alsjeblief` per §12.4 + drop trailing `maar`).

### J85 — §13 — narrowed sense, EN `whose in LAST place` → NL `wie er LAATSTE in het klassement staat`
- Speaker: Zookeeper Rose
- EN: `Let's see whose in LAST place...`
- NL: `Laten we kijken wie er LAATSTE in het klassement staat...`
- Drift: EN `LAST place` is a generic Ass-of-the-Week notion. NL anchors it to `klassement` (rankings table) which is fine. But EN cap on `LAST` → NL cap on `LAATSTE` ✓; no real drift. (Included only as a defensive flag — content seems clean.)
- Proposed: keep as is (no change required).

### J189 — §12.4 / §13 — `Oké` anglicism
- Speaker: Zookeeper Rose
- EN: `Listen up!`
- NL: `Oké, luister!`
- Drift: `Oké` is a borrowed anglicism (also Dutch standard now). EN has nothing equivalent — NL adds a discourse marker. Minor §13.
- Proposed: `Luister even!` (drops the added `Oké`).

### J193 — §6.7 cross-cell — `'t` apostrophe form consistency
- Speaker: Big Ass
- EN: `Was it something that we did?`
- NL: `Ligt 't aan ons, dan?`
- Drift: `'t` lowercase apostrophe is fine for Big Ass (codex allows `'t` free). No actual drift — listed only because the surrounding Day-7-Sad-aftermath cluster has 4 different `'t / Triestigaard / dat is / zal 't` forms; cross-cell sanity ✓.
- Proposed: keep as is.

### J95 — §13 — `mop` (joke) for EN `one` (i.e. one [joke]) — natural Dutch idiom expansion
- Speaker: Smart Ass
- EN: `I got a new one! What do you call undesirable Asses with low scores?`
- NL: `Ik heb een nieuwe mop! Wat noem je onwenselijke Ezels met lage scores?`
- Drift: EN `a new one` (referring back to joke setup) → NL explicit `mop` (joke). Semantic clarification — pre-existing setup contextual; OK. Listed for thoroughness.
- Proposed: keep as is.

---

## Summary

- Sheet `E5_ZooMain_localization`: **231 cells walked end-to-end** (J2 … J232).
- **30 findings recorded** (cap reached).
- Top severities:
  - **§11.1 BUG ×2** — J118, J123 `*boe-hoe-hoe-hoe*` (4 hoes; canon locks 3).
  - **§5.1 register BUG ×1** — J109 `Pakt ze!` ge/gij imperative on je/jij speaker.
  - **§12.4 EN-bleed BUG ×4** — J48, J81 (`Oh boy` → canon `Oh jee` not applied), J96 (`LOSERS`), J183 (`op site`), J97 (`alsjeblief` kept).
  - **§7.3.1 cap/lc BUG ×1** — J184 `dierentuin` lowercase.
  - **§13 BUG ×6** — J38 (tense), J197 (`broekschijter`), J155 (awkward), J100/J122 (word order), J172 (calque).
  - **§6.7 cross-cell BUG ×3** — J51/J217, J199 (vs J208), J176/J190.
  - **§9.3 punct ×4** — J13, J67, J204, J207.
  - **§12.3 stutter NOTE ×2** — J29 (vowel `a-a-`), J31 (vowel `O-o-` onomatopoeia).
  - Other §13 NOTE ×3 (J85, J189, J95, J193).

Highest priority for next push batch: **J118 / J123 §11.1** (explicit Tom-locked canon), **J109 §5.1** (register slip), **J96 / J48 / J81 / J183 §12.4** (Patrick sweep residuals), **J184 §7.3.1** (single cap/lc outlier in an otherwise consistent sheet).
