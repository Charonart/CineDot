import { BookingSeatSelectionPageClient } from '@/modules/booking/components';

interface BookingSeatsPageProps {
  searchParams: Promise<{
    showtimeId?: string;
  }>;
}

/**
 * /booking/seats?showtimeId=<id>
 *
 * Entry point for Scenario B (bypass) — the user arrives here with a locked
 * showtimeId from Quick Booking, Movie Detail, or the standalone /booking
 * selector page. The showtimeId is read from the URL query param so the
 * browser history is clean and no dynamic segment is needed.
 */
export default async function BookingSeatsPage({ searchParams }: BookingSeatsPageProps) {
  const { showtimeId } = await searchParams;
  return <BookingSeatSelectionPageClient showtimeId={showtimeId ?? ''} />;
}
