'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { AdminRole } from '../types/admin.types';
import { Users, UserPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminStaffManagementView() {
  const { adminUsersList, addStaffAccount, initAdminStore, adminUser } = useAdminAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminRole>('TICKET_STAFF');
  const [cinemaName, setCinemaName] = useState('Galaxy CineX Hanoi Centre');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    initAdminStore();
  }, [initAdminStore]);

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu khởi tạo!');
      return;
    }

    const res = addStaffAccount({
      name,
      email,
      password,
      role,
      cinemaName,
      phone,
    });

    if (res.success) {
      setSuccessMsg(`Đã tạo thành công tài khoản nhân viên cho ${name}!`);
      setTimeout(() => {
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setSuccessMsg('');
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Tạo tài khoản thất bại!');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>QUẢN TRỊ QUYỀN HẠN & NHÂN SỰ</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Danh Sách Tài Khoản Nhân Sự
          </h1>
        </div>

        {/* Create Staff Button (Visible to Super Admin or Manager) */}
        {adminUser?.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ THÊM NHÂN VIÊN MỚI</span>
          </button>
        )}
      </div>

      {/* Staff Table */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200/80 flex flex-col gap-4 shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-3.5 rounded-l-xl">Họ Và Tên</th>
                <th className="p-3.5">Email Công Việc</th>
                <th className="p-3.5">Vai Trò Phân Quyền</th>
                <th className="p-3.5">Cụm Rạp Phụ Trách</th>
                <th className="p-3.5">Ngày Tạo</th>
                <th className="p-3.5 rounded-r-xl">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {adminUsersList.map((u) => (
                <tr key={u.id} className="hover:bg-purple-50/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#7C6FE8] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-3.5 text-slate-700 font-mono">{u.email}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                          : u.role === 'CINEMA_MANAGER'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {u.roleName}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{u.cinemaName || 'Toàn Bộ Cụm Rạp'}</td>
                  <td className="p-3.5 text-slate-500">{u.createdAt}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                      ĐANG HOẠT ĐỘNG
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal + Thêm Nhân Viên Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Thêm Nhân Viên Mới</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Họ và tên nhân viên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hải"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Email công việc (đăng nhập)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hai.nguyen@cinedot.vn"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Mật khẩu khởi tạo</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Vai trò phân quyền</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                  >
                    <option value="TICKET_STAFF">Nhân Viên Soát Vé Cổng</option>
                    <option value="CINEMA_MANAGER">Quản Lý Cụm Rạp</option>
                    <option value="SUPER_ADMIN">Tổng Quản Trị Hệ Thống</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Cụm rạp phụ trách</label>
                  <select
                    value={cinemaName}
                    onChange={(e) => setCinemaName(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                  >
                    <option value="Galaxy CineX Hanoi Centre">Galaxy CineX Hanoi Centre</option>
                    <option value="CineDot Ba Đình Centre">CineDot Ba Đình Centre</option>
                    <option value="CineDot Landmark 81 Saigon">CineDot Landmark 81 Saigon</option>
                    <option value="CineDot Đà Nẵng Premier">CineDot Đà Nẵng Premier</option>
                    <option value="Toàn Bộ Cụm Rạp">Toàn Bộ Cụm Rạp</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  TẠO TÀI KHOẢN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
