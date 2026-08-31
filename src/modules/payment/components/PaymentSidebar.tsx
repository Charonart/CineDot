/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: PaymentSidebar */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Timer, Ticket, ShieldCheck, ArrowRight, ShoppingBag, Sparkles, Tag, Lock } from 'lucide-react';
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
  itemizedSeats?: { id: string; typeName: string; price: number }[];
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
  itemizedSeats = [],
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
    <aside
      aria-label="Tóm tắt đơn hàng thanh toán"
      className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/90 flex flex-col gap-4 sticky top-28 select-none transition-colors"
    >
      {/* 1. Active Countdown Timer */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs">
        <div className="flex items-center gap-2 font-bold">
          <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Thời gian giữ vé:</span>
        </div>
        <span className="font-extrabold text-sm text-amber-700 font-mono tracking-wider">
          {formattedCountdown}
        </span>
      </div>

      {/* 2. Movie Info */}
      <div className="flex gap-3.5 items-start border-b border-gray-100 pb-4">
        <div className="w-16 aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <img
            src={posterUrl}
            alt={movieTitle}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[9px] font-black uppercase tracking-wider">
              {movieFormat}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[9px] font-bold border border-amber-200/80">
              Khán giả {ageRating}
            </span>
          </div>

          <h3 className="font-extrabold text-sm text-gray-950 leading-snug line-clamp-2">
            {movieTitle}
          </h3>
        </div>
      </div>

      {/* 3. Cinema & Showtime Info */}
      <div className="flex flex-col gap-2.5 text-xs text-gray-700 border-b border-gray-100 pb-3.5">
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-950">{cinemaName}</span>
            <span className="text-gray-500 font-medium">Phòng chiếu IMAX Laser</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span>
            Suất: <strong className="text-gray-950 font-bold">{showTime}</strong> — {showDate}
          </span>
        </div>
      </div>

      {/* 4. Selected Seats Summary & Pricing Rules */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Tiền Vé Xem Phim ({itemizedSeats.length || 1})</span>
          </span>
          <span className="font-extrabold text-[#7C6FE8] text-sm sm:text-base">
            {ticketPrice.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          {itemizedSeats.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {itemizedSeats.map((seat, sIdx) => (
                <div
                  key={`${seat.id}-${sIdx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200/70"
                >
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <span className="px-2 py-0.5 rounded-md bg-[#EEECFB] text-[#7C6FE8] text-xs font-black">
                      {seat.id}
                    </span>
                    <span className="text-gray-600 font-medium text-[11px]">
                      {seat.typeName}
                    </span>
                  </div>
                  <span className="font-extrabold text-gray-900">
                    {seat.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 flex flex-col gap-1.5">
              <span className="font-bold text-gray-950 leading-relaxed">{seatSummaryText}</span>
            </div>
          )}


          {appliedPricingRules.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                Quy tắc định giá áp dụng:
              </span>
              {appliedPricingRules.map((rule) => (
                <div
                  key={rule.ruleId}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    rule.isDiscount
                      ? 'bg-emerald-50/80 border-emerald-200/90 text-emerald-900'
                      : 'bg-purple-50/80 border-purple-200/90 text-purple-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {rule.isDiscount ? <Tag className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />}
                    <span>{rule.name}</span>
                    <span className="text-[10px] opacity-75 font-medium">
                      ({rule.ticketCount} vé)
                    </span>
                  </div>
                  <span className="font-black">
                    {rule.isDiscount ? '-' : '+'}
                    {Math.abs(rule.totalAdjustment).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Food Summary */}
      {selectedFoodList.length > 0 && (
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-3.5">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Bắp Nước Đã Chọn ({selectedFoodList.length})</span>
          </span>

          <div className="flex flex-col gap-1.5 pt-0.5">
            {selectedFoodList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gray-50 border border-gray-200/70"
              >
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <span>{item.name}</span>
                  <span className="text-[#7C6FE8] font-black">x{item.quantity}</span>
                </div>
                <span className="font-extrabold text-gray-900">
                  {item.price.toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Discounts */}
      {tierDiscountAmount > 0 && (
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 text-xs font-bold text-amber-600">
          <span>Ưu đãi thành viên {tierName ? `(${tierName})` : ''}</span>
          <span>-{tierDiscountAmount.toLocaleString('vi-VN')}đ</span>
        </div>
      )}

      {voucherDiscountAmount > 0 && (
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 text-xs font-bold text-emerald-600">
          <span>Voucher Khuyến Mãi</span>
          <span>-{voucherDiscountAmount.toLocaleString('vi-VN')}đ</span>
        </div>
      )}

      {tierDiscountAmount === 0 && voucherDiscountAmount === 0 && discountAmount > 0 && (
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 text-xs font-bold text-emerald-600">
          <span>Khuyến Mãi / Giảm Giá</span>
          <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
        </div>
      )}

      {/* 6.5. Detailed VAT Tax */}
      {vatBreakdown && vatBreakdown.totalVatAmount > 0 && (
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-200/70 text-xs">
          <div className="flex items-center justify-between text-gray-800 font-bold">
            <div className="flex items-center gap-1.5">
              <span>Thuế GTGT (VAT)</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Đã gồm trong giá
              </span>
            </div>
            <span className="font-black text-gray-900">
              {vatBreakdown.totalVatAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-1 border-t border-gray-200/60 text-[11px] text-gray-500 font-medium">
            <div className="flex items-center justify-between">
              <span>• VAT Vé xem phim ({vatBreakdown.ticketVatRate}%):</span>
              <span className="font-semibold text-gray-700">
                {vatBreakdown.ticketVatAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
            {vatBreakdown.comboVatAmount > 0 && (
              <div className="flex items-center justify-between">
                <span>• VAT Bắp nước F&B ({vatBreakdown.comboVatRate}%):</span>
                <span className="font-semibold text-gray-700">
                  {vatBreakdown.comboVatAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Grand Total */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            TỔNG THANH TOÁN
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            (Đã bao gồm VAT)
          </span>
        </div>
        <span className="text-2xl font-black text-[#7C6FE8]">
          {grandTotal.toLocaleString('vi-VN')}đ
        </span>
      </div>

      {/* 8. Terms Checkbox */}
      <div className="flex items-start gap-2.5 text-xs text-gray-600 pt-1">
        <input
          type="checkbox"
          id="terms-check"
          checked={isAgreedTerms}
          onChange={(e) => onToggleTerms(e.target.checked)}
          className="mt-0.5 rounded border-gray-300 text-[#7C6FE8] focus:ring-[#7C6FE8] cursor-pointer"
        />
        <label htmlFor="terms-check" className="cursor-pointer select-none leading-tight font-medium">
          Tôi đã đọc và đồng ý với{' '}
          <span className="text-[#7C6FE8] font-bold">Điều khoản & Điều kiện đặt vé</span> tại CineDot.
        </label>
      </div>

      {/* 9. Confirm Payment Action Button */}
      <motion.button
        type="button"
        whileHover={isAgreedTerms && !isProcessing ? { scale: 1.02 } : {}}
        whileTap={isAgreedTerms && !isProcessing ? { scale: 0.98 } : {}}
        disabled={!isAgreedTerms || isProcessing}
        onClick={onSubmitPayment}
        className={`w-full py-3.5 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
          isAgreedTerms && !isProcessing
            ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-[0_4px_14px_rgba(124,111,232,0.35)]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        <Lock className="w-4 h-4" />
        <span>{isProcessing ? 'ĐANG XỬ LÝ GIAO DỊCH...' : 'XÁC NHẬN THANH TOÁN'}</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </aside>
  );
};

