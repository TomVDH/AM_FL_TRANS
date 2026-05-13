#!/usr/bin/env python3
"""Centralized Google Sheets API throttle + auth helper.

Google Sheets API v4 default quota: 60 read requests / minute / user.
Reset: rolling 60s window.

This module provides:
  - get_client()  — gspread client with OAuth from token.json (auto-refresh)
  - throttled_call(fn, *args)  — wraps an API call with sleep-since-last
                                  to keep under 1 call/sec (= 60/min)
  - reset_throttle()  — clears the last-call timestamp

Import in any editorial script that hits the live remote:

    from _api_throttle import get_client, throttled_call

    client = get_client()
    sheet = throttled_call(client.open_by_key, SHEET_ID)
    for ws in sheet.worksheets():
        data = throttled_call(ws.batch_get, ranges)

CALL_GAP defaults to 1.1s (slightly under 60/min). Override via env
CCD_API_GAP=N seconds, e.g. CCD_API_GAP=2 for extra-cautious runs.
"""
import os
import time
from pathlib import Path

import gspread
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

REPO = Path(__file__).resolve().parents[2]
TOKEN = REPO / 'token.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

CALL_GAP = float(os.environ.get('CCD_API_GAP', '1.1'))
_LAST_CALL = 0.0


def get_client():
    creds = Credentials.from_authorized_user_file(str(TOKEN), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            TOKEN.write_text(creds.to_json())
    return gspread.authorize(creds)


def throttled_call(fn, *args, **kwargs):
    """Run fn(*args, **kwargs) but sleep first to honour CALL_GAP."""
    global _LAST_CALL
    elapsed = time.time() - _LAST_CALL
    if elapsed < CALL_GAP:
        time.sleep(CALL_GAP - elapsed)
    try:
        result = fn(*args, **kwargs)
        _LAST_CALL = time.time()
        return result
    except gspread.exceptions.APIError as exc:
        if '429' in str(exc) or 'Quota exceeded' in str(exc):
            print(f'  ⚠ 429 hit — sleeping 65s for quota window to roll…')
            time.sleep(65)
            _LAST_CALL = time.time()
            return fn(*args, **kwargs)
        raise


def reset_throttle():
    global _LAST_CALL
    _LAST_CALL = 0.0
