export const mockRoutes: Record<string, string> = {
  // Laravel Sanctum CSRF Cookie
  '/sanctum/csrf-cookie': '/mocks/auth/csrf-cookie.json',

  // Current User Session
  '/auth/me': '/mocks/auth/me-guest.json',
  '/api/v1/auth/me': '/mocks/auth/me-guest.json',

  // Login
  '/auth/login': '/mocks/auth/login-success.json',
  '/api/v1/auth/login': '/mocks/auth/login-success.json',

  // Register
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

  // Cinema pricing
  '/cinemas/pricing': '/mocks/cinemas/pricing.json',
  '/api/v1/cinemas/pricing': '/mocks/cinemas/pricing.json',
};

export const getMockPath = (url: string): string | null => {
  const path = url.split('?')[0];
  const queryStr = url.split('?')[1] || '';
  const queryParams = new URLSearchParams(queryStr);

  if (mockRoutes[path]) return mockRoutes[path];

  // ─── Movies ────────────────────────────────────────────────────────────────
  // All movie listing requests route to the consolidated movies.json database
  if (/^(\/api\/v1)?\/movies$/.test(path)) {
    return '/mocks/movies.json';
  }
  if (/^(\/api\/v1)?\/movies\/(trending|popular|search|navbar)$/.test(path)) {
    return '/mocks/movies.json';
  }

  // GET /movies/detail/:slug or /movies/:slug (excluding reserved keywords)
  const detailMatch = path.match(/^(\/api\/v1)?\/movies\/(?:detail\/)?([^/]+)$/);
  if (detailMatch) {
    const slug = detailMatch[2];
    const reserved = ['trending', 'popular', 'search', 'navbar'];
    if (!reserved.includes(slug)) {
      if (slug === 'dune-part-two') {
        return '/mocks/movies/detail/dune-part-two.json';
      }
      if (slug === 'godzilla-x-kong') {
        return '/mocks/movies/detail/godzilla-x-kong.json';
      }
      if (slug === 'ghostbusters-frozen') {
        return '/mocks/movies/detail/ghostbusters-frozen.json';
      }
      // Default fallback detail mock
      return '/mocks/movies/detail/doraemon-underwater.json';
    }
  }

  // Sub-routes under a movie slug (credits, videos, similar)
  if (/^(\/api\/v1)?\/movies\/[^/]+\/credits$/.test(path)) {
    return '/mocks/movie-credits.json';
  }
  if (/^(\/api\/v1)?\/movies\/[^/]+\/videos$/.test(path)) {
    return '/mocks/movie-videos.json';
  }
  if (/^(\/api\/v1)?\/movies\/[^/]+\/similar$/.test(path)) {
    return '/mocks/movie-similar.json';
  }

  // ─── Showtimes / Booking ───────────────────────────────────────────────────
  // GET /showtimes and /api/v1/showtimes
  if (/^(\/api\/v1)?\/showtimes$/.test(path)) {
    return '/mocks/showtimes-by-movie.json';
  }

  // GET /showtimes/:showtimeId/seats
  if (/^(\/api\/v1)?\/showtimes\/([^/]+)\/seats$/.test(path)) {
    return '/mocks/booking/seat-map.json';
  }

  // GET /showtimes/:showtimeId
  if (/^(\/api\/v1)?\/showtimes\/([^/]+)$/.test(path)) {
    const showtimeId = detailMatch ? '' : path.split('/').pop();
    if (showtimeId === 'st_qb_closed') {
      return '/mocks/booking/showtime-detail-closed.json';
    }
    const reserved = ['trending', 'popular', 'search', 'navbar'];
    if (showtimeId && !reserved.includes(showtimeId)) {
      return '/mocks/booking/showtime-detail.json';
    }
  }

  // POST /seat-holds
  if (/^(\/api\/v1)?\/seat-holds$/.test(path)) {
    return '/mocks/booking/seat-hold-success.json';
  }

  // Legacy fallback for showtimes if needed
  if (/^\/movies\/[^/]+\/showtimes$/.test(path)) {
    return '/mocks/showtimes-by-movie.json';
  }

  // ─── Star Shop ──────────────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/star-shop\/products$/.test(path)) {
    return '/mocks/star-shop/products.json';
  }

  // ─── Cinema Corner ──────────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/cinema-corner\/articles\/[^/]+$/.test(path)) {
    return '/mocks/cinema-corner/article-detail.json';
  }
  if (/^(\/api\/v1)?\/cinema-corner\/articles$/.test(path)) {
    return '/mocks/cinema-corner/articles.json';
  }

  // ─── Events ─────────────────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/events\/[^/]+$/.test(path)) {
    return '/mocks/events/event-detail.json';
  }
  if (/^(\/api\/v1)?\/events$/.test(path)) {
    return '/mocks/events/events.json';
  }

  // ─── Cinemas ────────────────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/cinemas\/[^/]+$/.test(path)) {
    return '/mocks/cinemas/cinema-detail.json';
  }
  if (/^(\/api\/v1)?\/cinemas$/.test(path)) {
    return '/mocks/cinemas/cinemas.json';
  }

  // ─── Special Theaters ───────────────────────────────────────────────────────
  if (/^(\/api\/v1)?\/special-theaters\/(imax|4dx|dolby-atmos|kids)$/.test(path)) {
    const typeMatch = path.match(/\/(imax|4dx|dolby-atmos|kids)$/);
    if (typeMatch) return `/mocks/special-theaters/${typeMatch[1]}.json`;
  }
  if (/^(\/api\/v1)?\/special-theaters$/.test(path)) {
    return '/mocks/special-theaters/imax.json';
  }

  return null;
};
