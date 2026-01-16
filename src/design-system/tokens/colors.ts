/**
 * Design System - Color Tokens
 *
 * Complete color palette for the application.
 * All colors are defined as constants for type safety and easy theming.
 *
 * Usage:
 * - Import individual palettes: import { gray, blue } from '@/design-system/tokens/colors'
 * - Import semantic colors: import { semantic, highlights } from '@/design-system/tokens/colors'
 * - Import everything: import * as colors from '@/design-system/tokens/colors'
 */

// ============================================================================
// GRAYSCALE PALETTE
// ============================================================================

export const gray = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
} as const;

/** WCAG AA enhanced grays for better contrast */
export const grayEnhanced = {
  400: '#6b7280', // Ensures 4.5:1 contrast on white
  500: '#4b5563', // Better contrast than default
} as const;

/** Dark mode gray equivalents */
export const grayDark = {
  50: '#111827',
  100: '#1f2937',
  700: '#9ca3af',
  800: '#1f2937',
  900: '#0f1419',
} as const;

// ============================================================================
// PRIMARY COLORS
// ============================================================================

export const blue = {
  50: '#eff6ff',
  100: '#dbeafe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
} as const;

export const purple = {
  50: '#faf5ff',
  100: '#f3e8ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
} as const;

export const violet = {
  50: '#f5f3ff',
  100: '#ede9fe',
  400: '#a78bfa',
  500: '#8b5cf6',
  600: '#7c3aed',
} as const;

// ============================================================================
// SEMANTIC COLORS
// ============================================================================

export const green = {
  50: '#f0fdf4',
  100: '#dcfce7',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
} as const;

export const emerald = {
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981',
} as const;

export const teal = {
  500: '#14b8a6',
  600: '#0d9488',
} as const;

export const red = {
  50: '#fef2f2',
  100: '#fee2e2',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
} as const;

export const rose = {
  400: '#fb7185',
  500: '#f43f5f',
} as const;

export const amber = {
  100: '#fef3c7',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
} as const;

export const orange = {
  100: '#ffedd5',
  500: '#f97316',
  600: '#ea580c',
} as const;

export const cyan = {
  100: '#cffafe',
  400: '#22d3ee',
  500: '#06b6d4',
} as const;

export const sky = {
  100: '#f0f9ff',
  600: '#0284c7',
} as const;

export const lime = {
  100: '#ecfccb',
} as const;

export const pink = {
  50: '#fdf2f8',
  100: '#fce7f3',
  500: '#ec4899',
  600: '#db2777',
} as const;

export const fuchsia = {
  100: '#fae8ff',
  400: '#e879f9',
  500: '#d946ef',
  600: '#c026d3',
} as const;

export const indigo = {
  400: '#818cf8',
  500: '#6366f1',
} as const;

// ============================================================================
// SEMANTIC COLOR TOKENS
// ============================================================================

export const semantic = {
  /** Primary interactive color */
  primary: blue[500],
  primaryHover: blue[600],
  primaryLight: blue[100],

  /** Success/Progress states */
  success: green[500],
  successLight: green[100],
  successDark: green[700],

  /** Error/Destructive states */
  error: red[500],
  errorLight: red[100],
  errorDark: red[700],

  /** Warning states */
  warning: amber[500],
  warningLight: amber[100],
  warningDark: amber[700],

  /** Info states */
  info: cyan[500],
  infoLight: cyan[100],

  /** Text colors */
  textPrimary: gray[900],
  textSecondary: gray[700],
  textMuted: gray[500],
  textDisabled: gray[400],

  /** Background colors */
  bgPrimary: '#ffffff',
  bgSecondary: gray[50],
  bgTertiary: gray[100],

  /** Border colors */
  borderPrimary: '#000000',
  borderSecondary: gray[300],
  borderTertiary: gray[200],
} as const;

export const semanticDark = {
  /** Primary interactive color */
  primary: blue[400],
  primaryHover: blue[300],
  primaryLight: blue[800],

  /** Success/Progress states */
  success: green[400],
  successLight: green[800],
  successDark: green[300],

  /** Error/Destructive states */
  error: red[400],
  errorLight: red[700],
  errorDark: red[300],

  /** Warning states */
  warning: amber[400],
  warningLight: amber[700],
  warningDark: amber[400],

  /** Info states */
  info: cyan[400],
  infoLight: cyan[100],

  /** Text colors */
  textPrimary: gray[100],
  textSecondary: gray[300],
  textMuted: gray[400],
  textDisabled: gray[500],

  /** Background colors */
  bgPrimary: gray[800],
  bgSecondary: gray[900],
  bgTertiary: gray[700],

  /** Border colors */
  borderPrimary: gray[600],
  borderSecondary: gray[600],
  borderTertiary: gray[700],
} as const;

// ============================================================================
// RANDOM BACKGROUND COLORS
// ============================================================================

export const randomBackgrounds = {
  light: {
    1: '#fef3c7', // Amber 100
    2: '#dbeafe', // Blue 100
    3: '#fce7f3', // Pink 100
    4: '#ddd6fe', // Violet 100
    5: '#dcfce7', // Green 100
    6: '#ffedd5', // Orange 100
    7: '#f0f9ff', // Sky 100
    8: '#fae8ff', // Fuchsia 100
    9: '#ecfccb', // Lime 100
    10: '#cffafe', // Cyan 100
  },
  dark: {
    1: '#1a1510', // Dark amber
    2: '#0f1419', // Dark blue
    3: '#1a0f14', // Dark pink
    4: '#151019', // Dark violet
    5: '#0f1a10', // Dark green
    6: '#1a1410', // Dark orange
    7: '#0f1519', // Dark sky
    8: '#19101a', // Dark fuchsia
    9: '#131a0f', // Dark lime
    10: '#0f1a19', // Dark cyan
  },
} as const;

// ============================================================================
// HIGHLIGHT COLORS
// ============================================================================

export const highlights = {
  /** JSON data highlights (blue) */
  json: {
    background: 'rgba(59, 130, 246, 0.2)',
    backgroundHover: 'rgba(59, 130, 246, 0.35)',
    border: blue[500],
    shadow: 'rgba(59, 130, 246, 0.4)',
    dark: {
      background: 'rgba(59, 130, 246, 0.25)',
      backgroundHover: 'rgba(59, 130, 246, 0.4)',
      border: blue[400],
    },
  },

  /** XLSX data highlights (green/emerald) */
  xlsx: {
    background: 'rgba(16, 185, 129, 0.2)',
    backgroundHover: 'rgba(16, 185, 129, 0.35)',
    border: emerald[500],
    shadow: 'rgba(16, 185, 129, 0.4)',
    dark: {
      background: 'rgba(16, 185, 129, 0.25)',
      backgroundHover: 'rgba(16, 185, 129, 0.4)',
      border: emerald[400],
    },
  },

  /** Character name highlights (purple/violet) */
  character: {
    background: 'rgba(139, 92, 246, 0.2)',
    backgroundHover: 'rgba(139, 92, 246, 0.35)',
    border: violet[500],
    shadow: 'rgba(139, 92, 246, 0.4)',
    dark: {
      background: 'rgba(139, 92, 246, 0.25)',
      backgroundHover: 'rgba(139, 92, 246, 0.4)',
      border: violet[400],
    },
  },

  /** Clickable highlights (red) */
  clickable: {
    background: 'rgba(239, 68, 68, 0.2)',
    backgroundHover: 'rgba(239, 68, 68, 0.35)',
    border: red[500],
    shadow: 'rgba(239, 68, 68, 0.4)',
    dark: {
      background: 'rgba(239, 68, 68, 0.25)',
      backgroundHover: 'rgba(239, 68, 68, 0.4)',
      border: red[400],
    },
  },
} as const;

// ============================================================================
// FOCUS STATES
// ============================================================================

export const focus = {
  ring: blue[500],
  ringDark: blue[400],
  ringOffset: '2px',
  ringWidth: '3px',
} as const;

// ============================================================================
// TOAST/NOTIFICATION COLORS
// ============================================================================

export const toast = {
  light: {
    background: '#ffffff',
    text: gray[800],
    border: gray[300],
  },
  dark: {
    background: gray[800],
    text: gray[50],
    border: gray[600],
  },
} as const;

// ============================================================================
// GAMEPAD MODE COLORS
// ============================================================================

export const gamepad = {
  light: {
    border: '#1a1a1a',
    background: '#ffffff',
    backgroundGradientStart: '#ffffff',
    backgroundGradientEnd: '#f8f8f8',
    nameTabBackground: '#1a1a1a',
    nameTabText: '#ffffff',
    dialogueText: '#1a1a1a',
    continueIndicator: '#666666',
    sourcePreviewBorder: '#d0d0d0',
    sourcePreviewBgStart: '#fafafa',
    sourcePreviewBgEnd: '#f0f0f0',
  },
  dark: {
    border: '#4a4a4a',
    background: '#1a1a1a',
    backgroundGradientStart: '#1a1a1a',
    backgroundGradientEnd: '#141414',
    nameTabBackground: '#2a2a2a',
    nameTabText: '#ffffff',
    dialogueText: '#e5e5e5',
    continueIndicator: '#888888',
    sourcePreviewBorder: '#3a3a3a',
    sourcePreviewBgStart: '#1e1e1e',
    sourcePreviewBgEnd: '#181818',
  },
} as const;

// ============================================================================
// GRADIENT DEFINITIONS
// ============================================================================

export const gradients = {
  /** Button gradients */
  button: {
    light: {
      default: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
      hover: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
    },
    dark: {
      default: 'linear-gradient(to bottom right, #1f2937, #111827)',
      hover: 'linear-gradient(to bottom right, #374151, #1f2937)',
    },
  },

  /** Wow-mode button gradients */
  wowMode: {
    violet: {
      default: 'linear-gradient(to bottom right, #8b5cf6, #9333ea)',
      hover: 'linear-gradient(to bottom right, #a78bfa, #a855f7)',
    },
    fuchsia: {
      default: 'linear-gradient(to bottom right, #d946ef, #db2777)',
      hover: 'linear-gradient(to bottom right, #e879f9, #ec4899)',
    },
    emerald: {
      default: 'linear-gradient(to bottom right, #10b981, #22c55e, #0d9488)',
      hover: 'linear-gradient(to bottom right, #34d399, #4ade80, #14b8a6)',
    },
    submit: {
      light: 'linear-gradient(to bottom right, #111827, #000000, #111827)',
      dark: 'linear-gradient(to bottom right, #f3f4f6, #ffffff, #f3f4f6)',
    },
  },

  /** Badge/indicator gradients */
  badge: {
    modified: 'linear-gradient(to right, #6366f1, #2563eb)',
    warning: 'linear-gradient(to right, #f59e0b, #f97316)',
    info: 'linear-gradient(to right, #06b6d4, #0284c7)',
    error: 'linear-gradient(to right, #f43f5f, #dc2626)',
    codex: 'linear-gradient(to right, #a855f7, #ec4899)',
  },

  /** Modal confirmation gradients (progressive warning) */
  modal: {
    step1: {
      light: 'linear-gradient(to bottom right, #374151, #1f2937)',
      dark: 'linear-gradient(to bottom right, #4b5563, #374151)',
    },
    step2: {
      light: 'linear-gradient(to bottom right, #d97706, #b45309)',
      dark: 'linear-gradient(to bottom right, #f59e0b, #d97706)',
    },
    step3: {
      light: 'linear-gradient(to bottom right, #dc2626, #b91c1c)',
      dark: 'linear-gradient(to bottom right, #ef4444, #dc2626)',
    },
  },

  /** Magnetic button glow */
  magneticGlow: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))',

  /** Gamepad dialogue */
  gamepadDialogue: {
    light: 'linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)',
    dark: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
  },

  /** Gamepad source preview */
  gamepadSource: {
    light: 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)',
    dark: 'linear-gradient(180deg, #1e1e1e 0%, #181818 100%)',
  },
} as const;

// ============================================================================
// CONFETTI COLORS
// ============================================================================

export const confetti = {
  standard: [green[500], green[400], green[300]],
  milestone: [green[500], green[400], green[300]],
  completion: [green[500], green[400], amber[500], blue[500], purple[500]],
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type GrayScale = typeof gray;
export type SemanticColors = typeof semantic;
export type HighlightColors = typeof highlights;
export type RandomBackgrounds = typeof randomBackgrounds;
export type Gradients = typeof gradients;
