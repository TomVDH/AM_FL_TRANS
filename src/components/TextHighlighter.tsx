import React, { useMemo, useCallback } from 'react';
import { useJsonHighlighting } from '../hooks/useJsonHighlighting';
import { useCharacterHighlighting } from '../hooks/useCharacterHighlighting';

/**
 * TextHighlighter Component
 *
 * Handles all text highlighting functionality including:
 * - JSON-based text matching and highlighting
 * - TranslatedDutch value display on hover
 * - Clickable character insertion
 * - Highlight mode toggling
 *
 * @component
 */
interface TextHighlighterProps {
  text: string;
  jsonData?: any;
  xlsxData?: any[];
  highlightMode: boolean;
  eyeMode: boolean;
  currentTranslation: string;
  onCharacterClick: (characterName: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  onCharacterNameClick?: (characterName: string) => void;
  onHighlightClick?: (entry: any, type: 'json' | 'xlsx' | 'character') => void;
  className?: string;
  style?: React.CSSProperties;
  showSuggestions?: boolean;
}

// CSS classes for highlights (moved from inline styles)
const HIGHLIGHT_STYLES = {
  json: 'highlight-tag highlight-json',
  xlsx: 'highlight-tag highlight-xlsx',
  character: 'highlight-tag highlight-character',
  clickable: 'highlight-tag highlight-clickable',
};

const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  jsonData,
  xlsxData,
  highlightMode,
  eyeMode,
  currentTranslation,
  onCharacterClick,
  onSuggestionClick,
  onCharacterNameClick,
  onHighlightClick,
  className = '',
  style = {},
  showSuggestions = true
}) => {
  // Use highlighting hooks
  const { findJsonMatches, getHoverText } = useJsonHighlighting(jsonData);
  const { findCharacterMatches } = useCharacterHighlighting();

  // Determine display text
  const displayText = eyeMode && currentTranslation ? currentTranslation : text;

  /**
   * Find XLSX matches for highlighting - memoized
   */
  const findXlsxMatches = useCallback((searchText: string) => {
    if (!xlsxData || !searchText) return [];

    const matches: any[] = [];
    const lowerText = searchText.toLowerCase();

    xlsxData.forEach(entry => {
      if (
        entry.sourceEnglish.toLowerCase().includes(lowerText) ||
        entry.translatedDutch.toLowerCase().includes(lowerText) ||
        lowerText.includes(entry.sourceEnglish.toLowerCase()) ||
        lowerText.includes(entry.translatedDutch.toLowerCase())
      ) {
        matches.push(entry);
      }
    });

    return matches;
  }, [xlsxData]);

  /**
   * Get hover text for XLSX matches
   */
  const getXlsxHoverText = useCallback((match: any): string => {
    const parts = [];
    if (match.translatedDutch) parts.push(`Dutch: ${match.translatedDutch}`);
    if (match.context) parts.push(`Context: ${match.context}`);
    if (match.utterer) parts.push(`Speaker: ${match.utterer}`);
    return parts.join(' | ');
  }, []);

  /**
   * Detect **Ass character names in text
   */
  const detectAssCharacters = useCallback((textToSearch: string) => {
    if (!textToSearch) return [];

    const characterPattern = /\*\*([^*\n]+?)(?=\*\*|$)/g;
    const matches = textToSearch.match(characterPattern);

    if (!matches) return [];

    return matches.map(match => match.slice(2)); // Remove ** prefix
  }, []);

  /**
   * Memoized match results - only recompute when dependencies change
   */
  const matchResults = useMemo(() => {
    const jsonMatches = jsonData ? findJsonMatches(displayText) : [];
    const xlsxMatches = xlsxData ? findXlsxMatches(displayText) : [];
    const characterMatches = findCharacterMatches(displayText);
    const assCharacters = detectAssCharacters(displayText);

    return { jsonMatches, xlsxMatches, characterMatches, assCharacters };
  }, [displayText, jsonData, xlsxData, findJsonMatches, findXlsxMatches, findCharacterMatches, detectAssCharacters]);

  /**
   * Highlight matching text based on all data sources - memoized
   */
  const highlightedText = useMemo(() => {
    const { jsonMatches, xlsxMatches, characterMatches, assCharacters } = matchResults;
    let result = displayText;

    // Only apply highlights if highlight mode is enabled
    if (highlightMode) {
      // Process JSON matches (blue)
      if (jsonMatches.length > 0) {
        const sortedMatches = [...jsonMatches].sort((a, b) => b.sourceEnglish.length - a.sourceEnglish.length);
        sortedMatches.forEach(match => {
          const escapedSource = match.sourceEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b(${escapedSource})\\b`, 'gi');
          const hoverText = getHoverText(match);
          result = result.replace(regex,
            `<span class="${HIGHLIGHT_STYLES.json}" data-type="json" data-hover="${hoverText}" title="${hoverText}">$1</span>`
          );
        });
      }

      // Process XLSX matches (green)
      if (xlsxMatches.length > 0) {
        const sortedMatches = [...xlsxMatches].sort((a, b) => b.sourceEnglish.length - a.sourceEnglish.length);
        sortedMatches.forEach(match => {
          const escapedSource = match.sourceEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b(${escapedSource})\\b`, 'gi');
          const hoverText = getXlsxHoverText(match);
          result = result.replace(regex,
            `<span class="${HIGHLIGHT_STYLES.xlsx}" data-type="xlsx" data-hover="${hoverText}" title="${hoverText}">$1</span>`
          );
        });
      }

      // Process character matches (purple) - always active
      characterMatches.forEach(charMatch => {
        const escapedName = charMatch.english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escapedName})\\b`, 'gi');
        const hoverText = `${charMatch.english} → ${charMatch.dutch}`;
        result = result.replace(regex,
          `<span class="${HIGHLIGHT_STYLES.character}" data-type="character" data-character="$1" data-hover="${hoverText}" title="${hoverText}">$1</span>`
        );
      });

      // Process **Ass characters (red) - clickable
      assCharacters.forEach(character => {
        const escapedChar = character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedChar})`, 'gi');
        result = result.replace(regex,
          `<span class="${HIGHLIGHT_STYLES.clickable}" data-type="clickable" data-character="$1">$1</span>`
        );
      });
    }

    return result;
  }, [displayText, matchResults, highlightMode, getHoverText, getXlsxHoverText]);

  /**
   * Handle click events on highlighted text
   */
  const handleTextClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const dataType = target.getAttribute('data-type');

    if (dataType === 'clickable') {
      const characterName = target.getAttribute('data-character');
      if (characterName) {
        onCharacterClick(characterName);
      }
    } else if (dataType === 'character') {
      const characterName = target.getAttribute('data-character');
      if (characterName && onCharacterNameClick) {
        onCharacterNameClick(characterName);
      }
    } else if ((dataType === 'json' || dataType === 'xlsx') && onHighlightClick) {
      // Could trigger jump to Data Viewer
      const hoverData = target.getAttribute('data-hover');
      if (hoverData) {
        onHighlightClick({ hover: hoverData }, dataType as 'json' | 'xlsx');
      }
    }
  }, [onCharacterClick, onCharacterNameClick, onHighlightClick]);

  /**
   * Extract and deduplicate translation suggestions - memoized
   */
  const translationSuggestions = useMemo(() => {
    const { jsonMatches, xlsxMatches, characterMatches } = matchResults;
    const suggestions = new Map<string, { source: string; translation: string; type: string; priority: number }>();

    // Process character matches first (highest priority for names)
    characterMatches.forEach(match => {
      if (match.dutch && match.dutch.trim()) {
        suggestions.set(match.dutch, {
          source: match.english,
          translation: match.dutch,
          type: 'character',
          priority: 3 // Highest priority
        });
      }
    });

    // Process JSON matches
    jsonMatches.forEach(match => {
      if (match.translatedDutch && match.translatedDutch.trim() && !suggestions.has(match.translatedDutch)) {
        suggestions.set(match.translatedDutch, {
          source: match.sourceEnglish,
          translation: match.translatedDutch,
          type: 'json',
          priority: 2
        });
      }
    });

    // Process XLSX matches
    xlsxMatches.forEach(match => {
      if (match.translatedDutch && match.translatedDutch.trim() && !suggestions.has(match.translatedDutch)) {
        suggestions.set(match.translatedDutch, {
          source: match.sourceEnglish,
          translation: match.translatedDutch,
          type: 'xlsx',
          priority: 1
        });
      }
    });

    // Sort by priority (descending) then by translation length (descending for relevance)
    return Array.from(suggestions.values())
      .sort((a, b) => b.priority - a.priority || b.translation.length - a.translation.length);
  }, [matchResults]);

  /**
   * Extract character placeholder names - memoized and deduplicated
   */
  const characterPlaceholders = useMemo(() => {
    if (!displayText) return [];

    const names = new Set<string>();

    // Pattern to match "Word Ass" character names
    const fullNamePattern = /\b(\w+\s+Ass)\b/gi;
    const fullMatches = displayText.match(fullNamePattern) || [];
    fullMatches.forEach(match => names.add(match.trim()));

    // Check for known character names
    const { characterMatches } = matchResults;
    characterMatches.forEach(match => {
      if (displayText.toLowerCase().includes(match.english.toLowerCase())) {
        names.add(match.english);
      }
    });

    return Array.from(names);
  }, [displayText, matchResults]);

  // Determine if suggestions should show
  const shouldShowSuggestions = showSuggestions &&
    (translationSuggestions.length > 0 || characterPlaceholders.length > 0) &&
    onSuggestionClick &&
    !className.includes('opacity-70') &&
    !className.includes('no-suggestions');

  return (
    <div className={className} style={style}>
      <div
        dangerouslySetInnerHTML={{ __html: highlightedText }}
        onClick={handleTextClick}
      />

      {/* Suggestion buttons - deduplicated and sorted */}
      {shouldShowSuggestions && (
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Character placeholder buttons (orange) */}
          {characterPlaceholders.slice(0, 5).map((characterName, index) => (
            <button
              key={`placeholder-${characterName}`}
              onClick={() => onSuggestionClick!(`(${characterName})`)}
              className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600 hover:bg-orange-200 dark:hover:bg-orange-700 transition-colors duration-200 font-medium"
              title={`Insert placeholder: (${characterName})`}
              style={{ borderRadius: '3px' }}
            >
              ({characterName})
            </button>
          ))}

          {/* Translation buttons - limited to 8 max, deduplicated */}
          {translationSuggestions.slice(0, 8).map((suggestion) => (
            <button
              key={`translation-${suggestion.translation}`}
              onClick={() => onSuggestionClick!(suggestion.translation)}
              className={`px-3 py-1 text-sm transition-colors duration-200 font-medium ${
                suggestion.type === 'character'
                  ? 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 hover:bg-purple-200 dark:hover:bg-purple-700'
                  : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-700'
              }`}
              title={`"${suggestion.source}" → "${suggestion.translation}"`}
              style={{ borderRadius: '3px' }}
            >
              {suggestion.translation}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextHighlighter;
