import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * LRU Cache for search results
 * Stores recent search results to avoid redundant searches
 */
class LRUCache<T> {
  private cache: Map<string, T>;
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest (first) entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

interface UseDebouncedSearchOptions {
  /** Debounce delay in milliseconds (default: 300) */
  delay?: number;
  /** Maximum cache size (default: 50) */
  cacheSize?: number;
  /** Minimum search term length to trigger search (default: 1) */
  minLength?: number;
}

interface UseDebouncedSearchResult<T> {
  /** Current search results */
  results: T[];
  /** Whether a search is in progress */
  isSearching: boolean;
  /** The current search term being used */
  searchTerm: string;
  /** Set the search term (will be debounced) */
  setSearchTerm: (term: string) => void;
  /** Clear results and cache */
  clear: () => void;
  /** Number of cached queries */
  cacheSize: number;
}

/**
 * Hook for debounced search with LRU caching
 *
 * @param searchFn - Async function that performs the actual search
 * @param options - Configuration options
 * @returns Search state and controls
 *
 * @example
 * ```tsx
 * const { results, isSearching, setSearchTerm } = useDebouncedSearch(
 *   async (term) => {
 *     const response = await fetch(`/api/search?q=${term}`);
 *     return response.json();
 *   },
 *   { delay: 300, cacheSize: 50 }
 * );
 * ```
 */
export function useDebouncedSearch<T>(
  searchFn: (term: string) => Promise<T[]>,
  options: UseDebouncedSearchOptions = {}
): UseDebouncedSearchResult<T> {
  const { delay = 300, cacheSize = 50, minLength = 1 } = options;

  const [searchTerm, setSearchTermState] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Stable references
  const cacheRef = useRef(new LRUCache<T[]>(cacheSize));
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchFnRef = useRef(searchFn);

  // Keep searchFn reference up to date
  useEffect(() => {
    searchFnRef.current = searchFn;
  }, [searchFn]);

  // Perform the actual search
  const executeSearch = useCallback(async (term: string) => {
    const normalizedTerm = term.trim().toLowerCase();

    // Check cache first
    const cached = cacheRef.current.get(normalizedTerm);
    if (cached !== undefined) {
      setResults(cached);
      setIsSearching(false);
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const searchResults = await searchFnRef.current(term);

      // Cache the results
      cacheRef.current.set(normalizedTerm, searchResults);
      setResults(searchResults);
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Search error:', error);
        setResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search term setter
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Handle empty or too short terms
    if (term.trim().length < minLength) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Check cache for immediate result
    const normalizedTerm = term.trim().toLowerCase();
    const cached = cacheRef.current.get(normalizedTerm);
    if (cached !== undefined) {
      setResults(cached);
      setIsSearching(false);
      return;
    }

    // Start debounced search
    setIsSearching(true);
    timeoutRef.current = setTimeout(() => {
      executeSearch(term);
    }, delay);
  }, [delay, minLength, executeSearch]);

  // Clear results and cache
  const clear = useCallback(() => {
    setSearchTermState('');
    setResults([]);
    setIsSearching(false);
    cacheRef.current.clear();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    results,
    isSearching,
    searchTerm,
    setSearchTerm,
    clear,
    cacheSize: cacheRef.current.size,
  };
}

/**
 * Simple debounce hook for values
 * Returns the debounced value after the specified delay
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedSearch;
