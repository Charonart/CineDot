'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldPlus, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RoleItemDTO, CreateRolePayload, UpdateRolePayload } from '../../dto/adminUserManagement.dto';

interface RoleStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<any>;
  roleToEdit?: RoleItemDTO | null;
}

export function RoleStudioModal({
  isOpen,
  onClose,
  onSave,
  roleToEdit,
}: RoleStudioModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (roleToEdit) {
      setName(roleToEdit.name || '');
      setDescription(roleToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setStatusMsg(null);
  }, [roleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập định danh mã vai trò.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      if (roleToEdit) {
        const payload: UpdateRolePayload = {
          name: name.trim().toLowerCase(),
          description: description.trim() || undefined,
        };
        await onSave(payload);
        setStatusMsg({ type: 'success', text: 'Cập nhật thông tin vai trò thành công!' });
      } else {
        const payload: CreateRolePayload = {
          name: name.trim().toLowerCase(),
          description: description.trim() || undefined,
        };
        await onSave(payload);
        setStatusMsg({ type: 'success', text: 'Tạo vai trò mới thành công!' });
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi lưu vai trò.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl relative text-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              {roleToEdit ? <ShieldCheck className="w-5 h-5" /> : <ShieldPlus className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-black text-slate-900">
                {roleToEdit ? 'Chỉnh Sửa Vai Trò' : 'Tạo Vai Trò Mới'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {roleToEdit ? 'Cập nhật tên & mô tả vai trò' : 'Khai báo vai trò phân quyền người dùng'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div
            className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Mã Định Danh Vai Trò (Slug) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={roleToEdit?.is_system}
              placeholder="VD: content_manager, projectionist..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
            />
            <span className="text-[10px] text-slate-400">
              Dùng chữ thường, không dấu, nối bằng dấu gạch dưới (_).
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Mô Tả Chức Năng Vai Trò
            </label>
            <textarea
              rows={3}
              placeholder="Mô tả phạm vi quyền hạn và trách nhiệm của vai trò này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs text-slate-900 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-2xl border border-gray-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#7C6FE8]/30 flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{roleToEdit ? 'LƯU THAY ĐỔI' : '+ TẠO VAI TRÒ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
