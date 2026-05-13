#!/usr/bin/env python3
"""Read the 25 E5 DRIFT cells directly from the live remote Google Sheet via API.

Uses gspread + OAuth token.json to query the E5Proxy spreadsheet. For each
cell flagged DRIFT in audit-2026-05-12-deep-eyeball.md, reads columns A
(key), B (description), C (EN), J (NL) from the live remote.

Output: data/editorial/api-read-2026-05-13-E5-drift.md

This is the canonical "read source-of-truth" action — the remote is the
authority per canon §0.
"""
import importlib.util
import time
from pathlib import Path

import gspread
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
TOKEN = REPO / 'token.json'
OUT = REPO / 'data/editorial/api-read-2026-05-13-E5-drift.md'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

E5_SHEET_ID = '1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E'

# Load parser
spec = importlib.util.spec_from_file_location(
    'rescan', REPO / 'scripts/editorial/rescan-drift-2026-05-12.py')
rescan = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rescan)


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
    print(f'E5 DRIFT cells from deep-eyeball: {len(entries)}')

    client = get_client()
    sheet = client.open_by_key(E5_SHEET_ID)
    print(f'Opened: {sheet.title}')
    print(f'Tabs: {[ws.title for ws in sheet.worksheets()]}')

    # Group by sheet to minimize API calls
    by_sheet = {}
    for e in entries:
        by_sheet.setdefault(e['sheet'], []).append(e)

    L = ['# Live remote read — E5 DRIFT cells (source-of-truth pull via API)']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")}_')
    L.append(f'_Spreadsheet: `{sheet.title}` (id `{E5_SHEET_ID}`)_')
    L.append(f'_API: gspread {gspread.__version__} via OAuth (token.json, scope: spreadsheets)_')
    L.append('')
    L.append('Each cell below is a fresh read from the live remote columns A (Key), B (Description), C (EN), J (NL).')
    L.append('')

    total_read = 0
    for claimed_sheet, cells in by_sheet.items():
        # Resolve tab name (Excel 31-char truncation may apply)
        all_tabs = [ws.title for ws in sheet.worksheets()]
        target_tab = None
        for t in all_tabs:
            if t == claimed_sheet or t.startswith(claimed_sheet) or claimed_sheet.startswith(t):
                target_tab = t
                break
        L.append(f'## {claimed_sheet}')
        L.append('')
        if target_tab is None:
            L.append(f'⚠ Tab not found in remote spreadsheet. Available: {all_tabs}')
            L.append('')
            continue
        if target_tab != claimed_sheet:
            L.append(f'_(Resolved to remote tab `{target_tab}`)_')
            L.append('')
        ws = sheet.worksheet(target_tab)

        # Batch read all cells we need for this tab in one API call
        # Read range covers A through J for the rows we need
        rows = sorted(c['row'] for c in cells)
        # Use a single batch get for all rows
        ranges = []
        for r in rows:
            ranges.append(f'A{r}:J{r}')
        print(f'  Reading {len(rows)} rows from tab {target_tab!r} ({len(ranges)} ranges)…')
        try:
            batch = ws.batch_get(ranges)
        except Exception as exc:
            L.append(f'⚠ Batch read failed: {exc}')
            L.append('')
            continue

        # batch is list of value-lists, one per range
        for entry, range_data in zip(sorted(cells, key=lambda c: c['row']), batch):
            r = entry['row']
            if range_data and len(range_data) > 0 and range_data[0]:
                row_vals = range_data[0]
                # Pad to length 10
                while len(row_vals) < 10:
                    row_vals.append('')
                key = row_vals[0] if len(row_vals) > 0 else ''
                desc = row_vals[1] if len(row_vals) > 1 else ''
                en = row_vals[2] if len(row_vals) > 2 else ''
                nl = row_vals[9] if len(row_vals) > 9 else ''
            else:
                key = desc = en = nl = ''
            L.append(f'### J{r}')
            L.append('')
            L.append(f'- **Claim** (deep-eyeball L{entry["source_line_num"]}): {md_inline(entry["claim_line"])}')
            L.append(f'- **Source:** live remote API read')
            L.append(f'- **Key (col A):** `{md_inline(key)}`')
            L.append(f'- **Desc (col B):** `{md_inline(desc)}`')
            L.append(f'- **EN (col C):** `{md_inline(en)}`')
            L.append(f'- **NL (col J):** `{md_inline(nl)}`')
            L.append('')
            total_read += 1

    L.append('---')
    L.append(f'_Total cells read from remote: {total_read}_')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)} — {total_read} cells fresh from remote.')


if __name__ == '__main__':
    main()
