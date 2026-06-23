import { logger } from '@lib/logger/logger';
import { isRequestCanceled } from '@shared/utils/isRequestCanceled';
import { cinemasApi } from '@/modules/cinemas/api/cinemas.api';
import { showtimeApi } from '@/modules/showtime/api/showtime.api';
import { formatDateLabel, buildDateRange } from '@/modules/showtime/mappers/showtime.mapper';
import {
  QuickBookingCinema,
  QuickBookingDate,
  QuickBookingShowtime,
} from '../types/quick-booking.type';

export const quickBookingService = {
  getCinemas: async (movieId: string, signal?: AbortSignal): Promise<QuickBookingCinema[]> => {
    if (!movieId) return [];

    try {
      const response = await cinemasApi.getCinemas();
      const results = response.data?.results || [];
      return results.map((c: any) => ({
        id: String(c.id || c.slug),
        name: c.name,
        movieIds: [movieId], // mock to always associate with current movie
      }));
    } catch (error) {
      if (isRequestCanceled(error)) {
        throw error;
      }
      logger.error('[QuickBookingService] getCinemas failed:', error);
      throw new Error('FAILED_TO_LOAD_QUICK_BOOKING_CINEMAS');
    }
  },

  getDates: async (
    movieId: string,
    cinemaId: string,
    signal?: AbortSignal,
  ): Promise<QuickBookingDate[]> => {
    if (!movieId || !cinemaId) return [];

    try {
      // Fetch showtimes for this movie and cinema to derive dates
      const response = await showtimeApi.getShowtimes({ movieId, cinemaId, date: '' });
      const results = response.data?.results || [];

      const datesMap = new Map<string, string>();
      results.forEach((st: any) => {
        const dateStr = st.time.startTime.split('T')[0];
        if (!datesMap.has(dateStr)) {
          const labelObj = formatDateLabel(dateStr);
          const label = `${labelObj.dayName} - ${labelObj.dayDate}`;
          datesMap.set(dateStr, label);
        }
      });

      if (datesMap.size === 0) {
        const next7Days = buildDateRange(7);
        next7Days.forEach((dateStr) => {
          const labelObj = formatDateLabel(dateStr);
          const label = `${labelObj.dayName} - ${labelObj.dayDate}`;
          datesMap.set(dateStr, label);
        });
      }

      return Array.from(datesMap.entries()).map(([dateStr, label]) => ({
        id: dateStr,
        label,
        movieId,
        cinemaId,
      }));
    } catch (error) {
      if (isRequestCanceled(error)) {
        throw error;
      }
      logger.error('[QuickBookingService] getDates failed:', error);
      throw new Error('FAILED_TO_LOAD_QUICK_BOOKING_DATES');
    }
  },

  getShowtimes: async (
    movieId: string,
    cinemaId: string,
    date: string,
    signal?: AbortSignal,
  ): Promise<QuickBookingShowtime[]> => {
    if (!movieId || !cinemaId || !date) return [];

    try {
      const response = await showtimeApi.getShowtimes({ movieId, cinemaId, date });
      const results = response.data?.results || [];

      return results.map((st: any) => {
        const startTime = st.time.startTime;
        const timeStr = startTime.split('T')[1]?.slice(0, 5) || '10:00';
        const labelObj = formatDateLabel(date);
        const dateLabel = `${labelObj.dayName} - ${labelObj.dayDate}`;

        return {
          id: String(st.showtimeId),
          movieId,
          cinemaId,
          date,
          dateLabel,
          time: timeStr,
          roomName: st.room.name,
          screenType: st.room.screenType,
          availableSeats: st.seatSummary.availableSeats,
        };
      });
    } catch (error) {
      if (isRequestCanceled(error)) {
        throw error;
      }
      logger.error('[QuickBookingService] getShowtimes failed:', error);
      throw new Error('FAILED_TO_LOAD_QUICK_BOOKING_SHOWTIMES');
    }
  },
};
