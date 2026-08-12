'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Star, Calendar, Clock, Globe, Ticket } from 'lucide-react';
import { MovieDetail } from '../types/movie-detail.types';
import { useTrailerStore } from '@/shared/store/trailerStore';
import { useAuthStore } from '@/shared/store/useAuthStore';

interface MovieMetadataHeaderProps {
  movie: MovieDetail;
  onBookClick?: () => void;
}

export const MovieMetadataHeader: React.FC<MovieMetadataHeaderProps> = ({
  movie,
  onBookClick,
}) => {
  const router = useRouter();
  const openTrailer = useTrailerStore((state) => state.openTrailer);
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const bookingUrl = `/booking/seats?movie=${movie.slug}&showtime_id=showtime-101`;

  const handlePlayTrailer = () => {
    openTrailer(movie.trailerUrl, movie.posterUrl, movie.title);
  };

  const handleBookNow = () => {
    if (isAuthenticated) {
      router.push(bookingUrl);
    } else {
      openAuthModal('login', 'Vui lòng đăng nhập để tiến hành chọn ghế đặt vé xem phim', bookingUrl);
    }
  };

  return (
    <div className="relative z-20 flex flex-col md:flex-row gap-8 items-start pb-10 border-b border-gray-200">
      {/* Left: Floating 2:3 Movie Poster Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-56 sm:w-64 aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] ring-4 ring-white shrink-0 bg-slate-900 mx-auto md:mx-0 -mt-28 sm:-mt-36"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Right: Movie Metadata Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-4 flex-1 text-[#131413] pt-2"
      >
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-[#7C6FE8] text-white text-xs font-bold uppercase tracking-wider shadow-xs">
            {movie.formatBadge}
          </span>
          <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
            Khán giả {movie.ageRating}
          </span>
          <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            {movie.country}
          </span>
        </div>

        {/* Movie Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#131413] tracking-tight leading-tight">
            {movie.title}
          </h1>
          {movie.originalTitle && (
            <span className="text-sm font-semibold text-slate-500 italic">
              {movie.originalTitle}
            </span>
          )}
        </div>

        {/* Rating Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-extrabold text-sm">{movie.rating} / 10</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            ({movie.voteCount.toLocaleString()} bình chọn)
          </span>
        </div>

        {/* Specs List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 font-medium py-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7C6FE8]" />
            <span>Thời lượng: <strong>{movie.duration}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#7C6FE8]" />
            <span>Khởi chiếu: <strong>{movie.releaseDate}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#7C6FE8]" />
            <span>Thể loại: <strong>{movie.genre.join(', ')}</strong></span>
          </div>
        </div>

        {/* Director & Cast */}
        <div className="flex flex-col gap-1 text-xs text-slate-600 border-t border-gray-100 pt-3">
          <p><strong>Đạo diễn:</strong> {movie.director}</p>
          <p><strong>Diễn viên chính:</strong> {movie.cast.join(', ')}</p>
        </div>

        {/* Action Buttons ("MUA VÉ NGAY" & "Xem Trailer") */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleBookNow}
            className="px-8 py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-sm tracking-wider uppercase shadow-lg shadow-[#7C6FE8]/35 transition-all transform hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <Ticket className="w-4 h-4 text-white fill-white" />
            <span>MUA VÉ NGAY</span>
          </button>

          <button
            onClick={handlePlayTrailer}
            className="px-6 py-3.5 rounded-full bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 hover:text-[#7C6FE8] font-bold text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 text-[#7C6FE8] fill-[#7C6FE8]" />
            <span>Xem Trailer</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
