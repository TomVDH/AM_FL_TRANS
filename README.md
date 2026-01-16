# AM Translations Helper

A React TypeScript application for translation workflows. Supports Excel file uploads, JSON/CSV data files, and manual text input.

## Quick Start

```bash
npm install
npm run dev
```

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # React components
├── hooks/            # Custom React hooks
└── utils/            # Utility functions

data/
├── json/             # JSON data files
└── csv/              # CSV data files

excels/               # Excel files for processing
docs/                 # Project documentation
```

## Features

- Excel file processing with column configuration
- JSON/CSV data file support
- Live edit mode with auto-sync
- Dark mode support
- Keyboard shortcuts
- Progress tracking with session persistence
- Celebration effects (toggleable)

Built with Next.js, TypeScript, and Tailwind CSS
