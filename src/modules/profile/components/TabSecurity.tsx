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

      {updateSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Đổi mật khẩu tài khoản thành công!</span>
        </div>
      )}

      {/* 1. Change Password Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
        <h3 className="font-bold text-sm text-[#131413] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#7C6FE8]" />
          <span>Đổi Mật Khẩu</span>
        </h3>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-700">Mật Khẩu Hiện Tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-700">Mật Khẩu Mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-700">Xác Nhận Mật Khẩu Mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer mt-1"
        >
          CẬP NHẬT MẬT KHẨU
        </button>
      </form>

      {/* 2. 2FA Security Switch */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7C6FE8]/10 text-[#7C6FE8] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-[#131413]">Xác Thực 2 Lớp (2FA SMS OTP)</span>
            <span className="text-[11px] text-slate-500">Gửi mã OTP xác nhận về SĐT khi đăng nhập thiết bị mới.</span>
          </div>
        </div>

        <button
          onClick={() => setIs2FAEnabled(!is2FAEnabled)}
          className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
            is2FAEnabled ? 'bg-[#7C6FE8]' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              is2FAEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 3. Active Sessions */}
      <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white border border-gray-100 shadow-2xs">
        <h3 className="font-bold text-sm text-[#131413]">Thiết Bị Đang Đăng Nhập</h3>
        <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#7C6FE8]" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-800">Windows PC - Chrome Browser</span>
              <span className="text-[10px] text-emerald-600 font-bold">● Đang hoạt động (Thiết bị này)</span>
            </div>
          </div>
          <span className="text-slate-400">Hà Nội, VN</span>
        </div>

        <div className="flex items-center justify-between text-xs py-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-400" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-800">iPhone 15 Pro - CineDot App</span>
              <span className="text-[10px] text-slate-400 font-semibold">Hoạt động 2 giờ trước</span>
            </div>
          </div>
          <button className="text-[11px] font-bold text-rose-500 hover:underline">Đăng xuất</button>
        </div>
      </div>
    </div>
  );
};
