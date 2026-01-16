# AM Translations Helper - Comprehensive Audit & Improvement Plan

**Date:** January 15, 2026
**Auditors:** 7-Agent Specialist Team
**Context:** Internal single-purpose tool (not public/monetized)
**Overall Grade:** C+ (76/100) - Functional but needs polish before "wow-worthy"

---

## Executive Summary

Your translation app has solid bones and genuinely good ideas, but it's held back by:
- **Stability issues** (no error boundaries, crashes lose progress)
- **Performance bottlenecks** (unmemoized filters, 15+ hooks causing re-renders)
- **Missing visual polish** (GSAP installed but barely used, abrupt state changes)
- **UX friction** (no session persistence, developer language shown to users)
- **Feature sprawl** (3 input modes, duplicate hooks, unused components)
- **Accessibility gaps** (keyboard navigation, focus management)

Since this is an internal tool, we're **deprioritizing security hardening** in favor of:
1. **Rock-solid functionality** that won't crash or lose work
2. **Visual flair** that makes it feel premium and satisfying
3. **Ease of use** that minimizes friction for translators

The good news: most fixes are straightforward. This plan prioritizes by impact.

---

## Audit Scores by Domain

| Domain | Score | Auditor | Key Finding | Priority |
|--------|-------|---------|-------------|----------|
| Stability | 5/10 | Pieter | No error boundaries, crashes lose work | **P0** |
| Performance | 5/10 | Pieter | Unmemoized filters, 15+ hooks | **P0** |
| Visual Polish | 5/10 | Henske | GSAP installed but barely used | **P1** |
| UX Design | 7/10 | Jonas | Good loading states, needs feedback | **P1** |
| Accessibility | 6/10 | Jonas | Missing focus traps, keyboard nav | **P1** |
| User Clarity | 6/10 | Sammie | Developer language exposed to users | **P2** |
| Product Focus | 6/10 | Kev | Feature sprawl, incomplete features | **P2** |
| Code Cleanliness | 5/10 | Tom | Dead code, duplicate hooks | **P2** |
| Backend/API | 5/10 | Sakke | Sync file ops, hardcoded config | **P2** |
| Documentation | 5/10 | Tom | Good arch docs, missing CHANGELOG | **P3** |

---

## Phase 1: Stability & Core Functionality (Do First)

### 1.1 Error Boundaries (CRITICAL)

**The problem:** One uncaught error crashes the entire app. Translator loses all their work.

**The fix:** Create `src/components/ErrorBoundary.tsx`:
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-center">
        <h2>Something went wrong</h2>
        <button onClick={() => this.setState({ hasError: false })}>Try again</button>
      </div>;
    }
    return this.props.children;
  }
}
```

**Wrap around:**
- File upload sections in SetupWizard
- Translation workflow in TranslationHelper
- Any component that parses user files

### 1.2 Replace alert() with Toast (CRITICAL)

**Files affected:** 9 instances across hooks

**The problem:** `alert()` is blocking, feels dated, and breaks the flow.

**The fix:** App already has Sonner - use `toast.error()` instead:
```typescript
// Before
alert('Please provide source texts');

// After
toast.error('Please provide source texts');
```

**Locations to fix:**
- `useTranslationWorkflow.ts:58`
- `useExcelProcessor.ts:72, 78`
- `SetupWizard.tsx:286-287, 300-302`

### 1.3 Session Persistence (CRITICAL)

**The problem:** Browser close = lost progress. No "resume where you left off."

**The fix:** Add localStorage persistence:
```typescript
// In useTranslationState or main component
useEffect(() => {
  const session = {
    currentIndex,
    selectedSheet,
    loadedFileName,
    lastUpdated: Date.now()
  };
  localStorage.setItem('translationSession', JSON.stringify(session));
}, [currentIndex, selectedSheet, loadedFileName]);

// On mount, check for existing session and prompt to resume
```

### 1.4 Memoize Performance Killers (HIGH)

**useJsonMode.ts:86-125** - `getFilteredEntries()` runs on EVERY render:
```typescript
// Before: O(n) on every single render
const getFilteredEntries = () => {
  return allEntries.filter(...)
}

// After: Only recomputes when dependencies change
const filteredEntries = useMemo(() => {
  return allEntries.filter(...)
}, [jsonData, jsonSearchTerm, selectedJsonSheet, globalSearch]);
```

**useCSVConsultation.ts:185-213** - `getQuickSuggestions()` is O(n*m):
```typescript
// Consider using Fuse.js for fuzzy search with indexing
// Or at minimum, memoize the result
const suggestions = useMemo(() => getQuickSuggestions(text), [text, loadedData]);
```

### 1.5 Fix Inconsistent Loading States (MEDIUM)

**Current state:** Some places use Spinner, others use text, others show nothing.

**Standardize to:**
- Always use `<Spinner />` component
- Always show descriptive label
- Add "This may take a moment for large files" for file operations

---

## Phase 2: Visual Polish & Animations (The Wow Factor)

GSAP is already installed but barely used. Let's make this thing SING.

### 2.1 Modal Entrance/Exit Animations (HIGH IMPACT)

**File:** `src/components/ResetConfirmationModal.tsx`

**Current:** Modal instantly appears/disappears (jarring)

**The fix:**
```typescript
useEffect(() => {
  if (isOpen) {
    // Backdrop fade
    gsap.fromTo('.modal-backdrop',
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );
    // Content scale + slide
    gsap.fromTo('.modal-content',
      { scale: 0.9, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }
    );
  }
}, [isOpen]);
```

### 2.2 Sidebar Slide-In Animation (HIGH IMPACT)

**File:** CSV sidebar, Reference Tools panel

**Current:** Just appears

**The fix:** Spring physics slide from right:
```typescript
// Using Framer Motion (or GSAP)
<motion.div
  initial={{ x: '100%', opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: '100%', opacity: 0 }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
/>
```

### 2.3 Button Hover Spring Physics (MEDIUM IMPACT)

**File:** `src/components/ui/Button.tsx`

**Current:** Basic transform translate-y with linear timing

**The fix:**
```typescript
const handleMouseEnter = () => {
  gsap.to(buttonRef.current, {
    y: -2,
    scale: 1.02,
    duration: 0.3,
    ease: 'back.out(1.7)'
  });
};

const handleMouseLeave = () => {
  gsap.to(buttonRef.current, {
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: 'elastic.out(1, 0.5)'
  });
};
```

### 2.4 Input Focus Glow Effect (MEDIUM IMPACT)

**Add to globals.css or Input component:**
```css
.input-glow {
  position: relative;
}

.input-glow::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  opacity: 0;
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
  filter: blur(8px);
  z-index: -1;
  transition: opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.input-glow:focus-within::after {
  opacity: 0.5;
}
```

### 2.5 Suggestion Items Stagger Animation

**File:** CSV suggestions, file lists

**The fix:**
```typescript
useEffect(() => {
  gsap.fromTo('.suggestion-item',
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: 'back.out(1.4)'
    }
  );
}, [suggestions]);
```

### 2.6 Page Transition (Setup → Translation)

**Current:** Instant screen swap

**The fix:**
```typescript
const screenTransition = (exitScreen: HTMLElement, enterScreen: HTMLElement) => {
  gsap.timeline()
    .to(exitScreen, { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' })
    .set(exitScreen, { display: 'none' })
    .set(enterScreen, { display: 'block' })
    .fromTo(enterScreen,
      { opacity: 0, scale: 1.05, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
};
```

### 2.7 File Upload Success Animation

**After successful file load:**
```typescript
gsap.timeline()
  .to('.upload-icon', { scale: 0, duration: 0.2 })
  .fromTo('.success-check',
    { scale: 0, rotation: -180 },
    { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }
  )
  .to('.success-check', {
    boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)',
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
```

---

## Phase 3: UX Improvements & Accessibility

### 3.1 Validation & Feedback

**SetupWizard.tsx:911-918** - Button disables with no explanation:
```typescript
// Add error message when button is disabled
{(sourceTexts.length === 0 && !selectedDataFile && !selectedExistingFile) && (
  <p className="text-sm text-red-500 mt-2">
    Please select a file or enter text to continue
  </p>
)}
```

### 3.2 Empty State Messages

**Current:** "No Excel files found in /excels folder"
**Better:**
```tsx
<div className="text-center py-8">
  <p className="text-gray-500">No Excel files found</p>
  <p className="text-sm text-gray-400 mt-1">
    Upload a file above to get started
  </p>
</div>
```

### 3.3 User-Friendly Language

| Current (Developer) | Better (User) |
|---------------------|---------------|
| "Column J (hardcoded)" | Hide completely (internal detail) |
| "[BLANK, REMOVE LATER]" | Empty field with "Enter translation..." placeholder |
| "Modified entries" | "Your changes" |
| "Embedded JSON" | "Saved Projects" |
| "LIVE EDIT mode" | "Auto-save enabled" |
| "Starting Cell" | "Where to begin in spreadsheet" + helper text |

### 3.4 Keyboard Accessibility

**Focus trap for modals:**
```bash
npm install react-focus-lock
```
```typescript
import FocusLock from 'react-focus-lock';

<FocusLock>
  <div className="modal-content">...</div>
</FocusLock>
```

**Progress bar segments:**
```typescript
// Change from tabIndex={-1} to tabIndex={0}
// Add keyboard handler
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleSegmentClick(index);
  }
}}
```

**Dynamic aria-labels:**
```typescript
// SetupWizard.tsx dark mode toggle
aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
```

### 3.5 Helper Text for Confusing Inputs

**Starting Cell input:**
```tsx
<label className="block text-base font-black mb-2">Starting Cell</label>
<p className="text-sm text-gray-500 mb-2">
  Which cell in your Excel file should translations start from?
</p>
<input type="text" value={cellStart} placeholder="A1" />
```

---

## Phase 4: Code Cleanup

### 4.1 Delete Dead Code

| File | Size | Action |
|------|------|--------|
| `EnhancedTranslationHelper.tsx` | 13KB | DELETE - unused component |
| Hidden Manual Input mode toggle | - | DELETE - remove from DOM |
| Reference Column feature code | - | DECIDE - complete or remove |
| Duplicate hooks | - | MERGE - see below |

### 4.2 Consolidate Hooks

**Animation hooks (3→1):**
- `useGradientBarAnimation`
- `useFooterGradientAnimation`
- `useInterfaceAnimations`
→ Merge into single `useAnimations` hook

**Excel hooks (2→1):**
- `useExcelProcessing`
- `useExcelProcessor`
→ Keep one, delete the other

**Target:** Reduce from 15+ hooks to <8 in TranslationHelper.tsx

### 4.3 Convert Sync to Async File Operations

**File:** `src/app/api/codex/route.ts:70-95`

```typescript
// Before: Blocks event loop
const files = fs.readdirSync(codexDir);
const content = fs.readFileSync(filePath, 'utf-8');

// After: Non-blocking
const files = await fs.promises.readdir(codexDir);
const content = await fs.promises.readFile(filePath, 'utf-8');
```

---

## Phase 5: Wow Factor Extras

### 5.1 Confetti on Batch Completion

```bash
npm install canvas-confetti  # Only 1.9kb gzipped
```
```typescript
import confetti from 'canvas-confetti';

const celebrateCompletion = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#10b981', '#8b5cf6']
  });
};
```

### 5.2 Progress Bar Celebrations

When completing a segment:
```typescript
gsap.timeline()
  .fromTo(segment,
    { scaleX: 0, transformOrigin: 'left' },
    { scaleX: 1, duration: 0.6, ease: 'power2.out' }
  )
  .to(segment, {
    boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)',
    duration: 0.4,
    yoyo: true,
    repeat: 1
  }, '-=0.3');
```

### 5.3 Magnetic Button Effect (Primary CTA)

Button "pulls" toward cursor within proximity:
```typescript
const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  const distance = Math.sqrt(x * x + y * y);
  const maxDistance = 100;

  if (distance < maxDistance) {
    const strength = (maxDistance - distance) / maxDistance;
    gsap.to(button, {
      x: x * strength * 0.2,
      y: y * strength * 0.2,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
};
```

### 5.4 Quick Documentation Fixes

| Task | Effort |
|------|--------|
| Fix broken README link to `archived-markdowns/` | 5 min |
| Create basic CHANGELOG.md from git history | 30 min |

---

## Implementation Order

### Week 1: Stability & Core Fixes (P0)
- [ ] Add error boundaries (prevent crashes)
- [ ] Replace all alert() with toast (9 instances)
- [ ] Add session persistence (localStorage)
- [ ] Memoize getFilteredEntries() and getQuickSuggestions()
- [ ] Standardize loading states

### Week 2: Visual Polish (P1)
- [ ] Modal entrance/exit animations
- [ ] Sidebar slide-in animation
- [ ] Button hover spring physics
- [ ] Input focus glow effect
- [ ] Suggestion stagger animations
- [ ] Page transition (Setup → Translation)

### Week 3: UX & Accessibility (P1-P2)
- [ ] Add validation error messages
- [ ] Improve empty state messages
- [ ] Replace developer language with user-friendly terms
- [ ] Add helper text to confusing inputs
- [ ] Add focus trap to modals
- [ ] Make progress bar keyboard accessible

### Week 4: Cleanup & Wow (P2-P3)
- [ ] Delete EnhancedTranslationHelper.tsx
- [ ] Remove hidden Manual Input mode
- [ ] Consolidate animation hooks (3→1)
- [ ] Merge duplicate Excel hooks
- [ ] Add confetti celebration
- [ ] Add progress bar celebrations
- [ ] Fix README link, create CHANGELOG

---

## Success Metrics

**Target state for "Wow-worthy":**

| Metric | Current | Target |
|--------|---------|--------|
| Stability | 5/10 | 9/10 (no crashes) |
| Performance | 5/10 | 8/10 (snappy filters) |
| Visual Polish | 5/10 | 9/10 (smooth animations) |
| Accessibility | 6/10 | 8/10 (keyboard nav) |
| User Clarity | 6/10 | 8/10 (no dev jargon) |
| Code Cleanliness | 5/10 | 8/10 (no dead code) |

**The "Wow" Test:**
- Smooth, spring-physics animations everywhere
- Confetti burst on completing a batch
- Session resumes exactly where you left off
- No jarring state changes or developer language
- Feels like a polished, premium tool

---

## Decisions (User Sign-Off)

1. **Hidden Features:** TBD - Assess each and recommend keep/delete
2. **Animation Scope:** Improve existing animations + create toggleable "Wow Mode" for extras (confetti, magnetic buttons)
3. **Gamepad Mode:** KEEP - Fun novelty stays
4. **Multi-format:** KEEP Excel/JSON/CSV - Fix and improve existing functionality

---

## Reduced-Motion Considerations

All animations should respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*Plan compiled from audits by: Pieter (Quality), Jonas (UX), Henske (Visual), Kev (Product), Sammie (User), Sakke (Backend), Tom (Docs)*
