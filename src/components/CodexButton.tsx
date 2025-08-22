import React from 'react';

interface CodexButtonProps {
  className?: string;
}

const CodexButton: React.FC<CodexButtonProps> = ({ className = '' }) => {
  const handleCodexClick = () => {
    window.open('/codex-viewer.html', '_blank');
  };

  return (
    <button
      onClick={handleCodexClick}
      className={`inline-flex items-center justify-center p-3 border border-black dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-200 bg-white dark:bg-gray-700 shadow-sm dark:text-white text-sm hover:bg-gray-50 dark:hover:bg-gray-600 ${className}`}
      title="View Codex Reference"
      aria-label="View Codex Reference"
      style={{ borderRadius: '3px' }}
    >
      <svg
        className="w-5 h-5 text-gray-700 dark:text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    </button>
  );
};

export default CodexButton;
