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
| **Broken-NL repair doctrine** | When original NL is broken syntax (calques, subject-object mismatch), rewrite the cell beyond pronoun scope — don't ship known-broken to runtime. Q1-3 + Q1-8 precedent in Big Ass pass. |
| **Cross-character flags** | Spotted while working char X → persist to sweep JSON or catch-up list. Do NOT auto-touch other chars (one-char-at-a-time workflow). |
| **Push cadence** | Push to `origin/am-analysis` at session boundaries or before blocking on user input. Don't sit on uncommitted state. |
| **No assumptions on user input** | If user types unexpected content (e.g. preserves a token the rule says to flip), **ask** rather than construct elaborate exception theory. Typos and copy artifacts are more likely than deliberate exceptions. |

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
