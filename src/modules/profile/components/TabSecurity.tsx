/* Hallmark · component: TabSecurity · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Check,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldAlert,
} from 'lucide-react';
import { ChangePasswordPayload } from '../types/profile.types';

interface TabSecurityProps {
  onUpdatePassword: (
    payload: ChangePasswordPayload
  ) => Promise<{ success: boolean; message?: string }>;
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

  // Password strength calculation
  const hasMinLength = newPassword.length >= 6;
  const hasNumber = /\d/.test(newPassword);
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const strengthScore = (hasMinLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasLetter ? 1 : 0);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-[#7C6FE8]" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Bảo Mật Tài Khoản
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Quản lý mật khẩu và các thiết lập bảo vệ thông tin đăng nhập của bạn.
        </p>
      </div>

      {/* Success Notification */}
      {updateSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-300">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Đổi mật khẩu thành công! Mật khẩu mới của bạn đã được cập nhật an toàn.</span>
        </div>
      )}

      {/* Error Notification */}
      {displayError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col gap-6">
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center border border-purple-100">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-black text-slate-900">Thiết Lập Mật Khẩu Mới</h3>
            <span className="text-xs text-slate-500 font-medium">
              Khuyến khích sử dụng mật khẩu bao gồm chữ cái, số và ký tự đặc biệt
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Mật Khẩu Hiện Tại
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu đang dùng"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 text-xs font-semibold text-slate-900 outline-none transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Mật Khẩu Mới
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 text-xs font-semibold text-slate-900 outline-none transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden flex gap-1">
                  <div
                    className={`h-full flex-1 rounded-full transition-colors ${
                      strengthScore >= 1 ? 'bg-amber-400' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-colors ${
                      strengthScore >= 2 ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-colors ${
                      strengthScore >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  {strengthScore === 3 ? 'Mạnh' : strengthScore === 2 ? 'Trung bình' : 'Yếu'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Xác Nhận Mật Khẩu Mới
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 text-xs font-semibold text-slate-900 outline-none transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT MẬT KHẨU'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security Tip Box */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-[#7C6FE8] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-black text-slate-900">Cam Kết Bảo Mật CineDot</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            CineDot không bao giờ yêu cầu bạn cung cấp mật khẩu qua điện thoại, email hay tin nhắn.
            Tuyệt đối không chia sẻ mã OTP hoặc mật khẩu cho bất kỳ ai.
          </p>
        </div>
      </div>
    </div>
  );
};
