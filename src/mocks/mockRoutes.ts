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
  '/home/hero-slides': '/mocks/hero-slides.json',
  '/api/v1/home/hero-slides': '/mocks/hero-slides.json',
  // Star Shop
  '/cinemas/pricing': '/mocks/cinemas/pricing.json',
  '/api/v1/cinemas/pricing': '/mocks/cinemas/pricing.json',
  '/cinemas/showtimes': '/mocks/cinemas/showtimes.json',
  '/api/v1/cinemas/showtimes': '/mocks/cinemas/showtimes.json',

  // Laravel Sanctum CSRF Cookie
  '/sanctum/csrf-cookie': '/mocks/auth/csrf-cookie.json',

  // Current User Session
  // To test authenticated state, change '/mocks/auth/me-guest.json' to '/mocks/auth/me-authenticated.json' below:
  '/auth/me': '/mocks/auth/me-guest.json',
  '/api/v1/auth/me': '/mocks/auth/me-guest.json',

  // Login
  // To test validation/credentials errors, change '/mocks/auth/login-success.json' to '/mocks/auth/login-invalid.json' below:
  '/auth/login': '/mocks/auth/login-success.json',
  '/api/v1/auth/login': '/mocks/auth/login-success.json',

  // Register
  // To test email taken errors, change '/mocks/auth/register-success.json' to '/mocks/auth/register-validation-error.json' below:
  '/auth/register': '/mocks/auth/register-success.json',
  '/api/v1/auth/register': '/mocks/auth/register-success.json',

  // Logout
  '/auth/logout': '/mocks/auth/logout-success.json',
  '/api/v1/auth/logout': '/mocks/auth/logout-success.json',

  // Forgot Password
  '/auth/forgot-password': '/mocks/auth/forgot-password-success.json',
  '/api/v1/auth/forgot-password': '/mocks/auth/forgot-password-success.json',

  // Reset Password
  '/auth/reset-password': '/mocks/auth/reset-password-success.json',
  '/api/v1/auth/reset-password': '/mocks/auth/reset-password-success.json',

  // Resend Email Verification
  '/auth/email/verification-notification': '/mocks/auth/email-verification-sent.json',
  '/api/v1/auth/email/verification-notification': '/mocks/auth/email-verification-sent.json',

  // ── Profile ────────────────────────────────────────────────────────────────
  '/profile/me': '/mocks/profile/profile.json',
  '/api/v1/profile/me': '/mocks/profile/profile.json',
  '/profile/tickets': '/mocks/profile/ticket-history.json',
  '/api/v1/profile/tickets': '/mocks/profile/ticket-history.json',
  '/booking/selector/movies': '/mocks/movie-now-showing.json',
  '/api/v1/booking/selector/movies': '/mocks/movie-now-showing.json',
  '/booking/selector/showtimes': '/mocks/showtimes-by-movie.json',
  '/api/v1/booking/selector/showtimes': '/mocks/showtimes-by-movie.json',
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

  // ── Star Shop ──────────────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/star-shop\/products$/.test(path)) {
    const category = queryParams.get('category');
    if (category === 'movie-verse') return '/mocks/star-shop/products-movie-verse.json';
    if (category === 'fan-wibu') return '/mocks/star-shop/products-fan-wibu.json';
    if (category === 'inner-child') return '/mocks/star-shop/products-inner-child.json';
    return '/mocks/star-shop/products.json';
  }

  // ── Cinema Corner ──────────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/cinema-corner\/articles\/[^/]+$/.test(path)) {
    return '/mocks/cinema-corner/article-detail.json';
  }
  if (/^(\/api\/v1)?\/cinema-corner\/articles$/.test(path)) {
    const category = queryParams.get('category');
    if (category === 'reviews') return '/mocks/cinema-corner/articles.json';
    if (category === 'blog') return '/mocks/cinema-corner/articles.json';
    if (category === 'backstage') return '/mocks/cinema-corner/articles.json';
    return '/mocks/cinema-corner/articles.json';
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/events\/[^/]+$/.test(path)) {
    return '/mocks/events/event-detail.json';
  }
  if (/^(\/api\/v1)?\/events$/.test(path)) {
    return '/mocks/events/events.json';
  }

  // ── Cinemas ────────────────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/cinemas\/[^/]+$/.test(path)) {
    return '/mocks/cinemas/cinema-detail.json';
  }
  if (/^(\/api\/v1)?\/cinemas$/.test(path)) {
    return '/mocks/cinemas/cinemas.json';
  }

  // ── Special Theaters ───────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/special-theaters\/(imax|4dx|dolby-atmos|kids)$/.test(path)) {
    const typeMatch = path.match(/\/(imax|4dx|dolby-atmos|kids)$/);
    if (typeMatch) return `/mocks/special-theaters/${typeMatch[1]}.json`;
  }
  if (/^(\/api\/v1)?\/special-theaters$/.test(path)) {
    return '/mocks/special-theaters/imax.json'; // fallback to imax as landing
  }

  return null;
};
