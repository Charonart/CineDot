"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X, Loader2 } from 'lucide-react';
import { useAdminMovieDetail, useCreateAdminMovie, useUpdateAdminMovie } from '@/modules/movie/hooks/useAdminMovies';

interface MovieFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieId?: number | string | null;
}

const INITIAL_FORM = {
  title: '',
  original_title: '',
  status: 'now_showing' as 'now_showing' | 'coming_soon' | 'stopped',
  release_date: '',
  runtime: 120,
  age_rating: 'P',
  poster_url: '',
  backdrop_url: '',
  trailer_url: '',
  overview: '',
  genres: [] as { id: number; name: string }[],
};

export function MovieFormDialog({ isOpen, onClose, movieId }: MovieFormDialogProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: movieDetail, isLoading: isLoadingDetail } = useAdminMovieDetail(movieId || '');
  const createMutation = useCreateAdminMovie();
  const updateMutation = useUpdateAdminMovie(movieId || '');

  const isEdit = !!movieId;

  useEffect(() => {
    if (isEdit && movieDetail) {
      setForm({
        title: movieDetail.title || '',
        original_title: movieDetail.originalTitle || '',
        status: movieDetail.status as any || 'now_showing',
        release_date: movieDetail.releaseDate || '',
        runtime: movieDetail.runtime || 120,
        age_rating: movieDetail.ageRating || 'P',
        poster_url: movieDetail.posterUrl || '',
        backdrop_url: movieDetail.backdropUrl || '',
        trailer_url: movieDetail.trailerUrl || '',
        overview: movieDetail.description || '',
        genres: movieDetail.genres.map(g => ({ id: Number(g.id), name: g.name })) || [],
      });
    } else {
      setForm(INITIAL_FORM);
      setErrors({});
    }
  }, [isEdit, movieDetail, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'runtime' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Tên phim không được để trống';
    if (!form.release_date) newErrors.release_date = 'Vui lòng chọn ngày khởi chiếu';
    if (form.runtime <= 0) newErrors.runtime = 'Thời lượng phải lớn hơn 0';
    if (!form.poster_url.trim()) newErrors.poster_url = 'Vui lòng nhập URL poster';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      genres: form.genres.length > 0 ? form.genres : [{ id: 28, name: "Hành động" }], // Fallback default
    };

    if (isEdit) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true" />

      {/* Center Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E9E9F8] flex flex-col max-h-[90vh] transition-all transform duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E9E9F8] flex items-center justify-between shrink-0 bg-gray-50/50">
            <DialogTitle className="text-base font-bold text-[#1C1D22]">
              {isEdit ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
            </DialogTitle>
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content Scroll area */}
          {isEdit && isLoadingDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
              <span className="text-xs text-[#8B949E] mt-3 font-semibold">Đang tải dữ liệu phim...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Row 1: Title & English Title */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Tên phim (Tiếng Việt)</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Nhập tên tiếng Việt"
                    className={`w-full bg-white border ${errors.title ? 'border-red-500' : 'border-[#E9E9F8]'} rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all`}
                  />
                  {errors.title && <span className="text-[11px] text-red-500 font-semibold">{errors.title}</span>}
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Tên gốc (English/Original)</label>
                  <input
                    type="text"
                    name="original_title"
                    value={form.original_title}
                    onChange={handleChange}
                    placeholder="Nhập tên tiếng Anh hoặc tên gốc"
                    className="w-full bg-white border border-[#E9E9F8] rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Status, Release Date, Runtime, Age Rating */}
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Trạng thái</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#E9E9F8] rounded-xl px-3 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all text-gray-700 font-medium"
                  >
                    <option value="now_showing">Đang chiếu</option>
                    <option value="coming_soon">Sắp chiếu</option>
                    <option value="stopped">Ngừng chiếu</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Khởi chiếu</label>
                  <input
                    type="date"
                    name="release_date"
                    value={form.release_date}
                    onChange={handleChange}
                    className={`w-full bg-white border ${errors.release_date ? 'border-red-500' : 'border-[#E9E9F8]'} rounded-xl px-3 py-2 outline-none text-sm focus:border-[#4F46E5] transition-all text-gray-700`}
                  />
                  {errors.release_date && <span className="text-[11px] text-red-500 font-semibold">{errors.release_date}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Thời lượng (phút)</label>
                  <input
                    type="number"
                    name="runtime"
                    value={form.runtime}
                    onChange={handleChange}
                    placeholder="120"
                    className={`w-full bg-white border ${errors.runtime ? 'border-red-500' : 'border-[#E9E9F8]'} rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all`}
                  />
                  {errors.runtime && <span className="text-[11px] text-red-500 font-semibold">{errors.runtime}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Độ tuổi</label>
                  <select
                    name="age_rating"
                    value={form.age_rating}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#E9E9F8] rounded-xl px-3 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all text-gray-700 font-medium"
                  >
                    <option value="P">P - Mọi độ tuổi</option>
                    <option value="K">K - Dưới 13 tuổi (cần giám hộ)</option>
                    <option value="T13">T13 - Trên 13 tuổi</option>
                    <option value="T16">T16 - Trên 16 tuổi</option>
                    <option value="T18">T18 - Trên 18 tuổi</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Poster URL & Backdrop URL */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Poster URL</label>
                  <input
                    type="text"
                    name="poster_url"
                    value={form.poster_url}
                    onChange={handleChange}
                    placeholder="https://image.tmdb.org/t/p/..."
                    className={`w-full bg-white border ${errors.poster_url ? 'border-red-500' : 'border-[#E9E9F8]'} rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all`}
                  />
                  {errors.poster_url && <span className="text-[11px] text-red-500 font-semibold">{errors.poster_url}</span>}
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Backdrop URL</label>
                  <input
                    type="text"
                    name="backdrop_url"
                    value={form.backdrop_url}
                    onChange={handleChange}
                    placeholder="https://image.tmdb.org/t/p/..."
                    className="w-full bg-white border border-[#E9E9F8] rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all"
                  />
                </div>
              </div>

              {/* Row 4: Trailer URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Trailer Youtube URL</label>
                <input
                  type="text"
                  name="trailer_url"
                  value={form.trailer_url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-white border border-[#E9E9F8] rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all"
                />
              </div>

              {/* Row 5: Overview */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Tóm tắt cốt truyện</label>
                <textarea
                  name="overview"
                  value={form.overview}
                  onChange={handleChange}
                  placeholder="Nhập mô tả tóm tắt nội dung phim..."
                  rows={4}
                  className="w-full bg-white border border-[#E9E9F8] rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#4F46E5] transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E9E9F8] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2.5 border border-[#E9E9F8] hover:bg-gray-50 text-[#1C1D22] rounded-xl text-xs font-bold transition-all disabled:opacity-50 outline-none"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-[#4F46E5]/10 disabled:opacity-50 outline-none"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEdit ? 'Cập nhật phim' : 'Tạo phim'}</span>
                </button>
              </div>
            </form>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
