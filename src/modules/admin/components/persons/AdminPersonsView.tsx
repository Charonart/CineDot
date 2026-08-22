'use client';

import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Flame,
  User,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { adminPersonsService, AdminPersonItem } from '../../services/adminPersons.service';
import { CineDataTable, useServerTable } from '@/shared/components/table';
import { CineColumnDef, BulkAction } from '@/shared/types/dataTable.types';
import { imageHelper } from '@/shared/utils/imageHelper';
import Link from 'next/link';

export function AdminPersonsView() {
  const queryClient = useQueryClient();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<AdminPersonItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    original_name: '',
    gender: 2,
    profile_path: '',
    known_for_department: 'Acting',
    birthday: '',
    place_of_birth: '',
    imdb_id: '',
    biography: '',
  });
  const [formError, setFormError] = useState('');

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => adminPersonsService.deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'persons'] });
    },
  });

  // Save Mutation (Create/Update)
  const saveMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      if (editingPerson) {
        return adminPersonsService.updatePerson(editingPerson.id, payload);
      }
      return adminPersonsService.createPerson(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'persons'] });
      setIsModalOpen(false);
      setEditingPerson(null);
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi lưu thông tin.');
    },
  });

  const handleOpenCreate = () => {
    setEditingPerson(null);
    setFormData({
      name: '',
      original_name: '',
      gender: 2,
      profile_path: '',
      known_for_department: 'Acting',
      birthday: '',
      place_of_birth: '',
      imdb_id: '',
      biography: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (person: AdminPersonItem) => {
    setEditingPerson(person);
    setFormData({
      name: person.name || '',
      original_name: person.original_name || '',
      gender: person.gender || 2,
      profile_path: person.profile_path || person.avatar || '',
      known_for_department: person.known_for_department || 'Acting',
      birthday: person.birthday || '',
      place_of_birth: person.place_of_birth || '',
      imdb_id: person.imdb_id || '',
      biography: person.biography || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string | number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ nghệ sĩ "${name}" không?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Vui lòng nhập họ và tên nghệ sĩ.');
      return;
    }
    saveMutation.mutate(formData);
  };

  // Table Columns Definition
  const columns: CineColumnDef<AdminPersonItem>[] = useMemo(
    () => [
      {
        key: 'id',
        title: 'ID',
        dataType: 'number',
        sortable: true,
        width: 75,
        align: 'center',
        format: (val) => <span className="font-mono text-slate-400 font-bold">#{val}</span>,
      },
      {
        key: 'profile_path',
        title: 'ẢNH CHÂN DUNG',
        dataType: 'avatar',
        width: 85,
        align: 'center',
        format: (_, row: AdminPersonItem) => {
          const imgUrl = row.profile_path || row.avatar ? imageHelper.getPosterUrl(row.profile_path || row.avatar) : null;
          return (
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-purple-100 shadow-xs flex items-center justify-center mx-auto">
              {imgUrl ? (
                <img src={imgUrl} alt={row.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </div>
          );
        },
      },
      {
        key: 'name',
        title: 'HỌ & TÊN NGHỆ SĨ',
        dataType: 'text',
        sortable: true,
        filterable: true,
        format: (_, row: AdminPersonItem) => (
          <div className="flex flex-col">
            <span
              onClick={() => handleOpenEdit(row)}
              className="font-extrabold text-slate-900 text-sm hover:text-[#7C6FE8] cursor-pointer transition-colors"
            >
              {row.name}
            </span>
            {row.original_name && row.original_name !== row.name && (
              <span className="text-xs text-slate-400 italic">
                {row.original_name}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'known_for_department',
        title: 'LĨNH VỰC',
        dataType: 'select',
        sortable: true,
        filterable: true,
        options: [
          { label: 'Diễn Viên (Acting)', value: 'Acting' },
          { label: 'Đạo Diễn (Directing)', value: 'Directing' },
          { label: 'Sản Xuất (Production)', value: 'Production' },
        ],
        format: (_, row: AdminPersonItem) => {
          const isDirecting = row.known_for_department === 'Directing';
          return (
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
                isDirecting
                  ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isDirecting ? 'Đạo Diễn' : 'Diễn Viên'}
            </span>
          );
        },
      },
      {
        key: 'popularity',
        title: 'ĐIỂM TMDB',
        dataType: 'number',
        sortable: true,
        format: (_, row: AdminPersonItem) => (
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{(row.popularity || 0).toFixed(1)}</span>
          </div>
        ),
      },
      {
        key: 'place_of_birth',
        title: 'QUÊ QUÁN / NƠI SINH',
        dataType: 'text',
        format: (_, row: AdminPersonItem) => (
          <span className="text-xs text-slate-600 font-medium line-clamp-1" title={row.place_of_birth}>
            {row.place_of_birth || '—'}
          </span>
        ),
      },
      {
        key: 'birthday',
        title: 'NGÀY SINH',
        dataType: 'date',
        sortable: true,
        format: (_, row: AdminPersonItem) => (
          <span className="text-xs text-slate-600 font-medium">
            {row.birthday || '—'}
          </span>
        ),
      },
      {
        key: 'actions',
        title: 'THAO TÁC',
        width: 130,
        align: 'right',
        format: (_, row: AdminPersonItem) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/persons/${row.id}`}
              target="_blank"
              title="Xem trang công khai"
              className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-[#7C6FE8] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              onClick={() => handleOpenEdit(row)}
              title="Chỉnh sửa nghệ sĩ"
              className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDelete(row.id, row.name)}
              title="Xóa nghệ sĩ"
              className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Server-Side Table Hook
  const table = useServerTable<AdminPersonItem>({
    queryKey: ['admin', 'persons'],
    fetcher: (params) => adminPersonsService.getPersons(params),
    columns,
    exportFileName: 'danh_sach_dien_vien_dao_dien_cinedot',
    defaultPerPage: 15,
    defaultSort: { column: 'person_id', direction: 'desc' },
  });

  return (
    <div className="w-full flex flex-col gap-6 p-6 font-sans">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7C6FE8] text-white flex items-center justify-center shadow-lg shadow-[#7C6FE8]/25">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C6FE8]">
              QUẢN LÝ ĐIỆN ẢNH
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Diễn Viên & Đạo Diễn
            </h1>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM NGHỆ SĨ MỚI</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
        <CineDataTable table={table} />
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 flex flex-col gap-6 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingPerson ? 'Chỉnh Sửa Hồ Sơ Nghệ Sĩ' : 'Thêm Nghệ Sĩ Mới'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Error Alert */}
            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {formError}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Họ và Tên Nghệ Sĩ *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tom Cruise"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="p-3 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Tên Gốc / Quốc Tế</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thomas Cruise Mapother IV"
                    value={formData.original_name}
                    onChange={(e) => setFormData({ ...formData, original_name: e.target.value })}
                    className="p-3 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-[#7C6FE8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Lĩnh Vực Chuyên Môn</label>
                  <select
                    value={formData.known_for_department}
                    onChange={(e) => setFormData({ ...formData, known_for_department: e.target.value })}
                    className="p-3 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-[#7C6FE8]"
                  >
                    <option value="Acting">Diễn Viên (Acting)</option>
                    <option value="Directing">Đạo Diễn (Directing)</option>
                    <option value="Production">Nhà Sản Xuất (Production)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Giới Tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: Number(e.target.value) })}
                    className="p-3 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-[#7C6FE8]"
                  >
                    <option value={2}>Nam</option>
                    <option value={1}>Nữ</option>
                    <option value={0}>Chưa rõ</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Ảnh Chân Dung (URL hoặc TMDB Path)</label>
                <input
                  type="text"
                  placeholder="/xyz.jpg hoặc https://..."
                  value={formData.profile_path}
                  onChange={(e) => setFormData({ ...formData, profile_path: e.target.value })}
                  className="p-3 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-[#7C6FE8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Ngày Sinh</label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    className="p-3 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Quê Quán / Nơi Sinh</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Syracuse, New York, USA"
                    value={formData.place_of_birth}
                    onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })}
                    className="p-3 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-[#7C6FE8]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Tiểu Sử / Giới Thiệu Nghệ Sĩ</label>
                <textarea
                  rows={4}
                  placeholder="Nhập tiểu sử tóm tắt sự nghiệp của nghệ sĩ..."
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  className="p-3 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-[#7C6FE8] leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold flex items-center gap-2 shadow-md shadow-[#7C6FE8]/25 transition-all cursor-pointer disabled:opacity-60"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingPerson ? 'Lưu Thay Đổi' : 'Thêm Nghệ Sĩ'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
