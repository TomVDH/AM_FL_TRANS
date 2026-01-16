'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCSV: () => void;
  onCopyToClipboard: () => void;
  onLoadAnotherSheet: () => void;
  onNextSheet?: () => void;
  nextSheetName?: string;
  stats: {
    totalEntries: number;
    modifiedCount: number;
    completedCount: number;
  };
  isLiveEditMode: boolean;
}

/**
 * CompletionModal - Celebration modal shown when all translations are complete
 *
 * Displays statistics, export options, and next steps when the user
 * finishes translating all entries in a sheet.
 */
const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  onExportCSV,
  onCopyToClipboard,
  onLoadAnotherSheet,
  onNextSheet,
  nextSheetName,
  stats,
  isLiveEditMode
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Focus trap for accessibility
  useFocusTrap(isOpen && shouldRender, contentRef);

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

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isAnimating) {
        handleAnimatedClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isAnimating]);

  if (!shouldRender) return null;

  const completionPercentage = stats.totalEntries > 0
    ? Math.round((stats.completedCount / stats.totalEntries) * 100)
    : 0;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"
      onClick={(e) => e.target === backdropRef.current && handleAnimatedClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-modal-title"
    >
      <div
        ref={contentRef}
        className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl max-w-lg w-full mx-4"
        style={{ borderRadius: '3px' }}
        tabIndex={-1}
      >
        {/* Header - Celebratory */}
        <div className="px-6 py-5 border-b-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
          <h2
            id="completion-modal-title"
            className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 bg-green-500 text-white" style={{ borderRadius: '3px' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Sheet Complete!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            All entries have been translated. Great work!
          </p>
        </div>

        {/* Statistics */}
        <div className="px-6 py-5">
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 p-4 mb-5" style={{ borderRadius: '3px' }}>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Translation Summary
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {stats.totalEntries}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Entries
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-green-600 dark:text-green-400">
                  {stats.completedCount}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Translated
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {stats.modifiedCount}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Modified
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                <span>Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-300 dark:bg-gray-700" style={{ borderRadius: '2px' }}>
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${completionPercentage}%`, borderRadius: '2px' }}
                />
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Export Options
            </p>
            <div className="flex flex-col gap-2">
              {isLiveEditMode ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300" style={{ borderRadius: '3px' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-bold text-sm">Already saved to Excel</span>
                  <span className="text-xs opacity-75">(LIVE EDIT mode)</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onExportCSV();
                      handleAnimatedClose();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-900 via-black to-gray-900 dark:from-gray-100 dark:via-white dark:to-gray-100 text-white dark:text-black border border-gray-800 dark:border-gray-200 hover:border-gray-700 dark:hover:border-gray-300 hover:shadow-lg font-bold text-sm uppercase tracking-wide transition-all duration-300"
                    style={{ borderRadius: '3px' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export to CSV
                  </button>
                  <button
                    onClick={() => {
                      onCopyToClipboard();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md font-bold text-sm uppercase tracking-wide transition-all duration-300"
                    style={{ borderRadius: '3px' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy to Clipboard
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Next Steps
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  handleAnimatedClose();
                  setTimeout(onLoadAnotherSheet, 300);
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-500 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/25 font-bold text-sm uppercase tracking-wide transition-all duration-300"
                style={{ borderRadius: '3px' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Load Another Sheet
              </button>

              {nextSheetName && onNextSheet && (
                <button
                  onClick={() => {
                    handleAnimatedClose();
                    setTimeout(onNextSheet, 300);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-purple-600 to-purple-700 text-white border border-purple-500 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25 font-bold text-sm uppercase tracking-wide transition-all duration-300"
                  style={{ borderRadius: '3px' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Next Sheet: {nextSheetName}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 flex justify-end">
          <button
            onClick={handleAnimatedClose}
            className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
            style={{ borderRadius: '3px' }}
          >
            Stay Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
