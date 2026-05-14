# Blind-spot Walk — E6_World_localization

**Date:** 2026-05-12
**Sheet:** `6_asses.masses_E6Proxy.xlsx :: E6_World_localization`
**Cells walked:** 347 (J3–J349)
**Method:** End-to-end cell-by-cell read of `scripts/editorial/walk-sheet.py` dump, checking 8 blind-spot rules that the regex audit cannot programmatically enforce: §12.4 English bleed, §13 broader mistranslations, §5.1 register exceptions, §6.7 cross-cell consistency, §9.3 terminal punctuation, §12.3 Slow Ass stutter, §1 codex voice, §7.3.1 cap/lc collisions.
**Exclusions honored:** deep-eyeball residuals (J39, J49, J75, J93–J113, J188, J194, J196, J197, J206, J209, J217, J260, J282, J292, J302, J325, J336, J340–J344); push-log Tom-decided cells; §12.2 Sturdy motto; SPACER/CUT cells.

---

## Findings (13)

### J304 — §13 mistranslation — pronoun shift `we → je`
- Speaker: Sturdy Ass
- EN: `Comrades, I think we need to remember that—`
- NL: `Kameraden, ik denk dat je moet onthouden dat—`
- Drift: EN first-person plural `we need to remember` becomes NL second-person singular `je moet onthouden`. The pronoun and inclusion are inverted: EN is collective ("we [the herd] need to remember"), NL is accusatory ("you [singular] need to remember"). The line is Sturdy speaking to the assembled Comrades; "we" is canonically inclusive. The "je" singular also doesn't agree with "Kameraden" (plural vocative).
- Proposed: `Kameraden, ik denk dat we moeten onthouden dat—` (or `…dat wij moeten onthouden dat—`). Matches EN first-person plural and agrees with the plural vocative `Kameraden`.

### J326 — §13 / typo — non-standard contraction `Ist`
- Speaker: Sturdy Ass
- EN: `Isn't that right, Comrade Hard?`
- NL: `Ist dat niet waar, Kameraad Bikkelharde?`
- Drift: `Ist` is non-standard Dutch and the only occurrence of this form in the entire 11-workbook corpus (grep-confirmed). Looks like a typo where intended form was either `Is dat niet waar` (standard) or `Is 't dat niet waar` (with apostrophe-contraction). The bare `Ist` is neither — reads as either a missing-space or a missing-apostrophe.
- Proposed: `Is dat niet waar, Kameraad Bikkelharde?` (standard) — or, to keep a contracted feel, `'t Is niet waar zeker, Kameraad Bikkelharde?`. Tom decision.

### J251 — §1 codex voice — Thirsty forbidden marker `GODVERDOMS`
- Speaker: Thirsty Ass
- EN: `A GODDAMN PARTY!`
- NL: `EEN GODVERDOMS FEESTJE, HÉÉ!`
- Drift: Per `codex_verified.json` Thirsty Ass — `dialectalMarkersForbidden: ['godverdomme']`; `dialectalMarkersAllowed: [..., 'godverdoemme', 'godver', 'doeme', 'gedoemme']`. Adjective form should match the allowed `-oe-` family: `godverdoemse` (not `godverdoms`). `godverdomme/godverdomse` is reserved for Bad Ass and others; Thirsty's lock is the `-oe-` variant. Cross-cell within E6_World J336 Thirsty uses `godverdoemme` correctly, so J251 is the outlier.
- Proposed: `EEN GODVERDOEMS FEESTJE, HÉÉ!` (or `EEN GODVERDOEMSE FEESTJE`, both `-oe-` family — Tom pick).

### J246 — §1 codex voice — Thirsty `jouwe` (forbidden je/jij possessive)
- Speaker: Thirsty Ass
- EN: `SAD ASS! I got a pail with yer name on it!`
- NL: `TRIESTIGE EZEL! Ik heb nen emmer me jouwe naam erop, héé!`
- Drift: Per Thirsty codex — `pronounsForbidden: ['je', 'jij', 'jou', 'jouw']`. The form `jouwe` is `jouw + e` (je/jij possessive, adjective-agreement). Thirsty consistently uses `oewen / oewe / uwe` in this sheet (e.g., J216: `in oewen strot`, J197: `[oew/oewe]`). The intent here is the Flemish `oewe` ("met oewe naam erop" = "met uw naam erop"). The reading `jouwe` is a register slip toward je/jij forms.
- Proposed: `TRIESTIGE EZEL! Ik heb nen emmer me oewe naam erop, héé!` (preserves Flemish dialect + Thirsty's allowed `oewe` form, parallel to J216).

### J289 — §12.3 Slow Ass stutter — wrong leading consonant `b-b-geloven`
- Speaker: Slow Ass
- EN: `If you can b-believe it—I, surp-prisingly, won Ass of the Week!`
- NL: `Als je het kunt b-b-geloven—ík, tot mijn eigen verb-b-bazing, heb-b Ezel van de Week gewonnen!`
- Drift: `b-b-geloven` violates §12.3 (Tom's J292 push: "leading-consonant rule"). The verb `geloven` starts with `g-`, not `b-`; and the letter `b` does not appear anywhere in `geloven`. Direct parallel to J292 fix where `B-B-VERRADEN` was corrected to `V-V-VERRADEN` because the Dutch leading consonant is `v`, not `b`. Same logic here: should be `g-g-geloven`.
- Proposed: `Als je het kunt g-g-geloven—ík, tot mijn eigen verb-b-bazing, heb-b Ezel van de Week gewonnen!` Note `verb-b-bazing` (internal b on `verbazing`) is OK since `verbazing` contains b — that's the adaptive-mid-word pattern already approved at J282/J295. Only `b-b-geloven` is the hard violation.

### J184 — §13 mistranslation — redundant doubled phrase
- Speaker: Sad Ass
- EN: `Turns out that tending to the memories of our lost loved ones is something I'm really good at...`
- NL: `Blijkt dat ik goed ben in het zorgen voor de herinneringen aan onze verloren geliefden... dat is iets waar ik echt goed in ben...`
- Drift: NL says "goed ben in" once, then "dat is iets waar ik echt goed in ben" — two assertions of the same "I'm good at this". EN says it once. Looks like a translator artifact (merged two attempts). Could be intentional Sad-Ass dwelling/repetition, but reads as duplicate-paste.
- Proposed: `Blijkt dat het zorgen voor de herinneringen aan onze verloren geliefden iets is waar ik echt goed in ben...` (single assertion, matches EN structure). Alternative if dwell-repetition is intentional: keep but rephrase the second clause so it doesn't repeat "goed in" verbatim (e.g., `…dat is iets waar ik bij thuis ben…`). Tom decision.

### J257 — formatting — leading whitespace
- Speaker: Slow Ass
- EN: `I'm supposed to b-b-be a Lion!`
- NL: ` Ik b-b-ben eigenlijk een Leeuw!`
- Drift: NL string begins with a space character before `Ik`. Not a translation issue but a cell-content drift. Likely paste artifact.
- Proposed: `Ik b-b-ben eigenlijk een Leeuw!` (strip leading space).

### J275 — formatting — leading whitespace
- Speaker: Slow Ass
- EN: `You wouldn't have b-believed your eyes!`
- NL: ` Je zou je ogen niet geloofd heb-b-ben!`
- Drift: Same as J257 — leading space before `Je`. Paste artifact.
- Proposed: `Je zou je ogen niet geloofd heb-b-ben!` (strip leading space).

### J191 — §5.1 register exception — Sad `uzelf` outside listed exception
- Speaker: Sad Ass
- EN: `Take care, Comrade.`
- NL: `Pas goed op uzelf, Kameraad.`
- Drift: Sad Ass is je/jij per codex. `registerExceptions` lists only (a) "uncle-style 3rd-person address to children" with `uw` (E3_Mine1F) and (b) "formal/cold battle register" with `u/uw` (E6_BattleHard). The J191 context — Sad gently farewelling Sturdy as Comrade — fits neither listed exception. However, `Pas goed op uzelf` is a fixed Dutch courtesy formula that often uses u/uw even from je/jij speakers, so this may be a phrase-level conventional exception Tom has accepted. Flagging as VERIFY only.
- Proposed: Either (a) keep as conventional-courtesy `Pas goed op uzelf, Kameraad.` and add a codex exception line for Sad, OR (b) shift to je/jij agreement: `Pas goed op jezelf, Kameraad.`. Tom decision; (a) is the lighter-touch and preserves Sad's tender register.

### J67 / J84 / J88 — §6.7 cross-cell consistency — three NL renderings of same EN `FINE...`
- Speaker: 51 / 63 / 65 (MENU dialogue options — Foal voice)
- EN (all three): `FINE...`
- NL J67: `OKÉ DAN...`
- NL J84: `GOED DAN...`
- NL J88: `PRIMA...`
- Drift: Same English source, three different Dutch renderings within the same sheet across three decision-tree branches (1.1 / 3.1 / 4.1). Per §6.7, identical EN should map to consistent NL unless context differs. Here the context is identical (Foal teen capitulation to Sturdy's "no"). The variation reads as translator inconsistency rather than intentional escalation. Possible Tom-intended: increasing impatience across iterations — but if so, the ordering should be calibrated (currently `OKÉ DAN → GOED DAN → PRIMA` is not an obvious escalation).
- Proposed: Pick one and apply across all three: `GOED DAN...` (or `OKÉ DAN...`). Or if intentional escalation is desired, document the order in canon. Tom decision.

### J319 — §9.3 terminal punctuation — EN `?` vs NL `?!`
- Speaker: Sturdy Ass
- EN: `Who else has been keeping dirty secrets?`
- NL: `Wie heeft er hier nog vuile geheimen zitten verzwijgen?!`
- Drift: NL adds emphatic `!` after the `?`. EN is a plain question. The §9.3 stylistic-exception clause allows minor punct-shift but typically the §9.3 exception covers `!? → !` contraction, not `? → ?!` addition. Sturdy is escalating the accusation tone here (J318–J320 sequence), so `?!` could be intentional. Flagging as NOTE / VERIFY.
- Proposed: Either revert to `…verzwijgen?` (match EN) or keep `?!` if intended escalation tone. Lower-priority — reads naturally either way. Tom decision.

### J124 — §13 — article drop "The Foal" → "Veulentje"
- Speaker: Sturdy Ass
- EN: `The Foal can be a real hoof-full sometimes.`
- NL: `Veulentje kan soms echt een hoefvol zijn.`
- Drift: EN treats `The Foal` as a definite-noun reference (= `Het Veulentje`). NL drops the article entirely. Other cells in this sheet use `'t Veulentje` (J116) or `mijn Veulentje` (J340/J341) when referring to the Foal in 3rd person. Bare `Veulentje` without article is irregular.
- Proposed: `Het Veulentje kan soms echt een hoefvol zijn.` (or `'t Veulentje` to match Sturdy's contraction habits). Mild — could also be read as informal Flemish drop. NOTE level.

### J334 — §13 — semantic shift "lost sight of" → "was vergeten"
- Speaker: Hard Ass
- EN: `I lost sight of the reason I was fighting in the first place.`
- NL: `Ik was vergeten waarvoor ik eigenlijk vocht.`
- Drift: EN `lost sight of` (let slip from view / lose track of) maps to NL `uit het oog verloren`, not `was vergeten` (had forgotten). The two are close but distinct: "losing sight" implies a gradual drift; "had forgotten" implies blank absence. Hard Ass is in remorseful introspection here, so "lost sight" matches the gradual-drift sense better. Mild paraphrase.
- Proposed: `Ik had het uit het oog verloren waarvoor ik eigenlijk vocht.` (preserves the "drifting away" semantics). Alternative: keep `vergeten` if Tom prefers the simpler register. NOTE level.

---

## Severity tally

- **HIGH (bug / §13 mistranslation / forbidden-marker)**: J304, J326, J251, J246, J289 — 5 cells
- **MEDIUM (formatting / redundancy)**: J184, J257, J275 — 3 cells
- **LOW (register exception VERIFY / cross-cell / NOTE)**: J191, J67/J84/J88, J319, J124, J334 — 5 findings (J67/84/88 grouped)

## Result

13 findings (within 30-cap), top severity tier is **5 HIGH-priority cells** (J304, J326, J251, J246, J289). Most consequential is **J304** (pronoun mistranslation `we → je` breaks plural-vocative agreement and inverts inclusivity).
