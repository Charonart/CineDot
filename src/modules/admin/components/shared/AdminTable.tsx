"use client";

import React, { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ArrowUpDown, ArrowUp, ArrowDown, Settings, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface ColumnDef<T> {
  id: string;
  header: string | React.ReactNode;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface AdminTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  
  // Sorting state
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;

  // Pagination state
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    rowsPerPage?: number;
    onRowsPerPageChange?: (rows: number) => void;
  };

  // Custom filter layout or other controls to show next to settings
  filterActions?: React.ReactNode;
}

export function AdminTable<T>({
  data,
  columns,
  isLoading = false,
  sortConfig,
  onSort,
  pagination,
  filterActions,
}: AdminTableProps<T>) {
  // Column Visibility State
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(
    columns.map((c) => c.id)
  );

  const toggleColumn = (id: string) => {
    setVisibleColumnIds((prev) =>
      prev.includes(id)
        ? prev.filter((colId) => colId !== id) // Allow hiding
        : [...prev, id]
    );
  };

  const visibleColumns = columns.filter((c) => visibleColumnIds.includes(c.id));

  return (
    <div className="w-full bg-white border border-[#E9E9F8] rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Top Toolbar (Filters & Column Settings) */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#E9E9F8] shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {filterActions}
        </div>
        
        <div className="flex items-center gap-2 ml-4 shrink-0">
          {/* Column Visibility Selector Dropdown (Headless UI Popover) */}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-[#E9E9F8] bg-white text-[#1C1D22] hover:bg-gray-50 rounded-xl transition-all shadow-sm outline-none">
              <Settings className="w-3.5 h-3.5" />
              <span>Hiển thị cột</span>
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5 p-1.5 z-40 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none"
            >
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">
                Chọn cột hiển thị
              </div>
              <div className="space-y-0.5 mt-1">
                {columns.map((col) => {
                  const isVisible = visibleColumnIds.includes(col.id);
                  return (
                    <button
                      key={col.id}
                      onClick={() => toggleColumn(col.id)}
                      disabled={isVisible && visibleColumnIds.length === 1} // Prevent hiding all columns
                      className={cn(
                        "flex items-center justify-between w-full rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors",
                        "hover:bg-gray-50 text-[#1C1D22]",
                        isVisible && "text-[#4F46E5]"
                      )}
                    >
                      <span>{typeof col.header === 'string' ? col.header : col.id}</span>
                      {isVisible && <Check className="w-4 h-4 text-[#4F46E5]" />}
                    </button>
                  );
                })}
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1 min-h-[300px] relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9F8] bg-gray-50/50">
              {visibleColumns.map((col) => {
                const isSorted = sortConfig?.key === col.id;
                const isSortable = col.sortable && onSort;
                
                return (
                  <th
                    key={col.id}
                    onClick={() => isSortable && onSort(col.id)}
                    className={cn(
                      "px-6 py-3.5 text-xs font-bold text-[#8B949E] uppercase tracking-wider select-none",
                      isSortable && "cursor-pointer hover:text-[#1C1D22] transition-colors"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {isSortable && (
                        <span>
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[#4F46E5]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-[#4F46E5]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E9F8]">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, rIndex) => (
                <tr key={rIndex} className="animate-pulse">
                  {visibleColumns.map((col) => (
                    <td key={col.id} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-6 py-16 text-center text-sm text-[#8B949E] font-medium"
                >
                  Không có dữ liệu hiển thị.
                </td>
              </tr>
            ) : (
              // Active Data Rows
              data.map((item, rIndex) => (
                <tr key={rIndex} className="hover:bg-gray-50/50 transition-colors">
                  {visibleColumns.map((col) => (
                    <td key={col.id} className="px-6 py-4 text-sm text-[#1C1D22] font-medium">
                      {col.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-6 py-4 border-t border-[#E9E9F8] flex items-center justify-between shrink-0 bg-gray-50/50">
          <div className="text-xs text-[#8B949E] font-semibold">
            Hiển thị <span className="text-[#1C1D22]">{(pagination.currentPage - 1) * (pagination.rowsPerPage || 10) + 1}</span> đến{" "}
            <span className="text-[#1C1D22]">
              {Math.min(
                pagination.currentPage * (pagination.rowsPerPage || 10),
                pagination.totalItems
              )}
            </span>{" "}
            trong tổng số <span className="text-[#1C1D22]">{pagination.totalItems}</span> mục
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || isLoading}
              className="p-1.5 border border-[#E9E9F8] bg-white rounded-xl text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm outline-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pagination.currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => pagination.onPageChange(pageNum)}
                  disabled={isLoading}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xl transition-all border outline-none",
                    isActive
                      ? "bg-[#F4F4FF] border-[#E9E9F8] text-[#4F46E5]"
                      : "bg-white border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || isLoading}
              className="p-1.5 border border-[#E9E9F8] bg-white rounded-xl text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm outline-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
