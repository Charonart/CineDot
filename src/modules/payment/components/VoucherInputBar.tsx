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
    <div className="w-full bg-white rounded-3xl p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-[#131413] flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#7C6FE8]" />
          <span>Mã Giảm Giá / Voucher Khuyến Mãi</span>
        </h3>
        <span className="text-xs text-[#7C6FE8] font-bold">Thử mã: CINEDOT50K</span>
      </div>

      {appliedVoucher ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                <span>MÃ {appliedVoucher.code}</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <span className="text-xs text-emerald-700">{appliedVoucher.description}</span>
            </div>
          </div>

          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Gỡ mã giảm giá"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onApply()}
              placeholder="Nhập mã khuyến mãi (VD: CINEDOT50K, MOMODAY)"
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 focus:border-[#7C6FE8] focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
            />

            <button
              onClick={onApply}
              disabled={isApplying || !voucherInput.trim()}
              className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                voucherInput.trim()
                  ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-md shadow-[#7C6FE8]/30'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isApplying ? 'Đang áp dụng...' : 'Áp Dụng'}
            </button>
          </div>

          {voucherError && (
            <p className="text-xs font-semibold text-rose-500 pl-1">{voucherError}</p>
          )}
        </div>
      )}
    </div>
  );
};
