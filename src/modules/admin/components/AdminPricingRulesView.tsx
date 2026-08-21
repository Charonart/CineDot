'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Filter,
  Calendar,
  Clock,
  Armchair,
  Info,
  Check,
  X,
} from 'lucide-react';
import { useAdminPricingRules } from '../hooks/useAdminPricingRules';
import {
  AdminPricingRuleItem,
  CreatePricingRulePayload,
  PricingRuleConditions,
} from '../types/adminPricingRule.types';
import {
  CATEGORY_OPTIONS,
  DAY_OPTIONS,
  formatModifier,
  getCategoryLabel,
  parseConditions,
  translateConditionsToVietnamese,
} from '../utils/pricingRuleHelper';
import { PricingRuleFormModal } from './pricing-rules/PricingRuleFormModal';

export function AdminPricingRulesView() {
  // Search & Filters state
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Hook
  const {
    rulesList,
    pagination,
    isLoading,
    isFetching,
    error,
    params,
    setParams,
    createRule,
    isCreating,
    updateRule,
    isUpdating,
    toggleActive,
    deleteRule,
    isDeleting,
  } = useAdminPricingRules({
    search: searchTerm || undefined,
    rule_category: selectedCategory || undefined,
    is_active: selectedActiveStatus !== '' ? selectedActiveStatus : undefined,
    page: currentPage,
    per_page: 10,
  });

  // Sync params when filters change
  useEffect(() => {
    setParams({
      search: searchTerm || undefined,
      rule_category: selectedCategory || undefined,
      is_active: selectedActiveStatus !== '' ? selectedActiveStatus : undefined,
      page: currentPage,
      per_page: 10,
    });
  }, [searchTerm, selectedCategory, selectedActiveStatus, currentPage, setParams]);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AdminPricingRuleItem | null>(null);
  const [deletingRule, setDeletingRule] = useState<AdminPricingRuleItem | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Handle Open Create
  const handleOpenCreate = () => {
    setEditingRule(null);
    setIsFormModalOpen(true);
  };

  // Handle Open Edit
  const handleOpenEdit = (rule: AdminPricingRuleItem) => {
    setEditingRule(rule);
    setIsFormModalOpen(true);
  };

  // Handle Submit Form
  const handleFormSubmit = async (payload: CreatePricingRulePayload) => {
    if (editingRule) {
      await updateRule(editingRule.id || editingRule.pricing_rule_id, payload);
      showToast(`Đã cập nhật thành công quy tắc "${payload.name}"!`);
    } else {
      await createRule(payload);
      showToast(`Đã tạo thành công quy tắc mới "${payload.name}"!`);
    }
  };

  // Handle Toggle Active
  const handleToggle = async (rule: AdminPricingRuleItem) => {
    try {
      const id = rule.id || rule.pricing_rule_id;
      await toggleActive(id);
      showToast(
        `Đã ${!rule.is_active ? 'kích hoạt' : 'tạm dừng'} quy tắc "${rule.name}"`
      );
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingRule) return;
    try {
      const id = deletingRule.id || deletingRule.pricing_rule_id;
      await deleteRule(id);
      showToast(`Đã xóa quy tắc "${deletingRule.name}" thành công!`);
      setDeletingRule(null);
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa quy tắc', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Notification */}
      {notificationMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {notificationMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>QUY TẮC ĐỊNH GIÁ & ĐIỀU CHỈNH VÉ</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Dynamic Pricing Rules
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Thiết lập công thức phụ thu giờ vàng/cuối tuần, giảm giá suất sớm, ngày hội và ưu đãi theo đối tượng.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ TẠO QUY TẮC MỚI</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên quy tắc định giá..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#7C6FE8] w-full md:w-48"
          >
            <option value="">Tất cả danh mục</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Active Status Filter */}
          <select
            value={selectedActiveStatus}
            onChange={(e) => {
              setSelectedActiveStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#7C6FE8] w-full md:w-40"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang kích hoạt</option>
            <option value="false">Đã tạm dừng</option>
          </select>
        </div>
      </div>

      {/* 4. Table / Rules List */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#7C6FE8]" />
            <span className="text-xs font-medium">Đang tải danh sách quy tắc định giá...</span>
          </div>
        ) : rulesList.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-extrabold text-slate-900">Không tìm thấy quy tắc giá nào</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc nhấn nút Tạo mới để bổ sung quy tắc định giá.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/70 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Tên quy tắc & Danh mục</th>
                  <th className="py-4 px-4">Mức điều chỉnh</th>
                  <th className="py-4 px-4">Điều kiện kích hoạt (Conditions)</th>
                  <th className="py-4 px-3 text-center">Độ ưu tiên</th>
                  <th className="py-4 px-4 text-center">Trạng thái</th>
                  <th className="py-4 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {rulesList.map((rule) => {
                  const id = rule.id || rule.pricing_rule_id;
                  const mod = formatModifier(rule.modifier_type, rule.modifier_value);
                  const conds = parseConditions(rule.conditions);
                  const explanation = translateConditionsToVietnamese(
                    conds,
                    rule.modifier_type,
                    rule.modifier_value
                  );

                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Category */}
                      <td className="py-4 px-5 align-top">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {rule.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8] text-[10px] font-extrabold border border-purple-200">
                              {getCategoryLabel(rule.rule_category)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              #{id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Modifier */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-black inline-flex items-center gap-1 w-fit ${
                              mod.isDiscount
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {mod.isDiscount ? (
                              <TrendingDown className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingUp className="w-3.5 h-3.5" />
                            )}
                            <span>{mod.text}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {rule.modifier_type === 'percentage' ? 'Theo % tiền vé' : 'Số tiền cố định/vé'}
                          </span>
                        </div>
                      </td>

                      {/* Conditions Breakdown Visual Chips */}
                      <td className="py-4 px-4 align-top max-w-md">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            {/* Days chips */}
                            {conds.days && conds.days.length > 0 && (
                              <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {conds.days.length === 7
                                    ? 'Cả tuần'
                                    : conds.days
                                        .map((d) => {
                                          const found = DAY_OPTIONS.find(
                                            (opt) => opt.id.toLowerCase() === d.toLowerCase()
                                          );
                                          return found ? found.short : d;
                                        })
                                        .join(', ')}
                                </span>
                              </span>
                            )}

                            {/* Time range */}
                            {(conds.time_from || conds.time_to || conds.time_range) && (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {conds.time_from || conds.time_range?.from || '00:00'} -{' '}
                                  {conds.time_to || conds.time_range?.to || '23:59'}
                                </span>
                              </span>
                            )}

                            {/* Seat types */}
                            {conds.seat_types && conds.seat_types.length > 0 && (
                              <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-[#7C6FE8] text-[10px] font-bold border border-purple-200 flex items-center gap-1 uppercase">
                                <Armchair className="w-3 h-3" />
                                <span>{conds.seat_types.join(', ')}</span>
                              </span>
                            )}

                            {/* Date range */}
                            {conds.date_range && (
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {conds.date_range.from} → {conds.date_range.to}
                              </span>
                            )}

                            {/* Min seats */}
                            {conds.min_seats && (
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                                ≥ {conds.min_seats} vé
                              </span>
                            )}

                            {/* Age */}
                            {(conds.min_age !== undefined || conds.max_age !== undefined) && (
                              <span className="px-2 py-0.5 rounded-lg bg-pink-50 text-pink-700 text-[10px] font-bold border border-pink-100">
                                {conds.max_age && `≤ ${conds.max_age}t (HSSV)`}
                                {conds.min_age && `≥ ${conds.min_age}t (Cao tuổi)`}
                              </span>
                            )}
                          </div>

                          {/* Human readable explanation */}
                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                            💡 {explanation}
                          </p>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-3 align-top text-center">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                          {rule.priority}
                        </span>
                      </td>

                      {/* Active Switch Toggle */}
                      <td className="py-4 px-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(rule)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            rule.is_active ? 'bg-emerald-500' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              rule.is_active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(rule)}
                            className="p-2 rounded-xl text-slate-600 hover:text-[#7C6FE8] hover:bg-purple-50 transition-colors"
                            title="Chỉnh sửa quy tắc"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingRule(rule)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa quy tắc"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.total > pagination.per_page && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Hiển thị {rulesList.length} trên tổng số {pagination.total} quy tắc
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-gray-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-800">
                Trang {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                disabled={currentPage >= pagination.last_page}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-xl border border-gray-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal (Create & Edit) */}
      <PricingRuleFormModal
        isOpen={isFormModalOpen}
        initialData={editingRule}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSaving={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      {deletingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-2xl border border-red-100 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-extrabold text-slate-900">Xác Nhận Xóa Quy Tắc Giá</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Bạn có chắc chắn muốn xóa quy tắc{' '}
                <strong className="text-slate-900">"{deletingRule.name}"</strong>? Sau khi xóa, hệ thống sẽ
                không áp dụng công thức này vào việc tính giá vé nữa.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingRule(null)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>XÁC NHẬN XÓA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
