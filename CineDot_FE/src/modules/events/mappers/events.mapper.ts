import { EventDTO, EventListResponseDTO } from '../dto/events.dto';
import { Event, EventList, EVENT_CATEGORY_LABELS } from '../types/events.type';
import { appRoutes } from '@/shared/routes/appRoutes';

export const eventsMapper = {
  toEventModel: (dto: EventDTO): Event => ({
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    description: dto.description,
    content: dto.content,
    category: dto.category,
    categoryLabel: EVENT_CATEGORY_LABELS[dto.category],
    imageUrl: dto.imageUrl,
    startDate: dto.startDate,
    endDate: dto.endDate,
    condition: dto.condition,
    ctaLabel: dto.ctaLabel,
    isActive: dto.isActive,
    isFeatured: dto.isFeatured,
    badge: dto.badge,
    location: dto.location,
    organizer: dto.organizer,
    highlights: dto.highlights,
    href: appRoutes.eventDetail(dto.slug),
  }),

  toEventListModel: (dto: EventListResponseDTO): EventList => ({
    items: (dto.results || []).map(eventsMapper.toEventModel),
    currentPage: dto.page || 1,
    totalPages: dto.totalPages || 1,
    totalItems: dto.totalResults || 0,
    hasNext: (dto.page || 1) < (dto.totalPages || 1),
  }),
};
