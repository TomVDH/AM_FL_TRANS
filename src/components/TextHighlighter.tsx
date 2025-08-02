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
  className?: string;
  style?: React.CSSProperties;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  jsonData,
  highlightMode,
  eyeMode,
  currentTranslation,
  onCharacterClick,
  className = '',
  style = {}
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
    
    // Only highlight if highlighting is enabled
    if (highlightMode) {
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
          `<span class="json-highlight" data-hover="${hoverText}" style="cursor: pointer; color: #3B82F6; font-weight: 500;" title="${hoverText}">$1</span>`
        );
      });
    } else {
      console.log('🎨 TextHighlighter Debug: Highlight mode is OFF');
    }
    
    // Make **Ass characters clickable
    assCharacters.forEach(character => {
      const regex = new RegExp(`(${character})`, 'gi');
      // Only apply clickable style if highlighting is enabled
      if (highlightMode) {
        highlightedText = highlightedText.replace(regex, 
          '<span class="clickable-character" data-character="$1" style="cursor: pointer; color: #3B82F6; font-weight: 500;">$1</span>'
        );
      } else {
        // When highlighting is off, still make clickable but without blue color
        highlightedText = highlightedText.replace(regex, 
          '<span class="clickable-character" data-character="$1" style="cursor: pointer;">$1</span>'
        );
      }
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

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: highlightedText }}
      onClick={handleTextClick}
    />
  );
};

export default TextHighlighter; 