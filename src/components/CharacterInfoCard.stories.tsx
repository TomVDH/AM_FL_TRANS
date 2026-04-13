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
      name: 'Bad Ass',
      english: 'Bad Ass',
      dutch: 'Stoere Ezel',
      gender: 'male',
      flemishDensity: 'heavy',
      register: 'tussentaal',
      pronounForm: 'ge/gij',
      verbalTics: 'Laat mij gerust, godverdomme, Eindelijk!',
      bio: 'A radical that wants to be left alone. Pessimistic, edgy, philosophical and political. Is actually a Human who was turned into a donkey by the Gods by accident.',
    },
    onClose: fn(),
    onInsert: fn(),
  },
}

export const ABNCharacter: Story = {
  args: {
    character: {
      name: 'Smart Ass',
      english: 'Smart Ass',
      dutch: 'Slimme Ezel',
      gender: 'female',
      flemishDensity: 'zero',
      register: 'ABN',
      pronounForm: 'jij/je',
      verbalTics: 'Poepsimpel, numbered plan sequences',
    },
    onClose: fn(),
    onInsert: fn(),
  },
}

export const NoProfile: Story = {
  args: {
    character: {
      name: 'Random NPC',
      english: 'Random NPC',
      dutch: 'Willekeurig Personage',
      gender: 'female',
      bio: 'A minor character who appears briefly.',
    },
    onClose: fn(),
    onInsert: fn(),
  },
}

export const WithLongBio: Story = {
  args: {
    character: {
      name: 'Sturdy Ass',
      english: 'Sturdy Ass',
      dutch: 'Stevige Ezel',
      gender: 'female',
      flemishDensity: 'medium',
      register: 'tussentaal',
      pronounForm: 'ge/gij',
      bio: 'Overprotective mother. She is pair-bonded with Old Ass. She lost her first daughter Lazy in the mine. She is racist against Machines. Can be overbearing and strict. In the end, she changes her ways and spreads the story of asses.masses to other farm animals towards starting a greater revolution.',
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
