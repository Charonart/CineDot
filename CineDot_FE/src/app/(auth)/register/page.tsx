'use client';

import React from 'react';
import { AuthShell, RegisterForm } from '@/modules/auth';

export default function RegisterPage() {
  return (
    <AuthShell title="Đăng ký tài khoản" subtitle="Trở thành thành viên của CINE ngay hôm nay">
      <RegisterForm />
    </AuthShell>
  );
}
