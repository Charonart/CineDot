export const mockRoutes: Record<string, string> = {
  '/movies/trending': '/mocks/movies-trending.json',
  '/movies/popular': '/mocks/movies-popular.json',
  '/movies/search': '/mocks/movies-search.json',
  '/quick-booking/movies': '/mocks/quick-booking/movies.json',
  '/quick-booking/cinemas': '/mocks/quick-booking/cinemas.json',
  '/quick-booking/dates': '/mocks/quick-booking/dates.json',
  '/quick-booking/showtimes': '/mocks/quick-booking/showtimes.json',
  '/api/v1/quick-booking/movies': '/mocks/quick-booking/movies.json',
  '/api/v1/quick-booking/cinemas': '/mocks/quick-booking/cinemas.json',
  '/api/v1/quick-booking/dates': '/mocks/quick-booking/dates.json',
  '/api/v1/quick-booking/showtimes': '/mocks/quick-booking/showtimes.json',
};

export const getMockPath = (url: string): string | null => {
  const path = url.split('?')[0];

  if (mockRoutes[path]) return mockRoutes[path];

  // GET /movies/:id/showtimes?date=YYYY-MM-DD
  if (/^\/movies\/\d+\/showtimes$/.test(path)) {
    return '/mocks/showtimes-by-movie.json';
  }

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

  // GET /showtimes/:id/seats
  if (/^\/showtimes\/\d+\/seats$/.test(path)) {
    return '/mocks/showtime-seats.json';
  }

  return null;
};
