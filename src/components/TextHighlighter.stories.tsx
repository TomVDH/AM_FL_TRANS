import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'

// Note: TextHighlighter has complex hook dependencies, so we create a simplified mock version
// that demonstrates the visual highlighting styles without the full hook infrastructure.

const meta: Meta = {
  title: 'Features/TextHighlighter',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" style={{ borderRadius: '3px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

// Mock highlighted text component for demonstration
const MockHighlightedText = ({
  children,
  type,
  dutchText,
  onClick,
}: {
  children: React.ReactNode
  type: 'json' | 'xlsx' | 'character' | 'clickable'
  dutchText: string
  onClick?: () => void
}) => {
  const classMap = {
    json: 'highlight-tag highlight-json',
    xlsx: 'highlight-tag highlight-xlsx',
    character: 'highlight-tag highlight-character',
    clickable: 'highlight-tag highlight-clickable',
  }

  return (
    <span
      className={classMap[type]}
      title={dutchText}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </span>
  )
}

export const HighlightTypes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">JSON Highlight (Blue)</h4>
        <p className="text-gray-900 dark:text-gray-100">
          The player said{' '}
          <MockHighlightedText type="json" dutchText="Hallo, hoe gaat het?">
            Hello, how are you
          </MockHighlightedText>
          {' '}to the merchant.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">XLSX Highlight (Green)</h4>
        <p className="text-gray-900 dark:text-gray-100">
          Previously translated:{' '}
          <MockHighlightedText type="xlsx" dutchText="De deur is op slot">
            The door is locked
          </MockHighlightedText>
          {' '}appears in Episode 5.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Character Highlight (Purple)</h4>
        <p className="text-gray-900 dark:text-gray-100">
          <MockHighlightedText type="character" dutchText="Maria">
            Maria
          </MockHighlightedText>
          {' '}walked into the room and greeted{' '}
          <MockHighlightedText type="character" dutchText="Heer Varis">
            Lord Varis
          </MockHighlightedText>
          .
        </p>
      </div>

      <div>
        <h4 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Clickable/Codex Highlight (Red)</h4>
        <p className="text-gray-900 dark:text-gray-100">
          She traveled to{' '}
          <MockHighlightedText type="clickable" dutchText="Het Oude Koninkrijk" onClick={fn()}>
            The Ancient Kingdom
          </MockHighlightedText>
          {' '}seeking the legendary{' '}
          <MockHighlightedText type="clickable" dutchText="Drakensteen" onClick={fn()}>
            Dragon Stone
          </MockHighlightedText>
          .
        </p>
      </div>
    </div>
  ),
  name: 'All Highlight Types',
}

export const MixedHighlights: Story = {
  render: () => (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Mixed Highlights in Context</h4>
      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
        <MockHighlightedText type="character" dutchText="Maria">Maria</MockHighlightedText>
        {' '}stood at the gates of{' '}
        <MockHighlightedText type="clickable" dutchText="Het Oude Koninkrijk">The Ancient Kingdom</MockHighlightedText>
        . She remembered what{' '}
        <MockHighlightedText type="character" dutchText="De Wijze">The Sage</MockHighlightedText>
        {' '}had told her:{' '}
        <MockHighlightedText type="json" dutchText="De sleutel ligt bij de draak">
          The key lies with the dragon
        </MockHighlightedText>
        . She had heard similar words before:{' '}
        <MockHighlightedText type="xlsx" dutchText="Zoek de draak in het noorden">
          Seek the dragon in the north
        </MockHighlightedText>
        .
      </p>
    </div>
  ),
}

export const DenseHighlights: Story = {
  render: () => (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Dense Highlight Scenario</h4>
      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
        <MockHighlightedText type="character" dutchText="Maria">Maria</MockHighlightedText>
        ,{' '}
        <MockHighlightedText type="character" dutchText="Heer Varis">Lord Varis</MockHighlightedText>
        , and{' '}
        <MockHighlightedText type="character" dutchText="Elena">Elena</MockHighlightedText>
        {' '}gathered at{' '}
        <MockHighlightedText type="clickable" dutchText="Kristalgrot">Crystal Cave</MockHighlightedText>
        {' '}to discuss the{' '}
        <MockHighlightedText type="clickable" dutchText="Drakensteen">Dragon Stone</MockHighlightedText>
        {' '}and the{' '}
        <MockHighlightedText type="clickable" dutchText="Magische Sleutel">Magic Key</MockHighlightedText>
        .
      </p>
    </div>
  ),
}

export const NoHighlights: Story = {
  render: () => (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Text Without Highlights</h4>
      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
        This is a paragraph of text that does not contain any terms that match
        the codex, character database, or previous translations. It displays
        as plain text without any interactive highlights.
      </p>
    </div>
  ),
}

export const HoverBehavior: Story = {
  render: () => (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Hover over highlights to see Dutch translation</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Each highlighted term shows its Dutch translation in a tooltip on hover.
      </p>
      <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-lg">
        <MockHighlightedText type="json" dutchText="Goedemorgen">
          Good morning
        </MockHighlightedText>
        {', '}
        <MockHighlightedText type="character" dutchText="Maria">
          Maria
        </MockHighlightedText>
        {'. '}
        <MockHighlightedText type="xlsx" dutchText="Hoe gaat het met je?">
          How are you doing?
        </MockHighlightedText>
        {' '}
        <MockHighlightedText type="clickable" dutchText="Het Oude Koninkrijk">
          The Ancient Kingdom
        </MockHighlightedText>
        {' awaits.'}
      </p>
    </div>
  ),
  name: 'Interactive: Hover for Translation',
}

export const HighlightLegend: Story = {
  render: () => (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Highlight Color Legend</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <span className="highlight-tag highlight-json px-2 py-1">JSON</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Localization Manual matches</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <span className="highlight-tag highlight-xlsx px-2 py-1">XLSX</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Previous translation matches</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <span className="highlight-tag highlight-character px-2 py-1">Character</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Character name matches</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <span className="highlight-tag highlight-clickable px-2 py-1">Codex</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Clickable world references</span>
        </div>
      </div>
    </div>
  ),
}
