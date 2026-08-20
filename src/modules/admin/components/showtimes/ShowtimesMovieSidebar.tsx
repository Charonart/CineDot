'use client';

import React, { useState } from 'react';
import { Film, Plus, Search, Loader2, Move } from 'lucide-react';
import { AdminMovieOption } from '../../types/adminShowtime.types';

interface ShowtimesMovieSidebarProps {
  movies: AdminMovieOption[];
  isLoadingMovies: boolean;
  onSelectMovieForAdd: (movie: AdminMovieOption) => void;
  onDragStartMovie?: (movie: AdminMovieOption) => void;
}

export function ShowtimesMovieSidebar({
  movies,
  isLoadingMovies,
  onSelectMovieForAdd,
  onDragStartMovie,
}: ShowtimesMovieSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col gap-3.5 text-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Film className="w-4 h-4 text-[#7C6FE8]" />
          <span>PHIM ĐANG CHIẾU ({movies.length})</span>
        </span>
        <span className="text-[10px] text-slate-400 font-bold">Kéo / Bấm để xếp</span>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 border border-gray-200 text-xs">
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Tìm phim..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent font-medium focus:outline-none text-slate-900 placeholder-slate-400 text-xs"
        />
      </div>

      {/* Movies List */}
      <div className="flex flex-col gap-2 max-h-[620px] overflow-y-auto pr-1">
        {isLoadingMovies ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#7C6FE8]" />
            <span>Đang tải danh sách phim...</span>
          </div>
        ) : filteredMovies.length === 0 ? (
          <span className="text-xs text-slate-400 py-6 text-center">
            {searchTerm ? 'Không tìm thấy phim phù hợp.' : 'Chưa có phim nào.'}
          </span>
        ) : (
          filteredMovies.map((m) => (
            <div
              key={m.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(m));
                onDragStartMovie?.(m);
              }}
              onClick={() => onSelectMovieForAdd(m)}
              className="p-2.5 rounded-2xl border border-gray-200 hover:border-[#7C6FE8] hover:bg-purple-50/40 transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group select-none relative"
            >
              {m.posterUrl ? (
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-10 h-14 object-cover rounded-xl shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-10 h-14 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center shrink-0 font-bold text-xs">
                  CD
                </div>
              )}

              <div className="flex flex-col truncate flex-1">
                <span className="font-bold text-xs text-slate-900 truncate group-hover:text-[#7C6FE8]">
                  {m.title}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                  <span className="px-1 py-0.2 rounded bg-purple-100 text-[#7C6FE8] font-black">
                    {m.ageRating}
                  </span>
                  <span>{m.duration} phút</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-slate-300 group-hover:text-[#7C6FE8]">
                <span title="Kéo thả vào timeline" className="flex items-center">
                  <Move className="w-3.5 h-3.5 opacity-60" />
                </span>
                <span title="Bấm để tạo suất" className="flex items-center">
                  <Plus className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
