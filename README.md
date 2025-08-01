# AM Translations Helper

A modern, elegant React TypeScript application for streamlining translation workflows. Features a minimalist black-and-white design with sophisticated UI elements and comprehensive functionality for both Excel-based and manual translation processes.

![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-teal)

## 🎨 Design Philosophy

This application embodies a **minimalist, professional aesthetic** with:
- Clean black-and-white color scheme
- Thin borders throughout (no rounded corners except 3px on buttons)
- Bold, modern typography with refined letter-spacing
- Subtle animations and transitions
- Fully functional dark mode with elegant transitions

## ✨ Key Features

### Core Functionality
- **📊 Excel File Support** - Import translations from `.xlsx` or `.xls` files
- **✍️ Manual Input Mode** - Paste text directly for quick translations
- **🔄 Reference Column Support** - Verify or correct existing translations
- **📋 One-Click Copy** - Export all translations with proper formatting
- **🎯 Step-by-Step Workflow** - Focus on one translation at a time
- **📚 Codex Consultation** - Browse lore and background information in a fly-out panel

### UI/UX Enhancements
- **🌓 Dark Mode** - Full dark theme with system preference detection
- **🎨 Animated Gradient Accent** - Dynamic 300x75px gradient block that changes on reload
- **✨ Smooth Transitions** - Elegant animations between UI states
- **📱 Responsive Design** - Works beautifully on all screen sizes
- **✓ ASCII Status Indicators** - Green checkmarks for successful operations

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd am-translations-helper

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom configurations
- **Excel Processing**: XLSX library
- **State Management**: React Hooks (useState, useEffect, useRef)

### Project Structure
```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main page component
│   ├── globals.css     # Global styles and animations
│   └── api/
│       └── codex/
│           └── route.ts # API endpoint for codex content
└── components/
    ├── TranslationHelper.tsx  # Core application component
    └── CodexPanel.tsx        # Codex consultation panel
```

## 🎯 Feature Implementation Details

### 1. **Input Mode Toggle**
Seamlessly switch between Excel upload and manual input modes with a sleek toggle interface:
- Smooth fade-in animations when switching modes
- Maintains minimum container height to prevent jarring transitions
- Each mode optimized for its specific use case

### 2. **Excel Processing**
Advanced Excel file handling with flexible configuration:
```typescript
// Column mapping options
- Utterer Column (Speaker names)
- Source Column (Text to translate)
- Reference Column (Existing translations)
- Start Row (Skip headers)
```

### 3. **Reference Translation Mode**
Unique verification workflow for existing translations:
- Pre-loads reference translations into the text area
- Visual indicator showing "Verification Mode"
- Allows editing and correction of existing translations

### 4. **Gradient Accent System**
Dynamic visual element that adds personality:
```javascript
// Random gradient generation from curated palettes
const palettes = [
  ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  ['#F7DC6F', '#76D7C4', '#85C1E2'],
  // ... more beautiful combinations
];
```
- Changes color palette on each page reload
- Accelerates animation during active translation
- Positioned as a focal point above the main title

### 5. **Dark Mode Implementation**
Comprehensive dark theme with attention to detail:
- LocalStorage persistence
- System preference detection
- Smooth color transitions (300ms)
- Custom colors for every UI element:
  - Backgrounds: `dark:bg-gray-900`, `dark:bg-gray-800`
  - Borders: `dark:border-gray-600`
  - Text: `dark:text-gray-100`, `dark:text-gray-400`
  - Interactive elements properly styled

### 6. **Typography System**
Refined text rendering throughout:
```css
/* Global typography settings */
body {
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: -0.011em;
}

/* Headers use tight tracking */
h1, h2, h3 {
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
}
```

### 7. **Progress Tracking**
Visual feedback for translation progress:
- Linear progress bar with smooth animations
- Real-time percentage calculation
- Current/Total item counter
- Per-item location tracking (Excel row or manual cell reference)

### 8. **Keyboard Shortcuts**
Enhanced productivity features:
- `Shift + Enter` - Submit current translation
- Full keyboard navigation support
- Auto-focus on translation textarea

### 9. **Codex Consultation System**
Integrated lore and background reference system:
- **Fly-out Panel** - Accessible from both setup and translation screens
- **Category Navigation** - Browse by Main Asses, Places, Supporting Asses, Themes, World
- **Markdown Rendering** - Displays actual content from codex files
- **API Integration** - Dynamic loading of codex structure and content
- **Fallback Support** - Graceful degradation if API is unavailable

## 🎨 Design Decisions

### Visual Hierarchy
1. **Headers** - `font-black` with gradient text effect
2. **Labels** - Uppercase with wide letter-spacing
3. **Body Text** - Natural weight with optimized line-height
4. **Monospace** - Reserved for code-like content (output box, manual input)

### Color Palette
- **Light Mode**: Pure black (#000) on white (#FFF)
- **Dark Mode**: Carefully chosen grays for optimal contrast
- **Accent Colors**: 
  - Blue for speaker information
  - Green for success states
  - Dynamic gradients for visual interest

### Animation Timing
- **Fast**: 200-300ms for UI interactions
- **Medium**: 500ms for state transitions
- **Slow**: 3s for ambient gradient animation

## 🔧 Customization

### Modifying Gradient Colors
Edit the color palettes in `TranslationHelper.tsx`:
```typescript
const palettes = [
  ['#YourColor1', '#YourColor2', '#YourColor3'],
  // Add more combinations
];
```

### Adjusting Dark Mode Colors
Modify Tailwind classes throughout the component:
- Replace `dark:bg-gray-900` with your preferred dark background
- Adjust `dark:text-gray-100` for text colors
- Update border colors with `dark:border-gray-600`

## 📝 Usage Examples

### Excel Upload Workflow
1. Click "Excel Upload" mode
2. Select your Excel file
3. Configure column mappings:
   - Set speaker column (e.g., "A")
   - Set source text column (e.g., "C")
   - Optionally set reference column for verification
4. Click "Start Translation"
5. Translate each item step-by-step
6. Copy all translations when complete

### Codex Consultation Workflow
1. Click the book icon (📚) in the top-right corner
2. Browse categories in the sidebar (Main Asses, Places, etc.)
3. Select an entry to view its content
4. Reference lore and background information while translating
5. Close the panel when finished consulting

### Manual Input Workflow
1. Click "Manual Input" mode
2. Paste your text (one item per line)
3. Set starting cell reference
4. Begin translating
5. Use Shift+Enter for quick submission

## 🚀 Performance Optimizations

- **Lazy Loading**: Excel processing only when needed
- **Memoization**: Gradient colors generated once per session
- **Efficient Re-renders**: Targeted state updates
- **CSS Animations**: Hardware-accelerated transforms

## 🤝 Contributing

This project follows best practices:
- **DRY Principle** - No code repetition
- **Type Safety** - Full TypeScript coverage
- **Accessibility** - ARIA labels and keyboard support
- **Clean Code** - Self-documenting with clear naming

## 📄 License

[Your License Here]

---

Built with ❤️ using modern web technologies. Designed for translators who appreciate beautiful, functional tools. 