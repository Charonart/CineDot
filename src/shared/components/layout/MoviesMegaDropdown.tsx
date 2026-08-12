'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Ticket, Info, Star, Sparkles, Clock } from 'lucide-react';

interface MiniMovieItem {
  id: string;
  slug: string;
  title: string;
  posterUrl: string;
  formatBadge: string;
  ageRating: string;
  rating: number;
  genre: string;
}

const NOW_SHOWING_MINI_MOVIES: MiniMovieItem[] = [
  {
    id: 'm-1',
    slug: 'spiderman-new-beginning',
    title: 'Người Nhện: Khởi Đầu Mới',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&auto=format&fit=crop&q=80',
    formatBadge: 'IMAX 2D',
    ageRating: 'T13',
    rating: 9.2,
    genre: 'Hành động • Phiêu lưu',
  },
  {
    id: 'm-2',
    slug: 'conan-movie-27',
    title: 'Thám Tử Conan: Ngôi Sao 5 Cánh',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    formatBadge: '2D Phụ Đề',
    ageRating: 'P',
    rating: 8.9,
    genre: 'Hoạt hình • Trinh thám',
  },
  {
    id: 'm-3',
    slug: 'mai',
    title: 'Phim Điện Ảnh Mai',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&auto=format&fit=crop&q=80',
    formatBadge: '2D Lồng Tiếng',
    ageRating: 'T18',
    rating: 8.7,
    genre: 'Tâm lý • Tình cảm',
  },
  {
    id: 'm-4',
    slug: 'inside-out-2',
    title: 'Những Mảnh Mảnh Cảm Xúc 2',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    formatBadge: '3D Lồng Tiếng',
    ageRating: 'P',
    rating: 9.0,
    genre: 'Hoạt hình • Gia đình',
  },
];

const COMING_SOON_MINI_MOVIES: MiniMovieItem[] = [
  {
    id: 'cs-1',
    slug: 'joker-folie-a-deux',
    title: 'Joker: Folie à Deux',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    formatBadge: 'IMAX 2D',
    ageRating: 'T18',
    rating: 0,
    genre: 'Tâm lý • Âm nhạc',
  },
  {
    id: 'cs-2',
    slug: 'venom-the-last-dance',
    title: 'Venom: Kèo Cuối',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
    formatBadge: '3D Phụ Đề',
    ageRating: 'T16',
    rating: 0,
    genre: 'Hành động • Viễn tưởng',
  },
  {
    id: 'cs-3',
    slug: 'gladiator-2',
    title: 'Võ Sĩ Giác Đấu 2',
    posterUrl: 'https://images.unsplash.com/photo-1543536448-d247542f907d?w=400&auto=format&fit=crop&q=80',
    formatBadge: 'IMAX Laser',
    ageRating: 'T18',
    rating: 0,
    genre: 'Hành động • Lịch sử',
  },
  {
    id: 'cs-4',
    slug: 'wicked-part-one',
    title: 'Wicked: Phần Một',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    formatBadge: '2D Phụ Đề',
    ageRating: 'P',
    rating: 0,
    genre: 'Phép thuật • Âm nhạc',
  },
];

interface MoviesMegaDropdownProps {
  onClose?: () => void;
}

export const MoviesMegaDropdown: React.FC<MoviesMegaDropdownProps> = ({ onClose }) => {
  const router = useRouter();

  const handleBookNow = (e: React.MouseEvent, movieSlug: string) => {
    e.stopPropagation();
    if (onClose) onClose();
    router.push(`/movies/${movieSlug}#showtime-schedule`);
  };

  const handleMovieClick = (movieSlug: string) => {
    if (onClose) onClose();
    router.push(`/movies/${movieSlug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[850px] max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-none bg-white/98 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-200/80 z-[110] text-slate-800 selection:bg-[#7C6FE8] selection:text-white"
    >
      <div className="flex flex-col gap-4">
        {/* SECTION 1: PHIM ĐANG CHIẾU */}
        <div className="flex flex-col gap-2.5">
          <Link
            href="/movies?tab=now-showing"
            onClick={onClose}
            className="group flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
          >
            <span className="w-2 h-4 bg-[#7C6FE8] rounded-full" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#131413] flex items-center gap-1.5 group-hover:text-[#7C6FE8] transition-colors">
              <span>PHIM ĐANG CHIẾU</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </h3>
          </Link>

          {/* 4 Cards Grid for Now Showing (Vertical Poster Aspect Ratio aspect-[2/3]) */}
          <div className="grid grid-cols-4 gap-3.5">
            {NOW_SHOWING_MINI_MOVIES.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.slug)}
                className="group/card flex flex-col gap-1.5 cursor-pointer"
              >
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-xs group-hover/card:shadow-md transition-all">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[9px] font-extrabold">
                      {movie.formatBadge}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold">
                      {movie.ageRating}
                    </span>
                  </div>

                  {movie.rating > 0 && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-extrabold z-10">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{movie.rating}</span>
                    </div>
                  )}

                  {/* Hover Overlay Button ON TOP of Poster */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3 z-20">
                    <button
                      onClick={(e) => handleBookNow(e, movie.slug)}
                      className="w-full py-2 px-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-[#7C6FE8]/40 transition-all cursor-pointer transform hover:scale-105"
                    >
                      <Ticket className="w-3.5 h-3.5 fill-white shrink-0" />
                      <span className="truncate">MUA VÉ</span>
                    </button>
                  </div>
                </div>

                <h4 className="font-extrabold text-xs text-slate-800 group-hover/card:text-[#7C6FE8] transition-colors line-clamp-1 px-0.5">
                  {movie.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200/80 my-0.5" />

        {/* SECTION 2: PHIM SẮP CHIẾU */}
        <div className="flex flex-col gap-2.5">
          <Link
            href="/movies?tab=coming-soon"
            onClick={onClose}
            className="group flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
          >
            <span className="w-2 h-4 bg-amber-500 rounded-full" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#131413] flex items-center gap-1.5 group-hover:text-amber-600 transition-colors">
              <span>PHIM SẮP CHIẾU</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </h3>
          </Link>

          {/* 4 Cards Grid for Coming Soon (Vertical Poster Aspect Ratio aspect-[2/3]) */}
          <div className="grid grid-cols-4 gap-3.5">
            {COMING_SOON_MINI_MOVIES.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.slug)}
                className="group/card flex flex-col gap-1.5 cursor-pointer"
              >
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-xs group-hover/card:shadow-md transition-all">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[9px] font-extrabold">
                      {movie.formatBadge}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold">
                      {movie.ageRating}
                    </span>
                  </div>

                  {/* Hover Overlay Button ON TOP of Poster */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3 z-20">
                    <button
                      onClick={() => handleMovieClick(movie.slug)}
                      className="w-full py-2 px-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer transform hover:scale-105"
                    >
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">CHI TIẾT</span>
                    </button>
                  </div>
                </div>

                <h4 className="font-extrabold text-xs text-slate-800 group-hover/card:text-[#7C6FE8] transition-colors line-clamp-1 px-0.5">
                  {movie.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
