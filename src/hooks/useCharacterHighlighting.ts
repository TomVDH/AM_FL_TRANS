import { useState, useEffect, useCallback } from 'react';

interface CodexEntry {
  name: string;
  description: string;
  english: string;
  dutch: string;
  category?: string;
  nicknames?: string[];
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
  dutchDialogueStyle?: string;
}

// Legacy alias for backwards compatibility
type CharacterEntry = CodexEntry;

/**
 * Character/Codex Highlighting Hook - Phase 2 Enhanced
 *
 * Manages codex highlighting functionality:
 * - Loads character and location translations from codex_translations.csv
 * - Provides literal matching for names AND nicknames in source text
 * - Returns highlight data for display
 *
 * Data Sources:
 * - Characters: E0 CharacterProfiles_localization (authoritative)
 * - Locations: README Names and World Overview
 * - Nicknames: Auto-generated (e.g., "Sick Ass" -> ["Sick", "Uncle Sick"])
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
          // Parse entries and convert nicknames from semicolon-separated string to array
          const entries = data.sheets[0].entries.map((entry: any) => ({
            ...entry,
            nicknames: entry.nicknames
              ? (typeof entry.nicknames === 'string'
                  ? entry.nicknames.split(';').map((n: string) => n.trim()).filter(Boolean)
                  : entry.nicknames)
              : [],
          }));
          setCharacterData(entries);
        }
      }
    } catch (error) {
      console.error('Error loading codex data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Find character matches in text - now also matches nicknames
  const findCharacterMatches = useCallback((text: string) => {
    if (!text || !characterData.length) return [];

    const lowerText = text.toLowerCase();
    const matches: (CharacterEntry & { startIndex: number; endIndex: number; matchedName: string })[] = [];
    const usedRanges: { start: number; end: number }[] = [];

    // Common words to exclude from nickname matching (to prevent over-matching)
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
      'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further',
      'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
      'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
      'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
      'just', 'should', 'now', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them',
      'their', 'what', 'which', 'who', 'this', 'that', 'these', 'those', 'am', 'is',
      'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
      'did', 'doing', 'would', 'could', 'ought', 'may', 'might', 'must', 'shall'
    ]);

    // Helper to check if a range overlaps with existing matches
    const overlaps = (start: number, end: number) => {
      return usedRanges.some(range =>
        (start >= range.start && start < range.end) ||
        (end > range.start && end <= range.end) ||
        (start <= range.start && end >= range.end)
      );
    };

    // First pass: match full names (higher priority)
    characterData.forEach(character => {
      const englishLower = character.english.toLowerCase();
      let searchPos = 0;

      while (searchPos < lowerText.length) {
        const index = lowerText.indexOf(englishLower, searchPos);
        if (index === -1) break;

        const endIndex = index + character.english.length;

        // Check word boundaries (don't match partial words)
        const beforeChar = index > 0 ? lowerText[index - 1] : ' ';
        const afterChar = endIndex < lowerText.length ? lowerText[endIndex] : ' ';
        const isWordBoundary = /\W/.test(beforeChar) && /\W/.test(afterChar);

        if (isWordBoundary && !overlaps(index, endIndex)) {
          matches.push({
            ...character,
            startIndex: index,
            endIndex: endIndex,
            matchedName: character.english,
          });
          usedRanges.push({ start: index, end: endIndex });
        }

        searchPos = index + 1;
      }
    });

    // Second pass: match nicknames (only if no overlapping full name match)
    characterData.forEach(character => {
      const nicknames = character.nicknames || [];

      nicknames.forEach((nickname: string) => {
        // Skip if nickname is too short or is a common word
        if (!nickname || nickname.length < 3) return;

        const nicknameLower = nickname.toLowerCase();

        // Skip common words
        if (commonWords.has(nicknameLower)) return;

        let searchPos = 0;

        while (searchPos < lowerText.length) {
          const index = lowerText.indexOf(nicknameLower, searchPos);
          if (index === -1) break;

          const endIndex = index + nickname.length;

          // Check word boundaries
          const beforeChar = index > 0 ? lowerText[index - 1] : ' ';
          const afterChar = endIndex < lowerText.length ? lowerText[endIndex] : ' ';
          const isWordBoundary = /\W/.test(beforeChar) && /\W/.test(afterChar);

          if (isWordBoundary && !overlaps(index, endIndex)) {
            matches.push({
              ...character,
              startIndex: index,
              endIndex: endIndex,
              matchedName: nickname,
            });
            usedRanges.push({ start: index, end: endIndex });
          }

          searchPos = index + 1;
        }
      });
    });

    // Sort by start index
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
