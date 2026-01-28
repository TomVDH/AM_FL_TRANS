import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import CSVQuickSuggestions from './CSVQuickSuggestions'
import { mockCSVEntries } from '../../.storybook/mocks/translations'

// Create typed mock entries matching the expected CSVEntry interface
const mockSuggestions = mockCSVEntries.map((entry, index) => ({
  ...entry,
  row: String(index + 1),
  key: `key_${index}`,
  context: entry.context || '',
  utterer: entry.utterer || '',
}))

const meta: Meta<typeof CSVQuickSuggestions> = {
  title: 'Reference/CSVQuickSuggestions',
  component: CSVQuickSuggestions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const CompactDefault: Story = {
  args: {
    suggestions: mockSuggestions,
    onSelect: fn(),
    maxDisplay: 3,
    compact: true,
  },
}

export const CompactWithContext: Story = {
  args: {
    suggestions: mockSuggestions,
    onSelect: fn(),
    maxDisplay: 4,
    showContext: true,
    compact: true,
  },
}

export const DetailedLayout: Story = {
  args: {
    suggestions: mockSuggestions,
    onSelect: fn(),
    maxDisplay: 4,
    showContext: true,
    showSource: true,
    compact: false,
  },
}

export const DetailedWithManyItems: Story = {
  args: {
    suggestions: mockSuggestions,
    onSelect: fn(),
    maxDisplay: 6,
    showContext: true,
    showSource: true,
    compact: false,
  },
  name: 'Detailed - Many Items',
}

export const SingleSuggestion: Story = {
  args: {
    suggestions: [mockSuggestions[0]],
    onSelect: fn(),
    compact: true,
  },
}

export const NoSuggestions: Story = {
  args: {
    suggestions: [],
    onSelect: fn(),
  },
  name: 'No Suggestions (Hidden)',
}

export const WithMoreIndicator: Story = {
  args: {
    suggestions: mockSuggestions,
    onSelect: fn(),
    maxDisplay: 2,
    compact: true,
  },
  name: 'With "+N more" Indicator',
}

export const InTranslationContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <label className="block text-sm font-medium mb-2">Source Text</label>
        <p className="text-gray-700 dark:text-gray-300">Good morning, please wait while loading...</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Suggestions</label>
        <CSVQuickSuggestions
          suggestions={mockSuggestions.slice(0, 3)}
          onSelect={fn()}
          compact={true}
          showContext={true}
        />
      </div>
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <label className="block text-sm font-medium mb-2">Translation</label>
        <textarea
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter translation..."
          rows={2}
        />
      </div>
    </div>
  ),
  name: 'Use Case: In Translation Workflow',
}
