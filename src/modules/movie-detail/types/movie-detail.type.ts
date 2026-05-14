import { Movie, Genre } from '@modules/movie/types/movie.type';

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profileUrl: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
  site: 'YouTube' | 'Vimeo';
  official: boolean;
  thumbnailUrl: string;
}

export interface MovieDetail extends Movie {
  tagline: string | null;
  status: string;
  originalLanguage: string;
  budget: number;
  revenue: number;
  genres: Genre[];
}
