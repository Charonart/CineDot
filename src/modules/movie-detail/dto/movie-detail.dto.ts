import { GenreDTO, MovieDTO } from '@modules/movie/dto/movie.dto';

export interface CastMemberDTO {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  order: number;
}

export interface CrewMemberDTO {
  id: number;
  name: string;
  job: string;
  department: string;
  profileUrl: string | null;
}

export interface CreditsDTO {
  cast: CastMemberDTO[];
  crew: CrewMemberDTO[];
}

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

export interface MovieDetailDTO extends MovieDTO {
  tagline: string | null;
  status: string;
  originalLanguage: string;
  budget: number;
  revenue: number;
  genres: GenreDTO[];
}
