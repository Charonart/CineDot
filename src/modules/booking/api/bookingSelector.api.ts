import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { BookingSelectorMovieDTO, BookingSelectorShowtimeDTO } from '../dto/bookingSelector.dto';

export const bookingSelectorApi = {
  getBookingSelectorMovies: (signal?: AbortSignal): Promise<ApiResponse<BookingSelectorMovieDTO[]>> =>
    axiosClient.get('/booking/selector/movies', { signal }),

  getBookingSelectorShowtimes: (
    movieId: string,
    date: string,
    signal?: AbortSignal
  ): Promise<ApiResponse<BookingSelectorShowtimeDTO[]>> =>
    axiosClient.get('/booking/selector/showtimes', {
      params: { movieId, date },
      signal,
    }),
};
