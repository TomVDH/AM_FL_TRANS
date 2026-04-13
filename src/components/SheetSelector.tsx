'use client';

import React, { useState, useMemo } from 'react';

interface SheetInfo {
  name: string;
  rowCount?: number;
  translatedCount?: number;
  isSelected?: boolean;
}

interface SheetSelectorProps {
  sheets: string[];
  selectedSheet: string;
  onSelectSheet: (sheet: string) => void;
  workbookData?: any;
  startRow?: number;
  translationColumnLetter?: string;
}

/**
 * SheetSelector Component
 *
 * Compact list selector for Excel sheets.
 * Shows sheet names with row counts and visual selection state.
 */
const SheetSelector: React.FC<SheetSelectorProps> = ({
  sheets,
  selectedSheet,
  onSelectSheet,
  workbookData,
  startRow = 2,
  translationColumnLetter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate row counts and translation fill for each sheet
  const sheetsWithInfo = useMemo((): SheetInfo[] => {
    return sheets.map(sheetName => {
      let rowCount = 0;
      let translatedCount = 0;

      if (workbookData?.Sheets?.[sheetName]) {
        const worksheet = workbookData.Sheets[sheetName];
        const range = worksheet['!ref'];
        if (range) {
          const match = range.match(/:([A-Z]+)(\d+)$/);
          if (match) {
            const lastRow = parseInt(match[2], 10);
            const tlCol = translationColumnLetter || null;
            for (let row = startRow; row <= lastRow; row++) {
              const cellA = worksheet[`A${row}`];
              if (cellA && cellA.v !== undefined && cellA.v !== null && cellA.v.toString().trim() !== '') {
                rowCount++;
                // Check if translation column has content
                if (tlCol) {
                  const tlCell = worksheet[`${tlCol}${row}`];
                  if (tlCell && tlCell.v !== undefined && tlCell.v !== null && tlCell.v.toString().trim() !== '' && tlCell.v.toString().trim() !== '[BLANK, REMOVE LATER]') {
                    translatedCount++;
                  }
                }
              }
            }
          }
        }
      }

      return {
        name: sheetName,
        rowCount,
        translatedCount,
        isSelected: sheetName === selectedSheet
      };
    });
  }, [sheets, workbookData, selectedSheet, startRow, translationColumnLetter]);

  // Filter sheets by search term
  const filteredSheets = useMemo(() => {
    if (!searchTerm.trim()) return sheetsWithInfo;
    const term = searchTerm.toLowerCase();
    return sheetsWithInfo.filter(sheet =>
      sheet.name.toLowerCase().includes(term)
    );
  }, [sheetsWithInfo, searchTerm]);

  // Calculate total rows across all sheets
  const totalRows = useMemo(() => {
    return sheetsWithInfo.reduce((sum, sheet) => sum + (sheet.rowCount || 0), 0);
  }, [sheetsWithInfo]);

  // Extract episode/category from sheet name for grouping display
  const getSheetCategory = (name: string): string => {
    const match = name.match(/^(E\d+)_/i);
    return match ? match[1].toUpperCase() : 'Other';
  };

  const getSheetDisplayName = (name: string): string => {
    // Remove common suffixes and prefixes for cleaner display
    return name
      .replace(/_localization$/i, '')
      .replace(/^E\d+_/i, '')
      .replace(/_/g, ' ');
  };

  return (
    <div className="space-y-2">
      {/* Header with search */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase">
            Select Sheet
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({sheets.length})
          </span>
        </div>

        {/* Search input */}
        {sheets.length > 5 && (
          <div className="relative">
            <input
              type="text"
              placeholder="Filter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-28 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20"
              style={{ borderRadius: '3px' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sheet list */}
      {filteredSheets.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-xs">
          No sheets match &quot;{searchTerm}&quot;
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-600 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar" style={{ borderRadius: '3px' }}>
          {filteredSheets.map((sheet, index) => (
            <button
              key={sheet.name}
              onClick={() => onSelectSheet(sheet.name)}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-left transition-all duration-200 ${
                sheet.isSelected
                  ? 'bg-green-50 dark:bg-green-900/20 border-l-3 border-l-green-500'
                  : 'bg-white dark:bg-gray-800 border-l-3 border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-3'
              } ${index !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* Category badge */}
                <span className={`shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                  sheet.isSelected
                    ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`} style={{ borderRadius: '2px' }}>
                  {getSheetCategory(sheet.name)}
                </span>

                {/* Sheet name */}
                <span className={`text-xs font-medium truncate ${
                  sheet.isSelected
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {getSheetDisplayName(sheet.name)}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Row count + percentage */}
                {sheet.rowCount !== undefined && sheet.rowCount > 0 ? (
                  <>
                    <span className={`text-[10px] ${
                      sheet.isSelected
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {sheet.rowCount}
                    </span>
                    {sheet.translatedCount !== undefined && (
                      <span className={`text-[9px] font-medium px-1 py-0.5 ${
                        sheet.translatedCount === sheet.rowCount
                          ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                          : sheet.translatedCount === 0
                            ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                            : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30'
                      }`} style={{ borderRadius: '2px' }}>
                        {Math.round((sheet.translatedCount / sheet.rowCount) * 100)}%
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">...</span>
                )}

                {/* Selected indicator */}
                {sheet.isSelected && (
                  <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Total rows across all sheets */}
      {totalRows > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
            Total to translate
          </span>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
            {totalRows.toLocaleString()} rows
          </span>
        </div>
      )}
    </div>
  );
};

export default SheetSelector;
