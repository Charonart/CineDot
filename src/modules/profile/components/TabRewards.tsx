/* Hallmark · component: TabRewards · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Check,
  Ticket,
  Copy,
  Tag,
  Calendar,
  Star,
  Zap,
  Info,
  Crown,
  Percent,
  Coffee,
} from 'lucide-react';
import { RewardVoucherItem, UserProfile } from '../types/profile.types';

interface TabRewardsProps {
  profile: UserProfile;
  vouchers: RewardVoucherItem[];
}

export const TabRewards: React.FC<TabRewardsProps> = ({ profile, vouchers }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'TICKET' | 'FNB'>('ALL');
  const tierInfo = profile.tierInfo;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (categoryFilter === 'ALL') return true;
    return v.category === categoryFilter;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-[#7C6FE8]" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Kho Voucher & Đặc Quyền Thành Viên
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Mã giảm giá độc quyền và bảng đặc quyền dành riêng cho thành viên CineDot Star.
        </p>
      </div>

      {/* 1. VIP CinePoints & Tier Privileges Banner */}
      <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-400/20">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C6FE8]/20 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
            <Crown className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
              ĐIỂM CINEPOINTS TÍCH LŨY
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              {profile.cinePoints.toLocaleString()} <span className="text-amber-300 text-2xl font-sans">CP</span>
            </span>
            <span className="text-xs text-amber-300 font-medium flex items-center gap-1.5 pt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>Tích lũy 1 CP cho mỗi 10.000đ chi tiêu vé và bắp nước</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 z-10 w-full md:w-auto">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-amber-300 flex items-center gap-2">
            <span>🌟 HẠNG {profile.tierName.toUpperCase()}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              GIẢM {tierInfo?.discountPercent || 15}%
            </span>
          </div>

          <span className="text-xs text-slate-300 font-medium">
            {tierInfo?.nextTier
              ? `Cần ${tierInfo.pointsNeeded.toLocaleString()} CP để mở khóa hạng ${tierInfo.nextTier}`
              : `Bạn đang tận hưởng đặc quyền cao nhất của CineDot Star`}
          </span>
        </div>
      </div>

      {/* 2. Tier Privileges Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Silver */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3.5 hover:border-slate-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs shrink-0 border border-slate-200">
            5%
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-slate-900">Hạng Silver</span>
            <span className="text-[11px] text-slate-500 font-medium">
              Từ 500 CP • Giảm 5% giá vé
            </span>
          </div>
        </div>

        {/* Gold */}
        <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70 shadow-2xs flex items-center gap-3.5 hover:border-amber-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0 border border-amber-200">
            10%
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-amber-900">Hạng Gold</span>
            <span className="text-[11px] text-amber-700/80 font-medium">
              Từ 1.000 CP • Giảm 10% giá vé
            </span>
          </div>
        </div>

        {/* Diamond */}
        <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/70 shadow-2xs flex items-center gap-3.5 hover:border-indigo-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-xs shrink-0 border border-indigo-200">
            15%
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-indigo-900">Hạng Diamond</span>
            <span className="text-[11px] text-indigo-700/80 font-medium">
              Từ 2.000 CP • Giảm 15% + Quà Sinh Nhật
            </span>
          </div>
        </div>
      </div>

      {/* 3. Vouchers Section with Category Filters */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#7C6FE8]" />
            <span>Voucher Khả Dụng ({filteredVouchers.length})</span>
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất Cả
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('TICKET')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'TICKET'
                  ? 'bg-white text-[#7C6FE8] shadow-2xs'
                  : 'text-slate-600 hover:text-[#7C6FE8]'
              }`}
            >
              Vé Phim
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('FNB')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'FNB'
                  ? 'bg-white text-[#7C6FE8] shadow-2xs'
                  : 'text-slate-600 hover:text-[#7C6FE8]'
              }`}
            >
              Bắp Nước
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredVouchers.length === 0 ? (
          <div className="w-full bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 flex flex-col items-center gap-2">
            <Tag className="w-8 h-8 text-slate-400" />
            <span className="font-bold text-sm text-slate-800">Chưa có voucher ở mục này</span>
            <p className="text-xs text-slate-400">Các voucher mới sẽ được cập nhật sớm nhất.</p>
          </div>
        ) : (
          /* Grid of Perforated Voucher Coupons */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVouchers.map((v) => {
              const isCopied = copiedCode === v.code;
              const isTicket = v.category === 'TICKET';

              return (
                <div
                  key={v.id}
                  className="relative bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#7C6FE8]/40 transition-all flex flex-col justify-between gap-4 overflow-hidden group"
                >
                  {/* Category Accent Line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      isTicket
                        ? 'bg-gradient-to-r from-[#7C6FE8] to-indigo-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                  />

                  {/* Voucher Header */}
                  <div className="flex items-start gap-3.5 pt-1">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isTicket
                          ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}
                    >
                      {isTicket ? <Ticket className="w-6 h-6" /> : <Coffee className="w-6 h-6" />}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase">
                          {isTicket ? 'Vé Xem Phim' : 'Bắp Nước F&B'}
                        </span>
                        <span className="text-[11px] font-black text-emerald-600">
                          {v.discountType === 'percentage'
                            ? `GIẢM ${v.discountValue || 0}%`
                            : `GIẢM ${(v.discountValue || 0).toLocaleString('vi-VN')}đ`}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug group-hover:text-[#7C6FE8] transition-colors">
                        {v.title || 'Voucher Khuyến Mãi'}
                      </h4>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {v.description || 'Áp dụng tại rạp CineDot'}
                      </p>
                    </div>
                  </div>

                  {/* Voucher Footer with Perforated Tear Line */}
                  <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        HSD: <strong className="text-slate-800">{v.validUntil || 'Xem chi tiết'}</strong>
                      </span>
                    </div>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(v.code || 'CINEDOT')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-xs shadow-[#7C6FE8]/25'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>ĐÃ SAO CHÉP</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="font-mono">{v.code || 'CINEDOT'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
