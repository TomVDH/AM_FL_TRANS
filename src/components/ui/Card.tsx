import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const baseClasses = "bg-white dark:bg-gray-800 border border-black dark:border-gray-600 transition-all duration-200";
  
  const variantClasses = {
    default: "shadow-sm",
    elevated: "shadow-md hover:shadow-lg",
    bordered: "shadow-none"
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].join(' ');
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card; 