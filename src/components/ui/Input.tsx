import React, { useId } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text displayed above input */
  label?: string;
  /** Error message displayed below input */
  error?: string;
  /** Help text displayed below input (when no error) */
  helpText?: string;
  /** Size variant (sm, md, lg) */
  size?: InputSize;
  /** Icon to display at the start of the input */
  startIcon?: React.ReactNode;
  /** Icon to display at the end of the input */
  endIcon?: React.ReactNode;
  /** Full width of container */
  fullWidth?: boolean;
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above textarea */
  label?: string;
  /** Error message displayed below textarea */
  error?: string;
  /** Help text displayed below textarea (when no error) */
  helpText?: string;
  /** Size variant (sm, md, lg) */
  size?: InputSize;
  /** Full width of container */
  fullWidth?: boolean;
}

// ============================================================================
// STYLE CONSTANTS
// ============================================================================

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-lg',
};

const labelSizeClasses: Record<InputSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const iconSizeClasses: Record<InputSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

// ============================================================================
// INPUT COMPONENT
// ============================================================================

/**
 * Input
 *
 * A styled text input with support for labels, errors, help text, and icons.
 *
 * Features:
 * - Three sizes (sm, md, lg)
 * - Start and end icons
 * - Error and help text states
 * - Proper label association via useId()
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Input label="Email" placeholder="Enter email" />
 * <Input label="Search" startIcon={<SearchIcon />} />
 * <Input error="Invalid email" value={email} />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  size = 'md',
  startIcon,
  endIcon,
  fullWidth = true,
  className = '',
  id: providedId,
  ...props
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const baseClasses =
    'bg-white dark:bg-gray-800 border text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200';

  const borderClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-gray-500 focus:border-gray-500';

  const widthClass = fullWidth ? 'w-full' : '';

  const inputClasses = [
    baseClasses,
    borderClasses,
    sizeClasses[size],
    startIcon ? 'pl-10' : '',
    endIcon ? 'pr-10' : '',
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`space-y-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide ${labelSizeClasses[size]}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none ${iconSizeClasses[size]}`}
          >
            {startIcon}
          </div>
        )}
        <input
          id={id}
          className={inputClasses}
          style={{ borderRadius: '3px' }}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : helpText ? helpId : undefined}
          {...props}
        />
        {endIcon && (
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none ${iconSizeClasses[size]}`}
          >
            {endIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {!error && helpText && (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// TEXTAREA COMPONENT
// ============================================================================

/**
 * TextArea
 *
 * A styled multi-line text input with support for labels, errors, and help text.
 *
 * @example
 * ```tsx
 * <TextArea label="Description" placeholder="Enter description" rows={4} />
 * <TextArea error="Required field" />
 * ```
 */
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helpText,
  size = 'md',
  fullWidth = true,
  className = '',
  id: providedId,
  ...props
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const baseClasses =
    'bg-white dark:bg-gray-800 border text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 resize-none';

  const borderClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-gray-500 focus:border-gray-500';

  const widthClass = fullWidth ? 'w-full' : '';

  const textareaClasses = [baseClasses, borderClasses, sizeClasses[size], widthClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`space-y-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide ${labelSizeClasses[size]}`}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={textareaClasses}
        style={{ borderRadius: '3px' }}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : helpText ? helpId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {!error && helpText && (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// SELECT COMPONENT
// ============================================================================

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label text displayed above select */
  label?: string;
  /** Error message displayed below select */
  error?: string;
  /** Help text displayed below select (when no error) */
  helpText?: string;
  /** Size variant (sm, md, lg) */
  size?: InputSize;
  /** Full width of container */
  fullWidth?: boolean;
}

/**
 * Select
 *
 * A styled dropdown select with support for labels, errors, and help text.
 *
 * @example
 * ```tsx
 * <Select label="Country">
 *   <option value="">Select a country</option>
 *   <option value="us">United States</option>
 * </Select>
 * ```
 */
export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helpText,
  size = 'md',
  fullWidth = true,
  className = '',
  children,
  id: providedId,
  ...props
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const baseClasses =
    'bg-white dark:bg-gray-800 border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer';

  const borderClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-gray-500 focus:border-gray-500';

  const widthClass = fullWidth ? 'w-full' : '';

  const selectClasses = [baseClasses, borderClasses, sizeClasses[size], widthClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`space-y-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide ${labelSizeClasses[size]}`}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={selectClasses}
        style={{ borderRadius: '3px' }}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : helpText ? helpId : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {!error && helpText && (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}; 