# Changelog

All notable changes to the AM Translations Helper project will be documented in this file.

## [2.2.0] - 2025-08-02

### Added
- **Excel to JSON Conversion System**: Comprehensive batch processing of Excel files
  - Processes all `.xlsx` files in the `excels` folder
  - Extracts data from all tabs/sheets (136 total sheets)
  - Structured JSON output with 6,265 total entries
  - Column mapping: A (Utterer), B (Context), C (Source English)
  - Row numbers and sheet names preserved
  - Error handling and detailed logging

- **Script Documentation**: Comprehensive documentation for Excel processing
  - Detailed usage instructions
  - Customization guidelines
  - Troubleshooting section
  - Integration examples

- **Project Organization**: Improved project structure
  - Moved documentation to `docs/` folder
  - Created comprehensive main documentation
  - Organized setup scripts and utilities
  - Enhanced README with quick start guide

- **Automated Setup Scripts**: Cross-platform setup automation
  - `setup.sh` for macOS/Linux
  - `setup.bat` for Windows
  - `quick-setup.sh` for non-interactive setup
  - Comprehensive error handling and validation

### Changed
- **Documentation Structure**: Reorganized documentation for better accessibility
  - Main README now concise overview with links to detailed docs
  - Comprehensive documentation in `docs/README.md`
  - Design system, refactor plan, and setup guides in docs folder
  - Script documentation in `scripts/README.md`

- **Package Scripts**: Added Excel processing script
  - `npm run excel-to-json` for batch Excel processing
  - Integrated with existing npm scripts

### Technical Details
- **Processing Results**: 14 Excel files, 136 sheets, 6,265 entries
- **Success Rate**: 100% (all files processed successfully)
- **Output Location**: `data/json/` with individual files and summary
- **Error Handling**: Graceful error handling with detailed logging
- **Performance**: Efficient batch processing with progress indicators

## [2.1.0] - 2025-08-02

### Added
- **Dark Mode Support**: Complete dark theme implementation
  - System preference detection
  - Manual toggle with persistent storage
  - Full UI responsiveness across all components

- **Gamepad/Dialogue Box Mode**: Pixel art translation interface
  - Compact dialogue box design (325px × 125px)
  - Pixel font (Pixelify Sans) for immersive experience
  - Removed corner decorations and simplified continue indicator
  - Dark mode responsive background gradients

- **Cursor-Aware Character Insertion**: Smart text insertion
  - Characters insert at current cursor position
  - Maintains focus and cursor position after insertion
  - Fallback to append if textarea ref unavailable
  - Improved translation workflow efficiency

- **Component Refactoring Annotations**: Comprehensive documentation
  - 10 future refactoring modules identified
  - Detailed state management annotations
  - Function extraction guidelines
  - Implementation strategy and file structure

### Changed
- **Dialogue Box Styling**: Reduced size and improved aesthetics
  - Half-size dimensions for better fit
  - Moved to bottom position
  - Eliminated "macOS-looking pips"
  - Increased chevron size and removed "continue" text
  - Enhanced dark mode responsiveness

- **Font Application**: Pixel font scope refinement
  - Pixel font applied only to dialogue box
  - Removed from translation text field and navigation buttons
  - Consistent with user requirements

### Technical Details
- **Font Loading**: Proper Next.js font optimization with CSS variables
- **State Management**: Enhanced cursor position tracking
- **Dark Mode**: Dynamic background gradients and theme switching
- **Component Structure**: 1553-line monolithic component with refactoring roadmap

## [2.0.0] - 2025-08-01

### Added
- **Next.js 15 Upgrade**: Latest framework version with App Router
- **TypeScript Implementation**: Full type safety across the application
- **Tailwind CSS Styling**: Utility-first CSS framework
- **Excel File Processing**: Upload and parse Excel files
- **Translation Workflow**: Complete translation management system
- **Codex Integration**: Reference system for characters and lore
- **Character Detection**: Automatic character name highlighting
- **Progress Tracking**: Navigation and completion management

### Technical Details
- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom design system
- **Excel Processing**: XLSX library for file handling
- **Fonts**: Google Fonts integration (Pixelify Sans)

---

## Version History Summary

- **v2.2.0**: Excel to JSON conversion, comprehensive documentation, project organization
- **v2.1.0**: Dark mode, gamepad mode, cursor-aware insertion, refactoring annotations
- **v2.0.0**: Next.js 15, TypeScript, Tailwind CSS, core translation features

For detailed information about each version, see the comprehensive documentation in the `docs/` folder. 