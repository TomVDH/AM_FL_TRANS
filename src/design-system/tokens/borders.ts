/**
 * Design System - Border Tokens
 *
 * Border radii, widths, and color definitions.
 *
 * Usage:
 * - Import radii: import { borderRadius } from '@/design-system/tokens/borders'
 * - Import widths: import { borderWidth } from '@/design-system/tokens/borders'
 */

import { gray, blue } from './colors';

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  /** 0px - No rounding */
  none: '0',
  /** 2px - Subtle rounding */
  sm: '2px',
  /** 3px - Standard app radius (PRIMARY) */
  md: '3px',
  /** 4px - Scrollbar thumb */
  DEFAULT: '4px',
  /** 6px - Gamepad source preview */
  lg: '6px',
  /** 8px - Gamepad dialogue box */
  xl: '8px',
  /** Full circle */
  full: '9999px',
} as const;

/** Gamepad mode specific radii */
export const borderRadiusGamepad = {
  /** Dialogue box */
  dialogueBox: '8px',
  /** Name tab (bottom-right only) */
  nameTab: '0 0 8px 0',
  /** Source preview */
  sourcePreview: '6px',
  /** Progress indicators */
  progress: '1px',
} as const;

// ============================================================================
// BORDER WIDTH
// ============================================================================

export const borderWidth = {
  /** 0px */
  0: '0',
  /** 1px - Standard border */
  DEFAULT: '1px',
  /** 2px - Emphasized border */
  2: '2px',
  /** 3px - Gamepad dialogue */
  3: '3px',
  /** 4px - Pixel art border */
  4: '4px',
} as const;

// ============================================================================
// BORDER COLORS
// ============================================================================

export const borderColor = {
  light: {
    /** Primary border - black */
    primary: '#000000',
    /** Secondary border */
    secondary: gray[300],
    /** Tertiary border */
    tertiary: gray[200],
    /** Focus border */
    focus: blue[500],
  },
  dark: {
    /** Primary border */
    primary: gray[600],
    /** Secondary border */
    secondary: gray[600],
    /** Tertiary border */
    tertiary: gray[700],
    /** Focus border */
    focus: blue[400],
  },
} as const;

// ============================================================================
// BORDER STYLES
// ============================================================================

export const borderStyle = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  none: 'none',
} as const;

// ============================================================================
// COMPLETE BORDER PRESETS
// ============================================================================

export const borderPresets = {
  /** Standard card/component border */
  card: {
    light: `${borderWidth.DEFAULT} solid #000000`,
    dark: `${borderWidth.DEFAULT} solid ${gray[600]}`,
  },

  /** Input border */
  input: {
    light: `${borderWidth.DEFAULT} solid #000000`,
    dark: `${borderWidth.DEFAULT} solid ${gray[600]}`,
  },

  /** Modal border */
  modal: {
    light: `${borderWidth[2]} solid ${gray[300]}`,
    dark: `${borderWidth[2]} solid ${gray[600]}`,
  },

  /** Section divider */
  divider: {
    light: `${borderWidth[2]} solid ${gray[300]}`,
    dark: `${borderWidth[2]} solid ${gray[600]}`,
  },

  /** Gamepad dialogue border */
  gamepadDialogue: {
    light: `${borderWidth[3]} solid #1a1a1a`,
    dark: `${borderWidth[3]} solid #4a4a4a`,
  },

  /** Gamepad source preview */
  gamepadSource: {
    light: `${borderWidth[2]} solid #d0d0d0`,
    dark: `${borderWidth[2]} solid #3a3a3a`,
  },

  /** Pixel art border */
  pixelArt: {
    style: 'solid',
    width: borderWidth[4],
    image: 'linear-gradient(45deg, #000000, #333333) 1',
  },

  /** Highlight border (bottom only) */
  highlight: {
    width: borderWidth[2],
    style: 'solid',
  },
} as const;

// ============================================================================
// OUTLINE (FOCUS) STYLES
// ============================================================================

export const outline = {
  /** Standard focus outline */
  focus: {
    width: '3px',
    style: 'solid',
    offset: '2px',
    color: {
      light: blue[500],
      dark: blue[400],
    },
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type BorderRadius = typeof borderRadius;
export type BorderWidth = typeof borderWidth;
export type BorderColor = typeof borderColor;
export type BorderPresets = typeof borderPresets;
