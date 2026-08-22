'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ChevronRight,
  User,
  Sparkles,
} from 'lucide-react';
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
  const [isCastModalOpen, setIsCastModalOpen] = useState(false);

  const handlePlayTrailer = () => {
    const formattedVideos = (movie.videos || []).map((v) => ({
      id: v.videoId,
      name: v.name,
      key: v.key,
      type: v.type,
      site: v.site,
      thumbnailUrl: v.thumbnailUrl,
    }));
    openTrailer(movie.trailerUrl, movie.posterUrl, `${movie.title} • Trailer`, formattedVideos);
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

          {/* Director & Cast (Compact Inline Layout with "Xem Thêm" Button) */}
          <div className="flex flex-col gap-1.5 text-xs text-slate-600 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="text-slate-800 font-bold">Đạo diễn:</strong>
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
              <strong className="text-slate-800 font-bold">Diễn viên chính:</strong>
              {topCast.length > 0 ? (
                topCast.map((actor, idx) => (
                  <React.Fragment key={actor.id || idx}>
                    {idx > 0 && <span className="text-slate-300">•</span>}
                    {actor.personId ? (
                      <Link
                        href={`/persons/${actor.personId}`}
                        className="text-slate-700 hover:text-[#7C6FE8] font-medium transition-colors hover:underline"
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
              className="px-6 py-3.5 rounded-full bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 hover:text-[#7C6FE8] font-bold text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer group"
            >
              <Play className="w-4 h-4 text-[#7C6FE8] fill-[#7C6FE8] group-hover:scale-110 transition-transform" />
              <span>Xem Trailer</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Compact Cast & Crew Modal (Appears when clicking "Xem Thêm" on Diễn viên chính) */}
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
              className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-purple-100 flex flex-col gap-5 my-auto max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7C6FE8]">
                      {movie.title}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Dàn Diễn Viên & Đoàn Làm Phim
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCastModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto pr-1 flex flex-col gap-5 scrollbar-thin">
                {/* Director */}
                {movie.director && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      ĐẠO DIỄN
                    </span>
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-[#7C6FE8]/15 text-[#7C6FE8] flex items-center justify-center font-bold text-sm">
                        🎬
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        {movie.directorId ? (
                          <Link
                            href={`/persons/${movie.directorId}`}
                            onClick={() => setIsCastModalOpen(false)}
                            className="text-xs font-bold text-slate-900 hover:text-[#7C6FE8] transition-colors truncate"
                          >
                            {movie.director}
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {movie.director}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider">
                          ĐẠO DIỄN CHÍNH
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cast Members List */}
                {castList.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      DIỄN VIÊN ({castList.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {castList.map((actor, idx) => {
                        const href = actor.personId ? `/persons/${actor.personId}` : null;
                        const Card = (
                          <div className="group flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50/40 border border-slate-100 hover:border-purple-200 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-200 ring-2 ring-purple-100 group-hover:ring-[#7C6FE8] transition-all">
                              {actor.profileUrl ? (
                                <img
                                  src={actor.profileUrl}
                                  alt={actor.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <User className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-800 group-hover:text-[#7C6FE8] transition-colors truncate">
                                {actor.name}
                              </span>
                              {actor.character && (
                                <span className="text-[10px] text-slate-500 font-medium truncate" title={actor.character}>
                                  vai <strong className="text-slate-700 font-semibold">{actor.character}</strong>
                                </span>
                              )}
                            </div>

                            {href && (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#7C6FE8] shrink-0" />
                            )}
                          </div>
                        );

                        return href ? (
                          <Link
                            key={actor.id || idx}
                            href={href}
                            onClick={() => setIsCastModalOpen(false)}
                            className="block"
                          >
                            {Card}
                          </Link>
                        ) : (
                          <div key={actor.id || idx}>{Card}</div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Crew Members List */}
                {movie.crewMembers && movie.crewMembers.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      ĐOÀN LÀM PHIM ({movie.crewMembers.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {movie.crewMembers.map((crew, idx) => {
                        const href = crew.personId ? `/persons/${crew.personId}` : null;
                        const Card = (
                          <div className="group flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50/40 border border-slate-100 hover:border-purple-200 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-200 ring-2 ring-purple-100 group-hover:ring-[#7C6FE8] transition-all">
                              {crew.profileUrl ? (
                                <img
                                  src={crew.profileUrl}
                                  alt={crew.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <User className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-800 group-hover:text-[#7C6FE8] transition-colors truncate">
                                {crew.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium truncate">
                                {crew.job || crew.department || 'Đoàn làm phim'}
                              </span>
                            </div>
                          </div>
                        );

                        return href ? (
                          <Link
                            key={crew.id || idx}
                            href={href}
                            onClick={() => setIsCastModalOpen(false)}
                            className="block"
                          >
                            {Card}
                          </Link>
                        ) : (
                          <div key={crew.id || idx}>{Card}</div>
                        );
                      })}
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
