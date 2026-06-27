import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { BookingShowtimeDTO, SeatHoldDTO, SeatHoldRequestDTO, SeatMapDTO } from '../dto/booking.dto';

const encodePathSegment = (value: string) => encodeURIComponent(value);

export const bookingApi = {
  getShowtimeDetail: (showtimeId: string, signal?: AbortSignal): Promise<ApiResponse<BookingShowtimeDTO>> =>
    axiosClient.get(`/showtimes/${encodePathSegment(showtimeId)}`, { signal }),

  getSeatMap: (showtimeId: string, signal?: AbortSignal): Promise<ApiResponse<SeatMapDTO>> =>
    axiosClient.get(`/showtimes/${encodePathSegment(showtimeId)}/seats`, { signal }),

  createSeatHold: (payload: SeatHoldRequestDTO): Promise<ApiResponse<SeatHoldDTO>> =>
    axiosClient.post('/seat-holds', payload),
};
