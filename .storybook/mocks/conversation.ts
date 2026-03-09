/**
 * Mock Conversation Data for Storybook
 */

import type { ConversationRow } from '@/components/conversation/ChatBubble';

// Sample conversation rows for story demos
export const mockConversationRows: ConversationRow[] = [
  {
    index: 0,
    type: 'system',
    speakerName: '',
    sourceText: 'INT. CASTLE THRONE ROOM — DAY',
    translation: 'INT. KASTEEL TROONZAAL — DAG',
    isTranslated: true,
    isModified: false,
    codexEntry: null,
    color: '',
    isProtagonist: false,
    contextNote: 'Scene direction',
  },
  {
    index: 1,
    type: 'dialogue',
    speakerName: 'Maria',
    sourceText: 'We need to find the Dragon Stone before Lord Varis does.',
    translation: 'We moeten de Drakensteen vinden voordat Heer Varis dat doet.',
    isTranslated: true,
    isModified: false,
    codexEntry: {
      english: 'Maria',
      dutch: 'Maria',
      gender: 'female',
      dialogueStyle: 'Confident, direct. Uses short declarative sentences.',
      bio: 'Main protagonist. A young scholar who discovers she has magical abilities.',
    },
    color: 'blue',
    isProtagonist: true,
    contextNote: '',
  },
  {
    index: 2,
    type: 'dialogue',
    speakerName: 'Lord Varis',
    sourceText: 'You think you can stop me? I have been searching for centuries.',
    translation: 'Denk je dat je me kunt tegenhouden? Ik zoek al eeuwen.',
    isTranslated: true,
    isModified: true,
    codexEntry: {
      english: 'Lord Varis',
      dutch: 'Heer Varis',
      gender: 'male',
      dialogueStyle: 'Aristocratic, menacing. Favors rhetorical questions.',
      bio: 'The king of the northern lands. An ancient sorcerer obsessed with power.',
    },
    color: 'amber',
    isProtagonist: false,
    contextNote: '',
  },
  {
    index: 3,
    type: 'dialogue',
    speakerName: 'Elena',
    sourceText: 'Maria, look out! He is casting a spell!',
    translation: '',
    isTranslated: false,
    isModified: false,
    codexEntry: {
      english: 'Elena',
      dutch: 'Elena',
      gender: 'female',
      dialogueStyle: 'Energetic, excitable. Uses exclamations frequently.',
    },
    color: 'violet',
    isProtagonist: false,
    contextNote: 'shouting',
  },
  {
    index: 4,
    type: 'system',
    speakerName: '',
    sourceText: 'A bright light fills the room.',
    translation: '',
    isTranslated: false,
    isModified: false,
    codexEntry: null,
    color: '',
    isProtagonist: false,
    contextNote: '',
  },
  {
    index: 5,
    type: 'dialogue',
    speakerName: 'The Sage',
    sourceText: 'Enough! The ancient power is not meant for mortals.',
    translation: 'Genoeg! De oude kracht is niet bedoeld voor stervelingen.',
    isTranslated: true,
    isModified: false,
    codexEntry: {
      english: 'The Sage',
      dutch: 'De Wijze',
      gender: 'male',
      dialogueStyle: 'Calm, wise. Speaks in measured, deliberate tones.',
      bio: 'An old hermit who guards the secrets of the ancient kingdom.',
    },
    color: 'emerald',
    isProtagonist: false,
    contextNote: '',
  },
  {
    index: 6,
    type: 'dialogue',
    speakerName: 'Maria',
    sourceText: 'What do you mean? What ancient power?',
    translation: '',
    isTranslated: false,
    isModified: false,
    codexEntry: {
      english: 'Maria',
      dutch: 'Maria',
      gender: 'female',
      dialogueStyle: 'Confident, direct. Uses short declarative sentences.',
    },
    color: 'blue',
    isProtagonist: true,
    contextNote: '',
  },
  {
    index: 7,
    type: 'dialogue',
    speakerName: 'Captain Storm',
    sourceText: 'My soldiers have secured the perimeter. No one gets in or out.',
    translation: 'Mijn soldaten hebben de perimeter beveiligd. Niemand komt erin of eruit.',
    isTranslated: true,
    isModified: false,
    codexEntry: {
      english: 'Captain Storm',
      dutch: 'Kapitein Storm',
    },
    color: 'rose',
    isProtagonist: false,
    contextNote: '',
  },
];

// Short conversation for compact demos
export const shortConversation: ConversationRow[] = mockConversationRows.slice(0, 4);

// All-translated conversation
export const fullyTranslatedConversation: ConversationRow[] = mockConversationRows.map(row => ({
  ...row,
  translation: row.translation || 'Mock vertaling hier...',
  isTranslated: true,
}));

// All-untranslated conversation
export const untranslatedConversation: ConversationRow[] = mockConversationRows.map(row => ({
  ...row,
  translation: '',
  isTranslated: false,
  isModified: false,
}));

// Speaker list extracted from conversation
export const mockSpeakers = ['Maria', 'Lord Varis', 'Elena', 'The Sage', 'Captain Storm'];

// Color map for speakers
export const mockColorMap = new Map<string, number>([
  ['Maria', 0],
  ['Lord Varis', 1],
  ['Elena', 2],
  ['The Sage', 3],
  ['Captain Storm', 4],
]);

// Mock notification data
export interface MockNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
  undoAction?: () => void;
}

export const mockNotifications: MockNotification[] = [
  {
    id: 'n1',
    type: 'success',
    message: 'Translation saved for Episode02_Dialogue row 45',
    timestamp: new Date(Date.now() - 30_000),
  },
  {
    id: 'n2',
    type: 'info',
    message: 'Codex updated: 3 new entries added',
    timestamp: new Date(Date.now() - 120_000),
  },
  {
    id: 'n3',
    type: 'warning',
    message: 'AI suggestion confidence below threshold (42%)',
    timestamp: new Date(Date.now() - 300_000),
  },
  {
    id: 'n4',
    type: 'error',
    message: 'Failed to sync with Google Sheets — check connection',
    timestamp: new Date(Date.now() - 600_000),
  },
  {
    id: 'n5',
    type: 'success',
    message: 'Bulk translation completed for 25 rows',
    timestamp: new Date(Date.now() - 3600_000),
  },
];

// Mock detected languages
export interface MockDetectedLanguage {
  code: string;
  name: string;
  column: string;
  headerText: string;
  sheets: string[];
  totalSheets: number;
}

export const mockDetectedLanguages: MockDetectedLanguage[] = [
  {
    code: 'NL',
    name: 'Dutch',
    column: 'C',
    headerText: 'Dutch Translation',
    sheets: ['Episode01_Intro', 'Episode01_Dialogue', 'Episode02_Intro', 'Episode02_Dialogue'],
    totalSheets: 10,
  },
  {
    code: 'PT',
    name: 'Portuguese',
    column: 'D',
    headerText: 'Portuguese',
    sheets: ['Episode01_Intro', 'Episode01_Dialogue'],
    totalSheets: 10,
  },
  {
    code: 'FR',
    name: 'French',
    column: 'E',
    headerText: 'French Translation',
    sheets: ['Episode01_Intro'],
    totalSheets: 10,
  },
];

export const singleLanguage: MockDetectedLanguage[] = [mockDetectedLanguages[0]];
