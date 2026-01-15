# Translation Output Directory

This directory contains markdown files for all untranslated entries across all episodes of the game.

## 📋 Quick Start

1. **Read the Summary**: Start with [`TRANSLATION_SUMMARY.md`](./TRANSLATION_SUMMARY.md) to see overall progress
2. **Check the Reference Guide**: Review [`TRANSLATION_REFERENCE.md`](./TRANSLATION_REFERENCE.md) for character names and style guidelines
3. **Pick an Episode**: Choose a markdown file to work on
4. **Translate**: Replace `[NEEDS TRANSLATION]` with Dutch translations

## 📁 Files in This Directory

### Core Documents
- **`TRANSLATION_SUMMARY.md`** - Overview of all episodes and translation progress
- **`TRANSLATION_REFERENCE.md`** - Character names, UI terms, and style guide
- **`README.md`** - This file

### Episode Translation Files
- `0_asses.masses_Manager+Intermissions+E0Proxy_translations.md` - E0 + Manager (123 entries)
- `1_asses.masses_E1Proxy_translations.md` - E1 (1 entry) ✅ Nearly complete!
- `2_asses.masses_E2Proxy_translations.md` - E2 (21 entries)
- `3_asses.masses_E3Proxy_translations.md` - E3 (0 entries) ✅ Complete!
- `4_asses.masses_E4Proxy_translations.md` - E4 (435 entries)
- `5_asses.masses_E5Proxy_translations.md` - E5 (592 entries)
- `6_asses.masses_E6Proxy_translations.md` - E6 (534 entries)
- `7_asses.masses_E7Proxy_translations.md` - E7 (363 entries)
- `8_asses.masses_E8Proxy_translations.md` - E8 (96 entries)
- `9_asses.masses_E9Proxy_translations.md` - E9 (292 entries)
- `10_asses.masses_E10Proxy_translations.md` - E10 (665 entries)
- `11_asses.masses_NonCSVBasedTranslations_translations.md` - Non-CSV (32 entries)

## 📊 Statistics

- **Total Entries:** 4,503
- **Needs Translation:** 3,154 (70.1%)
- **Already Translated:** 1,349 (29.9%)

## 🎯 Recommended Order

### Priority 1: Nearly Complete Episodes
1. **Episode 1** - Only 1 entry remaining (99.8% complete)
2. **Episode 2** - 21 entries remaining (94.7% complete)

### Priority 2: Partially Complete
3. **Episode 0 + Manager** - 123 entries (51.0% complete)
4. **Non-CSV Translations** - 32 entries (59.5% complete)

### Priority 3: Full Episodes
5. **Episode 8** - 96 entries (smallest untranslated episode)
6. **Episode 9** - 292 entries
7. **Episode 7** - 363 entries
8. **Episode 4** - 435 entries
9. **Episode 6** - 534 entries
10. **Episode 5** - 592 entries
11. **Episode 10** - 665 entries (largest)

## 📝 Translation Workflow

### For Each Entry:

```markdown
### Row X

**Key:** `WRITE.DialogLocalizer.XX`

**English:**
```
Original text here
```

**Dutch Translation:**
```
[NEEDS TRANSLATION]  ← Replace this with your translation
```
```

### Example:

**Before:**
```markdown
**English:**
```
PRESS X TO BEGIN
```

**Dutch Translation:**
```
[NEEDS TRANSLATION]
```
```

**After:**
```markdown
**English:**
```
PRESS X TO BEGIN
```

**Dutch Translation:**
```
DRUK OP X OM TE BEGINNEN
```
```

## 🔍 Translation Tips

1. **Check Context**: Always read the context field - it provides important information about where the text appears
2. **Character Names**: Use the reference guide to ensure character names are consistent
3. **Variables**: Don't translate variables like `{$NewName}` - keep them exactly as-is
4. **Line Breaks**: Preserve `\n` characters for line breaks
5. **Tone**: Maintain the game's irreverent, playful tone
6. **Cultural References**: Some jokes may need adaptation for Dutch audiences

## 🔄 Regenerating These Files

If you need to regenerate these markdown files from the source JSON:

```bash
node scripts/translate-to-markdown.js
```

This will re-scan all JSON files and create fresh markdown files with current translation status.

## 📂 Source Data

The source data comes from:
- `data/json/*_E*.json` - Episode translation files
- `data/csv/*_E*.csv` - Original CSV files

## 🎮 About the Game

This appears to be a satirical game about donkeys in various situations (circus, factory, astral plane, etc.). The wordplay centers around "ass" as both donkey and slang, with character names that are puns in both English and Dutch.

## ✅ Completed Episodes

- **Episode 3**: 100% complete - no translation needed!

## 🚀 Next Steps

1. Choose an episode to work on
2. Open the corresponding markdown file
3. Start translating entries
4. Use the reference guide to maintain consistency
5. When done, update the source JSON files with your translations

---

*Generated: 2026-01-12*
*Total untranslated entries: 3,154*
