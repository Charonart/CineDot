/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: PaymentLoadingOverlay */
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Subtle Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs"
        />

        {/* Minimal Processing Pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white rounded-2xl px-6 py-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-gray-200/90 flex items-center gap-4 z-10 select-none max-w-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-[#EEECFB] text-[#7C6FE8] flex items-center justify-center shrink-0">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-gray-950">
              Đang kết nối thanh toán
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Chuyển tiếp qua {paymentMethodName}…
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


