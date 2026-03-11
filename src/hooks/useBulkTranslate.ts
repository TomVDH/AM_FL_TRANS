import { useState, useCallback, useRef } from 'react';

export type ModelTier = 'haiku' | 'sonnet' | 'opus';
export type BulkScope = 'all' | 'empty' | 'from-current';

interface SurroundingLine {
  speaker?: string;
  text: string;
}

export interface BulkTranslateResult {
  index: number;
  originalTranslation: string;
  opusTranslation: string;
  sourceText: string;
  speaker: string;
  wasEmpty: boolean;
}

export interface DryRunResult {
  index: number;
  sourceText: string;
  speaker: string;
  translation: string;
  existingTranslation: string;
}

export interface BulkTranslateOptions {
  model?: ModelTier;
  scope?: BulkScope;
  contextWindow?: number;   // 0-10, default 5
  requestDelay?: number;    // 0-1000ms, default 200
  startIndex?: number;      // for 'from-current' scope
}

interface UseBulkTranslateProps {
  sourceTexts: string[];
  utterers: string[];
  translations: string[];
  contextNotes: string[];
  trimSpeakerName: (name: string) => string;
  apiKey?: string;
}

interface UseBulkTranslateReturn {
  // Modal state
  showBulkModal: boolean;
  openBulkModal: () => void;
  closeBulkModal: () => void;

  // Translation progress
  isBulkTranslating: boolean;
  bulkProgress: number;
  bulkTotal: number;
  bulkCurrentLine: string;
  bulkLastSuggestion: string;
  bulkLastSource: string;
  bulkLastSpeaker: string;
  bulkSuggestionCount: number;
  startBulkTranslate: (options?: BulkTranslateOptions) => void;
  stopBulkTranslate: () => void;

  // Review state
  showBulkReview: boolean;
  bulkResults: BulkTranslateResult[];
  acceptResult: (index: number) => string; // returns the accepted translation
  rejectResult: (index: number) => void;
  updateResultTranslation: (index: number, newTranslation: string) => void;
  regenerateResult: (index: number) => Promise<void>;
  isRegenerating: number | null; // index currently regenerating, or null
  acceptAll: () => Map<number, string>;
  acceptAllEmpty: () => Map<number, string>;
  rejectAllChanged: () => void;
  exitReview: () => void;

  // Dry run
  isDryRunning: boolean;
  dryRunResults: DryRunResult[];
  startDryRun: (options?: BulkTranslateOptions) => void;
  clearDryRun: () => void;

  // Stats
  emptyCount: number;
  translatedCount: number;
}

// Per-request timeout (seconds) — prevents indefinite hangs from slow API responses
const REQUEST_TIMEOUT_MS = 45_000;

// Sanity-check: reject AI responses that are clearly not translations
function isGarbageResponse(suggestion: string, sourceText: string): boolean {
  const lower = suggestion.toLowerCase();
  // Model refused to translate or asked for clarification
  if (lower.includes("i'm ready to translate") ||
      lower.includes("i notice you") ||
      lower.includes("could you please provide") ||
      lower.includes("i'd be happy to translate") ||
      lower.includes("let me translate") ||
      lower.includes("here is the translation") ||
      lower.includes("please provide the")) {
    return true;
  }
  // Response is absurdly long relative to source (5x+ length suggests hallucination)
  if (suggestion.length > sourceText.length * 5 && suggestion.length > 200) {
    return true;
  }
  return false;
}

// Session counter — increments on each startBulkTranslate call.
// The async loop checks this to detect if a NEW run has started, making the current one stale.
let globalSessionId = 0;

export function useBulkTranslate({
  sourceTexts,
  utterers,
  translations,
  contextNotes,
  trimSpeakerName,
  apiKey,
}: UseBulkTranslateProps): UseBulkTranslateReturn {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isBulkTranslating, setIsBulkTranslating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);
  const currentLineRef = useRef('');
  const [showBulkReview, setShowBulkReview] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkTranslateResult[]>([]);
  const abortRef = useRef(false);
  const [isRegenerating, setIsRegenerating] = useState<number | null>(null);
  // Remember last-used settings for regeneration
  const lastModelRef = useRef<ModelTier>('opus');
  const lastContextWindowRef = useRef(5);
  // Use refs instead of state for ephemeral display values to avoid re-renders during async loop
  const lastSuggestionRef = useRef('');
  const lastSourceRef = useRef('');
  const lastSpeakerRef = useRef('');
  // Counter that only increments on actual new suggestions (not skipped lines)
  const suggestionCountRef = useRef(0);

  const [isDryRunning, setIsDryRunning] = useState(false);
  const [dryRunResults, setDryRunResults] = useState<DryRunResult[]>([]);

  const emptyCount = translations.filter((t, i) => i < sourceTexts.length && (!t || t === '[BLANK, REMOVE LATER]')).length;
  const translatedCount = sourceTexts.length - emptyCount;

  const openBulkModal = useCallback(() => {
    setShowBulkModal(true);
  }, []);

  const closeBulkModal = useCallback(() => {
    if (!isBulkTranslating) {
      setShowBulkModal(false);
    }
  }, [isBulkTranslating]);

  const stopBulkTranslate = useCallback(() => {
    abortRef.current = true;
  }, []);

  const clearDryRun = useCallback(() => {
    setDryRunResults([]);
  }, []);

  const startDryRun = useCallback(async (options: BulkTranslateOptions = {}) => {
    const {
      model = 'opus',
      scope = 'all',
      contextWindow = 5,
      startIndex = 0,
    } = options;

    const snapSourceTexts = [...sourceTexts];
    const snapUtterers = [...utterers];
    const snapTranslations = [...translations];
    const snapContextNotes = [...contextNotes];

    // Determine eligible indices based on scope
    const loopStart = scope === 'from-current' ? Math.max(0, startIndex) : 0;
    const eligible: number[] = [];
    for (let i = loopStart; i < snapSourceTexts.length; i++) {
      const src = snapSourceTexts[i];
      if (!src?.trim()) continue;
      if (scope === 'empty') {
        const existing = snapTranslations[i] || '';
        if (existing && existing !== '[BLANK, REMOVE LATER]') continue;
      }
      eligible.push(i);
    }

    if (eligible.length === 0) return;

    // Pick 3 representative lines: first, middle, last
    const picks: number[] = [];
    if (eligible.length <= 3) {
      picks.push(...eligible);
    } else {
      picks.push(eligible[0]);
      picks.push(eligible[Math.floor(eligible.length / 2)]);
      picks.push(eligible[eligible.length - 1]);
    }

    setIsDryRunning(true);
    setDryRunResults([]);
    const results: DryRunResult[] = [];

    for (const i of picks) {
      const source = snapSourceTexts[i];
      const speaker = snapUtterers[i] ? trimSpeakerName(snapUtterers[i]) : '';
      const existingTranslation = snapTranslations[i] || '';
      const wasEmpty = !existingTranslation || existingTranslation === '[BLANK, REMOVE LATER]';

      // Build context window
      const linesBefore: SurroundingLine[] = [];
      const linesAfter: SurroundingLine[] = [];
      for (let j = Math.max(0, i - contextWindow); j < i; j++) {
        if (snapSourceTexts[j]?.trim()) {
          linesBefore.push({ speaker: snapUtterers[j] ? trimSpeakerName(snapUtterers[j]) : undefined, text: snapSourceTexts[j] });
        }
      }
      for (let j = i + 1; j <= Math.min(snapSourceTexts.length - 1, i + contextWindow); j++) {
        if (snapSourceTexts[j]?.trim()) {
          linesAfter.push({ speaker: snapUtterers[j] ? trimSpeakerName(snapUtterers[j]) : undefined, text: snapSourceTexts[j] });
        }
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        const response = await fetch('/api/ai-suggest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'x-api-key': apiKey } : {}),
          },
          body: JSON.stringify({
            english: source,
            speaker,
            context: snapContextNotes[i] || '',
            existingTranslation: wasEmpty ? undefined : existingTranslation,
            linesBefore: linesBefore.length > 0 ? linesBefore : undefined,
            linesAfter: linesAfter.length > 0 ? linesAfter : undefined,
            model,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.suggestion && !isGarbageResponse(data.suggestion, source)) {
            results.push({
              index: i,
              sourceText: source,
              speaker,
              translation: data.suggestion,
              existingTranslation: wasEmpty ? '' : existingTranslation,
            });
          }
        }
      } catch (err) {
        console.error('[Dry Run] Error:', err);
      }
    }

    setDryRunResults(results);
    setIsDryRunning(false);
  }, [sourceTexts, utterers, translations, contextNotes, trimSpeakerName, apiKey]);

  const startBulkTranslate = useCallback(async (options: BulkTranslateOptions = {}) => {
    const {
      model = 'opus',
      scope = 'all',
      contextWindow = 5,
      requestDelay = 200,
      startIndex = 0,
    } = options;

    // Store settings for regeneration
    lastModelRef.current = model;
    lastContextWindowRef.current = contextWindow;

    // Invalidate any previous run by incrementing the global session ID.
    // The previous run's async loop will see the mismatch and exit gracefully.
    globalSessionId += 1;
    const mySessionId = globalSessionId;

    // Also signal abort to any in-flight fetch in a previous run
    abortRef.current = true;
    // Give a tick for previous run to see the abort
    await new Promise(resolve => setTimeout(resolve, 50));
    abortRef.current = false;

    // Snapshot arrays at call time to avoid stale closures during async iteration
    const snapSourceTexts = [...sourceTexts];
    const snapUtterers = [...utterers];
    const snapTranslations = [...translations];
    const snapContextNotes = [...contextNotes];

    // Determine loop start based on scope
    const loopStart = scope === 'from-current' ? Math.max(0, startIndex) : 0;

    // Pre-count lines that will actually be sent to the API (not blank, not skipped by scope)
    let effectiveTotal = 0;
    for (let i = loopStart; i < snapSourceTexts.length; i++) {
      const src = snapSourceTexts[i];
      if (!src?.trim()) continue; // blank source
      if (scope === 'empty') {
        const existing = snapTranslations[i] || '';
        const isEmpty = !existing || existing === '[BLANK, REMOVE LATER]';
        if (!isEmpty) continue; // already translated, skipped in empty-only mode
      }
      effectiveTotal++;
    }

    setIsBulkTranslating(true);
    setBulkProgress(0);
    setBulkTotal(effectiveTotal);
    lastSuggestionRef.current = '';
    lastSourceRef.current = '';
    lastSpeakerRef.current = '';
    suggestionCountRef.current = 0;
    const results: BulkTranslateResult[] = [];
    let processed = 0;

    console.log(`[Bulk Translate] Starting session #${mySessionId}: ${effectiveTotal} lines to process (${snapSourceTexts.length - loopStart} total, scope: ${scope}, start: ${loopStart}), model: ${model}, context: ${contextWindow}, delay: ${requestDelay}ms`);

    for (let i = loopStart; i < snapSourceTexts.length; i++) {
      // Check both abort flag AND session invalidation
      if (abortRef.current || globalSessionId !== mySessionId) {
        console.log(`[Bulk Translate] Session #${mySessionId} ${abortRef.current ? 'aborted' : 'superseded'} at ${i}/${snapSourceTexts.length}`);
        break;
      }

      const source = snapSourceTexts[i];
      if (!source?.trim()) continue;

      const speaker = snapUtterers[i] ? trimSpeakerName(snapUtterers[i]) : '';
      const existingTranslation = snapTranslations[i] || '';
      const wasEmpty = !existingTranslation || existingTranslation === '[BLANK, REMOVE LATER]';

      // Scope: 'empty' skips lines that already have translations
      if (scope === 'empty' && !wasEmpty) continue;

      currentLineRef.current = `[${speaker || 'narrator'}] ${source.substring(0, 60)}${source.length > 60 ? '...' : ''}`;

      // Build surrounding lines (contextWindow before, contextWindow after)
      const linesBefore: SurroundingLine[] = [];
      const linesAfter: SurroundingLine[] = [];

      for (let j = Math.max(0, i - contextWindow); j < i; j++) {
        if (snapSourceTexts[j]?.trim()) {
          linesBefore.push({
            speaker: snapUtterers[j] ? trimSpeakerName(snapUtterers[j]) : undefined,
            text: snapSourceTexts[j],
          });
        }
      }

      for (let j = i + 1; j <= Math.min(snapSourceTexts.length - 1, i + contextWindow); j++) {
        if (snapSourceTexts[j]?.trim()) {
          linesAfter.push({
            speaker: snapUtterers[j] ? trimSpeakerName(snapUtterers[j]) : undefined,
            text: snapSourceTexts[j],
          });
        }
      }

      try {
        const reqStartTime = Date.now();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        const response = await fetch('/api/ai-suggest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'x-api-key': apiKey } : {}),
          },
          body: JSON.stringify({
            english: source,
            speaker,
            context: snapContextNotes[i] || '',
            existingTranslation: wasEmpty ? undefined : existingTranslation,
            linesBefore: linesBefore.length > 0 ? linesBefore : undefined,
            linesAfter: linesAfter.length > 0 ? linesAfter : undefined,
            model,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const reqDuration = ((Date.now() - reqStartTime) / 1000).toFixed(1);

        // Check session invalidation after the await (another run could have started)
        if (globalSessionId !== mySessionId) {
          console.log(`[Bulk Translate] Session #${mySessionId} superseded during request at ${i}/${snapSourceTexts.length}`);
          break;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.suggestion) {
            const normalizedSuggestion = data.suggestion.trim();
            const normalizedExisting = (wasEmpty ? '' : existingTranslation).trim();

            // Reject garbage responses (model refusals, hallucinations)
            if (isGarbageResponse(normalizedSuggestion, source)) {
              console.warn(`[Bulk Translate] %c${i+1}/${snapSourceTexts.length}%c [GARBAGE REJECTED] %c(${reqDuration}s) %c"${source.substring(0, 50)}" → "${normalizedSuggestion.substring(0, 80)}..."`,
                'color: #8b5cf6; font-weight: bold', 'color: #ef4444', 'color: #f59e0b', 'color: #9ca3af'
              );
            } else if (normalizedSuggestion === normalizedExisting) {
              console.log(`[Bulk Translate] %c${i+1}/${snapSourceTexts.length}%c [SKIP - identical] %c(${reqDuration}s) %c"${source.substring(0, 60)}"`,
                'color: #8b5cf6; font-weight: bold', 'color: #6b7280', 'color: #f59e0b', 'color: #9ca3af'
              );
            } else {
              console.log(`[Bulk Translate] %c${i+1}/${snapSourceTexts.length}%c [${speaker || 'narrator'}] %c(${reqDuration}s) %c"${source.substring(0, 60)}"%c → %c"${normalizedSuggestion.substring(0, 80)}"`,
                'color: #8b5cf6; font-weight: bold', 'color: inherit',
                'color: #f59e0b', 'color: #6b7280', 'color: inherit',
                'color: #10b981; font-weight: bold'
              );
              lastSourceRef.current = source;
              lastSuggestionRef.current = data.suggestion;
              lastSpeakerRef.current = speaker || '';
              suggestionCountRef.current += 1;
              results.push({
                index: i,
                originalTranslation: wasEmpty ? '' : existingTranslation,
                opusTranslation: data.suggestion,
                sourceText: source,
                speaker,
                wasEmpty,
              });
            }
          } else {
            console.warn(`[Bulk Translate] %c${i+1}/${snapSourceTexts.length}%c [NO SUGGESTION] %c(${reqDuration}s) %c"${source.substring(0, 60)}"`,
              'color: #8b5cf6; font-weight: bold', 'color: #ef4444', 'color: #f59e0b', 'color: #9ca3af'
            );
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(`[Bulk Translate] %c${i+1}/${snapSourceTexts.length}%c [HTTP ${response.status}] %c(${reqDuration}s) %c${(errorData as { error?: string }).error || 'Unknown error'} — "${source.substring(0, 40)}"`,
            'color: #8b5cf6; font-weight: bold', 'color: #ef4444', 'color: #f59e0b', 'color: #9ca3af'
          );
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        const isTimeout = err instanceof Error && err.name === 'AbortError';
        console.error(`[Bulk Translate] %c${i+1}/${snapSourceTexts.length}%c [${isTimeout ? 'TIMEOUT' : 'ERROR'}] %c${errMsg} — "${source.substring(0, 40)}"`,
          'color: #8b5cf6; font-weight: bold', 'color: #ef4444', 'color: #9ca3af'
        );
      }

      processed++;
      setBulkProgress(processed);

      // Configurable delay between requests
      if (!abortRef.current && globalSessionId === mySessionId && i < snapSourceTexts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, requestDelay));
      }
    }

    // Only finalize if this session is still the active one
    if (globalSessionId === mySessionId) {
      setIsBulkTranslating(false);
      setShowBulkModal(false);
      setBulkResults(results);
      setShowBulkReview(results.length > 0);
      console.log(`[Bulk Translate] Session #${mySessionId} done: ${results.length} results from ${processed} processed (${snapSourceTexts.length - loopStart} total lines)`);
    } else {
      console.log(`[Bulk Translate] Session #${mySessionId} discarded (superseded by #${globalSessionId})`);
    }
  }, [sourceTexts, utterers, translations, contextNotes, trimSpeakerName, apiKey]);

  const acceptResult = useCallback((index: number): string => {
    const result = bulkResults.find(r => r.index === index);
    if (!result) return '';
    setBulkResults(prev => prev.filter(r => r.index !== index));
    return result.opusTranslation;
  }, [bulkResults]);

  const rejectResult = useCallback((index: number) => {
    setBulkResults(prev => prev.filter(r => r.index !== index));
  }, []);

  const updateResultTranslation = useCallback((index: number, newTranslation: string) => {
    setBulkResults(prev => prev.map(r =>
      r.index === index ? { ...r, opusTranslation: newTranslation } : r
    ));
  }, []);

  const acceptAll = useCallback((): Map<number, string> => {
    const accepted = new Map<number, string>();
    for (const result of bulkResults) {
      accepted.set(result.index, result.opusTranslation);
    }
    setBulkResults([]);
    setShowBulkReview(false);
    return accepted;
  }, [bulkResults]);

  const acceptAllEmpty = useCallback((): Map<number, string> => {
    const accepted = new Map<number, string>();
    const remaining: BulkTranslateResult[] = [];
    for (const result of bulkResults) {
      if (result.wasEmpty) {
        accepted.set(result.index, result.opusTranslation);
      } else {
        remaining.push(result);
      }
    }
    setBulkResults(remaining);
    if (remaining.length === 0) setShowBulkReview(false);
    return accepted;
  }, [bulkResults]);

  const rejectAllChanged = useCallback(() => {
    setBulkResults(prev => prev.filter(r => r.wasEmpty));
    // If nothing left, exit review
    setBulkResults(prev => {
      if (prev.length === 0) setShowBulkReview(false);
      return prev;
    });
  }, []);

  const exitReview = useCallback(() => {
    setBulkResults([]);
    setShowBulkReview(false);
  }, []);

  const regenerateResult = useCallback(async (resultIndex: number) => {
    const result = bulkResults.find(r => r.index === resultIndex);
    if (!result) return;

    setIsRegenerating(resultIndex);
    try {
      const i = result.index;
      const source = sourceTexts[i];
      const speaker = utterers[i] ? trimSpeakerName(utterers[i]) : '';
      const cw = lastContextWindowRef.current;

      // Build context window
      const linesBefore: SurroundingLine[] = [];
      const linesAfter: SurroundingLine[] = [];
      for (let j = Math.max(0, i - cw); j < i; j++) {
        if (sourceTexts[j]?.trim()) {
          linesBefore.push({ speaker: utterers[j] ? trimSpeakerName(utterers[j]) : undefined, text: sourceTexts[j] });
        }
      }
      for (let j = i + 1; j <= Math.min(sourceTexts.length - 1, i + cw); j++) {
        if (sourceTexts[j]?.trim()) {
          linesAfter.push({ speaker: utterers[j] ? trimSpeakerName(utterers[j]) : undefined, text: sourceTexts[j] });
        }
      }

      const response = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-api-key': apiKey } : {}),
        },
        body: JSON.stringify({
          english: source,
          speaker,
          context: contextNotes[i] || '',
          existingTranslation: result.opusTranslation, // send current as existing so AI sees it
          linesBefore: linesBefore.length > 0 ? linesBefore : undefined,
          linesAfter: linesAfter.length > 0 ? linesAfter : undefined,
          model: lastModelRef.current,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.suggestion) {
          setBulkResults(prev => prev.map(r =>
            r.index === resultIndex ? { ...r, opusTranslation: data.suggestion } : r
          ));
        }
      }
    } catch (err) {
      console.error('[Bulk Translate] Regenerate failed:', err);
    } finally {
      setIsRegenerating(null);
    }
  }, [bulkResults, sourceTexts, utterers, contextNotes, trimSpeakerName, apiKey]);

  // Read refs during render — they update in the async loop,
  // and the UI re-renders via bulkProgress state changes (the only setState in the loop)
  const bulkCurrentLine = currentLineRef.current;
  const bulkLastSuggestion = lastSuggestionRef.current;
  const bulkLastSource = lastSourceRef.current;
  const bulkLastSpeaker = lastSpeakerRef.current;
  const bulkSuggestionCount = suggestionCountRef.current;

  return {
    showBulkModal,
    openBulkModal,
    closeBulkModal,
    isBulkTranslating,
    bulkProgress,
    bulkTotal,
    bulkCurrentLine,
    bulkLastSuggestion,
    bulkLastSource,
    bulkLastSpeaker,
    bulkSuggestionCount,
    startBulkTranslate,
    stopBulkTranslate,
    showBulkReview,
    bulkResults,
    acceptResult,
    rejectResult,
    updateResultTranslation,
    regenerateResult,
    isRegenerating,
    acceptAll,
    acceptAllEmpty,
    rejectAllChanged,
    exitReview,
    isDryRunning,
    dryRunResults,
    startDryRun,
    clearDryRun,
    emptyCount,
    translatedCount,
  };
}
