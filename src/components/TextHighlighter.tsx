import React, { useMemo, useCallback } from 'react';
import { useJsonHighlighting, useCharacterHighlighting } from '../hooks/highlighting';

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

/**
 * Escape special HTML characters for safe insertion into HTML attributes
 * Prevents XSS and fixes broken HTML when data contains quotes, angle brackets, etc.
 */
const escapeHtmlAttribute = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')   // Must be first to avoid double-escaping
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Generate a unique placeholder that won't appear in normal text
 */
const generatePlaceholder = (index: number, type: string): string => {
  return `\u0000HIGHLIGHT_${type}_${index}\u0000`;
};

/**
 * Highlight text using a two-pass approach to avoid nested replacements
 * Pass 1: Replace matches with unique placeholders
 * Pass 2: Replace placeholders with actual HTML spans
 */
const safeHighlight = (
  text: string,
  matches: Array<{ pattern: RegExp; replacement: string }>
): string => {
  if (!matches.length) return text;

  let result = text;
  const placeholders: Map<string, string> = new Map();

  // Pass 1: Replace all matches with placeholders
  matches.forEach((match, index) => {
    const placeholder = generatePlaceholder(index, 'M');
    result = result.replace(match.pattern, (fullMatch, captured) => {
      // Store the replacement with the actual captured text
      const actualReplacement = match.replacement.replace(/\$1/g, captured);
      placeholders.set(placeholder, actualReplacement);
      return placeholder;
    });
  });

  // Pass 2: Replace placeholders with actual HTML
  placeholders.forEach((replacement, placeholder) => {
    result = result.replace(placeholder, replacement);
  });

  return result;
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
   * Uses a two-pass approach to prevent nested replacements from breaking HTML
   */
  const highlightedText = useMemo(() => {
    const { jsonMatches, xlsxMatches, characterMatches, assCharacters } = matchResults;
    let result = displayText;

    // Only apply highlights if highlight mode is enabled
    if (highlightMode) {
      // Collect all replacements first, then apply them in a safe way
      interface PendingReplacement {
        start: number;
        end: number;
        original: string;
        replacement: string;
        priority: number; // Higher = applied first (won't be overwritten)
      }

      const pendingReplacements: PendingReplacement[] = [];

      // Helper to find all matches and their positions
      const findAllMatches = (
        text: string,
        pattern: RegExp,
        createReplacement: (match: string) => string,
        priority: number
      ) => {
        let match;
        const regex = new RegExp(pattern.source, 'gi'); // Ensure global flag
        while ((match = regex.exec(text)) !== null) {
          pendingReplacements.push({
            start: match.index,
            end: match.index + match[0].length,
            original: match[0],
            replacement: createReplacement(match[0]),
            priority
          });
        }
      };

      // Process JSON matches (blue) - priority 1 (lowest)
      if (jsonMatches.length > 0) {
        const sortedMatches = [...jsonMatches].sort((a, b) => b.sourceEnglish.length - a.sourceEnglish.length);
        sortedMatches.forEach(match => {
          const escapedSource = match.sourceEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b(${escapedSource})\\b`, 'gi');
          const hoverText = escapeHtmlAttribute(getHoverText(match));
          findAllMatches(displayText, regex, (m) =>
            `<span class="${HIGHLIGHT_STYLES.json}" data-type="json" data-hover="${hoverText}" title="${hoverText}">${m}</span>`,
            1
          );
        });
      }

      // Process XLSX matches (green) - priority 2
      if (xlsxMatches.length > 0) {
        const sortedMatches = [...xlsxMatches].sort((a, b) => b.sourceEnglish.length - a.sourceEnglish.length);
        sortedMatches.forEach(match => {
          const escapedSource = match.sourceEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b(${escapedSource})\\b`, 'gi');
          const hoverText = escapeHtmlAttribute(getXlsxHoverText(match));
          findAllMatches(displayText, regex, (m) =>
            `<span class="${HIGHLIGHT_STYLES.xlsx}" data-type="xlsx" data-hover="${hoverText}" title="${hoverText}">${m}</span>`,
            2
          );
        });
      }

      // Process character matches (purple) - priority 3 (highest for named entities)
      // Note: characterMatches already has exact positions from findCharacterMatches()
      // which detects both full names AND nicknames (e.g., "Trusty" for "Trusty Ass")
      characterMatches.forEach(charMatch => {
        const hoverText = escapeHtmlAttribute(`${charMatch.matchedName} → ${charMatch.dutch} (${charMatch.english})`);
        const matchText = displayText.substring(charMatch.startIndex, charMatch.endIndex);
        pendingReplacements.push({
          start: charMatch.startIndex,
          end: charMatch.endIndex,
          original: matchText,
          replacement: `<span class="${HIGHLIGHT_STYLES.character}" data-type="character" data-character="${escapeHtmlAttribute(charMatch.english)}" data-hover="${hoverText}" title="${hoverText}">${matchText}</span>`,
          priority: 3
        });
      });

      // Process **Ass characters (red) - clickable - priority 4 (highest)
      assCharacters.forEach(character => {
        const escapedChar = character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedChar})`, 'gi');
        findAllMatches(displayText, regex, (m) =>
          `<span class="${HIGHLIGHT_STYLES.clickable}" data-type="clickable" data-character="${escapeHtmlAttribute(m)}">${m}</span>`,
          4
        );
      });

      // Now apply all replacements in a non-overlapping way
      // Sort by priority (highest first), then by position (earlier first)
      // Remove overlapping replacements (keep highest priority)
      pendingReplacements.sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.start - b.start;
      });

      // Filter out overlapping replacements
      const finalReplacements: typeof pendingReplacements = [];
      const usedRanges: Array<{ start: number; end: number }> = [];

      for (const rep of pendingReplacements) {
        const overlaps = usedRanges.some(
          range => !(rep.end <= range.start || rep.start >= range.end)
        );
        if (!overlaps) {
          finalReplacements.push(rep);
          usedRanges.push({ start: rep.start, end: rep.end });
        }
      }

      // Sort by position (reverse order so we can replace from end to start)
      finalReplacements.sort((a, b) => b.start - a.start);

      // Apply replacements from end to start to preserve positions
      for (const rep of finalReplacements) {
        result = result.substring(0, rep.start) + rep.replacement + result.substring(rep.end);
      }
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
    // Note: matchedName could be a nickname (e.g., "Trusty") while english is the full name (e.g., "Trusty Ass")
    characterMatches.forEach(match => {
      if (match.dutch && match.dutch.trim()) {
        const sourceLabel = match.matchedName !== match.english
          ? `${match.matchedName} (${match.english})`
          : match.english;
        suggestions.set(match.dutch, {
          source: sourceLabel,
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
