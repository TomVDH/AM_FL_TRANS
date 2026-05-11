# Consistency Audit: E11 / NonCSV (Opus)
**File:** `data/csv/11_asses.masses_NonCSVBasedTranslations.csv`
**Status:** STASHED (Pending Review)
**Generated:** 2026-05-10 by Opus full-scan
**Sheets covered:** 12 (Other Translations, E10_Words_{English/Korean/Japanese/Espanol/French/Portuguese/Italian/German/Turkish/Catalan}, FONT Tracker)
**Cells flagged:** ~52 cells across 2 critical buckets

> ⚠️ **CRITICAL FINDING.** This file was largely overlooked in the corpus audit cycle because it's CSV (not xlsx). The "TranslatedDutch" column for ~50 sign/prop items in "Other Translations" is filled with **ITALIAN content** (not Dutch). Either the pipeline used Italian as fallback when Dutch was missing, or the sheet was mistranscribed. **Every entry needs Dutch translation per locked canon.**
>
> Additionally: there is **NO `E10_Words_Dutch` sheet** alongside the 9 other languages. Dutch entries for "the spark", "the inevitable", "the Machine Prophet", "and the asses from Fannyside" are missing entirely.

---

## Bucket A: "Other Translations" sheet — signs, props, brand text (~50 cells)

All currently in Italian; need Dutch versions. Below is the full list with **proposed NL** based on locked canon (Muilenbeek/Klotegem/Technopolis/Derriere/Machien/etc.).

### Farm + Stable signage

| Row | Context | EN | Current "NL" (actually Italian) | Proposed NL | Rationale |
|---|---|---|---|---|---|
| 6 | — | Foal Name Controller | `asina` | `ezel` (or N/A — verify if controller name needs translation) | Code reference, not user-facing |
| 7 | Farm | Sign_FannysideFlour | `Farine Culonia` | `Bloem van Muilenbeek` | Place: Fannyside → Muilenbeek; "Flour" → "Bloem" |
| 8 | Farm | Sign_FannysideFlourBurned | `Farine Culonia` | `Bloem van Muilenbeek` (burned variant — same text) | Same |
| 9 | Stable2f | Inelligble Foal Names | (empty) | (intentionally empty? — verify) | Asset config |
| 10 | TheProtest | Sign_BumpkinVillage | `Borgo Bifolco` | `Klotegem` | Place: Bumpkin → Klotegem |
| 11 | Fannyside | Sign_MineName | `Latrivella` | `Vanscheetvelde Mijn` (matching Butte = Vanscheetvelde, Cole Butte's mine) | Compound: Mine name |
| 12 | TheWell | Flashing text | `IIH` | `HIE` | Hie/Haa lock |

### Sex Accuracy popups (5 cells)

| Row | EN | Italian | Proposed NL |
|---|---|---|---|
| 13 | Sex Accuracy PopUp: Meh | `Mancato` | `Gemist` (missed) |
| 14 | Sex Accuracy PopUp: Meh | `Bah` | `Bah` (interjection — could keep as Dutch interjection too) |
| 15 | Sex Accuracy PopUp: Meh | `Buono` | `Goed` (good) |
| 16 | Sex Accuracy PopUp: Meh | `Grande` | `Groot` / `Geweldig` (great) |
| 17 | Sex Accuracy PopUp: Meh | `Perfetto` | `Perfect` |

### Building/business signs (Farm/Theatre/Mill)

| Row | Context | EN | Italian | Proposed NL | Rationale |
|---|---|---|---|---|---|
| 18 | TheFarm | Stable Sign | `Stalla` | `Stal` | Stable → Stal lock |
| 19 | TheFarm | Mill Sign | `Mulino` | `Molen` | Mill |
| 20 | The Protest | Theatre Sign | `Teatro` | `Theater` | Theatre |
| 21 | E3_100 | CircusAds in newspaper | `Circo di Mirco` | `Circus van Baptiste` | Ringmaster Rico → Circusdirecteur Baptiste (codex) |
| 22 | — | Zoo Name | (empty) | `Dierentuin van Dina` (per Zookeeper Rose = Dierendokter Dina codex) | Zoo name |
| 23 | E3_100 | Job Ad Derriere Name | `De Ricchis` | `Derrière` | Mme. Derriere = Mevr. Derrière (codex) |
| 24-25 | E3_LazysGrave | Wallet | (empty) | (verify if visible asset needs text) | Asset prop |

### E4 Goodbye / Highway signs

| Row | Context | EN | Italian | Proposed NL | Rationale |
|---|---|---|---|---|---|
| 26 | Goodbye | Song of Ascension phonemes | `iih ooh hi hon 'ee oh he o'w` | `HIE HAA HI HON 'EE OH HE O'W` (Dutch phonetic, leaning HIE/HAA lock) | Hie/Haa lock |
| 27 | Hwy | Derriere Truck Sign | `De Ricchis` | `Derrière` | Codex |
| 28 | Hwy | Boredom is Freedom | `La Noia è Libertà` | `Verveling is Vrijheid` | Lazy Ass motto (codex `verbalTics: 'Verveling is Vrijheid'`) ✓ exact codex match |
| 29 | Hwy | Prophet Sign | `Il Profeta Tornerà chiama 1-455-credici` | `De Profeet Komt Terug bel 1-455-geloof` | Phone number gag adapt |
| 30 | Hwy | Jack's Diner | `Al Covo` | `Bij Jack` (or keep `Jack's` Anglicism) | Restaurant brand |
| 31 | Hwy | Gas sign | `Benzina self-service` | `Benzine zelfbediening` | Gas station |

### E6 World

| Row | EN | Italian | Proposed NL |
|---|---|---|---|
| 32 | Slow Story Derriere Name | `De Ricchis` | `Derrière` |

### E7 Opening — Mecha City brand signs (will need TECHNOPOLIS substitutions)

| Row | EN | Italian | Proposed NL |
|---|---|---|---|
| 33 | Derriere Assorted Meats Sign | `De Ricchis – Carni assortite e Prodotti di bellezza` | `Derrière — Diverse Vlezen en Schoonheidsproducten` |
| 34 | Enlightenment Solutions | `Soluzioni Illuminazione` | `Verlichtingsoplossingen` |
| 35 | ProgressLabs | `Laboratori e-Splodo` | `VooruitgangsLab` |
| 36 | Mecha City Art Gallery | `Galleria d'Arte di Meccanopoli` | `Kunstgalerij Technopolis` |
| 37 | Centre for Social Justice | `Centro per la Giustizia Sociale De Ricchis` | `Centrum voor Sociale Rechtvaardigheid Derrière` |
| 38 | Aspire | `Aspira a di più` | `Streef Naar Meer` |
| 39 | Green Future | `Futuro Green` | `Groene Toekomst` |
| 40 | Mecha City Research Centre | `Centro di Ricerca di Meccanopoli` | `Onderzoekscentrum Technopolis` |
| 41 | Mecha U Aspire to Excellence | `UniMecca – Aspirare all'eccellenza` | `Technopolis Universiteit — Streef naar uitmuntendheid` |
| 42 | Institute for Progress | `Istituto per il Progresso` | `Instituut voor Vooruitgang` |
| 43 | Derriere Law Firm and Associates | `Studio Legale De Ricchis & Associati` | `Advocatenkantoor Derrière & Vennoten` |
| 44 | Derriere Innovation Hub | `Polo d'Innovazione De Ricchis` | `Innovatiehub Derrière` |
| 45-47 | Ms. Fission / Red D / Gold D | `DR` | `DR` (initials — likely keep) |
| 48 | Robotics | `Robotica` | `Robotica` |

### E9 Ripping (Cole's flashback)

| Row | EN | Italian | Proposed NL |
|---|---|---|---|
| 49 | Jack's dinner background | `Al Covo` | `Bij Jack` (matches Hwy) |
| 50 | MIT letter acceptance letter | `UniMecca / Pietro Latrivella` | `Technopolis Universiteit / Piet Vanscheetvelde` |
| 51 | MIT letter being burned | `UniMecca / Pietro Latrivella` | (same) |
| 52 | Song of Ascension | `iih ooh hi hon 'ee oh he o'w` | `HIE HAA HI HON 'EE OH HE O'W` (matches Goodbye row 26) |
| 53 | Flashing text | `BENVENUTO` | `WELKOM` |

### E10 Manual Manifesto backups

| Row | EN | Italian | Proposed NL |
|---|---|---|---|
| 54 | Manual backups for Manifesto | `Cedete del territorio agli Asini.` | `Sta jullie territorium af aan de Ezels.` |
| 55 | NOTE entry | `Supportate e apprezza le imprese creative degli Asini.` | `Steun en waardeer de creatieve ondernemingen van de Ezels.` |

---

## Bucket B: E10_Words missing Dutch sheet (4 cells)

`E10_Words` has sheets for English (source), Korean, Japanese, Spanish, French, Portuguese, Italian, German, Turkish, Catalan — **but no Dutch sheet**. The 2 source-EN entries need Dutch counterparts created.

| Row | Source | EN | Proposed NL | Rationale |
|---|---|---|---|---|
| 56 | E10_Words_English row#5 | the inevitable | `het onvermijdelijke` | Direct trans |
| 57 | E10_Words_English row#8 | and the asses from Fannyside | `en de Ezels van Muilenbeek` | Fannyside → Muilenbeek lock + Ezel cap |

Implied additional missing items per Korean/other-lang structure:
- "the spark" → `de vonk`
- "the Machine Prophet" → `de Machien-Profeet` (per Machien lock)

→ **A new `E10_Words_Dutch` section needs to be created** with all 4+ entries.

---

## Bucket C: FONT Tracker (sheet 12) — METADATA, NOT EDITORIAL

Rows 78+: font availability tracker (Reactor7, Beth Ellen, etc.). Not localization content. **Skip.**

---

## Notes on E11

### Categories scanned (full list applied — ALL APPLY here, not just the regular 46)

The E11 file uniquely affects:

- ✅ #8 Mechalen → Technopolis — affects ~7 signs (Mecha City Art Gallery, Mecha U, Research Centre, etc.)
- ✅ #9 Muilenbeek (Fannyside region) — Sign_FannysideFlour, "asses from Fannyside"
- ✅ Bumpkin → Klotegem — Sign_BumpkinVillage
- ✅ #18 Hie/Haa — Flashing text "IIH" → "HIE"; Song phonemes
- ✅ #21 Ezel cap — multiple signs reference donkeys
- ✅ #24 Machine → Machien — "the Machine Prophet" missing Dutch
- ✅ Codex name canon (Mevr. Derrière, Piet-Machien, Circusdirecteur Baptiste, Verveling is Vrijheid Lazy motto, etc.)

### Decision-pending in E11

1. **Which items are user-facing vs. asset-pipeline-only?** Some rows look like internal asset names (Foal Name Controller, Inelligble Foal Names, Wallet) — verify before translating.
2. **Phone gag adaptation** (Hwy row 29): `1-455-credici` (Italian: "1-455-believe") → suggested `1-455-geloof`. Confirm preferred Dutch number gag.
3. **"Jack's Diner"** (rows 30, 49): keep Anglicism `Jack's` (matches casual Highway aesthetic) or fully translate to `Bij Jack`?
4. **Sex Accuracy popups** (rows 13-17): currently Italian, propose Dutch but verify if these are deliberate Italian (parody of melodramatic ratings)?

### Reconciliation with Gemini's E11 audit

Gemini's E11 audit caught:
- Row 57 EN "the Machine Prophet" → `de Machien-Profeet` ✓ matches Opus
- Row 57 EN "...asses from Fannyside" → `Ezels van Muilenbeek` ✓ matches Opus
- Gemini flagged 2 cells; **Opus catches ~52** (the entire "Other Translations" Italian-fallback content + 4 E10_Words entries).

**Net:** Opus exposes a much larger asset/sign translation gap than Gemini noted. This file is **batch q candidate** (or its own batch — `feedback-2026-05-XX-noncsv-signs.json`).

---

**Total E11 items flagged: ~52** (split into Bucket A 48 sign/prop cells + Bucket B 4 missing E10_Words Dutch entries). 4 decision items (asset/internal verification, phone gag, Jack's, popup language). The vast majority are mechanical translations awaiting Dutch text. **Recommend dedicated batch separate from xlsx batches** — different file format, different apply pipeline.
