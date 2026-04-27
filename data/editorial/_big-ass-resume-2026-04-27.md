# Big Ass editorial pass — resume state

**Date:** 2026-04-27
**Branch:** `am-analysis`
**Source of truth:** `data/json/codex_verified.json` v3.3 + `_HANDOFF-2026-04-21.md` in vault
**Live xlsx scan:** `data/editorial/_big-ass-live-2026-04-26.json` (143 lines, 11 xlsx, 24 sheets)

---

## Decisions LOCKED this session (Q1–Q6)

| # | Field | Decision |
|---|---|---|
| Q1 | pronoun | **ge/gij dominant** |
| Q2 | negation | **`niet` only** (flip 7 `nie` → `niet`) |
| Q3 | `'k`/`ik` | **`ik` only** (flip 10 `'k` → `ik`, including `da'k` → `dat ik`) |
| Q4 | `'t`/`het` | both free, no normalization |
| Q5 | `u`/`uw` | keep all 5 (paradigm with ge/gij) |
| Q6 | `jullie` | keep both (accepted in tussentaal) |

**Cascading effects:**
- BA-D2 (E5_ZooMain R215 `ge`): RESOLVED — `ge` stays; the surrounding scene's `je`-family forms flip to `ge`-family.
- BA-D3 (E7_BigBattle R4 `nie` vs R7 `niet`): RESOLVED — R4 flips to `niet`.
- ge ceiling: RESOLVED — no ceiling. ge/gij is dominant; je is what's being eliminated.
- Drift #1 (E5_ZooMain `'t`/`het`), #6 (E7_BigJob), #7 (E7_Chilling): RESOLVED — both forms free.
- Drift #3, #5, #8 (`'k`/`ik` across E7_BigBattle, E7_BigJob, E7_CityStreet): RESOLVED — flip to `ik`.

---

## In progress — Q7 (canonical-name corrections in Big's lines)

### Q7 — `Oude Zak` calling Old Ass

E1_TheProtest R25:
- EN: *"Poor Old Ass."*
- NL: *"Arme **Oude Zak**."*

Codex canon: `Oude Ezel` / `Oude`. The `-Zak` suffix matches the deprecation pattern that retired `Trouwe Zak`.

**Awaiting Tom's call:** A) `Oude Ezel` · B) `Oude` · C) Keep `Oude Zak`

Cross-character note: there are 19 other `Oude Zak` hits in other characters' lines. Whatever Tom picks here will likely become a sweep rule (post-Big-Ass).

---

## Queued questions (Q8+)

### Q8 — `Triestigaard` calling Sad Ass
E5_CircusMain R136 *"Ga je zieke moves aan het publiek tonen, **Triestigaard**!"* and R145 *"Maak je niet te druk, **Triestigaard**..."*. Codex canon: `Triestige Ezel`.

### Q9 — `Dorstlap` calling Thirsty Ass
E2_World_B1 R22 *"En **Dorstlap**?"* and E3_Mine1F R71 *"...Dorstlap!"*. Codex canon: `Beschonken Ezel`. **Note:** corpus elsewhere uses both — codex may need to update, not corpus.

### Q10 — E3_Mine1FOpening R21 hot spot (4 names in one line)
- EN: *"I have a massive announcement, Comrade Sturdy! Hard, Kick, and Sick are back!"*
- NL: *"Ik heb een mega aankondiging, **Kameraad Stoere**! **Harde**, **Trap**, en **Zieke** zijn terug!"*

Divergences against codex:
- `Stoere` (Sturdy) — codex says `Stevige Ezel`. **Note:** `Stoere Ezel` is **Bad Ass's** canonical — possible swap or shared word.
- `Harde` (Hard) — codex says `Bikkeharde Ezel`; `Harde` is short form.
- `Trap` (Kick) — codex says `Stamp Ezel`; `Trap` is stale alternate.
- `Zieke` (Sick) — codex says `Snot Ezel` / `Snotje`.

---

## Voice drift candidates — final dispositions

| # | scene | pair | counts | resolution |
|---|---|---|---|---|
| 1 | E5_ZooMain | `'t`/`het` | 1/1 | non-issue (Q4: both free) |
| 2 | E5_ZooMain | `ge`/`je` (BA-D2) | 1/4 | flip je-family → ge-family (Q1) |
| 3 | E7_BigBattle | `'k`/`ik` | 5/2 | flip 'k → ik (Q3) |
| 4 | E7_BigBattle | `nie`/`niet` (BA-D3) | 1/1 | R4 flip nie → niet (Q2) |
| 5 | E7_BigJob | `'k`/`ik` | 2/6 | flip 'k → ik (Q3) |
| 6 | E7_BigJob | `'t`/`het` | 1/1 | non-issue (Q4) |
| 7 | E7_Chilling | `'t`/`het` | 3/1 | non-issue (forced by proper noun) |
| 8 | E7_CityStreet | `'k`/`ik` | 5/2 | flip 'k → ik (Q3) |

---

## Correction count estimate (post-decisions)

Based on Q1–Q6 locks, expected corrections:
- ge/gij flips: ~11 lines (je-family → ge-family)
- niet flips: 7 lines
- ik flips: 10 lines (including 1 `da'k` → `dat ik`)
- canonical name flips (Big's lines only): pending Q7–Q10 dispositions

**Estimated total Big Ass corrections:** ~28–35 lines (+ canonical-name fixes).

---

## Cross-character / project-wide work (deferred — post-Big-Ass)

Project-wide audit surfaced these regressions/divergences for the next sweep job (NOT to be touched during Big Ass pass):

| Pattern | Scope | Notes |
|---|---|---|
| `Oude Zak` (Old Ass) | 19 hits, multi-speaker | `-Zak` deprecation extension |
| `Luie Zak` (Lazy Ass) | 6 hits, multi-speaker | same `-Zak` pattern; includes Lazy referring to himself |
| `Trap` for Kick Ass | 2 hits (Big R21, Hard R42) | small but real |
| `Stoere`/`Stoere Ezel` for Bad Ass | widespread | codex says Bad = `Stoute Ezel`; corpus uses `Stoere Ezel` consistently. **Codex may need updating, not corpus.** |
| `Bikkelharde` vs codex `Bikkeharde` | spelling drift | extra `L` in corpus — codex/corpus discrepancy |
| `(Sad Ass)`, `(Lazy Ass)` literal placeholders | several | untranslated bug |
| `Dorstklap` typo | E3_Mine1FOpening R67 | should be `Dorstlap` |

---

## Key files

| File | Purpose |
|---|---|
| `data/editorial/_big-ass-live-2026-04-26.json` | Live xlsx scan, 143 Big Ass lines (file/sheet/row/key/en/nl) |
| `data/editorial/_big-ass-en-with-desc-2026-04-26.json` | Same 143 lines + Description column (49 with stage directions) |
| `data/editorial/_full-corpus-2026-04-26.json` | Full corpus, 4486 lines across all speakers — for cross-character audit |
| `data/editorial/_big-ass-live.json` | OLD baseline from 2026-04-21 (141 lines) — kept for diff |
| `data/json/codex_verified.json` | v3.3 verified codex (legacy schema, no `voiceRules` blocks yet) |
| `data/json/codex_translations.json` | Live app SSoT codex |
| `scripts/editorial/apply-corrections.py` | Apply corrections JSON to xlsx (dry-run by default, `--apply` to commit) |
| `scripts/analysis/dump-speaker-lines.js` | Per-speaker dump from JSONL (stale — re-verify against xlsx) |
| `scripts/analysis/generate-character-profiles.py` | Re-run to refresh `data/analysis/character-profiles.json` after corrections land |

---

## Resume protocol

1. Read this file.
2. Check git log for any commits since 2026-04-27 that touched `data/json/codex_verified.json`, `data/editorial/`, or `excels/` — if so, re-baseline.
3. Re-run live xlsx scan to confirm 143-line count is stable (drift detection).
4. Continue Q7 (`Oude Zak` disposition).
5. After all canonical-name questions answered, generate corrections JSON: `data/editorial/big-ass-corrections.json`.
6. Dry-run: `python3 scripts/editorial/apply-corrections.py data/editorial/big-ass-corrections.json`
7. Apply: `... --apply`.
8. Verify: re-scan xlsx, confirm 0 residual violations.
9. Lock codex: bump `codex_verified.json` Big Ass entry — update `pronounForm`, `contractions`, `note` fields per Q1–Q6 decisions; add `lastEditorialPass: "big-ass · 2026-04-27"`.
10. Move to next character (Tom's call on order).

---

## Methodology notes (per handoff conventions)

- xlsx = authoritative; JSONL/CSV dumps = stale. Always re-verify from xlsx.
- Aggregate counts = voice; scene-internal drift = error candidate.
- Single-apostrophe `'k` is correct (not `''k` — that was a Google Sheets pipeline artifact).
- `Trouwe Zak` deprecation is in force; same `-Zak` deprecation pattern likely extends to `Oude Zak`/`Luie Zak` per Tom's pending Q7 call.
- User preference (handoff §8): present data, flag inconsistencies, propose corrections — let user call dispositions. No interpretive prose unless asked.
