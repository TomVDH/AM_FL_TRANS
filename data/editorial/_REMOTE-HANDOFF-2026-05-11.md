# Remote-Machine Handoff — am-fl-trans Editorial Sweep

**Compiled:** 2026-05-11
**Branch:** `am-analysis` (commit `b73af90`, fully pushed to `origin/am-analysis`)
**Purpose:** seamless continuation of the editorial sweep on a different machine — covers env bootstrap, OAuth re-auth, decisions ledger, per-chapter audits, full script reference, and pending work.

> **Read order:** §1 quickstart (all bootstrap inline) → §10 pending → reference §3 (OAuth detail), §5 (toolchain), §7 (decisions), §11 (gotchas) as needed.

---

## §1. Quickstart on the new machine

Single uninterrupted sequence. If anything fails, jump to §3 for OAuth detail or §11 for gotchas.

```bash
# ── 1. Clone + checkout ──────────────────────────────────────────────
git clone git@github.com:TomVDH/AM_FL_TRANS.git am-fl-trans
cd am-fl-trans
git checkout am-analysis
git pull origin am-analysis

# ── 2. Python venv (Sheets toolchain) ────────────────────────────────
python3 -m venv .venv-sheets
source .venv-sheets/bin/activate
pip install -r requirements-sheets.txt

# ── 3. Get credentials.json from Google Cloud Console ────────────────
# Open: https://console.cloud.google.com/apis/credentials
# Either:
#   (a) Reuse existing OAuth project:
#       Find "OAuth 2.0 Client IDs" entry of type "Desktop" → download icon
#   (b) Fresh project (if no existing client):
#       Create project → enable "Google Sheets API" in Library
#       OAuth consent screen → External → add yourself as Test User
#       Credentials → Create OAuth client ID → Desktop app → download JSON
# Save the downloaded file as `credentials.json` at the project root
# (path: am-fl-trans/credentials.json — gitignored, do not commit)

# ── 4. Run OAuth bootstrap to generate token.json ────────────────────
python3 scripts/convert/oauth-bootstrap.py
# A browser opens. Sign in with the Google account that has EDIT access
# to the 11 project sheets. Approve scope (spreadsheets). token.json is
# written at project root.

# ── 5. Verify auth (dry-run push — no writes) ────────────────────────
python3 scripts/convert/push-file.py 1_asses.masses_E1Proxy.xlsx
# Expect: per-tab diff table, no errors.
# If RefreshError / invalid_grant: delete token.json, re-run step 4.

# ── 6. Resume work — see §10 pending decisions ───────────────────────
# 4 questions block E3: P1 (E3_100 row-mismatch), P2 (Ik Heb artifact),
# P3 (Foal-register flip), P4 (E1 FU#2 push timing).
```

---

## §2. Repo state at handoff

| | |
|---|---|
| Branch | `am-analysis` |
| HEAD | `b73af90` "chore(am-analysis): full state snapshot for remote-machine handoff" |
| Remote | `origin/am-analysis` (synced, 0 ahead/behind) |
| Commits ahead of `master` | 42 (the entire editorial chain) |
| Pushed to Sheets so far | 57 cells (E1: 16, E2: 41) |
| Verified round-trip | ✅ 100% |

**Source-of-truth:** Live Google Sheets (Patrick's working corpus). Local xlsx mirror the remote; we pull → audit → diff → push.

---

## §3. Google Sheets OAuth — fresh setup on new machine

**Why this is needed:** `credentials.json` (OAuth client secret) and `token.json` (refresh token) are gitignored — they don't travel with the repo. You'll regenerate both on this machine.

### Step A — Get `credentials.json`

You have two paths:

**Path 1 (reuse existing Cloud project, recommended):**
1. Open <https://console.cloud.google.com/apis/credentials>
2. Select the project you originally created the OAuth client in
3. Find the "OAuth 2.0 Client IDs" entry of type **Desktop**
4. Click the download icon → save as `credentials.json` at the project root
   (path: `~/Projects/.../am-fl-trans/credentials.json` — wherever you cloned)

**Path 2 (new Cloud project, fresh start):**
1. <https://console.cloud.google.com/> → create new project (or pick one)
2. Enable the **Google Sheets API**: APIs & Services → Library → "Google Sheets API" → Enable
3. APIs & Services → OAuth consent screen → External → fill minimum fields (app name, support email) → add your Google account as a Test User
4. APIs & Services → Credentials → Create Credentials → OAuth client ID → **Desktop app** → name it → Create
5. Download the JSON → save as `credentials.json` at the project root

### Step B — Generate `token.json`

```bash
source .venv-sheets/bin/activate
python3 scripts/convert/oauth-bootstrap.py
```

A browser opens. Sign in with the Google account that has **edit access** to the project's 11 sheets (the account Tom uses). Approve the scope (`spreadsheets`). The script writes `token.json` at project root.

### Step C — Verify

```bash
python3 scripts/convert/push-file.py 1_asses.masses_E1Proxy.xlsx
# Output: per-tab diff table. No errors. No "would push" if local matches remote.
```

If you see `RefreshError` or `invalid_grant`, delete `token.json` and re-run `oauth-bootstrap.py`.

### Sheet IDs (hardcoded in push-file.py — for reference only)

| File | Sheet ID |
|---|---|
| `0_asses.masses_Manager+Intermissions+E0Proxy.xlsx` | `1ScGhva1rUcwqup5rWjePK43gnvxME4mVgZvPZlIfWHQ` |
| `1_asses.masses_E1Proxy.xlsx` | `1TTUN6f_DACWw2VFxPP5sBbzKSMvpMZrG8XTsqcpw0SU` |
| `2_asses.masses_E2Proxy.xlsx` | `14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow` |
| `3_asses.masses_E3Proxy.xlsx` | `1dPFzn_FCcmgLx8HuuMcxBa4X29ixYnlbNqNkcVN95yY` |
| `4_asses.masses_E4Proxy.xlsx` | `1KzgaFaoUWE2Jv5eBfTryh8kiw944Q3MBNwtlaofpOn0` |
| `5_asses.masses_E5Proxy.xlsx` | `1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E` |
| `6_asses.masses_E6Proxy.xlsx` | `1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU` |
| `7_asses.masses_E7Proxy.xlsx` | `1evCSy0b20NNb4mfndqDVtc-xtfZ_a7bmTm2lxlpSuYA` |
| `8_asses.masses_E8Proxy.xlsx` | `1mJjvrManB-mwN-2bawLltEeRoUTq-6ch9OW5_Zyu6v0` |
| `9_asses.masses_E9Proxy.xlsx` | `1zG-g9HCyECCTzY3Yc-Un-K5I1DYAjvwD9GdHj7mle_c` |
| `10_asses.masses_E10Proxy.xlsx` | `1Q1WSEJSGm9ZPEO6bfDNpX8wqXolFhyGad-17rJzc0nw` |

---

## §4. Python venv

**Original venv:** `.venv-sheets/` (Python 3.14, gitignored).
**Exact packages:** see `requirements-sheets.txt` at project root.

```bash
python3 -m venv .venv-sheets
source .venv-sheets/bin/activate
pip install -r requirements-sheets.txt
```

Versions pinned:
```
google-auth==2.52.0
google-auth-httplib2==0.4.0
google-auth-oauthlib==1.4.0
gspread==6.2.1
oauthlib==3.3.1
openpyxl==3.1.5
requests-oauthlib==2.0.0
```

**Activation shorthand:** every time you open a new terminal: `source .venv-sheets/bin/activate`

---

## §5. Toolchain reference

All paths relative to project root.

### Editorial workflow

| Script | Purpose | CLI |
|---|---|---|
| `scripts/editorial/apply-corrections.py` | Apply a feedback JSON to local xlsx. Safety: verifies EN + current_nl before writing. Dry-run default. | `python3 scripts/editorial/apply-corrections.py <json>` (dry-run) <br> `python3 scripts/editorial/apply-corrections.py <json> --apply` (write) |
| `scripts/editorial/three-way-diff.py` | Compare Local / Patrick-snapshot / Originals per cell. Used to surface Patrick's edits before we touch anything. | `python3 scripts/editorial/three-way-diff.py` |
| `scripts/editorial/render-reconcile.py` | Render the reconcile JSON into a human-readable markdown report. | `python3 scripts/editorial/render-reconcile.py <json>` |

### Sheets sync

| Script | Purpose | CLI |
|---|---|---|
| `scripts/convert/oauth-bootstrap.py` | One-time OAuth flow. Reads `credentials.json`, writes `token.json`. | `python3 scripts/convert/oauth-bootstrap.py` |
| `scripts/convert/pull-snapshot.py` | Pull all 11 sheets to a directory via public xlsx export (no auth needed). | `python3 scripts/convert/pull-snapshot.py <out-dir>` |
| `scripts/convert/push-file.py` | Diff local J column vs remote J, batch-push changes, tint cells light green. **Use this for sweeps.** | `python3 scripts/convert/push-file.py <file.xlsx>` (dry-run) <br> `python3 scripts/convert/push-file.py <file.xlsx> --apply` (push) |
| `scripts/convert/push-tab.py` | Per-tab push (legacy, slower). Prefer push-file.py. | `python3 scripts/convert/push-tab.py <file.xlsx> <tab>` |
| `scripts/convert/download-sheets.js` | Node-based public download fallback. | `node scripts/convert/download-sheets.js` |
| `scripts/convert/excel-to-csv.js` | Excel → CSV (for ingestion into the app). | `node scripts/convert/excel-to-csv.js` |
| `scripts/convert/excel-to-json.js` | Excel → JSON (for ingestion). | `node scripts/convert/excel-to-json.js` |

### Per-episode audit scripts

| Script | Episode |
|---|---|
| `scripts/audit_e0.py` | E0 |
| (no audit_e1.py — superseded by `/tmp/am-scan-2026-05-10/scan-runner-v3.py`) | E1 |
| `scripts/audit_e2.py` | E2 |
| `scripts/audit_e3.py` | E3 |
| `scripts/audit_e4.py` | E4 |
| `scripts/audit_e5.py` | E5 |
| `scripts/audit_e6.py` | E6 |
| `scripts/audit_e7.py` | E7 |
| `scripts/audit_e8.py` | E8 |
| `scripts/audit_e9.py` | E9 |
| `scripts/audit_e10.py` | E10 |
| `scripts/audit_e11_csv.py` | E11 (CSV-only) |
| `scripts/audit_muilegem.py` | Place-name cross-cut |
| `scripts/check_u_subject.py` | u/uw pronoun usage cross-cut |

Each `audit_eN.py` opens the corresponding xlsx, walks all tabs, applies rules from the criteria list (§A–§N — see `_CRITERIA-FULL-LIST-2026-05-10.md`), and flags rows.

### One-off utilities

| Script | Purpose |
|---|---|
| `scripts/gen_rollback.py` | Generate a rollback JSON from a before/after snapshot pair. |
| `scripts/map_target_sheets.py` | Map cell references to remote sheet tab IDs. |
| `scripts/gemini-locate.py` | Sentence locator used during Gemini cross-checks. |

### Repo-level

| File | Purpose |
|---|---|
| `requirements-sheets.txt` | pip freeze for `.venv-sheets/`. |
| `GEMINI.md` | Project mission + voice rules for Gemini sessions. |
| `data/json/codex_verified.json` | v3.4 — locked character data, pronouns, monikers, verbalTics. **Source of truth for voice.** |
| `data/json/codex_translations.json` | v2.1 — mirror with translation-side fields. |

---

## §6. Standard workflow

The cycle is the same every time:

```
┌─ 1. PULL remote ────────┐
│  python3 scripts/convert/pull-snapshot.py excels.fresh-pull-$(date +%F)
│  Diff against local xlsx to see what Patrick changed.
└────────────────────────┘

┌─ 2. SCAN ──────────────┐
│  Run the relevant audit_eN.py OR /tmp/am-scan-2026-05-10/scan-runner-v3.py
│  Output: list of flagged cells with rule attribution.
└────────────────────────┘

┌─ 3. STAGE JSON ────────┐
│  Build/edit feedback-2026-MM-DD-EN.json with corrections.
│  Each correction has: id, file, sheet, cell, speaker, english, current_nl, proposed_nl, rationale
└────────────────────────┘

┌─ 4. DRY-RUN ───────────┐
│  python3 scripts/editorial/apply-corrections.py <json>
│  Read output: ✓ = match, ⚠️ = current_nl mismatch (stale), ❌ = EN mismatch (row drift)
│  Fix JSON until all ✓.
└────────────────────────┘

┌─ 5. APPLY LOCAL ───────┐
│  python3 scripts/editorial/apply-corrections.py <json> --apply
│  git diff excels/ to verify.
└────────────────────────┘

┌─ 6. PUSH SAFETY CHECK ─┐
│  python3 scripts/convert/push-file.py <xlsx>      (no --apply)
│  Reads remote, diffs per-cell, shows EXACTLY what will be pushed.
│  *** USER CONFIRMATION REQUIRED BEFORE STEP 7 ***
└────────────────────────┘

┌─ 7. PUSH ──────────────┐
│  python3 scripts/convert/push-file.py <xlsx> --apply
│  Writes changes + tints cells light green.
└────────────────────────┘

┌─ 8. ROUND-TRIP VERIFY ─┐
│  python3 scripts/convert/pull-snapshot.py excels.verify-$(date +%F)
│  Diff verify dir vs local — should be 0 changes.
└────────────────────────┘

┌─ 9. LOG ───────────────┐
│  Append to data/editorial/_PUSH-LOG.md:
│  - cell coords, EN, Original (May 3), Was (pre-push), Pushed, Rule
└────────────────────────┘
```

**Locked rules:**
- Dry-run before apply, always.
- Push safety check before push, always — Tom's hard requirement: "we cannot falter on that".
- Per-cell EN + NL always shown in chat readouts. Always include speaker names.
- Ultrasafe option always wins ambiguous calls.
- Per-episode sequential E0→E10 (Option A locked).

---

## §7. Decisions ledger

Full master list: `data/editorial/_CRITERIA-FULL-LIST-2026-05-10.md` (70 criteria, sections A–P).
Latest refined decisions: `data/editorial/_RESUME-2026-05-07.md` (under "Inverted / refined decisions").

### Locked corpus-wide decisions

| # | Decision | Value | Notes |
|---|---|---|---|
| D1 | Slogan | **EZELS EERST** | Replaces earlier "EZELS FØRST". Locked in codex Old Ass `verbalTics`. |
| D2 | Place names | **Muilenbeek** (with extra `n`) | Patrick used `Muilebeek`. Q3 lock wins corpus-wide. |
| D3 | Outhouse | **De Plee** | Replaces `De Hudo` everywhere. |
| D4 | Heritage Stable | **Erfgoedstal** | Original `Erfgoedshoeve` was mistranslation (means "Heritage Farm"). Stable → Stal. |
| D5 | Farm | **De Hoeve** (or `Hoeve`) | Replaces `Boerderij` in place-name contexts. |
| D6 | Ezel capitalisation | **Cap everywhere** | `ezel` → `Ezel`, `ezeltje` → `Ezeltje`, `ezelinnekes` → `Ezelinnekes`. |
| D7 | Sad whimper | `*boe-hoe-hoe*` | Lowercase `b`. Overrides earlier `*Boe-hoe-hoe*` from batch f. |
| D8 | Machine spelling | **Machine** kept | Reversed earlier `Machien` plan. `Piet-Machine` stays. |
| D9 | `nie` universal | `niet` (Option A) | All `nie` → `niet`. Exception: Thirsty Ass may keep `nie'` (apostrophe form) per his elision style. |
| D10 | Hard Ass long form | **Bikkelharde Ezel** | Corrects `Bikkeharde` (missing `L`). |
| D11 | Hemelvaarts-zang | `het Hemelvaarts-zang-der-Ezel-zielen` | Article: `het` (neuter). |
| D12 | Sturdy/Kameraad tag | Strip when EN has no `, Comrade` | Keep when EN-justified. Batch m. |
| D13 | Sick Ass | **Triestige Ezel** / `Triestige` | Reject `Snotezel`. |
| D14 | Slow Ass | (codex name) | Reject `Sloom` and `Stampgast`. |
| D15 | Peek Ass | **Constaterende Ezel** | Codex v2.1. |
| D16 | Blunt Ass | **Groffe Ezel** | Codex v2.1. |
| D17 | Schoon Beest | **Preserve** for Thirsty Ass → Nice Ass only | Patrick flattened to Lieve Ezel; restore as Thirsty's signature nickname. E1 J29, E2 J46, E4 J62. |
| D18 | Nijg → fel | `fel` wins | (Decision 3, 2026-05-10) |
| D19 | DJ welcome line | Option E | (2026-05-10) |
| D20 | Aap-itude | keep current | (2026-05-10) |
| D21 | Afspraak | keep | (2026-05-10) |
| D22 | Narrative Ezel | cap everywhere | (2026-05-10, == D6) |
| D23 | Goden | `Geprezen zijn de Goden` (option b) | (2026-05-10) |
| D24 | Jansen — E6J8 | `gulle` | |
| D25 | Jansen — E6J55 | `Kleine` | |
| D26 | Nummer | use `Nummer` (full form) | |
| D27 | Stopt → Stop register | Nice Ass uses `je/jij`, so `stop` (not `stopt` gij-imperative) | E2_Confession J4 fixed. |
| D28 | Patrick's J14 SCHEP revert | `EET DEZE SCHEP, KLOOTZAKSKE!!` | Patrick's "EET MIJN SCHEP OP" was awkward Dutch. |
| D29 | EN co-authority | EN source-of-truth co-authoritative in NL reconciles | A candidate that doesn't translate the EN loses, even grammatically clean. (User-memory entry) |

### Pending decisions (block further pushes)

| # | Question | Affects |
|---|---|---|
| P1 | E3_100 row-mismatch (J5, J16) — EN ≠ current NL: investigate ±2 rows or fix-in-place trusting EN? | E3 batch generation |
| P2 | Patrick `Ik [Capital]` artifact direction: (a) `'k Heb`/`'k Ben` Flemish, (b) `Ik heb`/`Ik ben` Standard Dutch, (c) leave alone | E3+ batches |
| P3 | Foal-register flip (5 cells confirmed?) — `uw`/`u`/`Ge` → `je`/`jou`/`Je` for Sad Ass J19, Nice Ass J30/J33/J34, Slow Ass J121, Foal E3_BadCave J20 | E3 batch generation |
| P4 | E1 follow-up #2 (J25 Thirsty Ass `nie' volscheppen` → `niet volscheppen`, 1 cell) push timing — standalone or bundled with E3? | E1 closure |

---

## §8. Per-chapter audits

All under `docs/analysis/`. For each episode, there are two files:

- `EN_Consistency_Audit.md` — initial mechanical audit (categorical rule passes)
- `EN_Opus_Audit.md` — opus-cycle deep audit (line-by-line with EN context)
- `EN_Opus_Audit_v2.txt` — post-Patrick re-audit after his edits landed

| Episode | Files | Status |
|---|---|---|
| E0 | `E0_Consistency_Audit.md`, `E0_Opus_Audit.md`, `E0_Opus_Audit_v2.txt` | Audited; not yet swept |
| E1 | `E1_Consistency_Audit.md`, `E1_Opus_Audit.md`, `E1_Opus_Audit_v2.txt` | ✅ 16 cells pushed; 1 follow-up staged (J25 nie→niet) |
| E2 | `E2_Consistency_Audit.md`, `E2_Opus_Audit.md`, `E2_Opus_Audit_v2.txt` | ✅ 41 cells pushed |
| E3 | `E3_Consistency_Audit.md`, `E3_Opus_Audit.md`, `E3_Opus_Audit_v2.txt` | Audited; ~38 cells flagged; BLOCKED on P1/P2/P3 |
| E4 | `E4_Consistency_Audit.md`, `E4_Opus_Audit.md`, `E4_Opus_Audit_v2.txt` | Audited; 1+ known cells; J62 Schoon Beest restoration pending |
| E5 | `E5_Consistency_Audit.md`, `E5_Opus_Audit.md`, `E5_Opus_Audit_v2.txt` | Audited |
| E6 | `E6_Consistency_Audit.md`, `E6_Opus_Audit.md`, `E6_Opus_Audit_v2.txt` | Audited; 11 nie cells; Jansen decisions locked (D24/D25) |
| E7 | `E7_Consistency_Audit.md`, `E7_Opus_Audit.md`, `E7_Opus_Audit_v2.txt` | Audited; 1 nie cell |
| E8 | `E8_Consistency_Audit.md`, `E8_Opus_Audit.md`, `E8_Opus_Audit_v2.txt` | Audited |
| E9 | `E9_Consistency_Audit.md`, `E9_Opus_Audit.md`, `E9_Opus_Audit_v2.txt` | Audited |
| E10 | `E10_Consistency_Audit.md`, `E10_Opus_Audit.md`, `E10_Opus_Audit_v2.txt` | Audited; 5 nie cells |
| E11 | `E11_Consistency_Audit.md`, `E11_Opus_Audit.md` (CSV) | **Critical:** 52 Italian-fallback NonCSV cells flagged |

### Cross-episode reference docs (under `data/editorial/`)

| File | Purpose |
|---|---|
| `_CRITERIA-FULL-LIST-2026-05-10.md` | 70-criterion master list (A–P). Use as reference when scanning. |
| `_RESUME-2026-05-07.md` | 46-cat list + decisions lock + batch queue. Older but still authoritative for §A–N. |
| `_FULL-SCAN-2026-05-10.md` | Single-pass full-corpus scan dump from 2026-05-10. |
| `_OPUS-AUDIT-COMPLETE-2026-05-10.md` | Consolidated Opus audit summary. |
| `_OPUS-AUDIT-v2-POST-PATRICK-2026-05-10.md` | Re-audit after Patrick's edits landed. |
| `_THREE-WAY-DIFF-2026-05-10.md` | Local / Patrick / Originals diff (118 local vs 449 Patrick, 53 conflicts). |
| `_FOUR-WAY-DIFF-2026-05-10.md` | Local / Patrick-snapshot / Live-Remote / Originals — 469/53/388. |
| `_PATRICK-PLAY-BY-PLAY-2026-05-10.txt` | Patrick's edits annotated per cell. |
| `_PUSH-LOG.md` | Permanent record of pushes — cell, EN, Original, Was, Pushed, Rule. |
| `_PROJECT_MISSION.md` | Project doctrine. |

---

## §9. Feedback JSON catalog

Naming: `feedback-YYYY-MM-DD-<scope>.json` under `data/editorial/`.

### 2026-05-10 cycle (current)

| File | Cells | Status | Scope |
|---|---|---|---|
| `feedback-2026-05-10-E1.json` | 16 | ✅ pushed | E1 Farm/FarmHouseInt/TheProtest main sweep |
| `feedback-2026-05-10-E1-followup.json` | 1 | ✅ pushed | E1_Farm J29 Thirsty Schoon Beest restore |
| `feedback-2026-05-10-E1-followup2.json` | 1 | ⏳ staged | E1_Farm J25 Thirsty nie→niet |
| `feedback-2026-05-10-E2.json` | 41 | ✅ pushed | E2 main + J14 SCHEP revert + J46 Schoon Beest |

### 2026-05-07 cycle

| File | Cells | Status |
|---|---|---|
| `feedback-2026-05-07-e1-farm.json` | — | Drafted, superseded by 2026-05-10 |
| `feedback-2026-05-07-e1-sweep.json` | — | Drafted |
| `feedback-2026-05-07-e2-sweep.json` | — | Drafted, superseded |
| `feedback-2026-05-07-e3-sweep.json` | — | Drafted (now blocked on P1–P3) |
| `feedback-2026-05-07-e4-sweep.json` | — | Drafted |
| `feedback-2026-05-07-e5-sweep.json` | — | Drafted |
| `feedback-2026-05-07-e6-sweep.json` | — | Drafted |
| `feedback-2026-05-07-e10-sweep.json` | — | Drafted |
| `feedback-2026-05-07-muilengem.json` | — | Drafted (place-name cross-cut, now rolled into D2) |

### 2026-05-03/04 cycle (Phase wave 1)

| File | Cells | Status |
|---|---|---|
| `feedback-2026-05-03-mechalen.json` | 30 | Applied |
| `feedback-2026-05-03-stenen-spel.json` | 12 | Applied |
| `feedback-2026-05-03-poepegaatje.json` | 5 | Applied |
| `feedback-2026-05-03-sad-whimper.json` | 18 | Applied (lowercase b per D7) |
| `feedback-2026-05-03-song.json` / `-song-article.json` | 7 / 3 | Applied (het lock per D11) |
| `feedback-2026-05-03-bikkelharde.json` | 3 | Applied (per D10) |
| `feedback-2026-05-03-asshandlers.json` | 0 | Skipped — already applied remote |
| `feedback-2026-05-04-kameraad.json` | 14 | Applied (D12) |
| `feedback-2026-05-04-slow-en.json` | 1 | Applied (English bleed fix) |

### Phase-C closeouts (2026-04-29 cycle)

Per-character corrections JSONs: `big-ass-`, `smart-ass-`, `sturdy-ass-`, `hard-ass-`, `nice-ass-`, `thirsty-ass-`, `bad-ass-`, `old-ass-`, `sick-ass-`, `lazy-ass-`, `kick-ass-`, `sad-ass-`, `slow-ass-`, `cole-machine-`, `trusty-`. All applied during Phase-C.

### Reconcile / rollback

| File | Purpose |
|---|---|
| `reconcile-2026-05-08.json` | Patrick-merge reconciliation |
| `reconcile-residual-2026-05-08.json` | Residue post-reconcile |
| `rollback-muilengem.json` | Rollback for an earlier Muilengem misapplication |
| `codex-sync-2026-05-10.json` | Codex v3.4 sync changelog |

---

## §10. Pending work — pick up here

### Immediate (4 decisions block E3)

1. **P1 — E3_100 row-mismatch.** Open `excels/3_asses.masses_E3Proxy.xlsx`, sheet `E3_100`, inspect rows 5 and 16. EN ≠ current NL. Either Patrick row-shifted (in which case shift back) or trust EN as truth and fix in place.
   - J5  EN: `Whoa... what an enchanting place.` | NL: `Het stinkt hier naar de pis!`
   - J16 EN: `What a beautiful place.` | NL: `Wat een rotplek...`
2. **P2 — Patrick `Ik Heb` / `Ik Ben` artifact.** Mid-sentence capitalised `Ik`. Pick: (a) `'k Heb` Flemish contraction (matches Hard/Bad/Thirsty), (b) `Ik heb` ABN, (c) leave alone.
3. **P3 — Foal-register flip (5 cells).** Confirm `uw`/`u`/`Ge` → `je`/`jou`/`Je` for the 5 listed cells.
4. **P4 — E1 FU#2 push timing.** Push 1-cell standalone or bundle with E3 push?

### Then (sequential E0→E10 + E11)

| Episode | Action |
|---|---|
| E0 | Generate batch JSON from `E0_Opus_Audit_v2.txt`, push. |
| E3 | Once P1–P3 land: generate batch from `E3_Opus_Audit_v2.txt` (~38 cells), push. |
| E4 | Generate batch including E4_HerdSplits J62 Schoon Beest restoration. |
| E5 | Generate batch from audit. |
| E6 | Generate batch (11 nie cells + Jansen D24/D25). |
| E7 | Generate batch (1 nie cell + audit findings). |
| E8 | Generate batch. |
| E9 | Generate batch. |
| E10 | Generate batch (5 nie cells + audit findings). |
| E11 | **Critical:** 52 Italian-fallback NonCSV cells. Approach: investigate fallback chain — are these legitimate or upstream defect? |

### Permanent additions to audit code

These rules surfaced during the cycle and should be baked into `audit_eN.py` (not yet done):

- **Heritage Stable mistranslation** — flag `Erfgoedshoeve` when EN mentions `Stable` (rule already in `/tmp/am-scan-2026-05-10/scan-runner-v3.py`).
- **`nie → niet`** — flag any bare `nie` outside Thirsty Ass; flag `nie'` (apostrophe) for any speaker other than Thirsty.
- **Schoon Beest preservation** — only Thirsty Ass may use this nickname for Nice Ass; flag if any other speaker uses it.
- **Muilebeek (missing n)** — flag in favour of Muilenbeek.
- **`Ik [Capital]` mid-sentence** — depends on P2 resolution.

### Final actions

- Commit applied changes to xlsx (already covered by `b73af90` baseline; future apply-batches need their own commits).
- Push log appended per push.
- Once all 11 episodes pushed: final commit + tag.

---

## §11. Gotchas & failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `apply-corrections.py` reports `⚠️ current_nl mismatch` | Local xlsx drifted from JSON's expected current value (often: Patrick edited remote, you pulled, JSON is stale) | Re-pull remote, update `current_nl` in JSON to match, re-dry-run |
| `apply-corrections.py` reports `❌ EN mismatch` | Row drift (insert/delete shifted rows) | Open xlsx, find the EN, update `cell` in JSON OR investigate (could be row-shift bug) |
| `push-file.py` shows unexpected diffs | Remote was edited after local apply | STOP. Re-pull. Decide whether to keep remote edit or override (Tom's call) |
| `oauth-bootstrap.py` fails with `redirect_uri_mismatch` | OAuth client was set up as Web app, not Desktop app | Re-create as Desktop type in Cloud console |
| `push-file.py` fails `RefreshError` | `token.json` corrupted/expired | Delete `token.json`, re-run `oauth-bootstrap.py` |
| `gspread.exceptions.APIError: [429] RESOURCE_EXHAUSTED` | Sheets API quota hit | Wait 60s, retry. `push-file.py` already has `CALL_GAP = 1.1s` |
| `KeyError: file` in apply-corrections | JSON missing per-correction `file` field | Add `"file": "N_asses.masses_ENProxy.xlsx"` per correction (was a previous bug) |
| Heritage Stable cells stuck as Erfgoedshoeve | Old audit missed the rule | v3 scanner has it (D4); confirm flag count before push |

### Always-on safety rules

1. **Never push without user confirmation** of what's local-changing vs remote-current.
2. **Never overwrite a Patrick edit** without explicit decision. Patrick is senior editor — defer to substantive rewrites; stack consistency on top.
3. **Always include speaker name + EN + full NL** in chat readouts.
4. **Ultrasafe option always wins** ambiguous calls.
5. **Per-episode sequential E0→E10** locked (Option A).

---

## §12. Key reference paths (cheatsheet)

```
# Code
scripts/editorial/apply-corrections.py
scripts/editorial/three-way-diff.py
scripts/convert/oauth-bootstrap.py
scripts/convert/pull-snapshot.py
scripts/convert/push-file.py
scripts/audit_eN.py            (per episode)
/tmp/am-scan-2026-05-10/scan-runner-v3.py   (NOT in repo — regenerate if needed)

# State / data
data/json/codex_verified.json           (v3.4 — voice truth)
data/json/codex_translations.json       (v2.1 — translation mirror)
excels/*.xlsx                           (local working copy)
excels/Originals/*.xlsx                 (pre-edit baseline)
excels.fresh-pull-2026-05-11/           (last pull from remote)
excels.local-pre-resync-2026-05-10/     (pre-resync baseline)

# Docs
data/editorial/_REMOTE-HANDOFF-2026-05-11.md      ← this file
data/editorial/_CRITERIA-FULL-LIST-2026-05-10.md  (70 criteria)
data/editorial/_RESUME-2026-05-07.md              (46-cat master + decisions)
data/editorial/_PUSH-LOG.md                       (push record)
docs/analysis/EN_{Consistency,Opus}_Audit{,v2}.md (per episode)

# Auth (NOT in repo — regenerate on this machine)
credentials.json
token.json
.venv-sheets/
```

---

## §13. Suggested opener for next chat

> Continuing am-fl-trans editorial sweep on a new machine. Branch `am-analysis` at `b73af90`. OAuth re-established locally. Per `_REMOTE-HANDOFF-2026-05-11.md` §10, 4 pending decisions block E3: P1 (E3_100 row-mismatch), P2 (Patrick `Ik Heb` artifact direction), P3 (Foal-register flip 5 cells), P4 (E1 FU#2 push timing). Walk me through them one at a time.
