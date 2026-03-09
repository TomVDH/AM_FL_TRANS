import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SystemMessage } from './SystemMessage'
import { fn } from '../../../.storybook/mocks/utils'
import { mockConversationRows } from '../../../.storybook/mocks/conversation'

const systemRow = mockConversationRows[0] // translated system message
const untranslatedSystemRow = mockConversationRows[4] // untranslated system message

const meta: Meta<typeof SystemMessage> = {
  title: 'Conversation/SystemMessage',
  component: SystemMessage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    row: systemRow,
    isSelected: false,
    languageMode: 'EN',
    onClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    isSelected: true,
  },
}

export const DutchMode: Story = {
  args: {
    languageMode: 'NL',
  },
}

export const Untranslated: Story = {
  args: {
    row: untranslatedSystemRow,
    languageMode: 'NL',
  },
}
