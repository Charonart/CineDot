'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Shield,
  Trash2,
  Lock,
  Unlock,
  Building2,
  Mail,
  Phone,
  Edit3,
  Eye,
  Key,
  Calendar,
  Loader2,
} from 'lucide-react';
import { UsersStaffSubNavTabs } from './users/UsersStaffSubNavTabs';
import { useAdminRoles } from '../hooks/useAdminRoles';
import { adminStaffService } from '../services/adminStaff.service';
import { CineDataTable, useServerTable } from '@/shared/components/table';
import { CineColumnDef, BulkAction } from '@/shared/types/dataTable.types';
import { StaffContextRolesModal } from './modals/StaffContextRolesModal';

export function AdminStaffManagementView() {
  const { adminUser } = useAdminAuthStore();
  const { roles = [] } = useAdminRoles();

  const availableRoles = useMemo(() => {
    return roles.length > 0
      ? roles.filter((r) => r.name !== 'customer')
      : [
          { id: 1, name: 'admin', description: 'Tổng Quản Trị Hệ Thống (Super Admin)' },
          { id: 4, name: 'cinema_manager', description: 'Quản Lý Cụm Rạp' },
          { id: 5, name: 'ticket_staff', description: 'Nhân Viên Soát Vé Cổng' },
          { id: 6, name: 'fnb_staff', description: 'Nhân Viên Quầy Bắp Nước' },
          { id: 7, name: 'marketing', description: 'Chuyên Viên Marketing' },
          { id: 8, name: 'accountant', description: 'Kế Toán & Doanh Thu' },
        ];
  }, [roles]);

  const isSystemRole = (roleStr?: string | null) =>
    ['admin', 'super_admin', 'super admin', 'marketing', 'accountant'].includes((roleStr || '').toLowerCase());

  // Hook 100% Real API
  const {
    cinemas,
    createStaff,
    isCreating,
    updateStaff,
    updateStaffRole,
    isUpdating,
    isUpdatingRole,
    toggleStaffStatus,
    deleteStaff,
  } = useAdminStaff();

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminStaffItem | null>(null);
  const [viewingStaff, setViewingStaff] = useState<AdminStaffItem | null>(null);
  const [managingRolesStaff, setManagingRolesStaff] = useState<AdminStaffItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form States for Create
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<string>('ticket_staff');
  const [createCinemaId, setCreateCinemaId] = useState<string>('');
  const [createPhone, setCreatePhone] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Form States for Edit
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<string>('ticket_staff');
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

    const isSystemScope = isSystemRole(createRole);
    const targetCinema = cinemas.find((c) => c.id === createCinemaId);
    const cinemaName = isSystemScope ? 'Toàn Bộ Cụm Rạp' : (targetCinema?.name || 'Chưa phân công');

    const validationResult = createStaffSchema.safeParse({
      name: createName.trim(),
      email: createEmail.trim(),
      password: createPassword,
      role: createRole,
      cinemaName,
      cinemaId: isSystemScope ? null : createCinemaId,
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
        role: createRole as AdminRole,
        cinema_id: isSystemScope ? null : createCinemaId,
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

    const isSystemScope = isSystemRole(editRole);
    const targetCinema = cinemas.find((c) => c.id === editCinemaId);
    const cinemaName = isSystemScope ? 'Toàn Bộ Cụm Rạp' : (targetCinema?.name || 'Chưa phân công');

    const roleValidation = updateStaffRoleSchema.safeParse({
      role: editRole,
      cinemaId: isSystemScope ? null : editCinemaId,
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
          cinema_id: isSystemScope ? null : editCinemaId,
          cinema_name: cinemaName,
        },
      });

      // 2. Update Role & Permissions if changed
      if (editRole !== editingStaff.role || editCinemaId !== String(editingStaff.cinemaId)) {
        await updateStaffRole({
          id: editingStaff.id,
          payload: {
            role: editRole as AdminRole,
            cinema_id: isSystemScope ? null : editCinemaId,
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
    try {
      await deleteStaff(deletingId);
      setDeletingId(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert(errorObj?.message || 'Không thể xóa tài khoản nhân sự!');
    }
  };

  // ── Universal CineDataTable Column Definitions ──
  const columns: CineColumnDef<AdminStaffItem>[] = useMemo(
    () => [
      {
        key: 'id',
        title: 'ID',
        dataType: 'text',
        sortable: true,
        filterable: true,
        width: 70,
        align: 'center',
        sticky: 'left',
        format: (val) => <span className="font-mono text-slate-400 font-bold">#{val}</span>,
      },
      {
        key: 'name',
        title: 'Họ Và Tên',
        dataType: 'text',
        sortable: true,
        filterable: true,
        editable: true,
        format: (val, row) => (
          <div className="flex items-center gap-2.5 font-bold text-slate-900">
            <div className="w-7 h-7 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center font-black text-xs shrink-0">
              {String(val || '').charAt(0).toUpperCase()}
            </div>
            <span
              onClick={() => setViewingStaff(row)}
              className="hover:text-[#7C6FE8] cursor-pointer"
            >
              {val}
            </span>
          </div>
        ),
      },
      {
        key: 'email',
        title: 'Email Công Việc',
        dataType: 'text',
        sortable: true,
        filterable: true,
      },
      {
        key: 'phone',
        title: 'Số Điện Thoại',
        dataType: 'text',
        filterable: true,
        editable: true,
        format: (val) => (
          <span className="font-mono text-slate-600 font-semibold">{val || '---'}</span>
        ),
      },
      {
        key: 'role',
        title: 'Vai Trò Phân Quyền',
        dataType: 'select',
        sortable: true,
        filterable: true,
        options: availableRoles.map((r) => ({
          label: `${r.name.toUpperCase()} - ${r.description || r.name}`,
          value: r.name,
        })),
        cell: ({ row }) => {
          const userRoles = row.userRoles || [];
          if (userRoles.length > 0) {
            return (
              <div className="flex flex-wrap gap-1 max-w-[240px]">
                {userRoles.map((ur) => {
                  const isSuper = ur.roleName.toLowerCase().includes('admin');
                  return (
                    <span
                      key={ur.id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        isSuper
                          ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                          : ur.roleName.toLowerCase().includes('manager')
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}
                    >
                      <Shield className="w-2.5 h-2.5" />
                      <span>{ur.roleName}</span>
                      {ur.scopeType === 'cinema' && ur.scopeName && (
                        <span className="text-[9px] font-medium text-slate-500 normal-case">
                          ({ur.scopeName})
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            );
          }

          const isSuper = isSystemRole(row.role);
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                isSuper
                  ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                  : String(row.role).toLowerCase().includes('manager')
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{row.roleName}</span>
            </span>
          );
        },
      },
      {
        key: 'cinemaName',
        title: 'Cụm Rạp Phụ Trách',
        dataType: 'select',
        filterable: true,
        options: [
          { label: 'Toàn Bộ Cụm Rạp', value: 'Toàn Bộ Cụm Rạp' },
          ...cinemas.map((c) => ({ label: c.name, value: c.name })),
        ],
        format: (val) => <span className="font-semibold text-slate-700">{val || 'Toàn Bộ Cụm Rạp'}</span>,
      },
      {
        key: 'status',
        title: 'Trạng Thái',
        dataType: 'boolean',
        sortable: true,
        filterable: true,
        editable: true,
        width: 120,
        align: 'center',
        format: (val, row) => (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              row.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}
          >
            {row.status === 'ACTIVE' ? 'Đang Hoạt Động' : 'Đã Khóa'}
          </span>
        ),
      },
      {
        key: 'actions',
        title: 'Thao Tác',
        dataType: 'custom',
        width: 160,
        align: 'right',
        sticky: 'right',
        filterable: false,
        renderCell: (u) => {
          const isCurrentUser = adminUser?.id === u.id;
          const isSuper = u.role === 'SUPER_ADMIN';

          return (
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setManagingRolesStaff(u)}
                className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all cursor-pointer"
                title="Phân quyền ngữ cảnh (Context Roles & Scope)"
              >
                <Shield className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setViewingStaff(u)}
                className="p-1.5 rounded-xl bg-purple-50 text-[#7C6FE8] hover:bg-purple-100 transition-all cursor-pointer"
                title="Xem chi tiết phân quyền"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              {adminUser?.role === 'SUPER_ADMIN' && (
                <>
                  <button
                    onClick={() => handleOpenEdit(u)}
                    className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                    title="Chỉnh sửa thông tin"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {!isCurrentUser && !isSuper ? (
                    <>
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                        title={u.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {u.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setDeletingId(u.id)}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                        title="Xóa tài khoản nhân sự"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : null}
                </>
              )}
            </div>
          );
        },
      },
    ],
    [availableRoles, cinemas, adminUser]
  );

  // ── Hook: Server-Side Table Controller (URL Sync + Query + Inline Edit + Bulk) ──
  const table = useServerTable<AdminStaffItem>({
    queryKey: ['admin', 'staff'],
    fetcher: (params) => adminStaffService.getStaffList({ role: 'staff_all', ...params }),
    updateCell: async (id: string | number, field: string, newValue: any): Promise<any> => {
      if (field === 'name' || field === 'phone') {
        return updateStaff({
          id: String(id),
          payload: {
            [field]: newValue,
          },
        });
      } else if (field === 'status') {
        const nextStatus = newValue ? 'ACTIVE' : 'DISABLED';
        return toggleStaffStatus({ id: String(id), status: nextStatus });
      }
    },
    bulkAction: (action: string, ids: (string | number)[]) => adminStaffService.bulkAction(action as any, ids),
    columns,
    exportFileName: 'danh_sach_nhan_su_cinedot',
    defaultPerPage: 10,
  });

  // ── Bulk Actions for Universal CineDataTable ──
  const bulkActions: BulkAction<AdminStaffItem>[] = useMemo(
    () => [
      {
        key: 'bulk_active_staff',
        label: 'Mở Khóa Đã Chọn',
        icon: <Unlock className="w-3.5 h-3.5" />,
        variant: 'primary',
        onClick: async (selectedRows, ids) => {
          await table.handleBulkAction('set_active');
        },
      },
      {
        key: 'bulk_inactive_staff',
        label: 'Khóa Đã Chọn',
        icon: <Lock className="w-3.5 h-3.5" />,
        variant: 'amber',
        onClick: async (selectedRows, ids) => {
          await table.handleBulkAction('set_inactive');
        },
      },
    ],
    [table]
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Shared Sub-Nav Tabs */}
      <UsersStaffSubNavTabs />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>QUẢN TRỊ QUYỀN HẠN & NHÂN SỰ (NOTION & SHEETS DATA GRID)</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Danh Sách Tài Khoản Nhân Sự
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Quản lý đội ngũ nhân viên rạp chiếu, gán vai trò theo ngữ cảnh và phân quyền toàn diện.
          </p>
        </div>

        {/* Create Staff Button (Visible to Super Admin) */}
        {adminUser?.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ THÊM NHÂN VIÊN MỚI</span>
          </button>
        )}
      </div>

      {/* Universal CineDataTable */}
      <CineDataTable<AdminStaffItem>
        table={table}
        bulkActions={bulkActions}
        exportFileName="danh_sach_nhan_su_cinedot"
      />

      {/* Modal: Create Staff Account */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-purple-100 p-7 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-extrabold text-slate-900">Tạo Tài Khoản Nhân Viên Mới</h3>
                  <span className="text-xs text-slate-500">Cấp tài khoản đăng nhập nội bộ cho nhân sự</span>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Họ Và Tên</label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Đăng Nhập</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      placeholder="staff@cinedot.vn"
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
                    onChange={(e) => setCreateRole(e.target.value)}
                    aria-label="Vai trò phân quyền"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-all cursor-pointer"
                  >
                    {availableRoles.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name.toUpperCase()} - {r.description || r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!isSystemRole(createRole) && (
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
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-extrabold text-xs hover:bg-slate-200 transition-all cursor-pointer"
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
                    <span>Tạo Tài Khoản</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Staff Account & Scope */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-purple-100 p-7 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-extrabold text-slate-900">Chỉnh Sửa Quyền Hạn Nhân Sự</h3>
                  <span className="text-xs text-slate-500">Cập nhật thông tin và điều phối cụm rạp quản lý</span>
                </div>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {editSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{editSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStaff} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Họ Và Tên</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
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
                    onChange={(e) => setEditRole(e.target.value)}
                    aria-label="Vai trò phân quyền"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {availableRoles.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name.toUpperCase()} - {r.description || r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!isSystemRole(editRole) && (
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
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-extrabold text-xs hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Hủy Bỏ
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
                  {(() => {
                    const roleStr = String(viewingStaff.role || '');
                    const matched = availableRoles.find(
                      (r) => String(r.name || '').toLowerCase() === roleStr.toLowerCase()
                    );
                    const isSuper = isSystemRole(roleStr);
                    const title = matched
                      ? matched.name.toUpperCase()
                      : ROLE_NAME_MAP[viewingStaff.role as AdminRole] ||
                        viewingStaff.roleName ||
                        roleStr.toUpperCase();

                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          isSuper
                            ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                            : roleStr.toLowerCase().includes('manager')
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{title}</span>
                      </span>
                    );
                  })()}
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
                    (viewingStaff.permissions || ROLE_DEFINITIONS[viewingStaff.role as AdminRole]?.defaultPermissions || []).map(
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
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Staff */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-rose-100 p-6 shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center flex flex-col gap-1">
              <h3 className="text-base font-extrabold text-slate-900">Xóa Tài Khoản Nhân Viên?</h3>
              <p className="text-xs text-slate-500">
                Hành động này không thể hoàn tác. Nhân viên sẽ không thể đăng nhập vào hệ thống nữa.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-extrabold text-xs hover:bg-slate-200 transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleDeleteStaff}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Context-Aware RBAC Multi-Role Assignment */}
      {managingRolesStaff && (
        <StaffContextRolesModal
          staff={managingRolesStaff}
          availableRoles={availableRoles as any}
          cinemas={cinemas}
          onClose={() => setManagingRolesStaff(null)}
          onSuccess={() => {
            table.refetch();
          }}
        />
      )}
    </div>
  );
}
