/**
 * Celebrations Utility
 *
 * Provides celebration effects for Wow mode.
 * These are triggered when milestones are reached and Wow mode is enabled.
 */

// ============================================================================
// TYPES
// ============================================================================

type CelebrationType = 'confetti' | 'sparkle' | 'rainbow';

// ============================================================================
// CONFETTI EFFECT
// ============================================================================

const createConfettiParticle = (): HTMLDivElement => {
  const particle = document.createElement('div');
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#ffd93d'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 10 + 5;

  particle.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    left: ${Math.random() * 100}vw;
    top: -20px;
    pointer-events: none;
    z-index: 9999;
    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    transform: rotate(${Math.random() * 360}deg);
  `;

  return particle;
};

const animateConfetti = (particle: HTMLDivElement): void => {
  const duration = Math.random() * 2000 + 2000;
  const rotations = Math.random() * 720 - 360;
  const horizontalDrift = Math.random() * 200 - 100;

  particle.animate(
    [
      { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(100vh) translateX(${horizontalDrift}px) rotate(${rotations}deg)`, opacity: 0 },
    ],
    {
      duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  ).onfinish = () => particle.remove();
};

const triggerConfetti = (): void => {
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const particle = createConfettiParticle();
      document.body.appendChild(particle);
      animateConfetti(particle);
    }, i * 30);
  }
};

// ============================================================================
// SPARKLE EFFECT
// ============================================================================

const createSparkle = (x: number, y: number): HTMLDivElement => {
  const sparkle = document.createElement('div');
  sparkle.innerHTML = '✨';
  sparkle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 24px;
    pointer-events: none;
    z-index: 9999;
    transform: scale(0);
  `;
  return sparkle;
};

const animateSparkle = (sparkle: HTMLDivElement): void => {
  sparkle.animate(
    [
      { transform: 'scale(0) rotate(0deg)', opacity: 1 },
      { transform: 'scale(1.5) rotate(180deg)', opacity: 1, offset: 0.5 },
      { transform: 'scale(0) rotate(360deg)', opacity: 0 },
    ],
    { duration: 800, easing: 'ease-out' }
  ).onfinish = () => sparkle.remove();
};

const triggerSparkle = (): void => {
  const count = 15;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const angle = (i / count) * Math.PI * 2;
      const distance = Math.random() * 150 + 50;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const sparkle = createSparkle(x, y);
      document.body.appendChild(sparkle);
      animateSparkle(sparkle);
    }, i * 50);
  }
};

// ============================================================================
// RAINBOW EFFECT
// ============================================================================

const triggerRainbow = (): void => {
  const rainbow = document.createElement('div');
  rainbow.style.cssText = `
    position: fixed;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 0, 0, 0.1),
      rgba(255, 127, 0, 0.1),
      rgba(255, 255, 0, 0.1),
      rgba(0, 255, 0, 0.1),
      rgba(0, 0, 255, 0.1),
      rgba(75, 0, 130, 0.1),
      rgba(148, 0, 211, 0.1)
    );
    pointer-events: none;
    z-index: 9998;
  `;
  document.body.appendChild(rainbow);

  rainbow.animate(
    [
      { opacity: 0 },
      { opacity: 1, offset: 0.3 },
      { opacity: 1, offset: 0.7 },
      { opacity: 0 },
    ],
    { duration: 1500, easing: 'ease-in-out' }
  ).onfinish = () => rainbow.remove();
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Trigger a celebration effect
 */
export const triggerCelebration = (type: CelebrationType = 'confetti'): void => {
  switch (type) {
    case 'confetti':
      triggerConfetti();
      break;
    case 'sparkle':
      triggerSparkle();
      break;
    case 'rainbow':
      triggerRainbow();
      break;
  }
};

/**
 * Trigger celebration for translation milestones
 */
export const celebrateMilestone = (count: number, isWowMode: boolean): void => {
  if (!isWowMode) return;

  // Celebrate at specific milestones
  if (count === 10) {
    triggerSparkle();
  } else if (count === 50) {
    triggerConfetti();
  } else if (count === 100) {
    triggerConfetti();
    setTimeout(() => triggerRainbow(), 500);
  } else if (count % 100 === 0) {
    triggerConfetti();
  } else if (count % 25 === 0) {
    triggerSparkle();
  }
};
