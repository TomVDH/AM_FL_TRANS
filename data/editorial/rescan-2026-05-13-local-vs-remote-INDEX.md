# Local-vs-remote DRIFT diff — 2026-05-13

_Local: `excels/`_
_Remote: `excels.fresh-pull-2026-05-13-post-E5-push/` (fresh Google-Sheets pull)_

## Totals

- Total DRIFT cells diffed: **127**
- IN-SYNC: **127** (local matches remote)
- DIVERGED: **0** (local differs from remote)
- Cells where remote NL differs from local: **0** (Patrick may have re-edited)

## Per-episode breakdown

| Episode | Cells | In-sync | Diverged | Remote re-edited | Report |
|---|---|---|---|---|---|
| E0 | 2 | 2 | 0 | 0 | [rescan-2026-05-13-E0-local-vs-remote.md](rescan-2026-05-13-E0-local-vs-remote.md) |
| E1 | 22 | 22 | 0 | 0 | [rescan-2026-05-13-E1-local-vs-remote.md](rescan-2026-05-13-E1-local-vs-remote.md) |
| E2 | 15 | 15 | 0 | 0 | [rescan-2026-05-13-E2-local-vs-remote.md](rescan-2026-05-13-E2-local-vs-remote.md) |
| E3 | 8 | 8 | 0 | 0 | [rescan-2026-05-13-E3-local-vs-remote.md](rescan-2026-05-13-E3-local-vs-remote.md) |
| E4 | 23 | 23 | 0 | 0 | [rescan-2026-05-13-E4-local-vs-remote.md](rescan-2026-05-13-E4-local-vs-remote.md) |
| E5 | 25 | 25 | 0 | 0 | [rescan-2026-05-13-E5-local-vs-remote.md](rescan-2026-05-13-E5-local-vs-remote.md) |
| E6 | 15 | 15 | 0 | 0 | [rescan-2026-05-13-E6-local-vs-remote.md](rescan-2026-05-13-E6-local-vs-remote.md) |
| E7 | 5 | 5 | 0 | 0 | [rescan-2026-05-13-E7-local-vs-remote.md](rescan-2026-05-13-E7-local-vs-remote.md) |
| E8 | 2 | 2 | 0 | 0 | [rescan-2026-05-13-E8-local-vs-remote.md](rescan-2026-05-13-E8-local-vs-remote.md) |
| E9 | 1 | 1 | 0 | 0 | [rescan-2026-05-13-E9-local-vs-remote.md](rescan-2026-05-13-E9-local-vs-remote.md) |
| E10 | 9 | 9 | 0 | 0 | [rescan-2026-05-13-E10-local-vs-remote.md](rescan-2026-05-13-E10-local-vs-remote.md) |

## Interpretation

- **IN-SYNC** cells: local NL = remote NL. The DRIFT claim is still active on the live remote — fix is needed.
- **DIVERGED** cells: local NL ≠ remote NL. Either the DRIFT was already fixed remotely (Patrick or a prior push), OR local has changes not yet pushed. Inspect before applying any fix.
- **Remote re-edited**: subset of DIVERGED where the NL string itself differs — strong signal that Patrick has touched the cell since last sync.
