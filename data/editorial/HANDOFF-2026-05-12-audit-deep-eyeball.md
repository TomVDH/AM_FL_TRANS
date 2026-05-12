# Handoff — Comprehensive + Deep-Eyeball Audit 2026-05-12

**For:** remote machine operator (next session, Patrick, or future-Tom)
**Date:** 2026-05-12
**Canon SHA at audit time:** `24c0df0`
**Workbooks audited:** `excels/0_*` through `excels/10_*` (E0–E10, all 106 sheets, 4,399 NL cells)
**Push log loaded:** 241 unique pushed cells (E0–E10)

---

## What this handoff covers

This audit produced **two complementary deliverables** plus tooling. Neither modifies any xlsx or canon file — they are diagnostic / logging artefacts.

1. **Comprehensive regex pass** (machine-checkable rules — §2/§3/§7/§8/§9/§10/§12/§14, alignment heuristics, push-log cross-reference).
2. **Deep eyeball pass** (rules the scanner cannot catch — §1 codex voice, §5.1 register exceptions, §6.7 cross-sheet consistency, §6.9 Plan vs afspraak, §7.3.1 cap/lc collisions, §9.3 terminal punctuation, §12.3 stutter, §12.4 English bleed, §13 broader mistranslations).

---

## Files generated (all under `data/editorial/`)

### Comprehensive regex audit

| File | Purpose |
|---|---|
| `audit-2026-05-12-comprehensive-INDEX.md` | Master totals, per-rule tally, HARD-LOCK+BUG triage, push-divergence section, scanner blind-spots disclosure |
| `audit-2026-05-12-E0.md` … `audit-2026-05-12-E10.md` | Per-episode findings (one file per workbook) — every sheet either has its findings or is marked `0 findings ✓` |

### Deep eyeball audit

| File | Purpose |
|---|---|
| `audit-2026-05-12-deep-eyeball.md` | 1,498-line per-episode, per-sheet, per-cell walk. Each flagged cell shows verbatim EN + NL + speaker + canon rule + DRIFT/VERIFY/NOTE severity tier. Master totals table at bottom. |

### Tooling (under `scripts/editorial/`)

| File | Purpose |
|---|---|
| `comprehensive-audit.py` | The regex-pass orchestrator (replays whenever rules change). Reads canon + push log, writes the INDEX + 11 per-episode reports. |
| `deep-dump.py` | Per-sheet cell-dump helper. `python3 scripts/editorial/deep-dump.py <ep_num> <sheet_name>` prints every NL-non-empty cell with EN + NL + speaker + push-status. Used by humans during the deep eyeball pass. |

---

## Headline numbers

**Comprehensive regex pass:**
- Episodes: 11 / Sheets: 106 / NL cells: 4,399
- Canon findings: 20 (3 HARD-LOCK, 9 BUGS, 8 CAP/STYLE)
- Alignment per-cell flags: 10
- Cross-row paste candidates: 0
- **Push-divergence cells: 0/241** — every push in `_PUSH-LOG.md` is intact in `excels/`. Confirms canon §19's "0-diff round-trip" claim.
- Clean sheets: 88/106 (83 %)

**Deep eyeball pass:**
- DRIFT (clear deviation): **124**
- VERIFY (anomaly worth Tom's eye): **44**
- NOTE (observation, not actionable alone): **72**
- All 11 episodes walked end-to-end. Five large sheets re-walked at the end (E6_World 347, E10_Government 272, E4_AstralPlaneMain 234, E5_ZooMain 231, E10_ProphetSpeech 105) — yielding +32 DRIFT items the initial sample missed.

---

## Top cross-corpus drift patterns (highest leverage for fixes)

| # | Pattern | Cells affected | Canon rule |
|---|---|---|---|
| 1 | `Stenen-spel` / `STENEN-SPEL` instead of canonical `Keien-Spel` | 8+ (E3, E6, E9, E10) | §8 game-name compound |
| 2 | `Mensen` lowercase in game-system contexts | 10+ (E1, E2, E4, E6) | §7.3 |
| 3 | `Plan` / `Protest` / `Revolutie` lowercase | 5+ (E1, E2, E4) | §7.3 |
| 4 | Pre-uprising `jobs` lowercase (context-sensitive) | 5+ (E0, E1, E2, E4) | §6.16 |
| 5 | English bleed — `Please`, `Let's go`, `Feel The Love`, `team`, `loser`, `Fuck`, `shortcuts`, `single player`, `act`, `move`, `soft`, `success`, `Wise Ass` left untranslated | 12+ | §12.4 |
| 6 | Spelling typos — `Groffe`, `Excema`, `AFLVERING`, `kloteweeer`, `ratioenen`, `rotsbloki`, `belangan` (×3), `gëinspireerd`, `knieëen`, `success`, `nauwelijk`, `electriciteit`, `goddelijk`, `Niewelingetjes`, `kameraaden`, `aangesjokd`, `bengt`, `Boederij`, `rigoreus`, `gelukt`, `allebeide`, `GOEDEAVOND` | 22+ | various |
| 7 | Dutch grammar errors — wrong d/t, adj-agreement, subject-verb agreement, wrong relative pronoun, broken syntax | 10+ | grammar |
| 8 | Cross-sheet inconsistency — same EN with different NL across sheets (Hard's "rock bottom" aphorism, `Endure`, `respond` battle UI, "show how it's done", `DON'T BE SCARED!`) | 5+ | §6.7 |
| 9 | `Café` missing acute accent (`Cafe` / `CAFE`) | 3+ | spelling |
| 10 | `Muilegem` non-canonical place name (canon §3.1 lock is `Muilenbeek`) | 2 (E10_Government J68, J100) | §3.1 |
| 11 | `Poepegaatje` for bar (canon §1 v3.5 sync — should be `De Zatten Ezel`) | 1 (E10_Government J110) | §1 codex sync |
| 12 | `Wise Ass` left untranslated as English | 2 (E4_AstralPlaneMain J234, J235) | §4 character monikers |
| 13 | Slow-Ass stutter consonant mismatch on V-verbs | 1 (E6_World J292) | §12.3 |

---

## Confirmed-intentional findings (NO ACTION NEEDED)

These were flagged by the audit but the push log or codex confirms they're canon:

- **§4.4 Schoon Beest** (3 cells: E1_Farm J29, E2_World_A1 J46, E4_HerdSplits J62) — push-log confirms Thirsty→Nice exception. Preserve.
- **§17 Q19 Resentful Ass `gij+uw`** (E7_Holding2 J18) — push-log confirms Q19 addendum.
- **§23 Sturdy 3-adj motto** (E9_BadCave J43) — EN co-authoritative; canon §23 accrual.
- **§12.2 Sturdy motto split across rows** (E9_MineEscape J18–J21) — intentional dialog beats.
- **Cole-Machine "godverdomme" insertions in E10_ProphetSpeech** — register choice for Cole's Flemish-activist voice.
- **§9.6 Foal diary contracted `'k` at E3_100 J3 + E3_300 J7** — flagged by regex as drift; canon §9.6 actually says diary sheets should use uncontracted `Ik`. **These ARE real drift.** Not in this confirmed-intentional list.

---

## Recommended remote-machine workflow

1. **Read INDEX first** — `audit-2026-05-12-comprehensive-INDEX.md` for the regex pass overview + triage block.
2. **Walk per-episode regex findings** — `audit-2026-05-12-E{N}.md` files are concise; spot-check the cells against the live remote sheets.
3. **Use deep-eyeball doc for non-regex drift** — `audit-2026-05-12-deep-eyeball.md` per-episode sections. Each cell shows verbatim EN + NL + canon citation. Severity tiers: **DRIFT** (clear deviation), **VERIFY** (Tom's eye), **NOTE** (observation only).
4. **Prioritize by leverage** — start with the table-pattern rows above (Stenen-spel rename, Mensen/Plan/Protest caps, spelling typos batch, English-bleed cleanup, then cross-sheet consistency).
5. **Replay the regex audit** any time canon or push log changes:
   ```bash
   python3 scripts/editorial/comprehensive-audit.py
   ```
   This regenerates the INDEX + 11 per-episode files in seconds.
6. **Dump a single sheet for deep review:**
   ```bash
   python3 scripts/editorial/deep-dump.py 5 E5_CircusMain_localization
   ```
   Output is markdown-formatted; pipe to `less` or redirect to a temp file.

---

## What the audit DID NOT do (by design)

- **No xlsx edits.** The `M excels/*.xlsx` modifications visible in `git status` predate this session.
- **No canon edits.** `_CANON.md` was read-only.
- **No commits to the push log.** Push log was parsed read-only.
- **No Google Sheets pushes.** All findings are local-only proposals for review.

The audit operated against the local `excels/` tree only. To re-audit against a fresh remote pull, first pull into a side directory (`excels.fresh-pull-2026-05-12-handoff/`) and update the orchestrator's `REPO` constant or pass a workbook override; then diff against current findings.

---

## Critical caveats for remote machine

- **Codex sync v3.4 → v3.5 is pending.** Findings derived from canon §1 (e.g., Miner Jenny ge/gij flip, Helpful Ass register, Sick Ass mute) may need to be re-checked once the codex JSON is updated. The deep-eyeball doc flags these explicitly.
- **Resentful Ass gij+uw exception** (Q19 addendum, 2026-05-12) is whitelisted in the orchestrator. Do not "fix" Resentful's gij→je.
- **Foal mixed register** is whitelisted — Foal can use either ge/gij or je/jij depending on intimate-vs-formal context.
- **Sick Ass is mute** except E6_Nightmare J48 (`Omdraaien.`) — do not flag her cells for register drift.
- **E11 is out of scope** (canon §19/Q5 deferred — 52 Italian-fallback NonCSV cells + missing E10_Words_Dutch sheet).

---

## Replaying the audit on the remote machine

```bash
# 1. Ensure Python + openpyxl are available
python3 -c "import openpyxl; print('openpyxl', openpyxl.__version__)"

# 2. From repo root, re-run the regex pass (idempotent)
python3 scripts/editorial/comprehensive-audit.py

# 3. (Optional) re-run only a specific episode
python3 scripts/editorial/comprehensive-audit.py 6     # just E6

# 4. Dump a sheet for human review
python3 scripts/editorial/deep-dump.py 10 E10_Government_localization

# 5. Cross-reference with push log
grep -n "Muilenbeek" data/editorial/_PUSH-LOG.md
grep -n "Keien-Spel" data/editorial/_CANON.md

# 6. Verify everything is clean before pushing fixes
git status --short data/editorial/
```

---

## Next session priorities (suggested)

In rough order of impact:

1. **Spelling-typo sweep** — 22+ cells across episodes (low ambiguity, high yield).
2. **`Stenen-spel` → `Keien-Spel` rename** — 8+ cells in E3/E6/E9. Single search/replace per workbook.
3. **`Mensen` cap pass** — 10+ cells in dialogue. Per §7.3.
4. **`Muilegem` → `Muilenbeek`** — E10_Government J68 + J100. Two-cell fix.
5. **`Café` accent** — E3_BadCave J82, E6_World J196 + J206. Three cells.
6. **`belangan` → `belangen`** — E1_TheProtest J67 + J69, E4_AstralPlaneMain J71. Three cells.
7. **English-bleed audit** — review each cell tagged §12.4 individually; some may be intentional gaming/character voice (`Game Over`, `chillax`).
8. **Cross-sheet consistency** — pick a canonical NL for each repeated EN phrase and propagate (Hard's aphorism, `Endure`, etc.).
9. **Grammar fixes** — d/t spelling, adj-agreement, subject-verb agreement, broken syntax. Lower yield per cell but corpus-quality lift.

After fixes land, replay the regex audit and commit:
```bash
python3 scripts/editorial/comprehensive-audit.py
git add data/editorial/audit-2026-*.md excels/
git commit -m "fix(editorial): post-deep-eyeball sweep — N cells (see audit-2026-05-12-*)"
```

---

## Contact / authority

- **Canon authority:** Tom (per `_CANON.md` §0).
- **Push log:** Patrick (remote) + Tom (local sweeps) — see `_PUSH-LOG.md`.
- **Audit deliverable owner:** This handoff is the audit artefact. Edits to the .md files are fine; they're diagnostic snapshots.

Run the deep-dump tool any time a cell needs verbatim re-read. The audit will not invent or paraphrase — every EN + NL quoted comes straight from `openpyxl` reads of the xlsx.
