'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Represents a translation memory entry
 */
export interface MemoryEntry {
  source: string;
  translation: string;
  file?: string;
  sheet?: string;
  row?: number;
  ts: string;
}

/**
 * Match result for Quick Reference integration
 */
export interface MemoryMatch {
  sourceEnglish: string;
  translatedText: string;
  file?: string;
  sheet?: string;
  row?: number;
  ts: string;
  isFromMemory: true;
}

interface UseTranslationMemoryReturn {
  /** All loaded memory entries */
  memoryEntries: MemoryEntry[];

  /** Whether memory has been loaded */
  isLoaded: boolean;

  /** Find matches for a given source text */
  findMemoryMatches: (sourceText: string) => MemoryMatch[];

  /** Save a new translation to memory */
  saveToMemory: (entry: Omit<MemoryEntry, 'ts'>) => Promise<void>;

  /** Reload memory from server */
  refreshMemory: () => Promise<void>;

  /** Total count of memory entries */
  totalEntries: number;
}

/**
 * Hook for managing persistent translation memory
 *
 * Loads translation memory on mount and provides:
 * - Fast lookup by source text for Quick Reference
 * - Save function for persisting new translations
 */
export function useTranslationMemory(): UseTranslationMemoryReturn {
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Build source text index for O(1) lookup
  const sourceIndex = useMemo(() => {
    const index = new Map<string, MemoryEntry[]>();

    for (const entry of memoryEntries) {
      if (!entry.source) continue;
      const key = entry.source.toLowerCase().trim();

      if (!index.has(key)) {
        index.set(key, []);
      }
      index.get(key)!.push(entry);
    }

    return index;
  }, [memoryEntries]);

  // Load memory from server
  const loadMemory = useCallback(async () => {
    try {
      const response = await fetch('/api/translation-memory');
      if (response.ok) {
        const data = await response.json();
        setMemoryEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to load translation memory:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadMemory();
  }, [loadMemory]);

  // Find matches for Quick Reference
  const findMemoryMatches = useCallback((sourceText: string): MemoryMatch[] => {
    if (!sourceText || !isLoaded) return [];

    const key = sourceText.toLowerCase().trim();
    const entries = sourceIndex.get(key) || [];

    // Deduplicate by translation text, keeping most recent
    const uniqueTranslations = new Map<string, MemoryEntry>();
    for (const entry of entries) {
      const transKey = entry.translation.toLowerCase();
      const existing = uniqueTranslations.get(transKey);

      // Keep the most recent entry for each unique translation
      if (!existing || new Date(entry.ts) > new Date(existing.ts)) {
        uniqueTranslations.set(transKey, entry);
      }
    }

    // Convert to MemoryMatch format
    return Array.from(uniqueTranslations.values()).map(entry => ({
      sourceEnglish: entry.source,
      translatedText: entry.translation,
      file: entry.file,
      sheet: entry.sheet,
      row: entry.row,
      ts: entry.ts,
      isFromMemory: true as const,
    }));
  }, [sourceIndex, isLoaded]);

  // Save new translation to memory
  const saveToMemory = useCallback(async (entry: Omit<MemoryEntry, 'ts'>) => {
    try {
      const response = await fetch('/api/translation-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        const data = await response.json();
        // Optimistically add to local state
        setMemoryEntries(prev => [data.entry, ...prev]);
      }
    } catch (error) {
      console.error('Failed to save to translation memory:', error);
    }
  }, []);

  return {
    memoryEntries,
    isLoaded,
    findMemoryMatches,
    saveToMemory,
    refreshMemory: loadMemory,
    totalEntries: memoryEntries.length,
  };
}

export default useTranslationMemory;
