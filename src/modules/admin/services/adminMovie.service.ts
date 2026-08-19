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
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
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
    try {
      const res = await apiClient.get<
        ApiResponse<ApiPaginatedData<AdminMovieItemDTO> | AdminMovieItemDTO[]>
      >(ENDPOINTS.ADMIN.MOVIES, { params });

      const data = res.data?.data;

      // Hỗ trợ cả phản hồi dạng mảng lẫn đối tượng phân trang
      if (Array.isArray(data)) {
        return {
          items: data.map(adminMovieMapper.toDomain),
          currentPage: 1,
          lastPage: 1,
          perPage: data.length,
          total: data.length,
        };
      }

      const rawList = data?.data || data?.items || [];
      return {
        items: rawList.map(adminMovieMapper.toDomain),
        currentPage: data?.current_page || 1,
        lastPage: data?.last_page || 1,
        perPage: data?.per_page || (params?.per_page || 6),
        total: data?.total || rawList.length,
      };
    } catch (err: unknown) {
      const errorObj = err as { status?: number; code?: string };
      // Fallback: nếu /admin/movies trả về 404/405, gọi endpoint public /movies
      if (errorObj?.status === 404 || errorObj?.status === 405 || String(errorObj?.code) === '404') {
        const publicRes = await apiClient.get<
          ApiResponse<AdminMovieItemDTO[] | { results?: AdminMovieItemDTO[]; data?: AdminMovieItemDTO[] }>
        >(ENDPOINTS.MOVIES.LIST, { params });
        const pData = publicRes.data?.data;
        const list = Array.isArray(pData) ? pData : (pData?.results || pData?.data || []);
        return {
          items: list.map(adminMovieMapper.toDomain),
          currentPage: 1,
          lastPage: 1,
          perPage: list.length,
          total: list.length,
        };
      }
      throw err;
    }
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
