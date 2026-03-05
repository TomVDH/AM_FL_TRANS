/**
 * Live Edit Hook
 *
 * Manages LIVE EDIT mode functionality for real-time Excel syncing:
 * - Toggle live edit mode on/off
 * - Sync status tracking (idle, syncing, synced, error)
 * - Automatic sync to Excel file on navigation
 *
 * Extracted from useTranslationState for better separation of concerns.
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { BLANK_PLACEHOLDER } from '@/constants';

// ============================================================================
// TYPES
// ============================================================================

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface UseLiveEditProps {
  loadedFileName: string;
  loadedFileType: 'excel' | 'json' | 'csv' | 'manual' | '';
  selectedSheet: string;
  startRow: number;
  currentIndex: number;
  currentTranslation: string;
  sourceText: string;
  originalTranslations: string[];
  setOriginalTranslations: (translations: string[]) => void;
  hasCurrentEntryChanged: () => boolean;
  /** Optional callback called after successful sync - use for translation memory */
  onSyncSuccess?: (source: string, translation: string, file: string, sheet: string, row: number) => void;
}

export interface LiveEditState {
  liveEditMode: boolean;
  syncStatus: SyncStatus;
  lastSyncTime: Date | null;
  setLiveEditMode: (mode: boolean) => void;
  toggleLiveEditMode: () => void;
  syncCurrentTranslation: () => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useLiveEdit
 *
 * Manages live edit mode for real-time Excel file synchronization.
 * When enabled, translations are automatically saved to the Excel file
 * when navigating between entries.
 *
 * @param props - Dependencies from parent hook
 * @returns Live edit state and functions
 */
export const useLiveEdit = ({
  loadedFileName,
  loadedFileType,
  selectedSheet,
  startRow,
  currentIndex,
  currentTranslation,
  sourceText,
  originalTranslations,
  setOriginalTranslations,
  hasCurrentEntryChanged,
  onSyncSuccess,
}: UseLiveEditProps): LiveEditState => {
  // ========== State ==========
  const [liveEditMode, setLiveEditMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // ========== Functions ==========

  /**
   * Toggle LIVE EDIT mode on/off
   */
  const toggleLiveEditMode = useCallback(() => {
    setLiveEditMode(prev => {
      if (!prev) {
        // Entering LIVE EDIT mode
        setSyncStatus('idle');
        toast.info('LIVE EDIT mode enabled - changes will sync to Excel');
      } else {
        // Exiting LIVE EDIT mode
        toast.info('LIVE EDIT mode disabled');
      }
      return !prev;
    });
  }, []);

  /**
   * Sync current translation to Excel file
   * Called when navigating (Previous/Submit) in LIVE EDIT mode
   */
  const syncCurrentTranslation = useCallback(async () => {
    // Only sync if in LIVE EDIT mode and we have a file loaded
    if (!liveEditMode) return;

    if (!loadedFileName) {
      toast.error('No file loaded for LIVE EDIT');
      return;
    }

    if (loadedFileType !== 'excel') {
      toast.error('LIVE EDIT only works with Excel files');
      return;
    }

    if (!selectedSheet) {
      toast.error('No sheet selected');
      return;
    }

    // Check if current entry has changed
    if (!hasCurrentEntryChanged()) {
      // No changes to sync
      return;
    }

    setSyncStatus('syncing');

    try {
      const cellRef = `J${startRow + currentIndex}`;
      const response = await fetch('/api/xlsx-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceFileName: loadedFileName,
          sheetName: selectedSheet,
          cellRef,
          value: currentTranslation.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update originalTranslations to reflect the saved state
        const newOriginals = [...originalTranslations];
        newOriginals[currentIndex] = currentTranslation.trim() || BLANK_PLACEHOLDER;
        setOriginalTranslations(newOriginals);

        setSyncStatus('synced');
        setLastSyncTime(new Date());
        toast.success(`Saved ${cellRef} to ${loadedFileName}`);

        // Call sync success callback (for translation memory)
        if (onSyncSuccess && sourceText && currentTranslation.trim()) {
          onSyncSuccess(
            sourceText,
            currentTranslation.trim(),
            loadedFileName,
            selectedSheet,
            startRow + currentIndex
          );
        }
      } else {
        setSyncStatus('error');
        toast.error(`Sync failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setSyncStatus('error');
      toast.error('Sync failed: Network error');
      console.error('LIVE EDIT sync error:', error);
    }
  }, [
    liveEditMode,
    loadedFileName,
    loadedFileType,
    selectedSheet,
    hasCurrentEntryChanged,
    startRow,
    currentIndex,
    currentTranslation,
    sourceText,
    originalTranslations,
    setOriginalTranslations,
    onSyncSuccess,
  ]);

  // ========== Return ==========
  return {
    liveEditMode,
    syncStatus,
    lastSyncTime,
    setLiveEditMode,
    toggleLiveEditMode,
    syncCurrentTranslation,
  };
};
