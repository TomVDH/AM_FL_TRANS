# E6 batch — full source + remote read + proposed fix

_Read at: 2026-05-12 21:35:19 PDT (live remote, throttled)_
_Spreadsheet: `6_asses.masses_E6Proxy` (id `1_56yhltRDywIj1WpCP4nJAMjaBmFVC42fSwXMj2W0uU`)_
_Cells in batch: 15 • Fixes encoded: 15_

**Notes on the batch:**
- Deep-eyeball flagged `J20 / J33` for the Endure inconsistency, but in current xlsx the Endure pair is **J18 + J33** (J20 is a different cell — `Lick Wounds`). Both inconsistency pairs surfaced below.
- 4 cells marked SKIP/KEEP candidates: J40 BadCave (already capped) + J209 World (Flemish ✓ confirmed).
- 4 cells require Tom-call decisions (cross-cell consistency direction or word-choice picks).

## E6_BadCave_localization

### J24

- **Drift:** game-name \`Stenen-spel\` non-canonical — should be \`Keien-Spel\` `mechanical`
- **Canon:** `§8 game-system terms`
- **Key (col A):**  `SAY.Dialog:Dongle.114.{$NewName}`
- **Desc (col B):** `∅`
- **EN (col C):**   `She still thinks we are playing 'Rocks' down here everyday...`
- **Current NL (col J, live remote):**
    `Ze denkt nog steeds dat we hier elke dag 'Stenen-spel' aan het spelen zijn...`
- **Proposed NL:**
    `Ze denkt nog steeds dat we hier elke dag 'Keien-Spel' aan het spelen zijn...`
- **Note:** Same drift as E3_Mine1F (×5), E3_BadCave (×1), E9_BadCave (×1) — cross-corpus pattern. Canonicalize via §8.

### J38

- **Drift:** §7.3 game-system \`Mensen\` lowercase in philosophical Bad Ass context `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:Dongle.79.Bad Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `A place for the people.`
- **Current NL (col J, live remote):**
    `Een plek voor de mensen.`
- **Proposed NL:**
    `Een plek voor de Mensen.`

### J39

- **Drift:** §7.3 game-system \`Mensen\` lowercase in philosophical Bad Ass context `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:Dongle.85.Bad Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Intelligent people.`
- **Current NL (col J, live remote):**
    `Intelligente mensen.`
- **Proposed NL:**
    `Intelligente Mensen.`

### J40

- **Drift:** flagged for inconsistency context (J38/J39 lc, J40 cap) — J40 already capped `[VERIFY]`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:Dongle.80.Bad Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `People collectively dedicated to inventing beautiful things that will make the world a better place for everyone...`
- **Current NL (col J, live remote):**
    `Mensen die zich collectief inzetten om schone dingen uit te vinden die de wereld een betere plek maken voor iedereen...`
- **Proposed NL:** _no transform — skip/keep_
- **Note:** Per deep-eyeball: "J40 has `Mensen` cap, J38/J39 lowercase — inconsistency too" — J40 is the **correct** form. No change needed; fixing J38/J39 brings them up to J40. **Recommend SKIP.**

## E6_BattleHard_localization

### J18

- **Context-only row** (paired with another DRIFT cell — shown for cross-cell comparison)
- **Key (col A):**  `WRITE.DialogLocalizer.49`
- **Desc (col B):** `Player Attack.`
- **EN (col C):**   `Endure`
- **Current NL (col J, live remote):**
    `Verduren`

### J20

- **Drift:** cross-cell case-mismatch on \`Lick Wounds\`: J20 \`Wonden likken\` vs J38 \`Wonden Likken\` `[VERIFY]`
- **Canon:** `§6.7 cross-cell consistency`
- **Key (col A):**  `WRITE.DialogLocalizer.50`
- **Desc (col B):** `Player Attack.`
- **EN (col C):**   `Lick Wounds`
- **Current NL (col J, live remote):**
    `Wonden likken`
- **Proposed NL:**
    `Wonden Likken`
- **Note:** Both J20 and J38 translate the EN game-skill `Lick Wounds`. Title-case (Wonden Likken) matches "Player Attack" UI convention used elsewhere; lower-case (Wonden likken) is also defensible. **Tom call: which form do we unify both to?** Default proposed: Wonden Likken (match J38).

### J33

- **Drift:** cross-cell inconsistency on \`Endure\`: J18 \`Verduren\` vs J33 \`Volharden\` `[VERIFY]`
- **Canon:** `§6.7 cross-cell consistency`
- **Key (col A):**  `WRITE.DialogLocalizer.10`
- **Desc (col B):** `Attack. (Raise Defense)`
- **EN (col C):**   `Endure`
- **Current NL (col J, live remote):**
    `Volharden`
- **Proposed NL:**
    `Verduren`
- **Note:** Same EN `Endure` translated two different ways. `Verduren` = endure/bear (passive), `Volharden` = persevere (active). The "Raise Defense" mechanic suggests passive→`Verduren`; J18 also uses `Verduren`. **Tom call: which form?** Default proposed: Verduren (unify on J18). Or flip — set J18 to Volharden.

### J38

- **Context-only row** (paired with another DRIFT cell — shown for cross-cell comparison)
- **Key (col A):**  `WRITE.DialogLocalizer.15`
- **Desc (col B):** `Attack.`
- **EN (col C):**   `Lick Wounds`
- **Current NL (col J, live remote):**
    `Wonden Likken`

## E6_Nightmare_localization

### J3

- **Drift:** d/t spelling — 3rd person sg passive: \`word\` → \`wordt\` `mechanical`
- **Canon:** `Dutch spelling (d/t rule)`
- **Key (col A):**  `SAY.Dialog:Jenny_Intro.20.Miner Jenny`
- **Desc (col B):** `Hard Ass wakes up to a hit on the head via Jenny.`
- **EN (col C):**   `No sleeping on the job you useless donkey!`
- **Current NL (col J, live remote):**
    `Er word niet op het werk geslapen, nutteloze Ezel!`
- **Proposed NL:**
    `Er wordt niet op het werk geslapen, nutteloze Ezel!`

## E6_World_localization

### J75

- **Drift:** mistranslation — \`gesteld\` = stipulated/composed (legal/formal), not "FINE" `[VERIFY]`
- **Canon:** `§13 mistranslation`
- **Key (col A):**  `SAY.Dialog:EnterTheTheatre.103.{$NewName}`
- **Desc (col B):** `Jump to line x.`
- **EN (col C):**   `I'm FINE MOTHER!`
- **Current NL (col J, live remote):**
    `Ik ben GESTELD MOEDER!`
- **Proposed NL:**
    `Ik ben PRIMA MOEDER!`
- **Note:** EN "I'm FINE MOTHER!" — Foal's annoyed teen-shout. Alternates: `PRIMA` (most idiomatic), `IN ORDE`, `GOED`. **Tom call: which? Default proposed: PRIMA.**

### J188

- **Drift:** adj-agreement — de-word \`tijd\` requires adj-e ending `mechanical`
- **Canon:** `Dutch grammar`
- **Key (col A):**  `SAY.Dialog:Sad.26.Sturdy Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `I'm trying to spend quality time with {$NewName}, but she's growing up too fast.`
- **Current NL (col J, live remote):**
    `Ik probeer nog wat mooi tijd door te brengen met {$NewName}, maar ze groeit veel te snel op.`
- **Proposed NL:**
    `Ik probeer nog wat mooie tijd door te brengen met {$NewName}, maar ze groeit veel te snel op.`

### J196

- **Drift:** missing accent — \`Cafe\` → \`Café\` `mechanical`
- **Canon:** `Dutch orthography`
- **Key (col A):**  `SAY.Dialog_Thirsty.44.Thirsty Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Tonight, The Bottoms Up Bar is finally openin'!`
- **Current NL (col J, live remote):**
    `Vanavond gaat De Zatten Ezel Cafe eindelijk open, héé!`
- **Proposed NL:**
    `Vanavond gaat De Zatten Ezel Café eindelijk open, héé!`
- **Note:** Same drift as E3_BadCave J82 and E6_World J206. `Café` is loanword from French with accent preserved in standard Dutch.

### J197

- **Drift:** multi-issue: \`verdomse\` → \`verdomde\` + missing translation of "share some good 'ol water" + word-order awkward + \`gedoeme\` → \`godverdomme\` `[VERIFY]`
- **Canon:** `Dutch grammar + §13 mistranslation`
- **Key (col A):**  `SAY.Dialog_Thirsty.50.Thirsty Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Always been my darn DREAM to have a place for us Asses to take a break and share some good 'ol water.`
- **Current NL (col J, live remote):**
    `'t Is altijd al mijn verdomse DROOM geweest om een plekske waar Ezels efkes kunnen pauzeren open te doen, gedoeme.`
- **Proposed NL:**
    `'t Is altijd al mijn verdomde DROOM geweest om een plekske open te doen waar Ezels efkes kunnen pauzeren en wa goe ouw water kunnen delen, godverdomme.`
- **Note:** Three issues compounded:
1. `verdomse` is not a word — `verdomde` (the adj/intensifier) is correct.
2. Word-order `om een plekske waar Ezels efkes kunnen pauzeren open te doen` is awkward — verbs separated by long subclause. Inversion `om een plekske open te doen waar Ezels efkes kunnen pauzeren` reads naturally.
3. `gedoeme` is a non-standard contraction; `godverdomme` or `godver` standard.
4. EN says "and share some good 'ol water" — currently untranslated in NL. Proposed adds `en wa goe ouw water kunnen delen` (Flemish register).

**Significant rewrite — Tom call needed.** Alternates: keep `gedoeme` for character flavor (Thirsty's slurred speech); skip the water-share addition; use `godver` instead of `godverdomme`.

### J206

- **Drift:** missing accent — \`CAFE\` → \`CAFÉ\` `mechanical`
- **Canon:** `Dutch orthography`
- **Key (col A):**  `SAY.Dialog_Thirsty.90.Thirsty Ass`
- **Desc (col B):** `Jump to line x.`
- **EN (col C):**   `Well heck Comrade, that's exactly why I'm openin' my BAR!`
- **Current NL (col J, live remote):**
    `Awel godver Kameraad, da's precies daarom dadde ik mijn CAFE open, héé!`
- **Proposed NL:**
    `Awel godver Kameraad, da's precies daarom dadde ik mijn CAFÉ open, héé!`
- **Note:** Same accent fix as J196. Caps version preserves É per Dutch convention.

### J209

- **Drift:** flagged as DRIFT but deep-eyeball concluded \`dezen ouwen emmer\` is fine Flemish dialect `[VERIFY]`
- **Canon:** `§5.2 register`
- **Key (col A):**  `SAY.Dialog_Thirsty.73.Thirsty Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Maybe you can do somethin' with this ol' bucket... It's got a hole in it.`
- **Current NL (col J, live remote):**
    `Misschien kunde gij iets doen met dezen ouwen emmer, héé... Er zit een gat in.`
- **Proposed NL:** _no transform — skip/keep_
- **Note:** Per deep-eyeball: "`dezen ouwen emmer` is fine Flemish dialect (masc article + adj agreement). ✓" — **Recommend SKIP / KEEP.** Listed for completeness.

### J260

- **Drift:** past participle d/t — \`sjokken\` root in k → -t, not -d `mechanical`
- **Canon:** `Dutch spelling (d/t rule, kofschip)`
- **Key (col A):**  `SAY.Dialog:BottomsUpOpening.239.Sturdy Ass`
- **Desc (col B):** `Branch 1.2. Slow Ass went to the Zoo.`
- **EN (col C):**   `Slow Ass? Why have you come crawling back here?`
- **Current NL (col J, live remote):**
    `Slome Ezel? Waarom kom je hier terug aangesjokd?`
- **Proposed NL:**
    `Slome Ezel? Waarom kom je hier terug aangesjokt?`

### J292

- **Drift:** stutter consonant mismatch — \`B-B-VERRADEN\` stutters B before V-starting verb `[VERIFY]`
- **Canon:** `§12.3 Slow stutter pattern`
- **Key (col A):**  `SAY.Dialog:BottomsUpOpening.397.Slow Ass`
- **Desc (col B):** `Jump to line y.`
- **EN (col C):**   `Our B-Boss, Zookeep-per Rose, B-BETRAYED US!`
- **Current NL (col J, live remote):**
    `Onze B-B-Baas, Dierendokter D-D-Dina, heeft ons B-B-VERRADEN!`
- **Proposed NL:**
    `Onze B-B-Baas, Dierendokter D-D-Dina, heeft ons V-V-VERRADEN!`
- **Note:** Slow Ass stutter rule: stutter on the leading consonant of the actual word. NL verb is `verraden` → V-V-VERRADEN. EN `B-BETRAYED` stutters on B because EN word starts with B; NL stutter should follow the NL word, not the EN. **Tom call: keep B-B (mimic EN pattern) or fix to V-V (follow NL word)?**

---

**Total cells rendered: 17** (15 DRIFT + 2 partner-context rows)

## Sign-off shape

- `all` — apply 11 mechanical + decisions on 4 verifies
- `mechanical only` — apply 8 mechanical, defer 7 verify/skip
- per-cell — quote `J<row>` to override or skip

## Decisions needed (Tom)

1. **BattleHard Endure pair (J18/J33):** unify to `Verduren` (default) or `Volharden`?
2. **BattleHard Lick Wounds pair (J20/J38):** unify to `Wonden Likken` (default, title-case) or `Wonden likken`?
3. **World J75 GESTELD MOEDER:** `PRIMA` (default) / `IN ORDE` / `GOED`?
4. **World J197 verdomse rewrite:** full rewrite (default) or partial (just fix `verdomse`)?
5. **World J292 B-B-VERRADEN stutter:** flip to `V-V-VERRADEN` (default per §12.3) or keep `B-B` (mimic EN)?