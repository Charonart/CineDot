/* Hallmark · genre: modern-minimal · macrostructure: Bento Grid · theme: White Minimal / Iris Cinema · nav: N5 · footer: Ft5 */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, Ticket, HelpCircle, Film, RotateCcw } from 'lucide-react';

interface InvalidBookingStateProps {
  message?: string;
  subMessage?: string;
}

export const InvalidBookingState: React.FC<InvalidBookingStateProps> = ({
  message = 'Không tìm thấy thông tin vé hoặc chưa thanh toán',
  subMessage = 'Đơn đặt vé này không tồn tại, đã hết hạn giữ chỗ hoặc chưa được xác nhận thanh toán thành công từ cổng thanh toán.',
}) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.05)] flex flex-col items-center text-center gap-6 select-none animate-in fade-in zoom-in-95 duration-300">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>

      {/* Message Block */}
      <div className="flex flex-col gap-2 max-w-md">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider self-center border border-amber-200">
          Xác thực đơn đặt vé
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          {message}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          {subMessage}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-1">
        <Link href="/profile?tab=tickets" className="w-full sm:flex-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#7C6FE8]/25 cursor-pointer active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            <span>Xem vé của tôi</span>
          </motion.button>
        </Link>

        <Link href="/movies" className="w-full sm:flex-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Film className="w-4 h-4 text-[#7C6FE8]" />
            <span>Đặt vé lại</span>
          </motion.button>
        </Link>
      </div>

      {/* Support hotline notice */}
      <div className="pt-2 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <HelpCircle className="w-3.5 h-3.5 text-[#7C6FE8]" />
        <span>Cần hỗ trợ tra cứu giao dịch? Hotline: <strong className="text-slate-700">1900 1234</strong></span>
      </div>
    </div>
  );
};
