import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import SourceBadge from './SourceBadge'

const meta: Meta<typeof SourceBadge> = {
  title: 'Reference/SourceBadge',
  component: SourceBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    source: {
      control: 'select',
      options: ['json', 'xlsx', 'character', 'codex'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    showIcon: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Json: Story = {
  args: {
    source: 'json',
    size: 'sm',
    showIcon: true,
  },
}

export const Xlsx: Story = {
  args: {
    source: 'xlsx',
    size: 'sm',
    showIcon: true,
  },
}

export const Character: Story = {
  args: {
    source: 'character',
    size: 'sm',
    showIcon: true,
  },
}

export const Codex: Story = {
  args: {
    source: 'codex',
    size: 'sm',
    showIcon: true,
  },
}

export const MediumSize: Story = {
  args: {
    source: 'json',
    size: 'md',
    showIcon: true,
  },
}

export const WithoutIcon: Story = {
  args: {
    source: 'xlsx',
    size: 'sm',
    showIcon: false,
  },
}

export const AllSources: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <SourceBadge source="json" />
      <SourceBadge source="xlsx" />
      <SourceBadge source="character" />
      <SourceBadge source="codex" />
    </div>
  ),
}

export const AllSourcesMedium: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <SourceBadge source="json" size="md" />
      <SourceBadge source="xlsx" size="md" />
      <SourceBadge source="character" size="md" />
      <SourceBadge source="codex" size="md" />
    </div>
  ),
  name: 'All Sources (Medium)',
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-between">
        <span className="text-sm">Hello, how are you?</span>
        <SourceBadge source="json" />
      </div>
      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-between">
        <span className="text-sm">Maria enters the room</span>
        <SourceBadge source="xlsx" />
      </div>
      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-between">
        <span className="text-sm">Protagonist</span>
        <SourceBadge source="character" />
      </div>
      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-between">
        <span className="text-sm">The Ancient Kingdom</span>
        <SourceBadge source="codex" />
      </div>
    </div>
  ),
  name: 'Use Case: In Translation Results',
}
