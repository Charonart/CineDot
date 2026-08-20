'use client';

import React, { useState, useEffect } from 'react';
import { Target, X, CheckCircle2, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { AdminCampaign } from '../../types/adminCampaign.types';
import { CreateCampaignPayload, UpdateCampaignPayload } from '../../dto/adminCampaign.dto';

interface CampaignStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateCampaignPayload | UpdateCampaignPayload) => Promise<any>;
  campaignToEdit?: AdminCampaign | null;
}

export const CampaignStudioModal: React.FC<CampaignStudioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaignToEdit,
}) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<number | string>(50000000);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (campaignToEdit) {
      setName(campaignToEdit.name || '');
      setBudget(campaignToEdit.budget ?? 0);
      setStartDate(campaignToEdit.startDate || '');
      setEndDate(campaignToEdit.endDate || '');
      setIsActive(campaignToEdit.isActive ?? true);
    } else {
      setName('');
      setBudget(50000000);
      setStartDate('');
      setEndDate('');
      setIsActive(true);
    }
    setStatusMsg(null);
  }, [campaignToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập tên chiến dịch tiếp thị.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const parsedBudget =
        typeof budget === 'string'
          ? budget.trim() === ''
            ? 0
            : Number(budget.replace(/[^0-9.-]+/g, ''))
          : Number(budget || 0);

      const payload: CreateCampaignPayload = {
        name: name.trim(),
        budget: isNaN(parsedBudget) ? 0 : parsedBudget,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        is_active: isActive,
      };

      await onSave(payload);
      setStatusMsg({
        type: 'success',
        text: campaignToEdit ? 'Đã cập nhật chiến dịch thành công!' : 'Đã tạo chiến dịch tiếp thị mới thành công!',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi lưu chiến dịch. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPresetBudget = (val: number) => {
    setBudget(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative text-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {campaignToEdit ? 'Chỉnh Sửa Chiến Dịch Tiếp Thị' : 'Tạo Chiến Dịch Tiếp Thị Mới'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Thiết lập ngân sách, thời gian chạy và mục tiêu tiếp thị
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
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
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
          {/* Tên chiến dịch */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Tên Chiến Dịch <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Chiến Dịch Hè Rực Rỡ 2026, Tri Ân Khách Hàng VIP..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] focus:ring-4 focus:ring-[#7C6FE8]/10 outline-none text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Ngân sách */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#7C6FE8]" />
                <span>Ngân Sách Tiếp Thị (VNĐ)</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-[#7C6FE8]">
                {Number(budget || 0).toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            <input
              type="number"
              min={0}
              step="any"
              placeholder="50000000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] focus:ring-4 focus:ring-[#7C6FE8]/10 outline-none text-xs font-bold text-slate-900 font-mono transition-all"
            />

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Gợi ý:</span>
              {[10000000, 20000000, 50000000, 100000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPresetBudget(preset)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                    Number(budget) === preset
                      ? 'bg-purple-50 text-[#7C6FE8] border-purple-200 font-black'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {(preset / 1000000).toFixed(0)} Triệu
                </button>
              ))}
            </div>
          </div>

          {/* Ngày Bắt Đầu & Kết Thúc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày Bắt Đầu</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] outline-none text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày Kết Thúc</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] outline-none text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Trạng thái Kích Hoạt */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mt-1">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800">Trạng Thái Kích Hoạt</span>
              <span className="text-[11px] text-slate-500 font-medium">
                Cho phép các Voucher & Banner thuộc chiến dịch hoạt động
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C6FE8]"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>{campaignToEdit ? 'LƯU THAY ĐỔI' : '+ TẠO CHIẾN DỊCH'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
