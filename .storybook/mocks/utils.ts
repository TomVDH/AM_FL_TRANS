/**
 * Storybook mock utilities
 */

// Simple mock function for action callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fn = (): ((...args: any[]) => void) => {
  return (...args: unknown[]) => {
    console.log('Action called with:', args)
  }
}
