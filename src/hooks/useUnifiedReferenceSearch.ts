import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

export type SourceType = 'codex' | 'xlsx' | 'json' | 'all';

interface CodexResult {
  type: 'codex';
  name: string;
  english: string;
  dutch: string;
  description?: string;
  category?: string;
}

interface XlsxResult {
  type: 'xlsx';
  sourceEnglish: string;
  translatedDutch: string;
  sheetName?: string;
  rowNumber: number;
  utterer: string;
  context: string;
}

interface JsonResult {
  type: 'json';
  key: string;
  english: string;
  dutch: string;
  category?: string;
}

export type UnifiedSearchResult = CodexResult | XlsxResult | JsonResult;

interface UseUnifiedReferenceSearchProps {
  codexData: any[];
  xlsxData: any[] | null;
  jsonData: any;
  debounceMs?: number;
}

interface UseUnifiedReferenceSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sourceFilter: SourceType;
  setSourceFilter: (filter: SourceType) => void;
  results: UnifiedSearchResult[];
  isSearching: boolean;
  resultCounts: { codex: number; xlsx: number; json: number; total: number };
  clearSearch: () => void;
  searchBySourceText: (text: string) => void;
}

/**
 * Unified Reference Search Hook
 *
 * Provides debounced search across all data sources:
 * - Codex (character/location translations from CSV)
 * - XLSX (episode translations)
 * - JSON (Localization Manual data)
 *
 * Features:
 * - Debounced search to prevent excessive filtering
 * - Source type filtering
 * - Auto-search on source text change
 */
export const useUnifiedReferenceSearch = ({
  codexData,
  xlsxData,
  jsonData,
  debounceMs = 300,
}: UseUnifiedReferenceSearchProps): UseUnifiedReferenceSearchReturn => {
  const [searchTerm, setSearchTermInternal] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceType>('all');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounce search term changes
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermInternal(term);
    setIsSearching(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(term);
      setIsSearching(false);
    }, debounceMs);
  }, [debounceMs]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Search codex data
  const searchCodex = useCallback((term: string): CodexResult[] => {
    if (!term || !codexData || codexData.length === 0) return [];

    const lowerTerm = term.toLowerCase();
    return codexData
      .filter((entry: any) => {
        const english = (entry.english || '').toLowerCase();
        const dutch = (entry.dutch || '').toLowerCase();
        const name = (entry.name || '').toLowerCase();
        return english.includes(lowerTerm) || dutch.includes(lowerTerm) || name.includes(lowerTerm);
      })
      .slice(0, 20)
      .map((entry: any) => ({
        type: 'codex' as const,
        name: entry.name || entry.english,
        english: entry.english,
        dutch: entry.dutch,
        description: entry.description,
        category: entry.category,
      }));
  }, [codexData]);

  // Search XLSX data
  const searchXlsx = useCallback((term: string): XlsxResult[] => {
    if (!term || !xlsxData || xlsxData.length === 0) return [];

    const lowerTerm = term.toLowerCase();
    return xlsxData
      .filter((entry: any) => {
        const sourceEnglish = (entry.sourceEnglish || '').toLowerCase();
        const translatedDutch = (entry.translatedDutch || '').toLowerCase();
        const utterer = (entry.utterer || '').toLowerCase();
        const context = (entry.context || '').toLowerCase();
        return sourceEnglish.includes(lowerTerm) ||
               translatedDutch.includes(lowerTerm) ||
               utterer.includes(lowerTerm) ||
               context.includes(lowerTerm);
      })
      .slice(0, 30)
      .map((entry: any) => ({
        type: 'xlsx' as const,
        sourceEnglish: entry.sourceEnglish,
        translatedDutch: entry.translatedDutch,
        sheetName: entry.sheetName,
        rowNumber: entry.row || 0,
        utterer: entry.utterer || '',
        context: entry.context || '',
      }));
  }, [xlsxData]);

  // Search JSON data (Localization Manual)
  const searchJson = useCallback((term: string): JsonResult[] => {
    if (!term || !jsonData || !jsonData.sheets) return [];

    const lowerTerm = term.toLowerCase();
    const results: JsonResult[] = [];

    jsonData.sheets.forEach((sheet: any) => {
      if (!sheet.entries) return;

      sheet.entries.forEach((entry: any) => {
        const english = (entry.english || '').toLowerCase();
        const dutch = (entry.dutch || '').toLowerCase();
        const key = (entry.key || '').toLowerCase();

        if (english.includes(lowerTerm) || dutch.includes(lowerTerm) || key.includes(lowerTerm)) {
          results.push({
            type: 'json' as const,
            key: entry.key || '',
            english: entry.english || '',
            dutch: entry.dutch || '',
            category: sheet.sheetName,
          });
        }
      });
    });

    return results.slice(0, 20);
  }, [jsonData]);

  // Combined search results
  const results = useMemo(() => {
    if (!debouncedSearchTerm) return [];

    let allResults: UnifiedSearchResult[] = [];

    if (sourceFilter === 'all' || sourceFilter === 'codex') {
      allResults = [...allResults, ...searchCodex(debouncedSearchTerm)];
    }

    if (sourceFilter === 'all' || sourceFilter === 'xlsx') {
      allResults = [...allResults, ...searchXlsx(debouncedSearchTerm)];
    }

    if (sourceFilter === 'all' || sourceFilter === 'json') {
      allResults = [...allResults, ...searchJson(debouncedSearchTerm)];
    }

    return allResults;
  }, [debouncedSearchTerm, sourceFilter, searchCodex, searchXlsx, searchJson]);

  // Result counts by source
  const resultCounts = useMemo(() => {
    const codex = results.filter(r => r.type === 'codex').length;
    const xlsx = results.filter(r => r.type === 'xlsx').length;
    const json = results.filter(r => r.type === 'json').length;

    return {
      codex,
      xlsx,
      json,
      total: codex + xlsx + json,
    };
  }, [results]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTermInternal('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  }, []);

  // Search by source text (auto-search feature)
  const searchBySourceText = useCallback((text: string) => {
    // Extract first few words for search
    const words = text.split(/\s+/).slice(0, 5).join(' ');
    setSearchTerm(words);
  }, [setSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    sourceFilter,
    setSourceFilter,
    results,
    isSearching,
    resultCounts,
    clearSearch,
    searchBySourceText,
  };
};

export default useUnifiedReferenceSearch;
