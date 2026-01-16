import React from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Content inside the button */
  children: React.ReactNode;
  /** Show loading spinner and disable interaction */
  isLoading?: boolean;
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Position of the icon relative to children */
  iconPosition?: 'left' | 'right';
  /** Make button full width of container */
  fullWidth?: boolean;
}

// ============================================================================
// LOADING SPINNER
// ============================================================================

const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <svg
      className={`animate-spin ${sizeMap[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// ============================================================================
// STYLE CONSTANTS
// ============================================================================

const baseClasses =
  'inline-flex items-center justify-center font-black tracking-tight uppercase transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100',
  secondary:
    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-black dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
  outline:
    'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800',
  ghost:
    'bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none hover:shadow-none',
  danger:
    'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const disabledClasses =
  'disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:cursor-not-allowed';

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Button
 *
 * A versatile button component with multiple variants, sizes, and features.
 *
 * Features:
 * - Multiple visual variants (primary, secondary, outline, ghost, danger)
 * - Three sizes (sm, md, lg)
 * - Loading state with spinner
 * - Icon support (left or right position)
 * - Full-width option
 * - Dark mode support
 * - Focus ring for accessibility
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With loading state
 * <Button isLoading>Saving...</Button>
 *
 * // With icon
 * <Button icon={<PlusIcon />} iconPosition="left">Add Item</Button>
 *
 * // Full width
 * <Button fullWidth variant="primary">Submit</Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      style={{ borderRadius: '3px' }}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={size} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button; 