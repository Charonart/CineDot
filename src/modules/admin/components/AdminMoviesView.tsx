'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Star,
  ExternalLink,
} from 'lucide-react';
import { useAdminMovies, useAdminMovieCredits } from '../hooks/useAdminMovies';
import { adminMovieService } from '../services/adminMovie.service';
import { AdminMovieItem } from '../types/adminMovie.types';
import { createMovieSchema } from '../schemas/adminMovie.schema';
import { AdminTmdbSyncModal } from './modals/AdminTmdbSyncModal';
import { Skeleton } from '@/shared/ui/Skeleton';
import { imageHelper } from '@/shared/utils/imageHelper';
import { AgeRatingBadge } from '@/shared/components/ui/AgeRatingBadge';
import { getAgeRatingInfo } from '@/shared/utils/ageRatingHelper';
import { AdminBackdropBanner, AdminPosterCard, AdminBannerLivePreview } from './ui';
import { CineDataTable, useServerTable } from '@/shared/components/table';
import { CineColumnDef, BulkAction } from '@/shared/types/dataTable.types';

const STATUS_OPTIONS = [
  { id: 'ALL', label: 'Trạng thái: Tất cả', apiKey: undefined },
  { id: 'now_showing', label: 'Đang chiếu (now_showing)', apiKey: 'now_showing' },
  { id: 'upcoming', label: 'Sắp chiếu (upcoming)', apiKey: 'upcoming' },
  { id: 'ended', label: 'Ngừng chiếu (ended)', apiKey: 'ended' },
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
  const tmdbMatch = trimmed.match(/image\.tmdb\.org\/t\/p\/[^/]+(\/.+)/i);
  if (tmdbMatch && tmdbMatch[1]) {
    return tmdbMatch[1];
  }
  return trimmed;
}

export function AdminMoviesView() {
  // Hook 100% Real API
  const {
    genres,
    createMovie,
    isCreating,
    updateMovie,
    isUpdating,
    deleteMovie,
    isDeleting,
    updateCell,
    bulkAction,
  } = useAdminMovies();

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
  const [addAgeRating, setAddAgeRating] = useState('P');
  const [addPopularity, setAddPopularity] = useState<number | string>(10);
  const [addStatus, setAddStatus] = useState<'now_showing' | 'upcoming' | 'ended'>('now_showing');
  const [addSelectedGenreIds, setAddSelectedGenreIds] = useState<number[]>([1]);
  const [addPosterPath, setAddPosterPath] = useState('');
  const [addBackdropPath, setAddBackdropPath] = useState('');
  const [addTrailerUrl, setAddTrailerUrl] = useState('');
  const [addImdbId, setAddImdbId] = useState('');
  const [addRating, setAddRating] = useState<number | string>(0);
  const [addVoteCount, setAddVoteCount] = useState<number | string>(0);
  const [addErrorMsg, setAddErrorMsg] = useState('');
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  // Form States for Edit
  const [editTitle, setEditTitle] = useState('');
  const [editOriginalTitle, setEditOriginalTitle] = useState('');
  const [editOverview, setEditOverview] = useState('');
  const [editReleaseDate, setEditReleaseDate] = useState('');
  const [editDurationMinutes, setEditDurationMinutes] = useState(120);
  const [editOriginalLanguage, setEditOriginalLanguage] = useState('vi');
  const [editAgeRating, setEditAgeRating] = useState('P');
  const [editPopularity, setEditPopularity] = useState<number | string>(10);
  const [editStatus, setEditStatus] = useState<'now_showing' | 'upcoming' | 'ended'>('now_showing');
  const [editSelectedGenreIds, setEditSelectedGenreIds] = useState<number[]>([]);
  const [editPosterPath, setEditPosterPath] = useState('');
  const [editBackdropPath, setEditBackdropPath] = useState('');
  const [editTrailerUrl, setEditTrailerUrl] = useState('');
  const [editImdbId, setEditImdbId] = useState('');
  const [editRating, setEditRating] = useState<number | string>(0);
  const [editVoteCount, setEditVoteCount] = useState<number | string>(0);
  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  // Credits hook for detail view
  const { credits, isLoadingCredits } = useAdminMovieCredits(viewingMovie?.id || null);

  // Pre-fill Edit Modal Form
  const handleOpenEditModal = (movie: AdminMovieItem) => {
    setEditingMovie(movie);
    setEditTitle(movie.title);
    setEditOriginalTitle(movie.originalTitle || movie.title);
    setEditOverview(movie.overview || '');
    setEditReleaseDate(movie.releaseDate || new Date().toISOString().split('T')[0]);
    setEditDurationMinutes(movie.durationMinutes || 120);
    setEditOriginalLanguage(movie.originalLanguage || 'vi');
    setEditAgeRating(movie.ageRating || 'P');
    setEditPopularity(movie.popularity ?? 10);
    setEditImdbId(movie.imdbId || '');
    setEditRating(movie.rating || 0);
    setEditVoteCount(movie.voteCount || 0);
    
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
      ageRating: addAgeRating,
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
        age_rating: addAgeRating,
        ageRating: addAgeRating,
        popularity: Number(addPopularity) || 0,
        duration_minutes: Number(addDurationMinutes),
        status: addStatus,
        genre_ids: addSelectedGenreIds,
        poster_path: cleanedPoster,
        backdrop_path: cleanedBackdrop || undefined,
        trailer_url: addTrailerUrl.trim() || undefined,
        imdb_id: addImdbId.trim() || undefined,
        vote_average: Number(addRating) || 0,
        vote_count: Number(addVoteCount) || 0,
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
        setAddImdbId('');
        setAddRating(0);
        setAddVoteCount(0);
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
          age_rating: editAgeRating,
          ageRating: editAgeRating,
          popularity: Number(editPopularity) || 0,
          duration_minutes: Number(editDurationMinutes),
          status: editStatus,
          genre_ids: editSelectedGenreIds,
          poster_path: cleanedPoster || undefined,
          backdrop_path: cleanedBackdrop || undefined,
          trailer_url: editTrailerUrl.trim() || undefined,
          imdb_id: editImdbId.trim() || undefined,
          vote_average: Number(editRating) || 0,
          vote_count: Number(editVoteCount) || 0,
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

  // ── CineColumnDef for Admin Movie Grid ──
  const columns: CineColumnDef<AdminMovieItem>[] = useMemo(
    () => [
      {
        key: 'poster_url',
        title: 'Phim',
        minWidth: 260,
        dataType: 'custom',
        cell: ({ row }: { row: AdminMovieItem }) => (
          <div className="flex items-center gap-3">
            <AdminPosterCard
              src={row.posterUrl}
              alt={row.title}
              size="sm"
              ageRating={row.ageRating}
              fallbackText={row.title}
              className="shrink-0 border border-gray-200 shadow-xs"
            />
            <div className="flex flex-col gap-0.5 max-w-[200px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3
                  onClick={() => setViewingMovie(row)}
                  className="font-extrabold text-sm text-slate-900 line-clamp-1 hover:text-[#7C6FE8] cursor-pointer"
                >
                  {row.title}
                </h3>
                <AgeRatingBadge ageRating={row.ageRating} size="xs" variant="solid" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium line-clamp-1 italic">
                {row.originalTitle}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'genre',
        title: 'Thể Loại',
        dataType: 'select',
        filterable: true,
        options: genres.map((g: { id: number; name: string }) => ({ label: g.name, value: g.name })),
        cell: ({ row }: { row: AdminMovieItem }) => (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {row.genre.slice(0, 2).map((g: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
              >
                {g}
              </span>
            ))}
            {row.genre.length > 2 && (
              <span className="text-[10px] text-slate-400 font-bold">+{row.genre.length - 2}</span>
            )}
          </div>
        ),
      },
      {
        key: 'duration',
        title: 'Thời Lượng',
        dataType: 'text',
        sortable: true,
        filterable: true,
        editable: true,
        cell: ({ value }: { value: any }) => <span className="font-bold text-slate-800">{value}</span>,
      },
      {
        key: 'release_date',
        title: 'Khởi Chiếu',
        dataType: 'date',
        sortable: true,
        filterable: true,
        editable: true,
        cell: ({ row }: { row: AdminMovieItem }) => <span className="font-mono text-slate-600">{row.releaseDate}</span>,
      },
      {
        key: 'original_language',
        title: 'Ngôn Ngữ',
        dataType: 'select',
        options: LANGUAGE_OPTIONS.map((l) => ({ label: l.label, value: l.code })),
        cell: ({ row }: { row: AdminMovieItem }) => (
          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
            {row.originalLanguage || 'vi'}
          </span>
        ),
      },
      {
        key: 'status',
        title: 'Trạng Thái',
        dataType: 'badge',
        sortable: true,
        filterable: true,
        editable: true,
        options: [
          { label: 'Đang chiếu', value: 'now_showing', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Sắp chiếu', value: 'upcoming', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
          { label: 'Ngừng chiếu', value: 'ended', badgeClass: 'bg-slate-100 text-slate-600 border-gray-200' },
        ],
        cell: ({ row }: { row: AdminMovieItem }) => {
          if (row.status === 'now_showing') {
            return (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                Đang chiếu
              </span>
            );
          }
          if (row.status === 'upcoming') {
            return (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">
                Sắp chiếu
              </span>
            );
          }
          return (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold border border-gray-200">
              Ngừng chiếu
            </span>
          );
        },
      },
      {
        key: 'vote_average',
        title: 'Điểm IMDb',
        dataType: 'text',
        sortable: true,
        filterable: true,
        width: 140,
        cell: ({ row }: { row: AdminMovieItem }) => (
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight shadow-2xs">
              IMDb
            </span>
            {row.rating > 0 ? (
              <span className="font-extrabold text-xs text-slate-800">
                {row.rating.toFixed(1)}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 italic">Chưa có đánh giá</span>
            )}
            {row.imdbId && (
              <a
                href={row.imdbUrl || `https://www.imdb.com/title/${row.imdbId}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-[#7C6FE8] transition-colors"
                title={`Mã IMDb: ${row.imdbId} - Mở trang IMDb`}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ),
      },
      {
        key: 'age_rating',
        title: 'Độ Tuổi',
        dataType: 'select',
        options: [
          { label: 'P - Mọi lứa tuổi', value: 'P' },
          { label: 'K - Dưới 13T có GH', value: 'K' },
          { label: 'T13 - Từ 13 tuổi', value: 'T13' },
          { label: 'T16 - Từ 16 tuổi', value: 'T16' },
          { label: 'T18 - Từ 18 tuổi', value: 'T18' },
        ],
        sortable: true,
        filterable: true,
        width: 110,
        cell: ({ row }: { row: AdminMovieItem }) => (
          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
            <AgeRatingBadge ageRating={row.ageRating} size="xs" variant="solid" showTooltip />
          </div>
        ),
      },
      {
        key: 'actions',
        title: 'Thao Tác',
        width: 120,
        align: 'center',
        cell: ({ row }: { row: AdminMovieItem }) => (
          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewingMovie(row)}
              className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-500 hover:text-[#7C6FE8] transition-colors cursor-pointer"
              title="Xem Chi Tiết"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenEditModal(row)}
              className="p-1.5 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              title="Chỉnh Sửa"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeletingMovie(row)}
              className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              title="Xóa Phim"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [genres]
  );

  // ── Hook: Server Table Controller with URL Sync ──
  const table = useServerTable<AdminMovieItem>({
    queryKey: ['admin', 'movies'],
    fetcher: (params) => adminMovieService.getMovies(params),
    updateCell: (id, field, value) => updateCell({ id, field, value }),
    bulkAction: (action, ids) => bulkAction({ action: action as any, ids }),
    columns,
    exportFileName: 'danh_sach_phim_cinedot',
    defaultPerPage: 15,
  });

  // ── Bulk Actions for Movie Grid ──
  const bulkActions: BulkAction<AdminMovieItem>[] = useMemo(
    () => [
      {
        key: 'set_now_showing',
        label: 'Chuyển Đang Chiếu',
        variant: 'primary',
        onClick: async (selectedRows: AdminMovieItem[], ids: (string | number)[]) => {
          await table.handleBulkAction('set_now_showing');
        },
      },
      {
        key: 'set_upcoming',
        label: 'Chuyển Sắp Chiếu',
        variant: 'default',
        onClick: async (selectedRows: AdminMovieItem[], ids: (string | number)[]) => {
          await table.handleBulkAction('set_upcoming');
        },
      },
      {
        key: 'delete',
        label: 'Xóa Phim Đã Chọn',
        variant: 'danger',
        icon: <Trash2 className="w-3.5 h-3.5" />,
        onClick: async (selectedRows: AdminMovieItem[], ids: (string | number)[]) => {
          if (confirm(`Bạn có chắc chắn muốn xóa ${ids.length} bộ phim đã chọn không?`)) {
            await table.handleBulkAction('delete');
          }
        },
      },
    ],
    [table]
  );

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Universal Notion/Sheets CineDataTable */}
      <CineDataTable<AdminMovieItem>
        table={table}
        title="Quản Lý Danh Sách Phim"
        icon={<Film className="w-6 h-6 text-[#7C6FE8]" />}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTmdbModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] border border-purple-200 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              title="Tự động đồng bộ thông tin phim từ TMDB"
            >
              <Sparkles className="w-4 h-4" />
              <span>ĐỒNG BỘ TMDB</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>THÊM PHIM MỚI</span>
            </button>
          </div>
        }
        bulkActions={bulkActions}
        exportFileName="danh_sach_phim_cinedot"
      />

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
                viewingMovie.status === 'now_showing'
                  ? 'Đang Chiếu'
                  : viewingMovie.status === 'upcoming'
                  ? 'Sắp Chiếu'
                  : 'Ngừng Chiếu'
              }
              badgeColor={
                viewingMovie.status === 'now_showing'
                  ? 'bg-[#7C6FE8]'
                  : viewingMovie.status === 'upcoming'
                  ? 'bg-amber-500'
                  : 'bg-slate-600'
              }
              fallbackTitle={`Backdrop: ${viewingMovie.title}`}
              overlayContent={
                <div className="flex items-center gap-2">
                  <AgeRatingBadge ageRating={viewingMovie.ageRating} size="sm" variant="solid" />
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
                ageRating={viewingMovie.ageRating}
                rounded="2xl"
                fallbackText={viewingMovie.title}
                className="shadow-xl border border-gray-200 shrink-0 self-center sm:self-start"
              />

              <div className="flex flex-col gap-4 flex-1">
                {/* Information Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs bg-slate-50 p-4 rounded-2xl border border-gray-100">
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
                      <ShieldAlert className="w-3 h-3" /> Độ tuổi
                    </span>
                    <div className="mt-0.5">
                      <AgeRatingBadge ageRating={viewingMovie.ageRating} size="xs" variant="solid" />
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">IMDb</span> Đánh giá
                    </span>
                    <span className="font-black text-amber-600">
                      {viewingMovie.rating > 0 ? `${viewingMovie.rating.toFixed(1)}/10` : 'Chưa có đánh giá'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Mã IMDb
                    </span>
                    {viewingMovie.imdbId ? (
                      <a
                        href={viewingMovie.imdbUrl || `https://www.imdb.com/title/${viewingMovie.imdbId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#7C6FE8] hover:underline flex items-center gap-1"
                      >
                        <span>{viewingMovie.imdbId}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="font-medium text-slate-400">—</span>
                    )}
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
                  ageRating={addAgeRating}
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

                {/* Release Date, Age Rating, Language, Popularity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Độ Tuổi *</span>
                      <AgeRatingBadge ageRating={addAgeRating} size="xs" variant="solid" />
                    </label>
                    <select
                      value={addAgeRating}
                      onChange={(e) => setAddAgeRating(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all cursor-pointer"
                    >
                      <option value="P">P — Mọi lứa tuổi (Phổ biến)</option>
                      <option value="K">K — Dưới 13T có người giám hộ</option>
                      <option value="T13">T13 — Khán giả từ đủ 13 tuổi (13+)</option>
                      <option value="T16">T16 — Khán giả từ đủ 16 tuổi (16+)</option>
                      <option value="T18">T18 — Khán giả từ đủ 18 tuổi (18+)</option>
                    </select>
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
                    <label className="text-xs font-bold text-slate-700">Popularity (Điểm nổi bật)</label>
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

                {/* IMDb Rating & ID Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">IMDb</span>
                      <span>Mã IMDb (imdb_id)</span>
                    </label>
                    <input
                      type="text"
                      value={addImdbId}
                      onChange={(e) => setAddImdbId(e.target.value)}
                      placeholder="VD: tt10872600"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">IMDb</span>
                      <span>Điểm đánh giá (0 - 10)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={addRating}
                      onChange={(e) => setAddRating(e.target.value)}
                      placeholder="VD: 8.5"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">IMDb</span>
                      <span>Số lượt vote</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addVoteCount}
                      onChange={(e) => setAddVoteCount(e.target.value)}
                      placeholder="VD: 125000"
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
                  ageRating={editAgeRating}
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

                {/* Release Date, Age Rating, Language, Popularity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Độ Tuổi *</span>
                      <AgeRatingBadge ageRating={editAgeRating} size="xs" variant="solid" />
                    </label>
                    <select
                      value={editAgeRating}
                      onChange={(e) => setEditAgeRating(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="P">P — Mọi lứa tuổi (Phổ biến)</option>
                      <option value="K">K — Dưới 13T có người giám hộ</option>
                      <option value="T13">T13 — Khán giả từ đủ 13 tuổi (13+)</option>
                      <option value="T16">T16 — Khán giả từ đủ 16 tuổi (16+)</option>
                      <option value="T18">T18 — Khán giả từ đủ 18 tuổi (18+)</option>
                    </select>
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
                    <label className="text-xs font-bold text-slate-700">Popularity (Điểm nổi bật)</label>
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

                {/* IMDb Rating & ID Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">IMDb</span>
                      <span>Mã IMDb (imdb_id)</span>
                    </label>
                    <input
                      type="text"
                      value={editImdbId}
                      onChange={(e) => setEditImdbId(e.target.value)}
                      placeholder="VD: tt10872600"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">IMDb</span>
                      <span>Điểm đánh giá (0 - 10)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={editRating}
                      onChange={(e) => setEditRating(e.target.value)}
                      placeholder="VD: 8.5"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">IMDb</span>
                      <span>Số lượt vote</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editVoteCount}
                      onChange={(e) => setEditVoteCount(e.target.value)}
                      placeholder="VD: 125000"
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
