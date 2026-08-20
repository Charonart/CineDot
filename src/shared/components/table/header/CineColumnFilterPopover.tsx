'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Filter,
  X,
  Check,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { ColumnDef, ColumnFilterRule, FilterOperator } from '@/shared/types/dataTable.types';

interface CineColumnFilterPopoverProps<T> {
  column: ColumnDef<T>;
  currentFilter?: ColumnFilterRule;
  onApplyFilter: (rule: ColumnFilterRule | null) => void;
}

export function CineColumnFilterPopover<T>({
  column,
  currentFilter,
  onApplyFilter,
}: CineColumnFilterPopoverProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [operator, setOperator] = useState<FilterOperator>(currentFilter?.op || 'contains');
  const [value, setValue] = useState<any>(currentFilter?.val ?? '');
  const [rangeMin, setRangeMin] = useState<any>('');
  const [rangeMax, setRangeMax] = useState<any>('');
  const [selectSearch, setSelectSearch] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Sync state when filter prop changes or popover opens
  useEffect(() => {
    if (currentFilter) {
      setOperator(currentFilter.op);
      setValue(currentFilter.val ?? '');

      if (currentFilter.op === 'between' && Array.isArray(currentFilter.val)) {
        setRangeMin(currentFilter.val[0] ?? '');
        setRangeMax(currentFilter.val[1] ?? '');
      } else if (currentFilter.op === 'in') {
        const arr = Array.isArray(currentFilter.val)
          ? currentFilter.val
          : String(currentFilter.val).split(',');
        setSelectedOptions(arr.map(String));
      }
    } else {
      // Defaults based on data type
      if (column.dataType === 'number' || column.dataType === 'currency') {
        setOperator('gte');
        setValue('');
      } else if (column.dataType === 'select' || column.dataType === 'badge') {
        setOperator('in');
        setSelectedOptions([]);
      } else if (column.dataType === 'boolean') {
        setOperator('eq');
        setValue('');
      } else {
        setOperator('contains');
        setValue('');
      }
      setRangeMin('');
      setRangeMax('');
    }
  }, [currentFilter, isOpen, column.dataType]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    if (operator === 'between') {
      if (rangeMin === '' && rangeMax === '') {
        onApplyFilter(null);
      } else {
        onApplyFilter({ op: 'between', val: [rangeMin || 0, rangeMax || 999999999] });
      }
    } else if (operator === 'in') {
      if (selectedOptions.length === 0) {
        onApplyFilter(null);
      } else {
        onApplyFilter({ op: 'in', val: selectedOptions });
      }
    } else {
      if (value === '' || value === null || value === undefined) {
        onApplyFilter(null);
      } else {
        onApplyFilter({ op: operator, val: value });
      }
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setValue('');
    setRangeMin('');
    setRangeMax('');
    setSelectedOptions([]);
    onApplyFilter(null);
    setIsOpen(false);
  };

  const isFilterActive = !!currentFilter;

  // Toggle option for select/badge
  const toggleOption = (optVal: string) => {
    if (selectedOptions.includes(optVal)) {
      setSelectedOptions(selectedOptions.filter((v) => v !== optVal));
    } else {
      setSelectedOptions([...selectedOptions, optVal]);
    }
  };

  const filteredOptions = (column.options || column.filterOptions?.options || []).filter((opt) =>
    String(opt?.label || '')
      .toLowerCase()
      .includes(String(selectSearch || '').toLowerCase())
  );

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={`Lọc theo ${column.title}`}
        className={`p-1 rounded-lg transition-all cursor-pointer ${
          isFilterActive
            ? 'bg-[#7C6FE8] text-white shadow-xs'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
        }`}
      >
        <Filter className="w-3 h-3" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 mt-2 w-64 p-4 rounded-2xl bg-white border border-purple-100 shadow-xl z-50 animate-fadeIn text-slate-800 flex flex-col gap-3 font-sans normal-case"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>Lọc: {column.title}</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. TEXT FILTER */}
          {(column.dataType === 'text' || !column.dataType) && (
            <div className="flex flex-col gap-2.5">
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as FilterOperator)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold bg-slate-50 focus:border-[#7C6FE8] cursor-pointer"
              >
                <option value="contains">Chứa từ khóa</option>
                <option value="starts_with">Bắt đầu bằng</option>
                <option value="ends_with">Kết thúc bằng</option>
                <option value="eq">Chính xác bằng (=)</option>
                <option value="neq">Khác với (!=)</option>
              </select>

              <input
                type="text"
                autoFocus
                placeholder="Nhập giá trị cần lọc..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#7C6FE8] text-slate-900"
              />
            </div>
          )}

          {/* 2. NUMBER & CURRENCY FILTER */}
          {(column.dataType === 'number' || column.dataType === 'currency') && (
            <div className="flex flex-col gap-2.5">
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as FilterOperator)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold bg-slate-50 focus:border-[#7C6FE8] cursor-pointer"
              >
                <option value="gte">Lớn hơn hoặc bằng (&ge;)</option>
                <option value="lte">Nhỏ hơn hoặc bằng (&le;)</option>
                <option value="eq">Chính xác bằng (=)</option>
                <option value="between">Trong khoảng [Từ - Đến]</option>
              </select>

              {operator === 'between' ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Từ (Min)"
                    value={rangeMin}
                    onChange={(e) => setRangeMin(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold"
                  />
                  <input
                    type="number"
                    placeholder="Đến (Max)"
                    value={rangeMax}
                    onChange={(e) => setRangeMax(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold"
                  />
                </div>
              ) : (
                <input
                  type="number"
                  autoFocus
                  placeholder="Nhập số..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:border-[#7C6FE8]"
                />
              )}
            </div>
          )}

          {/* 3. SELECT & BADGE FILTER (CHECKBOX LIST) */}
          {(column.dataType === 'select' || column.dataType === 'badge') && (
            <div className="flex flex-col gap-2">
              {/* Option Search */}
              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm lựa chọn..."
                  value={selectSearch}
                  onChange={(e) => setSelectSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#7C6FE8]"
                />
              </div>

              {/* Options List */}
              <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pr-1 border border-gray-100 rounded-xl p-1.5 bg-slate-50/50">
                {filteredOptions.length === 0 ? (
                  <span className="text-[11px] text-slate-400 text-center py-2">
                    Không có tùy chọn
                  </span>
                ) : (
                  filteredOptions.map((opt) => {
                    const isChecked = selectedOptions.includes(String(opt.value));

                    return (
                      <label
                        key={String(opt.value)}
                        onClick={() => toggleOption(String(opt.value))}
                        className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-purple-100/80 text-[#7C6FE8] font-bold'
                            : 'hover:bg-slate-100 text-slate-700 font-medium'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#7C6FE8] border-[#7C6FE8] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 4. BOOLEAN FILTER */}
          {column.dataType === 'boolean' && (
            <div className="flex flex-col gap-2">
              <select
                value={String(value)}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-slate-50 focus:border-[#7C6FE8] cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang Hoạt Động (True)</option>
                <option value="false">Đã Khóa / Tắt (False)</option>
              </select>
            </div>
          )}

          {/* 5. DATE FILTER */}
          {column.dataType === 'date' && (
            <div className="flex flex-col gap-2">
              <input
                type="date"
                value={value}
                onChange={(e) => {
                  setOperator('eq');
                  setValue(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8]"
              />
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa lọc</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-3.5 py-1.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-black uppercase tracking-wider shadow-xs cursor-pointer"
            >
              Áp Dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
