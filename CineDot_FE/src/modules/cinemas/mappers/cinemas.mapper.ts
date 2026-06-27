import { CinemaDTO, CinemaListResponseDTO, PricingDTO } from '../dto/cinemas.dto';
import { Cinema, CinemaList, Pricing } from '../types/cinemas.type';
import { appRoutes } from '@/shared/routes/appRoutes';

export const cinemasMapper = {
  toCinemaModel: (dto: CinemaDTO): Cinema => ({
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    address: dto.address,
    city: dto.city,
    district: dto.district,
    phone: dto.phone,
    email: dto.email,
    imageUrl: dto.imageUrl,
    formats: dto.formats,
    amenities: dto.amenities,
    totalScreens: dto.totalScreens,
    totalSeats: dto.totalSeats,
    openingHours: dto.openingHours,
    mapUrl: dto.mapUrl,
    latitude: dto.latitude,
    longitude: dto.longitude,
    isActive: dto.isActive,
    isFeatured: dto.isFeatured,
    screens: dto.screens,
    href: appRoutes.cinemaDetail(dto.slug),
    showtimesHref: `${appRoutes.cinemaDetail(dto.slug)}#showtimes`,
  }),

  toCinemaListModel: (dto: CinemaListResponseDTO): CinemaList => ({
    items: (dto.results || []).map(cinemasMapper.toCinemaModel),
    currentPage: dto.page || 1,
    totalPages: dto.totalPages || 1,
    totalItems: dto.totalResults || 0,
    hasNext: (dto.page || 1) < (dto.totalPages || 1),
  }),

  toPricingModel: (dto: PricingDTO): Pricing => ({
    updatedAt: dto.updatedAt,
    note: dto.note,
    categories: dto.categories,
  }),
};
