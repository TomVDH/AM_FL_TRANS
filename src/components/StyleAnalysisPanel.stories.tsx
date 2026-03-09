import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import StyleAnalysisPanel from './StyleAnalysisPanel'

const meta: Meta<typeof StyleAnalysisPanel> = {
  title: 'Features/StyleAnalysisPanel',
  component: StyleAnalysisPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StyleAnalysisPanel>

/**
 * Standalone accordion mode. Fetches from `/api/style-analysis` on mount.
 * In Storybook the API call will fail, showing the error/empty state.
 */
export const Standalone: Story = {}

/**
 * Embedded mode renders content directly without an accordion wrapper.
 * Used when the panel is nested inside ReferenceConfigPanel.
 */
export const Embedded: Story = {
  args: {
    embedded: true,
  },
}
