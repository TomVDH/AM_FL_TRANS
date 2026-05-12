# Four-Way Diff: Local vs Patrick-snapshot vs Live-Remote vs Originals
**Generated:** 2026-05-10 (post fresh pull)
**Supersedes:** `_THREE-WAY-DIFF-2026-05-10.md` (which used the May-8 Patrick snapshot, now stale)

**Inputs:**
- **A** = `excels/` — current local (Opus audited; includes our applied batches)
- **P** = `excels/Patrick-2026-05-08/` — Patrick snapshot from May 8
- **R** = `excels.fresh-pull-2026-05-10/` — **LIVE remote, just pulled** (the actual merge target)
- **O** = `excels/Originals/` — pre-edit baseline

---

## 🚨 Top-line numbers (against LIVE remote)

| Comparison | Cells differ |
|------------|--------------|
| **Local vs Live Remote** | **469** |
| Local vs Patrick May-8 | 440 |
| Patrick May-8 vs Live Remote | **40** ← Patrick is still editing |
| Local vs Originals | 118 (our applied work this cycle) |

**4-way buckets** (Local A vs Live Remote R, with O+P as context):

| Bucket | Cells | Action |
|--------|-------|--------|
| All aligned (A == R == O) | 4,073 | none |
| **Remote changed, we didn't** (R != O, A == O) | **388** | Pull in (no conflict — Patrick's work) |
| **Both changed differently** (A != O, R != O, A != R) | **53** | 🔴 Conflicts |
| We already match remote (A == R, both differ from O) | 37 | Already aligned |
| We changed, remote didn't (A != O, R == O) | 28 | Push to remote |

---

## ⚠️ Patrick edited 40 more cells since the May-8 snapshot

The Patrick snapshot is **2 days stale**. Most evolution is in `E2_World_B1_localization` — substantive dialogue rewriting. Patrick is actively editing Smart Ass's protest plan dialogue. Sample evolution:

| Cell | Patrick May-8 | Remote (now) |
|------|---------------|--------------|
| E2_World_B1 J20 | `Stuur Mega Ezel!` | `En Beschonken?` |
| E2_World_B1 J21 | `Ik pas daar niet tussen.` | `Da's daar véél TE DROOG. 'K geraak daar nooit!` |
| E2_World_B1 J24 | `En gij, Slimme Ezel?` | `Luister. Als wij de Mensen niet redden, wie gaat er ons dan Hooi komen geven?` |
| E2_World_B1 J25 | `Jij wilt je TOPSTRATEEG die BRAND insturen? Is dat voor te lachen, ofzo!` | `We gaat er onze Hoeven kuisen?` |
| E2_World_B1 J29 | `Wie gaat er achter onze oren krabben?` | `Wie gaat er ONZE JOBS TERUGGEVEN?` |
| E2_World_B1 J30 | `Wie gaat er ons medicijnen geven wanneer we ziek zijn?` | `...` |
| E2_World_B1 J34 | `Ik doe het wel.` | `*oe-oef*` |
| E2_MinersHouse J14 | `Na al die jaren zij-aan-zij te werken in de Mijnen...` | `Dus, is het tot dit gekomen.` |

Plus other E2/E3/E4/E6/E10 cells. **Treat live remote (R) as the merge target, not P.**

---

## 🔥 The 53 conflicts (organized by category)

### C1: Sad whimper case (8 cells) — `*Boe-hoe-hoe*` (us, cap B) vs `*boe-hoe-hoe*` (remote, lowercase)

Same content, only B/b case differs. Sample:

| File | Cell | Originals | Local (A) | Remote (R) |
|------|------|-----------|-----------|------------|
| E1_Farm | J82 | `*boehoehoehoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| E1_Farm | J88 | `*boehoehoehoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| E1_Farm | J91 | `*boehoehoehoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| E1_TheProtest | J49 | `*boe-hoe-hoe-hoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| E2_Confession | J3 | `*boehoehoehoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| E2_World_A2 | J25 | (similar) | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| (~3 more across E2/E5) | | | | |

**🤔 Decision:** cap B (our batch f lock) or lowercase b (remote / Patrick)?

### C2: Muilenbeek vs Muilebeek (6 conflict cells; ~30 corpus-wide spelling)

The Q3 lock said `Muilenbeek` (extra n); Patrick + remote use `Muilebeek` (no extra n).

| File | Cell | Originals (Muilegem) | Local (A) — Muilenbeek | Remote (R) — Muilebeek |
|------|------|----------------------|-------------------------|--------------------------|
| E1_Farm | J5 | `Muilegem` | `Muilenbeek` | `Muilebeek` |
| E1_TheProtest | J5 | `Muilegem` | `Muilenbeek` | `Muilebeek` |
| E1_FarmHouseInt | J19 | `Groot-Muilegem` | `Groot-Muilenbeek` | `Groot-Muilebeek` |
| E2_World_A1 | J5 | (same Welcome Sign) | `Muilenbeek` | `Muilebeek` |
| E2_World_A2 | J5 | (duplicate) | `Muilenbeek` | `Muilebeek` |
| E2_World_B1 | J5 | (duplicate) | `Muilenbeek` | `Muilebeek` |
| E2_World_B2 | J5 | (duplicate) | `Muilenbeek` | `Muilebeek` |

**🔴 CRITICAL:** corpus-wide we have 17 `Muilenbeek`; remote has ~15+ `Muilebeek`. **Tom must break the tie.** The Q3 lock vs the senior editor's actual implementation.

### C3: Patrick substantive dialogue rewrites (~25 cells)

Patrick rewrote scenes substantively. Our consistency fixes touch the same cells. **Default: defer to remote (Patrick is senior editor).**

Examples:
- E1_TheProtest J48: us `*Boe-hoe-hoe*` ↔ remote `Herdenk met Triestige Ezel over al wat er verloren is gegaan.`
- E1_TheProtest J60: us `DRIE: Klotegem...Machines...` ↔ remote `Het gewicht van onze geschiedenis drukt ons op de schouders.`
- E1_TheProtest J88: us `DRIE: Klotegem...` ↔ remote `TWEE: we vervoegen de Mijn-Ezels en gaan het dorp binnen via het Oosten.`
- E1_FarmHouseInt J20: us `...zoo van Technopolis...` ↔ remote `Als je een leuke plek zoekt voor je familie, ga naar de Dierentuin van Technopolis...` (better Dutch)
- E2_World_B1 J42: us `En ik zal het Hemelvaarts-zang-der-Ezel-zielen voor Trouwe zingen` ↔ remote `En de Hemelvaarts-zang-der-Ezel-zielen zal ik voor Trouwe zingen` (word order)
- ~20 more across E2/E3/E4/E6

### C4: J47 phrasing reorder agreement (1 cell)

E1_Stable2F J47 — Patrick implemented Tom's phrasing-reorder proposal. Our local hasn't yet. **Adopt remote.**

### C5: Other (~13 cells) — punctuation / single-word swaps / register variations

Per-cell review needed.

→ Full conflict listing dumped to `/tmp/am-scan-2026-05-10/four-way-conflicts.txt` (352 lines).

---

## 💎 388 "remote_changed_we_did_not" cells (no conflict — adopt them)

This is everything Patrick did that we never touched. Includes:

- **Constaterende Ezel** for Peek Ass (E0 J82, etc.) ← Tom's investigation answered
- **Jennet/Molly swap fix** (E0_Questions J79/J80)
- **E0_Questions J76 EN-context rewrite** (`In het Engels is 'mare'...`)
- **Heavy E1_TheProtest dialogue rewrites** (~50 cells)
- **E2_World_B1 substantive Smart Ass plan rewrites** (~20 cells, including the 8 Patrick-evolved-since-May-8)
- ...and ~310 more

**Action:** copy-from-remote for these 388 cells. No conflict, no review needed unless any specific cell concerns Tom.

---

## ✅ 37 cells we already match (free wins)

Patrick + we made the same change independently. Validates our approach. Includes Mechalen→Technopolis (E1_FarmHouseInt J3/J4), Klotegem (E1_Farm J72), Happy→Blije Ezel (E1_RedFields J7), the Hemelvaarts-zang form, etc.

---

## 📤 28 "we changed, remote didn't" cells

Our unique work — Patrick hasn't touched these. **Push our local to remote** when ready (after merge resolution).

Our most likely contents in this bucket:
- Cells we Opus-flagged but Patrick didn't audit (mostly Machine→Machien, Ezel cap, Boerderij→Hoeve sweeps Patrick hasn't done yet)
- Some pieces of our applied batches (m, n) where Patrick happened not to overlap

---

## 🛠 Merge sequence (revised)

### Phase 0 — Decisions (BLOCKING)

Tom needs to call:
1. **Muilenbeek vs Muilebeek** — corpus-wide spelling
2. **Sad whimper case** — `*Boe-hoe-hoe*` (us) or `*boe-hoe-hoe*` (Patrick/remote)
3. **Constaterende Ezel** — confirm as canon (codex update)
4. **Patrick precedence rule** — for the ~25 substantive rewrites, always defer or selectively?

### Phase 1 — Adopt remote (388 + the 37 already-aligned implicitly)

Mechanical: for each of the 388 remote-only-changed cells, copy R → A.

### Phase 2 — Resolve 53 conflicts per Phase 0 decisions

Apply per decision rules from Phase 0.

### Phase 3 — Verify our 28 unique cells still valid

Re-audit our 28 unique edits against remote — confirm none are now redundant or conflicting.

### Phase 4 — Re-run Opus audit categories

After merge, re-run our 46-category scan against the merged state. Many of the ~408 cells we flagged may now be:
- Already done by Patrick (drop)
- Still drift, will become new batches
- Replaced by Patrick's substantive rewrites (drop our proposal)

### Phase 5 — Push our remaining work + new audit batches

`push-file.py` per file with `--apply`. Auth is now restored ✓.

### Phase 6 — Refresh `excels/Originals/`

After merge complete, snapshot the new merged baseline as the next reference point.

---

## 🔧 New scripts the workflow now needs

1. **`scripts/editorial/merge-from-remote.py`** — automate Phase 1 (apply 388 remote-only cells to local). Conservative: only touches cells where local == originals.
2. **`scripts/editorial/four-way-diff.py`** — formalize this analysis as repeatable. Inputs: 4 dirs. Output: this report format + per-conflict per-bucket dumps.
3. **`scripts/editorial/conflict-resolver.py`** — interactive per-cell review for the 53 conflicts (text TUI: show O/A/R, ask user to pick).

---

## File references

- Live snapshot: `excels.fresh-pull-2026-05-10/`
- Patrick snapshot (now stale): `excels/Patrick-2026-05-08/`
- Local working: `excels/`
- Baseline: `excels/Originals/`
- Auth: `credentials.json` + `token.json` (both gitignored, ✅ working)
- Pull script: `scripts/convert/pull-snapshot.py` (no-auth, public URL)
- Push script: `scripts/convert/push-file.py` (auth via token.json, ✅ working)

---

*4-way diff complete. 469 local-vs-remote diffs, 388 adoptable, 53 conflicts pending decisions, 28 ours to push. Auth restored.*
