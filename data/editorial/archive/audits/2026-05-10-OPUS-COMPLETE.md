# Opus Audit Cycle — COMPLETE 2026-05-10

> **🏁 All 12 episodes audited.** ~408 cells flagged across `docs/analysis/E*_Opus_Audit.md`.
> **Status**: stashed (read-only). No xlsx writes, no JSON drafted, no commits. Ready for batch drafting / decision review / 3-way diff with Patrik's remote.

---

## Read order for next session

1. **This file** — wrap-up + cross-cutting findings + next steps
2. [`_RESUME-2026-05-07.md`](_RESUME-2026-05-07.md) — 46-category master list + locked decisions
3. [`_FULL-SCAN-2026-05-10.md`](_FULL-SCAN-2026-05-10.md) — comprehensive read-only sweep (340 cells, pre-Opus per-episode breakdown)
4. **Per-episode audits** — [`docs/analysis/E*_Opus_Audit.md`](../../docs/analysis/) (12 files)

---

## Per-episode summary

| Episode | File | Cells flagged | Largest bucket | Decisions pending |
|---------|------|---------------|---------------|-------------------|
| E0 | `E0_Opus_Audit.md` | 22 | Quiz Ezel cap (18) | Narrative-cap rule, J27 register |
| E1 | `E1_Opus_Audit.md` | 43 | Machine→Machien (14) | HUDO ×2, slogan-rephrase ×5 |
| E2 | `E2_Opus_Audit.md` | 60 | Boerderij→Hoeve (16) | HUDO ×5, Battle phrasing ×4, `maakt een move` |
| E3 | `E3_Opus_Audit.md` | 40 | Machine→Machien (14) | HUDO ×1, narrative-cap ×5, Sad J19 register |
| E4 | `E4_Opus_Audit.md` | 27 | Old monikers (15) | DJ welcome, slogan-rephrase J71, Dope Ass register |
| E5 | `E5_Opus_Audit.md` | 26 | Acte/Nummer (7) | Acte/Nummer, aap-itude ×2, Nijg ×2, Afspraak deal, sign-vs-speech caps |
| E6 | `E6_Opus_Audit.md` | 56 | Machine→Machien (23) | Jansen ×2, `Oh liefste Gods`, Bikkelhard short form, slogan caps |
| E7 | `E7_Opus_Audit.md` | 11 | Ezel cap (6) | — |
| E8 | `E8_Opus_Audit.md` | 10 | Gods U/Uw (8) | — |
| E9 | `E9_Opus_Audit.md` | 32 | Machine→Machien (20) | — |
| E10 | `E10_Opus_Audit.md` | 29 | Golden Ass U/Uw (9) | — |
| E11 | `E11_Opus_Audit.md` | ~52 | Italian-fallback signs (~48) | Phone gag, Jack's Anglicism, popups, asset internals |
| **TOTAL** | | **~408 cells** | | **35+ decision items** |

---

## 🚨 Cross-cutting findings (worth surfacing first)

### 1. Codex sync trigger — `Cole-Machine.dutch`

**5 corpus-wide cells reference `Piet-Machine`** — needs `Piet-Machien`:
- `0_E0` ManagerScene J15
- `0_E0` CharacterProfiles J18
- `9_E9` GoldenAss J48
- `9_E9` GoldenAss J64
- `10_E10` Credits J39

**Codex update:** `data/json/codex_verified.json` v3.3 → v3.4 — change `Cole-Machine.dutch` from `"Piet-Machine"` to `"Piet-Machien"`.
**Also sync:** `data/json/codex_translations.json`.

### 2. Sturdy lament canonical (#33) still drifted

**E6_World J142** currently: `Verdomd die kwaadaardige, zielloze, baanafpakkende, kindermoorddadige Machines.`
**Per locked canonical**: `Verdomd die slechte, zielloze, werk-afpakkende, kind-dodende Machienen.`
Full adjective swap + Machien needed (not just Machines→Machienen).

### 3. `Camion Machine` recurring hyphen issue

5 cells across E6/E7/E10 use `Camion Machine` (no hyphen). Per compound rule should be `Camion-Machien`.
- E6_World J293, J296 (Slow Ass)
- E7_Holding1 J13, J16
- E10_Government J148 (`Tank Machines... Vlieg Machines...` — also missing hyphens)

**Decision needed:** apply hyphen + Machien together, or just Machien (preserving current spacing)?

### 4. `Oh liefste Gods` — Tom's "LIEFS, DE GODEN" inquiry resolved

**E6_World J160** — Sturdy Ass reading sculpture text.
EN: `Praise be to the Gods.`
NL: `Oh liefste Gods` (drift to "Oh dearest Gods" — not literal)

Suggested: `Lof zij de Goden.` or `Geprezen zijn de Goden.` (both literal).

### 5. Narrative-text Ezel cap rule (philosophical)

Affects 5 cells E0 quiz + 1 cell E1_Stable2F J47 + 5 cells E3 100/200/300 diary = ~24 cells of **narrative/UI/quiz text** (no character speaker). Strict interpretation: cap (proper noun rule). Loose: leave (generic noun in non-character voice).
**Tom's call.**

### 6. Gemini proposals rejected per codex (5 categories)

| Gemini proposed | Codex says | Opus action |
|---|---|---|
| `Stampgast` (Kick Ass) | `Stamp Ezel` / `Stamp` | Reject — keep canon |
| `Snotezel` (Sick Ass) | `Snot Ezel` / `Snotje` | Reject — keep canon (8 cells already drifted to Snotezel — fix BACK to Snotje) |
| `Sloom` (Slow Ass) | `Slome` | Reject — only 1 cell drifted (E3 Mine1F J120) |
| Mme. Derriere `u → U` cap | Codex forbids u/uw entirely | Reject (or add patronizing exception clause) |
| `EZELSKRACHT` (slogan) | Today's lock = `EZELS EERST` | Reject Gemini direction; use today's |

### 7. Slogan rephrase pattern — 5 cells need full sentence reword

Old slogan `EZEL MACHT` was a noun phrase that fit "de EZEL MACHT". New `EZELS EERST` is a 2-word imperative chant that doesn't drop into existing structures.

Cells affected (suggested rewrites):
- **E1_Stable2F J30** Old Ass: `...wanneer onze EZEL MACHT...` → `...wanneer ons EZELS EERST...`
- **E1_Stable2F J34** Old Ass: `LAAT DE WERELD HET LICHT VAN DE EZEL MACHT ZIEN!` → `LAAT DE WERELD ONS LICHT ZIEN: EZELS EERST!`
- **E1_TheProtest J66, J76** (narration + Trusty): `Laat de wereld het licht van EZEL MACHT zien! waren Oude's laatste woorden.` → `Laat de wereld ons licht zien: EZELS EERST! waren Oude's laatste woorden.`
- **E1_TheProtest J114** Trusty: same as J34 pattern
- **E4_AstralPlaneMain J71** Old Ass: same family
- **E6_World J148, J149** (sign + Sturdy reading): `"Ezel Macht!"` → `"Ezels Eerst!"` (clean drop-in)

Other slogan cells (E4 Mine1F J23, E8 TheGods J18, E10 Credits J116, E10 ProphetSpeech J109/J111) are clean drop-ins (just `EZEL MACHT/EZELKRACHT` → `EZELS EERST` — no rephrase).

---

## 📋 Decisions queue (all still pending)

### From earlier sessions

| # | Item | Cells | Where |
|---|------|-------|-------|
| 1 | **HUDO** replacement | 9 corpus-wide | E1 ×2, E2 ×5, E3 ×1, E5 indirect |
| 2 | **Jansen** replacement | 2 | E6 BattleHard J8, E6 BadCave J55 |
| 3 | **Nijg** replacement | 2 | E5 CircusMain J167, J176 |
| 4 | **Acte vs Nummer** standardise | 7 | E5 CircusMain (5 board + 2 speech) |
| 5 | **Afspraak / deal** rule | 1 | E5 ZooCapture J25 (EN says "deal", not "Plan") |
| 6 | **DJ welcome** rephrase | 1 | E4 AstralPlaneMain J221 |
| 7 | **aap-itude pun** rework | 2 | E5 CircusMain J69, J81 |
| 8 | **Mme. Derriere u-cap exception** | 1 | E5 (Gemini flagged but unreproducible) |
| 9 | **Sturdy `, Kameraad` thinning (m2)** | 9 | Spread across E1/E3/E4/E6 — all EN-justified, decision: keep all? |

### From this Opus cycle

| # | Item | Cells | Where |
|---|------|-------|-------|
| 10 | **Narrative-text Ezel cap rule** | ~24 | E0 quiz, E1 J47, E3 100/200/300 diary |
| 11 | **Slogan sentence rephrase** | 5 | E1, E4, E6 (see #7 above) |
| 12 | **`Camion Machine` hyphen** | 5 | E6/E7/E10 (apply hyphen with Machien fix?) |
| 13 | **`Oh liefste Gods` → literal** | 1 | E6 World J160 |
| 14 | **Bleak Ass `Tank Machines` hyphen** | 1 | E10 J148 (same as #12) |
| 15 | **DJ Dope Ass register** (codex add) | — | E4 — lock as ge/gij stoner-casual? |
| 16 | **`Bikkelhard` short form** | 1 | E6 World J9 — keep short or normalize? |
| 17 | **E0_Questions player register** | 18 | UI register (`u/uw`) vs Smart Ass-style retcon (`gij`) |
| 18 | **E11 phone gag adapt** | 1 | E11 Hwy row 29 |
| 19 | **E11 Jack's Anglicism vs translation** | 2 | E11 rows 30, 49 |
| 20 | **E11 popup language** | 5 | E11 sex-accuracy popups (Italian → Dutch?) |
| 21 | **E11 asset internals** | ~5 | E11 — verify which strings are user-facing |

---

## ✅ Categories closed (re-verified clean post-Opus)

| # | Category | Status |
|---|---|---|
| 4 | Sturdy `, Kameraad` excessive use | Clean (m2 = 9 EN-justified cells, no drift) |
| 7 | Bikkeharde typo | 0 drift in xlsx (codex still drifted, see cross-cutting #1) |
| 8 | Mechalen → Technopolis | 0 drift |
| 9 | Muilegem (lowercase) | 1 stray (E3_200 J3) — fixed in batch |
| 10 | MUILEBEEK | 1 stray (E10 Credits J27) — fixed in batch |
| 11 | Bar Poepegaatje | 0 drift |
| 17 | Song of Ascension | 0 drift (canonical throughout) |
| 25 | Stenen-Spel | 0 drift |
| 26 | Sad whimper | 0 drift |
| 41 | E10 U/Uw audit | **Closed** — net work = 9 Golden Ass cap fixes only (other 23 cells legit per exception rules) |

---

## ⏳ Categories still active

| # | Category | Total drift cells | Where |
|---|---|---|---|
| 1 | Pronoun register | 5 | E3 Mine1F (Sad/Nice/Slow → Foal) |
| 6 | Old monikers | 28 | E1 ×6, E2 ×3, E3 ×4, E4 ×15 |
| 12 | Uncle Oom → Nonkel | 11 | E3 ×1, E6 ×4, E9 ×2, others |
| 13 | Boerderij → de Hoeve | ~40 | E1 ×2, E2 ×16, E3 ×1, E6 ×5, E8 ×1, E10 ×3 (note: E2 has many duplicate Welcome Sign cells) |
| 16 | Slogan EZELS EERST | 13 | Across E1/E4/E6/E8/E10 |
| 21 | Ezel capitalization | ~70 | All episodes (40 dialogue + ~24 narrative + 6 character profiles) |
| 24 | Machine → Machien | ~120 | All episodes |
| 33 | Sturdy lament canonical | 1 | E6 World J142 (full rewrite) |
| 35 | Apostrophe drift | 9 | E3 ×4, E6 ×3, E5 ×1, others |
| Gods U/Uw caps | — | 21 | E8 ×8, E9 ×4, E10 ×9 |
| New feedback (today) | — | varies | HUDO 9, Jansen 2, Nijg 2, Schup 2, doekjes 1, ezel8ig 1, J47 reorder 1, Afspraak 2 |

---

## 🛠 Recommended next steps

### Step 1 — Re-establish Google Sheets API (BLOCKING for push/pull)

`credentials.json` missing on this machine. To restore:

1. Get `credentials.json` (OAuth client ID for Google Sheets API) from secure vault — was generated previously per `_REMOTE-PUSH-BRIEF-2026-04-29.md`
2. Place at project root or per `scripts/convert/push-file.py` config
3. First-run will trigger OAuth flow → produces `token.json`
4. Verify: `python3 scripts/convert/push-file.py --check-auth` (or pull a test cell)

If `credentials.json` is lost, regenerate from Google Cloud Console:
- Project: am-fl-trans Google Cloud project
- Enable Google Sheets API
- Create OAuth 2.0 Client ID (Desktop application)
- Download → save as `credentials.json` at the path the script expects
- Add Tom's Google account to OAuth test users

### Step 2 — Three-part diff (NEW workflow)

We discussed [`_pre-pull-diff-2026-05-03.md`](_pre-pull-diff-2026-05-03.md) which was a **2-way** diff (pre-pull local snapshot vs post-pull remote). With Patrik's recent edits, we now need a **3-way** diff:

```
A = Local xlsx state (current excels/*.xlsx — what Opus audited against)
B = Remote Google Sheets state (Patrik's recent edits)
C = Opus proposed changes (~408 cells in docs/analysis/E*_Opus_Audit.md)
```

**Outputs needed per cell:**
- A == B == C → no action (rare)
- A == B, C differs → apply Opus proposal (clean batch case)
- A != B (Patrik changed) — sub-cases:
  - C == B → Patrik already fixed it (drop Opus proposal)
  - C != B but C ~= "fix variant of A" → conflict, need human review
  - C is unrelated to Patrik's change → may co-exist (apply both)
- A != B, C == A → preserve Opus proposal (Patrik's change becomes context, not blocker)

**Workflow proposal:**

1. Pull fresh remote → `excels.fresh-pull-2026-05-10/` (snapshot)
2. Diff A vs B → all 105K cells where local != remote ⇒ Patrik's editset
3. For each Patrik-edited cell, check if it intersects any of the ~408 Opus-proposed cells
4. Output: `_three-way-diff-2026-05-10.md` with conflict/co-exist/Patrik-already-fixed buckets
5. Review per-cell, then merge before any apply

**Script needed:** `scripts/editorial/three-way-diff.py`. Estimated 100 lines. Inputs: snapshot A, fresh-pull B, audit JSON output of C. Output: structured markdown diff.

### Step 3 — Decisions session (35+ items)

Collect all decision items in a single round of Q&A. Most are short. Sequence by complexity:
- Easy first: HUDO replacement, DJ welcome form, narrative-cap rule, Camion hyphen
- Medium: Jansen, Nijg, Acte/Nummer, aap-itude
- Complex: slogan sentence rephrases (5 cells need wording), Mme. Derriere codex exception, E11 entire scope

### Step 4 — Codex sync (v3.3 → v3.4)

Apply 4 known drift fixes:
- `Hard Ass.dutch` → `Bikkelharde Ezel`
- `Hard Ass.dutchShort` → `Bikkelharde`
- `Cole-Machine.dutch` → `Piet-Machien`
- `Sad Ass.verbalTics` → reference `*Boe-hoe-hoe*` form
- `Old Ass.verbalTics` → reference `EZELS EERST`

### Step 5 — Batch JSON drafting

Once decisions resolved + codex synced + 3-way diff merged, draft per-category JSON batches:

- batch-i-ezel-cap.json (~70 cells)
- batch-j-farm.json (~40 cells)
- batch-k-uncle.json (~11 cells)
- batch-p-machien.json (~120 cells) ← largest; codex sync prerequisite
- batch-o-slogan.json (~13 cells incl. 5 rephrases needing prior approval)
- batch-old-monikers.json (~28 cells)
- batch-gods-uw.json (~21 cells)
- batch-apostrophe.json (~9 cells)
- batch-pronoun-foal-exception.json (~5 cells E3)
- batch-feedback-misc.json (HUDO/Schup/doekjes/Jansen/Nijg/etc — pending decisions)
- batch-e11-signs.json (~52 cells — separate file format)
- batch-codex-sync.json (5 codex field updates)

### Step 6 — Apply + push

After all batches dry-run clean:
1. `--apply` per batch (local xlsx writes)
2. Verify per-batch with diff
3. Commit per category
4. Push to remote via `push-file.py` (requires Step 1 auth)

---

## File index

```
data/editorial/
├── _OPUS-AUDIT-COMPLETE-2026-05-10.md   ← THIS FILE (wrap-up)
├── _RESUME-2026-05-07.md                ← 46-category master list
├── _FULL-SCAN-2026-05-10.md             ← initial corpus sweep (340 cells)
├── _RESUME-2026-05-03.md                ← prior resume (legacy)
├── _corpus-scoping-2026-05-03.md        ← raw counts source
└── _pre-pull-diff-2026-05-03.md         ← 2-way diff (informational)

docs/analysis/
├── E0_Opus_Audit.md      (22 cells)
├── E1_Opus_Audit.md      (43 cells)
├── E2_Opus_Audit.md      (60 cells)
├── E3_Opus_Audit.md      (40 cells)
├── E4_Opus_Audit.md      (27 cells)
├── E5_Opus_Audit.md      (26 cells)
├── E6_Opus_Audit.md      (56 cells)
├── E7_Opus_Audit.md      (11 cells)
├── E8_Opus_Audit.md      (10 cells)
├── E9_Opus_Audit.md      (32 cells)
├── E10_Opus_Audit.md     (29 cells)
├── E11_Opus_Audit.md     (~52 cells, NonCSV file)
└── E*_Consistency_Audit.md (Gemini's earlier audits — keep for reference)

data/json/
├── codex_verified.json   ← v3.3, needs sync to v3.4 (5 fields)
└── codex_translations.json ← also needs sync
```

---

## Vault bridge note

This file lives at `data/editorial/_OPUS-AUDIT-COMPLETE-2026-05-10.md`. To bridge to the Obsidian vault, run `/connect <vault-path>` first then `obsidian-bridge:sync`.

---

*Audit cycle complete. ~408 cells stashed across 12 episodes. Awaiting decisions + 3-way diff workflow + API restore before batch application.*
