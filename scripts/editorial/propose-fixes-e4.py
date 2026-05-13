#!/usr/bin/env python3
"""Produce full-source-of-truth + proposed-fix doc for the E4 DRIFT batch.

For each of the 23 E4 DRIFT cells: live remote API read (cols A/B/C/J) +
drift identification + proposed NL replacement string. The proposed string
is exactly what will be written to remote on sign-off.

Output: data/editorial/proposed-fixes-2026-05-13-E4.md
"""
import importlib.util
import time
from pathlib import Path

import gspread
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
TOKEN = REPO / 'token.json'
OUT = REPO / 'data/editorial/proposed-fixes-2026-05-13-E4.md'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
E4_SHEET_ID = '1KzgaFaoUWE2Jv5eBfTryh8kiw944Q3MBNwtlaofpOn0'

spec = importlib.util.spec_from_file_location(
    'rescan', REPO / 'scripts/editorial/rescan-drift-2026-05-12.py')
rescan = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rescan)


FIXES = {
    # E4_AstralPlaneMain_localization (14 cells)
    ('E4_AstralPlaneMain_localization', 46): {
        'issue': 'Niewelingetjes missing U — Nieuwelingetjes (matches J55 usage in same sheet)',
        'canon': 'Dutch spelling + corpus consistency',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Niewelingetjes', 'Nieuwelingetjes'),
    },
    ('E4_AstralPlaneMain_localization', 49): {
        'issue': 'Wilde gokken? — past tense; want present "Wil je gokken?"',
        'canon': 'Dutch verb tense',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Wilde gokken?', 'Wil je gokken?'),
    },
    ('E4_AstralPlaneMain_localization', 71): {
        'issue': 'belangan → belangen (third occurrence; same typo as E1_TheProtest J67/J69)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('belangan', 'belangen'),
    },
    ('E4_AstralPlaneMain_localization', 94): {
        'issue': 'wanneer (recurring/future) → toen (one-time past) — Trusty arrived once',
        'canon': 'Dutch temporal conjunction',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('had wanneer ze aankwam', 'had toen ze aankwam'),
    },
    ('E4_AstralPlaneMain_localization', 106): {
        'issue': '§12.4 — Let\'s go! left untranslated (×3)',
        'canon': '§12.4',
        'confidence': 'verify',
        'transform': lambda nl: 'Vooruit vooruit vooruit!',
        'note': 'Alternates: Komaan komaan komaan! / Kom op kom op kom op!',
    },
    ('E4_AstralPlaneMain_localization', 117): {
        'issue': '§12.4 — Let\'s go! left untranslated',
        'canon': '§12.4',
        'confidence': 'verify',
        'transform': lambda nl: 'Vooruit!',
        'note': 'Alternates: Komaan! / Kom op!',
    },
    ('E4_AstralPlaneMain_localization', 167): {
        'issue': 'wanneer → toen (past); also plural verb gebruikte → gebruikten',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('wanneer de Mensen onze Kudde gebruikte', 'toen de Mensen onze Kudde gebruikten'),
    },
    ('E4_AstralPlaneMain_localization', 178): {
        'issue': 'WHAT DE FUCK — English/Dutch hybrid (WHAT is English)',
        'canon': '§12.4',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('WHAT DE FUCK', 'WAT DE FUCK'),
        'note': 'Replaces WHAT→WAT (Dutch). DE FUCK kept as accepted Flemish loan-profanity. Alternate: WAT KRIJGEN WE NU.',
    },
    ('E4_AstralPlaneMain_localization', 183): {
        'issue': 'wilde poepen — past tense; want present + ge/gij register (Furry/Blunt/Dusty Ass speakers)',
        'canon': 'Dutch tense + §5.4 ge/gij',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('wilde poepen?', 'wilt ge poepen?'),
        'note': 'NL has "Ge riekt" so speaker is ge/gij → wilt ge. Alternate je/jij: wil je poepen?',
    },
    ('E4_AstralPlaneMain_localization', 201): {
        'issue': 'duplicate waar — second occurrence should be dat',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Waar denk jij wel niet waar je heen gaat?', 'Waar denk jij wel niet dat je heen gaat?'),
    },
    ('E4_AstralPlaneMain_localization', 220): {
        'issue': 'GOEDEAVOND non-standard — standard is GOEDENAVOND or GOEIENAVOND (tussentaal)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('GOEDEAVOND', 'GOEIENAVOND'),
    },
    ('E4_AstralPlaneMain_localization', 228): {
        'issue': 'allebeide non-existent — standard Dutch is allebei',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('allebeide', 'allebei'),
    },
    ('E4_AstralPlaneMain_localization', 234): {
        'issue': '§4 character moniker — Wise Ass untranslated; canonical is Wijze Ezel',
        'canon': '§4 monikers',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Wise Ass', 'Wijze Ezel'),
        'note': 'Confirm canonical moniker for Wise Ass character.',
    },
    ('E4_AstralPlaneMain_localization', 235): {
        'issue': '§4 — Wise Ass untranslated (×2 same as J234)',
        'canon': '§4 monikers',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Wise Ass', 'Wijze Ezel'),
    },

    # E4_HerdSplits_localization (6 cells)
    ('E4_HerdSplits_localization', 29): {
        'issue': 'plan lowercase — §6.9 game-system Plan cap',
        'canon': '§6.9/§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('nieuw plan.', 'nieuw Plan.'),
    },
    ('E4_HerdSplits_localization', 32): {
        'issue': 'jobs TERUG mixed case — EN is JOBS BACK ALL-CAPS',
        'canon': 'corpus case parity',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('onze jobs TERUG', 'onze JOBS TERUG'),
    },
    ('E4_HerdSplits_localization', 35): {
        'issue': 'veulentje lowercase — referring to The Foal (game character) → Veulentje',
        'canon': '§7.1 / Foal-as-character cap',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('mijn veulentje.', 'mijn Veulentje.'),
    },
    ('E4_HerdSplits_localization', 59): {
        'issue': 'mens lowercase — §7.3 game-system Mens cap',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('een mens aan.', 'een Mens aan.'),
    },
    ('E4_HerdSplits_localization', 77): {
        'issue': '§12.4 — Let\'s GO! left untranslated',
        'canon': '§12.4',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace("Let's GO!", 'VOORUIT!'),
        'note': 'Alternates: KOMAAN! / GAAN!',
    },
    ('E4_HerdSplits_localization', 81): {
        'issue': 'revolutie lowercase — §7.3 game-system Revolutie cap',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Een revolutie', 'Een Revolutie'),
    },

    # E4_KicksConfession_localization (1 cell)
    ('E4_KicksConfession_localization', 6): {
        'issue': 'MOEST ik MEEHELPEN drops agency — EN "He made me HELP" (Hard forced Kick)',
        'canon': '§13 mistranslation',
        'confidence': 'verify',
        'transform': lambda nl: 'HIJ DEED MIJ MEEHELPEN terwijl Snotje op uitkijk stond.',
        'note': 'Restores Hard-as-actor. Alternate: HIJ DWONG MIJ TE HELPEN terwijl Snotje op uitkijk stond.',
    },

    # E4_Mine1F_Exit_localization (1 cell)
    ('E4_Mine1F_Exit_localization', 6): {
        'issue': 'missing dat in subordinate clause: "vanaf de eerste keer ze..." → "...dat ze..."',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('vanaf de eerste keer ze', 'vanaf de eerste keer dat ze'),
    },

    # E4_Mine1F_localization (1 cell)
    ('E4_Mine1F_localization', 22): {
        'issue': 'Ik capped mid-sentence (after comma) — should be lowercase ik',
        'canon': '§9.2',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Kameraad, Ik vertrouw', 'Kameraad, ik vertrouw'),
    },
}


def get_client():
    creds = Credentials.from_authorized_user_file(str(TOKEN), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            TOKEN.write_text(creds.to_json())
    return gspread.authorize(creds)


def md_inline(s):
    if s is None or s == '':
        return '∅'
    return str(s).replace('`', '\\`').replace('|', '\\|').replace('\n', ' ⏎ ')


def main():
    entries = [e for e in rescan.parse_deep_eyeball() if e['episode'] == 4]
    print(f'E4 DRIFT cells: {len(entries)}')
    print(f'Encoded fixes:   {len(FIXES)}')

    client = get_client()
    sheet = client.open_by_key(E4_SHEET_ID)
    all_tabs = [ws.title for ws in sheet.worksheets()]

    by_tab = {}
    for e in entries:
        tab_name = e['sheet']
        for t in all_tabs:
            if t == tab_name or t.startswith(tab_name) or tab_name.startswith(t):
                tab_name = t
                break
        by_tab.setdefault(tab_name, []).append(e)

    L = ['# E4 batch — full source + remote read + proposed fix']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")}_')
    L.append(f'_Spreadsheet: `{sheet.title}` (id `{E4_SHEET_ID}`)_')
    L.append(f'_Cells in batch: {len(entries)} • Fixes encoded: {len(FIXES)}_')
    L.append('')
    L.append('For each cell: live remote read (cols A/B/C/J) + drift identification + proposed NL replacement string.')
    L.append('')

    rendered = 0
    for tab_name in sorted(by_tab.keys()):
        ws = sheet.worksheet(tab_name)
        cells = sorted(by_tab[tab_name], key=lambda c: c['row'])
        ranges = [f'A{c["row"]}:J{c["row"]}' for c in cells]
        print(f'  {tab_name}: {len(cells)} rows…')
        batch = ws.batch_get(ranges)

        L.append(f'## {tab_name}')
        L.append('')

        for entry, range_data in zip(cells, batch):
            r = entry['row']
            if range_data and range_data[0]:
                row_vals = list(range_data[0])
                while len(row_vals) < 10:
                    row_vals.append('')
                key = row_vals[0]; desc = row_vals[1]; en = row_vals[2]; nl = row_vals[9]
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
                conf_label = '`mechanical`' if fix['confidence'] == 'mechanical' else '`[VERIFY]`'
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
    L.append(f'**Total cells: {rendered}**')
    L.append('')
    L.append('## Sign-off shape')
    L.append('')
    L.append('- `all` — apply all 23')
    L.append('- `mechanical only` — apply 16, defer 7 `[VERIFY]` items (J106, J117, J178, J183, J234, J235, J77 HerdSplits, J6 KicksConfession)')
    L.append('- per-cell push-back — quote `J<row>` with your alternate fix')
    L.append('')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)} — {rendered} cells.')


if __name__ == '__main__':
    main()
