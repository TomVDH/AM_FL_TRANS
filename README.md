# AM Translations Helper

A sophisticated, professional React TypeScript application designed for streamlining translation workflows. Features an elegant minimalist design with comprehensive functionality for both Excel-based and manual translation processes.

![Next.js](https://img.shields.io/badge/Next.js-14.2.31-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-teal)

## 🎯 Overview

AM Translations Helper is a modern web application built for professional translators working on content with rich world-building and character development. It provides an intuitive interface for managing translation workflows while offering contextual reference materials through an integrated codex system.

## ✨ Key Features

### 🔄 Dual Input Modes
- **📊 Excel Integration** - Import from `.xlsx` or `.xls` files with flexible column mapping
- **✍️ Manual Input** - Direct text input for quick translation tasks

### 🎯 Advanced Translation Features
- **Reference Column Support** - Load and verify existing translations
- **Progress Tracking** - Visual progress indicators and completion statistics
- **One-Click Export** - Copy all translations with proper formatting
- **Keyboard Shortcuts** - `Shift + Enter` to submit translations
- **Jump Navigation** - Quick navigation to any translation item

### 🎮 Display Modes
- **Standard Mode** - Clean, professional interface
- **Pixel Dialog Mode** - Retro RPG-style dialog box with VT323 font
- **Eye Mode** - Preview translations in context

### 📚 Integrated Codex System
- **Dynamic Reference** - Contextual character and lore information
- **Smart Detection** - Automatic character name highlighting
- **Quick Insert** - Character name insertion with pill buttons
- **Expandable Content** - Detailed background information in accordion format

### 🎨 Design Excellence
- **Minimalist Aesthetic** - Clean black-and-white design with thin borders
- **Dark Mode** - Complete dark theme with smooth transitions
- **Responsive Design** - Perfect on all screen sizes
- **Animated Gradients** - Dynamic visual accents that respond to activity
- **Accessibility First** - Proper focus states and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd am-translations-helper

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/codex/           # Codex data API endpoint
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles and animations
├── components/
│   ├── ui/                  # Reusable UI component library
│   │   ├── Button.tsx       # Button component with variants
│   │   ├── Card.tsx         # Card component
│   │   ├── Badge.tsx        # Badge/pill components
│   │   ├── Input.tsx        # Form input components
│   │   ├── Typography.tsx   # Text components
│   │   ├── DesignSystem.tsx # Component showcase
│   │   └── index.ts         # Component exports
│   └── TranslationHelper.tsx # Main application component
├── styles/
│   └── design-system.css    # Design system styles
codex/                       # Reference materials (markdown files)
├── Main Asses/             # Main character information
├── Supporting Asses/       # Supporting character details
├── Places/                 # Location descriptions
├── Themes/                 # Thematic content
└── World/                  # World-building materials
```

## 🎨 Design System

The application includes a comprehensive design system with reusable components:

- **Typography** - 7 semantic text components
- **Buttons** - 4 variants with 3 sizes
- **Cards** - 3 elevation variants
- **Badges** - 5 color variants
- **Forms** - Input, TextArea, Select with validation

See [README-Design-System.md](./README-Design-System.md) for detailed documentation.

## 🔧 Configuration

### Excel Import Settings
- **Source Column** - Column containing text to translate
- **Speaker Column** - Column with character/speaker names
- **Reference Column** - Optional existing translations
- **Start Row** - Row to begin processing (skip headers)

### Codex Integration
The application automatically scans the `codex/` directory for markdown files and creates:
- Category-based organization
- Character name detection
- Contextual highlighting
- Quick-access reference panels

## 💡 Usage Examples

### Excel Workflow
1. Upload `.xlsx` file using "Choose Excel File"
2. Configure column mappings if needed
3. Set start row to skip headers
4. Click "Start Translation →"
5. Translate items one by one
6. Export completed translations

### Manual Workflow  
1. Switch to "Manual Input" mode
2. Paste source text in the text area
3. Start translating
4. Use character quick-insert buttons
5. Copy final translations

### Advanced Features
- **Reference Mode** - Enable reference column to verify existing translations
- **Gamepad Mode** - Toggle pixel dialog box for immersive experience
- **Dark Mode** - Switch themes with the moon/sun icon
- **Character Detection** - Names are automatically highlighted and clickable

## 🎯 Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **XLSX** - Excel file processing
- **Google Fonts** - VT323 pixel font for retro mode

## 🔒 Privacy & Security

- **Client-side Processing** - Excel files processed locally in browser
- **No Data Transmission** - Translation content never leaves your device
- **Local Storage** - Preferences saved locally only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and accessibility best practices
4. Ensure all components are responsive and support dark mode
5. Submit a pull request

## 📄 License

Copyright © 2025 Onnozelaer Marketing Works - Made with Generative AI

## 🆘 Support

For support or questions about using the AM Translations Helper:
1. Check the design system documentation
2. Review the component showcase at `/design-system`
3. Ensure your Excel files follow the expected format

---

**Built with ❤️ for professional translators working on rich, narrative content.** 