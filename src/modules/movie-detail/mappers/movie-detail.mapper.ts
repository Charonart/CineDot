import { MovieDetailDTO, CreditsDTO, VideoDTO, CastMemberDTO, CrewMemberDTO } from '../dto/movie-detail.dto';
import { MovieDetail, Credits, Video, CastMember, CrewMember } from '../types/movie-detail.type';
import { imageHelper } from '@shared/utils/imageHelper';

export const movieDetailMapper = {
  toMovieDetail: (dto: MovieDetailDTO): MovieDetail => ({
    id: dto.id,
    title: dto.title,
    description: dto.overview,
    posterUrl: imageHelper.getPosterUrl(dto.posterUrl, 'md'),
    backdropUrl: imageHelper.getBackdropUrl(dto.backdropUrl, 'lg'),
    releaseDate: dto.releaseDate,
    rating: dto.rating,
    voteCount: dto.voteCount,
    genres: dto.genres || [],
    runtime: dto.runtime,
    tagline: dto.tagline,
    status: dto.status,
    originalLanguage: dto.originalLanguage,
    budget: dto.budget,
    revenue: dto.revenue,
  }),

  toCastMember: (dto: CastMemberDTO): CastMember => ({
    id: dto.id,
    name: dto.name,
    character: dto.character,
    profileUrl: imageHelper.getProfileUrl(dto.profileUrl, 'md'),
    order: dto.order,
  }),

  toCrewMember: (dto: CrewMemberDTO): CrewMember => ({
    id: dto.id,
    name: dto.name,
    job: dto.job,
    department: dto.department,
    profileUrl: imageHelper.getProfileUrl(dto.profileUrl, 'md'),
  }),

  toCredits: (dto: CreditsDTO): Credits => ({
    cast: dto.cast.map(movieDetailMapper.toCastMember),
    crew: dto.crew.map(movieDetailMapper.toCrewMember),
  }),

  toVideo: (dto: VideoDTO): Video => ({
    id: dto.id,
    key: dto.key,
    name: dto.name,
    type: dto.type,
    site: dto.site,
    official: dto.official,
    thumbnailUrl: `https://img.youtube.com/vi/${dto.key}/hqdefault.jpg`,
  }),
};
