#!/usr/bin/env python3
"""
pull-snapshot.py — pull all 11 source sheets to a custom dir via the public xlsx export.

No auth: relies on sheets being shared "anyone with link can view" (same as download-sheets.js).

USAGE
  py scripts/convert/pull-snapshot.py <out-dir>

EXAMPLES
  py scripts/convert/pull-snapshot.py excels/Patrick-2026-05-08
"""
import sys
import urllib.request
from pathlib import Path

SHEETS = [
    ('1ScGhva1rUcwqup5rWjePK43gnvxME4mVgZvPZlIfWHQ', '0_asses.masses_Manager+Intermissions+E0Proxy.xlsx'),
    ('1TTUN6f_DACWw2VFxPP5sBbzKSMvpMZrG8XTsqcpw0SU', '1_asses.masses_E1Proxy.xlsx'),
    ('14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow', '2_asses.masses_E2Proxy.xlsx'),
    ('1dPFzn_FCcmgLx8HuuMcxBa4X29ixYnlbNqNkcVN95yY', '3_asses.masses_E3Proxy.xlsx'),
    ('1KzgaFaoUWE2Jv5eBfTryh8kiw944Q3MBNwtlaofpOn0', '4_asses.masses_E4Proxy.xlsx'),
    ('1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E', '5_asses.masses_E5Proxy.xlsx'),
    ('1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU', '6_asses.masses_E6Proxy.xlsx'),
    ('1evCSy0b20NNb4mfndqDVtc-xtfZ_a7bmTm2lxlpSuYA', '7_asses.masses_E7Proxy.xlsx'),
    ('1mJjvrManB-mwN-2bawLltEeRoUTq-6ch9OW5_Zyu6v0', '8_asses.masses_E8Proxy.xlsx'),
    ('1zG-g9HCyECCTzY3Yc-Un-K5I1DYAjvwD9GdHj7mle_c', '9_asses.masses_E9Proxy.xlsx'),
    ('1Q1WSEJSGm9ZPEO6bfDNpX8wqXolFhyGad-17rJzc0nw', '10_asses.masses_E10Proxy.xlsx'),
]


def main():
    if len(sys.argv) != 2:
        print('Usage: pull-snapshot.py <out-dir>')
        sys.exit(2)
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    ok = fail = 0
    for sid, name in SHEETS:
        url = f'https://docs.google.com/spreadsheets/d/{sid}/export?format=xlsx'
        dest = out / name
        try:
            with urllib.request.urlopen(url) as r:
                data = r.read()
            dest.write_bytes(data)
            print(f'  OK  {name}  ({len(data) // 1024} KB)')
            ok += 1
        except Exception as e:
            print(f'  ERR {name}: {e}')
            fail += 1
    print(f'\n{ok} ok, {fail} failed → {out}')
    sys.exit(0 if fail == 0 else 1)


if __name__ == '__main__':
    main()
