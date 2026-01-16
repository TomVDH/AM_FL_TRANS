# AM Translations Helper - Context for Claude

Last updated: 2026-01-15

## What This Is

Internal translation workflow tool for processing Excel files with source text. Translators work through entries one by one, with support for JSON/CSV reference files and live-edit mode that syncs changes back to Excel.

**Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS, GSAP, Sonner (toasts)

## Architecture Overview

```
src/
  app/           Next.js app router, API routes for file operations
  components/    TranslationHelper (main), SetupWizard, modals, UI primitives
  hooks/         State management split across ~15 hooks
  utils/         Celebrations, helpers
```

### Key Components

- **SetupWizard.tsx** - File upload, mode selection, configuration
- **TranslationHelper.tsx** - Main translation interface, orchestrates hooks
- **ReferenceToolsPanel.tsx** - CSV/JSON reference lookup sidebar

### Important Hooks

- `useTranslationState.ts` - Core state (currentIndex, translations, sourceTexts)
- `useTranslationWorkflow.ts` - Navigation, save/export logic
- `useJsonMode.ts` - JSON file handling with filtering
- `useExcelProcessing.ts` - Excel parsing
- `useSessionPersistence.ts` - localStorage session restore
- `useWowMode.ts` - Toggle for celebration effects
- `useInterfaceAnimations.ts` - GSAP animations including segment celebrations

## Current Audit Status

A 7-agent audit graded the app C+ (76/100). Full details in `/AUDIT_IMPROVEMENT_PLAN.md`.

### Wow Mode - IMPLEMENTED

**What's done:**
- `useWowMode.ts` - Boolean toggle persisted to localStorage
- `celebrations.ts` - Confetti variants (completion, milestones)
- `useMagneticButton.ts` - GSAP magnetic pull effect (created but not used)
- WOW toggle button in footer (purple/pink gradient)
- Confetti fires on completion & milestones
- GSAP progress bar segment celebration animation
- Colored gradients on buttons when wow mode enabled:
  - Prev button: Violet/purple
  - Next button: Fuchsia/pink
  - Submit button: Emerald/green
  - Mode toggles: Various colors when active

### What Needs Doing

1. **Apply useFocusTrap** - To ResetConfirmationModal and any other modals
2. **Replace remaining alert()** - Search for `alert(` and convert to `toast.error()`
3. **Delete dead code** - EnhancedTranslationHelper.tsx (already marked deleted in git)

## Key Decisions Made

- Wow mode is OPT-IN (toggle, not default)
- Gamepad mode stays (fun novelty)
- Multi-format support stays (Excel/JSON/CSV)
- `fireEntryConfetti()` - NOT used (too much confetti per user decision)
- `useMagneticButton` hook - NOT used (CSS glow effect is sufficient)

## Running Locally

```bash
npm install
npm run dev
```

Files go in `/excels/`, `/data/json/`, `/data/csv/`
