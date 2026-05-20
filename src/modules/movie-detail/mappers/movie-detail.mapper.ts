import {
  MovieDetailDTO,
  CastMemberDTO,
  CrewMemberDTO,
  VideoDTO,
  CreditsDTO,
  GenreItemDTO,
} from '../dto/movie-detail.dto';
import {
  MovieDetail,
  Credits,
  Video,
  CastMember,
  CrewMember,
  Genre,
} from '../types/movie-detail.type';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatRuntime = (minutes: number | null): string | null => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}m` : `${m}m`;
};

const mapGenre = (dto: GenreItemDTO): Genre => ({
  id: dto.genreId,
  name: dto.name,
});

// ─── Mapper ───────────────────────────────────────────────────────────────────

export const movieDetailMapper = {
  toMovieDetail: (dto: MovieDetailDTO): MovieDetail => ({
    id: dto.movieId,
    title: dto.title,
    originalTitle: dto.originalTitle,
    description: dto.overview,
    tagline: dto.tagline,
    posterUrl: dto.posterUrl,
    backdropUrl: dto.backdropUrl,
    releaseDate: dto.releaseDate,
    runtime: dto.runtime,
    status: dto.status,
    rating: dto.rating.average,
    voteCount: dto.rating.count,
    genres: (dto.genres ?? []).map(mapGenre),
    languages: dto.languages ?? [],
    countries: dto.countries ?? [],
    productionCompanies: (dto.productionCompanies ?? []).map((c) => ({
      id: c.companyId,
      name: c.name,
      logoUrl: c.logoUrl,
    })),
    collection: dto.collection
      ? { id: dto.collection.collectionId, name: dto.collection.name }
      : null,
    // Derived
    formattedRuntime: formatRuntime(dto.runtime),
    releaseYear: dto.releaseDate?.split('-')[0] ?? '—',
  }),

  toCastMember: (dto: CastMemberDTO): CastMember => ({
    id: dto.personId,
    name: dto.name,
    character: dto.role,
    profileUrl: dto.avatarUrl,
    order: dto.sortOrder,
  }),

  toCrewMember: (dto: CrewMemberDTO): CrewMember => ({
    id: dto.personId,
    name: dto.name,
    job: dto.job,
    department: dto.department,
    profileUrl: dto.avatarUrl,
  }),

  toCredits: (dto: CreditsDTO): Credits => ({
    cast: dto.cast
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(movieDetailMapper.toCastMember),
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
