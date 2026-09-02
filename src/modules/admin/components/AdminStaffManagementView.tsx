/* Hallmark · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal Admin */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminStaff } from '../hooks/useAdminStaff';
import { AdminRole, AdminStaffItem, ROLE_NAME_MAP, ROLE_DEFINITIONS } from '../types/admin.types';
import { createStaffSchema } from '../schemas/adminStaff.schema';
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
  ShieldCheck,
} from 'lucide-react';

import { useAdminRoles } from '../hooks/useAdminRoles';
import { adminStaffService } from '../services/adminStaff.service';
import { CineDataTable, useServerTable } from '@/shared/components/table';
import { CineColumnDef, BulkAction } from '@/shared/types/dataTable.types';
import { StaffContextRolesModal } from './modals/StaffContextRolesModal';

const AVATAR_COLORS = [
  'bg-purple-100 text-[#7C6FE8] border-purple-200',
  'bg-blue-100 text-blue-600 border-blue-200',
  'bg-indigo-100 text-indigo-600 border-indigo-200',
  'bg-emerald-100 text-emerald-600 border-emerald-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-600 border-rose-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
];

function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name: string): string {
  if (!name) return 'N';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
    setEditPhone(staff.phone === 'Chưa cập nhật' ? '' : staff.phone || '');
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
        table.refetch();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setCreateError(errorObj?.message || 'Khởi tạo tài khoản nhân sự thất bại!');
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

    try {
      await updateStaff({
        id: editingStaff.id,
        payload: {
          name: editName.trim(),
          phone: editPhone.trim() || undefined,
          cinema_id: isSystemScope ? null : editCinemaId,
          cinema_name: cinemaName,
        },
      });

      setEditSuccess(`Đã cập nhật thông tin cho ${editName}!`);
      setTimeout(() => {
        setEditingStaff(null);
        setEditSuccess('');
        table.refetch();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setEditError(errorObj?.message || 'Cập nhật tài khoản thất bại!');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'ACTIVE' | 'DISABLED') => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await toggleStaffStatus({ id, status: nextStatus });
      table.refetch();
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
      table.refetch();
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
        format: (val) => <span className="font-mono text-slate-400 font-bold text-xs">#{val}</span>,
      },
      {
        key: 'name',
        title: 'Nhân Sự',
        dataType: 'text',
        sortable: true,
        filterable: true,
        width: 240,
        format: (val, row) => {
          const avatarColor = getAvatarColor(String(val || row.email));
          const initials = getInitials(String(val || row.email));

          return (
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${avatarColor}`}
              >
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  onClick={() => setViewingStaff(row)}
                  className="font-bold text-xs text-slate-900 hover:text-[#7C6FE8] transition-colors cursor-pointer truncate"
                >
                  {val || row.email.split('@')[0]}
                </span>
                <span className="text-[11px] text-slate-400 truncate">{row.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        key: 'phone',
        title: 'Số Điện Thoại',
        dataType: 'text',
        filterable: true,
        width: 130,
        format: (val) => (
          <span className="font-mono text-slate-600 font-medium text-xs">
            {val && val !== 'Chưa cập nhật' ? val : '---'}
          </span>
        ),
      },
      {
        key: 'role',
        title: 'Vai Trò Phân Quyền',
        dataType: 'select',
        sortable: true,
        filterable: true,
        width: 220,
        options: availableRoles.map((r) => ({
          label: `${r.name.toUpperCase()} - ${r.description || r.name}`,
          value: r.name,
        })),
        cell: ({ row }) => {
          const userRoles = row.userRoles || [];
          if (userRoles.length > 0) {
            return (
              <div className="flex flex-wrap gap-1 max-w-[220px]">
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
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <Shield className="w-2.5 h-2.5" />
                      <span>{ur.roleName}</span>
                      {ur.scopeType === 'cinema' && ur.scopeName && (
                        <span className="text-[9px] font-normal text-slate-500 normal-case truncate max-w-[80px]">
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
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                isSuper
                  ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                  : String(row.role).toLowerCase().includes('manager')
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <Shield className="w-2.5 h-2.5" />
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
        width: 180,
        options: [
          { label: 'Toàn Bộ Cụm Rạp', value: 'Toàn Bộ Cụm Rạp' },
          ...cinemas.map((c) => ({ label: c.name, value: c.name })),
        ],
        format: (val) => (
          <span className="text-xs font-medium text-slate-700 truncate max-w-[170px] inline-block">
            {val || 'Toàn Bộ Cụm Rạp'}
          </span>
        ),
      },
      {
        key: 'status',
        title: 'Trạng Thái',
        dataType: 'boolean',
        sortable: true,
        filterable: true,
        width: 140,
        align: 'center',
        format: (val, row) => (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              row.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                row.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span>{row.status === 'ACTIVE' ? 'Đang Hoạt Động' : 'Đã Khóa'}</span>
          </span>
        ),
      },
      {
        key: 'actions',
        title: 'Thao Tác',
        dataType: 'custom',
        width: 150,
        align: 'right',
        sticky: 'right',
        filterable: false,
        renderCell: (u) => {
          const isCurrentUser = adminUser?.id === u.id;
          const isSuper = u.role === 'SUPER_ADMIN';

          return (
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setManagingRolesStaff(u)}
                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                title="Phân quyền chi nhánh (Context Scopes)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setViewingStaff(u)}
                className="p-1.5 rounded-lg bg-purple-50 text-[#7C6FE8] hover:bg-purple-100 transition-colors cursor-pointer"
                title="Xem chi tiết nhân sự"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              {adminUser?.role === 'SUPER_ADMIN' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(u)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                    title="Chỉnh sửa thông tin"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {!isCurrentUser && !isSuper ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                        title={u.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {u.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingId(u.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
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

  // ── Hook: Server-Side Table Controller ──
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
        onClick: async () => {
          await table.handleBulkAction('set_active');
        },
      },
      {
        key: 'bulk_inactive_staff',
        label: 'Khóa Đã Chọn',
        icon: <Lock className="w-3.5 h-3.5" />,
        variant: 'amber',
        onClick: async () => {
          await table.handleBulkAction('set_inactive');
        },
      },
    ],
    [table]
  );

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Danh Sách Tài Khoản Nhân Sự
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý tài khoản nhân viên nội bộ, phân quyền vận hành và điều phối cụm rạp
          </p>
        </div>

        {/* Create Staff Button (Visible to Super Admin) */}
        {adminUser?.role === 'SUPER_ADMIN' && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer w-fit shrink-0 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Nhân Viên</span>
          </button>
        )}
      </div>

      {/* 3. Universal CineDataTable */}
      <CineDataTable<AdminStaffItem>
        table={table}
        bulkActions={bulkActions}
        exportFileName="danh_sach_nhan_su_cinedot"
      />

      {/* Modal: Create Staff Account */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-black text-slate-900">Tạo Tài Khoản Nhân Viên Mới</h3>
                  <span className="text-xs text-slate-500">Cấp tài khoản đăng nhập nội bộ cho nhân sự</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Họ Và Tên</label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="VD: Nguyễn Văn An"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Email Đăng Nhập</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      placeholder="staff@cinedot.vn"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Số Điện Thoại</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      placeholder="0901234567"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Mật Khẩu Khởi Tạo Ban Đầu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Vai Trò Phân Quyền</label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value)}
                    aria-label="Vai trò phân quyền"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8] transition-colors cursor-pointer"
                  >
                    {availableRoles.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name.toUpperCase()} - {r.description || r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!isSystemRole(createRole) && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Cụm Rạp Phụ Trách</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <select
                        value={createCinemaId}
                        onChange={(e) => setCreateCinemaId(e.target.value)}
                        aria-label="Chọn cụm rạp phân công"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] transition-colors cursor-pointer"
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

              <div className="flex items-center justify-end gap-2.5 mt-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-black text-slate-900">Chỉnh Sửa Nhân Sự</h3>
                  <span className="text-xs text-slate-500">Cập nhật thông tin và điều phối cụm rạp quản lý</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {editSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{editSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStaff} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Họ Và Tên</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="VD: Nguyễn Văn An"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Email (Cố định)</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Số Điện Thoại</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="0901234567"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {!isSystemRole(editingStaff.role) && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Cụm Rạp Phụ Trách</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={editCinemaId}
                      onChange={(e) => setEditCinemaId(e.target.value)}
                      aria-label="Chọn cụm rạp phân công"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
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

              <div className="flex items-center justify-end gap-2.5 mt-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || isUpdatingRole}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  {isUpdating || isUpdatingRole ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-xs ${getAvatarColor(
                    viewingStaff.name || viewingStaff.email
                  )}`}
                >
                  {getInitials(viewingStaff.name || viewingStaff.email)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-black text-slate-900">{viewingStaff.name}</h3>
                  <span className="text-xs text-slate-500">{viewingStaff.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingStaff(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Vai trò chính:</span>
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
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                          isSuper
                            ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                            : roleStr.toLowerCase().includes('manager')
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <Shield className="w-2.5 h-2.5" />
                        <span>{title}</span>
                      </span>
                    );
                  })()}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Cụm rạp phụ trách:</span>
                  <span className="font-bold text-slate-800">
                    {viewingStaff.cinemaName || 'Toàn Bộ Cụm Rạp'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Số điện thoại:</span>
                  <span className="font-mono text-slate-700">
                    {viewingStaff.phone && viewingStaff.phone !== 'Chưa cập nhật'
                      ? viewingStaff.phone
                      : 'Chưa cập nhật'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Ngày tạo:</span>
                  <span className="text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{viewingStaff.createdAt}</span>
                  </span>
                </div>
              </div>

              {/* Permissions List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>Quyền Hạn Được Phân Bổ:</span>
                </span>
                <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  {viewingStaff.role === 'SUPER_ADMIN' ? (
                    <span className="text-xs font-bold text-[#7C6FE8] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      ★ Toàn quyền hệ thống (*)
                    </span>
                  ) : (
                    (
                      viewingStaff.permissions ||
                      ROLE_DEFINITIONS[viewingStaff.role as AdminRole]?.defaultPermissions ||
                      []
                    ).map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-mono font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200"
                      >
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Staff */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-rose-100 p-6 shadow-2xl flex flex-col gap-4">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center flex flex-col gap-1">
              <h3 className="text-base font-black text-slate-900">Xác Nhận Xóa Nhân Viên?</h3>
              <p className="text-xs text-slate-500">
                Tài khoản nhân viên này sẽ bị xóa khỏi hệ thống và không thể đăng nhập lại.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 mt-1">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteStaff}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
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
