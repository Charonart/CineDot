import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../services/events.service';
import { EventCategory } from '../types/events.type';

export const eventsKeys = {
  all: ['events'] as const,
  lists: () => [...eventsKeys.all, 'list'] as const,
  listByCategory: (category?: EventCategory) => [...eventsKeys.lists(), { category }] as const,
  detail: (slug: string) => [...eventsKeys.all, 'detail', slug] as const,
};

export const useEvents = (category?: EventCategory) => {
  return useQuery({
    queryKey: eventsKeys.listByCategory(category),
    queryFn: () => eventsService.getEvents({ category }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useEvent = (slug: string) => {
  return useQuery({
    queryKey: eventsKeys.detail(slug),
    queryFn: () => eventsService.getEvent(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
