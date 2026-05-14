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
  
  // Pattern match for detail routes (e.g., /movies/123)
  if (url.match(/^\/movies\/\d+$/)) {
    return '/mocks/movie-detail.json';
  }
  
  return null;
};
