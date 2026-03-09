import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import SheetPreview from './SheetPreview'

/**
 * SheetPreview requires an `XLSX.WorkBook` object which is difficult to mock
 * in Storybook without importing real Excel data. The stories below demonstrate
 * the component's null/empty states. For full visual testing, use the component
 * within the SetupWizard with a real workbook loaded.
 */
const meta: Meta<typeof SheetPreview> = {
  title: 'Setup/SheetPreview',
  component: SheetPreview,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SheetPreview>

/**
 * When no workbook is provided, the component renders nothing (returns null).
 * This is the expected behavior when no file has been loaded yet.
 */
export const NoWorkbook: Story = {
  args: {
    workbook: null,
    sheetName: '',
    sourceColumn: 'A',
    targetColumn: 'B',
    startRow: 2,
    languageCode: 'NL',
  },
}
