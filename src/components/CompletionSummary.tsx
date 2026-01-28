'use client';

import React from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import { Title, Body, Caption, Label } from './ui/Typography';

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
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * CompletionSummary Component
 *
 * Displays a summary screen after a translation sheet is complete.
 * Shows statistics, progress, and navigation options for the next steps.
 *
 * Features:
 * - Celebratory header with checkmark icon
 * - Stats card with completion metrics
 * - Visual progress bar
 * - Action buttons for review, export, and navigation
 * - Remaining sheets list
 * - Dark mode support
 *
 * @component
 */
const CompletionSummary: React.FC<CompletionSummaryProps> = ({
  sheetName,
  episodeNumber,
  stats,
  remainingSheets,
  onReview,
  onExport,
  onNextSheet,
  onBackToSetup,
}) => {
  const completionPercent = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const hasRemainingSheets = remainingSheets.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Section with Gradient */}
        <div
          className="p-6 text-center"
          style={{
            borderRadius: '3px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)'
          }}
        >
          {/* Celebratory Checkmark Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm mb-4" style={{ borderRadius: '3px' }}>
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            Sheet Complete: &ldquo;{sheetName}&rdquo;
          </h1>
          {episodeNumber && (
            <p className="text-white/80 text-sm font-medium">
              Episode {episodeNumber}
            </p>
          )}
        </div>

        {/* Stats Card */}
        <Card variant="elevated" className="p-6">
          <div className="space-y-4">
            {/* Stats Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <Label>Stats</Label>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Caption>Completion Progress</Caption>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {completionPercent}%
                </span>
              </div>
              <div
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 overflow-hidden"
                style={{ borderRadius: '3px' }}
              >
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${completionPercent}%`,
                    borderRadius: '3px',
                    background: completionPercent === 100
                      ? 'linear-gradient(90deg, #10B981, #059669)'
                      : 'linear-gradient(90deg, #3B82F6, #2563EB)'
                  }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" style={{ borderRadius: '3px' }}>
                <Caption>Total Entries</Caption>
                <Title className="mt-1">{stats.total.toLocaleString()}</Title>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" style={{ borderRadius: '3px' }}>
                <Caption className="text-green-700 dark:text-green-400">Translated</Caption>
                <Title className="mt-1 text-green-700 dark:text-green-400">
                  {stats.completed.toLocaleString()} ({completionPercent}%)
                </Title>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" style={{ borderRadius: '3px' }}>
                <Caption>Blank</Caption>
                <Title className="mt-1">{stats.blank.toLocaleString()}</Title>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" style={{ borderRadius: '3px' }}>
                <Caption className="text-blue-700 dark:text-blue-400">Modified This Session</Caption>
                <Title className="mt-1 text-blue-700 dark:text-blue-400">
                  {stats.modified.toLocaleString()}
                </Title>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={onReview}
            className="flex-1"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            }
          >
            Review & Edit
          </Button>

          <Button
            variant="secondary"
            onClick={onExport}
            className="flex-1"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            onClick={onNextSheet}
            disabled={!hasRemainingSheets}
            className="flex-1"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            }
            iconPosition="right"
          >
            Next Sheet
          </Button>
        </div>

        {/* Remaining Sheets Section */}
        <Card className="p-4">
          {hasRemainingSheets ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <Caption>
                  Remaining sheets: {remainingSheets.length}
                </Caption>
              </div>
              <div className="flex flex-wrap gap-2">
                {remainingSheets.map((sheet, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                    style={{ borderRadius: '3px' }}
                  >
                    {sheet}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Body className="font-bold text-green-600 dark:text-green-400">
                  All sheets complete!
                </Body>
              </div>
            </div>
          )}
        </Card>

        {/* Back to Setup Link */}
        <div className="text-center">
          <button
            onClick={onBackToSetup}
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionSummary;
