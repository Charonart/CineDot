'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useTrailerStore } from '@/shared/store/trailerStore';

interface MovieDetailHeroProps {
  bannerUrl: string;
  posterUrl: string;
  title: string;
  trailerUrl: string;
}

export const MovieDetailHero: React.FC<MovieDetailHeroProps> = ({
  bannerUrl,
  posterUrl,
  title,
  trailerUrl,
}) => {
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const handlePlayTrailer = () => {
    openTrailer(trailerUrl, posterUrl, title);
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] max-h-[560px] bg-slate-900 overflow-hidden pt-20">
      {/* Landscape Backdrop Image */}
      <img
        src={bannerUrl}
        alt={title}
        className="w-full h-full object-cover object-center transform scale-105"
      />

      {/* Smooth Dark Gradient Overlays (No hard borders) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/40 to-black/60" />

      {/* Centered Floating Play Trailer Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={handlePlayTrailer}
          className="group px-7 py-3.5 bg-white/20 hover:bg-white/35 backdrop-blur-2xl border border-white/40 rounded-full text-white font-bold text-sm sm:text-base flex items-center gap-3 shadow-[0_12px_40px_rgba(124,111,232,0.4)] transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#7C6FE8] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
          </div>
          <span>Xem Trailer</span>
        </motion.button>
      </div>
    </div>
  );
};
