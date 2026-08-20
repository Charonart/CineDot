'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, AlertCircle, CheckCircle2, Percent, Sparkles } from 'lucide-react';
import { UserTierDTO, CreateUserTierPayload, UpdateUserTierPayload } from '../../dto/adminUserManagement.dto';

interface UserTierStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<any>;
  tierToEdit?: UserTierDTO | null;
}

export function UserTierStudioModal({
  isOpen,
  onClose,
  onSave,
  tierToEdit,
}: UserTierStudioModalProps) {
  const [tierName, setTierName] = useState('');
  const [minPoints, setMinPoints] = useState<number | string>(500);
  const [discountPercent, setDiscountPercent] = useState<number | string>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (tierToEdit) {
      setTierName(tierToEdit.tier || tierToEdit.name || '');
      setMinPoints(tierToEdit.min_points ?? 0);
      setDiscountPercent(tierToEdit.discount_percent ?? 0);
    } else {
      setTierName('');
      setMinPoints(500);
      setDiscountPercent(5);
    }
    setStatusMsg(null);
  }, [tierToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tierName.trim()) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập tên cấp bậc hội viên.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const payload: CreateUserTierPayload = {
        tier: tierName.trim(),
        min_points: Number(minPoints) || 0,
        discount_percent: Number(discountPercent) || 0,
      };

      await onSave(payload);
      setStatusMsg({
        type: 'success',
        text: tierToEdit ? 'Đã cập nhật chính sách cấp bậc thành công!' : 'Đã tạo cấp bậc hội viên mới thành công!',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi lưu cấp bậc hội viên.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl relative text-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-black text-slate-900">
                {tierToEdit ? 'Chỉnh Sửa Hạng Hội Viên' : 'Tạo Cấp Bậc Mới'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Thiết lập ngưỡng thăng hạng và chiết khấu
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div
            className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Tên Cấp Bậc <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Silver, Gold, Platinum, Diamond..."
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-bold text-slate-900"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ngưỡng Điểm Thăng Hạng (Min Points) *</span>
            </label>
            <input
              type="number"
              min={0}
              step="any"
              required
              placeholder="500"
              value={minPoints}
              onChange={(e) => setMinPoints(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>Tỷ Lệ Giảm Giá / Chiết Khấu Ưu Đãi (%) *</span>
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step="any"
              required
              placeholder="5"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-2xl border border-gray-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#7C6FE8]/30 flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{tierToEdit ? 'LƯU THAY ĐỔI' : '+ TẠO CẤP BẬC'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
