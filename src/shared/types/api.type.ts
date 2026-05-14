export interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationMeta;
}
