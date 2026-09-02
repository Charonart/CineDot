/* Hallmark · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal Admin */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldPlus,
  Edit3,
  Trash2,
  CheckSquare,
  Square,
  Save,
  CheckCircle2,
  Key,
  Search,
  Check,
  X,
  Lock,
} from 'lucide-react';

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
  const [searchRoleQuery, setSearchRoleQuery] = useState('');
  const [searchPermQuery, setSearchPermQuery] = useState('');

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleItemDTO | null>(null);

  // Auto-select first role on load
  useEffect(() => {
    if (roles.length > 0 && selectedRoleId === null) {
      setSelectedRoleId(roles[0].id);
      setSelectedPermissionIds(roles[0].permission_ids || []);
      setHasChanges(false);
    } else if (selectedRoleId !== null && !hasChanges) {
      const currentRole = roles.find((r) => r.id === selectedRoleId);
      if (currentRole) {
        setSelectedPermissionIds(currentRole.permission_ids || []);
      }
    }
  }, [roles, selectedRoleId, hasChanges]);

  // Keyboard shortcut Ctrl+S / Cmd+S to save permissions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasChanges && selectedRoleId) {
          handleSavePermissions();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges, selectedRoleId, selectedPermissionIds]);

  const activeRole = roles.find((r) => r.id === selectedRoleId);

  // Filtered roles by search
  const filteredRoles = useMemo(() => {
    if (!searchRoleQuery.trim()) return roles;
    const q = searchRoleQuery.toLowerCase().trim();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }, [roles, searchRoleQuery]);

  // Filtered permission groups by search
  const filteredPermissionsGrouped = useMemo(() => {
    if (!searchPermQuery.trim()) return permissionsGrouped;
    const q = searchPermQuery.toLowerCase().trim();
    const result: Record<string, typeof permissionsList> = {};

    Object.entries(permissionsGrouped).forEach(([groupName, perms]) => {
      const matched = perms.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          groupName.toLowerCase().includes(q)
      );
      if (matched.length > 0) {
        result[groupName] = matched;
      }
    });

    return result;
  }, [permissionsGrouped, searchPermQuery]);

  const handleSelectRole = (role: RoleItemDTO) => {
    if (hasChanges) {
      if (!confirm('Bạn có thay đổi phân quyền chưa lưu. Bạn có muốn chuyển sang vai trò khác không?')) {
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
      next = selectedPermissionIds.filter((id) => !groupIds.includes(id));
    } else {
      const unique = Array.from(new Set([...selectedPermissionIds, ...groupIds]));
      next = unique;
    }
    setSelectedPermissionIds(next);
    setHasChanges(true);
    setSaveSuccessMsg('');
  };

  const handleSelectAll = () => {
    const allIds = permissionsList.map((p) => p.id);
    setSelectedPermissionIds(allIds);
    setHasChanges(true);
  };

  const handleDeselectAll = () => {
    setSelectedPermissionIds([]);
    setHasChanges(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;
    try {
      await syncRolePermissions({
        roleId: selectedRoleId,
        permissionIds: selectedPermissionIds,
      });
      setHasChanges(false);
      setSaveSuccessMsg(`Đã lưu ${selectedPermissionIds.length} quyền cho vai trò "${activeRole?.name}" thành công!`);
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
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ma Trận Phân Quyền RBAC
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Khai báo vai trò hệ thống và phân bổ quyền hạn chi tiết cho từng nhóm nhân sự
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setRoleToEdit(null);
            setIsRoleModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
        >
          <ShieldPlus className="w-4 h-4" />
          <span>Tạo Vai Trò Mới</span>
        </button>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Workbench Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Role Directory (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Danh Sách Vai Trò ({roles.length})
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">CHỌN ĐỂ CẤU HÌNH</span>
            </div>

            {/* Role Search Input */}
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm vai trò..."
                value={searchRoleQuery}
                onChange={(e) => setSearchRoleQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
              />
              {searchRoleQuery && (
                <button
                  type="button"
                  onClick={() => setSearchRoleQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 font-medium">
                Đang nạp danh sách vai trò...
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                Không tìm thấy vai trò phù hợp
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-0.5">
                {filteredRoles.map((r) => {
                  const isSelected = r.id === selectedRoleId;

                  return (
                    <div
                      key={r.id}
                      onClick={() => handleSelectRole(r)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                        isSelected
                          ? 'bg-[#7C6FE8]/8 border-[#7C6FE8] shadow-xs'
                          : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                              isSelected
                                ? 'bg-[#7C6FE8] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Key className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-mono font-bold text-xs text-slate-900 uppercase truncate">
                              {r.name}
                            </span>
                            <span className="text-[11px] text-slate-500 font-normal line-clamp-1">
                              {r.description || 'Chưa có mô tả vai trò'}
                            </span>
                          </div>
                        </div>

                        {r.is_system && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold uppercase shrink-0">
                            Hệ thống
                          </span>
                        )}
                      </div>

                      {/* Stats & Actions Row */}
                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                        <span className="text-slate-500">
                          <strong className="text-slate-800">{r.permissions_count || 0}</strong> quyền &bull;{' '}
                          <strong className="text-slate-800">{r.users_count || 0}</strong> nhân sự
                        </span>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              setRoleToEdit(r);
                              setIsRoleModalOpen(true);
                            }}
                            title="Sửa tên / mô tả"
                            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {!r.is_system && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(r)}
                              title="Xóa vai trò"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col gap-5">
            {/* Top Matrix Command Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold border border-purple-100 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase font-mono truncate">
                      {activeRole?.name || '---'}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#7C6FE8]/10 text-[#7C6FE8] text-[10px] font-bold font-mono shrink-0">
                      {selectedPermissionIds.length} / {permissionsList.length} Quyền
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 truncate">
                    {activeRole?.description || 'Phân bổ quyền hạn truy cập cho vai trò được chọn'}
                  </span>
                </div>
              </div>

              {/* Quick Actions & Search */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Chọn Tất Cả
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Bỏ Chọn Hết
                </button>
              </div>
            </div>

            {/* Permission Filter Search Bar */}
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm quyền hạn (vd: staff.manage, movies.create)..."
                value={searchPermQuery}
                onChange={(e) => setSearchPermQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-colors"
              />
              {searchPermQuery && (
                <button
                  type="button"
                  onClick={() => setSearchPermQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Matrix Permission Groups */}
            {isLoading ? (
              <div className="py-20 text-center text-xs text-slate-400 font-medium">
                Đang nạp ma trận phân quyền...
              </div>
            ) : Object.keys(filteredPermissionsGrouped).length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 font-medium">
                Không tìm thấy quyền hạn phù hợp với từ khóa tìm kiếm.
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {Object.entries(filteredPermissionsGrouped).map(([moduleTitle, groupPerms]) => {
                  const groupIds = groupPerms.map((p) => p.id);
                  const selectedInGroup = groupIds.filter((id) => selectedPermissionIds.includes(id));
                  const isAllGroupSelected = groupIds.length > 0 && selectedInGroup.length === groupIds.length;

                  return (
                    <div
                      key={moduleTitle}
                      className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col gap-3"
                    >
                      {/* Group Header */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                            {moduleTitle}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            ({selectedInGroup.length}/{groupPerms.length})
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleGroup(groupPerms)}
                          className="text-[11px] font-bold text-[#7C6FE8] hover:underline cursor-pointer"
                        >
                          {isAllGroupSelected ? 'Bỏ chọn nhóm' : 'Chọn cả nhóm'}
                        </button>
                      </div>

                      {/* Group Checkbox Tiles Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {groupPerms.map((p) => {
                          const isChecked = selectedPermissionIds.includes(p.id);

                          return (
                            <label
                              key={p.id}
                              onClick={() => handleTogglePermission(p.id)}
                              className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2 select-none ${
                                isChecked
                                  ? 'bg-white border-[#7C6FE8] shadow-2xs'
                                  : 'bg-white/60 border-slate-200/80 hover:border-slate-300 hover:bg-white'
                              }`}
                            >
                              <div className="mt-0.5 text-[#7C6FE8] shrink-0">
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 fill-[#7C6FE8] text-white" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-mono font-bold text-xs text-slate-900 truncate">
                                  {p.name}
                                </span>
                                <span className="text-[11px] text-slate-500 line-clamp-1">
                                  {p.description || p.name}
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

      {/* Floating Sticky Save Bar (Always visible when changes are pending) */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-40 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200">
              Bạn có thay đổi phân quyền chưa lưu
            </span>
            <span className="text-[10px] text-slate-400">
              Đang chọn <strong>{selectedPermissionIds.length}</strong> quyền &bull; Phím tắt: <strong>Ctrl+S</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeRole) {
                  setSelectedPermissionIds(activeRole.permission_ids || []);
                  setHasChanges(false);
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Hủy Bỏ
            </button>

            <button
              type="button"
              onClick={handleSavePermissions}
              disabled={isSyncingPermissions}
              className="px-4 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {isSyncingPermissions ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Lưu Ma Trận</span>
            </button>
          </div>
        </div>
      )}

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
