'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Film,
  Plus,
  Star,
  Clock,
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
  Calendar,
  AlertTriangle,
  Play,
  Tv,
  Tag,
  Info,
} from 'lucide-react';
import { MOCK_MOVIES_LISTING } from '@/modules/movies-listing/mocks/mockMoviesListingData';
import { MovieListingItem } from '@/modules/movies-listing/types/movies-listing.types';

const STATUS_OPTIONS = [
  { id: 'ALL', label: 'Trạng thái: Tất cả' },
  { id: 'NOW_SHOWING', label: 'Đang chiếu' },
  { id: 'COMING_SOON', label: 'Sắp chiếu' },
];

export function AdminMoviesView() {
  const [moviesList, setMoviesList] = useState<MovieListingItem[]>(MOCK_MOVIES_LISTING);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NOW_SHOWING' | 'COMING_SOON'>('ALL');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingMovie, setViewingMovie] = useState<MovieListingItem | null>(null);
  const [editingMovie, setEditingMovie] = useState<MovieListingItem | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<MovieListingItem | null>(null);

  // Form States for Add
  const [addTitle, setAddTitle] = useState('');
  const [addOriginalTitle, setAddOriginalTitle] = useState('');
  const [addGenreStr, setAddGenreStr] = useState('Hành Động, Viễn Tưởng');
  const [addDuration, setAddDuration] = useState('120 phút');
  const [addRating, setAddRating] = useState(4.8);
  const [addAgeRating, setAddAgeRating] = useState<'P' | 'K' | 'C13' | 'C16' | 'C18'>('C16');
  const [addFormatBadge, setAddFormatBadge] = useState('IMAX 3D');
  const [addStatus, setAddStatus] = useState<'NOW_SHOWING' | 'COMING_SOON'>('NOW_SHOWING');
  const [addPosterUrl, setAddPosterUrl] = useState('');
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  // Form States for Edit
  const [editTitle, setEditTitle] = useState('');
  const [editOriginalTitle, setEditOriginalTitle] = useState('');
  const [editGenreStr, setEditGenreStr] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editReleaseDate, setEditReleaseDate] = useState('');
  const [editRating, setEditRating] = useState(4.8);
  const [editAgeRating, setEditAgeRating] = useState<'P' | 'K' | 'C13' | 'C16' | 'C18'>('C16');
  const [editFormatBadge, setEditFormatBadge] = useState('IMAX 3D');
  const [editStatus, setEditStatus] = useState<'NOW_SHOWING' | 'COMING_SOON'>('NOW_SHOWING');
  const [editPosterUrl, setEditPosterUrl] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

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

  // Filter movies
  const filteredMovies = moviesList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genre.join(' ').toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && m.status === statusFilter;
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE) || 1;
  const currentMovies = filteredMovies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Pre-fill Edit Modal Form
  const handleOpenEditModal = (movie: MovieListingItem) => {
    setEditingMovie(movie);
    setEditTitle(movie.title);
    setEditOriginalTitle(movie.originalTitle || movie.title);
    setEditGenreStr(movie.genre.join(', '));
    setEditDuration(movie.duration);
    setEditReleaseDate(movie.releaseDate);
    setEditRating(movie.rating);
    setEditAgeRating((movie.ageRating as any) || 'C16');
    setEditFormatBadge(movie.formatBadge || 'IMAX 3D');
    setEditStatus(movie.status);
    setEditPosterUrl(movie.posterUrl);
    setEditSuccessMsg('');
  };

  // Submit Add Movie
  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim()) return;

    const newMovie: MovieListingItem = {
      id: 'm-' + Date.now(),
      slug: addTitle.toLowerCase().replace(/ /g, '-'),
      title: addTitle.trim(),
      originalTitle: addOriginalTitle.trim() || addTitle.trim(),
      posterUrl: addPosterUrl.trim() || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
      trailerUrl: 'https://youtube.com',
      formatBadge: addFormatBadge,
      ageRating: addAgeRating,
      genre: addGenreStr.split(',').map((g) => g.trim()),
      duration: addDuration,
      releaseDate: new Date().toLocaleDateString('vi-VN'),
      rating: Number(addRating),
      status: addStatus,
      isHot: true,
    };

    setMoviesList([newMovie, ...moviesList]);
    setAddSuccessMsg(`Đã thêm thành công phim "${addTitle}" vào danh sách!`);
    setTimeout(() => {
      setIsAddModalOpen(false);
      setAddTitle('');
      setAddOriginalTitle('');
      setAddPosterUrl('');
      setAddSuccessMsg('');
    }, 1200);
  };

  // Submit Edit Movie
  const handleSaveEditMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie || !editTitle.trim()) return;

    const updatedList = moviesList.map((m) => {
      if (m.id === editingMovie.id) {
        return {
          ...m,
          title: editTitle.trim(),
          originalTitle: editOriginalTitle.trim(),
          genre: editGenreStr.split(',').map((g) => g.trim()),
          duration: editDuration.trim(),
          releaseDate: editReleaseDate.trim(),
          rating: Number(editRating),
          ageRating: editAgeRating,
          formatBadge: editFormatBadge,
          status: editStatus,
          posterUrl: editPosterUrl.trim(),
        };
      }
      return m;
    });

    setMoviesList(updatedList);
    setEditSuccessMsg(`Đã cập nhật thông tin phim "${editTitle}" thành công!`);
    setTimeout(() => {
      setEditingMovie(null);
      setEditSuccessMsg('');
    }, 1200);
  };

  // Confirm Delete Movie
  const handleConfirmDelete = () => {
    if (!deletingMovie) return;
    setMoviesList(moviesList.filter((m) => m.id !== deletingMovie.id));
    setDeletingMovie(null);
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
            Cập nhật và quản lý kho phim trên toàn hệ thống CineDot
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm phim..."
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
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-purple-100 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(124,111,232,0.15)] z-50 flex flex-col gap-0.5"
              >
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = statusFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setStatusFilter(opt.id as any);
                        setIsStatusDropdownOpen(false);
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

          {/* Clean Primary Add Button */}
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
      <div className="rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                <th className="p-4 rounded-tl-3xl w-[35%] whitespace-nowrap">PHIM</th>
                <th className="p-4 w-[12%] whitespace-nowrap">THỜI LƯỢNG</th>
                <th className="p-4 w-[13%] whitespace-nowrap">KHỞI CHIẾU</th>
                <th className="p-4 w-[12%] whitespace-nowrap">ĐÁNH GIÁ</th>
                <th className="p-4 w-[13%] whitespace-nowrap">TRẠNG THÁI</th>
                <th className="p-4 rounded-tr-3xl text-center w-[15%] whitespace-nowrap">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {currentMovies.length > 0 ? (
                currentMovies.map((m) => (
                  <tr key={m.id} className="hover:bg-purple-50/30 transition-colors">
                    {/* Column 1: PHIM (Poster + Title + Genre) */}
                    <td className="p-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-14 h-20 rounded-2xl object-cover shrink-0 border border-gray-200 shadow-xs"
                        />
                        <div className="flex flex-col gap-1">
                          <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{m.title}</h3>
                          <span className="text-[12px] text-slate-500 font-medium line-clamp-1">
                            {m.genre.join(', ')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: THỜI LƯỢNG */}
                    <td className="p-4 text-slate-800 font-bold whitespace-nowrap">{m.duration}</td>

                    {/* Column 3: KHỞI CHIẾU */}
                    <td className="p-4 text-slate-600 font-mono whitespace-nowrap">{m.releaseDate}</td>

                    {/* Column 4: ĐÁNH GIÁ */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full text-amber-700 font-extrabold text-xs border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{m.rating} ★</span>
                      </span>
                    </td>

                    {/* Column 5: TRẠNG THÁI */}
                    <td className="p-4 whitespace-nowrap">
                      {m.status === 'NOW_SHOWING' ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200">
                          Đang chiếu
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-extrabold border border-indigo-200">
                          Sắp chiếu
                        </span>
                      )}
                    </td>

                    {/* Column 6: THAO TÁC */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingMovie(m)}
                          className="p-2 rounded-xl hover:bg-purple-50 text-slate-500 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                          title="Xem Chi Tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(m)}
                          className="p-2 rounded-xl hover:bg-purple-50 text-slate-500 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                          title="Chỉnh Sửa Phim"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingMovie(m)}
                          className="p-2 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Xóa Phim"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs font-bold">
                    Không tìm thấy phim phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 2.3 Pagination Bar */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-500 bg-slate-50/50">
          <span>
            Hiển thị <strong className="text-slate-900">{currentMovies.length}</strong> từ <strong className="text-slate-900">{filteredMovies.length}</strong> phim
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-xl border border-gray-200 hover:bg-white text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  currentPage === p
                    ? 'bg-[#7C6FE8] text-white shadow-md'
                    : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-xl border border-gray-200 hover:bg-white text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 👁️ MODAL 1: XEM CHI TIẾT PHIM */}
      {viewingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Chi Tiết Tác Phẩm Điện Ảnh</h3>
              </div>
              <button
                onClick={() => setViewingMovie(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={viewingMovie.posterUrl}
                alt={viewingMovie.title}
                className="w-full sm:w-48 h-64 object-cover rounded-2xl border border-gray-200 shadow-md shrink-0"
              />

              <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8] font-extrabold text-[11px] border border-purple-200">
                    {viewingMovie.formatBadge || 'IMAX 3D'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-extrabold text-[11px] border border-amber-200">
                    {viewingMovie.ageRating || 'C16'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
                    {viewingMovie.status === 'NOW_SHOWING' ? 'Đang chiếu' : 'Sắp chiếu'}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900">{viewingMovie.title}</h2>
                <span className="text-xs font-semibold text-slate-500 italic">
                  {viewingMovie.originalTitle || viewingMovie.title}
                </span>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-700 mt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Thể loại</span>
                    <strong className="text-slate-900">{viewingMovie.genre.join(', ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Thời lượng</span>
                    <strong className="text-slate-900">{viewingMovie.duration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Khởi chiếu</span>
                    <strong className="text-slate-900">{viewingMovie.releaseDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Đánh giá</span>
                    <strong className="text-amber-500">{viewingMovie.rating} ★ / 5.0</strong>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs text-slate-600 font-medium">
                  <span className="font-extrabold text-slate-900">Tóm tắt nội dung:</span>
                  <p className="leading-relaxed">
                    Tác phẩm bom tấn hành động viễn tưởng đỉnh cao, được trang bị định dạng công nghệ màn hình siêu lớn IMAX cùng hệ thống âm thanh vòm sống động mang lại trải nghiệm mãn nhãn nhất tại các cụm rạp CineDot.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setViewingMovie(null)}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ MODAL 2: CHỈNH SỬA PHIM */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Chỉnh Sửa Thông Tin Phim</h3>
              </div>
              <button
                onClick={() => setEditingMovie(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditMovie} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Tên phim (Tiếng Việt)</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Tên gốc (Tiếng Anh)</label>
                  <input
                    type="text"
                    value={editOriginalTitle}
                    onChange={(e) => setEditOriginalTitle(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Thể loại (Phân cách dấu phẩy)</label>
                  <input
                    type="text"
                    value={editGenreStr}
                    onChange={(e) => setEditGenreStr(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Thời lượng</label>
                  <input
                    type="text"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Độ tuổi khán giả</label>
                  <select
                    value={editAgeRating}
                    onChange={(e) => setEditAgeRating(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="P">P - Mọi lứa tuổi</option>
                    <option value="K">K - Dưới 13t cần giám hộ</option>
                    <option value="C13">C13 - Dành cho 13t+</option>
                    <option value="C16">C16 - Dành cho 16t+</option>
                    <option value="C18">C18 - Dành cho 18t+</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Định dạng chiếu</label>
                  <select
                    value={editFormatBadge}
                    onChange={(e) => setEditFormatBadge(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="IMAX 3D">IMAX 3D Laser</option>
                    <option value="4DX">4DX Motion</option>
                    <option value="Gold Class">Gold Class VIP</option>
                    <option value="2D Standard">2D Standard</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Trạng thái rạp</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="NOW_SHOWING">Đang chiếu</option>
                    <option value="COMING_SOON">Sắp chiếu</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Poster Image URL</label>
                <input
                  type="url"
                  value={editPosterUrl}
                  onChange={(e) => setEditPosterUrl(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingMovie(null)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  LƯU CẬP NHẬT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🗑️ MODAL 3: XÁC NHẬN XÓA PHIM */}
      {deletingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-extrabold text-slate-900">Xác Nhận Xóa Tác Phẩm</h3>
                <span className="text-xs text-rose-600 font-bold">Hành động này không thể hoàn tác</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
              Bạn có chắc chắn muốn xóa phim <strong className="text-slate-900 font-extrabold">"{deletingMovie.title}"</strong> khỏi dữ liệu hệ thống không?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMovie(null)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                XÁC NHẬN XÓA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ MODAL 4: THÊM PHIM MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Thêm Phim Mới Vào Hệ Thống</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{addSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddMovie} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Tên phim (Tiếng Việt)</label>
                <input
                  type="text"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  placeholder="Ví dụ: Avatar 3: The Seed Bearer"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Thể loại</label>
                  <input
                    type="text"
                    value={addGenreStr}
                    onChange={(e) => setAddGenreStr(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Thời lượng</label>
                  <input
                    type="text"
                    value={addDuration}
                    onChange={(e) => setAddDuration(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Phân loại độ tuổi</label>
                  <select
                    value={addAgeRating}
                    onChange={(e) => setAddAgeRating(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="P">P - Mọi lứa tuổi</option>
                    <option value="K">K - Dưới 13t cần giám hộ</option>
                    <option value="C13">C13 - Dành cho 13t+</option>
                    <option value="C16">C16 - Dành cho 16t+</option>
                    <option value="C18">C18 - Dành cho 18t+</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Định dạng chiếu</label>
                  <select
                    value={addFormatBadge}
                    onChange={(e) => setAddFormatBadge(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="IMAX 3D">IMAX 3D Laser</option>
                    <option value="4DX">4DX Motion</option>
                    <option value="Gold Class">Gold Class VIP</option>
                    <option value="2D Standard">2D Standard</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Đường dẫn Poster Image URL</label>
                <input
                  type="url"
                  value={addPosterUrl}
                  onChange={(e) => setAddPosterUrl(e.target.value)}
                  placeholder="https://..."
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  LƯU PHIM MỚI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
