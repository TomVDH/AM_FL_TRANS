import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import React, { useState } from 'react'

// Note: SetupWizard has many props and complex state management.
// We create visual demos of the key states and layouts.

const meta: Meta = {
  title: 'Pages/SetupWizard',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Mock dark mode toggle button
const DarkModeToggle = ({ darkMode, toggle }: { darkMode: boolean; toggle: () => void }) => (
  <button
    onClick={toggle}
    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
    title={darkMode ? 'Light mode' : 'Dark mode'}
  >
    {darkMode ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )}
  </button>
)

// Visual demo of the SetupWizard
const SetupWizardDemo = ({
  mode = 'excel',
  hasFile = false,
  hasSheets = false,
}: {
  mode?: 'excel' | 'manual'
  hasFile?: boolean
  hasSheets?: boolean
}) => {
  const [inputMode, setInputMode] = useState<'excel' | 'manual'>(mode)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-amber-50'}`}>
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              AM Translations Helper
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure your translation workflow
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <button className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600" style={{ borderRadius: '3px' }}>
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
            <DarkModeToggle darkMode={darkMode} toggle={() => setDarkMode(!darkMode)} />
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 mb-6" style={{ borderRadius: '3px' }}>
          <button
            onClick={() => setInputMode('excel')}
            className={`flex-1 px-4 py-2 text-sm font-bold uppercase tracking-tight transition-colors ${
              inputMode === 'excel'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            style={{ borderRadius: '3px' }}
          >
            Excel Upload
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`flex-1 px-4 py-2 text-sm font-bold uppercase tracking-tight transition-colors ${
              inputMode === 'manual'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            style={{ borderRadius: '3px' }}
          >
            Manual Input
          </button>
        </div>

        {/* Content */}
        {inputMode === 'excel' ? (
          <div className="space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center transition-colors hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer" style={{ borderRadius: '3px' }}>
              {hasFile ? (
                <div>
                  <svg className="w-10 h-10 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">translations.xlsx</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to replace</p>
                </div>
              ) : (
                <div>
                  <svg className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Drop Excel file here</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">or click to browse (.xlsx, .xls)</p>
                </div>
              )}
            </div>

            {/* Sheet Selection (if file loaded) */}
            {hasSheets && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4" style={{ borderRadius: '3px' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">
                  Select Sheet
                </h3>
                <div className="space-y-2">
                  {['Episode12_Dialogue', 'Episode12_System', 'Episode13_Dialogue'].map((sheet, i) => (
                    <button
                      key={sheet}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                        i === 0
                          ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-500 text-green-900 dark:text-green-100'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-l-transparent'
                      }`}
                      style={{ borderRadius: '3px' }}
                    >
                      <span>{sheet}</span>
                      {i === 0 && (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Column Configuration (if file loaded) */}
            {hasSheets && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4" style={{ borderRadius: '3px' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">
                  Column Configuration
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Source Column</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" style={{ borderRadius: '3px' }}>
                      <option>G</option>
                      <option>H</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Utterer Column</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" style={{ borderRadius: '3px' }}>
                      <option>A</option>
                      <option>B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Start Row</label>
                    <input type="number" defaultValue={2} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" style={{ borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-2">
                Paste Source Text
              </label>
              <textarea
                placeholder="Paste your source text here, one line per entry..."
                rows={10}
                className="w-full p-4 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono resize-none"
                style={{ borderRadius: '3px' }}
              />
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="mt-8">
          <button
            className="w-full py-4 text-lg font-black text-white bg-black dark:bg-white dark:text-black uppercase tracking-tight shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            style={{ borderRadius: '3px' }}
          >
            Start Translating
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            AM Translations Helper v5.0.0
          </p>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <SetupWizardDemo />,
}

export const ExcelMode: Story = {
  render: () => <SetupWizardDemo mode="excel" />,
  name: 'Excel Mode - Empty',
}

export const ExcelWithFile: Story = {
  render: () => <SetupWizardDemo mode="excel" hasFile={true} hasSheets={true} />,
  name: 'Excel Mode - File Loaded',
}

export const ManualMode: Story = {
  render: () => <SetupWizardDemo mode="manual" />,
  name: 'Manual Input Mode',
}
