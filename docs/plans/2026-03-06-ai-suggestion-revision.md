# AI Suggestion System Revision Plan

## Current State

The AI suggestion system (`useAiSuggestion.ts` + `/api/ai-suggest/route.ts`) works but is basic:

- **Hook** sends: `english`, `speaker`, `context`, `existingTranslation`
- **API** looks up speaker in codex, builds prompt with character info (gender, bio, dialogueStyle, dutchDialogueStyle), calls Claude Haiku
- **Missing**: target language awareness, surrounding lines context, codex term enforcement, quality feedback loop

## Problems to Solve

1. **No surrounding context** - The AI sees only the current line in isolation. It doesn't know what came before or after, leading to inconsistent translations across a conversation.

2. **No target language parameter** - Hook hardcodes Dutch. If the project ever supports other target languages, the suggestion system won't adapt.

3. **No codex term enforcement** - The AI may translate character names or locations differently than what the codex defines. There's no mechanism to feed relevant codex terms into the prompt.

4. **No quality/confidence signal** - The suggestion is take-it-or-leave-it. No indication of whether the AI is confident or uncertain.

5. **No batch/pre-fetch** - Each line requires a separate API call with 300ms debounce. For sequential translation, pre-fetching the next few lines would improve perceived speed.

## Proposed Changes

### Phase 1: Context-Aware Suggestions

**Files to modify:**
- `src/hooks/useAiSuggestion.ts` - Add `targetLanguage`, `surroundingLines`, `codexTerms` to props and request body
- `src/app/api/ai-suggest/route.ts` - Accept new fields, build richer prompt
- `src/components/TranslationHelper.tsx` - Build and pass surrounding lines context

**Hook interface change:**
```typescript
interface UseAiSuggestionProps {
  sourceText: string;
  speaker: string;
  context: string;
  existingTranslation: string;
  currentIndex: number;
  // New fields
  targetLanguage: string;          // e.g. "dutch"
  surroundingLines?: {             // +-3 lines for conversational context
    index: number;
    english: string;
    translation?: string;
    speaker?: string;
  }[];
  relevantCodexTerms?: {           // Auto-detected terms from source text
    english: string;
    translation: string;
  }[];
}
```

**API prompt enhancement:**
- Include 3 lines before and after current line (with their translations if available)
- Include a "glossary" section with codex terms found in the current source text
- Specify target language explicitly in the system prompt

### Phase 2: Codex Term Auto-Detection

**Files to modify:**
- `src/components/TranslationHelper.tsx` - Use existing `findCharacterMatches` to extract codex terms from source text and pass them to the AI suggestion

**Logic:**
1. When preparing the AI request, scan the current source text using `findCharacterMatches`
2. Extract matched codex entries' `english` and target language translation
3. Pass as `relevantCodexTerms` to the hook
4. API includes these as a mandatory glossary in the prompt: "You MUST use these exact translations for the following terms: ..."

### Phase 3: Pre-fetch Pipeline (Optional)

**Files to create/modify:**
- `src/hooks/useAiSuggestion.ts` - Add pre-fetch logic for next 2-3 lines
- Cache management for pre-fetched suggestions

**Logic:**
1. When a suggestion is fetched for line N, also queue requests for N+1 and N+2
2. Store pre-fetched suggestions in a Map keyed by index
3. When navigating to N+1, instantly show the pre-fetched result

### Phase 4: Quality Signal (Optional)

**Files to modify:**
- `src/app/api/ai-suggest/route.ts` - Request structured output with confidence
- `src/hooks/useAiSuggestion.ts` - Surface confidence in return value
- UI components - Show confidence indicator

**API response change:**
```typescript
{
  suggestion: string;
  confidence: 'high' | 'medium' | 'low';
  notes?: string;  // e.g. "Uncertain about formality register"
}
```

## Implementation Order

1. **Phase 1** first - biggest impact, enables context-aware translations
2. **Phase 2** second - prevents term inconsistencies, builds on Phase 1
3. **Phase 3** optional - nice-to-have for speed
4. **Phase 4** optional - nice-to-have for quality visibility

## Notes

- The linter/hook has historically reverted changes to `useAiSuggestion.ts` and `TranslationHelper.tsx`. New changes should be committed promptly after verification.
- The current API uses Claude Haiku for speed/cost. Consider Sonnet for Phase 4 structured output if Haiku quality is insufficient.
- `dutchDialogueStyle` is already wired into the API route (lines 16, 95 of `route.ts`).
