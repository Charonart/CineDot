'use client';

import React from 'react';
import { Gift, Sparkles, Check, Ticket, Utensils } from 'lucide-react';
import { RewardVoucherItem, UserProfile } from '../types/profile.types';

interface TabRewardsProps {
  profile: UserProfile;
  vouchers: RewardVoucherItem[];
  onRedeem: (voucher: RewardVoucherItem) => void;
  redeemSuccessMsg: string;
}

export const TabRewards: React.FC<TabRewardsProps> = ({
  profile,
  vouchers,
  onRedeem,
  redeemSuccessMsg,
}) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-extrabold text-[#131413]">Ưu Đãi & Điểm Thưởng</h2>
        <p className="text-xs text-slate-500">Sử dụng điểm tích lũy CinePoints để đổi voucher giảm giá vé và combo bắp nước.</p>
      </div>

      {redeemSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{redeemSuccessMsg}</span>
        </div>
      )}

      {/* CinePoints Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#7C6FE8]/50 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center ring-2 ring-amber-400/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">TỔNG ĐIỂM TÍCH LŨY</span>
            <span className="text-3xl font-extrabold text-white">{profile.cinePoints.toLocaleString()} CP</span>
          </div>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
          💎 HẠNG PLATINUM (+15% ĐIỂM THƯỞNG)
        </span>
      </div>

      {/* Vouchers Redeem Grid */}
      <div className="flex flex-col gap-4 pt-2">
        <h3 className="font-bold text-base text-[#131413] flex items-center gap-2">
          <Gift className="w-4 h-4 text-[#7C6FE8]" />
          <span>Kho Voucher Đổi Điểm Thưởng</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vouchers.map((v) => {
            const canAfford = profile.cinePoints >= v.pointsRequired;
            const CategoryIcon = v.category === 'TICKET' ? Ticket : Utensils;

            return (
              <div
                key={v.id}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#7C6FE8]/10 text-[#7C6FE8] flex items-center justify-center shrink-0">
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-xs text-[#131413] leading-snug">{v.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{v.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="font-extrabold text-xs text-[#7C6FE8]">
                    {v.pointsRequired.toLocaleString()} CP
                  </span>

                  <button
                    onClick={() => onRedeem(v)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-sm'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'ĐỔI NGAY' : 'KHÔNG ĐỦ ĐIỂM'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
