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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                Quản lý loại ghế & phụ phí
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Đồng bộ với bảng sơ đồ ghế và trang đặt vé
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen && (
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="px-3 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm loại ghế</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Create / Edit Form Drawer */}
          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              className="p-4 rounded-xl bg-slate-50 border border-gray-200 flex flex-col gap-3.5"
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-xs text-slate-800">
                  {editingItem ? `Chỉnh sửa: ${editingItem.name}` : 'Thêm loại ghế mới'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                >
                  Đóng form
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Mã định danh (seat_type)</label>
                  <input
                    type="text"
                    disabled={!!editingItem}
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="e.g. deluxe_sofa"
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#7C6FE8] disabled:bg-slate-100 disabled:text-slate-400"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Tên hiển thị</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ghế Sofa Deluxe"
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Phụ phí (+VND)</label>
                  <input
                    type="number"
                    step={5000}
                    min={0}
                    value={formSurcharge}
                    onChange={(e) => setFormSurcharge(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                  <span className="text-[11px] text-emerald-600 font-medium">
                    +{formatVND(formSurcharge)}
                  </span>
                </div>
              </div>

              {/* Color & Icon Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Màu sắc nhận diện</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-transform cursor-pointer ${
                          formColor.toLowerCase() === c.toLowerCase()
                            ? 'ring-2 ring-offset-1 ring-slate-800 scale-105'
                            : 'hover:scale-105'
                        }`}
                      >
                        {formColor.toLowerCase() === c.toLowerCase() && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent p-0"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Biểu tượng</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { key: 'seat', label: 'Ghế' },
                      { key: 'star', label: 'VIP' },
                      { key: 'heart', label: 'Đôi' },
                      { key: 'crown', label: 'Deluxe' },
                      { key: 'bed', label: 'Giường' },
                    ].map((ic) => (
                      <button
                        key={ic.key}
                        type="button"
                        onClick={() => setFormIcon(ic.key)}
                        className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                          formIcon === ic.key
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {renderSeatIcon(ic.key, 'w-3 h-3')}
                        <span>{ic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">Mô tả tiện ích</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Ghế da tự động ngả lưng, sạc điện thoại..."
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSeatType || isUpdatingSeatType}
                  className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isCreatingSeatType || isUpdatingSeatType ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{editingItem ? 'Lưu thay đổi' : 'Tạo loại ghế'}</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Existing Seat Types */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">
              Danh sách loại ghế ({seatTypes.length})
            </span>

            {isLoadingSeatTypes ? (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#7C6FE8]" />
                <span>Đang tải danh sách loại ghế…</span>
              </div>
            ) : seatTypes.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Chưa có loại ghế nào trong CSDL.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {seatTypes.map((st) => (
                  <div
                    key={st.key}
                    className="p-3 rounded-lg border border-gray-200 bg-white flex flex-col justify-between gap-2 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          style={{ backgroundColor: st.color }}
                          className="w-7 h-7 rounded-md text-white flex items-center justify-center shrink-0"
                        >
                          {renderSeatIcon(st.icon, 'w-3.5 h-3.5')}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-xs text-slate-800 truncate">{st.name}</span>
                          <span className="font-mono text-[11px] text-slate-400 truncate">{st.key}</span>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-800 shrink-0 tabular-nums">
                        {st.surcharge > 0 ? `+${formatVND(st.surcharge)}` : 'Gốc'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 text-slate-500">
                      <span className="text-[11px] truncate">
                        {st.description || 'Không có mô tả'}
                      </span>
                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(st)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(st)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
