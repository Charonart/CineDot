'use client';

import React, { useState } from 'react';
import { Gift, Sparkles, Check, Ticket, Copy, Tag, Calendar, ShieldCheck, Star } from 'lucide-react';
import { RewardVoucherItem, UserProfile } from '../types/profile.types';

interface TabRewardsProps {
  profile: UserProfile;
  vouchers: RewardVoucherItem[];
}

export const TabRewards: React.FC<TabRewardsProps> = ({
  profile,
  vouchers,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const tierInfo = profile.tierInfo;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-extrabold text-[#131413]">Kho Voucher & Quyền Lợi Thành Viên</h2>
        <p className="text-xs text-slate-500">
          Danh sách mã giảm giá và đặc quyền ưu đãi dành riêng cho thành viên CineDot Star.
        </p>
      </div>

      {/* CinePoints Summary Card & Tier Privileges */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#7C6FE8]/60 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-5 z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center ring-2 ring-amber-400/30 shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">TỔNG ĐIỂM CINEPOINTS TÍCH LŨY</span>
            <span className="text-3xl sm:text-4xl font-black text-white">{profile.cinePoints.toLocaleString()} CP</span>
            <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>Tích 1 điểm cho mỗi 10.000đ chi tiêu tại CineDot</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 z-10 w-full md:w-auto">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold text-amber-300 flex items-center gap-2">
            <span>🌟 HẠNG {profile.tierName.toUpperCase()}</span>
            {tierInfo?.discountPercent ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                GIẢM {tierInfo.discountPercent}%
              </span>
            ) : null}
          </div>
          <span className="text-[11px] text-slate-300 font-medium">
            {tierInfo?.nextTier
              ? `Còn ${tierInfo.pointsNeeded.toLocaleString()} CP để lên hạng ${tierInfo.nextTier}`
              : `Bạn đang hưởng đặc quyền tối đa của hạng ${profile.tierName}`}
          </span>
        </div>
      </div>

      {/* Tier Benefit Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center font-bold text-xs shrink-0">
            5%
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-[#131413]">Hạng Silver</span>
            <span className="text-[11px] text-slate-500">Từ 500 CP • Giảm 5% giá vé</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
            10%
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-[#131413]">Hạng Gold</span>
            <span className="text-[11px] text-slate-500">Từ 1.000 CP • Giảm 10% giá vé</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
            15%
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-[#131413]">Hạng Diamond</span>
            <span className="text-[11px] text-slate-500">Từ 2.000 CP • Giảm 15% giá vé</span>
          </div>
        </div>
      </div>

      {/* Active Vouchers Grid */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#131413] flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#7C6FE8]" />
            <span>Danh Sách Voucher Hiện Có ({vouchers.length})</span>
          </h3>
        </div>

        {vouchers.length === 0 ? (
          <div className="w-full bg-slate-50 rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center gap-2">
            <Tag className="w-8 h-8 text-slate-400" />
            <span className="font-bold text-xs text-[#131413]">Hiện tại chưa có mã giảm giá nào</span>
            <p className="text-xs text-slate-400">Các chương trình khuyến mãi và voucher mới sẽ được cập nhật sớm nhất.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vouchers.map((v) => {
              const isCopied = copiedCode === v.code;

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0 ring-1 ring-[#7C6FE8]/20">
                        <Ticket className="w-5 h-5" />
                      </div>

                      <div className="flex flex-col gap-1">
                        <h4 className="font-extrabold text-sm text-[#131413] leading-snug">{v.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{v.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>HSD: <strong>{v.validUntil}</strong></span>
                    </div>

                    <button
                      onClick={() => handleCopy(v.code)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-sm shadow-[#7C6FE8]/20'
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
                          <span>MÃ: {v.code}</span>
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
