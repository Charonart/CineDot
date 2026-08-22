'use client';

import React from 'react';
import { X, CheckSquare, Sparkles, Trash2 } from 'lucide-react';
import { BulkAction } from '@/shared/types/dataTable.types';

interface CineBulkActionBarProps<T> {
  selectedCount: number;
  selectedRows: T[];
  selectedIds: (string | number)[];
  onClearSelection: () => void;
  bulkActions?: BulkAction<T>[];
}

export function CineBulkActionBar<T>({
  selectedCount,
  selectedRows,
  selectedIds,
  onClearSelection,
  bulkActions = [],
}: CineBulkActionBarProps<T>) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md text-white border border-purple-400/30 px-5 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
      {/* Selected Counter */}
      <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
        <CheckSquare className="w-4 h-4 text-[#7C6FE8]" />
        <span className="text-xs font-black tracking-wide">
          Đã chọn <b className="text-[#7C6FE8]">{selectedCount}</b> mục
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {bulkActions.map((action) => (
          <button
            key={action.key}
            onClick={() => action.onClick(selectedRows, selectedIds)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              action.variant === 'danger'
                ? 'bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40'
                : action.variant === 'amber'
                  ? 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/40'
                  : 'bg-purple-500/20 hover:bg-[#7C6FE8] text-purple-200 hover:text-white border border-purple-400/40'
            }`}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Deselect All */}
      <button
        onClick={onClearSelection}
        title="Bỏ chọn tất cả"
        className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
