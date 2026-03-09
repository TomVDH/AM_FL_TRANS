import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EditDock } from './EditDock'
import { fn } from '../../../.storybook/mocks/utils'
import { mockConversationRows } from '../../../.storybook/mocks/conversation'

const dialogueRow = mockConversationRows[1] // Maria — translated protagonist
const translatedRow = mockConversationRows[2] // Lord Varis — translated + modified

const meta: Meta<typeof EditDock> = {
  title: 'Conversation/EditDock',
  component: EditDock,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ paddingBottom: '160px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    row: dialogueRow,
    syncStatus: 'idle',
    onSubmit: fn(),
    onAutoSave: fn(),
    onNavigate: fn(),
    onDismiss: fn(),
    totalRows: mockConversationRows.length,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Syncing: Story = {
  args: {
    syncStatus: 'syncing',
  },
}

export const WithTranslation: Story = {
  args: {
    row: translatedRow,
  },
}

export const Empty: Story = {
  args: {
    row: null,
  },
}
