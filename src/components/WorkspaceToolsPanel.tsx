'use client';

import React, { useState, useEffect } from 'react';

type TabId = 'reference' | 'quickref' | 'output' | 'bulk';

interface WorkspaceToolsPanelProps {
  // Which tab to force-open (set by R/O toggles in toolbar)
  forceTab?: TabId | null;
  onForceTabHandled?: () => void;

  // Reference tab content (render prop)
  renderReference: () => React.ReactNode;
  // Quick Ref tab content (render prop)
  renderQuickRef: () => React.ReactNode;
  // Output tab content (render prop)
  renderOutput: () => React.ReactNode;
  // Bulk Translate tab content (render prop)
  renderBulkTranslate: () => React.ReactNode;

  // Summary badges
  referenceCount?: number;
  memoryMatchCount?: number;
  outputCount?: number;
  bulkStatus?: string;
}

export default function WorkspaceToolsPanel({
  forceTab,
  onForceTabHandled,
  renderReference,
  renderQuickRef,
  renderOutput,
  renderBulkTranslate,
  referenceCount,
  memoryMatchCount,
  outputCount,
  bulkStatus,
}: WorkspaceToolsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('workspaceToolsTab') as TabId) || 'reference';
    }
    return 'reference';
  });

  // Persist active tab
  useEffect(() => {
    localStorage.setItem('workspaceToolsTab', activeTab);
  }, [activeTab]);

  // Handle force-open from R/O toggles
  useEffect(() => {
    if (forceTab) {
      setIsExpanded(true);
      setActiveTab(forceTab);
      onForceTabHandled?.();
    }
  }, [forceTab, onForceTabHandled]);

  const tabs: { id: TabId; label: string; badge?: string }[] = [
    { id: 'reference', label: 'Reference', badge: referenceCount ? String(referenceCount) : undefined },
    { id: 'quickref', label: 'Quick Ref', badge: memoryMatchCount ? String(memoryMatchCount) : undefined },
    { id: 'output', label: 'Output', badge: outputCount ? String(outputCount) : undefined },
    { id: 'bulk', label: 'Bulk Translate', badge: bulkStatus || undefined },
  ];

  // Build collapsed summary
  const summaryParts: string[] = [];
  if (referenceCount) summaryParts.push(`${referenceCount} refs`);
  if (memoryMatchCount) summaryParts.push(`${memoryMatchCount} matches`);
  if (outputCount) summaryParts.push(`${outputCount} entries`);
  const summaryText = summaryParts.length > 0 ? summaryParts.join(' · ') : 'collapsed';

  return (
    <div className="border-t border-gray-200/60 dark:border-gray-700/60">
      {/* Collapsed / Expand Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className={`w-3 h-3 text-gray-400 dark:text-gray-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-[11px] font-semibold uppercase tracking-wider">Tools & Data</span>
          {!isExpanded && summaryParts.length > 0 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal normal-case tracking-normal">
              — {summaryText}
            </span>
          )}
        </span>
        {isExpanded && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500">collapse</span>
        )}
      </button>

      {/* Expanded: Tab Bar + Content */}
      {isExpanded && (
        <div>
          {/* Tab Bar */}
          <div className="flex px-4 gap-1 border-b border-gray-200/60 dark:border-gray-700/60">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200'
                    : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className={`px-1 py-0.5 text-[9px] font-semibold ${
                    tab.id === 'bulk' && tab.badge.endsWith('%')
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="px-4 py-3">
            {activeTab === 'reference' && renderReference()}
            {activeTab === 'quickref' && renderQuickRef()}
            {activeTab === 'output' && renderOutput()}
            {activeTab === 'bulk' && renderBulkTranslate()}
          </div>
        </div>
      )}
    </div>
  );
}
