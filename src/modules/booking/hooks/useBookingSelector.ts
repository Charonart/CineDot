import { useQuery } from '@tanstack/react-query';
import { bookingSelectorService } from '../services/bookingSelector.service';

export const bookingSelectorKeys = {
  all: ['booking-selector'] as const,
  showtimes: (movieId: string, date: string) =>
    [...bookingSelectorKeys.all, 'showtimes', { movieId, date }] as const,
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
