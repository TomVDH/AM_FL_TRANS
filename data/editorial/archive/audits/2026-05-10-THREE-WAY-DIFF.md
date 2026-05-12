# Three-Way Diff: Local vs Patrick vs Originals
**Generated:** 2026-05-10
**Inputs:**
- **A** = `excels/` (current local — Opus audited against this; includes our applied batches)
- **P** = `excels/Patrick-2026-05-08/` (Patrick's remote snapshot, 2026-05-08)
- **O** = `excels/Originals/` (pre-edit baseline)

---

## 🚨 Top-line numbers

| Bucket | Count | Action |
|--------|-------|--------|
| All same (A == P == O) | 4,102 | No action |
| **Both same change** (A == P, both differ from O) | **37** | ✅ Already aligned — no work |
| **We changed only** (A differs, P == O) | **28** | Apply our changes (no conflict) |
| **Patrick changed only** (P differs, A == O) | **359** | Adopt Patrick's edits (no conflict) |
| 🔴 **Conflict** (A != P, both differ from O) | **53** | **Manual decision per cell** |

> **Patrick made 449 cell edits since the baseline.** We made 118 (this Opus cycle + Gemini's direct edits). 37 are mutual fixes; 53 are real disagreements; 359 are Patrick-unique work we should pull in.

---

## 🔥 CRITICAL: spelling conflict — Muilenbeek vs Muilebeek

| Source | `Muilenbeek` (extra n) | `Muilebeek` (no extra n) | `Muilegem` (legacy) |
|--------|------------------------|---------------------------|---------------------|
| Local | **17** | 0 | 1 (E3_200 stray) |
| Patrick | 0 | **15** | 3 |

**This contradicts locked decision Q3** ("MUILEBEEK → Muilenbeek with extra n"). Either:
- Patrick was not briefed on the Q3 lock
- Patrick deliberately preferred the shorter form
- Q3 needs to be re-litigated

**🤔 Decision required from Tom**: which spelling wins corpus-wide? This affects ~15-17 cells immediately + ~10 more once we apply remaining Muilenbeek work.

---

## Per-file conflict summary (53 total)

| File | Conflicts | Patrick-only | We-only | Agreed |
|------|-----------|--------------|---------|--------|
| 0_E0 (Manager+Profiles) | 0 | 5 | 0 | 0 |
| 1_E1 | 12 | 114 | 1 | 4 |
| 2_E2 | 9 | 42 | 2 | 2 |
| 3_E3 | 5 | 51 | 1 | 3 |
| 4_E4 | 4 | 75 | 0 | 4 |
| 5_E5 | 0 | 9 | 0 | 0 |
| 6_E6 | 12 | 56 | 12 | 1 |
| 7_E7 | 6 | 10 | 0 | 6 |
| 8_E8 | 0 | 1 | 0 | 0 |
| 9_E9 | 4 | 12 | 0 | 4 |
| 10_E10 | 1 | 4 | 12 | 13 |
| **Total** | **53** | **359** | **28** | **37** |

---

## 🔍 Conflict categories (the 53)

### Category C1: Sad whimper case (4 cells)

Patrick uses **lowercase** `*boe-hoe-hoe*`; we have **capital** `*Boe-hoe-hoe*` per batch f lock.

| File | Cell | Originals | Local (A) | Patrick (P) |
|------|------|-----------|-----------|-------------|
| E1_Farm | J82 | `*boehoehoehoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| E1_Farm | J88 | `*boehoehoehoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| E1_Farm | J91 | `*boehoehoehoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |
| E1_TheProtest | J49 | `*boe-hoe-hoe-hoe*` | `*Boe-hoe-hoe*` | `*boe-hoe-hoe*` |

**🤔 Decision**: cap B (our lock) or lowercase b (Patrick)? Both agree on 3-`hoe` form and hyphens. **Just the case differs.**

### Category C2: Muilenbeek vs Muilebeek (5+ cells in conflict bucket; ~15-17 corpus-wide)

| File | Cell | EN | Local (A) | Patrick (P) |
|------|------|----|-----------|-------------|
| E1_Farm | J5 | Welcome to Fannyside Farm... | `Boerderij van Muilenbeek` | `Boerderij van Muilebeek` |
| E1_TheProtest | J5 | (same) | `Boerderij van Muilenbeek` | `Boerderij van Muilebeek` |
| E1_FarmHouseInt | J19 | drought continues in Greater Fannyside | `Groot-Muilenbeek` | `Groot-Muilebeek` |
| E2_World_*4× | J5 | (Welcome Sign duplicates) | `Muilenbeek` | `Muilebeek` |
| (more across E2/E3) | | | | |

→ See critical decision above.

### Category C3: Patrick rewrote substantially (~30 cells)

Patrick rewrote large chunks of dialogue with **completely different content** (not just consistency fixes). Our work touched many of the same cells. Examples:

| File | Cell | EN | Local (A) | Patrick (P) — substantive rewrite |
|------|------|----|-----------|-----------------------------------|
| E1_TheProtest | J48 | *whimper* | `*Boe-hoe-hoe*` | `Herdenk met Triestige Ezel over al wat er verloren is gegaan.` |
| E1_TheProtest | J60 | THREE, we march... | `DRIE: ...Klotegem...Machines...` | `Het gewicht van onze geschiedenis drukt ons op de schouders.` |
| E1_TheProtest | J88 | THREE, we march... | `DRIE: ...Klotegem...Machines...` | `TWEE: we vervoegen de Mijn-Ezels en gaan het dorp binnen via het Oosten.` |
| E1_FarmHouseInt | J20 | If you need a place to take the kids... | `...zoo van Technopolis!...` | `Als je een leuke plek zoekt voor je familie, ga naar de Dierentuin van Technopolis!...` |
| E2_World_B1 | J42 | And I'll sing the Song of Ascension for Trusty | `En ik zal het Hemelvaarts-zang-der-Ezel-zielen voor Trouwe zingen.` | `En de Hemelvaarts-zang-der-Ezel-zielen zal ik voor Trouwe zingen.` |

These are **content rewrites**, not consistency drift. **Patrick's editorial decisions take precedence** (he's the senior editor) — drop Opus proposals on these cells, accept Patrick's text.

### Category C4: Phrasing reorder agreement (1 cell)

| File | Cell | Local (A) | Patrick (P) |
|------|------|-----------|-------------|
| E1_Stable2F | J47 | `Iemand moet het Hemelvaarts-zang-der-Ezel-zielen zingen zodat zijn ziel het Astrale Hiernamaals bereikt en hij weer kan herrijzen.` | `Zodat zijn ziel het Astrale Hiernamaals bereikt en hij weer kan herrijzen, iemand moet het Hemelvaarts-zang-der-Ezel-zielen zingen.` |

**Patrick already made the reorder Tom proposed today!** Drop our proposal — Patrick's wording wins.

### Category C5: All other conflicts (~13 cells)

Mix of: punctuation differences, single-word swaps, register variations. Need per-cell review.

---

## 💎 Patrick-only changes worth highlighting

Patrick made 359 cells of unique edits we didn't touch. Notable categories:

### Patrick implemented Tom's "Constaterende Ezel" investigation
Tom asked yesterday whether `Constaterende Ezel?` / `Constatatie Ezel?` exists. **Patrick implemented it:**

| File | Cell | EN | Originals | Patrick |
|------|------|----|-----------|---------|
| E0_CharacterProfiles | J82 | Peek Ass | `Constat-ezel` | **`Constaterende Ezel`** |

**This means our Opus E0 audit proposal `Constat-Ezel` is wrong** — Patrick chose the longer form. Same for E10_Credits J73 likely (verify).

### Patrick fixed quiz question swap
| File | Cell | EN | Originals | Patrick |
|------|------|----|-----------|---------|
| E0_Questions | J79 | Molly | `Molly` | `Jennet` |
| E0_Questions | J80 | Jennet | `Jennet` | `Molly` |

Patrick swapped the answers — looks like a correction of a mismapped Q&A.

### Patrick rewrote E0_Questions J76 with EN context preserved
| File | Cell | EN | Originals | Patrick |
|------|------|----|-----------|---------|
| E0_Questions | J76 | A 'mare' is the general term for a female equine. What is the specific term for a female donkey? | `Een 'merrie' is de algemene term voor een vrouwelijk paard. Wat is de specifieke term voor een vrouwelijke ezel?` | `In het Engels is 'mare' de algemene term voor een vrouwelijk paard. Welke van de volgende termen is de specifieke term voor een vrouwelijke ezel?` |

Patrick added "In het Engels" framing to clarify the EN-specific terminology.

### Heavy E1 dialogue rewrites
Patrick rewrote ~50 cells in E1_TheProtest alone — substantive editorial revision of the protest scene dialogue. Likely working from a director's note we don't have visibility into.

---

## ✅ Where Patrick + Local agree (37 cells)

These cells had the same change applied independently — **validates direction**:
- `Mechalen → Technopolis` (E1_FarmHouseInt J3, J4 — DJ Tom intro lines)
- `Muilegem → Klotegem` (E1_Farm J72 — Smart Ass plan, where village = Klotegem ✓)
- `Happy Ezel → Blije Ezel` (E1_RedFields J7)
- `ezelenhemelvaartszangderzielen → Hemelvaarts-zang-der-Ezel-zielen` (E2_World J43)
- ...and 33 more

→ These are "free wins" — already aligned, no apply needed.

---

## 🛠 Merge strategy proposal

### Phase 1: Adopt all Patrick-only changes (359 cells)
No conflict. Patrick's editorial work pulled into our local. Action: **copy from `Patrick-2026-05-08/`** for these 359 cells.

### Phase 2: Resolve 53 conflicts (decision-needed)

Per-conflict decisions, in groups:
- **C1 (4 sad whimper case)** — Tom: cap B (our lock) or lowercase (Patrick)?
- **C2 (5+ Muilenbeek/Muilebeek)** — Tom: extra n (our Q3 lock) or no extra n (Patrick)?
- **C3 (~30 substantive rewrites)** — **default: accept Patrick** (he's senior editor); flag any where Opus has a strong reason to keep
- **C4 (1 J47 phrasing)** — accept Patrick (matches Tom's intent)
- **C5 (~13 misc)** — per-cell review

### Phase 3: Apply Opus proposals only on cells Patrick didn't touch
Of our 408 Opus-flagged cells, subtract:
- Cells Patrick already changed (need to re-audit against Patrick's text, not Originals)
- Cells in conflict bucket (decisions per Phase 2)
- Cells in agreement bucket (already done)

**Net Opus work after Patrick merge: TBD — needs re-run of Opus categories against Patrick's text.**

### Phase 4: Update `excels/Originals/` to new baseline
After merge, `excels/Originals/` should be refreshed to the merged state — becomes the new comparison point for future Patrick rounds.

---

## 🔧 Recommended scripts to write

1. **`scripts/editorial/three-way-diff.py`** — formalize this analysis as repeatable script. Inputs: 3 dirs. Output: this report format.
2. **`scripts/editorial/merge-patrick.py`** — automate Phase 1 (apply Patrick-only changes) + flag Phase 2 conflicts for human review.
3. **`scripts/editorial/re-audit-against-patrick.py`** — re-run Opus categories against Patrick's text to surface new drift Patrick may have introduced.

---

## Open questions for Tom

1. **Spelling**: `Muilenbeek` (our Q3 lock, extra n) vs `Muilebeek` (Patrick, no extra n) — which wins?
2. **Sad whimper case**: `*Boe-hoe-hoe*` (our cap B lock) vs `*boe-hoe-hoe*` (Patrick lowercase) — which wins?
3. **Editorial precedence**: when Patrick rewrites substantively (C3 category), do we always defer? Or are there cases where our consistency rules override?
4. **Constaterende Ezel**: Patrick chose `Constaterende Ezel` (long) for Peek Ass — confirm this is now canon (and update codex)?
5. **Patrick's editorial vision**: Do we have access to a Patrick edit log / brief explaining the substantive rewrites in E1_TheProtest etc.?

---

## File references

- Patrick snapshot: `excels/Patrick-2026-05-08/`
- Baseline: `excels/Originals/`
- Local working: `excels/`
- Audit proposals: `docs/analysis/E*_Opus_Audit.md`

*End of 3-way diff. 53 conflicts await resolution; 359 Patrick-only changes ready for adoption.*
