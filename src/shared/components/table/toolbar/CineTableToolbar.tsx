'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Columns3,
  Download,
  RotateCcw,
  Check,
  Maximize2,
  Minimize2,
  Layers,
} from 'lucide-react';
import { ColumnDef, TableDensity } from '@/shared/types/dataTable.types';

interface CineTableToolbarProps<T> {
  search: string;
  onSearchChange: (search: string) => void;
  columns: ColumnDef<T>[];
  visibleColumns: Record<string, boolean>;
  onToggleColumnVisibility: (columnKey: string) => void;
  density: TableDensity;
  onDensityChange: (density: TableDensity) => void;
  activeFilterCount: number;
  onClearAllFilters: () => void;
  onExportCsv?: () => void;
  headerActions?: React.ReactNode;
  enableExport?: boolean;
  enableDensityToggle?: boolean;
  enableColumnVisibility?: boolean;
}

export function CineTableToolbar<T>({
  search,
  onSearchChange,
  columns,
  visibleColumns,
  onToggleColumnVisibility,
  density,
  onDensityChange,
  activeFilterCount,
  onClearAllFilters,
  onExportCsv,
  headerActions,
  enableExport = true,
  enableDensityToggle = true,
  enableColumnVisibility = true,
}: CineTableToolbarProps<T>) {
  const [isColMenuOpen, setIsColMenuOpen] = useState(false);
  const [isDensityMenuOpen, setIsDensityMenuOpen] = useState(false);
  const colMenuRef = useRef<HTMLDivElement>(null);
  const densityMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colMenuRef.current && !colMenuRef.current.contains(event.target as Node)) {
        setIsColMenuOpen(false);
      }
      if (densityMenuRef.current && !densityMenuRef.current.contains(event.target as Node)) {
        setIsDensityMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white border border-purple-100 rounded-3xl shadow-xs">
      {/* 1. Global Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm kiếm dữ liệu trong bảng..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* 2. Right Toolbar Options */}
      <div className="flex flex-wrap items-center gap-2 justify-end">
        {/* Reset Filter Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAllFilters}
            className="px-3 py-2 rounded-xl bg-purple-50 text-[#7C6FE8] hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa {activeFilterCount} bộ lọc</span>
          </button>
        )}

        {/* Column Visibility Menu */}
        {enableColumnVisibility && (
          <div className="relative inline-block" ref={colMenuRef}>
            <button
              type="button"
              onClick={() => setIsColMenuOpen(!isColMenuOpen)}
              title="Ẩn / Hiện Cột"
              className="p-2 rounded-xl border border-gray-200 hover:border-purple-200 text-slate-600 hover:text-[#7C6FE8] hover:bg-slate-50 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Columns3 className="w-4 h-4" />
              <span className="hidden md:inline">Cột</span>
            </button>

            {isColMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 p-3 rounded-2xl bg-white border border-purple-100 shadow-xl z-50 animate-fadeIn flex flex-col gap-2">
                <span className="text-[11px] font-black text-slate-800 uppercase border-b border-gray-100 pb-1.5">
                  Tùy Biến Cột Hiển Thị
                </span>
                <div className="max-h-56 overflow-y-auto flex flex-col gap-1 pr-1">
                  {columns.map((c) => {
                    const isVisible = visibleColumns[c.key] !== false;

                    return (
                      <label
                        key={c.key}
                        onClick={() => onToggleColumnVisibility(c.key)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer select-none transition-colors ${
                          isVisible
                            ? 'bg-purple-50 text-[#7C6FE8] font-bold'
                            : 'hover:bg-slate-50 text-slate-600 font-medium'
                        }`}
                      >
                        <span className="truncate">{c.title}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isVisible
                              ? 'bg-[#7C6FE8] border-[#7C6FE8] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isVisible && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Density Selector */}
        {enableDensityToggle && (
          <div className="relative inline-block" ref={densityMenuRef}>
            <button
              type="button"
              onClick={() => setIsDensityMenuOpen(!isDensityMenuOpen)}
              title="Mật độ hiển thị dòng"
              className="p-2 rounded-xl border border-gray-200 hover:border-purple-200 text-slate-600 hover:text-[#7C6FE8] hover:bg-slate-50 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">Mật Độ</span>
            </button>

            {isDensityMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 p-2 rounded-2xl bg-white border border-purple-100 shadow-xl z-50 animate-fadeIn flex flex-col gap-1">
                {(['compact', 'normal', 'spacious'] as TableDensity[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      onDensityChange(d);
                      setIsDensityMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold capitalize cursor-pointer transition-colors ${
                      density === d
                        ? 'bg-purple-50 text-[#7C6FE8]'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{d === 'compact' ? 'Gọn gàng' : d === 'normal' ? 'Tiêu chuẩn' : 'Rộng rãi'}</span>
                    {density === d && <Check className="w-3.5 h-3.5 text-[#7C6FE8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Export CSV Button */}
        {enableExport && onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            title="Xuất dữ liệu ra file CSV"
            className="p-2 rounded-xl border border-gray-200 hover:border-purple-200 text-slate-600 hover:text-[#7C6FE8] hover:bg-slate-50 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Xuất CSV</span>
          </button>
        )}

        {/* Extra Header Actions Slot (e.g. + Tạo mới) */}
        {headerActions}
      </div>
    </div>
  );
}
