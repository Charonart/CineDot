'use client';

import React from 'react';
import { CreditCard, Wallet, QrCode, Building, CheckCircle2 } from 'lucide-react';
import { PaymentMethodId, PaymentMethodItem } from '../types/payment.types';

interface PaymentMethodSelectorProps {
  methods: PaymentMethodItem[];
  selectedId: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedId,
  onSelect,
}) => {
  const getCategoryIcon = (id: PaymentMethodId) => {
    switch (id) {
      case 'MOMO':
      case 'ZALOPAY':
      case 'SHOPEEPAY':
        return <Wallet className="w-5 h-5 text-[#7C6FE8]" />;
      case 'VIETQR':
        return <QrCode className="w-5 h-5 text-emerald-600" />;
      case 'ATM':
        return <Building className="w-5 h-5 text-indigo-600" />;
      case 'VISA':
        return <CreditCard className="w-5 h-5 text-amber-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-[#131413] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#7C6FE8] rounded-full inline-block" />
          <span>Phương Thức Thanh Toán</span>
        </h2>
        <p className="text-xs text-slate-500 pl-3.5">
          Vui lòng chọn hình thức thanh toán thuận tiện nhất cho bạn
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {methods.map((method) => {
          const isSelected = method.id === selectedId;
          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-purple-50/50 border-[#7C6FE8] ring-2 ring-[#7C6FE8]/20 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  {getCategoryIcon(method.id)}
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#131413]">{method.name}</span>
                    {method.badgeText && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                        {method.badgeText}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-medium line-clamp-1">
                    {method.subtitle}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-[#7C6FE8] fill-[#7C6FE8]/10" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
