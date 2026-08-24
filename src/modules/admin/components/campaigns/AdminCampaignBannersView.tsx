'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Image as ImageIcon,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  Hash,
} from 'lucide-react';
import { BannerStudioModal } from './BannerStudioModal';
import { useAdminBanners } from '../../hooks/useAdminBanners';
import { useAdminCampaigns } from '../../hooks/useAdminCampaigns';
import { AdminBanner } from '../../types/adminCampaign.types';
import { imageHelper } from '@/shared/utils/imageHelper';
import { useCineConfirm } from '@/shared/components/modal/CineConfirmModal';
import { useCineToast } from '@/shared/hooks/useCineToast';

export function AdminCampaignBannersView() {
  const searchParams = useSearchParams();
  const initialCampaignId = searchParams.get('campaign_id') || undefined;
  const confirmAction = useCineConfirm();
  const toast = useCineToast();

  const {
    banners,
    filters,
    setFilters,
    isLoading,
    createBanner,
    updateBanner,
    toggleBannerStatus,
    deleteBanner,
  } = useAdminBanners({ campaign_id: initialCampaignId });

  const { campaigns } = useAdminCampaigns({ limit: 100 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState<AdminBanner | null>(null);

  const handleOpenCreate = () => {
    setBannerToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: AdminBanner) => {
    setBannerToEdit(b);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: any) => {
    if (bannerToEdit) {
      await updateBanner({ id: bannerToEdit.id, payload });
      toast.success('Đã cập nhật banner quảng cáo thành công!');
    } else {
      await createBanner(payload);
      toast.success('Đã tạo banner quảng cáo mới thành công!');
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirmAction({
      title: 'Xóa Banner Quảng Cáo',
      message: 'Bạn có chắc chắn muốn xóa banner quảng cáo này khỏi hệ thống không? Thao tác này không thể hoàn tác.',
      confirmText: 'XÓA BANNER',
      variant: 'danger',
    });

    if (isConfirmed) {
      await deleteBanner(id);
      toast.success('Đã xóa banner quảng cáo thành công!');
    }
  };

  const handleToggle = async (id: number) => {
    await toggleBannerStatus(id);
    toast.info('Đã cập nhật trạng thái hiển thị banner!');
  };

  const activeCount = banners.filter((b: AdminBanner) => b.isActive).length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản Lý Banner Quảng Cáo & Slider
            </h1>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM BANNER MỚI</span>
        </button>
      </div>

      {/* 2. Toolbar & Filters */}
      <div className="p-4 rounded-3xl bg-white border border-purple-100/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề banner..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] outline-none text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={filters.campaign_id !== undefined ? String(filters.campaign_id) : ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                campaign_id: e.target.value || undefined,
                page: 1,
              })
            }
            className="px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-slate-700 bg-white focus:border-[#7C6FE8] outline-none cursor-pointer"
          >
            <option value="">Tất Cả Chiến Dịch</option>
            {campaigns.map((c: any) => (
              <option key={c.id} value={c.id}>
                #{c.id} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Banners Visual Gallery */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-3 border-[#7C6FE8]/30 border-t-[#7C6FE8] rounded-full animate-spin" />
          <span className="text-xs font-bold">Đang nạp danh sách banner...</span>
        </div>
      ) : banners.length === 0 ? (
        <div className="py-16 rounded-3xl bg-white border border-dashed border-purple-200 flex flex-col items-center justify-center gap-4 text-center p-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-base font-black text-slate-900">Chưa Có Banner Nào</h3>
            <p className="text-xs text-slate-500 font-medium">
              Thêm banner đầu tiên để hiển thị các chương trình khuyến mãi nổi bật trên trang chủ CineDot.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] text-white text-xs font-black uppercase tracking-wider"
          >
            + THÊM BANNER MỚI
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {banners.map((b: AdminBanner) => (
            <div
              key={b.id}
              className="rounded-3xl bg-white border border-purple-100 shadow-xs hover:shadow-md hover:border-[#7C6FE8]/60 transition-all flex flex-col overflow-hidden group"
            >
              {/* Banner Image Preview Container */}
              <div className="w-full h-48 bg-slate-100 relative overflow-hidden">
                <img
                  src={imageHelper.getBannerUrl(b.imageUrl || (b as any).image_url)}
                  alt={b.title || 'Banner quảng cáo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as any).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Overlay Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-mono font-bold backdrop-blur-xs flex items-center gap-1">
                    <Hash className="w-3 h-3 text-purple-300" />
                    <span>Thứ tự: {b.order}</span>
                  </span>

                  <div className="pointer-events-auto">
                    <button
                      onClick={() => handleToggle(b.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black border backdrop-blur-xs transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                        b.isActive
                          ? 'bg-emerald-500/90 text-white border-emerald-400'
                          : 'bg-slate-800/80 text-slate-300 border-slate-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${b.isActive ? 'bg-white' : 'bg-slate-400'}`} />
                      <span>{b.isActive ? 'HIỂN THỊ' : 'ẨN'}</span>
                    </button>
                  </div>
                </div>

                {/* Campaign Tag */}
                {b.campaignName && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 text-purple-200 text-[11px] font-bold backdrop-blur-xs flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#7C6FE8]" />
                    <span>{b.campaignName}</span>
                  </span>
                )}
              </div>

              {/* Banner Info */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-black text-slate-900 line-clamp-2 group-hover:text-[#7C6FE8] transition-colors leading-snug">
                    {b.title}
                  </h3>

                  {b.linkUrl && (
                    <a
                      href={b.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-[#7C6FE8] font-medium flex items-center gap-1 transition-colors truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{b.linkUrl}</span>
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="px-3 py-1.5 rounded-xl hover:bg-purple-50 text-[#7C6FE8] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa</span>
                  </button>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-3 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Banner Studio Modal */}
      <BannerStudioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        bannerToEdit={bannerToEdit}
        defaultCampaignId={initialCampaignId ? Number(initialCampaignId) : null}
      />
    </div>
  );
}
