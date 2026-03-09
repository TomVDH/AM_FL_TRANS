import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CharacterInfoPopover } from './CharacterInfoPopover'
import { fn } from '../../../.storybook/mocks/utils'
import type { CodexEntry } from '@/utils/speakerCodexUtils'

const mockAnchorRect = {
  top: 100,
  bottom: 120,
  left: 200,
  right: 300,
  width: 100,
  height: 20,
  x: 200,
  y: 100,
  toJSON: () => ({}),
} as DOMRect

const fullCharacter: CodexEntry = {
  name: 'Maria',
  description: 'Main protagonist',
  english: 'Maria',
  dutch: 'Maria',
  category: 'character',
  gender: 'female',
  dialogueStyle: 'Confident, direct. Uses short declarative sentences.',
  bio: 'A young scholar who discovers she has magical abilities.',
}

const minimalCharacter: CodexEntry = {
  name: 'Guard',
  description: 'Minor character',
  english: 'Guard',
  dutch: 'Bewaker',
  category: 'character',
  gender: 'male',
}

const longBioCharacter: CodexEntry = {
  name: 'The Sage',
  description: 'Ancient hermit',
  english: 'The Sage',
  dutch: 'De Wijze',
  category: 'character',
  gender: 'male',
  dialogueStyle: 'Calm, wise. Speaks in measured, deliberate tones. Often uses metaphors drawn from nature.',
  bio: 'An old hermit who guards the secrets of the ancient kingdom. He has lived for centuries in the mountains, watching civilizations rise and fall. His knowledge of the old magic is unmatched, though he rarely intervenes in mortal affairs unless the balance of power is threatened.',
}

const meta: Meta<typeof CharacterInfoPopover> = {
  title: 'Conversation/CharacterInfoPopover',
  component: CharacterInfoPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    character: fullCharacter,
    anchorRect: mockAnchorRect,
    onClose: fn(),
    onInsert: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MinimalInfo: Story = {
  args: {
    character: minimalCharacter,
  },
}

export const WithLongBio: Story = {
  args: {
    character: longBioCharacter,
  },
}
