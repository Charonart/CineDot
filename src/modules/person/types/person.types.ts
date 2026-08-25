export interface PersonMovieCredit {
  movieId: number | string;
  slug: string;
  title: string;
  posterUrl?: string;
  characterName?: string;
  job?: string;
  department?: string;
  order?: number;
}

export interface PersonDetail {
  id: number | string;
  tmdbPersonId?: number;
  name: string;
  originalName?: string;
  gender?: number;
  genderLabel?: string;
  avatarUrl?: string;
  adult?: boolean;
  popularity?: number;
  knownForDepartment?: string;
  bio?: string;
  birthday?: string;
  deathday?: string;
  placeOfBirth?: string;
  imdbId?: string;
  homepage?: string;
  castMovies: PersonMovieCredit[];
  crewMovies: PersonMovieCredit[];
}
