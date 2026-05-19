# Comprehensive Canon-Adherence Audit — 2026-05-12

_Canon SHA: `24c0df0` — Codex: `data/json/codex_verified.json` v3.4 (v3.5 sync pending) — Push log: `data/editorial/_PUSH-LOG.md` (347 unique pushed cells)_

## Scope

- Source: local `excels/` (no fresh pull performed; reflects committed/staged local state)
- Episodes: E0–E10 (E11 deferred per canon §19/Q5)
- Cells scanned: column J (Dutch) where non-empty
- Tooling: unified rule scanner (e10_sweep_scan ruleset + §5 register drift from e6 + §13.5/§15.6 additions) + alignment heuristics (length-ratio, empty-NL, cross-row paste) + push-log cross-reference (per-finding push history + current-vs-pushed divergence detection)
- This is a **logging pass**; no xlsx edits, no commits.

## Totals

- Episodes scanned: **11**
- Sheets scanned: **106**
- NL cells scanned: **4399**
- Canon findings: **14**
- Alignment per-cell flags: **10**
- Cross-row paste candidates: **0**
- Push-divergence cells (current ≠ pushed): **3**
- Pushed cells in log: **347**
- Clean sheets: **88/106**

## Per-episode summary

| Episode | Sheets | Cells | Canon | Align (cell) | Cross-row | Push-diverge | Clean | Report |
|---|---|---|---|---|---|---|---|---|
| E0 (Manager+Intermissions+E0Proxy) | 9 | 248 | 0 | 1 | 0 | 0 | 8/9 | [audit-2026-05-12-E0.md](audit-2026-05-12-E0.md) |
| E1 (E1Proxy) | 12 | 416 | 1 | 1 | 0 | 0 | 10/12 | [audit-2026-05-12-E1.md](audit-2026-05-12-E1.md) |
| E2 (E2Proxy) | 15 | 377 | 2 | 1 | 0 | 0 | 13/15 | [audit-2026-05-12-E2.md](audit-2026-05-12-E2.md) |
| E3 (E3Proxy) | 10 | 380 | 2 | 1 | 0 | 0 | 7/10 | [audit-2026-05-12-E3.md](audit-2026-05-12-E3.md) |
| E4 (E4Proxy) | 9 | 435 | 1 | 0 | 0 | 0 | 8/9 | [audit-2026-05-12-E4.md](audit-2026-05-12-E4.md) |
| E5 (E5Proxy) | 7 | 592 | 0 | 4 | 0 | 2 | 5/7 | [audit-2026-05-12-E5.md](audit-2026-05-12-E5.md) |
| E6 (E6Proxy) | 8 | 535 | 2 | 0 | 0 | 0 | 6/8 | [audit-2026-05-12-E6.md](audit-2026-05-12-E6.md) |
| E7 (E7Proxy) | 17 | 363 | 0 | 0 | 0 | 0 | 17/17 | [audit-2026-05-12-E7.md](audit-2026-05-12-E7.md) |
| E8 (E8Proxy) | 3 | 96 | 0 | 0 | 0 | 0 | 3/3 | [audit-2026-05-12-E8.md](audit-2026-05-12-E8.md) |
| E9 (E9Proxy) | 5 | 292 | 6 | 1 | 0 | 0 | 2/5 | [audit-2026-05-12-E9.md](audit-2026-05-12-E9.md) |
| E10 (E10Proxy) | 11 | 665 | 0 | 1 | 0 | 1 | 9/11 | [audit-2026-05-12-E10.md](audit-2026-05-12-E10.md) |

## Findings by rule (counts)

| Rule | Count | Tier |
|---|---|---|
| `LEN-RATIO` | 9 | BUG |
| `§12.2` | 7 | CAP/STYLE |
| `§4.4` | 3 | HARD-LOCK |
| `§9.6` | 2 | CAP/STYLE |
| `EMPTY-NL` | 1 | BUG |
| `§5.4` | 1 | CAP/STYLE |
| `§7.1` | 1 | CAP/STYLE |

## Triage — HARD-LOCK and BUG findings (ordered)

- **E1 / E1_Farm_localization / J29** `[§4.4]` `[HARD-LOCK]` `[PUSHED-BEFORE]` — Schoon Beest — verify Thirsty→Nice context (canon §4.4 preserve)
  - Speaker: `∅` | EN: `To be honest, I'd have gon' done it myself, but I wanna be right here when Nice Ass takes a break from her plowin'.` | NL: `Eerlijk gezegd had'k het zelf willen doen, maar 'k zou graag hier zijn wanneer Schoon Beest haar pauzeke pakt.`
  - Push: `[E1FU-001]` 🎯 E1 follow-up (1 cell) — Thirsty Ass nickname restore | rule: `Character-specific nickname: Thirsty Ass uses 'Schoon Beest' for Nice Ass (restore from Patrick's flatten to Lieve Ezel)`
  - Pushed value: `Eerlijk gezegd had'k het zelf willen doen, maar 'k zou graag hier zijn wanneer Schoon Beest haar pauzeke pakt.`
- **E2 / E2_World_A1_localization / J46** `[§4.4]` `[HARD-LOCK]` `[PUSHED-BEFORE]` — Schoon Beest — verify Thirsty→Nice context (canon §4.4 preserve)
  - Speaker: `∅` | EN: `Nice Ass's fine legs can do that run in less than two minutes! Yeehaw!` | NL: `Schoon Beest haar lange benen kunnen dadde in minder dan twee minuten! Da'k ik het ge'zeid heb, héé!`
  - Push: `[E2-041]` 🎯 E2 main sweep (41 cells) | rule: `Character-specific nickname: Thirsty Ass uses 'Schoon Beest' for Nice Ass (restore from Patrick's flatten to Lieve Ezel)`
  - Pushed value: `Schoon Beest haar lange benen kunnen dadde in minder dan twee minuten! Da'k ik het ge'zeid heb, héé!`
- **E4 / E4_HerdSplits_localization / J62** `[§4.4]` `[HARD-LOCK]` `[PUSHED-BEFORE]` — Schoon Beest — verify Thirsty→Nice context (canon §4.4 preserve)
  - Speaker: `∅` | EN: `Nice Ass what are you going to do?` | NL: `Schoon Beest, wat gaat gij doen, héé?`
  - Push: `[E4-001]` 2026-05-12 — E4 push (8 cells across 4 sub-tabs) | rule: `§4.4 / §4.4 exception — Thirsty's signature nickname for Nice Ass preserved.`
  - Pushed value: `Schoon Beest`
- **E0 / CharacterProfiles_localization / J108** `[EMPTY-NL]` `[BUG]` — EN non-empty but NL empty
  - Speaker: `∅` | EN: `Spicy Ass?` | NL: `∅`
- **E1 / E1_TheProtest_localization / J51** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 2.88 outside [0.4,2.5]
  - Speaker: `Attempt to recruit Bad Ass` | EN: `Fuck no.` | NL: `Kust mijn kloten, neen.`
- **E2 / E2_Confession_localization / J75** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 2.83 outside [0.4,2.5]
  - Speaker: `If the Player chooses the wrong eye colour.` | EN: `You don't...` | NL: `Je kan het niet meer herinneren...`
- **E3 / E3_BadCave_localization / J45** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 0.21 outside [0.4,2.5]
  - Speaker: `∅` | EN: `So... Is that why you don't spend more time with the Herd, Uncle Bad Ass?` | NL: `Nonkel Stoere?!`
- **E5 / E5_CircusMain_localization / J206** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 2.80 outside [0.4,2.5]
  - Speaker: `Ringmaster Rico` | EN: `of ROBOTS!` | NL: `...een droomcast van ROBOTS!`
- **E5 / E5_CircusMain_localization / J216** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 0.29 outside [0.4,2.5]
  - Speaker: `Ringmaster Rico` | EN: `Right over there.` | NL: `Daar!`
- **E5 / E5_ZooMain_localization / J68** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 2.55 outside [0.4,2.5]
  - Speaker: `Zookeeper Rose` | EN: `So be loud!` | NL: `Dus zet het huis op stelten!`
- **E5 / E5_ZooMain_localization / J207** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 4.50 outside [0.4,2.5]
  - Speaker: `Smart Ass` | EN: `Hell no!` | NL: `Geen sprake van, joh! Absoluut niet.`
- **E9 / E9_GoldenAss_localization / J149** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 0.39 outside [0.4,2.5]
  - Speaker: `Cole-Machine` | EN: `Pull yourself together.` | NL: `Verman u.`
- **E10 / E10_Credits_localization / J110** `[LEN-RATIO]` `[BUG]` — NL/EN char-ratio 0.35 outside [0.4,2.5]
  - Speaker: `141` | EN: `Radio Host Marcos` | NL: `DJ Tom`

## Findings on previously-pushed cells

_These cells were pushed in a prior editorial sweep (per `_PUSH-LOG.md`) and the audit re-flags them now. Likely either (a) a canon rule was added after the push and re-push needed, or (b) the push intentionally locked a non-canonical value as an exception — check push rule._

- **E1 / E1_Farm_localization / J29** `[§4.4]` `[HARD-LOCK]` — Schoon Beest — verify Thirsty→Nice context (canon §4.4 preserve)
  - Current NL: `Eerlijk gezegd had'k het zelf willen doen, maar 'k zou graag hier zijn wanneer Schoon Beest haar pauzeke pakt.`
  - Pushed: `Eerlijk gezegd had'k het zelf willen doen, maar 'k zou graag hier zijn wanneer Schoon Beest haar pauzeke pakt.` (push `[E1FU-001]` 🎯 E1 follow-up (1 cell) — Thirsty Ass nickname restore)
  - Push rule: `Character-specific nickname: Thirsty Ass uses 'Schoon Beest' for Nice Ass (restore from Patrick's flatten to Lieve Ezel)`
- **E2 / E2_World_A1_localization / J46** `[§4.4]` `[HARD-LOCK]` — Schoon Beest — verify Thirsty→Nice context (canon §4.4 preserve)
  - Current NL: `Schoon Beest haar lange benen kunnen dadde in minder dan twee minuten! Da'k ik het ge'zeid heb, héé!`
  - Pushed: `Schoon Beest haar lange benen kunnen dadde in minder dan twee minuten! Da'k ik het ge'zeid heb, héé!` (push `[E2-041]` 🎯 E2 main sweep (41 cells))
  - Push rule: `Character-specific nickname: Thirsty Ass uses 'Schoon Beest' for Nice Ass (restore from Patrick's flatten to Lieve Ezel)`
- **E4 / E4_HerdSplits_localization / J62** `[§4.4]` `[HARD-LOCK]` — Schoon Beest — verify Thirsty→Nice context (canon §4.4 preserve)
  - Current NL: `Schoon Beest, wat gaat gij doen, héé?`
  - Pushed: `Schoon Beest` (push `[E4-001]` 2026-05-12 — E4 push (8 cells across 4 sub-tabs))
  - Push rule: `§4.4 / §4.4 exception — Thirsty's signature nickname for Nice Ass preserved.`

## Push-divergence — current NL diverges from most-recent pushed value

_Cells where the live xlsx no longer matches what we pushed. Could be Patrick re-edits or later-push supersession. Verify before re-pushing._

- **E5 / E5_ZooMain_localization / J4** — push event: 🎯 E5 Push 4 — deep-eyeball DRIFT batch (24 cells across 4 sub-tabs)
  - Speaker: `(sign)` | EN: `∅`
  - Pushed: `…Worden sinds 7,000 jaar…\` + \`Vinden de regen niet zo fijn`
  - Current: `Leuke weetjes over de Equus Asinus: \n\n- Oorspronkelijk van Afrika\n- Worden tot 50 jaar oud\n- Zeer wendbaar op rotsachtig terrein\n- Worden sinds 7,000 jaar als werkdier gebruikt\n- Vinden de regen niet zo fijn`
  - Push rule: `Dutch subj-verb agreement (plural species)`
- **E5 / E5_ZooMain_localization / J190** — push event: 🎯 E5 Push 4 — deep-eyeball DRIFT batch (24 cells across 4 sub-tabs)
  - Speaker: `Zookeeper Rose` | EN: `∅`
  - Pushed: `De RAAD VAN BESTUUR wil dat jullie ze knus komen Knuffelen!`
  - Current: `De RAAD VAN BESTUUR wil dat jullie ze gezellig komen Knuffelen!`
  - Push rule: `Dutch grammar (wil/ze/komen)`
- **E10 / E10_Government_localization / J252** — push event: 🎯 E10 Push — universal sweep (26 cells)
  - Speaker: `Golden Ass` | EN: `∅`
  - Pushed: `…om U tot de mensen te wenden?`
  - Current: `Bent gij bereid om U tot de Mensen te wenden?`
  - Push rule: `§7.4`

## Scanner blind spots

The following canon sections are NOT programmatically enforced; manual eyeball passes needed:

- **§1 codex voice** — per-character pronoun/contraction/article rules beyond §5. Codex v3.4→v3.5 sync pending: Miner Jenny ge/gij flip, Helpful Ass new entry, Sick Ass mute.
- **§5.1 register exceptions** — Sad/Nice/Slow/Grandma/Foal formal-context u/uw. Resentful Ass `gij+uw` exception (§17 Q19) IS whitelisted; Foal mixed register IS whitelisted; Sick Ass mute IS whitelisted.
- **§6.7 cross-sheet battle-verb consistency** — needs sheet-pivot, no scanner.
- **§6.9 Plan vs afspraak** — EN-driven both-sides check, no scanner.
- **§7.3.1 cap/lc collisions** — `de Mijn` (cap) vs `een mijn` (lc) — context-only.
- **§9.3 terminal punctuation** — matching EN final punct.
- **§12.3 Slow Ass stutter pattern** — Dutch consonants only, not coded.
- **§12.4 English bleed** — no English-word allowlist scanner.
- **§13 broader mistranslations** — only §13.5 Reassignment-Heraanstelling is checked.

## Constraints

- EN + NL printed verbatim per cell. No paraphrase, no language invention.
- Fix proposals come from canon text only; ambiguous cases left as flag.
- All findings are **proposals for review**. No automated push.
