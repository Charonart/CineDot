/**
 * Movie Detail DTOs
 * Supports both legacy TMDB mapping and premium Cinematic detailed endpoints.
 */

export interface GenreItemDTO {
  genreId?: number;
  id?: number | string;
  name: string;
}

export interface LanguageItemDTO {
  code: string;
  name: string;
}

export interface CountryItemDTO {
  code: string;
  name: string;
}

export interface ProductionCompanyDTO {
  companyId: number;
  name: string;
  logoUrl?: string | null;
  countryCode: string;
}

export interface RatingDTO {
  average: number;
  count: number;
}

export interface CollectionDTO {
  collectionId: number;
  name: string;
  posterUrl?: string | null;
  backdropUrl?: string | null;
}

// ─── Cinematic / Detailed Sub-types ──────────────────────────────────────────

export interface MovieRecommendationDTO {
  id: string;
  title: string;
  poster: string;
  rating: number;
  ageRating: string;
}

export interface ShowtimeItemDTO {
  time: string;
  status: 'past' | 'available' | 'almost-full' | 'locked' | 'sold-out';
  scheduleId: string;
}

export interface FormatItemDTO {
  name: string;
  times: ShowtimeItemDTO[];
}

export interface CinemaScheduleDTO {
  name: string;
  formats: FormatItemDTO[];
}

// ─── Cast & Crew DTOs ─────────────────────────────────────────────────────────

export interface CastMemberDTO {
  personId: number;
  name: string;
  originalName: string;
  role: string;
  avatarUrl?: string | null;
  tmdbProfilePath?: string | null;
  sortOrder: number;
}

export interface CrewMemberDTO {
  personId: number;
  name: string;
  originalName: string;
  job: string;
  department: string;
  avatarUrl?: string | null;
  tmdbProfilePath?: string | null;
}

export interface CreditsDTO {
  cast: CastMemberDTO[];
  crew: CrewMemberDTO[];
}

// ─── Video DTO ────────────────────────────────────────────────────────────────

export interface VideoDTO {
  id: string;
  key: string;
  name: string;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
  site: 'YouTube' | 'Vimeo';
  official: boolean;
}

export interface VideoListDTO {
  results: VideoDTO[];
}

// ─── Movie Detail DTO ─────────────────────────────────────────────────────────

export interface MovieDetailDTO {
  movieId?: number; // legacy
  id?: string | number; // cinematic
  slug?: string;
  title: string;
  originalTitle?: string;
  overview: string;
  tagline?: string | null;
  posterUrl: string;
  backdropUrl: string;
  tmdbPosterPath?: string | null;
  tmdbBackdropPath?: string | null;
  releaseDate: string;
  runtime?: number | null;
  status: string;
  rating: RatingDTO | number; // supports object rating or number rating
  voteCount?: number;
  genres: (GenreItemDTO | string)[];
  languages?: LanguageItemDTO[];
  countries?: CountryItemDTO[];
  productionCompanies?: ProductionCompanyDTO[];
  collection?: CollectionDTO | null;

  // Cinematic Additions
  country?: string;
  producer?: string;
  director?: string;
  cast?: string[];
  trailerUrl?: string;
  recommendations?: MovieRecommendationDTO[];
  cinemas?: CinemaScheduleDTO[];
}
