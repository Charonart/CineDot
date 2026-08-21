'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Timer, Ticket, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';

import { AppliedPricingRuleSummary, TicketPriceComposition } from '../hooks/usePayment';

interface SelectedFoodItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface VatBreakdownInfo {
  ticketVatRate: number;
  ticketVatAmount: number;
  comboVatRate: number;
  comboVatAmount: number;
  totalVatAmount: number;
  isIncluded?: boolean;
}

interface PaymentSidebarProps {
  movieTitle: string;
  movieFormat: string;
  posterUrl: string;
  ageRating: string;
  cinemaName: string;
  showTime: string;
  showDate: string;
  seatSummaryText: string;
  ticketPrice: number;
  appliedPricingRules?: AppliedPricingRuleSummary[];
  ticketPriceComposition?: TicketPriceComposition | null;
  selectedFoodList?: SelectedFoodItem[];
  totalFoodPrice?: number;
  tierDiscountAmount?: number;
  tierName?: string;
  voucherDiscountAmount?: number;
  discountAmount?: number;
  vatBreakdown?: VatBreakdownInfo;
  grandTotal: number;
  formattedCountdown: string;
  isAgreedTerms: boolean;
  onToggleTerms: (val: boolean) => void;
  onSubmitPayment: () => void;
  isProcessing: boolean;
}

export const PaymentSidebar: React.FC<PaymentSidebarProps> = ({
  movieTitle,
  movieFormat,
  posterUrl,
  ageRating,
  cinemaName,
  showTime,
  showDate,
  seatSummaryText,
  ticketPrice,
  appliedPricingRules = [],
  ticketPriceComposition,
  selectedFoodList = [],
  totalFoodPrice = 0,
  tierDiscountAmount = 0,
  tierName,
  voucherDiscountAmount = 0,
  discountAmount = 0,
  vatBreakdown,
  grandTotal,
  formattedCountdown,
  isAgreedTerms,
  onToggleTerms,
  onSubmitPayment,
  isProcessing,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-[0_16px_50px_rgba(124,111,232,0.12),0_4px_16px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col gap-5 sticky top-28">
      {/* 1. TOPMOST SECTION INSIDE SIDEBAR: Active Countdown Timer */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
        <div className="flex items-center gap-2 font-bold">
          <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Thời gian giữ ghế:</span>
        </div>
        <span className="font-extrabold text-sm text-amber-600 tracking-tight">
          {formattedCountdown}
        </span>
      </div>

      {/* 2. Movie Thumbnail & Title Info */}
      <div className="flex gap-4 items-start border-b border-gray-100 pb-4">
        <div className="w-20 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
          <img
            src={posterUrl}
            alt={movieTitle}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-bold uppercase">
              {movieFormat}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
              Khán giả {ageRating}
            </span>
          </div>

          <h3 className="font-bold text-base text-[#131413] leading-snug line-clamp-2">
            {movieTitle}
          </h3>
        </div>
      </div>

      {/* 3. Cinema & Showtime Info */}
      <div className="flex flex-col gap-2 text-xs text-slate-700 border-b border-gray-100 pb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#7C6FE8] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold text-[#131413]">{cinemaName}</span>
            <span className="text-slate-500">Phòng chiếu 01 (IMAX Laser)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#7C6FE8]" />
          <span>Suất: <strong>{showTime}</strong> - {showDate}</span>
        </div>
      </div>

      {/* 4. Selected Seats Summary & Pricing Rules Breakdown */}
      <div className="flex flex-col gap-2.5 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Tiền Vé Xem Phim</span>
          </span>
          <span className="font-extrabold text-[#7C6FE8] text-base">
            {ticketPrice.toLocaleString()}đ
          </span>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-gray-100 flex flex-col gap-1.5">
            <span className="font-bold text-[#131413] leading-relaxed">{seatSummaryText}</span>

            {/* Price Composition Breakdown */}
            {ticketPriceComposition && (
              <div className="pt-2 mt-1 border-t border-gray-200/60 flex flex-col gap-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>• Giá vé cơ bản:</span>
                  <span className="font-semibold text-slate-700">
                    {ticketPriceComposition.totalBasePrice.toLocaleString()}đ
                  </span>
                </div>

                {ticketPriceComposition.totalSurcharge > 0 && (
                  <div className="flex items-center justify-between text-amber-700">
                    <span>• Phụ thu loại ghế (VIP/Đôi):</span>
                    <span className="font-semibold">
                      +{ticketPriceComposition.totalSurcharge.toLocaleString()}đ
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Applied Pricing Rules Badges / Tags */}
          {appliedPricingRules.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Quy tắc định giá áp dụng:
              </span>
              {appliedPricingRules.map((rule) => (
                <div
                  key={rule.ruleId}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    rule.isDiscount
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                      : 'bg-purple-50/80 border-purple-200 text-purple-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{rule.isDiscount ? '🎉' : '⚡'}</span>
                    <span>{rule.name}</span>
                    <span className="text-[10px] opacity-75 font-medium">
                      ({rule.ticketCount} vé)
                    </span>
                  </div>
                  <span className="font-extrabold">
                    {rule.isDiscount ? '-' : '+'}
                    {Math.abs(rule.totalAdjustment).toLocaleString()}đ
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Selected Food Combos Summary (If selected) */}
      {selectedFoodList.length > 0 && (
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Bắp Nước Đã Chọn ({selectedFoodList.length})</span>
          </span>

          <div className="flex flex-col gap-2 pt-1">
            {selectedFoodList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-gray-100"
              >
                <div className="flex items-center gap-2 font-bold text-[#131413]">
                  <span>{item.name}</span>
                  <span className="text-[#7C6FE8]">x{item.quantity}</span>
                </div>
                <span className="font-bold text-slate-700">
                  {item.price.toLocaleString()}đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Discounts Breakdown Lines */}
      {tierDiscountAmount > 0 && (
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs font-bold text-amber-600">
          <span>Ưu đãi thành viên {tierName ? `(${tierName})` : ''}</span>
          <span>-{tierDiscountAmount.toLocaleString()}đ</span>
        </div>
      )}

      {voucherDiscountAmount > 0 && (
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs font-bold text-emerald-600">
          <span>Voucher Khuyến Mãi</span>
          <span>-{voucherDiscountAmount.toLocaleString()}đ</span>
        </div>
      )}

      {/* Fallback discount line if neither specific discount is provided but total discountAmount > 0 */}
      {tierDiscountAmount === 0 && voucherDiscountAmount === 0 && discountAmount > 0 && (
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs font-bold text-emerald-600">
          <span>Khuyến Mãi / Giảm Giá</span>
          <span>-{discountAmount.toLocaleString()}đ</span>
        </div>
      )}

      {/* 6.5. Detailed VAT Tax Breakdown Line */}
      {vatBreakdown && vatBreakdown.totalVatAmount > 0 && (
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50 border border-gray-100 text-xs">
          <div className="flex items-center justify-between text-slate-700 font-bold">
            <div className="flex items-center gap-1.5">
              <span>Thuế GTGT (VAT)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Đã gồm trong giá
              </span>
            </div>
            <span className="font-extrabold text-slate-800">
              {vatBreakdown.totalVatAmount.toLocaleString()}đ
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-1 border-t border-gray-200/60 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center justify-between">
              <span>• VAT Vé xem phim ({vatBreakdown.ticketVatRate}%):</span>
              <span className="font-semibold text-slate-700">
                {vatBreakdown.ticketVatAmount.toLocaleString()}đ
              </span>
            </div>
            {vatBreakdown.comboVatAmount > 0 && (
              <div className="flex items-center justify-between">
                <span>• VAT Bắp nước F&B ({vatBreakdown.comboVatRate}%):</span>
                <span className="font-semibold text-slate-700">
                  {vatBreakdown.comboVatAmount.toLocaleString()}đ
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Grand Total Price */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            TỔNG THANH TOÁN
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            (Đã bao gồm VAT)
          </span>
        </div>
        <span className="text-2xl font-extrabold text-[#7C6FE8]">
          {grandTotal.toLocaleString()}đ
        </span>
      </div>

      {/* 8. Terms & Conditions Agreement Checkbox */}
      <div className="flex items-start gap-2.5 text-xs text-slate-600 pt-1">
        <input
          type="checkbox"
          id="terms-check"
          checked={isAgreedTerms}
          onChange={(e) => onToggleTerms(e.target.checked)}
          className="mt-0.5 rounded border-gray-300 text-[#7C6FE8] focus:ring-[#7C6FE8] cursor-pointer"
        />
        <label htmlFor="terms-check" className="cursor-pointer select-none leading-tight">
          Tôi đã đọc và đồng ý với{' '}
          <span className="text-[#7C6FE8] font-bold">Điều khoản & Điều kiện đặt vé</span> tại rạp CineDot.
        </label>
      </div>

      {/* 9. Confirm Payment Action Button */}
      <motion.button
        whileHover={isAgreedTerms && !isProcessing ? { scale: 1.03 } : {}}
        whileTap={isAgreedTerms && !isProcessing ? { scale: 0.97 } : {}}
        disabled={!isAgreedTerms || isProcessing}
        onClick={onSubmitPayment}
        className={`w-full py-4 rounded-full font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
          isAgreedTerms && !isProcessing
            ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-xl shadow-[#7C6FE8]/35'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{isProcessing ? 'ĐANG XỬ LÝ GIAO DỊCH...' : 'XÁC NHẬN THANH TOÁN'}</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};
