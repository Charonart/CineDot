export interface AdminShowtimeGridItem {
  id: number;
  showtimeId: number;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  movieAgeRating: string;
  durationMinutes: number;
  cleaningBufferMinutes: number;
  cinemaId: number;
  cinemaName: string;
  roomId: number;
  roomName: string;
  roomType: string;
  showDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  startMinutes: number; // minutes from 00:00 (e.g. 570 for 09:30)
  endMinutes: number;   // minutes from 00:00 (e.g. 735 for 12:15)
  basePrice: number;
  bookedSeats: number;
  totalSeats: number;
  occupancyRate: number; // % (e.g. 85.5)
  isLocked: boolean; // True if bookedSeats > 0 (Hard Lock)
  status: 'OPEN' | 'CLOSED';
}

export interface AdminCinemaOption {
  id: number;
  name: string;
  slug?: string;
  provinceName?: string;
}

export interface AdminRoomOption {
  id: number;
  cinemaId: number;
  name: string;
  type: string;
  capacity: number;
}

export interface AdminMovieOption {
  id: number;
  title: string;
  posterUrl: string;
  duration: number;
  ageRating: string;
  genres: string[];
}
