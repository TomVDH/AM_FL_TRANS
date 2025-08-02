# AM Translations Helper

A comprehensive React TypeScript application for assisting with translation workflows, supporting Excel file uploads, manual text input, and advanced translation management features.

## 🚀 Quick Start

```bash
# Automated setup (recommended)
./setup.sh

# Or manual setup
npm install
npm run build
npm run dev
```

## 📊 Excel to JSON Conversion

Process all Excel files in the `excels` folder to structured JSON:

```bash
npm run excel-to-json
```

**Results**: 14 files processed, 136 sheets, 6,265 entries

## 🎮 Features

- **Excel File Processing**: Upload and parse Excel files for bulk translation workflows
- **Manual Text Input**: Individual translation mode for single text processing
- **Real-time Character Detection**: Automatic detection and insertion of character names
- **Codex Integration**: Reference system for characters, places, and lore
- **Dark Mode Support**: Full UI responsiveness with dark/light theme switching
- **Gamepad/Dialogue Box Mode**: Pixel art styling for immersive translation experience
- **Excel to JSON Conversion**: Batch processing of Excel files to structured JSON

## 📚 Documentation

- **[Comprehensive Documentation](docs/README.md)** - Complete project overview and guides
- **[Design System](docs/README-Design-System.md)** - UI components and styling guidelines
- **[Refactor Plan](docs/REFACTOR_PLAN.md)** - Component modularization strategy
- **[Setup Guide](docs/SETUP.md)** - Detailed setup and deployment instructions
- **[Script Documentation](scripts/README.md)** - Excel to JSON conversion details

## 🔧 Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run excel-to-json # Convert Excel files to JSON
```

## 📁 Project Structure

```
AM Translations Helper/
├── src/                          # Main application source
├── excels/                       # Excel files for processing
├── data/json/                    # Processed JSON output
├── scripts/                      # Utility scripts
├── docs/                         # Project documentation
├── codex/                        # Reference data
└── setup files                   # Automated setup scripts
```

## 🆘 Support

For detailed information, see the [comprehensive documentation](docs/README.md).

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS** 