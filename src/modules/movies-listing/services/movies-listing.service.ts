import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { MovieListingItem, MovieListingTab } from '../types/movies-listing.types';
import { imageHelper } from '@/shared/utils/imageHelper';
import { MOCK_MOVIES_LISTING } from '../mocks/mockMoviesListingData';
import { MovieStatus, normalizeMovieStatus } from '@/shared/utils/movieStatusHelper';

export interface MoviesListingResult {
  movies: MovieListingItem[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export async function fetchMoviesListing(
  tab: MovieListingTab,
  searchQuery: string = '',
  genreId?: number | string,
  page: number = 1
): Promise<MoviesListingResult> {
  const canonicalStatus: MovieStatus = tab === 'upcoming' || tab === 'coming-soon' ? 'upcoming' : 'now_showing';
  try {
    const params: Record<string, any> = {
      status: canonicalStatus,
      per_page: 12,
      page,
    };

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    if (genreId && genreId !== 'all') {
      params.genre_id = genreId;
    }

    const res = await apiClient.get(ENDPOINTS.MOVIES.LIST, { params });
    if (res.data?.success && res.data?.data) {
      const payload = res.data.data;
      const rawList = Array.isArray(payload) ? payload : payload.results || payload.data || [];
      const totalPages = payload.totalPages || payload.last_page || 1;
      const totalResults = payload.totalResults || payload.total || rawList.length;

      if (rawList.length > 0) {
        const mapped: MovieListingItem[] = rawList.map((m: any) => {
          const genres = Array.isArray(m.genres)
            ? m.genres.map((g: any) => g.name || g)
            : Array.isArray(m.genre)
            ? m.genre
            : typeof m.genre === 'string'
            ? m.genre.split(',').map((s: string) => s.trim())
            : ['Hành Động'];

          const poster = imageHelper.getPosterUrl(m.poster_url || m.posterUrl || m.poster);
          const duration = typeof m.runtime === 'number'
            ? `${m.runtime} phút`
            : typeof m.duration === 'number'
            ? `${m.duration} phút`
            : m.duration || '120 phút';

          return {
            id: String(m.id || m.movie_id),
            slug: m.slug || 'movie-detail',
            title: m.title || m.original_title || m.originalTitle || 'Tên Phim',
            originalTitle: m.original_title || m.originalTitle || m.title,
            posterUrl: poster,
            trailerUrl: m.trailer_url || m.trailerUrl || 'https://youtube.com',
            formatBadge: m.format_badge || m.formatBadge || 'IMAX 2D',
            ageRating: m.age_rating || m.ageRating || 'P',
            genre: genres,
            duration,
            rating: Number(m.vote_average ?? m.rating ?? 0),
            voteCount: Number(m.vote_count ?? m.voteCount ?? 0),
            imdbId: m.imdb_id || m.imdbId || (m.id ? `tt${String(m.id).padStart(7, '0')}` : undefined),
            imdbUrl: m.imdb_url || m.imdbUrl || (m.imdb_id ? `https://www.imdb.com/title/${m.imdb_id}` : undefined),
            status: normalizeMovieStatus(m.status),
            isHot: Boolean(m.is_hot || m.isHot || true),
          };
        });

        return {
          movies: mapped,
          page,
          totalPages,
          totalResults,
        };
      }
    }

    // Fallback
    let filtered = MOCK_MOVIES_LISTING.filter((m) => m.status === canonicalStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.originalTitle && m.originalTitle.toLowerCase().includes(q))
      );
    }
    return {
      movies: filtered,
      page: 1,
      totalPages: Math.ceil(filtered.length / 12) || 1,
      totalResults: filtered.length,
    };
  } catch {
    let filtered = MOCK_MOVIES_LISTING.filter((m) => m.status === canonicalStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.originalTitle && m.originalTitle.toLowerCase().includes(q))
      );
    }
    return {
      movies: filtered,
      page: 1,
      totalPages: Math.ceil(filtered.length / 12) || 1,
      totalResults: filtered.length,
    };
  }
}
