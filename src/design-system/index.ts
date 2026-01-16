/**
 * AM Translations Helper - Design System
 *
 * A comprehensive, reusable design system with formalized design tokens.
 * This system can be copied to other projects for consistent styling.
 *
 * Core Philosophy:
 * - Sharp, bold, high-contrast aesthetic
 * - 3px border-radius standard
 * - Heavy font weights (font-black/900 is primary)
 * - Spring physics for animations
 * - GSAP for complex animations, CSS for simple transitions
 *
 * Usage:
 *
 * 1. Import specific tokens:
 *    import { gray, blue, fontSize, spacing } from '@/design-system'
 *
 * 2. Import token categories:
 *    import { colors, typography, animations } from '@/design-system'
 *
 * 3. Import everything:
 *    import * as designSystem from '@/design-system'
 *
 * 4. Use in Tailwind config:
 *    const { colors, spacing } from './src/design-system'
 *    module.exports = { theme: { extend: { colors: colors.gray } } }
 *
 * 5. Use in runtime code:
 *    import { gsapPresets, easing } from '@/design-system'
 *    gsap.to(el, { ...gsapPresets.cardEntrance.to })
 *
 * @packageDocumentation
 */

// ============================================================================
// RE-EXPORT ALL TOKENS
// ============================================================================

export * from './tokens';

// ============================================================================
// DESIGN SYSTEM METADATA
// ============================================================================

export const designSystemMeta = {
  name: 'AM Translations Helper Design System',
  version: '1.0.0',
  description: 'Sharp, bold, high-contrast design system with spring animations',

  /** Core design principles */
  principles: {
    borderRadius: '3px is the standard for all components',
    fontWeight: 'font-black (900) is the primary UI weight',
    borders: 'Strong black borders in light mode',
    typography: 'Uppercase + tight tracking for buttons/labels',
    animations: 'Spring physics with cubic-bezier(0.34, 1.56, 0.64, 1)',
    gsap: 'Used for complex animations; CSS for simple transitions',
  },

  /** Technology stack */
  stack: {
    framework: 'Next.js / React',
    styling: 'Tailwind CSS',
    animations: 'GSAP 3.12+',
    fonts: ['System font stack', 'Pixelify Sans (Google Fonts)'],
  },

  /** Breakpoints (Tailwind defaults) */
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  /** WCAG AA compliance notes */
  accessibility: {
    touchTargetMinimum: '44px',
    focusRingWidth: '3px',
    focusRingOffset: '2px',
    contrastRatio: '4.5:1 minimum for text',
  },
} as const;

// ============================================================================
// TAILWIND THEME HELPERS
// ============================================================================

import {
  gray,
  blue,
  purple,
  violet,
  green,
  emerald,
  teal,
  red,
  rose,
  amber,
  orange,
  cyan,
  sky,
  lime,
  pink,
  fuchsia,
  indigo,
} from './tokens/colors';

import { borderRadius, borderWidth } from './tokens/borders';
import { boxShadow } from './tokens/shadows';
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from './tokens/typography';

/**
 * Ready-to-use Tailwind theme extension object.
 * Spread this into your tailwind.config.js theme.extend
 *
 * @example
 * // tailwind.config.js
 * const { tailwindTheme } from './src/design-system'
 * module.exports = {
 *   theme: {
 *     extend: tailwindTheme
 *   }
 * }
 */
export const tailwindTheme = {
  colors: {
    gray,
    blue,
    purple,
    violet,
    green,
    emerald,
    teal,
    red,
    rose,
    amber,
    orange,
    cyan,
    sky,
    lime,
    pink,
    fuchsia,
    indigo,
  },
  borderRadius: {
    none: borderRadius.none,
    sm: borderRadius.sm,
    DEFAULT: borderRadius.md,
    md: borderRadius.md,
    lg: borderRadius.lg,
    xl: borderRadius.xl,
    full: borderRadius.full,
  },
  borderWidth: {
    DEFAULT: borderWidth.DEFAULT,
    0: borderWidth[0],
    2: borderWidth[2],
    3: borderWidth[3],
    4: borderWidth[4],
  },
  boxShadow: {
    sm: boxShadow.sm,
    DEFAULT: boxShadow.DEFAULT,
    md: boxShadow.md,
    lg: boxShadow.lg,
    xl: boxShadow.xl,
    '2xl': boxShadow['2xl'],
    none: boxShadow.none,
  },
  fontFamily: {
    sans: [fontFamily.system],
    pixel: [fontFamily.pixelify],
    serif: [fontFamily.playfair],
    mono: [fontFamily.mono],
  },
  fontSize: {
    xs: fontSize.xs,
    sm: fontSize.sm,
    base: fontSize.base,
    lg: fontSize.lg,
    xl: fontSize.xl,
    '2xl': fontSize['2xl'],
    '3xl': fontSize['3xl'],
    '4xl': fontSize['4xl'],
    '5xl': fontSize['5xl'],
  },
  fontWeight: {
    normal: fontWeight.regular,
    medium: fontWeight.medium,
    semibold: fontWeight.semibold,
    bold: fontWeight.bold,
    black: fontWeight.black,
  },
  lineHeight: {
    tight: String(lineHeight.tight),
    snug: String(lineHeight.snug),
    normal: String(lineHeight.normal),
    relaxed: String(lineHeight.relaxed),
    loose: String(lineHeight.loose),
  },
  letterSpacing: {
    tighter: letterSpacing.tighter,
    tight: letterSpacing.tight,
    normal: letterSpacing.normal,
    wide: letterSpacing.wide,
    wider: letterSpacing.wider,
  },
} as const;

// ============================================================================
// CSS CUSTOM PROPERTIES GENERATOR
// ============================================================================

/**
 * Generates CSS custom properties (variables) from the design tokens.
 * Useful for CSS-in-JS solutions or generating a CSS variables file.
 *
 * @example
 * const cssVars = generateCssVariables()
 * // Returns: { '--color-gray-50': '#f9fafb', '--color-gray-100': '#f3f4f6', ... }
 */
export function generateCssVariables(): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  Object.entries(gray).forEach(([key, value]) => {
    vars[`--color-gray-${key}`] = value;
  });
  Object.entries(blue).forEach(([key, value]) => {
    vars[`--color-blue-${key}`] = value;
  });
  Object.entries(green).forEach(([key, value]) => {
    vars[`--color-green-${key}`] = value;
  });
  Object.entries(red).forEach(([key, value]) => {
    vars[`--color-red-${key}`] = value;
  });
  Object.entries(amber).forEach(([key, value]) => {
    vars[`--color-amber-${key}`] = value;
  });
  Object.entries(purple).forEach(([key, value]) => {
    vars[`--color-purple-${key}`] = value;
  });
  Object.entries(violet).forEach(([key, value]) => {
    vars[`--color-violet-${key}`] = value;
  });

  // Typography
  vars['--font-family-system'] = fontFamily.system;
  vars['--font-family-pixel'] = fontFamily.pixelify;
  vars['--font-family-mono'] = fontFamily.mono;

  Object.entries(fontSize).forEach(([key, value]) => {
    vars[`--font-size-${key}`] = value;
  });

  // Spacing
  vars['--border-radius-sm'] = borderRadius.sm;
  vars['--border-radius-md'] = borderRadius.md;
  vars['--border-radius-lg'] = borderRadius.lg;
  vars['--border-radius-xl'] = borderRadius.xl;

  return vars;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type DesignSystemMeta = typeof designSystemMeta;
export type TailwindTheme = typeof tailwindTheme;
