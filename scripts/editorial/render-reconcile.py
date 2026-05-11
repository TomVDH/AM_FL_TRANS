#!/usr/bin/env python3
"""
render-reconcile.py — render reconcile JSON as a navigable markdown report.

USAGE
  py scripts/editorial/render-reconcile.py <reconcile.json> <out.md>
"""
import json
import sys
from pathlib import Path
from collections import Counter, defaultdict


def trunc(s, n=110):
    s = (s or '').replace('\n', '⏎')
    return s if len(s) <= n else s[:n - 1] + '…'


def main():
    if len(sys.argv) != 3:
        print('Usage: render-reconcile.py <reconcile.json> <out.md>')
        sys.exit(2)
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    data = json.loads(src.read_text(encoding='utf-8'))
    meta = data['_meta']
    totals = meta['totals']
    per_file = meta['per_file']

    lines = []
    A = lines.append

    A(f"# Reconcile report — {src.name}\n")
    A(f"> Generated from `{src}`. **{totals['conflicts']} conflicts** need user decisions.\n")
    A(f"\n**Sources**\n")
    A(f"- baseline: `{meta['baseline_dir']}` (last shared sync, 2026-05-03)")
    A(f"- ours: `{meta['ours_dir']}` (95 cells of editorial edits this cycle)")
    A(f"- theirs: `{meta['theirs_dir']}` (Patrick's GS state, pulled today)\n")

    A(f"\n## Totals\n")
    A(f"| Bucket | Count | Action |")
    A(f"|--------|------:|--------|")
    A(f"| ours_only   | {totals['ours_only']:4d} | keep, push later |")
    A(f"| theirs_only | {totals['theirs_only']:4d} | pull into local |")
    A(f"| agreed      | {totals['agreed']:4d} | no action (converged) |")
    A(f"| conflicts   | {totals['conflicts']:4d} | **manual decision per row** |")
    grand = sum(totals.values())
    A(f"| **total**   | **{grand}** | |")

    A(f"\n## Per-file breakdown\n")
    A(f"| File | ours_only | theirs_only | agreed | conflicts |")
    A(f"|------|----------:|------------:|-------:|----------:|")
    for fname in sorted(per_file):
        c = per_file[fname]
        A(f"| `{fname}` | {c['ours_only']:>3} | {c['theirs_only']:>3} | {c['agreed']:>3} | {c['conflicts']:>3} |")

    if meta.get('sheets_missing_in_theirs'):
        A(f"\n### ⚠️ Sheets in `ours` but missing in `theirs`")
        for x in meta['sheets_missing_in_theirs']:
            A(f"- `{x['file']}` :: `{x['sheet']}`")

    # Conflicts — full detail, this is the critical section
    A(f"\n---\n\n## 🚨 Conflicts ({totals['conflicts']}) — REQUIRES DECISION\n")
    A(f"Each row was edited differently in `ours` and `theirs`. Pick: **ours**, **theirs**, or hand-merge.\n")
    if not data['conflicts']:
        A(f"_None._\n")
    else:
        # Group by file for navigability
        by_file = defaultdict(list)
        for c in data['conflicts']:
            by_file[c['file']].append(c)
        for fname in sorted(by_file):
            A(f"\n### `{fname}` — {len(by_file[fname])} conflict(s)\n")
            for c in by_file[fname]:
                A(f"#### {c['sheet']} :: {c['cell']}")
                A(f"- **EN:** `{trunc(c['english'])}`")
                A(f"- **baseline:** `{trunc(c['baseline'])}`")
                A(f"- **ours:**     `{trunc(c['ours'])}`")
                A(f"- **theirs:**   `{trunc(c['theirs'])}`")
                A(f"")

    # ours_only — small enough to enumerate
    A(f"\n---\n\n## ours_only ({totals['ours_only']}) — keep, push later\n")
    A(f"Edits we made that Patrick didn't touch. Stay in local; push at Phase 5.\n")
    if not data['ours_only']:
        A(f"_None._\n")
    else:
        by_file = defaultdict(list)
        for r in data['ours_only']:
            by_file[r['file']].append(r)
        A(f"| File | Sheet | Cell | EN | baseline → ours |")
        A(f"|------|-------|------|----|-----------------|")
        for fname in sorted(by_file):
            for r in by_file[fname]:
                A(f"| `{fname}` | {r['sheet']} | {r['cell']} | {trunc(r['english'], 50)} | `{trunc(r['baseline'], 40)}` → `{trunc(r['ours'], 40)}` |")

    # theirs_only — too many to fully enumerate; per-file count + first 5 each
    A(f"\n---\n\n## theirs_only ({totals['theirs_only']}) — Patrick's edits to pull into local\n")
    A(f"Showing first 5 per file. Full list in `{src.name}` under key `theirs_only`.\n")
    by_file = defaultdict(list)
    for r in data['theirs_only']:
        by_file[r['file']].append(r)
    for fname in sorted(by_file):
        rows = by_file[fname]
        A(f"\n### `{fname}` — {len(rows)} cell(s)\n")
        A(f"| Sheet | Cell | EN | baseline → theirs |")
        A(f"|-------|------|----|-------------------|")
        for r in rows[:5]:
            A(f"| {r['sheet']} | {r['cell']} | {trunc(r['english'], 50)} | `{trunc(r['baseline'], 40)}` → `{trunc(r['theirs'], 40)}` |")
        if len(rows) > 5:
            A(f"| _…{len(rows) - 5} more in `{src.name}`_ | | | |")

    # agreed — small enough to fully list
    A(f"\n---\n\n## agreed ({totals['agreed']}) — no action\n")
    A(f"Cells both sides edited identically (we may have pushed earlier, or Patrick made same call).\n")
    if not data['agreed']:
        A(f"_None._\n")
    else:
        by_file = defaultdict(list)
        for r in data['agreed']:
            by_file[r['file']].append(r)
        A(f"| File | Sheet | Cell | baseline → both |")
        A(f"|------|-------|------|------------------|")
        for fname in sorted(by_file):
            for r in by_file[fname]:
                A(f"| `{fname}` | {r['sheet']} | {r['cell']} | `{trunc(r['baseline'], 40)}` → `{trunc(r['value'], 40)}` |")

    A(f"\n---\n\n*End of reconcile report.*\n")

    dst.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Wrote {dst}')
    print(f'  conflicts: {totals["conflicts"]}')
    print(f'  ours_only: {totals["ours_only"]}')
    print(f'  theirs_only: {totals["theirs_only"]}')
    print(f'  agreed: {totals["agreed"]}')


if __name__ == '__main__':
    main()
