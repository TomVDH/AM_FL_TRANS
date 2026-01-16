/**
 * Design System - Typography Tokens
 *
 * Complete typography system including font families, sizes, weights, and more.
 *
 * Usage:
 * - Import individual tokens: import { fontFamily, fontSize } from '@/design-system/tokens/typography'
 * - Import everything: import * as typography from '@/design-system/tokens/typography'
 */

// ============================================================================
// FONT FAMILIES
// ============================================================================

export const fontFamily = {
  /** Primary system font stack for optimal performance and native feel */
  system: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",

  /** Pixel art font for gamepad/dialogue mode */
  pixelify: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',

  /** Decorative serif font */
  playfair: '"Playfair Display", Georgia, serif',

  /** Monospace for code/technical content */
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
} as const;

// ============================================================================
// FONT SIZES
// ============================================================================

export const fontSize = {
  /** 12px */
  xs: '0.75rem',
  /** 14px */
  sm: '0.875rem',
  /** 16px - Base size */
  base: '1rem',
  /** 18px */
  lg: '1.125rem',
  /** 20px */
  xl: '1.25rem',
  /** 24px */
  '2xl': '1.5rem',
  /** 30px */
  '3xl': '1.875rem',
  /** 36px */
  '4xl': '2.25rem',
  /** 48px - Main heading */
  '5xl': '3rem',
} as const;

/** Font sizes in pixels for reference */
export const fontSizePx = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

/** Gamepad mode specific sizes */
export const fontSizeGamepad = {
  /** Name tab */
  nameTab: '1rem',
  /** Dialogue content */
  dialogue: '1.15rem',
  /** Continue indicator */
  continueIndicator: '1.2rem',
} as const;

// ============================================================================
// FONT WEIGHTS
// ============================================================================

export const fontWeight = {
  /** 400 - Regular text */
  regular: 400,
  /** 500 - Medium emphasis */
  medium: 500,
  /** 600 - Semi-bold */
  semibold: 600,
  /** 700 - Bold headings */
  bold: 700,
  /** 900 - Primary UI weight (HEAVY use throughout app) */
  black: 900,
} as const;

/** Pixelify Sans available weights */
export const fontWeightPixelify = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ============================================================================
// LINE HEIGHTS
// ============================================================================

export const lineHeight = {
  /** Tight - for headings */
  tight: 1.2,
  /** Snug */
  snug: 1.375,
  /** Normal - body text base */
  normal: 1.5,
  /** Relaxed - body text */
  relaxed: 1.6,
  /** Loose - paragraph text */
  loose: 1.7,
  /** Gamepad dialogue text */
  gamepad: 1.65,
} as const;

// ============================================================================
// LETTER SPACING
// ============================================================================

export const letterSpacing = {
  /** Tighter - decorative headings */
  tighter: '-0.05em',
  /** Tight - headings */
  tight: '-0.025em',
  /** Normal - body/UI elements */
  normal: '-0.011em',
  /** Wide - labels */
  wide: '0.025em',
  /** Wider - uppercase text */
  wider: '0.05em',
  /** Gamepad dialogue */
  gamepad: '0.01em',
} as const;

// ============================================================================
// TEXT RENDERING
// ============================================================================

export const textRendering = {
  /** Standard antialiasing for webkit */
  webkitFontSmoothing: 'antialiased',
  /** Standard antialiasing for Firefox */
  mozOsxFontSmoothing: 'grayscale',
  /** Optimized legibility for dialogue */
  optimizeLegibility: 'optimizeLegibility',
} as const;

export const fontFeatureSettings = {
  /** Ligatures and kerning for dialogue text */
  dialogue: '"liga" 1, "kern" 1',
} as const;

// ============================================================================
// TYPOGRAPHY PRESETS
// ============================================================================

export const presets = {
  /** Main page heading */
  heading1: {
    fontFamily: fontFamily.system,
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },

  /** Section heading */
  heading2: {
    fontFamily: fontFamily.system,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },

  /** Subsection heading */
  heading3: {
    fontFamily: fontFamily.system,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },

  /** Body text */
  body: {
    fontFamily: fontFamily.system,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.loose,
    letterSpacing: letterSpacing.normal,
  },

  /** Small text */
  small: {
    fontFamily: fontFamily.system,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  /** Button text */
  button: {
    fontFamily: fontFamily.system,
    fontSize: fontSize.base,
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.tight,
    textTransform: 'uppercase' as const,
  },

  /** Label text */
  label: {
    fontFamily: fontFamily.system,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  /** Gamepad dialogue */
  gamepadDialogue: {
    fontFamily: fontFamily.pixelify,
    fontSize: fontSizeGamepad.dialogue,
    fontWeight: fontWeightPixelify.regular,
    lineHeight: lineHeight.gamepad,
    letterSpacing: letterSpacing.gamepad,
  },

  /** Gamepad name tab */
  gamepadNameTab: {
    fontFamily: fontFamily.pixelify,
    fontSize: fontSizeGamepad.nameTab,
    fontWeight: fontWeightPixelify.bold,
    lineHeight: lineHeight.normal,
  },

  /** Code/monospace */
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type FontFamily = typeof fontFamily;
export type FontSize = typeof fontSize;
export type FontWeight = typeof fontWeight;
export type LineHeight = typeof lineHeight;
export type LetterSpacing = typeof letterSpacing;
export type TypographyPreset = typeof presets;
