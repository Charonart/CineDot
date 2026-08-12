import { MovieListingItem, MovieListingTab } from '../types/movies-listing.types';
import { MOCK_MOVIES_LISTING } from '../mocks/mockMoviesListingData';

export async function fetchMoviesListing(
  tab: MovieListingTab,
  searchQuery: string = ''
): Promise<MovieListingItem[]> {
  await new Promise((res) => setTimeout(res, 200));

  const targetStatus = tab === 'now-showing' ? 'NOW_SHOWING' : 'COMING_SOON';
  let filtered = MOCK_MOVIES_LISTING.filter((m) => m.status === targetStatus);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(q))
    );
  }

  return filtered;
}
