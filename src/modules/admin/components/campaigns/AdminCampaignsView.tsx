'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Plus,
  Search,
  DollarSign,
  Ticket,
  Image as ImageIcon,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Power,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { CampaignStudioModal } from './CampaignStudioModal';
import { useAdminCampaigns } from '../../hooks/useAdminCampaigns';
import { AdminCampaign } from '../../types/adminCampaign.types';

export function AdminCampaignsView() {
  const {
    campaigns,
    stats,
    filters,
    setFilters,
    isLoading,
    isStatsLoading,
    createCampaign,
    updateCampaign,
    toggleCampaignStatus,
    deleteCampaign,
  } = useAdminCampaigns();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<AdminCampaign | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleOpenCreate = () => {
    setCampaignToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (camp: AdminCampaign) => {
    setCampaignToEdit(camp);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: any) => {
    if (campaignToEdit) {
      await updateCampaign({ id: campaignToEdit.id, payload });
    } else {
      await createCampaign(payload);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa chiến dịch này không? Tất cả voucher liên kết sẽ được tách riêng.')) {
      await deleteCampaign(id);
    }
  };

  const handleToggle = async (id: number) => {
    await toggleCampaignStatus(id);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Chiến Dịch Tiếp Thị & Khuyến Mãi
            </h1>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>TẠO CHIẾN DỊCH MỚI</span>
        </button>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="p-4 rounded-3xl bg-white border border-purple-100/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm chiến dịch..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] outline-none text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={filters.is_active !== undefined ? String(filters.is_active) : ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                is_active: e.target.value === '' ? undefined : e.target.value === 'true',
                page: 1,
              })
            }
            className="px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-slate-700 bg-white focus:border-[#7C6FE8] outline-none cursor-pointer"
          >
            <option value="">Tất Cả Trạng Thái</option>
            <option value="true">Đang Hoạt Động</option>
            <option value="false">Tạm Ngưng</option>
          </select>
        </div>
      </div>

      {/* 5. Campaign Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-3 border-[#7C6FE8]/30 border-t-[#7C6FE8] rounded-full animate-spin" />
          <span className="text-xs font-bold">Đang tải danh sách chiến dịch tiếp thị...</span>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-16 rounded-3xl bg-white border border-dashed border-purple-200 flex flex-col items-center justify-center gap-4 text-center p-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
            <Target className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-base font-black text-slate-900">Chưa Có Chiến Dịch Nào</h3>
            <p className="text-xs text-slate-500 font-medium">
              Tạo chiến dịch tiếp thị đầu tiên để quản lý ngân sách, phát hành voucher và gắn banner quảng cáo.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] text-white text-xs font-black uppercase tracking-wider"
          >
            + TẠO CHIẾN DỊCH NGAY
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaigns.map((camp: AdminCampaign) => {
            const budgetUsedPercent =
              camp.budget > 0 ? Math.min(Math.round((camp.usedBudget / camp.budget) * 100), 100) : 0;

            return (
              <div
                key={camp.id}
                className="p-6 rounded-3xl bg-white border border-purple-100/90 shadow-xs hover:shadow-md hover:border-[#7C6FE8]/60 transition-all flex flex-col justify-between gap-5 relative overflow-hidden group"
              >
                {/* Top: Header info & Status */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-[#7C6FE8] text-[11px] font-mono font-black border border-purple-200">
                      ID: #{camp.id}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(camp.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                          camp.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${camp.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{camp.isActive ? 'HOẠT ĐỘNG' : 'TẠM DỪNG'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(camp)}
                        className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                        title="Chỉnh sửa chiến dịch"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(camp.id)}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Xóa chiến dịch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 tracking-tight line-clamp-1 group-hover:text-[#7C6FE8] transition-colors">
                    {camp.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {camp.startDate || 'Bắt đầu'} &rarr; {camp.endDate || 'Dài hạn'}
                    </span>
                  </div>
                </div>

                {/* Middle: Financial & ROI Progress */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Ngân Sách:</span>
                    <span className="font-mono font-black text-slate-900">
                      {(camp.budget ?? 0) > 0 ? `${(Number(camp.budget) || 0).toLocaleString('vi-VN')} đ` : 'Chưa định mức'}
                    </span>
                  </div>

                  {/* Budget Usage Bar */}
                  <div className="flex flex-col gap-1">
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#7C6FE8] to-indigo-500 rounded-full transition-all"
                        style={{ width: `${budgetUsedPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span>Đã dùng: {(Number(camp.usedBudget) || 0).toLocaleString('vi-VN')} đ</span>
                      <span>{budgetUsedPercent}%</span>
                    </div>
                  </div>

                  {/* ROI Indicator */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-500 font-bold">Doanh Thu Thu Về:</span>
                    <span className="font-mono font-black text-emerald-600">
                      +{(Number(camp.revenueGenerated) || 0).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Bottom: Quick Links to Vouchers & Banners */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <Link
                    href={`/admin/campaign/voucher?campaign_id=${camp.id}`}
                    className="px-3 py-2 rounded-xl bg-purple-50/70 hover:bg-purple-100 text-[#7C6FE8] text-xs font-black flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{camp.vouchersCount ?? 0} Vouchers</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/admin/campaign/banner?campaign_id=${camp.id}`}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{camp.bannersCount ?? 0} Banners</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Campaign Studio Modal */}
      <CampaignStudioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        campaignToEdit={campaignToEdit}
      />
    </div>
  );
}
