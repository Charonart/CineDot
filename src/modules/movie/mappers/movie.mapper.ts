import { MovieDTO, MovieListResponseDTO } from '../dto/movie.dto';
import { Movie, MovieList } from '../types/movie.type';

/**
 * Movie Mapper
 * Maps the Normalized Backend DTO to Frontend Domain Models.
 */
export const movieMapper = {
  toMovieModel: (dto: MovieDTO): Movie => ({
    id: dto.id,
    title: dto.title,
    description: dto.overview,
    posterUrl: dto.posterUrl,
    backdropUrl: dto.backdropUrl,
    releaseDate: dto.releaseDate,
    rating: dto.rating,
    voteCount: dto.voteCount,
    genres: dto.genres || [],
    runtime: dto.runtime,
  }),

  toMovieListModel: (dto: MovieListResponseDTO): MovieList => ({
    items: dto.results.map(movieMapper.toMovieModel),
    currentPage: dto.page,
    totalPages: dto.totalPages,
    totalItems: dto.totalResults,
    hasNext: dto.page < dto.totalPages,
  }),
};
