export const appRoutes = {
  home: '/',
  movies: '/movies',
  movieDetail: (slug: string) => `/movies/detail/${slug}`,
  movieSchedule: (slug: string) => `/movies/detail/${slug}#schedule`,
  booking: (showtimeId: string) => `/booking/${showtimeId}`,
};
