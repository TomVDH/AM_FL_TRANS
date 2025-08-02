# Excel to JSON Conversion Script

This script processes all `.xlsx` files in the `excels` folder and converts them to JSON format with structured data extraction.

## Features

- **Batch Processing**: Processes all Excel files in the `excels` folder
- **Multi-Sheet Support**: Extracts data from all tabs/sheets in each file
- **Structured Output**: Creates consistent JSON format for each file
- **Error Handling**: Gracefully handles processing errors and continues with other files
- **Comprehensive Logging**: Detailed console output showing progress
- **Summary Report**: Generates a processing summary with statistics

## Data Structure

The script extracts the following data from each Excel file:

- **Column A**: Utterer (speaker/character identifier)
- **Column B**: Context (description or context information)
- **Column C**: Source English (the text to be translated)
- **Row Number**: Excel row number for each entry
- **Sheet Name**: Name of the tab/sheet containing the data

## Output Format

Each processed file generates a JSON file with this structure:

```json
{
  "fileName": "example_file",
  "processedAt": "2025-08-02T03:35:26.640Z",
  "sheets": [
    {
      "sheetName": "Sheet1",
      "entries": [
        {
          "rowNumber": 1,
          "utterer": "SAY.Dialog:Opening.93.Trusty Ass",
          "context": "Main branch",
          "sourceEnglish": "Comrade Sick Ass?!"
        }
      ]
    }
  ]
}
```

## Usage

### Prerequisites

- Node.js (version 18 or higher)
- XLSX library (already included in project dependencies)

### Running the Script

```bash
# Using npm script (recommended)
npm run excel-to-json

# Direct execution
node scripts/excel-to-json.js
```

### Output Location

Processed files are saved to: `data/json/`

- Individual JSON files: `data/json/[filename].json`
- Processing summary: `data/json/processing-summary.json`

## Processing Results

The script successfully processed **14 Excel files** with:

- **Total Files**: 14
- **Successful**: 14
- **Failed**: 0
- **Total Sheets**: 136
- **Total Entries**: 6,265

### File Breakdown

| File | Sheets | Entries |
|------|--------|---------|
| 0_asses.masses_Manager+Intermissions+E0Proxy | 9 | 258 |
| 1_asses.masses_E1Proxy | 12 | 440 |
| 2_asses.masses_E2Proxy | 15 | 425 |
| 3_asses.masses_E3Proxy | 10 | 399 |
| 4_asses.masses_E4Proxy | 9 | 451 |
| 5_asses.masses_E5Proxy | 7 | 604 |
| 6_asses.masses_E6Proxy | 8 | 550 |
| 7_asses.masses_E7Proxy | 17 | 397 |
| 8_asses.masses_E8Proxy | 3 | 102 |
| 9_asses.masses_E9Proxy | 5 | 300 |
| 10_asses.masses_E10Proxy | 11 | 682 |
| 11_asses.masses_NonCSVBasedTranslations | 11 | 88 |
| READ_ME_LocalizationManual | 12 | 1,244 |
| Translation Checklist | 7 | 325 |

## Error Handling

The script includes robust error handling:

- **File-level errors**: If a file fails to process, the script continues with remaining files
- **Sheet-level errors**: Empty or problematic sheets are logged but don't stop processing
- **Data validation**: Only rows with actual data are included in the output
- **Detailed logging**: Console output shows progress and any issues encountered

## Customization

To modify the script behavior, edit `scripts/excel-to-json.js`:

- **Column mapping**: Modify the `REQUIRED_COLUMNS` object
- **Output location**: Change the `OUTPUT_FOLDER` constant
- **Data filtering**: Adjust the row processing logic in `processExcelFile()`
- **File filtering**: Modify the file selection logic in `main()`

## Integration

The generated JSON files can be easily integrated into:

- **Translation workflows**: Import structured data for translation tools
- **Database systems**: Bulk import into translation databases
- **API endpoints**: Serve translation data via REST APIs
- **Analysis tools**: Process translation statistics and metrics

## Troubleshooting

### Common Issues

1. **"No Excel files found"**: Ensure `.xlsx` files exist in the `excels` folder
2. **Permission errors**: Check file permissions on the `excels` folder
3. **Memory issues**: For very large files, consider processing in batches
4. **Encoding issues**: Excel files should be in standard UTF-8 encoding

### Debug Mode

To enable detailed debugging, add console.log statements in the script or run with Node.js debug flags:

```bash
node --trace-warnings scripts/excel-to-json.js
```

## Future Enhancements

Potential improvements for the script:

- **Parallel processing**: Process multiple files simultaneously
- **Incremental updates**: Only process changed files
- **Data validation**: Add schema validation for extracted data
- **Export formats**: Support additional output formats (CSV, XML)
- **Configuration file**: External configuration for column mapping
- **Progress bar**: Visual progress indicator for large files 