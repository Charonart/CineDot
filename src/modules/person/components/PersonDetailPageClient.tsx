'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  MapPin,
  Flame,
  Film,
  Clapperboard,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
} from 'lucide-react';
import { usePersonDetail } from '../hooks/usePersonDetail';
import { Skeleton } from '@/shared/ui/Skeleton';

interface PersonDetailPageClientProps {
  id: string | number;
}

export function PersonDetailPageClient({ id }: PersonDetailPageClientProps) {
  const router = useRouter();
  const { person, loading, isError } = usePersonDetail(id);
  const [activeTab, setActiveTab] = useState<'cast' | 'crew'>('cast');
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  if (loading) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Skeleton variant="card" className="w-10 h-10 rounded-xl" />
            <Skeleton variant="text" className="w-48 h-8" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Skeleton variant="card" className="w-full aspect-[3/4] rounded-3xl" />
              <Skeleton variant="card" className="w-full h-32 rounded-2xl" />
            </div>
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton variant="text" className="w-2/3 h-10" />
              <Skeleton variant="card" className="w-full h-48 rounded-2xl" />
              <Skeleton variant="card" className="w-full h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !person) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
        <div className="w-20 h-20 rounded-3xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center mb-4">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          Không Tìm Thấy Thông Tin Nghệ Sĩ
        </h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Hồ sơ của nghệ sĩ này hiện chưa được cập nhật hoặc không tồn tại trong hệ thống.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-full bg-[#7C6FE8] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#7C6FE8]/25 hover:bg-[#685bc7] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay Lại</span>
        </button>
      </div>
    );
  }

  const hasCast = person.castMovies && person.castMovies.length > 0;
  const hasCrew = person.crewMovies && person.crewMovies.length > 0;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#7C6FE8] selection:text-white pt-24 pb-20">
      {/* Background Ambient Glow */}
      <div className="w-[500px] h-[500px] rounded-full bg-[#7C6FE8]/10 blur-3xl fixed -top-20 -left-20 pointer-events-none" />
      <div className="w-[400px] h-[400px] rounded-full bg-purple-200/30 blur-3xl fixed bottom-0 right-0 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8 relative z-10">
        {/* Navigation Breadcrumb / Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#7C6FE8] bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay Lại</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C6FE8] bg-purple-50 px-3.5 py-1 rounded-full border border-purple-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HỒ SƠ ĐIỆN ẢNH</span>
            </span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 Cols): Portrait Photo & Quick Stats */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-white rounded-3xl p-5 border border-purple-100 shadow-[0_15px_45px_rgba(124,111,232,0.08)] flex flex-col gap-5"
            >
              {/* Portrait Image */}
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 relative shadow-inner">
                {person.avatarUrl ? (
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <User className="w-16 h-16" />
                    <span className="text-xs font-medium">Chưa có ảnh đại diện</span>
                  </div>
                )}

                {/* Popularity Badge */}
                {(person.popularity ?? 0) > 0 && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{(person.popularity ?? 0).toFixed(1)} Điểm TMDB</span>
                  </div>
                )}
              </div>

              {/* Personal Info List */}
              <div className="flex flex-col gap-3.5 text-xs text-slate-700">
                {person.birthday && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4 text-[#7C6FE8]" />
                      <span className="font-semibold">Ngày sinh:</span>
                    </div>
                    <span className="font-bold text-slate-900">{person.birthday}</span>
                  </div>
                )}

                {person.placeOfBirth && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4 text-[#7C6FE8]" />
                      <span className="font-semibold">Quê quán:</span>
                    </div>
                    <span className="font-bold text-slate-900 text-right max-w-[180px] truncate" title={person.placeOfBirth}>
                      {person.placeOfBirth}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Award className="w-4 h-4 text-[#7C6FE8]" />
                    <span className="font-semibold">Lĩnh vực:</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {person.knownForDepartment === 'Directing'
                      ? 'Đạo Diễn'
                      : person.knownForDepartment === 'Acting'
                      ? 'Diễn Viên'
                      : person.knownForDepartment || 'Nghệ Thuật'}
                  </span>
                </div>

                {person.genderLabel && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <User className="w-4 h-4 text-[#7C6FE8]" />
                      <span className="font-semibold">Giới tính:</span>
                    </div>
                    <span className="font-bold text-slate-900">{person.genderLabel}</span>
                  </div>
                )}

                {person.imdbId && (
                  <a
                    href={`https://www.imdb.com/name/${person.imdbId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs transition-colors"
                  >
                    <span>Trang IMDb Chính Thức</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column (8 Cols): Header, Biography, Filmography */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Header Title Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-[0_15px_45px_rgba(124,111,232,0.06)] flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7C6FE8]">
                  NGHỆ SĨ ĐIỆN ẢNH
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {person.name}
                </h1>
                {person.originalName && person.originalName !== person.name && (
                  <span className="text-sm font-semibold text-slate-400 italic">
                    Tên gốc: {person.originalName}
                  </span>
                )}
              </div>

              {/* Biography Section */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  TIỂU SỬ & SỰ NGHIỆP
                </h3>
                <p
                  className={`text-sm text-slate-600 leading-relaxed text-justify ${
                    !isBioExpanded && person.bio && person.bio.length > 350 ? 'line-clamp-4' : ''
                  }`}
                >
                  {person.bio}
                </p>
                {person.bio && person.bio.length > 350 && (
                  <button
                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                    className="text-xs font-bold text-[#7C6FE8] hover:underline self-start mt-1 cursor-pointer"
                  >
                    {isBioExpanded ? 'Thu gọn tiểu sử' : 'Đọc thêm toàn bộ tiểu sử...'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Filmography Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-[0_15px_45px_rgba(124,111,232,0.06)] flex flex-col gap-6">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  {hasCast && (
                    <button
                      onClick={() => setActiveTab('cast')}
                      className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                        activeTab === 'cast'
                          ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      <span>Diễn Xuất ({person.castMovies.length})</span>
                    </button>
                  )}

                  {hasCrew && (
                    <button
                      onClick={() => setActiveTab('crew')}
                      className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                        activeTab === 'crew'
                          ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Clapperboard className="w-4 h-4" />
                      <span>Đạo Diễn / Sản Xuất ({person.crewMovies.length})</span>
                    </button>
                  )}
                </div>

                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  Danh mục tác phẩm
                </span>
              </div>

              {/* Movie Grid */}
              {activeTab === 'cast' && hasCast && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {person.castMovies.map((m, idx) => (
                    <Link
                      key={m.movieId || idx}
                      href={`/movies/${m.slug}`}
                      className="group flex flex-col gap-2 cursor-pointer"
                    >
                      <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-900 relative shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                        {m.posterUrl ? (
                          <img
                            src={m.posterUrl}
                            alt={m.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Film className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1">
                            <span>Xem Phim</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#7C6FE8] transition-colors line-clamp-1">
                          {m.title}
                        </span>
                        {m.characterName && (
                          <span className="text-[11px] text-slate-500 font-medium line-clamp-1">
                            vai <strong className="text-slate-700 font-semibold">{m.characterName}</strong>
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {activeTab === 'crew' && hasCrew && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {person.crewMovies.map((m, idx) => (
                    <Link
                      key={m.movieId || idx}
                      href={`/movies/${m.slug}`}
                      className="group flex flex-col gap-2 cursor-pointer"
                    >
                      <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-900 relative shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                        {m.posterUrl ? (
                          <img
                            src={m.posterUrl}
                            alt={m.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Clapperboard className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#7C6FE8] transition-colors line-clamp-1">
                          {m.title}
                        </span>
                        <span className="text-[11px] text-[#7C6FE8] font-bold">
                          {m.job || m.department || 'Đạo Diễn'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!hasCast && !hasCrew && (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  Chưa có danh mục phim liên kết với nghệ sĩ này.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
