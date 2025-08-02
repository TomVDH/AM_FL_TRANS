import React from 'react';
import { useJsonHighlighting } from '../hooks/useJsonHighlighting';

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
  jsonData: any;
  highlightMode: boolean;
  eyeMode: boolean;
  currentTranslation: string;
  onCharacterClick: (characterName: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
  style?: React.CSSProperties;
  showSuggestions?: boolean;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  jsonData,
  highlightMode,
  eyeMode,
  currentTranslation,
  onCharacterClick,
  onSuggestionClick,
  className = '',
  style = {},
  showSuggestions = true
}) => {
  // Use JSON highlighting hook
  const { findJsonMatches, getHoverText } = useJsonHighlighting(jsonData);

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
    console.log('🎨 TextHighlighter Debug: highlightMode:', highlightMode);
    
    if (!jsonData) {
      console.log('🎨 TextHighlighter Debug: No jsonData, returning original text');
      return text;
    }
    
    const matches = findJsonMatches(text);
    const assCharacters = detectAssCharacters(text);
    
    console.log('🎨 TextHighlighter Debug: Found JSON matches:', matches.length);
    console.log('🎨 TextHighlighter Debug: Found Ass characters:', assCharacters.length);
    
    let highlightedText = text;
    
    // Always highlight (blue highlights always on)
    console.log('🎨 TextHighlighter Debug: Highlight mode is ON');
    
    // Sort matches by length (longest first) to handle overlapping matches properly
    const sortedMatches = [...matches].sort((a, b) => b.sourceEnglish.length - a.sourceEnglish.length);
    
    sortedMatches.forEach(match => {
      console.log('🎨 TextHighlighter Debug: Processing match:', match.sourceEnglish);
      
      // Escape special regex characters in the sourceEnglish
      const escapedSource = match.sourceEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedSource})\\b`, 'gi');
      
      // Create hover text
      const hoverText = getHoverText(match);
      
      console.log('🎨 TextHighlighter Debug: Replacing with hover text:', hoverText);
      
      // Replace with highlighted span that has hover functionality
      highlightedText = highlightedText.replace(regex, 
        `<span class="json-highlight" data-hover="${hoverText}" style="cursor: pointer; color: #2563EB; font-weight: 600; text-shadow: 0 0 4px rgba(37, 99, 235, 0.3);" title="${hoverText}">$1</span>`
      );
    });
    
    // Make **Ass characters clickable (always blue)
    assCharacters.forEach(character => {
      const regex = new RegExp(`(${character})`, 'gi');
      highlightedText = highlightedText.replace(regex, 
        '<span class="clickable-character" data-character="$1" style="cursor: pointer; color: #2563EB; font-weight: 600; text-shadow: 0 0 4px rgba(37, 99, 235, 0.3);">$1</span>'
      );
    });
    
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
    }
  };

  // Determine which text to display and highlight
  const displayText = eyeMode && currentTranslation ? currentTranslation : text;
  const highlightedText = highlightMatchingText(displayText);
  
  // Get suggestions for the current text (always available, controlled by showSuggestions prop)
  const suggestions = jsonData ? findJsonMatches(displayText) : [];

  return (
    <div className={className} style={style}>
      <div
        dangerouslySetInnerHTML={{ __html: highlightedText }}
        onClick={handleTextClick}
      />
      
      {/* Suggestion buttons - controlled by showSuggestions prop */}
      {showSuggestions && suggestions.length > 0 && onSuggestionClick && !className.includes('opacity-70') && !className.includes('no-suggestions') && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.translatedDutch)}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
              title={`Insert: ${suggestion.translatedDutch}`}
            >
              {suggestion.translatedDutch || suggestion.sourceEnglish}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default TextHighlighter; 