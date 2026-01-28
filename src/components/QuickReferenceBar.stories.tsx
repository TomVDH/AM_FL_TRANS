import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import QuickReferenceBar from './QuickReferenceBar'
import {
  mockCodexMatches,
  mockXlsxMatches,
  createMockFindCharacterMatches,
  createMockFindXlsxMatches,
} from '../../.storybook/mocks/translations'

const meta: Meta<typeof QuickReferenceBar> = {
  title: 'Reference/QuickReferenceBar',
  component: QuickReferenceBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        {/* Mock source text area above */}
        <div
          className="p-4 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600"
          style={{ borderRadius: '4px 4px 0 0' }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Source text area...</p>
        </div>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithCodexMatches: Story = {
  args: {
    sourceText: 'Maria went to The Ancient Kingdom to find Lord Varis.',
    findCharacterMatches: createMockFindCharacterMatches(),
    findXlsxMatches: createMockFindXlsxMatches([]),
    onInsert: fn(),
    onOpenReferenceTools: fn(),
    isVisible: true,
  },
}

export const WithXlsxMatches: Story = {
  args: {
    sourceText: 'Hello, how are you? I need to find the key.',
    findCharacterMatches: createMockFindCharacterMatches([]),
    findXlsxMatches: createMockFindXlsxMatches(),
    onInsert: fn(),
    onOpenReferenceTools: fn(),
    isVisible: true,
  },
}

export const WithBothSources: Story = {
  args: {
    sourceText: 'Maria said: Hello, how are you? I need to find the Dragon Stone.',
    findCharacterMatches: createMockFindCharacterMatches(),
    findXlsxMatches: createMockFindXlsxMatches(),
    onInsert: fn(),
    onOpenReferenceTools: fn(),
    isVisible: true,
  },
}

export const ManyMatches: Story = {
  args: {
    sourceText: 'Maria and Lord Varis went to The Ancient Kingdom with the Dragon Stone.',
    findCharacterMatches: createMockFindCharacterMatches(mockCodexMatches),
    findXlsxMatches: createMockFindXlsxMatches(mockXlsxMatches),
    onInsert: fn(),
    onOpenReferenceTools: fn(),
    isVisible: true,
  },
  name: 'Many Matches (Expandable)',
}

export const NoMatches: Story = {
  args: {
    sourceText: 'This text has no matching terms.',
    findCharacterMatches: createMockFindCharacterMatches([]),
    findXlsxMatches: createMockFindXlsxMatches([]),
    onInsert: fn(),
    onOpenReferenceTools: fn(),
    isVisible: true,
  },
  name: 'No Matches (Hidden)',
}

export const Hidden: Story = {
  args: {
    sourceText: 'Maria went to The Ancient Kingdom.',
    findCharacterMatches: createMockFindCharacterMatches(),
    findXlsxMatches: createMockFindXlsxMatches(),
    onInsert: fn(),
    onOpenReferenceTools: fn(),
    isVisible: false,
  },
}

export const NoReferenceToolsCallback: Story = {
  args: {
    sourceText: 'Maria said: Hello, how are you?',
    findCharacterMatches: createMockFindCharacterMatches(),
    findXlsxMatches: createMockFindXlsxMatches(),
    onInsert: fn(),
    isVisible: true,
  },
  name: 'Without Open Reference Tools Button',
}
