import { useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { BLANK_PLACEHOLDER, SESSION_EXPIRY_HOURS, SESSION_STORAGE_KEY } from '@/constants';

const SESSION_KEY = SESSION_STORAGE_KEY;

export interface SessionData {
  currentIndex: number;
  translations: string[];
  sourceTexts: string[];
  utterers: string[];
  loadedFileName: string;
  loadedFileType: 'excel' | 'json' | 'csv' | 'manual' | '';
  selectedSheet: string;
  isStarted: boolean;
  timestamp: number;
}

export interface UseSessionPersistenceProps {
  currentIndex: number;
  translations: string[];
  sourceTexts: string[];
  utterers: string[];
  loadedFileName: string;
  loadedFileType: 'excel' | 'json' | 'csv' | 'manual' | '';
  selectedSheet: string;
  isStarted: boolean;
  onRestore: (session: SessionData) => void;
}

/**
 * useSessionPersistence
 *
 * Handles saving and restoring translation session state to/from localStorage.
 * Shows a toast notification when a previous session is detected, allowing
 * the user to resume where they left off.
 */
export const useSessionPersistence = ({
  currentIndex,
  translations,
  sourceTexts,
  utterers,
  loadedFileName,
  loadedFileType,
  selectedSheet,
  isStarted,
  onRestore,
}: UseSessionPersistenceProps) => {
  const hasCheckedSession = useRef(false);
  const isRestoringSession = useRef(false);

  // Save session to localStorage
  const saveSession = useCallback(() => {
    // Don't save if we're in the middle of restoring
    if (isRestoringSession.current) return;

    // Only save if there's meaningful data to save
    if (!isStarted || sourceTexts.length === 0) {
      return;
    }

    const session: SessionData = {
      currentIndex,
      translations,
      sourceTexts,
      utterers,
      loadedFileName,
      loadedFileType,
      selectedSheet,
      isStarted,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, [currentIndex, translations, sourceTexts, utterers, loadedFileName, loadedFileType, selectedSheet, isStarted]);

  // Clear session from localStorage
  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    if (hasCheckedSession.current) return;
    hasCheckedSession.current = true;

    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (!savedSession) return;

      const session: SessionData = JSON.parse(savedSession);

      // Check if session is expired
      const hoursElapsed = (Date.now() - session.timestamp) / (1000 * 60 * 60);
      if (hoursElapsed > SESSION_EXPIRY_HOURS) {
        clearSession();
        return;
      }

      // Check if session has meaningful data
      if (!session.isStarted || session.sourceTexts.length === 0) {
        clearSession();
        return;
      }

      // Calculate progress
      const filledCount = session.translations.filter(
        t => t && t !== BLANK_PLACEHOLDER
      ).length;
      const progress = Math.round((filledCount / session.translations.length) * 100);
      const currentEntry = session.currentIndex + 1;
      const totalEntries = session.sourceTexts.length;

      // Show toast with resume option
      toast(
        `Resume previous session?`,
        {
          description: `${session.loadedFileName || 'Untitled'} - Entry ${currentEntry}/${totalEntries} (${progress}% complete)`,
          duration: 10000,
          action: {
            label: 'Resume',
            onClick: () => {
              isRestoringSession.current = true;
              onRestore(session);
              toast.success('Session restored!');
              // Reset flag after a short delay to allow state to settle
              setTimeout(() => {
                isRestoringSession.current = false;
              }, 1000);
            },
          },
          cancel: {
            label: 'Start Fresh',
            onClick: () => {
              clearSession();
              toast.info('Starting fresh session');
            },
          },
        }
      );
    } catch (error) {
      console.error('Failed to check for existing session:', error);
      clearSession();
    }
  }, [onRestore, clearSession]);

  // Auto-save session when state changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveSession();
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [saveSession]);

  return {
    saveSession,
    clearSession,
  };
};
