# Combined E10 + E3 batch — full source + remote read + proposed fix

_Read at: 2026-05-12 21:58:49 PDT (live remote, throttled — two spreadsheets)_
_Cells in batch: 17 (E10: 9 / E3: 8) • Fixes encoded: 17_

**Workflow note:** combined propose doc, separate apply/push/audit/commit cycles per-episode.

---

# E10

_Spreadsheet: `10_asses.masses_E10Proxy` (id `1Q1WSEJSGm9ZPEO6bfDNpX8wqXolFhyGad-17rJzc0nw`)_

## E10_Government_localization

### J47

- **Drift:** game-name \`STENEN-SPEL\` non-canonical — should be \`KEIEN-SPEL\` `mechanical`
- **Canon:** `§8 game-system terms`
- **Key (col A):**  `SAY.Dialog:Occupation.480.{$NewName}`
- **Desc (col B):** `∅`
- **EN (col C):**   `"Anyone want to play ROCKS?"`
- **Current NL (col J, live remote):**
    `"Heeft iemand zin om STENEN-SPEL te spelen?"`
- **Proposed NL:**
    `"Heeft iemand zin om KEIEN-SPEL te spelen?"`
- **Note:** Cross-corpus pattern (E3_Mine1F ×5, E3_BadCave ×1, E6_BadCave fixed, E9_BadCave ×1). Caps preserved per chant register.

### J68

- **Drift:** §3.1 place name — \`Muilegem\` is non-canonical, canon locks \`Muilenbeek\` `mechanical`
- **Canon:** `§3.1`
- **Key (col A):**  `SAY.Dialog:Occupation.526.Cole-Machine`
- **Desc (col B):** `∅`
- **EN (col C):**   `Nice Ass? Of course the Fannyside idiots would be here...`
- **Current NL (col J, live remote):**
    `Lieve Ezel? Natuurlijk dat die idioten van Muilegem hier zouden zijn...`
- **Proposed NL:**
    `Lieve Ezel? Natuurlijk dat die idioten van Muilenbeek hier zouden zijn...`
- **Note:** Canon §3.1 lock: Fannyside → Muilenbeek (with -n-). `Muilegem` matches no canon entry — likely typo/blend.

### J100

- **Drift:** §3.1 place name — \`Muilegem\` is non-canonical, canon locks \`Muilenbeek\` `mechanical`
- **Canon:** `§3.1`
- **Key (col A):**  `SAY.Dialog:Hard_3.10.Hard Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Tell the Humans to respect the borders of our territory in Fannyside.`
- **Current NL (col J, live remote):**
    `Zeg de Mensen dat ze de grenzen van ons territorium in Muilegem moeten respecteren.`
- **Proposed NL:**
    `Zeg de Mensen dat ze de grenzen van ons territorium in Muilenbeek moeten respecteren.`
- **Note:** Mirror of J68 — same drift, same fix.

### J110

- **Drift:** canon §1 v3.5 sync — \`Poepegaatje\` obsolete moniker, now \`De Zatten Ezel\` `mechanical`
- **Canon:** `§1 Q9 / v3.5 codex`
- **Key (col A):**  `SAY.Dialog:Thirsty_4.10.Thirsty Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Tell the Humans that we want to run our own businesses, like the Bottoms Up Bar!`
- **Current NL (col J, live remote):**
    `Zeg tegen de Mensen dat wij onze eigen zaakjes willen runnen, zoals het Poepegaatje, héé!`
- **Proposed NL:**
    `Zeg tegen de Mensen dat wij onze eigen zaakjes willen runnen, zoals De Zatten Ezel, héé!`
- **Note:** Per codex v3.5: Thirsty Ass bar `Poepegaatje (Bottom's Up)` → `De Zatten Ezel`. Same translator who used `De Zatten Ezel` in E3_BadCave J82 and E6_World J196 reverted here.

### J154

- **Drift:** §7.3 game-system \`Mensen\` lowercase `mechanical`
- **Canon:** `§7.3`
- **Key (col A):**  `SAY.Dialog:Gaunt_8.10.Gaunt Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Tell the Humans that if they don't cede us territory, we will kill their children.`
- **Current NL (col J, live remote):**
    `Als de mensen ons geen grondgebied afstaan, zullen we hun kinderen doden.`
- **Proposed NL:**
    `Als de Mensen ons geen grondgebied afstaan, zullen we hun kinderen doden.`

## E10_ProphetSpeech_localization

### J56

- **Drift:** spelling typo — \`kameraaden\` (double-a) should be \`kameraden\` `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `SAY.Flowchart:Dialog.911.Cole-Machine`
- **Desc (col B):** `∅`
- **EN (col C):**   `Yet, all of us here, both Humans and donkeys, are rational beings.`
- **Current NL (col J, live remote):**
    `Toch zijn wij hier allemaal, zowel Mensen als Ezels, rationele wezens, kameraaden.`
- **Proposed NL:**
    `Toch zijn wij hier allemaal, zowel Mensen als Ezels, rationele wezens, kameraden.`

### J81

- **Drift:** wrong verb form — EN imperative \`THROW OUT\`, NL past-participle \`BUITENGEGOOID\` reads as "Thrown out with our leaders" `[VERIFY]`
- **Canon:** `Dutch grammar (imperative vs ptcp)`
- **Key (col A):**  `SAY.Flowchart:Dialog.956.Cole-Machine`
- **Desc (col B):** `Jump to line 82.`
- **EN (col C):**   `THROW OUT OUR LEADERS—`
- **Current NL (col J, live remote):**
    `BUITENGEGOOID MET ONZE LEIDERS—`
- **Proposed NL:**
    `WEG MET ONZE LEIDERS—`
- **Note:** Speaker: Cole-Machine (manifesto chant). Options:
   - `WEG MET ONZE LEIDERS!` (default — common Dutch protest chant idiom)
   - `GOOI ONZE LEIDERS BUITEN!` (literal je/jij imperative)
   - `BUITEN MET ONZE LEIDERS!` (chant-rhythm variant)
   - `WERPT ONZE LEIDERS BUITEN!` (ge/gij imperative — Cole register?)
   **Tom call: which form?** Default proposed: `WEG MET ONZE LEIDERS—`.

### J110

- **Drift:** cross-cell EN: same line as J112 (\`DON'T BE SCARED!\`), different speakers, different NL — J110 Big Ass: \`WEES NIET BANG!\` (neutral) `[VERIFY]`
- **Canon:** `§6.7 cross-cell consistency`
- **Key (col A):**  `SAY.Flowchart:Dialog.1150.Big Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `DON'T BE SCARED!`
- **Current NL (col J, live remote):**
    `WEES NIET BANG!`
- **Proposed NL:** _no transform — keep current (verify-only)_
- **Note:** Paired with J112 (Hard Ass: `GEEN MIETJE ZIJN!`). Speaker-differentiated registers: Big = literal neutral; Hard = tough-guy ("don't be a sissy"). §6.7 wants chant uniformity, but speaker voicing justifies divergence. **Tom call: unify or keep speaker-differentiated?** Default proposed: KEEP both (speaker-distinct).

### J112

- **Drift:** cross-cell EN: same line as J110, J112 Hard Ass: \`GEEN MIETJE ZIJN!\` (tough-guy register) `[VERIFY]`
- **Canon:** `§6.7 cross-cell consistency`
- **Key (col A):**  `SAY.Flowchart:Dialog.1162.Hard Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `DON'T BE SCARED!`
- **Current NL (col J, live remote):**
    `GEEN MIETJE ZIJN!`
- **Proposed NL:** _no transform — keep current (verify-only)_
- **Note:** Paired with J110 (Big Ass: `WEES NIET BANG!`). See J110 note. **Default proposed: KEEP both.**

---

# E3

_Spreadsheet: `3_asses.masses_E3Proxy` (id `1dPFzn_FCcmgLx8HuuMcxBa4X29ixYnlbNqNkcVN95yY`)_

## E3_100_localization

### J6

- **Drift:** incomplete translation — street name \`Esmasses\` (an \`asses\`-anagram) dropped, leaving \`455 ,\` orphan-empty `[VERIFY]`
- **Canon:** `§13 mistranslation / completeness`
- **Key (col A):**  `WRITE.Dialog:LogLocalizer.1`
- **Desc (col B):** `Butte's Log (Journal Entry) ⏎ With founding year`
- **EN (col C):**   `Hugh G. Butte\nButte Industry\nCoal Mines\n(Est. 1867)\n\nIf found, please return to\n455 Esmasses,\nButte Mines #2`
- **Current NL (col J, live remote):**
    `Egbert K.\nVanscheetvelde\nKolen & Industrie\n(Opgericht 1867)\n\nIndien gevonden, gelieve terug te bezorgen aan\n455 ,\nVanscheetvelde Mijnen`
- **Proposed NL:**
    `Egbert K.\nVanscheetvelde\nKolen & Industrie\n(Opgericht 1867)\n\nIndien gevonden, gelieve terug te bezorgen aan\n455 Ezelmassa,\nVanscheetvelde Mijnen`
- **Note:** EN `Esmasses` is wordplay on `Asses` reversed-ish + `masses` = project title `Asses, Masses`. NL needs a Flemish street-name equivalent honoring the wordplay. Options:
   - `Ezelmassa` (default — direct port of project title compound)
   - `Massa-Ezelstraat` (street-suffix)
   - `Klotegem` (existing canon village — but it's a village, not a street)
   - `Muilenbeek` (canon §3.1 — also a place, not a street)
   - `Ezelse Massa` (preserving article structure)
   **Tom call: which street-name play?** Default proposed: `Ezelmassa`.

## E3_200_localization

### J4

- **Drift:** capitalization mid-sentence — \`Ik Had\` should be \`Ik had\` (lowercase after \`Ik\`) `mechanical`
- **Canon:** `Dutch capitalization`
- **Key (col A):**  `WRITE.Dialog:LogLocalizer.2`
- **Desc (col B):** `Butte's Log (Journal Entry)`
- **EN (col C):**   `July 24th\nButte Mine is officially for sale. I'm praying that someone from Mecha City will step up and buy it. I always imagined that Cole would take my place, but...\n\nThis place has to survive, somehow, but it's hard to let go of what you love.`
- **Current NL (col J, live remote):**
    `24 juli\nVanscheetvelde Kolen & Industrie staat officieel te koop. Ik hoop dat iemand van Technopolis het zal kopen. Ik Had altijd gedacht dat Piet mijn plaats zou innemen, maar...\n\nDeze plek moet overleven, op één of andere manier, maar het is moeilijk om los te laten wat ge graag ziet.`
- **Proposed NL:**
    `24 juli\nVanscheetvelde Kolen & Industrie staat officieel te koop. Ik hoop dat iemand van Technopolis het zal kopen. Ik had altijd gedacht dat Piet mijn plaats zou innemen, maar...\n\nDeze plek moet overleven, op één of andere manier, maar het is moeilijk om los te laten wat ge graag ziet.`

## E3_EpisodeTitle_localization

### J3

- **Drift:** spelling typo — \`AFLVERING\` should be \`AFLEVERING\` (missing E) `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `WRITE.Dialog:Localizer.5`
- **Desc (col B):** `Title text on screen`
- **EN (col C):**   `EPISODE THREE`
- **Current NL (col J, live remote):**
    `AFLVERING DRIE`
- **Proposed NL:**
    `AFLEVERING DRIE`

## E3_LazysGrave_localization

### J28

- **Drift:** wrong object — EN dialogue \`Hey, nice look.\` refers (per DESC) to the Foal's helmet; NL \`schoon petje\` = "nice cap" `[VERIFY]`
- **Canon:** `§13 mistranslation`
- **Key (col A):**  `SAY.Dialog:Hat.1.Lazy Ass`
- **Desc (col B):** `The Foal finds a hard helmet on a rock.`
- **EN (col C):**   `Hey, nice look.`
- **Current NL (col J, live remote):**
    `Hey, schoon petje.`
- **Proposed NL:**
    `Hey, schone helm.`
- **Note:** Speaker: Lazy Ass (ghost). EN `Hey, nice look.` doesn't literally contain `helmet` — it's a paraphrase commenting on the Foal's helmet-wearing. Adjacent J29 uses `helm` correctly. Options:
   - `schone helm` (default — matches J29, EN intent)
   - `schoon petje` keep (loose colloquial; `petje` can mean head-covering)
   - `mooie helm` (alt adj)
   **Tom call: fix to helm or keep petje?** Default proposed: `schone helm`.

## E3_Mine1FOpening_localization

### J3

- **Drift:** spelling typo — \`kloteweeer\` (triple-e) should be \`kloteweer\` `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `SAY.Dialog:ScavengersReturn.116.{$NewName}`
- **Desc (col B):** `The screen fades up from black to reveal Sturdy listening to the Foal (her now-born daughter).`
- **EN (col C):**   `Comrade Mother, will this crappy weather ever end?`
- **Current NL (col J, live remote):**
    `Kameraad Moeder, gaat dit kloteweeer ooit nog stoppen?`
- **Proposed NL:**
    `Kameraad Moeder, gaat dit kloteweer ooit nog stoppen?`

### J33

- **Drift:** non-existent word — \`ratioenen\` should be \`rantsoenen\` (rations) `mechanical`
- **Canon:** `Dutch spelling / wrong-word`
- **Key (col A):**  `SAY.Dialog:ScavengersReturn.347.Sturdy Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `Smart Ass, divide the rations.`
- **Current NL (col J, live remote):**
    `Slimme Ezel, verdeel de ratioenen.`
- **Proposed NL:**
    `Slimme Ezel, verdeel de rantsoenen.`

## E3_Mine1F_localization

### J53

- **Drift:** spelling typo — \`rotsbloki\` not a word, should be \`rotsblokje\` (diminutive) `mechanical`
- **Canon:** `Dutch spelling`
- **Key (col A):**  `SAY.Dialog:ThirstyBig_Public.73.Big Ass`
- **Desc (col B):** `Jump to dialogue options, lines 55, 59, or 62.`
- **EN (col C):**   `We're just moving this boulder in case the flood starts to come any closer.`
- **Current NL (col J, live remote):**
    `We zijn dit rotsbloki aan 't verleggen, voor als de vloed nog dichter komt.`
- **Proposed NL:**
    `We zijn dit rotsblokje aan 't verleggen, voor als de vloed nog dichter komt.`

### J82

- **Drift:** missing accent — \`Cafe\` → \`Café\` `mechanical`
- **Canon:** `Dutch orthography`
- **Key (col A):**  `SAY.Dialog:TunnelBigThirstyPrivate.15.Thirsty Ass`
- **Desc (col B):** `∅`
- **EN (col C):**   `I’d call it... Bottoms Up!`
- **Current NL (col J, live remote):**
    `Ik zou 't noemen... De Zatten Ezel Cafe!`
- **Proposed NL:**
    `Ik zou 't noemen... De Zatten Ezel Café!`
- **Note:** Same drift as E6_World J196/J206 (fixed). Consider also Café-prefix venue convention: `Café De Zatten Ezel` (Tom's E6 choice). **Tom call: prefix Café (Café De Zatten Ezel) or just accent (De Zatten Ezel Café)?** Default proposed: accent only.

---

**Total cells rendered: 17**

## Sign-off shape

- `all` — apply 11 mechanical + decisions on 6 verifies
- `mechanical only` — apply 11 mechanical, defer 6 verify
- per-cell — quote `E10 J<row>` / `E3 J<row>` to override or skip

## Decisions needed (Tom)

1. **E10 ProphetSpeech J81** `BUITENGEGOOID MET ONZE LEIDERS—` → `WEG MET ONZE LEIDERS—` (default chant) / `GOOI ONZE LEIDERS BUITEN—` (literal je/jij) / `WERPT ONZE LEIDERS BUITEN—` (ge/gij) / other?
2. **E10 ProphetSpeech J110/J112** DON'T BE SCARED pair — unify or keep speaker-differentiated (Big=`WEES NIET BANG!` / Hard=`GEEN MIETJE ZIJN!`)?
3. **E3 Mine1F J82** `De Zatten Ezel Cafe!` → `De Zatten Ezel Café!` (accent only — default) or `Café De Zatten Ezel!` (prefix Café, matching E6 convention)?
4. **E3 100 J6** address street name — `Ezelmassa` (default — project-title port) / `Massa-Ezelstraat` / other Flemish street-name play on Esmasses?
5. **E3 LazysGrave J28** `schoon petje` → `schone helm` (match J29 + EN intent — default) or keep `petje` (loose colloquial)?