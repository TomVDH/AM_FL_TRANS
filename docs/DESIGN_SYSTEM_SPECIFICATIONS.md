# AM Translations Helper - Design System Specifications

**Complete Visual Design DNA**
Extracted from codebase analysis on 2026-01-15

---

## 1. Color System

### 1.1 Base Color Palette

#### Gray Scale (Primary Neutral Palette)
```css
/* Light mode */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af  /* WCAG enhanced: #6b7280 */
--gray-500: #6b7280  /* WCAG enhanced: #4b5563 */
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827

/* Dark mode equivalents */
--dm-gray-50: #111827
--dm-gray-100: #1f2937
--dm-gray-700: #9ca3af
--dm-gray-800: #1f2937
--dm-gray-900: #0f1419
```

#### Semantic Colors

**Blue (Primary Interactive)**
```css
--blue-50: #eff6ff
--blue-100: #dbeafe  /* Random background */
--blue-300: #93c5fd
--blue-400: #60a5fa  /* Dark mode focus rings */
--blue-500: #3b82f6  /* Primary interactive color */
--blue-600: #2563eb
--blue-700: #1d4ed8
--blue-800: #1e40af
```

**Purple/Violet (Accent/Character Highlighting)**
```css
--purple-50: #faf5ff
--purple-100: #f3e8ff
--purple-300: #d8b4fe
--purple-400: #c084fc
--purple-500: #a855f7
--purple-600: #9333ea
--purple-700: #7e22ce
--purple-800: #6b21a8
--purple-900: #581c87

--violet-50: #f5f3ff
--violet-100: #ede9fe  /* Random background */
--violet-400: #a78bfa
--violet-500: #8b5cf6  /* Character highlights */
--violet-600: #7c3aed
```

**Green (Success/Progress)**
```css
--green-50: #f0fdf4
--green-100: #dcfce7  /* Random background */
--green-300: #86efac  /* Confetti */
--green-400: #4ade80  /* Confetti */
--green-500: #22c55e  /* Success/Progress primary */
--green-600: #16a34a
--green-700: #15803d
--green-800: #166534

--emerald-300: #6ee7b7
--emerald-400: #34d399  /* Wow-mode glow overlay */
--emerald-500: #10b981  /* XLSX highlights, wow-mode buttons */
--teal-500: #14b8a6
--teal-600: #0d9488
```

**Red (Destructive/Error/Character Highlighting)**
```css
--red-50: #fef2f2
--red-100: #fee2e2
--red-300: #fca5a5
--red-400: #f87171
--red-500: #ef4444  /* Clickable character highlights */
--red-600: #dc2626
--red-700: #b91c1c

--rose-400: #fb7185
--rose-500: #f43f5f
```

**Pink/Fuchsia (Accent/Wow-Mode)**
```css
--pink-50: #fdf2f8
--pink-100: #fce7f3  /* Random background */
--pink-500: #ec4899
--pink-600: #db2777

--fuchsia-100: #fae8ff  /* Random background */
--fuchsia-400: #e879f9  /* Wow-mode glows */
--fuchsia-500: #d946ef  /* Wow-mode buttons */
--fuchsia-600: #c026d3
```

**Amber/Orange (Warning)**
```css
--amber-100: #fef3c7  /* Random background */
--amber-400: #fbbf24
--amber-500: #f59e0b  /* Warning/milestone confetti */
--amber-600: #d97706
--amber-700: #b45309

--orange-100: #ffedd5  /* Random background */
--orange-500: #f97316
--orange-600: #ea580c
```

**Cyan/Sky (Info)**
```css
--cyan-100: #cffafe  /* Random background */
--cyan-400: #22d3ee
--cyan-500: #06b6d4
--sky-100: #f0f9ff  /* Random background */
--sky-600: #0284c7
```

**Lime (Accent)**
```css
--lime-100: #ecfccb  /* Random background */
```

**Indigo (Accent)**
```css
--indigo-400: #818cf8
--indigo-500: #6366f1
```

### 1.2 Random Background Colors

**Light Mode Backgrounds**
```css
body.bg-random-1 { background-color: #fef3c7; }  /* Amber 100 */
body.bg-random-2 { background-color: #dbeafe; }  /* Blue 100 */
body.bg-random-3 { background-color: #fce7f3; }  /* Pink 100 */
body.bg-random-4 { background-color: #ddd6fe; }  /* Violet 100 */
body.bg-random-5 { background-color: #dcfce7; }  /* Green 100 */
body.bg-random-6 { background-color: #ffedd5; }  /* Orange 100 */
body.bg-random-7 { background-color: #f0f9ff; }  /* Sky 100 */
body.bg-random-8 { background-color: #fae8ff; }  /* Fuchsia 100 */
body.bg-random-9 { background-color: #ecfccb; }  /* Lime 100 */
body.bg-random-10 { background-color: #cffafe; } /* Cyan 100 */
```

**Dark Mode Backgrounds**
```css
.dark body.bg-random-1 { background-color: #1a1510; }  /* Dark amber */
.dark body.bg-random-2 { background-color: #0f1419; }  /* Dark blue */
.dark body.bg-random-3 { background-color: #1a0f14; }  /* Dark pink */
.dark body.bg-random-4 { background-color: #151019; }  /* Dark violet */
.dark body.bg-random-5 { background-color: #0f1a10; }  /* Dark green */
.dark body.bg-random-6 { background-color: #1a1410; }  /* Dark orange */
.dark body.bg-random-7 { background-color: #0f1519; }  /* Dark sky */
.dark body.bg-random-8 { background-color: #19101a; }  /* Dark fuchsia */
.dark body.bg-random-9 { background-color: #131a0f; }  /* Dark lime */
.dark body.bg-random-10 { background-color: #0f1a19; } /* Dark cyan */
```

### 1.3 Semantic Color Tokens

```css
/* Focus States */
--focus-ring-light: #3b82f6
--focus-ring-dark: #60a5fa
--focus-ring-offset: 2px
--focus-ring-width: 3px

/* Toast/Notifications */
:root {
  --toast-bg: #ffffff
  --toast-color: #1f2937
  --toast-border: #d1d5db
}

.dark {
  --toast-bg: #1f2937
  --toast-color: #f9fafb
  --toast-border: #4b5563
}

/* Gamepad Mode */
--gamepad-border-light: #1a1a1a
--gamepad-border-dark: #4a4a4a
--gamepad-bg-light: #ffffff
--gamepad-bg-dark: #1a1a1a
--gamepad-name-tab-light: #1a1a1a
--gamepad-name-tab-dark: #2a2a2a
```

### 1.4 Highlight Colors (Context-Based)

**JSON Data Highlights**
```css
.highlight-json {
  background-color: rgba(59, 130, 246, 0.2);
  border-bottom: 2px solid #3b82f6;
}
.highlight-json:hover {
  background-color: rgba(59, 130, 246, 0.35);
  box-shadow: 0 0 4px rgba(59, 130, 246, 0.4);
}
/* Dark mode */
.dark .highlight-json {
  background-color: rgba(59, 130, 246, 0.25);
  border-bottom-color: #60a5fa;
}
.dark .highlight-json:hover {
  background-color: rgba(59, 130, 246, 0.4);
}
```

**XLSX Data Highlights**
```css
.highlight-xlsx {
  background-color: rgba(16, 185, 129, 0.2);
  border-bottom: 2px solid #10b981;
}
.highlight-xlsx:hover {
  background-color: rgba(16, 185, 129, 0.35);
  box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
}
/* Dark mode */
.dark .highlight-xlsx {
  background-color: rgba(16, 185, 129, 0.25);
  border-bottom-color: #34d399;
}
.dark .highlight-xlsx:hover {
  background-color: rgba(16, 185, 129, 0.4);
}
```

**Character Name Highlights**
```css
.highlight-character {
  background-color: rgba(139, 92, 246, 0.2);
  border-bottom: 2px solid #8b5cf6;
}
.highlight-character:hover {
  background-color: rgba(139, 92, 246, 0.35);
  box-shadow: 0 0 4px rgba(139, 92, 246, 0.4);
}
/* Dark mode */
.dark .highlight-character {
  background-color: rgba(139, 92, 246, 0.25);
  border-bottom-color: #a78bfa;
}
.dark .highlight-character:hover {
  background-color: rgba(139, 92, 246, 0.4);
}
```

**Clickable Highlights**
```css
.highlight-clickable {
  background-color: rgba(239, 68, 68, 0.2);
  border-bottom: 2px solid #ef4444;
}
.highlight-clickable:hover {
  background-color: rgba(239, 68, 68, 0.35);
  box-shadow: 0 0 4px rgba(239, 68, 68, 0.4);
}
/* Dark mode */
.dark .highlight-clickable {
  background-color: rgba(239, 68, 68, 0.25);
  border-bottom-color: #f87171;
}
.dark .highlight-clickable:hover {
  background-color: rgba(239, 68, 68, 0.4);
}
```

### 1.5 Gradient Definitions

**Button Gradients (Standard)**
```css
/* Light mode gray gradient */
bg-gradient-to-br from-gray-50 to-gray-100
/* Dark mode gray gradient */
dark:from-gray-800 dark:to-gray-900

/* Light mode gray gradient (hover overlay) */
bg-gradient-to-br from-gray-100 to-gray-200
/* Dark mode gray gradient (hover overlay) */
dark:from-gray-700 dark:to-gray-800
```

**Button Gradients (Wow-Mode Enhanced)**
```css
/* Violet/Purple (Previous button wow-mode) */
bg-gradient-to-br from-violet-500 to-purple-600
/* Hover overlay */
bg-gradient-to-br from-violet-400 to-purple-500

/* Fuchsia/Pink (Next button wow-mode) */
bg-gradient-to-br from-fuchsia-500 to-pink-600
/* Hover overlay */
bg-gradient-to-br from-fuchsia-400 to-pink-500

/* Emerald/Green/Teal (Submit button wow-mode) */
bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600
/* Hover overlay */
bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500

/* Black/White (Submit button default) */
bg-gradient-to-br from-gray-900 via-black to-gray-900
dark:from-gray-100 dark:via-white dark:to-gray-100
/* Hover overlay */
bg-gradient-to-br from-gray-800 via-gray-900 to-black
dark:from-gray-200 dark:via-gray-100 dark:to-white
```

**Badge/Indicator Gradients**
```css
/* Status badges */
bg-gradient-to-r from-indigo-500 to-blue-600     /* Modified indicator */
bg-gradient-to-r from-amber-500 to-orange-500    /* Warning indicator */
bg-gradient-to-r from-cyan-500 to-sky-600        /* Info indicator */
bg-gradient-to-r from-rose-500 to-red-600        /* Error indicator */
bg-gradient-to-r from-purple-500 to-pink-500     /* Codex mode indicator */
```

**Modal Confirmation Gradients (Progressive Warning)**
```css
/* Step 1 - Gray (Neutral) */
bg-gradient-to-br from-gray-700 to-gray-800
dark:from-gray-600 dark:to-gray-700

/* Step 2 - Amber (Warning) */
bg-gradient-to-br from-amber-600 to-amber-700
dark:from-amber-500 dark:to-amber-600

/* Step 3 - Red (Destructive) */
bg-gradient-to-br from-red-600 to-red-700
dark:from-red-500 dark:to-red-600
```

**UI Accent Gradients**
```css
/* Quick reference bar */
bg-gradient-to-r from-purple-50 to-indigo-50
dark:from-purple-950/30 dark:to-indigo-950/30

/* Gamepad mode dialogue box */
linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)      /* Light */
linear-gradient(180deg, #1a1a1a 0%, #141414 100%)      /* Dark */

/* Gamepad mode source preview */
linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)      /* Light */
linear-gradient(180deg, #1e1e1e 0%, #181818 100%)      /* Dark */
```

**Magnetic Button Glow (Wow-Mode)**
```css
linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))
```

---

## 2. Typography System

### 2.1 Font Families

**Primary Font Stack**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

**Gamepad Mode Font (Pixel Art)**
```css
/* Pixelify Sans - Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap');

font-family: var(--font-pixelify-sans), "Pixelify Sans", sans-serif;
font-optical-sizing: auto;
```

**Monospace (Code/Technical)**
```css
/* Used for JSON display - inherited from browser defaults */
font-family: monospace;
```

### 2.2 Font Sizes

```css
/* Tailwind base: 16px */
text-xs: 0.75rem      /* 12px */
text-sm: 0.875rem     /* 14px */
text-base: 1rem       /* 16px */
text-lg: 1.125rem     /* 18px */
text-xl: 1.25rem      /* 20px */
text-2xl: 1.5rem      /* 24px */
text-5xl: 3rem        /* 48px - Main heading */

/* Gamepad mode specific */
font-size: 1rem       /* Name tab */
font-size: 1.15rem    /* Dialogue content */
font-size: 1.2rem     /* Continue indicator */
```

### 2.3 Font Weights

```css
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
font-black: 900      /* Primary UI weight - HEAVY use */
```

**Pixelify Sans Weights**
```css
pixelify-sans-400: 400
pixelify-sans-500: 500
pixelify-sans-600: 600
pixelify-sans-700: 700
```

### 2.4 Line Heights

```css
/* Base */
body: 1.6
p: 1.7
h1, h2, h3, h4, h5, h6: 1.2

/* Gamepad mode dialogue */
line-height: 1.65
```

### 2.5 Letter Spacing

```css
/* Body/UI elements */
letter-spacing: -0.011em    /* Subtle tightening for readability */

/* Headings */
letter-spacing: -0.025em    /* Tighter spacing for impact */

/* Tracking modifiers */
tracking-tight: -0.025em
tracking-tighter: -0.05em
tracking-wide: 0.025em
tracking-wider: 0.05em

/* Gamepad mode dialogue */
letter-spacing: 0.01em
```

### 2.6 Text Rendering & Smoothing

```css
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Gamepad mode */
.dialogue-content {
  text-rendering: optimizeLegibility;
  font-feature-settings: "liga" 1, "kern" 1;
}
```

### 2.7 Text Wrapping Utilities

```css
.text-balance {
  text-wrap: balance;
}

.text-pretty {
  text-wrap: pretty;
}
```

---

## 3. Spacing System

### 3.1 Base Spacing Scale (4px base)

```css
/* Tailwind default scale */
0: 0px
px: 1px
0.5: 0.125rem   /* 2px */
1: 0.25rem      /* 4px */
1.5: 0.375rem   /* 6px */
2: 0.5rem       /* 8px */
2.5: 0.625rem   /* 10px */
3: 0.75rem      /* 12px */
4: 1rem         /* 16px */
5: 1.25rem      /* 20px */
6: 1.5rem       /* 24px */
8: 2rem         /* 32px */
10: 2.5rem      /* 40px */
12: 3rem        /* 48px */
16: 4rem        /* 64px */
20: 5rem        /* 80px */
24: 6rem        /* 96px */
```

### 3.2 Component Internal Padding Patterns

**Buttons**
```css
sm: px-4 py-2       /* 16px x 8px */
md: px-6 py-3       /* 24px x 12px */
lg: px-8 py-3       /* 32px x 12px */

/* Square icon buttons */
h-11 w-11           /* 44px (WCAG AA touch target) */
```

**Inputs/Textareas**
```css
px-4 py-3           /* 16px x 12px */
```

**Cards**
```css
p-4                 /* 16px all sides */
p-6                 /* 24px all sides */
px-6 py-4           /* 24px horizontal, 16px vertical */
```

**Modal Sections**
```css
px-6 py-4           /* Header/Footer: 24px x 16px */
px-6 py-6           /* Content: 24px x 24px */
```

**Gamepad Dialogue**
```css
padding: 6px 14px   /* Name tab */
padding: 16px 20px  /* Dialogue content */
```

### 3.3 Layout Gap Patterns

```css
gap-1: 0.25rem      /* 4px - Tight elements */
gap-2: 0.5rem       /* 8px - Related items */
gap-3: 0.75rem      /* 12px - Button groups */
gap-4: 1rem         /* 16px - Section spacing */
gap-6: 1.5rem       /* 24px - Major sections */

/* Vertical spacing */
space-y-1.5: 6px    /* List items */
space-y-2: 8px      /* Form fields */
space-y-4: 16px     /* Sections */
space-y-6: 24px     /* Major sections */
```

### 3.4 Margin Patterns

```css
mb-1: 4px
mb-2: 8px
mb-3: 12px
mb-4: 16px
mt-2: 8px
mt-3: 12px
mx-4: 16px          /* Modal horizontal margins */
```

---

## 4. Visual Effects

### 4.1 Shadows

**Component Shadows**
```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

**Custom Component Shadows**
```css
/* Modal backdrop */
bg-opacity-75

/* Button spring hover */
box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15)

/* Button spring active */
box-shadow: 0 2px 5px -2px rgba(0, 0, 0, 0.2)

/* Magnetic button hover (wow-mode) */
box-shadow: 0 15px 30px -5px rgba(168, 85, 247, 0.25),
            0 8px 15px -5px rgba(236, 72, 153, 0.2)

/* Gamepad mode dialogue box (light) */
box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.8)

/* Gamepad mode dialogue box (dark) */
box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.4),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1)

/* Gamepad mode name tab */
box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.15)      /* Light */
box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.3)       /* Dark */

/* Gamepad mode source preview */
box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05)   /* Light */
box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2)    /* Dark */

/* GSAP hover animations */
box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3)         /* Gradient bar hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)        /* Gradient bar default */
box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2)         /* Progress bar hover */
```

**Color-Specific Shadows (Glow Effects)**
```css
/* Wow-mode button shadows */
hover:shadow-lg hover:shadow-violet-500/30        /* Violet button */
hover:shadow-lg hover:shadow-fuchsia-500/30       /* Fuchsia button */
hover:shadow-lg hover:shadow-emerald-500/40       /* Emerald button */

/* Badge shadows */
shadow-lg shadow-indigo-500/25                    /* Modified badge */
shadow-lg shadow-amber-500/25                     /* Warning badge */
shadow-lg shadow-cyan-500/25                      /* Info badge */
shadow-lg shadow-rose-500/25                      /* Error badge */
shadow-lg shadow-purple-500/25                    /* Codex badge */

/* GSAP segment celebration */
box-shadow: 0 0 25px rgba(34, 197, 94, 0.9), 0 0 50px rgba(34, 197, 94, 0.5)
box-shadow: 0 0 8px rgba(34, 197, 94, 0.4)        /* Resting state */
```

### 4.2 Text Shadows

```css
/* Pixel art text shadow */
.text-shadow-pixel {
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
}

/* Glow text effect */
.glow-text {
  text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);    /* Light mode */
}
.dark .glow-text {
  text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);    /* Dark mode */
}

/* Animated glow */
@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  }
  50% {
    text-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  }
}
```

### 4.3 Border Styles & Radii

**Border Widths**
```css
border: 1px
border-2: 2px
border-t-2: 2px top
border-b-2: 2px bottom
```

**Border Radius**
```css
/* Global override - SHARP aesthetic */
border-radius: 3px        /* All buttons, inputs, cards, modals */

/* Exceptions */
rounded: 0.25rem          /* 4px - Scrollbar */
rounded-full: 9999px      /* Badges */

/* Gamepad mode */
border-radius: 8px        /* Dialogue box */
border-radius: 0 0 8px 0  /* Name tab (bottom-right only) */
border-radius: 6px        /* Source preview */
border-radius: 1px        /* Progress indicators */

/* Pixel art border */
.pixel-border {
  border-style: solid;
  border-width: 4px;
  border-image: linear-gradient(45deg, #000000, #333333) 1;
}
```

**Border Colors**
```css
/* Light mode */
border-black               /* Primary borders */
border-gray-300           /* Secondary borders */
border-gray-200           /* Tertiary borders */

/* Dark mode */
dark:border-gray-600      /* Primary borders */
dark:border-gray-700      /* Secondary borders */
dark:border-gray-800      /* Tertiary borders */

/* Highlight borders (bottom only) */
border-bottom: 2px solid  /* All highlight types */
```

### 4.4 Backdrop Blur

```css
/* Not currently used in codebase */
/* Potential for future glassmorphism effects */
backdrop-blur-sm: 4px
backdrop-blur-md: 12px
backdrop-blur-lg: 16px
```

### 4.5 Glow Effects

**Input Focus Glow**
```css
.input-glow:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);   /* Light */
}
.dark .input-glow:focus {
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);   /* Dark */
}

/* Enhanced textarea focus */
textarea.input-glow:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3),
              0 4px 20px -5px rgba(59, 130, 246, 0.2);
}
```

**Progress Bar Pip Glow**
```css
@keyframes pipGlow {
  0% {
    box-shadow: 0 0 0 rgba(34, 197, 94, 0);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.8);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    transform: scale(1);
  }
}
```

**Magnetic Button Glow (Wow-Mode)**
```css
.btn-magnetic::before {
  content: '';
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4));
  border-radius: 5px;
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.3s ease;
  z-index: -1;
}
.btn-magnetic:hover:not(:disabled)::before {
  opacity: 1;
}
```

---

## 5. Animation System

### 5.1 GSAP Animation Patterns

**Library Version**
```
gsap: ^3.12.5
```

**Entrance Animations**

```javascript
// Card fade-in
gsap.fromTo(cardRef.current,
  { opacity: 0, y: 30, scale: 0.95 },
  { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }
)

// Buttons stagger
gsap.fromTo(buttons,
  { opacity: 0, y: 20, scale: 0.9 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    delay: 0.3
  }
)

// Dialogue box
gsap.fromTo(dialogueBoxRef.current,
  { opacity: 0, scale: 0.98, rotationY: -5 },
  { opacity: 1, scale: 1, rotationY: 0, duration: 0.7, ease: 'power2.out', delay: 0.2 }
)

// Gradient bar entrance
gsap.set(gradientBar, { scale: 0.8, opacity: 0.7 })
gsap.to(gradientBar, {
  duration: 1.2,
  scale: 1,
  opacity: 1,
  ease: 'back.out(1.7)'
})
```

**Hover Animations**

```javascript
// Button hover
gsap.to(button, {
  duration: 0.2,
  scale: 1.05,
  ease: 'power2.out'
})

// Gradient bar hover
gsap.to(gradientBar, {
  duration: 0.4,
  scale: 1.1,
  ease: 'power2.out',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
})

// Animated gradient movement on hover
gsap.to(gradientBar, {
  duration: 0.6,
  backgroundPosition: '200% 200%',
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true
})
```

**Click/Press Animations**

```javascript
// Gradient bar click (bounce)
gsap.to(gradientBar, {
  duration: 0.2,
  scale: 0.95,
  ease: 'power2.in',
  onComplete: () => {
    gsap.to(gradientBar, {
      duration: 0.3,
      scale: 1.05,
      ease: 'back.out(1.7)',
      onComplete: () => {
        gsap.to(gradientBar, {
          duration: 0.2,
          scale: 1,
          ease: 'power2.out'
        })
      }
    })
  }
})
```

**Progress Animations**

```javascript
// Segment scale-in
gsap.fromTo(segment,
  { scaleX: 0, transformOrigin: 'left center', opacity: 0.5 },
  {
    duration: 0.5,
    scaleX: 1,
    opacity: 1,
    ease: 'back.out(1.5)',
    delay: staggerDelay
  }
)

// Pulse effect
gsap.to(segment, {
  duration: 0.3,
  boxShadow: '0 0 15px rgba(34, 197, 94, 0.8)',
  ease: 'power2.out',
  yoyo: true,
  repeat: 1
})

// Progress bar subtle pulse
gsap.to(progressBarRef.current, {
  duration: 0.2,
  scale: 1.01,
  ease: 'power2.out',
  yoyo: true,
  repeat: 1
})
```

**Modal Animations**

```javascript
// Modal entrance timeline
const tl = gsap.timeline()

tl.fromTo(backdropRef.current,
  { opacity: 0 },
  { opacity: 1, duration: 0.25, ease: 'power2.out' }
).fromTo(contentRef.current,
  { scale: 0.9, opacity: 0, y: 20 },
  { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' },
  '-=0.15'
)

// Modal step transition (confirmation modal)
gsap.to(contentRef.current, {
  scale: 0.98,
  duration: 0.1,
  ease: 'power2.in',
  onComplete: () => {
    // Update content
    gsap.to(contentRef.current, {
      scale: 1,
      duration: 0.2,
      ease: 'back.out(2)'
    })
  }
})

// Final confirmation explosion
tl.to(contentRef.current,
  { scale: 1.05, duration: 0.1, ease: 'power2.in' }
).to(contentRef.current,
  { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }
).to(backdropRef.current,
  { opacity: 0, duration: 0.2, ease: 'power2.in' },
  '-=0.15'
)
```

**Celebration Animations (Wow-Mode)**

```javascript
// Segment celebration
gsap.timeline()
  .to(innerDiv, {
    boxShadow: '0 0 25px rgba(34, 197, 94, 0.9), 0 0 50px rgba(34, 197, 94, 0.5)',
    duration: 0.3,
    ease: 'power2.out'
  })
  .to(innerDiv, {
    boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)',
    duration: 0.5,
    ease: 'power2.inOut'
  })
  .to(segment, {
    scale: 1.15,
    duration: 0.15,
    ease: 'back.out(2)'
  }, 0)
  .to(segment, {
    scale: 1,
    duration: 0.3,
    ease: 'elastic.out(1, 0.5)'
  }, 0.15)
```

### 5.2 CSS Transitions

**Standard Transitions**
```css
transition-all duration-200    /* 200ms - Fast interactions */
transition-all duration-300    /* 300ms - Standard interactions */
transition-colors duration-300 /* 300ms - Color changes only */

/* Custom component transitions */
transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)

transition: background-color 0.15s ease, box-shadow 0.15s ease  /* Highlights */
```

**CSS Custom Spring Transitions**
```css
/* Button spring effect */
.btn-spring {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-spring:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
}
.btn-spring:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
  transition-duration: 0.1s;
}

/* Magnetic button effect */
.btn-magnetic {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-magnetic:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.03);
}
.btn-magnetic:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
  transition-duration: 0.15s;
}
```

### 5.3 CSS Keyframe Animations

**Fade In**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in { animation: fadeIn 0.5s ease-out; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
```

**Modal Animations**
```css
@keyframes modalBackdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalContentIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-backdrop-animate {
  animation: modalBackdropIn 0.25s ease-out forwards;
}

.modal-content-animate {
  animation: modalContentIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.1s;
  opacity: 0;
}
```

**Panel Slide In**
```css
@keyframes panelSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-slide-in {
  animation: panelSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

**Staggered Fade In**
```css
@keyframes staggerFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  opacity: 0;
  animation: staggerFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0.05s; }
.stagger-item:nth-child(2) { animation-delay: 0.1s; }
.stagger-item:nth-child(3) { animation-delay: 0.15s; }
/* ... continues to nth-child(10) at 0.5s */
```

**Gradient Shift**
```css
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes gradientShiftFast {
  0%, 100% {
    background-position: 0% 50%;
    opacity: 0.7;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
}
```

**Text Glow Pulse**
```css
@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  }
  50% {
    text-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  }
}

.glow-text {
  animation: textGlow 3s ease-in-out infinite;
}
```

**Progress Pip Glow**
```css
@keyframes pipGlow {
  0% {
    box-shadow: 0 0 0 rgba(34, 197, 94, 0);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.8);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    transform: scale(1);
  }
}
```

**Shimmer Effect**
```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Typewriter Pulse (Gamepad Mode)**
```css
@keyframes pulse-typewriter {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.gamepad-continue-indicator span {
  animation: pulse-typewriter 1s ease-in-out infinite;
}
.gamepad-continue-indicator span:nth-child(2) { animation-delay: 0.15s; }
.gamepad-continue-indicator span:nth-child(3) { animation-delay: 0.3s; }
```

**Scrolling Text (Live Mode)**
```css
@keyframes scroll-text {
  0% { transform: translateX(0%); }
  90% { transform: translateX(-100%); }
  95% { transform: translateX(-100%); }
  100% { transform: translateX(0%); }
}

.scrolling-text {
  animation: scroll-text 8s linear infinite;
  animation-delay: 0.5s;
}
```

### 5.4 Easing Functions

**GSAP Easings**
```javascript
'power2.out'           // Standard smooth out
'power2.in'            // Standard smooth in
'power2.inOut'         // Smooth both directions
'back.out(1.7)'        // Spring overshoot (strong)
'back.out(2)'          // Spring overshoot (very strong)
'elastic.out(1, 0.5)'  // Elastic bounce
```

**CSS Cubic Bezier**
```css
cubic-bezier(0.34, 1.56, 0.64, 1)  /* Spring effect - PRIMARY easing */
ease-out                            /* Standard deceleration */
ease-in                             /* Standard acceleration */
ease-in-out                         /* Standard both */
linear                              /* No easing */
```

### 5.5 Duration Scale

```javascript
// GSAP durations (seconds)
0.1s   // Very fast (press)
0.15s  // Fast (quick feedback)
0.2s   // Standard fast
0.25s  // Modal backdrop
0.3s   // Standard medium
0.35s  // Modal content
0.4s   // Standard slow
0.5s   // Slow
0.6s   // Button stagger
0.7s   // Dialogue box
0.8s   // Card entrance
1.2s   // Gradient bar entrance
```

```css
/* CSS durations */
duration-100: 100ms
duration-150: 150ms
duration-200: 200ms    /* Fast interactions - PRIMARY */
duration-300: 300ms    /* Standard interactions - PRIMARY */
duration-500: 500ms
```

### 5.6 Confetti Celebrations (Wow-Mode)

**Canvas Confetti Library**
```javascript
import confetti from 'canvas-confetti';
```

**Completion Confetti (Dual Burst)**
```javascript
const duration = 3000;
const defaults = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 100000
};

// Fires from both left and right sides
// 250ms interval bursts
// Particle count decreases over time
```

**Milestone Confetti (25%, 50%, 75%)**
```javascript
confetti({
  particleCount: 30,
  spread: 60,
  origin: { y: 0.7 },
  zIndex: 100000,
  colors: ['#22c55e', '#4ade80', '#86efac'],  // Green theme
});
```

**Entry Confetti (Small Burst)**
```javascript
confetti({
  particleCount: 8,
  spread: 45,
  startVelocity: 20,
  origin: { x: 0.5, y: 0.6 },
  zIndex: 100000,
  colors: ['#22c55e', '#4ade80'],
  gravity: 1.2,
});
```

### 5.7 Micro-Interaction Specifications

**Hover States**
```css
/* Standard button hover */
scale: 1.02
translateY: -2px
box-shadow: enhanced

/* Magnetic button hover (wow-mode) */
scale: 1.03
translateY: -3px
glow-opacity: 1
box-shadow: colored enhanced

/* Icon button hover */
border-color: accent
background-overlay: opacity 100%
```

**Active/Press States**
```css
/* Standard button active */
scale: 0.98
translateY: 0
transition-duration: 0.1s

/* Magnetic button active */
scale: 0.97
transition-duration: 0.15s
```

**Focus States**
```css
outline: 3px solid #3b82f6 (light) / #60a5fa (dark)
outline-offset: 2px
border-radius: 3px
```

**Loading States**
```css
/* Spinner rotation */
animate-spin

/* Disabled button */
transform: none
opacity: reduced
cursor: not-allowed
```

---

## 6. Icon System

### 6.1 Current Icon Implementation

**All icons are inline SVG** (no icon library)

**SVG Icon Sizes**
```css
h-4 w-4: 16px × 16px      /* Small icons */
h-5 w-5: 20px × 20px      /* Medium icons */
h-6 w-6: 24px × 24px      /* Large icons */
h-8 w-8: 32px × 32px      /* XL icons (file upload) */
```

**Icon Colors**
```css
/* Light mode */
text-gray-400: #9ca3af
text-gray-500: #6b7280
text-gray-700: #374151
text-yellow-500: #eab308   /* Dark mode toggle */

/* Dark mode */
dark:text-gray-300: #d1d5db
dark:text-gray-400: #9ca3af
dark:text-gray-500: #6b7280
```

### 6.2 Icon Inventory

**UI Icons (Inline SVG)**
- Sun (light mode indicator)
- Moon (dark mode indicator)
- Upload cloud
- X (close button)
- Chevron down
- Chevron up
- Check mark
- Warning/Alert
- Info
- Spinner/Loading

**Recommended Icon Library**

For future scalability, consider:

**Option 1: Heroicons** (Tailwind's official icon set)
```bash
npm install @heroicons/react
```
- Native React components
- Perfect match for Tailwind aesthetic
- Outline and solid variants
- 24px and 20px sizes

**Option 2: Lucide React** (Feather Icons fork)
```bash
npm install lucide-react
```
- Lightweight
- Consistent stroke width
- Highly customizable
- Large icon set

### 6.3 Icon Size Scale (Recommended)

```css
/* Micro */
12px × 12px    /* Badge icons, inline indicators */

/* Small */
16px × 16px    /* Button icons, list icons */

/* Medium (Default) */
20px × 20px    /* Standard UI icons */

/* Large */
24px × 24px    /* Prominent actions */

/* XL */
32px × 32px    /* Empty states, feature icons */

/* 2XL */
48px × 48px    /* Hero icons, illustrations */
```

---

## 7. Component Patterns

### 7.1 Button Variants

**Primary Button**
```tsx
<button className="
  bg-black dark:bg-white
  text-white dark:text-black
  hover:bg-gray-800 dark:hover:bg-gray-100
  font-black tracking-tight uppercase
  px-6 py-3
  border border-black dark:border-white
  shadow-sm btn-spring
  disabled:transform-none disabled:hover:shadow-sm
" style={{ borderRadius: '3px' }}>
  Submit
</button>
```

**Gradient Button (Wow-Mode Enhanced)**
```tsx
<button className="
  bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600
  text-white
  border border-emerald-400
  hover:border-emerald-300
  hover:shadow-lg hover:shadow-emerald-500/40
  btn-magnetic
  font-black tracking-tight uppercase
  px-6 py-3
" style={{ borderRadius: '3px' }}>
  Submit
</button>
```

**Icon Button**
```tsx
<button className="
  group relative h-11 w-11
  flex items-center justify-center
  bg-gradient-to-br from-gray-50 to-gray-100
  dark:from-gray-800 dark:to-gray-900
  text-gray-700 dark:text-gray-300
  border border-gray-300 dark:border-gray-600
  hover:border-gray-400 dark:hover:border-gray-500
  hover:shadow-md
  transition-all duration-300 ease-out
  overflow-hidden
" style={{ borderRadius: '3px' }}>
  <div className="
    absolute inset-0
    bg-gradient-to-br from-gray-100 to-gray-200
    dark:from-gray-700 dark:to-gray-800
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300 ease-out
  " style={{ borderRadius: '3px' }} />
  <svg className="w-5 h-5 relative z-10">...</svg>
</button>
```

### 7.2 Input Variants

**Standard Input**
```tsx
<input className="
  w-full px-4 py-3
  bg-white dark:bg-gray-800
  border border-black dark:border-gray-600
  text-gray-900 dark:text-gray-100
  placeholder-gray-500 dark:placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500
  transition-all duration-200
  input-glow
" style={{ borderRadius: '3px' }} />
```

**Textarea**
```tsx
<textarea className="
  w-full px-4 py-3
  bg-white dark:bg-gray-800
  border border-black dark:border-gray-600
  text-gray-900 dark:text-gray-100
  placeholder-gray-500 dark:placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500
  transition-all duration-200
  resize-none
  input-glow
" style={{ borderRadius: '3px' }} />
```

### 7.3 Card Variants

**Default Card**
```tsx
<div className="
  bg-white dark:bg-gray-800
  border border-black dark:border-gray-600
  shadow-sm
  transition-all duration-200
" style={{ borderRadius: '3px' }}>
  {children}
</div>
```

**Elevated Card**
```tsx
<div className="
  bg-white dark:bg-gray-800
  border border-black dark:border-gray-600
  shadow-md hover:shadow-lg
  transition-all duration-200
" style={{ borderRadius: '3px' }}>
  {children}
</div>
```

### 7.4 Badge Variants

**Status Badges**
```tsx
<span className="
  inline-flex items-center
  px-3 py-1 text-sm
  font-bold rounded-full
  transition-all duration-200

  /* Blue variant */
  bg-blue-100 dark:bg-blue-800
  text-blue-700 dark:text-blue-300
  border border-blue-300 dark:border-blue-600
  hover:bg-blue-200 dark:hover:bg-blue-700
">
  Modified
</span>
```

### 7.5 Modal Pattern

**Structure**
```tsx
<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
  <div className="
    bg-white dark:bg-gray-800
    border-2 border-gray-300 dark:border-gray-600
    shadow-2xl
    max-w-lg w-full mx-4
  " style={{ borderRadius: '3px' }}>
    {/* Header */}
    <div className="px-6 py-4 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
        Title
      </h2>
    </div>

    {/* Content */}
    <div className="px-6 py-6">
      Content
    </div>

    {/* Footer */}
    <div className="px-6 py-4 border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 flex gap-3 justify-end">
      Buttons
    </div>
  </div>
</div>
```

### 7.6 Gamepad Mode Dialogue Box

**Modern Pixel-Art Dialogue**
```tsx
<div className="
  gamepad-dialogue-modern
  border-3 border-[#1a1a1a] dark:border-[#4a4a4a]
  rounded-lg
  bg-gradient-to-b from-white to-[#f8f8f8]
  dark:from-[#1a1a1a] dark:to-[#141414]
" style={{
  boxShadow: '0 4px 0 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
}}>
  {/* Name Tab */}
  <div className="
    gamepad-name-tab
    inline-flex items-center gap-2
    bg-[#1a1a1a] dark:bg-[#2a2a2a]
    text-white
    px-4 py-2
    rounded-br-lg
    pixelify-sans-700
  ">
    Character Name
  </div>

  {/* Dialogue Content */}
  <div className="
    gamepad-dialogue-content
    p-5
    pixelify-sans-400
    text-[1.15rem] leading-relaxed
    text-[#1a1a1a] dark:text-[#e5e5e5]
  ">
    Dialogue text here...
  </div>

  {/* Continue Indicator */}
  <div className="
    gamepad-continue-indicator
    flex items-center gap-0.5
    pixelify-sans-700
    text-[#666] dark:text-[#888]
    text-xl
  ">
    <span>▼</span>
    <span>▼</span>
    <span>▼</span>
  </div>
</div>
```

---

## 8. Accessibility Specifications

### 8.1 WCAG AA Compliance

**Touch Targets**
```css
min-height: 44px
min-width: 44px
```

**Focus Indicators**
```css
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 3px;
}

.dark *:focus-visible {
  outline-color: #60a5fa;
}
```

**Color Contrast Adjustments**
```css
/* Enhanced text colors for WCAG AA */
.text-gray-400 {
  color: #6b7280 !important;  /* Ensures 4.5:1 contrast on white */
}

.text-gray-500 {
  color: #4b5563 !important;  /* Better contrast than default */
}

.dark .text-gray-400 {
  color: #9ca3af !important;
}

.dark .text-gray-500 {
  color: #d1d5db !important;
}
```

**ARIA Attributes**
```tsx
// Loading states
<div role="status" aria-live="polite">
  <span aria-label="Loading...">Loading...</span>
</div>

// Buttons
disabled={isLoading}
aria-disabled={isLoading}

// Icons
aria-hidden="true"
```

### 8.2 Scrollbar Styling

**Custom Scrollbar**
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

---

## 9. Special Modes

### 9.1 Dark Mode

**Implementation**
```javascript
// Tailwind config
darkMode: 'class'

// Toggle via class on <html> or <body>
document.documentElement.classList.toggle('dark')
```

**Color Inversions**
```css
/* Backgrounds */
bg-white → dark:bg-gray-800
bg-gray-50 → dark:bg-gray-900
bg-gray-100 → dark:bg-gray-700

/* Text */
text-gray-900 → dark:text-gray-100
text-gray-700 → dark:text-gray-300
text-gray-500 → dark:text-gray-400

/* Borders */
border-black → dark:border-gray-600
border-gray-300 → dark:border-gray-600

/* Gradients */
from-gray-50 to-gray-100 → dark:from-gray-800 dark:to-gray-900
```

### 9.2 Wow-Mode (Enhanced Celebrations)

**Features**
- Confetti on completion
- Enhanced progress bar animations
- Magnetic button effects
- Colored gradient buttons
- Glow effects

**Toggle Implementation**
```javascript
const { wowModeEnabled, toggleWowMode } = useWowMode();
localStorage.setItem('am-translations-wow-mode', JSON.stringify(enabled));
```

**Visual Changes**
```css
/* Buttons become gradient with glow */
wowMode ? 'btn-magnetic' : 'btn-spring'

/* Progress segments get celebration animations */
animateSegmentCelebration(index)

/* Confetti triggers */
fireCompletionConfetti()
fireMilestoneConfetti()
```

### 9.3 Gamepad/Dialogue Mode

**Typography**
```css
font-family: "Pixelify Sans", sans-serif
font-weight: 400, 500, 600, 700
```

**Visual Style**
```css
/* Pixel-perfect borders */
border: 3px solid
border-radius: 8px

/* Pixel art rendering */
image-rendering: pixelated;
image-rendering: -moz-crisp-edges;
image-rendering: crisp-edges;

/* Retro shadows */
text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3)
box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2)
```

---

## 10. Implementation Notes

### 10.1 Design Philosophy

**Core Aesthetic: Sharp, Bold, High-Contrast**

1. **Sharp corners everywhere** - 3px border-radius is the standard
2. **Heavy font weights** - font-black (900) is primary UI weight
3. **Strong borders** - Black borders in light mode
4. **Uppercase text** - Buttons and labels use uppercase + tracking
5. **Gradient overlays** - Hover states use gradient backgrounds
6. **GSAP for quality** - Complex animations use GSAP, not just CSS
7. **Spring physics** - cubic-bezier(0.34, 1.56, 0.64, 1) is the signature easing

### 10.2 Animation Philosophy

1. **Entrance animations** - Everything fades in with slight Y-translation
2. **Hover states** - Scale + translate + shadow enhancements
3. **Spring physics** - Buttons have overshoot/bounce on interactions
4. **Stagger patterns** - Lists and button groups stagger in
5. **Celebration moments** - Wow-mode adds confetti + glow effects
6. **Smooth 60fps** - All animations optimized for performance

### 10.3 Color Usage Rules

1. **Gray is primary** - Most UI uses gray scale
2. **Blue for data** - JSON highlights, focus states, links
3. **Green for success** - Progress, completion, XLSX highlights
4. **Purple for characters** - Character name highlights
5. **Red for warnings** - Destructive actions, clickable highlights
6. **Gradients for flair** - Wow-mode and special states get gradients

### 10.4 Responsive Considerations

**Current Breakpoints**
```css
/* Mobile-first approach */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Spacing Adjustments**
```css
p-4 md:p-8         /* Increase padding on larger screens */
mx-4               /* Modal margins on mobile */
max-w-lg           /* Constrain modal width */
```

### 10.5 Performance Optimizations

1. **CSS-first for simple transitions** - Only use GSAP for complex animations
2. **Transform over position** - Use transform for animations (GPU accelerated)
3. **will-change sparingly** - Only add when necessary
4. **Debounce scroll events** - If implementing scroll-based animations
5. **Lazy load images** - For future image implementations
6. **Preload fonts** - Google Fonts with display=swap

---

## 11. File References

**Core Style Files**
- `/src/app/globals.css` - Global styles, animations, utilities
- `/tailwind.config.js` - Tailwind configuration

**Animation Hooks**
- `/src/hooks/animations/useWowMode.ts` - Wow-mode state management
- `/src/hooks/animations/useFooterGradientAnimation.ts` - GSAP gradient bar
- `/src/hooks/animations/useGradientBarAnimation.ts` - GSAP progress bar
- `/src/hooks/animations/useInterfaceAnimations.ts` - GSAP card/button animations

**Celebration Utilities**
- `/src/utils/celebrations.ts` - Confetti functions

**UI Components**
- `/src/components/ui/Button.tsx` - Button variants
- `/src/components/ui/Input.tsx` - Input, Textarea, Select
- `/src/components/ui/Card.tsx` - Card component
- `/src/components/ui/Badge.tsx` - Badge variants
- `/src/components/ui/Spinner.tsx` - Loading spinner

**Complex Components**
- `/src/components/ResetConfirmationModal.tsx` - Multi-step modal with GSAP
- `/src/components/TranslationHelper.tsx` - Main app interface
- `/src/components/SetupWizard.tsx` - Setup flow

---

## 12. Recommended Next Steps

### 12.1 Create Atomic Design System Components

**Tokens File**
```typescript
// tokens/colors.ts
export const colors = {
  primary: { ... },
  semantic: { ... },
  highlights: { ... }
}

// tokens/spacing.ts
export const spacing = { ... }

// tokens/typography.ts
export const typography = { ... }
```

**Component Library Improvements**
1. Extract all inline styles to component props
2. Create consistent variant system across all components
3. Add Storybook for component documentation
4. Implement proper TypeScript types for all variants

### 12.2 Animation Library

```typescript
// animations/presets.ts
export const SPRING_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
export const DURATIONS = { fast: 200, medium: 300, slow: 400 }

// animations/gsap-presets.ts
export const fadeInUp = (element, options) => { ... }
export const scaleIn = (element, options) => { ... }
```

### 12.3 Icon System Implementation

Install and implement Heroicons:
```bash
npm install @heroicons/react
```

Create icon wrapper component for consistent sizing.

---

**End of Design System Specifications**

This is your complete visual DNA. Every color, every shadow, every animation timing extracted from the codebase and documented for future consistency and expansion.
