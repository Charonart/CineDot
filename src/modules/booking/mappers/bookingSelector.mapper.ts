import { BookingSelectorMovieDTO, BookingSelectorShowtimeDTO } from '../dto/bookingSelector.dto';
import { BookingSelectorMovie, BookingSelectorShowtime } from '../types/bookingSelector.type';

export const bookingSelectorMapper = {
  toMovie(dto: BookingSelectorMovieDTO): BookingSelectorMovie {
    return {
      id: dto.id,
      slug: dto.slug,
      title: dto.title,
      posterUrl: dto.posterUrl,
      genres: dto.genres.map(g => ({ id: g.id, name: g.name })),
      formatTags: [...dto.formatTags],
      ageRating: dto.ageRating,
    };
  },

  toShowtime(dto: BookingSelectorShowtimeDTO): BookingSelectorShowtime {
    return {
      showtimeId: dto.showtimeId,
      movie: {
        movieId: dto.movie.movieId,
        title: dto.movie.title,
      },
      cinema: {
        cinemaId: dto.cinema.cinemaId,
        name: dto.cinema.name,
        city: dto.cinema.city,
      },
      room: {
        roomId: dto.room.roomId,
        name: dto.room.name,
        screenType: dto.room.screenType,
      },
      format: {
        language: dto.format.language,
        subtitle: dto.format.subtitle,
        displayLabel: dto.format.displayLabel,
      },
      time: {
        startTime: dto.time.startTime,
        endTime: dto.time.endTime,
      },
      pricing: {
        currency: dto.pricing.currency,
        basePrice: dto.pricing.basePrice,
      },
      seatSummary: {
        totalSeats: dto.seatSummary.totalSeats,
        soldSeats: dto.seatSummary.soldSeats,
        holdingSeats: dto.seatSummary.holdingSeats,
        availableSeats: dto.seatSummary.availableSeats,
        occupancy: dto.seatSummary.occupancy,
      },
      status: dto.status,
    };
  },
};
