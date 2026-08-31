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
      {/* Floating Time Badge */}
      <div className="absolute -top-6 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white font-mono font-bold text-[10px] shadow-2xs border border-purple-300/40 select-none z-40 whitespace-nowrap">
        <span>{guideTime}</span>
      </div>

      {/* Vertical Dashed Line across all rooms */}
      <div
        className="w-[1.5px] border-l-2 border-dashed border-[#7C6FE8]/80 shadow-2xs"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
