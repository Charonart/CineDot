import { AdminGenreItemDTO, GenreMovieDetailDTO } from '../dto/adminGenre.dto';
import { AdminGenreItem, GenreMovieItem } from '../types/adminGenre.types';
import { imageHelper } from '@/shared/utils/imageHelper';

export const adminGenreMapper = {
  toDomain(dto: AdminGenreItemDTO): AdminGenreItem {
    const moviesCount = Number(dto.movies_count ?? dto.moviesCount ?? 0);

    return {
      id: Number(dto.id),
      name: dto.genre_name || dto.name || 'Thể loại',
      moviesCount,
    };
  },

  movieToDomain(dto: GenreMovieDetailDTO): GenreMovieItem {
    const rawPoster = dto.poster_path || '';
    const rawBackdrop = dto.backdrop_path || '';
    const ratingNum = typeof dto.rating === 'number'
      ? dto.rating
      : typeof dto.vote_average === 'number'
        ? Number((dto.vote_average / 2).toFixed(1))
        : 4.5;

    const durationNum = typeof dto.duration === 'number'
      ? dto.duration
      : parseInt(String(dto.duration || '120'), 10) || 120;

    return {
      id: String(dto.movie_id || dto.id || ''),
      title: dto.title,
      originalTitle: dto.original_title || dto.title,
      posterUrl: imageHelper.getPosterUrl(rawPoster, 'md'),
      backdropUrl: rawBackdrop ? imageHelper.getBackdropUrl(rawBackdrop, 'lg') : undefined,
      releaseDate: dto.release_date || 'Chưa công bố',
      duration: `${durationNum} phút`,
      status: dto.status || 'now_showing',
      rating: ratingNum,
    };
  },
};
