import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'purple' | 'green' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const baseClasses = "inline-flex items-center font-bold border rounded-full transition-all duration-200";
  
  const variantClasses = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600",
    blue: "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700",
    purple: "bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 hover:bg-purple-200 dark:hover:bg-purple-700",
    green: "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-700",
    red: "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600 hover:bg-red-200 dark:hover:bg-red-700"
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm"
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(' ');
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge; 