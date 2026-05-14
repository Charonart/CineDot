export interface GenreDTO {
  id: number;
  name: string;
}

export interface MovieDTO {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genres: GenreDTO[];
  runtime?: number;
}

export interface MovieListResponseDTO {
  page: number;
  results: MovieDTO[];
  totalPages: number;
  totalResults: number;
}
