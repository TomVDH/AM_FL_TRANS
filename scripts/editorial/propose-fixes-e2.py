#!/usr/bin/env python3
"""Produce full-source-of-truth + proposed-fix doc for the E2 DRIFT batch.

15 deep-eyeball DRIFT cells across 6 sheets.

Output: data/editorial/proposed-fixes-2026-05-13-E2.md
"""
import importlib.util
import time
from pathlib import Path

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
OUT = REPO / 'data/editorial/proposed-fixes-2026-05-13-E2.md'
E2_SHEET_ID = '14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow'

spec_t = importlib.util.spec_from_file_location(
    'throttle', REPO / 'scripts/editorial/_api_throttle.py')
throttle = importlib.util.module_from_spec(spec_t); spec_t.loader.exec_module(throttle)

spec_r = importlib.util.spec_from_file_location(
    'rescan', REPO / 'scripts/editorial/rescan-drift-2026-05-12.py')
rescan = importlib.util.module_from_spec(spec_r); spec_r.loader.exec_module(rescan)


FIXES = {
    # E2_BattleButte_localization (3 cells)
    ('E2_BattleButte_localization', 17): {
        'issue': 'wrong auxiliary verb — `verliezen` takes `hebben`, not `zijn`',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Ben ik al niet genoeg verloren?', 'Heb ik al niet genoeg verloren?'),
    },
    ('E2_BattleButte_localization', 22): {
        'issue': 'cross-sheet inconsistency — BattleMiner J17 uses `Wat is je reactie?` for the same EN',
        'canon': '§6.7 cross-sheet consistency',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Hoe reageer je?', 'Wat is je reactie?'),
        'note': 'Unifies with E2_BattleMiner J17. Alternate: change BattleMiner J17 to `Hoe reageer je?` instead.',
    },
    ('E2_BattleButte_localization', 28): {
        'issue': 'spelling typo `ANN` → `AAN`',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Je VALT ANN!', 'Je VALT AAN!'),
    },

    # E2_ChildsHouse_localization (2 cells)
    ('E2_ChildsHouse_localization', 8): {
        'issue': '§5.4 ge/gij imperative `Stop`→`Stopt` + remove non-idiomatic `te` after `met`',
        'canon': '§5.4 + Dutch idiom',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Stop met te lanterfanten!', 'Stopt met lanterfanten!'),
    },
    ('E2_ChildsHouse_localization', 16): {
        'issue': '§12.4 — `Please!` left in English',
        'canon': '§12.4',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Please! HELP MIJ!', 'Alstublieft! HELP MIJ!'),
        'note': 'Alternates: `Alsjeblieft! HELP MIJ!` (informal) / `HELP MIJ ALSTUBLIEFT!` (reorder)',
    },

    # E2_World_A1_localization (6 cells)
    ('E2_World_A1_localization', 20): {
        'issue': 'tense mismatch + §12.4 `soft` English — EN past tense, spec hints "opposite of Hard"',
        'canon': 'Dutch tense + §12.4',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Ze zijn te soft.', 'Ze waren te zacht.'),
        'note': 'Restores past tense + drops English `soft`. Spec hint: opposite of `Bikkelharde` — alternates: `te slap` / `te week`.',
    },
    ('E2_World_A1_localization', 23): {
        'issue': 'game-system Plan lowercase (with stutter)',
        'canon': '§6.9/§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('een p-p-plan C?', 'een P-P-Plan C?'),
    },
    ('E2_World_A1_localization', 35): {
        'issue': 'duplicate `ze` — `Ze zullen ze schoon gesjareld zijn` has redundant object pronoun',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Ze zullen ze schoon gesjareld zijn', 'Ze zullen schoon gesjareld zijn'),
    },
    ('E2_World_A1_localization', 39): {
        'issue': 'incomplete idiom — `Machines te laten` should be `Machines achter te laten` (give up / leave behind)',
        'canon': 'Dutch idiom',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('om de Machines te laten', 'om de Machines achter te laten'),
    },
    ('E2_World_A1_localization', 53): {
        'issue': 'semantic absolutization — EN: "this isn\'t the way" (path is wrong); NL: "there is no way at all" (too strong)',
        'canon': '§13 mistranslation',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Er is geen enkele weg naar de Hoeve.', 'Dit is helemaal niet de weg naar de Hoeve.'),
        'note': 'Push-confirmed with rule "Boerderij → de Hoeve" — only Boerderij→Hoeve was fixed; the semantic-absolutization drift is separate. Alternate: `Dit is niet eens de weg naar de Hoeve.`',
    },
    ('E2_World_A1_localization', 54): {
        'issue': 'duplicate of J53 — same EN, same NL, same fix',
        'canon': '§13 mistranslation',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Er is geen enkele weg naar de Hoeve.', 'Dit is helemaal niet de weg naar de Hoeve.'),
        'note': 'Mirror of J53.',
    },

    # E2_World_A2_localization (1 cell)
    ('E2_World_A2_localization', 15): {
        'issue': '§12.4 — English article `The` instead of Dutch `De`',
        'canon': '§12.4',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('The Kudde rekent', 'De Kudde rekent'),
    },

    # E2_World_A3_localization (1 cell)
    ('E2_World_A3_localization', 3): {
        'issue': 'missing article `een` before `teken`',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('deze regen is teken', 'deze regen is een teken'),
    },

    # E2_World_B1_localization (2 cells)
    ('E2_World_B1_localization', 25): {
        'issue': 'typo `We` (= 1pl pron) should be `Wie` (= who, interrogative)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('We gaat er onze Hoeven kuisen?', 'Wie gaat er onze Hoeven kuisen?'),
    },
    ('E2_World_B1_localization', 39): {
        'issue': '§7.3 Mensen cap + truncated idiom `Machines zo te laten` → `Machines achter te laten`',
        'canon': '§7.3 + Dutch idiom',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('overtuigt de mensen hun Machines zo te laten', 'overtuigt de Mensen hun Machines achter te laten'),
    },
}


def md_inline(s):
    if s is None or s == '': return '∅'
    return str(s).replace('`', '\\`').replace('|', '\\|').replace('\n', ' ⏎ ')


def main():
    entries = [e for e in rescan.parse_deep_eyeball() if e['episode'] == 2]
    print(f'E2 DRIFT cells: {len(entries)}')
    print(f'Encoded fixes:   {len(FIXES)}')

    client = throttle.get_client()
    sheet = throttle.throttled_call(client.open_by_key, E2_SHEET_ID)
    all_tabs = [ws.title for ws in sheet.worksheets()]

    by_tab = {}
    for e in entries:
        tab_name = e['sheet']
        for t in all_tabs:
            if t == tab_name or t.startswith(tab_name) or tab_name.startswith(t):
                tab_name = t
                break
        by_tab.setdefault(tab_name, []).append(e)

    L = ['# E2 batch — full source + remote read + proposed fix']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")} (live remote, throttled)_')
    L.append(f'_Spreadsheet: `{sheet.title}` (id `{E2_SHEET_ID}`)_')
    L.append(f'_Cells in batch: {len(entries)} • Fixes encoded: {len(FIXES)}_')
    L.append('')

    rendered = 0
    for tab_name in sorted(by_tab.keys()):
        ws = sheet.worksheet(tab_name)
        cells = sorted(by_tab[tab_name], key=lambda c: c['row'])
        ranges = [f'A{c["row"]}:J{c["row"]}' for c in cells]
        print(f'  {tab_name}: {len(cells)} rows…')
        batch = throttle.throttled_call(ws.batch_get, ranges)

        L.append(f'## {tab_name}')
        L.append('')

        for entry, range_data in zip(cells, batch):
            r = entry['row']
            if range_data and range_data[0]:
                row_vals = list(range_data[0])
                while len(row_vals) < 10: row_vals.append('')
                key, desc, en, nl = row_vals[0], row_vals[1], row_vals[2], row_vals[9]
            else:
                key = desc = en = nl = ''

            fix = FIXES.get((tab_name, r))
            if fix is None:
                for k in FIXES:
                    if k[1] == r and (tab_name.startswith(k[0]) or k[0].startswith(tab_name)):
                        fix = FIXES[k]; break

            L.append(f'### J{r}')
            L.append('')
            if fix:
                conf = '`mechanical`' if fix['confidence'] == 'mechanical' else '`[VERIFY]`'
                L.append(f'- **Drift:** {md_inline(fix["issue"])} {conf}')
                L.append(f'- **Canon:** `{md_inline(fix["canon"])}`')
            L.append(f'- **Key (col A):**  `{md_inline(key)}`')
            L.append(f'- **Desc (col B):** `{md_inline(desc)}`')
            L.append(f'- **EN (col C):**   `{md_inline(en)}`')
            L.append(f'- **Current NL (col J, live remote):**')
            L.append(f'    `{md_inline(nl)}`')
            if fix:
                proposed = fix['transform'](nl)
                if proposed == nl:
                    L.append(f'- **Proposed NL:** ⚠ transform did not change the string — fix may be stale')
                else:
                    L.append(f'- **Proposed NL:**')
                    L.append(f'    `{md_inline(proposed)}`')
                if fix.get('note'):
                    L.append(f'- **Note:** {fix["note"]}')
            L.append('')
            rendered += 1

    L.append('---')
    L.append('')
    L.append(f'**Total cells: {rendered}**')
    L.append('')
    L.append('## Sign-off shape')
    L.append('')
    L.append('- `all` — apply 15')
    L.append('- `mechanical only` — apply 10, defer 5 `[VERIFY]` (J22/J16 ChildsHouse, J20/J53/J54 World_A1)')
    L.append('- per-cell — quote `J<row>` to override or skip')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)} — {rendered} cells.')


if __name__ == '__main__':
    main()
