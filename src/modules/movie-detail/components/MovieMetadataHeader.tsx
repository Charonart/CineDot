'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Star,
  Calendar,
  Clock,
  Globe,
  Ticket,
  Users,
  X,
  User,
} from 'lucide-react';
import { MovieDetail } from '../types/movie-detail.types';
import { useTrailerStore } from '@/shared/store/trailerStore';

interface MovieMetadataHeaderProps {
  movie: MovieDetail;
  onBookClick?: () => void;
}

export const MovieMetadataHeader: React.FC<MovieMetadataHeaderProps> = ({
  movie,
  onBookClick,
}) => {
  const openTrailer = useTrailerStore((state) => state.openTrailer);
  const [isCastModalOpen, setIsCastModalOpen] = useState(false);

  const handlePlayTrailer = () => {
    const formattedVideos = (movie.videos || []).map((v) => ({
      id: v.videoId,
      name: v.name,
      key: v.key,
      type: v.type,
      thumbnailUrl: v.thumbnailUrl,
    }));
    const images = [movie.backdropUrl || movie.bannerUrl, movie.posterUrl].filter(Boolean);
    openTrailer(movie.trailerUrl, movie.posterUrl, `${movie.title} • Trailer & Hình ảnh`, formattedVideos, images);
  };

  const handleBookNow = () => {
    if (onBookClick) {
      onBookClick();
    }
  };

  const castList = movie.castMembers && movie.castMembers.length > 0 ? movie.castMembers : [];
  const topCast = castList.slice(0, 4);
  const remainingCount = castList.length > 4 ? castList.length - 4 : 0;

  return (
    <>
      <div className="relative z-20 flex flex-col md:flex-row gap-6 sm:gap-8 items-start pb-8 border-b border-gray-200/80">
        {/* Left: Floating 2:3 Movie Poster Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-52 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl ring-4 ring-white shrink-0 bg-slate-900 mx-auto md:mx-0 -mt-24 sm:-mt-32 relative z-20"
        >
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />

          {/* Top Format Tag */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-extrabold uppercase shadow-sm">
              {movie.formatBadge || 'IMAX 2D'}
            </span>
          </div>
        </motion.div>

        {/* Right: Movie Metadata Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="flex flex-col gap-3.5 flex-1 text-gray-900 pt-1 w-full"
        >
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
              {movie.formatBadge || 'IMAX 2D'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              Khán giả {movie.ageRating}
            </span>
            {movie.country && (
              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                {movie.country}
              </span>
            )}
          </div>

          {/* Movie Title */}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
              {movie.title}
            </h1>
            {movie.originalTitle && (
              <span className="text-xs sm:text-sm font-medium text-gray-500 italic">
                {movie.originalTitle}
              </span>
            )}
          </div>

          {/* Rating Score */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs sm:text-sm">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{movie.rating} / 10</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              ({movie.voteCount.toLocaleString()} lượt đánh giá)
            </span>
          </div>

          {/* Specs List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-gray-600 font-medium py-1">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>Thời lượng: <strong className="text-gray-900">{movie.duration}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>Khởi chiếu: <strong className="text-gray-900">{movie.releaseDate}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>Thể loại: <strong className="text-gray-900">{movie.genre.join(', ')}</strong></span>
            </div>
          </div>

          {/* Director & Cast */}
          <div className="flex flex-col gap-1 text-xs text-gray-600 border-t border-gray-100 pt-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="text-gray-900 font-bold">Đạo diễn:</strong>
              {movie.directorId ? (
                <Link
                  href={`/persons/${movie.directorId}`}
                  className="text-[#7C6FE8] hover:underline font-semibold"
                >
                  {movie.director}
                </Link>
              ) : (
                <span>{movie.director || 'Đang cập nhật'}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="text-gray-900 font-bold">Diễn viên chính:</strong>
              {topCast.length > 0 ? (
                topCast.map((actor, idx) => (
                  <React.Fragment key={actor.id || idx}>
                    {idx > 0 && <span className="text-gray-300">•</span>}
                    {actor.personId ? (
                      <Link
                        href={`/persons/${actor.personId}`}
                        className="text-gray-700 hover:text-[#7C6FE8] font-medium transition-colors hover:underline"
                      >
                        {actor.name}
                      </Link>
                    ) : (
                      <span>{actor.name}</span>
                    )}
                  </React.Fragment>
                ))
              ) : movie.cast.length > 0 ? (
                <span>{movie.cast.slice(0, 4).join(', ')}</span>
              ) : (
                <span>Đang cập nhật</span>
              )}

              {/* Nút Xem Thêm Diễn Viên */}
              {(remainingCount > 0 || (movie.crewMembers && movie.crewMembers.length > 0)) && (
                <button
                  type="button"
                  onClick={() => setIsCastModalOpen(true)}
                  className="ml-1 text-[11px] font-bold text-[#7C6FE8] bg-purple-50 hover:bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-100 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>+ Xem thêm {remainingCount > 0 ? `(${remainingCount})` : ''}</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons ("MUA VÉ NGAY" & "Xem Trailer") */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleBookNow}
              className="px-8 py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-[#7C6FE8]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-white fill-white" />
              <span>MUA VÉ NGAY</span>
            </button>

            <button
              type="button"
              onClick={handlePlayTrailer}
              className="px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-[#7C6FE8] text-gray-700 hover:text-[#7C6FE8] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer group"
            >
              <Play className="w-3.5 h-3.5 text-[#7C6FE8] fill-[#7C6FE8] group-hover:scale-110 transition-transform" />
              <span>Xem Trailer</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Cast & Crew Modal */}
      <AnimatePresence>
        {isCastModalOpen && (
          <div
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsCastModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-200 flex flex-col gap-5 my-auto max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C6FE8]">
                      {movie.title}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900">
                      Dàn Diễn Viên & Đoàn Làm Phim
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCastModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 flex flex-col gap-6">
                {/* Diễn viên */}
                {castList.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      Diễn Viên ({castList.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {castList.map((c) => (
                        <div
                          key={c.id || c.name}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                            {c.profileUrl ? (
                              <img src={c.profileUrl} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            {c.personId ? (
                              <Link
                                href={`/persons/${c.personId}`}
                                className="font-bold text-xs text-gray-900 hover:text-[#7C6FE8] truncate"
                              >
                                {c.name}
                              </Link>
                            ) : (
                              <span className="font-bold text-xs text-gray-900 truncate">{c.name}</span>
                            )}
                            <span className="text-[11px] text-gray-500 truncate">{c.character || 'Diễn viên'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
