import React from 'react';

/**
 * TextHighlighter Component
 * 
 * Handles all text highlighting functionality including:
 * - Character detection and highlighting
 * - Codex entry matching and highlighting
 * - Clickable character insertion
 * - Highlight mode toggling
 * 
 * FUTURE REFACTORING OPPORTUNITIES:
 * ====================================
 * 
 * 1. CHARACTER DETECTION MODULE
 *    - Extract character detection logic to separate hook
 *    - Create: useCharacterDetection hook
 *    - Functions to extract: detectAssCharacters, validateCharacterNames
 * 
 * 2. CODEX MATCHING MODULE
 *    - Extract codex matching logic to separate hook
 *    - Create: useCodexMatching hook
 *    - Functions to extract: getMatchingCodexEntries, matchCodexPatterns
 * 
 * 3. HIGHLIGHT RENDERING MODULE
 *    - Extract highlight rendering logic to separate component
 *    - Create: HighlightRenderer component
 *    - Functions to extract: renderHighlights, applyHighlightStyles
 * 
 * @component
 */
interface TextHighlighterProps {
  text: string;
  codexData: any;
  highlightMode: boolean;
  eyeMode: boolean;
  currentTranslation: string;
  onCharacterClick: (characterName: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  codexData,
  highlightMode,
  eyeMode,
  currentTranslation,
  onCharacterClick,
  className = '',
  style = {}
}) => {
  /**
   * Check if text matches any codex entries using flexible matching
   * 
   * This function implements two matching strategies:
   * 1. Direct substring matching - for exact name matches
   * 2. Regex-based flexible matching - for hyphenated entries like "butte-mines"
   *    matching text like "Butte Industry Coal Mines"
   * 
   * @param text - The source text to search for codex matches
   * @returns Array of matching codex entries with title, content, and category
   */
  const getMatchingCodexEntries = (text: string) => {
    if (!codexData || !text) return [];
    
    const matches: Array<{title: string, content: string, category: string}> = [];
    
    // Recursively search through all codex categories and entries
    const searchEntries = (entries: any[]) => {
      entries.forEach(entry => {
        if (entry.title && typeof entry.title === 'string') {
          const title = entry.title.toLowerCase();
          const searchText = text.toLowerCase();
          
          // Direct substring match
          if (searchText.includes(title) || title.includes(searchText)) {
            matches.push({
              title: entry.title,
              content: entry.content || '',
              category: entry.category || 'Unknown'
            });
          } else {
            // Flexible regex matching for hyphenated entries
            const hyphenatedTitle = title.replace(/-/g, '\\s*[-\\s]*');
            const regex = new RegExp(hyphenatedTitle, 'i');
            if (regex.test(searchText)) {
              matches.push({
                title: entry.title,
                content: entry.content || '',
                category: entry.category || 'Unknown'
              });
            }
          }
        }
        
        // Recursively search nested entries
        if (entry.entries && Array.isArray(entry.entries)) {
          searchEntries(entry.entries);
        }
      });
    };
    
    // Search through all codex data
    Object.values(codexData).forEach((category: any) => {
      if (category.entries && Array.isArray(category.entries)) {
        searchEntries(category.entries);
      }
    });
    
    return matches;
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
   * Highlight matching text and add clickable character names
   * 
   * This function combines character detection and codex highlighting
   * to create rich, interactive text with clickable elements
   * 
   * @param text - The text to highlight
   * @returns HTML string with highlighted and clickable elements
   */
  const highlightMatchingText = (text: string) => {
    if (!codexData) return text;
    
    const matches = getMatchingCodexEntries(text);
    const assCharacters = detectAssCharacters(text);
    
    let highlightedText = text;
    
    // Only highlight the exact matched phrases from codex entries if highlighting is enabled
    if (highlightMode) {
      // Sort matches by length (longest first) to handle overlapping matches properly
      const sortedMatches = [...matches].sort((a, b) => b.title.length - a.title.length);
      
      sortedMatches.forEach(match => {
        // Escape special regex characters in the title
        const escapedTitle = match.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escapedTitle})\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, '<span class="glow-text">$1</span>');
      });
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