'use client';

import React, { useState, useEffect } from 'react';

interface CodexEntry {
  name: string;
  path: string;
  content: string;
  category: string;
}

interface CodexPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodexPanel: React.FC<CodexPanelProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch codex structure on mount
  useEffect(() => {
    if (isOpen) {
      fetchCodexStructure();
    }
  }, [isOpen]);

  const fetchCodexStructure = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/codex');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setCategories(data.categories);
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0]);
        // Load the first category's entries
        if (data.structure[data.categories[0]]) {
          setEntries(data.structure[data.categories[0]]);
        }
      }
    } catch (error) {
      console.error('Error fetching codex structure:', error);
      // Fallback to mock data if API fails
      const mockCategories = [
        'Main Asses',
        'Places', 
        'Supporting Asses',
        'Themes',
        'World'
      ];
      setCategories(mockCategories);
      if (mockCategories.length > 0) {
        setSelectedCategory(mockCategories[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryEntries = async (category: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/codex');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.structure[category]) {
        setEntries(data.structure[category]);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('Error fetching category entries:', error);
      // Fallback to mock data if API fails
      const mockEntries: Record<string, CodexEntry[]> = {
        'Main Asses': [
          { name: 'Main Character Index', path: 'Main Asses/Main Character Index.md', content: '', category: 'Main Asses' },
          { name: 'Old Ass', path: 'Main Asses/old-ass.md', content: '', category: 'Main Asses' },
          { name: 'Sturdy Ass', path: 'Main Asses/sturdy-ass.md', content: '', category: 'Main Asses' },
          { name: 'Trusty Ass', path: 'Main Asses/trusty-ass.md', content: '', category: 'Main Asses' },
          { name: 'Nice Ass', path: 'Main Asses/nice-ass.md', content: '', category: 'Main Asses' },
          { name: 'Big Ass', path: 'Main Asses/big-ass.md', content: '', category: 'Main Asses' }
        ],
        'Places': [
          { name: 'Places Index', path: 'Places/Places Index.md', content: '', category: 'Places' },
          { name: 'Fannyside Farm', path: 'Places/fannyside-farm.md', content: '', category: 'Places' },
          { name: 'Butte Mines', path: 'Places/butte-mines.md', content: '', category: 'Places' },
          { name: 'The Commons', path: 'Places/the-commons.md', content: '', category: 'Places' },
          { name: 'Red Fields', path: 'Places/red-fields.md', content: '', category: 'Places' }
        ],
        'Supporting Asses': [
          { name: 'Supporting Character Index', path: 'Supporting Asses/Supporting Character Index.md', content: '', category: 'Supporting Asses' }
        ],
        'Themes': [
          { name: 'Brayed Statement', path: 'Themes/brayed-statement.md', content: '', category: 'Themes' },
          { name: 'Emotional Register', path: 'Themes/emotional-register.md', content: '', category: 'Themes' },
          { name: 'Thematic Glossary', path: 'Themes/thematic-glossary.md', content: '', category: 'Themes' },
          { name: 'Tone Library', path: 'Themes/tone-library.md', content: '', category: 'Themes' }
        ],
        'World': [
          { name: 'World Index', path: 'World/world-index.md', content: '', category: 'World' },
          { name: 'World Setting', path: 'World/world-setting.md', content: '', category: 'World' },
          { name: 'Donkey History', path: 'World/donkey-history.md', content: '', category: 'World' },
          { name: 'Factions and Machines', path: 'World/factions-and-machines.md', content: '', category: 'World' },
          { name: 'Language and Naming', path: 'World/language-and-naming.md', content: '', category: 'World' },
          { name: 'Religion and Gods', path: 'World/religion-and-gods.md', content: '', category: 'World' }
        ]
      };

      setEntries(mockEntries[category] || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedEntry(null);
    fetchCategoryEntries(category);
  };

  const handleEntrySelect = async (entry: CodexEntry) => {
    setSelectedEntry(entry);
    // In a real implementation, you'd fetch the markdown content here
    // For now, we'll show a placeholder
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Codex</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Browse lore and background information</p>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entries */}
              {selectedCategory && (
                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Entries</h3>
                  {isLoading ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                  ) : (
                    <div className="space-y-1">
                      {entries.map((entry) => (
                        <button
                          key={entry.path}
                          onClick={() => handleEntrySelect(entry)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedEntry?.path === entry.path
                              ? 'bg-green-100 text-green-900 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {entry.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {selectedEntry ? (
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-none">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedEntry.name}</h1>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedEntry.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an entry</h3>
                  <p className="text-gray-500">Choose a category and entry to view its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodexPanel; 