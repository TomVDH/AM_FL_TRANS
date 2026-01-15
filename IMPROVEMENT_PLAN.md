# AM Translations Helper - Improvement Plan

**Date**: 2026-01-15
**Version**: 2.0.0
**Status**: Ready for Implementation

Based on comprehensive code review by frontend, UX, and product specialists, this document outlines prioritized improvements to enhance code quality, accessibility, and user experience.

---

## Executive Summary

The AM Translations Helper is a solid, functional translation workflow tool with good technical foundations. However, several areas need attention:

- **Code Maintainability**: Main component is 2,139 lines and needs refactoring
- **Accessibility**: Missing WCAG compliance in focus indicators and color contrast
- **User Experience**: Lacking error handling, loading states, and mobile optimization
- **Performance**: Potential re-render issues due to hook complexity

---

## Phase 1: Critical Fixes (Priority: HIGH)

### 1.1 Accessibility Compliance (WCAG AA)
**Impact**: Legal compliance, inclusive design
**Effort**: Medium

- [ ] Add `:focus-visible` styles for all interactive elements
- [ ] Fix color contrast ratios (gray-400/gray-500 on light backgrounds)
- [ ] Ensure touch targets are minimum 44x44px
- [ ] Add screen reader labels to progress bar segments
- [ ] Add ARIA labels to file upload drag-and-drop zone
- [ ] Test with keyboard-only navigation
- [ ] Test with VoiceOver (Mac) / NVDA (Windows)

**Files Affected**:
- `src/components/SetupWizard.tsx` (lines 536-570, 477-519)
- `src/components/TranslationHelper.tsx` (lines 940-1007)
- `src/app/globals.css` (add focus styles)

---

### 1.2 Error Handling & User Feedback
**Impact**: Prevents user frustration and data loss
**Effort**: Medium

- [ ] Add file upload validation with error messages
- [ ] Implement loading states for all async operations
- [ ] Add success notifications for translation submissions
- [ ] Handle API failure gracefully with toast messages
- [ ] Add "unsaved changes" warning before navigation
- [ ] Implement error boundaries to prevent app crashes

**Implementation Pattern**:
```typescript
// Add loading state
const [isLoading, setIsLoading] = useState(false);

// Show errors with toast
if (error) {
  toast.error("Failed to save translation. Please try again.");
}

// Show success
toast.success("Translation saved successfully!");
```

**Files Affected**:
- `src/components/SetupWizard.tsx` (file upload)
- `src/components/TranslationHelper.tsx` (save operations)
- All API route handlers

---

### 1.3 Mobile Responsiveness
**Impact**: Makes app usable on tablets and phones
**Effort**: High

- [ ] Fix two-column layout for mobile (stack vertically)
- [ ] Ensure touch targets meet 44x44px minimum
- [ ] Add touch-friendly file selection (not just drag-drop)
- [ ] Optimize modals for small screens (max-h, scrolling)
- [ ] Test on real iOS and Android devices

**Breakpoint Strategy**:
```
sm: 640px   - Single column, stacked layout
md: 768px   - Tablet optimized
lg: 1024px  - Two-column layout
xl: 1280px  - Full desktop experience
```

**Files Affected**:
- `src/components/TranslationHelper.tsx` (layout grid)
- `src/components/SetupWizard.tsx` (file upload UI)

---

## Phase 2: Code Refactoring (Priority: MEDIUM)

### 2.1 Break Up TranslationHelper.tsx
**Impact**: Improved maintainability, easier testing
**Effort**: High

**Current**: 2,139 lines, 121 hook properties, complex dependency tree

**Target Structure**:
```
src/components/
├── TranslationHelper.tsx           (300 lines - orchestration only)
├── TranslationView/
│   ├── SourcePanel.tsx            (source text, speaker info)
│   ├── TranslationPanel.tsx       (translation input, controls)
│   ├── ReferencePanel.tsx         (existing component)
│   └── OutputPanel.tsx            (results table)
├── TranslationControls/
│   ├── NavigationControls.tsx     (prev/next, jump)
│   ├── FilterControls.tsx         (status filters)
│   └── ExportControls.tsx         (copy, export)
└── hooks/
    └── useKeyboardShortcuts.ts    (extract keyboard logic)
```

**Refactoring Steps**:
1. Extract keyboard shortcuts to dedicated hook
2. Split render into SourcePanel, TranslationPanel, OutputPanel
3. Move modal logic to separate components
4. Create NavigationControls component

---

### 2.2 Consolidate Hooks
**Impact**: Reduces complexity, improves performance
**Effort**: Medium

**Issues**:
- `useTranslationState` returns 121 properties (too many)
- Duplicate hooks: `useExcelProcessing` + `useExcelProcessor`
- 3 separate animation hooks that could be one

**Refactoring Plan**:

1. **Split useTranslationState**:
   ```typescript
   // Before: 121 exports from one hook
   const { ...121 things } = useTranslationState();

   // After: Focused hooks
   const data = useTranslationData();        // sourceTexts, translations
   const actions = useTranslationActions();  // save, reset, navigate
   const filters = useTranslationFilters();  // filter, search
   ```

2. **Merge Excel hooks**:
   - Keep: `useExcelProcessing`
   - Delete: `useExcelProcessor` (duplicate functionality)

3. **Consolidate animations**:
   ```typescript
   // Before:
   useGradientBarAnimation()
   useFooterGradientAnimation()
   useInterfaceAnimations()

   // After:
   useAnimations('progressBar' | 'footer' | 'interface')
   ```

**Files to Refactor**:
- `src/hooks/useTranslationState.ts` (split into 3)
- `src/hooks/useExcelProcessor.ts` (delete)
- `src/hooks/use*Animation*.ts` (consolidate)

---

### 2.3 Clean Up Dead Code
**Impact**: Reduces bundle size, improves clarity
**Effort**: Low

- [ ] Remove or integrate `EnhancedTranslationHelper.tsx` (13KB unused)
- [ ] Remove commented-out advanced settings (SetupWizard lines 676-746)
- [ ] Remove debug comments ("remove after testing")
- [ ] Delete unused CSS classes

---

## Phase 3: Feature Improvements (Priority: LOW)

### 3.1 Undo/Redo Functionality
**Impact**: Prevents accidental data loss
**Effort**: Medium

Implement per-entry undo history:
```typescript
interface UndoStack {
  history: string[];      // Previous translation values
  currentIndex: number;   // Position in history
  maxHistory: 10;         // Limit stack size
}

// Actions:
- Ctrl+Z: Undo last change
- Ctrl+Shift+Z: Redo
```

---

### 3.2 Visual Auto-Save Indicator
**Impact**: Reduces user anxiety about data loss
**Effort**: Low

Add save status indicator:
```tsx
<div className="flex items-center gap-2 text-sm">
  {syncStatus === 'saving' && (
    <>
      <Spinner />
      <span>Saving...</span>
    </>
  )}
  {syncStatus === 'saved' && (
    <>
      <CheckIcon className="text-green-500" />
      <span>Saved {formatTime(lastSyncTime)}</span>
    </>
  )}
</div>
```

---

### 3.3 Interactive Progress Bar
**Impact**: Faster navigation
**Effort**: Low

Make progress bar segments clickable:
- Click on segment → jump to that entry
- Show tooltip on hover with entry details

---

### 3.4 UI Consistency Polish
**Impact**: Professional appearance
**Effort**: Low

Standardize:
- Button sizes: 44px for icon buttons
- Font weights: headings = font-black, UI = font-medium
- Spacing: Use 4, 6, 8 (remove 5s)
- Text sizes: Limit to xs, sm, base, lg, xl, 2xl

---

## Phase 4: Performance Optimization (Priority: LOW)

### 4.1 Reduce Re-renders
**Effort**: Medium

- [ ] Add `React.memo` to heavy components (ReferenceToolsPanel, SetupWizard)
- [ ] Use `useMemo` for expensive computations (filtered lists, search results)
- [ ] Use `useCallback` for event handlers passed to children
- [ ] Audit useEffect dependency arrays (line 535 has 15 dependencies!)

### 4.2 Performance Monitoring
**Effort**: Low

- [ ] Use React DevTools Profiler to identify bottlenecks
- [ ] Measure translation submission time
- [ ] Profile Excel file loading for large files

---

## Testing Checklist

Before marking improvements complete, test:

- [ ] Keyboard-only navigation (unplug mouse)
- [ ] Screen reader (VoiceOver/NVDA)
- [ ] Mobile devices (real iPhone/Android)
- [ ] Color contrast (browser DevTools)
- [ ] Slow network (throttle in DevTools)
- [ ] Large Excel files (10,000+ rows)
- [ ] Error scenarios (bad file, network failure)

---

## Success Metrics

Track these before/after improvements:

| Metric | Before | Target |
|--------|--------|--------|
| Main component LOC | 2,139 | < 400 |
| Hook property exports | 121 | < 30 per hook |
| WCAG contrast failures | ~12 | 0 |
| Touch target failures | ~8 | 0 |
| Lighthouse accessibility | ? | > 95 |
| Time to interactive | ? | < 3s |

---

## Implementation Order

**Week 1**: Phase 1 (Critical Fixes)
- Days 1-2: Accessibility fixes
- Days 3-4: Error handling & loading states
- Day 5: Mobile responsiveness

**Week 2**: Phase 2 (Code Refactoring)
- Days 1-3: Break up TranslationHelper
- Days 4-5: Consolidate hooks

**Week 3**: Phase 3 & 4 (Polish)
- Days 1-2: Feature improvements
- Days 3-4: Performance optimization
- Day 5: Testing and QA

---

## Notes from Reviewers

**Frontend Developer (Thieuke)**:
> "You've over-engineered the abstraction layer. The hook architecture has become its own complexity problem. But the foundation is solid - just needs consolidation."

**UX Designer (Jonas)**:
> "Core functionality is solid, ya? But user experience needs attention in accessibility, error handling, and mobile. Fix WCAG issues first!"

**Product Manager (Kev)**:
> "Well-scoped for primary use case. Main risks are feature creep and maintenance burden. Ship what you have, iterate on feedback, resist adding features nobody asked for."

---

## Related Documents

- See `/docs` folder for detailed architecture docs
- See `README.md` for setup and usage
- See recent git commits for feature history

---

**Generated**: 2026-01-15
**Review Date**: TBD (after Phase 1 completion)
