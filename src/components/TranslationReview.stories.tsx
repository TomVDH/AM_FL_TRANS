import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import { useState } from 'react'
import TranslationReview from './TranslationReview'
import { mockTranslationRows } from '../../.storybook/mocks/translations'

const meta: Meta<typeof TranslationReview> = {
  title: 'Features/TranslationReview',
  component: TranslationReview,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Generate mock data from our mock rows
const sourceTexts = mockTranslationRows.map(r => r.sourceEnglish)
const translations = mockTranslationRows.map(r => r.translatedDutch)
const originalTranslations = [...translations] // Copy as original

// Extended mock data for more realistic demo
const extendedSourceTexts = [
  ...sourceTexts,
  'The treasure chest contains gold coins.',
  'Watch out for the trap ahead!',
  'Your quest has been updated.',
  'Inventory is full.',
  'Press any key to continue.',
  'Game saved successfully.',
  'Connection lost. Please reconnect.',
  'Achievement unlocked: First Victory!',
  'New area discovered: Dark Forest.',
  'Level up! You are now level 5.',
]

const extendedTranslations = [
  ...translations,
  'De schatkist bevat gouden munten.',
  '', // blank
  'Je opdracht is bijgewerkt.',
  '', // blank
  'Druk op een toets om door te gaan.',
  'Spel opgeslagen.',
  '', // blank
  'Prestatie ontgrendeld: Eerste Overwinning!',
  'Nieuw gebied ontdekt: Donker Bos.',
  '', // blank
]

const extendedOriginals = [
  ...originalTranslations,
  'De schatkist bevat gouden munten.',
  '',
  'Je opdracht is geüpdatet.', // different - modified
  '',
  'Druk op een willekeurige toets.', // different - modified
  'Spel opgeslagen.',
  '',
  '', // was blank, now filled
  'Nieuw gebied ontdekt: Donker Bos.',
  '',
]

// Interactive wrapper
const InteractiveReview = ({
  sourceTexts,
  initialTranslations,
  originalTranslations,
}: {
  sourceTexts: string[]
  initialTranslations: string[]
  originalTranslations: string[]
}) => {
  const [translations, setTranslations] = useState(initialTranslations)

  const handleUpdate = (index: number, value: string) => {
    setTranslations(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  return (
    <TranslationReview
      sourceTexts={sourceTexts}
      translations={translations}
      originalTranslations={originalTranslations}
      onUpdateTranslation={handleUpdate}
      onBack={fn()}
    />
  )
}

export const Default: Story = {
  render: () => (
    <InteractiveReview
      sourceTexts={extendedSourceTexts}
      initialTranslations={extendedTranslations}
      originalTranslations={extendedOriginals}
    />
  ),
}

export const AllComplete: Story = {
  render: () => {
    const completeTranslations = extendedSourceTexts.map((_, i) =>
      `Vertaling ${i + 1}`
    )

    return (
      <InteractiveReview
        sourceTexts={extendedSourceTexts}
        initialTranslations={completeTranslations}
        originalTranslations={completeTranslations}
      />
    )
  },
  name: 'All Complete (No Blanks)',
}

export const AllBlank: Story = {
  render: () => {
    const blankTranslations = extendedSourceTexts.map(() => '')

    return (
      <InteractiveReview
        sourceTexts={extendedSourceTexts}
        initialTranslations={blankTranslations}
        originalTranslations={blankTranslations}
      />
    )
  },
  name: 'All Blank',
}

export const ManyModified: Story = {
  render: () => {
    const modifiedTranslations = extendedSourceTexts.map((_, i) =>
      `Gewijzigde vertaling ${i + 1}`
    )
    const originals = extendedSourceTexts.map((_, i) =>
      `Originele vertaling ${i + 1}`
    )

    return (
      <InteractiveReview
        sourceTexts={extendedSourceTexts}
        initialTranslations={modifiedTranslations}
        originalTranslations={originals}
      />
    )
  },
  name: 'Many Modified',
}

export const SmallDataset: Story = {
  render: () => (
    <InteractiveReview
      sourceTexts={sourceTexts}
      initialTranslations={translations}
      originalTranslations={originalTranslations}
    />
  ),
  name: 'Small Dataset (5 Items)',
}

export const LongTexts: Story = {
  render: () => {
    const longSourceTexts = [
      'This is a very long piece of dialogue that contains multiple sentences and should demonstrate how the component handles text overflow. The character is explaining a complex backstory about the ancient kingdom and its many rulers throughout the ages.',
      'Another lengthy explanation about the quest objectives, including finding three artifacts, defeating the guardian, and returning safely to the village before nightfall when the monsters come out.',
      'A shorter one.',
    ]
    const longTranslations = [
      'Dit is een heel lang stuk dialoog dat meerdere zinnen bevat en zou moeten laten zien hoe de component omgaat met tekstoverloop. Het personage legt een complex verhaal uit over het oude koninkrijk en zijn vele heersers door de eeuwen heen.',
      '',
      'Een kortere.',
    ]

    return (
      <InteractiveReview
        sourceTexts={longSourceTexts}
        initialTranslations={longTranslations}
        originalTranslations={longTranslations}
      />
    )
  },
  name: 'Long Text Entries',
}
