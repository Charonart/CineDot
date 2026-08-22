'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DataTablePaginationState } from '@/shared/types/dataTable.types';

interface CineTablePaginationProps {
  pagination: DataTablePaginationState;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  currentCount: number;
}

export function CineTablePagination({
  pagination,
  onPageChange,
  onPerPageChange,
  currentCount,
}: CineTablePaginationProps) {
  const { page, perPage, total, lastPage = Math.max(1, Math.ceil(total / perPage)) } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-slate-50/50 text-xs text-slate-600">
      {/* Items Summary & Per-page selector */}
      <div className="flex items-center gap-3">
        <span>
          Hiển thị <b>{currentCount}</b> / <b>{total}</b> mục (Trang <b>{page}</b> / <b>{lastPage}</b>)
        </span>

        <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200">
          <span className="text-slate-400 font-bold">Số hàng:</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-gray-200 bg-white font-bold text-slate-800 text-xs focus:border-[#7C6FE8] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          title="Trang đầu"
          className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          title="Trang trước"
          className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="px-3 py-1 font-mono font-bold text-slate-800 text-xs">
          {page} / {lastPage}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= lastPage}
          title="Trang tiếp"
          className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(lastPage)}
          disabled={page >= lastPage}
          title="Trang cuối"
          className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
