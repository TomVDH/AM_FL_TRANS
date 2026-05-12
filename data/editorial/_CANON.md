# _CANON — am-fl-trans editorial source of truth

**Last updated:** 2026-05-11
**Owner:** Tom (final authority on all decisions)
**Codex pointer:** `data/json/codex_verified.json` (v3.4) — per-character rules

> **Read this file in full at the start of every chat. Do not act before reading.**
> **When a decision is made mid-chat, add it here in the same turn. No chat-only locks.**
> **Walk a sheet against this file top-to-bottom; do not freelance patterns.**

---

## §0 — Mission

Flemish Dutch editorial pass on `asses.masses` localisation. 11 xlsx files (E0–E10) + 1 CSV (E11). Column J is the NL target. Live remote Google Sheets are source-of-truth; local xlsx mirror.

Per-character voice (pronouns, contractions, dialectal markers, negation, articles) is **codex-driven by default** — `codex_verified.json` is machine-readable and authoritative.

**EXCEPTION:** When `_CANON.md` explicitly **overrides** a codex field (marked 🔒 CANON OVERRIDES CODEX in the relevant section), the canon wins and the codex needs syncing. Canon is supreme.

---

## §1 — Per-character voice (CODEX-DRIVEN)

**Authority:** `data/json/codex_verified.json` (v3.4). 28 characters with rule fields:

| Field | What it controls | Status |
|---|---|---|
| `pronounsAllowed` / `pronounsForbidden` | je/jij vs ge/gij vs u/uw register | ✅ trusted |
| `contractionsAllowed` / `contractionsForbidden` | `'k`, `'t`, `'n`, etc. | ✅ trusted |
| `dialectalMarkersAllowed` / `dialectalMarkersForbidden` | `godverdomme`, `gulle`, etc. **(`nie` entries OBSOLETE — see §2)** | ⚠️ partial drift |
| `articleRule` | `een` vs `ne/nen` | ✅ trusted |
| `negationRule` | **OBSOLETE — canon §2 overrides corpus-wide. Codex needs v3.5 sync.** | ⛔ overridden |
| `registerExceptions` | u/uw to seniors / Gods / Foal-dismissive | 🔍 **NEEDS SCRUTINY — esp E9/E10 (Tom flag)** |
| `inboundAddressRules` | how others address this character | 🔍 sparse — only Trusty + Foal populated |
| `verbalTics` | `*boe-hoe-hoe*`, `, Kameraad`, `Allez`, etc. | 🔍 **NEEDS SCRUTINY (Tom flag) — verify against current corpus** |

### Codex sync deltas pending (v3.4 → v3.5)
Locked by canon, not yet reflected in codex JSON:

#### Field fixes
1. Bad / Nice / Sad / Thirsty — `negationRule: niet only`; remove `nie` from `dialectalMarkersAllowed`
2. Sick Ass — `dutchShort: Snot` (was `Snotje`); add `inboundAddressRules`: "Kick Ass uses Snotje for Sick Ass"
3. Hard Ass — `dutch: Bikkelharde Ezel` / `dutchShort: Bikkelharde` (if not already synced)
4. **Miner Jenny — flip to ge/gij** (`pronounsAllowed: ['ge','gij','u','uw','jullie']`; `pronounsForbidden: ['je','jij','jou','jouw']`; `register: tussentaal`)

#### `verbalTics` drift fixes (Q9 — 2026-05-11)
5. **Cole-Machine** — `Mechalen` → `Technopolis`
6. **Thirsty Ass** — `Poepegaatje (Bottom's Up)` → `De Zatten Ezel`
7. **Miner Jenny** — `Stuk Stront Dat Je Bent` → `Stuk Stront Dat Ge Zijt`

#### New codex entries (NOT YET in codex)
8. **DJ Dope Ass** — `pronounsAllowed: ['je','jij','jou','jouw','jullie']`; `register: tussentaal`; DJ flavor
9. **Helpful Ass** (E10 split) — je/jij — stub
10. **Skinny Ass** (E10 split) — je/jij — stub
11. **Tragic Ass** (E10 split) — je/jij — stub
12. **Gaunt Ass** (E10 split) — je/jij — stub
13. **Edgy Ass** (E10 split) — **ge/gij** — stub
14. **Proper Ass** (E10 split) — je/jij with formal-address `registerExceptions` (parallel to Sad/Nice/Slow)
15. **Resentful Ass** (E10 split) — je/jij with formal-address `registerExceptions`
16. **Bleak Ass** (E10 split) — je/jij with formal-address `registerExceptions`

Deep profiles for E10 split donkeys deferred to E10 episode chat (Q8/Q9 option C).

### Scrutiny tasks (Q8 + Q9)
- **`registerExceptions` audit (esp E9/E10):** walk every cell in E9 + E10 where a ge/gij character uses u/uw — confirm the exception (senior / God / Foal-dismissive) actually applies. Possible drift in Hard Ass / Bad Ass / Thirsty / Kick toward generic u/uw in non-exception contexts.
- **`verbalTics` audit:** walk codex `verbalTics` field per character — verify each tic still appears in current corpus; flag obsolete tics (e.g., retconned forms) and missing canonical ones (e.g., Old Ass `EZELS EERST`).

**Workflow:** when scanning a cell, resolve speaker → check codex fields (respecting overrides from this canon) → flag violations.

---

## §2 — Negation: nie vs niet  🔒 CANON OVERRIDES CODEX

**HARD LOCK — 2026-05-11 Tom override:** **Everyone uses `niet`. No exceptions. No `nie`. No `nie'` apostrophe variant. Corpus-wide.**

This canon supersedes the codex `negationRule` and `dialectalMarkersAllowed` fields for any character that previously permitted `nie`.

### Rule
- Every `nie` → `niet`
- Every `nie'` (apostrophe) → `niet`
- Applies to **all 28 codex characters** + any unlisted speakers
- No voice-signature exemption
- No Thirsty Ass elision exemption

### Codex sync needed (out-of-date fields)
The following codex fields are now WRONG per this lock and must be updated:

| Field | Characters affected | Current (wrong) | New |
|---|---|---|---|
| `negationRule` | Bad, Nice, Sad, Thirsty | `nie + niet both allowed` | `niet only — never nie` |
| `dialectalMarkersAllowed` | Bad, Nice, Sad, Thirsty | contains `"nie"` | remove `"nie"` from list |

Codex bump v3.4 → v3.5 needed.

### Decision history
- **Phase-C (codex):** per-character `negationRule` (Bad/Nice/Sad/Thirsty allowed mixed).
- **2026-05-11 (a) RESCISSION:** D9 universal nie→niet rescinded because codex per-char rule existed.
- **2026-05-11 (b) OVERRIDE:** Tom locks universal `niet` corpus-wide — canon overrides codex; codex needs sync.

### Status
- ✅ E1 FU#2 (Thirsty J25 `nie' volscheppen → niet`) — push CLEARED per this lock.
- ✅ No backward audit needed — pushed `nie → niet` cells were correct under this lock.

### Notes
- *(empty — accrue here)*

---

## §3 — Place names (CORPUS-WIDE LOCKS)

### 3.1 Muilenbeek (the region) — ✅ TOM LOCKED 2026-05-11
- **Canonical:** `Muilenbeek` (with extra `n`). Supersedes legacy `Muilegem` AND Patrick's earlier `Muilebeek`.
- **Tom 2026-05-11:** Muilenbeek wins. Patrick will redo sprites + episode strings to match.
- **Status:** ✅ Dialogue corpus already on Muilenbeek. ⏳ Sprite/episode-string pipeline pending Patrick's redo.

### 3.2 Klotegem (the village) — ✅ PATRICK SWEEP COMPLETE 2026-05-11
- **Canonical:** `Klotegem`. EN "Bumpkin Village" / "Bumpkin".
- Distinct from the region (Muilenbeek/Muilebeek conflict — see §3.1).
- **Status:** ✅ Patrick: "Klotegem fix in Circus dialogue" + "Created Klotegem village sign" + "Klotegem and Muilebeek updated in all episode strings".

### 3.3 Klotegemmers (demonym) — ✅ TOM LOCKED 2026-05-11
- **Canonical:** `Klotegemmers` for people from Bumpkin / Klotegem.
- Not `Klotegemnaars`. Not `Muilenbekers` (demonym follows the village, not region).
- **Status:** ✅ Locked. 1 cell already implemented (E5 J244).

### 3.4 Technopolis (the human metropolis) — ✅ PATRICK SWEEP COMPLETE 2026-05-11
- **Canonical:** `Technopolis`. EN "Mecha" / "Mechalen" → `Technopolis`. ALL CAPS variant: `MECHA → TECHNOPOLIS`.
- **Status:** ✅ Patrick: "Mechalen replaced by Technopolis in all episodes strings" + "Standardized Technopolis in sprites/backgrounds".

#### 3.4.1 Imechelda Algemeen Ziekenhuis — ✅ TOM LOCKED 2026-05-12
- **Exception to §3.4:** the hospital named "Mecha General Hospital" in EN → **`Imechelda Algemeen Ziekenhuis`** (not `Technopolis Algemeen Ziekenhuis`). The hospital retains a separate proper-noun naming style (Mecha + Mechelen wordplay).
- **Status:** ✅ E3_100 J16 implemented 2026-05-12. Watch for any other "Mecha X Hospital" references corpus-wide.

### 3.5 De Zatten Ezel (the bar) — ✅ TOM LOCKED 2026-05-11
- **Canonical:** **`De Zatten Ezel`**. EN "The Drunk Ass" / "Poepegaatje".
- **No `Café` prefix, no `Cafe` suffix, no preceding article** (`het`/`een` dropped).
- **Supersedes:** Patrick's `De Zatten Ezel Cafe` (suffix form). Patrick to revert sprites/signs to bare `De Zatten Ezel`.
- **Status:** ✅ Locked. Batch e1 already applied (5 cells). ⏳ Patrick sprite revert pending.

### 3.7 Vijver van Hiehiehie (Pond)
- **Canonical:** `Vijver van Hiehiehie`. Patrick lock (2026-05-11).
- **Status:** ✅ Patrick-implemented.

### 3.8 Stadscircus + Derentuin van Technopolis (4-liner shortform)
- **Canonical line:** `Als je een leuke plek zoekt voor je familie, ga naar de Derentuin van Technopolis! Of bezoek de nieuwe show in het Stadscircus!`
- **Status:** ✅ Patrick-implemented (shortened 4-liner).

### 3.6 Hoeve / Stal (farm/stable) — ✅ TOM CONFIRMED 2026-05-11
- **Canonical:**
  - `Boerderij` → `de Hoeve` (the Farm — building/grounds).
  - `Stal` only when literally the stable building.
- **Heritage Stable:** see §13.1 (Erfgoedstal, not Erfgoedshoeve).
- **Status:** ⏳ ~40 drift cells (E1×2, E2×16, E3×1, E6×5, E8×1, E10×3 + Welcome Sign duplicates).

### Notes
- *(empty — accrue here)*

---

## §4 — Character monikers

### 4.1 Authoritative form — ✅ TOM CONFIRMED 2026-05-11
- **Source:** codex `dutch` (long form) and `dutchShort` (short form) per character.
- **Rule:** Use only codex-locked forms; don't invent third variants.

### 4.2 Locked long/short forms

| Character | Long (`dutch`) | Short (`dutchShort`) | Notes |
|---|---|---|---|
| Hard Ass | **Bikkelharde Ezel** | **Bikkelharde** | |
| Sick Ass | Snot Ezel | **Snot** | `Snotje` (diminutive) is **Kick Ass's nickname for Sick Ass only** — see 4.2.1 |
| Kick Ass | Stamp Ezel | Stamp | |
| Slow Ass | (codex) | **Slome** | |
| Trusty Ass | Trouwe Ezel | Trouwe | |
| Lazy Ass | Luie Ezel | Luie | |
| Old Ass | Oude Ezel | Oude | |
| Peek Ass | **Constaterende Ezel** | Constaterende | |
| Blunt Ass | **Groffe Ezel** | Groffe | |
| Bad Ass | Stoere Ezel | Stoere | |

### 4.2.2 EZELZEULER twin announcers — ✅ PATRICK 2026-05-11
- **Canonical:** `EZELZEULER ZENO` and `EZELZEULER ZITA`.
- **Status:** ✅ Patrick-implemented (typo fixes).

### 4.2.3 Constaterende Ezel (Peek Ass) — ✅ PATRICK + TOM 2026-05-11
- **Canonical (long):** `Constaterende Ezel`. (Codex synced.)
- **Status:** ✅ Patrick implemented in E0 Character Profiles + corpus.

### 4.2.1 Snotje — Kick Ass nickname (EXCEPTION) — ✅ TOM 2026-05-11
- `Snotje` (diminutive of Snot) is used **ONLY** when Kick Ass refers to Sick Ass.
- Everyone else uses `Snot` (short) or `Snot Ezel` (long) for Sick Ass.
- Parallel to §4.4 (Schoon Beest = Thirsty's nickname for Nice only).
- **Codex sync:** Sick Ass `dutchShort` should be `Snot`, not `Snotje`. Add inbound-address note: "Kick Ass uses Snotje for Sick Ass." Codex v3.4 → v3.5.

### 4.3 Retired old monikers (catch and replace) — ✅ TOM CONFIRMED 2026-05-11
- `Schoon Beest` → **`Lieve Ezel`** when used as a general moniker (BUT see §4.4)
- `Felle Gast` → **`Bikkelharde`**
- `Betweter` → **`Slimme`** (`Betweterke` → `Slimmeke` diminutive)
- `Bikkeharde` (missing L) → **`Bikkelharde`**
- `Snotezel` (one word) → `Snot Ezel` (long) or `Snotje` (short)
- `Stampgast` → `Stamp`
- `Sloom` → `Slome`

### 4.4 `Schoon Beest` — EXCEPTION — ✅ TOM CONFIRMED 2026-05-11
- **Preserved when:** Thirsty Ass uses it as a nickname for Nice Ass (Thirsty's signature term of affection for Nice).
- **Flip to Lieve Ezel:** all other uses.
- **Status:** ✅ E1 J29 and E2 J46 restored. ⏳ E4 J62 pending check.

### Notes
- *(empty — accrue here)*

---

## §5 — Pronoun register edge cases

### 5.0 Register membership (from codex_verified.json v3.4)

**ge/gij register (Flemish) — 11 characters (was 10; Miner Jenny added 2026-05-11):**
| Character | Notes |
|---|---|
| Bad Ass | |
| Big Ass | |
| Cole-Machine | |
| Golden Ass | + `zijt` |
| Hard Ass | |
| **Haw** | one of the Gods |
| **Hee** | one of the Gods; + `zijt` |
| Kick Ass | |
| Old Ass | |
| Thirsty Ass | + `gulle` |
| **Miner Jenny** | **moved from je/jij 2026-05-11; codex v3.5 pending** |

**je/jij register (ABN Standard Dutch) — 15 characters (was 16; Miner Jenny moved):**
| Character | Notes |
|---|---|
| Butte | |
| Child Joey | |
| Grandma Kulan | also `u`/`uw` for formal/elder context |
| Lazy Ass | |
| Melvin | |
| ~~Miner Jenny~~ | **MOVED TO ge/gij** — 2026-05-11 codex flip (see above)|
| Mme. Derriere | |
| Nice Ass | |
| Radio Host Marcos | |
| Ringmaster Rico | |
| Sad Ass | |
| Slow Ass | |
| Smart Ass | |
| Sturdy Ass | retconned from ge/gij 2026-04-28 (commit `7fb687d`) |
| Trusty Ass | |
| Zookeeper Rose | |

**Mixed (both allowed) — 1:**
| Character | Notes |
|---|---|
| **Foal** (`{$NewName}`) | codex `pronounForm: mixed` |

**N/A (mute, no register applies) — 1:**
| Character | Notes |
|---|---|
| Sick Ass | mute except `Omdraaien.` at E6_Nightmare R48; uses `*KUCH*` SFX only |

**Not yet in codex — 1:**
| Character | Notes |
|---|---|
| DJ Dope Ass | speaks ge/gij in corpus (`hebde` etc.) — lock direction is Q4 open |

### 5.1–5.4 Edge cases

### 5.1 ge/gij characters using u/uw — NATIVE, NOT EXCEPTION
- **Clarification (2026-05-11):** ge/gij chars have `u`/`uw` in their `pronounsAllowed` set by default — `['ge', 'gij', 'u', 'uw', 'jullie']`. So `u/uw` from a ge/gij speaker is **native register, not exception**.
- The earlier "exception" framing was misleading. ge/gij chars freely use `u/uw` throughout their dialogue.
- **TRUE exceptions are codified in codex `registerExceptions` field** only for je/jij chars who shift formal (Sad/Nice/Slow/Grandma/Foal).
- A je/jij char using `u/uw` is the exception case — that's where context (senior / Gods / formal/reverent address) is required.

### 5.2 The Gods (THE GODS, Hee, Haw, Golden Ass)
- Speak with **capital `U`/`Uw`** (reverence form).
- Lowercase `u`/`uw` from these speakers → flip to capitals.
- **Status:** ⏳ 21 drift cells (E8×8, E9×4, E10×9).

### 5.3 Foal (`{$NewName}`)
- Codex: mixed-register (`pronounForm: mixed`).
- Both `ge/gij` and `je/jij` allowed; context-sensitive.
- Don't force-flip Foal — check codex `pronounsAllowed` and accept either.

### 5.4 Stop / Stopt imperative
- **je/jij imperative:** stem only — `Stop`, `Sla`, `Zeg`. (no `-t`)
- **ge/gij imperative:** stem + `-t` — `Stopt`, `Slaat`, `Zegt`.
- **Rule:** verify speaker register before flipping `Stop ↔ Stopt`.
- **Resolved:** E2_Confession J4 Nice Ass `Stopt → Stop` (Nice is je/jij). ⏳ Inverse cases (ge/gij chars using bare-stem imperative) need check — e.g., E3_Mine1F J75 Big/Thirsty `Zeg me nie` → `Zegt me niet` candidate.

### Notes
- *(empty — accrue here)*

---

## §6 — Term consistency (corpus-wide)

### 6.1 HUDO → Plee
- **Canonical:** `de Plee` (capital `De` at sentence start).
- Supersedes `de Hudo` / `Het Privaat` / `Sekreet`.
- **Status:** ⏳ E3_Mine1F J41 (1 cell remaining in E3). Others ✅ pushed in E1+E2.

### 6.2 Nonkel vs Oom
- **Default:** `Nonkel` for all speakers.
- **Exception:** `Oom` ONLY when spoken by **Smart Ass**.
- **Status:** ⏳ 11 drift cells (Foal using `Oom` where it should be `Nonkel`).

### 6.3 Vazal (game term) — ✅ PATRICK ASSET PASS COMPLETE 2026-05-11
- **Canonical:** `Vazal` / `Vazallen`. EN "Vassal".
- Asset pipeline: `AFGEVAARDIGDE` sticker → `VAZAL`.
- **Status:** ✅ Dialogue clean + Patrick: "Pass on Vazal vs. Afgevaardigde in sprites".

### 6.4 Machine Prophet
- **Canonical:** `Profetische Machine` (4 cells in corpus).
- Hyphenated compounds in §8.
- Note: Machine kept (not Machien) — see §8.1.

### 6.5 Hie/Haa casing
- **All-caps `HIE`/`HAA`:** Gods/ritual contexts.
- **Title-case `Hie`/`Haa`:** regular dialogue.
- **Status:** ✅ Clean.

### 6.6 Drunk word — Zatlap vs Beschonken
- **Default:** `Beschonken` (Patrick's choice; active on remote).
- Note: `Beschonken` is also Thirsty Ass codex `dutchShort` — different context.
- **Status:** ⏳ Verify current state.

### 6.7 Battle verbs (E2 BattleMiner / BattleButte cross-sheet)
- **Rule:** Same EN → same NL across battle sheets.
- **Examples needing reconciliation:** `koppertje` vs `kopstoot` for Headbutt; `maakt een move` Anglicism.
- **2026-05-11 specific fixes (E2_BattleMiner):**
  - **J11** add terminal `!`: `... DJOEF OP U BAKKES` → `... DJOEF OP U BAKKES!`
  - **J17** Anglicism fix: `Wat is je respons?` → `Wat is je reactie?` (`respons` → `reactie`; `je` kept — player UI prompt, Foal mixed-register)
  - **J6** Miner Jenny register fix: `je maar een dom beest bent` → `ge maar een dom beest zijt` (see §6.17)
- **Status:** ⏳ 4 cross-sheet inconsistencies + 3 specific fixes above.

### 6.17 Miner Jenny — ge/gij register lock — ✅ TOM 2026-05-11
- **CODEX OVERRIDE:** Miner Jenny is **ge/gij**, not je/jij as codex v3.4 currently states.
- **Codex v3.5 sync needed:**
  - `pronounsAllowed`: `['ge', 'gij', 'u', 'uw', 'jullie']`
  - `pronounsForbidden`: `['je', 'jij', 'jou', 'jouw']`
  - `register`: `tussentaal`
- **9 cells corpus-wide need register flip:**
  - E2_MinersHouse J3 (`jij` → `gij`), J5 (`je hulp` → `uw hulp`), J8 (`kan je...je domme` → `kunt ge...uw domme`), J9 (`JE 'T` → `GE 'T`)
  - E2_BattleMiner J6 (`je...bent` → `ge...zijt`)
  - E6_Nightmare J4 (`je ziet` → `ge ziet`), J5 (`Jij gaat` → `Gij gaat`), J28 (`JE BENT` → `GE ZIJT`), J40 (`JE ME` → `GE ME`)
- Already-correct ge/gij cells stay: E2_BattleMiner J8 (`Gij onnozel`), J12 (`ik maak u AF`).
- **Status:** ⏳ 9-cell sweep pending. Codex sync pending.

### 6.8 SCHUP (E2 BattleMiner) — ✅ TOM LOCKED 2026-05-11 (REVERSED)
- **Canonical word:** **`SCHUP`** (Flemish for shovel). EN "SHOVEL".
- **2026-05-11 REVERSAL:** Tom reverts the earlier SCHEP lock. SCHUP wins corpus-wide. The SCHOPPEN-confusion concern set aside — Flemish `schup` reads as shovel-noun.
- **E2_BattleMiner J13 (move name):** **`Mijnwerker Jenny gebruikt SCHUP.`**
- **E2_BattleMiner J14 (Jenny's taunt):** **`HIER SÉ, KLOOTZAKSKE!!`**
  - Drops naming the weapon — taunt is the Flemish presenter phrase "here ya go" + insult.
  - Supersedes earlier pushed form `EET DEZE SCHEP, KLOOTZAKSKE!!` and Patrick's `EET MIJN SCHEP OP, KLOOTZAKSKE!!`.
- **Status:** ⏳ Re-push needed:
  - J13 SCHEP → SCHUP
  - J14 taunt → `HIER SÉ, KLOOTZAKSKE!!`
  - Plus corpus-wide audit: any other `SCHEP` cells to flip back to `SCHUP`?

### 6.9 het Plan / afspraak — ✅ TOM LOCKED 2026-05-11
- **Rule:** EN-driven distinction. **Always check the EN.**
  - EN says **"Plan"** → NL `het Plan` (capital P)
  - EN says **"deal"** → NL `afspraak`
- Patrick's blanket "Plan always" override REJECTED — keep the nuance.
- **Status:** ⏳ 1 cell ready (E1_TheProtest J130 Smart Ass, EN=Plan).

### 6.10 Nummer vs acte (E5 Circus)
- **Canonical:** `Nummer` / `Nummers` (full form, **capitalized** mid-sentence — proper noun for game-system circus-act unit).
- **Decided:** 2026-05-10. Cap rendering confirmed 2026-05-12 (Tom — parallel to §7.2 Circusdirecteur cap-always lock).
- **Status:** ✅ 2 cells (E5_CircusMain J21 + J73) — 3 word instances applied 2026-05-12.

### 6.11 Jansen (E6) per-speaker — ✅ TOM LOCKED 2026-05-10 + 2026-05-11
- **E6_BattleHard J8** (Thirsty Ass): Patrick replaced `jansen` → `u` on remote 2026-05-12 (`voor u, héé`). Tom accepted; `gulle` canon proposal superseded by Patrick's live edit. ✅ Synced.
- **E6_BadCave J55** (Bad Ass): `Kleine`. ⏳ Sweep pending.
- **CRITICAL:** After these 2 fixes, the word `jansen` is **EXTINCT corpus-wide.** Do not re-introduce. If `jansen` ever reappears in NL output, flag immediately.
- **Decided:** 2026-05-10 (per-cell); 2026-05-11 (term extinction).

### 6.12 Nijg (E5) — replacement
- **Canonical:** `fel`.
- **Decided:** 2026-05-10 (Decision 3).
- **Status:** ✅ 2 cells (E5_CircusMain J167, J176) — applied 2026-05-12.

### 6.13 DJ welcome rephrase — ✅ TOM LOCKED 2026-05-11
- **E4_AstralPlaneMain J221 (DJ Dope Ass):**
  - **EN:** `Thanks for coming out tonight to my SET!!`
  - **Canonical NL:** **`MERCI VOOR NAAR MIJN SET TE KOMEN!!!`**
- Uses `Merci` (Flemish casual loanword) + `voor [te-infinitive]` construction (idiomatic Flemish).
- Drops literal Anglicism `voor buiten te komen`.
- All-caps preserved + triple-exclamation matches DJ energy (J220 `GOEDEAVOND MEDE-EZELS!!!!`).
- **Status:** ⏳ 1 cell ready to push.
- **Incidental resolution Q4:** DJ Dope Ass register confirmed je/jij + jullie per corpus (uses `je` J222, `jullie` J223). See §1 codex sync — DJ Dope Ass entry to add as je/jij.

### 6.14 Topstrateeg (term lock) — ✅ PATRICK 2026-05-11
- **Canonical:** `Topstrateeg`. All variants → `Topstrateeg`.
- **Status:** ✅ Patrick-implemented corpus-wide.

### 6.15 Kameraad Moeder (no hyphen) — ✅ PATRICK 2026-05-11
- **Canonical:** `Kameraad Moeder` — **no hyphen**.
- Was: `Kameraad-Moeder` (hyphenated).
- **Status:** ✅ Patrick removed all hyphens.

### 6.16 Job (the game-system term) — ✅ TOM LOCKED 2026-05-11
- **Canonical:** `Job` / `Jobs` (English loanword kept). **Capped** as game-systemic proper noun.
- **Replaces:** `Beroep` / `Beroepen` when the meaning is the donkey-Job game-system.
- **CONTEXT-SENSITIVE (option B):** Cap **only when referring to the donkey-Job game system** (pre-uprising work assigned by Humans). Generic post-uprising employment stays **lowercase `job`**.
- **Idiomatic exception:** `een beroep doen op` ("to appeal to") — different Dutch lexeme entirely, KEEP lowercase `beroep`. Not a Job-term collision.
- **Sweep scope (~22 cells):**
  - 2 `Beroepen` → `Jobs` (E3_Mine1F J49 + J136, both game-system context)
  - ~18 lowercase `job/jobs` → `Job/Jobs` when game-system context (E1 J94, E2_World_A1 J58, E2_BadAssRescue J5, E4_HerdSplits J32, E5_Highway J15, E5_CircusMain J25/J26/J106/J131/J132/J245, E5_ZooMain J120, E7_Opening J5, E10_Government J167 + J176, E0_Questions J43)
  - **Stay lowercase (post-uprising new-context):** E10_Government J169 (Old Ass new forestry job), E5_ZooMain J199 + J208 ("finding another job without Machines"), **E2_World_A1 J58 + E2_BadAssRescue J5** (Bad Ass "get your jobs back" — generic reclaim-work reading, not game-system; Tom 2026-05-11), **E4_HerdSplits J32** (Smart Ass `we get our JOBS BACK` — same generic reclaim-work pattern as Bad Ass cells above; Tom 2026-05-12), **E5_CircusMain J106 + J131** (Smart Ass `Finding another job with no Machines isn't going to be easy.` — identical wording to E5_ZooMain J199/J208 stay-lc exception; same speaker + same generic-reclaim theme; Tom 2026-05-12)
  - **Idiomatic `beroep doen op` (untouched):** E10_ProphetSpeech J29 + J39
- **Bundled fix at E10_Government J169 (Old Ass):**
  - **EN:** `So I got a job working in the forestry business.`
  - **Current NL:** `Dus 'k heb nen job gevonden in de bosbouw, weet ge.`
  - **Fix:** `Dus 'k heb een job gevonden in de bosbouw, weet ge.`
  - **Two changes:** (1) `nen` → `een` (codex `articleRule: "een only — never ne/nen"` for Old Ass — was already a codex violation); (2) `job` stays lowercase (post-uprising context).
- **Audit hook:** when scanning Old Ass / Big Ass / Trusty cells, codex `articleRule` should flag `ne/nen` violations automatically (Bad/Old/multiple chars have "een only").

### Notes
- *(empty — accrue here)*

---

## §7 — Capitalisation

### 7.1 Ezel — cap everywhere
- **Rule:** Capitalize `Ezel(s/innekes/tje/tjes/en/kes)` mid-sentence — proper noun for species/character.
- **Applies to:** character dialogue AND narrative/quiz/diary text.
- **Decided:** 2026-05-10 (cap everywhere lock).
- **Status:** ⏳ ~70 drift cells corpus-wide. E1 batches partially done.

### 7.2 Circusdirecteur — cap everywhere — ✅ TOM LOCKED 2026-05-12 (reversal)
- **Rule:** Capitalize `Circusdirecteur` mid-sentence — proper noun (game-system circus title, parallel to Ezel/Job).
- **Also applies:** `Wereldtournee` (game-system tour name) and bare `Tournee` (extends from the compound).
- **Earlier 2026-05-11 retcon** (lc mid-sentence; matches J58 model) **REVERSED 2026-05-12** by Tom — all 6 affected E5_CircusMain cells re-capped (J45/J58/J121/J168/J177/J221, plus Wereldtournee J45/J58 and Tournee J168/J177).

### 7.3 Game-systemic terms — ALL CAP — ✅ TOM LOCKED 2026-05-11 (option i)
- **Rule:** Game-systemic terms (races, factions, groups, mechanics, world-concepts) are **always capped** as proper nouns. Applies to dialogue + narrative + diary + UI text.
- **Locked term list:**

| Term | EN | Notes |
|---|---|---|
| **Kudde** | the Herd | Group identity of donkey collective |
| **Mijn / Mijnen** | the Mine / Mines | Locked place + mechanic |
| **Mensen** | the Humans | Race name |
| **Machines** | the Machines | Race name (Machine kept, not Machien per §8.1) |
| **Goden** | the Gods | Pantheon — also see §5.2 / §7.4 (Gods themselves use cap U/Uw) |
| **Vazallen** | the Vassals | Game-mechanic role |
| **Hemelvaart** | Ascension | Religious/game concept |
| **Heraanstelling** | Reassignment | Astral-Plane mechanic |
| **Job / Jobs** | Job / Jobs | Game-system Job per §6.16 (cap only in game-system context — option B exception holds) |
| **Beroep** | (game) Job | **REPLACED by Job** — see §6.16. Idiomatic `een beroep doen op` exempt. |
| **Spel** (e.g. Keien-Spel) | Game (proper title) | Title forms cap; common noun `spel` lowercase |
| **Stenen-Spel → Keien-Spel** | Rocks/Stone Game | Per §8.3 |
| **Stadscircus** | City Circus | Proper noun |
| **Stadsbank** | City Bank | Proper noun |
| **Topstrateeg** | Top Strategist | Per §6.14 |
| **Astrale Hiernamaals** | Astral Plane | Per §10.2 |
| **Hemelvaarts-zang-der-Ezel-zielen** | Song of Ascension | Per §14.2 |
| **EZELS EERST** | Ass Power | Per §14.1 (all-caps slogan) |

- **Already-locked elsewhere (cross-ref):** all place names (§3), character monikers (§4), Ezel as species/character (§7.1), Gods cap U/Uw (§7.4).

### 7.3.1 Edge case — common-noun vs game-term collision
Same word can be a game term OR a generic noun. Resolve by context:
- `de Mijn` (game term, "the donkey Mine" location) cap; `een mijn` (generic mine) lowercase.
- `de Mensen` (race name "the Humans") cap; `een hoop mensen` (generic "a lot of people") lowercase.
- `de Goden` (pantheon) cap; `de goden` (philosophical/generic) lowercase — but this collision is unlikely in this corpus.
- `Spel` (proper title, e.g. Keien-Spel) cap; `het spel` (generic game) lowercase.
- `Job/Jobs` per §6.16.

### 7.3.2 Audit drift counts (TBD per episode)
Per-episode scans will produce drift counts for each term. To populate during E0–E11 sweep.

### 7.4 The Gods — capital U/Uw
- See §5.2.

### Notes
- *(empty — accrue here)*

---

## §8 — Compounds & hyphenation

### 8.1 Machine (NOT Machien)
- **CRITICAL RECTON:** `Machine` kept; `Machien` plan REVERSED 2026-05-10.
- All earlier `Machien` swaps undone (~120 cells reversed).
- `Piet-Machine` stays (NOT `Piet-Machien`).
- **Codex:** `Cole-Machine.dutch` field reflects Machine.

### 8.2 Machine compounds — hyphen
- **Rule:** Hyphenate Machine compounds: `Tractor-Machine`, `Auto-Machine`, `Boor-Machine`, `Camion-Machine`, `Mysterie-Machine`, `Tank-Machine`, `Vlieg-Machine`.
- **Catch:** `Camion Machine` (no hyphen, 5 cells) → `Camion-Machine`.
- **Status:** ⏳ E6/E7/E10 pending; E10 J148 has `Tank Machines... Vlieg Machines...` needing hyphens.

### 8.3 Keien-Spel
- **Canonical:** `Keien-Spel` (hyphen, cap K + S). EN "Rocks/Stone Game".
- **Status:** ✅ Batch b applied (12 cells), 0 residue.

### 8.4 Hemelvaarts-zang-der-Ezel-zielen
- See §14.

### Notes
- *(empty — accrue here)*

---

## §9 — Punctuation

### 9.1 Apostrophe at sentence start
- **Rule:** `'t Is` not `t Is`. `'k Heb` not `k Heb`. `'n` not `n`. Apply at sentence start (after `.`/`!`/`?`).
- **Status:** ⏳ 9 drift cells (E3×4, E5×1, E6×3, plus E2/E3 mixed). E3_100 J5 `k Mag` flagged.

### 9.2 Mid-sentence cap on `Ik` (after comma)
- **Rule:** Standard Dutch — `Ik` only at sentence start; mid-sentence after `, ` is lowercase verb.
- **Patrick artifact:** mid-sentence `Ik Heb`, `Ik Ben` in Butte's Log entries (E3_100 J7, E3_200 J3, E3_200 J4).
- **Fix:** lowercase the verb after `Ik` (Butte is Standard Dutch — ABN register).
- **Status:** ⏳ 3 cells in E3.

### 9.6 Diary / journal entries — uncontracted `Ik` / `Het` — ✅ PATRICK 2026-05-11
- **Rule:** In diary/journal text (Butte's Log entries, E3_100/E3_200/E3_300), keep `Ik` and `Het` **uncontracted**. Do NOT use `'k` or `'t`.
- Compatible with §9.2 above (lowercase the verb after `Ik` in mid-sentence — both rules apply together).
- **Status:** ✅ Patrick-implemented for diary consistency.

### 9.3 Terminal periods
- **Rule:** Add terminal `.`/`!`/`?` per EN.
- **Status:** 🔍 Ad-hoc. Known: E2_BattleMiner J11 missing period.

### 9.4 Quotes — curly vs straight
- **Status:** ✅ Largely resolved (commit `a0ead0a` hit 11 cells). 🤔 Standard direction: pending corpus-wide choice if relapses found.

### 9.5 Em-dash vs hyphen
- **Em-dash `—`:** speech interruption / parenthetical.
- **Hyphen `-`:** compounds.

### Notes
- *(empty — accrue here)*

---

## §10 — Idioms & grammar

### 10.1 doekjes om winden — ⚠️ PATRICK CONFIRMED RAISE
- **Canonical:** `doekjes om winden` ("to mince words").
- Wrong: `doekjes rond winden` (current state in 1 cell — `Ik ga er geen doekjes rond winden, mensen.`).
- **Patrick (2026-05-11 notes):** flags the `rond winden` issue (confirms our diagnosis).
- **Status:** ⏳ 1 cell ready to fix (E5_CircusMain J195 Ringmaster).

### 10.2 Astrale Hiernamaals
- **Canonical:** `Astrale Hiernamaals` (`-e` ending, neuter).
- Wrong: `Astraal Hiernamaals` or `Hiernaamaals` (extra a typo).
- **Status:** ✅ Clean in current scan.

### 10.3 scheppen vs schoppen
- **Rule:** Per-cell context. `scheppen` = create; `schoppen` = kick.
- **Status:** 🔍 Per-cell.

### 10.4 aap-itude (Ringmaster pun)
- **Decided:** 2026-05-10 — keep current (aap-itude stays).
- **Status:** ✅ Locked.

### 10.5 ezel8ig (leetspeak title) — ⚠️ PATRICK CONFIRM PENDING
- **Canonical:** `asi9 by David Mesiha` → `ezel8ig` (Dutch leetspeak mirror).
- **Patrick (2026-05-11 notes):** "Current proposal ezel8ig" — needs Tom sign-off.
- **Status:** ⏳ 1 cell (E10_Government J12). See §17 Q17.

### 10.6 Phrase consistency
- Identical EN → identical NL across sheets.
- See §6.7 for E2 battle examples.

### 10.7 slokske (Flemish diminutive) — ✅ TOM LOCKED 2026-05-12
- **Canonical:** `slokske` (Flemish -ske diminutive).
- **Wrong:** `slokkie` / `slokje` (ABN/non-Flemish forms).
- **Scope:** ge/gij register speakers (Thirsty, Bad, Hard, etc.) — Flemish diminutive applies.
- **Status:** ⏳ First found in E6_Nightmare J70/J71 (CUT lines — no push needed). Scan forward episodes.

### Notes
- *(empty — accrue here)*

---

## §11 — SFX / sound effects

### 11.1 Sad whimper — ✅ PATRICK SWEEP COMPLETE 2026-05-11
- **Canonical:** `*boe-hoe-hoe*` (lowercase b, hyphens, exactly 3 `hoe`).
- **RECTON:** lowercase b wins (2026-05-10) — overrides earlier batch f which used capital B.
- **Codex:** Sad Ass `verbalTics` starts with `*boe-hoe-hoe*`.
- **Status:** ✅ Patrick confirmed: "All Triestige boe-hoe-hoe updated".

### 11.2 Radio static — *tsj*
- **Canonical:** `*tsj*` (DJ Tom).
- **Status:** 🔍 Audit pending (other forms may exist).

### Notes
- *(empty — accrue here)*

---

## §12 — Verbal tics (CODEX-DRIVEN)

**Authority:** codex `verbalTics` per character.

### 12.1 Sturdy Ass — `, Kameraad` tag — ✅ PATRICK CONFIRMED 2026-05-11
- **Rule:** Strip `, Kameraad` from NL when EN has NO `, Comrade`. Keep when EN-justified.
- **Status:** ✅ Batch m applied (14 cells stripped). m2 review for 9 EN-justified cells: keep all. Patrick: "Cut all extra Kameraad".

### 12.2 Sturdy Ass — motto canonical form
- **Canonical:** `slechte, zielloze, werk-afpakkende, kind-dodende Machines` (Machines plural since 8.1 reversion).
- **Exception:** `KWAADAARDIG!` (emphatic) stays.
- **Status:** ⏳ 1 cell needs full reword (E6_World J142); ~2 fragment cells (E1_Stable2F J56 ✅ pushed 2026-05-12).

### 12.3 Slow Ass — stutter pattern
- **Rule:** Stutter prefix on Dutch consonants only (b-/z-/p-/d-/h-/m-). No English fragments mid-stutter.
- **Status:** ✅ Batch n applied.

### 12.4 English bleed in donkey lines — ✅ PATRICK SWEEP COMPLETE 2026-05-11
- **Rule:** Zero English words in donkey speech. Exception: `Sorry` (naturalised Flemish loanword).
- **Concrete Patrick fixes:**
  - `oh boy` → **`Oh jee`** (corpus-wide)
  - Slow Ass's `Please` → **cut**
  - Butte's `business is business` → kept BUT wrapped in **quotation marks** (foreignness marker)
- **Status:** ✅ Largely clean.

### 12.5 Old Ass — slogan `EZELS EERST`
- **Codex:** Old Ass `verbalTics` references `EZELS EERST`.
- See §14.1.

### Notes
- *(empty — accrue here)*

---

## §13 — Translation mistakes (mistranslations to fix)

### 13.1 Heritage Stable → Erfgoedstal (NOT Erfgoedshoeve)
- **CRITICAL:** Original NL `Erfgoedshoeve` = "Heritage Farm" (mistranslation).
- **Canonical:** `Erfgoedstal` (Stable → Stal).
- **Status:** ✅ Pushed for E1 cells (Welcome Sign, standalone label).
- **Catch rule:** when EN says "Stable" → NL must use `Stal`-form, not `Hoeve`-form.

### 13.2 Boerderij (general) → Hoeve in place-name context
- See §3.6.

### 13.3 Oh liefste Gods → Geprezen zijn de Goden
- **Canonical:** `Geprezen zijn de Goden.` (option b).
- Wrong: `Oh liefste Gods` (translation drift).
- **Decided:** 2026-05-10.
- **Status:** ⏳ 1 cell (E6_World J160 Sturdy).

### 13.4 Winden der Revolutie — ✅ PATRICK 2026-05-11
- Patrick: "Winden der Revolutie typo corrections" — typo sweep complete.
- **Status:** ✅ Patrick-implemented. Note: appears in 4 E9_GoldenAss cells (J91/J94/J116/J117) as a ritual/mythic phrase.

### 13.5 Reassignment / Heraanstelling (translation lock) — ✅ TOM 2026-05-11
- **Noun canonical:** `Heraanstelling` (capped per §7.3).
- **Verb canonical:** `heraangesteld worden` (passive, lowercase verb).
- **Idiom canonical:** `Heraanstelling ondergaan` (matches established E8 usage — Hee/Haw/THE GODS).
- **Reject (drift):**
  - `herverkoren` (= "re-chosen" — wrong word)
  - `opnieuw toegewezen` (close, but not canonical)
  - `herrijzen` (= Ascension/resurrection, ≠ Reassignment)
- **Drift cells (4 to fix):**
  - E1_Stable2F J47 (Sturdy) — drops "Reassignment" entirely; replace with full canonical line (see §14.2.1).
  - E4_KicksGoodbye J5 (Kick) — `herverkoren wordt` → `heraangesteld wordt`
  - E4_AstralPlaneMain J89 (Tight Ass) — `herverkoren te worden` → `heraangesteld te worden`
  - E6_Stable2F J3 (Sturdy) — `opnieuw is toegewezen` → `is heraangesteld`
- **Already correct (passive verb form):** E8_SanctumMain J36 (`heraangesteld kunnen worden`).

### Notes
- *(empty — accrue here)*

---

## §14 — Slogan & ritual phrases

### 14.1 EZELS EERST (Ass Power slogan)
- **Canonical:** `EZELS EERST` (all caps, imperative chant).
- Supersedes (corpus-observed forms): `EZELSKRACHT`, `EZELSKRACHT AAN DE MACHT`, `EZEL MACHT`, `EZELKRACHT`. Note: `Ezel Belang` was proposed but never landed in corpus.
- **Status:** ⏳ 13 drift cells; 5 need full sentence rephrase (slogan changed from noun phrase to imperative — doesn't drop into existing sentences cleanly).
- **Codex:** Old Ass `verbalTics` references this.

### 14.2 het Hemelvaarts-zang-der-Ezel-zielen (Song of Ascension)
- **Canonical:** `het Hemelvaarts-zang-der-Ezel-zielen` (article `het` — neuter; exact form, hyphens, capital E in Ezel).
- **Status:** ✅ Batches c + c2 applied (10 cells).

### 14.2.1 E1_Stable2F J47 phrasing (fit-box) — ✅ TOM LOCKED 2026-05-11
- **Canonical NL:** **`Iemand moet het Hemelvaarts-zang-der-Ezel-zielen zingen zodat zijn Ziel in het Astrale Hiernamaals heraangesteld kan worden.`**
- **EN:** `Someone has to sing the Song of Ascension to make sure his Ass Soul can reach the Astral Plane and be reassigned.`
- Uses passive verb `heraangesteld kan worden` (lowercase verb per §13.5; matches E8_SanctumMain J36 idiom).
- `zijn Ziel` capped (§7.3 game-systemic). EN "Ass Soul" qualifier dropped for fit-box (deliberate — surrounding context unambiguously about an Ass character).
- Supersedes Patrick's `Zodat...weer kan herrijzen, iemand moet...zingen.` (fronting + redundant `weer` + missing Reassignment translation).
- **Status:** ⏳ Re-push needed (currently has Patrick's drift form).

### 14.3 SCHEP-related (E2)
- See §6.8.

### Notes
- *(empty — accrue here)*

---

## §15 — Asset pipeline / sprite

### 15.1 AFGEVAARDIGDE → VAZAL (sticker/sign) — ✅ PATRICK 2026-05-11
- Asset-pipeline change.
- **Status:** ✅ Patrick confirmed: "Pass on Vazal vs. Afgevaardigde in sprites".

### 15.2 E11 NonCSV signs (52 cells) — ⏸️ DEFERRED 2026-05-11
- **Problem:** `data/csv/11_asses.masses_NonCSVBasedTranslations.csv` has ~50 sign/prop cells with **Italian fallback text** in the `TranslatedDutch` column.
- **Rule:** Translate all signs/props to Dutch per locked canon (`Muilenbeek`/`Klotegem`/`Technopolis`/`Derrière`/`Machine`/etc.).
- **Status:** ⏸️ Deferred to separate later session (Tom 2026-05-11). Tracked as Q5.

### 15.3 E10_Words_Dutch sheet typo pass — ✅ PATRICK 2026-05-11
- **Problem (was):** `E10_Words` has 9 language sheets but no Dutch.
- **Patrick:** "Pass on typos E10_Words Complete".
- **Status:** ✅ Patrick-cleared. Verify final form matches canon (`Machine` not `Machien`, `Muilenbeek`/`Muilebeek` per §3.1 resolution).

### 15.4 Sculpture / sticker / logo text — case-by-case
- **Status:** 🤔 Pending Tom pointer.

### 15.5 Patrick's sprite-redo queue (2026-05-11 decisions)
Following corpus locks above, Patrick has additional sprite/sign work pending:
1. **Muilenbeek redo** — sprites + episode strings currently say `Muilebeek` (Patrick's earlier sweep); revert to `Muilenbeek` corpus-wide. See §3.1.
2. **De Zatten Ezel revert** — sprite has `De Zatten Ezel Cafe` (Patrick's added suffix); revert to bare `De Zatten Ezel`. See §3.5.
3. **Klotegem signage** ✅ already complete (verified in Patrick's notes).
- **Status:** ⏳ Patrick to action.

### 15.6 Signs sweep (corpus-wide) — ✅ TOM LOCKED 2026-05-11

**Total: 19 sign cells across E1, E2, E0 — to fix in upcoming episode batches.**

#### A. Universal typos in Official Sign J7 (5 cells: E1_Farm, E2_World_A1/A2/B1/B2)
- `NIEW` → `NIEUW` (missing U)
- `gesubsidiëerde` → `gesubsidieerde` (modern spelling — no umlaut, one e)
- `regios` → `regio's` (Dutch plural of -o words)

#### B. E2_World_A2 narrative-arc updates (3 cells)
- **J4:** `364 DAGEN SINDS LAATSTE MIJN-ONGEVAL` → `0 DAGEN SINDS LAATSTE MIJN-ONGEVAL` (EN reset to 0 post-accident)
- **J6:** `Naar 't zuiden` → `Naar 't zuidwesten` (EN says "southwest", not "south")
- **J8:** `De Lange Weg Naar 't Schrijn in 't Bos` → translate EN literally: `Oud Bergpad Naar de Stad` (EN: "Old Mountain Trail to the City" — different sign than other sheets)

#### C. piekfijne vs hoogmoderne — `piekfijne` WINS (Tom 2026-05-11)
- E2_World_A1 J10 and E2_World_B2 J6 + J10 use `hoogmoderne` → flip to `piekfijne` corpus-wide (3 cells)

#### D. Preposition normalization
- E1_TheProtest J6: `Ten zuiden, …` → `Naar 't zuiden, …` (1 cell, matches other 5 sheets)

#### E. Warning sign word normalization
- E2_World_B2 J4: `INCIDENT` → `MIJN-ONGEVAL` (1 cell, matches other 5 sheets)

#### F. E0 CharacterProfiles entries (2 cells)
- **J50** `Officiëel Bord` → `Officieel Bord` (modern spelling)
- **J52** `Verlept Bord` → `Vervallen Bord` (Decrepit ≠ withered; `Vervallen` correct)

### 15.7 Sculpture sweep (E6_World) — ✅ TOM LOCKED 2026-05-11

**Total: 4 cells (excluding J144/J145 still pending Trusty title call).**

#### Sculpture5 (Fannyside place names) — drift cells
- **J162 + J163:** `Muilebeek` → `Muilenbeek` (`"De Geneugten van het Betreden van Muilenbeek"`) per §3.1
- **J164 + J165:** `Boerderij` → `Hoeve` (`"Hoeve en Tevredenheid"`) per §3.6

#### Sculpture3 (Trusty tribute) — J144/J145 ✅ TOM 2026-05-12
- **Canonical:** `"Trouwe Ezel, Vreedzaam in de Put"` — Tom keeps Patrick's narrative-pointed form. EN-faithful `"Alles is Goed"` rejected 2026-05-12 (overrides earlier Q18 decision of 2026-05-11).

### 15.8 Sculptures verified clean (no action)
- J148/J149 `"Ass Power!"` → `"Ezels Eerst!"` ✅ canonical per §14.1
- J118/J119 `"Enfant Terrible"` kept French (intentional)
- J120/J121 `"Kin Aesthetic Response"` kept English (intentional art-jargon)

### Notes
- *(empty — accrue here)*

---

## §16 — Patrick (senior editor) policy

- **Default:** defer to Patrick on substantive rewrites (he's senior editor).
- **Stack on top:** our consistency rules (this canon) — apply only AFTER Patrick's text lands.
- **Canon supersedes:** once a form lands in this canon, it overrides anything earlier — Patrick's, Tom's, or any prior batch. Canon is the live source of truth.

### How Patrick's input flows into canon
Patrick's notes/raises don't have to result in his specific proposal — but they often trigger the decision that ends up in canon. Pattern: **Patrick flags → Tom decides → canon takes final form → that form supersedes everything previous, including any earlier Patrick proposal.**

Examples from 2026-05-11:

| Patrick proposed | Canon final (supersedes Patrick's form) | Outcome |
|---|---|---|
| `Muilebeek` (no extra n) in sprites + episode strings | **`Muilenbeek` supersedes** | Patrick redoes sprites |
| `De Zatten Ezel Cafe` (suffix added) | **bare `De Zatten Ezel` supersedes** | Patrick reverts sprites |
| `EET MIJN SCHEP OP, KLOOTZAKSKE!!` | **`HIER SÉ, KLOOTZAKSKE!!` supersedes** | Tom's third option after Patrick's SCHEP/SCHOPPEN confusion flag |
| "Plan always" (drop nuance) | **`Plan` when EN=Plan / `afspraak` when EN=deal supersedes** | Nuance retained |
| J47 reorder (fronting `Zodat…` + `weer kan herrijzen`) | **Tom's `…zodat zijn Ziel in het Astrale Hiernamaals heraangesteld kan worden` supersedes** | Patrick's reorder kept the spirit, canon refined the grammar + Reassignment translation |
| `doekjes rond winden` flagged as issue | **`doekjes om winden` supersedes** | Patrick's flag confirmed our existing canon |

### Cases where Patrick's input lands intact
| Patrick's lock | Adopted into canon |
|---|---|
| `EZELZEULER ZENO/ZITA` | ✅ §4.2.2 |
| `Vijver van Hiehiehie` | ✅ §3.7 |
| `Topstrateeg` (variants unified) | ✅ §6.14 |
| `Kameraad Moeder` (no hyphen) | ✅ §6.15 |
| `oh boy → Oh jee` (English bleed) | ✅ §12.4 |
| Slow's `Please` cut | ✅ §12.4 |
| Butte `"business is business"` wrapped in quotes | ✅ §12.4 |
| Diary `Ik`/`Het` uncontracted | ✅ §9.6 |
| 4-liner shortened (Derentuin + Stadscircus) | ✅ §3.8 |

### Workflow
- **Before pushing:** always pull live remote → compare per-cell → decide override case-by-case against this canon.
- **When Patrick raises a question** (e.g., "is there an alternative for X?"): if canon already has the answer, surface it back to Patrick (see §17 C1–C10 communication-back list).
- **When Patrick proposes a substantive form:** evaluate against canon → adopt, refine, or reject → update canon in the same turn.

---

## §17 — Open questions (decisions needed)

### Pre-existing
| # | Question | Affects |
|---|---|---|
| ~~Q1~~ | ~~E3 Foal register flip~~ — **RESOLVED 2026-05-11 (option C per-scene)**:<br>• **E3_LazysGrave J8, J17** — keep `gij`/`uw` (Foal addressing dead uncle's bones — formal/grief register, parallel to Sad's "uw Nonkel" exception)<br>• **E3_BadCave J5, J6** — flip to je/jij (`Ben je dat?` — intimate, scared moment with Lazy)<br>• J25, J20: nie→niet only (no register issue, handled by §2)<br>• J18: Bad Ass speaking (NOT Foal) — ge/gij stays. | E3 batch ✅ |
| ~~Q2~~ | ~~`Oom Bikkelhard` (E6_World J9)~~ — **RESOLVED 2026-05-11**: live cell already canonical (`Nonkel Bikkelharde` — Nonkel per §6.2 + terminal -e per §4). No action. | 1 cell ✅ |
| ~~Q3~~ | ~~E0_Questions player register~~ — **RESOLVED 2026-05-11**: normalize to je/jij (matches 17/18 existing cells + Foal's je/jij side). Fixes:<br>• Row 27 `Bent u…uw baan…uw functie…uw werkplek` → `Heb je…je job…je functie…je werkplek` (register + `baan→job` per §6.16 generic context)<br>• Rows 6, 7 `Diegene` → `Diegenen` (plural form — direct pluralisation of demonstrative)<br>~3 cells total. | E0 batch ✅ |
| ~~Q4~~ | ~~DJ Dope Ass codex entry~~ — **RESOLVED 2026-05-11: je/jij + jullie per corpus (J222, J223).** Add to codex v3.5. | §1 codex sync ✅ |
| Q5 | E11 NonCSV signs (52 cells) — **DEFERRED 2026-05-11**: handle in separate later session. Critical backlog flagged. | E11 scope ⏸️ |
| ~~Q6~~ | ~~E4_HerdSplits J62: Thirsty `Schoon Beest` restoration~~ — **RESOLVED 2026-05-11:** `Schoon Beest, wat gaat gij doen, héé?` (replaces `Lieve Ezel`). | §4.4 ✅ |
| ~~Q7~~ | ~~Klotegemmers vs Klotegemnaars~~ — **RESOLVED 2026-05-11: Klotegemmers wins.** | §3.3 ✅ |
| ~~Q8~~ | ~~`registerExceptions` scrutiny~~ — **RESOLVED 2026-05-11**: ge/gij chars use u/uw natively (not exception). §5.1 reframed. **Real Q8 finding = 8 E10 split-donkey codex gaps** (Helpful/Skinny/Tragic/Gaunt = je/jij; Edgy = ge/gij locked; Proper/Resentful/Bleak → Q19). | §1 sync ✅ |
| ~~Q9~~ | ~~`verbalTics` scrutiny~~ — **RESOLVED 2026-05-11**: 3 drift items found (Cole-Machine Mechalen→Technopolis, Thirsty Poepegaatje→De Zatten Ezel, Miner Jenny `Je Bent`→`Ge Zijt`). Codex v3.5 patch staged. | Codex sync ✅ |

### Patrick conflicts / re-opened (2026-05-11)
| # | Question | Affects |
|---|---|---|
| ~~Q10~~ | ~~De Zatten Ezel vs De Zatten Ezel Cafe~~ — **RESOLVED 2026-05-11: bare `De Zatten Ezel` wins.** Patrick reverts sprites. | §3.5 ✅ |
| ~~Q11~~ | (intentionally retired — was duplicate of Q10) | — |
| ~~Q12~~ | ~~Muilenbeek vs Muilebeek~~ — **RESOLVED 2026-05-11: Muilenbeek wins. Patrick redoes sprites.** | §3.1 ✅ |
| ~~Q13~~ | ~~SCHEP/SCHUP E2 J14~~ — **RESOLVED 2026-05-11: SCHUP wins; J14 = `HIER SÉ, KLOOTZAKSKE!!`** | §6.8 ✅ |
| ~~Q14~~ | ~~Afspraak vs Plan~~ — **RESOLVED 2026-05-11: keep nuance — Plan when EN=Plan, afspraak when EN=deal. Patrick override rejected.** | §6.9 ✅ |
| ~~Q15~~ | ~~DJ welcome~~ — **RESOLVED 2026-05-11: `MERCI VOOR NAAR MIJN SET TE KOMEN!!!`** | §6.13 ✅ |
| ~~Q16~~ | ~~E1_Stable2F J47 phrasing~~ — **RESOLVED 2026-05-11:** `Iemand moet het Hemelvaarts-zang-der-Ezel-zielen zingen zodat zijn Ziel in het Astrale Hiernamaals heraangesteld kan worden.` | §14.2.1 ✅ |
| ~~Q17~~ | ~~ezel8ig leetspeak title~~ — **RESOLVED 2026-05-11: `"ezel8ig" van David Mesiha` LOCKED** (already in NL). `ezel8ig` = ezelachtig with ach→8; mirrors EN `asi9`. | §10.5 ✅ |
| ~~Q18~~ | ~~Sculpture3 J144/J145 Trusty title~~ — **RE-RESOLVED 2026-05-12**: `"Trouwe Ezel, Vreedzaam in de Put"` **KEPT** (narrative-pointed form wins). Tom overrides 2026-05-11 EN-faithful decision. Local xlsx reverted, no push needed. | §15.7 ✅ |
| ~~Q19~~ | ~~Proper / Resentful / Bleak Ass register~~ — **RESOLVED 2026-05-11**: je/jij with formal-address `registerExceptions` (parallel to Sad/Nice/Slow). Names denote personality/social-positioning, not dialect. The observed `u/uw` cells = formal-context exception for these je/jij chars. | §1 codex stubs ✅ |

### Communication to Patrick (Tom-locked 2026-05-11; pending one-shot sync note)
| # | Item | Locked answer |
|---|---|---|
| C1 | Acte vs Nummer | `Nummer` (full form) — §6.10 |
| C2 | HUDO alternative | `De Plee` — §6.1 |
| C3 | Jansen alternative | E6J8 `gulle`, E6J55 `Kleine` — and **`jansen` extinct after** — §6.11 |
| C4 | Nijg alternative | `fel` — §6.12 |
| C5 | doekjes rond winden | Fix to `doekjes om winden` — §10.1 |
| C6 | **NEW:** SCHUP wins (SCHEP reverted); J14 = `HIER SÉ, KLOOTZAKSKE!!` | §6.8 |
| C7 | **NEW:** Plan/afspraak nuance kept (Plan when EN=Plan; afspraak when EN=deal) | §6.9 |
| C8 | **NEW:** DJ welcome J221 = `MERCI VOOR NAAR MIJN SET TE KOMEN!!!` | §6.13 |
| C9 | **NEW:** Muilenbeek wins corpus-wide; Patrick redoes sprites + episode strings | §3.1 |
| C10 | **NEW:** Bar name = bare `De Zatten Ezel` (no Café/Cafe); Patrick reverts sprite | §3.5 |

---

## §18 — Retconned / superseded (archaeology)

Keep these so the next session knows what's been reversed.

| Was | Now | Date |
|---|---|---|
| `Muilebeek` (no extra n) | **`Muilenbeek`** | 2026-05-10 |
| `Boerderij` (in place-name context) | **`Hoeve`** | 2026-05-10 |
| `Erfgoedshoeve` (Heritage Stable) | **`Erfgoedstal`** | 2026-05-10 |
| `Machien` (plural `Machienen`) | **`Machine` (kept; Machien plan REVERSED)** | 2026-05-10 |
| `Bikkeharde` (missing L) | **`Bikkelharde`** | 2026-05-04 |
| `*Boe-hoe-hoe*` (cap B) | **`*boe-hoe-hoe*` (lowercase b)** | 2026-05-10 |
| `De Hudo` (corpus-observed) | **`De Plee`** | 2026-05-10 |
| `Oom everywhere` directive | **`Nonkel everywhere; Oom only for Smart Ass`** | 2026-05-04 |
| `Stenen-Spel` | **`Keien-Spel`** | 2026-05-04 |
| `EZELSKRACHT` / `EZELSKRACHT AAN DE MACHT` / `EZEL MACHT` / `EZELKRACHT` (corpus forms) | **`EZELS EERST`** | 2026-05-10 |
| `EET MIJN SCHEP OP, KLOOTZAKSKE!!` (Patrick proposal) | **`EET DEZE SCHEP, KLOOTZAKSKE!!`** (then later replaced 2026-05-11 — see below) | 2026-05-10 |
| `Stopt` (Nice Ass imperative) | **`Stop`** (je/jij imperative no -t) | 2026-05-10 |
| `Schoon Beest` (general) | **`Lieve Ezel`** (except Thirsty→Nice) | Phase-C |
| `Snotezel` | **`Snot Ezel`/`Snotje`** | Phase-C |
| `Stampgast` | **`Stamp`** | Phase-C |
| `Sloom` | **`Slome`** | Phase-C |
| `Felle Gast` | **`Bikkelharde`** | Phase-C |
| `Betweter`/`Betweterke` | **`Slimme`/`Slimmeke`** | Phase-C |
| `*-Zak` suffixes (Triestigaard etc.) | **Removed** | Phase-C |
| `aap-itude` proposed rework | **Kept as-is** | 2026-05-10 |
| `afspraak` (when EN = "Plan") | **`het Plan`** | 2026-05-10 |
| `acte` (Circus) | **`Nummer`** | 2026-05-10 |
| `Oh liefste Gods` | **`Geprezen zijn de Goden`** | 2026-05-10 |
| `Astraal Hiernamaals` (forbidden form — rule, not corpus drift) | **`Astrale Hiernamaals`** (`-e` ending; neuter agreement) | per §10.2 |
| `doekjes rond winden` | **`doekjes om winden`** | per idiom |
| `D9 universal nie→niet RESCINDED` | **RE-LOCKED — canon overrides codex; everyone `niet` no exceptions** | 2026-05-11 |
| `Hard Ass.dutch = "Bikkeharde Ezel"` (codex) | **`Bikkelharde Ezel`** | codex v3.4 |
| `Sick Ass.dutchShort = "Snotje"` (codex) | **`Snot`** — `Snotje` is Kick's nickname only | 2026-05-11 (pending codex v3.5) |
| `nie + niet both allowed` (codex Bad/Nice/Sad/Thirsty) | **`niet only — never nie`** | 2026-05-11 (pending codex v3.5) |
| `nie` in `dialectalMarkersAllowed` (codex Bad/Nice/Sad/Thirsty) | **REMOVED** | 2026-05-11 (pending codex v3.5) |
| `Kameraad-Moeder` (hyphenated) | **`Kameraad Moeder`** (no hyphen) | 2026-05-11 (Patrick) |
| `EZELZEULER` typos | **`EZELZEULER ZENO` / `EZELZEULER ZITA`** | 2026-05-11 (Patrick) |
| `Topstrateeg` variants | **`Topstrateeg`** (single form) | 2026-05-11 (Patrick) |
| `oh boy` (English bleed) | **`Oh jee`** | 2026-05-11 (Patrick) |
| Slow Ass `Please` (English bleed) | **Cut** | 2026-05-11 (Patrick) |
| Butte `business is business` (bare) | **Wrapped in quotes** as foreignness marker | 2026-05-11 (Patrick) |
| Diary contractions (`'k`, `'t`) | **Uncontracted `Ik` / `Het`** in Butte's Log entries | 2026-05-11 (Patrick) |
| `SCHUP → SCHEP` (earlier lock 2026-05-10) | **REVERSED — SCHUP wins** | 2026-05-11 (Tom) |
| `EET DEZE SCHEP, KLOOTZAKSKE!!` (pushed) | **`HIER SÉ, KLOOTZAKSKE!!`** (taunt re-write) | 2026-05-11 (Tom) |
| `BEDANKT VOOR BUITEN TE KOMEN VOOR MIJN SET!!` (Anglicism) | **`MERCI VOOR NAAR MIJN SET TE KOMEN!!!`** | 2026-05-11 (Tom) |
| `het Plan` blanket (Patrick proposal) | **REJECTED — keep Plan/afspraak nuance** | 2026-05-11 (Tom) |
| `De Zatten Ezel Cafe` (Patrick) | **REJECTED — bare `De Zatten Ezel` stays** | 2026-05-11 (Tom) |
| `Muilebeek` in sprites (Patrick) | **REJECTED — `Muilenbeek` corpus-wide; Patrick redoes sprites** | 2026-05-11 (Tom) |
| Miner Jenny `je/jij` (codex v3.4) | **`ge/gij`** corpus-wide; 9 cells flip; codex v3.5 sync | 2026-05-11 (Tom) |
| `Wat is je respons?` (E2 J17 UI) | `Wat is je reactie?` | 2026-05-11 (Tom) |
| `Beroep/Beroepen` (game-system) | `Job/Jobs` (capped per §6.16) | 2026-05-11 (Tom) |
| `nen job` (Old Ass J169) | `een job` (codex `articleRule: een only`) | 2026-05-11 (Tom) |
| ~~`Wereldtournee` (E5 J45 cap) → `wereldtournee`~~ | **REVERSED 2026-05-12** — `Wereldtournee` cap-always per §7.2 lock (proper noun, game-system tour name) | 2026-05-11 → 2026-05-12 (Tom) |
| ~~`Circusdirecteur` mid-sentence (J45/J121/J221) → `circusdirecteur`~~ | **REVERSED 2026-05-12** — `Circusdirecteur` cap-always per §7.2 lock; bare `Tournee` also caps (J168/J177) | 2026-05-11 → 2026-05-12 (Tom) |
| `EZEL MACHT` / `EZELKRACHT` / `EZELSKRACHT` | `EZELS EERST` (4 cells) | 2026-05-11 (sweep ready) |
| `herverkoren` / `opnieuw toegewezen` (4 cells) | `Heraanstelling kan ondergaan` / `heraangesteld worden` | 2026-05-11 (Tom) |
| E1_Stable2F J47 (drops "Reassignment") | `Iemand moet het Hemelvaarts-zang-der-Ezel-zielen zingen zodat zijn Ziel in het Astrale Hiernamaals heraangesteld kan worden.` | 2026-05-11 (Tom locked) |

---

## §19 — Per-episode status

**Live state — end of canon-codification chat 2026-05-11:**
- Canon walk complete (§0–§23). Codex v3.5 patched.
- `corrections/2026-05-11-master.json` (56 cells) **applied to local xlsx but NOT pushed to remote.**
- Next chats run per-episode E0 → E1 → ... → E10 per §20 protocol.

| Episode | Locally-applied today | To do in next per-episode chat |
|---|---|---|
| **E0** | ✅ **COMPLETE 2026-05-12** — Push 1: 5 cells (CharacterProfiles J50/J52; E0_Questions J6/J7/J27). Push 2: 19 cells universal sweep (E0_Questions J43 job→Job §6.16; J67/68/69/70/73/74/75/76/83/84/87/93/95/96/97/101/105/108 Ezel cap §7.1; J74 hebbem→hebben typo). Round-trip: 0 diffs. | ✅ Done |
| **E1** | ✅ **COMPLETE 2026-05-12** — Push 1: 4 cells (E1_Farm J7 sign typos §15.6A; E1_Farm J25 Thirsty nie→niet §2; E1_Stable2F J47 Hemelvaarts-zang rewrite §14.2.1+§13.5; E1_TheProtest J6 zuiden norm §15.6D+§15.6C). Push 2: 2 cells universal sweep (E1_TheProtest J54 plan→Plan §6.9; E1_Stable2F J56 Sturdy motto reword §12.2). Round-trip: 0 diffs. | ✅ Done |
| **E2** | ✅ **COMPLETE 2026-05-11** — Push: 20 cells (BattleMiner J6/J11/J13/J14/J17; MinersHouse J3/J5/J8/J9; World_A1/A2/B1/B2 J7 sign typos; World_A2 J4/J6/J8 narrative-arc; World_B2 J4 MIJN-ONGEVAL; hoogmoderne→piekfijne ×3). Sweep: 0 actionable — §2/§7.1/§3.6/§6.17(UI false pos)/§12.1(EN-justified)/§4.4(exception) all clean; §6.16 J58+J5 confirmed lowercase (generic context). Round-trip: 0 diffs. | ✅ Done |
| **E3** | ✅ **COMPLETE 2026-05-12** — Push 1: 4 staged (BadCave J5/J6 Foal je→jij flip + `jij` cap; 100 J5 `Ik mag` per §9.6; Mine1F J41 Plee). Push 2 sweep: 14 cells Mine1F (§2 ×10: J17/19/31/33/42/45/67/72/75/78/84 + J75 §5.4 Zegt + §3.1 ×2 J79/J136 Muilenbeek + §6.16 ×2 J49 reword Jobs/J136). Push 3: BadCave §2 ×5 (J20/21/22/26/35 + J35 §7.1). Push 4: LazysGrave §2 ×3 (J8/17/25). Push 5: E3_100 J7/J10/J11/J16 (§9.2 Ik [Cap] artifact, §7.1 Ezels, §8.2 Boor-Machine, §3.4.1 Imechelda Algemeen Ziekenhuis). Push 6: E3_200 J3 (§9.2+§7.1+§3.6+§3.1 combined). Push 7: E3_300 J3 (§7.1) + E3_DonkeyBas J17 (§7.1). Total: 33 cells. Round-trip: 0 diffs. | ✅ Done |
| **E4** | ✅ **COMPLETE 2026-05-12** — Push 1: 5 cells (HerdSplits J62 Schoon Beest §4.4; KicksGoodbye J5 + AstralPlaneMain J89 heraangesteld §13.5; AstralPlaneMain J221 DJ welcome §6.13; Mine1F J23 EZELS EERST §14.1). Push 2: 3 sweep cells (HerdSplits J10/J63 Muilenbeek §3.1; AstralPlaneMain J127 HAW donkey nie→niet §2 + accent polish). Sweep: §6.16 J32 confirmed lowercase (Smart Ass parallel to E2 Bad Ass precedent — generic reclaim-work). Round-trip: 0 diffs. | ✅ Done |
| **E5** | ✅ **COMPLETE 2026-05-12** — Push 1: 3 cells (CircusMain J45/J121/J221 Circusdirecteur lc retcon — LATER REVERSED in Push 3). Push 2: 19 cells universal sweep — CircusMain J21/J73 acte→Nummer §6.10; J25/J26 Ringmaster Rico Job cap §6.16; J132 Kick Ass Job §6.16; J167/J176 Slow Ass nijg→fel §6.12; J168/J177 Smart Ass Circusdirecteur+Tournee lc — LATER REVERSED in Push 3; J195 Ringmaster doekjes om winden §10.1; J215/J217/J218/J220 Ezel cap §7.1; J245 Derriere Jobs §6.16; ZooMain J120 Sad Ass Job §6.16; J224 Grandma Kulan Ezeltje §7.1; ZooCapture J30/J33 Wedgie+Zookeeper Rose Ezel §7.1. Push 3: 6 cells revert per §7.2 cap-everywhere lock — re-cap `Circusdirecteur` (J45/J58/J121/J168/J177/J221) + `Wereldtournee` (J45/J58) + bare `Tournee` (J168/J177). §6.16 exceptions added (Tom 2026-05-12): J106 + J131 (Smart Ass generic-reclaim, parallel to J199/J208). §18 reversed: Wereldtournee + Circusdirecteur retcons. Round-trip: 0 diffs / 23 cells. | ✅ Done |
| **E6** | ✅ **COMPLETE 2026-05-12** — Push 1: 9 cells (Nightmare J4/J5/J28/J40 Jenny ge/gij §6.17; World J162/J163/J164/J165 Muilenbeek+Hoeve §3.1/§3.6; Stable2F J3 heraangesteld §13.5). J144/J145 kept (Vreedzaam in de Put). BattleHard J8 accepted Patrick's `u`. Push 2: 23 sweep cells (Nightmare J3/J6/J29 §7.1; BadCave J14/J25 §2 + J55 §6.11+§2+§7.1; World J6/J14/J15/J78/J219 §12.1 Kameraad + J179/J190/J203/J249/J302/J314/J317/J336 §2 + J41/J47/J214 §3.6 + J161 §3.1). §12.2 J142 Sturdy motto verified clean. §10.7 `slokske` locked (CUT lines J70/J71). Round-trip: 0 diffs. | ✅ Done |
| **E7** | 0 | E7 universal sweep (Camion-Machine hyphen, Job cap) |
| **E8** | 0 | E8 universal sweep (8 Gods cap U/Uw) |
| **E9** | 0 | E9 universal sweep (4 Gods cap U/Uw) |
| **E10** | 4 cells: ProphetSpeech J109/J111 (EZELS EERST), Credits J116 (EZELS EERST), Government J169 (nen→een) | Push safety + push; universal sweep (9 Gods cap U/Uw, Tank-/Vlieg- hyphens J148, Job cap, 8 split-donkey deep codex profile per Q8) |
| **E11** | 0 | ⏸️ DEFERRED — Q5 separate session (52 Italian-fallback NonCSV cells + missing E10_Words_Dutch sheet) |

---

## §20 — Workflow protocol (per session)

1. **Read this file** in full. Do not act first.
2. **Pull remote:** `python3 scripts/convert/pull-snapshot.py excels.fresh-pull-$(date +%F)`
3. **Diff** local vs fresh-pull → identify Patrick edits since last session.
4. **Pick one episode** (sequential E0→E10).
5. **Walk every cell** in that episode's xlsx column J against §1–§16:
   - Resolve speaker → codex check (§1, §2, §12).
   - Check place names (§3), monikers (§4), pronouns (§5).
   - Check terms (§6), capitalisation (§7), compounds (§8).
   - Check punctuation (§9), idioms (§10), SFX (§11), tics (§12), translations (§13), slogans (§14), assets (§15).
6. **Surface findings** to user with full EN + NL + speaker per cell. Always.
7. **Stage** `feedback-YYYY-MM-DD-EN.json` with corrections (id, file, sheet, cell, speaker, english, current_nl, proposed_nl, rationale, rule_id).
8. **Dry-run:** `python3 scripts/editorial/apply-corrections.py <json>` → ✓/⚠️/❌ — fix until clean.
9. **Apply local:** add `--apply` → `git diff excels/` to verify.
10. **Push safety check:** `python3 scripts/convert/push-file.py <xlsx>` (no `--apply`) — read per-cell diff aloud. **User confirms.**
11. **Push:** add `--apply` → cells tinted green.
12. **Round-trip verify:** re-pull remote, diff = 0.
13. **Update `_CANON.md`:** new decisions / notes / status changes in same turn.
14. **Append `_PUSH-LOG.md`:** og/was/pushed per cell.
15. **Commit:** `_CANON.md` + batch JSON + push log + xlsx changes.
16. **Handoff:** next chat opens with "read `_CANON.md`".

---

## §21 — Status legend

| Symbol | Meaning |
|---|---|
| ✅ | Done / verified clean |
| ⏳ | Drift identified, batch pending |
| 🔍 | Per-cell / ad-hoc audit |
| 🤔 | Decision needed |
| 🔴 | Critical conflict |
| ⛔ | Blocked / out of scope this cycle |
| ⚠️ | Active warning — read before acting |

---

## §21.5 — Tooling notes (push-file.py quirks)

### Leading-apostrophe handling — ✅ FIXED 2026-05-12
- **Issue:** Google Sheets API with `value_input_option=USER_ENTERED` treats a leading `'` as a "force text" format marker and strips it from the stored value (cell displays without the apostrophe).
- **Affected pattern:** Flemish contractions at sentence start (`'t Is`, `'k Heb`, `'n`) when pushed via `scripts/convert/push-file.py`.
- **Fix:** `push-file.py` patched to route any cell whose value starts with `'` through `value_input_option=RAW`, which bypasses the marker parsing. All other cells continue via `USER_ENTERED`.
- **Retcon scan (2026-05-12):** swept all 11 episode files against fresh xlsx-export pull → **0 cells** stripped of leading `'` across E0–E10. The 67 corpus cells starting with `'` predate API push (Patrick xlsx-import preserved them).
- **Round-trip verification:** the in-script `col_values()` comparison still shows false-positive diffs for `'`-leading cells written via RAW (because `col_values` returns the displayed value, not the literal). Use `scripts/convert/pull-snapshot.py` (xlsx export) + cell-by-cell compare for true round-trip verification.

---

## §22 — Source documents (referenced, not authoritative)

| File | What it is |
|---|---|
| `data/json/codex_verified.json` | **Codex v3.4** — per-character rules (AUTHORITATIVE) |
| `data/json/codex_translations.json` | v2.1 mirror — translation-side fields |
| `data/editorial/_PUSH-LOG.md` | Permanent push record |
| `data/editorial/_HANDOFF.md` | OAuth + venv bootstrap for new machines |
| `data/editorial/_MISSION.md` | Project mission/doctrine |
| `data/editorial/corrections/` | All feedback JSONs (active + historical), date-prefixed |
| `data/editorial/archive/audits/` | Historical scan dumps + criteria lists (superseded by this canon) |
| `data/editorial/archive/resumes/` | Old handoff docs (superseded by this canon) |
| `data/editorial/archive/character-baselines/` | Phase-C per-character JSONs (already applied) |
| `data/editorial/archive/misc/` | One-offs |
| `docs/analysis/E*_Opus_Audit*.md` | Per-episode audit dumps (raw findings) |

---

## §23 — Notes & accruals

*Add session-by-session findings here. Every entry: `YYYY-MM-DD | speaker/cell | observation`.*

- *(empty — populate as we go)*
