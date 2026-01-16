/**
 * Design System - Spacing Tokens
 *
 * Consistent spacing scale based on 4px base unit.
 *
 * Usage:
 * - Import scale: import { spacing } from '@/design-system/tokens/spacing'
 * - Import component spacing: import { componentSpacing } from '@/design-system/tokens/spacing'
 */

// ============================================================================
// BASE SPACING SCALE
// ============================================================================

/** Base spacing scale in rem (4px base unit) */
export const spacing = {
  /** 0px */
  0: '0',
  /** 1px */
  px: '1px',
  /** 2px */
  0.5: '0.125rem',
  /** 4px */
  1: '0.25rem',
  /** 6px */
  1.5: '0.375rem',
  /** 8px */
  2: '0.5rem',
  /** 10px */
  2.5: '0.625rem',
  /** 12px */
  3: '0.75rem',
  /** 16px */
  4: '1rem',
  /** 20px */
  5: '1.25rem',
  /** 24px */
  6: '1.5rem',
  /** 32px */
  8: '2rem',
  /** 40px */
  10: '2.5rem',
  /** 48px */
  12: '3rem',
  /** 64px */
  16: '4rem',
  /** 80px */
  20: '5rem',
  /** 96px */
  24: '6rem',
} as const;

/** Spacing scale in pixels for reference */
export const spacingPx = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ============================================================================
// NAMED SPACING
// ============================================================================

export const namedSpacing = {
  /** 4px - Extra small gaps */
  xs: spacing[1],
  /** 8px - Small gaps */
  sm: spacing[2],
  /** 16px - Medium gaps (default) */
  md: spacing[4],
  /** 24px - Large gaps */
  lg: spacing[6],
  /** 32px - Extra large gaps */
  xl: spacing[8],
  /** 48px - 2x extra large */
  '2xl': spacing[12],
} as const;

// ============================================================================
// COMPONENT SPACING
// ============================================================================

export const componentSpacing = {
  /** Button padding */
  button: {
    sm: {
      x: spacing[4], // 16px
      y: spacing[2], // 8px
    },
    md: {
      x: spacing[6], // 24px
      y: spacing[3], // 12px
    },
    lg: {
      x: spacing[8], // 32px
      y: spacing[3], // 12px
    },
  },

  /** Icon button (square) */
  iconButton: {
    size: '44px', // WCAG AA touch target
  },

  /** Input/Textarea padding */
  input: {
    x: spacing[4], // 16px
    y: spacing[3], // 12px
  },

  /** Card padding */
  card: {
    sm: spacing[4], // 16px all sides
    md: spacing[6], // 24px all sides
    asymmetric: {
      x: spacing[6], // 24px horizontal
      y: spacing[4], // 16px vertical
    },
  },

  /** Modal sections */
  modal: {
    header: {
      x: spacing[6], // 24px
      y: spacing[4], // 16px
    },
    content: {
      x: spacing[6], // 24px
      y: spacing[6], // 24px
    },
    footer: {
      x: spacing[6], // 24px
      y: spacing[4], // 16px
    },
    /** Horizontal margin on mobile */
    margin: spacing[4], // 16px
  },

  /** Gamepad dialogue */
  gamepad: {
    nameTab: {
      x: '14px',
      y: '6px',
    },
    content: {
      x: '20px',
      y: '16px',
    },
  },
} as const;

// ============================================================================
// GAP PATTERNS
// ============================================================================

export const gap = {
  /** 4px - Tight elements */
  1: spacing[1],
  /** 8px - Related items */
  2: spacing[2],
  /** 12px - Button groups */
  3: spacing[3],
  /** 16px - Section spacing */
  4: spacing[4],
  /** 24px - Major sections */
  6: spacing[6],
} as const;

// ============================================================================
// VERTICAL SPACING (space-y)
// ============================================================================

export const verticalSpacing = {
  /** 6px - List items */
  tight: spacing[1.5],
  /** 8px - Form fields */
  normal: spacing[2],
  /** 16px - Sections */
  relaxed: spacing[4],
  /** 24px - Major sections */
  loose: spacing[6],
} as const;

// ============================================================================
// MARGIN PATTERNS
// ============================================================================

export const margin = {
  /** 4px */
  1: spacing[1],
  /** 8px */
  2: spacing[2],
  /** 12px */
  3: spacing[3],
  /** 16px */
  4: spacing[4],
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Spacing = typeof spacing;
export type NamedSpacing = typeof namedSpacing;
export type ComponentSpacing = typeof componentSpacing;
export type Gap = typeof gap;
