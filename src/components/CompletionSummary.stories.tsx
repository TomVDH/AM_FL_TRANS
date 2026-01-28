import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import CompletionSummary from './CompletionSummary'

const meta: Meta<typeof CompletionSummary> = {
  title: 'Features/CompletionSummary',
  component: CompletionSummary,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sheetName: 'Episode12_Dialogue',
    episodeNumber: '12',
    stats: {
      total: 256,
      completed: 256,
      blank: 0,
      modified: 45,
    },
    remainingSheets: ['Episode13_Intro', 'Episode13_Dialogue', 'Episode14_Intro'],
    onReview: fn(),
    onExport: fn(),
    onNextSheet: fn(),
    onBackToSetup: fn(),
  },
}

export const PartialCompletion: Story = {
  args: {
    sheetName: 'Episode08_Dialogue',
    episodeNumber: '8',
    stats: {
      total: 189,
      completed: 142,
      blank: 47,
      modified: 89,
    },
    remainingSheets: ['Episode09_Intro', 'Episode09_Dialogue'],
    onReview: fn(),
    onExport: fn(),
    onNextSheet: fn(),
    onBackToSetup: fn(),
  },
  name: 'Partial Completion (75%)',
}

export const JustStarted: Story = {
  args: {
    sheetName: 'Episode01_Intro',
    episodeNumber: '1',
    stats: {
      total: 45,
      completed: 12,
      blank: 33,
      modified: 12,
    },
    remainingSheets: [
      'Episode01_Dialogue',
      'Episode02_Intro',
      'Episode02_Dialogue',
      'Episode03_Intro',
      'Episode03_Dialogue',
    ],
    onReview: fn(),
    onExport: fn(),
    onNextSheet: fn(),
    onBackToSetup: fn(),
  },
  name: 'Early Progress (27%)',
}

export const AllSheetsComplete: Story = {
  args: {
    sheetName: 'Credits',
    episodeNumber: '',
    stats: {
      total: 89,
      completed: 89,
      blank: 0,
      modified: 15,
    },
    remainingSheets: [],
    onReview: fn(),
    onExport: fn(),
    onNextSheet: fn(),
    onBackToSetup: fn(),
  },
  name: 'All Sheets Complete',
}

export const LargeDataset: Story = {
  args: {
    sheetName: 'MainQuest_Dialogue',
    episodeNumber: '',
    stats: {
      total: 2456,
      completed: 2456,
      blank: 0,
      modified: 678,
    },
    remainingSheets: ['SideQuest_A', 'SideQuest_B', 'UI_Strings'],
    onReview: fn(),
    onExport: fn(),
    onNextSheet: fn(),
    onBackToSetup: fn(),
  },
  name: 'Large Dataset (2456 entries)',
}

export const ManyRemainingSheets: Story = {
  args: {
    sheetName: 'Episode01_Intro',
    episodeNumber: '1',
    stats: {
      total: 34,
      completed: 34,
      blank: 0,
      modified: 34,
    },
    remainingSheets: [
      'Episode01_Dialogue',
      'Episode02_Intro',
      'Episode02_Dialogue',
      'Episode03_Intro',
      'Episode03_Dialogue',
      'Episode04_Intro',
      'Episode04_Dialogue',
      'Episode05_Intro',
      'Episode05_Dialogue',
      'UI_Menus',
      'UI_Messages',
      'Credits',
    ],
    onReview: fn(),
    onExport: fn(),
    onNextSheet: fn(),
    onBackToSetup: fn(),
  },
  name: 'Many Remaining Sheets',
}
