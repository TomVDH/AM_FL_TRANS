import { useState, useCallback, useRef, useEffect } from 'react';

export type ModelTier = 'haiku' | 'sonnet' | 'opus';

interface SurroundingLine {
  speaker?: string;
  text: string;
}

interface UseAiSuggestionProps {
  sourceText: string;
  speaker: string;
  context: string;
  existingTranslation: string;
  currentIndex: number;
  linesBefore?: SurroundingLine[];
  linesAfter?: SurroundingLine[];
}

interface UseAiSuggestionReturn {
  aiSuggestEnabled: boolean;
  aiSuggestion: string | null;
  aiSuggestionModel: ModelTier | null;
  isLoadingAiSuggestion: boolean;
  isUpgradingAiSuggestion: boolean;
  aiSuggestError: string | null;
  toggleAiSuggest: () => void;
  fetchAiSuggestion: (model?: ModelTier) => void;
  upgradeAiSuggestion: () => void;
  clearAiSuggestion: () => void;
}

export function useAiSuggestion({
  sourceText,
  speaker,
  context,
  existingTranslation,
  currentIndex,
  linesBefore,
  linesAfter,
}: UseAiSuggestionProps): UseAiSuggestionReturn {
  const [aiSuggestEnabled, setAiSuggestEnabled] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiSuggestionModel, setAiSuggestionModel] = useState<ModelTier | null>(null);
  const [isLoadingAiSuggestion, setIsLoadingAiSuggestion] = useState(false);
  const [isUpgradingAiSuggestion, setIsUpgradingAiSuggestion] = useState(false);
  const [aiSuggestError, setAiSuggestError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchedIndexRef = useRef<number>(-1);

  const clearAiSuggestion = useCallback(() => {
    setAiSuggestion(null);
    setAiSuggestionModel(null);
    setAiSuggestError(null);
    setIsLoadingAiSuggestion(false);
    setIsUpgradingAiSuggestion(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const fetchAiSuggestion = useCallback(async (model: ModelTier = 'haiku') => {
    if (!sourceText.trim()) return;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const isUpgrade = model !== 'haiku';
    if (isUpgrade) {
      setIsUpgradingAiSuggestion(true);
    } else {
      setIsLoadingAiSuggestion(true);
      setAiSuggestion(null);
      setAiSuggestionModel(null);
    }
    setAiSuggestError(null);
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
          linesBefore: linesBefore && linesBefore.length > 0 ? linesBefore : undefined,
          linesAfter: linesAfter && linesAfter.length > 0 ? linesAfter : undefined,
          model,
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
        setAiSuggestionModel(data.model || model);
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
        setIsUpgradingAiSuggestion(false);
      }
    }
  }, [sourceText, speaker, context, existingTranslation, currentIndex, linesBefore, linesAfter]);

  const upgradeAiSuggestion = useCallback(() => {
    fetchAiSuggestion('sonnet');
  }, [fetchAiSuggestion]);

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
    const timerId = setTimeout(() => {
      fetchAiSuggestion('haiku');
    }, 300);

    return () => clearTimeout(timerId);
  }, [aiSuggestEnabled, currentIndex]); // Only trigger on index change, not on every keystroke

  // Clear suggestion when navigating (before auto-fetch kicks in)
  useEffect(() => {
    setAiSuggestion(null);
    setAiSuggestionModel(null);
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
    aiSuggestionModel,
    isLoadingAiSuggestion,
    isUpgradingAiSuggestion,
    aiSuggestError,
    toggleAiSuggest,
    fetchAiSuggestion,
    upgradeAiSuggestion,
    clearAiSuggestion,
  };
}
