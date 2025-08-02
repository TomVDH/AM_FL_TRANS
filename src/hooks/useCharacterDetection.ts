import { useState, useCallback } from 'react';

export interface CharacterDetectionState {
  // Character detection state
  detectedCharacters: string[];
  showCharacterButtons: boolean;
  
  // Setters
  setDetectedCharacters: (characters: string[]) => void;
  setShowCharacterButtons: (show: boolean) => void;
  
  // Functions
  detectAssCharacters: (text: string) => string[];
  insertCharacterName: (characterName: string, currentTranslation: string, setCurrentTranslation: (translation: string | ((prev: string) => string)) => void, textareaRef: React.RefObject<HTMLTextAreaElement>) => void;
  highlightMatchingText: (text: string, searchTerm: string) => string;
}

/**
 * Character Detection Hook
 * 
 * Manages character name detection and insertion functionality:
 * - Character name detection from text
 * - Character button display and management
 * - Character name insertion into translation
 * - Text highlighting for character matches
 * 
 * @returns Character detection state and functions
 */
export const useCharacterDetection = (): CharacterDetectionState => {
  // ========== Character Detection State ==========
  const [detectedCharacters, setDetectedCharacters] = useState<string[]>([]);
  const [showCharacterButtons, setShowCharacterButtons] = useState(false);
  
  // ========== Character Detection Functions ==========
  
  /**
   * Detect character names from text using pattern matching
   * 
   * Analyzes text to find character names that match the game's naming patterns.
   * Looks for patterns like "CharacterName:" or "CharacterName." at the beginning of lines.
   * 
   * @param text - The text to analyze for character names
   * @returns Array of detected character names
   */
  const detectAssCharacters = useCallback((text: string): string[] => {
    if (!text) return [];
    
    const lines = text.split('\n');
    const characters: string[] = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Pattern 1: "CharacterName:" at start of line
      const colonMatch = trimmedLine.match(/^([A-Z][a-zA-Z\s]+):/);
      if (colonMatch) {
        const characterName = colonMatch[1].trim();
        if (characterName && !characters.includes(characterName)) {
          characters.push(characterName);
        }
      }
      
      // Pattern 2: "CharacterName." at start of line
      const dotMatch = trimmedLine.match(/^([A-Z][a-zA-Z\s]+)\./);
      if (dotMatch) {
        const characterName = dotMatch[1].trim();
        if (characterName && !characters.includes(characterName)) {
          characters.push(characterName);
        }
      }
      
      // Pattern 3: "CharacterName" followed by dialogue
      const dialogueMatch = trimmedLine.match(/^([A-Z][a-zA-Z\s]+)\s+["""]/);
      if (dialogueMatch) {
        const characterName = dialogueMatch[1].trim();
        if (characterName && !characters.includes(characterName)) {
          characters.push(characterName);
        }
      }
    });
    
    return characters;
  }, []);
  
  /**
   * Insert character name into translation at cursor position
   * 
   * Inserts a character name at the current cursor position in the translation textarea.
   * Maintains cursor position and focuses the textarea after insertion.
   * 
   * @param characterName - The character name to insert
   * @param currentTranslation - Current translation text
   * @param setCurrentTranslation - Function to update translation state
   * @param textareaRef - Reference to the translation textarea
   */
  const insertCharacterName = useCallback((
    characterName: string,
    currentTranslation: string,
    setCurrentTranslation: (translation: string | ((prev: string) => string)) => void,
    textareaRef: React.RefObject<HTMLTextAreaElement>
  ) => {
    const textarea = textareaRef.current;
    
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const before = currentTranslation.slice(0, cursorPos);
      const after = currentTranslation.slice(cursorPos);
      const newText = before + characterName + after;
      
      setCurrentTranslation(newText);
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        if (textarea) {
          const newCursorPos = cursorPos + characterName.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    } else {
      // Fallback: append to the end if textarea ref is not available
      setCurrentTranslation(currentTranslation + characterName);
    }
  }, []);
  
  /**
   * Highlight matching text in character names
   * 
   * Wraps matching text in HTML span tags for visual highlighting.
   * Used for highlighting character names that match search terms.
   * 
   * @param text - The text to highlight
   * @param searchTerm - The search term to highlight
   * @returns Text with highlighted matches
   */
  const highlightMatchingText = useCallback((text: string, searchTerm: string): string => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200 dark:bg-yellow-800">$1</span>');
  }, []);
  
  return {
    // State
    detectedCharacters,
    showCharacterButtons,
    
    // Setters
    setDetectedCharacters,
    setShowCharacterButtons,
    
    // Functions
    detectAssCharacters,
    insertCharacterName,
    highlightMatchingText,
  };
}; 