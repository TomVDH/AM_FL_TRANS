/**
 * Mock Sheet Data for Storybook
 */

export interface MockSheet {
  name: string
  rowCount: number
  translatedCount: number
  status: 'not-started' | 'in-progress' | 'completed'
}

export const mockSheets: MockSheet[] = [
  { name: 'Episode01_Intro', rowCount: 45, translatedCount: 45, status: 'completed' },
  { name: 'Episode01_Dialogue', rowCount: 120, translatedCount: 120, status: 'completed' },
  { name: 'Episode02_Intro', rowCount: 38, translatedCount: 38, status: 'completed' },
  { name: 'Episode02_Dialogue', rowCount: 156, translatedCount: 89, status: 'in-progress' },
  { name: 'Episode03_Intro', rowCount: 42, translatedCount: 0, status: 'not-started' },
  { name: 'Episode03_Dialogue', rowCount: 187, translatedCount: 0, status: 'not-started' },
  { name: 'Episode04_Intro', rowCount: 35, translatedCount: 0, status: 'not-started' },
  { name: 'Episode04_Dialogue', rowCount: 143, translatedCount: 0, status: 'not-started' },
  { name: 'UI_Menus', rowCount: 67, translatedCount: 67, status: 'completed' },
  { name: 'UI_Messages', rowCount: 89, translatedCount: 45, status: 'in-progress' },
]

export const shortSheetList: MockSheet[] = mockSheets.slice(0, 3)

export const singleSheet: MockSheet[] = [
  { name: 'Episode12_Dialogue', rowCount: 256, translatedCount: 128, status: 'in-progress' },
]

// Helper to get completion percentage
export const getCompletionPercentage = (sheet: MockSheet): number => {
  if (sheet.rowCount === 0) return 0
  return Math.round((sheet.translatedCount / sheet.rowCount) * 100)
}

// Helper to get status color
export const getStatusColor = (status: MockSheet['status']): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 dark:text-green-400'
    case 'in-progress':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'not-started':
      return 'text-gray-400 dark:text-gray-500'
  }
}
