/* Hallmark · component: CinemaScreen · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * Dynamic responsive Canvas Screen renderer supporting Curved IMAX, ScreenX 270° 3-sided, Onyx LED Wall, and Flat Digital
 */
'use client';

import React from 'react';
import { ScreenCanvasConfig, RoomScreenType } from '../types/seat-booking.types';
import { Sparkles, Tv, Eye, Layers } from 'lucide-react';

interface CinemaScreenProps {
  screenConfig?: ScreenCanvasConfig;
  screenType?: RoomScreenType;
  formatName?: string;
}

export const CinemaScreen: React.FC<CinemaScreenProps> = ({
  screenConfig,
  screenType,
  formatName,
}) => {
  const shape = screenConfig?.shape || (
    screenType === 'screenx'
      ? 'three_sided'
      : screenType === 'imax_laser' || screenType === 'dolby_cinema'
      ? 'curved'
      : screenType === 'onyx_led'
      ? 'led_wall'
      : 'flat'
  );

  const isScreenX = shape === 'three_sided' || screenType === 'screenx';
  const isImax = shape === 'curved' && screenType === 'imax_laser';
  const isDolby = shape === 'curved' && screenType === 'dolby_cinema';
  const isOnyxLed = shape === 'led_wall' || screenType === 'onyx_led';

  const defaultLabel = isScreenX
    ? 'MÀN HÌNH CHÍNH SCREENX 270°'
    : isImax
    ? 'MÀN HÌNH CONG IMAX LASER • 1.90:1'
    : isDolby
    ? 'MÀN HÌNH DOLBY VISION HDR • 2.39:1'
    : isOnyxLed
    ? 'MÀN HÌNH SAMSUNG ONYX 4K LED'
    : screenType === 'standard_3d'
    ? 'MÀN HÌNH CHIẾU 3D DIGITAL'
    : 'MÀN HÌNH CHIẾU • SCREEN';

  const displayLabel = screenConfig?.label || defaultLabel;

  return (
    <div className="w-full flex flex-col items-center gap-2 pt-2 pb-6 select-none relative">
      {/* 1. ScreenX 270° Multi-Wall Projection Layout */}
      {isScreenX ? (
        <div className="relative w-full max-w-2xl flex items-center justify-between gap-2 sm:gap-4 px-2">
          {/* Left Wall Screen */}
          <div className="relative flex-1 flex flex-col items-end">
            <div className="w-full h-8 bg-gradient-to-br from-[#7C6FE8]/25 via-[#7C6FE8]/10 to-transparent blur-xs rounded-tl-2xl transform -skew-y-6" />
            <div className="w-full h-2.5 border-t-3 border-l-2 border-[#7C6FE8] rounded-tl-xl shadow-[-3px_-3px_12px_rgba(124,111,232,0.5)] transform -skew-y-6" />
            <span className="text-[8px] sm:text-[9px] font-black text-[#7C6FE8] uppercase tracking-wider pt-1 text-right">
              {screenConfig?.left_wall_label || 'TƯỜNG TRÁI 270°'}
            </span>
          </div>

          {/* Center Main Screen */}
          <div className="relative flex-[2] flex flex-col items-center justify-center">
            <div className="w-full h-12 bg-gradient-to-b from-[#7C6FE8]/25 via-[#7C6FE8]/5 to-transparent blur-md rounded-t-[100px] pointer-events-none" />
            <div className="w-full h-3 border-t-4 border-[#7C6FE8] rounded-[100%] shadow-[0_-4px_16px_rgba(124,111,232,0.5)]" />
            <div className="flex items-center gap-2 -mt-1 pt-1.5">
              <span className="text-[10px] font-extrabold text-slate-800 tracking-[0.2em] uppercase">
                {displayLabel}
              </span>
            </div>
          </div>

          {/* Right Wall Screen */}
          <div className="relative flex-1 flex flex-col items-start">
            <div className="w-full h-8 bg-gradient-to-bl from-[#7C6FE8]/25 via-[#7C6FE8]/10 to-transparent blur-xs rounded-tr-2xl transform skew-y-6" />
            <div className="w-full h-2.5 border-t-3 border-r-2 border-[#7C6FE8] rounded-tr-xl shadow-[3px_-3px_12px_rgba(124,111,232,0.5)] transform skew-y-6" />
            <span className="text-[8px] sm:text-[9px] font-black text-[#7C6FE8] uppercase tracking-wider pt-1 text-left">
              {screenConfig?.right_wall_label || 'TƯỜNG PHẢI 270°'}
            </span>
          </div>
        </div>
      ) : isOnyxLed ? (
        /* 2. Samsung Onyx Cinema LED Wall (Flat self-lit matrix wall) */
        <div className="relative w-full max-w-xl flex flex-col items-center justify-center">
          {/* LED Glow Backdrop */}
          <div className="w-full h-10 bg-gradient-to-b from-cyan-400/20 via-blue-500/10 to-transparent blur-md rounded-t-lg pointer-events-none" />

          {/* Onyx LED Bar */}
          <div className="w-full h-3.5 bg-slate-900 border-2 border-cyan-400 rounded-md shadow-[0_-2px_18px_rgba(34,211,238,0.5)] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
          </div>

          {/* Screen Label */}
          <div className="flex items-center gap-2.5 -mt-1 pt-1.5">
            <div className="w-6 h-[1px] bg-gradient-to-r from-transparent to-cyan-400" />
            <span className="text-[10px] font-black text-cyan-700 tracking-[0.25em] uppercase flex items-center gap-1">
              <Tv className="w-3 h-3 text-cyan-600" />
              <span>{displayLabel}</span>
            </span>
            <div className="w-6 h-[1px] bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
        </div>
      ) : isImax ? (
        /* 3. IMAX Laser Deep Curved Screen */
        <div className="relative w-full max-w-2xl flex flex-col items-center justify-center">
          {/* Dual Laser Ambient Glow */}
          <div className="w-full h-14 bg-gradient-to-b from-[#7C6FE8]/30 via-indigo-500/15 to-transparent blur-lg rounded-t-[120px] pointer-events-none" />

          {/* Deep Curved Arch Line */}
          <div className="w-full h-4 border-t-4 border-[#7C6FE8] rounded-[100%] shadow-[0_-6px_22px_rgba(124,111,232,0.6)]" />

          {/* Screen Label */}
          <div className="flex items-center gap-3 -mt-1 pt-1.5">
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#7C6FE8]" />
            <span className="text-[10px] font-black text-indigo-900 tracking-[0.25em] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>{displayLabel}</span>
            </span>
            <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#7C6FE8]" />
          </div>
        </div>
      ) : isDolby ? (
        /* 4. Dolby Cinema HDR Curved Screen */
        <div className="relative w-full max-w-xl flex flex-col items-center justify-center">
          <div className="w-full h-12 bg-gradient-to-b from-amber-400/20 via-purple-600/15 to-transparent blur-md rounded-t-[100px] pointer-events-none" />
          <div className="w-full h-3.5 border-t-4 border-amber-400 rounded-[100%] shadow-[0_-4px_18px_rgba(251,191,36,0.5)]" />
          <div className="flex items-center gap-3 -mt-1 pt-1.5">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-[10px] font-black text-amber-900 tracking-[0.25em] uppercase flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-amber-600" />
              <span>{displayLabel}</span>
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        </div>
      ) : (
        /* 5. Standard Digital Flat/Curved Screen */
        <div className="relative w-full max-w-xl flex flex-col items-center justify-center">
          <div className="w-full h-12 bg-gradient-to-b from-[#7C6FE8]/15 via-[#7C6FE8]/5 to-transparent blur-md rounded-t-[100px] pointer-events-none" />
          <div className="w-full h-3 border-t-4 border-[#7C6FE8] rounded-[100%] shadow-[0_-4px_16px_rgba(124,111,232,0.45)]" />
          <div className="flex items-center gap-3 -mt-1 pt-1.5">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-300" />
            <span className="text-[10px] font-extrabold text-gray-500 tracking-[0.28em] uppercase">
              {displayLabel}
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gray-300" />
          </div>
        </div>
      )}
    </div>
  );
};
