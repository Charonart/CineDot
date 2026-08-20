'use client';

import React from 'react';

interface ShowtimesAlignmentGuideProps {
  guideX: number | null;
  guideTime: string | null;
  height: number;
}

export function ShowtimesAlignmentGuide({ guideX, guideTime, height }: ShowtimesAlignmentGuideProps) {
  if (guideX === null || !guideTime) return null;

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none z-30 transition-none"
      style={{ left: `${guideX}px` }}
    >
      {/* Floating Time Pill Badge at Top */}
      <div className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#7C6FE8] text-white font-mono font-black text-[10px] shadow-md shadow-[#7C6FE8]/40 border border-purple-300 select-none flex items-center gap-1 z-40 whitespace-nowrap animate-pulse">
        <span>⏱️</span>
        <span>{guideTime}</span>
      </div>

      {/* Vertical Dashed Line running down across all rooms */}
      <div
        className="w-[1.5px] border-l-2 border-dashed border-[#7C6FE8] shadow-sm"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
