# QoL Improvements: End State, Quick Ref, Notification Center

## 1. End State Screen (CompletionSummary)

### Changes
- **Clickable remaining sheets**: Each sheet chip becomes a button that triggers `onNextSheet` with that specific sheet
- **Button hierarchy**: "Next Sheet" stays primary green. "Continue Editing" becomes secondary. "Review & Edit" and "Export CSV" stay secondary
- **Skipped/blank callout**: If `stats.blank > 0`, show amber callout "N entries still blank" with review button
- **Visual polish**: Animated progress bar fill on mount, staggered card entry

### Props changes
- Add `onSelectSheet?: (sheetName: string) => void` for clicking specific remaining sheets

## 2. Quick Reference Bar

### Changes
- **Tooltips**: Add `title` attributes with full text on truncated pills (already partially there, enhance)
- **Copy action**: Alt+click or dedicated copy button alongside insert. Show brief "Copied!" feedback
- **Animation**: CSS transition for character card expand/collapse

### No props changes needed

## 3. Notification Center

### Architecture
- **NotificationCenter component**: Bell icon + slide-out panel
- **useNotificationLog hook**: Stores array of `{id, type, message, timestamp, undoAction?}`
- **Integration**: Wrap sonner toast calls to also log to the center
- **Position**: Bell icon in the translation view header bar

### Types
```typescript
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
  undoAction?: () => void;
}
```

## Files to modify/create
- `src/components/CompletionSummary.tsx` - End State improvements
- `src/components/QuickReferenceBar.tsx` - Tooltip + copy enhancements
- `src/components/NotificationCenter.tsx` - NEW
- `src/hooks/useNotificationLog.ts` - NEW
- `src/components/TranslationHelper.tsx` - Add NotificationCenter to header
