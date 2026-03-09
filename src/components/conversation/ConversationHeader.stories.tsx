import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ConversationHeader } from './ConversationHeader'
import { fn } from '../../../.storybook/mocks/utils'
import {
  mockConversationRows,
  fullyTranslatedConversation,
  mockSpeakers,
} from '../../../.storybook/mocks/conversation'

const meta: Meta<typeof ConversationHeader> = {
  title: 'Conversation/ConversationHeader',
  component: ConversationHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ paddingTop: '60px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    sheetName: 'Episode01_Dialogue',
    rows: mockConversationRows,
    languageMode: 'EN',
    onLanguageModeChange: fn(),
    protagonistName: 'Maria',
    speakers: mockSpeakers,
    onProtagonistChange: fn(),
    onExit: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MostlyTranslated: Story = {
  args: {
    rows: mockConversationRows.map((row, i) => ({
      ...row,
      isTranslated: i < 6,
      translation: i < 6 ? (row.translation || 'Mock vertaling...') : '',
    })),
  },
}

export const AllTranslated: Story = {
  args: {
    rows: fullyTranslatedConversation,
  },
}

export const NLMode: Story = {
  args: {
    languageMode: 'NL',
  },
}
