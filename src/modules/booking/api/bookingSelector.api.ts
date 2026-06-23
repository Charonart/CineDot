import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { BookingSelectorShowtimeDTO } from '../dto/bookingSelector.dto';

export const bookingSelectorApi = {
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
