'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/useAuthStore';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectUrl);
    } else {
      openAuthModal('forgot', '', redirectUrl);
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, openAuthModal, redirectUrl, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFEFE]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#7C6FE8] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">Đang mở trang khôi phục mật khẩu...</p>
      </div>
    </div>
  );
}
