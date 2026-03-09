# Scripts

Utility scripts for the AM Translations Helper. Organized by purpose.

```
scripts/
  ai/            AI-powered batch translation (Claude API)
  pipeline/      Style analysis pipeline (6-step, called by /api/style-analysis)
  codex/         Codex building, enrichment, character extraction
  convert/       Excel/data format conversion & Google Sheets download
  _archive/      One-shot debug utilities (kept for reference)
```

---

## ai/ — AI Translation

| Script | Claude Model | Purpose |
|--------|-------------|---------|
| `ai-translate.js` | sonnet-4-5 | Standalone batch translator. Reads JSON episode files, translates all lines via Claude with character context. |
| `translate-all-batches.js` | sonnet-4-5 | Processes 64 pre-split batch files from `translation-batches/`. Original seeding script used before the web UI bulk translate existed. |

**Note:** The web UI's bulk translate (`Ctrl+Shift+T`) now handles this use case through `/api/ai-suggest`. These scripts are the offline predecessors.

---

## pipeline/ — Style Analysis Pipeline

Six scripts that run in sequence to analyze character speaking styles and write them into the codex. Called by the Style Analysis panel in the web UI via `POST /api/style-analysis`.

| Step | Script | Uses AI | Output |
|------|--------|---------|--------|
| 1 | `extract-dialogue-by-speaker.js` | No | `data/analysis/speaker-dialogue.csv` |
| 2 | `extract-dutch-dialogue-by-speaker.js` | No | `data/analysis/speaker-dutch-dialogue.csv` |
| 3 | `analyze-speaker-styles.js` | Yes (Sonnet) | `data/analysis/speaker-styles.json` |
| 4 | `analyze-dutch-styles.js` | Yes (Sonnet) | `data/analysis/speaker-dutch-styles.json` |
| 5 | `import-styles-to-codex.js --apply` | No | Writes `dialogueStyle` to codex |
| 6 | `import-dutch-styles-to-codex.js --apply` | No | Writes `dutchDialogueStyle` to codex |

Steps 1-2 extract dialogue from Excel files. Steps 3-4 send samples to Claude for analysis. Steps 5-6 write the results into `codex_translations.json`.

```bash
# Run individual steps
node scripts/pipeline/analyze-speaker-styles.js
node scripts/pipeline/analyze-speaker-styles.js --speaker="Miner Jenny"  # single character
node scripts/pipeline/import-styles-to-codex.js --dry-run               # preview without writing
```

---

## codex/ — Codex Building

| Script | Purpose |
|--------|---------|
| `extract-characters.js` | Parse Excel key patterns (`SAY.Dialog:XXX.NN.Speaker`) to build the master character list |
| `discover-codex-terms.js` | Scan all text for codex-worthy terms: locations, items, proper nouns (largest script, 25KB) |
| `merge-dutch-to-codex.js` | Merge Dutch translations into the codex from various sources |
| `fill-gender-gaps.js` | Fill missing `gender` fields in codex entries |
| `sprawl-char-info.js` | Dump character info to console for inspection |

```bash
node scripts/codex/extract-characters.js
node scripts/codex/discover-codex-terms.js
```

---

## convert/ — Data Conversion

| Script | Purpose |
|--------|---------|
| `excel-to-json.js` | Excel → JSON + CSV (primary data pipeline). npm: `npm run excel-to-json` |
| `excel-to-csv.js` | Excel → CSV only. npm: `npm run excel-to-csv` |
| `download-sheets.js` | Download Google Sheets as .xlsx to `excels/`. Called by `POST /api/download-sheets` |
| `translate-all.js` | Orchestrator for the batch translation pipeline |
| `translate-batch.js` | Process one batch file from `translation-batches/` |
| `translate-to-markdown.js` | Convert JSON translations to readable markdown |

```bash
npm run excel-to-json     # process all Excel files
npm run excel-to-csv      # CSV only
```

---

## _archive/ — Debug Utilities

One-shot inspection scripts. Kept for reference, not actively used.

| Script | What it did |
|--------|------------|
| `check-excel-cols.js` | Debug column issue in E2_World sheet |
| `sample-xlsx-columns.js` | Inspect Excel column structure |
| `scan-readme.js` | Inspect README processing |
| `test-readme-processing.js` | Test README parsing logic |
