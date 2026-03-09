'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import CodexEditor from './CodexEditor';
import StyleAnalysisPanel from './StyleAnalysisPanel';

type TabId = 'codex' | 'styles' | 'settings';

interface ReferenceConfigPanelProps {
  // Codex
  totalEntries: number;
  isLoadingCodex: boolean;
  refreshCodex: () => void;
  onCodexUpdated: () => void;

  // Style Analysis summary (read from StyleAnalysisPanel's own state — we just show count in badge)
  styleEnrichedCount?: number;
  styleTotalCount?: number;

  // Settings: file type
  fileType: 'excel' | 'json' | 'csv';
  onFileTypeChange: (type: 'excel' | 'json' | 'csv') => void;

  // Settings: input mode
  inputMode: 'excel' | 'embedded-json' | 'manual';
  setInputMode: (mode: 'excel' | 'embedded-json' | 'manual') => void;

  // Settings: reset
  setShowResetModal?: (show: boolean) => void;

  // Settings: file list refresh (called after download/reset to update the file dropdown)
  onFilesChanged?: () => void;

  // Expand state callback
  onExpandChange?: (expanded: boolean) => void;

  // Dark mode (for styling consistency)
  darkMode?: boolean;
}

export default function ReferenceConfigPanel({
  totalEntries,
  isLoadingCodex,
  refreshCodex,
  onCodexUpdated,
  styleEnrichedCount,
  styleTotalCount,
  fileType,
  onFileTypeChange,
  inputMode,
  setInputMode,
  setShowResetModal,
  onFilesChanged,
  onExpandChange,
}: ReferenceConfigPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('refConfigActiveTab') as TabId) || 'codex';
    }
    return 'codex';
  });

  // Persist active tab
  useEffect(() => {
    localStorage.setItem('refConfigActiveTab', activeTab);
  }, [activeTab]);

  const tabs: { id: TabId; label: string; badge?: string }[] = [
    { id: 'codex', label: 'Codex', badge: totalEntries > 0 ? String(totalEntries) : undefined },
    {
      id: 'styles',
      label: 'Styles',
      badge: styleEnrichedCount !== undefined && styleTotalCount !== undefined
        ? `${styleEnrichedCount}/${styleTotalCount}`
        : undefined,
    },
    { id: 'settings', label: 'Settings' },
  ];

  // Build collapsed summary text
  const summaryParts: string[] = [];
  if (totalEntries > 0) summaryParts.push(`${totalEntries} codex`);
  if (styleEnrichedCount !== undefined && styleTotalCount !== undefined) {
    summaryParts.push(`${styleEnrichedCount}/${styleTotalCount} enriched`);
  }
  summaryParts.push(`${fileType.toUpperCase()} mode`);
  const summaryText = summaryParts.join(' \u00b7 ');

  return (
    <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
      {/* Collapsed / Expand Header */}
      <button
        onClick={() => { const next = !isExpanded; setIsExpanded(next); onExpandChange?.(next); }}
        className="w-full flex items-center justify-between py-1.5 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-sm font-bold tracking-tight">Reference & Config</span>
          {!isExpanded && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {summaryText}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded: Tab Bar + Content — wider than parent for breathing room */}
      {isExpanded && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-8 md:-mx-12" style={{ borderRadius: '3px' }}>
          {/* Tab Bar */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Codex refresh button — only visible on codex tab */}
            {activeTab === 'codex' && (
              <div className="ml-auto flex items-center pr-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshCodex();
                  }}
                  disabled={isLoadingCodex}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                  title="Refresh codex"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${isLoadingCodex ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {activeTab === 'codex' && (
              <CodexEditor onCodexUpdated={onCodexUpdated} />
            )}

            {activeTab === 'styles' && (
              <StyleAnalysisPanel embedded />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-5">
                {/* File type selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">File Type</label>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                    Choose the source format. Excel loads .xlsx files from <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-[10px]">/excels</code>, JSON/CSV from <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-[10px]">/data</code>.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-0.5 inline-flex" style={{ borderRadius: '3px' }}>
                    {(['excel', 'json', 'csv'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => onFileTypeChange(type)}
                        aria-pressed={fileType === type}
                        className={`px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-200 ${
                          fileType === type
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        style={{ borderRadius: '2px' }}
                      >
                        {type === 'excel' ? 'XLS' : type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input mode selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Input Mode</label>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                    Excel reads columns from a spreadsheet. JSON loads structured data. Manual lets you paste text directly.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-0.5 inline-flex" style={{ borderRadius: '3px' }}>
                    {(['excel', 'embedded-json', 'manual'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setInputMode(mode)}
                        className={`px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-200 ${
                          inputMode === mode
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        style={{ borderRadius: '2px' }}
                      >
                        {mode === 'embedded-json' ? 'JSON' : mode === 'excel' ? 'Excel' : 'Manual'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data management actions */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
                  {/* Reset to originals */}
                  {setShowResetModal && (
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="group h-8 px-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 transition-colors"
                      style={{ borderRadius: '3px' }}
                      title="Reset all data to original state"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reset to originals</span>
                    </button>
                  )}

                  {/* Download fresh sheets from Google */}
                  <button
                    onClick={async () => {
                      setIsDownloading(true);
                      try {
                        const res = await fetch('/api/download-sheets', { method: 'POST' });
                        const data = await res.json();
                        if (res.ok && data.success) {
                          toast.success('Sheets downloaded from Google');
                          onFilesChanged?.();
                        } else {
                          toast.error(data.error || 'Download failed');
                        }
                      } catch (err) {
                        toast.error('Network error — could not reach server');
                      } finally {
                        setIsDownloading(false);
                      }
                    }}
                    disabled={isDownloading}
                    className="group h-8 px-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    style={{ borderRadius: '3px' }}
                    title="Download fresh copies of all sheets from Google Drive"
                  >
                    {isDownloading ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                    <span>{isDownloading ? 'Downloading...' : 'Download from Google'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
