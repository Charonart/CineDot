'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Film,
  Plus,
  CheckCircle2,
  X,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  AlertTriangle,
  Loader2,
  Sparkles,
  Calendar,
  Clock,
  Globe,
  ShieldAlert,
  TrendingUp,
  Image as ImageIcon,
  Tv,
  Layers,
  FileText,
} from 'lucide-react';
import { useAdminMovies, useAdminMovieCredits } from '../hooks/useAdminMovies';
import { AdminMovieItem } from '../types/adminMovie.types';
import { createMovieSchema } from '../schemas/adminMovie.schema';
import { AdminTmdbSyncModal } from './modals/AdminTmdbSyncModal';
import { Skeleton } from '@/shared/ui/Skeleton';
import { imageHelper } from '@/shared/utils/imageHelper';
import { AdminBackdropBanner, AdminPosterCard, AdminBannerLivePreview } from './ui';

const STATUS_OPTIONS = [
  { id: 'ALL', label: 'Trạng thái: Tất cả', apiKey: undefined },
  { id: 'NOW_SHOWING', label: 'Đang chiếu (now_showing)', apiKey: 'now_showing' },
  { id: 'COMING_SOON', label: 'Sắp chiếu (upcoming)', apiKey: 'upcoming' },
  { id: 'STOPPED', label: 'Ngừng chiếu (ended)', apiKey: 'ended' },
];

const LANGUAGE_OPTIONS = [
  { code: 'vi', label: 'Tiếng Việt (vi)' },
  { code: 'en', label: 'Tiếng Anh (en)' },
  { code: 'ko', label: 'Tiếng Hàn (ko)' },
  { code: 'ja', label: 'Tiếng Nhật (ja)' },
  { code: 'zh', label: 'Tiếng Trung (zh)' },
  { code: 'th', label: 'Tiếng Thái (th)' },
  { code: 'fr', label: 'Tiếng Pháp (fr)' },
];

const QUICK_DURATIONS = [90, 105, 120, 135, 150, 180];

/**
 * Smart helper: Cleans full TMDB image URL to clean relative path /xxx.jpg
 */
function cleanTmdbPath(val: string): string {
  const trimmed = val.trim();
  if (!trimmed) return '';
  // Check if user pasted full TMDB URL e.g. https://image.tmdb.org/t/p/w500/z8OWDTR7pQuZi7jkEuR7yMXRrQt.jpg
  const tmdbMatch = trimmed.match(/image\.tmdb\.org\/t\/p\/[^/]+(\/.+)/i);
  if (tmdbMatch && tmdbMatch[1]) {
    return tmdbMatch[1];
  }
  return trimmed;
}

export function AdminMoviesView() {
  // Search & Filter States
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NOW_SHOWING' | 'COMING_SOON' | 'STOPPED'>('ALL');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const activeStatusApiKey = STATUS_OPTIONS.find((s) => s.id === statusFilter)?.apiKey;

  // Hook 100% Real API
  const {
    moviesList,
    genres,
    pagination,
    isLoading,
    isFetching,
    createMovie,
    isCreating,
    updateMovie,
    isUpdating,
    deleteMovie,
    isDeleting,
  } = useAdminMovies({
    search: searchTerm || undefined,
    status: activeStatusApiKey,
    page: currentPage,
    per_page: 6,
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTmdbModalOpen, setIsTmdbModalOpen] = useState(false);
  const [viewingMovie, setViewingMovie] = useState<AdminMovieItem | null>(null);
  const [editingMovie, setEditingMovie] = useState<AdminMovieItem | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<AdminMovieItem | null>(null);

  // Form States for Add
  const [addTitle, setAddTitle] = useState('');
  const [addOriginalTitle, setAddOriginalTitle] = useState('');
  const [addOverview, setAddOverview] = useState('');
  const [addReleaseDate, setAddReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [addDurationMinutes, setAddDurationMinutes] = useState(120);
  const [addOriginalLanguage, setAddOriginalLanguage] = useState('vi');
  const [addAdult, setAddAdult] = useState(false);
  const [addPopularity, setAddPopularity] = useState<number | string>(10);
  const [addStatus, setAddStatus] = useState<'now_showing' | 'upcoming' | 'ended'>('now_showing');
  const [addSelectedGenreIds, setAddSelectedGenreIds] = useState<number[]>([1]);
  const [addPosterPath, setAddPosterPath] = useState('');
  const [addBackdropPath, setAddBackdropPath] = useState('');
  const [addTrailerUrl, setAddTrailerUrl] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  // Form States for Edit
  const [editTitle, setEditTitle] = useState('');
  const [editOriginalTitle, setEditOriginalTitle] = useState('');
  const [editOverview, setEditOverview] = useState('');
  const [editReleaseDate, setEditReleaseDate] = useState('');
  const [editDurationMinutes, setEditDurationMinutes] = useState(120);
  const [editOriginalLanguage, setEditOriginalLanguage] = useState('vi');
  const [editAdult, setEditAdult] = useState(false);
  const [editPopularity, setEditPopularity] = useState<number | string>(10);
  const [editStatus, setEditStatus] = useState<'now_showing' | 'upcoming' | 'ended'>('now_showing');
  const [editSelectedGenreIds, setEditSelectedGenreIds] = useState<number[]>([]);
  const [editPosterPath, setEditPosterPath] = useState('');
  const [editBackdropPath, setEditBackdropPath] = useState('');
  const [editTrailerUrl, setEditTrailerUrl] = useState('');
  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  // Credits hook for detail view
  const { credits, isLoadingCredits } = useAdminMovieCredits(viewingMovie?.id || null);

  // Click outside listener for custom dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pre-fill Edit Modal Form
  const handleOpenEditModal = (movie: AdminMovieItem) => {
    setEditingMovie(movie);
    setEditTitle(movie.title);
    setEditOriginalTitle(movie.originalTitle || movie.title);
    setEditOverview(movie.overview || '');
    setEditReleaseDate(movie.releaseDate || new Date().toISOString().split('T')[0]);
    setEditDurationMinutes(movie.durationMinutes || 120);
    setEditOriginalLanguage(movie.originalLanguage || 'vi');
    setEditAdult(Boolean(movie.adult));
    setEditPopularity(movie.popularity ?? 10);
    
    // Normalize raw status to now_showing / upcoming / ended
    let normalizedStatus: 'now_showing' | 'upcoming' | 'ended' = 'now_showing';
    const raw = (movie.rawStatus || '').toLowerCase();
    if (raw.includes('upcoming') || raw.includes('coming')) normalizedStatus = 'upcoming';
    else if (raw.includes('ended') || raw.includes('stop') || raw.includes('end')) normalizedStatus = 'ended';
    setEditStatus(normalizedStatus);

    setEditSelectedGenreIds(movie.genreIds.length > 0 ? movie.genreIds : (genres[0] ? [genres[0].id] : [1]));
    setEditPosterPath(movie.rawPosterPath || '');
    setEditBackdropPath(movie.rawBackdropPath || '');
    setEditTrailerUrl(movie.trailerUrl || '');
    setEditErrorMsg('');
    setEditSuccessMsg('');
  };

  // Toggle Genre Checkbox
  const toggleGenre = (genreId: number, isEdit = false) => {
    if (isEdit) {
      setEditSelectedGenreIds((prev) =>
        prev.includes(genreId) ? (prev.length > 1 ? prev.filter((id) => id !== genreId) : prev) : [...prev, genreId]
      );
    } else {
      setAddSelectedGenreIds((prev) =>
        prev.includes(genreId) ? (prev.length > 1 ? prev.filter((id) => id !== genreId) : prev) : [...prev, genreId]
      );
    }
  };

  // Select all / Deselect all genres
  const handleSelectAllGenres = (isEdit = false) => {
    const allIds = genres.map((g) => g.id);
    if (isEdit) setEditSelectedGenreIds(allIds);
    else setAddSelectedGenreIds(allIds);
  };

  // Submit Add Movie
  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddErrorMsg('');
    setAddSuccessMsg('');

    const cleanedPoster = cleanTmdbPath(addPosterPath);
    const cleanedBackdrop = cleanTmdbPath(addBackdropPath);

    const validationResult = createMovieSchema.safeParse({
      title: addTitle.trim(),
      originalTitle: addOriginalTitle.trim() || undefined,
      overview: addOverview.trim() || undefined,
      releaseDate: addReleaseDate,
      originalLanguage: addOriginalLanguage,
      adult: addAdult,
      popularity: Number(addPopularity) || 0,
      durationMinutes: Number(addDurationMinutes),
      status: addStatus,
      genreIds: addSelectedGenreIds,
      posterPath: cleanedPoster,
      backdropPath: cleanedBackdrop || undefined,
      trailerUrl: addTrailerUrl.trim() || undefined,
    });

    if (!validationResult.success) {
      setAddErrorMsg(validationResult.error.errors[0]?.message || 'Dữ liệu không hợp lệ!');
      return;
    }

    try {
      await createMovie({
        title: addTitle.trim(),
        original_title: addOriginalTitle.trim() || addTitle.trim(),
        overview: addOverview.trim() || undefined,
        release_date: addReleaseDate,
        original_language: addOriginalLanguage,
        adult: addAdult,
        popularity: Number(addPopularity) || 0,
        duration_minutes: Number(addDurationMinutes),
        status: addStatus,
        genre_ids: addSelectedGenreIds,
        poster_path: cleanedPoster,
        backdrop_path: cleanedBackdrop || undefined,
        trailer_url: addTrailerUrl.trim() || undefined,
      });

      setAddSuccessMsg(`Đã tạo thành công phim "${addTitle}" trên hệ thống CineDot!`);
      setTimeout(() => {
        setIsAddModalOpen(false);
        setAddTitle('');
        setAddOriginalTitle('');
        setAddOverview('');
        setAddPosterPath('');
        setAddBackdropPath('');
        setAddTrailerUrl('');
        setAddSuccessMsg('');
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setAddErrorMsg(errorObj?.message || 'Không thể tạo bộ phim mới!');
    }
  };

  // Submit Edit Movie
  const handleSaveEditMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie || !editTitle.trim()) return;
    setEditErrorMsg('');
    setEditSuccessMsg('');

    const cleanedPoster = cleanTmdbPath(editPosterPath);
    const cleanedBackdrop = cleanTmdbPath(editBackdropPath);

    try {
      await updateMovie({
        id: editingMovie.id,
        payload: {
          title: editTitle.trim(),
          original_title: editOriginalTitle.trim() || editTitle.trim(),
          overview: editOverview.trim() || undefined,
          release_date: editReleaseDate,
          original_language: editOriginalLanguage,
          adult: editAdult,
          popularity: Number(editPopularity) || 0,
          duration_minutes: Number(editDurationMinutes),
          status: editStatus,
          genre_ids: editSelectedGenreIds,
          poster_path: cleanedPoster || undefined,
          backdrop_path: cleanedBackdrop || undefined,
          trailer_url: editTrailerUrl.trim() || undefined,
        },
      });

      setEditSuccessMsg(`Đã cập nhật thông tin phim "${editTitle}" thành công!`);
      setTimeout(() => {
        setEditingMovie(null);
        setEditSuccessMsg('');
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setEditErrorMsg(errorObj?.message || 'Cập nhật phim thất bại!');
    }
  };

  // Confirm Delete Movie
  const handleConfirmDelete = async () => {
    if (!deletingMovie) return;
    try {
      await deleteMovie(deletingMovie.id);
      setDeletingMovie(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert(errorObj?.message || 'Không thể xóa bộ phim!');
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* 2.1 Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-4 h-4" />
            <span>KHO DỮ LIỆU ĐIỆN ẢNH CINEDOT</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Danh Sách Phim
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý toàn diện kho phim, phân loại thể loại, ảnh TMDB, độ tuổi và thời lượng
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm theo tên phim..."
              className="w-60 pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] shadow-2xs"
            />
          </div>

          {/* Custom Popover Status Filter Dropdown */}
          <div ref={statusDropdownRef} className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isStatusDropdownOpen
                  ? 'border-[#7C6FE8] bg-purple-50/60 text-[#7C6FE8]'
                  : 'border-gray-200 text-slate-700 hover:border-[#7C6FE8]'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
              <span>{STATUS_OPTIONS.find((s) => s.id === statusFilter)?.label || 'Trạng thái: Tất cả'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isStatusDropdownOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                }`}
              />
            </button>

            {isStatusDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white border border-purple-100 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(124,111,232,0.15)] z-50 flex flex-col gap-0.5"
              >
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = statusFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setStatusFilter(opt.id as 'ALL' | 'NOW_SHOWING' | 'COMING_SOON' | 'STOPPED');
                        setIsStatusDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50 text-[#7C6FE8]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* TMDB Smart Sync Button */}
          <button
            onClick={() => setIsTmdbModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] border border-purple-200 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            title="Tự động đồng bộ thông tin phim từ TMDB"
          >
            <Sparkles className="w-4 h-4" />
            <span>ĐỒNG BỘ TMDB</span>
          </button>

          {/* Primary Add Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM PHIM MỚI</span>
          </button>
        </div>
      </div>

      {/* 2.2 Movies Data Table */}
      <div className="rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden flex flex-col relative">
        {isFetching && !isLoading && (
          <div className="absolute top-4 right-6 flex items-center gap-1.5 text-xs font-bold text-[#7C6FE8] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 animate-pulse z-10">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Đang tải...</span>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                <th className="p-4 rounded-tl-3xl w-[32%] whitespace-nowrap">PHIM</th>
                <th className="p-4 w-[14%] whitespace-nowrap">THỂ LOẠI</th>
                <th className="p-4 w-[11%] whitespace-nowrap">THỜI LƯỢNG</th>
                <th className="p-4 w-[13%] whitespace-nowrap">KHỞI CHIẾU</th>
                <th className="p-4 w-[10%] whitespace-nowrap">NGÔN NGỮ</th>
                <th className="p-4 w-[10%] whitespace-nowrap">TRẠNG THÁI</th>
                <th className="p-4 rounded-tr-3xl text-center w-[10%] whitespace-nowrap">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><Skeleton variant="text" className="w-48 h-5" /></td>
                    <td className="p-4"><Skeleton variant="text" className="w-28 h-4" /></td>
                    <td className="p-4"><Skeleton variant="text" className="w-16 h-4" /></td>
                    <td className="p-4"><Skeleton variant="text" className="w-24 h-4" /></td>
                    <td className="p-4"><Skeleton variant="text" className="w-16 h-4" /></td>
                    <td className="p-4"><Skeleton variant="text" className="w-20 h-4" /></td>
                    <td className="p-4 text-center"><Skeleton variant="text" className="w-20 h-4 mx-auto" /></td>
                  </tr>
                ))
              ) : moviesList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400 font-medium">
                    Không tìm thấy bộ phim nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                moviesList.map((m) => (
                  <tr key={m.id} className="hover:bg-purple-50/30 transition-colors">
                    {/* Column 1: PHIM (Poster + Title + Original Title + 18+ badge) */}
                    <td className="p-4">
                      <div className="flex items-center gap-3.5">
                        <AdminPosterCard
                          src={m.posterUrl}
                          alt={m.title}
                          size="sm"
                          adult={m.adult}
                          fallbackText={m.title}
                          className="shrink-0 border border-gray-200 shadow-xs"
                        />
                        <div className="flex flex-col gap-0.5 max-w-[220px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{m.title}</h3>
                            {m.adult && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-black">
                                18+
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium line-clamp-1 italic">
                            {m.originalTitle}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: THỂ LOẠI */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {m.genre.slice(0, 2).map((g, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                          >
                            {g}
                          </span>
                        ))}
                        {m.genre.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-bold">+{m.genre.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Column 3: THỜI LƯỢNG */}
                    <td className="p-4 text-slate-800 font-bold whitespace-nowrap">{m.duration}</td>

                    {/* Column 4: KHỞI CHIẾU */}
                    <td className="p-4 text-slate-600 font-mono whitespace-nowrap">{m.releaseDate}</td>

                    {/* Column 5: NGÔN NGỮ */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                        {m.originalLanguage || 'vi'}
                      </span>
                    </td>

                    {/* Column 6: TRẠNG THÁI */}
                    <td className="p-4 whitespace-nowrap">
                      {m.status === 'NOW_SHOWING' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                          Đang chiếu
                        </span>
                      ) : m.status === 'COMING_SOON' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">
                          Sắp chiếu
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold border border-gray-200">
                          Ngừng chiếu
                        </span>
                      )}
                    </td>

                    {/* Column 7: THAO TÁC */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingMovie(m)}
                          className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-500 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                          title="Xem Chi Tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(m)}
                          className="p-1.5 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Chỉnh Sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingMovie(m)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Xóa Phim"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 2.3 Pagination Controls */}
        {pagination.lastPage > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <span className="text-xs text-slate-500 font-medium">
              Trang {pagination.currentPage} / {pagination.lastPage} ({pagination.total} bộ phim)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.currentPage <= 1}
                className="p-2 rounded-xl bg-slate-50 border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.lastPage, p + 1))}
                disabled={pagination.currentPage >= pagination.lastPage}
                className="p-2 rounded-xl bg-slate-50 border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TMDB Smart Sync Modal */}
      <AdminTmdbSyncModal
        isOpen={isTmdbModalOpen}
        onClose={() => setIsTmdbModalOpen(false)}
      />

      {/* 2.4 Modal Xem Chi Tiết Phim */}
      {viewingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Backdrop Preview Banner (Always render with fallback) */}
            <AdminBackdropBanner
              src={viewingMovie.backdropUrl}
              alt={viewingMovie.title}
              aspectRatio="custom"
              heightClass="h-44 sm:h-52"
              showOverlay={true}
              badgeText={
                viewingMovie.status === 'NOW_SHOWING'
                  ? 'Đang Chiếu'
                  : viewingMovie.status === 'COMING_SOON'
                  ? 'Sắp Chiếu'
                  : 'Ngừng Chiếu'
              }
              badgeColor={
                viewingMovie.status === 'NOW_SHOWING'
                  ? 'bg-[#7C6FE8]'
                  : viewingMovie.status === 'COMING_SOON'
                  ? 'bg-amber-500'
                  : 'bg-slate-600'
              }
              fallbackTitle={`Backdrop: ${viewingMovie.title}`}
              overlayContent={
                <div className="flex items-center gap-2">
                  {viewingMovie.adult && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black shadow-md">
                      18+
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-amber-300 text-[11px] font-extrabold backdrop-blur-xs border border-amber-400/20">
                    ★ {viewingMovie.popularity} Điểm nổi bật
                  </span>
                </div>
              }
            />

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-slate-900">{viewingMovie.title}</h2>
                <span className="text-xs text-slate-400 italic">{viewingMovie.originalTitle}</span>
              </div>
              <button
                onClick={() => setViewingMovie(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <AdminPosterCard
                src={viewingMovie.posterUrl}
                alt={viewingMovie.title}
                size="lg"
                adult={viewingMovie.adult}
                rounded="2xl"
                fallbackText={viewingMovie.title}
                className="shadow-xl border border-gray-200 shrink-0 self-center sm:self-start"
              />

              <div className="flex flex-col gap-4 flex-1">
                {/* Information Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Thời lượng
                    </span>
                    <span className="font-bold text-slate-800">{viewingMovie.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Khởi chiếu
                    </span>
                    <span className="font-bold text-slate-800">{viewingMovie.releaseDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Ngôn ngữ
                    </span>
                    <span className="font-bold text-slate-800 uppercase">{viewingMovie.originalLanguage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Popularity
                    </span>
                    <span className="font-bold text-[#7C6FE8]">{viewingMovie.popularity}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-700">Thể loại phim:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingMovie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="text-xs font-bold text-[#7C6FE8] bg-purple-50 border border-purple-100 px-3 py-1 rounded-xl"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Synopsis / Overview */}
                {viewingMovie.overview && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-700">Tóm tắt nội dung:</span>
                    <p className="text-xs text-slate-600 leading-relaxed max-h-28 overflow-y-auto">
                      {viewingMovie.overview}
                    </p>
                  </div>
                )}

                {/* Credits / Cast & Crew */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-700">Diễn viên & Đạo diễn:</span>
                  {isLoadingCredits ? (
                    <span className="text-xs text-slate-400">Đang tải danh sách diễn viên...</span>
                  ) : credits.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {credits.map((c) => (
                        <span
                          key={c.id}
                          className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg"
                        >
                          {c.name} {c.characterName ? `(${c.characterName})` : ''}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Chưa có thông tin diễn viên.</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingMovie(null)}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer mt-2"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* 2.5 Modal Thêm Phim Mới (Tái cấu trúc 3 Phân Khu Chuyên Nghiệp) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7C6FE8]/10 text-[#7C6FE8] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Thêm Phim Mới Vào CSDL CineDot</h3>
                  <span className="text-xs text-slate-500 font-medium">Hỗ trợ mã TMDB path (/...) hoặc URL đầy đủ</span>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{addErrorMsg}</span>
              </div>
            )}

            {addSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{addSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddMovie} className="flex flex-col gap-6">
              {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-gray-200/70 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-[#7C6FE8]" />
                  <span>1. Thông Tin Cơ Bản</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Tên Phim (Tiếng Việt) *</label>
                    <input
                      type="text"
                      value={addTitle}
                      onChange={(e) => setAddTitle(e.target.value)}
                      placeholder="VD: Dune: Hành Tinh Cát 2"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Tên Gốc Quốc Tế (original_title)</label>
                    <input
                      type="text"
                      value={addOriginalTitle}
                      onChange={(e) => setAddOriginalTitle(e.target.value)}
                      placeholder="VD: Dune: Part Two"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Tóm Tắt Nội Dung Phim (overview)</label>
                  <textarea
                    value={addOverview}
                    onChange={(e) => setAddOverview(e.target.value)}
                    placeholder="Mô tả cốt truyện và nội dung chính của bộ phim..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] transition-all resize-none"
                  />
                </div>
              </div>

              {/* KHỐI 2: HÌNH ẢNH & ĐA PHƯƠNG TIỆN (POSTER, BACKDROP & LIVE BANNER STUDIO) */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-gray-200/70 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 text-[#7C6FE8]" />
                    <span>2. Hình Ảnh & Đa Phương Tiện</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">Chuẩn TMDB / URL Tuyệt Đối</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Poster Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Poster TMDB Path hoặc URL *</span>
                      <span className="text-[10px] text-[#7C6FE8] font-semibold">Tự động format /...</span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="text"
                        value={addPosterPath}
                        onChange={(e) => setAddPosterPath(e.target.value)}
                        placeholder="VD: /z8OWDTR7pQuZi7jkEuR7yMXRrQt.jpg"
                        required
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all"
                      />
                      <AdminPosterCard
                        src={addPosterPath.trim() ? imageHelper.getPosterUrl(cleanTmdbPath(addPosterPath), 'sm') : null}
                        alt="Preview Poster"
                        size="sm"
                        fallbackText="2:3"
                        className="border border-gray-200"
                      />
                    </div>
                  </div>

                  {/* Backdrop Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Backdrop Banner (16:9)</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Tùy chọn</span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="text"
                        value={addBackdropPath}
                        onChange={(e) => setAddBackdropPath(e.target.value)}
                        placeholder="VD: /kkcwhgSFd81QDlXo8ytrpHPQjhy.jpg"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all"
                      />
                      <div className="w-20 h-16 shrink-0 rounded-xl overflow-hidden shadow-xs border border-gray-200">
                        <AdminBackdropBanner
                          src={addBackdropPath.trim() ? imageHelper.getBackdropUrl(cleanTmdbPath(addBackdropPath), 'sm') : null}
                          alt="Preview Backdrop"
                          aspectRatio="custom"
                          heightClass="h-full"
                          showOverlay={false}
                          allowZoom={false}
                          fallbackTitle="16:9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Banner Studio */}
                <AdminBannerLivePreview
                  title={addTitle}
                  originalTitle={addOriginalTitle}
                  posterPath={cleanTmdbPath(addPosterPath)}
                  backdropPath={cleanTmdbPath(addBackdropPath)}
                  releaseDate={addReleaseDate}
                  durationMinutes={addDurationMinutes}
                  adult={addAdult}
                  status={addStatus}
                  genres={genres.filter((g) => addSelectedGenreIds.includes(g.id)).map((g) => g.name)}
                  rating={Number(addPopularity) || 8.0}
                />

                {/* Trailer YouTube URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Trailer YouTube URL (trailer_url)</label>
                  <input
                    type="url"
                    value={addTrailerUrl}
                    onChange={(e) => setAddTrailerUrl(e.target.value)}
                    placeholder="VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] transition-all"
                  />
                </div>
              </div>

              {/* KHỐI 3: THÔNG SỐ & PHÂN LOẠI CHI TIẾT */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-gray-200/70 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-[#7C6FE8]" />
                  <span>3. Thông Số & Phân Loại</span>
                </div>

                {/* Duration with quick presets */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Thời Lượng Phim (Phút) *</label>
                    <div className="flex items-center gap-1">
                      {QUICK_DURATIONS.map((dur) => (
                        <button
                          type="button"
                          key={dur}
                          onClick={() => setAddDurationMinutes(dur)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            addDurationMinutes === dur
                              ? 'bg-[#7C6FE8] text-white'
                              : 'bg-white text-slate-600 hover:bg-purple-100 border border-gray-200'
                          }`}
                        >
                          {dur}p
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={addDurationMinutes}
                    onChange={(e) => setAddDurationMinutes(parseInt(e.target.value, 10) || 1)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all"
                  />
                </div>

                {/* Release Date, Language, Popularity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Ngày Khởi Chiếu *</label>
                    <input
                      type="date"
                      value={addReleaseDate}
                      onChange={(e) => setAddReleaseDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Ngôn Ngữ Gốc</label>
                    <select
                      value={addOriginalLanguage}
                      onChange={(e) => setAddOriginalLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all cursor-pointer"
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Popularity Score (Điểm thịnh hành)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={addPopularity}
                      onChange={(e) => setAddPopularity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all"
                    />
                  </div>
                </div>

                {/* Status Segmented Tabs */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700">Trạng Thái Chiếu Phim *</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setAddStatus('now_showing')}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        addStatus === 'now_showing'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Đang Chiếu
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddStatus('upcoming')}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        addStatus === 'upcoming'
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sắp Chiếu
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddStatus('ended')}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        addStatus === 'ended'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ngừng Chiếu
                    </button>
                  </div>
                </div>

                {/* Adult 18+ Toggle Card */}
                <div
                  onClick={() => setAddAdult(!addAdult)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    addAdult
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-white border-gray-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${addAdult ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Phim Giới Hạn Độ Tuổi 18+ (C18 / Adult)</span>
                      <span className="text-[11px] text-slate-400 font-medium">Bật nếu phim có nội dung dành riêng cho người lớn</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${addAdult ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-300'}`}>
                    {addAdult && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Genre Multi-Select Chips */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Thể Loại Phim (Chọn 1 hoặc nhiều) *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSelectAllGenres(false)}
                      className="text-[11px] font-bold text-[#7C6FE8] hover:underline cursor-pointer"
                    >
                      Chọn Tất Cả
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-white border border-gray-200">
                    {genres.map((g) => {
                      const isSelected = addSelectedGenreIds.includes(g.id);
                      return (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() => toggleGenre(g.id, false)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#7C6FE8] text-white shadow-xs'
                              : 'bg-slate-50 text-slate-600 border border-gray-200 hover:border-[#7C6FE8]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{g.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isCreating}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Lưu Phim Mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2.6 Modal Chỉnh Sửa Phim (Tái cấu trúc 3 Phân Khu) */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Chỉnh Sửa Thông Tin Phim</h3>
                  <span className="text-xs text-slate-500 font-medium">ID: {editingMovie.id} • {editingMovie.title}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingMovie(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editErrorMsg}</span>
              </div>
            )}

            {editSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditMovie} className="flex flex-col gap-6">
              {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-gray-200/70 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>1. Thông Tin Cơ Bản</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Tên Phim (Tiếng Việt) *</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Tên Gốc Quốc Tế (original_title)</label>
                    <input
                      type="text"
                      value={editOriginalTitle}
                      onChange={(e) => setEditOriginalTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Tóm Tắt Nội Dung Phim (overview)</label>
                  <textarea
                    value={editOverview}
                    onChange={(e) => setEditOverview(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* KHỐI 2: HÌNH ẢNH & ĐA PHƯƠNG TIỆN (POSTER, BACKDROP & LIVE BANNER STUDIO) */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-gray-200/70 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>2. Hình Ảnh & Đa Phương Tiện</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">Chuẩn TMDB / URL Tuyệt Đối</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Poster Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Poster TMDB Path hoặc URL *</span>
                      <span className="text-[10px] text-blue-600 font-semibold">Tự động format /...</span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="text"
                        value={editPosterPath}
                        onChange={(e) => setEditPosterPath(e.target.value)}
                        required
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <AdminPosterCard
                        src={editPosterPath.trim() ? imageHelper.getPosterUrl(cleanTmdbPath(editPosterPath), 'sm') : null}
                        alt="Preview Poster"
                        size="sm"
                        fallbackText="2:3"
                        className="border border-gray-200"
                      />
                    </div>
                  </div>

                  {/* Backdrop Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Backdrop Banner (16:9)</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Tùy chọn</span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="text"
                        value={editBackdropPath}
                        onChange={(e) => setEditBackdropPath(e.target.value)}
                        placeholder="VD: /kkcwhgSFd81QDlXo8ytrpHPQjhy.jpg"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <div className="w-20 h-16 shrink-0 rounded-xl overflow-hidden shadow-xs border border-gray-200">
                        <AdminBackdropBanner
                          src={editBackdropPath.trim() ? imageHelper.getBackdropUrl(cleanTmdbPath(editBackdropPath), 'sm') : null}
                          alt="Preview Backdrop"
                          aspectRatio="custom"
                          heightClass="h-full"
                          showOverlay={false}
                          allowZoom={false}
                          fallbackTitle="16:9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Banner Studio */}
                <AdminBannerLivePreview
                  title={editTitle}
                  originalTitle={editOriginalTitle}
                  posterPath={cleanTmdbPath(editPosterPath)}
                  backdropPath={cleanTmdbPath(editBackdropPath)}
                  releaseDate={editReleaseDate}
                  durationMinutes={editDurationMinutes}
                  adult={editAdult}
                  status={editStatus}
                  genres={genres.filter((g) => editSelectedGenreIds.includes(g.id)).map((g) => g.name)}
                  rating={Number(editPopularity) || 8.0}
                />

                {/* Trailer YouTube URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Trailer YouTube URL (trailer_url)</label>
                  <input
                    type="url"
                    value={editTrailerUrl}
                    onChange={(e) => setEditTrailerUrl(e.target.value)}
                    placeholder="VD: https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* KHỐI 3: THÔNG SỐ & PHÂN LOẠI */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-gray-200/70 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>3. Thông Số & Phân Loại</span>
                </div>

                {/* Duration with quick presets */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Thời Lượng Phim (Phút) *</label>
                    <div className="flex items-center gap-1">
                      {QUICK_DURATIONS.map((dur) => (
                        <button
                          type="button"
                          key={dur}
                          onClick={() => setEditDurationMinutes(dur)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            editDurationMinutes === dur
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-600 hover:bg-blue-50 border border-gray-200'
                          }`}
                        >
                          {dur}p
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={editDurationMinutes}
                    onChange={(e) => setEditDurationMinutes(parseInt(e.target.value, 10) || 1)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Release Date, Language, Popularity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Ngày Khởi Chiếu *</label>
                    <input
                      type="date"
                      value={editReleaseDate}
                      onChange={(e) => setEditReleaseDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Ngôn Ngữ Gốc</label>
                    <select
                      value={editOriginalLanguage}
                      onChange={(e) => setEditOriginalLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Popularity Score (Điểm thịnh hành)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={editPopularity}
                      onChange={(e) => setEditPopularity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Status Segmented Tabs */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700">Trạng Thái Chiếu Phim *</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setEditStatus('now_showing')}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        editStatus === 'now_showing'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Đang Chiếu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus('upcoming')}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        editStatus === 'upcoming'
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sắp Chiếu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus('ended')}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        editStatus === 'ended'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ngừng Chiếu
                    </button>
                  </div>
                </div>

                {/* Adult 18+ Toggle Card */}
                <div
                  onClick={() => setEditAdult(!editAdult)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    editAdult
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-white border-gray-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${editAdult ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Phim Giới Hạn Độ Tuổi 18+ (C18 / Adult)</span>
                      <span className="text-[11px] text-slate-400 font-medium">Bật nếu phim có nội dung dành riêng cho người lớn</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${editAdult ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-300'}`}>
                    {editAdult && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Genre Multi-Select Chips */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Thể Loại Phim (Chọn từ CSDL) *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSelectAllGenres(true)}
                      className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Chọn Tất Cả
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-white border border-gray-200">
                    {genres.map((g) => {
                      const isSelected = editSelectedGenreIds.includes(g.id);
                      return (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() => toggleGenre(g.id, true)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-50 text-slate-600 border border-gray-200 hover:border-blue-500'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{g.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingMovie(null)}
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2.7 Modal Xác Nhận Xóa Phim */}
      {deletingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="w-full max-w-md bg-white rounded-3xl border border-rose-100 p-6 shadow-2xl flex flex-col gap-4 text-center items-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-base font-extrabold text-slate-900">Xác Nhận Xóa Phim?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Bạn có chắc chắn muốn xóa bộ phim <strong className="text-slate-900 font-bold">&ldquo;{deletingMovie.title}&rdquo;</strong> khỏi hệ thống? Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setDeletingMovie(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Xác Nhận Xóa</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
