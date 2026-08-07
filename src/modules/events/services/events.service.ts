import { CineDotEvent, EventCategory } from '../types/events.types';
import { MOCK_CINEDOT_EVENTS } from '../mocks/mockEventsData';

export async function fetchEvents(category: EventCategory = 'ALL'): Promise<CineDotEvent[]> {
  await new Promise((res) => setTimeout(res, 150));
  if (category === 'ALL') {
    return MOCK_CINEDOT_EVENTS;
  }
  return MOCK_CINEDOT_EVENTS.filter((evt) => evt.category === category);
}

export async function fetchFeaturedEvent(): Promise<CineDotEvent> {
  await new Promise((res) => setTimeout(res, 100));
  const featured = MOCK_CINEDOT_EVENTS.find((evt) => evt.isFeatured);
  return featured || MOCK_CINEDOT_EVENTS[0];
}

export async function fetchEventByIdOrSlug(idOrSlug: string): Promise<CineDotEvent | null> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_CINEDOT_EVENTS.find((evt) => evt.id === idOrSlug || evt.slug === idOrSlug) || null;
}
