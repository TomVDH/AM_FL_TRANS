import { useState, useCallback, useRef } from 'react';

export type ModelTier = 'haiku' | 'sonnet' | 'opus';

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

interface UseBulkTranslateProps {
  sourceTexts: string[];
  utterers: string[];
  translations: string[];
  contextNotes: string[];
  trimSpeakerName: (name: string) => string;
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
  startBulkTranslate: (model?: ModelTier) => void;
  stopBulkTranslate: () => void;

  // Review state
  showBulkReview: boolean;
  bulkResults: BulkTranslateResult[];
  acceptResult: (index: number) => string; // returns the accepted translation
  rejectResult: (index: number) => void;
  updateResultTranslation: (index: number, newTranslation: string) => void;
  acceptAll: () => Map<number, string>;
  acceptAllEmpty: () => Map<number, string>;
  rejectAllChanged: () => void;
  exitReview: () => void;

  // Stats
  emptyCount: number;
  translatedCount: number;
}

export function useBulkTranslate({
  sourceTexts,
  utterers,
  translations,
  contextNotes,
  trimSpeakerName,
}: UseBulkTranslateProps): UseBulkTranslateReturn {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isBulkTranslating, setIsBulkTranslating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);
  const [bulkCurrentLine, setBulkCurrentLine] = useState('');
  const [showBulkReview, setShowBulkReview] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkTranslateResult[]>([]);
  const abortRef = useRef(false);

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

  const startBulkTranslate = useCallback(async (model: ModelTier = 'opus') => {
    abortRef.current = false;
    setIsBulkTranslating(true);
    setBulkProgress(0);
    setBulkTotal(sourceTexts.length);
    const results: BulkTranslateResult[] = [];

    for (let i = 0; i < sourceTexts.length; i++) {
      if (abortRef.current) break;

      const source = sourceTexts[i];
      if (!source?.trim()) {
        setBulkProgress(i + 1);
        continue;
      }

      const speaker = utterers[i] ? trimSpeakerName(utterers[i]) : '';
      const existingTranslation = translations[i] || '';
      const wasEmpty = !existingTranslation || existingTranslation === '[BLANK, REMOVE LATER]';

      setBulkCurrentLine(`[${speaker || 'narrator'}] ${source.substring(0, 60)}${source.length > 60 ? '...' : ''}`);

      // Build surrounding lines (5 before, 5 after)
      const linesBefore: SurroundingLine[] = [];
      const linesAfter: SurroundingLine[] = [];

      for (let j = Math.max(0, i - 5); j < i; j++) {
        if (sourceTexts[j]?.trim()) {
          linesBefore.push({
            speaker: utterers[j] ? trimSpeakerName(utterers[j]) : undefined,
            text: sourceTexts[j],
          });
        }
      }

      for (let j = i + 1; j <= Math.min(sourceTexts.length - 1, i + 5); j++) {
        if (sourceTexts[j]?.trim()) {
          linesAfter.push({
            speaker: utterers[j] ? trimSpeakerName(utterers[j]) : undefined,
            text: sourceTexts[j],
          });
        }
      }

      try {
        const response = await fetch('/api/ai-suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            english: source,
            speaker,
            context: contextNotes[i] || '',
            existingTranslation: wasEmpty ? undefined : existingTranslation,
            linesBefore: linesBefore.length > 0 ? linesBefore : undefined,
            linesAfter: linesAfter.length > 0 ? linesAfter : undefined,
            model,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.suggestion) {
            results.push({
              index: i,
              originalTranslation: wasEmpty ? '' : existingTranslation,
              opusTranslation: data.suggestion,
              sourceText: source,
              speaker,
              wasEmpty,
            });
          }
        }
      } catch {
        // Skip failed lines silently
      }

      setBulkProgress(i + 1);

      // Small delay between requests to be nice to rate limits
      if (!abortRef.current && i < sourceTexts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    setIsBulkTranslating(false);
    setShowBulkModal(false);
    setBulkResults(results);
    setShowBulkReview(results.length > 0);
  }, [sourceTexts, utterers, translations, contextNotes, trimSpeakerName]);

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

  return {
    showBulkModal,
    openBulkModal,
    closeBulkModal,
    isBulkTranslating,
    bulkProgress,
    bulkTotal,
    bulkCurrentLine,
    startBulkTranslate,
    stopBulkTranslate,
    showBulkReview,
    bulkResults,
    acceptResult,
    rejectResult,
    updateResultTranslation,
    acceptAll,
    acceptAllEmpty,
    rejectAllChanged,
    exitReview,
    emptyCount,
    translatedCount,
  };
}
