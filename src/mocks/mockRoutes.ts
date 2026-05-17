export const mockRoutes: Record<string, string> = {
  '/movies/trending': '/mocks/movies-trending.json',
  '/movies/popular': '/mocks/movies-popular.json',
  '/movies/search': '/mocks/movies-search.json',
  '/showtimes': '/mocks/showtimes.json',
};

export const getMockPath = (url: string): string | null => {
  const path = url.split('?')[0];

  if (mockRoutes[path]) return mockRoutes[path];

  if (/^\/movies\/\d+\/credits$/.test(path)) {
    return '/mocks/movie-credits.json';
  }

  if (/^\/movies\/\d+\/videos$/.test(path)) {
    return '/mocks/movie-videos.json';
  }

  if (/^\/movies\/\d+\/similar$/.test(path)) {
    return '/mocks/movie-similar.json';
  }

  if (/^\/movies\/\d+$/.test(path)) {
    return '/mocks/movie-detail.json';
  }

  if (/^\/showtimes\/\d+\/seats$/.test(path)) {
    return '/mocks/showtime-seats.json';
  }

  return null;
};