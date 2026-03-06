import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAiSuggestionProps {
  sourceText: string;
  speaker: string;
  context: string;
  existingTranslation: string;
  currentIndex: number;
}

interface UseAiSuggestionReturn {
  aiSuggestEnabled: boolean;
  aiSuggestion: string | null;
  isLoadingAiSuggestion: boolean;
  aiSuggestError: string | null;
  toggleAiSuggest: () => void;
  fetchAiSuggestion: () => void;
  clearAiSuggestion: () => void;
}

export function useAiSuggestion({
  sourceText,
  speaker,
  context,
  existingTranslation,
  currentIndex,
}: UseAiSuggestionProps): UseAiSuggestionReturn {
  const [aiSuggestEnabled, setAiSuggestEnabled] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingAiSuggestion, setIsLoadingAiSuggestion] = useState(false);
  const [aiSuggestError, setAiSuggestError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchedIndexRef = useRef<number>(-1);

  const clearAiSuggestion = useCallback(() => {
    setAiSuggestion(null);
    setAiSuggestError(null);
    setIsLoadingAiSuggestion(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const fetchAiSuggestion = useCallback(async () => {
    if (!sourceText.trim()) return;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingAiSuggestion(true);
    setAiSuggestError(null);
    setAiSuggestion(null);
    lastFetchedIndexRef.current = currentIndex;

    try {
      const response = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          english: sourceText,
          speaker,
          context,
          existingTranslation: existingTranslation || undefined,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get suggestion');
      }

      const data = await response.json();
      // Only apply if we haven't navigated away
      if (lastFetchedIndexRef.current === currentIndex) {
        setAiSuggestion(data.suggestion);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (lastFetchedIndexRef.current === currentIndex) {
        setAiSuggestError(message);
      }
    } finally {
      if (lastFetchedIndexRef.current === currentIndex) {
        setIsLoadingAiSuggestion(false);
      }
    }
  }, [sourceText, speaker, context, existingTranslation, currentIndex]);

  const toggleAiSuggest = useCallback(() => {
    setAiSuggestEnabled(prev => {
      if (prev) {
        // Turning off — clear everything
        clearAiSuggestion();
      }
      return !prev;
    });
  }, [clearAiSuggestion]);

  // Auto-fetch when enabled and entry changes
  useEffect(() => {
    if (!aiSuggestEnabled) return;
    if (!sourceText.trim()) {
      clearAiSuggestion();
      return;
    }

    // Debounce 300ms
    const timer = setTimeout(() => {
      fetchAiSuggestion();
    }, 300);

    return () => clearTimeout(timer);
  }, [aiSuggestEnabled, currentIndex]); // Only trigger on index change, not on every keystroke

  // Clear suggestion when navigating (before auto-fetch kicks in)
  useEffect(() => {
    setAiSuggestion(null);
    setAiSuggestError(null);
  }, [currentIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    aiSuggestEnabled,
    aiSuggestion,
    isLoadingAiSuggestion,
    aiSuggestError,
    toggleAiSuggest,
    fetchAiSuggestion,
    clearAiSuggestion,
  };
}
