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
  type?: 'icon' | 'full';
  className?: string;
  href?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  height = 44,
  variant = 'auto',
  showText = true,
  type = 'icon',
  className = '',
  href = '/',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const numericHeight = typeof height === 'number' ? height : parseInt(height, 10) || 44;

  const iconSrc = '/assets/images/cinedot-icon.png';
  const fullLogoSrc =
    variant === 'light'
      ? '/assets/images/cinedot-logo-white.png'
      : '/assets/images/cinedot-logo.png';

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 select-none transition-all group ${className}`}
      style={{ height: numericHeight }}
    >
      {type === 'full' ? (
        !imgError ? (
          <img
            src={fullLogoSrc}
            alt="CineDot Cinema"
            onError={() => setImgError(true)}
            className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center gap-2">
            <div
              style={{ width: numericHeight * 0.85, height: numericHeight * 0.85 }}
              className="rounded-xl bg-gradient-to-tr from-[#7C6FE8] via-indigo-600 to-[#685BC7] flex items-center justify-center text-white shadow-md shadow-[#7C6FE8]/25 shrink-0 group-hover:scale-105 transition-transform font-bold"
            >
              C
            </div>
            <span className="font-black text-lg tracking-tight">CineDot</span>
          </div>
        )
      ) : (
        <>
          {/* 1. Transparent Cinema Logo Badge */}
          {!imgError ? (
            <div className="relative h-full aspect-square flex items-center justify-center shrink-0">
              <img
                src={iconSrc}
                alt="CineDot Cinema Logo"
                onError={() => setImgError(true)}
                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
              />
            </div>
          ) : (
            <div
              style={{ width: numericHeight * 0.85, height: numericHeight * 0.85 }}
              className="rounded-xl bg-gradient-to-tr from-[#7C6FE8] via-indigo-600 to-[#685BC7] flex items-center justify-center text-white shadow-md shadow-[#7C6FE8]/25 shrink-0 group-hover:scale-105 transition-transform font-black text-sm"
            >
              C
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
        </>
      )}
    </div>
  );

  if (!href) {
    return <div onClick={onClick} className="cursor-pointer">{content}</div>;
  }

  return (
    <Link href={href} onClick={onClick} className="focus:outline-none inline-flex items-center">
      {content}
    </Link>
  );
};

