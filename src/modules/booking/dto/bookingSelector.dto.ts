export interface BookingSelectorMovieDTO {
  id: string;
  slug: string;
  title: string;
  posterUrl: string;
  genres: { id: number; name: string }[];
  formatTags: string[];
  ageRating: string;
}

export interface BookingSelectorCinemaDTO {
  cinemaId: number;
  name: string;
  city: string;
}

export interface BookingSelectorShowtimeDTO {
  showtimeId: number;
  movie: { movieId: number; title: string };
  cinema: BookingSelectorCinemaDTO;
  room: { roomId: number; name: string; screenType: string };
  format: { language: string; subtitle: string | null; displayLabel: string };
  time: { startTime: string; endTime: string };
  pricing: { currency: string; basePrice: number };
  seatSummary: { totalSeats: number; soldSeats: number; holdingSeats: number; availableSeats: number; occupancy: number };
  status: string;
}
