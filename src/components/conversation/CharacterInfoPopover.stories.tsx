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
  name: 'Bad Ass',
  description: 'Main character',
  english: 'Bad Ass',
  dutch: 'Stoere Ezel',
  category: 'CHARACTER',
  gender: 'male',
  flemishDensity: 'heavy',
  register: 'tussentaal',
  pronounForm: 'ge/gij',
  bio: 'A radical that wants to be left alone. Pessimistic, edgy, philosophical.',
}

const minimalCharacter: CodexEntry = {
  name: 'Guard',
  description: 'Minor character',
  english: 'Guard',
  dutch: 'Bewaker',
  category: 'CHARACTER',
  gender: 'male',
}

const longBioCharacter: CodexEntry = {
  name: 'Sturdy Ass',
  description: 'Main character',
  english: 'Sturdy Ass',
  dutch: 'Stevige Ezel',
  category: 'CHARACTER',
  gender: 'female',
  flemishDensity: 'medium',
  register: 'tussentaal',
  pronounForm: 'ge/gij',
  verbalTics: 'Kameraad (x30), anti-machine mantra, Bij de Goden!',
  bio: 'Overprotective mother. Pair-bonded with Old Ass. Lost her first daughter Lazy in the mine. Racist against Machines. Can be overbearing and strict. In the end, she changes her ways and spreads the story to other farm animals.',
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
