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

### **Excel to JSON Conversion**
- **`excel-to-json.js`** - Converts Excel files to structured JSON format

### **Usage**
```bash
# Using npm script (recommended)
npm run excel-to-json

# Direct execution
node scripts/excel-to-json.js
```

### **Features**
- Batch processing of all Excel files in `excels/` folder
- Multi-sheet support with data extraction
- Structured JSON output with metadata
- Error handling and comprehensive logging
- Processing summary with statistics

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
- **Processing Summary**: `data/json/processing-summary.json`
- **Error Logs**: Console output with detailed information

## 🛠️ **Customization**

Scripts can be customized by editing:
- **Column mapping**: Modify data extraction logic
- **Output format**: Change JSON structure
- **File filtering**: Adjust which files are processed
- **Error handling**: Modify error handling behavior

---

*For detailed project information, see [docs/README.md](../docs/README.md)*
