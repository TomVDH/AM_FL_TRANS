#!/usr/bin/env python3
"""
gemini-locate.py — Project file map for Gemini (and any AI session pickup).

Prints a structured summary of:
  - All correction JSONs with cell counts and applied/pending status
  - All xlsx source files with sheet names
  - Key editorial docs with modification dates
  - Git log (last 10 commits)
  - Pending batch checklist

Usage:
    python3 scripts/gemini-locate.py
    python3 scripts/gemini-locate.py --xlsx-detail   # include sheet names per xlsx
    python3 scripts/gemini-locate.py --json           # emit machine-readable JSON
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
EDITORIAL = ROOT / "data" / "editorial"
EXCELS = ROOT / "excels"

# Batches that have been applied — update this list as batches land
APPLIED_BATCHES = {
    "feedback-2026-04-29.json",
    "feedback-2026-05-03-asshandlers.json",
    "feedback-2026-05-03-bikkelharde.json",
    "feedback-2026-05-03-mechalen.json",
    "feedback-2026-05-03-poepegaatje.json",
    "feedback-2026-05-03-sad-whimper.json",
    "feedback-2026-05-03-song-article.json",
    "feedback-2026-05-03-song.json",
    "feedback-2026-05-03-stenen-spel.json",
    "feedback-2026-05-04-kameraad.json",
    "feedback-2026-05-04-slow-en.json",
}

PENDING_BATCHES = [
    {"id": "e2",      "label": "Muilenbeek",          "cells_est": 24,  "notes": "MUILEBEEK + Muilegemmers demonym — include all variants"},
    {"id": "h",       "label": "Hie/Haa",              "cells_est": 14,  "notes": "Hee→Hie, Haw→Haa; verify split-line cases"},
    {"id": "i",       "label": "Ezel caps",            "cells_est": 57,  "notes": "lowercase ezel(s) → Ezel; exclude quiz/trivia contexts"},
    {"id": "j",       "label": "Farm/Stable rename",   "cells_est": 36,  "notes": "Boerderij→de Hoeve (31); Stal only when literally the stable"},
    {"id": "k",       "label": "Uncle Nonkel/Oom",     "cells_est": 34,  "notes": "Nonkel (all) / Oom (Smart Ass only) — ⚠️ inverts prior 'Oom everywhere'"},
    {"id": "l",       "label": "Sturdy motto devs",    "cells_est": None,"notes": "Non-canonical lament deviations only; KWAADAARDIG! emphatic stays"},
    {"id": "m2",      "label": "Stevige Kameraad",     "cells_est": None,"notes": "Sturdy-specific Kameraad issues; own batch (Q5 locked)"},
    {"id": "o",       "label": "Ass Power slogan",     "cells_est": 13,  "notes": "EZELSKRACHT AAN DE MACHT (full) / EZELSKRACHT a/d MACHT (compact)"},
    {"id": "p",       "label": "Machine→Machien",      "cells_est": 118, "notes": "Largest batch; all compounds; plural=Machienen; codex sync after"},
    {"id": "q",       "label": "VAZAL asset",          "cells_est": None,"notes": "AFGEVAARDIGDE→VAZAL; asset pipeline (not cell-level)"},
    {"id": "E10-pron","label": "E10 U/Uw audit",       "cells_est": 32,  "notes": "Map exception cases (seniors/gods/Foal) before batch; Golden Ass 11, Cole-Machine 8"},
    {"id": "e6-scope","label": "E6 drift scope",       "cells_est": None,"notes": "Repeated-line inconsistencies (UI vs expression sheets)"},
    {"id": "invest",  "label": "Constaterende Ezel",   "cells_est": None,"notes": "Corpus search; close if no hits"},
    {"id": "typos",   "label": "E10_WordsComplete",    "cells_est": None,"notes": "Per-screenshot typos; Tom flagged"},
]

KEY_DOCS = [
    "_RESUME-2026-05-07.md",           # ← current handoff (supersedes May-3)
    "_RESUME-2026-05-03.md",           # ← prior resume (keep for batch ref)
    "_corpus-scoping-2026-05-03.md",
    "_batch-mn-scoping-2026-05-04.md",
    "_feedback-2026-04-29-reverification.md",
    "_pre-pull-diff-2026-05-03.md",
    "_idiom-bank-2026-05-03.md",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def mtime(path: Path) -> str:
    try:
        ts = path.stat().st_mtime
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M")
    except Exception:
        return "?"


def git_log(n: int = 10) -> list[str]:
    try:
        result = subprocess.run(
            ["git", "-C", str(ROOT), "log", "--oneline", f"-{n}"],
            capture_output=True, text=True, timeout=5
        )
        return result.stdout.strip().splitlines()
    except Exception:
        return ["(git unavailable)"]


def load_feedback_json(path: Path) -> dict:
    try:
        with open(path) as f:
            return json.load(f)
    except Exception as e:
        return {"_error": str(e)}


def xlsx_sheets(path: Path) -> list[str]:
    try:
        import openpyxl
        wb = openpyxl.load_workbook(str(path), read_only=True, data_only=True)
        sheets = wb.sheetnames
        wb.close()
        return sheets
    except Exception as e:
        return [f"(error: {e})"]


# ---------------------------------------------------------------------------
# Sections
# ---------------------------------------------------------------------------

def section_correction_jsons() -> dict:
    entries = []
    total_applied = 0
    total_pending_cells = 0

    for path in sorted(EDITORIAL.glob("feedback-*.json")):
        data = load_feedback_json(path)
        corrections = data.get("corrections", [])
        meta = data.get("_meta", {})
        n = len(corrections)
        applied = path.name in APPLIED_BATCHES
        if applied:
            total_applied += n
        else:
            total_pending_cells += n
        entries.append({
            "file": path.name,
            "cells": n,
            "applied": applied,
            "scope": meta.get("scope", ""),
            "lock_date": meta.get("decisions_lock", ""),
            "modified": mtime(path),
        })

    return {
        "correction_jsons": entries,
        "summary": {
            "total_applied_cells": total_applied,
            "unapplied_json_cells": total_pending_cells,
            "applied_json_count": sum(1 for e in entries if e["applied"]),
            "unapplied_json_count": sum(1 for e in entries if not e["applied"]),
        }
    }


def section_excels(detail: bool = False) -> list[dict]:
    entries = []
    for path in sorted(EXCELS.glob("*.xlsx")):
        entry = {
            "file": path.name,
            "modified": mtime(path),
            "path": str(path.relative_to(ROOT)),
        }
        if detail:
            entry["sheets"] = xlsx_sheets(path)
        entries.append(entry)
    return entries


def section_key_docs() -> list[dict]:
    entries = []
    for name in KEY_DOCS:
        path = EDITORIAL / name
        entries.append({
            "file": name,
            "exists": path.exists(),
            "modified": mtime(path) if path.exists() else None,
            "path": str(path.relative_to(ROOT)),
        })
    return entries


def section_scripts() -> list[dict]:
    entries = []
    for path in sorted((ROOT / "scripts").rglob("*.py")):
        entries.append({
            "file": str(path.relative_to(ROOT)),
            "modified": mtime(path),
        })
    return entries


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def print_text(args):
    # Header
    print("=" * 72)
    print(f"  am-fl-trans  |  Gemini project map  |  {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Root: {ROOT}")
    print("=" * 72)

    # Git log
    print("\n── Git log (last 10) " + "─" * 50)
    for line in git_log(10):
        print(f"  {line}")

    # Correction JSONs
    data = section_correction_jsons()
    print("\n── Correction JSONs " + "─" * 51)
    print(f"  {'FILE':<50} {'CELLS':>5}  STATUS")
    print(f"  {'-'*50} {'-'*5}  {'------'}")
    for e in data["correction_jsons"]:
        status = "APPLIED" if e["applied"] else "PENDING"
        print(f"  {e['file']:<50} {e['cells']:>5}  {status}")
    s = data["summary"]
    print(f"\n  Applied: {s['applied_json_count']} JSONs / {s['total_applied_cells']} cells")
    print(f"  Unapplied in existing JSONs: {s['unapplied_json_count']} JSONs / {s['unapplied_json_cells']} cells")

    # Pending batches (undrafted)
    print("\n── Pending batches (undrafted — need new JSON) " + "─" * 24)
    print(f"  {'ID':<5} {'LABEL':<25} {'CELLS':>6}  NOTES")
    print(f"  {'-'*5} {'-'*25} {'-'*6}  {'-----'}")
    for b in PENDING_BATCHES:
        cells = str(b["cells_est"]) if b["cells_est"] else "TBD"
        print(f"  {b['id']:<5} {b['label']:<25} {cells:>6}  {b['notes']}")

    # xlsx files
    print("\n── Excel source files " + "─" * 49)
    excels = section_excels(detail=args.xlsx_detail)
    for e in excels:
        print(f"  {e['path']:<65}  {e['modified']}")
        if args.xlsx_detail and "sheets" in e:
            for s in e["sheets"]:
                print(f"      · {s}")

    # Key docs
    print("\n── Key editorial docs " + "─" * 49)
    for d in section_key_docs():
        exists_str = "OK" if d["exists"] else "MISSING"
        modified_str = d["modified"] or "—"
        print(f"  [{exists_str:>7}]  {d['path']:<60}  {modified_str}")

    # Scripts
    print("\n── Scripts " + "─" * 60)
    for s in section_scripts():
        print(f"  {s['file']:<55}  {s['modified']}")

    print("\n" + "=" * 72)
    print("  To draft a new batch: read _RESUME-2026-05-03.md §pending")
    print("  To apply:  python3 scripts/editorial/apply-corrections.py <json> [--apply]")
    print("  To push:   python3 scripts/convert/push-file.py <xlsx> --apply")
    print("=" * 72)


def print_json(args):
    output = {
        "generated": datetime.now().isoformat(),
        "root": str(ROOT),
        "git_log": git_log(10),
        **section_correction_jsons(),
        "pending_batches": PENDING_BATCHES,
        "excels": section_excels(detail=args.xlsx_detail),
        "key_docs": section_key_docs(),
        "scripts": section_scripts(),
    }
    print(json.dumps(output, indent=2))


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="am-fl-trans project file map for AI session pickup")
    parser.add_argument("--xlsx-detail", action="store_true", help="Include sheet names for each xlsx")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON instead of text")
    args = parser.parse_args()

    if args.json:
        print_json(args)
    else:
        print_text(args)


if __name__ == "__main__":
    main()
