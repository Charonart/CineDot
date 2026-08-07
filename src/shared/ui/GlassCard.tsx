'use client';

import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'auto';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function GlassCard({
  variant = 'auto',
  padding = 'md',
  children,
  className = '',
  ...props
}: GlassCardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  const variantClasses = {
    auto: 'bg-[var(--glass)] border border-[var(--border)] backdrop-blur-xl shadow-md',
    light: 'bg-white/80 border border-white/40 backdrop-blur-xl shadow-lg text-[var(--text)]',
    dark: 'bg-[#141514]/80 border border-white/10 backdrop-blur-xl shadow-xl text-white',
  }[variant];

  return (
    <div
      className={`rounded-[16px] transition-all duration-300 ${paddingClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
