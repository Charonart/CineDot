'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  X,
  Check,
  Loader2,
  Lock,
  Clock,
  Search,
  Building2,
  Film,
} from 'lucide-react';
import {
  AdminMovieOption,
  AdminRoomOption,
  AdminShowtimeGridItem,
} from '../../types/adminShowtime.types';

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesToTime(minutes: number): string {
  const h = Math.floor((minutes / 60) % 24);
  const m = Math.floor(minutes % 60);
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
}

const QUICK_START_TIMES = ['09:30', '11:45', '14:00', '16:30', '19:15', '21:45'];
const QUICK_PRICES = [80000, 95000, 110000, 135000, 160000];

interface ShowtimeModalsProps {
  // Add Modal
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onSubmitCreate: (e: React.FormEvent) => void;
  isCreating: boolean;
  movies: AdminMovieOption[];
  rooms: AdminRoomOption[];
  existingShowtimes?: AdminShowtimeGridItem[];
  addMovieId?: number;
  setAddMovieId: (id: number) => void;
  addRoomId?: number;
  setAddRoomId: (id: number) => void;
  addStartTime: string;
  setAddStartTime: (time: string) => void;
  calculatedEndTime: string;
  addPrice: number;
  setAddPrice: (price: number) => void;
  addBufferMinutes: number;
  setAddBufferMinutes: (buffer: number) => void;

  // Edit Modal
  isEditModalOpen: boolean;
  onCloseEditModal: () => void;
  onSubmitEdit: (e: React.FormEvent) => void;
  isUpdating: boolean;
  editingShowtime: AdminShowtimeGridItem | null;
  editStartTime: string;
  setEditStartTime: (time: string) => void;
  editPrice: number;
  setEditPrice: (price: number) => void;
  editBufferMinutes: number;
  setEditBufferMinutes: (buffer: number) => void;

  // Delete Modal
  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
  deletingShowtime: AdminShowtimeGridItem | null;

  // Clone Modal
  isCloneModalOpen: boolean;
  onCloseCloneModal: () => void;
  onSubmitClone: (e: React.FormEvent) => void;
  isCloning: boolean;
  selectedDateKey: string;
  cloneTargetDate: string;
  setCloneTargetDate: (date: string) => void;

  // View Detail Modal
  viewingShowtime: AdminShowtimeGridItem | null;
  onCloseViewModal: () => void;
  onOpenEditFromView?: (st: AdminShowtimeGridItem) => void;
  onOpenDeleteFromView?: (st: AdminShowtimeGridItem) => void;
}

export function ShowtimeModals({
  isAddModalOpen,
  onCloseAddModal,
  onSubmitCreate,
  isCreating,
  movies,
  rooms,
  existingShowtimes = [],
  addMovieId,
  setAddMovieId,
  addRoomId,
  setAddRoomId,
  addStartTime,
  setAddStartTime,
  calculatedEndTime,
  addPrice,
  setAddPrice,
  addBufferMinutes,
  setAddBufferMinutes,

  isEditModalOpen,
  onCloseEditModal,
  onSubmitEdit,
  isUpdating,
  editingShowtime,
  editStartTime,
  setEditStartTime,
  editPrice,
  setEditPrice,
  editBufferMinutes,
  setEditBufferMinutes,

  isDeleteModalOpen,
  onCloseDeleteModal,
  onConfirmDelete,
  isDeleting,
  deletingShowtime,

  isCloneModalOpen,
  onCloseCloneModal,
  onSubmitClone,
  isCloning,
  selectedDateKey,
  cloneTargetDate,
  setCloneTargetDate,

  viewingShowtime,
  onCloseViewModal,
  onOpenEditFromView,
  onOpenDeleteFromView,
}: ShowtimeModalsProps) {
  const [movieSearch, setMovieSearch] = useState('');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const selectedMovie = useMemo(() => {
    return movies.find((m) => m.id === addMovieId) || movies[0] || null;
  }, [movies, addMovieId]);

  const modalFilteredMovies = useMemo(() => {
    if (!movieSearch.trim()) return movies;
    const q = movieSearch.toLowerCase();
    return movies.filter((m) => m.title.toLowerCase().includes(q) || m.genres.some((g) => g.toLowerCase().includes(q)));
  }, [movies, movieSearch]);

  const conflictInfo = useMemo(() => {
    if (!addRoomId || !addStartTime || !selectedMovie) return null;

    const startM = timeToMinutes(addStartTime);
    const duration = selectedMovie.duration || 120;
    const totalEndM = startM + duration + addBufferMinutes;

    const conflicts = existingShowtimes.filter((st) => {
      if (st.roomId !== addRoomId) return false;
      const stTotalEndM = st.endMinutes + st.cleaningBufferMinutes;
      return startM < stTotalEndM && totalEndM > st.startMinutes;
    });

    return conflicts.length > 0 ? conflicts[0] : null;
  }, [existingShowtimes, addRoomId, addStartTime, selectedMovie, addBufferMinutes]);

  const latestRoomEndTime = useMemo(() => {
    if (!addRoomId) return null;
    const roomShowtimes = existingShowtimes.filter((st) => st.roomId === addRoomId);
    if (roomShowtimes.length === 0) return null;
    const maxEnd = Math.max(...roomShowtimes.map((st) => st.endMinutes + st.cleaningBufferMinutes));
    return minutesToTime(maxEnd);
  }, [existingShowtimes, addRoomId]);

  const readyNextTime = useMemo(() => {
    if (!addStartTime || !selectedMovie) return '';
    const startM = timeToMinutes(addStartTime);
    const duration = selectedMovie.duration || 120;
    const nextM = startM + duration + addBufferMinutes;
    return minutesToTime(nextM);
  }, [addStartTime, selectedMovie, addBufferMinutes]);

  return (
    <>
      {/* 1. Modal Tạo Suất Chiếu Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans overflow-y-auto">
          <form
            onSubmit={onSubmitCreate}
            className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-xl relative my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-semibold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Tạo suất chiếu mới</h3>
                  <span className="text-xs text-slate-400">
                    Ngày chiếu: <strong className="text-slate-700 font-medium">{selectedDateKey}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseAddModal}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              {/* Step 1: Chọn Phim Chiếu */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-slate-700 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    <span>1. Chọn bộ phim</span>
                  </label>
                  {selectedMovie && (
                    <span className="text-[11px] text-[#7C6FE8] font-medium bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {selectedMovie.title} ({selectedMovie.duration}p • {selectedMovie.ageRating})
                    </span>
                  )}
                </div>

                {/* Movie Search Bar */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-200">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Gõ tìm nhanh phim..."
                    value={movieSearch}
                    onChange={(e) => setMovieSearch(e.target.value)}
                    className="w-full bg-transparent font-medium focus:outline-none text-slate-900 text-xs"
                  />
                  {movieSearch && (
                    <button
                      type="button"
                      onClick={() => setMovieSearch('')}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Movie Selection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50/50 rounded-lg border border-gray-200">
                  {modalFilteredMovies.map((m) => {
                    const isSelected = (addMovieId || movies[0]?.id) === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setAddMovieId(m.id)}
                        className={`p-1.5 rounded-md border flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#7C6FE8] text-white border-[#7C6FE8] shadow-2xs'
                            : 'bg-white text-slate-800 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {m.posterUrl ? (
                          <img
                            src={m.posterUrl}
                            alt={m.title}
                            className="w-7 h-10 object-cover rounded shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-10 rounded bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                            CD
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`font-semibold text-[11px] truncate leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {m.title}
                          </span>
                          <span className={`text-[10px] ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                            {m.duration}p • {m.ageRating}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Chọn Phòng Chiếu */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    <span>2. Chọn phòng chiếu</span>
                  </label>
                  {latestRoomEndTime && (
                    <button
                      type="button"
                      onClick={() => setAddStartTime(latestRoomEndTime)}
                      className="text-[11px] text-[#7C6FE8] font-medium hover:underline cursor-pointer"
                    >
                      Xếp tiếp theo suất trước ({latestRoomEndTime})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {rooms.map((r) => {
                    const isSelected = (addRoomId || rooms[0]?.id) === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setAddRoomId(r.id)}
                        className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 border-[#7C6FE8] text-[#7C6FE8] shadow-2xs font-semibold'
                            : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-semibold text-xs text-slate-900 truncate">{r.name}</span>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{r.type}</span>
                          <span>{r.capacity} Ghế</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Giờ Bắt Đầu & Kết Thúc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-gray-200">
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-slate-700">3. Giờ bắt đầu</label>
                  <input
                    type="time"
                    value={addStartTime}
                    onChange={(e) => setAddStartTime(e.target.value)}
                    required
                    className="w-full p-2 rounded-lg bg-white border border-gray-200 font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {QUICK_START_TIMES.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setAddStartTime(t)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border cursor-pointer ${
                          addStartTime === t
                            ? 'bg-[#7C6FE8] text-white border-[#7C6FE8]'
                            : 'bg-white border-gray-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 justify-between">
                  <label className="font-medium text-slate-700">Dự kiến kết thúc & dọn phòng</label>
                  <div className="p-2 rounded-lg bg-white border border-gray-200 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Chiếu phim xong:</span>
                      <strong className="font-mono text-amber-600 font-semibold">{calculatedEndTime || '--:--'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Dọn xong (sẵn sàng):</span>
                      <strong className="font-mono text-emerald-600 font-semibold">{readyNextTime || '--:--'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conflict Warning */}
              {conflictInfo && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  Cảnh báo: Trùng lịch với suất "{conflictInfo.movieTitle}" ({conflictInfo.startTime} – {conflictInfo.endTime}). Vui lòng dời giờ bắt đầu.
                </div>
              )}

              {/* Step 4: Giá Vé & Dọn Phòng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-slate-700">4. Giá vé cơ bản (VND)</label>
                  <input
                    type="number"
                    step={5000}
                    min={40000}
                    value={addPrice}
                    onChange={(e) => setAddPrice(Number(e.target.value))}
                    required
                    className="w-full p-2 rounded-lg bg-slate-50 border border-gray-200 font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                  <div className="flex items-center gap-1 flex-wrap">
                    {QUICK_PRICES.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setAddPrice(p)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border cursor-pointer ${
                          addPrice === p
                            ? 'bg-[#7C6FE8] text-white border-[#7C6FE8]'
                            : 'bg-white border-gray-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {formatVND(p)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-slate-700">5. Thời gian dọn phòng</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[10, 15, 20, 30].map((buf) => (
                      <button
                        type="button"
                        key={buf}
                        onClick={() => setAddBufferMinutes(buf)}
                        className={`py-2 rounded-lg border text-center font-medium text-xs transition-colors cursor-pointer ${
                          addBufferMinutes === buf
                            ? 'bg-[#7C6FE8] text-white border-[#7C6FE8]'
                            : 'bg-slate-50 border-gray-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        {buf}p
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">Khuyến nghị 15 phút cho phòng tiêu chuẩn.</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onCloseAddModal}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isCreating || Boolean(conflictInfo)}
                className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5edb] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Tạo suất chiếu</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Modal Chỉnh Sửa Suất Chiếu */}
      {isEditModalOpen && editingShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans">
          <form
            onSubmit={onSubmitEdit}
            className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3.5 shadow-xl relative"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Chỉnh sửa suất chiếu</h3>
              </div>
              <button
                type="button"
                onClick={onCloseEditModal}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-gray-200 flex flex-col gap-0.5 text-xs">
              <span className="font-semibold text-slate-900">{editingShowtime.movieTitle}</span>
              <span className="text-slate-500">
                {editingShowtime.cinemaName} • <strong>{editingShowtime.roomName}</strong> ({editingShowtime.roomType})
              </span>
              {editingShowtime.isLocked && (
                <span className="text-amber-800 font-medium flex items-center gap-1 mt-1 text-[11px]">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Đã có {editingShowtime.bookedSeats} vé đặt. Không thể đổi Phim / Phòng.
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700">Giờ bắt đầu</label>
                <input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg bg-slate-50 border border-gray-200 font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700">Giá vé cơ bản</label>
                <input
                  type="number"
                  step={5000}
                  min={40000}
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  required
                  className="w-full p-2 rounded-lg bg-slate-50 border border-gray-200 font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onCloseEditModal}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5edb] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Modal Xóa Suất Chiếu */}
      {isDeleteModalOpen && deletingShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3.5 shadow-xl relative text-center items-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-slate-900">Xóa suất chiếu?</h3>
              <p className="text-xs text-slate-500">
                Bạn có chắc muốn xóa suất chiếu phim <strong className="text-slate-800 font-medium">"{deletingShowtime.movieTitle}"</strong> ({deletingShowtime.startTime} – {deletingShowtime.endTime})?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 w-full pt-1">
              <button
                type="button"
                onClick={onCloseDeleteModal}
                className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Sao Chép Lịch Chiếu */}
      {isCloneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans">
          <form
            onSubmit={onSubmitClone}
            className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3.5 shadow-xl relative"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
                  <Copy className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Sao chép lịch chiếu</h3>
              </div>
              <button
                type="button"
                onClick={onCloseCloneModal}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-200 flex justify-between font-medium">
                <span className="text-slate-500">Ngày nguồn:</span>
                <strong className="text-[#7C6FE8]">{selectedDateKey}</strong>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700">Ngày đích:</label>
                <input
                  type="date"
                  value={cloneTargetDate}
                  min={selectedDateKey}
                  onChange={(e) => setCloneTargetDate(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg bg-slate-50 border border-gray-200 font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Hệ thống sẽ nhân bản tất cả suất chiếu và tự động bỏ qua nếu phát hiện trùng lịch tại phòng đích.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onCloseCloneModal}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isCloning || !cloneTargetDate}
                className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5edb] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isCloning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Sao chép</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Modal Xem Chi Tiết Suất Chiếu */}
      {viewingShowtime && (
        <div
          onClick={onCloseViewModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3.5 shadow-xl relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Chi tiết suất chiếu</h3>
              </div>
              <button
                type="button"
                onClick={onCloseViewModal}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Movie & Room Info */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-gray-200">
              {viewingShowtime.moviePoster ? (
                <img
                  src={viewingShowtime.moviePoster}
                  alt={viewingShowtime.movieTitle}
                  className="w-12 h-18 object-cover rounded shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-12 h-18 rounded bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0 font-bold text-xs">
                  CD
                </div>
              )}
              <div className="flex flex-col gap-1 flex-1 text-xs">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-xs text-slate-900 leading-tight">
                    {viewingShowtime.movieTitle}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-200 font-semibold text-[10px] text-slate-700">
                    {viewingShowtime.movieAgeRating}
                  </span>
                </div>

                <span className="text-slate-500">
                  {viewingShowtime.cinemaName} • <strong>{viewingShowtime.roomName}</strong> ({viewingShowtime.roomType})
                </span>

                <div className="flex items-center gap-1.5 font-mono text-[#7C6FE8] font-semibold text-xs mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {viewingShowtime.startTime} – {viewingShowtime.endTime} ({viewingShowtime.showDate})
                  </span>
                </div>
              </div>
            </div>

            {/* Occupancy & Financial Revenue Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-200 flex flex-col justify-between gap-1">
                <span className="text-slate-400 text-[11px]">Giá vé:</span>
                <strong className="font-mono text-emerald-600 text-xs">
                  {formatVND(viewingShowtime.basePrice)}
                </strong>
                <span className="text-[10px] text-slate-400">
                  Doanh thu: {formatVND(viewingShowtime.bookedSeats * viewingShowtime.basePrice)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-200 flex flex-col justify-between gap-1">
                <span className="text-slate-400 text-[11px]">Lấp đầy ghế:</span>
                <strong className="font-mono text-slate-900 text-xs">
                  {viewingShowtime.bookedSeats} / {viewingShowtime.totalSeats} ({viewingShowtime.occupancyRate}%)
                </strong>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      viewingShowtime.occupancyRate > 60
                        ? 'bg-emerald-500'
                        : viewingShowtime.occupancyRate > 20
                        ? 'bg-[#7C6FE8]'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, viewingShowtime.occupancyRate))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Locked Warning */}
            {viewingShowtime.isLocked && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Đã có {viewingShowtime.bookedSeats} vé đặt. Suất chiếu đã khóa trường đổi Phim / Phòng.
                </span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                {!viewingShowtime.isLocked && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const st = viewingShowtime;
                        onCloseViewModal();
                        if (onOpenEditFromView) {
                          onOpenEditFromView(st);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer border border-purple-200"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa giờ/giá</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const st = viewingShowtime;
                        onCloseViewModal();
                        if (onOpenDeleteFromView) {
                          onOpenDeleteFromView(st);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer border border-rose-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa suất</span>
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={onCloseViewModal}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
