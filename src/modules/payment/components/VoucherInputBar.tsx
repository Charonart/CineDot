/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: VoucherInputBar */
'use client';

import React from 'react';
import { Tag, Check, X, Sparkles } from 'lucide-react';
import { VoucherInfo } from '../types/payment.types';

interface VoucherInputBarProps {
  voucherInput: string;
  onInputChange: (val: string) => void;
  appliedVoucher: VoucherInfo | null;
  voucherError: string;
  isApplying: boolean;
  onApply: () => void;
  onRemove: () => void;
}

export const VoucherInputBar: React.FC<VoucherInputBarProps> = ({
  voucherInput,
  onInputChange,
  appliedVoucher,
  voucherError,
  isApplying,
  onApply,
  onRemove,
}) => {
  return (
    <section
      aria-label="Nhập mã khuyến mãi"
      className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-200/90 flex flex-col gap-4 select-none transition-colors"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm sm:text-base text-gray-950 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <span>Mã Giảm Giá / Voucher Khuyến Mãi</span>
        </h3>
        <span className="text-[11px] text-[#7C6FE8] font-bold bg-[#EEECFB] px-2.5 py-1 rounded-full border border-[#7C6FE8]/20">
          Gợi ý: CINEDOT50K
        </span>
      </div>

      {appliedVoucher ? (
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs text-emerald-950">
                Mã {appliedVoucher.code} đã áp dụng
              </span>
              <span className="text-xs text-emerald-700 font-medium">{appliedVoucher.description}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Gỡ mã giảm giá"
            aria-label="Gỡ mã giảm giá"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onApply()}
              placeholder="Nhập mã khuyến mãi (VD: CINEDOT50K, MOMODAY)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200/90 focus:border-[#7C6FE8] focus:bg-white text-xs font-bold text-gray-950 placeholder-gray-400 outline-none transition-all"
            />

            <button
              type="button"
              onClick={onApply}
              disabled={isApplying || !voucherInput.trim()}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                voucherInput.trim()
                  ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-[0_2px_8px_rgba(124,111,232,0.3)]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isApplying ? 'Đang áp dụng...' : 'Áp Dụng'}
            </button>
          </div>

          {voucherError && (
            <p className="text-xs font-bold text-rose-500 pl-1">{voucherError}</p>
          )}
        </div>
      )}
    </section>
  );
};

