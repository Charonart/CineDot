import { imageHelper } from '@/shared/utils/imageHelper';
import { normalizeMovieStatus } from '@/shared/utils/movieStatusHelper';
import { apiClient } from '@/shared/lib/apiClient';
import { ApiResponse } from '@/shared/types/api.types';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  GetAdminShowtimesParams,
  AdminShowtimeListResponseDTO,
  AdminShowtimeItemDTO,
  CreateAdminShowtimeRequestDTO,
  UpdateAdminShowtimeRequestDTO,
  CloneDateShowtimesRequestDTO,
} from '../dto/adminShowtime.dto';
import {
  AdminShowtimeGridItem,
  AdminCinemaOption,
  AdminMovieOption,
  AdminRoomOption,
} from '../types/adminShowtime.types';
import { adminShowtimeMapper } from '../mappers/adminShowtime.mapper';

export const adminShowtimeService = {
  /**
   * Lấy danh sách suất chiếu theo rạp, ngày, phòng
   */
  async getShowtimes(params?: GetAdminShowtimesParams): Promise<AdminShowtimeGridItem[]> {
    const res = await apiClient.get<ApiResponse<AdminShowtimeListResponseDTO | AdminShowtimeItemDTO[]>>(
      ENDPOINTS.ADMIN.SHOWTIMES,
      { params }
    );

    const rawData = res.data?.data;
    let list: AdminShowtimeItemDTO[] = [];
    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (rawData && Array.isArray((rawData as AdminShowtimeListResponseDTO).data)) {
      list = (rawData as AdminShowtimeListResponseDTO).data;
    }

    return list.map((dto) => adminShowtimeMapper.toGridItem(dto));
  },

  /**
   * Chi tiết suất chiếu
   */
  async getShowtimeDetail(id: number | string): Promise<AdminShowtimeGridItem> {
    const res = await apiClient.get<ApiResponse<AdminShowtimeItemDTO>>(
      ENDPOINTS.ADMIN.SHOWTIME_DETAIL(id)
    );

    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không tìm thấy suất chiếu.');
    }

    return adminShowtimeMapper.toGridItem(res.data.data);
  },

  /**
   * Tạo suất chiếu mới (kèm chống trùng lịch)
   */
  async createShowtime(data: CreateAdminShowtimeRequestDTO): Promise<AdminShowtimeGridItem> {
    const res = await apiClient.post<ApiResponse<AdminShowtimeItemDTO>>(
      ENDPOINTS.ADMIN.SHOWTIMES,
      data
    );

    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không thể tạo suất chiếu.');
    }

    return adminShowtimeMapper.toGridItem(res.data.data);
  },

  /**
   * Cập nhật suất chiếu
   */
  async updateShowtime(id: number | string, data: UpdateAdminShowtimeRequestDTO): Promise<AdminShowtimeGridItem> {
    const res = await apiClient.put<ApiResponse<AdminShowtimeItemDTO>>(
      ENDPOINTS.ADMIN.SHOWTIME_DETAIL(id),
      data
    );

    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không thể cập nhật suất chiếu.');
    }

    return adminShowtimeMapper.toGridItem(res.data.data);
  },

  /**
   * Xóa suất chiếu
   */
  async deleteShowtime(id: number | string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(ENDPOINTS.ADMIN.SHOWTIME_DETAIL(id));
  },

  /**
   * Sao chép toàn bộ lịch chiếu sang ngày mới
   */
  async cloneDateShowtimes(data: CloneDateShowtimesRequestDTO): Promise<{ message: string; clonedCount: number }> {
    const res = await apiClient.post<ApiResponse<{ cloned_count: number; skipped_count: number }>>(
      ENDPOINTS.ADMIN.SHOWTIME_CLONE_DATE,
      data
    );

    return {
      message: res.data?.message || 'Sao chép lịch chiếu thành công.',
      clonedCount: res.data?.data?.cloned_count || 0,
    };
  },

  /**
   * Lấy danh sách cụm rạp thực tế (kèm phòng chiếu)
   */
  async getCinemas(): Promise<AdminCinemaOption[]> {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.CINEMAS);
    const rawData = res.data?.data;
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];

    return list.map((c: any) => ({
      id: Number(c.cinema_id || c.id),
      name: c.cinema_name || c.name || 'Cụm rạp CineDot',
      slug: c.slug,
      provinceName: c.province?.province_name || c.city || '',
    }));
  },

  /**
   * Lấy danh sách phòng chiếu của cụm rạp
   */
  async getRoomsByCinema(cinemaId: number | string): Promise<AdminRoomOption[]> {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.CINEMA_ROOMS(cinemaId));
    const rawData = res.data?.data;
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];

    return list.map((r: any) => {
      const matrix = Array.isArray(r.seat_matrix) ? r.seat_matrix : [];
      return {
        id: Number(r.room_id || r.id),
        cinemaId: Number(r.cinema_id || cinemaId),
        name: r.room_name || `Phòng ${r.room_id}`,
        type: r.room_type || '2D Standard',
        capacity: matrix.length || Number(r.total_seats || 120),
      };
    });
  },

  /**
   * Lấy danh sách phim đang chiếu / sắp chiếu
   */
  async getMovies(): Promise<AdminMovieOption[]> {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIES, { params: { limit: 100 } });
    const rawData = res.data?.data;
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];

    return list.map((m: any) => {
      const rawPoster = m.poster_path || m.poster_url || m.posterUrl || m.poster || '';
      const rawBackdrop = m.backdrop_path || m.backdrop_url || m.backdropUrl || m.banner_url || m.banner || rawPoster;
      
      const status = normalizeMovieStatus(m.status || (m.is_showing ? 'now_showing' : undefined));

      const genresList: string[] = [];
      if (Array.isArray(m.genres)) {
        m.genres.forEach((g: any) => {
          if (typeof g === 'string') genresList.push(g);
          else if (g?.name) genresList.push(g.name);
          else if (g?.genre_name) genresList.push(g.genre_name);
        });
      } else if (Array.isArray(m.genre)) {
        genresList.push(...m.genre);
      }

      return {
        id: Number(m.movie_id || m.id),
        title: m.title || 'Phim Chiếu Rạp',
        posterUrl: imageHelper.getPosterUrl(rawPoster, 'md'),
        bannerUrl: imageHelper.getBackdropUrl(rawBackdrop, 'lg'),
        status,
        releaseDate: m.release_date || m.releaseDate || '',
        duration: Number(m.duration_minutes || m.duration || 120),
        ageRating: m.age_rating || m.ageRating || 'P',
        genres: genresList.length > 0 ? genresList : ['Phim rạp'],
      };
    });
  },
};
