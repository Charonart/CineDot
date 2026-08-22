'use client';

import React from 'react';
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
  Zap,
} from 'lucide-react';
import {
  AdminMovieOption,
  AdminRoomOption,
  AdminShowtimeGridItem,
} from '../../types/adminShowtime.types';

interface ShowtimeModalsProps {
  // Add Modal
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onSubmitCreate: (e: React.FormEvent) => void;
  isCreating: boolean;
  movies: AdminMovieOption[];
  rooms: AdminRoomOption[];
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
  showtimes: AdminShowtimeGridItem[];
  suggestedStartTime: string;

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
}

export function ShowtimeModals({
  isAddModalOpen,
  onCloseAddModal,
  onSubmitCreate,
  isCreating,
  movies,
  rooms,
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
  showtimes,
  suggestedStartTime,

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
}: ShowtimeModalsProps) {
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Filter showtimes for the currently selected room, sorted by startMinutes
  const roomSchedule = showtimes
    .filter((st) => st.roomId === addRoomId)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <>
      {/* 1. Modal Tạo Suất Chiếu Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-slate-900">
          <form
            onSubmit={onSubmitCreate}
            className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#7C6FE8]">
                <Plus className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Thêm Suất Chiếu Mới</h3>
              </div>
              <button
                type="button"
                onClick={onCloseAddModal}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Chọn Phim */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">1. Chọn Bộ Phim</label>
                <select
                  value={addMovieId || ''}
                  onChange={(e) => setAddMovieId(Number(e.target.value))}
                  required
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] cursor-pointer"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.duration} phút - {m.ageRating})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn Phòng Chiếu */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">2. Chọn Phòng Chiếu</label>
                <select
                  value={addRoomId || ''}
                  onChange={(e) => setAddRoomId(Number(e.target.value))}
                  required
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] cursor-pointer"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.type} ({r.capacity} Ghế)
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Schedule Preview Card */}
              {addRoomId && (
                <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
                      Lịch Phòng Hiện Tại
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddStartTime(suggestedStartTime)}
                      className="px-2.5 py-1 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer shadow-sm shadow-[#7C6FE8]/20 transition-colors"
                    >
                      <Zap className="w-3 h-3" />
                      Snap tới {suggestedStartTime}
                    </button>
                  </div>

                  {roomSchedule.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic">Chưa có suất chiếu nào trong phòng này.</p>
                  ) : (
                    <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto pr-0.5">
                      {roomSchedule.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/80 border border-indigo-100/60 text-[11px]"
                        >
                          <span className="font-mono font-bold text-[#7C6FE8] shrink-0">
                            {st.startTime}–{st.endTime}
                          </span>
                          <span className="text-slate-700 truncate font-medium">{st.movieTitle}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-700">
                      Khung giờ gợi ý: {suggestedStartTime}
                    </span>
                  </div>
                </div>
              )}

              {/* Giờ Bắt Đầu & Giờ Kết Thúc */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-slate-700">3. Giờ Bắt Đầu (Start)</label>
                  <input
                    type="time"
                    value={addStartTime}
                    onChange={(e) => setAddStartTime(e.target.value)}
                    required
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-slate-700">4. Giờ Kết Thúc (Tự Tính)</label>
                  <input
                    type="text"
                    value={calculatedEndTime || '...'}
                    disabled
                    className="w-full p-3 rounded-2xl bg-slate-100 border border-gray-200 font-mono font-bold text-slate-500"
                  />
                </div>
              </div>

              {/* Giá Vé Cơ Bản & Buffer Dọn Phòng */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-slate-700">5. Giá Vé Cơ Bản (VND)</label>
                  <input
                    type="number"
                    step={5000}
                    min={40000}
                    value={addPrice}
                    onChange={(e) => setAddPrice(Number(e.target.value))}
                    required
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-slate-700">6. Buffer Dọn Phòng</label>
                  <select
                    value={addBufferMinutes}
                    onChange={(e) => setAddBufferMinutes(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] cursor-pointer"
                  >
                    <option value={10}>10 phút</option>
                    <option value={15}>15 phút (Chuẩn)</option>
                    <option value={20}>20 phút (Phim dài)</option>
                    <option value={30}>30 phút (Bom tấn)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onCloseAddModal}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 cursor-pointer disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Xác Nhận Tạo Suất Chiếu</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Modal Chỉnh Sửa Suất Chiếu */}
      {isEditModalOpen && editingShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-slate-900">
          <form
            onSubmit={onSubmitEdit}
            className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#7C6FE8]">
                <Edit3 className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Chỉnh Sửa Suất Chiếu</h3>
              </div>
              <button
                type="button"
                onClick={onCloseEditModal}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col gap-1 text-xs">
              <span className="font-extrabold text-slate-900">{editingShowtime.movieTitle}</span>
              <span className="text-slate-600">
                {editingShowtime.cinemaName} • <strong>{editingShowtime.roomName}</strong>
              </span>
              {editingShowtime.isLocked && (
                <span className="text-amber-800 font-bold flex items-center gap-1 mt-1">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Đã có {editingShowtime.bookedSeats} vé đặt. Hệ thống khóa trường đổi Phim / Phòng.
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">Giờ Bắt Đầu</label>
                <input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  required
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">Giá Vé Cơ Bản</label>
                <input
                  type="number"
                  step={5000}
                  min={40000}
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  required
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onCloseEditModal}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Modal Xóa Suất Chiếu */}
      {isDeleteModalOpen && deletingShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-slate-900">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Xác Nhận Xóa Suất Chiếu</h3>
              </div>
              <button
                type="button"
                onClick={onCloseDeleteModal}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex flex-col gap-1 text-xs text-rose-950">
              <span className="font-bold">{deletingShowtime.movieTitle}</span>
              <span>Phòng: <strong>{deletingShowtime.roomName}</strong></span>
              <span>Suất: <strong>{deletingShowtime.startTime} - {deletingShowtime.endTime}</strong> ({deletingShowtime.showDate})</span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Bạn có chắc chắn muốn xóa suất chiếu này? Hệ thống sẽ đồng thời xóa toàn bộ sơ đồ ghế liên kết.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onCloseDeleteModal}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Xác Nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Sao Chép Lịch Chiếu Sang Ngày Khác */}
      {isCloneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-slate-900">
          <form
            onSubmit={onSubmitClone}
            className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#7C6FE8]">
                <Copy className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Sao Chép Lịch Chiếu</h3>
              </div>
              <button
                type="button"
                onClick={onCloseCloneModal}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-gray-200 flex justify-between">
                <span>Ngày Nguồn (Sao chép từ):</span>
                <strong className="text-[#7C6FE8]">{selectedDateKey}</strong>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">Ngày Đích (Dán lịch sang):</label>
                <input
                  type="date"
                  value={cloneTargetDate}
                  min={selectedDateKey}
                  onChange={(e) => setCloneTargetDate(e.target.value)}
                  required
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                * Hệ thống sẽ nhân bản tất cả suất chiếu và tự động bỏ qua nếu phát hiện trùng lịch tại phòng đích.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onCloseCloneModal}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={isCloning || !cloneTargetDate}
                className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 cursor-pointer disabled:opacity-50"
              >
                {isCloning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                <span>Sao Chép Ngay</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Modal Xem Chi Tiết Suất Chiếu */}
      {viewingShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-slate-900">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#7C6FE8]">
                <Eye className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Chi Tiết Suất Chiếu</h3>
              </div>
              <button
                type="button"
                onClick={onCloseViewModal}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-3.5">
              {viewingShowtime.moviePoster ? (
                <img
                  src={viewingShowtime.moviePoster}
                  alt={viewingShowtime.movieTitle}
                  className="w-16 h-24 object-cover rounded-xl shadow-xs shrink-0"
                />
              ) : (
                <div className="w-16 h-24 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center shrink-0 font-bold">
                  CD
                </div>
              )}
              <div className="flex flex-col gap-1 flex-1 text-xs">
                <span className="font-extrabold text-sm text-slate-900">{viewingShowtime.movieTitle}</span>
                <span className="text-slate-500">
                  {viewingShowtime.cinemaName} • <strong>{viewingShowtime.roomName}</strong>
                </span>
                <span className="font-mono text-[#7C6FE8] font-bold">
                  {viewingShowtime.startTime} - {viewingShowtime.endTime} ({viewingShowtime.showDate})
                </span>
                <span className="text-slate-500">
                  Giá vé cơ bản: <strong className="text-emerald-600">{formatVND(viewingShowtime.basePrice)}</strong>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span>Tỷ lệ lấp đầy ghế:</span>
                <strong className="text-slate-900 font-mono">
                  {viewingShowtime.bookedSeats} / {viewingShowtime.totalSeats} ghế ({viewingShowtime.occupancyRate}%)
                </strong>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C6FE8]"
                  style={{ width: `${Math.min(100, viewingShowtime.occupancyRate)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onCloseViewModal}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
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
