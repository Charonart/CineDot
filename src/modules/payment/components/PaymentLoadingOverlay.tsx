'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, Lock } from 'lucide-react';

interface PaymentLoadingOverlayProps {
  isOpen: boolean;
  paymentMethodName: string;
}

export const PaymentLoadingOverlay: React.FC<PaymentLoadingOverlayProps> = ({
  isOpen,
  paymentMethodName,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(124,111,232,0.3)] border border-gray-100 flex flex-col items-center text-center gap-6 z-10"
        >
          {/* Animated Spinner Icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#7C6FE8]/10 flex items-center justify-center text-[#7C6FE8]">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-extrabold text-[#131413]">
              Đang Kết Nối Cổng Thanh Toán...
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Vui lòng không tắt hoặc tải lại trang web trong quá trình giao dịch qua{' '}
              <strong className="text-[#7C6FE8]">{paymentMethodName}</strong>.
            </p>
          </div>

          {/* Secure SSL Tag */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mã hóa bảo mật 256-bit SSL</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
