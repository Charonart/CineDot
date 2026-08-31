/* Hallmark · component: Logo · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * Dynamic responsive CineDot brand logo with transparent backdrop
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LogoProps {
  height?: number | string;
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  height = 44,
  variant = 'auto',
  showText = true,
  className = '',
  href = '/',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const numericHeight = typeof height === 'number' ? height : parseInt(height, 10) || 44;

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 select-none transition-all group ${className}`}
      style={{ height: numericHeight }}
    >
      {/* 1. Transparent Cinema Logo Badge */}
      {!imgError ? (
        <div className="relative h-full aspect-square flex items-center justify-center shrink-0">
          <img
            src="/assets/images/cinedot-logo.png"
            alt="CineDot Cinema Logo"
            onError={() => setImgError(true)}
            className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          style={{ width: numericHeight * 0.9, height: numericHeight * 0.9 }}
          className="rounded-2xl bg-gradient-to-tr from-[#7C6FE8] via-indigo-600 to-[#685BC7] flex items-center justify-center text-white shadow-md shadow-[#7C6FE8]/25 shrink-0 group-hover:scale-105 transition-transform"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white"
          >
            <path d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18v15.64C2 21.03 2.97 22 4.18 22h15.64c1.21 0 2.18-.97 2.18-2.18V4.18C22 2.97 21.03 2 19.82 2Z" />
            <path d="M7 2v20" />
            <path d="M17 2v20" />
            <path d="M2 12h20" />
            <path d="M2 7h5" />
            <path d="M2 17h5" />
            <path d="M17 17h5" />
            <path d="M17 7h5" />
          </svg>
        </div>
      )}

      {/* 2. CineDot Typography */}
      {showText && (
        <div className="flex items-baseline tracking-tight font-black font-sans leading-none">
          <span
            style={{ fontSize: Math.max(16, Math.round(numericHeight * 0.48)) }}
            className={`font-black ${
              variant === 'light'
                ? 'text-white'
                : variant === 'dark'
                ? 'text-slate-900'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            Cine
          </span>
          <span
            style={{ fontSize: Math.max(16, Math.round(numericHeight * 0.48)) }}
            className="text-[#7C6FE8] font-black group-hover:text-[#685bc7] transition-colors"
          >
            Dot
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C6FE8] ml-0.5 animate-pulse" />
        </div>
      )}
    </div>
  );

  if (!href) {
    return <div onClick={onClick}>{content}</div>;
  }

  return (
    <Link href={href} onClick={onClick} className="focus:outline-none">
      {content}
    </Link>
  );
};
