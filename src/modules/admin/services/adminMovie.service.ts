import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse, ApiPaginatedData } from '@/shared/types/api.types';
import {
  AdminMovieItemDTO,
  AdminMovieListRequestDTO,
  CreateMovieRequestDTO,
  UpdateMovieRequestDTO,
  TmdbSearchResultDTO,
  GenreItemDTO,
} from '../dto/adminMovie.dto';
import { MovieCreditItemDTO, CreateMovieCreditDTO } from '../dto/adminCredit.dto';
import { adminMovieMapper } from '../mappers/adminMovie.mapper';
import { AdminMovieItem, AdminMovieCredit, GenreItem } from '../types/adminMovie.types';

export interface PaginatedMovieResult {
  items: AdminMovieItem[];
  data: AdminMovieItem[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  pagination: {
    page: number;
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
    lastPage: number;
  };
}

export const adminMovieService = {
  /**
   * Lấy danh sách thể loại phim (GET /api/v1/genres)
   */
  async getGenres(): Promise<GenreItem[]> {
    try {
      const res = await apiClient.get<ApiResponse<GenreItemDTO[]>>(ENDPOINTS.MASTER.GENRES);
      const list = res.data?.data || [];
      return list.map((g) => ({
        id: g.id || g.genre_id || 1,
        name: g.name || g.genre_name || 'Hành động',
        slug: g.slug,
      }));
    } catch {
      return [
        { id: 1, name: 'Hành động' },
        { id: 2, name: 'Phiêu lưu' },
        { id: 3, name: 'Hoạt hình' },
        { id: 4, name: 'Hài hước' },
        { id: 5, name: 'Kinh dị' },
        { id: 6, name: 'Tâm lý' },
        { id: 7, name: 'Viễn tưởng' },
        { id: 8, name: 'Tình cảm' },
      ];
    }
  },

  /**
   * Lấy danh sách phim quản trị (Server-side Pagination, Filter, Search)
   */
  async getMovies(params?: AdminMovieListRequestDTO): Promise<PaginatedMovieResult> {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.MOVIES, { params });
    const data = res.data?.data;
    const meta = res.data?.meta;

    const rawList = Array.isArray(data) ? data : (data?.data || data?.items || []);
    const items = rawList.map(adminMovieMapper.toDomain);

    const currentPage = Number(meta?.current_page || data?.current_page || params?.page || 1);
    const perPage = Number(meta?.per_page || data?.per_page || params?.per_page || params?.limit || 15);
    const total = Number(meta?.total || data?.total || rawList.length);
    const lastPage = Number(meta?.last_page || data?.last_page || (perPage > 0 ? Math.ceil(total / perPage) : 1));

    return {
      items,
      data: items,
      currentPage,
      lastPage,
      perPage,
      total,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPage,
        total,
      },
      pagination: {
        page: currentPage,
        currentPage,
        perPage,
        total,
        totalPages: lastPage,
        lastPage,
      },
    };
  },

  async updateCell(id: number | string, field: string, value: any): Promise<AdminMovieItem> {
    const res = await apiClient.patch<ApiResponse<AdminMovieItemDTO>>(
      `/api/v1/admin/movies/${id}/cell`,
      { field, value }
    );
    return adminMovieMapper.toDomain(res.data.data);
  },

  async toggleMovieStatus(id: number | string): Promise<AdminMovieItem> {
    const res = await apiClient.patch<ApiResponse<AdminMovieItemDTO>>(
      `/api/v1/admin/movies/${id}/toggle-status`
    );
    return adminMovieMapper.toDomain(res.data.data);
  },

  async bulkAction(
    action: 'delete' | 'set_now_showing' | 'set_upcoming' | 'set_ended',
    ids: (string | number)[],
    payload?: any
  ): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<{ success: boolean; message: string }>(
      '/api/v1/admin/movies/bulk',
      { action, ids, payload }
    );
    return res.data;
  },

  /**
   * Lấy chi tiết thông tin bộ phim
   */
  async getMovie(id: number | string): Promise<AdminMovieItem> {
    const res = await apiClient.get<ApiResponse<AdminMovieItemDTO>>(
      ENDPOINTS.ADMIN.MOVIE_DETAIL(id)
    );
    return adminMovieMapper.toDomain(res.data.data);
  },

  /**
   * Tạo mới bộ phim thủ công (POST /api/v1/admin/movies)
   */
  async createMovie(payload: CreateMovieRequestDTO): Promise<AdminMovieItem> {
    const res = await apiClient.post<ApiResponse<AdminMovieItemDTO>>(
      ENDPOINTS.ADMIN.MOVIES,
      payload
    );
    return adminMovieMapper.toDomain(res.data.data);
  },

  /**
   * Cập nhật thông tin phim (PUT /api/v1/admin/movies/:id)
   */
  async updateMovie(id: number | string, payload: UpdateMovieRequestDTO): Promise<AdminMovieItem> {
    const res = await apiClient.put<ApiResponse<AdminMovieItemDTO>>(
      ENDPOINTS.ADMIN.MOVIE_DETAIL(id),
      payload
    );
    return adminMovieMapper.toDomain(res.data.data);
  },

  /**
   * Xóa vĩnh viễn phim khỏi hệ thống (DELETE /api/v1/admin/movies/:id)
   */
  async deleteMovie(id: number | string): Promise<{ success: boolean; id: string }> {
    await apiClient.delete(ENDPOINTS.ADMIN.MOVIE_DETAIL(id));
    return { success: true, id: String(id) };
  },

  /**
   * Tìm kiếm & Đồng bộ phim tự động từ TMDB (POST /api/v1/admin/movies/sync)
   */
  async syncMoviesFromTmdb(query: string): Promise<AdminMovieItem[]> {
    const res = await apiClient.post<
      ApiResponse<TmdbSearchResultDTO[] | AdminMovieItemDTO[] | TmdbSearchResultDTO>
    >(ENDPOINTS.ADMIN.MOVIES_SYNC, { query });

    const rawData = res.data?.data;
    if (Array.isArray(rawData)) {
      return rawData.map((item: TmdbSearchResultDTO | AdminMovieItemDTO) =>
        'vote_average' in item
          ? adminMovieMapper.fromTmdbToDomain(item as TmdbSearchResultDTO)
          : adminMovieMapper.toDomain(item as AdminMovieItemDTO)
      );
    }

    if (rawData) {
      return [adminMovieMapper.fromTmdbToDomain(rawData as TmdbSearchResultDTO)];
    }

    return [];
  },

  /**
   * Lấy danh sách diễn viên & đạo diễn của phim
   */
  async getMovieCredits(movieId: number | string): Promise<AdminMovieCredit[]> {
    try {
      const res = await apiClient.get<ApiResponse<{ cast?: MovieCreditItemDTO[]; crew?: MovieCreditItemDTO[] } | MovieCreditItemDTO[]>>(
        ENDPOINTS.ADMIN.MOVIE_CREDITS(movieId)
      );
      const data = res.data?.data;
      if (Array.isArray(data)) {
        return data.map(adminMovieMapper.creditToDomain);
      }
      if (data && typeof data === 'object') {
        const combined = [...(data.cast || []), ...(data.crew || [])];
        return combined.map(adminMovieMapper.creditToDomain);
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Thêm diễn viên / đạo diễn vào phim
   */
  async addMovieCredit(
    movieId: number | string,
    payload: CreateMovieCreditDTO
  ): Promise<AdminMovieCredit> {
    const res = await apiClient.post<ApiResponse<MovieCreditItemDTO>>(
      ENDPOINTS.ADMIN.MOVIE_CREDITS(movieId),
      payload
    );
    return adminMovieMapper.creditToDomain(res.data.data);
  },

  /**
   * Xóa diễn viên khỏi phim
   */
  async deleteMovieCredit(
    movieId: number | string,
    creditId: number | string
  ): Promise<{ success: boolean }> {
    await apiClient.delete(ENDPOINTS.ADMIN.MOVIE_CREDIT_DELETE(movieId, creditId));
    return { success: true };
  },
};
