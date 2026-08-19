import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import {
  AdminGenreItemDTO,
  AdminGenreListResponseDTO,
  CreateGenreRequestDTO,
  UpdateGenreRequestDTO,
  GenreMovieListResponseDTO,
} from '../dto/adminGenre.dto';
import { AdminGenreItem, AdminGenrePagination, GenreMovieItem } from '../types/adminGenre.types';
import { adminGenreMapper } from '../mappers/adminGenre.mapper';

export interface GetAdminGenresParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const adminGenreService = {
  /**
   * Lấy danh sách thể loại phim phân trang và tìm kiếm (GET /api/v1/admin/genres)
   */
  async getGenres(params?: GetAdminGenresParams): Promise<{
    items: AdminGenreItem[];
    pagination: AdminGenrePagination;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    const url = `${ENDPOINTS.ADMIN.GENRES}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const res = await apiClient.get<ApiResponse<AdminGenreListResponseDTO>>(url);

    const data = res.data?.data;
    const rawItems = Array.isArray(data?.results) ? data.results : [];

    const items = rawItems.map((dto) => adminGenreMapper.toDomain(dto));
    const pagination: AdminGenrePagination = {
      currentPage: data?.page || 1,
      totalPages: data?.totalPages || 1,
      totalResults: data?.totalResults || items.length,
    };

    return { items, pagination };
  },

  /**
   * Tạo thể loại phim mới (POST /api/v1/admin/genres)
   */
  async createGenre(payload: CreateGenreRequestDTO): Promise<AdminGenreItem> {
    const res = await apiClient.post<ApiResponse<AdminGenreItemDTO>>(ENDPOINTS.ADMIN.GENRES, payload);
    const created = res.data?.data;
    if (!created) {
      throw new Error(res.data?.message || 'Không thể tạo thể loại mới');
    }
    return adminGenreMapper.toDomain(created);
  },

  /**
   * Cập nhật thể loại phim (PUT /api/v1/admin/genres/:id)
   */
  async updateGenre(id: number | string, payload: UpdateGenreRequestDTO): Promise<AdminGenreItem> {
    const url = ENDPOINTS.ADMIN.GENRE_DETAIL(id);
    const res = await apiClient.put<ApiResponse<AdminGenreItemDTO>>(url, payload);
    const updated = res.data?.data;
    if (!updated) {
      throw new Error(res.data?.message || 'Không thể cập nhật thể loại');
    }
    return adminGenreMapper.toDomain(updated);
  },

  /**
   * Xóa thể loại phim (DELETE /api/v1/admin/genres/:id)
   */
  async deleteGenre(id: number | string): Promise<boolean> {
    const url = ENDPOINTS.ADMIN.GENRE_DETAIL(id);
    const res = await apiClient.delete<ApiResponse<unknown>>(url);
    return Boolean(res.data?.success);
  },

  /**
   * Xem danh sách phim thuộc thể loại này (GET /api/v1/genres/:id/movies)
   */
  async getGenreMovies(genreId: number | string, page = 1, perPage = 20): Promise<{
    movies: GenreMovieItem[];
    totalResults: number;
  }> {
    const url = `${ENDPOINTS.MASTER.GENRE_MOVIES(genreId)}?page=${page}&per_page=${perPage}`;
    const res = await apiClient.get<ApiResponse<GenreMovieListResponseDTO>>(url);

    const data = res.data?.data;
    const rawMovies = Array.isArray(data?.results) ? data.results : [];
    const movies = rawMovies.map((m) => adminGenreMapper.movieToDomain(m));

    return {
      movies,
      totalResults: data?.totalResults || movies.length,
    };
  },
};
