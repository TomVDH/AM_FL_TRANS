# Final UI Cleanup — Screen 1 & Screen 2 Redesign

**Date:** 2026-03-07
**Status:** Design approved
**Goal:** Clean, minimal, Linear/Notion-inspired UI. Content-first, controls hidden until needed. Kill AI-telltale aesthetics.

---

## Guiding Principles

1. **Three-tier visibility:** Always visible → Contextual → On demand
2. **Content-first:** Source text and translation textarea dominate. Everything else is secondary.
3. **No AI aesthetic:** No purple gradients, no pulsing rainbow indicators, no "look at me" energy. Muted, consistent, warm-gray palette.
4. **Respect the repeat user:** Remember last session, minimize setup friction, 1-click resume.
5. **Views vs. toggles:** Mutually exclusive layouts (Standard/Gamepad/Conversation) are a segmented control. Independent tools (Highlight/AI/Reference/Live) are compact toggles.

---

## Color Philosophy

| Purpose | Current | New |
|---------|---------|-----|
| Backgrounds | Blue-gray (`gray-50/800/900`) | Warm gray, same family throughout |
| AI indicators | Purple gradients, pulsing | Muted, same accent as other interactive elements |
| Completed | Bright green gradient + shimmer | Muted green, no animation |
| Blank/error | Red | Muted red, sparingly |
| Context notes | Amber (good) | Keep, it works |
| Speaker colors (conversation) | 8-color palette | Keep, serves real purpose |
| Interactive accent | Mixed (purple, blue, green) | Single accent color, consistently applied |
| Borders/dividers | `gray-200/700` | Keep, reduce border usage overall |

**Kill list:**
- Purple AI gradients (`from-purple-50 to-violet-50`, `from-purple-900/30 to-violet-900/30`)
- Pulsing animations on non-loading elements (`animate-pulse` on status badges)
- Shimmer animations on progress bar pips
- `text-[8px]`, `text-[9px]`, `text-[10px]` micro-sizes → minimum 12px for visible text
- Gradient shifts (`gradientShift 5s ease-in-out infinite`)

---

## Screen 1: Setup Wizard Redesign

### Current Problems
1. Asks 8+ questions every session for the same file format
2. Codex editor expanded by default, dominates vertical space
3. Style analysis panel has no label or framing
4. Start button buried below the fold
5. Dead input mode toggle (`className="hidden"`) with live code branches
6. Hardcoded stats ("14 JSON Files", "6,265 Total Entries")

### New Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│         AM FL TRANS                         │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  ▶ Resume: EP04_Sheet2 — 183 lines   │  │
│  │    47 translated · Last: 2 hours ago  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ─── or ───                                 │
│                                             │
│  [ Select file from server  ▾ ]             │
│  [ Upload new file          ↑ ]             │
│                                             │
│  → Sheet selector (after file loads)        │
│  → Language selector (after sheet loads)    │
│  → [Start Translation — 847 lines]         │
│                                             │
│  ┌─ Codex (24 entries) ──────── [expand] ┐  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ Advanced ────────────────── [expand] ┐  │
│  │  Column config · Style analysis       │  │
│  │  Manual input · JSON mode             │  │
│  └───────────────────────────────────────┘  │
│                                             │
│                          [☀/☾]   [v0.8.2]   │
└─────────────────────────────────────────────┘
```

### Changes

1. **Resume card** — persist last file + sheet + column config to localStorage. Show "Resume: [file] — [n] lines, [m] translated, last [time ago]" as primary action. 1-click to start translating.

2. **Codex editor collapsed by default** — show entry count badge as summary. Expand on click. Remove `useState(true)` default.

3. **Advanced accordion** — column config, style analysis, manual input, JSON mode all collapse into a single "Advanced" section. Rarely needed, not daily.

4. **Start button promoted** — appears immediately after file + sheet + language selection, with summary text ("847 lines, columns B/C"). No scrolling to find it.

5. **Header simplified** — smaller title, no oversized logo. Video/GitHub/Codex utility buttons move to subtle footer row or settings.

6. **Remove hardcoded stats** — the "14 JSON Files" / "6,265 Total Entries" are stale literals.

7. **Progressive disclosure preserved** — sheet selector appears after file loads, language selector after sheet loads. This pattern is already good.

---

## Screen 2: Translation View Redesign

### Current Problems
1. 8 unlabeled icon buttons in one toolbar row, no grouping logic
2. Source and translation columns styled identically — no visual hierarchy
3. Progress bar renders 1 DOM element per entry, breaks at 100+ entries
4. Modified/Unchanged badge pulses on every keystroke
5. Output table pushes workspace off screen
6. GSAP card transition animation fires on navigation, creates flicker
7. Dead `isAnimating` CSS class (state setter never called)
8. AI suggestion truncated, no dismiss button
9. Purple gradient on AI elements

### New Layout

```
┌──────────────────────────────────────────────────────────┐
│ [←] EP04 · Sheet 2         47 / 312 · 15%    [◑  ⌨  ⚙] │
├──────────────────────────────────────────────────────────┤
│ [◀]  [████████░░░░░░░░░░░░░░░░░░░░]  [▶]                │
├──────────────────────────────────────────────────────────┤
│ View: [ Standard | Gamepad | Conversation ]              │
├────────────────────────┬─────────────────────────────────┤
│                        │                                 │
│  J14 · Smart Ass       │  ┌─────────────────────────┐   │
│                        │  │                         │   │
│  "You really think     │  │  Translation textarea   │   │
│   that's going to      │  │  (dominant, taller,     │   │
│   work?"               │  │   subtle focus ring)    │   │
│                        │  │                         │   │
│  context: sarcastic    │  └─────────────────────────┘   │
│                        │  AI: "Denk je echt dat..."  [×] │
│                        │                                 │
│                        │  [H] [A] [R] [Live·]     Submit │
├────────────────────────┴─────────────────────────────────┤
│  Quick Ref: "Denk je nou echt..." (EP03, ln 44)          │
└──────────────────────────────────────────────────────────┘
```

### Changes

#### Header & Navigation
1. **Single status bar header** — back button, episode + sheet name, progress stats (done/total, percentage), 2-3 utility icons (dark mode, keyboard help, settings). Replaces scattered buttons across multiple rows.

2. **Progress bar: hybrid** — individual pips for ≤50 entries, continuous 3-color fill bar for 50+. Green (completed), red (blank), gray (remaining). No shimmer animations, no per-pip GSAP.

3. **View switcher as segmented control** — `[ Standard | Gamepad | Conversation ]`. Mutually exclusive views, visually distinct from tool toggles.

#### Workspace
4. **Source column visually recessive** — lighter/more muted background. Reading-optimized. Speaker name + cell ref small and quiet above the text.

5. **Translation textarea visually dominant** — slightly more prominent styling, subtle focus ring, more vertical space. This is the active workspace; it should feel like it.

6. **AI suggestion inline and dismissible** — appears below textarea when active. Single line with full text visible (wrap, not truncate). `[×]` to dismiss. No purple gradient — muted, same color family as UI.

7. **Tool toggles compact and labeled** — `[H] [A] [R] [Live·]` with single-letter labels matching keyboard shortcuts. Grouped near textarea. Replaces 8 mystery icons.

#### Animations — Nuke List
8. **Delete `useInterfaceAnimations.ts`** entirely — GSAP card transition, button hover scale, dialogue box animation. All of it.
9. **Delete `isAnimating` state** from `useTranslationState.ts` / `useUIState.ts` and the CSS class toggle in TranslationHelper.
10. **Delete `useGradientBarAnimation`** — progress bar becomes CSS-only.
11. **Delete progress pip shimmer animations** — `shimmer 3s ease-in-out infinite`.
12. **Delete `pipGlow` animation** on just-completed entries.
13. **Delete `gradientShift` keyframe animation**.
14. **Keep:** `fadeIn` (page entry), `bubbleIn` (conversation), `dockSlideUp` (edit dock). These are functional, not decorative.

#### Secondary Elements
15. **Modified badge: subtle dot only** — show small colored dot when modified. No badge when unchanged. No animation.

16. **Output table → collapsible drawer** — defaults to collapsed. Stats (done, blank, changed, timer, ETA) live in the header bar.

17. **Quick reference bar at bottom** — single quiet row below the grid showing translation memory matches.

18. **Jump panel consolidated** — the `-5 -1 +1 +5` buttons and the nav arrows are redundant. Keep keyboard shortcuts, simplify to prev/next buttons only.

---

## Animation Nuke List (Complete)

| Animation | File | Action |
|-----------|------|--------|
| `useInterfaceAnimations.ts` (entire hook) | `src/hooks/useInterfaceAnimations.ts` | DELETE |
| `useGradientBarAnimation.ts` (entire hook) | `src/hooks/useGradientBarAnimation.ts` | DELETE |
| `isAnimating` state + CSS class | `useTranslationState.ts`, `useUIState.ts`, `TranslationHelper.tsx` | DELETE |
| Progress pip `shimmer` animation | `TranslationHelper.tsx`, `globals.css` | DELETE |
| Progress pip `pipGlow` animation | `TranslationHelper.tsx`, `globals.css` | DELETE |
| `gradientShift` keyframe | `TranslationHelper.tsx` | DELETE |
| `animate-pulse` on non-loading badges | Throughout | DELETE (keep only on actual loading spinners) |
| Button hover scale (GSAP) | `useInterfaceAnimations.ts` | DELETE (use CSS `:hover` if needed) |
| KEEP: `fadeIn`, `bubbleIn`, `dockSlideUp`, `popoverBloom`, `tooltip-fade-in` | Various | KEEP — functional transitions |

---

## Accessibility Fixes (While We're In There)

1. Add `aria-label` to all icon-only toolbar buttons (currently only have `title`)
2. Add `aria-label="Translation for line {n}"` to translation textarea (currently only `placeholder`)
3. Fix progress pip ARIA: change `role="button" tabIndex={-1}` to `role="presentation"` (or make them properly interactive)
4. Increase icon button touch targets from ~28px to 44px minimum (WCAG 2.5.5)
5. Replace `window.confirm()` in SetupWizard with modal pattern

---

## Out of Scope

- Conversation view internals (already well-structured)
- Completion summary screen (works fine)
- Translation review screen (works fine)
- Backend / API changes
- New features

---

## Implementation Approach

This is a visual/structural refactor. No feature changes, no new functionality. The work splits into:

1. **Animation cleanup** — delete hooks, remove dead state, strip decorative animations
2. **Color normalization** — replace purple AI palette, enforce consistent muted tones
3. **Screen 1 restructure** — resume card, collapsed codex, advanced accordion
4. **Screen 2 restructure** — header consolidation, view switcher, textarea hierarchy, toolbar cleanup
5. **Progress bar** — hybrid pip/continuous implementation
6. **Accessibility** — ARIA fixes, touch targets, labels

Each step is independently testable and committable.
