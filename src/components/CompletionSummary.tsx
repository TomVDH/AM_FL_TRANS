'use client';

import React from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import { Caption, Label } from './ui/Typography';

// ============================================================================
// TYPES
// ============================================================================

export interface CompletionSummaryProps {
  sheetName: string;
  episodeNumber: string;
  stats: {
    total: number;
    completed: number;
    blank: number;
    modified: number;
  };
  remainingSheets: string[];
  onReview: () => void;
  onExport: () => void;
  onNextSheet: () => void;
  onBackToSetup: () => void;
  onContinueEditing?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const CompletionSummary: React.FC<CompletionSummaryProps> = ({
  sheetName,
  episodeNumber,
  stats,
  remainingSheets,
  onReview,
  onExport,
  onNextSheet,
  onBackToSetup,
  onContinueEditing,
}) => {
  const completionPercent = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const hasRemainingSheets = remainingSheets.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-lg space-y-4">

        {/* Header — tight, editorial */}
        <div className="relative text-center">
          {/* Wide green ambient glow — sits behind content, visible only at edges */}
          <style>{`
            @keyframes headerGlow {
              0% { opacity: 0; }
              40% { opacity: 1; }
              100% { opacity: 0.7; }
            }
            @keyframes headerBreathe {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.05); }
            }
          `}</style>
          <div
            className="absolute opacity-0 pointer-events-none"
            style={{
              zIndex: 0,
              top: '50%',
              left: '50%',
              width: '360px',
              height: '180px',
              marginTop: '-30px',
              marginLeft: '-180px',
              background: 'radial-gradient(ellipse 100% 80% at center, rgba(16,185,129,0.35) 0%, rgba(5,150,105,0.15) 40%, transparent 70%)',
              animation: 'headerGlow 3s ease-in-out 0.4s forwards',
              filter: 'blur(24px)',
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              zIndex: 0,
              top: '50%',
              left: '50%',
              width: '360px',
              height: '180px',
              marginTop: '-30px',
              marginLeft: '-180px',
              background: 'radial-gradient(ellipse 100% 80% at center, rgba(16,185,129,0.30) 0%, rgba(5,150,105,0.10) 40%, transparent 70%)',
              animation: 'headerBreathe 5s ease-in-out 3.4s infinite',
              filter: 'blur(24px)',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          />
          {/* Content layer — opaque bg blocks glow from showing through elements */}
          <div className="relative space-y-1" style={{ zIndex: 1 }}>
            <div
              className="inline-flex items-center justify-center w-10 h-10 bg-black dark:bg-white mb-2"
              style={{ borderRadius: '3px' }}
            >
              <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">
              Sheet Complete
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {sheetName}{episodeNumber ? ` — Episode ${episodeNumber}` : ''}
            </p>
          </div>
        </div>

        {/* Stats — single dense card */}
        <Card variant="elevated" className="p-0 overflow-hidden">
          {/* Progress strip */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex justify-between items-baseline mb-2">
              <Label className="text-xs">Progress</Label>
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                {completionPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 overflow-hidden" style={{ borderRadius: '3px' }}>
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${completionPercent}%`,
                  borderRadius: '3px',
                  background: completionPercent === 100
                    ? '#000'
                    : '#000',
                }}
              />
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-4 border-t border-black dark:border-gray-600">
            <div className="px-3 py-3 text-center border-r border-gray-200 dark:border-gray-700">
              <div className="text-lg font-black text-gray-900 dark:text-gray-100">{stats.total.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Total</div>
            </div>
            <div className="px-3 py-3 text-center border-r border-gray-200 dark:border-gray-700">
              <div className="text-lg font-black text-green-700 dark:text-green-400">{stats.completed.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Done</div>
            </div>
            <div className="px-3 py-3 text-center border-r border-gray-200 dark:border-gray-700">
              <div className="text-lg font-black text-gray-400 dark:text-gray-500">{stats.blank.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Blank</div>
            </div>
            <div className="px-3 py-3 text-center">
              <div className="text-lg font-black text-blue-700 dark:text-blue-400">{stats.modified.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Edited</div>
            </div>
          </div>
        </Card>

        {/* Primary action */}
        {hasRemainingSheets ? (
          <Button
            variant="primary"
            onClick={onNextSheet}
            fullWidth
            size="lg"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            }
            iconPosition="right"
          >
            Next Sheet
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onExport}
            fullWidth
            size="lg"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
            iconPosition="right"
          >
            Export CSV
          </Button>
        )}

        {/* Secondary actions — compact row */}
        <div className="flex gap-2">
          {onContinueEditing && (
            <Button variant="secondary" onClick={onContinueEditing} className="flex-1" size="sm">
              Continue Editing
            </Button>
          )}
          <Button variant="secondary" onClick={onReview} className="flex-1" size="sm">
            Review & Edit
          </Button>
          {hasRemainingSheets && (
            <Button variant="secondary" onClick={onExport} className="flex-1" size="sm">
              Export CSV
            </Button>
          )}
        </div>

        {/* Remaining sheets — compact */}
        {hasRemainingSheets && (
          <div className="flex items-start gap-2 px-1">
            <Caption className="whitespace-nowrap mt-0.5 text-xs">
              Up next ({remainingSheets.length}):
            </Caption>
            <div className="flex flex-wrap gap-1.5">
              {remainingSheets.map((sheet, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600"
                  style={{ borderRadius: '3px' }}
                >
                  {sheet}
                </span>
              ))}
            </div>
          </div>
        )}

        {!hasRemainingSheets && (
          <div className="text-center py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
              All sheets complete
            </span>
          </div>
        )}

        {/* Back link */}
        <div className="text-center pt-1">
          <button
            onClick={onBackToSetup}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 uppercase tracking-wider font-semibold"
          >
            ← Back to Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionSummary;
