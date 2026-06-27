'use client';

import React from 'react';
import { AuthShell, ForgotPasswordForm } from '@/modules/auth';

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Khôi phục mật khẩu" subtitle="Chúng tôi sẽ hỗ trợ bạn lấy lại mật khẩu">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
