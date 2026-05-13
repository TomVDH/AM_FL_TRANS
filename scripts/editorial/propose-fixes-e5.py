#!/usr/bin/env python3
"""Produce full-source-of-truth + proposed-fix doc for the E5 DRIFT batch.

For each of the 25 E5 DRIFT cells:
  1. Reads col A (Key), B (Desc), C (EN), J (NL) directly from the live remote
     Google Sheet via gspread API (no xlsx intermediate)
  2. Applies the proposed-fix transform (encoded below)
  3. Writes a per-cell readout: Sheet | Row | Key | Desc | Speaker | EN |
     Current NL (verbatim remote) | Proposed NL (full string) | Canon §

Output: data/editorial/proposed-fixes-2026-05-13-E5.md

This is the canonical "what I will write to remote on your sign-off" document.
The transforms are version-controlled in this script — what you see in the
doc is exactly what will land on remote.

No writes happen here. Pure read + preview.
"""
import importlib.util
import time
from pathlib import Path

import gspread
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
TOKEN = REPO / 'token.json'
OUT = REPO / 'data/editorial/proposed-fixes-2026-05-13-E5.md'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
E5_SHEET_ID = '1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E'

# Load deep-eyeball parser for DRIFT cell list
spec = importlib.util.spec_from_file_location(
    'rescan', REPO / 'scripts/editorial/rescan-drift-2026-05-12.py')
rescan = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rescan)


# Each entry maps (sheet, row) → dict with:
#   - issue: short description of the drift
#   - canon: § citation
#   - transform: callable(current_nl) -> proposed_nl
#   - confidence: 'mechanical' | 'verify'
#   - note: optional rationale
FIXES = {
    # E5_CircusMain_localization (9 cells)
    ('E5_CircusMain_localization', 9): {
        'issue': 'game-system Stadscircus lowercase (EN is ALL-CAPS)',
        'canon': '§7.2/§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('stadscircus', 'STADSCIRCUS'),
    },
    ('E5_CircusMain_localization', 22): {
        'issue': 'kabinet (= cabinet/furniture) wrong word for theatrical cast',
        'canon': '§13 mistranslation',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('kabinet', 'cast'),
        'note': 'Verify word choice — alternates: ensemble, groep',
    },
    ('E5_CircusMain_localization', 36): {
        'issue': 'wie (interrogative) should be die (relative)',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('wie zijn best', 'die zijn best'),
    },
    ('E5_CircusMain_localization', 64): {
        'issue': 'mens lowercase (EN is HUMAN ALL-CAPS)',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('95% mens', '95% MENS'),
    },
    ('E5_CircusMain_localization', 88): {
        'issue': 'zetten (set/placed) should be zaten (sat) — wrong verb',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('publiek zetten', 'publiek zaten'),
    },
    ('E5_CircusMain_localization', 91): {
        'issue': 'success is English; Dutch is succes (one s)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Veel success', 'Veel succes'),
    },
    ('E5_CircusMain_localization', 123): {
        'issue': 'toernee non-canonical (canon: Tournee, cap-always)',
        'canon': '§7.2',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('op toernee', 'op Tournee'),
    },
    ('E5_CircusMain_localization', 153): {
        'issue': 'nauwelijk missing final -s',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Ik hoor nauwelijk', 'Ik hoor nauwelijks'),
    },
    ('E5_CircusMain_localization', 161): {
        'issue': 'kameraden lowercase — Kameraden capped elsewhere in corpus',
        'canon': 'corpus consistency',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('gewoon kameraden', 'gewoon Kameraden'),
    },

    # E5_Highway_localization (2 cells)
    ('E5_Highway_localization', 4): {
        'issue': 'knieëen has extra e (Dutch plural: knieën)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('knieëen', 'knieën'),
    },
    ('E5_Highway_localization', 11): {
        'issue': 'gëadem — wrong diaeresis + non-word',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('gëadem', 'geademd'),
    },

    # E5_ZooMain_localization (11 cells)
    ('E5_ZooMain_localization', 4): {
        'issue': 'Word/Vindt 3rd sg — subject is plural species → Worden/Vinden',
        'canon': 'Dutch agreement',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Word sinds', 'Worden sinds').replace('Vindt de regen', 'Vinden de regen'),
    },
    ('E5_ZooMain_localization', 18): {
        'issue': 'het word — 3rd sg present needs -t → het wordt',
        'canon': 'Dutch d/t',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('het word net', 'het wordt net'),
    },
    ('E5_ZooMain_localization', 47): {
        'issue': 'gelukt (past participle "succeeded") instead of geluk (noun "luck")',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Jouw gelukt', 'Jouw geluk'),
    },
    ('E5_ZooMain_localization', 119): {
        'issue': 'Boederij typo + canon §3.6 Boerderij → Hoeve',
        'canon': '§3.6 + spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Boederij', 'Hoeve'),
    },
    ('E5_ZooMain_localization', 125): {
        'issue': 'verse hooi (hooi is neuter → vers) + rigoreus → rigoureus',
        'canon': 'Dutch agreement + spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('verse hooi', 'vers hooi').replace('rigoreus', 'rigoureus'),
    },
    ('E5_ZooMain_localization', 154): {
        'issue': 'bengt missing r → brengt',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('vreugde bengt', 'vreugde brengt'),
    },
    ('E5_ZooMain_localization', 165): {
        'issue': 'ontsnappen takes uit (from a place), not van',
        'canon': 'Dutch preposition',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('van deze Dierentuin ONTSNAPT', 'uit deze Dierentuin ONTSNAPT'),
    },
    ('E5_ZooMain_localization', 169): {
        'issue': 'missing te in om...te-ontmoeten infinitive',
        'canon': 'Dutch infinitive',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Week ontmoeten?', 'Week te ontmoeten?'),
    },
    ('E5_ZooMain_localization', 176): {
        'issue': 'wilt → wil (willen 3sg irregular); hun → ze; komt → komen',
        'canon': 'Dutch grammar',
        'confidence': 'verify',
        'transform': lambda nl: 'De RAAD VAN BESTUUR wil dat jullie ze gezellig komen Knuffelen!',
        'note': 'Full rewrite — verify phrasing',
    },
    ('E5_ZooMain_localization', 190): {
        'issue': 'same pattern as J176 (wilt/hun/komt) — variant uses knus instead of gezellig',
        'canon': 'Dutch grammar',
        'confidence': 'verify',
        'transform': lambda nl: 'De RAAD VAN BESTUUR wil dat jullie ze knus komen Knuffelen!',
        'note': 'Full rewrite — verify phrasing',
    },
    ('E5_ZooMain_localization', 216): {
        'issue': 'Ge bent mixes registers — ge/gij form is zijt',
        'canon': '§5.4',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Ge bent', 'Gij zijt'),
    },

    # E5_Zoo_Introduction_localization (3 cells)
    ('E5_Zoo_Introduction_localization', 12): {
        'issue': 'Ezel van de Week title-case; EN is ASS OF THE WEEK ALL-CAPS',
        'canon': 'corpus case parity',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Ezel van de Week', 'EZEL VAN DE WEEK'),
    },
    ('E5_Zoo_Introduction_localization', 22): {
        'issue': 'plan lowercase — game-systemic per §6.9 → Plan',
        'canon': '§6.9/§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('een plan!', 'een Plan!'),
    },
    ('E5_Zoo_Introduction_localization', 33): {
        'issue': 'vind (1st sg/imp) — subject dametje (3rd sg) → vindt',
        'canon': 'Dutch d/t',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('leuk vind als', 'leuk vindt als'),
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
    entries = [e for e in rescan.parse_deep_eyeball() if e['episode'] == 5]
    print(f'E5 DRIFT cells: {len(entries)}')
    print(f'Encoded fixes:   {len(FIXES)}')

    # Sanity check — every DRIFT entry should have a fix
    missing = []
    for e in entries:
        key = (e['sheet'], e['row'])
        # Some sheet names come from deep-eyeball doc with truncation — try expansion
        if key not in FIXES:
            # Try expanding _localizatio → _localization
            sheet_full = e['sheet']
            if sheet_full.endswith('_localizatio'):
                sheet_full = sheet_full + 'n'
            elif sheet_full.endswith('_localiza'):
                sheet_full = sheet_full + 'tion'
            alt_key = (sheet_full, e['row'])
            if alt_key not in FIXES:
                missing.append(key)
    if missing:
        print(f'⚠ Missing fix transforms for: {missing}')

    client = get_client()
    sheet = client.open_by_key(E5_SHEET_ID)
    all_tabs = [ws.title for ws in sheet.worksheets()]
    print(f'Remote tabs: {all_tabs}')

    # Group by tab and resolve names
    by_tab = {}
    for e in entries:
        tab_name = e['sheet']
        # Resolve truncated → full
        for t in all_tabs:
            if t == tab_name or t.startswith(tab_name) or tab_name.startswith(t):
                tab_name = t
                break
        by_tab.setdefault(tab_name, []).append(e)

    L = ['# E5 batch — full source + remote read + proposed fix']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")}_')
    L.append(f'_Spreadsheet: `{sheet.title}` (id `{E5_SHEET_ID}`)_')
    L.append(f'_Cells in batch: {len(entries)} • Fixes encoded: {len(FIXES)}_')
    L.append('')
    L.append('For each cell: live remote read (cols A/B/C/J) + drift identification + proposed NL replacement string. The proposed string is exactly what will be written to remote on sign-off.')
    L.append('')

    rendered = 0
    for tab_name in sorted(by_tab.keys()):
        ws = sheet.worksheet(tab_name)
        cells = sorted(by_tab[tab_name], key=lambda c: c['row'])
        rows = [c['row'] for c in cells]
        ranges = [f'A{r}:J{r}' for r in rows]
        print(f'  {tab_name}: {len(rows)} rows…')
        batch = ws.batch_get(ranges)

        L.append(f'## {tab_name}')
        L.append('')

        for entry, range_data in zip(cells, batch):
            r = entry['row']
            if range_data and range_data[0]:
                row_vals = list(range_data[0])
                while len(row_vals) < 10:
                    row_vals.append('')
                key = row_vals[0]
                desc = row_vals[1]
                en = row_vals[2]
                nl = row_vals[9]
            else:
                key = desc = en = nl = ''

            fix = FIXES.get((tab_name, r))
            if fix is None:
                # Try truncated key variants
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
    L.append('- `all` — apply all 25')
    L.append('- `mechanical only` — apply the 22 high-confidence, defer the 3 `[VERIFY]` items (J22, J176, J190)')
    L.append('- per-cell push-back — quote `J<row>` with your alternate fix')
    L.append('')
    L.append('On approval: I edit `excels/5_asses.masses_E5Proxy.xlsx` locally → push to remote via `push-file.py --apply` → re-pull → round-trip diff → update `_PUSH-LOG.md` → commit + push.')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)} — {rendered} cells.')


if __name__ == '__main__':
    main()
