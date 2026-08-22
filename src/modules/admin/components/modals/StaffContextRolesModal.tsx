'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  X,
  Plus,
  Trash2,
  Building2,
  Globe,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { AdminStaffItem } from '../../types/admin.types';
import { RoleDefinitionDTO, UserRoleDTO } from '../../dto/adminStaff.dto';
import { adminStaffService } from '../../services/adminStaff.service';

interface StaffContextRolesModalProps {
  staff: AdminStaffItem | null;
  availableRoles: RoleDefinitionDTO[];
  cinemas: { id: string; name: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

export function StaffContextRolesModal({
  staff,
  availableRoles,
  cinemas,
  onClose,
  onSuccess,
}: StaffContextRolesModalProps) {
  const [userRoles, setUserRoles] = useState<UserRoleDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State for Adding Role
  const [selectedRoleId, setSelectedRoleId] = useState<string | number>('');
  const [scopeType, setScopeType] = useState<'system' | 'region' | 'cinema'>('cinema');
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | number>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load existing roles
  useEffect(() => {
    if (!staff) return;
    loadUserRoles();
  }, [staff]);

  const loadUserRoles = async () => {
    if (!staff) return;
    setIsLoading(true);
    try {
      const data = await adminStaffService.getUserRoles(staff.id);
      setUserRoles(data);
    } catch (err: any) {
      console.error('Failed to load user roles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (availableRoles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(availableRoles[0].id || 1);
    }
    if (cinemas.length > 0 && !selectedCinemaId) {
      setSelectedCinemaId(cinemas[0].id);
    }
  }, [availableRoles, cinemas]);

  if (!staff) return null;

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedRoleId) {
      setErrorMessage('Vui lòng chọn vai trò!');
      return;
    }

    if (scopeType === 'cinema' && !selectedCinemaId) {
      setErrorMessage('Vui lòng chọn cụm rạp áp dụng!');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminStaffService.assignUserRole(staff.id, {
        role_id: Number(selectedRoleId),
        scope_type: scopeType,
        scope_id: scopeType === 'cinema' ? Number(selectedCinemaId) : null,
      });

      setSuccessMessage('Đã gán vai trò ngữ cảnh thành công!');
      await loadUserRoles();
      onSuccess();

      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Không thể gán vai trò ngữ cảnh!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (id: string | number) => {
    if (userRoles.length <= 1) {
      alert('Nhân sự phải có ít nhất một vai trò trong hệ thống!');
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn hủy vai trò ngữ cảnh này?')) return;

    setDeletingId(id);
    try {
      await adminStaffService.deleteUserRole(staff.id, id);
      await loadUserRoles();
      onSuccess();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể hủy vai trò!');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#7C6FE8] text-white shadow-md shadow-purple-200">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Phân Quyền Ngữ Cảnh (Context-Aware RBAC)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Nhân sự: <span className="font-bold text-[#7C6FE8]">{staff.name}</span> ({staff.email})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* List Existing Roles */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />
                Các vai trò & phạm vi hiện có ({userRoles.length})
              </h4>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#7C6FE8]" />
                </div>
              ) : userRoles.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-gray-200 text-center text-xs text-slate-400">
                  Chưa có vai trò nào được cấu hình
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {userRoles.map((ur) => {
                    const isSystem = ur.scope_type === 'system';
                    const isCinema = ur.scope_type === 'cinema';

                    return (
                      <div
                        key={ur.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/40 border border-gray-200/80 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl text-white shrink-0 ${
                              isSystem
                                ? 'bg-purple-600'
                                : isCinema
                                ? 'bg-blue-600'
                                : 'bg-emerald-600'
                            }`}
                          >
                            {isSystem ? (
                              <Globe className="w-4 h-4" />
                            ) : isCinema ? (
                              <Building2 className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900 uppercase">
                                {ur.role_name}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                  isSystem
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : isCinema
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {isSystem ? 'Toàn Hệ Thống' : isCinema ? 'Cụm Rạp' : 'Khu Vực'}
                              </span>
                            </div>
                            <span className="text-xs text-slate-600 font-medium">
                              {ur.scope_name || (isSystem ? 'Áp dụng trên toàn quốc' : 'Chưa rõ')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteRole(ur.id)}
                          disabled={deletingId === ur.id}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Hủy vai trò này"
                        >
                          {deletingId === ur.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form Add New Role */}
            <form onSubmit={handleAddRole} className="p-4 rounded-3xl bg-slate-50 border border-gray-200 flex flex-col gap-4">
              <h4 className="text-xs font-black tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#7C6FE8]" />
                Gán thêm vai trò & ngữ cảnh mới
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Vai Trò</label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    {availableRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name.toUpperCase()} {r.description ? `(${r.description})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Scope Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Phạm Vi Áp Dụng (Scope)</label>
                  <select
                    value={scopeType}
                    onChange={(e) => setScopeType(e.target.value as any)}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="cinema">🏢 Cụm Rạp Cụ Thể (Cinema Scope)</option>
                    <option value="system">🌐 Toàn Hệ Thống (System Scope)</option>
                  </select>
                </div>

                {/* Select Cinema if scope is cinema */}
                {scopeType === 'cinema' && (
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Chọn Cụm Rạp Phụ Trách</label>
                    <select
                      value={selectedCinemaId}
                      onChange={(e) => setSelectedCinemaId(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8]"
                    >
                      {cinemas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-200 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Gán...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Phân Quyền</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-slate-50/50">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
