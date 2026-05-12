# Opus Audit v2 — POST-PATRICK Re-Sync 2026-05-10

> **🔄 Supersedes** `_OPUS-AUDIT-COMPLETE-2026-05-10.md` (v1).
> **Source-of-truth shift:** local `excels/` now mirrors live remote (Patrick's truth). All audits re-run against fresh remote pull. Old v1 cell counts are obsolete because they audited pre-merge local data — much of which had row-misalignment damage.

---

## Source-of-truth statement

**Remote = truth.** Local `excels/` is now a mirror of `excels.fresh-pull-2026-05-10/`. `excels/Originals/` also refreshed to live state. Pre-resync local snapshot saved to `excels.local-pre-resync-2026-05-10/` for historical diff only.

Workflow going forward:
1. Pull remote → local mirror
2. Run audits → JSON batch proposals
3. Apply + push to remote
4. Repeat

---

## ⚠️ Locked decisions updated 2026-05-10

| Decision | Old lock | NEW lock | Source |
|----------|----------|----------|--------|
| Sad whimper | `*Boe-hoe-hoe*` (cap B, batch f) | **`*boe-hoe-hoe*`** (lowercase b) | Tom 2026-05-10 — matches Patrick |
| Peek Ass | `Constat-ezel` / `Constat-Ezel` | **`Constaterende Ezel`** | Tom 2026-05-10 — adopt Patrick |
| Region | `Muilenbeek` (extra n, Q3) | **`Muilenbeek`** (extra n) — confirmed | Tom 2026-05-10 — overrides Patrick's `Muilebeek` |
| Patrick precedence | (no policy) | **Substantive content rewrites: defer to Patrick. Mechanical consistency: Opus rules apply on top of Patrick's text.** | Tom 2026-05-10 |

These three decisions are baked into the v2 audit logic.

---

## Total cells flagged: 327 (was 408 pre-resync)

| Episode | Pre-resync (v1) | Post-resync (v2) | Δ |
|---------|-----------------|------------------|----|
| E0 | 22 | 20 | -2 |
| E1 | 43 | 36 | -7 |
| E2 | 60 | 47 | -13 |
| E3 | 40 | 39 | -1 |
| E4 | 27 | **8** | **-19** ← Patrick's heaviest cleanup |
| E5 | 26 | 27 | +1 |
| E6 | 56 | 60 | +4 ← Patrick's rewrites added new drift |
| E7 | 11 | 11 | 0 |
| E8 | 10 | 9 | -1 |
| E9 | 32 | 35 | +3 |
| E10 | 29 | 35 | +6 |
| **TOTAL** | **408** | **327** | **-81** |
| E11 (NonCSV) | ~52 | (unchanged — separate file) | — |

**Reduction explanation:**
- Patrick already implemented many fixes we'd planned (Mechalen→Technopolis on his cells, Constaterende Ezel, J47 phrasing reorder, etc.)
- Patrick fixed the row-misalignment bug — many of our v1 "drift" findings were against ghost data

**Increases explanation (E5/E6/E9/E10):**
- Patrick's rewrites introduced new content with new drift instances (e.g. mentions `Boerderij` he hasn't yet swapped to `Hoeve`, `Machine` not yet `Machien`)
- Muilebeek (his spelling) now flagged as "fix to Muilenbeek" per today's lock

---

## Per-file v2 summary

### E0 (20 cells) — `docs/analysis/E0_Opus_Audit_v2.txt`
- 18 quiz Ezel cap (decision-pending: narrative-text rule)
- 2 Piet-Machine label sync (codex trigger)
- Constaterende Ezel: ✅ Patrick already implemented (no longer flagged)

### E1 (36 cells) — `docs/analysis/E1_Opus_Audit_v2.txt`
- Heaviest sub-buckets: Machine→Machien (~13), Ezel cap (~7), Muilebeek→Muilenbeek (~3), HUDO ×2, slogan ×5 (rephrase), Boerderij→Hoeve (~5)
- Patrick's protest scene rewrites mostly resolved old-moniker drift inline
- Reduction: Schoon Beest/Felle Gast/Betweter cells largely cleaned by Patrick

### E2 (47 cells) — `docs/analysis/E2_Opus_Audit_v2.txt`
- Boerderij→Hoeve still ~16 (Welcome Sign duplicates across A1/A2/B1/B2)
- Schup→Schep (2), HUDO (5–6), Snotezel→Snotje (1), Muilebeek→Muilenbeek (4)
- Battle phrasing decisions: 7 cross-sheet pairs

### E3 (39 cells) — `docs/analysis/E3_Opus_Audit_v2.txt`
- Machine→Machien (~14), Ezel cap (~8 incl. quiz/diary), apostrophe drift (~4), Uncle Oom→Nonkel (1)
- 5 register drift cells (Sad/Nice/Slow → Foal je-instead-of-uw)

### E4 (8 cells) — `docs/analysis/E4_Opus_Audit_v2.txt`  ⭐ Patrick's biggest win
- Was 27, now 8. **Patrick rewrote 45 cells in E4_AstralPlaneMain alone**, eliminating most of our flags
- Remaining: 2 Snotezel→Snotje, 1 DJ welcome decision, slogan rephrase J71, etc.

### E5 (27 cells) — `docs/analysis/E5_Opus_Audit_v2.txt`
- Acte/Nummer (7) and aap-itude (2) decisions still pending
- Nijg (2), doekjes idiom (1) ready
- Machine→Machien (~5), Ezel cap (~7)

### E6 (60 cells) — `docs/analysis/E6_Opus_Audit_v2.txt`  ⚠️ Increased
- Was 56, now 60 — Patrick's E6_World rewrites added new drift instances
- Machine→Machien still ~23 (E6 is the world hub — Patrick's rewrites kept Machine/Machines in many cells)
- Sturdy lament canonical J142 still pending full rewrite
- Jansen ×2 decision pending
- Oh liefste Gods J160 — translation fidelity

### E7 (11 cells) — `docs/analysis/E7_Opus_Audit_v2.txt`
- Unchanged from v1 — Patrick didn't heavily touch E7

### E8 (9 cells) — `docs/analysis/E8_Opus_Audit_v2.txt`
- Was 10, now 9 (Patrick fixed 1 cell in TheGods)
- 8 Gods U/Uw caps still pending (Patrick didn't address these)
- 1 Slogan EZELS EERST cell

### E9 (35 cells) — `docs/analysis/E9_Opus_Audit_v2.txt`
- Was 32, now 35 — Patrick's BadCave/GoldenAss rewrites added Machine instances
- 4 Gods register (Golden Ass) caps
- 2 Uncle Oom→Nonkel
- Cole-Machine codex sync still triggered (Piet-Machine refs)

### E10 (35 cells) — `docs/analysis/E10_Opus_Audit_v2.txt`
- Was 29, now 35 — Patrick's Government rewrites added Machine drift
- 9 Golden Ass U/Uw caps still pending
- ezel8ig song title still pending
- 3 slogan EZELS EERST cells

### E11 / NonCSV (unchanged ~52)
- Out of scope for xlsx pull (separate CSV file)
- Sign translations + missing E10_Words_Dutch sheet still need work

---

## Cross-cutting findings (post-resync)

### Locked, ready to apply

1. **Sad whimper**: corpus-wide `*boe-hoe-hoe*` (lowercase). Patrick's form is already canonical in remote — we just need the codex Sad Ass `verbalTics` field updated. Cell-level work: **0** (Patrick already aligned).
2. **Constaterende Ezel**: Patrick already implemented in 2+ cells. Codex Peek Ass entry needs update.
3. **Muilenbeek (extra n)**: ~30 cells corpus-wide need swap from Patrick's `Muilebeek` to our locked `Muilenbeek`. **Largest single sweep this cycle.**

### Still mechanical sweeps pending

| Bucket | Approx cells | Notes |
|--------|--------------|-------|
| Machine → Machien (incl. compounds) | ~120 | Largest pending; codex `Cole-Machine.dutch` sync |
| Boerderij → de Hoeve | ~40 | Welcome Sign duplicates inflate count |
| Ezel capitalisation | ~70 | 18 in E0 quiz (narrative-text decision pending) |
| Muilebeek → Muilenbeek | ~30 | New top sweep |
| Old monikers (residual) | ~15 | Patrick cleaned most; remainder in E1/E2/E3 |
| Gods U/Uw caps | ~21 | E8×8, E9×4, E10×9 |
| Slogan EZELS EERST | ~13 | 5 need sentence rephrase |
| Apostrophe drift | ~9 | E3/E5/E6 |
| Uncle Oom→Nonkel | ~11 | Foal speakers |
| Today: Schup, doekjes, ezel8ig, etc. | ~6 | Mostly ready |

### Decisions still open (10 items)

1. **HUDO** replacement — 9 corpus-wide
2. **Jansen** replacement — 2 cells E6
3. **Nijg** replacement — 2 cells E5
4. **Acte vs Nummer** — 7 cells E5
5. **DJ welcome** rephrase — 1 cell E4
6. **aap-itude** pun — 2 cells E5
7. **Afspraak/deal** edge case — 1 cell E5
8. **Narrative-text Ezel cap** — 18 cells E0 + ~6 elsewhere
9. **Slogan sentence rephrase** — 5 cells (E1/E4/E6)
10. **`Oh liefste Gods`** translation fidelity — 1 cell E6

### Codex sync needed (5 fields)

- `Hard Ass.dutch` → `"Bikkelharde Ezel"` (currently `"Bikkeharde Ezel"`)
- `Hard Ass.dutchShort` → `"Bikkelharde"`
- `Cole-Machine.dutch` → `"Piet-Machien"`
- `Sad Ass.verbalTics` → reference `*boe-hoe-hoe*` (LOWERCASE per today's lock)
- `Old Ass.verbalTics` → reference `EZELS EERST`
- **NEW:** `Peek Ass.dutch` → `"Constaterende Ezel"` (currently `"Constat-ezel"`)
- Bump version v3.3 → v3.4

---

## Recommended next steps (prioritized)

### Phase 1 — Apply locked sweeps (no decision needed)

JSON batches to draft + apply (in this order, smallest first):

1. **batch-r-muilenbeek.json** (~30 cells) — Muilebeek → Muilenbeek (Tom Q3 lock)
2. **batch-codex-sync.json** — 6 codex field updates
3. **batch-old-monikers-residual.json** (~15 cells) — Schoon Beest / Felle Gast / Betweter remainders
4. **batch-uncle-nonkel.json** (~11 cells) — Foal speakers Oom → Nonkel
5. **batch-i-ezel-cap-dialogue.json** (~50 cells, dialogue only) — defer narrative cells pending decision
6. **batch-j-farm.json** (~40 cells) — Boerderij → de Hoeve
7. **batch-gods-uw.json** (~21 cells) — lowercase u/uw → cap U/Uw for Gods
8. **batch-apostrophe.json** (~9 cells)
9. **batch-feedback-misc.json** — Schup, doekjes, ezel8ig (today's ready items)
10. **batch-p-machien.json** (~120 cells) — largest, last because of compound complexity

### Phase 2 — Resolve 10 decision items in one round

Get Tom answers in a single Q&A pass. Most are short (HUDO replacement, Acte-vs-Nummer pick, etc.).

### Phase 3 — Apply decision-dependent batches

After Phase 2: HUDO sweep, Jansen ×2, Nijg ×2, Acte/Nummer (7), DJ welcome (1), aap-itude (2), narrative Ezel cap (24), slogan rephrase (5), Oh liefste Gods (1) = ~60 more cells.

### Phase 4 — Push to remote

`push-file.py --apply` per file. Auth restored ✓.

### Phase 5 — Re-snapshot

After push completes, `pull-snapshot.py` to refresh `excels.fresh-pull-2026-05-XX/` and confirm round-trip.

---

## File index (post-resync)

```
data/editorial/
├── _OPUS-AUDIT-v2-POST-PATRICK-2026-05-10.md   ← THIS FILE (v2 wrap-up)
├── _OPUS-AUDIT-COMPLETE-2026-05-10.md          ← v1 wrap-up (SUPERSEDED)
├── _CRITERIA-FULL-LIST-2026-05-10.md           ← 70-criterion master ref (needs decision updates)
├── _FOUR-WAY-DIFF-2026-05-10.md                ← Pre-resync diff analysis (historical)
├── _THREE-WAY-DIFF-2026-05-10.md               ← Pre-resync 3-way (SUPERSEDED)
├── _PATRICK-PLAY-BY-PLAY-2026-05-10.txt        ← Patrick's edit dump (historical reference)
├── _RESUME-2026-05-07.md                       ← 46-cat master + locked decisions
└── feedback-*.json                             ← Applied batch records

docs/analysis/
├── E0_Opus_Audit_v2.txt   (20 cells)  ← v2 post-Patrick
├── E1_Opus_Audit_v2.txt   (36 cells)
├── E2_Opus_Audit_v2.txt   (47 cells)
├── E3_Opus_Audit_v2.txt   (39 cells)
├── E4_Opus_Audit_v2.txt   (8 cells)   ← Patrick's biggest cleanup
├── E5_Opus_Audit_v2.txt   (27 cells)
├── E6_Opus_Audit_v2.txt   (60 cells)
├── E7_Opus_Audit_v2.txt   (11 cells)
├── E8_Opus_Audit_v2.txt   (9 cells)
├── E9_Opus_Audit_v2.txt   (35 cells)
├── E10_Opus_Audit_v2.txt  (35 cells)
├── E*_Opus_Audit.md       ← v1 (pre-Patrick, historical reference)
└── E*_Consistency_Audit.md ← Gemini's earlier audits (historical)

excels/
├── *.xlsx                          ← LIVE REMOTE (truth, mirror of fresh pull)
├── Originals/                      ← Same — refreshed to live state as new baseline
└── Patrick-2026-05-08/             ← Historical Patrick snapshot
excels.fresh-pull-2026-05-10/       ← Source pull (kept for diff if needed)
excels.local-pre-resync-2026-05-10/ ← Pre-resync local backup (recoverable)
```

---

## Auth + tooling status

✅ `credentials.json` + `token.json` in place (gitignored)
✅ `pull-snapshot.py` works (no-auth, public URL)
✅ `push-file.py` works (verified round-trip on E0)
✅ `oauth-bootstrap.py` written for re-auth if needed
✅ `.venv-sheets/` venv with all deps installed

---

*v2 audit complete. 327 cells across 11 episodes. 10 decisions pending; 6 codex fields need sync; 10 mechanical batches ready to draft. Ready to draft + apply + push.*
