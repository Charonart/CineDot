'use client';

import React from 'react';

export const CinemaScreen: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center gap-2 my-6">
      {/* Curved Screen Border Arc */}
      <div className="relative w-full max-w-2xl h-12 flex flex-col items-center justify-center">
        {/* Glow Aura */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#7C6FE8]/25 via-transparent to-transparent blur-xl rounded-t-[100px]" />

        {/* Curved Line LED */}
        <div className="w-full h-4 border-t-4 border-[#7C6FE8] rounded-[100%] shadow-[0_-8px_24px_rgba(124,111,232,0.6)]" />

        {/* Label */}
        <span className="text-xs font-bold text-slate-400 tracking-[0.25em] uppercase -mt-1">
          MÀN HÌNH CHIẾU
        </span>
      </div>
    </div>
  );
};
