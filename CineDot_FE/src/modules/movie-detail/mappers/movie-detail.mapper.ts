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

const mapGenre = (dto: GenreItemDTO | string): Genre => {
  if (typeof dto === 'string') {
    return { id: dto, name: dto };
  }
  return {
    id: dto.id || dto.genreId || 0,
    name: dto.name,
  };
};

// ─── Mapper ───────────────────────────────────────────────────────────────────

export const movieDetailMapper = {
  toMovieDetail: (dto: MovieDetailDTO): MovieDetail => {
    const id = dto.id || dto.movieId || 0;
    const slug = dto.slug || String(id);
    const ratingVal = typeof dto.rating === 'number' ? dto.rating : dto.rating.average;
    const voteCountVal = dto.voteCount !== undefined ? dto.voteCount : (typeof dto.rating === 'number' ? 0 : dto.rating.count);

    return {
      id,
      slug,
      title: dto.title,
      originalTitle: dto.originalTitle,
      description: dto.overview,
      tagline: dto.tagline || null,
      posterUrl: dto.posterUrl,
      backdropUrl: dto.backdropUrl,
      releaseDate: dto.releaseDate,
      runtime: dto.runtime ?? null,
      status: dto.status,
      rating: ratingVal,
      voteCount: voteCountVal,
      genres: (dto.genres ?? []).map(mapGenre),
      languages: dto.languages ?? [],
      countries: dto.countries ?? [],
      productionCompanies: (dto.productionCompanies ?? []).map((c) => ({
        id: c.companyId,
        name: c.name,
        logoUrl: c.logoUrl ?? null,
      })),
      collection: dto.collection
        ? { id: dto.collection.collectionId, name: dto.collection.name }
        : null,
      
      // Cinematic Mapping
      country: dto.country || (dto.countries && dto.countries[0]?.name) || 'Mỹ',
      producer: dto.producer || (dto.productionCompanies && dto.productionCompanies[0]?.name) || '',
      director: dto.director || 'Denis Villeneuve',
      cast: dto.cast || [],
      trailerUrl: dto.trailerUrl || '',
      recommendations: (dto.recommendations || []).map((r) => ({
        id: r.id,
        title: r.title,
        poster: r.poster,
        rating: r.rating,
        ageRating: r.ageRating,
      })),
      cinemas: (dto.cinemas || []).map((c) => ({
        name: c.name,
        formats: (c.formats || []).map((f) => ({
          name: f.name,
          times: (f.times || []).map((t) => ({
            time: t.time,
            status: t.status,
            scheduleId: t.scheduleId,
          })),
        })),
      })),

      // Derived
      formattedRuntime: formatRuntime(dto.runtime ?? null),
      releaseYear: dto.releaseDate?.split('-')[0] ?? dto.releaseDate?.split('/')[2] ?? '—',
    };
  },

  toCastMember: (dto: CastMemberDTO): CastMember => ({
    id: dto.personId,
    name: dto.name,
    character: dto.role,
    profileUrl: dto.avatarUrl ?? null,
    order: dto.sortOrder,
  }),

  toCrewMember: (dto: CrewMemberDTO): CrewMember => ({
    id: dto.personId,
    name: dto.name,
    job: dto.job,
    department: dto.department,
    profileUrl: dto.avatarUrl ?? null,
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
