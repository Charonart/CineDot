'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    // Size variants
    const sizeClasses = {
      sm: 'px-4 py-2 text-xs gap-1.5 h-8',
      md: 'px-6 py-3 text-sm gap-2 h-11',
      lg: 'px-8 py-4 text-base gap-2.5 h-14 font-semibold',
    }[size];

    // Design system variants
    const variantClasses = {
      primary: 'bg-[#7C6FE8] text-white hover:bg-[#685bc7] hover:shadow-[0_0_0_4px_rgba(124,111,232,0.3)] hover:-translate-y-0.5 active:translate-y-0',
      ghost: 'bg-transparent text-white border border-white/40 backdrop-blur-md hover:bg-white/15 hover:border-white/70',
      outline: 'bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--text)] hover:text-[var(--bg)]',
      danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_0_4px_rgba(239,68,68,0.3)]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
