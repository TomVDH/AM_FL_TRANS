#!/usr/bin/env python3
"""Project-wide slogan / chant corpus scan — LIVE REMOTE via API (throttled).

Same scope as slogan-chant-corpus-scan.py (which reads a snapshot) but pulls
fresh from the live remote Google Sheets via gspread. Uses _api_throttle to
stay under 60 read/min/user quota.

For each of the 11 workbooks, for each tab, makes ONE batch_get call for
columns A/C/J (key, EN, NL). With CALL_GAP=1.1s, ~106 tabs runs in ~2 min.

Output: data/editorial/slogan-chant-corpus-scan-live-<DATE>.md

Usage:
  python3 scripts/editorial/slogan-chant-corpus-scan-live.py
  CCD_API_GAP=2 python3 scripts/editorial/slogan-chant-corpus-scan-live.py
"""
import importlib.util
import re
import sys
import time
from pathlib import Path

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
OUT = REPO / f'data/editorial/slogan-chant-corpus-scan-live-{time.strftime("%Y-%m-%d")}.md'

# Load the throttle helper
spec = importlib.util.spec_from_file_location(
    'throttle', REPO / 'scripts/editorial/_api_throttle.py')
throttle = importlib.util.module_from_spec(spec)
spec.loader.exec_module(throttle)

SHEETS = [
    (0, '1ScGhva1rUcwqup5rWjePK43gnvxME4mVgZvPZlIfWHQ', '0_asses.masses_Manager+Intermissions+E0Proxy'),
    (1, '1TTUN6f_DACWw2VFxPP5sBbzKSMvpMZrG8XTsqcpw0SU', '1_asses.masses_E1Proxy'),
    (2, '14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow', '2_asses.masses_E2Proxy'),
    (3, '1dPFzn_FCcmgLx8HuuMcxBa4X29ixYnlbNqNkcVN95yY', '3_asses.masses_E3Proxy'),
    (4, '1KzgaFaoUWE2Jv5eBfTryh8kiw944Q3MBNwtlaofpOn0', '4_asses.masses_E4Proxy'),
    (5, '1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E', '5_asses.masses_E5Proxy'),
    (6, '1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU', '6_asses.masses_E6Proxy'),
    (7, '1evCSy0b20NNb4mfndqDVtc-xtfZ_a7bmTm2lxlpSuYA', '7_asses.masses_E7Proxy'),
    (8, '1mJjvrManB-mwN-2bawLltEeRoUTq-6ch9OW5_Zyu6v0', '8_asses.masses_E8Proxy'),
    (9, '1zG-g9HCyECCTzY3Yc-Un-K5I1DYAjvwD9GdHj7mle_c', '9_asses.masses_E9Proxy'),
    (10, '1Q1WSEJSGm9ZPEO6bfDNpX8wqXolFhyGad-17rJzc0nw', '10_asses.masses_E10Proxy'),
]

TOKENS = {
    'EN_CHANT': [
        r'\bass\s+power\b',
        r'\bass!\b.*\bpower!\b',
        r'when i say ass',
    ],
    'EN_LONGFORM': [
        r'show the world the power of the ass',
        r'power of the ass\b',
    ],
    'NL_CHANT': [
        r'\bezels\s+eerst\b',
        r'\bezels!\b.*\beerst!\b',
    ],
    'NL_LONGFORM': [
        r'belangen van de ezels',
        r'belangan van de ezels',
        r'wereld aan de belang',
        r'macht van de ezels',
        r'power of the ezels',
    ],
    'CHANT_FRAGMENT': [
        r'\bEZELS!\B',
        r'\bEERST!\b',
    ],
}


def extract_speaker(key):
    if not key:
        return ''
    parts = str(key).split('.')
    return parts[-1].strip() if len(parts) >= 2 else str(key).strip()


def classify(en, nl):
    hits = []
    for bucket, toks in TOKENS.items():
        for tok in toks:
            target = en if bucket.startswith('EN_') else nl
            if re.search(tok, target or '', flags=re.IGNORECASE):
                hits.append(bucket)
                break
    return hits


def md_inline(s):
    if not s:
        return '∅'
    return str(s).replace('`', '\\`').replace('|', '\\|').replace('\n', ' ⏎ ')


def scan_workbook(ep_num, sheet_id, label, client):
    """Throttled per-tab scan. One batch_get per tab (cols A:J of all rows)."""
    print(f'  E{ep_num} ({label})…')
    sheet = throttle.throttled_call(client.open_by_key, sheet_id)
    findings = []
    tabs = sheet.worksheets()
    for ws in tabs:
        # Fetch full A:J range in one call. Limit rows to safe upper bound.
        # We use get_values to pull the whole tab — one API call per tab.
        rows = throttle.throttled_call(ws.get_values, 'A1:J9999')
        for r, row in enumerate(rows[1:], 2):  # skip header
            if len(row) < 3:
                continue
            # pad to length 10
            while len(row) < 10:
                row.append('')
            key = row[0]
            en = row[2]
            nl = row[9]
            if not en and not nl:
                continue
            buckets = classify(en, nl)
            if not buckets:
                continue
            findings.append({
                'ep': ep_num, 'tab': ws.title, 'row': r,
                'key': key, 'speaker': extract_speaker(key),
                'en': en, 'nl': nl, 'buckets': buckets,
            })
        print(f'    {ws.title}: {len(rows)-1} rows scanned')
    return findings


def main():
    client = throttle.get_client()
    print(f'API throttle: {throttle.CALL_GAP}s per call (override via CCD_API_GAP env)')
    print()

    all_findings = []
    t0 = time.time()
    for ep_num, sheet_id, label in SHEETS:
        all_findings.extend(scan_workbook(ep_num, sheet_id, label, client))
    elapsed = time.time() - t0
    print(f'\nDone in {elapsed:.1f}s. Total cells matched: {len(all_findings)}')

    by_bucket = {}
    for f in all_findings:
        for b in f['buckets']:
            by_bucket.setdefault(b, []).append(f)

    L = ['# Project-wide slogan / chant corpus scan — LIVE REMOTE']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")} (live remote, gspread API, throttled)_')
    L.append(f'_Workbooks: 11 (E0–E10) — read directly from source-of-truth Google Sheets_')
    L.append(f'_API throttle: {throttle.CALL_GAP}s/call (= {60/throttle.CALL_GAP:.0f}/min ceiling) — under 60/min/user quota_')
    L.append(f'_Wall time: {elapsed:.1f}s_')
    L.append('')
    L.append('## Purpose')
    L.append('')
    L.append('Surface every §14.1 slogan / dying-words quote across the corpus. Direct API read (no xlsx intermediate) so output reflects live remote at scan time.')
    L.append('')
    L.append('## Totals')
    L.append('')
    L.append(f'- Total cells matched: **{len(all_findings)}**')
    for bucket, hits in sorted(by_bucket.items(), key=lambda x: -len(x[1])):
        L.append(f'- {bucket}: {len(hits)} cell(s)')
    L.append('')
    L.append('## Cells by episode/tab')
    L.append('')

    by_ep = {}
    for f in all_findings:
        by_ep.setdefault(f['ep'], []).append(f)
    for ep in sorted(by_ep.keys()):
        L.append(f'### E{ep}')
        L.append('')
        by_tab = {}
        for f in by_ep[ep]:
            by_tab.setdefault(f['tab'], []).append(f)
        for tab in sorted(by_tab.keys()):
            L.append(f'#### {tab}')
            L.append('')
            for f in sorted(by_tab[tab], key=lambda x: x['row']):
                buckets_label = ', '.join(f['buckets'])
                L.append(f'**J{f["row"]}** `[{buckets_label}]`')
                L.append(f'- Key:     `{md_inline(f["key"])}`')
                L.append(f'- Speaker: `{md_inline(f["speaker"])}`')
                L.append(f'- EN:      `{md_inline(f["en"])}`')
                L.append(f'- NL:      `{md_inline(f["nl"])}`')
                L.append('')

    L.append('## Notes')
    L.append('')
    L.append('- Read directly from live remote (no snapshot intermediate).')
    L.append('- API throttle prevents 60/min/user 429 quota errors.')
    L.append('- Re-run anytime to refresh against latest remote state.')
    L.append('- `CHANT_FRAGMENT` regex picks up plain `Ezels!` exclamations — review context to distinguish chant vs casual dialogue.')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)}')


if __name__ == '__main__':
    main()
