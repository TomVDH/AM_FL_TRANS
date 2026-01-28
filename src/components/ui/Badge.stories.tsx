import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Badge from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'blue', 'purple', 'green', 'red'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
}

export const Blue: Story = {
  args: {
    children: 'JSON',
    variant: 'blue',
  },
}

export const Purple: Story = {
  args: {
    children: 'Character',
    variant: 'purple',
  },
}

export const Green: Story = {
  args: {
    children: 'XLSX',
    variant: 'green',
  },
}

export const Red: Story = {
  args: {
    children: 'Required',
    variant: 'red',
  },
}

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="green">Green</Badge>
      <Badge variant="red">Red</Badge>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm" variant="blue">Small</Badge>
      <Badge size="md" variant="blue">Medium</Badge>
    </div>
  ),
}

export const TranslationStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-24">Pending:</span>
        <Badge variant="default">Not Started</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-24">In Progress:</span>
        <Badge variant="blue">Translating</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-24">Review:</span>
        <Badge variant="purple">Needs Review</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-24">Complete:</span>
        <Badge variant="green">Verified</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-24">Error:</span>
        <Badge variant="red">Missing</Badge>
      </div>
    </div>
  ),
  name: 'Use Case: Translation Status',
}

export const DataSources: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="blue" size="sm">JSON</Badge>
      <Badge variant="green" size="sm">XLSX</Badge>
      <Badge variant="purple" size="sm">Character</Badge>
      <Badge variant="default" size="sm">Codex</Badge>
    </div>
  ),
  name: 'Use Case: Data Sources',
}
