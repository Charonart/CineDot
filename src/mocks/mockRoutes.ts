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
  '/movies/navbar': '/mocks/movies-navbar.json',
  '/api/v1/movies/navbar': '/mocks/movies-navbar.json',
};

export const getMockPath = (url: string): string | null => {
  const path = url.split('?')[0];
  const queryStr = url.split('?')[1] || '';
  const queryParams = new URLSearchParams(queryStr);

  if (mockRoutes[path]) return mockRoutes[path];

  // GET /movies and /api/v1/movies categorization
  if (/^(\/api\/v1)?\/movies$/.test(path)) {
    const category = queryParams.get('category');
    if (category === 'now-showing') {
      return '/mocks/movie-now-showing.json';
    }
    if (category === 'coming-soon') {
      return '/mocks/movie-coming-soon.json';
    }
    if (category === 'imax') {
      return '/mocks/movie-imax.json';
    }
    if (category === 'nationwide') {
      return '/mocks/movie-nationwide.json';
    }
    return '/mocks/movie-now-showing.json'; // fallback
  }

  // GET /movies/detail/:slug
  const detailMatch = path.match(/^(\/api\/v1)?\/movies\/detail\/([^/]+)$/);
  if (detailMatch) {
    const slug = detailMatch[2];
    if (slug === 'dune-part-two') {
      return '/mocks/movies/detail/dune-part-two.json';
    }
    if (slug === 'godzilla-x-kong') {
      return '/mocks/movies/detail/godzilla-x-kong.json';
    }
    if (slug === 'ghostbusters-frozen') {
      return '/mocks/movies/detail/ghostbusters-frozen.json';
    }
    // Fallback default detail mock
    return '/mocks/movies/detail/doraemon-underwater.json';
  }

  if (/^(\/api\/v1)?\/booking\/showtimes\/st_qb_closed$/.test(path)) {
    return '/mocks/booking/showtime-detail-closed.json';
  }

  if (/^(\/api\/v1)?\/booking\/showtimes\/[^/]+\/seats$/.test(path)) {
    return '/mocks/booking/seat-map.json';
  }

  if (/^(\/api\/v1)?\/booking\/showtimes\/[^/]+$/.test(path)) {
    return '/mocks/booking/showtime-detail.json';
  }

  if (/^(\/api\/v1)?\/booking\/seat-holds$/.test(path)) {
    return '/mocks/booking/seat-hold-success.json';
  }

  // GET /movies/:id/showtimes?date=YYYY-MM-DD
  if (/^\/movies\/[^/]+\/showtimes$/.test(path)) {
    return '/mocks/showtimes-by-movie.json';
  }

  if (/^\/movies\/[^/]+\/credits$/.test(path)) {
    return '/mocks/movie-credits.json';
  }

  if (/^\/movies\/[^/]+\/videos$/.test(path)) {
    return '/mocks/movie-videos.json';
  }

  if (/^\/movies\/[^/]+\/similar$/.test(path)) {
    return '/mocks/movie-similar.json';
  }

  if (/^\/movies\/[^/]+$/.test(path)) {
    return '/mocks/movie-detail.json';
  }

  // GET /showtimes/:id/seats
  if (/^\/showtimes\/[^/]+\/seats$/.test(path)) {
    return '/mocks/showtime-seats.json';
  }

  return null;
};
