#!/usr/bin/env python3
"""
oauth-bootstrap.py — One-time OAuth flow to generate token.json from credentials.json.

Reads:  PROJECT_ROOT/credentials.json (Google OAuth installed-app client secret)
Writes: PROJECT_ROOT/token.json       (refresh token used by push-file.py / push-tab.py)

USAGE:
    source .venv-sheets/bin/activate
    python3 scripts/convert/oauth-bootstrap.py

A browser window opens for Google OAuth consent. After approval, token.json
is saved at the project root. push-file.py and push-tab.py will use it.
"""

import sys
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CREDS_PATH = PROJECT_ROOT / 'credentials.json'
TOKEN_PATH = PROJECT_ROOT / 'token.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']


def main():
    if not CREDS_PATH.exists():
        print(f'ERROR: {CREDS_PATH} not found.')
        print('Place your OAuth client_secret JSON at the project root as credentials.json')
        sys.exit(1)

    if TOKEN_PATH.exists():
        ans = input(f'{TOKEN_PATH} already exists. Overwrite? [y/N] ').strip().lower()
        if ans != 'y':
            print('Aborted.')
            sys.exit(0)

    print(f'Reading client secret from: {CREDS_PATH}')
    print('Starting OAuth flow — a browser window will open.')
    print('Sign in with the Google account that has access to the project sheets.')
    print()

    flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_PATH), SCOPES)
    creds = flow.run_local_server(port=0, prompt='consent')

    TOKEN_PATH.write_text(creds.to_json())
    print(f'\n✓ Saved {TOKEN_PATH}')
    print('  (gitignored — refresh token, do not commit)')
    print('\nVerify with:')
    print('  python3 scripts/convert/push-file.py 0_asses.masses_Manager+Intermissions+E0Proxy.xlsx')
    print('  (dry-run; --apply not added)')


if __name__ == '__main__':
    main()
