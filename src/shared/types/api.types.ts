export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  code?: string;
  errors?: Record<string, string[] | undefined>;
}

export interface ApiPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface ApiPaginatedData<T = any> {
  items?: T[];
  data?: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[] | undefined>;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  status?: number;
  errors?: Record<string, string[] | undefined>;
}
