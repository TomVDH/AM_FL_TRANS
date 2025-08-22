import React from 'react';
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
  className?: string;
  style?: React.CSSProperties;
  showSuggestions?: boolean;
}

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
  className = '',
  style = {},
  showSuggestions = true
}) => {
  // Use highlighting hooks
  const { findJsonMatches, getHoverText } = useJsonHighlighting(jsonData);
  const { findCharacterMatches } = useCharacterHighlighting();

  /**
   * Find XLSX matches for highlighting
   * 
   * @param text - Text to search for matches
   * @returns Array of matching XLSX entries
   */
  const findXlsxMatches = (text: string) => {
    if (!xlsxData || !text) return [];
    
    const matches: any[] = [];
    const searchText = text.toLowerCase();
    
    xlsxData.forEach(entry => {
      if (
        entry.sourceEnglish.toLowerCase().includes(searchText) ||
        entry.translatedDutch.toLowerCase().includes(searchText) ||
        searchText.includes(entry.sourceEnglish.toLowerCase()) ||
        searchText.includes(entry.translatedDutch.toLowerCase())
      ) {
        matches.push(entry);
      }
    });
    
    return matches;
  };

  /**
   * Get hover text for XLSX matches
   * 
   * @param match - The XLSX match entry
   * @returns Hover text string
   */
  const getXlsxHoverText = (match: any): string => {
    const parts = [];
    if (match.translatedDutch) parts.push(`Dutch: ${match.translatedDutch}`);
    if (match.context) parts.push(`Context: ${match.context}`);
    if (match.utterer) parts.push(`Speaker: ${match.utterer}`);
    
    return parts.join(' | ');
  };

  /**
   * Detect **Ass character names in text
   * 
   * Looks for patterns like "**Ass" or "**Ass Name" in the text
   * and extracts the character names for highlighting and insertion
   * 
   * @param text - The text to search for character names
   * @returns Array of detected character names
   */
  const detectAssCharacters = (text: string) => {
    if (!text) return [];
    
    const characterPattern = /\*\*([^*\n]+?)(?=\*\*|$)/g;
    const matches = text.match(characterPattern);
    
    if (!matches) return [];
    
    return matches.map(match => match.slice(2)); // Remove ** prefix
  };

  /**
   * Highlight matching text based on JSON data
   * 
   * This function searches for matches in JSON data and highlights
   * them with hover functionality for translatedDutch values
   * 
   * @param text - The text to highlight
   * @returns HTML string with highlighted elements
   */
  const highlightMatchingText = (text: string) => {
    console.log('🎨 TextHighlighter Debug: Starting highlight for text:', text);
    console.log('🎨 TextHighlighter Debug: jsonData available:', !!jsonData);
    console.log('🎨 TextHighlighter Debug: xlsxData available:', !!xlsxData);
    console.log('🎨 TextHighlighter Debug: highlightMode:', highlightMode);
    
    // Character highlighting is always available, even without JSON/XLSX data
    const hasAnyData = jsonData || xlsxData || true; // Character data is always available
    
    // Get matches from all data sources (character data is always active)
    const jsonMatches = jsonData ? findJsonMatches(text) : [];
    const xlsxMatches = xlsxData ? findXlsxMatches(text) : [];
    const assCharacters = detectAssCharacters(text);
    const characterMatches = findCharacterMatches(text); // Always enabled
    
    console.log('🎨 TextHighlighter Debug: Found JSON matches:', jsonMatches.length);
    console.log('🎨 TextHighlighter Debug: Found XLSX matches:', xlsxMatches.length);
    console.log('🎨 TextHighlighter Debug: Found Ass characters:', assCharacters.length);
    console.log('🎨 TextHighlighter Debug: Found Character matches:', characterMatches.length);
    
    let highlightedText = text;
    
    console.log('🎨 TextHighlighter Debug: Highlight mode is:', highlightMode);
    
    // Only highlight if highlight mode is enabled
    if (highlightMode) {
      // Process JSON matches
      if (jsonMatches.length > 0) {
      const sortedMatches = [...jsonMatches].sort((a, b) => b.sourceEnglish.length - a.sourceEnglish.length);
      
      sortedMatches.forEach(match => {
        console.log('🎨 TextHighlighter Debug: Processing JSON match:', match.sourceEnglish);
        
        // Escape special regex characters in the sourceEnglish
        const escapedSource = match.sourceEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escapedSource})\\b`, 'gi');
        
        // Create hover text
        const hoverText = getHoverText(match);
        
        console.log('🎨 TextHighlighter Debug: Replacing with hover text:', hoverText);
        
        // Replace with highlighted span that has hover functionality
        highlightedText = highlightedText.replace(regex, 
          `<span class="json-highlight" data-hover="${hoverText}" style="cursor: pointer; color: #3b82f6; font-weight: 500; background: rgba(59, 130, 246, 0.08); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 6px rgba(59, 130, 246, 0.15); transition: all 0.2s ease;" title="${hoverText}" onmouseover="this.style.background='rgba(59, 130, 246, 0.12)'; this.style.boxShadow='0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 8px rgba(59, 130, 246, 0.25)'; this.style.borderColor='rgba(59, 130, 246, 0.4)'" onmouseout="this.style.background='rgba(59, 130, 246, 0.08)'; this.style.boxShadow='0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 6px rgba(59, 130, 246, 0.15)'; this.style.borderColor='rgba(59, 130, 246, 0.3)'">$1</span>`
        );
      });
    }
    
    // Process XLSX matches
    if (xlsxMatches.length > 0) {
      const sortedXlsxMatches = [...xlsxMatches].sort((a, b) => b.sourceEnglish.length - a.sourceEnglish.length);
      
      sortedXlsxMatches.forEach(match => {
        console.log('🎨 TextHighlighter Debug: Processing XLSX match:', match.sourceEnglish);
        
        // Escape special regex characters in the sourceEnglish
        const escapedSource = match.sourceEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escapedSource})\\b`, 'gi');
        
        // Create hover text
        const hoverText = getXlsxHoverText(match);
        
        console.log('🎨 TextHighlighter Debug: Replacing with XLSX hover text:', hoverText);
        
        // Replace with highlighted span that has hover functionality
        highlightedText = highlightedText.replace(regex, 
          `<span class="xlsx-highlight" data-hover="${hoverText}" style="cursor: pointer; color: #10b981; font-weight: 500; background: rgba(16, 185, 129, 0.08); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1), 0 0 6px rgba(16, 185, 129, 0.15); transition: all 0.2s ease;" title="${hoverText}" onmouseover="this.style.background='rgba(16, 185, 129, 0.12)'; this.style.boxShadow='0 0 0 1px rgba(16, 185, 129, 0.2), 0 0 8px rgba(16, 185, 129, 0.25)'; this.style.borderColor='rgba(16, 185, 129, 0.4)'" onmouseout="this.style.background='rgba(16, 185, 129, 0.08)'; this.style.boxShadow='0 0 0 1px rgba(16, 185, 129, 0.1), 0 0 6px rgba(16, 185, 129, 0.15)'; this.style.borderColor='rgba(16, 185, 129, 0.3)'">$1</span>`
        );
      });
    }
    
    // Always highlight character names from CSV (always active - blue highlighting)
    characterMatches.forEach(charMatch => {
      console.log('🎨 TextHighlighter Debug: Processing character match:', charMatch.english);
      
      // Escape special regex characters
      const escapedName = charMatch.english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedName})\\b`, 'gi');
      
      // Create hover text with Dutch translation
      const hoverText = `${charMatch.english} → ${charMatch.dutch}`;
      
      // Replace with highlighted span that's clickable and has hover
      highlightedText = highlightedText.replace(regex, 
        `<span class="character-highlight" data-character="$1" data-hover="${hoverText}" style="cursor: pointer; color: #8b5cf6; font-weight: 500; background: rgba(139, 92, 246, 0.08); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(139, 92, 246, 0.3); box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.1), 0 0 6px rgba(139, 92, 246, 0.15); transition: all 0.2s ease;" title="${hoverText}" onmouseover="this.style.background='rgba(139, 92, 246, 0.12)'; this.style.boxShadow='0 0 0 1px rgba(139, 92, 246, 0.2), 0 0 8px rgba(139, 92, 246, 0.25)'; this.style.borderColor='rgba(139, 92, 246, 0.4)'" onmouseout="this.style.background='rgba(139, 92, 246, 0.08)'; this.style.boxShadow='0 0 0 1px rgba(139, 92, 246, 0.1), 0 0 6px rgba(139, 92, 246, 0.15)'; this.style.borderColor='rgba(139, 92, 246, 0.3)'">$1</span>`
      );
    });
    
    // Make **Ass characters clickable (always blue)
    assCharacters.forEach(character => {
      const regex = new RegExp(`(${character})`, 'gi');
      highlightedText = highlightedText.replace(regex, 
        '<span class="clickable-character" data-character="$1" style="cursor: pointer; color: #ef4444; font-weight: 500; background: rgba(239, 68, 68, 0.08); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.3); box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.1), 0 0 6px rgba(239, 68, 68, 0.15); transition: all 0.2s ease;" onmouseover="this.style.background=\'rgba(239, 68, 68, 0.12)\'; this.style.boxShadow=\'0 0 0 1px rgba(239, 68, 68, 0.2), 0 0 8px rgba(239, 68, 68, 0.25)\'; this.style.borderColor=\'rgba(239, 68, 68, 0.4)\'" onmouseout="this.style.background=\'rgba(239, 68, 68, 0.08)\'; this.style.boxShadow=\'0 0 0 1px rgba(239, 68, 68, 0.1), 0 0 6px rgba(239, 68, 68, 0.15)\'; this.style.borderColor=\'rgba(239, 68, 68, 0.3)\'">$1</span>'
      );
    });
    }
    
    console.log('🎨 TextHighlighter Debug: Final highlighted text length:', highlightedText.length);
    return highlightedText;
  };

  /**
   * Handle click events on highlighted text
   * 
   * Detects clicks on clickable character elements and triggers
   * the character insertion callback
   * 
   * @param e - The click event
   */
  const handleTextClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('clickable-character')) {
      const characterName = target.getAttribute('data-character');
      if (characterName) {
        onCharacterClick(characterName);
      }
    } else if (target.classList.contains('character-highlight')) {
      const characterName = target.getAttribute('data-character');
      if (characterName && onCharacterNameClick) {
        onCharacterNameClick(characterName);
      }
    }
  };

  // Determine which text to display and highlight
  const displayText = eyeMode && currentTranslation ? currentTranslation : text;
  const highlightedText = highlightMatchingText(displayText);
  
  /**
   * Extract character names from text for placeholder suggestions
   * Detects patterns like "Slow Ass", "Trusty Ass", etc.
   * Also detects shortened names like "Trusty", "Thirsty"
   */
  const extractCharacterNames = (text: string): string[] => {
    if (!text) return [];
    
    const names = new Set<string>();
    
    // Pattern to match "Word Ass" character names
    const fullNamePattern = /\b(\w+\s+Ass)\b/gi;
    const fullMatches = text.match(fullNamePattern) || [];
    fullMatches.forEach(match => names.add(match.trim()));
    
    // Pattern to match potential shortened character names
    // Look for capitalized words that could be character names
    const shortNamePattern = /\b([A-Z][a-z]+(?:'s)?)\b/g;
    const shortMatches = text.match(shortNamePattern) || [];
    
    // Check if these shortened names have corresponding character data
    shortMatches.forEach(match => {
      const cleanMatch = match.replace(/'s$/, ''); // Remove possessive 's
      const characterMatches = findCharacterMatches(cleanMatch);
      
      // If we find character data for this name, include it
      if (characterMatches.length > 0) {
        names.add(cleanMatch);
      }
      
      // Also check if it could be a shortened version of a "Word Ass" name
      const possibleFullName = `${cleanMatch} Ass`;
      if (text.toLowerCase().includes(possibleFullName.toLowerCase()) || 
          findCharacterMatches(possibleFullName).length > 0) {
        names.add(possibleFullName);
      }
    });
    
    return Array.from(names);
  };

  /**
   * Extract individual words/phrases that have translations
   * Creates specific suggestions for each highlighted element
   */
  const extractTranslationSuggestions = (text: string) => {
    const suggestions = new Map<string, any>();
    
    // Get all matches from different sources
    const jsonMatches = jsonData ? findJsonMatches(text) : [];
    const xlsxMatches = xlsxData ? findXlsxMatches(text) : [];
    const charMatches = findCharacterMatches(text);
    
    // Process JSON matches
    jsonMatches.forEach(match => {
      if (match.translatedDutch && match.translatedDutch.trim()) {
        suggestions.set(match.sourceEnglish, {
          source: match.sourceEnglish,
          translation: match.translatedDutch,
          type: 'json'
        });
      }
    });
    
    // Process XLSX matches
    xlsxMatches.forEach(match => {
      if (match.translatedDutch && match.translatedDutch.trim()) {
        suggestions.set(match.sourceEnglish, {
          source: match.sourceEnglish,
          translation: match.translatedDutch,
          type: 'xlsx'
        });
      }
    });
    
    // Process character matches
    charMatches.forEach(match => {
      if (match.dutch && match.dutch.trim()) {
        suggestions.set(match.english, {
          source: match.english,
          translation: match.dutch,
          type: 'character'
        });
      }
    });
    
    return Array.from(suggestions.values());
  };

  // Get suggestions for the current text (always available, controlled by showSuggestions prop)
  const jsonSuggestions = jsonData ? findJsonMatches(displayText) : [];
  const xlsxSuggestions = xlsxData ? findXlsxMatches(displayText) : [];
  const characterNames = extractCharacterNames(displayText);
  const translationSuggestions = extractTranslationSuggestions(displayText);
  
  // Combine all suggestions
  const allSuggestions = [...jsonSuggestions, ...xlsxSuggestions];

  return (
    <div className={className} style={style}>
      <div
        dangerouslySetInnerHTML={{ __html: highlightedText }}
        onClick={handleTextClick}
      />
      
      {/* Suggestion buttons - controlled by showSuggestions prop */}
      {showSuggestions && (translationSuggestions.length > 0 || characterNames.length > 0) && onSuggestionClick && !className.includes('opacity-70') && !className.includes('no-suggestions') && (
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Character placeholder buttons (orange/wire color) */}
          {characterNames.map((characterName, index) => (
            <button
              key={`placeholder-${index}`}
              onClick={() => onSuggestionClick(`(${characterName})`)}
              className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600 hover:bg-orange-200 dark:hover:bg-orange-700 transition-colors duration-200 font-medium"
              title={`Insert placeholder: (${characterName})`}
              style={{ borderRadius: '3px' }}
            >
              ({characterName})
            </button>
          ))}
          
          {/* Individual word/phrase translation buttons (green for available translations) */}
          {translationSuggestions.map((suggestion, index) => (
            <button
              key={`word-translation-${index}`}
              onClick={() => onSuggestionClick(suggestion.translation)}
              className={`px-3 py-1 text-sm transition-colors duration-200 font-medium ${
                suggestion.type === 'character' 
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700'
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