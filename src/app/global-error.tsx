/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · theme: White Minimal · component: GlobalError */
'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { logger } from '@lib/logger/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Critical System Global Error:', error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="bg-[#FAFAFB] text-gray-900 font-sans antialiased min-h-screen flex items-center justify-center p-4 selection:bg-[#7C6FE8] selection:text-white">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider self-center">
              Lỗi Hệ Thống
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-snug">
              Sự Cố Ứng Dụng Nghiêm Trọng
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
              Đã xảy ra lỗi ngoài dự kiến trong nhân hệ thống. Vui lòng tải lại hoặc quay về trang chủ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-1">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:flex-1 py-3 px-5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(124,111,232,0.3)] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khởi động lại</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/';
              }}
              className="w-full sm:flex-1 py-3 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Về trang chủ</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

