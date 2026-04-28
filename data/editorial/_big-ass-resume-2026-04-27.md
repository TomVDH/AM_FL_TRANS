# Big Ass editorial pass — resume state (self-contained)

**Date:** 2026-04-27
**Branch:** `am-analysis`
**Read this file end-to-end before doing anything else.** This is the single source of truth for resuming the editorial pass.

---

## Part 0 — Project context

**Project:** `am-fl-trans` — translation tool + editorial workflow for the video game **"Asses & Masses"**, EN → Flemish-Dutch. Each character has a distinct voice. The app provides AI-assisted translation with per-character style profiles; this editorial pass runs *after* AI translation to harden voice consistency in the live `excels/` files.

**Stack (only relevant for context — no code changes needed for editorial):**
- Next.js 15.5 / React 19 / Tailwind, Anthropic Claude API for AI suggest
- Excel/XLSX as authoritative storage; JSON codex as voice-profile source

**Translation status (pre-editorial):** ~98% translated (4314/4404 rows as of 2026-04-12). Editorial pass is orthogonal to that 90-row remainder.

**Editorial scope:** 14 main cast characters. Run order is Tom's call. Order so far:
- Locked: Trusty Ass (v3.1), Slow Ass (v3.3), Trouwe Zak cross-character sweep (7 corrections, 0 residue)
- **In progress: Big Ass** (this file)
- Not started: Bad, Hard, Kick, Lazy, Nice, Old, Sad, Sick, Smart, Sturdy, Thirsty, Foal (12 chars including Foal which is canonical {$NewName})

---

## Part 1 — Methodology (rigid 9-step per character)

```
[1] Baseline evidence   — live xlsx scan of all character's lines
                          counts: 'k/ik, 't/het, nie/niet, ge/gij, je/jou, u/uw, ne/nen, allez/amai/godver
                          hard-error checks: Trouwe Zak residue, EN name leaks, placeholders, empties
[2] Flag inconsistencies — scene-internal drift only (aggregate counts are voice, not error)
                          pairs watched: 'k↔ik, 't↔het, nie↔niet, u↔je, uw↔je, ge↔je, gij↔jij
[3] Propose codex header — machine-readable voiceRules block with evidenceCounts pinned
[4] User locks decisions — specific calls on drift + ceiling questions ("leave", "normalize")
[5] Generate corrections — JSON spec with {id, rationale, file, sheet, cell, english, current_nl, proposed_nl}
[6] Dry-run              — `python3 scripts/editorial/apply-corrections.py data/editorial/FOO.json`
[7] Apply                — `--apply` flag; safety checks verify EN + current_nl before overwrite
[8] Verify               — read-back from xlsx; confirm count of residual violations is 0
[9] Update codex         — bump version, update lastEditorialPass metadata
```

**Correction JSON format** is documented at the top of `scripts/editorial/apply-corrections.py`. Safety gates: EN mismatch → skip, NL mismatch → skip (preserves fresh human edits).

---

## Part 2 — Critical formatting conventions (override the brief)

### 2.1 Codex schema has evolved — `voiceRules` block (Phase-C addition)

The brief at `[[projects/am-fl-trans/brief]]` (lines 98–120) describes the v3.0 header schema (`flemishDensity`, `register`, `pronounForm`, `contractions`, `verbalTics`, `dynamics`, `relationships`, `note`). **Phase C adds a `voiceRules` block** on top of those legacy fields. The old fields are kept for backward compatibility with the AI pipeline; `voiceRules` is the editorial source of truth going forward.

**New schema (machine-readable, explicit, Phase-C-locked characters only):**

```json
{
  "voiceRules": {
    "pronounsAllowed":   { "subject": [...], "object": [...], "possessive": [...] },
    "pronounsForbidden": [...],
    "pronounNote":       "...",
    "contractionsAllowed":   [{ "form": "'k", "scope": "..." }],
    "contractionsForbidden": [...],
    "contractionNote":       "...",
    "dialectalMarkersAllowed":   [...],
    "dialectalMarkersForbidden": [...],
    "articleRule":  "strict standard | ne+nen allowed",
    "negationRule": "nie only | niet only | both allowed",
    "registerExceptions": [ { "context": "...", "rule": "..." } ],
    "verbalTics":    { "<tic>": { "count": N, "scope": "..." } },
    "inboundAddressRules":   [ { "from": "*", "to": "...", "form": "..." } ],
    "outboundAddressForms":  { "TypeA_consistent": [...], "TypeB_shortAndLongMix": [...] },
    "stutterRule":   { "active": false } | { /* detail */ },
    "editorialPass": { "date": "...", "version": "...", "sourceCorpus": "N lines, live xlsx scan", "evidenceCounts": { ... } }
  }
}
```

**Important:** `voiceRules` blocks do NOT yet exist in `codex_verified.json` for any character. Phase-C-locked characters carry the legacy fields with their evidence-pinned values; the `voiceRules` schema is the *intended* destination. When locking Big Ass, follow the schema above.

### 2.2 Brief contradicts Phase-C reality — IGNORE these brief statements

| Brief claim | Phase-C truth |
|---|---|
| `"pronounForm is not mixed for any character — pick the dominant form"` | Big Ass IS genuinely mixed (evidence-locked: je/u/ge all in live corpus). `mixed` is a first-class value. **For Big Ass specifically, Tom locked `ge/gij` as dominant in 2026-04-27 session — see Part 4.** |
| `"contractions: 'none' for all characters"` | Post-Phase-C characters have explicit `contractionsAllowed` arrays. Trusty, Slow, Big all carry real contraction rules. |
| `"Smart Ass is the ONLY zero/ABN character"` | Still probably true, but **needs re-verification** when Smart Ass hits the pass. Don't assume. |
| `"''k must always be written with double-apostrophe (Google Sheets escaping)"` | We now write xlsx directly via `openpyxl`. **Single-apostrophe `'k` is correct in the xlsx.** The double-apostrophe was a Google-Sheets-pipeline artifact. If you see `''k` in an xlsx cell, that's an error. |

### 2.3 `Trouwe Zak` is deprecated — cross-character rule

Old app-level codex had `Trouwe Zak` as a valid nickname for Trusty Ass. **It is no longer used.** Replace with:
- **`Trouwe Ezel`** — formal / full-name / memorial register
- **`Trouwe`** — casual / intimate register

Context decides which. Cross-character sweep applied (7 corrections, 0 residue). Do not regress.

**Same `-Zak` deprecation pattern likely extends to** `Oude Zak` (Old Ass, 19 hits) and `Luie Zak` (Lazy Ass, 6 hits) — pending Tom's Q7 call (Part 4).

### 2.4 Naming — `Type A` vs `Type B` outbound address convention

Characters address others in one of two modes:

- **TypeA_consistent** — uses the canonical long form (e.g. `Slome Ezel`) consistently across all mentions
- **TypeB_shortAndLongMix** — alternates between canonical long form and a short/alternate form depending on register or emotion

Example (Big Ass):
```
TypeB_shortAndLongMix: [
  {target: "Smart Ass",  forms: ["Slimme Ezel", "Betweter"], note: "Betweter when frustrated"},
  {target: "Trusty Ass", forms: ["Trouwe Ezel", "Trouwe"],   note: "Trouwe Ezel memorial; Trouwe casual"}
]
```

### 2.5 Stutter rule — Slow Ass precedent

Established on Slow Ass. Rule shape:

```json
"stutterRule": {
  "active": true,
  "pattern": "triple-letter X-X-word (e.g. 'b-b-ben'). Three instances total: two hyphenated prefixes + full word.",
  "plosivePreference": "plosives (p, t, k, b, d, g) preferred over fricatives",
  "wordInternalStutters": "stutters may appear word-internally (geb-b-bouwen)",
  "exceptions": [
    {"scope": "comedic trailing-gag", "example": "E4_Mine1F standalone 'b-b-b-b...'", "rule": "extended stutter (4+) with ellipsis = intentional gag, preserve verbatim"}
  ]
}
```

When auto-expanding stutters by regex, **post-pass trim is required**: `([A-Za-z])(?:-\1){3,}` → trim to triple. Over-correction happens on word-internal clusters (caught 14 cases on Slow Ass).

### 2.6 Data sources — know which is fresh

| Source | Freshness | Use when |
|---|---|---|
| `excels/*.xlsx` | **Authoritative, live** | All edits + all verification reads |
| `data/analysis/by-speaker/*.csv` | **Stale** — generated once, pre-sweeps | First-pass triage only; always re-verify from xlsx |
| `data/analysis/all-dialogue.jsonl` | Stale (same dump run) | Don't trust for current state |
| `data/editorial/_<char>-live*.json` | Per-character live baseline | Generated during Step 1 of workflow; fresh at time of generation |

**Always trust xlsx > any JSON/CSV dump.** Dumps drift the moment a correction lands.

### 2.7 User preferences — explicit (READ THIS)

- **"I don't particularly trust your judgement"** (2026-04-20). Do NOT offer personality reads or interpretive prose unless asked. Present data, flag inconsistencies, propose corrections, let the user call the disposition.
- **"VERY explicit, both for machine reading purposes"** — all codex headers must be machine-parseable. No prose-only rules.
- **"We are not using Trouwe Zak at all"** — retroactive rules are real. If a rule changes mid-pass, sweep all prior characters' outputs too.
- **"We are always seeking to work across the entire project"** — keep cross-character impact in mind, even when scoped to one character. Other characters' outputs may need a sweep.
- **Simple, guided questions** preferred over data dumps — present one decision at a time when locking.

---

## Part 3 — Big Ass: live data summary (as of 2026-04-26)

**Live xlsx scan:** `data/editorial/_big-ass-live-2026-04-26.json` — 143 lines across 11 xlsx files, 24 distinct sheets.
**Sheets where Big speaks:** E1 (Farm, TheProtest), E2 (World_A1, World_B1), E3 (Mine1FOpening, Mine1F), E4 (HerdSplits, Mine1F), E5 (CircusMain, ZooCapture, ZooMain), E7 (BigBattle, BigJob, Boiling, Chilling, CityStreet, Ejiao, MeatProcessing, ShippingTwo, Shipping, Skinning, SlaughterWaitingRoom, Slaughtering), E10 (Government, Hard, ProphetSpeech), CharacterProfiles (name string only).

**Token counts (live, intimate-pronoun families):**
- ge: 9 · gij: 2 · u: 3 · uw: 2 → **GE-family: 16**
- je: 9 · jou: 1 · jouw: 1 · jullie: 2 → **JE-family: 13**
- ik: 38 · 'k: 12 (11 lowercase + 1 uppercase `'K` at E7_CityStreet R11; double-hits at E7_BigBattle R5 and E7_CityStreet R7) — *corrected 2026-04-27 from snapshot replay (was 10)*
- het: 22 · 't: 9
- niet: 16 · nie: 7
- kameraad: 8 (× *Kameraden* plural: 3) — always capitalized
- *oef!*: 4 — physical-effort tic
- 23 curly apostrophes U+2019 (consistent), 8 em-dashes U+2014 (consistent)

**Existing codex bio (codex_verified.json + codex_translations.json — same content):**
> *"Always sees the big picture or puts things into perspective. Yearns for bigger opportunity and responsibility; wants to make an impact."*

(Provenance unclear — appears to be a paraphrase of his own dialogue at E7_BigJob R39 and E7_Chilling R9 where he literally says "make an impact". Not from creator-supplied design bible.)

**Existing codex voice fields (all stale-or-aspirational):**
| Field | Codex says | Reality |
|---|---|---|
| pronounForm | `mixed` | Tom locked `ge/gij` 2026-04-27 (see Part 4) |
| contractions | `none` | Stale — corpus has `'k`×12 + `'t`×9 |
| note | `"full Ik not 'k; niet dominant over nie"` | Half-stale — `niet` part is right; `'k` part is wrong (12 instances incl. 1 uppercase `'K`). Will be rewritten after Big Ass lock. |

**Stage-direction context:** 49 of 143 lines have stage directions in the Description column. They flag him as: speech-maker (`Branch X.Y: Big makes a speech`), morale officer (`Boosting Big Morale`, `Recruit Big Ass`), self-volunteer for danger (`Big offers to go inside`, `goes into the control room, alone`), and the herd's anxious-but-committed hero in E7 (`A reflection by Big Ass when trying to leave the Factory`).

---

## Part 4 — Decisions LOCKED this session (Q1–Q6)

| # | Field | Decision | Estimated flips |
|---|---|---|---|
| Q1 | pronoun | **ge/gij dominant** | ~11 lines (je-family → ge-family) |
| Q2 | negation | **`niet` only** | 7 (`nie` → `niet`) |
| Q3 | `'k`/`ik` | **`ik` only** | 12 (`'k` → `ik`, including 1 `da'k` → `dat ik` and 1 uppercase `'K` → `IK` at E7_CityStreet R11; *corrected 2026-04-27 from 10*) |
| Q4 | `'t`/`het` | both free, no normalization | 0 |
| Q5 | `u`/`uw` | keep all 5 (paradigm with ge/gij) | 0 |
| Q6 | `jullie` | keep both (accepted in tussentaal) | 0 |

**Cascading effects:**
- BA-D2 (E5_ZooMain R215 `ge`): RESOLVED — `ge` stays; surrounding scene's `je`-family forms flip to `ge`-family.
- BA-D3 (E7_BigBattle R4 `nie` vs R7 `niet`): RESOLVED — R4 flips to `niet`.
- ge ceiling: RESOLVED — ge/gij is dominant, no ceiling. `je` is what's being eliminated.
- Drift candidates #1 (E5_ZooMain `'t`/`het`), #6 (E7_BigJob), #7 (E7_Chilling): RESOLVED — both forms free.
- Drift candidates #3, #5, #8 (`'k`/`ik` across E7_BigBattle, E7_BigJob, E7_CityStreet): RESOLVED — flip to `ik`.

**Voice drift summary:**

| # | scene | pair | counts | resolution |
|---|---|---|---|---|
| 1 | E5_ZooMain | `'t`/`het` | 1/1 | non-issue (Q4) |
| 2 | E5_ZooMain | `ge`/`je` (BA-D2) | 1/4 | flip je-family → ge-family (Q1) |
| 3 | E7_BigBattle | `'k`/`ik` | 5/2 | flip 'k → ik (Q3) |
| 4 | E7_BigBattle | `nie`/`niet` (BA-D3) | 1/1 | R4 flip nie → niet (Q2) |
| 5 | E7_BigJob | `'k`/`ik` | 2/6 | flip 'k → ik (Q3) |
| 6 | E7_BigJob | `'t`/`het` | 1/1 | non-issue (Q4) |
| 7 | E7_Chilling | `'t`/`het` | 3/1 | non-issue (forced by proper noun `het Astrale Hiernamaals`) |
| 8 | E7_CityStreet | `'k`/`ik` | 5/2 | flip 'k → ik (Q3) |

---

## Part 5 — Pending decisions (Q7+)

### Q7 — `Oude Zak` calling Old Ass — **LOCKED 2026-04-27**

**Decision:** Big Ass E1_TheProtest J25 → `Arme Oude Ezel.` (option A, formal canon).

**Status:**
- Big Ass scope: 1 flip locked. Persisted in `data/editorial/oude-zak-sweep.json` as correction `OZ-1`.
- Cross-character: 18 lines listed as `pending_disposition` in same file. Default lean: `Oude Ezel` for formal/third-person/stage-direction; `Oude` for intimate/mournful direct address. Per-line calls deferred to post-Big-Ass sweep session.

**Original framing (kept for reference):**

E1_TheProtest R25:
- EN: *"Poor Old Ass."*
- NL: *"Arme **Oude Zak**."*

Codex canon for Old Ass: `Oude Ezel` (formal) / `Oude` (intimate). The `-Zak` suffix matches the `Trouwe Zak` deprecation pattern.

**Cross-character impact (verified 2026-04-27 from `_full-corpus-2026-04-26.json`):** 19 total `Oude Zak` hits corpus-wide — 1 Big Ass + 18 elsewhere. By-speaker: Sturdy 6 · Nice 6 · Hard 2 · Old Ass 1 (self-ref or addressing) · Sad 1 · Smart 1 · plus 1 NPC speaker `34`. Whatever Tom picks here likely becomes a sweep rule.

**Options for Tom:**
- A) `Oude Ezel` — formal full name
- B) `Oude` — intimate short
- C) Keep `Oude Zak` (would override `-Zak` deprecation pattern)

### Q8 — `Triestigaard` calling Sad Ass — **LOCKED 2026-04-27**

**Decision shape:** register split — formal `Triestige Ezel` (codex canon) / casual `Triestigaard` (Flemish `-aard` epithet, affectionate-mocking). Codex update needed post-pass to legitimize `Triestigaard` as accepted casual form.

**Disposition rule (emergent from line-by-line):**
- formal third-person, stage directions, peer formal address with `Kameraad`, formal task statements listing full names → `Triestige Ezel`
- intimate/casual peer address, family register (`Uncle Sad`), emotional shouting, intimate mourning → `Triestigaard`

**Status:**
- 7 corrections (Triestigaard → Triestige Ezel) persisted in `data/editorial/triestigaard-sweep.json` as `TG-1`..`TG-7`
- 13 keeps documented in same file under `documented_keeps` for audit trail
- Big Ass scope: **0 flips**. Both Big lines (E5_CircusMain J136, J145) are register-correct casual address.
- Codex update required for Sad Ass entry (post-Big-Ass).

**Original framing (kept for reference):**

E5_CircusMain R136 *"Ga je zieke moves aan het publiek tonen, **Triestigaard**!"* and R145 *"Maak je niet te druk, **Triestigaard**..."*. Codex canon: `Triestige Ezel`.

**Cross-character verification (2026-04-27):** `Triestigaard` has **20 corpus-wide hits across 12 speakers** — Smart 5, Bad 2, Big 2, Kick 2, Hard 1, Nice 1, Sad 1 (himself), Lazy 1, Slow 1, plus `{$NewName}` 1, plus 2 numeric NPC speakers. **This is widespread corpus-canon, not Big-specific.** Likely a codex-vs-corpus problem — codex may need adding `Triestigaard` as an accepted nickname (same shape as Trusty's `Trouwe Ezel` formal / `Trouwe` intimate split).

### Q9 — `Dorstlap` calling Thirsty Ass — **LOCKED 2026-04-27**

**Decision shape:** register split — formal `Beschonken Ezel` (codex canon, unchanged) / casual `Zatlap` (NEW — Flemish `-lap` epithet, drunk-rag/sot register). **`Dorstlap` retired entirely** (off-theme: thirsty ≠ drunk). `Zatlap` aligns thematically with `Beschonken` (intoxicated).

**Disposition rule (emergent from line-by-line):**
- stage directions, third-person mention, profile/credits → `Beschonken Ezel`
- peer-to-peer direct address (Big, Kick, Nice) → `Zatlap`
- bare `Beschonken` is unstable: → `Beschonken Ezel` for narrated third-person, → `Zatlap` for direct casual address

**Status:**
- 12 corrections (6 → `Beschonken Ezel`, 6 → `Zatlap`) persisted in `data/editorial/thirsty-sweep.json` as `TH-1`..`TH-12`
- Includes typo fix `Dorstklap` (E3_Mine1FOpening J67) → `Beschonken Ezel`
- Big Ass scope: **2 flips** (E2_World_B1 J22 `Dorstlap` → `Zatlap`, E3_Mine1F J71 `Dorstlap` → `Zatlap`)
- Deferred flag: E6_World J229 (Sturdy) `da` → `dat` contraction repair, parked for Sturdy editorial pass
- Codex update required for Thirsty Ass entry (post-Big-Ass): legitimize `Zatlap`, retire `Dorstlap`

**Original framing (kept for reference):**

E2_World_B1 R22 *"En **Dorstlap**?"* and E3_Mine1F R71 *"\*oef!\*—Ge wilde water en ge hebt het, **Dorstlap**!"*. Codex canon: `Beschonken Ezel`.

**Cross-character verification (2026-04-27):** `Dorstlap` has **9 corpus-wide hits** (Kick 2, Trusty 2, Big 2, Nice 1, plus 2 numeric NPC speakers); `Beschonken` has only **6 corpus-wide** (Thirsty himself 1, Kick 1, Sturdy 1, plus 3 numeric NPC speakers). **Corpus is split with `Dorstlap` slightly dominant in main-cast usage.** Likely a codex-vs-corpus problem — codex may need adding `Dorstlap` as accepted intimate alongside `Beschonken Ezel`, same pattern as Trusty's split.

### Q10 — E3_Mine1FOpening R21 hot spot — **LOCKED 2026-04-28**

**Decision:** Three internal swaps in one cell (E3_Mine1FOpening_localization J21):

| Slot | Was | Now | Why |
|---|---|---|---|
| Sturdy | `Stoere` | `Stevige` | Wrong-character collision: `Stoere` is Bad's canon. Casual-short of `Stevige Ezel`. |
| Hard | `Harde` | `Harde` (kept) | Already corpus-canonical short; thematically aligned with `Bikkeharde Ezel`. |
| Kick | `Trap` | `Stamper` | NEW casual short for Kick. Agent-noun shape parallel to `Triestigaard`/`Zatlap`. **Zero corpus presence — clean introduction.** |
| Sick | `Zieke` | `Snotje` | Codex-aligned casual diminutive. **Corpus has 22 `Snotje` hits already — codex missing it from Sick's nicknames is a separate codex bug to fix.** |

**Final line:**
> Before: *"Ik heb een mega aankondiging, **Kameraad Stoere**! **Harde**, **Trap**, en **Zieke** zijn terug!"*
> After: *"Ik heb een mega aankondiging, **Kameraad Stevige**! **Harde**, **Stamper**, en **Snotje** zijn terug!"*

**Cross-character implications (deferred):**
- `Trap` for Kick: 4 corpus hits total. Cross-char sweep is small — handled in future Kick Ass pass.
- `Stamper`: 0 corpus hits — being introduced from zero.
- `Snotje`: codex catch-up needed (Sick Ass `nicknames` array).
- 9 bare `Stoere` corpus-wide need per-line disambiguation in Sturdy/Bad passes.

**Persisted in:** `data/editorial/big-ass-corrections.json` as correction `BA-Q10-1`.

**Original framing (kept for reference):**

- EN: *"I have a massive announcement, Comrade Sturdy! Hard, Kick, and Sick are back!"*
- NL: *"Ik heb een mega aankondiging, **Kameraad Stoere**! **Harde**, **Trap**, en **Zieke** zijn terug!"*

Divergences against codex:
- `Stoere` (Sturdy) — codex says `Stevige Ezel`. `Stoere Ezel` is **Bad Ass's** canonical per codex — possible mix-up or shared Flemish word.
- `Harde` (Hard) — codex says `Bikkeharde Ezel`; `Harde` is short form (note: corpus elsewhere has `Bikkelharde` with extra `L` — codex/corpus spelling drift).
- `Trap` (Kick) — codex says `Stamp Ezel`; `Trap` is stale alternate (Hard Ass also uses `Trap` at E3 R42).
- `Zieke` (Sick) — codex says `Snot Ezel` / nickname `Snotje`; `Zieke` is a generic adjective.

This is a likely pre-canonical translation that never got swept.

**Verified 2026-04-27 from snapshot.** Big-Ass scope is this single line. Three of the four short forms (`Stoere`, `Harde`, `Trap`) recur elsewhere across the corpus — see Part 6 for cross-character sweep scope.

---

## Part 6 — Cross-character / project-wide work (DEFERRED — post-Big-Ass)

Project-wide audit of `data/editorial/_full-corpus-2026-04-26.json` (4486 lines, all speakers) surfaced these patterns. **Do NOT touch during Big Ass pass.** Sweep job after Big Ass locks.

| Pattern | Scope | Notes |
|---|---|---|
| `Oude Zak` (Old Ass) | 19 hits, multi-speaker | `-Zak` deprecation extension (decided by Q7 outcome) |
| `Luie Zak` (Lazy Ass) | 6 hits, multi-speaker | same `-Zak` pattern; includes Lazy referring to himself ("Ik ben Luie Zak") |
| `Trap` for Kick Ass | 2 hits (Big R21, Hard R42) | small but real |
| `Stoere` (bare) — character disambiguation needed | 9 bare hits (corpus-wide minus 10 `Stoere Ezel` Bad-canonical) | **CORRECTED 2026-04-28:** earlier note here claimed codex says `Stoute Ezel` for Bad — that was wrong. Codex actually says `Stoere Ezel` for Bad, which matches corpus. The real issue: 9 bare `Stoere` uses corpus-wide need per-line disambiguation (some are Sturdy collisions like Q10 R21, some are Bad short forms). Resolved during Sturdy/Bad editorial passes. |
| `Bikkelharde` vs codex `Bikkeharde` | spelling drift in corpus | extra `L` in corpus — codex/corpus discrepancy |
| `(Sad Ass)`, `(Lazy Ass)` literal placeholders | several | untranslated bug |
| `Dorstklap` typo | E3_Mine1FOpening R67 | should be `Dorstlap` |

---

## Part 7 — Key files

| File | Purpose |
|---|---|
| `data/editorial/_big-ass-live-2026-04-26.json` | **Live xlsx scan**, 143 Big Ass lines (file/sheet/row/key/en/nl) |
| `data/editorial/_big-ass-en-with-desc-2026-04-26.json` | Same 143 lines + Description column (49 with stage directions) |
| `data/editorial/_full-corpus-2026-04-26.json` | Full corpus, 4486 lines across all speakers — for cross-character audit |
| `data/editorial/_big-ass-live.json` | OLD baseline from 2026-04-21 (141 lines) — kept for diff |
| `data/editorial/trusty-corrections.json` | Trusty Ass corrections (locked, applied) |
| `data/editorial/slow-ass-corrections.json` | Slow Ass base corrections (locked, applied) |
| `data/editorial/slow-ass-stutter-repair.json` | Slow Ass stutter upgrade (locked, applied) |
| `data/editorial/trouwe-zak-sweep.json` | Cross-character `Trouwe Zak` deprecation sweep (locked, applied) |
| `data/editorial/oude-zak-sweep.json` | **Q7 — locked 2026-04-27.** 1 Big Ass correction + 18 cross-character `pending_disposition` |
| `data/editorial/triestigaard-sweep.json` | **Q8 — locked 2026-04-27.** 7 cross-character corrections + 13 documented keeps. Big Ass: 0 flips |
| `data/editorial/thirsty-sweep.json` | **Q9 — locked 2026-04-27.** 12 cross-character corrections (incl. 2 Big Ass). Retires `Dorstlap`, introduces `Zatlap` |
| `data/json/codex_verified.json` | v3.3 verified codex (legacy schema, no `voiceRules` blocks yet) |
| `data/json/codex_translations.json` | Live app SSoT codex (reads/writes from `/api/codex` route) |
| `data/json/0-10_asses.masses_E*Proxy.json` | Per-episode source dump (12 files, used by app) |
| `data/analysis/character-profiles.json` | Programmatic linguistic profile per speaker — STALE pre-Phase-C, regenerate after corrections via `generate-character-profiles.py` |
| `data/analysis/by-speaker/*.csv` | Per-speaker dialogue dumps from `dump-speaker-lines.js` — STALE (from JSONL); use only for triage |
| `data/analysis/all-dialogue.jsonl` | Source for the dump scripts — STALE |
| `excels/*.xlsx` | **AUTHORITATIVE live source.** 11 episode files. Schema: `A=Key, B=Description, C=Standard(EN), D-N=locales (NL is column J / index 9)`. Speaker is last `.`-segment of Key. |

---

## Part 8 — Project-wide parsing scripts

All in `scripts/`, all tracked on `am-analysis`:

| Script | Language | Purpose |
|---|---|---|
| `scripts/analysis/analyze-nl-corpus.js` | Node | NL corpus analyzer — pronouns, Flemish markers, contractions across all speakers |
| `scripts/analysis/dump-speaker-lines.js` | Node | Per-speaker EN+NL dump from `all-dialogue.jsonl`. Usage: `node scripts/analysis/dump-speaker-lines.js --speaker="Big Ass" --csv`. **Reads stale JSONL — re-verify against xlsx for any decision-grade data.** |
| `scripts/analysis/generate-character-profiles.py` | Python | **Authoritative**: reads all xlsx, generates per-speaker linguistic profile. Regenerates `data/analysis/character-profiles.json`. Also re-emits `all-dialogue.jsonl`. Run this after corrections land to refresh stats. |
| `scripts/convert/download-sheets.js` | Node | Pulls Google Sheets → xlsx (initial ingestion pipeline) |
| `scripts/convert/excel-to-csv.js` | Node | XLSX → CSV per sheet |
| `scripts/convert/excel-to-json.js` | Node | XLSX → per-episode JSON dump (the `0-10_asses.masses_E*Proxy.json` files) |
| `scripts/editorial/apply-corrections.py` | Python | **Editorial workhorse.** Applies a corrections JSON to xlsx with safety gates (EN must match, current_nl must match — else skip). Dry-run by default; `--apply` writes. |

**Quick xlsx-direct scan template (Python — used in this session):**
```python
import os, glob, json, re
from openpyxl import load_workbook
corpus = []
for f in sorted(glob.glob("excels/*.xlsx")):
    wb = load_workbook(f, data_only=True, read_only=True)
    for ws in wb.worksheets:
        for ri, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
            if not row or not row[0] or not isinstance(row[0], str): continue
            key = row[0]
            speaker = key.rsplit('.', 1)[-1].strip() if '.' in key else ''
            corpus.append({
                'file': os.path.basename(f), 'sheet': ws.title, 'row': ri,
                'key': key, 'speaker': speaker,
                'en': row[2] if len(row)>2 else None,
                'nl': row[9] if len(row)>9 else None,
            })
```

---

## Part 9 — Resume protocol

### CURRENT STATE (as of 2026-04-28)

**Q1–Q10 all LOCKED.** Corrections + sweep files all persisted. Nothing applied to xlsx yet.

| Step | State |
|---|---|
| Q1–Q6 voice rules | LOCKED (Part 4) |
| Q7 Oude Zak | LOCKED — 1 Big Ass correction + 18 deferred (`oude-zak-sweep.json`) |
| Q8 Triestigaard | LOCKED — 7 cross-character flips, Big has 0 (`triestigaard-sweep.json`) |
| Q9 Thirsty/Zatlap | LOCKED — 12 corrections incl. 2 Big Ass (`thirsty-sweep.json`) |
| Q10 four-name hot spot | LOCKED — Stoere→Stevige, Trap→Stamper, Zieke→Snotje, Harde kept |
| `big-ass-corrections.json` | **GENERATED** — 23 corrections (Q1: 9, Q2: 6 cells, Q3: 10 cells, Q10: 1) |
| **PENDING REVIEW** | **Q1 transformations** — see "Part 11 review checklist" before --apply |
| Dry-run | NOT RUN (openpyxl not installed in active python) |
| --apply | NOT RUN |
| Codex updates | NOT DONE |

### Steps remaining (resume here on remote)

1. **Install openpyxl** in the active python: `pip install openpyxl` (or `py -m pip install openpyxl` on Windows).
2. **Review Q1 transformations** (Part 11 below). Spot-check the 4 trickier cells; flag any to Tom for revision before --apply.
3. Dry-run: `py scripts/editorial/apply-corrections.py data/editorial/big-ass-corrections.json` (Linux/macOS: `python3` instead of `py`).
4. Apply: `py scripts/editorial/apply-corrections.py data/editorial/big-ass-corrections.json --apply`
5. Verify: re-scan xlsx, confirm 0 residual violations on the locked rules. Specifically:
   - 0 occurrences of `'k` (or `'K`, or `da'k`) in Big's lines (ik only)
   - 0 occurrences of bare `nie` in Big's lines (niet only)
   - 0 occurrences of `je` / `jij` / `jou` / `jouw` in Big's lines (ge/gij dominant; `jullie` excepted)
6. **Update codex** at `data/json/codex_verified.json`:
   - Update Big Ass entry: `pronounForm: "ge/gij"`, `note` rewritten to reflect post-pass reality
   - Add Phase-C flattened fields per Trusty/Slow precedent (`pronounsAllowed`, `pronounsForbidden`, `contractionsAllowed`, `contractionsForbidden`, `dialectalMarkersAllowed`, `dialectalMarkersForbidden`, `articleRule`, `negationRule`, `registerExceptions`, `inboundAddressRules`, `editorialPass`). **Note: these are flattened at entry top-level — no nested `voiceRules` wrapper.** The resume Part 2.1 schema with `voiceRules` parent object is *not* how it landed in practice.
   - Bump `lastEditorialPass: "big-ass · 2026-04-28"`
7. Mirror the `codex_verified.json` Big Ass entry into `codex_translations.json` (the live app SSoT). **KNOWN GAP:** Phase-C fields are NOT currently mirrored for Trusty/Slow either — the AI-suggest route (`src/app/api/ai-suggest/route.ts`) only reads legacy fields. Mirroring Big Ass into translations codex without first wiring the route to read Phase-C fields means Big Ass changes won't reach the runtime. **Decide:** mirror anyway (consistent state), or backfill Trusty/Slow first + wire the route.
8. **After Big Ass closes — apply cross-character sweeps:**
   - `py scripts/editorial/apply-corrections.py data/editorial/triestigaard-sweep.json --apply` (7 corrections)
   - `py scripts/editorial/apply-corrections.py data/editorial/thirsty-sweep.json --apply` (12 corrections)
   - Disposition the 18 deferred Oude Zak lines (`oude-zak-sweep.json` `pending_disposition` array — needs Tom's per-line calls before becoming corrections)
9. **Codex follow-ups for other characters:**
   - Sad Ass: add `Triestigaard` to `nicknames`
   - Thirsty Ass: replace `Dorstlap` references with `Zatlap`, retire `Dorstlap`
   - Sick Ass: add `Snotje` to `nicknames` (corpus has 22 hits — codex catch-up)
10. Move to next character (Tom's call on order — suggested by narrative weight, not alphabetical).

---

## Part 11 — Q1 transformation review checklist (pre-apply)

These four Q1 cells in `big-ass-corrections.json` involved judgment calls on the je-family transformation. **Worth a Flemish-ear spot-check before --apply.** If any feel off, edit `proposed_nl` directly in the JSON before running `--apply`.

| ID | Cell | Was | Now | Call made |
|---|---|---|---|---|
| `BA-Q1-3` | E5_CircusMain J43 | *"hoe je klein te doen voelen"* | *"hoe u klein te doen voelen"* | `je` as object → `u`. Sentence is awkward in current NL too — kept structure, just swapped pronoun. |
| `BA-Q1-5` | E5_CircusMain J145 | *"Maak je niet te druk... en je hebt..."* | *"Maak u niet te druk... en ge hebt..."* | First `je` reflexive → `u` (matches u/uw paradigm Q5). Second `je hebt` subject → `ge hebt`. Two transformations in one cell. |
| `BA-Q1-7` | E5_ZooMain J75 | *"zouden we je Snelle Ezel moeten noemen"* | *"zouden we u Snelle Ezel moeten noemen"* | `je` as direct object ("call you Speedy") → `u`. |
| `BA-Q1-8` | E5_ZooMain J213 | *"Je staat ons doen kijken met hoe snel je punten..."* | *"Ge staat ons doen kijken met hoe snel uw punten..."* | First `Je` subject → `Ge`. Second `je punten` possessive → `uw punten`. |

The mechanical Q2/Q3 swaps (nie → niet, 'k → ik, da'k → dat ik) are low-risk find-replace. Q10's three-name swap is locked from session.

---

## Part 12 — Remote pickup quick-start

**Branch:** `am-analysis` · **Last commit before this push:** `d0269c6` (force-add xlsx + orphan CSV).

Files added/changed in this push:
- NEW: `data/editorial/big-ass-corrections.json` — 23 Big Ass corrections (Q1–Q3 + Q10)
- NEW: `data/editorial/oude-zak-sweep.json` — Q7 sweep (1 + 18 deferred)
- NEW: `data/editorial/triestigaard-sweep.json` — Q8 sweep (7 corrections + 13 keeps)
- NEW: `data/editorial/thirsty-sweep.json` — Q9 sweep (12 corrections + 1 deferred flag)
- MODIFIED: `data/editorial/_big-ass-resume-2026-04-27.md` — Q7–Q10 lock blocks, Part 6 fix, current-state header, Part 11 review checklist, Part 12 (this section)

**Open at remote:** read this file end-to-end → install openpyxl → review Part 11 → dry-run → apply → verify → update codex → next character.

**Outstanding ask from Tom (last conversation point before push):** *"Want to spot-check the Q1 cells, or trust the calls and proceed to dry-run?"* — Tom hasn't responded yet. Default if no answer on resume: dry-run first, then ask before --apply.

**Tooling reminder for verification (step 8):**
```python
# After --apply, re-run the scan template above and check Big Ass lines:
import re
big = [e for e in corpus if e['speaker'] == 'Big Ass']
print("'k:", sum(len(re.findall(r"'k(?=\b|\s)", e['nl'] or '')) for e in big))
print("nie (not niet):", sum(len(re.findall(r"\bnie\b(?!t)", e['nl'] or '')) for e in big))
# expect both = 0
```

---

## Part 10 — Quick orientation for a brand-new remote session

If you're a fresh Claude session reading this for the first time:

1. You're in a Next.js translation-helper project. Don't touch `src/` for editorial work. The editorial pass operates on `excels/` directly via Python scripts.
2. `excels/` are the source of truth. Every other dump (CSV, JSONL, JSON-per-episode) is derived and may be stale.
3. The user (Tom) prefers data over interpretation. Don't editorialize. Don't summarize without being asked. Present counts, lines, options. Let him call dispositions.
4. The user (Tom) likes simple, guided questions — one decision at a time, with the relevant evidence inline. Don't dump lots of choices at once.
5. The "voiceRules" schema described in Part 2.1 is aspirational — no character has one yet. When you lock Big Ass, follow that schema.
6. Before changing any xlsx cell, dry-run the corrections JSON through `apply-corrections.py`. The safety gates will save you from overwriting fresh edits.
7. If you find new cross-character implications, flag them but don't sweep — the workflow is one-character-at-a-time.

End of resume file.
