import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'

// Note: CodexEditor has complex API dependencies and internal state management.
// We create a simplified visual demo that shows the component's structure.

const meta: Meta = {
  title: 'Features/CodexEditor',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Mock collapsible section for visual demo
const MockCollapsibleSection = ({
  title,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string
  defaultOpen?: boolean
  badge?: React.ReactNode
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden" style={{ borderRadius: '3px' }}>
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
        <svg className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

import React from 'react'

// Mock data for the demo
const mockCodexEntries = [
  { name: 'Maria', description: 'Main protagonist', english: 'Maria', dutch: 'Maria', category: 'Characters', nicknames: 'Mar, M' },
  { name: 'Lord Varis', description: 'King of the North', english: 'Lord Varis', dutch: 'Heer Varis', category: 'Characters', nicknames: 'Varis, The Lord' },
  { name: 'Crystal Cave', description: 'Hidden location', english: 'Crystal Cave', dutch: 'Kristalgrot', category: 'Locations' },
  { name: 'Dragon Stone', description: 'Legendary artifact', english: 'Dragon Stone', dutch: 'Drakensteen', category: 'Items' },
]

export const Default: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
        Codex Editor
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Manage character translations, terms, and world references.
      </p>

      {/* Import/Replace Section */}
      <MockCollapsibleSection title="Import / Replace CSV" badge={
        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
          Optional
        </span>
      }>
        <div className="pt-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer" style={{ borderRadius: '3px' }}>
            <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Drop CSV file here or click to upload
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Required columns: name, description, english, dutch, category
            </p>
          </div>
        </div>
      </MockCollapsibleSection>

      {/* Quick Add Section */}
      <MockCollapsibleSection title="Quick Add Entry" defaultOpen>
        <div className="pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">English</label>
              <input
                type="text"
                placeholder="English term"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                style={{ borderRadius: '3px' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Dutch</label>
              <input
                type="text"
                placeholder="Dutch translation"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                style={{ borderRadius: '3px' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Category</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                style={{ borderRadius: '3px' }}
              >
                <option>Characters</option>
                <option>Locations</option>
                <option>Items</option>
                <option>Creatures</option>
                <option>Spells</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Nicknames</label>
              <input
                type="text"
                placeholder="Comma separated"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                style={{ borderRadius: '3px' }}
              />
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-black dark:bg-white dark:text-black uppercase tracking-tight"
            style={{ borderRadius: '3px' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Entry
          </button>
        </div>
      </MockCollapsibleSection>

      {/* Browse & Edit Section */}
      <MockCollapsibleSection
        title="Browse & Edit"
        defaultOpen
        badge={
          <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
            {mockCodexEntries.length} entries
          </span>
        }
      >
        <div className="pt-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search entries..."
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              style={{ borderRadius: '3px' }}
            />
          </div>

          {/* Entries Table */}
          <div className="border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ borderRadius: '3px' }}>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">English</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Dutch</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Category</th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockCodexEntries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{entry.english}</td>
                    <td className="px-3 py-2 text-purple-600 dark:text-purple-400">{entry.dutch}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400" style={{ borderRadius: '2px' }}>
                        {entry.category}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button className="p-1 text-gray-400 hover:text-blue-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-500 ml-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MockCollapsibleSection>
    </div>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
        Codex Editor
      </h2>

      <MockCollapsibleSection title="Import / Replace CSV" defaultOpen>
        <div className="pt-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center" style={{ borderRadius: '3px' }}>
            <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              No codex data loaded. Upload a CSV to get started.
            </p>
          </div>
        </div>
      </MockCollapsibleSection>

      <MockCollapsibleSection
        title="Browse & Edit"
        badge={<span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">0 entries</span>}
      >
        <div className="pt-4 text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">No entries yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Import a CSV or add entries manually</p>
        </div>
      </MockCollapsibleSection>
    </div>
  ),
  name: 'Empty State',
}
