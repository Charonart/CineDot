'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Check,
  Loader2,
  Sparkles,
  Star,
  Heart,
  Crown,
  Bed,
  Armchair,
  Info,
} from 'lucide-react';
import { useAdminSeatTypes } from '../../hooks/useAdminSeatTypes';
import { AdminSeatTypeItem } from '../../types/adminSeatType.types';

interface SeatTypesStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#64748B', // Slate (Standard)
  '#7C6FE8', // CineDot Purple (VIP)
  '#EC4899', // Pink (Sweetbox)
  '#F43F5E', // Rose (Couple)
  '#8B5CF6', // Violet (Deluxe)
  '#F59E0B', // Amber (Gold Class)
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#EF4444', // Red
];

export function renderSeatIcon(iconName?: string, className = 'w-3.5 h-3.5') {
  switch (iconName) {
    case 'star':
      return <Star className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'crown':
      return <Crown className={className} />;
    case 'bed':
      return <Bed className={className} />;
    default:
      return <Armchair className={className} />;
  }
}

export function SeatTypesStudioModal({ isOpen, onClose }: SeatTypesStudioModalProps) {
  const {
    seatTypes,
    isLoadingSeatTypes,
    createSeatType,
    isCreatingSeatType,
    updateSeatType,
    isUpdatingSeatType,
    deleteSeatType,
    isDeletingSeatType,
  } = useAdminSeatTypes();

  const [editingItem, setEditingItem] = useState<AdminSeatTypeItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [formKey, setFormKey] = useState('');
  const [formName, setFormName] = useState('');
  const [formSurcharge, setFormSurcharge] = useState<number>(0);
  const [formColor, setFormColor] = useState('#7C6FE8');
  const [formIcon, setFormIcon] = useState('star');
  const [formDescription, setFormDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSortOrder, setFormSortOrder] = useState(10);
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const handleOpenCreateForm = () => {
    setEditingItem(null);
    setFormKey('');
    setFormName('');
    setFormSurcharge(20000);
    setFormColor('#7C6FE8');
    setFormIcon('star');
    setFormDescription('');
    setFormIsActive(true);
    setFormSortOrder(seatTypes.length + 1);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: AdminSeatTypeItem) => {
    setEditingItem(item);
    setFormKey(item.key);
    setFormName(item.name);
    setFormSurcharge(item.surcharge);
    setFormColor(item.color);
    setFormIcon(item.icon);
    setFormDescription(item.description || '');
    setFormIsActive(item.isActive);
    setFormSortOrder(item.sortOrder);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Vui lòng nhập tên loại ghế.');
      return;
    }

    try {
      if (editingItem) {
        await updateSeatType({
          key: editingItem.key,
          payload: {
            type_name: formName.trim(),
            surcharge_amount: formSurcharge,
            color_code: formColor,
            icon_name: formIcon,
            description: formDescription,
            is_active: formIsActive,
            sort_order: formSortOrder,
          },
        });
        setToastMsg('Cập nhật loại ghế thành công!');
      } else {
        if (!formKey.trim()) {
          alert('Vui lòng nhập mã định danh loại ghế (viết liền không dấu, vd: deluxe_sofa).');
          return;
        }
        await createSeatType({
          seat_type: formKey.trim().toLowerCase(),
          type_name: formName.trim(),
          surcharge_amount: formSurcharge,
          color_code: formColor,
          icon_name: formIcon,
          description: formDescription,
          is_active: formIsActive,
          sort_order: formSortOrder,
        });
        setToastMsg('Tạo mới loại ghế thành công!');
      }

      setIsFormOpen(false);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj?.response?.data?.message || errObj?.message || 'Lỗi khi lưu loại ghế.');
    }
  };

  const handleDelete = async (item: AdminSeatTypeItem) => {
    if (confirm(`Bạn có chắc chắn muốn xóa loại ghế '${item.name}' (${item.key})?`)) {
      try {
        await deleteSeatType(item.key);
        setToastMsg(`Đã xóa loại ghế '${item.name}' thành công!`);
        setTimeout(() => setToastMsg(''), 3000);
      } catch (err: unknown) {
        const errObj = err as { response?: { data?: { message?: string } }; message?: string };
        alert(errObj?.response?.data?.message || errObj?.message || 'Không thể xóa loại ghế này.');
      }
    }
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Hệ Thống Phân Loại Ghế & Bảng Phụ Phí (Seat Types Studio)
              </h3>
              <p className="text-xs text-slate-500">
                Đồng bộ hóa 100% giữa CSDL, Bút vẽ sơ đồ phòng và Trang đặt vé người dùng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen && (
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="px-3.5 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Loại Ghế</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* A. Create / Edit Form Drawer */}
          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col gap-4 animate-in slide-in-from-top-2"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <span className="font-extrabold text-xs text-[#7C6FE8] uppercase tracking-wider">
                  {editingItem ? `Chỉnh Sửa Loại Ghế: ${editingItem.name}` : 'Thêm Loại Ghế Mới Vào CSDL'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Đóng Form
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Key */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Mã Định Danh (seat_type)</label>
                  <input
                    type="text"
                    disabled={!!editingItem}
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="e.g. deluxe_sofa"
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] disabled:bg-slate-100 disabled:text-slate-400"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Viết liền không dấu, là khóa chính CSDL</span>
                </div>

                {/* 2. Type Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Tên Hiển Thị</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ghế Sofa Deluxe"
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Hiển thị cho khách và quản trị viên</span>
                </div>

                {/* 3. Surcharge */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Mức Phụ Phí (+VND)</label>
                  <input
                    type="number"
                    step={5000}
                    min={0}
                    value={formSurcharge}
                    onChange={(e) => setFormSurcharge(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Cộng thêm: {formatVND(formSurcharge)}
                  </span>
                </div>
              </div>

              {/* Color & Icon Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Color Picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-700">Màu Sắc Nhận Diện</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform cursor-pointer ${
                          formColor.toLowerCase() === c.toLowerCase()
                            ? 'ring-3 ring-offset-2 ring-[#7C6FE8] scale-110'
                            : 'hover:scale-105'
                        }`}
                      >
                        {formColor.toLowerCase() === c.toLowerCase() && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-7 h-7 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                    />
                  </div>
                </div>

                {/* Icon Picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-700">Biểu Tượng (Icon)</label>
                  <div className="flex items-center gap-2">
                    {[
                      { key: 'seat', label: 'Ghế' },
                      { key: 'star', label: 'VIP Star' },
                      { key: 'heart', label: 'Sweetbox' },
                      { key: 'crown', label: 'Deluxe' },
                      { key: 'bed', label: 'Giường' },
                    ].map((ic) => (
                      <button
                        key={ic.key}
                        type="button"
                        onClick={() => setFormIcon(ic.key)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          formIcon === ic.key
                            ? 'bg-[#7C6FE8] border-[#7C6FE8] text-white shadow-xs'
                            : 'bg-white border-gray-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {renderSeatIcon(ic.key, 'w-3.5 h-3.5')}
                        <span>{ic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Mô Tả Tiện Ích</label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="e.g. Ghế da tự động ngả lưng, sạc điện thoại..."
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7C6FE8]" />
                  </label>
                  <span className="text-xs font-extrabold text-slate-700">
                    {formIsActive ? 'Đang kích hoạt' : 'Tạm ngưng'}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSeatType || isUpdatingSeatType}
                  className="px-5 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isCreatingSeatType || isUpdatingSeatType ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{editingItem ? 'Lưu Thay Đổi' : 'Tạo Loại Ghế'}</span>
                </button>
              </div>
            </form>
          )}

          {/* B. Grid of Existing Seat Types */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <span>DANH SÁCH LOẠI GHẾ HIỆN CÓ TRONG CSDL ({seatTypes.length})</span>
              <span className="text-purple-600 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Tự động đồng bộ với Bút vẽ sơ đồ và Trang đặt vé</span>
              </span>
            </div>

            {isLoadingSeatTypes ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#7C6FE8]" />
                <span>Đang tải danh sách loại ghế từ máy chủ...</span>
              </div>
            ) : seatTypes.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Chưa có loại ghế nào trong CSDL. Bấm "Thêm Loại Ghế" để tạo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seatTypes.map((st) => (
                  <div
                    key={st.key}
                    className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 shadow-2xs transition-all ${
                      st.isActive
                        ? 'bg-white border-gray-200 hover:border-[#7C6FE8]/50'
                        : 'bg-slate-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Seat Badge Preview */}
                      <div className="flex items-center gap-2.5">
                        <div
                          style={{ backgroundColor: st.color }}
                          className="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-xs shrink-0"
                        >
                          {renderSeatIcon(st.icon, 'w-4 h-4')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-xs text-slate-900">{st.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-bold">{st.key}</span>
                        </div>
                      </div>

                      {/* Surcharge Badge */}
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-extrabold text-[10px] border border-gray-200">
                        {st.surcharge > 0 ? `+${formatVND(st.surcharge)}` : 'Gốc (0 ₫)'}
                      </span>
                    </div>

                    {st.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">{st.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          st.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {st.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(st)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {st.key !== 'standard' && (
                          <button
                            type="button"
                            disabled={isDeletingSeatType}
                            onClick={() => handleDelete(st)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                            title="Xóa loại ghế"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Hoàn Tất
          </button>
        </div>
      </div>
    </div>
  );
}
