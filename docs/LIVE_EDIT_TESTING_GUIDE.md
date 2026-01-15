# Live Edit Mode Testing Guide
## Complete Testing Instructions for Excel Live Sync

---

## PREREQUISITES

### 1. Verify Test File Exists
```bash
ls -lh excels/test-translation.xlsx
```

Should show a file with data (~5KB minimum).

### 2. Confirm App is Running
Navigate to: http://localhost:3000

### 3. Check API Endpoint Status
The `/api/xlsx-save` endpoint is already fully implemented at:
- [src/app/api/xlsx-save/route.ts](../src/app/api/xlsx-save/route.ts)

---

## TESTING PROCEDURE

### Step 1: Load Test Excel File

1. **Open the app** at http://localhost:3000
2. **Click "Setup Wizard"** (or navigate to setup if first time)
3. **Select File Type**: Choose "Excel (.xlsx)"
4. **Browse for file**: Select `test-translation.xlsx` from the file picker
   - File should be in: `/Users/tomlinson/AM_FL_TRANS/excels/test-translation.xlsx`
5. **Select Sheet**: Choose "Chapter1"
6. **Set Start Row**: Enter `5` (data begins at row 5)
7. **Click "Load Data"**

**Expected Result**:
- Setup wizard closes
- Input tab displays first entry
- Source text shows: "Hello, how are you today?"
- Character badge shows: "Alice"
- Translation field may show existing Dutch text or be blank

---

### Step 2: Enable Live Edit Mode

1. **Navigate to "Output" tab** (top of interface)
2. **Look for mode toggles** in the header area
3. **Click the "Live" button** to enable Live Edit mode

**Expected Result**:
- "Live" button becomes highlighted/active
- Status indicator appears (colored dot)
- Dot should be gray (idle) initially

**If Live Edit button is disabled**:
- Check that you loaded an Excel file (not CSV/JSON)
- Verify `loadedFileType === 'excel'` in the interface
- Only Excel files support Live Edit

---

### Step 3: Make a Translation

1. **Return to "Input" tab**
2. **Enter Dutch translation** in the textarea
   - Example for "Hello, how are you today?": `Hallo, hoe gaat het vandaag met je?`
3. **Press Shift+Enter** or click "Submit" button

**Expected Result**:
- Translation saves to state
- Interface advances to next entry
- Change detection badge shows "Modified" (green)

---

### Step 4: Trigger Live Sync

The sync happens **automatically on navigation** when Live Edit mode is enabled.

**Sync Trigger Points**:
- Clicking "Submit" button
- Pressing Shift+Enter
- Using "Previous" navigation
- Jumping to different entry via Output table

**During Sync**:
- Status dot turns yellow (syncing)
- Submit button may briefly disable
- API call to `/api/xlsx-save` occurs

**After Sync**:
- Status dot turns green (synced)
- `lastSyncTime` updates
- Excel file written to disk

---

### Step 5: Verify Excel File Created

1. **Check for edited file**:
   ```bash
   ls -lh excels/test-translation_EDITED.xlsx
   ```

2. **Compare timestamps**:
   ```bash
   stat excels/test-translation.xlsx
   stat excels/test-translation_EDITED.xlsx
   ```

**Expected Result**:
- `test-translation_EDITED.xlsx` exists
- Modified time is recent (within last minute)
- File size similar to original

---

### Step 6: Inspect Excel File Contents

**Option A: Open in Excel/LibreOffice**
1. Open `excels/test-translation_EDITED.xlsx`
2. Navigate to "Chapter1" sheet
3. Look at **Column J** (Dutch Translation)
4. Find **Row 5** (first data row)
5. Verify your translation appears: `Hallo, hoe gaat het vandaag met je?`

**Option B: Programmatic Check with Node.js**
```javascript
const XLSX = require('xlsx');
const workbook = XLSX.readFile('excels/test-translation_EDITED.xlsx');
const worksheet = workbook.Sheets['Chapter1'];
const cellJ5 = worksheet['J5'];
console.log('Cell J5 value:', cellJ5?.v);
// Should output: Hallo, hoe gaat het vandaag met je?
```

---

### Step 7: Test Multiple Translations

1. **Add 3-5 more translations** in sequence
2. **Navigate through entries** with Submit button
3. **Watch sync indicator** change colors each time

**Expected Behavior**:
- Each navigation triggers sync
- Dot cycles: gray → yellow → green
- No error messages appear

4. **Open `_EDITED.xlsx` file**
5. **Verify all translations appear** in Column J at correct rows

**Example Expected Results**:
```
Row 5 (J5): Hallo, hoe gaat het vandaag met je?
Row 6 (J6): Ik doe het geweldig, bedankt voor het vragen!
Row 7 (J7): Wat een prachtige dag vandaag.
Row 8 (J8): Inderdaad, de zon schijnt fel.
```

---

## TROUBLESHOOTING

### Issue: "Live Edit" Button Grayed Out

**Cause**: Not using an Excel file

**Solution**:
1. Reload with Excel file (.xlsx)
2. CSV and JSON files do not support Live Edit
3. Verify file picker shows .xlsx extension

---

### Issue: Sync Status Shows "Error" (Red Dot)

**Possible Causes**:
1. File permissions issue
2. API endpoint error
3. Malformed cell reference

**Debug Steps**:
1. **Check browser console** (F12 → Console tab)
   - Look for API error messages
   - Check network tab for failed requests

2. **Verify API endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/xlsx-save \
     -H "Content-Type: application/json" \
     -d '{
       "sourceFileName": "test-translation.xlsx",
       "sheetName": "Chapter1",
       "cellRef": "J5",
       "value": "Test value"
     }'
   ```
   Expected response: `{"success": true, "message": "Cell updated successfully"}`

3. **Check file permissions**:
   ```bash
   ls -la excels/
   # Should show read/write permissions
   ```

4. **Check server logs** in terminal where `npm run dev` is running

---

### Issue: Excel File Not Updating

**Cause**: File may be open in another application

**Solution**:
1. Close Excel/LibreOffice if file is open
2. Locked files cannot be written
3. Try sync again after closing

---

### Issue: Translation Appears in Wrong Cell

**Cause**: `startRow` configuration incorrect

**Solution**:
1. Verify Setup Wizard setting
2. Data should start at row 5
3. Formula: `cellRef = J${startRow + currentIndex}`
4. If `startRow = 5` and `currentIndex = 0`, then cell = J5

---

## SYNC STATUS INDICATOR REFERENCE

| Dot Color | Status | Meaning |
|-----------|--------|---------|
| Gray | `idle` | No sync in progress, not recently synced |
| Yellow | `syncing` | API call in progress, writing to Excel |
| Green | `synced` | Successfully saved, recent sync (< 5 seconds) |
| Red | `error` | Sync failed, check console for details |

---

## API ENDPOINT REFERENCE

### POST `/api/xlsx-save`

**Request Body**:
```json
{
  "sourceFileName": "test-translation.xlsx",
  "sheetName": "Chapter1",
  "cellRef": "J5",
  "value": "Hallo, hoe gaat het vandaag met je?"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Cell J5 updated successfully in test-translation_EDITED.xlsx",
  "editedFile": "test-translation_EDITED.xlsx"
}
```

**Response (Error)**:
```json
{
  "error": "Error message here",
  "success": false
}
```

---

## VERIFICATION CHECKLIST

After completing all steps, verify:

- [ ] `test-translation_EDITED.xlsx` exists in `/excels` directory
- [ ] File has recent modification timestamp
- [ ] Column J contains your Dutch translations
- [ ] Translations appear at correct row numbers (J5, J6, etc.)
- [ ] Original `test-translation.xlsx` remains unchanged
- [ ] Sync indicator shows green after each save
- [ ] No console errors appear during sync
- [ ] Can reload edited file and see translations persist

---

## ADVANCED TESTING

### Test 1: Reload Edited File

1. **Go to Setup Wizard**
2. **Load `test-translation_EDITED.xlsx`** instead of original
3. **Navigate to entries**
4. **Verify translations appear** in the "Existing Dutch" reference section

**Expected**: Your previous translations load correctly

---

### Test 2: Modify Existing Translation

1. **Load edited file** (with existing translations)
2. **Navigate to entry with translation**
3. **Change the translation** to something different
4. **Submit**
5. **Check `_EDITED.xlsx` file**

**Expected**:
- File updates with new translation
- Old value replaced with new value
- No duplicate `_EDITED_EDITED` files created

---

### Test 3: Concurrent Translation Workflow

1. **Enable Live Edit mode**
2. **Translate 10 consecutive entries** rapidly
3. **Watch sync indicators** for each
4. **Open Excel file** when done

**Expected**:
- All 10 translations present
- No missing entries
- Correct sequential row numbers

---

### Test 4: Cross-Sheet Testing

If your Excel file has multiple sheets:

1. **Load Sheet1**, translate entries
2. **Reload with Sheet2**
3. **Translate those entries**
4. **Open `_EDITED.xlsx`**

**Expected**:
- Both sheets have translations
- Sheets remain separate
- No cross-contamination

---

## SAMPLE TEST DATA

Use this sample data to verify translations:

| Row | Character | English | Dutch (Example) |
|-----|-----------|---------|-----------------|
| 5 | Alice | Hello, how are you today? | Hallo, hoe gaat het vandaag met je? |
| 6 | Bob | I am doing great, thanks for asking! | Ik doe het geweldig, bedankt voor het vragen! |
| 7 | Alice | What a beautiful day today. | Wat een prachtige dag vandaag. |
| 8 | Bob | Indeed, the sun is shining bright. | Inderdaad, de zon schijnt fel. |
| 9 | Narrator | They walked together through the park. | Ze liepen samen door het park. |

---

## KNOWN LIMITATIONS

1. **Manual file management**: Edited files use `_EDITED.xlsx` suffix
2. **No merge back**: Original file never modified automatically
3. **No conflict resolution**: If file changed externally, last write wins
4. **Single user**: Not designed for concurrent editing

---

## SUCCESS CRITERIA

Live Edit mode is working correctly if:

✅ Translations sync automatically on navigation
✅ `_EDITED.xlsx` file created and updated
✅ Sync status indicator changes appropriately
✅ Excel file opens and shows correct values
✅ No console errors during sync operations
✅ Can reload edited file and see translations

---

*Last updated: 2026-01-14*
*Test file: /excels/test-translation.xlsx*
*API endpoint: /api/xlsx-save*
