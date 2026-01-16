import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useFooterGradientAnimation = () => {
  const gradientBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gradientBarRef.current) return;

    const gradientBar = gradientBarRef.current;

    // Initial animation when component mounts
    gsap.set(gradientBar, { 
      scale: 0.8,
      opacity: 0.7
    });

    gsap.to(gradientBar, {
      duration: 1.2,
      scale: 1,
      opacity: 1,
      ease: 'back.out(1.7)'
    });

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(gradientBar, {
        duration: 0.4,
        scale: 1.1,
        ease: 'power2.out',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
      });

      // Animate gradient movement
      gsap.to(gradientBar, {
        duration: 0.6,
        backgroundPosition: '200% 200%',
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
      });
    };

    const handleMouseLeave = () => {
      gsap.to(gradientBar, {
        duration: 0.4,
        scale: 1,
        ease: 'power2.out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      });

      // Stop gradient animation
      gsap.killTweensOf(gradientBar, 'backgroundPosition');
      gsap.to(gradientBar, {
        duration: 0.3,
        backgroundPosition: '0% 0%',
        ease: 'power2.out'
      });
    };

    // Click animation
    const handleClick = () => {
      gsap.to(gradientBar, {
        duration: 0.2,
        scale: 0.95,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(gradientBar, {
            duration: 0.3,
            scale: 1.05,
            ease: 'back.out(1.7)',
            onComplete: () => {
              gsap.to(gradientBar, {
                duration: 0.2,
                scale: 1,
                ease: 'power2.out'
              });
            }
          });
        }
      });
    };

    gradientBar.addEventListener('mouseenter', handleMouseEnter);
    gradientBar.addEventListener('mouseleave', handleMouseLeave);
    gradientBar.addEventListener('click', handleClick);

    return () => {
      gradientBar.removeEventListener('mouseenter', handleMouseEnter);
      gradientBar.removeEventListener('mouseleave', handleMouseLeave);
      gradientBar.removeEventListener('click', handleClick);
    };
  }, []);

  return {
    gradientBarRef
  };
}; 