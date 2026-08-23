/**
 * CineDot Backend API Endpoints Constants (V2 Specification)
 * Base URL: https://cinedot_be.test/api/v1
 */

export const ENDPOINTS = {
  // ── 1. Auth & Users ──
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    RESEND_VERIFICATION: '/auth/email/verification-notification',
    CSRF_COOKIE: '/auth/csrf-cookie',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    MY_BOOKINGS: '/users/bookings',
    FNB_ORDERS: '/users/fnb-orders',
    CHANGE_PASSWORD: '/users/change-password',
    TRANSACTIONS: '/users/transactions',
  },

  // ── 2. Master Data ──
  MASTER: {
    PROVINCES: '/provinces',
    BANNERS: '/banners',
    COMBOS: '/combos',
    PERSON: (id: number | string) => `/persons/${id}`,
    GENRES: '/genres',
    GENRE_MOVIES: (id: number | string) => `/genres/${id}/movies`,
  },

  // ── 3. Movies & Catalog ──
  MOVIES: {
    NAVBAR: '/movies/navbar',
    SEARCH: '/movies/search',
    TRENDING: '/movies/trending',
    POPULAR: '/movies/popular',
    LIST: '/movies',
    DETAIL_BY_SLUG: (slug: string) => `/movies/${slug}`,
    SHOWTIMES: (identifier: string | number) => `/movies/${identifier}/showtimes`,
    CREDITS: (id: number | string) => `/movies/${id}/credits`,
    SIMILAR: (id: number | string) => `/movies/${id}/similar`,
    VIDEOS: (id: number | string) => `/movies/${id}/videos`,
    REVIEWS: (id: number | string) => `/movies/${id}/reviews`,
    CREATE_REVIEW: (id: number | string) => `/movies/${id}/reviews`,
  },

  // ── 4. Cinemas, Rooms & Showtimes ──
  CINEMAS: {
    LIST: '/cinemas',
    PRICING: '/cinemas/pricing',
    DETAIL_BY_SLUG: (slug: string) => `/cinemas/detail/${slug}`,
    SHOWTIMES_BY_SLUG: (slug: string) => `/cinemas/detail/${slug}/showtimes`,
    SPECIAL_THEATERS: (type: string) => `/special-theaters/${type}`,
    ROOM_SEATS: (roomId: number | string) => `/rooms/${roomId}/seats`,
    ROOM_LAYOUT: (roomId: number | string) => `/rooms/${roomId}/layout`,
    SEAT_TYPES: '/seat-types',
  },
  SHOWTIMES: {
    LIST: '/showtimes',
    DETAIL: (id: number | string) => `/showtimes/${id}`,
    SEATS: (id: number | string) => `/showtimes/${id}/seats`,
    SEAT_STATUS: (id: number | string) => `/showtimes/${id}/seat-status`,
  },

  // ── 5. Booking & Pricing Engine ──
  BOOKINGS: {
    HOLD_SEATS: '/bookings/hold-seats',
    RELEASE_SEATS: '/bookings/release-seats',
    SELECTING_SEATS: '/bookings/selecting-seats',
    UNSELECT_SEATS: '/bookings/unselect-seats',
    CALCULATE_SUMMARY: '/bookings/calculate-summary',
    DETAIL: (id: number | string) => `/bookings/${id}`,
    APPLY_VOUCHER: (id: number | string) => `/bookings/${id}/apply-voucher`,
    REMOVE_VOUCHER: (id: number | string) => `/bookings/${id}/remove-voucher`,
    CANCEL: (id: number | string) => `/bookings/${id}/cancel`,
    HISTORY: '/bookings/history',
  },
  VOUCHERS: {
    LIST: '/vouchers',
    APPLY_STANDALONE: '/vouchers/apply',
  },

  // ── 6. Payments ──
  PAYMENTS: {
    PROCESS: '/payments',
    CREATE_URL: '/payments/create-url',
    VNPAY_RETURN: '/payments/vnpay/return',
    VNPAY_IPN: '/payments/vnpay/ipn',
  },

  // ── 7. Staff Operations ──
  STAFF: {
    CHECKIN_QR: '/staff/check-in',
    CHECKIN_CODE: (code: string) => `/staff/bookings/${code}/checkin`,
    CLAIM_FNB: '/staff/fnb/claim',
    POS_CREATE_ORDER: '/staff/pos/create-order',
  },

  // ── 8. Admin Management ──
  ADMIN: {
    MOVIES_SYNC: '/admin/movies/sync',
    MOVIES: '/admin/movies',
    MOVIES_BULK: '/admin/movies/bulk',
    MOVIE_DETAIL: (id: number | string) => `/admin/movies/${id}`,
    MOVIE_CELL: (id: number | string) => `/admin/movies/${id}/cell`,
    MOVIE_CREDITS: (movieId: number | string) => `/admin/movies/${movieId}/credits`,
    MOVIE_CREDIT_DELETE: (movieId: number | string, creditId: number | string) => `/admin/movies/${movieId}/credits/${creditId}`,
    
    CINEMAS: '/admin/cinemas',
    CINEMAS_BULK: '/admin/cinemas/bulk',
    CINEMA_DETAIL: (id: number | string) => `/admin/cinemas/${id}`,
    CINEMA_CELL: (id: number | string) => `/admin/cinemas/${id}/cell`,
    CINEMA_ROOMS: (cinemaId: number | string) => `/admin/cinemas/${cinemaId}/rooms`,
    ROOM_DETAIL: (roomId: number | string) => `/admin/rooms/${roomId}`,

    SHOWTIMES: '/admin/showtimes',
    SHOWTIME_DETAIL: (id: number | string) => `/admin/showtimes/${id}`,
    SHOWTIME_CLONE_DATE: '/admin/showtimes/clone-date',
    SHOWTIMES_QUICK_CREATE: '/admin/showtimes',
    SCHEDULES: '/admin/schedules',
    SCHEDULE_DETAIL: (id: number | string) => `/admin/schedules/${id}`,

    CAMPAIGNS: '/admin/campaigns',
    CAMPAIGNS_STATS: '/admin/campaigns/stats',
    CAMPAIGNS_BULK: '/admin/campaigns/bulk',
    CAMPAIGN_DETAIL: (id: number | string) => `/admin/campaigns/${id}`,
    CAMPAIGN_CELL: (id: number | string) => `/admin/campaigns/${id}/cell`,
    CAMPAIGN_TOGGLE: (id: number | string) => `/admin/campaigns/${id}/toggle-status`,
    CAMPAIGN_VOUCHERS: (id: number | string) => `/admin/campaigns/${id}/vouchers`,
    CAMPAIGN_BANNERS: (id: number | string) => `/admin/campaigns/${id}/banners`,
    CAMPAIGN_ROI: (id: number | string) => `/admin/campaigns/${id}/roi`,

    VOUCHERS: '/admin/vouchers',
    VOUCHERS_STATS: '/admin/vouchers/stats',
    VOUCHERS_BULK: '/admin/vouchers/bulk',
    VOUCHER_DETAIL: (id: number | string) => `/admin/vouchers/${id}`,
    VOUCHER_CELL: (id: number | string) => `/admin/vouchers/${id}/cell`,
    VOUCHER_TOGGLE: (id: number | string) => `/admin/vouchers/${id}/toggle-status`,

    BANNERS: '/admin/banners',
    BANNERS_BULK: '/admin/banners/bulk',
    BANNER_DETAIL: (id: number | string) => `/admin/banners/${id}`,
    BANNER_CELL: (id: number | string) => `/admin/banners/${id}/cell`,
    BANNER_TOGGLE: (id: number | string) => `/admin/banners/${id}/toggle-status`,

    COMBOS: '/admin/combos',
    COMBO_DETAIL: (id: number | string) => `/admin/combos/${id}`,

    PROVINCES: '/admin/provinces',
    GENRES: '/admin/genres',
    GENRE_DETAIL: (id: number | string) => `/admin/genres/${id}`,
    PERSONS: '/admin/persons',

    PRICING_RULES: '/admin/pricing-rules',
    PRICING_RULE_DETAIL: (id: number | string) => `/admin/pricing-rules/${id}`,
    PRICING_RULE_TOGGLE: (id: number | string) => `/admin/pricing-rules/${id}/toggle-active`,

    // Tickets Scanner
    TICKETS_LOOKUP: '/admin/tickets/lookup',
    TICKETS_SCAN: '/admin/tickets/scan',
    TICKETS_CHECK_IN: '/admin/tickets/check-in',
    TICKETS_CLAIM_FNB: '/admin/tickets/claim-fnb',
    TICKETS_RECENT_SCANS: '/admin/tickets/recent-scans',

    // Bookings & Transactions
    BOOKINGS: '/admin/bookings',
    BOOKINGS_STATS: '/admin/bookings/stats',
    BOOKINGS_BULK: '/admin/bookings/bulk',
    BOOKING_DETAIL: (id: number | string) => `/admin/bookings/${id}`,
    BOOKING_REFUND: (id: number | string) => `/admin/bookings/${id}/refund`,

    REVIEWS: '/admin/reviews',
    REVIEW_DELETE: (id: number | string) => `/admin/reviews/${id}`,

    USERS: '/admin/users',
    USERS_STATS: '/admin/users/stats',
    USERS_BULK: '/admin/users/bulk',
    USER_DETAIL: (id: number | string) => `/admin/users/${id}`,
    USER_CELL: (id: number | string) => `/admin/users/${id}/cell`,
    USER_UPDATE_ROLE: (id: number | string) => `/admin/users/${id}/role`,
    USER_TOGGLE_STATUS: (id: number | string) => `/admin/users/${id}/toggle-status`,
    USER_ADJUST_POINTS: (id: number | string) => `/admin/users/${id}/adjust-points`,
    USER_ROLES: (userId: number | string) => `/admin/users/${userId}/roles`,
    USER_ROLE_REVOKE: (userId: number | string, id: number | string) => `/admin/users/${userId}/roles/${id}`,
    
    ROLES: '/admin/roles',
    ROLE_DETAIL: (id: number | string) => `/admin/roles/${id}`,
    ROLE_PERMISSIONS: (id: number | string) => `/admin/roles/${id}/permissions`,
    PERMISSIONS: '/admin/permissions',

    USER_TIERS: '/admin/user-tiers',
    USER_TIER_DETAIL: (id: number | string) => `/admin/user-tiers/${id}`,

    REVENUE_REPORT: '/admin/reports/revenue',

    // Seat Types Management
    SEAT_TYPES: '/admin/seat-types',
    SEAT_TYPE_DETAIL: (id: string | number) => `/admin/seat-types/${id}`,
  },
};
