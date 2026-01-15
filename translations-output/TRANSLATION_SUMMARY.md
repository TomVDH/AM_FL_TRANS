# Translation Status Summary

Generated: 2026-01-12

## Overview

This directory contains markdown files for all entries across all episodes that need Dutch translations. Each file corresponds to one JSON source file and lists all the entries that have empty `translatedDutch` fields.

## Translation Progress by Episode

| Episode | File | Total Entries | Needs Translation | Completion % |
|---------|------|---------------|-------------------|--------------|
| E0 + Manager | `0_asses.masses_Manager+Intermissions+E0Proxy` | 251 | 123 | 51.0% |
| E1 | `1_asses.masses_E1Proxy` | 416 | 1 | 99.8% |
| E2 | `2_asses.masses_E2Proxy` | 398 | 21 | 94.7% |
| E3 | `3_asses.masses_E3Proxy` | 380 | 0 | 100.0% |
| E4 | `4_asses.masses_E4Proxy` | 435 | 435 | 0.0% |
| E5 | `5_asses.masses_E5Proxy` | 592 | 592 | 0.0% |
| E6 | `6_asses.masses_E6Proxy` | 535 | 534 | 0.2% |
| E7 | `7_asses.masses_E7Proxy` | 363 | 363 | 0.0% |
| E8 | `8_asses.masses_E8Proxy` | 96 | 96 | 0.0% |
| E9 | `9_asses.masses_E9Proxy` | 292 | 292 | 0.0% |
| E10 | `10_asses.masses_E10Proxy` | 666 | 665 | 0.2% |
| Non-CSV | `11_asses.masses_NonCSVBasedTranslations` | 79 | 32 | 59.5% |

## Overall Statistics

- **Total Entries Across All Episodes:** 4,503
- **Total Entries Needing Translation:** 3,154
- **Total Already Translated:** 1,349
- **Overall Completion:** 29.9%

## Priority Episodes (Fully Complete)

✅ **Episode 3** - 100% complete (0 entries need translation)

## Priority Episodes (Nearly Complete)

🟡 **Episode 1** - 99.8% complete (only 1 entry needs translation)
🟡 **Episode 2** - 94.7% complete (21 entries need translation)

## Episodes Requiring Full Translation

❌ **Episode 4** - 0% complete (435 entries)
❌ **Episode 5** - 0% complete (592 entries)
❌ **Episode 7** - 0% complete (363 entries)
❌ **Episode 8** - 0% complete (96 entries)
❌ **Episode 9** - 0% complete (292 entries)

## Episodes Partially Complete

🟡 **Episode 0 + Manager** - 51.0% complete (123 entries remaining)
🟡 **Episode 6** - 0.2% complete (534 entries remaining)
🟡 **Episode 10** - 0.2% complete (665 entries remaining)
🟡 **Non-CSV Translations** - 59.5% complete (32 entries remaining)

## How to Use These Files

Each markdown file contains:
- A summary of translation progress for that episode
- All untranslated entries organized by sheet
- For each entry:
  - Row number (for reference back to source files)
  - Key identifier
  - Utterer (who says the line)
  - Context (if available)
  - English source text
  - Placeholder for Dutch translation

You can work through these files systematically, adding Dutch translations to replace the `[NEEDS TRANSLATION]` placeholders.

## Translation Guidelines

When translating, refer to existing translations in the JSON files for:
- **Character names** - Ensure consistency (e.g., "Old Ass" → "Ouwe Zak")
- **Tone and style** - Match the irreverent, playful tone of the game
- **Technical terms** - Maintain consistency with UI elements
- **Cultural references** - Adapt where necessary for Dutch audience

## Files in This Directory

1. `0_asses.masses_Manager+Intermissions+E0Proxy_translations.md` - Episode 0, Manager scenes, and intermissions
2. `1_asses.masses_E1Proxy_translations.md` - Episode 1
3. `2_asses.masses_E2Proxy_translations.md` - Episode 2
4. `3_asses.masses_E3Proxy_translations.md` - Episode 3 (COMPLETE ✅)
5. `4_asses.masses_E4Proxy_translations.md` - Episode 4
6. `5_asses.masses_E5Proxy_translations.md` - Episode 5
7. `6_asses.masses_E6Proxy_translations.md` - Episode 6
8. `7_asses.masses_E7Proxy_translations.md` - Episode 7
9. `8_asses.masses_E8Proxy_translations.md` - Episode 8
10. `9_asses.masses_E9Proxy_translations.md` - Episode 9
11. `10_asses.masses_E10Proxy_translations.md` - Episode 10
12. `11_asses.masses_NonCSVBasedTranslations_translations.md` - Non-CSV based translations

---

*This summary was auto-generated. To regenerate the markdown files, run: `node scripts/translate-to-markdown.js`*
