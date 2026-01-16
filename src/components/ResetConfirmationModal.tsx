'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * ResetConfirmationModal - Triple confirmation modal for nuclear reset
 *
 * Requires user to confirm 3 times before resetting all Excel files
 * from the /excels/Originals/ folder.
 */
const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [confirmationStep, setConfirmationStep] = useState(1);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle entrance animation
  useEffect(() => {
    if (isOpen && !shouldRender) {
      setShouldRender(true);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (shouldRender && isOpen && backdropRef.current && contentRef.current) {
      setIsAnimating(true);
      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false)
      });

      tl.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      ).fromTo(contentRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' },
        '-=0.15'
      );
    }
  }, [shouldRender, isOpen]);

  // Handle close with exit animation
  const handleAnimatedClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setShouldRender(false);
        setConfirmationStep(1);
        onClose();
      }
    });

    tl.to(contentRef.current,
      { scale: 0.9, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in' }
    ).to(backdropRef.current,
      { opacity: 0, duration: 0.2, ease: 'power2.in' },
      '-=0.1'
    );
  };

  if (!shouldRender) return null;

  const handleConfirm = () => {
    if (confirmationStep < 3) {
      // Animate step transition
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          scale: 0.98,
          duration: 0.1,
          ease: 'power2.in',
          onComplete: () => {
            setConfirmationStep(confirmationStep + 1);
            gsap.to(contentRef.current, {
              scale: 1,
              duration: 0.2,
              ease: 'back.out(2)'
            });
          }
        });
      } else {
        setConfirmationStep(confirmationStep + 1);
      }
    } else {
      // Final confirm - animate out then execute
      setIsAnimating(true);
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          setShouldRender(false);
          setConfirmationStep(1);
          onConfirm();
        }
      });

      tl.to(contentRef.current,
        { scale: 1.05, duration: 0.1, ease: 'power2.in' }
      ).to(contentRef.current,
        { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }
      ).to(backdropRef.current,
        { opacity: 0, duration: 0.2, ease: 'power2.in' },
        '-=0.15'
      );
    }
  };

  const handleCancel = () => {
    handleAnimatedClose();
  };

  const getStepContent = () => {
    switch (confirmationStep) {
      case 1:
        return {
          title: 'Reset to Original Files',
          message: 'This will restore all Excel files from the Originals folder.',
          detail: 'Your current translations will be overwritten.',
          buttonText: 'Continue',
          buttonColor: 'bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 border-gray-800 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-500'
        };
      case 2:
        return {
          title: 'Confirm Reset',
          message: 'This cannot be undone.',
          detail: 'Ensure you have backed up any work you wish to keep.',
          buttonText: 'Confirm',
          buttonColor: 'bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 border-amber-700 dark:border-amber-600 hover:border-amber-600 dark:hover:border-amber-500'
        };
      case 3:
        return {
          title: 'Final Confirmation',
          message: 'Proceeding will permanently replace your files.',
          detail: 'Click Reset to complete the operation.',
          buttonText: 'Reset',
          buttonColor: 'bg-gradient-to-br from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 border-red-700 dark:border-red-600 hover:border-red-600 dark:hover:border-red-500'
        };
      default:
        return {
          title: '',
          message: '',
          detail: '',
          buttonText: '',
          buttonColor: ''
        };
    }
  };

  const content = getStepContent();

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"
      onClick={(e) => e.target === backdropRef.current && handleCancel()}
    >
      <div
        ref={contentRef}
        className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl max-w-lg w-full mx-4"
        style={{ borderRadius: '3px' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {content.title}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
              Confirmation {confirmationStep} of 3
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`w-16 h-1.5 ${
                    step <= confirmationStep
                      ? 'bg-red-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{ borderRadius: '1px' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {content.message}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {content.detail}
          </p>

          {/* Warning List */}
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 p-4 mb-4" style={{ borderRadius: '3px' }}>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Actions
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 dark:text-gray-500 mt-0.5">1.</span>
                <span>Excel files in /excels/ will be replaced</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 dark:text-gray-500 mt-0.5">2.</span>
                <span>Original files will be restored from /excels/Originals/</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 dark:text-gray-500 mt-0.5">3.</span>
                <span>Current translations will be removed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 dark:text-gray-500 mt-0.5">4.</span>
                <span>Session will return to setup</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
            style={{ borderRadius: '3px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-bold text-white border hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase ${content.buttonColor}`}
            style={{ borderRadius: '3px' }}
          >
            {content.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmationModal;
