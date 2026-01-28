import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import GitHubButton from './GitHubButton'

const meta: Meta<typeof GitHubButton> = {
  title: 'Buttons/GitHubButton',
  component: GitHubButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomClass: Story = {
  args: {
    className: 'opacity-75',
  },
}

export const InHeader: Story = {
  render: () => (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-96">
      <h1 className="font-bold text-lg">AM Translations</h1>
      <GitHubButton />
    </header>
  ),
  name: 'Use Case: In Header',
}
