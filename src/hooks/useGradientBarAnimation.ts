import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useGradientBarAnimation = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressBarRef.current || !progressFillRef.current) return;

    const progressBar = progressBarRef.current;
    const progressFill = progressFillRef.current;

    // Initial animation when component mounts
    gsap.set(progressFill, { 
      scaleX: 0,
      transformOrigin: 'left center'
    });

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(progressBar, {
        duration: 0.3,
        scale: 1.02,
        ease: 'power2.out',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
      });

      gsap.to(progressFill, {
        duration: 0.4,
        scaleX: 1,
        ease: 'back.out(1.7)',
        onUpdate: function() {
          // Add shimmer effect
          gsap.to(progressFill, {
            duration: 0.2,
            backgroundPosition: '200% center',
            ease: 'none',
            repeat: -1
          });
        }
      });
    };

    const handleMouseLeave = () => {
      gsap.to(progressBar, {
        duration: 0.3,
        scale: 1,
        ease: 'power2.out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      });

      gsap.killTweensOf(progressFill, 'backgroundPosition');
    };

    progressBar.addEventListener('mouseenter', handleMouseEnter);
    progressBar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      progressBar.removeEventListener('mouseenter', handleMouseEnter);
      progressBar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Function to animate progress update
  const animateProgress = (newProgress: number) => {
    if (!progressFillRef.current) return;

    gsap.to(progressFillRef.current, {
      duration: 0.8,
      scaleX: newProgress / 100,
      ease: 'power2.out',
      onUpdate: function() {
        // Add pulse effect during progress update
        gsap.to(progressFillRef.current, {
          duration: 0.1,
          opacity: 0.8,
          yoyo: true,
          repeat: 1
        });
      }
    });
  };

  return {
    progressBarRef,
    progressFillRef,
    animateProgress
  };
}; 