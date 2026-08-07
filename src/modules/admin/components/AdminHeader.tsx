'use client';

import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { LogOut, Building2, Bell } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const { adminUser, logoutAdmin } = useAdminAuthStore();

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200/80 text-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
      <div className="flex items-center gap-3">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
          {adminUser?.roleName || 'BẢO MẬT HỆ THỐNG'}
        </span>
        {adminUser?.cinemaName && (
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 border-l border-gray-200 pl-3">
            <Building2 className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>{adminUser.cinemaName}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#7C6FE8] absolute top-1.5 right-1.5" />
        </button>

        {/* User Info Capsule */}
        <div className="flex items-center gap-3 bg-slate-100 px-3.5 py-1.5 rounded-full border border-gray-200">
          <div className="w-7 h-7 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
            {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-slate-900 leading-tight">
              {adminUser?.name || 'Admin User'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {adminUser?.email || 'admin@cinedot.vn'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-gray-200 transition-all cursor-pointer"
          title="Đăng xuất khỏi Admin"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
