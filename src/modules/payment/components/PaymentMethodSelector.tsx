/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: PaymentMethodSelector */
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
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <section
      aria-label="Lựa chọn phương thức thanh toán"
      className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-200/90 flex flex-col gap-5 select-none transition-colors"
    >
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base sm:text-lg font-extrabold text-gray-950 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#7C6FE8] rounded-full inline-block" />
          <span>Phương Thức Thanh Toán</span>
        </h2>
        <p className="text-xs text-gray-500 pl-3.5 font-medium">
          Vui lòng chọn cổng thanh toán an toàn và phù hợp
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {methods.map((method) => {
          const isSelected = method.id === selectedId;
          const isDisabled = method.isDisabled;

          return (
            <div
              key={method.id}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) onSelect(method.id);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                isDisabled
                  ? 'bg-gray-50/70 border-gray-200 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'bg-[#EEECFB]/40 border-2 border-[#7C6FE8] ring-2 ring-[#7C6FE8]/20 shadow-[0_2px_10px_rgba(124,111,232,0.15)] cursor-pointer'
                  : 'bg-white hover:bg-gray-50/80 border-gray-200/90 hover:border-gray-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center shrink-0">
                  {getCategoryIcon(method.id)}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs sm:text-sm text-gray-950">{method.name}</span>
                    {method.badgeText && (
                      <span className="px-2 py-0.2 rounded-full bg-amber-50 text-amber-800 text-[9px] font-bold border border-amber-200/80">
                        {method.badgeText}
                      </span>
                    )}
                    {method.disabledReason && (
                      <span className="px-2 py-0.2 rounded-full bg-gray-100 text-gray-500 text-[9px] font-medium border border-gray-200">
                        {method.disabledReason}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium truncate">
                    {method.subtitle}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                {isSelected && !isDisabled ? (
                  <CheckCircle2 className="w-5 h-5 text-[#7C6FE8]" />
                ) : (
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

