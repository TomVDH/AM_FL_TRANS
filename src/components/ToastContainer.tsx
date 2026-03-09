'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast as toastEmitter, type ToastEvent } from '@/lib/toast';

const MAX_VISIBLE = 4;

// ---------------------------------------------------------------------------
// Single Toast
// ---------------------------------------------------------------------------

interface ToastItemProps {
  item: ToastEvent;
  onDismiss: (id: string) => void;
}

const ACCENT: Record<ToastEvent['type'], string> = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
  warning: 'border-l-amber-500',
};

const PROGRESS_BG: Record<ToastEvent['type'], string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
};

const ICON: Record<ToastEvent['type'], React.ReactNode> = {
  success: (
    <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

function ToastItem({ item, onDismiss }: ToastItemProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(item.duration);
  const startRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const progressRef = useRef<HTMLDivElement>(null);

  const autoDismiss = item.duration > 0;

  // Entrance animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('visible'));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-dismiss timer
  useEffect(() => {
    if (!autoDismiss) return;

    if (paused) {
      // Freeze remaining time
      remainingRef.current -= Date.now() - startRef.current;
      if (progressRef.current) {
        const pct = Math.max(0, remainingRef.current / item.duration) * 100;
        progressRef.current.style.transition = 'none';
        progressRef.current.style.width = `${pct}%`;
      }
      return;
    }

    // Start / resume countdown
    startRef.current = Date.now();
    const ms = Math.max(remainingRef.current, 0);

    // Animate progress bar from current to 0
    if (progressRef.current) {
      const pct = Math.max(0, ms / item.duration) * 100;
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = `${pct}%`;
      // Force reflow so the transition starts from the correct width
      progressRef.current.offsetWidth; // eslint-disable-line @typescript-eslint/no-unused-expressions
      progressRef.current.style.transition = `width ${ms}ms linear`;
      progressRef.current.style.width = '0%';
    }

    timerRef.current = setTimeout(() => {
      setPhase('exit');
      setTimeout(() => onDismiss(item.id), 300);
    }, ms);

    return () => clearTimeout(timerRef.current);
  }, [paused, autoDismiss, item.duration, item.id, onDismiss]);

  const handleDismiss = useCallback(() => {
    clearTimeout(timerRef.current);
    setPhase('exit');
    setTimeout(() => onDismiss(item.id), 300);
  }, [item.id, onDismiss]);

  return (
    <div
      className={`
        relative w-80 max-w-[calc(100vw-2rem)] overflow-hidden
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        border-l-[3px] ${ACCENT[item.type]}
        shadow-lg dark:shadow-gray-950/40
        transition-all duration-300 ease-out
        ${phase === 'enter' ? 'opacity-0 translate-y-4 scale-95' : ''}
        ${phase === 'visible' ? 'opacity-100 translate-y-0 scale-100' : ''}
        ${phase === 'exit' ? 'opacity-0 translate-y-2 scale-95' : ''}
      `}
      style={{ borderRadius: '3px' }}
      onMouseEnter={() => autoDismiss && setPaused(true)}
      onMouseLeave={() => autoDismiss && setPaused(false)}
      role="alert"
    >
      <div className="flex items-start gap-2.5 px-3 py-2.5">
        {ICON[item.type]}
        <p className="flex-1 text-xs text-gray-800 dark:text-gray-200 leading-relaxed break-words">
          {item.message}
        </p>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-0.5 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar countdown */}
      {autoDismiss && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-100 dark:bg-gray-700">
          <div
            ref={progressRef}
            className={`h-full ${PROGRESS_BG[item.type]} opacity-60`}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------

export default function ToastContainer() {
  const [items, setItems] = useState<ToastEvent[]>([]);

  useEffect(() => {
    return toastEmitter.subscribe((event) => {
      setItems((prev) => [...prev, event]);
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Only show the most recent MAX_VISIBLE toasts
  const visible = items.slice(-MAX_VISIBLE);

  if (visible.length === 0) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ bottom: '68px' }}
    >
      {visible.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <ToastItem item={item} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
