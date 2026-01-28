import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import { useState } from 'react'
import SheetSelector from './SheetSelector'
import { mockSheets, shortSheetList, singleSheet } from '../../.storybook/mocks/sheets'

const meta: Meta<typeof SheetSelector> = {
  title: 'Navigation/SheetSelector',
  component: SheetSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Sheet names for stories
const sheetNames = mockSheets.map(s => s.name)
const shortSheetNames = shortSheetList.map(s => s.name)

// Interactive wrapper
const InteractiveSheetSelector = ({
  sheets,
  initialSelected,
}: {
  sheets: string[]
  initialSelected: string
}) => {
  const [selected, setSelected] = useState(initialSelected)

  return (
    <SheetSelector
      sheets={sheets}
      selectedSheet={selected}
      onSelectSheet={setSelected}
    />
  )
}

export const Default: Story = {
  render: () => (
    <InteractiveSheetSelector
      sheets={sheetNames}
      initialSelected={sheetNames[0]}
    />
  ),
}

export const WithSelection: Story = {
  render: () => (
    <InteractiveSheetSelector
      sheets={sheetNames}
      initialSelected="Episode02_Dialogue"
    />
  ),
  name: 'With Pre-selected Sheet',
}

export const FewSheets: Story = {
  render: () => (
    <InteractiveSheetSelector
      sheets={shortSheetNames}
      initialSelected={shortSheetNames[0]}
    />
  ),
  name: 'Few Sheets (No Search)',
}

export const SingleSheet: Story = {
  args: {
    sheets: ['Episode12_Dialogue'],
    selectedSheet: 'Episode12_Dialogue',
    onSelectSheet: fn(),
  },
}

export const ManySheets: Story = {
  render: () => {
    const manySheets = [
      ...sheetNames,
      'Episode05_Intro',
      'Episode05_Dialogue',
      'Episode06_Intro',
      'Episode06_Dialogue',
      'Episode07_Intro',
      'Episode07_Dialogue',
      'Bonus_Content',
      'Credits',
    ]

    return (
      <InteractiveSheetSelector
        sheets={manySheets}
        initialSelected={manySheets[0]}
      />
    )
  },
  name: 'Many Sheets (Scrollable)',
}

export const WithWorkbookData: Story = {
  render: () => {
    // Mock workbook data with row counts
    const mockWorkbook = {
      Sheets: {
        Episode01_Intro: { '!ref': 'A1:N45' },
        Episode01_Dialogue: { '!ref': 'A1:N120' },
        Episode02_Intro: { '!ref': 'A1:N38' },
        Episode02_Dialogue: { '!ref': 'A1:N156' },
      },
    }

    const sheets = Object.keys(mockWorkbook.Sheets)
    const [selected, setSelected] = useState(sheets[0])

    return (
      <SheetSelector
        sheets={sheets}
        selectedSheet={selected}
        onSelectSheet={setSelected}
        workbookData={mockWorkbook}
        startRow={2}
      />
    )
  },
  name: 'With Row Counts',
}

export const InSetupContext: Story = {
  render: () => {
    const [selected, setSelected] = useState(sheetNames[0])

    return (
      <div className="space-y-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
        <h3 className="font-bold text-lg">Setup Step 2: Select Sheet</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose which sheet to translate from the uploaded Excel file.
        </p>
        <SheetSelector
          sheets={sheetNames}
          selectedSheet={selected}
          onSelectSheet={setSelected}
        />
        <button
          className="w-full py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm"
          style={{ borderRadius: '3px' }}
          disabled={!selected}
        >
          Continue with {selected || 'selected sheet'}
        </button>
      </div>
    )
  },
  name: 'Use Case: In Setup Wizard',
}
