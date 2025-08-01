import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200";
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  const classes = [
    baseClasses,
    errorClasses,
    className
  ].join(' ');
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input 
        className={classes}
        style={{ borderRadius: '3px' }}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 resize-none";
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  const classes = [
    baseClasses,
    errorClasses,
    className
  ].join(' ');
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea 
        className={classes}
        style={{ borderRadius: '3px' }}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  className = '', 
  children,
  ...props 
}) => {
  const baseClasses = "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200";
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  const classes = [
    baseClasses,
    errorClasses,
    className
  ].join(' ');
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select 
        className={classes}
        style={{ borderRadius: '3px' }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}; 