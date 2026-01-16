/**
 * Design System - Token Index
 *
 * Re-exports all design tokens for convenient importing.
 *
 * Usage:
 * - Import specific tokens: import { gray, blue, fontSize } from '@/design-system/tokens'
 * - Import categories: import { colors, typography } from '@/design-system/tokens'
 * - Import everything: import * as tokens from '@/design-system/tokens'
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export {
  // Grayscale
  gray,
  grayEnhanced,
  grayDark,
  // Primary colors
  blue,
  purple,
  violet,
  // Semantic colors
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
  // Semantic token collections
  semantic,
  semanticDark,
  // Special purpose colors
  randomBackgrounds,
  highlights,
  focus,
  toast,
  gamepad,
  gradients,
  confetti,
  // Types
  type GrayScale,
  type SemanticColors,
  type HighlightColors,
  type RandomBackgrounds,
  type Gradients,
} from './colors';

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export {
  // Font families
  fontFamily,
  // Font sizes
  fontSize,
  fontSizePx,
  fontSizeGamepad,
  // Font weights
  fontWeight,
  fontWeightPixelify,
  // Line heights
  lineHeight,
  // Letter spacing
  letterSpacing,
  // Text rendering
  textRendering,
  fontFeatureSettings,
  // Presets
  presets as typographyPresets,
  // Types
  type FontFamily,
  type FontSize,
  type FontWeight,
  type LineHeight,
  type LetterSpacing,
  type TypographyPreset,
} from './typography';

// ============================================================================
// SPACING TOKENS
// ============================================================================

export {
  // Base scale
  spacing,
  spacingPx,
  // Named spacing
  namedSpacing,
  // Component-specific
  componentSpacing,
  // Gap patterns
  gap,
  // Vertical spacing
  verticalSpacing,
  // Margins
  margin,
  // Types
  type Spacing,
  type NamedSpacing,
  type ComponentSpacing,
  type Gap,
} from './spacing';

// ============================================================================
// BORDER TOKENS
// ============================================================================

export {
  // Radii
  borderRadius,
  borderRadiusGamepad,
  // Widths
  borderWidth,
  // Colors
  borderColor,
  // Styles
  borderStyle,
  // Presets
  borderPresets,
  // Outline/focus
  outline,
  // Types
  type BorderRadius,
  type BorderWidth,
  type BorderColor,
  type BorderPresets,
} from './borders';

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export {
  // Box shadows
  boxShadow,
  buttonShadow,
  coloredShadow,
  gamepadShadow,
  animationShadow,
  inputShadow,
  // Text shadows
  textShadow,
  // Highlight shadows
  highlightShadow,
  // Magnetic glow
  magneticGlow,
  // Types
  type BoxShadow,
  type ButtonShadow,
  type ColoredShadow,
  type GamepadShadow,
  type TextShadow,
} from './shadows';

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export {
  // Durations
  duration,
  durationGsap,
  // Easings
  easing,
  easingGsap,
  // Keyframe names
  keyframes,
  // CSS transitions
  transition,
  // GSAP presets
  gsapPresets,
  // Stagger
  staggerDelays,
  cssStaggerDelays,
  // Confetti
  confettiConfig,
  // Micro-interactions
  microInteractions,
  // Types
  type Duration,
  type DurationGsap,
  type Easing,
  type EasingGsap,
  type Keyframes,
  type Transition,
  type GsapPresets,
} from './animations';

// ============================================================================
// GROUPED EXPORTS (for convenient category imports)
// ============================================================================

import * as colorsModule from './colors';
import * as typographyModule from './typography';
import * as spacingModule from './spacing';
import * as bordersModule from './borders';
import * as shadowsModule from './shadows';
import * as animationsModule from './animations';

export const colors = colorsModule;
export const typography = typographyModule;
export const spacingTokens = spacingModule;
export const borders = bordersModule;
export const shadows = shadowsModule;
export const animations = animationsModule;
