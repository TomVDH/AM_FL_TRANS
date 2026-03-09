# Final UI Cleanup — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Setup Wizard and Translation View into a clean, minimal, Linear/Notion-inspired UI — content-first, controls hidden until needed, no AI-telltale aesthetics.

**Architecture:** This is a visual/structural refactor only. No new features, no backend changes. Six independently committable tasks that progressively clean up both screens. Each task leaves the app in a working state.

**Tech Stack:** React, Tailwind CSS, Next.js. GSAP is being removed (not added). No new dependencies.

**Design Doc:** `docs/plans/2026-03-07-final-ui-cleanup-design.md`

---

## Task 1: Animation Cleanup — Nuke GSAP & Dead State

**Goal:** Remove all decorative GSAP animations, dead animation state, and excessive CSS keyframe animations. Keep only functional transitions (fadeIn, bubbleIn, dockSlideUp).

**Files:**
- Delete: `src/hooks/useInterfaceAnimations.ts`
- Delete: `src/hooks/useGradientBarAnimation.ts`
- Delete: `src/hooks/useFooterGradientAnimation.ts`
- Modify: `src/hooks/useUIState.ts`
- Modify: `src/hooks/useTranslationState.ts`
- Modify: `src/components/TranslationHelper.tsx`
- Modify: `src/app/globals.css`

### Step 1: Remove animation hook imports and usage from TranslationHelper.tsx

In `src/components/TranslationHelper.tsx`:

1. **Remove imports** (lines 12-14):
   ```tsx
   // DELETE these three lines:
   import { useGradientBarAnimation } from '../hooks/useGradientBarAnimation';
   import { useFooterGradientAnimation } from '../hooks/useFooterGradientAnimation';
   import { useInterfaceAnimations } from '../hooks/useInterfaceAnimations';
   ```

2. **Remove hook calls** (lines 421-423):
   ```tsx
   // DELETE these three lines:
   const { progressBarRef, progressFillRef, animateProgress } = useGradientBarAnimation();
   const { gradientBarRef } = useFooterGradientAnimation();
   const { cardRef, buttonsRef, dialogueBoxRef, animateCardTransition, animateButtonHover } = useInterfaceAnimations();
   ```

3. **Remove animation effect hooks** (lines 684-694):
   ```tsx
   // DELETE both useEffect blocks:
   useEffect(() => {
     animateProgress(progress);
   }, [progress, animateProgress]);

   useEffect(() => {
     if (isStarted && currentIndex > 0) {
       animateCardTransition();
     }
   }, [currentIndex, isStarted, animateCardTransition]);
   ```

4. **Remove `ref={progressBarRef}`** from the progress bar div (around line 1236). Keep the div, just remove the ref.

5. **Remove `ref={cardRef}`** from the source text card div (around line 1352). Keep the div.

6. **Remove the `isAnimating` ternary** from the card className (line 1354):
   ```tsx
   // CHANGE FROM:
   className={`... ${isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}`}
   // CHANGE TO:
   className={`... opacity-100`}
   ```

7. **Remove all `animateButtonHover` calls** — search for `onMouseEnter={(e) => animateButtonHover` and `onMouseLeave={(e) => animateButtonHover`. Remove those event handlers entirely. Found at:
   - Previous button (lines 1220-1221)
   - Next button (lines 1319-1320)

8. **Remove `ref={buttonsRef}`** callback ref on Previous button (lines 1214-1217). Remove the whole ref prop.

9. **Remove `ref={dialogueBoxRef}`** from the gamepad dialogue box div (around line 1364). Keep the div.

10. **Remove `ref={gradientBarRef}`** from any footer gradient element. Search for `gradientBarRef` in the JSX.

11. **Remove `isAnimating` and `setIsAnimating`** from the destructured values of `useTranslationState()` (around lines 66 and 94).

### Step 2: Remove `isAnimating` from state hooks

In `src/hooks/useUIState.ts`:
- Remove `isAnimating: boolean;` from interface (line 23)
- Remove `setIsAnimating: (animating: boolean) => void;` from interface (line 30)
- Remove `const [isAnimating, setIsAnimating] = useState(false);` (line 70)
- Remove `isAnimating,` from return object (line 97)
- Remove `setIsAnimating,` from return object (line 104)

In `src/hooks/useTranslationState.ts`:
- Remove `isAnimating` from interface (line 49)
- Remove `setIsAnimating` from interface (line 96)
- Remove `const [isAnimating, setIsAnimating] = useState(false);` (line 216)
- Remove `isAnimating,` from return (line 1158)
- Remove `setIsAnimating,` from return (line 1199)

### Step 3: Delete animation hook files

```bash
rm src/hooks/useInterfaceAnimations.ts
rm src/hooks/useGradientBarAnimation.ts
rm src/hooks/useFooterGradientAnimation.ts
```

### Step 4: Clean up CSS keyframe animations in globals.css

In `src/app/globals.css`, **delete** these keyframe blocks:
- `@keyframes shimmer` (lines 654-661)
- `@keyframes pipGlow` (lines 638-651)
- `@keyframes gradientShift` (lines 588-595 AND duplicate at lines 731-734)
- `@keyframes gradientShiftFast` (lines 598-607)
- `@keyframes textGlow` (lines 628-635)

**Keep** these keyframes (they are functional):
- `@keyframes fadeIn` (lines 576-585)
- `@keyframes scroll-text` (lines 794-807)
- `@keyframes pulse-typewriter` (lines 721-724)
- Any `bubbleIn`, `dockSlideUp`, `popoverBloom`, `tooltip-fade-in` keyframes

### Step 5: Remove shimmer/glow from progress bar pips

In `src/components/TranslationHelper.tsx`, the progress bar segment rendering (lines 1268-1302):

Replace the animated segment styles with flat colors. Change the completed segment div (lines 1268-1290) to:
```tsx
{isCompleted && (
  <div
    className="absolute inset-0"
    style={{
      backgroundColor: isBlank
        ? (darkMode ? '#991b1b' : '#dc2626')
        : (darkMode ? '#16a34a' : '#22c55e'),
    }}
  />
)}
```

Change the current segment div (lines 1291-1303) to:
```tsx
{isCurrent && !isCompleted && (
  <div
    className="absolute inset-0 opacity-50"
    style={{
      backgroundColor: darkMode ? '#6b7280' : '#9ca3af',
    }}
  />
)}
```

### Step 6: Verify and commit

```bash
npm run build
# Verify no import errors or missing references
git add -A
git commit -m "refactor: remove GSAP animations, dead state, and decorative keyframes"
```

---

## Task 2: Color Normalization — Kill Purple AI Palette

**Goal:** Replace all purple/violet AI-telltale gradients with muted, consistent tones. The app should not scream "AI-generated."

**Files:**
- Modify: `src/components/TranslationHelper.tsx`
- Modify: `src/hooks/useUIComponents.ts`
- Modify: `src/app/globals.css`

### Step 1: Replace purple AI elements in TranslationHelper.tsx

1. **AI upgrade button** (around line 1829): Change purple gradient to muted gray:
   ```tsx
   // FROM:
   className="... bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 ... text-purple-600 dark:text-purple-300 ..."
   // TO:
   className="... bg-gray-50 dark:bg-gray-700 ... text-gray-600 dark:text-gray-300 ..."
   ```

2. **Upgrading spinner** (around line 1838): Same treatment:
   ```tsx
   // FROM:
   className="... bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-300 ..."
   // TO:
   className="... bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 ..."
   ```

3. **Model badge inside AI suggestion** (around line 1817): Remove purple styling from the sonnet badge:
   ```tsx
   // FROM:
   className={`... ${aiSuggestionModel === 'sonnet' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300' : 'bg-amber-100 dark:bg-amber-800/40 text-amber-600 dark:text-amber-400'}`}
   // TO:
   className={`... ${aiSuggestionModel === 'sonnet' ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
   ```

4. **Reference Tools (R) toggle button** (around line 1737): Change purple active state:
   ```tsx
   // FROM:
   className={`... ${xlsxMode ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' : ...}`}
   // TO:
   className={`... ${xlsxMode ? 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700' : ...}`}
   ```

5. **Bulk translate buttons** (around lines 2508, 2576, 2589, 2628): Replace all `from-violet-*` and `to-purple-*` gradients with muted equivalents. Use `from-gray-700 to-gray-900` for dark buttons, `bg-gray-100` for light backgrounds.

6. **Remove `animate-pulse`** from non-loading elements:
   - Modified badge dot (line 1759): Remove `animate-pulse` from the green dot
   - AI loading pill (line 1794): Keep `animate-pulse` here — it IS a loading state
   - Syncing status dots (line 1753): Keep `animate-pulse` on syncing/error — these are actual status indicators

### Step 2: Fix gradient colors in useUIComponents.ts

In `src/hooks/useUIComponents.ts` (around lines 63-68), replace purple gradients in the color palette:
```tsx
// FROM:
'from-purple-400 to-pink-400'
'from-blue-400 to-purple-400'
'from-indigo-400 to-purple-400'
// TO:
'from-gray-400 to-gray-500'
'from-blue-400 to-gray-400'
'from-gray-400 to-blue-400'
```

### Step 3: Normalize highlight styles in globals.css

In `src/app/globals.css`, the `.highlight-character` styles (lines 331-339) use purple. These can stay as-is since character highlighting is a functional feature with intentional color-coding, not AI decoration. The purple here differentiates character highlights from JSON (blue) and XLSX (green) highlights — that's good information design.

However, review the codex entry badge purple usage throughout and soften where it's purely decorative.

### Step 4: Verify and commit

```bash
npm run build
git add -A
git commit -m "refactor: replace purple AI gradients with muted consistent palette"
```

---

## Task 3: Screen 1 Restructure — Setup Wizard

**Goal:** Transform Setup from an interrogation into a quick-resume flow. Codex collapsed, advanced config tucked away, resume card at top.

**Files:**
- Modify: `src/components/SetupWizard.tsx`
- Modify: `src/hooks/useTranslationState.ts` (or `useTranslationCore.ts`) — for localStorage persistence

### Step 1: Add session persistence

In `src/hooks/useTranslationState.ts` (or the appropriate core hook), add localStorage persistence for the last session:

```tsx
// Save session info when starting translation
const saveLastSession = useCallback(() => {
  const session = {
    fileName: loadedFileName,
    fileType: loadedFileType,
    selectedSheet,
    sourceColumn,
    uttererColumn,
    startRow,
    translationColumn,
    targetLanguageLabel,
    totalLines: sourceTexts.length,
    translatedCount: translations.filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length,
    timestamp: Date.now(),
  };
  localStorage.setItem('lastTranslationSession', JSON.stringify(session));
}, [loadedFileName, loadedFileType, selectedSheet, sourceColumn, uttererColumn, startRow, translationColumn, targetLanguageLabel, sourceTexts.length, translations]);
```

Call `saveLastSession()` in `handleStart()` and on each `handleSubmit()`.

Add a getter:
```tsx
const getLastSession = useCallback(() => {
  try {
    const data = localStorage.getItem('lastTranslationSession');
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}, []);
```

Expose `getLastSession` and `saveLastSession` from the hook.

### Step 2: Add Resume Card to SetupWizard

At the top of SetupWizard's render, before the file picker, add:

```tsx
{/* Resume Card */}
{lastSession && (
  <div className="mb-6">
    <button
      onClick={() => handleResumeSession(lastSession)}
      className="w-full text-left p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all duration-150 group"
      style={{ borderRadius: '3px' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Resume: {lastSession.fileName}
            {lastSession.selectedSheet && ` — ${lastSession.selectedSheet}`}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {lastSession.translatedCount} / {lastSession.totalLines} translated
            {lastSession.timestamp && ` · ${formatTimeAgo(lastSession.timestamp)}`}
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  </div>
)}
```

Add a `lastSession` prop to SetupWizardProps and pass it from TranslationHelper. Add a `handleResumeSession` prop that calls `handleExistingFileLoad` with the saved config.

Add a simple `formatTimeAgo` utility:
```tsx
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
```

### Step 3: Collapse Codex Editor by default

In `src/components/SetupWizard.tsx` (line 182):
```tsx
// FROM:
const [showCodexEditor, setShowCodexEditor] = useState(true);
// TO:
const [showCodexEditor, setShowCodexEditor] = useState(false);
```

### Step 4: Wrap column config + style analysis in Advanced accordion

Wrap the column configuration section and StyleAnalysisPanel in a collapsible "Advanced" section:

```tsx
{/* Advanced Configuration */}
<details className="mt-4">
  <summary className="cursor-pointer text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-2">
    Advanced — Column config, style analysis, other input modes
  </summary>
  <div className="mt-3 space-y-4">
    {/* Move existing column config controls here */}
    {/* Move StyleAnalysisPanel here */}
    {/* Move the hidden input mode toggle here (and make it visible) */}
  </div>
</details>
```

### Step 5: Simplify header

Reduce the h1 title from `text-5xl font-black` to something more proportional. Move Video/GitHub/Codex buttons to a subtle row or the Advanced section. The title should be clean and quiet — it's not a landing page.

### Step 6: Verify and commit

```bash
npm run build
git add -A
git commit -m "refactor: restructure setup wizard with resume card and collapsed sections"
```

---

## Task 4: Screen 2 Header & Progress Bar

**Goal:** Consolidate the header into a single status bar. Replace pip-per-entry progress bar with hybrid approach.

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

### Step 1: Consolidate header into single status bar

Replace the current multi-row header (title row + filter/jump row + navigation menu) with a compact single-line header:

```tsx
<div className="flex items-center justify-between py-2 px-1 mb-3">
  {/* Left: Back + Title */}
  <div className="flex items-center gap-3">
    <button onClick={handleBackToSetup} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Back to setup">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
    </button>
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {loadedFileName && `${loadedFileName}`}
      {selectedSheet && ` · ${selectedSheet}`}
    </span>
  </div>

  {/* Center: Stats */}
  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
    <span>{translations.filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length} / {sourceTexts.length} done</span>
    <span>{Math.round((translations.filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length / sourceTexts.length) * 100)}%</span>
    {/* Timer if active */}
  </div>

  {/* Right: Utility icons */}
  <div className="flex items-center gap-1">
    <button onClick={() => setShowKeyboardShortcuts(true)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Keyboard shortcuts" aria-label="Keyboard shortcuts">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
    </button>
    <button onClick={toggleDarkMode} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Toggle dark mode" aria-label="Toggle dark mode">
      {darkMode ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
      )}
    </button>
  </div>
</div>
```

Move the filter/jump dropdown into a compact popover triggered from the header (or accessible via keyboard shortcut only).

### Step 2: Implement hybrid progress bar

Replace the per-pip progress bar with a conditional approach:

```tsx
{/* Progress Bar */}
<div className="flex items-center gap-3 mb-4">
  <button onClick={handlePreviousWithSync} disabled={currentIndex === 0} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:text-gray-200 dark:text-gray-500 dark:hover:text-gray-300 dark:disabled:text-gray-700 transition-colors" aria-label="Previous entry">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
  </button>

  <div
    role="progressbar"
    aria-valuenow={currentIndex + 1}
    aria-valuemin={1}
    aria-valuemax={sourceTexts.length}
    aria-label={`Translation progress: ${currentIndex + 1} of ${sourceTexts.length}`}
    className="relative flex-1 h-2 bg-gray-100 dark:bg-gray-800 overflow-hidden"
    style={{ borderRadius: '3px' }}
  >
    {sourceTexts.length <= 50 ? (
      /* Individual pips for small sets */
      <div className="absolute inset-0 flex">
        {sourceTexts.map((_, index) => {
          const isCompleted = index < currentIndex;
          const isBlank = !translations[index] || translations[index] === '' || translations[index] === '[BLANK, REMOVE LATER]';
          const isCurrent = index === currentIndex;
          return (
            <div
              key={index}
              className="relative h-full"
              style={{ width: `${100 / sourceTexts.length}%` }}
            >
              <div className={`absolute inset-0 ${
                isCompleted
                  ? isBlank ? 'bg-red-400 dark:bg-red-600' : 'bg-green-400 dark:bg-green-500'
                  : isCurrent ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`} />
            </div>
          );
        })}
      </div>
    ) : (
      /* Continuous bar for large sets */
      <>
        {(() => {
          const completed = translations.slice(0, currentIndex).filter(t => t && t !== '' && t !== '[BLANK, REMOVE LATER]').length;
          const blank = currentIndex - completed;
          const total = sourceTexts.length;
          return (
            <>
              <div className="absolute inset-y-0 left-0 bg-green-400 dark:bg-green-500 transition-all duration-300" style={{ width: `${(completed / total) * 100}%` }} />
              <div className="absolute inset-y-0 bg-red-400 dark:bg-red-600 transition-all duration-300" style={{ left: `${(completed / total) * 100}%`, width: `${(blank / total) * 100}%` }} />
              <div className="absolute inset-y-0 bg-gray-300 dark:bg-gray-600 transition-all duration-300" style={{ left: `${(currentIndex / total) * 100}%`, width: `${(1 / total) * 100}%` }} />
            </>
          );
        })()}
      </>
    )}
  </div>

  <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums min-w-[4rem] text-center">
    {currentIndex + 1} / {sourceTexts.length}
  </span>

  <button onClick={() => { if (currentIndex < sourceTexts.length - 1) { setCurrentIndex(currentIndex + 1); setCurrentTranslation(translations[currentIndex + 1] === '[BLANK, REMOVE LATER]' ? '' : translations[currentIndex + 1] || ''); }}} disabled={currentIndex >= sourceTexts.length - 1} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:text-gray-200 dark:text-gray-500 dark:hover:text-gray-300 dark:disabled:text-gray-700 transition-colors" aria-label="Next entry">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
  </button>
</div>
```

### Step 3: Verify and commit

```bash
npm run build
git add -A
git commit -m "refactor: consolidate header into status bar, implement hybrid progress bar"
```

---

## Task 5: Screen 2 Workspace — View Switcher, Toolbar, Textarea Hierarchy

**Goal:** Separate views from toggles, make textarea dominant, clean up toolbar, fix AI suggestion UX.

**Files:**
- Modify: `src/components/TranslationHelper.tsx`

### Step 1: Add view switcher (segmented control)

Above the 2-column grid, add a clean segmented control:

```tsx
{/* View Switcher */}
<div className="flex items-center gap-4 mb-4">
  <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-0.5" style={{ borderRadius: '3px' }}>
    <button
      onClick={() => { if (gamepadMode) toggleGamepadMode(); if (conversationMode) toggleConversationMode(); }}
      className={`px-3 py-1 text-xs font-medium transition-colors ${!gamepadMode && !conversationMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
      style={{ borderRadius: '2px' }}
    >
      Standard
    </button>
    <button
      onClick={() => { if (!gamepadMode) toggleGamepadMode(); if (conversationMode) toggleConversationMode(); }}
      className={`px-3 py-1 text-xs font-medium transition-colors ${gamepadMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
      style={{ borderRadius: '2px' }}
    >
      Gamepad
    </button>
    <button
      onClick={() => { if (gamepadMode) toggleGamepadMode(); if (!conversationMode) toggleConversationMode(); }}
      disabled={!isStarted || sourceTexts.length === 0}
      className={`px-3 py-1 text-xs font-medium transition-colors ${conversationMode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:text-gray-300 dark:disabled:text-gray-600'}`}
      style={{ borderRadius: '2px' }}
    >
      Conversation
    </button>
  </div>
</div>
```

### Step 2: Replace icon toolbar with compact labeled toggles

Replace the current toolbar row (lines 1706-1756) with a cleaner version. Move toggles to the right column, near the textarea:

```tsx
{/* Tool Toggles */}
<div className="flex items-center gap-1 mb-2">
  <button onClick={toggleHighlightMode} className={`px-2 py-1 text-xs font-medium transition-colors ${highlightMode ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Codex Highlights (H)" aria-label="Toggle codex highlights" aria-pressed={highlightMode}>
    H
  </button>
  <button onClick={toggleAiSuggest} className={`px-2 py-1 text-xs font-medium transition-colors ${aiSuggestEnabled ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="AI Suggest (A)" aria-label="Toggle AI suggestions" aria-pressed={aiSuggestEnabled}>
    A
  </button>
  <button onClick={toggleXlsxMode} className={`px-2 py-1 text-xs font-medium transition-colors ${xlsxMode ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Reference Tools (R)" aria-label="Toggle reference tools" aria-pressed={xlsxMode}>
    R
  </button>
  {loadedFileType === 'excel' && (
    <button onClick={toggleLiveEditMode} className={`flex items-center gap-1 px-2 py-1 text-xs font-medium transition-colors ${liveEditMode ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} style={{ borderRadius: '2px' }} title="Live Excel Sync" aria-label="Toggle live edit mode" aria-pressed={liveEditMode}>
      <span className={`w-1.5 h-1.5 rounded-full ${liveEditMode ? syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : syncStatus === 'error' ? 'bg-red-500' : 'bg-green-500' : 'bg-gray-400'}`} />
      Live
    </button>
  )}

  <div className="flex-1" />

  {/* Modified indicator - only shown when modified */}
  {hasCurrentEntryChanged() && (
    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
      Modified
    </span>
  )}
</div>
```

### Step 3: Make textarea visually dominant

Adjust the two-column styling so the translation textarea is the dominant element:

Source column (left): Soften — use `bg-gray-50 dark:bg-gray-800/50` instead of full white card with shadow. Remove the shadow-sm.

Translation column (right): Keep `bg-white dark:bg-gray-800` with a subtle border. Make the textarea taller by default (min-height). Add `aria-label={`Translation for line ${currentIndex + 1}`}` to the textarea.

### Step 4: Fix AI suggestion — full text, dismissible

Replace the truncated AI suggestion pill with a wrapping, dismissible version:

```tsx
{aiSuggestion && (
  <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300" style={{ borderRadius: '3px' }}>
    <button
      onClick={() => { insertTranslatedSuggestion(aiSuggestion); clearAiSuggestion(); }}
      className="flex-1 text-left hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
      title="Click to insert"
    >
      {aiSuggestion}
    </button>
    <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-medium bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400" style={{ borderRadius: '2px' }}>
      {aiSuggestionModel || 'haiku'}
    </span>
    {aiSuggestionModel === 'haiku' && !isUpgradingAiSuggestion && (
      <button onClick={(e) => { e.stopPropagation(); upgradeAiSuggestion(); }} className="shrink-0 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Upgrade to Sonnet" aria-label="Upgrade suggestion to Sonnet">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>
      </button>
    )}
    <button onClick={clearAiSuggestion} className="shrink-0 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Dismiss" aria-label="Dismiss AI suggestion">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
)}
```

### Step 5: Verify and commit

```bash
npm run build
git add -A
git commit -m "refactor: add view switcher, clean toolbar, fix AI suggestion UX"
```

---

## Task 6: Accessibility Fixes

**Goal:** Fix ARIA issues identified in the audit while we're already touching these components.

**Files:**
- Modify: `src/components/TranslationHelper.tsx`
- Modify: `src/components/SetupWizard.tsx`

### Step 1: Add aria-labels to icon-only buttons

Search TranslationHelper.tsx for buttons with only `title` attributes. Add `aria-label` matching the title text. Key locations:
- Dark mode toggle
- Keyboard shortcuts button
- Back/home button
- All toolbar toggle buttons (already done in Task 5 code above)
- Previous/Next navigation buttons

### Step 2: Add aria-label to translation textarea

```tsx
// Add to textarea (around line 1771):
aria-label={`Translation for entry ${currentIndex + 1} of ${sourceTexts.length}`}
```

### Step 3: Fix progress bar pip ARIA

Change progress pips from `role="button" tabIndex={-1}` (invalid combo) to `role="presentation"`:
```tsx
// FROM:
role="button"
tabIndex={-1}
// TO:
role="presentation"
```
(This is already handled in Task 4's new progress bar code, but verify it.)

### Step 4: Increase touch targets

Ensure all icon-only buttons have minimum 44px touch target. The toolbar toggle buttons should use at least `p-2` padding on a 16px icon, giving 48px total.

### Step 5: Replace window.confirm in SetupWizard

In SetupWizard.tsx, find `window.confirm()` calls and replace with the existing `ResetConfirmationModal` pattern or a simple inline confirmation.

### Step 6: Verify and commit

```bash
npm run build
git add -A
git commit -m "fix: accessibility improvements - ARIA labels, touch targets, semantic roles"
```

---

## Execution Notes

- **Task order matters:** Tasks 1-2 (cleanup) should be done first — they remove code and simplify. Tasks 3-5 (restructure) build on the cleaner codebase. Task 6 (accessibility) is a final pass.
- **Each task is independently deployable.** After any task, `npm run build` should pass and the app should work.
- **No new dependencies.** We are removing GSAP usage, not adding anything.
- **Test by running the app** after each task. Navigate through setup, translate a few entries, toggle modes, check dark mode.
- **The design doc** at `docs/plans/2026-03-07-final-ui-cleanup-design.md` has the full rationale for each decision.
