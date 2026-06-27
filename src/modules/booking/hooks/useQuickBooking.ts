import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useMoviesList } from '@/modules/movie/hooks/useMovies';
import { quickBookingMapper } from '../mappers/quick-booking.mapper';
import { quickBookingService } from '../services/quick-booking.service';
import { QuickBookingDropdown } from '../types/quick-booking.type';

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 30 * 60 * 1000;

export const quickBookingKeys = {
  all: ['quick-booking'] as const,
  cinemas: (movieId: string) => [...quickBookingKeys.all, 'cinemas', { movieId }] as const,
  dates: (movieId: string, cinemaId: string) =>
    [...quickBookingKeys.all, 'dates', { movieId, cinemaId }] as const,
  showtimes: (movieId: string, cinemaId: string, date: string) =>
    [...quickBookingKeys.all, 'showtimes', { movieId, cinemaId, date }] as const,
};

export const useQuickBooking = () => {
  const router = useRouter();
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedCinemaId, setSelectedCinemaId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState('');
  const [openDropdown, setOpenDropdown] = useState<QuickBookingDropdown | null>(null);

  const { data: moviesListData, isLoading: isMoviesLoading, isError: hasMoviesError } = useMoviesList({ status: 'now-showing' });
  const movies = moviesListData?.items || [];

  const cinemasQuery = useQuery({
    queryKey: quickBookingKeys.cinemas(selectedMovieId),
    queryFn: ({ signal }) => quickBookingService.getCinemas(selectedMovieId, signal),
    enabled: !!selectedMovieId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  const datesQuery = useQuery({
    queryKey: quickBookingKeys.dates(selectedMovieId, selectedCinemaId),
    queryFn: ({ signal }) => quickBookingService.getDates(selectedMovieId, selectedCinemaId, signal),
    enabled: !!selectedMovieId && !!selectedCinemaId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  const showtimesQuery = useQuery({
    queryKey: quickBookingKeys.showtimes(selectedMovieId, selectedCinemaId, selectedDate),
    queryFn: ({ signal }) =>
      quickBookingService.getShowtimes(selectedMovieId, selectedCinemaId, selectedDate, signal),
    enabled: !!selectedMovieId && !!selectedCinemaId && !!selectedDate,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  const movieOptions = useMemo(
    () => quickBookingMapper.toMovieOptions(
      movies.filter((movie) => movie.status === 'now-showing'),
    ),
    [movies],
  );

  const cinemaOptions = useMemo(
    () => quickBookingMapper.toCinemaOptions(cinemasQuery.data ?? []),
    [cinemasQuery.data],
  );

  const dateOptions = useMemo(
    () => quickBookingMapper.toDateOptions(datesQuery.data ?? []),
    [datesQuery.data],
  );

  const showtimeOptions = useMemo(
    () => quickBookingMapper.toShowtimeOptions(showtimesQuery.data ?? []),
    [showtimesQuery.data],
  );

  const handleMovieSelect = (value: string) => {
    setSelectedMovieId(value);
    setSelectedCinemaId('');
    setSelectedDate('');
    setSelectedShowtimeId('');
    setOpenDropdown('cinema');
  };

  const handleCinemaSelect = (value: string) => {
    setSelectedCinemaId(value);
    setSelectedDate('');
    setSelectedShowtimeId('');
    setOpenDropdown('date');
  };

  const handleDateSelect = (value: string) => {
    setSelectedDate(value);
    setSelectedShowtimeId('');
    setOpenDropdown('showtime');
  };

  const handleShowtimeSelect = (value: string) => {
    setSelectedShowtimeId(value);
    setOpenDropdown(null);
  };

  const handleToggleDropdown = (field: QuickBookingDropdown) => {
    setOpenDropdown((current) => (current === field ? null : field));
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedShowtimeId) return;
    router.push(`/booking/${selectedShowtimeId}`);
  };

  return {
    selectedMovieId,
    selectedCinemaId,
    selectedDate,
    selectedShowtimeId,
    openDropdown,
    movieOptions,
    cinemaOptions,
    dateOptions,
    showtimeOptions,
    isMoviesLoading,
    isCinemasLoading: cinemasQuery.isLoading,
    isDatesLoading: datesQuery.isLoading,
    isShowtimesLoading: showtimesQuery.isLoading,
    hasMoviesError,
    hasCinemasError: cinemasQuery.isError,
    hasDatesError: datesQuery.isError,
    hasShowtimesError: showtimesQuery.isError,
    handleMovieSelect,
    handleCinemaSelect,
    handleDateSelect,
    handleShowtimeSelect,
    handleToggleDropdown,
    handleCloseDropdown,
    handleSubmit,
  };
};
