import { useState, useEffect, useCallback } from 'react';

interface CharacterEntry {
  name: string;
  description: string;
  english: string;
  dutch: string;
}

/**
 * Character Highlighting Hook
 * 
 * Manages character name highlighting functionality:
 * - Loads character translations from CSV
 * - Provides literal matching for character names in source text
 * - Returns highlight data for display
 */
export const useCharacterHighlighting = () => {
  const [characterData, setCharacterData] = useState<CharacterEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load character data from CSV API
  const loadCharacterData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/csv-data?file=character_translations.csv');
      if (response.ok) {
        const data = await response.json();
        if (data.sheets && data.sheets[0]) {
          setCharacterData(data.sheets[0].entries);
        }
      }
    } catch (error) {
      console.error('Error loading character data:', error);
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