/**
 * Live Edit Hook
 *
 * Manages LIVE EDIT mode for real-time Excel syncing:
 * - Toggle live edit mode on/off
 * - Sync status tracking (idle, syncing, synced, error)
 * - Single-line sync on navigation
 * - Batch sync of all dirty (unsaved) changes when toggling on
 * - Dirty change detection
 *
 * Extracted from useTranslationState for separation of concerns.
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { BLANK_PLACEHOLDER } from '@/constants';

// ============================================================================
// TYPES
// ============================================================================

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface UseLiveEditProps {
  translations: string[];
  originalTranslations: string[];
  setOriginalTranslations: (translations: string[]) => void;
  loadedFileName: string;
  loadedFileType: 'excel' | 'json' | 'csv' | 'manual' | '';
  selectedSheet: string;
  startRow: number;
  translationColumn: string;
  currentIndex: number;
  currentTranslation: string;
  hasCurrentEntryChanged: () => boolean;
}

export interface LiveEditState {
  // Mode
  liveEditMode: boolean;
  setLiveEditMode: (mode: boolean) => void;
  toggleLiveEditMode: () => void;

  // Sync status
  syncStatus: SyncStatus;
  lastSyncTime: Date | null;

  // Single-line sync (called on navigate)
  syncCurrentTranslation: () => Promise<void>;

  // Batch sync
  showSyncModal: boolean;
  syncModalDirtyCount: number;
  isBatchSyncing: boolean;
  batchSyncProgress: number;
  batchSyncTotal: number;
  startBatchSync: () => void;
  skipBatchSync: () => void;
  closeSyncModal: () => void;

  // Dirty tracking
  getDirtyIndices: () => number[];
  dirtyCount: number;
}

// ============================================================================
// HELPERS
// ============================================================================

function isBlank(value: string): boolean {
  return !value || value === BLANK_PLACEHOLDER;
}

// ============================================================================
// HOOK
// ============================================================================

export const useLiveEdit = ({
  translations,
  originalTranslations,
  setOriginalTranslations,
  loadedFileName,
  loadedFileType,
  selectedSheet,
  startRow,
  translationColumn,
  currentIndex,
  currentTranslation,
  hasCurrentEntryChanged,
}: UseLiveEditProps): LiveEditState => {
  // ========== State ==========
  const [liveEditMode, setLiveEditMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Batch sync modal state
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncModalDirtyCount, setSyncModalDirtyCount] = useState(0);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [batchSyncProgress, setBatchSyncProgress] = useState(0);
  const [batchSyncTotal, setBatchSyncTotal] = useState(0);
  const abortRef = useRef(false);

  // ========== Dirty Tracking ==========

  const getDirtyIndices = useCallback((): number[] => {
    const dirty: number[] = [];
    for (let i = 0; i < translations.length; i++) {
      const current = translations[i] || '';
      const original = originalTranslations[i] || BLANK_PLACEHOLDER;

      // Normalize for comparison
      const currentNorm = current === BLANK_PLACEHOLDER ? '' : current.trim();
      const originalNorm = original === BLANK_PLACEHOLDER ? '' : original.trim();

      // Skip if both are effectively blank
      if (!currentNorm && !originalNorm) continue;

      // Mark as dirty if different
      if (currentNorm !== originalNorm) {
        dirty.push(i);
      }
    }
    return dirty;
  }, [translations, originalTranslations]);

  const dirtyCount = useMemo(() => {
    return getDirtyIndices().length;
  }, [getDirtyIndices]);

  // ========== Single-Line Sync ==========

  const syncCurrentTranslation = useCallback(async () => {
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

    if (!hasCurrentEntryChanged()) {
      return;
    }

    setSyncStatus('syncing');

    try {
      const cellRef = `${translationColumn}${startRow + currentIndex}`;
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
        const newOriginals = [...originalTranslations];
        newOriginals[currentIndex] = currentTranslation.trim() || BLANK_PLACEHOLDER;
        setOriginalTranslations(newOriginals);

        setSyncStatus('synced');
        setLastSyncTime(new Date());
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
    originalTranslations,
    setOriginalTranslations,
    translationColumn,
  ]);

  // ========== Batch Sync ==========

  const startBatchSync = useCallback(async () => {
    const dirtyIndices = getDirtyIndices();
    if (dirtyIndices.length === 0) {
      setShowSyncModal(false);
      return;
    }

    abortRef.current = false;
    setIsBatchSyncing(true);
    setBatchSyncProgress(0);
    setBatchSyncTotal(dirtyIndices.length);

    let successCount = 0;
    let failCount = 0;
    const newOriginals = [...originalTranslations];

    for (let i = 0; i < dirtyIndices.length; i++) {
      if (abortRef.current) break;

      const idx = dirtyIndices[i];
      const value = translations[idx] === BLANK_PLACEHOLDER ? '' : (translations[idx] || '').trim();
      const cellRef = `${translationColumn}${startRow + idx}`;

      try {
        const response = await fetch('/api/xlsx-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceFileName: loadedFileName,
            sheetName: selectedSheet,
            cellRef,
            value,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          newOriginals[idx] = value || BLANK_PLACEHOLDER;
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }

      setBatchSyncProgress(i + 1);

      // Small delay between writes
      if (!abortRef.current && i < dirtyIndices.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Update originals for all successfully synced entries
    setOriginalTranslations(newOriginals);

    setIsBatchSyncing(false);
    setLastSyncTime(new Date());

    if (failCount > 0) {
      toast.error(`Batch sync: ${failCount} failed, ${successCount} synced`);
      setSyncStatus('error');
    } else {
      setSyncStatus('synced');
    }

    // Auto-close modal after a brief moment
    setTimeout(() => {
      setShowSyncModal(false);
    }, 600);
  }, [
    getDirtyIndices,
    translations,
    originalTranslations,
    setOriginalTranslations,
    loadedFileName,
    selectedSheet,
    startRow,
    translationColumn,
  ]);

  const skipBatchSync = useCallback(() => {
    setShowSyncModal(false);
    // LIVE EDIT stays on — changes will sync per-line on navigation
  }, []);

  const closeSyncModal = useCallback(() => {
    if (!isBatchSyncing) {
      setShowSyncModal(false);
    }
  }, [isBatchSyncing]);

  // ========== Toggle ==========

  const toggleLiveEditMode = useCallback(() => {
    if (liveEditMode) {
      // Turning OFF
      setLiveEditMode(false);
      setSyncStatus('idle');
    } else {
      // Turning ON — check for dirty changes
      setLiveEditMode(true);
      setSyncStatus('idle');

      const dirty = getDirtyIndices();
      if (dirty.length > 0) {
        setSyncModalDirtyCount(dirty.length);
        setShowSyncModal(true);
      }
    }
  }, [liveEditMode, getDirtyIndices]);

  // ========== Return ==========
  return {
    liveEditMode,
    setLiveEditMode,
    toggleLiveEditMode,
    syncStatus,
    lastSyncTime,
    syncCurrentTranslation,
    showSyncModal,
    syncModalDirtyCount,
    isBatchSyncing,
    batchSyncProgress,
    batchSyncTotal,
    startBatchSync,
    skipBatchSync,
    closeSyncModal,
    getDirtyIndices,
    dirtyCount,
  };
};
