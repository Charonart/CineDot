'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Code,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  AdminPricingRuleItem,
  CreatePricingRulePayload,
  ModifierType,
  PricingRuleConditions,
} from '../../types/adminPricingRule.types';
import {
  CATEGORY_OPTIONS,
  parseConditions,
  translateConditionsToVietnamese,
} from '../../utils/pricingRuleHelper';
import { ConditionBuilder } from './ConditionBuilder';

interface PricingRuleFormModalProps {
  isOpen: boolean;
  initialData?: AdminPricingRuleItem | null;
  onClose: () => void;
  onSubmit: (payload: CreatePricingRulePayload) => Promise<void>;
  isSaving: boolean;
}

export const PricingRuleFormModal: React.FC<PricingRuleFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isSaving,
}) => {
  const isEdit = Boolean(initialData);

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState('weekend_surcharge');
  const [customCategory, setCustomCategory] = useState('');
  const [actionType, setActionType] = useState<'surcharge' | 'discount'>('surcharge');
  const [modifierType, setModifierType] = useState<ModifierType>('fixed_amount');
  const [rawValue, setRawValue] = useState<number | string>(10000);
  const [priority, setPriority] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [conditions, setConditions] = useState<PricingRuleConditions>({});

  // Editor mode tab: 'visual' or 'json'
  const [editorMode, setEditorMode] = useState<'visual' | 'json'>('visual');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Status message
  const [errorMsg, setErrorMsg] = useState('');

  // Sync initialData
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      const cat = initialData.rule_category || 'general';
      const isKnownCategory = CATEGORY_OPTIONS.some((c) => c.id === cat);
      if (isKnownCategory) {
        setCategory(cat);
        setCustomCategory('');
      } else {
        setCategory('custom');
        setCustomCategory(cat);
      }

      const numVal = Number(initialData.modifier_value) || 0;
      if (numVal < 0) {
        setActionType('discount');
        setRawValue(Math.abs(numVal));
      } else {
        setActionType('surcharge');
        setRawValue(numVal);
      }

      setModifierType(initialData.modifier_type || 'fixed_amount');
      setPriority(initialData.priority ?? 1);
      setIsActive(initialData.is_active ?? true);

      const parsedCond = parseConditions(initialData.conditions);
      setConditions(parsedCond);
      setJsonText(JSON.stringify(parsedCond, null, 2));
    } else {
      setName('');
      setCategory('weekend_surcharge');
      setCustomCategory('');
      setActionType('surcharge');
      setModifierType('fixed_amount');
      setRawValue(10000);
      setPriority(1);
      setIsActive(true);
      const defaultCond: PricingRuleConditions = { days: ['Saturday', 'Sunday'], time_from: '18:00', time_to: '23:00' };
      setConditions(defaultCond);
      setJsonText(JSON.stringify(defaultCond, null, 2));
    }
    setJsonError(null);
    setErrorMsg('');
  }, [initialData, isOpen]);

  // Compute final signed modifier value
  const signedModifierValue = useMemo(() => {
    const absVal = Math.abs(Number(rawValue) || 0);
    return actionType === 'discount' ? -absVal : absVal;
  }, [actionType, rawValue]);

  // Realtime Natural Language explanation
  const naturalLanguagePreview = useMemo(() => {
    return translateConditionsToVietnamese(conditions, modifierType, signedModifierValue);
  }, [conditions, modifierType, signedModifierValue]);

  // Handle Switch to JSON mode
  const handleSwitchToJson = () => {
    setJsonText(JSON.stringify(conditions, null, 2));
    setJsonError(null);
    setEditorMode('json');
  };

  // Handle Switch to Visual mode
  const handleSwitchToVisual = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
        setJsonError('Cấu hình JSON phải là một đối tượng (object {}, không phải mảng [])');
        return;
      }
      setConditions(parsed);
      setJsonError(null);
      setEditorMode('visual');
    } catch (e: any) {
      setJsonError('Cú pháp JSON không hợp lệ: ' + (e.message || 'Syntax Error'));
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên quy tắc giá.');
      return;
    }

    let finalConditions = conditions;
    if (editorMode === 'json') {
      try {
        const parsed = JSON.parse(jsonText);
        if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
          setErrorMsg('Cấu hình JSON phải là một đối tượng (object {}).');
          return;
        }
        finalConditions = parsed;
      } catch (e: any) {
        setErrorMsg('Cú pháp JSON không hợp lệ: ' + e.message);
        return;
      }
    }

    const finalCategory = category === 'custom' ? customCategory.trim() || 'general' : category;

    const payload: CreatePricingRulePayload = {
      name: name.trim(),
      rule_category: finalCategory,
      conditions: finalConditions,
      modifier_type: modifierType,
      modifier_value: signedModifierValue,
      priority: Number(priority) || 0,
      is_active: isActive,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || 'Lỗi khi lưu quy tắc giá.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative my-8 text-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-extrabold text-slate-900">
                {isEdit ? 'Chỉnh Sửa Quy Tắc Định Giá' : 'Tạo Quy Tắc Định Giá Mới'}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Cấu hình công thức điều chỉnh giá vé tự động theo ngữ cảnh
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

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* SECTION 1: Basic Information */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Thông tin quy tắc
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Tên quy tắc định giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phụ thu cuối tuần, Suất chiếu sớm Early Bird..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Danh mục quy tắc</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                  <option value="custom">Tự đặt tên danh mục khác...</option>
                </select>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Mức độ ưu tiên (Priority)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Càng cao ưu tiên trước</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              {/* Custom Category Input if selected */}
              {category === 'custom' && (
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Mã danh mục tùy chỉnh</label>
                  <input
                    type="text"
                    placeholder="ví dụ: summer_campaign_2026"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Modifier Config (Surcharge vs Discount) */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 border border-gray-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Công thức điều chỉnh giá vé
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              {/* Action Type: Surcharge (+) or Discount (-) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Hình thức điều chỉnh</label>
                <div className="grid grid-cols-2 p-1 rounded-xl bg-white border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActionType('surcharge')}
                    className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      actionType === 'surcharge'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Phụ thu (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType('discount')}
                    className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      actionType === 'discount'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Giảm giá (-)</span>
                  </button>
                </div>
              </div>

              {/* Modifier Type: Fixed or Percentage */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Đơn vị tính</label>
                <select
                  value={modifierType}
                  onChange={(e) => setModifierType(e.target.value as ModifierType)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                >
                  <option value="fixed_amount">Số tiền cố định (VNĐ)</option>
                  <option value="percentage">Phần trăm (%)</option>
                </select>
              </div>

              {/* Raw Value */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Giá trị điều chỉnh ({modifierType === 'percentage' ? '%' : 'VNĐ'})
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={rawValue}
                  onChange={(e) => setRawValue(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-black text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
            </div>

            {/* Active Status Checkbox */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-gray-200/60">
              <input
                type="checkbox"
                id="rule-active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-[#7C6FE8] focus:ring-[#7C6FE8] cursor-pointer"
              />
              <label htmlFor="rule-active" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                Kích hoạt quy tắc giá này ngay sau khi lưu
              </label>
            </div>
          </div>

          {/* SECTION 3: Dynamic Conditions Builder (Visual vs JSON) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Điều kiện áp dụng (Conditions)
              </span>

              {/* Mode Toggle Switch */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-gray-200">
                <button
                  type="button"
                  onClick={handleSwitchToVisual}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    editorMode === 'visual'
                      ? 'bg-white text-[#7C6FE8] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Trực quan</span>
                </button>

                <button
                  type="button"
                  onClick={handleSwitchToJson}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    editorMode === 'json'
                      ? 'bg-white text-[#7C6FE8] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code JSON</span>
                </button>
              </div>
            </div>

            {editorMode === 'visual' ? (
              <ConditionBuilder conditions={conditions} onChange={setConditions} />
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  rows={8}
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    setJsonError(null);
                  }}
                  className="w-full p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#7C6FE8]"
                />
                {jsonError && (
                  <span className="text-xs text-red-600 font-bold">{jsonError}</span>
                )}
                <span className="text-[11px] text-slate-500">
                  Nhập cấu hình JSON chuẩn theo cú pháp (hỗ trợ days, time_from, time_to, seat_types, date_range, min_seats, age_range,...).
                </span>
              </div>
            )}
          </div>

          {/* SECTION 4: Live Natural Language Preview Banner */}
          <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-[#7C6FE8] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-[#7C6FE8]">Diễn giải ngôn ngữ tự nhiên (Hiển thị cho User):</span>
              <p className="text-slate-700 font-medium leading-relaxed">
                {naturalLanguagePreview}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEdit ? 'LƯU THAY ĐỔI' : 'TẠO QUY TẮC MỚI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
