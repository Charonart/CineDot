import {
  BookingShowtimeDTO,
  SeatDTO,
  SeatHoldDTO,
  SeatMapDTO,
  SeatPricingDTO,
  SeatSelectionRulesDTO,
} from '../dto/booking.dto';
import {
  BookingShowtime,
  Seat,
  SeatHold,
  SeatMap,
  SeatPricing,
  SeatSelectionRules,
} from '../types/booking.type';

export const bookingMapper = {
  toShowtime: (dto: BookingShowtimeDTO): BookingShowtime => ({
    id: dto.id,
    movie: dto.movie,
    cinema: dto.cinema,
    room: dto.room,
    showDate: dto.showDate,
    showTime: dto.showTime,
    startsAt: dto.startsAt,
    endsAt: dto.endsAt,
    status: dto.status,
    salesStatus: dto.salesStatus,
    isOpenForSale: dto.status === 'open' && dto.salesStatus === 'on-sale',
  }),

  toSelectionRules: (dto: SeatSelectionRulesDTO): SeatSelectionRules => ({
    maxSeatsPerBooking: dto.maxSeatsPerBooking,
    allowMixedSeatTypes: dto.allowMixedSeatTypes,
    requireContiguousSeats: dto.requireContiguousSeats,
    preventSingleGap: dto.preventSingleGap,
  }),

  toPricing: (dto: SeatPricingDTO): SeatPricing => ({
    seatType: dto.seatType,
    label: dto.label,
    price: dto.price,
  }),

  toSeat: (dto: SeatDTO): Seat => ({
    id: dto.id,
    row: dto.row,
    number: dto.number,
    label: dto.label,
    type: dto.type,
    status: dto.status,
    price: dto.price,
  }),

  toSeatMap: (dto: SeatMapDTO): SeatMap => ({
    showtimeId: dto.showtimeId,
    currency: dto.currency,
    selectionRules: bookingMapper.toSelectionRules(dto.selectionRules),
    pricing: dto.pricing.map(bookingMapper.toPricing),
    layout: {
      rowOrder: dto.layout.rowOrder,
      aislesAfterSeatNumbers: dto.layout.aislesAfterSeatNumbers,
      screenLabel: dto.layout.screenLabel,
    },
    seats: dto.seats.map(bookingMapper.toSeat),
    serverTime: dto.serverTime,
  }),

  toSeatHold: (dto: SeatHoldDTO): SeatHold => ({
    holdId: dto.holdId,
    bookingId: dto.booking_id, // Map BE snake_case -> FE camelCase
    showtimeId: dto.showtimeId,
    seatIds: dto.seatIds,
    expiresAt: dto.expiresAt,
    serverTime: dto.serverTime,
  }),
};
