#!/usr/bin/env python3
"""Produce full-source-of-truth + proposed-fix doc for the E6 DRIFT batch.

15 deep-eyeball DRIFT cells across 4 sheets.

Note: the deep-eyeball doc claim `J20 / J33` for the Endure cross-cell
inconsistency contains a row-typo — the actual Endure cells in current
xlsx are J18+J33. J20 is `Lick Wounds`, paired with J38 (also `Lick
Wounds`) — a separate case-mismatch (`Wonden likken` vs `Wonden Likken`).
Both inconsistency pairs surfaced for Tom's call.

Output: data/editorial/proposed-fixes-2026-05-13-E6.md
"""
import importlib.util
import time
from pathlib import Path

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
OUT = REPO / 'data/editorial/proposed-fixes-2026-05-13-E6.md'
E6_SHEET_ID = '1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU'

spec_t = importlib.util.spec_from_file_location(
    'throttle', REPO / 'scripts/editorial/_api_throttle.py')
throttle = importlib.util.module_from_spec(spec_t); spec_t.loader.exec_module(throttle)

spec_r = importlib.util.spec_from_file_location(
    'rescan', REPO / 'scripts/editorial/rescan-drift-2026-05-12.py')
rescan = importlib.util.module_from_spec(spec_r); spec_r.loader.exec_module(rescan)


FIXES = {
    # E6_BadCave_localization (4 cells; J40 likely already capped — verify)
    ('E6_BadCave_localization', 24): {
        'issue': 'game-name `Stenen-spel` non-canonical — should be `Keien-Spel`',
        'canon': '§8 game-system terms',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace("'Stenen-spel'", "'Keien-Spel'"),
        'note': 'Same drift as E3_Mine1F (×5), E3_BadCave (×1), E9_BadCave (×1) — cross-corpus pattern. Canonicalize via §8.',
    },
    ('E6_BadCave_localization', 38): {
        'issue': '§7.3 game-system `Mensen` lowercase in philosophical Bad Ass context',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('voor de mensen', 'voor de Mensen'),
    },
    ('E6_BadCave_localization', 39): {
        'issue': '§7.3 game-system `Mensen` lowercase in philosophical Bad Ass context',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Intelligente mensen', 'Intelligente Mensen'),
    },
    ('E6_BadCave_localization', 40): {
        'issue': 'flagged for inconsistency context (J38/J39 lc, J40 cap) — J40 already capped',
        'canon': '§7.3',
        'confidence': 'verify',
        'transform': lambda nl: nl,
        'note': 'Per deep-eyeball: "J40 has `Mensen` cap, J38/J39 lowercase — inconsistency too" — J40 is the **correct** form. No change needed; fixing J38/J39 brings them up to J40. **Recommend SKIP.**',
    },

    # E6_BattleHard_localization (2 cells per claim line, 4 cells in reality)
    # J20+J33 claim is row-typo — actual Endure pair is J18+J33
    ('E6_BattleHard_localization', 20): {
        'issue': 'cross-cell case-mismatch on `Lick Wounds`: J20 `Wonden likken` vs J38 `Wonden Likken`',
        'canon': '§6.7 cross-cell consistency',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Wonden likken', 'Wonden Likken'),
        'note': 'Both J20 and J38 translate the EN game-skill `Lick Wounds`. Title-case (Wonden Likken) matches "Player Attack" UI convention used elsewhere; lower-case (Wonden likken) is also defensible. **Tom call: which form do we unify both to?** Default proposed: Wonden Likken (match J38).',
    },
    ('E6_BattleHard_localization', 33): {
        'issue': 'cross-cell inconsistency on `Endure`: J18 `Verduren` vs J33 `Volharden`',
        'canon': '§6.7 cross-cell consistency',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Volharden', 'Verduren'),
        'note': 'Same EN `Endure` translated two different ways. `Verduren` = endure/bear (passive), `Volharden` = persevere (active). The "Raise Defense" mechanic suggests passive→`Verduren`; J18 also uses `Verduren`. **Tom call: which form?** Default proposed: Verduren (unify on J18). Or flip — set J18 to Volharden.',
    },

    # E6_Nightmare_localization (1 cell)
    ('E6_Nightmare_localization', 3): {
        'issue': 'd/t spelling — 3rd person sg passive: `word` → `wordt`',
        'canon': 'Dutch spelling (d/t rule)',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Er word niet', 'Er wordt niet'),
    },

    # E6_World_localization (8 cells)
    ('E6_World_localization', 75): {
        'issue': 'mistranslation — `gesteld` = stipulated/composed (legal/formal), not "FINE"',
        'canon': '§13 mistranslation',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('GESTELD MOEDER', 'PRIMA MOEDER'),
        'note': 'EN "I\'m FINE MOTHER!" — Foal\'s annoyed teen-shout. Alternates: `PRIMA` (most idiomatic), `IN ORDE`, `GOED`. **Tom call: which? Default proposed: PRIMA.**',
    },
    ('E6_World_localization', 188): {
        'issue': 'adj-agreement — de-word `tijd` requires adj-e ending',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('wat mooi tijd', 'wat mooie tijd'),
    },
    ('E6_World_localization', 196): {
        'issue': 'missing accent — `Cafe` → `Café`',
        'canon': 'Dutch orthography',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('De Zatten Ezel Cafe', 'De Zatten Ezel Café'),
        'note': 'Same drift as E3_BadCave J82 and E6_World J206. `Café` is loanword from French with accent preserved in standard Dutch.',
    },
    ('E6_World_localization', 197): {
        'issue': 'multi-issue: `verdomse` → `verdomde` + missing translation of "share some good \'ol water" + word-order awkward + `gedoeme` → `godverdomme`',
        'canon': 'Dutch grammar + §13 mistranslation',
        'confidence': 'verify',
        'transform': lambda nl: (
            nl.replace('verdomse', 'verdomde')
              .replace(
                  'om een plekske waar Ezels efkes kunnen pauzeren open te doen, gedoeme.',
                  'om een plekske open te doen waar Ezels efkes kunnen pauzeren en wa goe ouw water kunnen delen, godverdomme.')
        ),
        'note': '''Three issues compounded:
1. `verdomse` is not a word — `verdomde` (the adj/intensifier) is correct.
2. Word-order `om een plekske waar Ezels efkes kunnen pauzeren open te doen` is awkward — verbs separated by long subclause. Inversion `om een plekske open te doen waar Ezels efkes kunnen pauzeren` reads naturally.
3. `gedoeme` is a non-standard contraction; `godverdomme` or `godver` standard.
4. EN says "and share some good \'ol water" — currently untranslated in NL. Proposed adds `en wa goe ouw water kunnen delen` (Flemish register).

**Significant rewrite — Tom call needed.** Alternates: keep `gedoeme` for character flavor (Thirsty\'s slurred speech); skip the water-share addition; use `godver` instead of `godverdomme`.''',
    },
    ('E6_World_localization', 206): {
        'issue': 'missing accent — `CAFE` → `CAFÉ`',
        'canon': 'Dutch orthography',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('mijn CAFE open', 'mijn CAFÉ open'),
        'note': 'Same accent fix as J196. Caps version preserves É per Dutch convention.',
    },
    ('E6_World_localization', 209): {
        'issue': 'flagged as DRIFT but deep-eyeball concluded `dezen ouwen emmer` is fine Flemish dialect',
        'canon': '§5.2 register',
        'confidence': 'verify',
        'transform': lambda nl: nl,
        'note': 'Per deep-eyeball: "`dezen ouwen emmer` is fine Flemish dialect (masc article + adj agreement). ✓" — **Recommend SKIP / KEEP.** Listed for completeness.',
    },
    ('E6_World_localization', 260): {
        'issue': 'past participle d/t — `sjokken` root in k → -t, not -d',
        'canon': 'Dutch spelling (d/t rule, kofschip)',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('aangesjokd', 'aangesjokt'),
    },
    ('E6_World_localization', 292): {
        'issue': 'stutter consonant mismatch — `B-B-VERRADEN` stutters B before V-starting verb',
        'canon': '§12.3 Slow stutter pattern',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('B-B-VERRADEN', 'V-V-VERRADEN'),
        'note': 'Slow Ass stutter rule: stutter on the leading consonant of the actual word. NL verb is `verraden` → V-V-VERRADEN. EN `B-BETRAYED` stutters on B because EN word starts with B; NL stutter should follow the NL word, not the EN. **Tom call: keep B-B (mimic EN pattern) or fix to V-V (follow NL word)?**',
    },
}


def md_inline(s):
    if s is None or s == '': return '∅'
    return str(s).replace('`', '\\`').replace('|', '\\|').replace('\n', ' ⏎ ')


def main():
    entries = [e for e in rescan.parse_deep_eyeball() if e['episode'] == 6]
    print(f'E6 DRIFT cells: {len(entries)}')
    print(f'Encoded fixes:   {len(FIXES)}')

    client = throttle.get_client()
    sheet = throttle.throttled_call(client.open_by_key, E6_SHEET_ID)
    all_tabs = [ws.title for ws in sheet.worksheets()]

    by_tab = {}
    for e in entries:
        tab_name = e['sheet']
        for t in all_tabs:
            if t == tab_name or t.startswith(tab_name) or tab_name.startswith(t):
                tab_name = t
                break
        by_tab.setdefault(tab_name, []).append(e)

    L = ['# E6 batch — full source + remote read + proposed fix']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")} (live remote, throttled)_')
    L.append(f'_Spreadsheet: `{sheet.title}` (id `{E6_SHEET_ID}`)_')
    L.append(f'_Cells in batch: {len(entries)} • Fixes encoded: {len(FIXES)}_')
    L.append('')
    L.append('**Notes on the batch:**')
    L.append('- Deep-eyeball flagged `J20 / J33` for the Endure inconsistency, but in current xlsx the Endure pair is **J18 + J33** (J20 is a different cell — `Lick Wounds`). Both inconsistency pairs surfaced below.')
    L.append('- 4 cells marked SKIP/KEEP candidates: J40 BadCave (already capped) + J209 World (Flemish ✓ confirmed).')
    L.append('- 4 cells require Tom-call decisions (cross-cell consistency direction or word-choice picks).')
    L.append('')

    rendered = 0
    for tab_name in sorted(by_tab.keys()):
        ws = sheet.worksheet(tab_name)
        cells = sorted(by_tab[tab_name], key=lambda c: c['row'])
        # Add the J18 BattleHard partner row for context (Endure cross-cell)
        if tab_name == 'E6_BattleHard_localization':
            extra_rows = [18, 38]  # J18 = Endure pair partner; J38 = Lick Wounds pair partner
        else:
            extra_rows = []
        all_rows = sorted(set(c['row'] for c in cells) | set(extra_rows))
        ranges = [f'A{r}:J{r}' for r in all_rows]
        print(f'  {tab_name}: {len(all_rows)} rows…')
        batch = throttle.throttled_call(ws.batch_get, ranges)

        L.append(f'## {tab_name}')
        L.append('')

        for r, range_data in zip(all_rows, batch):
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
            elif r in extra_rows:
                L.append(f'- **Context-only row** (paired with another DRIFT cell — shown for cross-cell comparison)')
            L.append(f'- **Key (col A):**  `{md_inline(key)}`')
            L.append(f'- **Desc (col B):** `{md_inline(desc)}`')
            L.append(f'- **EN (col C):**   `{md_inline(en)}`')
            L.append(f'- **Current NL (col J, live remote):**')
            L.append(f'    `{md_inline(nl)}`')
            if fix:
                proposed = fix['transform'](nl)
                if proposed == nl:
                    L.append(f'- **Proposed NL:** _no transform — skip/keep_')
                else:
                    L.append(f'- **Proposed NL:**')
                    L.append(f'    `{md_inline(proposed)}`')
                if fix.get('note'):
                    L.append(f'- **Note:** {fix["note"]}')
            L.append('')
            rendered += 1

    L.append('---')
    L.append('')
    L.append(f'**Total cells rendered: {rendered}** (15 DRIFT + 2 partner-context rows)')
    L.append('')
    L.append('## Sign-off shape')
    L.append('')
    L.append('- `all` — apply 11 mechanical + decisions on 4 verifies')
    L.append('- `mechanical only` — apply 8 mechanical, defer 7 verify/skip')
    L.append('- per-cell — quote `J<row>` to override or skip')
    L.append('')
    L.append('## Decisions needed (Tom)')
    L.append('')
    L.append('1. **BattleHard Endure pair (J18/J33):** unify to `Verduren` (default) or `Volharden`?')
    L.append('2. **BattleHard Lick Wounds pair (J20/J38):** unify to `Wonden Likken` (default, title-case) or `Wonden likken`?')
    L.append('3. **World J75 GESTELD MOEDER:** `PRIMA` (default) / `IN ORDE` / `GOED`?')
    L.append('4. **World J197 verdomse rewrite:** full rewrite (default) or partial (just fix `verdomse`)?')
    L.append('5. **World J292 B-B-VERRADEN stutter:** flip to `V-V-VERRADEN` (default per §12.3) or keep `B-B` (mimic EN)?')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)} — {rendered} cells.')


if __name__ == '__main__':
    main()
