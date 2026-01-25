'use client';

import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';

interface PreviewRow {
  rowNumber: number;
  english: string;
  translation: string;
  isEmpty: boolean;
}

interface PreviewData {
  rows: PreviewRow[];
  totalRows: number;
  emptyCount: number;
  sourceHeader: string;
  targetHeader: string;
}

interface SheetPreviewProps {
  workbook: XLSX.WorkBook | null;
  sheetName: string;
  sourceColumn: string;
  targetColumn: string;
  startRow: number;
  languageCode: string;
}

/**
 * SheetPreview Component
 *
 * Excel-style preview showing sample rows from beginning, middle, and end.
 * Styled to look like a cut from an actual Excel spreadsheet.
 */
const SheetPreview: React.FC<SheetPreviewProps> = ({
  workbook,
  sheetName,
  sourceColumn,
  targetColumn,
  startRow,
  languageCode,
}) => {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounced data fetch
  useEffect(() => {
    if (!workbook || !sheetName) {
      setPreviewData(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      try {
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet || !worksheet['!ref']) {
          setError('Sheet is empty or invalid');
          setLoading(false);
          return;
        }

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const lastRow = range.e.r;
        const totalDataRows = Math.max(0, lastRow - startRow + 2);

        // Get header texts
        const sourceColIndex = sourceColumn.charCodeAt(0) - 65;
        const targetColIndex = targetColumn.charCodeAt(0) - 65;

        const sourceHeaderCell = XLSX.utils.encode_cell({ r: 0, c: sourceColIndex });
        const targetHeaderCell = XLSX.utils.encode_cell({ r: 0, c: targetColIndex });

        const sourceHeader = worksheet[sourceHeaderCell]?.v?.toString() || 'English';
        const targetHeader = worksheet[targetHeaderCell]?.v?.toString() || languageCode;

        // Get first 10 data rows
        const sampleIndices: number[] = [];
        for (let i = 0; i < 10 && startRow + i - 1 <= lastRow; i++) {
          sampleIndices.push(startRow + i);
        }

        // Extract row data
        const rows: PreviewRow[] = [];
        let emptyCount = 0;

        for (const rowNum of sampleIndices) {
          const excelRow = rowNum - 1; // Convert to 0-based
          const sourceCell = XLSX.utils.encode_cell({ r: excelRow, c: sourceColIndex });
          const targetCell = XLSX.utils.encode_cell({ r: excelRow, c: targetColIndex });

          const english = worksheet[sourceCell]?.v?.toString()?.trim() || '';
          const translation = worksheet[targetCell]?.v?.toString()?.trim() || '';
          const isEmpty = !translation;

          if (isEmpty) emptyCount++;

          rows.push({
            rowNumber: rowNum,
            english,
            translation,
            isEmpty,
          });
        }

        // Count total empty cells in translation column
        let totalEmpty = 0;
        for (let row = startRow - 1; row <= lastRow; row++) {
          const cell = XLSX.utils.encode_cell({ r: row, c: targetColIndex });
          if (!worksheet[cell]?.v?.toString()?.trim()) {
            totalEmpty++;
          }
        }

        setPreviewData({
          rows,
          totalRows: totalDataRows,
          emptyCount: totalEmpty,
          sourceHeader,
          targetHeader,
        });
        setLoading(false);
      } catch (err) {
        console.error('Preview error:', err);
        setError('Failed to load preview');
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [workbook, sheetName, sourceColumn, targetColumn, startRow, languageCode]);

  // Group rows for display (with separators) - moved outside of conditionals
  const groupedRows = useMemo(() => {
    if (!previewData) return [];

    const groups: { type: 'row' | 'separator'; data?: PreviewRow }[] = [];
    let lastRowNum = 0;

    for (const row of previewData.rows) {
      if (lastRowNum > 0 && row.rowNumber - lastRowNum > 1) {
        groups.push({ type: 'separator' });
      }
      groups.push({ type: 'row', data: row });
      lastRowNum = row.rowNumber;
    }

    return groups;
  }, [previewData]);

  if (!workbook || !sheetName) {
    return null;
  }

  if (loading) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden" style={{ borderRadius: '3px' }}>
        <div className="p-8 text-center">
          <div className="inline-block w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded p-4" style={{ borderRadius: '3px' }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-red-700 dark:text-red-300 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (!previewData) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Sheet Preview
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {previewData.totalRows} rows
        </span>
      </div>

      {/* Excel-style table */}
      <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden" style={{ borderRadius: '3px' }}>
        {/* Header row - Excel green */}
        <div className="grid grid-cols-[40px_1fr_1fr] bg-[#217346] text-white text-xs font-semibold">
          <div className="px-2 py-1.5 border-r border-[#1e6a3f] text-center text-[10px]">

          </div>
          <div className="px-3 py-1.5 border-r border-[#1e6a3f]">
            <span className="text-[10px] opacity-70">{sourceColumn}</span>
            <span className="mx-1.5">·</span>
            {previewData.sourceHeader}
          </div>
          <div className="px-3 py-1.5">
            <span className="text-[10px] opacity-70">{targetColumn}</span>
            <span className="mx-1.5">·</span>
            {previewData.targetHeader}
          </div>
        </div>

        {/* Data rows */}
        <div className="max-h-64 overflow-y-auto">
          {groupedRows.map((item, idx) => {
            if (item.type === 'separator') {
              return (
                <div key={`sep-${idx}`} className="grid grid-cols-[40px_1fr_1fr] bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs">
                  <div className="px-2 py-1 text-center">⋮</div>
                  <div className="px-3 py-1 border-l border-gray-200 dark:border-gray-700">⋮</div>
                  <div className="px-3 py-1 border-l border-gray-200 dark:border-gray-700">⋮</div>
                </div>
              );
            }

            const row = item.data!;
            const isEven = row.rowNumber % 2 === 0;

            return (
              <div
                key={row.rowNumber}
                className={`grid grid-cols-[40px_1fr_1fr] text-xs border-t border-gray-200 dark:border-gray-700 ${
                  isEven ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
                }`}
              >
                {/* Row number */}
                <div className="px-2 py-1.5 text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 font-mono text-[10px]">
                  {row.rowNumber}
                </div>

                {/* English column */}
                <div className="px-3 py-1.5 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 truncate">
                  {row.english || <span className="text-gray-300 dark:text-gray-600 italic">empty</span>}
                </div>

                {/* Translation column */}
                <div className={`px-3 py-1.5 truncate ${
                  row.isEmpty
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-400 dark:text-orange-500 italic'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {row.translation || '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning/info banner */}
      {previewData.emptyCount > 0 && (
        <div className={`flex items-center gap-2 px-3 py-2 text-xs rounded ${
          previewData.emptyCount > previewData.totalRows * 0.5
            ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
        }`} style={{ borderRadius: '3px' }}>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {previewData.emptyCount} of {previewData.totalRows} cells empty in {languageCode} column
          </span>
        </div>
      )}

      {previewData.emptyCount === 0 && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 rounded" style={{ borderRadius: '3px' }}>
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>All cells populated</span>
        </div>
      )}
    </div>
  );
};

export default SheetPreview;
