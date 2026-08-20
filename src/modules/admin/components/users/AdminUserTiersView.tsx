'use client';

import React, { useState } from 'react';
import {
  Award,
  Plus,
  Sparkles,
  Percent,
  Users,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Gift,
  Crown,
} from 'lucide-react';
import { UsersStaffSubNavTabs } from './UsersStaffSubNavTabs';
import { useAdminTiers } from '../../hooks/useAdminTiers';
import { UserTierStudioModal } from './UserTierStudioModal';
import { UserTierDTO } from '../../dto/adminUserManagement.dto';

export function AdminUserTiersView() {
  const {
    tiers,
    isLoading,
    createTier,
    updateTier,
    deleteTier,
  } = useAdminTiers();

  const [editingTier, setEditingTier] = useState<UserTierDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingTier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tier: UserTierDTO) => {
    setEditingTier(tier);
    setIsModalOpen(true);
  };

  const handleDelete = async (tier: UserTierDTO) => {
    if (confirm(`Bạn có chắc chắn muốn xóa cấp bậc "${tier.tier}" không?`)) {
      await deleteTier(tier.id);
    }
  };

  const getTierGradient = (tierName?: string | null) => {
    const lower = String(tierName || '').toLowerCase();
    if (lower.includes('diamond')) {
      return 'from-cyan-500/20 via-blue-500/10 to-indigo-500/10 border-cyan-200 text-cyan-700';
    }
    if (lower.includes('platinum')) {
      return 'from-slate-300/40 via-purple-100/30 to-indigo-100/30 border-purple-200 text-purple-800';
    }
    if (lower.includes('gold')) {
      return 'from-amber-400/20 via-yellow-100/40 to-orange-100/30 border-amber-200 text-amber-700';
    }
    if (lower.includes('silver')) {
      return 'from-slate-200/50 via-slate-100/40 to-gray-100/30 border-slate-300 text-slate-700';
    }
    return 'from-amber-700/10 via-orange-100/30 to-amber-100/20 border-amber-200 text-amber-900';
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Shared Sub-Nav Tabs */}
      <UsersStaffSubNavTabs />

      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>CHÍNH SÁCH HẠNG THÀNH VIÊN & TÍCH ĐIỂM</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Quản Lý Cấp Bậc Hội Viên
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Thiết lập ngưỡng điểm thăng hạng, quyền lợi chiết khấu và mức tích điểm thưởng cho khách hàng.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#7C6FE8]/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ THÊM CẤP BẬC MỚI</span>
        </button>
      </div>

      {/* 2. Tiers Visual Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-bold">
          Đang nạp chính sách cấp bậc...
        </div>
      ) : tiers.length === 0 ? (
        <div className="py-16 rounded-3xl bg-white border border-dashed border-purple-200 text-center flex flex-col items-center justify-center gap-3">
          <Award className="w-10 h-10 text-[#7C6FE8]" />
          <span className="text-xs font-bold text-slate-500">Chưa có cấp bậc nào được thiết lập.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {tiers.map((t, idx) => {
            const cardGradient = getTierGradient(t.tier);

            return (
              <div
                key={t.id}
                className="rounded-3xl bg-white border border-purple-100 shadow-xs hover:shadow-md hover:border-[#7C6FE8]/50 transition-all flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Header Banner */}
                <div className={`p-5 bg-gradient-to-br ${cardGradient} border-b flex items-start justify-between relative`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center font-black">
                      <Crown className="w-5 h-5 text-[#7C6FE8]" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">
                        {t.tier}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Cấp {idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      title="Chỉnh sửa"
                      className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {tiers.length > 1 && (
                      <button
                        onClick={() => handleDelete(t)}
                        title="Xóa cấp bậc"
                        className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Specs */}
                <div className="p-5 flex flex-col gap-4">
                  {/* Min Points */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Ngưỡng Điểm</span>
                    </span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {t.min_points.toLocaleString('vi-VN')} Pts
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-[#7C6FE8]" />
                      <span>Chiết Khấu Ưu Đãi</span>
                    </span>
                    <span className="text-sm font-black text-emerald-600 font-mono">
                      -{t.discount_percent}%
                    </span>
                  </div>

                  {/* Members count */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <span className="text-slate-400 font-bold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Số Hội Viên Đạt Được</span>
                    </span>
                    <span className="font-mono font-black text-slate-800">
                      {t.members_count !== undefined ? t.members_count : '---'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Tier Studio Modal */}
      <UserTierStudioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tierToEdit={editingTier}
        onSave={(payload) => {
          if (editingTier) {
            return updateTier({ id: editingTier.id, payload });
          }
          return createTier(payload);
        }}
      />
    </div>
  );
}
