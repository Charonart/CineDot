'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket, Play, Sparkles } from 'lucide-react';
import { useTrailerStore } from '@/shared/store/trailerStore';

export const HeroSlider: React.FC = () => {
  const router = useRouter();
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const featuredMovie = {
    title: 'Người Nhện: Khởi Đầu Mới',
    slug: 'spiderman-new-beginning',
    description:
      'Hành trình tái xuất hoành tráng của Peter Parker trong một chương hoàn toàn mới. Thử thách cam go, đồng minh mới và trận chiến quyết định số phận thành phố New York.',
    rating: '9.2 / 10',
    tags: ['IMAX 3D', 'Hành Động', 'T13'],
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop',
  };

  const handleBookNow = () => {
    router.push(`/movies/${featuredMovie.slug}`);
  };

  return (
    <section className="relative w-full h-[520px] sm:h-[600px] bg-slate-950 overflow-hidden flex items-end pb-16 sm:pb-24">
      {/* Background Image */}
      <img
        src={featuredMovie.backdropUrl}
        alt={featuredMovie.title}
        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
      />

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FEFEFE] via-slate-950/70 to-slate-950/40" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-8 w-full">
        <div className="max-w-2xl flex flex-col gap-4 text-white">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#7C6FE8] text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SIÊU BOM TẤN TUẦN NÀY</span>
            </span>
            {featuredMovie.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md text-white">
            {featuredMovie.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed line-clamp-2 sm:line-clamp-3">
            {featuredMovie.description}
          </p>

          <div className="flex items-center gap-4 pt-3">
            <button
              onClick={handleBookNow}
              className="px-8 py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#7C6FE8]/40 transition-all cursor-pointer transform hover:scale-105"
            >
              <Ticket className="w-4 h-4 fill-white" />
              <span>MUA VÉ</span>
            </button>

            <button
              onClick={() => openTrailer(featuredMovie.trailerUrl, featuredMovie.posterUrl, featuredMovie.title)}
              className="px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-white/30"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Xem Trailer</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
