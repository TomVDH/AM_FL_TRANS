import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useInterfaceAnimations = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const dialogueBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate main card on mount
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { 
          opacity: 0, 
          y: 30,
          scale: 0.95
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        }
      );
    }

    // Animate buttons with stagger
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.querySelectorAll('button');
      gsap.fromTo(buttons,
        { 
          opacity: 0, 
          y: 20,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          delay: 0.3
        }
      );
    }

    // Animate dialogue box
    if (dialogueBoxRef.current) {
      gsap.fromTo(dialogueBoxRef.current,
        { 
          opacity: 0, 
          scale: 0.98,
          rotationY: -5
        },
        { 
          opacity: 1, 
          scale: 1,
          rotationY: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.2
        }
      );
    }
  }, []);

  // Function to animate card transitions
  const animateCardTransition = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        duration: 0.3,
        opacity: 0,
        y: -10,
        scale: 0.98,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(cardRef.current, {
            duration: 0.4,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power2.out'
          });
        }
      });
    }
  };

  // Function to animate button hover
  const animateButtonHover = (button: HTMLElement, isEntering: boolean) => {
    if (isEntering) {
      gsap.to(button, {
        duration: 0.2,
        scale: 1.05,
        ease: 'power2.out'
      });
    } else {
      gsap.to(button, {
        duration: 0.2,
        scale: 1,
        ease: 'power2.out'
      });
    }
  };

  return {
    cardRef,
    buttonsRef,
    dialogueBoxRef,
    animateCardTransition,
    animateButtonHover
  };
}; 