import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import AppFooter from './AppFooter'
import { fn } from '../../.storybook/mocks/utils'

const meta: Meta<typeof AppFooter> = {
  title: 'Layout/AppFooter',
  component: AppFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof AppFooter>

export const SetupVariant: Story = {
  args: {
    darkMode: false,
    toggleDarkMode: fn(),
    gradientColors: ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'],
    showVersionHash: true,
    VERSION_HASH: 'v5.0.0',
    variant: 'setup',
    onVersionBadgeHover: fn(),
    onVersionBadgeClick: fn(),
  },
}

export const TranslationVariant: Story = {
  args: {
    darkMode: false,
    toggleDarkMode: fn(),
    gradientColors: ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'],
    showVersionHash: true,
    VERSION_HASH: 'v5.0.0',
    variant: 'translation',
    onVersionBadgeHover: fn(),
    onVersionBadgeClick: fn(),
  },
}

export const DarkMode: Story = {
  args: {
    darkMode: true,
    toggleDarkMode: fn(),
    gradientColors: ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'],
    showVersionHash: true,
    VERSION_HASH: 'v5.0.0',
    variant: 'setup',
    onVersionBadgeHover: fn(),
    onVersionBadgeClick: fn(),
  },
}

export const WithCustomActions: Story = {
  args: {
    darkMode: false,
    toggleDarkMode: fn(),
    gradientColors: ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'],
    showVersionHash: true,
    VERSION_HASH: 'v5.0.0',
    variant: 'translation',
    onVersionBadgeHover: fn(),
    onVersionBadgeClick: fn(),
    renderActions: () =>
      React.createElement('div', { style: { display: 'flex', gap: '8px' } }, [
        React.createElement(
          'button',
          { key: 'save', style: { padding: '4px 12px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' } },
          'Save'
        ),
        React.createElement(
          'button',
          { key: 'export', style: { padding: '4px 12px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' } },
          'Export'
        ),
      ]),
  },
}

export const MinimalSetup: Story = {
  args: {
    darkMode: false,
    toggleDarkMode: fn(),
    gradientColors: [],
    showVersionHash: false,
    VERSION_HASH: '',
    variant: 'setup',
  },
}
