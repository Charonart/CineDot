'use client';

import React, { useState } from 'react';
import { X, Sparkles, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdminUserDTO } from '../../dto/adminUserManagement.dto';

interface PointsAdjustmentModalProps {
  user: AdminUserDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onAdjust: (payload: { points: number; reason?: string }) => Promise<any>;
}

export function PointsAdjustmentModal({
  user,
  isOpen,
  onClose,
  onAdjust,
}: PointsAdjustmentModalProps) {
  const [actionType, setActionType] = useState<'add' | 'deduct'>('add');
  const [pointsAmount, setPointsAmount] = useState<number | string>(100);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(pointsAmount);
    if (!amount || amount <= 0) {
      setErrorMsg('Vui lòng nhập số điểm hợp lệ lớn hơn 0.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const delta = actionType === 'add' ? amount : -amount;
      await onAdjust({ points: delta, reason: reason.trim() || undefined });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật điểm.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl relative text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-black text-slate-900">Điều Chỉnh Điểm Thưởng</h3>
              <span className="text-xs text-slate-500 font-medium">
                {user.fullname || user.username} (@{user.username})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Points Info */}
        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Điểm hiện tại:</span>
          <span className="text-base font-black text-[#7C6FE8] font-mono">
            {user.point.toLocaleString('vi-VN')} Pts
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Action Tabs: Add vs Deduct */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-100 border border-gray-200">
            <button
              type="button"
              onClick={() => setActionType('add')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                actionType === 'add'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cộng Điểm</span>
            </button>
            <button
              type="button"
              onClick={() => setActionType('deduct')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                actionType === 'deduct'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Trừ Điểm</span>
            </button>
          </div>

          {/* Points Amount Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Số Điểm {actionType === 'add' ? 'Cộng Thêm' : 'Khấu Trừ'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              step="any"
              required
              value={pointsAmount}
              onChange={(e) => setPointsAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex items-center gap-1.5">
            {[50, 100, 200, 500, 1000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPointsAmount(val)}
                className={`flex-1 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                  Number(pointsAmount) === val
                    ? 'bg-purple-50 text-[#7C6FE8] border-purple-200 font-black'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                +{val}
              </button>
            ))}
          </div>

          {/* Reason Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Lý Do Ghi Nhận
            </label>
            <input
              type="text"
              placeholder="VD: Tri ân khách hàng VIP, Đổi quà tại quầy..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs text-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              HỦY
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#6b5ddc] text-white font-black text-xs uppercase tracking-wider shadow-sm shadow-[#7C6FE8]/30 flex items-center gap-2"
            >
              {isSubmitting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>XÁC NHẬN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
