import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Heading, Subheading, Title, Body, Caption, Label, Monospace } from './Typography'

const meta: Meta = {
  title: 'UI/Typography',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const HeadingStory: Story = {
  render: () => <Heading>AM Translations Helper</Heading>,
  name: 'Heading',
}

export const SubheadingStory: Story = {
  render: () => <Subheading>Translation Workflow</Subheading>,
  name: 'Subheading',
}

export const TitleStory: Story = {
  render: () => <Title>Episode 12: The Beginning</Title>,
  name: 'Title',
}

export const BodyStory: Story = {
  render: () => (
    <Body>
      This is body text used for paragraphs and general content. It has a comfortable line height
      for readability and works well in both light and dark modes.
    </Body>
  ),
  name: 'Body',
}

export const CaptionStory: Story = {
  render: () => <Caption>Last updated: January 20, 2026</Caption>,
  name: 'Caption',
}

export const LabelStory: Story = {
  render: () => <Label>Source Text</Label>,
  name: 'Label',
}

export const MonospaceStory: Story = {
  render: () => <Monospace>EP12_DIALOGUE_001</Monospace>,
  name: 'Monospace',
}

export const AllTypography: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Caption className="mb-1">Heading</Caption>
        <Heading>AM Translations Helper</Heading>
      </div>
      <div>
        <Caption className="mb-1">Subheading</Caption>
        <Subheading>Translation Workflow</Subheading>
      </div>
      <div>
        <Caption className="mb-1">Title</Caption>
        <Title>Episode 12: The Beginning</Title>
      </div>
      <div>
        <Caption className="mb-1">Body</Caption>
        <Body>
          This is body text used for paragraphs and general content. It has a comfortable
          line height for readability.
        </Body>
      </div>
      <div>
        <Caption className="mb-1">Caption</Caption>
        <Caption>Last updated: January 20, 2026</Caption>
      </div>
      <div>
        <Caption className="mb-1">Label</Caption>
        <Label>Source Text</Label>
      </div>
      <div>
        <Caption className="mb-1">Monospace</Caption>
        <Monospace>EP12_DIALOGUE_001</Monospace>
      </div>
    </div>
  ),
  name: 'All Typography Styles',
}

export const TranslationEntry: Story = {
  render: () => (
    <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded">
      <div className="flex items-center justify-between">
        <Title>Dialogue Entry</Title>
        <Monospace>EP12_001</Monospace>
      </div>
      <div>
        <Label>Source (English)</Label>
        <Body className="mt-1">Hello, how are you doing today?</Body>
      </div>
      <div>
        <Label>Translation (Dutch)</Label>
        <Body className="mt-1">Hallo, hoe gaat het met je vandaag?</Body>
      </div>
      <Caption>Modified 2 hours ago by translator@example.com</Caption>
    </div>
  ),
  name: 'Use Case: Translation Entry',
}

export const PageHeader: Story = {
  render: () => (
    <div className="space-y-2">
      <Heading>Episode 12</Heading>
      <Subheading>The Beginning of Everything</Subheading>
      <Caption>45 dialogue entries • 12 translated • 33 remaining</Caption>
    </div>
  ),
  name: 'Use Case: Page Header',
}
