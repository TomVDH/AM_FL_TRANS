# am-fl-trans — Gemini Context

> **Branch:** `am-analysis` | **Last commit:** `5039afa` (2026-05-07)
> **Session continuity:** read `data/editorial/_RESUME-2026-05-03.md` for the full batch checklist.

---

## What this project is

Flemish Dutch localisation for a narrative game ("asses.masses"). Source-of-truth lives in Google Sheets; local proxy is `excels/*.xlsx` (column J = NL). Corrections are JSON-driven and applied by `scripts/editorial/apply-corrections.py`. Pushing back to Sheets requires `credentials.json` (currently missing — local-only mode).

---

## Toolchain quick reference

```bash
# Dry-run — checks cell values without writing
python3 scripts/editorial/apply-corrections.py data/editorial/<batch>.json

# Apply — writes proposed_nl to local xlsx
python3 scripts/editorial/apply-corrections.py data/editorial/<batch>.json --apply

# Push to Google Sheets (requires credentials.json)
python3 scripts/convert/push-file.py excels/<file>.xlsx --apply

# Locate all key files (machine-readable summary)
python3 scripts/gemini-locate.py

# Git — excels/ is gitignored but force-added
git add -f excels/
git commit -m "fix(editorial): ..."
```

---

## Correction JSON schema

```json
{
  "_meta": { "decisions_lock": "YYYY-MM-DD", "scope": "...", "actual_count": N },
  "corrections": [
    {
      "id": "BATCH-NNN",
      "rationale": "...",
      "file": "N_asses.masses_ENProxy.xlsx",
      "sheet": "EN_Sheet_localization",
      "cell": "JNNN",
      "speaker": "Character Name",
      "english": "Full EN source text (exact, from column C)",
      "current_nl": "Current NL value in xlsx",
      "proposed_nl": "Corrected NL value"
    }
  ]
}
```

**Strict rule:** `english` must be the exact cell value from column C — no truncation, no paraphrase.

---

## Applied batches (do NOT re-apply)

| Batch | JSON | Cells | Decision summary |
|-------|------|-------|-----------------|
| a | `feedback-2026-05-03-mechalen.json` | 30 | Mechalen → Technopolis |
| b | `feedback-2026-05-03-stenen-spel.json` | 12 | Stenen-Spel → Keien-Spel |
| c | `feedback-2026-05-03-song.json` | 7 | Song title → Hemelvaarts-zang-der-Ezel-zielen |
| c2 | `feedback-2026-05-03-song-article.json` | 3 | Article lock: de → **het** (always het for this title) |
| e1 | `feedback-2026-05-03-poepegaatje.json` | 5 | Bar rename Poepegaatje → De Zatten Ezel (no preceding article) |
| f | `feedback-2026-05-03-sad-whimper.json` | 18 | *Boe-hoe-hoe* standardization |
| g | `feedback-2026-05-03-bikkelharde.json` | 3 | Bikkeharde → Bikkelharde |
| d | `feedback-2026-05-03-asshandlers.json` | 0 | Skipped — already on remote |
| apr-29 | `feedback-2026-04-29.json` | 6 | 6 of 8 reverification corrections (FB-BIK-3, STAL-1, HAPPY-1, NICE-IDIOM-1, BAD-WORD-1, OLD-HET-1) |
| m | `feedback-2026-05-04-kameraad.json` | 14 | Kameraad tag removal (lines where EN has no Comrade) |
| n | `feedback-2026-05-04-slow-en.json` | 1 | Slow Ass E6 J339: English fragment removed |

**Session total applied: 99 cells across 5 xlsx files.**

---

## Pending batches (undrafted — need new JSON)

| ID | Label | Scope | Cells (est.) | Blocker |
|----|-------|-------|-------------|---------|
| e2 | Muilenbeek | MUILEBEEK typo + name sweep | ~24 | None — draft next |
| h | Hie/Haa | HIE/HAA capitalisation & consistency | ~TBD | None |
| i | Ezel caps | lowercase ezel → Ezel (57 cells) | 57 | None |
| j | Farm/Stable | Boerderij → de Hoeve (31 cells) | 31 | None |
| k | Uncle | Nonkel/Oom canonicalisation (23+11) | ~34 | None |
| l | Sturdy motto | Non-canonical lament deviations | TBD | KWAADAARDIG! stays (Q2 locked) |
| m2 | Stevige Kameraad | Sturdy-specific Kameraad (own batch) | TBD | None |
| o | Ass Power slogan | EZELSKRACHT AAN DE MACHT variants | TBD | None |
| p | Machine→Machien | 118 cells; plural = Machienen (Q1 locked) | 118 | None |
| q | AFGEVAARDIGDE→VAZAL | Asset pipeline terminology | TBD | None |

---

## Locked decisions (Q1–Q5, resolved 2026-05-04)

| Q | Decision |
|---|----------|
| Q1 | Machines plural → **Machienen** |
| Q2 | Keep **KWAADAARDIG!** (do not replace with SLECHT!) |
| Q3 | MUILEBEEK → **Muilenbeek** (catch in batch e2) |
| Q4 | 100-screenshot lean pass: yes, deferred until after wave corrections |
| Q5 | Stevige Kameraad: **own batch** (m2), not bundled into batch m |

---

## Key files

```
excels/
  0_asses.masses_Manager+Intermissions+E0Proxy.xlsx   — E0, Intermissions, CharacterProfiles
  1_asses.masses_E1Proxy.xlsx                         — Farm/Stable episodes
  2_asses.masses_E2Proxy.xlsx
  3_asses.masses_E3Proxy.xlsx                         — Mine
  4_asses.masses_E4Proxy.xlsx
  5_asses.masses_E5Proxy.xlsx                         — Circus/Zoo
  6_asses.masses_E6Proxy.xlsx                         — World (Sturdy Ass hub, largest)
  7_asses.masses_E7Proxy.xlsx                         — Factory/Slaughter
  8_asses.masses_E8Proxy.xlsx                         — Sanctum / The Gods
  9_asses.masses_E9Proxy.xlsx                         — Golden Ass / Bad Cave
  10_asses.masses_E10Proxy.xlsx                       — E10 Government/Credits/Epilogue

data/editorial/
  _RESUME-2026-05-03.md          — master batch checklist (a–q) + Q1–Q5 status
  _corpus-scoping-2026-05-03.md  — 4,475 cells scanned; batch sources §A1–A13
  _batch-mn-scoping-2026-05-04.md — full batch m/n decision tables
  _feedback-2026-04-29-reverification.md — April-29 corrections status
  _pre-pull-diff-2026-05-03.md   — 42-cell diff (local vs remote post-pull)
  _idiom-bank-2026-05-03.md      — Flemish idiom reference
  feedback-*.json                — correction batches (see Applied / Pending above)

scripts/
  editorial/apply-corrections.py — dry-run + --apply engine
  convert/push-file.py           — Sheets push (needs credentials.json)
  gemini-locate.py               — file map generator (this session)
```

---

## Open editorial questions

- **"LIEFS, DE GODEN"** — user asked which sheet contains this all-caps string; exhaustive corpus search (all 11 xlsx, all columns) found no match. Possibly: in-engine prop/letter rendered as game art (not in localization sheets), or exists on remote Sheets but not in pulled local xlsx. Closest corpus hit: `E6_World J160` `Oh liefste Gods` (EN: "Praise be to the Gods.") — this is also a separate translation fidelity flag.
- **`E6_World J160`** — `Oh liefste Gods` vs EN "Praise be to the Gods." — literal drift; not yet corrected.
- **FB-BIK-1** — resolved passively by batch g (BIKKELHARDE-003 covered same cell).
- **credentials.json** — Google Sheets auth missing; all local xlsx changes need eventual push.

---

## Character name canon (key entries)

| EN | NL |
|----|----|
| Sturdy Ass | Stevige Ezel / Stevige |
| Hard Ass (Uncle) | Oom Bikkelharde |
| Sad Ass | Triestige Ezel / Triestige |
| Cole-Machine | Cole-Machien (batch p pending) |
| The Gods | De Goden |
| Hee / Haw | HIE / HAA |
| Fannyside | Muilegem |
| Mechalen | Technopolis |
| Stone Game / Pebble Game | Keien-Spel |
| The Drunk Ass (bar) | De Zatten Ezel |
| Song of Ascension | Hemelvaarts-zang-der-Ezel-zielen |

Article for "Hemelvaarts-zang-der-Ezel-zielen" is always **het** (locked).
