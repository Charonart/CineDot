'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminStaff } from '../hooks/useAdminStaff';
import { AdminRole, AdminStaffItem, ROLE_NAME_MAP, ROLE_DEFINITIONS } from '../types/admin.types';
import { createStaffSchema, updateStaffRoleSchema } from '../schemas/adminStaff.schema';
import {
  Users,
  UserPlus,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Shield,
  Trash2,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  Mail,
  Phone,
  User,
  Edit3,
  Eye,
  Key,
  Calendar,
} from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';

export function AdminStaffManagementView() {
  const { adminUser } = useAdminAuthStore();

  // Search & Filter States
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Hook 100% Real API
  const {
    staffList,
    pagination,
    isLoading,
    isFetching,
    cinemas,
    createStaff,
    isCreating,
    updateStaff,
    updateStaffRole,
    isUpdating,
    isUpdatingRole,
    toggleStaffStatus,
    isTogglingStatus,
    deleteStaff,
    isDeleting,
  } = useAdminStaff({
    search: searchTerm || undefined,
    role: selectedRole !== 'ALL' ? selectedRole : undefined,
    cinema_id: selectedCinemaId !== 'ALL' ? selectedCinemaId : undefined,
    page: currentPage,
    per_page: 10,
  });

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminStaffItem | null>(null);
  const [viewingStaff, setViewingStaff] = useState<AdminStaffItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form States for Create
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<AdminRole>('TICKET_STAFF');
  const [createCinemaId, setCreateCinemaId] = useState<string>('');
  const [createPhone, setCreatePhone] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Form States for Edit
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<AdminRole>('TICKET_STAFF');
  const [editCinemaId, setEditCinemaId] = useState<string>('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Set default cinema in create modal when cinemas load
  useEffect(() => {
    if (cinemas.length > 0 && !createCinemaId) {
      setCreateCinemaId(cinemas[0].id);
    }
  }, [cinemas, createCinemaId]);

  // Initialize edit form when an employee is selected
  const handleOpenEdit = (staff: AdminStaffItem) => {
    setEditingStaff(staff);
    setEditName(staff.name);
    setEditPhone(staff.phone || '');
    setEditRole(staff.role);
    setEditCinemaId(staff.cinemaId ? String(staff.cinemaId) : (cinemas[0]?.id || ''));
    setEditError('');
    setEditSuccess('');
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    const targetCinema = cinemas.find((c) => c.id === createCinemaId);
    const cinemaName = createRole === 'SUPER_ADMIN' ? 'Toàn Bộ Cụm Rạp' : (targetCinema?.name || 'Chưa phân công');

    const validationResult = createStaffSchema.safeParse({
      name: createName.trim(),
      email: createEmail.trim(),
      password: createPassword,
      role: createRole,
      cinemaName,
      cinemaId: createRole === 'SUPER_ADMIN' ? null : createCinemaId,
      phone: createPhone.trim() || undefined,
    });

    if (!validationResult.success) {
      setCreateError(validationResult.error.errors[0]?.message || 'Dữ liệu không hợp lệ!');
      return;
    }

    try {
      await createStaff({
        name: createName.trim(),
        email: createEmail.trim(),
        password: createPassword,
        role: createRole,
        cinema_id: createRole === 'SUPER_ADMIN' ? null : createCinemaId,
        cinema_name: cinemaName,
        phone: createPhone.trim() || undefined,
      });

      setCreateSuccess(`Đã tạo thành công tài khoản nhân viên cho ${createName}!`);
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setCreateName('');
        setCreateEmail('');
        setCreatePassword('');
        setCreatePhone('');
        setCreateSuccess('');
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setCreateError(errorObj?.message || 'Không thể tạo tài khoản nhân sự!');
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setEditError('');
    setEditSuccess('');

    const targetCinema = cinemas.find((c) => c.id === editCinemaId);
    const cinemaName = editRole === 'SUPER_ADMIN' ? 'Toàn Bộ Cụm Rạp' : (targetCinema?.name || 'Chưa phân công');

    const roleValidation = updateStaffRoleSchema.safeParse({
      role: editRole,
      cinemaId: editRole === 'SUPER_ADMIN' ? null : editCinemaId,
      cinemaName,
    });

    if (!roleValidation.success) {
      setEditError(roleValidation.error.errors[0]?.message || 'Dữ liệu không hợp lệ!');
      return;
    }

    try {
      // 1. Update Profile Info
      await updateStaff({
        id: editingStaff.id,
        payload: {
          name: editName.trim(),
          phone: editPhone.trim() || undefined,
          cinema_id: editRole === 'SUPER_ADMIN' ? null : editCinemaId,
          cinema_name: cinemaName,
        },
      });

      // 2. Update Role & Permissions if changed
      if (editRole !== editingStaff.role || editCinemaId !== String(editingStaff.cinemaId)) {
        await updateStaffRole({
          id: editingStaff.id,
          payload: {
            role: editRole,
            cinema_id: editRole === 'SUPER_ADMIN' ? null : editCinemaId,
            cinema_name: cinemaName,
          },
        });
      }

      setEditSuccess(`Đã cập nhật thông tin cho ${editName}!`);
      setTimeout(() => {
        setEditingStaff(null);
        setEditSuccess('');
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setEditError(errorObj?.message || 'Cập nhật tài khoản thất bại!');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'ACTIVE' | 'DISABLED') => {
    const targetStaff = staffList.find((u) => u.id === id);
    if (targetStaff?.role === 'SUPER_ADMIN') {
      alert('Không thể khóa tài khoản Tổng Quản Trị Hệ Thống!');
      return;
    }
    const nextStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await toggleStaffStatus({ id, status: nextStatus });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert(errorObj?.message || 'Không thể thay đổi trạng thái tài khoản!');
    }
  };

  const handleDeleteStaff = async () => {
    if (!deletingId) return;
    const targetStaff = staffList.find((u) => u.id === deletingId);
    if (targetStaff?.role === 'SUPER_ADMIN') {
      alert('Không thể xóa tài khoản Tổng Quản Trị Hệ Thống!');
      setDeletingId(null);
      return;
    }
    try {
      await deleteStaff(deletingId);
      setDeletingId(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert(errorObj?.message || 'Không thể xóa tài khoản nhân sự!');
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

        {/* Create Staff Button (Visible to Super Admin) */}
        {adminUser?.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ THÊM NHÂN VIÊN MỚI</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên, email nhân sự..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Lọc theo vai trò"
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#7C6FE8] transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="SUPER_ADMIN">Tổng Quản Trị Hệ Thống</option>
            <option value="CINEMA_MANAGER">Quản Lý Cụm Rạp</option>
            <option value="TICKET_STAFF">Nhân Viên Soát Vé</option>
          </select>

          {/* Cinema Filter */}
          <select
            value={selectedCinemaId}
            onChange={(e) => {
              setSelectedCinemaId(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Lọc theo cụm rạp"
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#7C6FE8] transition-all cursor-pointer max-w-[200px] truncate"
          >
            <option value="ALL">Tất cả cụm rạp</option>
            {cinemas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200/80 flex flex-col gap-4 shadow-sm relative">
        {isFetching && !isLoading && (
          <div className="absolute top-4 right-6 flex items-center gap-1.5 text-xs font-bold text-[#7C6FE8] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Đang cập nhật...</span>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-3.5 rounded-l-xl">Họ Và Tên</th>
                <th className="p-3.5">Email Công Việc</th>
                <th className="p-3.5">Vai Trò Phân Quyền</th>
                <th className="p-3.5">Cụm Rạp Phụ Trách</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 rounded-r-xl text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-3.5"><Skeleton variant="text" className="w-32 h-4" /></td>
                    <td className="p-3.5"><Skeleton variant="text" className="w-40 h-4" /></td>
                    <td className="p-3.5"><Skeleton variant="text" className="w-28 h-4" /></td>
                    <td className="p-3.5"><Skeleton variant="text" className="w-36 h-4" /></td>
                    <td className="p-3.5"><Skeleton variant="text" className="w-16 h-4" /></td>
                    <td className="p-3.5 text-right"><Skeleton variant="text" className="w-20 h-4 ml-auto" /></td>
                  </tr>
                ))
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    Không tìm thấy nhân viên nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                staffList.map((u) => {
                  const isCurrentUser = adminUser?.id === u.id;
                  const isSuper = u.role === 'SUPER_ADMIN';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C6FE8] flex items-center justify-center font-black text-xs shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900">{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">ID: {u.id}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-600 font-medium">{u.email}</td>

                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                              : u.role === 'CINEMA_MANAGER'
                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          <span>{ROLE_NAME_MAP[u.role] || u.roleName}</span>
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-600 font-medium">{u.cinemaName || 'Toàn Bộ Cụm Rạp'}</td>

                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Đang Hoạt Động' : 'Đã Khóa'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail Button */}
                          <button
                            onClick={() => setViewingStaff(u)}
                            className="p-1.5 rounded-xl bg-slate-50 text-slate-600 border border-gray-200 hover:bg-slate-100 transition-all cursor-pointer"
                            title="Xem chi tiết quyền hạn"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {adminUser?.role === 'SUPER_ADMIN' && !isCurrentUser && (
                            <>
                              {/* Edit Staff Button (Only for non-Super Admin or profile edit) */}
                              {!isSuper ? (
                                <>
                                  <button
                                    onClick={() => handleOpenEdit(u)}
                                    className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer"
                                    title="Chỉnh sửa thông tin & vai trò"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Toggle Lock Button (Protected: Cannot lock other Super Admins) */}
                                  <button
                                    onClick={() => handleToggleStatus(u.id, u.status)}
                                    disabled={isTogglingStatus}
                                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                                      u.status === 'ACTIVE'
                                        ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                    title={u.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                                  >
                                    {u.status === 'ACTIVE' ? (
                                      <Lock className="w-3.5 h-3.5" />
                                    ) : (
                                      <Unlock className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  {/* Delete Button (Protected: Cannot delete other Super Admins) */}
                                  <button
                                    onClick={() => setDeletingId(u.id)}
                                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
                                    title="Xóa tài khoản nhân viên"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-lg select-none">
                                  Bảo Vệ Gốc
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.lastPage > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-xs text-slate-500 font-medium">
              Trang {pagination.currentPage} / {pagination.lastPage} ({pagination.total} nhân sự)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.currentPage <= 1}
                className="p-2 rounded-xl bg-slate-50 border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.lastPage, p + 1))}
                disabled={pagination.currentPage >= pagination.lastPage}
                className="p-2 rounded-xl bg-slate-50 border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Staff Account */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-purple-100 p-7 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#7C6FE8]/10 text-[#7C6FE8] flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Thêm Tài Khoản Nhân Sự Mới</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Họ Và Tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Anh"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Công Việc</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      placeholder="nhanvien@cinedot.vn"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Số Điện Thoại</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      placeholder="0901234567"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Mật Khẩu Khởi Tạo Ban Đầu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Vai Trò Phân Quyền</label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as AdminRole)}
                    aria-label="Vai trò phân quyền"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">Tổng Quản Trị Hệ Thống</option>
                    <option value="CINEMA_MANAGER">Quản Lý Cụm Rạp</option>
                    <option value="TICKET_STAFF">Nhân Viên Soát Vé Cổng</option>
                  </select>
                </div>

                {createRole !== 'SUPER_ADMIN' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Cụm Rạp Phụ Trách</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={createCinemaId}
                        onChange={(e) => setCreateCinemaId(e.target.value)}
                        aria-label="Chọn cụm rạp phân công"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] transition-all cursor-pointer"
                      >
                        {cinemas.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang khởi tạo...</span>
                    </>
                  ) : (
                    <span>Xác Nhận Tạo Tài Khoản</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Staff Account */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-blue-100 p-7 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Chỉnh Sửa Nhân Sự</h3>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {editSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{editSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStaff} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Họ Và Tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Email (Không thể sửa)</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 border border-gray-200 text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Số Điện Thoại</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="0901234567"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Vai Trò Phân Quyền</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as AdminRole)}
                    aria-label="Vai trò phân quyền"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">Tổng Quản Trị Hệ Thống</option>
                    <option value="CINEMA_MANAGER">Quản Lý Cụm Rạp</option>
                    <option value="TICKET_STAFF">Nhân Viên Soát Vé Cổng</option>
                  </select>
                </div>

                {editRole !== 'SUPER_ADMIN' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Cụm Rạp Phụ Trách</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={editCinemaId}
                        onChange={(e) => setEditCinemaId(e.target.value)}
                        aria-label="Chọn cụm rạp phân công"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        {cinemas.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  disabled={isUpdating || isUpdatingRole}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || isUpdatingRole}
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isUpdating || isUpdatingRole ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu Thay Đổi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Staff Detail */}
      {viewingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-7 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center font-black text-sm">
                  {viewingStaff.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-extrabold text-slate-900">{viewingStaff.name}</h3>
                  <span className="text-xs text-slate-500">{viewingStaff.email}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingStaff(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Role & Scope Badge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Vai trò:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      viewingStaff.role === 'SUPER_ADMIN'
                        ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                        : viewingStaff.role === 'CINEMA_MANAGER'
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>{ROLE_NAME_MAP[viewingStaff.role]}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Cụm rạp phụ trách:</span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {viewingStaff.cinemaName || 'Toàn Bộ Cụm Rạp'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Số điện thoại:</span>
                  <span className="text-xs font-bold text-slate-700">{viewingStaff.phone || 'Chưa cập nhật'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Ngày tạo:</span>
                  <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{viewingStaff.createdAt}</span>
                  </span>
                </div>
              </div>

              {/* Permissions list */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>Quyền Hạn Được Cấp:</span>
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-2xl bg-slate-50 border border-gray-200/60">
                  {viewingStaff.role === 'SUPER_ADMIN' ? (
                    <span className="text-xs font-extrabold text-[#7C6FE8] bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
                      ★ Toàn quyền hệ thống (*)
                    </span>
                  ) : (
                    (viewingStaff.permissions || ROLE_DEFINITIONS[viewingStaff.role]?.defaultPermissions || []).map(
                      (p) => (
                        <span
                          key={p}
                          className="text-[10px] font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-gray-200"
                        >
                          {p}
                        </span>
                      )
                    )
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingStaff(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer mt-2"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Staff */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-rose-100 p-6 shadow-2xl flex flex-col gap-4 text-center items-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-base font-extrabold text-slate-900">Xóa Tài Khoản Nhân Sự?</h3>
              <p className="text-xs text-slate-500 font-medium">
                Hành động này sẽ xóa vĩnh viễn quyền truy cập của nhân viên này trên hệ thống CineDot.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteStaff}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Xác Nhận Xóa</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
