'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import Button from './ui/Button';
import { Input, Select } from './ui/Input';

// ============================================================================
// TYPES
// ============================================================================

interface CodexEntry {
  name: string;
  description: string;
  english: string;
  dutch: string;
  category: string;
  nicknames?: string;
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
}

interface CodexEditorProps {
  onCodexUpdated?: () => void;
}

// ============================================================================
// ICONS
// ============================================================================

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ============================================================================
// COLLAPSIBLE SECTION
// ============================================================================

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultOpen = false,
  children,
  badge
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-200" style={{ borderRadius: '3px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            {title}
          </span>
          {badge}
        </div>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CSV PARSER
// ============================================================================

function parseCSVRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function parseCSVContent(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

// ============================================================================
// IMPORT SECTION
// ============================================================================

const REQUIRED_COLUMNS = ['name', 'english', 'dutch', 'category'];

interface ImportSectionProps {
  onImport: (entries: CodexEntry[]) => Promise<void>;
}

const ImportSection: React.FC<ImportSectionProps> = ({ onImport }) => {
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [allRows, setAllRows] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError('');
    setPreview([]);
    setAllRows([]);
    setHeaders([]);

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { headers: parsedHeaders, rows } = parseCSVContent(content);

        // Validate required columns
        const missingColumns = REQUIRED_COLUMNS.filter(col => !parsedHeaders.includes(col));
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        setHeaders(parsedHeaders);
        setAllRows(rows);
        setPreview(rows.slice(0, 5));
      } catch (err) {
        setError('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleReplace = async () => {
    setIsLoading(true);
    try {
      const entries: CodexEntry[] = allRows.map(row => ({
        name: row.name || '',
        description: row.description || 'Character',
        english: row.english || '',
        dutch: row.dutch || '',
        category: row.category || 'CHARACTER',
        nicknames: row.nicknames || '',
        bio: row.bio || '',
        gender: row.gender || '',
        dialogueStyle: row.dialoguestyle || row.dialogueStyle || '',
      }));

      await onImport(entries);
      setPreview([]);
      setAllRows([]);
      setHeaders([]);
      setShowConfirm(false);
    } catch (err) {
      setError('Failed to import codex');
    } finally {
      setIsLoading(false);
    }
  };

  const clearPreview = () => {
    setPreview([]);
    setAllRows([]);
    setHeaders([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="pt-4 space-y-4">
      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          p-6 border-2 border-dashed cursor-pointer transition-all duration-200 text-center
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50'
          }
        `}
        style={{ borderRadius: '3px' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />
        <UploadIcon />
        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Drop CSV file here or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Required columns: {REQUIRED_COLUMNS.join(', ')}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm" style={{ borderRadius: '3px' }}>
          {error}
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview ({allRows.length} total rows)
            </h4>
            <button
              onClick={clearPreview}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700" style={{ borderRadius: '3px' }}>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {REQUIRED_COLUMNS.map(col => (
                    <th key={col} className="px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {preview.map((row, idx) => (
                  <tr key={idx} className="bg-white dark:bg-gray-800">
                    {REQUIRED_COLUMNS.map(col => (
                      <td key={col} className="px-3 py-2 text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                        {row[col] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Replace Button */}
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={() => setShowConfirm(true)}
              isLoading={isLoading}
            >
              Replace Codex ({allRows.length} entries)
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 max-w-md w-full mx-4 shadow-xl" style={{ borderRadius: '3px' }}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Confirm Replace
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will replace the entire codex with {allRows.length} new entries.
              A backup will be created automatically. This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleReplace} isLoading={isLoading}>
                Replace Codex
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// QUICK ADD FORM
// ============================================================================

interface QuickAddFormProps {
  categories: string[];
  onAdd: (entry: CodexEntry) => Promise<void>;
}

const QuickAddForm: React.FC<QuickAddFormProps> = ({ categories, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    english: '',
    dutch: '',
    category: 'CHARACTER',
    nicknames: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.english || !formData.dutch) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await onAdd({
        name: formData.name,
        description: 'Character',
        english: formData.english,
        dutch: formData.dutch,
        category: formData.category,
        nicknames: formData.nicknames,
      });

      // Reset form
      setFormData({
        name: '',
        english: '',
        dutch: '',
        category: 'CHARACTER',
        nicknames: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Character name"
          size="sm"
        />
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          size="sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="OTHER">OTHER</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="English"
          value={formData.english}
          onChange={(e) => setFormData(prev => ({ ...prev, english: e.target.value }))}
          placeholder="English translation"
          size="sm"
        />
        <Input
          label="Translation"
          value={formData.dutch}
          onChange={(e) => setFormData(prev => ({ ...prev, dutch: e.target.value }))}
          placeholder="Translation"
          size="sm"
        />
      </div>

      <Input
        label="Nicknames (optional)"
        value={formData.nicknames}
        onChange={(e) => setFormData(prev => ({ ...prev, nicknames: e.target.value }))}
        placeholder="Separate with semicolons: Nick1;Nick2;Nick3"
        size="sm"
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        icon={<PlusIcon />}
      >
        Add Entry
      </Button>
    </form>
  );
};

// ============================================================================
// CONSTANTS
// ============================================================================

const FIXED_CATEGORIES = ['CHARACTER', 'LOCATION', 'MACHINES', 'WORLD', 'OTHER'];

// ============================================================================
// NICKNAME TAG INPUT
// ============================================================================

interface NicknameTagInputProps {
  value: string;
  onChange: (value: string) => void;
}

const NicknameTagInput: React.FC<NicknameTagInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const tags = value ? value.split(';').map(t => t.trim()).filter(Boolean) : [];

  const addTag = () => {
    if (inputValue.trim()) {
      const newTags = [...tags, inputValue.trim()];
      onChange(newTags.join(';'));
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags.join(';'));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="codex-nickname-tag inline-flex items-center gap-1 px-2 py-1 bg-transparent border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <XIcon />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add nickname..."
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          style={{ borderRadius: '3px' }}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addTag();
          }}
          disabled={!inputValue.trim()}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-xs font-bold uppercase disabled:opacity-50 transition-colors"
          style={{ borderRadius: '3px' }}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// DELETE CONFIRMATION DIALOG
// ============================================================================

interface DeleteConfirmDialogProps {
  entryName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  entryName,
  onConfirm,
  onCancel,
  isDeleting
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
    <div
      className="bg-white dark:bg-gray-800 p-6 max-w-md w-full mx-4 shadow-xl"
      style={{ borderRadius: '3px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
        Delete Entry?
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Are you sure you want to delete <strong>&quot;{entryName}&quot;</strong>? This action cannot be undone.
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold uppercase transition-colors"
          style={{ borderRadius: '3px' }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase disabled:opacity-50 transition-colors"
          style={{ borderRadius: '3px' }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ============================================================================
// CATEGORY BADGE
// ============================================================================

const getCategoryBadgeClass = (): string => {
  // Monochrome badges - gray variations only for clean developer aesthetic
  return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600';
};

// ============================================================================
// QUICK EDIT TABLE
// ============================================================================

interface QuickEditTableProps {
  entries: CodexEntry[];
  categories: string[];
  onUpdate: (entry: CodexEntry) => Promise<void>;
  onDelete: (name: string) => Promise<void>;
}

const QuickEditTable: React.FC<QuickEditTableProps> = ({ entries, categories, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CodexEntry>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Combine fixed categories with any custom ones from data
  const allCategories = useMemo(() => {
    const dataCategories = categories.filter(c => !FIXED_CATEGORIES.includes(c.toUpperCase()));
    return [...FIXED_CATEGORIES, ...dataCategories];
  }, [categories]);

  const filteredEntries = useMemo(() => {
    let filtered = entries;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(entry =>
        entry.category?.toUpperCase() === categoryFilter.toUpperCase()
      );
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(term) ||
        entry.english.toLowerCase().includes(term) ||
        entry.dutch.toLowerCase().includes(term) ||
        (entry.nicknames && entry.nicknames.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [entries, searchTerm, categoryFilter]);

  const handleRowClick = (entry: CodexEntry) => {
    if (editingName === entry.name) {
      setEditingName(null);
    } else {
      setEditingName(entry.name);
      setEditData({
        name: entry.name,
        english: entry.english,
        dutch: entry.dutch,
        category: entry.category,
        nicknames: entry.nicknames || '',
        description: entry.description || '',
        bio: entry.bio || '',
        gender: entry.gender || '',
        dialogueStyle: entry.dialogueStyle || '',
      });
    }
  };

  const handleSave = async (originalEntry: CodexEntry) => {
    setIsLoading(true);
    try {
      await onUpdate({
        ...originalEntry,
        ...editData,
      } as CodexEntry);
      setEditingName(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingName(null);
    setEditData({});
  };

  const handleDeleteClick = (name: string) => {
    setDeleteConfirm(name);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteConfirm);
      setDeleteConfirm(null);
      setEditingName(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, english, translation, or nickname..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-sm"
            style={{ borderRadius: '3px' }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XIcon />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          style={{ borderRadius: '3px', minWidth: '150px' }}
        >
          <option value="all">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Showing {filteredEntries.length} of {entries.length} entries
        {categoryFilter !== 'all' && ` in ${categoryFilter}`}
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ borderRadius: '3px' }}>
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  English
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Translation
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase w-24">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEntries.map((entry, index) => (
                <React.Fragment key={`${entry.name}-${entry.english}-${index}`}>
                  {/* Main row */}
                  <tr
                    onClick={() => handleRowClick(entry)}
                    className={`
                      cursor-pointer transition-colors
                      ${editingName === entry.name
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-medium">
                      {entry.name}
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                      {entry.english}
                    </td>
                    <td className="px-3 py-2 text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                      {entry.dutch}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`codex-category-badge inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase ${getCategoryBadgeClass()}`}>
                        {entry.category}
                      </span>
                    </td>
                  </tr>

                  {/* Edit row (expanded) - Full Field Editing */}
                  {editingName === entry.name && (
                    <tr className="bg-blue-50 dark:bg-blue-900/10">
                      <td colSpan={4} className="px-3 py-4">
                        <div className="space-y-4">
                          {/* Row 1: English, Dutch, Category */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                                English
                              </label>
                              <input
                                type="text"
                                value={editData.english || ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, english: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                style={{ borderRadius: '3px' }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                                Translation <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={editData.dutch || ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, dutch: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                style={{ borderRadius: '3px' }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                                Category
                              </label>
                              <select
                                value={editData.category || ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                style={{ borderRadius: '3px' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {allCategories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Row 2: Nicknames (Tag Input) */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                              Nicknames / Aliases
                            </label>
                            <NicknameTagInput
                              value={editData.nicknames || ''}
                              onChange={(value) => setEditData(prev => ({ ...prev, nicknames: value }))}
                            />
                          </div>

                          {/* Row 3: Optional Fields */}
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Optional Fields</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  value={editData.description || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="e.g., Character, Location"
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  style={{ borderRadius: '3px' }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                                  Bio
                                </label>
                                <input
                                  type="text"
                                  value={editData.bio || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                                  placeholder="Short biography"
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  style={{ borderRadius: '3px' }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                                  Gender
                                </label>
                                <select
                                  value={editData.gender || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  style={{ borderRadius: '3px' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="">Not specified</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                                  Dialogue Style
                                </label>
                                <input
                                  type="text"
                                  value={editData.dialogueStyle || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, dialogueStyle: e.target.value }))}
                                  placeholder="Speech pattern notes"
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  style={{ borderRadius: '3px' }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 justify-between pt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(entry.name);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-bold uppercase transition-colors"
                              style={{ borderRadius: '3px' }}
                            >
                              <XIcon />
                              Delete
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancel();
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase transition-colors"
                                style={{ borderRadius: '3px' }}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSave(entry);
                                }}
                                disabled={isLoading || !editData.dutch}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase disabled:opacity-50 transition-colors"
                                style={{ borderRadius: '3px' }}
                              >
                                <CheckIcon />
                                {isLoading ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || categoryFilter !== 'all'
                      ? 'No entries match your filters'
                      : 'No entries in codex'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <DeleteConfirmDialog
          entryName={deleteConfirm}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * CodexEditor Component
 *
 * A comprehensive editor for managing the codex/reference data.
 * Features:
 * - Import/Replace: Upload CSV files to replace the entire codex
 * - Quick Add: Inline form to add new entries
 * - Quick Edit: Searchable table with inline editing
 */
const CodexEditor: React.FC<CodexEditorProps> = ({ onCodexUpdated }) => {
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load codex data
  const loadCodex = useCallback(async () => {
    try {
      const response = await fetch('/api/codex');
      if (!response.ok) throw new Error('Failed to load codex');

      const data = await response.json();
      setEntries(data);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map((e: CodexEntry) => e.category))).filter(Boolean) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading codex:', error);
      toast.error('Failed to load codex data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCodex();
  }, [loadCodex]);

  // Handle import/replace
  const handleImport = async (newEntries: CodexEntry[]) => {
    try {
      const response = await fetch('/api/codex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'replace', data: newEntries }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to replace codex');
      }

      toast.success(`Codex replaced with ${newEntries.length} entries`);
      await loadCodex();
      onCodexUpdated?.();
    } catch (error) {
      console.error('Error replacing codex:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to replace codex');
      throw error;
    }
  };

  // Handle add
  const handleAdd = async (entry: CodexEntry) => {
    try {
      const response = await fetch('/api/codex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', data: entry }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add entry');
      }

      toast.success(`Entry "${entry.name}" added successfully`);
      await loadCodex();
      onCodexUpdated?.();
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add entry');
      throw error;
    }
  };

  // Handle update
  const handleUpdate = async (entry: CodexEntry) => {
    try {
      const response = await fetch('/api/codex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', data: entry }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update entry');
      }

      toast.success(`Entry "${entry.name}" updated successfully`);
      await loadCodex();
      onCodexUpdated?.();
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update entry');
      throw error;
    }
  };

  // Handle delete
  const handleDelete = async (name: string) => {
    try {
      const response = await fetch('/api/codex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', data: { name } }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete entry');
      }

      toast.success(`Entry "${name}" deleted successfully`);
      await loadCodex();
      onCodexUpdated?.();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete entry');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-300 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading codex...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Codex Editor
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage translation reference data
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium" style={{ borderRadius: '3px' }}>
          {entries.length} entries
        </span>
      </div>

      {/* Quick Edit Table (always visible, first for primary workflow) */}
      <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4" style={{ borderRadius: '3px' }}>
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4">
          Browse & Edit
        </h4>
        <QuickEditTable
          entries={entries}
          categories={categories}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>

      {/* Quick Add Form (collapsible, second) */}
      <CollapsibleSection
        title="Quick Add"
        badge={
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal normal-case">
            Add new entry
          </span>
        }
      >
        <QuickAddForm categories={categories} onAdd={handleAdd} />
      </CollapsibleSection>

      {/* Import Section (collapsible, last) */}
      <CollapsibleSection
        title="Import / Replace"
        badge={
          <span className="text-xs text-amber-600 dark:text-amber-400 font-normal normal-case">
            Replaces all entries
          </span>
        }
      >
        <ImportSection onImport={handleImport} />
      </CollapsibleSection>
    </div>
  );
};

export default CodexEditor;
