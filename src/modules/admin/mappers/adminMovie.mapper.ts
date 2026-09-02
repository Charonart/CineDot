import { AdminMovieItemDTO, TmdbSearchResultDTO } from '../dto/adminMovie.dto';
import { MovieCreditItemDTO } from '../dto/adminCredit.dto';
import { AdminMovieItem, AdminMovieCredit, GenreItem, MovieStatus } from '../types/adminMovie.types';
import { imageHelper } from '@/shared/utils/imageHelper';
import { normalizeMovieStatus } from '@/shared/utils/movieStatusHelper';

export const adminMovieMapper = {
  toDomain(dto: AdminMovieItemDTO): AdminMovieItem {
    const status: MovieStatus = normalizeMovieStatus(dto.status);

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

    const ratingNum = typeof dto.vote_average === 'number'
      ? dto.vote_average
      : typeof dto.rating === 'number'
      ? dto.rating
      : parseFloat(String(dto.vote_average || dto.rating || '0')) || 0;

    const voteCount = Number(dto.vote_count ?? dto.voteCount ?? 0);
    const imdbId = dto.imdb_id || dto.imdbId || (dto.movie_id ? `tt${String(dto.movie_id).padStart(7, '0')}` : undefined);
    const imdbUrl = dto.imdb_url || dto.imdbUrl || (imdbId ? `https://www.imdb.com/title/${imdbId}` : undefined);

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
      adult: (dto.age_rating || dto.ageRating) === 'T18',
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
      rating: ratingNum,
      voteCount,
      imdbId,
      rawImdbId: imdbId,
      imdbUrl,
      formatBadge: 'IMAX 3D',
      ageRating: dto.age_rating || dto.ageRating || 'P',
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

    const voteAvg = dto.vote_average ? Number(dto.vote_average.toFixed(1)) : 0;
    const voteCount = Number(dto.vote_count ?? 0);
    const imdbId = dto.imdb_id || (dto.id ? `tt${String(dto.id).padStart(7, '0')}` : undefined);
    const imdbUrl = imdbId ? `https://www.imdb.com/title/${imdbId}` : undefined;

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
      ageRating: 'P',
      popularity: 0,
      durationMinutes: 120,
      duration: '120 phút',
      status: 'now_showing',
      rawStatus: 'now_showing',
      rawPosterPath: rawPoster,
      posterUrl: imageHelper.getPosterUrl(rawPoster, 'lg'),
      rawBackdropPath: rawBackdrop || undefined,
      backdropUrl: rawBackdrop ? imageHelper.getBackdropUrl(rawBackdrop, 'lg') : undefined,
      trailerUrl: undefined,
      genreIds: [1],
      genres: [{ id: 1, name: 'Hành động' }],
      genre: genreNames.length > 0 ? genreNames : ['Hành động'],
      rating: voteAvg,
      voteCount,
      imdbId,
      rawImdbId: imdbId,
      imdbUrl,
      formatBadge: 'IMAX 3D',
    };
  },
};
