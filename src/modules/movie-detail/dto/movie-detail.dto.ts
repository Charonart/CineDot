/**
 * Movie Detail DTOs
 * Khớp 100% với response từ mock `movie-detail.json` và backend Laravel.
 */

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface GenreItemDTO {
  genreId: number;
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
  logoUrl: string | null;
  countryCode: string;
}

export interface RatingDTO {
  average: number;
  count: number;
}

export interface CollectionDTO {
  collectionId: number;
  name: string;
  posterUrl: string | null;
  backdropUrl: string | null;
}

// ─── Movie Detail ─────────────────────────────────────────────────────────────

export interface MovieDetailDTO {
  movieId: number;
  title: string;
  originalTitle: string;
  overview: string;
  tagline: string | null;
  posterUrl: string;
  backdropUrl: string;
  tmdbPosterPath: string | null;
  tmdbBackdropPath: string | null;
  releaseDate: string;
  runtime: number | null;
  status: string;
  rating: RatingDTO;
  genres: GenreItemDTO[];
  languages: LanguageItemDTO[];
  countries: CountryItemDTO[];
  productionCompanies: ProductionCompanyDTO[];
  collection: CollectionDTO | null;
}

// ─── Credits ──────────────────────────────────────────────────────────────────

export interface CastMemberDTO {
  personId: number;
  name: string;
  originalName: string;
  role: string;            // character name
  avatarUrl: string | null;
  tmdbProfilePath?: string | null;
  sortOrder: number;
}

export interface CrewMemberDTO {
  personId: number;
  name: string;
  originalName: string;
  job: string;
  department: string;
  avatarUrl: string | null;
  tmdbProfilePath?: string | null;
}

export interface CreditsDTO {
  cast: CastMemberDTO[];
  crew: CrewMemberDTO[];
}

// ─── Video ────────────────────────────────────────────────────────────────────

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
