import { useState, useEffect, useCallback } from 'react';

interface CodexLanguageInfo {
  availableLanguages: string[];
  totalEntries: number;
  isLoading: boolean;
  error: string | null;
  hasLanguage: (langCode: string) => boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook to check which languages have codex/reference data available
 */
export function useCodexLanguages(): CodexLanguageInfo {
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/codex');
      if (!response.ok) {
        throw new Error('Failed to fetch codex data');
      }

      const data = await response.json();
      setAvailableLanguages(data.availableLanguages || []);
      setTotalEntries(data.totalEntries || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAvailableLanguages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hasLanguage = useCallback((langCode: string) => {
    // Normalize: "NL" -> "dutch", "PT" -> "portuguese", etc.
    const langMap: Record<string, string> = {
      'nl': 'dutch',
      'pt': 'portuguese',
      'es': 'spanish',
      'fr': 'french',
      'de': 'german',
      'it': 'italian',
    };

    const normalizedCode = langMap[langCode.toLowerCase()] || langCode.toLowerCase();
    return availableLanguages.includes(normalizedCode);
  }, [availableLanguages]);

  return {
    availableLanguages,
    totalEntries,
    isLoading,
    error,
    hasLanguage,
    refresh
  };
}
