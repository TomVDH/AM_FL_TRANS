import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Spinner from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Loading...',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    label: 'Loading...',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Loading...',
  },
}

export const CustomLabel: Story = {
  args: {
    label: 'Saving translation...',
  },
}

export const NoLabel: Story = {
  args: {
    label: '',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Spinner size="sm" label="Small" />
      <Spinner size="md" label="Medium" />
      <Spinner size="lg" label="Large" />
    </div>
  ),
}

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Spinner label="Loading translations..." />
      <Spinner label="Saving changes..." />
      <Spinner label="Exporting file..." />
      <Spinner label="Processing Excel data..." />
    </div>
  ),
  name: 'Use Case: Loading States',
}

export const InlineWithText: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <span>Please wait while we process your request</span>
      <Spinner size="sm" label="" />
    </div>
  ),
  name: 'Use Case: Inline with Text',
}

export const InButton: Story = {
  render: () => (
    <button
      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      disabled
    >
      <Spinner size="sm" label="" className="text-white" />
      <span>Saving...</span>
    </button>
  ),
  name: 'Use Case: In Button',
}
