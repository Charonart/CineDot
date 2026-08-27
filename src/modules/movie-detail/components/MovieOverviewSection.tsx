'use client';

import React from 'react';

interface MovieOverviewSectionProps {
  synopsis: string;
}

export const MovieOverviewSection: React.FC<MovieOverviewSectionProps> = ({ synopsis }) => {
  return (
    <div className="py-6 border-b border-gray-200/80 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-1.5 h-5 bg-[#7C6FE8] rounded-full" />
        <h3 className="text-base sm:text-lg font-extrabold text-gray-950 uppercase tracking-wide">
          Nội Dung Phim
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal text-justify">
        {synopsis}
      </p>
    </div>
  );
};
