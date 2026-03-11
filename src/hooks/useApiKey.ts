import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'anthropic_api_key';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || '';
    setApiKeyState(stored);
    setIsLoaded(true);
  }, []);

  const setApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    setApiKeyState(trimmed);
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Whether a key is available (either client-side or we assume server has one)
  const hasKey = apiKey.length > 0;

  return { apiKey, hasKey, isLoaded, setApiKey, clearApiKey };
}
