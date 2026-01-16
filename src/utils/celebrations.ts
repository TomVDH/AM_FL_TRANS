import confetti from 'canvas-confetti';

/**
 * Celebration utilities for wow-mode
 * Only trigger when wow-mode is enabled
 */

/**
 * Fire a completion confetti celebration
 * Called when all entries are completed
 */
export const fireCompletionConfetti = () => {
  // Fire from both sides
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100000 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    // Fire from left
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    // Fire from right
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

/**
 * Fire a small celebration for progress milestones
 * Called at 25%, 50%, 75% completion
 */
export const fireMilestoneConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.7 },
    zIndex: 100000,
    colors: ['#22c55e', '#4ade80', '#86efac'], // Green theme
  });
};

/**
 * Fire a single burst for individual entry completion
 * Small and subtle
 */
export const fireEntryConfetti = () => {
  confetti({
    particleCount: 8,
    spread: 45,
    startVelocity: 20,
    origin: { x: 0.5, y: 0.6 },
    zIndex: 100000,
    colors: ['#22c55e', '#4ade80'],
    gravity: 1.2,
  });
};
