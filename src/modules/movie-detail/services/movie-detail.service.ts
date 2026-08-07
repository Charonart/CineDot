import { MovieDetail, CinemaShowtimeGroup } from '../types/movie-detail.types';
import {
  MOCK_MOVIE_DETAIL_SPIDERMAN,
  MOCK_MOVIE_DETAIL_COMING_SOON_MAP,
  MOCK_CINEMA_GROUPS,
} from '../mocks/mockMovieDetailData';

export async function fetchMovieDetail(slug: string): Promise<MovieDetail> {
  await new Promise((res) => setTimeout(res, 200));

  // Check if it's in coming soon map
  if (MOCK_MOVIE_DETAIL_COMING_SOON_MAP[slug]) {
    return MOCK_MOVIE_DETAIL_COMING_SOON_MAP[slug];
  }

  // Default to Spiderman detail (Now showing)
  return {
    ...MOCK_MOVIE_DETAIL_SPIDERMAN,
    slug: slug || 'spiderman-new-beginning',
  };
}

export async function fetchShowtimeSchedule(
  slug: string,
  dateStr?: string,
  cinemaId?: string
): Promise<CinemaShowtimeGroup[]> {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_CINEMA_GROUPS;
}
