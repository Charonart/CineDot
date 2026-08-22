'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  Copy,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Sparkles,
  Percent,
  DollarSign,
  Calendar,
  Layers,
  Clock,
} from 'lucide-react';
import { VoucherStudioModal } from './VoucherStudioModal';
import { useAdminVouchers } from '../../hooks/useAdminVouchers';
import { useAdminCampaigns } from '../../hooks/useAdminCampaigns';
import { AdminVoucher } from '../../types/adminCampaign.types';

export function AdminCampaignVouchersView() {
  const searchParams = useSearchParams();
  const initialCampaignId = searchParams.get('campaign_id') || undefined;

  const {
    vouchers,
    stats,
    filters,
    setFilters,
    isLoading,
    isStatsLoading,
    createVoucher,
    updateVoucher,
    toggleVoucherStatus,
    deleteVoucher,
  } = useAdminVouchers({ campaign_id: initialCampaignId });

  const { campaigns } = useAdminCampaigns({ limit: 100 });

  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voucherToEdit, setVoucherToEdit] = useState<AdminVoucher | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreate = () => {
    setVoucherToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: AdminVoucher) => {
    setVoucherToEdit(v);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: any) => {
    if (voucherToEdit) {
      await updateVoucher({ id: voucherToEdit.id, payload });
    } else {
      await createVoucher(payload);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa mã voucher này không?')) {
      await deleteVoucher(id);
    }
  };

  const handleToggle = async (id: number) => {
    await toggleVoucherStatus(id);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kho Voucher & Mã Khuyến Mãi
            </h1>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>TẠO VOUCHER MỚI</span>
        </button>
      </div>

      {/* 2. Toolbar & Multi-Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-purple-100/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên voucher..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] outline-none text-xs font-semibold text-slate-800"
          />
        </div>

        {/* Middle: Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Lọc theo Campaign */}
          <select
            value={filters.campaign_id !== undefined ? String(filters.campaign_id) : ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                campaign_id: e.target.value || undefined,
                page: 1,
              })
            }
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 bg-white focus:border-[#7C6FE8] outline-none cursor-pointer"
          >
            <option value="">Tất Cả Chiến Dịch</option>
            {campaigns.map((c: any) => (
              <option key={c.id} value={c.id}>
                #{c.id} - {c.name}
              </option>
            ))}
          </select>

          {/* Lọc theo Loại giảm giá */}
          <select
            value={filters.discount_type || ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                discount_type: e.target.value || undefined,
                page: 1,
              })
            }
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 bg-white focus:border-[#7C6FE8] outline-none cursor-pointer"
          >
            <option value="">Tất Cả Hình Thức</option>
            <option value="percentage">Giảm Theo %</option>
            <option value="fixed_amount">Giảm Tiền Cố Định (₫)</option>
          </select>

          {/* Lọc theo Trạng thái */}
          <select
            value={filters.status || ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value || undefined,
                page: 1,
              })
            }
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 bg-white focus:border-[#7C6FE8] outline-none cursor-pointer"
          >
            <option value="">Tất Cả Trạng Thái</option>
            <option value="active">Đang Hoạt Động</option>
            <option value="expired">Đã Hết Hạn</option>
            <option value="depleted">Đã Hết Lượt Dùng</option>
            <option value="inactive">Tạm Ngưng</option>
          </select>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl shrink-0 self-end lg:self-auto">
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'card' ? 'bg-white text-[#7C6FE8] shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Dạng thẻ cuống vé"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-[#7C6FE8] shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Dạng bảng dữ liệu"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Vouchers Content */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-3 border-[#7C6FE8]/30 border-t-[#7C6FE8] rounded-full animate-spin" />
          <span className="text-xs font-bold">Đang nạp kho Voucher khuyến mãi...</span>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="py-16 rounded-3xl bg-white border border-dashed border-purple-200 flex flex-col items-center justify-center gap-4 text-center p-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-base font-black text-slate-900">Không Tìm Thấy Voucher Nào</h3>
            <p className="text-xs text-slate-500 font-medium">
              Không có mã giảm giá nào phù hợp với bộ lọc hiện tại. Thử xóa bộ lọc hoặc tạo mã voucher mới.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] text-white text-xs font-black uppercase tracking-wider"
          >
            + TẠO VOUCHER MỚI
          </button>
        </div>
      ) : viewMode === 'card' ? (
        /* Card View: Ticket Cutout Style */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {vouchers.map((v: AdminVoucher) => {
            const usagePercent =
              v.systemLimit && v.systemLimit > 0
                ? Math.min(Math.round((Number(v.usedCount) || 0) / Number(v.systemLimit) * 100), 100)
                : null;

            const isPercentage = v.discountType === 'percentage';
            const discountLabel = isPercentage
              ? `-${Number(v.discountValue) || 0}%`
              : `-${(Number(v.discountValue) || 0).toLocaleString('vi-VN')} đ`;

            return (
              <div
                key={v.id}
                className="rounded-3xl bg-white border border-purple-100 shadow-xs hover:shadow-md hover:border-[#7C6FE8]/60 transition-all flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Upper Half: Header & Discount Badge */}
                <div className="p-5 flex flex-col gap-3">
                  {/* Top Bar: Code + Copy + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(v.code)}
                        className="px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] text-xs font-mono font-black border border-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Bấm để sao chép mã"
                      >
                        <span>{v.code}</span>
                        {copiedCode === v.code ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 opacity-60" />
                        )}
                      </button>

                      {v.campaignName && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold max-w-[120px] truncate">
                          {v.campaignName}
                        </span>
                      )}
                    </div>

                    {/* Toggle Active Button */}
                    <button
                      onClick={() => handleToggle(v.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                        v.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${v.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{v.isActive ? 'HIỆU LỰC' : 'TẠM DỪNG'}</span>
                    </button>
                  </div>

                  {/* Title & Discount Highlight */}
                  <div className="flex items-start justify-between gap-3 mt-1">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-black text-slate-900 line-clamp-1 group-hover:text-[#7C6FE8] transition-colors">
                        {v.title || `Voucher ${v.code}`}
                      </h3>
                      {v.description && (
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {v.description}
                        </p>
                      )}
                    </div>

                    <div className="px-3 py-1.5 rounded-2xl bg-linear-to-r from-[#7C6FE8] to-indigo-600 text-white font-mono font-black text-sm shrink-0 shadow-xs">
                      {discountLabel}
                    </div>
                  </div>
                </div>

                {/* Perforated Divider (Notched Cutouts) */}
                <div className="relative flex items-center justify-between w-full px-1">
                  <div className="w-3.5 h-7 rounded-r-full bg-slate-100 border-r border-t border-b border-purple-100 -ml-1" />
                  <div className="w-full border-t-2 border-dashed border-purple-100 mx-2" />
                  <div className="w-3.5 h-7 rounded-l-full bg-slate-100 border-l border-t border-b border-purple-100 -mr-1" />
                </div>

                {/* Lower Half: Terms, Progress & Actions */}
                <div className="p-5 pt-3 flex flex-col gap-3 bg-slate-50/50">
                  {/* Min Spend & Expiry */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Đơn Tối Thiểu</span>
                      <span className="font-mono font-bold text-slate-800">
                        {(Number(v.minOrderValue) || 0) > 0 ? `${(Number(v.minOrderValue) || 0).toLocaleString('vi-VN')} đ` : '0 đ'}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Hạn Sử Dụng</span>
                      <span className="text-slate-800 font-medium">
                        {v.validUntil ? v.validUntil.slice(0, 10) : 'Không thời hạn'}
                      </span>
                    </div>
                  </div>

                  {/* Usage Limit Bar */}
                  {v.systemLimit ? (
                    <div className="flex flex-col gap-1">
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[#7C6FE8] rounded-full"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                        <span>Đã dùng: {Number(v.usedCount) || 0}/{v.systemLimit} lượt</span>
                        <span>{usagePercent}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-bold">
                      Đã áp dụng: {Number(v.usedCount) || 0} lượt (Không giới hạn)
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/60">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="px-3 py-1.5 rounded-xl hover:bg-purple-50 text-[#7C6FE8] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Chỉnh sửa</span>
                    </button>

                    <button
                      onClick={() => handleDelete(v.id)}
                      className="px-3 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View: Enterprise Data Table */
        <div className="w-full bg-white rounded-3xl border border-purple-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-50/60 border-b border-purple-100 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã Voucher</th>
                  <th className="py-3.5 px-4">Tiêu Đề & Chiến Dịch</th>
                  <th className="py-3.5 px-4">Mức Giảm</th>
                  <th className="py-3.5 px-4">Đơn Tối Thiểu</th>
                  <th className="py-3.5 px-4">Lượt Đã Dùng</th>
                  <th className="py-3.5 px-4">Hạn Dùng</th>
                  <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {vouchers.map((v: AdminVoucher) => (
                  <tr key={v.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-[#7C6FE8]">
                      {v.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{v.title || '---'}</span>
                        {v.campaignName && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Chiến dịch: {v.campaignName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-slate-900">
                      {v.discountType === 'percentage'
                        ? `${Number(v.discountValue) || 0}%`
                        : `${(Number(v.discountValue) || 0).toLocaleString('vi-VN')} đ`}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {(Number(v.minOrderValue) || 0) > 0 ? `${(Number(v.minOrderValue) || 0).toLocaleString('vi-VN')} đ` : '0 đ'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {Number(v.usedCount) || 0} {v.systemLimit ? `/ ${v.systemLimit}` : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {v.validUntil ? v.validUntil.slice(0, 10) : 'Vô thời hạn'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggle(v.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border cursor-pointer ${
                          v.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {v.isActive ? 'HIỆU LỰC' : 'TẠM DỪNG'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-500 hover:text-[#7C6FE8]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Voucher Studio Modal */}
      <VoucherStudioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        voucherToEdit={voucherToEdit}
        defaultCampaignId={initialCampaignId ? Number(initialCampaignId) : null}
      />
    </div>
  );
}
