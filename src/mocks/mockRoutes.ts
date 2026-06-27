/**
 * mockRoutes.ts — Path → Mock JSON file mapping
 *
 * ⚠️  MOCK METHOD OVERRIDE NOTE:
 * axiosClient (src/lib/axios/axiosClient.ts) interceptor overrides ALL HTTP methods
 * to GET when NEXT_PUBLIC_USE_MOCK=true. This means PUT, POST, PATCH, DELETE requests
 * are all redirected to the corresponding JSON file as GET requests.
 *
 * Example: `PUT /profile/me` is served by `/mocks/profile/profile.json` — no separate
 * route is needed for mutating methods, as the path key is sufficient.
 *
 * Mock files should reflect the expected SUCCESS response shape.
 * To simulate errors, temporarily point to an error-fixture JSON file.
 */
export const mockRoutes: Record<string, string> = {
  // Laravel Sanctum CSRF Cookie
  '/sanctum/csrf-cookie': '/mocks/auth/csrf-cookie.json',

  // Current User Session
  // Switch role by changing mock file:
  //   Customer : '/mocks/auth/me-authenticated.json'  (roles: ["customer"])
  //   Admin    : '/mocks/auth/me-admin.json'           (roles: ["admin"])
  //   Guest    : '/mocks/auth/me-guest.json'           (unauthenticated)
  '/auth/me': '/mocks/auth/me-authenticated.json',
  '/api/v1/auth/me': '/mocks/auth/me-authenticated.json',

  // Login
  // Switch login role by changing mock file:
  //   Customer : '/mocks/auth/login-success.json'
  //   Admin    : '/mocks/auth/login-success-admin.json'
  //   Error    : '/mocks/auth/login-invalid.json'
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

  // Cinema pricing (internal / non-Postman)
  '/cinemas/pricing': '/mocks/cinemas/pricing.json',
  '/api/v1/cinemas/pricing': '/mocks/cinemas/pricing.json',
  '/cinemas/showtimes': '/mocks/cinemas/showtimes.json',
  '/api/v1/cinemas/showtimes': '/mocks/cinemas/showtimes.json',

  // ── Profile ────────────────────────────────────────────────────────────────
  '/api/v1/users/profile': '/mocks/profile/profile.json',

  // ── User Bookings History — GET /api/v1/users/bookings ─────────────────────
  // (Trước đây là /profile/tickets — đã fix theo Postman spec)
  '/api/v1/users/bookings': '/mocks/profile/user-bookings.json',
  // Giữ lại route cũ để backward compat trong local mock mode
  '/profile/tickets': '/mocks/profile/ticket-history.json',
  '/api/v1/profile/tickets': '/mocks/profile/ticket-history.json',

  // ── Booking selector (internal) ─────────────────────────────────────────────
  '/booking/selector/showtimes': '/mocks/showtimes-by-movie.json',
  '/api/v1/booking/selector/showtimes': '/mocks/showtimes-by-movie.json',

  // ── Master Data ─────────────────────────────────────────────────────────────
  '/api/v1/provinces': '/mocks/master-data/provinces.json',
  '/api/v1/combos': '/mocks/master-data/combos.json',

  // ── Watchlist & Ratings Mocks ───────────────────────────────────────────────
  '/movies/watchlist': '/mocks/movies/watchlist-add.json',
  '/api/v1/movies/watchlist': '/mocks/movies/watchlist-add.json',

  // ── VNPay Return Callback ───────────────────────────────────────────────────
  '/api/v1/payments/vnpay/return': '/mocks/booking/vnpay-return.json',
};

export const getMockPath = (url: string): string | null => {
  const path = url.split('?')[0];

  if (mockRoutes[path]) return mockRoutes[path];

  // ─── Movies ────────────────────────────────────────────────────────────────
  // All movie listing requests route to the consolidated movies.json database
  if (/^(\/api\/v1)?\/movies$/.test(path)) {
    return '/mocks/movies.json';
  }
  if (/^(\/api\/v1)?\/movies\/(trending|popular|search|navbar)$/.test(path)) {
    return '/mocks/movies.json';
  }

  // ⚠️ Sub-routes under a movie id/slug (credits, videos, similar, reviews)
  // MUST come BEFORE the detail slug matcher below to avoid false positives.
  if (/^(\/api\/v1)?\/movies\/[^/]+\/credits$/.test(path)) {
    return '/mocks/movie-credits.json';
  }
  if (/^(\/api\/v1)?\/movies\/[^/]+\/videos$/.test(path)) {
    return '/mocks/movie-videos.json';
  }
  if (/^(\/api\/v1)?\/movies\/[^/]+\/similar$/.test(path)) {
    return '/mocks/movie-similar.json';
  }
  // GET /api/v1/movies/:id/reviews
  if (/^(\/api\/v1)?\/movies\/[^/]+\/reviews$/.test(path)) {
    return '/mocks/movies/movie-reviews.json';
  }

  // Watchlist & Rating Actions
  // GET /movies/:id/watchlist
  if (/^(\/api\/v1)?\/movies\/[^/]+\/watchlist$/.test(path)) {
    return '/mocks/movies/watchlist-status.json';
  }
  // GET /movies/:id/ratings/me
  if (/^(\/api\/v1)?\/movies\/[^/]+\/ratings\/me$/.test(path)) {
    return '/mocks/movies/rating-me.json';
  }
  // POST or DELETE /movies/:id/ratings
  if (/^(\/api\/v1)?\/movies\/[^/]+\/ratings$/.test(path)) {
    // Note: Since all mutating methods are overridden to GET for mock file requests:
    // We map to specific mock depending on endpoint.
    return '/mocks/movies/rating-submit.json';
  }

  // GET /movies/detail/:slug or /movies/:slug (excluding reserved keywords)
  // NOTE: This must come AFTER all sub-route checks above.
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

  // ─── Showtimes / Booking ───────────────────────────────────────────────────
  // GET /showtimes and /api/v1/showtimes
  if (/^(\/api\/v1)?\/showtimes$/.test(path)) {
    return '/mocks/showtimes-by-movie.json';
  }

  // GET /showtimes/:showtimeId/seats
  if (/\/showtimes\/([^/]+)\/seats/.test(path)) {
    return '/mocks/booking/seat-map.json';
  }

  // GET /showtimes/:showtimeId
  const showtimeDetailMatch = path.match(/\/showtimes\/([^/]+)/);
  if (showtimeDetailMatch) {
    const showtimeId = showtimeDetailMatch[1];
    if (showtimeId === 'st_qb_closed') {
      return '/mocks/booking/showtime-detail-closed.json';
    }
    // Prevent matching standard routes like /showtimes as dynamic IDs
    const reserved = ['trending', 'popular', 'search', 'navbar'];
    if (showtimeId && !reserved.includes(showtimeId)) {
      return '/mocks/booking/showtime-detail.json';
    }
  }

  // POST /seat-holds (legacy)
  if (/^(\/api\/v1)?\/seat-holds$/.test(path)) {
    return '/mocks/booking/seat-hold-success.json';
  }

  // POST /bookings/hold-seats
  if (/^(\/api\/v1)?\/bookings\/hold-seats$/.test(path)) {
    return '/mocks/booking/seat-hold-success.json';
  }

  // POST /bookings/:id/apply-voucher
  if (/^(\/api\/v1)?\/bookings\/\d+\/apply-voucher$/.test(path)) {
    return '/mocks/booking/apply-voucher-success.json';
  }

  // POST /bookings/:id/remove-voucher
  if (/^(\/api\/v1)?\/bookings\/\d+\/remove-voucher$/.test(path)) {
    return '/mocks/booking/apply-voucher-success.json'; // same structure: {success, message}
  }

  // POST /payments
  if (/^(\/api\/v1)?\/payments$/.test(path)) {
    return '/mocks/booking/payment-success.json';
  }

  // GET /api/v1/payments/vnpay/ipn (backend webhook — serve mock for dev)
  if (/^\/api\/v1\/payments\/vnpay\/ipn$/.test(path)) {
    return '/mocks/booking/vnpay-return.json';
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
  // GET /api/v1/rooms/:id/seats — sơ đồ ghế cơ bản của phòng chiếu
  if (/^(\/api\/v1)?\/rooms\/[^/]+\/seats$/.test(path)) {
    return '/mocks/cinemas/room-seats.json';
  }
  if (/^(\/api\/v1)?\/cinemas\/[^/]+\/rooms$/.test(path)) {
    return '/mocks/cinemas/cinemas.json'; // fallback: trả về cinemas list
  }
  if (/^(\/api\/v1)?\/cinemas\/[^/]+$/.test(path)) {
    return '/mocks/cinemas/cinema-detail.json';
  }
  if (/^(\/api\/v1)?\/cinemas$/.test(path)) {
    return '/mocks/cinemas/cinemas.json';
  }

  // ─── Master Data — Dynamic routes ───────────────────────────────────────────
  // GET /api/v1/persons/:id
  if (/^\/api\/v1\/persons\/[^/]+$/.test(path)) {
    return '/mocks/master-data/person-detail.json';
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
