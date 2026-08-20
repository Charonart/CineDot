'use client';

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Layers,
  Percent,
  DollarSign,
  Users,
} from 'lucide-react';
import { AdminVoucher } from '../../types/adminCampaign.types';
import { CreateVoucherPayload, UpdateVoucherPayload } from '../../dto/adminCampaign.dto';
import { useAdminCampaigns } from '../../hooks/useAdminCampaigns';

interface VoucherStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateVoucherPayload | UpdateVoucherPayload) => Promise<any>;
  voucherToEdit?: AdminVoucher | null;
  defaultCampaignId?: number | null;
}

export const VoucherStudioModal: React.FC<VoucherStudioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  voucherToEdit,
  defaultCampaignId,
}) => {
  const { campaigns } = useAdminCampaigns({ limit: 100 });

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campaignId, setCampaignId] = useState<number | string>('');
  const [voucherType, setVoucherType] = useState<'ticket' | 'combo' | 'order' | 'all'>('order');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount'>('fixed_amount');
  const [discountValue, setDiscountValue] = useState<number | string>(50000);
  const [minOrderValue, setMinOrderValue] = useState<number | string>(150000);
  const [maxDiscountValue, setMaxDiscountValue] = useState<number | string>('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [systemLimit, setSystemLimit] = useState<number | string>(1000);
  const [limitPerUser, setLimitPerUser] = useState<number | string>(1);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (voucherToEdit) {
      setCode(voucherToEdit.code || '');
      setTitle(voucherToEdit.title || '');
      setDescription(voucherToEdit.description || '');
      setCampaignId(voucherToEdit.campaignId || '');
      setVoucherType(voucherToEdit.voucherType || 'order');
      setDiscountType(voucherToEdit.discountType || 'fixed_amount');
      setDiscountValue(voucherToEdit.discountValue || 0);
      setMinOrderValue(voucherToEdit.minOrderValue || 0);
      setMaxDiscountValue(voucherToEdit.maxDiscountValue || '');
      setValidFrom(voucherToEdit.validFrom ? voucherToEdit.validFrom.slice(0, 10) : '');
      setValidUntil(voucherToEdit.validUntil ? voucherToEdit.validUntil.slice(0, 10) : '');
      setSystemLimit(voucherToEdit.systemLimit || '');
      setLimitPerUser(voucherToEdit.limitPerUser || 1);
      setIsActive(voucherToEdit.isActive ?? true);
    } else {
      setCode('');
      setTitle('');
      setDescription('');
      setCampaignId(defaultCampaignId || '');
      setVoucherType('order');
      setDiscountType('fixed_amount');
      setDiscountValue(50000);
      setMinOrderValue(150000);
      setMaxDiscountValue('');
      setValidFrom('');
      setValidUntil('');
      setSystemLimit(1000);
      setLimitPerUser(1);
      setIsActive(true);
    }
    setStatusMsg(null);
  }, [voucherToEdit, defaultCampaignId, isOpen]);

  if (!isOpen) return null;

  const generateRandomCode = () => {
    const prefixes = ['DOT', 'CINEMA', 'VIP', 'HOT', 'SUMMER', 'SPECIAL'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setCode(`${prefix}${randomNum}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập hoặc sinh mã Voucher.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const payload: CreateVoucherPayload = {
        code: code.trim().toUpperCase(),
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        campaign_id: campaignId ? Number(campaignId) : null,
        voucher_type: voucherType,
        discount_type: discountType,
        discount_value: Number(discountValue) || 0,
        min_order_value: Number(minOrderValue) || 0,
        max_discount_value: maxDiscountValue ? Number(maxDiscountValue) : null,
        valid_from: validFrom ? `${validFrom} 00:00:00` : null,
        valid_until: validUntil ? `${validUntil} 23:59:59` : null,
        system_limit: systemLimit ? Number(systemLimit) : null,
        limit_per_user: Number(limitPerUser) || 1,
        is_active: isActive,
      };

      await onSave(payload);
      setStatusMsg({
        type: 'success',
        text: voucherToEdit ? 'Đã cập nhật mã voucher thành công!' : 'Đã tạo mã voucher mới thành công!',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi lưu voucher. Vui lòng kiểm tra lại thông tin.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative text-slate-900 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {voucherToEdit ? 'Chỉnh Sửa Mã Giảm Giá' : 'Tạo Mã Giảm Giá / Voucher Mới'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Cấu hình mã coupon, hình thức giảm giá và giới hạn sử dụng
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Row 1: Code & Generator + Campaign */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mã Voucher */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Mã Voucher <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="VD: CINEDOT50K, SUMMER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] font-mono font-black text-sm text-[#7C6FE8] uppercase"
                />
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-3 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] text-[11px] font-extrabold tracking-wider uppercase shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Sinh mã ngẫu nhiên"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Random</span>
                </button>
              </div>
            </div>

            {/* Chiến Dịch Tiếp Thị Liên Kết */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Chiến Dịch Liên Kết</span>
              </label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-bold text-slate-800 bg-white cursor-pointer"
              >
                <option value="">-- Không gắn Chiến dịch (Voucher Tự Do) --</option>
                {campaigns.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Tiêu Đề & Mô Tả */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Tiêu Đề Voucher
              </label>
              <input
                type="text"
                placeholder="VD: Giảm 50.000đ Cho Đơn Đặt Vé IMAX Cuối Tuần"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Điều Kiện & Mô Tả Chi Tiết
              </label>
              <textarea
                rows={2}
                placeholder="VD: Áp dụng cho các suất chiếu 2D/3D, không áp dụng cùng lúc với ưu đãi khác..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-medium text-slate-800 resize-none"
              />
            </div>
          </div>

          {/* Row 3: Phạm vi áp dụng & Hình thức giảm giá */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phạm Vi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Phạm Vi Áp Dụng
                </label>
                <select
                  value={voucherType}
                  onChange={(e) => setVoucherType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="order">Toàn Bộ Đơn Hàng (Order)</option>
                  <option value="ticket">Chỉ Vé Xem Phim (Ticket Only)</option>
                  <option value="combo">Chỉ Combo Bắp Nước (F&B Combo)</option>
                  <option value="all">Tất Cả Hạng Mục (All Items)</option>
                </select>
              </div>

              {/* Loại Giảm Giá */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Hình Thức Giảm
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDiscountType('fixed_amount');
                      setDiscountValue(50000);
                    }}
                    className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      discountType === 'fixed_amount'
                        ? 'bg-[#7C6FE8] text-white border-[#7C6FE8]'
                        : 'bg-white text-slate-600 border-gray-200'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Số Tiền (₫)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDiscountType('percentage');
                      setDiscountValue(20);
                    }}
                    className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      discountType === 'percentage'
                        ? 'bg-[#7C6FE8] text-white border-[#7C6FE8]'
                        : 'bg-white text-slate-600 border-gray-200'
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>Phần Trăm (%)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Giá Trị Giảm & Giới Hạn Tối Đa */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-black text-slate-600 uppercase">
                  Mức Giảm ({discountType === 'percentage' ? '%' : 'VNĐ'})
                </label>
                <input
                  type="number"
                  min={1}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-black text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-black text-slate-600 uppercase">
                  Đơn Tối Thiểu (VNĐ)
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900"
                />
              </div>

              {discountType === 'percentage' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-black text-slate-600 uppercase">
                    Giảm Tối Đa (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="VD: 50000"
                    value={maxDiscountValue}
                    onChange={(e) => setMaxDiscountValue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Hạn Dùng & Hạn Mức */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Thời gian */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Thời Hạn Hiệu Lực</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                  placeholder="Từ ngày"
                />
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                  placeholder="Đến ngày"
                />
              </div>
            </div>

            {/* Hạn mức số lượng */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Hạn Mức Sử Dụng</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="Tổng phát hành"
                  value={systemLimit}
                  onChange={(e) => setSystemLimit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold font-mono"
                  title="Tổng số lượt phát hành trên toàn hệ thống"
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Lượt/User"
                  value={limitPerUser}
                  onChange={(e) => setLimitPerUser(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold font-mono"
                  title="Giới hạn số lần áp dụng cho mỗi tài khoản"
                />
              </div>
            </div>
          </div>

          {/* Active switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800">Kích Hoạt Ngay</span>
              <span className="text-[11px] text-slate-500 font-medium">
                Cho phép người dùng áp dụng mã voucher này ngay khi đặt vé
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

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
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
              <span>{voucherToEdit ? 'LƯU THAY ĐỔI' : '+ TẠO VOUCHER'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
