'use client';

import React, { useState } from 'react';
import { getAgeRatingInfo, AgeRating } from '@/shared/utils/ageRatingHelper';
import { ShieldAlert, Info } from 'lucide-react';

export interface AgeRatingBadgeProps {
  ageRating?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'soft' | 'badge-with-label' | 'pill';
  showTooltip?: boolean;
  className?: string;
}

export const AgeRatingBadge: React.FC<AgeRatingBadgeProps> = ({
  ageRating,
  size = 'sm',
  variant = 'solid',
  showTooltip = false,
  className = '',
}) => {
  const info = getAgeRatingInfo(ageRating);
  const [isHovered, setIsHovered] = useState(false);

  // Size styles
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 font-black tracking-tight rounded',
    sm: 'text-[10px] px-2 py-0.5 font-black tracking-tight rounded-md',
    md: 'text-xs px-2.5 py-1 font-black rounded-lg',
    lg: 'text-sm px-3.5 py-1.5 font-black rounded-xl',
  };

  const renderBadgeContent = () => {
    switch (variant) {
      case 'soft':
        return (
          <span
            className={`inline-flex items-center gap-1 font-black border transition-all ${info.softBgClass} ${sizeClasses[size]} ${className}`}
          >
            {info.isRestricted && <ShieldAlert className="w-3 h-3 shrink-0" />}
            <span>{info.shortLabel}</span>
          </span>
        );

      case 'badge-with-label':
        return (
          <div className={`inline-flex items-center gap-1.5 ${className}`}>
            <span
              className={`inline-flex items-center justify-center font-black border uppercase tracking-wider text-white shadow-2xs ${info.badgeClass} ${sizeClasses[size]}`}
            >
              {info.code}
            </span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {info.label}
            </span>
          </div>
        );

      case 'pill':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-black border uppercase tracking-wider text-white shadow-xs ${info.badgeClass} ${sizeClasses[size]} ${className}`}
          >
            <span>{info.code}</span>
            <span className="text-[10px] font-semibold opacity-90">({info.subLabel})</span>
          </span>
        );

      case 'solid':
      default:
        return (
          <span
            className={`inline-flex items-center justify-center font-black uppercase tracking-wider text-white border shadow-2xs ${info.badgeClass} ${sizeClasses[size]} ${className}`}
          >
            {info.code}
          </span>
        );
    }
  };

  if (!showTooltip) {
    return renderBadgeContent();
  }

  return (
    <div
      className="relative inline-flex items-center group cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
    >
      {renderBadgeContent()}

      {/* Tooltip Popup */}
      {isHovered && (
        <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-950/95 text-white text-xs rounded-xl shadow-2xl border border-white/10 z-50 pointer-events-none backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 mb-1 text-amber-300 font-extrabold">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Quy Định Độ Tuổi: {info.code}</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            {info.description}
          </p>
          {info.isRestricted && (
            <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 shrink-0 text-amber-400" />
              <span>Vui lòng mang theo CCCD khi đến rạp</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
