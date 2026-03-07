'use client';

import React, { useState } from 'react';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * ResetConfirmationModal - Triple confirmation modal for nuclear reset
 *
 * Requires user to confirm 3 times before resetting all Excel files
 * from the /excels/Originals/ folder.
 */
const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [confirmationStep, setConfirmationStep] = useState(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmationStep < 3) {
      setConfirmationStep(confirmationStep + 1);
    } else {
      onConfirm();
      setConfirmationStep(1); // Reset for next time
    }
  };

  const handleCancel = () => {
    setConfirmationStep(1);
    onClose();
  };

  const getStepContent = () => {
    switch (confirmationStep) {
      case 1:
        return {
          title: '⚠️ Reset to Originals?',
          message: 'This will copy all files from /excels/Originals/ and OVERWRITE your current Excel files.',
          detail: 'All translations you have made will be lost.',
          buttonText: 'I Understand, Continue',
          buttonColor: 'bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 border-amber-700 dark:border-amber-600 hover:border-amber-600 dark:hover:border-amber-500'
        };
      case 2:
        return {
          title: '⚠️⚠️ Are You Absolutely Sure?',
          message: 'This action CANNOT be undone.',
          detail: 'All your work will be permanently lost unless you have a backup.',
          buttonText: 'Yes, I Am Sure',
          buttonColor: 'bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-500 dark:to-orange-600 border-orange-700 dark:border-orange-600 hover:border-orange-600 dark:hover:border-orange-500'
        };
      case 3:
        return {
          title: '🔥 FINAL WARNING 🔥',
          message: 'LAST CHANCE TO CANCEL',
          detail: 'Click "RESET NOW" to proceed with the nuclear reset.',
          buttonText: 'RESET NOW',
          buttonColor: 'bg-gradient-to-br from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 border-red-700 dark:border-red-600 hover:border-red-600 dark:hover:border-red-500'
        };
      default:
        return {
          title: '',
          message: '',
          detail: '',
          buttonText: '',
          buttonColor: ''
        };
    }
  };

  const content = getStepContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl max-w-lg w-full mx-4" style={{ borderRadius: '3px' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {content.title}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
              Confirmation {confirmationStep} of 3
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`w-16 h-1.5 ${
                    step <= confirmationStep
                      ? 'bg-red-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{ borderRadius: '1px' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {content.message}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {content.detail}
          </p>

          {/* Warning List */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-4 mb-4" style={{ borderRadius: '3px' }}>
            <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-2">
              What will happen:
            </p>
            <ul className="text-xs text-red-700 dark:text-red-400 space-y-1 list-disc list-inside">
              <li>All Excel files in /excels/ will be overwritten</li>
              <li>Original files will be copied from /excels/Originals/</li>
              <li>All translations will be lost</li>
              <li>You will be returned to Setup</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase"
            style={{ borderRadius: '3px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-bold text-white border hover:shadow-md transition-all duration-300 ease-out tracking-tight uppercase ${content.buttonColor}`}
            style={{ borderRadius: '3px' }}
          >
            {content.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmationModal;
