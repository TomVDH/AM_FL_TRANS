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

// DESIGN.md spec: 900 weight, uppercase, 0.05em tracking, sharp 3px, lift on hover.
// Achromatic chrome — danger uses Cue Red because destructive actions ARE a Provenance signal.
const baseClasses =
  'inline-flex items-center justify-center font-black uppercase transition-all duration-200 ease-out shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] disabled:transform-none disabled:hover:shadow-sm disabled:cursor-not-allowed focus:outline-none';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#f9fafb] text-[#111827] hover:bg-[#e5e7eb]',
  secondary:
    'bg-[#1f2937] text-[#f9fafb] border border-[#4b5563] hover:bg-[#374151] hover:border-[#6b7280]',
  outline:
    'bg-transparent border border-[#4b5563] text-[#f9fafb] hover:bg-[#1f2937] hover:border-[#6b7280]',
  ghost:
    'bg-transparent text-[#f9fafb] hover:bg-[#1f2937] shadow-none hover:shadow-none',
  danger:
    'bg-[#dc2626] text-[#f9fafb] hover:bg-[#b91c1c]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[11px] gap-1.5 tracking-[0.05em]',
  md: 'px-4 py-2 text-xs gap-2 tracking-[0.05em]',
  lg: 'px-6 py-3 text-sm gap-2.5 tracking-[0.05em]',
};

const disabledClasses =
  'disabled:bg-[#374151] disabled:text-[#6b7280] disabled:border-[#374151] disabled:hover:bg-[#374151]';

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