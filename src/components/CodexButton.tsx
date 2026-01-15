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
      className={`group relative h-9 w-9 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden ${className}`}
      title="View Codex Reference"
      aria-label="View Codex Reference"
      style={{ borderRadius: '3px' }}
    >
      <svg
        className="w-4 h-4 relative z-10"
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
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
    </button>
  );
};

export default CodexButton;
