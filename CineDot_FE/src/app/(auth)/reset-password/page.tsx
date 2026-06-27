'use client';

import React from 'react';
import { AuthShell, ResetPasswordForm } from '@/modules/auth';

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Đặt lại mật khẩu" subtitle="Thiết lập mật khẩu mới cho tài khoản của bạn">
      <ResetPasswordForm />
    </AuthShell>
  );
}
