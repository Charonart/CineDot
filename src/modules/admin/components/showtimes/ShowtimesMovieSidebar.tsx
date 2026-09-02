'use client';

import React, { useState, useMemo } from 'react';
import { Film, Plus, Search, Loader2, GripVertical, Clapperboard, X, Clock } from 'lucide-react';
import { AdminMovieOption } from '../../types/adminShowtime.types';
import { imageHelper } from '@/shared/utils/imageHelper';
import { isNowShowing, isUpcoming } from '@/shared/utils/movieStatusHelper';

interface ShowtimesMovieSidebarProps {
  movies: AdminMovieOption[];
  isLoadingMovies: boolean;
  onSelectMovieForAdd: (movie: AdminMovieOption) => void;
  onDragStartMovie?: (movie: AdminMovieOption) => void;
}

type MovieFilterTab = 'ALL' | 'now_showing' | 'upcoming';

export function ShowtimesMovieSidebar({
  movies,
  isLoadingMovies,
  onSelectMovieForAdd,
  onDragStartMovie,
}: ShowtimesMovieSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<MovieFilterTab>('now_showing');

  const nowShowingCount = useMemo(() => movies.filter((m) => isNowShowing(m.status)).length, [movies]);
  const upcomingCount = useMemo(() => movies.filter((m) => isUpcoming(m.status)).length, [movies]);

  // Filter movies by active tab & search keyword
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      // 1. Status Filter
      if (activeTab === 'now_showing') {
        if (nowShowingCount > 0 && !isNowShowing(m.status)) return false;
      } else if (activeTab === 'upcoming') {
        if (!isUpcoming(m.status)) return false;
      }

      // 2. Search Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchTitle = (m.title || '').toLowerCase().includes(query);
        const matchGenre = Array.isArray(m.genres) && m.genres.some((g) => g.toLowerCase().includes(query));
        const matchAge = (m.ageRating || '').toLowerCase().includes(query);
        return matchTitle || matchGenre || matchAge;
      }

      return true;
    });
  }, [movies, activeTab, searchTerm, nowShowingCount]);

  const handleDragStart = (e: React.DragEvent, m: AdminMovieOption) => {
    e.dataTransfer.effectAllowed = 'copyMove';
    e.dataTransfer.setData('application/json', JSON.stringify(m));
    e.dataTransfer.setData('application/cinedot-item-type', 'movie');

    // Create compact floating drag preview chip
    const dragPreview = document.createElement('div');
    dragPreview.textContent = `🎬 ${m.title} (${m.duration}p)`;
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-9999px';
    dragPreview.style.left = '-9999px';
    dragPreview.style.padding = '6px 12px';
    dragPreview.style.background = '#0F172A';
    dragPreview.style.color = '#FFFFFF';
    dragPreview.style.fontWeight = '600';
    dragPreview.style.fontSize = '11px';
    dragPreview.style.borderRadius = '6px';
    dragPreview.style.border = '1px solid #7C6FE8';
    dragPreview.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
    dragPreview.style.pointerEvents = 'none';
    document.body.appendChild(dragPreview);

    e.dataTransfer.setDragImage(dragPreview, 20, 15);
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview);
      }
    }, 0);

    onDragStartMovie?.(m);
  };

  const getAgeBadgeStyle = (age: string) => {
    const a = (age || 'P').toUpperCase();
    if (a.includes('18') || a.includes('C18')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (a.includes('16') || a.includes('C16')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (a.includes('13') || a.includes('C13')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="w-full bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-210px)] min-h-[560px] select-none font-sans">
      {/* Header with Title & Stats */}
      <div className="p-3 border-b border-gray-100 bg-slate-50/70 flex flex-col gap-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-purple-100/80 text-[#7C6FE8] flex items-center justify-center">
              <Clapperboard className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              Kho phim ({movies.length})
            </span>
          </div>
          <span className="text-[10.5px] text-slate-400 font-medium">Kéo thả để xếp lịch</span>
        </div>

        {/* Search Box */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs shadow-2xs focus-within:border-[#7C6FE8] focus-within:ring-1 focus-within:ring-[#7C6FE8]/20 transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm tên phim, thể loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent font-medium focus:outline-none text-slate-900 placeholder-slate-400 text-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer rounded"
              title="Xóa tìm kiếm"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Status Segment Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-0.5 rounded-lg text-[11px] font-medium">
          <button
            onClick={() => setActiveTab('now_showing')}
            className={`py-1 px-1 rounded-md text-center transition-all cursor-pointer truncate ${
              activeTab === 'now_showing'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang chiếu ({nowShowingCount})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-1 px-1 rounded-md text-center transition-all cursor-pointer truncate ${
              activeTab === 'upcoming'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sắp chiếu ({upcomingCount})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`py-1 px-1 rounded-md text-center transition-all cursor-pointer truncate ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({movies.length})
          </button>
        </div>
      </div>

      {/* Movies List */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 divide-y-0">
        {isLoadingMovies ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2.5">
            <Loader2 className="w-5 h-5 animate-spin text-[#7C6FE8]" />
            <span className="font-medium">Đang tải danh sách phim...</span>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="py-12 px-3 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Film className="w-5 h-5" />
            </div>
            <span className="font-medium text-slate-600">Không tìm thấy phim phù hợp</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[11px] text-[#7C6FE8] hover:underline cursor-pointer font-medium"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            )}
          </div>
        ) : (
          filteredMovies.map((m) => {
            const posterSrc = imageHelper.getPosterUrl(m.posterUrl, 'sm');
            return (
              <div
                key={m.id}
                draggable
                onDragStart={(e) => handleDragStart(e, m)}
                onClick={() => onSelectMovieForAdd(m)}
                className="p-1.5 rounded-lg border border-gray-200/80 hover:border-[#7C6FE8] hover:shadow-xs transition-all flex items-center gap-2 cursor-grab active:cursor-grabbing group bg-white select-none"
                title={`${m.title} (${m.duration} phút - ${m.ageRating}) • Nhấn hoặc kéo để xếp lịch`}
              >
                {/* Poster */}
                <div className="w-8 h-12 rounded overflow-hidden shrink-0 bg-slate-100 border border-gray-200/60 shadow-2xs relative">
                  <img
                    src={posterSrc}
                    alt={m.title}
                    onError={(e) => {
                      // Fallback to default poster
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Movie Details */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold text-xs text-slate-900 truncate group-hover:text-[#7C6FE8] leading-tight transition-colors">
                    {m.title}
                  </span>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                    <span className={`px-1 py-0.2 rounded font-bold border ${getAgeBadgeStyle(m.ageRating)}`}>
                      {m.ageRating || 'P'}
                    </span>
                    <span className="font-mono flex items-center gap-0.5 text-slate-600">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      {m.duration}p
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 truncate mt-0.5">
                    {Array.isArray(m.genres) && m.genres.length > 0 ? m.genres.slice(0, 2).join(', ') : 'Phim rạp'}
                  </span>
                </div>

                {/* Drag Handle & Quick Add Action */}
                <div className="flex items-center gap-0.5 shrink-0 text-slate-300 group-hover:text-[#7C6FE8] transition-colors">
                  <GripVertical className="w-3.5 h-3.5 opacity-60" />
                  <div
                    className="p-1 rounded hover:bg-purple-50 text-[#7C6FE8] opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Xếp lịch suất chiếu"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

