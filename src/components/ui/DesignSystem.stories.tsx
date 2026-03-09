import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import DesignSystem from './DesignSystem'

const meta: Meta<typeof DesignSystem> = {
  title: 'UI/DesignSystem',
  component: DesignSystem,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DesignSystem>

export const Default: Story = {}
