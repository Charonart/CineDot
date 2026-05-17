export const mockRoutes: Record<string, string> = {
  '/movies/trending': '/mocks/movies-trending.json',
  '/movies/popular':  '/mocks/movies-popular.json',
  '/movies/1':        '/mocks/movie-detail.json',
  '/movies/search':   '/mocks/movies-search.json',
  // Showtime — query params (movieId, cinemaId, date) bị ignore trong mock mode
  // Mock trả toàn bộ list; UI filter theo ngày đã được handle bởi mock JSON
  '/showtimes':       '/mocks/showtimes.json',
};

/**
 * Get mock path for a given URL.
 * Thứ tự pattern quan trọng: specific trước, general sau.
 */
export const getMockPath = (url: string): string | null => {
  // Strip query string trước khi match
  const path = url.split('?')[0];

  // Direct match (dùng path đã strip query string)
  if (mockRoutes[path]) return mockRoutes[path];

  // ─── Movie patterns ────────────────────────────────────────────────────────

  // Pattern match: /movies/123/credits
  if (path.match(/^\/movies\/\d+\/credits$/)) {
    return '/mocks/movie-credits.json';
  }

  // Pattern match: /movies/123/videos
  if (path.match(/^\/movies\/\d+\/videos$/)) {
    return '/mocks/movie-videos.json';
  }

  // Pattern match: /movies/123/similar
  if (path.match(/^\/movies\/\d+\/similar$/)) {
    return '/mocks/movie-similar.json';
  }

  // Pattern match for detail routes (e.g., /movies/123)
  if (path.match(/^\/movies\/\d+$/)) {
    return '/mocks/movie-detail.json';
  }

  // ─── Showtime patterns ─────────────────────────────────────────────────────

  // Pattern match: /showtimes/123/seats — phải đứng trước /showtimes/123
  if (path.match(/^\/showtimes\/\d+\/seats$/)) {
    return '/mocks/showtime-seats.json';
  }

  return null;
};
