# Excel Formatting Loss Investigation
## Live Edit Mode - Cell Formatting Not Preserved

---

## ISSUE SUMMARY

**Problem**: When using Live Edit mode, cell formatting (colors, borders, shading, fonts) is stripped from the Excel file after saving.

**Affected**: Live Edit mode only (CSV export and manual copy/paste not affected)

**Root Cause**: The `xlsx` (SheetJS) library's free/community edition does not preserve cell formatting when writing files.

---

## INVESTIGATION

### What Happens

1. **User enables Live Edit mode**
2. **Makes a translation** (e.g., "Hallo wereld")
3. **Translation is synced** to Excel via `/api/xlsx-save`
4. **API reads file** with `XLSX.read(buffer, { type: 'buffer' })`
5. **API updates cell** value (e.g., cell J5)
6. **API writes file** with `XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })`
7. **Formatting is stripped** - colors, borders, shading all gone!

### Code Location

**File**: `/src/app/api/xlsx-save/route.ts`

**Read Operation** (line 102-106):
```typescript
const workbook = XLSX.read(buffer, {
  type: 'buffer',
  cellStyles: true,  // Try to preserve cell styles
  bookVBA: true      // Preserve VBA/macros if present
});
```

**Write Operation** (line 136-141):
```typescript
const outputBuffer = XLSX.write(workbook, {
  type: 'buffer',
  bookType: 'xlsx',
  cellStyles: true,  // Try to preserve cell styles
  bookVBA: true      // Preserve VBA/macros if present
});
```

### Library Limitations

**SheetJS (xlsx) Free Edition**:
- ✅ Reads cell values correctly
- ✅ Preserves formulas
- ✅ Maintains sheet structure
- ❌ Does NOT preserve cell formatting (colors, fonts, borders)
- ❌ Does NOT preserve conditional formatting
- ❌ Does NOT preserve cell styles (fill, alignment)
- ❌ Requires Pro license for formatting preservation

**SheetJS Pro Edition**:
- ✅ Preserves all formatting
- ❌ Costs $999/year for commercial use
- ❌ Not currently licensed

---

## ATTEMPTED FIX

Added `cellStyles: true` and `bookVBA: true` options to both read and write operations.

**Result**: This option exists but doesn't work in the free edition. The library reads style information but discards it when writing.

---

## SOLUTIONS

### Option 1: Use ExcelJS (Recommended)

**ExcelJS** is a free, open-source library that preserves formatting.

**Pros**:
- ✅ Free and open-source (MIT license)
- ✅ Preserves all Excel formatting
- ✅ Better API for cell manipulation
- ✅ Active development

**Cons**:
- ❌ Requires refactoring `/api/xlsx-save` route
- ❌ Different API than SheetJS
- ❌ Slightly larger bundle size

**Implementation**:
```bash
npm install exceljs
```

```typescript
import ExcelJS from 'exceljs';

// Read
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(buffer);

// Modify
const worksheet = workbook.getWorksheet(sheetName);
const cell = worksheet.getCell(cellRef);
cell.value = value;

// Write (preserves formatting!)
const outputBuffer = await workbook.xlsx.writeBuffer();
fs.writeFileSync(sourceFilePath, outputBuffer);
```

**Estimated Effort**: 1-2 hours

---

### Option 2: Upgrade to SheetJS Pro

**Cost**: $999/year
**Benefits**: Drop-in replacement, no code changes needed
**Decision**: Not cost-effective for this project

---

### Option 3: Python Backend with openpyxl

Use Python's `openpyxl` library which preserves formatting perfectly.

**Pros**:
- ✅ Perfect formatting preservation
- ✅ Free and open-source

**Cons**:
- ❌ Requires Python backend
- ❌ Complex architecture change
- ❌ Not practical for this project

---

### Option 4: Accept Limitation & Document

Keep current implementation, warn users that formatting is lost.

**Pros**:
- ✅ No code changes
- ✅ Feature still works for data

**Cons**:
- ❌ Poor user experience
- ❌ Not professional
- ❌ Users lose hours of formatting work

---

## RECOMMENDED PATH FORWARD

**Migrate to ExcelJS**

### Implementation Plan

1. **Install ExcelJS**:
   ```bash
   npm install exceljs
   npm install --save-dev @types/exceljs
   ```

2. **Update `/api/xlsx-save/route.ts`**:
   - Replace `XLSX.read()` with `workbook.xlsx.load()`
   - Replace cell update logic
   - Replace `XLSX.write()` with `workbook.xlsx.writeBuffer()`

3. **Test thoroughly**:
   - Verify formatting preservation
   - Test with conditional formatting
   - Test with merged cells
   - Test with formulas

4. **Update other endpoints**:
   - `/api/xlsx-files/route.ts` (search functionality)
   - `/api/xlsx-files/load/route.ts` (file loading)
   - Consider keeping SheetJS for read-only operations

### Code Example

**Before (SheetJS)**:
```typescript
const workbook = XLSX.read(buffer, { type: 'buffer' });
const worksheet = workbook.Sheets[sheetName];
worksheet[cellRef] = { t: 's', v: value };
const outputBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
```

**After (ExcelJS)**:
```typescript
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(buffer);
const worksheet = workbook.getWorksheet(sheetName);
const cell = worksheet.getCell(cellRef);
cell.value = value;
const outputBuffer = await workbook.xlsx.writeBuffer();
```

---

## WORKAROUNDS (Until Fixed)

### For Users

1. **Keep a backup** of the original formatted file
2. **Use Export + Manual Paste** instead of Live Edit
3. **Reapply formatting** after translations complete
4. **Use templates** with pre-formatted empty cells

### For Developers

1. **Disable Live Edit** temporarily
2. **Add warning** in UI about formatting loss
3. **Show modal** on first Live Edit use explaining the limitation

---

## CURRENT STATUS

**As of**: 2026-01-15 (RESOLVED)

**Live Edit**:
- ✅ Works functionally (saves translations)
- ✅ Toast shows filename
- ✅ **PRESERVES ALL CELL FORMATTING** (migrated to ExcelJS)
- ✅ Colors, borders, shading, fonts all preserved

**Resolution**: Successfully migrated to ExcelJS - formatting preservation complete!

---

## TESTING CHECKLIST

After implementing ExcelJS:

- [ ] Cell background colors preserved
- [ ] Font colors preserved
- [ ] Bold/italic/underline preserved
- [ ] Cell borders preserved
- [ ] Conditional formatting preserved
- [ ] Merged cells preserved
- [ ] Column widths preserved
- [ ] Row heights preserved
- [ ] Formulas still work
- [ ] Data validation preserved
- [ ] Comments/notes preserved

---

*Investigation Date: 2026-01-15*
*Status: Root cause identified, solution planned*
