/**
 * Movie Credits DTO (Actors & Directors)
 */

export interface MovieCreditItemDTO {
  id: string | number;
  movie_id?: string | number;
  name: string;
  character_name?: string;
  character?: string;
  role: 'DIRECTOR' | 'ACTOR' | 'PRODUCER' | 'director' | 'actor';
  avatar_url?: string;
  profile_path?: string;
}

export interface CreateMovieCreditDTO {
  name: string;
  character_name?: string;
  role: 'DIRECTOR' | 'ACTOR';
  avatar_url?: string;
}
