import { CineDotEvent, EventCategory } from '../types/events.types';
import { MOCK_CINEDOT_EVENTS } from '../mocks/mockEventsData';
import { APP_CONFIG } from '@/shared/constants/config';

export async function fetchEvents(category: EventCategory = 'ALL'): Promise<CineDotEvent[]> {
  await new Promise((res) => setTimeout(res, 200));
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  if (category === 'ALL') {
    return MOCK_CINEDOT_EVENTS;
  }
  return MOCK_CINEDOT_EVENTS.filter((evt) => evt.category === category);
}

export async function fetchFeaturedEvent(): Promise<CineDotEvent> {
  await new Promise((res) => setTimeout(res, 150));
  if (!APP_CONFIG.USE_MOCK_DATA) throw new Error('No featured event');
  const featured = MOCK_CINEDOT_EVENTS.find((e) => e.isFeatured);
  return featured || MOCK_CINEDOT_EVENTS[0];
}

export async function fetchEventByIdOrSlug(idOrSlug: string): Promise<CineDotEvent | null> {
  await new Promise((res) => setTimeout(res, 150));
  if (!APP_CONFIG.USE_MOCK_DATA) return null;
  return MOCK_CINEDOT_EVENTS.find((evt) => evt.id === idOrSlug || evt.slug === idOrSlug) || null;
}
