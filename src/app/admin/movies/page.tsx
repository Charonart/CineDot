"use client";

import React, { useState } from 'react';
import { useAdminMovies, useDeleteAdminMovie } from '@/modules/movie/hooks/useAdminMovies';
import { AdminTable, ColumnDef } from '@/modules/admin/components/shared/AdminTable';
import { AdminMovieModel } from '@/modules/movie/types/admin-movie.type';
import { MovieFormDialog } from '@/modules/admin/components/movies/MovieFormDialog';
import { CreditsFormDialog } from '@/modules/admin/components/movies/CreditsFormDialog';
import { Search, Plus, Edit2, Trash2, Users, Film } from 'lucide-react';

export default function AdminMoviesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Modal Dialogs States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | string | null>(null);
  const [selectedMovieTitle, setSelectedMovieTitle] = useState('');

  // Query movies
  const { data, isLoading } = useAdminMovies({
    page: currentPage,
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const deleteMutation = useDeleteAdminMovie();

  const handleDelete = (id: number | string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bộ phim này?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenCreate = () => {
    setSelectedMovieId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (movie: AdminMovieModel) => {
    setSelectedMovieId(movie.id);
    setIsFormOpen(true);
  };

  const handleOpenCredits = (movie: AdminMovieModel) => {
    setSelectedMovieId(movie.id);
    setSelectedMovieTitle(movie.title);
    setIsCreditsOpen(true);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Define Columns
  const columns: ColumnDef<AdminMovieModel>[] = [
    {
      id: 'poster',
      header: 'Poster',
      accessor: (movie) => (
        <div className="relative w-10 h-14 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Film className="w-5 h-5" />
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'title',
      header: 'Tên phim',
      sortable: true,
      accessor: (movie) => (
        <div className="flex flex-col">
          <span className="text-[#1C1D22] font-semibold text-sm line-clamp-1">{movie.title}</span>
          {movie.originalTitle && (
            <span className="text-xs text-[#8B949E] italic mt-0.5 line-clamp-1">
              {movie.originalTitle}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      sortable: true,
      accessor: (movie) => {
        const badges = {
          now_showing: { bg: 'bg-[#ECFDF5] text-[#059669]', text: 'Đang chiếu' },
          coming_soon: { bg: 'bg-[#EEF2FF] text-[#4F46E5]', text: 'Sắp chiếu' },
          stopped: { bg: 'bg-[#F3F4F6] text-[#6B7280]', text: 'Ngừng chiếu' },
        };
        const activeBadge = badges[movie.status as keyof typeof badges] || badges.stopped;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${activeBadge.bg}`}>
            {activeBadge.text}
          </span>
        );
      },
    },
    {
      id: 'releaseDate',
      header: 'Khởi chiếu',
      sortable: true,
      accessor: (movie) => movie.releaseDate || 'Chưa cập nhật',
    },
    {
      id: 'runtime',
      header: 'Thời lượng',
      sortable: true,
      accessor: (movie) => (movie.runtime ? `${movie.runtime} phút` : 'Chưa rõ'),
    },
    {
      id: 'ageRating',
      header: 'Phân loại',
      accessor: (movie) => (
        <span className="inline-flex items-center px-2 py-0.5 border border-[#E9E9F8] rounded-lg text-xs font-bold text-gray-700 bg-gray-50">
          {movie.ageRating || 'P'}
        </span>
      ),
    },
    {
      id: 'genres',
      header: 'Thể loại',
      accessor: (movie) => (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {(movie.genres || []).slice(0, 2).map((g) => (
            <span
              key={g.id}
              className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F4F4FF] text-[#4F46E5]"
            >
              {g.name}
            </span>
          ))}
          {(movie.genres || []).length > 2 && (
            <span className="text-[10px] text-gray-500 font-bold self-center">
              +{(movie.genres || []).length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Hành động',
      accessor: (movie) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(movie)}
            className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg transition-colors outline-none"
            title="Chỉnh sửa phim"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleOpenCredits(movie)}
            className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg transition-colors outline-none"
            title="Quản lý Diễn viên/Credits"
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDelete(movie.id)}
            className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors outline-none"
            title="Xóa phim"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Filters Component to inject in AdminTable toolbar
  const filterToolbar = (
    <div className="flex items-center gap-3 w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm phim theo tên..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-white border border-[#E9E9F8] rounded-xl pl-9 pr-4 py-2 outline-none text-xs focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="bg-white border border-[#E9E9F8] rounded-xl px-3 py-2 outline-none text-xs focus:border-[#4F46E5] transition-all text-gray-700 font-semibold"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="now_showing">Đang chiếu</option>
        <option value="coming_soon">Sắp chiếu</option>
        <option value="stopped">Ngừng chiếu</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Header Block */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1C1D22] tracking-tight">Quản lý kho phim</h1>
          <p className="text-xs text-[#8B949E] mt-1 font-medium">
            Danh sách, thêm mới, điều chỉnh thông tin và gán nhân sự cho kho phim của hệ thống.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-[#4F46E5]/10 outline-none shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm phim mới</span>
        </button>
      </div>

      {/* Reusable Table Grid */}
      <AdminTable
        data={data?.items || []}
        columns={columns}
        isLoading={isLoading}
        sortConfig={sortConfig}
        onSort={handleSort}
        filterActions={filterToolbar}
        pagination={
          data
            ? {
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                totalItems: data.totalItems,
                onPageChange: setCurrentPage,
                rowsPerPage: 10,
              }
            : undefined
        }
      />

      {/* Pop-up Modals */}
      <MovieFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        movieId={selectedMovieId}
      />

      <CreditsFormDialog
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
        movieId={selectedMovieId}
        movieTitle={selectedMovieTitle}
      />
    </div>
  );
}
