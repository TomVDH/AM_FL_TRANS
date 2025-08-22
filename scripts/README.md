# Scripts and Utilities

This folder contains setup scripts and utility tools for the AM Translations Helper project.

## 🚀 **Setup Scripts**

### **Primary Setup**
- **`setup.sh`** - Main setup script for Unix/Linux/macOS systems
- **`setup.bat`** - Setup script for Windows systems
- **`quick-setup.sh`** - Quick setup for development environments

### **Usage**
```bash
# Unix/Linux/macOS
./scripts/setup.sh

# Windows
scripts\setup.bat

# Quick development setup
./scripts/quick-setup.sh
```

## 📊 **Excel Processing**

### **Excel to JSON/CSV Conversion**
- **`excel-to-json.js`** - Converts Excel files to both JSON and CSV formats

### **Usage**
```bash
# Using npm script (recommended) - processes to both JSON and CSV
npm run excel-to-json
npm run excel-to-csv  # Same as above, for clarity

# Direct execution
node scripts/excel-to-json.js
```

### **Features**
- **Dual Output**: Both JSON and CSV formats generated simultaneously
- **Batch Processing**: All Excel files in `excels/` folder processed
- **Multi-sheet Support**: Each sheet becomes a section in CSV
- **CSV Structure**: Headers, proper escaping, sheet separation
- **Dynamic Consultation**: CSV files served via API for translation assistance
- **Error Handling**: Comprehensive logging and error recovery
- **Processing Summary**: Detailed statistics and success rates

### **Output Formats**

#### **JSON Output** (for auto-highlighter)
```json
{
  "fileName": "1_asses.masses_E1Proxy",
  "sheets": [
    {
      "sheetName": "Episode1", 
      "entries": [
        {
          "rowNumber": 2,
          "utterer": "Big Ass",
          "context": "Dialogue",
          "sourceEnglish": "Hello there!",
          "translatedDutch": "Hallo daar!"
        }
      ]
    }
  ]
}
```

#### **CSV Output** (for dynamic consultation)
```csv
# Sheet: Episode1
Row,Context,Key,English,Dutch,Utterer
2,Dialogue,"","Hello there!","Hallo daar!","Big Ass"
3,Dialogue,"","How are you?","Hoe gaat het?","Nice Ass"
```

### **Processing Results**
- **Total Files**: 14 Excel files
- **Total Sheets**: 136 sheets
- **Total Entries**: 6,265 entries
- **Success Rate**: 100%

## 🔧 **Script Details**

### **Setup Scripts**
The setup scripts handle:
- Node.js dependency installation
- Build process setup
- Development environment configuration
- Platform-specific optimizations

### **Excel Processing Script**
The Excel to JSON script:
- Extracts data from columns A, B, C, and J
- Creates consistent JSON structure
- Handles multiple file formats
- Provides detailed processing logs
- Generates summary reports

## 📁 **Output Locations**

- **JSON Files**: `data/json/[filename].json`
- **CSV Files**: `data/csv/[filename].csv`
- **Processing Summary**: `data/json/processing-summary.json`
- **Error Logs**: Console output with detailed information

## 🔌 **API Integration**

### **Dynamic CSV Consultation**
The CSV files are automatically served via API endpoints for real-time translation assistance:

#### **Load Specific CSV File**
```bash
GET /api/csv-data?file=1_asses.masses_E1Proxy.csv&format=json
```

#### **Search Across Multiple Files**
```bash
POST /api/csv-data
{
  "files": ["1_asses.masses_E1Proxy.csv", "2_asses.masses_E2Proxy.csv"],
  "searchTerm": "Big Ass", 
  "context": "Character",
  "maxResults": 50
}
```

#### **Quick Translation Suggestions**
The `useCSVConsultation` hook provides:
- **Real-time suggestions** based on current text
- **Cross-file searching** across all EPx files
- **Caching** for improved performance
- **Translation consultation** for source text matching

## 🛠️ **Customization**

Scripts can be customized by editing:
- **Column mapping**: Modify data extraction logic
- **Output format**: Change JSON structure
- **File filtering**: Adjust which files are processed
- **Error handling**: Modify error handling behavior

---

*For detailed project information, see [docs/README.md](../docs/README.md)*
