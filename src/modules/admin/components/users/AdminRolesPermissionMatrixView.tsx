'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldPlus,
  Edit3,
  Trash2,
  CheckSquare,
  Square,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  Key,
  Info,
  Lock,
} from 'lucide-react';
import { UsersStaffSubNavTabs } from './UsersStaffSubNavTabs';
import { useAdminRoles } from '../../hooks/useAdminRoles';
import { RoleStudioModal } from './RoleStudioModal';
import { RoleItemDTO } from '../../dto/adminUserManagement.dto';

export function AdminRolesPermissionMatrixView() {
  const {
    roles,
    permissionsList,
    permissionsGrouped,
    isLoading,
    createRole,
    updateRole,
    syncRolePermissions,
    isSyncingPermissions,
    deleteRole,
  } = useAdminRoles();

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleItemDTO | null>(null);

  // Auto-select first role on load
  useEffect(() => {
    if (roles.length > 0 && selectedRoleId === null) {
      setSelectedRoleId(roles[0].id);
      setSelectedPermissionIds(roles[0].permission_ids || []);
    } else if (selectedRoleId !== null) {
      const currentRole = roles.find((r) => r.id === selectedRoleId);
      if (currentRole) {
        setSelectedPermissionIds(currentRole.permission_ids || []);
      }
    }
    setHasChanges(false);
  }, [roles, selectedRoleId]);

  const activeRole = roles.find((r) => r.id === selectedRoleId);

  const handleSelectRole = (role: RoleItemDTO) => {
    if (hasChanges) {
      if (!confirm('Bạn có thay đổi phân quyền chưa lưu. Bạn có muốn chuyển vai trò khác không?')) {
        return;
      }
    }
    setSelectedRoleId(role.id);
    setSelectedPermissionIds(role.permission_ids || []);
    setHasChanges(false);
    setSaveSuccessMsg('');
  };

  const handleTogglePermission = (permissionId: number) => {
    let next: number[];
    if (selectedPermissionIds.includes(permissionId)) {
      next = selectedPermissionIds.filter((id) => id !== permissionId);
    } else {
      next = [...selectedPermissionIds, permissionId];
    }
    setSelectedPermissionIds(next);
    setHasChanges(true);
    setSaveSuccessMsg('');
  };

  const handleToggleGroup = (groupPermissions: { id: number }[]) => {
    const groupIds = groupPermissions.map((p) => p.id);
    const allSelected = groupIds.every((id) => selectedPermissionIds.includes(id));

    let next: number[];
    if (allSelected) {
      // Uncheck all in group
      next = selectedPermissionIds.filter((id) => !groupIds.includes(id));
    } else {
      // Check all in group
      const unique = Array.from(new Set([...selectedPermissionIds, ...groupIds]));
      next = unique;
    }
    setSelectedPermissionIds(next);
    setHasChanges(true);
    setSaveSuccessMsg('');
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;
    try {
      await syncRolePermissions({
        roleId: selectedRoleId,
        permissionIds: selectedPermissionIds,
      });
      setHasChanges(false);
      setSaveSuccessMsg(`Đã cập nhật ${selectedPermissionIds.length} quyền cho vai trò "${activeRole?.name}" thành công!`);
      setTimeout(() => {
        setSaveSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu phân quyền.');
    }
  };

  const handleDeleteRole = async (role: RoleItemDTO) => {
    if (role.is_system) {
      alert('Không thể xóa vai trò hệ thống mặc định.');
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.name}" không?`)) {
      await deleteRole(role.id);
      if (selectedRoleId === role.id) {
        setSelectedRoleId(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Shared Sub-Nav Tabs */}
      <UsersStaffSubNavTabs />

      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>MA TRẬN PHÂN QUYỀN RBAC (ROLE-BASED ACCESS CONTROL)</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Quản Lý Vai Trò & Ma Trận Phân Quyền
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Thiết lập danh mục vai trò hệ thống và cấp phát chi tiết quyền hạn theo từng phân hệ rạp chiếu.
          </p>
        </div>

        <button
          onClick={() => {
            setRoleToEdit(null);
            setIsRoleModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#7C6FE8]/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <ShieldPlus className="w-4 h-4" />
          <span>+ TẠO VAI TRÒ MỚI</span>
        </button>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 2. Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Roles List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Danh Sách Vai Trò ({roles.length})
              </span>
              <span className="text-[10px] text-slate-400 font-bold">CHỌN ĐỂ PHÂN QUYỀN</span>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 font-bold">
                Đang nạp danh sách vai trò...
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {roles.map((r) => {
                  const isSelected = r.id === selectedRoleId;

                  return (
                    <div
                      key={r.id}
                      onClick={() => handleSelectRole(r)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                        isSelected
                          ? 'bg-purple-50/80 border-[#7C6FE8] shadow-sm'
                          : 'bg-white border-gray-100 hover:border-purple-200 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? 'bg-[#7C6FE8] text-white'
                                : 'bg-purple-100 text-[#7C6FE8]'
                            }`}
                          >
                            <Key className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-mono font-black text-xs text-slate-900 uppercase">
                              {r.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
                              {r.description || 'Chưa có mô tả'}
                            </span>
                          </div>
                        </div>

                        {r.is_system && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black uppercase">
                            Hệ Thống
                          </span>
                        )}
                      </div>

                      {/* Stats & Actions Row */}
                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-100/80">
                        <span className="text-slate-500 font-medium">
                          <b>{r.permissions_count || 0}</b> quyền • <b>{r.users_count || 0}</b> người dùng
                        </span>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setRoleToEdit(r);
                              setIsRoleModalOpen(true);
                            }}
                            title="Sửa tên / mô tả vai trò"
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {!r.is_system && (
                            <button
                              onClick={() => handleDeleteRole(r)}
                              title="Xóa vai trò"
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Permission Matrix Grid (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-col gap-6">
            {/* Top Matrix Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 uppercase font-mono">
                      {activeRole?.name || '---'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C6FE8] text-[10px] font-black font-mono">
                      {selectedPermissionIds.length} / {permissionsList.length} Quyền
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeRole?.description || 'Phân phối quyền hạn chi tiết cho vai trò được chọn'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSavePermissions}
                disabled={!hasChanges || isSyncingPermissions}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  hasChanges
                    ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-md shadow-[#7C6FE8]/30 animate-pulse'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSyncingPermissions ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>LƯU MA TRẬN QUYỀN</span>
              </button>
            </div>

            {/* Matrix Groups */}
            {isLoading ? (
              <div className="py-20 text-center text-xs text-slate-400 font-bold">
                Đang nạp ma trận quyền hạn...
              </div>
            ) : Object.keys(permissionsGrouped).length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 font-bold">
                Không tìm thấy danh sách quyền.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {Object.entries(permissionsGrouped).map(([moduleTitle, groupPerms]) => {
                  const groupIds = groupPerms.map((p) => p.id);
                  const selectedInGroup = groupIds.filter((id) => selectedPermissionIds.includes(id));
                  const isAllGroupSelected = groupIds.length > 0 && selectedInGroup.length === groupIds.length;

                  return (
                    <div
                      key={moduleTitle}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col gap-3.5"
                    >
                      {/* Group Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                            {moduleTitle}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            ({selectedInGroup.length}/{groupPerms.length})
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleGroup(groupPerms)}
                          className="text-[11px] font-bold text-[#7C6FE8] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {isAllGroupSelected ? 'Bỏ chọn nhóm' : 'Chọn tất cả nhóm'}
                        </button>
                      </div>

                      {/* Group Grid Permissions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {groupPerms.map((p) => {
                          const isChecked = selectedPermissionIds.includes(p.id);

                          return (
                            <label
                              key={p.id}
                              onClick={() => handleTogglePermission(p.id)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                                isChecked
                                  ? 'bg-white border-[#7C6FE8] shadow-xs'
                                  : 'bg-white/60 border-gray-200 hover:border-purple-200'
                              }`}
                            >
                              <div className="mt-0.5 text-[#7C6FE8]">
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 fill-[#7C6FE8] text-white" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-mono font-bold text-xs text-slate-900">
                                  {p.name}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {p.description}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Studio Modal */}
      <RoleStudioModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        roleToEdit={roleToEdit}
        onSave={(payload) => {
          if (roleToEdit) {
            return updateRole({ id: roleToEdit.id, payload });
          }
          return createRole(payload);
        }}
      />
    </div>
  );
}
