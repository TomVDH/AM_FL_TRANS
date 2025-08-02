'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useDisplayModes } from '../hooks/useDisplayModes';
import { useJsonMode } from '../hooks/useJsonMode';
import { useReferenceColumn as useReferenceColumnHook } from '../hooks/useReferenceColumn';
import SetupWizard from './SetupWizard';
import CodexPanel from './CodexPanel';

/**
 * TranslationHelper Component
 * 
 * A comprehensive translation assistance tool designed for the AM Translations project.
 * Features include:
 * - Excel file upload and parsing for bulk translation workflows
 * - Manual text input mode for individual translations
 * - Dark mode support with full UI responsiveness
 * - Gamepad/dialogue box mode with pixel art styling
 * - Codex integration for character and lore reference
 * - Real-time character name detection and insertion
 * - Progress tracking and navigation controls
 * 
 * FUTURE REFACTORING OPPORTUNITIES:
 * ====================================
 * 
 * 1. EXCEL PROCESSING MODULE
 *    - Extract Excel file handling, parsing, and data extraction logic
 *    - Create: useExcelProcessor hook + ExcelProcessor component
 *    - State to extract: excelSheets, selectedSheet, workbookData, sourceColumn, etc.
 * 
 * 2. TRANSLATION WORKFLOW MODULE
 *    - Extract translation session management and navigation
 *    - Create: useTranslationWorkflow hook + TranslationWorkflow component
 *    - State to extract: sourceTexts, translations, currentIndex, currentTranslation
 * 
 * 3. CODEX INTEGRATION MODULE
 *    - Extract codex data fetching, matching, and UI rendering
 *    - Create: useCodexIntegration hook + CodexPanel component
 *    - State to extract: codexData, accordionStates, expandedItems, isLoadingCodex
 * 
 * 4. CHARACTER DETECTION MODULE
 *    - Extract character name detection and insertion logic
 *    - Create: useCharacterDetection hook + CharacterButtons component
 *    - Functions to extract: detectAssCharacters, insertCharacterName, highlightMatchingText
 * 
 * 5. DISPLAY MODES MODULE
 *    - Extract dark mode, gamepad mode, and visual state management
 *    - Create: useDisplayModes hook + DisplayModeControls component
 *    - State to extract: darkMode, gamepadMode, eyeMode, highlightMode
 * 
 * 6. DIALOGUE BOX MODULE
 *    - Extract pixel art dialogue box rendering and styling
 *    - Create: DialogueBox component with gamepad mode styling
 *    - Functions to extract: dialogue rendering logic, pixel font styling
 * 
 * 7. PROGRESS TRACKING MODULE
 *    - Extract progress calculation and navigation controls
 *    - Create: useProgressTracking hook + ProgressControls component
 *    - State to extract: progress calculation, jump navigation
 * 
 * 8. EXPORT FUNCTIONALITY MODULE
 *    - Extract clipboard copying and export logic
 *    - Create: useExportFunctionality hook + ExportControls component
 *    - Functions to extract: copyToClipboard, getCellLocation
 * 
 * 9. SETUP WIZARD MODULE
 *    - Extract initial setup and configuration UI
 *    - Create: SetupWizard component with step-by-step configuration
 *    - State to extract: inputMode, Excel configuration, manual input setup
 * 
 * 10. ANIMATION MODULE
 *     - Extract transition animations and visual effects
 *     - Create: useAnimations hook + AnimationProvider component
 *     - State to extract: isAnimating, gradientColors, showCopied
 * 
 * @component
 */
const TranslationHelper: React.FC = () => {
  // ========== Core Translation State ==========
  // FUTURE SPLIT: TRANSLATION WORKFLOW MODULE
  // This state block should be extracted to useTranslationWorkflow hook
  // Components to create: TranslationWorkflow, TranslationSession
  // State management: sourceTexts, utterers, translations, currentIndex, currentTranslation
  const [sourceTexts, setSourceTexts] = useState<string[]>([]);        // Array of source texts to translate
  const [utterers, setUtterers] = useState<string[]>([]);              // Speaker/character names for each text
  const [translations, setTranslations] = useState<string[]>([]);      // User's translations
  const [currentIndex, setCurrentIndex] = useState(0);                 // Current position in translation array
  const [currentTranslation, setCurrentTranslation] = useState('');    // Active translation being edited
  
  // ========== Excel Configuration State ==========
  // FUTURE SPLIT: EXCEL PROCESSING MODULE
  // This state block should be extracted to useExcelProcessor hook
  // Components to create: ExcelProcessor, ExcelConfiguration, ExcelUploader
  // State management: cellStart, excelSheets, selectedSheet, sourceColumn, uttererColumn, referenceColumn, useReferenceColumn, startRow, workbookData
  const [cellStart, setCellStart] = useState('A1');                    // Starting cell for export
  const [excelSheets, setExcelSheets] = useState<string[]>([]);        // Available sheets in uploaded Excel
  const [selectedSheet, setSelectedSheet] = useState('');              // Currently selected sheet
  const [sourceColumn, setSourceColumn] = useState('C');               // Column containing source text
  const [uttererColumn, setUttererColumn] = useState('A');             // Column containing speaker names
  // ========== Reference Column State ==========
  // FUTURE SPLIT: REFERENCE PROCESSING MODULE
  // This state block has been extracted to useReferenceColumn hook
  // Components to create: ReferenceProcessor, ReferenceConfiguration, ReferenceValidator
  // State management: referenceColumn, useReferenceColumn, referenceData, referenceValidation
  const {
    referenceColumn,
    useReferenceColumn,
    setReferenceColumn,
    setUseReferenceColumn,
    resetReferenceColumn,
    processReferenceData,
    initializeTranslationsWithReference,
  } = useReferenceColumnHook();
  const [startRow, setStartRow] = useState(3);                         // Starting row for data extraction
  const [workbookData, setWorkbookData] = useState<XLSX.WorkBook | null>(null); // Parsed Excel workbook
  
  // ========== UI State Management ==========
  // FUTURE SPLIT: ANIMATION MODULE + SETUP WIZARD MODULE
  // Animation state should be extracted to useAnimations hook
  // Setup state should be extracted to useSetupWizard hook
  // Components to create: AnimationProvider, SetupWizard, SessionManager
  // State management: isStarted, isAnimating, showCopied, inputMode, gradientColors, isTranslating
  const [isStarted, setIsStarted] = useState(false);                   // Translation session active flag
  const [isAnimating, setIsAnimating] = useState(false);               // Animation state for transitions
  const [showCopied, setShowCopied] = useState(false);                 // Copy confirmation indicator
  const [inputMode, setInputMode] = useState<'excel' | 'manual'>('excel'); // Input mode selection
  const [gradientColors, setGradientColors] = useState<string[]>([]);  // Dynamic gradient colors
  const [isTranslating, setIsTranslating] = useState(false);           // Translation in progress flag
  
  // ========== Display Mode State ==========
  // ✅ REFACTORED: Successfully extracted to useDisplayModes hook
  // This demonstrates the first step of component modularization
  // Benefits: Centralized state management, reusable across components
  const {
    darkMode,
    eyeMode,
    highlightMode,
    gamepadMode,
    toggleDarkMode,
    toggleEyeMode,
    toggleHighlightMode,
    toggleGamepadMode,
  } = useDisplayModes();
  
  // ========== Navigation State ==========
  // FUTURE SPLIT: PROGRESS TRACKING MODULE
  // This state block should be extracted to useProgressTracking hook
  // Components to create: ProgressControls, NavigationPanel, JumpToInput
  // State management: showJumpInput, jumpValue, showVersionHash
  const [showJumpInput, setShowJumpInput] = useState(false);           // Show jump-to navigation
  const [jumpValue, setJumpValue] = useState('');                      // Jump input value
  const [showVersionHash, setShowVersionHash] = useState(false);       // Display version info
  
  // ========== JSON Mode State ==========
  // ✅ REFACTORED: Extracted to useJsonMode hook
  const {
    jsonMode,
    selectedJsonFile,
    selectedJsonSheet,
    jsonSearchTerm,
    jsonData,
    availableJsonFiles,
    globalSearch,
    setSelectedJsonSheet,
    setJsonSearchTerm,
    setGlobalSearch,
    loadJsonData,
    toggleJsonMode,
    clearJsonMode,
    getFilteredEntries,
    getAvailableSheets,
  } = useJsonMode();
  
  // ========== Component References ==========
  const fileInputRef = useRef<HTMLInputElement>(null);                 // File input element reference
  const textareaRef = useRef<HTMLTextAreaElement>(null);              // Textarea element reference
  
  // ========== Version Control ==========
  const VERSION_HASH = 'v2.3.0';                                       // Application version identifier
  
  // ========== Codex Integration State ==========
  // FUTURE SPLIT: CODEX INTEGRATION MODULE
  // This state block should be extracted to useCodexIntegration hook
  // Components to create: CodexPanel, CodexAccordion, CodexDataProvider
  // State management: accordionStates, codexData, expandedItems, isLoadingCodex
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({}); // Accordion UI states
  const [codexData, setCodexData] = useState<any>(null);               // Loaded codex reference data
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set()); // Expanded codex items
  const [isLoadingCodex, setIsLoadingCodex] = useState(false);         // Codex loading state
  
  // ========== Computed Values ==========
  const progress = sourceTexts.length > 0 ? ((currentIndex) / sourceTexts.length) * 100 : 0;

  /**
   * Fetch codex data on component mount
   * Loads character and lore reference data from the API
   * 
   * FUTURE SPLIT: CODEX INTEGRATION MODULE
   * This useEffect should be extracted to useCodexIntegration hook
   * Function to extract: fetchCodexData
   * Dependencies: codexData, isLoadingCodex state
   */
  useEffect(() => {
    const fetchCodexData = async () => {
      setIsLoadingCodex(true);
      try {
        const response = await fetch('/api/codex');
        if (response.ok) {
          const data = await response.json();
          setCodexData(data);
        }
      } catch (error) {
        // Silently handle codex loading errors
      } finally {
        setIsLoadingCodex(false);
      }
    };

    fetchCodexData();
  }, []);



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
   * 
   * FUTURE SPLIT: CODEX INTEGRATION MODULE
   * This function should be extracted to useCodexIntegration hook
   * Related functions: categoryHasMatches, renderCodexItems
   * Dependencies: codexData state
   */
  const getMatchingCodexEntries = (text: string) => {
    if (!codexData || !text) return [];
    
    const matches: Array<{title: string, content: string, category: string}> = [];
    const textLower = text.toLowerCase();
    
    Object.entries(codexData).forEach(([category, entries]: [string, any]) => {
      if (Array.isArray(entries)) {
        entries.forEach((entry: any) => {
          if (entry.name) {
            const entryNameLower = entry.name.toLowerCase();
            
            // Direct match - full phrase must appear
            if (textLower.includes(entryNameLower)) {
              matches.push({
                title: entry.name,
                content: entry.content || '',
                category: category
              });
            }
          }
        });
      }
    });
    
    return matches;
  };

  // Function to check if a category has matching entries
  const categoryHasMatches = (category: string) => {
    const matches = getMatchingCodexEntries(sourceTexts[currentIndex] || '');
    return matches.some(match => match.category === category);
  };

  /**
   * Detect "Ass" characters in text
   * 
   * Special pattern matching for the AM Translations project's character naming
   * convention where many characters have names ending in "Ass" (e.g., "Big Ass", "Smart Ass").
   * This is project-specific functionality for the donkey-themed translation work.
   * 
   * @param text - Source text to search for character names
   * @returns Array of unique character names matching the pattern
   */
  const detectAssCharacters = (text: string) => {
    const assPattern = /\b\w+\s+Ass\b/gi;  // Matches "[Word] Ass" pattern
    const matches = text.match(assPattern);
    return matches ? Array.from(new Set(matches)) : [];
  };

  /**
   * Extract clean speaker name from utterer string
   * 
   * Parses complex utterer strings from the game data format to extract
   * human-readable speaker names for the dialogue box display.
   * 
   * @param utterer - Raw utterer string (e.g., "SAY.Sign_TheMines_Dirty.1.Dirty Sign")
   * @returns Extracted speaker name (e.g., "Dirty Sign") or fallback "Speaker"
   * 
   * @example
   * extractSpeakerName("SAY.Sign_TheMines_Dirty.1.Dirty Sign") // returns "Dirty Sign"
   * extractSpeakerName("SAY.NPC_Miner.2.Old Miner") // returns "Old Miner"
   */
  const extractSpeakerName = (utterer: string): string => {
    if (!utterer) return 'Speaker';
    
    // Pattern: "SAY.Sign_TheMines_Dirty.1.Dirty Sign" -> "Dirty Sign"
    const parts = utterer.split('.');
    if (parts.length >= 4) {
      return parts[3]; // Return the last part after the last dot
    }
    
    // Fallback: return the original utterer if pattern doesn't match
    return utterer;
  };

  // Function to insert character name in parentheses
  // FUTURE SPLIT: CHARACTER DETECTION MODULE
  // This function should be extracted to useCharacterDetection hook
  // Related functions: detectAssCharacters, highlightMatchingText
  // Components to create: CharacterButtons, CharacterInsertion
  // Dependencies: currentTranslation state, textareaRef
  const insertCharacterName = (characterName: string) => {
    const parenthesesName = `(${characterName})`;
    const textarea = textareaRef.current;
    
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const before = currentTranslation.slice(0, cursorPos);
      const after = currentTranslation.slice(cursorPos);
      const newText = before + parenthesesName + after;
      
      setCurrentTranslation(newText);
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        if (textarea) {
          const newCursorPos = cursorPos + parenthesesName.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    } else {
      // Fallback: append to the end if textarea ref is not available
      setCurrentTranslation(prev => prev + parenthesesName);
    }
  };

  // Function to highlight matching text and add clickable character names
  // FUTURE SPLIT: CHARACTER DETECTION MODULE + CODEX INTEGRATION MODULE
  // This function combines character detection and codex highlighting
  // Should be split between useCharacterDetection and useCodexIntegration hooks
  // Components to create: TextHighlighter, CharacterHighlighter, CodexHighlighter
  // Dependencies: codexData, highlightMode state, getMatchingCodexEntries, detectAssCharacters
  const highlightMatchingText = (text: string) => {
    if (!codexData) return text;
    
    const matches = getMatchingCodexEntries(text);
    const assCharacters = detectAssCharacters(text);
    
    let highlightedText = text;
    
    // Track what's already been highlighted to avoid duplicates
    const highlightedRanges: Array<{start: number, end: number}> = [];
    
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

  // Function to toggle expanded items
  // FUTURE SPLIT: CODEX INTEGRATION MODULE
  // This function should be extracted to useCodexIntegration hook
  // Components to create: CodexAccordion, CodexItemExpander
  // Dependencies: expandedItems state
  const toggleExpandedItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Function to toggle accordion states
  // FUTURE SPLIT: CODEX INTEGRATION MODULE
  // This function should be extracted to useCodexIntegration hook
  // Components to create: CodexAccordion, CodexCategoryToggler
  // Dependencies: accordionStates state
  const toggleAccordion = (category: string) => {
    setAccordionStates(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Helper function to render expandable codex items
  // FUTURE SPLIT: CODEX INTEGRATION MODULE
  // This function should be extracted to useCodexIntegration hook
  // Components to create: CodexItemRenderer, CodexCategoryRenderer
  // Dependencies: codexData, accordionStates, expandedItems state
  const renderCodexItems = (category: string, categoryKey: string) => {
    if (isLoadingCodex) {
      return <div className="text-center py-4 text-gray-500">Loading codex data...</div>;
    }
    
    if (!codexData || !codexData[categoryKey]) {
      return <div className="text-gray-500">No codex data available</div>;
    }
    
    return codexData[categoryKey].map((entry: any, index: number) => (
      <div key={`${categoryKey}-${index}`} className="border border-gray-200 dark:border-gray-600 rounded" style={{ borderRadius: '3px' }}>
        <button
          onClick={() => toggleExpandedItem(`${categoryKey}-${index}`)}
          className="w-full p-3 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-900 dark:text-gray-100"
        >
          <span className={`font-medium ${getMatchingCodexEntries(sourceTexts[currentIndex] || '').some(m => m.title === entry.name) ? 'glow-text' : ''}`}>
            {entry.name}
          </span>
          <svg className={`w-4 h-4 transform transition-transform duration-200 ${expandedItems.has(`${categoryKey}-${index}`) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedItems.has(`${categoryKey}-${index}`) && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-gray-100">{entry.content}</pre>
            </div>
          </div>
        )}
      </div>
    ));
  };

  // Generate random gradient colors - expanded palette
  // FUTURE SPLIT: ANIMATION MODULE
  // This function should be extracted to useAnimations hook
  // Components to create: AnimationProvider, GradientGenerator
  // Dependencies: gradientColors state
  const generateGradientColors = (): string[] => {
    const colorPalettes = [
      // Original palettes
      ['#FF6B6B', '#4ECDC4', '#45B7D1'], // Coral to Teal
      ['#9B59B6', '#3498DB', '#E74C3C'], // Purple to Blue to Red
      ['#F39C12', '#E67E22', '#E74C3C'], // Orange gradient
      ['#1ABC9C', '#3498DB', '#9B59B6'], // Teal to Blue to Purple
      ['#E74C3C', '#F39C12', '#F1C40F'], // Red to Orange to Yellow
      ['#2ECC71', '#27AE60', '#16A085'], // Green gradient
      ['#3498DB', '#2980B9', '#8E44AD'], // Blue to Purple
      ['#E67E22', '#D35400', '#C0392B'], // Orange to Red
      
      // New vibrant palettes
      ['#FF006E', '#8338EC', '#3A86FF'], // Hot Pink to Blue
      ['#06FFA5', '#FFBE0B', '#FB5607'], // Mint to Orange
      ['#7209B7', '#560BAD', '#480CA8'], // Deep Purple Spectrum
      ['#F72585', '#B5179E', '#7209B7'], // Magenta to Purple
      ['#4361EE', '#4895EF', '#4CC9F0'], // Blue Gradient
      ['#F94144', '#F3722C', '#F8961E'], // Warm Red Orange
      ['#90BE6D', '#43AA8B', '#277DA1'], // Forest to Ocean
      ['#003049', '#D62828', '#F77F00'], // Navy to Orange
      
      // Pastel palettes
      ['#FFB5E8', '#FF9CEE', '#FFB5E8'], // Pink Pastel
      ['#B5DEFF', '#CAB8FF', '#FFA3CF'], // Sky to Pink Pastel
      ['#FCC8D1', '#FFC8A2', '#FFFAE3'], // Peach Cream
      ['#D0F4DE', '#A9F1DF', '#BBEDD9'], // Mint Pastel
      ['#C589E8', '#F0B7D8', '#FFCCE7'], // Lavender Pink
      
      // Neon palettes
      ['#08F7FE', '#09FBD3', '#FE53BB'], // Cyan to Pink Neon
      ['#F5D300', '#F201B1', '#6A00F5'], // Yellow to Purple Neon
      ['#00FFFF', '#00FF00', '#FFFF00'], // Cyan Lime Yellow
      ['#FF1744', '#FF6D00', '#FFD600'], // Red Orange Yellow Neon
      ['#D500F9', '#651FFF', '#00E5FF'], // Purple to Cyan Neon
      
      // Earth tones
      ['#8B4513', '#CD853F', '#DEB887'], // Brown to Tan
      ['#556B2F', '#6B8E23', '#8FBC8F'], // Olive Green
      ['#704214', '#A0522D', '#D2691E'], // Deep Brown to Chocolate
      ['#2F4F4F', '#696969', '#778899'], // Dark Slate Gray
      
      // Monochromatic variations
      ['#000428', '#004E92', '#007CC7'], // Deep Blue Mono
      ['#0F0C29', '#302B63', '#24243E'], // Midnight Purple
      ['#232526', '#414345', '#5C5C5C'], // Charcoal Gray
      ['#1C1C1C', '#383838', '#545454'], // Black to Gray
      
      // Sunset/Sunrise palettes
      ['#FF5E5B', '#FF8C42', '#FFD23F'], // Sunset Orange
      ['#540D6E', '#EE4266', '#FFD23F'], // Purple to Yellow Sunset
      ['#1A0033', '#7B2869', '#EFC3E6'], // Night to Dawn
      ['#FF4E50', '#FC913A', '#F9D62E'], // Warm Sunset
      
      // Ocean palettes
      ['#005F73', '#0A9396', '#94D2BD'], // Deep Ocean
      ['#03045E', '#023E8A', '#0077B6'], // Navy Blues
      ['#002855', '#0353A4', '#006DAA'], // Ocean Depths
      ['#1E6091', '#168AAD', '#52B69A'], // Sea Foam
      
      // Metallic palettes
      ['#B7B7A4', '#A5A58D', '#6B705C'], // Silver Tones
      ['#FFD700', '#FFA500', '#FF8C00'], // Gold Gradient
      ['#C0C0C0', '#808080', '#696969'], // Silver to Gray
      ['#B87333', '#CD7F32', '#DAA520'], // Copper Bronze
    ];
    return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  };

  // Initialize gradient colors on mount
  useEffect(() => {
    setGradientColors(generateGradientColors());
  }, []);



  // FUTURE SPLIT: EXCEL PROCESSING MODULE
  // This function should be extracted to useExcelProcessor hook
  // Components to create: ExcelUploader, ExcelFileProcessor
  // Dependencies: workbookData, excelSheets, selectedSheet state
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (!result) return;
        
        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        setWorkbookData(workbook);
        setExcelSheets(workbook.SheetNames);
        if (workbook.SheetNames.length > 0) {
          setSelectedSheet(workbook.SheetNames[0]);
        }
          } catch (error) {
      alert('Error reading Excel file. Please ensure it\'s a valid Excel file.');
    }
    };
    reader.readAsArrayBuffer(file);
  };

  // Effect to reprocess when settings change
  // FUTURE SPLIT: EXCEL PROCESSING MODULE
  // This useEffect should be extracted to useExcelProcessor hook
  // Function to extract: processExcelData
  // Dependencies: workbookData, selectedSheet, sourceColumn, uttererColumn, referenceColumn, useReferenceColumn, startRow
  useEffect(() => {
    if (workbookData && selectedSheet) {
      const worksheet = workbookData.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      // Extract column data
      const sourceColIndex = sourceColumn.charCodeAt(0) - 65;
      const uttererColIndex = uttererColumn.charCodeAt(0) - 65;
      const referenceColIndex = referenceColumn.charCodeAt(0) - 65;
      const extractedTexts: string[] = [];
      const extractedUtterers: string[] = [];
      const extractedReferences: string[] = [];
      
      for (let i = startRow - 1; i < jsonData.length; i++) {
        const dataRow = jsonData[i];
        if (dataRow && dataRow[sourceColIndex] && dataRow[sourceColIndex].toString().trim()) {
          extractedTexts.push(dataRow[sourceColIndex].toString().trim());
          // Get utterer from specified column, or empty string if not found
          const utterer = dataRow[uttererColIndex] ? dataRow[uttererColIndex].toString().trim() : '';
          extractedUtterers.push(utterer);
          // Get reference translation if using reference column
          const reference = processReferenceData(dataRow, referenceColIndex);
          extractedReferences.push(reference);
        }
      }
      
      setSourceTexts(extractedTexts);
      setUtterers(extractedUtterers);
      // If using reference column, populate translations with reference data, otherwise empty
      setTranslations(initializeTranslationsWithReference(extractedReferences, extractedTexts.length));
    }
      }, [workbookData, selectedSheet, sourceColumn, uttererColumn, referenceColumn, useReferenceColumn, startRow]);

  // FUTURE SPLIT: SETUP WIZARD MODULE
  // This function should be extracted to useSetupWizard hook
  // Components to create: ManualInputSetup, InputModeSelector
  // Dependencies: sourceTexts, utterers, translations, currentIndex, isStarted state
  const handleSourceInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    setSourceTexts(lines);
    setUtterers(new Array(lines.length).fill(''));
    setTranslations(new Array(lines.length).fill(''));
    setCurrentIndex(0);
    setIsStarted(false);
    // Clear Excel data when using manual input
    setWorkbookData(null);
    setExcelSheets([]);
    setSelectedSheet('');
    resetReferenceColumn();
    setInputMode('manual');
  };

      // FUTURE SPLIT: TRANSLATION WORKFLOW MODULE
      // This function should be extracted to useTranslationWorkflow hook
      // Components to create: TranslationSession, WorkflowController
      // Dependencies: sourceTexts, translations, currentIndex, currentTranslation, isStarted, useReferenceColumn state
      const handleStart = () => {
      if (sourceTexts.length > 0) {
        setIsStarted(true);
        // Reference column functionality disabled for MVP
        setCurrentTranslation('');
      }
    };

  // FUTURE SPLIT: TRANSLATION WORKFLOW MODULE
  // This function should be extracted to useTranslationWorkflow hook
  // Components to create: WorkflowNavigation, SessionControls
  // Dependencies: isStarted state
  const handleBackToSetup = () => {
    setIsStarted(false);
    setCurrentIndex(0);
    setCurrentTranslation('');
    // Preserve utterers and translations when going back
  };

  // FUTURE SPLIT: TRANSLATION WORKFLOW MODULE
  // This function should be extracted to useTranslationWorkflow hook
  // Components to create: TranslationSubmitter, WorkflowNavigation
  // Dependencies: currentIndex, currentTranslation, translations, sourceTexts state
  const handleSubmit = () => {
    const newTranslations = [...translations];
    newTranslations[currentIndex] = currentTranslation;
    setTranslations(newTranslations);
    
    // Auto-copy translations to clipboard for safety
    const text = newTranslations.join('\n');
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    
    // Trigger translation animation
    setIsTranslating(true);
    setTimeout(() => setIsTranslating(false), 800);
    
    if (currentIndex < sourceTexts.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setCurrentTranslation('');
        setIsAnimating(false);
      }, 200);
    }
  };

  // FUTURE SPLIT: TRANSLATION WORKFLOW MODULE
  // This function should be extracted to useTranslationWorkflow hook
  // Components to create: WorkflowNavigation, NavigationControls
  // Dependencies: currentIndex, currentTranslation, translations state
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setCurrentTranslation(translations[currentIndex - 1] || '');
        setIsAnimating(false);
      }, 200);
    }
  };

  // FUTURE SPLIT: EXPORT FUNCTIONALITY MODULE
  // This function should be extracted to useExportFunctionality hook
  // Components to create: ExportControls, ClipboardManager
  // Dependencies: translations, showCopied state
  const copyToClipboard = () => {
    // Copy just the translations, without row numbers or utterers
    const text = translations.join('\n');
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // FUTURE SPLIT: EXPORT FUNCTIONALITY MODULE
  // This function should be extracted to useExportFunctionality hook
  // Components to create: ExportControls, CellLocationCalculator
  // Dependencies: excelSheets, cellStart state
  const getCellLocation = (index: number) => {
    if (excelSheets.length > 0) {
      // For Excel files, use row numbers
      return `Row ${startRow + index}`;
    }
    // For manual input, use cell notation
    const match = cellStart.match(/([A-Z]+)(\d+)/);
    if (match) {
      const col = match[1];
      const row = parseInt(match[2]);
      return `${col}${row + index}`;
    }
    return cellStart;
  };

  if (!isStarted) {
    return (
      <SetupWizard
        inputMode={inputMode}
        setInputMode={setInputMode}
        excelSheets={excelSheets}
        selectedSheet={selectedSheet}
        setSelectedSheet={setSelectedSheet}
        sourceColumn={sourceColumn}
        setSourceColumn={setSourceColumn}
        uttererColumn={uttererColumn}
        setUttererColumn={setUttererColumn}
        referenceColumn={referenceColumn}
        setReferenceColumn={setReferenceColumn}
        useReferenceColumn={useReferenceColumn}
        setUseReferenceColumn={setUseReferenceColumn}
        startRow={startRow}
        setStartRow={setStartRow}
        cellStart={cellStart}
        setCellStart={setCellStart}
        sourceTexts={sourceTexts}
        handleFileUpload={handleFileUpload}
        handleSourceInput={handleSourceInput}
        handleStart={handleStart}
        gradientColors={gradientColors}
        isTranslating={isTranslating}
        showVersionHash={showVersionHash}
        VERSION_HASH={VERSION_HASH}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
        style={{ borderRadius: '3px' }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      {/* Back to Setup Floating Button */}
      <button
        onClick={handleBackToSetup}
        className="fixed top-4 left-4 p-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
        style={{ borderRadius: '3px' }}
        aria-label="Back to setup"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>


      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3 tracking-tighter text-gray-900 dark:text-gray-100">Translation Helper</h1>
          {selectedSheet && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Sheet: {selectedSheet}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-400 text-lg relative inline-block">
            <span 
              className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 relative"
              onMouseEnter={() => setShowJumpInput(true)}
              onMouseLeave={() => {
                if (!document.activeElement?.classList.contains('jump-input')) {
                  setShowJumpInput(false);
                }
              }}
            >
              {getCellLocation(currentIndex)}
            </span>
            {showJumpInput && (
              <div 
                className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50"
                onMouseEnter={() => setShowJumpInput(true)}
                onMouseLeave={() => setShowJumpInput(false)}
              >
                <input
                  type="number"
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newIndex = parseInt(jumpValue) - 1;
                      if (newIndex >= 0 && newIndex < sourceTexts.length) {
                        setCurrentIndex(newIndex);
                        setCurrentTranslation(translations[newIndex] || '');
                        setShowJumpInput(false);
                        setJumpValue('');
                      }
                    } else if (e.key === 'Escape') {
                      setShowJumpInput(false);
                      setJumpValue('');
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowJumpInput(false);
                      setJumpValue('');
                    }, 200);
                  }}
                  placeholder="Go to..."
                  className="jump-input px-2 py-1 w-24 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-white"
                  autoFocus
                  min="1"
                  max={sourceTexts.length}
                />
              </div>
            )}
            {' '}• Item {currentIndex + 1} of {sourceTexts.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 border border-black dark:border-gray-600 overflow-hidden shadow-inner">
          <div
            className="absolute h-full transition-all duration-500 ease-out diagonal-stripes"
            style={{ 
              width: `${progress}%`,
              backgroundImage: darkMode 
                ? `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 5px,
                    rgba(255, 255, 255, 0.3) 5px,
                    rgba(255, 255, 255, 0.3) 10px
                  )`
                : `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 5px,
                    rgba(0, 0, 0, 0.8) 5px,
                    rgba(0, 0, 0, 0.8) 10px
                  )`
            }}
          />
        </div>

        {/* Translation Card */}
        <div 
          className={`bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-8 space-y-8 shadow-md transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'
          }`}
        >
          <div className="space-y-6 text-center">
            {utterers.length > 0 && utterers[currentIndex] && (
              <div className="mb-4">
                <label className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-2">Speaker</label>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">{utterers[currentIndex]}</p>
              </div>
            )}
            <div className="space-y-2">
              {gamepadMode ? (
                <div 
                  className="mx-auto gamepad-box relative pixelify-sans-500 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-2 border-dashed border-black dark:border-gray-400"
                  style={{ 
                    width: '450px',     // Increased from 400px
                    height: '180px',    // Increased from 150px
                    fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                    fontSize: '1.5rem', // Slightly larger font for better readability
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    letterSpacing: '0.02em',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    background: darkMode ? '#1a1a1a' : '#ffffff',
                    position: 'relative'
                  }}
                >
                  {/* Speaker bar with reduced height */}
                  <div 
                    className="bg-black dark:bg-gray-800 text-white dark:text-gray-100 px-4 py-2 border-b-2 border-black dark:border-gray-700 text-left pixelify-sans-600 relative"
                    style={{ 
                      fontSize: '1.8rem', 
                      fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                      background: '#000000'
                    }}
                  >
                    <span className="text-shadow-pixel">{extractSpeakerName(utterers[currentIndex])}</span>
                  </div>
                  
                  {/* Main dialogue area with enhanced styling */}
                  <div 
                    className="p-3 relative text-left pixelify-sans-500 overflow-y-auto custom-scrollbar"
                    style={{ 
                      height: 'calc(100% - 50px)',
                      fontFamily: 'var(--font-pixelify-sans), "Pixelify Sans", sans-serif',
                      fontSize: '1.2rem',
                      lineHeight: '1.6',
                      background: darkMode ? '#1a1a1a' : '#ffffff'
                    }}
                  >
                    <div 
                      className="dialogue-content"
                      dangerouslySetInnerHTML={{ 
                        __html: eyeMode && currentTranslation 
                          ? highlightMatchingText(currentTranslation)
                          : highlightMatchingText(sourceTexts[currentIndex]) 
                      }}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.classList.contains('clickable-character')) {
                          const characterName = target.getAttribute('data-character');
                          if (characterName) {
                            insertCharacterName(characterName);
                          }
                        }
                      }}
                      style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                        wordSpacing: '0.05em'
                      }}
                    />
                    
                    {/* Simplified continue dialogue indicator */}
                    <div className="absolute bottom-2 right-2 text-gray-600 animate-bounce">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="text-2xl font-bold leading-relaxed px-6 py-4 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded"
                  style={{ borderRadius: '3px' }}
                  dangerouslySetInnerHTML={{ 
                    __html: eyeMode && currentTranslation 
                      ? highlightMatchingText(currentTranslation)
                      : highlightMatchingText(sourceTexts[currentIndex]) 
                  }}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.classList.contains('clickable-character')) {
                      const characterName = target.getAttribute('data-character');
                      if (characterName) {
                        insertCharacterName(characterName);
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>



          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Translation</label>
              <div className="flex items-center gap-3">
                {/* Reference Column UI - DISABLED FOR MVP
                {useReferenceColumn && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-300 px-3 py-1 font-bold shadow-sm border border-blue-600 dark:border-blue-600" style={{ borderRadius: '3px' }}>
                    Verification Mode
                  </span>
                )}
                */}
                {/* Gamepad Mode - UI View */}
                <button
                  onClick={toggleGamepadMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  title="UI View"
                >
                  <svg className={`w-5 h-5 ${gamepadMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM11 7a1 1 0 100 2 1 1 0 000-2zm2 1a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a1 1 0 100 2 1 1 0 000-2zm-2 1a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zm3.293 2.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM15 13a1 1 0 100 2 1 1 0 000-2z"/>
                  </svg>
                </button>
                {/* Eye Mode - Translation Preview */}
                <button
                  onClick={toggleEyeMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  title="Translation Preview"
                >
                  {eyeMode ? (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
                {/* Highlight Mode - Codex Highlights */}
                <button
                  onClick={toggleHighlightMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  title="Codex Highlights"
                >
                  {highlightMode ? (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C11.4477 2 11 2.44772 11 3V4C11 4.55228 11.4477 5 12 5C12.5523 5 13 4.55228 13 4V3C13 2.44772 12.5523 2 12 2Z"/>
                      <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z"/>
                      <path d="M12 19C11.4477 19 11 19.4477 11 20V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V20C13 19.4477 12.5523 19 12 19Z"/>
                      <path d="M5.63604 5.63604C5.24551 6.02656 5.24551 6.65973 5.63604 7.05025L6.34315 7.75736C6.73367 8.14788 7.36683 8.14788 7.75736 7.75736C8.14788 7.36683 8.14788 6.73367 7.75736 6.34315L7.05025 5.63604C6.65973 5.24551 6.02656 5.24551 5.63604 5.63604Z"/>
                      <path d="M18.364 5.63604C17.9735 5.24551 17.3403 5.24551 16.9497 5.63604L16.2426 6.34315C15.8521 6.73367 15.8521 7.36683 16.2426 7.75736C16.6332 8.14788 17.2663 8.14788 17.6569 7.75736L18.364 7.05025C18.7545 6.65973 18.7545 6.02656 18.364 5.63604Z"/>
                      <path d="M2 12C2 11.4477 2.44772 11 3 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H3C2.44772 13 2 12.5523 2 12Z"/>
                      <path d="M20 11C19.4477 11 19 11.4477 19 12C19 12.5523 19.4477 13 20 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H20Z"/>
                      <path d="M7.75736 16.2426C7.36683 15.8521 6.73367 15.8521 6.34315 16.2426L5.63604 16.9497C5.24551 17.3403 5.24551 17.9735 5.63604 18.364C6.02656 18.7545 6.65973 18.7545 7.05025 18.364L7.75736 17.6569C8.14788 17.2663 8.14788 16.6332 7.75736 16.2426Z"/>
                      <path d="M17.6569 16.2426C17.2663 15.8521 16.6332 15.8521 16.2426 16.2426C15.8521 16.6332 15.8521 17.2663 16.2426 17.6569L16.9497 18.364C17.3403 18.7545 17.9735 18.7545 18.364 18.364C18.7545 17.9735 18.7545 17.3403 18.364 16.9497L17.6569 16.2426Z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C11.4477 2 11 2.44772 11 3V4C11 4.55228 11.4477 5 12 5C12.5523 5 13 4.55228 13 4V3C13 2.44772 12.5523 2 12 2Z"/>
                      <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z"/>
                      <path d="M12 19C11.4477 19 11 19.4477 11 20V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V20C13 19.4477 12.5523 19 12 19Z"/>
                      <path d="M5.63604 5.63604C5.24551 6.02656 5.24551 6.65973 5.63604 7.05025L6.34315 7.75736C6.73367 8.14788 7.36683 8.14788 7.75736 7.75736C8.14788 7.36683 8.14788 6.73367 7.75736 6.34315L7.05025 5.63604C6.65973 5.24551 6.02656 5.24551 5.63604 5.63604Z"/>
                      <path d="M18.364 5.63604C17.9735 5.24551 17.3403 5.24551 16.9497 5.63604L16.2426 6.34315C15.8521 6.73367 15.8521 7.36683 16.2426 7.75736C16.6332 8.14788 17.2663 8.14788 17.6569 7.75736L18.364 7.05025C18.7545 6.65973 18.7545 6.02656 18.364 5.63604Z"/>
                      <path d="M2 12C2 11.4477 2.44772 11 3 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H3C2.44772 13 2 12.5523 2 12Z"/>
                      <path d="M20 11C19.4477 11 19 11.4477 19 12C19 12.5523 19.4477 13 20 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H20Z"/>
                      <path d="M7.75736 16.2426C7.36683 15.8521 6.73367 15.8521 6.34315 16.2426L5.63604 16.9497C5.24551 17.3403 5.24551 17.9735 5.63604 18.364C6.02656 18.7545 6.65973 18.7545 7.05025 18.364L7.75736 17.6569C8.14788 17.2663 8.14788 16.6332 7.75736 16.2426Z"/>
                      <path d="M17.6569 16.2426C17.2663 15.8521 16.6332 15.8521 16.2426 16.2426C15.8521 16.6332 15.8521 17.2663 16.2426 17.6569L16.9497 18.364C17.3403 18.7545 17.9735 18.7545 18.364 18.364C18.7545 17.9735 18.7545 17.3403 18.364 16.9497L17.6569 16.2426Z"/>
                    </svg>
                  )}
                </button>
                {/* JSON Mode Toggle */}
                <button
                  onClick={toggleJsonMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  title="JSON Data View"
                >
                  <svg className={`w-5 h-5 ${jsonMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 5a3 3 0 013-3h10a3 3 0 013 3v14a3 3 0 01-3 3H7a3 3 0 01-3-3V5zm3 1a1 1 0 000 2h8a1 1 0 100-2H7zm0 4a1 1 0 000 2h8a1 1 0 100-2H7zm0 4a1 1 0 000 2h8a1 1 0 100-2H7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={currentTranslation}
              onChange={(e) => setCurrentTranslation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-md focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-30 transition-all duration-200 text-lg leading-relaxed bg-gray-50 dark:bg-gray-700 shadow-inner dark:text-white resize-none"
              placeholder="Enter your translation..."
              rows={3}
              autoFocus
            />
            <div className="mt-2">
              <div className="flex items-start justify-between">
                <p className="text-xs text-gray-500">
                  Press Shift+Enter to submit
                </p>
                {(detectAssCharacters(sourceTexts[currentIndex]).length > 0 || getMatchingCodexEntries(sourceTexts[currentIndex]).length > 0) && (
                  <div className="flex flex-wrap gap-2 justify-end ml-4" style={{ maxWidth: '50%' }}>
                    {/* Character buttons */}
                    {detectAssCharacters(sourceTexts[currentIndex]).map((character, index) => (
                      <button
                        key={`char-${index}`}
                        onClick={() => insertCharacterName(character)}
                        className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors duration-200 font-medium whitespace-nowrap"
                        style={{ 
                          borderRadius: '3px'
                        }}
                      >
                        {character}
                      </button>
                    ))}
                    {/* Codex entry buttons */}
                    {getMatchingCodexEntries(sourceTexts[currentIndex]).map((entry, index) => (
                      <button
                        key={`codex-${index}`}
                        onClick={() => insertCharacterName(entry.title)}
                        className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors duration-200 font-medium whitespace-nowrap"
                        style={{ 
                          borderRadius: '3px'
                        }}
                        title={`From ${entry.category}`}
                      >
                        {entry.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm font-black tracking-tight uppercase letter-spacing-wide"
              style={{ 
                borderRadius: '3px'
              }}
            >
              ‹ Previous
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide"
              style={{ 
                borderRadius: '3px'
              }}
            >
              {currentIndex === sourceTexts.length - 1 ? 'Complete ✓' : 'Submit & Next ›'}
            </button>
          </div>

          {/* JSON Mode Interface - Inside Translation Card */}
          {jsonMode && (
            <div className="mt-6 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 shadow-md transition-all duration-300" style={{ borderRadius: '3px' }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">JSON Data Viewer</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Browse and search translation data</p>
                </div>
                <button
                  onClick={toggleJsonMode}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  style={{ borderRadius: '3px' }}
                  title="Close JSON Viewer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Controls Section */}
              <div className="space-y-4">
                {/* File and Sheet Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">File</label>
                    <select
                      value={selectedJsonFile}
                      onChange={(e) => loadJsonData(e.target.value)}
                      className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm"
                      style={{ borderRadius: '3px' }}
                    >
                      <option value="">Select a JSON file</option>
                      {availableJsonFiles.map(file => (
                        <option key={file} value={file}>{file}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sheet Selection */}
                  {jsonData && !globalSearch && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Sheet</label>
                      <select
                        value={selectedJsonSheet}
                        onChange={(e) => setSelectedJsonSheet(e.target.value)}
                        className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm"
                        style={{ borderRadius: '3px' }}
                      >
                        <option value="">Select a sheet</option>
                        {getAvailableSheets().map((sheetName: string) => (
                          <option key={sheetName} value={sheetName}>{sheetName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Search and Global Toggle */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Search</label>
                    <input
                      type="text"
                      value={jsonSearchTerm}
                      onChange={(e) => setJsonSearchTerm(e.target.value)}
                      placeholder="Search by row number, utterer, context, or text..."
                      className="w-full p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm"
                      style={{ borderRadius: '3px' }}
                    />
                  </div>
                  
                  {/* Global Search Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="globalSearch"
                      checked={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.checked)}
                      className="w-4 h-4 text-black border border-black dark:border-gray-600 rounded focus:ring-2 focus:ring-gray-500 focus:ring-offset-0 dark:bg-gray-700"
                      style={{ borderRadius: '2px' }}
                    />
                    <label htmlFor="globalSearch" className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">
                      Global Search
                    </label>
                  </div>
                </div>
              </div>

              {/* JSON Data Display */}
              {jsonData && (globalSearch || selectedJsonSheet) && (
                <div className="mt-6 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 max-h-64 overflow-y-auto shadow-inner custom-scrollbar" style={{ borderRadius: '3px' }}>
                  <div className="p-4 space-y-3">
                    {getFilteredEntries().map((entry: any, index: number) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm" style={{ borderRadius: '3px' }}>
                        <div className="space-y-2">
                          {/* Header with Row and Sheet */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">Row {entry.rowNumber}</span>
                              {globalSearch && entry.sheetName && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium tracking-tight uppercase letter-spacing-wide">
                                  {entry.sheetName}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Data Grid */}
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-16">Utterer:</span>
                              <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.utterer}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-16">Context:</span>
                              <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.context}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">Source:</span>
                              <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.sourceEnglish}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-20">Dutch:</span>
                              <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.translatedDutch}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getFilteredEntries().length === 0 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                        No entries found matching your search criteria.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className={`bg-white dark:bg-gray-800 border border-black dark:border-gray-600 p-6 space-y-6 shadow-md transition-transform duration-200 ${
          showCopied ? 'transform scale-95' : 'transform scale-100'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase letter-spacing-wide">Translated Output</h3>
              <p className="text-xs text-gray-500 mt-1">Shows row info, but copies translations only</p>
            </div>
            <div className="relative">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-black tracking-tight uppercase letter-spacing-wide"
                style={{ borderRadius: '3px' }}
                title="Copy translations only (for pasting back to spreadsheet)"
              >
                Copy All
              </button>
              {showCopied && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 dark:bg-green-700 text-white px-3 py-2 text-sm whitespace-nowrap shadow-lg border border-green-800 dark:border-green-900" style={{ borderRadius: '3px' }}>
                  ✓ Copied!
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 border border-black dark:border-gray-600 max-h-48 overflow-y-auto shadow-inner custom-scrollbar">
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100">
              {translations.map((trans, idx) => {
                if (!trans) return '';
                const utterer = (utterers && utterers.length > 0 && utterers[idx]) ? `[${utterers[idx]}] ` : '';
                return `${getCellLocation(idx)}: ${utterer}${trans}`;
              }).filter(Boolean).join('\n') || 'Translations will appear here...'}
            </pre>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg">{currentIndex + 1}</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Current</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg">{translations.filter(t => t).length}</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Completed</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-black dark:border-gray-600 shadow-sm" style={{ borderRadius: '3px' }}>
              <p className="font-bold text-base sm:text-lg">{Math.round(progress)}%</p>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-xs sm:text-sm">Progress</p>
            </div>
          </div>
        </div>



        {/* Codex Reference Panel */}
        <CodexPanel
          codexData={codexData}
          accordionStates={accordionStates}
          isLoadingCodex={isLoadingCodex}
          categoryHasMatches={categoryHasMatches}
          toggleAccordion={toggleAccordion}
          renderCodexItems={renderCodexItems}
        />

        {/* Footer */}
        <div className="mt-20 mb-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            Onnozelaer Marketing Works © 2025 - made with Generative AI
          </p>
          
          {/* Gradient Accent Block (Halved) */}
          <div className="flex justify-center items-center">
            <div 
              className="shadow-lg relative cursor-pointer"
              onMouseEnter={() => setShowVersionHash(true)}
              onMouseLeave={() => setShowVersionHash(false)}
              onClick={() => setGradientColors(generateGradientColors())}
              title="Click to change gradient"
              style={{
                width: '150px',  // Half of 300px (from screen 2)
                height: '37.5px', // Half of 75px (from screen 2)
                backgroundImage: gradientColors.length > 0 
                  ? `linear-gradient(270deg, ${gradientColors.join(', ')}, ${gradientColors[0]})` 
                  : 'linear-gradient(270deg, #3498DB, #9B59B6, #3498DB)',
                backgroundSize: '200% 200%',
                animation: isTranslating ? 'gradientShiftFast 1.5s ease-in-out infinite' : 'gradientShift 2s ease-in-out infinite'
              }}
            >
              {showVersionHash && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-lg font-black tracking-tight uppercase letter-spacing-wide">
                    {VERSION_HASH}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .gamepad-box {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          font-family: 'VT323', 'Courier New', Courier, monospace;
          letter-spacing: 0.02em;
          text-rendering: optimizeLegibility;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* GAMEPAD BOX CUSTOMIZATION GUIDE:
         * To adjust the gamepad box size and styling, modify these values in the inline style:
         * - width: 600px (box width)
         * - height: 200px (box height) 
         * - fontSize: 2.5rem (MAIN TEXT SIZE - CONTROL HERE)
         * - Speaker fontSize: 2rem (in speaker bar style)
         * - fontFamily: "Pixelify Sans", sans-serif (pixel font)
         * - Dark mode: Handled via Tailwind classes (bg-white dark:bg-gray-900, etc.)
         * - Border: 2px dashed with dark mode support
         */
      `}</style>

    </div>
  );
};

/**
 * COMPREHENSIVE REFACTORING STRATEGY SUMMARY
 * ============================================
 * 
 * This monolithic component has been thoroughly annotated for future splitting.
 * The refactoring should follow this priority order:
 * 
 * PHASE 1: CORE FUNCTIONALITY EXTRACTION
 * --------------------------------------
 * 1. Excel Processing Module (useExcelProcessor + ExcelProcessor)
 *    - State: workbookData, excelSheets, selectedSheet, sourceColumn, etc.
 *    - Functions: handleFileUpload, processExcelData
 *    - Components: ExcelUploader, ExcelConfiguration, ExcelFileProcessor
 * 
 * 2. Translation Workflow Module (useTranslationWorkflow + TranslationWorkflow)
 *    - State: sourceTexts, translations, currentIndex, currentTranslation
 *    - Functions: handleStart, handleSubmit, handlePrevious, handleBackToSetup
 *    - Components: TranslationSession, WorkflowController, NavigationControls
 * 
 * 3. Codex Integration Module (useCodexIntegration + CodexPanel)
 *    - State: codexData, accordionStates, expandedItems, isLoadingCodex
 *    - Functions: fetchCodexData, getMatchingCodexEntries, renderCodexItems
 *    - Components: CodexAccordion, CodexItemRenderer, CodexDataProvider
 * 
 * PHASE 2: UI/UX MODULES
 * -----------------------
 * 4. Character Detection Module (useCharacterDetection + CharacterButtons)
 *    - Functions: detectAssCharacters, insertCharacterName, highlightMatchingText
 *    - Components: CharacterDetector, CharacterInsertion, TextHighlighter
 * 
 * 5. Display Modes Module (useDisplayModes + DisplayModeControls)
 *    - State: darkMode, gamepadMode, eyeMode, highlightMode
 *    - Functions: dark mode management, theme switching
 *    - Components: ThemeProvider, VisualModeSelector, DarkModeSync
 * 
 * 6. Dialogue Box Module (DialogueBox component)
 *    - Extract pixel art dialogue box rendering
 *    - Components: DialogueBox, SpeakerBar, DialogueContent
 * 
 * PHASE 3: UTILITY MODULES
 * -------------------------
 * 7. Progress Tracking Module (useProgressTracking + ProgressControls)
 *    - State: showJumpInput, jumpValue, showVersionHash
 *    - Functions: progress calculation, navigation
 *    - Components: ProgressBar, JumpToInput, NavigationPanel
 * 
 * 8. Export Functionality Module (useExportFunctionality + ExportControls)
 *    - Functions: copyToClipboard, getCellLocation
 *    - Components: ExportControls, ClipboardManager, CellLocationCalculator
 * 
 * 9. Setup Wizard Module (useSetupWizard + SetupWizard)
 *    - State: inputMode, Excel configuration
 *    - Functions: handleSourceInput, setup management
 *    - Components: SetupWizard, ManualInputSetup, InputModeSelector
 * 
 * 10. Animation Module (useAnimations + AnimationProvider)
 *     - State: isAnimating, gradientColors, showCopied
 *     - Functions: generateGradientColors, animation management
 *     - Components: AnimationProvider, GradientGenerator
 * 
 * IMPLEMENTATION NOTES:
 * - Each module should have its own hook for state management
 * - Components should be co-located with their hooks
 * - Use React Context for cross-module communication
 * - Maintain TypeScript interfaces for all extracted functions
 * - Preserve existing functionality during extraction
 * - Test each module independently after extraction
 * 
 * FILE STRUCTURE AFTER REFACTORING:
 * src/
 * ├── hooks/
 * │   ├── useExcelProcessor.ts
 * │   ├── useTranslationWorkflow.ts
 * │   ├── useCodexIntegration.ts
 * │   ├── useCharacterDetection.ts
 * │   ├── useDisplayModes.ts
 * │   ├── useProgressTracking.ts
 * │   ├── useExportFunctionality.ts
 * │   ├── useSetupWizard.ts
 * │   └── useAnimations.ts
 * ├── components/
 * │   ├── modules/
 * │   │   ├── ExcelProcessor/
 * │   │   ├── TranslationWorkflow/
 * │   │   ├── CodexPanel/
 * │   │   ├── CharacterDetection/
 * │   │   ├── DisplayModes/
 * │   │   ├── DialogueBox/
 * │   │   ├── ProgressTracking/
 * │   │   ├── ExportFunctionality/
 * │   │   ├── SetupWizard/
 * │   │   └── Animations/
 * │   └── TranslationHelper.tsx (simplified main component)
 * 
 * This refactoring will transform the 1553-line monolithic component into
 * a modular, maintainable, and testable architecture while preserving
 * all existing functionality.
 */
export default TranslationHelper; 