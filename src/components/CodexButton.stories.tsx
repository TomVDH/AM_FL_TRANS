import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CodexButton from './CodexButton'

const meta: Meta<typeof CodexButton> = {
  title: 'Buttons/CodexButton',
  component: CodexButton,
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
      <CodexButton />
    </header>
  ),
  name: 'Use Case: In Header',
}

export const AllUtilityButtons: Story = {
  render: () => {
    // Import the other buttons inline for demonstration
    const VideoButton = require('./VideoButton').default
    const GitHubButton = require('./GitHubButton').default

    return (
      <div className="flex gap-2">
        <VideoButton />
        <GitHubButton />
        <CodexButton />
      </div>
    )
  },
  name: 'All Utility Buttons Together',
}
