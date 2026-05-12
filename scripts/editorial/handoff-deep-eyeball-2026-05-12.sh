#!/usr/bin/env bash
# Handoff helper — Comprehensive + Deep-Eyeball Audit 2026-05-12
#
# Companion to:
#   data/editorial/HANDOFF-2026-05-12-audit-deep-eyeball.md  (the full handoff doc)
#   data/editorial/audit-2026-05-12-comprehensive-INDEX.md   (regex pass)
#   data/editorial/audit-2026-05-12-deep-eyeball.md          (per-cell walk)
#   data/editorial/audit-2026-05-12-E0.md … E10.md           (per-episode regex)
#
# Usage:
#   bash scripts/editorial/handoff-deep-eyeball-2026-05-12.sh           # print summary
#   bash scripts/editorial/handoff-deep-eyeball-2026-05-12.sh replay    # re-run regex audit
#   bash scripts/editorial/handoff-deep-eyeball-2026-05-12.sh dump E5 E5_CircusMain_localization
#   bash scripts/editorial/handoff-deep-eyeball-2026-05-12.sh verify    # check files exist + git status
#
# This script does NOT push to Google Sheets and does NOT modify xlsx or canon.

set -euo pipefail

# Resolve repo root (script lives in scripts/editorial/)
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

print_summary() {
  echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN} am-fl-trans — Deep-Eyeball + Comprehensive Audit Handoff${NC}"
  echo -e "${CYAN} Date: 2026-05-12  •  Canon SHA: 24c0df0${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
  echo
  echo -e "${GREEN}Workbooks audited:${NC} 11 (E0–E10)  •  Sheets: 106  •  NL cells: 4,399"
  echo -e "${GREEN}Push log cross-reference:${NC} 241 pushed cells (0 divergences)"
  echo
  echo -e "${YELLOW}Regex pass headline:${NC}"
  echo "  • Canon findings: 20  (3 HARD-LOCK, 9 BUGS, 8 CAP/STYLE)"
  echo "  • Alignment per-cell flags: 10"
  echo "  • Cross-row paste candidates: 0"
  echo "  • Clean sheets: 88/106 (83 %)"
  echo
  echo -e "${YELLOW}Deep eyeball pass headline:${NC}"
  echo "  • DRIFT  : 124  (clear deviation — needs editor)"
  echo "  • VERIFY :  44  (anomaly worth Tom's eye)"
  echo "  • NOTE   :  72  (observation, not actionable alone)"
  echo
  echo -e "${CYAN}Files:${NC}"
  for f in \
    "data/editorial/HANDOFF-2026-05-12-audit-deep-eyeball.md" \
    "data/editorial/audit-2026-05-12-comprehensive-INDEX.md" \
    "data/editorial/audit-2026-05-12-deep-eyeball.md"; do
    if [ -f "$f" ]; then
      echo -e "  ${GREEN}✓${NC} $f"
    else
      echo -e "  ${RED}✗${NC} MISSING: $f"
    fi
  done
  for ep in 0 1 2 3 4 5 6 7 8 9 10; do
    f="data/editorial/audit-2026-05-12-E${ep}.md"
    [ -f "$f" ] && echo -e "  ${GREEN}✓${NC} $f" || echo -e "  ${RED}✗${NC} MISSING: $f"
  done
  echo
  echo -e "${CYAN}Top drift patterns (see HANDOFF for full list + recommended order):${NC}"
  echo "   1. Stenen-spel → Keien-Spel  (8+ cells)        §8 canon"
  echo "   2. Mensen lowercase           (10+ cells)       §7.3"
  echo "   3. Plan/Protest/Revolutie lc  (5+ cells)        §7.3"
  echo "   4. English bleed              (12+ cells)       §12.4"
  echo "   5. Spelling typos             (22+ cells)       various"
  echo "   6. Muilegem → Muilenbeek      (2 cells, E10)   §3.1"
  echo "   7. Poepegaatje → De Zatten Ezel (1 cell, E10) §1 codex v3.5"
  echo "   8. Wise Ass untranslated      (2 cells, E4)    §4 monikers"
  echo
  echo -e "${CYAN}Replay regex audit:${NC}  bash $0 replay"
  echo -e "${CYAN}Dump a sheet:${NC}       bash $0 dump E5 E5_CircusMain_localization"
  echo -e "${CYAN}Verify state:${NC}       bash $0 verify"
  echo -e "${CYAN}Full handoff doc:${NC}   less data/editorial/HANDOFF-2026-05-12-audit-deep-eyeball.md"
  echo
}

replay_regex() {
  echo -e "${CYAN}Replaying comprehensive regex audit…${NC}"
  python3 scripts/editorial/comprehensive-audit.py
  echo
  echo -e "${GREEN}Done.${NC} Outputs refreshed in data/editorial/audit-2026-05-12-*.md"
}

dump_sheet() {
  local ep="$1"
  local sheet="$2"
  # Strip leading 'E' if user passed 'E5' instead of '5'
  ep="${ep#E}"
  ep="${ep#e}"
  echo -e "${CYAN}Dumping E${ep} / ${sheet}…${NC}"
  python3 scripts/editorial/deep-dump.py "$ep" "$sheet"
}

verify_state() {
  echo -e "${CYAN}Verifying audit artefacts and repo state…${NC}"
  echo
  echo -e "${YELLOW}Required files:${NC}"
  local missing=0
  for f in \
    "data/editorial/HANDOFF-2026-05-12-audit-deep-eyeball.md" \
    "data/editorial/audit-2026-05-12-comprehensive-INDEX.md" \
    "data/editorial/audit-2026-05-12-deep-eyeball.md" \
    "scripts/editorial/comprehensive-audit.py" \
    "scripts/editorial/deep-dump.py"; do
    if [ -f "$f" ]; then
      printf "  ${GREEN}%s${NC}  %s\n" "✓" "$f"
    else
      printf "  ${RED}%s${NC}  %s\n" "✗" "$f"
      missing=$((missing+1))
    fi
  done
  for ep in 0 1 2 3 4 5 6 7 8 9 10; do
    f="data/editorial/audit-2026-05-12-E${ep}.md"
    if [ -f "$f" ]; then
      printf "  ${GREEN}%s${NC}  %s\n" "✓" "$f"
    else
      printf "  ${RED}%s${NC}  %s\n" "✗" "$f"
      missing=$((missing+1))
    fi
  done
  echo
  echo -e "${YELLOW}Python deps:${NC}"
  python3 -c "import openpyxl; print('  ✓ openpyxl', openpyxl.__version__)" 2>/dev/null \
    || echo -e "  ${RED}✗${NC} openpyxl not available"
  echo
  echo -e "${YELLOW}Canon SHA at audit time:${NC} 24c0df0"
  echo -e "${YELLOW}Canon SHA now:${NC}            $(git log --oneline -1 -- data/editorial/_CANON.md | awk '{print $1}')"
  if [ "$(git log --oneline -1 -- data/editorial/_CANON.md | awk '{print $1}')" != "24c0df0" ]; then
    echo -e "  ${YELLOW}⚠${NC}  Canon has changed since audit. Consider replay: bash $0 replay"
  fi
  echo
  echo -e "${YELLOW}xlsx modifications in working tree (pre-existing, not from this audit):${NC}"
  git status --short excels/ 2>/dev/null | head -15 || true
  echo
  if [ $missing -gt 0 ]; then
    echo -e "${RED}${missing} required file(s) missing. Cannot proceed without them.${NC}"
    exit 1
  fi
  echo -e "${GREEN}All artefacts present.${NC}"
}

main() {
  local cmd="${1:-summary}"
  case "$cmd" in
    summary|"")
      print_summary
      ;;
    replay)
      replay_regex
      ;;
    dump)
      if [ $# -lt 3 ]; then
        echo "Usage: $0 dump <ep_num> <sheet_name>" >&2
        echo "  e.g.: $0 dump 5 E5_CircusMain_localization" >&2
        exit 2
      fi
      dump_sheet "$2" "$3"
      ;;
    verify)
      verify_state
      ;;
    -h|--help|help)
      sed -n '1,/^set -e/p' "$0" | sed -n '1,/^$/p'
      ;;
    *)
      echo "Unknown command: $cmd" >&2
      echo "Try: summary | replay | dump <ep> <sheet> | verify | help" >&2
      exit 2
      ;;
  esac
}

main "$@"
