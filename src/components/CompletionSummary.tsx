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
    <div className="min-h-screen bg-[#111827] text-[#f9fafb] p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">

        {/* Header — flat, no decorative glow (Flat-at-Rest Rule) */}
        <div className="text-center space-y-3">
          <div
            className="inline-flex items-center justify-center w-10 h-10 bg-[#f9fafb] rounded-[3px]"
            aria-hidden="true"
          >
            <svg className="w-6 h-6 text-[#111827]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-[-0.025em] text-[#f9fafb] uppercase">
            Sheet Complete
          </h1>
          <p className="text-xs uppercase tracking-[0.05em] font-bold text-[#9ca3af]">
            {sheetName}{episodeNumber ? ` · Episode ${episodeNumber}` : ''}
          </p>
        </div>

        {/* Stats — single dense surface, no card-in-card */}
        <Card variant="default" className="p-0 overflow-hidden">
          {/* Progress strip */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-[11px] font-black uppercase tracking-[0.05em] text-[#9ca3af]">Progress</span>
              <span className="text-3xl font-black tracking-[-0.025em] text-[#f9fafb] tabular-nums">
                {completionPercent}%
              </span>
            </div>
            <div className="w-full h-1 bg-[#374151] overflow-hidden rounded-[2px]">
              <div
                className="h-full bg-[#f9fafb] transition-[width] duration-500 ease-out rounded-[2px]"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Stat row — weight + tabular-nums create the hierarchy, not color */}
          <div className="grid grid-cols-4 border-t border-[#374151]">
            <div className="px-3 py-4 text-center border-r border-[#374151]">
              <div className="text-lg font-black text-[#f9fafb] tabular-nums">{stats.total.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#9ca3af] font-bold mt-1">Total</div>
            </div>
            <div className="px-3 py-4 text-center border-r border-[#374151]">
              <div className="text-lg font-black text-[#f9fafb] tabular-nums">{stats.completed.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#9ca3af] font-bold mt-1">Done</div>
            </div>
            <div className="px-3 py-4 text-center border-r border-[#374151]">
              <div className="text-lg font-black text-[#6b7280] tabular-nums">{stats.blank.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#9ca3af] font-bold mt-1">Blank</div>
            </div>
            <div className="px-3 py-4 text-center">
              <div className="text-lg font-black text-[#f9fafb] tabular-nums">{stats.modified.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#9ca3af] font-bold mt-1">Edited</div>
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

        {/* Remaining sheets */}
        {hasRemainingSheets && (
          <div className="flex items-start gap-3 px-1">
            <span className="whitespace-nowrap mt-0.5 text-[10px] uppercase tracking-[0.05em] font-bold text-[#9ca3af]">
              Up next ({remainingSheets.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {remainingSheets.map((sheet, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold tracking-[0.02em] bg-[#1f2937] text-[#f9fafb] border border-[#4b5563] rounded-[3px]"
                >
                  {sheet}
                </span>
              ))}
            </div>
          </div>
        )}

        {!hasRemainingSheets && (
          <div className="text-center pt-1">
            <span className="text-[10px] font-black uppercase tracking-[0.05em] text-[#9ca3af]">
              All sheets complete
            </span>
          </div>
        )}

        {/* Back link */}
        <div className="text-center pt-2">
          <button
            onClick={onBackToSetup}
            className="text-[10px] text-[#6b7280] hover:text-[#f9fafb] transition-colors duration-200 uppercase tracking-[0.05em] font-bold"
          >
            ← Back to Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionSummary;
