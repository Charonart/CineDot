'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Check, Smartphone, Monitor } from 'lucide-react';

interface TabSecurityProps {
  onUpdatePassword: () => void;
  updateSuccess: boolean;
}

export const TabSecurity: React.FC<TabSecurityProps> = ({
  onUpdatePassword,
  updateSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePassword();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-extrabold text-[#131413]">Bảo Mật Tài Khoản</h2>
        <p className="text-xs text-slate-500">Quản lý mật khẩu, xác thực 2 lớp và phiên đăng nhập thiết bị.</p>
      </div>

      <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center gap-3">
        <ShieldCheck className="w-12 h-12 stroke-[1.5] text-slate-300" />
        <h3 className="text-sm font-extrabold text-slate-600">Tính năng đang được phát triển</h3>
        <p className="text-xs font-medium">Chức năng đổi mật khẩu và quản lý bảo mật nâng cao sẽ sớm ra mắt trong các phiên bản tiếp theo.</p>
      </div>
    </div>
  );
};
