'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useTrailerStore } from '@/shared/store/trailerStore';
import { MovieVideoItem } from '../types/movie-detail.types';

interface MovieDetailHeroProps {
  bannerUrl: string;
  posterUrl: string;
  title: string;
  trailerUrl: string;
  videos?: MovieVideoItem[];
}

export const MovieDetailHero: React.FC<MovieDetailHeroProps> = ({
  bannerUrl,
  posterUrl,
  title,
  trailerUrl,
  videos = [],
}) => {
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const handlePlayTrailer = () => {
    const formattedVideos = videos.map((v) => ({
      id: v.videoId,
      name: v.name,
      key: v.key,
      type: v.type,
      thumbnailUrl: v.thumbnailUrl,
    }));
    const images = [bannerUrl, posterUrl].filter(Boolean);
    openTrailer(trailerUrl, posterUrl, `${title} • Trailer & Hình ảnh`, formattedVideos, images);
  };

  return (
    <div className="relative w-full h-[42vh] sm:h-[50vh] lg:h-[55vh] max-h-[520px] bg-slate-950 overflow-hidden pt-20">
      {/* Landscape Backdrop Image */}
      <img
        src={bannerUrl}
        alt={title}
        className="w-full h-full object-cover object-center transform scale-105 opacity-85"
      />

      {/* Smooth Ambient Gradient Overlays fading down into #FAFAFB */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFB] via-black/40 to-black/70" />
      <div className="absolute inset-0 hero-overlay opacity-60" />

      {/* Centered Floating Play Trailer Action */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pb-8 sm:pb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayTrailer}
          className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/35 rounded-full text-white font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#7C6FE8] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
          </div>
          <span>Xem Trailer</span>
        </motion.button>
      </div>
    </div>
  );
};
