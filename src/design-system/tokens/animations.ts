/**
 * Design System - Animation Tokens
 *
 * Durations, easings, keyframe definitions, and animation presets.
 *
 * Usage:
 * - Import durations: import { duration } from '@/design-system/tokens/animations'
 * - Import easings: import { easing } from '@/design-system/tokens/animations'
 * - Import GSAP presets: import { gsapPresets } from '@/design-system/tokens/animations'
 */

// ============================================================================
// DURATIONS
// ============================================================================

/** CSS durations in milliseconds */
export const duration = {
  /** 100ms - Very fast */
  instant: 100,
  /** 150ms - Fast feedback */
  fast: 150,
  /** 200ms - Standard fast (PRIMARY) */
  normal: 200,
  /** 300ms - Standard (PRIMARY) */
  medium: 300,
  /** 400ms - Standard slow */
  slow: 400,
  /** 500ms - Slow */
  slower: 500,
} as const;

/** GSAP durations in seconds */
export const durationGsap = {
  /** 0.1s - Very fast (press) */
  instant: 0.1,
  /** 0.15s - Fast (quick feedback) */
  fast: 0.15,
  /** 0.2s - Standard fast */
  normal: 0.2,
  /** 0.25s - Modal backdrop */
  modalBackdrop: 0.25,
  /** 0.3s - Standard medium */
  medium: 0.3,
  /** 0.35s - Modal content */
  modalContent: 0.35,
  /** 0.4s - Standard slow */
  slow: 0.4,
  /** 0.5s - Slow */
  slower: 0.5,
  /** 0.6s - Button stagger */
  buttonStagger: 0.6,
  /** 0.7s - Dialogue box */
  dialogueBox: 0.7,
  /** 0.8s - Card entrance */
  cardEntrance: 0.8,
  /** 1.2s - Gradient bar entrance */
  gradientBar: 1.2,
} as const;

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

/** CSS cubic-bezier easings */
export const easing = {
  /** Spring effect - PRIMARY easing for the app */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Standard deceleration */
  easeOut: 'ease-out',
  /** Standard acceleration */
  easeIn: 'ease-in',
  /** Standard both directions */
  easeInOut: 'ease-in-out',
  /** Linear (no easing) */
  linear: 'linear',
} as const;

/** GSAP easing strings */
export const easingGsap = {
  /** Standard smooth out */
  powerOut: 'power2.out',
  /** Standard smooth in */
  powerIn: 'power2.in',
  /** Smooth both directions */
  powerInOut: 'power2.inOut',
  /** Spring overshoot (strong) */
  backOut: 'back.out(1.7)',
  /** Spring overshoot (very strong) */
  backOutStrong: 'back.out(2)',
  /** Elastic bounce */
  elasticOut: 'elastic.out(1, 0.5)',
} as const;

// ============================================================================
// KEYFRAME ANIMATION NAMES
// ============================================================================

export const keyframes = {
  /** Fade in with upward movement */
  fadeIn: 'fadeIn',
  /** Modal backdrop fade */
  modalBackdropIn: 'modalBackdropIn',
  /** Modal content scale + fade */
  modalContentIn: 'modalContentIn',
  /** Panel slide in from bottom */
  panelSlideIn: 'panelSlideIn',
  /** Staggered fade in for lists */
  staggerFadeIn: 'staggerFadeIn',
  /** Gradient position shift */
  gradientShift: 'gradientShift',
  /** Fast gradient with opacity */
  gradientShiftFast: 'gradientShiftFast',
  /** Text glow pulse */
  textGlow: 'textGlow',
  /** Progress pip glow */
  pipGlow: 'pipGlow',
  /** Shimmer effect */
  shimmer: 'shimmer',
  /** Typewriter pulse for continue indicator */
  pulseTypewriter: 'pulse-typewriter',
  /** Scrolling text for live mode */
  scrollText: 'scroll-text',
} as const;

// ============================================================================
// CSS TRANSITION PRESETS
// ============================================================================

export const transition = {
  /** All properties, fast */
  allFast: `all ${duration.normal}ms ${easing.easeOut}`,
  /** All properties, medium */
  allMedium: `all ${duration.medium}ms ${easing.easeOut}`,
  /** Colors only */
  colors: `color ${duration.medium}ms ${easing.easeOut}, background-color ${duration.medium}ms ${easing.easeOut}, border-color ${duration.medium}ms ${easing.easeOut}`,
  /** Transform + shadow for buttons */
  buttonSpring: `transform ${duration.medium}ms ${easing.spring}, box-shadow ${duration.medium}ms ${easing.spring}`,
  /** Magnetic button (slower spring) */
  buttonMagnetic: `transform ${duration.slow}ms ${easing.spring}, box-shadow ${duration.slow}ms ${easing.spring}`,
  /** Highlight transitions */
  highlight: `background-color ${duration.fast}ms ${easing.easeOut}, box-shadow ${duration.fast}ms ${easing.easeOut}`,
  /** Input focus glow */
  inputGlow: `box-shadow ${duration.medium}ms ${easing.spring}`,
} as const;

// ============================================================================
// GSAP ANIMATION PRESETS
// ============================================================================

export const gsapPresets = {
  /** Card entrance animation */
  cardEntrance: {
    from: { opacity: 0, y: 30, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' },
  },

  /** Button stagger entrance */
  buttonStagger: {
    from: { opacity: 0, y: 20, scale: 0.9 },
    to: {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      delay: 0.3,
    },
  },

  /** Dialogue box entrance */
  dialogueEntrance: {
    from: { opacity: 0, scale: 0.98, rotationY: -5 },
    to: { opacity: 1, scale: 1, rotationY: 0, duration: 0.7, ease: 'power2.out', delay: 0.2 },
  },

  /** Gradient bar entrance */
  gradientBarEntrance: {
    initial: { scale: 0.8, opacity: 0.7 },
    to: { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.7)' },
  },

  /** Standard hover scale */
  hoverScale: {
    scale: 1.05,
    duration: 0.2,
    ease: 'power2.out',
  },

  /** Gradient bar hover */
  gradientBarHover: {
    scale: 1.1,
    duration: 0.4,
    ease: 'power2.out',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
  },

  /** Click bounce effect */
  clickBounce: {
    down: { scale: 0.95, duration: 0.2, ease: 'power2.in' },
    up: { scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' },
    settle: { scale: 1, duration: 0.2, ease: 'power2.out' },
  },

  /** Progress segment scale-in */
  segmentScaleIn: {
    from: { scaleX: 0, transformOrigin: 'left center', opacity: 0.5 },
    to: { scaleX: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
  },

  /** Segment pulse effect */
  segmentPulse: {
    to: {
      boxShadow: '0 0 15px rgba(34, 197, 94, 0.8)',
      duration: 0.3,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    },
  },

  /** Modal entrance timeline */
  modalEntrance: {
    backdrop: {
      from: { opacity: 0 },
      to: { opacity: 1, duration: 0.25, ease: 'power2.out' },
    },
    content: {
      from: { scale: 0.9, opacity: 0, y: 20 },
      to: { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' },
      offset: '-=0.15',
    },
  },

  /** Modal step transition */
  modalStepTransition: {
    down: { scale: 0.98, duration: 0.1, ease: 'power2.in' },
    up: { scale: 1, duration: 0.2, ease: 'back.out(2)' },
  },

  /** Modal exit explosion */
  modalExit: {
    expand: { scale: 1.05, duration: 0.1, ease: 'power2.in' },
    collapse: { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' },
    backdropFade: { opacity: 0, duration: 0.2, ease: 'power2.in', offset: '-=0.15' },
  },

  /** Segment celebration (wow-mode) */
  segmentCelebration: {
    glow: {
      to: {
        boxShadow: '0 0 25px rgba(34, 197, 94, 0.9), 0 0 50px rgba(34, 197, 94, 0.5)',
        duration: 0.3,
        ease: 'power2.out',
      },
      settle: {
        boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)',
        duration: 0.5,
        ease: 'power2.inOut',
      },
    },
    scale: {
      up: { scale: 1.15, duration: 0.15, ease: 'back.out(2)' },
      down: { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' },
    },
  },
} as const;

// ============================================================================
// STAGGER DELAYS
// ============================================================================

export const staggerDelays = {
  /** Fast stagger (50ms) */
  fast: 0.05,
  /** Normal stagger (100ms) */
  normal: 0.1,
  /** Slow stagger (150ms) */
  slow: 0.15,
} as const;

/** Pre-computed stagger delays for CSS (1-10 items) */
export const cssStaggerDelays = [
  '0.05s',
  '0.1s',
  '0.15s',
  '0.2s',
  '0.25s',
  '0.3s',
  '0.35s',
  '0.4s',
  '0.45s',
  '0.5s',
] as const;

// ============================================================================
// CONFETTI CONFIGURATION
// ============================================================================

export const confettiConfig = {
  /** Completion confetti (dual burst) */
  completion: {
    duration: 3000,
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 100000,
    interval: 250,
  },

  /** Milestone confetti (25%, 50%, 75%) */
  milestone: {
    particleCount: 30,
    spread: 60,
    origin: { y: 0.7 },
    zIndex: 100000,
  },

  /** Entry confetti (small burst) */
  entry: {
    particleCount: 8,
    spread: 45,
    startVelocity: 20,
    origin: { x: 0.5, y: 0.6 },
    zIndex: 100000,
    gravity: 1.2,
  },
} as const;

// ============================================================================
// MICRO-INTERACTION SPECS
// ============================================================================

export const microInteractions = {
  /** Standard button hover */
  buttonHover: {
    scale: 1.02,
    translateY: '-2px',
  },

  /** Magnetic button hover (wow-mode) */
  buttonMagneticHover: {
    scale: 1.03,
    translateY: '-3px',
    glowOpacity: 1,
  },

  /** Standard button active */
  buttonActive: {
    scale: 0.98,
    translateY: '0',
    transitionDuration: '0.1s',
  },

  /** Magnetic button active */
  buttonMagneticActive: {
    scale: 0.97,
    transitionDuration: '0.15s',
  },

  /** Progress bar subtle pulse */
  progressPulse: {
    scale: 1.01,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Duration = typeof duration;
export type DurationGsap = typeof durationGsap;
export type Easing = typeof easing;
export type EasingGsap = typeof easingGsap;
export type Keyframes = typeof keyframes;
export type Transition = typeof transition;
export type GsapPresets = typeof gsapPresets;
