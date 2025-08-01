import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`font-black tracking-tight text-2xl md:text-3xl text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h1>
);

export const Subheading: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2 className={`font-bold tracking-tight text-xl md:text-2xl text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h2>
);

export const Title: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={`font-bold tracking-tight text-lg md:text-xl text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h3>
);

export const Body: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-gray-900 dark:text-gray-100 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const Caption: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

export const Label: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <label className={`text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide ${className}`}>
    {children}
  </label>
);

export const Monospace: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <code className={`font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded ${className}`}>
    {children}
  </code>
); 