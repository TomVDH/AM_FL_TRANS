'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FileStatus {
  exists: boolean;
  size?: number;
  modified?: string;
  entries?: number;
}

interface AnalysisStatus {
  hasApiKey: boolean;
  files: {
    dialogue: FileStatus;
    dutchDialogue: FileStatus;
    corpus: FileStatus;
    styles: FileStatus;
    dutchStyles: FileStatus;
  };
  codex: FileStatus & {
    totalCharacters: number;
    enrichedCount: number;
    dutchEnrichedCount: number;
  };
}

interface StepDef {
  id: string;
  label: string;
  phase: 1 | 2 | 3;
  phaseLabel: string;
  apiCall: boolean; // true = uses Claude API (costs money, takes time)
  dependsOn?: string;
  outputKey?: keyof AnalysisStatus['files'];
}

const STEPS: StepDef[] = [
  { id: 'extract-dialogue', label: 'Extract English dialogue', phase: 1, phaseLabel: 'Extract', apiCall: false, outputKey: 'dialogue' },
  { id: 'extract-dutch-dialogue', label: 'Extract Dutch dialogue', phase: 1, phaseLabel: 'Extract', apiCall: false, outputKey: 'dutchDialogue' },
  { id: 'analyze-styles', label: 'Analyze English styles', phase: 2, phaseLabel: 'Analyze', apiCall: true, dependsOn: 'extract-dialogue', outputKey: 'styles' },
  { id: 'analyze-dutch-styles', label: 'Analyze Dutch styles', phase: 2, phaseLabel: 'Analyze', apiCall: true, dependsOn: 'extract-dutch-dialogue', outputKey: 'dutchStyles' },
  { id: 'import-styles', label: 'Import English styles to codex', phase: 3, phaseLabel: 'Import', apiCall: false, dependsOn: 'analyze-styles' },
  { id: 'import-dutch-styles', label: 'Import Dutch styles to codex', phase: 3, phaseLabel: 'Import', apiCall: false, dependsOn: 'analyze-dutch-styles' },
  { id: 'corpus', label: 'Speaker corpus (approved translations)', phase: 3, phaseLabel: 'Corpus', apiCall: false, outputKey: 'corpus' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Phase colors — unified gray, no rainbow
const PHASE_COLORS: Record<number, string> = {
  1: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
  2: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
  3: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StyleAnalysisPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningStep, setRunningStep] = useState<string | null>(null);
  const [stepOutput, setStepOutput] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewingData, setViewingData] = useState<{ label: string; stepId: string; data: any } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [speakerAudit, setSpeakerAudit] = useState<{ speaker: string; result: any } | null>(null);
  const [auditingSpkr, setAuditingSpkr] = useState<string | null>(null);

  const DATA_FILES: Record<string, string> = {
    'extract-dialogue': '/api/style-analysis/view?file=speaker-dialogue.csv',
    'extract-dutch-dialogue': '/api/style-analysis/view?file=speaker-dutch-dialogue.csv',
    'analyze-styles': '/api/style-analysis/view?file=speaker-styles.json',
    'analyze-dutch-styles': '/api/style-analysis/view?file=speaker-dutch-styles.json',
    'corpus': '/api/style-analysis/view?file=speaker-corpus.jsonl',
  };

  const viewData = async (stepId: string, label: string) => {
    const url = DATA_FILES[stepId];
    if (!url) return;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setViewingData({ label, stepId, data });
      setSpeakerAudit(null);
    } catch (err) {
      setViewingData({ label, stepId, data: { error: String(err) } });
    }
  };

  const runSpeakerAudit = async (speaker: string) => {
    setAuditingSpkr(speaker);
    setSpeakerAudit(null);
    try {
      const res = await fetch(`/api/corpus-audit?speaker=${encodeURIComponent(speaker)}&source=corpus`);
      const result = await res.json();
      setSpeakerAudit({ speaker, result });
    } catch (err) {
      setSpeakerAudit({ speaker, result: { error: String(err) } });
    } finally {
      setAuditingSpkr(null);
    }
  };

  // Fetch pipeline status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/style-analysis');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Run a pipeline step
  const runStep = useCallback(async (stepId: string, dryRun = false) => {
    setRunningStep(stepId);
    setStepOutput(null);
    setStepError(null);

    try {
      const res = await fetch('/api/style-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepId, dryRun }),
      });

      const data = await res.json();

      if (data.success) {
        setStepOutput(data.output || 'Completed successfully.');
      } else {
        setStepError(data.error || 'Unknown error');
        if (data.output) setStepOutput(data.output);
      }

      // Refresh status after run
      await fetchStatus();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      setStepError(message);
    } finally {
      setRunningStep(null);
    }
  }, [fetchStatus]);

  // Run the full pipeline
  const runFullPipeline = useCallback(async () => {
    for (const step of STEPS.filter(s => s.id !== 'corpus')) {
      setRunningStep(step.id);
      setStepOutput(null);
      setStepError(null);

      try {
        const res = await fetch('/api/style-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: step.id }),
        });

        const data = await res.json();
        if (!data.success) {
          setStepError(`Failed at "${step.label}": ${data.error}`);
          setRunningStep(null);
          return; // Stop pipeline on error
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Network error';
        setStepError(`Failed at "${step.label}": ${message}`);
        setRunningStep(null);
        return;
      }
    }

    setRunningStep(null);
    setStepOutput('Full pipeline completed successfully.');
    await fetchStatus();
  }, [fetchStatus]);

  // Compute enrichment progress
  const enrichmentPercent = status?.codex
    ? Math.round((status.codex.enrichedCount / Math.max(1, status.codex.totalCharacters)) * 100)
    : 0;
  const dutchEnrichmentPercent = status?.codex
    ? Math.round((status.codex.dutchEnrichedCount / Math.max(1, status.codex.totalCharacters)) * 100)
    : 0;

  // Summary badge for collapsed state
  const summaryText = status?.codex
    ? `${status.codex.enrichedCount}/${status.codex.totalCharacters} characters enriched`
    : 'Loading...';

  // Content block shared by both modes
  const content = (
    <>
      {loading ? (
            <div className="px-4 py-6 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent mx-auto mb-2" style={{ borderRadius: '50%' }} />
              <p className="text-xs text-gray-500 dark:text-gray-400">Loading pipeline status...</p>
            </div>
          ) : status ? (
            <div className="p-4 space-y-4">
              {/* Enrichment overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* English enrichment */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700" style={{ borderRadius: '3px' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">English Styles</span>
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{enrichmentPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 overflow-hidden" style={{ borderRadius: '1px' }}>
                    <div
                      className={`h-full transition-all duration-500 ${enrichmentPercent === 100 ? 'bg-amber-500' : 'bg-amber-400'}`}
                      style={{ width: `${enrichmentPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {status.codex.enrichedCount} / {status.codex.totalCharacters} characters
                  </p>
                </div>

                {/* Dutch enrichment */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700" style={{ borderRadius: '3px' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Dutch Styles</span>
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{dutchEnrichmentPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 overflow-hidden" style={{ borderRadius: '1px' }}>
                    <div
                      className={`h-full transition-all duration-500 ${dutchEnrichmentPercent === 100 ? 'bg-amber-500' : 'bg-amber-400'}`}
                      style={{ width: `${dutchEnrichmentPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {status.codex.dutchEnrichedCount} / {status.codex.totalCharacters} characters
                  </p>
                </div>
              </div>

              {/* API key warning */}
              {!status.hasApiKey && (
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" style={{ borderRadius: '3px' }}>
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[11px] text-red-700 dark:text-red-300">
                    <strong>ANTHROPIC_API_KEY not set.</strong> Analysis steps (Phase 2) require an API key in your <code className="bg-red-100 dark:bg-red-900/40 px-1">.env.local</code> file.
                  </p>
                </div>
              )}

              {/* Pipeline steps */}
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pipeline Steps</span>
                  <button
                    onClick={runFullPipeline}
                    disabled={!!runningStep}
                    className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors uppercase tracking-wide"
                  >
                    {runningStep ? 'Running...' : 'Run All'}
                  </button>
                </div>

                {STEPS.map((step) => {
                  const fileStatus = step.outputKey ? status.files[step.outputKey] : null;
                  const isRunning = runningStep === step.id;
                  const depMissing = step.dependsOn
                    ? (() => {
                        const dep = STEPS.find(s => s.id === step.dependsOn);
                        if (!dep?.outputKey) return false;
                        return !status.files[dep.outputKey]?.exists;
                      })()
                    : false;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 px-2 py-1.5 border border-gray-100 dark:border-gray-700 transition-colors ${isRunning ? 'bg-amber-50/50 dark:bg-amber-900/10' : 'bg-white dark:bg-gray-800/30'}`}
                      style={{ borderRadius: '3px' }}
                    >
                      {/* Phase badge */}
                      <span className={`text-[9px] font-bold px-1 py-0.5 flex-shrink-0 uppercase ${PHASE_COLORS[step.phase]}`} style={{ borderRadius: '2px' }}>
                        {step.phaseLabel}
                      </span>

                      {/* Step label */}
                      <span className="text-[11px] text-gray-700 dark:text-gray-300 flex-1 min-w-0 truncate">
                        {step.label}
                        {step.apiCall && (
                          <span className="ml-1.5 inline-flex items-center px-1 py-px text-[8px] font-bold uppercase tracking-wide bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded" title="Uses Claude API (costs apply)">AI</span>
                        )}
                      </span>

                      {/* Status indicator */}
                      {fileStatus?.exists ? (
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 flex-shrink-0" title={`${formatBytes(fileStatus.size || 0)}, ${fileStatus.entries || '?'} entries`}>
                          {fileStatus.entries ? `${fileStatus.entries} entries` : formatBytes(fileStatus.size || 0)}
                          {fileStatus.modified && ` · ${relativeTime(fileStatus.modified)}`}
                        </span>
                      ) : (
                        <span className="text-[9px] text-gray-300 dark:text-gray-600 flex-shrink-0">—</span>
                      )}

                      {/* View data button */}
                      {fileStatus?.exists && DATA_FILES[step.id] && (
                        <button
                          onClick={() => viewData(step.id, step.label)}
                          title={`View: ${step.label}`}
                          className="flex-shrink-0 p-1 text-gray-300 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      )}

                      {/* Run button (not for corpus — it's built by the translation workflow) */}
                      {step.id !== 'corpus' && (
                        <button
                          onClick={() => runStep(step.id)}
                          disabled={!!runningStep || depMissing}
                          title={depMissing ? `Requires "${STEPS.find(s => s.id === step.dependsOn)?.label}" first` : `Run: ${step.label}`}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          {isRunning ? (
                            <div className="animate-spin h-3 w-3 border-[1.5px] border-gray-500 border-t-transparent" style={{ borderRadius: '50%' }} />
                          ) : (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Output / Error display */}
              {(stepOutput || stepError) && (
                <div className="relative">
                  <button
                    onClick={() => { setStepOutput(null); setStepError(null); }}
                    className="absolute top-1 right-1 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <pre className={`text-[10px] leading-relaxed p-2 max-h-40 overflow-y-auto font-mono whitespace-pre-wrap ${stepError ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`} style={{ borderRadius: '3px' }}>
                    {stepError && `Error: ${stepError}\n\n`}{stepOutput}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
              Failed to load pipeline status
            </div>
          )}
    </>
  );

  // Data viewer panel — uses same hooks pattern as FloatingShortcutsPanel
  const dataViewerRef = useRef<HTMLDivElement>(null);

  // Esc to close data viewer
  useEffect(() => {
    if (!viewingData) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewingData(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [viewingData]);

  // Click outside to close data viewer
  useEffect(() => {
    if (!viewingData) return;
    const handleClick = (e: MouseEvent) => {
      if (dataViewerRef.current && !dataViewerRef.current.contains(e.target as Node)) {
        setViewingData(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [viewingData]);

  const renderDialogueView = (data: { totalLines: number; totalSpeakers: number; speakers: { speaker: string; count: number; episodes: string[] }[] }) => (
    <div className="space-y-0.5">
      <p className="text-[10px] text-gray-500 dark:text-gray-400 pb-2">{data.totalLines} lines · {data.totalSpeakers} speakers</p>
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-0.5 text-[11px]">
        <span className="text-[9px] font-bold text-gray-400 uppercase">Speaker</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase text-right">Lines</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase">Episodes</span>
        {data.speakers.map(s => (
          <React.Fragment key={s.speaker}>
            <span className="text-gray-800 dark:text-gray-200 truncate">{s.speaker}</span>
            <span className="text-gray-600 dark:text-gray-300 text-right font-mono">{s.count}</span>
            <span className="text-[9px] text-gray-400">{s.episodes.join(', ')}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStylesView = (data: { totalSpeakers: number; speakers: { speaker: string; lineCount: number; style: string }[] }) => (
    <div className="space-y-3">
      <p className="text-[10px] text-gray-500 dark:text-gray-400">{data.totalSpeakers} speaker profiles</p>
      {data.speakers.map(s => (
        <div key={s.speaker} className="border-b border-gray-100 dark:border-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{s.speaker}</span>
            <span className="text-[9px] text-gray-400">{s.lineCount} lines analyzed</span>
          </div>
          <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap leading-relaxed">{String(s.style || '—')}</p>
        </div>
      ))}
    </div>
  );

  const renderCorpusView = (data: { totalEntries: number; totalSpeakers: number; speakers: { speaker: string; count: number; samples: { english: string; dutch: string }[] }[] }) => (
    <div className="space-y-1">
      <p className="text-[10px] text-gray-500 dark:text-gray-400 pb-1">{data.totalEntries} approved translations · {data.totalSpeakers} speakers</p>
      {data.speakers.map(s => (
        <div key={s.speaker} className="border-b border-gray-100 dark:border-gray-800 pb-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{s.speaker}</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-gray-400">{s.count} entries</span>
              <button
                onClick={() => runSpeakerAudit(s.speaker)}
                disabled={auditingSpkr === s.speaker}
                className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/40 disabled:opacity-50 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                {auditingSpkr === s.speaker ? '...' : 'Audit'}
              </button>
            </div>
          </div>
          {/* Sample pairs */}
          <div className="mt-1 space-y-0.5">
            {s.samples.map((p, i) => (
              <div key={i} className="text-[10px] text-gray-500 dark:text-gray-400">
                <span className="text-gray-400">EN:</span> {p.english} → <span className="text-amber-600 dark:text-amber-400">NL:</span> {p.dutch}
              </div>
            ))}
          </div>
          {/* Inline audit result for this speaker */}
          {speakerAudit?.speaker === s.speaker && speakerAudit.result && (
            <div className="mt-2 p-2 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 space-y-1" style={{ borderRadius: '3px' }}>
              {speakerAudit.result.error ? (
                <p className="text-[10px] text-red-600">{speakerAudit.result.error}</p>
              ) : (
                <>
                  <div className="flex gap-3 text-[9px] text-gray-400 pb-1 border-b border-amber-200 dark:border-amber-800">
                    <span>{speakerAudit.result.entryCount} entries</span>
                    <span>{speakerAudit.result.sampledCount} sampled</span>
                    <span>{speakerAudit.result.uniqueEnglish} unique</span>
                  </div>
                  {speakerAudit.result.audit && typeof speakerAudit.result.audit === 'object' &&
                    Object.entries(speakerAudit.result.audit as Record<string, unknown>).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase">{key}: </span>
                        <span className="text-[10px] text-gray-700 dark:text-gray-300">
                          {Array.isArray(val) ? val.join(' · ') : String(val)}
                        </span>
                      </div>
                    ))
                  }
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const dataModal = viewingData && typeof document !== 'undefined' && createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <div
        ref={dataViewerRef}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col mx-4"
        style={{ borderRadius: '3px' }}
        role="dialog"
        aria-label={viewingData.label}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">{viewingData.label}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Esc to close</span>
            <button onClick={() => setViewingData(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {viewingData.data?.error ? (
            <p className="text-[11px] text-red-600">{viewingData.data.error}</p>
          ) : viewingData.data?.type === 'dialogue' ? (
            renderDialogueView(viewingData.data)
          ) : viewingData.data?.type === 'styles' ? (
            renderStylesView(viewingData.data)
          ) : viewingData.data?.type === 'corpus' ? (
            renderCorpusView(viewingData.data)
          ) : (
            <pre className="text-[10px] font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{JSON.stringify(viewingData.data, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>,
    document.body
  );

  // Embedded mode: no accordion, content shown directly
  if (embedded) {
    return <div>{content}{dataModal}</div>;
  }

  // Standalone mode: accordion wrapper
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex-1 w-full flex items-center justify-between py-1.5 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-sm font-bold tracking-tight">Speaker Style Analysis</span>
          {!loading && status?.codex && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30">
              {summaryText}
            </span>
          )}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="mt-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" style={{ borderRadius: '3px' }}>
          {content}
        </div>
      )}
      {dataModal}
    </div>
  );
}
