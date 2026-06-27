import { AdminMovieDTO, AdminMovieListResponseDTO } from '../dto/admin-movie.dto';
import { AdminMovieModel, AdminMovieListModel } from '../types/admin-movie.type';
import { appRoutes } from '@/shared/routes/appRoutes';

export const adminMovieMapper = {
  toModel: (dto: AdminMovieDTO): AdminMovieModel => {
    const slug = String(dto.id); // Simple fallback for admin
    return {
      id: dto.id,
      slug: slug,
      title: dto.title,
      originalTitle: dto.original_title,
      description: dto.overview || '',
      posterUrl: dto.poster_url,
      backdropUrl: dto.backdrop_url || null,
      releaseDate: dto.release_date,
      rating: dto.rating,
      voteCount: 0,
      genres: (dto.genres || []).map(g => ({ id: g.id, name: g.name })),
      runtime: dto.runtime,
      status: dto.status === 'stopped' ? 'stopped' : dto.status,
      ageRating: dto.age_rating,
      trailerUrl: dto.trailer_url,
      detailHref: appRoutes.movieDetail(slug),
      bookingHref: appRoutes.movieSchedule(slug),
    };
  },
  
  toModelList: (dto: AdminMovieListResponseDTO): AdminMovieListModel => ({
    items: (dto.results || []).map(adminMovieMapper.toModel),
    currentPage: dto.page || 1,
    totalPages: dto.total_pages || 1,
    totalItems: dto.total_results || 0,
    hasNext: dto.page < dto.total_pages,
  })
};
