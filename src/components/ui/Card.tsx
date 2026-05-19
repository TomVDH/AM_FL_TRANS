import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
}

// DESIGN.md spec: Scene Gray surface, Mark Gray border, sharp 3px corners.
// Flat-at-Rest Rule: ambient-low at rest only; elevated variant lifts on hover.
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const baseClasses =
    "bg-[#1f2937] text-[#f9fafb] border border-[#4b5563] rounded-[3px] transition-shadow duration-200 ease-out";

  const variantClasses = {
    default: "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
    elevated:
      "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
    bordered: "shadow-none"
  };

  const classes = [baseClasses, variantClasses[variant], className].join(' ');

  return <div className={classes}>{children}</div>;
};

export default Card;
