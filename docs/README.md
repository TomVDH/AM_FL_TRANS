# AM Translations Helper

A comprehensive React TypeScript application for assisting with translation workflows, supporting Excel file uploads, manual text input, and advanced translation management features.

## 🚀 Features

### Core Translation Features
- **Excel File Processing**: Upload and parse Excel files for bulk translation workflows
- **Manual Text Input**: Individual translation mode for single text processing
- **Real-time Character Detection**: Automatic detection and insertion of character names
- **Codex Integration**: Reference system for characters, places, and lore
- **Progress Tracking**: Navigation and progress management for large translation sets

### Advanced UI/UX Features
- **Dark Mode Support**: Full UI responsiveness with dark/light theme switching
- **Gamepad/Dialogue Box Mode**: Pixel art styling for immersive translation experience
- **Cursor-Aware Insertion**: Smart character insertion at cursor position
- **Responsive Design**: Modern, accessible interface with Tailwind CSS

### Data Processing
- **Excel to JSON Conversion**: Batch processing of Excel files to structured JSON
- **Multi-Sheet Support**: Process all tabs and sheets from Excel files
- **Structured Data Export**: Consistent JSON format for translation workflows

## 📁 Project Structure

```
AM Translations Helper/
├── src/                          # Main application source
│   ├── app/                      # Next.js App Router
│   ├── components/               # React components
│   └── styles/                   # CSS and styling
├── excels/                       # Excel files for processing
├── data/                         # Processed data output
│   └── json/                     # JSON files from Excel conversion
├── scripts/                      # Utility scripts
│   ├── excel-to-json.js         # Excel to JSON converter
│   └── README.md                # Script documentation
├── codex/                        # Reference data and documentation
├── docs/                         # Project documentation
└── setup files                   # Automated setup scripts
```

## 🛠️ Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Automated Setup
```bash
# macOS/Linux
./setup.sh

# Windows
setup.bat

# Quick setup (non-interactive)
./quick-setup.sh
```

### Manual Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev
```

## 📊 Excel to JSON Conversion

The project includes a powerful Excel processing system that converts Excel files to structured JSON format.

### Features
- **Batch Processing**: Processes all `.xlsx` files in the `excels` folder
- **Multi-Sheet Support**: Extracts data from all tabs/sheets in each file
- **Structured Output**: Creates consistent JSON format for each file
- **Error Handling**: Gracefully handles processing errors and continues with other files

### Data Structure
The script extracts the following data from each Excel file:
- **Column A**: Utterer (speaker/character identifier)
- **Column B**: Context (description or context information)
- **Column C**: Source English (the text to be translated)
- **Row Number**: Excel row number for each entry
- **Sheet Name**: Name of the tab/sheet containing the data

### Usage
```bash
# Convert all Excel files to JSON
npm run excel-to-json

# Direct execution
node scripts/excel-to-json.js
```

### Output
- **Location**: `data/json/`
- **Individual files**: `data/json/[filename].json`
- **Summary**: `data/json/processing-summary.json`

### Processing Results
- **Total Files**: 14 Excel files processed
- **Total Sheets**: 136 sheets across all files
- **Total Entries**: 6,265 translation entries
- **Success Rate**: 100% (all files processed successfully)

## 🎮 Translation Workflow

### Excel Mode
1. Upload Excel file with translation data
2. Configure column mappings (Source, Utterer, Reference)
3. Navigate through translations with Previous/Next controls
4. Edit translations in real-time
5. Export completed translations

### Manual Mode
1. Enter source texts manually
2. Process translations one by one
3. Use character detection and insertion
4. Reference codex for context

### Gamepad Mode
- **Pixel Art Dialogue Box**: Immersive translation interface
- **Character Detection**: Automatic highlighting of character names
- **Click-to-Insert**: Click highlighted characters to insert into translation
- **Dark Mode Support**: Full theme responsiveness

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run excel-to-json # Convert Excel files to JSON
```

### Technology Stack
- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Excel Processing**: XLSX library
- **Fonts**: Google Fonts (Pixelify Sans for gamepad mode)

### Project Configuration
- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **PostCSS**: Autoprefixer and Tailwind CSS
- **Build Optimization**: Next.js production optimizations

## 📚 Documentation

### Core Documentation
- [Design System](README-Design-System.md) - UI components and styling guidelines
- [Refactor Plan](REFACTOR_PLAN.md) - Component modularization strategy
- [Setup Guide](SETUP.md) - Detailed setup and deployment instructions

### Script Documentation
- [Excel to JSON Script](scripts/README.md) - Detailed script usage and customization

### Code Documentation
- [TranslationHelper Component](src/components/TranslationHelper.tsx) - Main component with comprehensive refactoring annotations

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
No environment variables required for basic functionality.

### Build Output
- **Static Assets**: Optimized for production
- **Bundle Analysis**: Available in build output
- **Type Checking**: Integrated into build process

## 🔄 Version History

### v2.1.0 (Current)
- ✅ Excel to JSON conversion system
- ✅ Comprehensive script documentation
- ✅ Project structure organization
- ✅ Enhanced README documentation
- ✅ Automated setup scripts
- ✅ Dark mode and gamepad mode
- ✅ Character detection and insertion
- ✅ Codex integration

### v2.0.0
- ✅ Next.js 15 upgrade
- ✅ TypeScript implementation
- ✅ Tailwind CSS styling
- ✅ Excel file processing
- ✅ Translation workflow

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Follow Next.js recommendations
- **Prettier**: Consistent code formatting
- **Component Structure**: Follow React best practices

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For issues and questions:
1. Check the documentation files
2. Review the setup guides
3. Examine the code comments
4. Check the processing logs

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS** 