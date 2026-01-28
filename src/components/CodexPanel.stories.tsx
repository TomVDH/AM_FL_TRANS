import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import CodexPanel from './CodexPanel'
import {
  mockCodexData,
  emptyCodexData,
  singleCategoryCodex,
  createAccordionStates,
  createRenderCodexItems,
} from '../../.storybook/mocks/codex'

const meta: Meta<typeof CodexPanel> = {
  title: 'Reference/CodexPanel',
  component: CodexPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive wrapper to handle accordion state
const InteractiveCodexPanel = ({
  codexData,
  isLoading = false,
  defaultOpen = false,
}: {
  codexData: typeof mockCodexData
  isLoading?: boolean
  defaultOpen?: boolean
}) => {
  const [accordionStates, setAccordionStates] = useState(createAccordionStates(codexData, defaultOpen))

  const toggleAccordion = (category: string) => {
    setAccordionStates(prev => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <CodexPanel
      codexData={codexData}
      accordionStates={accordionStates}
      isLoadingCodex={isLoading}
      toggleAccordion={toggleAccordion}
      renderCodexItems={createRenderCodexItems(codexData)}
    />
  )
}

export const Default: Story = {
  render: () => <InteractiveCodexPanel codexData={mockCodexData} />,
}

export const WithOneOpen: Story = {
  render: () => {
    const WithOpen = () => {
      const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({
        ...createAccordionStates(mockCodexData),
        Characters: true, // Pre-open Characters
      })

      const toggleAccordion = (category: string) => {
        setAccordionStates(prev => ({
          ...prev,
          [category]: !prev[category],
        }))
      }

      return (
        <CodexPanel
          codexData={mockCodexData}
          accordionStates={accordionStates}
          isLoadingCodex={false}
          toggleAccordion={toggleAccordion}
          renderCodexItems={createRenderCodexItems(mockCodexData)}
        />
      )
    }

    return <WithOpen />
  },
  name: 'With One Section Open',
}

export const AllOpen: Story = {
  render: () => <InteractiveCodexPanel codexData={mockCodexData} defaultOpen={true} />,
  name: 'All Sections Open',
}

export const SingleCategory: Story = {
  render: () => <InteractiveCodexPanel codexData={singleCategoryCodex} defaultOpen={true} />,
}

export const Loading: Story = {
  render: () => <InteractiveCodexPanel codexData={emptyCodexData} isLoading={true} />,
}

export const Empty: Story = {
  render: () => <InteractiveCodexPanel codexData={emptyCodexData} />,
  name: 'No Data Available',
}

export const InSidePanel: Story = {
  render: () => (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 border-l border-gray-200 dark:border-gray-700 min-h-[400px]">
      <InteractiveCodexPanel codexData={mockCodexData} />
    </div>
  ),
  name: 'Use Case: In Side Panel',
}
