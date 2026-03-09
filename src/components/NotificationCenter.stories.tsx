import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import NotificationCenter from './NotificationCenter'
import { fn } from '../../.storybook/mocks/utils'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  timestamp: Date
  undoAction?: () => void
}

const baseNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    message: 'Translation saved successfully',
    timestamp: new Date('2026-03-08T10:30:00'),
  },
  {
    id: '2',
    type: 'error',
    message: 'Failed to connect to translation API',
    timestamp: new Date('2026-03-08T10:28:00'),
  },
  {
    id: '3',
    type: 'info',
    message: 'New reference data available for Dutch',
    timestamp: new Date('2026-03-08T10:25:00'),
  },
  {
    id: '4',
    type: 'warning',
    message: 'Unsaved changes will be lost if you navigate away',
    timestamp: new Date('2026-03-08T10:20:00'),
  },
  {
    id: '5',
    type: 'success',
    message: 'Batch translation completed: 24 entries processed',
    timestamp: new Date('2026-03-08T10:15:00'),
  },
]

const meta: Meta<typeof NotificationCenter> = {
  title: 'Overlays/NotificationCenter',
  component: NotificationCenter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        {
          style: {
            position: 'relative',
            height: '400px',
            display: 'flex',
            alignItems: 'flex-end',
          },
        },
        React.createElement(Story, null)
      ),
  ],
}

export default meta
type Story = StoryObj<typeof NotificationCenter>

export const WithNotifications: Story = {
  args: {
    notifications: baseNotifications,
    unreadCount: 3,
    onMarkAllRead: fn(),
    onClearAll: fn(),
    onRemove: fn(),
  },
}

export const NoUnread: Story = {
  args: {
    notifications: baseNotifications,
    unreadCount: 0,
    onMarkAllRead: fn(),
    onClearAll: fn(),
    onRemove: fn(),
  },
}

export const Empty: Story = {
  args: {
    notifications: [],
    unreadCount: 0,
    onMarkAllRead: fn(),
    onClearAll: fn(),
    onRemove: fn(),
  },
}

export const WithUndoAction: Story = {
  args: {
    notifications: [
      {
        id: '1',
        type: 'warning' as const,
        message: 'Translation reverted to previous version',
        timestamp: new Date('2026-03-08T10:30:00'),
        undoAction: fn(),
      },
      {
        id: '2',
        type: 'info' as const,
        message: 'Style preference updated',
        timestamp: new Date('2026-03-08T10:28:00'),
      },
    ],
    unreadCount: 1,
    onMarkAllRead: fn(),
    onClearAll: fn(),
    onRemove: fn(),
  },
}
