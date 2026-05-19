#!/usr/bin/env python3
"""
border-corrections.py — apply or remove thin green border on all corrected cells on remote Google Sheets.

Reads all JSON files in data/editorial/corrections/, aggregates (file, sheet, cell) tuples,
then for each remote spreadsheet sends one batchUpdate per sheet with repeatCell border requests.

USAGE
  python3 scripts/convert/border-corrections.py                   # dry-run (apply)
  python3 scripts/convert/border-corrections.py --apply           # write green borders to remote
  python3 scripts/convert/border-corrections.py --undo            # dry-run (undo)
  python3 scripts/convert/border-corrections.py --undo --apply    # clear borders from remote
"""
import json
import sys
import time
import glob
from pathlib import Path
from collections import defaultdict

import gspread
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

PROJECT_ROOT = Path(__file__).resolve().parents[2]
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
CALL_GAP = 1.1  # seconds between API calls

# #00B050 as Sheets API fractions
GREEN_BORDER_SIDE = {
    'style': 'SOLID',
    'color': {'red': 0.0, 'green': 0.69, 'blue': 0.314},
}
NO_BORDER_SIDE = {'style': 'NONE'}

SHEETS = {
    '0_asses.masses_Manager+Intermissions+E0Proxy.xlsx': '1ScGhva1rUcwqup5rWjePK43gnvxME4mVgZvPZlIfWHQ',
    '1_asses.masses_E1Proxy.xlsx':  '1TTUN6f_DACWw2VFxPP5sBbzKSMvpMZrG8XTsqcpw0SU',
    '2_asses.masses_E2Proxy.xlsx':  '14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow',
    '3_asses.masses_E3Proxy.xlsx':  '1dPFzn_FCcmgLx8HuuMcxBa4X29ixYnlbNqNkcVN95yY',
    '4_asses.masses_E4Proxy.xlsx':  '1KzgaFaoUWE2Jv5eBfTryh8kiw944Q3MBNwtlaofpOn0',
    '5_asses.masses_E5Proxy.xlsx':  '1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E',
    '6_asses.masses_E6Proxy.xlsx':  '1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU',
    '7_asses.masses_E7Proxy.xlsx':  '1evCSy0b20NNb4mfndqDVtc-xtfZ_a7bmTm2lxlpSuYA',
    '8_asses.masses_E8Proxy.xlsx':  '1mJjvrManB-mwN-2bawLltEeRoUTq-6ch9OW5_Zyu6v0',
    '9_asses.masses_E9Proxy.xlsx':  '1zG-g9HCyECCTzY3Yc-Un-K5I1DYAjvwD9GdHj7mle_c',
    '10_asses.masses_E10Proxy.xlsx': '1Q1WSEJSGm9ZPEO6bfDNpX8wqXolFhyGad-17rJzc0nw',
}


def get_client():
    token_path = PROJECT_ROOT / 'token.json'
    creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)
    if not creds.valid and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        token_path.write_text(creds.to_json())
    return gspread.authorize(creds)


def cell_to_indices(cell_ref):
    """'J54' -> (col_0based, row_0based). Column letters only, no $."""
    i = 0
    col = 0
    while i < len(cell_ref) and cell_ref[i].isalpha():
        col = col * 26 + (ord(cell_ref[i].upper()) - ord('A') + 1)
        i += 1
    row = int(cell_ref[i:])
    return col - 1, row - 1  # 0-based


def border_request(sheet_id, col0, row0, undo=False):
    side = NO_BORDER_SIDE if undo else GREEN_BORDER_SIDE
    return {
        'repeatCell': {
            'range': {
                'sheetId': sheet_id,
                'startRowIndex': row0,
                'endRowIndex': row0 + 1,
                'startColumnIndex': col0,
                'endColumnIndex': col0 + 1,
            },
            'cell': {
                'userEnteredFormat': {
                    'borders': {
                        'top':    side,
                        'bottom': side,
                        'left':   side,
                        'right':  side,
                    }
                }
            },
            'fields': 'userEnteredFormat.borders',
        }
    }


def main():
    apply = '--apply' in sys.argv
    undo  = '--undo'  in sys.argv
    action = ('UNDO' if undo else 'APPLY') if apply else ('DRY-RUN undo' if undo else 'DRY-RUN apply')
    print(f'Mode: {action}')

    # Aggregate all corrections from JSON files
    all_cells = defaultdict(lambda: defaultdict(set))
    corrections_dir = PROJECT_ROOT / 'data' / 'editorial' / 'corrections'
    for jf in sorted(corrections_dir.glob('*.json')):
        try:
            data = json.loads(jf.read_text(encoding='utf-8'))
            for c in data.get('corrections', []):
                fname = c.get('file', '')
                sheet = c.get('sheet', '')
                cell = c.get('cell', '')
                if fname and sheet and cell:
                    all_cells[fname][sheet].add(cell)
        except Exception as e:
            print(f'ERR {jf.name}: {e}')

    total_cells = sum(len(cells) for sheets in all_cells.values() for cells in sheets.values())
    print(f'Corrections: {total_cells} cells across {len(all_cells)} files\n')

    if apply:
        gc = get_client()

    grand_total = 0

    for fname, sheets in sorted(all_cells.items()):
        if fname not in SHEETS:
            print(f'SKIP {fname}: no spreadsheet ID')
            continue

        file_total = sum(len(c) for c in sheets.values())
        print(f'{fname}: {file_total} cells across {len(sheets)} sheets')

        if not apply:
            for sheet_name, cells in sorted(sheets.items()):
                print(f'  {sheet_name}: {sorted(cells)}')
            continue

        time.sleep(CALL_GAP)
        sh = gc.open_by_key(SHEETS[fname])

        # Build title -> sheet_id map (handle Excel 31-char truncation)
        remote_map = {}
        for ws in sh.worksheets():
            remote_map[ws.title] = ws
            # also index by first 31 chars as fallback key
            if len(ws.title) > 31:
                remote_map[ws.title[:31]] = ws

        for sheet_name, cells in sorted(sheets.items()):
            ws = remote_map.get(sheet_name)
            if ws is None:
                # Try prefix match
                for title, candidate in remote_map.items():
                    if title.startswith(sheet_name) or sheet_name.startswith(title):
                        ws = candidate
                        break
            if ws is None:
                print(f'  SKIP {sheet_name}: not found remotely')
                continue

            requests = []
            for cell_ref in cells:
                try:
                    col0, row0 = cell_to_indices(cell_ref)
                    requests.append(border_request(ws.id, col0, row0, undo=undo))
                except Exception as e:
                    print(f'  ERR parsing {cell_ref}: {e}')

            if requests:
                time.sleep(CALL_GAP)
                sh.batch_update({'requests': requests})
                verb = 'cleared' if undo else 'applied'
                print(f'  {sheet_name}: {len(requests)} borders {verb}')
                grand_total += len(requests)

    verb = 'cleared' if undo else 'applied'
    mode = verb.upper() if apply else f'DRY RUN ({verb})'
    print(f'\n[{mode}] {grand_total} borders total')
    if not apply:
        flag = '--undo --apply' if undo else '--apply'
        print(f'Re-run with {flag} to write to remote.')


if __name__ == '__main__':
    main()
