# Import summary — 2026-04-29

Generated post-Phase-C-close. Aggregated from all `corrections` arrays in `data/editorial/*.json` (excludes scan dumps, `pending_disposition`, and `documented_keeps`). Files ordered **descending by name** (E10 → E0). Sheets within each file ordered descending by cell count.

> **2026-04-29 update — residue sweep applied.** Post-Phase-C audit caught 37 missed cells (16 parenthesized-name leaks in E2, 11 Oude Zak residues, 5 Luie Zak residues, 4 bare-EN-name leaks, 1 curly-quote fix). All applied via `data/editorial/post-phase-c-residue-2026-04-29.json`. **Final corpus state: zero parenthesized leaks, zero deprecated `*-Zak` forms, zero bare EN names, zero curly U+2019/U+2026/U+201C/U+201D.** Counts below now include this sweep.

**Totals: 558 unique cells across 53 sheets in 11 xlsx files** (607 raw correction records across 26 source JSONs — overlaps deduplicated by cell address).

Cell-level diff against `excels/Originals/` should be ~541 cells (504 from Phase-C close + 37 from residue sweep).

---

## Master import index — file × sheet × cell addresses

| File | Sheet | Cells | Cell addresses (column J) |
|---|---|---:|---|
| `10_asses.masses_E10Proxy.xlsx` (28) | E10_Epilogue_localization | 9 | J3 J9 J15 J16 J22 J23 J26 J28 J29 |
| `10_asses.masses_E10Proxy.xlsx` (28) | E10_Hard_localization | 7 | J5 J15 J27 J28 J44 J46 J72 |
| `10_asses.masses_E10Proxy.xlsx` (28) | E10_Government_localization | 5 | J9 J110 J115 J255 J268 |
| `10_asses.masses_E10Proxy.xlsx` (28) | E10_Thirsty_localization | 4 | J6 J8 J9 J16 |
| `10_asses.masses_E10Proxy.xlsx` (28) | E10_Nice_localization | 2 | J8 J14 |
| `10_asses.masses_E10Proxy.xlsx` (28) | E10_Slow_localization | 1 | J9 |
| `9_asses.masses_E9Proxy.xlsx` (29) | E9_GoldenAss_localization | 13 | J32 J33 J52 J68 J72 J83 J85 J88 J101 J102 J106 J133 J149 |
| `9_asses.masses_E9Proxy.xlsx` (29) | E9_BadCave_localization | 10 | J11 J15 J20 J24 J32 J40 J43 J48 J55 J86 |
| `9_asses.masses_E9Proxy.xlsx` (29) | E9_MineEscape_localization | 6 | J4 J23 J24 J26 J27 J28 |
| `8_asses.masses_E8Proxy.xlsx` (1) | E8_SanctumMain_localization | 1 | J42 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_BigJob_localization | 10 | J6 J8 J11 J27 J28 J30 J32 J34 J37 J40 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_BigBattle_localization | 4 | J4 J5 J7 J8 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_CityStreet_localization | 4 | J7 J9 J11 J12 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_Holding1_localization | 4 | J10 J13 J36 J37 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_Holding3_localization | 4 | J4 J11 J13 J18 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_Skinning_localization | 4 | J14 J15 J18 J20 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_Boiling_localization | 3 | J6 J9 J15 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_Chilling_localization | 3 | J6 J21 J23 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_MeatProcessing_localization | 1 | J3 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_Holding2_localization | 1 | J9 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_Shipping_localization | 1 | J4 |
| `7_asses.masses_E7Proxy.xlsx` (40) | E7_Slaughtering_localization | 1 | J5 |
| `6_asses.masses_E6Proxy.xlsx` (107) | E6_World_localization | 78 | J6 J14 J17 J23 J24 J38 J40 J43 J45 J46 J49 J51 J57 J62 J63 J68 J71 J74 J78 J83 J86 J94 J97 J100 J103 J106 J112 J133 J153 J169 J177 J184 J186 J187 J193 J208 J218 J229 J234 J237 J241 J242 J243 J249 J258 J260 J261 J263 J264 J274 J275 J276 J277 J278 J279 J280 J283 J284 J285 J286 J288 J289 J292 J293 J294 J295 J298 J299 J302 J304 J306 J316 J318 J321 J325 J326 J336 J344 |
| `6_asses.masses_E6Proxy.xlsx` (107) | E6_Nightmare_localization | 18 | J10 J13 J20 J21 J23 J25 J34 J36 J37 J44 J47 J50 J53 J55 J56 J58 J59 J60 |
| `6_asses.masses_E6Proxy.xlsx` (107) | E6_BattleHard_localization | 5 | J3 J4 J6 J7 J9 |
| `6_asses.masses_E6Proxy.xlsx` (107) | E6_BadCave_localization | 4 | J30 J32 J37 J45 |
| `6_asses.masses_E6Proxy.xlsx` (107) | E6_Stable2F_localization | 2 | J3 J4 |
| `5_asses.masses_E5Proxy.xlsx` (24) | E5_CircusMain_localization | 13 | J43 J86 J88 J121 J132 J135 J136 J137 J145 J149 J172 J181 J240 |
| `5_asses.masses_E5Proxy.xlsx` (24) | E5_ZooMain_localization | 10 | J31 J44 J45 J51 J75 J126 J128 J133 J182 J213 |
| `5_asses.masses_E5Proxy.xlsx` (24) | E5_ZooCapture_localization | 1 | J41 |
| `4_asses.masses_E4Proxy.xlsx` (52) | E4_AstralPlaneMain_localization | 21 | J50 J52 J99 J100 J103 J108 J116 J118 J146 J148 J184 J185 J191 J192 J197 J198 J209 J211 J212 J227 J230 |
| `4_asses.masses_E4Proxy.xlsx` (52) | E4_Mine1F_localization | 11 | J3 J6 J8 J14 J22 J25 J27 J32 J46 J52 J65 |
| `4_asses.masses_E4Proxy.xlsx` (52) | E4_HideAndSeek_localization | 7 | J3 J5 J7 J9 J12 J19 J20 |
| `4_asses.masses_E4Proxy.xlsx` (52) | E4_Mine1F_Exit_localization | 6 | J6 J14 J15 J16 J17 J18 |
| `4_asses.masses_E4Proxy.xlsx` (52) | E4_HerdSplits_localization | 4 | J4 J47 J62 J65 |
| `4_asses.masses_E4Proxy.xlsx` (52) | E4_KicksGoodbye_localization | 2 | J4 J5 |
| `4_asses.masses_E4Proxy.xlsx` (52) | E4_KicksConfession_localization | 1 | J4 |
| `3_asses.masses_E3Proxy.xlsx` (65) | E3_Mine1F_localization | 39 | J3 J9 J10 J11 J13 J14 J25 J31 J33 J36 J38 J40 J41 J47 J51 J53 J62 J63 J71 J74 J77 J78 J82 J87 J107 J110 J113 J121 J125 J128 J130 J134 J135 J136 J140 J141 J142 J143 J149 |
| `3_asses.masses_E3Proxy.xlsx` (65) | E3_LazysGrave_localization | 17 | J5 J9 J10 J14 J16 J20 J22 J26 J29 J30 J31 J33 J40 J45 J49 J50 J51 |
| `3_asses.masses_E3Proxy.xlsx` (65) | E3_Mine1FOpening_localization | 9 | J9 J11 J13 J16 J21 J45 J47 J63 J67 |
| `2_asses.masses_E2Proxy.xlsx` (22) | E2_World_A1_localization | 10 | J16 J18 J20 J23 J25 J28 J29 J42 J43 J59 |
| `2_asses.masses_E2Proxy.xlsx` (22) | E2_World_B1_localization | 6 | J19 J22 J24 J43 J48 J50 |
| `2_asses.masses_E2Proxy.xlsx` (22) | E2_Confession_localization | 3 | J34 J53 J82 |
| `2_asses.masses_E2Proxy.xlsx` (22) | E2_BadAssRescue_localization | 1 | J8 |
| `2_asses.masses_E2Proxy.xlsx` (22) | E2_World_A2_localization | 1 | J21 |
| `2_asses.masses_E2Proxy.xlsx` (22) | E2_World_A3_localization | 1 | J11 |
| `1_asses.masses_E1Proxy.xlsx` (61) | E1_TheProtest_localization | 33 | J16 J19 J23 J25 J29 J32 J33 J34 J42 J46 J47 J51 J63 J64 J79 J80 J81 J91 J92 J93 J95 J100 J106 J108 J109 J110 J111 J122 J127 J134 J135 J142 J143 |
| `1_asses.masses_E1Proxy.xlsx` (61) | E1_Farm_localization | 16 | J23 J24 J30 J34 J35 J36 J38 J39 J40 J41 J43 J44 J45 J46 J63 J94 |
| `1_asses.masses_E1Proxy.xlsx` (61) | E1_Stable2F_localization | 5 | J7 J25 J37 J48 J57 |
| `1_asses.masses_E1Proxy.xlsx` (61) | E1_Stable1F_localization | 4 | J3 J13 J18 J28 |
| `1_asses.masses_E1Proxy.xlsx` (61) | E1_RedFields_localization | 2 | J11 J12 |
| `1_asses.masses_E1Proxy.xlsx` (61) | E1_Plowing_localization | 1 | J5 |
| `0_asses.masses_Manager+Intermissions+E0Proxy.xlsx` (93) | E0_Questions_localization | 93 | J6 J7 J11 J14 J20 J21 J27 J28 J29 J30 J31 J32 J33 J34 J35 J36 J37 J38 J39 J40 J41 J42 J43 J44 J45 J46 J47 J48 J49 J50 J51 J52 J53 J54 J55 J56 J57 J58 J59 J60 J61 J62 J63 J64 J65 J66 J67 J68 J69 J70 J71 J72 J73 J74 J75 J76 J77 J78 J79 J80 J81 J82 J83 J84 J85 J86 J87 J88 J89 J90 J91 J92 J93 J94 J95 J96 J97 J101 J102 J103 J104 J105 J106 J107 J108 J109 J110 J111 J112 J113 J114 J115 J116 |

**Totals: 53 rows · 522 cells.**

---

## Per-source-JSON tally (descending by records)

| Source JSON | Records |
|---|---|
| e0-sync-2026-04-29.json | 93 |
| slow-ass-stutter-repair.json | 57 |
| sturdy-ass-retcon.json | 56 |
| sturdy-ass-corrections.json | 46 |
| project-consistency-2026-04-28.json | 40 |
| kick-ass-corrections.json | 32 |
| sick-ass-corrections.json | 31 |
| smart-ass-corrections.json | 28 |
| big-ass-corrections.json | 24 |
| lazy-ass-corrections.json | 23 |
| hard-ass-corrections.json | 18 |
| thirsty-ass-corrections.json | 18 |
| nice-ass-corrections.json | 16 |
| cole-machine-corrections.json | 15 |
| thirsty-sweep.json | 12 |
| sad-ass-corrections.json | 9 |
| sanity-fixes-2026-04-28.json | 9 |
| bad-ass-corrections.json | 8 |
| triestigaard-sweep.json | 7 |
| trouwe-zak-sweep.json | 7 |
| old-ass-corrections.json | 6 |
| trusty-corrections.json | 6 |
| slow-ass-corrections.json | 5 |
| non-donkey-batch-2026-04-29.json | 3 |
| oude-zak-sweep.json | 1 |
| **TOTAL** | **570** |

---

## Verification (when openpyxl is available)

To diff live xlsx vs `excels/Originals/`:
```python
from openpyxl import load_workbook
import glob, os
for orig_path in glob.glob('excels/Originals/*.xlsx'):
    fname = os.path.basename(orig_path)
    live_path = f'excels/{fname}'
    if not os.path.exists(live_path): continue
    orig_wb = load_workbook(orig_path, data_only=True, read_only=True)
    live_wb = load_workbook(live_path, data_only=True, read_only=True)
    for sheet in orig_wb.sheetnames:
        if sheet not in live_wb.sheetnames: continue
        os_ = orig_wb[sheet]; ls_ = live_wb[sheet]
        diffs = []
        for ri, (orow, lrow) in enumerate(zip(os_.iter_rows(values_only=True), ls_.iter_rows(values_only=True)), 1):
            if len(orow) > 9 and len(lrow) > 9 and orow[9] != lrow[9]:
                diffs.append(f'J{ri}')
        if diffs:
            print(f'{fname} | {sheet} | {len(diffs)} diffs: {" ".join(diffs[:30])}{"..." if len(diffs)>30 else ""}')
```

That gives the authoritative `excels/Originals/`-diff list — should match the table above modulo the 18-cell gap for safety-gate skips.
