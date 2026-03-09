import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChatBubble } from './ChatBubble'
import type { ConversationRow } from './ChatBubble'
import { fn } from '../../../.storybook/mocks/utils'
import { mockConversationRows } from '../../../.storybook/mocks/conversation'

const protagonistRow = mockConversationRows[1] // Maria — translated protagonist
const nonProtagonistRow = mockConversationRows[2] // Lord Varis — translated, modified
const untranslatedRow = mockConversationRows[3] // Elena — untranslated, with contextNote
const contextNoteRow: ConversationRow = {
  ...mockConversationRows[5],
  contextNote: 'speaking slowly, with great weight',
}

const meta: Meta<typeof ChatBubble> = {
  title: 'Conversation/ChatBubble',
  component: ChatBubble,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    row: protagonistRow,
    colorIndex: 0,
    isSelected: false,
    languageMode: 'EN',
    animationDelay: 0,
    onClick: fn(),
    onSpeakerClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NonProtagonist: Story = {
  args: {
    row: nonProtagonistRow,
    colorIndex: 1,
  },
}

export const Untranslated: Story = {
  args: {
    row: untranslatedRow,
    colorIndex: 2,
  },
}

export const Modified: Story = {
  args: {
    row: nonProtagonistRow, // Lord Varis has isModified: true
    colorIndex: 1,
  },
}

export const WithContextNote: Story = {
  args: {
    row: contextNoteRow,
    colorIndex: 3,
  },
}

export const Selected: Story = {
  args: {
    row: protagonistRow,
    colorIndex: 0,
    isSelected: true,
  },
}

export const DutchMode: Story = {
  args: {
    row: protagonistRow,
    colorIndex: 0,
    languageMode: 'NL',
  },
}

export const DualMode: Story = {
  args: {
    row: protagonistRow,
    colorIndex: 0,
    languageMode: 'EN+NL',
  },
}

export const AllVariants: Story = {
  render: () => {
    const click = fn()
    const speakerClick = fn()
    return (
      <div className="max-w-2xl mx-auto space-y-2 p-4">
        <ChatBubble row={protagonistRow} colorIndex={0} isSelected={false} languageMode="EN" animationDelay={0} onClick={click} onSpeakerClick={speakerClick} />
        <ChatBubble row={nonProtagonistRow} colorIndex={1} isSelected={false} languageMode="EN" animationDelay={0} onClick={click} onSpeakerClick={speakerClick} />
        <ChatBubble row={untranslatedRow} colorIndex={2} isSelected={false} languageMode="EN" animationDelay={0} onClick={click} onSpeakerClick={speakerClick} />
        <ChatBubble row={contextNoteRow} colorIndex={3} isSelected={false} languageMode="EN+NL" animationDelay={0} onClick={click} onSpeakerClick={speakerClick} />
        <ChatBubble row={protagonistRow} colorIndex={0} isSelected={true} languageMode="EN+NL" animationDelay={0} onClick={click} onSpeakerClick={speakerClick} />
        <ChatBubble row={nonProtagonistRow} colorIndex={1} isSelected={false} languageMode="NL" animationDelay={0} onClick={click} onSpeakerClick={speakerClick} />
        <ChatBubble row={untranslatedRow} colorIndex={2} isSelected={false} languageMode="NL" animationDelay={0} onClick={click} onSpeakerClick={speakerClick} />
      </div>
    )
  },
}
