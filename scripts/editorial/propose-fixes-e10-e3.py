#!/usr/bin/env python3
"""Produce full-source-of-truth + proposed-fix doc for the combined E10 + E3 DRIFT batches.

17 deep-eyeball DRIFT cells total: E10 (9 across 2 sheets) + E3 (8 across 6 sheets).

Two separate spreadsheets read live (throttled). Apply/push/audit/commit
cycles will be done per-episode afterward.

Output: data/editorial/proposed-fixes-2026-05-13-E10-E3.md
"""
import importlib.util
import time
from pathlib import Path

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
OUT = REPO / 'data/editorial/proposed-fixes-2026-05-13-E10-E3.md'

EPISODES = [
    (10, '1Q1WSEJSGm9ZPEO6bfDNpX8wqXolFhyGad-17rJzc0nw'),
    (3,  '1dPFzn_FCcmgLx8HuuMcxBa4X29ixYnlbNqNkcVN95yY'),
]

spec_t = importlib.util.spec_from_file_location(
    'throttle', REPO / 'scripts/editorial/_api_throttle.py')
throttle = importlib.util.module_from_spec(spec_t); spec_t.loader.exec_module(throttle)

spec_r = importlib.util.spec_from_file_location(
    'rescan', REPO / 'scripts/editorial/rescan-drift-2026-05-12.py')
rescan = importlib.util.module_from_spec(spec_r); spec_r.loader.exec_module(rescan)


FIXES = {
    # =========================================================================
    # E10 — 9 cells
    # =========================================================================
    ('E10_Government_localization', 47): {
        'issue': 'game-name `STENEN-SPEL` non-canonical — should be `KEIEN-SPEL`',
        'canon': '§8 game-system terms',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('STENEN-SPEL', 'KEIEN-SPEL'),
        'note': 'Cross-corpus pattern (E3_Mine1F ×5, E3_BadCave ×1, E6_BadCave fixed, E9_BadCave ×1). Caps preserved per chant register.',
    },
    ('E10_Government_localization', 68): {
        'issue': '§3.1 place name — `Muilegem` is non-canonical, canon locks `Muilenbeek`',
        'canon': '§3.1',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Muilegem', 'Muilenbeek'),
        'note': 'Canon §3.1 lock: Fannyside → Muilenbeek (with -n-). `Muilegem` matches no canon entry — likely typo/blend.',
    },
    ('E10_Government_localization', 100): {
        'issue': '§3.1 place name — `Muilegem` is non-canonical, canon locks `Muilenbeek`',
        'canon': '§3.1',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Muilegem', 'Muilenbeek'),
        'note': 'Mirror of J68 — same drift, same fix.',
    },
    ('E10_Government_localization', 110): {
        'issue': 'canon §1 v3.5 sync — `Poepegaatje` obsolete moniker, now `De Zatten Ezel`',
        'canon': '§1 Q9 / v3.5 codex',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('het Poepegaatje', 'De Zatten Ezel'),
        'note': 'Per codex v3.5: Thirsty Ass bar `Poepegaatje (Bottom\'s Up)` → `De Zatten Ezel`. Same translator who used `De Zatten Ezel` in E3_BadCave J82 and E6_World J196 reverted here.',
    },
    ('E10_Government_localization', 154): {
        'issue': '§7.3 game-system `Mensen` lowercase',
        'canon': '§7.3',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Als de mensen', 'Als de Mensen'),
    },
    ('E10_ProphetSpeech_localization', 56): {
        'issue': 'spelling typo — `kameraaden` (double-a) should be `kameraden`',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('kameraaden', 'kameraden'),
    },
    ('E10_ProphetSpeech_localization', 81): {
        'issue': 'wrong verb form — EN imperative `THROW OUT`, NL past-participle `BUITENGEGOOID` reads as "Thrown out with our leaders"',
        'canon': 'Dutch grammar (imperative vs ptcp)',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('BUITENGEGOOID MET ONZE LEIDERS', 'WEG MET ONZE LEIDERS'),
        'note': 'Speaker: Cole-Machine (manifesto chant). Options:\n   - `WEG MET ONZE LEIDERS!` (default — common Dutch protest chant idiom)\n   - `GOOI ONZE LEIDERS BUITEN!` (literal je/jij imperative)\n   - `BUITEN MET ONZE LEIDERS!` (chant-rhythm variant)\n   - `WERPT ONZE LEIDERS BUITEN!` (ge/gij imperative — Cole register?)\n   **Tom call: which form?** Default proposed: `WEG MET ONZE LEIDERS—`.',
    },
    ('E10_ProphetSpeech_localization', 110): {
        'issue': 'cross-cell EN: same line as J112 (`DON\'T BE SCARED!`), different speakers, different NL — J110 Big Ass: `WEES NIET BANG!` (neutral)',
        'canon': '§6.7 cross-cell consistency',
        'confidence': 'verify',
        'transform': lambda nl: nl,  # default = no change
        'note': 'Paired with J112 (Hard Ass: `GEEN MIETJE ZIJN!`). Speaker-differentiated registers: Big = literal neutral; Hard = tough-guy ("don\'t be a sissy"). §6.7 wants chant uniformity, but speaker voicing justifies divergence. **Tom call: unify or keep speaker-differentiated?** Default proposed: KEEP both (speaker-distinct).',
    },
    ('E10_ProphetSpeech_localization', 112): {
        'issue': 'cross-cell EN: same line as J110, J112 Hard Ass: `GEEN MIETJE ZIJN!` (tough-guy register)',
        'canon': '§6.7 cross-cell consistency',
        'confidence': 'verify',
        'transform': lambda nl: nl,  # default = no change
        'note': 'Paired with J110 (Big Ass: `WEES NIET BANG!`). See J110 note. **Default proposed: KEEP both.**',
    },

    # =========================================================================
    # E3 — 8 cells
    # =========================================================================
    ('E3_EpisodeTitle_localization', 3): {
        'issue': 'spelling typo — `AFLVERING` should be `AFLEVERING` (missing E)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('AFLVERING', 'AFLEVERING'),
    },
    ('E3_Mine1FOpening_localization', 3): {
        'issue': 'spelling typo — `kloteweeer` (triple-e) should be `kloteweer`',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('kloteweeer', 'kloteweer'),
    },
    ('E3_Mine1FOpening_localization', 33): {
        'issue': 'non-existent word — `ratioenen` should be `rantsoenen` (rations)',
        'canon': 'Dutch spelling / wrong-word',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('ratioenen', 'rantsoenen'),
    },
    ('E3_Mine1F_localization', 53): {
        'issue': 'spelling typo — `rotsbloki` not a word, should be `rotsblokje` (diminutive)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('rotsbloki', 'rotsblokje'),
    },
    ('E3_Mine1F_localization', 82): {
        'issue': 'missing accent — `Cafe` → `Café`',
        'canon': 'Dutch orthography',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('De Zatten Ezel Cafe', 'De Zatten Ezel Café'),
        'note': 'Same drift as E6_World J196/J206 (fixed). Consider also Café-prefix venue convention: `Café De Zatten Ezel` (Tom\'s E6 choice). **Tom call: prefix Café (Café De Zatten Ezel) or just accent (De Zatten Ezel Café)?** Default proposed: accent only.',
    },
    ('E3_100_localization', 6): {
        'issue': 'incomplete translation — street name `Esmasses` (an `asses`-anagram) dropped, leaving `455 ,` orphan-empty',
        'canon': '§13 mistranslation / completeness',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('455 ,', '455 Ezelmassa,'),
        'note': '''EN `Esmasses` is wordplay on `Asses` reversed-ish + `masses` = project title `Asses, Masses`. NL needs a Flemish street-name equivalent honoring the wordplay. Options:
   - `Ezelmassa` (default — direct port of project title compound)
   - `Massa-Ezelstraat` (street-suffix)
   - `Klotegem` (existing canon village — but it\'s a village, not a street)
   - `Muilenbeek` (canon §3.1 — also a place, not a street)
   - `Ezelse Massa` (preserving article structure)
   **Tom call: which street-name play?** Default proposed: `Ezelmassa`.''',
    },
    ('E3_LazysGrave_localization', 28): {
        'issue': 'wrong object — EN dialogue `Hey, nice look.` refers (per DESC) to the Foal\'s helmet; NL `schoon petje` = "nice cap"',
        'canon': '§13 mistranslation',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('schoon petje', 'schone helm'),
        'note': 'Speaker: Lazy Ass (ghost). EN `Hey, nice look.` doesn\'t literally contain `helmet` — it\'s a paraphrase commenting on the Foal\'s helmet-wearing. Adjacent J29 uses `helm` correctly. Options:\n   - `schone helm` (default — matches J29, EN intent)\n   - `schoon petje` keep (loose colloquial; `petje` can mean head-covering)\n   - `mooie helm` (alt adj)\n   **Tom call: fix to helm or keep petje?** Default proposed: `schone helm`.',
    },
    ('E3_200_localization', 4): {
        'issue': 'capitalization mid-sentence — `Ik Had` should be `Ik had` (lowercase after `Ik`)',
        'canon': 'Dutch capitalization',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Ik Had altijd', 'Ik had altijd'),
    },
}


EPISODE_OF_TAB = {
    'E10_Government_localization': 10,
    'E10_ProphetSpeech_localization': 10,
    'E3_EpisodeTitle_localization': 3,
    'E3_Mine1FOpening_localization': 3,
    'E3_Mine1F_localization': 3,
    'E3_100_localization': 3,
    'E3_LazysGrave_localization': 3,
    'E3_200_localization': 3,
}


def md_inline(s):
    if s is None or s == '': return '∅'
    return str(s).replace('`', '\\`').replace('|', '\\|').replace('\n', ' ⏎ ')


def main():
    entries = [e for e in rescan.parse_deep_eyeball() if e['episode'] in (10, 3)]
    print(f'Total DRIFT cells: {len(entries)} (E10 + E3)')
    print(f'Encoded fixes:     {len(FIXES)}')

    client = throttle.get_client()

    # Group entries by (episode, tab) for ordered emission
    by_episode_tab = {}
    for e in entries:
        by_episode_tab.setdefault(e['episode'], {}).setdefault(e['sheet'], []).append(e)

    L = ['# Combined E10 + E3 batch — full source + remote read + proposed fix']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")} (live remote, throttled — two spreadsheets)_')
    L.append(f'_Cells in batch: {len(entries)} (E10: 9 / E3: 8) • Fixes encoded: {len(FIXES)}_')
    L.append('')
    L.append('**Workflow note:** combined propose doc, separate apply/push/audit/commit cycles per-episode.')
    L.append('')

    rendered = 0

    for ep, sheet_id in EPISODES:
        print(f'\n=== E{ep} ===')
        sheet = throttle.throttled_call(client.open_by_key, sheet_id)
        all_tabs = [ws.title for ws in sheet.worksheets()]

        # Resolve fuzzy tab names
        tabs_for_ep = by_episode_tab.get(ep, {})
        resolved = {}
        for tab_name, cells in tabs_for_ep.items():
            actual = tab_name if tab_name in all_tabs else next(
                (t for t in all_tabs if t == tab_name or t.startswith(tab_name) or tab_name.startswith(t)), None)
            if actual is None:
                print(f'  ⚠ tab not found: {tab_name}')
                continue
            resolved[actual] = cells

        L.append('---')
        L.append('')
        L.append(f'# E{ep}')
        L.append('')
        L.append(f'_Spreadsheet: `{sheet.title}` (id `{sheet_id}`)_')
        L.append('')

        for tab_name in sorted(resolved.keys()):
            ws = sheet.worksheet(tab_name)
            cells = sorted(resolved[tab_name], key=lambda c: c['row'])
            ranges = [f'A{c["row"]}:J{c["row"]}' for c in cells]
            print(f'  {tab_name}: {len(cells)} rows…')
            batch = throttle.throttled_call(ws.batch_get, ranges)

            L.append(f'## {tab_name}')
            L.append('')

            for entry, range_data in zip(cells, batch):
                r = entry['row']
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
                L.append(f'- **Key (col A):**  `{md_inline(key)}`')
                L.append(f'- **Desc (col B):** `{md_inline(desc)}`')
                L.append(f'- **EN (col C):**   `{md_inline(en)}`')
                L.append(f'- **Current NL (col J, live remote):**')
                L.append(f'    `{md_inline(nl)}`')
                if fix:
                    proposed = fix['transform'](nl)
                    if proposed == nl:
                        L.append(f'- **Proposed NL:** _no transform — keep current (verify-only)_')
                    else:
                        L.append(f'- **Proposed NL:**')
                        L.append(f'    `{md_inline(proposed)}`')
                    if fix.get('note'):
                        L.append(f'- **Note:** {fix["note"]}')
                L.append('')
                rendered += 1

    L.append('---')
    L.append('')
    L.append(f'**Total cells rendered: {rendered}**')
    L.append('')
    L.append('## Sign-off shape')
    L.append('')
    L.append('- `all` — apply 11 mechanical + decisions on 6 verifies')
    L.append('- `mechanical only` — apply 11 mechanical, defer 6 verify')
    L.append('- per-cell — quote `E10 J<row>` / `E3 J<row>` to override or skip')
    L.append('')
    L.append('## Decisions needed (Tom)')
    L.append('')
    L.append('1. **E10 ProphetSpeech J81** `BUITENGEGOOID MET ONZE LEIDERS—` → `WEG MET ONZE LEIDERS—` (default chant) / `GOOI ONZE LEIDERS BUITEN—` (literal je/jij) / `WERPT ONZE LEIDERS BUITEN—` (ge/gij) / other?')
    L.append('2. **E10 ProphetSpeech J110/J112** DON\'T BE SCARED pair — unify or keep speaker-differentiated (Big=`WEES NIET BANG!` / Hard=`GEEN MIETJE ZIJN!`)?')
    L.append('3. **E3 Mine1F J82** `De Zatten Ezel Cafe!` → `De Zatten Ezel Café!` (accent only — default) or `Café De Zatten Ezel!` (prefix Café, matching E6 convention)?')
    L.append('4. **E3 100 J6** address street name — `Ezelmassa` (default — project-title port) / `Massa-Ezelstraat` / other Flemish street-name play on Esmasses?')
    L.append('5. **E3 LazysGrave J28** `schoon petje` → `schone helm` (match J29 + EN intent — default) or keep `petje` (loose colloquial)?')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)} — {rendered} cells.')


if __name__ == '__main__':
    main()
