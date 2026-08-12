'use client';

import React, { useState } from 'react';
import { Camera, Check, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { UserProfile } from '../types/profile.types';

interface TabAccountInfoProps {
  profile: UserProfile;
  onUpdate: (updated: Partial<UserProfile>) => void;
  updateSuccess: boolean;
}

export const TabAccountInfo: React.FC<TabAccountInfoProps> = ({
  profile,
  onUpdate,
  updateSuccess,
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [gender, setGender] = useState(profile.gender);
  const [city, setCity] = useState(profile.city);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ fullName, phone, birthDate, gender, city });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-extrabold text-[#131413]">Thông Tin Cá Nhân</h2>
        <p className="text-xs text-slate-500">Quản lý thông tin hồ sơ cá nhân để bảo mật tài khoản và tích điểm rạp.</p>
      </div>

      {updateSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Cập nhật thông tin cá nhân thành công!</span>
        </div>
      )}

      {/* Avatar Change Row */}
      <div className="flex items-center gap-5 p-4 rounded-3xl bg-slate-50 border border-gray-100">
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt={fullName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#7C6FE8]/30"
          />
          <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-[#685bc7]">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-xs text-[#131413]">Ảnh Đại Diện Cá Nhân</span>
          <span className="text-[11px] text-slate-500">Khuyên dùng định dạng PNG, JPG kích thước vuông.</span>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-slate-700">Họ và Tên</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
            />
          </div>
        </div>

        {/* Email (Readonly) */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-slate-700">Địa chỉ Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 border border-gray-200 text-xs font-semibold text-slate-500 cursor-not-allowed outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-slate-700">Số Điện Thoại</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
            />
          </div>
        </div>

        {/* Birth Date */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-slate-700">Ngày Sinh</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-slate-700">Giới Tính</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none cursor-pointer"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-slate-700">Thành Phố</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
            />
          </div>
        </div>

        <div className="col-span-2 pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer"
          >
            LƯU THAY ĐỔI
          </button>
        </div>
      </form>
    </div>
  );
};
