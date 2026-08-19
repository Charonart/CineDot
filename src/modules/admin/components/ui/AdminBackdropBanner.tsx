'use client';

import React, { useState, useEffect } from 'react';
import { Film, Maximize2, X, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';

interface AdminBackdropBannerProps {
  src?: string | null;
  alt?: string;
  className?: string;
  aspectRatio?: '16/9' | '21/9' | 'custom';
  heightClass?: string; // e.g. "h-48", "h-64"
  showOverlay?: boolean;
  overlayContent?: React.ReactNode;
  allowZoom?: boolean;
  badgeText?: string;
  badgeColor?: string;
  fallbackTitle?: string;
}

export function AdminBackdropBanner({
  src,
  alt = 'Backdrop Banner',
  className = '',
  aspectRatio = '16/9',
  heightClass,
  showOverlay = true,
  overlayContent,
  allowZoom = true,
  badgeText,
  badgeColor = 'bg-[#7C6FE8]',
  fallbackTitle,
}: AdminBackdropBannerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const hasValidSrc = Boolean(src && src.trim() !== '');

  const aspectStyle =
    heightClass || (aspectRatio === '16/9' ? 'aspect-video' : aspectRatio === '21/9' ? 'aspect-[21/9]' : 'h-48');

  return (
    <>
      <div
        className={`relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-md group ${aspectStyle} ${className}`}
      >
        {/* Skeleton loading */}
        {isLoading && hasValidSrc && !hasError && (
          <div className="absolute inset-0 z-10">
            <Skeleton variant="rectangular" className="w-full h-full" />
          </div>
        )}

        {/* Fallback Banner if no src or error */}
        {(!hasValidSrc || hasError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-[#1E1B4B] to-slate-950 text-slate-400">
            {/* Subtle decorative background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#7C6FE8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 flex flex-col items-center gap-2 text-center max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#7C6FE8] shadow-inner">
                {hasError ? <AlertCircle className="w-5 h-5 text-rose-400" /> : <Film className="w-5 h-5" />}
              </div>
              <span className="text-xs font-bold text-slate-300">
                {hasError ? 'Không thể tải Backdrop' : fallbackTitle || 'Chưa có Backdrop Banner'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {hasError ? 'Đường dẫn ảnh không khả dụng hoặc bị lỗi 404' : 'Tỷ lệ khuyến nghị 16:9 (1280×720px)'}
              </span>
            </div>
          </div>
        )}

        {/* Actual Image */}
        {hasValidSrc && (
          <img
            src={src || ''}
            alt={alt}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
              hasError ? 'hidden' : 'block group-hover:scale-102'
            }`}
          />
        )}

        {/* Gradient Overlays */}
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
        )}

        {/* Top Badges & Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
          {badgeText ? (
            <span
              className={`px-2.5 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-xs ${badgeColor}`}
            >
              {badgeText}
            </span>
          ) : (
            <div />
          )}

          {allowZoom && hasValidSrc && !hasError && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(true);
              }}
              title="Phóng to xem ảnh gốc"
              className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Content Overlay */}
        {overlayContent && <div className="absolute bottom-0 inset-x-0 p-4 z-20">{overlayContent}</div>}
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomed && hasValidSrc && !hasError && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black"
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={src || ''} alt={alt} className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/70 bg-black/50 px-4 py-2 rounded-lg backdrop-blur-xs">
              <span className="font-bold truncate">{alt}</span>
              <span className="text-[11px] font-mono text-slate-400">Độ phân giải gốc</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
