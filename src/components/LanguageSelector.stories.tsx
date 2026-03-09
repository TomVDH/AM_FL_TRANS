import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import LanguageSelector, { DetectedLanguage } from './LanguageSelector'
import { fn } from '../../.storybook/mocks/utils'

const dutchLanguage: DetectedLanguage = {
  code: 'nl',
  name: 'Dutch',
  column: 'D',
  headerText: 'Dutch Translation',
  sheets: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4'],
  totalSheets: 4,
}

const frenchLanguage: DetectedLanguage = {
  code: 'fr',
  name: 'French',
  column: 'E',
  headerText: 'French Translation',
  sheets: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4'],
  totalSheets: 4,
}

const germanLanguage: DetectedLanguage = {
  code: 'de',
  name: 'German',
  column: 'F',
  headerText: 'German Translation',
  sheets: ['Chapter 1', 'Chapter 3'],
  totalSheets: 4,
}

const meta: Meta<typeof LanguageSelector> = {
  title: 'Setup/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof LanguageSelector>

export const MultipleLanguages: Story = {
  args: {
    languages: [dutchLanguage, frenchLanguage, germanLanguage],
    selectedLanguage: dutchLanguage,
    onSelectLanguage: fn(),
  },
}

export const SingleLanguage: Story = {
  args: {
    languages: [dutchLanguage],
    selectedLanguage: dutchLanguage,
    onSelectLanguage: fn(),
  },
}

export const NoLanguages: Story = {
  args: {
    languages: [],
    selectedLanguage: null,
    onSelectLanguage: fn(),
  },
}

export const PartialCoverage: Story = {
  args: {
    languages: [dutchLanguage, frenchLanguage, germanLanguage],
    selectedLanguage: germanLanguage,
    onSelectLanguage: fn(),
  },
}

export const Disabled: Story = {
  args: {
    languages: [dutchLanguage, frenchLanguage, germanLanguage],
    selectedLanguage: dutchLanguage,
    onSelectLanguage: fn(),
    disabled: true,
  },
}
