'use client';

import React, { useState, useEffect } from 'react';
import { Film, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { AgeRatingBadge } from '@/shared/components/ui/AgeRatingBadge';

interface AdminPosterCardProps {
  src?: string | null;
  alt?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'responsive' | 'custom';
  aspectRatio?: '2/3' | 'custom';
  rounded?: 'lg' | 'xl' | '2xl' | '3xl';
  ageRating?: string;
  rating?: number | string;
  fallbackText?: string;
}

const SIZE_CLASSES = {
  xs: 'w-8 h-11',
  sm: 'w-12 h-16',
  md: 'w-16 h-24',
  lg: 'w-40 h-56',
  responsive: 'w-full aspect-[2/3]',
  custom: '',
};

const ROUNDED_CLASSES = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

export function AdminPosterCard({
  src,
  alt = 'Movie Poster',
  className = '',
  size = 'sm',
  aspectRatio = '2/3',
  rounded = 'xl',
  ageRating,
  rating,
  fallbackText,
}: AdminPosterCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const hasValidSrc = Boolean(src && src.trim() !== '');
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.sm;
  const roundedClass = ROUNDED_CLASSES[rounded] || ROUNDED_CLASSES.xl;

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-slate-900 border border-slate-700/60 shadow-xs select-none ${sizeClass} ${roundedClass} ${className}`}
      style={aspectRatio === '2/3' && size === 'custom' ? { aspectRatio: '2/3' } : undefined}
    >
      {/* Loading Skeleton */}
      {isLoading && hasValidSrc && !hasError && (
        <div className="absolute inset-0 z-10">
          <Skeleton variant="rectangular" className="w-full h-full" />
        </div>
      )}

      {/* Fallback Display */}
      {(!hasValidSrc || hasError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-slate-900 via-[#1E1B4B] to-slate-950 text-slate-400 text-center">
          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#7C6FE8] mb-1">
            {hasError ? <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> : <Film className="w-3.5 h-3.5" />}
          </div>
          {fallbackText ? (
            <span className="text-[9px] font-bold text-slate-300 line-clamp-2 px-1 leading-tight">
              {fallbackText}
            </span>
          ) : (
            <span className="text-[9px] font-mono text-slate-500">CineDot</span>
          )}
        </div>
      )}

      {/* Image Element */}
      {hasValidSrc && (
        <img
          src={src || ''}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            hasError ? 'hidden' : 'block'
          }`}
        />
      )}

      {/* Age Rating Badge Overlay */}
      {ageRating && (
        <div className="absolute top-1 right-1 z-20 pointer-events-none">
          <AgeRatingBadge ageRating={ageRating} size="xs" variant="solid" />
        </div>
      )}

      {/* Rating Badge Overlay */}
      {rating !== undefined && rating !== null && (
        <div className="absolute bottom-1 left-1 z-20">
          <span className="px-1.5 py-0.5 rounded bg-black/70 text-amber-400 text-[8px] font-mono font-bold border border-amber-400/20 backdrop-blur-xs">
            ★ {rating}
          </span>
        </div>
      )}
    </div>
  );
}
