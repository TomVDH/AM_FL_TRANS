// src/hooks/useTranslationTimer.ts
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface UseTranslationTimerProps {
  totalLines: number;
  completedLines: number;
  isStarted: boolean;
  selectedSheet: string;
}

interface TranslationTimerState {
  /** Elapsed seconds since first translation activity */
  elapsedSeconds: number;
  /** Estimated seconds remaining (null if insufficient data) */
  estimatedRemainingSeconds: number | null;
  /** Whether the timer is actively running */
  isRunning: boolean;
  /** Lines per minute rate (rolling average) */
  linesPerMinute: number | null;
  /** Formatted elapsed time (HH:MM:SS or MM:SS) */
  elapsedFormatted: string;
  /** Formatted estimated remaining (HH:MM:SS or MM:SS, or '--:--') */
  remainingFormatted: string;
  /** Manually pause/resume */
  togglePause: () => void;
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function useTranslationTimer({
  totalLines,
  completedLines,
  isStarted,
  selectedSheet,
}: UseTranslationTimerProps): TranslationTimerState {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Track when translation activity started and completion timestamps
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevCompletedRef = useRef(completedLines);
  // Rolling window: timestamps when lines were completed
  const completionTimestamps = useRef<number[]>([]);

  // Reset on sheet change
  useEffect(() => {
    setElapsedSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    prevCompletedRef.current = completedLines;
    completionTimestamps.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [selectedSheet]);

  // Detect translation activity (completedLines increasing) to start/track timer
  useEffect(() => {
    if (!isStarted) return;

    const delta = completedLines - prevCompletedRef.current;
    if (delta > 0) {
      const now = Date.now();

      // Record each completion
      for (let i = 0; i < delta; i++) {
        completionTimestamps.current.push(now);
      }

      // Start timer on first activity
      if (!startTimeRef.current) {
        startTimeRef.current = now;
        setIsRunning(true);
      }
    }
    prevCompletedRef.current = completedLines;
  }, [completedLines, isStarted]);

  // Tick the clock
  useEffect(() => {
    if (isRunning && !isPaused && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current!) / 1000));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused]);

  // Calculate lines per minute from rolling window (last 10 minutes of activity)
  const linesPerMinute = useMemo(() => {
    const stamps = completionTimestamps.current;
    if (stamps.length < 2) return null;

    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minute window
    const recentStamps = stamps.filter(t => now - t < windowMs);

    if (recentStamps.length < 2) {
      // Fall back to overall rate
      if (elapsedSeconds < 30) return null; // Need at least 30s of data
      const linesInSession = stamps.length;
      return (linesInSession / elapsedSeconds) * 60;
    }

    const windowDurationMs = now - recentStamps[0];
    if (windowDurationMs < 10000) return null; // Need at least 10s

    return (recentStamps.length / windowDurationMs) * 60000;
  }, [elapsedSeconds]); // Recalculate every tick

  // Estimated remaining
  const estimatedRemainingSeconds = useMemo(() => {
    if (!linesPerMinute || linesPerMinute <= 0) return null;
    const remainingLines = totalLines - completedLines;
    if (remainingLines <= 0) return 0;
    return Math.round((remainingLines / linesPerMinute) * 60);
  }, [linesPerMinute, totalLines, completedLines]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return {
    elapsedSeconds,
    estimatedRemainingSeconds,
    isRunning,
    linesPerMinute,
    elapsedFormatted: formatTime(elapsedSeconds),
    remainingFormatted: estimatedRemainingSeconds !== null
      ? formatTime(estimatedRemainingSeconds)
      : '--:--',
    togglePause,
  };
}
