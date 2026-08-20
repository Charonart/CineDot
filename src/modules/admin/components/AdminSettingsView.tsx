'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Save,
  CheckCircle2,
  Globe,
  Phone,
  Mail,
  LogOut,
  Loader2,
  ShieldCheck,
  User,
  Building2,
} from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminAuth } from '../hooks/useAdminAuth';

export function AdminSettingsView() {
  const router = useRouter();
  const { adminUser } = useAdminAuthStore();
  const { logout, isLoggingOut } = useAdminAuth();

  const [brandName, setBrandName] = useState('CineDot Cinema System');
  const [hotline, setHotline] = useState('1900 6017');
  const [supportEmail, setSupportEmail] = useState('support@cinedot.vn');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/admin/login');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Cài Đặt Hệ Thống & Tài Khoản
          </h1>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Đã lưu thành công toàn bộ thay đổi cấu hình hệ thống!</span>
        </div>
      )}

      {/* 1. Account & Session Management Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">Tài Khoản Đang Đăng Nhập</h3>
              <span className="text-[11px] text-slate-400">Thông tin phiên làm việc hiện tại</span>
            </div>
          </div>

          <span className="text-xs font-extrabold text-[#7C6FE8] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            {adminUser?.roleName || 'Quản trị viên'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400">Họ và tên</span>
            <span className="text-xs font-black text-slate-900">{adminUser?.name || 'Admin User'}</span>
          </div>

          <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400">Email đăng nhập</span>
            <span className="text-xs font-bold text-slate-900 truncate">{adminUser?.email || 'admin@cinedot.vn'}</span>
          </div>

          <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400">Cụm rạp phụ trách</span>
            <span className="text-xs font-bold text-slate-900">{adminUser?.cinemaName || 'Toàn hệ thống'}</span>
          </div>
        </div>

        {/* Prominent Logout Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-slate-500 font-medium">
            Đăng xuất tài khoản khỏi phiên làm việc quản trị portal
          </span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Đăng xuất khỏi hệ thống"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>{isLoggingOut ? 'ĐANG ĐĂNG XUẤT...' : 'ĐĂNG XUẤT'}</span>
          </button>
        </div>
      </div>

      {/* 2. System General Settings Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-black text-sm text-slate-900 border-b border-gray-100 pb-3">
            Thông Tin Thương Hiệu & Liên Hệ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#7C6FE8]" />
                <span>Tên hệ thống</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#7C6FE8]" />
                <span>Hotline hỗ trợ 24/7</span>
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>Email CSKH</span>
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
          <h3 className="font-black text-sm text-slate-900 border-b border-gray-100 pb-3">
            Trạng Thái Vận Hành & Bảo Trì
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-slate-900">Bảo Trì Hệ Thống Đặt Vé</span>
              <span className="text-[11px] text-slate-500 font-medium">Bật công tắc nếu muốn thông báo tạm dừng bán vé trên app & web</span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 accent-[#7C6FE8] cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#7C6FE8]/25 transition-all cursor-pointer w-fit self-end mt-2"
        >
          <Save className="w-4 h-4" />
          <span>LƯU CẤU HÌNH</span>
        </button>
      </form>
    </div>
  );
}
