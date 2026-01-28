import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input, TextArea, Select } from './Input'

// Input stories
const inputMeta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
}

export default inputMeta
type Story = StoryObj<typeof inputMeta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const WithHelpText: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    helpText: 'Choose a unique username for your account.',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    value: 'invalid-email',
    error: 'Please enter a valid email address.',
  },
}

export const Small: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'Cannot edit this',
    disabled: true,
  },
}

const SearchIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export const WithStartIcon: Story = {
  args: {
    placeholder: 'Search translations...',
    startIcon: <SearchIcon />,
  },
}

export const WithEndIcon: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    endIcon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium (default)" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
}

// TextArea stories
export const TextAreaDefault: Story = {
  render: () => <TextArea placeholder="Enter description..." rows={4} />,
  name: 'TextArea - Default',
}

export const TextAreaWithLabel: Story = {
  render: () => (
    <TextArea
      label="Translation Notes"
      placeholder="Add any context or notes for this translation..."
      rows={4}
      helpText="These notes help other translators understand the context."
    />
  ),
  name: 'TextArea - With Label',
}

export const TextAreaWithError: Story = {
  render: () => (
    <TextArea
      label="Required Field"
      error="This field is required."
      rows={3}
    />
  ),
  name: 'TextArea - With Error',
}

// Select stories
export const SelectDefault: Story = {
  render: () => (
    <Select label="Language">
      <option value="">Select a language</option>
      <option value="nl">Dutch</option>
      <option value="en">English</option>
      <option value="de">German</option>
      <option value="fr">French</option>
    </Select>
  ),
  name: 'Select - Default',
}

export const SelectWithError: Story = {
  render: () => (
    <Select label="Sheet" error="Please select a sheet to continue.">
      <option value="">Select a sheet</option>
    </Select>
  ),
  name: 'Select - With Error',
}

export const SelectWithHelpText: Story = {
  render: () => (
    <Select label="Export Format" helpText="Choose the format for your exported translations.">
      <option value="csv">CSV</option>
      <option value="xlsx">Excel (XLSX)</option>
      <option value="json">JSON</option>
    </Select>
  ),
  name: 'Select - With Help Text',
}
