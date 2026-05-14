# Blind-spot walk — E10_ProphetSpeech_localization

_Walk date: 2026-05-12 — workbook: `excels/10_asses.masses_E10Proxy.xlsx` — sheet: `E10_ProphetSpeech_localization` (105 NL cells)._

Method: end-to-end re-read of every NL cell, EN-anchored, checking the 9 regex blind-spot rules (§12.4 English bleed, §13 broader mistranslations / added vocatives, §5.1 register exceptions, §6.7 cross-cell consistency, §9.3 terminal punctuation, §1 codex voice, §7.3.1 cap/lc collisions, §3.1 place names, §14.1.1 slogan). Excludes deep-eyeball-audited cells (J56/J81/J110/J112), known NOTEs (J77 `niemand niet`, J99 `zomaar`), and the Cole-Machine `godverdomme` insertion pattern.

## Findings

### J28 — §13 — added vocative `Kameraden` for EN `People`
- Speaker: `Cole-Machine`
- EN: `People of Mecha.`
- NL: `Kameraden van Technopolis.`
- Drift: EN says neutral `People`; NL inserts comradely vocative `Kameraden`. Same pattern Tom flagged at J56 (E10 Push 4 — "drop kameraaden addition rather than typo-fix"). `kameraad` IS in Cole-Machine's `dialectalMarkersAllowed`, but inserting it where EN has no vocative is a §13 broadening. This is Cole's speech-opener to a Mecha crowd: EN-faithful neutral reading is `Mensen van Technopolis.` (which also lands Mensen §7.3 race-cap), or `Volk van Technopolis.` if the §13 reading is "audience". `Mensen` collides with the next sentence's `Mensen` race-cap, so `Volk` may read cleaner.
- Proposed: needs Tom decision — `Mensen van Technopolis.` (most EN-faithful + game-system cap) or `Volk van Technopolis.` (avoids cross-cell `Mensen` overload). Reject status-quo `Kameraden`.

### J66 — §13 — added vocative `, kameraad,` (cross-cell anomaly with J63/J69)
- Speaker: `Cole-Machine`
- EN: `Like you, these Asses think of themselves as intelligent animals.`
- NL: `Net als gij, kameraad, denken deze Ezels van zichzelf dat ze intelligente dieren zijn.`
- Drift: EN has no vocative. The parallel cells J63 (`Like you, these Asses think of themselves as political animals.` → `Net als gij denken deze Ezels...`) and J69 (`Like you, most of these Asses don't see themselves as political or intelligent animals.` → `Net als gij zien de meeste van die Ezels...`) — same speaker, identical EN scaffold — have NO `kameraad` insertion. J66 is the odd-one-out. Same §13 precedent as J56/J28.
- Proposed: drop the `, kameraad,` insertion → `Net als gij, denken deze Ezels van zichzelf dat ze intelligente dieren zijn.` (or `Net als gij denken deze Ezels van zichzelf dat ze intelligente dieren zijn.` to match J63 punctuation).

### J4 — §5.4 — Golden Ass bare-stem imperatives (`Spreek`, `Deel`)
- Speaker: `Golden Ass`
- EN: `Speak to them, Prophet! Share the demands of our Asses with the Humans of this city.`
- NL: `Spreek tot hen, Profeet! Deel de eisen van onze Ezels met de Mensen van deze stad.`
- Drift: Golden Ass is ge/gij register (`pronounsAllowed: ['gij','ge','u','uw','zijt']`). §5.4 ge/gij imperative = stem + `-t`. Bare-stem `Spreek`/`Deel` is je/jij form. Precedent: E9 Cole-Machine §5.4 sweep (Push 2 tail) fixed identical pattern (`Geef→Geeft`, `Stop→Stopt`, `Probeer→Probeert`, `Luister→Luistert`, `Ga→Gaat`). However, Golden's `register: archaic divine formal` may justify a stem-only imperative for solemn/biblical cadence — a register exception §5.1 not yet locked. Not flagged in E9 GoldenAss push (no imperatives at sentence start there).
- Proposed: needs Tom decision — either (a) `Spreekt tot hen, Profeet! Deelt de eisen…` per §5.4, or (b) keep bare-stem and lock §5.1 archaic-divine register exception for Golden imperatives.

### J5 — §5.4 — Golden Ass bare-stem imperative (`Win`)
- Speaker: `Golden Ass`
- EN: `Win their hearts with honesty and truth.`
- NL: `Win hun harten met eerlijkheid en waarheid.`
- Drift: Same as J4. ge/gij imperative would be `Wint`. Same Tom-decision parallel.
- Proposed: needs Tom decision — see J4.

### J25 — §5.4 — Golden Ass bare-stem imperative (`Nodig`)
- Speaker: `Golden Ass`
- EN: `Now invite everyone to sing with us.`
- NL: `Nodig nu iedereen uit om met ons te zingen.`
- Drift: Same as J4. ge/gij imperative would be `Nodigt`.
- Proposed: needs Tom decision — see J4.

### J41 vs J46 — §6.7 / §7.3.1 — Parliament cap inconsistency within speech
- Speaker (both): `Cole-Machine`
- EN J41: `These donkeys are occupying your Parliament building.`
- NL J41: `Die Ezels bezetten uw parlementsgebouw.`
- EN J46: `And if you let them stay, then you'll lose your Parliament...`
- NL J46: `En als ge ze laat blijven, dan verliest ge uw Parlement en dan voelt ge u bedreigd...`
- Drift: EN caps `Parliament` in both. NL caps `Parlement` solo (J46) but lowercases `parlementsgebouw` (J41 compound). The same referent (Mecha's Parliament) appears at two different cap-states in adjacent lines. Standard Dutch usage does typically lowercase compound common nouns even when the head refers to an institution (`parlementsgebouw` is allowed lc), so this may be acceptable, but the EN parallel emphasis is lost. §7.3 game-system list doesn't include `Parlement` explicitly. VERIFY level.
- Proposed: needs Tom decision — accept Dutch idiom (status-quo) or normalize both to caps for EN-parallel emphasis (`uw Parlementsgebouw` in J41).

### J85 / J86 — §13 — `Clearly` → `Het lijkt me dat` softens EN
- Speaker: `Mme. Derriere`
- EN J85: `Clearly some misguided radicals broke into my Factory and haphazardly set these donkeys loose onto our beautiful city.`
- NL J85: `Het lijkt me dat ongure radicalen in mijn Fabriek zijn ingebroken, en de Ezels hebben losgelaten op onze prachtige stad.`
- EN J86: `Clearly some misguided radicals BLEW UP my Factory and haphazardly set these donkeys loose onto our beautiful city.`
- NL J86: `Het lijkt me dat ongure radicalen mijn Fabriek hebben OPGEBLAZEN, en de Ezels hebben losgelaten op onze prachtige stad.`
- Drift: EN `Clearly` = emphatic certainty (Derriere's blame-deflection rhetoric). NL `Het lijkt me dat` = "it seems to me that" — soft/uncertain. Loses Derriere's pompous-confident performance. Also `misguided radicals` → `ongure radicalen` ("shady radicals") — `misguided` carries the patronizing "led astray" sense Derriere uses; `ongure` is "unsavoury/shady". Minor semantic shift. NOTE level.
- Proposed: needs Tom decision — `Uiteraard hebben…` / `Het is duidelijk dat…` for `Clearly`; `misleide radicalen` for `misguided` would be more EN-faithful, but `ongure radicalen` works idiomatically. Tom may keep status-quo.

## Result

7 findings logged. 2 high-priority §13 added-vocative bugs (J28, J66) match the Tom-flagged J56 precedent and are clear drift candidates. 3 §5.4 candidates on Golden Ass imperatives (J4/J5/J25) need a Tom register-exception decision (archaic-divine vs §5.4). 2 lower-priority cross-cell / semantic-softening notes (J41/J46, J85/J86) are VERIFY/NOTE level.

Sheet otherwise clean: no §12.4 English bleed, no §3.1 place-name drift (Technopolis canonical throughout), no §14.1.1 slogan deviations (J109/J111 `EZELS EERST!` canonical, no Old-Ass long-form chant in scope), no §7.3 game-system lc cap drift detected, no §9.3 terminal-punct drift outside the already-locked J81/J110 push cells, no §1 codex-voice drift on Cole-Machine/Big Ass/Hard Ass/Mme. Derriere/Hee/Haw cells. Cole's `godverdomme` insertions (J38/J58/J60/J65/J67/J70/J71/J72/J75) are stylistic and in scope per Cole's `dialectalMarkersAllowed`.
