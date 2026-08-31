'use client';

import React, { useState, useMemo } from 'react';
import { Film, Plus, Search, Loader2, GripVertical, Clapperboard, X } from 'lucide-react';
import { AdminMovieOption } from '../../types/adminShowtime.types';

interface ShowtimesMovieSidebarProps {
  movies: AdminMovieOption[];
  isLoadingMovies: boolean;
  onSelectMovieForAdd: (movie: AdminMovieOption) => void;
  onDragStartMovie?: (movie: AdminMovieOption) => void;
}

type MovieFilterTab = 'ALL' | 'NOW_SHOWING' | 'COMING_SOON';

export function ShowtimesMovieSidebar({
  movies,
  isLoadingMovies,
  onSelectMovieForAdd,
  onDragStartMovie,
}: ShowtimesMovieSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<MovieFilterTab>('NOW_SHOWING');

  // Filter movies by active tab & search keyword
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      // 1. Status Filter
      if (activeTab === 'NOW_SHOWING') {
        const isShowing = m.status === 'NOW_SHOWING' || m.status === 'SHOWING' || !m.status;
        if (!isShowing) return false;
      } else if (activeTab === 'COMING_SOON') {
        const isComing = m.status === 'COMING_SOON' || m.status === 'UPCOMING';
        if (!isComing) return false;
      }

      // 2. Search Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(query);
        const matchGenre = m.genres.some((g) => g.toLowerCase().includes(query));
        return matchTitle || matchGenre;
      }

      return true;
    });
  }, [movies, activeTab, searchTerm]);

  const nowShowingCount = useMemo(() => {
    return movies.filter((m) => m.status === 'NOW_SHOWING' || m.status === 'SHOWING' || !m.status).length;
  }, [movies]);

  const comingSoonCount = useMemo(() => {
    return movies.filter((m) => m.status === 'COMING_SOON' || m.status === 'UPCOMING').length;
  }, [movies]);

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

  return (
    <div className="w-full bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-210px)] min-h-[560px] select-none font-sans">
      {/* Header with Title & Stats */}
      <div className="p-3 border-b border-gray-100 bg-slate-50/50 flex flex-col gap-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clapperboard className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span className="text-xs font-semibold text-slate-900">
              Kho phim ({movies.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Kéo thả để xếp lịch</span>
        </div>

        {/* Search Box */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white border border-gray-200 text-xs shadow-2xs">
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
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Status Segment Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-md text-[11px] font-medium">
          <button
            onClick={() => setActiveTab('NOW_SHOWING')}
            className={`py-1 rounded text-center transition-colors cursor-pointer ${
              activeTab === 'NOW_SHOWING'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đang chiếu ({nowShowingCount})
          </button>
          <button
            onClick={() => setActiveTab('COMING_SOON')}
            className={`py-1 rounded text-center transition-colors cursor-pointer ${
              activeTab === 'COMING_SOON'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sắp chiếu ({comingSoonCount})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`py-1 rounded text-center transition-colors cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tất cả ({movies.length})
          </button>
        </div>
      </div>

      {/* Movies Compact List */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {isLoadingMovies ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#7C6FE8]" />
            <span>Đang tải danh sách phim...</span>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="py-12 px-3 text-center text-slate-400 text-xs flex flex-col items-center gap-1.5">
            <Film className="w-5 h-5 text-slate-300" />
            <span>Không tìm thấy phim phù hợp.</span>
          </div>
        ) : (
          filteredMovies.map((m) => (
            <div
              key={m.id}
              draggable
              onDragStart={(e) => handleDragStart(e, m)}
              onClick={() => onSelectMovieForAdd(m)}
              className="p-1.5 rounded-lg border border-gray-200/90 hover:border-[#7C6FE8] hover:bg-slate-50 transition-all flex items-center gap-2 cursor-grab active:cursor-grabbing group bg-white shadow-2xs select-none"
              title={`${m.title} (${m.duration} phút - ${m.ageRating})`}
            >
              {/* Poster */}
              {m.posterUrl ? (
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-8 h-12 object-cover rounded shadow-2xs shrink-0 bg-slate-100"
                />
              ) : (
                <div className="w-8 h-12 rounded bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0 font-bold text-xs">
                  C
                </div>
              )}

              {/* Movie Details */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-xs text-slate-900 truncate group-hover:text-[#7C6FE8] leading-tight">
                  {m.title}
                </span>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                  <span className="px-1 py-0.2 rounded bg-slate-100 font-semibold text-slate-700 border border-gray-200">
                    {m.ageRating}
                  </span>
                  <span className="font-mono">{m.duration}p</span>
                </div>

                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  {m.genres.length > 0 ? m.genres.slice(0, 2).join(', ') : 'Phim rạp'}
                </span>
              </div>

              {/* Drag Handle */}
              <div className="flex items-center gap-0.5 shrink-0 text-slate-300 group-hover:text-[#7C6FE8]">
                <GripVertical className="w-3.5 h-3.5 opacity-60" />
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
