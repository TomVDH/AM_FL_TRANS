# Example Data Structure

This document shows the recommended Excel file structure for optimal compatibility with the AM Translations Helper.

## Excel File Format

### Recommended Structure

#### For New Translations
```
| Column A (Speaker) | Column B (ID) | Column C (Source Text) | Column D (Notes) |
|-------------------|----------------|----------------------|------------------|
| John              | 1              | Hello, how are you?  | Informal greeting |
| Sarah             | 2              | Good morning!        | Formal greeting   |
| Mike              | 3              | See you later        | Farewell          |
```

#### For Translation Verification/Correction
```
| Column A (Speaker) | Column B (ID) | Column C (Source Text) | Column D (Reference Translation) |
|-------------------|----------------|----------------------|----------------------------------|
| John              | 1              | Hello, how are you?  | ¿Cómo estás?                    |
| Sarah             | 2              | Good morning!        | Buenos días                      |
| Mike              | 3              | See you later        | Nos vemos luego                 |
```

### Column Mapping

#### For New Translations
- **Column A**: Speaker/Utterer names
- **Column C**: Source text to translate
- **Start Row**: 2 (skip header row)

#### For Translation Verification
- **Column A**: Speaker/Utterer names
- **Column C**: Source text to translate
- **Column D**: Reference translations to verify/correct
- **Start Row**: 2 (skip header row)

### Configuration Settings

#### New Translation Mode
- **Utterer Column**: A
- **Source Column**: C
- **Start Row**: 2
- **Use Reference Column**: Unchecked

#### Verification Mode
- **Utterer Column**: A
- **Source Column**: C
- **Reference Column**: D
- **Start Row**: 2
- **Use Reference Column**: Checked

## Manual Text Input Format

For manual input, use this format:
```
Hello, how are you?
Good morning!
See you later
```

## Sample Data for Testing

### English to Spanish Translation
```
John: Hello, how are you?
Sarah: Good morning!
Mike: See you later
```

### Expected Output
```
John: ¡Hola, cómo estás?
Sarah: ¡Buenos días!
Mike: Hasta luego
```

## Tips for Best Results

1. **Consistent Formatting**: Keep speaker names in the same column
2. **Clean Data**: Remove extra spaces and formatting
3. **Clear Headers**: Use descriptive column headers
4. **Backup**: Always keep a backup of your original data
5. **Test Small**: Start with a small dataset to verify settings

## Troubleshooting

### Common Issues
- **Empty cells**: Ensure source text column has no empty rows
- **Wrong column**: Double-check column letter assignments
- **Start row**: Make sure to skip header rows
- **File format**: Use .xlsx or .xls format only

### Data Validation
- Check that your Excel file opens correctly in Excel/Google Sheets
- Verify that the selected worksheet contains your data
- Ensure the specified columns contain the expected data types 