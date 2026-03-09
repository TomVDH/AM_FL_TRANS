import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import WorkspaceToolsPanel from './WorkspaceToolsPanel'

const PlaceholderContent = ({ label }: { label: string }) => (
  <div className="p-4 text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded">
    {label}
  </div>
)

const meta: Meta<typeof WorkspaceToolsPanel> = {
  title: 'Features/WorkspaceToolsPanel',
  component: WorkspaceToolsPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onForceTabHandled: fn(),
    renderReference: () => <PlaceholderContent label="Reference content here..." />,
    renderQuickRef: () => <PlaceholderContent label="Quick reference content here..." />,
    renderOutput: () => <PlaceholderContent label="Output content here..." />,
    renderBulkTranslate: () => <PlaceholderContent label="Bulk translate content here..." />,
  },
}

export default meta
type Story = StoryObj<typeof WorkspaceToolsPanel>

export const Default: Story = {}

export const WithBadgeCounts: Story = {
  args: {
    referenceCount: 5,
    memoryMatchCount: 3,
    outputCount: 12,
  },
}

export const BulkTranslating: Story = {
  args: {
    bulkStatus: 'translating',
    forceTab: 'bulk',
  },
}

export const Empty: Story = {
  args: {
    renderReference: () => (
      <div className="p-4 text-sm text-gray-400 dark:text-gray-500 italic">No reference data loaded.</div>
    ),
    renderQuickRef: () => (
      <div className="p-4 text-sm text-gray-400 dark:text-gray-500 italic">No quick reference matches.</div>
    ),
    renderOutput: () => (
      <div className="p-4 text-sm text-gray-400 dark:text-gray-500 italic">No output entries yet.</div>
    ),
    renderBulkTranslate: () => (
      <div className="p-4 text-sm text-gray-400 dark:text-gray-500 italic">Bulk translate not started.</div>
    ),
  },
}
