'use client';

import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { ColumnDef, ColumnFilterRule } from '@/shared/types/dataTable.types';
import { CineColumnFilterPopover } from './CineColumnFilterPopover';

interface CineColumnHeaderCellProps<T> {
  column: ColumnDef<T>;
  sortConfig?: { column: string; direction: 'asc' | 'desc' } | null;
  onSortChange?: (columnKey: string) => void;
  filterRule?: ColumnFilterRule;
  onFilterChange: (columnKey: string, rule: ColumnFilterRule | null) => void;
}

export function CineColumnHeaderCell<T>({
  column,
  sortConfig,
  onSortChange,
  filterRule,
  onFilterChange,
}: CineColumnHeaderCellProps<T>) {
  const isSorted = sortConfig?.column === column.key;
  const sortDirection = isSorted ? sortConfig.direction : null;

  const handleHeaderClick = () => {
    if (column.sortable && onSortChange) {
      onSortChange(column.key);
    }
  };

  const alignClass =
    column.align === 'center'
      ? 'justify-center text-center'
      : column.align === 'right'
        ? 'justify-end text-right'
        : 'justify-start text-left';

  return (
    <th
      style={{
        width: column.width,
        minWidth: column.minWidth || 80,
      }}
      onClick={handleHeaderClick}
      className={`py-3.5 px-4 select-none relative group transition-colors ${
        column.sortable ? 'cursor-pointer hover:bg-purple-100/60' : ''
      } ${
        column.sticky === 'left'
          ? 'sticky left-0 z-20 bg-purple-50/95 backdrop-blur-xs'
          : column.sticky === 'right'
            ? 'sticky right-0 z-20 bg-purple-50/95 backdrop-blur-xs'
            : 'bg-purple-50/50'
      }`}
    >
      <div className={`flex items-center gap-1.5 ${alignClass}`}>
        {/* Title & Sort Trigger */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider truncate">
            {column.title}
          </span>

          {column.sortable && (
            <span className="shrink-0 text-slate-400 group-hover:text-[#7C6FE8] transition-colors">
              {sortDirection === 'asc' ? (
                <ArrowUp className="w-3.5 h-3.5 text-[#7C6FE8] stroke-[2.5]" />
              ) : sortDirection === 'desc' ? (
                <ArrowDown className="w-3.5 h-3.5 text-[#7C6FE8] stroke-[2.5]" />
              ) : (
                <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
              )}
            </span>
          )}
        </div>

        {/* Filter Popover Trigger */}
        {column.filterable !== false && (
          <div onClick={(e) => e.stopPropagation()}>
            <CineColumnFilterPopover
              column={column}
              currentFilter={filterRule}
              onApplyFilter={(rule) => onFilterChange(column.key, rule)}
            />
          </div>
        )}
      </div>
    </th>
  );
}
