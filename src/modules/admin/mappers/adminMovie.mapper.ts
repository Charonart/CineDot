import { AdminMovieItemDTO, TmdbSearchResultDTO } from '../dto/adminMovie.dto';
import { MovieCreditItemDTO } from '../dto/adminCredit.dto';
import { AdminMovieItem, AdminMovieCredit, GenreItem, MovieStatus } from '../types/adminMovie.types';
import { imageHelper } from '@/shared/utils/imageHelper';

export const adminMovieMapper = {
  toDomain(dto: AdminMovieItemDTO): AdminMovieItem {
    const rawStatus = (dto.status || 'now_showing').toLowerCase();
    let status: MovieStatus = 'NOW_SHOWING';
    if (rawStatus.includes('coming') || rawStatus.includes('upcoming')) {
      status = 'COMING_SOON';
    } else if (rawStatus.includes('stop') || rawStatus.includes('end')) {
      status = 'STOPPED';
    }

    // Extract genres list
    const genres: GenreItem[] = [];
    const genreNames: string[] = [];
    const genreIds: number[] = [];

    if (Array.isArray(dto.genres)) {
      dto.genres.forEach((g) => {
        if (typeof g === 'string') {
          genreNames.push(g);
        } else if (g && typeof g === 'object') {
          const id = g.genre_id || g.id || 0;
          const name = g.genre_name || g.name || 'Hành động';
          genres.push({ id, name, slug: g.slug });
          genreNames.push(name);
          if (id > 0) genreIds.push(id);
        }
      });
    } else if (Array.isArray(dto.genre)) {
      dto.genre.forEach((name) => genreNames.push(name));
    }

    if (Array.isArray(dto.genre_ids)) {
      dto.genre_ids.forEach((id) => {
        if (!genreIds.includes(id)) genreIds.push(id);
      });
    }

    // Extract trailer url
    let trailerUrl = dto.trailer_url || dto.trailerUrl;
    if (!trailerUrl && Array.isArray(dto.videos) && dto.videos.length > 0) {
      const vid = dto.videos.find((v) => v.type === 'Trailer') || dto.videos[0];
      if (vid?.key) {
        trailerUrl = `https://www.youtube.com/watch?v=${vid.key}`;
      }
    }

    const durationNum = typeof dto.duration_minutes === 'number'
      ? dto.duration_minutes
      : typeof dto.duration === 'number'
        ? dto.duration
        : parseInt(String(dto.duration || '120'), 10) || 120;

    const ratingNum = typeof dto.rating === 'number'
      ? dto.rating
      : parseFloat(String(dto.vote_average || dto.rating || '4.8')) || 4.8;

    const rawPoster = dto.poster_path || dto.poster_url || dto.posterUrl || '';
    const rawBackdrop = dto.backdrop_path || dto.backdrop_url || dto.backdropUrl || '';

    return {
      id: String(dto.movie_id || dto.id || ''),
      slug: dto.slug || (dto.title ? dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : ''),
      title: dto.title || '',
      originalTitle: dto.original_title || dto.originalTitle || dto.title || '',
      overview: dto.overview || dto.synopsis || dto.description || '',
      releaseDate: dto.release_date || dto.releaseDate || new Date().toISOString().split('T')[0],
      originalLanguage: dto.original_language || dto.originalLanguage || 'vi',
      adult: Boolean(dto.adult),
      popularity: typeof dto.popularity === 'number' ? dto.popularity : (parseFloat(String(dto.popularity)) || 0),
      durationMinutes: durationNum,
      duration: `${durationNum} phút`,
      status,
      rawStatus: dto.status || 'now_showing',
      rawPosterPath: rawPoster,
      posterUrl: imageHelper.getPosterUrl(rawPoster, 'lg'),
      rawBackdropPath: rawBackdrop || undefined,
      backdropUrl: rawBackdrop ? imageHelper.getBackdropUrl(rawBackdrop, 'lg') : undefined,
      trailerUrl: trailerUrl || undefined,
      genreIds: genreIds.length > 0 ? genreIds : [1],
      genres: genres.length > 0 ? genres : [{ id: 1, name: 'Hành động' }],
      genre: genreNames.length > 0 ? genreNames : ['Hành động'],
      rating: Math.min(5, Math.max(0, ratingNum > 5 ? ratingNum / 2 : ratingNum)),
      formatBadge: 'IMAX 3D',
    };
  },

  creditToDomain(dto: MovieCreditItemDTO): AdminMovieCredit {
    const rawRole = (dto.role || 'ACTOR').toUpperCase();
    const role: 'DIRECTOR' | 'ACTOR' = rawRole.includes('DIRECT') ? 'DIRECTOR' : 'ACTOR';

    return {
      id: String(dto.id),
      movieId: dto.movie_id ? String(dto.movie_id) : undefined,
      name: dto.name,
      characterName: dto.character_name || dto.character,
      role,
      avatarUrl: dto.avatar_url || (dto.profile_path ? imageHelper.getProfileUrl(dto.profile_path, 'md') : undefined),
    };
  },

  fromTmdbToDomain(dto: TmdbSearchResultDTO): AdminMovieItem {
    const rawPoster = dto.poster_path || '';
    const rawBackdrop = dto.backdrop_path || '';

    const rating5 = dto.vote_average ? Number((dto.vote_average / 2).toFixed(1)) : 4.5;

    const genreNames = Array.isArray(dto.genres)
      ? dto.genres.map((g) => (typeof g === 'string' ? g : g.name || g.genre_name || ''))
      : ['Hành Động'];

    return {
      id: String(dto.id),
      slug: dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: dto.title,
      originalTitle: dto.original_title || dto.title,
      overview: dto.overview || '',
      releaseDate: dto.release_date || new Date().toISOString().split('T')[0],
      originalLanguage: 'en',
      adult: false,
      popularity: 0,
      durationMinutes: 120,
      duration: '120 phút',
      status: 'NOW_SHOWING',
      rawStatus: 'now_showing',
      rawPosterPath: rawPoster,
      posterUrl: imageHelper.getPosterUrl(rawPoster, 'lg'),
      rawBackdropPath: rawBackdrop || undefined,
      backdropUrl: rawBackdrop ? imageHelper.getBackdropUrl(rawBackdrop, 'lg') : undefined,
      trailerUrl: undefined,
      genreIds: [1],
      genres: [{ id: 1, name: 'Hành động' }],
      genre: genreNames.length > 0 ? genreNames : ['Hành động'],
      rating: rating5,
      formatBadge: 'IMAX 3D',
    };
  },
};
