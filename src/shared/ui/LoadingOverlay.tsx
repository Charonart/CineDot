'use client';

import React from 'react';

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

export function LoadingOverlay({
  isVisible,
  message = 'Đang xử lý giao dịch...',
  subMessage = 'Vui lòng không đóng trình duyệt hoặc làm mới trang.',
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      <div className="flex flex-col items-center max-w-sm p-8 rounded-3xl bg-white/90 dark:bg-[#141514]/90 border border-white/20 shadow-2xl text-center">
        {/* Glowing Pulse Spinner */}
        <div className="relative flex items-center justify-center w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[#7C6FE8]/20 animate-ping" />
          <div className="w-14 h-14 rounded-full border-4 border-[#7C6FE8] border-t-transparent animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-[var(--text)] mb-2">{message}</h3>
        <p className="text-xs text-[var(--muted)] leading-relaxed">{subMessage}</p>
      </div>
    </div>
  );
}
