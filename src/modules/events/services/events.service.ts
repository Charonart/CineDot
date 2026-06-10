import { eventsApi } from '../api/events.api';
import { eventsMapper } from '../mappers/events.mapper';
import { Event, EventList } from '../types/events.type';
import { eventListResponseSchema, eventSchema } from '../schemas/events.schema';
import { logger } from '@lib/logger/logger';

export const eventsService = {
  getEvents: async (params?: { category?: string; page?: number }): Promise<EventList> => {
    try {
      const response = await eventsApi.getEvents(params);
      const validatedData = eventListResponseSchema.parse(response.data);
      return eventsMapper.toEventListModel(validatedData);
    } catch (error) {
      logger.error('[EventsService] getEvents failed:', error);
      throw new Error('FAILED_TO_LOAD_EVENTS');
    }
  },

  getEvent: async (slug: string): Promise<Event> => {
    try {
      const response = await eventsApi.getEvent(slug);
      const validatedData = eventSchema.parse(response.data);
      return eventsMapper.toEventModel(validatedData);
    } catch (error) {
      logger.error('[EventsService] getEvent failed:', error);
      throw new Error('FAILED_TO_LOAD_EVENT');
    }
  },
};
