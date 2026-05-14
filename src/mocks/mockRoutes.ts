export const mockRoutes: Record<string, string> = {
  '/movies/trending': '/mocks/movies-trending.json',
  '/movies/popular': '/mocks/movies-popular.json',
  '/movies/1': '/mocks/movie-detail.json',
  '/movies/search': '/mocks/movies-search.json',
};

/**
 * Get mock path for a given URL
 */
export const getMockPath = (url: string): string | null => {
  // Direct match
  if (mockRoutes[url]) return mockRoutes[url];

  // Pattern match: /movies/123/credits
  if (url.match(/^\/movies\/\d+\/credits$/)) {
    return '/mocks/movie-credits.json';
  }

  // Pattern match: /movies/123/videos
  if (url.match(/^\/movies\/\d+\/videos$/)) {
    return '/mocks/movie-videos.json';
  }

  // Pattern match: /movies/123/similar
  if (url.match(/^\/movies\/\d+\/similar$/)) {
    return '/mocks/movie-similar.json';
  }

  // Pattern match for detail routes (e.g., /movies/123)
  if (url.match(/^\/movies\/\d+$/)) {
    return '/mocks/movie-detail.json';
  }

  return null;
};
