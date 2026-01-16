/**
 * Hooks Index
 *
 * Central export for all custom React hooks.
 * Organized by category for easy discovery.
 */

// ============================================================================
// TRANSLATION HOOKS
// ============================================================================

// Main translation state hook (composition of focused hooks)
export { useTranslationState } from './useTranslationState';
export type { TranslationState, FilterOptions, FilterStatus } from './useTranslationState';

// Focused translation hooks (for direct use when needed)
export { useTranslationCore } from './useTranslationCore';
export type { TranslationCoreState } from './useTranslationCore';

export { useFilterState } from './useFilterState';
export type { FilterState, FilterStats, UseFilterStateProps } from './useFilterState';

export { useLiveEdit } from './useLiveEdit';
export type { LiveEditState, SyncStatus, UseLiveEditProps } from './useLiveEdit';

export { useUIState } from './useUIState';
export type { UIState, InputMode } from './useUIState';

export { useTextOperations } from './useTextOperations';
export type { TextOperationsState, UseTextOperationsProps } from './useTextOperations';

// ============================================================================
// EXCEL PROCESSING HOOKS
// ============================================================================

export { useExcelProcessing } from './useExcelProcessing';
export type { ExcelProcessingState } from './useExcelProcessing';

// ============================================================================
// SESSION & PERSISTENCE HOOKS
// ============================================================================

// Note: useSessionPersistence will be added when implemented

// ============================================================================
// ACCESSIBILITY HOOKS
// ============================================================================

// Note: useFocusTrap will be added when implemented

// ============================================================================
// SPECIAL MODE HOOKS
// ============================================================================

export { useWowMode } from './useWowMode';
export type { UseWowModeReturn } from './useWowMode';
