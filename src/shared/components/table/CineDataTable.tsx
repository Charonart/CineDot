'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  CheckSquare,
  Square,
  MinusSquare,
  Loader2,
  Inbox,
} from 'lucide-react';
import {
  CineDataTableProps,
  ColumnFilterRule,
  TableDensity,
  CineColumnDef,
  DataTablePaginationState,
} from '@/shared/types/dataTable.types';
import { CineColumnHeaderCell } from './header/CineColumnHeaderCell';
import { CineEditableCell } from './cells/CineEditableCell';
import { CineTableToolbar } from './toolbar/CineTableToolbar';
import { CineBulkActionBar } from './bulk/CineBulkActionBar';
import { CineTablePagination } from './pagination/CineTablePagination';

export function CineDataTable<T extends Record<string, any>>({
  table,
  data: manualData,
  columns: manualColumns,
  rowKey = 'id',
  isLoading: manualIsLoading = false,
  title,
  subtitle,
  icon,
  headerActions,
  bulkActions = [],
  serverSide = true,
  pagination: manualPagination,
  onPaginationChange,
  onFilterChange,
  onSortChange,
  onCellEdit,
  onRowClick,
  enableExport = true,
  exportFileName = 'cinedot_export',
  enableDensityToggle = true,
  enableColumnVisibility = true,
  enableSelection = true,
  emptyState,
  stickyHeader = true,
  className = '',
}: CineDataTableProps<T>) {
  // ── 1. Resolve Data & Columns source ──
  const columns: CineColumnDef<T>[] = table ? table.columns : (manualColumns || []);
  const data: T[] = table ? table.data : (manualData || []);
  const isLoading: boolean = table ? table.isLoading : manualIsLoading;
  const pagination: DataTablePaginationState | undefined = table ? table.pagination : manualPagination;

  // ── 2. Fallback Internal States (used when table prop is not provided) ──
  const [internalSearch, setInternalSearch] = useState('');
  const [debouncedInternalSearch, setDebouncedInternalSearch] = useState('');
  const [internalFilters, setInternalFilters] = useState<Record<string, ColumnFilterRule>>({});
  const [internalSortConfig, setInternalSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(null);
  const [internalSelectedIds, setInternalSelectedIds] = useState<(string | number)[]>([]);
  const [internalDensity, setInternalDensity] = useState<TableDensity>('normal');
  const [internalVisibleColumns, setInternalVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach((c) => {
      initial[c.key] = c.hidden !== true;
    });
    return initial;
  });

  // Debounce internal search input
  useEffect(() => {
    if (table) return;
    const timer = setTimeout(() => {
      setDebouncedInternalSearch(internalSearch);
    }, 350);
    return () => clearTimeout(timer);
  }, [internalSearch, table]);

  // Notify server on internal search / filter change
  useEffect(() => {
    if (!table && serverSide && onFilterChange) {
      onFilterChange(internalFilters, debouncedInternalSearch);
    }
  }, [internalFilters, debouncedInternalSearch, serverSide, onFilterChange, table]);

  // Helper to extract row ID
  const getRowId = useCallback(
    (row: T): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(row);
      }
      return row[rowKey] ?? row.id ?? row.user_id ?? JSON.stringify(row);
    },
    [rowKey]
  );

  // ── 3. Active States Resolution (Table hook vs Internal) ──
  const search = table ? table.search : internalSearch;
  const setSearch = table ? table.setSearch : setInternalSearch;

  const filters = table ? table.filters : internalFilters;
  const sortConfig = table ? table.sortConfig : internalSortConfig;

  const density = table ? table.density : internalDensity;
  const setDensity = table ? table.setDensity : setInternalDensity;

  const visibleColumns = table ? table.visibleColumns : internalVisibleColumns;
  const toggleColumnVisibility = table
    ? table.toggleColumnVisibility
    : (key: string) => {
        setInternalVisibleColumns((prev) => ({
          ...prev,
          [key]: prev[key] === false,
        }));
      };

  const activeColumns = useMemo(() => {
    return columns.filter((c) => visibleColumns[c.key] !== false);
  }, [columns, visibleColumns]);

  // ── 4. Client-side Processing (if not serverSide and not hook) ──
  const processedData = useMemo(() => {
    if (table || serverSide) return data;

    let result = [...data];

    // Search
    if (debouncedInternalSearch.trim()) {
      const q = debouncedInternalSearch.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(q))
      );
    }

    // Filters
    Object.entries(internalFilters).forEach(([colKey, rule]) => {
      if (!rule) return;
      result = result.filter((row) => {
        const val = row[colKey];
        if (rule.op === 'contains') {
          return String(val ?? '').toLowerCase().includes(String(rule.val).toLowerCase());
        }
        if (rule.op === 'starts_with') {
          return String(val ?? '').toLowerCase().startsWith(String(rule.val).toLowerCase());
        }
        if (rule.op === 'ends_with') {
          return String(val ?? '').toLowerCase().endsWith(String(rule.val).toLowerCase());
        }
        if (rule.op === 'eq') {
          return String(val) === String(rule.val);
        }
        if (rule.op === 'neq') {
          return String(val) !== String(rule.val);
        }
        if (rule.op === 'gte') {
          return Number(val) >= Number(rule.val);
        }
        if (rule.op === 'lte') {
          return Number(val) <= Number(rule.val);
        }
        if (rule.op === 'between' && Array.isArray(rule.val)) {
          return Number(val) >= Number(rule.val[0]) && Number(val) <= Number(rule.val[1]);
        }
        if (rule.op === 'in' && Array.isArray(rule.val)) {
          return rule.val.includes(String(val));
        }
        return true;
      });
    });

    // Sorting
    if (internalSortConfig) {
      result.sort((a, b) => {
        const aVal = a[internalSortConfig.column];
        const bVal = b[internalSortConfig.column];
        if (aVal < bVal) return internalSortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return internalSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, table, serverSide, debouncedInternalSearch, internalFilters, internalSortConfig]);

  // ── 5. Sorting & Filtering Handlers ──
  const handleSortChange = (columnKey: string) => {
    if (table) {
      table.toggleSort(columnKey);
    } else {
      let nextSort: { column: string; direction: 'asc' | 'desc' } | null = null;
      if (!internalSortConfig || internalSortConfig.column !== columnKey) {
        nextSort = { column: columnKey, direction: 'asc' };
      } else if (internalSortConfig.direction === 'asc') {
        nextSort = { column: columnKey, direction: 'desc' };
      }
      setInternalSortConfig(nextSort);
      if (onSortChange) onSortChange(nextSort);
    }
  };

  const handleColumnFilterChange = (columnKey: string, rule: ColumnFilterRule | null) => {
    if (table) {
      table.setFilter(columnKey, rule);
    } else {
      setInternalFilters((prev) => {
        const next = { ...prev };
        if (!rule) delete next[columnKey];
        else next[columnKey] = rule;
        return next;
      });
    }
  };

  const handleClearAllFilters = () => {
    if (table) {
      table.clearFilters();
    } else {
      setInternalFilters({});
      setInternalSearch('');
    }
  };

  const activeFilterCount = Object.keys(filters).length + (search ? 1 : 0);

  // ── 6. Selection Resolution ──
  const selectedIds = table ? table.selectedIds : internalSelectedIds;
  const isAllSelected = table
    ? table.isAllSelected
    : processedData.length > 0 && processedData.every((r) => internalSelectedIds.includes(getRowId(r)));
  const isPartialSelected = selectedIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (table) {
      table.toggleSelectAll();
    } else {
      if (isAllSelected) {
        setInternalSelectedIds([]);
      } else {
        setInternalSelectedIds(processedData.map(getRowId));
      }
    }
  };

  const handleToggleRow = (id: string | number) => {
    if (table) {
      table.toggleSelectRow(id);
    } else {
      setInternalSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
  };

  const selectedRows = useMemo(() => {
    return processedData.filter((row) => selectedIds.includes(getRowId(row)));
  }, [processedData, selectedIds, getRowId]);

  // ── 7. Density CSS ──
  const densityCellPadding =
    density === 'compact'
      ? 'py-2 px-3 text-[11px]'
      : density === 'spacious'
        ? 'py-4.5 px-5 text-sm'
        : 'py-3.5 px-4 text-xs';

  // ── 8. Export CSV ──
  const handleExportCsv = () => {
    if (table) {
      table.exportToCsv();
    } else {
      const activeCols = activeColumns.filter((c) => c.dataType !== 'actions');
      const headers = activeCols.map((c) => `"${c.title.replace(/"/g, '""')}"`).join(',');
      const rows = processedData.map((row) => {
        return activeCols
          .map((c) => {
            let val = row[c.key];
            if (c.exportFormatter) {
              val = c.exportFormatter(val, row);
            } else if (c.format) {
              val = c.format(val, row);
            }
            const cleanVal = String(val ?? '').replace(/"/g, '""');
            return `"${cleanVal}"`;
          })
          .join(',');
      });

      const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${exportFileName}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCellSave = table ? table.handleCellEdit : onCellEdit;

  return (
    <div className={`flex flex-col gap-4 w-full select-text ${className}`}>
      {/* 1. Header Banner */}
      {(title || subtitle || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {icon}
                <span>{title}</span>
              </h2>
            )}
            {subtitle && <p className="text-xs sm:text-sm text-slate-500 font-medium">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2 shrink-0">{headerActions}</div>}
        </div>
      )}

      {/* 2. Toolbar */}
      <CineTableToolbar
        search={search}
        onSearchChange={setSearch}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumnVisibility={toggleColumnVisibility}
        density={density}
        onDensityChange={setDensity}
        activeFilterCount={activeFilterCount}
        onClearAllFilters={handleClearAllFilters}
        onExportCsv={handleExportCsv}
        enableExport={enableExport}
        enableDensityToggle={enableDensityToggle}
        enableColumnVisibility={enableColumnVisibility}
      />

      {/* 3. Main Table */}
      <div className="rounded-3xl bg-white border border-purple-100 shadow-xs overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Header */}
            <thead className={stickyHeader ? 'sticky top-0 z-20 shadow-xs' : ''}>
              <tr className="border-b border-gray-100 bg-purple-50/60 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                {/* Row Selector Checkbox */}
                {enableSelection && (
                  <th className="py-3.5 px-4 w-10 text-center sticky left-0 z-30 bg-purple-50/95">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="text-slate-400 hover:text-[#7C6FE8] cursor-pointer"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#7C6FE8] fill-purple-100" />
                      ) : isPartialSelected ? (
                        <MinusSquare className="w-4 h-4 text-[#7C6FE8]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </th>
                )}

                {/* Column Headers */}
                {activeColumns.map((col) => (
                  <CineColumnHeaderCell
                    key={col.key}
                    column={col}
                    sortConfig={sortConfig}
                    onSortChange={handleSortChange}
                    filterRule={filters[col.key]}
                    onFilterChange={handleColumnFilterChange}
                  />
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100 text-slate-700 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={activeColumns.length + (enableSelection ? 1 : 0)} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <Loader2 className="w-8 h-8 text-[#7C6FE8] animate-spin" />
                      <span className="text-xs font-bold">Đang nạp dữ liệu bảng...</span>
                    </div>
                  </td>
                </tr>
              ) : processedData.length === 0 ? (
                <tr>
                  <td colSpan={activeColumns.length + (enableSelection ? 1 : 0)} className="py-20 text-center">
                    {emptyState || (
                      <div className="flex flex-col items-center justify-center gap-2 p-6 text-slate-400">
                        <Inbox className="w-10 h-10 stroke-[1.5]" />
                        <h4 className="text-sm font-black text-slate-700">Không có dữ liệu phù hợp</h4>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Thử thay đổi từ khóa tìm kiếm hoặc xóa các bộ lọc đang áp dụng.
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                processedData.map((row, idx) => {
                  const id = getRowId(row);
                  const isSelected = selectedIds.includes(id);

                  return (
                    <tr
                      key={id}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-purple-50/50 hover:bg-purple-50/80'
                          : idx % 2 === 0
                            ? 'bg-white hover:bg-slate-50/70'
                            : 'bg-slate-50/30 hover:bg-slate-50/70'
                      } ${onRowClick ? 'cursor-pointer' : ''}`}
                    >
                      {/* Checkbox */}
                      {enableSelection && (
                        <td
                          className="py-3 px-4 w-10 text-center sticky left-0 z-10 bg-inherit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleRow(id)}
                            className="cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#7C6FE8] fill-purple-100" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                            )}
                          </button>
                        </td>
                      )}

                      {/* Data Cells */}
                      {activeColumns.map((col) => (
                        <td
                          key={col.key}
                          style={{
                            width: col.width,
                            minWidth: col.minWidth || 80,
                            textAlign: col.align || 'left',
                          }}
                          className={`${densityCellPadding} ${
                            col.sticky === 'left'
                              ? 'sticky left-0 z-10 bg-inherit backdrop-blur-xs'
                              : col.sticky === 'right'
                                ? 'sticky right-0 z-10 bg-inherit backdrop-blur-xs'
                                : ''
                          }`}
                        >
                          <CineEditableCell
                            row={row}
                            column={col}
                            value={row[col.key]}
                            onCellSave={handleCellSave}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination */}
        {pagination && (
          <CineTablePagination
            pagination={pagination}
            currentCount={processedData.length}
            onPageChange={(page) => {
              if (table) table.setPage(page);
              else if (onPaginationChange) onPaginationChange(page, pagination.perPage);
            }}
            onPerPageChange={(perPage) => {
              if (table) table.setPerPage(perPage);
              else if (onPaginationChange) onPaginationChange(1, perPage);
            }}
          />
        )}
      </div>

      {/* 5. Floating Bulk Action Bar */}
      <CineBulkActionBar
        selectedCount={selectedIds.length}
        selectedRows={selectedRows}
        selectedIds={selectedIds}
        onClearSelection={table ? table.clearSelection : () => setInternalSelectedIds([])}
        bulkActions={bulkActions}
      />
    </div>
  );
}
