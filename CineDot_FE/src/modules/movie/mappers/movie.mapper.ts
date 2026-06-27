import { MovieDTO, MovieListResponseDTO, HeroSlideDTO } from '../dto/movie.dto';
import { Movie, MovieList, HeroSlide } from '../types/movie.type';
import { appRoutes } from '@/shared/routes/appRoutes';

/**
 * Movie Mapper
 * Maps the Normalized Backend DTO to Frontend Domain Models.
 */
export const movieMapper = {
  toMovieModel: (dto: MovieDTO): Movie => {
    const slug = dto.slug || String(dto.id);
    return {
      id: dto.id,
      slug: dto.slug,
      title: dto.title,
      originalTitle: dto.originalTitle,
      description: dto.overview || '',
      posterUrl: dto.posterUrl,
      backdropUrl: dto.backdropUrl,
      releaseDate: dto.releaseDate,
      rating: dto.rating,
      voteCount: dto.voteCount,
      genres: (dto.genres || []).map(g => ({ id: g.id, name: g.name })),
      runtime: dto.runtime,
      formatTags: dto.formatTags || [],
      status: dto.status,
      ageRating: dto.ageRating || 'P',
      detailHref: appRoutes.movieDetail(slug),
      bookingHref: appRoutes.movieSchedule(slug),
    };
  },

  toMovieListModel: (dto: MovieListResponseDTO): MovieList => ({
    items: (dto.results || []).map(movieMapper.toMovieModel),
    currentPage: dto.page || 1,
    totalPages: dto.totalPages || 1,
    totalItems: dto.totalResults || 0,
    hasNext: (dto.page || 1) < (dto.totalPages || 1),
  }),
};

export const heroSlideMapper = {
  toHeroSlideModel: (dto: HeroSlideDTO): HeroSlide => {
    const slug = dto.slug || String(dto.id);
    return {
      id: dto.id,
      slug: slug,
      title: dto.title,
      subtitle: dto.subtitle,
      description: dto.description,
      backdropUrl: dto.backdropUrl,
      posterUrl: dto.posterUrl,
      runtime: dto.runtime,
      rating: dto.rating,
      ageRating: dto.ageRating || 'P',
      formatTags: dto.formatTags || [],
      trailerUrl: dto.trailerUrl,
      status: dto.status,
      detailHref: appRoutes.movieDetail(slug),
      bookingHref: appRoutes.movieSchedule(slug),
    };
  },

  toHeroSlideListModel: (dtos: HeroSlideDTO[]): HeroSlide[] =>
    (dtos || []).map(heroSlideMapper.toHeroSlideModel),
};