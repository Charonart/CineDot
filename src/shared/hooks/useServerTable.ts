'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CineColumnDef,
  ColumnFilterRule,
  TableDensity,
  DataTablePaginationState,
  UseServerTableOptions,
  UseServerTableReturn,
} from '@/shared/types/dataTable.types';
import { AdminQueryParams } from '@/shared/types/api.types';

/**
 * Parses URL search params into table state (page, per_page, search, sort, filters)
 */
function parseUrlParams(
  searchParams: URLSearchParams,
  defaultPerPage = 15,
  defaultSort?: { column: string; direction: 'asc' | 'desc' }
) {
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || String(defaultPerPage), 10);
  const search = searchParams.get('search') || '';

  const sortBy = searchParams.get('sort_by');
  const sortDir = searchParams.get('sort_dir') as 'asc' | 'desc' | null;
  const sortConfig = sortBy && sortDir ? { column: sortBy, direction: sortDir } : defaultSort || null;

  const filters: Record<string, ColumnFilterRule> = {};
  searchParams.forEach((value, key) => {
    // Match filters[columnKey][op]=value or filters[columnKey]=value
    const nestedMatch = key.match(/^filters\[([^\]]+)\](?:\[([^\]]+)\])?$/);
    if (nestedMatch) {
      const col = nestedMatch[1];
      const op = nestedMatch[2] || 'eq';
      let parsedVal: any = value;
      if (value === 'true') parsedVal = true;
      else if (value === 'false') parsedVal = false;
      else if (!isNaN(Number(value)) && value.trim() !== '') parsedVal = Number(value);

      filters[col] = {
        op: op as any,
        val: parsedVal,
      };
    }
  });

  return { page, perPage, search, sortConfig, filters };
}

/**
 * Builds URL query string from table state
 */
function serializeUrlParams(
  page: number,
  perPage: number,
  search: string,
  sortConfig: { column: string; direction: 'asc' | 'desc' } | null,
  filters: Record<string, ColumnFilterRule>,
  existingParams: URLSearchParams
) {
  const params = new URLSearchParams(existingParams.toString());

  // Page & per_page
  if (page > 1) params.set('page', String(page));
  else params.delete('page');

  if (perPage !== 15) params.set('per_page', String(perPage));
  else params.delete('per_page');

  // Search
  if (search.trim()) params.set('search', search.trim());
  else params.delete('search');

  // Sort
  if (sortConfig) {
    params.set('sort_by', sortConfig.column);
    params.set('sort_dir', sortConfig.direction);
  } else {
    params.delete('sort_by');
    params.delete('sort_dir');
  }

  // Remove existing filters from URL
  Array.from(params.keys()).forEach((key) => {
    if (key.startsWith('filters[')) {
      params.delete(key);
    }
  });

  // Re-add active filters
  Object.entries(filters).forEach(([col, rule]) => {
    if (rule && rule.val !== undefined && rule.val !== null && rule.val !== '') {
      params.set(`filters[${col}][${rule.op}]`, String(rule.val));
    }
  });

  return params.toString();
}

export function useServerTable<T extends Record<string, any>>({
  queryKey,
  fetcher,
  columns,
  rowKey = 'id',
  exportFileName = 'cinedot_export',
  updateCell,
  bulkAction,
  defaultPerPage = 15,
  defaultSort,
  defaultFilters = {},
  syncWithUrl = true,
}: UseServerTableOptions<T>): UseServerTableReturn<T> {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // 1. Initial State from URL or Defaults
  const initialParams = useMemo(() => {
    if (!syncWithUrl || !searchParams) {
      return {
        page: 1,
        perPage: defaultPerPage,
        search: '',
        sortConfig: defaultSort || null,
        filters: {} as Record<string, ColumnFilterRule>,
      };
    }
    return parseUrlParams(searchParams, defaultPerPage, defaultSort);
  }, [syncWithUrl, searchParams, defaultPerPage, defaultSort]);

  // 2. States
  const [page, setPageInternal] = useState(initialParams.page);
  const [perPage, setPerPageInternal] = useState(initialParams.perPage);
  const [search, setSearchInternal] = useState(initialParams.search);
  const [debouncedSearch, setDebouncedSearch] = useState(initialParams.search);
  const [sortConfig, setSortConfigInternal] = useState(initialParams.sortConfig);
  const [filters, setFiltersInternal] = useState(initialParams.filters);

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [density, setDensity] = useState<TableDensity>('normal');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach((col) => {
      initial[col.key] = col.hidden !== true;
    });
    return initial;
  });

  // Track if initial sync has occurred
  const isFirstMount = useRef(true);

  // Helper to extract row ID
  const getRowId = useCallback(
    (row: T): string | number => {
      if (typeof rowKey === 'function') return rowKey(row);
      return row[rowKey] ?? row.id ?? row.user_id ?? JSON.stringify(row);
    },
    [rowKey]
  );

  // 3. Debounce Search Input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPageInternal(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // 4. Sync State to URL Query Params
  useEffect(() => {
    if (!syncWithUrl || isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const currentQuery = searchParams ? searchParams.toString() : '';
    const newQuery = serializeUrlParams(
      page,
      perPage,
      debouncedSearch,
      sortConfig,
      filters,
      searchParams || new URLSearchParams()
    );

    if (currentQuery !== newQuery) {
      const url = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(url, { scroll: false });
    }
  }, [page, perPage, debouncedSearch, sortConfig, filters, syncWithUrl, pathname, router, searchParams]);

  // 5. Build Fetcher Query Params
  const queryParams: AdminQueryParams = useMemo(() => {
    const params: AdminQueryParams = {
      page,
      per_page: perPage,
      search: debouncedSearch.trim() || undefined,
    };

    if (sortConfig) {
      params.sort_by = sortConfig.column;
      params.sort_dir = sortConfig.direction;
    }

    if (Object.keys(filters).length > 0) {
      const activeFilters: Record<string, any> = {};
      Object.entries(filters).forEach(([col, rule]) => {
        if (rule && rule.val !== undefined && rule.val !== null && rule.val !== '') {
          activeFilters[col] = {
            [rule.op]: rule.val,
          };
        }
      });
      if (Object.keys(activeFilters).length > 0) {
        params.filters = activeFilters;
      }
    }

    // Default filters
    if (defaultFilters && Object.keys(defaultFilters).length > 0) {
      params.filters = {
        ...defaultFilters,
        ...(params.filters || {}),
      };
    }

    return params;
  }, [page, perPage, debouncedSearch, sortConfig, filters, defaultFilters]);

  // 6. TanStack Query
  const serverQuery = useQuery({
    queryKey: [...queryKey, queryParams],
    queryFn: () => fetcher(queryParams),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });

  // Extract items and pagination
  const { data, pagination } = useMemo(() => {
    const raw: any = serverQuery.data;
    let items: T[] = [];
    let pag: DataTablePaginationState = {
      page,
      perPage,
      total: 0,
      totalPages: 1,
      lastPage: 1,
    };

    if (raw) {
      if (Array.isArray(raw.data)) {
        items = raw.data;
      } else if (Array.isArray(raw.items)) {
        items = raw.items;
      } else if (Array.isArray(raw)) {
        items = raw;
      }

      const meta = raw.meta || raw.pagination;
      if (meta) {
        pag = {
          page: meta.current_page || meta.currentPage || page,
          perPage: meta.per_page || meta.perPage || perPage,
          total: meta.total || meta.totalResults || items.length,
          lastPage: meta.last_page || meta.totalPages || 1,
          totalPages: meta.last_page || meta.totalPages || 1,
        };
      } else {
        pag.total = raw.total || items.length;
      }
    }

    return { data: items, pagination: pag };
  }, [serverQuery.data, page, perPage]);

  // 7. Selected Rows calculation
  const selectedRows = useMemo(() => {
    return data.filter((row) => selectedIds.includes(getRowId(row)));
  }, [data, selectedIds, getRowId]);

  const isAllSelected = useMemo(() => {
    if (data.length === 0) return false;
    return data.every((row) => selectedIds.includes(getRowId(row)));
  }, [data, selectedIds, getRowId]);

  // 8. Handlers
  const setPage = useCallback((newPage: number) => {
    setPageInternal(newPage);
  }, []);

  const setPerPage = useCallback((newPerPage: number) => {
    setPerPageInternal(newPerPage);
    setPageInternal(1);
  }, []);

  const setSearch = useCallback((newSearch: string) => {
    setSearchInternal(newSearch);
  }, []);

  const setFilter = useCallback((columnKey: string, rule: ColumnFilterRule | null) => {
    setFiltersInternal((prev) => {
      const next = { ...prev };
      if (!rule || rule.val === undefined || rule.val === null || rule.val === '') {
        delete next[columnKey];
      } else {
        next[columnKey] = rule;
      }
      return next;
    });
    setPageInternal(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersInternal({});
    setSearchInternal('');
    setDebouncedSearch('');
    setPageInternal(1);
  }, []);

  const toggleSort = useCallback((columnKey: string) => {
    setSortConfigInternal((prev) => {
      if (!prev || prev.column !== columnKey) {
        return { column: columnKey, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { column: columnKey, direction: 'desc' };
      }
      return null;
    });
    setPageInternal(1);
  }, []);

  const toggleSelectRow = useCallback(
    (id: string | number) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    },
    []
  );

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(getRowId));
    }
  }, [isAllSelected, data, getRowId]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const toggleColumnVisibility = useCallback((key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: prev[key] === false,
    }));
  }, []);

  // 9. Inline Cell Editing with Optimistic Update
  const handleCellEdit = useCallback(
    async (row: T, field: string, newValue: any) => {
      if (!updateCell) return;
      const id = getRowId(row);

      // Snapshot previous state for rollback
      const previousData = queryClient.getQueryData([...queryKey, queryParams]);

      // Optimistically update query cache
      queryClient.setQueryData([...queryKey, queryParams], (old: any) => {
        if (!old) return old;
        const updateRow = (r: T) => (getRowId(r) === id ? { ...r, [field]: newValue } : r);

        if (Array.isArray(old.data)) {
          return { ...old, data: old.data.map(updateRow) };
        }
        if (Array.isArray(old.items)) {
          return { ...old, items: old.items.map(updateRow) };
        }
        if (Array.isArray(old)) {
          return old.map(updateRow);
        }
        return old;
      });

      try {
        await updateCell(id, field, newValue);
      } catch (err) {
        // Rollback on error
        queryClient.setQueryData([...queryKey, queryParams], previousData);
        throw err;
      } finally {
        queryClient.invalidateQueries({ queryKey });
      }
    },
    [updateCell, getRowId, queryClient, queryKey, queryParams]
  );

  // 10. Bulk Action Handling
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const handleBulkAction = useCallback(
    async (action: string, payload?: any) => {
      if (!bulkAction || selectedIds.length === 0) return;
      setIsBulkLoading(true);
      try {
        await bulkAction(action, selectedIds, payload);
        setSelectedIds([]);
        await queryClient.invalidateQueries({ queryKey });
      } finally {
        setIsBulkLoading(false);
      }
    },
    [bulkAction, selectedIds, queryClient, queryKey]
  );

  // 11. Export to CSV (UTF-8 BOM formatted)
  const exportToCsv = useCallback(() => {
    if (data.length === 0) return;

    const activeCols = columns.filter((col) => visibleColumns[col.key] !== false && col.dataType !== 'actions');
    const headers = activeCols.map((c) => `"${c.title.replace(/"/g, '""')}"`);

    const rows = data.map((row) => {
      return activeCols
        .map((col) => {
          let val = row[col.key];
          if (col.exportFormatter) {
            val = col.exportFormatter(val, row);
          } else if (val === null || val === undefined) {
            val = '';
          } else if (typeof val === 'object') {
            val = JSON.stringify(val);
          }
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [data, columns, visibleColumns, exportFileName]);

  // 12. Bundled tableProps for <CineDataTable table={table} />
  const tableProps = useMemo(() => {
    return {
      data,
      columns,
      rowKey,
      isLoading: serverQuery.isLoading,
      pagination,
      onPaginationChange: (p: number, pp: number) => {
        setPage(p);
        setPerPage(pp);
      },
      onFilterChange: (newFilters: Record<string, ColumnFilterRule>, newSearch: string) => {
        setFiltersInternal(newFilters);
        setSearchInternal(newSearch);
      },
      onSortChange: (newSort: { column: string; direction: 'asc' | 'desc' } | null) => {
        setSortConfigInternal(newSort);
      },
      onCellEdit: handleCellEdit,
      exportFileName,
    };
  }, [data, columns, rowKey, serverQuery.isLoading, pagination, setPage, setPerPage, handleCellEdit, exportFileName]);

  return {
    data,
    columns,
    isLoading: serverQuery.isLoading,
    isFetching: serverQuery.isFetching,
    isError: serverQuery.isError,
    error: serverQuery.error,
    refetch: serverQuery.refetch,

    pagination,
    setPage,
    setPerPage,

    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    sortConfig,
    toggleSort,

    selectedIds,
    selectedRows,
    isAllSelected,
    toggleSelectAll,
    toggleSelectRow,
    clearSelection,
    handleBulkAction,
    isBulkLoading,

    visibleColumns,
    toggleColumnVisibility,
    density,
    setDensity,

    handleCellEdit,
    exportToCsv,

    tableProps,
  };
}
