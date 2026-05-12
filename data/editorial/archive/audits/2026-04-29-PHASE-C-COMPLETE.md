# 🐴 PHASE-C COMPLETE — 2026-04-29

The full editorial pass for *Asses & Masses / Ezels & Massa's* Dutch translation has reached a milestone state. This file marks the close of the Phase-C arc.

---

## What was achieved

### Character voice profiles locked: **28**

**14 main donkeys** — every primary character has machine-readable voice rules:

| Character | NL canonical | Direction | Cells touched |
|---|---|---|---|
| Trusty Ass | Trouwe Ezel / Trouwe | je/jij ABN | 6 |
| Slow Ass | Slome Ezel / Slome | je/jij ABN + stutter rule | 62 |
| Big Ass | Mega Ezel / Mega | ge/gij + paradigm | 44 |
| Smart Ass | Slimme Ezel / Slimme | je/jij ABN strict | 28 |
| Sturdy Ass | Stevige Ezel / Stevige | je/jij ABN (retconned) | 102 |
| Kick Ass | Stamp Ezel / Stamp | ge/gij + 'k kept | 42 |
| Sad Ass | Triestige Ezel / Triestige | je/jij + nie kept | 9 |
| Hard Ass | Bikkeharde Ezel / Bikkeharde | ge/gij + Antwerps | 18 |
| Nice Ass | Lieve Ezel / Lieve | je/jij + foal exception | 16 |
| Thirsty Ass | Beschonken Ezel / Zatlap | ge/gij + plat Vlaams + gulle | 18 |
| Bad Ass | Stoere Ezel / Stoere | ge/gij + jullie kept | 8 |
| Old Ass | Oude Ezel / Oude | ge/gij sage formal | 6 |
| Sick Ass | Snot Ezel / Snotje | KUCH standardize | 31 |
| Lazy Ass | Luie Ezel / Luie | je/jij ABN (retconned) | 23 |

**Foal `{$NewName}`** — mixed paradigm (formal with adults, casual with peers); 0 cell edits, voice profile codified.

**13 non-donkey characters** — Cole-Machine, Ringmaster Rico, Zookeeper Rose, Golden Ass, Mme. Derriere, Hee, Haw, Butte (Mr Butte), Child Joey, Miner Jenny, Radio Host Marcos, Melvin, Grandma Kulan.

---

### Cells corrected: **~600**

- 14 per-character corrections JSONs in `data/editorial/`
- 4 cross-character sweeps: `trouwe-zak-sweep`, `oude-zak-sweep`, `triestigaard-sweep`, `thirsty-sweep`
- Project-wide consistency: `project-consistency-2026-04-28.json` (40 cells: Tractor-Machine, Klotegem, apostrophes, ellipsis)
- Sanity-fix sweep: `sanity-fixes-2026-04-28.json` (9 cells: branching dialogue, transcend/change, pluralize, censor, slang refresh, bast→best)
- E0 Google Sheets sync: `e0-sync-2026-04-29.json` (93 cells: 84 newly-translated survey + 9 refined)
- Non-donkey batch: `non-donkey-batch-2026-04-29.json` (3 cells: Rose u→je, Golden Ge→Gij, Marcos typo fix)

**504 cells in the live xlsx differ from `excels/Originals/`** — that's the full editorial diff.

---

### Project-wide patterns locked

**Punctuation:**
- Curly U+2019 apostrophe → straight `'` (project-wide)
- Unicode `…` (U+2026) → three dots `...` (project-wide)

**Naming canonicals:**
- `Tractor-Machine` (with c, hyphenated) — all `*-Machine` compounds hyphenated (Cole-Machine, Piet-Machine pattern)
- `Klotegem` = Bumpkin Village (was wrongly `Muilegem` in places)
- `Muilegem` = Fannyside
- `Mechalen` = Mecha City
- `Poepegaatje` = Bottom's Up

**Cross-character deprecations applied:**
- `Trouwe Zak` → `Trouwe Ezel` (formal) / `Trouwe` (intimate)
- `Oude Zak` → `Oude Ezel` (formal) / `Oude` (intimate)
- `Triestigaard` → keep as Sad's nickname (deprecated as foreign characters' usage of the term where applicable)
- `Dorstlap` → `Beschonken Ezel` (canonical) + `Zatlap` (informal)
- `Stoere` → `Stevige Ezel` when referring to Sturdy (Stoere is Bad's name — collision fix)

**Profanity register:**
- `godverdomme` is the standard for most heavy-Flemish characters
- `godverdoemme` is **Thirsty-only** (slangier variant)
- `verdorie / Godsamme / Potverdikkie` for Smart Ass
- `verdikke / potvolkoffie` for Nice Ass

**Plural pronoun:**
- `jullie` is the default for ABN+formal characters
- `gulle` is **Thirsty-only** (heavy plat Vlaams plural)

**Contraction `'n`:**
- Project-wide rule update 2026-04-28: `'n` (e.g. `zo'n`) is no longer flagged. Free everywhere.

**Negation `nie`:**
- Kept for: Sad, Nice, Thirsty, Bad, Lazy (originally), Foal context — character signature for emotional/colloquial moments
- Strict `niet` for: Smart, Hard, Cole-Machine, all non-donkey ABN cast, retconned Lazy

---

### Audit confirmations

- ✅ **Engine tag integrity** — 0 mismatches across 4322 dialog rows
- ✅ **Per-sheet integrity audit** — branching dialogue gaps caught & fixed
- ✅ **Capitalization** — game-world proper nouns (Mensen, Kameraad, Vuur, Boerderij, Mijn) verified context-appropriate
- ✅ **Bumpkin/Tractor canonicals** — swept project-wide
- ✅ **Sturdy retcon verified** — original ge/gij flipped to je/jij ABN per Tom's directive

---

## Runtime architecture

**Translation route**: `/api/ai-suggest` reads `data/json/codex_translations.json`. For every bulk-translate request, it renders the full Phase-C voice profile (pronouns allowed/forbidden, negation rule, article rule, contractions allowed/forbidden, dialectal markers, register exceptions, verbal tics, dynamics, bio) into the Claude prompt — plus 15 corpus exemplars + surrounding lines + cross-character name mappings.

The codex is **operationally live**. Every locked rule flows into every AI bulk translation request.

---

## Files & organization

```
excels/                                      ← 11 corrected xlsx (the live source of truth)
  └── Originals/                             ← pristine pre-edit copies
data/json/
  ├── codex_verified.json                    ← editorial canonical codex
  ├── codex_translations.json                ← runtime mirror (read by /api/ai-suggest)
  └── *Proxy.json (×11)                      ← auto-generated JSON mirrors
data/editorial/
  ├── <char>-corrections.json (×14 donkeys)
  ├── cole-machine-corrections.json
  ├── non-donkey-batch-2026-04-29.json
  ├── *-sweep.json (×4)
  ├── project-consistency-*.json
  ├── sanity-fixes-*.json
  ├── e0-sync-*.json
  ├── _full-corpus-*.json (snapshots)
  ├── _PROJECT_MISSION.md
  ├── _RESUME-*.md
  ├── _session-*.md
  └── _audit-E2Proxy-dump-*.md
data/analysis/                               ← stale post-Phase-C; regenerate when needed
scripts/editorial/apply-corrections.py       ← workhorse — every editorial pass uses this
scripts/convert/                             ← Google Sheets ↔ xlsx ↔ JSON converters
src/app/api/ai-suggest/route.ts              ← runtime translation route (reads codex)
src/hooks/useBulkTranslate.ts                ← UI bulk-translate orchestrator
```

---

## Outstanding (deferred)

Not strictly needed for this milestone, but tracked for future:

- **Minor "Ass" donkeys** (Helpful, Proper, Wedgie, DJ Dope, Greedy, Hasty, Bleak, Happy, Resentful, Skinny, Edgy, Tight) — not yet codified
- **~280 numbered NPCs** — speaker-tag-only, no voice profile yet
- **Master Google Sheets push** — local xlsx is corrected but Google Sheets master is not yet updated. Spec drafted (Service Account + Sheets API surgical write of column J), implementation pending Tom's GO
- **Codex bloat pruning** — verbose per-character voice profiles average ~1500 chars in prompt; could compress with separate `aiSuggestRender` short field
- **Profanity / register matrix doc** — useful for future translators, deferred

---

## Numbers

- **28** characters codified
- **101** dialog sheets across **11** episodes
- **4322** total dialog rows
- **~600** cells edited
- **504** cells diffing from Originals
- **39** corrections JSON files in `data/editorial/`
- **~50** session commits on `am-analysis` branch

---

## 🥕🐴🥕

*Phase-C is closed. The donkeys can speak.*

— Logged 2026-04-29
