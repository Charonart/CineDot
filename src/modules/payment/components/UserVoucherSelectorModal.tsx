'use client';

import React, { useState, useEffect } from 'react';
import { Tag, X, Check, Ticket, Sparkles, Search, AlertCircle, ChevronRight } from 'lucide-react';
import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';

export interface AvailableVoucherItem {
  id: number;
  code: string;
  title: string;
  description: string;
  discount_type: 'fixed_amount' | 'percentage';
  discount_value: number;
  min_order_value: number;
  max_discount_value: number;
  valid_until: string;
  is_active: boolean;
  category?: 'TICKET' | 'FNB' | string;
}

interface UserVoucherSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderAmount: number;
  onSelectVoucher: (code: string) => void;
  appliedCode?: string | null;
}

export const UserVoucherSelectorModal: React.FC<UserVoucherSelectorModalProps> = ({
  isOpen,
  onClose,
  orderAmount,
  onSelectVoucher,
  appliedCode,
}) => {
  const [vouchers, setVouchers] = useState<AvailableVoucherItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'TICKET' | 'FNB'>('ALL');

  useEffect(() => {
    if (!isOpen) return;

    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<any>(ENDPOINTS.VOUCHERS.LIST);
        const list = res.data?.data || res.data || [];
        setVouchers(list);
      } catch {
        // Fallback demo vouchers if API fails
        setVouchers([
          {
            id: 1,
            code: 'CINEDOT50K',
            title: 'Giảm 50.000đ Vé Phim IMAX & 2D',
            description: 'Áp dụng cho mọi đơn từ 150.000đ',
            discount_type: 'fixed_amount',
            discount_value: 50000,
            min_order_value: 150000,
            max_discount_value: 0,
            valid_until: '31/12/2026',
            is_active: true,
            category: 'TICKET',
          },
          {
            id: 2,
            code: 'STAR20PCT',
            title: 'Giảm 20% Combo Bắp Nước',
            description: 'Giảm tối đa 40.000đ cho đơn từ 100.000đ',
            discount_type: 'percentage',
            discount_value: 20,
            min_order_value: 100000,
            max_discount_value: 40000,
            valid_until: '31/12/2026',
            is_active: true,
            category: 'FNB',
          },
          {
            id: 3,
            code: 'NEWUSER30K',
            title: 'Ưu Đãi Thành Viên Mới Giảm 30K',
            description: 'Dành riêng cho đơn từ 200.000đ',
            discount_type: 'fixed_amount',
            discount_value: 30000,
            min_order_value: 200000,
            max_discount_value: 0,
            valid_until: '31/12/2026',
            is_active: true,
            category: 'TICKET',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'TICKET' && v.category !== 'FNB') ||
      (activeTab === 'FNB' && v.category === 'FNB');
    return matchesSearch && matchesTab;
  });

  const eligibleVouchers = filteredVouchers.filter((v) => orderAmount >= (v.min_order_value || 0));
  const ineligibleVouchers = filteredVouchers.filter((v) => orderAmount < (v.min_order_value || 0));

  const calculateDiscountEstimate = (v: AvailableVoucherItem) => {
    if (v.discount_type === 'fixed_amount') {
      return Math.min(orderAmount, v.discount_value);
    }
    const raw = orderAmount * (v.discount_value / 100);
    if (v.max_discount_value && v.max_discount_value > 0) {
      return Math.min(raw, v.max_discount_value);
    }
    return raw;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-5 sm:p-7 flex flex-col gap-5 shadow-2xl relative text-slate-900 my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Kho Voucher & Ưu Đãi Khuyến Mãi
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Chọn mã giảm giá phù hợp với đơn hàng của bạn
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

        {/* Search & Tabs */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm mã voucher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 focus:border-[#7C6FE8] focus:bg-white text-xs font-semibold text-slate-800 outline-none transition-all"
            />
          </div>

          {/* Categories Filter Chips */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-[#7C6FE8] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Tất Cả ({vouchers.length})
            </button>
            <button
              onClick={() => setActiveTab('TICKET')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'TICKET'
                  ? 'bg-[#7C6FE8] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Vé Xem Phim
            </button>
            <button
              onClick={() => setActiveTab('FNB')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'FNB'
                  ? 'bg-[#7C6FE8] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Bắp Nước (F&B)
            </button>
          </div>
        </div>

        {/* Voucher List Content */}
        <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-8 h-8 border-3 border-[#7C6FE8]/30 border-t-[#7C6FE8] rounded-full animate-spin" />
              <span className="text-xs text-slate-500 font-bold">Đang tải kho mã giảm giá...</span>
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
              <Tag className="w-10 h-10 text-slate-300 mb-1" />
              <span className="text-sm font-bold text-slate-700">Không tìm thấy voucher khả dụng</span>
              <span className="text-xs text-slate-400">Vui lòng thử lại với từ khóa khác</span>
            </div>
          ) : (
            <>
              {/* NHÓM 1: ĐỦ ĐIỀU KIỆN ÁP DỤNG */}
              {eligibleVouchers.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mã Đủ Điều Kiện Đơn Hàng ({eligibleVouchers.length})</span>
                  </span>

                  {eligibleVouchers.map((v) => {
                    const estSaved = calculateDiscountEstimate(v);
                    const isApplied = appliedCode === v.code;

                    return (
                      <div
                        key={v.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden ${
                          isApplied
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                            : 'bg-white hover:bg-purple-50/40 border-purple-100 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C6FE8] to-indigo-600 text-white flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-md">
                            <span>{v.discount_type === 'percentage' ? `${v.discount_value}%` : `${Math.round(v.discount_value / 1000)}K`}</span>
                            <span className="text-[9px] text-amber-300 uppercase font-mono">OFF</span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-xs text-[#7C6FE8] bg-purple-100/80 px-2 py-0.5 rounded-lg border border-purple-200">
                                {v.code}
                              </span>
                              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Tiết kiệm {estSaved.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">{v.title}</h4>
                            <p className="text-[11px] text-slate-500">{v.description}</p>
                            {v.valid_until && (
                              <span className="text-[10px] font-semibold text-slate-400">Hạn dùng: {v.valid_until}</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectVoucher(v.code);
                            onClose();
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-sm shadow-[#7C6FE8]/20'
                          }`}
                        >
                          {isApplied ? 'Đang Dùng' : 'Áp Dụng'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* NHÓM 2: CHƯA ĐỦ ĐIỀU KIỆN ÁP DỤNG */}
              {ineligibleVouchers.length > 0 && (
                <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Mã Chưa Đủ Điều Kiện ({ineligibleVouchers.length})</span>
                  </span>

                  {ineligibleVouchers.map((v) => {
                    const needed = (v.min_order_value || 0) - orderAmount;

                    return (
                      <div
                        key={v.id}
                        className="p-4 rounded-2xl border border-gray-200/80 bg-slate-50/80 opacity-75 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-300 text-slate-700 flex flex-col items-center justify-center font-black text-xs shrink-0">
                            <span>{v.discount_type === 'percentage' ? `${v.discount_value}%` : `${Math.round(v.discount_value / 1000)}K`}</span>
                            <span className="text-[9px] uppercase font-mono">OFF</span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-slate-600 bg-slate-200 px-2 py-0.5 rounded-lg">
                                {v.code}
                              </span>
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                Đơn tối thiểu {v.min_order_value.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-700 leading-snug">{v.title}</h4>
                            <p className="text-[11px] text-amber-700 font-semibold">
                              Cần mua thêm {needed.toLocaleString('vi-VN')}đ để sử dụng mã này
                            </p>
                          </div>
                        </div>

                        <button
                          disabled
                          className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-gray-200 text-gray-500 cursor-not-allowed shrink-0"
                        >
                          Chưa Đủ Đơn
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Đơn hàng hiện tại: <strong className="text-slate-900 font-extrabold">{orderAmount.toLocaleString('vi-VN')}đ</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
