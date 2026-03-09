import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ReferenceDataInfo from './ReferenceDataInfo'
import { fn } from '../../.storybook/mocks/utils'

const meta: Meta<typeof ReferenceDataInfo> = {
  title: 'Setup/ReferenceDataInfo',
  component: ReferenceDataInfo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ReferenceDataInfo>

export const HasData: Story = {
  args: {
    selectedLanguage: 'nl',
    selectedLanguageName: 'Dutch',
    hasReferenceData: true,
    isLoading: false,
    totalEntries: 142,
    onLearnMore: fn(),
  },
}

export const NoData: Story = {
  args: {
    selectedLanguage: 'nl',
    selectedLanguageName: 'Dutch',
    hasReferenceData: false,
    isLoading: false,
    totalEntries: 0,
    onLearnMore: fn(),
  },
}

export const Loading: Story = {
  args: {
    selectedLanguage: 'nl',
    selectedLanguageName: 'Dutch',
    hasReferenceData: false,
    isLoading: true,
    totalEntries: 0,
    onLearnMore: fn(),
  },
}

export const NoLanguageSelected: Story = {
  args: {
    selectedLanguage: null,
    selectedLanguageName: null,
    hasReferenceData: false,
    isLoading: false,
    totalEntries: 0,
    onLearnMore: fn(),
  },
}
