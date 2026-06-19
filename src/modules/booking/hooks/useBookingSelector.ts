import { useQuery } from '@tanstack/react-query';
import { bookingSelectorService } from '../services/bookingSelector.service';

export const bookingSelectorKeys = {
  all: ['booking-selector'] as const,
  movies: () => [...bookingSelectorKeys.all, 'movies'] as const,
  showtimes: (movieId: string, date: string) =>
    [...bookingSelectorKeys.all, 'showtimes', { movieId, date }] as const,
};

export const useBookingSelectorMovies = () => {
  return useQuery({
    queryKey: bookingSelectorKeys.movies(),
    queryFn: ({ signal }) => bookingSelectorService.getBookingSelectorMovies(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes default
    gcTime: 30 * 60 * 1000,  // 30 minutes default
  });
};

export const useBookingSelectorShowtimes = (movieId: string, date: string) => {
  return useQuery({
    queryKey: bookingSelectorKeys.showtimes(movieId, date),
    queryFn: ({ signal }) =>
      bookingSelectorService.getBookingSelectorShowtimes(movieId, date, signal),
    enabled: !!movieId && !!date,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
