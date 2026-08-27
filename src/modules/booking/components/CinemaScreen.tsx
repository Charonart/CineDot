/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: CinemaScreen */
'use client';

import React from 'react';

export const CinemaScreen: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center gap-2 pt-2 pb-6 select-none relative">
      {/* Top Ambient Projection Glow */}
      <div className="relative w-full max-w-xl flex flex-col items-center justify-center">
        {/* Soft Iris Ambient Light Cone */}
        <div className="w-full h-12 bg-gradient-to-b from-[#7C6FE8]/15 via-[#7C6FE8]/5 to-transparent blur-md rounded-t-[100px] pointer-events-none" />

        {/* Curved LED Arch Line */}
        <div className="w-full h-3 border-t-4 border-[#7C6FE8] rounded-[100%] shadow-[0_-4px_16px_rgba(124,111,232,0.45)]" />

        {/* Screen Label & Indicators */}
        <div className="flex items-center gap-3 -mt-1 pt-1.5">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-300" />
          <span className="text-[10px] font-extrabold text-gray-500 tracking-[0.28em] uppercase">
            MÀN HÌNH CHIẾU • SCREEN
          </span>
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gray-300" />
        </div>
      </div>
    </div>
  );
};

