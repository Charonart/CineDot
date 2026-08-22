'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Eye,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  ShieldAlert,
} from 'lucide-react';

import { useAdminCustomers } from '../../hooks/useAdminCustomers';
import { CustomerDetailDrawer } from './CustomerDetailDrawer';
import { PointsAdjustmentModal } from './PointsAdjustmentModal';
import { CustomerStudioModal } from './CustomerStudioModal';
import { AdminUserDTO } from '../../dto/adminUserManagement.dto';
import { adminCinemaService } from '../../services/adminCinema.service';
import { adminUserManagementService } from '../../services/adminUserManagement.service';
import { CineDataTable, useServerTable } from '@/shared/components/table';
import { CineColumnDef, BulkAction } from '@/shared/types/dataTable.types';

export function AdminCustomersView() {
  const {
    stats,
    isStatsLoading,
    createUser,
    updateUser,
    toggleUserStatus,
    adjustPoints,
    deleteUser,
    updateCell,
    bulkAction,
  } = useAdminCustomers({ role: 'customer' });

  // Modal & Drawer states
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [pointsUser, setPointsUser] = useState<AdminUserDTO | null>(null);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<AdminUserDTO | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const [provinces, setProvinces] = useState<any[]>([]);

  useEffect(() => {
    adminCinemaService
      .getProvinces()
      .then((res: any[]) => {
        setProvinces(res || []);
      })
      .catch(() => {});
  }, []);

  const handleOpenDetail = (userId: number) => {
    setSelectedUserId(userId);
    setIsDrawerOpen(true);
  };

  const handleOpenPoints = (user: AdminUserDTO) => {
    setPointsUser(user);
    setIsPointsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUserDTO) => {
    setEditingUser(user);
    setIsStudioOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsStudioOpen(true);
  };

  const handleDelete = async (userId: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản hội viên "${name}" (#${userId}) không?`)) {
      await deleteUser(userId);
    }
  };

  // ── Column Definitions for Universal CineDataTable ──
  const columns: CineColumnDef<AdminUserDTO>[] = useMemo(
    () => [
      {
        key: 'id',
        title: 'ID',
        dataType: 'number',
        sortable: true,
        filterable: true,
        width: 70,
        align: 'center',
        sticky: 'left',
        format: (val) => <span className="font-mono text-slate-400 font-bold">#{val}</span>,
      },
      {
        key: 'avatar',
        title: 'Ảnh',
        dataType: 'avatar',
        filterable: false,
        width: 60,
        align: 'center',
      },
      {
        key: 'fullname',
        title: 'Họ và Tên',
        dataType: 'text',
        sortable: true,
        filterable: true,
        editable: true,
        format: (val, row) => (
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span
              onClick={() => handleOpenDetail(row.id)}
              className="hover:text-[#7C6FE8] cursor-pointer"
            >
              {val || row.username}
            </span>
            {row.email_verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
          </div>
        ),
      },
      {
        key: 'username',
        title: 'Username',
        dataType: 'text',
        sortable: true,
        filterable: true,
        format: (val) => <span className="font-mono text-slate-500">@{val}</span>,
      },
      {
        key: 'email',
        title: 'Email',
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
        key: 'province',
        title: 'Tỉnh / Thành',
        dataType: 'select',
        filterable: true,
        options: provinces.map((p) => ({
          label: p.province_name || p.name || `Tỉnh/TP #${p.province_id}`,
          value: p.province_name || p.name || String(p.province_id),
        })),
      },
      {
        key: 'user_tier',
        title: 'Hạng Hội Viên',
        dataType: 'badge',
        sortable: true,
        filterable: true,
        options: [
          { label: 'Bronze', value: 'Bronze', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
          { label: 'Silver', value: 'Silver', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300' },
          { label: 'Gold', value: 'Gold', badgeClass: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
          { label: 'Platinum', value: 'Platinum', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
          { label: 'Diamond', value: 'Diamond', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
        ],
      },
      {
        key: 'point',
        title: 'Điểm Tích Lũy',
        dataType: 'number',
        sortable: true,
        filterable: true,
        editable: true,
        format: (val) => (
          <span className="font-mono font-black text-xs text-[#7C6FE8]">
            {Number(val || 0).toLocaleString('vi-VN')} Pts
          </span>
        ),
      },
      {
        key: 'is_active',
        title: 'Trạng Thái',
        dataType: 'boolean',
        sortable: true,
        filterable: true,
        editable: true,
        width: 120,
        align: 'center',
      },
      {
        key: 'actions',
        title: 'Thao Tác',
        dataType: 'custom',
        width: 140,
        align: 'right',
        sticky: 'right',
        filterable: false,
        renderCell: (row) => (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleOpenDetail(row.id)}
              title="Xem hồ sơ chi tiết"
              className="p-1.5 rounded-xl text-slate-500 hover:text-[#7C6FE8] hover:bg-purple-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenPoints(row)}
              title="Cộng / Trừ điểm thưởng"
              className="p-1.5 rounded-xl text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenEdit(row)}
              title="Chỉnh sửa thông tin"
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleUserStatus(row.id)}
              title={row.is_active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              className={`p-1.5 rounded-xl transition-colors ${
                row.is_active
                  ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {row.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleDelete(row.id, row.fullname || row.username)}
              title="Xóa tài khoản"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [provinces]
  );

  // ── Hook: Server-Side Table Controller (URL Sync + Query + Inline Edit + Bulk) ──
  const table = useServerTable<AdminUserDTO>({
    queryKey: ['admin', 'customers'],
    fetcher: (params) => adminUserManagementService.getUsers({ ...params, role: 'customer' } as any),
    updateCell: (id, field, value) => updateCell({ id: Number(id), field, value }),
    bulkAction: (action, ids) => bulkAction({ action: action as any, ids }),
    columns,
    exportFileName: 'danh_sach_hoi_vien_cinedot',
    defaultPerPage: 15,
  });

  // ── Bulk Actions for Universal CineDataTable ──
  const bulkActions: BulkAction<AdminUserDTO>[] = useMemo(
    () => [
      {
        key: 'bulk_active',
        label: 'Mở Khóa Đã Chọn',
        icon: <Unlock className="w-3.5 h-3.5" />,
        variant: 'primary',
        onClick: async (selectedRows, ids) => {
          if (confirm(`Bạn có chắc muốn MỞ KHÓA ${ids.length} tài khoản đã chọn không?`)) {
            await table.handleBulkAction('set_active');
          }
        },
      },
      {
        key: 'bulk_inactive',
        label: 'Khóa Đã Chọn',
        icon: <Lock className="w-3.5 h-3.5" />,
        variant: 'amber',
        onClick: async (selectedRows, ids) => {
          if (confirm(`Bạn có chắc muốn KHÓA ${ids.length} tài khoản đã chọn không?`)) {
            await table.handleBulkAction('set_inactive');
          }
        },
      },
      {
        key: 'bulk_delete',
        label: 'Xóa Đã Chọn',
        icon: <Trash2 className="w-3.5 h-3.5" />,
        variant: 'danger',
        onClick: async (selectedRows, ids) => {
          if (confirm(`CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN ${ids.length} tài khoản này không?`)) {
            await table.handleBulkAction('delete');
          }
        },
      },
    ],
    [table]
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản Lý Khách Hàng & Hội Viên
            </h1>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#7C6FE8]/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>ĐĂNG KÝ HỘI VIÊN</span>
        </button>
      </div>

      {/* 2. Universal Notion/Sheets CineDataTable with table hook */}
      <CineDataTable<AdminUserDTO>
        table={table}
        bulkActions={bulkActions}
        exportFileName="danh_sach_khach_hang_cinedot"
      />

      {/* Detail Drawer */}
      <CustomerDetailDrawer
        userId={selectedUserId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenPointsModal={(u) => handleOpenPoints(u)}
        onToggleStatus={toggleUserStatus}
      />

      {/* Points Adjustment Modal */}
      <PointsAdjustmentModal
        user={pointsUser}
        isOpen={isPointsModalOpen}
        onClose={() => setIsPointsModalOpen(false)}
        onAdjust={({ points, reason }) => {
          if (pointsUser) {
            return adjustPoints({ id: pointsUser.id, payload: { points, reason } });
          }
          return Promise.resolve();
        }}
      />

      {/* Customer Studio Modal */}
      <CustomerStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        userToEdit={editingUser}
        provinces={provinces}
        onSave={(payload) => {
          if (editingUser) {
            return updateUser({ id: editingUser.id, payload });
          }
          return createUser(payload);
        }}
      />
    </div>
  );
}
