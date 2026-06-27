import React, { ReactNode } from 'react';
import { Button as HeadlessButton } from '@headlessui/react';
import { cn } from '@/shared/lib/utils';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className,
}) => {
  return (
    <HeadlessButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded bg-sky-600 px-4 py-2 text-sm text-white",
        "data-hover:bg-sky-500 data-active:bg-sky-700",
        "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
        "focus:outline-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-sky-500",
        "transition-colors duration-200",
        className
      )}
    >
      {children}
    </HeadlessButton>
  );
};
