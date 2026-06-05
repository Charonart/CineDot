export const appRoutes = {
  home: '/',
  movies: '/movies',
  movieDetail: (slug: string) => `/movies/detail/${slug}`,
  movieSchedule: (slug: string) => `/movies/detail/${slug}#schedule`,
  booking: (showtimeId: string) => `/booking/${showtimeId}`,

  // Star Shop
  starShop: '/star-shop',
  starShopCategory: (category: string) => `/star-shop/${category}`,

  // Góc Điện Ảnh
  cinemaCorner: '/cinema-corner',
  cinemaCornerCategory: (category: string) => `/cinema-corner/${category}`,
  cinemaArticle: (slug: string) => `/cinema-corner/articles/${slug}`,

  // Sự Kiện
  events: '/events',
  eventCategory: (category: string) => `/events/${category}`,
  eventDetail: (slug: string) => `/events/${slug}`,

  // Rạp / Giá Vé
  cinemas: '/cinemas',
  cinemaShowtimes: '/cinemas/showtimes',
  cinemaPricing: '/cinemas/pricing',
  cinemaDetail: (slug: string) => `/cinemas/${slug}`,

  // Rạp Đặc Biệt
  specialTheaters: '/special-theaters',
  specialTheaterType: (type: string) => `/special-theaters/${type}`,
};
