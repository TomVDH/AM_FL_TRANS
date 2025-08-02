# TranslationHelper Refactor Plan

## Overview
The current `TranslationHelper.tsx` file is a monolithic component (1482 lines) that handles all functionality. This plan outlines how to break it down into smaller, focused components following React best practices.

## Component Architecture

### 1. Core Components

#### `TranslationHelper.tsx` (Main Container)
- **Purpose**: Main orchestrator component
- **Responsibilities**: 
  - State management coordination
  - Layout switching (stacked vs split)
  - Component composition
- **Size**: ~100-150 lines
- **Props**: None (self-contained)

#### `SetupScreen.tsx`
- **Purpose**: Initial configuration screen
- **Responsibilities**:
  - Excel file upload handling
  - Manual text input
  - Input mode selection
  - Configuration validation
- **Size**: ~300-400 lines
- **Props**:
  ```typescript
  interface SetupScreenProps {
    onStart: (config: TranslationConfig) => void;
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
    splitLayout: boolean;
    setSplitLayout: (layout: boolean) => void;
  }
  ```

#### `TranslationScreen.tsx`
- **Purpose**: Main translation interface
- **Responsibilities**:
  - Translation input/output
  - Navigation controls
  - Progress tracking
  - Character insertion
- **Size**: ~400-500 lines
- **Props**:
  ```typescript
  interface TranslationScreenProps {
    sourceTexts: string[];
    translations: string[];
    currentIndex: number;
    onNavigate: (direction: 'next' | 'prev') => void;
    onSubmit: (translation: string) => void;
    onBackToSetup: () => void;
    darkMode: boolean;
    splitLayout: boolean;
  }
  ```

#### `CodexReference.tsx`
- **Purpose**: Codex display and interaction
- **Responsibilities**:
  - Accordion rendering
  - Codex data display
  - Search/filtering
  - Character highlighting
- **Size**: ~200-250 lines
- **Props**:
  ```typescript
  interface CodexReferenceProps {
    codexData: CodexData;
    currentText: string;
    onCharacterClick: (character: string) => void;
    darkMode: boolean;
  }
  ```

### 2. UI Components

#### `GradientHeader.tsx`
- **Purpose**: Reusable gradient accent block
- **Responsibilities**:
  - Gradient animation
  - Version hash display
  - Click interactions
- **Size**: ~50-75 lines
- **Props**:
  ```typescript
  interface GradientHeaderProps {
    gradientColors: string[];
    onGradientChange: () => void;
    showVersionHash: boolean;
    setShowVersionHash: (show: boolean) => void;
    versionHash: string;
    isTranslating: boolean;
  }
  ```

#### `ProgressTracker.tsx`
- **Purpose**: Progress visualization
- **Responsibilities**:
  - Progress bar rendering
  - Statistics display
  - Jump navigation
- **Size**: ~100-150 lines
- **Props**:
  ```typescript
  interface ProgressTrackerProps {
    currentIndex: number;
    totalItems: number;
    completedItems: number;
    progress: number;
    onJumpTo: (index: number) => void;
    darkMode: boolean;
  }
  ```

#### `TranslationCard.tsx`
- **Purpose**: Individual translation item display
- **Responsibilities**:
  - Source text display
  - Translation input
  - Character buttons
  - Action buttons
- **Size**: ~200-250 lines
- **Props**:
  ```typescript
  interface TranslationCardProps {
    sourceText: string;
    translation: string;
    utterer?: string;
    onTranslationChange: (translation: string) => void;
    onCharacterInsert: (character: string) => void;
    detectAssCharacters: (text: string) => string[];
    highlightMatchingText: (text: string) => string;
    darkMode: boolean;
    gamepadMode: boolean;
    eyeMode: boolean;
    highlightMode: boolean;
  }
  ```

#### `OutputSection.tsx`
- **Purpose**: Translation output display
- **Responsibilities**:
  - Output formatting
  - Copy functionality
  - Statistics display
- **Size**: ~100-150 lines
- **Props**:
  ```typescript
  interface OutputSectionProps {
    translations: string[];
    utterers: string[];
    onCopy: () => void;
    showCopied: boolean;
    darkMode: boolean;
  }
  ```

#### `UIToggleButtons.tsx`
- **Purpose**: UI control buttons
- **Responsibilities**:
  - Dark mode toggle
  - Layout toggle
  - Gamepad mode toggle
  - Highlight toggle
- **Size**: ~75-100 lines
- **Props**:
  ```typescript
  interface UIToggleButtonsProps {
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
    splitLayout: boolean;
    setSplitLayout: (layout: boolean) => void;
    gamepadMode: boolean;
    setGamepadMode: (mode: boolean) => void;
    highlightMode: boolean;
    setHighlightMode: (mode: boolean) => void;
    eyeMode: boolean;
    setEyeMode: (mode: boolean) => void;
  }
  ```

### 3. Custom Hooks

#### `useTranslationSession.ts`
- **Purpose**: Translation session state management
- **Responsibilities**:
  - Current index management
  - Navigation logic
  - Translation submission
  - Progress tracking
- **Size**: ~100-150 lines
- **Returns**:
  ```typescript
  interface TranslationSession {
    currentIndex: number;
    currentTranslation: string;
    translations: string[];
    progress: number;
    isAnimating: boolean;
    navigateNext: () => void;
    navigatePrev: () => void;
    submitTranslation: () => void;
    updateTranslation: (translation: string) => void;
    jumpToIndex: (index: number) => void;
  }
  ```

#### `useExcelProcessor.ts`
- **Purpose**: Excel file processing logic
- **Responsibilities**:
  - File upload handling
  - Data extraction
  - Column configuration
  - Sheet management
- **Size**: ~150-200 lines
- **Returns**:
  ```typescript
  interface ExcelProcessor {
    workbookData: XLSX.WorkBook | null;
    excelSheets: string[];
    selectedSheet: string;
    sourceTexts: string[];
    utterers: string[];
    uploadFile: (file: File) => void;
    setSelectedSheet: (sheet: string) => void;
    setColumnConfig: (config: ColumnConfig) => void;
  }
  ```

#### `useCodexIntegration.ts`
- **Purpose**: Codex data management
- **Responsibilities**:
  - Codex data fetching
  - Character detection
  - Text highlighting
  - Matching logic
- **Size**: ~100-150 lines
- **Returns**:
  ```typescript
  interface CodexIntegration {
    codexData: CodexData;
    isLoadingCodex: boolean;
    detectAssCharacters: (text: string) => string[];
    highlightMatchingText: (text: string) => string;
    getMatchingCodexEntries: (text: string) => CodexEntry[];
    categoryHasMatches: (category: string) => boolean;
  }
  ```

#### `useUIState.ts`
- **Purpose**: UI state management
- **Responsibilities**:
  - Dark mode persistence
  - Layout state
  - Animation states
  - Display preferences
- **Size**: ~75-100 lines
- **Returns**:
  ```typescript
  interface UIState {
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
    splitLayout: boolean;
    setSplitLayout: (layout: boolean) => void;
    gamepadMode: boolean;
    setGamepadMode: (mode: boolean) => void;
    highlightMode: boolean;
    setHighlightMode: (mode: boolean) => void;
    eyeMode: boolean;
    setEyeMode: (mode: boolean) => void;
    isAnimating: boolean;
    setIsAnimating: (animating: boolean) => void;
  }
  ```

### 4. Utility Functions

#### `utils/textProcessing.ts`
- **Purpose**: Text processing utilities
- **Functions**:
  - `extractSpeakerName(utterer: string): string`
  - `insertCharacterName(characterName: string, currentText: string, cursorPos: number): string`
  - `getCellLocation(index: number, config: CellConfig): string`
  - `formatProgress(current: number, total: number): number`

#### `utils/gradientUtils.ts`
- **Purpose**: Gradient color generation
- **Functions**:
  - `generateGradientColors(): string[]`
  - `getGradientAnimation(isTranslating: boolean): string`

#### `utils/excelUtils.ts`
- **Purpose**: Excel processing utilities
- **Functions**:
  - `extractColumnData(worksheet: XLSX.WorkSheet, config: ColumnConfig): ExtractedData`
  - `validateColumnConfig(config: ColumnConfig): ValidationResult`

### 5. Type Definitions

#### `types/index.ts`
- **Purpose**: Centralized type definitions
- **Types**:
  ```typescript
  interface TranslationConfig {
    sourceTexts: string[];
    utterers: string[];
    translations: string[];
    excelConfig?: ExcelConfig;
    manualConfig?: ManualConfig;
  }

  interface ExcelConfig {
    workbookData: XLSX.WorkBook;
    selectedSheet: string;
    sourceColumn: string;
    uttererColumn: string;
    referenceColumn?: string;
    useReferenceColumn: boolean;
    startRow: number;
  }

  interface ManualConfig {
    cellStart: string;
  }

  interface CodexData {
    [category: string]: CodexEntry[];
  }

  interface CodexEntry {
    name: string;
    content: string;
    category: string;
  }

  interface ColumnConfig {
    sourceColumn: string;
    uttererColumn: string;
    referenceColumn?: string;
    useReferenceColumn: boolean;
    startRow: number;
  }
  ```

## File Structure

```
src/
├── components/
│   ├── TranslationHelper.tsx          # Main container
│   ├── SetupScreen.tsx               # Setup interface
│   ├── TranslationScreen.tsx         # Translation interface
│   ├── CodexReference.tsx            # Codex display
│   ├── ui/
│   │   ├── GradientHeader.tsx        # Gradient accent
│   │   ├── ProgressTracker.tsx       # Progress display
│   │   ├── TranslationCard.tsx       # Translation card
│   │   ├── OutputSection.tsx         # Output display
│   │   └── UIToggleButtons.tsx       # UI controls
│   └── layout/
│       ├── StackedLayout.tsx         # Stacked layout
│       └── SplitLayout.tsx           # Split layout
├── hooks/
│   ├── useTranslationSession.ts      # Session management
│   ├── useExcelProcessor.ts          # Excel processing
│   ├── useCodexIntegration.ts        # Codex integration
│   └── useUIState.ts                 # UI state
├── utils/
│   ├── textProcessing.ts             # Text utilities
│   ├── gradientUtils.ts              # Gradient utilities
│   └── excelUtils.ts                 # Excel utilities
└── types/
    └── index.ts                      # Type definitions
```

## Migration Strategy

### Phase 1: Extract Hooks (Week 1)
1. Create `useUIState.ts` - Extract all UI state management
2. Create `useCodexIntegration.ts` - Extract codex logic
3. Create `useExcelProcessor.ts` - Extract Excel processing
4. Create `useTranslationSession.ts` - Extract session management

### Phase 2: Extract UI Components (Week 2)
1. Create `UIToggleButtons.tsx` - Extract toggle buttons
2. Create `GradientHeader.tsx` - Extract gradient header
3. Create `ProgressTracker.tsx` - Extract progress tracking
4. Create `OutputSection.tsx` - Extract output section

### Phase 3: Extract Main Components (Week 3)
1. Create `SetupScreen.tsx` - Extract setup interface
2. Create `TranslationCard.tsx` - Extract translation card
3. Create `CodexReference.tsx` - Extract codex display
4. Create `TranslationScreen.tsx` - Extract translation interface

### Phase 4: Refactor Main Component (Week 4)
1. Refactor `TranslationHelper.tsx` to use new components
2. Implement layout switching logic
3. Add proper prop drilling
4. Test all functionality

### Phase 5: Optimization (Week 5)
1. Add React.memo() to pure components
2. Optimize re-renders
3. Add error boundaries
4. Performance testing

## Benefits

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in different contexts
3. **Testability**: Smaller components are easier to test
4. **Performance**: Better control over re-renders
5. **Developer Experience**: Easier to understand and modify
6. **Type Safety**: Better TypeScript integration with proper interfaces

## Testing Strategy

1. **Unit Tests**: Test each hook and utility function
2. **Component Tests**: Test each component in isolation
3. **Integration Tests**: Test component interactions
4. **E2E Tests**: Test complete user workflows

## Performance Considerations

1. **React.memo()**: Wrap pure components
2. **useCallback()**: Memoize event handlers
3. **useMemo()**: Memoize expensive calculations
4. **Code Splitting**: Lazy load non-critical components
5. **Bundle Analysis**: Monitor bundle size impact

## Migration Checklist

- [ ] Create type definitions
- [ ] Extract custom hooks
- [ ] Create UI components
- [ ] Create main components
- [ ] Refactor main component
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Add proper TypeScript types
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Code review and cleanup 