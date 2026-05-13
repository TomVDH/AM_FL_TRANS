#!/usr/bin/env python3
"""Final combined propose-fix doc — closes the deep-eyeball DRIFT queue
plus actionable audit residuals.

10 deep-eyeball DRIFT cells (E7×5, E0×2, E8×2, E9×1) + 5 audit-residual
cells (E2 J25 §5.4, E5 J208 §9.1, E6_Nightmare J63/J70/J71 §10.7/§9.1/§7.1)
= 15 cells across 7 spreadsheets.

VERIFY-only / known-skip residuals (NOT in this batch — listed in doc header):
  - Schoon Beest §4.4 PUSHED-BEFORE × 3 (E1 J29, E2 J46, E4 J62) — canonical
  - Sturdy motto §12.2 fragments × 7 (E6 J142 + E9 J18/J19/J20/J21/J43/J68)
    — speaker-fragmented intentional motto reveals, all verify
  - E3 §9.6 diary contracted × 2 (E3_100 J3 + E3_300 J7) — false-positive
    (rule applies to WRITE.Dialog journal entries, those are SAY.Dialog)

Output: data/editorial/proposed-fixes-2026-05-13-FINAL.md
"""
import importlib.util
import time
from pathlib import Path

REPO = Path('/Users/tomlinson/Projects/VIBE CODING/am-fl-trans')
OUT = REPO / 'data/editorial/proposed-fixes-2026-05-13-FINAL.md'

SPREADSHEETS = {
    0:  '1ScGhva1rUcwqup5rWjePK43gnvxME4mVgZvPZlIfWHQ',
    2:  '14LxAqOh5lBlDo6hqcF86Q2IJHwTAfrO36xBKUDjk5ow',
    5:  '1yxDuFb6NDDYHytA_oAi9EgprHxdzE8zYNu1KgA7Pp2E',
    6:  '1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU',
    7:  '1evCSy0b20NNb4mfndqDVtc-xtfZ_a7bmTm2lxlpSuYA',
    8:  '1mJjvrManB-mwN-2bawLltEeRoUTq-6ch9OW5_Zyu6v0',
    9:  '1zG-g9HCyECCTzY3Yc-Un-K5I1DYAjvwD9GdHj7mle_c',
}

spec_t = importlib.util.spec_from_file_location(
    'throttle', REPO / 'scripts/editorial/_api_throttle.py')
throttle = importlib.util.module_from_spec(spec_t); spec_t.loader.exec_module(throttle)


# (ep, sheet, row) → fix dict
FIXES = {
    # =========================================================================
    # DEEP-EYEBALL DRIFT
    # =========================================================================
    # E7 — 5 cells
    (7, 'E7_Chilling_localization', 5): {
        'issue': 'canon §14.2.1 compound mangled — `ezelenhemelvaartszangderzielen` (all-lc no-hyphens single mega-compound) should be `Hemelvaarts-zang-der-Ezel-zielen` (article + cap + hyphens)',
        'canon': '§14.2.1',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('de ezelenhemelvaartszangderzielen', 'de Hemelvaarts-zang-der-Ezel-zielen'),
    },
    (7, 'E7_Holding1_localization', 22): {
        'issue': 'ge/gij present 2nd-person — `zij` (= 3rd-pl/aux) should be `zijt`',
        'canon': '§5.0 ge/gij',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Wie zij GIJ', 'Wie zijt GIJ'),
        'note': 'Kick Ass speaker (ge/gij register per codex).',
    },
    (7, 'E7_MeatProcessing_localization', 9): {
        'issue': 'cross-cell EN match J11 — same line, different NL: J9 `toont` vs J11 `laat zien`',
        'canon': '§6.7 cross-cell consistency',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('iedereen toont', 'iedereen laat zien'),
        'note': 'Smart Ass identical EN line in both cells (`Time for the Ace Strategist to show everyone how it\'s done!`). **Tom call: unify on `toont` (J9 current) or `laat zien` (J11 current)?** Default proposed: `laat zien` (unify J9 → J11 form).',
    },
    (7, 'E7_MeatProcessing_localization', 11): {
        'issue': 'cross-cell EN match J9 — paired (no change if unifying to J11\'s `laat zien`)',
        'canon': '§6.7 cross-cell consistency',
        'confidence': 'verify',
        'transform': lambda nl: nl,
        'note': 'See J9 note. **Default: KEEP J11 (no change), apply J9 → `laat zien`.**',
    },
    (7, 'E7_Skinning_localization', 8): {
        'issue': 'Dutch spelling — `electriciteit` should be `elektriciteit` (k, not c)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('electriciteit', 'elektriciteit'),
    },

    # E0 — 2 cells
    (0, 'CharacterProfiles_localization', 81): {
        'issue': 'adj-form typo — `Groffe` (double-f) should be `Grove` (female form of `Grof`, one v not two f)',
        'canon': 'Dutch spelling',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Groffe Ezel', 'Grove Ezel'),
        'note': 'Character profile EN `Blunt Ass` → NL `Grove Ezel`. (`Grof` masc → `Grove` fem-adj-e ending.)',
    },
    (0, 'CharacterProfiles_localization', 95): {
        'issue': 'multi-issue: spelling `Excema` not Dutch + semantic shift — Chafed ≠ eczema specifically',
        'canon': 'Dutch spelling + §13 mistranslation',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('Excema Ezel', 'Ontvelde Ezel'),
        'note': '''EN `Chafed Ass` = irritated/sore-from-rubbing. NL `Excema` is misspelling of `Eczeem` (eczema-skin-condition), and semantically wrong (chafed ≠ eczema). Options:
   - `Ontvelde Ezel` (default — "skinned/sore", closest to chafed)
   - `Geïrriteerde Ezel` (broader — "irritated")
   - `Schuurde Ezel` (literal — "rubbed/chafed")
   - `Eczeem Ezel` (just fix the spelling, keep semantic shift)
   **Tom call: which form?** Default: `Ontvelde Ezel`.''',
    },

    # E8 — 2 cells
    (8, 'E8_TheGods_localization', 7): {
        'issue': 'compound spacing — `Ezel Zielen` (two words) should be `Ezel-Zielen` (hyphenated per canon §14.2.1)',
        'canon': '§14.2.1',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Ezel Zielen', 'Ezel-Zielen'),
    },
    (8, 'E8_TheGods_localization', 24): {
        'issue': 'multi-issue: adj-agreement `goddelijk last` → `goddelijke last` (de-word -e) + ungrammatical `der dragen` → `te dragen`',
        'canon': 'Dutch grammar',
        'confidence': 'mechanical',
        'transform': lambda nl: (
            nl.replace('onze goddelijk last der dragen', 'onze goddelijke last is het dragen')
        ),
        'note': 'EN: `As our godly burden is to carry the Universe...`. NL drops `is het` (copula + nominalization). Proposed: `onze goddelijke last is het dragen` restores both grammar and EN semantics. Alternates:\n   - `onze goddelijke taak om te dragen` (using `taak` for `burden`)\n   - `onze goddelijke plicht is het dragen` (`plicht` = duty)\n   - `het onze goddelijke last is om te dragen` (re-order)\n   Default keeps `last` as Tom\'s presumed translation choice.',
    },

    # E9 — 1 cell
    (9, 'E9_BadCave_localization', 40): {
        'issue': 'game-name `STENEN-SPEL` non-canonical — should be `KEIEN-SPEL`',
        'canon': '§8 game-system terms',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('STENEN-SPEL', 'KEIEN-SPEL'),
        'note': 'Final occurrence of the cross-corpus Stenen-spel pattern (already fixed in E3_Mine1F + E6_BadCave + E10_Government). Closes §8 game-name canonicalization across all 11 workbooks.',
    },

    # =========================================================================
    # AUDIT RESIDUALS (post-batch regex finds, NOT in deep-eyeball)
    # =========================================================================
    (2, 'E2_World_A1_localization', 25): {
        'issue': '§5.4 ge/gij imperative — bare-stem `Stop` should be stem+t `Stopt` (next clause uses `zijt GIJ` confirming ge/gij register)',
        'canon': '§5.4',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('Stop. Sinds wanneer', 'Stopt. Sinds wanneer'),
        'note': 'Hard Ass speaker (ge/gij). Caught by regex audit post-E2-push — NEW finding, not in deep-eyeball.',
    },
    (5, 'E5_ZooMain_localization', 208): {
        'issue': '§9.1 missing apostrophe at start: `t Beste` → `\'t Beste`',
        'canon': '§9.1',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('t Beste voor hem', "'t Beste voor hem"),
        'note': 'Smart Ass speaker. Caught by regex audit post-E5-push — NEW finding, not in deep-eyeball.',
    },
    (6, 'E6_Nightmare_localization', 63): {
        'issue': '§10.7 Thirsty Flemish diminutive — `slokje` (std-Dutch) should be `slokske` (Flemish)',
        'canon': '§10.7',
        'confidence': 'mechanical',
        'transform': lambda nl: nl.replace('een slokje', 'een slokske'),
        'note': 'Thirsty Ass in Hard\'s nightmare. Caught by regex audit post-E6-push — NEW finding, not in deep-eyeball.',
    },
    (6, 'E6_Nightmare_localization', 70): {
        'issue': '§10.7 `slokkie` → `slokske` + §9.1 `t Is` → `\'t Is` (two fixes in one cell)',
        'canon': '§10.7 + §9.1',
        'confidence': 'verify',
        'transform': lambda nl: (
            nl.replace('t Is altijd', "'t Is altijd")
              .replace('een slokkie water', 'een slokske water')
        ),
        'note': 'Thirsty Ass in Hard\'s nightmare. Same EN as E6_World J197 (Tom-overridden to truncated form without `share some good \'ol water`). This Nightmare version is full-length with both EN sub-clauses. **Tom call: keep full-length here (apply both §10.7/§9.1 fixes — default) or truncate to match World J197?** Default: keep full-length, fix the two flagged rules.',
    },
    (6, 'E6_Nightmare_localization', 71): {
        'issue': '§10.7 `slokkie` → `slokske` + §7.1 `ezel` cap-mid-sentence verify',
        'canon': '§10.7 + §7.1',
        'confidence': 'verify',
        'transform': lambda nl: nl.replace('een slokkie', 'een slokske'),
        'note': 'Thirsty Ass. `een ezel om z\'n oor te kauwen` — used colloquially as "someone (=a guy) to gripe at", not the species term. §7.1 caps Ezel when referring to the species/proper noun. **Tom call: cap `Ezel` (species-style) or keep `ezel` lc (colloquial-generic)?** Default proposed: fix slokkie only, keep `ezel` lc.',
    },
}


# Tabs that need column-A-parsed speakers (E5-E10) vs column-B (E0-E4)
EPISODE_OF_TAB = {
    'CharacterProfiles_localization': 0,
    'E2_World_A1_localization': 2,
    'E5_ZooMain_localization': 5,
    'E6_Nightmare_localization': 6,
    'E7_Chilling_localization': 7,
    'E7_Holding1_localization': 7,
    'E7_MeatProcessing_localization': 7,
    'E7_Skinning_localization': 7,
    'E8_TheGods_localization': 8,
    'E9_BadCave_localization': 9,
}


def md_inline(s):
    if s is None or s == '': return '∅'
    return str(s).replace('`', '\\`').replace('|', '\\|').replace('\n', ' ⏎ ')


def main():
    print(f'Cells in batch: {len(FIXES)}')

    client = throttle.get_client()

    # Group by episode for ordered emission
    by_ep = {}
    for (ep, sheet, row), fix in FIXES.items():
        by_ep.setdefault(ep, {}).setdefault(sheet, []).append((row, fix))

    L = ['# FINAL batch — combined deep-eyeball + audit residuals']
    L.append('')
    L.append(f'_Read at: {time.strftime("%Y-%m-%d %H:%M:%S %Z")} (live remote, throttled — 7 spreadsheets)_')
    L.append(f'_Cells in batch: {len(FIXES)}_')
    L.append('')
    L.append('**Scope:**')
    L.append('- 10 deep-eyeball DRIFT cells closing the queue (E7×5, E0×2, E8×2, E9×1)')
    L.append('- 5 audit-residual cells (post-batch regex finds NOT in deep-eyeball): E2 J25 §5.4, E5 J208 §9.1, E6_Nightmare J63/J70/J71 §10.7+§9.1+§7.1')
    L.append('')
    L.append('**Excluded — verify-only / known-skip (NOT in this batch, mentioned for completeness):**')
    L.append('- Schoon Beest §4.4 PUSHED-BEFORE × 3 (E1 J29, E2 J46, E4 J62) — canonical, no action')
    L.append('- Sturdy motto §12.2 fragments × 7 (E6 J142 + E9 J18/J19/J20/J21/J43/J68) — speaker-fragmented intentional reveals, all verify')
    L.append('- E3 §9.6 diary contracted × 2 (E3_100 J3 + E3_300 J7) — false-positive (rule applies to WRITE.Dialog journals, those are SAY.Dialog)')
    L.append('')
    L.append('**Workflow note:** Combined propose doc. Apply/push/audit/commit cycles will be done per-episode afterward (E7/E0/E8/E9 separate; residuals merge into their original-episode push-log sections).')
    L.append('')

    rendered = 0
    for ep in sorted(by_ep.keys()):
        sheet_id = SPREADSHEETS[ep]
        print(f'\n=== E{ep} ===')
        sheet = throttle.throttled_call(client.open_by_key, sheet_id)
        all_tabs = [ws.title for ws in sheet.worksheets()]

        L.append('---')
        L.append('')
        L.append(f'# E{ep}')
        L.append('')
        L.append(f'_Spreadsheet: `{sheet.title}` (id `{sheet_id}`)_')
        L.append('')

        for tab_name in sorted(by_ep[ep].keys()):
            actual = tab_name if tab_name in all_tabs else next(
                (t for t in all_tabs if t == tab_name or t.startswith(tab_name) or tab_name.startswith(t)), None)
            if actual is None:
                print(f'  ⚠ tab not found: {tab_name}')
                L.append(f'## {tab_name} — ⚠ TAB NOT FOUND')
                L.append('')
                continue
            ws = sheet.worksheet(actual)
            cells = sorted(by_ep[ep][tab_name], key=lambda c: c[0])
            ranges = [f'A{r}:J{r}' for r, _ in cells]
            print(f'  {actual}: {len(cells)} rows…')
            batch = throttle.throttled_call(ws.batch_get, ranges)

            L.append(f'## {actual}')
            L.append('')

            for (r, fix), range_data in zip(cells, batch):
                if range_data and range_data[0]:
                    row_vals = list(range_data[0])
                    while len(row_vals) < 10: row_vals.append('')
                    key, desc, en, nl = row_vals[0], row_vals[1], row_vals[2], row_vals[9]
                else:
                    key = desc = en = nl = ''

                L.append(f'### J{r}')
                L.append('')
                conf = '`mechanical`' if fix['confidence'] == 'mechanical' else '`[VERIFY]`'
                L.append(f'- **Drift:** {md_inline(fix["issue"])} {conf}')
                L.append(f'- **Canon:** `{md_inline(fix["canon"])}`')
                L.append(f'- **Key (col A):**  `{md_inline(key)}`')
                L.append(f'- **Desc (col B):** `{md_inline(desc)}`')
                L.append(f'- **EN (col C):**   `{md_inline(en)}`')
                L.append(f'- **Current NL (col J, live remote):**')
                L.append(f'    `{md_inline(nl)}`')
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
    L.append('- `all` — apply 10 mechanical + decisions on 5 verifies')
    L.append('- `mechanical only` — apply 10 mechanical, defer 5 verify')
    L.append('- per-cell — quote `E<N> J<row>` to override or skip')
    L.append('')
    L.append('## Decisions needed (Tom)')
    L.append('')
    L.append('1. **E7 MeatProcessing J9/J11 pair** — unify same-EN cells on `toont` (J9 current) or `laat zien` (J11 current)?')
    L.append('2. **E0 CharacterProfiles J95** Chafed Ass — `Ontvelde Ezel` (default) / `Geïrriteerde Ezel` / `Schuurde Ezel` / `Eczeem Ezel`?')
    L.append('3. **E8 TheGods J24** burden phrasing — `onze goddelijke last is het dragen` (default — restore copula+nominalization) / `onze goddelijke taak om te dragen` / other?')
    L.append('4. **E6 Nightmare J70** dream/bar speech — keep full-length (apply §10.7+§9.1 fixes only — default) or truncate to match Tom\'s World J197 override?')
    L.append('5. **E6 Nightmare J71** — cap `Ezel` (species-style) or keep `ezel` lc (colloquial-generic for "a guy to gripe at")?')

    OUT.write_text('\n'.join(L))
    print(f'\nWrote {OUT.relative_to(REPO)} — {rendered} cells.')


if __name__ == '__main__':
    main()
