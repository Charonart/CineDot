'use client';

import React, { useState } from 'react';
import { useAdminMovies } from '../../hooks/useAdminMovies';
import { AdminMovieItem } from '../../types/adminMovie.types';
import {
  Sparkles,
  Search,
  X,
  Star,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DownloadCloud,
  Tv,
} from 'lucide-react';
import { AdminPosterCard, AdminBackdropBanner } from '../ui';
import { AgeRatingBadge } from '@/shared/components/ui/AgeRatingBadge';

interface AdminTmdbSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTmdbSyncModal: React.FC<AdminTmdbSyncModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AdminMovieItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { syncFromTmdb, isSyncingTmdb, createMovie } = useAdminMovies();

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setErrorMsg('');
    setSuccessMsg('');
    setHasSearched(true);

    try {
      const results = await syncFromTmdb(searchQuery.trim());
      setSearchResults(results);
      if (results.length === 0) {
        setErrorMsg(`Không tìm thấy kết quả phù hợp trên TMDB cho từ khóa "${searchQuery}"`);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj?.message || 'Không thể kết nối đến máy chủ TMDB Proxy!');
    }
  };

  const handleImport = async (movie: AdminMovieItem) => {
    setImportingId(movie.id);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await createMovie({
        title: movie.title,
        original_title: movie.originalTitle,
        overview: movie.overview,
        release_date: movie.releaseDate,
        original_language: movie.originalLanguage || 'en',
        age_rating: movie.ageRating || 'P',
        ageRating: movie.ageRating || 'P',
        popularity: movie.popularity,
        poster_path: movie.rawPosterPath || movie.posterUrl,
        backdrop_path: movie.rawBackdropPath || movie.backdropUrl,
        trailer_url: movie.trailerUrl,
        duration_minutes: movie.durationMinutes || 120,
        status: movie.rawStatus || 'now_showing',
        genre_ids: movie.genreIds && movie.genreIds.length > 0 ? movie.genreIds : [1],
      });

      setSuccessMsg(`Đã nhập thành công bộ phim "${movie.title}" vào hệ thống CineDot!`);
      setTimeout(() => {
        setImportingId(null);
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj?.message || 'Nhập phim thất bại!');
      setImportingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-purple-100 p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-extrabold text-slate-900">Đồng Bộ Dữ Liệu TMDB Tự Động</h3>
              <span className="text-xs text-slate-500 font-medium">
                Tìm kiếm và 1-click import phim chuẩn quốc tế (Poster + Backdrop 16:9) vào CSDL CineDot
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên phim tiếng Anh hoặc tiếng Việt (VD: Dune 2, Inside Out 2, Deadpool...)"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSyncingTmdb || !searchQuery.trim()}
            className="px-6 py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSyncingTmdb ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Tìm Kiếm</span>
          </button>
        </form>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Results List */}
        <div className="flex flex-col gap-3 min-h-[160px] overflow-y-auto pr-1">
          {isSyncingTmdb ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 text-[#7C6FE8] animate-spin" />
              <span className="text-xs font-medium">Đang tìm kiếm dữ liệu phim trên TMDB...</span>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((movie) => (
              <div
                key={movie.id}
                className="p-4 rounded-2xl border border-gray-200 hover:border-purple-200 bg-white hover:bg-purple-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <AdminPosterCard
                    src={movie.posterUrl}
                    alt={movie.title}
                    size="sm"
                    ageRating={movie.ageRating}
                    fallbackText={movie.title}
                    className="shrink-0 shadow-xs border border-gray-200"
                  />
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-900 truncate">{movie.title}</h4>
                      <AgeRatingBadge ageRating={movie.ageRating} size="xs" variant="solid" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium truncate">{movie.originalTitle}</span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold mt-0.5">
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{movie.rating} ★</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{movie.releaseDate}</span>
                      </span>
                      {movie.backdropUrl ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                          <Tv className="w-3 h-3" />
                          <span>Backdrop HD</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleImport(movie)}
                  disabled={importingId === movie.id}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#7C6FE8]/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {importingId === movie.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang nhập...</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>Nhập Vào Hệ Thống</span>
                    </>
                  )}
                </button>
              </div>
            ))
          ) : hasSearched ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs font-medium">
              Không tìm thấy bộ phim nào. Vui lòng thử từ khóa khác.
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs font-medium">
              Nhập từ khóa và bấm Tìm Kiếm để nạp phim từ TMDB.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
