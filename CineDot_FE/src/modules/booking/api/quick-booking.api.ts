import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import {
  QuickBookingCinemaDTO,
  QuickBookingDateDTO,
  QuickBookingMovieDTO,
  QuickBookingShowtimeDTO,
} from '../dto/quick-booking.dto';

export const quickBookingApi = {
  getMovies: (signal?: AbortSignal): Promise<ApiResponse<QuickBookingMovieDTO[]>> =>
    axiosClient.get('/quick-booking/movies', { signal }),

  getCinemas: (movieId: string, signal?: AbortSignal): Promise<ApiResponse<QuickBookingCinemaDTO[]>> =>
    axiosClient.get('/quick-booking/cinemas', { params: { movieId }, signal }),

  getDates: (
    movieId: string,
    cinemaId: string,
    signal?: AbortSignal,
  ): Promise<ApiResponse<QuickBookingDateDTO[]>> =>
    axiosClient.get('/quick-booking/dates', { params: { movieId, cinemaId }, signal }),

  getShowtimes: (
    movieId: string,
    cinemaId: string,
    date: string,
    signal?: AbortSignal,
  ): Promise<ApiResponse<QuickBookingShowtimeDTO[]>> =>
    axiosClient.get('/quick-booking/showtimes', { params: { movieId, cinemaId, date }, signal }),
};
