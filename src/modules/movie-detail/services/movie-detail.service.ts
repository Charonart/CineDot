import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  MovieDetail,
  CinemaShowtimeGroup,
  MovieCastMember,
  MovieCrewMember,
  MovieReviewItem,
} from '../types/movie-detail.types';
import { MovieCardItem } from '@/modules/home/types/home.types';
import { imageHelper } from '@/shared/utils/imageHelper';
import { isShowtimePassed } from '@/shared/utils/showtimeHelper';
import {
  MOCK_MOVIE_DETAIL_SPIDERMAN,
  MOCK_MOVIE_DETAIL_COMING_SOON_MAP,
  MOCK_CINEMA_GROUPS,
  MOCK_RECOMMENDED_MOVIES,
  MOCK_MOVIE_CREDITS,
} from '../mocks/mockMovieDetailData';
import { APP_CONFIG } from '@/shared/constants/config';

export interface MovieCreditsResult {
  cast: MovieCastMember[];
  crew: MovieCrewMember[];
}

export async function fetchMovieDetail(slug: string): Promise<MovieDetail | null> {
  try {
    const res = await apiClient.get(ENDPOINTS.MOVIES.DETAIL_BY_SLUG(slug));
    if (res.data?.success && res.data?.data) {
      const m = res.data.data;
      const genres = Array.isArray(m.genres)
        ? m.genres.map((g: any) => g.name || g)
        : Array.isArray(m.genre)
        ? m.genre
        : [];

      const genreIds = Array.isArray(m.genres)
        ? m.genres.map((g: any) => g.genre_id || g.id).filter(Boolean)
        : undefined;

      const poster = imageHelper.getPosterUrl(m.posterUrl || m.poster_url || m.poster);
      const backdrop = imageHelper.getBackdropUrl(m.backdropUrl || m.backdrop_url || m.bannerUrl || m.posterUrl);
      const duration = typeof m.runtime === 'number'
        ? `${m.runtime} phút`
        : typeof m.duration === 'number'
        ? `${m.duration} phút`
        : m.duration || '';

      const status = (m.status || '').toLowerCase().includes('coming') ? 'COMING_SOON' : 'NOW_SHOWING';

      return {
        id: String(m.id || m.movie_id || ''),
        slug: m.slug || slug,
        title: m.title || m.originalTitle || '',
        originalTitle: m.originalTitle || m.original_title || m.title || '',
        posterUrl: poster,
        backdropUrl: backdrop,
        bannerUrl: backdrop,
        trailerUrl: Array.isArray(m.videos) && m.videos.find((v: any) => v.type === 'Trailer') ? `https://www.youtube.com/watch?v=${m.videos.find((v: any) => v.type === 'Trailer').key}` : (m.trailerUrl || m.trailer_url || ''),
        formatBadge: m.formatBadge || m.format_badge || '',
        ageRating: m.ageRating || m.age_rating || '',
        genre: genres,
        genreIds,
        duration,
        releaseDate: m.releaseDate || m.release_date || '',
        country: m.originalLanguage === 'en' ? 'Mỹ' : (m.country || ''),
        director: Array.isArray(m.crew) ? (m.crew.find((c: any) => c.job === 'Director')?.name || m.crew[0]?.name || '') : (m.director || ''),
        directorId: Array.isArray(m.crew) ? (m.crew.find((c: any) => c.job === 'Director')?.personId || m.crew[0]?.personId || null) : null,
        cast: Array.isArray(m.cast) ? m.cast.map((c: any) => c.name || c) : [],
        castMembers: Array.isArray(m.cast) ? m.cast.map((c: any) => ({
          id: c.creditId || c.id || c.personId || Math.random(),
          personId: c.personId || c.person_id || c.id,
          name: c.name,
          character: c.character || c.character_name,
          profileUrl: c.profilePath || c.profile_path || c.profileUrl ? imageHelper.getPosterUrl(c.profilePath || c.profile_path || c.profileUrl) : undefined,
          order: c.order,
        })) : [],
        crewMembers: Array.isArray(m.crew) ? m.crew.map((c: any) => ({
          id: c.creditId || c.id || c.personId || Math.random(),
          personId: c.personId || c.person_id || c.id,
          name: c.name,
          job: c.job,
          department: c.department,
          profileUrl: c.profilePath || c.profile_path || c.profileUrl ? imageHelper.getPosterUrl(c.profilePath || c.profile_path || c.profileUrl) : undefined,
        })) : [],
        videos: Array.isArray(m.videos) ? m.videos.map((v: any) => ({
          videoId: v.videoId || v.video_id || v.id,
          name: v.name || 'Official Video',
          key: v.key || v.key_value,
          site: v.site || 'YouTube',
          type: v.type || 'Trailer',
          official: Boolean(v.official),
          thumbnailUrl: (v.key || v.key_value) ? `https://img.youtube.com/vi/${v.key || v.key_value}/hqdefault.jpg` : undefined,
        })) : [],
        synopsis: m.overview || m.synopsis || '',
        rating: Number(m.rating || m.vote_average || 0),
        voteCount: Number(m.voteCount || m.vote_count || 0),
        status,
      };
    }
  } catch {
    // Fallback
  }

  if (!APP_CONFIG.USE_MOCK_DATA) return null;

  if (MOCK_MOVIE_DETAIL_COMING_SOON_MAP[slug]) {
    return MOCK_MOVIE_DETAIL_COMING_SOON_MAP[slug];
  }

  return {
    ...MOCK_MOVIE_DETAIL_SPIDERMAN,
    slug: slug || 'spiderman-new-beginning',
  };
}


export async function fetchMovieShowtimes(
  slug: string,
  dateStr?: string,
  provinceName?: string,
  screenType?: string,
  soundTechnology?: string
): Promise<CinemaShowtimeGroup[]> {
  try {
    const params: Record<string, any> = { movie_id: slug };
    if (dateStr) params.date = dateStr;
    if (screenType && screenType !== 'ALL') params.screen_type = screenType;
    if (soundTechnology && soundTechnology !== 'ALL') params.sound_technology = soundTechnology;

    const res = await apiClient.get(ENDPOINTS.SHOWTIMES.LIST, { params });
    if (res.data?.success && res.data?.data) {
      const payload = res.data.data;
      const results = Array.isArray(payload) ? payload : (payload.results || []);
      
      const targetGroup = results[0] || payload;
      const rawCinemas = targetGroup?.cinemas || [];

      if (rawCinemas.length > 0) {
        const mappedGroups: CinemaShowtimeGroup[] = [];

        for (const cg of rawCinemas) {
          const c = cg.cinema || cg;
          const cProvince = c.province || c.province_name || '';

          // Filter by province if selected
          if (provinceName && provinceName !== 'Toàn quốc') {
            if (!cProvince.toLowerCase().includes(provinceName.toLowerCase()) &&
                !provinceName.toLowerCase().includes(cProvince.toLowerCase())) {
              continue;
            }
          }

          const rawTimes = Array.isArray(cg.times) ? cg.times : [];
          if (rawTimes.length === 0) continue;

          // Group showtimes by format (e.g. IMAX Laser, 2D Dolby Atmos, ScreenX, Gold Class)
          const formatMap: Record<string, any[]> = {};
          for (const t of rawTimes) {
            const isPassed = isShowtimePassed({
              dateStr: dateStr,
              timeStr: t.startTime || t.time,
              showtimeStart: t.showtime_start,
            });
            if (isPassed) continue;

            const formatName = t.format || t.screen_type || '2D Digital';
            if (!formatMap[formatName]) {
              formatMap[formatName] = [];
            }
            formatMap[formatName].push({
              id: String(t.id || t.showtime_id),
              time: t.startTime || (t.showtime_start ? new Date(t.showtime_start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '19:30'),
              endTime: t.endTime || (t.showtime_end ? new Date(t.showtime_end).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : undefined),
              roomName: t.screen || t.room_name || 'Phòng chiếu',
              screen: t.screen || t.room_name,
              format: formatName,
              screen_type: t.screen_type,
              sound_technology: t.sound_technology,
              features: t.features || [],
              price: t.price || 90000,
              availableSeats: Number(t.availableSeats ?? t.available_seats ?? 48),
              totalSeats: Number(t.totalSeats ?? t.total_seats ?? 64),
            });
          }

          const formatGroups = Object.entries(formatMap)
            .filter(([_, showtimes]) => showtimes.length > 0)
            .map(([formatName, showtimes]) => ({
              formatName,
              showtimes,
            }));

          if (formatGroups.length === 0) continue;

          mappedGroups.push({
            cinemaId: String(c.cinema_id || c.id),
            cinemaName: c.cinema_name || c.name || 'CineDot Cinema',
            cinemaAddress: c.cinema_address || c.address,
            province: cProvince,
            phone: c.phone || '1900 1234',
            formatGroups,
          });
        }

        return mappedGroups;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export async function fetchRecommendedMovies(genreId?: number, currentMovieId?: string | number): Promise<MovieCardItem[]> {
  try {
    const params: any = { per_page: 6 };
    if (genreId) {
      params.genre_id = genreId;
    }

    const endpoint = genreId ? ENDPOINTS.MOVIES.LIST : ENDPOINTS.MOVIES.TRENDING;
    const res = await apiClient.get(endpoint, { params });

    if (res.data?.success && res.data?.data) {
      const payload = res.data.data;
      let list = Array.isArray(payload) ? payload : (payload.results || payload.data || []);
      
      if (currentMovieId) {
        list = list.filter((m: any) => String(m.id || m.movie_id) !== String(currentMovieId));
      }

      return list.slice(0, 5).map((m: any) => {
        const genres = Array.isArray(m.genres)
          ? m.genres.map((g: any) => g.name || g).join(', ')
          : 'Hành Động';

        return {
          id: String(m.id || m.movie_id),
          title: m.title || m.originalTitle || 'Tên Phim',
          slug: m.slug || 'movie-detail',
          genre: genres,
          duration: typeof m.runtime === 'number' ? `${m.runtime} phút` : '120 phút',
          rating: Number(m.rating || m.vote_average || 4.8),
          ageRating: m.ageRating || 'P',
          posterUrl: imageHelper.getPosterUrl(m.posterUrl || m.poster_url || m.poster_path),
          status: 'now-showing' as const,
          formatBadge: m.formatBadge || 'IMAX 2D',
        };
      });
    }
  } catch {
    // Fallback
  }

  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  return MOCK_RECOMMENDED_MOVIES;
}

export async function fetchMovieReviews(movieId: number | string, page: number = 1): Promise<MovieReviewItem[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MOVIES.REVIEWS(movieId), { params: { page, per_page: 20 } });
    if (res.data?.success && res.data?.data) {
      const rawList = Array.isArray(res.data.data) ? res.data.data : res.data.data.results || res.data.data.data || [];
      return rawList.map((r: any) => ({
        review_id: r.review_id || r.id,
        user_name: r.user?.fullname || r.user?.username || r.user_name || 'Khách Hàng CineDot',
        user_avatar: r.user?.avatar || r.user_avatar,
        rating: Number(r.rating || 5),
        comment: r.comment || r.content || '',
        created_at: r.created_at || 'Vừa xong',
      }));
    }
    return [];
  } catch {
    return [];
  }
}

export async function submitMovieReview(
  movieId: number | string,
  payload: { rating: number; comment: string }
): Promise<{ success: boolean; message?: string; review?: MovieReviewItem }> {
  try {
    const res = await apiClient.post(ENDPOINTS.MOVIES.CREATE_REVIEW(movieId), payload);
    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'Gửi đánh giá thành công',
      review: res.data?.data ? {
        review_id: res.data.data.review_id || res.data.data.id || Date.now(),
        user_name: res.data.data.user?.fullname || res.data.data.user_name || 'Tôi',
        user_avatar: res.data.data.user?.avatar,
        rating: payload.rating,
        comment: payload.comment,
        created_at: 'Vừa xong',
      } : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || 'Không thể gửi đánh giá. Vui lòng đăng nhập.',
    };
  }
}
