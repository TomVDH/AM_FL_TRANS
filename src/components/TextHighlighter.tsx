import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useJsonHighlighting } from '../hooks/useJsonHighlighting';
import { useCharacterHighlighting } from '../hooks/useCharacterHighlighting';

/**
 * Context menu state for right-click on highlights
 */
interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  entry: {
    english: string;
    dutch: string;
    type: 'character' | 'xlsx' | 'json' | 'clickable';
    raw?: any;
  } | null;
}

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
  onCharacterNameClick?: (characterName: string, event: React.MouseEvent) => void;
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

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    entry: null
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Determine display text
  const displayText = eyeMode && currentTranslation ? currentTranslation : text;

  // Close context menu on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [contextMenu.visible]);

  // Context menu handlers
  const handleContextMenuInsert = useCallback(() => {
    if (contextMenu.entry?.dutch) {
      if (contextMenu.entry.type === 'character' || contextMenu.entry.type === 'clickable') {
        onCharacterClick(contextMenu.entry.dutch);
      } else if (onSuggestionClick) {
        onSuggestionClick(contextMenu.entry.dutch);
      }
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, [contextMenu.entry, onCharacterClick, onSuggestionClick]);

  const handleContextMenuCopyDutch = useCallback(() => {
    if (contextMenu.entry?.dutch) {
      navigator.clipboard.writeText(contextMenu.entry.dutch);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, [contextMenu.entry]);

  const handleContextMenuCopyEnglish = useCallback(() => {
    if (contextMenu.entry?.english) {
      navigator.clipboard.writeText(contextMenu.entry.english);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, [contextMenu.entry]);

  const handleContextMenuViewInPanel = useCallback(() => {
    if (contextMenu.entry && onHighlightClick) {
      const type = contextMenu.entry.type === 'clickable' ? 'character' : contextMenu.entry.type;
      onHighlightClick(contextMenu.entry.raw || contextMenu.entry, type as 'json' | 'xlsx' | 'character');
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, [contextMenu.entry, onHighlightClick]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

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
        onCharacterNameClick(characterName, e);
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
   * Handle right-click context menu on highlights
   */
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const dataType = target.getAttribute('data-type') as 'character' | 'xlsx' | 'json' | 'clickable' | null;

    if (!dataType) return; // Not a highlight, let default context menu show

    e.preventDefault();

    // Extract data from the highlight element
    const hoverData = target.getAttribute('data-hover') || '';
    const characterName = target.getAttribute('data-character') || '';
    const textContent = target.textContent || '';

    // Parse hover data to extract english/dutch where possible
    let english = textContent;
    let dutch = '';

    if (dataType === 'character' || dataType === 'clickable') {
      // For characters, hover format is: "matchedName → dutch (english)"
      const charMatch = hoverData.match(/^(.+?)\s*→\s*(.+?)\s*\((.+?)\)$/);
      if (charMatch) {
        english = charMatch[3]; // Full english name
        dutch = charMatch[2];   // Dutch translation
      } else {
        // Fallback for clickable (just character name)
        english = characterName || textContent;
        // Try to find dutch from character matches
        const { characterMatches } = matchResults;
        const foundMatch = characterMatches.find(
          m => m.english.toLowerCase() === english.toLowerCase() ||
               m.matchedName.toLowerCase() === english.toLowerCase()
        );
        if (foundMatch) {
          dutch = foundMatch.dutch;
          english = foundMatch.english;
        }
      }
    } else if (dataType === 'xlsx') {
      // For XLSX, hover format is: "Dutch: xxx | Context: xxx | Speaker: xxx"
      const dutchMatch = hoverData.match(/Dutch:\s*([^|]+)/);
      if (dutchMatch) dutch = dutchMatch[1].trim();
      english = textContent;
    } else if (dataType === 'json') {
      // Similar format for JSON
      const dutchMatch = hoverData.match(/Dutch:\s*([^|]+)/);
      if (dutchMatch) dutch = dutchMatch[1].trim();
      english = textContent;
    }

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      entry: {
        english,
        dutch,
        type: dataType,
        raw: { hover: hoverData, character: characterName }
      }
    });
  }, [matchResults]);

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
        onContextMenu={handleContextMenu}
      />

      {/* Right-click context menu */}
      {contextMenu.visible && contextMenu.entry && (
        <div
          ref={contextMenuRef}
          className="highlight-context-menu"
          style={{
            left: contextMenu.x,
            top: contextMenu.y
          }}
        >
          {/* Insert option - only if dutch translation exists */}
          {contextMenu.entry.dutch && (
            <button
              className="highlight-context-menu-item"
              onClick={handleContextMenuInsert}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Insert &quot;{contextMenu.entry.dutch.length > 20 ? contextMenu.entry.dutch.slice(0, 20) + '...' : contextMenu.entry.dutch}&quot;</span>
            </button>
          )}

          {/* Copy Dutch */}
          {contextMenu.entry.dutch && (
            <button
              className="highlight-context-menu-item"
              onClick={handleContextMenuCopyDutch}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Dutch</span>
            </button>
          )}

          {/* Copy English */}
          <button
            className="highlight-context-menu-item"
            onClick={handleContextMenuCopyEnglish}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy English</span>
          </button>

          {/* Divider */}
          <div className="highlight-context-menu-divider" />

          {/* View in Reference Panel */}
          {onHighlightClick && (
            <button
              className="highlight-context-menu-item"
              onClick={handleContextMenuViewInPanel}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>View in Reference Panel</span>
            </button>
          )}
        </div>
      )}

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

// Memoized export to prevent re-renders when only currentTranslation changes
// (currentTranslation only affects display when eyeMode is true)
export default React.memo(TextHighlighter, (prevProps, nextProps) => {
  // Only re-render if props that affect the displayed content changed
  // Skip re-render if only currentTranslation changed and eyeMode is false
  if (
    prevProps.text === nextProps.text &&
    prevProps.highlightMode === nextProps.highlightMode &&
    prevProps.className === nextProps.className &&
    prevProps.showSuggestions === nextProps.showSuggestions &&
    // Only compare jsonData/xlsxData by reference (they should be stable)
    prevProps.jsonData === nextProps.jsonData &&
    prevProps.xlsxData === nextProps.xlsxData &&
    // If eyeMode is false on both, currentTranslation doesn't matter
    (!prevProps.eyeMode && !nextProps.eyeMode)
  ) {
    return true; // Props are equal, skip re-render
  }

  // For eyeMode changes or when eyeMode is true, do full comparison
  if (prevProps.eyeMode !== nextProps.eyeMode) {
    return false; // Re-render
  }

  if (prevProps.eyeMode && nextProps.eyeMode) {
    // In eye mode, currentTranslation matters
    return prevProps.currentTranslation === nextProps.currentTranslation;
  }

  return false; // Default: re-render
});
