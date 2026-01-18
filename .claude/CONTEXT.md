# Session Context - AM FL TRANS

**Last Updated:** 2026-01-16
**Version:** 3.1.0
**Status:** Phase A complete, Phase B partially complete

---

## What This App Does

A translation helper tool for processing Excel files containing Dutch source text. Users upload an Excel file, select which sheet/column contains the Dutch text, then work through translations one by one. The app tracks progress, allows filtering by status, and exports completed translations.

---

## Completed Work (v3.1.0)

### Phase A: Code Cleanup (100% Complete)

1. **Constants extracted** → `src/constants/translations.ts`
   - `BLANK_PLACEHOLDER`, `MAX_FILE_SIZE_MB`, `DUTCH_COLUMN_INDEX`, etc.
   - All 54+ string literal references now use the constant

2. **Utilities extracted** → `src/utils/fileValidation.ts`, `translationHelpers.ts`
   - Deduplicated validation logic from 3 locations
   - Consolidated blank-check patterns

3. **useTranslationState split** into focused hooks:
   - `useTranslationCore.ts` - sourceTexts, translations, currentIndex
   - `useFilterState.ts` - filterOptions, filteredIndices
   - `useLiveEdit.ts` - liveEditMode, syncStatus
   - `useUIState.ts` - animations, input mode
   - `useTextOperations.ts` - copy, insert, trim functions
   - Main hook is now a thin composition layer

4. **TranslationHelper decomposed** into sub-components:
   - `TranslationHeader.tsx`
   - `TranslationInput.tsx`
   - `TranslationActions.tsx`
   - `OutputPanel.tsx`
   - `KeyboardShortcutsModal.tsx`

### Phase B2: Component Standardization (Complete)

- **Button** - 5 variants, 3 sizes, loading state, icon support
- **Input/TextArea/Select** - 3 sizes, labels, errors, help text, icons
- All use `useId()` for accessibility
- Consistent prop naming across components

### Wow Mode (Easter Egg - Complete)

Hidden feature activated by triple-clicking the version footer:
- `src/hooks/useWowMode.ts` - Triple-click detection, localStorage persistence
- `src/utils/celebrations.ts` - Confetti, sparkle, rainbow effects
- Triggers on translation milestones (10, 25, 50, 100, etc.)
- Works on both SetupWizard and TranslationHelper screens

---

## Remaining Work (From Plan)

### Phase B1: Token System
Create `src/tokens/` with:
- `colors.ts`, `spacing.ts`, `typography.ts`, `shadows.ts`, `animations.ts`
- Update `tailwind.config.ts` to use tokens

### Phase B3: New Components (~20 needed)
- **Layout:** Stack, Grid, Container, Divider
- **Form:** FormField, Checkbox, Radio, Switch, FileInput
- **Overlay:** Modal, Dropdown, Popover, Tooltip, Toast
- **Data:** Table, Tabs, Accordion, Breadcrumbs, Pagination, ProgressBar, Alert

### Phase B4: Special Modes as Packages
Extract to `src/modes/`:
- `wow/` - Celebrations, magnetic buttons
- `gamepad/` - Pixel-art dialog
- `highlighting/` - Text highlighting

### Phase B5: App Feature Completion
- Live Edit mode UI (toggle, status indicator)
- Session persistence UI ("Resume session?" modal)

### Phase B6: Storybook Documentation
- Set up `.storybook/` config
- Create stories for all components
- Add a11y addon

### Phase B7: Accessibility & Polish
- Modal focus trap (hook exists but not implemented)
- Session persistence (hook exists but not implemented)
- Color contrast fixes
- `prefers-reduced-motion` support
- Skip link

### Phase B8: Design System Extraction
Package as standalone design system with optional modes.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useTranslationState.ts` | Main composition hook |
| `src/components/TranslationHelper.tsx` | Main translation screen |
| `src/components/SetupWizard.tsx` | File upload/config screen |
| `src/components/ui/Button.tsx` | Button component |
| `src/components/ui/Input.tsx` | Input, TextArea, Select |
| `src/hooks/useWowMode.ts` | Easter egg hook |
| `src/utils/celebrations.ts` | Celebration effects |
| `src/constants/translations.ts` | App constants |

---

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

---

## Notes for Next Session

1. The plan file at `.claude/plans/compiled-stargazing-badger.md` contains full details
2. `useSessionPersistence` and `useFocusTrap` are commented out in index.ts - need implementation
3. All cleanup is done - next work is additive (new components, Storybook)
4. The app is fully functional; remaining work is polish and design system extraction
