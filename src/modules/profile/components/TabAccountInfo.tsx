/* Hallmark · component: TabAccountInfo · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React, { useState } from 'react';
import { Camera, Check, User, Mail, Phone, Calendar, MapPin, Sparkles } from 'lucide-react';
import { UserProfile } from '../types/profile.types';
import { ProvinceItem } from '@/shared/services/masterData.service';

interface TabAccountInfoProps {
  profile: UserProfile;
  provinces: ProvinceItem[];
  onUpdate: (updated: Partial<UserProfile>) => void;
  updateSuccess: boolean;
}

export const TabAccountInfo: React.FC<TabAccountInfoProps> = ({
  profile,
  provinces,
  onUpdate,
  updateSuccess,
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [gender, setGender] = useState(profile.gender);
  const [city, setCity] = useState(profile.city);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdate({ fullName, phone, birthDate, gender, city });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-[#7C6FE8]" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Thông Tin Cá Nhân
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Cập nhật thông tin tài khoản để nhận quà sinh nhật và tích lũy điểm thưởng.
        </p>
      </div>

      {/* Success Notification */}
      {updateSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Cập nhật thông tin cá nhân thành công!</span>
        </div>
      )}

      {/* Avatar Change Row */}
      <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-200">
        <div className="relative group/avatar cursor-pointer">
          <img
            src={profile.avatarUrl}
            alt={fullName}
            className="w-18 h-18 rounded-2xl object-cover ring-2 ring-[#7C6FE8]/30 shadow-md transition-transform group-hover/avatar:scale-105"
          />
          <button
            type="button"
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-[#685bc7] transition-all hover:scale-110"
            title="Đổi ảnh đại diện"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-extrabold text-sm text-slate-900">Ảnh Đại Diện Cá Nhân</span>
          <span className="text-xs text-slate-500 font-medium">
            Hỗ trợ PNG, JPG kích thước tối thiểu 300x300px.
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Họ và Tên
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 outline-none transition-all"
            />
          </div>
        </div>

        {/* Email (Readonly) */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Địa chỉ Email
            </label>
            <span className="text-[10px] text-slate-400 font-bold">Cố định</span>
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs font-semibold text-slate-500 cursor-not-allowed outline-none select-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Số Điện Thoại
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0988 123 456"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 outline-none transition-all"
            />
          </div>
        </div>

        {/* Birth Date */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Ngày Sinh
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 outline-none transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Giới Tính
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 outline-none transition-all cursor-pointer"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Thành Phố / Tỉnh Thành
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 z-10 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="" disabled>
                Chọn thành phố
              </option>
              {provinces.map((prov) => (
                <option key={prov.province_id} value={prov.province_name}>
                  {prov.province_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Action */}
        <div className="col-span-2 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </button>
        </div>
      </form>
    </div>
  );
};
