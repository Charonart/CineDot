/**
 * Movie Detail Domain Types
 * Contracts used directly by the Cinematic layouts.
 */

export interface Genre {
  id: number | string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface Collection {
  id: number;
  name: string;
}

// ─── Cinematic / Detailed Sub-types ──────────────────────────────────────────

export interface MovieRecommendation {
  id: string;
  title: string;
  poster: string;
  rating: number;
  ageRating: string;
}

export interface ShowtimeItem {
  time: string;
  status: 'past' | 'available' | 'almost-full' | 'locked' | 'sold-out';
  scheduleId: string;
}

export interface FormatItem {
  name: string;
  times: ShowtimeItem[];
}

export interface CinemaSchedule {
  name: string;
  formats: FormatItem[];
}

// ─── Movie Detail ─────────────────────────────────────────────────────────────

export interface MovieDetail {
  id: number | string;
  slug: string;
  title: string;
  originalTitle?: string;
  description: string;      // mapped from overview
  tagline: string | null;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  runtime: number | null;
  status: string;
  rating: number;           // rating.average or direct rating number
  voteCount: number;        // rating.count or direct voteCount number
  genres: Genre[];
  languages: Language[];
  countries: Country[];
  productionCompanies: ProductionCompany[];
  collection: Collection | null;
  
  // Cinematic additions
  country: string;
  producer: string;
  director: string;
  cast: string[];
  trailerUrl: string;
  recommendations: MovieRecommendation[];
  cinemas: CinemaSchedule[];

  // Derived display
  formattedRuntime: string | null;   // e.g. "2h 01m"
  releaseYear: string;               // e.g. "1977"
}

// ─── Credits ──────────────────────────────────────────────────────────────────

export interface CastMember {
  id: number;            // mapped from personId
  name: string;
  character: string;     // mapped from role
  profileUrl: string | null;   // mapped from avatarUrl
  order: number;         // mapped from sortOrder
}

export interface CrewMember {
  id: number;            // mapped from personId
  name: string;
  job: string;
  department: string;
  profileUrl: string | null;   // mapped from avatarUrl
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

// ─── Video ────────────────────────────────────────────────────────────────────

export interface Video {
  id: string;
  key: string;
  name: string;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
  site: 'YouTube' | 'Vimeo';
  official: boolean;
  thumbnailUrl: string;
}
