import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from '../../.storybook/mocks/utils'
import { useState } from 'react'
import ResetConfirmationModal from './ResetConfirmationModal'
import Button from './ui/Button'

const meta: Meta<typeof ResetConfirmationModal> = {
  title: 'Modals/ResetConfirmationModal',
  component: ResetConfirmationModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive wrapper to demonstrate the modal
const InteractiveDemo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [resetCount, setResetCount] = useState(0)

  return (
    <div className="space-y-4 p-8">
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">Reset Confirmation Demo</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This modal requires 3 confirmations before executing the reset.
        </p>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Reset to Originals
        </Button>
        {resetCount > 0 && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            Reset executed {resetCount} time(s)
          </p>
        )}
      </div>
      <ResetConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setResetCount(prev => prev + 1)
          setIsOpen(false)
        }}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
}

export const Step1: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn(),
  },
  name: 'Step 1 - Initial Warning',
}

// Show step 2 by pre-advancing the state
const Step2Demo = () => {
  const [step, setStep] = useState(2)

  // Custom component that starts at step 2
  const ModalAtStep2 = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl max-w-lg w-full mx-4" style={{ borderRadius: '3px' }}>
          <div className="px-6 py-4 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              ⚠️⚠️ Are You Absolutely Sure?
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                Confirmation 2 of 3
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map(s => (
                  <div
                    key={s}
                    className={`w-16 h-1.5 ${s <= 2 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    style={{ borderRadius: '1px' }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-6">
            <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              This action CANNOT be undone.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              All your work will be permanently lost unless you have a backup.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-4" style={{ borderRadius: '3px' }}>
              <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-2">What will happen:</p>
              <ul className="text-xs text-red-700 dark:text-red-400 space-y-1 list-disc list-inside">
                <li>All Excel files in /excels/ will be overwritten</li>
                <li>Original files will be copied from /excels/Originals/</li>
                <li>All translations will be lost</li>
                <li>You will be returned to Setup</li>
              </ul>
            </div>
          </div>
          <div className="px-6 py-4 border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 flex gap-3 justify-end">
            <button className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 tracking-tight uppercase" style={{ borderRadius: '3px' }}>
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-br from-orange-600 to-orange-700 border border-orange-700 tracking-tight uppercase" style={{ borderRadius: '3px' }}>
              Yes, I Am Sure
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <ModalAtStep2 />
}

export const Step2: Story = {
  render: () => <Step2Demo />,
  name: 'Step 2 - Secondary Warning',
}

// Show step 3 - final warning
const Step3Demo = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl max-w-lg w-full mx-4" style={{ borderRadius: '3px' }}>
        <div className="px-6 py-4 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            FINAL WARNING
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
              Confirmation 3 of 3
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className="w-16 h-1.5 bg-red-500"
                  style={{ borderRadius: '1px' }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            LAST CHANCE TO CANCEL
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Click &quot;RESET NOW&quot; to proceed with the nuclear reset.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-4" style={{ borderRadius: '3px' }}>
            <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-2">What will happen:</p>
            <ul className="text-xs text-red-700 dark:text-red-400 space-y-1 list-disc list-inside">
              <li>All Excel files in /excels/ will be overwritten</li>
              <li>Original files will be copied from /excels/Originals/</li>
              <li>All translations will be lost</li>
              <li>You will be returned to Setup</li>
            </ul>
          </div>
        </div>
        <div className="px-6 py-4 border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 flex gap-3 justify-end">
          <button className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 tracking-tight uppercase" style={{ borderRadius: '3px' }}>
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-br from-red-600 to-red-700 border border-red-700 tracking-tight uppercase" style={{ borderRadius: '3px' }}>
            RESET NOW
          </button>
        </div>
      </div>
    </div>
  )
}

export const Step3: Story = {
  render: () => <Step3Demo />,
  name: 'Step 3 - Final Warning',
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: fn(),
    onConfirm: fn(),
  },
  name: 'Closed State (Nothing Rendered)',
}
