import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import React, { useState } from 'react'

// Note: ReferenceToolsPanel has many complex props and dependencies.
// We create a visual demo of the component structure.

const meta: Meta = {
  title: 'Features/ReferenceToolsPanel',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Mock XLSX entries
const mockXlsxEntries = [
  { sourceEnglish: 'Hello there!', translatedDutch: 'Hallo daar!', utterer: 'Maria', context: 'Greeting scene', row: 1 },
  { sourceEnglish: 'The key is here.', translatedDutch: 'De sleutel is hier.', utterer: 'Guard', context: 'Castle entrance', row: 2 },
  { sourceEnglish: 'Follow me.', translatedDutch: 'Volg mij.', utterer: 'Guide', context: 'Forest path', row: 3 },
  { sourceEnglish: 'Be careful!', translatedDutch: 'Wees voorzichtig!', utterer: 'Elena', context: 'Warning scene', row: 4 },
  { sourceEnglish: 'Thank you.', translatedDutch: 'Dank je.', utterer: 'Villager', context: 'After quest', row: 5 },
]

// Visual demo of the panel
const ReferencePanelDemo = ({ activeTab = 'codex' }: { activeTab?: 'codex' | 'search' }) => {
  const [tab, setTab] = useState<'codex' | 'search'>(activeTab)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-[500px] flex flex-col" style={{ borderRadius: '3px' }}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          Reference Tools
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setTab('codex')}
          className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
            tab === 'codex'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Codex
        </button>
        <button
          onClick={() => setTab('search')}
          className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
            tab === 'search'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Search
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'codex' ? (
          <div className="p-3 space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Auto-detected matches from current source text:
            </p>

            {/* Character matches */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Characters</h4>
              {['Maria', 'Lord Varis', 'Elena'].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                  style={{ borderRadius: '3px' }}
                >
                  <span className="text-sm text-gray-900 dark:text-gray-100">{name}</span>
                  <button className="px-2 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800" style={{ borderRadius: '2px' }}>
                    Insert
                  </button>
                </div>
              ))}
            </div>

            {/* Location matches */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Locations</h4>
              {[{ en: 'Crystal Cave', nl: 'Kristalgrot' }, { en: 'Shadow Forest', nl: 'Schaduwbos' }].map((loc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  style={{ borderRadius: '3px' }}
                >
                  <div>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{loc.en}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">→ {loc.nl}</span>
                  </div>
                  <button className="px-2 py-1 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800" style={{ borderRadius: '2px' }}>
                    Insert
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {/* Search input */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search translations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                style={{ borderRadius: '3px' }}
              />
            </div>

            {/* Results */}
            <div className="space-y-2">
              {mockXlsxEntries.map((entry, i) => (
                <div
                  key={i}
                  className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  style={{ borderRadius: '3px' }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{entry.sourceEnglish}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium truncate">{entry.translatedDutch}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {entry.utterer} · {entry.context}
                      </p>
                    </div>
                    <button className="shrink-0 p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20" style={{ borderRadius: '2px' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const CodexTab: Story = {
  render: () => <ReferencePanelDemo activeTab="codex" />,
  name: 'Codex Tab',
}

export const SearchTab: Story = {
  render: () => <ReferencePanelDemo activeTab="search" />,
  name: 'Search Tab',
}

export const InLayout: Story = {
  render: () => (
    <div className="flex gap-4 h-[500px]">
      {/* Main content area */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700" style={{ borderRadius: '3px' }}>
        <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          Translation workspace
        </div>
      </div>

      {/* Reference panel */}
      <ReferencePanelDemo />
    </div>
  ),
  name: 'Use Case: In Translation Layout',
}

export const Empty: Story = {
  render: () => (
    <div className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-[400px] flex flex-col" style={{ borderRadius: '3px' }}>
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          Reference Tools
        </h3>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">No matches found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Enter source text to find references
          </p>
        </div>
      </div>
    </div>
  ),
  name: 'Empty State',
}
