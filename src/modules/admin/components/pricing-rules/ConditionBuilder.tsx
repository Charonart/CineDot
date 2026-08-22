'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Armchair,
  CalendarRange,
  Users,
  Ticket,
  Heart,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import {
  PricingRuleConditions,
  ConditionBlockType,
} from '../../types/adminPricingRule.types';
import {
  DAY_OPTIONS,
  SEAT_TYPE_OPTIONS,
} from '../../utils/pricingRuleHelper';

interface ConditionBuilderProps {
  conditions: PricingRuleConditions;
  onChange: (newConditions: PricingRuleConditions) => void;
}

interface BlockOption {
  type: ConditionBlockType;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const AVAILABLE_BLOCKS: BlockOption[] = [
  {
    type: 'days',
    label: 'Thứ trong tuần',
    desc: 'Lọc theo ngày cụ thể (T2-CN, Cuối tuần, Ngày thường)',
    icon: Calendar,
  },
  {
    type: 'time_range',
    label: 'Khung giờ chiếu',
    desc: 'Suất chiếu theo giờ (Giờ vàng, sáng sớm, suất khuya)',
    icon: Clock,
  },
  {
    type: 'seat_types',
    label: 'Loại ghế áp dụng',
    desc: 'Áp dụng riêng cho ghế VIP, Sweetbox, Giường nằm...',
    icon: Armchair,
  },
  {
    type: 'date_range',
    label: 'Khoảng ngày / Lễ Tết',
    desc: 'Áp dụng cho kỳ nghỉ lễ, chiến dịch định kỳ',
    icon: CalendarRange,
  },
  {
    type: 'min_seats',
    label: 'Số lượng vé tối thiểu',
    desc: 'Ưu đãi mua nhóm / combo vé (từ 2 hoặc 4 vé)',
    icon: Ticket,
  },
  {
    type: 'age_range',
    label: 'Độ tuổi / Đối tượng',
    desc: 'Học sinh - Sinh viên (≤22t), Người cao tuổi (≥60t)',
    icon: Users,
  },
  {
    type: 'genders',
    label: 'Giới tính',
    desc: 'Ưu đãi ngày 8/3, 20/10 (Khách hàng nữ)',
    icon: Heart,
  },
];

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  conditions,
  onChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check which blocks are currently active
  const hasDays = Boolean(conditions.days && conditions.days.length > 0);
  const hasTime = Boolean(
    conditions.time_from ||
      conditions.time_to ||
      conditions.time_range?.from ||
      conditions.time_range?.to
  );
  const hasSeatTypes = Boolean(
    conditions.seat_types && conditions.seat_types.length > 0
  );
  const hasDateRange = Boolean(
    conditions.date_range?.from || conditions.date_range?.to || conditions.dates
  );
  const hasMinSeats = Boolean(
    conditions.min_seats !== undefined && conditions.min_seats !== null
  );
  const hasAgeRange = Boolean(
    conditions.min_age !== undefined || conditions.max_age !== undefined
  );
  const hasGenders = Boolean(
    conditions.genders && conditions.genders.length > 0
  );

  const activeTypes = new Set<ConditionBlockType>();
  if (hasDays) activeTypes.add('days');
  if (hasTime) activeTypes.add('time_range');
  if (hasSeatTypes) activeTypes.add('seat_types');
  if (hasDateRange) activeTypes.add('date_range');
  if (hasMinSeats) activeTypes.add('min_seats');
  if (hasAgeRange) activeTypes.add('age_range');
  if (hasGenders) activeTypes.add('genders');

  const addBlock = (type: ConditionBlockType) => {
    const next = { ...conditions };
    if (type === 'days') {
      next.days = ['Saturday', 'Sunday'];
    } else if (type === 'time_range') {
      next.time_from = '18:00';
      next.time_to = '23:00';
    } else if (type === 'seat_types') {
      next.seat_types = ['vip'];
    } else if (type === 'date_range') {
      const today = new Date().toISOString().split('T')[0];
      next.date_range = { from: today, to: today };
    } else if (type === 'min_seats') {
      next.min_seats = 2;
    } else if (type === 'age_range') {
      next.max_age = 22; // HSSV default
    } else if (type === 'genders') {
      next.genders = ['female'];
    }
    onChange(next);
    setIsDropdownOpen(false);
  };

  const removeBlock = (type: ConditionBlockType) => {
    const next = { ...conditions };
    if (type === 'days') {
      delete next.days;
    } else if (type === 'time_range') {
      delete next.time_from;
      delete next.time_to;
      delete next.time_range;
    } else if (type === 'seat_types') {
      delete next.seat_types;
    } else if (type === 'date_range') {
      delete next.date_range;
      delete next.dates;
    } else if (type === 'min_seats') {
      delete next.min_seats;
    } else if (type === 'age_range') {
      delete next.min_age;
      delete next.max_age;
    } else if (type === 'genders') {
      delete next.genders;
    }
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Danh sách điều kiện kích hoạt</span>
          </label>
          <span className="text-[11px] text-slate-500">
            Quy tắc sẽ áp dụng khi tất cả các điều kiện bên dưới đồng thời thỏa mãn (AND).
          </span>
        </div>

        {/* Add Condition Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] text-xs font-bold flex items-center gap-1.5 border border-purple-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm điều kiện</span>
            <ChevronDown className="w-3 h-3 text-purple-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                Chọn loại điều kiện
              </span>
              {AVAILABLE_BLOCKS.map((block) => {
                const isAdded = activeTypes.has(block.type);
                const Icon = block.icon;
                return (
                  <button
                    key={block.type}
                    type="button"
                    disabled={isAdded}
                    onClick={() => addBlock(block.type)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors ${
                      isAdded
                        ? 'opacity-40 cursor-not-allowed bg-slate-50'
                        : 'hover:bg-purple-50 text-slate-800 cursor-pointer'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-[#7C6FE8] shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">
                        {block.label} {isAdded && '(Đã thêm)'}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight">
                        {block.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {activeTypes.size === 0 && (
        <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-xs text-slate-500 font-medium">
            Chưa có điều kiện nào. Quy tắc này sẽ áp dụng cho <strong>tất cả suất chiếu</strong>.
          </p>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(true)}
            className="text-xs font-bold text-[#7C6FE8] hover:underline cursor-pointer"
          >
            + Nhấp để thêm điều kiện lọc
          </button>
        </div>
      )}

      {/* Condition Cards Container */}
      <div className="flex flex-col gap-3">
        {/* 1. DAYS OF WEEK */}
        {hasDays && (
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Calendar className="w-4 h-4 text-[#7C6FE8]" />
                <span>Thứ trong tuần áp dụng</span>
              </div>
              <button
                type="button"
                onClick={() => removeBlock('days')}
                className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Xóa điều kiện này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...conditions,
                    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                Ngày thường (T2-T6)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...conditions,
                    days: ['Saturday', 'Sunday'],
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                Cuối tuần (T7-CN)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...conditions,
                    days: DAY_OPTIONS.map((d) => d.id),
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                Cả tuần (Tất cả)
              </button>
            </div>

            {/* Individual Chips */}
            <div className="grid grid-cols-7 gap-1.5">
              {DAY_OPTIONS.map((day) => {
                const currentDays = conditions.days || [];
                const isSelected = currentDays.some(
                  (d) => d.toLowerCase() === day.id.toLowerCase()
                );
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => {
                      let nextDays: string[];
                      if (isSelected) {
                        nextDays = currentDays.filter(
                          (d) => d.toLowerCase() !== day.id.toLowerCase()
                        );
                      } else {
                        nextDays = [...currentDays, day.id];
                      }
                      onChange({ ...conditions, days: nextDays });
                    }}
                    className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-gray-100'
                    }`}
                  >
                    <span className="text-[10px] opacity-80">{day.short}</span>
                    <span className="text-[11px] font-black">{day.id.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. TIME RANGE */}
        {hasTime && (
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Clock className="w-4 h-4 text-[#7C6FE8]" />
                <span>Khung giờ chiếu</span>
              </div>
              <button
                type="button"
                onClick={() => removeBlock('time_range')}
                className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Xóa điều kiện này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...conditions,
                    time_from: '08:00',
                    time_to: '12:00',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                Suất sớm (08:00 - 12:00)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...conditions,
                    time_from: '18:00',
                    time_to: '23:00',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                Giờ vàng (18:00 - 23:00)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...conditions,
                    time_from: '22:00',
                    time_to: '23:59',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                Suất khuya (sau 22:00)
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600">Từ giờ (Bắt đầu)</label>
                <input
                  type="time"
                  value={conditions.time_from || conditions.time_range?.from || '00:00'}
                  onChange={(e) =>
                    onChange({
                      ...conditions,
                      time_from: e.target.value,
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600">Đến giờ (Kết thúc)</label>
                <input
                  type="time"
                  value={conditions.time_to || conditions.time_range?.to || '23:59'}
                  onChange={(e) =>
                    onChange({
                      ...conditions,
                      time_to: e.target.value,
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. SEAT TYPES */}
        {hasSeatTypes && (
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Armchair className="w-4 h-4 text-[#7C6FE8]" />
                <span>Loại ghế áp dụng</span>
              </div>
              <button
                type="button"
                onClick={() => removeBlock('seat_types')}
                className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Xóa điều kiện này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {SEAT_TYPE_OPTIONS.map((st) => {
                const currentTypes = conditions.seat_types || [];
                const isSelected = currentTypes.some(
                  (t) => t.toLowerCase() === st.id.toLowerCase()
                );
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      let nextTypes: string[];
                      if (isSelected) {
                        nextTypes = currentTypes.filter(
                          (t) => t.toLowerCase() !== st.id.toLowerCase()
                        );
                      } else {
                        nextTypes = [...currentTypes, st.id];
                      }
                      onChange({ ...conditions, seat_types: nextTypes });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#7C6FE8] text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-gray-200'
                    }`}
                  >
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. DATE RANGE */}
        {hasDateRange && (
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <CalendarRange className="w-4 h-4 text-[#7C6FE8]" />
                <span>Khoảng ngày áp dụng (Lễ / Tết / Chiến dịch)</span>
              </div>
              <button
                type="button"
                onClick={() => removeBlock('date_range')}
                className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Xóa điều kiện này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600">Từ ngày</label>
                <input
                  type="date"
                  value={conditions.date_range?.from || ''}
                  onChange={(e) =>
                    onChange({
                      ...conditions,
                      date_range: {
                        from: e.target.value,
                        to: conditions.date_range?.to || e.target.value,
                      },
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600">Đến ngày</label>
                <input
                  type="date"
                  value={conditions.date_range?.to || ''}
                  onChange={(e) =>
                    onChange({
                      ...conditions,
                      date_range: {
                        from: conditions.date_range?.from || e.target.value,
                        to: e.target.value,
                      },
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. MIN SEATS */}
        {hasMinSeats && (
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                <span>Số lượng vé tối thiểu trong đơn</span>
              </div>
              <button
                type="button"
                onClick={() => removeBlock('min_seats')}
                className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Xóa điều kiện này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={20}
                value={conditions.min_seats || 2}
                onChange={(e) =>
                  onChange({
                    ...conditions,
                    min_seats: Number(e.target.value) || 1,
                  })
                }
                className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
              />
              <span className="text-xs text-slate-500">
                vé (Áp dụng khi khách chọn từ số lượng vé này trở lên)
              </span>
            </div>
          </div>
        )}

        {/* 6. AGE RANGE */}
        {hasAgeRange && (
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Users className="w-4 h-4 text-[#7C6FE8]" />
                <span>Độ tuổi / Đối tượng khách hàng</span>
              </div>
              <button
                type="button"
                onClick={() => removeBlock('age_range')}
                className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Xóa điều kiện này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const next = { ...conditions };
                  delete next.min_age;
                  next.max_age = 22;
                  onChange(next);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                Học sinh / Sinh viên (≤ 22 tuổi)
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = { ...conditions };
                  delete next.max_age;
                  next.min_age = 60;
                  onChange(next);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                Người cao tuổi (≥ 60 tuổi)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600">Tuổi tối thiểu</label>
                <input
                  type="number"
                  placeholder="Không giới hạn"
                  value={conditions.min_age !== undefined ? conditions.min_age : ''}
                  onChange={(e) =>
                    onChange({
                      ...conditions,
                      min_age: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600">Tuổi tối đa</label>
                <input
                  type="number"
                  placeholder="Không giới hạn"
                  value={conditions.max_age !== undefined ? conditions.max_age : ''}
                  onChange={(e) =>
                    onChange({
                      ...conditions,
                      max_age: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. GENDERS */}
        {hasGenders && (
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>Giới tính áp dụng</span>
              </div>
              <button
                type="button"
                onClick={() => removeBlock('genders')}
                className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Xóa điều kiện này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex gap-2">
              {['female', 'male'].map((g) => {
                const isSel = (conditions.genders || []).includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onChange({ ...conditions, genders: [g] })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-gray-200'
                    }`}
                  >
                    {g === 'female' ? 'Nữ (Ưu đãi 8/3, 20/10)' : 'Nam'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
