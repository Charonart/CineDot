/* Hallmark · component: UserVoucherSelectorModal · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * UX: Shopee / TikTok Shop 2-tier classification (Eligible vs Ineligible)
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  X,
  Clock,
  Gift,
  Search,
  Percent,
} from 'lucide-react';
import { apiClient } from '@/shared/lib/apiClient';

export interface CheckoutVoucherItem {
  id: number;
  code: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_value: number;
  max_discount_value?: number;
  valid_until?: string;
  category?: 'TICKET' | 'FNB' | 'ALL';
  voucher_type?: string;
}

interface UserVoucherSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderAmount: number;
  appliedVoucherCode?: string | null;
  onApplyVoucher: (code: string) => void;
}

export const UserVoucherSelectorModal: React.FC<UserVoucherSelectorModalProps> = ({
  isOpen,
  onClose,
  orderAmount,
  appliedVoucherCode,
  onApplyVoucher,
}) => {
  const [vouchers, setVouchers] = useState<CheckoutVoucherItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    apiClient
      .get<{ success: boolean; data: CheckoutVoucherItem[] }>('/vouchers')
      .then((res) => {
        if (isMounted && res.data?.data) {
          setVouchers(res.data.data);
        }
      })
      .catch(() => {
        // Fallback default vouchers if offline/mock
        if (isMounted) {
          setVouchers([
            {
              id: 1,
              code: 'CINEDOT50K',
              title: 'Giảm 50.000đ cho đơn từ 150.000đ',
              description: 'Áp dụng cho mọi suất chiếu trong tuần.',
              discount_type: 'fixed_amount',
              discount_value: 50000,
              min_order_value: 150000,
              valid_until: '31/12/2026',
            },
            {
              id: 2,
              code: 'VIP20PCT',
              title: 'Giảm 20% tối đa 60.000đ',
              description: 'Áp dụng cho thành viên VIP và suất chiếu đặc biệt.',
              discount_type: 'percentage',
              discount_value: 20,
              min_order_value: 200000,
              max_discount_value: 60000,
              valid_until: '31/12/2026',
            },
            {
              id: 3,
              code: 'NEWUSER30K',
              title: 'Giảm 30.000đ cho khách hàng mới',
              description: 'Áp dụng cho đơn từ 100.000đ.',
              discount_type: 'fixed_amount',
              discount_value: 30000,
              min_order_value: 100000,
              valid_until: '31/12/2026',
            },
            {
              id: 4,
              code: 'BIGCOMBO100K',
              title: 'Giảm 100.000đ cho đơn khủng',
              description: 'Áp dụng cho đơn vé nhóm từ 400.000đ.',
              discount_type: 'fixed_amount',
              discount_value: 100000,
              min_order_value: 400000,
              valid_until: '31/12/2026',
            },
          ]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Compute savings for a voucher
  const calculateDiscount = (v: CheckoutVoucherItem): number => {
    if (v.discount_type === 'fixed_amount') {
      return v.discount_value;
    }
    const rawDiscount = (orderAmount * v.discount_value) / 100;
    if (v.max_discount_value && v.max_discount_value > 0) {
      return Math.min(rawDiscount, v.max_discount_value);
    }
    return rawDiscount;
  };

  // Filter & Split into 2 groups
  const { eligibleVouchers, ineligibleVouchers } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = vouchers.filter(
      (v) =>
        !q ||
        v.code.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    );

    const eligible: (CheckoutVoucherItem & { savings: number })[] = [];
    const ineligible: (CheckoutVoucherItem & { neededMore: number })[] = [];

    for (const v of filtered) {
      const minVal = Number(v.min_order_value) || 0;
      if (orderAmount >= minVal) {
        eligible.push({
          ...v,
          savings: calculateDiscount(v),
        });
      } else {
        ineligible.push({
          ...v,
          neededMore: minVal - orderAmount,
        });
      }
    }

    return { eligibleVouchers: eligible, ineligibleVouchers: ineligible };
  }, [vouchers, orderAmount, searchQuery]);

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCode.trim()) {
      onApplyVoucher(customCode.trim().toUpperCase());
      onClose();
    }
  };

  const handleSelect = (code: string) => {
    onApplyVoucher(code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl max-h-[88vh] bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-purple-100 flex flex-col gap-5 overflow-hidden text-slate-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Chọn Mã Giảm Giá CineDot
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Đơn hàng hiện tại: <strong className="text-slate-900">{orderAmount.toLocaleString('vi-VN')}đ</strong>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Input Bar */}
          <form onSubmit={handleCustomApply} className="flex gap-2">
            <div className="relative flex-1">
              <Ticket className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nhập mã voucher cá nhân..."
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-black text-[#7C6FE8] placeholder:font-sans placeholder:font-medium uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={!customCode.trim()}
              className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] disabled:opacity-40 text-white font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              Áp Dụng
            </button>
          </form>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên voucher, mã code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Vouchers List Container */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 pr-1 flex flex-col gap-5">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <div className="w-6 h-6 border-2 border-[#7C6FE8] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Đang tải danh sách voucher khả dụng...</span>
              </div>
            ) : eligibleVouchers.length === 0 && ineligibleVouchers.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-2 text-slate-400">
                <Ticket className="w-10 h-10 text-slate-300 stroke-1" />
                <span className="text-xs font-bold text-slate-700">Không tìm thấy voucher phù hợp</span>
              </div>
            ) : (
              <>
                {/* 1. Nhóm 1: Voucher Đủ Điều Kiện */}
                {eligibleVouchers.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Voucher Khả Dụng ({eligibleVouchers.length})
                      </h4>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {eligibleVouchers.map((v) => {
                        const isApplied = appliedVoucherCode === v.code;
                        return (
                          <div
                            key={v.id}
                            className={`group relative p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                              isApplied
                                ? 'bg-purple-50/70 border-[#7C6FE8] ring-2 ring-[#7C6FE8]/20'
                                : 'bg-white border-slate-200 hover:border-[#7C6FE8]/60 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0 border border-purple-100">
                                {v.discount_type === 'percentage' ? (
                                  <Percent className="w-5 h-5" />
                                ) : (
                                  <Ticket className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-black text-xs text-[#7C6FE8] px-2 py-0.5 rounded-md bg-purple-100/60 border border-purple-200">
                                    {v.code}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                                    Tiết kiệm {v.savings.toLocaleString('vi-VN')}đ
                                  </span>
                                </div>
                                <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                                  {v.title}
                                </h5>
                                <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                                  {v.description}
                                </p>
                                {v.valid_until && (
                                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    HSD: {v.valid_until}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSelect(v.code)}
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 self-end sm:self-center ${
                                isApplied
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-sm shadow-[#7C6FE8]/25'
                              }`}
                            >
                              {isApplied ? 'Đang Dùng' : 'Áp Dụng'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Nhóm 2: Voucher Chưa Đủ Điều Kiện */}
                {ineligibleVouchers.length > 0 && (
                  <div className="flex flex-col gap-3 pt-2 border-t border-dashed border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                        Chưa Đủ Điều Kiện Áp Dụng ({ineligibleVouchers.length})
                      </h4>
                    </div>

                    <div className="flex flex-col gap-2.5 opacity-75">
                      {ineligibleVouchers.map((v) => (
                        <div
                          key={v.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
                              <Ticket className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-xs text-slate-500 px-2 py-0.5 rounded-md bg-slate-200 border border-slate-300">
                                  {v.code}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                                  Cần mua thêm {v.neededMore.toLocaleString('vi-VN')}đ
                                </span>
                              </div>
                              <h5 className="font-extrabold text-xs text-slate-700 leading-snug">
                                {v.title}
                              </h5>
                              <p className="text-[11px] text-slate-400 font-medium">
                                {v.description}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled
                            className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-400 text-[11px] font-bold cursor-not-allowed shrink-0 self-end sm:self-center"
                          >
                            Chưa Đủ Đơn
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
