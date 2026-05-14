# Blind-spot walk — E10_Government_localization

**Sheet:** `10_asses.masses_E10Proxy.xlsx :: E10_Government_localization`
**Cells walked:** 272 NL cells (J3–J274; J2 is SPACER)
**Date:** 2026-05-12
**Method:** end-to-end read of `/tmp/e10_gov_dump.txt` after `walk-sheet.py` dump.
**Scope:** §12.4 English bleed, §13 broader mistranslations, §5.1 register exceptions, §6.7 cross-cell consistency, §9.3 terminal punct, §12.3 Slow stutter, §1 codex voice, §7.3.1 cap/lc collisions, §3.1 place names.
**Excluded:** every finding already logged in `audit-2026-05-12-deep-eyeball.md` (J47, J68, J100, J110, J154 covered in earlier batches) and all push-log-confirmed cells (J6, J23, J25, J56-Helpful, J61, J65, J76, J93, J97, J100, J145, J148, J154, J158, J163, J169, J172, J179, J182, J203, J252-U, J269, J270).

---

## BUGS — §5.4 ge/gij bare-stem imperative drift (§1 codex voice)

Canon §5.4: ge/gij imperative = stem + `-t` (`Zegt`, `Gaat`, `Stopt`, `Maakt`). Bare-stem `Zeg`/`Ga` is je/jij form. Helpful Ass + Edgy Ass locked **ge/gij** per canon §1 #9 + #13. Kick Ass + Big Ass + Cole-Machine ge/gij. All E10 Manifesto-pitch lines use bare-stem `Zeg` regardless of speaker register — driver of multiple drifts below.

### J45 — §5.4 — Helpful Ass `Zeg → Zegt`
- Speaker: Helpful Ass (ge/gij)
- EN: `Say something in Human!`
- NL: `Zeg ne keer iets in 't Mens!`
- Drift: bare-stem `Zeg` is je/jij form; Helpful is ge/gij per canon §1 #9. Cell J56 (same speaker) correctly uses `Zegt ze…`, J159 uses `Vertelt`. J45 is the outlier inside this sheet.
- Proposed: `Zegt ne keer iets in 't Mens!`

### J57 — §5.4 — Edgy Ass `Zeg → Zegt`
- Speaker: Edgy Ass (ge/gij per canon §1 #13)
- EN: `Tell the Humans to support—`
- NL: `Zeg de Mensen dat ze ons steunen—`
- Drift: bare-stem `Zeg` from ge/gij speaker.
- Proposed: `Zegt de Mensen dat ze ons steunen—`

### J88 — §5.4 — Helpful Ass `Zeg → Zegt`
- Speaker: Helpful Ass (ge/gij)
- EN: `Tell the Humans we've suffered so much—`
- NL: `Zeg tegen de Mensen da we zóveel geleden hebben—`
- Drift: bare-stem `Zeg`. Inconsistent with J56 (Helpful, same beat, alt-branch) `Zegt ze da we zóveel geleden hebben—`.
- Proposed: `Zegt tegen de Mensen da we zóveel geleden hebben—`

### J89 — §5.4 — Edgy Ass `Zeg → Zegt`
- Speaker: Edgy Ass (ge/gij)
- EN: `Tell the Humans to support—`
- NL: `Zeg de Mensen dat ze moeten steunen—`
- Drift: bare-stem; identical to J57. Same EN line appears in both branches; both drift.
- Proposed: `Zegt de Mensen dat ze moeten steunen—`

### J129 — §5.4 — Kick Ass `Zeg → Zegt`
- Speaker: Kick Ass (ge/gij — canon-locked, signed 2026-05-11)
- EN: `Tell the Humans that we want NO MORE FIGHTING!`
- NL: `Zeg tegen de Mensen dat we NIET MEER WILLEN VECHTEN!`
- Drift: bare-stem from ge/gij speaker. Codex Kick Ass passes V2 `-t` ge/gij verb flips (J323 codex rulesLocked: `kan→kunt`, `ben→zijt`, `mag→moogt`, `hoor→hoort`). `Zeg→Zegt` is the same paradigm.
- Proposed: `Zegt tegen de Mensen dat we NIET MEER WILLEN VECHTEN!`

### J134 — §5.4 — Kick Ass `Ga → Gaat`
- Speaker: Kick Ass (ge/gij)
- EN: `@#$%&! Go talk to the OTHERS!`
- NL: `@#$%&! Ga met de ANDEREN praten!`
- Drift: bare-stem `Ga`; ge/gij form is `Gaat`. Mirrors E9 fix Cole-Machine `Ga→Gaat` (GoldenAss J135, pushed 2026-05-12).
- Proposed: `@#$%&! Gaat met de ANDEREN praten!`

### J142 — §5.4 — Big Ass `Zeg → Zegt`
- Speaker: Big Ass (ge/gij — canon §1 #6 / §5.0 dominant)
- EN: `Tell the Humans to close their Factories everywhere...`
- NL: `Zeg tegen de Mensen dat ze overal hun Fabrieken sluiten...`
- Drift: bare-stem from ge/gij speaker.
- Proposed: `Zegt tegen de Mensen dat ze overal hun Fabrieken sluiten...`

### J240 — §5.4 — Edgy Ass `Zeg → Zegt`
- Speaker: Edgy Ass (ge/gij)
- EN: `Tell the Humans to support and appreciate our creative endeavours.`
- NL: `Zeg tegen de Mensen dat ze onze creatieve inspanningen moeten steunen en waarderen.`
- Drift: bare-stem; same pattern as J57/J89.
- Proposed: `Zegt tegen de Mensen dat ze onze creatieve inspanningen moeten steunen en waarderen.`

---

## BUGS — §12.4 English bleed

### J11 — §13 (calque) — radio idiom `aan de top van het uur`
- Speaker: Radio Host Marcos
- EN: `We'll have more on this story at the top of the hour.`
- NL: `Meer over dit verhaal aan de top van het uur.`
- Drift: `aan de top van het uur` is a literal calque of EN "top of the hour"; not a Dutch radio idiom. Subject `We'll have` also dropped (telegraphic, fine on its own — but combined with the calque, the line reads as English-thought-in-Dutch-words).
- Proposed: `Meer over dit verhaal op het hele uur.` or `Straks op het uur meer hierover.` — needs Tom decision on radio register preference.

### J213 — §12.4 — `Consent` English loanword
- Speaker: Left Ass
- EN: `Consent is what every Ass wants.`
- NL: `Consent is wat elke Ezel wil.`
- Drift: `Consent` is English. Modern Dutch increasingly accepts as loanword in consent-discourse context, but per §12.4 default Dutch term is `Toestemming` (or `Instemming`). EN-co-authoritative: EN uses no foreign loan; NL should mirror.
- Proposed: `Toestemming is wat elke Ezel wil.` or `Instemming is wat elke Ezel wil.` — Tom decision on whether `Consent` is acceptable as adopted loanword.

### J51 — §12.4 — `Wowee` kept untranslated
- Speaker: {$NewName} (Foal-Prophet)
- EN: `Wowee... okay...`
- NL: `Wowee... oké...`
- Drift: `Wowee` is an English interjection kept in NL. Per §12.4 English bleed pattern (cf. `oh boy → Oh jee`). Foal voice could use Dutch equivalent.
- Proposed: `Wauw... oké...` or `Tjonge... oké...` or `Amai... oké...` — needs Tom decision (Foal-voice register).

---

## BUGS — §13 broader mistranslation / semantic drift

### J82 — §13 + §7.1 — semantic shift + lowercase `mensen`
- Speaker: Cole-Machine
- EN: `Once they learn to see the world from your perspective, they will work with us to change the ways of Humans everywhere.`
- NL: `Zodra ze de wereld leren zien door jullie ogen, zullen ze samen met ons de mensen wereldwijd tot nadenken brengen.`
- Drift (two-layer):
  - EN `change the ways of Humans everywhere` = "change Humans' behavior/customs worldwide". NL `de mensen wereldwijd tot nadenken brengen` = "bring Humans worldwide to reflection". Semantic narrowing (behavior change → mere reflection).
  - `mensen` lowercase per §7.1 should be `Mensen`.
- Proposed: `Zodra ze de wereld leren zien door jullie ogen, zullen ze samen met ons de gewoonten van de Mensen wereldwijd veranderen.` — Tom decision on `gewoonten` vs `manier van leven`.

### J83 — §13 — added vocative `kameraden` not in EN
- Speaker: Cole-Machine
- EN: `If you tell me your demands, I will relay them to the citizens of Mecha in their own language.`
- NL: `Als ge mij uw eisen vertelt, kameraden, dan geef 'k die door aan de burgers van Technopolis — in hun eigen taal.`
- Drift: NL inserts `kameraden` vocative; EN has no `Comrade(s)`. Cole-Machine has `kameraad` in `dialectalMarkersAllowed`, but per Sturdy precedent (§12.1, push-confirmed 2026-05-11): strip `, Kameraad` when EN has no Comrade-tag. Same EN-co-authoritative principle applies to Cole-Machine.
- Proposed: `Als ge mij uw eisen vertelt, dan geef 'k die door aan de burgers van Technopolis — in hun eigen taal.`

### J266 — §13 — stray `te` grammar + content drift vs J267
- Speaker: Golden Ass
- EN: `Your sister gave her Soul to us so that we might return to this World and save it.`
- NL: `Uw zuster heeft haar Ziel aan ons geschonken, opdat wij tot deze Wereld mochten wederkeren en haar te redden.`
- Drift: `en haar te redden` mismatched conjunction. After `opdat wij … mochten wederkeren`, the second verb should match (`… en haar redden`, no `te`) or shift to purpose clause (`om haar te redden`). Also see J267 §6.7 below — same EN, different NL.
- Proposed: `Uw zuster heeft haar Ziel aan ons geschonken, opdat wij tot deze Wereld mochten wederkeren en haar redden.` (drop `te`) — or align fully with J267 form `… opdat wij naar deze Wereld konden terugkeren en haar redden.`

### J18 — §13 — single EN command expanded to redundant doublet
- Speaker: Gaunt Ass
- EN: `Stop right there!`
- NL: `Halt, blijf staan!`
- Drift: EN is one tight imperative; NL splits into `Halt` (interjection) + `blijf staan` (imperative). The two together are near-synonymous in NL ("Halt, stand still!") — redundant. Gaunt's terse confrontational register would be better-served by a single sharp command.
- Proposed: `Blijf staan!` or `Sta stil!` or `Halt!` — pick one, drop the other. Tom decision.

### J19 — §13 — content drop `inside` → none
- Speaker: Proper Ass
- EN: `No Humans allowed inside.`
- NL: `Geen Mensen toegelaten.`
- Drift: NL drops `inside`/`binnen`. Loses specificity of "this building" (J20 follow-up: "We're occupying this building"). EN context is the occupied building entrance.
- Proposed: `Geen Mensen binnen toegelaten.`

### J50 — §13 — gendered `Profetes` vs gender-neutral EN `Prophet`
- Speaker: Proper Ass
- EN: `Young Prophet, will you translate our demands to the Humans?`
- NL: `Jonge Profetes, staat u ons toe te vragen — wilt u onze eisen vertolken aan de Mensen?`
- Drift: NL uses feminine `Profetes`. EN `Prophet` is gender-neutral. Per game data, Foal-Prophet path branches male/female; this line fires for both paths. Forcing feminine excludes male-Foal players. Also `staat u ons toe te vragen — wilt u…` is a wordy hedge-construction not present in EN (semantic addition).
- Proposed: `Jonge Profeet, wilt u onze eisen vertolken aan de Mensen?` — drop `-es` (gender-neutral) + drop `staat u ons toe te vragen` hedge (EN-co-authoritative).

---

## §6.7 cross-cell consistency — same EN, different NL inside this sheet

Two Golden Ass speech beats repeat twice for Foal/Cole-Prophet branching. Some pairs are identical (good), others drifted:

### J52 / J84 — §6.7 — `Just like old times.`
- EN (both): `A wonderful collaboration! Just like old times.`
- J52 NL: `Een wonderbaarlijke samenwerking! Geheel zoals in de dagen van weleer.`
- J84 NL: `Een wonderbaarlijke samenwerking! Net als in de goede oude tijd.`
- Drift: Same EN beat, two different idioms (`in de dagen van weleer` archaic-formal vs `in de goede oude tijd` colloquial-modern). Golden Ass voice = ceremonial; J52 fits register better. J84 is a register flip.
- Proposed: Normalize both to `Geheel zoals in de dagen van weleer.`

### J59 / J91 — §6.7 — Resentful Ass `No more rides!!`
- EN (both): `No more rides!!`
- J59 NL: `Geen ritten meer!!`
- J91 NL: `Gedaan met de ritjes!!`
- Drift: Same EN, two different translations. J201 (manifesto line, same content as quoted demand): `Geen ritten meer.` So J59 aligns with manifesto form; J91 is the outlier.
- Proposed: Normalize J91 to `Geen ritten meer!!`

### J60 / J92 — §6.7 — word-order `Gij allen hebt` vs `Gij hebt allen`
- EN (both): `SILENCE. You all have a lot to say, but we shall assemble this Manifesto in an orderly fashion.`
- J60 NL: `STILTE. Gij allen hebt veel te zeggen, maar wij zullen dit Manifest op ordelijke wijze samenstellen.`
- J92 NL: `STILTE. Gij hebt allen veel te zeggen, maar wij zullen dit Manifest op ordelijke wijze samenstellen.`
- Drift: `Gij allen hebt` vs `Gij hebt allen` — both grammatical; the V2 placement differs. Minor but visible.
- Proposed: Normalize. `Gij hebt allen veel te zeggen` (J92 form) reads more natural in modern NL.

### J61 / J93 — §6.7 — `Verspreid U` vs `Spreid U uit`
- EN (both): `Spread out, Vassals.`
- J61 NL: `Verspreid U, Vazallen.`
- J93 NL: `Spreid U uit, Vazallen.`
- Drift: Two different verbs (`verspreiden` reflexive vs `uitspreiden`).
- Proposed: Normalize. `Verspreid U, Vazallen.` is tighter and matches ceremonial register.

### J63 / J95 — §6.7 — `beknopt` vs `bondig`
- EN (both): `Prophet, we must keep our demands succinct.`
- J63 NL: `Profeet, wij dienen onze eisen beknopt te houden.`
- J95 NL: `Profeet, wij dienen onze eisen bondig te houden.`
- Drift: Both synonyms for "succinct"; inconsistent within sheet.
- Proposed: Normalize on `beknopt` (matches push-log usage elsewhere).

### J65 / J97 — §6.7 — `te allen tijde` vs `steeds`
- EN (both): `After you fill your Manifesto, you can always replace a previous idea by choosing a new one.`
- J65 NL: `Nadat gij Uw Manifest hebt gevuld, kunt gij te allen tijde een vorig idee vervangen door een nieuw te kiezen.`
- J97 NL: `Nadat gij Uw Manifest hebt gevuld, kunt gij steeds een vorig idee vervangen door een nieuw te kiezen.`
- Drift: `te allen tijde` (formal, "at all times") vs `steeds` (neutral, "always/continuously"). Same EN word `always`.
- Proposed: Normalize on `te allen tijde` — matches Golden Ass formal register.

### J164 / J173 / J183 / J192 — §6.7 — Helpful Ass `Wil de` vs `Wilde`
- EN (J164/J173/J183): `Do you wanna know?` (J192: `Do you want to hear my story again?`)
- J164 NL: `Wil de 't weten?`
- J173 NL: `Wilde 't weten?`
- J183 NL: `Wilde 't weten?`
- J192 NL: `Wil de 't nog ne keer horen, mijn verhaal?`
- Drift: Same Flemish tussentaal contraction of `Wilt ge` — split 2:2 between `Wil de` (J164/J192) and `Wilde` (J173/J183) inside Helpful Ass's monologue. Normalize one way.
- Proposed: `Wilde 't…` (one-word; modern tussentaal preference) — Tom decision.

### J266 / J267 — §6.7 — Golden Ass `Your sister gave her Soul…`
- EN (both, J267 marked "Copy needed for separate animation"): `Your sister gave her Soul to us so that we might return to this World and save it.`
- J266 NL: `Uw zuster heeft haar Ziel aan ons geschonken, opdat wij tot deze Wereld mochten wederkeren en haar te redden.`
- J267 NL: `Uw zuster heeft haar Ziel aan ons geschonken opdat wij naar deze Wereld konden terugkeren en haar redden.`
- Drift: Three substantive divergences for identical EN (paired Foal/Cole-branch lines):
  - `tot deze Wereld` vs `naar deze Wereld` (preposition)
  - `mochten wederkeren` (archaic-formal) vs `konden terugkeren` (modern-formal)
  - `en haar te redden` (stray `te`) vs `en haar redden`
- Proposed: Normalize. J267 is the cleaner form; replicate to J266: `Uw zuster heeft haar Ziel aan ons geschonken opdat wij naar deze Wereld konden terugkeren en haar redden.`

### J130 / J136 — §6.7 — auxiliary order `zou gewild hebben` vs `gewild zou hebben`
- EN J130: `That's what my sister would have wanted.` (Kick Ass)
- EN J136: `That's what Big Ass would have wanted.` (Smart Ass)
- J130 NL: `Dat is wat mijn zus zou gewild hebben.`
- J136 NL: `Dat is wat Mega Ezel gewild zou hebben.`
- Drift: Same EN frame `would have wanted`, two different aux orderings. Both grammatical (Dutch perfect-conditional has flexible aux). Cross-speaker, cross-character — minor, but visible inside the same sheet.
- Proposed: Normalize on `zou gewild hebben` (J130 form) — more idiomatic order in spoken Dutch.

---

## §7.1 capitalisation — `mensen` should be `Mensen`

### J82 — §7.1 — `de mensen wereldwijd`
- Already noted under §13 entry above. `mensen → Mensen`.

### J235 — §7.1 — Right Ass `de mensen` lowercase
- Speaker: Right Ass
- EN: `Tell the humans to forgive any debts they think we owe them.`
- NL: `Zeg tegen de mensen dat ze alle schulden moeten kwijtschelden waarvan ze denken dat wij die bij hen hebben.`
- Drift: EN uses lowercase `humans` (inconsistent within EN corpus), but per canon §7.1 NL caps `Mensen` regardless. Same convention applied at J6/J235 push and corpus-wide.
- Proposed: `Zeg tegen de Mensen dat ze alle schulden moeten kwijtschelden waarvan ze denken dat wij die bij hen hebben.`

### J252 — §7.1 — Golden Ass `mensen` lowercase (residual after U fix)
- Speaker: Golden Ass
- EN: `Are you ready to speak to the Humans?`
- NL: `Bent gij bereid om U tot de mensen te wenden?`
- Drift: Earlier push fixed `u → U` (§7.4) but left `mensen` lowercase. EN caps `Humans`; §7.1 caps NL `Mensen`.
- Proposed: `Bent gij bereid om U tot de Mensen te wenden?`

---

## §9.3 terminal punctuation mismatch

### J3 — §9.3 — `.` (EN) vs `!` (NL)
- Speaker: Proper Ass
- EN: `No Human enters and no Ass leaves until we have determined our next move.`
- NL: `Geen Mens komt erin en geen Ezel gaat eruit tot wij onze volgende stap hebben bepaald!`
- Drift: EN ends `.` (declarative directive); NL ends `!` (exclamation). Proper Ass's poised-formal voice favours `.` — exclamation feels more Hard Ass than Proper Ass. EN-co-authoritative.
- Proposed: `Geen Mens komt erin en geen Ezel gaat eruit tot wij onze volgende stap hebben bepaald.`

---

## Summary

- **Cells walked:** 272
- **New findings:** 27
- **Top severity:** §5.4 ge/gij imperative bare-stem drift — 8 cells across Helpful / Edgy / Kick / Big Ass; systematic pattern in Manifesto-pitch lines (`Tell the Humans…` → `Zeg…`) regardless of speaker register. Sweep candidate.
- Other notable: §6.7 cross-cell inconsistencies in Golden Ass's twin Foal/Cole-branch lines (J52/84, J60/92, J61/93, J63/95, J65/97, J266/267) — repeat-pair branching introduced parallel-but-drifted translations; could normalize with a Golden-Ass-branch dedupe sweep.
