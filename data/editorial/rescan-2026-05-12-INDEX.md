# Rescan INDEX — DRIFT cells from deep-eyeball audit (2026-05-12)

_Rescan source: `data/editorial/audit-2026-05-12-deep-eyeball.md`. Every cell tagged \`DRIFT\` has been verbatim re-read from xlsx and written to per-episode rescan files. No edits performed._

## Totals

- Episodes with DRIFT: **11/11**
- Total DRIFT cells rescanned: **127**

## Per-episode breakdown

| Episode | DRIFT cells | Sheets touched | Rescan report |
|---|---|---|---|
| E0 (Manager+Intermissions+E0Proxy) | 2 | 1 | [rescan-2026-05-12-E0-drift.md](rescan-2026-05-12-E0-drift.md) |
| E1 (E1Proxy) | 22 | 6 | [rescan-2026-05-12-E1-drift.md](rescan-2026-05-12-E1-drift.md) |
| E2 (E2Proxy) | 15 | 6 | [rescan-2026-05-12-E2-drift.md](rescan-2026-05-12-E2-drift.md) |
| E3 (E3Proxy) | 8 | 6 | [rescan-2026-05-12-E3-drift.md](rescan-2026-05-12-E3-drift.md) |
| E4 (E4Proxy) | 23 | 5 | [rescan-2026-05-12-E4-drift.md](rescan-2026-05-12-E4-drift.md) |
| E5 (E5Proxy) | 25 | 4 | [rescan-2026-05-12-E5-drift.md](rescan-2026-05-12-E5-drift.md) |
| E6 (E6Proxy) | 15 | 4 | [rescan-2026-05-12-E6-drift.md](rescan-2026-05-12-E6-drift.md) |
| E7 (E7Proxy) | 5 | 4 | [rescan-2026-05-12-E7-drift.md](rescan-2026-05-12-E7-drift.md) |
| E8 (E8Proxy) | 2 | 1 | [rescan-2026-05-12-E8-drift.md](rescan-2026-05-12-E8-drift.md) |
| E9 (E9Proxy) | 1 | 1 | [rescan-2026-05-12-E9-drift.md](rescan-2026-05-12-E9-drift.md) |
| E10 (E10Proxy) | 9 | 2 | [rescan-2026-05-12-E10-drift.md](rescan-2026-05-12-E10-drift.md) |

## Reading order

Each per-episode rescan file is grouped by sheet, then by J-row. For each cell:

- **Claim** — the original deep-eyeball line (with source line number for traceability)
- **Status** — `VERIFIED` (cell re-read from xlsx) or `DISCREPANCY` (row not found)
- **Speaker / EN / NL** — verbatim from `openpyxl` re-read
- **Push** — push-log history if the cell was previously pushed; pushed value if available

## How to use this

1. Open the per-episode rescan file for the episode you're editing.
2. Each DRIFT cell shows verbatim current EN+NL — you can edit the xlsx cell directly and the claim tells you what to fix.
3. For cells with push history, double-check the push rule before editing — the cell may be in canonical-exception state.
4. After fixes land, replay the regex audit: `python3 scripts/editorial/comprehensive-audit.py`.
