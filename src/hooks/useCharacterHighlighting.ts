import { useState, useEffect, useCallback } from 'react';

interface CodexEntry {
  name: string;
  description: string;
  english: string;
  dutch: string;
  category?: string;
}

// Legacy alias for backwards compatibility
type CharacterEntry = CodexEntry;

/**
 * Character/Codex Highlighting Hook
 *
 * Manages codex highlighting functionality:
 * - Loads character and location translations from codex_translations.csv
 * - Provides literal matching for names in source text
 * - Returns highlight data for display
 *
 * Data Sources:
 * - Characters: E0 CharacterProfiles_localization (authoritative)
 * - Locations: README Names and World Overview
 */
export const useCharacterHighlighting = () => {
  const [characterData, setCharacterData] = useState<CodexEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load codex data from CSV API
  const loadCharacterData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use codex_translations.csv which contains authoritative character/location data
      const response = await fetch('/api/csv-data?file=codex_translations.csv');
      if (response.ok) {
        const data = await response.json();
        if (data.sheets && data.sheets[0]) {
          setCharacterData(data.sheets[0].entries);
        }
      }
    } catch (error) {
      console.error('Error loading codex data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Find character matches in text
  const findCharacterMatches = useCallback((text: string) => {
    if (!text || !characterData.length) return [];
    
    const matches: (CharacterEntry & { startIndex: number; endIndex: number })[] = [];
    
    characterData.forEach(character => {
      const index = text.toLowerCase().indexOf(character.english.toLowerCase());
      if (index !== -1) {
        matches.push({
          ...character,
          startIndex: index,
          endIndex: index + character.english.length
        });
      }
    });
    
    // Sort by start index to handle overlapping matches
    return matches.sort((a, b) => a.startIndex - b.startIndex);
  }, [characterData]);

  // Load character data on mount
  useEffect(() => {
    loadCharacterData();
  }, [loadCharacterData]);

  return {
    characterData,
    isLoading,
    findCharacterMatches,
    loadCharacterData
  };
};