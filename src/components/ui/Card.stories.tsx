import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Card from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'bordered'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Card Title</h3>
        <p className="text-gray-600 dark:text-gray-400">This is some card content with the default variant.</p>
      </div>
    ),
    variant: 'default',
  },
}

export const Elevated: Story = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Elevated Card</h3>
        <p className="text-gray-600 dark:text-gray-400">This card has more shadow and a hover effect.</p>
      </div>
    ),
    variant: 'elevated',
  },
}

export const Bordered: Story = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Bordered Card</h3>
        <p className="text-gray-600 dark:text-gray-400">This card has no shadow, just a border.</p>
      </div>
    ),
    variant: 'bordered',
  },
}

export const WithRichContent: Story = {
  args: {
    children: (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            T
          </div>
          <div>
            <h3 className="font-bold">Translation Entry</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Episode 12</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This is an example of a card with richer content including an avatar and metadata.
        </p>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded">
            Dutch
          </span>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded">
            Verified
          </span>
        </div>
      </div>
    ),
    variant: 'elevated',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card variant="default">
        <div className="p-4 w-48">
          <h4 className="font-bold mb-2">Default</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Standard shadow</p>
        </div>
      </Card>
      <Card variant="elevated">
        <div className="p-4 w-48">
          <h4 className="font-bold mb-2">Elevated</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hover for effect</p>
        </div>
      </Card>
      <Card variant="bordered">
        <div className="p-4 w-48">
          <h4 className="font-bold mb-2">Bordered</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">No shadow</p>
        </div>
      </Card>
    </div>
  ),
}
