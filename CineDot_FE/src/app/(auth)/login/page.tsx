'use client';

import React from 'react';
import { AuthShell, LoginForm } from '@/modules/auth';

export default function LoginPage() {
  return (
    <AuthShell title="Đăng nhập tài khoản" subtitle="Chào mừng bạn quay lại với CINE">
      <LoginForm />
    </AuthShell>
  );
}
