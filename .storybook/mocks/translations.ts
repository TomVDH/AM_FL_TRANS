/**
 * Mock Translation Data for Storybook
 */

export interface MockCodexMatch {
  name: string
  english: string
  dutch: string
  description?: string
  category?: string
  startIndex: number
  endIndex: number
}

export interface MockXlsxMatch {
  sourceEnglish: string
  translatedDutch: string
  utterer?: string
  context?: string
  sheetName?: string
  fileName?: string
}

export interface MockCSVEntry {
  english: string
  dutch: string
  context?: string
  utterer?: string
  sheetName?: string
}

// Sample codex matches (character names, terms)
export const mockCodexMatches: MockCodexMatch[] = [
  {
    name: 'Maria',
    english: 'Maria',
    dutch: 'Maria',
    description: 'Main protagonist',
    category: 'Characters',
    startIndex: 0,
    endIndex: 5,
  },
  {
    name: 'The Ancient Kingdom',
    english: 'The Ancient Kingdom',
    dutch: 'Het Oude Koninkrijk',
    description: 'A legendary kingdom from the old world',
    category: 'Locations',
    startIndex: 10,
    endIndex: 29,
  },
  {
    name: 'Dragon Stone',
    english: 'Dragon Stone',
    dutch: 'Drakensteen',
    description: 'A powerful artifact',
    category: 'Items',
    startIndex: 35,
    endIndex: 47,
  },
  {
    name: 'Lord Varis',
    english: 'Lord Varis',
    dutch: 'Heer Varis',
    description: 'The king of the northern lands',
    category: 'Characters',
    startIndex: 50,
    endIndex: 60,
  },
]

// Sample XLSX matches (previous translations)
export const mockXlsxMatches: MockXlsxMatch[] = [
  {
    sourceEnglish: 'Hello, how are you?',
    translatedDutch: 'Hallo, hoe gaat het?',
    utterer: 'Maria',
    context: 'Greeting scene',
    sheetName: 'Episode12',
    fileName: 'translations.xlsx',
  },
  {
    sourceEnglish: 'I need to find the key.',
    translatedDutch: 'Ik moet de sleutel vinden.',
    utterer: 'Protagonist',
    context: 'Quest dialogue',
    sheetName: 'Episode12',
    fileName: 'translations.xlsx',
  },
  {
    sourceEnglish: 'The door is locked.',
    translatedDutch: 'De deur is op slot.',
    context: 'System message',
    sheetName: 'Episode12',
    fileName: 'translations.xlsx',
  },
  {
    sourceEnglish: 'Thank you for your help.',
    translatedDutch: 'Bedankt voor je hulp.',
    utterer: 'NPC',
    context: 'Quest completion',
    sheetName: 'Episode12',
  },
]

// Sample CSV entries for quick suggestions
export const mockCSVEntries: MockCSVEntry[] = [
  {
    english: 'Good morning',
    dutch: 'Goedemorgen',
    context: 'Greeting',
  },
  {
    english: 'Please wait',
    dutch: 'Even wachten',
    context: 'UI',
  },
  {
    english: 'Save game',
    dutch: 'Spel opslaan',
    context: 'Menu',
  },
  {
    english: 'Continue',
    dutch: 'Doorgaan',
    context: 'Button',
  },
  {
    english: 'Are you sure?',
    dutch: 'Weet je het zeker?',
    context: 'Confirmation',
  },
  {
    english: 'Loading...',
    dutch: 'Laden...',
    context: 'UI',
  },
]

// Sample translation rows for review
export const mockTranslationRows = [
  {
    id: 1,
    sourceEnglish: 'Hello, how are you doing today?',
    translatedDutch: 'Hallo, hoe gaat het vandaag met je?',
    status: 'completed',
    utterer: 'Maria',
    context: 'Episode 12 - Opening scene',
  },
  {
    id: 2,
    sourceEnglish: 'I need to find the ancient scroll.',
    translatedDutch: 'Ik moet de oude rol vinden.',
    status: 'modified',
    utterer: 'Protagonist',
    context: 'Episode 12 - Quest start',
  },
  {
    id: 3,
    sourceEnglish: 'The castle gates are closed.',
    translatedDutch: '',
    status: 'blank',
    context: 'Episode 12 - Castle scene',
  },
  {
    id: 4,
    sourceEnglish: 'Thank you for saving us!',
    translatedDutch: 'Bedankt dat je ons hebt gered!',
    status: 'completed',
    utterer: 'Villager',
    context: 'Episode 12 - Rescue scene',
  },
  {
    id: 5,
    sourceEnglish: 'Where did everyone go?',
    translatedDutch: '',
    status: 'blank',
    utterer: 'Maria',
    context: 'Episode 12 - Mystery scene',
  },
]

// Helper functions for creating mock finders
export const createMockFindCharacterMatches = (matches: MockCodexMatch[] = mockCodexMatches) => {
  return (text: string): MockCodexMatch[] => {
    return matches.filter(match =>
      text.toLowerCase().includes(match.english.toLowerCase())
    )
  }
}

export const createMockFindXlsxMatches = (matches: MockXlsxMatch[] = mockXlsxMatches) => {
  return (text: string): MockXlsxMatch[] => {
    return matches.filter(match =>
      text.toLowerCase().includes(match.sourceEnglish.toLowerCase().substring(0, 10))
    )
  }
}
