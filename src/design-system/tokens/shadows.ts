/**
 * Design System - Shadow Tokens
 *
 * Box shadows, text shadows, and glow effects.
 *
 * Usage:
 * - Import shadows: import { boxShadow } from '@/design-system/tokens/shadows'
 * - Import glows: import { glow } from '@/design-system/tokens/shadows'
 */

// ============================================================================
// BOX SHADOWS - STANDARD SCALE
// ============================================================================

export const boxShadow = {
  /** Subtle shadow */
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  /** Default shadow */
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  /** Medium shadow */
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  /** Large shadow */
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  /** Extra large shadow */
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  /** 2x extra large shadow */
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  /** No shadow */
  none: 'none',
} as const;

// ============================================================================
// BUTTON SHADOWS
// ============================================================================

export const buttonShadow = {
  /** Default resting state */
  default: boxShadow.sm,

  /** Spring hover effect */
  springHover: '0 10px 20px -5px rgba(0, 0, 0, 0.15)',

  /** Spring active/pressed effect */
  springActive: '0 2px 5px -2px rgba(0, 0, 0, 0.2)',

  /** Magnetic hover (wow-mode) */
  magneticHover: `0 15px 30px -5px rgba(168, 85, 247, 0.25),
                  0 8px 15px -5px rgba(236, 72, 153, 0.2)`,
} as const;

// ============================================================================
// COLORED SHADOWS (GLOW EFFECTS)
// ============================================================================

export const coloredShadow = {
  /** Violet glow for wow-mode buttons */
  violet: {
    hover: '0 10px 15px -3px rgba(139, 92, 246, 0.3)',
    lg: '0 10px 15px -3px rgba(139, 92, 246, 0.3)',
  },

  /** Fuchsia glow for wow-mode buttons */
  fuchsia: {
    hover: '0 10px 15px -3px rgba(217, 70, 239, 0.3)',
    lg: '0 10px 15px -3px rgba(217, 70, 239, 0.3)',
  },

  /** Emerald glow for wow-mode submit */
  emerald: {
    hover: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
    lg: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
  },

  /** Badge shadows */
  indigo: '0 10px 15px -3px rgba(99, 102, 241, 0.25)',
  amber: '0 10px 15px -3px rgba(245, 158, 11, 0.25)',
  cyan: '0 10px 15px -3px rgba(6, 182, 212, 0.25)',
  rose: '0 10px 15px -3px rgba(244, 63, 94, 0.25)',
  purple: '0 10px 15px -3px rgba(168, 85, 247, 0.25)',

  /** Green progress/success glow */
  green: {
    celebration: '0 0 25px rgba(34, 197, 94, 0.9), 0 0 50px rgba(34, 197, 94, 0.5)',
    resting: '0 0 8px rgba(34, 197, 94, 0.4)',
    pulse: '0 0 15px rgba(34, 197, 94, 0.8)',
  },
} as const;

// ============================================================================
// GAMEPAD MODE SHADOWS
// ============================================================================

export const gamepadShadow = {
  /** Dialogue box shadow */
  dialogueBox: {
    light: `0 4px 0 0 rgba(0, 0, 0, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.8)`,
    dark: `0 4px 0 0 rgba(0, 0, 0, 0.4),
           inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
  },

  /** Name tab shadow */
  nameTab: {
    light: '2px 2px 0 0 rgba(0, 0, 0, 0.15)',
    dark: '2px 2px 0 0 rgba(0, 0, 0, 0.3)',
  },

  /** Source preview (inset) */
  sourcePreview: {
    light: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
    dark: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
  },
} as const;

// ============================================================================
// ANIMATION SHADOWS (GSAP)
// ============================================================================

export const animationShadow = {
  /** Gradient bar default */
  gradientBarDefault: '0 4px 12px rgba(0, 0, 0, 0.15)',

  /** Gradient bar hover */
  gradientBarHover: '0 8px 25px rgba(0, 0, 0, 0.3)',

  /** Progress bar hover */
  progressBarHover: '0 8px 25px rgba(0, 0, 0, 0.2)',
} as const;

// ============================================================================
// INPUT FOCUS SHADOWS (GLOW)
// ============================================================================

export const inputShadow = {
  /** Standard input focus glow */
  focus: {
    light: '0 0 0 3px rgba(59, 130, 246, 0.3)',
    dark: '0 0 0 3px rgba(96, 165, 250, 0.3)',
  },

  /** Enhanced textarea focus */
  textareaFocus: {
    light: `0 0 0 3px rgba(59, 130, 246, 0.3),
            0 4px 20px -5px rgba(59, 130, 246, 0.2)`,
    dark: `0 0 0 3px rgba(96, 165, 250, 0.3),
           0 4px 20px -5px rgba(96, 165, 250, 0.2)`,
  },
} as const;

// ============================================================================
// TEXT SHADOWS
// ============================================================================

export const textShadow = {
  /** Pixel art text shadow */
  pixel: '2px 2px 0px rgba(0, 0, 0, 0.3)',

  /** Glow text effect */
  glow: {
    light: '0 0 8px rgba(59, 130, 246, 0.4)',
    dark: '0 0 8px rgba(96, 165, 250, 0.5)',
  },

  /** Animated glow (at 50% keyframe) */
  glowPeak: {
    light: '0 0 12px rgba(59, 130, 246, 0.6)',
    dark: '0 0 12px rgba(96, 165, 250, 0.7)',
  },
} as const;

// ============================================================================
// HIGHLIGHT SHADOWS
// ============================================================================

export const highlightShadow = {
  /** JSON highlight hover */
  json: '0 0 4px rgba(59, 130, 246, 0.4)',

  /** XLSX highlight hover */
  xlsx: '0 0 4px rgba(16, 185, 129, 0.4)',

  /** Character highlight hover */
  character: '0 0 4px rgba(139, 92, 246, 0.4)',

  /** Clickable highlight hover */
  clickable: '0 0 4px rgba(239, 68, 68, 0.4)',
} as const;

// ============================================================================
// MAGNETIC BUTTON GLOW
// ============================================================================

export const magneticGlow = {
  /** Glow pseudo-element styles */
  gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))',
  blur: '8px',
  inset: '-4px',
  borderRadius: '5px',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type BoxShadow = typeof boxShadow;
export type ButtonShadow = typeof buttonShadow;
export type ColoredShadow = typeof coloredShadow;
export type GamepadShadow = typeof gamepadShadow;
export type TextShadow = typeof textShadow;
