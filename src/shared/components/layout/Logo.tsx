'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  height?: number | string;
  showTextFallback?: boolean;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  height = 44,
  href = '/',
}) => {
  const content = (
    <div className={`inline-flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}>
      <img
        src="/assets/images/cinedot-logo.png"
        alt="CineDot Logo"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        className="w-auto object-contain drop-shadow-sm select-none"
      />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
