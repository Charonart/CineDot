'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Check, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { ChangePasswordPayload } from '../types/profile.types';

interface TabSecurityProps {
  onUpdatePassword: (payload: ChangePasswordPayload) => Promise<{ success: boolean; message?: string }>;
  updateSuccess: boolean;
  errorMsg?: string;
}

export const TabSecurity: React.FC<TabSecurityProps> = ({
  onUpdatePassword,
  updateSuccess,
  errorMsg,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!currentPassword) {
      setLocalError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setLocalError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await onUpdatePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || errorMsg;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-extrabold text-[#131413]">Bảo Mật Tài Khoản</h2>
        <p className="text-xs text-slate-500">Quản lý mật khẩu và các thiết lập bảo vệ tài khoản cá nhân của bạn.</p>
      </div>

      {updateSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Đổi mật khẩu thành công! Mật khẩu mới của bạn đã được cập nhật.</span>
        </div>
      )}

      {displayError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_16px_50px_rgba(0,0,0,0.03)] flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-extrabold text-[#131413]">Đổi Mật Khẩu</h3>
            <span className="text-xs text-slate-500">Nên sử dụng mật khẩu mạnh bao gồm chữ hoa, số và ký tự đặc biệt</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#131413]">Mật Khẩu Hiện Tại</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/20 text-xs font-medium outline-hidden transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#131413]">Mật Khẩu Mới</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/20 text-xs font-medium outline-hidden transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#131413]">Xác Nhận Mật Khẩu Mới</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/20 text-xs font-medium outline-hidden transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-extrabold shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security Tip Box */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-gray-100 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-[#7C6FE8] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-[#131413]">Lời khuyên bảo mật</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Không chia sẻ mật khẩu tài khoản CineDot với người khác. CineDot sẽ không bao giờ yêu cầu bạn cung cấp mật khẩu qua điện thoại hoặc tin nhắn.
          </p>
        </div>
      </div>
    </div>
  );
};
