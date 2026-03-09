import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import FloatingShortcutsPanel from './FloatingShortcutsPanel'
import { fn } from '../../.storybook/mocks/utils'

const meta: Meta<typeof FloatingShortcutsPanel> = {
  title: 'Overlays/FloatingShortcutsPanel',
  component: FloatingShortcutsPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        { style: { position: 'relative', width: '320px' } },
        React.createElement(Story, null)
      ),
  ],
}

export default meta
type Story = StoryObj<typeof FloatingShortcutsPanel>

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: fn(),
  },
}
