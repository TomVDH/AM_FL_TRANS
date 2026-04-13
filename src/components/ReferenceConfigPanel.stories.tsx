import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import ReferenceConfigPanel from './ReferenceConfigPanel'

const meta: Meta<typeof ReferenceConfigPanel> = {
  title: 'Features/ReferenceConfigPanel',
  component: ReferenceConfigPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    totalEntries: 42,
    isLoadingCodex: false,
    refreshCodex: fn(),
    onCodexUpdated: fn(),
    fileType: 'excel',
    onFileTypeChange: fn(),
    inputMode: 'excel',
    setInputMode: fn(),
    setShowResetModal: fn(),
    onFilesChanged: fn(),
    onExpandChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof ReferenceConfigPanel>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    isLoadingCodex: true,
  },
}

export const ExcelMode: Story = {
  args: {
    fileType: 'excel',
    inputMode: 'excel',
  },
}

export const JsonMode: Story = {
  args: {
    fileType: 'json',
    inputMode: 'embedded-json',
  },
}
