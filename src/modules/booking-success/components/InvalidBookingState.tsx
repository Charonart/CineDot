/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · theme: White Minimal · component: InvalidBookingState */
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, Ticket, HelpCircle } from 'lucide-react';

interface InvalidBookingStateProps {
  message?: string;
  subMessage?: string;
}

export const InvalidBookingState: React.FC<InvalidBookingStateProps> = ({
  message = 'Không tìm thấy thông tin vé hoặc chưa thanh toán',
  subMessage = 'Đơn đặt vé này không tồn tại, đã hết hạn giữ chỗ hoặc chưa được xác nhận thanh toán thành công từ cổng thanh toán.',
}) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-6 select-none">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>

      {/* Message Block */}
      <div className="flex flex-col gap-2 max-w-md">
        <span className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-black uppercase tracking-wider self-center">
          Xác thực đơn hàng
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-snug">
          {message}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
          {subMessage}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
        <Link href="/profile" className="w-full sm:flex-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_2px_10px_rgba(124,111,232,0.3)] cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Xem vé của tôi</span>
          </motion.button>
        </Link>

        <Link href="/" className="w-full sm:flex-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </motion.button>
        </Link>
      </div>

      {/* Support hotline notice */}
      <div className="pt-2 border-t border-gray-100 w-full flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Cần hỗ trợ tra cứu giao dịch? Liên hệ Hotline <strong>1900 1234</strong></span>
      </div>
    </div>
  );
};
