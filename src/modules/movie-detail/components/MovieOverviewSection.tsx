'use client';

import React from 'react';

interface MovieOverviewSectionProps {
  synopsis: string;
}

export const MovieOverviewSection: React.FC<MovieOverviewSectionProps> = ({ synopsis }) => {
  return (
    <div className="py-8 border-b border-gray-200 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-[#7C6FE8] rounded-full shadow-[0_0_10px_rgba(124,111,232,0.6)]" />
        <h3 className="text-lg font-bold text-[#131413] uppercase tracking-wider">
          Nội Dung Phim
        </h3>
      </div>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify font-normal">
        {synopsis}
      </p>
    </div>
  );
};
