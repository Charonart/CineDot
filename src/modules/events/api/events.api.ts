import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { EventListResponseDTO, EventDTO } from '../dto/events.dto';

export const eventsApi = {
  getEvents: (params?: { category?: string; page?: number }): Promise<ApiResponse<EventListResponseDTO>> =>
    axiosClient.get('/events', { params }),

  getEvent: (slug: string): Promise<ApiResponse<EventDTO>> =>
    axiosClient.get(`/events/${slug}`),
};
