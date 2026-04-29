# AM-FL-TRANS — Project Mission & Operational Rules

**Last updated:** 2026-04-28 · **Branch:** `am-analysis`

**🚨 READ THIS BEFORE the per-character resume file.** Project-wide, across all characters and sessions, on any machine.

---

## 🎯 Mission

Build per-character codex headers that serve as **the most accurate, stringent instructions possible** for the bulk AI-assisted translator (`/api/ai-suggest`).

**The codex IS the specification that drives the AI's per-character translation behavior** (see resume Part 13 for runtime architecture). When this work is complete:

- Every character has a locked voice header in `data/json/codex_verified.json` (Phase-C flat fields)
- Every character's voice is mirrored into `data/json/codex_translations.json` (runtime SSoT)
- `src/app/api/ai-suggest/route.ts` is extended to read Phase-C fields (one-time)
- Bulk auto-translation of remaining + future content produces voice-consistent in-character Flemish-tussentaal Dutch with **no detail eluded**

**Deadline is real and near.** Keep momentum. No perfectionism. Push at session boundaries.

## 📐 Per-character process

Methodology baseline in per-character resume file Part 1. **Full-spectrum corpus analysis** must cover:

- **Pronouns:** subject / object / possessive — ge·gij·u·uw paradigm vs je·jij·jou·jouw vs jullie
- **Negation:** `nie` vs `niet` — count + scope
- **Contractions:** `'k`, `'t`, `da's`, `'em`, `'er`, `ma'`, including uppercase variants and embedded forms (`da'k`, etc.)
- **Flemishisms:** `allez`, `amai`, `godver`, `godverdomme`, `ne`/`nen` articles, `dien`/`diej`, `da`-conjunction
- **Register exceptions:** formal / reverent / intimate / comedic / shouty scopes — when the dominant rule yields
- **Verbal tics, stutter patterns, sound effects** (per character)
- **Address forms (outbound):** how this char calls others — Type A consistent (one canonical form) vs Type B short+long mix (formal+intimate alternation by register)
- **Address forms (inbound):** how others call this char — per-speaker overrides
- **Tone, vocabulary, idioms** — warm/gruff/deadpan/etc.

**Codex schema in practice: flat fields at entry top-level.** NOT nested under `voiceRules`. Trusty + Slow set the precedent. All later characters mirror their shape.

## ⚙️ Operational rules

| Rule | Detail |
|---|---|
| **xlsx writes (--apply)** | Always full feedback — cells touched, before/after, count summary, safety-gate skips. Post-apply re-scan to verify 0 residual violations on locked rules. **No silent writes ever.** |
| **No detail hanging** | Every Q closes. Every flagged irregularity persists somewhere durable (sweep JSON, codex catch-up note, correction rationale). Cross-machine continuity via git push. |
| **Codex is active prompt input** | Editing voice fields = changing AI translation behavior. Not paperwork. See resume Part 13. |
| **Broken-NL repair doctrine (codified 2026-04-28)** | **Always** repair broken NL syntax encountered during a pass — calques, subject-object mismatches, ungrammatical constructions. The pronoun work is the trigger; the cell ships only when the entire line reads natural. Document in correction `rationale` field. Precedent: Big Ass Q1-3, Q1-8. |
| **Engine-tag preservation** | xlsx cells may contain engine tags like `{vpunch=100,0.75}`, `{shake}`, etc. at line start. These are NOT translatable — preserve verbatim across `current_nl` and `proposed_nl`. Snapshot generation may strip them; verify against live xlsx before correcting. Precedent: Big Ass Q10-1 caught by safety gate. |
| **Capitalization rule for sentence-start contractions (codified 2026-04-28)** | When a sentence starts with `'t` or `'k` (kept contractions per a character's rules), **the first letter of the next word is capitalized**. Examples: `'t Was niet op slot.` (not `'t was`). `'k Heb een nieuwe strategie.` (not `'k heb`). Applies anywhere these contractions are sentence-start. |
| **Smart Ass character vocab — Godsamme (codified 2026-04-28)** | Smart Ass uses `Godsamme` as her euphemism for `godverdomme`. When Smart utters `godverdomme` in NL, it becomes `Godsamme`. Capture in her codex `verbalTics` or as a vocab override field. The bare word `verdomme` (without "god" prefix) is a distinct, milder swear and stays unchanged. |
| **Retcons are OK (codified 2026-04-28)** | If a later character pass surfaces a fact that invalidates a past sweep or correction, **amend the past file** — that's expected. Rationale field gets updated, sweep file gets re-applied if needed. Don't preserve known-wrong state to avoid touching past work. |
| **Cross-character flags** | Spotted while working char X → persist to sweep JSON or catch-up list. Do NOT auto-touch other chars (one-char-at-a-time workflow). |
| **Push cadence** | Push to `origin/am-analysis` at session boundaries or before blocking on user input. Don't sit on uncommitted state. |
| **No assumptions on user input** | If user types unexpected content (e.g. preserves a token the rule says to flip), **ask** rather than construct elaborate exception theory. Typos and copy artifacts are more likely than deliberate exceptions. |
| **Surface uncertainty (codified 2026-04-28)** | If you're unsure about a codex field value, a register exception scope, an idiom choice, an outbound/inbound address rule, or any judgment call where you'd otherwise pick a default — **stop and surface it for Tom's eyes before writing.** Show the candidates, the corpus evidence, and your tentative pick. This applies *especially* to the codex authoring step (`codex_verified.json` Phase-C entries) where every field is a directive the AI executes. Better one round-trip than a wrong directive shipped. |
| **Forbidden lists are tight and intentional (codified 2026-04-28)** | `dialectalMarkersForbidden`, `contractionsForbidden`, `pronounsForbidden` should ONLY contain items that are **explicitly Q-locked decisions** OR **fundamentally incompatible with this character's voice/personality** — NOT defensive mirroring of what other characters have. If a character "doesn't naturally use X" but isn't banned from X (X just hasn't appeared in their corpus), **leave X off both lists** (= neutral, AI uses when context fits). The `Allowed` list captures what the character actively uses in voice. The `Forbidden` list captures explicit bans. Anything else is neutral. Lists should be SHORT and intentional, not exhaustive. |
| **AI context constraint — consistency over tone (codified 2026-04-28)** | The bulk AI translator gets the **focus row + a small surrounding window** (`linesBefore`/`linesAfter` from `/api/ai-suggest`). It **cannot reliably discern**: character emotional state, memorial vs casual register, cross-scene continuity, or tone-derived address-form choices. **Default to CONSISTENCY**: one canonical form per address, one canonical contraction policy, one canonical register. Tone-conditional rules (e.g. "use form X when frustrated") are unenforceable and should NOT be encoded into codex fields. Reserve nuance for human review post-bulk; let the AI ship a consistent voice baseline. |
| **Source-mirror rule for character names (codified 2026-04-28)** | When EN uses a character's **full name** ("Smart Ass", "Trusty Ass"), NL uses their **canonical full Dutch** ("Slimme Ezel", "Trouwe Ezel"). When EN uses a **short form** ("Smart", "Trusty"), NL uses the **corresponding Dutch short** ("Slimme", "Trouwe"). This is a project-wide rule, not per-speaker. The AI CAN see the EN form in the focus row, so this is enforceable. **Each target codex entry must carry both forms** (canonical full = `dutch`, canonical short = `dutchShort`). Per-speaker overrides for unique forms (e.g., Nice Ass calling Trusty `Trouwtje`) belong in the target's `inboundAddressRules` field with `from_speaker` + `en_match` regex + `nl_required` shape. |
| **🚨 Line references ALWAYS carry full EN + full NL (codified 2026-04-28)** | **WHENEVER you reference a specific cell/line — in any list, surface, summary, decision prompt, or fix proposal — include the FULL English and FULL Dutch strings.** No truncation. No "(rebuke)" placeholders. No NL excerpts without EN. No EN without NL. Tom needs both to make a decision. Even "simple lists" require both. This applies across every format: bullet lists, tables, numbered lists, prose mentions. **NEVER omit EN/NL when pointing to a line.** Cell ID + EN + NL is the minimum unit. |
| **Deviation surfacing format extended (codified 2026-04-28)** | For surfacing rule violations for decision: full file/sheet/cell · full EN · full NL · rule violated · context · options · pick. For simple lists or status updates: full file/sheet/cell · full EN · full NL minimum. |
| **Don't misattribute discoveries (codified 2026-04-28)** | If a corpus scan or grep surfaced a finding, say "I spotted X." If Tom flagged something, say "you spotted X." Do not falsely attribute discoveries to the user — credit accuracy matters for trust. |
| **Deviation kept = bulkTranslateExclusions (codified 2026-04-28)** | When Tom decides to keep a rule deviation rather than amend, encode it in the speaker's `bulkTranslateExclusions` field on their codex entry: `[{"cell": "<sheet> <cell>", "note": "bulk translate will not alter — <one-line reason>"}]`. Simple. The bulk-translate route should skip these cells. Don't invent more complex schemas (no `outboundAddressForms`, no per-speaker override fields) for one-off deviations. |
| **Flemish exclamations/curses are project-acceptable (codified 2026-04-28)** | Markers like `allez`, `amai`, `godver`, `godverdomme`, `kak`, `hela`, `verdomme`, etc. are **Flemish-coded but project-acceptable across most characters when they fit the moment**. They MUST NOT default into any forbidden list. A character only forbids these if their voice/personality fundamentally rejects them (e.g., Smart Ass speaks zero-density ABN, so cursing in Flemish would break voice). Default for any new character: **omit these from both Allowed and Forbidden** (= neutral, AI uses when context calls). |
| **Structural dialectal markers are different** | Markers like `nie`, `ne`/`nen` (Flemish articles), `da (conj)`, `dienen`/`dien`/`diej` (archaic demonstratives) are **structural** to a character's grammar, not exclamatory. These are fair game for `dialectalMarkersForbidden` based on the character's `articleRule`/`negationRule`/density. A light/zero-density character using `niet`-only correctly forbids `nie`; not the same as forbidding a curse word. |

## 📊 Editorial scope (state as of 2026-04-28)

**14 main cast characters** + Foal (canonical `{$NewName}`).

| State | Count | Characters |
|---|---|---|
| ✅ Locked (Phase-C `editorialPass` flag set in `codex_verified.json`) | 2 | Trusty Ass · Slow Ass |
| 🟡 In progress (decisions locked, corrections JSON ready, not yet applied) | 1 | **Big Ass** |
| 🔲 Not started | 11 | Bad · Hard · Kick · Lazy · Nice · Old · Sad · Sick · Smart · Sturdy · Thirsty |
| ❓ Special | 1 | Foal — canonical `{$NewName}` placeholder. **Verify voice profile location before pass** (not in `codex_verified.json` 14-entry list). |

**Cross-character work outstanding (post-each-pass):**
- Oude Zak: 18 deferred per-line dispositions (`oude-zak-sweep.json`)
- Triestigaard codex catch-up: add to Sad Ass nicknames (corpus-canon, 20 hits)
- Zatlap rollout: replace `Dorstlap` for Thirsty Ass (`thirsty-sweep.json`, 12 corrections)
- Snotje codex catch-up: add to Sick Ass nicknames (22 corpus hits — codex didn't carry)
- Trouwe Zak deprecation: already swept; periodic re-verify

## 🔗 Quick reference

| Asset | Purpose |
|---|---|
| Per-character live state | `data/editorial/_<char>-resume-*.md` |
| Per-character corrections | `data/editorial/<char>-corrections.json` |
| Cross-character sweeps | `data/editorial/<rule>-sweep.json` |
| Codex runtime architecture | Resume Part 13 (per-character resume file) |
| Methodology | Resume Part 1 |
| Apply tool | `scripts/editorial/apply-corrections.py` (dry-run default; `--apply` writes) |
| Live xlsx (LOCAL ONLY — gitignored) | `excels/*.xlsx` |
| Snapshots (committed, drift-prone) | `data/editorial/_<char>-live-*.json`, `_full-corpus-*.json` |

---

End of project mission file. **Read this before the per-character resume.**
