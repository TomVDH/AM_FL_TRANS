# Remote push brief — Google Sheets sync (2026-04-29)

**Audience:** a fresh Claude session on the remote machine that has Google Sheets API access (`token.json` present) and is being asked to push the local `am-analysis` xlsx state to the remote Sheets.

**Read this end-to-end before running anything.**

---

## What you're pushing

The `am-analysis` branch holds the Phase-C editorial pass + post-Phase-C residue sweeps for the Dutch (Flemish) translation of *Asses & Masses*. Approximately **569 cells differ from `excels/Originals/`**, all in **column J (the NL translation column)** across 11 xlsx files, ~53 sheets.

You are pushing **column J only**. Everything else (EN, keys, descriptions) is unchanged.

---

## Pre-flight checks

1. **You're on the right branch and up to date:**
   ```bash
   cd /path/to/AM_FL_TRANS
   git fetch origin
   git status                # working tree should be clean
   git log --oneline -3      # latest commit should mention quote-fix or push tooling
   git pull --ff-only origin am-analysis
   ```

2. **Auth artifact present:**
   ```bash
   ls -la token.json   # must exist at project root
   ```
   If missing, the OAuth refresh flow needs setup — that's outside this brief.

3. **Python env has `gspread` + `openpyxl`:**
   ```bash
   py -c "import gspread, openpyxl; print('ok')"
   ```
   If not: `py -m pip install gspread google-auth google-auth-oauthlib openpyxl`.

4. **The push scripts exist:**
   ```bash
   ls scripts/convert/push-file.py scripts/convert/push-tab.py
   ```

5. **No Excel processes have any of the xlsx files open** (Windows lockfiles look like `excels/~$X.xlsx`):
   ```bash
   ls excels/~$* 2>/dev/null   # should be empty
   ```

---

## The push tools

### `scripts/convert/push-file.py` — batch per file (preferred)

```
py scripts/convert/push-file.py <file.xlsx>            # dry-run (no writes)
py scripts/convert/push-file.py <file.xlsx> --apply    # writes + tints green
```

Behavior per tab in the xlsx:
- Reads local column J
- Reads remote column J via Google Sheets API
- Diffs row-by-row
- For tabs with diffs: 2 API calls — one batch write of all changed cells, one batch tint to light green (`#D9EAD3`) so the remote shows you exactly which cells got pushed
- 1.1 s gap between API calls to stay under quota
- Header guard: aborts if local J1 ≠ `"NL"` (defensive against column-layout drift)

### `scripts/convert/push-tab.py` — interactive per cell (for one-off review)

```
py scripts/convert/push-tab.py <file.xlsx> <tab_name>
```
Prompts you for each diff cell with EN / WAS / NOW + Enter / s / q. Use this only if you want to eyeball a specific scene before pushing.

### Inverse direction (do NOT run unless asked)

`scripts/convert/download-sheets.js` exists for the Sheets → xlsx pull. **Do not run it during a push session** — it would clobber the local state we're trying to publish.

---

## Recommended push order (descending file size, hottest content first)

The 11 files mapped to their sheet IDs are hardcoded in both push scripts (so you don't need to look them up). Push order — heaviest-touched files first so any rate-limit or auth issue surfaces early:

| # | File | Approx cells changed |
|---|---|---|
| 1 | `6_asses.masses_E6Proxy.xlsx` | ~107 |
| 2 | `0_asses.masses_Manager+Intermissions+E0Proxy.xlsx` | ~93 |
| 3 | `3_asses.masses_E3Proxy.xlsx` | ~65 |
| 4 | `1_asses.masses_E1Proxy.xlsx` | ~61 |
| 5 | `4_asses.masses_E4Proxy.xlsx` | ~52 |
| 6 | `7_asses.masses_E7Proxy.xlsx` | ~40 |
| 7 | `9_asses.masses_E9Proxy.xlsx` | ~29 |
| 8 | `10_asses.masses_E10Proxy.xlsx` | ~28 |
| 9 | `5_asses.masses_E5Proxy.xlsx` | ~24 |
| 10 | `2_asses.masses_E2Proxy.xlsx` | ~22 |
| 11 | `8_asses.masses_E8Proxy.xlsx` | 1 |

Detailed per-tab breakdown lives in `data/editorial/_import-summary-2026-04-29.md`.

---

## Suggested execution flow

For each file, **dry-run first**, eyeball the diff list, then `--apply`:

```bash
# Example: heaviest file
py scripts/convert/push-file.py 6_asses.masses_E6Proxy.xlsx
# scan output. If counts look sane (~107 cells), then:
py scripts/convert/push-file.py 6_asses.masses_E6Proxy.xlsx --apply
```

Walk all 11 files. Total expected cells pushed: ~569.

If you want the full thing scripted (with confirmation between each file), do this — but **don't run blindly**, prompt the user between files:

```bash
for f in 6 0 3 1 4 7 9 10 5 2 8; do
  fname=$(ls excels/${f}_asses* | head -1)
  echo ""
  echo "==== Dry-run: $fname ===="
  py scripts/convert/push-file.py "$(basename $fname)"
  read -p "Apply? [y/N] " ans
  if [ "$ans" = "y" ]; then
    py scripts/convert/push-file.py "$(basename $fname)" --apply
  fi
done
```

---

## What "success" looks like

After pushing one file, on the remote Google Sheet you should see:
- All edited cells in column J now match the local xlsx
- Those cells have a light-green background (`#D9EAD3`)
- Other columns untouched, other tabs untouched
- Subsequent dry-runs of the same file should report `0 diff(s)` — confirms idempotent

If a tab reports diffs you didn't expect, **stop and investigate** — the local xlsx may have drifted from your last known state.

---

## Things that should NOT happen

- **Do not edit any xlsx** during the push session — `openpyxl read_only` won't conflict, but if Excel re-saves underneath you, the diff snapshot becomes stale.
- **Do not skip the dry-run.** The diff list is the only sanity check before writing to the remote.
- **Do not push without the green-tint step** (the script does both batch-write and batch-tint in sequence — let it complete each tab fully before moving on; an aborted tab leaves a partial state).
- **Do not commit `token.json`** — it's in `.gitignore` already (added in commit `ba47aa5`).

---

## If something fails

- **`gspread.exceptions.APIError` 429 (rate limit):** the 1.1 s gap should prevent this, but if you hit it, wait 60 s and re-run — the script's safety gate (J1 = "NL" header check) means re-running is safe.
- **`gspread.exceptions.WorksheetNotFound`:** a tab in the local xlsx doesn't exist on the remote. Skip and report — likely a sheet rename on the remote we need to know about.
- **Auth error on `token.json`:** the OAuth refresh failed. Re-run any gspread CLI command that triggers re-auth, or regenerate `token.json` via the original OAuth flow (outside this brief).
- **Local Excel lockfile `~$X.xlsx`:** ask the user to close that workbook in Excel before re-trying.

---

## State this brief assumes

- Branch `am-analysis` at HEAD includes:
  - All Phase-C corrections (commit `0553218`)
  - Post-Phase-C residue sweep pt1 — 37 cells (commit `31df687`)
  - Post-Phase-C residue sweep pt2 — 8 cells (case-insensitive `*-Zak`) (commit `da1a816`)
  - Push tooling (commit `ba47aa5`)
  - Quote-fix sweep — 11 cells (the most recent commit)
- All xlsx files are gitignored at the pattern level but force-added to the repo (so they're tracked but `git add excels/X.xlsx` requires `-f`).

---

## When done

Report back to the user (Tom):
1. How many cells got pushed per file (the script prints `[APPLIED] X cells across Y tabs` at the end of each --apply run)
2. Any tabs that were skipped (with reason)
3. Confirmation that follow-up dry-runs report `0 diff(s)`
4. Any rate-limit or auth issues encountered

Do not declare "all clean" without re-running each `push-file.py` (no --apply flag) and getting `0 diff(s)` back. That's the only definitive check that the remote matches local.
