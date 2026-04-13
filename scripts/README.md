# Scripts

Utility scripts for the AM Translations Helper.

```
scripts/
  analysis/      Corpus analysis (NL linguistic profiling per character)
  convert/       Excel/data format conversion & Google Sheets download
```

---

## analysis/ — Corpus Analysis

| Script | Purpose |
|--------|---------|
| `analyze-nl-corpus.js` | Analyze all NL dialogue from Excel sheets per speaker: pronoun usage, Flemish markers, contractions, verbal tics, inconsistencies. Outputs `data/analysis/nl-corpus-report.json`. |

```bash
node scripts/analysis/analyze-nl-corpus.js              # full analysis, all speakers
node scripts/analysis/analyze-nl-corpus.js --top=20      # top 20 speakers by line count
node scripts/analysis/analyze-nl-corpus.js --speaker="Bad Ass"  # single character
```

---

## convert/ — Data Conversion

| Script | Purpose |
|--------|---------|
| `download-sheets.js` | Download Google Sheets as .xlsx to `excels/` + `excels/Originals/`. Called by `POST /api/download-sheets`. |
| `excel-to-json.js` | Excel → JSON + CSV (primary data pipeline). npm: `npm run excel-to-json` |
| `excel-to-csv.js` | Excel → CSV only. npm: `npm run excel-to-csv` |

```bash
node scripts/convert/download-sheets.js   # pull fresh sheets from Google Drive
npm run excel-to-json                     # process all Excel files
npm run excel-to-csv                      # CSV only
```
