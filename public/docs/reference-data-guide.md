# Setting Up Reference Data for Your Language

## What is Reference Data?

Reference data powers two features in the Translation Helper:

1. **Quick Suggestions** - Character names and common phrases appear as clickable chips while you translate
2. **Highlight Mode** - Recognized terms are highlighted in the source text

## Current Status

Reference data is currently available for:
- **Dutch (NL)** - Full character and location database

## Adding Reference Data for a New Language

### Option 1: Edit the Codex Directly

1. Go to the **Codex / Reference Data** section on the setup screen
2. For each entry, add a translation in your target language
3. The system will automatically detect the new language column

### Option 2: Edit the CSV File

The reference data lives in `data/csv/codex_translations.csv`.

**Current columns:**
- `name` - Character/term identifier
- `english` - English text
- `dutch` - Dutch translation
- `category` - CHARACTER, LOCATION, ITEM, etc.

**To add a new language:**

1. Open the CSV in a spreadsheet application
2. Add a new column with your language name (e.g., `portuguese`, `spanish`)
3. Fill in translations for each row
4. Save the file

**Example:**
```csv
name,english,dutch,portuguese,category
Maria,Maria,Maria,Maria,CHARACTER
The Key,The Key,De Sleutel,A Chave,ITEM
```

### Column Naming Convention

Use lowercase language names as column headers:
- `dutch`
- `portuguese`
- `spanish`
- `french`
- `german`

## Tips

- You don't need to translate every entry - partial coverage still helps
- Focus on main character names first
- Common phrases and items are secondary

## Questions?

Open an issue on the GitHub repository if you need help setting up reference data.
