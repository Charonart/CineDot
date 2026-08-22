import React from 'react';
import { ApiPaginationMeta, AdminQueryParams } from './api.types';

export type ColumnDataType =
  | 'text'
  | 'number'
  | 'currency'
  | 'select'
  | 'date'
  | 'boolean'
  | 'badge'
  | 'avatar'
  | 'actions'
  | 'custom';

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'starts_with'
  | 'ends_with'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null';

export interface ColumnSelectOption {
  label: string;
  value: any;
  color?: string;
  badgeClass?: string;
}

export interface ColumnFilterRule {
  op: FilterOperator;
  val: any;
}

export interface CineColumnDef<T> {
  key: string;
  title: string;
  dataType?: ColumnDataType;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  hidden?: boolean;
  sticky?: 'left' | 'right';
  width?: number | string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  options?: ColumnSelectOption[];
  format?: (value: any, row: T) => React.ReactNode;
  cell?: (info: { row: T; value: any; index: number; isEditing?: boolean; onInlineChange?: (val: any) => void }) => React.ReactNode;
  renderCell?: (row: T, isEditing: boolean, onInlineChange: (val: any) => void) => React.ReactNode;
  renderEditCell?: (
    value: any,
    onChange: (val: any) => void,
    onSave: () => void,
    onCancel: () => void,
    row: T
  ) => React.ReactNode;
  exportFormatter?: (value: any, row: T) => string;
  filterOptions?: {
    placeholder?: string;
    min?: number;
    max?: number;
    options?: ColumnSelectOption[];
  };
  filterConfig?: {
    placeholder?: string;
    min?: number;
    max?: number;
    options?: ColumnSelectOption[];
  };
  validate?: (value: any, row: T) => string | null | undefined;
}

// Alias for backward compatibility
export type ColumnDef<T> = CineColumnDef<T>;

export type TableDensity = 'compact' | 'normal' | 'spacious';

export interface BulkAction<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'danger' | 'default' | 'amber';
  onClick: (selectedRows: T[], selectedIds: (string | number)[]) => Promise<void> | void;
}

export interface DataTablePaginationState {
  page: number;
  perPage: number;
  total: number;
  lastPage?: number;
  totalPages?: number;
}

export interface UseServerTableOptions<T extends Record<string, any> = Record<string, any>> {
  queryKey: readonly any[];
  fetcher: (params: AdminQueryParams) => Promise<{ data: T[]; meta?: ApiPaginationMeta; pagination?: any } | { items: T[]; pagination?: any; total?: number }>;
  columns: CineColumnDef<T>[];
  rowKey?: string | ((row: T) => string | number);
  exportFileName?: string;
  updateCell?: (id: string | number, field: string, value: any) => Promise<any>;
  bulkAction?: (action: string, ids: (string | number)[], payload?: any) => Promise<any>;
  defaultPerPage?: number;
  defaultSort?: { column: string; direction: 'asc' | 'desc' };
  defaultFilters?: Record<string, any>;
  syncWithUrl?: boolean;
}

export interface UseServerTableReturn<T extends Record<string, any> = Record<string, any>> {
  data: T[];
  columns: CineColumnDef<T>[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => Promise<any>;

  // Pagination
  pagination: DataTablePaginationState;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;

  // Search & Filter & Sort
  search: string;
  setSearch: (query: string) => void;
  filters: Record<string, ColumnFilterRule>;
  setFilter: (columnKey: string, rule: ColumnFilterRule | null) => void;
  clearFilters: () => void;
  sortConfig: { column: string; direction: 'asc' | 'desc' } | null;
  toggleSort: (columnKey: string) => void;

  // Selection & Bulk
  selectedIds: (string | number)[];
  selectedRows: T[];
  isAllSelected: boolean;
  toggleSelectAll: () => void;
  toggleSelectRow: (id: string | number) => void;
  clearSelection: () => void;
  handleBulkAction: (action: string, payload?: any) => Promise<void>;
  isBulkLoading: boolean;

  // View state
  visibleColumns: Record<string, boolean>;
  toggleColumnVisibility: (key: string) => void;
  density: TableDensity;
  setDensity: (density: TableDensity) => void;

  // Inline edit & Export
  handleCellEdit: (row: T, field: string, newValue: any) => Promise<void>;
  exportToCsv: () => void;

  // Bound props for <CineDataTable table={table} />
  tableProps: CineDataTableProps<T>;
}

export interface CineDataTableProps<T extends Record<string, any> = Record<string, any>> {
  table?: UseServerTableReturn<T>;

  // Optional manual props when not using `table` prop
  data?: T[];
  columns?: CineColumnDef<T>[];
  rowKey?: string | ((row: T) => string | number);
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  bulkActions?: BulkAction<T>[];
  serverSide?: boolean;
  pagination?: DataTablePaginationState;
  onPaginationChange?: (page: number, perPage: number) => void;
  onFilterChange?: (filters: Record<string, ColumnFilterRule>, search: string) => void;
  onSortChange?: (sort: { column: string; direction: 'asc' | 'desc' } | null) => void;
  onCellEdit?: (row: T, field: string, newValue: any) => Promise<void> | void;
  onRowClick?: (row: T) => void;
  enableExport?: boolean;
  exportFileName?: string;
  enableDensityToggle?: boolean;
  enableColumnVisibility?: boolean;
  enableSelection?: boolean;
  emptyState?: React.ReactNode;
  stickyHeader?: boolean;
  className?: string;
}
