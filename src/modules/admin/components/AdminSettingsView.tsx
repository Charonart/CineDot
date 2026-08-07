'use client';

import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, CheckCircle2, Globe, Phone, Mail } from 'lucide-react';

export function AdminSettingsView() {
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

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="w-4 h-4" />
          <span>CẤU HÌNH HỆ THỐNG PHẦN MỀM</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Thiết Lập Cấu Hình Chung
        </h1>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Đã lưu thành công toàn bộ thay đổi cấu hình hệ thống!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-gray-100 pb-3">
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
                className="px-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
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
                className="px-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
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
              className="px-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-gray-100 pb-3">
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
          className="px-8 py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit self-end mt-2"
        >
          <Save className="w-4 h-4" />
          <span>LƯU CẤU HÌNH</span>
        </button>
      </form>
    </div>
  );
}
