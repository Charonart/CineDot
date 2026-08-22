'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  Plus,
  Edit3,
  Trash2,
  Film,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowUpRight,
} from 'lucide-react';
import { useAdminGenres, useGenreMovies } from '../hooks/useAdminGenres';
import { AdminGenreItem } from '../types/adminGenre.types';
import { createGenreSchema } from '../schemas/adminGenre.schema';
import { Skeleton } from '@/shared/ui/Skeleton';
import { AdminPosterCard } from './ui';

export function AdminMovieGenresView() {
  // Search & Pagination States
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Hook 100% Real API
  const {
    genresList,
    pagination,
    isLoading,
    isFetching,
    createGenre,
    isCreating,
    updateGenre,
    isUpdating,
    deleteGenre,
    isDeleting,
  } = useAdminGenres({
    search: searchTerm || undefined,
    page: currentPage,
    limit: 10,
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<AdminGenreItem | null>(null);
  const [deletingGenre, setDeletingGenre] = useState<AdminGenreItem | null>(null);
  const [drilldownGenre, setDrilldownGenre] = useState<AdminGenreItem | null>(null);

  // Form State
  const [addGenreName, setAddGenreName] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const [editGenreName, setEditGenreName] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Drilldown Movies Hook
  const { data: drilldownData, isLoading: isLoadingDrilldown } = useGenreMovies(drilldownGenre?.id || null);

  const handleOpenEdit = (genre: AdminGenreItem) => {
    setEditingGenre(genre);
    setEditGenreName(genre.name);
    setEditError('');
    setEditSuccess('');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    const validation = createGenreSchema.safeParse({ genreName: addGenreName.trim() });
    if (!validation.success) {
      setAddError(validation.error.errors[0]?.message || 'Tên thể loại không hợp lệ');
      return;
    }

    try {
      await createGenre({ genre_name: addGenreName.trim() });
      setAddSuccess(`Đã tạo thành công thể loại "${addGenreName.trim()}"!`);
      setTimeout(() => {
        setIsAddModalOpen(false);
        setAddGenreName('');
        setAddSuccess('');
      }, 1000);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setAddError(errObj?.message || 'Không thể tạo thể loại mới. Có thể tên đã tồn tại!');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGenre) return;
    setEditError('');
    setEditSuccess('');

    const validation = createGenreSchema.safeParse({ genreName: editGenreName.trim() });
    if (!validation.success) {
      setEditError(validation.error.errors[0]?.message || 'Tên thể loại không hợp lệ');
      return;
    }

    try {
      await updateGenre({
        id: editingGenre.id,
        payload: { genre_name: editGenreName.trim() },
      });
      setEditSuccess(`Đã cập nhật thể loại "${editGenreName.trim()}" thành công!`);
      setTimeout(() => {
        setEditingGenre(null);
        setEditSuccess('');
      }, 1000);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setEditError(errObj?.message || 'Không thể cập nhật thể loại.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingGenre) return;
    try {
      await deleteGenre(deletingGenre.id);
      setDeletingGenre(null);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      alert(errObj?.message || 'Không thể xóa thể loại này!');
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Danh Mục Thể Loại Phim
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM THỂ LOẠI MỚI</span>
        </button>
      </div>

      {/* 2. Action Bar (Search + Count) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm thể loại phim..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] shadow-2xs"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 self-end sm:self-auto">
          Tổng số: <strong className="text-slate-900 font-bold">{pagination.totalResults}</strong> thể loại
        </div>
      </div>

      {/* 3. Main Table View */}
      <div className="rounded-3xl bg-white border border-gray-200/90 shadow-sm overflow-hidden flex flex-col relative">
        {isFetching && !isLoading && (
          <div className="absolute top-4 right-6 flex items-center gap-1.5 text-xs font-bold text-[#7C6FE8] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 animate-pulse z-10">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Đang nạp dữ liệu...</span>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                <th className="p-4 rounded-tl-3xl w-[15%]">MÃ ID</th>
                <th className="p-4 w-[50%]">TÊN THỂ LOẠI</th>
                <th className="p-4 w-[20%] text-center">SỐ LƯỢNG PHIM</th>
                <th className="p-4 rounded-tr-3xl text-center w-[15%]">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-4"><Skeleton variant="text" className="w-12 h-4" /></td>
                    <td className="p-4"><Skeleton variant="text" className="w-48 h-5" /></td>
                    <td className="p-4 text-center"><Skeleton variant="text" className="w-20 h-4 mx-auto" /></td>
                    <td className="p-4 text-center"><Skeleton variant="text" className="w-16 h-4 mx-auto" /></td>
                  </tr>
                ))
              ) : genresList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Tag className="w-8 h-8 text-slate-300" />
                      <span className="font-bold text-slate-700">Không tìm thấy thể loại nào</span>
                      <span className="text-[11px] text-slate-400">Thử tìm kiếm với từ khóa khác hoặc bấm Thêm Thể Loại Mới.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                genresList.map((g) => (
                  <tr key={g.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-500">#{g.id}</td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 text-sm">{g.name}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setDrilldownGenre(g)}
                        className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Bấm để xem danh sách phim thuộc thể loại này"
                      >
                        <span>{g.moviesCount} phim</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="p-1.5 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Chỉnh Sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingGenre(g)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Xóa"
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
      </div>

      {/* 4. Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-3xl bg-white border border-gray-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">
            Trang {pagination.currentPage} / {pagination.totalPages} ({pagination.totalResults} thể loại)
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
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-2 rounded-xl bg-slate-50 border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Modal Thêm Mới Thể Loại */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-6 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Thêm Thể Loại Mới</h3>
                    <span className="text-xs text-slate-400">Nhập tên thể loại phim</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              {addSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{addSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Tên Thể Loại *</label>
                  <input
                    type="text"
                    value={addGenreName}
                    onChange={(e) => setAddGenreName(e.target.value)}
                    placeholder="VD: Hành Động, Kinh Dị, Hoạt Hình..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isCreating}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !addGenreName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Tạo Thể Loại</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Modal Chỉnh Sửa Thể Loại */}
      <AnimatePresence>
        {editingGenre && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl border border-blue-100 p-6 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Chỉnh Sửa Thể Loại</h3>
                    <span className="text-xs text-slate-400">ID: #{editingGenre.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditingGenre(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{editSuccess}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Tên Thể Loại *</label>
                  <input
                    type="text"
                    value={editGenreName}
                    onChange={(e) => setEditGenreName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingGenre(null)}
                    disabled={isUpdating}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating || !editGenreName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Lưu Thay Đổi</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Modal Drilldown Xem Danh Sách Phim Thuộc Thể Loại */}
      <AnimatePresence>
        {drilldownGenre && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-3xl border border-purple-100 p-6 shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center font-bold">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Danh Sách Phim: {drilldownGenre.name}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {drilldownData?.totalResults || 0} bộ phim được phân loại
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDrilldownGenre(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingDrilldown ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                  <Loader2 className="w-8 h-8 text-[#7C6FE8] animate-spin" />
                  <span className="text-xs font-medium">Đang nạp danh sách phim...</span>
                </div>
              ) : drilldownData?.movies && drilldownData.movies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                  {drilldownData.movies.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-gray-200 flex items-center gap-3 hover:border-purple-200 transition-colors"
                    >
                      <AdminPosterCard
                        src={m.posterUrl}
                        alt={m.title}
                        size="sm"
                        fallbackText={m.title}
                        className="shrink-0 border border-gray-200 shadow-2xs"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <h4 className="text-xs font-extrabold text-slate-900 truncate">{m.title}</h4>
                        <span className="text-[10px] text-slate-400 truncate italic">{m.originalTitle}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mt-1">
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{m.rating}</span>
                          </span>
                          <span>•</span>
                          <span>{m.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs font-medium">
                  Chưa có bộ phim nào được gán thể loại này trong hệ thống.
                </div>
              )}

              <button
                onClick={() => setDrilldownGenre(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Modal Xác Nhận Xóa */}
      <AnimatePresence>
        {deletingGenre && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl border border-rose-100 p-6 shadow-2xl flex flex-col gap-4 text-center items-center"
            >
              <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-black text-slate-900">Xác Nhận Xóa Thể Loại?</h3>
                <p className="text-xs text-slate-500">
                  Bạn có chắc chắn muốn xóa thể loại <strong className="text-slate-900 font-bold">"{deletingGenre.name}"</strong>?
                  Hành động này không thể hoàn tác.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingGenre(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Xác Nhận Xóa</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
