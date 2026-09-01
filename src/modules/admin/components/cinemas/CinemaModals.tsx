'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Tv,
  X,
  AlertTriangle,
  Trash2,
  Edit3,
  Loader2,
} from 'lucide-react';
import { AdminCinemaItem, AdminRoomItem, ProvinceOption } from '../../types/adminCinema.types';

interface CinemaModalsProps {
  provinces: ProvinceOption[];

  // 1. Add Cinema
  isAddCinemaModalOpen: boolean;
  onCloseAddCinema: () => void;
  onSubmitAddCinema: (e: React.FormEvent) => void;
  newCinemaName: string;
  onNewNameChange: (val: string) => void;
  newCinemaSlug: string;
  onNewSlugChange: (val: string) => void;
  newCinemaProvinceId: number;
  onNewProvinceIdChange: (val: number) => void;
  newCinemaAddress: string;
  onNewAddressChange: (val: string) => void;
  newCinemaPhone: string;
  onNewPhoneChange: (val: string) => void;
  newCinemaEmail: string;
  onNewEmailChange: (val: string) => void;
  newCinemaDesc: string;
  onNewDescChange: (val: string) => void;
  addCinemaError: string;
  isCreatingCinema: boolean;

  // 2. Edit Cinema
  editingCinema: AdminCinemaItem | null;
  onCloseEditCinema: () => void;
  onSubmitEditCinema: (e: React.FormEvent) => void;
  editCinemaName: string;
  onEditNameChange: (val: string) => void;
  editCinemaSlug: string;
  onEditSlugChange: (val: string) => void;
  editCinemaProvinceId: number;
  onEditProvinceIdChange: (val: number) => void;
  editCinemaAddress: string;
  onEditAddressChange: (val: string) => void;
  editCinemaPhone: string;
  onEditPhoneChange: (val: string) => void;
  editCinemaEmail: string;
  onEditEmailChange: (val: string) => void;
  editCinemaDesc: string;
  onEditDescChange: (val: string) => void;
  editCinemaError: string;
  isUpdatingCinema: boolean;

  // 3. Delete Cinema
  deletingCinema: AdminCinemaItem | null;
  onCloseDeleteCinema: () => void;
  onConfirmDeleteCinema: () => void;
  isDeletingCinema: boolean;

  // 4. Add Room
  isAddRoomModalOpen: boolean;
  currentCinema: AdminCinemaItem | null;
  onCloseAddRoom: () => void;
  onSubmitAddRoom: (e: React.FormEvent) => void;
  newRoomName: string;
  onNewRoomNameChange: (val: string) => void;
  newRoomFormat: string;
  onNewRoomFormatChange: (val: string) => void;
  addRoomError: string;
  isCreatingRoom: boolean;

  // 5. Delete Room
  deletingRoom: AdminRoomItem | null;
  onCloseDeleteRoom: () => void;
  onConfirmDeleteRoom: () => void;
  isDeletingRoom: boolean;
}

export const CinemaModals: React.FC<CinemaModalsProps> = ({
  provinces,

  // Add Cinema
  isAddCinemaModalOpen,
  onCloseAddCinema,
  onSubmitAddCinema,
  newCinemaName,
  onNewNameChange,
  newCinemaSlug,
  onNewSlugChange,
  newCinemaProvinceId,
  onNewProvinceIdChange,
  newCinemaAddress,
  onNewAddressChange,
  newCinemaPhone,
  onNewPhoneChange,
  newCinemaEmail,
  onNewEmailChange,
  newCinemaDesc,
  onNewDescChange,
  addCinemaError,
  isCreatingCinema,

  // Edit Cinema
  editingCinema,
  onCloseEditCinema,
  onSubmitEditCinema,
  editCinemaName,
  onEditNameChange,
  editCinemaSlug,
  onEditSlugChange,
  editCinemaProvinceId,
  onEditProvinceIdChange,
  editCinemaAddress,
  onEditAddressChange,
  editCinemaPhone,
  onEditPhoneChange,
  editCinemaEmail,
  onEditEmailChange,
  editCinemaDesc,
  onEditDescChange,
  editCinemaError,
  isUpdatingCinema,

  // Delete Cinema
  deletingCinema,
  onCloseDeleteCinema,
  onConfirmDeleteCinema,
  isDeletingCinema,

  // Add Room
  isAddRoomModalOpen,
  currentCinema,
  onCloseAddRoom,
  onSubmitAddRoom,
  newRoomName,
  onNewRoomNameChange,
  newRoomFormat,
  onNewRoomFormatChange,
  addRoomError,
  isCreatingRoom,

  // Delete Room
  deletingRoom,
  onCloseDeleteRoom,
  onConfirmDeleteRoom,
  isDeletingRoom,
}) => {
  return (
    <>
      {/* 1. THÊM CỤM RẠP */}
      <AnimatePresence>
        {isAddCinemaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-xl border border-gray-200 p-5 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-medium">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Thêm cụm rạp mới</h3>
                    <span className="text-xs text-slate-400">Khởi tạo chi nhánh rạp CineDot</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCloseAddCinema}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addCinemaError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{addCinemaError}</span>
                </div>
              )}

              <form onSubmit={onSubmitAddCinema} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Tên cụm rạp *</label>
                  <input
                    type="text"
                    value={newCinemaName}
                    onChange={(e) => onNewNameChange(e.target.value)}
                    placeholder="VD: CineDot Landmark 81"
                    required
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Đường dẫn tĩnh (Slug)</label>
                    <input
                      type="text"
                      value={newCinemaSlug}
                      onChange={(e) => onNewSlugChange(e.target.value)}
                      placeholder="cinedot-landmark-81"
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Tỉnh / Thành phố *</label>
                    <select
                      value={newCinemaProvinceId}
                      onChange={(e) => onNewProvinceIdChange(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    >
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={newCinemaAddress}
                    onChange={(e) => onNewAddressChange(e.target.value)}
                    placeholder="VD: Tầng 5, TTTM Vincom..."
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Hotline</label>
                    <input
                      type="text"
                      value={newCinemaPhone}
                      onChange={(e) => onNewPhoneChange(e.target.value)}
                      placeholder="1900 6017"
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Email liên hệ</label>
                    <input
                      type="email"
                      value={newCinemaEmail}
                      onChange={(e) => onNewEmailChange(e.target.value)}
                      placeholder="contact@cinedot.vn"
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Mô tả cụm rạp</label>
                  <textarea
                    rows={2}
                    value={newCinemaDesc}
                    onChange={(e) => onNewDescChange(e.target.value)}
                    placeholder="Mô tả công nghệ rạp, phòng chiếu..."
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onCloseAddCinema}
                    disabled={isCreatingCinema}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingCinema || !newCinemaName.trim()}
                    className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingCinema ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Tạo cụm rạp</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SỬA CỤM RẠP */}
      <AnimatePresence>
        {editingCinema && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-xl border border-gray-200 p-5 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-medium">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Chỉnh sửa cụm rạp</h3>
                    <span className="text-xs text-slate-400">ID: #{editingCinema.id}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCloseEditCinema}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {editCinemaError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{editCinemaError}</span>
                </div>
              )}

              <form onSubmit={onSubmitEditCinema} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Tên cụm rạp *</label>
                  <input
                    type="text"
                    value={editCinemaName}
                    onChange={(e) => onEditNameChange(e.target.value)}
                    required
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Đường dẫn tĩnh (Slug)</label>
                    <input
                      type="text"
                      value={editCinemaSlug}
                      onChange={(e) => onEditSlugChange(e.target.value)}
                      placeholder="cinedot-landmark-81"
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Tỉnh / Thành phố *</label>
                    <select
                      value={editCinemaProvinceId}
                      onChange={(e) => onEditProvinceIdChange(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    >
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={editCinemaAddress}
                    onChange={(e) => onEditAddressChange(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Hotline</label>
                    <input
                      type="text"
                      value={editCinemaPhone}
                      onChange={(e) => onEditPhoneChange(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-700">Email liên hệ</label>
                    <input
                      type="email"
                      value={editCinemaEmail}
                      onChange={(e) => onEditEmailChange(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Mô tả cụm rạp</label>
                  <textarea
                    rows={2}
                    value={editCinemaDesc}
                    onChange={(e) => onEditDescChange(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onCloseEditCinema}
                    disabled={isUpdatingCinema}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingCinema || !editCinemaName.trim()}
                    className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingCinema ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Lưu thay đổi</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. XÁC NHẬN XÓA CỤM RẠP */}
      <AnimatePresence>
        {deletingCinema && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-5 shadow-xl flex flex-col gap-3 text-center items-center"
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-slate-900">Xóa cụm rạp?</h3>
                <p className="text-xs text-slate-500">
                  Bạn có chắc muốn xóa <strong className="text-slate-800 font-medium">"{deletingCinema.name}"</strong>? Toàn bộ phòng chiếu và sơ đồ ghế liên quan cũng sẽ bị gỡ bỏ.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={onCloseDeleteCinema}
                  disabled={isDeletingCinema}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={onConfirmDeleteCinema}
                  disabled={isDeletingCinema}
                  className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer flex items-center justify-center gap-1"
                >
                  {isDeletingCinema ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Xóa</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. THÊM PHÒNG CHIẾU */}
      <AnimatePresence>
        {isAddRoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-5 shadow-xl flex flex-col gap-3.5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-medium">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Thêm phòng chiếu mới</h3>
                    <span className="text-xs text-slate-400">Rạp: {currentCinema?.name}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCloseAddRoom}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addRoomError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{addRoomError}</span>
                </div>
              )}

              <form onSubmit={onSubmitAddRoom} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Tên phòng chiếu *</label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => onNewRoomNameChange(e.target.value)}
                    placeholder="VD: Phòng 01 - IMAX"
                    required
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Định dạng công nghệ (Template phòng)</label>
                  <select
                    value={newRoomFormat}
                    onChange={(e) => onNewRoomFormatChange(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="IMAX 3D Laser">IMAX Laser 3D (Dual Laser + IMAX 12ch)</option>
                    <option value="Dolby Cinema">Dolby Cinema (Dolby Vision HDR + Atmos)</option>
                    <option value="ScreenX 270°">ScreenX 270° (Màn 3 mặt + Atmos)</option>
                    <option value="Samsung Onyx Cinema LED">Samsung Onyx 4K LED (Tự phát sáng + Atmos)</option>
                    <option value="VIP Gold Class">VIP Gold Class (Ghế Recliner & Bed + Atmos)</option>
                    <option value="Digital 3D Atmos">Digital 3D Atmos (Kính phân cực 3D + Atmos)</option>
                    <option value="2D Standard">2D Standard (Digital 2K/4K + 7.1 Surround)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onCloseAddRoom}
                    disabled={isCreatingRoom}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingRoom || !newRoomName.trim()}
                    className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingRoom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Tạo phòng</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. XÁC NHẬN XÓA PHÒNG CHIẾU */}
      <AnimatePresence>
        {deletingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-5 shadow-xl flex flex-col gap-3 text-center items-center"
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-slate-900">Xóa phòng chiếu?</h3>
                <p className="text-xs text-slate-500">
                  Bạn có chắc muốn xóa <strong className="text-slate-800 font-medium">"{deletingRoom.name}"</strong>? Sơ đồ ghế và cấu hình phòng sẽ bị xóa hoàn toàn.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={onCloseDeleteRoom}
                  disabled={isDeletingRoom}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={onConfirmDeleteRoom}
                  disabled={isDeletingRoom}
                  className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer flex items-center justify-center gap-1"
                >
                  {isDeletingRoom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Xóa</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
