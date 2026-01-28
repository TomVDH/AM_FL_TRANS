import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import React, { useState } from 'react'

// Note: TranslationHelper is the main translation workspace with many complex interactions.
// We create visual demos of the key states and layouts.

const meta: Meta = {
  title: 'Pages/TranslationHelper',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Visual demo of the Translation Helper workspace
const TranslationHelperDemo = ({
  hasMatches = true,
  showReferencePanel = true,
}: {
  hasMatches?: boolean
  showReferencePanel?: boolean
}) => {
  const [translation, setTranslation] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const mockEntries = [
    { source: 'Hello, how are you doing today?', utterer: 'Maria', context: 'Greeting scene' },
    { source: 'I need to find the ancient scroll.', utterer: 'Protagonist', context: 'Quest start' },
    { source: 'The castle gates are closed.', utterer: '', context: 'System message' },
    { source: 'Thank you for saving us!', utterer: 'Villager', context: 'Rescue scene' },
    { source: 'Where did everyone go?', utterer: 'Maria', context: 'Mystery scene' },
  ]

  const current = mockEntries[currentIndex]

  return (
    <div className="h-screen bg-amber-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Episode12_Dialogue
          </h1>
          <span className="px-2 py-1 text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" style={{ borderRadius: '3px' }}>
            {currentIndex + 1} / {mockEntries.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 uppercase" style={{ borderRadius: '3px' }}>
            Review
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 uppercase" style={{ borderRadius: '3px' }}>
            Export
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Translation Workspace */}
        <div className={`flex-1 flex flex-col p-4 overflow-hidden ${showReferencePanel ? '' : ''}`}>
          {/* Source Text */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 mb-2" style={{ borderRadius: '3px' }}>
            {current.utterer && (
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" style={{ borderRadius: '2px' }}>
                  {current.utterer}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{current.context}</span>
              </div>
            )}
            <div className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
              {hasMatches ? (
                <>
                  <span className="highlight-tag highlight-character">Maria</span>
                  {' '}, how are you doing today?
                </>
              ) : (
                current.source
              )}
            </div>
          </div>

          {/* Quick Reference Bar */}
          {hasMatches && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-400 dark:border-gray-600 border-t-0 px-2.5 py-2" style={{ borderRadius: '0 0 4px 4px', marginTop: '-1px' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Quick Ref
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 px-2 py-1" style={{ borderRadius: '3px' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span className="text-[11px] text-gray-600 dark:text-gray-400">Maria</span>
                  <span className="text-[11px] text-purple-400 mx-0.5">→</span>
                  <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">Maria</span>
                  <button className="ml-1 p-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400" style={{ borderRadius: '2px' }}>
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Translation Input */}
          <div className="flex-1 mt-4">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Translation (Dutch)
            </label>
            <textarea
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Enter your translation here..."
              className="w-full h-full min-h-[200px] p-4 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              style={{ borderRadius: '3px' }}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              style={{ borderRadius: '3px' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={currentIndex + 1}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10)
                  if (val >= 1 && val <= mockEntries.length) {
                    setCurrentIndex(val - 1)
                  }
                }}
                className="w-16 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                style={{ borderRadius: '3px' }}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">of {mockEntries.length}</span>
            </div>

            <button
              onClick={() => setCurrentIndex(Math.min(mockEntries.length - 1, currentIndex + 1))}
              disabled={currentIndex === mockEntries.length - 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-black dark:bg-white dark:text-black disabled:opacity-50"
              style={{ borderRadius: '3px' }}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Reference Panel */}
        {showReferencePanel && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                Reference Tools
              </h3>
            </div>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button className="flex-1 px-4 py-2 text-xs font-bold uppercase text-black dark:text-white border-b-2 border-black dark:border-white">
                Codex
              </button>
              <button className="flex-1 px-4 py-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                Search
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Auto-detected from source:
              </p>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800" style={{ borderRadius: '3px' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-gray-100">Maria</span>
                  <button className="px-2 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">Insert</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <TranslationHelperDemo />,
}

export const WithoutMatches: Story = {
  render: () => <TranslationHelperDemo hasMatches={false} />,
  name: 'Without Codex Matches',
}

export const WithoutReferencePanel: Story = {
  render: () => <TranslationHelperDemo showReferencePanel={false} />,
  name: 'Without Reference Panel',
}

export const MinimalView: Story = {
  render: () => <TranslationHelperDemo hasMatches={false} showReferencePanel={false} />,
  name: 'Minimal View',
}
