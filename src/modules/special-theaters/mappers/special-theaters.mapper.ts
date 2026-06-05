import { TheaterTypeDTO, CinemaRefDTO, MovieRefDTO } from '../dto/special-theaters.dto';
import { TheaterTypeData, CinemaRef, MovieRef } from '../types/special-theaters.type';
import { appRoutes } from '@/shared/routes/appRoutes';

export const specialTheatersMapper = {
  toCinemaRefModel: (dto: CinemaRefDTO): CinemaRef => ({
    ...dto,
    href: appRoutes.cinemaDetail(dto.slug),
  }),

  toMovieRefModel: (dto: MovieRefDTO): MovieRef => ({
    ...dto,
    bookingHref: appRoutes.movieSchedule(dto.slug),
  }),

  toTheaterTypeModel: (dto: TheaterTypeDTO): TheaterTypeData => ({
    type: dto.type,
    name: dto.name,
    tagline: dto.tagline,
    description: dto.description,
    heroImageUrl: dto.heroImageUrl,
    features: dto.features,
    technology: dto.technology,
    supportedCinemas: (dto.supportedCinemas || []).map(specialTheatersMapper.toCinemaRefModel),
    nowShowingMovies: (dto.nowShowingMovies || []).map(specialTheatersMapper.toMovieRefModel),
  }),
};
