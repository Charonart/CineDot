'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type UniverseType = 'ALL_UNIVERSE' | 'MARVEL_DC' | 'ANIME' | 'DISNEY';

interface StarShopUniverseTabsProps {
  activeUniverse: UniverseType;
  onSelectUniverse: (univ: UniverseType) => void;
}

export const StarShopUniverseTabs: React.FC<StarShopUniverseTabsProps> = ({
  activeUniverse,
  onSelectUniverse,
}) => {
  const universes: { id: UniverseType; label: string; icon: string }[] = [
    { id: 'ALL_UNIVERSE', label: 'Tất Cả Vũ Trụ', icon: '✨' },
    { id: 'MARVEL_DC', label: 'Marvel & DC Universe', icon: '🌌' },
    { id: 'ANIME', label: 'Fan Wibu Anime', icon: '🎏' },
    { id: 'DISNEY', label: 'Inner Child (Disney / Pixar)', icon: '🧸' },
  ];

  return (
    <div className="w-full flex items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 mb-8 overflow-x-auto scrollbar-none">
      {universes.map((univ) => {
        const isActive = activeUniverse === univ.id;
        return (
          <button
            key={univ.id}
            onClick={() => onSelectUniverse(univ.id)}
            className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-white text-[#7C6FE8] shadow-md border border-purple-100 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-base">{univ.icon}</span>
            <span>{univ.label}</span>
          </button>
        );
      })}
    </div>
  );
};
