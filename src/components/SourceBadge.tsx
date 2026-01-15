'use client';

import React from 'react';
import { HighlightSource, SOURCE_LABELS, SOURCE_COLORS } from '../types/highlighting';

interface SourceBadgeProps {
  source: HighlightSource;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

/**
 * SourceBadge Component
 *
 * Displays a colored badge indicating the data source of a highlight match.
 * Used to clearly identify where translation data comes from.
 */
const SourceBadge: React.FC<SourceBadgeProps> = ({
  source,
  size = 'sm',
  showIcon = true,
}) => {
  const colors = SOURCE_COLORS[source];
  const label = SOURCE_LABELS[source];

  const sizeClasses = size === 'sm'
    ? 'text-[9px] px-1.5 py-0.5'
    : 'text-xs px-2 py-1';

  const icons: Record<HighlightSource, React.ReactNode> = {
    json: (
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    xlsx: (
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    character: (
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    codex: (
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  };

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeClasses} ${colors.bg} ${colors.text} border ${colors.border} font-semibold uppercase tracking-wide`}
      style={{ borderRadius: '2px' }}
    >
      {showIcon && icons[source]}
      {label}
    </span>
  );
};

export default SourceBadge;
