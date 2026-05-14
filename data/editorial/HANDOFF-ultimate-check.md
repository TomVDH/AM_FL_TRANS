# HANDOFF — Ultimate Canonical-State Check

_Date: 2026-05-13 — branch: `am-analysis` — most recent commit: `09d9315`_

## Your job

You are a fresh Claude session brought in to perform the **final, independent verification** that the `am-fl-trans` editorial corpus is at canonical state. The previous session completed two large editorial arcs (deep-eyeball + blind-spot walk, 207 cells fixed across 12 commits) and is asking you to confirm everything sticks before declaring the work done.

**You are not editing anything.** This is a logging-only / verification-only task. Do NOT run `apply-fixes`, do NOT push to remote, do NOT commit. Read-only verification.

## Context

- **Project:** `/Users/tomlinson/Projects/VIBE CODING/am-fl-trans`
- **Workbooks:** 11 xlsx files (E0–E10) in `excels/` — Flemish-Dutch localization of the game `asses.masses`
- **NL column:** column J
- **Source-of-truth:** local xlsx mirrors live Google Sheets; both should be in sync
- **Editorial owner:** Tom Vanderheyden (`tom.vanderheyden@pm.me`)
- **Canon:** `data/editorial/_CANON.md` (rule book)
- **Codex:** `data/json/codex_verified.json` (per-character voice rules, v3.4)
- **Push log:** `data/editorial/_PUSH-LOG.md` (append-only history of every batch)

## What was just done (since the deep-eyeball doc)

### Arc 1: Deep-eyeball DRIFT batches (122 cells / 8 commits)
The deep-eyeball doc `audit-2026-05-12-deep-eyeball.md` (1498 lines) flagged 124 DRIFT cells across 11 episodes. Per-episode batches in descending DRIFT order: E5 (24), E4 (23), E1 (17+4 slogan retcon), E2 (14), E6 (13), E10+E3 combined (14), FINAL combined E0+E5+E6+E7+E8+E9 (13). All round-tripped, all audits closed to 0 deep-eyeball DRIFT.

### Arc 2: Blind-spot walk batches (85 cells / 4 commits)
The regex audit has known blind spots — canon rules it can't programmatically enforce (§1 codex voice, §5.1 register exceptions, §12.4 English bleed, §13 mistranslations, §6.7 cross-cell, §12.3 stutter, §9.3 punct, §7.3.1 cap collisions). Five focused agent-walks on high-traffic sheets (E6_World 347, E10_Government 272, E4_AstralPlaneMain 234, E5_ZooMain 231, E10_ProphetSpeech 105 — 1,189 cells total) surfaced 99 new findings; 85 applied + 14 kept per Tom decisions.

### Canon policy locked this round
- **§5.1 Golden Ass archaic-divine register exception** — bare-stem imperatives (`Spreek`, `Win`, `Nodig`) kept for biblical/solemn cadence. §5.4 sweep does NOT apply to Golden Ass.
- **§5.4 ge/gij imperative sweep** applies to: Helpful, Edgy, Kick, Big, Hard, Cole-Machine. NOT Golden Ass.
- **§13 added-vocative drop precedent** — `kameraad/Kameraden` insertions where EN has no vocative are systematically dropped.

## How to run the check

```bash
cd "/Users/tomlinson/Projects/VIBE CODING/am-fl-trans"
python3 scripts/editorial/ultimate-check.py
```

The script:
1. Pulls a fresh remote snapshot (`excels.fresh-pull-2026-05-13-ULTIMATE/`) and diffs against local — expects **0 J-column diffs across all 11 workbooks**
2. Runs `comprehensive-audit.py` on all 11 episodes
3. Compares audit findings to a hardcoded `KNOWN_RESIDUALS` list — expects every finding to match the known list, **0 unexpected NEW drift**
4. Spot-checks 20 recently-pushed cells local-vs-remote — expects **20/20 match**
5. Writes a PASS/FAIL report to `data/editorial/ultimate-check-report.md`

**Exit code 0 = PASS, exit code 1 = FAIL.**

## What "PASS" looks like

```
Local↔Remote diffs:         0
Audit canon findings:       14 (expected 13–14)
  - matches known residuals: 14
  - UNEXPECTED (NEW drift):  0
  - missing expected:        0 or 1
Push divergences:           1
  - matches known:           1
  - UNEXPECTED divergences:  0
Spot-check:                 20/20

✓✓✓ PASS — corpus is at canonical state ✓✓✓
```

## What "FAIL" looks like and how to interpret

- **Local↔Remote diffs > 0** — someone edited the remote between local-save and now. Investigate which cells, check Patrick/Tom edit history.
- **UNEXPECTED NEW drift** — the audit surfaced canon findings NOT in the `KNOWN_RESIDUALS` list. Either (a) a rule was tightened and old cells now violate, or (b) someone wrote a cell that regressed. **Report cell list and let Tom triage.**
- **Missing expected residuals** — a previously-flagged residual is no longer flagged. Probably benign (someone fixed it), but flag for Tom so he knows the residual list shrunk.
- **Spot-check mismatch** — local doesn't match remote for a recently-pushed cell. Indicates either push didn't take, or remote was re-edited. Triage.

## Known intentional residuals (the script's expected list)

These 14 cells are EXPECTED to show in the audit because they are:
- canonical (Schoon Beest §4.4)
- intentional design (Sturdy motto §12.2 speaker-fragments)
- Tom-decided keep (J25/J71 ge/gij)
- scanner false-positive (§9.6 diary rule misfires on SAY.Dialog)

| Cell | Rule | Reason |
|---|---|---|
| E1 `E1_Farm` J29 | §4.4 | Schoon Beest PUSHED-BEFORE |
| E2 `E2_World_A1` J46 | §4.4 | Schoon Beest PUSHED-BEFORE |
| E4 `E4_HerdSplits` J62 | §4.4 | Schoon Beest PUSHED-BEFORE |
| E2 `E2_World_A1` J25 | §5.4 | Tom-kept chant-style `Stop` |
| E6 `E6_Nightmare` J71 | §7.1 | Tom-kept colloquial-generic `ezel` (Thirsty in Hard's nightmare) |
| E3 `E3_100` J3 | §9.6 | False-positive (SAY.Dialog) |
| E3 `E3_300` J7 | §9.6 | False-positive (SAY.Dialog) |
| E6 `E6_World` J142 | §12.2 | Sturdy motto fragment |
| E9 `E9_MineEscape` J18 | §12.2 | Sturdy motto fragment |
| E9 `E9_MineEscape` J19 | §12.2 | Sturdy motto fragment |
| E9 `E9_MineEscape` J20 | §12.2 | Sturdy motto fragment |
| E9 `E9_MineEscape` J21 | §12.2 | Sturdy motto fragment |
| E9 `E9_BadCave` J43 | §12.2 | Sturdy motto fragment |
| E9 `E9_BadCave` J68 | §12.2 | Sturdy motto fragment |

Plus 4 expected push-divergences (current value differs from first-pushed value because subsequent Tom-decision pushes superseded):
- E5 `E5_ZooMain` J91 — Tom kept English `success` per editorial call
- E5 `E5_ZooMain` J4 — re-edited after initial push
- E5 `E5_ZooMain` J190 — `knus`→`gezellig` (blind-spot unify)
- E10 `E10_Government` J252 — `mensen`→`Mensen` (blind-spot cap)

Plus ~10 LEN-RATIO false-positives across the corpus (terse Flemish vs verbose EN — by-design, scanner over-flags).

## Reference files

- `data/editorial/_CANON.md` — the rule book
- `data/json/codex_verified.json` — per-character voice rules (v3.4)
- `data/editorial/_PUSH-LOG.md` — append-only history of every batch (read tail to see latest)
- `data/editorial/audit-2026-05-12-comprehensive-INDEX.md` — last regex audit summary
- `data/editorial/audit-2026-05-12-deep-eyeball.md` — original 1498-line per-cell walk
- `data/editorial/blind-spot-walk-INDEX.md` — blind-spot walk INDEX
- `data/editorial/blind-spot-walk-E{4,5,6,10}_*.md` — per-sheet blind-spot findings
- `scripts/editorial/comprehensive-audit.py` — full-corpus regex audit
- `scripts/editorial/ultimate-check.py` — this verification script (the one you'll run)
- `scripts/convert/pull-snapshot.py` — fresh-pull script
- `scripts/convert/push-file.py` — DO NOT USE for this check

## Recent commits (for context — newest first)

- `09d9315` E10 blind-spot — Gov+ProphetSpeech (34 cells)
- `cba6689` E6 blind-spot — World (13 cells)
- `ae9f2f9` E5 blind-spot — ZooMain (21 cells)
- `a4dea04` E4 blind-spot — AstralPlaneMain (17 cells)
- `b1ad052` FINAL — deep-eyeball queue close (13 cells)
- `2b985b1` E10+E3 combined (14 cells)
- `661aebb` E6 deep-eyeball (13 cells)
- `b32232c` E2 deep-eyeball (14 cells)
- `85a34e4` E4 deep-eyeball (23 cells)
- `bd686ca` E1 deep-eyeball (17 cells)
- `a9887e2` slogan retcon (4 cells)
- `3aa1000` E5 deep-eyeball (24 cells)

## Reporting back

When done, summarize to Tom in this format:

```
ULTIMATE CHECK — [PASS|FAIL]

• Local↔Remote: <N> J-column diffs
• Audit canon: <N> findings (<N> known / <N> unexpected / <N> missing)
• Push-divergence: <N> cells (<N> known / <N> unexpected)
• Spot-check: <N>/20 ok

[If FAIL, list the unexpected findings + suggested triage]

Report file: data/editorial/ultimate-check-report.md
```

If PASS — declare the corpus canonical and the editorial arc complete.
If FAIL — list the unexpected items, classify each (bug / new rule / regression), and propose next steps. Do NOT auto-fix; surface to Tom first.

## Standing constraints (Tom's preferences)

- **Always show full EN + NL strings** in any per-cell readout. Never truncate.
- **EN is co-authoritative** — a Dutch translation that doesn't match the EN loses, even if grammatically clean.
- **No language invention** — every proposed fix must be grounded in canon or codex; ambiguous cases flagged for Tom decision.
- **Chunk per sub-tab** when output is large.
