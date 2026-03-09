import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CharacterInfoCard from './CharacterInfoCard'
import { fn } from '../../.storybook/mocks/utils'

const meta: Meta<typeof CharacterInfoCard> = {
  title: 'Reference/CharacterInfoCard',
  component: CharacterInfoCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof CharacterInfoCard>

export const FullInfo: Story = {
  args: {
    character: {
      name: 'Marieke',
      english: 'Marieke',
      dutch: 'Marieke',
      gender: 'female',
      dialogueStyle:
        'Warm, maternal tone. Uses gentle encouragement and folksy wisdom. Tends toward longer, flowing sentences with emotional depth.',
      dutchDialogueStyle:
        'Warme, moederlijke toon. Gebruikt zachte aanmoediging en volkse wijsheid. Neigt naar langere, vloeiende zinnen met emotionele diepgang.',
      bio: 'Marieke is a retired schoolteacher who now runs the village bakery. She is known for her warmth and her uncanny ability to sense when someone needs a kind word or a fresh stroopwafel.',
    },
    onClose: fn(),
    onInsert: fn(),
  },
}

export const MaleCharacter: Story = {
  args: {
    character: {
      name: 'Hendrik',
      english: 'Hendrik',
      dutch: 'Hendrik',
      gender: 'male',
      dialogueStyle:
        'Gruff but kind. Short, clipped sentences. Avoids emotional language but shows care through actions.',
    },
    onClose: fn(),
    onInsert: fn(),
  },
}

export const FemaleNoStyles: Story = {
  args: {
    character: {
      name: 'Sofie',
      english: 'Sofie',
      dutch: 'Sofie',
      gender: 'female',
      bio: 'A young artist from Amsterdam.',
    },
    onClose: fn(),
    onInsert: fn(),
  },
}

export const WithLongBio: Story = {
  args: {
    character: {
      name: 'Professor van der Berg',
      english: 'Professor van der Berg',
      dutch: 'Professor van der Berg',
      gender: 'male',
      dialogueStyle: 'Academic and precise.',
      bio: 'Professor van der Berg has spent forty years studying the migratory patterns of European starlings. His office at the University of Utrecht is filled with hand-drawn maps, annotated field journals, and a collection of antique binoculars that he insists are each calibrated differently for optimal birdwatching conditions across the Dutch landscape.',
    },
    onClose: fn(),
    onInsert: fn(),
  },
}

export const MinimalInfo: Story = {
  args: {
    character: {
      name: 'Jan',
      english: 'Jan',
      dutch: 'Jan',
      gender: 'male',
    },
    onClose: fn(),
    onInsert: fn(),
  },
}
