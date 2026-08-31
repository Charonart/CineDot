/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · theme: White Minimal · component: PublicRouteError */
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { logger } from '@lib/logger/logger';

export default function PublicRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Public route-level error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center select-none bg-[#FAFAFB]">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col items-center gap-6">
        {/* Error Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Messaging */}
        <div className="flex flex-col gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-black uppercase tracking-wider self-center">
            Gián đoạn kỹ thuật
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-snug">
            Không Thể Tải Nội Dung Trang
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
            Hệ thống gặp sự cố tạm thời khi xử lý yêu cầu. Dữ liệu tài khoản và các giao dịch của bạn vẫn an toàn.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-1">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(124,111,232,0.3)] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử tải lại</span>
          </button>

          <Link href="/" className="w-full sm:flex-1">
            <button
              type="button"
              className="w-full py-3 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Về trang chủ</span>
            </button>
          </Link>
        </div>

        {/* Support */}
        <div className="pt-2 border-t border-gray-100 w-full flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Hỗ trợ kỹ thuật: <strong>support@cinedot.vn</strong> | Hotline <strong>1900 1234</strong></span>
        </div>
      </div>
    </div>
  );
}

