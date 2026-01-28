/**
 * Mock Codex Data for Storybook
 */
import React from 'react'

export interface CodexEntry {
  english: string
  dutch: string
  nicknames?: string[]
}

export interface CodexData {
  [category: string]: CodexEntry[]
}

// Sample codex data organized by category
export const mockCodexData: CodexData = {
  'Characters': [
    { english: 'Maria', dutch: 'Maria', nicknames: ['Mar', 'M'] },
    { english: 'Lord Varis', dutch: 'Heer Varis', nicknames: ['Varis', 'The Lord'] },
    { english: 'Elena', dutch: 'Elena', nicknames: ['E', 'Lena'] },
    { english: 'The Sage', dutch: 'De Wijze', nicknames: ['Sage', 'Old Man'] },
    { english: 'Captain Storm', dutch: 'Kapitein Storm' },
  ],
  'Locations': [
    { english: 'The Ancient Kingdom', dutch: 'Het Oude Koninkrijk' },
    { english: 'Crystal Cave', dutch: 'Kristalgrot' },
    { english: 'Shadow Forest', dutch: 'Schaduwbos' },
    { english: 'Port Meridian', dutch: 'Haven Meridian' },
    { english: 'Dragon Peak', dutch: 'Drakenpiek' },
  ],
  'Items': [
    { english: 'Dragon Stone', dutch: 'Drakensteen' },
    { english: 'Ancient Scroll', dutch: 'Oude Rol' },
    { english: 'Magic Key', dutch: 'Magische Sleutel' },
    { english: 'Health Potion', dutch: 'Gezondheidsdrank' },
    { english: 'Silver Sword', dutch: 'Zilveren Zwaard' },
  ],
  'Creatures': [
    { english: 'Shadow Wolf', dutch: 'Schaduwwolf' },
    { english: 'Fire Dragon', dutch: 'Vuurdraak' },
    { english: 'Ice Golem', dutch: 'IJsgolem' },
    { english: 'Forest Spirit', dutch: 'Bosgeest' },
  ],
  'Spells': [
    { english: 'Fireball', dutch: 'Vuurbal' },
    { english: 'Ice Shield', dutch: 'IJsschild' },
    { english: 'Healing Light', dutch: 'Genezend Licht' },
    { english: 'Thunder Strike', dutch: 'Donderslag' },
  ],
}

// Empty codex for testing loading states
export const emptyCodexData: CodexData = {}

// Single category codex for simpler demos
export const singleCategoryCodex: CodexData = {
  'Characters': mockCodexData['Characters'],
}

// Helper to create accordion states
export const createAccordionStates = (data: CodexData, defaultOpen = false): { [key: string]: boolean } => {
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = defaultOpen
    return acc
  }, {} as { [key: string]: boolean })
}

// Helper to create a render function for codex items
export const createRenderCodexItems = (data: CodexData) => {
  return (category: string, categoryKey: string) => {
    const items = data[category]
    if (!items) return null

    return items.map((item, index) => (
      <div
        key={index}
        className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
      >
        <div>
          <span className="font-medium text-gray-900 dark:text-gray-100">{item.english}</span>
          {item.nicknames && item.nicknames.length > 0 && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              ({item.nicknames.join(', ')})
            </span>
          )}
        </div>
        <span className="text-purple-600 dark:text-purple-400 font-semibold">{item.dutch}</span>
      </div>
    ))
  }
}
