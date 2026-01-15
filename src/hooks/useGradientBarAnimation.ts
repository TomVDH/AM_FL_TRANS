import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export const useGradientBarAnimation = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const lastAnimatedIndex = useRef<number>(-1);

  useEffect(() => {
    if (!progressBarRef.current) return;

    const progressBar = progressBarRef.current;

    // Hover animations for the container
    const handleMouseEnter = () => {
      gsap.to(progressBar, {
        duration: 0.3,
        scale: 1.02,
        ease: 'power2.out',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(progressBar, {
        duration: 0.3,
        scale: 1,
        ease: 'power2.out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      });
    };

    progressBar.addEventListener('mouseenter', handleMouseEnter);
    progressBar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      progressBar.removeEventListener('mouseenter', handleMouseEnter);
      progressBar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Function to animate progress segment expansion (for segmented progress bar)
  const animateProgress = useCallback((newProgress: number) => {
    if (!progressBarRef.current) return;

    // Calculate current index from progress
    const totalSegments = progressBarRef.current.querySelectorAll('[data-segment]').length || 1;
    const currentIndex = Math.floor((newProgress / 100) * totalSegments);

    // Only animate if we've moved forward
    if (currentIndex > lastAnimatedIndex.current) {
      const segments = progressBarRef.current.querySelectorAll('[data-segment]');

      // Animate the newly completed segment
      for (let i = lastAnimatedIndex.current + 1; i <= currentIndex && i < segments.length; i++) {
        const segment = segments[i];
        if (segment) {
          // Scale in animation for newly completed segment
          gsap.fromTo(segment,
            {
              scaleX: 0,
              transformOrigin: 'left center',
              opacity: 0.5
            },
            {
              duration: 0.5,
              scaleX: 1,
              opacity: 1,
              ease: 'back.out(1.5)',
              delay: (i - lastAnimatedIndex.current - 1) * 0.1
            }
          );

          // Add a subtle pulse effect
          gsap.to(segment, {
            duration: 0.3,
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.8)',
            delay: 0.5 + (i - lastAnimatedIndex.current - 1) * 0.1,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          });
        }
      }

      lastAnimatedIndex.current = currentIndex;
    }

    // Subtle pulse on the whole progress bar
    gsap.to(progressBarRef.current, {
      duration: 0.2,
      scale: 1.01,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  }, []);

  return {
    progressBarRef,
    progressFillRef,
    animateProgress
  };
};
