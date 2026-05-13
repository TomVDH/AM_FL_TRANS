#!/usr/bin/env python3
"""Produce full-source-of-truth + proposed-fix doc for the E1 DRIFT batch.

22 deep-eyeball DRIFT cells. J67 + J69 already retconned via slogan batch
(2026-05-13) — they'll show as already-applied in the apply step.

Output: data/editorial/proposed-fixes-2026-05-13-E1.md
"""
import importlib.util
import time
from pathlib import Path

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
OUT = REPO / 'data/editorial/proposed-fixes-2026-05-13-E1.md'
E1_SHEET_ID = '1TTUN6f_DACWw2VFxPP5sBbzKSMvpMZrG8XTsqcpw0SU'

# Load throttle + parser helpers
spec_t = importlib.util.spec_from_file_location(
    'throttle', REPO / 'scripts/editorial/_api_throttle.py')
throttle = importlib.util.module_from_spec(spec_t)
spec_t.loader.exec_module(throttle)

spec_r = importlib.util.spec_from_file_location(
    'rescan', REPO / 'scripts/editorial/rescan-drift-2026-05-12.py')
rescan = importlib.util.module_from_spec(spec_r)
spec_r.loader.exec_module(rescan)


FIXES = {
    # E1_FarmHouseInt (3 cells)
    ('E1_FarmHouseInt_localization', 5): {
        'issue': 'duplicate `het het`',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('wat is het het geheim', 'wat is het geheim'),
    },
    ('E1_FarmHouseInt_localization', 7): {
        'issue': 'broken syntax `en dat aan een product`',
        'canon': 'Dutch grammar',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace(
            'We moeten bereid zijn hard te werken, en dat aan een product dat levens verandert.',
            'We moeten bereid zijn hard te werken, en ook een product hebben dat levens verandert.'
        ),
        'note': 'Restores parallel structure. Verify phrasing fits Mme. Derrière voice.',
    },
    ('E1_FarmHouseInt_localization', 14): {
        'issue': '`iedereen` (3sg) takes `zal halen` not `zullen halen`',
        'canon': 'Dutch agreement',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('iedereen de voordelen uit deze producten zullen halen', 'iedereen de voordelen uit deze producten zal halen'),
    },

    # E1_Farm (6 cells)
    ('E1_Farm_localization', 17): {
        'issue': '`mensen` lowercase + broken `ergens in naar het dorp`',
        'canon': '§7.3 + Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace(
            'De mensen moeten ergens in naar het dorp zijn.',
            'De Mensen moeten ergens in het dorp zijn.'
        ),
    },
    ('E1_Farm_localization', 39): {
        'issue': 'game-system Protest lowercase (with stutter prefix)',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('p-p-protest', 'P-P-Protest'),
    },
    ('E1_Farm_localization', 59): {
        'issue': 'game-system Protest lowercase',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('het protest van Oude Ezel', 'het Protest van Oude Ezel'),
    },
    ('E1_Farm_localization', 60): {
        'issue': '`ziel` lowercase — game-systemic Ziel per §7.3',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('zal de ziel van wijlen Luie Ezel', 'zal de Ziel van wijlen Luie Ezel'),
    },
    ('E1_Farm_localization', 94): {
        'issue': 'duplicate `toch toch` + `jobs` lowercase (pre-uprising = game-system Job)',
        'canon': '§6.16 + grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('ge kunt toch verdomme toch niet', 'ge kunt verdomme toch niet').replace('jullie jobs terug', 'jullie Jobs terug'),
    },
    ('E1_Farm_localization', 102): {
        'issue': '`richting` mistranslation (EN: `value` → NL must be `waarde`, not `direction`)',
        'canon': '§13 mistranslation',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Jullie idee van richting en eigenwaarde', 'Jullie idee van waarde en eigenwaarde'),
    },

    # E1_RedFields (1 cell)
    ('E1_RedFields_localization', 13): {
        'issue': '§12.4 — `Feel The Love!` left in English',
        'canon': '§12.4',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Volg je instinct en Feel The Love!', 'Volg je instinct en voel de liefde!'),
        'note': 'Alternates: voel de liefde / volg de liefde / laat je leiden door de liefde',
    },

    # E1_Stable1F (3 cells)
    ('E1_Stable1F_localization', 8): {
        'issue': 'broken: `dat`-clause uses `te`-infinitive instead of finite verb',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace(
            'Het is hoog tijd dat we de Mensen er aan te herinneren hoe belangrijk en nuttig wij voor hen zijn geweest.',
            'Het is hoog tijd dat we de Mensen eraan herinneren hoe belangrijk en nuttig wij voor hen zijn geweest.'
        ),
    },
    ('E1_Stable1F_localization', 10): {
        'issue': '`alleréérste` non-standard accent — Dutch is `allereerste`',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('alleréérste', 'allereerste'),
    },
    ('E1_Stable1F_localization', 11): {
        'issue': '`een goed moraal` — `moraal` is de-word, takes `goede`',
        'canon': 'Dutch adj-gender agreement',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('een goed moraal binnen', 'een goede moraal binnen'),
    },

    # E1_Stable2F (1 cell)
    ('E1_Stable2F_localization', 22): {
        'issue': '`mensen` lowercase — §7.3 Mensen cap',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('De mensen... ze zijn me komen pakken', 'De Mensen... ze zijn me komen pakken'),
    },

    # E1_TheProtest (8 cells, J67/J69 already retconned)
    ('E1_TheProtest_localization', 21): {
        'issue': '`mensen` lowercase',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('zouden de mensen dat echt doen?', 'zouden de Mensen dat echt doen?'),
    },
    ('E1_TheProtest_localization', 22): {
        'issue': '`mensen` lowercase',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('dat de mensen mogelijk', 'dat de Mensen mogelijk'),
    },
    ('E1_TheProtest_localization', 23): {
        'issue': '`mensen` lowercase',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('dat de mensen zijn verdorven', 'dat de Mensen zijn verdorven'),
    },
    ('E1_TheProtest_localization', 39): {
        'issue': '`niet een leider` direct EN calque — Dutch idiom is `geen leider`',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('jij bent een luisteraar, niet een leider', 'jij bent een luisteraar, geen leider'),
    },
    ('E1_TheProtest_localization', 61): {
        'issue': '`ruggegraat` non-standard — modern Dutch is `ruggengraat`',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('de ruggegraat van deze Hoeve', 'de ruggengraat van deze Hoeve'),
    },
    ('E1_TheProtest_localization', 67): {
        'issue': 'ALREADY RETCONNED via slogan batch (2026-05-13)',
        'canon': '§14.1.1',
        'confidence': 'already-applied',
        'transform': lambda nl: nl,  # idempotent
        'note': 'Will short-circuit on pre-image check (already at canonical form).',
    },
    ('E1_TheProtest_localization', 69): {
        'issue': 'ALREADY RETCONNED via slogan batch (2026-05-13)',
        'canon': '§14.1.1',
        'confidence': 'already-applied',
        'transform': lambda nl: nl,
        'note': 'Will short-circuit on pre-image check (already at canonical form).',
    },
    ('E1_TheProtest_localization', 147): {
        'issue': '`gëinspireerd` — diaeresis on wrong vowel; standard is `geïnspireerd` (on i)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('heeft gëinspireerd', 'heeft geïnspireerd'),
    },
}


def md_inline(s):
    if s is None or s == '':
        return '∅'
    return str(s).replace('`', '\\`').replace('|', '\\|').replace('\n', ' ⏎ ')


def main():
    entries = [e for e in rescan.parse_deep_eyeball() if e['episode'] == 1]
    print(f'E1 DRIFT cells: {len(entries)}')
    print(f'Encoded fixes:   {len(FIXES)}')

    client = throttle.get_client()
    sheet = throttle.throttled_call(client.open_by_key, E1_SHEET_ID)
    all_tabs = [ws.title for ws in sheet.worksheets()]
    print(f'Remote tabs: {len(all_tabs)} tabs')

    by_tab = {}
    for e in entries:
        tab_name = e['sheet']
        for t in all_tabs:
            if t == tab_name or t.startswith(tab_name) or tab_name.startswith(t):
                tab_name = t
                break
        by_tab.setdefault(tab_name, []).append(e)

    L = ['# E1 batch — full source + remote read + proposed fix']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")} (live remote, throttled)_')
    L.append(f'_Spreadsheet: `{sheet.title}` (id `{E1_SHEET_ID}`)_')
    L.append(f'_Cells in batch: {len(entries)} • Fixes encoded: {len(FIXES)}_')
    L.append('')
    L.append('For each cell: live remote read (cols A/B/C/J) + drift identification + proposed NL replacement string.')
    L.append('')
    L.append('**Note:** J67 + J69 (TheProtest) already retconned via slogan batch 2026-05-13 — they will short-circuit on pre-image check in the apply step.')
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
                while len(row_vals) < 10:
                    row_vals.append('')
                key, desc, en, nl = row_vals[0], row_vals[1], row_vals[2], row_vals[9]
            else:
                key = desc = en = nl = ''

            fix = FIXES.get((tab_name, r))
            if fix is None:
                for k in FIXES:
                    if k[1] == r and (tab_name.startswith(k[0]) or k[0].startswith(tab_name)):
                        fix = FIXES[k]
                        break

            L.append(f'### J{r}')
            L.append('')
            if fix:
                if fix['confidence'] == 'already-applied':
                    conf_label = '`[already-applied]`'
                elif fix['confidence'] == 'mechanical':
                    conf_label = '`mechanical`'
                else:
                    conf_label = '`[VERIFY]`'
                L.append(f'- **Drift:** {md_inline(fix["issue"])} {conf_label}')
                L.append(f'- **Canon:** `{md_inline(fix["canon"])}`')
            L.append(f'- **Key (col A):**  `{md_inline(key)}`')
            L.append(f'- **Desc (col B):** `{md_inline(desc)}`')
            L.append(f'- **EN (col C):**   `{md_inline(en)}`')
            L.append(f'- **Current NL (col J, live remote):**')
            L.append(f'    `{md_inline(nl)}`')
            if fix:
                proposed = fix['transform'](nl)
                if proposed == nl:
                    if fix['confidence'] == 'already-applied':
                        L.append(f'- **Proposed NL:** _no change — cell already at canonical form_')
                    else:
                        L.append(f'- **Proposed NL:** ⚠ transform did not change the string — fix may be stale')
                else:
                    L.append(f'- **Proposed NL:**')
                    L.append(f'    `{md_inline(proposed)}`')
                if fix.get('note'):
                    L.append(f'- **Note:** {fix["note"]}')
            else:
                L.append(f'- **Proposed NL:** ⚠ no fix encoded')
            L.append('')
            rendered += 1

    L.append('---')
    L.append('')
    L.append(f'**Total cells: {rendered}** (incl. 2 already-applied via slogan retcon)')
    L.append('')
    L.append('## Sign-off shape')
    L.append('')
    L.append('- `all` — apply all 22 (J67/J69 will short-circuit as already-applied; 20 actual writes)')
    L.append('- `mechanical only` — apply 18, defer 2 `[VERIFY]` (J7, J13 RedFields)')
    L.append('- per-cell push-back — quote `J<row>` with your alternate fix')
    L.append('')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)} — {rendered} cells.')


if __name__ == '__main__':
    main()
