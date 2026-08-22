'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdminUserDTO, CreateUserPayload, UpdateUserPayload } from '../../dto/adminUserManagement.dto';

interface CustomerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<any>;
  userToEdit?: AdminUserDTO | null;
  provinces?: { province_id: number; province_name: string }[];
}

export function CustomerStudioModal({
  isOpen,
  onClose,
  onSave,
  userToEdit,
  provinces = [],
}: CustomerStudioModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [birthday, setBirthday] = useState('');
  const [provinceId, setProvinceId] = useState<number | string>('');
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username || '');
      setEmail(userToEdit.email || '');
      setFullname(userToEdit.fullname || '');
      setPhone(userToEdit.phone || '');
      setGender((userToEdit.gender as any) || 'male');
      setBirthday(userToEdit.birthday || '');
      setProvinceId(userToEdit.province_id || '');
      setIsActive(userToEdit.is_active ?? true);
      setPassword('');
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setFullname('');
      setPhone('');
      setGender('male');
      setBirthday('');
      setProvinceId('');
      setIsActive(true);
    }
    setStatusMsg(null);
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      if (userToEdit) {
        const payload: UpdateUserPayload = {
          fullname: fullname.trim() || undefined,
          phone: phone.trim() || undefined,
          gender,
          birthday: birthday || undefined,
          province_id: provinceId ? Number(provinceId) : undefined,
          password: password ? password : undefined,
          is_active: isActive,
        };
        await onSave(payload);
        setStatusMsg({ type: 'success', text: 'Cập nhật thông tin hội viên thành công!' });
      } else {
        const payload: CreateUserPayload = {
          username: username.trim(),
          email: email.trim(),
          password,
          fullname: fullname.trim() || undefined,
          phone: phone.trim() || undefined,
          gender,
          birthday: birthday || undefined,
          province_id: provinceId ? Number(provinceId) : undefined,
          is_active: isActive,
        };
        await onSave(payload);
        setStatusMsg({ type: 'success', text: 'Tạo tài khoản hội viên mới thành công!' });
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin hội viên.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative text-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              {userToEdit ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {userToEdit ? 'Chỉnh Sửa Hồ Sơ Hội Viên' : 'Đăng Ký Hội Viên Mới'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {userToEdit ? 'Cập nhật thông tin khách hàng' : 'Tạo tài khoản hội viên thủ công cho khách'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Row 1: Username & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Tên Đăng Nhập <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!!userToEdit}
                placeholder="VD: nguyenvanan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Địa Chỉ Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                disabled={!!userToEdit}
                placeholder="an.nguyen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Row 2: Fullname & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Họ Và Tên
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn An"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Số Điện Thoại
              </label>
              <input
                type="text"
                placeholder="0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Row 3: Gender, Birthday & Province */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Giới Tính
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-bold text-slate-800 bg-white"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Ngày Sinh
              </label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Tỉnh / Thành Phố
              </label>
              <select
                value={provinceId}
                onChange={(e) => setProvinceId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-bold text-slate-800 bg-white"
              >
                <option value="">-- Chọn Tỉnh/TP --</option>
                {provinces.map((p) => (
                  <option key={p.province_id} value={p.province_id}>
                    {p.province_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password (Required for create, optional for update) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              {userToEdit ? 'Mật Khẩu Mới (Bỏ trống nếu không đổi)' : 'Mật Khẩu Khởi Tạo *'}
            </label>
            <input
              type="password"
              required={!userToEdit}
              placeholder="Tối thiểu 6 ký tự..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-900"
            />
          </div>

          {/* Trạng thái hoạt động */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800">Trạng Thái Tài Khoản</span>
              <span className="text-[11px] text-slate-500">
                Cho phép hội viên đăng nhập và đặt vé trực tuyến
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C6FE8]"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl border border-gray-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#7C6FE8]/30 flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{userToEdit ? 'LƯU THAY ĐỔI' : '+ ĐĂNG KÝ HỘI VIÊN'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
